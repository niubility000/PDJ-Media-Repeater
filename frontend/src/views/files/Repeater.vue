<template>
  <div id="repeater" @touchmove.prevent.stop @wheel.prevent.stop>
    <div class="loading delayed" v-if="loading">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <template v-else>
      <header-bar v-if="srtSubtitles">
        <action
          style="color: blue"
          icon="close"
          :label="$t('buttons.close')"
          @action="close()"
        />
        <title
          style="flex-grow: 1; white-space: nowrap"
          :style="{ opacity: !isMobile ? 1 : 0 }"
        >
          {{ req.name.replace(".srt", "") }}
        </title>
        <button
          v-if="srtSubtitles && isSingle"
          :disabled="loading"
          class="action"
          @click="switchIsFav"
          title="Fav"
        >
          <i :style="{ color: isFav ? 'red' : 'blue' }" class="material-icons"
            >grade</i
          >
        </button>

        <input
          style="text-align: right; border: none; padding: 0; margin: 0"
          class="input input--headSubject"
          type="text"
          v-model.number="sentenceIndex"
        />
        <span
          class="headSubject"
          style="
            text-align: right;
            border: none;
            padding: 0;
            margin: 0 0.5em 0 0;
          "
          >/{{ srtSubtitles.length }}</span
        >

        <button
          v-if="isSingle"
          :disabled="loading || favList.length == 0"
          class="action"
          @click="playFavList"
          title="Play Favorite List"
        >
          <i :style="favListStatus" class="material-icons">folder_special</i>
        </button>

        <button
          v-if="isSingle"
          :disabled="loading"
          class="action"
          @click="onSetting"
          title="Settings"
        >
          <i style="color: blue" class="material-icons">settings</i>
        </button>

        <button
          :disabled="loading"
          class="action"
          @click="switchSubtitle"
          title="Switch Subtitle Language"
        >
          <i :style="subSwitch" class="material-icons">closed_caption</i>
        </button>

        <button
          :disabled="loading || isFavOnPlay"
          class="action"
          @click="onSingle"
          :title="isSingle ? 'Single Sentence Repetition Mode' : 'Regular Mode'"
        >
          <i :style="playMode" class="material-icons">repeat_one</i>
        </button>
      </header-bar>
      <div id="settingBox" v-if="srtSubtitles && isSetting">
        <div
          v-if="srtSubtitles && isSetting"
          style="display: inline-block; left: 0.5em"
        >
          <span class="subject">Sentence Repeat Times: </span>
          <input
            class="input input--repeater"
            type="text"
            v-model.number="repeatTimes"
          />
        </div>
        <div v-if="srtSubtitles && isSetting" style="display: inline-block">
          <span class="subject">Interval: </span>
          <input
            class="input input--repeater"
            type="text"
            v-model.number="interval"
          />
        </div>
        <div v-if="srtSubtitles && isSetting" style="display: inline-block">
          <span class="subject">Timestamp Move (in ms): </span>
          <input
            class="input input--repeater"
            type="text"
            v-model.number="timeStampChange"
          />
        </div>
        <div v-if="srtSubtitles && isSetting" style="display: inline-block">
          <span class="subject">Speed: </span>
          <input
            class="input input--repeater"
            type="text"
            v-model.number="currentSpeed"
          />
        </div>
        <div v-if="srtSubtitles && isSetting" style="display: inline-block">
          <p style="color: white">
            <input type="checkbox" v-model="autoPlayNext" />
            Autoplay Next Sentence
          </p>
        </div>
        <div
          v-if="srtSubtitles && isSetting && !isMobile"
          style="left: 1em; color: white"
        >
          <p>INSTRUCTIONS</p>
          <p>
            Click top-right button: switch Playback Mode between "Single
            Sentence Repetition" and "Regular"
          </p>
          <p>Click (down arrow key on keyboard): replay current sentence</p>
          <p>DoubleClick (up arrow key on keyboard): pause</p>
          <p>Swipe left (right arrow key on keyboard): jump to next sentence</p>
          <p>Swipe right (left arrow key on keyboard): jump to last sentence</p>
          <p>Swipe down: close this player</p>
        </div>
      </div>
      <div
        class="repeater"
        @mousedown="startDrag"
        @mouseup="endDrag"
        @touchstart="startTouch"
        @touchend="endTouch"
        style="display: flex"
      >
        <video
          style="max-height: 70%; max-width: 100%"
          v-if="isMediaType == 2"
          ref="player"
          :src="raw"
          :autoplay="autoPlay"
          :controls="!isSingle"
          @loadedmetadata="readyStatus"
          x5-video-player-type="h5-page"
          webkit-playsinline="true"
          playsinline="true"
          x5-video-orientation="landscape|portrait"
          @play="autoPlay = true"
        ></video>
        <p v-if="!isReadyToPlay && isMediaType > 0" style="color: white">
          Loading Media...
        </p>
        <span
          v-if="srtSubtitles && isMediaType == 2 && isReadyToPlay"
          style="
            flex-grow: 1;
            color: yellow;
            overflow-wrap: break-word;
            width: 100%;
            font-size: 1.5em;
            margin: 0;
          "
        >
          <p v-if="subtitleLang !== 'line2'">
            {{
              !isEmpty
                ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[0]
                : "   "
            }}
          </p>
          <p v-if="subtitleLang !== 'line1'">
            {{
              !isEmpty
                ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[1]
                : "   "
            }}
          </p>
        </span>

        <div
          v-if="isMediaType == 1"
          style="
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <span
            v-if="srtSubtitles && isReadyToPlay"
            style="
              color: yellow;
              overflow-wrap: break-word;
              width: 100%;
              font-size: 1.5em;
              margin: 0 0.5em 0 0.5em;
            "
          >
            <p v-if="subtitleLang !== 'line2'">
              {{
                !isEmpty
                  ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[0]
                  : "   "
              }}
            </p>
            <p v-if="subtitleLang !== 'line1'">
              {{
                !isEmpty
                  ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[1]
                  : "   "
              }}
            </p>
          </span>
        </div>
        <div
          v-if="isMediaType == 1"
          style="
            height: 20%;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <audio
            v-if="isMediaType == 1"
            ref="player"
            :src="raw"
            :controls="!isSingle"
            controlslist="noplaybackrate"
            :autoplay="autoPlay"
            @play="autoPlay = true"
            @loadedmetadata="readyStatus"
          ></audio>
        </div>
        <p v-if="isMediaType == 0" style="color: red">
          Can't find {{ req.name.replace(".srt", ".mp4/.mp3") }} in current
          folder, or the .srt file is incorrect.
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { files as api } from "@/api";
import url from "@/utils/url";
import HeaderBar from "@/components/header/HeaderBar.vue";
import Action from "@/components/header/Action.vue";

