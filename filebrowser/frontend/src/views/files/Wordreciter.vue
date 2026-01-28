<template>
  <div id="repeater" class="no-select" @touchmove.prevent>
    <div
      style="background: white; align-items: center; display: flex; height: 4em"
    >
      <button class="action" @click="close" :title="$t('buttons.close')">
        <i
          :style="{
            color: isSetting ? 'red' : 'blue',
          }"
          class="material-icons"
          >close</i
        >
      </button>

      <span
        v-if="
          !initReciter && studyWordList.length > 0 && !addWord && !insertWord
        "
      >
        &nbsp;
        {{ studyWordList[wordIndex - 1].familiarity }}

        &nbsp;&nbsp;[{{ studyWordList[wordIndex - 1].number }}&nbsp;&nbsp;{{
          studyWordList[wordIndex - 1].level.split(" ")[0]
        }}&nbsp;&nbsp;{{ studyWordList[wordIndex - 1].require }}]
      </span>
      <span v-if="initReciter && wordList.length > 0">
        &nbsp;升级测验：{{ initTList.length }}

        &nbsp;&nbsp;单词学习：{{ initSList.length }}
      </span>
      <span style="flex-grow: 1"></span>
      <span
        @click="switchShowList()"
        :style="{
          pointerEvents: isSetting ? 'none' : 'auto',
        }"
        style="cursor: pointer"
      >
        <span
          v-if="!initReciter && !addWord"
          style="
            display: inline-block;
            text-align: right;
            border: none;
            padding: 0;
            margin: 0;
          "
          :style="{
            color: isSetting ? 'grey' : 'blue',
          }"
          >{{ nb }}/</span
        >
        <span
          style="
            display: inline-block;
            text-align: right;
            border: none;
            padding: 0;
            margin: 0 0.5em 0 0;
          "
          :style="{
            color: isSetting ? 'grey' : 'blue',
          }"
          >{{ ttl }}</span
        >
      </span>
      <button
        v-if="isStudying"
        class="action"
        @click="toFavList"
        @dblclick.prevent
        :title="学习收藏列表"
      >
        <i
          :style="{
            color: showFav ? 'springgreen' : 'blue',
          }"
          class="material-icons"
          >folder_special</i
        >
      </button>
      <button
        class="action"
        @click="onSetting"
        @dblclick.prevent
        :title="$t('repeater.settings')"
      >
        <i
          :style="{
            color: isSetting ? 'red' : 'blue',
          }"
          class="material-icons"
          >settings</i
        >
      </button>
    </div>

    <div v-if="ttsWrong" class="showMsg" style="bottom: 2.5em">
      <p style="color: red">
        {{ $t("repeater.ttsWrong") }}
      </p>
    </div>

    <div v-if="prOutput" id="prWordExcelGenerator" @touchmove.stop.passive>
      <div class="prContainer">
        <header class="prHeader">
          <button class="action" @click="close" :title="$t('buttons.close')">
            <i style="color: blue" class="material-icons">close</i>
          </button>
          <span>PDJ单词默写表</span>
        </header>

        <div class="prContent">
          <div class="prSection">
            <h2 class="prSectionTitle"><i>📚📚📚📚</i> 单词列表</h2>
            <div class="prSelectAll1">
              <p style="display: flex; align-items: center">
                <span> 分级： </span>
                <input
                  class="input input--repeater"
                  style="flex-grow: 1"
                  type="text"
                  placeholder="小学、初中、高中、四级、六级、考研、托福、雅思、GRE"
                  v-model.lazy="prFilterLevel"
                />
              </p>
              <span>
                自建分类：-1代表选择全部
                <input
                  class="input input--repeater"
                  style="width: 4em"
                  type="number"
                  v-model.lazy="prRequireLevel"
                />
              </span>

              <span>
                熟悉度：
                <input
                  class="input input--repeater"
                  style="width: 4em"
                  type="number"
                  min="0"
                  max="1000"
                  v-model.number.lazy="prFilterFam1"
                />
                to:
                <input
                  class="input input--repeater"
                  style="width: 4em"
                  type="number"
                  min="0"
                  max="1000"
                  v-model.number.lazy="prFilterFam2"
                />
              </span>
            </div>
            <div
              class="prSelectAll"
              style="display: flex; justify-content: space-between"
            >
              <div>
                <input
                  type="checkbox"
                  id="prSelectAll"
                  v-model="prAllSelected"
                  @change="prToggleSelectAll"
                />
                <label for="prSelectAll"
                  >选择全部单词 ({{ prSelectedWords.length }}/{{
                    prWordList.length
                  }})</label
                >
              </div>
              <button
                class="action"
                style="color: blue"
                name="buttons"
                @click.stop="
                  toShuffle(4);
                  prToggleSelectAll();
                "
              >
                逆序
              </button>
              <button
                class="action"
                style="color: blue"
                name="buttons"
                @click.stop="
                  toShuffle(3);
                  prToggleSelectAll();
                "
              >
                乱序
              </button>
            </div>
            <div class="prWordList" @touchmove.stop.passive>
              <div
                class="prWordItem"
                v-for="(word, index) in prWordList"
                :key="index"
              >
                <input
                  type="checkbox"
                  :id="'prWord-' + index"
                  v-model="prSelectedIndexes[index]"
                />
                <label :for="'prWord-' + index" class="prWordText">{{
                  word.word
                }}</label>
                <span class="prPartOfSpeech">{{ word.partOfSpeech }}</span>
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
                  placeholder="PDJ单词默写练习"
                />
              </div>
              <div class="prOptionGroup">
                <label for="prLayout">表格布局:</label>
                <select id="prLayout" v-model="selectedLayout">
                  <option value="layout1">单词默写布局 (A4横向打印)</option>
                  <option value="layout2">单词卡布局 (A4横向打印)</option>
                </select>
              </div>
            </div>
            <p>
              <input type="checkbox" v-model="printWithPron" />
              包含音标
            </p>
            <div class="prPreview">
              <h3 class="prPreviewTitle">
                {{
                  selectedLayout === "layout1"
                    ? "单词默写布局 (A4横向打印)"
                    : "单词卡布局 (A4横向打印)"
                }}
                <button
                  class="action"
                  @click="handleConfirm(3)"
                  :title="$t('buttons.help')"
                >
                  <i style="color: blue" class="material-icons">help</i>
                </button>
              </h3>
              <div class="prPreviewContent" @touchmove.stop.passive>
                <table
                  class="prPreviewTable"
                  v-if="selectedLayout === 'layout1'"
                >
                  <tr v-for="i in 3" :key="i">
                    <td v-for="j in 10" :key="j" class="prPreviewCell">
                      <div v-if="j === 9">单词</div>
                      <div v-else-if="j === 8">释义</div>
                      <div v-else-if="j === 7">对错记录区</div>
                      <div v-else-if="j === 1">序号</div>
                      <div v-else-if="j === 10">对错记录区</div>
                      <div v-else>书写区</div>
                    </td>
                  </tr>
                </table>

                <!-- 布局2预览 -->
                <div v-else class="layout2-container">
                  <table class="prPreviewTable layout2-table">
                    <tr v-for="i in 3" :key="i">
                      <td v-for="j in 4" :key="j" class="prPreviewCell">
                        <div v-if="j === 1">序号</div>
                        <div v-else-if="j === 2">释义</div>
                        <div v-else-if="j === 3">单词</div>
                        <div v-else class="prCheckboxCell">
                          <div class="prCheckbox" v-for="k in 1" :key="k"></div>
                        </div>
                      </td>
                    </tr>
                  </table>
                  <table class="prPreviewTable layout2-table">
                    <tr v-for="i in 3" :key="i">
                      <td v-for="j in 4" :key="j" class="prPreviewCell">
                        <div v-if="j === 1">序号</div>
                        <div v-else-if="j === 2">释义</div>
                        <div v-else-if="j === 3">单词</div>
                        <div v-else class="prCheckboxCell">
                          <div class="prCheckbox" v-for="k in 1" :key="k"></div>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <div class="prStats">
              <span>已选择单词: {{ prSelectedWords.length }} 个</span>
              <span
                >预计页数:
                {{
                  Math.ceil(
                    prSelectedWords.length /
                      (selectedLayout === "layout1" ? 18 : 36)
                  )
                }}
                页</span
              >
            </div>

            <div class="prExportButtons">
              <button
                class="prExportBtn prHtmlBtn"
                @click="prGenerateHTML"
                :disabled="prSelectedWords.length === 0"
              >
                {{
                  prSelectedWords.length === 0 ? "请选择单词" : "生成HTML表格"
                }}
              </button>
              <button
                class="prExportBtn prPrintBtn"
                @click="prPrintDirectly"
                :disabled="prSelectedWords.length === 0"
              >
                {{ prSelectedWords.length === 0 ? "请选择单词" : "直接打印" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isWordReciter && showNewWordList && studyWordList.length > 0"
      style="
        width: 100%;
        height: calc(100% - 4.2em);
        bottom: 0;
        background-color: black;
        position: fixed;
        z-index: 1010;
      "
    >
      <div
        style="
          background-color: gray;
          color: whitesmoke;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 50%;
          transform: translate(-50%, 0);
          bottom: 0.2em;
          border-radius: 10px;
          top: 4.2em;
        "
        :style="{
          width: mobileScreen ? '100%' : '65%',
        }"
      >
        <p
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>快速刷词</span>
          <span
            style="cursor: pointer"
            :style="{
              color: !isTrans ? 'springgreen' : 'red',
            }"
            @click="switchOToT"
            >汉译英</span
          >
        </p>
        <ul
          v-if="studyWordList.length > 0"
          id="myWordList"
          style="
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0 1em;
            overflow-y: auto;
            list-style-type: none;
          "
          @click.self="studyWordList[wordIndex - 1].temp3 = 0"
          @touchmove.stop.passive
        >
          <li
            v-for="(newWord, index) in studyWordList"
            :key="index"
            :id="index + 1"
            @click.stop="chooseSentence(index)"
            @dblclick="toDetail(index)"
            style="align-items: center"
          >
            <span> {{ index + 1 }}. </span>
            <button
              v-if="Number(newWord.temp1) == 1"
              class="action"
              name="buttons"
              @click.stop="studyWordList[index].temp1 = 0"
            >
              <i style="color: yellow; font-size: 1em" class="material-icons"
                >star</i
              >
            </button>
            <button
              v-if="Number(newWord.temp1) == 0"
              class="action"
              name="buttons"
              @click.stop="studyWordList[index].temp1 = 1"
            >
              <i
                style="color: springgreen; font-size: 1em"
                class="material-icons"
                >star_outline</i
              >
            </button>
            <span
              v-if="!isTrans || Number(newWord.temp3) !== 0"
              style="
                display: inline-block;
                width: 25%;
                color: greenyellow;
                cursor: pointer;
              "
              >{{ newWord.word }}</span
            >
            <span
              v-if="isTrans && Number(newWord.temp3) == 0"
              style="
                display: inline-block;
                width: 25%;
                color: greenyellow;
                cursor: pointer;
              "
            ></span>
            <span
              v-if="Number(newWord.temp3) !== 0 || isTrans"
              style="
                display: inline-block;
                width: 50%;
                color: wheat;
                cursor: pointer;
              "
              >{{ newWord.partOfSpeech }}</span
            >
            <hr
              v-if="(index + 1) % 5 != 0"
              style="border: none; border-top: 1px solid black; height: 0"
            />
            <hr
              v-if="(index + 1) % 5 == 0"
              style="border: none; border-top: 1px solid wheat; height: 0"
            />
          </li>
        </ul>
      </div>
    </div>
    <div
      class="settingBoxContainer"
      v-if="showReadAll && studyWordList.length > 0"
      style="top: 4.2em"
    >
      <div class="settingBox" @touchmove.stop.passive>
        <div style="text-align: right; margin-top: 0; font-size: 1.25em">
          <button
            class="action"
            name="buttons"
            style="color: yellow"
            @click.stop="closeReadSetting"
          >
            关闭
          </button>
        </div>
        <div>
          <p>
            <button
              class="action"
              style="color: white"
              name="buttons"
              @click.stop="toShuffle(1)"
            >
              乱顺
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button
              class="action"
              style="color: white"
              name="buttons"
              @click.stop="toShuffle(2)"
            >
              逆序
            </button>
          </p>

          <hr style="border: none; border-top: 1px solid black; height: 0" />
        </div>
        <p>
          点击
          <i style="font-size: 1em; color: springgreen" class="material-icons"
            >volume_up</i
          >时的朗读设置
        </p>
        <p style="padding-bottom: 0">朗读内容和顺序</p>
        <div class="dynamic-select-container" @touchmove.stop.passive>
          <!-- 下拉框容器 -->

          <div class="select-list">
            <div
              v-for="(item, index) in selectList"
              :key="index"
              class="select-item"
              :class="{ 'fade-out': item.isRemoving }"
            >
              <select v-model="item.value" class="select-field">
                <option value="">请选择...</option>
                <option
                  v-for="option in options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <button
                type="button"
                class="remove-btn"
                @click.stop="handleRemove(index)"
              >
                ×
              </button>
            </div>
          </div>

          <!-- 添加按钮 -->
          <button class="add-btn" @click.stop="handleAdd">
            <span class="add-icon">+</span> 添加选择框
          </button>
        </div>
        <p>
          朗读间隔时间（秒）：
          <input
            class="input input--repeater"
            type="number"
            min="0"
            max="1000"
            v-model.number.lazy="interval"
          />
        </p>
        <p>
          <input type="checkbox" v-model="isAutoNext" />
          自动播放下一个单词
        </p>
        <div>
          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p>
            <input type="checkbox" v-model="autoRead" />
            切换时自动朗读单词
          </p>
          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p>
            <input type="checkbox" v-model="isFromLocal" />
            使用浏览器内置语音识别引擎进行语音校对（否则将调用azure语音识别服务）
          </p>
          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p>
            <input type="checkbox" v-model="isDicTest" />
            点击时朗读释义，以进行汉译英练习。
          </p>
          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p>
            *
            纯键盘操作指南：左箭头--上一词；右箭头：下一词；向下箭头--朗读当前单词；回车键--朗读当前单词或切换到下一词；向上箭头--在纠音、排序、填空、听写等页面切换显示单词和释义，以方便核对。
          </p>

          <hr style="border: none; border-top: 1px solid black; height: 0" />
          <p>
            *
            自然拼读功能中的点读对应表由ai生成，存在少量错误，可在单词编辑页面修正。
          </p>
        </div>
      </div>
    </div>

    <div v-if="isWordReciter" style="height: 100%; width: 100%">
      <div v-if="initReciter && !prOutput" style="height: 100%; width: 100%">
        <div
          style="
            width: 100%;
            height: 20vh;
            color: whitesmoke;
            font-size: 3em;
            text-align: center;
          "
        >
          <p style="margin-top: 30vh">PDJ一生词表</p>
        </div>
        <p
          style="display: flex; justify-content: space-around; padding: 24px 0"
        >
          <button
            v-if="!closeWordTest"
            :disabled="initTList.length == 0"
            class="action"
            name="buttons"
            @click="isTest"
            style="font-size: 1.5em; color: springgreen"
            :style="{
              color: initTList.length == 0 ? 'gray' : 'springgreen',
            }"
          >
            升级测验
          </button>
          <button
            v-if="closeWordTest"
            disabled
            class="action"
            name="buttons"
            style="font-size: 1.5em; color: gray"
          >
            升级测验(关)
          </button>
          <button
            class="action"
            name="buttons"
            :disabled="initSList.length == 0"
            @click="
              switchShow();
              toStudy();
            "
            style="font-size: 1.5em"
            :style="{
              color: initSList.length == 0 ? 'gray' : 'springgreen',
            }"
          >
            单词学习
          </button>
          <button
            class="action"
            name="buttons"
            @click="
              newWord = '';
              switchShow();
              toAddWord();
            "
            style="font-size: 1.5em; color: springgreen"
          >
            添加生词
          </button>
        </p>
        <p style="display: flex; justify-content: space-around">
          <button
            class="action"
            name="buttons"
            @click="
              newWord = '';
              switchShow();
              isInstruction = true;
            "
            style="font-size: 1.5em; color: springgreen"
          >
            设置与说明
          </button>
          <button
            class="action"
            name="buttons"
            @click="
              newWord = '';
              prOutput = true;
            "
            style="font-size: 1.5em; color: springgreen"
          >
            打印单词列表
          </button>
        </p>
      </div>
      <div
        v-if="addWord || insertWord"
        @touchmove.stop.passive
        :style="{
          width: isMobile ? '99%' : '60%',
        }"
        style="
          height: 100vh;
          z-index: 1007;
          color: white;
          text-align: center;
          margin: auto;
          overflow-y: auto;
        "
      >
        <p
          v-if="addWord"
          style="width: 100%; display: flex; align-items: center"
        >
          <span style="margin-left: auto; margin-right: auto"
            >在单词表末尾添加生词</span
          ><span style="margin-right: 1em" @click="toAddBatchWord"
            >批量添加</span
          >
        </p>
        <p v-if="insertWord">在当前单词后添加生词(按正序位置)</p>

        <div v-if="addBatchWord" style="text-align: left">
          <p style="display: flex; align-items: center; margin-top: 3em">
            <span>选择分级：</span>
            <input
              class="input input--repeater"
              style="flex-grow: 1"
              type="text"
              placeholder="如小学、初中、高中、四级、六级、考研、托福、雅思、GRE"
              v-model="prFilterLevel"
            />
          </p>
          <p>
            已选择{{
              this.batchNewList.length
            }}个单词（不包含已在单词本中的单词）
          </p>
          <p>
            添加前建议先备份单词本，单词本文件位于服务器上的!PDJ/user-{{
              user.username
            }}/PDJ-wordlist.txt。
          </p>
        </div>

        <div v-if="!addBatchWord">
          <p class="cl2">
            <span class="cl1">单词：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="newWord"
            />
          </p>
          <p class="cl2">
            <span class="cl1">释义：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.partOfSpeech"
            />
          </p>
          <p class="cl2">
            <span class="cl1">音标：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.pronunciation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">音节拆分：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.syllable"
            />
          </p>
          <p class="cl2">
            <span class="cl1">自然拼读：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.phoneticSplit"
            />
          </p>
          <p class="cl2">
            <span class="cl1">助记法：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.wordNote"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词根词缀：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.roots"
            />
          </p>
          <p class="cl2">
            <span class="cl1">固定搭配：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.collocation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">例句：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.exampleSentence"
            />
          </p>
          <p class="cl2">
            <span class="cl1">例句译文：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.exampleTranslation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词序：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="number"
              v-model.lazy="addNewWord.number"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词汇等级</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="text"
              v-model.lazy="addNewWord.level"
            />
          </p>
          <p class="cl2">
            <span class="cl1">自建分类</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater addNew"
              type="number"
              placeholder="请填入数字。如0代表'未分类'；1代表'必背'；2代表'识认'等"
              v-model.lazy="addNewWord.require"
            />
          </p>
        </div>
        <p>
          <button class="action" name="buttons" @click.stop="saveToWordList()">
            <i
              style="font-size: 1.5em; color: springgreen"
              class="material-icons"
              >保存</i
            >
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button class="action" name="buttons" @click.stop="close()">
            <i
              style="font-size: 1.5em; color: springgreen"
              class="material-icons"
              >退出</i
            >
          </button>
        </p>
      </div>

      <div
        v-if="isTesting && studyWordList.length > 0"
        style="
          height: 100%;
          width: 100%;
          color: white;
          display: flex;
          flex-direction: column;
          text-align: center;
          position: absolute;
          font-size: 1.2em;
          top: 4.2em;
        "
        @click="readTestWord"
      >
        <div style="flex-grow: 1"></div>
        <div style="height: 80%">
          <div
            v-if="showSelectT"
            class="clz-vocabulary-test"
            @touchmove.stop.passive
            style="height: auto; overflow-y: hidden"
          >
            <div class="clz-test-container allow-select">
              <div v-if="!showCToET">
                <div class="clz-word-display">
                  <h3 v-if="!clzIsAnswered">{{ clzCurrentWord.word }}</h3>
                  <h3 v-if="clzIsAnswered">
                    {{ clzCurrentWord.word }}&nbsp;&nbsp;{{
                      clzCurrentWord.partOfSpeech
                    }}
                  </h3>
                </div>
                <div class="clz-options">
                  <div
                    v-for="(option, index) in clzOptions"
                    :key="index"
                    class="clz-option"
                    :class="{
                      'clz-correct':
                        clzIsAnswered &&
                        option.partOfSpeech === clzCorrectAnswer,
                      'clz-incorrect':
                        clzIsAnswered &&
                        clzSelectedOption === option.partOfSpeech &&
                        option.partOfSpeech !== clzCorrectAnswer,
                      'clz-disabled': clzIsAnswered,
                    }"
                    @click.stop="clzHandleSelect(option.partOfSpeech)"
                  >
                    <span style="color: blue">{{ option.partOfSpeech }}</span>
                    <span
                      class="clz-original-word"
                      v-if="clzIsAnswered && option.word"
                    >
                      {{ option.word }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="showCToET">
                <div class="clz-word-display">
                  <h3 v-if="!clzIsAnswered">
                    {{ clzCurrentWord.partOfSpeech }}
                  </h3>
                  <h3 v-if="clzIsAnswered">
                    {{ clzCurrentWord.word }}&nbsp;&nbsp;{{
                      clzCurrentWord.partOfSpeech
                    }}
                  </h3>
                </div>
                <div class="clz-options">
                  <div
                    v-for="(option, index) in clzOptions"
                    :key="index"
                    class="clz-option"
                    :class="{
                      'clz-correct':
                        clzIsAnswered && option.word === clzCorrectAnswer,
                      'clz-incorrect':
                        clzIsAnswered &&
                        clzSelectedOption === option.word &&
                        option.word !== clzCorrectAnswer,
                      'clz-disabled': clzIsAnswered,
                    }"
                    @click.stop="clzHandleSelect(option.word)"
                  >
                    <span style="color: blue">{{ option.word }}</span>
                    <span
                      class="clz-original-meaning"
                      v-if="clzIsAnswered && option.partOfSpeech"
                    >
                      {{ option.partOfSpeech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!showSelectT">
            <div
              style="
                height: 33vh;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
              "
            >
              <div v-if="inputByLetters" class="game-container">
                <div v-if="showGame" class="spelling-area">
                  <div class="current-spelling">
                    <div
                      v-for="(letter, index) in currentSpelling"
                      :key="index"
                      class="spelled-letter"
                      :style="{
                        backgroundColor: isAnswered
                          ? isCorrect
                            ? 'springgreen'
                            : 'red'
                          : 'white',
                      }"
                      :title="letter === ' ' ? '空格' : ''"
                      @click.stop="removeFromSpelling(index)"
                    >
                      {{ letter === " " ? "␣" : letter }}
                    </div>
                  </div>
                  <div class="shuffled-items" style="margin-bottom: 12px">
                    <button
                      v-for="(item, index) in shuffledItems"
                      :disabled="isAnswered"
                      :key="index"
                      @click.stop="addToSpelling(item)"
                      class="letter-btn"
                      :title="item === ' ' ? '空格' : ''"
                    >
                      {{ item === " " ? "␣" : item }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!inputByLetters">
                <p style="align-items: center; margin-top: 5em">
                  <input
                    class="input input--repeater autoFocus"
                    :disabled="isAnswered"
                    :style="{
                      color:
                        isAnswered && isCorrect
                          ? 'springgreen'
                          : isAnswered && !isCorrect
                          ? 'red'
                          : 'white',
                    }"
                    style="
                      text-align: center;
                      width: 90%;
                      background-color: #000;
                      border: 0;
                      font-size: 2rem;
                      border-bottom: 1px solid gray;
                    "
                    type="text"
                    placeholder="请输入单词"
                    v-model="answerWord"
                  />
                </p>
              </div>

              <p
                v-if="studyWordList.length > 0"
                :style="{
                  color: !showLToET || isAnswered ? 'yellowgreen' : 'black',
                }"
              >
                {{ studyWordList[wordIndex - 1].partOfSpeech }}
              </p>
            </div>
            <div
              :style="{
                color: isAnswered ? 'yellow' : 'black',
              }"
            >
              <p style="text-align: center">
                <span style="font-size: 2em">
                  {{ studyWordList[wordIndex - 1].word }}
                </span>
              </p>
              <p style="text-align: center; font-size: 1em">
                <span>
                  英{{
                    studyWordList[wordIndex - 1].pronunciation.split(" ")[0]
                  }}
                </span>
                <span
                  v-if="
                    isAnswered &&
                    studyWordList[wordIndex - 1].pronunciation.split(' ')[1]
                  "
                  style="color: yellow"
                >
                  &nbsp;&nbsp;&nbsp;美{{
                    studyWordList[wordIndex - 1].pronunciation.split(" ")[1]
                  }}
                </span>
              </p>
            </div>
          </div>
          <p style="text-align: center">
            <button
              v-if="Number(studyWordList[wordIndex - 1].temp1) == 1"
              class="action"
              name="buttons"
              @click.stop="studyWordList[wordIndex - 1].temp1 = 0"
            >
              <i style="font-size: 1.2em; color: yellow" class="material-icons"
                >star</i
              >
            </button>
            <button
              v-if="Number(studyWordList[wordIndex - 1].temp1) == 0"
              class="action"
              name="buttons"
              @click.stop="studyWordList[wordIndex - 1].temp1 = 1"
            >
              <i
                style="font-size: 1.2em; color: springgreen"
                class="material-icons"
                >star_outline</i
              >
            </button>
          </p>
          <p v-if="!isAnswered" style="color: black">-</p>
          <p v-if="isCorrect && isAnswered" style="color: green">
            正确，此单词已升级至{{
              studyWordList[wordIndex - 1].familiarity
            }}级！
          </p>
          <p v-if="!isCorrect && isAnswered" style="color: red">
            错误，此单词已降至0级！
          </p>
          <p style="text-align: center">
            <button
              v-if="!isAnswered && !showSelectT"
              style="border-radius: 5px; background: bisque"
              @click.stop="checkAnswser"
            >
              提交
            </button>
            <button
              v-if="isAnswered"
              style="border-radius: 5px"
              @click.stop="toNextWord"
            >
              下一词
            </button>
          </p>
        </div>
        <div style="height: 30vh"></div>
      </div>

      <div
        v-if="isStudying && studyWordList.length > 0"
        style="height: 100%; width: 100%; display: flex; flex-direction: column"
      >
        <div
          v-if="editWord"
          @touchmove.stop.passive
          style="
            width: 100%;
            height: calc(100% - 4.2em);
            z-index: 1007;
            color: white;
            text-align: center;
            overflow-y: auto;
          "
          @click.self="
            readContent = studyWordList[wordIndex - 1].word
              ? studyWordList[wordIndex - 1].word
              : 'empty';
            readPart(0);
          "
        >
          <p
            style="
              text-align: center;
              color: wheat;
              font-size: 3em;
              font-weight: bold;
              margin: 5px;
            "
          >
            {{ studyWordList[wordIndex - 1].word }}
          </p>
          <p class="cl2">
            <span class="cl1">释义：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].partOfSpeech"
            />
          </p>
          <p class="cl2">
            <span class="cl1">音标：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].pronunciation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">音节拆分：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].syllable"
            />
          </p>
          <p class="cl2">
            <span class="cl1">自然拼读：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].phoneticSplit"
            />
          </p>
          <p class="cl2">
            <span class="cl1">助记法：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].wordNote"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词根词缀：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].roots"
            />
          </p>
          <p class="cl2">
            <span class="cl1">固定搭配：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].collocation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">例句：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].exampleSentence"
            />
          </p>
          <p class="cl2">
            <span class="cl1">例句译文：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].exampleTranslation"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词序：</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="number"
              v-model.lazy="studyWordList[wordIndex - 1].number"
            />
          </p>
          <p class="cl2">
            <span class="cl1">词汇等级</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="text"
              v-model.lazy="studyWordList[wordIndex - 1].level"
            />
          </p>
          <p class="cl2">
            <span class="cl1">自建分类</span>
            <input
              style="flex-grow: 1; text-align: left"
              class="input input--repeater"
              type="number"
              placeholder="请填入数字。如0代表'未分类'；1代表'必背'；2代表'识认'等"
              v-model.lazy="studyWordList[wordIndex - 1].require"
            />
          </p>
          <button class="action" name="buttons" @click.stop="editWord = false">
            <i
              style="font-size: 1.25em; color: springgreen"
              class="material-icons"
              >关闭（已自动存盘）</i
            >
          </button>
        </div>

        <div
          v-if="!editWord"
          style="
            width: 100%;
            height: calc(100% - 4.2em);
            display: flex;
            flex-direction: column;
          "
        >
          <div
            style="height: 60%; display: flex; flex-direction: column"
            @click="click"
          >
            <div style="flex-grow: 1"></div>
            <div
              v-if="showGeneral"
              class="word-card allow-select"
              :style="{
                width: isMobile ? '100%' : '60%',
              }"
              style="padding: 1em; color: blue"
              @touchmove.stop.passive
            >
              <div class="word-title">
                <span
                  v-if="studyWordList[wordIndex - 1].pronunciation != '-'"
                  style="font-size: 0.8em"
                  >英{{
                    studyWordList[wordIndex - 1].pronunciation.split(" ")[0]
                  }}&nbsp;&nbsp;&nbsp;&nbsp;美{{
                    studyWordList[wordIndex - 1].pronunciation.split(" ")[1]
                  }}</span
                >
                <p
                  style="margin: 8px 0; font-weight: 500"
                  :style="{ fontSize: !isMobile ? '5em' : '3.5em' }"
                >
                  {{ studyWordList[wordIndex - 1].word }}
                </p>
                <span>{{ studyWordList[wordIndex - 1].partOfSpeech }}</span>
              </div>
              <p
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 0;
                "
              >
                <span v-if="studyWordList[wordIndex - 1].wordNote != '-'"
                  >助记法：{{ studyWordList[wordIndex - 1].wordNote }}</span
                >
                <span v-if="studyWordList[wordIndex - 1].roots != '-'"
                  >词根词缀：{{ studyWordList[wordIndex - 1].roots }}</span
                >
                <span v-if="studyWordList[wordIndex - 1].collocation != '-'"
                  >固定搭配：{{
                    studyWordList[wordIndex - 1].collocation
                  }}</span
                >
              </p>
              <p style="margin-bottom: 0">
                例句：{{ studyWordList[wordIndex - 1].exampleSentence }}
              </p>
              <p>译文：{{ studyWordList[wordIndex - 1].exampleTranslation }}</p>
            </div>
            <div
              v-if="showPhonics && !canGenerate"
              style="width: 100%; height: 60%; color: white; text-align: center"
            >
              无相应信息，请重新编辑...
            </div>
            <div
              v-if="showPhonics && canGenerate"
              class="word-card"
              style="padding: 16px"
              :style="{
                width: isMobile ? '100%' : '60%',
              }"
              @click.stop="readWord"
              @touchmove.stop.passive
            >
              <div class="word-title">
                <h2 style="font-size: 3em">
                  {{ wordData.word }}
                </h2>
              </div>
              <div class="section phonetics-section">
                <div class="phonetics-content">
                  <span class="phonetic-item" v-if="wordData.phonetics.uk"
                    >英 [{{ wordData.phonetics.uk }}]</span
                  >
                  <span class="phonetic-item" v-if="wordData.phonetics.us"
                    >美 [{{ wordData.phonetics.us }}]</span
                  >
                </div>
              </div>
              <p style="text-align: center; margin: 0">
                {{ wordData.partOfSpeech }}
              </p>
              <div class="section syllables-section">
                <div class="syllables-content">
                  <span
                    v-for="(syllable, sIndex) in wordData.syllables"
                    :key="sIndex"
                    class="syllable-item"
                    :class="{
                      highlighted:
                        highlightedIndex !== null &&
                        syllable.indexes.includes(highlightedIndex),
                    }"
                  >
                    {{ syllable.text }}
                  </span>
                  <span
                    v-for="(separator, sIndex) in wordData.syllables.length - 1"
                    :key="'sep' + sIndex"
                    class="syllable-separator"
                  >
                    <i class="fa fa-minus"></i>
                  </span>
                </div>
              </div>
              <div class="section phonemes-section">
                <div class="phonemes-content" style="align-items: center">
                  [&nbsp;
                  <span
                    v-for="(phonics, index) in wordData.phonics"
                    :key="'phoneme' + index"
                    class="phoneme-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click.stop="handleItemClick(index)"
                  >
                    {{ phonics.phoneme }} </span
                  >&nbsp;]
                </div>
              </div>
              <div class="section letters-section">
                <div class="letters-content">
                  <span
                    v-for="(phonics, index) in wordData.phonics"
                    :key="'letter' + index"
                    class="letter-item"
                    :class="{ highlighted: highlightedIndex === index }"
                    @click.stop="handleItemClick(index)"
                  >
                    {{ phonics.letters }}
                  </span>
                </div>
              </div>
            </div>

            <input
              v-if="!showSpell && !showCloze && (showDic || showRead)"
              class="autoFocus"
              id="editArea3"
              v-model="dictationContent"
              :placeholder="defaultDictation"
              style="
                width: 100%;
                font-size: 1.88em;
                background-color: black;
                color: white;
                border: none;
                text-align: center;
                padding: 0 0 18px 0;
              "
              :style="{
                color: !realCheck ? 'white' : isRight ? 'green' : 'red',
              }"
            />

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
              <div class="cloze-word">
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
                        @click.stop
                        @input="handleLetterInput(index)"
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
            </div>

            <div v-if="showSpell" class="game-container">
              <div v-if="showGame" class="spelling-area">
                <div
                  class="current-spelling"
                  :class="{ 'is-correct': isCorrect }"
                >
                  <div
                    v-for="(letter, index) in currentSpelling"
                    :key="index"
                    class="spelled-letter"
                    :title="letter === ' ' ? '空格' : ''"
                    @click.stop="!isCorrect && removeFromSpelling(index)"
                  >
                    {{ letter === " " ? "␣" : letter }}
                  </div>
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
                  {{ isCorrect ? "拼写正确！" : "拼写错误！" }}
                </div>
                <div class="shuffled-items">
                  <button
                    v-for="(item, index) in shuffledItems"
                    :key="index"
                    @click.stop="addToSpelling(item)"
                    :disabled="!item || isCorrect"
                    class="letter-btn"
                    :title="item === ' ' ? '空格' : ''"
                  >
                    {{ item === " " ? "␣" : item }}
                  </button>
                </div>
              </div>
            </div>

            <div
              style="
                margin: 0 auto;
                color: gray;
                padding: 8px 0px;
                font-size: 1.18em;
                display: flex;
                flex-direction: column;
                gap: 6px;
              "
              v-if="showRead || showCloze || showDic || showSpell"
            >
              <button
                @click.stop="onTransO = !onTransO"
                style="
                  text-align: center;
                  display: block;
                  border: 0;
                  background-color: black;
                "
                :style="{
                  color: onTransO ? 'gray' : 'black',
                }"
              >
                {{ studyWordList[wordIndex - 1].word }}
              </button>
              <button
                @click.stop="onTransT = !onTransT"
                style="
                  text-align: center;
                  display: block;
                  border: 0;
                  background-color: black;
                "
                :style="{
                  color: onTransT ? 'gray' : 'black',
                }"
              >
                {{ studyWordList[wordIndex - 1].partOfSpeech }}
              </button>
            </div>

            <p
              v-if="showRead"
              style="display: flex; justify-content: center; text-align: center"
            >
              <button
                v-if="canRecording"
                class="action"
                @click.stop="recording"
                :title="$t('repeater.recording')"
              >
                <i
                  style="font-size: 1.88em"
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
                @click.stop="handleConfirm(2)"
                :title="$t('repeater.cannotRecording')"
              >
                <i
                  style="font-size: 1.88em; color: green"
                  class="material-icons"
                  >mic_off</i
                >
              </button>
              <button
                :disabled="isSetting || isRecording || !audioUrl"
                class="action"
                @click.stop="playRecording"
                :title="$t('repeater.playRecording')"
              >
                <i
                  style="font-size: 1.88em"
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
            </p>

            <div
              v-if="showSelect"
              class="clz-vocabulary-test"
              @touchmove.stop.passive
            >
              <div class="clz-test-container allow-select">
                <div class="clz-header" style="justify-content: right">
                  <span>
                    <input type="checkbox" v-model="showCToE" />
                    将单词作为选项
                  </span>
                </div>
                <div v-if="!showCToE">
                  <div class="clz-word-display">
                    <h3 v-if="!clzIsAnswered">{{ clzCurrentWord.word }}</h3>
                    <h3 v-if="clzIsAnswered">
                      {{ clzCurrentWord.word }}&nbsp;&nbsp;{{
                        clzCurrentWord.partOfSpeech
                      }}
                    </h3>
                  </div>
                  <div
                    class="clz-options"
                    style="height: 35vh; justify-content: space-around"
                  >
                    <div
                      v-for="(option, index) in clzOptions"
                      :key="index"
                      class="clz-option"
                      :class="{
                        'clz-correct':
                          clzIsAnswered &&
                          option.partOfSpeech === clzCorrectAnswer,
                        'clz-incorrect':
                          clzIsAnswered &&
                          clzSelectedOption === option.partOfSpeech &&
                          option.partOfSpeech !== clzCorrectAnswer,
                        'clz-disabled': clzIsAnswered,
                      }"
                      @click.stop="clzHandleSelect(option.partOfSpeech)"
                    >
                      <span style="color: blue">{{ option.partOfSpeech }}</span>
                      <span
                        class="clz-original-word"
                        v-if="clzIsAnswered && option.word"
                      >
                        {{ option.word }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-if="showCToE">
                  <div class="clz-word-display">
                    <h3 v-if="!clzIsAnswered">
                      {{ clzCurrentWord.partOfSpeech }}
                    </h3>
                    <h3 v-if="clzIsAnswered">
                      {{ clzCurrentWord.word }}&nbsp;&nbsp;{{
                        clzCurrentWord.partOfSpeech
                      }}
                    </h3>
                  </div>
                  <div
                    class="clz-options"
                    style="height: 35vh; justify-content: space-around"
                  >
                    <div
                      v-for="(option, index) in clzOptions"
                      :key="index"
                      class="clz-option"
                      :class="{
                        'clz-correct':
                          clzIsAnswered && option.word === clzCorrectAnswer,
                        'clz-incorrect':
                          clzIsAnswered &&
                          clzSelectedOption === option.word &&
                          option.word !== clzCorrectAnswer,
                        'clz-disabled': clzIsAnswered,
                      }"
                      @click.stop="clzHandleSelect(option.word)"
                    >
                      <span style="color: blue">{{ option.word }}</span>
                      <span
                        class="clz-original-meaning"
                        v-if="clzIsAnswered && option.partOfSpeech"
                      >
                        {{ option.partOfSpeech }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p
            style="
              display: flex;
              justify-content: space-around;
              text-align: center;
              align-items: center;
            "
          >
            <span
              style="color: white; font-size: 2rem"
              @click.stop="toLastWord"
            >
              &#8249;
            </span>
            <span>
              <button class="action" name="buttons" @click.stop="playAll">
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: readCount == 0 ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >volume_up</i
                >
              </button>
              <button
                class="action"
                name="buttons"
                @click.stop="editWord = true"
              >
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: !editWord ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >drive_file_rename_outline</i
                >
              </button>

              <button
                class="action"
                name="buttons"
                @click.stop="
                  editWord = false;
                  newWord = '';
                  cleanUp();
                  insertWord = true;
                "
              >
                <i
                  style="font-size: 1.5em"
                  :style="{
                    color: !editWord ? 'springgreen' : 'red',
                  }"
                  class="material-icons"
                  >alt_route</i
                >
              </button>

              <button
                class="action"
                name="buttons"
                @click.stop="handleConfirm(1)"
              >
                <i
                  style="font-size: 1.5em; color: springgreen"
                  class="material-icons"
                  >delete</i
                >
              </button>
              <button
                class="action"
                name="buttons"
                @click.stop="switchReadAll()"
              >
                <i
                  style="font-size: 1.5em; color: springgreen"
                  class="material-icons"
                  >settings_applications</i
                >
              </button>
            </span>
            <span
              style="color: white; font-size: 2rem"
              @click.stop="toNextWord"
            >
              &#8250;
            </span>
          </p>

          <div
            @mousedown.self="startDrag"
            @mouseup.self="endDrag"
            @touchstart.self="startTouch"
            @touchend.self="endTouch"
            style="flex-grow: 1; text-align: center; font-size: 1.2em"
          >
            <button
              v-if="Number(studyWordList[wordIndex - 1].temp1) == 1"
              class="action"
              name="buttons"
              @click.stop="studyWordList[wordIndex - 1].temp1 = 0"
            >
              <i style="font-size: 1.5em; color: yellow" class="material-icons"
                >star</i
              >
            </button>
            <button
              v-if="Number(studyWordList[wordIndex - 1].temp1) == 0"
              class="action"
              name="buttons"
              @click.stop="studyWordList[wordIndex - 1].temp1 = 1"
            >
              <i
                style="font-size: 1.5em; color: springgreen"
                class="material-icons"
                >star_outline</i
              >
            </button>
          </div>

          <p
            @touchmove.stop.passive
            style="display: flex; overflow-x: auto; justify-content: center"
          >
            <button
              class="action"
              name="buttons"
              @click.stop="
                switchShow();
                showGeneral = true;
              "
            >
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showGeneral ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >详解</i
              >
            </button>
            <button class="action" name="buttons" @click.stop="testPhonics">
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showPhonics ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >拼读</i
              >
            </button>
            <button
              class="action"
              name="buttons"
              @click.stop="
                switchShow();
                showRead = true;
              "
            >
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showRead ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >纠音</i
              >
            </button>
            <button
              class="action"
              name="buttons"
              @click.stop="
                switchShow();
                showSpell = true;
                splitInput();
              "
            >
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showSpell ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >排序</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click.stop="
                switchShow();
                showCloze = true;
              "
            >
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showCloze ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >填空</i
              >
            </button>

            <button
              class="action"
              name="buttons"
              @click.stop="
                switchShow();
                showSelect = true;
                clzGenerateOptions();
              "
            >
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showSelect ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >选择</i
              >
            </button>

            <button class="action" name="buttons" @click.stop="toDic">
              <i
                style="font-size: 1.2rem"
                :style="{
                  color: !showDic ? 'springgreen' : 'red',
                }"
                class="material-icons"
                >听写</i
              >
            </button>
          </p>
        </div>
      </div>
    </div>
    <div class="settingBoxContainer" v-if="isSetting" style="top: 4.2em">
      <div class="settingBox" @touchmove.stop.passive>
        <p style="text-align: justify; text-align-last: left; color: white">
          {{ $t("repeater.note1") }}
        </p>
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
                @click.stop="alertAutoDetect"
                :title="$t('repeater.help')"
              >
                <i style="color: blue; font-size: 1.2em" class="material-icons"
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
              单词所用语言：
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
              释义所用语言：
            </span>
            <input
              :disabled="isAutoDetectLang"
              :style="{
                width: isMobile ? '7em' : '8em',
              }"
              class="input input--repeater"
              type="text"
              :placeholder="zh - CN"
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
                单词朗读嗓音{{
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
                @click.stop="
                  readContent = studyWordList[wordIndex - 1].word
                    ? studyWordList[wordIndex - 1].word
                    : 'empty';
                  readPart(0);
                "
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
                释义朗读嗓音：{{
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
                @click.stop="
                  readContent = studyWordList[wordIndex - 1].partOfSpeech
                    ? studyWordList[wordIndex - 1].partOfSpeech
                    : 'empty';
                  readPart(1);
                "
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
                  @click="
                    readContent = studyWordList[wordIndex - 1].word
                      ? studyWordList[wordIndex - 1].word
                      : 'empty';
                    readPart(0);
                  "
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
                  @click="
                    readContent = studyWordList[wordIndex - 1].partOfSpeech
                      ? studyWordList[wordIndex - 1].partOfSpeech
                      : 'empty';
                    readPart(1);
                  "
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

        <hr style="border: none; border-top: 1px solid black; height: 0" />

        <p style="text-align: justify; text-align-last: left; color: white">
          <input type="checkbox" v-model="typingSound" />
          输入时开启键盘音效
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
              <i style="font-size: 1.2em; color: blue" class="material-icons"
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
              <i style="color: blue; font-size: 1.2em" class="material-icons"
                >settings_backup_restore</i
              >
            </button>
            <button
              class="action"
              @click="testTranslatorUrl"
              :title="$t('repeater.testUrl')"
            >
              <i style="font-size: 1.2em; color: blue" class="material-icons"
                >play_circle_outline</i
              >
            </button>
            <button
              class="action"
              name="buttons"
              @click="alertTranslatorUrl1"
              :title="$t('repeater.help')"
            >
              <i style="color: blue; font-size: 1.2em" class="material-icons"
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
        <div style="color: white">
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
    <div class="settingBoxContainer" v-if="isInstruction" style="top: 4.2em">
      <div class="settingBox" @touchmove.stop.passive>
        <p style="text-align: right; margin-top: 0; font-size: 1.25em">
          <button
            class="action"
            name="buttons"
            style="color: yellow"
            @click.stop="
              isInstruction = false;
              studyWordList = initTList;
            "
          >
            关闭
          </button>
        </p>
        <p style="text-align: justify; text-align-last: left; color: white">
          PDJ一生词表将背单词设计为升级游戏：0级为新词，默认8级为最高级（可自定义）。并按照计划间隔天数进行升级测验。检测通过后将提升一级，检测失败将降为0级（生词）。当单词到达最高级后将不再进行检测（但仍可使用单词学习功能进行学习）。
        </p>
        <p style="text-align: justify; text-align-last: left; color: white">
          升级测验的词表为已到检测日期但未完成检测的所有单词。单词学习列表默认将包括所有生词和今日已完成检测的单词（可自定义，但不会包括升级测验中的单词，除非在下方关闭了升级测验功能）。
        </p>
        <hr style="border: none; border-top: 1px solid black; height: 0" />
        <p
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>设置：</span>
        </p>
        <p>
          最高等级：
          <input
            class="input input--repeater"
            type="number"
            min="0"
            style="width: 4em"
            v-model.number.lazy="maxLevel"
          />
        </p>
        <p style="display: flex; align-items: center">
          升级测验每级间隔天数：
          <input
            class="input input--repeater"
            type="text"
            style="flex-grow: 1"
            v-model.lazy="testInterval"
          />
        </p>
        <hr style="border: none; border-top: 1px solid black; height: 0" />

        <p
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>选择词表：</span>
        </p>
        <p style="display: flex; align-items: center">
          <span>分级：</span>
          <input
            class="input input--repeater"
            type="text"
            style="flex-grow: 1"
            placeholder="如'小学'或'初中'、'高中'、'四级'、'六级'、'考研'、'托福'、'雅思'、'GRE'等"
            v-model.lazy="filterLevel"
          />
        </p>
        <p style="display: flex; align-items: center">
          自建分类：-1代表选择全部
          <input
            class="input input--repeater"
            type="number"
            v-model.lazy="requireLevel"
          />
        </p>
        <p>
          熟悉度：
          <input
            class="input input--repeater"
            type="number"
            min="0"
            max="1000"
            v-model.number.lazy="filterFam1"
          />
          to:
          <input
            class="input input--repeater"
            type="number"
            min="0"
            max="1000"
            v-model.number.lazy="filterFam2"
          />
        </p>
        <hr style="border: none; border-top: 1px solid black; height: 0" />
        <p
          style="
            padding: 0 1em;
            color: yellow;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <span>'升级测验'题型设置(由难到易)：</span>
        </p>
        <p>纯键盘操作：可使用回车键'提交'和切换到'下一题'。</p>
        <div :style="{ color: closeWordTest ? 'darkgray' : 'white' }">
          <div
            :style="{
              color: showSelectT ? 'darkgray' : 'white',
            }"
          >
            <div style="color: white; display: flex; flex-direction: column">
              <label class="radio-item">
                <input
                  type="radio"
                  :disabled="closeWordTest"
                  v-model="selectedValue"
                  :value="1"
                />
                题型一：看释义默写单词，可使用键盘，或系统输入法的语音输入、手写输入来进行单词输入。
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  :disabled="closeWordTest"
                  v-model="selectedValue"
                  :value="5"
                />
                题型二：听单词默写单词(可同时自行说释义)，可使用键盘，或系统输入法的语音输入、手写输入来进行单词输入。
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  :disabled="closeWordTest"
                  v-model="selectedValue"
                  :value="2"
                />
                题型三：字母排序，看释义拼单词。干扰字符比例：(0为无干扰字符)
                <input
                  class="input input--repeater"
                  :disabled="selectedValue != 2 || closeWordTest"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  style="width: 4em; margin: 0; padding: 0"
                  v-model.lazy.number="moreLetters"
                />
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  :disabled="closeWordTest"
                  v-model="selectedValue"
                  :value="3"
                />
                题型四：选择题(根据单词选释义)
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  :disabled="closeWordTest"
                  v-model="selectedValue"
                  :value="4"
                />
                题型五：选择题(根据释义选单词)
              </label>
            </div>
          </div>
        </div>
        <p>
          <input type="checkbox" v-model="closeWordTest" />
          关闭'升级测验'功能。相应单词将显示在'单词学习'的列表中。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { files as api } from "@/api";
import url from "@/utils/url";
import { setTimeout } from "core-js";
import { Howl } from "howler";
import localforage from "localforage";
import CryptoJS from "crypto-js";
import wavEncoder from "wav-encoder";
import * as auth from "@/utils/auth";

export default {
  name: "wordreciter",
  data: function () {
    return {
      printWithPron: false,
      activeInput: false,
      addBatchWord: false,
      PDJRepeaterContent: "",
      showLToET: false,
      selectedValue: 1,
      isDicTest: false,
      onTransT: false,
      onTransO: false,
      selectedLayout: "layout1",
      prWordList: null,
      prFileName: "PDJ单词默写练习",
      prAllSelected: true,
      prSelectedIndexes: {},
      prOutput: false,
      showPhonics: false,
      showSelect: false,
      showSelectT: false,
      urla: "",
      showCToE: false,
      showCToET: false,
      clzOptions: [],
      clzSelectedOption: null,
      clzIsAnswered: false,
      clzCorrectAnswer: "",
      moreLetters: 0.5,
      inputByLetters: false,
      showTestSetting: false,
      closeWordTest: false,
      requireLevel: -1,
      prRequireLevel: -1,
      maxLevel: 8,
      isInstruction: false,
      filterLevel: "",
      filterFam1: 0,
      filterFam2: 8,
      prFilterLevel: "",
      prFilterFam1: 0,
      prFilterFam2: 8,

      showFav: false,
      isAutoNext: true,
      readCount: 0,
      options: [
        { value: "option1", label: "单词" },
        { value: "option2", label: "字母拼写" },
        { value: "option3", label: "释义" },
        { value: "option4", label: "助记法" },
        { value: "option5", label: "词根词缀" },
        { value: "option6", label: "固定搭配" },
        { value: "option7", label: "例句原文" },
        { value: "option8", label: "例句译文" },
      ],
      selectList: [
        { value: "option1", isRemoving: false },
        { value: "option2", isRemoving: false },
        { value: "option3", isRemoving: false },
      ],
      showReadAll: false,
      ttsName: " ",
      readContent: "No content",
      isTrans: false,
      currentAudio: null,
      addMore: true,
      addWord: false,
      insertWord: false,
      showGeneral: false,
      editWord: false,
      addNewWord: {
        number: 20002,
        word: "",
        pronunciation: "",
        phoneticSplit: "",
        syllable: "",
        roots: "",
        partOfSpeech: "",
        collocation: "",
        exampleSentence: "",
        exampleTranslation: "",
        level: "",
        wordNote: "",
        familiarity: 0,
        date: "",
        require: Number(window.localStorage.getItem("require")) || 0,
        temp1: 0,
        temp2: 0,
        temp3: 0,
      },
      formData: {
        word: "",
        partOfSpeech: "",
        phonetics: {
          uk: "",
          us: "",
        },
        syllablesInput: "",
        phonicsInput: "",
      },
      wordData: {
        word: "",
        partOfSpeech: "",
        phonetics: {
          uk: "",
          us: "",
        },
        syllables: [],
        phonics: [],
      },
      highlightedIndex: null,
      speechInterval: null,
      autoRead: true,
      showDic: false,
      wordIndex: 1,
      isStudying: false,
      showRead: false,
      isAnswered: false,
      answerWord: "",
      studyWordList: [],
      testInterval: "1 1 2 3 5 8 12 18",
      isWordReciter: true,
      initReciter: true,
      isTesting: false,
      listWord: null,
      dictionaryWord: null,
      dictionary: [],
      wordList: [],
      percentage: 30,
      dRead: 1,
      originalWords: [],
      blankIndices: [],
      processedLetters: [],
      userLetterAnswers: [],
      originalLetters: [],
      blankLetterIndices: [],
      showCloze: false,
      showFeedback: false,
      originalValue: "",
      originalItems: [],
      shuffledItems: [],
      currentSpelling: [],
      showGame: false,
      isCorrect: false,
      historyStack: [],
      showDicSetting: false,
      showSpell: false,
      showAlert: false,
      fakeAudio: false,
      tempFakeAudio: false,
      showFakeAlert: false,
      tempUrl: "",
      tempType: 1,
      fakeStatus: false,
      audioEnded: true,
      keySound: null,
      typingSound: true,
      recognition1: null,
      isRecordingTrans: false,
      speechRecognitionSupported: false,
      isFromLocal: false,
      isProcessing1: false,
      isProcessing2: false,
      transcriptionResult: "",
      sK: "",
      sR: "",
      isDragging: false,
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
      tempIndex: 1,
      alertVisible: false,
      clickTimer: null,
      inSubProcess: false,
      selectedOption: null,
      textToTranslate: "",
      targetLanguage: "aa",
      originTargetLanguage: "bb",
      translatedText: "",
      originLine: 0,
      apiKey: "",
      region: "",
      ttsWrong: false,
      translatorUrl: "ali-translator:default",
      hoverNavLeft: false,
      hoverNavRight: false,
      showModal: false,
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
      isCheck: false,
      dictationContent: "",
      fromClick: true,
      hasConfirmed: false,
      moveAll1: 0,
      moveAll2: 0,
      shrinkAll: 1,
      hasMoveAll: false,
      audioContext: null,
      minPxPerSec: 45,
      scrollbar: false,
      fillParent: false,
      cont: true,
      startTime: null,
      startX: null,
      startY: null,
      timeDiff: null,
      distanceX: null,
      distanceY: null,
      interval: 2,
      intervalId: null,
      timeOutId2: null,
      timeOutId4: null,
      random: false,
      currentSpeed: "0.8 0.5",
      listing: null,
      isSetting: false,
      isEmpty: false,
      isSingle: true,
      isFav: false,
      isFavOnPlay: false,
      isReadyToPlay: true,
      subtitleLang: 1,
      isShowLine1: true,
      isShowLine2: true,
      isShowLine3: false,
      isUtterTransLine: true,
      pauseTimeTransLine: 3,
      speedOfUtter: 1,
      langInOriginLine: "en-US",
      langInOriginLinedefault: "en-US",
      langInTransLine: navigator.language || navigator.userLanguage,
      isAutoDetectLang: false,
      touches: 0,
      isPauseAfterFirstDone: false,
      pauseAfterFirstDone: false,
      resized: false,
      isFirstClick: true,
      hasSpeechSynthesis:
        !!window.speechSynthesis || "speechSynthesis" in window,
      utterThis: null,
      audio: null,
      isSystemTTS: "Yes",
      note: "     ",
      confirmType: "",
      showSubtitleList: false,
      showNewWordList: false,
      sessionLength: null,
      isSlowInternet: false,
      isDictation: false,
      subFirstLine: "     ",
      startTimeTemp: 0,
      subSecLine: "     ",
      reader: 0,
      readerO: 0,
      newWord: "",
      newTranslation: "",
      mobileScreen: this.checkMobileScreen(),
      transUrl: "https://fanyi.baidu.com/#auto/auto/",
      transcribeUrl: "defaultkey1,eastasia",
      TTSurl: "azure-tts:defaultkey1,eastasia,zh-CN-YunyiMultilingualNeural",
      TTSurlO: "azure-tts:defaultkey1,eastasia,en-US-GuyNeural",
    };
  },

  computed: {
    ...mapState(["req", "user", "oldReq"]),

    prSelectedWords() {
      return this.prWordList.filter(
        (word, index) => this.prSelectedIndexes[index]
      );
    },

    realCheck() {
      if (
        this.studyWordList.length != 0 &&
        this.studyWordList[this.wordIndex - 1] &&
        this.dictationContent.length >=
          this.studyWordList[this.wordIndex - 1].word.length
      )
        return true;
      else return false;
    },
    clzCurrentWord() {
      return this.studyWordList[this.wordIndex - 1];
    },
    settingArr() {
      return [
        this.interval,
        this.isAutoNext,
        this.autoRead,
        this.inputByLetters,
        this.moreLetters,
        this.isAutoDetectLang,
        this.langInOriginLine,
        this.langInTransLine,
        this.isSystemTTS,
        this.readerO,
        this.reader,
        this.TTSurlO,
        this.TTSurl,
        this.speedOfUtter,
        this.typingSound,
        this.transUrl,
        this.translatorUrl,
        this.maxLevel,
        this.testInterval,
        this.filterLevel,
        this.requireLevel,
        this.filterFam1,
        this.filterFam2,
        this.closeWordTest,
        this.isFromLocal,
        this.showSelectT,
        this.showCToET,
        this.showCToE,
        this.selectList,
        this.onTransT,
        this.isDicTest,
        this.onTransO,
        this.showLToET,
        this.selectedValue,
      ];
    },
    initTList() {
      if (this.initReciter && this.wordList.length != 0)
        return this.getStudyWordList(1);
      else return [];
    },
    initSList() {
      if (this.initReciter && this.wordList.length != 0)
        return this.getStudyWordList(2);
      else return [];
    },
    prTempList() {
      return this.prGetStudyWordList();
    },
    fromLocal() {
      if (this.isFromLocal) return this.$t("repeater.subTranscribe00");
      else return this.$t("repeater.subTranscribe01");
    },
    canGenerate() {
      if (
        !(
          this.studyWordList[this.wordIndex - 1].pronunciation.split("[")[2] &&
          this.studyWordList[this.wordIndex - 1].phoneticSplit.includes("=") &&
          this.studyWordList[this.wordIndex - 1].syllable != ""
        )
      )
        return false;
      if (
        !this.formData.word.trim() ||
        !this.formData.partOfSpeech.trim() ||
        !this.formData.syllablesInput.trim() ||
        !this.formData.phonicsInput.trim()
      ) {
        return false;
      }

      const pairs = this.formData.phonicsInput.split(";");
      return pairs.every((pair) => {
        const [letters, phoneme] = pair.split("=").map((part) => part.trim());
        return letters && phoneme !== undefined;
      });
    },
    nb() {
      return this.wordIndex;
    },
    ttl() {
      if (this.initReciter)
        return this.initTList.length + this.initSList.length;
      else if (this.addWord) return this.wordList.length;
      else return this.studyWordList.length;
    },

    inputSentence() {
      if (this.isStudying && this.showCloze)
        return this.studyWordList[this.wordIndex - 1].word;
      else return null;
    },

    inputWord() {
      if (
        (!this.showSpell && this.isStudying) ||
        (!this.inputByLetters && this.isTesting) ||
        !this.studyWordList[this.wordIndex - 1]
      )
        return null;
      else return this.studyWordList[this.wordIndex - 1].word;
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

    batchNewList() {
      if (this.addBatchWord) {
        const aWordSet = new Set(this.wordList.map((item) => item.word));
        return this.dictionary.filter((item) => {
          const hasPrimaryLevel = item.level
            ? item.level.includes(this.prFilterLevel)
            : false;
          return !aWordSet.has(item.word) && hasPrimaryLevel;
        });
      } else return null;
    },

    isMobile() {
      return window.innerWidth < 738;
    },

    defaultDictation() {
      if (!this.isRecording && this.isWordReciter && this.showRead)
        return "请点击录音按钮开始，或使用系统输入法的语音输入";
      if (this.showDic)
        return "可使用键盘输入，或系统输入法的语音输入、手写输入";
      if (this.isRecording && this.isFromLocal)
        return this.$t("repeater.dictationDefault2");
      if (this.isRecording && !this.isFromLocal)
        return this.$t("repeater.dictationDefault3");
      if (this.isFavOnPlay) return this.$t("repeater.dictationDefault1");
      else return this.$t("repeater.dictationDefault");
    },

    showCasePlaceHolder() {
      if (this.isCaseSensitive) return this.$t("repeater.caseSensitive");
      else return this.$t("repeater.caseInSensitive");
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
      return this.req;
    },

    tokenFromServer() {
      return this.$route.path;
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

    totalBlanks() {
      return this.blankLetterIndices.length;
    },
    correctCount() {
      if (this.showFeedback) {
        return this.processedLetters.filter(
          (letter) => letter.isChecked && letter.isCorrect
        ).length;
      } else return 0;
    },

    isClozeRight() {
      return Math.round((this.correctCount / this.totalBlanks) * 100) == 100;
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

    isRight() {
      if (
        this.dictationContent.length >=
          this.studyWordList[this.wordIndex - 1].word.length &&
        this.isStudying
      ) {
        if (
          this.isStudying &&
          this.studyWordList[this.wordIndex - 1].word
            .replace(/[\p{P}]+/gu, "")
            .toLowerCase() ==
            this.dictationContent.replace(/[\p{P}]+/gu, "").toLowerCase()
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

    isIphone() {
      return /iPhone/i.test(navigator.userAgent);
    },
  },

  watch: {
    selectedValue() {
      if (this.selectedValue == 1) {
        this.inputByLetters = false;
        this.showSelectT = false;
        this.showCToET = false;
        this.showLToET = false;
      } else if (this.selectedValue == 2) {
        this.inputByLetters = true;
        this.showSelectT = false;
        this.showCToET = false;
        this.showLToET = false;
      } else if (this.selectedValue == 3) {
        this.inputByLetters = false;
        this.showSelectT = true;
        this.showCToET = false;
        this.showLToET = false;
      } else if (this.selectedValue == 4) {
        this.inputByLetters = false;
        this.showSelectT = true;
        this.showCToET = true;
        this.showLToET = false;
      } else if (this.selectedValue == 5) {
        this.inputByLetters = false;
        this.showSelectT = false;
        this.showCToET = false;
        this.showLToET = true;
      }
    },
    prTempList() {
      if (this.prOutput) {
        this.prWordList = this.prTempList;
        this.prToggleSelectAll();
      }
    },
    prOutput() {
      if (this.prOutput) {
        this.prWordList = this.wordList;
        this.prToggleSelectAll();
      }
    },

    prSelectedIndexes: {
      handler(newPrSelectedIndexes) {
        const selectedCount =
          Object.values(newPrSelectedIndexes).filter(Boolean).length;
        this.prAllSelected = selectedCount === this.prWordList.length;
      },
      deep: true,
    },
    showSelectT() {
      if (this.showSelectT && this.isTesting) this.clzGenerateOptions();
      else if (!this.showSelectT && this.isTesting && this.inputByLetters) {
        this.splitInput();
      }
    },
    showSelect() {
      if (this.showSelect && this.showCToE && this.isStudying)
        this.clzGenerateOptions();
    },

    showCToE() {
      if (this.isStudying) this.clzGenerateOptions();
    },
    showCToET() {
      if (this.showSelectT && this.isTesting) this.clzGenerateOptions();
    },
    showRead() {
      if (this.showRead) this.initSpeechRecognition();
      else {
        if (this.recognition1 && this.isRecordingTrans) {
          this.recognition1.stop();
        }
      }
    },
    settingArr(newVal) {
      window.localStorage.setItem(
        "wordReciterSettings",
        JSON.stringify(newVal)
      );
      this.saveNow();
    },

    inputByLetters() {
      if (this.inputByLetters) {
        this.splitInput();
      }
    },
    "addNewWord.require"() {
      window.localStorage.setItem("require", this.addNewWord.require);
    },

    realCheck() {
      if (this.realCheck && this.isStudying) {
        setTimeout(() => {
          let audioPath = "";
          if (this.isRight)
            audioPath = this.urla.split("/api/")[0] + "/static/right.mp3";
          else audioPath = this.urla.split("/api/")[0] + "/static/wrong.mp3";
          this.currentAudioPlay(audioPath);
        }, 10);
      }
    },

    wordList: {
      handler(newVal, oldVal) {
        if (oldVal.length == 0) return;
        this.saveToWordListFile();
      },
      deep: true,
      immediate: false,
    },

    filterLevel() {
      this.filterLevel = this.filterLevel.trim();
    },
    initReciter() {
      if (this.initReciter) this.studyWordList = this.getStudyWordList(1);
    },
    testInterval() {
      this.testInterval = this.testInterval.trim().replace(/\s+/g, " ");
      if (this.testInterval == "")
        this.testInterval = this.generateReviewIntervals(this.maxLevel);
      if (this.testInterval.split(" ").length < this.maxLevel)
        this.testInterval = "Need more numbers...";
    },
    maxLevel() {
      if (this.maxLevel < 1) this.maxLevel = 1;
      if (this.testInterval == "")
        this.testInterval = this.generateReviewIntervals(this.maxLevel);
      if (this.testInterval.split(" ").length < this.maxLevel)
        this.testInterval = "Need more numbers...";
    },

    readCount() {
      if (this.readCount != 0) {
        if (this.selectList[this.readCount - 1].value == "option1") {
          this.readContent = this.studyWordList[this.wordIndex - 1].word
            ? this.studyWordList[this.wordIndex - 1].word
            : "empty";
          this.readPart(0);
        } else if (this.selectList[this.readCount - 1].value == "option2") {
          this.readContent = this.studyWordList[this.wordIndex - 1].word
            ? this.studyWordList[this.wordIndex - 1].word
            : "empty";
          this.readContent = this.readContent
            .split("")
            .map((char) => char + "!")
            .join("");
          this.readPart(0);
        } else if (this.selectList[this.readCount - 1].value == "option3") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].partOfSpeech != "-"
              ? this.studyWordList[this.wordIndex - 1].partOfSpeech
              : "empty";
          this.readPart(1);
        } else if (this.selectList[this.readCount - 1].value == "option4") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].wordNote != "-"
              ? this.studyWordList[this.wordIndex - 1].wordNote
              : "empty";
          this.readPart(1);
        } else if (this.selectList[this.readCount - 1].value == "option5") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].roots != "-"
              ? this.studyWordList[this.wordIndex - 1].roots
              : "empty";
          this.readPart(1);
        } else if (this.selectList[this.readCount - 1].value == "option6") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].collocation != "-"
              ? this.studyWordList[this.wordIndex - 1].collocation
              : "empty";
          this.readPart(0);
        } else if (this.selectList[this.readCount - 1].value == "option7") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].exampleSentence != "-"
              ? this.studyWordList[this.wordIndex - 1].exampleSentence
              : "empty";
          this.readPart(0);
        } else if (this.selectList[this.readCount - 1].value == "option8") {
          this.readContent =
            this.studyWordList[this.wordIndex - 1].exampleTranslation != "-"
              ? this.studyWordList[this.wordIndex - 1].exampleTranslation
              : "empty";
          this.readPart(1);
        }
      }
    },
    $route: function () {
      this.updatePreview();
    },

    inputWord() {
      if (this.inputWord && this.inputWord.trim() !== "") {
        this.splitInput();
      }
    },

    inputSentence() {
      if (this.inputSentence && this.inputSentence.trim() !== "")
        this.generateCloze();
    },

    transcriptionResult() {
      this.dictationContent = this.transcriptionResult;
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
    },

    newWord() {
      if (this.readCount !== 0) return;
      this.newWord = this.newWord.replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "");
      if (this.newWord.trim() == "") {
        this.addNewWord.number = 20002;
        this.addNewWord.word = "";
        this.addNewWord.pronunciation = "";
        this.addNewWord.phoneticSplit = "";
        this.addNewWord.syllable = "";
        this.addNewWord.roots = "";
        this.addNewWord.partOfSpeech = "";
        this.addNewWord.collocation = "";
        this.addNewWord.exampleSentence = "";
        this.addNewWord.exampleTranslation = "";
        this.addNewWord.level = "";
        this.addNewWord.wordNote = "";
        this.addNewWord.familiarity = 0;
        this.addNewWord.date = "";
        this.addNewWord.require =
          Number(window.localStorage.getItem("require")) || 0;
        this.addNewWord.temp1 = 0;
        this.addNewWord.temp2 = 0;
        this.addNewWord.temp3 = 0;
        return; //This one is important to save too many requests, can't be ignored.
      }
      this.cleanUp();
      this.getOriginLang();
      this.listWord = null;
      if (this.wordList.length > 0) {
        this.listWord = this.findWord(this.wordList, this.newWord);
      }
      if (this.listWord) {
        this.addNewWord = { ...this.listWord };
        this.addNewWord.word = this.newWord;
        if (this.addWord) alert("已在单词表中，保存后将更新到单词本末尾。");
        if (this.insertWord)
          alert("已在单词表中，保存后将移动到当前单词之后。");
      } else {
        this.dictionaryWord = null;
        this.dictionaryWord = this.findWord(this.dictionary, this.newWord);
        if (this.dictionaryWord) {
          this.addNewWord.number = this.dictionaryWord.number;
          this.addNewWord.word = this.dictionaryWord.word;
          this.addNewWord.pronunciation = this.dictionaryWord.pronunciation;
          this.addNewWord.phoneticSplit = this.dictionaryWord.phoneticSplit;
          this.addNewWord.syllable = this.dictionaryWord.syllable;
          this.addNewWord.roots = this.dictionaryWord.roots;
          this.addNewWord.partOfSpeech = this.dictionaryWord.partOfSpeech;
          this.addNewWord.collocation = this.dictionaryWord.collocation;
          this.addNewWord.exampleSentence = this.dictionaryWord.exampleSentence;
          this.addNewWord.exampleTranslation =
            this.dictionaryWord.exampleTranslation;
          this.addNewWord.level = this.dictionaryWord.level;
          this.addNewWord.wordNote = "";
          this.addNewWord.familiarity = 0;
          this.addNewWord.date = "";
          this.addNewWord.require =
            Number(window.localStorage.getItem("require")) || 0;
          this.addNewWord.temp1 = 0;
          this.addNewWord.temp2 = 0;
          this.addNewWord.temp3 = 0;
        } else {
          const date = Date.now();
          this.addNewWord.word = this.newWord;
          this.addNewWord.number = 20001;
          this.addNewWord.familiarity = 0;
          this.addNewWord.date = date;
          if (this.translatorUrl.includes("zure-translator"))
            this.azureTranslate();
          else this.aliTranslate(2);
        }
      }
      this.readContent = this.newWord;
      this.readPart(0);
    },

    TTSurl: function () {
      this.TTSurl = this.TTSurl.replaceAll(" ", "");
    },

    TTSurlO: function () {
      this.TTSurlO = this.TTSurlO.replaceAll(" ", "");
    },

    transcribeUrl: function () {
      if (this.transcribeUrl == "") this.transcribeUrl = "defaultkey1,eastasia";
    },

    speedOfUtter: function () {
      if (this.speedOfUtter < 0.1) this.speedOfUtter = 0.1;
    },
    isAutoDetectLang: function () {
      if (this.isAutoDetectLang) {
        this.langInTransLine = navigator.language || navigator.userLanguage;
      }
    },

    transUrl: function () {
      if (this.transUrl.trim() == "")
        this.transUrl = "https://fanyi.baidu.com/#zh/en/";
    },

    reader() {
      if (this.hasSpeechSynthesis) {
        if (this.reader < 1) this.reader = 1;
        this.reader = Math.floor(this.reader);
      } else this.reader = 0;
    },

    wordIndex() {
      if (
        this.isTesting ||
        (this.isStudying && this.autoRead && this.readCount == 0)
      )
        this.readTestWord();
      if (this.showPhonics) {
        this.switchShow();
        this.setFormdata();
      }
      this.transcriptionResult = "";
      this.dictationContent = "";
      if (this.wordIndex > this.studyWordList.length)
        this.wordIndex = this.studyWordList.length;
    },
    readerO() {
      if (this.hasSpeechSynthesis) {
        if (this.readerO < 1) this.readerO = 1;
        this.readerO = Math.floor(this.readerO);
      } else this.readerO = 0;
    },
  },

  async mounted() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.key);
    this.urla = api.getDownloadURL(this.req, true);
    let typeUrl = this.urla.split("/api/")[0] + "/static/type.mp3";
    this.keySound = new Howl({
      src: [typeUrl],
      volume: 0.5, //0-1
      preload: true,
    });
    document.addEventListener("keydown", this.handleKeyPress);
    this.listing = this.oldReq.items;
    this.updatePreview();
    this.initUtter();
    if (this.reqF.size == 0) {
      this.reqF.content =
        "1\n00:00:01,000 --> 00:00:02,000\nEmpty File. Add sentences in Edit mode, and use TTS to read aloud the original text.";
    }
    if (this.reqF.content == undefined) {
      this.openAlert(1, this.$t("repeater.wrongSrt"), "wrongSrt");
    }
    this.initConfig();
    this.getNewWordList();
    this.getDictionary();
    if (!this.checkLocalStorageSpace()) {
      this.openAlert(1, this.$t("repeater.alertSpace"));
    }
    setTimeout(() => {
      this.studyWordList = this.initTList;
    }, 100);
    if (this.translatorUrl.includes("li-translator:"))
      this.getTranslateReport();
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.key);
    document.removeEventListener("keydown", this.handleKeyPress);
    if (this.keySound) {
      this.keySound.unload();
    }
    this.cleanUp();
    if (this.audioContext) {
      this.audioContext.close();
    }
  },

  methods: {
    async initConfig() {
      let PDJcontent = "";
      try {
        let serverContent = await api.fetch("/files" + this.favFileName);
        this.PDJRepeaterContent =
          serverContent.content.split("PDJWordList::")[0];
        if (serverContent.content.split("PDJWordList::")[1])
          PDJcontent = serverContent.content.split("PDJWordList::")[1];
        if (PDJcontent != "")
          window.localStorage.setItem("wordReciterSettings", PDJcontent);
      } catch (e) {
        PDJcontent = localStorage.getItem("wordReciterSettings");
      } finally {
        if (PDJcontent && PDJcontent != "") {
          const arr = JSON.parse(PDJcontent);
          this.interval = arr[0];
          this.isAutoNext = arr[1];
          this.autoRead = arr[2];
          this.inputByLetters = arr[3];
          this.moreLetters = arr[4];
          this.isAutoDetectLang = arr[5];
          this.langInOriginLine = arr[6];
          this.langInTransLine = arr[7];
          this.isSystemTTS = arr[8];
          this.readerO = arr[9];
          this.reader = arr[10];
          this.TTSurlO = arr[11];
          this.TTSurl = arr[12];
          this.speedOfUtter = arr[13];
          this.typingSound = arr[14];
          this.transUrl = arr[15];
          this.translatorUrl = arr[16];
          this.maxLevel = arr[17];
          this.testInterval = arr[18];
          this.filterLevel = arr[19];
          this.requireLevel = arr[20];
          this.filterFam1 = arr[21];
          this.filterFam2 = arr[22];
          this.closeWordTest = arr[23];
          this.isFromLocal = arr[24];
          this.showSelectT = arr[25];
          this.showCToET = arr[26];
          this.showCToE = arr[27];
          this.selectList = arr[28];
          this.onTransT = arr[29];
          this.isDicTest = arr[30];
          this.onTransO = arr[31];
          this.showLToET = arr[32];
          this.selectedValue = arr[33];
        }
      }
    },

    async saveNow() {
      if (this.PDJRepeaterContent == "") return;
      const tempConfig = window.localStorage.getItem("wordReciterSettings");
      const allContent = this.PDJRepeaterContent + "PDJWordList::" + tempConfig;
      try {
        await api.post("/files" + this.favFileName, allContent, true);
      } catch (error) {
        return;
      }
    },

    toDic() {
      if (!this.isStudying) return;
      this.switchShow();
      this.dictationContent = "";
      this.showDic = true;
    },
    switchReadAll() {
      this.showReadAll = true;
      if (this.readCount !== 0) this.click();
    },

    prToggleSelectAll() {
      const newPrSelectedIndexes = {};
      if (this.prAllSelected) {
        this.prWordList.forEach((word, index) => {
          newPrSelectedIndexes[index] = true;
        });
      }
      this.prSelectedIndexes = newPrSelectedIndexes;
    },

    prGenerateHTML() {
      if (this.prSelectedWords.length === 0) {
        alert("请至少选择一个单词");
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
      if (this.prSelectedWords.length === 0) {
        alert("请至少选择一个单词");
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
      if (this.selectedLayout === "layout1") {
        return this.createLayout1();
      } else {
        return this.createLayout2();
      }
    },

    createLayout1() {
      const columns = 10;
      const rowsPerPage = 100000;
      const totalSheets = Math.ceil(this.prSelectedWords.length / rowsPerPage);
      let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.prFileName}</title>
    <style>
        @page {
            size: A4 landscape; /* A4横向排版 */
        }
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
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
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            border-left: 1px dashed #000;
            border-right: 1px dashed #000;
            padding: 3px;
            text-align: left;
            font-size: 12px;
            height: 30px;
        }
        th:first-child, td:first-child {
            border-left: 1px solid #000;
        }
        th:last-child, td:last-child {
            border-right: 1px solid #000;
        }
        /* 单词列（第8列）左侧显示两条实线 */
        th:nth-child(9), td:nth-child(9) {
            border-left: 1px solid #000;
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
        .prWordCell {
            font-weight: bold;
            width: 150px;
            font-size: 1em;
            text-align: center;
        }
        .prMeaningCell {
            width: 150px;
        }
        .prWritingCell {
            width: 80px;
        }
        .prCheckboxCell {
            text-align: center;
            width: 97px;
        }
        .prPageHeader {
            text-align: center;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
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
        html += `<div class="prPageHeader">${this.prFileName}</div>`;
        html += `<table>`;
        html += `<tr>`;
        for (let col = 0; col < columns; col++) {
          if (col === 0) {
            html += `<th class="prRowNumber">序号</th>`;
          } else if (col === columns - 1) {
            html += `<th class="prCheckboxCell" style="width:61px">对错记录区</th>`;
          } else if (col === columns - 2) {
            html += `<th class="prWordCell">单词</th>`;
          } else if (col === columns - 3) {
            html += `<th class="prMeaningCell">释义</th>`;
          } else if (col === columns - 4) {
            html += `<th class="prCheckboxCell">对错记录区</th>`;
          } else {
            html += `<th class="prWritingCell">书写区${col}</th>`;
          }
        }
        html += `</tr>`;
        const startIndex = sheetIndex * rowsPerPage;
        const endIndex = Math.min(
          startIndex + rowsPerPage,
          this.prSelectedWords.length
        );

        for (let i = startIndex; i < endIndex; i++) {
          const word = this.prSelectedWords[i];
          html += `<tr>`;

          for (let col = 0; col < columns; col++) {
            if (col === 0) {
              html += `<td class="prRowNumber">${i + 1}</td>`;
            } else if (col === columns - 1) {
              html += `<td class="prCheckboxCell" style="width:61px">□ □ □</td>`;
            } else if (col === columns - 2) {
              if (this.printWithPron && word.pronunciation?.split(" ")[1])
                html += `<td class="prWordCell">${
                  word.word
                }  <span style="font-weight: normal; font-size: 0.7em">${
                  word.pronunciation.split(" ")[1]
                }</span></td>`;
              else html += `<td class="prWordCell">${word.word}</td>`;
            } else if (col === columns - 3) {
              html += `<td class="prMeaningCell">${word.partOfSpeech}</td>`;
            } else if (col === columns - 4) {
              html += `<td class="prCheckboxCell">□ □ □ □ □</td>`;
            } else {
              html += `<td class="prWritingCell">&nbsp;</td>`;
            }
          }

          html += `</tr>`;
        }

        html += `</table></div>`;
      }

      html += `</body></html>`;
      return html;
    },
    clzGenerateOptions() {
      this.clzSelectedOption = null;
      this.clzIsAnswered = false;
      const includeCorrect = Math.random() < 0.8;
      let otherWords;
      if (
        (this.isStudying && !this.showCToE) ||
        (this.isTesting && !this.showCToET)
      ) {
        this.clzCorrectAnswer = includeCorrect
          ? this.clzCurrentWord.partOfSpeech
          : "以上全不对";
        otherWords = this.wordList.filter(
          (word) => word.partOfSpeech !== this.clzCurrentWord.partOfSpeech
        );
      } else {
        this.clzCorrectAnswer = includeCorrect
          ? this.clzCurrentWord.word
          : "以上全不对";
        otherWords = this.wordList.filter(
          (word) => word.word !== this.clzCurrentWord.word
        );
      }
      let needCount = 1;
      if (this.isTesting) needCount = includeCorrect ? 3 : 4;
      else needCount = includeCorrect ? 2 : 3;
      const randomOptions = [];
      while (randomOptions.length < needCount && otherWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        const selected = otherWords.splice(randomIndex, 1)[0];
        if (
          (((this.isStudying && !this.showCToE) ||
            (this.isTesting && !this.showCToET)) &&
            !randomOptions.some(
              (opt) => opt.partOfSpeech === selected.partOfSpeech
            )) ||
          (((this.isStudying && this.showCToE) ||
            (this.isTesting && this.showCToET)) &&
            !randomOptions.some((opt) => opt.word === selected.word))
        ) {
          randomOptions.push({
            partOfSpeech: selected.partOfSpeech,
            word: selected.word,
          });
        }
      }

      let mainOptions = includeCorrect
        ? [
            ...randomOptions,
            {
              partOfSpeech: this.clzCurrentWord.partOfSpeech,
              word: this.clzCurrentWord.word,
            },
          ]
        : randomOptions;
      mainOptions = this.clzShuffleArray(mainOptions);
      if (
        (this.isStudying && !this.showCToE) ||
        (this.isTesting && !this.showCToET)
      )
        this.clzOptions = [
          ...mainOptions,
          { partOfSpeech: "以上全不对", word: null },
        ];
      else
        this.clzOptions = [
          ...mainOptions,
          { word: "以上全不对", partOfSpeech: null },
        ];
    },

    createLayout2() {
      const rowsPerPage = 18;
      const totalSheets = Math.ceil(
        this.prSelectedWords.length / (rowsPerPage * 2)
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
            size: A4 landscape; /* A4横向排版 */
        }
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
        }
        .prPage {
            page-break-after: always;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            gap: 100px;
        }
        .prPage:last-child {
            page-break-after: auto;
        }
        .layout2-table {
            flex: 1;
            width: 48%;
            border-collapse: collapse;
            border: 1px solid #000;
        }
        th, td {
            border: 1px solid #000;
            padding: 3px;
            text-align: left;
            font-size: 12px;
            height: 30px;
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
        .prWordCell {
            font-weight: bold;
            width: 165px;
            font-size: 1em;
            text-align: center;
        }
        .prMeaningCell {
            width: 165px;
        }
        .prCheckboxCell {
            text-align: center;
            width: 40px;
        }
        .prPageHeader {
            text-align: center;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
        }
        @media print {
            body {
                padding: 0;
            }
            .prPage {
                margin: 0;
                padding: 10px;
            }
            @page {
              margin-top: 10mm; /* 上页边距（mm单位更适合打印） */
              margin-bottom: 10mm; /* 下页边距 */
            }
        }
    </style>
</head>
<body>
    `;

      for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
        html += `<div class="prPage">`;
        html += `<table class="layout2-table">`;

        const leftStart = sheetIndex * rowsPerPage * 2;
        const leftEnd = Math.min(
          leftStart + rowsPerPage,
          this.prSelectedWords.length
        );
        for (let i = leftStart; i < leftEnd; i++) {
          const word = this.prSelectedWords[i];
          html += `<tr>`;
          html += `<td class="prRowNumber">${i + 1}</td>`;
          html += `<td class="prMeaningCell">${word.partOfSpeech}</td>`;
          if (this.printWithPron && word.pronunciation?.split(" ")[1])
            html += `<td class="prWordCell">${
              word.word
            }  <span style="font-weight: normal; font-size: 0.7em">${
              word.pronunciation.split(" ")[1]
            }</span></td>`;
          else html += `<td class="prWordCell">${word.word}</td>`;
          html += `<td class="prCheckboxCell">□</td>`;
          html += `</tr>`;
        }
        html += `</table>`;
        html += `<table class="layout2-table">`;
        const rightStart = leftStart + rowsPerPage;
        const rightEnd = Math.min(
          rightStart + rowsPerPage,
          this.prSelectedWords.length
        );
        for (let i = rightStart; i < rightEnd; i++) {
          const word = this.prSelectedWords[i];
          html += `<tr>`;
          html += `<td class="prRowNumber">${i + 1}</td>`;
          html += `<td class="prMeaningCell">${word.partOfSpeech}</td>`;
          if (this.printWithPron && word.pronunciation?.split(" ")[1])
            html += `<td class="prWordCell">${
              word.word
            }  <span style="font-weight: normal; font-size: 0.7em">${
              word.pronunciation.split(" ")[1]
            }</span></td>`;
          else html += `<td class="prWordCell">${word.word}</td>`;
          html += `<td class="prCheckboxCell">□</td>`;
          html += `</tr>`;
        }
        html += `</table>`;

        html += `</div>`;
      }

      html += `</body></html>`;
      return html;
    },

    clzShuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },

    clzHandleSelect(option) {
      if (this.clzIsAnswered) return;
      this.clzSelectedOption = option;
      this.clzIsAnswered = true;
      if (this.isTesting) this.isAnswered = true;
      let audioPath = "";
      if (option === this.clzCorrectAnswer) {
        if (this.isTesting) {
          this.isCorrect = true;
          this.studyWordList[this.wordIndex - 1].familiarity =
            Number(this.studyWordList[this.wordIndex - 1].familiarity) + 1;
          const date = Date.now();
          this.studyWordList[this.wordIndex - 1].date = date;
        }
        audioPath = this.urla.split("/api/")[0] + "/static/right.mp3";
        this.currentAudioPlay(audioPath);
      } else {
        if (this.isTesting) {
          this.isCorrect = false;
          this.studyWordList[this.wordIndex - 1].familiarity = 0;
          const date = Date.now();
          this.studyWordList[this.wordIndex - 1].date = date;
        }
        audioPath = this.urla.split("/api/")[0] + "/static/wrong.mp3";
        this.currentAudioPlay(audioPath);
      }
    },

    handleConfirm(x) {
      if (x == 1) {
        const isConfirm = window.confirm("确定要删除当前单词吗？");
        if (isConfirm) {
          this.delCurrentWord();
        }
      }
      if (x == 2) {
        alert(this.$t("repeater.noRecordPermission"));
      }
      if (x == 3) {
        alert(
          "单词默写表使用方法：左侧为汉译英练习区域，右侧为英译汉练习区域。可沿单词列左侧竖实线折叠后进行练习。错误时可在对错记录区画X。在书写区1练习完成单词默写后，可沿其右侧的虚线裁剪或折叠，下次在书写区2继续默写。在全部练习完成后。单词卡布局使用方法：沿竖中线剪开，每部分再对折，每三行剪开，在对错记录区打孔，即可做成单词卡。注1：单词释义可在单词编辑页面进行修改。注2：可用excel打开生成的html文件并进行编辑和打印。注3：完整单词本文件位于服务器上的!PDJ/user-{{user.username}}/PDJ-wordlist.txt(请经常备份，以免丢失或损毁)，可将其内容复制到excel表格中(用||分割)，并根据需要删除多余的属性行和单词列，自行制作打印格式。"
        );
      }
    },
    delCurrentWord() {
      const index = this.wordList.findIndex(
        (item) => item === this.studyWordList[this.wordIndex - 1]
      );
      if (index !== -1) {
        this.wordList.splice(index, 1);
      }
      this.studyWordList = this.getStudyWordList(2, 1);
    },
    readTestWord() {
      this.cleanUp();
      if (
        (this.isTesting &&
          !this.isAnswered &&
          !this.showSelectT &&
          !this.showLToET) ||
        (this.isTesting &&
          !this.isAnswered &&
          this.showSelectT &&
          this.showCToET) ||
        (this.isTesting &&
          this.isAnswered &&
          this.showSelectT &&
          !this.showCToET) ||
        (this.isStudying &&
          !this.clzIsAnswered &&
          this.showSelect &&
          this.showCToE) ||
        (this.isStudying &&
          this.clzIsAnswered &&
          this.showSelect &&
          !this.showCToE) ||
        (this.isStudying &&
          this.isDicTest &&
          (((this.showDic || this.showRead) && !this.realCheck) ||
            this.showGeneral ||
            this.showPhonics ||
            (this.showSpell && !this.isCorrect) ||
            (this.showCloze && !this.isClozeRight)))
      ) {
        this.readContent = this.studyWordList[this.wordIndex - 1].partOfSpeech
          ? this.studyWordList[this.wordIndex - 1].partOfSpeech
          : "empty";
        this.readPart(1);
      } else {
        this.readContent = this.studyWordList[this.wordIndex - 1].word;
        this.readPart(0);
      }
    },
    toShuffle(x) {
      if (x == 1) this.shuffleList();
      else if (x == 3) this.shuffleList(1);
      else if (x == 4) this.shuffleList(2);
      else if (x == 2) this.shuffleList(3);
    },
    generateReviewIntervals(times) {
      const baseIntervals = [1, 2, 4, 7, 12, 20, 32, 50, 77, 117];
      const targetIntervals =
        times <= baseIntervals.length
          ? baseIntervals.slice(0, times)
          : baseIntervals;
      return targetIntervals.join(" ");
    },

    toFavList() {
      if (!this.showFav) {
        const tempList = this.getStudyWordList(3);
        if (tempList.length == 0) {
          alert("单词收藏列表为空！请添加单词收藏后再试！");
          return;
        } else {
          this.studyWordList = tempList;
          this.tempIndex = this.wordIndex;
          this.wordIndex = 1;
        }
      } else {
        this.studyWordList = this.getStudyWordList(2);
        this.wordIndex = this.tempIndex;
      }
      this.showFav = !this.showFav;
    },
    closeReadSetting() {
      this.showReadAll = false;
      this.selectList = this.selectList.filter((item) => item.value !== "");
    },

    currentAudioPlay(x) {
      this.currentAudio = null;
      this.currentAudio = new Audio(x);
      this.currentAudio.play();
    },

    playAll() {
      if (this.readCount == 0) {
        this.readCount = 1;
        this.showReadAll = false;
      } else {
        this.click();
      }
    },
    handleAdd() {
      this.selectList.push({
        value: "",
        isRemoving: false,
      });

      this.$nextTick(() => {
        const selects = document.getElementsByClassName("select-field");
        if (selects.length > 0) {
          selects[selects.length - 1].focus();
        }
      });
    },
    handleRemove(index) {
      if (this.selectList.length > 1) {
        this.selectList[index].isRemoving = true;
        setTimeout(() => {
          this.selectList.splice(index, 1);
        }, 300);
      } else {
        this.selectList[index].value = "";
        this.$nextTick(() => {
          document.getElementsByClassName("select-field")[0].focus();
        });
      }
    },

    switchOToT() {
      this.studyWordList[this.wordIndex - 1].temp3 = 0;
      this.isTrans = !this.isTrans;
    },
    chooseSentence(index) {
      this.studyWordList[this.wordIndex - 1].temp3 = 0;
      this.wordIndex = index + 1;
      this.studyWordList[index].temp3 = 1;
      if (!this.autoRead) this.click();
    },

    testPhonics() {
      this.switchShow();
      this.setFormdata();
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
    setFormdata() {
      if (
        this.studyWordList[this.wordIndex - 1].pronunciation.split("[")[2] &&
        this.studyWordList[this.wordIndex - 1].phoneticSplit.includes("=") &&
        this.studyWordList[this.wordIndex - 1].syllable != ""
      ) {
        this.formData.word = this.studyWordList[this.wordIndex - 1].word.trim();
        this.formData.partOfSpeech =
          this.studyWordList[this.wordIndex - 1].partOfSpeech.trim();
        this.formData.phonetics.uk = this.studyWordList[
          this.wordIndex - 1
        ].pronunciation
          .split("[")[1]
          .split("]")[0];
        this.formData.phonetics.us = this.studyWordList[
          this.wordIndex - 1
        ].pronunciation
          .split("[")[2]
          .split("]")[0];
        this.formData.phonicsInput = this.studyWordList[
          this.wordIndex - 1
        ].phoneticSplit.replaceAll(",", ";");
        this.formData.syllablesInput =
          this.studyWordList[this.wordIndex - 1].syllable;
        if (this.canGenerate) {
          this.generatePhonicsCard();
        }
      }
      this.showPhonics = true;
    },
    generatePhonicsCard() {
      this.wordData.word = this.formData.word;
      this.wordData.partOfSpeech = this.formData.partOfSpeech;
      this.wordData.phonetics = { ...this.formData.phonetics };
      const syllablesText = this.formData.syllablesInput.trim().split("-");
      this.wordData.syllables = syllablesText.map((text, sIndex) => {
        const pairs = this.formData.phonicsInput
          .split(";")
          .filter((pair) => pair.trim());
        const totalLetters = pairs.length;
        const lettersPerSyllable = Math.ceil(
          totalLetters / syllablesText.length
        );
        const startIndex = sIndex * lettersPerSyllable;
        let endIndex = startIndex + lettersPerSyllable;
        if (endIndex > totalLetters) endIndex = totalLetters;
        const indexes = [];
        for (let i = startIndex; i < endIndex; i++) {
          indexes.push(i);
        }

        return { text, indexes };
      });
      const pairs = this.formData.phonicsInput
        .split(";")
        .filter((pair) => pair.trim());
      this.wordData.phonics = pairs.map((item, index) => {
        const [letters, phoneme] = item.split("=").map((part) => part.trim());
        return {
          letters: letters || "",
          phoneme: phoneme || "-",
          index,
        };
      });
      this.highlightedIndex = null;
    },
    handleItemClick(index) {
      this.cleanUp();
      this.highlightedIndex = index;
      this.playPhonemeAudio(index);
    },
    playPhonemeAudio(index) {
      let phoneme = this.wordData.phonics[index].phoneme;
      if (phoneme == "l") {
        if (!this.wordData.phonics[index + 1]) {
          phoneme = "l2";
        } else {
          let phonemeNext = this.wordData.phonics[index + 1].phoneme.replace(
            /\(.*?\)/g,
            ""
          );
          let targetPhones = [
            "eɪ",
            "aɪ",
            "ɔɪ",
            "ɪə",
            "eə",
            "ʊə",
            "əʊ",
            "aʊ",
            "ɑː",
            "ʌ",
            "ɔː",
            "ɒ",
            "ɜː",
            "ə",
            "iː",
            "i",
            "ɪ",
            "uː",
            "ʊ",
            "e",
            "æ",
          ];
          const phoneSet = new Set(targetPhones);
          if (phoneSet.has(phonemeNext)) phoneme = "l1";
          else phoneme = "l2";
        }
      }

      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      if (phoneme === "-") return;
      let a = phoneme.replace(/\(.*?\)/g, "");
      const safeFileName = this.getSafeFileName(a);
      const audioPath =
        this.urla.split("/api/")[0] + "/static/ipa/" + safeFileName + ".mp3";
      this.currentAudioPlay(audioPath);
    },

    getSafeFileName(phoneme) {
      const charMap = {
        ɔːr: "51",
        ɑːr: "53",
        juː: "64",
        dz: "61",
        ts: "60",
        dr: "59",
        tr: "58",
        tʃ: "28",
        dʒ: "7",
        ɪə: "56",
        eə: "57",
        ʊə: "62",
        ɔɪ: "13",
        aɪ: "9",
        aʊ: "10",
        eɪ: "16",
        əʊ: "23",
        iː: "38",
        uː: "39",
        ɑː: "37",
        ɔː: "12",
        ə: "5",
        ɛ: "eh",
        ɜː: "52",
        ɪ: "2",
        i: "2",
        n: "1",
        t: "3",
        ʌ: "54",
        θ: "36",
        ð: "4",
        ʃ: "26",
        ŋ: "22",
        æ: "8",
        g: "6",
        ɡ: "6",
        b: "11",
        d: "14",
        e: "15",
        f: "17",
        j: "18",
        k: "19",
        l1: "63",
        l2: "201",
        m: "21",
        p: "24",
        r: "25",
        s: "27",
        ʊ: "29",
        v: "31",
        w: "32",
        z: "33",
        h: "34",
        ʒ: "35",
        ɒ: "55",
      };

      let fileName = phoneme;
      for (const [char, replacement] of Object.entries(charMap)) {
        fileName = fileName.replace(char, replacement);
      }

      return fileName.replace(/[^a-zA-Z0-9]/g, "");
    },

    readWord() {
      this.cleanUp();
      let index = 0;
      const totalPhonemes = this.wordData.phonics.length;

      this.speechInterval = setInterval(() => {
        if (index < totalPhonemes) {
          this.highlightedIndex = index;
          if (
            this.wordData.phonics[index] &&
            this.wordData.phonics[index].phoneme !== "-"
          ) {
            this.playPhonemeAudio(index);
          }
          index++;
        } else {
          clearInterval(this.speechInterval);
          setTimeout(() => (this.highlightedIndex = null), 500);
        }
      }, 800);
    },

    checkAnswser() {
      this.cleanUp();
      let audioPath = null;
      let resultStr = "";
      if (
        (this.showSpell && this.isStudying) ||
        (this.inputByLetters && this.isTesting)
      )
        resultStr = this.currentSpelling.join("");
      if (
        (this.showSpell && this.isStudying) ||
        (this.inputByLetters &&
          this.isTesting &&
          resultStr.trim().toLowerCase() ==
            this.studyWordList[this.wordIndex - 1].word.toLowerCase()) ||
        (!this.showSpell && this.isStudying) ||
        (!this.inputByLetters &&
          this.isTesting &&
          this.answerWord.trim().toLowerCase() ==
            this.studyWordList[this.wordIndex - 1].word.toLowerCase())
      ) {
        this.isCorrect = true;
        this.studyWordList[this.wordIndex - 1].familiarity =
          Number(this.studyWordList[this.wordIndex - 1].familiarity) + 1;
        audioPath = this.urla.split("/api/")[0] + "/static/right.mp3";
      } else {
        this.isCorrect = false;
        this.studyWordList[this.wordIndex - 1].familiarity = 0;
        audioPath = this.urla.split("/api/")[0] + "/static/wrong.mp3";
      }
      this.isAnswered = true;
      this.currentAudioPlay(audioPath);
      const date = Date.now();
      this.studyWordList[this.wordIndex - 1].date = date;
    },

    switchShow() {
      this.cleanUp();
      this.showPhonics = false;
      this.showGeneral = false;
      this.editWord = false;
      this.showSpell = false;
      this.showCloze = false;
      this.dictationContent = "";
      this.showDic = false;
      this.showRead = false;
      this.showSelect = false;
      setTimeout(() => {
        if (this.autoRead && this.isStudying) this.readTestWord();
      }, 100);
    },

    readPart(x) {
      if (x == 1)
        this.readContent = this.readContent.replace(/\[[\s\S]*?\]/g, "");
      if (this.isSystemTTS !== "Yes") {
        let vmm = this;
        if (x == 0) this.ttsName = this.TTSurlO + this.readContent;
        else this.ttsName = this.TTSurl + this.readContent;
        localforage
          .getItem(this.ttsName)
          .then(function (value) {
            vmm.audio.src = URL.createObjectURL(value);
            vmm.audio.playbackRate = vmm.curSpeed();
            vmm.audio.play();
            if (vmm.readCount != 0)
              vmm.audio.onended = () => {
                vmm.handleRead();
              };
          })
          .catch(function () {
            vmm.readNow(x);
            return;
          });
      } else this.readNow(x);
    },
    readNow(x) {
      if (x == 0) {
        if (this.addWord || this.insertWord) this.readContent = this.newWord;
        if (
          this.addWord ||
          this.insertWord ||
          this.studyWordList[this.wordIndex - 1].word
        ) {
          if (this.isSystemTTS == "Yes") this.testTTSVoiceO();
          else this.testTTSurlO();
        }
      } else if (x == 1) {
        if (this.studyWordList[this.wordIndex - 1].partOfSpeech) {
          if (this.isSystemTTS == "Yes") this.testTTSVoice();
          else this.testTTSurl();
        }
      }
    },

    prGetStudyWordList() {
      return this.wordList.filter((obj) => {
        if (this.prRequireLevel != -1 && obj.require != this.prRequireLevel)
          return false;
        return (
          obj.level.includes(this.prFilterLevel) &&
          obj.familiarity >= this.prFilterFam1 &&
          obj.familiarity <= this.prFilterFam2
        );
      });
    },

    getStudyWordList(x, y) {
      if (y !== 1) {
        this.wordIndex = 1;
      }
      return this.getStudyWordList1(x);
    },

    getStudyWordList1(x) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      if (this.testInterval == "Need more numbers...")
        this.testInterval = this.generateReviewIntervals(this.maxLevel);
      if (x == 1) {
        if (!this.closeWordTest) {
          return this.wordList.filter((obj) => {
            if (obj.familiarity >= this.maxLevel) return false;
            if (this.requireLevel != -1 && obj.require != this.requireLevel)
              return false;
            let days = Number(this.testInterval.split(" ")[obj.familiarity]);
            const timeDiff = Math.abs(obj.date - todayTimestamp);
            return (
              timeDiff > 24 * 60 * 60 * 1000 * days &&
              obj.level.includes(this.filterLevel) &&
              obj.familiarity >= this.filterFam1 &&
              obj.familiarity <= this.filterFam2
            );
          });
        } else return [];
      } else if (x == 2) {
        if (!this.closeWordTest)
          return this.wordList.filter((obj) => {
            if (obj.familiarity >= this.maxLevel) return false;
            if (this.requireLevel != -1 && obj.require != this.requireLevel)
              return false;
            let days = Number(this.testInterval.split(" ")[obj.familiarity]);
            const timeDiff = Math.abs(obj.date - todayTimestamp);
            return (
              timeDiff <= 24 * 60 * 60 * 1000 * days &&
              obj.level.includes(this.filterLevel) &&
              obj.familiarity >= this.filterFam1 &&
              obj.familiarity <= this.filterFam2
            );
          });
        else
          return this.wordList.filter((obj) => {
            if (obj.familiarity >= this.maxLevel) return false;
            if (this.requireLevel != -1 && obj.require != this.requireLevel)
              return false;
            return (
              obj.level.includes(this.filterLevel) &&
              obj.familiarity >= this.filterFam1 &&
              obj.familiarity <= this.filterFam2
            );
          });
      } else if (x == 3) {
        if (!this.closeWordTest)
          return this.wordList.filter((obj) => {
            if (obj.familiarity >= this.maxLevel || Number(obj.temp1) == 0)
              return false;
            if (this.requireLevel != -1 && obj.require != this.requireLevel)
              return false;
            let days = Number(this.testInterval.split(" ")[obj.familiarity]);
            const timeDiff = Math.abs(obj.date - todayTimestamp);
            return (
              timeDiff <= 24 * 60 * 60 * 1000 * days &&
              obj.level.includes(this.filterLevel) &&
              obj.familiarity >= this.filterFam1 &&
              obj.familiarity <= this.filterFam2
            );
          });
        else
          return this.wordList.filter((obj) => {
            if (obj.familiarity >= this.maxLevel || Number(obj.temp1) == 0)
              return false;
            if (this.requireLevel != -1 && obj.require != this.requireLevel)
              return false;
            return (
              obj.level.includes(this.filterLevel) &&
              obj.familiarity >= this.filterFam1 &&
              obj.familiarity <= this.filterFam2
            );
          });
      }
    },

    shuffleList(x) {
      if (x == 1) {
        for (let i = this.prWordList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.prWordList[i], this.prWordList[j]] = [
            this.prWordList[j],
            this.prWordList[i],
          ];
        }
      } else if (x == 2) {
        for (let i = 0; i < Math.floor(this.prWordList.length / 2); i++) {
          const j = this.prWordList.length - 1 - i;
          [this.prWordList[i], this.prWordList[j]] = [
            this.prWordList[j],
            this.prWordList[i],
          ];
        }
      } else if (x == 3) {
        for (let i = 0; i < Math.floor(this.studyWordList.length / 2); i++) {
          const j = this.studyWordList.length - 1 - i;
          [this.studyWordList[i], this.studyWordList[j]] = [
            this.studyWordList[j],
            this.studyWordList[i],
          ];
        }
      } else {
        for (let i = this.studyWordList.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.studyWordList[i], this.studyWordList[j]] = [
            this.studyWordList[j],
            this.studyWordList[i],
          ];
        }
      }
    },

    toStudy() {
      this.studyWordList = this.getStudyWordList(2);
      this.isStudying = true;
      this.initReciter = false;
      this.isTesting = false;
      this.showGeneral = true;
    },
    toAddWord() {
      this.newWord = "";
      this.addWord = true;
      this.initReciter = false;
      this.isTesting = false;
    },
    toAddBatchWord() {
      this.newWord = "";
      this.prFilterLevel = "";
      this.addBatchWord = true;
    },

    toLastWord() {
      this.cleanUp();
      if (this.isStudying && this.wordIndex > 1) {
        this.wordIndex = this.wordIndex - 1;
        this.isAnswered = false;
        this.answerWord = "";
        this.isCorrect = false;
      }
      if (this.showSelect || this.showSelectT) this.clzGenerateOptions();
    },

    toNextWord() {
      this.cleanUp();
      if (
        (this.isTesting || this.isStudying) &&
        this.wordIndex <= this.studyWordList.length - 1
      ) {
        this.wordIndex = this.wordIndex + 1;
        this.isAnswered = false;
        this.answerWord = "";
        this.isCorrect = false;
      }
      if (this.showSelect || this.showSelectT) this.clzGenerateOptions();

      if (
        (this.activeInput &&
          this.isTesting &&
          !this.showSelectT &&
          !this.inputByLetters &&
          !this.isAnswered) ||
        (this.isStudying &&
          !this.showSpell &&
          !this.showCloze &&
          (this.showDic || this.showRead))
      ) {
        this.$nextTick(() => {
          document.getElementsByClassName("autoFocus")[0].focus();
          this.activeInput = false;
        });
      }
    },

    isTest() {
      if (this.isInstruction) return;
      this.initReciter = false;
      this.isTesting = true;
      this.isStudying = false;
      this.isAnswered = false;
      this.answerWord = "";
      this.isCorrect = false;
      if (this.showSelectT) {
        this.clzGenerateOptions();
      } else if (this.inputByLetters) {
        this.splitInput();
      }
    },

    generateCloze() {
      this.reset(false);
      this.showCloze = true;
      this.showFeedback = false;

      const trimmedInput = this.inputSentence.trim();
      this.processWord(trimmedInput);
    },

    checkIfSingleWord(input) {
      return (
        !/\s+/.test(input) &&
        /^[a-zA-Z'-]+$/.test(input.replace(/[^a-zA-Z']/g, ""))
      );
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

    handleLetterInput(index) {
      const originalCase = this.originalLetters[index];
      let userInput = this.userLetterAnswers[index] || "";

      userInput =
        originalCase === originalCase.toUpperCase()
          ? userInput.toUpperCase()
          : userInput.toLowerCase();
      this.userLetterAnswers[index] = userInput;
      setTimeout(() => {
        this.checkLetterAnswer(index);
      }, 10);
    },

    checkLetterAnswer(index) {
      const userInput = this.userLetterAnswers[index] || "";
      this.processedLetters[index].isChecked = true;
      this.processedLetters[index].isCorrect =
        userInput === this.originalLetters[index];
      this.checkAllAnswered();
    },

    checkAllAnswers() {
      this.blankLetterIndices.forEach((index) => {
        this.checkLetterAnswer(index);
      });
      this.showFeedback = true;
    },

    checkAllAnswered() {
      let allAnswered = false;
      allAnswered = this.blankLetterIndices.every(
        (index) => this.userLetterAnswers[index] !== ""
      );
      if (allAnswered) {
        this.showFeedback = true;
      }
    },

    reset(clearInput = true) {
      if (clearInput) {
        this.inputSentence = "";
      }
      this.originalWords = [];
      this.blankIndices = [];
      this.processedLetters = [];
      this.userLetterAnswers = [];
      this.originalLetters = [];
      this.blankLetterIndices = [];
      this.showCloze = false;
      this.showFeedback = false;
    },

    splitInput() {
      if (!this.inputWord || this.inputWord.trim() == "") return;
      const processedInput = this.inputWord.trim();
      let processedChars = processedInput;
      if (processedChars.length < 1) {
        return;
      }
      this.originalItems = processedChars.split("");

      this.originalValue = this.originalItems.join("");
      this.showGame = true;
      this.resetSpelling();
    },

    addToSpelling(item) {
      if (item && item.trim() !== "") {
        if (this.newWord.trim() == item.trim()) {
          this.readContent = this.newWord;
          this.readPart(0);
        } else this.newWord = item.trim();
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
      if (
        (this.showSpell && this.isStudying) ||
        (this.inputByLetters && this.isTesting)
      ) {
        if (!this.historyStack.length) return;

        const lastState = this.historyStack.pop();
        this.currentSpelling = lastState.currentSpelling;
        this.shuffledItems = lastState.shuffledItems;
        this.checkCorrectness();
      }
    },

    checkCorrectness() {
      const currentValue = this.currentSpelling.join("");
      this.isCorrect = currentValue === this.originalValue;
    },

    resetSpelling() {
      if (
        (this.showSpell && this.isStudying) ||
        (this.inputByLetters && this.isTesting)
      ) {
        this.currentSpelling = [];
        this.isCorrect = false;
        this.shuffledItems = this.shuffleItems([...this.originalItems]);
        if (this.isWordReciter && this.addMore) {
          const addCount = Math.floor(
            this.shuffledItems.length * this.moreLetters
          );
          for (let i = 0; i < addCount; i++) {
            const randomLetter = this.getRandomLetter();
            const insertIndex = Math.floor(
              Math.random() * (this.shuffledItems.length + 1)
            );
            this.shuffledItems.splice(insertIndex, 0, randomLetter);
          }
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

    handleKeyPress(event) {
      const isInput = event.target.tagName === "INPUT";
      if (!isInput || this.prOutput) {
        return;
      }
      if (this.typingSound) {
        const isLetterOrPunctuation = /^[a-zA-Z ,.;:?]$/.test(event.key);
        if (isLetterOrPunctuation) {
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
      this.transcriptionResult = this.transcriptionResult.trim();
    },

    transcribe() {
      if (this.isFromLocal) this.startRecognition();
      else {
        setTimeout(() => {
          this.transcribeSegment();
        }, 100);
      }
    },

    startRecognition() {
      if (!this.speechRecognitionSupported || this.isMobile) {
        this.openAlert(1, this.$t("repeater.tsc16"));
        return;
      }
      this.isRecordingTrans = true;
      this.transcriptionResult = "";
      this.recognition1.start();
    },

    stopRecognition() {
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
      this.recognition1.lang = this.langInOriginLine;
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
      this.transcriptionResult = "";
      try {
        let audioBlob = null;
        try {
          const wavBlob = await this.mp3ToWav(this.audioBlob);
          audioBlob = wavBlob;
        } catch (error) {
          console.error("处理音频时出错:", error);
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

    async extractAudioSegment(video) {
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

    // resample
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
      // send Blob data to server.
      const response = await fetch(
        `https://${this.sR}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${this.langInOriginLine}`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": this.sK,
            "Content-Type": "audio/wav; codec=audio/pcm; samplerate=16000",
            Accept: "application/json", // add header
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

    openAlert(a, x, c) {
      this.cleanUp();
      this.alertType = a;
      this.confirmType = c;
      this.alertVisible = true;
    },

    aliTranslate(type, onTest) {
      if (this.quotaUsed > 75000) {
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
      if (type == 2) {
        if (this.targetLanguage == "aa") {
          this.targetLanguage = this.langInTransLine.replace(/-[^-]*$/, "");
        }
        filteredArray = this.newWord;
      }
      let targetLang = this.langInTransLine.split("-")[0];
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
              var detectedLanguage = "zh";
              if (detectedLanguageElement) {
                detectedLanguage = detectedLanguageElement.textContent;
              } else if (type == 3) {
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
                this.autoSet();
              } else if (type == 2) {
                if (onTest == 1) {
                  this.openAlert(1, translatedElement.textContent);
                  return;
                }

                if (this.isWordReciter) {
                  this.addNewWord.word = this.newWord;
                  this.addNewWord.partOfSpeech = translatedElement.textContent;
                  this.addNewWord.number = 20002;
                  this.addNewWord.pronunciation = "";
                  this.addNewWord.phoneticSplit = "";
                  this.addNewWord.syllable = "";
                  this.addNewWord.roots = "";
                  this.addNewWord.collocation = "";
                  this.addNewWord.exampleSentence = "";
                  this.addNewWord.exampleTranslation = "";
                  this.addNewWord.level = "";
                  this.addNewWord.wordNote = "";
                  this.addNewWord.familiarity = 0;
                  this.addNewWord.date = "";
                  this.addNewWord.require =
                    Number(window.localStorage.getItem("require")) || 0;
                  this.addNewWord.temp1 = 0;
                  this.addNewWord.temp2 = 0;
                  this.addNewWord.temp3 = 0;
                }
              } else {
                this.translatedText = translatedElement.textContent;
              }
            } else {
              if (type == 2) {
                if (onTest == 1) {
                  this.openAlert(1, this.$t("repeater.alert007"));
                  return;
                }
              }
              return;
            }
          } catch (error) {
            if (type == 2) {
              if (onTest == 1) {
                this.openAlert(1, this.$t("repeater.alert004"));
                return;
              }
            }
            return;
          }
        })
        .catch(() => {
          if (type == 2) {
            if (onTest == 1) {
              this.openAlert(1, this.$t("repeater.alert005"));
              return;
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
          } else this.quotaUsed = totalSum;
        })
        .catch(() => {
          if (this.quotaUsed == -2) {
            this.quotaUsed = -1;
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
        this.addNewWord.word = this.newWord;
        this.addNewWord.partOfSpeech = this.translatedText;
        this.addNewWord.number = 20002;
        this.addNewWord.pronunciation = "";
        this.addNewWord.phoneticSplit = "";
        this.addNewWord.syllable = "";
        this.addNewWord.roots = "";
        this.addNewWord.collocation = "";
        this.addNewWord.exampleSentence = "";
        this.addNewWord.exampleTranslation = "";
        this.addNewWord.level = "";
        this.addNewWord.wordNote = "";
        this.addNewWord.familiarity = 0;
        this.addNewWord.date = "";
        this.addNewWord.require =
          Number(window.localStorage.getItem("require")) || 0;
        this.addNewWord.temp1 = 0;
        this.addNewWord.temp2 = 0;
        this.addNewWord.temp3 = 0;
      } catch (error) {
        this.translatedText = "";
        this.openAlert(1, this.$t("repeater.alert007"));
        this.inSubProcess = false;
      }
    },

    async getDictionary() {
      try {
        let url = this.urla.split("/api/")[0] + "/static/dictionary01.txt";
        const date = Date.now();
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
              wordNote: "-",
              familiarity: 0,
              date: date,
              require: 0,
              temp1: 0,
              temp2: 0,
              temp3: 0,
            };
          })
          .filter((item) => item !== null);
        this.dictionary = wordList;
      } catch (e) {
        console.error(e);
      }
    },

    async getNewWordList() {
      const date = Date.now();
      try {
        var content = await api.fetch(
          "/files/!PDJ/user-" + this.user.username + "/PDJ-wordlist.txt"
        );
        const lines = content.content.split(/\r?\n/);
        const wordList = lines
          .filter((line) => line.trim() !== "")
          .map((line, index) => {
            const parts = line.split("||");
            if (parts.length == 11) {
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
                wordNote: "-",
                familiarity: 0,
                date: date,
                require: 0,
                temp1: 0,
                temp2: 0,
                temp3: 0,
              };
            } else if (parts.length == 18) {
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
            } else {
              console.warn(`row ${index + 1} WrongFormat: ${line}`);
              return null;
            }
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
      this.subtitleLang = Number(option.split(".")[0]);
      this.showModal = false;
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

    recording() {
      this.showSpell = false;
      this.showCloze = false;
      this.cleanUp();
      if (this.isRecording) {
        this.stopRecording();
        if (!this.isFromLocal) this.transcribe();
        else this.stopRecognition();
      } else {
        this.transcriptionResult = "";
        this.startRecording();
        if (this.isFromLocal) this.transcribe();
      }
    },

    async startRecording() {
      this.cleanUp();
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
      if (this.audioUrl) {
        this.cleanUp();
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

    showTTSSetting() {
      this.openAlert(1, this.$t("repeater.TTSSetting"));
    },

    showTscSetting() {
      this.openAlert(1, this.$t("repeater.tsc05"));
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

    autoSet() {
      if (this.isAutoDetectLang) {
        this.langInTransLine = navigator.language || navigator.userLanguage;
      }
    },

    checkMobileScreen() {
      return window.matchMedia("(max-width: 1000px)").matches;
    },

    showTransPage() {
      let url = this.transUrl + this.newWord;
      window.open(url, "_blank");
    },

    getOriginLang() {
      this.originTargetLanguage = this.langInOriginLine.split("-")[0];
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

    saveToWordList() {
      if (this.addBatchWord) {
        this.wordList.push(...this.batchNewList);
        this.addBatchWord = false;
        this.prFilterLevel = "";
      } else this.saveToWordList1();
    },

    async saveToWordList1() {
      const date = Date.now();
      let newW = null;
      if (this.listWord && !this.addWord && !this.insertWord) {
        this.listWord.word = this.addNewWord.word;
        this.listWord.pronunciation = this.addNewWord.pronunciation;
        this.listWord.phoneticSplit = this.addNewWord.phoneticSplit;
        this.listWord.syllable = this.addNewWord.syllable;
        this.listWord.roots = this.addNewWord.roots;
        this.listWord.partOfSpeech = this.addNewWord.partOfSpeech;
        this.listWord.collocation = this.addNewWord.collocation;
        this.listWord.exampleSentence = this.addNewWord.exampleSentence;
        this.listWord.exampleTranslation = this.addNewWord.exampleTranslation;
        this.listWord.level = this.addNewWord.level;
        this.listWord.wordNote = this.addNewWord.wordNote;
        this.listWord.date = date;
        this.listWord.require = this.addNewWord.require;
        this.listWord.temp1 = 0;
        this.listWord.temp2 = 0;
        this.listWord.temp3 = 0;
        this.studyWordList = this.getStudyWordList(1);
      } else if (this.insertWord) {
        if (this.listWord && this.insertWord) {
          const index = this.wordList.findIndex(
            (item) => item === this.listWord
          );
          if (index !== -1) {
            this.wordList.splice(index, 1);
          }
        }
        newW = {
          number: this.addNewWord.number,
          word: this.addNewWord.word,
          pronunciation: this.addNewWord.pronunciation,
          phoneticSplit: this.addNewWord.phoneticSplit,
          syllable: this.addNewWord.syllable,
          roots: this.addNewWord.roots,
          partOfSpeech: this.addNewWord.partOfSpeech,
          collocation: this.addNewWord.collocation,
          exampleSentence: this.addNewWord.exampleSentence,
          exampleTranslation: this.addNewWord.exampleTranslation,
          level: this.addNewWord.level,
          wordNote: this.addNewWord.wordNote,
          familiarity: 0,
          date: date,
          require: this.addNewWord.require,
          temp1: 0,
          temp2: 0,
          temp3: 0,
        };

        const index = this.wordList.findIndex(
          (item) => item.word === this.studyWordList[this.wordIndex - 1].word
        );

        if (index !== -1) {
          this.wordList.splice(index + 1, 0, newW);
        }
        this.studyWordList = this.getStudyWordList(2, 1);
      } else {
        if (this.listWord && this.addWord) {
          const index = this.wordList.findIndex(
            (item) => item === this.listWord
          );
          if (index !== -1) {
            this.wordList.splice(index, 1);
          }
        }
        newW = {
          number: this.addNewWord.number,
          word: this.addNewWord.word,
          pronunciation: this.addNewWord.pronunciation,
          phoneticSplit: this.addNewWord.phoneticSplit,
          syllable: this.addNewWord.syllable,
          roots: this.addNewWord.roots,
          partOfSpeech: this.addNewWord.partOfSpeech,
          collocation: this.addNewWord.collocation,
          exampleSentence: this.addNewWord.exampleSentence,
          exampleTranslation: this.addNewWord.exampleTranslation,
          level: this.addNewWord.level,
          wordNote: this.addNewWord.wordNote,
          familiarity: 0,
          date: date,
          require: this.addNewWord.require,
          temp1: 0,
          temp2: 0,
          temp3: 0,
        };
        this.wordList.push(newW);
        this.studyWordList = this.getStudyWordList(1);
      }
      if (this.addWord) {
        this.addWord = false;
        this.initReciter = true;
        setTimeout(() => {
          this.newWord = "";
          this.switchShow();
          this.toAddWord();
        }, 300);
      } else if (this.insertWord) {
        this.insertWord = false;
      }
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
        // //下面以后删掉！！
        // const lines1 = this.wordList.map((item) => {
        //   const parts1 = [
        //     item.number || 20002,
        //     item.word != "" ? item.word : "-",
        //     item.pronunciation != "" ? item.pronunciation : "-",
        //     item.phoneticSplit != "" ? item.phoneticSplit : "-",
        //     item.syllable != "" ? item.syllable : "-",
        //     item.roots != "" ? item.roots : "-",
        //     item.partOfSpeech != "" ? item.partOfSpeech : "-",
        //     item.collocation != "" ? item.collocation : "-",
        //     item.exampleSentence != "" ? item.exampleSentence : "-",
        //     item.exampleTranslation != "" ? item.exampleTranslation : "-",
        //     item.level || "0",
        //   ];
        //   return parts1.join("||");
        // });

        // const textContent1 = lines1.join("\n");
        // await api.post(
        //   "/files/!PDJ/user-" + this.user.username + "/dictionary01.txt",
        //   textContent1,
        //   true
        // );
        // //上面以后删掉！！
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

    initUtter() {
      this.audio = new Audio();
      if (this.hasSpeechSynthesis) {
        this.utterThis = new SpeechSynthesisUtterance();
      }
    },

    switchShowList() {
      if (this.initReciter) return;
      this.cleanUp();
      this.showNewWordList = !this.showNewWordList;
      this.studyWordList[this.wordIndex - 1].temp3 = 0;
    },

    toDetail(index) {
      this.studyWordList[this.wordIndex - 1].temp3 = 0;
      this.studyWordList[index].temp3 = 0;
      this.wordIndex = index + 1;
      this.showNewWordList = !this.showNewWordList;
    },

    testTTSurl() {
      let text = this.readContent;
      if (this.TTSurl.includes("zure-tts:")) {
        this.azureTTS(text, 2);
      } else {
        let ttsFullUrl = this.TTSurl + text;
        this.audio.src = ttsFullUrl;
        this.audio.playbackRate = this.speedOfUtter;
        this.audio.play().catch(() => {
          this.openAlert(1, this.$t("repeater.alert008"));
        });
        if (this.readCount != 0) {
          this.timeOutId2 = setTimeout(() => {
            this.handleRead();
          }, 8000);
          this.audio.onended = () => {
            this.handleRead();
          };
        }
      }
    },

    testTTSurlO() {
      let text = this.readContent;
      if (this.TTSurlO.includes("zure-tts:")) {
        this.azureTTSO(text);
      } else {
        let ttsFullUrlO = this.TTSurlO + text;
        this.audio.src = ttsFullUrlO;
        this.audio.playbackRate = this.curSpeed();
        this.audio.play().catch(() => {
          this.openAlert(1, this.$t("repeater.alert008"));
        });
        if (this.readCount != 0) {
          this.timeOutId2 = setTimeout(() => {
            this.handleRead();
          }, 8000);
          this.audio.onended = () => {
            this.handleRead();
          };
        }
      }
    },
    handleRead() {
      if (this.timeOutId2) clearTimeout(this.timeOutId2);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.audio) this.audio.pause();
      if (this.currentAudio) this.currentAudio.pause();
      this.timeOutId2 = setTimeout(() => {
        if (this.readCount < this.selectList.length && this.readCount > 0)
          this.readCount++;
        else if (
          this.readCount == this.selectList.length &&
          this.isAutoNext &&
          this.wordIndex < this.studyWordList.length
        ) {
          this.wordIndex++;
          this.readCount = 0;
          const temp1 = this.autoRead;
          this.autoRead = false;
          setTimeout(() => {
            this.readCount = 1;
            this.autoRead = temp1;
          }, 10);
        } else {
          this.cleanUp();
          this.readCount = 0;
        }
      }, this.interval * 1000);
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
                  this.ttsWrong = true;
                  if (this.timeOutId4) clearTimeout(this.timeOutId4);
                  this.timeOutId4 = setTimeout(() => {
                    this.ttsWrong = false;
                  }, 1000);
                  return;
                } else {
                  console.log("too many requests to azure TTS!!!!");
                  return;
                }
              }
              localforage
                .setItem(this.ttsName, blob)
                .then(() => {})
                .catch(() => {});

              this.audio.src = URL.createObjectURL(blob);
              this.audio.playbackRate = this.speedOfUtter;
              this.audio.play();
              if (this.readCount != 0) {
                this.timeOutId2 = setTimeout(() => {
                  this.handleRead();
                }, 8000);
                this.audio.onended = () => {
                  this.handleRead();
                };
              }
            })
            .catch((error) => {
              if (type == 1) {
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

    azureTTSO(text) {
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
              if (this.readCount != 0) {
                this.timeOutId2 = setTimeout(() => {
                  this.handleRead();
                }, 8000);
                this.audio.onended = () => {
                  this.handleRead();
                };
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

    testTTSVoice() {
      if (this.readCount == 0) this.cleanUp();
      this.utterThis.text = this.readContent;
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

      if (this.readCount != 0) {
        this.timeOutId2 = setTimeout(() => {
          this.handleRead();
        }, 8000);
        this.utterThis.onend = () => {
          this.handleRead();
        };
      }
    },

    testTTSVoiceO() {
      if (this.readCount == 0) this.cleanUp();
      this.utterThis.text = this.readContent;
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
      if (this.readCount != 0) {
        this.timeOutId2 = setTimeout(() => {
          this.handleRead();
        }, 8000);
        this.utterThis.onend = () => {
          this.handleRead();
        };
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
    cleanUp() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (this.audio) this.audio.pause();
      if (this.currentAudio) this.currentAudio.pause();
      if (this.audioRecorded) this.audioRecorded.pause();
      if (this.onRecPlay) this.onRecPlay = false;
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.speechInterval) clearInterval(this.speechInterval);
      if (this.audioRecorded && this.audioRecorded.removeEventListener) {
        this.audioRecorded.removeEventListener("ended", this.endRecPlay, false);
      }
      if (this.audio && this.audio.removeEventListener) {
        this.audio.removeEventListener("ended", this.endUtter, false);
      }
      if (this.readCount != 0) {
        this.touches = 0;
        if (this.timeOutId2) clearTimeout(this.timeOutId2);
        this.readCount = 0;
        return;
      }
    },
    onSetting() {
      this.isSetting = !this.isSetting;
      this.cleanUp();
    },

    click() {
      this.touches++;
      this.cleanUp();
      if (!this.clickTimer) {
        this.clickTimer = setTimeout(() => {
          this.clickTimer = null;
        }, 300);
        this.touches = 0;
        this.readTestWord();
      } else {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;
        //double click
        this.cleanUp();
      }
    },

    dblClick(event) {
      event.preventDefault();
      this.cleanUp();
      this.touches = 0;
      return;
    },

    startDrag(event) {
      if (this.isTouchDevice) return;
      event.preventDefault();

      this.startTime = new Date().getTime();
      this.startX = event.clientX;
      this.startY = event.clientY;
    },
    endDrag(event) {
      if (this.isTouchDevice) return;
      event.preventDefault();
      let timeNow = new Date().getTime();
      if (timeNow - this.startTime < 1000) {
        if (this.isSetting) {
          this.isSetting = false;
          this.showTestSetting = false;
          this.click();
          return;
        }
      }
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.clientX - this.startX;
      this.distanceY = event.clientY - this.startY;
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 60
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }
      if (timeNow - this.startTime < 1000)
        window.getSelection().removeAllRanges();
      if (Math.abs(this.distanceX) < 5 && Math.abs(this.distanceY) < 5) {
        this.click();
      }
    },

    startTouch(event) {
      event.preventDefault();
      this.startTime = new Date().getTime();
      this.startX = event.touches[0].clientX;
      this.startY = event.touches[0].clientY;
    },

    endTouch(event) {
      event.preventDefault();
      let timeNow = new Date().getTime();
      if (timeNow - this.startTime < 1000) {
        if (this.isSetting) {
          this.isSetting = false;
          this.showTestSetting = false;
          return;
        }
      }
      this.timeDiff = new Date().getTime() - this.startTime;
      this.distanceX = event.changedTouches[0].clientX - this.startX;
      this.distanceY = event.changedTouches[0].clientY - this.startY;
      if (
        this.timeDiff < 300 &&
        Math.abs(this.distanceX) > Math.abs(this.distanceY) &&
        Math.abs(this.distanceX) > 30
      ) {
        this.checkNav(this.distanceX, "SWITCHIMG");
        return;
      }

      if (timeNow - this.startTime < 1000)
        window.getSelection().removeAllRanges();
      if (Math.abs(this.distanceX) < 5 && Math.abs(this.distanceY) < 5)
        this.click();
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
      if (x > 0 && mode == "SWITCHIMG") {
        this.toLastWord();
      } else if (x < 0 && mode == "SWITCHIMG") {
        this.toNextWord();
      }
    },

    curSpeed() {
      var cSpeed = this.currentSpeed.replaceAll(",", " ");
      var nowSpeed;
      cSpeed = cSpeed.replaceAll("   ", " ");
      cSpeed = cSpeed.replaceAll("  ", " ");
      if (cSpeed.split(" ")[0]) {
        if (this.onTempSpeed) {
          this.normalSpeed = Number(cSpeed.split(" ")[0]);
          nowSpeed = this.tempSpeed;
        } else {
          nowSpeed = Number(cSpeed.split(" ")[0]);
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

    blurActiveInput() {
      const activeEl = document.activeElement;
      // 判断激活的元素是输入框，且属于当前组件的输入框
      if (activeEl.tagName === "INPUT") {
        activeEl.blur();
      }
    },

    key(event) {
      if (this.isSetting) return;
      if (event.which === 39 || event.key === "Enter" || event.keyCode === 13) {
        if (this.editWord) return;
        if (
          (event.key === "Enter" || event.keyCode === 13) &&
          (this.showDic || this.showRead || this.showSpell || this.showCloze)
        ) {
          if (this.showSpell && !this.isCorrect) event.preventDefault();
          if (
            ((this.showDic || this.showRead) &&
              (!this.realCheck || !this.isRight)) ||
            (this.showSpell && !this.isCorrect) ||
            (this.showCloze && !this.isClozeRight)
          ) {
            this.readTestWord();
            return;
          }
        } else if (
          (event.key === "Enter" || event.keyCode === 13) &&
          this.isTesting &&
          !this.showSelectT &&
          !this.isAnswered
        ) {
          this.checkAnswser();
          return;
        } else if (this.isTesting && !this.isAnswered) {
          return;
        }
        this.blurActiveInput();
        setTimeout(() => {
          this.activeInput = true;
          this.toNextWord();
        }, 100);
      } else if (event.which === 37) {
        if (this.editWord) return;
        if (this.isTesting && !this.isAnswered) {
          return;
        }
        if (this.editWord) {
          this.blurActiveInput();
          setTimeout(() => {
            this.toLastWord();
          }, 100);
        } else this.toLastWord();
      } else if (event.which === 40) {
        this.readTestWord();
      } else if (event.which === 38) {
        this.onTransO = !this.onTransO;
        this.onTransT = !this.onTransT;
      }
    },

    handleResize() {
      this.mobileScreen = this.checkMobileScreen();
      this.resized = true;
    },
    close() {
      this.cleanUp();
      if (this.addBatchWord) {
        this.addBatchWord = false;
        this.prFilterLevel = "";
        return;
      }
      if (this.prOutput) {
        this.prOutput = false;
        return;
      }
      if (this.isSetting) {
        this.onSetting();
        return;
      }
      if (this.insertWord) {
        this.insertWord = false;
        return;
      }
      if (this.editWord) {
        this.editWord = false;
        return;
      }
      if (this.isInstruction) {
        this.isInstruction = false;
        return;
      }
      if (this.showFav) {
        this.showFav = false;
        return;
      }
      if (this.isStudying) {
        this.isStudying = false;
        this.initReciter = true;
        this.switchShow();
        return;
      }
      if (this.isTesting) {
        this.isTesting = false;
        this.initReciter = true;
        this.switchShow();
        return;
      }
      if (this.addWord) {
        this.addWord = false;
        this.initReciter = true;
        this.switchShow();
        return;
      }
      auth.logout();
    },
  },
};
</script>

<style scoped>
.radio-item {
  font-weight: 300;
  color: beige;
  margin-bottom: 8px;
}
#prWordExcelGenerator {
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 4.2em);
  top: 4.2em;
  position: absolute;
  width: 100%;
}
.addNew {
  background: rgba(52, 152, 219, 0.2);
  color: yellow;
}

.prContainer {
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.prHeader {
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  color: white;
  padding: 0;
  text-align: center;
}

.layout2-container {
  display: flex;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  align-items: center;
  padding: 10px 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.prWordItem:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.prWordItem input[type="checkbox"] {
  margin-right: 12px;
  transform: scale(1.2);
}

.prWordText {
  font-weight: 600;
  color: #2c3e50;
}

.prPartOfSpeech {
  margin-left: 10px;
  font-style: italic;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.prSelectAll {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #e8f4fc;
  border-radius: 6px;
}

.prSelectAll1 {
  display: flex;
  flex-direction: column;
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
  font-weight: 600;
  color: #2c3e50;
}

input[type="number"],
input[type="text"] {
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
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
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  border-left: 1px dashed #000;
  border-right: 1px dashed #000;
  padding: 3px;
  text-align: center;
  height: 30px;
}
.prPreviewTable td:nth-child(9) {
  border-left: 1px solid #000;
}

.prPreviewTable td:first-child {
  border-left: 1px solid #000;
}

.prPreviewTable td:last-child {
  border-right: 1px solid #000;
}

.prCheckboxCell {
  justify-content: space-around;
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
  #prWordExcelGenerator {
    padding: 10px;
  }

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

/* 样式部分保持不变 */
.clz-vocabulary-test {
  display: flex;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1);
  align-items: center;
  height: 99%;
  padding: 0;
  overflow-y: auto;
}

.clz-test-container {
  width: 100vh;
  background-color: white;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.clz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 6px;
}

/* 开关样式 */
.clz-switch {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.clz-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.clz-slider {
  width: 30px;
  height: 14px;
  background-color: #ccc;
  border-radius: 14px;
  transition: 0.4s;
  position: relative;
}

.clz-slider:before {
  position: absolute;
  content: "";
  height: 10px;
  width: 10px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .clz-slider {
  background-color: #42b983;
}

input:checked + .clz-slider:before {
  transform: translateX(16px);
}

.clz-switch-text {
  font-size: 11px;
  color: #666;
}

.clz-word-display {
  background-color: #f0f5ff;
  padding: 5px;
  border-radius: 4px;
  margin-bottom: 10px;
  text-align: center;
}

.clz-word-display h3 {
  font-size: 1.5em;
  color: blue;
  margin: 8px 0;
}

.clz-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.clz-option {
  padding: 18px 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clz-correct {
  background-color: springgreen;
  border-color: #a5d6a7;
  color: blue;
  font-weight: bold;
}

.clz-incorrect {
  background-color: tomato;
  border-color: #ef9a9a;
  color: blue;
}

.clz-disabled {
  cursor: not-allowed;
}

/* 原文显示样式 */
.clz-original-meaning,
.clz-original-word {
  color: blue;
  font-style: italic;
  margin-left: 6px;
  padding-left: 6px;
  border-left: 1px dashed #ddd;
}

.clz-next-btn {
  width: 100%;
  padding: 6px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clz-next-btn:hover {
  background-color: #359e75;
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .clz-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .clz-option {
    font-size: 1em;
    padding: 7px 8px;
  }
}
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.allow-select {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
.cl1 {
  width: 6em;
  text-align: left;
}
.cl2 {
  display: flex;
  margin: 0 1em;
  align-items: center;
}
.cloze-section {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  min-height: 85px;
  align-items: center;
  border-radius: 0 0 8px 0;
}
.spelled-letter {
  width: 35px;
  height: 35px;
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
  cursor: pointer;
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
  cursor: pointer;
}
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
  margin-bottom: 28px;
}
.letter-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
  color: white;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

.settingBoxContainer {
  display: flex;
  position: fixed;
  width: 65%;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 0.2em;
  justify-content: center;
  align-items: center;
  z-index: 1010;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.settingBox {
  position: relative;
  color: white;
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
  .layout2-container {
    flex-direction: column;
  }

  .layout2-table {
    width: 100%;
    margin-bottom: 10px;
  }

  header {
    display: flex;
    justify-content: space-around !important;
  }

  span.subject {
    width: 13em;
  }

  .subTools {
    width: 95%;
  }

  .settingBoxContainer {
    width: 100%;
  }

  input.input.input--repeater {
    width: 7em;
    margin: 0.3em 0;
    border-radius: 3px;
  }
}
/* 通用卡片样式 */
.word-card {
  background: white;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.1);
  height: 99%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto;
  overflow-y: auto;
}

.word-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(37, 99, 235, 0.1),
    0 10px 10px -5px rgba(37, 99, 235, 0.04);
}

/* 单词标题 */
.word-title {
  text-align: center;
}

.word-title h2 {
  font-weight: bold;
  color: #2563eb;
  letter-spacing: 0.05em;
  margin: 0;
}
/* 音标部分 */
.phonetics-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  color: #374151;
}

.phonetic-item {
  background: white;
  padding: 0;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 音节拆分部分 */
.syllables-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 500;
}

.syllable-item {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  transition: all 0.3s ease;
}

.syllable-separator {
  margin: 0 0.5rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
}

/* 字母行 */
.letters-content {
  display: flex;
  justify-content: center;
  font-size: 1.2em;
  font-weight: 600;
  gap: 0.25rem;
}

.letter-item {
  display: inline-block;
  text-align: center;
  padding: 0.375rem 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  min-width: 1.75rem;
  font-size: 1.6em;
}

.letter-item:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

/* 发音行 */
.phonemes-content {
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
  color: #4f46e5;
  gap: 0.25rem;
}

.phoneme-item {
  display: inline-block;
  text-align: center;
  padding: 0.375rem 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  min-width: 1.75rem;
}

.phoneme-item:hover {
  background-color: rgba(37, 99, 235, 0.1);
}

/* 朗读按钮 */
.read-all-container {
  text-align: center;
  margin-top: 2rem;
}

.read-all-btn {
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-all-btn:hover {
  background-color: rgba(37, 99, 235, 0.9);
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.read-all-btn i {
  margin-right: 0.5rem;
}

/* 页脚 */

/* 高亮样式 */
.highlighted {
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  transform: scale(1.1);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .syllable-item {
    padding: 0.25rem 1rem;
  }

  .letter-item,
  .phoneme-item {
    padding: 0.375rem 0.75rem;
    min-width: 2.5rem;
    font-size: 1.6em;
  }

  .phonetics-content,
  .syllables-content {
    font-size: 1.25rem;
    margin: 0 0 5px 0;
  }

  .letters-content,
  .phonemes-content {
    font-size: 1.2em;
    margin: 8px 0 8px 0;
  }
}
.dynamic-select-container {
  width: 99%;
  margin: 5px auto;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  min-height: 18em;
}

.title {
  margin: 0 0 20px;
  color: #333;
  font-size: 22px;
  text-align: center;
  font-weight: 600;
}

/* 选择框列表 */
.select-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.select-item {
  position: relative;
  transition: all 0.3s ease-out;
  opacity: 1;
  transform: translateY(0);
}

/* 选择框样式 */
.select-field {
  width: calc(100% - 28px);
  padding: 12px 40px 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  background-color: #fff;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.select-field:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

/* 移除按钮 */
.remove-btn {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 50%;
  color: #999;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.remove-btn:hover {
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.1);
}

/* 添加按钮 */
.add-btn {
  width: 100%;
  padding: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-btn:hover {
  background-color: #3367d6;
}

.add-btn:active {
  transform: scale(0.98);
}

.add-icon {
  font-weight: bold;
  font-size: 18px;
}

/* 动画效果 */
.fade-out {
  opacity: 0;
  transform: translateY(10px);
}

/* 新添加元素的入场动画 */
.select-list .select-item:last-child:not(.fade-out) {
  animation: fadeIn 0.3s ease-out;
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

.layout2-table {
  width: 48%;
}
</style>
