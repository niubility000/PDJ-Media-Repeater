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
        style="padding: 0.5em; background-color: white"
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
              showRevision
                ? 'red'
                : 'blue',
          }"
          icon="close"
          :label="$t('buttons.close')"
          @action="close()"
        />
        <title style="flex-grow: 1; white-space: nowrap" v-if="!isMobile">
          {{ mediaName.slice(0, -4) }}
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
            pointerEvents: isSetting || showRevision ? 'none' : 'auto',
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
                isSetting || showRevision
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
            showRevision
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
            loading || showSubtitleList || showNewWordList || showRevision
          "
          class="action"
          @click="onSetting"
          @dblclick.prevent
          :title="$t('repeater.settings')"
        >
          <i
            :style="{
              color:
                showSubtitleList || showNewWordList || showRevision
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
                !isReadyToPlay
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
            isDictation ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision
          "
          class="action"
          @click="showModal = true"
          @dblclick.prevent
          :title="$t('repeater.switchsubtitleLanguages')"
        >
          <i :style="subSwitch" class="material-icons">closed_caption</i>
        </button>

        <button
          v-if="isSingle && !isDictation"
          :disabled="
            loading ||
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision
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
            isSetting ||
            showSubtitleList ||
            showNewWordList ||
            isEditSubandNotes ||
            showRevision
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
          :disabled="loading || showRevision"
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
            !isReadyToPlay
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
                !isReadyToPlay
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
      <div v-if="ttsWrong" class="showMsg" style="bottom: 2.5em">
        <p style="color: red">
          {{ $t("repeater.ttsWrong") }}
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
          bottom: 0.2em;
          border-radius: 10px;
          overflow-y: auto;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
          top: isMobile && isLandscape ? '3.2em' : '4.2em',
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
                  {{ index + 1 }}. {{ item.name.slice(0, -4) }}&nbsp;(
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
                  @click="
                    openAlert(
                      2,
                      $t('repeater.delThisRevision2'),
                      'delRevision',
                      index
                    )
                  "
                  :title="$t('repeater.delThisRevision')"
                >
                  <i class="material-icons">delete</i>
                </button>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showModal" class="popUp-mask">
        <div class="popUp-backLayer">
          <div class="popUp-container">
            <div class="popUp-header">
              <h3>{{ $t("repeater.subNote1") }}</h3>
            </div>

            <div class="popUp-body">
              <div
                v-for="(option, index) in options"
                :key="index"
                @click="selectOption(option)"
                class="option-item"
              >
                {{ option }}
              </div>
            </div>

            <div class="popUp-footer">
              <button class="popUp-default-button" @click="showModal = false">
                {{ $t("buttons.close") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="prOutput" class="popUp-mask">
        <div class="popUp-backLayer" style="width: 100%; height: 100%">
          <div
            class="popUp-container"
            style="width: 100%; height: 100%; border-radius: 0; padding: 0"
          >
            <div id="sentencePrintGenerator">
              <div class="prContainer">
                <header class="prHeader">
                  <button
                    class="action"
                    @click="close"
                    :title="$t('buttons.close')"
                  >
                    <i
                      :style="{
                        color: isSetting ? 'red' : 'blue',
                      }"
                      class="material-icons"
                      >close</i
                    >
                  </button>
                  <h1>句子打印</h1>
                </header>

                <div class="prContent">
                  <div class="prSection">
                    <h2 class="prSectionTitle"><i>📚📚📚📚</i> 句子列表</h2>

                    <div class="prSelectAll">
                      <input
                        type="checkbox"
                        id="prSelectAll"
                        v-model="prAllSelected"
                        @change="prToggleSelectAll"
                      />
                      <label for="prSelectAll"
                        >选择全部句子 ({{ prSelectedSentences.length }}/{{
                          prSentences.length
                        }})</label
                      >
                    </div>

                    <div class="prWordList">
                      <div
                        class="prWordItem"
                        v-for="(sentence, index) in prSentences"
                        :key="index"
                      >
                        <input
                          type="checkbox"
                          :id="'prSentence-' + index"
                          v-model="prSelectedIndexes[index]"
                        />
                        <label
                          :for="'prSentence-' + index"
                          class="prWordText"
                          >{{
                            sentence.content.split("\r\n")[lineNumOfOrigin - 1]
                          }}</label
                        >
                        <span class="prPartOfSpeech">{{
                          sentence.content.split("\r\n")[lineNumOfTrans - 1]
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="prSection">
                    <h2 class="prSectionTitle"><i>📊📊📊📊</i> 表格设置</h2>

                    <div class="prExcelOptions">
                      <div class="prOptionGroup">
                        <label for="prFileName">文件名:</label>
                        <input
                          type="text"
                          id="prFileName"
                          v-model="prFileName"
                          placeholder="PDJ句子英汉互译"
                        />
                      </div>
                    </div>

                    <div class="prPreview">
                      <h3 class="prPreviewTitle">
                        句子卡片布局预览
                        <button
                          class="action"
                          @click="openAlert(1, $t('repeater.alertPrOutPut'))"
                          :title="$t('buttons.help')"
                        >
                          <i style="color: blue" class="material-icons">help</i>
                        </button>
                      </h3>
                      <div class="prPreviewContent">
                        <table class="prPreviewTable">
                          <tr v-for="i in 3" :key="i">
                            <td v-for="j in 4" :key="j" class="prPreviewCell">
                              <div v-if="j === 1">序号</div>
                              <div v-else-if="j === 2">句子英文</div>
                              <div v-else-if="j === 3">句子翻译</div>
                              <div v-else-if="j === 4" class="prCheckboxCell">
                                <div
                                  class="prCheckbox"
                                  v-for="k in 1"
                                  :key="k"
                                ></div>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>

                    <div class="prStats">
                      <span
                        >已选择句子: {{ prSelectedSentences.length }} 个</span
                      >
                      <span
                        >预计页数:
                        {{ Math.ceil(prSelectedSentences.length / 30) }}
                        页</span
                      >
                    </div>

                    <div class="prExportButtons">
                      <button
                        class="prExportBtn prHtmlBtn"
                        @click="prGenerateHTML"
                        :disabled="prSelectedSentences.length === 0"
                      >
                        {{
                          prSelectedSentences.length === 0
                            ? "请选择句子"
                            : "生成HTML表格"
                        }}
                      </button>
                      <button
                        class="prExportBtn prPrintBtn"
                        @click="prPrintDirectly"
                        :disabled="prSelectedSentences.length === 0"
                      >
                        {{
                          prSelectedSentences.length === 0
                            ? "请选择句子"
                            : "直接打印"
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showsubTools || showsubTools1 || showDicSetting"
        class="subTools-overlay"
      >
        <div
          v-if="showDicSetting"
          class="subTools"
          style="height: 70%; display: flex"
        >
          <div
            class="subTools-tabs"
            style="padding: 0 0 8px 0; font-size: 1.2em; font-weight: 500"
          >
            {{ $t("repeater.tsc001") }}
          </div>
          <div style="flex-grow: 1; overflow-y: auto">
            <div>
              <p>
                {{ $t("repeater.tsc002") }}
              </p>
              <p>
                {{ $t("repeater.showShortcutNote") }}
              </p>
              <hr
                style="border: none; border-top: 1px solid black; height: 0"
              />
              <p>
                {{ $t("repeater.tsc003") }}
              </p>
              <p>
                {{ $t("repeater.tsc004") }}
              </p>

              <p
                style="display: flex; flex-direction: row; align-items: center"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  style="width: 2em"
                  v-model="isFromLocal"
                />&nbsp;&nbsp;
                {{ fromLocal }}
              </p>
              <p v-if="isFromLocal == 0" style="color: black">
                {{ $t("repeater.tsc02") }}
                <button
                  class="action"
                  @click="showOnLineTscNote"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="padding: 0; font-size: 1.2em; color: red"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
              <p
                v-if="isFromLocal == 1"
                style="display: flex; flex-direction: row; align-items: center"
              >
                {{ $t("repeater.tsc04") }}
                <input
                  style="flex-grow: 1; padding: 0; margin: 0"
                  class="input input--repeater"
                  type="text"
                  placeholder="for example: defaultkey1,eastasia"
                  v-model.lazy="transcribeUrl"
                />

                &nbsp;&nbsp;

                <button
                  class="action"
                  @click="showTscSetting"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="padding: 0; font-size: 1.2em; color: blue"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
            </div>
            <div>
              <p>
                {{ $t("repeater.tsc08") }}
                <input
                  type="number"
                  min="1"
                  :max="2"
                  step="1"
                  style="width: 3em; padding: 0px 4px; margin: 0px"
                  v-model.lazy="originLine"
                />&nbsp;&nbsp;&nbsp;&nbsp;<br v-if="isMobile" />
                {{ $t("repeater.tsc09") }}
                <input
                  type="text"
                  style="width: 6em; padding: 0px 4px; margin: 0px"
                  v-model.lazy="langTranscribe"
                />
              </p>
            </div>
            <hr style="border: none; border-top: 1px solid black; height: 0" />

            <div class="percentage-control">
              <label for="percentageSlider" class="form-label">
                单词填空：挖空比例 {{ percentage }}%
              </label>
              <input
                id="percentageSlider"
                type="range"
                v-model="percentage"
                min="10"
                max="70"
                step="10"
                class="slider"
              />
            </div>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <div>
              <p>
                <input type="checkbox" v-model="splitSentenceByLetter" />
                {{ $t("repeater.splitSentenceByLetter") }}
              </p>
              <p>
                <span>字母排序时干扰项比例：(0为无干扰项)</span>
                <input
                  @click.stop
                  class="input input--repeater"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  v-model.lazy.number="moreLetters"
                />
              </p>
              <hr
                style="border: none; border-top: 1px solid black; height: 0"
              />
            </div>
          </div>

          <div class="subTools-buttons">
            <p>
              <button
                class="action"
                name="buttons"
                @click="switchDRead"
                :title="$t('repeater.tsc007')"
              >
                {{ readLang }}
              </button>

              <button
                v-if="!isFavOnPlay"
                :disabled="loading || isSetting || isRecording || !canDownload"
                class="action"
                @click="
                  openAlert(
                    2,
                    $t('repeater.confirmDownloadDictation2'),
                    'downloadDictation'
                  )
                "
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
                v-if="!isFavOnPlay"
                :disabled="
                  loading ||
                  isSetting ||
                  isRecording ||
                  (dictationArray.length == 0 && audioRecordArray.length == 0)
                "
                class="action"
                @click="
                  openAlert(
                    2,
                    $t('repeater.confirmUploadDictation2', {
                      recordingDir:
                        '/!PDJ/user-' +
                        user.username +
                        '/Repeater-backup/Rec-' +
                        mediaName.slice(0, -4),
                    }),
                    'uploadDictation'
                  )
                "
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
                v-if="!isFavOnPlay"
                :disabled="
                  loading ||
                  isSetting ||
                  isRecording ||
                  (dictationArray.length == 0 &&
                    audioRecordArray.length == 0 &&
                    !canDownload)
                "
                class="action"
                @click="
                  openAlert(
                    2,
                    $t('repeater.confirmdeleteDicRec', {
                      dictationFile:
                        '!PDJ/user-' +
                        user.username +
                        '/Repeater-backup/' +
                        mediaName.slice(0, -4) +
                        '-dictation.txt',
                      recordDir:
                        '!PDJ/user-' +
                        user.username +
                        '/Repeater-backup/Rec-' +
                        mediaName.slice(0, -4) +
                        '/',
                    }),
                    'deleteDicRec'
                  )
                "
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
              &nbsp;&nbsp;
              <button @click="handleCancel1">
                {{ $t("buttons.close") }}
              </button>
            </p>
          </div>
        </div>

        <div v-if="showsubTools1" class="subTools" style="height: 70%">
          <div
            class="subTools-tabs"
            style="padding: 0 0 8px 0; font-size: 1.2em; font-weight: 500"
          >
            {{ $t("repeater.tsc01") }}
          </div>
          <div>
            <p style="display: flex; flex-direction: row; align-items: center">
              <input
                type="range"
                min="0"
                max="1"
                style="width: 2em"
                v-model="isFromLocal"
              />&nbsp;&nbsp;
              {{ fromLocal }}
            </p>
            <p v-if="isFromLocal == 0" style="color: black">
              {{ $t("repeater.tsc02") }}
              <button
                class="action"
                @click="showOnLineTscNote"
                :title="$t('repeater.help')"
              >
                <i
                  style="padding: 0; font-size: 1.2em; color: red"
                  class="material-icons"
                  >help</i
                >
              </button>
            </p>
            <p
              v-if="isFromLocal == 1"
              style="display: flex; flex-direction: row; align-items: center"
            >
              {{ $t("repeater.tsc04") }}
              <input
                style="flex-grow: 1; padding: 0; margin: 0"
                class="input input--repeater"
                type="text"
                placeholder="for example: defaultkey1,eastasia"
                v-model.lazy="transcribeUrl"
              />

              &nbsp;&nbsp;

              <button
                class="action"
                @click="showTscSetting"
                :title="$t('repeater.help')"
              >
                <i
                  style="padding: 0; font-size: 1.2em; color: blue"
                  class="material-icons"
                  >help</i
                >
              </button>
            </p>
            <p>
              {{ $t("repeater.tsc06") }}
              <input
                type="number"
                min="0.5"
                :max="1.5"
                step="0.05"
                style="width: 4em; padding: 0px 4px; margin: 0px"
                placeholder="1"
                v-model.number.lazy="speedTranscribe"
              />&nbsp;
              <button
                class="action"
                @click="showSpeedNote"
                :title="$t('repeater.help')"
              >
                <i
                  style="padding: 0; font-size: 1.2em; color: blue"
                  class="material-icons"
                  >help</i
                >
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;{{ $t("repeater.tsc08") }}
              <input
                type="number"
                min="1"
                :max="2"
                step="1"
                style="width: 3em; padding: 0px 4px; margin: 0px"
                v-model.lazy="originLine"
              />&nbsp;&nbsp;&nbsp;&nbsp;<br v-if="isMobile" />{{
                $t("repeater.tsc09")
              }}
              <input
                type="text"
                style="width: 6em; padding: 0px 4px; margin: 0px"
                v-model.lazy="langTranscribe"
              />
            </p>
          </div>
          <div id="allText" style="flex-grow: 1; overflow-y: auto">
            <p style="margin: 0 0 4px 0; font-weight: 600; font-size: 0.8em">
              {{ $t("repeater.tsc10") }}
            </p>
            <p
              style="margin-top: 0; color: red; text-align: justify"
              v-html="oldTextHighLight"
            ></p>
            <p style="margin-bottom: 4px; font-weight: 600; font-size: 0.8em">
              {{ $t("repeater.tsc11") }}
            </p>
            <textarea
              id="newText"
              style="
                color: blue;
                padding: 0;
                margin: 0;
                border: none;
                resize: none;
                width: 100%;
                overflow: hidden;
                text-align: justify;
              "
              v-model="transcriptionResult"
            ></textarea>
          </div>

          <div class="subTools-buttons">
            <button
              v-if="!isMobile && isFromLocal == 0"
              @click="lastSen"
              :disabled="isProcessing2 || sentenceIndex < 2"
              :style="{
                backgroundColor: !isProcessing2 ? 'white' : '',
              }"
            >
              &lt;
            </button>
            <button
              @click="playTranscribe"
              :disabled="isProcessing1 || isProcessing2"
              :style="{
                backgroundColor:
                  !isProcessing1 && !isProcessing2 ? 'white' : '',
              }"
            >
              {{ $t("repeater.tsc13") }}
            </button>
            <button
              @click="transcribe"
              :disabled="isProcessing1 || isProcessing2"
              :style="{
                backgroundColor:
                  !isProcessing1 && !isProcessing2 ? 'white' : '',
              }"
            >
              {{ $t("repeater.tsc12") }}
            </button>
            <button
              @click="handleConfirm1"
              :disabled="
                transcriptionResult == '' ||
                transcriptionResult.includes('error:') ||
                isProcessing1 ||
                isProcessing2
              "
              :style="{
                backgroundColor:
                  !isProcessing1 && !isProcessing2 ? 'white' : '',
              }"
            >
              {{ $t("repeater.tsc14") }}
            </button>
            <button
              v-if="!isMobile && isFromLocal == 0"
              @click="nextSen"
              :disabled="isProcessing2 || sentenceIndex >= srtSubtitles.length"
              :style="{
                backgroundColor: !isProcessing2 ? 'white' : '',
              }"
            >
              &gt;
            </button>
            &nbsp;&nbsp;
            <button @click="handleCancel10" v-if="isProcessing2">
              {{ $t("buttons.stop") }}
            </button>
            <button
              @click="handleCancel1"
              v-if="!isProcessing2"
              :disabled="isProcessing1"
            >
              {{ $t("buttons.close") }}
            </button>
          </div>
        </div>
        <div v-if="showsubTools" class="subTools">
          <div class="subTools-tabs">
            <button
              :class="{ active: currentTab === 1 }"
              @click="currentTab = 1"
            >
              {{ $t("repeater.subpage1") }}
            </button>
            <button
              :class="{ active: currentTab === 2 }"
              @click="currentTab = 2"
            >
              {{ $t("repeater.subpage2") }}
            </button>
            <button
              :class="{ active: currentTab === 3 }"
              @click="currentTab = 3"
            >
              {{ $t("repeater.subpage3") }}
            </button>
          </div>
          <div class="subTools-content">
            <div v-if="currentTab === 1">
              <p style="color: black">
                {{ $t("repeater.translator1") }}
                <input
                  type="number"
                  min="1"
                  :max="srtSubtitles.length"
                  step="1"
                  style="width: 4em"
                  placeholder="1"
                  v-model.number.lazy="startNum"
                />
                {{ $t("repeater.translator10") }}
                <input
                  type="number"
                  min="1"
                  :max="srtSubtitles.length"
                  step="1"
                  style="width: 4em"
                  :placeholder="srtSubtitles.length"
                  v-model.number.lazy="endNum"
                />
                {{ $t("repeater.translator100") }}
                <input
                  type="number"
                  min="1"
                  :max="2"
                  step="1"
                  style="width: 3em; padding: 0"
                  v-model.lazy="originLine"
                />
                {{ $t("repeater.translator2") }}
                <input
                  type="text"
                  style="width: 3em"
                  v-model.lazy="targetLanguage"
                />
                {{ $t("repeater.translator3", { targetLine: targetLine }) }}
                <button
                  class="action"
                  name="buttons"
                  @click="alertTranslatorUrl"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="color: red; font-size: 1em; padding: 0"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
              <P v-if="showQuota == 1" style="font-size: 0.7rem; color: blue">
                {{ $t("repeater.quota") }} {{ quotaUsed
                }}{{ $t("repeater.quota2") }}
              </P>
              <P v-if="showQuota == 2" style="font-size: 0.7rem; color: blue">
                {{ $t("repeater.quota") }} {{ quotaUsed }}/1000000{{
                  $t("repeater.quota2")
                }}
              </P>
            </div>
            <div v-if="currentTab === 2">
              <p style="color: black; margin-bottom: 0em">
                {{ $t("repeater.moveAllStamp01") }}
                <input
                  class="input input--repeater"
                  name="buttons"
                  type="number"
                  style="width: 4em"
                  v-model.number="moveAll1"
                  step="50"
                />
                {{ $t("repeater.moveAllStamp1") }}
              </p>
              <p style="color: black; margin: 0em">
                {{ $t("repeater.moveAllStamp02") }}
                <input
                  class="input input--repeater"
                  name="buttons"
                  type="number"
                  style="width: 4em"
                  v-model.number="moveAll2"
                  step="50"
                />
                {{ $t("repeater.moveAllStamp1") }}
                <button
                  class="action"
                  name="buttons"
                  @click="alertMoveAll"
                  :title="$t('repeater.help')"
                >
                  <i style="color: red; font-size: 1em" class="material-icons"
                    >help</i
                  >
                </button>
              </p>
              <p style="color: black; margin: 0em">
                {{ $t("repeater.moveAllStamp3") }}
                <input
                  class="input input--repeater"
                  name="buttons"
                  type="number"
                  max="2"
                  min="0.1"
                  :style="{
                    width: isMobile ? '2.5em' : '4em',
                  }"
                  v-model.number="shrinkAll"
                  step="0.05"
                />
                {{ $t("repeater.moveAllStamp4") }}
                <button
                  class="action"
                  name="buttons"
                  @click="alertShrinkAll"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="color: red; font-size: 1em; padding: 0; margin: 0"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
            </div>
            <div v-if="currentTab === 3">
              <select
                v-model="selectedOption"
                style="width: 90%; margin-top: 1em"
              >
                <option
                  v-for="option in optionsEdit"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
              <p
                v-if="
                  selectedOption &&
                  (selectedOption.includes(1) ||
                    selectedOption.includes(6) ||
                    selectedOption.includes(7) ||
                    selectedOption.includes(8) ||
                    selectedOption.includes(9) ||
                    selectedOption.includes(10))
                "
                style="font-size: 0.8em"
              >
                {{
                  $t("repeater.toolsNote", {
                    xx: user.username,
                  })
                }}
              </p>
            </div>
          </div>

          <div class="subTools-buttons">
            <button
              @click="handleConfirm"
              :disabled="inSubProcess"
              :style="{
                backgroundColor: inSubProcess ? 'white' : '',
              }"
            >
              {{ $t("buttons.ok") }}
            </button>
            <button
              @click="handleCancel"
              :disabled="inSubProcess"
              :style="{
                backgroundColor: inSubProcess ? 'white' : '',
              }"
            >
              {{ $t("buttons.cancel") }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="alertVisible" class="custom-alert">
        <div
          class="custom-alert-content"
          :style="{
            width: isMobile ? '90%' : '50%',
          }"
        >
          <div class="alert-message-backLayer">
            <p
              style="
                word-wrap: break-word;
                word-break: break-all;
                text-align: justify;
                margin-bottom: 10px;
              "
            >
              {{ alertMessage }}
            </p>
          </div>
          <div class="subTools-buttons">
            <button v-if="alertType !== 1" @click="doCancel">
              {{ $t("buttons.cancel") }}
            </button>
            <button @click="doConfirm">
              {{ $t("buttons.ok") }}
            </button>
          </div>
        </div>
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
          bottom: 0.2em;
          background-color: black;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
          top: isMobile && isLandscape ? '3.2em' : '4.2em',
        }"
      >
        <p
          style="
            padding: 0 0.5em 0 0;
            margin: 0;
            background-color: white;
            color: black;
            display: flex;
            align-items: center;
          "
        >
          <button
            class="action"
            name="buttons"
            @click="toOutput"
            :title="$t('repeater.prOutput')"
          >
            <i
              style="color: red; font-size: 1em; background-color: #e8e8e8"
              class="material-icons"
              >save</i
            >
          </button>

          <button
            v-if="!isSearchReplace"
            class="action"
            name="buttons"
            @click="switchSearchReplace"
            :title="$t('repeater.search')"
          >
            <i
              style="color: red; font-size: 1em; background-color: #e8e8e8"
              class="material-icons"
              >search</i
            >
          </button>
          <button
            v-if="isSearchReplace"
            class="action"
            name="buttons"
            @click="switchSearchReplace"
            :title="$t('repeater.findReplace')"
          >
            <i
              style="color: red; font-size: 1em; background-color: springgreen"
              class="material-icons"
              >find_replace</i
            >
          </button>
          <button
            class="action"
            name="buttons"
            @click="switchCaseSensitive"
            :title="$t('repeater.switchCaseSensitive')"
          >
            <i
              style="font-size: 1em"
              class="material-icons"
              :style="{
                color: isCaseSensitive ? 'red' : 'black',
                backgroundColor: isCaseSensitive ? 'springgreen' : '#e8e8e8',
              }"
            >
              abc
            </i>
          </button>
          <input
            style="height: 2em; border-width: 1px; min-width: 3em; flex-grow: 1"
            type="text"
            :placeholder="showCasePlaceHolder"
            v-model.lazy="rOldWord"
          />
          <span v-if="isMobile" style="width: 4em; text-align: center"
            >in Line
          </span>
          <span v-if="!isMobile" style="text-align: center"
            >&nbsp;in Subtitle's Line&nbsp;
          </span>
          <select v-model="selectedReplaceLine" style="width: 4.5em">
            <option
              v-for="option in optionsReplace"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </p>
        <p
          v-if="isSearchReplace"
          style="
            margin: 0;
            background-color: white;
            color: black;
            display: flex;
            padding: 0 0.5em;
            align-items: center;
          "
        >
          <span style="padding-right: 0.1em"
            >{{ $t("repeater.replaceWith") }}
          </span>
          <input
            style="height: 2em; border-width: 1px; flex-grow: 1"
            :style="{
              width: mobileScreen ? '30%' : '',
            }"
            type="text"
            v-model="rNewWord"
          />
          &nbsp;&nbsp;
          <button
            class="action"
            name="buttons"
            @click="replaceSentence(1)"
            :title="$t('repeater.singleReplace')"
          >
            <i style="color: red; font-size: 1em" class="material-icons"
              >looks_one</i
            >
          </button>
          <button
            class="action"
            name="buttons"
            @click="replaceSentence(2)"
            :title="$t('repeater.allReplace')"
          >
            <i style="color: red; font-size: 1em" class="material-icons"
              >article</i
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
              style="font-size: 1em"
              class="material-icons"
              >undo</i
            >
          </button>
        </p>
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
            :id="index + 1"
            @click="chooseSentence(index, index)"
          >
            <p
              style="cursor: pointer"
              :style="{
                color: sentenceIndex == index + 1 ? 'blue' : 'white',
              }"
            >
              {{ index + 1 }}.
              <span
                v-html="
                  highlightWord(subtitle.content.split('\r\n')[0] || '', 1)
                "
              ></span
              >&nbsp;&nbsp; -
              <span
                v-html="
                  highlightWord(subtitle.content.split('\r\n')[1] || '', 2)
                "
              ></span>
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
          bottom: 0.2em;
          border-radius: 10px;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
          top: isMobile && isLandscape ? '3.2em' : '4.2em',
        }"
      >
        <p
          v-if="!this.withTrans"
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
        >
          <span>{{ $t("repeater.newWordTest") }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <button
            @click="
              openAlert(
                2,
                $t('repeater.saveWordList', { xx: user.username }),
                'saveWordList'
              )
            "
            style="background: gray; border: 0; padding: 0"
            :title="$t('repeater.word4')"
          >
            <i
              style="color: blue; width: 1em; padding: 0"
              class="material-icons"
              >save</i
            >
          </button>
        </p>
        <p
          v-if="this.withTrans"
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
          "
        >
          <span>{{ $t("repeater.newWordList") }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <button
            @click="
              openAlert(
                2,
                $t('repeater.saveWordList', { xx: user.username }),
                'saveWordList'
              )
            "
            style="background: gray; border: 0; padding: 0"
            :title="$t('repeater.word4')"
          >
            <i
              style="color: blue; width: 1em; padding: 0"
              class="material-icons"
              >save</i
            >
          </button>
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
              {{
                srtSubtitles[newWord.num].content.split("\r\n")[1]
              }}&nbsp;&nbsp;
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
              ]&nbsp;&nbsp;&nbsp;&nbsp;
              <button
                class="action"
                name="buttons"
                @click="
                  openAlert(
                    2,
                    $t('repeater.confirmDeleteWord'),
                    'deleteWord',
                    newWord.origin
                  )
                "
                :title="$t('repeater.infoDeleteWord')"
              >
                <i
                  style="color: springgreen; padding: 0; font-size: 1.2em"
                  class="material-icons"
                  >delete</i
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
            padding: 0 1em;
            border-radius: 10px;
            background: grey;
          "
        >
          <p>{{ $t("repeater.noNewWord") }}</p>
          <p>{{ $t("repeater.newWordInstruction") }}</p>
        </div>
      </div>

      <div
        id="settingBoxContainer"
        v-if="srtSubtitles && isSetting"
        :style="{
          top: isMobile && isLandscape ? '3.2em' : '4.2em',
        }"
      >
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
                <i style="color: blue; font-size: 1.2em" class="material-icons"
                  >verified</i
                >
              </button>
            </p>
            <p v-if="hasPrivate" style="color: white">
              <input type="radio" value="Yes" v-model="isPrivate" />
              {{ $t("repeater.privateConfig") }}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <div :style="{ width: isMobile ? '100%' : '70%' }">
            <p>
              <span style="color: white">{{ $t("repeater.ttsConfig") }} </span>
              <span style="color: white">
                (<input type="checkbox" v-model="isAutoDetectLang" />
                {{ $t("repeater.autoDetect") }}

                <button
                  class="action"
                  name="buttons"
                  @click="alertAutoDetect"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="color: blue; font-size: 1.2em"
                    class="material-icons"
                    >help</i
                  >
                </button>
                )
              </span>
            </p>

            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
              "
            >
              <span style="margin-left: 1em; color: white" class="subject">
                {{ $t("repeater.lineNumOfOrigin") }}
              </span>
              <input
                :disabled="isAutoDetectLang"
                class="input input--repeater"
                type="number"
                min="1"
                max="3"
                v-model.number.lazy="lineNumOfOrigin"
              />
            </div>

            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
              "
            >
              <span style="margin-left: 1em; color: white" class="subject">
                {{ $t("repeater.langInOriginLine") }}
              </span>
              <input
                :disabled="isAutoDetectLang"
                :style="{
                  width: isMobile ? '7em' : '8em',
                }"
                class="input input--repeater"
                type="text"
                :placeholder="langInOriginLinedefault"
                v-model="langInOriginLine"
              />
            </div>

            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
              "
            >
              <span style="margin-left: 1em; color: white" class="subject">
                {{ $t("repeater.lineNumOfTrans") }}
              </span>
              <input
                :disabled="isAutoDetectLang"
                class="input input--repeater"
                type="number"
                min="1"
                max="3"
                v-model.number.lazy="lineNumOfTrans"
              />
            </div>

            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
              "
            >
              <span style="margin-left: 1em; color: white" class="subject">
                {{ $t("repeater.langInTransLine") }}
              </span>
              <input
                :disabled="isAutoDetectLang"
                :style="{
                  width: isMobile ? '7em' : '8em',
                }"
                class="input input--repeater"
                type="text"
                :placeholder="langInTransLinedefault"
                v-model="langInTransLine"
              />
            </div>

            <div style="color: white">
              <p style="margin-bottom: 0">
                <input
                  :disabled="!hasSpeechSynthesis"
                  style="margin-left: 1em"
                  type="radio"
                  value="Yes"
                  v-model="isSystemTTS"
                />
                <span
                  :style="{
                    color: hasSpeechSynthesis ? 'white' : '#bbbaba',
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
                  color: isSystemTTS == 'Yes' ? 'white' : '#bbbaba',
                }"
              >
                {{ $t("repeater.SystemTTSnote") }}
              </p>

              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  width: 100%;
                "
              >
                <span
                  :style="{
                    color:
                      isSystemTTS == 'No' || !hasSpeechSynthesis
                        ? '#bbbaba'
                        : 'white',
                  }"
                  style="margin-left: 2em"
                  class="subject"
                >
                  {{
                    $t("repeater.voiceO", {
                      totalvoicesO: totalReadersO,
                    })
                  }}
                </span>
                <input
                  :disabled="isSystemTTS == 'No' || !hasSpeechSynthesis"
                  class="input input--repeater"
                  type="number"
                  v-model.number.lazy="readerO"
                  :style="{
                    width: isMobile ? '5.5em' : '6.5em',
                  }"
                />
                <button
                  :disabled="isSystemTTS == 'No' || !hasSpeechSynthesis"
                  class="action"
                  style="height: 1.5em"
                  @click="testTTSVoiceO"
                  :title="$t('repeater.testTTSVoice')"
                >
                  <i
                    :style="{
                      color: isSystemTTS == 'No' ? '#bbbaba' : 'blue',
                    }"
                    style="width: 1em; padding: 0; margin: 0"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  width: 100%;
                "
              >
                <span
                  :style="{
                    color:
                      isSystemTTS == 'No' || !hasSpeechSynthesis
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
                  :disabled="isSystemTTS == 'No' || !hasSpeechSynthesis"
                  class="input input--repeater"
                  type="number"
                  v-model.number.lazy="reader"
                  :style="{
                    width: isMobile ? '5.5em' : '6.5em',
                  }"
                />
                <button
                  :disabled="isSystemTTS == 'No' || !hasSpeechSynthesis"
                  class="action"
                  style="height: 1.5em"
                  @click="testTTSVoice"
                  :title="$t('repeater.testTTSVoice')"
                >
                  <i
                    :style="{
                      color: isSystemTTS == 'No' ? '#bbbaba' : 'blue',
                    }"
                    style="width: 1em; padding: 0; margin: 0"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
              </div>

              <p style="margin-bottom: 0">
                <input
                  style="margin-left: 1em"
                  type="radio"
                  value="No"
                  v-model="isSystemTTS"
                />
                <span>{{ $t("repeater.notSystemTTS") }}</span>
                <button
                  :disabled="isSystemTTS == 'Yes'"
                  class="action"
                  @click="resetTTSurl"
                  :title="$t('repeater.resetTTSurl')"
                >
                  <i
                    style="font-size: 1.2em"
                    :style="{
                      color: isSystemTTS == 'Yes' ? '#bbbaba' : 'blue',
                    }"
                    class="material-icons"
                    >settings_backup_restore</i
                  >
                </button>
              </p>
              <div
                :style="{
                  color: isSystemTTS == 'No' ? 'white' : '#bbbaba',
                }"
              >
                <span style="margin: 0px 0px 0.5em 2em">{{
                  $t("repeater.origin")
                }}</span>
                <p style="margin: 0 0 4px 0">
                  <input
                    style="
                      margin: 0 0 0.5em 2em;
                      width: calc(100% - 5em);
                      text-align: left;
                    "
                    :disabled="isSystemTTS == 'Yes'"
                    class="input input--repeater"
                    type="text"
                    v-model.lazy="TTSurlO"
                  />
                  <button
                    :disabled="isSystemTTS == 'Yes'"
                    class="action"
                    @click="testTTSurlO"
                    :title="$t('repeater.testUrl')"
                  >
                    <i
                      style="font-size: 1.2em"
                      :style="{
                        color: isSystemTTS == 'Yes' ? '#bbbaba' : 'blue',
                      }"
                      class="material-icons"
                      >play_circle_outline</i
                    >
                  </button>
                </p>

                <span style="margin: 0px 0px 0.5em 2em">{{
                  $t("repeater.trans")
                }}</span>
                <p style="margin: 0 0 4px 0">
                  <input
                    style="
                      margin: 0 0 0.5em 2em;
                      width: calc(100% - 5em);
                      text-align: left;
                    "
                    :disabled="isSystemTTS == 'Yes'"
                    class="input input--repeater"
                    type="text"
                    v-model.lazy="TTSurl"
                  />
                  <button
                    :disabled="isSystemTTS == 'Yes'"
                    class="action"
                    @click="testTTSurl"
                    :title="$t('repeater.testUrl')"
                  >
                    <i
                      style="font-size: 1.2em"
                      :style="{
                        color: isSystemTTS == 'Yes' ? '#bbbaba' : 'blue',
                      }"
                      class="material-icons"
                      >play_circle_outline</i
                    >
                  </button>
                </p>
              </div>
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
                  color: isSystemTTS == 'No' ? 'white' : '#bbbaba',
                }"
              >
                {{
                  $t("repeater.notSystemTTSnote", {
                    key1: key1,
                  })
                }}
                &nbsp;&nbsp;&nbsp;

                <button
                  :disabled="isSystemTTS == 'Yes'"
                  class="action"
                  @click="showTTSSetting"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="padding: 0; font-size: 1.2em"
                    :style="{
                      color: isSystemTTS == 'Yes' ? '#bbbaba' : 'blue',
                    }"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid black; height: 0" />

          <div
            style="margin: 8px 0"
            :style="{ width: isMobile ? '100%' : '70%' }"
          >
            <span class="subject">{{ $t("repeater.playOrigin") }} </span>
          </div>
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

          <div style="display: block; color: white">
            <p>
              <input
                v-if="!fakeAudio"
                type="checkbox"
                v-model.lazy="readOriginByTTS"
              />
              <input
                v-if="fakeAudio"
                :disabled="fakeAudio"
                type="checkbox"
                v-model.lazy="fakeAudio"
              />
              {{ $t("repeater.playOriginO") }}
              <button
                class="action"
                name="buttons"
                @click="alertOriginTTS"
                :title="$t('repeater.help')"
              >
                <i style="color: blue; font-size: 1.2em" class="material-icons"
                  >help</i
                >
              </button>
            </p>
            <p>
              <input type="checkbox" v-model.lazy="showTempSpeed" />
              {{ $t("repeater.tempSpeed") }}
            </p>
            <p>
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
            <p style="color: white">
              <input type="checkbox" v-model="autoPlay" />
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

            <p style="margin-bottom: 0">
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
            <p style="padding-left: 0; margin-top: 0">
              <input type="checkbox" v-model="autoStop" />
              {{ $t("repeater.autoStop") }}
              <input
                class="input input--repeater"
                style="width: 4em"
                type="number"
                step="1"
                v-model.lazy="autoStopMins"
              />
              {{ $t("repeater.mins") }}
            </p>

            <p>
              <input type="checkbox" v-model="random" />
              {{ $t("repeater.random") }}
            </p>

            <p>
              <input type="checkbox" v-model="replayFromStart" />
              {{ $t("repeater.replayFromStart") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />

            <span style="color: white">
              <input type="checkbox" v-model="isUtterTransLine" />
              {{ $t("repeater.utterSubtitle") }}
            </span>

            <div
              style="display: flex; flex-direction: row; align-items: center"
              :style="{ width: isMobile ? '100%' : '70%' }"
            >
              <span
                :style="{ color: isUtterTransLine ? 'white' : '#bbbaba' }"
                style="margin-left: 1em"
                class="subject"
              >
                {{ $t("repeater.speedOfUttering") }}
              </span>
              <input
                :disabled="!isUtterTransLine"
                class="input input--repeater"
                type="text"
                v-model.number.lazy="speedOfUtter"
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
              <input type="checkbox" v-model="autoRealCheck" />
              {{ $t("repeater.autoRealCheck") }}
            </p>
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="ignoreC" />
              {{ $t("repeater.ignoreC") }}
            </p>
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="allowLoadDiction" />
              {{ $t("repeater.allowLoadDiction") }}
            </p>
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="typingSound" />
              {{ $t("repeater.typingSound") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />
            <p style="text-align: justify; text-align-last: left; color: white">
              <input type="checkbox" v-model="defaultWaveSurfer" />
              {{ $t("repeater.wavesurfer") }} &#9810;
              {{ $t("repeater.wavesurfer2") }}
            </p>
            <hr style="border: none; border-top: 1px solid black; height: 0" />

            <span style="margin-bottom: 0; color: white; align-items: center">
              <p
                style="
                  display: flex;
                  flex-direction: row;
                  text-align: justify;
                  text-align-last: left;
                  margin-bottom: 0;
                  align-items: center;
                "
              >
                {{ $t("repeater.transUrl") }}
                <button
                  class="action"
                  @click="testTransUrl"
                  :title="$t('repeater.testUrl')"
                >
                  <i
                    style="font-size: 1.2em; color: blue"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
              </p>
              <p style="margin: 0">
                <input
                  style="flex-grow: 1; text-align: left; width: 100%"
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
            </span>
            <span>
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
                {{ $t("repeater.translator0") }}
                <button
                  class="action"
                  name="buttons"
                  @click="resetTranslatorurl"
                  :title="$t('repeater.resetTTSurl')"
                >
                  <i
                    style="color: blue; font-size: 1.2em"
                    class="material-icons"
                    >settings_backup_restore</i
                  >
                </button>
                <button
                  class="action"
                  @click="testTranslatorUrl"
                  :title="$t('repeater.testUrl')"
                >
                  <i
                    style="font-size: 1.2em; color: blue"
                    class="material-icons"
                    >play_circle_outline</i
                  >
                </button>
                <button
                  class="action"
                  name="buttons"
                  @click="alertTranslatorUrl1"
                  :title="$t('repeater.help')"
                >
                  <i
                    style="color: blue; font-size: 1.2em"
                    class="material-icons"
                    >help</i
                  >
                </button>
              </p>
              <p style="margin-top: 0">
                <input
                  style="flex-grow: 1; text-align: left; width: 100%"
                  class="input input--repeater"
                  type="text"
                  v-model.lazy="translatorUrl"
                />
              </p>
            </span>
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
            <p style="color: white">
              <input type="checkbox" v-model.lazy="showArrow" />
              {{ $t("repeater.showArrow") }}
            </p>
            <p style="color: white; margin-bottom: 0.5em">
              <input type="checkbox" v-model.lazy="allowVideoFullScreen" />
              {{ $t("repeater.allowVideoFullScreen") }}
            </p>
            <p style="color: white; margin-bottom: 0">
              <input type="checkbox" v-model.lazy="isCustomFont" />
              {{ $t("repeater.isCustomFont") }}
              <button
                class="action"
                name="buttons"
                @click="helpCss"
                :title="$t('repeater.help')"
              >
                <i style="color: blue; font-size: 1.2em" class="material-icons"
                  >help</i
                >
              </button>
            </p>
            <p
              style="
                margin: 0 0 0 1em;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
              :style="{
                color: isCustomFont ? 'white' : '#bbbaba',
              }"
            >
              {{ $t("repeater.firstLine") }}
              <input
                style="flex-grow: 1; text-align: left"
                :disabled="!isCustomFont"
                class="input input--repeater"
                type="text"
                v-model.lazy="customCss1"
              />
            </p>
            <p
              style="
                margin: 0 0 0 1em;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
              :style="{
                color: isCustomFont ? 'white' : '#bbbaba',
              }"
            >
              {{ $t("repeater.secLine") }}
              <input
                style="flex-grow: 1; text-align: left"
                :disabled="!isCustomFont"
                class="input input--repeater"
                type="text"
                v-model.lazy="customCss2"
              />
            </p>
            <div v-html="subtitleStyle1"></div>
            <div v-html="subtitleStyle2"></div>

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
              <i style="color: white; font-size: 1em" class="material-icons"
                >arrow_forward_ios</i
              >
              {{ $t("repeater.instruction31") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction4") }}
              <i style="color: white; font-size: 1em" class="material-icons"
                >arrow_back_ios</i
              >
              {{ $t("repeater.instruction41") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction50") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction5") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction6") }}
            </p>
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
              {{ $t("repeater.clickButton2") }}
              <i style="color: white" class="material-icons">spellcheck</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">mic</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">campaign</i>
              {{ $t("repeater.instruction71") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">closed_caption</i>
              {{ $t("repeater.instruction8") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton") }}
              <i style="color: white" class="material-icons">edit</i
              >{{ $t("repeater.instruction13") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton1") }}
              <i style="color: white" class="material-icons">autofps_select</i
              >{{ $t("repeater.instruction131") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickButton1") }}
              <i style="color: white" class="material-icons">undo</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">redo</i>
              {{ $t("repeater.instruction13101") }}
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
            <p style="text-align: justify">
              {{ $t("repeater.clickandInput1") }}
              <i style="color: white" class="material-icons">search</i>
              {{ $t("repeater.or") }}
              <i style="color: white" class="material-icons">find_replace</i>
              {{ $t("repeater.instruction121") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.clickandInput1") }}
              <i style="color: white" class="material-icons">abc</i>
              {{ $t("repeater.instruction122") }}
            </p>
            <p style="text-align: justify">
              {{ $t("repeater.instruction18") }}
              <i style="color: white" class="material-icons">conveyor_belt</i
              >{{ $t("repeater.instruction118") }}
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
        <div
          v-if="isFullScreen"
          style="flex-grow: 1"
          :style="{
            width: 'auto',
            height: isWaveSurfer ? '45%' : '80%',
          }"
        ></div>
        <video
          v-if="isMediaType == 2 && !browserHiJack"
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          style="
            padding-bottom: 1em;
            padding-top: 0.2em;
            object-position: center;
          "
          :style="{
            width: isFullScreen || isMobile ? '100%' : 'auto',
            height: isFullScreen
              ? '100%'
              : (isMobile && isLandscape) || isDictation
              ? '0'
              : isMobile && isWaveSurfer
              ? '30%'
              : isMobile
              ? '40%'
              : isWaveSurfer
              ? '45%'
              : '60%',
            zIndex: isFullScreen ? '0' : '',
            position: isFullScreen ? 'fixed' : '',
            padding: isFullScreen ? '2.2em 0' : '0.2em 0 1em 0',
            left: isFullScreen ? '50%' : '',
            transform: isFullScreen ? 'translate(-50%, 0px)' : '',
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
            <button
              class="action"
              name="buttons"
              @click="helpLoadingMedia"
              :title="$t('help.help')"
            >
              <i style="color: red; font-size: 0.8em" class="material-icons"
                >help</i
              >
            </button>
          </p>
        </div>
        <div
          v-if="showFakeAlert && !browserHiJack && !isFavOnPlay && !onRevision"
          class="showMsg"
          style="color: springgreen; bottom: 1.5em; z-index: 1008"
        >
          <p style="font-size: 1em">
            {{ $t("repeater.wrongMedia") }}
          </p>
        </div>
        <div
          v-if="showAlert"
          class="showMsg"
          style="color: springgreen; bottom: 1.5em; z-index: 1008"
        >
          <p style="font-size: 1em">
            {{ $t("repeater.tsc18") }}
          </p>
        </div>
        <span
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="
            srtSubtitles &&
            ((isMediaType == 1 && !isDictation) ||
              (isDictation && isEditSubandNotes))
          "
          style="
            width: 100%;
            margin: 0;
            background-color: black;
            top: 0;
            height: 30%;
          "
        >
        </span>

        <div
          v-if="
            isMediaType > 0 && srtSubtitles && !isEditSubandNotes && isDictation
          "
          style="height: 50%; display: flex; flex-direction: column"
        >
          <div
            @mousedown="startDrag"
            @mouseup="endDrag"
            @touchstart="startTouch"
            @touchend="endTouch"
            style="flex-grow: 1"
          ></div>

          <textarea
            v-if="!isEmpty && !showSpell && !showCloze && !showSenWord"
            id="editArea3"
            ref="targetTextArea"
            @touchmove="touchMoveF"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            rows="2"
            v-model="dictationContent"
            :placeholder="defaultDictation"
            style="
              width: 100%;
              font-size: 2em;
              background-color: black;
              color: white;
              border: none;
              resize: none;
              text-align: center;
              padding: 0 0 6px 0;
              white-space: pre-wrap;
            "
            :style="{
              color: !autoRealCheck ? 'white' : isRight ? 'green' : 'red',
            }"
          ></textarea>

          <div v-if="showCloze" class="cloze-section">
            <div class="feedback" v-if="showFeedback">
              <p
                :style="{
                  color:
                    Math.round((correctCount / totalBlanks) * 100) == 100
                      ? 'green'
                      : 'red',
                }"
              >
                正确率: {{ correctCount }}/{{ totalBlanks }} ({{
                  Math.round((correctCount / totalBlanks) * 100)
                }}%)
              </p>
            </div>
            <!-- 单词模式：字母挖空 -->
            <div v-if="isSingleWord" class="cloze-word">
              <div class="letters-container">
                <template v-for="(letter, index) in processedLetters">
                  <template v-if="letter.isBlank">
                    <input
                      :key="`input-${index}`"
                      type="text"
                      v-model="userLetterAnswers[index]"
                      :class="{
                        'letter-input': true,
                        correct: letter.isChecked && letter.isCorrect,
                        incorrect: letter.isChecked && !letter.isCorrect,
                      }"
                      @input="handleLetterInput(index)"
                      @blur="checkLetterAnswer(index)"
                      maxlength="1"
                      size="1"
                      style="padding: 0"
                    />
                  </template>
                  <template v-else>
                    <span :key="`char-${index}`" class="fixed-letter">{{
                      letter.char
                    }}</span>
                  </template>
                </template>
              </div>
            </div>

            <!-- 句子模式：单词挖空 -->
            <div v-else class="cloze-sentence">
              <span
                v-for="(item, index) in processedItems"
                :key="index"
                class="word-item"
              >
                <template v-if="item.isBlank">
                  <input
                    type="text"
                    v-model="userAnswers[index]"
                    :class="{
                      'blank-input': true,
                      correct: item.isChecked && item.isCorrect,
                      incorrect: item.isChecked && !item.isCorrect,
                    }"
                    @blur="checkAnswer(index)"
                    maxlength="20"
                    style="color: white"
                  />
                </template>
                <template v-else>
                  {{ item.text }}
                </template>
              </span>
            </div>
          </div>

          <div v-if="showSenWord" class="sw-vocabulary-reader">
            <div class="sw-sentence-container">
              <div
                v-for="(swWord, index) in swSentenceData"
                :key="index"
                class="sw-word-card"
                @mouseenter="
                  swDisplayMode === 'hover' && (swWord.swHover = true)
                "
                @mouseleave="
                  swDisplayMode === 'hover' && (swWord.swHover = false)
                "
              >
                <!-- 音标显示 -->
                <div
                  class="sw-phonetic"
                  :class="{
                    'sw-show-phonetic':
                      (swDisplayMode === 'hover' &&
                        (swWord.swHover || swIsSpeaking === index)) ||
                      swDisplayMode === 'always',
                  }"
                  @click="readSenWord(swWord.text, 2)"
                >
                  {{ swWord.phonetic }}
                </div>

                <!-- 单词显示 -->
                <div
                  class="sw-word"
                  :class="{ 'sw-speaking': swIsSpeaking === index }"
                  @click="readSenWord(swWord.text, 2)"
                >
                  {{ swWord.text }}
                </div>

                <!-- 释义显示 -->
                <div
                  class="sw-definition"
                  :class="{
                    'sw-show-definition':
                      (swDisplayMode === 'hover' &&
                        (swWord.swHover || swIsSpeaking === index)) ||
                      swDisplayMode === 'always',
                  }"
                  @click="readSenWord(swWord.definition, 1)"
                >
                  {{ swWord.definition }}
                </div>
              </div>
            </div>
            <div class="sw-header">
              <button class="sw-toggle-btn" @click="swToggleDisplayMode">
                {{
                  swDisplayMode === "always"
                    ? "切换到悬停显示"
                    : "切换到始终显示"
                }}
              </button>
            </div>
          </div>

          <div v-if="showSpell" class="game-container">
            <div v-if="showGame" class="spelling-area">
              <div
                class="current-spelling"
                :class="{ 'is-correct': isCorrect }"
              >
                <template v-if="isSentence && !splitSentenceByLetter">
                  <div
                    v-for="(word, index) in currentSpelling"
                    :key="index"
                    class="spelled-word"
                    @click="!isCorrect && removeFromSpelling(index)"
                  >
                    {{ word }}
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(letter, index) in currentSpelling"
                    :key="index"
                    class="spelled-letter"
                    :title="letter === ' ' ? '空格' : ''"
                    @click="!isCorrect && removeFromSpelling(index)"
                  >
                    {{ letter === " " ? "␣" : letter }}
                  </div>
                </template>
              </div>
              <div
                v-if="currentSpelling.length === originalItems.length"
                :class="{
                  'correct-message': isCorrect,
                  'error-message': !isCorrect,
                }"
              >
                <i
                  class="fas"
                  :class="isCorrect ? 'fa-check-circle' : 'fa-times-circle'"
                ></i>
                {{
                  isCorrect
                    ? isSentence && !splitSentenceByLetter
                      ? "句子顺序正确！"
                      : "拼写正确！"
                    : isSentence && !splitSentenceByLetter
                    ? "句子顺序错误！"
                    : "拼写错误！"
                }}
              </div>
              <div class="shuffled-items">
                <button
                  v-for="(item, index) in shuffledItems"
                  :key="index"
                  @click="addToSpelling(item)"
                  :disabled="!item || isCorrect"
                  :class="
                    isSentence && !splitSentenceByLetter
                      ? 'word-btn'
                      : 'letter-btn'
                  "
                  :title="item === ' ' ? '空格' : ''"
                >
                  {{ item === " " ? "␣" : item }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <span
          :class="{ 'custom-text': isPinyin }"
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
            overflow-wrap: break-word;
            width: 100%;
            margin: 0;
            z-index: 1000;
          "
          :style="{
            fontSize: isDictation ? '1.25em' : '',
            top: isMediaType == 1 ? 0 : '4em',
            overflowY:
              !isMobile && isFullScreen && !isDictation ? 'unset' : 'auto',
          }"
        >
        </span>
        <p v-if="srtSubtitles == null" style="color: red">
          This .srt file's format is incorrect. It should be encoded using
          UTF-8.
        </p>

        <span
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          class="videoFullScreen"
          v-if="
            isMediaType > 0 &&
            srtSubtitles &&
            !isEditSubandNotes &&
            !isDictation
          "
          style="
            width: 100%;
            overflow-wrap: break-word;
            font-size: 1em;
            margin: auto;
            left: 0;
            right: 0;
          "
        >
          <div
            v-show="!isEmpty"
            style="
              width: 100%;
              color: yellow;
              text-shadow: 1px 1px 1px #000;
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
              style="padding: 0; margin: 0"
            >
              <button
                v-if="canRecording && !isFavOnPlay"
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
                v-if="!canRecording && !isFavOnPlay"
                class="action"
                @click="showRecordingSetNote"
                :title="$t('repeater.cannotRecording')"
              >
                <i style="font-size: 1.7em; color: green" class="material-icons"
                  >mic_off</i
                >
              </button>

              <button
                v-if="!isFavOnPlay"
                :disabled="loading || isSetting || isRecording || !audioUrl"
                class="action"
                @click="playRecording"
                :title="$t('repeater.playRecording')"
              >
                <i
                  style="font-size: 1.7em"
                  :style="{
                    color:
                      !isRecording && audioUrl && !onRecPlay
                        ? 'springgreen'
                        : onRecPlay
                        ? 'red'
                        : 'grey',
                  }"
                  class="material-icons"
                  >campaign</i
                >
              </button>

              <button
                class="action"
                name="buttons"
                @click="switchSenData"
                :title="$t('repeater.tsc0005')"
              >
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: !showSenWord ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >accessible_forward</i
                >
              </button>

              <button
                class="action"
                name="buttons"
                @click="
                  closeAllParts();
                  showSpell = !showSpell;
                  splitInput();
                "
                :title="$t('repeater.tsc005')"
              >
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: !showSpell ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >assist_walker</i
                >
              </button>

              <button
                class="action"
                name="buttons"
                @click="
                  closeAllParts();
                  showCloze = !showCloze;
                "
                :title="$t('repeater.tsc006')"
              >
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: !showCloze ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >escalator</i
                >
              </button>
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
                class="action"
                name="buttons"
                @click="showDicSetting = true"
                :title="$t('repeater.tsc001')"
              >
                <i
                  :style="{
                    color: !showDicSetting ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >settings_applications</i
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
                <span style="color: yellow; font-size: 0.8em">&#10134;</span>
                <span style="color: black; font-size: 0.8em">-</span>
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
                <span style="color: black; font-size: 0.8em">-</span>
                <span style="color: yellow; font-size: 0.8em">&#10133;</span>
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
                <span style="color: yellow; font-size: 0.8em">&#10134;</span>
                <span style="color: black; font-size: 0.8em">-</span>
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
                <span style="color: black; font-size: 0.8em">-</span>
                <span style="color: yellow; font-size: 0.8em">&#10133;</span>
              </span>
            </span>
          </p>

          <textarea
            v-if="isShowLine1"
            id="editArea1"
            name="editAreaM"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            @touchmove="touchMoveM"
            @blur="subFirstLine = subFirstLineTemp"
            v-model="subFirstLineTemp"
            placeholder="...Subtitle First Line..."
            :rows="rowsNum"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              border: none;
              resize: none;
              padding: 0;
              margin-top: 0.5em;
            "
            :style="{
              color:
                showsubTools &&
                currentTab == 1 &&
                startNum <= sentenceIndex &&
                sentenceIndex <= endNum &&
                originLine == 1
                  ? 'yellow'
                  : 'white',
            }"
          ></textarea>
          <textarea
            v-if="isShowLine2"
            id="editArea2"
            name="editAreaM"
            @touchmove="touchMoveG"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            @blur="subSecLine = subSecLineTemp"
            v-model.lazy="subSecLineTemp"
            placeholder="...Subtitle Second Line..."
            :rows="rowsNum"
            style="
              width: 100%;
              text-align: center;
              background-color: black;
              border: none;
              resize: none;
              padding: 0.25em 0;
            "
            :style="{
              color:
                showsubTools &&
                currentTab == 1 &&
                startNum <= sentenceIndex &&
                sentenceIndex <= endNum &&
                originLine == 2
                  ? 'yellow'
                  : 'white',
            }"
          ></textarea>
          <textarea
            v-show="!isEmpty && isShowLine3"
            id="editArea3"
            @touchmove="touchMoveF"
            @mousedown="startDragS"
            @mouseup="endDragS"
            @touchstart="startTouchS"
            @touchend="endTouchS"
            @blur="note = noteTemp"
            rows="2"
            v-model.lazy="noteTemp"
            placeholder="Note Line"
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
              @click="openAlert(2, $t('repeater.confirmDelete'), 'delete')"
              :title="$t('repeater.infoDelete')"
            >
              <i
                style="color: springgreen; font-size: 1.3em"
                class="material-icons"
                >delete</i
              >
            </button>

            <button
              :disabled="lastSentence"
              class="action"
              name="buttons"
              @click="openAlert(2, $t('repeater.confirmMerge'), 'merge')"
              :title="$t('repeater.infoMerge')"
            >
              <i
                style="font-size: 1.3em"
                :style="{
                  color: lastSentence ? 'grey' : 'springgreen',
                }"
                class="material-icons"
                >merge</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click="openAlert(2, $t('repeater.confirmSplit'), 'split')"
              :title="$t('repeater.infoSplit')"
            >
              <i
                style="color: springgreen; font-size: 1.3em"
                class="material-icons"
                >call_split</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click="openAlert(2, $t('repeater.confirmAdd'), 'add')"
              :title="$t('repeater.infoAdd')"
            >
              <i
                style="color: springgreen; font-size: 1.3em"
                class="material-icons"
                >alt_route</i
              >
            </button>

            <button
              v-if="isEditSubandNotes"
              :disabled="fakeAudio"
              class="action"
              name="buttons"
              @click="onSubtools1"
              :title="$t('repeater.tsc15')"
            >
              <i
                style="font-size: 1.3em"
                :style="{
                  color: this.showsubTools1
                    ? 'red'
                    : this.fakeAudio
                    ? '#bbbaba'
                    : 'springgreen',
                }"
                class="material-icons"
                >transcribe</i
              >
            </button>

            <button
              v-if="isEditSubandNotes"
              class="action"
              name="buttons"
              @click="onSubtools"
              :title="$t('repeater.subTools')"
            >
              <i
                style="font-size: 1.3em"
                :style="{
                  color: this.showsubTools ? 'red' : 'springgreen',
                }"
                class="material-icons"
                >autofps_select</i
              >
            </button>
          </p>
        </span>

        <div
          v-if="isMediaType > 0 && srtSubtitles && !isEmpty && !isFullScreen"
          @mousedown.self="startDragS"
          @mouseup.self="endDragS"
          @touchstart.self="startTouchS"
          @touchmove.prevent
          @touchend.self="endTouchS"
        >
          <button
            v-if="(showSpell || showCloze) && isDictation && !isEditSubandNotes"
            class="action"
            name="buttons"
            @click="undoLastStep"
            :disabled="showSpell && (!historyStack.length || isCorrect)"
            :title="$t('repeater.undo')"
          >
            <i
              style="
                color: springgreen;
                padding: 0 0.5em 0.5em 0.5em;
                font-size: 1.2em;
              "
              class="material-icons"
              >replay</i
            >
          </button>
          <button
            v-if="isEditSubandNotes"
            :disabled="loading || historyIndex < 1 || undoAlert"
            class="action"
            name="buttons"
            @click="changeUndo"
            :title="$t('repeater.undo')"
          >
            <i
              :style="{
                color:
                  loading || historyIndex < 1
                    ? 'grey'
                    : undoAlert
                    ? 'yellow'
                    : 'springgreen',
              }"
              style="font-size: 1.3em; padding: 0 0 0.5em 0"
              class="material-icons"
              >undo</i
            >
          </button>

          <button
            v-if="isFav"
            class="action"
            name="buttons"
            @click="switchIsFav"
            :title="$t('repeater.fav')"
          >
            <i
              style="
                color: yellow;
                padding: 0 0.5em 0.5em 0.5em;
                font-size: 1.2em;
              "
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
              style="
                color: #464633;
                padding: 0 0.5em 0.5em 0.5em;
                font-size: 1.2em;
              "
              class="material-icons"
              >star_outline</i
            >
          </button>

          <button
            v-if="isEditSubandNotes"
            :disabled="loading || historyIndex >= changeNew.length || redoAlert"
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
                    : redoAlert
                    ? 'yellow'
                    : 'springgreen',
              }"
              style="font-size: 1.3em; padding: 0 0 0.5em 0"
              class="material-icons"
              >redo</i
            >
          </button>
          <button
            v-if="(showSpell || showCloze) && isDictation && !isEditSubandNotes"
            class="action"
            name="buttons"
            @click="resetSpelling"
            :title="$t('repeater.redo')"
          >
            <i
              style="
                color: springgreen;
                padding: 0 0.5em 0.5em 0.5em;
                font-size: 1.2em;
              "
              class="material-icons"
              >restart_alt</i
            >
          </button>
        </div>

        <div
          @mousedown="startDrag"
          @mouseup="endDrag"
          @touchstart="startTouch"
          @touchend="endTouch"
          v-if="srtSubtitles && !isFullScreen"
          style="width: 100%; flex-grow: 1"
        ></div>
        <div
          v-if="srtSubtitles && isFullScreen"
          style="width: 100%; height: 4.5em"
        ></div>

        <div v-show="isWaveSurfer && isEditSubandNotes">
          <p style="margin-bottom: 2px">
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
            @contextmenu.prevent
            style="background-color: #ffffffdb"
          ></div>
        </div>
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
        <p v-if="isMobile" style="color: blue; font-size: 0.9em; margin: 0em">
          {{ $t("repeater.showWaveformInfo2") }}
        </p>
        <p v-if="!isMobile" style="color: blue; font-size: 0.9em; margin: 0em">
          {{ $t("repeater.showWaveformInfo3") }}
        </p>
      </div>

      <audio
        style="
          position: fixed;
          bottom: 10%;
          width: 85%;
          left: 0;
          right: 0;
          margin: auto;
          z-index: 1005;
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
        v-if="showEditNew"
        :disabled="loading || isSetting || !isSingle"
        style="z-index: 1008; position: fixed; right: 1em; text-align: right"
        :style="{
          width: isMobile ? '18em' : '45%',
          bottom: isWaveSurfer
            ? '6.5em'
            : isFullScreen && !isSingle
            ? '5.5em'
            : '2.5em',
        }"
      >
        <div
          v-if="showEditNew"
          id="showEditNew"
          style="border-radius: 10px; background: grey; padding: 0.3em"
        >
          <p style="display: flex; align-items: center; color: white">
            <span>New Word:&nbsp;&nbsp;</span>
            <input
              style="padding: 0.2em; flex-grow: 1; margin-right: 0.2em"
              class="input input--repeater"
              type="text"
              v-model.lazy="newWord"
              placeholder="New Word"
            />
            <button
              class="action"
              @click="clickWord()"
              :title="$t('repeater.word1')"
            >
              <i
                style="color: blue; width: 1em; padding: 0"
                class="material-icons"
                >play_circle_outline</i
              >
            </button>
          </p>
          <p style="display: flex; align-items: center; color: white">
            <span v-if="!isMobile">Translation:&nbsp;</span>
            <input
              style="flex-grow: 1; padding: 0.2em; margin-right: 0.2em"
              class="input input--repeater"
              type="text"
              placeholder="Translation -Notes"
              v-model="newTranslation"
            />
            <button
              @click="showTransPage"
              style="background: gray; border: 0; padding: 0"
              :title="$t('repeater.word2')"
            >
              <i
                style="color: blue; width: 1em; padding: 0; margin-right: 0.2em"
                class="material-icons"
                >auto_stories</i
              >
            </button>
          </p>
          <p style="display: flex; align-items: center; color: white">
            <span v-if="!isMobile">Note:&nbsp;</span>
            <input
              style="flex-grow: 1; padding: 0.2em; margin-right: 0.2em"
              class="input input--repeater"
              type="text"
              placeholder="mnemonics, fixed collocations, etc."
              v-model="wordNotes"
            />
            <button
              @click="saveWordToSRT"
              style="background: gray; border: 0; padding: 0"
              :title="$t('repeater.word3')"
            >
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
        v-if="(showRetracePlay || showTempSpeed) && !showEditNew"
        :disabled="loading || isSetting"
        style="z-index: 1007; position: fixed; left: 1em"
        :style="{
          bottom: isWaveSurfer
            ? '6.5em'
            : isFullScreen && !isSingle
            ? '5.5em'
            : '2.5em',
        }"
      >
        <button
          v-if="showRetracePlay"
          class="action"
          @click="retracePlay"
          @dblclick.prevent
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
            @dblclick.prevent
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
      <button
        v-if="!isMobile && showArrow"
        @click="checkNav(1000, 'SWITCHIMG')"
        style="
          z-index: 1007;
          position: fixed;
          left: 1em;
          background-color: transparent;
          border: 0;
        "
        :style="{
          top: !isFullScreen && !isSingle ? 'calc( 50% - 4em)' : '50%',
        }"
        @mouseover="hover(1)"
        @mouseleave="hover(2)"
        :title="$t('repeater.previous')"
      >
        <i
          class="material-icons"
          style="font-size: 3em"
          :style="{
            color: hoverNavLeft ? 'white' : '#4f4b4b',
          }"
          >chevron_left</i
        >
      </button>
      <button
        v-if="!isMobile && showArrow"
        @click="checkNav(-1000, 'SWITCHIMG')"
        style="
          z-index: 1007;
          position: fixed;
          right: 1em;
          background-color: transparent;
          border: 0;
        "
        :style="{
          top: !isFullScreen && !isSingle ? 'calc( 50% - 4em)' : '50%',
        }"
        @mouseover="hover(3)"
        @mouseleave="hover(4)"
        :title="$t('repeater.next')"
      >
        <i
          class="material-icons"
          style="font-size: 3em"
          :style="{
            color: hoverNavRight ? 'white' : '#4f4b4b',
          }"
          >chevron_right</i
        >
      </button>
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
import { Howl } from "howler";
import localforage from "localforage";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import CryptoJS from "crypto-js";
import wavEncoder from "wav-encoder";

