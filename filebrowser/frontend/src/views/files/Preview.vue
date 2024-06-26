<template>
  <div
    id="previewer"
    @mousemove="toggleNavigation"
    @touchstart="startTouch"
    @mousedown="startDrag"
    @mouseup="endDrag"
    @touchend="endTouch"
  >
    <header-bar v-if="showNav">
      <action icon="close" :label="$t('buttons.close')" @action="close()" />
      <title>{{ name }}</title>
      <action
        :disabled="loading"
        v-if="isResizeEnabled && req.type === 'image'"
        :icon="fullSize ? 'photo_size_select_large' : 'hd'"
        @action="toggleSize"
      />

      <template #actions>
        <action
          :disabled="loading"
          v-if="user.perm.rename"
          icon="mode_edit"
          :label="$t('buttons.rename')"
          show="rename"
        />
        <action
          :disabled="loading"
          v-if="user.perm.delete"
          icon="delete"
          :label="$t('buttons.delete')"
          @action="deleteFile"
          id="delete-button"
        />
        <action
          :disabled="loading"
          v-if="user.perm.download"
          icon="file_download"
          :label="$t('buttons.download')"
          @action="download"
        />
        <action
          :disabled="loading"
          icon="info"
          :label="$t('buttons.info')"
          show="info"
        />
      </template>
    </header-bar>

    <div class="loading delayed" v-if="loading">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <template v-else>
      <div class="preview">
        <transition
          appear
          :enter-active-class="animateIn"
          :leave-active-class="animateOut"
          :appear-active-class="animateIn"
        >
          <ExtendedImage
            v-if="req.type == 'image'"
            class="switchAnimation"
            :key="raw"
            :src="raw"
          ></ExtendedImage>
          <audio
            class="switchAnimation"
            :key="raw"
            v-if="req.type == 'audio'"
            ref="player"
            :src="raw"
            controls
            :autoplay="autoPlay"
            @play="autoPlay = true"
          ></audio>
          <video
            class="switchAnimation"
            :key="raw"
            v-if="req.type == 'video'"
            ref="player"
            :src="raw"
            controls
            :autoplay="autoPlay"
            @play="autoPlay = true"
          >
            <track
              kind="captions"
              v-for="(sub, index) in subtitles"
              :key="index"
              :src="sub"
              :label="'Subtitle ' + index"
              :default="index === 0"
            />
            Sorry, your browser doesn't support embedded videos, but don't
            worry, you can <a :href="downloadUrl">download it</a>
            and watch it with your favorite video player!
          </video>

          <object
            class="switchAnimation pdf"
            :key="raw"
            v-if="req.extension.toLowerCase() == '.pdf'"
            :data="raw"
          ></object>

          <div
            v-if="req.type == 'blob' && req.extension.toLowerCase() !== '.pdf'"
            class="info switchAnimation"
            :key="raw"
          >
            <div class="title">
              <i class="material-icons">feedback</i>
              {{ $t("files.noPreview") }}
            </div>
            <div>
              <a
                target="_blank"
                :href="downloadUrl"
                class="button button--flat"
              >
                <div>
                  <i class="material-icons">file_download</i
                  >{{ $t("buttons.download") }}
                </div>
              </a>
              <a
                target="_blank"
                :href="raw"
                class="button button--flat"
                v-if="!req.isDir"
              >
                <div>
                  <i class="material-icons">open_in_new</i
                  >{{ $t("buttons.openFile") }}
                </div>
              </a>
            </div>
          </div>
        </transition>
      </div>
    </template>

    <button
      @click="prev"
      @mouseover="hoverNav = true"
      @mouseleave="hoverNav = false"
      :class="{ hidden: !hasPrevious || !showNav }"
      :aria-label="$t('buttons.previous')"
      :title="$t('buttons.previous')"
    >
      <i class="material-icons">chevron_left</i>
    </button>
    <button
      @click="next"
      @mouseover="hoverNav = true"
      @mouseleave="hoverNav = false"
      :class="{ hidden: !hasNext || !showNav }"
      :aria-label="$t('buttons.next')"
      :title="$t('buttons.next')"
    >
      <i class="material-icons">chevron_right</i>
    </button>
    <link rel="prefetch" :href="previousRaw" />
    <link rel="prefetch" :href="nextRaw" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { files as api } from "@/api";
import { resizePreview } from "@/utils/constants";
import url from "@/utils/url";
import throttle from "lodash.throttle";
import HeaderBar from "@/components/header/HeaderBar.vue";
import Action from "@/components/header/Action.vue";
import ExtendedImage from "@/components/files/ExtendedImage.vue";

import "animate.css";
const mediaTypes = ["image", "video", "audio", "blob"];