export default {
  name: "repeater",
  components: {
    HeaderBar,
    Action,
  },
  data: function () {
    return {
      sentenceIndex: 1,
      startTime: null,
      startX: null,
      startY: null,
      timeDiff: null,
      distanceX: null,
      distanceY: null,
      repeatTimes: 3,
      interval: 3,
      playCount: 0,
      intervalId: null,
      autoPlayNext: true,
      timeStampChange: -210,
      currentSpeed: 1.0,
      listing: null,
      isSetting: false,
      isEmpty: false,
      isSingle: true,
      favList: [],
      isFav: false,
      isFavOnPlay: false,
      hasFavoriteTxt: true,
      isReadyToPlay: false,
      subtitleLang: "both",
    };
  },
  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),
    ...mapGetters(["currentPrompt"]),
    isMobile() {
      return window.innerWidth < 736;
    },
    favListStatus() {
      if (this.currentFileFavList.length == 0) {
        return { color: "grey" };
      } else if (this.isFavOnPlay) {
        return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },
    subSwitch() {
      if (this.subtitleLang == "both") {
        return { color: "blue" };
      } else if (this.subtitleLang == "line1") {
        return { color: "black" };
      } else {
        return { color: "red" };
      }
    },
    playMode() {
      if (this.isFavOnPlay) {
        return { color: "grey" };
      } else if (this.isSingle) {
        return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },
    srtSubtitles() {
      if (!this.isFavOnPlay) {
        var subtitles = [];
        var textSubtitles = this.req.content.split("\r\n\r\n");

        for (var i = 0; i < textSubtitles.length; ++i) {
          var textSubtitle = textSubtitles[i].split("\n");

          if (textSubtitle.length >= 2) {
            var sn = textSubtitle[0];
            var startTimeUnformat = textSubtitle[1].split(" --> ")[0];
            var startHH = startTimeUnformat.split(":")[0];
            var startMM = startTimeUnformat.split(":")[1];
            var startSS = startTimeUnformat.split(":")[2];
            var startMS = startTimeUnformat.split(",")[1];
            var startTime =
              parseFloat(startHH) * 3600 +
              parseFloat(startMM) * 60 +
              parseFloat(startSS) +
              (parseFloat(startMS) + this.timeStampChange) / 1000;

            var endTimeUnformat = textSubtitle[1].split(" --> ")[1];
            var endHH = endTimeUnformat.split(":")[0];
            var endMM = endTimeUnformat.split(":")[1];
            var endSS = endTimeUnformat.split(":")[2];
            var endMS = endTimeUnformat.split(",")[1];
            var endTime =
              parseFloat(endHH) * 3600 +
              parseFloat(endMM) * 60 +
              parseFloat(endSS) +
              (parseFloat(endMS) + this.timeStampChange) / 1000;
            var content = textSubtitle[2];
            if (textSubtitle.length > 2) {
              for (var j = 3; j < textSubtitle.length; j++) {
                content += "\r\n" + textSubtitle[j];
              }
            }
            var subtitle = {
              sn: sn,
              startTime: startTime,
              endTime: endTime,
              content: content,
            };
            subtitles.push(subtitle);
          }
        }
        return subtitles;
      } else {
        return this.currentFileFavList;
      }
    },

    isMediaType() {
      if (this.listing) {
        for (var i = 0; i < this.listing.length; ++i) {
          if (this.listing[i].name == this.req.name.replace(".srt", ".mp4")) {
            return 2;
          } else if (
            this.listing[i].name == this.req.name.replace(".srt", ".mp3")
          ) {
            return 1;
          }
        }
      }
      return 0;
    },

    raw() {
      let srtUrl = api.getDownloadURL(this.req, true);
      if (srtUrl && this.isMediaType == 1) {
        return srtUrl.replace(".srt", ".mp3");
      } else if (srtUrl && this.isMediaType == 2) {
        return srtUrl.replace(".srt", ".mp4");
      } else return "";
    },
    currentFileFavList() {
      let reqUrl = this.req.url.replace("/files/", "").replace("srt", "");
      return this.favList.filter(function (item) {
        return item.rawPath.includes(reqUrl);
      });
    },
  },
  watch: {
    $route: function () {
      this.updatePreview();
    },
    sentenceIndex: function () {
      if (this.isFavOnPlay) {
        this.isFav = true;
        return;
      }
      if (this.currentFileFavList) {
        for (var i = 0; i < this.currentFileFavList.length; ++i) {
          if (
            this.currentFileFavList[i].startTime ==
            this.srtSubtitles[this.sentenceIndex - 1].startTime
          ) {
            this.isFav = true;
            return;
          } else if (i == this.currentFileFavList.length - 1) {
            this.isFav = false;
          }
        }
      } else {
        this.isFav = false;
      }
    },
  },
  async mounted() {
    window.addEventListener("keydown", this.key);
    this.listing = this.oldReq.items;
    this.updatePreview();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
    this.$refs.player.removeEventListener("timeupdate", this.syncSub);
    this.$refs.player.removeEventListener("timeupdate", this.sessionEnd, false);
  },
  methods: {
    readyStatus() {
      this.isReadyToPlay = true;
    },

    switchSubtitle() {
      if (this.subtitleLang == "both") {
        this.subtitleLang = "line1";
      } else if (this.subtitleLang == "line1") {
        this.subtitleLang = "line2";
      } else {
        this.subtitleLang = "both";
      }
    },

    clearUp() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.playCount = 0;
      }
      if (this.$refs.player && this.$refs.player.removeEventListener) {
        this.$refs.player.removeEventListener(
          "timeupdate",
          this.sessionEnd,
          false
        );
        this.$refs.player.removeEventListener("timeupdate", this.syncSub);
      }
    },

    playFavList() {
      if (!this.isFavOnPlay) {
        window.sessionStorage.setItem("lastPosition", this.sentenceIndex);
      }
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.isFavOnPlay) {
        this.clearUp();
        this.sentenceIndex = 1;
        this.loopPlay();
      } else {
        this.clearUp();
        this.sentenceIndex = Number(
          window.sessionStorage.getItem("lastPosition")
        );
        this.loopPlay();
      }
    },

    switchIsFav() {
      this.isFav = !this.isFav;
      if (this.isFav) {
        var fav = {
          rawPath: this.raw.split("?")[0].split("/raw/")[1],
          startTime: this.srtSubtitles[this.sentenceIndex - 1].startTime,
          endTime: this.srtSubtitles[this.sentenceIndex - 1].endTime,
          content: this.srtSubtitles[this.sentenceIndex - 1].content,
        };
        this.favList.push(fav);
        this.save();
      } else {
        var nowStartTime = this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.favList = this.favList.filter(function (item) {
          return item.startTime !== nowStartTime;
        });
        this.save();
        if (this.isFavOnPlay) {
          if (this.srtSubtitles.length < 1) {
            this.isFavOnPlay = false;
            return;
          }
          if (this.sentenceIndex > this.srtSubtitles.length) {
            this.sentenceIndex = this.sentenceIndex - 1;
          }
          this.isFav = true;
          this.clearUp();
          this.loopPlay();
        }
      }
    },

    onSingle() {
      this.isSingle = !this.isSingle;
      if (!this.isSingle) {
        this.clearUp();
        window.sessionStorage.setItem(
          "singlePlayLastPosition",
          this.sentenceIndex
        );
        this.$refs.player.currentTime = 0;
        this.playFull();
      }
      if (this.isSingle) {
        this.isEmpty = false;
        this.sentenceIndex = Number(
          window.sessionStorage.getItem("singlePlayLastPosition")
        );
        this.$refs.player.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.loopPlay();
      }
    },
    onSetting() {
      this.isSetting = !this.isSetting;
      return;
    },
    click: function () {
      setTimeout(() => {
        this.touches = 0;
      }, 300);

      this.touches++;
      if (this.touches > 1) {
        //double click
        this.$refs.player.pause(); //stop play
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.playCount = 0;
        }
        return;
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.playCount = 0;
      }
      if (this.isSingle) {
        this.loopPlay();
        return;
      } else {
        this.$refs.player.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.$refs.player.play();
      }
    },

    startDrag(event) {
      event.preventDefault();
      this.isSetting = false;
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
      this.click();
    },
    startTouch(event) {
      event.preventDefault();
      this.isSetting = false;
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    endTouch(event) {
      event.preventDefault();
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
      this.click();
    },
    checkNav(x, mode) {
      this.clearUp();
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex > 1) {
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle) {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.loopPlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.playFull();
        }
        return;
      } else if (
        x < 0 &&
        mode == "SWITCHIMG" &&
        this.sentenceIndex < this.srtSubtitles.length
      ) {
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle) {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.loopPlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.playFull();
        }
        return;
      } else if (x > 0 && mode == "CLOSE") {
        this.close();
        return;
      }
    },

    playFull() {
      this.isSingle = false;
      this.clearUp();
      const media = this.$refs.player;
      if (media) {
        media.playbackRate = 1.0;
        media
          .play()
          .then(() => {
            media.addEventListener("timeupdate", this.syncSub);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    syncSub() {
      const media = this.$refs.player;
      for (var i = 0; i < this.srtSubtitles.length; ++i) {
        if (
          media.currentTime >= this.srtSubtitles[i].startTime &&
          media.currentTime <= this.srtSubtitles[i].endTime
        ) {
          this.sentenceIndex = i + 1;
          this.isEmpty = false;
          return;
        } else if (
          i > 0 &&
          i < this.srtSubtitles.length - 1 &&
          media.currentTime < this.srtSubtitles[i].startTime &&
          media.currentTime > this.srtSubtitles[i - 1].endTime
        ) {
          this.sentenceIndex = i + 1;
        } else if (media.currentTime < this.srtSubtitles[0].startTime) {
          this.sentenceIndex = 1;
        } else if (
          i == this.srtSubtitles.length - 1 &&
          media.currentTime > this.srtSubtitles[i].endTime
        ) {
          this.sentenceIndex = i + 1;
        }

        if (i == this.srtSubtitles.length - 1) {
          this.isEmpty = true;
        }
      }
    },

    playSection() {
      const media = this.$refs.player;
      if (media && media.removeEventListener) {
        media.removeEventListener("timeupdate", this.sessionEnd, false);
        media.removeEventListener("timeupdate", this.syncSub);
      }

      if (media) {
        let realIndex = this.sentenceIndex - 1;
        media.currentTime = this.srtSubtitles[realIndex].startTime;
        media.playbackRate = this.currentSpeed;
        media
          .play()
          .then(() => {
            media.addEventListener("timeupdate", this.sessionEnd, false);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },

    sessionEnd() {
      const media = this.$refs.player;
      let realIndex = this.sentenceIndex - 1;
      if (media.currentTime >= this.srtSubtitles[realIndex].endTime) {
        media.pause();
      }
    },

    loopPlay() {
      this.isSingle = true;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.playCount = 0;
      }
      this.playSection();
      if (this.repeatTimes > 1) {
        this.intervalId = setInterval(
          () => {
            this.playSection();
            this.playCount++;
            if (this.playCount >= this.repeatTimes - 1) {
              // loop play end when repeatTime>1
              clearInterval(this.intervalId);
              this.playCount = 0;
              if (this.autoPlayNext) {
                setTimeout(
                  () => {
                    this.sentenceIndex = this.sentenceIndex + 1;
                    this.loopPlay();
                  },
                  (this.interval +
                    (this.srtSubtitles[this.sentenceIndex - 1].endTime -
                      this.srtSubtitles[this.sentenceIndex - 1].startTime) /
                      this.currentSpeed) *
                    1000
                );
              }
            }
          },
          (this.interval +
            (this.srtSubtitles[this.sentenceIndex - 1].endTime -
              this.srtSubtitles[this.sentenceIndex - 1].startTime) /
              this.currentSpeed) *
            1000
        );
      }
      if (this.repeatTimes == 1 && this.autoPlayNext) {
        setTimeout(
          () => {
            this.sentenceIndex = this.sentenceIndex + 1;
            this.loopPlay();
          },
          (this.interval +
            (this.srtSubtitles[this.sentenceIndex - 1].endTime -
              this.srtSubtitles[this.sentenceIndex - 1].startTime) /
              this.currentSpeed) *
            1000
        );
      }
    },

    async save() {
      let favContent = JSON.stringify(this.favList);
      const path = url.removeLastDir(this.$route.path);
      try {
        if (!this.hasFavoriteTxt) {
          await api.post(path + "/favorite.txt", favContent);
          this.hasFavoriteTxt = true;
        } else {
          await api.put(path + "/favorite.txt", favContent);
        }
      } catch (error) {
        console.log(error);
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
      try {
        const pathf = url.removeLastDir(this.$route.path);
        var favAll = await api.fetch(pathf + "/favorite.txt");
        this.favList = JSON.parse(favAll.content);
      } catch (e) {
        this.hasFavoriteTxt = false;
        this.favList = [];
      }

      if (this.currentFileFavList) {
        for (var i = 0; i < this.currentFileFavList.length; ++i) {
          if (
            this.currentFileFavList[i].startTime ==
            this.srtSubtitles[this.sentenceIndex - 1].startTime
          ) {
            this.isFav = true;
            return;
          }
        }
      }
    },

    key(event) {
      if (this.currentPrompt !== null) {
        return;
      }
      this.clearUp();
      if (event.which === 39 && this.sentenceIndex < this.srtSubtitles.length) {
        // right arrow
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle) {
          this.loopPlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.playFull();
        }
      } else if (event.which === 37 && this.sentenceIndex > 1) {
        // left arrow
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle) {
          this.loopPlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.playFull();
        }
      } else if (event.which === 38) {
        // up arrow
        this.$refs.player.pause(); //stop play
      } else if (event.which === 40) {
        // down arrow
        if (this.isSingle) {
          this.loopPlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.playFull();
        }
      } else if (event.which === 27) {
        // esc
        this.close();
      }
    },

    resetPrompts() {
      this.$store.commit("closeHovers");
    },
    close() {
      this.$store.commit("updateRequest", {});

      history.back();
    },
  },
};
</script>
<style>
/* Repeater */
#repeater {
  background-color: rgba(0, 0, 0, 0.99);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: hidden;
}
#repeater .repeater {
  padding-top: 8em;
  text-align: center;
  height: 100%;
  margin: 0 1em 0 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
#repeater .repeater audio {
  width: 100%;
  left: 0;
  right: 0;
  margin: auto;
}
#repeater .spinner {
  text-align: center;
  position: fixed;
  top: calc(50% + 1.85em);
  left: 50%;
  transform: translate(-50%, -50%);
}
#repeater .spinner > div {
  width: 18px;
  height: 18px;
  background-color: white;
}
input.input.input--repeater {
  margin-bottom: 0.5em;
  display: inline;
  width: 5.5em;
}
span.subject {
  margin-bottom: 0.5em;
  display: inline-block;
  width: 15em;
  color: white;
}

span.headSubject {
  display: inline;
  color: black;
}
input.input.input--headSubject {
  display: inline;
  color: blue;
  width: 2.2em;
}

header {
  padding: 0.5em 1em 0.5em 1em;
  background: transparent;
}

#settingBox {
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  top: 4em;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 60%;
  max-height: 90%;
  z-index: 9999;
  padding-top: 1em;
  background: grey;
  border-radius: 10px;
}

@media (max-width: 736px) {
  #repeater .repeater {
    margin: 0;
  }
  #settingBox {
    max-width: 95%;
  }
  span.subject {
    width: 13em;
  }
  input.input.input--repeater {
    margin-bottom: 0.5em;
    display: inline;
    width: 3.5em;
    padding: 0;
    margin: 0;
  }
}
</style>