export default {
  name: "repeater",
  components: {
    HeaderBar,
    Action,
  },
  data: function () {
    return {
      PDJWordListContent: "",
      moreLetters: 0.5,
      prSentences: null,
      prFileName: "PDJ句子英汉互译",
      prAllSelected: true,
      prSelectedIndexes: {},

      prOutput: false,
      ttsName: "",
      swDisplayMode: "always",
      swIsSpeaking: -1,
      wordDataResolver: null,
      showSenWord: false,
      swSentenceData: [],
      wordPhonetic: "",
      listWord: null,
      dictionaryWord: null,
      dictionary: [],
      wordList: [],
      percentage: 30,
      dRead: 2,
      processedItems: [],
      userAnswers: [],
      originalWords: [],
      blankIndices: [],
      processedLetters: [],
      userLetterAnswers: [],
      originalLetters: [],
      blankLetterIndices: [],
      showCloze: false,
      showFeedback: false,
      isSingleWord: false,
      originalValue: "",
      originalItems: [],
      shuffledItems: [],
      currentSpelling: [],
      showGame: false,
      isCorrect: false,
      isSentence: false,
      splitSentenceByLetter: false,
      historyStack: [],
      showDicSetting: false,
      showSpell: false,
      showAlert: false,
      fakeAudio: false,
      lastI: 10000,
      tempFakeAudio: false,
      showFakeAlert: false,
      tempUrl: "",
      tempType: 1,
      fakeStatus: false,
      audioEnded: true,
      keySound: null,
      allowLoadDiction: false,
      typingSound: true,
      downArrow: false,
      readOriginByTTS: false,
      langTranscribe: "en-US",
      recognition1: null,
      isRecordingTrans: false,
      speechRecognitionSupported: false,
      isFromLocal: 1,
      speedTranscribe: 1,
      isProcessing1: false,
      isProcessing2: false,
      transcriptionResult: "",
      sK: "",
      sR: "",
      isDragging: false,
      disableDrag: null,
      deleteNewWord: "",
      selectedReplaceLine: "1,2,3",
      optionsReplace: ["1,2,3", "1", "2"],
      searchIndex: 0,
      rNewWord: "",
      rOldWord: "",
      isSearchReplace: false,
      isCaseSensitive: false,
      quotaUsed: -2,
      accessKeyId: "",
      accessKeySecret: "",
      endpointAli: "https://mt.cn-hangzhou.aliyuncs.com",
      endpointAzure: "",
      isOriginalLine1: 1,
      tempIndex: 0,
      isCustomFont: false,
      customCss1: "",
      customCss2: "",
      allowVideoFullScreen:
        window.localStorage.getItem("allowVideoFullScreen") == "true" || false,
      alertVisible: false,
      alertMessage: "",
      clickTimer: null,
      inSubProcess: false,
      showsubTools: false,
      showsubTools1: false,
      currentTab: 1,
      selectedOption: null,
      optionsEdit: [
        this.$t("repeater.tool1"),
        this.$t("repeater.tool2"),
        this.$t("repeater.tool3"),
        this.$t("repeater.tool4"),
        this.$t("repeater.tool5"),
        this.$t("repeater.tool6"),
        this.$t("repeater.tool7"),
        this.$t("repeater.tool8"),
        this.$t("repeater.tool9"),
        this.$t("repeater.tool10"),
      ],
      textToTranslate: "",
      targetLanguage: "aa",
      originTargetLanguage: "bb",
      translatedText: "",
      startNum: 1,
      endNum: 1,
      originLine: 0,
      apiKey: "",
      region: "",
      ttsWrong: false,
      translatorUrl: "ali-translator:default",
      hoverNavLeft: false,
      hoverNavRight: false,
      showModal: false,
      options: [
        this.$t("repeater.option1"),
        this.$t("repeater.option2"),
        this.$t("repeater.option3"),
        this.$t("repeater.option4"),
        this.$t("repeater.option5"),
        this.$t("repeater.option6"),
        this.$t("repeater.option7"),
        this.$t("repeater.option8"),
      ],
      onRecPlay: false,
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
      showArrow: false,
      showRetracePlay: false,
      normalSpeed: 1,
      onTempSpeed: false,
      tempSpeed: 0.5,
      showTempSpeed: false,
      isCheck: true,
      dictationContent: "",
      dictationArray: [],
      fromClick: true,
      hasConfirmed: false,
      moveAll1: 0,
      moveAll2: 0,
      shrinkAll: 1,
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
      timeOutId4: null,
      timeOutId5: null,
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
      timeStampChangeStart:
        Number(window.localStorage.getItem("timeStampChangeStart")) || 0,
      timeStampChangeEnd:
        Number(window.localStorage.getItem("timeStampChangeEnd")) || 0,
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
      langInOriginLine: "en-US",
      langInOriginLinedefault: "en-US",
      langInTransLine: navigator.language || navigator.userLanguage,
      langInTransLinedefault: navigator.language || navigator.userLanguage,
      lineNumOfTrans: 2,
      lineNumOfOrigin: 1,
      isAutoDetectLang: true,
      touches: 0,
      isPauseAfterFirstDone: false,
      pauseAfterFirstDone: false,
      browserHiJack: window.localStorage.getItem("isBrowserHiJack"),
      resized: false,
      isFirstClick: true,
      hasSpeechSynthesis:
        !!window.speechSynthesis || "speechSynthesis" in window,
      utterThis: null,
      isPlayFullFavList: false,
      autoCloseCheck: true,
      autoRealCheck: true,
      ignoreC: true,
      audio: null,
      isSystemTTS: "Yes",
      note: "     ",
      noteTemp: "     ",
      confirmType: "",
      showSubtitleList: false,
      showNewWordList: false,
      sessionLength: null,
      isSlowInternet: false,
      isEditSubandNotes: false,
      isDictation: false,
      subFirstLine: "     ",
      subFirstLineTemp: "     ",
      startTimeTemp: 0,
      endTimeTemp: 0,
      subSecLine: "     ",
      subSecLineTemp: "     ",
      firstMount: true,
      numOfKeys: 0,
      playFromCache: false,
      reader: 0,
      readerO: 0,
      showEditNew: false,
      newWord: "",
      newTranslation: "",
      wordNotes: "",
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
      redoAlert: false,
      undoAlert: false,
      fetchCount: 0,
      today: new Date().toLocaleDateString("af").replaceAll("/", "-"),
      isSwitching: false,
      isPrivate: "Yes",
      hasPrivate: true,
      defaultWaveSurfer: true,
      transUrl: "https://fanyi.baidu.com/#auto/auto/",
      ctrlPressed: false,
      altPressed: false,
      dubbingMode: false,
      showWaveformInfo: false,
      localPeaks: [],
      transcribeUrl: "defaultkey1,eastasia",
      TTSurl: "azure-tts:defaultkey1,eastasia,en-US-GuyNeural",
      TTSurlO: "azure-tts:defaultkey1,eastasia,en-US-GuyNeural",
    };
  },

  computed: {
    ...mapState(["req", "user", "oldReq", "jwt", "loading"]),

    readLang() {
      if (this.dRead == 1) return "朗读译文";
      if (this.dRead == 2) return "朗读原文";
      if (this.dRead == 3) return "复读";
      else return "静音";
    },

    prSelectedSentences() {
      return this.prSentences.filter(
        (sentence, index) => this.prSelectedIndexes[index]
      );
    },
    isPinyin() {
      return this.srtSubtitles[0].content.split("\r\n")[0].startsWith("PinYin");
    },
    fromLocal() {
      if (this.isFromLocal == 0) return this.$t("repeater.subTranscribe00");
      else return this.$t("repeater.subTranscribe01");
    },

    inputSentence() {
      if (!this.showCloze) return null;
      else
        return this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfOrigin - 1
        ];
    },

    inputWord() {
      if (
        !this.showSpell ||
        !this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfOrigin - 1
        ]
      )
        return null;
      else
        return this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfOrigin - 1
        ];
    },

    oldTextHighLight() {
      let contentAll =
        this.originLine == 1 ? this.subFirstLine : this.subSecLine;
      if (!contentAll) return;
      const contentDictation = this.transcriptionResult;
      if (contentDictation == "" || contentDictation.includes("error:")) {
        return contentAll;
      }

      const highlightWords = contentDictation.split(" ");
      highlightWords.forEach((word) => {
        const processedWord = word;
        if (processedWord.trim() !== "") {
          const processLine = (line) => {
            const temp = ` ${line}`;
            const searchWord = word;
            let highlight = searchWord;
            return temp.replace(` ${highlight}`, ` #@${highlight}@#`).trim();
          };
          contentAll = processLine(contentAll);
        }
      });

      const cleanHighlight = (line) => {
        for (let i = 0; i < 5; i++) {
          line = line.replaceAll("#@#@", "#@").replaceAll("@#@#", "@#");
        }
        return line
          .replaceAll("#@", "<span style='color: blue'>")
          .replaceAll("@#", "</span>");
      };
      contentAll = cleanHighlight(contentAll);
      return contentAll;
    },

    isMobile() {
      return window.innerWidth < 738;
    },

    defaultDictation() {
      if (this.isRecording && this.isFromLocal == 0)
        return this.$t("repeater.dictationDefault2");
      if (this.isRecording && this.isFromLocal == 1)
        return this.$t("repeater.dictationDefault3");
      if (this.isFavOnPlay) return this.$t("repeater.dictationDefault1");
      else return this.$t("repeater.dictationDefault");
    },

    showCasePlaceHolder() {
      if (this.isCaseSensitive) return this.$t("repeater.caseSensitive");
      else return this.$t("repeater.caseInSensitive");
    },

    subtitleStyle1() {
      var content =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
      var contentAll = "";
      if (!this.isCustomFont) {
        contentAll =
          "<p style='font-size:1.5em;color: yellow;text-shadow: 2px 2px 2px #000;text-align: center;margin-top: 0.3em;'>" +
          content +
          "</p>";
      } else {
        contentAll =
          "<p style='text-align: center;margin-top: 0.3em;" +
          this.customCss1 +
          "'>" +
          content +
          "</p>";
      }
      return contentAll;
    },
    subtitleStyle2() {
      var content =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
      var contentAll = "";
      if (!this.isCustomFont) {
        contentAll =
          "<p style='font-size:1.5em;color: yellow;text-shadow: 2px 2px 2px #000;text-align: center;margin-top: 0.3em;'>" +
          content +
          "</p>";
      } else {
        contentAll =
          "<p style='text-align: center;margin-top: 0.3em;" +
          this.customCss2 +
          "'>" +
          content +
          "</p>";
      }
      return contentAll;
    },

    isFullScreen() {
      return (
        this.allowVideoFullScreen &&
        this.isLandscape &&
        this.isMediaType == 2 &&
        this.srtSubtitles &&
        !this.isEditSubandNotes &&
        !this.isDictation
      );
    },

    favNotUpload() {
      return this.user.username + "favNotUpload";
    },

    favFileName() {
      return "/!PDJ/user-" + this.user.username + "/PDJ-Repeater.txt";
    },

    key1() {
      return this.getValue2(2)[0];
    },

    targetLine() {
      if (this.originLine < 1.5) return 2;
      else return 1;
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

    tokenFromServer() {
      return this.req.url;
    },
    lastSentence() {
      return this.sentenceIndex == this.srtSubtitles.length;
    },

    favListStatus() {
      if (this.isSetting || !this.isSingle || this.showRevision)
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

    totalReadersO() {
      if (this.hasSpeechSynthesis) {
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.langInOriginLine.substring(0, 3) +
          this.langInOriginLine.substring(3).toUpperCase();
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

    playMode() {
      if (
        this.loading ||
        this.isSetting ||
        this.showSubtitleList ||
        this.showNewWordList ||
        (this.isEditSubandNotes && !this.playFromCache) ||
        this.showRevision
      ) {
        return { color: "grey" };
      } else if (this.isEditSubandNotes && this.playFromCache) {
        return { color: "pink" };
      } else if (this.playFromCache) {
        return { color: "red" };
      } else {
        return { color: "blue" };
      }
    },

    rowsNum() {
      return this.isMobile && !this.isLandscape ? 2 : 1;
    },

    totalBlanks() {
      return this.isSingleWord
        ? this.blankLetterIndices.length
        : this.blankIndices.length;
    },
    correctCount() {
      if (this.isSingleWord) {
        return this.processedLetters.filter(
          (letter) => letter.isChecked && letter.isCorrect
        ).length;
      } else {
        return this.processedItems.filter(
          (item) => item.isChecked && item.isCorrect
        ).length;
      }
    },

    srtSubtitlesO() {
      var formatContent = "";
      if (this.reqF.size == 0)
        formatContent =
          "1\n00:00:01,000 --> 00:00:02,000\nEmpty File. Add sentences in Edit mode, and use TTS to read aloud the original text.";
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
    },

    srtSubtitles() {
      if (!this.isFavOnPlay) {
        return this.srtSubtitlesO;
      } else if (this.isPlayFullFavList) {
        return this.favList;
      } else {
        return this.favList;
      }
    },

    srtSubtitlesLength() {
      return this.srtSubtitles.length;
    },

    srtSubtitlesSearch() {
      if (this.rOldWord == "") return this.srtSubtitles;
      var final;
      if (!this.isCaseSensitive) {
        if (this.selectedReplaceLine.includes("1,2,3"))
          final = this.srtSubtitles.filter((item) =>
            item.content.toLowerCase().includes(this.rOldWord.toLowerCase())
          );
        else if (this.selectedReplaceLine.includes("1")) {
          final = this.srtSubtitles.filter((item) =>
            item.content
              .split("\r\n")[0]
              .toLowerCase()
              .includes(this.rOldWord.toLowerCase())
          );
        } else {
          final = this.srtSubtitles.filter(
            (item) =>
              item.content.split("\r\n")[1] &&
              item.content
                .split("\r\n")[1]
                .toLowerCase()
                .includes(this.rOldWord.toLowerCase())
          );
        }
        return final;
      } else {
        if (this.selectedReplaceLine.includes("1,2,3"))
          final = this.srtSubtitles.filter((item) =>
            item.content.includes(this.rOldWord)
          );
        else if (this.selectedReplaceLine.includes("1")) {
          final = this.srtSubtitles.filter((item) =>
            item.content.split("\r\n")[0].includes(this.rOldWord)
          );
        } else {
          final = this.srtSubtitles.filter(
            (item) =>
              item.content.split("\r\n")[1] &&
              item.content.split("\r\n")[1].includes(this.rOldWord)
          );
        }
        return final;
      }
    },

    cachedKeysArr() {
      let temp = this.cachedKeys.replace(";;", "");
      return temp.split(";;");
    },

    sh() {
      return "ZDMyYzUyMzczMzMxNDMyNzhaMzdiYWI2ZTc5MTZkZmY=".replace(
        "a",
        this.tokenFromServer.charAt(3)
      );
    },
    po() {
      return "YWYyZDRhYTazNDhiNGI3M2I2MDQ4N2M3M2UwZWI0MzE=".replace(
        "a",
        this.tokenFromServer.charAt(2).toUpperCase()
      );
    },
    re() {
      return "OGa3MzM1ZTRjMWNmNDcwOGE0ODQ1M2Y4NzhhNmM4MDI=".replace(
        "a",
        this.tokenFromServer.charAt(2).toUpperCase()
      );
    },

    aa() {
      return "TFRBSTV0QWFoWkQzZ0d1Ta1xb1RvcHYx".replace(
        "a",
        this.tokenFromServer.charAt(4).toUpperCase()
      );
    },
    pm() {
      return "M0dDZDajWXJMOUR0VUV0V2d1b2VuMGVlTlZOVGVoaHdTdTd2V3NlWEp4eXFIdFVlaFhyRkpRUUo5OUJEQUNVTHlDcFhKM3czQUFBYkFDT0d0STVO".replace(
        "a",
        this.tokenFromServer.charAt(1).toUpperCase()
      );
    },
    ab() {
      return "WjA2OGdjY0ZaYkNodU1hSURSY2o5cUp1bkVFTTQy".replace(
        "a",
        this.tokenFromServer.charAt(5)
      );
    },

    at() {
      return "NkRrY3aCN29KUWtoUlBHMEM0NDgzNzdPakNjMGJSRnFyZUJta1hwR2J4TE9Ia3dmWXhzMUpRUUo5OUJEQUMzcEthUlhKM3czQUFBWUFDT0dkaXlZ".replace(
        "a",
        this.tokenFromServer.charAt(3)
      );
    },

    showQuota() {
      if (
        (this.translatorUrl.includes("Ali-translator:default") ||
          this.translatorUrl.includes("ali-translator:default")) &&
        this.showsubTools
      )
        return 2;
      else if (
        this.translatorUrl.includes("ali-translator:") &&
        this.showsubTools
      )
        return 1;
      else return 3;
    },

    action() {
      if (this.translatorUrl.includes("Ali-translator:default")) {
        return "Translate";
      } else return "TranslateGeneral";
    },

    apiName() {
      if (this.translatorUrl.includes("Ali-translator:default")) {
        return "translate_ecommerce";
      } else return "translate_standard";
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
              [j].split("::")[0];

            if (
              this.srtSubtitles[i].content
                .split("\r\n")[2]
                .split("[")
                [j].split("::")[1]
            ) {
              trans = this.srtSubtitles[i].content
                .split("\r\n")[2]
                .split("[")
                [j].split("::")[1]
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
      if (this.fakeAudio) return 1;
      if (this.onRevision) {
        return this.reviseType;
      }
      if (this.listing && this.reqF.name) {
        for (var i = 0; i < this.listing.length; ++i) {
          if (this.listing[i].name == this.reqF.name.replace(".srt", ".mp4")) {
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
    },

    currentMedia() {
      if (this.isMediaType == 1) {
        return document.getElementById("myAudio");
      } else if (this.isMediaType == 2) {
        return document.getElementById("myVideo");
      } else return null;
    },

    currentFileFavList() {
      return this.favList;
    },

    mediaName() {
      if (this.isMediaType == 1) {
        return this.reqF.name.replace(".srt", ".mp3");
      } else if (this.isMediaType == 2) {
        return this.reqF.name.replace(".srt", ".mp4");
      } else {
        return "";
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
      const currentSubtitle = this.srtSubtitles[this.sentenceIndex - 1];
      if (!currentSubtitle || !currentSubtitle.content) {
        return "";
      }
      const [line1, line2] = currentSubtitle.content.split("\r\n");
      let contentLine1 = !this.isEmpty && line1 !== undefined ? line1 : " ";
      let contentLine2 = !this.isEmpty && line2 !== undefined ? line2 : " ";
      let custom1 =
        "font-size:1.5em;color: yellow;text-shadow: 2px 2px 2px #000;text-align: center;";
      let custom2 =
        "font-size:1.5em;color: yellow;text-shadow: 2px 2px 2px #000;text-align: center;";
      if (this.isCustomFont) {
        custom1 = this.customCss1;
        custom2 = this.customCss2;
      }
      let contentAll = " ";
      if (this.isShowLine1 && this.isShowLine2) {
        if (this.isDictation) {
          contentAll = `<p style='margin-top: 0px; color: green'>${contentLine1}</p><p style='color: green'>${contentLine2}</p>`;
        } else {
          contentAll = `<p style='margin-top: 0px;${custom1};!important'>${contentLine1}</p><p style='${custom2};!important'>${contentLine2}</p>`;
        }
      } else if (this.isShowLine1) {
        contentAll = `<p style='margin-top: 0px;${custom1};!important'>${contentLine1}</p>`;
      } else if (this.isShowLine2) {
        contentAll = `<p style='margin-top: 0px;${custom2};!important'>${contentLine2}</p>`;
      }
      if (this.isDictation) {
        const contentDictation = this.dictationContent;
        if (contentDictation === "") {
          return contentAll;
        }

        const highlightWords = contentDictation.split(" ");
        highlightWords.forEach((word) => {
          const processedWord = this.ignoreC
            ? word.replace(/[\p{P}\s]+$/u, "").toLowerCase()
            : word;
          if (processedWord.trim() !== "") {
            const processLine = (line) => {
              const temp = ` ${line}`;
              const searchWord = this.ignoreC ? processedWord : word;
              const tempLower = this.ignoreC ? temp.toLowerCase() : temp;
              let highlight = searchWord;
              if (this.ignoreC && tempLower.includes(` ${searchWord}`)) {
                const part1 = tempLower.split(` ${searchWord}`)[0];
                const part3 = tempLower.replace(part1 + ` ${searchWord}`, "");
                if (part3 === "") {
                  highlight = temp.slice(part1.length + 1);
                } else {
                  highlight = temp.slice(part1.length + 1, -part3.length);
                }
              }
              return temp.replace(` ${highlight}`, ` #@${highlight}@#`).trim();
            };
            contentLine1 = processLine(contentLine1);
            contentLine2 = processLine(contentLine2);
          }
        });

        const cleanHighlight = (line) => {
          for (let i = 0; i < 5; i++) {
            line = line.replaceAll("#@#@", "#@").replaceAll("@#@#", "@#");
          }
          return line
            .replaceAll("#@", "<span style='color: green'>")
            .replaceAll("@#", "</span>");
        };
        contentLine1 = cleanHighlight(contentLine1);
        contentLine2 = cleanHighlight(contentLine2);

        contentAll = `<p style='margin-top: 0px; color: yellow'>${contentLine1}</p><p style='color: yellow'>${contentLine2}</p>`;
      } else if (
        currentSubtitle.content.split("\r\n")[2] &&
        currentSubtitle.content.split("\r\n")[2].includes("[")
      ) {
        const parts = currentSubtitle.content.split("\r\n")[2].split("[");
        parts.slice(1).forEach((part) => {
          const highLightWord = part.includes(":")
            ? part.split("::")[0]
            : part.split("]")[0];
          if (highLightWord.trim() !== "") {
            const escapedB = highLightWord.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );
            const regex = new RegExp(`\\b(${escapedB})`, "ig");
            contentLine1 = contentLine1.replace(regex, "#@$1@#");
            contentLine2 = contentLine2.replace(regex, "#@$1@#");
          }
        });

        const cleanHighlight = (line) => {
          for (let i = 0; i < 5; i++) {
            line = line.replaceAll("#@#@", "#@").replaceAll("@#@#", "@#");
          }
          return line
            .replaceAll("#@", "<span style='color: red'>")
            .replaceAll("@#", "</span>");
        };
        contentLine1 = cleanHighlight(contentLine1);
        contentLine2 = cleanHighlight(contentLine2);

        if (this.isShowLine1 && this.isShowLine2) {
          contentAll = `<p style='margin-top: 0px;${custom1};!important'>${contentLine1}</p><p style='${custom2};!important'>${contentLine2}</p>`;
        } else if (this.isShowLine1) {
          contentAll = `<p style='margin-top: 0px;${custom1};!important'>${contentLine1}</p>`;
        } else if (this.isShowLine2) {
          contentAll = `<p style='margin-top: 0px;${custom2};!important'>${contentLine2}</p>`;
        }
      }

      return contentAll;
    },

    fakeAudioUrl() {
      let urla = api.getDownloadURL(this.req, true);
      let rawUrl = urla.split("/api/")[0] + "/static/blank2h.mp3";
      return rawUrl;
    },

    isRight() {
      if (this.dictationContent !== "" && this.isDictation) {
        if (
          !this.ignoreC &&
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")
            [this.lineNumOfOrigin - 1].startsWith(this.dictationContent)
        )
          return true;
        if (
          this.ignoreC &&
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")
            [this.lineNumOfOrigin - 1].replace(/[\p{P}]+/gu, "")
            .toLowerCase()
            .startsWith(
              this.dictationContent.replace(/[\p{P}]+/gu, "").toLowerCase()
            )
        )
          return true;
        else return false;
      } else return false;
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

    canUtterO() {
      let hasContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfOrigin - 1
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

    srtSubtitlesO: {
      handler(newVal) {
        this.favList = newVal.filter((item) => {
          return item?.content?.includes("[star];");
        });
      },
      deep: true,
      immediate: true,
    },

    prOutput() {
      if (this.prOutput) {
        this.prSentences = this.srtSubtitles;
        this.prToggleSelectAll();
      }
    },

    prSelectedIndexes: {
      handler(newPrSelectedIndexes) {
        const selectedCount =
          Object.values(newPrSelectedIndexes).filter(Boolean).length;
        this.prAllSelected = selectedCount === this.prSentences.length;
      },
      deep: true,
    },

    splitSentenceByLetter() {
      this.splitInput();
    },

    inputWord() {
      if (this.inputWord && this.inputWord.trim() !== "") this.splitInput();
    },

    inputSentence() {
      if (this.inputSentence && this.inputSentence.trim() !== "")
        this.generateCloze();
    },

    isFromLocal() {
      this.transcriptionResult = "";
      this.save();
    },

    transcriptionResult() {
      if (
        this.isEditSubandNotes &&
        !this.isProcessing1 &&
        !this.isProcessing2
      ) {
        let newText = document.getElementById("newText");
        newText.style.height = newText.scrollHeight + "px";
      } else if (!this.isEditSubandNotes && this.isDictation) {
        this.dictationContent = this.transcriptionResult;
      }
    },

    showsubTools1() {
      if (this.showsubTools1) this.initSpeechRecognition();
      else {
        if (this.recognition1 && this.isRecordingTrans) {
          this.recognition1.stop();
        }
      }
    },
    altPressed() {
      if (this.regions && this.altPressed && !this.isMobile) {
        this.toDisableDrag();
        this.disableDrag = this.regions.enableDragSelection({
          color: "rgba(0, 0, 0, 0.1)",
        });
      }
      //should not disableDrag here if !altPressed
    },

    allowVideoFullScreen() {
      window.localStorage.setItem(
        "allowVideoFullScreen",
        this.allowVideoFullScreen
      );
    },

    showsubTools() {
      if (!this.showsubTools) {
        this.inSubProcess = false;
      } else {
        if (this.translatorUrl.includes("li-translator:"))
          this.getTranslateReport();
      }
    },

    originLine: function () {
      this.originLine = Math.floor(this.originLine);
      if (this.originLine < 1) this.originLine = 1;
      else if (this.originLine > 2) this.originLine = 2;
    },

    translatorUrl() {
      this.translatorUrl = this.translatorUrl.replaceAll(" ", "");
      if (this.translatorUrl.trim() == "")
        this.translatorUrl = "ali-translator:default";
      this.save();
    },

    targetLanguage() {
      this.save();
    },

    isCustomFont() {
      this.save();
    },

    customCss1() {
      this.save();
    },

    customCss2() {
      this.save();
    },

    startNum: function () {
      if (this.startNum > this.endNum) {
        this.endNum = this.startNum;
      }
      if (this.startNum < 1) {
        this.startNum = 1;
      }
      if (this.startNum > this.srtSubtitles.length) {
        this.startNum = this.srtSubtitles.length;
      }
    },
    endNum: function () {
      if (this.endNum < this.startNum) {
        this.startNum = this.endNum;
      }
      if (this.endNum > this.srtSubtitles.length) {
        this.endNum = this.srtSubtitles.length;
      }
      if (this.endNum < 1) {
        this.endNum = 1;
      }
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

    readOriginByTTS: function () {
      this.save();
    },

    newWord: function () {
      if (this.newWord.trim() == "") return; //This one is important to save too many requests, can't be ignored.
      if (!this.showSenWord) this.cleanUp1();
      if (this.showEditNew || this.showSenWord) {
        this.getOriginLang();
        this.newTranslation = "";
        this.newWord = this.newWord.replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
        this.listWord = null;
        if (this.wordList.length > 0) {
          this.listWord = this.findWord(this.wordList, this.newWord);
        }
        if (this.listWord) {
          this.newTranslation = this.listWord.partOfSpeech;
          this.wordNotes = this.listWord.wordNote;
          this.wordPhonetic = this.listWord.pronunciation.split(" ")[1];
          this.getPromise();
        } else {
          this.wordNotes = "";
          this.dictionaryWord = null;
          this.dictionaryWord = this.findWord(this.dictionary, this.newWord);
          if (this.dictionaryWord) {
            this.newTranslation = this.dictionaryWord.partOfSpeech;
            this.wordPhonetic = this.dictionaryWord.pronunciation.split(" ")[1];
            this.getPromise();
          } else {
            this.wordPhonetic = "";
            if (window.localStorage.getItem("word" + this.newWord)) {
              this.newTranslation = window.localStorage.getItem(
                "word" + this.newWord
              );
              this.getPromise();
            } else {
              this.newTranslation = "";
              if (this.translatorUrl.includes("zure-translator"))
                this.azureTranslate();
              else this.aliTranslate(2);
            }
          }
        }
      }
      if (!(this.showSenWord && !this.showEditNew)) this.clickWord();
    },

    showEditNew: function () {
      if (!this.showEditNew) this.newWord = "";
    },

    fakeAudio: function () {
      if (this.fakeAudio) {
        if (!this.isFavOnPlay || !this.onRevision || !this.showRevision) {
          this.showFakeAlert = true;
          setTimeout(() => {
            this.showFakeAlert = false;
          }, 3000);
        }
      }
    },

    isEditSubandNotes: function () {
      if (!this.isEditSubandNotes) {
        this.isWaveSurfer = false;
        this.moveAll1 = 0;
        this.moveAll2 = 0;
        this.shrinkAll = 1;
      } else {
        if (this.startNum == this.endNum) {
          this.startNum = this.sentenceIndex;
          this.endNum = this.sentenceIndex;
        }
        this.originLine = this.lineNumOfTrans == 1 ? 2 : 1;
        if (this.targetLanguage == "aa") {
          this.targetLanguage = this.langInTransLine.replace(/-[^-]*$/, "");
        }
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
      this.closeAllParts();
      if (this.isFavOnPlay) this.dictationContent = "";
      else this.handleIsDictation();
      if (this.isDictation) {
        setTimeout(() => {
          this.$refs.targetTextArea.focus();
        }, 10);

        this.initSpeechRecognition();
        let urla = api.getDownloadURL(this.req, true);
        let typeUrl = urla.split("/api/")[0] + "/static/type.mp3";
        this.keySound = new Howl({
          src: [typeUrl],
          volume: 0.5, //0-1
          preload: true,
        });
        document.addEventListener("keydown", this.handleKeyPress);
      } else {
        if (this.recognition1 && this.isRecordingTrans) {
          this.recognition1.stop();
        }
        document.removeEventListener("keydown", this.handleKeyPress);
        if (this.keySound) {
          this.keySound.unload();
        }
      }
    },
    dictationContent: function () {
      if (this.isFavOnPlay) return;
      if (this.dictationContent.trim() !== "") {
        let filteredArray = this.dictationArray.filter(
          (item) => item.id !== this.sentenceIndex
        );
        let newItem = {
          id: this.sentenceIndex,
          con: this.dictationContent,
        };
        filteredArray.push(newItem);
        window.localStorage.setItem(
          this.mediaName + this.user.username + "dictation",
          JSON.stringify(filteredArray)
        );
        this.dictationArray = filteredArray;
      } else {
        let filteredArray = this.dictationArray.filter(
          (item) => item.id !== this.sentenceIndex
        );
        window.localStorage.setItem(
          this.mediaName + this.user.username + "dictation",
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
    isMediaType: function () {
      if (this.isMediaType == 0) {
        this.raw = this.fakeAudioUrl;
        this.isMediaType = 1;
        this.fakeAudio = true;
      }
    },

    mediaName: function () {
      if (this.isMediaType !== -1) {
        this.checkDownload();
        this.getNewWordList();
        if (
          !window.localStorage.getItem(this.mediaName) &&
          !(this.isFavOnPlay && this.isPlayFullFavList)
        )
          window.localStorage.setItem(this.mediaName, this.reqF.content);
        this.getCacheMedia();
        if (this.translatorUrl.includes("li-translator:"))
          this.getTranslateReport();
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
      if (
        String(this.startTimeTemp).split(".")[1] &&
        String(this.startTimeTemp).split(".")[1].length !== 3
      ) {
        this.startTimeTemp = parseFloat(this.startTimeTemp.toFixed(3));
      }
      this.notFromStarttimeTempChg = false;
      this.onEdit = true;
      this.saveSub1();
      if (
        !this.hasMoveAll &&
        this.isWaveSurfer &&
        this.regions &&
        this.regions.getRegions()[this.sentenceIndex - 1] &&
        this.sentenceIndex <= this.lastI
      ) {
        this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
          start: this.startTimeTemp,
          end: this.endTimeTemp - 0.03,
        });
        if (this.sentenceIndex > 1 && !this.altPressed)
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
      if (
        String(this.endTimeTemp).split(".")[1] &&
        String(this.endTimeTemp).split(".")[1].length !== 3
      ) {
        this.endTimeTemp = parseFloat(this.endTimeTemp.toFixed(3));
      }
      this.onEdit = true;
      this.saveSub2();
      if (
        this.isWaveSurfer &&
        this.regions &&
        this.regions.getRegions()[this.sentenceIndex - 1] &&
        this.sentenceIndex <= this.lastI
      ) {
        this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
          start: this.startTimeTemp,
          end: this.endTimeTemp - 0.03,
        });
        if (
          this.sentenceIndex < Math.min(this.srtSubtitles.length, this.lastI) &&
          !this.altPressed
        )
          this.regions.getRegions()[this.sentenceIndex].setOptions({
            start: this.srtSubtitles[this.sentenceIndex].startTime,
          });
      }
    },

    subFirstLine: function () {
      if (this.subFirstLineTemp !== this.subFirstLine)
        this.subFirstLineTemp = this.subFirstLine;
      if (this.subFirstLine?.trim() == "") this.subFirstLine = "";
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    subSecLine: function () {
      if (this.subSecLineTemp !== this.subSecLine)
        this.subSecLineTemp = this.subSecLine;
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    note: function () {
      if (this.noteTemp !== this.note) this.noteTemp = this.note;
      if (this.isSwitching) return;
      this.onEdit = true;
      this.saveSub();
    },

    sentenceIndex: function () {
      this.onLoop();
      this.calcFav();
      this.showEditNew = false;
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
          this.srtSubtitles[this.sentenceIndex - 1]?.startTime;
        this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1]?.endTime;
        this.subFirstLine =
          this.srtSubtitles[this.sentenceIndex - 1]?.content.split("\r\n")[0];
        this.subSecLine =
          this.srtSubtitles[this.sentenceIndex - 1]?.content.split("\r\n")[1];
        this.note =
          this.srtSubtitles[this.sentenceIndex - 1]?.content.split("\r\n")[2];
        if (
          this.isWaveSurfer &&
          this.regions &&
          this.regions.getRegions()[this.sentenceIndex - 1] &&
          this.sentenceIndex <= this.lastI
        ) {
          this.regions.getRegions()[this.sentenceIndex - 1].setOptions({
            start: this.startTimeTemp,
            end: this.endTimeTemp - 0.03,
          });
        }
        if (this.startNum == this.endNum) {
          this.startNum = this.sentenceIndex;
          this.endNum = this.sentenceIndex;
        }
      }

      if (
        this.showSubtitleList &&
        this.srtSubtitlesLength == this.srtSubtitlesSearch.length
      ) {
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
          if (tempCon && this.allowLoadDiction)
            this.dictationContent = tempCon.con;
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
        if (
          this.isDictation &&
          !this.showSpell &&
          !this.showCloze &&
          !this.showSenWord
        ) {
          setTimeout(() => {
            this.$refs.targetTextArea.focus();
          }, 10);
        }
      }
      if (this.showSenWord) {
        this.swGetData();
      }
    },

    isSetting: function () {
      if (this.isEditSubandNotes) {
        this.switchEditSubandNote();
        let temp1 = this.isWaveSurfer;
        setTimeout(() => {
          this.switchEditSubandNote();
          this.isWaveSurfer = temp1;
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
      window.localStorage.setItem(
        "timeStampChangeStart",
        this.timeStampChangeStart
      );
    },

    timeStampChangeEnd: function () {
      this.timeStampChangeEnd = Math.floor(this.timeStampChangeEnd);
      window.localStorage.setItem(
        "timeStampChangeEnd",
        this.timeStampChangeEnd
      );
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
      this.TTSurl = this.TTSurl.replaceAll(" ", "");
      this.save();
    },

    TTSurlO: function () {
      this.TTSurlO = this.TTSurlO.replaceAll(" ", "");
      this.save();
    },

    transcribeUrl: function () {
      if (this.transcribeUrl == "") this.transcribeUrl = "defaultkey1,eastasia";
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
      if (!this.isAutoDetectLang) this.save();
    },

    lineNumOfTrans: function () {
      this.lineNumOfTrans = Math.floor(this.lineNumOfTrans);
      if (this.lineNumOfTrans < 1) this.lineNumOfTrans = 1;
      if (this.lineNumOfTrans > 3) this.lineNumOfTrans = 3;
      if (this.isAutoDetectLang && this.lineNumOfOrigin == this.lineNumOfTrans)
        this.lineNumOfOrigin = this.lineNumOfTrans == 1 ? 2 : 1;
      if (!this.isAutoDetectLang) this.save();
    },

    lineNumOfOrigin: function () {
      this.lineNumOfOrigin = Math.floor(this.lineNumOfOrigin);
      if (this.lineNumOfOrigin < 1) this.lineNumOfOrigin = 1;
      if (this.lineNumOfOrigin > 3) this.lineNumOfOrigin = 3;
      if (!this.isAutoDetectLang) this.save();
    },

    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        window.localStorage.removeItem(this.mediaName + "line1");
        window.localStorage.removeItem(this.mediaName + "line2");
        this.langInTransLine = navigator.language || navigator.userLanguage;
        this.detectLangAuto();
        if (this.lineNumOfOrigin == this.lineNumOfTrans) {
          this.lineNumOfOrigin = this.lineNumOfTrans == 1 ? 2 : 1;
        }
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

    autoRealCheck: function () {
      this.save();
    },

    ignoreC: function () {
      this.save();
    },

    allowLoadDiction: function () {
      this.save();
    },

    typingSound: function () {
      this.save();
    },

    showRetracePlay: function () {
      this.save();
    },
    retraceTime: function () {
      this.save();
    },
    showArrow: function () {
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

    readerO() {
      if (this.hasSpeechSynthesis) {
        if (this.readerO < 1) this.readerO = 1;
        this.readerO = Math.floor(this.readerO);
        window.localStorage.setItem("readerO", this.readerO);
      } else this.readerO = 0;
    },

    srtSubtitlesLength: function () {
      if (
        !this.redoAlert &&
        !this.undoAlert &&
        this.wavesurfer &&
        this.regions
      ) {
        this.updateRgns();
      }
    },

    onRevision: function () {
      if (this.onRevision) {
        this.tempReadS = this.readOriginByTTS;
        setTimeout(() => {
          if (Math.round(this.currentMedia.duration) == 6888)
            this.readOriginByTTS = true;
        }, 100);
      } else this.readOriginByTTS = this.tempReadS;
    },

    raw: function () {
      this.isReadyToPlay = false;
      this.playCount = 0;
      this.firstMount = false;
      this.isFirstClick = true;
      if (this.isAutoDetectLang) this.detectLangAuto();
      this.dictationArray = [];
      if (this.isFavOnPlay) this.dictationContent = "";
      else this.handleIsDictation();
      if (this.onRevision || this.showRevision) {
        this.changeOld = [];
        this.changeNew = [];
        this.historyIndex = 0;
        this.tempOldContent = "";
      }

      if (!this.isFavOnPlay && !this.onRevision && !this.showRevision) {
        if (
          !this.onOffline &&
          window.localStorage.getItem(this.srtNotUpload) &&
          window.localStorage.getItem(this.mediaName)
        ) {
          this.openAlert(
            2,
            this.$t("repeater.saveUnsavedSub"),
            "saveUnsavedSub"
          );
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
        "1\n00:00:01,000 --> 00:00:02,000\nEmpty File. Add sentences in Edit mode, and use TTS to read aloud the original text.";
      this.saveSubNow();
    }
    if (this.reqF.content == undefined || this.srtSubtitlesLength == 0) {
      this.openAlert(1, this.$t("repeater.wrongSrt"), "wrongSrt");
    }
    this.reqF.content = this.formatAll(this.reqF.content);
    if (this.onOffline) this.allowCache = true;
    this.getReader();
    this.getDictionary();
    if (!this.checkLocalStorageSpace()) {
      this.openAlert(1, this.$t("repeater.alertSpace"));
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
    toOutput() {
      this.cleanUp1();
      this.cleanUp2();
      this.prOutput = true;
    },
    prToggleSelectAll() {
      const newPrSelectedIndexes = {};
      if (this.prAllSelected) {
        this.prSentences.forEach((sentence, index) => {
          newPrSelectedIndexes[index] = true;
        });
      }
      this.prSelectedIndexes = newPrSelectedIndexes;
    },

    prGenerateHTML() {
      if (this.prSelectedSentences.length === 0) {
        alert("请至少选择一个句子");
        return;
      }

      const htmlContent = this.prCreateHTMLTable();
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this.prFileName}.html`;
      a.click();
      URL.revokeObjectURL(url);
    },

    prPrintDirectly() {
      if (this.prSelectedSentences.length === 0) {
        alert("请至少选择一个句子");
        return;
      }

      const htmlContent = this.prCreateHTMLTable();
      const printWindow = window.open("", "_blank");
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    },

    prCreateHTMLTable() {
      const rowsPerPage = 30;
      const totalSheets = Math.ceil(
        this.prSelectedSentences.length / rowsPerPage
      );
      let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.prFileName}</title>
    <style>
        @page {
            size: A4 portrait; /* A4竖向排版 */
            margin: 0 1.5cm;
        }
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            font-size: 12px;
        }
        .prPage {
            page-break-after: always;
            margin-bottom: 20px;
        }
        .prPage:last-child {
            page-break-after: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
        }
        th, td {
            border: 1px solid #000;
            padding: 0 8px;
            text-align: left;
            height: 32px;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        .prRowNumber {
            text-align: center;
            width: 40px;
        }
        .prEnglishCell {
            width: 388px;
            font-size: 1em;
        }
        .prChineseCell {
            width: 388px;
            font-size: 1em;
        }
        .prCheckboxCell {
            text-align: center;
            width: 40px
        }

        @media print {
            body {
                padding: 0;
            }
            .prPage {
                margin: 0;
            }
            @page {
              margin-top: 15mm; /* 上页边距（mm单位更适合打印） */
              margin-bottom: 15mm; /* 下页边距 */
            }
        }
    </style>
</head>
<body>
    `;

      for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
        html += `<div class="prPage">`;
        html += `<table>`;
        const startIndex = sheetIndex * rowsPerPage;
        const endIndex = Math.min(
          startIndex + rowsPerPage,
          this.prSelectedSentences.length
        );

        for (let i = startIndex; i < endIndex; i++) {
          const sentence = this.prSelectedSentences[i];
          html += `<tr>`;
          html += `<td class="prRowNumber">${i + 1}</td>`;
          html += `<td class="prEnglishCell">${
            sentence.content.split("\r\n")[this.lineNumOfOrigin - 1]
          }</td>`;
          html += `<td class="prChineseCell">${
            sentence.content.split("\r\n")[this.lineNumOfTrans - 1]
          }</td>`;
          html += `<td class="prCheckboxCell">□</td>`;
          html += `</tr>`;
        }

        html += `</table></div>`;
      }

      html += `</body></html>`;
      return html;
    },

    readSenWord(x, y) {
      this.cleanUp1();
      this.cleanUp2();
      this.showEditNew = false;
      this.newWord = x.replace(/\[.*?\]/g, "");
      if (y != 1) this.clickWord();
      else this.clickTrans();
      setTimeout(() => {
        this.newWord = "";
      }, 500);
    },
    switchSenData() {
      this.closeAllParts();
      this.showSenWord = !this.showSenWord;
      if (this.showSenWord) this.swGetData();
    },
    swToggleDisplayMode() {
      this.swDisplayMode = this.swDisplayMode === "always" ? "hover" : "always";
      this.swIsSpeaking = -1;
      this.swSentenceData.forEach((swWord) => {
        swWord.swHover = false;
      });
    },

    getPromise() {
      if (this.wordDataResolver) {
        this.wordDataResolver({
          phonetic: this.wordPhonetic,
          definition: this.newTranslation,
        });
        this.wordDataResolver = null;
      }
    },
    swGetData() {
      this.swSentenceData = this.swGetSentenceDataInit();
      setTimeout(() => {
        this.getRealData();
      }, 10);
    },
    async getRealData() {
      this.swSentenceData = await this.swGetSentenceData();
    },

    swGetSentenceDataInit() {
      let swWordArray = this.srtSubtitles[this.sentenceIndex - 1].content
        .split("\r\n")
        [this.lineNumOfOrigin - 1].split(" ");
      let swWordList = [];
      for (let i = 0; i < swWordArray.length; ++i) {
        const phonetic = "";
        const definition = "";
        swWordList.push({
          text: swWordArray[i],
          phonetic,
          definition,
          swHover: false,
        });
      }
      return swWordList;
    },

    async swGetSentenceData() {
      let swWordArray = this.srtSubtitles[this.sentenceIndex - 1].content
        .split("\r\n")
        [this.lineNumOfOrigin - 1].split(" ");
      let swWordList = [];
      for (let i = 0; i < swWordArray.length; ++i) {
        this.newWord = swWordArray[i].replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
        const { phonetic, definition } = await new Promise((resolve) => {
          this.wordDataResolver = resolve;
        });
        swWordList.push({
          text: swWordArray[i],
          phonetic,
          definition,
          swHover: false,
        });
      }
      this.newWord = "";
      return swWordList;
    },

    removeFromSpelling(index) {
      if (this.isCorrect) return;
      this.historyStack.push({
        currentSpelling: [...this.currentSpelling],
        shuffledItems: [...this.shuffledItems],
      });
      const item = this.currentSpelling.splice(index, 1)[0];
      this.shuffledItems.push(item);
      this.checkCorrectness();
    },

    switchDRead() {
      this.dRead = this.dRead + 1;
      if (this.dRead >= 5) this.dRead = 1;
    },
    generateCloze() {
      this.reset(false);
      this.showCloze = true;
      this.showFeedback = false;

      const trimmedInput = this.inputSentence.trim();

      this.isSingleWord = this.checkIfSingleWord(trimmedInput);

      if (this.isSingleWord) {
        this.processWord(trimmedInput);
      } else {
        this.processSentence(trimmedInput);
      }
    },

    checkIfSingleWord(input) {
      return (
        !/\s+/.test(input) &&
        /^[a-zA-Z'-]+$/.test(input.replace(/[^a-zA-Z']/g, ""))
      );
    },

    processSentence(sentence) {
      const words = this.tokenizeSentence(sentence);
      this.originalWords = [...words];

      const totalWords = words.filter((word) => this.isWord(word)).length;
      const blankCount = Math.max(
        1,
        Math.round((totalWords * this.percentage) / 100)
      );

      this.selectRandomBlanks(words, blankCount);

      this.processedItems = words.map((word, index) => {
        const isBlank = this.blankIndices.includes(index);
        return {
          text: word,
          isBlank,
          isChecked: false,
          isCorrect: false,
        };
      });

      this.userAnswers = Array(words.length).fill("");
    },

    processWord(word) {
      const letters = word.split("");
      this.originalLetters = [...letters];

      const letterCount = letters.length;
      const blankCount = Math.max(
        1,
        Math.min(
          letterCount - 1,
          Math.round((letterCount * this.percentage) / 100)
        )
      );

      this.selectRandomLetterBlanks(letterCount, blankCount);

      this.processedLetters = letters.map((char, index) => {
        const isBlank = this.blankLetterIndices.includes(index);
        return {
          char,
          isBlank,
          isAnswered: false,
          isCorrect: false,
        };
      });

      this.userLetterAnswers = Array(letters.length).fill("");
    },

    tokenizeSentence(sentence) {
      return sentence.match(/\b\w+\b|[^\w\s]|\s+/g) || [];
    },

    isWord(token) {
      return /\b\w+\b/.test(token) && token.trim() !== "";
    },

    selectRandomBlanks(tokens, count) {
      const wordIndices = [];
      tokens.forEach((token, index) => {
        if (this.isWord(token)) {
          wordIndices.push(index);
        }
      });

      const actualCount = Math.min(count, wordIndices.length);
      const shuffled = [...wordIndices].sort(() => 0.5 - Math.random());
      this.blankIndices = shuffled.slice(0, actualCount);
    },

    selectRandomLetterBlanks(totalLetters, count) {
      const indices = Array.from({ length: totalLetters }, (_, i) => i);
      const shuffled = indices.sort(() => 0.5 - Math.random());
      this.blankLetterIndices = shuffled.slice(0, count);
    },

    checkAnswer(index) {
      const userAnswer = this.userAnswers[index]?.trim().toLowerCase() || "";
      const correctAnswer =
        this.originalWords[index]?.trim().toLowerCase() || "";

      this.processedItems[index].isChecked = true;
      this.processedItems[index].isCorrect = userAnswer === correctAnswer;

      this.checkAllAnswered();
    },

    handleLetterInput(index) {
      const originalCase = this.originalLetters[index];
      let userInput = this.userLetterAnswers[index] || "";

      userInput =
        originalCase === originalCase.toUpperCase()
          ? userInput.toUpperCase()
          : userInput.toLowerCase();

      this.userLetterAnswers[index] = userInput;
    },

    checkLetterAnswer(index) {
      const userInput = this.userLetterAnswers[index] || "";
      this.processedLetters[index].isChecked = true;
      this.processedLetters[index].isCorrect =
        userInput === this.originalLetters[index];
      this.checkAllAnswered();
    },

    checkAllAnswers() {
      if (this.isSingleWord) {
        this.blankLetterIndices.forEach((index) => {
          this.checkLetterAnswer(index);
        });
      } else {
        this.blankIndices.forEach((index) => {
          this.checkAnswer(index);
        });
      }
      this.showFeedback = true;
    },

    checkAllAnswered() {
      let allAnswered = false;

      if (this.isSingleWord) {
        allAnswered = this.blankLetterIndices.every(
          (index) => this.userLetterAnswers[index] !== ""
        );
      } else {
        allAnswered = this.blankIndices.every(
          (index) => this.userAnswers[index] !== ""
        );
      }

      if (allAnswered) {
        this.showFeedback = true;
      }
    },

    reset(clearInput = true) {
      if (clearInput) {
        this.inputSentence = "";
      }
      this.processedItems = [];
      this.userAnswers = [];
      this.originalWords = [];
      this.blankIndices = [];
      this.processedLetters = [];
      this.userLetterAnswers = [];
      this.originalLetters = [];
      this.blankLetterIndices = [];
      this.showCloze = false;
      this.showFeedback = false;
      this.isSingleWord = false;
    },

    splitInput() {
      if (!this.inputWord || this.inputWord.trim() == "") return;

      const processedInput = this.inputWord.trim();
      this.isSentence = processedInput.includes(" ");

      if (this.isSentence && !this.splitSentenceByLetter) {
        this.originalItems = processedInput
          .split(" ")
          .filter((word) => word.trim() !== "");
        if (this.originalItems.length < 2) {
          return;
        }
      } else {
        let processedChars = processedInput;
        if (processedChars.length < 1) {
          return;
        }
        this.originalItems = processedChars.split("");
      }

      this.originalValue =
        this.isSentence && !this.splitSentenceByLetter
          ? this.originalItems.join(" ")
          : this.originalItems.join("");
      this.showGame = true;
      this.resetSpelling();
    },

    addToSpelling(item) {
      if (item && item.trim() !== "") {
        if (this.newWord.trim() == item.trim()) this.clickWord();
        else this.newWord = item.trim();
        setTimeout(() => {
          this.newWord = "";
        }, 500);
      }
      if (this.isCorrect) return;

      this.historyStack.push({
        currentSpelling: [...this.currentSpelling],
        shuffledItems: [...this.shuffledItems],
      });

      const index = this.shuffledItems.indexOf(item);
      if (index !== -1) {
        this.shuffledItems.splice(index, 1);
        this.currentSpelling.push(item);
        this.checkCorrectness();
      }
    },

    undoLastStep() {
      if (this.showSpell) {
        if (!this.historyStack.length) return;

        const lastState = this.historyStack.pop();
        this.currentSpelling = lastState.currentSpelling;
        this.shuffledItems = lastState.shuffledItems;
        this.checkCorrectness();
      } else if (this.showCloze) {
        this.userAnswers = [];
      }
    },

    checkCorrectness() {
      const currentValue =
        this.isSentence && !this.splitSentenceByLetter
          ? this.currentSpelling.join(" ")
          : this.currentSpelling.join("");
      this.isCorrect = currentValue === this.originalValue;
    },

    resetSpelling() {
      if (this.showSpell) {
        this.currentSpelling = [];
        this.isCorrect = false;
        this.shuffledItems = this.shuffleItems([...this.originalItems]);
        let addCount = 0;
        if (!(this.isSentence && !this.splitSentenceByLetter))
          addCount = Math.floor(this.shuffledItems.length * this.moreLetters);
        for (let i = 0; i < addCount; i++) {
          const randomLetter = this.getRandomLetter();
          const insertIndex = Math.floor(
            Math.random() * (this.shuffledItems.length + 1)
          );
          this.shuffledItems.splice(insertIndex, 0, randomLetter);
        }
        this.historyStack = [];
      } else if (this.showCloze) {
        this.generateCloze();
      }
    },

    getRandomLetter() {
      return String.fromCharCode(97 + Math.floor(Math.random() * 26));
    },

    shuffleItems(items) {
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    toDisableDrag() {
      if (!this.isMobile && this.disableDrag) {
        this.disableDrag();
      }
    },

    handleKeyPress(event) {
      if (this.typingSound) {
        const isLetterOrPunctuation = /^[a-zA-Z ,.;:?]$/.test(event.key);
        if (
          isLetterOrPunctuation &&
          !this.showEditNew &&
          document.getElementById("editArea3") &&
          document.getElementById("editArea3").contains(document.activeElement)
        ) {
          this.keySound.play();
        }
      }
    },

    formatTranscriptionResult() {
      this.transcriptionResult = this.transcriptionResult
        .replaceAll(". ", ".")
        .replaceAll(".", ". ");
      this.transcriptionResult = this.transcriptionResult
        .replaceAll(", ", ",")
        .replaceAll(",", ", ");
      this.transcriptionResult = this.transcriptionResult
        .replaceAll("? ", "?")
        .replaceAll("?", "? ");
      this.transcriptionResult = this.transcriptionResult
        .replaceAll("! ", "!")
        .replaceAll("!", "! ");
      this.transcriptionResult = this.transcriptionResult
        .replaceAll("; ", ";")
        .replaceAll(";", "; ");
      if (this.isEditSubandNotes) {
        let newText = document.getElementById("newText");
        newText.style.height = "auto"; // reset height
        setTimeout(() => {
          newText.style.height = newText.scrollHeight + "px";
          let allText = document.getElementById("allText");
          allText.scrollTop = allText.scrollHeight;
        }, 1);
      } else {
        this.transcriptionResult = this.transcriptionResult.trim();
      }
    },

    nextSen() {
      if (this.sentenceIndex < this.srtSubtitles.length) {
        this.sentenceIndex = this.sentenceIndex + 1;
        this.transcriptionResult = "";
      }
    },
    lastSen() {
      if (this.sentenceIndex > 1) {
        this.sentenceIndex = this.sentenceIndex - 1;
        this.transcriptionResult = "";
      }
    },

    transcribe() {
      if (this.isFromLocal == 0) this.startRecognition();
      else {
        setTimeout(() => {
          this.transcribeSegment();
        }, 100);
      }
    },

    playTranscribe() {
      if (this.isFromLocal == 1) this.isProcessing1 = true;
      else this.isProcessing2 = true;
      this.cleanUp1();
      this.cleanUp2();
      const startSecond1 = this.startTimeTemp;
      const endSecond1 = this.endTimeTemp;
      if (this.isProcessing1 && endSecond1 - startSecond1 >= 15) {
        this.openAlert(1, this.$t("repeater.tsc20"));
        this.transcriptionResult = "";
        this.isProcessing1 = false;
        return;
      }

      if (this.isIphone) {
        setTimeout(() => {
          this.currentMedia.play();
        }, 20);
      } else this.currentMedia.play();
      let startA = Math.min(this.currentMedia.duration - 1, startSecond1);
      this.currentMedia.currentTime = startA;
      this.currentMedia.playbackRate = this.speedTranscribe;

      this.intervalId = setInterval(() => {
        if (
          this.currentMedia.currentTime >=
            this.srtSubtitles[this.sentenceIndex - 1].endTime ||
          this.currentMedia.currentTime >= this.currentMedia.duration - 0.5
        ) {
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
          this.currentMedia.pause();
          this.isProcessing1 = false;
          this.isProcessing2 = false;
        }
      }, 100);
    },

    startRecognition() {
      if (!this.speechRecognitionSupported || this.isMobile) {
        this.openAlert(1, this.$t("repeater.tsc16"));
        return;
      }
      if (this.isEditSubandNotes) {
        this.isProcessing2 = true;
        const startSecond = this.startTimeTemp;
        this.currentMedia.play();
        let startA = Math.min(this.currentMedia.duration - 1, startSecond);
        this.currentMedia.currentTime = startA;
        this.currentMedia.playbackRate = this.speedTranscribe;
      }
      this.isRecordingTrans = true;
      this.transcriptionResult = "";
      this.recognition1.start();

      if (this.isEditSubandNotes) {
        this.intervalId = setInterval(() => {
          if (
            this.currentMedia.currentTime >=
              this.srtSubtitles[this.sentenceIndex - 1].endTime ||
            this.currentMedia.currentTime >= this.currentMedia.duration - 0.5
          ) {
            if (this.intervalId) {
              clearInterval(this.intervalId);
            }
            this.stopRecognition();
          }
        }, 100);
      }
    },

    stopRecognition() {
      if (this.currentMedia) this.currentMedia.pause();
      this.isRecordingTrans = false;
      this.recognition1.stop();
      this.isProcessing2 = false;
    },

    initSpeechRecognition() {
      if (
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      ) {
        this.speechRecognitionSupported = true;
      } else return;
      // generate a voice recognition instance
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition1 = new SpeechRecognition();
      // configure parameters
      this.recognition1.continuous = true;
      this.recognition1.interimResults = true;
      this.recognition1.lang = this.langTranscribe;
      //callback
      this.recognition1.onresult = (event) => {
        const transcript = [];
        for (let i = 0; i < event.results.length; i++) {
          transcript.push(event.results[i][0].transcript);
        }
        this.transcriptionResult = transcript.join("");
        this.formatTranscriptionResult();
      };

      this.recognition1.onerror = (event) => {
        if (event.error == "not-allowed")
          this.transcriptionResult =
            "error: not-allowed! " + this.$t("repeater.tsc02");
        else this.transcriptionResult = "error:" + event.error;
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.stopRecognition();
        return;
      };

      this.recognition1.onend = () => {
        if (this.isRecordingTrans) {
          this.recognition1.start();
        }
      };
    },

    async transcribeSegment() {
      this.isProcessing1 = true;
      if (!this.transcribeUrl) this.transcribeUrl = "defaultkey1,eastasia";
      this.transcribeUrl = this.transcribeUrl.toString();
      if (this.transcribeUrl.includes("defaultkey")) {
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
      }
      if (this.isEditSubandNotes)
        this.transcriptionResult = this.$t("repeater.tsc19");
      else this.transcriptionResult = "";
      try {
        let audioBlob = null;
        if (this.isEditSubandNotes) {
          const startSecond = this.startTimeTemp;
          const endSecond = this.endTimeTemp;
          if (endSecond - startSecond >= 15) {
            this.openAlert(1, this.$t("repeater.tsc20"));
            this.transcriptionResult = "";
            this.isProcessing1 = false;
            return;
          }
          // create a virtual video element.
          const virtualVideo = document.createElement("video");
          virtualVideo.style.display = "none";
          virtualVideo.width = 0;
          virtualVideo.height = 0;
          virtualVideo.src = this.raw;
          document.body.appendChild(virtualVideo);
          //extract and transform audio
          audioBlob = await this.extractAudioSegment(virtualVideo, startSecond);
          // destroy the virtual video to disconnect the audioContext.
          virtualVideo.remove();
        } else {
          try {
            const wavBlob = await this.mp3ToWav(this.audioBlob);
            audioBlob = wavBlob;
          } catch (error) {
            console.error("处理音频时出错:", error);
          }
        }
        const result = await this.callAzureSpeechService(audioBlob);
        this.transcriptionResult = result;
        this.formatTranscriptionResult();
      } catch (error) {
        console.error("error:", error);
        this.transcriptionResult = "error:" + error;
      } finally {
        this.isProcessing1 = false;
      }
    },

    mp3ToWav(mp3Blob) {
      function convertAudioBufferToWav(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        let interleaved;
        if (numChannels === 2) {
          interleaved = interleave(
            audioBuffer.getChannelData(0),
            audioBuffer.getChannelData(1)
          );
        } else {
          interleaved = audioBuffer.getChannelData(0);
        }

        const buffer = new ArrayBuffer(44 + interleaved.length * 2);
        const view = new DataView(buffer);

        writeWavFileHeader(view, interleaved.length, numChannels, sampleRate);

        let offset = 44;
        for (let i = 0; i < interleaved.length; i++) {
          const sample = Math.max(-1, Math.min(1, interleaved[i]));
          view.setInt16(
            offset,
            sample < 0 ? sample * 0x8000 : sample * 0x7fff,
            true
          );
          offset += 2;
        }

        return buffer;
      }

      function interleave(left, right) {
        const length = left.length + right.length;
        const result = new Float32Array(length);

        let index = 0;
        let inputIndex = 0;

        while (index < length) {
          result[index++] = left[inputIndex];
          result[index++] = right[inputIndex];
          inputIndex++;
        }

        return result;
      }

      function writeWavFileHeader(view, length, numChannels, sampleRate) {
        view.setUint8(0, "R".charCodeAt(0));
        view.setUint8(1, "I".charCodeAt(0));
        view.setUint8(2, "F".charCodeAt(0));
        view.setUint8(3, "F".charCodeAt(0));

        const fileSize = 36 + length * 2;
        view.setUint32(4, fileSize, true);

        view.setUint8(8, "W".charCodeAt(0));
        view.setUint8(9, "A".charCodeAt(0));
        view.setUint8(10, "V".charCodeAt(0));
        view.setUint8(11, "E".charCodeAt(0));

        view.setUint8(12, "f".charCodeAt(0));
        view.setUint8(13, "m".charCodeAt(0));
        view.setUint8(14, "t".charCodeAt(0));
        view.setUint8(15, " ".charCodeAt(0));

        view.setUint32(16, 16, true);

        view.setUint16(20, 1, true);

        view.setUint16(22, numChannels, true);

        view.setUint32(24, sampleRate, true);

        view.setUint32(28, sampleRate * numChannels * 2, true);

        view.setUint16(32, numChannels * 2, true);

        view.setUint16(34, 16, true);

        view.setUint8(36, "d".charCodeAt(0));
        view.setUint8(37, "a".charCodeAt(0));
        view.setUint8(38, "t".charCodeAt(0));
        view.setUint8(39, "a".charCodeAt(0));

        view.setUint32(40, length * 2, true);
      }

      return new Promise((resolve, reject) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const fileReader = new FileReader();

        fileReader.onload = function () {
          audioContext.decodeAudioData(
            this.result,
            (audioBuffer) => {
              const wavBuffer = convertAudioBufferToWav(audioBuffer);
              const wavBlob = new Blob([wavBuffer], { type: "audio/wav" });
              resolve(wavBlob);
              audioContext.close();
            },
            (error) => {
              audioContext.close();
              reject(new Error(error.message));
            }
          );
        };

        fileReader.onerror = function () {
          reject(new Error(this.error.message));
        };

        fileReader.readAsArrayBuffer(mp3Blob);
      });
    },

    async extractAudioSegment(video, startSecond) {
      return new Promise((resolve, reject) => {
        try {
          const mediaRecorderChunks = [];
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const source = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          source.connect(destination);

          let supportedMimeType = "";
          const mimeTypes = [
            "audio/mp4; codecs=mp4a.40.5",
            "audio/webm;codecs=opus",
            "audio/webm",
            "audio/ogg;codecs=opus",
          ];
          for (const mimeType of mimeTypes) {
            if (MediaRecorder.isTypeSupported(mimeType)) {
              supportedMimeType = mimeType;
              break;
            }
          }
          if (!supportedMimeType) {
            throw new Error("no support mimeType");
          }

          const mediaRecorder = new MediaRecorder(destination.stream, {
            mimeType: supportedMimeType,
          });
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              mediaRecorderChunks.push(event.data);
            }
          };
          mediaRecorder.onstop = async () => {
            try {
              const blob = new Blob(mediaRecorderChunks, {
                type: supportedMimeType,
              });
              const audioBuffer = await this.blobToAudioBuffer(
                blob,
                audioContext
              );
              const resampledBuffer = await this.resampleAudio(
                audioBuffer.getChannelData(0),
                audioBuffer.sampleRate,
                16000
              );
              const wavBlob = await wavEncoder.encode({
                sampleRate: 16000,
                channelData: [resampledBuffer],
                bitDepth: 16,
              });
              resolve(new Blob([wavBlob], { type: "audio/wav" }));
            } catch (e) {
              reject(e);
            }
          };

          video
            .play()
            .then(() => {
              video.currentTime = startSecond;
              video.playbackRate = this.speedTranscribe;
              mediaRecorder.start();

              this.intervalId = setInterval(() => {
                if (
                  video.currentTime >=
                  this.srtSubtitles[this.sentenceIndex - 1].endTime
                ) {
                  if (this.intervalId) {
                    clearInterval(this.intervalId);
                  }
                  video.pause();
                  mediaRecorder.stop();
                }
              }, 100);
            })
            .catch(reject);
        } catch (error) {
          reject(error);
        }
      });
    },

    async blobToAudioBuffer(blob, audioContext) {
      try {
        const arrayBuffer = await blob.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error(error);
        alert("Error: unsupported audio format!");
      }
    },
    // merge the cached audio
    mergeBuffers(buffers) {
      const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
      const result = new Float32Array(totalLength);
      let offset = 0;

      buffers.forEach((buf) => {
        result.set(buf, offset);
        offset += buf.length;
      });

      return result;
    },

    // resample the audio
    async resampleAudio(inputBuffer, inputSampleRate, outputSampleRate) {
      const ratio = outputSampleRate / inputSampleRate;
      const outputLength = Math.floor(inputBuffer.length * ratio);
      const outputBuffer = new Float32Array(outputLength);

      for (let i = 0; i < outputLength; i++) {
        const index = i / ratio;
        const intIndex = Math.floor(index);
        const frac = index - intIndex;

        if (intIndex + 1 < inputBuffer.length) {
          outputBuffer[i] =
            inputBuffer[intIndex] * (1 - frac) +
            inputBuffer[intIndex + 1] * frac;
        } else {
          outputBuffer[i] = inputBuffer[intIndex];
        }
      }

      return outputBuffer;
    },

    async callAzureSpeechService(audioBlob) {
      this.getTranscribeKey();
      // send Blob data to server..........................................................................................
      const response = await fetch(
        `https://${this.sR}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${this.langTranscribe}`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": this.sK,
            "Content-Type": "audio/wav; codec=audio/pcm; samplerate=16000",
            Accept: "application/json", // add Accept header
          },
          body: audioBlob,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Azure API error: ${response.status} - ${errorText}`);
      }
      const result = await response.json();

      if (!result.RecognitionStatus) {
        this.openAlert(1, this.$t("repeater.tsc21"));
        return "";
      } else
        return result.RecognitionStatus === "Success"
          ? result.DisplayText
          : `${result.RecognitionStatus}`;
    },

    handleIsDictation() {
      if (this.isDictation) {
        if (this.dictationArray.length == 0) {
          this.dictationArray =
            JSON.parse(
              window.localStorage.getItem(
                this.mediaName + this.user.username + "dictation"
              )
            ) || [];
        }
        this.dictationContent = "";

        const tempCon = this.dictationArray.find(
          (item) => item.id === this.sentenceIndex
        );
        if (tempCon && this.allowLoadDiction)
          this.dictationContent = tempCon.con;

        this.isShowLine1 = true;
        this.isShowLine2 = true;
        this.isShowLine3 = false;

        this.audioBlob = null;
        this.audioUrl = null;
        let vmm = this;
        localforage
          .getItem(this.mediaName + this.user.username + "recordAudio")
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

    highlightWord(text, type) {
      if (!text) {
        return "";
      }
      if (type == 1 && !this.selectedReplaceLine.includes("1")) return text;
      if (type == 2 && !this.selectedReplaceLine.includes("2")) return text;

      if (!this.isCaseSensitive) {
        const regex = new RegExp(this.rOldWord, "gi");
        return text.replace(
          regex,
          (match) => `<span style="color: springgreen;">${match}</span>`
        );
      } else {
        const regex = new RegExp(this.rOldWord, "g");
        return text.replace(
          regex,
          `<span style="color: springgreen;">${this.rOldWord}</span>`
        );
      }
    },

    switchCaseSensitive() {
      this.isCaseSensitive = !this.isCaseSensitive;
    },

    switchSearchReplace() {
      this.isSearchReplace = !this.isSearchReplace;
    },

    hover(x) {
      if (this.isEditSubandNotes || this.isDictation) {
        this.toBlur();
        setTimeout(() => {
          if (x == 1) this.hoverNavLeft = true;
          else if (x == 2) this.hoverNavLeft = false;
          else if (x == 3) this.hoverNavRight = true;
          else if (x == 4) this.hoverNavRight = false;
        }, 10);
      } else {
        if (x == 1) this.hoverNavLeft = true;
        else if (x == 2) this.hoverNavLeft = false;
        else if (x == 3) this.hoverNavRight = true;
        else if (x == 4) this.hoverNavRight = false;
      }
    },

    testTransUrl() {
      this.newWord = "Hello";
      this.showTransPage();
      setTimeout(() => {
        this.newWord = "";
      }, 1000);
    },

    testTranslatorUrl() {
      this.newWord = "success!";
      if (this.translatorUrl.includes("zure-translator:"))
        this.azureTranslate(1);
      else if (this.translatorUrl.includes("li-translator:")) {
        this.quotaUsed = 0;
        this.aliTranslate(2, 1);
      } else {
        this.openAlert(1, this.$t("repeater.alert007"));
      }
      setTimeout(() => {
        this.newWord = "";
      }, 1000);
    },

    openAlert(a, x, c, d) {
      this.cleanUp1();
      this.cleanUp2();
      this.alertMessage = x;
      this.alertType = a;
      this.confirmType = c;
      if (c == "deleteWord") this.deleteNewWord = d;
      else this.tempIndex = d;
      this.alertVisible = true;
    },

    doConfirm() {
      this.alertVisible = false;
      if (this.alertType == 1 && this.confirmType == "wrongSrt") this.close();
      if (this.alertType == 1) return;
      if (this.confirmType == "downloadDictation") {
        this.downloadDicRec();
      } else if (this.confirmType == "fetch") {
        if (this.isAutoDetectLang) this.autoDetectLangInTrans();
        if (!this.hasSpeechSynthesis) {
          this.isSystemTTS = "No";
        }
        this.saveInit();
        setTimeout(() => {
          this.currentMedia.pause();
        }, 1);
      } else if (this.confirmType == "fetchRevision") {
        this.reviseData.splice(this.tempIndex, 1);
      } else if (this.confirmType == "wrongSrc") {
        console.log("wrongSrc");
      } else if (this.confirmType == "delete") {
        this.deleteSentence();
      } else if (this.confirmType == "deleteWord") {
        this.deleteWord();
      } else if (this.confirmType == "deleteDicRec") {
        this.deleteDicRec();
      } else if (this.confirmType == "uploadDictation") {
        this.uploadDicRec();
      } else if (this.confirmType == "merge") {
        this.mergeSentence();
      } else if (this.confirmType == "add") {
        this.addSentence();
      } else if (this.confirmType == "split") {
        this.splitSentence();
      } else if (this.confirmType == "saveUnsavedSub") {
        this.saveUnsavedSrt();
      } else if (this.confirmType == "saveUnsavedFav") {
        this.hasConfirmed = true;
        this.readyStatus();
      } else if (this.confirmType == "delRevision") {
        this.reviseData.splice(this.tempIndex, 1);
      } else if (this.confirmType == "saveWordList") {
        this.saveSpecialSub(8);
      }
      return;
    },
    doCancel() {
      if (this.confirmType == "fetch") {
        this.cleanUp1();
        this.close();
      } else if (this.confirmType == "wrongSrc") {
        setTimeout(() => {
          this.playFavList();
          return;
        }, 500);
      } else if (this.confirmType == "saveUnsavedSub") {
        window.localStorage.removeItem(this.srtNotUpload);
        window.localStorage.setItem(this.mediaName, this.reqF.content);
      } else if (this.confirmType == "saveUnsavedFav") {
        this.hasConfirmed = true;
        window.localStorage.removeItem(this.favNotUpload);
        this.notSaveFav = true;
        this.readyStatus();
      }
      this.alertVisible = false;
      return;
    },

    detectLangAuto() {
      if (window.localStorage.getItem(this.mediaName + "line1")) {
        this.isOriginalLine1 = Number(
          window.localStorage.getItem(this.mediaName + "line1")
        );
        this.autoSet();
      } else {
        this.aliTranslate(3);
      }
    },

    originDectLang() {
      let str1 = this.srtSubtitles[this.sentenceIndex - 1].content
        .split("\r\n")[0]
        .replace(/^\s\s*/, "")
        .replace(/\s\s*$/, "");
      if (/^[a-zA-Z]/.test(str1)) {
        this.isOriginalLine1 = 1;
      } else {
        this.isOriginalLine1 = 0;
      }
      window.localStorage.setItem(
        this.mediaName + "line1",
        this.isOriginalLine1
      );
      this.autoSet();
    },

    onSubtools() {
      this.showsubTools = true;
      this.showEditNew = false;
      this.cleanUp1();
      this.cleanUp2();
    },

    onSubtools1() {
      this.showsubTools1 = true;
      this.transcriptionResult = "";
      this.showEditNew = false;
      this.cleanUp1();
      this.cleanUp2();
    },

    handleConfirm() {
      this.inSubProcess = true;
      if (this.currentTab === 1) {
        if (this.translatorUrl.includes("zure-translator:"))
          this.azureTranslate();
        else if (this.translatorUrl.includes("li-translator:"))
          this.aliTranslate(1);
        else {
          this.openAlert(1, this.$t("repeater.alert007"));
          this.inSubProcess = false;
        }
      } else if (this.currentTab === 2) {
        this.saveMoveAll();
        this.showsubTools = false;
      } else if (this.currentTab === 3) {
        if (!this.selectedOption) {
          this.inSubProcess = false;
          return;
        }
        let selected = Number(this.selectedOption.split(".")[0]);
        this.saveSpecialSub(selected);
      }
    },
    handleConfirm1() {
      if (this.transcriptionResult !== "") {
        this.isProcessing1 = true;
        if (this.originLine == 1) this.subFirstLine = this.transcriptionResult;
        else this.subSecLine = this.transcriptionResult;
        setTimeout(() => {
          this.isProcessing1 = false;
        }, 300);
      }
    },

    handleCancel() {
      this.showsubTools = false;
    },
    handleCancel1() {
      this.showsubTools1 = false;
      this.showDicSetting = false;
    },

    handleCancel10() {
      this.cleanUp1();
      this.cleanUp2();
      if (this.intervalId && this.isProcessing2) {
        clearInterval(this.intervalId);
        this.currentMedia.pause();
        this.stopRecognition();
      }
      this.isProcessing1 = false;
      this.isProcessing2 = false;
    },

    aliTranslate(type, onTest) {
      if (this.quotaUsed < 0 || this.quotaUsed > 75000) {
        if (type == 1) {
          if (this.quotaUsed < 0)
            this.openAlert(1, this.$t("repeater.alert007"));
          else this.openAlert(1, this.$t("repeater.alert001"));
          this.inSubProcess = false;
        } else if (type == 3) {
          this.originDectLang();
        } else if (type == 2) {
          if (this.showEditNew || this.showSenWord) {
            this.getTrans();
          }
        }
        return;
      }
      if (type > 1) {
        if (this.translatorUrl.includes(",")) {
          if (this.translatorUrl.split("ali-translator:")[1].split(",")[0])
            this.accessKeyId = this.translatorUrl
              .split("ali-translator:")[1]
              .split(",")[0];
          else this.accessKeyId = "";

          if (this.translatorUrl.split("ali-translator:")[1].split(",")[1])
            this.accessKeySecret = this.translatorUrl
              .split("ali-translator:")[1]
              .split(",")[1];
          else this.accessKeySecret = "";
        } else if (
          this.translatorUrl == "ali-translator:default" ||
          this.translatorUrl == "Ali-translator:default"
        ) {
          let x = this.getKeyFromServer(4);
          this.accessKeyId = x[0];
          this.accessKeySecret = x[1];
        } else {
          this.accessKeyId = "";
          this.accessKeySecret = "";
        }
      } else if (this.accessKeyId == "") {
        this.openAlert(1, this.$t("repeater.alert002"));
        return;
      }

      const timestamp = new Date().toISOString().replace(/\.\d{3}/, "");
      const nonce = Math.random().toString(36).substr(2, 15);
      let filteredArray = "";
      if (type == 3) {
        filteredArray = this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[0]
          .replace(/^\s\s*/, "")
          .replace(/\s\s*$/, "");
      } else if (type == 2) {
        if (this.targetLanguage == "aa") {
          this.targetLanguage = this.langInTransLine.replace(/-[^-]*$/, "");
        }
        filteredArray = this.newWord;
      } else {
        for (let ii = this.startNum - 1; ii < this.endNum; ii++) {
          filteredArray =
            filteredArray +
            "\n" +
            this.srtSubtitles[ii].content.split("\r\n")[this.originLine - 1];
        }
      }
      let targetLang =
        this.originTargetLanguage !== "bb"
          ? this.originTargetLanguage
          : this.targetLanguage;
      this.originTargetLanguage = "bb";
      const params = {
        FormatType: "text",
        SourceLanguage: "auto",
        TargetLanguage: targetLang,
        SourceText: filteredArray,
        Version: "2018-10-12",
        Action: this.action,
        Scene: "general",
        AccessKeyId: this.accessKeyId,
        SignatureMethod: "HMAC-SHA1",
        SignatureNonce: nonce,
        SignatureVersion: "1.0",
        Timestamp: timestamp,
      };

      const sortedParams = {};
      Object.keys(params)
        .sort()
        .forEach((key) => {
          sortedParams[key] = params[key];
        });

      const queryString = Object.keys(sortedParams)
        .map(
          (key) =>
            `${this.percentEncode(key)}=${this.percentEncode(
              sortedParams[key]
            )}`
        )
        .join("&");

      const stringToSign = `GET&${this.percentEncode("/")}&${this.percentEncode(
        queryString
      )}`;
      const signature = CryptoJS.HmacSHA1(
        stringToSign,
        `${this.accessKeySecret}&`
      ).toString(CryptoJS.enc.Base64);

      const finalUrl = `${
        this.endpointAli
      }/?${queryString}&Signature=${this.percentEncode(signature)}`;
      fetch(finalUrl)
        .then((response) => response.text())
        .then((data) => {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const translatedElement = xmlDoc.querySelector("Translated");
            const detectedLanguageElement =
              xmlDoc.querySelector("DetectedLanguage");
            if (translatedElement) {
              var detectedLanguage = "en";
              if (detectedLanguageElement) {
                detectedLanguage = detectedLanguageElement.textContent;
              } else if (type == 3) {
                this.originDectLang();
                return;
              }
              if (type == 3) {
                if (
                  detectedLanguage.includes(
                    this.langInTransLine.split("-")[0]
                  ) ||
                  this.langInTransLine.split("-")[0].includes(detectedLanguage)
                ) {
                  this.isOriginalLine1 = 0;
                } else {
                  this.isOriginalLine1 = 1;
                }
                window.localStorage.setItem(
                  this.mediaName + "line1",
                  this.isOriginalLine1
                );
                this.autoSet();
              } else if (type == 2) {
                if (onTest == 1) {
                  this.openAlert(1, translatedElement.textContent);
                  return;
                }

                if (this.showEditNew || this.showSenWord) {
                  this.newTranslation = translatedElement.textContent;
                  if (this.showSenWord)
                    window.localStorage.setItem(
                      "word" + this.newWord,
                      this.newTranslation
                    );
                  this.getPromise();
                }
              } else {
                this.translatedText = translatedElement.textContent;
                this.saveTranslate();
              }
            } else {
              if (type == 3) {
                this.originDectLang();
              } else if (type == 2) {
                if (onTest == 1) {
                  this.openAlert(1, this.$t("repeater.alert007"));
                  return;
                }
                if (this.showSenWord) {
                  this.newTranslation = "";
                  window.localStorage.setItem(
                    "word" + this.newWord,
                    this.newTranslation
                  );
                  this.getPromise();
                }
                if (this.showEditNew) {
                  this.getTrans();
                }
              } else {
                this.openAlert(1, this.$t("repeater.alert003"));
                this.translatedText = "";
                this.inSubProcess = false;
              }
              return;
            }
          } catch (error) {
            if (type == 3) {
              this.originDectLang();
            } else if (type == 2) {
              if (onTest == 1) {
                this.openAlert(1, this.$t("repeater.alert004"));
                return;
              }
              if (this.showSenWord) {
                this.newTranslation = "";
                window.localStorage.setItem(
                  "word" + this.newWord,
                  this.newTranslation
                );
                this.getPromise();
              }
              if (this.showEditNew) {
                this.getTrans();
              }
            } else {
              this.openAlert(1, this.$t("repeater.alert004"));
              this.translatedText = "";
              this.inSubProcess = false;
            }
            return;
          }
        })
        .catch(() => {
          if (type == 3) {
            this.originDectLang();
          } else if (type == 2) {
            if (onTest == 1) {
              this.openAlert(1, this.$t("repeater.alert005"));
              return;
            }
            if (this.showSenWord) {
              this.newTranslation = "";
              window.localStorage.setItem(
                "word" + this.newWord,
                this.newTranslation
              );
              this.getPromise();
            }
            if (this.showEditNew) {
              this.getTrans();
            }
          } else {
            this.openAlert(1, this.$t("repeater.alert005"));
            this.translatedText = "";
            this.inSubProcess = false;
          }
        });
    },

    getTranslateReport() {
      if (
        this.translatorUrl.includes("ali-translator:default") ||
        this.translatorUrl.includes("Ali-translator:default")
      ) {
        let x = this.getKeyFromServer(4);
        this.accessKeyId = x[0];
        this.accessKeySecret = x[1];
      } else if (this.translatorUrl.includes("ali-translator:")) {
        if (this.translatorUrl.split("ali-translator:")[1].split(",")[0])
          this.accessKeyId = this.translatorUrl
            .split("ali-translator:")[1]
            .split(",")[0];
        else this.accessKeyId = "";
        if (this.translatorUrl.split("ali-translator:")[1].split(",")[1])
          this.accessKeySecret = this.translatorUrl
            .split("ali-translator:")[1]
            .split(",")[1];
        else this.accessKeySecret = "";
      } else {
        this.accessKeyId = "";
        this.quotaUsed = -1;
        return;
      }
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const today = new Date(now.getTime());

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day} 00:00:00`;
      };

      const beginTime = formatDate(firstDayOfMonth);
      const endTime = formatDate(today).replace("00:00:00", "23:59:59");

      const timestamp = new Date().toISOString().replace(/\.\d{3}/, "");
      const nonce = Math.random().toString(36).substr(2, 15);
      const params = {
        Action: "GetTranslateReport",
        BeginTime: beginTime,
        EndTime: endTime,
        ApiName: this.apiName,
        Group: "day",
        Version: "2018-10-12",
        AccessKeyId: this.accessKeyId,
        SignatureMethod: "HMAC-SHA1",
        SignatureNonce: nonce,
        SignatureVersion: "1.0",
        Timestamp: timestamp,
      };

      const sortedParams = {};
      Object.keys(params)
        .sort()
        .forEach((key) => {
          sortedParams[key] = params[key];
        });

      const queryString = Object.keys(sortedParams)
        .map(
          (key) =>
            `${this.percentEncode(key)}=${this.percentEncode(
              sortedParams[key]
            )}`
        )
        .join("&");

      const stringToSign = `GET&${this.percentEncode("/")}&${this.percentEncode(
        queryString
      )}`;
      const signature = CryptoJS.HmacSHA1(
        stringToSign,
        `${this.accessKeySecret}&`
      ).toString(CryptoJS.enc.Base64);

      const finalUrl = `${
        this.endpointAli
      }/?${queryString}&Signature=${this.percentEncode(signature)}`;

      fetch(finalUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((data) => {
          let totalSum = 0;
          let dailyArray = data.split("<total>");
          for (let i = 1; i < dailyArray.length; i++) {
            let dailyTotal = Number(dailyArray[i].split("</total>")[0]);
            totalSum = totalSum + dailyTotal;
          }
          if (this.quotaUsed == -2) {
            this.quotaUsed = totalSum;
            if (this.isAutoDetectLang) this.detectLangAuto();
          } else this.quotaUsed = totalSum;
        })
        .catch(() => {
          if (this.quotaUsed == -2) {
            this.quotaUsed = -1;
            if (this.isAutoDetectLang) this.detectLangAuto();
          } else this.quotaUsed = -1;
        });
    },

    percentEncode(str) {
      return encodeURIComponent(str)
        .replace(/\+/g, "%20")
        .replace(/\*/g, "%2A")
        .replace(/%7E/g, "~")
        .replace(/!/g, "%21")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/'/g, "%27");
    },

    async azureTranslate(onTest) {
      if (this.translatorUrl.includes("Azure-translator")) {
        let x = this.getKeyFromServer(5);
        this.apiKey = x[0];
        this.region = x[1];
        this.endpointAzure = "https://api.cognitive.microsofttranslator.com/";
      } else if (this.translatorUrl.includes("azure-translator:")) {
        if (this.translatorUrl.split("azure-translator:")[1].split(",")[0])
          this.apiKey = this.translatorUrl
            .split("azure-translator:")[1]
            .split(",")[0];
        else this.apiKey = "";
        if (this.translatorUrl.split("azure-translator:")[1].split(",")[1])
          this.region = this.translatorUrl
            .split("azure-translator:")[1]
            .split(",")[1];
        else this.region = "";
        if (this.translatorUrl.split("azure-translator:")[1].split(",")[2])
          this.endpointAzure = this.translatorUrl
            .split("azure-translator:")[1]
            .split(",")[2];
        else this.endpointAzure = "";
      } else {
        this.openAlert(1, this.$t("repeater.alert002"));
        return;
      }
      let filteredArray = "";
      if (this.showEditNew || this.showSenWord) {
        if (this.targetLanguage == "aa") {
          this.targetLanguage = this.langInTransLine.replace(/-[^-]*$/, "");
        }
        filteredArray = this.newWord;
      } else {
        for (let ii = this.startNum - 1; ii < this.endNum; ii++) {
          filteredArray =
            filteredArray +
            "\n" +
            this.srtSubtitles[ii].content.split("\r\n")[this.originLine - 1];
        }
      }
      if (onTest == 1) {
        filteredArray = this.newWord;
      }
      this.textToTranslate = filteredArray;
      let targetLang =
        this.originTargetLanguage !== "bb"
          ? this.originTargetLanguage
          : this.targetLanguage;
      this.originTargetLanguage = "bb";
      const url = `${this.endpointAzure}/translate?api-version=3.0&to=${targetLang}`;
      const headers = {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": this.apiKey,
        "Ocp-Apim-Region": this.region,
      };
      const body = [{ text: this.textToTranslate }];

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          this.openAlert(1, this.$t("repeater.alert002"));
          this.inSubProcess = false;
          return;
        }
        const translations = await response.json();
        this.translatedText = translations[0].translations[0].text;
        if (onTest == 1) {
          this.openAlert(1, this.translatedText);
          return;
        }
        if (this.showEditNew || this.showSenWord) {
          this.newTranslation = this.translatedText;
          if (this.showSenWord)
            window.localStorage.setItem(
              "word" + this.newWord,
              this.newTranslation
            );
          this.getPromise();
        } else this.saveTranslate();
      } catch (error) {
        this.translatedText = "";
        if (this.showSenWord) {
          this.newTranslation = "";
          window.localStorage.setItem(
            "word" + this.newWord,
            this.newTranslation
          );
          this.getPromise();
        } else if (this.showEditNew) {
          this.getTrans();
        } else {
          this.openAlert(1, this.$t("repeater.alert007"));
          this.inSubProcess = false;
        }
      }
    },

    saveTranslate() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");
      var newContent = "";
      for (let i = this.startNum; i < this.endNum + 1; i++) {
        var newLineContent =
          this.translatedText.split("\n")[i - this.startNum + 1];
        if (
          this.srtSubtitles[i - 1].content.split("\r\n").length >=
          this.targetLine
        ) {
          if (this.targetLine == 1) {
            newContent = textSubtitles[i - 1].replace(
              textSubtitles[i - 1].split("\n")[0] +
                "\n" +
                textSubtitles[i - 1].split("\n")[1] +
                "\n" +
                textSubtitles[i - 1].split("\n")[2],
              textSubtitles[i - 1].split("\n")[0] +
                "\n" +
                textSubtitles[i - 1].split("\n")[1] +
                "\n" +
                newLineContent
            );
          } else {
            newContent = textSubtitles[i - 1].replace(
              textSubtitles[i - 1].split("\n")[0] +
                "\n" +
                textSubtitles[i - 1].split("\n")[1] +
                "\n" +
                textSubtitles[i - 1].split("\n")[2] +
                "\n" +
                textSubtitles[i - 1].split("\n")[3],
              textSubtitles[i - 1].split("\n")[0] +
                "\n" +
                textSubtitles[i - 1].split("\n")[1] +
                "\n" +
                textSubtitles[i - 1].split("\n")[2] +
                "\n" +
                newLineContent
            );
          }
        } else {
          newContent = textSubtitles[i - 1] + "\n" + newLineContent;
        }
        formatContent = formatContent.replace(textSubtitles[i - 1], newContent);
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
      this.showsubTools = false;
      if (this.timeOutId3) clearTimeout(this.timeOutId3);
      this.timeOutId3 = setTimeout(() => {
        this.saveSubFinal();
      }, 1000);
    },

    async checkDownload() {
      try {
        var content = await api.fetch(
          "/files/!PDJ/user-" +
            this.user.username +
            "/Repeater-backup/" +
            this.mediaName.slice(0, -4) +
            "-dictation.txt"
        );
        let temp2 = JSON.parse(content.content);
        if (temp2.length > 0) {
          this.canDownload = true;
          return;
        }
        let path =
          "/files/!PDJ/user-" +
          this.user.username +
          "/Repeater-backup/Rec-" +
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

    async getDictionary() {
      try {
        let urla = api.getDownloadURL(this.req, true);
        let url = urla.split("/api/")[0] + "/static/dictionary01.txt";
        var res = await fetch(url);
        if (!res.ok) {
          throw new Error(`${res.status}`);
        }
        const textContent = await res.text();
        const lines = textContent.split(/\r?\n/);
        const wordList = lines
          .filter((line) => line.trim() !== "")
          .map((line, index) => {
            const parts = line.split("||");
            if (parts.length < 11) {
              console.warn(`row ${index + 1} WrongFormat: ${line}`);
              return null;
            }
            return {
              number: parts[0],
              word: parts[1],
              pronunciation: parts[2],
              phoneticSplit: parts[3],
              syllable: parts[4],
              roots: parts[5],
              partOfSpeech: parts[6],
              collocation: parts[7],
              exampleSentence: parts[8],
              exampleTranslation: parts[9],
              level: parts[10],
            };
          })
          .filter((item) => item !== null);
        this.dictionary = wordList;
      } catch (e) {
        console.error(e);
      }
    },

    async getNewWordList() {
      try {
        var content = await api.fetch(
          "/files/!PDJ/user-" + this.user.username + "/PDJ-wordlist.txt"
        );
        const lines = content.content.split(/\r?\n/);
        const wordList = lines
          .filter((line) => line.trim() !== "")
          .map((line, index) => {
            const parts = line.split("||");
            if (parts.length < 18) {
              console.warn(`row ${index + 1} WrongFormat: ${line}`);
              return null;
            }
            return {
              number: parts[0],
              word: parts[1],
              pronunciation: parts[2],
              phoneticSplit: parts[3],
              syllable: parts[4],
              roots: parts[5],
              partOfSpeech: parts[6],
              collocation: parts[7],
              exampleSentence: parts[8],
              exampleTranslation: parts[9],
              level: parts[10],
              wordNote: parts[11],
              familiarity: parts[12],
              date: parts[13],
              require: parts[14],
              temp1: parts[15],
              temp2: parts[16],
              temp3: parts[17],
            };
          })
          .filter((item) => item !== null);
        this.wordList = wordList;
      } catch (e) {
        alert("找不到生词表PDJ-wordlist.txt，将在添加生词时新建。");
      }
    },

    findWord(dictionary, targetWord) {
      if (!Array.isArray(dictionary)) return [];
      else
        return dictionary.find((item) => {
          return (
            item.word && item.word.toLowerCase() === targetWord.toLowerCase()
          );
        });
    },

    selectOption(option) {
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.subtitleLang = Number(option.split(".")[0]);
      this.showModal = false;
      this.switchSubtitleMini();
    },

    showRecordingSetNote() {
      this.openAlert(1, this.$t("repeater.noRecordPermission"));
    },

    showOnLineTscNote() {
      this.openAlert(1, this.$t("repeater.tsc03"));
    },

    alertTranslatorUrl() {
      this.openAlert(
        1,
        this.$t("repeater.alertTranslatorUrl", { targetLine: this.targetLine })
      );
    },
    alertTranslatorUrl1() {
      this.openAlert(1, this.$t("repeater.alertTranslatorUrl1"));
    },
    alertMoveAll() {
      this.openAlert(1, this.$t("repeater.alertMoveAll"));
    },
    alertShrinkAll() {
      this.openAlert(1, this.$t("repeater.alertShrinkAll"));
    },

    helpCss() {
      this.openAlert(1, this.$t("repeater.helpCss"));
    },

    helpLoadingMedia() {
      this.openAlert(1, this.$t("repeater.helpLoadingMedia"));
    },

    alertAutoDetect() {
      this.openAlert(1, this.$t("repeater.alertAutoDetect"));
    },

    alertOriginTTS() {
      this.openAlert(1, this.$t("repeater.alertOriginTTS"));
    },

    closeAllParts() {
      this.showSpell = false;
      this.showCloze = false;
      this.showSenWord = false;
      if (this.isRecording) this.recording();
    },

    recording() {
      this.showSpell = false;
      this.showCloze = false;
      this.showSenWord = false;
      this.cleanUp1();
      this.cleanUp2();
      if (this.isRecording) {
        this.stopRecording();
        if (this.isFromLocal == 1) this.transcribe();
        else this.stopRecognition();
      } else {
        this.transcriptionResult = "";
        this.startRecording();
        if (this.isFromLocal != 1) this.transcribe();
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
          this.audioBlob = new Blob(this.audioChunks, { type: "audio/mp3" });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          this.audioChunks = [];
          this.isRecording = false;
          this.saveRecording();
        };
      } catch (error) {
        this.openAlert(1, this.$t("repeater.noRecordFound"));
      }
    },

    stopRecording() {
      if (this.mediaRecorder) this.mediaRecorder.stop();
    },

    playRecording() {
      this.showSpell = false;
      this.showCloze = false;
      this.showSenWord = false;
      if (this.audioUrl) {
        this.cleanUp1();
        this.cleanUp2();
        this.audioRecorded = new Audio(this.audioUrl);
        this.audioRecorded.play();
        setTimeout(() => {
          this.onRecPlay = true;
        }, 100);
        this.audioRecorded.addEventListener("ended", this.endRecPlay, false);
      }
    },
    endRecPlay() {
      this.audioRecorded.removeEventListener("ended", this.endRecPlay, false);
      this.onRecPlay = false;
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
        .setItem(
          this.mediaName + this.user.username + "recordAudio",
          filteredArray,
          function () {}
        )
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
        "/files/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/" +
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
        "/files/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/" +
        itemIndex +
        ".mp3";
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
            window.localStorage.getItem(
              this.mediaName + this.user.username + "dictation"
            )
          ) || [];
        await api.post(
          "/files/!PDJ/user-" +
            this.user.username +
            "/Repeater-backup/" +
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
        .removeItem(this.mediaName + this.user.username + "recordAudio")
        .then(() => {
          console.log("we just removed: " + "recordAudio");
        })
        .catch((error) => {
          console.error("Error removing data:", error);
        });
      let path =
        "/files/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/";
      try {
        let baseItems = (await api.fetch(path)).items;
        for (let item of baseItems) {
          let itemUrl = item.path.split("/Repeater-backup/Rec-")[1];
          if (itemUrl.includes(".mp3")) {
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
        "/api/raw/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/Rec-" +
        itemUrl +
        srtUrl.split(".srt")[1];
      let index = Number(itemUrl.split("/")[1].split(".mp3")[0]);
      try {
        let response = await fetch(playUrl);
        if (!response.ok) {
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        this.audioBlob = new Blob([arrayBuffer], { type: "audio/mp3" });
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
          this.mediaName + this.user.username + "recordAudio",
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
          "/files/!PDJ/user-" +
            this.user.username +
            "/Repeater-backup/" +
            this.mediaName.slice(0, -4) +
            "-dictation.txt"
        );
        this.dictationArray = JSON.parse(content.content);
        if (this.dictationArray.length > 0) {
          window.localStorage.setItem(
            this.mediaName + this.user.username + "dictation",
            JSON.stringify(this.dictationArray)
          );
          const tempCon = this.dictationArray.find(
            (item) => item.id === this.sentenceIndex
          );
          if (tempCon) this.dictationContent = tempCon.con;
        } else {
          window.localStorage.removeItem(
            this.mediaName + this.user.username + "dictation"
          );
          this.dictationArray = [];
          this.dictationContent = "";
        }
      } catch (e) {
        if (!e.message.includes("404")) {
          this.netStatus = false;
          this.openAlert(1, this.$t("repeater.failDownload"));
        } else {
          window.localStorage.removeItem(
            this.mediaName + this.user.username + "dictation"
          );
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

    showTTSSetting() {
      this.openAlert(1, this.$t("repeater.TTSSetting"));
    },

    showTscSetting() {
      this.openAlert(1, this.$t("repeater.tsc05"));
    },

    showSpeedNote() {
      this.openAlert(1, this.$t("repeater.tsc07"));
    },

    checkLocalStorageSpace() {
      try {
        localStorage.setItem("__checkSpace", new Array(512 * 512).join("x")); // generate about 200KB's data, to test remaining space.
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
        this.click();
        setTimeout(() => {
          this.cleanUp1();
          this.cleanUp2();
        }, 10);
      });

      this.regions.on("region-updated", (region) => {
        if (String(region.id).includes("region-")) return;
        this.toBlur();
        setTimeout(() => {
          if (this.sentenceIndex !== region.id) {
            this.sentenceIndex = region.id;
          }
          this.startTimeTemp = region.start;
          this.endTimeTemp = region.end + 0.03;
          this.click();
        }, 10);
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
        if (String(region.id).includes("region-")) {
          if (!this.isMobile && this.disableDrag) {
            this.disableDrag();
          }
          const oldIndex = this.sentenceIndex;
          this.addSentence(region.start, region.end);
          setTimeout(() => {
            if (oldIndex == this.sentenceIndex) {
              this.sentenceIndex = this.sentenceIndex + 1;
              setTimeout(() => {
                this.sentenceIndex = this.sentenceIndex - 1;
                this.click();
              }, 10);
            } else this.click();
          }, 100);
          return;
        }
        if (this.regionPlay) e.stopPropagation();
        this.toBlur();
        setTimeout(() => {
          this.sentenceIndex = region.id;
          activeRegion = region;
          if (this.altPressed) {
            const bbox = this.wavesurfer.getWrapper().getBoundingClientRect();
            const { width } = bbox;
            const offsetX = e.clientX - bbox.left;
            const relX = Math.min(1, Math.max(0, offsetX / width));
            let timeStamp = (relX * this.wavesurfer.getDuration()).toFixed(3);
            this.editHotkeys(timeStamp, e);
          } else if (this.regionPlay) this.click();
        }, 10);
      });

      this.regions.on("region-double-clicked", (region, e) => {
        e.stopPropagation();
        this.toBlur();
        setTimeout(() => {
          this.sentenceIndex = region.id;
          activeRegion = region;
          this.cleanUp2();
          this.cleanUp1();
          this.wavesurfer.pause();
          this.cont = true;
        }, 10);
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
        this.toBlur();
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
          "/files/!PDJ/peaks/" + this.mediaName + ".txt"
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
        if (this.srtSubtitles[i - 1].endTime <= this.currentMedia.duration) {
          this.lastI = i;
          this.regions.addRegion({
            start: this.srtSubtitles[i - 1].startTime,
            end: this.srtSubtitles[i - 1].endTime - 0.03,
            id: i,
            content: i.toString(),
            color: "rgba(0, 255, 0, 0.25)",
            drag: !this.isMobile,
            resize: true,
          });
        }
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
        this.user.username == window.localStorage.getItem(this.user.username) &&
        window.localStorage.getItem(this.favFileName)
      ) {
        this.openAlert(
          2,
          this.$t("repeater.saveUnsavedFav", {
            favFileName: this.favFileName,
          }),
          "saveUnsavedFav"
        );
        return;
      } else if (
        (this.onOffline ||
          (this.hasConfirmed &&
            window.localStorage.getItem(this.favNotUpload)) ||
          (this.isFavOnPlay && this.isPlayFullFavList) ||
          this.showRevision) &&
        this.user.username == window.localStorage.getItem(this.user.username) &&
        window.localStorage.getItem(this.favFileName)
      ) {
        PDJcontent = window.localStorage.getItem(this.favFileName);
      } else {
        try {
          if (this.onOffline) window.localStorage.removeItem("isOffline");
          var PDJserverContent = null;
          PDJserverContent = await api.fetch("/files" + this.favFileName);
          if (this.onOffline) window.localStorage.setItem("isOffline", 1);
          PDJcontent = PDJserverContent.content;
          this.notSaveFav = true;
          window.localStorage.setItem("server" + this.favFileName, PDJcontent);
          window.localStorage.setItem(this.favFileName, PDJcontent);
          window.localStorage.setItem(this.user.username, this.user.username);
        } catch (e) {
          this.isReadyToPlay = true;
          this.openAlert(
            2,
            this.$t("repeater.noFavoriteFile", {
              favFileName: this.favFileName,
            }),
            "fetch"
          );
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
        this.PDJWordListContent = PDJcontent.split("PDJWordList::")[1];
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
      if (PDJcontent.split("::")[37])
        this.showArrow = JSON.parse(PDJcontent.split("::")[37]);
      if (PDJcontent.split("::")[38])
        this.transcribeUrl = JSON.parse(PDJcontent.split("::")[38]);
      if (PDJcontent.split("::")[39])
        this.targetLanguage = JSON.parse(PDJcontent.split("::")[39]);
      if (PDJcontent.split("::")[40])
        this.translatorUrl = JSON.parse(PDJcontent.split("::")[40]);
      if (PDJcontent.split("::")[41])
        this.isCustomFont = JSON.parse(PDJcontent.split("::")[41]);
      if (PDJcontent.split("::")[42])
        this.customCss1 = JSON.parse(PDJcontent.split("::")[42]);
      if (PDJcontent.split("::")[43])
        this.customCss2 = JSON.parse(PDJcontent.split("::")[43]);
      this.isUtterTransLine = JSON.parse(PDJcontent.split("::")[7]);
      if (!this.isAutoDetectLang) {
        this.langInTransLine = JSON.parse(PDJcontent.split("::")[11]);
        this.lineNumOfTrans = Number(JSON.parse(PDJcontent.split("::")[12]));
      }
      if (!this.isAutoDetectLang && PDJcontent.split("::")[45]) {
        this.langInOriginLine = JSON.parse(PDJcontent.split("::")[44]);
        this.lineNumOfOrigin = Number(JSON.parse(PDJcontent.split("::")[45]));
      }
      if (PDJcontent.split("::")[46])
        this.TTSurlO = JSON.parse(PDJcontent.split("::")[46]);
      if (PDJcontent.split("::")[47] && !this.fakeAudio)
        this.readOriginByTTS = JSON.parse(PDJcontent.split("::")[47]);
      if (PDJcontent.split("::")[48])
        this.autoRealCheck = JSON.parse(PDJcontent.split("::")[48]);
      if (PDJcontent.split("::")[49])
        this.allowLoadDiction = JSON.parse(PDJcontent.split("::")[49]);
      if (PDJcontent.split("::")[50])
        this.typingSound = JSON.parse(PDJcontent.split("::")[50]);
      if (PDJcontent.split("::")[51])
        this.isFromLocal = Number(JSON.parse(PDJcontent.split("::")[51]));
    },

    autoSet() {
      if (this.isAutoDetectLang) {
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
        var time01 =
          this.srtSubtitles[i].startTime * 1000 -
          this.timeStampChangeStart +
          this.moveAll1;
        var time02 =
          this.srtSubtitles[i].endTime * 1000 -
          this.timeStampChangeEnd +
          1 +
          this.moveAll2;

        if (time01 >= time02) {
          time01 =
            time01 -
            ((time01 - time02) * Math.abs(this.moveAll1)) /
              (Math.abs(this.moveAll1) + Math.abs(this.moveAll2));
          time02 = time01 + 1;
        }
        if (i == 0) time01 = Math.max(time01, 0);
        if (
          i > 0 &&
          time01 <=
            this.srtSubtitles[i - 1].endTime * 1000 -
              this.timeStampChangeEnd +
              1 +
              this.moveAll2
        ) {
          time01 =
            time01 +
            ((this.srtSubtitles[i - 1].endTime * 1000 -
              this.timeStampChangeEnd +
              1 +
              this.moveAll2 -
              time01) *
              Math.abs(this.moveAll1)) /
              (Math.abs(this.moveAll1) + Math.abs(this.moveAll2));
        }

        if (
          i < textSubtitles.length - 1 &&
          time02 >=
            this.srtSubtitles[i + 1].startTime * 1000 -
              this.timeStampChangeStart +
              this.moveAll1
        ) {
          time02 =
            time02 -
            1 -
            ((time02 -
              (this.srtSubtitles[i + 1].startTime * 1000 -
                this.timeStampChangeStart +
                this.moveAll1)) *
              Math.abs(this.moveAll2)) /
              (Math.abs(this.moveAll1) + Math.abs(this.moveAll2));
        }

        time01 = time01 * this.shrinkAll;
        time02 = time02 * this.shrinkAll;
        var time1 = this.convertToHMS(time01);
        var time2 = this.convertToHMS(time02);

        var startTimeFormat =
          time1.hours +
          ":" +
          time1.minutes +
          ":" +
          time1.seconds +
          "," +
          time1.milliseconds;

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
                  return; // may multiple run at the same time, so need to limit up to 2.
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
      this.saveNow();
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
        this.openAlert(2, this.$t("repeater.wrongSrc"), "wrongSrc");
      }
    },

    getDateAfterDays(n) {
      const date = new Date();
      const daysInMilliseconds = 1000 * 60 * 60 * 24;
      const nDaysAfter = new Date(date.getTime() + n * daysInMilliseconds);
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
          this.openAlert(
            1,
            "Already existed in Review Plan, Item " + iii + "."
          );
          return;
        }
      }
      this.reviseData.unshift(reviseItem);
    },

    calcFav() {
      this.isFav = false;
      if (
        this.srtSubtitles[this.sentenceIndex - 1]?.content?.includes("[star];")
      )
        this.isFav = true;
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
        this.openAlert(
          2,
          this.$t("repeater.removeRevisionConfirm"),
          "fetchRevision",
          index
        );
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
      if (this.fakeAudio) {
        this.raw = this.fakeAudioUrl;
        return;
      }
      let srtUrl = api.getDownloadURL(this.reqF, true);
      if (this.isFavOnPlay && this.isPlayFullFavList) {
        this.raw = this.fakeAudioUrl;
        this.fakeAudio = true;
        this.isMediaType = 1;
        return;
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
            if (value.type.includes("text")) {
              vm.cachedKeys = vm.cachedKeys.replace(";;" + keyName, "");
              window.localStorage.setItem("cKeys", vm.cachedKeys);
              vm.calcRaw();
              vm.playFromCache = false;
              vm.fetchCount++;
              if (vm.fetchCount > 2) return;
              vm.cacheMedia();
              return;
            }
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

    getOriginLang() {
      if (
        this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[0]
          .includes(this.newWord)
      ) {
        if (this.lineNumOfTrans == 1) {
          this.originTargetLanguage = this.langTranscribe.split("-")[0];
        }
      } else if (this.lineNumOfTrans !== 1) {
        this.originTargetLanguage = this.langTranscribe.split("-")[0];
      }
    },

    async getTrans() {
      this.getOriginLang();
      try {
        let targetLang =
          this.originTargetLanguage !== "bb"
            ? this.originTargetLanguage
            : this.targetLanguage;
        this.originTargetLanguage = "bb";
        const response = await fetch(
          "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=auto&tl=" +
            targetLang +
            "&q=" +
            this.newWord
        );

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const text = await response.text();
        const jsonStart = text.indexOf("[");
        const jsonEnd = text.lastIndexOf("]") + 1;
        const jsonContent = text.substring(jsonStart, jsonEnd);
        const result = JSON.parse(jsonContent);

        this.newTranslation = result[0][0][0];
      } catch (error) {
        console.error("translation request error:", error);
      }
    },

    saveWordToSRT(x) {
      let newphrase = "";
      if (x == 1) newphrase = "[star];";
      else newphrase = "[" + this.newWord + "::" + this.newTranslation + "]; ";
      this.cleanUp1();
      this.cleanUp2();
      this.startTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].startTime;
      this.endTimeTemp = this.srtSubtitles[this.sentenceIndex - 1].endTime;
      this.subFirstLine =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[0];
      this.subSecLine =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[1];
      if (
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2] &&
        this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[2]
          .includes("[" + this.newWord.trim() + "::")
      ) {
        let t1 = this.srtSubtitles[this.sentenceIndex - 1].content
          .split("\r\n")[2]
          .split("[" + this.newWord.trim() + "::")[1];
        const index = t1.indexOf("];");
        let part2 = index !== -1 ? t1.slice(index + 2) : t1;

        this.note =
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")[2]
            .split("[" + this.newWord.trim() + "::")[0] + part2;
      } else {
        this.note =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2];
      }
      if (this.note == undefined) this.note = "";
      this.note = this.note + newphrase;
      this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[2] =
        this.note;
      this.onEdit = true;
      this.saveSub();
      this.showEditNew = false;
      if (x != 1) this.saveToWordList();
    },

    async saveToWordList() {
      const date = Date.now();
      let newW = null;
      if (this.listWord) {
        this.updateWordProperty(this.listWord, {
          word: this.newWord,
          partOfSpeech: this.newTranslation,
          wordNote: this.wordNotes,
          date: date,
        });
      } else if (this.dictionaryWord) {
        let ex1 = "";
        let ex2 = "";
        if (
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n") &&
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ] &&
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")
            [this.lineNumOfTrans - 1].trim() !== "" &&
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfOrigin - 1
          ]
        ) {
          ex2 =
            this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
              this.lineNumOfTrans - 1
            ];
          ex1 =
            this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
              this.lineNumOfOrigin - 1
            ];
        } else {
          ex2 = this.dictionaryWord.exampleTranslation;
          ex1 = this.dictionaryWord.exampleSentence;
        }

        newW = {
          number: this.dictionaryWord.number,
          word: this.dictionaryWord.word,
          pronunciation: this.dictionaryWord.pronunciation,
          phoneticSplit: this.dictionaryWord.phoneticSplit,
          syllable: this.dictionaryWord.syllable,
          roots: this.dictionaryWord.roots,
          partOfSpeech: this.newTranslation,
          collocation: this.dictionaryWord.collocation,
          exampleSentence: ex1,
          exampleTranslation: ex2,
          level: this.dictionaryWord.level,
          wordNote: this.wordNotes,
          familiarity: 0,
          date: date,
          require: 0,
          temp1: 0,
          temp2: 0,
          temp3: 0,
        };
        this.wordList.push(newW);
      } else {
        let ex1 = "";
        let ex2 = "";
        if (
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n") &&
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfTrans - 1
          ] &&
          this.srtSubtitles[this.sentenceIndex - 1].content
            .split("\r\n")
            [this.lineNumOfTrans - 1].trim() !== "" &&
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfOrigin - 1
          ]
        ) {
          ex2 =
            this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
              this.lineNumOfTrans - 1
            ];
          ex1 =
            this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
              this.lineNumOfOrigin - 1
            ];
        } else {
          ex2 = "...";
          ex1 = "...";
        }

        newW = {
          number: 20002,
          word: this.newWord,
          pronunciation: "...",
          phoneticSplit: "...",
          syllable: "...",
          roots: "...",
          partOfSpeech: this.newTranslation,
          collocation: "...",
          exampleSentence: ex1,
          exampleTranslation: ex2,
          level: "-self-",
          wordNote: this.wordNotes,
          familiarity: 0,
          date: date,
          require: 0,
          temp1: 0,
          temp2: 0,
          temp3: 0,
        };
        this.wordList.push(newW);
      }
      this.saveToWordListFile();
    },

    async saveToWordListFile() {
      try {
        const lines = this.wordList.map((item) => {
          const parts = [
            item.number || 20002,
            item.word != "" ? item.word : "-",
            item.pronunciation != "" ? item.pronunciation : "-",
            item.phoneticSplit != "" ? item.phoneticSplit : "-",
            item.syllable != "" ? item.syllable : "-",
            item.roots != "" ? item.roots : "-",
            item.partOfSpeech != "" ? item.partOfSpeech : "-",
            item.collocation != "" ? item.collocation : "-",
            item.exampleSentence != "" ? item.exampleSentence : "-",
            item.exampleTranslation != "" ? item.exampleTranslation : "-",
            item.level || "0",
            item.wordNote != "" ? item.wordNote : "-",
            item.familiarity || 0,
            item.date || 0,
            item.require || 0,
            item.temp1 || 0,
            item.temp2 || 0,
            item.temp3 || 0,
          ];
          return parts.join("||");
        });

        const textContent = lines.join("\n");
        await api.post(
          "/files/!PDJ/user-" + this.user.username + "/PDJ-wordlist.txt",
          textContent,
          true
        );
      } catch (error) {
        alert(
          "failed to save newWord to /!PDJ/user-" +
            this.user.username +
            "/PDJ-wordlist.txt",
          error
        );
      }
    },

    updateWordProperty(targetWord, newProperties) {
      const target = this.wordList.find(
        (item) => item.word.toLowerCase() === targetWord.word.toLowerCase()
      );

      if (!target) {
        console.warn(`not found: ${targetWord.word}`);
        return;
      }
      Object.assign(target, newProperties);
    },

    getReader() {
      if (!this.hasSpeechSynthesis) {
        this.reader = 0;
        this.readerO = 0;
      }
      if (window.localStorage.getItem("reader") == null) this.reader = 1;
      else this.reader = Number(window.localStorage.getItem("reader"));
      if (window.localStorage.getItem("readerO") == null) this.readerO = 1;
      else this.readerO = Number(window.localStorage.getItem("readerO"));
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
        let tempS = this.srtSubtitles[this.sentenceIndex - 1].startTime;
        let startA = Math.min(this.currentMedia.duration - 1, tempS);
        this.currentMedia.currentTime = startA;
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
            window.localStorage.setItem("isBrowserHiJack", true);
            location.reload();
          }
        }, 1);
      }
      this.isFirstClick = false;
    },

    singleModePlay() {
      this.cleanUp1();
      if (!this.isReadyToPlay) return;
      if (this.isDictation) {
        if (this.dRead == 4) return;
        else if (this.dRead == 1) {
          this.utterTransLine();
          return;
        } else if (this.dRead == 2) {
          this.playSection();
          return;
        }
      }

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
      if (this.showNewWordList && !this.withTrans) {
        let y = this.newWordList[indexWordList].origin;
        if (y) {
          if (this.newWord.trim() != y.trim()) this.newWord = y.trim();
          else this.clickWord();
        }
      } else this.click();
    },

    clickWord() {
      if (this.isSystemTTS == "Yes") this.testTTSVoiceO(1);
      else this.testTTSurlO(1);
    },
    clickTrans() {
      if (this.isSystemTTS == "Yes") this.testTTSVoice(1);
      else this.testTTSurl(1);
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
        this.showNewWordList = true;
      } else if (
        this.showSubtitleList &&
        !this.showNewWordList &&
        !this.withTrans &&
        this.isFavOnPlay
      ) {
        this.showSubtitleList = false;
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
        if (
          this.newWordList.length > 0 &&
          this.newWordList[this.indexOfNewWordList]
        )
          this.newWordList[this.indexOfNewWordList].showTrans = false;
        this.showNewWordList = false;
        this.withTrans = false;
      }
      if (!this.isSingle && !this.showNewWordList && !this.showSubtitleList) {
        this.currentMedia.addEventListener("timeupdate", this.syncSub);
      }
      if (
        this.showSubtitleList &&
        this.srtSubtitlesLength == this.srtSubtitlesSearch.length
      ) {
        setTimeout(() => {
          document
            .getElementById(this.sentenceIndex)
            .scrollIntoView({ block: "center", behavior: "smooth" });
        }, 100);
      }
    },

    testTTSurl(x) {
      let transLineContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfTrans - 1
        ];
      let text =
        transLineContent !== undefined && transLineContent !== " "
          ? transLineContent
          : "no content";
      if (x == 1) text = this.newWord;
      if (this.TTSurl.includes("zure-tts:")) {
        this.azureTTS(text, 2);
      } else {
        let ttsFullUrl = this.TTSurl + text;
        this.audio.src = ttsFullUrl;
        this.audio.playbackRate = this.speedOfUtter;
        this.audio.play().catch(() => {
          this.openAlert(1, this.$t("repeater.alert008"));
        });
      }
    },

    testTTSurlO(x) {
      let originLineContent =
        this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
          this.lineNumOfOrigin - 1
        ];
      let text =
        originLineContent !== undefined && originLineContent !== " "
          ? originLineContent
          : "no content";
      if (x == 1) text = this.newWord;
      if (this.TTSurlO.includes("zure-tts:")) {
        this.azureTTSO(text, 2);
      } else {
        let ttsFullUrlO = this.TTSurlO + text;
        this.audio.src = ttsFullUrlO;
        this.audio.playbackRate = this.curSpeed();
        this.audio.play().catch(() => {
          this.openAlert(1, this.$t("repeater.alert008"));
        });
        this.audio.addEventListener("ended", this.endUtterO, false);
      }
    },

    getTranscribeKey() {
      let r = "";
      let s = "";
      let x;
      if (this.transcribeUrl.startsWith("defaultkey1")) {
        x = this.getKeyFromServer(1);
        s = x[0];
        r = x[1];
      } else if (this.transcribeUrl.startsWith("defaultkey2")) {
        x = this.getKeyFromServer(2);
        s = x[0];
        r = x[1];
      } else if (this.transcribeUrl.startsWith("defaultkey3")) {
        x = this.getKeyFromServer(3);
        s = x[0];
        r = x[1];
      } else if (this.transcribeUrl.startsWith("Default")) {
        x = this.getKeyFromServer(6);
        s = x[0];
        r = x[1];
      } else if (this.transcribeUrl.includes(",")) {
        s = this.transcribeUrl.split(",")[0].trim();
        if (this.transcribeUrl.split(",")[1])
          r = this.transcribeUrl.split(",")[1].trim();
      }
      this.sK = s;
      this.sR = r;
    },

    azureTTS(text, type) {
      this.ttsName = this.TTSurl + text;
      let vmm = this;
      localforage
        .getItem(this.ttsName)
        .then(function (value) {
          if (!this.utterInProcess && type == 1) return;
          vmm.audio.src = URL.createObjectURL(value);
          vmm.audio.playbackRate = vmm.curSpeed();
          vmm.audio.play();
          if (type == 1) {
            if (!vmm.isSingle && vmm.dubbingMode) {
              vmm.utterInProcess = false;
              return;
            }
            if (vmm.isDictation && !vmm.isEditSubandNotes && vmm.dRead == 1) {
              vmm.utterInProcess = false;
              return;
            }
            vmm.audio.addEventListener("ended", vmm.endUtter, false);
          }
        })
        .catch(function () {
          vmm.azureTTS1(text, type);
        });
    },

    azureTTS1(text, type) {
      let r = "";
      let v = "";
      let s = "";
      let x;
      if (this.TTSurl.startsWith("azure-tts:defaultkey1")) {
        x = this.getKeyFromServer(1);
        s = x[0];
        r = x[1];
        if (this.TTSurl.split(",")[2]) v = this.TTSurl.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurl.startsWith("azure-tts:defaultkey2")) {
        x = this.getKeyFromServer(2);
        s = x[0];
        r = x[1];
        if (this.TTSurl.split(",")[2]) v = this.TTSurl.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurl.startsWith("azure-tts:defaultkey3")) {
        x = this.getKeyFromServer(3);
        s = x[0];
        r = x[1];
        if (this.TTSurl.split(",")[2]) v = this.TTSurl.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurl.startsWith("Azure-tts:defaultkey")) {
        x = this.getKeyFromServer(6);
        s = x[0];
        r = x[1];
        if (this.TTSurl.split(",")[2]) v = this.TTSurl.split(",")[2].trim();
        else v = "";
      } else {
        s = this.TTSurl.split("azure-tts:")[1].split(",")[0].trim();

        if (this.TTSurl.split(",")[1]) r = this.TTSurl.split(",")[1].trim();
        else r = "";

        if (this.TTSurl.split(",")[2]) v = this.TTSurl.split(",")[2].trim();
        else v = "";
      }

      const endpoint = `https://${r}.tts.speech.microsoft.com/cognitiveservices/v1`;
      const accessToken = this.gT(s, r);

      accessToken
        .then((token) => {
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
            "User-Agent": "YourAppName",
          };

          const body = `
          <speak version='1.0' xml:lang='${v.replace(/-[^-]*$/, "")}'>
            <voice name='${v}'>
              ${text}
            </voice>
          </speak>
        `;

          fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: body,
          })
            .then((response) => response.blob())
            .then((blob) => {
              if (blob.size == 0) {
                if (type == 1) {
                  this.endUtter();
                  this.ttsWrong = true;
                  if (this.timeOutId4) clearTimeout(this.timeOutId4);
                  this.timeOutId4 = setTimeout(() => {
                    this.ttsWrong = false;
                  }, 1000);
                  return;
                } else {
                  console.log("too many requests to azure TTS");
                  return;
                }
              }

              localforage
                .setItem(this.ttsName, blob)
                .then(() => {})
                .catch(() => {});
              if (!this.utterInProcess && type == 1) return;
              this.audio.src = URL.createObjectURL(blob);
              this.audio.playbackRate = this.speedOfUtter;
              this.audio.play();
              if (type == 1) {
                if (!this.isSingle && this.dubbingMode) {
                  this.utterInProcess = false;
                  return;
                }
                if (
                  this.isDictation &&
                  !this.isEditSubandNotes &&
                  this.dRead == 1
                ) {
                  this.utterInProcess = false;
                  return;
                }
                this.audio.addEventListener("ended", this.endUtter, false);
              }
            })
            .catch((error) => {
              if (type == 1) {
                this.endUtter();
                this.ttsWrong = true;
                if (this.timeOutId4) clearTimeout(this.timeOutId4);
                this.timeOutId4 = setTimeout(() => {
                  this.ttsWrong = false;
                }, 1000);
                return;
              } else {
                this.openAlert(
                  1,
                  "Wrong Azure TTS settings, or network error!",
                  error
                );
                return;
              }
            });
        })
        .catch(() => {
          if (type == 1) {
            this.endUtter();
            this.ttsWrong = true;
            if (this.timeOutId4) clearTimeout(this.timeOutId4);
            this.timeOutId4 = setTimeout(() => {
              this.ttsWrong = false;
            }, 1000);
            return;
          } else {
            this.openAlert(1, this.$t("repeater.alert010"));
            return;
          }
        });
    },

    azureTTSO(text, type) {
      this.ttsName = this.TTSurlO + text;
      let vmm = this;
      localforage
        .getItem(this.ttsName)
        .then(function (value) {
          vmm.audio.src = URL.createObjectURL(value);
          vmm.audio.playbackRate = vmm.curSpeed();
          vmm.audio.play();
          if (type == 2) {
            vmm.audio.addEventListener("ended", vmm.endUtterO, false);
          }
        })
        .catch(function () {
          vmm.azureTTSO1(text, type);
        });
    },

    azureTTSO1(text, type) {
      let r = "";
      let v = "";
      let s = "";
      let x;
      if (this.TTSurlO.startsWith("azure-tts:defaultkey1")) {
        x = this.getKeyFromServer(1);
        s = x[0];
        r = x[1];
        if (this.TTSurlO.split(",")[2]) v = this.TTSurlO.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurlO.startsWith("azure-tts:defaultkey2")) {
        x = this.getKeyFromServer(2);
        s = x[0];
        r = x[1];
        if (this.TTSurlO.split(",")[2]) v = this.TTSurlO.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurlO.startsWith("azure-tts:defaultkey3")) {
        x = this.getKeyFromServer(3);
        s = x[0];
        r = x[1];
        if (this.TTSurlO.split(",")[2]) v = this.TTSurlO.split(",")[2].trim();
        else v = "";
      } else if (this.TTSurlO.startsWith("Azure-tts:defaultkey")) {
        x = this.getKeyFromServer(6);
        s = x[0];
        r = x[1];
        if (this.TTSurlO.split(",")[2]) v = this.TTSurlO.split(",")[2].trim();
        else v = "";
      } else {
        s = this.TTSurlO.split("azure-tts:")[1].split(",")[0].trim();

        if (this.TTSurlO.split(",")[1]) r = this.TTSurlO.split(",")[1].trim();
        else r = "";

        if (this.TTSurlO.split(",")[2]) v = this.TTSurlO.split(",")[2].trim();
        else v = "";
      }

      const endpoint = `https://${r}.tts.speech.microsoft.com/cognitiveservices/v1`;
      const accessToken = this.gT(s, r);

      accessToken
        .then((token) => {
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
            "User-Agent": "YourAppName",
          };

          const body = `
          <speak version='1.0' xml:lang='${v.replace(/-[^-]*$/, "")}'>
            <voice name='${v}'>
              ${text}
            </voice>
          </speak>
        `;

          fetch(endpoint, {
            method: "POST",
            headers: headers,
            body: body,
          })
            .then((response) => response.blob())
            .then((blob) => {
              if (blob.size == 0) {
                console.log("too many requests to azure TTS");
                return;
              }

              localforage
                .setItem(this.ttsName, blob)
                .then(() => {})
                .catch(() => {});

              this.audio.src = URL.createObjectURL(blob);
              this.audio.playbackRate = this.curSpeed();
              this.audio.play();
              if (type == 2) {
                this.audio.addEventListener("ended", this.endUtterO, false);
              }
            })
            .catch((error) => {
              this.openAlert(
                1,
                "Wrong Azure TTS settings, or network error!",
                error
              );
              return;
            });
        })
        .catch(() => {
          this.openAlert(1, this.$t("repeater.alert010"));
          return;
        });
    },

    async gT(s, r) {
      const tokenEndpoint = `https://${r}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
      const headers = {
        "Ocp-Apim-Subscription-Key": s,
      };

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: headers,
      });
      return response.text();
    },

    getKeyFromServer(x) {
      const encryptedMap = {
        1: [atob(this.sh), atob("amFwYW5lYXN0")],
        2: [atob(this.po), atob("ZWFzdHVz")],
        3: [atob(this.re), atob("c291dGhlYXN0YXNpYQ==")],
        4: [atob(this.aa), atob(this.ab)],
        5: [atob(this.pm), atob("Z2xvYmFs")],
        6: [atob(this.at), atob("ZWFzdGFzaWE=")],
      };
      return encryptedMap[x];
    },

    getValue2(x) {
      const encryptedMap = {
        2: [
          atob("YzNjMDU5ZWNmNDdlNDg5YzhkYjBkMDM4ODY3ZTc1YzE="),
          atob("ZWFzdHVz"),
        ],
      };
      return encryptedMap[x];
    },

    testTTSVoice(x) {
      if (this.isSystemTTS == "Yes") {
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
        if (x == 1) this.utterThis.text = this.newWord;
        if (this.langInTransLine == "") {
          this.langInTransLine = navigator.language || navigator.userLanguage;
        }
        this.utterThis.lang = this.langInTransLine;
        this.utterThis.rate = this.speedOfUtter;
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.utterThis.lang.substring(0, 3) +
          this.utterThis.lang.substring(3).toUpperCase();
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

    testTTSVoiceO(x) {
      if (this.isSystemTTS == "Yes") {
        if (x != 2) {
          this.cleanUp1();
          this.cleanUp2();
        }
        let originLineContent =
          this.srtSubtitles[this.sentenceIndex - 1].content.split("\r\n")[
            this.lineNumOfOrigin - 1
          ];
        this.utterThis.text =
          originLineContent !== undefined &&
          originLineContent !== " " &&
          originLineContent !== ""
            ? originLineContent
            : "no content";
        if (x == 1) this.utterThis.text = this.newWord;
        if (this.langInOriginLine == "") {
          this.langInOriginLine = "en-US";
        }
        this.utterThis.lang = this.langInOriginLine;
        this.utterThis.rate = this.curSpeed();
        let voices = window.speechSynthesis.getVoices();
        let formattedLang =
          this.utterThis.lang.substring(0, 3) +
          this.utterThis.lang.substring(3).toUpperCase();
        this.utterThis.voice = voices.filter(function (voice) {
          return voice.lang.includes(formattedLang);
        })[this.readerO - 1];
        window.speechSynthesis.speak(this.utterThis);
        this.utterThis.onend = () => {
          if (x != 2) {
            this.cleanUp1();
            this.cleanUp2();
          } else this.audioEnded = true;
        };
      }
    },

    utterTransLine() {
      this.utterInProcess = true;
      if (
        (this.isUtterTransLine || this.isDictation) &&
        this.isSystemTTS == "Yes"
      ) {
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
        if (this.isDictation && !this.isEditSubandNotes && this.dRead == 1) {
          this.utterInProcess = false;
          return;
        }
        this.utterThis.onend = () => {
          this.endUtter();
        };
      } else if (
        (this.isUtterTransLine || this.isDictation) &&
        this.isSystemTTS == "No"
      ) {
        this.ttsReader();
      }
    },
    ttsReader() {
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
      if (this.TTSurl.includes("zure-tts:")) {
        this.azureTTS(text, 1);
      } else {
        let ttsFullUrl = this.TTSurl + text;
        this.audio.src = ttsFullUrl;
        this.audio.playbackRate = this.speedOfUtter;
        this.audio.play().catch(() => {
          this.endUtter();
          if (!this.utterInProcess) return;
          this.ttsWrong = true;
          if (this.timeOutId4) clearTimeout(this.timeOutId4);
          this.timeOutId4 = setTimeout(() => {
            this.ttsWrong = false;
          }, 1000);
          return;
        });
        if (!this.isSingle && this.dubbingMode) {
          this.utterInProcess = false;
          return;
        }
        if (this.isDictation && !this.isEditSubandNotes && this.dRead == 1) {
          this.utterInProcess = false;
          return;
        }
        this.audio.addEventListener("ended", this.endUtter, false);
      }
    },
    endUtterO() {
      this.audio.removeEventListener("ended", this.endUtterO, false);
      this.audioEnded = true;
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
        this.isPauseAfterFirstDone &&
        !this.isEditSubandNotes
      ) {
        this.pauseAfterFirstDone = true;
        this.utterInProcess = false;
        return;
      } else if (
        (!this.autoPlayNext ||
          this.showNewWordList ||
          (this.showSubtitleList &&
            this.srtSubtitles !== this.srtSubtitlesSearch)) &&
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
                !(
                  this.showSubtitleList &&
                  this.srtSubtitles !== this.srtSubtitlesSearch
                ) &&
                this.sentenceIndex == this.srtSubtitles.length))
          ) {
            if (
              this.autoPlayNext &&
              !this.isEditSubandNotes &&
              !this.showNewWordList &&
              !(
                this.showSubtitleList &&
                this.srtSubtitles !== this.srtSubtitlesSearch
              )
            ) {
              if (this.random) this.sentenceIndex = this.getRandomInt();
              else if (
                this.nextLoopPlay &&
                this.sentenceIndex >=
                  Math.min(this.loopEnd, this.srtSubtitles.length)
              )
                this.sentenceIndex = Number(this.loopStart);
              else this.sentenceIndex = this.sentenceIndex + 1;
              if (!this.autoPlay) {
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
        this.isShowLine1 = true;
        this.isShowLine2 = false;
        this.isShowLine3 = false;
      } else if (this.subtitleLang == 4) {
        this.isShowLine1 = false;
        this.isShowLine2 = true;
        this.isShowLine3 = false;
      } else if (this.subtitleLang == 5) {
        this.isShowLine1 = false;
        this.isShowLine2 = false;
        this.isShowLine3 = true;
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
        "azure-tts:defaultkey1,eastasia,zh-CN-YunyiMultilingualNeural";
      this.TTSurlO = "azure-tts:defaultkey1,eastasia,en-US-GuyNeural";
    },
    resetTranslatorurl() {
      this.translatorUrl = "ali-translator:default";
    },
    cleanUp1() {
      this.utterInProcess = false;
      if (this.wordDataResolver) this.wordDataResolver = null;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.currentMedia) this.currentMedia.pause();
      if (this.audio) this.audio.pause();
      if (this.audioRecorded) this.audioRecorded.pause();
      if (this.onRecPlay) this.onRecPlay = false;
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.timeOutId) clearTimeout(this.timeOutId);
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
      if (this.audioRecorded && this.audioRecorded.removeEventListener) {
        this.audioRecorded.removeEventListener("ended", this.endRecPlay, false);
      }
      if (this.audio && this.audio.removeEventListener) {
        this.audio.removeEventListener("ended", this.endUtter, false);
      }
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
      this.closeSubList();
      this.isFavOnPlay = !this.isFavOnPlay;
      if (this.isFavOnPlay) {
        this.dictationArray = [];
        this.dictationContent = "";
        window.localStorage.setItem("lastSentenceIndex", this.sentenceIndex);
        if (this.isEditSubandNotes) this.switchEditSubandNote();
        this.isFav = true;
        this.sentenceIndex = 1;
        if (!this.isPlayFullFavList) {
          if (this.isFirstClick) this.firstClick();
          this.singleModePlay();
        }
      } else {
        this.handleIsDictation();
        this.sentenceIndex = Number(
          window.localStorage.getItem("lastSentenceIndex")
        );
        this.calcFav();
        if (!this.isPlayFullFavList) {
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
      if (this.isReadyToPlay || (this.isFavOnPlay && this.isPlayFullFavList)) {
        this.isFav = !this.isFav;
        if (this.isFav) {
          //add a fav
          this.saveWordToSRT(1);
          return;
        } else {
          //remove a fav
          if (this.isFavOnPlay) {
            this.cleanUp2();
            this.cleanUp1();
          }
          this.deleteWord(1);
          if (this.isFavOnPlay) {
            setTimeout(() => {
              if (this.srtSubtitles.length < 1) {
                this.isFavOnPlay = false;
                return;
              }
              if (this.sentenceIndex > this.srtSubtitles.length) {
                this.sentenceIndex = this.sentenceIndex - 1;
              }
              this.isFav = true;
            }, 100);
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

    async deleteDicRec() {
      window.localStorage.removeItem(
        this.mediaName + this.user.username + "dictation"
      );
      this.dictationArray = [];
      this.dictationContent = "";
      this.canDownload = false;
      let path =
        "/files/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/" +
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
        .removeItem(this.mediaName + this.user.username + "recordAudio")
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
        "/files/!PDJ/user-" +
        this.user.username +
        "/Repeater-backup/Rec-" +
        this.mediaName.slice(0, -4) +
        "/";
      try {
        let promises = [];
        promises.push(api.remove(path));
        await Promise.all(promises);
      } catch (e) {
        if (!e.message.includes("404")) {
          this.netStatus = false;
          this.openAlert(1, this.$t("repeater.failUpload"));
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
      } else if (this.isSingle && this.isDictation && !this.isFavOnPlay) {
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
      this.cleanUp2();
      this.cleanUp1();
      if (!this.isSingle && !this.isSetting) {
        setTimeout(() => {
          this.currentMedia.addEventListener("timeupdate", this.syncSub);
        }, 10);
      }
    },

    click() {
      this.touches++;
      this.showFakeAlert = false;
      if (this.isFirstClick) this.firstClick();
      this.fromClick = true;
      if (this.isEditSubandNotes) this.cleanUp2();
      this.cleanUp1();
      if (this.isEditSubandNotes || this.isDictation) {
        if (this.downArrow && this.isDictation) {
          this.downArrow = false;
        } else this.toBlur();
      }

      if (
        !(this.utterInProcess && this.isSystemTTS == "No") &&
        !this.readOriginByTTS &&
        !this.fakeAudio
      ) {
        this.click1();
      } else {
        if (this.touches == 2) {
          //double click
          this.cleanUp1();
          this.touches = 0;
          if (this.timeOutId2) clearTimeout(this.timeOutId2);
          if (this.timeOutId3) clearTimeout(this.timeOutId3);
          return;
        }

        this.timeOutId3 = setTimeout(() => {
          if (this.newWord !== "") {
            return;
          }
          this.touches = 0;
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
        }, 300);
      }
    },

    click1() {
      if (!this.clickTimer) {
        this.clickTimer = setTimeout(() => {
          this.clickTimer = null;
        }, 300);
        if (this.newWord !== "") {
          return;
        }
        this.touches = 0;
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
      } else {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
        //double click
        this.cleanUp1();
        this.touches = 0;
        if (this.timeOutId2) clearTimeout(this.timeOutId2);
        if (this.timeOutId3) clearTimeout(this.timeOutId3);
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
      this.handleAutoStop();
      this.closeSubList();
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
      let timeNow = new Date().getTime();
      if (timeNow - this.startTime < 1000) {
        if (this.isSetting) {
          this.isSetting = false;
          this.click();
          return;
        }
        if (this.showRevision) {
          this.showRevision = false;
          this.click();
          return;
        }
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
        this.showEditNew = true;
        this.newWord = window
          .getSelection()
          .toString()
          .trim()
          .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
      } else {
        if (timeNow - this.startTime < 1000)
          window.getSelection().removeAllRanges();
        this.fixbug1();
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
        this.cleanUp1();
        this.cleanUp2();
        this.showEditNew = true;
        this.newWord = window
          .getSelection()
          .toString()
          .trim()
          .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
      } else {
        this.fixbug1();
        this.showEditNew = false;
      }
    },

    endDragG() {
      if (!this.isReadyToPlay || this.isTouchDevice) return;
      this.fixbug1();
      this.showEditNew = false;
    },

    startTouch(event) {
      event.preventDefault();
      this.startTouchS(event);
    },
    startTouchS(event) {
      if (!this.isReadyToPlay) return;
      this.handleAutoStop();
      this.closeSubList();
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },

    touchMoveS(event) {
      let scrollBox = document.getElementById("subArea");
      const currentY = event.touches[0].clientY;
      const scrollTop = scrollBox.scrollTop;

      if (scrollTop <= 0 && currentY > this.startY) {
        event.preventDefault();
      }
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
      let timeNow = new Date().getTime();
      if (timeNow - this.startTime < 1000) {
        if (this.isSetting) {
          this.isSetting = false;
          if (!this.isSingle) {
            this.currentMedia.addEventListener("timeupdate", this.syncSub);
          }
          return;
        }
        if (this.showRevision) {
          this.showRevision = false;
          if (!this.isSingle) {
            this.currentMedia.addEventListener("timeupdate", this.syncSub);
          }
          return;
        }
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
        this.showEditNew = true;
        this.newWord = window
          .getSelection()
          .toString()
          .trim()
          .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
      } else {
        if (timeNow - this.startTime < 1000)
          window.getSelection().removeAllRanges();
        this.fixbug1();
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
        this.cleanUp1();
        this.cleanUp2();
        this.showEditNew = true;
        this.newWord = window
          .getSelection()
          .toString()
          .trim()
          .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
      } else {
        this.fixbug1();
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
      this.showEditNew = false;
    },

    handleAutoStop() {
      if (this.timeOutId2) clearTimeout(this.timeOutId2);
      if (
        (this.autoPlay &&
          this.autoPlayNext &&
          this.isSingle &&
          this.autoStop) ||
        (!this.isSingle && this.autoStop)
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
        this.regions &&
        this.regions.regions.length > this.srtSubtitlesLength
      ) {
        if (!this.altPressed && !this.isMobile && this.disableDrag) {
          this.disableDrag();
        }
        this.updateRgns();
      }
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
      let res = [...arr];
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
            if (this.isSingle && !this.autoPlay) return;
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
        } else {
          this.cleanUp2();
          this.cleanUp1();
          if (this.sentenceIndex == 1) return;
          this.isSwitching = true;
          if (this.random) this.sentenceIndex = this.getRandomInt();
          else this.sentenceIndex = this.sentenceIndex - 1;
          setTimeout(() => {
            this.isSwitching = false;
          }, 200);
          if (this.isSingle && !this.autoPlay) return;
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
        }
      } else if (
        x < 0 &&
        mode == "SWITCHIMG" &&
        this.sentenceIndex <= this.srtSubtitles.length
      ) {
        if (this.isEditSubandNotes || this.isDictation) {
          this.toBlur();
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
            if (this.isSingle && !this.autoPlay) return;
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
        } else {
          this.cleanUp2();
          this.cleanUp1();
          if (this.sentenceIndex == this.srtSubtitles.length) return;
          this.isSwitching = true;
          if (this.random) this.sentenceIndex = this.getRandomInt();
          else this.sentenceIndex = this.sentenceIndex + 1;
          setTimeout(() => {
            this.isSwitching = false;
          }, 200);
          if (this.isSingle && !this.autoPlay) return;
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
        }
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
      const currentTime = media.currentTime;
      const endFinal = Math.min(this.loopEnd, this.srtSubtitles.length);

      if (
        this.nextLoopPlay &&
        (currentTime >=
          Math.min(
            this.srtSubtitles[endFinal - 1].endTime,
            media.duration - 0.05
          ) ||
          currentTime < this.srtSubtitles[this.loopStart - 1].startTime)
      ) {
        media.currentTime = this.srtSubtitles[this.loopStart - 1].startTime;
        return;
      }

      let left = 0;
      let right = this.srtSubtitles.length - 1;
      let index = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const subtitle = this.srtSubtitles[mid];
        if (
          currentTime >= subtitle.startTime &&
          currentTime <= subtitle.endTime
        ) {
          index = mid;
          break;
        } else if (currentTime < subtitle.startTime) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }

      if (index !== -1) {
        this.sentenceIndex = index + 1;
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
        if (currentTime < this.srtSubtitles[0].startTime) {
          this.sentenceIndex = 1;
        } else if (
          currentTime > this.srtSubtitles[this.srtSubtitles.length - 1].endTime
        ) {
          this.sentenceIndex = this.srtSubtitles.length;
        } else {
          for (let i = 0; i < this.srtSubtitles.length - 1; i++) {
            if (
              currentTime < this.srtSubtitles[i + 1].startTime &&
              currentTime > this.srtSubtitles[i].endTime
            ) {
              this.sentenceIndex = i + 1;
              break;
            }
          }
        }
      }
    },

    curSpeed() {
      var cSpeed = this.currentSpeed.replaceAll(",", " ");
      var nowSpeed;
      cSpeed = cSpeed.replaceAll("   ", " ");
      cSpeed = cSpeed.replaceAll("  ", " ");
      if (cSpeed.split(" ")[this.playCount]) {
        if (this.onTempSpeed) {
          this.normalSpeed = Number(cSpeed.split(" ")[this.playCount]);
          nowSpeed = this.tempSpeed;
        } else {
          nowSpeed = Number(cSpeed.split(" ")[this.playCount]);
        }
      } else {
        if (this.onTempSpeed) {
          this.normalSpeed = 1;
          nowSpeed = this.tempSpeed;
        } else {
          nowSpeed = 1;
        }
      }
      return nowSpeed;
    },

    playSection() {
      if (this.isDictation && !this.isEditSubandNotes && this.dRead == 1) {
        this.cleanUp1();
        this.cleanUp2();
        return;
      }
      if (this.currentMedia && this.currentMedia.removeEventListener) {
        this.currentMedia.removeEventListener("timeupdate", this.syncSub);
      }
      if (!this.isReadyToPlay) return;
      if (this.currentMedia) {
        this.startTime = new Date().getTime();
        if (this.isIphone) {
          setTimeout(() => {
            if (this.readOriginByTTS || this.fakeAudio) {
              this.audioEnded = false;
              if (this.isSystemTTS == "Yes") this.testTTSVoiceO(2);
              else this.testTTSurlO(2);
            } else this.currentMedia.play();
          }, 20);
        } else {
          if (this.readOriginByTTS || this.fakeAudio) {
            this.audioEnded = false;
            if (this.isSystemTTS == "Yes") this.testTTSVoiceO(2);
            else this.testTTSurlO(2);
          } else this.currentMedia.play();
        }
        this.currentMedia.playbackRate = this.curSpeed();
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
          let tempS = Math.max(
            this.currentMedia.currentTime - this.retraceTime,
            this.srtSubtitles[this.sentenceIndex - 1].startTime
          );

          let startA = Math.min(this.currentMedia.duration - 1, tempS);
          this.currentMedia.currentTime = startA;
          playLength =
            (Math.min(
              this.srtSubtitles[this.sentenceIndex - 1].endTime,
              this.currentMedia.duration - 0.5
            ) -
              this.currentMedia.currentTime) /
              this.currentMedia.playbackRate -
            0.3;
          this.fromRetrace = false;
        } else {
          let tempS = this.srtSubtitles[this.sentenceIndex - 1].startTime;

          let startA = Math.min(this.currentMedia.duration - 1, tempS);
          this.currentMedia.currentTime = startA;
        }
        if (!this.readOriginByTTS && !this.fakeAudio)
          this.timeOutId = setTimeout(() => {
            this.isEnd();
          }, playLength * 1000);
        else
          this.timeOutId = setTimeout(() => {
            this.isEnd();
          }, 1000);
      }
    },
    isEnd() {
      this.intervalId = setInterval(() => {
        this.sessionEnd();
      }, 10);
    },

    sessionEnd() {
      this.timeDiff = (new Date().getTime() - this.startTime) / 1000;
      // subtitle timestamp exceed the media length.
      if (
        this.timeDiff > this.sessionLength &&
        this.srtSubtitles[this.sentenceIndex - 1].endTime <=
          this.currentMedia.duration &&
        !this.readOriginByTTS &&
        !this.fakeAudio
      ) {
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
        (!this.readOriginByTTS &&
          !this.fakeAudio &&
          this.currentMedia.currentTime >=
            Math.min(
              this.srtSubtitles[this.sentenceIndex - 1].endTime,
              this.currentMedia.duration - 0.4
            )) ||
        (this.readOriginByTTS && this.audioEnded) ||
        (this.fakeAudio && this.audioEnded)
      ) {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.currentMedia.pause();
        if (this.isDictation && !this.isEditSubandNotes && this.dRead == 2) {
          this.cleanUp1();
          this.cleanUp2();
          return;
        }
        if (this.playCount >= this.repeatTimes - 1) {
          if (this.replayFromStart) this.playCount = 0;
          this.cleanUp1();
          if (
            this.isUtterTransLine &&
            !this.isUtterTransLineFirstly &&
            this.isPauseAfterFirstDone &&
            !this.isEditSubandNotes
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
                !(
                  this.showSubtitleList &&
                  this.srtSubtitles !== this.srtSubtitlesSearch
                ) &&
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
                if (!this.autoPlay) {
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
            !(
              this.showSubtitleList &&
              this.srtSubtitles !== this.srtSubtitlesSearch
            ) &&
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
            if (!this.autoPlay) {
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
      if (this.isOriginalLine1 == 1) {
        this.lineNumOfTrans = 2;
      } else {
        this.lineNumOfTrans = 1;
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
        "PDJWordList::" +
        this.PDJWordListContent;
      this.hasPrivate = false;
      this.tempFavContent = favContent;
      this.hasConfirmed = true;
      this.saveNow();
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
        "::" +
        JSON.stringify(this.showArrow) +
        "::" +
        JSON.stringify(this.transcribeUrl) +
        "::" +
        JSON.stringify(this.targetLanguage) +
        "::" +
        JSON.stringify(this.translatorUrl) +
        "::" +
        JSON.stringify(this.isCustomFont) +
        "::" +
        JSON.stringify(this.customCss1) +
        "::" +
        JSON.stringify(this.customCss2) +
        "::" +
        JSON.stringify(this.langInOriginLine) +
        "::" +
        JSON.stringify(this.lineNumOfOrigin) +
        "::" +
        JSON.stringify(this.TTSurlO) +
        "::" +
        JSON.stringify(this.readOriginByTTS) +
        "::" +
        JSON.stringify(this.autoRealCheck) +
        "::" +
        JSON.stringify(this.allowLoadDiction) +
        "::" +
        JSON.stringify(this.typingSound) +
        "::" +
        JSON.stringify(this.isFromLocal) +
        "::"
      );
    },

    save() {
      if (
        !this.isReadyToPlay &&
        !(this.isFavOnPlay && this.isPlayFullFavList)
      ) {
        return;
      }

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
        "PDJWordList::" +
        this.PDJWordListContent;
      this.tempFavContent = favContent;
      this.saveNow();
    },

    async saveNow() {
      if (this.notSaveFav) {
        setTimeout(() => {
          this.notSaveFav = false;
        }, 400);
        return;
      }
      this.notSaveFav = true;
      setTimeout(() => {
        this.notSaveFav = false;
      }, 400);
      if (
        window.localStorage.getItem("server" + this.favFileName) &&
        window.localStorage.getItem("server" + this.favFileName) ==
          this.tempFavContent
      )
        return;
      window.localStorage.setItem(this.favFileName, this.tempFavContent);
      if (this.onOffline) {
        window.localStorage.setItem(this.favNotUpload, "1");
        return;
      }
      window.localStorage.setItem(this.favNotUpload, "1");
      try {
        await api.post("/files" + this.favFileName, this.tempFavContent, true);
        window.localStorage.setItem(
          "server" + this.favFileName,
          this.tempFavContent
        );
        window.localStorage.removeItem(this.favNotUpload);
      } catch (error) {
        return;
      }
    },

    async savePeaks(peaks) {
      let p = JSON.stringify(peaks);
      try {
        await api.post("/files/!PDJ/peaks/" + this.mediaName + ".txt", p, true);
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
      var oldContent = this.reqF.content.split("\n\n")[this.sentenceIndex - 1];

      var newContent =
        oldContent.split("\n")[0] + "\n" + oldContent.split("\n")[1];
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

      this.reqF.content = this.reqF.content.replace(oldContent, newContent);
      this.saveSubNow();
    },

    saveSub1() {
      if (this.onRUdo) {
        return;
      }
      if (!this.onEdit) return;
      this.onEdit = false;
      if (!this.isDragging) this.tempOldContent = this.reqF.content;
      this.isDragging = true;
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
        !this.isDragging &&
        this.startTimeTemp >= this.srtSubtitles[this.sentenceIndex - 1].endTime
      )
        this.startTimeTemp =
          this.srtSubtitles[this.sentenceIndex - 1].endTime - 0.001;

      this.startTimeTemp = parseFloat(this.startTimeTemp.toFixed(3));
      var tempContent = this.reqF.content;
      var oldContent =
        this.srtSubtitles[this.sentenceIndex - 1].timeStamp.split(" --> ")[0] +
        " --> ";
      var time = this.convertToHMS(this.startTimeTemp * 1000);
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
          this.srtSubtitles[this.sentenceIndex - 2].endTime * 1000 + 1
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
      if (this.tempOldContent == this.reqF.content) return;
      if (this.timeOutId5) clearTimeout(this.timeOutId5);
      this.timeOutId5 = setTimeout(() => {
        this.saveSubNow();
      }, 100);
    },

    saveSub2() {
      if (this.onRUdo) {
        return;
      }
      if (!this.onEdit) return;
      this.onEdit = false;
      if (!this.isDragging) {
        this.tempOldContent = this.reqF.content;
      }

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
      if (this.tempOldContent == this.reqF.content) return;
      if (this.timeOutId5) clearTimeout(this.timeOutId5);
      if (this.isDragging)
        this.timeOutId5 = setTimeout(() => {
          this.onRUdo = false;
          this.saveSubNow();
        }, 100);
      else this.saveSubNow();
    },

    editHotkeys(timeStamp, event) {
      if (
        this.altPressed &&
        this.ctrlPressed &&
        event.button == 0 &&
        this.sentenceIndex < this.srtSubtitles.length
      ) {
        event.preventDefault();
        this.cleanUp1();
        this.cleanUp2();
        this.mergeSentence();
        this.toDisableDrag();
      } else if (this.altPressed && event.button == 0) {
        event.preventDefault();
        this.cleanUp1();
        this.cleanUp2();
        this.splitSentence(timeStamp);
        this.toDisableDrag();
      }
    },

    async saveSpecialSub(x) {
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      if (x > 1 && x < 6) {
        this.onRUdo = true;
        setTimeout(() => {
          this.onRUdo = false;
        }, 1000);
        this.changeOld[this.historyIndex] = formatContent;
      }
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
              " " +
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
          } else if (x == 6) {
            newContent =
              textSubtitles[i].split("\n")[2] +
              "\t" +
              textSubtitles[i].split("\n")[3] +
              "\t" +
              textSubtitles[i].split("\n")[4];
          } else if (x == 7) {
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
              " " +
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
          } else if (x == 6) {
            newContent =
              textSubtitles[i].split("\n")[2] +
              "\n" +
              textSubtitles[i].split("\n")[3];
          } else if (x == 7) {
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
          } else if (x == 6) {
            newContent = textSubtitles[i].split("\n")[2];
          } else if (x == 7) {
            newContent = textSubtitles[i].split("\n")[2];
          }
        }

        if (x !== 1)
          formatContent = formatContent.replace(textSubtitles[i], newContent);
      }

      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      if (x > 1 && x < 6) {
        formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
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
        if (x == 5) {
          window.localStorage.removeItem(this.mediaName + "line1");
          window.localStorage.removeItem(this.mediaName + "line2");
          if (this.lineNumOfTrans == 1) {
            this.lineNumOfTrans = 2;
          } else this.lineNumOfTrans = 1;
        }
        this.showsubTools = false;
        if (this.timeOutId3) clearTimeout(this.timeOutId3);
        this.timeOutId3 = setTimeout(() => {
          this.saveSubFinal();
        }, 1000);
      } else {
        var currentTime = new Date();
        let id = Math.floor(currentTime.getTime() / 1000);
        let today = currentTime.toLocaleDateString("af").replaceAll("/", "-");
        var pdjBackUp = " ";
        if (x == 1) pdjBackUp = "BackUp-" + today + "-" + id + ".srt";
        else if (x == 6) pdjBackUp = "text-" + today + "-" + id + ".txt";
        else if (x == 7) pdjBackUp = "text-serial-" + today + "-" + id + ".txt";
        else if (x == 8) {
          pdjBackUp =
            this.mediaName.slice(0, -4) +
            "-newWord-" +
            today +
            "-" +
            id +
            ".txt";
          formatContent =
            "No.\tNew Word\tTranslate\tSentence\tSentence\tSentence Note\n";

          if (this.newWordList.length < 1) {
            this.openAlert(1, this.$t("repeater.noNewWord"));
            this.inSubProcess = false;
            return;
          }
          for (let i = 1; i <= this.newWordList.length; i++) {
            let newWord = this.newWordList[i - 1];
            let a = newWord.trans.trim();
            let c = this.srtSubtitles[newWord.num].content.split("\r\n")[0]
              ? this.srtSubtitles[newWord.num].content.split("\r\n")[0].trim()
              : "";
            let d = this.srtSubtitles[newWord.num].content.split("\r\n")[1]
              ? this.srtSubtitles[newWord.num].content.split("\r\n")[1].trim()
              : "";
            let e = this.srtSubtitles[newWord.num].content
              .split("\r\n")[2]
              .replace(/\[.*?\];/g, "")
              ? this.srtSubtitles[newWord.num].content
                  .split("\r\n")[2]
                  .replace(/\[.*?\];/g, "")
                  .trim()
              : "";
            formatContent =
              formatContent +
              i +
              ".\t" +
              newWord.origin.trim() +
              "\t" +
              a +
              "\t" +
              c +
              "\t" +
              d +
              "\t" +
              e +
              "\n";
          }
        } else if (x == 9) {
          pdjBackUp = "fav-sentences-" + today + "-" + id + ".txt";
          formatContent = "";

          if (this.currentFileFavList.length < 1) {
            this.openAlert(1, this.$t("repeater.noNewFav"));
            this.inSubProcess = false;
            return;
          }
          for (let i = 1; i <= this.currentFileFavList.length; i++) {
            let newFav = this.currentFileFavList[i - 1].content.replaceAll(
              "\r\n",
              "\n"
            );
            formatContent = formatContent + i + "\n" + newFav + "\n\n";
          }
        } else if (x == 10) {
          pdjBackUp =
            "fav-sentences-of-user-" +
            this.user.username +
            "-" +
            today +
            "-" +
            id +
            ".txt";
          formatContent = "";

          if (this.favList.length < 1) {
            this.openAlert(1, this.$t("repeater.noNewFav1"));
            this.inSubProcess = false;
            return;
          }
          for (let i = 1; i <= this.favList.length; i++) {
            let newFav = this.favList[i - 1].content.replaceAll("\r\n", "\n");
            formatContent = formatContent + i + "\n" + newFav + "\n\n";
          }
        }

        try {
          let path = "";
          if (x == 10)
            path =
              "/files/!PDJ/user-" +
              this.user.username +
              "/Repeater-backup/" +
              pdjBackUp;
          else
            path =
              "/files/!PDJ/user-" +
              this.user.username +
              "/Repeater-backup/" +
              this.reqF.name +
              "-" +
              pdjBackUp;
          await api.post(path, formatContent, true);
          this.showsubTools = false;
        } catch (error) {
          this.openAlert(1, this.$t("repeater.alert009"));
          this.inSubProcess = false;
          return;
        }
      }
    },

    deleteSentence() {
      if (this.srtSubtitlesLength == 1) return;
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
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

    deleteWord(x) {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      var oldIndex = this.srtSubtitles[this.sentenceIndex - 1].sn;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");
      var newContent;
      if (x !== 1) {
        var delWord = textSubtitles[this.sentenceIndex - 1].split(
          "[" + this.deleteNewWord + "::"
        );
        const index = delWord[1].indexOf("]");
        let part2 = delWord[1].slice(index + 1);
        part2 = part2.replace(/^;/, "");
        newContent = delWord[0] + part2;
      } else {
        if (this.isFavOnPlay) {
          newContent = textSubtitles[oldIndex - 1].replaceAll("[star];", "");
        } else
          newContent = textSubtitles[this.sentenceIndex - 1].replaceAll(
            "[star];",
            ""
          );
      }
      if (this.isFavOnPlay && x == 1)
        formatContent = formatContent.replace(
          textSubtitles[oldIndex - 1],
          newContent
        );
      else
        formatContent = formatContent.replace(
          textSubtitles[this.sentenceIndex - 1],
          newContent
        );
      formatContent = formatContent.replaceAll("\n\n\n\n", "\n\n");
      formatContent = formatContent.replaceAll(/^\s*\r?\n|\r?\n\s*$/g, "");
      formatContent = formatContent.replaceAll(";;", ";");
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

    mergeSentence() {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
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

      if (this.sentenceIndex == 1) {
        this.sentenceIndex = 2;
      } else this.sentenceIndex = 1;

      setTimeout(() => {
        this.sentenceIndex = tempI;
      }, 10);

      window.localStorage.setItem(this.mediaName, formatContent);
      this.saveSubFinal();
    },

    addSentence(start, end) {
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      this.changeOld[this.historyIndex] = formatContent;

      var textSubtitles = formatContent.split("\n\n");
      var line2 = " ";
      var newStartTime;
      var newEndTime;
      if (start) {
        var sTime = this.convertToHMS(start * 1000 - this.timeStampChangeStart);
        newStartTime =
          sTime.hours +
          ":" +
          sTime.minutes +
          ":" +
          sTime.seconds +
          "," +
          sTime.milliseconds;

        for (var i = 1; i <= this.srtSubtitlesLength; ++i) {
          if (start < this.srtSubtitles[0].startTime) {
            this.sentenceIndex = 1;
            break;
          } else if (start > this.srtSubtitles[i - 1].endTime) {
            this.sentenceIndex = i;
          } else if (start < this.srtSubtitles[i - 1].endTime) {
            break;
          }
        }
        if (
          start < this.srtSubtitles[0].startTime &&
          end >= this.srtSubtitles[0].startTime
        )
          end = this.srtSubtitles[0].startTime - 0.001;
        else if (
          this.srtSubtitles[this.sentenceIndex] &&
          end >= this.srtSubtitles[this.sentenceIndex].startTime
        )
          end = this.srtSubtitles[this.sentenceIndex].startTime - 0.001;
        var eTime = this.convertToHMS(end * 1000 - this.timeStampChangeEnd + 1);
        newEndTime =
          eTime.hours +
          ":" +
          eTime.minutes +
          ":" +
          eTime.seconds +
          "," +
          eTime.milliseconds;
      } else {
        newStartTime = textSubtitles[this.sentenceIndex - 1]
          .split("\n")[1]
          .split(" --> ")[1];
        if (
          this.sentenceIndex < this.srtSubtitles.length &&
          this.srtSubtitles[this.sentenceIndex].startTime -
            this.srtSubtitles[this.sentenceIndex - 1].endTime <=
            3
        ) {
          newEndTime = textSubtitles[this.sentenceIndex]
            .split("\n")[1]
            .split(" --> ")[0];
          if (
            this.srtSubtitles[this.sentenceIndex].startTime -
              this.srtSubtitles[this.sentenceIndex - 1].endTime <=
            0.0015
          ) {
            var timeSS = this.convertToHMS(
              this.srtSubtitles[this.sentenceIndex - 1].endTime * 1000 -
                this.timeStampChangeEnd
            );
            newStartTime =
              timeSS.hours +
              ":" +
              timeSS.minutes +
              ":" +
              timeSS.seconds +
              "," +
              timeSS.milliseconds;
          }
        } else {
          var timeS = this.convertToHMS(
            this.srtSubtitles[this.sentenceIndex - 1].endTime * 1000 -
              this.timeStampChangeEnd +
              1 +
              500
          );

          var timeE = this.convertToHMS(
            this.srtSubtitles[this.sentenceIndex - 1].endTime * 1000 -
              this.timeStampChangeEnd +
              1 +
              3000
          );

          newStartTime =
            timeS.hours +
            ":" +
            timeS.minutes +
            ":" +
            timeS.seconds +
            "," +
            timeS.milliseconds;

          newEndTime =
            timeE.hours +
            ":" +
            timeE.minutes +
            ":" +
            timeE.seconds +
            "," +
            timeE.milliseconds;
        }
      }
      var line1 = "0" + textSubtitles[this.sentenceIndex - 1].split("\n")[0];
      if (start < this.srtSubtitles[0].startTime) line1 = "1";
      line2 = newStartTime + " --> " + newEndTime;

      var line3 = " ";
      var line4 = " ";
      let newLine = line1 + "\n" + line2 + "\n" + line3 + "\n" + line4;
      let newContent = textSubtitles[this.sentenceIndex - 1] + "\n\n" + newLine;
      if (start < this.srtSubtitles[0].startTime)
        formatContent = newLine + "\n\n" + formatContent;
      else
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
      if (line1 !== "1") this.sentenceIndex = this.sentenceIndex + 1;
      window.localStorage.setItem(this.mediaName, formatContent);
      this.saveSubFinal();
    },

    replaceSentence(type) {
      if (this.rOldWord == "" || !this.srtSubtitlesSearch[0]) return;
      this.onRUdo = true;
      setTimeout(() => {
        this.onRUdo = false;
      }, 1000);
      var formatContent = this.reqF.content;
      formatContent = this.formatAll(formatContent);
      var formatContent2 = formatContent;
      this.changeOld[this.historyIndex] = formatContent;
      var textSubtitles = formatContent.split("\n\n");
      var newContent;
      var chgContent;
      var firstPart;
      var secondPart;
      for (var i = 0; i < this.srtSubtitlesSearch.length; ++i) {
        var ni = this.srtSubtitlesSearch[i].sn;
        if (this.selectedReplaceLine.includes("1,2,3")) {
          firstPart =
            textSubtitles[ni - 1].split("\n")[0] +
            "\n" +
            textSubtitles[ni - 1].split("\n")[1] +
            "\n";
          secondPart = textSubtitles[ni - 1].replace(firstPart, "");

          if (this.isCaseSensitive) {
            secondPart = secondPart.replaceAll(this.rOldWord, this.rNewWord);
          } else {
            let regex = new RegExp(this.rOldWord, "gi");
            secondPart = secondPart.replace(regex, this.rNewWord);
          }

          newContent = firstPart + secondPart;
        } else if (this.selectedReplaceLine.includes("1")) {
          firstPart =
            textSubtitles[ni - 1].split("\n")[0] +
            "\n" +
            textSubtitles[ni - 1].split("\n")[1] +
            "\n";

          if (this.isCaseSensitive) {
            chgContent = textSubtitles[ni - 1]
              .split("\n")[2]
              .replaceAll(this.rOldWord, this.rNewWord);
          } else {
            let regex = new RegExp(this.rOldWord, "gi");
            chgContent = textSubtitles[ni - 1]
              .split("\n")[2]
              .replace(regex, this.rNewWord);
          }

          newContent = textSubtitles[ni - 1].replace(
            firstPart + textSubtitles[ni - 1].split("\n")[2],
            firstPart + chgContent
          );
        } else if (this.selectedReplaceLine.includes("2")) {
          firstPart =
            textSubtitles[ni - 1].split("\n")[0] +
            "\n" +
            textSubtitles[ni - 1].split("\n")[1] +
            "\n" +
            textSubtitles[ni - 1].split("\n")[2] +
            "\n";
          if (textSubtitles[ni - 1].split("\n")[3]) {
            if (this.isCaseSensitive) {
              chgContent = textSubtitles[ni - 1]
                .split("\n")[3]
                .replaceAll(this.rOldWord, this.rNewWord);
            } else {
              let regex = new RegExp(this.rOldWord, "gi");
              chgContent = textSubtitles[ni - 1]
                .split("\n")[3]
                .replace(regex, this.rNewWord);
            }

            newContent = textSubtitles[ni - 1].replace(
              firstPart + textSubtitles[ni - 1].split("\n")[3],
              firstPart + chgContent
            );
          } else newContent = textSubtitles[ni - 1];
        }

        formatContent = formatContent.replace(
          textSubtitles[ni - 1],
          newContent
        );
        if (this.sentenceIndex == ni) this.searchIndex = i;
      }
      if (type == 1) {
        var hasMore = false;
        if (this.selectedReplaceLine.includes("1,2,3")) {
          firstPart =
            textSubtitles[this.sentenceIndex - 1].split("\n")[0] +
            "\n" +
            textSubtitles[this.sentenceIndex - 1].split("\n")[1] +
            "\n";
          secondPart = textSubtitles[this.sentenceIndex - 1].replace(
            firstPart,
            ""
          );
          if (
            (this.isCaseSensitive && !secondPart.includes(this.rOldWord)) ||
            (!this.isCaseSensitive &&
              !secondPart.toLowerCase().includes(this.rOldWord.toLowerCase()))
          ) {
            this.openAlert(1, this.$t("repeater.alert011"));
            return;
          }
          if (this.isCaseSensitive) {
            secondPart = secondPart.replace(this.rOldWord, this.rNewWord);
            if (secondPart.includes(this.rOldWord)) hasMore = true;
          } else {
            let regex = new RegExp(this.rOldWord, "i");
            secondPart = secondPart.replace(regex, this.rNewWord);
            if (secondPart.toLowerCase().includes(this.rOldWord.toLowerCase()))
              hasMore = true;
          }
          newContent = firstPart + secondPart;
        } else if (this.selectedReplaceLine.includes("1")) {
          firstPart =
            textSubtitles[this.sentenceIndex - 1].split("\n")[0] +
            "\n" +
            textSubtitles[this.sentenceIndex - 1].split("\n")[1] +
            "\n";
          if (
            (this.isCaseSensitive &&
              !textSubtitles[this.sentenceIndex - 1]
                .split("\n")[2]
                .includes(this.rOldWord)) ||
            (!this.isCaseSensitive &&
              !textSubtitles[this.sentenceIndex - 1]
                .split("\n")[2]
                .toLowerCase()
                .includes(this.rOldWord.toLowerCase()))
          ) {
            this.openAlert(1, this.$t("repeater.alert011"));
            return;
          }

          if (this.isCaseSensitive) {
            chgContent = textSubtitles[this.sentenceIndex - 1]
              .split("\n")[2]
              .replace(this.rOldWord, this.rNewWord);
            if (chgContent.includes(this.rOldWord)) hasMore = true;
          } else {
            let regex = new RegExp(this.rOldWord, "i");
            chgContent = textSubtitles[this.sentenceIndex - 1]
              .split("\n")[2]
              .replace(regex, this.rNewWord);
            if (chgContent.toLowerCase().includes(this.rOldWord.toLowerCase()))
              hasMore = true;
          }

          newContent = textSubtitles[this.sentenceIndex - 1].replace(
            firstPart + textSubtitles[this.sentenceIndex - 1].split("\n")[2],
            firstPart + chgContent
          );
        } else if (this.selectedReplaceLine.includes("2")) {
          firstPart =
            textSubtitles[this.sentenceIndex - 1].split("\n")[0] +
            "\n" +
            textSubtitles[this.sentenceIndex - 1].split("\n")[1] +
            "\n" +
            textSubtitles[this.sentenceIndex - 1].split("\n")[2] +
            "\n";
          if (textSubtitles[this.sentenceIndex - 1].split("\n")[3]) {
            if (
              (this.isCaseSensitive &&
                !textSubtitles[this.sentenceIndex - 1]
                  .split("\n")[3]
                  .includes(this.rOldWord)) ||
              (!this.isCaseSensitive &&
                !textSubtitles[this.sentenceIndex - 1]
                  .split("\n")[3]
                  .toLowerCase()
                  .includes(this.rOldWord.toLowerCase()))
            ) {
              this.openAlert(1, this.$t("repeater.alert011"));
              return;
            }

            if (this.isCaseSensitive) {
              chgContent = textSubtitles[this.sentenceIndex - 1]
                .split("\n")[3]
                .replace(this.rOldWord, this.rNewWord);
              if (chgContent.includes(this.rOldWord)) hasMore = true;
            } else {
              let regex = new RegExp(this.rOldWord, "i");
              chgContent = textSubtitles[this.sentenceIndex - 1]
                .split("\n")[3]
                .replace(regex, this.rNewWord);
              if (
                chgContent.toLowerCase().includes(this.rOldWord.toLowerCase())
              )
                hasMore = true;
            }

            newContent = textSubtitles[this.sentenceIndex - 1].replace(
              firstPart + textSubtitles[this.sentenceIndex - 1].split("\n")[3],
              firstPart + chgContent
            );
          } else newContent = textSubtitles[this.sentenceIndex - 1];
        }
        formatContent = formatContent2.replace(
          textSubtitles[this.sentenceIndex - 1],
          newContent
        );
        if (!hasMore) {
          if (this.srtSubtitlesSearch[this.searchIndex + 1])
            this.sentenceIndex =
              this.srtSubtitlesSearch[this.searchIndex + 1].sn;
          else this.sentenceIndex = this.srtSubtitlesSearch[0].sn;
        }
      }

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

      var line3 = " ";
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
      this.isDragging = false;
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
            "/files/!PDJ/user-" +
              this.user.username +
              "/Repeater-backup/" +
              this.reqF.name +
              "-" +
              pdjBackUp,
            this.req.content,
            true
          );
        }
        if (this.reqF.size == 0) {
          setTimeout(() => {
            location.reload();
          }, 100);
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
      this.refresh();
      if (!this.undoAlert) {
        this.undoAlert = true;
        setTimeout(() => {
          this.undoAlert = false;
        }, 300);
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
      this.refresh();
      if (!this.redoAlert) {
        this.redoAlert = true;
        setTimeout(() => {
          this.redoAlert = false;
        }, 300);
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
      } else if (!this.isSingle) {
        setTimeout(() => {
          this.currentMedia.addEventListener("timeupdate", this.syncSub);
        }, 10);
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
      if (
        !this.isReadyToPlay ||
        this.showsubTools ||
        this.isSetting ||
        this.showsubTools1
      )
        return;

      if (
        (event.key === "Control" || event.keyCode === 17) &&
        this.isEditSubandNotes &&
        !this.ctrlPressed
      ) {
        this.ctrlPressed = true;
      } else if (
        event.key === "Alt" &&
        this.isEditSubandNotes &&
        !this.altPressed
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.altPressed = true;
      } else if (
        (event.key === "Delete" || event.keyCode === 46) &&
        this.altPressed &&
        this.isEditSubandNotes
      ) {
        // Alt + Delete
        this.deleteSentence();
        this.toDisableDrag();
      } else if (
        event.key === "Enter" &&
        this.altPressed &&
        this.isEditSubandNotes
      ) {
        this.cleanUp1();
        this.cleanUp2();
        this.note = this.noteTemp;
        this.subFirstLine = this.subFirstLineTemp;
        this.subSecLine = this.subSecLineTemp;
        setTimeout(() => {
          this.addSentence();
        }, 200);
      }

      if (
        (event.key === "Enter" || event.keyCode === 13) &&
        this.isDictation &&
        !this.showEditNew
      ) {
        event.preventDefault();
        this.isCheck = !this.isCheck;
      }

      if (
        (event.key === "Delete" || event.keyCode === 46) &&
        this.isDictation &&
        !this.showEditNew
      ) {
        event.preventDefault();
        this.dictationContent = "";
      }

      if (
        (event.which === 39 ||
          ((event.key === "PageDown" ||
            event.keyCode === 34 ||
            (event.key === "Tab" && !this.showCloze)) &&
            this.isDictation &&
            !this.showEditNew)) &&
        this.sentenceIndex < this.srtSubtitles.length
      ) {
        // right arrow
        if (
          event.key === "PageDown" ||
          event.keyCode === 34 ||
          (event.key === "Tab" && !this.showCloze)
        ) {
          event.preventDefault();
          this.downArrow = true;
        }
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
              .contains(document.activeElement) &&
            !this.downArrow) ||
          (document.getElementById("showEditNew") &&
            document
              .getElementById("showEditNew")
              .contains(document.activeElement))
        )
          return;
        this.cleanUp2();
        this.cleanUp1();
        if (this.downArrow) this.downArrow = false;
        if (this.random) this.sentenceIndex = this.getRandomInt();
        else this.sentenceIndex = this.sentenceIndex + 1;
        if (this.isSingle && !this.autoPlay) return;
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
      } else if (
        (event.which === 37 ||
          ((event.key === "PageUp" || event.keyCode === 33) &&
            this.isDictation &&
            !this.showEditNew)) &&
        this.sentenceIndex > 1
      ) {
        // left arrow
        if (event.key === "PageUp" || event.keyCode === 33) {
          event.preventDefault();
          this.downArrow = true;
        }
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
              .contains(document.activeElement) &&
            !this.downArrow) ||
          (document.getElementById("showEditNew") &&
            document
              .getElementById("showEditNew")
              .contains(document.activeElement))
        )
          return;
        this.cleanUp2();
        this.cleanUp1();
        if (this.downArrow) this.downArrow = false;
        if (this.random) this.sentenceIndex = this.getRandomInt();
        else this.sentenceIndex = this.sentenceIndex - 1;
        if (this.isSingle && !this.autoPlay) return;
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
        event.preventDefault();
        this.cleanUp1();
      } else if (event.which === 40) {
        // down arrow
        event.preventDefault();
        this.cleanUp1();
        this.downArrow = true;
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
      if (event.key === "Alt") {
        this.altPressed = false;
      }
    },

    handleResize() {
      this.isLandscape = this.checkLandscape();
      this.mobileScreen = this.checkMobileScreen();
      this.resized = true;
    },
    closeSubList() {
      this.showSubtitleList = false;
      if (this.showNewWordList) {
        if (
          this.newWordList.length > 0 &&
          this.newWordList[this.indexOfNewWordList]
        )
          this.newWordList[this.indexOfNewWordList].showTrans = false;
        this.showNewWordList = false;
      }
      this.withTrans = false;
      if (!this.isSingle && !this.showNewWordList && !this.showSubtitleList) {
        this.currentMedia.addEventListener("timeupdate", this.syncSub);
      }
    },

    close() {
      if (this.prOutput) {
        this.prOutput = false;
        return;
      }
      if (this.isSetting) {
        this.onSetting();
        return;
      }
      if (this.showRevision) {
        this.switchRevisePlan();
        return;
      }
      if (this.showSubtitleList || this.showNewWordList || this.withTrans) {
        this.closeSubList();
        return;
      }
      if (this.isEditSubandNotes) {
        this.switchEditSubandNote();
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

<style scoped>
@font-face {
  font-family: "MyRelativeFont"; /* 自定义字体名称 */
  /* 相对路径：从当前组件所在目录（components）向上一级（到src），再进入assets/fonts */
  src: url("../../assets/fonts/myfont.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

/* 使用字体 */
.custom-text {
  font-family: "MyRelativeFont", sans-serif;
  font-size: 20px;
}

.percentage-control {
  margin-bottom: 20px;
}

.slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3498db;
  cursor: pointer;
  transition: background 0.3s;
}

.slider::-webkit-slider-thumb:hover {
  background: #2980b9;
}

.badge {
  display: inline-block;
  background-color: #e1f5fe;
  color: #0288d1;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.cloze-section {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 20px;
}

/* 句子模式样式 */
.cloze-sentence {
  color: wheat;
  font-size: 1.5em;
  margin-bottom: 45px;
  line-height: 1.8;
}

.word-item {
  margin: 0;
}

.blank-input {
  width: 9rem;
  padding: 6px 2px;
  background: gray;
  border: 2px solid #bdc3c7;
  border-radius: 4px;
  margin: 0 5px;
  text-align: center;
  transition: all 0.3s;
}

/* 单词模式样式 */
.cloze-word {
  text-align: center;
  margin-bottom: 45px;
}

.letters-container {
  color: wheat;
  font-size: 24px;
  letter-spacing: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.letter-input {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 2px solid #bdc3c7;
  border-radius: 4px;
  font-size: 20px;
  text-align: center;
  margin: 0 2px;
  transition: all 0.3s;
}

.fixed-letter {
  min-width: 30px;
  text-align: center;
}

/* 通用输入样式 */
.blank-input:focus,
.letter-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.blank-input.correct,
.letter-input.correct {
  border-color: #2ecc71;
  background-color: rgba(46, 204, 113);
}

.blank-input.incorrect,
.letter-input.incorrect {
  border-color: #e74c3c;
  background-color: #e66666;
}

.feedback {
  border-radius: 4px;
  text-align: center;
  font-size: 17px;
}

.game-container {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 0 10px;
}
.spelling-area {
  animation: fadeIn 0.5s ease;
}
.current-spelling {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  min-height: 45px;
  align-items: center;
  padding: 0 0 35px 0;
  border-radius: 0 0 8px 0;
}
.spelled-letter {
  width: 45px;
  height: 45px;
  background-color: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer; /* 新增：添加鼠标指针样式 */
}
/* 新增：添加悬停效果 */
.spelled-letter:not(.is-correct):hover {
  background-color: #e1e8ed;
  transform: scale(1.05);
}
.spelled-word {
  padding: 3px 8px;
  background-color: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  transition: all 0.3s ease;
  cursor: pointer; /* 新增：添加鼠标指针样式 */
}
/* 新增：添加悬停效果 */
.spelled-word:not(.is-correct):hover {
  background-color: #e1e8ed;
  transform: scale(1.05);
}
.is-correct .spelled-letter,
.is-correct .spelled-word {
  background-color: #2ecc71;
  color: white;
  cursor: default;
}
.correct-message {
  text-align: center;
  color: #2ecc71;
  font-size: 18px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.error-message {
  text-align: center;
  color: #e74c3c;
  font-size: 18px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.shuffled-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 45px;
}
.letter-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.1);
  position: relative;
}
.word-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.1);
}
.letter-btn:disabled,
.word-btn:disabled {
  background-color: #ecf0f1;
  color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.letter-btn:not(:disabled):hover,
.word-btn:not(:disabled):hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(52, 152, 219, 0.2);
}
.letter-btn:not(:disabled):active,
.word-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.1);
}
.control-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.undo-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #9b59b6;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}
.undo-btn:disabled {
  background-color: #bb8fce;
  cursor: not-allowed;
}
.undo-btn:not(:disabled):hover {
  background-color: #8e44ad;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #3498db;
}
.spelled-letter[title="空格"]::after,
.letter-btn[title="空格"]::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2c3e50;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.spelled-letter[title="空格"]:hover::after,
.letter-btn[title="空格"]:hover::after {
  opacity: 1;
}
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
.videoFullScreen {
  text-shadow: 2px 2px 2px #000;
  z-index: 1000;
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

.custom-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.custom-alert-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.alert-message-backLayer {
  overflow-y: auto;
  flex: 1;
}

.custom-alert-content button {
  margin-top: 10px;
  width: auto;
  max-width: 200px;
  align-self: center;
}

.subTools-overlay {
  z-index: 2010;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: top;
}

.subTools {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 51%;
  margin-top: 1em;
  height: 18.8em;
  font-size: 0.9em;
}
.subTools-content {
  flex-grow: 1;
}

.subTools-tabs {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #ccc;
  position: relative;
}

.subTools-tabs button {
  background: none;
  border: 1px solid transparent;
  border-bottom: none;
  cursor: pointer;
  padding: 8px 16px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  position: relative;
  bottom: -1px;
}

.subTools-tabs button.active {
  font-weight: bold;
  border-color: #ccc;
  border-bottom: 1px solid white;
  background-color: white;
}

.subTools-buttons {
  display: flex;
  justify-content: flex-end;
}

.subTools-buttons button {
  margin-left: 3px;
}

.popUp-mask {
  position: fixed;
  z-index: 2008;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;

  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s ease-in-out;
}

.popUp-backLayer {
  perspective: 1000px;
  touch-action: auto;
}

.popUp-container {
  width: 400px;
  padding: 10px 15px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  text-align: center;
  transform-style: preserve-3d;
  animation: scaleIn 0.6s ease-in-out;
  position: relative;
}

.popUp-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.popUp-body {
  max-height: 300px;
  overflow-y: auto;
  padding: 0;
}

.option-item {
  cursor: pointer;
  padding: 12px;
  margin: 8px 0;
  font-size: 16px;
  color: #555;
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.option-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background: #e8e8e8;
}

.popUp-footer {
  text-align: right;
  margin-top: 10px;
}

.popUp-default-button {
  padding: 4px 8px;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.popUp-default-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 738px) {
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

  .popUp-body {
    max-height: 285px;
  }

  .popUp-container {
    width: 300px;
  }

  .subTools {
    width: 95%;
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
.sw-vocabulary-reader {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.sw-header {
  text-align: center;
  padding: 0.5em;
}

.sw-title {
  color: #e0e0e0; /* 标题改为浅灰色 */
  margin: 0;
  font-weight: 700;
  font-size: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.sw-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background-color: #64b5f6; /* 调整强调色为亮蓝色 */
  border-radius: 2px;
}

.sw-toggle-btn {
  background-color: aqua;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sw-toggle-btn:hover {
  background-color: #1976d2; /* 按钮悬停颜色加深 */
  transform: translateY(-2px);
}

.sw-sentence-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  border-radius: 12px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
  width: 100%;
  max-height: 90%;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.sw-word-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.sw-word-card:hover {
  background-color: rgba(255, 255, 255, 0.05); /* 悬停时添加浅色背景 */
  transform: translateY(-3px);
}

/* 音标样式 */
.sw-phonetic {
  color: #64b5f6;
  font-size: 0.85rem;
  font-family: "Times New Roman", Times, serif;
  margin-bottom: 0.2rem; /* 保持固定间距 */
  opacity: 0;
  height: 1em;
  visibility: hidden; /* 隐藏但保持占位 */
  transition: all 0.3s ease;
}

.sw-show-phonetic {
  opacity: 1;
  visibility: visible; /* 显示时可见 */
}

/* 单词样式 */
.sw-word {
  font-size: 1.3rem;
  font-weight: 600;
  color: gold;
  margin-bottom: 0.2rem;
  text-align: center;
  transition: all 0.3s ease;
  padding: 0.2rem 0.5rem;
}

/* 朗读动画效果 */
.sw-speaking {
  color: #90caf9; /* 朗读中的单词颜色更亮 */
  animation: swPulse 1s ease-in-out;
}

@keyframes swPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(100, 181, 246, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(100, 181, 246, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(100, 181, 246, 0);
  }
}

/* 释义样式 */
.sw-definition {
  color: #bbbbbb; /* 释义改为中灰色 */
  font-size: 0.75rem;
  text-align: center;
  max-width: 120px;
  line-height: 1.4;
  opacity: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 2.8em;
}

.sw-show-definition {
  opacity: 1;
  visibility: visible; /* 显示时可见 */
}

.sw-instructions {
  color: #bbbbbb; /* 说明文本改为中灰色 */
  font-size: 0.9rem;
  margin: 0;
  padding: 0.5rem 1rem;
  background-color: rgba(100, 181, 246, 0.1); /* 说明文本背景改为透明蓝色 */
  border-radius: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sw-header {
    text-align: center;
    padding: 0.5em;
  }

  .sw-title {
    font-size: 1.5rem;
  }

  .sw-word {
    font-size: 1.1rem;
  }
}

#sentencePrintGenerator {
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  overflow-y: auto;
  height: calc(100% - 4.2em);
  top: 4.2em;
  position: absolute;
  width: 100%;
}

.prContainer {
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.prHeader {
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  color: white;
  padding: 20px 30px;
  justify-content: left !important;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.prSubtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.prContent {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.prSection {
  padding: 25px;
  border-bottom: 1px solid #eaeaea;
}

.prSectionTitle {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.prSectionTitle i {
  margin-right: 10px;
  color: #00b894;
}

.prWordList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.prWordItem {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  flex-wrap: wrap;
}

.prWordItem:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.prWordItem input[type="checkbox"] {
  margin-right: 12px;
  margin-top: 3px;
  transform: scale(1.2);
}

.prWordText {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
  width: calc(100% - 30px);
}

.prPartOfSpeech {
  margin-left: 30px;
  font-style: italic;
  color: #7f8c8d;
  font-size: 0.9rem;
  width: calc(100% - 30px);
}

.prSelectAll {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #e8f4fc;
  border-radius: 6px;
}

.prSelectAll input[type="checkbox"] {
  margin-right: 10px;
  transform: scale(1.2);
}

.prExcelOptions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.prOptionGroup {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

input[type="number"],
input[type="text"] {
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1.2em;
}

.prPreview {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.prPreviewTitle {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.prPreviewContent {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  min-height: 200px;
  overflow-x: auto;
}

.prPreviewTable {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
}

.prPreviewTable td {
  border: 1px solid #000;
  padding: 8px;
  text-align: center;
  height: 46px;
}

.prCheckboxCell {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.prCheckbox {
  width: 12px;
  height: 12px;
  border: 1px solid #7f8c8d;
  border-radius: 2px;
  display: inline-block;
  margin: 0 2px;
}

.prExportButtons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
}

.prExportBtn {
  padding: 12px 25px;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  border: none;
  min-width: 180px;
}

.prHtmlBtn {
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  color: white;
}

.prPrintBtn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
}

.prExportBtn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 206, 201, 0.4);
}

.prExportBtn:active {
  transform: translateY(0);
}

.prExportBtn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.prStats {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  color: #7f8c8d;
  font-size: 0.9rem;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 768px) {
  .prWordList {
    grid-template-columns: 1fr;
  }

  .prExcelOptions {
    grid-template-columns: 1fr;
  }

  .prSection {
    padding: 15px;
  }

  .prExportButtons {
    flex-direction: column;
    align-items: center;
  }

  .prStats {
    flex-direction: column;
    align-items: center;
  }
}
</style>