export default {
  name: "preview",
  components: {
    HeaderBar,
    Action,
    ExtendedImage,
  },
  data: function () {
    return {
      previousLink: "",
      nextLink: "",
      listing: null,
      name: "",
      fullSize: false,
      showNav: true,
      navTimeout: null,
      hoverNav: false,
      autoPlay: false,
      previousRaw: "",
      nextRaw: "",
      animateIn: "animate__fadeIn",
      animateOut: "",
      startTime: null,
      startX: null,
      startY: null,
      timeDiff: null,
      distanceX: null,
      distanceY: null,
    };
  },
  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),
    ...mapGetters(["currentPrompt"]),
    hasPrevious() {
      return this.previousLink !== "";
    },
    hasNext() {
      return this.nextLink !== "";
    },
    downloadUrl() {
      return api.getDownloadURL(this.req);
    },
    raw() {
      if (this.req.type === "image" && !this.fullSize) {
        return api.getPreviewURL(this.req, "big");
      }

      return api.getDownloadURL(this.req, true);
    },
    showMore() {
      return this.currentPrompt?.prompt === "more";
    },
    isResizeEnabled() {
      return resizePreview;
    },
    subtitles() {
      if (this.req.subtitles) {
        return api.getSubtitlesURL(this.req);
      }
      return [];
    },
  },
  watch: {
    $route: function () {
      this.updatePreview();
      this.toggleNavigation();
    },
  },
  async mounted() {
    window.addEventListener("keydown", this.key);
    this.listing = this.oldReq.items;
    this.updatePreview();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
  },
  methods: {
    startDrag(event) {
      event.preventDefault();
      this.startTime = new Date().getTime();
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    endDrag(event) {
      event.preventDefault();
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.clientX - this.startX;
      if (this.timeDiff < 300 && Math.abs(this.distanceX) > 100) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      this.distanceY = event.clientY - this.startY;
      if (this.timeDiff < 300 && this.distanceY > 100) {
        this.checkNav(this.distanceY, "CLOSE");
        return;
      }
    },
    startTouch(event) {
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
      this.toggleNavigation();
    },
    endTouch(event) {
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.changedTouches[0].clientX - this.startX;
      if (this.timeDiff < 300 && Math.abs(this.distanceX) > 30) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      this.distanceY = event.changedTouches[0].clientY - this.startY;
      if (this.timeDiff < 300 && this.distanceY > 20) {
        this.checkNav(this.distanceY, "CLOSE");
        return;
      }
    },
    checkNav(x, mode) {
      if (x > 0 && this.hasPrevious && mode == "SWITCHIMG") {
        this.prev();
        return;
      } else if (x < 0 && this.hasNext && mode == "SWITCHIMG") {
        this.next();
        return;
      } else if (x > 0 && mode == "CLOSE") {
        this.close();
        return;
      }
    },
    deleteFile() {
      this.$store.commit("showHover", {
        prompt: "delete",
        confirm: () => {
          this.listing = this.listing.filter((item) => item.name !== this.name);

          if (this.hasNext) {
            this.next();
          } else if (!this.hasPrevious && !this.hasNext) {
            this.close();
          } else {
            this.prev();
          }
        },
      });
    },
    prev() {
      this.hoverNav = false;
      this.animateIn = "animate__fadeInLeft";
      this.animateOut = "animate__fadeOutRight";
      this.$nextTick(() => {
        this.$router.replace({ path: this.previousLink });
      });
    },
    next() {
      this.hoverNav = false;
      this.animateIn = "animate__fadeInRight";
      this.animateOut = "animate__fadeOutLeft";
      this.$nextTick(() => {
        this.$router.replace({ path: this.nextLink });
      });
    },
    key(event) {
      if (this.currentPrompt !== null) {
        return;
      }

      if (event.which === 13 || event.which === 39) {
        // right arrow
        if (this.hasNext) this.next();
      } else if (event.which === 37) {
        // left arrow
        if (this.hasPrevious) this.prev();
      } else if (event.which === 27) {
        // esc
        this.close();
      }
    },
    async updatePreview() {
      if (
        this.$refs.player &&
        this.$refs.player.paused &&
        !this.$refs.player.ended
      ) {
        this.autoPlay = false;
      }

      let dirs = this.$route.fullPath.split("/");
      this.name = decodeURIComponent(dirs[dirs.length - 1]);

      if (!this.listing) {
        try {
          const path = url.removeLastDir(this.$route.path);
          const res = await api.fetch(path);
          this.listing = res.items;
        } catch (e) {
          this.$showError(e);
        }
      }

      this.previousLink = "";
      this.nextLink = "";

      for (let i = 0; i < this.listing.length; i++) {
        if (this.listing[i].name !== this.name) {
          continue;
        }

        for (let j = i - 1; j >= 0; j--) {
          if (mediaTypes.includes(this.listing[j].type)) {
            this.previousLink = this.listing[j].url;
            this.previousRaw = this.prefetchUrl(this.listing[j]);
            break;
          }
        }
        for (let j = i + 1; j < this.listing.length; j++) {
          if (mediaTypes.includes(this.listing[j].type)) {
            this.nextLink = this.listing[j].url;
            this.nextRaw = this.prefetchUrl(this.listing[j]);
            break;
          }
        }

        return;
      }
    },
    prefetchUrl(item) {
      if (item.type !== "image") {
        return "";
      }

      return this.fullSize
        ? api.getDownloadURL(item, true)
        : api.getPreviewURL(item, "big");
    },
    openMore() {
      this.$store.commit("showHover", "more");
    },
    resetPrompts() {
      this.$store.commit("closeHovers");
    },
    toggleSize() {
      this.fullSize = !this.fullSize;
    },
    toggleNavigation: throttle(function () {
      this.showNav = true;

      if (this.navTimeout) {
        clearTimeout(this.navTimeout);
      }

      this.navTimeout = setTimeout(() => {
        this.showNav = false || this.hoverNav;
        this.navTimeout = null;
      }, 1500);
    }, 500),
    close() {
      this.$store.commit("updateRequest", {});
      history.back();
    },
    download() {
      window.open(this.downloadUrl);
    },
  },
};
</script>
<style>
.switchAnimation {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  animation-duration: 0.9s;
}
</style>
