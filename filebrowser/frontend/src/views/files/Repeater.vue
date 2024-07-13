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
          :style="{
            flexGrow: isMobile ? '1' : '0',
          }"
          style="color: blue"
          icon="close"
          :label="$t('buttons.close')"
          @action="close()"
        />
        <title
          style="flex-grow: 1; white-space: nowrap"
          v-if="!isMobile && isFavOnPlay"
        >
          {{ srtSubtitles[this.sentenceIndex - 1].mediaName }}
        </title>
        <title
          style="flex-grow: 1; white-space: nowrap"
          v-if="!isMobile && !isFavOnPlay"
        >
          {{ mediaName }}
        </title>
        <span
          @click="switchShowList()"
          :style="{
            pointerEvents: isSetting || !isSingle ? 'none' : 'auto',
          }"
          style="cursor: pointer"
        >
          <span
            class="headSubject"
            style="
              text-align: right;
              border: none;
              padding: 0;
              margin: 0 0.5em 0 0;
            "
            :style="{
              color:
                isSetting || !isSingle
                  ? 'grey'
                  : showSubtitleList
                  ? 'red'
                  : showNewWordList
                  ? 'black'
                  : 'blue',
            }"
            >{{ sentenceIndex }}/{{ srtSubtitles.length }}&dArr;</span
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
          :disabled="loading || favList.length == 0 || isSetting || !isSingle"
          class="action"
          @click="playFavList"
          :title="$t('repeater.playFavoriteList')"
        >
          <i :style="favListStatus" class="material-icons">folder_special</i>
        </button>
        <button
          :disabled="
            loading || !isSingle || showSubtitleList || showNewWordList
          "
          class="action"
          @click="onSetting"
          :title="$t('repeater.settings')"
        >
          <i
            :style="{
              color:
                !isSingle || showSubtitleList || showNewWordList
                  ? 'grey'
                  : isSetting
                  ? 'red'
                  : 'blue',
            }"
            class="material-icons"
            >settings</i
          >
        </button>
        <button
          v-if="srtSubtitles"
          :disabled="
            loading ||
            isSetting ||
            !isSingle ||
            showSubtitleList ||
            showNewWordList ||
            isFavOnPlay
          "
          class="action"
          @click="switchEditSubandNote"
          :title="$t('repeater.editSubandNote')"
        >
          <i
            :style="{
              color:
                isSetting ||
                !isSingle ||
                showSubtitleList ||
                showNewWordList ||
                isFavOnPlay
                  ? 'grey'
                  : isEditSubandNotes
                  ? 'red'
                  : 'blue',
            }"
            class="material-icons"
            >edit</i
          >
        </button>
        <button
          :disabled="
            loading ||
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes
          "
          class="action"
          @click="switchSubtitle"
          :title="$t('repeater.switchsubtitleLanguages')"
        >
          <i :style="subSwitch" class="material-icons">closed_caption</i>
        </button>
        <button
          v-if="isSingle"
          :disabled="
            loading ||
            isFavOnPlay ||
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes
          "
          class="action"
          @click="onSingle"
          :title="$t('repeater.singleSentenceRepetitionMode')"
        >
          <i :style="playMode" class="material-icons">repeat_one</i>
        </button>
        <button
          v-if="!isSingle"
          :disabled="loading"
          class="action"
          @click="onSingle"
          :title="$t('repeater.regularMode')"
        >
          <i :style="playMode" class="material-icons">repeat</i>
        </button>
      </header-bar>
      <div
        v-if="isSlowInternet"
        style="
          z-index: 1011;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 2.5em;
        "
      >
        <p style="color: white; background-color: red">
          Slow Internet! Replay...
        </p>
      </div>
      <div
        v-if="savedToSrt"
        style="
          z-index: 1011;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 0.5em;
          font-size: 1.5em;
        "
      >
        <p style="color: blue; background-color: grey; padding: 0.3em">Saved</p>
      </div>
      <div
        v-if="ShowSwitchSubtitle"
        style="
          z-index: 1011;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 2.5em;
        "
      >
        <p style="color: white; background-color: blueviolet">
          {{ indicateSub }}
        </p>
      </div>
      <div
        v-if="showSubtitleList"
        style="
          color: whitesmoke;
          z-index: 1010;
          display: flex;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 3.5em;
          bottom: 1.5em;
        "
        :style="{
          width: isMobile ? '100%' : '65%',
        }"
      >
        <ul
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 1em;
            border-radius: 10px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: grey;
            list-style-type: none;
          "
        >
          <li
            v-for="(subtitle, index) in srtSubtitles"
            :key="index"
            :id="index + 1"
            @click="chooseSentence(index)"
          >
            <p
              :style="{
                color: sentenceIndex == index + 1 ? 'blue' : 'white',
              }"
            >
              {{ index + 1 }}.
              {{ subtitle.content.split("\r\n")[0] }}&nbsp;&nbsp; -
              {{ subtitle.content.split("\r\n")[1] }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
          </li>
        </ul>
      </div>
      <div
        v-if="showNewWordList"
        style="
          color: whitesmoke;
          z-index: 1010;
          display: flex;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 3.5em;
          bottom: 1.5em;
        "
        :style="{
          width: isMobile ? '100%' : '65%',
        }"
      >
        <ul
          v-if="newWordList.length > 0"
          id="myWordList"
          @click="highLightItem"
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 1em;
            border-radius: 10px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: grey;
            list-style-type: none;
          "
        >
          <li
            v-for="(newWord, index) in newWordList"
            :key="index"
            :id="index + 1"
            @click="chooseSentence(newWord.num, index)"
          >
            <p v-if="!newWord.showTrans && !withTrans" style="color: white">
              {{ index + 1 }}. {{ newWord.origin }}
            </p>
            <p v-if="newWord.showTrans && !withTrans" style="color: white">
              {{ index + 1 }}.
              {{ newWord.origin }}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{{
                newWord.trans
              }}
            </p>
            <p v-if="withTrans" style="color: white !important">
              {{ index + 1 }}.
              {{ newWord.origin }}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{{
                newWord.trans
              }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
          </li>
        </ul>
        <div
          v-if="newWordList.length == 0"
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 1em;
            border-radius: 10px;
            background: grey;
            top: 1em;
          "
        >
          <p>No New Words defined!</p>
          <p>
            Add a new word or phrase in sentence's note line in Edit Mode with
            format [Original Text:Translation].
          </p>
        </div>
      </div>
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
              min="0"
              max="1000"
              v-model.number.lazy="repeatTimes"
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
              v-model.number.lazy="interval"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.timestampMove") }}
            </span>
            <input
              class="input input--repeater"
              type="number"
              placeholder="-100"
              step="100"
              v-model.number.lazy="timeStampChangeStart"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.timestampMoveEnd") }}
            </span>
            <input
              class="input input--repeater"
              type="number"
              placeholder="100"
              step="100"
              v-model.number.lazy="timeStampChangeEnd"
            />
          </div>
          <div style="display: block">
            <span class="subject" :style="{ width: isMobile ? '14em' : '16em' }"
              >{{ $t("repeater.speedEachTime") }}
            </span>
            <input
              class="input input--repeater"
              type="text"
              placeholder="1, 0.8, 0.5"
              v-model.lazy="currentSpeed"
            />
          </div>
          <div style="display: block">
            <p
              :style="{
                color: isFavOnPlay && isPlayFullFavList ? '#bbbaba' : 'white',
              }"
            >
              <input type="checkbox" v-model="autoPlay" />
              {{ $t("repeater.autoPlayCurrentSentence") }}
            </p>
            <p style="color: white">
              <input type="checkbox" v-model="autoPlayNext" />
              {{ $t("repeater.autoSwitchtoNextSentence") }}
            </p>
            <p style="color: white">
              <input type="checkbox" v-model="replayFromStart" />
              {{ $t("repeater.replayFromStart") }}
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
              <span style="color: white">
                (<input type="checkbox" v-model="isAutoDetectLang" />
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
                v-model.lazy="TTSurl"
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
                {{ $t("repeater.lineNumOfTrans") }}
              </span>
              <input
                :disabled="!(isUtterTransLine && !isAutoDetectLang)"
                class="input input--repeater"
                type="number"
                min="1"
                max="2"
                v-model.number.lazy="lineNumOfTrans"
              />
            </div>
            <div style="display: block">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#bbbaba'
                      : 'white',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.langInTransLine") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  isAutoDetectLang ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                :placeholder="langInTransLinedefault"
                v-model="langInTransLine"
              />
            </div>
            <div style="display: block">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#bbbaba'
                      : 'white',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{
                  $t("repeater.voice", {
                    totalvoices: totalReaders,
                  })
                }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="number"
                v-model.number.lazy="reader"
                :style="{
                  width: isMobile ? '3em' : '6em',
                }"
              />
              <button
                :disabled="
                  isSystemTTS == 'No' ||
                  !isUtterTransLine ||
                  !hasSpeechSynthesis
                "
                class="action"
                @click="testTTSVoice"
                :title="$t('repeater.testTTSVoice')"
              >
                <i
                  :style="{
                    color:
                      isSystemTTS == 'No' || !isUtterTransLine
                        ? '#bbbaba'
                        : 'blue',
                  }"
                  class="material-icons"
                  >play_circle_outline</i
                >
              </button>
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
                v-model.lazy="pauseTimeTransLine"
              />
            </div>
            <div style="display: block">
              <span
                :style="{
                  color:
                    !isUtterTransLine ||
                    isSystemTTS == 'No' ||
                    !hasSpeechSynthesis
                      ? '#bbbaba'
                      : 'white',
                }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.speedOfUttering") }}
              </span>
              <input
                :disabled="
                  !isUtterTransLine ||
                  isSystemTTS == 'No' ||
                  !hasSpeechSynthesis
                "
                class="input input--repeater"
                type="text"
                v-model.number.lazy="speedOfUtter"
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
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p style="color: white; text-align: justify; text-align-last: left">
              <input type="checkbox" v-model="allowCacheTemp" />
              {{ $t("repeater.allowCache") }}
            </p>
            <p style="color: white; text-align: justify; text-align-last: left">
              {{ $t("repeater.savedfiles", { numOfKeys: numOfKeys }) }}
              <button @click="cacheCleanUp">
                {{ $t("repeater.cleanUpCache") }}
              </button>
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
              <i style="color: white" class="material-icons">edit</i
              >{{ $t("repeater.instruction13") }}
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
                >{{ sentenceIndex }}/{{ srtSubtitles.length }}&dArr;</span
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
              {{ $t("repeater.github") }}
              <a
                href="https://github.com/niubility000/PDJ-Media-Repeater"
                target="_blank"
                style="color: blue"
              >
                https://github.com/niubility000/PDJ-Media-Repeater</a
              >
            </p>
            <p>
              {{ $t("repeater.youdao") }}
              <a
                href="https://note.youdao.com/s/MI81scdr"
                target="_blank"
                style="color: blue"
              >
                https://note.youdao.com/s/MI81scdr</a
              >
            </p>
            <p>
              {{ $t("repeater.baiduyun") }}
              <a
                href="https://pan.baidu.com/s/1EMm3C3rcWnqqxutBV9W0Mw?pwd=s0wa"
                target="_blank"
                style="color: blue"
              >
                Baidu NetDisk</a
              >
            </p>
          </div>
        </div>
      </div>
      <div class="repeater" style="display: flex">
        <video
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          style="
            max-height: 60%;
            max-width: 100%;
            padding-bottom: 1em;
            padding-top: 0.2em;
          "
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
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="srtSubtitles && isReadyToPlay && isMediaType == 1"
          style="
            width: 100%;
            margin: 0;
            background-color: black;
            top: 0;
            height: 10em;
          "
        >
        </span>
        <span
          v-html="subtitleContent"
          id="subArea"
          @mousedown="startDragS"
          @mouseup="endDragS"
          @touchstart="startTouchS"
          @touchend="endTouchS"
          @dblclick="dblClick"
          v-if="srtSubtitles && isReadyToPlay && !isEditSubandNotes"
          style="
            color: yellow;
            overflow-wrap: break-word;
            width: 100%;
            font-size: 1.5em;
            margin: 0;
          "
          :style="{ top: isMediaType == 1 ? 0 : '4em' }"
        >
        </span>
        <p v-if="isMediaType == 0" style="color: red">
          Can't find {{ req.name.replace(".srt", ".mp4/.mp3") }} in current
          folder. Or the .srt file's format is incorrect, it should be encoded
          using UTF-8.
        </p>
        <p v-if="srtSubtitles == null" style="color: red">
          This .srt file's format is incorrect. It should be encoded using
          UTF-8.
        </p>
        <span
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="srtSubtitles && isReadyToPlay && !isEditSubandNotes"
          style="
            color: white;
            width: 100%;
            overflow-wrap: break-word;
            font-size: 1em;
            margin: auto;
            left: 0;
            right: 0;
            overflow: auto;
          "
        >
          <div
            v-show="!isEmpty"
            style="
              width: 100%;
              background-color: black;
              color: whitesmoke;
              border: none;
              resize: none;
              text-align: center;
            "
          >
            <p v-if="isShowLine3">
              {{
                !isEmpty
                  ? srtSubtitles[sentenceIndex - 1].content.split("\r\n")[2]
                  : "     "
              }}
            </p>
          </div>
        </span>
        <span
          v-if="srtSubtitles && isReadyToPlay && isEditSubandNotes && !isEmpty"
          style="
            overflow-wrap: break-word;
            width: 100%;
            margin: 0;
            font-size: 1.2em;
            background-color: black;
            padding-top: 0;
          "
        >
          <p style="font-size: 1em; padding: 0; margin: 0 0 1.5em 0">
            <span
              @click="startTimeAdd()"
              v-if="isMobile"
              :style="{
                pointerEvents: !isSingle ? 'none' : 'auto',
              }"
              style="cursor: pointer; user-select: none"
            >
              <span
                class="headSubject"
                style="
                  text-align: right;
                  border: none;
                  padding: 0;
                  margin: 0;
                  color: white;
                "
                >&#916;</span
              >
            </span>
            <input
              class="input input--repeater"
              type="number"
              min="0"
              v-model.number.lazy="startTimeTemp"
              step="0.01"
              id="editArea0"
              style="font-size: 1em; padding: 0; margin: 0; width: 5em"
            />
            <span
              @click="startTimeMinus()"
              v-if="isMobile"
              :style="{
                pointerEvents: !isSingle ? 'none' : 'auto',
              }"
              style="cursor: pointer; user-select: none"
            >
              <span
                class="headSubject"
                style="
                  text-align: right;
                  border: none;
                  padding: 0;
                  margin: 0;
                  color: white;
                "
                >&#8711;</span
              >
            </span>
            ---------
            <span
              @click="endTimeAdd()"
              v-if="isMobile"
              :style="{
                pointerEvents: !isSingle ? 'none' : 'auto',
              }"
              style="cursor: pointer; user-select: none"
            >
              <span
                class="headSubject"
                style="
                  text-align: right;
                  border: none;
                  padding: 0;
                  margin: 0;
                  color: white;
                "
                >&#916;</span
              >
            </span>
            <input
              class="input input--repeater"
              type="number"
              min="0"
              v-model.number.lazy="endTimeTemp"
              step="0.01"
              id="editArea00"
              style="font-size: 1em; padding: 0; margin: 0; width: 5em"
            />
            <span
              @click="endTimeMinus()"
              v-if="isMobile"
              :style="{
                pointerEvents: !isSingle ? 'none' : 'auto',
              }"
              style="cursor: pointer; user-select: none"
            >
              <span
                class="headSubject"
                style="
                  text-align: right;
                  border: none;
                  padding: 0;
                  margin: 0;
                  color: white;
                "
                >&#8711;</span
              >
            </span>
          </p>
          <textarea
            v-if="isShowLine1"
            id="editArea1"
            v-model.lazy="subFirstLine"
            placeholder="...Subtitle's First Line..."
            rows="2"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              padding: 0;
            "
          ></textarea>
          <textarea
            v-if="isShowLine2"
            id="editArea2"
            v-model.lazy="subSecLine"
            placeholder="...Subtitle's Second Line..."
            rows="2"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              padding: 0.5em 0;
            "
          ></textarea>
          <textarea
            v-show="!isEmpty && isShowLine3"
            id="editArea3"
            rows="2"
            v-model.lazy="note"
            placeholder="...NOTES..., use format [Original Text: Translation] to add a New Word or Phrase."
            style="
              width: 100%;
              font-size: 0.8em;
              background-color: black;
              color: whitesmoke;
              border: none;
              resize: none;
              text-align: center;
              padding: 0;
              white-space: pre-wrap;
            "
          ></textarea>
        </span>
        <div
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="srtSubtitles && isReadyToPlay"
          style="width: 100%; flex-grow: 1"
        ></div>
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
      <div
        v-if="showAddNew"
        :disabled="loading || isSetting || !isSingle"
        style="z-index: 1011; position: fixed; bottom: 2.5em; right: 1em"
      >
        <button
          v-if="!showEditNew"
          class="action"
          @click="addANewWord"
          :title="$t('repeater.fav')"
        >
          <i style="color: white; font-size: 2.5em" class="material-icons"
            >add_circle</i
          >
        </button>
        <div
          v-if="showEditNew"
          style="border-radius: 10px; background: grey; padding: 0.3em"
        >
          <p style="text-align: justify; text-align-last: left; color: white">
            <span style="width: 8em"> New word/phrase: </span>
            <input
              style="padding: 0.2em; width: 9em"
              class="input input--repeater"
              type="text"
              v-model="newWord"
            />
          </p>
          <p style="text-align: justify; color: white">
            <input
              style="width: 15.5em; padding: 0.2em; margin-right: 0.5em"
              class="input input--repeater"
              type="text"
              placeholder="Translation"
              v-model="newTranslation"
            />
            <button class="action" @click="saveWordToSRT">
              <i
                style="color: blue; width: 1em; padding: 0"
                class="material-icons"
                >save</i
              >
            </button>
          </p>
        </div>
      </div>
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
import localforage from "localforage";

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
      interval: 2,
      playCount: 0,
      utterInProcess: false,
      playInProcess: false,
      replayFromStart: false,
      timeOutId: null,
      intervalId: null,
      intervalId1: null,
      autoPlayNext: true,
      autoPlay: true,
      timeStampChangeStart: 0,
      timeStampChangeEnd: 0,
      currentSpeed: "1, 0.8, 0.5",
      listing: null,
      isSetting: false,
      isEmpty: false,
      isSingle: true,
      favList: [],
      isFav: false,
      isFavOnPlay: false,
      isReadyToPlay: false,
      subtitleLang: 1,
      isShowLine1: true,
      isShowLine2: true,
      isShowLine3: false,
      isUtterTransLine: true,
      pauseTimeTransLine: 3,
      speedOfUtter: 1,
      isUtterTransLineFirstly: false,
      langInTransLine: navigator.language || navigator.userLanguage,
      langInTransLinedefault: navigator.language || navigator.userLanguage,
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
      isSystemTTS: "Yes",
      contentAll: null,
      note: "     ",
      confirmType: "",
      showSubtitleList: false,
      showNewWordList: false,
      sessionLength: null,
      isSlowInternet: false,
      isEditSubandNotes: false,
      subFirstLine: "     ",
      startTimeTemp: 0,
      endTimeTemp: 0,
      noSave: false,
      subSecLine: "     ",
      ShowSwitchSubtitle: false,
      firstMount: true,
      allowCache: Number(window.localStorage.getItem("cacheOn")) == 1,
      allowCacheTemp: Number(window.localStorage.getItem("cacheOn")) == 1,
      numOfKeys: 0,
      playFromCache: false,
      savedToSrt: false,
      reader: 0,
      showAddNew: false,
      showEditNew: false,
      newWord: " ",
      newTranslation: "",
      withTrans: false,
      TTSurl:
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=",
    };
  },
  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),
    isMobile() {
      return window.innerWidth < 736;
    },
    favFileName() {
      return "PDJ-user" + this.user.id + "-favorite.txt";
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
    totalReaders() {
      if (this.hasSpeechSynthesis) {
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.langInTransLine.substring(0, 3) +
          this.langInTransLine.substring(3).toUpperCase();
        return voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        }).length;
      } else return 0;
    },
    subSwitch() {
      if (
        this.isSetting ||
        this.showSubtitleList ||
        this.showNewWordList ||
        this.isEditSubandNotes
      )
        return { color: "grey" };
      if (this.subtitleLang == 1 || this.subtitleLang == 2) {
        return { color: "blue" };
      } else if (this.subtitleLang == 3) {
        return { color: "red" };
      } else if (
        this.subtitleLang == 4 ||
        this.subtitleLang == 5 ||
        this.subtitleLang == 6 ||
        this.subtitleLang == 7
      ) {
        return { color: "green" };
      } else {
        return { color: "black" };
      }
    },
    indicateSub() {
      if (this.subtitleLang == 1) {
        return "1. show Subtitle's First Line and Second Line";
      } else if (this.subtitleLang == 2) {
        return "2. show ALL";
      } else if (this.subtitleLang == 3) {
        return "3. show Note Line onlyshow Subtitle's First Line only";
      } else if (this.subtitleLang == 4) {
        return "4. show Subtitle's First Line only";
      } else if (this.subtitleLang == 5) {
        return "5. show Subtitle's Second Line only";
      } else if (this.subtitleLang == 6) {
        return "6. show Subtitle's First Line and Note Line";
      } else if (this.subtitleLang == 7) {
        return "7. show Subtitle's Second Line and Note Line";
      } else {
        return "8. show NONE";
      }
    },
    playMode() {
      if (
        this.loading ||
        this.isSetting ||
        this.showSubtitleList ||
        this.showNewWordList ||
        this.isEditSubandNotes
      ) {
        return { color: "grey" };
      } else if (this.playFromCache) {
        return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },
    srtSubtitles() {
      if (!this.isFavOnPlay) {
        var formatContent = this.req.content;
        if (formatContent.includes("\r\n"))
          formatContent = formatContent.replaceAll("\r\n", "\n");
        if (formatContent.includes("\n\n\n\n"))
          formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
        if (formatContent.includes("\n\n\n"))
          formatContent = formatContent.replaceAll("\n\n\n", "\n\n");

        if (formatContent.includes("\t\t"))
          formatContent = formatContent.replaceAll("\t\t", "\n");

        var subtitles = [];
        var textSubtitles = formatContent.split("\n\n");
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
              (parseFloat(startMS) + this.timeStampChangeStart) / 1000;
            var endTimeUnformat = textSubtitle[1].split(" --> ")[1];
            if (!endTimeUnformat) return null;
            var endHH = endTimeUnformat.split(":")[0];
            var endMM = endTimeUnformat.split(":")[1];
            var endSS = endTimeUnformat.split(":")[2];
            var endMS = endTimeUnformat.split(",")[1];
            var endTime =
              parseFloat(endHH) * 3600 +
              parseFloat(endMM) * 60 +
              parseFloat(endSS) +
              (parseFloat(endMS) + this.timeStampChangeEnd - 1) / 1000;
            var content = "";
            if (textSubtitle.length >= 3) {
              content = textSubtitle[2]
                .replace(/^\s\s*/, "")
                .replace(/\s\s*$/, "");
              if (content == "") content = " ";
              if (textSubtitle.length > 3) {
                for (var j = 3; j < textSubtitle.length; j++) {
                  content +=
                    "\r\n" +
                    textSubtitle[j].replace(/^\s\s*/, "").replace(/\s\s*$/, "");
                }
              }
            }
            var subtitle = {
              sn: sn,
              timeStamp: textSubtitle[1],
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
    newWordList() {
      var wordList = [];
      var origin = "";
      var trans = "";
      var sIndex = this.sentenceIndex - 1;
      for (var i = 0; i < this.srtSubtitles.length; ++i) {
        if (
          this.srtSubtitles[i].content.split("\r\n")[2] &&
          this.srtSubtitles[i].content.split("\r\n")[2].includes("[")
        ) {
          for (
            var j = 1;
            j < this.srtSubtitles[i].content.split("\r\n")[2].split("[").length;
            ++j
          ) {
            origin = this.srtSubtitles[i].content
              .split("\r\n")[2]
              .split("[")
              [j].split(":")[0];
            trans = this.srtSubtitles[i].content
              .split("\r\n")[2]
              .split("[")
              [j].split(":")[1]
              .split("]")[0];

            if (origin !== "") {
              sIndex = parseInt(this.srtSubtitles[i].sn) - 1;
              var newWordItem = {
                num: sIndex,
                showTrans: false,
                origin: origin,
                trans: trans,
              };
              wordList.push(newWordItem);
            }
          }
        }
      }
      return wordList;
    },

    isMediaType() {
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        if (
          this.srtSubtitles[this.sentenceIndex - 1].mediaName.includes(".mp4")
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

    currentMedia() {
      if (this.isMediaType == 1) {
        return document.getElementById("myAudio");
      } else if (this.isMediaType == 2) {
        return document.getElementById("myVideo");
      } else return null;
    },
    currentFileFavList() {
      let currentMediaName = this.req.name;
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

    subtitleContent() {
      var contentLine1 =
        !this.isEmpty &&
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0] !==
          undefined
          ? this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0]
          : " ";
      var contentLine2 =
        !this.isEmpty &&
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] !==
          undefined
          ? this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1]
          : " ";
      var contentAll = "    ";
      if (this.isShowLine1 && this.isShowLine2) {
        contentAll =
          "<p style='margin-top: 0px'>" +
          contentLine1 +
          "</p><p>" +
          contentLine2 +
          "</p>";
      } else if (this.isShowLine1 && !this.isShowLine2) {
        contentAll = "<p style='margin-top: 0px'>" + contentLine1 + "</p>";
      } else if (!this.isShowLine1 && this.isShowLine2) {
        contentAll = "<p style='margin-top: 0px'>" + contentLine2 + "</p>";
      } else {
        contentAll = " ";
      }
      var highLightWord = "";
      if (
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2] &&
        this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[2]
          .includes("[")
      ) {
        for (
          var i = 1;
          i <
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")[2]
            .split("[").length;
          ++i
        ) {
          if (
            this.srtSubtitles[this.sentenceIndex - 1].content
              .split("\r\n")[2]
              .split("[")
              [i].includes(":")
          ) {
            highLightWord = this.srtSubtitles[this.sentenceIndex - 1].content
              .split("\r\n")[2]
              .split("[")
              [i].split(":")[0];
          } else {
            highLightWord = this.srtSubtitles[this.sentenceIndex - 1].content
              .split("\r\n")[2]
              .split("[")
              [i].split("]")[0];
          }
          var reg = new RegExp("(" + highLightWord + ")", "g");
          if (highLightWord !== "" && highLightWord !== " ")
            contentAll = contentAll.replace(reg, "<font color=red>$1</font>");
        }
      }
      return contentAll;
    },
    isEnglishLine1() {
      let str = this.srtSubtitles[this.sentenceIndex - 1].content
        .split("\r\n")[0]
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");
      return /^[a-zA-Z]/.test(str);
    },
    isEnglishLine2() {
      if (
        !this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ||
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ==
          " "
      )
        return false;
      else {
        let str = this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[1]
          .replace(/^\s\s*/, "")
          .replace(/\s\s*$/, "");
        return /^[a-zA-Z]/.test(str);
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
          srtUrl.split("?")[1]
        );
      } else {
        if (srtUrl && this.isMediaType == 1) {
          return srtUrl.replace(".srt", ".mp3");
        } else if (srtUrl && this.isMediaType == 2) {
          return srtUrl.replace(".srt", ".mp4");
        } else return "";
      }
    },

    isTouchDevice() {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    },
    canUtter() {
      let hasContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfTrans - 1
        ];
      return hasContent !== undefined && hasContent !== " ";
    },
  },
  watch: {
    $route: function () {
      this.updatePreview();
    },
    startTimeTemp: function () {
      if (!this.isEditSubandNotes || this.noSave) {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(() => {
          this.noSave = false;
          clearTimeout(this.timeOutId);
        }, 10);
        return;
      }
      this.saveSub1();
    },
    endTimeTemp: function () {
      if (!this.isEditSubandNotes || this.noSave) {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(() => {
          this.noSave = false;
          clearTimeout(this.timeOutId);
        }, 10);
        return;
      }
      this.saveSub2();
    },
    subFirstLine: function () {
      if (!this.isEditSubandNotes || this.noSave) {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(() => {
          this.noSave = false;
          clearTimeout(this.timeOutId);
        }, 10);
        return;
      }
      this.saveSub();
    },
    subSecLine: function () {
      if (!this.isEditSubandNotes || this.noSave) {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(() => {
          this.noSave = false;
          clearTimeout(this.timeOutId);
        }, 10);
        return;
      }
      this.saveSub();
    },
    note: function () {
      if (!this.isEditSubandNotes || this.noSave) {
        if (this.timeOutId) {
          clearTimeout(this.timeOutId);
        }
        this.timeOutId = setTimeout(() => {
          this.noSave = false;
          clearTimeout(this.timeOutId);
        }, 10);
        return;
      }
      this.saveSub();
    },
    sentenceIndex: function () {
      if (this.isFavOnPlay && this.isPlayFullFavList && this.allowCache)
        this.getCacheMedia();
      if (this.isEditSubandNotes) {
        this.noSave = true;
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].endTime;
        this.subFirstLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
        this.subSecLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
        this.note =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2];
      }
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
      if (this.showSubtitleList) {
        document
          .getElementById(this.sentenceIndex)
          .scrollIntoView({ block: "center", behavior: "smooth" });
      }
    },
    isSetting: function () {
      if (
        !this.isSetting &&
        this.isSystemTTS == "Yes" &&
        !this.hasSpeechSynthesis
      ) {
        this.isSystemTTS = "No";
      }
    },
    repeatTimes: function () {
      if (this.repeatTimes < 0) this.repeatTimes = 0;
      this.repeatTimes = Math.floor(this.repeatTimes);
      this.save();
    },
    replayFromStart: function () {
      this.save();
    },
    interval: function () {
      if (this.interval < 0) this.interval = 0;
      this.interval = Math.floor(this.interval);
      this.save();
    },
    autoPlayNext: function () {
      this.save();
    },
    currentSpeed: function () {
      if (this.currentSpeed == "") this.currentSpeed = "1, 0.8, 0.5";
      this.save();
    },
    timeStampChangeStart: function () {
      this.timeStampChangeStart = Math.floor(this.timeStampChangeStart);
      if (this.timeOutId) {
        clearTimeout(this.timeOutId);
      }
      this.timeOutId = setTimeout(() => {
        this.save();
        clearTimeout(this.timeOutId);
      }, 1);
    },
    timeStampChangeEnd: function () {
      this.timeStampChangeEnd = Math.floor(this.timeStampChangeEnd);
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
      if (this.pauseTimeTransLine < 0) this.pauseTimeTransLine = 0;
      this.pauseTimeTransLine = Math.floor(this.pauseTimeTransLine);
      this.save();
    },
    speedOfUtter: function () {
      if (this.speedOfUtter < 0.1) this.speedOfUtter = 0.1;
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
      this.lineNumOfTrans = Math.floor(this.lineNumOfTrans);
      if (this.lineNumOfTrans < 1) this.lineNumOfTrans = 1;
      if (this.lineNumOfTrans > 2) this.lineNumOfTrans = 2;
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
    allowCacheTemp() {
      if (this.allowCacheTemp) window.localStorage.setItem("cacheOn", 1);
      else window.localStorage.setItem("cacheOn", 0);
      setTimeout(() => {
        this.close();
      }, 300);
    },
    reader() {
      if (this.hasSpeechSynthesis) {
        if (this.reader < 1) this.reader = 1;
        this.reader = Math.floor(this.reader);
        window.localStorage.setItem("reader", this.reader);
      } else this.reader = 0;
    },
    raw: function () {
      this.isReadyToPlay = false;
      this.playCount = 0;
      this.firstMount = false;
      this.isFirstClick = true;
      if (this.isFavOnPlay && this.isAutoDetectLang)
        this.autoDetectLangInTrans();
    },
  },

  async mounted() {
    window.addEventListener("keydown", this.key);
    window.addEventListener("resize", this.handleResize);
    this.listing = this.oldReq.items;
    this.updatePreview();
    this.initUtter();
    if (this.req.content == undefined) {
      alert(
        "Can't read content of .srt. The .srt file should be encoded using UTF-8!"
      );
    }
    if (this.req.content.includes("\r\n"))
      this.req.content = this.req.content.replaceAll("\r\n", "\n");
    if (this.req.content.includes("\n\n\n\n"))
      this.req.content = this.req.content.replaceAll("\n\n\n\n", "\n\n");
    if (this.req.content.includes("\n\n\n"))
      this.req.content = this.req.content.replaceAll("\n\n\n", "\n\n");
    if (this.req.content.includes("\t\t"))
      this.req.content = this.req.content.replaceAll("\t\t", "\n");
    this.req.content = this.req.content.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
    if (this.allowCache) this.getCacheMedia();
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
    window.removeEventListener("resize", this.handleResize);
    this.cleanUp1();
  },
  methods: {
    async readyStatus() {
      this.isReadyToPlay = true;
      let vm = this;
      try {
        const pathf = url.removeLastDir(this.$route.path);
        vm.contentAll = await api.fetch(pathf + "/" + this.favFileName);
      } catch (e) {
        this.confirmType = "fetch";
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
        this.timeStampChangeStart = Number(
          JSON.parse(this.contentAll.content.split("::")[4])
        );
        this.timeStampChangeEnd = Number(
          JSON.parse(this.contentAll.content.split("::")[20])
        );
        this.currentSpeed = JSON.parse(this.contentAll.content.split("::")[5]);
        this.subtitleLang = JSON.parse(this.contentAll.content.split("::")[6]);
        this.switchSubtitleMini();
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
        this.isSystemTTS = JSON.parse(this.contentAll.content.split("::")[16]);
        this.TTSurl = JSON.parse(this.contentAll.content.split("::")[17]);
        this.replayFromStart = JSON.parse(
          this.contentAll.content.split("::")[18]
        );
        this.isPlayFullFavList = JSON.parse(
          this.contentAll.content.split("::")[19]
        );
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
        this.favList = JSON.parse(
          this.contentAll.content.split("Subtitle:")[1]
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
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.currentMedia.play();
        this.currentMedia.muted = true;
        setTimeout(() => {
          this.currentMedia.muted = false;
          this.currentMedia.pause();
        }, 1);
        const path = url.removeLastDir(this.$route.path);
        try {
          await api.post(path + "/" + this.req.name, this.req.content, true);
        } catch (error) {
          this.confirmType = "save";
          this.showConfirm();
        }
      }
    },
    cacheMedia() {
      let srtUrl = this.req.name;
      fetch(this.raw)
        .then((response) => response.blob()) // 将响应转换为Blob对象
        .then((blob) => {
          localforage
            .setItem(srtUrl, blob)
            .then(function () {})
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch((error) => {
          console.error("Error fetching or converting URL:", error);
        });
    },

    convertToHMS(milliseconds) {
      milliseconds = Math.round(milliseconds);
      var hours = Math.floor(milliseconds / 3600000);
      milliseconds = milliseconds % 3600000;
      var minutes = Math.floor(milliseconds / 60000);
      milliseconds = milliseconds % 60000;
      var seconds = Math.floor(milliseconds / 1000);
      milliseconds = milliseconds % 1000;

      return {
        hours: ("0" + hours).slice(-2),
        minutes: ("0" + minutes).slice(-2),
        seconds: ("0" + seconds).slice(-2),
        milliseconds: ("0" + milliseconds).slice(-3),
      };
    },

    getCacheMedia() {
      setTimeout(() => {
        let srtUrl;
        if (this.isFavOnPlay && this.isPlayFullFavList) {
          srtUrl = this.srtSubtitles[this.sentenceIndex - 1].rawPath;
        } else srtUrl = this.req.name;
        let vm = this;
        localforage
          .getItem(srtUrl)
          .then(function (value) {
            vm.raw = URL.createObjectURL(value);
            vm.playFromCache = true;
          })
          .catch(function () {
            vm.playFromCache = false;
            vm.cacheMedia();
          });
      }, 50);
    },

    cachedNumber() {
      let vm = this;
      localforage
        .length()
        .then(function (numberOfKeys) {
          vm.numOfKeys = numberOfKeys;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    addANewWord() {
      this.showEditNew = true;
    },
    saveWordToSRT() {
      let newphrase = "[" + this.newWord + ":" + this.newTranslation + "]; ";
      this.noSave = true;
      this.cleanUp1();
      this.cleanUp2();
      this.startTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].startTime;
      this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].endTime;
      this.subFirstLine =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
      this.subSecLine =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
      this.note =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2];
      if (this.note == undefined) this.note = "";
      this.note = this.note + newphrase;
      this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2] =
        this.note;
      this.saveSub();
      this.click();
    },
    getReader() {
      if (!this.hasSpeechSynthesis) this.reader = 0;
      if (window.localStorage.getItem("reader") == null) this.reader = 1;
      else this.reader = Number(window.localStorage.getItem("reader"));
    },
    initUtter() {
      this.audio = new Audio();
      if (this.hasSpeechSynthesis) {
        this.utterThis = new SpeechSynthesisUtterance();
      }
    },
    firstClick() {
      if (!(this.isMediaType == 1 && this.isSystemTTS == "No"))
        this.utterTransLine();
      if (this.audio) this.audio.muted = true;
      this.currentMedia.play();
      this.currentMedia.currentTime =
        this.srtSubtitles[this.sentenceIndex - 1].startTime;
      this.currentMedia.muted = true;
      setTimeout(() => {
        this.currentMedia.muted = false;
        if (this.audio) this.audio.muted = false;
        this.cleanUp2();
        this.cleanUp1();
        if (
          this.firstMount &&
          (this.currentMedia.currentTime <
            this.srtSubtitles[this.sentenceIndex - 1].startTime - 0.2 ||
            this.currentMedia.currentTime >
              this.srtSubtitles[this.sentenceIndex - 1].startTime + 0.2)
        ) {
          window.sessionStorage.setItem("isBrowserHiJack", true);
          location.reload();
        }
      }, 1);
      this.isFirstClick = false;
    },
    singleModePlay() {
      this.cleanUp1();
      if (!this.isReadyToPlay) return;

      if (this.replayFromStart) {
        if (
          this.isUtterTransLine &&
          this.isUtterTransLineFirstly &&
          this.canUtter
        ) {
          this.currentMedia.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.utterTransLine();
        } else this.loopPlay();
      } else {
        if (
          (this.isUtterTransLine &&
            this.isUtterTransLineFirstly &&
            this.canUtter &&
            !this.playInProcess) ||
          this.utterInProcess
        ) {
          this.currentMedia.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;
          this.utterTransLine();
        } else this.loopPlay();
      }
    },
    chooseSentence(index, indexWordList) {
      this.sentenceIndex = index;
      this.sentenceIndex = index + 1;
      if (this.showNewWordList && !this.withTrans) {
        this.newWordList[indexWordList].showTrans = true;
      }
      this.cleanUp1();
      this.cleanUp2();
      this.click();
    },
    switchShowList() {
      if (!this.showSubtitleList && !this.showNewWordList) {
        this.showSubtitleList = true;
      } else if (this.showSubtitleList && !this.showNewWordList) {
        this.showSubtitleList = false;
        this.showNewWordList = true;
      } else if (
        !this.showSubtitleList &&
        this.showNewWordList &&
        !this.withTrans
      ) {
        this.withTrans = true;
      } else if (
        !this.showSubtitleList &&
        this.showNewWordList &&
        this.withTrans
      ) {
        this.showNewWordList = false;
        this.withTrans = false;
      }
      if (this.showSubtitleList) {
        setTimeout(() => {
          document
            .getElementById(this.sentenceIndex)
            .scrollIntoView({ block: "center", behavior: "smooth" });
        }, 100);
      }
    },

    testTTSurl() {
      let transLineContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfTrans - 1
        ];
      let text =
        transLineContent !== undefined && transLineContent !== " "
          ? transLineContent
          : "no content";
      let ttsFullUrl = this.TTSurl + text;
      fetch(ttsFullUrl)
        .then(() => {
          this.audio.src = ttsFullUrl;
          this.audio.play();
          this.audio.addEventListener("ended", this.endTestUtter, false);
        })
        .catch((error) => console.error("Error Uttering Trans Line:", error));
    },
    testTTSVoice() {
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        this.cleanUp1();
        this.cleanUp2();
        let transLineContent =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ];
        this.utterThis.text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : "no content";
        if (this.langInTransLine == "") {
          this.langInTransLine = navigator.language || navigator.userLanguage;
        }
        this.utterThis.lang = this.langInTransLine;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.langInTransLine.substring(0, 3) +
          this.langInTransLine.substring(3).toUpperCase();
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.reader - 1];
        window.speechSynthesis.speak(this.utterThis);
        this.utterThis.onend = () => {
          this.cleanUp2();
          this.cleanUp1();
        };
      }
    },
    endTestUtter() {
      this.audio.removeEventListener("ended", this.endTestUtter, false);
      this.cleanUp2();
      this.cleanUp1();
    },
    utterTransLine() {
      this.utterInProcess = true;
      if (this.isUtterTransLine && this.isSystemTTS == "Yes") {
        let transLineContent =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ];
        this.utterThis.text =
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : "no content";
        if (this.isFirstClick) this.utterThis.text = "n";
        if (this.langInTransLine == "") {
          this.langInTransLine = navigator.language || navigator.userLanguage;
        }
        this.utterThis.lang = this.langInTransLine;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.langInTransLine.substring(0, 3) +
          this.langInTransLine.substring(3).toUpperCase();
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.reader - 1];
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
          transLineContent !== undefined &&
          transLineContent !== " " &&
          transLineContent !== ""
            ? transLineContent
            : "no content";
        if (this.isFirstClick) text = "n";
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
      if (this.isEditSubandNotes && !this.isUtterTransLineFirstly) {
        this.cleanUp1();
        this.cleanUp2();
        return;
      }
      if (
        this.isUtterTransLine &&
        this.isUtterTransLineFirstly &&
        this.isPauseAfterFirstDone
      ) {
        this.pauseAfterFirstDone = true;
        this.utterInProcess = false;
        return;
      } else if (
        (!this.autoPlayNext || this.showNewWordList) &&
        this.isUtterTransLine &&
        !this.isUtterTransLineFirstly
      ) {
        this.utterInProcess = false;
        this.cleanUp1();
        return;
      } else {
        this.timeOutId = setTimeout(() => {
          this.utterInProcess = false;
          if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.sentenceIndex < this.srtSubtitles.length
          ) {
            this.sentenceIndex = this.sentenceIndex + 1;
            if (
              !this.autoPlay ||
              (this.isFavOnPlay && this.isPlayFullFavList)
            ) {
              this.cleanUp1();
              return;
            }
            this.singleModePlay();
          } else if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.sentenceIndex == this.srtSubtitles.length
          ) {
            this.cleanUp1();
            return;
          } else {
            this.loopPlay();
          }
        }, this.pauseTimeTransLine * 1000);
      }
    },

    switchSubtitle() {
      this.ShowSwitchSubtitle = true;
      if (this.intervalId1) clearInterval(this.intervalId1);
      this.subtitleLang = this.subtitleLang + 1;
      if (this.subtitleLang == 9) this.subtitleLang = 1;
      this.switchSubtitleMini();
      this.intervalId1 = setTimeout(() => {
        this.ShowSwitchSubtitle = false;
      }, 3000);
    },
    switchSubtitleMini() {
      if (this.subtitleLang == 1) {
        this.isShowLine1 = true;
        this.isShowLine2 = true;
        this.isShowLine3 = false;
      } else if (this.subtitleLang == 2) {
        this.isShowLine1 = true;
        this.isShowLine2 = true;
        this.isShowLine3 = true;
      } else if (this.subtitleLang == 3) {
        this.isShowLine1 = false;
        this.isShowLine2 = false;
        this.isShowLine3 = true;
      } else if (this.subtitleLang == 4) {
        this.isShowLine1 = true;
        this.isShowLine2 = false;
        this.isShowLine3 = false;
      } else if (this.subtitleLang == 5) {
        this.isShowLine1 = false;
        this.isShowLine2 = true;
        this.isShowLine3 = false;
      } else if (this.subtitleLang == 6) {
        this.isShowLine1 = true;
        this.isShowLine2 = false;
        this.isShowLine3 = true;
      } else if (this.subtitleLang == 7) {
        this.isShowLine1 = false;
        this.isShowLine2 = true;
        this.isShowLine3 = true;
      } else if (this.subtitleLang == 8) {
        this.isShowLine1 = false;
        this.isShowLine2 = false;
        this.isShowLine3 = false;
      }
    },

    resetTTSurl() {
      this.TTSurl =
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=";
    },
    cleanUp1() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.currentMedia) this.currentMedia.pause();
      if (this.audio) this.audio.pause();
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
      this.showAddNew = false;
      this.showEditNew = false;
      this.newTranslation = "";
    },
    cleanUp2() {
      if (this.pauseAfterFirstDone) this.pauseAfterFirstDone = false;
      if (this.playInProcess) this.playInProcess = false;
      if (this.utterInProcess) this.utterInProcess = false;
      this.playCount = 0;
    },

    highLightItem(event) {
      if (event.target && event.target.nodeName == "P") {
        event.target.style.color = "blue";
      }
    },

    playFavList() {
      this.cleanUp2();
      this.cleanUp1();
      if (!this.isFavOnPlay) {
        window.sessionStorage.setItem("lastSentenceIndex", this.sentenceIndex);
      }
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.allowCache) this.getCacheMedia();
      if (this.isFavOnPlay) {
        if (this.isEditSubandNotes) this.switchEditSubandNote();
        this.isFav = true;
        this.sentenceIndex = 1;
        if (!this.isPlayFullFavList) {
          this.singleModePlay();
        }
      } else {
        if (this.isPlayFullFavList) {
          this.sentenceIndex = Number(
            window.sessionStorage.getItem("lastSentenceIndex")
          );
        } else {
          if (this.isFirstClick) this.firstClick();
          this.singleModePlay();
        }
      }
    },

    switchIsFav() {
      let srtUrl = api.getDownloadURL(this.req, true);
      let originRaw = "";
      if (srtUrl && this.isMediaType == 1) {
        originRaw = srtUrl.replace(".srt", ".mp3");
      } else if (srtUrl && this.isMediaType == 2) {
        originRaw = srtUrl.replace(".srt", ".mp4");
      } else originRaw = "";
      if (this.isReadyToPlay) {
        this.isFav = !this.isFav;
        if (this.isFav) {
          //add a fav
          var fav = {
            rawPath: this.req.name,
            mediaName: this.mediaName,
            originalRawPath: originRaw.split("?")[0].split("/raw/")[1],
            startTime: this.srtSubtitles[this.sentenceIndex - 1].startTime,
            endTime: this.srtSubtitles[this.sentenceIndex - 1].endTime,
            content: this.srtSubtitles[this.sentenceIndex - 1].content,
          };
          this.favList.push(fav);
          this.save();
        } else {
          //remove a fav
          if (this.isFavOnPlay) {
            this.cleanUp2();
            this.cleanUp1();
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

    switchEditSubandNote() {
      this.isEditSubandNotes = !this.isEditSubandNotes;
      if (this.isEditSubandNotes) {
        this.noSave = true;
        this.cleanUp1();
        this.cleanUp2();
        this.isShowLine1 = true;
        this.isShowLine2 = true;
        this.isShowLine3 = true;
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].endTime;
        this.subFirstLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
        this.subSecLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
        this.note =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2];
      } else this.switchSubtitleMini();
    },

    startTimeAdd() {
      let temp = (this.startTimeTemp + 0.01).toFixed(3);
      this.startTimeTemp = parseFloat(temp);
      this.saveSub1();
    },

    startTimeMinus() {
      let temp = (this.startTimeTemp - 0.01).toFixed(3);
      this.startTimeTemp = parseFloat(temp);
      this.saveSub1();
    },

    endTimeAdd() {
      let temp = (this.endTimeTemp + 0.01).toFixed(3);
      this.endTimeTemp = parseFloat(temp);
      this.saveSub2();
    },
    endTimeMinus() {
      let temp = (this.endTimeTemp - 0.01).toFixed(3);
      this.endTimeTemp = parseFloat(temp);
      this.saveSub2();
    },

    showConfirm() {
      if (this.confirmType == "fetch") {
        var userConfirmation = window.confirm(
          this.$t("repeater.favoriteClearConfirm", {
            favFileName: this.favFileName,
          })
        );
        if (userConfirmation) {
          this.favList = [];
          if (this.isAutoDetectLang) this.autoDetectLangInTrans();
          if (!this.hasSpeechSynthesis) {
            this.isSystemTTS = "No";
          }
          this.save();
          this.currentMedia.play();
          this.currentMedia.muted = true;
          setTimeout(() => {
            this.currentMedia.muted = false;
            this.currentMedia.pause();
          }, 1);
        } else {
          this.cleanUp1();
          this.close();
        }
      }
      if (this.confirmType == "save") {
        alert(
          "Error! Can't save change to your favorite file. Please retry later."
        );
      }
    },
    onSingle() {
      this.isSingle = !this.isSingle;
      if (!this.isSingle) {
        this.isEditSubandNotes = false;
        this.cleanUp2();
        this.cleanUp1();
        this.regularPlay();
        this.currentMedia.currentTime = 0;
        this.currentMedia.addEventListener("focus", this.removeFocus);
      }
      if (this.isSingle) {
        this.cleanUp2();
        this.isEmpty = false;
        if (this.isFirstClick) this.firstClick();
        this.singleModePlay();
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.currentMedia.removeEventListener("focus", this.removeFocus);
      }
    },
    removeFocus() {
      this.currentMedia.blur();
    },
    cacheCleanUp() {
      localforage
        .clear()
        .then(function () {
          console.log("Database is now empty.");
        })
        .catch(function (err) {
          console.log(err);
        });
      this.cachedNumber();
    },

    onSetting() {
      this.cachedNumber();
      this.getReader();
      this.isSetting = !this.isSetting;
      if (this.isSetting) {
        this.cleanUp2();
        this.cleanUp1();
      } else {
        setTimeout(() => {
          this.cleanUp2();
          if (this.isFirstClick) this.firstClick();
          this.singleModePlay();
        }, 1);
      }
      return;
    },
    click: function () {
      if (this.isFirstClick) this.firstClick();
      this.touches++;
      setTimeout(() => {
        this.cleanUp1();
        if (this.isEditSubandNotes) {
          if (
            document.getElementById("editArea0") &&
            document
              .getElementById("editArea0")
              .contains(document.activeElement)
          ) {
            document.getElementById("editArea0").blur();
          } else if (
            document.getElementById("editArea00") &&
            document
              .getElementById("editArea00")
              .contains(document.activeElement)
          ) {
            document.getElementById("editArea00").blur();
          } else if (
            document.getElementById("editArea1") &&
            document
              .getElementById("editArea1")
              .contains(document.activeElement)
          ) {
            document.getElementById("editArea1").blur();
          } else if (
            document.getElementById("editArea2") &&
            document
              .getElementById("editArea2")
              .contains(document.activeElement)
          ) {
            document.getElementById("editArea2").blur();
          } else if (
            document.getElementById("editArea3") &&
            document
              .getElementById("editArea3")
              .contains(document.activeElement)
          ) {
            document.getElementById("editArea3").blur();
          }
        }
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
      if (this.touches == 2) {
        //double click
        this.cleanUp1();
        this.touches = 0;
        return;
      }
    },

    dblClick(event) {
      event.preventDefault();
      this.cleanUp1();
      this.touches = 0;
      return;
    },

    startDrag(event) {
      event.preventDefault();
      this.startDragS(event);
    },
    startDragS(event) {
      if (!this.isReadyToPlay || this.isTouchDevice) return;
      this.isSetting = false;
      this.showSubtitleList = false;
      this.showNewWordList = false;
      this.withTrans = false;
      this.startTime = new Date().getTime();
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    endDrag(event) {
      event.preventDefault();
      this.endDragS(event);
    },
    endDragS(event) {
      if (!this.isReadyToPlay || this.isTouchDevice) return;
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
      if (
        window.getSelection().toString() &&
        window.getSelection().toString() !== "" &&
        window.getSelection().toString() !== " " &&
        document.getElementById("subArea") &&
        document.getElementById("subArea").contains(event.target)
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        window.getSelection().removeAllRanges();
        this.showAddNew = false;
        this.showEditNew = false;
        this.click();
      }
    },

    startTouch(event) {
      event.preventDefault();
      this.startTouchS(event);
    },
    startTouchS(event) {
      if (!this.isReadyToPlay) return;
      this.isSetting = false;
      this.showSubtitleList = false;
      this.showNewWordList = false;
      this.withTrans = false;
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    endTouch(event) {
      event.preventDefault();
      this.endTouchS(event);
    },
    endTouchS(event) {
      if (!this.isReadyToPlay) return;
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
      if (
        window.getSelection().toString() &&
        window.getSelection().toString() !== "" &&
        window.getSelection().toString() !== " " &&
        document.getElementById("subArea") &&
        document.getElementById("subArea").contains(event.target)
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        window.getSelection().removeAllRanges();
        this.showAddNew = false;
        this.showEditNew = false;
        this.click();
      }
    },

    checkNav(x, mode) {
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex >= 1) {
        this.cleanUp2();
        this.cleanUp1();
        if (this.sentenceIndex == 1) return;
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp1();
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
        this.sentenceIndex <= this.srtSubtitles.length
      ) {
        this.cleanUp2();
        this.cleanUp1();
        if (this.sentenceIndex == this.srtSubtitles.length) return;
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp1();
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
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
      if (!this.isReadyToPlay) return;
      if (this.currentMedia) {
        this.currentMedia.play();
        if (this.currentSpeed.split(",")[this.playCount]) {
          this.currentMedia.playbackRate = Number(
            this.currentSpeed.split(",")[this.playCount]
          );
        } else {
          this.currentMedia.playbackRate = 1;
        }
        this.sessionLength =
          (this.srtSubtitles[this.sentenceIndex - 1].endTime -
            this.srtSubtitles[this.sentenceIndex - 1].startTime +
            2) /
          this.currentMedia.playbackRate;
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.startTime = new Date().getTime();
        this.intervalId = setInterval(() => {
          this.sessionEnd();
        }, 100);
      }
    },

    sessionEnd() {
      this.timeDiff = (new Date().getTime() - this.startTime) / 1000;
      if (this.timeDiff > this.sessionLength) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.isSlowInternet = true;
        setTimeout(() => {
          this.isSlowInternet = false;
        }, 2000);
        this.currentMedia.pause();
        this.playSection();
        return;
      }
      if (
        this.currentMedia.currentTime >=
        this.srtSubtitles[this.sentenceIndex - 1].endTime
      ) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.currentMedia.pause();
        if (this.playCount >= this.repeatTimes - 1) {
          if (this.replayFromStart) this.playCount = 0;
          this.cleanUp1();
          if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.isPauseAfterFirstDone
          ) {
            this.playCount = 0;
            this.playInProcess = false;
            this.pauseAfterFirstDone = true;
            return;
          }
          this.timeOutId = setTimeout(() => {
            this.playCount = 0;
            this.playInProcess = false;
            if (
              this.isUtterTransLine &&
              !this.isUtterTransLineFirstly &&
              this.canUtter
            ) {
              this.utterTransLine();
            } else {
              if (
                this.autoPlayNext &&
                !this.isEditSubandNotes &&
                !this.showNewWordList &&
                this.sentenceIndex < this.srtSubtitles.length
              ) {
                this.sentenceIndex = this.sentenceIndex + 1;
                if (
                  !this.autoPlay ||
                  (this.isFavOnPlay && this.isPlayFullFavList)
                ) {
                  this.cleanUp1();
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
            this.playCount++;
            this.loopPlay();
          }, this.interval * 1000);
        }
      }
    },
    loopPlay() {
      this.isSingle = true;
      this.playInProcess = true;
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia) this.currentMedia.pause();
      if (this.repeatTimes < 1) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        if (this.replayFromStart) this.playCount = 0;
        this.cleanUp1();
        if (
          this.isUtterTransLine &&
          !this.isUtterTransLineFirstly &&
          this.isPauseAfterFirstDone
        ) {
          this.playCount = 0;
          this.playInProcess = false;
          this.pauseAfterFirstDone = true;
          return;
        }
        this.playCount = 0;
        this.playInProcess = false;
        if (
          this.isUtterTransLine &&
          !this.isUtterTransLineFirstly &&
          this.canUtter
        ) {
          this.utterTransLine();
        } else {
          if (
            this.autoPlayNext &&
            !this.isEditSubandNotes &&
            !this.showNewWordList &&
            this.sentenceIndex < this.srtSubtitles.length
          ) {
            this.sentenceIndex = this.sentenceIndex + 1;
            if (
              !this.autoPlay ||
              (this.isFavOnPlay && this.isPlayFullFavList)
            ) {
              this.cleanUp1();
              return;
            }
            this.singleModePlay();
          }
        }
        return;
      }
      this.playSection();
    },
    autoDetectLangInTrans() {
      if (
        !this.isEnglishLine1 &&
        !(
          !this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0] ||
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0] ==
            " "
        )
      ) {
        this.isUtterTransLine = true;
        this.lineNumOfTrans = 1;
      } else if (
        !this.isEnglishLine2 &&
        !(
          !this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ||
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ==
            " "
        )
      ) {
        this.isUtterTransLine = true;
        this.lineNumOfTrans = 2;
      } else this.isUtterTransLine = false;
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
        JSON.stringify(this.timeStampChangeStart) +
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
        JSON.stringify(this.isSystemTTS) +
        "::" +
        JSON.stringify(this.TTSurl) +
        "::" +
        JSON.stringify(this.replayFromStart) +
        "::" +
        JSON.stringify(this.isPlayFullFavList) +
        "::" +
        JSON.stringify(this.timeStampChangeEnd) +
        "::";

      let favContent =
        customConfig + "Subtitle:" + JSON.stringify(this.favList);
      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/" + this.favFileName, favContent, true);
      } catch (error) {
        this.confirmType = "save";
        this.showConfirm();
      }
    },

    async saveSub() {
      var tempContent = this.req.content;
      var newContent = this.srtSubtitles[this.sentenceIndex - 1].timeStamp;

      if (this.subFirstLine !== undefined) {
        this.subFirstLine = this.subFirstLine.replaceAll("\n", "");
        if (
          this.subFirstLine == "" &&
          ((this.subSecLine !== undefined && this.subSecLine !== "") ||
            (this.note !== undefined && this.note !== ""))
        )
          this.subFirstLine = " ";
        if (this.subFirstLine !== "")
          newContent = newContent + "\n" + this.subFirstLine;
      }
      if (this.subSecLine !== undefined) {
        this.subSecLine = this.subSecLine.replaceAll("\n", "");
        if (
          this.subSecLine == "" &&
          this.note !== undefined &&
          this.note !== ""
        )
          this.subSecLine = " ";
        if (this.subSecLine !== "")
          newContent = newContent + "\n" + this.subSecLine;
      }
      if (
        (this.subSecLine == "" || this.subSecLine == undefined) &&
        this.note !== undefined &&
        this.note !== ""
      )
        newContent = newContent + "\n ";

      if (this.note !== undefined) {
        this.note = this.note.replaceAll("\n", "");
        if (this.note !== "") newContent = newContent + "\n" + this.note;
      }

      var oldContent =
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp +
        tempContent
          .split(this.srtSubtitles[this.sentenceIndex - 1].timeStamp)[1]
          .split("\n\n")[0];

      this.req.content = tempContent.replace(oldContent, newContent);

      this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0] =
        this.subFirstLine;
      this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] =
        this.subSecLine;
      this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2] =
        this.note;

      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/" + this.req.name, this.req.content, true);
      } catch (error) {
        this.confirmType = "save";
        this.showConfirm();
      }
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }
      this.savedToSrt = true;
      setTimeout(() => {
        this.savedToSrt = false;
      }, 400);
    },

    async saveSub1() {
      this.startTimeTemp = parseFloat(this.startTimeTemp.toFixed(3));
      if (
        this.sentenceIndex > 1 &&
        this.startTimeTemp <= this.srtSubtitles[this.sentenceIndex - 2].endTime
      )
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 2].endTime + 0.001;
      if (
        this.startTimeTemp >= this.srtSubtitles[this.sentenceIndex - 1].endTime
      )
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].endTime - 0.001;
      var tempContent = this.req.content;
      var oldContent =
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[0] +
        " --> ";
      var time = this.convertToHMS(
        this.startTimeTemp * 1000 - this.timeStampChangeStart
      );
      var newContent =
        time.hours +
        ":" +
        time.minutes +
        ":" +
        time.seconds +
        "," +
        time.milliseconds +
        " --> ";

      this.req.content = tempContent.replace(oldContent, newContent);

      this.srtSubtitles[this.sentenceIndex - 1].startTime = this.startTimeTemp;
      this.srtSubtitles[this.sentenceIndex - 1].timeStamp = this.srtSubtitles[
        this.sentenceIndex - 1
      ].timeStamp.replace(oldContent, newContent);
      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/" + this.req.name, this.req.content, true);
      } catch (error) {
        this.confirmType = "save";
        this.showConfirm();
      }
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }
      this.savedToSrt = true;
      setTimeout(() => {
        this.savedToSrt = false;
      }, 400);
    },

    async saveSub2() {
      this.endTimeTemp = parseFloat(this.endTimeTemp.toFixed(3));
      if (
        this.endTimeTemp <= this.srtSubtitles[this.sentenceIndex - 1].startTime
      )
        this.endTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].startTime + 0.001;
      if (
        this.sentenceIndex < this.srtSubtitles.length &&
        this.endTimeTemp >= this.srtSubtitles[this.sentenceIndex].startTime
      )
        this.endTimeTemp =
          this.srtSubtitles[this.sentenceIndex].startTime - 0.001;
      var tempContent = this.req.content;
      var oldContent =
        " --> " +
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[1];
      var time = this.convertToHMS(
        this.endTimeTemp * 1000 - this.timeStampChangeEnd + 1
      );
      var newContent =
        " --> " +
        time.hours +
        ":" +
        time.minutes +
        ":" +
        time.seconds +
        "," +
        time.milliseconds;

      this.req.content = tempContent.replace(oldContent, newContent);

      this.srtSubtitles[this.sentenceIndex - 1].endTime = this.endTimeTemp;
      this.srtSubtitles[this.sentenceIndex - 1].timeStamp = this.srtSubtitles[
        this.sentenceIndex - 1
      ].timeStamp.replace(oldContent, newContent);
      const path = url.removeLastDir(this.$route.path);
      try {
        await api.post(path + "/" + this.req.name, this.req.content, true);
      } catch (error) {
        this.confirmType = "save";
        this.showConfirm();
      }
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }
      this.savedToSrt = true;
      setTimeout(() => {
        this.savedToSrt = false;
      }, 400);
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
        if (
          (document.getElementById("editArea0") &&
            document
              .getElementById("editArea0")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea00") &&
            document
              .getElementById("editArea00")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea1") &&
            document
              .getElementById("editArea1")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea2") &&
            document
              .getElementById("editArea2")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea3") &&
            document
              .getElementById("editArea3")
              .contains(document.activeElement))
        )
          return;
        this.cleanUp2();
        this.cleanUp1();
        this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp1();
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
        event.which === 37 &&
        this.sentenceIndex > 1 &&
        !this.isSetting
      ) {
        // left arrow
        if (
          (document.getElementById("editArea0") &&
            document
              .getElementById("editArea0")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea00") &&
            document
              .getElementById("editArea00")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea1") &&
            document
              .getElementById("editArea1")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea2") &&
            document
              .getElementById("editArea2")
              .contains(document.activeElement)) ||
          (document.getElementById("editArea3") &&
            document
              .getElementById("editArea3")
              .contains(document.activeElement))
        )
          return;
        this.cleanUp2();
        this.cleanUp1();
        this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isFavOnPlay && this.isPlayFullFavList) return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.singleModePlay();
          if (!this.autoPlay) {
            setTimeout(() => {
              this.cleanUp1();
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
      } else if (event.which === 38) {
        // up arrow
        this.cleanUp1(); //stop play
      } else if (event.which === 40 && !this.isSetting) {
        // down arrow
        this.cleanUp1();
        if (this.isFirstClick) this.firstClick();
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
      } else if (event.which === 27) {
        // esc
        this.close();
      }
    },
    handleResize() {
      this.resized = true;
    },
    close() {
      if (this.isSetting) {
        this.onSetting();
        return;
      }
      this.cleanUp1();
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
  padding-top: 4em;
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
  top: 4.5em;
  bottom: 0.5em;
  justify-content: center;
  align-items: center;
  z-index: 1010;
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
