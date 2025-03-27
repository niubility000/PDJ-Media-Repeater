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
      <header-bar
        v-if="srtSubtitles"
        style="padding: 0.5em"
        :style="{
          height: isMobile && isLandscape ? '3em' : '4em',
          padding: isMobile && isLandscape ? '0 0.5em' : '0.5em 0em',
        }"
      >
        <action
          :style="{
            color:
              isSetting ||
              onRevision ||
              isDictation ||
              !isSingle ||
              isEditSubandNotes ||
              isFavOnPlay ||
              showSubtitleList ||
              showNewWordList ||
              withTrans ||
              showRevision ||
              showTools
                ? 'red'
                : 'blue',
          }"
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
          :style="{
            flexGrow: isMobile ? '1' : '0',
          }"
        >
        </span>
        <span
          @click="switchShowList()"
          :style="{
            pointerEvents:
              isSetting || showRevision || showTools ? 'none' : 'auto',
          }"
          style="cursor: pointer"
        >
          <span
            style="
              display: inline-block;
              text-align: right;
              border: none;
              padding: 0;
              margin: 0 0.5em 0 0;
              width: 4em;
            "
            :style="{
              color:
                isSetting || showRevision || showTools
                  ? 'grey'
                  : showSubtitleList
                  ? 'red'
                  : showNewWordList && !withTrans
                  ? 'green'
                  : withTrans
                  ? 'black'
                  : 'blue',
            }"
            >{{ sentenceIndex }}/{{ srtSubtitles.length }}</span
          >
        </span>
        <button
          :disabled="
            loading ||
            !isSingle ||
            favList.length == 0 ||
            isSetting ||
            showRevision ||
            showTools
          "
          class="action"
          @click="playFavList"
          @dblclick.prevent
          :title="$t('repeater.playFavoriteList')"
        >
          <i :style="favListStatus" class="material-icons">folder_special</i>
        </button>
        <button
          :disabled="
            loading ||
            showSubtitleList ||
            showNewWordList ||
            showRevision ||
            showTools
          "
          class="action"
          @click="onSetting"
          @dblclick.prevent
          :title="$t('repeater.settings')"
        >
          <i
            :style="{
              color:
                showSubtitleList || showNewWordList || showRevision || showTools
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
            isFavOnPlay ||
            showRevision ||
            showTools ||
            !isReadyToPlay
          "
          class="action"
          @click="switchEditSubandNote"
          @dblclick.prevent
          :title="$t('repeater.editSubandNote')"
        >
          <i
            :style="{
              color:
                isSetting ||
                !isSingle ||
                showSubtitleList ||
                showNewWordList ||
                isFavOnPlay ||
                showRevision ||
                !isReadyToPlay ||
                showTools
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
          v-if="!showTools"
          :disabled="
            loading ||
            isSetting ||
            isDictation ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision
          "
          class="action"
          @click="switchSubtitle"
          @dblclick.prevent
          :title="$t('repeater.switchsubtitleLanguages')"
        >
          <i :style="subSwitch" class="material-icons">closed_caption</i>
        </button>
        <button
          v-if="showTools"
          class="action"
          @click="switchSubtitle"
          @dblclick.prevent
          :title="$t('repeater.subTools')"
        >
          <i style="color: red" class="material-icons">plumbing</i>
        </button>
        <button
          v-if="isSingle && !isDictation"
          :disabled="
            loading ||
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision ||
            showTools
          "
          class="action"
          @click="onSingle"
          @dblclick.prevent
          :title="$t('repeater.singleSentenceRepetitionMode')"
        >
          <i :style="playMode" class="material-icons">repeat_one</i>
        </button>

        <button
          v-if="isSingle && isDictation"
          :disabled="
            loading ||
            isFavOnPlay ||
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision ||
            showTools
          "
          class="action"
          @click="onSingle"
          @dblclick.prevent
          :title="$t('repeater.dictation')"
        >
          <i :style="playMode" class="material-icons">hearing</i>
        </button>

        <button
          v-if="!isSingle"
          :disabled="loading || showRevision || showTools"
          class="action"
          @click="onSingle"
          @dblclick.prevent
          :title="$t('repeater.regularMode')"
        >
          <i :style="playMode" class="material-icons">repeat</i>
        </button>
        <button
          :disabled="
            loading ||
            isSetting ||
            isFavOnPlay ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            !isReadyToPlay ||
            showTools
          "
          class="action"
          @click="switchRevisePlan"
          @dblclick.prevent
          :title="$t('repeater.revise')"
        >
          <i
            :style="{
              color:
                loading ||
                isSetting ||
                isFavOnPlay ||
                showSubtitleList ||
                showNewWordList ||
                isEditSubandNotes ||
                !isReadyToPlay ||
                showTools
                  ? 'grey'
                  : showRevision
                  ? 'red'
                  : onRevision
                  ? 'black'
                  : 'blue',
            }"
            class="material-icons"
            >add_alert</i
          >
        </button>
      </header-bar>

      <div v-if="isSlowInternet" class="showMsg" style="bottom: 2.5em">
        <p style="color: red">
          {{ $t("repeater.slowInternet") }}
        </p>
      </div>

      <div
        v-if="showTools"
        style="
          background-color: gray;
          color: white;
          z-index: 1025;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4.2em;
          bottom: 0.2em;
          border-radius: 10px;
          overflow-y: auto;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
        }"
      >
        <p style="padding: 0 1em; color: blue; font-size: 1.2em">
          {{ $t("repeater.tools") }}
        </p>

        <p style="padding: 0 1em 1em 1em; margin: 0">
          {{ $t("repeater.toolsNote") }}
        </p>

        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(1)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool1") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(2)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool2") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(3)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool3") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(4)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool4") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(5)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool5") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(6)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool6") }}
        </p>
        <p style="padding: 0 1em; margin: 0">
          <button
            class="action"
            style="color: blue"
            @click="saveSpecialSub(7)"
            :title="$t('repeater.saveas')"
          >
            <i class="material-icons">save_as</i>
          </button>
          {{ $t("repeater.tool7") }}
        </p>
      </div>

      <div
        v-if="showRevision"
        style="
          background-color: gray;
          color: white;
          z-index: 1010;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4.2em;
          bottom: 0.2em;
          border-radius: 10px;
          overflow-y: auto;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
        }"
      >
        <p style="padding: 0 1em; color: blue">
          {{ $t("repeater.revise") }}&nbsp;&nbsp;&nbsp;{{ getDateAfterDays(0) }}
        </p>

        <p style="padding: 0 1em">
          {{ $t("repeater.revise1") }}:&nbsp; {{ mediaName }}
        </p>

        <p style="padding: 0 1em">
          {{ $t("repeater.revise4") }}&nbsp;
          <input
            class="input input--repeater"
            style="width: 3.5em; margin: 0; padding: 0"
            type="number"
            min="1"
            v-model.number="indexS"
          />
          &nbsp;to&nbsp;
          <input
            class="input input--repeater"
            style="width: 3.5em; margin: 0; padding: 0"
            type="number"
            min="1"
            v-model.number="indexE"
          />
        </p>
        <p style="padding: 0 1em">
          {{ $t("repeater.revise2") }}&nbsp;
          <input
            class="input input--repeater"
            style="width: 10em; margin: 0; padding: 0"
            type="text"
            v-model="revisePlan"
          />
        </p>
        <p style="padding: 0 1em; margin: 0">
          {{ $t("repeater.revise3") }}
          <button
            class="action"
            style="color: blue"
            @click="addNewRevision"
            :title="$t('repeater.revise3')"
          >
            <i class="material-icons">add_card</i>
          </button>
        </p>
        <div>
          <ul
            style="
              position: relative;
              width: 100%;
              height: 100%;
              padding: 1em;
              overflow-y: auto;
              list-style-type: none;
            "
          >
            <li
              v-for="(item, index) in reviseData"
              :key="index"
              :id="index + 1"
            >
              <hr
                style="border: none; border-top: 1px solid black; height: 0"
              />
              <p style="line-height: 2em">
                <span
                  style="color: blue; cursor: pointer"
                  @click="
                    revisionPlay(
                      item.name,
                      item.startIndex,
                      item.oRawPath,
                      index
                    )
                  "
                >
                  {{ index + 1 }}. {{ item.name }}&nbsp;(
                  {{ item.startIndex }} -- {{ item.endIndex }})&nbsp;:
                </span>
                &nbsp;&nbsp;
                <span v-for="(itm, i) in item.date" :key="i" :id="i + 1">
                  <span
                    style="cursor: pointer"
                    @click="switchDateReviseStatus(index, i)"
                    :style="{
                      color:
                        Number(itm.split('^^')[0].replaceAll('-', '')) >
                        Number(today.replaceAll('-', ''))
                          ? 'white'
                          : itm.split('**')[1] == '1'
                          ? 'springgreen'
                          : 'black',
                      pointerEvents:
                        Number(itm.split('^^')[0].replaceAll('-', '')) >
                        Number(today.replaceAll('-', ''))
                          ? 'none'
                          : 'auto',
                    }"
                  >
                    {{ itm.split("^^")[0] }} &nbsp;&nbsp;
                  </span>
                </span>

                <button
                  class="action"
                  @click="delRevision(index)"
                  :title="$t('repeater.delThisRevision')"
                >
                  <i class="material-icons">delete</i>
                </button>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="ShowSwitchSubtitle" class="showMsg" style="bottom: 2.5em">
        <p style="color: yellow">
          {{ indicateSub }}
        </p>
      </div>

      <div
        v-if="showSubtitleList"
        style="
          color: whitesmoke;
          z-index: 1010;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4.2em;
          bottom: 0.2em;
          background-color: black;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
        }"
      >
        <input
          style="height: 2em"
          type="text"
          placeholder=" Search in Subtitles and Notes "
          v-model="searchList"
        />
        <ul
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 1em;
            margin: 0.2em 0 0 0;
            border-radius: 10px;
            overflow-y: auto;
            background: grey;
            list-style-type: none;
          "
        >
          <li
            v-for="(subtitle, index) in srtSubtitlesSearch"
            :key="index"
            :id="subtitle.sn"
            @click="chooseSentence(Number(subtitle.sn) - 1)"
          >
            <p
              style="cursor: pointer"
              :style="{
                color: sentenceIndex == Number(subtitle.sn) ? 'blue' : 'white',
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
          background-color: gray;
          color: whitesmoke;
          z-index: 1010;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          top: 4.2em;
          bottom: 0.2em;
          border-radius: 10px;
          overflow-y: auto;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
        }"
      >
        <p v-if="!this.withTrans" style="padding: 0 1em; color: yellow">
          {{ $t("repeater.newWordTest") }}
        </p>
        <p v-if="this.withTrans" style="padding: 0 1em; color: yellow">
          {{ $t("repeater.newWordList") }}
        </p>
        <ul
          v-if="newWordList.length > 0"
          id="myWordList"
          @click="highLightItem"
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0 1em;
            overflow-y: auto;
            list-style-type: none;
          "
        >
          <li
            v-for="(newWord, index) in newWordList"
            :key="index"
            :id="index + 1"
            @click="chooseSentence(newWord.num, index)"
          >
            <p
              v-if="!newWord.showTrans && !withTrans"
              style="color: white; cursor: pointer"
            >
              {{ index + 1 }}. {{ newWord.origin }}
            </p>
            <p
              v-if="newWord.showTrans && !withTrans"
              style="color: white; cursor: pointer"
            >
              {{ index + 1 }}.
              {{ newWord.origin }}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{{
                newWord.trans
              }}&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;{{
                srtSubtitles[newWord.num].content.split("\r\n")[0]
              }}&nbsp;&nbsp; -
              {{ srtSubtitles[newWord.num].content.split("\r\n")[1] }}&nbsp;]
              <button
                v-if="isFav"
                class="action"
                name="buttons"
                @click="switchIsFav"
                :title="$t('repeater.fav')"
              >
                <i
                  style="color: yellow; padding: 0; font-size: 1.2em"
                  class="material-icons"
                  >star</i
                >
              </button>
              <button
                v-if="!isFav && isReadyToPlay"
                class="action"
                name="buttons"
                @click="switchIsFav"
                :title="$t('repeater.fav')"
              >
                <i
                  style="color: springgreen; padding: 0; font-size: 1.2em"
                  class="material-icons"
                  >star_outline</i
                >
              </button>
            </p>
            <p
              v-if="withTrans"
              style="color: white !important; cursor: pointer"
            >
              {{ index + 1 }}.
              {{ newWord.origin }}&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;{{
                newWord.trans
              }}&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;{{
                srtSubtitles[newWord.num].content.split("\r\n")[0]
              }}&nbsp;&nbsp; -
              {{ srtSubtitles[newWord.num].content.split("\r\n")[1] }}&nbsp;]
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

          <div>
            <p style="color: white; margin-bottom: 0">
              <input type="radio" value="No" v-model="isPrivate" />
              {{ $t("repeater.publicConfig") }}
            </p>
            <p v-if="!hasPrivate" style="color: white; margin-top: 0">
              {{ $t("repeater.addPrivate") }}
              <button class="action" @click="addPrivate">
                <i style="color: blue" class="material-icons">verified</i>
              </button>
            </p>
            <p v-if="hasPrivate" style="color: white">
              <input type="radio" value="Yes" v-model="isPrivate" />
              {{ $t("repeater.privateConfig") }}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <div
            style="display: flex; flex-direction: row; align-items: center"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject"
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
          <div
            style="display: flex; flex-direction: row; align-items: center"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject">{{ $t("repeater.interval") }} </span>
            <input
              class="input input--repeater"
              type="number"
              min="0"
              max="1000"
              v-model.number.lazy="interval"
            />
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject">{{ $t("repeater.timestampMove") }} </span>
            <input
              class="input input--repeater"
              type="number"
              placeholder="-100"
              step="50"
              v-model.number.lazy="timeStampChangeStart"
            />
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject">{{ $t("repeater.timestampMoveEnd") }} </span>
            <input
              class="input input--repeater"
              type="number"
              placeholder="100"
              step="50"
              v-model.number.lazy="timeStampChangeEnd"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              color: white;
              margin-left: 1em;
            "
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span style="font-size: 0.9em">{{ $t("repeater.timeNote") }} </span>
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject">{{ $t("repeater.speedEachTime") }} </span>
            <input
              class="input input--repeater"
              type="text"
              placeholder="sep.:, or space"
              v-model.lazy="currentSpeed"
            />
          </div>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              color: white;
              margin-left: 1em;
            "
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span style="font-size: 0.9em"
              >{{ $t("repeater.speedNote") }}
            </span>
          </div>

          <div style="display: block">
            <p style="color: white">
              <input type="checkbox" v-model.lazy="showTempSpeed" />
              {{ $t("repeater.tempSpeed") }}
            </p>
            <p style="color: white">
              <input type="checkbox" v-model.lazy="showRetracePlay" />
              {{ $t("repeater.showRetracePlay1") }}
              <input
                class="input input--repeater"
                style="width: 4em"
                type="number"
                placeholder="2"
                step="0.5"
                v-model.number.lazy="retraceTime"
              />
              {{ $t("repeater.showRetracePlay2") }}
            </p>
            <p
              :style="{
                color: isFavOnPlay && isPlayFullFavList ? '#bbbaba' : 'white',
              }"
            >
              <input
                v-if="isFavOnPlay && isPlayFullFavList"
                disabled
                type="checkbox"
              />
              <input
                v-if="!(isFavOnPlay && isPlayFullFavList)"
                type="checkbox"
                v-model="autoPlay"
              />
              {{ $t("repeater.autoPlayCurrentSentence") }}
            </p>
            <p
              :style="{
                color: isEditSubandNotes ? '#bbbaba' : 'white',
              }"
            >
              <input v-if="isEditSubandNotes" disabled type="checkbox" />
              <input
                v-if="!isEditSubandNotes"
                type="checkbox"
                v-model="autoPlayNext"
              />
              {{ $t("repeater.autoSwitchtoNextSentence") }}
            </p>

            <p style="color: white; margin-bottom: 0">
              <input type="checkbox" v-model="nextLoopPlay" />
              {{ $t("repeater.nextLoopPlay") }}
              <input
                class="input input--repeater"
                style="width: 4em"
                type="number"
                step="1"
                v-model.lazy="loopStart"
              />
              to
              <input
                class="input input--repeater"
                style="width: 4em"
                type="number"
                step="1"
                v-model.lazy="loopEnd"
              />
            </p>
            <p
              style="padding-left: 1em; margin-top: 0"
              :style="{
                color: !nextLoopPlay ? '#bbbaba' : 'white',
              }"
            >
              <input v-if="!nextLoopPlay" disabled type="checkbox" />
              <input v-if="nextLoopPlay" type="checkbox" v-model="autoStop" />
              {{ $t("repeater.autoStop") }}
              <input
                class="input input--repeater"
                :disabled="!nextLoopPlay"
                style="width: 4em"
                type="number"
                step="1"
                v-model.lazy="autoStopMins"
              />
              Mins
            </p>

            <p style="color: white">
              <input type="checkbox" v-model="random" />
              {{ $t("repeater.random") }}
            </p>

            <p style="color: white">
              <input type="checkbox" v-model="replayFromStart" />
              {{ $t("repeater.replayFromStart") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p>
              <span style="color: white">
                <input type="checkbox" v-model="isUtterTransLine" />
                {{ $t("repeater.utterSubtitle") }}
              </span>
              <span style="color: white">
                (<input
                  :disabled="!isUtterTransLine"
                  type="checkbox"
                  v-model="isAutoDetectLang"
                />
                {{ $t("repeater.autoDetect") }})
              </span>
            </p>
            <div :style="{ color: isUtterTransLine ? 'white' : '#bbbaba' }">
              <p style="margin-bottom: 0">
                <input
                  :disabled="!isUtterTransLine || !hasSpeechSynthesis"
                  style="margin-left: 1em"
                  type="radio"
                  value="Yes"
                  v-model="isSystemTTS"
                />
                <span
                  :style="{
                    color:
                      hasSpeechSynthesis && isUtterTransLine
                        ? 'white'
                        : '#bbbaba',
                  }"
                  >{{ $t("repeater.systemTTS") }}</span
                >
              </p>

              <p
                v-if="!hasSpeechSynthesis"
                style="color: red; margin-left: 2rem; font-size: 0.8em"
              >
                {{ $t("repeater.speechsynthesisAlert") }}
              </p>

              <p
                style="margin: 0.5em 0 1em 2rem; font-size: 0.8em"
                :style="{
                  color:
                    isSystemTTS == 'Yes' && isUtterTransLine
                      ? 'white'
                      : '#bbbaba',
                }"
              >
                {{ $t("repeater.SystemTTSnote") }}
              </p>

              <div
                style="display: flex; flex-direction: row; align-items: center"
                :style="{ width: isMobile ? '100%' : '70%' }"
              >
                <span
                  :style="{
                    color:
                      !isUtterTransLine ||
                      isSystemTTS == 'No' ||
                      !hasSpeechSynthesis
                        ? '#bbbaba'
                        : 'white',
                  }"
                  style="margin-left: 2em"
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
              <div
                style="display: flex; flex-direction: row; align-items: center"
                :style="{ width: isMobile ? '100%' : '70%' }"
              >
                <span
                  :style="{
                    color:
                      !isUtterTransLine ||
                      isSystemTTS == 'No' ||
                      !hasSpeechSynthesis
                        ? '#bbbaba'
                        : 'white',
                  }"
                  style="margin-left: 2em"
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
                    width: isMobile ? '5.5em' : '6.5em',
                  }"
                />
                <button
                  :disabled="
                    isSystemTTS == 'No' ||
                    !isUtterTransLine ||
                    !hasSpeechSynthesis
                  "
                  class="action"
                  style="height: 1.5em"
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
                    style="width: 1em; padding: 0; margin: 0"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
              </div>

              <div
                style="display: flex; flex-direction: row; align-items: center"
                :style="{ width: isMobile ? '100%' : '70%' }"
              >
                <span
                  :style="{
                    color:
                      !isUtterTransLine ||
                      isSystemTTS == 'No' ||
                      !hasSpeechSynthesis
                        ? '#bbbaba'
                        : 'white',
                  }"
                  style="margin-left: 2em"
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
                  margin: 0 0 1em 2rem;
                  text-align: justify;
                  text-align-last: left;
                  word-wrap: break-word;
                  overflow-wrap: break-word;
                  word-break: break-all;
                  font-size: 0.8em;
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
            <div
              style="display: flex; flex-direction: row; align-items: center"
              :style="{ width: isMobile ? '100%' : '70%' }"
            >
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
                max="3"
                v-model.number.lazy="lineNumOfTrans"
              />
            </div>

            <div
              style="display: flex; flex-direction: row; align-items: center"
              :style="{ width: isMobile ? '100%' : '70%' }"
            >
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
                v-model="dubbingMode"
              />
              {{ $t("repeater.dubbingMode") }}
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
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="autoCloseCheck" />
              {{ $t("repeater.autoCloseCheck") }}
            </p>
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="ignoreC" />
              {{ $t("repeater.ignoreC") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="defaultWaveSurfer" />
              {{ $t("repeater.wavesurfer") }} &#9810;
              {{ $t("repeater.wavesurfer2") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />

            <p
              style="
                display: flex;
                flex-direction: row;
                text-align: justify;
                text-align-last: left;
                margin-bottom: 0;
                color: white;
                align-items: center;
              "
            >
              {{ $t("repeater.transUrl") }}

              <input
                style="flex-grow: 1; text-align: left"
                class="input input--repeater"
                type="text"
                v-model.lazy="transUrl"
              />
            </p>

            <p
              style="
                margin: 0 0 1em 0;
                text-align: justify;
                text-align-last: left;
                word-wrap: break-word;
                overflow-wrap: break-word;
                word-break: break-all;
                font-size: 0.8em;
                color: white;
              "
            >
              {{ $t("repeater.transUrlNote") }}
            </p>

            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p style="color: white; text-align: justify; text-align-last: left">
              <input
                :disabled="onOffline"
                type="checkbox"
                v-model="allowCache"
              />
              {{ $t("repeater.allowCache") }}
            </p>
            <p style="color: white; text-align: justify; text-align-last: left">
              {{ $t("repeater.cached1") }}
              <input
                class="input input--repeater"
                style="width: 4em"
                type="number"
                v-model.lazy="maxCacheNum"
              />
            </p>
            <div
              style="color: white; text-align: justify; text-align-last: left"
            >
              <p>
                {{ $t("repeater.savedfiles", { numOfKeys: numOfKeys }) }}
              </p>
              <div v-if="cachedKeys !== ''">
                <ul
                  style="
                    position: relative;
                    width: 100%;
                    height: 100%;
                    padding: 0 1em;
                    border-radius: 10px;
                    background: grey;
                    list-style-type: none;
                  "
                >
                  <li
                    v-for="(name, index) in cachedKeysArr"
                    :key="index"
                    :id="index + 1"
                  >
                    <p
                      style="
                        margin: 0;
                        color: greenyellow;
                        word-break: break-all;
                      "
                    >
                      {{ index + 1 }}.
                      {{ name }}
                    </p>
                  </li>
                </ul>
              </div>

              <p>
                <button
                  :disabled="numOfKeys == 0"
                  style="border-radius: 5px"
                  @click="cacheCleanUp"
                >
                  {{ $t("repeater.cleanUpCache") }}
                </button>
              </p>

              <p
                style="color: white; text-align: justify; text-align-last: left"
              >
                <input disabled="true" type="checkbox" v-model="onOffline" />
                {{ $t("repeater.offlineApp") }}
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
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
              <i style="color: white" class="material-icons">add_alert</i
              >{{ $t("repeater.instruction14") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">repeat_one</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">hearing</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">repeat</i>
              {{ $t("repeater.instruction7") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">closed_caption</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">plumbing</i>
              {{ $t("repeater.instruction8") }}
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

      <div
        class="repeater"
        style="display: flex"
        :style="{ paddingTop: isMobile && isLandscape ? '3em' : '4em' }"
      >
        <video
          v-if="isMediaType == 2 && !browserHiJack"
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          style="padding-bottom: 1em; padding-top: 0.2em; object-position: top"
          :style="{
            width: isMobile ? '100%' : 'auto',
            height:
              isMobile && isLandscape
                ? '0'
                : isMobile && isWaveSurfer
                ? '30%'
                : isMobile
                ? '40%'
                : isWaveSurfer
                ? '45%'
                : '60%',
          }"
          id="myVideo"
          :src="raw"
          :autoplay="autoPlay"
          :controls="!isSingle"
          controlslist="noplaybackrate nodownload noremoteplayback"
          disablePictureInPicture="true"
          @loadedmetadata="readyStatus"
          @error="wrongSrc"
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
        <div
          v-if="!isReadyToPlay && isMediaType > 0 && !browserHiJack"
          class="showMsg"
          style="color: grey; bottom: 1.5em; z-index: 1008"
        >
          <p style="font-size: 1.2em">
            {{ $t("repeater.warning2") }}
          </p>
        </div>
        <span
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="srtSubtitles && isMediaType == 1"
          style="
            width: 100%;
            margin: 0;
            background-color: black;
            top: 0;
            height: 20%;
          "
        >
        </span>

        <div
          v-if="
            isMediaType > 0 && srtSubtitles && !isEditSubandNotes && isDictation
          "
        >
          <textarea
            v-show="!isEmpty"
            id="editArea3"
            @touchmove="touchMoveF"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            rows="2"
            v-model="dictationContent"
            :placeholder="$t('repeater.dictationDefault')"
            style="
              width: 100%;
              font-size: 1.5em;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              text-align: center;
              padding: 0;
              white-space: pre-wrap;
            "
          ></textarea>
        </div>

        <span
          v-html="subtitleContent"
          id="subArea"
          @mousedown="startDragS"
          @mouseup="endDragS"
          @touchstart="startTouchS"
          @touchmove="touchMoveS"
          @touchend="endTouchS"
          @dblclick="dblClick"
          v-if="
            isMediaType > 0 && srtSubtitles && !isEditSubandNotes && isCheck
          "
          style="
            color: yellow;
            overflow-wrap: break-word;
            width: 100%;
            margin: 0;
          "
          :style="{
            fontSize: isDictation ? '1.4em' : '1.5em',
            top: isMediaType == 1 ? 0 : '4em',
          }"
        >
        </span>
        <p v-if="isMediaType == 0" style="color: red">
          Can't find media file: {{ reqF.name.replace(".srt", ".mp4/.mp3") }}.
          (Note: .mp3/mp4 is case sensitive, .srt and .mp3/mp4 files should be
          in the same folder). Or the .srt file's format is incorrect, it should
          be encoded using UTF-8.
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
          v-if="
            isMediaType > 0 &&
            srtSubtitles &&
            !isEditSubandNotes &&
            !isDictation
          "
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
                  : " "
              }}
            </p>
          </div>
        </span>

        <div
          v-if="
            isMediaType > 0 && srtSubtitles && !isEditSubandNotes && isDictation
          "
        >
          <span>
            <p
              @mousedown.self="startDragS"
              @mouseup.self="endDragS"
              @touchstart.self="startTouchS"
              @touchmove.prevent
              @touchend.self="endTouchS"
              style="padding: 0.25em 0; margin: 0"
            >
              <button
                class="action"
                name="buttons"
                @click="dictationCheck"
                :title="$t('repeater.dictationCheck')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color: isCheck ? 'red' : 'springgreen',
                  }"
                  class="material-icons"
                  >spellcheck</i
                >
              </button>
              <button
                v-if="canRecording"
                class="action"
                :disabled="loading || isSetting"
                @click="recording"
                :title="$t('repeater.recording')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color: isRecording ? 'red' : 'springgreen',
                  }"
                  class="material-icons"
                  >mic</i
                >
              </button>
              <button
                v-if="!canRecording"
                class="action"
                @click="showRecordingSetNote"
                :title="$t('repeater.cannotRecording')"
              >
                <i style="font-size: 1.7em; color: green" class="material-icons"
                  >mic_off</i
                >
              </button>
              <button
                :disabled="loading || isSetting || isRecording || !audioUrl"
                class="action"
                @click="playRecording"
                :title="$t('repeater.playRecording')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color: !isRecording && audioUrl ? 'springgreen' : 'grey',
                  }"
                  class="material-icons"
                  >campaign</i
                >
              </button>
              <button
                :disabled="
                  loading ||
                  isSetting ||
                  isRecording ||
                  (dictationArray.length == 0 && audioRecordArray.length == 0)
                "
                class="action"
                @click="confirmUploadDictation"
                :title="$t('repeater.uploadDicRec')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color:
                      !isRecording &&
                      (dictationArray.length > 0 || audioRecordArray.length > 0)
                        ? 'springgreen'
                        : 'grey',
                  }"
                  class="material-icons"
                  >cloud_upload</i
                >
              </button>
              <button
                :disabled="loading || isSetting || isRecording || !canDownload"
                class="action"
                @click="confirmDownloadDictation"
                :title="$t('repeater.downloadDicRec')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color: !isRecording && canDownload ? 'springgreen' : 'grey',
                  }"
                  class="material-icons"
                  >cloud_download</i
                >
              </button>
              <button
                :disabled="
                  loading ||
                  isSetting ||
                  isRecording ||
                  (dictationArray.length == 0 &&
                    audioRecordArray.length == 0 &&
                    !canDownload)
                "
                class="action"
                @click="confirmDelDicRec"
                :title="$t('repeater.clearAllDicRec')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color:
                      !isRecording &&
                      (dictationArray.length > 0 ||
                        audioRecordArray.length > 0 ||
                        canDownload)
                        ? 'springgreen'
                        : 'grey',
                  }"
                  class="material-icons"
                  >delete</i
                >
              </button>
            </p>
          </span>
        </div>

        <span
          v-if="srtSubtitles && isEditSubandNotes && !isEmpty"
          style="
            overflow-wrap: break-word;
            width: 100%;
            margin: 0;
            font-size: 1.2em;
            background-color: black;
            padding-top: 0;
          "
        >
          <p
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchmove.prevent
            @touchend="endTouchS"
            style="color: black; font-size: 1em; padding: 0; margin: 0.5em 0"
          >
            <span
              name="buttons"
              @click="startTimeMinus()"
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
              >
                <font color="yellow" size="3">&#10134;</font>
                <font color="black">-</font>
              </span>
            </span>
            &#32;
            <input
              class="input input--repeater"
              name="buttons"
              type="number"
              v-model.number.lazy="startTimeTemp"
              id="editArea0"
              @mouseup="endDragG"
              @touchend="endTouchG"
              step="0.001"
              style="font-size: 1em; padding: 0; margin: 0"
              :style="{
                width: isMobile ? '4.5em' : '5.2em',
              }"
            />
            &#32;
            <span
              @click="startTimeAdd()"
              name="buttons"
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
              >
                <font color="black">-</font>
                <font color="yellow" size="3">&#10133;</font>
              </span>
            </span>
            --
            <span
              @click="showWaveSurfer()"
              name="buttons"
              :style="{
                pointerEvents: !isSingle ? 'none' : 'auto',
              }"
              style="cursor: pointer; user-select: none; color: yellow"
              :title="$t('repeater.showWaveSurfer')"
            >
              &#9810;
            </span>
            --
            <span
              @click="endTimeMinus()"
              name="buttons"
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
              >
                <font color="yellow" size="3">&#10134;</font>
                <font color="black">-</font>
              </span>
            </span>
            &#32;
            <input
              class="input input--repeater"
              name="buttons"
              type="number"
              v-model.number.lazy="endTimeTemp"
              step="0.001"
              id="editArea00"
              @mouseup="endDragG"
              @touchend="endTouchG"
              style="font-size: 1em; padding: 0; margin: 0"
              :style="{
                width: isMobile ? '4.5em' : '5.2em',
              }"
            />
            &#32;
            <span
              @click="endTimeAdd()"
              name="buttons"
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
              >
                <font color="black">-</font>
                <font color="yellow" size="3">&#10133;</font>
              </span>
            </span>
          </p>

          <textarea
            v-if="isShowLine1 && !isMoveAll"
            id="editArea1"
            name="editAreaM"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            @touchmove="touchMoveM"
            v-model.lazy="subFirstLine"
            placeholder="...Subtitle First Line..."
            :rows="rowsNum"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              padding: 0;
              margin-top: 0.5em;
            "
          ></textarea>
          <textarea
            v-if="isShowLine2 && !isMoveAll"
            id="editArea2"
            name="editAreaM"
            @touchmove="touchMoveG"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            v-model.lazy="subSecLine"
            placeholder="...Subtitle Second Line..."
            :rows="rowsNum"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              padding: 0.25em 0;
            "
          ></textarea>
          <textarea
            v-show="!isEmpty && isShowLine3 && !isMoveAll"
            id="editArea3"
            @touchmove="touchMoveF"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
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
          <p
            v-if="isMoveAll"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchmove.prevent
            @touchend="endTouchS"
            style="color: white"
          >
            {{ $t("repeater.moveAllStamp") }}
            <input
              class="input input--repeater"
              name="buttons"
              type="number"
              v-model.number="moveAll"
              step="50"
            />

            <button
              class="action"
              name="buttons"
              :disabled="moveAll == 0"
              @click="saveMoveAll"
              :title="$t('buttons.save')"
            >
              <i style="color: red; font-size: 1.5em" class="material-icons"
                >verified</i
              >
            </button>
          </p>
          <p
            @mousedown.self="startDragS"
            @mouseup.self="endDragS"
            @touchstart.self="startTouchS"
            @touchmove.prevent
            @touchend.self="endTouchS"
            style="padding: 0.25em 0; margin: 0"
          >
            <button
              class="action"
              name="buttons"
              @click="confirmDelete"
              :title="$t('repeater.infoDelete')"
            >
              <i style="color: red; font-size: 1.3em" class="material-icons"
                >delete</i
              >
            </button>

            <button
              :disabled="lastSentence"
              class="action"
              name="buttons"
              @click="confirmMerge"
              :title="$t('repeater.infoMerge')"
            >
              <i
                style="font-size: 1.3em"
                :style="{
                  color: lastSentence ? 'grey' : 'red',
                }"
                class="material-icons"
                >merge</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click="confirmSplit"
              :title="$t('repeater.infoSplit')"
            >
              <i style="color: red; font-size: 1.3em" class="material-icons"
                >call_split</i
              >
            </button>

            <button
              v-if="isEditSubandNotes"
              class="action"
              name="buttons"
              @click="showMoveAll"
              :title="$t('repeater.infoMoveAll')"
            >
              <i style="color: red; font-size: 1.3em" class="material-icons"
                >autofps_select</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click="confirmAdd"
              :title="$t('repeater.infoAdd')"
            >
              <i style="color: red; font-size: 1.3em" class="material-icons"
                >alt_route</i
              >
            </button>

            <button
              :disabled="loading || historyIndex < 1"
              class="action"
              name="buttons"
              @click="changeUndo"
              :title="$t('repeater.undo')"
            >
              <i
                :style="{
                  color: loading || historyIndex < 1 ? 'grey' : 'red',
                }"
                style="font-size: 1.3em"
                class="material-icons"
                >undo</i
              >
            </button>

            <button
              :disabled="loading || historyIndex >= changeNew.length"
              class="action"
              name="buttons"
              @click="changeRedo"
              :title="$t('repeater.redo')"
            >
              <i
                :style="{
                  color:
                    loading || historyIndex >= changeNew.length
                      ? 'grey'
                      : 'red',
                }"
                style="font-size: 1.3em"
                class="material-icons"
                >redo</i
              >
            </button>
          </p>
        </span>

        <div
          v-if="isMediaType > 0 && srtSubtitles && !isEmpty"
          @mousedown.self="startDragS"
          @mouseup.self="endDragS"
          @touchstart.self="startTouchS"
          @touchmove.prevent
          @touchend.self="endTouchS"
        >
          <button
            v-if="isFav"
            class="action"
            name="buttons"
            @click="switchIsFav"
            :title="$t('repeater.fav')"
          >
            <i
              style="color: yellow; padding: 0 0 0.5em 0; font-size: 1.2em"
              class="material-icons"
              >star</i
            >
          </button>
          <button
            v-if="!isFav && isReadyToPlay"
            class="action"
            name="buttons"
            @click="switchIsFav"
            :title="$t('repeater.fav')"
          >
            <i
              style="color: #464633; padding: 0 0 0.5em 0; font-size: 1.2em"
              class="material-icons"
              >star_outline</i
            >
          </button>
        </div>

        <div
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-show="srtSubtitles"
          style="width: 100%; flex-grow: 1"
        ></div>

        <p
          v-show="isWaveSurfer && isEditSubandNotes"
          style="margin-bottom: 2px"
        >
          <label style="color: white">
            <input type="checkbox" v-model="autoCenter" /> AutoCenter
          </label>
          <label style="color: white; margin-left: 0.5em">
            <input
              type="range"
              min="10"
              max="100"
              style="width: 35%"
              v-model="minPxPerSec"
            />
          </label>
          <label style="color: white; margin-left: 0.5em">
            <input type="checkbox" v-model="regionPlay" /> RegionPlay
          </label>
        </p>

        <div
          id="waveform"
          v-show="isWaveSurfer && isEditSubandNotes"
          @contextmenu.prevent
          style="background-color: #ffffffdb"
        ></div>
      </div>

      <div v-if="markRevised" class="showMsg" style="bottom: 2.5em">
        <span style="color: white; padding: 0.3em; background-color: black">
          {{ $t("repeater.revise5") }}
        </span>
      </div>

      <div v-if="markUnrevised" class="showMsg" style="bottom: 2.5em">
        <span style="color: white; padding: 0.3em; background-color: black">
          {{ $t("repeater.revise55") }}
        </span>
      </div>

      <div v-if="mediaCached" class="showMsg" style="bottom: 2.5em">
        <span style="color: blue; padding: 0.3em; background-color: grey">
          {{ $t("repeater.cached") }}
        </span>
      </div>

      <div
        v-if="showWaveformInfo && isWaveSurfer && isEditSubandNotes"
        class="showMsg"
        style="bottom: 0"
      >
        <p style="color: blue">
          {{ $t("repeater.showWaveformInfo") }}
        </p>
        <p style="color: blue; font-size: 0.9em; margin: 0em">
          {{ $t("repeater.showWaveformInfo2") }}
        </p>
      </div>

      <div v-if="RUdoAlert" class="showMsg" style="bottom: 1em">
        <span style="color: blue; background-color: grey">
          {{ $t("repeater.RUdoAlert") }}
        </span>
      </div>

      <audio
        style="
          position: fixed;
          bottom: 10%;
          width: 85%;
          left: 0;
          right: 0;
          margin: auto;
        "
        v-if="isMediaType == 1 && !browserHiJack && raw !== ' '"
        id="myAudio"
        :src="raw"
        :controls="!isSingle"
        controlslist="noplaybackrate nodownload"
        @error="wrongSrc"
        :autoplay="autoPlay"
        @loadedmetadata="readyStatus"
      ></audio>

      <div
        v-if="showAddNew"
        :disabled="loading || isSetting || !isSingle"
        style="z-index: 1008; position: fixed; right: 1em"
        :style="{
          bottom: isWaveSurfer ? '6.5em' : '2.5em',
        }"
      >
        <button
          v-if="!showEditNew"
          class="action"
          @click="addANewWord"
          :title="$t('repeater.addnewWord')"
        >
          <i style="color: white; font-size: 2em" class="material-icons"
            >add_circle</i
          >
        </button>

        <div
          v-if="showEditNew"
          style="border-radius: 10px; background: grey; padding: 0.3em"
        >
          <p style="text-align: justify; text-align-last: left; color: white">
            <span style="width: 5em"> New word: </span>
            <input
              style="padding: 0.2em; width: 10.5em; margin-right: 0.2em"
              class="input input--repeater"
              type="text"
              v-model="newWord"
            />
            <button class="action" @click="showTransPage">
              <i
                style="color: blue; width: 1em; padding: 0"
                class="material-icons"
                >auto_stories</i
              >
            </button>
          </p>
          <p style="text-align: justify; color: white">
            <input
              style="width: 15.5em; padding: 0.2em; margin-right: 0.2em"
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

      <div
        v-if="(showRetracePlay || showTempSpeed) && !showEditNew && !showAddNew"
        :disabled="loading || isSetting"
        style="z-index: 1007; position: fixed; left: 1em"
        :style="{
          bottom: isWaveSurfer ? '6.5em' : '2.5em',
        }"
      >
        <button
          v-if="showRetracePlay"
          class="action"
          @click="retracePlay"
          :title="
            $t('repeater.retracePlay', {
              rT: retraceTime,
            })
          "
        >
          <i style="font-size: 2em; color: springgreen" class="material-icons"
            >replay_circle_filled</i
          >
        </button>
        <span v-if="showTempSpeed">
          <button
            class="action"
            @click="switchTempSpeed"
            :title="$t('repeater.switchTempSpeed')"
          >
            <i
              style="font-size: 2em"
              :style="{ color: onTempSpeed ? 'springgreen' : 'white' }"
              class="material-icons"
              >slow_motion_video</i
            >
          </button>
          <span v-if="onTempSpeed" style="color: springgreen">
            <input
              type="range"
              min="0.2"
              max="2"
              step="0.1"
              v-model.lazy="tempSpeed"
              style="
                width: 8em;
                height: 1em;
                background-color: white;
                border-radius: 10px;
                margin: 0.5em 0;
                padding: 0;
              "
            />&nbsp;
            {{ tempSpeed }}
          </span>
        </span>
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
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

