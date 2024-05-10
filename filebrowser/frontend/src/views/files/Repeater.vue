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
          :disabled="isSetting"
          :style="{ color: isSetting ? 'grey' : 'blue' }"
          icon="close"
          :label="$t('buttons.close')"
          @action="close()"
        />
        <title style="flex-grow: 1; white-space: nowrap" v-if="!isMobile">
          {{ mediaName }}
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
          v-if="srtSubtitles"
          :disabled="loading || isSetting || !isSingle"
          class="action"
          @click="switchIsFav"
          :title="$t('repeater.fav')"
        >
          <i
            :style="{
              color: isSetting || !isSingle ? 'grey' : isFav ? 'red' : 'blue',
            }"
            class="material-icons"
            >grade</i
          >
        </button>

        <button
          :disabled="loading || isSetting"
          class="action"
          @click="switchShowNotes"
          :title="$t('repeater.showNotes')"
        >
          <i
            :style="{
              color: loading || isSetting ? 'grey' : showNotes ? 'red' : 'blue',
            }"
            class="material-icons"
            >wysiwyg</i
          >
        </button>

        <button
          :disabled="loading || favList.length == 0 || isSetting || !isSingle"
          class="action"
          @click="playFavList"
          :title="$t('repeater.playFavoriteList')"
        >
          <i :style="favListStatus" class="material-icons">folder_special</i>
        </button>

        <button
          :disabled="loading || !isSingle"
          class="action"
          @click="onSetting"
          :title="$t('repeater.settings')"
        >
          <i
            :style="{ color: !isSingle ? 'grey' : isSetting ? 'red' : 'blue' }"
            class="material-icons"
            >settings</i
          >
        </button>

        <button
          :disabled="loading || isSetting"
          class="action"
          @click="switchSubtitle"
          :title="$t('repeater.switchsubtitleLanguages')"
        >
          <i :style="subSwitch" class="material-icons">closed_caption</i>
        </button>

        <button
          :disabled="loading || isFavOnPlay || isSetting"
          class="action"
          @click="onSingle"
          :title="
            isSingle
              ? $t('repeater.singleSentenceRepetitionMode')
              : $t('repeater.regularMode')
          "
        >
          <i :style="playMode" class="material-icons">repeat_one</i>
        </button>
      </header-bar>
      <div id="settingBoxContainer" v-if="srtSubtitles && isSetting">
        <div id="settingBox">
          <p style="text-align: justify; text-align-last: left; color: white">
            {{ $t("repeater.note1") }}
          </p>
          <p style="text-align: justify; text-align-last: left; color: white">
            {{ $t("repeater.note2") }}
            <a
              href="https://ftp.mozilla.org/pub/fenix/releases/125.0/android/fenix-125.0-android-arm64-v8a/fenix-125.0.multi.android-arm64-v8a.apk"
              target="_blank"
              style="color: blue"
              >Firefox Browser</a
            >
          </p>
          <p style="text-align: justify; text-align-last: left; color: white">
            {{ $t("repeater.note3") }}
          </p>
          <p style="color: blue; font-weight: bold; padding-top: 2em">
            {{ $t("repeater.settings") }}
          </p>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.sentencePlaybackTimes") }}
            </span>
            <input
              class="input input--repeater"
              type="number"
              min="1"
              max="100"
              v-model="repeatTimes"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.interval") }}
            </span>
            <input
              class="input input--repeater"
              type="number"
              min="0"
              max="1000"
              v-model.number="interval"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.timestampMove") }}
            </span>
            <input
              class="input input--repeater"
              type="text"
              v-model.number="timeStampChange"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.speedEachTime") }}
            </span>
            <input
              class="input input--repeater"
              type="text"
              v-model="currentSpeed"
            />
          </div>
          <div style="display: block">
            <p
              :style="{
                color: isFavOnPlay && isPlayFullFavList ? '#bbbaba' : 'white',
              }"
            >
              <input
                :disabled="isFavOnPlay && isPlayFullFavList"
                type="checkbox"
                v-model="autoPlay"
              />
              {{ $t("repeater.autoPlayCurrentSentence") }}
            </p>
            <p style="color: white">
              <input type="checkbox" v-model="autoPlayNext" />
              {{ $t("repeater.autoSwitchtoNextSentence") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p>
              <span style="color: white">
                <input
                  :disabled="isAutoDetectLang"
                  type="checkbox"
                  v-model="isUtterTransLine"
                />
                {{ $t("repeater.utterSubtitle") }}
              </span>
              <span
                :style="{
                  color: isFavOnPlay && isPlayFullFavList ? '#bbbaba' : 'white',
                }"
              >
                (<input
                  :disabled="isFavOnPlay && isPlayFullFavList"
                  type="checkbox"
                  v-model="isAutoDetectLang"
                />
                {{ $t("repeater.autoDetect") }})
              </span>
            </p>

            <div
              :style="{ color: isUtterTransLine ? 'white' : '#bbbaba' }"
              :disabled="!isUtterTransLine"
            >
              <p style="margin-bottom: 0">
                <input
                  :disabled="!isUtterTransLine"
                  style="margin-left: 1em"
                  type="radio"
                  value="Yes"
                  v-model="isSystemTTS"
                />
                <span>{{ $t("repeater.systemTTS") }}</span>
              </p>
              <p
                v-if="alertNotSuportSpeechSynthesis"
                style="color: red; margin-left: 2em"
              >
                {{ $t("repeater.speechsynthesisAlert") }}
              </p>

              <p
                style="margin: 0.5em 0 1em 2em"
                :style="{
                  color:
                    isSystemTTS == 'Yes' && isUtterTransLine
                      ? 'white'
                      : '#bbbaba',
                }"
              >
                {{ $t("repeater.SystemTTSnote") }}
              </p>
              <p style="margin-bottom: 0">
                <input
                  :disabled="!isUtterTransLine"
                  style="margin-left: 1em"
                  type="radio"
                  value="No"
                  v-model="isSystemTTS"
                />
                <span>{{ $t("repeater.notSystemTTS") }}</span>
                <button
                  :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
                  class="action"
                  @click="resetTTSurl"
                  :title="$t('repeater.resetTTSurl')"
                >
                  <i
                    :style="{
                      color:
                        isSystemTTS == 'Yes' || !isUtterTransLine
                          ? '#bbbaba'
                          : 'blue',
                    }"
                    class="material-icons"
                    >settings_backup_restore</i
                  >
                </button>
                <button
                  :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
                  class="action"
                  @click="testTTSurl"
                  :title="$t('repeater.testTTSurl')"
                >
                  <i
                    :style="{
                      color:
                        isSystemTTS == 'Yes' || !isUtterTransLine
                          ? '#bbbaba'
                          : 'blue',
                    }"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
              </p>
              <input
                style="
                  margin: 0 0 0.5em 2em;
                  width: calc(100% - 2em);
                  text-align: left;
                "
                :disabled="isSystemTTS == 'Yes' || !isUtterTransLine"
                class="input input--repeater"
                type="text"
                v-model="TTSurl"
              />
              <p
                style="
                  margin: 0 0 1em 2em;
                  text-align: justify;
                  text-align-last: left;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                  word-break: break-all;
                "
                :style="{
                  color:
                    isSystemTTS == 'No' && isUtterTransLine
                      ? 'white'
                      : '#bbbaba',
                }"
              >
                {{ $t("repeater.notSystemTTSnote") }}
              </p>
            </div>

            <div style="display: block">
              <span
                :style="{
                  color: isUtterTransLine ? 'white' : '#bbbaba',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.langInTransLine") }}
              </span>
              <input
                :disabled="!(isUtterTransLine && !isAutoDetectLang)"
                class="input input--repeater"
                type="text"
                v-model="langInTransLine"
              />
            </div>
            <div style="display: block">
              <span
                :style="{
                  color: isUtterTransLine ? 'white' : '#bbbaba',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.lineNumOfTrans") }}
              </span>
              <input
                :disabled="!(isUtterTransLine && !isAutoDetectLang)"
                class="input input--repeater"
                type="number"
                min="1"
                max="2"
                v-model="lineNumOfTrans"
              />
            </div>
            <div style="display: block">
              <span
                :style="{ color: isUtterTransLine ? 'white' : '#bbbaba' }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.pauseTime") }}
              </span>
              <input
                :disabled="!isUtterTransLine"
                class="input input--repeater"
                type="number"
                min="0"
                max="1000"
                v-model="pauseTimeTransLine"
              />
            </div>
            <div style="display: block">
              <span
                :style="{
                  color:
                    !isUtterTransLine || isSystemTTS == 'No'
                      ? '#bbbaba'
                      : 'white',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.speedOfUttering") }}
              </span>
              <input
                :disabled="!isUtterTransLine || isSystemTTS == 'No'"
                class="input input--repeater"
                type="text"
                v-model.number="speedOfUtter"
              />
            </div>
            <p :style="{ color: isUtterTransLine ? 'white' : '#bbbaba' }">
              <input
                :disabled="!isUtterTransLine"
                style="margin-left: 1em"
                type="checkbox"
                v-model="isUtterTransLineFirstly"
              />
              {{ $t("repeater.utterTransFirstly") }}
            </p>
            <p
              :style="{
                color: isUtterTransLine ? 'white' : '#bbbaba',
              }"
              style="
                text-align: justify;
                text-align-last: left;
                margin-left: 1em;
              "
            >
              <input
                :disabled="!isUtterTransLine"
                type="checkbox"
                v-model="isPauseAfterFirstDone"
              />
              {{ $t("repeater.autoPauseAfterFirstDone") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p
              :style="{
                color: !isFavOnPlay ? 'white' : '#bbbaba',
              }"
              style="text-align: justify; text-align-last: left"
            >
              <input
                :disabled="isFavOnPlay"
                type="checkbox"
                v-model="isPlayFullFavList"
              />
              {{ $t("repeater.playFullFavList") }}
            </p>
          </div>
          <div style="color: white">
            <p style="color: blue; font-weight: bold; padding-top: 2em">
              {{ $t("repeater.instructions") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction1") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction2") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction3") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction4") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction5") }}
            </p>
            <p style="text-align: justify">{{ $t("repeater.instruction6") }}</p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">repeat_one</i
              >{{ $t("repeater.instruction7") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">closed_caption</i
              >{{ $t("repeater.instruction8") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">settings</i
              >{{ $t("repeater.instruction9") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">folder_special</i
              >{{ $t("repeater.instruction10") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">grade</i
              >{{ $t("repeater.instruction11") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickandInput") }}
              <span style="color: white"
                >{{ sentenceIndex }}/{{ srtSubtitles.length }}</span
              >{{ $t("repeater.instruction12") }}
            </p>
            <p style="color: blue; font-weight: bold; padding-top: 2em">
              {{ $t("repeater.learnLangUsingPDJ") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.learnLang1") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.learnLang2") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.learnLang3") }}
            </p>
            <p style="color: blue; font-weight: bold; padding-top: 2em">
              {{ $t("repeater.updatesandComments") }}
            </p>
            <p>
              <a
                href="https://github.com/niubility000/PDJ-Media-Repeater"
                target="_blank"
                style="color: blue"
                >{{
                  $t("repeater.github")
                }}
                https://github.com/niubility000/PDJ-Media-Repeater</a
              >
            </p>
            <p>
              <a
                href="https://note.youdao.com/s/MI81scdr"
                target="_blank"
                style="color: blue"
                >{{
                  $t("repeater.youdao")
                }}
                https://note.youdao.com/s/MI81scdr</a
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
          style="max-height: 60%; max-width: 100%"
          v-if="isMediaType == 2 && !browserHiJack"
          id="myVideo"
          :src="raw"
          :autoplay="autoPlay"
          :controls="!isSingle"
          controlslist="noplaybackrate nodownload noremoteplayback"
          disablePictureInPicture="true"
          @loadedmetadata="readyStatus"
          x5-video-player-type="h5-page"
          webkit-playsinline="true"
          playsinline="true"
          x5-video-orientation="landscape|portrait"
        ></video>
        <p
          v-if="isMediaType > 0 && browserHiJack"
          style="color: red; font-size: 1.2em; padding-top: 4em"
        >
          {{ $t("repeater.warning1") }}
        </p>
        <p
          v-if="!isReadyToPlay && isMediaType > 0 && !browserHiJack"
          style="color: white"
        >
          Loading Media...
        </p>
        <span
          v-if="srtSubtitles && isReadyToPlay"
          style="
            color: yellow;
            overflow-wrap: break-word;
            width: 100%;
            font-size: 1.5em;
            margin: 0;
          "
          :style="{ paddingTop: isMediaType == 1 ? '6em' : 0 }"
        >
          <p v-if="subtitleLang !== 'line2' && subtitleLang !== 'none'">
            {{
              !isEmpty
                ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[0]
                : "   "
            }}
          </p>
          <p v-if="subtitleLang !== 'line1' && subtitleLang !== 'none'">
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
        <span
          v-if="srtSubtitles && isReadyToPlay"
          style="
            color: white;
            width: 100%;
            font-size: 1em;
            margin: auto;
            left: 0;
            right: 0;
            flex-grow: 1;
            overflow: auto;
          "
        >
          <textarea
            v-if="showNotes && !isEmpty"
            id="noteArea"
            rows="4"
            v-model="note"
            placeholder="......"
            style="
              width: 100%;
              background-color: black;
              color: whitesmoke;
              border: none;
              resize: none;
              text-align: center;
            "
          ></textarea>
        </span>
      </div>
      <audio
        style="
          position: fixed;
          bottom: 5%;
          width: 85%;
          left: 0;
          right: 0;
          margin: auto;
        "
        v-if="isMediaType == 1 && !browserHiJack"
        id="myAudio"
        :src="raw"
        :controls="!isSingle"
        controlslist="noplaybackrate nodownload"
        :autoplay="autoPlay"
        @loadedmetadata="readyStatus"
      ></audio>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import { files as api } from "@/api";
import url from "@/utils/url";
import HeaderBar from "@/components/header/HeaderBar.vue";
import Action from "@/components/header/Action.vue";
import { setTimeout } from "core-js";

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
      interval: 2,
      playCount: 0,
      timeOutId: null,
      intervalId: null,
      autoPlayNext: true,
      autoPlay: false,
      timeStampChange: -100,
      currentSpeed: "0.8, 0.5",
      listing: null,
      isSetting: false,
      isEmpty: false,
      isSingle: true,
      favList: [],
      noteList: [],
      isFav: false,
      isFavOnPlay: false,
      isReadyToPlay: false,
      subtitleLang: "both",
      isUtterTransLine: true,
      pauseTimeTransLine: 3,
      speedOfUtter: 1,
      isUtterTransLineFirstly: true,
      langInTransLine: navigator.language || navigator.userLanguage,
      lineNumOfTrans: 2,
      isAutoDetectLang: true,
      touches: 0,
      isPauseAfterFirstDone: false,
      pauseAfterFirstDone: false,
      browserHiJack: window.sessionStorage.getItem("isBrowserHiJack"),
      alertNotSuportSpeechSynthesis: false,
      resized: false,
      isFirstClick: true,
      hasSpeechSynthesis:
        !!window.speechSynthesis || "speechSynthesis" in window,
      utterThis: null,
      isPlayFullFavList: false,
      audio: null,
      lastStatus: "",
      isSystemTTS: "Yes",
      isMount: true,
      contentAll: null,
      note: "",
      showNotes: false,
      TTSurl:
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=",
    };
  },
  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),
    isMobile() {
      return window.innerWidth < 736;
    },
    favListStatus() {
      if (this.isSetting || !this.isSingle) return { color: "grey" };
      if (!this.isPlayFullFavList) {
        if (this.currentFileFavList.length == 0) {
          return { color: "grey" };
        } else if (this.isFavOnPlay) {
          return { color: "red" };
        } else {
          return { color: "blue" };
        }
      } else {
        if (this.favList.length == 0) {
          return { color: "grey" };
        } else if (this.isFavOnPlay) {
          return { color: "red" };
        } else {
          return { color: "blue" };
        }
      }
    },
    subSwitch() {
      if (this.isSetting) return { color: "grey" };
      if (this.subtitleLang == "both") {
        return { color: "blue" };
      } else if (this.subtitleLang == "line1") {
        return { color: "red" };
      } else if (this.subtitleLang == "line2") {
        return { color: "green" };
      } else {
        return { color: "black" };
      }
    },
    playMode() {
      if (this.isFavOnPlay || this.isSetting) {
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
        } else if (this.req.content.includes("\n\n")) {
          textSubtitles = this.req.content.split("\n\n");
        } else textSubtitles = this.req.content.split("\n");

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
      } else if (this.isPlayFullFavList) {
        return this.favList;
      } else {
        return this.currentFileFavList;
      }
    },
    isMediaType() {
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        if (
          this.srtSubtitles[this.sentenceIndex - 1].rawPath.includes(".mp4")
        ) {
          return 2;
        } else return 1;
      } else {
        if (this.listing && this.req.name) {
          for (var i = 0; i < this.listing.length; ++i) {
            if (this.listing[i].name == this.req.name.replace(".srt", ".mp4")) {
              return 2;
            } else if (
              this.listing[i].name == this.req.name.replace(".srt", ".mp3")
            ) {
              return 1;
            }
          }
          return 0;
        } else return -1;
      }
    },

    raw() {
      let srtUrl = api.getDownloadURL(this.req, true);
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        return (
          srtUrl.split("/raw/")[0] +
          "/raw/" +
          this.srtSubtitles[this.sentenceIndex - 1].originalRawPath.split(
            "?"
          )[0] +
          "?" +
          srtUrl.split("?")[1] +
          "?timestamp=" +
          new Date().getMinutes()
        );
      } else {
        if (srtUrl && this.isMediaType == 1) {
          return (
            srtUrl.replace(".srt", ".mp3") +
            "?timestamp=" +
            new Date().getMinutes()
          );
        } else if (srtUrl && this.isMediaType == 2) {
          return (
            srtUrl.replace(".srt", ".mp4") +
            "?timestamp=" +
            new Date().getMinutes()
          );
        } else return "";
      }
    },
    currentMedia() {
      if (this.isMediaType == 1) {
        return document.getElementById("myAudio");
      } else if (this.isMediaType == 2) {
        return document.getElementById("myVideo");
      } else return null;
    },
    currentFileFavList() {
      let currentMediaName = this.mediaName;
      return this.favList.filter(function (item) {
        return item.rawPath == currentMediaName;
      });
    },
    mediaName() {
      if (this.isMediaType == 1) {
        return this.req.name.replace(".srt", ".mp3");
      } else if (this.isMediaType == 2) {
        return this.req.name.replace(".srt", ".mp4");
      } else {
        return "";
      }
    },
    isEnglish() {
      let str = this.srtSubtitles[0].content.split("\r\n")[0];
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
      var nowStartTime = this.srtSubtitles[this.sentenceIndex - 1].startTime;
      var singleNoteList = this.noteList.filter(function (item) {
        return item.startTime == nowStartTime;
      });
      if (singleNoteList.length > 0) this.note = singleNoteList[0].content;
      else this.note = "";
    },
    isMount: function () {
      if (!this.isMount && !this.isFavOnPlay) this.autoPlay = true;
    },
    isSetting: function () {
      if (
        !this.issetting &&
        this.isSystemTTS == "Yes" &&
        !this.hasSpeechSynthesis
      ) {
        this.isSystemTTS = "No";
      }
    },
    showNotes: function () {
      this.save();
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
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    subtitleLang: function () {
      this.save();
    },
    isUtterTransLine: function () {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    isSystemTTS: function () {
      if (this.isSystemTTS == "Yes" && !this.hasSpeechSynthesis) {
        this.alertNotSuportSpeechSynthesis = true;
      }
      if (this.isSystemTTS == "No" && !this.hasSpeechSynthesis) {
        this.alertNotSuportSpeechSynthesis = false;
      }

      this.save();
    },
    TTSurl: function () {
      this.save();
    },

    pauseTimeTransLine: function () {
      this.save();
    },
    speedOfUtter: function () {
      this.save();
    },
    isUtterTransLineFirstly: function () {
      this.save();
    },
    langInTransLine: function () {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    lineNumOfTrans: function () {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        this.langInTransLine = navigator.language || navigator.userLanguage;
        this.autoDetectLangInTrans();
      }
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    isPauseAfterFirstDone: function () {
      this.save();
    },
    autoPlay: function () {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    isPlayFullFavList: function () {
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    raw: function () {
      this.isReadyToPlay = false;
      this.playCount = 0;
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        this.isAutoDetectLang = false;
        this.langInTransLine =
          this.srtSubtitles[this.sentenceIndex - 1].langUsed;
        this.lineNumOfTrans = this.srtSubtitles[this.sentenceIndex - 1].lineNum;
        this.isUtterTransLine =
          this.srtSubtitles[this.sentenceIndex - 1].isUtter;
        this.timeStampChange =
          this.srtSubtitles[this.sentenceIndex - 1].tsChange;
        if (this.autoPlay) this.autoPlay = false;
      }
      this.isFirstClick = true;
    },
    note: function () {
      //add or renew a note
      var nowStartTime = this.srtSubtitles[this.sentenceIndex - 1].startTime;
      var nowEndTime = this.srtSubtitles[this.sentenceIndex - 1].endTime;
      this.noteList = this.noteList.filter(function (item) {
        return item.startTime !== nowStartTime && item.endTime !== nowEndTime;
      });
      var sentenceNote = {
        rawPath: this.mediaName,
        startTime: this.srtSubtitles[this.sentenceIndex - 1].startTime,
        endTime: this.srtSubtitles[this.sentenceIndex - 1].endTime,
        content: this.note,
      };
      this.noteList.push(sentenceNote);
      this.save();
    },
  },

  async mounted() {
    window.addEventListener("keydown", this.key);
    window.addEventListener("resize", this.handleResize);
    this.listing = this.oldReq.items;
    this.updatePreview();
    this.initUtter();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
    window.removeEventListener("resize", this.handleResize);
    this.cleanUp();
  },
  methods: {
    async readyStatus() {
      this.isReadyToPlay = true;
      let vm = this;
      try {
        const pathf = url.removeLastDir(this.$route.path);
        vm.contentAll = await api.fetch(pathf + "/!pdj!favorite.txt");
      } catch (e) {
        this.showConfirm();
      }
      if (this.contentAll !== null) {
        this.repeatTimes = Number(
          JSON.parse(this.contentAll.content.split("::")[1])
        );
        this.interval = Number(
          JSON.parse(this.contentAll.content.split("::")[2])
        );
        this.autoPlayNext = JSON.parse(this.contentAll.content.split("::")[3]);
        this.timeStampChange = Number(
          JSON.parse(this.contentAll.content.split("::")[4])
        );
        this.currentSpeed = JSON.parse(this.contentAll.content.split("::")[5]);
        this.subtitleLang = JSON.parse(this.contentAll.content.split("::")[6]);
        this.pauseTimeTransLine = Number(
          JSON.parse(this.contentAll.content.split("::")[8])
        );
        this.speedOfUtter = Number(
          JSON.parse(this.contentAll.content.split("::")[9])
        );
        this.isUtterTransLineFirstly = JSON.parse(
          this.contentAll.content.split("::")[10]
        );
        this.isPauseAfterFirstDone = JSON.parse(
          this.contentAll.content.split("::")[14]
        );
        this.autoPlay = JSON.parse(this.contentAll.content.split("::")[15]);
        this.isPlayFullFavList = JSON.parse(
          this.contentAll.content.split("::")[16]
        );
        this.isSystemTTS = JSON.parse(this.contentAll.content.split("::")[17]);
        this.TTSurl = JSON.parse(this.contentAll.content.split("::")[18]);
        this.showNotes = JSON.parse(this.contentAll.content.split("::")[19]);
        this.isAutoDetectLang = JSON.parse(
          this.contentAll.content.split("::")[13]
        );
        if (!this.isAutoDetectLang) {
          this.isUtterTransLine = JSON.parse(
            this.contentAll.content.split("::")[7]
          );
          this.langInTransLine = JSON.parse(
            this.contentAll.content.split("::")[11]
          );
          this.lineNumOfTrans = Number(
            JSON.parse(this.contentAll.content.split("::")[12])
          );
        } else {
          this.autoDetectLangInTrans();
          this.langInTransLine = navigator.language || navigator.userLanguage;
        }
        if (
          this.isMount &&
          !this.isFavOnPlay &&
          this.contentAll.content.includes("lastStatus::")
        ) {
          this.isMount = false;
          var readLastStatus = this.contentAll.content.split("lastStatus::")[1];
          this.isAutoDetectLang = JSON.parse(readLastStatus.split("::")[0]);
          if (!this.isAutoDetectLang) {
            this.langInTransLine = JSON.parse(readLastStatus.split("::")[1]);
            this.lineNumOfTrans = Number(
              JSON.parse(readLastStatus.split("::")[2])
            );
            this.isUtterTransLine = JSON.parse(readLastStatus.split("::")[3]);
          } else {
            this.autoDetectLangInTrans();
            this.langInTransLine = navigator.language || navigator.userLanguage;
          }
          this.timeStampChange = Number(
            JSON.parse(readLastStatus.split("::")[4])
          );
          this.autoPlay = JSON.parse(readLastStatus.split("::")[6]);
          this.lastStatus = "";
        }
        this.favList = JSON.parse(
          this.contentAll.content.split("Subtitle:")[1].split("noteList:")[0]
        );
        this.noteList = JSON.parse(
          this.contentAll.content.split("noteList:")[1]
        );
        if (this.currentFileFavList) {
          for (var i = 0; i < this.currentFileFavList.length; ++i) {
            if (
              this.currentFileFavList[i].startTime ==
              this.srtSubtitles[this.sentenceIndex - 1].startTime
            ) {
              this.isFav = true;
            }
          }
        }
        var nowStartTime = this.srtSubtitles[this.sentenceIndex - 1].startTime;
        var nowEndTime = this.srtSubtitles[this.sentenceIndex - 1].endTime;
        var singleNoteList = this.noteList.filter(function (item) {
          return item.startTime == nowStartTime && item.endTime == nowEndTime;
        });
        if (singleNoteList.length > 0) this.note = singleNoteList[0].content;
        else this.note = "";
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.currentMedia.play();
        this.currentMedia.muted = true;
        setTimeout(() => {
          this.currentMedia.muted = false;
          this.currentMedia.pause();
        }, 1);
      }
    },

    initUtter() {
      this.audio = new Audio();
      if (this.hasSpeechSynthesis) {
        this.utterThis = new SpeechSynthesisUtterance();
      }
    },
    firstClick() {
      this.isFirstClick = false;
      if (!(this.isMediaType == 1 && this.isSystemTTS == "No"))
        this.utterTransLine();
      if (this.audio) this.audio.muted = true;
      this.currentMedia.play();
      this.currentMedia.currentTime = 1;
      this.currentMedia.muted = true;
      setTimeout(() => {
        this.currentMedia.muted = false;
        if (this.audio) this.audio.muted = false;
        this.cleanUp();
        if (
          this.currentMedia.currentTime < 0.9 ||
          this.currentMedia.currentTime > 1.2
        ) {
          window.sessionStorage.setItem("isBrowserHiJack", true);
          location.reload();
        }
      }, 1);
    },
    singleModePlay() {
      this.cleanUp();
      if (!this.isReadyToPlay) return;
      if (this.isUtterTransLine && this.isUtterTransLineFirstly) {
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.utterTransLine();
      } else this.loopPlay();
    },
    testTTSurl() {
      let transLineContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfTrans - 1
        ];
      let text =
        transLineContent !== undefined
          ? transLineContent
          : "no translation line";
      let ttsFullUrl = this.TTSurl + text;
      fetch(ttsFullUrl)
        .then(() => {
          this.audio.src = ttsFullUrl;
          this.audio.play();
          this.audio.addEventListener("ended", this.endTestUtter, false);
        })
        .catch((error) => console.error("Error Uttering Trans Line:", error));
    },
    endTestUtter() {
      this.audio.removeEventListener("ended", this.endTestUtter, false);
      this.cleanUp();
    },
    utterTransLine() {
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        let transLineContent =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ];
        this.utterThis.text =
          transLineContent !== undefined
            ? transLineContent
            : "no translation line";
        this.utterThis.lang = this.langInTransLine;
        this.utterThis.rate = this.speedOfUtter;
        window.speechSynthesis.speak(this.utterThis);
        this.utterThis.onend = () => {
          this.endUtter();
        };
      } else if (this.isUtterTransLine && this.isSystemTTS == "No") {
        let transLineContent =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ];
        let text =
          transLineContent !== undefined
            ? transLineContent
            : "no translation line";
        let ttsFullUrl = this.TTSurl + text;
        fetch(ttsFullUrl)
          .then(() => {
            this.audio.src = ttsFullUrl;
            this.audio.play();
            this.audio.addEventListener("ended", this.endUtter, false);
          })
          .catch((error) => console.error("Error Uttering Trans Line:", error));
      }
    },

    endUtter() {
      this.audio.removeEventListener("ended", this.endUtter, false);
      if (
        this.isUtterTransLine &&
        this.isUtterTransLineFirstly &&
        this.isPauseAfterFirstDone
      ) {
        this.pauseAfterFirstDone = true;
        return;
      } else if (
        !this.autoPlayNext &&
        this.isUtterTransLine &&
        !this.isUtterTransLineFirstly
      ) {
        this.cleanUp();
        return;
      } else {
        this.timeOutId = setTimeout(() => {
          if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.sentenceIndex < this.srtSubtitles.length
          ) {
            this.sentenceIndex = this.sentenceIndex + 1;
            if (!this.autoPlay) {
              this.cleanUp();
              return;
            }
            this.singleModePlay();
          } else {
            this.loopPlay();
          }
        }, this.pauseTimeTransLine * 1000);
      }
    },

    switchSubtitle() {
      if (this.subtitleLang == "both") {
        this.subtitleLang = "line1";
      } else if (this.subtitleLang == "line1") {
        this.subtitleLang = "line2";
      } else if (this.subtitleLang == "line2") {
        this.subtitleLang = "none";
      } else {
        this.subtitleLang = "both";
      }
    },
    resetTTSurl() {
      this.TTSurl =
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=";
    },
    cleanUp() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.currentMedia) this.currentMedia.pause();
      if (
        document.getElementById("noteArea") &&
        document.getElementById("noteArea").contains(document.activeElement)
      )
        document.getElementById("noteArea").blur();
      if (this.audio) this.audio.pause();
      this.playCount = 0;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
    },

    playFavList() {
      this.cleanUp();
      if (!this.isFavOnPlay) {
        this.lastStatus =
          "lastStatus" +
          "::" +
          JSON.stringify(this.isAutoDetectLang) +
          "::" +
          JSON.stringify(this.langInTransLine) +
          "::" +
          JSON.stringify(this.lineNumOfTrans) +
          "::" +
          JSON.stringify(this.isUtterTransLine) +
          "::" +
          JSON.stringify(this.timeStampChange) +
          "::" +
          JSON.stringify(this.sentenceIndex) +
          "::" +
          JSON.stringify(this.autoPlay) +
          "::";
        this.save();
      }
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.isFavOnPlay) {
        this.sentenceIndex = 1;
        if (!this.isPlayFullFavList) {
          this.singleModePlay();
        } else {
          this.isAutoDetectLang = false;
          this.langInTransLine =
            this.srtSubtitles[this.sentenceIndex - 1].langUsed;
          this.lineNumOfTrans =
            this.srtSubtitles[this.sentenceIndex - 1].lineNum;
          this.isUtterTransLine =
            this.srtSubtitles[this.sentenceIndex - 1].isUtter;
          this.timeStampChange =
            this.srtSubtitles[this.sentenceIndex - 1].tsChange;
          this.autoPlay = false;
        }
      } else {
        if (this.isPlayFullFavList) {
          this.isAutoDetectLang = JSON.parse(this.lastStatus.split("::")[1]);
          this.langInTransLine = JSON.parse(this.lastStatus.split("::")[2]);
          this.lineNumOfTrans = Number(
            JSON.parse(this.lastStatus.split("::")[3])
          );
          this.isUtterTransLine = JSON.parse(this.lastStatus.split("::")[4]);
          this.timeStampChange = Number(
            JSON.parse(this.lastStatus.split("::")[5])
          );
          this.sentenceIndex = Number(
            JSON.parse(this.lastStatus.split("::")[6])
          );
          this.autoPlay = JSON.parse(this.lastStatus.split("::")[7]);
        } else {
          this.sentenceIndex = Number(
            JSON.parse(this.lastStatus.split("::")[6])
          );
          this.singleModePlay();
        }
        this.lastStatus = "";
      }
    },

    switchIsFav() {
      if (this.isReadyToPlay) {
        this.isFav = !this.isFav;
        if (this.isFav) {
          //add a fav
          var fav = {
            langUsed: this.langInTransLine,
            lineNum: this.lineNumOfTrans,
            isUtter: this.isUtterTransLine,
            tsChange: this.timeStampChange,
            rawPath: this.mediaName,
            originalRawPath: this.raw.split("?")[0].split("/raw/")[1],
            startTime: this.srtSubtitles[this.sentenceIndex - 1].startTime,
            endTime: this.srtSubtitles[this.sentenceIndex - 1].endTime,
            content: this.srtSubtitles[this.sentenceIndex - 1].content,
          };
          this.favList.push(fav);
          this.save();
        } else {
          //remove a fav
          if (this.isFavOnPlay) {
            this.cleanUp();
          }
          var nowStartTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
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
          }
        }
      }
    },
    switchShowNotes() {
      this.showNotes = !this.showNotes;
    },
    showConfirm() {
      var userConfirmation = window.confirm(
        this.$t("repeater.favoriteClearConfirm")
      );
      if (userConfirmation) {
        this.favList = [];
        this.noteList = [];
        if (this.isAutoDetectLang) this.autoDetectLangInTrans();
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.save();
        this.isMount = false;
        this.currentMedia.play();
        this.currentMedia.muted = true;
        setTimeout(() => {
          this.currentMedia.muted = false;
          this.currentMedia.pause();
        }, 1);
      } else {
        this.cleanUp();
        this.close();
      }
    },
    onSingle() {
      this.isSingle = !this.isSingle;
      if (!this.isSingle) {
        this.cleanUp();
        this.regularPlay();
        this.currentMedia.currentTime = 0;
        this.currentMedia.addEventListener("focus", this.removeFocus);
      }
      if (this.isSingle) {
        this.isEmpty = false;
        this.singleModePlay();
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.currentMedia.removeEventListener("focus", this.removeFocus);
      }
    },
    removeFocus() {
      this.currentMedia.blur();
    },

    onSetting() {
      this.isSetting = !this.isSetting;
      if (this.isSetting) this.cleanUp();
      else {
        setTimeout(() => {
          this.singleModePlay();
        }, 1);
      }

      return;
    },
    click: function (event) {
      if (
        !this.isSingle ||
        !document.getElementById("noteArea") ||
        !document.getElementById("noteArea").contains(event.target)
      ) {
        if (this.isFirstClick) this.firstClick();
        this.cleanUp();
        setTimeout(() => {
          if (this.touches == 1) {
            if (this.isSingle) {
              setTimeout(() => {
                if (this.pauseAfterFirstDone) {
                  this.pauseAfterFirstDone = false;
                  if (this.isUtterTransLineFirstly) this.loopPlay();
                  else this.utterTransLine();
                } else {
                  this.singleModePlay();
                }
              }, 1);
            } else {
              setTimeout(() => {
                this.regularPlay();
                this.currentMedia.currentTime =
                  this.srtSubtitles[this.sentenceIndex - 1].startTime;
              }, 1);
            }
          }
          this.touches = 0;
        }, 300);

        this.touches++;
        if (this.touches > 1) {
          //double click
          this.touches = 0;
          return;
        }
      } else {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (this.currentMedia) this.currentMedia.pause();
        if (this.audio) this.audio.pause();
        this.playCount = 0;
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        if (this.timeOutId) clearTimeout(this.timeOutId);
        if (this.currentMedia && this.currentMedia.removeEventListener) {
          this.currentMedia.removeEventListener("timeupdate", this.syncSub);
        }
      }
    },

    startDrag(event) {
      if (
        !this.isSingle ||
        !document.getElementById("noteArea") ||
        !document.getElementById("noteArea").contains(event.target)
      ) {
        event.preventDefault();
      }
      this.isSetting = false;
      this.startTime = new Date().getTime();
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    endDrag(event) {
      if (
        !this.isSingle ||
        !document.getElementById("noteArea") ||
        !document.getElementById("noteArea").contains(event.target)
      ) {
        event.preventDefault();
      }
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.clientX - this.startX;
      this.distanceY = event.clientY - this.startY;
      if (
        this.isReadyToPlay &&
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 60
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) < Math.abs(this.distanceY) &&
        Math.abs(this.distanceY) > 100
      ) {
        this.checkNav(this.distanceY, "VERTICAL");
        return;
      }
      this.click(event);
    },
    startTouch(event) {
      if (
        !this.isSingle ||
        !document.getElementById("noteArea") ||
        !document.getElementById("noteArea").contains(event.target)
      ) {
        event.preventDefault();
      }
      this.isSetting = false;
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    endTouch(event) {
      if (
        !this.isSingle ||
        !document.getElementById("noteArea") ||
        !document.getElementById("noteArea").contains(event.target)
      ) {
        event.preventDefault();
      }
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.changedTouches[0].clientX - this.startX;
      this.distanceY = event.changedTouches[0].clientY - this.startY;
      if (
        this.isReadyToPlay &&
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 30
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) < Math.abs(this.distanceY) &&
        Math.abs(this.distanceY) > 70
      ) {
        this.checkNav(this.distanceY, "VERTICAL");
        return;
      }
      this.click(event);
    },
    checkNav(x, mode) {
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex > 1) {
        this.cleanUp();
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp();
            }, 1);
          }
        } else {
          setTimeout(() => {
            this.regularPlay();
            this.currentMedia.currentTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
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
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp();
            }, 1);
          }
        } else {
          setTimeout(() => {
            this.regularPlay();
            this.currentMedia.currentTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
          }, 1);
        }
        return;
      } else if (
        this.isReadyToPlay &&
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
      if (!this.isReadyToPlay) return;
      const media = this.currentMedia;
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
      const media = this.currentMedia;
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
      const media = this.currentMedia;
      if (media && media.removeEventListener) {
        media.removeEventListener("timeupdate", this.syncSub);
      }
      if (!this.isReadyToPlay) return;
      if (media) {
        let realIndex = this.sentenceIndex - 1;
        media.play();
        media.currentTime = this.srtSubtitles[realIndex].startTime;
        this.intervalId = setInterval(() => {
          this.sessionEnd();
        }, 10);
      }
    },

    sessionEnd() {
      const media = this.currentMedia;
      let realIndex = this.sentenceIndex - 1;
      if (media.currentTime >= this.srtSubtitles[realIndex].endTime) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        media.pause();
        if (this.playCount >= this.repeatTimes) {
          this.cleanUp();
          if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.isPauseAfterFirstDone
          ) {
            this.pauseAfterFirstDone = true;
            return;
          }
          this.timeOutId = setTimeout(() => {
            if (this.isUtterTransLine && !this.isUtterTransLineFirstly) {
              this.utterTransLine();
            } else {
              if (
                this.autoPlayNext &&
                this.sentenceIndex < this.srtSubtitles.length
              ) {
                this.sentenceIndex = this.sentenceIndex + 1;
                if (!this.autoPlay) {
                  this.cleanUp();
                  return;
                }
                this.singleModePlay();
              }
            }
          }, this.interval * 1000);
        } else {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (this.currentMedia) this.currentMedia.pause();
          if (this.timeOutId) clearTimeout(this.timeOutId);
          if (this.currentMedia && this.currentMedia.removeEventListener) {
            this.currentMedia.removeEventListener("timeupdate", this.syncSub);
          }
          this.timeOutId = setTimeout(() => {
            this.loopPlay();
          }, this.interval * 1000);
        }
      }
    },

    loopPlay() {
      this.isSingle = true;
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia) this.currentMedia.pause();
      this.playSection();
      if (this.currentSpeed.split(",")[this.playCount]) {
        this.currentMedia.playbackRate = Number(
          this.currentSpeed.split(",")[this.playCount]
        );
      } else {
        this.currentMedia.playbackRate = 1;
      }
      this.playCount++;
    },
    autoDetectLangInTrans() {
      if (this.isEnglish && !this.srtSubtitles[0].content.split("\r\n")[1])
        this.isUtterTransLine = false;
      else this.isUtterTransLine = true;
      if (this.isEnglish && this.srtSubtitles[0].content.split("\r\n")[1]) {
        this.lineNumOfTrans = 2;
      } else this.lineNumOfTrans = 1;
    },
    async save() {
      let customConfig =
        "customConfig" +
        "::" +
        JSON.stringify(this.repeatTimes) +
        "::" +
        JSON.stringify(this.interval) +
        "::" +
        JSON.stringify(this.autoPlayNext) +
        "::" +
        JSON.stringify(this.timeStampChange) +
        "::" +
        JSON.stringify(this.currentSpeed) +
        "::" +
        JSON.stringify(this.subtitleLang) +
        "::" +
        JSON.stringify(this.isUtterTransLine) +
        "::" +
        JSON.stringify(this.pauseTimeTransLine) +
        "::" +
        JSON.stringify(this.speedOfUtter) +
        "::" +
        JSON.stringify(this.isUtterTransLineFirstly) +
        "::" +
        JSON.stringify(this.langInTransLine) +
        "::" +
        JSON.stringify(this.lineNumOfTrans) +
        "::" +
        JSON.stringify(this.isAutoDetectLang) +
        "::" +
        JSON.stringify(this.isPauseAfterFirstDone) +
        "::" +
        JSON.stringify(this.autoPlay) +
        "::" +
        JSON.stringify(this.isPlayFullFavList) +
        "::" +
        JSON.stringify(this.isSystemTTS) +
        "::" +
        JSON.stringify(this.TTSurl) +
        "::" +
        JSON.stringify(this.showNotes) +
        "::";
      let favContent =
        customConfig +
        this.lastStatus +
        "Subtitle:" +
        JSON.stringify(this.favList) +
        "noteList:" +
        JSON.stringify(this.noteList);
      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/!pdj!favorite.txt", favContent, true);
      } catch (error) {
        console.log(error);
      }
    },

    async updatePreview() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();

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
    },

    key(event) {
      if (!this.isReadyToPlay) return;
      if (
        event.which === 39 &&
        this.sentenceIndex < this.srtSubtitles.length &&
        !this.isSetting
      ) {
        // right arrow
        this.cleanUp();
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle) {
          this.singleModePlay();
        } else {
          this.regularPlay();
          this.currentMedia.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
        }
      } else if (
        event.which === 37 &&
        this.sentenceIndex > 1 &&
        !this.isSetting
      ) {
        // left arrow
        this.cleanUp();
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle) {
          this.singleModePlay();
        } else {
          this.regularPlay();
          this.currentMedia.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
        }
      } else if (event.which === 38) {
        // up arrow
        this.cleanUp(); //stop play
      } else if (event.which === 40 && !this.isSetting) {
        // down arrow
        this.cleanUp();
        if (this.isSingle) {
          if (this.pauseAfterFirstDone) {
            this.pauseAfterFirstDone = false;
            if (this.isUtterTransLineFirstly) this.loopPlay();
            else this.utterTransLine();
          } else {
            this.singleModePlay();
          }
        } else {
          setTimeout(() => {
            this.regularPlay();
            this.currentMedia.currentTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
          }, 1);
        }
      } else if (event.which === 27) {
        // esc
        this.close();
      }
    },
    handleResize() {
      this.resized = true;
    },
    close() {
      this.cleanUp();
      this.$store.commit("updateRequest", {});
      let uri = url.removeLastDir(this.$route.path) + "/";
      if (this.resized) {
        Vue.nextTick(() => {
          location.assign(uri);
        });
      }
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
  padding-top: 5em;
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
  width: 8em;
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
  width: 65%;
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
  width: 100%;
  height: 100%;
  padding: 1em;
  border-radius: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: grey;
}

input:disabled {
  background-color: #bbbaba;
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
    width: 5em;
    padding: 0;
    margin: 0;
  }
}
@media screen and (max-width: 736px) and (orientation: landscape) {
  #repeater .repeater {
    padding-top: 4.5em;
  }
  #repeater .repeater span p {
    margin-block-start: 0.2em;
    margin-block-end: 0.2em;
  }
}
</style>
