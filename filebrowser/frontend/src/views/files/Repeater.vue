<template>
  <div id="repeater">
    <div class="loading delayed" v-if="loading">
      <div class="spinner">
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
      </div>
    </div>
    <template v-else>
      <header-bar v-if="srtSubtitles" style="padding: 0.5em">
        <action
          style="color: blue"
          icon="close"
          :label="$t('buttons.close')"
          @action="close()"
        />
        <title style="flex-grow: 1; white-space: nowrap" v-if="!isMobile">
          {{ req.name.replace(".srt", "") }}
        </title>
        <span>
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
        </span>
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
          <i
            :style="{ color: isSetting ? 'red' : 'blue' }"
            class="material-icons"
            >settings</i
          >
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
      <div id="settingBoxContainer" v-if="srtSubtitles && isSetting">
        <div id="settingBox">
          <p style="color: blue">SETTINGS</p>
          <div style="display: block">
            <span class="subject">Sentence Playback Times: </span>
            <input
              class="input input--repeater"
              type="number"
              min="1"
              max="1000"
              v-model="repeatTimes"
            />
          </div>
          <div style="display: block">
            <span class="subject">Interval (in second): </span>
            <input
              class="input input--repeater"
              type="text"
              v-model.number="interval"
            />
          </div>
          <div style="display: block">
            <span class="subject">Timestamp Move (in ms): </span>
            <input
              class="input input--repeater"
              type="text"
              v-model.number="timeStampChange"
            />
          </div>
          <div style="display: block">
            <span class="subject">Speed Each Time (default:1): </span>
            <input
              class="input input--repeater"
              type="text"
              v-model="currentSpeed"
            />
          </div>
          <div style="display: block">
            <p style="color: white">
              <input type="checkbox" v-model="autoPlayNext" />
              Autoplay Next Sentence
            </p>
            <p style="color: white">
              <input type="checkbox" v-model="isUtterSecLine" />
              Utter Subtitle's Translation Line with TTS (<input
                type="checkbox"
                v-model="isAutoDetectLang"
              />
              auto-detect)
            </p>
            <div v-if="isUtterSecLine" style="display: block">
              <span class="subject"> Language Used In translation Line: </span>
              <input
                class="input input--repeater"
                type="text"
                v-model="langInSecLine"
              />
            </div>
            <div v-if="isUtterSecLine" style="display: block">
              <span class="subject">
                Line Number Of Translation In Subtitle:
              </span>
              <input
                class="input input--repeater"
                type="number"
                min="1"
                max="2"
                v-model="lineNumOfTrans"
              />
            </div>
            <div v-if="isUtterSecLine" style="display: block">
              <span class="subject"> Pause time (in second): </span>
              <input
                class="input input--repeater"
                type="number"
                min="0"
                max="1000"
                v-model="pauseTimeSecLine"
              />
            </div>
            <div v-if="isUtterSecLine" style="display: block">
              <span class="subject"> Speed of Uttering: </span>
              <input
                class="input input--repeater"
                type="text"
                v-model.number="speedOfUtter"
              />
            </div>
            <p v-if="isUtterSecLine" style="color: white">
              <input type="checkbox" v-model="isUtterSecLineFirstly" />
              Utter Subtitle's translation Line at first
            </p>
          </div>
          <div style="color: white">
            <p style="color: blue; padding-top: 1em">INSTRUCTIONS</p>
            <p>
              Click on the screen (DOWN arrow key on keyboard): replay current
              sentence
            </p>
            <p>
              DoubleClick on the screen (UP arrow key on keyboard): stop playing
            </p>
            <p>
              Swipe Left on the screen (RIGHT arrow key on keyboard): jump to
              next sentence
            </p>
            <p>
              Swipe Right on the screen(LEFT arrow key on keyboard): jump to
              previous sentence
            </p>
            <p>
              Swipe Up on the screen: add to favorites (Or remove a favorite
              when playing Favorite List)
            </p>
            <p>Swipe Down on the screen: close this player</p>
            <p>
              Click button
              <i style="color: blue" class="material-icons">repeat_one</i>:
              switch Playback Mode between "Single Sentence Repetition Mode" and
              "Regular Mode"
            </p>
            <p>
              Click button
              <i style="color: blue" class="material-icons">closed_caption</i>:
              switch Subtitle's language
            </p>
            <p>
              Click button
              <i style="color: blue" class="material-icons">settings</i>: show
              SETTINGS, INSTRUCTIONS, UPDATES and COMMENTS
            </p>
            <p>
              Click button
              <i style="color: blue" class="material-icons">folder_special</i>:
              play sentences in favorite List
            </p>
            <p>
              Click button
              <i style="color: blue" class="material-icons">grade</i>: add or
              remove a favorite sentence.
            </p>
            <p>
              Click and Input
              <span style="color: blue"
                >{{ sentenceIndex }}/{{ srtSubtitles.length }}</span
              >: show current Sentence No. and switch to a special Sentence No.
            </p>

            <p style="color: blue; padding-top: 1em">UPDATES and COMMENTS</p>
            <p>
              <a
                href="https://github.com/niubility000/PDJ-Media-Repeater"
                target="_blank"
                >Project on Github:
                https://github.com/niubility000/PDJ-Media-Repeater</a
              >
            </p>
            <p>
              <a href="https://note.youdao.com/s/MI81scdr" target="_blank"
                >YouDao Notes: https://note.youdao.com/s/MI81scdr</a
              >
            </p>
          </div>
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
          v-if="srtSubtitles && isReadyToPlay"
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

        <p v-if="isMediaType == 0" style="color: red">
          Can't find {{ req.name.replace(".srt", ".mp4/.mp3") }} in current
          folder, or the .srt file is incorrect.
        </p>
      </div>
      <audio
        style="
          position: fixed;
          bottom: 10%;
          width: 78%;
          left: 0;
          right: 0;
          margin: auto;
        "
        v-if="isMediaType == 1"
        ref="player"
        :src="raw"
        :controls="!isSingle"
        controlslist="noplaybackrate"
        :autoplay="autoPlay"
        @play="autoPlay = true"
        @loadedmetadata="readyStatus"
      ></audio>
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
      repeatTimes: 4,
      interval: 3,
      playCount: 0,
      timeOutId: null,
      autoPlayNext: true,
      timeStampChange: -100,
      currentSpeed: "0.7, 0.5, 1",
      listing: null,
      isSetting: false,
      isEmpty: false,
      isSingle: true,
      favList: [],
      isFav: false,
      isFavOnPlay: false,
      isReadyToPlay: false,
      subtitleLang: "both",
      isUtterSecLine: true,
      pauseTimeSecLine: 5,
      speedOfUtter: 1,
      isUtterSecLineFirstly: true,
      langInSecLine: navigator.language || navigator.userLanguage,
      lineNumOfTrans: 2,
      isAutoDetectLang: true,
      touches: 0,
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
        var textSubtitles;
        if (this.req.content.includes("\r\n\r\n")) {
          textSubtitles = this.req.content.split("\r\n\r\n");
        } else {
          textSubtitles = this.req.content.split("\n\n");
        }
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
              (parseFloat(endMS) + this.timeStampChange - 1) / 1000;

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
    isEnglish() {
      let str = this.srtSubtitles[1].content.split("\r\n")[0];
      return /^[a-zA-Z]/.test(str);
    },
  },
  watch: {
    $route: function () {
      this.updatePreview();
    },
    sentenceIndex: function () {
      if (this.isFavOnPlay) {
        this.isFav = true;
      } else if (this.currentFileFavList) {
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
    repeatTimes: function () {
      this.save();
    },
    interval: function () {
      this.save();
    },
    autoPlayNext: function () {
      this.save();
    },
    currentSpeed: function () {
      this.save();
    },
    timeStampChange: function () {
      this.save();
    },
    subtitleLang: function () {
      this.save();
    },
    isUtterSecLine: function () {
      this.save();
    },
    pauseTimeSecLine: function () {
      this.save();
    },
    speedOfUtter: function () {
      this.save();
    },
    isUtterSecLineFirstly: function () {
      this.save();
    },
    langInSecLine: function () {
      this.save();
    },
    lineNumOfTrans: function () {
      this.save();
    },
    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        this.langInSecLine = navigator.language || navigator.userLanguage;
        this.autoDetectLangInTrans();
      }
      this.save();
    },
  },

  async mounted() {
    window.addEventListener("keydown", this.key);
    this.listing = this.oldReq.items;
    this.updatePreview();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
    this.cleanUp();
  },
  methods: {
    readyStatus() {
      this.$refs.player.play();
      this.isReadyToPlay = true;
      setTimeout(() => {
        this.$refs.player.pause();
      }, 1);
    },
    singleModePlay() {
      this.cleanUp();
      if (this.isUtterSecLine && this.isUtterSecLineFirstly) {
        this.utterSecLine();
      } else this.loopPlay();
    },

    utterSecLine() {
      let utterThis = new SpeechSynthesisUtterance();
      let secLineContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfTrans - 1
        ];
      utterThis.text =
        secLineContent !== undefined ? secLineContent : "no translation line";
      utterThis.lang = this.langInSecLine;
      utterThis.rate = this.speedOfUtter;
      speechSynthesis.speak(utterThis);
      utterThis.onend = () => {
        this.endUtter();
      };
    },

    endUtter() {
      this.timeOutId = setTimeout(() => {
        if (this.isUtterSecLine && !this.isUtterSecLineFirstly) {
          this.sentenceIndex = this.sentenceIndex + 1;
          this.singleModePlay();
        } else {
          this.loopPlay();
        }
      }, this.pauseTimeSecLine * 1000);
    },

    switchSubtitle() {
      this.isSetting = false;
      if (this.subtitleLang == "both") {
        this.subtitleLang = "line1";
      } else if (this.subtitleLang == "line1") {
        this.subtitleLang = "line2";
      } else {
        this.subtitleLang = "both";
      }
    },

    cleanUp() {
      speechSynthesis.cancel();
      this.$refs.player.pause();
      this.playCount = 0;
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
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
      this.isSetting = false;
      if (!this.isFavOnPlay) {
        window.sessionStorage.setItem("lastPosition", this.sentenceIndex);
      }
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.isFavOnPlay) {
        this.cleanUp();
        this.sentenceIndex = 1;
        this.singleModePlay();
      } else {
        this.cleanUp();
        this.sentenceIndex = Number(
          window.sessionStorage.getItem("lastPosition")
        );
        this.singleModePlay();
      }
    },

    switchIsFav() {
      this.isSetting = false;
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
          this.cleanUp();
          this.singleModePlay();
        }
      }
    },

    onSingle() {
      this.isSetting = false;
      this.isSingle = !this.isSingle;
      if (!this.isSingle) {
        this.cleanUp();
        this.$refs.player.currentTime = 0;
        this.regularPlay();
      }
      if (this.isSingle) {
        this.isEmpty = false;
        this.$refs.player.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.singleModePlay();
      }
    },
    onSetting() {
      this.isSetting = !this.isSetting;
      this.cleanUp();
      return;
    },
    click: function () {
      this.cleanUp();
      setTimeout(() => {
        if (this.touches == 1) {
          if (this.isSingle) {
            this.singleModePlay();
          } else {
            this.$refs.player.currentTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
            setTimeout(() => {
              this.regularPlay();
            }, 1);
          }
        }
        this.touches = 0;
      }, 300);

      this.touches++;
      if (this.touches > 1) {
        //double click
        this.cleanUp();
        this.touches = 0;
        return;
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
      if (this.timeDiff < 300 && Math.abs(this.distanceY) > 100) {
        this.checkNav(this.distanceY, "VERTICAL");
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
      if (this.timeDiff < 300 && Math.abs(this.distanceY) > 20) {
        this.checkNav(this.distanceY, "VERTICAL");
        return;
      }
      this.click();
    },
    checkNav(x, mode) {
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex > 1) {
        this.cleanUp();
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle) {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.singleModePlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          setTimeout(() => {
            this.regularPlay();
          }, 1);
        }
        return;
      } else if (
        x < 0 &&
        mode == "SWITCHIMG" &&
        this.sentenceIndex < this.srtSubtitles.length
      ) {
        this.cleanUp();
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle) {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.singleModePlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          setTimeout(() => {
            this.regularPlay();
          }, 1);
        }
        return;
      } else if (
        x < 0 &&
        mode == "VERTICAL" &&
        ((!this.isFavOnPlay && !this.isFav) || (this.isFavOnPlay && this.isFav))
      ) {
        this.switchIsFav();
        return;
      } else if (x > 0 && mode == "VERTICAL") {
        this.close();
        return;
      }
    },

    regularPlay() {
      this.isSingle = false;
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
          media.currentTime < this.srtSubtitles[i + 1].startTime &&
          media.currentTime > this.srtSubtitles[i].endTime
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

      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
        this.$refs.player.pause();
      }
      if (this.currentSpeed.split(",")[this.playCount]) {
        this.$refs.player.playbackRate = Number(
          this.currentSpeed.split(",")[this.playCount]
        );
      } else {
        this.$refs.player.playbackRate = 1;
      }
      this.playSection();
      this.playCount++;
      if (this.playCount >= this.repeatTimes) {
        this.playCount = 0;
        if (this.autoPlayNext) {
          this.timeOutId = setTimeout(
            () => {
              if (this.isUtterSecLine && !this.isUtterSecLineFirstly) {
                this.utterSecLine();
              } else {
                this.sentenceIndex = this.sentenceIndex + 1;
                this.singleModePlay();
              }
            },
            (this.interval +
              (this.srtSubtitles[this.sentenceIndex - 1].endTime -
                this.srtSubtitles[this.sentenceIndex - 1].startTime) /
                this.$refs.player.playbackRate) *
              1000
          );
        }
      } else {
        this.timeOutId = setTimeout(
          () => {
            this.loopPlay();
          },
          (this.interval +
            (this.srtSubtitles[this.sentenceIndex - 1].endTime -
              this.srtSubtitles[this.sentenceIndex - 1].startTime) /
              this.$refs.player.playbackRate) *
            1000
        );
      }
    },
    autoDetectLangInTrans() {
      if (this.isEnglish && !this.srtSubtitles[0].content.split("\r\n")[1])
        this.isUtterSecLine = false;
      else this.isUtterSecLine = true;
      if (this.isEnglish && this.srtSubtitles[0].content.split("\r\n")[1]) {
        this.lineNumOfTrans = 2;
      } else this.lineNumOfTrans = 1;
    },
    async save() {
      let customConfig =
        "customConfig" +
        ":" +
        JSON.stringify(this.repeatTimes) +
        ":" +
        JSON.stringify(this.interval) +
        ":" +
        JSON.stringify(this.autoPlayNext) +
        ":" +
        JSON.stringify(this.timeStampChange) +
        ":" +
        JSON.stringify(this.currentSpeed) +
        ":" +
        JSON.stringify(this.subtitleLang) +
        ":" +
        JSON.stringify(this.isUtterSecLine) +
        ":" +
        JSON.stringify(this.pauseTimeSecLine) +
        ":" +
        JSON.stringify(this.speedOfUtter) +
        ":" +
        JSON.stringify(this.isUtterSecLineFirstly) +
        ":" +
        JSON.stringify(this.langInSecLine) +
        ":" +
        JSON.stringify(this.lineNumOfTrans) +
        ":" +
        JSON.stringify(this.isAutoDetectLang) +
        ":";

      let favContent =
        customConfig + "Subtitle:" + JSON.stringify(this.favList);
      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/favorite.txt", favContent, true);
      } catch (error) {
        console.log(error);
      }
    },

    async updatePreview() {
      speechSynthesis.cancel();
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

        this.repeatTimes = Number(JSON.parse(favAll.content.split(":")[1]));
        this.interval = Number(JSON.parse(favAll.content.split(":")[2]));
        this.autoPlayNext = JSON.parse(favAll.content.split(":")[3]);
        this.timeStampChange = Number(JSON.parse(favAll.content.split(":")[4]));
        this.currentSpeed = JSON.parse(favAll.content.split(":")[5]);
        this.subtitleLang = JSON.parse(favAll.content.split(":")[6]);
        this.pauseTimeSecLine = Number(
          JSON.parse(favAll.content.split(":")[8])
        );
        this.speedOfUtter = Number(JSON.parse(favAll.content.split(":")[9]));
        this.isUtterSecLineFirstly = JSON.parse(favAll.content.split(":")[10]);
        this.isAutoDetectLang = JSON.parse(favAll.content.split(":")[13]);
        if (!this.isAutoDetectLang) {
          this.isUtterSecLine = JSON.parse(favAll.content.split(":")[7]);
          this.langInSecLine = JSON.parse(favAll.content.split(":")[11]);
          this.lineNumOfTrans = Number(
            JSON.parse(favAll.content.split(":")[12])
          );
        } else {
          this.autoDetectLangInTrans();
          this.langInSecLine = navigator.language || navigator.userLanguage;
        }
        this.favList = JSON.parse(favAll.content.split("Subtitle:")[1]);
      } catch (e) {
        this.favList = [];
        if (this.isAutoDetectLang) this.autoDetectLangInTrans();
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
      this.cleanUp();
      if (event.which === 39 && this.sentenceIndex < this.srtSubtitles.length) {
        // right arrow
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle) {
          this.singleModePlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.regularPlay();
        }
      } else if (event.which === 37 && this.sentenceIndex > 1) {
        // left arrow
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle) {
          this.singleModePlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.regularPlay();
        }
      } else if (event.which === 38) {
        // up arrow
        speechSynthesis.cancel();
        this.$refs.player.pause(); //stop play
      } else if (event.which === 40) {
        // down arrow
        if (this.isSingle) {
          this.singleModePlay();
        } else {
          this.$refs.player.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.regularPlay();
        }
      } else if (event.which === 27) {
        // esc
        this.close();
      }
    },

    close() {
      this.$store.commit("updateRequest", {});
      this.cleanUp();
      history.back();
    },
  },
};
</script>

<style>
#repeater {
  background-color: rgba(0, 0, 0, 0.99);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1005;
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

#settingBoxContainer {
  display: flex;
  position: fixed;
  width: 75%;
  left: 50%;
  transform: translate(-50%, 0);
  top: 5em;
  bottom: 1em;
  justify-content: center;
  align-items: center;
  z-index: 1006;
}

#settingBox {
  position: relative;
  height: 100%;
  padding: 1em;
  border-radius: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: grey;
}

@media (max-width: 736px) {
  #repeater .repeater {
    margin: 0;
  }
  header {
    display: flex;
    justify-content: space-around !important;
  }
  span.subject {
    width: 13em;
  }
  #settingBoxContainer {
    width: 100%;
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