export default {
  name: "repeater",
  components: {
    HeaderBar,
    Action,
  },
  data: function () {
    return {
      canDownload: false,
      netStatus: true,
      audioRecordArray: [],
      audioRecorded: null,
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null,
      isRecording: false,
      fromRetrace: false,
      retraceTime: 2,
      showRetracePlay: false,
      normalSpeed: 1,
      onTempSpeed: false,
      tempSpeed: 0.5,
      showTempSpeed: false,
      isCheck: true,
      dictationContent: "",
      dictationArray: [],
      showTools: false,
      fromClick: true,
      hasConfirmed: false,
      isMoveAll: false,
      moveAll: 0,
      hasMoveAll: false,
      wavesurfer: null,
      audioContext: null,
      minPxPerSec: 45,
      scrollbar: false,
      fillParent: false,
      autoCenter: true,
      regions: null,
      isWaveSurfer: false,
      cont: true,
      regionPlay: true,
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
      utterInProcess: false,
      playInProcess: false,
      replayFromStart: false,
      timeOutId: null,
      intervalId: null,
      timeOutId1: null,
      timeOutId2: null,
      timeOutId3: null,
      autoPlayNext: true,
      nextLoopPlay: false,
      random: false,
      orderedReq: [],
      randomReq: [],
      autoStop: true,
      autoStopMins: 60,
      loopStart: 1,
      loopEnd: 1000,
      autoPlay: true,
      timeStampChangeStart: 0,
      timeStampChangeEnd: 0,
      currentSpeed: "0.8 0.5",
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
      resized: false,
      isFirstClick: true,
      hasSpeechSynthesis:
        !!window.speechSynthesis || "speechSynthesis" in window,
      utterThis: null,
      isPlayFullFavList: false,
      autoCloseCheck: true,
      ignoreC: false,
      audio: null,
      isSystemTTS: "Yes",
      note: "     ",
      confirmType: "",
      showSubtitleList: false,
      showNewWordList: false,
      sessionLength: null,
      isSlowInternet: false,
      isEditSubandNotes: false,
      isDictation: false,
      subFirstLine: "     ",
      startTimeTemp: 0,
      endTimeTemp: 0,
      subSecLine: "     ",
      ShowSwitchSubtitle: false,
      firstMount: true,
      numOfKeys: 0,
      playFromCache: false,
      reader: 0,
      showAddNew: false,
      showEditNew: false,
      newWord: " ",
      newTranslation: "",
      withTrans: false,
      changeOld: [],
      changeNew: [],
      historyIndex: 0,
      tempOldContent: "",
      onRUdo: false,
      onEdit: false,
      showRevision: false,
      revisePlan: "0 1 3 7 15 30 60",
      reviseData: [],
      onRevision: false,
      oReq: null,
      indexS: 1,
      indexE: 10,
      tempSentenceIndex: 1,
      markRevised: false,
      markUnrevised: false,
      reviseType: 0,
      srtRevisePath: "",
      maxCacheNum: Number(window.localStorage.getItem("max")) || 10,
      cachedKeys: window.localStorage.getItem("cKeys") || "",
      indexOfNewWordList: 0,
      raw: " ",
      mediaCached: false,
      allowCache: Number(window.localStorage.getItem("cacheOff")) !== 1,
      onOffline: Number(window.localStorage.getItem("isOffline")) == 1,
      isLandscape: this.checkLandscape(),
      mobileScreen: this.checkMobileScreen(),
      tempFavContent: "",
      notSaveFav: false,
      notFromStarttimeTempChg: true,
      fromMerge: false,
      RUdoAlert: false,
      fetchCount: 0,
      favFileName: "PDJ-Repeater.txt",
      favNotUpload: "PDJ-Repeater.txtfavNotUpload",
      today: new Date().toLocaleDateString("af").replaceAll("/", "-"),
      searchList: "",
      isSwitching: false,
      isPrivate: "Yes",
      hasPrivate: true,
      defaultWaveSurfer: true,
      transUrl: "https://fanyi.baidu.com/#zh/en/",
      ctrlPressed: false,
      shiftPressed: false,
      dubbingMode: false,
      showWaveformInfo: false,
      localPeaks: [],
      TTSurl:
        "https://dds.dui.ai/runtime/v1/synthesize?voiceId=xijunm&speed=1.1&volume=100&text=",
    };
  },

  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),

    isMobile() {
      return (
        /iPhone|Android/i.test(navigator.userAgent) && window.innerWidth < 1000
      );
    },

    canRecording() {
      return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    },

    reqF() {
      if (this.onRevision) return this.oReq;
      else return this.req;
    },

    srtNotUpload() {
      return this.mediaName + "srtNotUpload";
    },

    lastSentence() {
      return this.sentenceIndex == this.srtSubtitles.length;
    },

    favListStatus() {
      if (
        this.isSetting ||
        !this.isSingle ||
        this.showRevision ||
        this.showTools
      )
        return { color: "grey" };
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
        this.isDictation ||
        this.showNewWordList ||
        this.isEditSubandNotes ||
        this.showRevision
      )
        return { color: "grey" };
      if (this.subtitleLang == 1) {
        return { color: "blue" };
      } else if (
        this.subtitleLang == 2 ||
        this.subtitleLang == 3 ||
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
        return "3. show Note Line only";
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
        (this.isEditSubandNotes && !this.playFromCache) ||
        this.showRevision ||
        this.showTools
      ) {
        return { color: "grey" };
      } else if (this.playFromCache) {
        if (this.isEditSubandNotes || this.isFavOnPlay) {
          return { color: "pink" };
        } else return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },

    rowsNum() {
      return this.isMobile && !this.isLandscape ? 2 : 1;
    },

    srtSubtitles() {
      if (!this.isFavOnPlay) {
        var formatContent = "";
        if (this.reqF.size == 0)
          formatContent =
            "1\n00:00:01,000 --> 00:00:02,000\n Click edit to modified. \n \r\n";
        else formatContent = this.reqF.content;
        formatContent = this.formatAll(formatContent);
        var subtitles = [];
        var textSubtitles = formatContent.split("\n\n");
        for (var i = 0; i < textSubtitles.length; ++i) {
          var textSubtitle = textSubtitles[i].split("\n");
          if (textSubtitle.length >= 2) {
            var sn = i + 1;
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

    srtSubtitlesLength() {
      return this.srtSubtitles.length;
    },

    srtSubtitlesSearch() {
      var searchKey = this.searchList.replaceAll("；", ";");
      searchKey = searchKey.replaceAll(";;", ";");
      searchKey = searchKey.replace(/^;|;$/g, "");
      searchKey = searchKey.trim();
      if (searchKey == ";") searchKey = "";
      if (searchKey == "") return this.srtSubtitles;
      else {
        var final = this.srtSubtitles.filter((item) =>
          item.content.toLowerCase().includes(searchKey.toLowerCase())
        );
        return final;
      }
    },

    cachedKeysArr() {
      let temp = this.cachedKeys.replace(";;", "");
      return temp.split(";;");
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

            if (
              this.srtSubtitles[i].content
                .split("\r\n")[2]
                .split("[")
                [j].split(":")[1]
            ) {
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
        if (this.onRevision) {
          return this.reviseType;
        }
        if (this.listing && this.reqF.name) {
          for (var i = 0; i < this.listing.length; ++i) {
            if (
              this.listing[i].name == this.reqF.name.replace(".srt", ".mp4")
            ) {
              return 2;
            } else if (
              this.listing[i].name == this.reqF.name.replace(".srt", ".mp3")
            ) {
              return 1;
            }
          }
          return 0;
        } else {
          return -1;
        }
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
      let currentMediaName = this.reqF.name;
      return this.favList.filter(function (item) {
        return item.rawPath == currentMediaName;
      });
    },

    mediaName() {
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        return this.srtSubtitles[this.sentenceIndex - 1].mediaName;
      } else {
        if (this.isMediaType == 1) {
          return this.reqF.name.replace(".srt", ".mp3");
        } else if (this.isMediaType == 2) {
          return this.reqF.name.replace(".srt", ".mp4");
        } else {
          return "";
        }
      }
    },

    pr() {
      var playRange = [1, 2];
      if (this.nextLoopPlay) {
        playRange[0] = this.loopStart;
        playRange[1] = this.loopEnd;
        if (playRange[0] < 1) playRange[0] = 1;
        if (playRange[1] > this.srtSubtitles.length)
          playRange[1] = this.srtSubtitles.length;
      } else {
        playRange[0] = 1;
        playRange[1] = this.srtSubtitles.length;
      }
      return playRange;
    },

    subtitleContent() {
      if (
        this.srtSubtitles[this.sentenceIndex - 1] &&
        this.srtSubtitles[this.sentenceIndex - 1].content
      ) {
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
        if (this.isShowLine1 && this.isShowLine2 && this.isDictation) {
          contentAll =
            "<p style='margin-top: 0px; color: green'>" +
            contentLine1 +
            "</p><p style='color: green'>" +
            contentLine2 +
            "</p>";
        } else if (this.isShowLine1 && this.isShowLine2 && !this.isDictation) {
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
        if (this.isDictation) {
          var contentDictation = this.dictationContent;
          if (this.dictationContent == "") return contentAll;
          for (var ii = 1; ii <= contentDictation.split(" ").length; ++ii) {
            if (this.ignoreC)
              highLightWord = contentDictation
                .split(" ")
                [ii - 1].replace(/[\p{P}\s]+$/u, "")
                .toLowerCase();
            else highLightWord = contentDictation.split(" ")[ii - 1];
            if (highLightWord.trim() !== "") {
              let temp1 = " " + contentLine1;
              let temp2 = " " + contentLine2;
              var highLightWord1 = highLightWord;
              if (this.ignoreC) {
                var temp11 = temp1.toLowerCase();
                var temp21 = temp2.toLowerCase();
                if (temp11.includes(" " + highLightWord)) {
                  var part1 = temp11.split(" " + highLightWord)[0];
                  var part3 = temp11.replace(part1 + " " + highLightWord, "");
                  if (part3 == "") {
                    highLightWord = temp1.slice(part1.length + 1);
                  } else
                    highLightWord = temp1.slice(
                      part1.length + 1,
                      -part3.length
                    );
                }
                if (temp21.includes(" " + highLightWord1)) {
                  var parta = temp21.split(" " + highLightWord1)[0];
                  var partc = temp21.replace(parta + " " + highLightWord1, "");
                  if (partc == "") {
                    highLightWord1 = temp2.slice(parta.length + 1);
                  } else
                    highLightWord1 = temp2.slice(
                      parta.length + 1,
                      -partc.length
                    );
                }
                contentLine1 = temp1
                  .replace(" " + highLightWord, " #@" + highLightWord + "@#")
                  .trim();
                contentLine2 = temp2
                  .replace(" " + highLightWord1, " #@" + highLightWord1 + "@#")
                  .trim();
              } else {
                contentLine1 = temp1
                  .replace(" " + highLightWord, " #@" + highLightWord + "@#")
                  .trim();
                contentLine2 = temp2
                  .replace(" " + highLightWord, " #@" + highLightWord + "@#")
                  .trim();
              }
            }
          }

          for (var iii = 1; iii <= 5; ++iii) {
            contentLine1 = contentLine1
              .replaceAll("#@#@", "#@")
              .replaceAll("@#@#", "@#");
            contentLine2 = contentLine2
              .replaceAll("#@#@", "#@")
              .replaceAll("@#@#", "@#");
          }

          contentLine1 = contentLine1
            .replaceAll("#@", "<font color=yellow>")
            .replaceAll("@#", "</font>");
          contentLine2 = contentLine2
            .replaceAll("#@", "<font color=yellow>")
            .replaceAll("@#", "</font>");
          contentAll =
            "<p style='margin-top: 0px; color: green'>" +
            contentLine1 +
            "</p><p style='color: green'>" +
            contentLine2 +
            "</p>";
        } else if (
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

            if (highLightWord.trim() !== "") {
              contentLine1 = contentLine1.replaceAll(
                highLightWord,
                "#@" + highLightWord + "@#"
              );
              contentLine2 = contentLine2.replaceAll(
                highLightWord,
                "#@" + highLightWord + "@#"
              );
            }
          }

          for (var iiii = 1; iiii <= 5; ++iiii) {
            contentLine1 = contentLine1
              .replaceAll("#@#@", "#@")
              .replaceAll("@#@#", "@#");
            contentLine2 = contentLine2
              .replaceAll("#@#@", "#@")
              .replaceAll("@#@#", "@#");
          }

          contentLine1 = contentLine1
            .replaceAll("#@", "<font color=red>")
            .replaceAll("@#", "</font>");
          contentLine2 = contentLine2
            .replaceAll("#@", "<font color=red>")
            .replaceAll("@#", "</font>");
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
        }
        return contentAll;
      } else return "";
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
    isIphone() {
      return /iPhone/i.test(navigator.userAgent);
    },
  },

  watch: {
    $route: function () {
      this.updatePreview();
    },

    tempSpeed: function () {
      if (this.onTempSpeed) {
        this.click();
      }
      this.save();
    },

    showTempSpeed: function () {
      if (!this.showTempSpeed) {
        this.onTempSpeed = false;
      }
      this.save();
    },

    newWord: function () {
      if (this.showAddNew) {
        this.getTrans();
      }
    },

    isEditSubandNotes: function () {
      if (!this.isEditSubandNotes) {
        this.isWaveSurfer = false;
        this.isMoveAll = false;
        this.moveAll = 0;
      }
    },

    isWaveSurfer: function () {
      if (this.isWaveSurfer && this.isEditSubandNotes) {
        this.initWaveSurfer();
      } else {
        if (this.wavesurfer) {
          this.wavesurfer.destroy();
        }
        if (this.audioContext) {
          this.audioContext.close();
        }
      }
    },
    isDictation: function () {
      if (this.isDictation) {
        if (this.dictationArray.length == 0) {
          this.dictationArray =
            JSON.parse(
              window.sessionStorage.getItem(this.mediaName + "dictation")
            ) || [];
        }
        this.dictationContent = "";

        const tempCon = this.dictationArray.find(
          (item) => item.id === this.sentenceIndex
        );
        if (tempCon) this.dictationContent = tempCon.con;

        this.isShowLine1 = true;
        this.isShowLine2 = true;
        this.isShowLine3 = false;

        this.audioBlob = null;
        this.audioUrl = null;
        let vmm = this;
        localforage
          .getItem(this.mediaName + "recordAudio")
          .then(function (value) {
            vmm.audioRecordArray = value;
            if (!vmm.audioRecordArray) {
              vmm.audioRecordArray = [];
              return;
            }

            const tempRec = vmm.audioRecordArray.find(
              (item) => item.id === vmm.sentenceIndex
            );
            if (tempRec) {
              vmm.audioBlob = tempRec.con;
              vmm.audioUrl = URL.createObjectURL(vmm.audioBlob);
            }
          })
          .catch(function () {
            return;
          });
      } else {
        if (this.isRecording) this.stopRecording();

        this.switchSubtitleMini();
      }
    },
    dictationContent: function () {
      if (this.dictationContent.trim() !== "") {
        let filteredArray = this.dictationArray.filter(
          (item) => item.id !== this.sentenceIndex
        );
        let newItem = {
          id: this.sentenceIndex,
          con: this.dictationContent,
        };
        filteredArray.push(newItem);
        window.sessionStorage.setItem(
          this.mediaName + "dictation",
          JSON.stringify(filteredArray)
        );
        this.dictationArray = filteredArray;
      } else {
        let filteredArray = this.dictationArray.filter(
          (item) => item.id !== this.sentenceIndex
        );
        window.sessionStorage.setItem(
          this.mediaName + "dictation",
          JSON.stringify(filteredArray)
        );
        this.dictationArray = filteredArray;
      }
    },
    autoCenter: function () {
      if (this.wavesurfer) {
        this.wavesurfer.setOptions({
          autoCenter: this.autoCenter,
        });
      }
    },

    regionPlay: function () {
      if (this.wavesurfer) {
        this.regions.unAll();
        this.updateRegions();
      }
    },

    minPxPerSec(newValue) {
      if (this.wavesurfer) this.wavesurfer.zoom(newValue);
    },
    hasPrivate: function () {
      if (!this.hasPrivate) this.isPrivate = "No";
    },

    isPrivate: function () {
      if (this.isSetting) this.readyStatus();
    },

    maxCacheNum: function () {
      if (
        window.localStorage.getItem("max") &&
        this.maxCacheNum < Number(window.localStorage.getItem("max"))
      )
        this.cacheCleanUp();
      window.localStorage.setItem("max", this.maxCacheNum);
    },

    mediaName: function () {
      if (this.isMediaType !== -1) {
        this.checkDownload();
        if (
          !window.localStorage.getItem(this.mediaName) &&
          !(this.isFavOnPlay && this.isPlayFullFavList)
        )
          window.localStorage.setItem(this.mediaName, this.reqF.content);
        this.getCacheMedia();
      }
    },

    playFromCache: function () {
      if (this.playFromCache) {
        if (this.isEditSubandNotes) {
          setTimeout(() => {
            this.isShowLine1 = true;
            this.isShowLine2 = true;
            this.isShowLine3 = true;
            this.startTimeTemp =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
            this.endTimeTemp =
              this.srtSubtitles[this.sentenceIndex - 1].endTime;
            this.subFirstLine =
              this.srtSubtitles[this.sentenceIndex - 1].content.split(
                "\r\n"
              )[0];
            this.subSecLine =
              this.srtSubtitles[this.sentenceIndex - 1].content.split(
                "\r\n"
              )[1];
            this.note =
              this.srtSubtitles[this.sentenceIndex - 1].content.split(
                "\r\n"
              )[2];
          }, 100);
        }
      }
    },

    startTimeTemp: function () {
      if (this.isSwitching) return;
      this.notFromStarttimeTempChg = false;
      this.onEdit = true;
      this.saveSub1();
      if (
        !this.hasMoveAll &&
        this.isWaveSurfer &&
        this.regions &&
        this.regions.getRegions()[this.sentenceIndex - 1]
      ) {
        this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
          start: this.startTimeTemp,
        });
        if (this.sentenceIndex > 1 && !this.shiftPressed)
          this.regions.getRegions()[this.sentenceIndex - 2].setOptions({
            end: this.srtSubtitles[this.sentenceIndex - 2].endTime - 0.03,
          });
      }
      if (this.hasMoveAll && this.isWaveSurfer && this.regions) {
        this.updateRgns();
        this.hasMoveAll = false;
      }
    },

    endTimeTemp: function () {
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub2();
      if (
        this.isWaveSurfer &&
        this.regions &&
        this.regions.getRegions()[this.sentenceIndex - 1]
      ) {
        this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
          end: this.endTimeTemp - 0.03,
        });
        if (this.sentenceIndex < this.srtSubtitles.length && !this.shiftPressed)
          this.regions.getRegions()[this.sentenceIndex].setOptions({
            start: this.srtSubtitles[this.sentenceIndex].startTime,
          });
      }
    },

    subFirstLine: function () {
      if (this.subFirstLine.trim() == "") this.subFirstLine = "";
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    subSecLine: function () {
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    note: function () {
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    sentenceIndex: function () {
      this.onLoop();
      this.calcFav();
      if (!this.isSingle && this.dubbingMode && this.isUtterTransLine) {
        if (this.utterThis) window.speechSynthesis.cancel();
        this.utterTransLine();
        return;
      }
      if (this.isEditSubandNotes) {
        this.onRUdo = true;
        setTimeout(() => {
          this.onRUdo = false;
        }, 1000);
      }
      if (this.isEditSubandNotes) {
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].endTime;
        this.subFirstLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
        this.subSecLine =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
        this.note =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2];
        if (this.isWaveSurfer && this.regions) {
          this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
            start: this.startTimeTemp,
            end: this.endTimeTemp - 0.03,
          });
        }
      }

      if (this.showSubtitleList) {
        document
          .getElementById(this.sentenceIndex)
          .scrollIntoView({ block: "center", behavior: "smooth" });
      }
      if (this.isDictation) {
        this.dictationContent = "";
        if (this.dictationArray.length > 0) {
          const tempCon = this.dictationArray.find(
            (item) => item.id === this.sentenceIndex
          );
          if (tempCon) this.dictationContent = tempCon.con;
        }
        if (this.autoCloseCheck) {
          this.isCheck = false;
        }
        this.audioBlob = null;
        this.audioUrl = null;
        if (this.audioRecordArray.length > 0) {
          const tempRec = this.audioRecordArray.find(
            (item) => item.id === this.sentenceIndex
          );
          if (tempRec) {
            this.audioBlob = tempRec.con;
            this.audioUrl = URL.createObjectURL(this.audioBlob);
          }
        }
      }
    },

    isSetting: function () {
      if (this.isEditSubandNotes) {
        this.switchEditSubandNote();
        let temp1 = this.isWaveSurfer;
        let temp2 = this.isMoveAll;
        setTimeout(() => {
          this.switchEditSubandNote();
          this.isWaveSurfer = temp1;
          this.isMoveAll = temp2;
        }, 10);
      }
      this.onLoop();
    },

    repeatTimes: function () {
      if (this.repeatTimes < 0) this.repeatTimes = 0;
      this.repeatTimes = Math.floor(this.repeatTimes);
      this.save();
    },

    reviseData: function () {
      this.save();
    },

    revisePlan: function () {
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

    defaultWaveSurfer: function () {
      this.save();
    },

    nextLoopPlay: function () {
      this.save();
    },

    random: function () {
      this.save();
    },

    autoStop: function () {
      this.save();
    },

    autoStopMins: function () {
      this.save();
    },

    loopStart: function () {
      if (this.loopStart >= this.loopEnd) this.loopStart = this.loopEnd - 1;
      if (this.loopStart < 1) this.loopStart = 1;
      this.save();
    },

    loopEnd: function () {
      if (this.loopEnd <= this.loopStart) this.loopEnd = this.loopStart + 1;
      this.save();
    },

    currentSpeed: function () {
      if (this.currentSpeed == "") this.currentSpeed = "0.8 0.5";
      this.save();
    },

    timeStampChangeStart: function () {
      this.timeStampChangeStart = Math.floor(this.timeStampChangeStart);
      this.save();
    },

    timeStampChangeEnd: function () {
      this.timeStampChangeEnd = Math.floor(this.timeStampChangeEnd);
      this.save();
    },

    subtitleLang: function () {
      this.save();
    },

    isUtterTransLine: function () {
      this.save();
    },

    isSystemTTS: function () {
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
      this.save();
    },

    lineNumOfTrans: function () {
      this.lineNumOfTrans = Math.floor(this.lineNumOfTrans);
      if (this.lineNumOfTrans < 1) this.lineNumOfTrans = 1;
      if (this.lineNumOfTrans > 3) this.lineNumOfTrans = 3;
      this.save();
    },

    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        this.langInTransLine = navigator.language || navigator.userLanguage;
        this.autoDetectLangInTrans();
      }

      this.save();
    },

    isPauseAfterFirstDone: function () {
      this.save();
    },

    dubbingMode: function () {
      this.save();
    },

    autoPlay: function () {
      this.save();
    },

    isPlayFullFavList: function () {
      this.save();
    },

    autoCloseCheck: function () {
      this.save();
    },

    ignoreC: function () {
      this.save();
    },
    showRetracePlay: function () {
      this.save();
    },
    retraceTime: function () {
      this.save();
    },

    transUrl: function () {
      if (this.transUrl.trim() == "")
        this.transUrl = "https://fanyi.baidu.com/#zh/en/";
      this.save();
    },

    allowCache() {
      if (this.allowCache) window.localStorage.setItem("cacheOff", 0);
      else {
        window.localStorage.setItem("cacheOff", 1);
      }
      setTimeout(() => {
        location.reload();
      }, 300);
    },

    reader() {
      if (this.hasSpeechSynthesis) {
        if (this.reader < 1) this.reader = 1;
        this.reader = Math.floor(this.reader);
        window.localStorage.setItem("reader", this.reader);
      } else this.reader = 0;
    },

    srtSubtitlesLength: function () {
      if (!this.RUdoAlert && this.wavesurfer && this.regions) {
        this.updateRgns();
      }
    },

    raw: function () {
      this.isReadyToPlay = false;
      this.playCount = 0;
      this.firstMount = false;
      this.isFirstClick = true;
      if (this.isFavOnPlay && this.isAutoDetectLang)
        this.autoDetectLangInTrans();

      if (!this.isFavOnPlay && !this.onRevision && !this.showRevision) {
        if (
          !this.onOffline &&
          window.localStorage.getItem(this.srtNotUpload) &&
          window.localStorage.getItem(this.mediaName)
        ) {
          this.confirmType = "saveUnsavedSub";
          this.showConfirm();
        } else if (
          this.onOffline &&
          window.localStorage.getItem(this.mediaName)
        ) {
          this.reqF.content = window.localStorage.getItem(this.mediaName);
        } else if (
          !this.onOffline &&
          !window.localStorage.getItem(this.srtNotUpload)
        ) {
          window.localStorage.setItem(this.mediaName, this.reqF.content);
        }
      }
    },
  },

  async mounted() {
    window.localStorage.setItem("cachedOther", 1);
    window.addEventListener("keydown", this.key);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("resize", this.handleResize);
    this.listing = this.oldReq.items;
    this.updatePreview();
    this.initUtter();
    if (this.reqF.size == 0) {
      this.reqF.content =
        "1\n00:00:01,000 --> 00:00:02,000\n Click edit to modified. \n \r\n";
      this.saveSubNow();
      setTimeout(() => {
        location.reload();
      }, 300);
    }
    if (this.reqF.content == undefined) {
      alert(
        "Can't read content of .srt. and the .srt file should be encoded using UTF-8!"
      );
      this.close();
    }
    this.reqF.content = this.formatAll(this.reqF.content);
    if (this.onOffline) this.allowCache = true;
    this.getReader();
    if (!this.checkLocalStorageSpace()) {
      alert(this.$t("repeater.alertSpace"));
    }
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.key);
    window.removeEventListener("keyup", this.keyUp);
    window.removeEventListener("resize", this.handleResize);
    this.cleanUp1();
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  },

  methods: {
    async checkDownload() {
      try {
        var content = await api.fetch(
          "/files/!PDJ/Repeater-backup/" +
            this.mediaName.slice(0, -4) +
            "-dictation.txt"
        );
        let temp2 = JSON.parse(content.content);
        if (temp2.length > 0) {
          this.canDownload = true;
          return;
        }
        let path =
          "/files/" +
          "!PDJ/Repeater-backup/Rec-" +
          this.mediaName.slice(0, -4) +
          "/";
        let baseItems = (await api.fetch(path)).items;
        if (baseItems.length > 0) {
          this.canDownload = true;
          return;
        }
      } catch (e) {
        console.error(e);
      }
    },

    showRecordingSetNote() {
      alert(this.$t("repeater.noRecordPermission"));
    },

    recording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    },
    async startRecording() {
      this.cleanUp1();
      this.cleanUp2();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;

        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.audioChunks = [];
          this.isRecording = false;
          this.saveRecording();
        };
      } catch (error) {
        alert(this.$t("repeater.noRecordPermission"));
      }
    },

    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop();
        setTimeout(() => {
          this.playRecording();
        }, 10);
      }
    },

    playRecording() {
      if (this.audioUrl) {
        this.cleanUp1();
        this.cleanUp2();
        this.audioRecorded = new Audio(this.audioUrl);
        this.audioRecorded.play();
      }
    },

    saveRecording() {
      let filteredArray = this.audioRecordArray.filter(
        (item) => item.id !== this.sentenceIndex
      );
      let newItem = {
        id: this.sentenceIndex,
        con: this.audioBlob,
      };
      filteredArray.push(newItem);
      this.audioRecordArray = filteredArray;
      localforage
        .setItem(this.mediaName + "recordAudio", filteredArray, function () {})
        .catch((error) => {
          console.error(error);
        });
    },

    async uploadDicRec() {
      await this.deleteAudioRec();
      if (!this.netStatus) {
        this.netStatus = true;
        return;
      }
      this.canDownload = true;
      let path =
        "/files/!PDJ/Repeater-backup/" +
        this.mediaName.slice(0, -4) +
        "-dictation.txt";
      try {
        api.remove(path);
      } catch (e) {
        console.log(e);
      }
      this.saveServerDictation();
      this.saveServerRecordAll();
    },

    saveServerRecordAll() {
      this.audioRecordArray.forEach((item) => {
        let itemBlob = item.con;
        let itemIndex = item.id;
        this.saveServerRecord(itemIndex, itemBlob);
      });
    },

    async saveServerRecord(itemIndex, itemBlob) {
      let saveUrl =
        "/files/!PDJ/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/" +
        itemIndex +
        ".wav";
      const arrayBuffer = await itemBlob.arrayBuffer();

      try {
        await api.post(saveUrl, arrayBuffer, true);
      } catch (error) {
        return;
      }
    },

    async saveServerDictation() {
      try {
        this.dictationArray =
          JSON.parse(
            window.sessionStorage.getItem(this.mediaName + "dictation")
          ) || [];
        await api.post(
          "/files/!PDJ/Repeater-backup/" +
            this.mediaName.slice(0, -4) +
            "-dictation.txt",
          JSON.stringify(this.dictationArray),
          true
        );
      } catch (error) {
        return;
      }
    },

    async downloadDicRec() {
      await this.readServerDictation();
      if (!this.netStatus) {
        this.netStatus = true;
        return;
      }

      this.audioRecordArray = [];
      this.audioBlob = null;
      this.audioUrl = null;
      await localforage
        .removeItem(this.mediaName + "recordAudio")
        .then(() => {
          console.log("we just removed: " + "recordAudio");
        })
        .catch((error) => {
          console.error("Error removing data:", error);
        });
      let path =
        "/files/" +
        "!PDJ/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/";
      try {
        let baseItems = (await api.fetch(path)).items;
        for (let item of baseItems) {
          let itemUrl = item.path.split("!PDJ/Repeater-backup/Rec-")[1];
          if (itemUrl.includes(".wav")) {
            await this.readServerRecord(itemUrl);
          }
        }
        let tempIndex = this.sentenceIndex;
        if (tempIndex > 1) this.sentenceIndex = 1;
        else this.sentenceIndex = 2;
        setTimeout(() => {
          this.sentenceIndex = tempIndex;
        }, 10);
      } catch (e) {
        return;
      }
    },

    async readServerRecord(itemUrl) {
      let srtUrl = api.getDownloadURL(this.req, true);
      let playUrl =
        srtUrl.split("/api/raw/")[0] +
        "/api/raw/" +
        "!PDJ/Repeater-backup/Rec-" +
        itemUrl +
        srtUrl.split(".srt")[1];
      let index = Number(itemUrl.split("/")[1].split(".wav")[0]);
      try {
        let response = await fetch(playUrl);
        if (!response.ok) {
          return;
        }
        const arrayBuffer = await response.arrayBuffer();

        // 创建 Blob 并指定 MIME 类型为 'audio/wav'
        this.audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        let filteredArray = this.audioRecordArray.filter(
          (item) => item.id !== index
        );
        let newItem = {
          id: index,
          con: this.audioBlob,
        };
        filteredArray.push(newItem);
        this.audioRecordArray = filteredArray;
        localforage.setItem(
          this.mediaName + "recordAudio",
          filteredArray,
          function () {}
        );
      } catch (error) {
        return;
      }
    },

    async readServerDictation() {
      try {
        var content = await api.fetch(
          "/files/!PDJ/Repeater-backup/" +
            this.mediaName.slice(0, -4) +
            "-dictation.txt"
        );
        this.dictationArray = JSON.parse(content.content);
        if (this.dictationArray.length > 0) {
          window.sessionStorage.setItem(
            this.mediaName + "dictation",
            JSON.stringify(this.dictationArray)
          );
          const tempCon = this.dictationArray.find(
            (item) => item.id === this.sentenceIndex
          );
          if (tempCon) this.dictationContent = tempCon.con;
        } else {
          window.sessionStorage.removeItem(this.mediaName + "dictation");
          this.dictationArray = [];
          this.dictationContent = "";
        }
      } catch (e) {
        if (!e.message.includes("404")) {
          this.netStatus = false;
          alert(this.$t("repeater.failDownload"));
        } else {
          window.sessionStorage.removeItem(this.mediaName + "dictation");
          this.dictationArray = [];
          this.dictationContent = "";
        }
      }
    },

    retracePlay() {
      this.fromRetrace = true;
      if (this.isSingle) {
        this.cleanUp1();
        this.playSection();
      } else this.click();
    },

    switchTempSpeed() {
      if (!this.onTempSpeed) {
        this.normalSpeed = this.currentMedia.playbackRate;
      } else {
        this.currentMedia.playbackRate = this.normalSpeed;
      }
      this.onTempSpeed = !this.onTempSpeed;
      this.click();
    },

    checkLocalStorageSpace() {
      try {
        localStorage.setItem("__checkSpace", new Array(512 * 512).join("x")); // about 200KB's data
        localStorage.removeItem("__checkSpace");
        return true;
      } catch (e) {
        return false;
      }
    },

    async initWaveSurfer() {
      var peaks = [];
      let vmm = this;
      let tmediaName = this.mediaName + "peaks";

      try {
        const value = await localforage.getItem(tmediaName);
        if (value) {
          peaks = JSON.parse(value);
          vmm.localPeaks = peaks;
        }
      } catch (err) {
        console.error(err);
      }

      if (peaks.length == 0) {
        peaks = await this.readPeaks();
      }
      this.showWaveformInfo = true;
      this.regions = RegionsPlugin.create();
      if (peaks.length > 0) {
        this.wavesurfer = WaveSurfer.create({
          container: "#waveform",
          height: 80,
          cursorColor: "black",
          progressColor: "black",
          waveColor: "blue",
          minPxPerSec: 45,
          normalize: true,
          hideScrollbar: false,
          autoCenter: this.autoCenter,
          plugins: [this.regions],
          mediaControls: false,
          media: this.currentMedia,
          peaks: peaks,
        });
      } else {
        this.wavesurfer = WaveSurfer.create({
          container: "#waveform",
          height: 80,
          cursorColor: "black",
          progressColor: "black",
          waveColor: "blue",
          minPxPerSec: 45,
          normalize: true,
          hideScrollbar: false,
          autoCenter: this.autoCenter,
          plugins: [this.regions],
          mediaControls: false,
          media: this.currentMedia,
        });
      }

      this.scrollbars();
      this.updateRegions();
    },

    updateRegions() {
      this.wavesurfer.on("decode", () => {
        this.updateRgns();
      });
      this.regions.on("region-updated", (region) => {
        if (this.sentenceIndex !== region.id) {
          this.sentenceIndex = region.id;
        }
        this.startTimeTemp = region.start;
        this.endTimeTemp = region.end + 0.03;
        this.click();
      });

      let activeRegion = null;
      this.regions.on("region-in", (region) => {
        activeRegion = region;
        if (this.sentenceIndex !== region.id && !this.fromClick) {
          this.sentenceIndex = region.id;
        }
      });
      this.regions.on("region-out", (region) => {
        if (activeRegion === region) {
          if (this.sentenceIndex == region.id && !this.cont) {
            this.cont = true;
            this.cleanUp2();
            this.cleanUp1();
            this.wavesurfer.pause();
          }
        }
      });

      this.regions.on("region-clicked", (region, e) => {
        if (this.regionPlay) e.stopPropagation();
        this.sentenceIndex = region.id;
        activeRegion = region;
        if (this.ctrlPressed || this.shiftPressed) {
          const bbox = this.wavesurfer.getWrapper().getBoundingClientRect();
          const { width } = bbox;
          const offsetX = e.clientX - bbox.left;
          const relX = Math.min(1, Math.max(0, offsetX / width));
          let timeStamp = (relX * this.wavesurfer.getDuration()).toFixed(3);
          this.editHotkeys(timeStamp, e);
        } else if (this.regionPlay) this.click();
      });

      this.regions.on("region-double-clicked", (region, e) => {
        e.stopPropagation();
        this.sentenceIndex = region.id;
        activeRegion = region;
        this.cleanUp2();
        this.cleanUp1();
        this.wavesurfer.pause();
        this.cont = true;
      });

      this.wavesurfer.on("interaction", () => {
        activeRegion = null;
      });

      this.wavesurfer.on("click", () => {
        this.cleanUp1();
        this.cleanUp2();
        if (!this.regionPlay) this.cont = true;
        else this.cont = false;
        this.fromClick = false;
        this.wavesurfer.play();
      });

      this.wavesurfer.on("dblclick", () => {
        this.cleanUp1();
        this.cleanUp2();
        this.wavesurfer.pause();
      });

      this.wavesurfer.once("decode", () => {
        this.showWaveformInfo = false;
        this.wavesurfer.on("zoom", (minPxPerSec) => {
          this.minPxPerSec = minPxPerSec;
        });
        if (this.localPeaks.length == 0) {
          const peaks = this.wavesurfer.exportPeaks({
            channels: 2,
            precision: 10_000,
            maxLength: this.currentMedia.duration * 50,
          });
          this.savePeaks(peaks);
          this.localPeaks = peaks;
          let tmediaName = this.mediaName + "peaks";
          localforage
            .setItem(tmediaName, JSON.stringify(peaks), function () {})
            .catch((error) => {
              console.error(error);
            });
        }
      });
    },

    async readPeaks() {
      var peaks = [];
      try {
        var peaksAll = await api.fetch(
          "/files/!PDJ/Repeater-backup/peaks/" + this.mediaName + ".txt"
        );
        peaks = JSON.parse(peaksAll.content);
        this.localPeaks = peaks;
        let tmediaName = this.mediaName + "peaks";
        localforage
          .setItem(tmediaName, JSON.stringify(peaks), function () {})
          .catch((error) => {
            console.error("Error removing data:", error);
          });

        return peaks;
      } catch (e) {
        console.log(e);
        peaks = [];
        return peaks;
      }
    },

    updateRgns() {
      this.regions.clearRegions();
      for (var i = 1; i <= this.srtSubtitles.length; ++i) {
        this.regions.addRegion({
          start: this.srtSubtitles[i - 1].startTime,
          end: this.srtSubtitles[i - 1].endTime - 0.03,
          id: i,
          content: i.toString(),
          color: "rgba(0, 255, 0, 0.25)",
          drag: false,
          resize: true,
        });
      }
    },

    scrollbars() {
      const style = document.createElement("style");
      style.textContent = `{scrollbar-width: thin;scrollbar-color:#eee;} ::-webkit-scrollbar{width:5px;height:10px;} ::-webkit-scrollbar-track{background:	#C0C0C0;} ::-webkit-scrollbar-thumb{background-color:#444;border-radius:5px;border:1px solid #ddd;}`;
      this.wavesurfer.getWrapper().appendChild(style);
    },

    showWaveSurfer() {
      if (this.isWaveSurfer) this.isWaveSurfer = false;
      else this.isWaveSurfer = true;
    },

    async readyStatus() {
      if (this.currentMedia) this.currentMedia.pause();
      var PDJcontent = "";
      if (
        !this.hasConfirmed &&
        !this.onOffline &&
        window.localStorage.getItem(this.favNotUpload) &&
        this.user.id == window.localStorage.getItem("userIDRepeater") &&
        window.localStorage.getItem(this.favFileName)
      ) {
        this.confirmType = "saveUnsavedFav";
        this.showConfirm();
        return;
      } else if (
        (this.onOffline ||
          (this.hasConfirmed &&
            window.localStorage.getItem(this.favNotUpload)) ||
          (this.isFavOnPlay && this.isPlayFullFavList) ||
          this.showRevision) &&
        this.user.id == window.localStorage.getItem("userIDRepeater") &&
        window.localStorage.getItem(this.favFileName)
      ) {
        PDJcontent = window.localStorage.getItem(this.favFileName);
      } else {
        try {
          if (this.onOffline) window.localStorage.removeItem("isOffline");
          var PDJserverContent = null;
          PDJserverContent = await api.fetch("/files/!PDJ/" + this.favFileName);
          if (this.onOffline) window.localStorage.setItem("isOffline", 1);
          PDJcontent = PDJserverContent.content;
          window.localStorage.setItem("server" + this.favFileName, PDJcontent);
          window.localStorage.setItem(this.favFileName, PDJcontent);
          window.localStorage.setItem("userIDRepeater", this.user.id);
        } catch (e) {
          this.isReadyToPlay = true;
          this.confirmType = "fetch";
          this.showConfirm();
        }
      }

      if (PDJcontent !== "") {
        if (PDJcontent.includes(this.reqF.name + "privatecustomConfig::")) {
          this.hasPrivate = true;
        } else this.hasPrivate = false;

        if (this.isPrivate == "Yes" && this.hasPrivate) {
          this.setPara(
            PDJcontent.split(this.reqF.name + "private")[1].split("\n\n")[0]
          );
        } else this.setPara(PDJcontent.split("\n\n")[0]);

        this.reviseData = JSON.parse(PDJcontent.split("\n\n\n\n")[1]);
        this.favList = JSON.parse(PDJcontent.split("Subtitle:")[1]);
        this.calcFav();
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.onLoop();
        this.isReadyToPlay = true;
      }
      if (
        window.localStorage.getItem(this.favNotUpload) ||
        !window.localStorage.getItem(this.favFileName)
      ) {
        this.save();
      }
    },

    setPara(PDJcontent) {
      this.repeatTimes = Number(JSON.parse(PDJcontent.split("::")[1]));
      this.interval = Number(JSON.parse(PDJcontent.split("::")[2]));
      this.autoPlayNext = JSON.parse(PDJcontent.split("::")[3]);
      this.timeStampChangeStart = Number(JSON.parse(PDJcontent.split("::")[4]));
      this.timeStampChangeEnd = Number(JSON.parse(PDJcontent.split("::")[20]));
      this.currentSpeed = JSON.parse(PDJcontent.split("::")[5]);
      this.subtitleLang = JSON.parse(PDJcontent.split("::")[6]);
      this.switchSubtitleMini();
      this.pauseTimeTransLine = Number(JSON.parse(PDJcontent.split("::")[8]));
      this.speedOfUtter = Number(JSON.parse(PDJcontent.split("::")[9]));
      this.isUtterTransLineFirstly = JSON.parse(PDJcontent.split("::")[10]);
      this.isAutoDetectLang = JSON.parse(PDJcontent.split("::")[13]);
      this.isPauseAfterFirstDone = JSON.parse(PDJcontent.split("::")[14]);
      this.autoPlay = JSON.parse(PDJcontent.split("::")[15]);
      this.isSystemTTS = JSON.parse(PDJcontent.split("::")[16]);
      this.TTSurl = JSON.parse(PDJcontent.split("::")[17]);
      this.replayFromStart = JSON.parse(PDJcontent.split("::")[18]);
      this.isPlayFullFavList = JSON.parse(PDJcontent.split("::")[19]);
      this.revisePlan = JSON.parse(PDJcontent.split("::")[21]);
      this.nextLoopPlay = JSON.parse(PDJcontent.split("::")[22]);
      this.loopStart = Number(JSON.parse(PDJcontent.split("::")[23]));
      this.loopEnd = Number(JSON.parse(PDJcontent.split("::")[24]));
      this.autoStop = JSON.parse(PDJcontent.split("::")[25]);
      this.autoStopMins = Number(JSON.parse(PDJcontent.split("::")[26]));
      this.transUrl = JSON.parse(PDJcontent.split("::")[27]);
      if (PDJcontent.split("::")[28])
        this.random = JSON.parse(PDJcontent.split("::")[28]);
      if (PDJcontent.split("::")[29])
        this.defaultWaveSurfer = JSON.parse(PDJcontent.split("::")[29]);
      if (PDJcontent.split("::")[30])
        this.dubbingMode = JSON.parse(PDJcontent.split("::")[30]);
      if (PDJcontent.split("::")[31])
        this.autoCloseCheck = JSON.parse(PDJcontent.split("::")[31]);
      if (PDJcontent.split("::")[32])
        this.ignoreC = JSON.parse(PDJcontent.split("::")[32]);
      if (PDJcontent.split("::")[33])
        this.showTempSpeed = JSON.parse(PDJcontent.split("::")[33]);
      if (PDJcontent.split("::")[34])
        this.tempSpeed = Number(JSON.parse(PDJcontent.split("::")[34]));
      if (PDJcontent.split("::")[35])
        this.showRetracePlay = JSON.parse(PDJcontent.split("::")[35]);
      if (PDJcontent.split("::")[36])
        this.retraceTime = Number(JSON.parse(PDJcontent.split("::")[36]));
      this.isUtterTransLine = JSON.parse(PDJcontent.split("::")[7]);
      if (!this.isAutoDetectLang) {
        this.langInTransLine = JSON.parse(PDJcontent.split("::")[11]);
        this.lineNumOfTrans = Number(JSON.parse(PDJcontent.split("::")[12]));
      } else {
        this.autoDetectLangInTrans();
        this.langInTransLine = navigator.language || navigator.userLanguage;
      }
    },

    checkLandscape() {
      return window.matchMedia("(orientation: landscape)").matches;
    },

    checkMobileScreen() {
      return window.matchMedia("(max-width: 1000px)").matches;
    },

    showMoveAll() {
      this.isMoveAll = !this.isMoveAll;
    },

    saveMoveAll() {
      this.hasMoveAll = true;
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");

      for (var i = 0; i < textSubtitles.length; i++) {
        var time1 = this.convertToHMS(
          this.srtSubtitles[i].startTime * 1000 -
            this.timeStampChangeStart +
            this.moveAll
        );

        var startTimeFormat =
          time1.hours +
          ":" +
          time1.minutes +
          ":" +
          time1.seconds +
          "," +
          time1.milliseconds;
        var time2 = this.convertToHMS(
          this.srtSubtitles[i].endTime * 1000 -
            this.timeStampChangeEnd +
            1 +
            this.moveAll
        );
        var endTimeFormat =
          time2.hours +
          ":" +
          time2.minutes +
          ":" +
          time2.seconds +
          "," +
          time2.milliseconds;
        var newContent = textSubtitles[i].replace(
          this.srtSubtitles[i].timeStamp,
          startTimeFormat + " --> " + endTimeFormat
        );
        formatContent = formatContent.replace(textSubtitles[i], newContent);
      }

      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      this.changeNew[this.historyIndex] = formatContent;

      this.historyIndex = this.historyIndex + 1;
      formatContent = this.formatAll(formatContent);
      this.reqF.content = formatContent;
      this.cleanUp1();
      this.cleanUp2();
      this.sentenceIndex = this.sentenceIndex + 1;
      setTimeout(() => {
        this.sentenceIndex = this.sentenceIndex - 1;
      }, 10);
      window.localStorage.setItem(this.mediaName, formatContent);
      if (this.timeOutId3) clearTimeout(this.timeOutId3);
      this.timeOutId3 = setTimeout(() => {
        this.saveSubFinal();
      }, 1000);
    },

    cacheMedia() {
      let keyName = this.mediaName;
      if (window.localStorage.getItem("cKeys") == null)
        window.localStorage.setItem("cKeys", this.cachedKeys);
      else this.cachedKeys = window.localStorage.getItem("cKeys");
      var vmcachedKeys = this.cachedKeys;
      var vmmax = this.maxCacheNum + 1;
      this.fetchCount--;
      fetch(this.raw)
        .then((response) => response.blob())
        .then((blob) => {
          let vmm = this;
          localforage
            .setItem(keyName, blob, function () {
              vmcachedKeys = vmcachedKeys + ";;" + keyName;
              window.localStorage.setItem("cKeys", vmcachedKeys);
              var ck = vmcachedKeys.split(";;");
              if (ck.length > vmmax) {
                var keyName1 = ck[1];
                localforage
                  .removeItem(keyName1)
                  .then(() => {
                    console.log("we just removed: " + keyName1);
                  })
                  .catch((error) => {
                    console.error("Error removing data:", error);
                  });

                vmcachedKeys = vmcachedKeys.replace(";;" + ck[1], "");
                window.localStorage.setItem("cKeys", vmcachedKeys);
              }
              vmm.cachedKeys = vmcachedKeys;
              setTimeout(() => {
                if (keyName !== vmm.mediaName) {
                  return; // may multiple running at the same time. but limited up to 2. this to avoid saved wrong name.
                }
                if (!vmm.isSingle && !vmm.currentMedia.paused) {
                  window.localStorage.setItem(
                    "onFullPlaying",
                    vmm.currentMedia.currentTime
                  );
                }
                localforage
                  .getItem(keyName)
                  .then(function (value) {
                    vmm.raw = URL.createObjectURL(value);
                    vmm.playFromCache = true;
                    vmm.mediaCached = true;
                  })
                  .catch(function () {});
              }, 200);

              setTimeout(() => {
                vmm.mediaCached = false;
                if (window.localStorage.getItem("onFullPlaying")) {
                  vmm.regularPlay();
                  vmm.currentMedia.currentTime = Number(
                    window.localStorage.getItem("onFullPlaying")
                  );
                  window.localStorage.removeItem("onFullPlaying");
                }
              }, 2000);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error("Error fetching or converting URL:", error);
        });
    },

    dictationCheck() {
      this.isCheck = !this.isCheck;
    },

    onLoop() {
      if (this.isSingle && !this.isSetting && this.nextLoopPlay) {
        if (
          this.sentenceIndex < this.loopStart ||
          this.sentenceIndex > this.loopEnd
        )
          this.sentenceIndex = this.loopStart;
      }
    },

    addPrivate() {
      let customConfig = this.getConfig();
      let favContent = window.localStorage.getItem(this.favFileName);
      let allConfig = favContent.split("\n\n\n\n")[0];
      favContent = favContent.replace(
        allConfig,
        allConfig + "\n\n" + this.reqF.name + "private" + customConfig
      );
      this.tempFavContent = favContent;
      this.saveNow(this.tempFavContent);
      setTimeout(() => {
        this.isPrivate = "Yes";
      }, 50);
    },

    showTransPage() {
      let url = this.transUrl + this.newWord;
      window.open(url, "_blank");
    },
    wrongSrc() {
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        this.confirmType = "wrongSrc";
        this.showConfirm();
      }
    },

    getDateAfterDays(n) {
      const date = new Date();
      const daysInMilliseconds = 1000 * 60 * 60 * 24; // 计算1天毫秒数。
      const nDaysAfter = new Date(date.getTime() + n * daysInMilliseconds); // n天后的日期。
      return nDaysAfter.toLocaleDateString("af").replaceAll("/", "-");
    },

    compareDates(date) {
      const d1 = new Date();
      const d2 = new Date(date);
      if (d1.getTime() < d2.getTime()) {
        return 1;
      } else {
        return 0;
      }
    },

    addNewRevision() {
      if (this.indexS >= this.indexE) {
        this.indexE = this.indexS + 1;
      }
      let reviseDate = [];
      let reviseTemp1 = this.revisePlan.split(" ");
      let srtUrl = api.getDownloadURL(this.reqF, true);
      let reviseTemp2 = "";
      for (var i = 0; i < reviseTemp1.length; ++i) {
        if (i == 0 && parseInt(reviseTemp1[0]) == 0) {
          reviseTemp2 =
            this.getDateAfterDays(parseInt(reviseTemp1[i])) +
            "^^" +
            "0" +
            "**" +
            "1";
        } else {
          reviseTemp2 =
            this.getDateAfterDays(parseInt(reviseTemp1[i])) +
            "^^" +
            "1" +
            "**" +
            "1";
        }
        reviseDate.push(reviseTemp2);
      }
      var reviseItem = {
        oRawPath: srtUrl.split("?")[0].split("/raw/")[1],
        name: this.mediaName,
        startIndex: this.indexS,
        endIndex: this.indexE,
        date: reviseDate,
      };
      for (var ii = 0; ii < this.reviseData.length; ++ii) {
        if (
          srtUrl.split("?")[0].split("/raw/")[1] ==
            this.reviseData[ii].oRawPath &&
          this.indexS == this.reviseData[ii].startIndex &&
          this.indexE == this.reviseData[ii].endIndex
        ) {
          let iii = ii + 1;
          alert("Already existed in Review Plan, Item " + iii + ".");
          return;
        }
      }
      this.reviseData.unshift(reviseItem);
    },

    calcFav() {
      this.isFav = false;
      if (this.isFavOnPlay) this.isFav = true;
      else if (this.currentFileFavList) {
        for (var i = 0; i < this.currentFileFavList.length; ++i) {
          if (
            this.currentFileFavList[i].startTime ==
            this.srtSubtitles[this.sentenceIndex - 1].startTime
          ) {
            this.isFav = true;
          }
        }
      }
    },

    async revisionPlay(name, startIndex, oRawPath, index) {
      if (name.endsWith(".mp3")) this.reviseType = 1;
      else this.reviseType = 2;
      this.srtRevisePath = "/files/" + oRawPath;
      try {
        this.oReq = await api.fetch(this.srtRevisePath);
        var tempMediaName = name + "srtNotUpload";
        if (
          (this.onOffline || window.localStorage.getItem(tempMediaName)) &&
          window.localStorage.getItem(name)
        ) {
          this.oReq.content = window.localStorage.getItem(name);
        } else if (
          !this.onOffline &&
          !window.localStorage.getItem(tempMediaName)
        ) {
          window.localStorage.setItem(name, this.oReq.content);
        }
        this.onRevision = true;
        this.tempSentenceIndex = this.sentenceIndex;
        this.sentenceIndex = startIndex;
        this.showRevision = false;
      } catch (e) {
        this.confirmType = "fetchRevision";
        this.showConfirm(index);
      }
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

    calcRaw() {
      let srtUrl = api.getDownloadURL(this.reqF, true);
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        this.raw =
          srtUrl.split("/raw/")[0] +
          "/raw/" +
          this.srtSubtitles[this.sentenceIndex - 1].originalRawPath.split(
            "?"
          )[0] +
          "?" +
          srtUrl.split("?")[1];
      } else {
        if (srtUrl && this.isMediaType == 1) {
          this.raw = srtUrl.replace(".srt", ".mp3");
        } else if (srtUrl && this.isMediaType == 2) {
          this.raw = srtUrl.replace(".srt", ".mp4");
        } else this.raw = " ";
      }
    },

    getCacheMedia() {
      setTimeout(() => {
        if (!this.allowCache) {
          this.calcRaw();
          return;
        }
        let keyName = this.mediaName;
        if (!this.cachedKeys.includes(";;" + keyName)) {
          this.calcRaw();
          this.playFromCache = false;
          this.fetchCount++;
          if (this.fetchCount > 2) return;
          this.cacheMedia();
          return;
        }
        let vm = this;
        localforage
          .getItem(keyName)
          .then(function (value) {
            vm.raw = URL.createObjectURL(value);
            vm.playFromCache = true;
          })
          .catch(function () {
            vm.cachedKeys = vm.cachedKeys.replace(";;" + keyName, "");
            window.localStorage.setItem("cKeys", vm.cachedKeys);
            vm.calcRaw();
            vm.playFromCache = false;
            vm.fetchCount++;
            if (vm.fetchCount > 2) return;
            vm.cacheMedia();
            return;
          });
      }, 50);
    },

    cachedNumber() {
      var ck = window.localStorage.getItem("cKeys");
      if (ck) this.numOfKeys = ck.split(";;").length - 1;
      else this.numOfKeys = 0;
    },

    async getTrans() {
      this.newTranslation = await fetch(
        "https://api.oick.cn/api/fanyi?text=" + this.newWord
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data.result;
        })
        .catch((error) => {
          console.error("Error fetching translation:", error);
        });
    },

    addANewWord() {
      this.showEditNew = true;
    },

    saveWordToSRT() {
      let newphrase = "[" + this.newWord + ":" + this.newTranslation + "]; ";
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
      this.onEdit = true;
      this.saveSub();
      this.showAddNew = false;
      this.showEditNew = false;
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
      if (
        this.isIphone &&
        !(this.isUtterTransLineFirstly == false && this.isSystemTTS == "No")
      ) {
        if (this.isSystemTTS == "Yes") this.utterTransLine();
        if (this.isSystemTTS == "No" && this.audio) this.audio.muted = true;
        this.currentMedia.play();
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.currentMedia.muted = true;
        setTimeout(() => {
          this.currentMedia.muted = false;
          if (this.audio) this.audio.muted = false;
          this.cleanUp2();
          this.cleanUp1();
          if (this.utterThis) {
            window.speechSynthesis.stop();
            window.speechSynthesis.cancel();
          }

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
      }
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
        if (this.newWordList.length > 0)
          this.newWordList[indexWordList].showTrans = true;
        this.indexOfNewWordList = indexWordList;
      }
      this.cleanUp1();
      this.cleanUp2();
      if (this.isFavOnPlay && this.showNewWordList) return;
      this.click();
    },

    switchShowList() {
      if (!this.showSubtitleList && !this.showNewWordList && !this.withTrans) {
        this.showSubtitleList = true;
      } else if (
        this.showSubtitleList &&
        !this.showNewWordList &&
        !this.withTrans &&
        !this.isFavOnPlay
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.showSubtitleList = false;
        this.searchList = "";
        this.showNewWordList = true;
      } else if (
        this.showSubtitleList &&
        !this.showNewWordList &&
        !this.withTrans &&
        this.isFavOnPlay
      ) {
        this.showSubtitleList = false;
        this.searchList = "";
      } else if (
        !this.showSubtitleList &&
        this.showNewWordList &&
        !this.withTrans
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.withTrans = true;
      } else if (
        !this.showSubtitleList &&
        this.showNewWordList &&
        this.withTrans
      ) {
        if (this.newWordList.length > 0)
          this.newWordList[this.indexOfNewWordList].showTrans = false;
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
        if (!this.isSingle) {
          this.utterInProcess = false;
          return;
        }
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
        let ttsFullUrl = this.TTSurl + text;
        fetch(ttsFullUrl)
          .then(() => {
            this.audio.src = ttsFullUrl;
            this.audio.play();
            if (!this.isSingle && this.dubbingMode) {
              this.utterInProcess = false;
              return;
            }
            this.audio.addEventListener("ended", this.endUtter, false);
          })
          .catch((error) => {
            alert("Error Uttering Trans Line:", error);
            this.endUtter();
          });
      }
    },

    endUtter() {
      this.audio.removeEventListener("ended", this.endUtter, false);
      if (!this.isSingle && this.dubbingMode) return;
      if (
        (this.isEditSubandNotes || this.isDictation) &&
        this.isUtterTransLine &&
        !this.isUtterTransLineFirstly
      ) {
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
            (this.sentenceIndex < this.srtSubtitles.length ||
              (this.nextLoopPlay &&
                this.autoPlayNext &&
                !this.isEditSubandNotes &&
                !this.showNewWordList &&
                this.sentenceIndex == this.srtSubtitles.length))
          ) {
            if (
              this.autoPlayNext &&
              !this.isEditSubandNotes &&
              !this.showNewWordList
            ) {
              if (this.random) this.sentenceIndex = this.getRandomInt();
              else if (
                this.nextLoopPlay &&
                this.sentenceIndex >=
                  Math.min(this.loopEnd, this.srtSubtitles.length)
              )
                this.sentenceIndex = Number(this.loopStart);
              else this.sentenceIndex = this.sentenceIndex + 1;
              if (
                !this.autoPlay ||
                (this.isFavOnPlay && this.isPlayFullFavList)
              ) {
                this.cleanUp1();
                return;
              }
              this.singleModePlay();
            } else {
              this.cleanUp1();
              this.cleanUp2();
              return;
            }
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
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.subtitleLang = this.subtitleLang + 1;
      if (this.subtitleLang == 9) {
        this.cleanUp1();
        this.cleanUp2();
        this.showTools = true;
        this.ShowSwitchSubtitle = false;
      }
      if (this.subtitleLang >= 10) {
        this.showTools = false;
        this.subtitleLang = 1;
      }
      this.switchSubtitleMini();
      this.timeOutId1 = setTimeout(() => {
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
      if (this.audioRecorded) this.audioRecorded.pause();
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
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
      this.showSubtitleList = false;
      this.searchList = "";
      if (this.showNewWordList) {
        if (this.newWordList.length > 0)
          this.newWordList[this.indexOfNewWordList].showTrans = false;
        this.showNewWordList = false;
      }
      this.withTrans = false;
      if (!this.isFavOnPlay) {
        window.sessionStorage.setItem("lastSentenceIndex", this.sentenceIndex);
      }
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.isFavOnPlay) {
        if (this.isEditSubandNotes) this.switchEditSubandNote();
        this.isFav = true;
        this.sentenceIndex = 1;
        if (!this.isPlayFullFavList) {
          this.singleModePlay();
        }
      } else {
        this.calcFav();
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

    formatAll(x) {
      x = x.replace(/\n\n$/, "");
      if (x.includes("\t\t")) x = x.replaceAll("\t\t", "\t");
      if (x.includes("\t")) x = x.replaceAll("\t", "\n");
      if (x.includes("\r\n")) x = x.replaceAll("\r\n", "\n");
      if (x.includes("\n\n\n\n")) x = x.replaceAll("\n\n\n\n", "\n\n");
      if (x.includes("\n\n\n")) x = x.replaceAll("\n\n\n", "\n\n");
      x = x.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      x = x.replace(/^\n+|\n+$/g, "");

      for (var i = 0; i < x.split("\n\n").length; ++i) {
        var ni = i + 1;
        let nCont = x
          .split("\n\n")
          [i].replace(x.split("\n\n")[i].split("\n")[0] + "\n", ni + "\n");
        x = x.replace(x.split("\n\n")[i], nCont);
      }

      return x;
    },

    switchIsFav() {
      let srtUrl = api.getDownloadURL(this.reqF, true);
      let originRaw = "";
      if (srtUrl && this.isMediaType == 1) {
        originRaw = srtUrl.replace(".srt", ".mp3");
      } else if (srtUrl && this.isMediaType == 2) {
        originRaw = srtUrl.replace(".srt", ".mp4");
      } else originRaw = "";
      if (this.isReadyToPlay || (this.isFavOnPlay && this.isPlayFullFavList)) {
        this.isFav = !this.isFav;
        if (this.isFav) {
          //add a fav
          var fav = {
            rawPath: this.reqF.name,
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

          if (this.fromMerge) {
            this.fromMerge = false;
            var nowStartTime1 = this.srtSubtitles[this.sentenceIndex].startTime;
            this.favList = this.favList.filter(function (item) {
              return item.startTime !== nowStartTime1;
            });
          }

          if (this.notFromStarttimeTempChg) {
            var nowStartTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
            this.favList = this.favList.filter(function (item) {
              return item.startTime !== nowStartTime;
            });
          } else {
            this.notFromStarttimeTempChg = true;
            var nowEndTime = this.srtSubtitles[this.sentenceIndex - 1].endTime;
            this.favList = this.favList.filter(function (item) {
              return item.endTime !== nowEndTime;
            });
          }

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
        this.onRUdo = true;
        setTimeout(() => {
          this.onRUdo = false;
        }, 1000);
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
        if (!this.isMobile && this.defaultWaveSurfer) this.isWaveSurfer = true;
      } else this.switchSubtitleMini();
    },

    startTimeAdd() {
      let temp = (this.startTimeTemp + 0.05).toFixed(3);
      this.startTimeTemp = parseFloat(temp);
    },

    startTimeMinus() {
      let temp = (this.startTimeTemp - 0.05).toFixed(3);
      this.startTimeTemp = parseFloat(temp);
    },

    endTimeAdd() {
      let temp = (this.endTimeTemp + 0.05).toFixed(3);
      this.endTimeTemp = parseFloat(temp);
    },
    endTimeMinus() {
      let temp = (this.endTimeTemp - 0.05).toFixed(3);
      this.endTimeTemp = parseFloat(temp);
    },

    showConfirm(index) {
      if (this.confirmType == "fetch") {
        var userConfirmation = window.confirm(
          this.$t("repeater.noFavoriteFile", {
            favFileName: this.favFileName,
          })
        );
        if (userConfirmation) {
          this.favList = [];
          if (this.isAutoDetectLang) this.autoDetectLangInTrans();
          if (!this.hasSpeechSynthesis) {
            this.isSystemTTS = "No";
          }
          this.saveInit();
          setTimeout(() => {
            this.currentMedia.pause();
          }, 1);
        } else {
          this.cleanUp1();
          this.close();
        }
      }

      if (this.confirmType == "fetchRevision") {
        var userConfirmationRevision = window.confirm(
          this.$t("repeater.removeRevisionConfirm")
        );
        if (userConfirmationRevision) {
          this.reviseData.splice(index, 1);
        } else {
          return;
        }
      }

      if (this.confirmType == "wrongSrc") {
        var userConfirmationWrongSrc = window.confirm(
          this.$t("repeater.wrongSrc")
        );
        if (userConfirmationWrongSrc) {
          this.cacheCleanUp();
          setTimeout(() => {
            if (this.isFavOnPlay && this.isPlayFullFavList) {
              this.switchIsFav();
            }
            return;
          }, 500);
        } else {
          this.cacheCleanUp();
          setTimeout(() => {
            return;
          }, 500);
        }

        this.cacheCleanUp();
        setTimeout(() => {
          if (this.isFavOnPlay && this.isPlayFullFavList) {
            this.switchIsFav();
          }
          return;
        }, 500);
      }

      if (this.confirmType == "delete") {
        var userConfirmationDelete = window.confirm(
          this.$t("repeater.confirmDelete")
        );
        if (userConfirmationDelete) {
          this.deleteSentence();
        } else {
          return;
        }
      }
      if (this.confirmType == "deleteDicRec") {
        let dictationFile =
          "!PDJ/Repeater-backup/" +
          this.mediaName.slice(0, -4) +
          "-dictation.txt";

        let recordDir =
          "!PDJ/Repeater-backup/Rec-" + this.mediaName.slice(0, -4) + "/";
        var userConfirmationDelete1 = window.confirm(
          this.$t("repeater.confirmdeleteDicRec", {
            dictationFile: dictationFile,
            recordDir: recordDir,
          })
        );
        if (userConfirmationDelete1) {
          this.deleteDicRec();
        } else {
          return;
        }
      }
      if (this.confirmType == "uploadDictation") {
        var userConfirmationUp = window.confirm(
          this.$t("repeater.confirmUploadDictation2")
        );
        if (userConfirmationUp) {
          this.uploadDicRec();
        } else {
          return;
        }
      }
      if (this.confirmType == "downloadDictation") {
        var userConfirmationDown = window.confirm(
          this.$t("repeater.confirmDownloadDictation2")
        );
        if (userConfirmationDown) {
          this.downloadDicRec();
        } else {
          return;
        }
      }

      if (this.confirmType == "merge") {
        var userConfirmationMerge = window.confirm(
          this.$t("repeater.confirmMerge")
        );
        if (userConfirmationMerge) {
          this.mergeSentence();
        } else {
          return;
        }
      }
      if (this.confirmType == "add") {
        var userConfirmationAdd = window.confirm(
          this.$t("repeater.confirmAdd")
        );
        if (userConfirmationAdd) {
          this.addSentence();
        } else {
          return;
        }
      }

      if (this.confirmType == "split") {
        var userConfirmationsplit = window.confirm(
          this.$t("repeater.confirmSplit")
        );
        if (userConfirmationsplit) {
          this.splitSentence();
        } else {
          return;
        }
      }

      if (this.confirmType == "saveUnsavedSub") {
        var userConfirmationSave = window.confirm(
          this.$t("repeater.saveUnsavedSub")
        );
        if (userConfirmationSave) {
          this.saveUnsavedSrt();
        } else {
          window.localStorage.removeItem(this.srtNotUpload);
          window.localStorage.setItem(this.mediaName, this.reqF.content);
          return;
        }
      }

      if (this.confirmType == "saveUnsavedFav") {
        this.hasConfirmed = true;
        var userConfirmationSaveFav = window.confirm(
          this.$t("repeater.saveUnsavedFav")
        );
        if (userConfirmationSaveFav) {
          this.readyStatus();
        } else {
          window.localStorage.removeItem(this.favNotUpload);
          this.readyStatus();
        }
      }
    },

    async deleteDicRec() {
      window.sessionStorage.removeItem(this.mediaName + "dictation");
      this.dictationArray = [];
      this.dictationContent = "";
      this.canDownload = false;
      let path =
        "/files/!PDJ/Repeater-backup/" +
        this.mediaName.slice(0, -4) +
        "-dictation.txt";
      try {
        api.remove(path);
      } catch (e) {
        console.log(e);
      }
      this.deleteRecording();
    },

    deleteRecording() {
      this.audioRecordArray = [];
      this.audioBlob = null;
      this.audioUrl = null;
      localforage
        .removeItem(this.mediaName + "recordAudio")
        .then(() => {
          console.log("we just removed: " + "recordAudio");
        })
        .catch((error) => {
          console.error("Error removing data:", error);
        });

      this.deleteAudioRec();
    },

    async deleteAudioRec() {
      let path =
        "/files/" +
        "!PDJ/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/";
      try {
        let promises = [];
        promises.push(api.remove(path));
        await Promise.all(promises);
      } catch (e) {
        if (!e.message.includes("404")) {
          this.netStatus = false;
          alert(this.$t("repeater.failUpload"));
        }
      }
    },

    saveUnsavedSrt() {
      this.reqF.content = window.localStorage.getItem(this.mediaName);
      this.onRUdo = true;
      this.saveSubNow();
    },

    onSingle() {
      if (this.isSingle && !this.isDictation) {
        this.isDictation = true;
        this.isCheck = false;
      } else if (this.isSingle && this.isDictation) {
        this.isSingle = false;
        this.isDictation = false;
        this.isCheck = true;
      } else {
        this.isSingle = true;
        this.isDictation = false;
        this.isCheck = true;
      }
      if (!this.isSingle) {
        this.isEditSubandNotes = false;
        this.cleanUp2();
        this.cleanUp1();
        this.handleAutoStop();

        this.regularPlay();
        this.currentMedia.currentTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime;
        this.currentMedia.addEventListener("focus", this.removeFocus);
        if (!this.isSingle && this.dubbingMode && this.isUtterTransLine) {
          if (this.utterThis) window.speechSynthesis.cancel();
          this.utterTransLine();
          return;
        }
      }
      if (this.isSingle) {
        this.cleanUp2();
        this.isEmpty = false;
        if (this.isFirstClick) this.firstClick();
        this.handleAutoStop();
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
      let vmm = this;
      localforage
        .clear()
        .then(function () {
          window.localStorage.removeItem("cKeys");
          console.log("Database is now empty.");
          vmm.numOfKeys = 0;
          vmm.playFromCache = false;
          vmm.cachedKeys = "";
        })
        .catch(function (err) {
          console.log(err);
        });
    },

    onSetting() {
      this.cachedNumber();
      this.getReader();
      this.isSetting = !this.isSetting;
      if (this.isSetting) {
        this.cleanUp2();
        this.cleanUp1();
      } else {
        if (!this.isSingle) return;
        setTimeout(() => {
          this.cleanUp2();
          if (this.isFirstClick) this.firstClick();
          this.handleAutoStop();
          this.singleModePlay();
        }, 1);
      }
      return;
    },
    click: function () {
      if (this.isFirstClick) this.firstClick();
      this.touches++;
      this.fromClick = true;
      if (this.isEditSubandNotes) this.cleanUp2();
      this.cleanUp1();
      if (this.isEditSubandNotes || this.isDictation) {
        this.toBlur();
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
          }, 10);
        } else {
          setTimeout(() => {
            this.regularPlay();
            if (this.fromRetrace) {
              this.currentMedia.currentTime = Math.max(
                this.currentMedia.currentTime - this.retraceTime,
                this.srtSubtitles[this.sentenceIndex - 1].startTime
              );
              this.fromRetrace = false;
            } else
              this.currentMedia.currentTime =
                this.srtSubtitles[this.sentenceIndex - 1].startTime;
          }, 1);
        }
      }
      setTimeout(() => {
        if (this.touches == 2) {
          //double click
          this.cleanUp1();
          this.touches = 0;
          if (this.timeOutId2) clearTimeout(this.timeOutId2);
          return;
        }
        this.touches = 0;
      }, 300);
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
      this.handleAutoStop();
      this.isSetting = false;
      if (this.showTools) this.switchSubtitle();
      this.showRevision = false;
      this.showSubtitleList = false;
      this.searchList = "";
      if (this.showNewWordList) {
        if (this.newWordList.length > 0)
          this.newWordList[this.indexOfNewWordList].showTrans = false;
        this.showNewWordList = false;
      }
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
        (document.getElementById("editArea1") &&
          document.getElementById("editArea1").contains(event.target)) ||
        (document.getElementById("editArea2") &&
          document.getElementById("editArea2").contains(event.target))
      ) {
        this.endDragM(event);
        return;
      }

      if (
        document.getElementById("editArea3") &&
        document.getElementById("editArea3").contains(event.target)
      ) {
        this.endDragG(event);
        return;
      }

      if (this.isEditSubandNotes && document.getElementsByName("buttons")) {
        var a = document.getElementsByName("buttons");
        for (var i = 0; i < a.length; i++) {
          if (a[i].contains(event.target)) {
            return;
          }
        }
      }

      if (
        window.getSelection().toString() &&
        window.getSelection().toString().trim() !== "" &&
        document.getElementById("subArea") &&
        document.getElementById("subArea").contains(event.target) &&
        !this.isFavOnPlay
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        window.getSelection().removeAllRanges();
        this.fixbug1();
        this.showAddNew = false;
        this.showEditNew = false;
        if (Math.abs(this.distanceX) < 5 && Math.abs(this.distanceY) < 5)
          this.click();
      }
    },

    endDragM(event) {
      if (!this.isReadyToPlay || this.isTouchDevice) return;
      if (
        window.getSelection().toString() &&
        window.getSelection().toString().trim() !== "" &&
        document.getElementsByName("editAreaM") &&
        (document.getElementsByName("editAreaM")[0].contains(event.target) ||
          document.getElementsByName("editAreaM")[1].contains(event.target)) &&
        !this.isFavOnPlay
      ) {
        this.fixbug1();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        this.fixbug1();
        this.showAddNew = false;
        this.showEditNew = false;
      }
    },

    endDragG() {
      if (!this.isReadyToPlay || this.isTouchDevice) return;
      this.fixbug1();
      this.showAddNew = false;
      this.showEditNew = false;
    },

    startTouch(event) {
      event.preventDefault();
      this.startTouchS(event);
    },
    startTouchS(event) {
      if (!this.isReadyToPlay) return;
      this.handleAutoStop();
      this.isSetting = false;
      if (this.showTools) this.switchSubtitle();
      this.showRevision = false;
      this.showSubtitleList = false;
      this.searchList = "";
      if (this.showNewWordList) {
        if (this.newWordList.length > 0)
          this.newWordList[this.indexOfNewWordList].showTrans = false;
        this.showNewWordList = false;
      }
      this.withTrans = false;
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },
    touchMoveS(event) {
      if (
        !(
          window.getSelection().toString() &&
          window.getSelection().toString() !== "" &&
          document.getElementById("subArea") &&
          document.getElementById("subArea").contains(event.target)
        )
      )
        event.preventDefault();
    },

    touchMoveM(event) {
      if (
        !(
          window.getSelection().toString() &&
          window.getSelection().toString() !== "" &&
          document.getElementById("editArea1") &&
          document.getElementById("editArea1").contains(event.target)
        )
      )
        event.preventDefault();
    },

    touchMoveG(event) {
      if (
        !(
          window.getSelection().toString() &&
          window.getSelection().toString() !== "" &&
          document.getElementById("editArea2") &&
          document.getElementById("editArea2").contains(event.target)
        )
      )
        event.preventDefault();
    },

    touchMoveF(event) {
      if (
        !(
          window.getSelection().toString() &&
          window.getSelection().toString() !== "" &&
          document.getElementById("editArea3") &&
          document.getElementById("editArea3").contains(event.target)
        )
      )
        event.preventDefault();
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
        (document.getElementById("editArea1") &&
          document.getElementById("editArea1").contains(event.target)) ||
        (document.getElementById("editArea2") &&
          document.getElementById("editArea2").contains(event.target))
      ) {
        this.endTouchM(event);
        return;
      }

      if (
        document.getElementById("editArea3") &&
        document.getElementById("editArea3").contains(event.target)
      ) {
        this.endTouchG(event);
        return;
      }

      if (this.isEditSubandNotes && document.getElementsByName("buttons")) {
        var a = document.getElementsByName("buttons");
        for (var i = 0; i < a.length; i++) {
          if (a[i].contains(event.target)) {
            return;
          }
        }
      }

      if (
        window.getSelection().toString() &&
        window.getSelection().toString().trim() !== "" &&
        document.getElementById("subArea") &&
        document.getElementById("subArea").contains(event.target) &&
        !this.isFavOnPlay
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        window.getSelection().removeAllRanges();
        this.fixbug1();
        this.showAddNew = false;
        this.showEditNew = false;
        if (Math.abs(this.distanceX) < 5 && Math.abs(this.distanceY) < 5)
          this.click();
      }
    },

    endTouchM(event) {
      if (
        window.getSelection().toString() &&
        window.getSelection().toString().trim() !== "" &&
        document.getElementsByName("editAreaM") &&
        (document.getElementsByName("editAreaM")[0].contains(event.target) ||
          document.getElementsByName("editAreaM")[1].contains(event.target)) &&
        !this.isFavOnPlay
      ) {
        this.fixbug1();
        this.newWord = window.getSelection().toString();
        this.showAddNew = true;
      } else {
        this.fixbug1();
        this.showAddNew = false;
        this.showEditNew = false;
      }
    },

    fixbug1() {
      if (
        this.isEditSubandNotes &&
        document.getElementById("editArea1") &&
        document.getElementById("editArea2")
      ) {
        this.subFirstLine = document.getElementById("editArea1").value;
        this.subSecLine = document.getElementById("editArea2").value;
      }
    },

    endTouchG() {
      this.fixbug1();
      this.showAddNew = false;
      this.showEditNew = false;
    },

    handleAutoStop() {
      if (this.timeOutId2) clearTimeout(this.timeOutId2);
      if (
        (this.autoPlay &&
          this.autoPlayNext &&
          this.isSingle &&
          this.nextLoopPlay &&
          this.autoStop) ||
        (!this.isSingle && this.nextLoopPlay && this.autoStop)
      ) {
        this.timeOutId2 = setTimeout(
          () => {
            this.cleanUp1();
            this.cleanUp2();
          },
          this.autoStopMins * 60 * 1000
        );
      }
    },

    toBlur() {
      if (
        document.getElementById("editArea0") &&
        document.getElementById("editArea0").contains(document.activeElement)
      ) {
        document.getElementById("editArea0").blur();
      } else if (
        document.getElementById("editArea00") &&
        document.getElementById("editArea00").contains(document.activeElement)
      ) {
        document.getElementById("editArea00").blur();
      } else if (
        document.getElementById("editArea1") &&
        document.getElementById("editArea1").contains(document.activeElement)
      ) {
        document.getElementById("editArea1").blur();
      } else if (
        document.getElementById("editArea2") &&
        document.getElementById("editArea2").contains(document.activeElement)
      ) {
        document.getElementById("editArea2").blur();
      } else if (
        document.getElementById("editArea3") &&
        document.getElementById("editArea3").contains(document.activeElement)
      ) {
        document.getElementById("editArea3").blur();
      }
    },

    getRandomInt() {
      let p = this.pr[1] - 1 - this.pr[0] + 1;
      let tempReq = Array.from({ length: p }, (_, i) => i + this.pr[0]);
      if (
        JSON.stringify(this.orderedReq) !== JSON.stringify(tempReq) ||
        this.randomReq.length == 0
      ) {
        this.orderedReq = tempReq;
        let aReq = this.shuffle(tempReq);
        this.randomReq = aReq.filter(
          (element) => element !== this.sentenceIndex
        );
        this.randomReq.push(this.pr[1]);
      }
      let a = this.randomReq[0];
      this.randomReq.splice(0, 1);
      return a;
    },

    shuffle(arr) {
      let res = [...arr]; // 创建一个数组副本，以避免修改原数组。
      for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
      }
      return res;
    },

    checkNav(x, mode) {
      if (x > 0 && mode == "SWITCHIMG" && this.sentenceIndex >= 1) {
        if (this.isEditSubandNotes || this.isDictation) {
          this.toBlur();
        }
        this.cleanUp2();
        this.cleanUp1();
        if (this.sentenceIndex == 1) return;
        setTimeout(() => {
          this.isSwitching = true;
          if (this.random) this.sentenceIndex = this.getRandomInt();
          else this.sentenceIndex = this.sentenceIndex - 1;
          setTimeout(() => {
            this.isSwitching = false;
          }, 200);
          if (
            (this.isSingle && !this.autoPlay) ||
            (this.isFavOnPlay && this.isPlayFullFavList)
          )
            return;
          if (this.isSingle) {
            if (this.isFirstClick) return;
            this.click();
          } else {
            setTimeout(() => {
              this.regularPlay();
              this.currentMedia.currentTime =
                this.srtSubtitles[this.sentenceIndex - 1].startTime;
            }, 1);
          }
        }, 10);
        return;
      } else if (
        x < 0 &&
        mode == "SWITCHIMG" &&
        this.sentenceIndex <= this.srtSubtitles.length
      ) {
        if (this.isEditSubandNotes || this.isDictation) {
          this.toBlur();
        }
        this.cleanUp2();
        this.cleanUp1();
        if (this.sentenceIndex == this.srtSubtitles.length) return;
        setTimeout(() => {
          this.isSwitching = true;
          if (this.random) this.sentenceIndex = this.getRandomInt();
          else this.sentenceIndex = this.sentenceIndex + 1;
          setTimeout(() => {
            this.isSwitching = false;
          }, 200);
          if (
            (this.isSingle && !this.autoPlay) ||
            (this.isFavOnPlay && this.isPlayFullFavList)
          )
            return;
          if (this.isSingle) {
            if (this.isFirstClick) return;
            this.click();
          } else {
            setTimeout(() => {
              this.regularPlay();
              this.currentMedia.currentTime =
                this.srtSubtitles[this.sentenceIndex - 1].startTime;
            }, 1);
          }
        }, 10);
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
        this.cleanUp1();
        this.touches = 0;
        if (this.timeOutId2) clearTimeout(this.timeOutId2);
        return;
      }
    },

    regularPlay() {
      this.isSingle = false;
      if (!this.isReadyToPlay) return;
      const media = this.currentMedia;
      if (media) {
        var cSpeed = this.currentSpeed.replaceAll(",", " ");
        cSpeed = cSpeed.replaceAll("   ", " ");
        cSpeed = cSpeed.replaceAll("  ", " ");

        if (cSpeed.split(" ")[0]) {
          if (this.onTempSpeed) {
            this.normalSpeed = Number(cSpeed.split(" ")[0]);
            this.currentMedia.playbackRate = this.tempSpeed;
          } else {
            this.currentMedia.playbackRate = Number(cSpeed.split(" ")[0]);
          }
        } else {
          if (this.onTempSpeed) {
            this.normalSpeed = 1;
            this.currentMedia.playbackRate = this.tempSpeed;
          } else {
            this.currentMedia.playbackRate = 1;
          }
        }

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
      const endFinal = Math.min(this.loopEnd, this.srtSubtitles.length);
      if (
        this.nextLoopPlay &&
        (media.currentTime >=
          Math.min(
            this.srtSubtitles[endFinal - 1].endTime,
            media.duration - 0.05
          ) ||
          media.currentTime < this.srtSubtitles[this.loopStart - 1].startTime)
      )
        media.currentTime = this.srtSubtitles[this.loopStart - 1].startTime;
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
        if (this.isIphone) {
          setTimeout(() => {
            this.currentMedia.play();
          }, 20);
        } else this.currentMedia.play();
        var cSpeed = this.currentSpeed.replaceAll(",", " ");
        cSpeed = cSpeed.replaceAll("   ", " ");
        cSpeed = cSpeed.replaceAll("  ", " ");
        if (cSpeed.split(" ")[this.playCount]) {
          if (this.onTempSpeed) {
            this.normalSpeed = Number(cSpeed.split(" ")[this.playCount]);
            this.currentMedia.playbackRate = this.tempSpeed;
          } else {
            this.currentMedia.playbackRate = Number(
              cSpeed.split(" ")[this.playCount]
            );
          }
        } else {
          if (this.onTempSpeed) {
            this.normalSpeed = 1;
            this.currentMedia.playbackRate = this.tempSpeed;
          } else {
            this.currentMedia.playbackRate = 1;
          }
        }
        this.sessionLength =
          (this.srtSubtitles[this.sentenceIndex - 1].endTime -
            this.srtSubtitles[this.sentenceIndex - 1].startTime +
            2) /
          this.currentMedia.playbackRate;
        let playLength =
          (this.srtSubtitles[this.sentenceIndex - 1].endTime -
            this.srtSubtitles[this.sentenceIndex - 1].startTime) /
            this.currentMedia.playbackRate -
          0.2;

        if (this.fromRetrace) {
          this.currentMedia.currentTime = Math.max(
            this.currentMedia.currentTime - this.retraceTime,
            this.srtSubtitles[this.sentenceIndex - 1].startTime
          );
          playLength =
            (this.srtSubtitles[this.sentenceIndex - 1].endTime -
              this.currentMedia.currentTime) /
              this.currentMedia.playbackRate -
            0.3;
          this.fromRetrace = false;
        } else
          this.currentMedia.currentTime =
            this.srtSubtitles[this.sentenceIndex - 1].startTime;

        this.startTime = new Date().getTime();
        this.timeOutId = setTimeout(() => {
          this.isEnd();
        }, playLength * 1000);
      }
    },
    isEnd() {
      this.intervalId = setInterval(() => {
        this.sessionEnd();
      }, 10);
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
                !this.isDictation &&
                !this.showNewWordList &&
                (this.sentenceIndex < this.srtSubtitles.length ||
                  (this.nextLoopPlay &&
                    this.sentenceIndex == this.srtSubtitles.length))
              ) {
                if (this.random) this.sentenceIndex = this.getRandomInt();
                else if (
                  this.nextLoopPlay &&
                  this.sentenceIndex >=
                    Math.min(this.loopEnd, this.srtSubtitles.length)
                )
                  this.sentenceIndex = Number(this.loopStart);
                else this.sentenceIndex = this.sentenceIndex + 1;
                if (
                  !this.autoPlay ||
                  (this.isFavOnPlay && this.isPlayFullFavList)
                ) {
                  this.cleanUp1();
                  return;
                }
                this.singleModePlay();
              } else {
                this.cleanUp1();
                this.cleanUp2();
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
            !this.isDictation &&
            !this.showNewWordList &&
            (this.sentenceIndex < this.srtSubtitles.length ||
              (this.nextLoopPlay &&
                this.sentenceIndex == this.srtSubtitles.length))
          ) {
            if (this.random) this.sentenceIndex = this.getRandomInt();
            else if (
              this.nextLoopPlay &&
              this.sentenceIndex >=
                Math.min(this.loopEnd, this.srtSubtitles.length)
            )
              this.sentenceIndex = Number(this.loopStart);
            else this.sentenceIndex = this.sentenceIndex + 1;
            if (
              !this.autoPlay ||
              (this.isFavOnPlay && this.isPlayFullFavList)
            ) {
              this.cleanUp1();
              return;
            }
            this.singleModePlay();
          } else {
            this.cleanUp1();
            this.cleanUp2();
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
        this.lineNumOfTrans = 1;
      } else if (
        !this.isEnglishLine2 &&
        !(
          !this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ||
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1] ==
            " "
        )
      ) {
        this.lineNumOfTrans = 2;
      }
    },

    saveInit() {
      if (!this.isReadyToPlay && !(this.isFavOnPlay && this.isPlayFullFavList))
        return;
      let customConfig = this.getConfig();

      let favContent =
        "public" +
        customConfig +
        "\n\n\n\n" +
        JSON.stringify(this.reviseData) +
        "\n\n\n\n" +
        "Subtitle:" +
        JSON.stringify(this.favList);
      this.hasPrivate = false;
      this.tempFavContent = favContent;
      this.hasConfirmed = true;
      this.saveNow(this.tempFavContent);
    },

    getConfig() {
      return (
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
        "::" +
        JSON.stringify(this.revisePlan) +
        "::" +
        JSON.stringify(this.nextLoopPlay) +
        "::" +
        JSON.stringify(this.loopStart) +
        "::" +
        JSON.stringify(this.loopEnd) +
        "::" +
        JSON.stringify(this.autoStop) +
        "::" +
        JSON.stringify(this.autoStopMins) +
        "::" +
        JSON.stringify(this.transUrl) +
        "::" +
        JSON.stringify(this.random) +
        "::" +
        JSON.stringify(this.defaultWaveSurfer) +
        "::" +
        JSON.stringify(this.dubbingMode) +
        "::" +
        JSON.stringify(this.autoCloseCheck) +
        "::" +
        JSON.stringify(this.ignoreC) +
        "::" +
        JSON.stringify(this.showTempSpeed) +
        "::" +
        JSON.stringify(this.tempSpeed) +
        "::" +
        JSON.stringify(this.showRetracePlay) +
        "::" +
        JSON.stringify(this.retraceTime) +
        "::"
      );
    },

    save() {
      if (
        (!this.isReadyToPlay &&
          !(this.isFavOnPlay && this.isPlayFullFavList)) ||
        this.notSaveFav
      )
        return;

      this.notSaveFav = true;
      setTimeout(() => {
        this.notSaveFav = false;
      }, 400);

      let customConfig = this.getConfig();

      let favContent = window.localStorage.getItem(this.favFileName);
      var allConfig = favContent.split("\n\n\n\n")[0];
      let oldConfig = "";
      if (this.isPrivate == "Yes" && this.hasPrivate) {
        oldConfig = allConfig
          .split(this.reqF.name + "privatecustomConfig::")[1]
          .split("\n\n")[0];
        allConfig = allConfig.replace(
          this.reqF.name + "privatecustomConfig::" + oldConfig,
          this.reqF.name + "private" + customConfig
        );
      } else {
        oldConfig = allConfig.split("\n\n")[0];
        allConfig = allConfig.replace(oldConfig, "public" + customConfig);
      }

      favContent =
        allConfig +
        "\n\n\n\n" +
        JSON.stringify(this.reviseData) +
        "\n\n\n\n" +
        "Subtitle:" +
        JSON.stringify(this.favList);
      this.tempFavContent = favContent;
      this.saveNow(this.tempFavContent);
    },

    async saveNow(favContent) {
      if (
        window.localStorage.getItem("server" + this.favFileName) &&
        window.localStorage.getItem("server" + this.favFileName) == favContent
      )
        return;
      window.localStorage.setItem(this.favFileName, favContent);
      if (this.onOffline) {
        window.localStorage.setItem(this.favNotUpload, "1");
        return;
      }
      window.localStorage.setItem(this.favNotUpload, "1");
      try {
        await api.post("/files/!PDJ/" + this.favFileName, favContent, true);
        window.localStorage.setItem("server" + this.favFileName, favContent);
        window.localStorage.removeItem(this.favNotUpload);
      } catch (error) {
        return;
      }
    },

    async savePeaks(peaks) {
      let p = JSON.stringify(peaks);
      try {
        await api.post(
          "/files/!PDJ/Repeater-backup/peaks/" + this.mediaName + ".txt",
          p,
          true
        );
      } catch (error) {
        return;
      }
    },

    saveSub() {
      if (this.onRUdo) {
        return;
      }
      if (!this.onEdit) return;
      this.onEdit = false;
      this.tempOldContent = this.reqF.content;
      var tempContent = this.reqF.content;
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
        this.srtSubtitles[this.sentenceIndex - 1].sn +
        "\n" +
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp +
        tempContent
          .split(
            this.srtSubtitles[this.sentenceIndex - 1].sn +
              "\n" +
              this.srtSubtitles[this.sentenceIndex - 1].timeStamp
          )[1]
          .split("\n\n")[0];
      newContent =
        this.srtSubtitles[this.sentenceIndex - 1].sn + "\n" + newContent;
      this.reqF.content = tempContent.replace(oldContent, newContent);
      this.saveSubNow();
    },

    saveSub1() {
      if (this.onRUdo) {
        return;
      }
      if (!this.onEdit) return;
      this.onEdit = false;
      this.tempOldContent = this.reqF.content;
      if (
        this.sentenceIndex > 1 &&
        this.startTimeTemp <= this.srtSubtitles[this.sentenceIndex - 2].endTime
      )
        this.srtSubtitles[this.sentenceIndex - 2].endTime =
          this.startTimeTemp - 0.001;

      if (
        this.sentenceIndex > 1 &&
        this.srtSubtitles[this.sentenceIndex - 2].endTime <=
          this.srtSubtitles[this.sentenceIndex - 2].startTime
      ) {
        this.srtSubtitles[this.sentenceIndex - 2].endTime =
          this.srtSubtitles[this.sentenceIndex - 2].startTime + 0.001;
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 2].endTime + 0.001;
      }
      if (this.sentenceIndex == 1 && this.startTimeTemp < 0)
        this.startTimeTemp = 0;
      if (
        this.startTimeTemp >= this.srtSubtitles[this.sentenceIndex - 1].endTime
      )
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].endTime - 0.001;

      this.startTimeTemp = parseFloat(this.startTimeTemp.toFixed(3));
      var tempContent = this.reqF.content;
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

      oldContent =
        this.srtSubtitles[this.sentenceIndex - 1].sn + "\n" + oldContent;
      newContent =
        this.srtSubtitles[this.sentenceIndex - 1].sn + "\n" + newContent;
      tempContent = tempContent.replace(oldContent, newContent);

      if (this.sentenceIndex > 1) {
        this.srtSubtitles[this.sentenceIndex - 2].endTime = parseFloat(
          this.srtSubtitles[this.sentenceIndex - 2].endTime.toFixed(3)
        );
        var oldContent1 =
          " --> " +
          this.srtSubtitles[this.sentenceIndex - 2].timeStamp.split(" --> ")[1];
        var time1 = this.convertToHMS(
          this.srtSubtitles[this.sentenceIndex - 2].endTime * 1000 -
            this.timeStampChangeEnd +
            1
        );
        var newContent1 =
          " --> " +
          time1.hours +
          ":" +
          time1.minutes +
          ":" +
          time1.seconds +
          "," +
          time1.milliseconds;

        oldContent1 =
          this.srtSubtitles[this.sentenceIndex - 2].sn +
          "\n" +
          this.srtSubtitles[this.sentenceIndex - 2].timeStamp.split(
            " --> "
          )[0] +
          oldContent1;
        newContent1 =
          this.srtSubtitles[this.sentenceIndex - 2].sn +
          "\n" +
          this.srtSubtitles[this.sentenceIndex - 2].timeStamp.split(
            " --> "
          )[0] +
          newContent1;
        tempContent = tempContent.replace(oldContent1, newContent1);
      }
      this.reqF.content = tempContent;
      this.saveSubNow();
    },

    saveSub2() {
      if (this.onRUdo) {
        return;
      }
      if (!this.onEdit) return;
      this.onEdit = false;
      this.tempOldContent = this.reqF.content;

      if (
        this.sentenceIndex <= this.srtSubtitles.length - 1 &&
        this.endTimeTemp >= this.srtSubtitles[this.sentenceIndex].startTime
      )
        this.srtSubtitles[this.sentenceIndex].startTime =
          this.endTimeTemp + 0.001;

      if (
        this.sentenceIndex <= this.srtSubtitles.length - 1 &&
        this.srtSubtitles[this.sentenceIndex].startTime >=
          this.srtSubtitles[this.sentenceIndex].endTime
      ) {
        this.srtSubtitles[this.sentenceIndex].startTime =
          this.srtSubtitles[this.sentenceIndex].endTime - 0.001;
        this.endTimeTemp =
          this.srtSubtitles[this.sentenceIndex].startTime - 0.001;
      }

      if (
        this.endTimeTemp <= this.srtSubtitles[this.sentenceIndex - 1].startTime
      )
        this.endTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].startTime + 0.001;

      this.endTimeTemp = parseFloat(this.endTimeTemp.toFixed(3));

      var tempContent = this.reqF.content;
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

      oldContent =
        this.srtSubtitles[this.sentenceIndex - 1].sn +
        "\n" +
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[0] +
        oldContent;
      newContent =
        this.srtSubtitles[this.sentenceIndex - 1].sn +
        "\n" +
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[0] +
        newContent;
      tempContent = tempContent.replace(oldContent, newContent);

      if (this.sentenceIndex <= this.srtSubtitles.length - 1) {
        this.srtSubtitles[this.sentenceIndex].startTime = parseFloat(
          this.srtSubtitles[this.sentenceIndex].startTime.toFixed(3)
        );
        var oldContent1 =
          this.srtSubtitles[this.sentenceIndex].timeStamp.split(" --> ")[0] +
          " --> ";
        var time1 = this.convertToHMS(
          this.srtSubtitles[this.sentenceIndex].startTime * 1000 -
            this.timeStampChangeStart
        );
        var newContent1 =
          time1.hours +
          ":" +
          time1.minutes +
          ":" +
          time1.seconds +
          "," +
          time1.milliseconds +
          " --> ";
        oldContent1 =
          this.srtSubtitles[this.sentenceIndex].sn + "\n" + oldContent1;
        newContent1 =
          this.srtSubtitles[this.sentenceIndex].sn + "\n" + newContent1;
        tempContent = tempContent.replace(oldContent1, newContent1);
      }
      this.reqF.content = tempContent;
      this.saveSubNow();
    },

    editHotkeys(timeStamp, event) {
      if (this.ctrlPressed && event.button == 0) {
        event.preventDefault();
        this.cleanUp1();
        this.cleanUp2();
        this.splitSentence(timeStamp);
      } else if (this.shiftPressed && event.button == 0) {
        event.preventDefault();
        this.cleanUp1();
        this.cleanUp2();
        this.mergeSentence();
      }
    },

    async saveSpecialSub(x) {
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      var textSubtitles = formatContent.split("\n\n");

      for (var i = 0; i < textSubtitles.length; i++) {
        var newContent = " ";
        if (x == 2) {
          newContent =
            textSubtitles[i].split("\n")[0] +
            "\n" +
            textSubtitles[i].split("\n")[1] +
            "\n" +
            textSubtitles[i].split("\n")[2];
        }
        if (textSubtitles[i].split("\n").length >= 5) {
          if (x == 3) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          } else if (x == 4) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          } else if (x == 5) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[3] +
              "\n" +
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[4];
          } else if (x >= 6) {
            newContent =
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[3] +
              "\n" +
              textSubtitles[i].split("\n")[4];
          }
        } else if (textSubtitles[i].split("\n").length == 4) {
          if (x == 3) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          } else if (x == 4) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          } else if (x == 5) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[3] +
              "\n" +
              textSubtitles[i].split("\n")[2];
          } else if (x >= 6) {
            newContent =
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          }
        } else if (textSubtitles[i].split("\n").length == 3) {
          if (x == 3) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              " ";
          } else if (x == 4) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              textSubtitles[i].split("\n")[2] +
              "\n" +
              " ";
          } else if (x == 5) {
            newContent =
              textSubtitles[i].split("\n")[0] +
              "\n" +
              textSubtitles[i].split("\n")[1] +
              "\n" +
              " " +
              "\n" +
              textSubtitles[i].split("\n")[2];
          } else if (x >= 6) {
            newContent = textSubtitles[i].split("\n")[2];
          }
        }

        if (x !== 1)
          formatContent = formatContent.replace(textSubtitles[i], newContent);
      }

      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      if (x == 7) formatContent = this.formatAll(formatContent);

      var currentTime = new Date();
      let id = Math.floor(currentTime.getTime() / 1000);
      let today = currentTime.toLocaleDateString("af").replaceAll("/", "-");
      var pdjBackUp = " ";
      if (x == 1) pdjBackUp = "BackUp-" + today + "-" + id + ".srt";
      else if (x == 2) pdjBackUp = "FirstLine-" + today + "-" + id + ".srt";
      else if (x == 3) pdjBackUp = "SecLine-" + today + "-" + id + ".srt";
      else if (x == 4)
        pdjBackUp = "First-Two-Lines-" + today + "-" + id + ".srt";
      else if (x == 5) pdjBackUp = "Switch-" + today + "-" + id + ".srt";
      else if (x == 6) pdjBackUp = "text-" + today + "-" + id + ".txt";
      try {
        await api.post(
          "/files/!PDJ/Repeater-backup/" + this.reqF.name + "-" + pdjBackUp,
          formatContent,
          true
        );
        alert("File saved successfully.");
      } catch (error) {
        alert("Sorry. Can't save the file to the Server.");
        return;
      }
    },

    confirmDelete() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "delete";
      this.showConfirm();
    },
    confirmDelDicRec() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "deleteDicRec";
      this.showConfirm();
    },

    confirmUploadDictation() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "uploadDictation";
      this.showConfirm();
    },

    confirmDownloadDictation() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "downloadDictation";
      this.showConfirm();
    },

    confirmMerge() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "merge";
      this.showConfirm();
    },

    confirmAdd() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "add";
      this.showConfirm();
    },

    confirmSplit() {
      this.cleanUp1();
      this.cleanUp2();
      this.confirmType = "split";
      this.showConfirm();
    },

    deleteSentence() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      if (this.isFav) {
        this.switchIsFav();
      }
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;

      var textSubtitles = formatContent.split("\n\n");
      formatContent = formatContent.replace(
        textSubtitles[this.sentenceIndex - 1],
        ""
      );
      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      this.changeNew[this.historyIndex] = formatContent;

      this.historyIndex = this.historyIndex + 1;
      formatContent = this.formatAll(formatContent);
      this.reqF.content = formatContent;
      window.localStorage.setItem(this.mediaName, formatContent);
      this.cleanUp1();
      this.cleanUp2();
      this.refresh();
      this.saveSubFinal();
    },

    mergeSentence() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      this.fromMerge = true;
      var hasFav = false;
      if (this.isFav) {
        this.switchIsFav();
        hasFav = true;
      }
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");
      var line1 = textSubtitles[this.sentenceIndex].split("\n")[0];
      var line2 =
        textSubtitles[this.sentenceIndex - 1].split("\n")[1].split(" --> ")[0] +
        " --> " +
        textSubtitles[this.sentenceIndex].split("\n")[1].split(" --> ")[1];
      var line3 = " ";
      var line4 = " ";
      var line5 = " ";
      if (
        textSubtitles[this.sentenceIndex - 1].split("\n").length > 2 ||
        textSubtitles[this.sentenceIndex].split("\n").length > 2
      )
        line3 =
          textSubtitles[this.sentenceIndex - 1].split("\n")[2] +
          " " +
          textSubtitles[this.sentenceIndex].split("\n")[2];
      if (
        textSubtitles[this.sentenceIndex - 1].split("\n").length > 3 ||
        textSubtitles[this.sentenceIndex].split("\n").length > 3
      )
        line4 =
          textSubtitles[this.sentenceIndex - 1].split("\n")[3] +
          " " +
          textSubtitles[this.sentenceIndex].split("\n")[3];
      if (
        textSubtitles[this.sentenceIndex - 1].split("\n").length > 4 ||
        textSubtitles[this.sentenceIndex].split("\n").length > 4
      )
        line5 =
          textSubtitles[this.sentenceIndex - 1].split("\n")[4] +
          " " +
          textSubtitles[this.sentenceIndex].split("\n")[4];
      let newOne =
        line1 +
        "\n" +
        line2 +
        "\n" +
        line3.replace("undefined", "") +
        "\n" +
        line4.replace("undefined", "") +
        "\n" +
        line5.replace("undefined", "");

      formatContent = formatContent.replace(
        textSubtitles[this.sentenceIndex - 1],
        ""
      );

      formatContent = formatContent.replace(
        textSubtitles[this.sentenceIndex],
        newOne
      );

      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      this.changeNew[this.historyIndex] = formatContent;

      this.historyIndex = this.historyIndex + 1;
      formatContent = this.formatAll(formatContent);

      this.reqF.content = formatContent;
      this.cleanUp1();
      this.cleanUp2();
      let tempI = this.sentenceIndex;

      this.sentenceIndex = 1;
      setTimeout(() => {
        this.sentenceIndex = tempI;
        if (hasFav) this.switchIsFav();
      }, 10);

      window.localStorage.setItem(this.mediaName, formatContent);
      this.saveSubFinal();
    },

    addSentence() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;

      var textSubtitles = formatContent.split("\n\n");
      var line1 = "0" + textSubtitles[this.sentenceIndex - 1].split("\n")[0];
      var line2 = " ";

      var newStartTime = textSubtitles[this.sentenceIndex - 1]
        .split("\n")[1]
        .split(" --> ")[1];

      var newEndTime;
      if (
        this.sentenceIndex < this.srtSubtitles.length &&
        this.srtSubtitles[this.sentenceIndex].startTime -
          this.srtSubtitles[this.sentenceIndex - 1].endTime <=
          3
      ) {
        newEndTime = textSubtitles[this.sentenceIndex]
          .split("\n")[1]
          .split(" --> ")[0];
      } else {
        var time = this.convertToHMS(
          this.srtSubtitles[this.sentenceIndex - 1].endTime * 1000 -
            this.timeStampChangeEnd +
            1 +
            3000
        );

        newEndTime =
          time.hours +
          ":" +
          time.minutes +
          ":" +
          time.seconds +
          "," +
          time.milliseconds;
      }

      line2 = newStartTime + " --> " + newEndTime;

      var line3 = "First Line";
      var line4 = " ";
      let newLine = line1 + "\n" + line2 + "\n" + line3 + "\n" + line4;
      let newContent = textSubtitles[this.sentenceIndex - 1] + "\n\n" + newLine;
      formatContent = formatContent.replace(
        textSubtitles[this.sentenceIndex - 1],
        newContent
      );

      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      this.changeNew[this.historyIndex] = formatContent;
      this.historyIndex = this.historyIndex + 1;
      formatContent = this.formatAll(formatContent);
      this.reqF.content = formatContent;
      this.cleanUp1();
      this.cleanUp2();
      setTimeout(() => {
        this.sentenceIndex = this.sentenceIndex + 1;
      }, 10);
      window.localStorage.setItem(this.mediaName, formatContent);
      this.saveSubFinal();
    },

    splitSentence(timeStamp) {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");

      var timeInterval =
        this.srtSubtitles[this.sentenceIndex - 1].endTime -
        (this.timeStampChangeEnd - 1) / 1000 -
        (this.srtSubtitles[this.sentenceIndex - 1].startTime -
          this.timeStampChangeStart / 1000);
      var midTime;
      if (
        timeStamp &&
        timeStamp >= this.srtSubtitles[this.sentenceIndex - 1].startTime &&
        timeStamp <= this.srtSubtitles[this.sentenceIndex - 1].endTime
      )
        midTime = Number(timeStamp) + 0.015;
      else
        midTime =
          this.srtSubtitles[this.sentenceIndex - 1].startTime -
          this.timeStampChangeStart / 1000 +
          timeInterval / 2;
      var time1 = this.convertToHMS(midTime * 1000 - 1);
      var midTimeFormat1 =
        time1.hours +
        ":" +
        time1.minutes +
        ":" +
        time1.seconds +
        "," +
        time1.milliseconds;
      var time2 = this.convertToHMS(midTime * 1000);
      var midTimeFormat2 =
        time2.hours +
        ":" +
        time2.minutes +
        ":" +
        time2.seconds +
        "," +
        time2.milliseconds;
      var newContent1 = textSubtitles[this.sentenceIndex - 1].replace(
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[1],
        midTimeFormat1
      );

      var line1 = "0" + textSubtitles[this.sentenceIndex - 1].split("\n")[0];
      var line2 =
        midTimeFormat2 +
        " --> " +
        textSubtitles[this.sentenceIndex - 1].split("\n")[1].split(" --> ")[1];

      var line3 = "First Line";
      var line4 = " ";
      let newLine = line1 + "\n" + line2 + "\n" + line3 + "\n" + line4;
      let newContent = newContent1 + "\n\n" + newLine;
      formatContent = formatContent.replace(
        textSubtitles[this.sentenceIndex - 1],
        newContent
      );

      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      this.changeNew[this.historyIndex] = formatContent;

      this.historyIndex = this.historyIndex + 1;
      formatContent = this.formatAll(formatContent);
      this.reqF.content = formatContent;
      this.cleanUp1();
      this.cleanUp2();
      setTimeout(() => {
        this.sentenceIndex = this.sentenceIndex + 1;
      }, 10);
      setTimeout(() => {
        this.sentenceIndex = this.sentenceIndex - 1;
      }, 20);
      window.localStorage.setItem(this.mediaName, formatContent);
      this.saveSubFinal();
    },

    saveSubNow() {
      if (this.tempOldContent == this.reqF.content) return;
      if (!this.onRUdo) {
        this.changeOld[this.historyIndex] = this.tempOldContent;
        this.changeNew[this.historyIndex] = this.reqF.content;

        this.historyIndex = this.historyIndex + 1;
      } else this.onRUdo = false;
      for (var i = 0; i < this.reqF.content.split("\n\n").length; ++i) {
        var ni = i + 1;
        let nCont = this.reqF.content
          .split("\n\n")
          [i].replace(
            this.reqF.content.split("\n\n")[i].split("\n")[0] + "\n",
            ni + "\n"
          );
        this.reqF.content = this.reqF.content.replace(
          this.reqF.content.split("\n\n")[i],
          nCont
        );
      }
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }
      window.localStorage.setItem(this.mediaName, this.reqF.content);
      if (this.timeOutId3) clearTimeout(this.timeOutId3);
      this.timeOutId3 = setTimeout(() => {
        this.saveSubFinal();
      }, 1000);
    },

    async saveSubFinal() {
      if (this.onOffline) {
        window.localStorage.setItem(this.srtNotUpload, "1");
        return;
      }
      var srtFullPath = "";
      const path = url.removeLastDir(this.$route.path);
      if (this.onRevision) srtFullPath = this.srtRevisePath;
      else srtFullPath = path + "/" + this.reqF.name;
      window.localStorage.setItem(this.srtNotUpload, "1");
      try {
        await api.post(srtFullPath, this.reqF.content, true);
        window.localStorage.removeItem(this.srtNotUpload);
        if (this.confirmType == "saveUnsavedSub") {
          this.confirmType = "none";
          var currentTime = new Date();
          let id = Math.floor(currentTime.getTime() / 1000);
          let today = currentTime.toLocaleDateString("af").replaceAll("/", "-");
          let pdjBackUp = "BackUp-" + today + "-" + id + ".srt";
          await api.post(
            "/files/!PDJ/Repeater-backup/" + this.reqF.name + "-" + pdjBackUp,
            this.req.content,
            true
          );
        }
      } catch (error) {
        return;
      }
    },

    changeUndo() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);

      this.historyIndex = this.historyIndex - 1;
      this.reqF.content = this.changeOld[this.historyIndex];
      this.cleanUp1();
      this.cleanUp2();
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }

      this.refresh();
      if (!this.RUdoAlert) {
        this.RUdoAlert = true;
        setTimeout(() => {
          this.RUdoAlert = false;
        }, 2000);
      }
      window.localStorage.setItem(this.mediaName, this.reqF.content);
      if (this.wavesurfer && this.regions) {
        this.updateRgns();
      }
      if (this.timeOutId3) clearTimeout(this.timeOutId3);
      this.timeOutId3 = setTimeout(() => {
        this.saveSubFinal();
      }, 1000);
    },

    changeRedo() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      this.reqF.content = this.changeNew[this.historyIndex];
      this.historyIndex = this.historyIndex + 1;
      this.cleanUp1();
      this.cleanUp2();
      if (this.isFav) {
        this.switchIsFav();
        setTimeout(() => {
          this.switchIsFav();
        }, 10);
      }
      this.refresh();
      if (!this.RUdoAlert) {
        this.RUdoAlert = true;
        setTimeout(() => {
          this.RUdoAlert = false;
        }, 2000);
      }
      window.localStorage.setItem(this.mediaName, this.reqF.content);
      if (this.wavesurfer && this.regions) {
        this.updateRgns();
      }
      if (this.timeOutId3) clearTimeout(this.timeOutId3);
      this.timeOutId3 = setTimeout(() => {
        this.saveSubFinal();
      }, 1000);
    },

    refresh() {
      if (this.sentenceIndex == 1) {
        this.sentenceIndex = this.sentenceIndex + 1;
        setTimeout(() => {
          this.sentenceIndex = this.sentenceIndex - 1;
        }, 1);
      } else if (this.sentenceIndex == this.srtSubtitles.length + 1) {
        this.sentenceIndex = this.sentenceIndex - 2;
        setTimeout(() => {
          this.sentenceIndex = this.sentenceIndex + 1;
        }, 1);
      } else {
        this.sentenceIndex = this.sentenceIndex - 1;
        setTimeout(() => {
          this.sentenceIndex = this.sentenceIndex + 1;
        }, 1);
      }
    },

    switchRevisePlan() {
      this.cleanUp1();
      this.cleanUp2();
      if (this.onRevision) {
        this.sentenceIndex = this.tempSentenceIndex;
        this.onRevision = false;
        this.showRevision = true;
        this.reqF.content = window.localStorage.getItem(this.mediaName);
        return;
      }
      this.showRevision = !this.showRevision;
      if (this.showRevision) {
        if (this.sentenceIndex > 1) this.indexE = this.sentenceIndex;
        var tempData = this.reviseData;
        for (var i = 0; i < this.reviseData.length; ++i) {
          for (var ii = 0; ii < this.reviseData[i].date.length; ++ii) {
            let afterToday = this.compareDates(
              this.reviseData[i].date[ii].split("^^")[0]
            );
            if (afterToday == 0) {
              tempData[i].date[ii] = tempData[i].date[ii].replace(
                tempData[i].date[ii].split("**")[0],
                tempData[i].date[ii].split("^^")[0] + "^^" + afterToday
              );
            }
          }
        }
        this.reviseData = tempData;
        this.save();
      }
    },
    switchDateReviseStatus(index, i) {
      this.$set(
        this.reviseData[index],
        this.reviseData[index].date[i],
        this.reviseData[index].date[i].split("**")[0] + "**0",
        this.reviseData[index].date[i].split("**")[0] + "**1"
      );
      if (this.reviseData[index].date[i].split("**")[1] == "1") {
        this.reviseData[index].date[i] =
          this.reviseData[index].date[i].split("**")[0] + "**0";
        this.markRevised = true;
        setTimeout(() => {
          this.markRevised = false;
        }, 1500);
      } else {
        this.reviseData[index].date[i] =
          this.reviseData[index].date[i].split("**")[0] + "**1";
        this.markUnrevised = true;
        setTimeout(() => {
          this.markUnrevised = false;
        }, 1500);
      }
      this.save();
    },

    delRevision(index) {
      this.cleanUp1();
      this.cleanUp2();

      var userConfirmationDelete = window.confirm(
        this.$t("repeater.delThisRevision2")
      );
      if (userConfirmationDelete) {
        this.reviseData.splice(index, 1);
      } else {
        return;
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
      if (!this.isReadyToPlay || this.showTools || this.isSetting) return;

      if (
        (event.key === "Control" || event.keyCode === 17) &&
        this.isEditSubandNotes
      ) {
        this.ctrlPressed = true;
      } else if (
        (event.key === "Delete" || event.keyCode === 46) &&
        this.ctrlPressed &&
        this.isEditSubandNotes
      ) {
        // Ctrl 和 Delete 键同时被按下
        this.deleteSentence();
      } else if (event.key === "Shift" && this.isEditSubandNotes) {
        this.shiftPressed = true;
      }

      if (event.which === 39 && this.sentenceIndex < this.srtSubtitles.length) {
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
        if (this.random) this.sentenceIndex = this.getRandomInt();
        else this.sentenceIndex = this.sentenceIndex + 1;
        if (
          (this.isSingle && !this.autoPlay) ||
          (this.isFavOnPlay && this.isPlayFullFavList)
        )
          return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.click();
        } else {
          setTimeout(() => {
            this.regularPlay();
            this.currentMedia.currentTime =
              this.srtSubtitles[this.sentenceIndex - 1].startTime;
          }, 1);
        }
        return;
      } else if (event.which === 37 && this.sentenceIndex > 1) {
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
        if (this.random) this.sentenceIndex = this.getRandomInt();
        else this.sentenceIndex = this.sentenceIndex - 1;
        if (
          (this.isSingle && !this.autoPlay) ||
          (this.isFavOnPlay && this.isPlayFullFavList)
        )
          return;
        if (this.isSingle) {
          if (this.isFirstClick) return;
          this.click();
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
      } else if (event.which === 40) {
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
              this.click();
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

    keyUp(event) {
      if (event.key === "Control" || event.keyCode === 17) {
        this.ctrlPressed = false;
      }
      if (event.key === "Shift") {
        this.shiftPressed = false;
      }
    },

    handleResize() {
      this.isLandscape = this.checkLandscape();
      this.mobileScreen = this.checkMobileScreen();
      this.resized = true;
    },
    close() {
      if (this.isSetting) {
        this.onSetting();
        return;
      }
      if (this.showRevision) {
        this.switchRevisePlan();
        return;
      }
      if (this.showSubtitleList || this.showNewWordList || this.withTrans) {
        this.showSubtitleList = false;
        this.searchList = "";
        if (this.showNewWordList) {
          if (this.newWordList.length > 0)
            this.newWordList[this.indexOfNewWordList].showTrans = false;
          this.showNewWordList = false;
        }
        this.withTrans = false;
        return;
      }
      if (this.isEditSubandNotes) {
        this.switchEditSubandNote();
        return;
      }
      if (this.showTools) {
        this.switchSubtitle();
        return;
      }
      if (this.isFavOnPlay) {
        this.playFavList();
        return;
      }
      if (this.isDictation) {
        this.isSingle = false;
        this.onSingle();
        return;
      }
      if (!this.isSingle) {
        this.onSingle();
        return;
      }
      if (this.onRevision) {
        this.cleanUp1();
        this.cleanUp2();
        this.sentenceIndex = this.tempSentenceIndex;
        this.onRevision = false;
        this.showRevision = true;
        this.reqF.content = window.localStorage.getItem(this.mediaName);
        return;
      }
      this.cleanUp1();
      if (this.timeOutId2) clearTimeout(this.timeOutId2);
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
  margin: 0.3em 0;
  display: inline;
  width: 8em;
  padding: 0.2em;
  border-radius: 3px;
}

span.subject {
  flex-grow: 1;
  margin: 0;
  display: inline-block;
  width: 15em;
  color: white;
}

span.headSubject {
  display: inline;
  color: black;
}

header {
  background: transparent;
}

#settingBoxContainer {
  display: flex;
  position: fixed;
  width: 65%;
  left: 50%;
  transform: translate(-50%, 0);
  top: 4.2em;
  bottom: 0.2em;
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
  background: grey;
}

.showMsg {
  z-index: 1025;
  position: fixed;
  text-align: center;
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
}

input:disabled {
  background-color: #bbbaba;
}

@media (max-width: 1000px) {
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
    width: 7em;
    margin: 0.3em 0;
    border-radius: 3px;
  }
}
</style>
