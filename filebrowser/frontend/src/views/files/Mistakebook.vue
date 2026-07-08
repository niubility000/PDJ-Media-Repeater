<template>
  <div>
    <div
      v-if="msg.length !== 0"
      style="
        position: fixed;
        z-index: 5889;
        top: 1.5em;
        left: 50%;
        transform: translateX(-50%);
        color: blue;
      "
    >
      {{ msg }}
    </div>

    <div
      v-if="showItem"
      class="test-view"
      :style="{
        height: isMobile ? 'calc(100vh - 7.8em)' : 'calc(100vh - 5.2em)',
        width: isMobile ? '100%' : '80%',
      }"
      style="
        position: fixed;
        z-index: 1889;
        background-color: #d4edda;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0.5em;
      "
    >
      <div class="test-content" style="flex-grow: 1; overflow-y: auto">
        <!-- 当前题目显示 -->
        <div class="current-question">
          <div
            class="question-header"
            style="display: flex; justify-content: space-between"
          >
            <span style="margin: 0">
              题号：{{ showItem?.id }}: {{ showItem?.user }}-{{
                showItem?.subject
              }}-{{ showItem?.subClass }}-{{ showItem?.questionType }}
            </span>
            <div style="display: flex; align-items: center">
              <button
                style="background: transparent; color: black"
                v-if="
                  !String(showItem.reviewDate).split(',')[1] ||
                  Number(String(showItem.reviewDate).split(',')[1]) == 0
                "
                class="read-btn"
                @click="switchFav(showItem)"
              >
                <i class="material-icons">star_border</i>
              </button>
              <button
                style="background: transparent; color: black"
                v-else
                class="read-btn"
                @click="switchFav(showItem)"
              >
                <i class="material-icons" style="color: blue">star</i>
              </button>
              <div>
                <div class="error-importance">
                  <!-- 掌握程度（9级） -->
                  <div>
                    <label>掌握程度：</label>
                    <span>{{ showItem?.importantLevel }}级</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="showItem.errorType" class="answer-section">
            <strong>标签：</strong>
            <span>{{ showItem.errorType }}</span>
          </div>

          <!-- 题目显示 -->
          <div
            class="original-question"
            @dblclick="openQuestionEditor(showItem, 54)"
          >
            <strong> 题目 </strong>
            <div
              v-html="
                !(
                  showItem.question.replace(/<[^>]*>/g, '').trim().length ==
                    0 && !/(img|video|audio)/i.test(showItem.question || '')
                )
                  ? ex(showItem.question)
                  : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
              "
              @click="handleLinkClick"
              style="
                min-height: 158px;
                padding: 0 8px;
                margin: 0.25em 0;
                border: 1px solid lightblue;
              "
              :style="{
                background: !(
                  showItem.question.replace(/<[^>]*>/g, '').trim().length ==
                    0 && !/(img|video|audio)/i.test(showItem.question || '')
                )
                  ? 'white'
                  : '#d4edda',
              }"
            ></div>
          </div>

          <!-- 答案显示区域 -->
          <div
            @dblclick="openQuestionEditor(showItem, 52)"
            class="answer-section"
            style="background: beige"
          >
            <strong style="color: blue">答案：</strong>
            <div
              v-html="
                !(
                  showItem.answer.replace(/<[^>]*>/g, '').trim().length == 0 &&
                  !/(img|video|audio)/i.test(showItem.answer || '')
                )
                  ? ex(showItem.answer)
                  : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
              "
              @click="handleLinkClick"
              style="
                min-height: 55px;
                padding: 0 8px;
                margin: 0.25em 0;
                border: 1px solid lightblue;
              "
              :style="{
                background: !(
                  showItem.answer.replace(/<[^>]*>/g, '').trim().length == 0 &&
                  !/(img|video|audio)/i.test(showItem.answer || '')
                )
                  ? 'white'
                  : '#d4edda',
              }"
            ></div>
          </div>

          <!-- 可编辑解析 -->
          <div
            style="margin-top: 1em"
            @dblclick="openQuestionEditor(showItem, 53)"
          >
            <strong style="color: blue">解析：</strong>
            <div>
              <div
                v-html="
                  !(
                    showItem.correctIdea.replace(/<[^>]*>/g, '').trim()
                      .length == 0 &&
                    !/(img|video|audio)/i.test(showItem.correctIdea || '')
                  )
                    ? ex(showItem.correctIdea)
                    : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                "
                @click="handleLinkClick"
                style="
                  min-height: 55px;
                  padding: 0 8px;
                  margin: 0.25em 0;
                  border: 1px solid lightblue;
                "
                :style="{
                  background: !(
                    showItem.correctIdea.replace(/<[^>]*>/g, '').trim()
                      .length == 0 &&
                    !/(img|video|audio)/i.test(showItem.correctIdea || '')
                  )
                    ? 'white'
                    : '#d4edda',
                }"
              ></div>
            </div>
          </div>

          <!-- 可编辑原始错题 -->
          <div
            style="margin-top: 1em"
            @dblclick="openQuestionEditor(showItem, 55)"
          >
            <strong style="color: blue">原始错题：</strong>
            <div>
              <div
                v-html="
                  !(
                    showItem.originalText.replace(/<[^>]*>/g, '').trim()
                      .length == 0 &&
                    !/(img|video|audio)/i.test(showItem.originalText || '')
                  )
                    ? ex(showItem.originalText)
                    : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                "
                @click="handleLinkClick"
                style="
                  min-height: 55px;
                  padding: 0 8px;
                  margin: 0.25em 0;
                  border: 1px solid lightblue;
                "
                :style="{
                  background: !(
                    showItem.originalText.replace(/<[^>]*>/g, '').trim()
                      .length == 0 &&
                    !/(img|video|audio)/i.test(showItem.originalText || '')
                  )
                    ? 'white'
                    : '#d4edda',
                }"
              ></div>
            </div>
          </div>

          <div style="margin: 16px 0">
            <strong style="color: green">题型总结：</strong>
            <div
              class="v-html-content"
              v-html="
                ex(
                  finalQuestionTypeSummary.find(
                    (i) =>
                      i.subject === showItem.subject?.trim() &&
                      i.subClass === showItem.subClass?.trim() &&
                      i.questionType === showItem.questionType?.trim()
                  )?.questionTypeSummary || '无'
                )
              "
              @click="handleLinkClick"
            ></div>
            <div class="small-imgs-wrap">
              <img
                v-for="(url, idx) in mistaker.find(
                  (i) =>
                    i.subject === showItem.subject?.trim() &&
                    i.subClass === showItem.subClass?.trim() &&
                    i.questionType === showItem.questionType?.trim()
                )?.questionTypeImgUrls || []"
                :key="idx"
                :src="url"
                alt="原题"
                class="small-img"
                @click="openImageViewer(url)"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 导航按钮 -->
      <div class="test-navigation">
        <div>
          <button @click="deleteError(showItem.id)" class="check-answer-btn">
            删除
          </button>
        </div>
        <div style="display: flex; gap: 2px">
          <button @click="showItem = null" class="check-answer-btn">
            关闭
          </button>
        </div>
      </div>
    </div>

    <div v-if="editHaveNow !== 0" class="pinyin-converter">
      <div class="converter-header">
        <h2>{{ msg0 }}</h2>
      </div>
      <p>
        {{ msg1 }}
        <input v-model="oldV" type="text" />
      </p>
      <p>
        替换为：
        <input v-model="newV" type="text" />
      </p>
      <p>
        *
        备选项将按正序排列。可在常用的备选项名称前面加数字，使它排在前面，方便选择。
      </p>
      <!-- 操作按钮 -->
      <div class="btn-section" style="justify-content: right">
        <button @click="editHaveDo(editHaveNow)" class="convert-btn">
          确定
        </button>
        <button @click="editHaveNow = 0" class="clear-btn">取消</button>
      </div>

      <!-- 复制成功提示 -->
      <div class="copy-toast" v-if="showToast">复制成功！</div>
    </div>

    <header-bar
      v-if="dtCurrentPage !== 'mindmap'"
      style="padding: 0.5em; height: 4em; overflow-y: hidden; overflow-x: auto"
    >
      <button
        class="action"
        @click="logout"
        :title="$t('reminder.logout')"
        style="background-color: white"
      >
        <i
          style="padding-left: 0"
          :style="{ color: currentView != 'home' ? 'red' : 'blue' }"
          class="material-icons"
          >close</i
        >
      </button>

      <span style="flex-grow: 1; white-space: nowrap; padding: 0; height: 16px">
        PDJ错题本(共{{ mistaker.length }}题)
      </span>
      <span style="display: flex; gap: 6px">
        <button v-if="currentView == 'add'" @click="cancelNow">取消</button>
        <button v-if="currentView == 'add'" @click="saveNow">
          {{
            showQuestionTypeSummaryModal
              ? "保存题型总结"
              : isEditing
              ? "更新题目"
              : batchAdd
              ? "批量保存"
              : "保存题目"
          }}
        </button>
      </span>
      <button
        class="action"
        v-if="currentView == 'list' || currentView == 'questionTypeSummary'"
        @click="switchView('add')"
      >
        <i style="color: blue; font-size: 2em" class="material-icons"
          >add_circle</i
        >
      </button>
      <button
        v-if="!allowSync"
        class="action"
        @click="readFromServer(1)"
        title="从服务器同步错题本内容"
        style="background-color: white"
      >
        <i style="color: blue" class="material-icons">cloud_download</i>
      </button>

      <button
        v-if="!allowSync"
        class="action"
        @click="saveToServer(1)"
        title="错题本内容同步到服务器"
        style="background-color: white"
      >
        <i style="color: blue" class="material-icons">cloud_upload</i>
      </button>
      <button v-if="showTool" class="action" style="background-color: white">
        <i
          style="color: blue"
          class="material-icons"
          @click="showPinYinTool = true"
          >table_bar</i
        >
      </button>
      <button
        class="action"
        style="background-color: white"
        @click="showSetting"
        :title="$t('repeater.settings')"
      >
        <i style="color: blue" class="material-icons">settings</i>
      </button>
    </header-bar>
    <div class="main-content">
      <!-- 首页视图 -->
      <div v-if="currentView === 'home'" style="margin-top: 16vh">
        <div class="home-view">
          <button class="home-btn" @click="switchView('add')">添加题目</button>
        </div>

        <div class="home-view">
          <button class="home-btn" @click="startTest">题卡测验</button>
          <button class="home-btn" @click="switchView('list')">错题列表</button>
          <button class="home-btn" @click="switchView('cardList')">
            题卡列表
          </button>
        </div>
        <div class="home-view">
          <button class="home-btn" @click="switchView('task')">任务列表</button>
          <button class="home-btn" @click="switchView('questionTypeSummary')">
            题型总结
          </button>
          <!--
          <button class="home-btn" @click="switchView('printPaper')">
            举一反三
          </button>
          -->
          <button class="home-btn" @click="switchView('subjectSummary')">
            综合汇总
          </button>
          <!--
          <button class="home-btn" @click="switchView('trapSummary')">
            备用列表
          </button>
          -->
        </div>
        <div class="home-view">
          <!-- 添加CheatSheet按钮 -->
          <button class="home-btn" @click="switchView('cheatSheet')">
            CheatSheet
          </button>
          <button class="home-btn" @click="switchView('mindMaps')">
            思维导图
          </button>
        </div>
      </div>
      <div
        v-if="processing"
        style="
          position: fixed;
          z-index: 2900;
          top: 4.2em;
          left: 50%;
          transform: translateX(-50%);
        "
      >
        <span style="background-color: green; color: white; font-size: 1.8em">
          正在传输中......
        </span>
      </div>
      <div
        v-if="currentView === 'test'"
        class="test-view"
        :style="{
          height: isMobile ? 'calc(100vh - 5.8em)' : 'calc(100vh - 4.2em)',
        }"
      >
        <div class="test-header">
          <div style="display: flex; align-items: center; gap: 12px">
            <h3>
              题卡测验：{{ testFilterForm.user }}
              {{ testFilterForm.subject }}
            </h3>
            <span class="filter-header" @click="toggleTestFilter">
              <span class="filter-arrow" :class="{ up: showTestFilterPanel }"
                >↓</span
              >
            </span>
          </div>
          <div class="test-controls">
            <div class="test-progress">
              组{{ testRound }}: {{ currentTestIndex + 1 }}/{{
                filteredTestMistaker.length
              }}
              ({{ testLength }})
              <span v-if="isReview" style="color: red; margin-left: 8px"
                >(本轮错题复习)</span
              >
            </div>
          </div>
        </div>

        <!-- 新增测试筛选面板 -->
        <div class="test-filter-panel" v-if="showTestFilterPanel">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                用户：
                <input
                  v-model="testFilterForm.user"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="筛选用户"
                />
                <!-- 用户候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueUsers?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueUsers"
                    :key="`user-${item}`"
                    @click="append2('user', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <div class="filter-item">
                科目：
                <input
                  v-model="testFilterForm.subject"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="筛选科目"
                />
                <!-- 科目候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueSubjects?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubjects"
                    :key="`subject-${item}`"
                    @click="append2('subject', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="filter-item">
                包含关键字：
                <input
                  v-model="testFilterForm.keyword"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="多个关键字用空格分开，搜索考点、题型、题目、答案、解析等"
                />
                <!-- 题型候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueQuestionType?.length">
                  <span class="candidate-label">如：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueQuestionType"
                    :key="`questionType-${item}`"
                    @click="append2('keyword', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <div class="filter-row">
              <div>
                <input v-model="reverseList" type="checkbox" />
                题号倒序排列
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.excludeTodayTested"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                排除今日已测试题卡
              </div>

              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.fav"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                仅包含收藏的题卡
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.specialIL"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                仅包含掌握程度为
                <input
                  v-model.lazy="testFilterForm.importantLevel"
                  @change="applyTestFilter"
                  type="number"
                  min="0"
                  style="width: 3em"
                />
                级的题卡
              </div>

              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.lastWrong"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                仅包含测试中曾错过的题卡
              </div>

              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.lessThan1"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                仅包含测试次数少于
                <input
                  v-model.lazy="testTimes"
                  @change="applyTestFilter"
                  type="number"
                  min="1"
                  style="width: 3em"
                />
                次的题卡
              </div>

              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.excludeFiveCorrect"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                排除最后连续
                <input
                  v-model.lazy="correctDays"
                  @change="applyTestFilter"
                  type="number"
                  min="1"
                  style="width: 3em"
                />
                次测试正确的题卡
              </div>
              <div class="filter-checkbox">
                排除关键字
                <input
                  v-model="excludedKeyWord"
                  type="text"
                  style="width: 10em"
                />
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.allowInterval"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                测试间隔天数:
                <input
                  v-model.lazy="testInterval"
                  @change="applyTestFilter"
                  placeholder="各次测试间隔天数，以空格来分隔。"
                  type="text"
                />
              </div>
            </div>
            <div
              class="filter-actions"
              style="display: flex; justify-content: right"
            >
              <button @click="resetTestFilter" class="reset-btn">重置</button>
            </div>
          </div>
        </div>

        <div
          class="test-content"
          v-if="filteredTestMistaker.length !== 0"
          style="flex-grow: 1; overflow-y: auto"
        >
          <!-- 当前题目显示 -->
          <div class="current-question">
            <div
              class="question-header"
              style="display: flex; justify-content: space-between"
            >
              <span style="margin: 0">
                {{ addToday }}
              </span>
              <div style="display: flex; align-items: center">
                <button
                  style="background: transparent; color: black"
                  v-if="
                    !String(
                      filteredTestMistaker[currentTestIndex].reviewDate
                    ).split(',')[1] ||
                    Number(
                      String(
                        filteredTestMistaker[currentTestIndex].reviewDate
                      ).split(',')[1]
                    ) == 0
                  "
                  class="read-btn"
                  @click="switchFav(filteredTestMistaker[currentTestIndex])"
                >
                  <i class="material-icons">star_border</i>
                </button>
                <button
                  style="background: transparent; color: black"
                  v-else
                  class="read-btn"
                  @click="switchFav(filteredTestMistaker[currentTestIndex])"
                >
                  <i class="material-icons" style="color: blue">star</i>
                </button>
                <div>
                  <div class="error-importance">
                    <!-- 掌握程度（9级） -->
                    <div>
                      <label>掌握程度：</label>
                      <span
                        >{{
                          filteredTestMistaker[currentTestIndex]
                            ?.importantLevel
                        }}级</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 标签 -->
            <div
              v-if="filteredTestMistaker[currentTestIndex].errorType"
              class="answer-section"
            >
              <strong>标签：</strong>
              <span>{{
                filteredTestMistaker[currentTestIndex].errorType
              }}</span>
            </div>

            <!-- 题目显示 -->
            <div
              class="original-question"
              @dblclick="openQuestionEditor(currentTestIndex, 4)"
            >
              <strong>
                题目{{ currentTestIndex + 1 }} ( 题号：{{
                  filteredTestMistaker[currentTestIndex]?.id
                }}) {{ filteredTestMistaker[currentTestIndex]?.user }}-{{
                  filteredTestMistaker[currentTestIndex]?.subject
                }}-{{ filteredTestMistaker[currentTestIndex]?.subClass }}-{{
                  filteredTestMistaker[currentTestIndex]?.questionType
                }}:
              </strong>
              <div
                v-html="
                  !(
                    filteredTestMistaker[currentTestIndex].question
                      .replace(/<[^>]*>/g, '')
                      .trim().length == 0 &&
                    !/(img|video|audio)/i.test(
                      filteredTestMistaker[currentTestIndex].question || ''
                    )
                  )
                    ? ex(filteredTestMistaker[currentTestIndex].question)
                    : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                "
                @click="handleLinkClick"
                style="
                  min-height: 158px;
                  padding: 0 8px;
                  margin: 0.25em 0;
                  border: 1px solid lightblue;
                "
                :style="{
                  background: !(
                    filteredTestMistaker[currentTestIndex].question
                      .replace(/<[^>]*>/g, '')
                      .trim().length == 0 &&
                    !/(img|video|audio)/i.test(
                      filteredTestMistaker[currentTestIndex].question || ''
                    )
                  )
                    ? 'white'
                    : '#d4edda',
                }"
              ></div>
            </div>

            <!-- 答案显示区域 -->
            <div
              v-if="showAnswer"
              @dblclick="openQuestionEditor(currentTestIndex, 2)"
              class="answer-section"
              style="background: beige"
            >
              <strong style="color: blue">答案：</strong>
              <div
                v-html="
                  !(
                    filteredTestMistaker[currentTestIndex].answer
                      .replace(/<[^>]*>/g, '')
                      .trim().length == 0 &&
                    !/(img|video|audio)/i.test(
                      filteredTestMistaker[currentTestIndex].answer || ''
                    )
                  )
                    ? ex(filteredTestMistaker[currentTestIndex].answer)
                    : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                "
                @click="handleLinkClick"
                style="
                  min-height: 55px;
                  padding: 0 8px;
                  margin: 0.25em 0;
                  border: 1px solid lightblue;
                "
                :style="{
                  background: !(
                    filteredTestMistaker[currentTestIndex].answer
                      .replace(/<[^>]*>/g, '')
                      .trim().length == 0 &&
                    !/(img|video|audio)/i.test(
                      filteredTestMistaker[currentTestIndex].answer || ''
                    )
                  )
                    ? 'white'
                    : '#d4edda',
                }"
              ></div>
            </div>

            <!-- 可编辑解析 -->
            <div
              style="margin-top: 1em"
              v-if="showAnswer"
              @dblclick="openQuestionEditor(currentTestIndex, 3)"
            >
              <strong style="color: blue">解析：</strong>
              <div>
                <div
                  v-html="
                    !(
                      filteredTestMistaker[currentTestIndex].correctIdea
                        .replace(/<[^>]*>/g, '')
                        .trim().length == 0 &&
                      !/(img|video|audio)/i.test(
                        filteredTestMistaker[currentTestIndex].correctIdea || ''
                      )
                    )
                      ? ex(filteredTestMistaker[currentTestIndex].correctIdea)
                      : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                  "
                  @click="handleLinkClick"
                  style="
                    min-height: 55px;
                    padding: 0 8px;
                    margin: 0.25em 0;
                    border: 1px solid lightblue;
                  "
                  :style="{
                    background: !(
                      filteredTestMistaker[currentTestIndex].correctIdea
                        .replace(/<[^>]*>/g, '')
                        .trim().length == 0 &&
                      !/(img|video|audio)/i.test(
                        filteredTestMistaker[currentTestIndex].correctIdea || ''
                      )
                    )
                      ? 'white'
                      : '#d4edda',
                  }"
                ></div>
              </div>
            </div>

            <!-- 可编辑原始错题 -->
            <div
              style="margin-top: 1em"
              v-if="showAnswer"
              @dblclick="openQuestionEditor(currentTestIndex, 5)"
            >
              <strong style="color: blue">原始错题：</strong>
              <div>
                <div
                  v-html="
                    !(
                      filteredTestMistaker[currentTestIndex].originalText
                        .replace(/<[^>]*>/g, '')
                        .trim().length == 0 &&
                      !/(img|video|audio)/i.test(
                        filteredTestMistaker[currentTestIndex].originalText ||
                          ''
                      )
                    )
                      ? ex(filteredTestMistaker[currentTestIndex].originalText)
                      : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                  "
                  @click="handleLinkClick"
                  style="
                    min-height: 55px;
                    padding: 0 8px;
                    margin: 0.25em 0;
                    border: 1px solid lightblue;
                  "
                  :style="{
                    background: !(
                      filteredTestMistaker[currentTestIndex].originalText
                        .replace(/<[^>]*>/g, '')
                        .trim().length == 0 &&
                      !/(img|video|audio)/i.test(
                        filteredTestMistaker[currentTestIndex].originalText ||
                          ''
                      )
                    )
                      ? 'white'
                      : '#d4edda',
                  }"
                ></div>
              </div>
            </div>

            <div v-if="showAnswer" style="margin: 16px 0">
              <strong style="color: green">题型总结：</strong>
              <div
                class="v-html-content"
                v-html="
                  ex(
                    finalQuestionTypeSummary.find(
                      (i) =>
                        i.subject ===
                          filteredTestMistaker[
                            currentTestIndex
                          ].subject?.trim() &&
                        i.subClass ===
                          filteredTestMistaker[
                            currentTestIndex
                          ].subClass?.trim() &&
                        i.questionType ===
                          filteredTestMistaker[
                            currentTestIndex
                          ].questionType?.trim()
                    )?.questionTypeSummary || '无'
                  )
                "
                @click="handleLinkClick"
              ></div>
              <div class="small-imgs-wrap">
                <img
                  v-for="(url, idx) in finalQuestionTypeSummary.find(
                    (i) =>
                      i.subject ===
                        filteredTestMistaker[
                          currentTestIndex
                        ].subject?.trim() &&
                      i.subClass ===
                        filteredTestMistaker[
                          currentTestIndex
                        ].subClass?.trim() &&
                      i.questionType ===
                        filteredTestMistaker[
                          currentTestIndex
                        ].questionType?.trim()
                  )?.questionTypeImgUrls || []"
                  :key="idx"
                  :src="url"
                  alt="原题"
                  class="small-img"
                  @click="openImageViewer(url)"
                />
              </div>
            </div>
          </div>
        </div>
        <!-- 导航按钮 -->
        <div v-if="filteredTestMistaker.length !== 0" class="test-navigation">
          <div>
            <button @click="finishTest" class="check-answer-btn">
              结束测试
            </button>
          </div>
          <div v-if="testResult == null || !showAnswer" class="answer-buttons">
            <button @click="recordAnswer(true)" class="correct-btn">
              正确
            </button>
            <button @click="recordAnswer(false)" class="wrong-btn">错误</button>
          </div>
          <div v-if="!(testResult == null || !showAnswer)">
            <button @click="nextQuestion" class="next-btn">下一题</button>
          </div>
          <div v-if="!showAnswer" class="check-answer-section">
            <button @click="checkAnswer" class="check-answer-btn">
              查看答案
            </button>
          </div>
          <div v-if="showAnswer" style="display: flex; gap: 2px">
            <button @click="editCurrentTestQuestion" class="check-answer-btn">
              编辑
            </button>
            <button
              @click="deleteError(filteredTestMistaker[currentTestIndex].id)"
              class="check-answer-btn"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      <!-- 综合汇总视图 -->
      <div v-if="currentView === 'subjectSummary'" class="subject-summary-view">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <h3>文档汇总</h3>
          <div style="display: flex; align-items: center; gap: 10px">
            <!-- 新增：全部展开/收起按钮 -->
            <span
              v-if="!isAllSubjectSummaryExpanded && finalSubjectSummary.length"
              @click="toggleSubjectSummaryExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▶
            </span>
            <span
              v-if="isAllSubjectSummaryExpanded && finalSubjectSummary.length"
              @click="toggleSubjectSummaryExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▼
            </span>

            <button @click="openAddSubjectSummaryModal" class="add-task-btn">
              添加
            </button>
          </div>
        </div>

        <div
          class="summary-list"
          style="margin-top: 0px"
          v-if="finalSubjectSummary.length"
        >
          <div
            class="summary-item"
            v-for="(item, index) in finalSubjectSummary"
            :key="index"
          >
            <!-- 修改头部，添加展开/收起按钮 -->
            <div
              class="summary-header"
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
              "
              @click="toggleSubjectSummary(index)"
            >
              <div style="display: flex; align-items: center; gap: 10px">
                <span
                  class="collapse-icon"
                  :class="{ rotated: !isSubjectSummaryExpanded(index) }"
                >
                  ▼
                </span>
                <span v-if="item.subject?.trim()" class="subject-title">{{
                  item.subject
                }}</span>
                <span v-if="item.title?.trim()" class="subject-title">{{
                  item.title
                }}</span>
              </div>

              <div
                class="error-actions"
                style="display: flex; flex-wrap: nowrap; flex-shrink: 0"
              >
                <button
                  @click="editSubjectSummary(index)"
                  class="read-btn"
                  title="编辑文档汇总"
                >
                  编辑
                </button>
                <button
                  @click="deleteSubjectSummary(index)"
                  class="read-btn"
                  title="删除文档汇总"
                >
                  删除
                </button>
              </div>
            </div>

            <!-- 内容区域，根据展开状态显示 -->
            <div
              class="summary-content"
              v-show="isSubjectSummaryExpanded(index)"
            >
              <div
                v-if="item.subjectSummary?.trim()"
                class="summary-text"
                v-html="ex(item.subjectSummary)"
                @click="handleLinkClick"
              ></div>
            </div>
            <div
              v-if="item.subjectImgUrls"
              class="small-imgs-wrap"
              v-show="isSubjectSummaryExpanded(index)"
            ></div>
          </div>
        </div>

        <div v-else class="empty-tip">
          暂无文档汇总数据！可在此记录各类信息。
        </div>
        <hr style="border: none; border-top: 1px solid black; height: 0" />
        <div
          style="
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <h3 style="margin: 20px 0 10px 0">资料汇总</h3>

          <!-- 上传按钮 -->
          <div style="margin-bottom: 15px">
            <input
              type="file"
              style="display: none"
              accept="*"
              @change="handleBackupFileUpload"
              ref="backupFileInput"
              multiple
            />
            <button
              class="action"
              @click="triggerBackupFileUpload"
              style="
                background-color: #4caf50;
                color: white;
                padding: 2px;
                border-radius: 4px;
                cursor: pointer;
              "
            >
              <i style="color: white; font-size: 1em" class="material-icons"
                >cloud_upload</i
              >
              上传文件
            </button>
            <span style="margin-left: 10px; color: #666; font-size: 14px"
              >支持上传任意类型文件，将保存到mistakebook.json（请尽量不要上传大文件，以免每次与服务器同步时产生过多流量）。</span
            >
          </div>

          <!-- 资料列表 -->
          <div class="backup-list" v-if="backupFiles.length">
            <div
              class="backup-item"
              v-for="(file, index) in backupFiles"
              :key="file.id"
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 10px;
                  border-bottom: 1px solid #eee;
                  background: #f5f5f5;
                  margin-bottom: 6px;
                "
              >
                <div style="display: flex; align-items: center">
                  <i
                    class="material-icons"
                    style="color: #4caf50; margin-right: 8px"
                    >description</i
                  >
                  <span class="backup-file-name">{{ file.name }}</span>
                </div>
                <div style="display: flex; flex-wrap: nowrap; flex-shrink: 0">
                  <button
                    class="read-btn"
                    @click="downloadBackupFile(index)"
                    style="
                      background-color: #2196f3;
                      color: white;
                      padding: 4px 12px;
                      border-radius: 4px;
                      font-size: 12px;
                    "
                  >
                    下载
                  </button>
                  <button
                    class="read-btn"
                    @click="deleteBackupFile(index)"
                    style="
                      background-color: #f44336;
                      color: white;
                      padding: 4px 12px;
                      border-radius: 4px;
                      font-size: 12px;
                    "
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-tip">
            暂无备份资料，点击上方按钮上传文件。
          </div>
        </div>
      </div>

      <!-- 文档汇总编辑框 -->
      <div class="modal" v-if="showSubjectSummaryModal">
        <div class="modal-content subject-summary-modal">
          <div class="modal-body">
            <div class="form-group">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>项目：<span class="required">*</span></span>
                <span class="modal-actions">
                  <button @click="cancelNow" class="cancel-btn">取消</button>
                  <button @click="saveNow" class="save-btn">保存</button>
                </span>
              </div>
              <input
                v-model="form.title"
                type="text"
                style="width: 100%"
                placeholder="请输入项目名称"
              />
              <div style="border: 1px solid #ccc">
                <!-- 工具栏 -->
                <Toolbar
                  style="border-bottom: 1px solid #ccc"
                  :editor="editor1"
                  mode="simple"
                  :defaultConfig="toolbarConfig"
                />
                <!-- 编辑器 -->
                <Editor
                  style="height: 500px"
                  :editor="editor1"
                  mode="simple"
                  v-model.lazy="form.subjectSummary"
                  :defaultConfig="editorConfig1"
                  @onCreated="onCreated1"
                />
              </div>
            </div>

            <!-- 文档汇总图片上传 -->
            <div class="form-group">
              <div>
                文档汇总图片：
                <span>
                  <input
                    type="file"
                    style="display: none"
                    accept="image/*"
                    @change="previewImg('subject', $event)"
                    multiple
                    ref="subject"
                  />
                  <button class="action" @click="uploadFile(2)">
                    <i
                      style="color: blue; font-size: 1.2em"
                      class="material-icons"
                      >attachment</i
                    >
                  </button>
                </span>
              </div>

              <!-- 多图预览 + 删除按钮 -->
              <div v-if="form.subjectImgUrls?.length" class="imgs-preview">
                <div
                  class="img-preview-item"
                  v-for="(url, index) in form.subjectImgUrls"
                  :key="`subject-${index}`"
                >
                  <img
                    :src="url"
                    alt="文档汇总图片剪裁"
                    @click="toCropOriginalImage(4, url, index)"
                  />
                  <span
                    class="img-delete-btn"
                    @click="deleteImg('subject', index)"
                    >×</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="currentView === 'mindMaps'"
        style="width: 100%; height: 100%"
        :class="'dt-theme-' + dtSettings.theme"
      >
        <!-- 列表页面 -->
        <div v-if="dtCurrentPage === 'home'" class="dt-home-wrapper">
          <div class="dt-home-container">
            <h1>思维导图列表</h1>
            <div class="dt-home-header-actions">
              <button @click="dtCreateNewMindMap" class="dt-btn dt-btn-primary">
                新建思维导图
              </button>
              <button @click="dtOpenImport" class="dt-btn dt-btn-primary">
                导入
              </button>
              <button @click="dtOpenExport" class="dt-btn dt-btn-primary">
                导出
              </button>
            </div>
            <div class="dt-mind-map-list">
              <div
                v-for="(mindMap, index) in dtMindMaps"
                :key="mindMap.id"
                class="dt-mind-map-item"
                @click="dtOpenMindMap(index)"
              >
                <div class="dt-mind-map-info">
                  <h3>{{ mindMap.name }}</h3>
                  <p>
                    节点数: {{ mindMap.nodes.length }} | 创建时间:
                    {{ dtFormatDate(mindMap.createdAt) }}
                  </p>
                </div>
                <button
                  @click.stop="dtDeleteMindMap(index)"
                  class="dt-btn dt-btn-danger"
                >
                  删除
                </button>
              </div>
              <div v-if="dtMindMaps.length === 0" class="dt-empty-hint">
                暂无思维导图，点击"新建思维导图"开始创建
              </div>
            </div>
          </div>
        </div>

        <!-- 思维导图编辑页面 -->
        <div v-else class="dt-mind-map-wrapper">
          <div
            class="dt-toolbar"
            style="touch-action: manipulation"
            @dblclick.stop
          >
            <button @click="dtGoBackHome" class="dt-btn" title="返回列表">
              <svg viewBox="0 0 1024 1024" style="width: 32; height: 32">
                <path
                  d="M811.584 424.128a300.608 300.608 0 0 0-213.952-88.64H262.4L375.808 222.08a40.064 40.064 0 0 0-56.64-56.576l-183.68 183.808a40.064 40.064 0 0 0 0 56.576l178.56 178.56a39.808 39.808 0 0 0 56.576 0 40.064 40.064 0 0 0 0-56.64L258.176 415.488h339.456c59.52 0 115.392 23.232 157.376 65.216a221.12 221.12 0 0 1 65.216 157.44v192a40 40 0 1 0 80 0v-192a300.16 300.16 0 0 0-88.64-214.016z"
                  fill="#1296DB"
                />
              </svg>
            </button>
            <div class="dt-btn-group">
              <button
                @click="dtAddSiblingNode"
                class="dt-btn dt-btn-small"
                :disabled="!dtSelectedNode"
                title="添加同级节点"
              >
                <svg viewBox="0 0 1024 1024" style="width: 32; height: 32">
                  <path
                    d="M672 432c-120.3 0-219.9 88.5-237.3 204H320c-15.5 0-28-12.5-28-28V244h291c14.2 35.2 48.7 60 89 60 53 0 96-43 96-96s-43-96-96-96c-40.3 0-74.8 24.8-89 60H112v72h108v364c0 55.2 44.8 100 100 100h114.7c17.4 115.5 117 204 237.3 204 132.5 0 240-107.5 240-240S804.5 432 672 432z m128 266c0 4.4-3.6 8-8 8h-86v86c0 4.4-3.6 8-8 8h-52c-4.4 0-8-3.6-8-8v-86h-86c-4.4 0-8-3.6-8-8v-52c0-4.4 3.6-8 8-8h86v-86c0-4.4 3.6-8 8-8h52c4.4 0 8 3.6 8 8v86h86c4.4 0 8 3.6 8 8v52z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtAddChildNode"
                class="dt-btn dt-btn-small"
                :disabled="!dtSelectedNode"
                title="添加下级节点"
              >
                <svg viewBox="0 0 1024 1024" style="width: 32; height: 32">
                  <path
                    d="M688 240c-138 0-252 102.8-269.6 236H249c-14.2-35.2-48.7-60-89-60-53 0-96 43-96 96s43 96 96 96c40.3 0 74.8-24.8 89-60h169.3C436 681.2 550 784 688 784c150.2 0 272-121.8 272-272S838.2 240 688 240z m128 298c0 4.4-3.6 8-8 8h-86v86c0 4.4-3.6 8-8 8h-52c-4.4 0-8-3.6-8-8v-86h-86c-4.4 0-8-3.6-8-8v-52c0-4.4 3.6-8 8-8h86v-86c0-4.4 3.6-8 8-8h52c4.4 0 8 3.6 8 8v86h86c4.4 0 8 3.6 8 8v52z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtExpandAll"
                class="dt-btn dt-btn-small"
                :disabled="dtIsAllExpanded"
                title="全部展开"
              >
                <svg viewBox="0 0 1024 1024" style="width: 32; height: 32">
                  <path
                    d="M256 512l-170.666667 128V384zM938.666667 938.666667H85.333333v-85.333334h853.333334zM938.666667 426.666667H341.333333V341.333333h597.333334zM938.666667 682.666667H341.333333v-85.333334h597.333334zM938.666667 170.666667H85.333333V85.333333h853.333334z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtCollapseAll"
                class="dt-btn dt-btn-small"
                :disabled="dtIsAllCollapsed"
                title="全部收起"
              >
                <svg viewBox="0 0 1024 1024" style="width: 32; height: 32">
                  <path
                    d="M96 186.24h832a32 32 0 0 0 0-64H96a32 32 0 0 0 0 64zM96 424.64h250.24a32 32 0 0 0 0-64H96a32 32 0 0 0 0 64zM96 663.36h250.24a32 32 0 0 0 0-64H96a32 32 0 0 0 0 64zM928 837.76H96a32 32 0 0 0 0 64h832a32 32 0 0 0 0-64zM928 486.08H579.52l104.64-113.6a32 32 0 0 0-47.36-43.52l-147.2 160a32 32 0 0 0 0 43.2l150.4 162.88a32 32 0 0 0 45.12 1.6 32 32 0 0 0 1.92-45.12l-93.76-101.44H928a32 32 0 0 0 0-64z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                v-if="!dtNoteNode"
                @click="dtAddNote"
                class="dt-btn dt-btn-small"
                title="添加笔记"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M553.877457 906.654335v-141.021965L1053.891329 254.520231l88.19422 90.117919s27.819653 26.339884 54.455491 0 0-55.639306 0-55.639306l-115.421965-117.937572s-28.707514-26.191908-54.455491 0-534.048555 545.886705-534.048555 545.886705-15.685549 13.465896-15.685549 40.397688v188.67052s1.183815 33.442775 34.478612 39.36185h196.217342s17.313295-1.479769 33.590751-18.05318l614.843931-630.085549s96.776879-108.910983 5.623121-229.364161c0 0-91.449711-123.116763-238.094798-31.815029 0 0-30.927168 21.604624-31.223121 45.428901-0.295954 23.824277 21.308671 42.913295 44.09711 38.917919 0 0 11.83815-2.36763 21.456647-11.098265 0 0 54.603468-58.154913 126.224278-9.322544 0 0 43.061272 31.223121 38.769942 83.606937 0 0 5.475145 38.473988-51.495954 90.561849L691.791908 906.654335h-137.914451z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                v-else
                @click="dtDeleteNote"
                class="dt-btn dt-btn-small"
                title="删除笔记"
              >
                ✕
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtAddComment"
                class="dt-btn dt-btn-small"
                :disabled="
                  !(
                    dtIsRealNodeSelected &&
                    dtSelectedNode.description.replace(/<[^>]*>/g, '').trim()
                      .length == 0 &&
                    !/(img|video|audio)/i.test(dtSelectedNode.description || '')
                  )
                "
                title="添加注释"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M832 64 192 64C121.6 64 64 121.6 64 192l0 512c0 70.4 57.6 128 128 128l128 0 132.096 120.448C459.072 957.632 466.88 960 474.432 960 493.824 960 512 944.704 512 922.496L512 832l320 0c70.4 0 128-57.6 128-128L960 192C960 121.6 902.4 64 832 64zM896 704c0 35.328-28.672 64-64 64L512 768c-16.96 0-33.28 6.72-45.248 18.752S448 815.04 448 832l0 30.08-84.864-77.376C351.296 773.952 335.936 768 320 768L192 768c-35.328 0-64-28.672-64-64L128 192c0-35.328 28.672-64 64-64l640 0c35.328 0 64 28.672 64 64L896 704zM736 320l-448 0C270.336 320 256 334.336 256 352S270.336 384 288 384l448 0C753.664 384 768 369.664 768 352S753.664 320 736 320zM736 512l-448 0C270.336 512 256 526.336 256 544S270.336 576 288 576l448 0C753.664 576 768 561.664 768 544S753.664 512 736 512z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtAddAttachmentBtn"
                class="dt-btn dt-btn-small"
                :disabled="
                  !dtIsRealNodeSelected ||
                  (dtSelectedNode.attachments &&
                    dtSelectedNode.attachments.length > 0)
                "
                title="添加附件"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M887.1 469.9L535 117.8c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l352.1 352.1c71.3 71.3 67.3 191.2-8.9 267.4-37.2 37.2-85.7 58.4-136.5 59.8-50.1 1.4-96.6-16.7-130.8-50.9L168.5 405.7c-20.5-20.5-31.3-48.3-30.5-78.4 0.9-30.8 13.8-60.3 36.4-82.9 22.6-22.6 52-35.5 82.9-36.4 30.1-0.8 57.9 10 78.4 30.4l391.2 391.2c14.4 14.4 13.1 39.1-3 55.2-16 16-40.8 17.4-55.2 3-0.1-0.1-0.2-0.1-0.2-0.2L316.9 336c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l351.9 351.9 0.5 0.5c42.5 42 112.6 40.5 156.5-3.4 44-44 45.4-114.3 3.2-156.8L386.9 187.8l-0.2-0.2c-70.9-70.9-188.9-68.2-263.1 5.9-35.7 35.7-56.1 82.5-57.5 131.8-1.4 50.1 16.9 96.7 51.5 131.3L509 848c46.7 46.7 109 72.1 176.3 72.1 2.5 0 5 0 7.5-0.1 69.4-1.9 135.2-30.7 185.4-80.9 50.2-50.2 79-116.1 80.9-185.4 2-70.1-23.6-135.4-72-183.8z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtOpenTagEditor"
                class="dt-btn dt-btn-small"
                :disabled="!dtIsRealNodeSelected"
                title="标签"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M243 128.4c-63.4 0-114.6 51.4-114.6 114.6 0 63.4 51.4 114.6 114.6 114.6 63.4 0 114.6-51.4 114.6-114.6 0.2-63.4-51.2-114.6-114.6-114.6z m0 188.6c-40.8 0-74-33.2-74-74s33.2-74 74-74 74 33.2 74 74-33 74-74 74z"
                    p-id="38363"
                  ></path>
                  <path
                    d="M489 59.6c-20.8-23-50-35.4-81.4-35.4L193 22C147.2 22 103.4 38.6 72 72 38.6 103.4 22 147.2 22 193l2 214.8c2 29.2 12.6 58.4 35.4 81.4L572.4 1002 1002 572.4 489 59.6z m81.4 884L86.6 459.8c-14.6-14.6-23-33.4-23-54.2l-2-212.6c0-33.4 14.6-66.8 37.6-91.8 25-25 58.4-39.6 93.8-39.6l212.6 2c20.8 0 39.6 8.4 54.2 23l483.8 483.8-373.2 373.2z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                v-if="
                  dtSelectedNode &&
                  dtSelectedNode.id &&
                  dtSelectedNode.id.startsWith('summary_')
                "
                @click="dtDeleteSummary"
                class="dt-btn dt-btn-small"
                title="删除概要"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M814.29 136.567H207.664c-55.752 0-101.274 13.3-101.274 56.776v26.086h808.663v-26.086c0.511-42.965-45.011-56.776-100.763-56.776"
                    p-id="3579"
                  ></path>
                  <path
                    d="M723.245 191.808l-19.948-140.66c-3.58-27.62-29.667-50.125-57.287-50.125H376.456c-28.132 0-53.707 22.505-57.799 50.126l-19.948 141.17c-3.58 27.621 15.856 22.506 43.477 22.506h337.07c28.133-0.511 47.57 4.604 43.989-23.017z m-360.6-28.643L377.99 51.66h265.463l15.344 111.505H362.645zM831.17 282.342H190.785c-36.827 0-64.959 30.177-61.378 67.005l55.24 607.648c3.58 36.827 36.316 67.005 73.655 67.005h505.35c36.828 0 70.074-30.178 73.655-67.005l55.24-607.137c3.58-36.827-24.04-67.516-61.378-67.516zM376.456 953.415H245.514l-43.476-592.816h174.418v592.816z m221.474 0H423.512V360.599H597.93v592.816z m177.487 0H646.01V360.599h172.883l-43.476 592.816z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                v-else
                @click="dtToggleSummary"
                class="dt-btn dt-btn-small"
                :disabled="!dtIsRealNodeSelected || dtSelectedNode?.level === 1"
                title="添加概要"
              >
                <svg
                  fill="#1296DB"
                  viewBox="0 0 1024 1024"
                  style="width: 32px; height: 32px; vertical-align: middle"
                >
                  <path
                    d="M742.4 189.44h-665.6c-20.48 0-35.84-15.36-35.84-35.84s15.36-35.84 35.84-35.84h665.6c20.48 0 35.84 15.36 35.84 35.84s-15.36 35.84-35.84 35.84zM742.4 547.84h-665.6c-20.48 0-35.84-15.36-35.84-35.84s15.36-35.84 35.84-35.84h665.6c20.48 0 35.84 15.36 35.84 35.84s-15.36 35.84-35.84 35.84zM742.4 906.24h-665.6c-20.48 0-35.84-15.36-35.84-35.84s15.36-35.84 35.84-35.84h665.6c20.48 0 35.84 15.36 35.84 35.84s-15.36 35.84-35.84 35.84zM1018.88 547.84c-81.92 0-143.36-66.56-143.36-143.36v-256c0-30.72-25.6-61.44-61.44-61.44-20.48 0-35.84-15.36-35.84-35.84s15.36-35.84 35.84-35.84c71.68 0 128 56.32 128 128v256c0 40.96 35.84 76.8 76.8 76.8 20.48 0 35.84 15.36 35.84 35.84s-15.36 35.84-35.84 35.84z"
                  />
                  <path
                    d="M814.08 1008.64c-20.48 0-35.84-15.36-35.84-35.84s15.36-35.84 35.84-35.84c30.72 0 61.44-25.6 61.44-61.44v-256c0-81.92 66.56-143.36 143.36-143.36 20.48 0 35.84 15.36 35.84 35.84s-15.36 35.84-35.84 35.84c-40.96 0-76.8 35.84-76.8 76.8v256c5.12 71.68-56.32 128-128 128z"
                  />
                </svg>
              </button>
              <button
                @click="dtToggleFavorite"
                class="dt-btn dt-btn-small"
                :disabled="!dtIsRealNodeSelected"
                :title="
                  dtSelectedNode && dtSelectedNode.isFavorite
                    ? '取消收藏'
                    : '收藏'
                "
              >
                {{ dtSelectedNode && dtSelectedNode.isFavorite ? "★" : "☆" }}
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtStartQuiz"
                class="dt-btn dt-btn-small"
                title="开始测验"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M337.997521 222.743505 816.959069 222.743505 816.959069 281.243695 337.997521 281.243695 337.997521 222.743505 337.997521 222.743505ZM337.997521 452.396916 816.959069 452.396916 816.959069 510.897105 337.997521 510.897105 337.997521 452.396916 337.997521 452.396916ZM337.731468 682.048698 570.78663 682.048698 570.78663 740.54912 337.731468 740.54912 337.731468 682.048698 337.731468 682.048698ZM147.4267 208.118458 231.326115 208.118458 231.326115 295.868975 147.4267 295.868975 147.4267 208.118458 147.4267 208.118458ZM147.4267 437.771636 231.326115 437.771636 231.326115 525.522153 147.4267 525.522153 147.4267 437.771636 147.4267 437.771636ZM147.159366 667.423651 231.058781 667.423651 231.058781 755.174167 147.159366 755.174167 147.159366 667.423651 147.159366 667.423651ZM83.885638 953.819462C70.204253 953.819462 66.105996 942.220567 66.105996 927.912495L66.105996 83.711535C66.105996 69.403462 70.204253 57.804567 83.885638 57.804567L892.668346 57.804567C906.348428 57.804567 910.446685 69.403462 910.446685 83.711535L910.446685 572.178851C910.446685 588.363636 922.639174 601.117324 937.681501 601.117324 952.722572 601.117324 964.917597 588.363636 964.917597 572.632204 964.917597 572.477207 964.917597 29.250095 964.917597 29.250095 964.917597 13.096029 952.397661 0 936.951133 0L39.602828 0C24.15886 0 11.636364 13.096029 11.636364 29.250095L11.636364 982.373935C11.636364 998.528233 24.15886 1011.624029 39.602828 1011.624029L499.972538 1011.624029C515.234863 1011.624029 527.606435 998.684625 527.606435 982.721862 527.605155 966.760262 515.233583 953.819462 499.971258 953.819462L83.885638 953.819462ZM1004.479209 738.904902C1009.341091 733.642007 1012.363636 726.507287 1012.363636 718.611549 1012.363636 702.457251 999.84114 689.361455 984.397172 689.361455 976.847849 689.361455 970.025076 692.522589 964.994351 697.606284L964.985391 697.598371 964.90226 697.686575C964.728297 697.863215 964.559453 698.041251 964.390609 698.223011L763.319599 908.522124 682.621789 824.12032C677.555247 818.782255 670.540614 815.468451 662.78023 815.468451 647.333702 815.468451 634.813766 828.56448 634.813766 844.718778 634.813766 852.792553 637.941201 860.100887 642.998807 865.393338L642.989847 865.401484 723.769507 949.887535 723.209239 950.472145 762.759331 991.838953 763.319575 991.254342 763.879843 991.838953 803.429935 950.472145 802.869667 949.887535 1004.536762 738.965178 1004.479209 738.904902 1004.479209 738.904902Z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtToggleShowBlanks"
                class="dt-btn dt-btn-small"
                :title="dtShowAllBlanks ? '隐藏填空答案' : '显示填空答案'"
              >
                <template>
                  <span v-if="dtShowAllBlanks"> 👁 </span>
                  <span v-else>
                    <svg
                      viewBox="0 0 1024 1024"
                      style="width: 32; height: 32; vertical-align: middle"
                    >
                      <path
                        d="M729.7024 286.47424l-56.12032 80.54784c33.42336 38.68672 53.7344 89.39008 53.7344 144.9472 0 121.34912-96.6912 219.776-215.97184 219.776-28.55936 0-55.80288-5.69856-80.75776-15.95904l-36.56704 52.48c37.00224 8.00768 76.12928 12.59008 116.93056 12.57984 263.34208 0 448.09216-183.12192 448.09216-268.98944C959.0784 450.38592 871.53152 345.3696 729.7024 286.47424zM312.27904 744.00256l50.57024-72.58112c-41.4976-40.05888-67.42016-96.6656-67.42016-159.44704 0-121.34912 96.63488-219.71968 215.91552-219.71968 35.58912 0 69.13024 8.81152 98.73408 24.32512l39.40352-56.55552c-42.91584-10.65984-89.28768-16.8704-138.53184-16.8704-255.7696 0-448.09216 179.8656-448.09216 268.70784C62.85824 575.6928 161.59744 686.57152 312.27904 744.00256zM510.9504 651.59168c75.95008 0 137.4976-62.65856 137.4976-139.9552 0-28.22656-8.23296-54.47168-22.35904-76.44672l-147.95776 212.36736C488.64768 650.16832 499.6352 651.59168 510.9504 651.59168zM510.9504 371.73248c-75.95008 0-137.4976 62.66368-137.4976 139.9552 0 36.05504 13.39904 68.90496 35.39968 93.70112l155.24352-222.8224C547.74272 375.59808 529.79712 371.73248 510.9504 371.73248zM250.148983 937.341824l-29.574161-20.600281 540.951265-776.600084 29.574161 20.600281-540.951265 776.600084Z"
                        fill="#1296DB"
                      />
                    </svg>
                  </span>
                </template>
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtCloneNode"
                class="dt-btn dt-btn-small"
                :disabled="!dtIsRealNodeSelected || dtSelectedNode.level === 1"
                title="克隆节点"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M149.504 767.8976h106.6496v106.7008c0 35.328 28.672 64 64 64h554.7008c35.328 0 64-28.672 64-64V319.8976c0-35.328-28.672-64-64-64h-106.7008V149.248c0-35.328-28.672-64-64-64H149.504c-35.328 0-64 28.672-64 64v554.6496c0 35.328 28.672 64 64 64zM682.8544 170.5984v85.2992H320.1536c-35.328 0-64 28.672-64 64v362.7008H170.8544v-512h512z m-64.2048 256.0512c11.776 0 21.3504 9.5744 21.3504 21.3504v106.6496h106.6496c11.776 0 21.3504 9.5744 21.3504 21.3504v42.6496c0 11.776-9.5744 21.3504-21.3504 21.3504H640v106.6496c0 11.776-9.5744 21.3504-21.3504 21.3504h-42.6496a21.3504 21.3504 0 0 1-21.3504-21.3504V640H448a21.3504 21.3504 0 0 1-21.3504-21.3504v-42.6496c0-11.776 9.5744-21.3504 21.3504-21.3504h106.6496V448c0-11.776 9.5744-21.3504 21.3504-21.3504h42.6496z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
              <button
                @click="dtToggleSpeak"
                class="dt-btn dt-btn-small"
                :disabled="!dtIsRealNodeSelected"
                :title="dtIsSpeaking ? '停止朗读' : '朗读节点'"
              >
                <template>
                  <span v-if="dtIsSpeaking"> 🔇 </span>
                  <span v-else>
                    <svg
                      viewBox="0 0 1024 1024"
                      style="width: 32; height: 32; vertical-align: middle"
                    >
                      <path
                        d="M332.8 792.064c-6.144 0-12.288-2.56-16.896-7.168-82.432-82.432-82.432-215.552 0-297.472 9.216-9.216 24.576-9.216 33.792 0 9.216 9.216 9.216 24.576 0 33.792-62.976 62.976-62.976 166.4 0 229.888 9.216 9.216 9.216 24.576 0 33.792-4.608 5.12-10.24 7.168-16.896 7.168z m90.112-73.728c-6.144 0-12.288-2.56-16.896-7.168-41.472-41.472-41.472-109.056 0-150.016 9.216-9.216 24.576-9.216 33.792 0 9.216 9.216 9.216 24.576 0 33.792-22.528 22.528-22.528 59.392 0 82.944 9.216 9.216 9.216 24.576 0 33.792-4.608 4.096-10.752 6.656-16.896 6.656z m0 0"
                        p-id="13539"
                      ></path>
                      <path
                        d="M243.2 863.744c-6.144 0-12.288-2.56-16.896-7.168-121.856-121.856-121.856-319.488 0-441.344 9.216-9.216 24.576-9.216 33.792 0 9.216 9.216 9.216 24.576 0 33.792-102.912 102.912-102.912 270.848 0 373.248 9.216 9.216 9.216 24.576 0 33.792-4.608 5.12-10.24 7.68-16.896 7.68z m621.056 57.344c-9.216 0-17.92-5.12-21.504-13.824l-32.256-71.168c-5.12-11.264-15.872-17.92-28.16-17.92-42.496 0.512-94.72 1.536-121.344 1.024-28.672-0.512-45.056-12.8-54.272-22.528-12.288-13.824-17.92-32.768-15.872-53.76 1.024-11.776-2.048-15.872-8.704-24.064-5.12-6.144-10.752-13.824-13.824-24.576-4.608-16.384 2.048-34.304 16.384-46.08 0.512-0.512 1.536-1.024 2.048-1.536l47.616-30.208-71.68-27.136c-0.512 0-1.024-0.512-2.048-0.512-16.896-8.192-26.624-26.624-23.04-45.568l9.216-48.64c1.024-5.12 0-10.24-3.072-13.824-3.072-4.096-7.168-6.656-12.288-7.68l-45.568-6.656c-12.8-2.048-24.064-10.24-29.696-22.016-5.632-11.776-5.12-25.6 1.536-36.864L547.84 254.464c13.824-23.04 18.944-50.688 15.36-77.312l-6.144-42.496c-2.048-12.8 7.168-25.088 19.968-27.136 12.8-2.048 25.088 7.168 27.136 19.968l6.144 42.496c5.632 37.376-2.048 75.776-21.504 108.544L503.296 418.816l35.328 5.12c17.92 2.56 33.792 12.288 44.032 27.136 10.752 14.848 14.336 32.768 11.264 50.688l-8.192 43.52 80.384 30.72c14.336 5.632 24.064 17.92 25.6 33.28 1.536 14.848-5.632 29.696-18.432 37.376l-57.344 36.352c1.024 1.536 2.048 3.072 3.584 4.608 8.192 10.24 21.504 27.136 18.432 58.368-0.512 4.096-0.512 11.776 4.096 17.408 4.608 5.12 13.312 6.656 19.456 6.656 25.6 0.512 77.312-0.512 119.296-1.024 31.232-0.512 59.392 17.408 72.192 46.08l32.256 71.168c5.632 11.776 0 26.112-11.776 31.744-2.56 2.048-5.632 3.072-9.216 3.072z m0 0"
                        fill="#1296DB"
                      />
                    </svg>
                  </span>
                </template>
              </button>
              <button
                @click="dtDeleteNode"
                class="dt-btn dt-btn-small"
                :disabled="
                  !dtSelectedNode ||
                  (dtSelectedNode.level === 1 &&
                    dtRootNodesCount <= 1 &&
                    !dtSelectedNode.id.startsWith('summary_'))
                "
                title="删除节点"
              >
                <svg
                  viewBox="0 0 1024 1024"
                  style="width: 32; height: 32; vertical-align: middle"
                >
                  <path
                    d="M814.29 136.567H207.664c-55.752 0-101.274 13.3-101.274 56.776v26.086h808.663v-26.086c0.511-42.965-45.011-56.776-100.763-56.776"
                    p-id="3579"
                  ></path>
                  <path
                    d="M723.245 191.808l-19.948-140.66c-3.58-27.62-29.667-50.125-57.287-50.125H376.456c-28.132 0-53.707 22.505-57.799 50.126l-19.948 141.17c-3.58 27.621 15.856 22.506 43.477 22.506h337.07c28.133-0.511 47.57 4.604 43.989-23.017z m-360.6-28.643L377.99 51.66h265.463l15.344 111.505H362.645zM831.17 282.342H190.785c-36.827 0-64.959 30.177-61.378 67.005l55.24 607.648c3.58 36.827 36.316 67.005 73.655 67.005h505.35c36.828 0 70.074-30.178 73.655-67.005l55.24-607.137c3.58-36.827-24.04-67.516-61.378-67.516zM376.456 953.415H245.514l-43.476-592.816h174.418v592.816z m221.474 0H423.512V360.599H597.93v592.816z m177.487 0H646.01V360.599h172.883l-43.476 592.816z"
                    fill="#1296DB"
                  />
                </svg>
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtUndo"
                class="dt-btn dt-btn-small"
                :disabled="dtUndoStack.length === 0"
                title="撤销"
              >
                ↩
              </button>
              <button
                @click="dtRedo"
                class="dt-btn dt-btn-small"
                :disabled="dtRedoStack.length === 0"
                title="重做"
              >
                ↪
              </button>
            </div>
            <div class="dt-btn-group dt-zoom-controls">
              <button @click="dtZoomIn()" class="dt-btn dt-btn-small">+</button>
              <span class="dt-zoom-level" style="color: #1296db"
                >{{ Math.round(dtScale * 100) }}%</span
              >
              <button @click="dtZoomOut()" class="dt-btn dt-btn-small">
                -
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtOpenSearch"
                class="dt-btn dt-btn-small"
                title="搜索"
              >
                🔍
              </button>
              <button
                @click="dtToggleViewMode"
                class="dt-btn dt-btn-small"
                :title="
                  dtViewMode === 'mindmap' ? '切换到大纲模式' : '切换到导图模式'
                "
              >
                <template>
                  <span v-if="dtViewMode === 'mindmap'">
                    <svg
                      viewBox="0 0 1024 1024"
                      style="width: 32; height: 32; vertical-align: middle"
                    >
                      <path
                        d="M369.590857 230.4h539.501714A41.033143 41.033143 0 0 0 950.857143 190.171429a41.033143 41.033143 0 0 0-41.764572-40.228572H369.590857a41.033143 41.033143 0 0 0-41.764571 40.228572c0 22.235429 18.651429 40.228571 41.691428 40.228571z m0 321.097143H906.971429a41.033143 41.033143 0 0 0 41.837714-40.228572 41.033143 41.033143 0 0 0-41.837714-40.228571H369.590857a41.033143 41.033143 0 0 0-41.837714 40.228571c0 22.162286 18.724571 40.228571 41.837714 40.228572z m539.501714 242.249143H369.590857a41.033143 41.033143 0 0 0-41.764571 40.228571c0 22.235429 18.651429 40.228571 41.691428 40.228572h539.574857a41.033143 41.033143 0 0 0 41.764572-40.228572 41.033143 41.033143 0 0 0-41.764572-40.228571zM73.142857 190.171429c0 44.470857 37.449143 80.530286 83.602286 80.530285 46.08 0 83.529143-36.059429 83.529143-80.457143 0-44.470857-37.376-80.530286-83.529143-80.530285C110.592 109.714286 73.142857 145.773714 73.142857 190.171429zM73.142857 510.756571c0 44.470857 37.449143 80.457143 83.602286 80.457143 46.08 0 83.529143-35.986286 83.529143-80.457143 0-44.470857-37.376-80.457143-83.529143-80.457142-46.153143 0-83.602286 35.986286-83.602286 80.457142zM73.142857 833.828571c0 44.397714 37.449143 80.457143 83.602286 80.457143 46.08 0 83.529143-36.059429 83.529143-80.457143 0-44.470857-37.376-80.530286-83.529143-80.530285-46.153143 0-83.602286 36.059429-83.602286 80.457143z"
                        fill="#1296DB"
                      />
                    </svg>
                  </span>
                  <span v-else
                    ><svg
                      viewBox="0 0 1024 1024"
                      style="width: 32; height: 32; vertical-align: middle"
                    >
                      <path
                        d="M216.234667 549.717333a32 32 0 1 1 37.546666 51.84l-24.405333 17.664c-70.570667 51.114667-37.973333 164.394667 50.944 169.941334l4.565333 0.426666a55.04 55.04 0 0 1 44.928 39.296l1.109334 4.565334 3.712 19.029333a70.656 70.656 0 0 0 140.032-13.482667V193.408c0-32.384-12.970667-63.402667-36.010667-86.144a63.701333 63.701333 0 0 0-66.986667-14.421333l-4.565333 1.92-10.666667 4.949333a80.64 80.64 0 0 0-26.026666 127.146667l16.725333 18.602666a32 32 0 0 1-47.530667 42.837334l-16.725333-18.56A144.64 144.64 0 0 1 329.472 41.685333l10.709333-4.949333 9.173334-3.84a127.701333 127.701333 0 0 1 134.314666 28.842667l6.4 6.656a185.130667 185.130667 0 0 1 48.597334 125.013333v645.546667c0 41.216-18.901333 80.170667-51.2 105.685333-79.189333 62.506667-196.437333 19.072-215.68-79.957333l-2.432-12.373334c-141.653333-14.592-196.394667-198.826667-77.525334-284.928l24.405334-17.664z"
                        fill="#1296DB"
                      ></path>
                      <path
                        d="M265.856 131.882667a32 32 0 0 1 18.773333 60.842666l-3.114666 1.109334-14.208 4.394666a107.349333 107.349333 0 0 0-63.744 151.850667l0.981333 1.962667 2.218667 5.034666a44.288 44.288 0 0 1-28.16 57.514667l-5.333334 1.365333c-81.28 14.976-101.888 121.984-32 166.101334l33.365334 21.034666 2.688 1.92a32 32 0 0 1-34.005334 53.845334l-2.858666-1.621334-33.365334-21.077333c-112-70.741333-87.68-236.117333 30.762667-276.906667a171.349333 171.349333 0 0 1 110.592-222.208l14.250667-4.352 3.157333-0.810666zM778.666667 461.568l3.285333 0.170667a32 32 0 0 1 0 63.658666l-3.328 0.170667H512a32 32 0 0 1 0-64h266.666667z"
                        fill="#1296DB"
                      ></path>
                      <path
                        d="M610.645333 743.978667V266.666667a168.021333 168.021333 0 0 1 168.021334-168.021334 32 32 0 0 1 0 64 103.978667 103.978667 0 0 0-104.021334 104.021334v477.312c0 53.888 40.96 98.133333 93.354667 103.466666l13.952 0.725334a32 32 0 0 1 0 63.658666l-3.328 0.170667-8.618667-0.213333a168.021333 168.021333 0 0 1-159.36-167.808zM973.312 130.645333a64 64 0 1 1-128 0 64 64 0 0 1 128 0zM973.312 490.666667a64 64 0 1 1-128 0 64 64 0 0 1 128 0zM973.312 880a64 64 0 1 1-128 0 64 64 0 0 1 128 0z"
                        fill="#1296DB"
                      /></svg
                  ></span>
                </template>
              </button>
            </div>
            <div class="dt-btn-group">
              <button
                @click="dtOpenSettings"
                class="dt-btn dt-btn-small"
                title="设置"
              >
                ⚙
              </button>
            </div>
          </div>
          <div class="dt-mind-map-name-bar">
            <span
              v-if="!dtIsEditingName"
              class="dt-mind-map-title"
              @click="dtStartEditName"
              title="单击编辑名称"
              >{{ dtCurrentMindMapName }}</span
            >
            <input
              v-else
              ref="dtNameInput"
              v-model="dtCurrentMindMapName"
              class="dt-mind-map-title-input"
              @blur="dtSaveMindMapName"
              @keydown.enter="dtSaveMindMapName"
              @keydown.escape="dtCancelEditName"
            />
          </div>
          <div
            v-if="dtViewMode === 'mindmap'"
            class="dt-mind-map-container"
            :style="{ overflow: isMobile ? 'auto' : 'hidden' }"
            ref="dtContainer"
            @mousedown="dtStartDrag"
            @mousemove="dtOnDrag"
            @mouseup="dtEndDrag"
            @mouseleave="dtEndDrag"
            @wheel="dtOnWheel"
            @dblclick="dtHandleCanvasDoubleClick"
            @touchstart="dtHandleTouchStart"
            @touchmove="dtHandleTouchMove"
            @touchend="dtHandleTouchEnd"
          >
            <div
              v-if="dtCanvasReady"
              class="dt-canvas"
              :style="{
                transform: `translate(${dtOffsetX}px, ${dtOffsetY}px) scale(${dtScale})`,
                transformOrigin: 'top left',
                width: dtCanvasWidth + 'px',
                height: dtCanvasHeight + 'px',
              }"
            >
              <svg
                class="dt-lines-layer"
                :width="dtCanvasWidth"
                :height="dtCanvasHeight"
                overflow="visible"
              >
                <line
                  v-for="line in dtFilteredLines"
                  :key="line.id"
                  :x1="line.x1"
                  :y1="line.y1"
                  :x2="line.x2"
                  :y2="line.y2"
                  :style="{ stroke: 'var(--line-color)', 'stroke-width': '2' }"
                />
                <path
                  v-for="path in dtPaths"
                  :key="path.id"
                  :d="path.d"
                  :style="{
                    stroke: 'var(--line-color)',
                    'stroke-width': '2',
                    fill: 'none',
                  }"
                />
                <!-- 关联线：只有在全部展开时才显示 -->
                <template v-if="dtCollapsedNodes.length === 0">
                  <g v-for="conn in dtConnectionLines" :key="conn.id">
                    <line
                      :x1="conn.x1"
                      :y1="conn.y1"
                      :x2="conn.x2"
                      :y2="conn.y2"
                      stroke="#e6a23c"
                      stroke-width="2"
                      stroke-dasharray="5,5"
                    />
                    <!-- 节点A端点的箭头：包裹符号是 $$ 时显示（指向节点A的箭头） -->
                    <polygon
                      v-if="conn.end1Suffix === '$$'"
                      :points="
                        dtGetArrowPoints(conn.x2, conn.y2, conn.x1, conn.y1)
                      "
                      fill="#e6a23c"
                      stroke="#d4952f"
                      stroke-width="1"
                    />
                    <!-- 节点B端点的箭头：包裹符号是 $$ 时显示（指向节点B的箭头） -->
                    <polygon
                      v-if="conn.end2Suffix === '$$'"
                      :points="
                        dtGetArrowPoints(conn.x1, conn.y1, conn.x2, conn.y2)
                      "
                      fill="#e6a23c"
                      stroke="#d4952f"
                      stroke-width="1"
                    />
                  </g>
                </template>

                <!-- 概要虚框和连线 -->
                <g v-for="item in dtSummaryLines" :key="item.id">
                  <rect
                    v-if="item.type === 'rect'"
                    :x="item.x"
                    :y="item.y"
                    :width="item.w"
                    :height="item.h"
                    :stroke="item.color || '#e6a23c'"
                    stroke-width="2"
                    stroke-dasharray="6,3"
                    fill="rgba(230, 162, 60, 0.05)"
                    rx="4"
                  />
                  <path
                    v-else
                    :d="item.d"
                    :stroke="item.color || '#e6a23c'"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                  />
                </g>
              </svg>
              <!-- 概要节点 -->
              <div
                v-for="summary in dtVisibleSummaries"
                :key="summary.id"
                class="dt-summary-node"
                :class="{
                  'dt-selected':
                    dtSelectedNode && dtSelectedNode.id === summary.id,
                }"
                :style="{
                  left: summary.x + 'px',
                  top: summary.y + 'px',
                  width: (summary.width || 120) + 'px',
                  height: (summary.height || 30) + 'px',
                }"
                @mousedown.stop
                @click.stop="dtSelectNode(summary, $event)"
                @dblclick.stop="dtStartEditSummary(summary)"
              >
                <div class="dt-summary-content" @wheel.stop>
                  <span
                    v-html="ex(summary.content)"
                    @click="handleLinkClick"
                    class="dt-summary-text"
                  ></span>
                </div>
                <div
                  class="dt-resize-handle"
                  @mousedown.stop="dtStartSummaryResize($event, summary)"
                  @touchstart.stop.prevent="
                    dtStartSummaryResize($event, summary)
                  "
                  title="调整大小"
                ></div>
              </div>
              <div
                v-for="node in dtVisibleNodes"
                :key="node.id"
                class="dt-node"
                :style="{
                  left: node.x + 'px',
                  top: node.y + 'px',
                  width:
                    (node.width ||
                      dtSettings.maxNodeWidth * dtSettings.defaultFontSize) +
                    'px',
                  height:
                    (node.height ||
                      dtSettings.maxNodeHeight * dtSettings.defaultFontSize) +
                    'px',
                }"
                @click.stop="dtSelectNode(node, $event, 1)"
                @dblclick.stop="dtStartEdit(node)"
              >
                <div
                  class="dt-node-content"
                  :class="{
                    'dt-selected':
                      dtSelectedNode && dtSelectedNode.id === node.id,
                    'dt-scrollable': node.needScroll,
                    'dt-root': node.level === 1,
                    'dt-target-node': node.isTarget,
                    'dt-favorite': node.isFavorite,
                    'dt-tag-highlight':
                      (dtSelectedTag &&
                        dtSelectedTag !== '__favorite__' &&
                        node.tags &&
                        node.tags.includes(dtSelectedTag)) ||
                      (dtSelectedTag === '__favorite__' && node.isFavorite),
                  }"
                  :style="dtSettings.showBorder ? {} : { border: 'none' }"
                  @wheel.capture="defaultAction1(node, $event)"
                  @touchstart="defaultAction(node, $event)"
                  @touchmove="defaultAction(node, $event)"
                  @touchend="defaultAction(node, $event)"
                >
                  <span
                    :style="{
                      display: 'block',
                      whiteSpace: 'normal',
                      fontFamily: dtSettings.defaultFontFamily,
                      fontSize: dtSettings.defaultFontSize + 'px',
                    }"
                    class="html-content"
                    v-html="ex(node.content)"
                    @click="handleLinkClick($event, node)"
                  ></span>
                  <!-- 拖拽放置指示线 -->
                  <div
                    v-if="node.isTarget && dtDropZoneType === 'sibling'"
                    class="dt-drop-indicator dt-drop-indicator-horizontal"
                  ></div>
                  <div
                    v-if="
                      node.isTarget &&
                      (dtDropZoneType === 'child' ||
                        dtDropZoneType === 'moveToLeft')
                    "
                    class="dt-drop-indicator dt-drop-indicator-vertical"
                  ></div>
                </div>
                <div
                  v-if="(node.tags && node.tags.length > 0) || node.isFavorite"
                  class="dt-node-tags"
                  @mousedown.stop
                  @touchstart.stop
                >
                  <span v-if="node.isFavorite" class="dt-node-favorite-star"
                    >★</span
                  >
                  <span
                    v-for="(tag, ti) in node.tags"
                    :key="ti"
                    class="dt-node-tag"
                    >{{ tag }}</span
                  >
                </div>
                <div
                  v-if="
                    !(
                      node.description.replace(/<[^>]*>/g, '').trim().length ==
                        0 && !/(img|video|audio)/i.test(node.description || '')
                    )
                  "
                  class="dt-description-icon"
                  :title="node.description.replace(/<[^>]*>/g, '').trim()"
                  @click.stop="dtOpenDescriptionView(node)"
                  @touchstart.stop.prevent="dtOpenDescriptionView(node)"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    style="width: 12; height: 12; vertical-align: middle"
                  >
                    <path
                      d="M832 64 192 64C121.6 64 64 121.6 64 192l0 512c0 70.4 57.6 128 128 128l128 0 132.096 120.448C459.072 957.632 466.88 960 474.432 960 493.824 960 512 944.704 512 922.496L512 832l320 0c70.4 0 128-57.6 128-128L960 192C960 121.6 902.4 64 832 64zM896 704c0 35.328-28.672 64-64 64L512 768c-16.96 0-33.28 6.72-45.248 18.752S448 815.04 448 832l0 30.08-84.864-77.376C351.296 773.952 335.936 768 320 768L192 768c-35.328 0-64-28.672-64-64L128 192c0-35.328 28.672-64 64-64l640 0c35.328 0 64 28.672 64 64L896 704zM736 320l-448 0C270.336 320 256 334.336 256 352S270.336 384 288 384l448 0C753.664 384 768 369.664 768 352S753.664 320 736 320zM736 512l-448 0C270.336 512 256 526.336 256 544S270.336 576 288 576l448 0C753.664 576 768 561.664 768 544S753.664 512 736 512z"
                      fill="#ffd700"
                    />
                  </svg>
                </div>
                <div
                  v-if="node.attachments && node.attachments.length > 0"
                  class="dt-attachment-icon"
                  :title="`${node.attachments.length} 个附件`"
                  @click.stop="dtOpenAttachmentList(node)"
                  @touchstart.stop.prevent="dtOpenAttachmentList(node)"
                >
                  <svg
                    viewBox="0 0 1024 1024"
                    style="width: 12; height: 12; vertical-align: middle"
                  >
                    <path
                      d="M887.1 469.9L535 117.8c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l352.1 352.1c71.3 71.3 67.3 191.2-8.9 267.4-37.2 37.2-85.7 58.4-136.5 59.8-50.1 1.4-96.6-16.7-130.8-50.9L168.5 405.7c-20.5-20.5-31.3-48.3-30.5-78.4 0.9-30.8 13.8-60.3 36.4-82.9 22.6-22.6 52-35.5 82.9-36.4 30.1-0.8 57.9 10 78.4 30.4l391.2 391.2c14.4 14.4 13.1 39.1-3 55.2-16 16-40.8 17.4-55.2 3-0.1-0.1-0.2-0.1-0.2-0.2L316.9 336c-14.1-14.1-36.9-14.1-50.9 0-14.1 14.1-14.1 36.9 0 50.9l351.9 351.9 0.5 0.5c42.5 42 112.6 40.5 156.5-3.4 44-44 45.4-114.3 3.2-156.8L386.9 187.8l-0.2-0.2c-70.9-70.9-188.9-68.2-263.1 5.9-35.7 35.7-56.1 82.5-57.5 131.8-1.4 50.1 16.9 96.7 51.5 131.3L509 848c46.7 46.7 109 72.1 176.3 72.1 2.5 0 5 0 7.5-0.1 69.4-1.9 135.2-30.7 185.4-80.9 50.2-50.2 79-116.1 80.9-185.4 2-70.1-23.6-135.4-72-183.8z"
                      fill="#ffd700"
                    />
                  </svg>
                </div>
                <div
                  v-if="dtHasChildren(node)"
                  class="dt-child-count-icon"
                  :class="{
                    'dt-has-collapsed-children': dtHasCollapsedChildren(node),
                    'dt-vertical': dtSettings.expandDirection === 'vertical',
                    'dt-child-count-icon-left':
                      dtSettings.expandDirection === 'both' &&
                      node._side === 'left',
                  }"
                  @click.stop="dtHandleChildCountIconClick(node)"
                  @touchstart.stop.prevent="dtHandleChildCountIconClick(node)"
                  :title="
                    dtHasCollapsedChildren(node) ? '展开下级' : '收起下级'
                  "
                >
                  <template v-if="dtHasCollapsedChildren(node)">{{
                    dtGetChildCount(node)
                  }}</template>
                  <template v-else
                    ><span class="dt-child-line"></span
                  ></template>
                </div>
                <div
                  class="dt-resize-handle"
                  @mousedown.stop="dtStartResize($event, node)"
                  @touchstart.stop.prevent="dtStartResize($event, node)"
                  title="调整大小"
                ></div>
                <div
                  class="dt-drag-handle"
                  @mousedown.stop="dtStartNodeDrag($event, node)"
                  @touchstart.stop.prevent="dtStartNodeDrag($event, node)"
                  title="拖拽节点"
                ></div>
              </div>
            </div>
            <!-- 笔记节点 -->
            <div
              v-if="dtNoteNode"
              class="dt-node dt-note-panel"
              :class="{ 'dt-note-panel-collapsed': dtNoteCollapsed }"
              :style="{
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: dtNoteCollapsed ? '' : dtNoteNode.width + 'px',
                height: dtNoteCollapsed ? '' : dtNoteNode.height + 'px',
              }"
              @dblclick.stop="dtStartEditNote"
              @mousedown.stop
              @touchstart.stop
            >
              <div class="dt-note-panel-header">
                <span v-if="!dtNoteCollapsed">笔记</span>
                <span
                  class="dt-note-panel-toggle"
                  :title="dtNoteCollapsed ? '展开笔记' : '收起笔记'"
                  @click.stop="dtToggleNoteCollapse"
                >
                  {{ dtNoteCollapsed ? "»" : "«" }}
                </span>
              </div>
              <div
                v-if="!dtNoteCollapsed"
                class="dt-node-content dt-note-content-box"
                @wheel.stop
              >
                <span
                  v-html="ex(dtNoteNode.content)"
                  @click="
                    handleLinkClick($event);
                    handleCardImageClick($event);
                  "
                ></span>
              </div>
              <div
                v-if="!dtNoteCollapsed"
                class="dt-resize-handle"
                @mousedown.stop="dtStartNoteResize($event)"
                @touchstart.stop.prevent="dtStartNoteResize($event)"
                title="调整大小"
              ></div>
            </div>
          </div>

          <!-- 标签列表面板 -->
          <div
            v-if="
              dtViewMode === 'mindmap' &&
              (dtAllTags.length > 0 || dtFavoriteCount > 0)
            "
            class="dt-tag-panel"
            :class="{ 'dt-tag-panel-collapsed': dtTagPanelCollapsed }"
          >
            <div class="dt-tag-panel-header">
              <span v-if="!dtTagPanelCollapsed">标签和收藏</span>
              <span class="dt-tag-panel-toggle" @click="dtToggleTagPanel">
                {{ dtTagPanelCollapsed ? "«" : "»" }}
              </span>
            </div>
            <div
              v-for="tag in dtAllTags"
              :key="tag"
              class="dt-tag-panel-item"
              :class="{ 'dt-selected': dtSelectedTag === tag }"
              @click="dtSelectTag(tag)"
            >
              <span class="dt-tag-panel-name">{{ tag }}</span>
              <span class="dt-tag-panel-count">{{
                dtGetTagNodeCount(tag)
              }}</span>
            </div>
            <div
              class="dt-tag-panel-item"
              :class="{ 'dt-selected': dtSelectedTag === '__favorite__' }"
              @click="dtSelectFavorite"
            >
              <span class="dt-tag-panel-name">★ 收藏</span>
              <span class="dt-tag-panel-count">{{ dtFavoriteCount }}</span>
            </div>
          </div>

          <!-- 大纲模式 -->
          <div v-if="dtViewMode === 'outline'" class="dt-outline-container">
            <div
              v-for="node in dtOutlineNodes"
              :key="node.id"
              class="dt-outline-node"
              :class="{
                'dt-outline-selected':
                  dtSelectedNode && dtSelectedNode.id === node.id,
                'dt-outline-root-node': node.level === 1,
              }"
              :style="{ paddingLeft: (node.level - 1) * 12 + 'px' }"
            >
              <div
                class="dt-outline-node-header"
                @click.stop="dtSelectNode(node, $event, 1)"
                @dblclick.stop="dtStartEdit(node)"
              >
                <span
                  v-if="dtHasChildren(node)"
                  class="dt-outline-toggle"
                  @click.stop="dtHandleChildCountIconClick(node)"
                  >{{ dtHasCollapsedChildren(node) ? "▶" : "▼" }}</span
                >
                <span v-else class="dt-outline-bullet">·</span>
                <span
                  v-if="dtNodeLevelNumbers[node.id]"
                  class="dt-outline-level-number"
                  >{{ dtNodeLevelNumbers[node.id] }}</span
                >
                <span
                  class="dt-outline-node-text"
                  :class="{ 'dt-outline-root-text': node.level === 1 }"
                  :style="{
                    fontFamily: dtSettings.defaultFontFamily,
                    fontSize: dtSettings.defaultFontSize + 'px',
                    textAlign: node.level === 1 ? 'center' : 'left',
                    width: node.level === 1 ? '100%' : 'auto',
                  }"
                  v-html="ex(node.content)"
                  @click="handleLinkClick($event, node)"
                  @wheel.stop
                ></span>
              </div>
              <div
                v-if="
                  !(
                    node.description.replace(/<[^>]*>/g, '').trim().length ==
                      0 && !/(img|video|audio)/i.test(node.description || '')
                  )
                "
                class="dt-outline-meta dt-outline-comment"
                :class="{
                  'dt-outline-meta-selected':
                    dtSelectedNode && dtSelectedNode.id === node.id,
                }"
                @click.stop="dtSelectNode(node, $event)"
                @dblclick.stop="dtOpenDescriptionEdit(node)"
              >
                <span class="dt-outline-meta-label">注释:</span>
                <span
                  class="dt-outline-meta-text"
                  v-html="ex(node.description)"
                  @click="
                    handleLinkClick($event);
                    handleCardImageClick($event);
                  "
                ></span>
              </div>
              <div
                v-if="
                  node.isFavorite ||
                  (node.tags && node.tags.length > 0) ||
                  (node.attachments && node.attachments.length > 0)
                "
                class="dt-outline-meta dt-outline-attachment"
                :class="{
                  'dt-outline-meta-selected':
                    dtSelectedNode && dtSelectedNode.id === node.id,
                }"
                @click.stop="dtSelectNode(node, $event)"
              >
                <span v-if="node.isFavorite" class="dt-outline-favorite"
                  >★</span
                >
                <span
                  v-if="node.tags && node.tags.length > 0"
                  class="dt-outline-tags"
                >
                  <span
                    v-for="(tag, ti) in node.tags"
                    :key="ti"
                    class="dt-outline-tag"
                    >{{ tag }}</span
                  >
                </span>
                <span v-if="node.attachments && node.attachments.length > 0">
                  <span class="dt-outline-meta-label">附件:</span>
                  <span
                    v-for="(att, ai) in node.attachments"
                    :key="ai"
                    class="dt-outline-meta-text"
                    >{{ att.name
                    }}<span v-if="ai < node.attachments.length - 1"
                      >,
                    </span></span
                  >
                </span>
              </div>
            </div>
          </div>
          <!-- 注释查看弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsDescriptionViewOpen">
            <div class="dt-edit-modal-content">
              <div class="dt-modal-header">
                <h3>节点注释</h3>
                <button
                  @click="dtCloseDescriptionView"
                  class="dt-btn dt-btn-secondary"
                >
                  关闭
                </button>
              </div>
              <div
                class="dt-description-view-content"
                @dblclick="dtOpenDescriptionEdit(dtCurrentDescriptionNode)"
                @click="handleLinkClick"
              >
                <span
                  v-html="ex(dtCurrentDescriptionNode?.description || '')"
                ></span>
              </div>
            </div>
          </div>
          <!-- 附件列表弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsAttachmentListOpen">
            <div class="dt-edit-modal-content">
              <div class="dt-modal-header">
                <h3>附件列表</h3>
                <button @click="dtAddAttachment" class="dt-btn dt-btn-primary">
                  + 添加节点附件
                </button>
                <button
                  @click="dtCloseAttachmentList"
                  class="dt-btn dt-btn-secondary"
                >
                  关闭
                </button>
              </div>
              <div class="dt-attachment-list">
                <div
                  v-if="
                    dtCurrentAttachmentNode &&
                    (!dtCurrentAttachmentNode.attachments ||
                      dtCurrentAttachmentNode.attachments.length === 0)
                  "
                  class="dt-empty-hint"
                >
                  暂无附件，点击"添加附件"上传文件
                </div>
                <div
                  v-else
                  v-for="(
                    attachment, index
                  ) in dtCurrentAttachmentNode.attachments"
                  :key="index"
                  class="dt-attachment-item"
                >
                  <span class="dt-attachment-name">{{ attachment.name }}</span>
                  <button
                    @click="dtDownloadAttachment(attachment)"
                    class="dt-btn"
                  >
                    下载
                  </button>

                  &nbsp;&nbsp;
                  <button
                    @click="dtDeleteAttachment(index)"
                    class="dt-btn dt-btn-danger"
                  >
                    删除
                  </button>
                </div>
              </div>
              <input
                ref="dtAttachmentFileInput"
                type="file"
                class="dt-file-input"
                @change="dtHandleFileUpload"
              />
            </div>
          </div>

          <!-- 标签编辑弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsTagEditorOpen">
            <div class="dt-edit-modal-content">
              <h3>编辑标签</h3>
              <input
                ref="dtTagInput"
                v-model="dtTagEditorContent"
                class="dt-tag-input"
                placeholder="请输入此节点的标签，多个标签请用空格分开"
                @keydown.enter="dtSaveTags"
              />
              <div class="dt-all-tags" v-if="dtAllTags.length > 0">
                <div class="dt-all-tags-title">已有标签（点击追加）：</div>
                <div class="dt-all-tags-list">
                  <span
                    v-for="(tag, ti) in dtAllTags"
                    :key="ti"
                    class="dt-all-tag-item"
                    @click="dtAppendTag(tag)"
                    >{{ tag }}</span
                  >
                </div>
              </div>
              <div class="dt-edit-modal-buttons">
                <button
                  @click="dtCloseTagEditor"
                  class="dt-btn dt-btn-secondary"
                >
                  取消
                </button>
                <button @click="dtSaveTags" class="dt-btn dt-btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>

          <!-- 概要编辑弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsSummaryEditorOpen">
            <div class="dt-edit-modal-content">
              <h3>编辑概要</h3>
              <p class="dt-summary-hint">
                概要范围仅能选取相同父级的连续子节点。对任意节点进行分组归类可使用标签或关联线(在注释中定义)
              </p>
              <div class="dt-summary-info">
                <div class="dt-summary-info-item">
                  <label>起始节点：</label>
                  <select
                    v-model="dtSummaryStartNodeId"
                    class="dt-summary-select"
                  >
                    <option
                      v-for="node in dtSummaryStartOptions"
                      :key="node.id"
                      :value="node.id"
                    >
                      {{ node.id }}
                    </option>
                  </select>
                </div>
                <div class="dt-summary-info-item">
                  <label>结束节点：</label>
                  <select
                    v-model="dtSummaryEndNodeId"
                    class="dt-summary-select"
                  >
                    <option value="">仅起始节点</option>
                    <option
                      v-for="sibling in dtSummarySiblingOptions"
                      :key="sibling.id"
                      :value="sibling.id"
                    >
                      {{ sibling.id }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div style="border: 1px solid #ccc">
                  <!-- 工具栏 -->
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    mode="simple"
                    :defaultConfig="toolbarConfig"
                  />
                  <!-- 编辑器 -->
                  <Editor
                    style="height: 300px"
                    :editor="editor"
                    mode="simple"
                    v-model="dtSummaryContent"
                    :defaultConfig="editorConfig"
                    @onCreated="onCreated"
                  />
                </div>
              </div>

              <div class="dt-edit-modal-buttons">
                <button
                  @click="dtCloseSummaryEditor"
                  class="dt-btn dt-btn-secondary"
                >
                  取消
                </button>
                <button @click="dtSaveSummary" class="dt-btn dt-btn-primary">
                  保存
                </button>
              </div>
            </div>
          </div>

          <!-- 测验模式窗口 -->
          <div class="dt-quiz-overlay" v-if="dtIsQuizMode">
            <div class="dt-quiz-toolbar">
              <button @click="dtCloseQuiz" class="dt-btn" title="返回">
                ←
              </button>
              <div class="dt-quiz-mastery-info">
                当前题目掌握程度为：<span
                  class="dt-quiz-mastery-level"
                  :class="dtMasteryLevelAnimating"
                  >{{ dtQuizCurrentMasteryLevel }}</span
                >
                级
              </div>
              <button @click="dtOpenQuizSettings" class="dt-btn" title="设置">
                ⚙
              </button>
            </div>
            <div class="dt-quiz-content-area">
              <div
                style="
                  display: flex;
                  width: 100%;
                  max-width: 800px;
                  justify-content: space-between;
                "
              >
                <span class="dt-quiz-progress">
                  {{ dtQuizCurrentIndex + 1 }} / {{ dtQuizNodes.length }}
                </span>
                <span
                  v-if="
                    dtQuizCurrentNode && dtQuizCurrentNode.quizType !== 'note'
                  "
                  class="dt-quiz-favorite-star"
                  @click="dtQuizToggleFavorite"
                  :title="
                    dtQuizCurrentNode.node.isFavorite ? '取消收藏' : '收藏'
                  "
                >
                  {{ dtQuizCurrentNode.node.isFavorite ? "★" : "☆" }}
                </span>
                <span class="dt-quiz-node-id" v-if="dtQuizCurrentNode">
                  {{ dtQuizCurrentTitle }}
                </span>
              </div>
              <div
                class="dt-quiz-content"
                @wheel.stop
                @dblclick="dtQuizEditContent"
                v-if="dtQuizCurrentNode"
              >
                <span
                  v-html="ex(dtQuizContent)"
                  @click="
                    handleLinkClick($event);
                    handleCardImageClick($event);
                  "
                  class="dt-quiz-content-text"
                ></span>
              </div>
              <div
                class="dt-quiz-options"
                v-if="
                  dtQuizCurrentNode &&
                  dtQuizCurrentNode.displayType === 'choice'
                "
              >
                <div
                  v-for="(option, idx) in dtQuizCurrentNode.options"
                  :key="idx"
                  class="dt-quiz-option"
                  :class="{
                    'dt-quiz-option-selected':
                      !dtQuizCurrentAnswered &&
                      dtQuizUserAnswers[dtQuizCurrentNode.quizId] === option,
                    'dt-quiz-option-correct':
                      dtQuizCurrentAnswered &&
                      option === dtQuizCurrentCorrectAnswer &&
                      dtQuizUserAnswers[dtQuizCurrentNode.quizId] === option,
                    'dt-quiz-option-wrong':
                      dtQuizCurrentAnswered &&
                      dtQuizUserAnswers[dtQuizCurrentNode.quizId] === option &&
                      option !== dtQuizCurrentCorrectAnswer,
                    'dt-quiz-option-correct-border':
                      dtQuizCurrentAnswered &&
                      option === dtQuizCurrentCorrectAnswer &&
                      dtQuizUserAnswers[dtQuizCurrentNode.quizId] !== option,
                  }"
                  @click="dtQuizSelectOption(option)"
                >
                  <span class="dt-quiz-option-label"
                    >{{ String.fromCharCode(65 + idx) }}.</span
                  >
                  <span class="dt-quiz-option-text">{{ option }}</span>
                </div>
              </div>
              <div
                class="dt-quiz-no-blank"
                v-else-if="dtQuizNodes.length === 0"
              >
                当前无已到期的测试题目。测试题目为包含 **填空答案**
                的节点内容、节点注释、笔记和概要。
              </div>
            </div>
            <div class="dt-quiz-bottom-bar" v-if="dtQuizNodes.length > 0">
              <button
                @click="dtQuizPrev"
                class="dt-btn dt-quiz-nav-btn"
                :disabled="dtQuizCurrentIndex <= 0"
              >
                上一题
              </button>
              <template v-if="dtQuizCurrentNode">
                <button
                  v-if="dtQuizCurrentNode.displayType !== 'choice'"
                  @click="dtQuizKnow"
                  class="dt-btn dt-quiz-know-btn"
                  :disabled="dtQuizCurrentAnswered"
                >
                  已会
                </button>
                <button
                  @click="dtQuizToggleAnswer"
                  class="dt-btn dt-quiz-toggle-btn"
                >
                  {{ dtQuizShowAnswer ? "隐藏答案" : "显示答案" }}
                </button>
                <div
                  class="dt-quiz-result-buttons"
                  v-if="dtQuizCurrentNode.displayType !== 'choice'"
                >
                  <button
                    @click="dtQuizDontKnow"
                    class="dt-btn dt-quiz-dontknow-btn"
                    :disabled="dtQuizCurrentAnswered"
                  >
                    不会
                  </button>
                </div>
              </template>
              <button
                @click="dtQuizNext"
                class="dt-btn dt-quiz-nav-btn"
                :disabled="
                  dtQuizCurrentIndex >= dtQuizNodes.length - 1 ||
                  !dtQuizCurrentAnswered
                "
              >
                下一题
              </button>
            </div>
            <!-- 测验设置弹窗 -->
            <div
              class="dt-edit-modal"
              v-if="dtIsQuizSettingsOpen"
              @click.self="dtCloseQuizSettings"
            >
              <div class="dt-edit-modal-content">
                <h3>测验设置</h3>
                <div style="padding: 20px 0; white-space: normal">
                  <p style="color: #606266; margin-bottom: 16px">
                    每道题目都有1-9级掌握程度。答对时掌握程度+1，答错时掌握程度重置为1。
                  </p>
                  <label
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 16px;
                      color: #303133;
                    "
                  >
                    <input
                      type="checkbox"
                      v-model="dtUseEbbinghaus"
                      style="margin-right: 8px"
                      @change="dtOnQuizSettingChange"
                    />
                    使用艾宾浩斯记忆曲线来复习
                  </label>
                  <div style="margin-bottom: 16px">
                    <label
                      style="color: #606266; display: flex; align-items: center"
                    >
                      测试间隔天数：
                      <input
                        type="text"
                        v-model="dtEbbinghausIntervals"
                        style="
                          margin-left: 8px;
                          padding: 6px 10px;
                          border: 1px solid #dcdfe6;
                          border-radius: 4px;
                          width: 200px;
                        "
                      />
                    </label>
                    <p style="color: #909399; font-size: 12px; margin-top: 8px">
                      说明：按掌握程度从1到9的间隔天数，用空格分隔。掌握程度为1时用第1个值，为2时用第2个值，依次类推。
                    </p>
                  </div>
                  <label
                    style="
                      display: flex;
                      align-items: center;
                      margin-bottom: 16px;
                      color: #303133;
                    "
                  >
                    <input
                      type="checkbox"
                      v-model="dtShuffleQuestions"
                      style="margin-right: 8px"
                      @change="dtOnQuizSettingChange"
                    />
                    乱序
                  </label>
                  <div style="margin-bottom: 16px">
                    <div style="color: #303133; margin-bottom: 8px">
                      题型选择：
                    </div>
                    <label
                      style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 6px;
                        color: #606266;
                      "
                    >
                      <input
                        type="radio"
                        v-model="dtQuestionType"
                        value="choice"
                        style="margin-right: 8px"
                        @change="dtOnQuestionTypeChange"
                      />
                      选择题
                    </label>
                    <label
                      style="display: flex; align-items: center; color: #606266"
                    >
                      <input
                        type="radio"
                        v-model="dtQuestionType"
                        value="fill"
                        style="margin-right: 8px"
                        @change="dtOnQuestionTypeChange"
                      />
                      填空题
                    </label>
                  </div>
                </div>
                <div class="dt-edit-modal-buttons">
                  <button
                    @click="dtResetAllMastery"
                    class="dt-btn dt-btn-danger"
                  >
                    重置
                  </button>
                  <button
                    @click="dtCloseQuizSettings"
                    class="dt-btn dt-btn-primary"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 设置弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsSettingsOpen">
            <div class="dt-edit-modal-content">
              <h3>设置</h3>
              <div class="dt-settings-form">
                <div class="dt-settings-item">
                  <label>默认字号：</label>
                  <input
                    type="number"
                    v-model.number="dtSettings.defaultFontSize"
                    min="10"
                    max="32"
                    class="dt-settings-input"
                  />
                  <span class="dt-settings-unit">px</span>
                </div>
                <div class="dt-settings-item">
                  <label>字体：</label>
                  <select
                    v-model="dtSettings.defaultFontFamily"
                    class="dt-settings-input"
                  >
                    <option value="Microsoft YaHei">微软雅黑</option>
                    <option value="SimSun">宋体</option>
                    <option value="SimHei">黑体</option>
                    <option value="KaiTi">楷体</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>
                <div class="dt-settings-item">
                  <label>节点自动调整时最大宽度：</label>
                  <input
                    type="number"
                    v-model.number="dtSettings.maxNodeWidth"
                    min="4"
                    max="30"
                    class="dt-settings-input"
                  />
                  <span class="dt-settings-unit">em</span>
                </div>
                <div class="dt-settings-item">
                  <label>节点自动调整时最大高度：</label>
                  <input
                    type="number"
                    v-model.number="dtSettings.maxNodeHeight"
                    min="4"
                    max="30"
                    class="dt-settings-input"
                  />
                  <span class="dt-settings-unit">em</span>
                </div>
                <div class="dt-settings-item">
                  <label>父子节点间距：</label>
                  <input
                    type="number"
                    v-model.number="dtSettings.levelGap"
                    min="50"
                    max="400"
                    class="dt-settings-input"
                  />
                  <span class="dt-settings-unit">px</span>
                </div>
                <div class="dt-settings-item">
                  <label>{{
                    dtSettings.expandDirection === "vertical"
                      ? "节点水平间距："
                      : "节点垂直间距："
                  }}</label>
                  <input
                    type="number"
                    v-model.number="dtSettings.nodeGap"
                    min="5"
                    max="100"
                    class="dt-settings-input"
                  />
                  <span class="dt-settings-unit">px</span>
                </div>
                <div class="dt-settings-item">
                  <label>连线样式：</label>
                  <select
                    v-model="dtSettings.lineStyle"
                    class="dt-settings-input"
                  >
                    <option value="diverge">折线</option>
                    <option value="straight">直线</option>
                    <option value="curve">曲线</option>
                  </select>
                </div>
                <div class="dt-settings-item">
                  <label>展开方向：</label>
                  <select
                    v-model="dtSettings.expandDirection"
                    class="dt-settings-input"
                  >
                    <option value="horizontal">水平</option>
                    <option value="vertical">垂直</option>
                    <option value="both">双侧</option>
                  </select>
                </div>
                <div class="dt-settings-item">
                  <label>显示边框：</label>
                  <input
                    type="checkbox"
                    v-model="dtSettings.showBorder"
                    class="dt-settings-checkbox"
                  />
                </div>

                <div class="dt-settings-item">
                  <label>主题：</label>
                  <select v-model="dtSettings.theme" class="dt-settings-input">
                    <option value="default">默认主题</option>
                    <option value="light">白天主题</option>
                    <option value="dark">黑夜主题</option>
                    <option value="presbyopia">清晰主题</option>
                    <option value="eyecare">护眼主题</option>
                  </select>
                </div>
              </div>
              <div class="dt-settings-tips">
                本思维导图的节点内容、节点注释、笔记、概要都支持富文本(文本、图片、待办列表、表格、链接等)。并可插入**填空答案**变为可测试的填空题。
              </div>
              <div class="dt-edit-modal-buttons">
                <button
                  @click="dtResetSettings"
                  class="dt-btn dt-btn-secondary"
                >
                  重置
                </button>
                <button @click="dtCloseSettings" class="dt-btn dt-btn-primary">
                  确定
                </button>
              </div>
            </div>
          </div>

          <!-- 搜索弹窗 -->
          <div class="dt-edit-modal" v-if="dtIsSearchOpen">
            <div class="dt-edit-modal-content dt-search-modal">
              <h3>搜索节点</h3>
              <div class="dt-search-input-wrapper">
                <input
                  type="text"
                  v-model="dtSearchKeyword"
                  placeholder="输入关键词搜索..."
                  class="dt-search-input"
                  @input="dtPerformSearch"
                  ref="dtSearchInput"
                />
                <span class="dt-search-count" v-if="dtSearchResults.length > 0">
                  找到 {{ dtSearchResults.length }} 个结果
                </span>
              </div>
              <div class="dt-search-filter">
                <label class="dt-checkbox-label">
                  <input
                    type="checkbox"
                    v-model="dtSearchMasteryEnabled"
                    @change="dtPerformSearch"
                  />
                  仅显示掌握程度为
                  <input
                    type="number"
                    v-model.number="dtSearchMasteryMin"
                    min="1"
                    max="9"
                    class="dt-mastery-input"
                    @input="dtOnMasteryMinChange"
                  />
                  到
                  <input
                    type="number"
                    v-model.number="dtSearchMasteryMax"
                    min="1"
                    max="9"
                    class="dt-mastery-input"
                    @input="dtOnMasteryMaxChange"
                  />
                  级的节点
                </label>
              </div>
              <div class="dt-search-filter">
                <label class="dt-checkbox-label">
                  <input
                    type="checkbox"
                    v-model="dtSearchFavoritesOnly"
                    @change="dtPerformSearch"
                  />
                  仅显示收藏的节点
                </label>
              </div>
              <div class="dt-search-tags" v-if="dtAllTags.length > 0">
                <div class="dt-search-tags-title">按标签筛选：</div>
                <div class="dt-search-tags-list">
                  <span
                    v-for="(tag, ti) in dtAllTags"
                    :key="ti"
                    class="dt-search-tag-chip"
                    :class="{ 'dt-search-tag-active': dtSearchTag === tag }"
                    @click="dtToggleSearchTag(tag)"
                    >{{ tag }}</span
                  >
                </div>
              </div>
              <div class="dt-search-results" v-if="dtSearchResults.length > 0">
                <div
                  v-for="(result, index) in dtSearchResults"
                  :key="result.id"
                  class="dt-search-result-item"
                  @click="dtLocateNode(result)"
                >
                  <div class="dt-search-result-index">{{ index + 1 }}</div>
                  <div class="dt-search-result-content">
                    <div
                      class="dt-search-result-text"
                      v-html="ex(result.displayContent)"
                      @wheel.stop
                    ></div>
                    <div class="dt-search-result-level">
                      层级: {{ result.level }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="dt-search-empty"
                v-else-if="
                  (dtSearchKeyword ||
                    dtSearchTag ||
                    dtSearchFavoritesOnly ||
                    dtSearchMasteryEnabled) &&
                  dtSearchResults.length === 0
                "
              >
                未找到匹配的节点
              </div>
              <div class="dt-edit-modal-buttons">
                <button @click="dtResetSearch" class="dt-btn dt-btn-secondary">
                  重置
                </button>
                <button @click="dtCloseSearch" class="dt-btn dt-btn-secondary">
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 导入弹窗（全局） -->
        <div class="dt-edit-modal" v-if="dtIsImportOpen">
          <div class="dt-edit-modal-content">
            <h3>导入思维导图</h3>
            <div class="dt-import-warning">
              ⚠️
              导入后将覆盖掉现在错题本中的导图数据。请提前备份整个错题本文件mistakebook.json。
            </div>
            <div class="dt-import-options">
              <div class="dt-import-item" @click="dtTriggerMindMapJSONImport">
                <div class="dt-import-icon">💾</div>
                <div class="dt-import-info">
                  <h4>pdj-MindMap (.json)</h4>
                  <p>
                    导入完整备份，包含所有思维导图数据。(只能导入从本页导出功能得到的json文件，不能导入错题本的json备份文件。)
                  </p>
                </div>
              </div>
              <div class="dt-import-item" @click="dtTriggerMarkdownImport">
                <div class="dt-import-icon">📝</div>
                <div class="dt-import-info">
                  <h4>Markdown (.md)</h4>
                  <p>支持从 Notion、Obsidian 等笔记软件导入</p>
                </div>
              </div>
            </div>
            <input
              ref="dtImportFileInput"
              type="file"
              accept=".md"
              class="dt-file-input"
              @change="dtHandleMarkdownImport"
            />
            <input
              ref="dtMindMapJSONInput"
              type="file"
              accept=".json"
              class="dt-file-input"
              @change="dtHandleMindMapJSONImport"
            />
            <div class="dt-edit-modal-buttons">
              <button @click="dtCloseImport" class="dt-btn dt-btn-secondary">
                取消
              </button>
            </div>
          </div>
        </div>

        <!-- 导出弹窗（全局） -->
        <div class="dt-edit-modal" v-if="dtIsExportOpen">
          <div class="dt-edit-modal-content">
            <h3>导出思维导图</h3>
            <div class="dt-export-options">
              <div class="dt-export-item" @click="dtExportMindMapJSON">
                <div class="dt-export-icon">💾</div>
                <div class="dt-export-info">
                  <h4>pdj-MindMap (.json)</h4>
                  <p>完整备份格式，包含所有思维导图数据，可用于迁移和恢复</p>
                </div>
              </div>
              <div class="dt-export-item" @click="dtExportHTML">
                <div class="dt-export-icon">📄</div>
                <div class="dt-export-info">
                  <h4>HTML 大纲</h4>
                  <p>竖向排列，保留展开收起功能，可下载附件，离线使用</p>
                </div>
              </div>
              <div class="dt-export-item" @click="dtExportPDF">
                <div class="dt-export-icon">📑</div>
                <div class="dt-export-info">
                  <h4>PDF 文档</h4>
                  <p>全展开状态，适合打印和分享</p>
                </div>
              </div>
              <div class="dt-export-item" @click="dtExportPNG">
                <div class="dt-export-icon">🖼️</div>
                <div class="dt-export-info">
                  <h4>PNG 图片</h4>
                  <p>全展开状态，高清图片格式</p>
                </div>
              </div>
              <div class="dt-export-item" @click="dtExportMarkdown">
                <div class="dt-export-icon">📝</div>
                <div class="dt-export-info">
                  <h4>Markdown (.md)</h4>
                  <p>
                    通用格式，支持 Notion、Obsidian、Typora
                    等笔记软件和xmind等思维导图软件
                  </p>
                </div>
              </div>
            </div>
            <div class="dt-edit-modal-buttons">
              <button @click="dtCloseExport" class="dt-btn dt-btn-secondary">
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 题卡列表视图 -->
      <div v-if="currentView === 'cardList'" class="card-list-view">
        <div class="card-list-header">
          <div style="display: flex; align-items: center">
            <h3>题卡列表({{ questionCards.length }})&nbsp;</h3>
            <span class="filter-header" @click="toggleTestFilter">
              <span class="filter-arrow" :class="{ up: showTestFilterPanel }"
                >↓</span
              >
            </span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center">
            <!-- 新增：展开全部/收起全部按钮 -->
            <span
              v-if="!isAllCardGroupsExpanded"
              @click="expandAllCardGroups"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▶
            </span>
            <span
              v-if="isAllCardGroupsExpanded"
              @click="collapseAllCardGroups"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▼
            </span>
            <button
              @click="switchView('readingCard')"
              class="reading-btn"
              :disabled="questionCards.length === 0"
            >
              <i class="material-icons"></i>
              朗读
            </button>
            <button
              @click="printQuestionCards"
              class="print-cards-btn"
              :disabled="questionCards.length === 0"
            >
              <i class="material-icons"></i>
              打印
            </button>
          </div>
        </div>

        <!-- 新增测试筛选面板 -->
        <div class="test-filter-panel" v-if="showTestFilterPanel">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                用户：
                <input
                  v-model="testFilterForm.user"
                  type="text"
                  placeholder="筛选用户"
                />
                <!-- 用户候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueUsers?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueUsers"
                    :key="`user-${item}`"
                    @click="append2('user', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <div class="filter-item">
                科目：
                <input
                  v-model="testFilterForm.subject"
                  type="text"
                  placeholder="筛选科目"
                />
                <!-- 科目候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueSubjects?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubjects"
                    :key="`subject-${item}`"
                    @click="append2('subject', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="filter-item">
                包含关键字：
                <input
                  v-model="testFilterForm.keyword"
                  type="text"
                  placeholder="多个关键字用空格分开，搜索考点、题型、题目、答案、解析等"
                />
                <!-- 题型候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueQuestionType?.length">
                  <span class="candidate-label">如：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueQuestionType"
                    :key="`questionType-${item}`"
                    @click="append2('keyword', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>

            <div class="filter-row">
              <div>
                <input v-model="reverseList" type="checkbox" />
                题号倒序排列
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.excludeTodayTested"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                排除今日已测试题卡
              </div>
              <div class="filter-checkbox">
                <input v-model="testFilterForm.fav" type="checkbox" />
                仅包含收藏的题卡
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.specialIL"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                仅包含掌握程度为
                <input
                  v-model.lazy="testFilterForm.importantLevel"
                  @change="applyTestFilter"
                  type="number"
                  min="0"
                  style="width: 3em"
                />
                级的题卡
              </div>

              <div class="filter-checkbox">
                <input v-model="testFilterForm.lastWrong" type="checkbox" />
                仅包含测试中曾错过的题卡
              </div>
              <div class="filter-checkbox">
                <input v-model="testFilterForm.lessThan1" type="checkbox" />
                仅包含测试次数少于
                <input
                  v-model.lazy="testTimes"
                  type="number"
                  min="1"
                  style="width: 3em"
                />
                次的题卡
              </div>

              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.excludeFiveCorrect"
                  type="checkbox"
                />
                排除最后连续
                <input
                  v-model.lazy="correctDays"
                  type="number"
                  style="width: 3em"
                />
                次测试正确的题卡
              </div>
              <div class="filter-checkbox">
                排除关键字
                <input
                  v-model="excludedKeyWord"
                  type="text"
                  style="width: 10em"
                />
              </div>
              <div class="filter-checkbox">
                <input
                  v-model="testFilterForm.allowInterval"
                  @change="applyTestFilter"
                  type="checkbox"
                />
                测试间隔天数:
                <input
                  v-model.lazy="testInterval"
                  @change="applyTestFilter"
                  placeholder="各次测试间隔天数，以空格来分隔。"
                  type="text"
                />
              </div>
            </div>
            <div
              class="filter-actions"
              style="display: flex; justify-content: right"
            >
              <button @click="resetTestFilter" class="reset-btn">重置</button>
            </div>
          </div>
        </div>

        <div class="table-container">
          <!-- 分组显示 -->
          <div v-if="groupedQuestionCards.length > 0" class="grouped-cards">
            <!-- 遍历每个分组 -->
            <div
              v-for="group in groupedQuestionCards"
              :key="group.key"
              class="question-group"
            >
              <!-- 分组标题 -->
              <div
                class="group-header"
                style="display: block"
                @click="toggleCardGroup(group.key)"
              >
                <div
                  class="group-title"
                  style="display: flex; justify-content: space-between"
                >
                  <span>
                    <span
                      class="collapse-icon"
                      :class="{ rotated: !isGroupExpanded(group.key) }"
                      >▼</span
                    >
                    <span class="group-name">
                      {{ group.user }} - {{ group.subject }} -
                      {{ group.subClass }} - {{ group.questionType }}
                    </span>
                    <span class="group-count"
                      >（共 {{ group.cards.length }} 题）</span
                    >
                  </span>
                </div>
              </div>

              <!-- 分组内容（可折叠） -->
              <div v-if="isGroupExpanded(group.key)" class="group-content">
                <table class="card-table">
                  <thead>
                    <tr>
                      <th style="width: 4em">题号</th>
                      <!-- 剩余三列瓜分剩下空间，用百分比即可 -->
                      <th style="width: 2.5em">测试历史</th>
                      <th style="width: 45%">题目</th>
                      <th style="width: 45%">答案与解析</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="item in group.cards"
                      :key="item.id"
                      :class="{
                        expanded: expandedCardIds.has(item.id),
                      }"
                      @click="toggleCardExpand(item.id)"
                    >
                      <td class="text-center">
                        <div
                          style="
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 4px;
                          "
                        >
                          <span>{{ item.id }}</span>
                          <button
                            class="read-btn"
                            style="
                              background-color: transparent;
                              margin: 0;
                              padding: 2px;
                            "
                            @click="editError(item, 1)"
                          >
                            <i
                              style="color: blue; font-size: 1.2em"
                              class="material-icons"
                              >edit</i
                            >
                          </button>

                          <button
                            class="read-btn"
                            style="
                              background-color: transparent;
                              margin: 0;
                              padding: 2px;
                            "
                            @click="deleteError(item.id)"
                          >
                            <i
                              style="color: blue; font-size: 1.2em"
                              class="material-icons"
                              >delete</i
                            >
                          </button>

                          <button
                            style="
                              background: transparent;
                              color: black;
                              margin: 0;
                              padding: 2px;
                            "
                            v-if="
                              !String(item.reviewDate).split(',')[1] ||
                              Number(String(item.reviewDate).split(',')[1]) == 0
                            "
                            class="read-btn"
                            @click.stop="switchFav(item, 1)"
                          >
                            <i class="material-icons" style="font-size: 1em"
                              >star_border</i
                            >
                          </button>
                          <button
                            style="
                              background: transparent;
                              color: black;
                              margin: 0;
                              padding: 2px;
                            "
                            v-else
                            class="read-btn"
                            @click.stop="switchFav(item, 1)"
                          >
                            <i
                              class="material-icons"
                              style="font-size: 1em; color: blue"
                              >star</i
                            >
                          </button>
                          <span
                            style="
                              background: springgreen;
                              border-radius: 5px;
                              padding: 2px;
                              cursor: pointer;
                            "
                            @click.stop="addReview(item, 1)"
                            >{{ item.importantLevel }}级</span
                          >
                        </div>
                      </td>
                      <td class="text-center history-test">
                        <div
                          v-if="item.reviewResult && item.reviewResult.length"
                        >
                          <span
                            v-for="(result, idx) in item.reviewResult"
                            :key="idx"
                            class="test-result-icon"
                            :class="result === 1 ? 'correct' : 'wrong'"
                            :title="`第${idx + 1}次测试: ${
                              result === 1 ? '正确' : '错误'
                            }`"
                          >
                            {{ result === 1 ? "对" : "错" }}
                          </span>
                        </div>
                        <div v-else class="no-test">暂无测试</div>
                      </td>

                      <td class="answer-content">
                        <div
                          v-html="ex(item.question)"
                          @click="handleCardImageClick($event)"
                        ></div>
                      </td>
                      <td class="answer-content">
                        <div
                          @click="handleCardImageClick($event)"
                          :style="{
                            visibility: expandedCardIds.has(item.id)
                              ? 'visible'
                              : 'hidden',
                          }"
                        >
                          <div
                            v-html="ex(item.answer)"
                            @click="handleLinkClick"
                          ></div>

                          <div
                            v-if="
                              !(
                                item?.correctIdea.replace(/<[^>]*>/g, '').trim()
                                  .length == 0 &&
                                !/(img|video|audio)/i.test(
                                  item.correctIdea || ''
                                )
                              )
                            "
                          >
                            <hr
                              style="
                                border: none;
                                border-top: 1px solid black;
                                height: 0;
                              "
                            />
                            <div style="color: blue">解析：</div>
                            <div
                              v-html="ex(item.correctIdea)"
                              @click="handleLinkClick"
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-else class="empty-tip">暂无题卡数据，请先添加题卡。</div>
        </div>
      </div>

      <!-- 打印试卷视图 -->
      <div v-if="currentView === 'printPaper'" class="print-paper-view">
        <div class="print-header">
          <h3>试卷生成</h3>
          <div class="print-actions">
            <button @click="selectAllSimilar" class="print-btn">全选</button>
            <button @click="deselectAllSimilar" class="print-btn">
              全不选
            </button>
            <button @click="generatePaper" class="print-btn generate-btn">
              生成试卷
            </button>
          </div>
        </div>

        <div class="similar-list">
          <div v-if="filteredSimilarItems.length === 0" class="empty-tip">
            暂无举一反三题目
          </div>

          <div v-else>
            <div class="similar-count">
              共找到 {{ filteredSimilarItems.length }} 道举一反三题目
            </div>

            <div class="similar-items">
              <div
                v-for="(item, index) in filteredSimilarItems"
                :key="item.id"
                class="similar-item"
              >
                <label class="similar-checkbox">
                  <input
                    type="checkbox"
                    v-model="selectedSimilarIds"
                    :value="item.id"
                    class="checkbox-input"
                  />
                  <span class="checkmark"></span>
                  <span class="item-number">{{ index + 1 }}</span>
                </label>

                <div class="similar-content">
                  <div class="similar-meta">
                    <span class="subject-tag">{{ item.subject }}</span>
                    <span class="subclass-tag">{{ item.subClass }}</span>
                    <span class="question-type-tag">{{
                      item.questionType
                    }}</span>
                  </div>
                  <div
                    class="similar-actions"
                    style="
                      display: flex;
                      justify-content: flex-end;
                      margin-top: 10px;
                      gap: 8px;
                    "
                  >
                    <button class="read-btn" @click="editSimilarItem(item)">
                      编辑
                    </button>
                    <button
                      class="read-btn"
                      @click="deleteSimilarItem(item.id)"
                    >
                      删除
                    </button>
                  </div>

                  <div
                    class="similar-text"
                    v-if="item.similarText"
                    v-html="ex(item.similarText)"
                    @click="handleLinkClick"
                  ></div>

                  <div
                    v-if="item.similarImgUrls?.length"
                    class="similar-images"
                  ></div>

                  <div v-if="item.originalText" class="original-reference">
                    <strong>原题参考：</strong>
                    <span
                      v-html="ex(item.originalText)"
                      @click="handleLinkClick"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 试卷预览弹窗 -->
        <div class="modal" v-if="showPaperPreview">
          <div class="modal-content paper-preview-modal">
            <div class="preview-header">
              <h4>试卷预览</h4>
              <div class="preview-actions">
                <button @click="printPaper" class="print-btn">
                  打印试卷/导出PDF
                </button>
                <button @click="closePaperPreview" class="cancel-btn">
                  关闭
                </button>
              </div>
            </div>

            <div class="paper-content" id="paperContent">
              <div class="paper-header">
                <h2>错题举一反三练习卷</h2>
                <div class="paper-meta">
                  <p>
                    生成时间：{{ new Date().toLocaleDateString() }}
                    {{ new Date().toLocaleTimeString() }}
                  </p>
                  <p>题目数量：{{ selectedSimilarItems.length }} 题</p>
                </div>
              </div>

              <div class="questions-container">
                <div
                  v-for="(item, index) in selectedSimilarItems"
                  :key="item.id"
                  class="question-item"
                >
                  <div class="question-number">{{ index + 1 }}.</div>
                  <div class="question-content">
                    <div
                      v-if="item.similarText"
                      v-html="ex(item.similarText)"
                      @click="handleLinkClick"
                      class="question-text"
                    ></div>

                    <div
                      v-if="item.similarImgUrls?.length"
                      class="question-images"
                    ></div>

                    <div class="answer-space">
                      <p>解：</p>
                      <div class="answer-lines"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加错题视图 -->
      <div v-if="currentView === 'add'" class="add-view">
        <h3 v-if="isEditing">
          {{ showQuestionTypeSummaryModal ? "编辑题型总结" : "编辑题目" }}
          <span
            v-show="!showQuestionTypeSummaryModal"
            style="font-size: 0.8em; margin-left: 10px; color: #666"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;{{ formatDateWithWeek(form.addDate) }}
            <input
              type="date"
              v-model="selectedDate"
              style="margin-left: 8px; font-size: 0.9em"
            />
          </span>
        </h3>
        <h3 v-if="!isEditing" style="align-items: center">
          {{ showQuestionTypeSummaryModal ? "添加题型总结" : "添加题目" }}
          <span
            v-show="!showQuestionTypeSummaryModal"
            style="font-size: 0.8em; margin-left: 10px; color: #666"
          >
            &nbsp;&nbsp;&nbsp;&nbsp;{{ formatDateWithWeek(form.addDate) }}
            <input
              type="date"
              v-model="selectedDate"
              style="margin-left: 8px; font-size: 0.9em"
            />
          </span>
        </h3>
        <!-- 第一部分：题目分类 -->
        <div class="error-form">
          <!-- 第一部分：基本信息 -->
          <div class="form-section basic-info-section">
            <div style="display: flex; gap: 10px">
              <!-- 将原来的用户输入框修改为支持多值 -->
              <div
                v-if="!showQuestionTypeSummaryModal"
                class="form-group"
                style="width: 50%"
              >
                <label>用户：<span class="required">*</span></label>
                <input
                  v-model="form.user"
                  type="text"
                  placeholder="请输入用户名，多个用户用空格分开"
                  required
                />
                <!-- 用户候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueUsers?.length">
                  <span
                    @click="editHave(1)"
                    class="candidate-label"
                    style="
                      cursor: pointer;
                      color: blue;
                      text-decoration: underline;
                    "
                    >已有</span
                  >
                  <span
                    class="candidate-item"
                    v-for="item in uniqueUsers"
                    :key="`user-${item}`"
                    @click="appendCandidate('user', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>

              <!-- 科目 -->
              <div class="form-group" style="width: 50%">
                <label>科目：<span class="required">*</span> </label>

                <input
                  v-model="form.subject"
                  type="text"
                  placeholder="请输入科目（如：数学）"
                  required
                />

                <!-- 科目候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueSubjects?.length">
                  <span
                    @click="editHave(2)"
                    class="candidate-label"
                    style="
                      cursor: pointer;
                      color: blue;
                      text-decoration: underline;
                    "
                    >已有</span
                  >
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubjects"
                    :key="`subject-${item}`"
                    @click="appendCandidate('subject', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
            <div
              style="display: flex; gap: 10px; justify-content: space-between"
            >
              <!-- 考点（单值） -->
              <div class="form-group" style="width: 50%">
                <label>考点：<span class="required">*</span></label>
                <input
                  v-model.lazy="form.subClass"
                  type="text"
                  placeholder="请输入考点（如：函数）"
                  required
                />

                <div class="candidate-list" v-if="uniqueSubClasses?.length">
                  <span
                    @click="editHave(3)"
                    class="candidate-label"
                    style="
                      cursor: pointer;
                      color: blue;
                      text-decoration: underline;
                    "
                    >已有</span
                  >
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubClasses"
                    :key="`subClass-${item}`"
                    @click="appendCandidate('subClass', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <!-- 新增：题型总结 -->
              <div class="form-group" style="width: 50%">
                <label>题型：<span class="required">*</span> </label>
                <input
                  v-model.lazy="form.questionType"
                  type="text"
                  placeholder="请输入题型（如：求极值 等）"
                  required
                />
                <!-- 题型候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueQuestionTypes?.length">
                  <span
                    @click="editHave(4)"
                    class="candidate-label"
                    style="
                      cursor: pointer;
                      color: blue;
                      text-decoration: underline;
                    "
                    >已有</span
                  >
                  <span
                    class="candidate-item"
                    v-for="item in uniqueQuestionTypes"
                    :key="`questionType-${item}`"
                    @click="appendCandidate('questionType', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
            <div
              v-if="!isEditing && !showQuestionTypeSummaryModal"
              style="
                display: flex;
                gap: 1em;
                justify-content: right;
                padding-bottom: 1em;
              "
            >
              <span
                v-if="!batchAdd"
                style="
                  background: springgreen;
                  cursor: pointer;
                  padding: 3px;
                  border-radius: 2em;
                "
                @click="
                  batchQuestion = '';
                  batchAnswer = '';
                  batchAdd = !batchAdd;
                "
              >
                批量添加题目
              </span>
              <span
                style="
                  background: springgreen;
                  cursor: pointer;
                  padding: 3px;
                  border-radius: 2em;
                "
                @click="mergeItem"
              >
                汇总：在已有题目中添加
              </span>
            </div>
          </div>
        </div>

        <div v-if="batchAdd && currentView == 'add'">
          <p style="margin-bottom: 0; color: blue; font-weight: bold">
            题卡题目
          </p>
          <textarea
            style="width: 100%"
            v-model.lazy="batchQuestion"
            rows="5"
            placeholder="必填！每行一题。方便批量添加字词等题卡。"
          ></textarea>
          <p style="margin-bottom: 0; color: blue; font-weight: bold">答案</p>
          <textarea
            style="width: 100%"
            v-model.lazy="batchAnswer"
            rows="5"
            placeholder="选填！每行一题。需要与题卡题目行数一致。"
          ></textarea>
        </div>

        <div v-if="currentView == 'add' && !batchAdd">
          <!-- 题型总结编辑框（当题型不为空时显示） -->
          <div v-if="showQuestionTypeSummaryModal">
            <div class="form-section detailed-content-section">
              <!-- 原题照片（多图上传 + 文字描述） -->
              <div class="form-group">
                <label>题型总结 - {{ form.questionType }}</label>
                <div style="border: 1px solid #ccc">
                  <!-- 工具栏 -->
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor2"
                    mode="simple"
                    :defaultConfig="toolbarConfig"
                  />
                  <!-- 编辑器 -->
                  <Editor
                    style="height: 300px"
                    :editor="editor2"
                    mode="simple"
                    v-model.lazy="form.questionTypeSummary"
                    :defaultConfig="editorConfig2"
                    @onCreated="onCreated2"
                  />
                </div>
              </div>

              <!-- 题型总结图片上传 -->
              <div class="form-group">
                <div>
                  题型总结图片：
                  <span>
                    <input
                      type="file"
                      style="display: none"
                      accept="image/*"
                      @change="previewImg('questionType', $event)"
                      multiple
                      ref="questionType"
                    />
                    <button class="action" @click="uploadFile(1)">
                      <i
                        style="color: blue; font-size: 1.2em"
                        class="material-icons"
                        >attachment</i
                      >
                    </button>
                  </span>
                </div>

                <!-- 多图预览 + 删除按钮 -->
                <div
                  v-if="form.questionTypeImgUrls?.length"
                  class="imgs-preview"
                >
                  <div
                    class="img-preview-item"
                    v-for="(url, index) in form.questionTypeImgUrls"
                    :key="`questionType-${index}`"
                  >
                    <img
                      :src="url"
                      alt="题型总结图片预览"
                      @click="toCropOriginalImage(2, url, index)"
                    />
                    <span
                      class="img-delete-btn"
                      @click="deleteImg('questionType', index)"
                      >×</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="!showQuestionTypeSummaryModal">
            <!-- 第二部分：详细内容 -->
            <div class="form-section detailed-content-section">
              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('mistakeItem')"
                >
                  <label>原始错题</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.mistakeItem }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.mistakeItem">
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor4"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 300px"
                      :editor="editor4"
                      mode="simple"
                      v-model="form.originalText"
                      :defaultConfig="editorConfig4"
                      @onCreated="onCreated4"
                    />
                  </div>

                  <div>
                    错题截图：
                    <span>
                      <input
                        type="file"
                        style="display: none"
                        accept="image/*"
                        @change="previewImg('original', $event)"
                        multiple
                        ref="original"
                      />
                      <button class="action" @click="uploadFile(3)">
                        <i
                          style="color: blue; font-size: 1.2em"
                          class="material-icons"
                          >attachment</i
                        >
                      </button>
                    </span>
                  </div>

                  <!-- 多图预览 + 删除按钮 -->
                  <div v-if="form.originalImgUrls?.length" class="imgs-preview">
                    <div
                      class="img-preview-item"
                      v-for="(url, index) in form.originalImgUrls"
                      :key="`original-${index}`"
                    >
                      <img
                        :src="url"
                        alt="原题预览"
                        @click="toCropOriginalImage(0, url, index)"
                      />
                      <span
                        class="img-delete-btn"
                        @click="deleteImg('original', index)"
                        >×</span
                      >
                    </div>
                  </div>

                  <!-- 新增：拆分图片按钮 -->
                  <div
                    v-if="!isEditing && form.originalImgUrls.length > 1"
                    class="split-button-container"
                  >
                    <button
                      type="button"
                      @click="splitImagesToNewQuestions"
                      class="split-btn"
                      :disabled="isSplitting"
                    >
                      {{ isSplitting ? "正在拆分..." : "每张图片拆分成新题" }}
                    </button>
                    <p class="split-tip">
                      点击后将根据图片数量创建多道错题，共用相同的日期、用户和科目
                    </p>
                  </div>
                </div>
              </div>

              <!-- 题卡 -->
              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('questionCard')"
                >
                  <label>题卡题目</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.questionCard }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.questionCard">
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 300px"
                      :editor="editor"
                      mode="simple"
                      v-model="form.question"
                      :defaultConfig="editorConfig"
                      @onCreated="onCreated"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('answerAnalysis')"
                >
                  <label>答案</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.answerAnalysis }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.answerAnalysis">
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor6"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 300px"
                      :editor="editor6"
                      mode="simple"
                      v-model="form.answer"
                      :defaultConfig="editorConfig6"
                      @onCreated="onCreated6"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div class="section-header" @click="toggleSection('analysis')">
                  <label>解析</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.analysis }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.analysis">
                  <div style="border: 1px solid #ccc">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor7"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <Editor
                      style="height: 300px"
                      :editor="editor7"
                      mode="simple"
                      v-model="form.correctIdea"
                      :defaultConfig="editorConfig7"
                      @onCreated="onCreated7"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div class="section-header" @click="toggleSection('marks')">
                  <label>标识</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.marks }"
                  >
                    ▼
                  </span>
                </div>
                <div v-if="sections.marks">
                  <div>
                    <label> 标签：</label>
                    <input
                      v-model="form.errorType"
                      type="text"
                      placeholder="请输入标签（多值用空格分割）"
                    />
                    <!-- 标签候选列表（拆分多值后去重） -->
                    <div class="candidate-list" v-if="uniqueErrorTypes?.length">
                      <span class="candidate-label">已有：</span>
                      <span
                        class="candidate-item"
                        v-for="item in uniqueErrorTypes"
                        :key="`errorType-${item}`"
                        @click="appendCandidate1('errorType', item)"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>

                  <p style="display: flex; align-items: center">
                    <span> 收藏：</span>
                    <button
                      v-if="
                        !String(form.reviewDate).split(',')[1] ||
                        Number(String(form.reviewDate).split(',')[1]) == 0
                      "
                      style="background: transparent; color: black"
                      class="read-btn"
                      @click.stop="switchFav1(form)"
                    >
                      <i class="material-icons">star_border</i>
                    </button>
                    <button
                      v-else
                      style="background: transparent; color: black"
                      class="read-btn"
                      @click.stop="switchFav1(form)"
                    >
                      <i class="material-icons" style="color: blue">star</i>
                    </button>
                  </p>

                  <p style="display: flex; align-items: center">
                    <span> 掌握程度：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                      @click="changeLevel(0)"
                      style="color: yellow; font-size: 0.8em; cursor: pointer"
                      >&#10134;</span
                    >&nbsp;
                    <span
                      class="candidate-label"
                      style="color: darkblue; font-size: 1.2em"
                      >{{ form.importantLevel }}</span
                    >&nbsp;
                    <span
                      @click="changeLevel(1)"
                      style="color: yellow; font-size: 0.8em; cursor: pointer"
                      >&#10133;</span
                    >
                  </p>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('questionTypeSum')"
                >
                  <label>
                    题型总结
                    {{ form.questionType ? "- " + form.questionType : "" }}
                  </label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.questionTypeSum }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.questionTypeSum">
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor2"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 300px"
                      :editor="editor2"
                      mode="simple"
                      v-model="form.questionTypeSummary"
                      :defaultConfig="editorConfig2"
                      @onCreated="onCreated2"
                    />
                  </div>
                  <div>
                    题型总结图片：
                    <span>
                      <input
                        type="file"
                        style="display: none"
                        accept="image/*"
                        @change="previewImg('questionType', $event)"
                        multiple
                        ref="questionType"
                      />
                      <button class="action" @click="uploadFile(1)">
                        <i
                          style="color: blue; font-size: 1.2em"
                          class="material-icons"
                          >attachment</i
                        >
                      </button>
                    </span>
                  </div>

                  <!-- 多图预览 + 删除按钮 -->
                  <div
                    v-if="form.questionTypeImgUrls?.length"
                    class="imgs-preview"
                  >
                    <div
                      class="img-preview-item"
                      v-for="(url, index) in form.questionTypeImgUrls"
                      :key="`questionType-${index}`"
                    >
                      <img
                        :src="url"
                        alt="题型总结图片预览"
                        @click="toCropOriginalImage(2, url, index)"
                      />
                      <span
                        class="img-delete-btn"
                        @click="deleteImg('questionType', index)"
                        >×</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('cheatsheet')"
                >
                  <label>
                    CheatSheet
                    <template v-if="form.user && form.subject">
                      - {{ form.user }} {{ form.subject }}</template
                    >
                  </label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.cheatsheet }"
                  >
                    ▼
                  </span>
                </div>

                <div v-if="sections.cheatsheet">
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor1"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 188px"
                      :editor="editor1"
                      mode="simple"
                      v-model.lazy="form.cheatSheet"
                      :defaultConfig="editorConfig1"
                      @onCreated="onCreated1"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('improveMethod')"
                >
                  <label>日积月累任务</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.improveMethod }"
                  >
                    ▼
                  </span>
                </div>
                <div v-if="sections.improveMethod">
                  <textarea
                    :disabled="!(form.subject?.trim() && form.subClass?.trim())"
                    v-model="form.improveMethod"
                    rows="3"
                    placeholder="添加日积月累任务以提高此考点掌握程度。如：每周默写语文课后生词；每日背诵10个英语单词；每日练习一篇完型填空；平日积累语文写作好词好句等。"
                  ></textarea>
                </div>
              </div>
              <!-- 举一反三（可折叠） 
              <div class="form-group collapsible-section">
                <div class="section-header" @click="toggleSection('similar')">
                  <label>举一反三</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.similar }"
                  >
                    ▼
                  </span>
                </div>
                <div   v-if="sections.similar">
                  <div style="border: 1px solid #ccc">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor5"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <Editor
                      style="height: 300px"
                      :editor="editor5"
                      mode="simple"
                      v-model="form.similarText"
                      :defaultConfig="editorConfig5"
                      @onCreated="onCreated5"
                    />
                  </div>

                  <div>
                    举一反三图片：
                    <span>
                      <input
                        type="file"
                        style="display: none"
                        accept="image/*"
                        @change="previewImg('similar', $event)"
                        multiple
                        ref="similar"
                      />
                      <button class="action" @click="uploadFile(5)">
                        <i
                          style="color: blue; font-size: 1.2em"
                          class="material-icons"
                          >attachment</i
                        >
                      </button>
                    </span>
                  </div>
                  <div v-if="form.similarImgUrls?.length" class="imgs-preview">
                    <div
                      class="img-preview-item"
                      v-for="(url, index) in form.similarImgUrls"
                      :key="`similar-${index}`"
                    >
                      <span
                        class="img-delete-btn"
                        @click="deleteImg('similar', index)"
                        >×</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              -->
              <!-- 备用（可折叠） -->
              <div class="form-group collapsible-section">
                <div class="section-header" @click="toggleSection('trap')">
                  <label>备用</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.trap }"
                  >
                    ▼
                  </span>
                </div>
                <div v-if="sections.trap">
                  <input
                    v-model="form.trap"
                    type="text"
                    placeholder="请输入备用类型"
                  />
                  <!-- 备用候选列表（去重） -->
                  <div class="candidate-list" v-if="uniqueTraps?.length">
                    <span class="candidate-label">已有：</span>
                    <span
                      class="candidate-item"
                      v-for="item in uniqueTraps"
                      :key="`trap-${item}`"
                      @click="appendCandidate('trap', item)"
                    >
                      {{ item }}
                    </span>
                  </div>

                  <!-- 备用详解编辑框（当备用不为空时显示） -->
                  <div class="form-group" v-if="form.trap">
                    <label>备用详解：</label>
                    <textarea v-model="form.trapDetail" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 裁剪界面 -->
      <div class="image-viewer-modal" v-if="imgSrc">
        <!-- 图片预览区域 -->
        <div>
          <img ref="image" :src="imgSrc" alt="Image to crop" />
        </div>

        <!-- 操作按钮 -->
        <div style="margin: 8px; display: flex; gap: 10px; align-items: center">
          <span style="color: wheat">角度</span>
          <input
            v-model.number="angle"
            type="number"
            style="width: 3em"
            placeholder="90"
            min="1"
          />
          <button @click="rotate(angle)">旋转</button>
          <button @click="reset">重置</button>
          <button @click="closeCrop" class="zoom-btn">取消</button>
          <button @click="crop" style="background: wheat">裁剪</button>
        </div>
        <div v-if="fromPic == 0" class="checkbox-label" style="color: wheat">
          <input v-model="cropAsNewImage" type="checkbox" />
          截图作为新图片添加（不替换原图）。若当前图片为完整试卷，可反复剪裁出多道错题图片，之后点击“每张图片拆分为新题”，可批量添加为新题。然后可在错题列表中编辑每道题的详细信息。
        </div>
        <div v-if="fromPic != 0" class="checkbox-label" style="color: wheat">
          <input v-model="cropAsNewImage" type="checkbox" />
          截图作为新图片添加（不替换原图）。
        </div>
      </div>

      <div
        v-if="currentView === 'readingCard'"
        class="reading-status-container"
      >
        <!-- 主体内容区域 -->
        <div class="reading-main-content">
          <div v-if="currentReadingCard" class="reading-progress">
            <strong>正在朗读：</strong>
            {{ currentReadingCardIndex + 1 }} / {{ questionCards.length }}
            <span>- 题号：{{ currentReadingCard.id }}</span>
          </div>

          <div
            class="reading-content-wrapper"
            :class="{ 'waiting-for-click': isWaitingForClick }"
          >
            <div class="reading-text-content">{{ currentReadingCardText }}</div>

            <div v-if="isWaitingForClick" class="waiting-click-hint">
              📢 点击屏幕任意位置继续...
            </div>
          </div>
        </div>

        <!-- 控制按钮区域 -->
        <p class="auto-pause-checkbox">
          <input
            type="checkbox"
            v-model="autoPauseAfterReading"
            :disabled="questionCards.length === 0"
          />
          朗读题目后自动暂停，点击后继续。
        </p>
        <div class="reading-controls-container">
          <div class="reading-controls">
            <button @click="lastCurrentCard" class="control-btn">上一题</button>
          </div>
          <button @click="toggleReadingCards" class="primary-btn">
            {{ isReadingCard ? "停止朗读" : "开始朗读" }}
          </button>

          <!-- 朗读控制按钮 -->
          <div class="reading-controls">
            <button @click="skipCurrentCard" class="control-btn">下一题</button>
          </div>
        </div>
        <div style="margin-top: 1em">
          <button
            v-if="
              !String(currentReadingCard.reviewDate).split(',')[1] ||
              Number(String(currentReadingCard.reviewDate).split(',')[1]) == 0
            "
            style="background: transparent; color: black"
            class="read-btn"
            @click.stop="switchFav(currentReadingCard, 1)"
          >
            <i class="material-icons">star_border</i>
          </button>
          <button
            v-if="
              String(currentReadingCard.reviewDate).split(',')[1] &&
              Number(String(currentReadingCard.reviewDate).split(',')[1]) == 1
            "
            style="background: transparent; color: black"
            class="read-btn"
            @click.stop="switchFav(currentReadingCard, 1)"
          >
            <i class="material-icons" style="color: blue">star</i>
          </button>
        </div>
      </div>

      <!-- 错题列表视图 -->
      <div
        v-if="currentView === 'list'"
        class="list-view"
        ref="listViewRef"
        @click="stopReading()"
        style="
          white-space: pre-wrap; /* 关键：保留换行 + 自动换行 */
          word-wrap: break-word;
        "
      >
        <div class="list-view-header">
          <div style="display: flex; align-items: center; gap: 8px">
            <h3 style="margin: 0">错题列表</h3>

            （{{ showMistaker.length }}）
            <span class="filter-header" @click="toggleFilter">
              <span class="filter-arrow" :class="{ up: isFilterOpen }">↓</span>
            </span>
          </div>
          <div class="view-mode-controls">
            <span
              v-if="!isAllExpanded && listViewMode === 'group'"
              @click="toggleExpandAll"
              style="background: white; cursor: pointer"
              >▶</span
            >
            <span
              v-if="isAllExpanded && listViewMode === 'group'"
              @click="toggleExpandAll"
              style="background: white; cursor: pointer"
              >▼</span
            >

            <!-- 显示模式切换按钮 -->
            <div class="view-mode-buttons">
              <button
                @click="switchListView"
                :class="{ active: listViewMode === 'tree' }"
                class="view-mode-btn"
                title="切换列表模式"
              >
                <i class="material-icons">account_tree</i>
              </button>
            </div>
            <div>
              <button
                @click="printCurrentTreeList"
                class="print-btn1"
                :disabled="currentTreeMistaker.length === 0"
              >
                <i class="material-icons">print</i>
              </button>
            </div>
          </div>
        </div>

        <!-- 筛选区域保持不变 -->
        <div class="test-filter-panel" v-if="isFilterOpen">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                用户：
                <input
                  v-model.lazy="filterForm.user"
                  type="text"
                  placeholder="请输入用户名"
                />
                <!-- 用户候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueUsers?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueUsers"
                    :key="`user-${item}`"
                    @click="append1('user', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="filter-item">
                科目：
                <input
                  v-model.lazy="filterForm.subject"
                  type="text"
                  placeholder="请输入科目"
                />
                <!-- 科目候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueSubjects?.length">
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubjects"
                    :key="`subject-${item}`"
                    @click="append1('subject', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="filter-item">
                包含关键字：
                <input
                  v-model="filterForm.keyword"
                  type="text"
                  placeholder="多个关键字用空格分开，搜索考点、题型、题目、答案、解析等"
                />
                <!-- 题型候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueQuestionType?.length">
                  <span class="candidate-label">如：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueQuestionType"
                    :key="`questionType-${item}`"
                    @click="append1('keyword', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
            <div class="filter-row">
              <div>
                <input v-model="reverseList" type="checkbox" />
                题号倒序排列
              </div>
              <div class="filter-checkbox">
                <input v-model="filterForm.hasCards" type="checkbox" />
                显示包含有题卡的题目(即显示所有题目)
              </div>
              <div class="filter-checkbox">
                <input v-model="filterForm.fav" type="checkbox" />
                仅包含收藏的错题
              </div>
              <div class="filter-checkbox">
                <input v-model="filterForm.specialIL" type="checkbox" />
                仅包含掌握程度为
                <input
                  v-model.lazy="filterForm.importantLevel"
                  type="number"
                  min="0"
                  style="width: 3em"
                />
                级的题目
              </div>

              <div class="filter-checkbox">
                排除关键字
                <input
                  v-model="excludedKeyWord"
                  type="text"
                  style="width: 10em"
                />
              </div>
            </div>
            <div class="filter-row">
              <div class="filter-item">
                添加日期：
                <input
                  v-model="filterForm.startDate"
                  type="date"
                  placeholder="开始日期"
                />
              </div>
              <div class="filter-item">
                <span class="date-sep">至</span>
                <input
                  v-model="filterForm.endDate"
                  type="date"
                  placeholder="结束日期"
                />
              </div>
              <div class="filter-item">
                题号：
                <input
                  v-model.number="filterForm.id"
                  type="number"
                  placeholder="请输入题号"
                  min="1"
                />
              </div>
            </div>
            <div
              class="filter-actions"
              style="display: flex; justify-content: right"
            >
              <button @click="resetFilter" class="reset-btn">重置</button>
            </div>
          </div>
        </div>
        <div
          v-if="filteredMistaker.length == 0"
          style="text-align: center; margin-top: 3em"
        >
          无符合筛选条件的错题。
        </div>
        <!-- 树形导航模式 -->
        <div v-if="listViewMode === 'tree'" class="tree-nav-view">
          <div class="tree-nav-container">
            <!-- 左侧树形导航 -->
            <div class="tree-nav-sidebar">
              <div class="tree-nav-header">
                <h4>导航</h4>
                <div class="tree-nav-buttons">
                  <button
                    @click="expandAllTreeNodes"
                    class="tree-expand-btn"
                    :disabled="isAllTreeNodesExpanded"
                  >
                    全部展开
                  </button>
                  <button
                    @click="collapseAllTreeNodes"
                    class="tree-collapse-btn"
                    :disabled="isAllTreeNodesCollapsed"
                  >
                    全部收起
                  </button>
                </div>
              </div>
              <div class="tree-nav-content">
                <!-- 全部错题根节点 -->
                <div class="tree-node">
                  <div
                    class="tree-item root"
                    :class="{ active: !selectedTreePath }"
                    @click="selectTreeNode('')"
                  >
                    <span class="tree-icon">📚</span>
                    <span class="tree-label">全部错题</span>
                    <span class="tree-count">({{ showMistaker.length }})</span>
                  </div>
                </div>

                <!-- 科目节点 -->
                <div
                  v-for="subject in treeNavigationData"
                  :key="subject.name"
                  class="tree-node"
                >
                  <div
                    class="tree-item subject"
                    :class="{
                      active: selectedTreePath === subject.name,
                      expanded: isTreeNodeExpanded(subject.name),
                    }"
                    @click="toggleTreeNode(subject.name, 'subject')"
                  >
                    <span
                      class="tree-expand-icon"
                      @click.stop="toggleTreeNode(subject.name, 'subject')"
                    >
                      {{ isTreeNodeExpanded(subject.name) ? "▼" : "▶" }}
                    </span>
                    <span class="tree-icon">📖</span>
                    <span class="tree-label">{{ subject.name }}</span>
                    <span class="tree-count">({{ subject.count }})</span>
                  </div>

                  <!-- 考点子节点 -->
                  <div
                    v-if="isTreeNodeExpanded(subject.name)"
                    class="tree-children"
                  >
                    <div
                      v-for="subClass in subject.children"
                      :key="subClass.name"
                      class="tree-node"
                    >
                      <div
                        class="tree-item subclass"
                        :class="{
                          active:
                            selectedTreePath ===
                            `${subject.name}|${subClass.name}`,
                          expanded: isTreeNodeExpanded(
                            `${subject.name}|${subClass.name}`
                          ),
                        }"
                        @click="
                          toggleTreeNode(
                            `${subject.name}|${subClass.name}`,
                            'subClass'
                          )
                        "
                      >
                        <span
                          class="tree-expand-icon"
                          @click.stop="
                            toggleTreeNode(
                              `${subject.name}|${subClass.name}`,
                              'subClass'
                            )
                          "
                        >
                          {{
                            isTreeNodeExpanded(
                              `${subject.name}|${subClass.name}`
                            )
                              ? "▼"
                              : "▶"
                          }}
                        </span>
                        <span class="tree-icon">📋</span>
                        <span class="tree-label">{{ subClass.name }}</span>
                        <span class="tree-count">({{ subClass.count }})</span>
                      </div>

                      <!-- 题型子节点 -->
                      <div
                        v-if="
                          isTreeNodeExpanded(`${subject.name}|${subClass.name}`)
                        "
                        class="tree-children"
                      >
                        <div
                          v-for="questionType in subClass.children"
                          :key="questionType.path"
                          class="tree-node"
                        >
                          <div
                            class="tree-item questiontype"
                            :class="{
                              active: selectedTreePath === questionType.path,
                            }"
                            @click="selectTreeNode(questionType.path)"
                          >
                            <span class="tree-icon">🔍</span>
                            <span class="tree-label">{{
                              questionType.name
                            }}</span>
                            <span class="tree-count"
                              >({{ questionType.count }})</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧错题列表 -->
            <div class="tree-content-main">
              <div class="tree-content-header">
                <h4>{{ currentTreeTitle }}</h4>
                <div class="tree-content-info">
                  共 {{ currentTreeMistaker.length }} 题
                </div>
              </div>

              <div class="error-list">
                <div
                  class="error-item"
                  v-for="(item, index) in currentTreeMistaker"
                  :key="item.id"
                  :data-id="item.id"
                >
                  <!-- 复用现有的错题项显示代码 -->
                  <div class="error-header">
                    <span
                      >{{ index + 1 }}/{{ currentTreeMistaker.length }}</span
                    >
                    <span class="error-id">题号：{{ item.id }}</span>
                    <span>
                      <strong>{{ item.user }}</strong
                      >&nbsp;-&nbsp;{{ item.subject }}&nbsp;-&nbsp;{{
                        item.subClass
                      }}&nbsp;-&nbsp;{{ item.questionType }}
                    </span>
                    <span v-if="!isMobile" class="error-date">{{
                      formatDateWithWeek(item.addDate)
                    }}</span>
                  </div>

                  <div class="error-content">
                    <div>
                      <div
                        style="
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                        "
                      >
                        <div>
                          <strong
                            style="color: blue"
                            @dblclick="openQuestionEditor(item.id, 15)"
                            >原始错题：</strong
                          >
                          <span
                            v-if="
                              item?.originalText.replace(/<[^>]*>/g, '').trim()
                                .length == 0 &&
                              !/(img|video|audio)/i.test(
                                item.originalText || ''
                              )
                            "
                            >无</span
                          >
                        </div>
                        <div v-if="!isMobile" class="error-actions">
                          <button
                            style="
                              background: transparent;
                              color: black;
                              align-items: center;
                              justify-content: center;
                              gap: 2px;
                            "
                            v-if="
                              !String(item.reviewDate).split(',')[1] ||
                              Number(String(item.reviewDate).split(',')[1]) == 0
                            "
                            class="read-btn"
                            @click="switchFav(item)"
                          >
                            <i
                              class="material-icons"
                              style="
                                font-size: 1.88em;
                                color: blue;
                                vertical-align: middle;
                              "
                              >star_border</i
                            >收藏
                          </button>
                          <button
                            style="
                              background: transparent;
                              color: black;
                              align-items: center;
                              justify-content: center;
                              gap: 2px;
                            "
                            v-if="
                              String(item.reviewDate).split(',')[1] &&
                              Number(String(item.reviewDate).split(',')[1]) == 1
                            "
                            class="read-btn"
                            @click="switchFav(item)"
                          >
                            <i
                              class="material-icons"
                              style="
                                font-size: 1.88em;
                                color: blue;
                                vertical-align: middle;
                              "
                              >star</i
                            >收藏
                          </button>
                          <span
                            class="read-btn"
                            @click="addReview(item)"
                            style="background-color: blue"
                          >
                            掌握程度: {{ item.importantLevel }}级
                          </span>
                          <button class="read-btn" @click="editError(item, 2)">
                            编辑
                          </button>
                          <button
                            class="read-btn"
                            @click="deleteError(item.id)"
                          >
                            删除
                          </button>
                          <button
                            class="read-btn"
                            @click.stop="startReading(index)"
                          >
                            朗读
                          </button>
                        </div>
                      </div>
                      <div
                        v-if="
                          !(
                            item?.originalText.replace(/<[^>]*>/g, '').trim()
                              .length == 0 &&
                            !/(img|video|audio)/i.test(item.originalText || '')
                          )
                        "
                        class="v-html-content"
                        v-html="ex(item.originalText)"
                        @click="handleLinkClick"
                        style="
                          min-height: 60px;
                          padding: 0 8px;
                          background: white;
                          border: 1px solid lightblue;
                        "
                        :style="{ margin: isMobile ? '0.5em 0' : '0' }"
                        @dblclick="openQuestionEditor(item.id, 15)"
                      ></div>
                      <br />
                      <div
                        class="small-imgs-wrap"
                        v-if="item.originalImgUrls?.length"
                      >
                        <img
                          v-for="(url, idx) in item.originalImgUrls"
                          :key="`item-original-${item.id}-${idx}`"
                          :src="url"
                          alt="原题"
                          class="small-img"
                          @click="openImageViewer(url)"
                        />
                      </div>
                    </div>

                    <!-- 错题解析 -->
                    <div
                      v-if="item.errorReason && item.errorReason.trim()"
                      style="margin: 16px 0"
                    >
                      <strong style="color: blue">错题解析：</strong>
                      <div
                        class="v-html-content"
                        v-html="ex(item.errorReason)"
                        @click="handleLinkClick"
                        style="
                          min-height: 60px;
                          padding: 0 8px;
                          margin: 0.5em 0;
                          background: white;
                          border: 1px solid lightblue;
                        "
                      ></div>
                      <!-- 新增：错题解析图片预览 -->
                      <div
                        v-if="item.errorReasonImgUrls?.length"
                        class="small-imgs-wrap"
                      >
                        <img
                          v-for="(url, idx) in item.errorReasonImgUrls"
                          :key="`item-errorReason-${item.id}-${idx}`"
                          :src="url"
                          alt="原题"
                          class="small-img"
                          @click="openImageViewer(url)"
                        />
                      </div>
                    </div>

                    <!-- 标签 -->
                    <p
                      v-if="item.errorType && item.errorType.trim()"
                      style="margin-bottom: 1em"
                    >
                      <strong style="color: blue">标签：</strong
                      >{{ item.errorType }}
                    </p>

                    <!-- 可编辑题卡题目 -->
                    <div @dblclick="openQuestionEditor(item.id, 14)">
                      <strong style="color: blue">题卡题目：</strong>
                      <div>
                        <div
                          v-html="
                            !(
                              item.question.replace(/<[^>]*>/g, '').trim()
                                .length == 0 &&
                              !/(img|video|audio)/i.test(item.question || '')
                            )
                              ? ex(item.question)
                              : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                          "
                          @click="handleLinkClick"
                          style="
                            min-height: 55px;
                            padding: 0 8px;
                            margin: 0.25em 0 1em 0;
                            border: 1px solid lightblue;
                          "
                          :style="{
                            background: !(
                              item.question.replace(/<[^>]*>/g, '').trim()
                                .length == 0 &&
                              !/(img|video|audio)/i.test(item.question || '')
                            )
                              ? 'white'
                              : '#d4edda',
                          }"
                        ></div>
                      </div>
                    </div>

                    <!-- 可编辑答案 -->
                    <p
                      v-if="!showAllAnswer"
                      @click="toggleFilter1(item.id)"
                      style="display: flex; cursor: pointer"
                    >
                      <strong style="color: green">答案：</strong>
                      <span class="filter-header">
                        <span
                          class="filter-arrow"
                          :class="{ up: isAnswerOpen[item.id] == 1 }"
                          >↓</span
                        >
                      </span>
                    </p>
                    <p v-else>
                      <strong style="color: green">答案：</strong>
                    </p>
                    <div v-if="isAnswerOpen[item.id] == 1 || showAllAnswer">
                      <div @dblclick="openQuestionEditor(item.id, 12)">
                        <div>
                          <div
                            v-html="
                              !(
                                item.answer.replace(/<[^>]*>/g, '').trim()
                                  .length == 0 &&
                                !/(img|video|audio)/i.test(item.answer || '')
                              )
                                ? ex(item.answer)
                                : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                            "
                            @click="handleLinkClick"
                            style="
                              min-height: 55px;
                              padding: 0 8px;
                              margin: 0.25em 0 1em 0;
                              border: 1px solid lightblue;
                            "
                            :style="{
                              background: !(
                                item.answer.replace(/<[^>]*>/g, '').trim()
                                  .length == 0 &&
                                !/(img|video|audio)/i.test(item.answer || '')
                              )
                                ? 'white'
                                : '#d4edda',
                            }"
                          ></div>
                        </div>
                      </div>

                      <!-- 可编辑解析 -->
                      <div @dblclick="openQuestionEditor(item.id, 13)">
                        <strong style="color: green">解析：</strong>
                        <div>
                          <div
                            v-html="
                              !(
                                item.correctIdea.replace(/<[^>]*>/g, '').trim()
                                  .length == 0 &&
                                !/(img|video|audio)/i.test(
                                  item.correctIdea || ''
                                )
                              )
                                ? ex(item.correctIdea)
                                : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                            "
                            @click="handleLinkClick"
                            style="
                              min-height: 55px;
                              padding: 0 8px;
                              margin: 0.25em 0;
                              border: 1px solid lightblue;
                            "
                            :style="{
                              background: !(
                                item.correctIdea.replace(/<[^>]*>/g, '').trim()
                                  .length == 0 &&
                                !/(img|video|audio)/i.test(
                                  item.correctIdea || ''
                                )
                              )
                                ? 'white'
                                : '#d4edda',
                            }"
                          ></div>
                        </div>
                      </div>

                      <!-- 备用 -->
                      <p v-if="item.trap && item.trap.trim()">
                        <strong style="color: blue">备用：</strong
                        >{{ item.trap }}
                        <span
                          v-if="item.trapDetail && item.trapDetail.trim()"
                          style="color: #666; margin-left: 10px"
                        >
                          | 详解：{{ item.trapDetail }}
                        </span>
                      </p>

                      <div style="margin: 16px 0">
                        <div style="align-items: center; display: flex">
                          <strong style="color: green">题型总结：</strong>
                          <button
                            class="read-btn"
                            style="font-size: 10px"
                            @click="switchQ(index)"
                          >
                            {{ showQ[index] == 1 ? "关闭" : "查看" }}
                          </button>
                        </div>
                        <div
                          v-if="showQ[index] == 1"
                          class="v-html-content"
                          v-html="
                            ex(
                              finalQuestionTypeSummary.find(
                                (i) =>
                                  i.subject === item.subject?.trim() &&
                                  i.subClass === item.subClass?.trim() &&
                                  i.questionType === item.questionType?.trim()
                              )?.questionTypeSummary || '无'
                            )
                          "
                          @click="handleLinkClick"
                        ></div>
                        <div class="small-imgs-wrap" v-if="showQ[index] == 1">
                          <img
                            v-for="(url, idx) in finalQuestionTypeSummary.find(
                              (i) =>
                                i.subject === item.subject?.trim() &&
                                i.subClass === item.subClass?.trim() &&
                                i.questionType === item.questionType?.trim()
                            )?.questionTypeImgUrls || []"
                            :key="idx"
                            :src="url"
                            alt="原题"
                            class="small-img"
                            @click="openImageViewer(url)"
                          />
                        </div>
                      </div>

                      <!-- 完善方法 -->
                      <p v-if="item.improveMethod && item.improveMethod.trim()">
                        <strong style="color: blue">日积月累：</strong
                        >{{ item.improveMethod }}
                      </p>
                      <!-- 举一反三 -->
                      <div
                        v-if="
                          (item.similarText && item.similarText.trim()) ||
                          (item.similarImgUrls &&
                            item.similarImgUrls.length > 0)
                        "
                      >
                        <strong style="color: blue">举一反三：</strong>
                        <div
                          class="v-html-content"
                          v-html="ex(item.similarText)"
                          @click="handleLinkClick"
                        ></div>
                        <br />
                        <template
                          v-if="
                            !item.similarImgUrls ||
                            item.similarImgUrls.length === 0
                          "
                        >
                        </template>
                        <template v-else>
                          <div class="small-imgs-wrap">
                            <img
                              v-for="(url, idx) in item.similarImgUrls"
                              :key="`item-similar-${item.id}-${idx}`"
                              :src="url"
                              alt="举一反三"
                              class="small-img"
                              @click="openImageViewer(url)"
                            />
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="currentTreeMistaker.length === 0" class="empty-tip">
                  该分类下暂无错题
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 原有的平铺模式 -->
        <div v-if="listViewMode === 'flat'" class="error-list">
          <div
            class="error-item"
            v-for="(item, index) in showMistaker"
            :key="item.id"
            :data-id="item.id"
          >
            <div class="error-header">
              <span>{{ index + 1 }}/{{ showMistaker.length }}</span>
              <span class="error-id">题号：{{ item.id }}</span>
              <span>
                <strong>{{ item.user }}</strong
                >&nbsp;-&nbsp;{{ item.subject }}&nbsp;-&nbsp;{{
                  item.subClass
                }}&nbsp;-&nbsp;{{ item.questionType }}
              </span>
              <span v-if="!isMobile" class="error-date">{{
                formatDateWithWeek(item.addDate)
              }}</span>
            </div>

            <div class="error-content">
              <div>
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                  "
                >
                  <div>
                    <strong
                      style="color: blue"
                      @dblclick="openQuestionEditor(item.id, 15)"
                      >原始错题：</strong
                    >
                    <span
                      v-if="
                        item?.originalText.replace(/<[^>]*>/g, '').trim()
                          .length == 0 &&
                        !/(img|video|audio)/i.test(item.originalText || '')
                      "
                      >无</span
                    >
                  </div>
                  <div v-if="!isMobile" class="error-actions">
                    <button
                      style="
                        background: transparent;
                        color: black;
                        align-items: center;
                        justify-content: center;
                        gap: 2px;
                      "
                      v-if="
                        !String(item.reviewDate).split(',')[1] ||
                        Number(String(item.reviewDate).split(',')[1]) == 0
                      "
                      class="read-btn"
                      @click="switchFav(item)"
                    >
                      <i
                        class="material-icons"
                        style="
                          font-size: 1.88em;
                          color: blue;
                          vertical-align: middle;
                        "
                        >star_border</i
                      >收藏
                    </button>
                    <button
                      style="
                        background: transparent;
                        color: black;
                        align-items: center;
                        justify-content: center;
                        gap: 2px;
                      "
                      v-if="
                        String(item.reviewDate).split(',')[1] &&
                        Number(String(item.reviewDate).split(',')[1]) == 1
                      "
                      class="read-btn"
                      @click="switchFav(item)"
                    >
                      <i
                        class="material-icons"
                        style="
                          font-size: 1.88em;
                          color: blue;
                          vertical-align: middle;
                        "
                        >star</i
                      >收藏
                    </button>
                    <span
                      class="read-btn"
                      @click="addReview(item)"
                      style="background-color: blue"
                    >
                      掌握程度: {{ item.importantLevel }}级
                    </span>
                    <button class="read-btn" @click="editError(item, 2)">
                      编辑
                    </button>
                    <button class="read-btn" @click="deleteError(item.id)">
                      删除
                    </button>
                    <button class="read-btn" @click.stop="startReading(index)">
                      朗读
                    </button>
                  </div>
                </div>
                <div
                  v-if="
                    !(
                      item?.originalText.replace(/<[^>]*>/g, '').trim()
                        .length == 0 &&
                      !/(img|video|audio)/i.test(item.originalText || '')
                    )
                  "
                  class="v-html-content"
                  v-html="ex(item.originalText)"
                  @click="handleLinkClick"
                  style="
                    min-height: 60px;
                    padding: 0 8px;
                    background: white;
                    border: 1px solid lightblue;
                  "
                  :style="{ margin: isMobile ? '0.5em 0' : '0' }"
                  @dblclick="openQuestionEditor(item.id, 15)"
                ></div>
                <br />
                <div
                  class="small-imgs-wrap"
                  v-if="item.originalImgUrls?.length"
                >
                  <img
                    v-for="(url, idx) in item.originalImgUrls"
                    :key="`item-original-${item.id}-${idx}`"
                    :src="url"
                    alt="原题"
                    class="small-img"
                    @click="openImageViewer(url)"
                  />
                </div>
              </div>

              <!-- 错题解析 -->
              <div
                v-if="item.errorReason && item.errorReason.trim()"
                style="margin: 16px 0"
              >
                <strong style="color: blue">错题解析：</strong>
                <div
                  class="v-html-content"
                  v-html="ex(item.errorReason)"
                  @click="handleLinkClick"
                  style="
                    min-height: 60px;
                    padding: 0 8px;
                    margin: 0.5em 0;
                    background: white;
                    border: 1px solid lightblue;
                  "
                ></div>
                <!-- 新增：错题解析图片预览 -->
                <div
                  v-if="item.errorReasonImgUrls?.length"
                  class="small-imgs-wrap"
                >
                  <img
                    v-for="(url, idx) in item.errorReasonImgUrls"
                    :key="`item-errorReason-${item.id}-${idx}`"
                    :src="url"
                    alt="原题"
                    class="small-img"
                    @click="openImageViewer(url)"
                  />
                </div>
              </div>

              <!-- 标签 -->
              <p
                v-if="item.errorType && item.errorType.trim()"
                style="margin-bottom: 1em"
              >
                <strong style="color: blue">标签：</strong>{{ item.errorType }}
              </p>

              <!-- 备用 -->
              <p v-if="item.trap && item.trap.trim()">
                <strong style="color: blue">备用：</strong>{{ item.trap }}
                <span
                  v-if="item.trapDetail && item.trapDetail.trim()"
                  style="color: #666; margin-left: 10px"
                >
                  | 详解：{{ item.trapDetail }}
                </span>
              </p>

              <!-- 完善方法 -->
              <p v-if="item.improveMethod && item.improveMethod.trim()">
                <strong style="color: blue">日积月累：</strong
                >{{ item.improveMethod }}
              </p>
              <!-- 修复：p标签不能嵌套div，改为div -->
              <div
                v-if="
                  (item.similarText && item.similarText.trim()) ||
                  (item.similarImgUrls && item.similarImgUrls.length > 0)
                "
              >
                <strong style="color: blue">举一反三：</strong>
                <div
                  class="v-html-content"
                  v-html="ex(item.similarText)"
                  @click="handleLinkClick"
                ></div>
                <br />
                <template
                  v-if="
                    !item.similarImgUrls || item.similarImgUrls.length === 0
                  "
                >
                </template>
                <template v-else>
                  <div class="small-imgs-wrap">
                    <img
                      v-for="(url, idx) in item.similarImgUrls"
                      :key="`item-similar-${item.id}-${idx}`"
                      :src="url"
                      alt="举一反三"
                      class="small-img"
                      @click="openImageViewer(url)"
                    />
                  </div>
                </template>
              </div>

              <!-- 可编辑题卡题目 -->
              <div @dblclick="openQuestionEditor(item.id, 14)">
                <strong style="color: blue">题卡题目：</strong>
                <div>
                  <div
                    v-html="
                      !(
                        item.question.replace(/<[^>]*>/g, '').trim().length ==
                          0 && !/(img|video|audio)/i.test(item.question || '')
                      )
                        ? ex(item.question)
                        : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                    "
                    @click="handleLinkClick"
                    style="
                      min-height: 55px;
                      padding: 0 8px;
                      margin: 0.25em 0 1em 0;
                      border: 1px solid lightblue;
                    "
                    :style="{
                      background: !(
                        item.question.replace(/<[^>]*>/g, '').trim().length ==
                          0 && !/(img|video|audio)/i.test(item.question || '')
                      )
                        ? 'white'
                        : '#d4edda',
                    }"
                  ></div>
                </div>
              </div>

              <!-- 可编辑答案与解析 -->
              <p
                v-if="!showAllAnswer"
                @click="toggleFilter1(item.id)"
                style="display: flex; cursor: pointer"
              >
                <strong style="color: green">答案：</strong>
                <span class="filter-header">
                  <span
                    class="filter-arrow"
                    :class="{ up: isAnswerOpen[item.id] == 1 }"
                    >↓</span
                  >
                </span>
              </p>
              <p v-else>
                <strong style="color: green">答案：</strong>
              </p>

              <div v-if="isAnswerOpen[item.id] == 1 || showAllAnswer">
                <div @dblclick="openQuestionEditor(item.id, 12)">
                  <div>
                    <div
                      v-html="
                        !(
                          item.answer.replace(/<[^>]*>/g, '').trim().length ==
                            0 && !/(img|video|audio)/i.test(item.answer || '')
                        )
                          ? ex(item.answer)
                          : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                      "
                      @click="handleLinkClick"
                      style="
                        min-height: 55px;
                        padding: 0 8px;
                        margin: 0.25em 0 1em 0;
                        border: 1px solid lightblue;
                      "
                      :style="{
                        background: !(
                          item.answer.replace(/<[^>]*>/g, '').trim().length ==
                            0 && !/(img|video|audio)/i.test(item.answer || '')
                        )
                          ? 'white'
                          : '#d4edda',
                      }"
                    ></div>
                  </div>
                </div>
                <!-- 可编辑解析 -->
                <div @dblclick="openQuestionEditor(item.id, 13)">
                  <strong style="color: green">解析：</strong>
                  <div>
                    <div
                      v-html="
                        !(
                          item.correctIdea.replace(/<[^>]*>/g, '').trim()
                            .length == 0 &&
                          !/(img|video|audio)/i.test(item.correctIdea || '')
                        )
                          ? ex(item.correctIdea)
                          : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                      "
                      @click="handleLinkClick"
                      style="
                        min-height: 55px;
                        padding: 0 8px;
                        margin: 0.25em 0;
                        border: 1px solid lightblue;
                      "
                      :style="{
                        background: !(
                          item.correctIdea.replace(/<[^>]*>/g, '').trim()
                            .length == 0 &&
                          !/(img|video|audio)/i.test(item.correctIdea || '')
                        )
                          ? 'white'
                          : '#d4edda',
                      }"
                    ></div>
                  </div>
                </div>

                <div style="margin: 16px 0">
                  <div style="align-items: center; display: flex">
                    <strong style="color: green">题型总结：</strong>
                    <button
                      class="read-btn"
                      style="font-size: 10px"
                      @click="switchQ(index)"
                    >
                      {{ showQ[index] == 1 ? "关闭" : "查看" }}
                    </button>
                  </div>
                  <div
                    v-if="showQ[index] == 1"
                    class="v-html-content"
                    v-html="
                      ex(
                        finalQuestionTypeSummary.find(
                          (i) =>
                            i.subject === item.subject?.trim() &&
                            i.subClass === item.subClass?.trim() &&
                            i.questionType === item.questionType?.trim()
                        )?.questionTypeSummary || '无'
                      )
                    "
                    @click="handleLinkClick"
                  ></div>
                  <div class="small-imgs-wrap" v-if="showQ[index] == 1">
                    <img
                      v-for="(url, idx) in finalQuestionTypeSummary.find(
                        (i) =>
                          i.subject === item.subject?.trim() &&
                          i.subClass === item.subClass?.trim() &&
                          i.questionType === item.questionType?.trim()
                      )?.questionTypeImgUrls || []"
                      :key="idx"
                      :src="url"
                      alt="原题"
                      class="small-img"
                      @click="openImageViewer(url)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div v-if="isMobile" class="error-actions">
              <button
                style="
                  background: transparent;
                  color: black;
                  align-items: center;
                  justify-content: center;
                  gap: 2px;
                "
                v-if="
                  !String(item.reviewDate).split(',')[1] ||
                  Number(String(item.reviewDate).split(',')[1]) == 0
                "
                class="read-btn"
                @click="switchFav(item)"
              >
                <i
                  class="material-icons"
                  style="font-size: 1.88em; color: blue; vertical-align: middle"
                  >star_border</i
                >收藏
              </button>
              <button
                style="
                  background: transparent;
                  color: black;
                  align-items: center;
                  justify-content: center;
                  gap: 2px;
                "
                v-if="
                  String(item.reviewDate).split(',')[1] &&
                  Number(String(item.reviewDate).split(',')[1]) == 1
                "
                class="read-btn"
                @click="switchFav(item)"
              >
                <i
                  class="material-icons"
                  style="font-size: 1.88em; color: blue; vertical-align: middle"
                  >star</i
                >收藏
              </button>
              <span
                class="read-btn"
                @click="addReview(item)"
                style="background-color: blue"
              >
                掌握程度: {{ item.importantLevel }}级
              </span>
              <button class="read-btn" @click="editError(item, 2)">编辑</button>
              <button class="read-btn" @click="deleteError(item.id)">
                删除
              </button>
              <button class="read-btn" @click.stop="startReading(index)">
                朗读
              </button>
            </div>
          </div>
        </div>

        <!-- 原有的分组模式 -->
        <div v-if="listViewMode === 'group'" class="error-list">
          <!-- 现有分组模式代码保持不变 -->
          <div
            v-for="subjectGroup in groupedMistaker"
            :key="subjectGroup.subject"
            class="subject-group"
          >
            <!-- 科目标题 -->
            <div
              class="group-header subject-header"
              @click="toggleCollapse('subject', subjectGroup.subject)"
            >
              <div class="header-content">
                <h4>{{ subjectGroup.subject }}</h4>
                <span class="group-count"
                  >（共{{ subjectGroup.errors.length }}题）</span
                >
              </div>
              <span
                class="collapse-icon"
                :class="{
                  collapsed: isCollapsed('subject', subjectGroup.subject),
                }"
              >
                ▼
              </span>
            </div>

            <div
              v-show="!isCollapsed('subject', subjectGroup.subject)"
              class="group-content"
            >
              <div
                v-for="subClassGroup in subjectGroup.subClasses"
                :key="`${subjectGroup.subject}-${subClassGroup.subClass}`"
                class="subclass-group"
              >
                <!-- 考点标题 -->
                <div
                  class="group-header subclass-header"
                  @click="
                    toggleCollapse(
                      'subClass',
                      `${subjectGroup.subject}-${subClassGroup.subClass}`
                    )
                  "
                >
                  <div class="header-content">
                    <h5>考点：{{ subClassGroup.subClass }}</h5>
                    <span class="group-count"
                      >（共{{ subClassGroup.errors.length }}题）</span
                    >
                  </div>
                  <span
                    class="collapse-icon"
                    :class="{
                      collapsed: isCollapsed(
                        'subClass',
                        `${subjectGroup.subject}-${subClassGroup.subClass}`
                      ),
                    }"
                  >
                    ▼
                  </span>
                </div>

                <div
                  v-show="
                    !isCollapsed(
                      'subClass',
                      `${subjectGroup.subject}-${subClassGroup.subClass}`
                    )
                  "
                  class="group-content"
                >
                  <div
                    v-for="questionTypeGroup in subClassGroup.questionTypes"
                    :key="`${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`"
                    class="questiontype-group"
                  >
                    <!-- 题型标题 -->
                    <div
                      class="group-header questiontype-header"
                      @click="
                        toggleCollapse(
                          'questionType',
                          `${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`
                        )
                      "
                    >
                      <div class="header-content">
                        <h5>题型：{{ questionTypeGroup.questionType }}</h5>
                        <span class="group-count"
                          >（共{{ questionTypeGroup.errors.length }}题）</span
                        >
                      </div>
                      <span
                        class="collapse-icon"
                        :class="{
                          collapsed: isCollapsed(
                            'questionType',
                            `${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`
                          ),
                        }"
                      >
                        ▼
                      </span>
                    </div>

                    <!-- 错题项列表 -->
                    <div
                      v-show="
                        !isCollapsed(
                          'questionType',
                          `${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`
                        )
                      "
                      class="group-content"
                    >
                      <div
                        class="error-item"
                        v-for="item in questionTypeGroup.errors"
                        :key="item.id"
                        :data-id="item.id"
                      >
                        <div class="error-header">
                          <span class="error-id">题号：{{ item.id }}</span>
                          <span
                            ><strong>{{ item.user }}</strong></span
                          >
                          <span class="error-date">{{
                            formatDateWithWeek(item.addDate)
                          }}</span>
                        </div>

                        <div class="error-content">
                          <!-- 原题 -->
                          <div>
                            <div
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                              "
                            >
                              <div>
                                <strong
                                  style="color: blue"
                                  @dblclick="openQuestionEditor(item.id, 15)"
                                  >原始错题：</strong
                                >
                                <span
                                  v-if="
                                    item?.originalText
                                      .replace(/<[^>]*>/g, '')
                                      .trim().length == 0 &&
                                    !/(img|video|audio)/i.test(
                                      item.originalText || ''
                                    )
                                  "
                                  >无</span
                                >
                              </div>
                              <div v-if="!isMobile" class="error-actions">
                                <button
                                  style="
                                    background: transparent;
                                    color: black;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 2px;
                                  "
                                  v-if="
                                    !String(item.reviewDate).split(',')[1] ||
                                    Number(
                                      String(item.reviewDate).split(',')[1]
                                    ) == 0
                                  "
                                  class="read-btn"
                                  @click="switchFav(item)"
                                >
                                  <i
                                    class="material-icons"
                                    style="
                                      font-size: 1.88em;
                                      color: blue;
                                      vertical-align: middle;
                                    "
                                    >star_border</i
                                  >收藏
                                </button>
                                <button
                                  style="
                                    background: transparent;
                                    color: black;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 2px;
                                  "
                                  v-if="
                                    String(item.reviewDate).split(',')[1] &&
                                    Number(
                                      String(item.reviewDate).split(',')[1]
                                    ) == 1
                                  "
                                  class="read-btn"
                                  @click="switchFav(item)"
                                >
                                  <i
                                    class="material-icons"
                                    style="
                                      font-size: 1.88em;
                                      color: blue;
                                      vertical-align: middle;
                                    "
                                    >star</i
                                  >收藏
                                </button>
                                <span
                                  class="read-btn"
                                  @click="addReview(item)"
                                  style="background-color: blue"
                                >
                                  掌握程度: {{ item.importantLevel }}级
                                </span>
                                <button
                                  class="read-btn"
                                  @click="editError(item, 2)"
                                >
                                  编辑
                                </button>
                                <button
                                  class="read-btn"
                                  @click="deleteError(item.id)"
                                >
                                  删除
                                </button>
                                <button
                                  class="read-btn"
                                  @click.stop="
                                    startReading(getGlobalIndex(item.id))
                                  "
                                >
                                  朗读
                                </button>
                              </div>
                            </div>
                            <div
                              v-if="
                                !(
                                  item?.originalText
                                    .replace(/<[^>]*>/g, '')
                                    .trim().length == 0 &&
                                  !/(img|video|audio)/i.test(
                                    item.originalText || ''
                                  )
                                )
                              "
                              class="v-html-content"
                              v-html="ex(item.originalText)"
                              style="
                                min-height: 60px;
                                padding: 0 8px;
                                background: white;
                                border: 1px solid lightblue;
                              "
                              @click="handleLinkClick"
                              :style="{ margin: isMobile ? '0.5em 0' : '0' }"
                              @dblclick="openQuestionEditor(item.id, 15)"
                            ></div>
                            <br />
                            <div
                              class="small-imgs-wrap"
                              v-if="item.originalImgUrls?.length"
                            >
                              <img
                                v-for="(url, idx) in item.originalImgUrls"
                                :key="`item-original-${item.id}-${idx}`"
                                :src="url"
                                alt="原题"
                                class="small-img"
                                @click="openImageViewer(url)"
                              />
                            </div>
                          </div>

                          <!-- 标签 -->
                          <p
                            v-if="item.errorType && item.errorType.trim()"
                            style="margin-bottom: 1em"
                          >
                            <strong style="color: blue">标签：</strong
                            >{{ item.errorType }}
                          </p>

                          <!-- 错题解析 -->
                          <div
                            v-if="item.errorReason && item.errorReason.trim()"
                            style="margin: 16px 0"
                          >
                            <strong style="color: blue">错题解析：</strong>
                            <div
                              class="v-html-content"
                              v-html="ex(item.errorReason)"
                              style="
                                min-height: 60px;
                                padding: 0 8px;
                                margin: 0.5em 0;
                                background: white;
                                border: 1px solid lightblue;
                              "
                              @click="handleLinkClick"
                            ></div>
                            <div
                              v-if="item.errorReasonImgUrls?.length"
                              class="small-imgs-wrap"
                            ></div>
                          </div>

                          <!-- 备用 -->
                          <p v-if="item.trap && item.trap.trim()">
                            <strong style="color: blue">备用：</strong
                            >{{ item.trap }}
                            <span
                              v-if="item.trapDetail && item.trapDetail.trim()"
                              style="color: #666; margin-left: 10px"
                            >
                              | 详解：{{ item.trapDetail }}
                            </span>
                          </p>

                          <!-- 完善方法 -->
                          <p
                            v-if="
                              item.improveMethod && item.improveMethod.trim()
                            "
                          >
                            <strong style="color: blue">本题型提高方法：</strong
                            >{{ item.improveMethod }}
                          </p>

                          <!-- 举一反三 -->
                          <div
                            v-if="
                              (item.similarText && item.similarText.trim()) ||
                              (item.similarImgUrls &&
                                item.similarImgUrls.length > 0)
                            "
                          >
                            <strong style="color: blue">举一反三：</strong>
                            <div
                              class="v-html-content"
                              v-html="ex(item.similarText)"
                              @click="handleLinkClick"
                            ></div>
                            <br />
                            <template v-if="item.similarImgUrls?.length">
                              <div class="small-imgs-wrap"></div>
                            </template>
                          </div>

                          <!-- 可编辑题卡题目 -->
                          <div @dblclick="openQuestionEditor(item.id, 14)">
                            <strong style="color: blue">题卡题目：</strong>
                            <div>
                              <div
                                v-html="
                                  !(
                                    item.question.replace(/<[^>]*>/g, '').trim()
                                      .length == 0 &&
                                    !/(img|video|audio)/i.test(
                                      item.question || ''
                                    )
                                  )
                                    ? ex(item.question)
                                    : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                                "
                                @click="handleLinkClick"
                                style="
                                  min-height: 55px;
                                  padding: 0 8px;
                                  margin: 0.25em 0 1em 0;
                                  border: 1px solid lightblue;
                                "
                                :style="{
                                  background: !(
                                    item.question.replace(/<[^>]*>/g, '').trim()
                                      .length == 0 &&
                                    !/(img|video|audio)/i.test(
                                      item.question || ''
                                    )
                                  )
                                    ? 'white'
                                    : '#d4edda',
                                }"
                              ></div>
                            </div>
                          </div>

                          <!-- 可编辑答案 -->
                          <p
                            v-if="!showAllAnswer"
                            @click="toggleFilter1(item.id)"
                            style="display: flex; cursor: pointer"
                          >
                            <strong style="color: green">答案：</strong>
                            <span class="filter-header">
                              <span
                                class="filter-arrow"
                                :class="{ up: isAnswerOpen[item.id] == 1 }"
                                >↓</span
                              >
                            </span>
                          </p>
                          <p v-else>
                            <strong style="color: green">答案：</strong>
                          </p>
                          <div
                            v-if="isAnswerOpen[item.id] == 1 || showAllAnswer"
                          >
                            <div @dblclick="openQuestionEditor(item.id, 12)">
                              <div>
                                <div
                                  v-html="
                                    !(
                                      item.answer.replace(/<[^>]*>/g, '').trim()
                                        .length == 0 &&
                                      !/(img|video|audio)/i.test(
                                        item.answer || ''
                                      )
                                    )
                                      ? ex(item.answer)
                                      : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                                  "
                                  @click="handleLinkClick"
                                  style="
                                    min-height: 55px;
                                    padding: 0 8px;
                                    margin: 0.25em 0 1em 0;
                                    border: 1px solid lightblue;
                                  "
                                  :style="{
                                    background: !(
                                      item.answer.replace(/<[^>]*>/g, '').trim()
                                        .length == 0 &&
                                      !/(img|video|audio)/i.test(
                                        item.answer || ''
                                      )
                                    )
                                      ? 'white'
                                      : '#d4edda',
                                  }"
                                ></div>
                              </div>
                            </div>

                            <!-- 可编辑解析 -->
                            <div @dblclick="openQuestionEditor(item.id, 13)">
                              <strong style="color: green">解析：</strong>
                              <div>
                                <div
                                  v-html="
                                    !(
                                      item.correctIdea
                                        .replace(/<[^>]*>/g, '')
                                        .trim().length == 0 &&
                                      !/(img|video|audio)/i.test(
                                        item.correctIdea || ''
                                      )
                                    )
                                      ? ex(item.correctIdea)
                                      : '<div style=&quot;color: #999;padding: 4px 0&quot;>无内容！双击可编辑，单击已有图片可放大浏览。</div>'
                                  "
                                  @click="handleLinkClick"
                                  style="
                                    min-height: 55px;
                                    padding: 0 8px;
                                    margin: 0.25em 0;
                                    border: 1px solid lightblue;
                                  "
                                  :style="{
                                    background: !(
                                      item.correctIdea
                                        .replace(/<[^>]*>/g, '')
                                        .trim().length == 0 &&
                                      !/(img|video|audio)/i.test(
                                        item.correctIdea || ''
                                      )
                                    )
                                      ? 'white'
                                      : '#d4edda',
                                  }"
                                ></div>
                              </div>
                            </div>

                            <div style="margin: 16px 0">
                              <div style="align-items: center; display: flex">
                                <strong style="color: green">题型总结：</strong>
                                <button
                                  class="read-btn"
                                  style="font-size: 10px"
                                  @click="switchQ(index)"
                                >
                                  {{ showQ[index] == 1 ? "关闭" : "查看" }}
                                </button>
                              </div>
                              <div
                                v-if="showQ[index] == 1"
                                class="v-html-content"
                                v-html="
                                  ex(
                                    finalQuestionTypeSummary.find(
                                      (i) =>
                                        i.subject === item.subject?.trim() &&
                                        i.subClass === item.subClass?.trim() &&
                                        i.questionType ===
                                          item.questionType?.trim()
                                    )?.questionTypeSummary || '无'
                                  )
                                "
                                @click="handleLinkClick"
                              ></div>
                              <div
                                class="small-imgs-wrap"
                                v-if="showQ[index] == 1"
                              >
                                <img
                                  v-for="(
                                    url, idx
                                  ) in finalQuestionTypeSummary.find(
                                    (i) =>
                                      i.subject === item.subject?.trim() &&
                                      i.subClass === item.subClass?.trim() &&
                                      i.questionType ===
                                        item.questionType?.trim()
                                  )?.questionTypeImgUrls || []"
                                  :key="idx"
                                  :src="url"
                                  alt="原题"
                                  class="small-img"
                                  @click="openImageViewer(url)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="isMobile" class="error-actions">
                          <button
                            style="
                              background: transparent;
                              color: black;
                              align-items: center;
                              justify-content: center;
                              gap: 2px;
                            "
                            v-if="
                              !String(item.reviewDate).split(',')[1] ||
                              Number(String(item.reviewDate).split(',')[1]) == 0
                            "
                            class="read-btn"
                            @click="switchFav(item)"
                          >
                            <i
                              class="material-icons"
                              style="
                                font-size: 1.88em;
                                color: blue;
                                vertical-align: middle;
                              "
                              >star_border</i
                            >收藏
                          </button>
                          <button
                            style="
                              background: transparent;
                              color: black;
                              align-items: center;
                              justify-content: center;
                              gap: 2px;
                            "
                            v-if="
                              String(item.reviewDate).split(',')[1] &&
                              Number(String(item.reviewDate).split(',')[1]) == 1
                            "
                            class="read-btn"
                            @click="switchFav(item)"
                          >
                            <i
                              class="material-icons"
                              style="
                                font-size: 1.88em;
                                color: blue;
                                vertical-align: middle;
                              "
                              >star</i
                            >收藏
                          </button>
                          <button class="read-btn" @click="editError(item, 2)">
                            编辑
                          </button>
                          <button
                            class="read-btn"
                            @click="deleteError(item.id)"
                          >
                            删除
                          </button>
                          <button
                            class="read-btn"
                            @click.stop="startReading(getGlobalIndex(item.id))"
                          >
                            朗读
                          </button>
                          <button
                            class="action"
                            @click="editCheatSheet(item.user, item.subject)"
                            style="background-color: white; color: blue"
                          >
                            CS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-tip">
          {{ mistaker.length === 0 ? "暂无题目数据，请添加题目" : "" }}
        </div>
      </div>
      <!-- 日积月累任务视图 -->
      <div v-if="currentView === 'task'" class="task-view">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          "
        >
          <h3 style="margin: 0">日积月累任务列表</h3>
          <button @click="openAddTaskModal" class="add-task-btn">
            添加任务
          </button>
        </div>
        <div class="task-list" v-if="taskList.length">
          <div class="task-item" v-for="(task, index) in taskList" :key="index">
            <div style="display: flex; justify-content: space-between">
              <div class="task-header">
                <span class="task-id">任务{{ index + 1 }}</span>
                <span class="task-subject">: {{ task.subject }}</span>
                <span class="task-subject">-{{ task.subClass }}</span>
                <span class="task-subject">-{{ task.questionType }}</span>
              </div>
              <div
                class="error-actions"
                style="display: flex; justify-content: right"
              >
                <button
                  @click="editTask(task, index)"
                  class="read-btn"
                  title="编辑任务"
                >
                  编辑
                </button>
                <button
                  @click="deleteTask(index)"
                  class="read-btn"
                  title="删除任务"
                >
                  删除
                </button>
              </div>
            </div>
            <p>{{ task.improveMethod }}</p>

            <!-- 新增：今日完成状态 -->
            <div class="completion-section">
              <label class="completion-label">
                <input
                  v-if="!task.completionHistory?.includes(todayDate)"
                  type="checkbox"
                  v-model.lazy="task.completedToday"
                  @change="toggleTaskCompletion(task)"
                  class="completion-checkbox"
                />
                <input
                  v-if="task.completionHistory?.includes(todayDate)"
                  disabled
                  v-model="cons"
                  type="checkbox"
                  class="completion-checkbox"
                />
                今日已完成
              </label>

              <!-- 完成历史记录 -->
              <div
                v-if="task.completionHistory && task.completionHistory.length"
                class="completion-history"
              >
                <strong>完成记录：</strong>
                <div
                  class="history-dates"
                  style="overflow-x: auto; overflow-y: hidden"
                >
                  <span
                    v-for="date in task.completionHistory"
                    :key="date"
                    class="history-date"
                  >
                    {{ formatDateWithWeek(date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-tip">暂无日积月累任务。</div>
      </div>

      <!-- 任务编辑弹窗 -->
      <div class="modal" v-if="showTaskModal">
        <div class="modal-content task-modal">
          <span class="close-btn" @click="closeTaskModal">×</span>
          <h4>{{ isEditingTask ? "编辑任务" : "添加任务" }}</h4>

          <div class="task-form">
            <div class="form-group">
              <label>科目：<span class="required">*</span></label>
              <input
                v-model="taskForm.subject"
                type="text"
                placeholder="请输入科目"
                :class="{ error: taskFormErrors.subject }"
              />
              <div class="error-message" v-if="taskFormErrors.subject">
                {{ taskFormErrors.subject }}
              </div>
            </div>

            <div class="form-group">
              <label>考点：<span class="required">*</span></label>
              <input
                v-model="taskForm.subClass"
                type="text"
                placeholder="请输入考点"
                :class="{ error: taskFormErrors.subClass }"
              />
              <div class="error-message" v-if="taskFormErrors.subClass">
                {{ taskFormErrors.subClass }}
              </div>
            </div>
            <!-- 新增：题型输入框 -->
            <div class="form-group">
              <label>题型：<span class="required">*</span></label>
              <input
                v-model="taskForm.questionType"
                type="text"
                placeholder="请输入题型"
                :class="{ error: taskFormErrors.questionType }"
              />
              <div class="error-message" v-if="taskFormErrors.questionType">
                {{ taskFormErrors.questionType }}
              </div>
            </div>

            <div class="form-group">
              <label>日积月累任务：</label>
              <textarea
                v-model="taskForm.improveMethod"
                rows="4"
                placeholder="请输入日积月累任务内容"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button @click="closeTaskModal" class="cancel-btn">取消</button>
              <button @click="saveTask" class="save-btn">
                {{ isEditingTask ? "更新任务" : "保存任务" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 题型总结视图 -->
      <div
        v-if="currentView === 'questionTypeSummary'"
        class="question-type-summary-view"
        @click="stopReading()"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0px 10px 16px;
          "
        >
          <div style="display: flex; align-items: center; gap: 8px">
            <h3 style="margin: 0">题型总结</h3>
            <div class="filter-header" @click="toggleQuestionTypeSummaryFilter">
              <span
                class="filter-arrow"
                :class="{ up: isQuestionTypeSummaryFilterOpen }"
                >↓</span
              >
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px">
            <!-- 新增：全部展开/收起按钮 -->
            <span
              v-if="
                !isQuestionTypeSummaryAllExpanded &&
                questionTypeMapFiltered.length
              "
              @click="toggleQuestionTypeSummaryExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▶
            </span>
            <span
              v-if="
                isQuestionTypeSummaryAllExpanded &&
                questionTypeMapFiltered.length
              "
              @click="toggleQuestionTypeSummaryExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▼
            </span>
          </div>
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section" v-if="isQuestionTypeSummaryFilterOpen">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                关键字：
                <input
                  v-model.lazy="questionTypeSummaryFilterForm.keyword"
                  type="text"
                  placeholder="多个关键字(包含用户，科目等)用空格分开"
                />
              </div>
              <div class="filter-actions">
                <button
                  @click="resetQuestionTypeSummaryFilter"
                  class="reset-btn"
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-list" v-if="questionTypeMapFiltered.length">
          <div
            v-for="{
              key: questionType,
              value: summaryData,
            } in questionTypeMapFiltered"
            :key="questionType"
            class="question-type-summary-group"
            :class="{
              reading:
                currentReadingQuestionTypeIndex ===
                getQuestionTypeSummaryIndex(questionType),
            }"
          >
            <!-- 分组标题 -->
            <div
              class="group-header questiontype-summary-header"
              @click="toggleQuestionTypeSummaryGroup(questionType)"
            >
              <div class="header-content">
                <h4>{{ questionType }}</h4>
              </div>
              <span
                class="collapse-icon"
                :class="{
                  collapsed: isQuestionTypeSummaryGroupCollapsed(questionType),
                }"
              >
                ▼
              </span>
            </div>

            <!-- 分组内容 -->
            <div
              v-show="!isQuestionTypeSummaryGroupCollapsed(questionType)"
              class="group-content"
            >
              <div class="summary-item">
                <div class="summary-content">
                  <div style="display: flex; justify-content: space-between">
                    <strong>总结要点：</strong>
                    <div v-if="!isMobile" class="error-importance">
                      <div class="error-actions">
                        <button
                          class="read-btn"
                          @click="editQuestionType(questionType)"
                        >
                          编辑
                        </button>
                        <button
                          class="read-btn"
                          @click="deleteQuestionType(questionType)"
                        >
                          删除
                        </button>
                        <button
                          class="read-btn"
                          @click.stop="
                            startReadingQuestionTypeSummary(
                              getQuestionTypeSummaryIndex(questionType)
                            )
                          "
                        >
                          朗读
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    class="summary-text"
                    v-html="ex(summaryData.summary) || '暂无总结'"
                    @click="handleLinkClick"
                  ></div>
                </div>

                <!-- 图片显示 -->
                <div v-if="summaryData.img" class="small-imgs-wrap">
                  <img
                    v-for="(url, idx) in summaryData.img"
                    :key="`item-questionType-${idx}`"
                    :src="url"
                    alt="题型总结图片"
                    class="small-img"
                    @click="openImageViewer(url)"
                  />
                </div>

                <div v-if="isMobile" class="error-importance">
                  <div class="error-actions">
                    <button
                      class="read-btn"
                      @click="editQuestionType(questionType)"
                    >
                      编辑
                    </button>
                    <button
                      class="read-btn"
                      @click="deleteQuestionType(questionType)"
                    >
                      删除
                    </button>
                    <button
                      class="read-btn"
                      @click.stop="
                        startReadingQuestionTypeSummary(
                          getQuestionTypeSummaryIndex(questionType)
                        )
                      "
                    >
                      朗读
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-tip">
          {{
            questionTypeMapFiltered.length === 0
              ? Object.keys(questionTypeMap).length === 0
                ? "暂无题型总结数据，可在添加题目时填写题型总结"
                : "未找到符合条件的题型总结"
              : ""
          }}
        </div>
      </div>
      <div v-if="currentView === 'trapSummary'" class="trap-summary-view">
        <h3>备用总结</h3>
        <div class="summary-list" v-if="Object.keys(trapMap).length">
          <div
            class="summary-item"
            v-for="(summaryData, trap) in trapMap"
            :key="trap"
          >
            <div class="summary-header">
              <span class="trap-title">{{ trap }}</span>
              <span class="trap-count"
                >（共{{ summaryData.errorIds.length }}题）</span
              >
            </div>
            <div class="summary-content">
              <strong>备用详解：</strong>
              <div class="summary-text">
                {{ summaryData.detail || "暂无详解" }}
              </div>
            </div>
            <p>
              <strong>对应题号：</strong>
              <span v-for="(id, idx) in summaryData.errorIds" :key="id">
                {{ id
                }}<template v-if="idx < summaryData.errorIds.length - 1"
                  >、</template
                >
              </span>
            </p>
          </div>
        </div>

        <div v-else class="empty-tip">
          暂无备用总结数据，请在添加题目时填写备用和备用详解
        </div>
      </div>

      <!-- CheatSheet视图 -->
      <div v-if="currentView === 'cheatSheet'" class="cheat-sheet-view">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <h3 style="margin: 0">CheatSheet</h3>
          <div style="display: flex; align-items: center; gap: 10px">
            <button
              @click="editCheatSheet(form?.user, form?.subject)"
              class="print-cards-btn"
            >
              <i class="material-icons">add_circle</i>
              添加
            </button>
            <button @click="openPrintCheatSheetModal" class="print-cards-btn">
              <i class="material-icons">print</i>
              打印
            </button>
            <!-- 新增：全部展开/收起按钮 -->
            <span
              v-if="!isAllCheatSheetExpanded && groupedCheatSheets.length"
              @click="toggleCheatSheetExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▶
            </span>
            <span
              v-if="isAllCheatSheetExpanded && groupedCheatSheets.length"
              @click="toggleCheatSheetExpandAll"
              style="
                background: white;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
              "
            >
              ▼
            </span>
          </div>
        </div>

        <div class="cheat-sheet-list" v-if="groupedCheatSheets.length">
          <div
            v-for="(group, index) in groupedCheatSheets"
            :key="group.key"
            class="cheat-sheet-group"
          >
            <!-- 分组标题 -->
            <div
              class="group-header cheat-sheet-header"
              @click="toggleCheatSheetGroup(group.key)"
            >
              <div class="header-content">
                <h4>{{ group.user }} - {{ group.subject }}</h4>
              </div>
              <span
                class="collapse-icon"
                :class="{ collapsed: isCheatSheetGroupCollapsed(group.key) }"
              >
                ▼
              </span>
            </div>

            <!-- 分组内容 -->
            <div
              v-show="!isCheatSheetGroupCollapsed(group.key)"
              class="group-content"
            >
              <div
                v-for="(item, itemIndex) in group.items"
                :key="item.id || itemIndex"
                class="cheat-sheet-item"
              >
                <div class="cheat-sheet-content">
                  <div style="display: flex; justify-content: space-between">
                    <strong>内容：</strong>
                    <div v-if="!isMobile" class="error-actions">
                      <button
                        @click="editCheatSheetItem(item)"
                        class="read-btn"
                        title="编辑"
                      >
                        编辑
                      </button>
                      <button
                        @click="deleteCheatSheetItem(item, index, itemIndex)"
                        class="read-btn"
                        title="删除"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  <div
                    class="cheat-sheet-text"
                    v-html="ex(item.cheatSheet) || '暂无内容'"
                    @click="handleLinkClick"
                  ></div>
                </div>

                <div v-if="isMobile" class="error-actions">
                  <button
                    @click="editCheatSheetItem(item)"
                    class="read-btn"
                    title="编辑"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteCheatSheetItem(item, index, itemIndex)"
                    class="read-btn"
                    title="删除"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-tip">
          暂无CheatSheet数据！可在此记录各科思维导图、速记要点、公式等。
        </div>
      </div>

      <!-- CheatSheet编辑弹窗 -->
      <div
        v-if="showCheatSheetModal"
        style="position: fixed; z-index: 2600; bottom: 0.2em; width: 100%"
      >
        <div
          class="modal-content"
          style="
            background-color: #ccc;
            padding: 5px;
            display: flex;
            flex-direction: column;
          "
        >
          <div class="form-group" style="margin-bottom: 0">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span
                >{{ cheatSheetForm.user }} - {{ cheatSheetForm.subject }}</span
              >
              <span class="modal-actions">
                <button @click="closeCheatSheetModal" class="cancel-btn">
                  取消
                </button>
                <button @click="saveCheatSheet" class="save-btn">保存</button>
              </span>
            </div>

            <div style="border: 1px solid #ccc">
              <!-- 工具栏 -->
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editorCheatSheet"
                mode="simple"
                :defaultConfig="toolbarConfig"
              />
              <!-- 编辑器 -->
              <Editor
                style="height: 400px"
                :editor="editorCheatSheet"
                mode="simple"
                v-model.lazy="cheatSheetForm.cheatSheet"
                :defaultConfig="editorConfigCheatSheet"
                @onCreated="onCreatedCheatSheet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗（新增读取/保存错题本功能） -->
    <div class="settingBoxContainer" v-if="showSettingModal" style="top: 4.2em">
      <div class="settingBox" @touchmove.stop.passive>
        <div style="display: flex; justify-content: space-between">
          <span style="font-weight: 600; padding-top: 1em">系统设置</span>
          <span class="close-btn" @click="showSettingModal = false">×</span>
        </div>
        <!-- 错题本导入导出功能 -->
        <div class="data-manage-section">
          <h5>
            <input
              v-model="autoSync"
              type="checkbox"
              class="completion-checkbox"
            />
            在非离线APP模式下开启服务器自动同步功能
          </h5>
          <div style="color: white; text-align: justify">
            为了方便用户备份错题本，所有文字和图片数据都保存在同一个.json文件中。因此，该文件可能较大。开启此项后，任何对错题本的修改都会自动上传到服务器(不会进行提示)，可能会消耗大量流量。在移动网络，请勿开启此项，可点击导航栏的上传图标进行手动同步。注：无论是否开启此项，每次登录或刷新浏览器后都会自动从服务器校验错题本更新时间。若有不同，将提示是否进行下载。(此设置仅对当前浏览器有效)
          </div>
          <br />
          <br />
          <h5>
            <input
              v-model="showTool"
              type="checkbox"
              class="completion-checkbox"
            />
            显示"中文转拼音工具"
          </h5>
          <h5>
            <input
              v-model="showAllAnswer"
              type="checkbox"
              class="completion-checkbox"
            />
            在“错题列表”中自动展开全部答案区域。
          </h5>
          <div class="setting-divider"></div>
          <h5>题卡测验分组设置</h5>
          <div class="setting-item">
            <div style="color: white">
              每组题卡数量：
              <input
                class="input input--repeater"
                type="number"
                min="1"
                style="width: 5em; padding: 0.2em"
                v-model.number.lazy="groupNumber"
              />
            </div>
            <p class="setting-tip">
              设置题卡测验时每组的题目数量，默认为10题。一组测验结束后将复习本组错题(但不改变题目掌握程度)，直到没有错题时，将提示进入下一组测验。
            </p>
          </div>
          <div class="setting-divider"></div>
          <h5>错题本备份和还原</h5>
          <!-- 保存错题本 -->
          <div class="setting-item">
            <label>备份错题本到本地：</label>
            <button @click="saveErrorBook" class="data-btn save-btn">
              导出错题本(JSON)
            </button>
            <p class="setting-tip">
              将当前所有数据(含图片)导出为JSON文件保存到本地
            </p>
          </div>

          <!-- 读取错题本 -->
          <div class="setting-item">
            <label>从本地读取错题本备份：</label>
            <div class="upload-wrap" style="text-align: center">
              <input
                type="file"
                accept=".json"
                @change="readErrorBook"
                id="errorBookUpload"
                class="upload-input"
              />
              <label for="errorBookUpload" class="upload-btn"
                >选择JSON文件</label
              >
            </div>
            <p class="setting-tip">
              上传本地错题本JSON文件，导入后将覆盖当前数据
            </p>
          </div>
          <div class="setting-divider"></div>
          <div class="setting-item">
            <h5 style="margin: 0">清空题卡测试记录</h5>
            <button @click="clearRecords" class="data-btn save-btn">
              确定
            </button>
            <br />
            <h5 style="margin: 0">清空错题本数据</h5>
            <button
              @click="confirmClearData"
              class="data-btn clear-btn"
              style="background-color: #e74c3c"
            >
              清空当前错题本所有数据
            </button>
            <p class="setting-tip">
              警告：此操作将永久删除所有数据，不可恢复！请在清空前做好备份。并且，若已开启服务器自动同步功能，将会同步清空服务器上的错题本内容！
            </p>
          </div>
        </div>
        <div class="setting-divider"></div>
        <div class="setting-item" style="color: white; text-align: justify">
          <div>
            <span style="color: springgreen; font-weight: bold">使用说明：</span
            >本错题本支持记录原始错题，支持添加需反复记忆的题卡，支持添加答案和解析，并支持按自定义规律进行错题复习和题卡测试。同时还可对科目（CheatSheet）和题型进行知识总结，并可添加需定期完成的日积月累任务，还能存储各类综合汇总资料。可按需使用。
          </div>
          <div>
            <span style="color: springgreen; font-weight: bold">学习方法：</span
            >认真听课，认真做题！做题的目的在于通过错题找到不足之处。所以，学习的重点应在于分析错题，分析得越透彻越好，找到避免下次同类题再错的解决方法，并把相关知识点进行归纳总结，形成知识体系，并牢记。每日一定要彻底弄懂当日的错题！最不可取的方法是不停地刷题却很少分析和复习错题。
          </div>
          <div>
            <span style="color: springgreen; font-weight: bold"
              >错题本最简整理过程：</span
            >每日把当天的所有错题在相应的卷子侧边（或卷子背面）写上分析，越透彻越好。然后在手机微信中拍照并上传卷子。在电脑版微信中打开卷子图片，用windows自带截图工具(Prt
            Scr键)截取每道错题图片(包括卷子侧边的分析)，分别粘贴到'添加题目'的原始错题中，并填写相应分类信息，对字词等需反复记忆的知识可进行汇总添加。也可将错题图片粘贴入豆包等，生成原题或同类题，再粘贴入'题卡题目'中，并酌情填写'答案'、'解析'、'题型总结'等其他项。最后，每天花10分钟对以前的错题进行复习和测试。
          </div>
          <div>
            <span style="color: springgreen; font-weight: bold"
              >PDJ错题本优势：</span
            >避免整理纸质错题本时剪卷子错题或抄题等的繁琐操作；可方便地对错题进行归类；可进行复习和题卡测试，能记录复习/测试次数和每次的结果，并可随时对各项目进行编辑；可通过关键词等筛选错题...
          </div>
          <div>
            <span style="color: springgreen; font-weight: bold"
              >PDJ错题本劣势：</span
            >电子错题本需在电脑、平板、手机上使用，难以随手翻阅。而很多需要记忆的知识(如字词句等)需要反复复习(理解、对比、归纳、助记法等可以有效减少复习次数并形成长久记忆)。PDJ错题本虽然提供了打印功能，但版面松散。所以可以准备一个小的纸质错题本，每日把需要反复记忆的知识(如字词等)写在此错题本上，并在每天上下学路上复习一遍，效果最佳。可以定期把小错题本拍照上传到PDJ错题本收藏，并使用批量添加错题的功能形成题目。对于阅读理解，应用题等只需理解，不便抄到小错题本上的题目可直接整理到PDJ错题本。
          </div>
          <div>
            <span style="color: springgreen; font-weight: bold">考前复习：</span
            >提前知道考试内容和题型对于考试非常有帮助。对于期中期末考试，可着重分析考前的期中期末复习卷，这常常是考试的内容和范围。对于中高考，一定要反复练习和透彻分析历年真题(同一套真题可以反复做，越多越好)，并根据每道题的常见考点(是固定的)、解题思路、出题人惯用伎俩等进行有目的的准备。可在平时观看'一数数学','学过石油的语文老师'等网课，以开拓思维方式和解题方法。
          </div>
        </div>
      </div>
    </div>

    <!-- 图片查看器模态框 -->
    <div
      v-if="showImageViewer"
      @mousedown.stop
      @mousemove.stop
      @mouseup.stop
      @click.stop
      @touchstart.stop
      @touchmove.stop
      @touchend.stop
      style="position: fixed; inset: 0; z-index: 8998"
    >
      <vue-easy-lightbox
        :visible="showImageViewer"
        :imgs="lightboxImgsFinal"
        :index="0"
        @hide="closeImageViewer"
        :mask-closable="true"
        :moveDisabled="false"
        :zoomScale="0.2"
        :rotate-disabled="false"
        :min-zoom-scale="0.2"
        :max-zoom-scale="10"
        :transition-time="0"
        :zoom-speed="1"
      >
      </vue-easy-lightbox>
    </div>
    <div v-if="showPinYinTool" class="pinyin-converter">
      <div class="converter-header">
        <h2>中文转拼音工具</h2>
      </div>

      <!-- 输入区域 -->
      <div class="input-section">
        <textarea
          v-model="inputText"
          placeholder="请输入需要转换的中文文本..."
          class="input-textarea"
          rows="3"
        ></textarea>
      </div>

      <!-- 结果区域 -->
      <div class="result-section" v-if="resultText">
        <h3>转换结果：</h3>
        <div class="result-text">{{ resultText }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="btn-section">
        <button @click="convertToPinyin" class="convert-btn">转换拼音</button>
        <button @click="copyResult" class="copy-btn" :disabled="!resultText">
          复制结果
        </button>
        <button @click="clearAll" class="clear-btn">清空</button>
        <button @click="showPinYinTool = false" class="clear-btn">退出</button>
      </div>

      <!-- 复制成功提示 -->
      <div class="copy-toast" v-if="showToast">复制成功！</div>
    </div>
    <!-- 题目编辑弹窗 -->
    <div class="modal" v-if="showQuestionEditor">
      <div
        class="modal-content"
        style="height: 95vh; display: flex; flex-direction: column"
        :style="{ width: isMobile ? '100%' : '68%' }"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <h3>
            {{
              editAnswer == 2 || editAnswer == 12
                ? "编辑答案"
                : editAnswer == 3 || editAnswer == 13
                ? "编辑解析"
                : editAnswer == 4 || editAnswer == 14
                ? "编辑题卡题目"
                : editAnswer == 32
                ? "编辑节点注释"
                : editAnswer == 31
                ? "编辑节点内容"
                : editAnswer == 33
                ? "编辑笔记"
                : "编辑"
            }}
          </h3>
          <span
            class="close-btn"
            @click="closeQuestionEditor"
            style="font-size: 24px; cursor: pointer"
            >×</span
          >
        </div>

        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
            height: 81%;
          "
        >
          <!-- 工具栏 -->
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorQuestion"
            mode="simple"
            :defaultConfig="toolbarConfig"
          />
          <!-- 编辑器 -->
          <Editor
            style="height: calc(100% - 40px); overflow-y: auto"
            :editor="editorQuestion"
            mode="simple"
            v-model.lazy="editingQuestionContent"
            :defaultConfig="editorConfigQuestion"
            @onCreated="onCreatedQuestionEditor"
          />
        </div>

        <div
          style="
            text-align: right;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          "
        >
          <button
            @click="showQuestionEditorHelp = true"
            class="cancel-btn"
            style="margin-right: 10px"
          >
            帮助
          </button>
          <button
            @click="closeQuestionEditor"
            class="cancel-btn"
            style="margin-right: 10px"
          >
            取消
          </button>
          <button @click="saveQuestionEditor" class="save-btn">保存</button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="showQuestionEditorHelp" style="z-index: 2500">
      <div class="modal-content">
        <h3>帮助</h3>
        <div style="margin: 15px 0; line-height: 1.8">
          <p>
            **填空答案**：可迅速将 填空答案
            变成填空题，单击可切换显示和隐藏答案。可直接选中 填空答案 部分，点击
            **A**按钮，迅速生成填空题目。此题目也将用作测试中的题卡。
          </p>
          <p>##题号##：如##1##，可在此处插入链接，点击后显示此题号的题目。</p>
          <p>
            $$关联内容$$ 或
            $关联内容$：仅用于思维导图中的节点注释内，可在具有相同的关联内容的两个节点间建立关联线。$关联内容$
            表无箭头；$$关联内容$$ 表有箭头。
          </p>
        </div>
        <div style="text-align: right">
          <button @click="showQuestionEditorHelp = false" class="save-btn">
            关闭
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showCSModal"
      style="position: fixed; z-index: 2600; bottom: 0.2em; width: 100%"
    >
      <div
        class="modal-content"
        style="
          background-color: #ccc;
          padding: 5px;
          display: flex;
          flex-direction: column;
        "
      >
        <div style="display: flex; justify-content: space-between">
          <span> CheatSheet {{ form.user }} {{ form.subject }} </span>
          <span>
            <button
              @click="showCSModal = false"
              class="cancel-btn"
              style="margin-right: 10px"
            >
              取消
            </button>
            <button @click="updateCList" class="save-btn">保存</button>
          </span>
        </div>
        <div
          style="
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
          "
        >
          <div style="display: flex; gap: 10px; align-items: center">
            <input
              v-model="form.user"
              type="text"
              style="flex: 1"
              placeholder="请输入用户"
              required
            />
            <input
              v-model="form.subject"
              type="text"
              style="flex: 1"
              placeholder="请输入科目"
              required
            />
          </div>

          <!-- 工具栏 -->
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor2"
            mode="simple"
            :defaultConfig="toolbarConfig"
          />
          <!-- 编辑器 -->
          <Editor
            style="height: 300px"
            :editor="editor2"
            mode="simple"
            v-model.lazy="form.cheatSheet"
            :defaultConfig="editorConfig2"
            @onCreated="onCreated2"
          />
        </div>
      </div>
    </div>
    <!-- CheatSheet打印模态框 -->
    <div class="modal" v-if="showPrintCheatSheetModal">
      <div class="modal-content" style="max-width: 800px; max-height: 80vh">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <h3 style="margin: 0">选择要打印的CheatSheet</h3>
          <span class="close-btn" @click="closePrintCheatSheetModal">×</span>
        </div>

        <div
          style="
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div>
            <span>已选择 {{ selectedCheatSheetIds.length }} 项</span>
          </div>
          <div style="display: flex; gap: 10px">
            <button @click="toggleSelectAllCheatSheets" class="print-btn">
              {{
                selectedCheatSheetIds.length === printCheatSheetData.length
                  ? "取消全选"
                  : "全选"
              }}
            </button>
            <button
              @click="printSelectedCheatSheets"
              class="generate-btn"
              :disabled="selectedCheatSheetIds.length === 0"
            >
              打印选中项
            </button>
          </div>
        </div>

        <div
          style="
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
          "
        >
          <div v-if="printCheatSheetData.length === 0" class="empty-tip">
            暂无CheatSheet数据
          </div>

          <div v-else>
            <!-- 在模板中找到打印CheatSheet模态框的部分，修改复选框的代码 -->
            <div
              v-for="item in printCheatSheetData"
              :key="item.uniqueId"
              class="print-cheatsheet-item"
              :class="{
                selected: selectedCheatSheetIds.includes(item.uniqueId),
              }"
              @click="handleCheatSheetItemClick(item.uniqueId, $event)"
            >
              <label class="cheatsheet-checkbox" @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedCheatSheetIds.includes(item.uniqueId)"
                  @click="handleCheckboxClick(item.uniqueId, $event)"
                />
                <span class="checkmark"></span>
              </label>

              <div class="cheatsheet-preview">
                <div class="cheatsheet-group-info">{{ item.groupInfo }}</div>
                <div
                  class="cheatsheet-text-preview"
                  v-html="ex(item.cheatSheet) || '暂无内容'"
                  @click="handleLinkClick"
                ></div>
              </div>
            </div>
          </div>

          <div
            style="
              text-align: right;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #eee;
            "
          >
            <button @click="closePrintCheatSheetModal" class="cancel-btn">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { files as api } from "@/api";
import HeaderBar from "@/components/header/HeaderBar.vue";
import * as auth from "@/utils/auth";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import localforage from "localforage";
import VueEasyLightbox from "vue-easy-lightbox";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { Boot } from "@wangeditor/editor";
import { pinyin } from "pinyin-pro";

export default {
  name: "mistakebook",
  components: {
    HeaderBar,
    VueEasyLightbox,
    Editor,
    Toolbar,
  },
  data() {
    return {
      // 页面状态
      dtCurrentPage: "home",
      dtCurrentMindMapIndex: -1,
      dtCurrentMindMapName: "",
      dtIsEditingName: false,
      // 所有思维导图数据
      dtMindMaps: [],
      // 当前思维导图的节点数据
      dtNodes: [],
      dtLines: [],
      dtPaths: [],
      dtSelectedNode: null,
      dtContainerWidth: 0,
      dtContainerHeight: 0,
      dtCanvasWidth: 2000,
      dtCanvasHeight: 2000,
      dtScale: 1,
      dtCanvasReady: false,
      dtMinScale: 0.1,
      dtMaxScale: 50,
      dtChildCount: {},
      dtCollapsedNodes: [],
      // 视图模式: mindmap | outline
      dtViewMode: "mindmap",
      // 撤销重做相关
      dtUndoStack: [],
      dtRedoStack: [],
      // 拖拽相关
      dtIsDragging: false,
      dtDragStartX: 0,
      dtDragStartY: 0,
      dtOffsetX: 0,
      dtOffsetY: 0,
      // resize 相关
      dtIsResizing: false,
      dtResizeNode: null,
      dtResizeStartX: 0,
      dtResizeStartY: 0,
      dtResizeStartWidth: 0,
      dtResizeStartHeight: 0,
      // 编辑相关
      dtEditingNode: null,
      dtEditingContent: "",
      // 注释编辑相关
      dtEditingDescriptionNode: null,
      dtEditingDescription: "",
      // 注释查看弹窗
      dtIsDescriptionViewOpen: false,
      dtCurrentDescriptionNode: null,
      // 附件相关
      dtIsAttachmentListOpen: false,
      dtCurrentAttachmentNode: null,
      // 标签相关
      dtIsTagEditorOpen: false,
      dtTagEditorNode: null,
      dtTagEditorContent: "",
      // 概要相关
      dtSummaries: [],
      dtSummaryLines: [],
      dtIsSummaryEditorOpen: false,
      dtSummaryStartNode: null,
      dtSummaryStartNodeId: "",
      dtSummaryEndNodeId: "",
      dtSummaryContent: "",
      dtSummaryEditingId: null,
      // 朗读相关
      dtIsSpeaking: false,
      dtSpeechUtterance: null,
      dtSearchMasteryEnabled: false,
      dtSearchMasteryMin: 1,
      dtSearchMasteryMax: 9,
      // 测验模式相关
      dtIsQuizMode: false,
      dtQuizNodes: [],
      dtQuizCurrentIndex: 0,
      dtQuizShowAnswer: false,
      dtIsQuizSettingsOpen: false,
      dtQuizAnswered: [],
      dtUseEbbinghaus: true,
      dtEbbinghausIntervals: "0 1 2 4 7 12 19 28",
      dtShuffleQuestions: false,
      dtQuestionType: "fill",
      dtMasteryLevelAnimating: "",
      dtQuizUserAnswers: {},
      dtAllBlankAnswers: [],
      // 设置相关
      dtIsSettingsOpen: false,
      dtSettings: {
        defaultFontSize: 14,
        defaultFontFamily: "Microsoft YaHei",
        maxNodeWidth: 20,
        maxNodeHeight: 15,
        levelGap: 100,
        nodeGap: 60,
        lineStyle: "diverge",
        expandDirection: "horizontal",
        theme: "default",
        showBorder: true,
      },
      // 搜索相关
      dtIsSearchOpen: false,
      dtSearchKeyword: "",
      dtSearchResults: [],
      dtSearchFavoritesOnly: false,
      dtSearchTag: "",
      dtSelectedTag: "",
      dtTagPanelCollapsed: true,
      // 导出相关
      dtIsExportOpen: false,
      // 导入相关
      dtIsImportOpen: false,
      // 节点拖拽相关
      dtIsNodeDragging: false,
      dtDragNode: null,
      dtNodeDragStartX: 0,
      dtNodeDragStartY: 0,
      dtDragStartNodeX: 0,
      dtDragStartNodeY: 0,
      dtTargetNode: null,
      dtDropZoneType: null, // 'sibling' | 'child'
      dtDragChildOffsets: null, // 拖拽时子节点的初始偏移记录
      dtDragStartSide: null, // 拖拽开始时一级节点的侧信息（双侧布局用
      // 双指缩放相关
      dtTouchStartDistance: 0,
      dtTouchStartScale: 1,
      // 性能优化相关
      dtUpdatePositionsPending: false,
      // 笔记相关
      dtNoteNode: null,
      dtNoteCollapsed: true,
      // 填空答案显示控制
      dtShowAllBlanks: false,
      showItem: null,
      batchQuestion: "",
      batchAnswer: "",
      batchAdd: false,
      isAnswerOpen: [],
      urla: "",
      oldV: "",
      new: "",
      editHaveNow: 0,
      showQ: [],
      onOffline: Number(window.localStorage.getItem("isOffline")) == 1,
      editAnswer: 0,
      msg: "",
      addToday: new Date().toLocaleDateString("sv-SE"),
      showPrintCheatSheetModal: false,
      selectedCheatSheetIds: [],
      printCheatSheetData: [],
      cheatSheetExpanded: {},
      isAllCheatSheetExpanded: true,
      showCheatSheetModal: false,
      editingCheatSheetIndex: -1,
      editingCheatSheetItemIndex: -1,
      cheatSheetForm: {
        user: "",
        subject: "",
        cheatSheet: "",
      },
      editorCheatSheet: null,
      processing: false,
      isSaving: false,
      subjectSummaryExpanded: {},
      isAllSubjectSummaryExpanded: true,
      showQuestionEditor: false,
      showQuestionEditorHelp: false,
      editingQuestionContent: "",
      currentEditingTestIndex: -1,
      editorQuestion: null,
      excludedKeyWord: "",
      correctDays: 5,
      testTimes: 3,
      testInterval: "0 7 14 30 50 80 120 180",
      isWaitingForClick: false,
      continueClickListener: null,
      autoPauseAfterReading: false,
      currentUtterance: null,
      speechState: {
        isPaused: false,
        isSpeaking: false,
      },
      isReadingCard: false,
      currentReadingCardIndex: 0,
      currentReadingCardText: "",
      isAllCardGroupsExpanded: false,
      expandedCardGroups: new Set(),
      expandedCardIds: new Set(),
      inputText: "",
      resultText: "",
      options: {
        withTone: true,
      },
      showToast: false,
      showPinYinTool: false,
      filteredTestMistaker: [],
      showTestFilterPanel: false,
      testFilterForm: {
        keyword: "",
        user: "",
        subject: "",
        lastWrong: false,
        excludeTodayTested: true,
        excludeFiveCorrect: false,
        lessThan1: false,
        allowInterval: true,
        fav: false,
        specialIL: false,
        importantLevel: 0,
      },
      currentTestIndex: 0,
      showAnswer: false,
      testResult: null,
      isTesting: false,
      testRound: 1,
      groupNumber: 10,
      testLength: 0,
      isReview: false,
      testAllList: [],
      wrongNum: 0,
      roundDone: false,
      listViewMode: "flat",
      selectedTreePath: "",
      expandedTreeNodes: new Set(),
      imageListeners: [],
      serverModifiedTime: 0,
      lastModifiedTime: 0,
      fromPage: "",
      selectedSimilarIds: [],
      showPaperPreview: false,
      selectedSimilarItems: [],
      reverseList: true,
      cons: true,
      onOff: false,
      timeOutId1: null,
      autoSync: window.localStorage.getItem("autoSync") == "true" || false,
      showTool: window.localStorage.getItem("showTool") == "true" || false,
      showAllAnswer:
        window.localStorage.getItem("showAllAnswer") == "true" || false,
      isReadingQuestionTypeSummary: false,
      currentReadingQuestionTypeIndex: -1,
      tItem: null,
      isQuestionTypeSummaryFilterOpen: false,
      questionTypeSummaryFilterForm: {
        keyword: "",
        importantLevelStart: 0,
        importantLevelEnd: 8,
      },
      questionTypeSummaryCollapsed: {},
      isQuestionTypeSummaryAllExpanded: true,
      isEditingSubjectSummary: false,
      showTaskModal: false,
      isEditingTask: false,
      editingTaskIndex: -1,
      taskForm: {
        subject: "",
        subClass: "",
        questionType: "",
        improveMethod: "",
      },
      taskFormErrors: {
        subject: "",
        subClass: "",
        questionType: "",
      },
      sections: {
        mistakeItem: false,
        questionCard: false,
        questionTypeSum: false,
        improveMethod: false,
        similar: false,
        trap: false,
        cheatsheet: false,
        answerAnalysis: false,
        analysis: false,
        marks: false,
      },
      subjectClicked: "",
      lightboxImgsFinal: null,
      editor: null,
      editor1: null,
      editor2: null,
      editor3: null,
      editor4: null,
      editor5: null,
      editor7: null,
      toolbarConfig: {
        excludeKeys: ["uploadVideo", "fullScreen", "insertVideo"],
        insertKeys: {
          index: 0,
          keys: ["myBlank", "myQ", "myMenu", "divider", "fontSize"],
        },
      },
      editorConfig1: {
        placeholder: "请输入此科目的学习要点、重点难点、学习方法等...",
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },
      editorConfig2: {
        placeholder:
          "用于填写考前需快速回顾的易错点等...（此输入框支持直接粘贴图片）",
        autoFocus: true,
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },
      editorConfig3: {
        placeholder:
          "请输入错题解析（写明做题时为什么错？以后怎样避免？出题人想考什么？希望考生犯什么错？并总结：正确思路(思考路线入手点：从已知条件向后推、从所求向前推）；解题方法（如求极值有几种方法、求三角形面积有几种方法等，本题用的是哪种方法，如何才能想到用这种方法）；一题多解等等......最后用彩色加粗标明本题'注意点'，并给别人复述正确思路。错题分析越透彻，学习越轻松！",
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },
      editorConfig4: {
        placeholder: "请粘贴错题图片，或输入错题文字描述...",
        // autoFocus: false,
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 1000 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },
      editorConfig5: {
        placeholder: "同类新题，可用于生成新试卷：文字描述（可选）",
        // autoFocus: false,
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },
      editorConfig6: {
        placeholder: "请填写答案。",
        // autoFocus: false,
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },

      editorConfig7: {
        placeholder: "解析：可用于记录每次复习和测验中所犯错误。",
        // autoFocus: false,
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },

      editorConfig: {
        placeholder: "请输入错题的原题题目或新的同类题目（不含答案）",
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024, // 100M 以下插入 base64
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },

      editorConfigQuestion: {
        placeholder: "请输入...",
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024,
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },

      editorConfigCheatSheet: {
        placeholder: "请输入速记要点、公式、关键知识点等...",
        MENU_CONF: {
          uploadImage: {
            fieldName: "your-fileName",
            base64LimitSize: 100 * 1024 * 1024,
          },
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "24px",
              "30px",
              "36px",
              "48px",
            ],
          },
        },
      },

      collapsedStates: {
        subject: {},
        subClass: {},
        questionType: {},
      },
      isAllExpanded: false,
      finalSubjectSummary: [],
      finalQuestionTypeSummary: [],
      showCSModal: false,
      finalCheatSheet: [],
      isEditingCheatSheet: false,
      showSubjectSummaryModal: false,
      showQuestionTypeSummaryModal: false,
      questionTypeImgUrls: [],
      isSplitting: false,
      cropAsNewImage: true,
      angle: 90,
      selectedDate: "",
      fromPic: 0,
      imgSrc: "",
      cropper: null,
      tempIndex: 0,
      isReading: false,
      currentReadingIndex: -1,
      isFilterOpen: false,
      tempUser: "",
      tempSubject: "",
      tempSubClass: "",
      tempQuestiontype: "",
      currentView: "home",
      isEditing: false,
      editingId: null,
      mistaker: [],
      filteredMistaker: [],
      taskList: [],
      backupFiles: [],
      showSettingModal: false,
      showImageViewer: false,
      cardImageClickTimer: null,
      cardImageClickCount: 0,
      form: {
        addDate: "",
        user: "",
        subject: "",
        subClass: "",
        originalText: "",
        originalImgUrls: [],
        question: "",
        answer: "",
        questionTypeImgUrls: [],
        errorReasonImgUrls: [],
        questionType: "",
        questionTypeSummary: "",
        subjectSummary: "",
        subjectImgUrls: [],
        trap: "",
        trapDetail: "",
        errorType: "",
        errorReason: "",
        correctIdea: "",
        improveMethod: "",
        similarText: "",
        similarImgUrls: [],
        importantLevel: 0,
      },
      filterForm: {
        id: "",
        user: "",
        startDate: "",
        endDate: "",
        subject: "",
        keyword: "",
        fav: false,
        hasCards: true,
        specialIL: true,
        importantLevel: 0,
      },
    };
  },
  computed: {
    ...mapState(["req", "user"]),
    allowSync() {
      return this.autoSync && !this.onOffline;
    },
    dtVisibleNodes() {
      return this.dtNodes.filter((node) => !this.dtIsNodeHidden(node));
    },
    dtFilteredLines() {
      return this.dtLines.filter((line) => line.type !== "curve");
    },
    dtConnectionLines() {
      const connections = [];
      const defaultNodeWidth = 120;
      const defaultNodeHeight = 40;
      const getNodeWidth = (node) => node.width || defaultNodeWidth;
      const getNodeHeight = (node) => node.height || defaultNodeHeight;

      // 收集所有带包裹符号的节点
      // 匹配规则：$文本$ 不显示箭头，$$文本$$ 显示箭头
      // groups[key] = [{node, key, prefix, suffix}, ...]
      const groups = {};
      this.dtNodes.forEach((node) => {
        if (!node.description) return;

        // 使用两个独立的正则分别匹配 $$...$$ 和 $...$
        // 先匹配 $$...$$ 格式
        let regex = /\$\$([^$]+)\$\$/g;
        let match;
        while ((match = regex.exec(node.description)) !== null) {
          const key = match[1]; // $$之间的文本
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push({ node, key, prefix: "$$", suffix: "$$" });
        }

        // 再匹配 $...$ 格式（需要排除已被 $$...$$ 匹配的部分）
        regex = /\$([^$]+)\$/g;
        const doubleDollarRanges = [];
        // 重新执行以获取 $$...$$ 的范围
        regex = /\$\$([^$]+)\$\$/g;
        while ((match = regex.exec(node.description)) !== null) {
          doubleDollarRanges.push({
            start: match.index,
            end: match.index + match[0].length,
          });
        }

        regex = /\$([^$]+)\$/g;
        while ((match = regex.exec(node.description)) !== null) {
          const matchStart = match.index;
          const matchEnd = matchStart + match[0].length;
          // 检查是否与 $$...$$ 范围重叠
          const isOverlapping = doubleDollarRanges.some(
            (range) =>
              (matchStart >= range.start && matchStart < range.end) ||
              (matchEnd > range.start && matchEnd <= range.end)
          );
          if (isOverlapping) continue;

          const key = match[1];
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push({ node, key, prefix: "$", suffix: "$" });
        }
      });

      // 对每组中超过1个节点的，只取前两个节点绘制关联线
      Object.keys(groups).forEach((key) => {
        const nodes = groups[key];
        if (nodes.length < 2) return;
        const nodeInfoA = nodes[0];
        const nodeInfoB = nodes[1];
        const nodeA = nodeInfoA.node;
        const nodeB = nodeInfoB.node;

        // 计算两个节点的中心点
        const cx1 = nodeA.x + getNodeWidth(nodeA) / 2;
        const cy1 = nodeA.y + getNodeHeight(nodeA) / 2;
        const cx2 = nodeB.x + getNodeWidth(nodeB) / 2;
        const cy2 = nodeB.y + getNodeHeight(nodeB) / 2;

        // 计算从节点A到节点B的角度
        const angle1 = Math.atan2(cy2 - cy1, cx2 - cx1);
        const angle2 = Math.atan2(cy1 - cy2, cx1 - cx2);

        // 计算节点边缘上的连接点
        const w1 = getNodeWidth(nodeA);
        const h1 = getNodeHeight(nodeA);
        const w2 = getNodeWidth(nodeB);
        const h2 = getNodeHeight(nodeB);

        const dx1 = Math.cos(angle1);
        const dy1 = Math.sin(angle1);
        const dx2 = Math.cos(angle2);
        const dy2 = Math.sin(angle2);

        const dist1 = Math.min(
          w1 / 2 / Math.abs(dx1) || Infinity,
          h1 / 2 / Math.abs(dy1) || Infinity
        );
        const dist2 = Math.min(
          w2 / 2 / Math.abs(dx2) || Infinity,
          h2 / 2 / Math.abs(dy2) || Infinity
        );

        const x1 = cx1 + dx1 * dist1;
        const y1 = cy1 + dy1 * dist1;
        const x2 = cx2 + dx2 * dist2;
        const y2 = cy2 + dy2 * dist2;

        connections.push({
          id: `conn-${key}`,
          x1,
          y1,
          x2,
          y2,
          // 记录每个端点的包裹符号类型，用于决定是否显示箭头
          // '$' 表示该端点不显示箭头，'$$' 表示显示箭头
          end1Prefix: nodeInfoA.prefix,
          end1Suffix: nodeInfoA.suffix,
          end2Prefix: nodeInfoB.prefix,
          end2Suffix: nodeInfoB.suffix,
        });
      });

      return connections;
    },
    dtRootNodesCount() {
      return this.dtNodes.filter((n) => n.level === 1).length;
    },
    dtIsRealNodeSelected() {
      return (
        this.dtSelectedNode && !this.dtSelectedNode.id.startsWith("summary_")
      );
    },
    dtQuizCurrentNode() {
      if (this.dtQuizNodes.length === 0) return null;
      return this.dtQuizNodes[this.dtQuizCurrentIndex] || null;
    },
    dtQuizCurrentAnswered() {
      if (!this.dtQuizCurrentNode) return false;
      return this.dtQuizAnswered.includes(this.dtQuizCurrentNode.quizId);
    },
    dtQuizCurrentMasteryLevel() {
      if (!this.dtQuizCurrentNode) return "-";
      const quizItem = this.dtQuizCurrentNode;
      const node = quizItem.node;
      if (quizItem.quizType === "nodeDescription") {
        return node.descriptionMastery ? node.descriptionMastery.level : "-";
      } else {
        return node.masteryLevel ? node.masteryLevel.level : "-";
      }
    },
    dtQuizCurrentTitle() {
      if (!this.dtQuizCurrentNode) return "";
      const quizItem = this.dtQuizCurrentNode;
      const node = quizItem.node;
      switch (quizItem.quizType) {
        case "nodeContent":
          return node.id;
        case "nodeDescription":
          return node.id + " 注释";
        case "note":
          return "笔记";
        case "summary":
          return "概要";
        default:
          return node.id;
      }
    },
    dtQuizCurrentCorrectAnswer() {
      if (!this.dtQuizCurrentNode) return "";
      const quizItem = this.dtQuizCurrentNode;
      const regex = /[＊*]{2}([^＊*]+)[＊*]{2}/g;
      const answers = [];
      let match;
      let content = "";
      switch (quizItem.quizType) {
        case "nodeContent":
          content = quizItem.node.content;
          break;
        case "nodeDescription":
          content = quizItem.node.description;
          break;
        case "note":
          content = this.dtNoteNode?.content || "";
          break;
        case "summary":
          content = quizItem.node.content;
          break;
        default:
          content = quizItem.content;
      }
      regex.lastIndex = 0;
      while ((match = regex.exec(content)) !== null) {
        answers.push(match[1]);
      }
      return answers.join(" / ");
    },
    dtQuizIsChoiceCorrect() {
      if (!this.dtQuizCurrentNode) return false;
      const quizItem = this.dtQuizCurrentNode;
      const userAnswer = this.dtQuizUserAnswers[quizItem.quizId];
      if (!userAnswer) return false;
      return userAnswer === this.dtQuizCurrentCorrectAnswer;
    },
    dtQuizContent() {
      if (!this.dtQuizCurrentNode) return "";
      const quizItem = this.dtQuizCurrentNode;
      const regex = /[＊*]{2}([^＊*]+)[＊*]{2}/g;
      let content = "";
      switch (quizItem.quizType) {
        case "nodeContent":
          content = quizItem.node.content;
          break;
        case "nodeDescription":
          content = quizItem.node.description;
          break;
        case "note":
          content = this.dtNoteNode?.content || "";
          break;
        case "summary":
          content = quizItem.node.content;
          break;
        default:
          content = quizItem.content;
      }

      const showAnswer =
        this.dtQuizShowAnswer ||
        (quizItem.displayType === "choice" &&
          this.dtQuizUserAnswers[quizItem.quizId]);

      if (!showAnswer) {
        content = content.replace(regex, (match, answer) => {
          return `<span class="dt-blank">${answer}</span>`;
        });
      } else {
        content = content.replace(regex, (match, answer) => {
          return `<span class="dt-blank dt-blank-show">${answer}</span>`;
        });
      }
      // 如果是节点内容题，且已显示答案，且节点有注释，则追加显示注释内容
      if (showAnswer && quizItem.quizType === "nodeContent") {
        const node = quizItem.node;
        if (node.description) {
          let descContent = node.description;
          descContent = descContent.replace(regex, (match, answer) => {
            return `<span class="dt-blank dt-blank-show">${answer}</span>`;
          });
          content += `<div class="dt-quiz-description"><div class="dt-quiz-desc-label">注释：</div><div class="dt-quiz-desc-content">${descContent}</div></div>`;
        }
      }
      return content;
    },
    dtIsAllExpanded() {
      return this.dtCollapsedNodes.length === 0;
    },
    dtIsAllCollapsed() {
      const nonRootNodes = this.dtNodes.filter((n) => n.level > 1);
      return nonRootNodes.every((n) => this.dtCollapsedNodes.includes(n.id));
    },
    dtOutlineNodes() {
      const visibleNodes = this.dtNodes.filter(
        (node) => !this.dtIsNodeHidden(node)
      );
      const sortedNodes = [];
      const rootNodes = visibleNodes.filter((n) => n.level === 1);
      const sortedRoots = [...rootNodes].sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true })
      );
      const buildTree = (parentId) => {
        const children = visibleNodes
          .filter((n) => n.parentId === parentId)
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          );
        children.forEach((child) => {
          sortedNodes.push(child);
          buildTree(child.id);
        });
      };
      sortedRoots.forEach((root) => {
        sortedNodes.push(root);
        buildTree(root.id);
      });
      return sortedNodes;
    },
    dtNodeLevelNumbers() {
      const levelNumbers = {};
      const rootNodes = this.dtNodes.filter((n) => n.level === 1);
      rootNodes.forEach((root, rootIndex) => {
        levelNumbers[root.id] = null;
        const assignLevelNumber = (parentId, parentNumber, level) => {
          const children = this.dtNodes
            .filter((n) => n.parentId === parentId)
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          children.forEach((child, index) => {
            const currentNumber =
              level === 1 ? String(index + 1) : `${parentNumber}.${index + 1}`;
            levelNumbers[child.id] = currentNumber;
            assignLevelNumber(child.id, currentNumber, level + 1);
          });
        };
        assignLevelNumber(root.id, String(rootIndex + 1), 1);
      });
      return levelNumbers;
    },
    dtAllTags() {
      const allTags = new Set();
      this.dtNodes.forEach((node) => {
        if (node.tags && Array.isArray(node.tags)) {
          node.tags.forEach((tag) => {
            if (tag && tag.trim()) allTags.add(tag.trim());
          });
        }
      });
      return Array.from(allTags).sort();
    },
    dtFavoriteCount() {
      return this.dtNodes.filter(
        (n) => n.isFavorite && !n.id.startsWith("summary_")
      ).length;
    },
    dtSummaryStartOptions() {
      if (!this.dtSummaryStartNode) return [];
      const parentId = this.dtSummaryStartNode.parentId;
      if (!parentId) return [];
      const siblings = this.dtNodes
        .filter((n) => n.parentId === parentId && !n.id.startsWith("summary_"))
        .sort((a, b) => a.y - b.y);
      return siblings;
    },
    dtSummarySiblingOptions() {
      if (!this.dtSummaryStartNodeId) return [];
      const startNode = this.dtNodes.find(
        (n) => n.id === this.dtSummaryStartNodeId
      );
      if (!startNode) return [];
      const parentId = startNode.parentId;
      if (!parentId) return [];
      const siblings = this.dtNodes
        .filter((n) => n.parentId === parentId && !n.id.startsWith("summary_"))
        .sort((a, b) => a.y - b.y);
      const startIdx = siblings.findIndex(
        (n) => n.id === this.dtSummaryStartNodeId
      );
      if (startIdx < 0) return [];
      return siblings.slice(startIdx + 1);
    },
    dtVisibleSummaries() {
      // 引用dtSelectedNode以触发Vue 2响应式更新
      void this.dtSelectedNode;
      return this.dtSummaries.filter((s) => {
        if (!s.startNodeId) return false;
        const startNode = this.dtNodes.find((n) => n.id === s.startNodeId);
        if (!startNode || this.dtIsNodeHidden(startNode)) return false;
        const endNodeId = s.endNodeId || s.startNodeId;
        const endNode = this.dtNodes.find((n) => n.id === endNodeId);
        if (!endNode || this.dtIsNodeHidden(endNode)) return false;
        return true;
      });
    },
    showMistaker() {
      let list = this.filteredMistaker.length > 0 ? this.filteredMistaker : [];
      if (!this.filterForm.hasCards)
        list = list.filter(
          (item) =>
            item?.question.replace(/<[^>]*>/g, "").trim().length == 0 &&
            !/(img|video|audio)/i.test(item.question || "")
        );
      if (this.filterForm.specialIL) {
        list = list.filter(
          (item) => item?.importantLevel == this.filterForm.importantLevel
        );
      }

      if (!this.reverseList) return list;
      else return list.slice().sort((a, b) => b.id - a.id);
    },
    filteredSimilarItems() {
      return this.mistaker.filter(
        (item) =>
          (item.similarText && item.similarText.trim()) ||
          (item.similarImgUrls && item.similarImgUrls.length > 0)
      );
    },
    currentReadingCard() {
      if (
        this.currentReadingCardIndex >= 0 &&
        this.currentReadingCardIndex < this.questionCards.length
      ) {
        return this.questionCards[this.currentReadingCardIndex];
      }
      return null;
    },
    forageName() {
      return "user-" + this.user.username + "-mistakebook";
    },
    questionTypeMapFiltered() {
      let result = { ...this.questionTypeMap };
      const keywordStr = this.questionTypeSummaryFilterForm.keyword
        .trim()
        .toLowerCase();
      if (keywordStr) {
        const keywords = keywordStr?.split(/\s+/).filter(Boolean);
        if (keywords.length > 0) {
          Object.keys(result).forEach((key) => {
            const item = result[key];
            const searchText = [key, item.summary || ""]
              .join(" ")
              .toLowerCase();
            const hasAllKeywords = keywords.every((keyword) =>
              searchText.includes(keyword)
            );
            if (!hasAllKeywords) {
              delete result[key];
            }
          });
        }
      }
      const startLevel = this.questionTypeSummaryFilterForm.importantLevelStart;
      const endLevel = this.questionTypeSummaryFilterForm.importantLevelEnd;

      if (startLevel || endLevel) {
        Object.keys(result).forEach((key) => {
          const item = result[key];
          const level = item.importantLevel || 0;

          if (startLevel && !endLevel) {
            if (level < startLevel) delete result[key];
          } else if (!startLevel && endLevel) {
            if (level > endLevel) delete result[key];
          } else if (startLevel && endLevel) {
            if (level < startLevel || level > endLevel) delete result[key];
          }
        });
      }
      const sortedEntries = Object.entries(result)
        .map(([key, value]) => {
          const summaryItem = this.finalQuestionTypeSummary.find(
            (item) =>
              item.subject?.trim() +
                "►" +
                item.subClass?.trim() +
                "►" +
                item.questionType?.trim() ===
              key
          );

          return {
            key,
            value: {
              ...value,
              dIndex: summaryItem?.dIndex || 0,
            },
          };
        })
        .sort((a, b) => b.value.dIndex - a.value.dIndex);

      return sortedEntries;
    },

    uniqueSubClasses() {
      if (!this.form.subject?.trim() || !this.form.user?.trim()) {
        return [];
      }
      const currentSubject = this.form.subject.trim();

      const subClassesFromMistaker = [
        ...new Set(
          this.mistaker
            .filter((item) => item.subject?.trim() === currentSubject)
            .map((item) => item.subClass?.trim())
            .filter(Boolean)
        ),
      ];

      const subClassesFromSummary = [
        ...new Set(
          this.finalQuestionTypeSummary
            .filter((item) => item.subject?.trim() === currentSubject)
            .map((item) => item.subClass?.trim())
            .filter(Boolean)
        ),
      ];

      return [
        ...new Set([...subClassesFromMistaker, ...subClassesFromSummary]),
      ].sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
    },

    questionCards() {
      let result = this.mistaker.filter(
        (item) =>
          !(
            item.question?.replace(/<[^>]*>/g, "").trim() == "" &&
            !/(img)/i.test(item.question || "")
          )
      );
      if (this.reverseList) result.reverse();
      const today = new Date().toLocaleDateString("sv-SE");
      const today1 = new Date();
      today1.setHours(0, 0, 0, 0); // 把时分秒毫秒都置为0，得到今天0点
      const todayTimestamp = today1.getTime();
      // 关键字筛选
      const keywordStr = this.testFilterForm.keyword?.trim().toLowerCase();
      if (keywordStr) {
        const keywords = keywordStr?.split(/\s+/).filter(Boolean);

        if (keywords.length > 0) {
          result = result.filter((item) => {
            const searchText = [
              item.originalText || "",
              item.question || "",
              item.answer || "",
              item.errorReason || "",
              item.similarText || "",
              item.trap || "",
              item.correctIdea || "",
              item.improveMethod || "",
              item.subClass || "",
              item.questionType || "",
              item.errorType || "",
            ]
              .join(" ")
              .toLowerCase();
            return keywords.every((keyword) => searchText.includes(keyword));
          });
        }
      }

      if (this.excludedKeyWord.trim()) {
        const exKeyword = this.excludedKeyWord.trim().toLowerCase();
        result = result.filter((item) => {
          const searchText1 = [
            item.question || "",
            item.answer || "",
            item.correctIdea || "",
            item.subClass || "",
            item.questionType || "",
          ]
            .join(" ")
            .toLowerCase();
          return !(searchText1 || "").includes(exKeyword);
        });
      }

      // 今日测试到期题卡筛选
      if (this.testFilterForm.allowInterval) {
        result = result.filter((item) => {
          if (item.reviewDate == 0) item.reviewDate = "0,0";
          item.reviewDate = String(item.reviewDate || "0,0");
          const a = Number(item.reviewDate.split(",")[0]);
          const aDate = new Date(a);
          aDate.setHours(0, 0, 0, 0);
          const aTimestamp = aDate.getTime();
          const timeDiff = todayTimestamp - aTimestamp;
          const dayDiff = Math.floor(Math.abs(timeDiff) / 86400000); // 取绝对值后向下取整
          if (!item.reviewResult) item.reviewResult = [];
          if (!this.testInterval) this.testInterval = "0 7 14 30 50 80 120 180";
          if (
            item.reviewResult &&
            this.testInterval?.split(" ")[item.reviewResult?.length] &&
            this.testInterval?.split(" ")[item.reviewResult?.length] <= dayDiff
          )
            return true;
          else return false;
        });
      }
      if (this.testFilterForm.user.trim()) {
        const user = this.testFilterForm.user.trim().toLowerCase();
        result = result.filter((item) =>
          item.user.toLowerCase().includes(user)
        );
      }
      if (this.testFilterForm.subject.trim()) {
        const subject = this.testFilterForm.subject.trim().toLowerCase();
        result = result.filter((item) =>
          item.subject.toLowerCase().includes(subject)
        );
      }

      // 排除今日已测试
      if (this.testFilterForm.excludeTodayTested) {
        result = result.filter((item) => {
          if (item.reviewDate == 0) item.reviewDate = "0,0";
          if (!item.reviewDate || Number(item.reviewDate.split(",")[0]) == 0)
            return true;
          const testDate = new Date(
            Number(item.reviewDate.split(",")[0])
          ).toLocaleDateString("sv-SE");
          return testDate !== today;
        });
      }

      if (this.testFilterForm.fav) {
        result = result.filter((item) => {
          const statusPart = String(item.reviewDate).split(",")[1];
          if (statusPart && Number(statusPart) == 1) {
            return true;
          } else {
            return false;
          }
        });
      }

      if (this.testFilterForm.specialIL) {
        result = result.filter((item) => {
          if (item.importantLevel == this.testFilterForm.importantLevel) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (this.testFilterForm.lastWrong) {
        result = result.filter((item) => {
          if (!item.reviewResult || item.reviewResult.length === 0) {
            return false;
          }
          return item.reviewResult.includes(0);
        });
      }

      if (this.testFilterForm.lessThan1) {
        result = result.filter((item) => {
          if (!item.reviewResult || item.reviewResult?.length < this.testTimes)
            return true;
          else return false;
        });
      }

      if (this.testFilterForm.excludeFiveCorrect) {
        result = result.filter((item) => {
          if (!item.reviewResult || !Array.isArray(item.reviewResult))
            return true;
          let continuousCorrectCount = 0;
          for (let i = item.reviewResult.length - 1; i >= 0; i--) {
            if (item.reviewResult[i] === 1) {
              continuousCorrectCount++;
            } else {
              break;
            }
          }
          return continuousCorrectCount < this.correctDays;
        });
      }
      return result;
    },
    uniqueQuestionTypes() {
      if (
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.user?.trim()
      ) {
        return [];
      }
      const currentSubject = this.form.subject.trim();
      const currentSubClass = this.form.subClass.trim();

      const questionTypesFromMistaker = [
        ...new Set(
          this.mistaker
            .filter(
              (item) =>
                item.subject?.trim() === currentSubject &&
                item.subClass?.trim() === currentSubClass
            )
            .map((item) => item.questionType?.trim())
            .filter(Boolean)
        ),
      ];

      const questionTypesFromSummary = [
        ...new Set(
          this.finalQuestionTypeSummary
            .filter(
              (item) =>
                item.subject?.trim() === currentSubject &&
                item.subClass?.trim() === currentSubClass
            )
            .map((item) => item.questionType?.trim())
            .filter(Boolean)
        ),
      ];

      return [
        ...new Set([...questionTypesFromMistaker, ...questionTypesFromSummary]),
      ].sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
    },

    isAllTreeNodesExpanded() {
      if (this.treeNavigationData.length === 0) return true;
      let expectedCount = 0;
      this.treeNavigationData.forEach((subject) => {
        expectedCount++;
        expectedCount += subject.children.length;
      });

      return this.expandedTreeNodes.size >= expectedCount;
    },
    isAllTreeNodesCollapsed() {
      return this.expandedTreeNodes.size === 0;
    },
    uniqueErrorTypes() {
      const defaultErrorTypes = [
        "马虎",
        "审题失误",
        "陷阱",
        "概念不清",
        "知识遗忘",
        "思路错误",
        "易错",
        "时间不足",
        "存疑",
      ];

      if (
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        return defaultErrorTypes;
      }

      const currentSubject = this.form.subject.trim();
      const currentSubClass = this.form.subClass.trim();
      const currentQuestionType = this.form.questionType.trim();

      const filteredErrorTypes = [];

      this.mistaker.forEach((item) => {
        if (
          item.subject?.trim() === currentSubject &&
          item.subClass?.trim() === currentSubClass &&
          item.questionType?.trim() === currentQuestionType &&
          item.errorType?.trim()
        ) {
          const errorTypeArr = item.errorType
            .trim()
            ?.split(/\s+/)
            .filter(Boolean);
          filteredErrorTypes.push(...errorTypeArr);
        }
      });
      const combinedTypes = [...defaultErrorTypes, ...filteredErrorTypes];
      return [...new Set(combinedTypes)].sort((a, b) =>
        a.localeCompare(b, "zh-CN", { numeric: true })
      );
    },

    isMobile() {
      return window.innerWidth < 736;
    },
    uniqueUsers() {
      const userFromMistaker = [
        ...new Set(
          this.mistaker.map((item) => item.user?.trim()).filter(Boolean)
        ),
      ];

      return [...new Set([...userFromMistaker])].sort((a, b) =>
        a.localeCompare(b, "zh-CN", { numeric: true })
      );
    },
    uniqueSubjects() {
      const subjectsFromMistaker = [
        ...new Set(
          this.mistaker.map((item) => item.subject?.trim()).filter(Boolean)
        ),
      ];

      const subjectsFromSummary = [
        ...new Set(
          this.finalQuestionTypeSummary
            .map((item) => item.subject.trim())
            .filter(Boolean)
        ),
      ];

      return [...new Set([...subjectsFromMistaker, ...subjectsFromSummary])];
    },
    uniqueQuestionType() {
      const questionTypeFromMistaker = [
        ...new Set(
          this.mistaker.map((item) => item.questionType?.trim()).filter(Boolean)
        ),
      ];

      const questionTypeFromSummary = [
        ...new Set(
          this.finalQuestionTypeSummary
            .map((item) => item.questionType.trim())
            .filter(Boolean)
        ),
      ];

      return [
        ...new Set([...questionTypeFromMistaker, ...questionTypeFromSummary]),
      ].sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
    },

    questionTypeMap() {
      const map = {};
      this.finalQuestionTypeSummary.forEach((item) => {
        if (item.questionType?.trim() && item.questionTypeSummary) {
          const type =
            item.subject?.trim() +
            "►" +
            item.subClass?.trim() +
            "►" +
            item.questionType?.trim();
          if (!map[type]) {
            map[type] = {
              img: item.questionTypeImgUrls || "",
              summary: item.questionTypeSummary || "",
              errorIds: [],
              importantLevel: item.importantLevel,
            };
          }
          map[type].errorIds.push(item.id);
          // 如果当前错题有总结且不为空，则更新总结（取最新的非空总结）
          if (item.questionTypeSummary?.trim()) {
            map[type].summary = item.questionTypeSummary;
          }
          if (item.questionTypeImgUrls) {
            map[type].img = item.questionTypeImgUrls;
          }
          map[type].importantLevel = item.importantLevel;
        }
      });
      return map;
    },
    groupedMistaker() {
      if (!this.showMistaker.length) return [];
      const sorted = [...this.showMistaker].sort((a, b) => {
        const subjectCompare = (a.subject || "未分类").localeCompare(
          b.subject || "未分类"
        );
        if (subjectCompare !== 0) return subjectCompare;
        // 考点排序
        const subClassCompare = (a.subClass || "未分类").localeCompare(
          b.subClass || "未分类"
        );
        if (subClassCompare !== 0) return subClassCompare;

        // 题型排序
        return (a.questionType || "未分类").localeCompare(
          b.questionType || "未分类"
        );
      });

      // 分组逻辑
      const grouped = [];

      sorted.forEach((item) => {
        const subject = item.subject || "未分类";
        const subClass = item.subClass || "未分类";
        const questionType = item.questionType || "未分类";

        // 查找或创建科目分组
        let subjectGroup = grouped.find((g) => g.subject === subject);
        if (!subjectGroup) {
          subjectGroup = {
            subject,
            errors: [],
            subClasses: [],
          };
          grouped.push(subjectGroup);
        }
        subjectGroup.errors.push(item);

        // 查找或创建考点分组
        let subClassGroup = subjectGroup.subClasses.find(
          (g) => g.subClass === subClass
        );
        if (!subClassGroup) {
          subClassGroup = {
            subClass,
            errors: [],
            questionTypes: [],
          };
          subjectGroup.subClasses.push(subClassGroup);
        }
        subClassGroup.errors.push(item);

        // 查找或创建题型分组
        let questionTypeGroup = subClassGroup.questionTypes.find(
          (g) => g.questionType === questionType
        );
        if (!questionTypeGroup) {
          questionTypeGroup = {
            questionType,
            errors: [],
          };
          subClassGroup.questionTypes.push(questionTypeGroup);
        }
        questionTypeGroup.errors.push(item);
      });

      return grouped;
    },
    msg0() {
      if (this.editHaveNow == 1) return "已有用户重命名";
      else if (this.editHaveNow == 2) return "已有科目重命名";
      else if (this.editHaveNow == 3) return "已有考点重命名";
      else if (this.editHaveNow == 4) return "已有题型重命名";
      else return "";
    },
    msg1() {
      if (this.editHaveNow == 1) return "已有用户名：";
      else if (this.editHaveNow == 2) return "已有科目名：";
      else if (this.editHaveNow == 3) return "已有考点名：";
      else if (this.editHaveNow == 4) return "已有题型名：";
      else return "";
    },

    uniqueTraps() {
      return [
        ...new Set(
          this.mistaker.map((item) => item.trap?.trim()).filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
    },

    treeNavigationData() {
      // 按科目分组
      const subjectMap = new Map();

      this.showMistaker.forEach((item) => {
        const subject = item.subject || "未分类科目";
        const subClass = item.subClass || "未分类考点";
        const questionType = item.questionType || "未分类题型";

        if (!subjectMap.has(subject)) {
          subjectMap.set(subject, {
            name: subject,
            type: "subject",
            children: new Map(),
            count: 0,
          });
        }

        const subjectNode = subjectMap.get(subject);
        subjectNode.count++;

        if (!subjectNode.children.has(subClass)) {
          subjectNode.children.set(subClass, {
            name: subClass,
            type: "subClass",
            children: new Map(),
            count: 0,
            parent: subject,
          });
        }

        const subClassNode = subjectNode.children.get(subClass);
        subClassNode.count++;

        if (!subClassNode.children.has(questionType)) {
          subClassNode.children.set(questionType, {
            name: questionType,
            type: "questionType",
            items: [],
            count: 0,
            parent: `${subject} > ${subClass}`,
          });
        }

        const questionTypeNode = subClassNode.children.get(questionType);
        questionTypeNode.count++;
        questionTypeNode.items.push(item);
      });

      // ..
      return Array.from(subjectMap.values()).map((subject) => ({
        ...subject,
        children: Array.from(subject.children.values()).map((subClass) => ({
          ...subClass,
          children: Array.from(subClass.children.values()).map(
            (questionType) => ({
              ...questionType,
              path: `${subject.name}|${subClass.name}|${questionType.name}`,
            })
          ),
        })),
      }));
    },
    groupedQuestionCards() {
      const groups = {};

      this.questionCards.forEach((card) => {
        const groupKey = `${card.user || "未分类用户"}-${
          card.subject || "未分类科目"
        }-${card.subClass || "未分类考点"}-${
          card.questionType || "未分类题型"
        }`;

        if (!groups[groupKey]) {
          groups[groupKey] = {
            key: groupKey,
            user: card.user || "未分类用户",
            subject: card.subject || "未分类科目",
            subClass: card.subClass || "未分类考点",
            questionType: card.questionType || "未分类题型",
            cards: [],
          };
        }

        groups[groupKey].cards.push(card);
      });

      // 转换为数组并排序
      return Object.values(groups).sort((a, b) => {
        // 按用户、科目、考点、题型排序
        return a.key.localeCompare(b.key);
      });
    },
    // 当前选中的错题列表
    currentTreeMistaker() {
      if (!this.selectedTreePath) {
        return this.showMistaker;
      }

      // 确保路径分割正确
      const pathParts = this.selectedTreePath?.split("|");
      const subject = pathParts[0] || "";
      const subClass = pathParts[1] || "";
      const questionType = pathParts[2] || "";

      return this.showMistaker.filter((item) => {
        const matchSubject =
          !subject || subject === "未分类科目" || item.subject === subject;
        const matchSubClass =
          !subClass || subClass === "未分类考点" || item.subClass === subClass;
        const matchQuestionType =
          !questionType ||
          questionType === "未分类题型" ||
          item.questionType === questionType;

        return matchSubject && matchSubClass && matchQuestionType;
      });
    },

    // 显示当前选中的路径标题
    currentTreeTitle() {
      if (!this.selectedTreePath) {
        return "全部错题";
      }

      const parts = this.selectedTreePath?.split("|");
      return parts.filter((p) => p && !p.includes("未分类")).join(" > ");
    },

    groupedCheatSheets() {
      const groups = {};
      this.finalCheatSheet.forEach((item) => {
        const key = `${item.user}-${item.subject}`;
        if (!groups[key]) {
          groups[key] = {
            key: key,
            user: item.user,
            subject: item.subject,
            items: [],
          };
        }
        groups[key].items.push(item);
      });

      // 转换为数组并按日期降序排序
      return Object.values(groups).map((group) => ({
        ...group,
        items: group.items,
      }));
    },

    todayDate() {
      return new Date().toLocaleDateString("sv-SE");
    },
    // 按备用分组的数据
    trapMap() {
      const map = {};
      this.mistaker.forEach((item) => {
        if (item.trap?.trim()) {
          const trap = item.trap.trim();
          if (!map[trap]) {
            map[trap] = {
              detail: item.trapDetail || "",
              errorIds: [],
            };
          }
          map[trap].errorIds.push(item.id);
          // 如果当前错题有详解且不为空，则更新详解（取最新的非空详解）
          if (item.trapDetail?.trim()) {
            map[trap].detail = item.trapDetail;
          }
        }
      });
      return map;
    },
    autofill() {
      let afill1 = "";
      let afill2 = [];
      if (
        this.form.user?.trim() &&
        this.form.subject?.trim() &&
        this.form.subClass?.trim() &&
        this.form.questionType?.trim()
      ) {
        const foundSummary = this.finalQuestionTypeSummary.find(
          (item) =>
            item.questionType === this.form.questionType?.trim() &&
            item.subject === this.form.subject?.trim() &&
            item.subClass === this.form.subClass?.trim()
        );
        if (foundSummary && foundSummary.questionTypeSummary?.trim()) {
          afill1 = foundSummary.questionTypeSummary?.trim();
        }
        if (foundSummary && foundSummary.questionTypeImgUrls) {
          afill2 = foundSummary.questionTypeImgUrls;
        }
      }
      const final = [afill1, afill2];
      return final;
    },
  },

  watch: {
    "dtSettings.expandDirection"() {
      this.$nextTick(() => {
        this.dtUpdatePositions();
        // 等待布局完成后自动居中显示
        setTimeout(() => {
          this.dtResetView();
        }, 100);
      });
    },
    dtSettings: {
      deep: true,
      handler() {
        // 重新计算所有节点尺寸
        this.dtNodes.forEach((node) => {
          this.dtAutoResizeNode(node);
        });

        // 更新布局
        this.$nextTick(() => {
          this.dtUpdatePositions();
        });

        // 保存当前导图
        this.dtSaveCurrentMindMap();
      },
    },
    dtNodes: {
      deep: true,
      handler() {
        this.dtSaveCurrentMindMap();
        if (this.dtSummaries.length === 0) return;
        // 用创建概要时的逻辑重新计算概要虚线框
        this.dtUpdateSummaryPositions();
        this.dtUpdateSummaryLines();
      },
    },
    autoSync() {
      window.localStorage.setItem("autoSync", this.autoSync);
    },
    showTool() {
      window.localStorage.setItem("showTool", this.showTool);
    },
    showAllAnswer() {
      window.localStorage.setItem("showAllAnswer", this.showAllAnswer);
    },

    testFilterForm: {
      handler(newVal) {
        this.applyTestFilter();
        if (this.filterForm.user !== newVal.user)
          this.filterForm.user = newVal.user;
        if (this.filterForm.subject !== newVal.subject)
          this.filterForm.subject = newVal.subject;
        if (this.filterForm.keyword !== newVal.keyword)
          this.filterForm.keyword = newVal.keyword;
        if (this.filterForm.fav !== newVal.fav)
          this.filterForm.fav = newVal.fav;
        if (this.filterForm.specialIL !== newVal.specialIL)
          this.filterForm.specialIL = newVal.specialIL;
        if (this.filterForm.importantLevel !== newVal.importantLevel)
          this.filterForm.importantLevel = newVal.importantLevel;
        this.saveTestFilterForm(newVal);
      },
      deep: true, // 开启深度监听（必须）
      immediate: false, // 是否一进页面就立即执行一次
    },
    filterForm: {
      handler(newVal) {
        if (this.testFilterForm.user !== newVal.user)
          this.testFilterForm.user = newVal.user;
        if (this.testFilterForm.subject !== newVal.subject)
          this.testFilterForm.subject = newVal.subject;
        if (this.testFilterForm.keyword !== newVal.keyword)
          this.testFilterForm.keyword = newVal.keyword;
        if (this.testFilterForm.fav !== newVal.fav)
          this.testFilterForm.fav = newVal.fav;
        if (this.testFilterForm.specialIL !== newVal.specialIL)
          this.testFilterForm.specialIL = newVal.specialIL;
        if (this.testFilterForm.importantLevel !== newVal.importantLevel)
          this.testFilterForm.importantLevel = newVal.importantLevel;
        this.handleFilter();
        this.saveFilterForm(newVal);
      },
      deep: true, // 开启深度监听（必须）
      immediate: false, // 是否一进页面就立即执行一次
    },

    questionTypeSummaryFilterForm: {
      handler() {
        this.handleQuestionTypeSummaryFilter();
      },
      deep: true, // 开启深度监听（必须）
      immediate: false, // 是否一进页面就立即执行一次
    },

    currentView(newView) {
      if (newView != "add") {
        this.isEditing = false;
        this.editingId = null;
      }
      if (newView == "list") {
        this.handleFilter();
      }
      if (newView == "readingCard") {
        const card = this.currentReadingCard;
        if (!card) return;

        // 构建朗读文本 - 先只朗读题目...
        let textToRead = `题号：${card.id}。。。。。。。。`;
        textToRead += `题型：${card.questionType}。。。。。。。`;

        if (card.question) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = card.question;
          const questionText = tempDiv.textContent || tempDiv.innerText || "";
          textToRead += `题目：${questionText}。。。。。。。`;
        }

        // 更新当前朗读文本
        this.currentReadingCardText = textToRead
          ?.split("。。。。。。。。")[1]
          .replaceAll("。。。。。。。", "\n");
      }
    },

    "form.subject": {
      handler(newSubject, oldSubject) {
        // 只有当科目实际发生变化时才执行检查
        this.editCheatSheet1(this.form?.user, this.form?.subject);
        if (newSubject?.trim() !== oldSubject?.trim()) {
          this.$nextTick(() => {
            this.checkAndClearFields1();
          });
        }
      },
      deep: true,
      immediate: false,
    },

    "form.user": {
      handler(newUser, oldUser) {
        // 只有当科目实际发生变化时才执行检查
        if (newUser?.trim() !== oldUser?.trim()) {
          this.editCheatSheet1(this.form?.user, this.form?.subject);
        }
      },
      deep: true,
      immediate: false,
    },

    "form.subClass": {
      handler(newSubClass, oldSubClass) {
        // 只有当考点实际发生变化时才执行检查
        if (newSubClass?.trim() !== oldSubClass?.trim()) {
          this.$nextTick(() => {
            this.checkAndClearFields2();
          });
        }
      },
      deep: true,
      immediate: false,
    },

    autofill: {
      handler() {
        if (this.autofill[0]) {
          this.form.questionTypeSummary = this.autofill[0];
        } else {
          this.form.questionTypeSummary = "";
        }
        if (this.autofill[1]?.length != 0) {
          this.form.questionTypeImgUrls = this.autofill[1];
        } else {
          this.form.questionTypeImgUrls = [];
        }
      },
      deep: true,
      immediate: false,
    },

    selectedDate(newDate) {
      if (this.currentView == "add") this.form.addDate = newDate;
    },

    "form.questionType": {
      handler() {
        this.getTaskListItem();
      },
      immediate: false,
    },
    mistaker: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },
    testInterval() {
      if (this.currentView == "list") {
        this.handleFilter();
      } else {
        this.applyTestFilter();
      }
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    correctDays() {
      if (this.currentView == "list") {
        this.handleFilter();
      } else {
        this.applyTestFilter();
      }
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    reverseList() {
      if (this.currentView == "list") {
        this.handleFilter();
      } else {
        this.applyTestFilter();
      }
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    groupNumber() {
      if (this.currentView == "test") {
        this.startTest();
      }
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    testTimes() {
      if (this.currentView == "list") {
        this.handleFilter();
      } else {
        this.applyTestFilter();
      }
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    excludedKeyWord() {
      if (this.currentView == "list") {
        this.handleFilter();
      } else {
        this.applyTestFilter();
      }

      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    finalQuestionTypeSummary: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },
    finalSubjectSummary: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },
    finalCheatSheet: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },
    backupFiles: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },
    taskList: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },

    dtMindMaps: {
      handler() {
        if (this.timeOutId1) clearTimeout(this.timeOutId1);
        this.timeOutId1 = setTimeout(() => {
          this.saveToForage();
        }, 200);
      },
      deep: true,
      immediate: false,
    },

    "form.trap": {
      handler(newTrap) {
        if (newTrap && newTrap.trim()) {
          // 查找对应的备用详解
          const foundTrap = Object.entries(this.trapMap).find(
            ([trap]) => trap === newTrap.trim()
          );
          if (foundTrap && foundTrap[1].detail) {
            this.form.trapDetail = foundTrap[1].detail;
          }
        }
      },
      immediate: false,
    },
    imgSrc() {
      if (this.imgSrc) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    },
  },

  mounted() {
    if (/iPhone/.test(navigator.userAgent)) {
      document.addEventListener("touchstart", this.onTouchStart, {
        passive: false,
      });
      document.addEventListener("touchmove", this.onTouchMove, {
        passive: false,
      });
    }
    this.$window = window;
    this.onOff = true; // 标志位,保证存盘。
    this.readFromForage();
    this.registerCustomMenu();
    setTimeout(() => {
      this.checkUpdate();
    }, 1500);
    this.$nextTick(() => {
      this.bindImageClick();
    });
    this.loadBaiDuTJScript();
    this.filterForm = this.loadFilterForm();
    this.testFilterForm = this.loadTestFilterForm();
    window.localStorage.setItem("mistakebook_list_scroll", 0);
    this.dtUpdateContainerSize();
    window.addEventListener("resize", this.dtUpdateContainerSize);
    // 禁用双击缩放
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      { passive: false }
    );
    this.urla = api.getDownloadURL(this.req, true);
    setTimeout(() => {
      this.handleFilter();
      this.pageView();
    }, 500);

    if (
      !this.isMobile &&
      this.currentView === "mindMaps" &&
      this.dtCurrentPage === "mindmap"
    ) {
      document.body.classList.add("mistakebook-no-scroll");
    }
  },
  updated() {
    // 内容更新后重新绑定（先移除旧事件，再绑定新事件）
    this.$nextTick(() => {
      this.unbindImageClick();
      this.bindImageClick();
    });
  },

  beforeDestroy() {
    document.removeEventListener("touchstart", this.onTouchStart);
    document.removeEventListener("touchmove", this.onTouchMove);
    this.stopReadingCards();
    this.stopReading();
    this.unbindImageClick();
    if (this.timeOutId1) clearTimeout(this.timeOutId1);
    if (this.cropper) {
      this.cropper.destroy();
    }
    if (this.editor) this.editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor7) this.editor7.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor6) this.editor6.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor5) this.editor5.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor4) this.editor4.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor3) this.editor3.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor2) this.editor2.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editor1) this.editor1.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
    if (this.editorCheatSheet) this.editorCheatSheet.destroy();
    if (this.editorQuestion) {
      this.editorQuestion.destroy();
    }
    window.removeEventListener("resize", this.dtUpdateContainerSize);
    document.body.classList.remove("mistakebook-no-scroll");
  },
  methods: {
    // 列表页面方法
    dtCreateNewMindMap() {
      const defaultName = "未命名导图";
      const newMindMap = {
        id: Date.now().toString(),
        name: defaultName,
        createdAt: new Date().toISOString(),
        nodes: [
          {
            id: "1",
            content: this.dtGetDefaultNodeContent(1),
            description: "",
            descriptionMastery: {
              level: 1,
              lastTestDate: new Date().toISOString().split("T")[0],
            },
            level: 1,
            parentId: null,
            x: 0,
            y: 0,
            isFavorite: false,
            tags: [],
            masteryLevel: {
              level: 1,
              lastTestDate: new Date().toISOString().split("T")[0],
            },
          },
        ],
        childCount: { 1: 0 },
        settings: {
          defaultFontSize: 14,
          defaultFontFamily: "Microsoft YaHei",
          maxNodeWidth: 20,
          maxNodeHeight: 15,
          levelGap: 100,
          nodeGap: 60,
          lineStyle: "diverge",
          expandDirection: "horizontal",
          theme: "default",
          showBorder: true,
          bothSideLeftCount: null,
        },
      };
      this.dtMindMaps.push(newMindMap);
      this.dtOpenMindMap(this.dtMindMaps.length - 1);
    },
    dtOpenMindMap(index) {
      this.dtCurrentMindMapIndex = index;
      this.dtCurrentMindMapName = this.dtMindMaps[index].name;
      this.dtLoadCurrentMindMap();
      this.dtCurrentPage = "mindmap";
    },
    dtLoadCurrentMindMap() {
      if (this.dtCurrentMindMapIndex < 0) return;
      const mindMap = this.dtMindMaps[this.dtCurrentMindMapIndex];

      // 先加载设置，避免设置变化时触发自动重算覆盖节点尺寸
      if (mindMap.settings) {
        this.dtSettings = { ...mindMap.settings };
      } else {
        this.dtSettings = {
          defaultFontSize: 14,
          defaultFontFamily: "Microsoft YaHei",
          maxNodeWidth: 20,
          maxNodeHeight: 15,
          levelGap: 100,
          nodeGap: 60,
          lineStyle: "diverge",
          expandDirection: "horizontal",
          theme: "default",
          showBorder: true,
          bothSideLeftCount: null,
        };
      }

      this.dtNodes = JSON.parse(JSON.stringify(mindMap.nodes || []));
      this.dtChildCount = JSON.parse(JSON.stringify(mindMap.childCount || {}));
      this.dtLines = [];
      this.dtSelectedNode = null;
      this.dtCollapsedNodes = [];
      this.dtOffsetX = 0;
      this.dtOffsetY = 0;
      this.dtNoteNode = mindMap.noteNode
        ? JSON.parse(JSON.stringify(mindMap.noteNode))
        : null;
      this.dtNoteCollapsed = true;
      this.dtTagPanelCollapsed = true;
      this.dtSummaries = JSON.parse(JSON.stringify(mindMap.summaries || []));
      this.dtSummaryLines = [];

      // 加载quiz设置
      if (mindMap.quizSettings) {
        this.dtUseEbbinghaus = mindMap.quizSettings.useEbbinghaus || false;
        this.dtEbbinghausIntervals =
          mindMap.quizSettings.ebbinghausIntervals || "0 1 2 4 7 12 19 28";
        this.dtShuffleQuestions =
          mindMap.quizSettings.shuffleQuestions || false;
        this.dtQuestionType = mindMap.quizSettings.questionType || "fill";
      }

      // 转换旧格式的masteryLevel为对象格式
      this.dtNodes.forEach((node) => {
        if (typeof node.masteryLevel === "number") {
          node.masteryLevel = {
            level: node.masteryLevel,
            lastTestDate: node.lastTestDate || null,
          };
        } else if (!node.masteryLevel) {
          node.masteryLevel = { level: 1, lastTestDate: null };
        }
        if (typeof node.descriptionMastery === "number") {
          node.descriptionMastery = {
            level: node.descriptionMastery,
            lastTestDate: node.descriptionLastTestDate || null,
          };
        } else if (!node.descriptionMastery) {
          node.descriptionMastery = { level: 1, lastTestDate: null };
        }
      });

      // 转换笔记节点的masteryLevel
      if (this.dtNoteNode) {
        if (typeof this.dtNoteNode.masteryLevel === "number") {
          this.dtNoteNode.masteryLevel = {
            level: this.dtNoteNode.masteryLevel,
            lastTestDate: null,
          };
        } else if (!this.dtNoteNode.masteryLevel) {
          this.dtNoteNode.masteryLevel = { level: 1, lastTestDate: null };
        }
      }

      // 转换概要节点的masteryLevel
      this.dtSummaries.forEach((summary) => {
        if (typeof summary.masteryLevel === "number") {
          summary.masteryLevel = {
            level: summary.masteryLevel,
            lastTestDate: summary.lastTestDate || null,
          };
        } else if (!summary.masteryLevel) {
          summary.masteryLevel = { level: 1, lastTestDate: null };
        }
      });

      // 双侧布局：为没有 side 属性的 level 2 节点初始化 side（兼容旧数据）
      if (this.dtSettings.expandDirection === "both") {
        const rootNodes = this.dtNodes.filter((n) => n.level === 1);
        rootNodes.forEach((rootNode) => {
          const level1Children = this.dtNodes
            .filter((n) => n.parentId === rootNode.id && n.level === 2)
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          const noSideChildren = level1Children.filter((n) => !n.side);
          if (noSideChildren.length > 0) {
            const bothSideLeftCount = this.dtSettings.bothSideLeftCount;
            let mid =
              bothSideLeftCount !== null && bothSideLeftCount !== undefined
                ? bothSideLeftCount
                : Math.ceil(level1Children.length / 2);
            mid = Math.max(0, Math.min(mid, level1Children.length));
            // 计算已设置 side 的左侧节点数
            const leftCount = level1Children.filter(
              (n) => n.side === "left"
            ).length;
            // 剩余的左侧名额
            let remainingLeft = mid - leftCount;
            noSideChildren.forEach((child) => {
              if (remainingLeft > 0) {
                child.side = "left";
                remainingLeft--;
              } else {
                child.side = "right";
              }
            });
          }
        });
      }

      // 为没有尺寸的节点自动计算大小
      this.dtNodes.forEach((node) => {
        if (!node.width || !node.height) {
          this.dtAutoResizeNode(node);
        }
      });

      // 初始化：展开所有节点并适配屏幕显示
      this.dtCollapsedNodes = [];
      this.dtCanvasReady = false;

      this.$nextTick(() => {
        this.dtUpdateContainerSize();
        // 等待 dtUpdatePositions 的 requestAnimationFrame 完成后再重置视图
        setTimeout(() => {
          this.dtResetView();
          // 等待 dtResetView 内部的 $nextTick 和 setTimeout 完成后再显示画布
          setTimeout(() => {
            this.dtCanvasReady = true;
          }, 100);
        }, 50);
      });
    },
    dtSaveCurrentMindMap() {
      if (this.dtCurrentMindMapIndex < 0) return;
      this.dtMindMaps[this.dtCurrentMindMapIndex].nodes = JSON.parse(
        JSON.stringify(this.dtNodes)
      );
      this.dtMindMaps[this.dtCurrentMindMapIndex].childCount = JSON.parse(
        JSON.stringify(this.dtChildCount)
      );
      this.dtMindMaps[this.dtCurrentMindMapIndex].settings = {
        ...this.dtSettings,
      };
      this.dtMindMaps[this.dtCurrentMindMapIndex].quizSettings = {
        useEbbinghaus: this.dtUseEbbinghaus,
        ebbinghausIntervals: this.dtEbbinghausIntervals,
        shuffleQuestions: this.dtShuffleQuestions,
        questionType: this.dtQuestionType,
      };
      this.dtMindMaps[this.dtCurrentMindMapIndex].noteNode = this.dtNoteNode
        ? JSON.parse(JSON.stringify(this.dtNoteNode))
        : null;
      this.dtMindMaps[this.dtCurrentMindMapIndex].noteCollapsed =
        this.dtNoteCollapsed;
      this.dtMindMaps[this.dtCurrentMindMapIndex].summaries = JSON.parse(
        JSON.stringify(this.dtSummaries)
      );
    },
    dtDeleteMindMap(index) {
      if (!confirm("确定要删除这个思维导图吗？")) return;
      this.dtMindMaps.splice(index, 1);
    },
    dtGoBackHome() {
      this.dtSaveCurrentMindMap();
      this.dtCurrentPage = "home";
    },
    dtFormatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },
    dtStartEditName() {
      this.dtIsEditingName = true;
      this.$nextTick(() => {
        this.$refs.dtNameInput.focus();
        this.$refs.dtNameInput.select();
      });
    },
    dtSaveMindMapName() {
      const trimmed = (this.dtCurrentMindMapName || "").trim();
      if (trimmed) {
        if (this.dtCurrentMindMapIndex >= 0) {
          this.dtMindMaps[this.dtCurrentMindMapIndex].name = trimmed;
          this.dtCurrentMindMapName = trimmed;
        }
      } else {
        // 名称为空则恢复原值
        if (this.dtCurrentMindMapIndex >= 0) {
          this.dtCurrentMindMapName =
            this.dtMindMaps[this.dtCurrentMindMapIndex].name;
        }
      }
      this.dtIsEditingName = false;
    },
    dtCancelEditName() {
      // 取消编辑，恢复原值
      if (this.dtCurrentMindMapIndex >= 0) {
        this.dtCurrentMindMapName =
          this.dtMindMaps[this.dtCurrentMindMapIndex].name;
      }
      this.dtIsEditingName = false;
    },
    dtToggleViewMode() {
      this.dtViewMode = this.dtViewMode === "mindmap" ? "outline" : "mindmap";
    },
    dtToggleCollapse(node) {
      if (this.dtCollapsedNodes.includes(node.id)) {
        this.dtCollapsedNodes = this.dtCollapsedNodes.filter(
          (id) => id !== node.id
        );
      } else {
        this.dtCollapsedNodes.push(node.id);
      }
    },
    dtStripHtml(html) {
      if (!html) return "";
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    dtGetNodeSubtreeDFS(node) {
      const result = [node];
      const children = this.dtNodes
        .filter((n) => n.parentId === node.id)
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
      for (const child of children) {
        result.push(...this.dtGetNodeSubtreeDFS(child));
      }
      return result;
    },
    dtToggleSpeak() {
      if (this.dtIsSpeaking) {
        this.dtStopSpeak();
      } else {
        this.dtStartSpeak();
      }
    },
    dtStartSpeak() {
      if (!this.dtSelectedNode || !this.dtIsRealNodeSelected) return;
      if (!window.speechSynthesis) {
        alert("您的浏览器不支持语音朗读功能");
        return;
      }
      const nodes = this.dtGetNodeSubtreeDFS(this.dtSelectedNode);
      let texts = [];
      for (const node of nodes) {
        const contentText = this.dtStripHtml(node.content);
        let nodeText = `节点 ${node.id}。${contentText}。`;
        if (node.description) {
          const descText = this.dtStripHtml(node.description);
          nodeText += `注解：${descText}。`;
        }
        texts.push(nodeText);
      }
      const fullText = texts.join(" ");
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.lang = "zh-CN";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => {
        this.dtIsSpeaking = false;
        this.dtSpeechUtterance = null;
      };
      utterance.onerror = () => {
        this.dtIsSpeaking = false;
        this.dtSpeechUtterance = null;
      };
      this.dtSpeechUtterance = utterance;
      this.dtIsSpeaking = true;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    dtStopSpeak() {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      this.dtIsSpeaking = false;
      this.dtSpeechUtterance = null;
    },
    dtIncreaseMastery() {
      if (!this.dtSelectedNode || !this.dtIsRealNodeSelected) return;
      if (this.dtSelectedNode.masteryLevel.level >= 9) return;
      this.dtSaveSnapshot();
      const today = new Date().toISOString().split("T")[0];
      this.$set(this.dtSelectedNode, "masteryLevel", {
        level: this.dtSelectedNode.masteryLevel.level + 1,
        lastTestDate: today,
      });
      this.dtSaveCurrentMindMap();
    },
    dtDecreaseMastery() {
      if (!this.dtSelectedNode || !this.dtIsRealNodeSelected) return;
      if (this.dtSelectedNode.masteryLevel.level <= 1) return;
      this.dtSaveSnapshot();
      const today = new Date().toISOString().split("T")[0];
      this.$set(this.dtSelectedNode, "masteryLevel", {
        level: this.dtSelectedNode.masteryLevel.level - 1,
        lastTestDate: today,
      });
      this.dtSaveCurrentMindMap();
    },
    dtResetAllMastery() {
      if (!confirm("确定要将所有节点的掌握程度重置为1吗？")) return;
      this.dtSaveSnapshot();
      const today = new Date().toISOString().split("T")[0];
      for (const node of this.dtNodes) {
        if (!node.id.startsWith("summary_")) {
          this.$set(node, "masteryLevel", { level: 1, lastTestDate: today });
        }
      }
      this.dtSaveCurrentMindMap();
    },
    // 测验模式方法
    dtGetBlankNodes() {
      const regex = /[＊*]{2}[^＊*]+[＊*]{2}/;
      const quizItems = [];

      this.dtNodes
        .filter(
          (n) =>
            !n.id.startsWith("summary_") && n.content && regex.test(n.content)
        )
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
        .forEach((node) => {
          quizItems.push({
            quizId: `node_${node.id}`,
            quizType: "nodeContent",
            node: node,
            content: node.content,
          });
        });

      this.dtNodes
        .filter(
          (n) =>
            !n.id.startsWith("summary_") &&
            n.description &&
            regex.test(n.description)
        )
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
        .forEach((node) => {
          quizItems.push({
            quizId: `desc_${node.id}`,
            quizType: "nodeDescription",
            node: node,
            content: node.description,
          });
        });

      if (
        this.dtNoteNode &&
        this.dtNoteNode.content &&
        regex.test(this.dtNoteNode.content)
      ) {
        quizItems.push({
          quizId: "note",
          quizType: "note",
          node: this.dtNoteNode,
          content: this.dtNoteNode.content,
        });
      }

      this.dtSummaries
        .filter((s) => s.content && regex.test(s.content))
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
        .forEach((summary) => {
          quizItems.push({
            quizId: `summary_${summary.id}`,
            quizType: "summary",
            node: summary,
            content: summary.content,
          });
        });

      return quizItems;
    },
    dtGetAllBlankAnswers() {
      const regex = /[＊*]{2}([^＊*]+)[＊*]{2}/g;
      const allAnswers = [];

      const collectFromText = (text) => {
        if (!text) return;
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null) {
          allAnswers.push(match[1]);
        }
      };

      this.dtNodes.forEach((node) => {
        if (node.id.startsWith("summary_")) return;
        collectFromText(node.content);
        collectFromText(node.description);
      });

      if (this.dtNoteNode) {
        collectFromText(this.dtNoteNode.content);
      }

      this.dtSummaries.forEach((summary) => {
        collectFromText(summary.content);
      });

      return [...new Set(allAnswers)];
    },
    dtGetChoiceOptions(quizItem) {
      const regex = /[＊*]{2}([^＊*]+)[＊*]{2}/g;
      const answers = [];
      let match;
      regex.lastIndex = 0;
      const text = quizItem.content;
      while ((match = regex.exec(text)) !== null) {
        answers.push(match[1]);
      }

      if (answers.length === 0) return [];

      const blankCount = answers.length;
      const correctOption = answers.join(" / ");
      const wrongOptions = [];

      let candidatePool;
      if (blankCount > 1) {
        candidatePool = [...this.dtAllBlankAnswers];
      } else {
        candidatePool = this.dtAllBlankAnswers.filter(
          (a) => !answers.includes(a)
        );
      }

      if (candidatePool.length === 0) {
        return [correctOption];
      }

      const targetWrongCount = 3;
      let attempts = 0;
      const maxAttempts = 100;

      if (blankCount > 1) {
        const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
        const shuffledOpt = shuffledAnswers.join(" / ");
        if (
          shuffledOpt !== correctOption &&
          !wrongOptions.includes(shuffledOpt)
        ) {
          wrongOptions.push(shuffledOpt);
        }
      }

      while (wrongOptions.length < targetWrongCount && attempts < maxAttempts) {
        attempts++;
        const wrongParts = [];
        for (let j = 0; j < blankCount; j++) {
          const candidate =
            candidatePool[Math.floor(Math.random() * candidatePool.length)];
          wrongParts.push(candidate);
        }
        const wrongOpt = wrongParts.join(" / ");
        if (!wrongOptions.includes(wrongOpt) && wrongOpt !== correctOption) {
          wrongOptions.push(wrongOpt);
        }
      }

      const options = [correctOption, ...wrongOptions];

      return options.sort(() => Math.random() - 0.5);
    },
    dtToggleShowBlanks() {
      this.dtShowAllBlanks = !this.dtShowAllBlanks;
    },
    dtStartQuiz() {
      this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
      let allNodes = this.dtGetBlankNodes();
      // 如果启用艾宾浩斯记忆曲线，过滤题目
      if (this.dtUseEbbinghaus) {
        const intervals = this.dtEbbinghausIntervals
          .split(/\s+/)
          .map((s) => parseInt(s, 10))
          .filter((n) => !isNaN(n));
        const todayStr = new Date().toISOString().split("T")[0];

        allNodes = allNodes.filter((quizItem) => {
          const node = quizItem.node;
          let lastTestDate = null;
          let masteryLevel = 1;

          if (quizItem.quizType === "nodeDescription") {
            lastTestDate = node.descriptionMastery
              ? node.descriptionMastery.lastTestDate
              : null;
            masteryLevel = node.descriptionMastery
              ? node.descriptionMastery.level
              : 1;
          } else {
            lastTestDate = node.masteryLevel
              ? node.masteryLevel.lastTestDate
              : null;
            masteryLevel = node.masteryLevel ? node.masteryLevel.level : 1;
          }

          // 如果没有测试日期，默认需要测试
          if (!lastTestDate) return true;

          // 获取对应的间隔天数
          const intervalIndex = Math.min(
            masteryLevel - 1,
            intervals.length - 1
          );
          const interval = intervals[intervalIndex] || 0;

          // 计算下次测试日期（UTC日期字符串比较，避免时区问题）
          const nextDate = new Date(lastTestDate + "T00:00:00Z");
          nextDate.setUTCDate(nextDate.getUTCDate() + interval);
          const nextTestDateStr = nextDate.toISOString().split("T")[0];

          return todayStr >= nextTestDateStr;
        });
      }

      // 如果启用乱序，打乱题目顺序
      if (this.dtShuffleQuestions) {
        allNodes.sort(() => Math.random() - 0.5);
      }

      // 为每道题分配显示题型
      allNodes = allNodes.map((quizItem) => {
        const displayType = this.dtQuestionType;
        return {
          ...quizItem,
          displayType: displayType,
          options:
            displayType === "choice" ? this.dtGetChoiceOptions(quizItem) : null,
        };
      });

      this.dtQuizUserAnswers = {};
      this.dtQuizNodes = allNodes;
      this.dtQuizCurrentIndex = 0;
      this.dtQuizShowAnswer = false;
      this.dtQuizAnswered = [];
      this.dtIsQuizMode = true;
      if (this.dtQuizCurrentNode) {
        this.dtSelectedNode = this.dtQuizCurrentNode.node;
      }
    },
    dtCloseQuiz() {
      this.dtIsQuizMode = false;
      this.dtIsQuizSettingsOpen = false;
      if (this.showQuestionEditor) {
        this.closeQuestionEditor();
      }
      if (this.dtIsSummaryEditorOpen) {
        this.dtCloseSummaryEditor();
      }
      if (this.dtIsDescriptionViewOpen) {
        this.dtCloseDescriptionView();
      }
    },
    dtOpenQuizSettings() {
      this.dtIsQuizSettingsOpen = true;
    },
    dtCloseQuizSettings() {
      this.dtIsQuizSettingsOpen = false;
    },
    dtOnQuizSettingChange() {
      this.dtSaveCurrentMindMap();
      if (!this.dtIsQuizMode) return;
      this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
      let allNodes = this.dtGetBlankNodes();
      if (this.dtUseEbbinghaus) {
        const intervals = this.dtEbbinghausIntervals
          .split(/\s+/)
          .map((s) => parseInt(s, 10))
          .filter((n) => !isNaN(n));
        const todayStr = new Date().toISOString().split("T")[0];

        allNodes = allNodes.filter((quizItem) => {
          const node = quizItem.node;
          let lastTestDate = null;
          let masteryLevel = 1;

          if (quizItem.quizType === "nodeDescription") {
            lastTestDate = node.descriptionMastery
              ? node.descriptionMastery.lastTestDate
              : null;
            masteryLevel = node.descriptionMastery
              ? node.descriptionMastery.level
              : 1;
          } else {
            lastTestDate = node.masteryLevel
              ? node.masteryLevel.lastTestDate
              : null;
            masteryLevel = node.masteryLevel ? node.masteryLevel.level : 1;
          }

          if (!lastTestDate) return true;

          const intervalIndex = Math.min(
            masteryLevel - 1,
            intervals.length - 1
          );
          const interval = intervals[intervalIndex] || 0;

          const nextDate = new Date(lastTestDate + "T00:00:00Z");
          nextDate.setUTCDate(nextDate.getUTCDate() + interval);
          const nextTestDateStr = nextDate.toISOString().split("T")[0];

          return todayStr >= nextTestDateStr;
        });
      }

      if (this.dtShuffleQuestions) {
        allNodes.sort(() => Math.random() - 0.5);
      }

      allNodes = allNodes.map((quizItem) => {
        const displayType = this.dtQuestionType;
        return {
          ...quizItem,
          displayType: displayType,
          options:
            displayType === "choice" ? this.dtGetChoiceOptions(quizItem) : null,
        };
      });

      this.dtQuizNodes = allNodes;
      this.dtQuizUserAnswers = {};
      this.dtQuizShowAnswer = false;
      this.dtQuizAnswered = [];
      this.dtQuizCurrentIndex = 0;
    },
    dtOnQuestionTypeChange() {
      this.dtSaveCurrentMindMap();
      if (!this.dtIsQuizMode) return;
      this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
      this.dtQuizNodes = this.dtQuizNodes.map((quizItem) => {
        const displayType = this.dtQuestionType;
        return {
          ...quizItem,
          displayType: displayType,
          options:
            displayType === "choice" ? this.dtGetChoiceOptions(quizItem) : null,
        };
      });
      this.dtQuizUserAnswers = {};
      this.dtQuizShowAnswer = false;
      this.dtQuizAnswered = [];
      this.dtQuizCurrentIndex = 0;
    },
    dtQuizPrev() {
      if (this.dtQuizCurrentIndex <= 0) return;
      this.dtQuizCurrentIndex--;
      this.dtQuizShowAnswer = false;
      if (this.dtQuizCurrentNode) {
        this.dtSelectedNode = this.dtQuizCurrentNode.node;
      }
    },
    dtQuizNext() {
      if (this.dtQuizCurrentIndex >= this.dtQuizNodes.length - 1) return;
      this.dtQuizCurrentIndex++;
      this.dtQuizShowAnswer = false;
      if (this.dtQuizCurrentNode) {
        this.dtSelectedNode = this.dtQuizCurrentNode.node;
      }
    },
    dtQuizToggleAnswer() {
      this.dtQuizShowAnswer = !this.dtQuizShowAnswer;
    },
    dtPlayCorrectSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.5, audioCtx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.4 + i * 0.05
          );
          osc.start(audioCtx.currentTime + i * 0.05);
          osc.stop(audioCtx.currentTime + 0.4 + i * 0.05);
        });

        setTimeout(() => audioCtx.close(), 700);
      } catch (e) {
        console.warn("无法播放声音:", e);
      }
    },
    dtPlayWrongSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(audioCtx.destination);
        gain2.connect(audioCtx.destination);

        osc1.type = "square";
        osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc1.frequency.setValueAtTime(100, audioCtx.currentTime + 0.15);
        gain1.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.3
        );

        osc2.type = "square";
        osc2.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(80, audioCtx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + 0.3
        );

        osc1.start(audioCtx.currentTime);
        osc1.stop(audioCtx.currentTime + 0.3);
        osc2.start(audioCtx.currentTime);
        osc2.stop(audioCtx.currentTime + 0.3);

        setTimeout(() => audioCtx.close(), 300);
      } catch (e) {
        console.warn("无法播放声音:", e);
      }
    },
    dtQuizKnow() {
      const quizItem = this.dtQuizCurrentNode;
      if (!quizItem) return;
      if (this.dtQuizCurrentAnswered) return;
      const today = new Date().toISOString().split("T")[0];
      const node = quizItem.node;
      let masteryObj = null;
      if (quizItem.quizType === "nodeDescription") {
        masteryObj = node.descriptionMastery;
      } else {
        masteryObj = node.masteryLevel;
      }
      if (masteryObj && masteryObj.level < 9) {
        this.dtSaveSnapshot();
        const newMastery = { level: masteryObj.level + 1, lastTestDate: today };
        if (quizItem.quizType === "nodeDescription") {
          this.$set(node, "descriptionMastery", newMastery);
        } else {
          this.$set(node, "masteryLevel", newMastery);
        }
        this.dtSaveCurrentMindMap();
      }
      this.dtQuizAnswered.push(quizItem.quizId);
      this.dtQuizShowAnswer = true;
      this.dtPlayCorrectSound();
      // 触发动画
      this.dtMasteryLevelAnimating = "dt-mastery-correct";
      setTimeout(() => {
        this.dtMasteryLevelAnimating = "";
      }, 600);
    },
    dtQuizDontKnow() {
      const quizItem = this.dtQuizCurrentNode;
      if (!quizItem) return;
      if (this.dtQuizCurrentAnswered) return;
      const today = new Date().toISOString().split("T")[0];
      const node = quizItem.node;
      this.dtSaveSnapshot();
      const newMastery = { level: 1, lastTestDate: today };
      if (quizItem.quizType === "nodeDescription") {
        this.$set(node, "descriptionMastery", newMastery);
      } else {
        this.$set(node, "masteryLevel", newMastery);
      }
      this.dtSaveCurrentMindMap();
      this.dtQuizAnswered.push(quizItem.quizId);
      this.dtQuizShowAnswer = true;
      this.dtPlayWrongSound();
      // 触发动画
      this.dtMasteryLevelAnimating = "dt-mastery-wrong";
      setTimeout(() => {
        this.dtMasteryLevelAnimating = "";
      }, 600);
    },
    dtQuizEditContent() {
      const quizItem = this.dtQuizCurrentNode;
      if (!quizItem) return;
      const showAnswer =
        this.dtQuizShowAnswer ||
        (quizItem.displayType === "choice" &&
          this.dtQuizUserAnswers[quizItem.quizId]);
      if (!showAnswer) return;

      let content = "";
      switch (quizItem.quizType) {
        case "nodeContent":
          content = quizItem.node.content;
          this.dtEditingNode = quizItem.node;
          this.dtEditingContent = content;
          this.openQuestionEditor(content, 31);
          break;
        case "nodeDescription":
          content = quizItem.node.description;
          this.dtEditingDescriptionNode = quizItem.node;
          this.dtEditingDescription = content;
          this.openQuestionEditor(content, 32);
          break;
        case "note":
          content = this.dtNoteNode?.content || "";
          this.dtNoteNode = quizItem.node;
          this.dtEditingContent = content;
          this.openQuestionEditor(content, 33);
          break;
        case "summary":
          this.dtStartEditSummary(quizItem.node);
          break;
      }
    },
    dtQuizSelectOption(option) {
      const quizItem = this.dtQuizCurrentNode;
      if (!quizItem || quizItem.displayType !== "choice") return;
      if (this.dtQuizCurrentAnswered) return;

      const correctAnswer = this.dtQuizCurrentCorrectAnswer;
      const isCorrect = option === correctAnswer;
      const today = new Date().toISOString().split("T")[0];
      const node = quizItem.node;

      this.dtQuizUserAnswers[quizItem.quizId] = option;

      this.dtSaveSnapshot();

      if (isCorrect) {
        let masteryObj = null;
        if (quizItem.quizType === "nodeDescription") {
          masteryObj = node.descriptionMastery;
        } else {
          masteryObj = node.masteryLevel;
        }
        if (masteryObj && masteryObj.level < 9) {
          const newMastery = {
            level: masteryObj.level + 1,
            lastTestDate: today,
          };
          if (quizItem.quizType === "nodeDescription") {
            this.$set(node, "descriptionMastery", newMastery);
          } else {
            this.$set(node, "masteryLevel", newMastery);
          }
        }
        this.dtPlayCorrectSound();
        // 答对动画
        this.dtMasteryLevelAnimating = "dt-mastery-correct";
        setTimeout(() => {
          this.dtMasteryLevelAnimating = "";
        }, 600);
      } else {
        const newMastery = { level: 1, lastTestDate: today };
        if (quizItem.quizType === "nodeDescription") {
          this.$set(node, "descriptionMastery", newMastery);
        } else {
          this.$set(node, "masteryLevel", newMastery);
        }
        this.dtPlayWrongSound();
        // 答错动画
        this.dtMasteryLevelAnimating = "dt-mastery-wrong";
        setTimeout(() => {
          this.dtMasteryLevelAnimating = "";
        }, 600);
      }

      this.dtSaveCurrentMindMap();
      this.dtQuizAnswered.push(quizItem.quizId);
      this.dtQuizShowAnswer = true;
    },

    // 思维导图编辑方法
    dtUpdateContainerSize() {
      if (this.dtCurrentPage === "mindmap") {
        this.dtContainerWidth = window.innerWidth;
        this.dtContainerHeight = window.innerHeight;
        this.dtUpdatePositions();
      }
      if (
        !this.isMobile &&
        this.currentView === "mindMaps" &&
        this.dtCurrentPage === "mindmap"
      ) {
        document.body.classList.add("mistakebook-no-scroll");
      } else {
        document.body.classList.remove("mistakebook-no-scroll");
      }
    },
    // 拖拽方法
    dtStartDrag(e) {
      // 如果正在拖拽节点，则不处理
      if (this.dtIsNodeDragging) return;

      // 检查点击的目标元素
      if (
        e.target.classList.contains("dt-btn") ||
        e.target.classList.contains("dt-resize-handle") ||
        e.target.classList.contains("dt-drag-handle") ||
        e.target.classList.contains("dt-name-input")
      ) {
        return;
      }

      this.dtIsDragging = true;

      // 获取触摸或鼠标位置
      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      this.dtDragStartX = clientX - this.dtOffsetX;
      this.dtDragStartY = clientY - this.dtOffsetY;
    },
    dtOnDrag(e) {
      if (!this.dtIsDragging) return;

      // 获取触摸或鼠标位置
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      this.dtOffsetX = clientX - this.dtDragStartX;
      this.dtOffsetY = clientY - this.dtDragStartY;
    },
    dtEndDrag() {
      this.dtIsDragging = false;
    },
    // 节点拖拽方法
    dtStartNodeDrag(e, node) {
      // 阻止默认行为，防止触发触摸事件
      if (e.type === "touchstart") {
        e.preventDefault();
      }

      this.dtIsNodeDragging = true;
      this.dtDragNode = node;

      // 获取触摸或鼠标位置
      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      this.dtNodeDragStartX = clientX;
      this.dtNodeDragStartY = clientY;
      this.dtDragStartNodeX = node.x;
      this.dtDragStartNodeY = node.y;
      // 记录拖拽开始时一级节点的侧信息（用于双侧布局检测跨侧移动）
      this.dtDragStartSide = node._side || null;

      // 记录所有展开的子节点相对于拖拽节点的偏移
      this.dtDragChildOffsets = {};
      const collectChildOffsets = (parentId) => {
        const children = this.dtNodes.filter(
          (n) => n.parentId === parentId && !this.dtIsNodeHidden(n)
        );
        children.forEach((child) => {
          this.dtDragChildOffsets[child.id] = {
            dx: child.x - node.x,
            dy: child.y - node.y,
          };
          collectChildOffsets(child.id);
        });
      };
      collectChildOffsets(node.id);

      document.addEventListener("mousemove", this.dtOnNodeDrag);
      document.addEventListener("mouseup", this.dtEndNodeDrag);
      document.addEventListener("touchmove", this.dtOnNodeDrag);
      document.addEventListener("touchend", this.dtEndNodeDrag);
    },
    dtOnNodeDrag(e) {
      if (!this.dtIsNodeDragging || !this.dtDragNode) return;

      // 阻止默认行为
      if (e.type === "touchmove") {
        e.preventDefault();
      }

      // 获取触摸或鼠标位置
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.dtNodeDragStartX;
      const deltaY = clientY - this.dtNodeDragStartY;

      // 考虑画布缩放比例，鼠标移动的像素需要除以缩放比例
      const scale = this.dtScale || 1;
      const newX = this.dtDragStartNodeX + deltaX / scale;
      const newY = this.dtDragStartNodeY + deltaY / scale;
      this.dtDragNode.x = newX;
      this.dtDragNode.y = newY;

      // 子节点跟着一起移动
      if (this.dtDragChildOffsets) {
        Object.keys(this.dtDragChildOffsets).forEach((childId) => {
          const child = this.dtNodes.find((n) => n.id === childId);
          if (child) {
            const offset = this.dtDragChildOffsets[childId];
            child.x = newX + offset.dx;
            child.y = newY + offset.dy;
          }
        });
      }

      // 检测目标节点
      const targetNode = this.dtFindNodeAtPosition(
        this.dtDragNode.x,
        this.dtDragNode.y,
        this.dtDragNode
      );

      // 更新高亮状态
      if (this.dtTargetNode) {
        this.$set(this.dtTargetNode, "isTarget", false);
      }
      if (targetNode && targetNode.id !== this.dtDragNode.id) {
        this.$set(targetNode, "isTarget", true);
        this.dtTargetNode = targetNode;

        // 计算拖拽节点左上角相对于目标节点的位置
        const dragX = this.dtDragNode.x;
        const dragY = this.dtDragNode.y;
        const targetW = targetNode.width || 120;
        const targetH = targetNode.height || 40;
        const targetCenterX = targetNode.x + targetW / 2;
        const targetCenterY = targetNode.y + targetH / 2;

        // 归一化到 [-1, 1]
        const relX = (dragX - targetCenterX) / (targetW / 2);
        const relY = (dragY - targetCenterY) / (targetH / 2);

        // 情形一：左下半部分 -> 同级节点（水平虚线）
        // 左半部分: relX < 0, 下半部分: relY > 0
        if (relX < 0 && relY > 0) {
          this.dtDropZoneType = "sibling";
        } else if (relX >= 0) {
          // 情形二：右半部分 -> 子节点（垂直虚线）
          this.dtDropZoneType = "child";
        } else if (
          // 情形三：双侧模式下，根节点的右侧一级子节点拖拽到根节点左半侧（左上区域）-> 移动到左侧（垂直虚线）
          this.dtSettings.expandDirection === "both" &&
          targetNode.level === 1 &&
          this.dtDragNode.level === 2 &&
          this.dtDragNode.parentId === targetNode.id &&
          this.dtDragStartSide === "right"
        ) {
          this.dtDropZoneType = "moveToLeft";
        } else {
          this.dtDropZoneType = null;
        }
      } else {
        this.dtTargetNode = null;
        this.dtDropZoneType = null;
      }

      // 拖拽过程中只更新被拖拽节点与子节点之间的连线，不更新与父节点的连线
      this.dtUpdateDragSubtreeLines(this.dtDragNode);
    },
    dtEndNodeDrag() {
      if (!this.dtIsNodeDragging || !this.dtDragNode) return;

      const draggedNode = this.dtDragNode;
      const targetNode = this.dtFindNodeAtPosition(
        draggedNode.x,
        draggedNode.y,
        draggedNode
      );

      // 保存放置区域类型并清除
      const dropZoneType = this.dtDropZoneType;

      // 清除高亮状态
      if (this.dtTargetNode) {
        this.$set(this.dtTargetNode, "isTarget", false);
        this.dtTargetNode = null;
      }
      this.dtDropZoneType = null;

      if (targetNode && targetNode.id !== draggedNode.id) {
        if (dropZoneType === "sibling") {
          // 情形一：变成同级节点，放于目标节点下方
          const isRootTarget = targetNode.level === 1;
          if (isRootTarget && draggedNode.level === 1) {
            alert("当前节点已经是根节点！");
          } else {
            const msg = isRootTarget
              ? "是否将当前节点变为高亮根节点的同级节点，即新的根节点？"
              : "是否将当前节点变成该节点的同级节点，并放在其下方？";
            if (confirm(msg)) {
              this.dtSaveSnapshot();
              this.dtMakeNodeSibling(draggedNode, targetNode);
            }
          }
        } else if (dropZoneType === "child") {
          // 情形二：变成子节点（以前的逻辑）
          if (targetNode.id !== draggedNode.parentId) {
            if (confirm("确定要将当前节点移动为高亮节点的子节点吗？")) {
              this.dtSaveSnapshot();
              this.dtMoveNodeToTarget(draggedNode, targetNode);
            }
          }
        } else if (dropZoneType === "moveToLeft") {
          // 情形三：双侧模式下，将根节点的右侧一级子节点移动到根节点左侧
          if (confirm("是否将当前一级节点移动到根节点左侧？")) {
            draggedNode.side = "left";
            // 标记为已处理跨侧移动，避免后续自动检测重复调整
            this.dtDragStartSide = "left";
          }
        }
      } else if (!targetNode && draggedNode.level === 1) {
        // 根节点拖拽无覆盖，标记为手动定位
        draggedNode._manualX = draggedNode.x;
        draggedNode._manualY = draggedNode.y;
      }
      // 检测一级节点跨侧移动（双侧布局模式）- 直接修改 side 属性
      if (
        this.dtSettings.expandDirection === "both" &&
        draggedNode.level === 2
      ) {
        const rootNode = this.dtNodes.find(
          (n) => n.id === draggedNode.parentId
        );
        if (rootNode && this.dtDragStartSide !== null) {
          const rootX = rootNode.x + (rootNode.width || 120) / 2;
          // 根据拖拽节点的x位置判断用户意图的侧
          const endSide = draggedNode.x < rootX ? "left" : "right";
          if (this.dtDragStartSide !== endSide) {
            const msg =
              endSide === "left"
                ? "是否将当前一级节点移动到根节点左侧？"
                : "是否将当前一级节点移动到根节点右侧？";
            if (confirm(msg)) {
              draggedNode.side = endSide;
            }
          }
        }
      }
      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();

      this.dtIsNodeDragging = false;
      this.dtDragNode = null;
      this.dtDragChildOffsets = null;
      this.dtDragStartSide = null;

      document.removeEventListener("mousemove", this.dtOnNodeDrag);
      document.removeEventListener("mouseup", this.dtEndNodeDrag);
      document.removeEventListener("touchmove", this.dtOnNodeDrag);
      document.removeEventListener("touchend", this.dtEndNodeDrag);
    },
    dtFindNodeAtPosition(x, y, excludeNode) {
      const nodeWidth = excludeNode.width || 120;
      const nodeHeight = excludeNode.height || 40;

      for (const node of this.dtNodes) {
        if (node.id === excludeNode.id) continue;
        if (this.dtIsNodeHidden(node)) continue;

        const nw = node.width || 120;
        const nh = node.height || 40;

        if (
          x < node.x + nw &&
          x + nodeWidth > node.x &&
          y < node.y + nh &&
          y + nodeHeight > node.y
        ) {
          return node;
        }
      }
      return null;
    },
    dtMoveNodeToTarget(draggedNode, targetNode) {
      if (this.dtIsDescendant(targetNode.id, draggedNode.id)) return;
      if (draggedNode.parentId === targetNode.id) return;

      const oldId = draggedNode.id;
      const newParentId = targetNode.id;
      const newLevel = targetNode.level + 1;

      draggedNode.parentId = newParentId;
      draggedNode.level = newLevel;

      if (!this.dtChildCount[newParentId]) {
        this.dtChildCount[newParentId] = 0;
      }
      this.dtChildCount[newParentId]++;
      const newId = `${newParentId}.${this.dtChildCount[newParentId]}`;

      this.dtUpdateChildrenId(oldId, newId, newLevel);
      draggedNode.id = newId;
    },
    dtMakeNodeRoot(draggedNode) {
      if (draggedNode.level === 1) return;

      const oldId = draggedNode.id;
      const rootNodes = this.dtNodes.filter((n) => n.level === 1);
      const maxRootId = rootNodes.reduce((max, node) => {
        const num = parseInt(node.id, 10);
        return !isNaN(num) && num > max ? num : max;
      }, 0);
      const newId = String(maxRootId + 1);

      // 更新当前节点
      draggedNode.id = newId;
      draggedNode.level = 1;
      draggedNode.parentId = null;

      // 递归更新子节点的 id、level 和 parentId
      const updateChildren = (parentId, newParentId, parentLevel) => {
        const children = this.dtNodes.filter((n) => n.parentId === parentId);
        children.forEach((child) => {
          child.level = parentLevel + 1;
          child.parentId = newParentId;
          if (!this.dtChildCount[newParentId]) {
            this.dtChildCount[newParentId] = 0;
          }
          this.dtChildCount[newParentId]++;
          const newChildId = `${newParentId}.${this.dtChildCount[newParentId]}`;
          const oldChildId = child.id;
          child.id = newChildId;
          updateChildren(oldChildId, newChildId, child.level);
        });
      };

      updateChildren(oldId, newId, 1);
      this.dtChildCount[newId] = 0;
    },
    dtMakeNodeSibling(draggedNode, targetNode) {
      // 将 draggedNode 变成 targetNode 的同级节点（相同父节点），并放在其下方
      // 不能把节点移到自己的子树里
      if (this.dtIsDescendant(targetNode.id, draggedNode.id)) return;

      const newParentId = targetNode.parentId || null;
      const newLevel = targetNode.level;

      // 如果已经是同级节点（相同父节点），不需要改变 parentId 和 level
      if (draggedNode.parentId !== newParentId) {
        // 从原父节点移除
        draggedNode.parentId = newParentId;
        draggedNode.level = newLevel;

        // 生成新 id
        if (newParentId) {
          if (!this.dtChildCount[newParentId]) {
            this.dtChildCount[newParentId] = 0;
          }
          this.dtChildCount[newParentId]++;
          const newId = `${newParentId}.${this.dtChildCount[newParentId]}`;
          this.dtUpdateChildrenId(draggedNode.id, newId, newLevel);
          draggedNode.id = newId;
        } else {
          // 变成根节点
          const rootNodes = this.dtNodes.filter((n) => n.level === 1);
          const maxRootId = rootNodes.reduce((max, node) => {
            const num = parseInt(node.id, 10);
            return !isNaN(num) && num > max ? num : max;
          }, 0);
          const newId = String(maxRootId + 1);
          const oldId = draggedNode.id;
          draggedNode.id = newId;

          // 递归更新子节点
          const updateChildren = (parentId, newParentId, parentLevel) => {
            const children = this.dtNodes.filter(
              (n) => n.parentId === parentId
            );
            children.forEach((child) => {
              child.level = parentLevel + 1;
              child.parentId = newParentId;
              if (!this.dtChildCount[newParentId]) {
                this.dtChildCount[newParentId] = 0;
              }
              this.dtChildCount[newParentId]++;
              const newChildId = `${newParentId}.${this.dtChildCount[newParentId]}`;
              const oldChildId = child.id;
              child.id = newChildId;
              updateChildren(oldChildId, newChildId, child.level);
            });
          };
          updateChildren(oldId, newId, 1);
          this.dtChildCount[newId] = 0;
        }
      }

      // 将 draggedNode 移动到 targetNode 下方（紧跟在 targetNode 之后）
      if (newParentId) {
        const siblings = this.dtNodes.filter((n) => n.parentId === newParentId);
        siblings.sort((a, b) =>
          a.id.localeCompare(b.id, undefined, { numeric: true })
        );
        const currentIndex = siblings.findIndex((n) => n.id === targetNode.id);
        const newNodeIndex = siblings.findIndex((n) => n.id === draggedNode.id);

        if (newNodeIndex !== currentIndex + 1) {
          // 需要调整位置：将 draggedNode 移动到 targetNode 紧后方
          if (newNodeIndex > currentIndex + 1) {
            // draggedNode 在 targetNode 之后超过1位，向前移动
            for (let i = newNodeIndex; i > currentIndex + 1; i--) {
              const nodeA = siblings[i];
              const nodeB = siblings[i - 1];
              const idA = nodeA.id;
              const idB = nodeB.id;
              const childrenA = this.dtNodes.filter((n) => n.parentId === idA);
              const childrenB = this.dtNodes.filter((n) => n.parentId === idB);

              this.$set(nodeA, "id", idB);
              this.$set(nodeB, "id", idA);

              childrenA.forEach((child) => {
                this.$set(child, "parentId", idB);
              });
              childrenB.forEach((child) => {
                this.$set(child, "parentId", idA);
              });

              siblings[i] = nodeB;
              siblings[i - 1] = nodeA;
            }
          } else if (newNodeIndex < currentIndex) {
            // draggedNode 在 targetNode 之前，向后移动到 targetNode 之后
            for (let i = newNodeIndex; i < currentIndex; i++) {
              const nodeA = siblings[i];
              const nodeB = siblings[i + 1];
              const idA = nodeA.id;
              const idB = nodeB.id;
              const childrenA = this.dtNodes.filter((n) => n.parentId === idA);
              const childrenB = this.dtNodes.filter((n) => n.parentId === idB);

              this.$set(nodeA, "id", idB);
              this.$set(nodeB, "id", idA);

              childrenA.forEach((child) => {
                this.$set(child, "parentId", idB);
              });
              childrenB.forEach((child) => {
                this.$set(child, "parentId", idA);
              });

              siblings[i] = nodeB;
              siblings[i + 1] = nodeA;
            }
          }
          // 如果 newNodeIndex === currentIndex + 1，不需要移动
        }
      }
    },
    dtIsDescendant(nodeId, ancestorId) {
      const node = this.dtNodes.find((n) => n.id === nodeId);
      if (!node || !node.parentId) return false;
      if (node.parentId === ancestorId) return true;
      return this.dtIsDescendant(node.parentId, ancestorId);
    },
    dtUpdateChildrenId(parentId, newParentId, parentLevel) {
      const children = this.dtNodes.filter((n) => n.parentId === parentId);
      children.forEach((child) => {
        child.level = parentLevel + 1;
        child.parentId = newParentId;
        if (!this.dtChildCount[newParentId]) {
          this.dtChildCount[newParentId] = 0;
        }
        this.dtChildCount[newParentId]++;
        const newChildId = `${newParentId}.${this.dtChildCount[newParentId]}`;
        const oldChildId = child.id;
        child.id = newChildId;
        this.dtUpdateChildrenId(oldChildId, newChildId, child.level);
      });
    },
    // resize 方法
    dtStartResize(e, node) {
      // 阻止默认行为
      if (e.type === "touchstart") {
        e.preventDefault();
      }

      this.dtIsResizing = true;
      this.dtResizeNode = node;

      // 获取触摸或鼠标位置
      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      this.dtResizeStartX = clientX;
      this.dtResizeStartY = clientY;
      this.dtResizeStartWidth = node.width || 120;
      this.dtResizeStartHeight = node.height || 40;

      document.addEventListener("mousemove", this.dtOnResize);
      document.addEventListener("mouseup", this.dtEndResize);
      document.addEventListener("touchmove", this.dtOnResize);
      document.addEventListener("touchend", this.dtEndResize);
    },
    dtOnResize(e) {
      if (!this.dtIsResizing) return;

      // 阻止默认行为
      if (e.type === "touchmove") {
        e.preventDefault();
      }

      // 获取触摸或鼠标位置
      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.dtResizeStartX;
      const deltaY = clientY - this.dtResizeStartY;

      // 考虑画布缩放比例，鼠标移动的像素需要除以缩放比例
      const scale = this.dtScale || 1;
      const newWidth = Math.max(80, this.dtResizeStartWidth + deltaX / scale);
      const newHeight = Math.max(30, this.dtResizeStartHeight + deltaY / scale);

      this.dtResizeNode.width = newWidth;
      this.dtResizeNode.height = newHeight;
      this.dtResizeNode.isManualSize = true;

      this.dtUpdatePositions();
    },
    dtEndResize() {
      this.dtSaveSnapshot();

      this.dtIsResizing = false;
      this.dtResizeNode = null;
      this.dtSaveCurrentMindMap();

      document.removeEventListener("mousemove", this.dtOnResize);
      document.removeEventListener("mouseup", this.dtEndResize);
      document.removeEventListener("touchmove", this.dtOnResize);
      document.removeEventListener("touchend", this.dtEndResize);
    },
    // 编辑方法
    dtStartEdit(node) {
      this.dtEditingNode = node;
      const level = node.level - 1;
      this.dtEditingContent =
        (node.level == 1 && node.content == "<p>中心主题</p>") ||
        (node.level !== 1 && node.content == "<p>" + level + "级主题</p>")
          ? ""
          : node.content;
      this.openQuestionEditor(this.dtEditingContent, 31);
    },
    dtSaveEdit() {
      if (this.dtEditingNode) {
        this.dtSaveSnapshot();

        this.dtEditingNode.content = this.dtEditingContent;

        // 笔记节点不参与自动调整和布局更新
        if (this.dtEditingNode.id !== "__note__") {
          // 宽度优先：先扩展宽度到最大，再扩展高度到最大
          const emSize = this.dtSettings.defaultFontSize || 16;
          const maxWidth = this.dtSettings.maxNodeWidth * emSize;
          const maxHeight = this.dtSettings.maxNodeHeight * emSize;
          const minWidth = 80;
          const minHeight = 40;
          const extraWidth = this.dtEditingNode.level === 1 ? emSize * 0.5 : 0;
          const paddingX = 24;
          const paddingY = 16;
          const borderWidth = 4;
          const extraHeight = 12;
          const contentHtml = this.ex(this.dtEditingNode.content);

          // 第一次：不限制宽度，测量单行内容宽度
          const tempEl1 = document.createElement("div");
          tempEl1.innerHTML = contentHtml;
          tempEl1.style.visibility = "hidden";
          tempEl1.style.position = "absolute";
          tempEl1.style.display = "inline-block";
          tempEl1.style.fontSize = this.dtSettings.defaultFontSize + "px";
          tempEl1.style.fontFamily = this.dtSettings.defaultFontFamily;
          tempEl1.style.whiteSpace = "nowrap";
          tempEl1.style.wordBreak = "break-word";
          tempEl1.style.lineHeight = "1.5";
          document.body.appendChild(tempEl1);
          const singleLineWidth = tempEl1.offsetWidth;
          const singleLineHeight = tempEl1.offsetHeight;
          document.body.removeChild(tempEl1);

          let targetWidth;
          let targetHeight;
          let contentHeightAtTargetWidth;

          const neededSingleLineWidth =
            singleLineWidth + paddingX + extraWidth + borderWidth;

          if (neededSingleLineWidth <= maxWidth) {
            // 内容一行就能放下，宽度 = 内容宽度 + padding + border
            targetWidth = Math.max(minWidth, neededSingleLineWidth);
            contentHeightAtTargetWidth = singleLineHeight;
            targetHeight = Math.min(
              Math.max(
                minHeight,
                singleLineHeight + paddingY + borderWidth + extraHeight
              ),
              maxHeight
            );
          } else {
            // 内容一行放不下，宽度设为最大宽度，计算换行后的高度
            targetWidth = maxWidth;
            const contentWidth = targetWidth - paddingX - borderWidth;
            const tempEl2 = document.createElement("div");
            tempEl2.innerHTML = contentHtml;
            tempEl2.style.visibility = "hidden";
            tempEl2.style.position = "absolute";
            tempEl2.style.display = "inline-block";
            tempEl2.style.fontSize = this.dtSettings.defaultFontSize + "px";
            tempEl2.style.fontFamily = this.dtSettings.defaultFontFamily;
            tempEl2.style.whiteSpace = "pre-wrap";
            tempEl2.style.wordBreak = "break-word";
            tempEl2.style.lineHeight = "1.5";
            tempEl2.style.width = contentWidth + "px";
            document.body.appendChild(tempEl2);
            contentHeightAtTargetWidth = tempEl2.offsetHeight;
            document.body.removeChild(tempEl2);
            targetHeight = Math.min(
              Math.max(
                minHeight,
                contentHeightAtTargetWidth +
                  paddingY +
                  borderWidth +
                  extraHeight
              ),
              maxHeight
            );
          }

          // 应用新尺寸，使用$set确保响应式更新
          this.$set(this.dtEditingNode, "width", targetWidth);
          this.$set(this.dtEditingNode, "height", targetHeight);

          // 设置滚动标记
          this.$set(
            this.dtEditingNode,
            "needScroll",
            contentHeightAtTargetWidth + paddingY + borderWidth + extraHeight >
              maxHeight
          );

          // 重置手动调整标记，因为内容变了
          this.$set(this.dtEditingNode, "isManualSize", false);

          this.dtUpdatePositions();
        }
        if (
          this.dtIsQuizMode &&
          this.dtQuizCurrentNode &&
          this.dtQuizCurrentNode.quizType === "nodeContent" &&
          this.dtQuizCurrentNode.node.id === this.dtEditingNode.id
        ) {
          this.$set(
            this.dtQuizNodes[this.dtQuizCurrentIndex],
            "content",
            this.dtEditingNode.content
          );
          this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
          if (this.dtQuizCurrentNode.displayType === "choice") {
            const newOptions = this.dtGetChoiceOptions(
              this.dtQuizNodes[this.dtQuizCurrentIndex]
            );
            this.$set(
              this.dtQuizNodes[this.dtQuizCurrentIndex],
              "options",
              newOptions
            );
            if (this.dtQuizUserAnswers[this.dtQuizCurrentNode.quizId]) {
              this.$delete(
                this.dtQuizUserAnswers,
                this.dtQuizCurrentNode.quizId
              );
            }
          }
        }
        this.dtSaveCurrentMindMap();
      }
      this.dtCancelEdit();
    },
    dtAutoResizeNode(node) {
      if (node.isManualSize) return;

      const emSize = this.dtSettings.defaultFontSize || 16;
      const maxWidth = this.dtSettings.maxNodeWidth * emSize;
      const maxHeight = this.dtSettings.maxNodeHeight * emSize;
      const minWidth = 80;
      const minHeight = 40;
      const extraWidth = node.level === 1 ? emSize * 0.5 : 0;
      const paddingX = 24;
      const paddingY = 16;
      const borderWidth = 4;
      const extraHeight = 12;
      const contentHtml = this.ex(node.content);

      // 第一次：不限制宽度，测量单行内容宽度
      const tempEl1 = document.createElement("div");
      tempEl1.innerHTML = contentHtml;
      tempEl1.style.visibility = "hidden";
      tempEl1.style.position = "absolute";
      tempEl1.style.display = "inline-block";
      tempEl1.style.fontSize = this.dtSettings.defaultFontSize + "px";
      tempEl1.style.fontFamily = this.dtSettings.defaultFontFamily;
      tempEl1.style.whiteSpace = "nowrap";
      tempEl1.style.wordBreak = "break-word";
      tempEl1.style.lineHeight = "1.5";
      tempEl1.style.maxWidth = "none";
      document.body.appendChild(tempEl1);
      const singleLineWidth = tempEl1.offsetWidth;
      const singleLineHeight = tempEl1.offsetHeight;
      document.body.removeChild(tempEl1);

      let targetWidth;
      let targetHeight;
      let contentHeightAtTargetWidth;

      const neededSingleLineWidth =
        singleLineWidth + paddingX + extraWidth + borderWidth;

      if (neededSingleLineWidth <= maxWidth) {
        // 内容一行就能放下，宽度 = 内容宽度 + padding + border
        targetWidth = Math.max(minWidth, neededSingleLineWidth);
        contentHeightAtTargetWidth = singleLineHeight;
        targetHeight = Math.min(
          Math.max(
            minHeight,
            singleLineHeight + paddingY + borderWidth + extraHeight
          ),
          maxHeight
        );
      } else {
        // 内容一行放不下，宽度设为最大宽度，计算换行后的高度
        targetWidth = maxWidth;
        const contentWidth = targetWidth - paddingX - borderWidth;
        const tempEl2 = document.createElement("div");
        tempEl2.innerHTML = contentHtml;
        tempEl2.style.visibility = "hidden";
        tempEl2.style.position = "absolute";
        tempEl2.style.display = "inline-block";
        tempEl2.style.fontSize = this.dtSettings.defaultFontSize + "px";
        tempEl2.style.fontFamily = this.dtSettings.defaultFontFamily;
        tempEl2.style.whiteSpace = "pre-wrap";
        tempEl2.style.wordBreak = "break-word";
        tempEl2.style.lineHeight = "1.5";
        tempEl2.style.width = contentWidth + "px";
        tempEl2.style.maxWidth = contentWidth + "px";
        document.body.appendChild(tempEl2);
        contentHeightAtTargetWidth = tempEl2.offsetHeight;
        document.body.removeChild(tempEl2);
        targetHeight = Math.min(
          Math.max(
            minHeight,
            contentHeightAtTargetWidth + paddingY + borderWidth + extraHeight
          ),
          maxHeight
        );
      }

      // 应用新尺寸，使用$set确保响应式更新
      this.$set(node, "width", targetWidth);
      this.$set(node, "height", targetHeight);

      // 设置滚动标记
      this.$set(
        node,
        "needScroll",
        contentHeightAtTargetWidth + paddingY + borderWidth + extraHeight >
          maxHeight
      );
    },
    dtCancelEdit() {
      this.dtEditingNode = null;
      this.dtEditingContent = "";
    },
    // 注释编辑方法
    dtAddComment() {
      if (this.dtSelectedNode) {
        this.dtOpenDescriptionEdit(this.dtSelectedNode);
      }
    },
    dtOpenDescriptionView(node) {
      this.dtCurrentDescriptionNode = node;
      this.dtIsDescriptionViewOpen = true;
    },
    dtCloseDescriptionView() {
      this.dtIsDescriptionViewOpen = false;
      this.dtCurrentDescriptionNode = null;
    },
    dtOpenDescriptionEdit(node) {
      this.dtEditingDescriptionNode = node;
      this.dtEditingDescription = node.description || "";
      this.openQuestionEditor(this.dtEditingDescription, 32);
    },
    dtSaveDescription() {
      if (this.dtEditingDescriptionNode) {
        this.dtSaveSnapshot();

        this.$set(
          this.dtEditingDescriptionNode,
          "description",
          this.dtEditingDescription
        );
        const today = new Date().toISOString().split("T")[0];
        if (!this.dtEditingDescriptionNode.descriptionMastery) {
          this.$set(this.dtEditingDescriptionNode, "descriptionMastery", {
            level: 1,
            lastTestDate: today,
          });
        } else {
          this.$set(this.dtEditingDescriptionNode, "descriptionMastery", {
            level: this.dtEditingDescriptionNode.descriptionMastery.level,
            lastTestDate: today,
          });
        }
        if (
          this.dtIsQuizMode &&
          this.dtQuizCurrentNode &&
          this.dtQuizCurrentNode.quizType === "nodeDescription" &&
          this.dtQuizCurrentNode.node.id === this.dtEditingDescriptionNode.id
        ) {
          this.$set(
            this.dtQuizNodes[this.dtQuizCurrentIndex],
            "content",
            this.dtEditingDescriptionNode.description
          );
          this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
          if (this.dtQuizCurrentNode.displayType === "choice") {
            const newOptions = this.dtGetChoiceOptions(
              this.dtQuizNodes[this.dtQuizCurrentIndex]
            );
            this.$set(
              this.dtQuizNodes[this.dtQuizCurrentIndex],
              "options",
              newOptions
            );
            if (this.dtQuizUserAnswers[this.dtQuizCurrentNode.quizId]) {
              this.$delete(
                this.dtQuizUserAnswers,
                this.dtQuizCurrentNode.quizId
              );
            }
          }
        }
        this.dtSaveCurrentMindMap();
      }
    },
    dtCancelDescriptionEdit() {
      this.dtEditingDescriptionNode = null;
      this.dtEditingDescription = "";
    },
    // 附件相关方法
    dtAddAttachmentBtn() {
      if (this.dtSelectedNode) {
        this.dtOpenAttachmentList(this.dtSelectedNode);
      }
    },
    dtOpenAttachmentList(node) {
      this.dtIsAttachmentListOpen = true;
      this.dtCurrentAttachmentNode = node;
    },
    dtCloseAttachmentList() {
      this.dtIsAttachmentListOpen = false;
      this.dtCurrentAttachmentNode = null;
    },
    // 标签相关方法
    dtOpenTagEditor() {
      if (!this.dtSelectedNode) return;
      this.dtTagEditorNode = this.dtSelectedNode;
      const tags = this.dtSelectedNode.tags || [];
      this.dtTagEditorContent = tags.join(" ");
      this.dtIsTagEditorOpen = true;
      this.$nextTick(() => {
        if (this.$refs.dtTagInput) {
          this.$refs.dtTagInput.focus();
        }
      });
    },
    dtCloseTagEditor() {
      this.dtIsTagEditorOpen = false;
      this.dtTagEditorNode = null;
      this.dtTagEditorContent = "";
    },
    dtSaveTags() {
      if (!this.dtTagEditorNode) return;
      const tags = this.dtTagEditorContent
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t);
      this.$set(this.dtTagEditorNode, "tags", tags);
      this.dtSaveCurrentMindMap();
      this.dtCloseTagEditor();
    },
    dtAppendTag(tag) {
      const current = this.dtTagEditorContent.trim();
      if (current) {
        this.dtTagEditorContent = current + " " + tag;
      } else {
        this.dtTagEditorContent = tag;
      }
    },
    dtSelectTag(tag) {
      if (this.dtSelectedTag === "__favorite__") {
        // 如果之前选的是收藏，先清除收藏高亮
        this.dtClearFavoriteHighlight();
      }
      this.dtSelectedTag = this.dtSelectedTag === tag ? "" : tag;
      if (this.dtSelectedTag) {
        this.dtHighlightNodesWithTag(this.dtSelectedTag);
      }
    },
    dtSelectFavorite() {
      if (this.dtSelectedTag === "__favorite__") {
        // 再次点击取消选择
        this.dtClearFavoriteHighlight();
        this.dtSelectedTag = "";
      } else {
        // 清除标签高亮
        this.dtClearTagHighlight();
        this.dtSelectedTag = "__favorite__";
        this.dtHighlightFavoriteNodes();
      }
    },
    dtHighlightFavoriteNodes() {
      const favoriteNodes = this.dtNodes.filter(
        (n) => n.isFavorite && !n.id.startsWith("summary_")
      );
      favoriteNodes.forEach((node) => {
        this.$set(node, "isHighlighted", true);
      });
    },
    dtClearFavoriteHighlight() {
      this.dtNodes.forEach((node) => {
        this.$set(node, "isHighlighted", false);
      });
    },
    dtHighlightNodesWithTag(tag) {
      this.dtNodes.forEach((node) => {
        if (node.tags && node.tags.includes(tag)) {
          this.$set(node, "isHighlighted", true);
        } else {
          this.$set(node, "isHighlighted", false);
        }
      });
    },
    dtClearTagHighlight() {
      this.dtNodes.forEach((node) => {
        this.$set(node, "isHighlighted", false);
      });
    },
    dtToggleTagPanel() {
      this.dtTagPanelCollapsed = !this.dtTagPanelCollapsed;
    },
    dtGetTagNodeCount(tag) {
      return this.dtNodes.filter((n) => n.tags && n.tags.includes(tag)).length;
    },
    // 设置相关方法
    dtOpenSettings() {
      this.dtIsSettingsOpen = true;
    },
    dtCloseSettings() {
      this.dtIsSettingsOpen = false;
    },
    dtResetSettings() {
      this.dtSettings = {
        defaultFontSize: 14,
        defaultFontFamily: "Microsoft YaHei",
        maxNodeWidth: 20,
        maxNodeHeight: 15,
        levelGap: 100,
        nodeGap: 60,
        lineStyle: "diverge",
        expandDirection: "horizontal",
        theme: "default",
        showBorder: true,
      };
    },
    // 搜索相关方法
    dtOpenSearch() {
      this.dtIsSearchOpen = true;
      if (
        this.dtSearchKeyword ||
        this.dtSearchFavoritesOnly ||
        this.dtSearchTag
      ) {
        this.dtPerformSearch();
      }
      this.$nextTick(() => {
        if (this.$refs.dtSearchInput) {
          this.$refs.dtSearchInput.focus();
        }
      });
    },
    dtCloseSearch() {
      this.dtIsSearchOpen = false;
      // 保留搜索条件，下次打开时仍可使用
    },
    dtToggleSearchTag(tag) {
      if (this.dtSearchTag === tag) {
        this.dtSearchTag = "";
      } else {
        this.dtSearchTag = tag;
      }
      this.dtPerformSearch();
    },
    dtClearSearchTag() {
      this.dtSearchTag = "";
      this.dtPerformSearch();
    },
    dtResetSearch() {
      this.dtClearSearchTag();
      this.dtSearchKeyword = "";
      this.dtSearchFavoritesOnly = false;
      this.dtSearchMasteryEnabled = false;
      this.dtSearchMasteryMin = 1;
      this.dtSearchMasteryMax = 9;
    },
    dtOnMasteryMinChange() {
      if (this.dtSearchMasteryMin < 1) this.dtSearchMasteryMin = 1;
      if (this.dtSearchMasteryMin > 9) this.dtSearchMasteryMin = 9;
      if (this.dtSearchMasteryMin > this.dtSearchMasteryMax) {
        this.dtSearchMasteryMax = this.dtSearchMasteryMin;
      }
      if (this.dtSearchMasteryEnabled) {
        this.dtPerformSearch();
      }
    },
    dtOnMasteryMaxChange() {
      if (this.dtSearchMasteryMax < 1) this.dtSearchMasteryMax = 1;
      if (this.dtSearchMasteryMax > 9) this.dtSearchMasteryMax = 9;
      if (this.dtSearchMasteryMax < this.dtSearchMasteryMin) {
        this.dtSearchMasteryMin = this.dtSearchMasteryMax;
      }
      if (this.dtSearchMasteryEnabled) {
        this.dtPerformSearch();
      }
    },
    dtPerformSearch() {
      const keyword = this.dtSearchKeyword.trim().toLowerCase();
      const favoritesOnly = this.dtSearchFavoritesOnly;
      const tagFilter = this.dtSearchTag;
      const masteryEnabled = this.dtSearchMasteryEnabled;
      const masteryMin = this.dtSearchMasteryMin;
      const masteryMax = this.dtSearchMasteryMax;

      // 如果没有任何筛选条件，则清空结果
      if (!keyword && !favoritesOnly && !tagFilter && !masteryEnabled) {
        this.dtSearchResults = [];
        return;
      }

      // 收集所有收藏的节点ID（用于快速判断）
      const favoriteIds = new Set(
        this.dtNodes.filter((n) => n.isFavorite).map((n) => n.id)
      );

      this.dtSearchResults = this.dtNodes
        .filter((node) => {
          // 检查概要节点，跳过
          if (node.id.startsWith("summary_")) {
            return false;
          }

          // 检查掌握程度筛选
          if (masteryEnabled) {
            const level =
              node.masteryLevel && node.masteryLevel.level
                ? node.masteryLevel.level
                : 1;
            if (level < masteryMin || level > masteryMax) {
              return false;
            }
          }

          // 首先检查收藏筛选
          if (favoritesOnly && !favoriteIds.has(node.id)) {
            return false;
          }

          // 检查标签筛选
          if (tagFilter) {
            const nodeTags = node.tags || [];
            if (!nodeTags.includes(tagFilter)) {
              return false;
            }
          }

          // 如果有关键字，检查是否匹配
          if (keyword) {
            const content = node.content.replace(/<[^>]+>/g, "").toLowerCase();
            const description = (node.description || "").toLowerCase();
            return content.includes(keyword) || description.includes(keyword);
          }

          // 没有关键字但有其他筛选，返回匹配节点
          return true;
        })
        .map((node) => {
          const plainContent = node.content.replace(/<[^>]+>/g, "");

          // 高亮匹配的关键词
          let displayContent = plainContent;
          if (keyword) {
            const regex = new RegExp(keyword, "gi");
            displayContent = plainContent.replace(
              regex,
              (match) => `<span class="dt-search-highlight">${match}</span>`
            );
          }

          // 添加收藏标识
          const isFav = node.isFavorite ? " ★" : "";

          return {
            ...node,
            displayContent: displayContent + (isFav && !keyword ? " ★" : ""),
          };
        });
    },
    dtLocateNode(node) {
      // 选中节点
      this.dtSelectNode(node);

      // 展开所有父节点以确保目标节点可见
      this.dtExpandPathToNode(node);

      // 计算画布中心位置
      const containerWidth = this.$refs.dtContainer
        ? this.$refs.dtContainer.clientWidth
        : 800;
      const containerHeight = this.$refs.dtContainer
        ? this.$refs.dtContainer.clientHeight
        : 600;

      // 计算节点中心位置
      const nodeWidth = node.width || 120;
      const nodeHeight = node.height || 40;
      const nodeCenterX = node.x + nodeWidth / 2;
      const nodeCenterY = node.y + nodeHeight / 2;

      // 设置偏移使节点居中
      this.dtOffsetX = containerWidth / 2 - nodeCenterX * this.dtScale;
      this.dtOffsetY = containerHeight / 2 - nodeCenterY * this.dtScale;

      // 关闭搜索弹窗
      this.dtCloseSearch();
    },
    dtExpandPathToNode(node) {
      // 找到从根节点到目标节点的路径
      const path = [];
      let current = node;

      while (current) {
        path.unshift(current.id);
        current = this.dtNodes.find((n) => n.id === current.parentId);
      }

      // 移除路径中所有节点的折叠状态
      path.forEach((id) => {
        const index = this.dtCollapsedNodes.indexOf(id);
        if (index > -1) {
          this.dtCollapsedNodes.splice(index, 1);
        }
      });

      // 更新位置
      this.$nextTick(() => {
        this.dtUpdatePositions();
      });
    },
    // 导入相关方法
    dtOpenImport() {
      this.dtIsImportOpen = true;
    },
    dtCloseImport() {
      this.dtIsImportOpen = false;
    },
    dtTriggerMarkdownImport() {
      this.$refs.dtImportFileInput.click();
    },
    dtTriggerMindMapJSONImport() {
      this.$refs.dtMindMapJSONInput.click();
    },
    dtHandleMarkdownImport(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        this.dtParseMarkdown(content);
      };
      reader.readAsText(file, "utf-8");
    },
    dtHandleMindMapJSONImport(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const data = JSON.parse(content);

          if (data.type !== "pdj-MindMap") {
            alert("无效的 pdj-MindMap 文件格式");
            return;
          }

          if (data.data && Array.isArray(data.data)) {
            this.dtMindMaps = data.data;
            this.dtCloseImport();
            alert("导入成功！");
          } else {
            alert("文件数据格式不正确");
          }
        } catch (error) {
          alert("文件解析失败，请确保是有效的 JSON 文件");
        }
      };
      reader.readAsText(file, "utf-8");
    },
    dtParseMarkdown(content) {
      const lines = content.split("\n");
      const nodes = [];

      let currentNodeId = 0;
      let parentStack = [];
      let currentDescription = "";
      let inNoteBlock = false;

      lines.forEach((line) => {
        // 匹配标题
        const titleMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (titleMatch) {
          // 如果有未保存的注释，保存到上一个节点
          if (currentDescription && currentNodeId > 0) {
            nodes[currentNodeId - 1].description = currentDescription.trim();
            currentDescription = "";
          }

          const level = titleMatch[1].length;
          const text = titleMatch[2].trim();

          // 调整父节点栈
          while (parentStack.length >= level) {
            parentStack.pop();
          }

          currentNodeId++;
          const node = {
            id: String(currentNodeId),
            content: text,
            description: "",
            descriptionMastery: {
              level: 1,
              lastTestDate: new Date().toISOString().split("T")[0],
            },
            level: level,
            parentId:
              parentStack.length > 0
                ? parentStack[parentStack.length - 1]
                : null,
            x: 0,
            y: 0,
            isFavorite: false,
            masteryLevel: {
              level: 1,
              lastTestDate: new Date().toISOString().split("T")[0],
            },
          };

          nodes.push(node);
          parentStack.push(String(currentNodeId));
          inNoteBlock = false;
          return;
        }

        // 匹配注释块开始（> **注释:**）
        const noteStartMatch = line.match(/^>\s*\*\*注释:\*\*\s*(.+)/);
        if (noteStartMatch) {
          inNoteBlock = true;
          currentDescription = noteStartMatch[1];
          return;
        }

        // 如果在注释块中，继续收集内容
        if (inNoteBlock && line.startsWith(">")) {
          const content = line.replace(/^>\s*/, "");
          if (content && !content.startsWith("**附件:**")) {
            currentDescription += "\n" + content;
          }
        }
      });

      // 保存最后一个节点的注释
      if (currentDescription && currentNodeId > 0) {
        nodes[currentNodeId - 1].description = currentDescription.trim();
      }

      // 计算子节点数量
      const childCount = {};
      nodes.forEach((node) => {
        if (node.parentId) {
          childCount[node.parentId] = (childCount[node.parentId] || 0) + 1;
        }
      });

      // 替换当前思维导图内容（清空旧的，使用新导入的）
      const mindMapName = "导入的思维导图";
      const updatedMindMap = {
        name: mindMapName,
        createdAt: new Date().toISOString(),
        nodes: nodes,
        childCount: childCount,
        settings: {
          defaultFontSize: 14,
          defaultFontFamily: "Microsoft YaHei",
          maxNodeWidth: 20,
          maxNodeHeight: 15,
          levelGap: 100,
          nodeGap: 60,
          lineStyle: "diverge",
          expandDirection: "horizontal",
          theme: "default",
        },
      };

      // 直接替换当前思维导图
      if (this.dtCurrentMindMapIndex >= 0) {
        this.$set(this.dtMindMaps, this.dtCurrentMindMapIndex, updatedMindMap);
      } else {
        // 如果没有当前思维导图，添加一个新的
        this.dtMindMaps.push(updatedMindMap);
        this.dtCurrentMindMapIndex = this.dtMindMaps.length - 1;
      }

      this.dtOpenMindMap(this.dtCurrentMindMapIndex);

      this.$nextTick(() => {
        this.dtUpdatePositions();
      });

      this.dtCloseImport();

      alert("导入成功！");
    },
    // 导出相关方法
    dtOpenExport() {
      this.dtIsExportOpen = true;
    },
    dtCloseExport() {
      this.dtIsExportOpen = false;
    },
    dtExportHTML() {
      const mindMapName = this.dtCurrentMindMapName || "思维导图";
      const nodes = JSON.parse(JSON.stringify(this.dtNodes));
      const collapsedNodes = [...this.dtCollapsedNodes];

      // 生成HTML内容
      const htmlContent = this.dtGenerateHTMLOutline(
        nodes,
        collapsedNodes,
        mindMapName
      );

      // 创建并下载文件
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${mindMapName}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.dtCloseExport();
    },
    dtGenerateHTMLOutline(nodes, collapsedNodes, title) {
      // 构建节点树
      const buildTree = (parentId, level) => {
        return nodes
          .filter((n) => n.parentId === parentId)
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          )
          .map((node) => {
            const children = buildTree(node.id, level + 1);
            const isCollapsed = collapsedNodes.includes(node.id);
            return {
              node,
              children,
              isCollapsed,
              level,
            };
          });
      };

      const tree = buildTree(null, 1);

      // 生成节点HTML
      const generateNodeHTML = (item) => {
        const hasChildren = item.children.length > 0;
        const nodeId = `node-${item.node.id}`;
        const childrenId = `children-${item.node.id}`;
        const paddingLeft = (item.level - 1) * 30;

        let html = `<div class="outline-item" style="padding-left: ${paddingLeft}px;">`;

        if (hasChildren) {
          html += `<span class="toggle-btn" onclick="toggleNode('${nodeId}', '${childrenId}')">${
            item.isCollapsed ? "+" : "-"
          }</span>`;
        } else {
          html += `<span class="toggle-placeholder"></span>`;
        }

        html += `<span class="node-content">${item.node.content}</span>`;

        const hasMeta =
          item.node.description ||
          (item.node.attachments && item.node.attachments.length > 0) ||
          item.node.isFavorite ||
          (item.node.tags && item.node.tags.length > 0);

        if (hasMeta) {
          html += `<div class="meta-row">`;

          if (item.node.isFavorite) {
            html += `<span class="favorite">★</span>`;
          }

          if (item.node.description) {
            html += `<span class="description" title="${item.node.description}">[注释]</span>`;
          }

          if (item.node.tags && item.node.tags.length > 0) {
            html += `<span class="tags">`;
            item.node.tags.forEach((tag) => {
              html += `<span class="tag">${tag}</span>`;
            });
            html += `</span>`;
          }

          if (item.node.attachments && item.node.attachments.length > 0) {
            html += `<span class="attachments">`;
            item.node.attachments.forEach((att) => {
              html += `<a class="attachment-link" download="${att.name}" href="data:${att.type};base64,${att.data}">${att.name}</a>`;
            });
            html += `</span>`;
          }

          html += `</div>`;
        }

        html += `</div>`;

        if (hasChildren) {
          html += `<div id="${childrenId}" class="children-container" style="display: ${
            item.isCollapsed ? "none" : "block"
          };">`;
          item.children.forEach((child) => {
            html += generateNodeHTML(child);
          });
          html += `</div>`;
        }

        return html;
      };

      const nodesHTML = tree.map((item) => generateNodeHTML(item)).join("");

      // 使用数组拼接避免解析问题
      const htmlParts = [
        "<!DOCTYPE html>",
        '<html lang="zh-CN">',
        "<head>",
        '  <meta charset="UTF-8">',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        "  <title>" + title + "</title>",
        "  <style>",
        "    body { font-family: 'Microsoft YaHei', sans-serif; padding: 20px; background: #f5f5f5; }",
        "    .outline-container { max-width: 800px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }",
        "    h1 { text-align: center; color: #333; margin-bottom: 20px; }",
        "    .note-section { max-width: 800px; margin: 20px auto 0; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); }",
        "    .note-section h2 { color: #333; margin-bottom: 15px; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px; }",
        "    .note-content { font-size: 14px; line-height: 1.6; color: #333; }",
        "    .note-content p { margin-bottom: 10px; }",
        "    .note-content ul, .note-content ol { margin-left: 20px; margin-bottom: 10px; }",
        "    .outline-item { padding: 10px 0; border-bottom: 1px solid #eee; }",
        "    .outline-item:last-child { border-bottom: none; }",
        "    .item-row { display: flex; align-items: center; flex-wrap: wrap; }",
        "    .toggle-btn { width: 20px; height: 20px; background: #409eff; color: white; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold; }",
        "    .toggle-btn:hover { background: #66b1ff; }",
        "    .toggle-placeholder { width: 20px; margin-right: 10px; }",
        "    .node-content { flex: 1; min-width: 200px; }",
        "    .meta-row { margin-top: 5px; margin-left: 30px; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }",
        "    .favorite { color: #000; font-size: 14px; }",
        "    .description { color: #67c23a; font-size: 12px; }",
        "    .tags { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }",
        "    .tag { display: inline-block; padding: 1px 5px; background-color: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; border-radius: 3px; font-size: 10px; white-space: nowrap; }",
        "    .attachments { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }",
        "    .attachment-link { color: #409eff; font-size: 12px; text-decoration: none; }",
        "    .attachment-link:hover { text-decoration: underline; }",
        "    .children-container { margin-left: 20px; }",
        "  </style>",
        "</head>",
        "<body>",
        '  <div class="outline-container">',
        "    <h1>" + title + "</h1>",
        "    " + nodesHTML,
        "  </div>",
        ...(this.dtNoteNode && this.dtNoteNode.content
          ? [
              '  <div class="note-section">',
              "    <h2>笔记</h2>",
              '    <div class="note-content">' +
                this.dtNoteNode.content +
                "</div>",
              "  </div>",
            ]
          : []),
        "  <scr" + "ipt>",
        "    function toggleNode(nodeId, childrenId) {",
        "      var btn = document.querySelector('[onclick=\"toggleNode(' + nodeId + ', ' + childrenId + ')\"]');",
        "      var children = document.getElementById(childrenId);",
        "      if (children.style.display === 'none') {",
        "        children.style.display = 'block';",
        "        btn.textContent = '-';",
        "      } else {",
        "        children.style.display = 'none';",
        "        btn.textContent = '+';",
        "      }",
        "    }",
        "  </scr" + "ipt>",
        "</body>",
        "</html>",
      ];

      return htmlParts.join("\n");
    },
    dtExportPDF() {
      // 先展开所有节点
      const originalCollapsed = [...this.dtCollapsedNodes];
      this.dtCollapsedNodes = [];
      this.dtUpdatePositions();

      this.$nextTick(() => {
        // 使用浏览器打印功能导出PDF
        const printContent = this.dtGeneratePrintContent();
        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();

        // 恢复原来的收起状态
        this.dtCollapsedNodes = originalCollapsed;
        this.dtUpdatePositions();

        this.dtCloseExport();
      });
    },
    dtGeneratePrintContent() {
      const mindMapName = this.dtCurrentMindMapName || "思维导图";
      const nodes = JSON.parse(JSON.stringify(this.dtNodes));

      // 构建节点树（全展开状态）
      const buildTree = (parentId, level) => {
        return nodes
          .filter((n) => n.parentId === parentId)
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          )
          .map((node) => {
            const children = buildTree(node.id, level + 1);
            return { node, children, level };
          });
      };

      const tree = buildTree(null, 1);

      // 生成节点HTML
      const generateNodeHTML = (item) => {
        const paddingLeft = (item.level - 1) * 30;
        let html = `<div class="outline-item" style="padding-left: ${paddingLeft}px;">`;
        html += `<span class="node-content">${item.node.content}</span>`;

        if (item.node.description) {
          html += `<span class="description">[注释: ${item.node.description}]</span>`;
        }

        if (item.node.attachments && item.node.attachments.length > 0) {
          html += `<span class="attachments">[附件: ${item.node.attachments
            .map((att) => att.name)
            .join(", ")}]</span>`;
        }

        html += `</div>`;

        if (item.children.length > 0) {
          item.children.forEach((child) => {
            html += generateNodeHTML(child);
          });
        }

        return html;
      };

      const nodesHTML = tree.map((item) => generateNodeHTML(item)).join("");

      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${mindMapName}</title>
  <style>
    body { font-family: 'Microsoft YaHei', sans-serif; padding: 20px; background: #fff; }
    .outline-container { max-width: 800px; margin: 0 auto; }
    h1 { text-align: center; color: #333; margin-bottom: 20px; }
    .outline-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .outline-item:last-child { border-bottom: none; }
    .node-content { font-weight: 500; }
    .description { color: #67c23a; font-size: 12px; margin-left: 10px; }
    .attachments { color: #409eff; font-size: 12px; margin-left: 10px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="outline-container">
    <h1>${mindMapName}</h1>
    ${nodesHTML}
  </div>
</body>
</html>`;
    },
    dtExportPNG() {
      // 先展开所有节点
      const originalCollapsed = [...this.dtCollapsedNodes];
      this.dtCollapsedNodes = [];
      this.dtUpdatePositions();

      this.$nextTick(() => {
        // 使用html2canvas或canvas截图
        this.dtCaptureCanvas();

        // 恢复原来的收起状态
        this.dtCollapsedNodes = originalCollapsed;
        this.dtUpdatePositions();

        this.dtCloseExport();
      });
    },
    dtExportMarkdown() {
      const mindMapName = this.dtCurrentMindMapName || "思维导图";
      const nodes = JSON.parse(JSON.stringify(this.dtNodes));

      // 生成 Markdown 内容
      const mdContent = this.dtGenerateMarkdown(nodes, mindMapName);

      // 创建并下载文件
      const blob = new Blob([mdContent], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${mindMapName}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.dtCloseExport();
    },
    dtExportMindMapJSON() {
      const allData = {
        version: "1.0",
        type: "pdj-MindMap",
        data: JSON.parse(JSON.stringify(this.dtMindMaps)),
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(allData, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pdj-MindMap-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.dtCloseExport();
    },
    dtGenerateMarkdown(nodes, title) {
      // HTML 转 Markdown（简化处理）
      const htmlToMarkdown = (html) => {
        if (!html) return "";
        // 保留加粗、斜体、删除线
        let text = html
          .replace(/<b>(.*?)<\/b>/gi, "**$1**")
          .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
          .replace(/<i>(.*?)<\/i>/gi, "*$1*")
          .replace(/<em>(.*?)<\/em>/gi, "*$1*")
          .replace(/<u>(.*?)<\/u>/gi, "_$1_")
          .replace(/<del>(.*?)<\/del>/gi, "~~$1~~")
          .replace(/<s>(.*?)<\/s>/gi, "~~$1~~")
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(
            /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi,
            "![$2]($1)"
          )
          .replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, "![]($1)")
          // 移除其他 HTML 标签
          .replace(/<[^>]+>/g, "");
        // 解码 HTML 实体
        text = text
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        return text;
      };

      // 生成节点 Markdown
      const generateNodeMarkdown = (node, level) => {
        const prefix = "#".repeat(level) + " ";
        let md = prefix + htmlToMarkdown(node.content);

        // 添加注释
        if (node.description) {
          md += "\n\n> **注释:** " + node.description;
        }

        // 添加附件信息
        if (node.attachments && node.attachments.length > 0) {
          const attList = node.attachments
            .map((att) => `- ${att.name} (${att.type || "file"})`)
            .join("\n");
          md += "\n\n> **附件:**\n" + attList;
        }

        return md;
      };

      // 找到所有根节点
      const rootNodes = nodes.filter((n) => n.level === 1);
      if (rootNodes.length === 0) {
        return "# " + title + "\n\n_无内容_";
      }

      rootNodes.sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true })
      );

      // 构建 Markdown（每个根节点作为一级标题）
      let md = "";

      // 递归生成子节点
      const generateChildren = (parentId, level) => {
        const children = nodes
          .filter((n) => n.parentId === parentId)
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          );

        children.forEach((child) => {
          md += "\n" + generateNodeMarkdown(child, level) + "\n";
          generateChildren(child.id, level + 1);
        });
      };

      // 遍历所有根节点
      rootNodes.forEach((rootNode, index) => {
        if (index > 0) {
          md += "\n---\n";
        }
        md += generateNodeMarkdown(rootNode, 1) + "\n";
        generateChildren(rootNode.id, 2);
      });

      return md;
    },
    dtCaptureCanvas() {
      const mindMapName = this.dtCurrentMindMapName || "思维导图";

      // 创建一个临时canvas来绘制
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 计算画布实际尺寸
      const nodes = this.dtNodes;
      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      nodes.forEach((node) => {
        const w = node.width || 120;
        const h = node.height || 40;
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x + w);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y + h);
      });

      const padding = 50;
      const width = maxX - minX + padding * 2;
      const height = maxY - minY + padding * 2;

      canvas.width = width;
      canvas.height = height;

      // 绘制白色背景
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);

      // 绘制标题
      ctx.fillStyle = "#333";
      ctx.font = "bold 24px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(mindMapName, width / 2, 30);

      // 绘制连线
      ctx.strokeStyle = "#409eff";
      ctx.lineWidth = 2;
      this.dtLines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1 - minX + padding, line.y1 - minY + padding + 30);
        ctx.lineTo(line.x2 - minX + padding, line.y2 - minY + padding + 30);
        ctx.stroke();
      });

      // 绘制节点
      nodes.forEach((node) => {
        const x = node.x - minX + padding;
        const y = node.y - minY + padding + 30;
        const w = node.width || 120;
        const h = node.height || 40;

        // 绘制节点背景
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#409eff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        ctx.stroke();

        // 绘制节点文本（简化处理，去除HTML标签）
        ctx.fillStyle = "#333";
        ctx.font = "14px Microsoft YaHei";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = node.content.replace(/<[^>]+>/g, "");
        ctx.fillText(text, x + w / 2, y + h / 2, w - 10);
      });

      // 下载图片
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${mindMapName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    dtAddAttachment() {
      if (this.$refs.dtAttachmentFileInput) {
        this.$refs.dtAttachmentFileInput.click();
      }
    },
    dtHandleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.dtSaveSnapshot();

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(",")[1];
        if (!this.dtCurrentAttachmentNode.attachments) {
          this.$set(this.dtCurrentAttachmentNode, "attachments", []);
        }
        this.dtCurrentAttachmentNode.attachments.push({
          name: file.name,
          data: base64Data,
          type: file.type,
        });
        this.dtSaveCurrentMindMap();
      };
      reader.readAsDataURL(file);

      event.target.value = "";
    },
    dtDownloadAttachment(attachment) {
      const blob = this.dtBase64ToBlob(attachment.data, attachment.type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    dtBase64ToBlob(base64, type) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: type });
    },
    dtDeleteAttachment(index) {
      if (!confirm("确定要删除这个附件吗？")) return;

      this.dtSaveSnapshot();

      this.dtCurrentAttachmentNode.attachments.splice(index, 1);
      this.dtSaveCurrentMindMap();
    },
    dtGetDefaultNodeContent(level) {
      if (level === 1) {
        return "<p>中心主题</p>";
      }
      const displayLevel = level - 1;
      return `<p>${displayLevel}级主题</p>`;
    },
    dtAddChildNode() {
      if (!this.dtSelectedNode) {
        alert("请先选中一个节点");
        return;
      }

      // 如果当前节点的子节点都是收起状态，先展开它们
      const children = this.dtNodes.filter(
        (n) => n.parentId === this.dtSelectedNode.id
      );
      if (children.length > 0) {
        const allCollapsed = children.every((child) =>
          this.dtCollapsedNodes.includes(child.id)
        );
        if (allCollapsed) {
          children.forEach((child) => {
            const index = this.dtCollapsedNodes.indexOf(child.id);
            if (index > -1) {
              this.dtCollapsedNodes.splice(index, 1);
            }
          });
        }
      }

      this.dtSaveSnapshot();

      const parentId = this.dtSelectedNode.id;
      if (!this.dtChildCount[parentId]) {
        this.dtChildCount[parentId] = 0;
      }
      this.dtChildCount[parentId]++;

      const newId = `${parentId}.${this.dtChildCount[parentId]}`;
      const today = new Date().toISOString().split("T")[0];
      const newNode = {
        id: newId,
        content: this.dtGetDefaultNodeContent(this.dtSelectedNode.level + 1),
        description: "",
        descriptionMastery: { level: 1, lastTestDate: today },
        level: this.dtSelectedNode.level + 1,
        parentId: parentId,
        x: 0,
        y: 0,
        isFavorite: false,
        tags: [],
        masteryLevel: { level: 1, lastTestDate: today },
      };
      // 双侧布局下，根节点的子节点默认添加到右侧
      if (
        this.dtSelectedNode.level === 1 &&
        this.dtSettings.expandDirection === "both"
      ) {
        newNode.side = "right";
      }
      this.dtNodes.push(newNode);
      this.dtChildCount[newId] = 0;
      this.dtAutoResizeNode(newNode);
      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtAddSiblingNode() {
      if (!this.dtSelectedNode) {
        alert("请先选中一个节点");
        return;
      }

      this.dtSaveSnapshot();

      if (this.dtSelectedNode.level === 1) {
        // 根节点：添加一个新的根节点
        const rootNodes = this.dtNodes.filter((n) => n.level === 1);
        const maxRootId = rootNodes.reduce((max, node) => {
          const num = parseInt(node.id, 10);
          return !isNaN(num) && num > max ? num : max;
        }, 0);
        const newId = String(maxRootId + 1);
        const today = new Date().toISOString().split("T")[0];

        const newNode = {
          id: newId,
          content: this.dtGetDefaultNodeContent(1),
          description: "",
          descriptionMastery: { level: 1, lastTestDate: today },
          level: 1,
          parentId: null,
          x: 0,
          y: 0,
          isFavorite: false,
          tags: [],
          masteryLevel: { level: 1, lastTestDate: today },
        };

        this.dtNodes.push(newNode);
        this.dtChildCount[newId] = 0;
        this.dtAutoResizeNode(newNode);
      } else {
        // 子节点：在相同父节点下添加新子节点
        const parentId = this.dtSelectedNode.parentId;
        if (!this.dtChildCount[parentId]) {
          this.dtChildCount[parentId] = 0;
        }
        this.dtChildCount[parentId]++;

        const newId = `${parentId}.${this.dtChildCount[parentId]}`;
        const today = new Date().toISOString().split("T")[0];
        const newNode = {
          id: newId,
          content: this.dtGetDefaultNodeContent(this.dtSelectedNode.level),
          description: "",
          descriptionMastery: { level: 1, lastTestDate: today },
          level: this.dtSelectedNode.level,
          parentId: parentId,
          x: 0,
          y: 0,
          isFavorite: false,
          tags: [],
          masteryLevel: { level: 1, lastTestDate: today },
        };

        this.dtNodes.push(newNode);
        this.dtChildCount[newId] = 0;
        this.dtAutoResizeNode(newNode);

        // 将新节点移动到当前节点后面
        const siblings = this.dtNodes.filter((n) => n.parentId === parentId);
        siblings.sort((a, b) =>
          a.id.localeCompare(b.id, undefined, { numeric: true })
        );

        const currentIndex = siblings.findIndex(
          (n) => n.id === this.dtSelectedNode.id
        );
        const newNodeIndex = siblings.findIndex((n) => n.id === newId);

        // 如果新节点不在当前节点后面一位，则向前交换到正确位置
        if (newNodeIndex > currentIndex + 1) {
          for (let i = newNodeIndex; i > currentIndex + 1; i--) {
            const nodeA = siblings[i];
            const nodeB = siblings[i - 1];

            const idA = nodeA.id;
            const idB = nodeB.id;
            const childrenA = this.dtNodes.filter((n) => n.parentId === idA);
            const childrenB = this.dtNodes.filter((n) => n.parentId === idB);

            this.$set(nodeA, "id", idB);
            this.$set(nodeB, "id", idA);

            childrenA.forEach((child) => {
              this.$set(child, "parentId", idB);
            });
            childrenB.forEach((child) => {
              this.$set(child, "parentId", idA);
            });

            // 同步交换数组位置，以便下一轮循环正确
            siblings[i] = nodeB;
            siblings[i - 1] = nodeA;
          }
        }
      }

      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtDeleteNode() {
      if (!this.dtSelectedNode) return;
      // 如果选中的是概要节点，删除概要
      if (
        this.dtSelectedNode.id &&
        this.dtSelectedNode.id.startsWith("summary_")
      ) {
        if (!confirm("确定要删除该概要吗？")) return;
        this.dtSaveSnapshot();
        this.dtSummaries = this.dtSummaries.filter(
          (s) => s.id !== this.dtSelectedNode.id
        );
        this.dtSelectedNode = null;
        this.dtUpdateSummaryPositions();
        this.dtUpdateSummaryLines();
        this.dtSaveCurrentMindMap();
        return;
      }
      if (this.dtSelectedNode.level === 1 && this.dtRootNodesCount <= 1) {
        alert("唯一的根节点不能删除");
        return;
      }

      if (!confirm("点击确认将删除当前所选节点及其所有子节点")) {
        return;
      }

      this.dtSaveSnapshot();

      const nodesToDelete = [];
      const collectNodesToDelete = (nodeId) => {
        nodesToDelete.push(nodeId);
        const children = this.dtNodes.filter((n) => n.parentId === nodeId);
        children.forEach((child) => collectNodesToDelete(child.id));
      };
      collectNodesToDelete(this.dtSelectedNode.id);

      this.dtNodes = this.dtNodes.filter((n) => !nodesToDelete.includes(n.id));
      this.dtCollapsedNodes = this.dtCollapsedNodes.filter(
        (id) => !nodesToDelete.includes(id)
      );
      this.dtSelectedNode = null;
      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtToggleFavorite() {
      if (!this.dtSelectedNode) return;

      this.dtSaveSnapshot();

      this.$set(
        this.dtSelectedNode,
        "isFavorite",
        !this.dtSelectedNode.isFavorite
      );
      this.dtSaveCurrentMindMap();
    },
    dtQuizToggleFavorite() {
      if (!this.dtQuizCurrentNode) return;
      const node = this.dtQuizCurrentNode.node;
      if (!node) return;

      this.dtSaveSnapshot();

      this.$set(node, "isFavorite", !node.isFavorite);
      this.dtSaveCurrentMindMap();
    },
    dtCloneNode() {
      if (!this.dtSelectedNode) return;
      if (this.dtSelectedNode.level === 1) {
        alert("中心节点不能克隆");
        return;
      }

      if (
        !confirm(
          "克隆后，将在父级节点下出现与当前节点及其子节点完全一样的节点。如果需要，可以再把新节点移动到需要的位置。"
        )
      ) {
        return;
      }

      this.dtSaveSnapshot();

      const parentId = this.dtSelectedNode.parentId;

      const collectNodes = (nodeId) => {
        const node = this.dtNodes.find((n) => n.id === nodeId);
        if (!node) return [];

        const nodes = [node];
        const children = this.dtNodes.filter((n) => n.parentId === nodeId);
        children.forEach((child) => {
          nodes.push(...collectNodes(child.id));
        });
        return nodes;
      };

      const nodesToClone = collectNodes(this.dtSelectedNode.id);

      const idMap = {};
      const newNodes = [];
      const today = new Date().toISOString().split("T")[0];

      nodesToClone.forEach((node) => {
        const newNode = JSON.parse(JSON.stringify(node));
        newNode.x = 0;
        newNode.y = 0;
        if (newNode.masteryLevel) {
          newNode.masteryLevel.lastTestDate = today;
        }
        if (newNode.descriptionMastery) {
          newNode.descriptionMastery.lastTestDate = today;
        }
        newNodes.push(newNode);
      });

      if (!this.dtChildCount[parentId]) {
        this.dtChildCount[parentId] = 0;
      }
      this.dtChildCount[parentId]++;

      const newRootId = `${parentId}.${this.dtChildCount[parentId]}`;
      const oldRootId = this.dtSelectedNode.id;

      newNodes.forEach((node) => {
        if (node.id === oldRootId) {
          idMap[node.id] = newRootId;
          node.id = newRootId;
          node.parentId = parentId;
        } else {
          const newParentId = idMap[node.parentId] || node.parentId;
          idMap[node.id] = `${newParentId}.${
            (this.dtChildCount[newParentId] || 0) + 1
          }`;
          this.dtChildCount[newParentId] =
            (this.dtChildCount[newParentId] || 0) + 1;
          node.id = idMap[node.id];
          node.parentId = newParentId;
        }

        this.dtChildCount[node.id] = 0;
      });

      this.dtNodes.push(...newNodes);

      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtToggleSummary() {
      if (!this.dtSelectedNode) return;
      // 如果选中的是概要节点，编辑概要
      if (
        this.dtSelectedNode.id &&
        this.dtSelectedNode.id.startsWith("summary_")
      ) {
        const summary = this.dtSummaries.find(
          (s) => s.id === this.dtSelectedNode.id
        );
        if (summary) {
          this.dtStartEditSummary(summary);
        }
      } else if (this.dtSelectedNode.level > 1) {
        // 如果选中的是普通节点（且不是根节点），添加概要
        this.dtStartAddSummary();
      }
    },

    dtDeleteSummary() {
      if (
        !this.dtSelectedNode ||
        !this.dtSelectedNode.id ||
        !this.dtSelectedNode.id.startsWith("summary_")
      )
        return;
      if (!confirm("确定要删除这个概要吗？")) return;
      this.dtSaveSnapshot();
      const idx = this.dtSummaries.findIndex(
        (s) => s.id === this.dtSelectedNode.id
      );
      if (idx > -1) {
        this.dtSummaries.splice(idx, 1);
      }
      this.dtSelectedNode = null;
      this.dtUpdateSummaryPositions();
      this.dtUpdateSummaryLines();
      this.dtSaveCurrentMindMap();
    },

    dtStartAddSummary() {
      if (!this.dtSelectedNode || this.dtSelectedNode.level === 1) return;
      this.dtSummaryStartNode = this.dtSelectedNode;
      this.dtSummaryStartNodeId = this.dtSelectedNode.id;
      this.dtSummaryEndNodeId = "";
      this.dtSummaryContent = "";
      this.dtIsSummaryEditorOpen = true;
    },
    dtCloseSummaryEditor() {
      this.dtIsSummaryEditorOpen = false;
      this.dtSummaryStartNode = null;
      this.dtSummaryStartNodeId = "";
      this.dtSummaryEndNodeId = "";
      this.dtSummaryContent = "";
    },
    dtSaveSummary() {
      if (!this.dtSummaryStartNodeId) return;
      const content = this.dtSummaryContent.trim();
      if (!content) {
        alert("请输入概要内容");
        return;
      }
      this.dtSaveSnapshot();

      const startNode = this.dtNodes.find(
        (n) => n.id === this.dtSummaryStartNodeId
      );
      const parentId = startNode ? startNode.parentId : null;

      // 如果是编辑模式，更新现有概要
      if (this.dtSummaryEditingId) {
        const existing = this.dtSummaries.find(
          (s) => s.id === this.dtSummaryEditingId
        );
        if (existing) {
          existing.content = content;
          existing.startNodeId = this.dtSummaryStartNodeId;
          existing.endNodeId = this.dtSummaryEndNodeId || null;
          existing.parentId = parentId;
        }
        this.dtSummaryEditingId = null;
      } else {
        const summaryId = `summary_${Date.now()}`;
        const today = new Date().toISOString().split("T")[0];
        const summary = {
          id: summaryId,
          content: content,
          startNodeId: this.dtSummaryStartNodeId,
          endNodeId: this.dtSummaryEndNodeId || null,
          parentId: parentId,
          x: 0,
          y: 0,
          width: 120,
          height: 30,
          masteryLevel: { level: 1, lastTestDate: today },
        };
        this.dtSummaries.push(summary);
      }
      this.dtUpdateSummaryPositions();
      this.dtUpdateSummaryLines();
      if (
        this.dtIsQuizMode &&
        this.dtQuizCurrentNode &&
        this.dtQuizCurrentNode.quizType === "summary" &&
        this.dtSummaryEditingId &&
        this.dtQuizCurrentNode.node.id === this.dtSummaryEditingId
      ) {
        const updatedSummary = this.dtSummaries.find(
          (s) => s.id === this.dtSummaryEditingId
        );
        if (updatedSummary) {
          this.$set(
            this.dtQuizNodes[this.dtQuizCurrentIndex],
            "content",
            updatedSummary.content
          );
          this.$set(
            this.dtQuizNodes[this.dtQuizCurrentIndex],
            "node",
            updatedSummary
          );
          this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
          if (this.dtQuizCurrentNode.displayType === "choice") {
            const newOptions = this.dtGetChoiceOptions(
              this.dtQuizNodes[this.dtQuizCurrentIndex]
            );
            this.$set(
              this.dtQuizNodes[this.dtQuizCurrentIndex],
              "options",
              newOptions
            );
            if (this.dtQuizUserAnswers[this.dtQuizCurrentNode.quizId]) {
              this.$delete(
                this.dtQuizUserAnswers,
                this.dtQuizCurrentNode.quizId
              );
            }
          }
        }
      }
      this.dtSaveCurrentMindMap();
      this.dtCloseSummaryEditor();
    },
    dtStartEditSummary(summary) {
      const startNode = this.dtNodes.find((n) => n.id === summary.startNodeId);
      if (!startNode) return;
      this.dtSelectedNode = summary;
      this.dtSummaryStartNode = startNode;
      this.dtSummaryStartNodeId = summary.startNodeId;
      this.dtSummaryEndNodeId = summary.endNodeId || "";
      this.dtSummaryContent = summary.content.replace(/<[^>]*>/g, "");
      this.dtIsSummaryEditorOpen = true;
      // 删除旧的概要，保存时会重新创建
      const idx = this.dtSummaries.findIndex((s) => s.id === summary.id);
      if (idx > -1) {
        this.dtSummaryEditingId = summary.id;
      }
    },
    dtUpdateSummaryPositions() {
      const defaultNodeWidth = 120;
      const defaultNodeHeight = 40;

      this.dtSummaries.forEach((summary) => {
        const startNode = this.dtNodes.find(
          (n) => n.id === summary.startNodeId
        );
        if (!startNode) return;

        const endNode = summary.endNodeId
          ? this.dtNodes.find((n) => n.id === summary.endNodeId)
          : startNode;
        if (!endNode) return;

        // 收集范围内所有节点（包括它们的子树）
        const rangeNodes = this.dtGetRangeNodes(
          startNode.id,
          summary.endNodeId
        );

        // 计算所有范围节点及其子节点的边界框
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        rangeNodes.forEach((nodeId) => {
          const node = this.dtNodes.find((n) => n.id === nodeId);
          if (!node) return;
          const w = node.width || defaultNodeWidth;
          const h = node.height || defaultNodeHeight;
          minX = Math.min(minX, node.x);
          minY = Math.min(minY, node.y);
          maxX = Math.max(maxX, node.x + w);
          maxY = Math.max(maxY, node.y + h);
        });

        if (minX === Infinity) return;

        // 保存边界框用于虚框绘制
        summary._bounds = { minX, minY, maxX, maxY };

        // 概要节点位置：水平方向在右外侧，垂直方向在下外侧
        const expandDirection = this.dtSettings.expandDirection || "horizontal";
        // 判断起始节点所属侧（双侧布局用）
        const startNodeSide = startNode._side || "right";
        if (expandDirection === "vertical") {
          summary.x = (minX + maxX) / 2 - (summary.width || 80) / 2;
          summary.y = maxY + 20;
        } else if (expandDirection === "both" && startNodeSide === "left") {
          // 双侧布局左侧：概要节点放在左外侧居中
          summary.x = minX - 20 - (summary.width || 80);
          summary.y = (minY + maxY) / 2 - (summary.height || 30) / 2;
        } else {
          // 水平/双侧右侧：概要节点放在右外侧居中
          summary.x = maxX + 20;
          summary.y = (minY + maxY) / 2 - (summary.height || 30) / 2;
        }

        // 仅在未手动调整过时自动计算宽度
        if (summary._autoSize !== false) {
          const textLength = summary.content.replace(/<[^>]*>/g, "").length;
          const emSize = this.dtSettings.defaultFontSize || 14;
          summary.width = Math.max(80, textLength * emSize + 24);
          summary.height = 30;
        }
      });
    },
    dtGetRangeNodes(startNodeId, endNodeId) {
      // 获取从 startNode 到 endNode 之间的所有同级节点，以及它们的所有后代
      const startNode = this.dtNodes.find((n) => n.id === startNodeId);
      if (!startNode) return [];

      const parentId = startNode.parentId;
      const expandDirection = this.dtSettings.expandDirection || "horizontal";
      const siblings = this.dtNodes
        .filter((n) => n.parentId === parentId)
        .sort((a, b) =>
          expandDirection === "vertical" ? a.x - b.x : a.y - b.y
        );

      const startIdx = siblings.findIndex((n) => n.id === startNodeId);
      const endIdx = endNodeId
        ? siblings.findIndex((n) => n.id === endNodeId)
        : startIdx;

      if (startIdx < 0) return [];
      const effectiveEnd = endIdx >= startIdx ? endIdx : startIdx;

      const rangeSiblings = siblings.slice(startIdx, effectiveEnd + 1);

      // 收集每个兄弟节点及其所有可见后代
      const allNodes = new Set();
      const collectDescendants = (nodeId) => {
        allNodes.add(nodeId);
        this.dtNodes
          .filter((n) => n.parentId === nodeId && !this.dtIsNodeHidden(n))
          .forEach((child) => collectDescendants(child.id));
      };
      rangeSiblings.forEach((s) => collectDescendants(s.id));

      return Array.from(allNodes);
    },
    dtUpdateSummaryLines() {
      this.dtSummaryLines = [];
      const bracketGap = 6;

      this.dtSummaries.forEach((summary) => {
        if (!summary._bounds) return;
        // 跳过应该隐藏的概要（起始/结束节点被隐藏）
        const startNode = this.dtNodes.find(
          (n) => n.id === summary.startNodeId
        );
        if (!startNode || this.dtIsNodeHidden(startNode)) return;
        const endNodeId = summary.endNodeId || summary.startNodeId;
        const endNode = this.dtNodes.find((n) => n.id === endNodeId);
        if (!endNode || this.dtIsNodeHidden(endNode)) return;
        const { minX, minY, maxX, maxY } = summary._bounds;
        const padding = 4; // 虚框内边距

        // 绘制虚框（覆盖范围内所有节点及子节点）
        this.dtSummaryLines.push({
          id: `summary-${summary.id}-rect`,
          type: "rect",
          x: minX - padding,
          y: minY - padding,
          w: maxX - minX + padding * 2,
          h: maxY - minY + padding * 2,
          color: "#e6a23c",
        });

        // 连线方向：水平从虚框右侧出，垂直从虚框下侧出，双侧左侧从虚框左边出
        const expandDirection = this.dtSettings.expandDirection || "horizontal";
        // 判断概要起始节点的侧（双侧布局用）
        const summaryStartNode = this.dtNodes.find(
          (n) => n.id === summary.startNodeId
        );
        const summarySide = summaryStartNode
          ? summaryStartNode._side || "right"
          : "right";
        let d;
        if (expandDirection === "vertical") {
          // 从虚框下边中心连接到概要节点上边中心
          const rectBottomY = maxY + padding;
          const rectCenterX = (minX + maxX) / 2;
          const summaryTopY = summary.y;
          const summaryCenterX = summary.x + (summary.width || 80) / 2;

          const midY = rectBottomY + bracketGap;
          d =
            `M ${rectCenterX} ${rectBottomY} ` +
            `L ${rectCenterX} ${midY} ` +
            `L ${summaryCenterX} ${midY} ` +
            `L ${summaryCenterX} ${summaryTopY}`;
        } else if (expandDirection === "both" && summarySide === "left") {
          // 双侧布局左侧：从虚框左边中心连接到概要节点右边中心
          const rectLeftX = minX - padding;
          const rectCenterY = (minY + maxY) / 2;
          const summaryRightX = summary.x + (summary.width || 80);
          const summaryCenterY = summary.y + (summary.height || 30) / 2;

          const midX = rectLeftX - bracketGap;
          d =
            `M ${rectLeftX} ${rectCenterY} ` +
            `L ${midX} ${rectCenterY} ` +
            `L ${midX} ${summaryCenterY} ` +
            `L ${summaryRightX} ${summaryCenterY}`;
        } else {
          // 从虚框右边中心连接到概要节点左边中心
          const rectRightX = maxX + padding;
          const rectCenterY = (minY + maxY) / 2;
          const summaryLeftX = summary.x;
          const summaryCenterY = summary.y + (summary.height || 30) / 2;

          // 括号路径：从虚框右侧中间 → 向右到拐点 → 到概要节点
          const midX = rectRightX + bracketGap;
          d =
            `M ${rectRightX} ${rectCenterY} ` +
            `L ${midX} ${rectCenterY} ` +
            `L ${midX} ${summaryCenterY} ` +
            `L ${summaryLeftX} ${summaryCenterY}`;
        }

        this.dtSummaryLines.push({
          id: `summary-${summary.id}-line`,
          d: d,
          color: "#e6a23c",
        });
      });
    },
    defaultAction1(node, e) {
      if (this.dtSelectedNode && this.dtSelectedNode.id === node.id) {
        const target = e.currentTarget;
        const isAtTop = target.scrollTop === 0;
        const isAtBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight;
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        if ((isAtTop && scrollingUp) || (isAtBottom && scrollingDown)) {
          e.preventDefault();
        }
        e.stopPropagation();
      }
    },
    defaultAction(node, e) {
      if (this.dtSelectedNode && this.dtSelectedNode.id === node.id) {
        e.stopPropagation();
      }
    },
    dtUpdateChildrenParentId(oldParentId, newParentId) {
      this.dtNodes.forEach((node) => {
        if (node.parentId === oldParentId) {
          this.$set(node, "parentId", newParentId);
        }
      });
    },
    dtSelectNode(node, e, x) {
      // 清除标签/收藏高亮
      this.dtSelectedTag = "";
      this.dtClearTagHighlight();
      if (x == 1) {
        if (this.dtSelectedNode == node) {
          this.handleCardImageClick(e);
        } else {
          this.dtSelectedNode = node;
          // 消耗图片点击计数，但不打开浏览框
          if (e) this.handleCardImageClick(e, false);
        }
      } else {
        this.dtSelectedNode = node;
        if (e) this.handleCardImageClick(e);
      }
    },
    dtIsNodeHidden(node) {
      if (node.level === 1) return false;

      if (this.dtCollapsedNodes.includes(node.id)) return true;

      const checkAncestors = (parentId) => {
        if (!parentId) return false;
        if (this.dtCollapsedNodes.includes(parentId)) return true;
        const parent = this.dtNodes.find((n) => n.id === parentId);
        if (!parent) return false;
        return checkAncestors(parent.parentId);
      };

      return checkAncestors(node.parentId);
    },
    dtHasChildren(node) {
      return this.dtNodes.some((n) => n.parentId === node.id);
    },
    dtHasCollapsedChildren(node) {
      return this.dtNodes.some(
        (n) => n.parentId === node.id && this.dtCollapsedNodes.includes(n.id)
      );
    },
    dtGetChildCount(node) {
      return this.dtNodes.filter((n) => n.parentId === node.id).length;
    },
    dtHandleChildCountIconClick(node) {
      if (this.dtHasCollapsedChildren(node)) {
        this.dtSelectedNode = node;
        this.dtExpandAllChildren();
      } else {
        this.dtSelectedNode = node;
        this.dtCollapseAllChildren();
      }
    },
    dtExpandAllChildren() {
      if (!this.dtSelectedNode) return;

      this.dtSaveSnapshot();

      // 记录当前节点的屏幕坐标，展开后保持该位置不变
      const anchorNode = this.dtSelectedNode;
      anchorNode._anchorScreenX = anchorNode.x * this.dtScale + this.dtOffsetX;
      anchorNode._anchorScreenY = anchorNode.y * this.dtScale + this.dtOffsetY;

      const children = this.dtNodes.filter(
        (n) => n.parentId === this.dtSelectedNode.id
      );
      children.forEach((child) => {
        this.dtCollapsedNodes = this.dtCollapsedNodes.filter(
          (id) => id !== child.id
        );
      });
      this.dtUpdatePositions(anchorNode.id);
      this.dtSaveCurrentMindMap();
    },
    dtCollapseAllChildren() {
      if (!this.dtSelectedNode) return;

      this.dtSaveSnapshot();

      // 记录当前节点的屏幕坐标，收起后保持该位置不变
      const anchorNode = this.dtSelectedNode;
      anchorNode._anchorScreenX = anchorNode.x * this.dtScale + this.dtOffsetX;
      anchorNode._anchorScreenY = anchorNode.y * this.dtScale + this.dtOffsetY;

      const collapseNode = (nodeId) => {
        if (!this.dtCollapsedNodes.includes(nodeId)) {
          this.dtCollapsedNodes.push(nodeId);
        }
        const children = this.dtNodes.filter((n) => n.parentId === nodeId);
        children.forEach((child) => collapseNode(child.id));
      };
      const children = this.dtNodes.filter(
        (n) => n.parentId === this.dtSelectedNode.id
      );
      children.forEach((child) => collapseNode(child.id));
      this.dtUpdatePositions(anchorNode.id);
      this.dtSaveCurrentMindMap();
    },
    dtExpandAll() {
      this.dtSaveSnapshot();

      this.dtCollapsedNodes = [];
      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtCollapseAll() {
      this.dtSaveSnapshot();

      const collapseNode = (nodeId) => {
        if (!this.dtCollapsedNodes.includes(nodeId)) {
          this.dtCollapsedNodes.push(nodeId);
        }
        const children = this.dtNodes.filter((n) => n.parentId === nodeId);
        children.forEach((child) => collapseNode(child.id));
      };

      this.dtNodes.forEach((node) => {
        if (node.level > 1) {
          collapseNode(node.id);
        }
      });

      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtAddNote() {
      const today = new Date().toISOString().split("T")[0];
      this.dtNoteNode = {
        id: "__note__",
        content: "双击可编辑笔记内容",
        width: 200,
        height: 300,
        masteryLevel: { level: 1, lastTestDate: today },
      };
      this.dtNoteCollapsed = false;
    },
    dtDeleteNote() {
      if (!confirm("确定要删除笔记吗？此操作不可恢复！")) return;
      this.dtNoteNode = null;
      this.dtNoteCollapsed = false;
    },
    dtToggleNoteCollapse() {
      this.dtNoteCollapsed = !this.dtNoteCollapsed;
    },
    dtStartEditNote() {
      if (!this.dtNoteNode) return;
      this.dtEditingNode = this.dtNoteNode;
      this.dtEditingContent = this.dtNoteNode.content;
      this.openQuestionEditor(this.dtEditingContent, 33);
    },
    dtStartNoteResize(e) {
      if (e.type === "touchstart") {
        e.preventDefault();
      }

      this.dtIsResizing = true;
      this.dtResizeNode = this.dtNoteNode;

      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      this.dtResizeStartX = clientX;
      this.dtResizeStartY = clientY;
      this.dtResizeStartWidth = this.dtNoteNode.width || 200;
      this.dtResizeStartHeight = this.dtNoteNode.height || 300;

      document.addEventListener("mousemove", this.dtOnNoteResize);
      document.addEventListener("mouseup", this.dtEndNoteResize);
      document.addEventListener("touchmove", this.dtOnNoteResize);
      document.addEventListener("touchend", this.dtEndNoteResize);
    },
    dtOnNoteResize(e) {
      if (!this.dtIsResizing || !this.dtNoteNode) return;

      if (e.type === "touchmove") {
        e.preventDefault();
      }

      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.dtResizeStartX;
      const deltaY = clientY - this.dtResizeStartY;

      // 宽度变化（左侧不动），高度变化（垂直居中由CSS translateY(-50%)保证）
      const newWidth = Math.max(120, this.dtResizeStartWidth + deltaX);
      const newHeight = Math.max(80, this.dtResizeStartHeight + deltaY);

      this.dtNoteNode.width = newWidth;
      this.dtNoteNode.height = newHeight;
    },
    dtEndNoteResize() {
      this.dtIsResizing = false;
      this.dtResizeNode = null;

      document.removeEventListener("mousemove", this.dtOnNoteResize);
      document.removeEventListener("mouseup", this.dtEndNoteResize);
      document.removeEventListener("touchmove", this.dtOnNoteResize);
      document.removeEventListener("touchend", this.dtEndNoteResize);
    },
    dtStartSummaryResize(e, summary) {
      if (e.type === "touchstart") {
        e.preventDefault();
      }

      this.dtIsResizing = true;
      this.dtResizeNode = summary;

      const clientX =
        e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      const clientY =
        e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      this.dtResizeStartX = clientX;
      this.dtResizeStartY = clientY;
      this.dtResizeStartWidth = summary.width || 120;
      this.dtResizeStartHeight = summary.height || 30;

      document.addEventListener("mousemove", this.dtOnSummaryResize);
      document.addEventListener("mouseup", this.dtEndSummaryResize);
      document.addEventListener("touchmove", this.dtOnSummaryResize);
      document.addEventListener("touchend", this.dtEndSummaryResize);
    },
    dtOnSummaryResize(e) {
      if (!this.dtIsResizing || !this.dtResizeNode) return;

      if (e.type === "touchmove") {
        e.preventDefault();
      }

      const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.dtResizeStartX;
      const deltaY = clientY - this.dtResizeStartY;

      const newWidth = Math.max(80, this.dtResizeStartWidth + deltaX);
      const newHeight = Math.max(30, this.dtResizeStartHeight + deltaY);

      this.dtResizeNode.width = newWidth;
      this.dtResizeNode.height = newHeight;
      this.dtResizeNode._autoSize = false;

      this.dtUpdateSummaryLines();
    },
    dtEndSummaryResize() {
      this.dtIsResizing = false;
      this.dtResizeNode = null;

      document.removeEventListener("mousemove", this.dtOnSummaryResize);
      document.removeEventListener("mouseup", this.dtEndSummaryResize);
      document.removeEventListener("touchmove", this.dtOnSummaryResize);
      document.removeEventListener("touchend", this.dtEndSummaryResize);

      this.dtUpdatePositions();
      this.dtSaveCurrentMindMap();
    },
    dtSaveSnapshot() {
      this.dtUndoStack.push({
        nodes: JSON.parse(JSON.stringify(this.dtNodes)),
        collapsedNodes: [...this.dtCollapsedNodes],
        childCount: JSON.parse(JSON.stringify(this.dtChildCount)),
        summaries: JSON.parse(JSON.stringify(this.dtSummaries)),
      });
      this.dtRedoStack = [];
      if (this.dtUndoStack.length > 50) {
        this.dtUndoStack.shift();
      }
    },
    dtUndo() {
      if (this.dtUndoStack.length === 0) return;

      this.dtRedoStack.push({
        nodes: JSON.parse(JSON.stringify(this.dtNodes)),
        collapsedNodes: [...this.dtCollapsedNodes],
        childCount: JSON.parse(JSON.stringify(this.dtChildCount)),
        summaries: JSON.parse(JSON.stringify(this.dtSummaries)),
      });

      const snapshot = this.dtUndoStack.pop();
      this.dtNodes = snapshot.nodes;
      this.dtCollapsedNodes = snapshot.collapsedNodes;
      this.dtChildCount = snapshot.childCount;
      this.dtSummaries = snapshot.summaries || [];

      this.dtUpdatePositions();
    },
    dtRedo() {
      if (this.dtRedoStack.length === 0) return;

      this.dtUndoStack.push({
        nodes: JSON.parse(JSON.stringify(this.dtNodes)),
        collapsedNodes: [...this.dtCollapsedNodes],
        childCount: JSON.parse(JSON.stringify(this.dtChildCount)),
        summaries: JSON.parse(JSON.stringify(this.dtSummaries)),
      });

      const snapshot = this.dtRedoStack.pop();
      this.dtNodes = snapshot.nodes;
      this.dtCollapsedNodes = snapshot.collapsedNodes;
      this.dtChildCount = snapshot.childCount;
      this.dtSummaries = snapshot.summaries || [];

      this.dtUpdatePositions();
    },
    dtZoomIn(step = 0.01) {
      if (this.dtScale < this.dtMaxScale) {
        const newScale = Math.min(this.dtScale + step, this.dtMaxScale);

        // 获取缩放锚点：优先使用选中节点，否则使用中心节点
        let anchorNode = this.dtSelectedNode;
        if (!anchorNode) {
          anchorNode = this.dtNodes.find((n) => n.level === 1);
        }

        if (anchorNode) {
          const nodeWidth = anchorNode.width || 120;
          const nodeHeight = anchorNode.height || 40;
          // 节点中心点在画布上的坐标
          const nodeCenterX = anchorNode.x + nodeWidth / 2;
          const nodeCenterY = anchorNode.y + nodeHeight / 2;

          // 节点中心点在屏幕上的坐标
          const screenAnchorX = nodeCenterX * this.dtScale + this.dtOffsetX;
          const screenAnchorY = nodeCenterY * this.dtScale + this.dtOffsetY;

          // 以节点中心为基准点调整偏移
          this.dtOffsetX = screenAnchorX - nodeCenterX * newScale;
          this.dtOffsetY = screenAnchorY - nodeCenterY * newScale;
        }

        this.dtScale = newScale;
      }
    },
    dtZoomOut(step = 0.01) {
      if (this.dtScale > this.dtMinScale) {
        const newScale = Math.max(this.dtScale - step, this.dtMinScale);

        // 获取缩放锚点：优先使用选中节点，否则使用中心节点
        let anchorNode = this.dtSelectedNode;
        if (!anchorNode) {
          anchorNode = this.dtNodes.find((n) => n.level === 1);
        }

        if (anchorNode) {
          const nodeWidth = anchorNode.width || 120;
          const nodeHeight = anchorNode.height || 40;
          // 节点中心点在画布上的坐标
          const nodeCenterX = anchorNode.x + nodeWidth / 2;
          const nodeCenterY = anchorNode.y + nodeHeight / 2;

          // 节点中心点在屏幕上的坐标
          const screenAnchorX = nodeCenterX * this.dtScale + this.dtOffsetX;
          const screenAnchorY = nodeCenterY * this.dtScale + this.dtOffsetY;

          // 以节点中心为基准点调整偏移
          this.dtOffsetX = screenAnchorX - nodeCenterX * newScale;
          this.dtOffsetY = screenAnchorY - nodeCenterY * newScale;
        }

        this.dtScale = newScale;
      }
    },
    dtOnWheel(e) {
      e.preventDefault();
      if (e.deltaY < 0) {
        this.dtZoomIn(0.08);
      } else {
        this.dtZoomOut(0.08);
      }
    },

    // 双指缩放处理方法
    dtHandleTouchStart(e) {
      // 只在思维导图编辑页面处理
      if (this.dtCurrentPage !== "mindmap") return;

      // 双指触摸时处理缩放
      if (e.touches.length === 2) {
        e.preventDefault();
        this.dtIsPinch = true;
        // 确保双指时不进入单指拖拽
        this.dtIsDragging = false;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // 记录双指中心点作为缩放锚点
        this.dtLastPinchCenter = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };

        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        this.dtTouchStartDistance = Math.sqrt(dx * dx + dy * dy);
        this.dtTouchStartScale = this.dtScale;
        return;
      }

      // 检查点击的目标元素，如果是节点则不处理拖拽
      if (
        e.target.classList.contains("dt-node-content") ||
        e.target.classList.contains("dt-node") ||
        e.target.classList.contains("dt-btn") ||
        e.target.classList.contains("dt-resize-handle") ||
        e.target.classList.contains("dt-name-input") ||
        e.target.classList.contains("dt-description-icon") ||
        e.target.classList.contains("dt-attachment-icon") ||
        e.target.classList.contains("dt-child-count-icon")
      ) {
        return;
      }

      // 单指触摸时启动拖拽
      this.dtIsDragging = true;
      this.dtDragStartX = e.touches[0].clientX - this.dtOffsetX;
      this.dtDragStartY = e.touches[0].clientY - this.dtOffsetY;
    },
    dtHandleTouchMove(e) {
      // 只在思维导图编辑页面处理
      if (this.dtCurrentPage !== "mindmap") return;

      // 双指触摸时处理缩放（优先级最高，即使手指在节点上也要能缩放）
      if (e.touches.length === 2) {
        e.preventDefault();

        // 双指时强制禁用单指拖拽
        this.dtIsDragging = false;

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (this.dtTouchStartDistance > 0 && this.dtLastPinchCenter) {
          const scaleChange = distance / this.dtTouchStartDistance;
          const newScale = Math.max(
            this.dtMinScale,
            Math.min(this.dtMaxScale, this.dtTouchStartScale * scaleChange)
          );

          // 使用双指中心点作为缩放锚点，保持缩放中心不变

          // 以初始双指中心为基准调整偏移，使该点在缩放前后位于屏幕同一位置
          this.dtOffsetX =
            this.dtLastPinchCenter.x -
            (this.dtLastPinchCenter.x - this.dtOffsetX) *
              (newScale / this.dtScale);
          this.dtOffsetY =
            this.dtLastPinchCenter.y -
            (this.dtLastPinchCenter.y - this.dtOffsetY) *
              (newScale / this.dtScale);

          this.dtScale = newScale;
        }
        return;
      }

      // 单指触摸时处理拖拽（只有明确在拖拽时才执行）
      if (e.touches.length === 1 && this.dtIsDragging && !this.dtIsPinch) {
        e.preventDefault();
        this.dtOffsetX = e.touches[0].clientX - this.dtDragStartX;
        this.dtOffsetY = e.touches[0].clientY - this.dtDragStartY;
      }
    },

    dtHandleTouchEnd(e) {
      // 只在思维导图编辑页面处理
      if (this.dtCurrentPage !== "mindmap") return;

      // 只有所有手指全部抬起才结束缩放/拖拽
      if (e.touches.length === 0) {
        this.dtIsPinch = false;
        this.dtIsDragging = false;
        this.dtTouchStartDistance = 0;
        this.dtLastPinchCenter = null;
      }
    },
    dtGetArrowPoints(x1, y1, x2, y2) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowLength = 12;

      const px1 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
      const py1 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);
      const px2 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
      const py2 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);

      return `${x2},${y2} ${px1},${py1} ${px2},${py2}`;
    },
    // 鼠标双击画布空白区域处理
    dtHandleCanvasDoubleClick(e) {
      const target = e.target;
      if (
        target.classList.contains("dt-mind-map-container") ||
        target.classList.contains("dt-canvas") ||
        target.tagName === "svg" ||
        target.tagName === "line" ||
        target.tagName === "path"
      ) {
        this.dtResetView();
      }
    },
    // 缩放所有展开的节点使其完整显示在屏幕中
    dtResetView() {
      if (this.dtNodes.length === 0) return;

      this.dtUpdateContainerSize();

      const visibleNodes = this.dtNodes.filter((node) => {
        let current = node;
        while (current) {
          if (this.dtCollapsedNodes.includes(current.id)) {
            return false;
          }
          current = this.dtNodes.find((n) => n.id === current.parentId);
        }
        return true;
      });

      if (visibleNodes.length === 0) return;

      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

      visibleNodes.forEach((node) => {
        const w = node.width || 120;
        const h = node.height || 40;
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x + w);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y + h);
      });

      const nodesWidth = maxX - minX;
      const nodesHeight = maxY - minY;

      const containerWidth = this.dtContainerWidth;
      const containerHeight = this.dtContainerHeight;

      const safeAreaInsetTop =
        parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue("--safe-area-inset-top")
        ) || 0;
      const safeAreaInsetBottom =
        parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue("--safe-area-inset-bottom")
        ) || 0;
      const adjustedContainerHeight =
        containerHeight - safeAreaInsetTop - safeAreaInsetBottom;
      // 计算缩放比例，四边留 8% 的空白
      const padding = 0.08;
      let scaleX = (containerWidth * (1 - 2 * padding)) / nodesWidth;
      let scaleY = (adjustedContainerHeight * (1 - 2 * padding)) / nodesHeight;

      if (isNaN(scaleX) || scaleX <= 0) scaleX = 1;
      if (isNaN(scaleY) || scaleY <= 0) scaleY = 1;

      const newScale = Math.min(scaleX, scaleY, 1);

      const nodesCenterX = (minX + maxX) / 2;
      const nodesCenterY = (minY + maxY) / 2;

      this.dtScale = newScale;
      this.dtOffsetX = containerWidth / 2 - nodesCenterX * newScale;
      const emSize = this.dtSettings.defaultFontSize || 14;
      this.dtOffsetY =
        adjustedContainerHeight / 2 -
        nodesCenterY * newScale +
        safeAreaInsetTop +
        2.6 * emSize;
      this.$nextTick(() => {
        this.dtUpdatePositions();
        setTimeout(() => {
          this.dtScrollContainerToCenter();
        }, 0);
      });
    },

    dtScrollContainerToCenter() {
      // 1. body垂直滚动条居中
      const scrollTop = (document.body.scrollHeight - window.innerHeight) / 2;
      document.body.scrollTop = scrollTop;
      window.scrollTo({ top: scrollTop, left: 0, behavior: "instant" });

      // 2. .dt-mind-map-container水平滚动条移到最左边
      const container = document.querySelector(".dt-mind-map-container");
      if (container) {
        container.scrollLeft = 0;
        if (typeof container.scrollTo === "function") {
          container.scrollTo({
            top: container.scrollTop,
            left: 0,
            behavior: "instant",
          });
        }
      }

      // 递归调用确保生效（针对iOS Safari的特殊处理）
      requestAnimationFrame(() => {
        // 确保body垂直滚动条居中
        if (Math.abs(document.body.scrollTop - scrollTop) > 1) {
          document.body.scrollTop = scrollTop;
          window.scrollTo(0, scrollTop);
        }
        // 确保.container水平滚动条在最左边
        if (container && container.scrollLeft !== 0) {
          container.scrollLeft = 0;
        }
      });
    },
    dtUpdatePositions(anchorNodeId) {
      if (this.dtUpdatePositionsPending) return;
      this.dtUpdatePositionsPending = true;

      requestAnimationFrame(() => {
        if (this.dtNodes.length === 0) {
          this.dtUpdatePositionsPending = false;
          return;
        }

        const centerX = this.dtContainerWidth / 2;
        const centerY = this.dtContainerHeight / 2;
        const defaultNodeWidth = 120;
        const defaultNodeHeight = 40;
        const levelGap = this.dtSettings.levelGap;
        const nodeGap = this.dtSettings.nodeGap;
        const expandDirection = this.dtSettings.expandDirection || "horizontal";

        const getNodeWidth = (node) => node.width || defaultNodeWidth;
        const getNodeHeight = (node) => node.height || defaultNodeHeight;

        const isNodeVisible = (nodeId) => {
          if (!nodeId) return true;
          return !this.dtCollapsedNodes.includes(nodeId);
        };

        const getGroupHeight = (nodeId) => {
          const node = this.dtNodes.find((n) => n.id === nodeId);
          const nodeHeight = node ? getNodeHeight(node) : defaultNodeHeight;

          if (!isNodeVisible(nodeId)) {
            return nodeHeight + nodeGap;
          }

          const children = this.dtNodes
            .filter((n) => n.parentId === nodeId && isNodeVisible(n.id))
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          if (children.length === 0) {
            return nodeHeight + nodeGap;
          }
          const childrenHeight = children.reduce((sum, child) => {
            return sum + getGroupHeight(child.id);
          }, 0);
          return Math.max(nodeHeight + nodeGap, childrenHeight);
        };

        const updateNodePositionHorizontal = (parentId) => {
          if (!isNodeVisible(parentId)) {
            return;
          }

          const parentNode = this.dtNodes.find((n) => n.id === parentId);
          const parentWidth = parentNode
            ? getNodeWidth(parentNode)
            : defaultNodeWidth;
          const parentHeight = parentNode
            ? getNodeHeight(parentNode)
            : defaultNodeHeight;
          const parentX = parentNode ? parentNode.x : centerX - parentWidth / 2;
          const parentCenterY = parentNode
            ? parentNode.y + parentHeight / 2
            : centerY;

          const children = this.dtNodes
            .filter((n) => n.parentId === parentId && isNodeVisible(n.id))
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          if (children.length === 0) return;

          const totalGroupHeight = children.reduce((sum, child) => {
            return sum + getGroupHeight(child.id);
          }, 0);

          let currentY = parentCenterY - totalGroupHeight / 2;

          children.forEach((child) => {
            const childHeight = getNodeHeight(child);
            const groupHeight = getGroupHeight(child.id);

            child.x = parentX + parentWidth + levelGap;
            child.y = currentY + (groupHeight - childHeight) / 2;

            updateNodePositionHorizontal(child.id);

            currentY += groupHeight;
          });
        };

        const getGroupWidth = (nodeId) => {
          const node = this.dtNodes.find((n) => n.id === nodeId);
          const nodeWidth = node ? getNodeWidth(node) : defaultNodeWidth;

          if (!isNodeVisible(nodeId)) {
            return nodeWidth + nodeGap;
          }

          const children = this.dtNodes
            .filter((n) => n.parentId === nodeId && isNodeVisible(n.id))
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          if (children.length === 0) {
            return nodeWidth + nodeGap;
          }

          const childrenWidth = children.reduce((sum, child) => {
            return sum + getGroupWidth(child.id);
          }, 0);

          return Math.max(nodeWidth + nodeGap, childrenWidth);
        };

        const updateNodePositionVertical = (parentId) => {
          if (!isNodeVisible(parentId)) {
            return;
          }

          const parentNode = this.dtNodes.find((n) => n.id === parentId);
          const parentWidth = parentNode
            ? getNodeWidth(parentNode)
            : defaultNodeWidth;
          const parentHeight = parentNode
            ? getNodeHeight(parentNode)
            : defaultNodeHeight;
          const parentCenterX = parentNode
            ? parentNode.x + parentWidth / 2
            : centerX;
          const parentY = parentNode
            ? parentNode.y
            : centerY - parentHeight / 2;

          const children = this.dtNodes
            .filter((n) => n.parentId === parentId && isNodeVisible(n.id))
            .sort((a, b) =>
              a.id.localeCompare(b.id, undefined, { numeric: true })
            );
          if (children.length === 0) return;

          const totalGroupWidth = children.reduce((sum, child) => {
            return sum + getGroupWidth(child.id);
          }, 0);

          let currentX = parentCenterX - totalGroupWidth / 2;

          children.forEach((child) => {
            const childWidth = getNodeWidth(child);
            const childHeight = getNodeHeight(child);
            const groupWidth = getGroupWidth(child.id);

            child.x = currentX + (groupWidth - childWidth) / 2;
            child.y = parentY + parentHeight + levelGap;
            child.width = childWidth;
            child.height = childHeight;

            updateNodePositionVertical(child.id);

            currentX += groupWidth;
          });
        };

        const rootNodes = this.dtNodes.filter((n) => n.level === 1);
        if (rootNodes.length > 0) {
          rootNodes.sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          );

          if (expandDirection === "horizontal") {
            // 多个根节点垂直排列在画布中央，间距基于子树总高度
            const totalRootHeight = rootNodes.reduce((sum, node) => {
              return sum + getGroupHeight(node.id);
            }, 0);
            let currentY = centerY - totalRootHeight / 2;

            const idealPositions = {};
            rootNodes.forEach((rootNode) => {
              const rWidth = getNodeWidth(rootNode);
              const rHeight = getNodeHeight(rootNode);
              const groupHeight = getGroupHeight(rootNode.id);
              idealPositions[rootNode.id] = {
                x: centerX - rWidth / 2,
                y: currentY + (groupHeight - rHeight) / 2,
              };
              currentY += groupHeight;
            });

            // 计算手动定位根节点带来的偏移（以第一个根节点为锚点）
            let offsetX = 0;
            let offsetY = 0;
            const anchor = rootNodes[0];
            if (
              anchor._manualX !== undefined &&
              anchor._manualY !== undefined
            ) {
              offsetX = anchor._manualX - idealPositions[anchor.id].x;
              offsetY = anchor._manualY - idealPositions[anchor.id].y;
            }

            rootNodes.forEach((rootNode) => {
              if (
                rootNode._manualX !== undefined &&
                rootNode._manualY !== undefined
              ) {
                rootNode.x = rootNode._manualX;
                rootNode.y = rootNode._manualY;
              } else {
                rootNode.x = idealPositions[rootNode.id].x + offsetX;
                rootNode.y = idealPositions[rootNode.id].y + offsetY;
              }

              updateNodePositionHorizontal(rootNode.id);
            });
          } else if (expandDirection === "vertical") {
            // 多个根节点水平排列在画布中央，间距基于子树总宽度
            const totalRootWidth = rootNodes.reduce((sum, node) => {
              return sum + getGroupWidth(node.id);
            }, 0);
            let currentX = centerX - totalRootWidth / 2;

            const idealPositions = {};
            rootNodes.forEach((rootNode) => {
              const rWidth = getNodeWidth(rootNode);
              const rHeight = getNodeHeight(rootNode);
              const groupWidth = getGroupWidth(rootNode.id);
              idealPositions[rootNode.id] = {
                x: currentX + (groupWidth - rWidth) / 2,
                y: centerY - rHeight / 2,
              };
              currentX += groupWidth;
            });

            // 计算手动定位根节点带来的偏移（以第一个根节点为锚点）
            let offsetX = 0;
            let offsetY = 0;
            const anchorV = rootNodes[0];
            if (
              anchorV._manualX !== undefined &&
              anchorV._manualY !== undefined
            ) {
              offsetX = anchorV._manualX - idealPositions[anchorV.id].x;
              offsetY = anchorV._manualY - idealPositions[anchorV.id].y;
            }

            rootNodes.forEach((rootNode) => {
              if (
                rootNode._manualX !== undefined &&
                rootNode._manualY !== undefined
              ) {
                rootNode.x = rootNode._manualX;
                rootNode.y = rootNode._manualY;
              } else {
                rootNode.x = idealPositions[rootNode.id].x + offsetX;
                rootNode.y = idealPositions[rootNode.id].y + offsetY;
              }

              updateNodePositionVertical(rootNode.id);
            });
          } else if (expandDirection === "both") {
            // 双侧布局：根节点居中，一级子节点分配到左右双侧
            // 计算所有根节点的总高度（垂直排列）
            const totalRootHeight = rootNodes.reduce((sum, node) => {
              return sum + getGroupHeight(node.id);
            }, 0);
            let currentY = centerY - totalRootHeight / 2;

            // 放置根节点并计算一级子节点的左右分配
            const idealPositions = {};
            const leftChildrenMap = {}; // rootId -> [level1 children on left]
            const rightChildrenMap = {}; // rootId -> [level1 children on right]

            rootNodes.forEach((rootNode) => {
              const rWidth = getNodeWidth(rootNode);
              const rHeight = getNodeHeight(rootNode);
              const groupHeight = getGroupHeight(rootNode.id);
              idealPositions[rootNode.id] = {
                x: centerX - rWidth / 2,
                y: currentY + (groupHeight - rHeight) / 2,
              };
              currentY += groupHeight;

              // 获取一级子节点，按 side 属性分组（已设置 side 的优先），未设置的按 bothSideLeftCount 分配
              const level1Children = this.dtNodes.filter(
                (n) => n.parentId === rootNode.id && isNodeVisible(n.id)
              );
              const leftChildren = [];
              const rightChildren = [];
              const noSideChildren = [];
              level1Children.forEach((n) => {
                if (n.side === "left") leftChildren.push(n);
                else if (n.side === "right") rightChildren.push(n);
                else noSideChildren.push(n);
              });
              // 未设置 side 的节点，按 bothSideLeftCount 分配
              const bothSideLeftCount = this.dtSettings.bothSideLeftCount;
              let mid =
                bothSideLeftCount !== null && bothSideLeftCount !== undefined
                  ? bothSideLeftCount
                  : Math.ceil(noSideChildren.length / 2);
              mid = Math.max(0, Math.min(mid, noSideChildren.length));
              noSideChildren.sort((a, b) =>
                a.id.localeCompare(b.id, undefined, { numeric: true })
              );
              leftChildren.push(...noSideChildren.slice(0, mid));
              rightChildren.push(...noSideChildren.slice(mid));
              // 各自内部按 id 排序
              leftChildren.sort((a, b) =>
                a.id.localeCompare(b.id, undefined, { numeric: true })
              );
              rightChildren.sort((a, b) =>
                a.id.localeCompare(b.id, undefined, { numeric: true })
              );
              leftChildrenMap[rootNode.id] = leftChildren;
              rightChildrenMap[rootNode.id] = rightChildren;
            });

            // 计算手动定位根节点带来的偏移
            let offsetX = 0;
            let offsetY = 0;
            const anchorB = rootNodes[0];
            if (
              anchorB._manualX !== undefined &&
              anchorB._manualY !== undefined
            ) {
              offsetX = anchorB._manualX - idealPositions[anchorB.id].x;
              offsetY = anchorB._manualY - idealPositions[anchorB.id].y;
            }

            // 双侧布局的子节点位置更新：side='left'向左展开，side='right'向右展开
            const updateNodePositionBoth = (parentId, side) => {
              if (!isNodeVisible(parentId)) return;

              const parentNode = this.dtNodes.find((n) => n.id === parentId);
              const parentWidth = parentNode
                ? getNodeWidth(parentNode)
                : defaultNodeWidth;
              const parentHeight = parentNode
                ? getNodeHeight(parentNode)
                : defaultNodeHeight;
              const parentX = parentNode
                ? parentNode.x
                : centerX - parentWidth / 2;
              const parentCenterY = parentNode
                ? parentNode.y + parentHeight / 2
                : centerY;

              // 标记节点所属侧
              if (parentNode) {
                parentNode._side = side;
              }

              const children = this.dtNodes
                .filter((n) => n.parentId === parentId && isNodeVisible(n.id))
                .sort((a, b) =>
                  a.id.localeCompare(b.id, undefined, { numeric: true })
                );
              if (children.length === 0) return;

              const totalGroupHeight = children.reduce((sum, child) => {
                return sum + getGroupHeight(child.id);
              }, 0);

              let currentY = parentCenterY - totalGroupHeight / 2;

              children.forEach((child) => {
                const childHeight = getNodeHeight(child);
                const groupHeight = getGroupHeight(child.id);

                if (side === "left") {
                  // 左侧：子节点在父节点的左边
                  child.x = parentX - levelGap - getNodeWidth(child);
                } else {
                  // 右侧：子节点在父节点的右边
                  child.x = parentX + parentWidth + levelGap;
                }
                child.y = currentY + (groupHeight - childHeight) / 2;

                updateNodePositionBoth(child.id, side);
                currentY += groupHeight;
              });
            };

            rootNodes.forEach((rootNode) => {
              if (
                rootNode._manualX !== undefined &&
                rootNode._manualY !== undefined
              ) {
                rootNode.x = rootNode._manualX;
                rootNode.y = rootNode._manualY;
              } else {
                rootNode.x = idealPositions[rootNode.id].x + offsetX;
                rootNode.y = idealPositions[rootNode.id].y + offsetY;
              }

              rootNode._side = "root";

              // 分别处理左右双侧的一级子节点
              // 左侧子树：整体垂直居中对齐
              const leftChildren = leftChildrenMap[rootNode.id] || [];
              if (leftChildren.length > 0) {
                const leftTotalGroupHeight = leftChildren.reduce((sum, c) => {
                  return sum + getGroupHeight(c.id);
                }, 0);
                const rootCenterY = rootNode.y + getNodeHeight(rootNode) / 2;
                let leftCurrentY = rootCenterY - leftTotalGroupHeight / 2;

                leftChildren.forEach((child) => {
                  const childWidth = getNodeWidth(child);
                  const groupHeight = getGroupHeight(child.id);
                  // 左侧：子节点在根节点左边
                  child.x = rootNode.x - levelGap - childWidth;
                  child.y =
                    leftCurrentY + (groupHeight - getNodeHeight(child)) / 2;
                  child._side = "left";
                  updateNodePositionBoth(child.id, "left");
                  leftCurrentY += groupHeight;
                });
              }

              // 右侧子树
              const rightChildren = rightChildrenMap[rootNode.id] || [];
              if (rightChildren.length > 0) {
                const rightTotalGroupHeight = rightChildren.reduce((sum, c) => {
                  return sum + getGroupHeight(c.id);
                }, 0);
                const rootCenterY = rootNode.y + getNodeHeight(rootNode) / 2;
                let rightCurrentY = rootCenterY - rightTotalGroupHeight / 2;

                rightChildren.forEach((child) => {
                  const childHeight = getNodeHeight(child);
                  const groupHeight = getGroupHeight(child.id);
                  // 右侧：子节点在根节点右边
                  child.x = rootNode.x + getNodeWidth(rootNode) + levelGap;
                  child.y = rightCurrentY + (groupHeight - childHeight) / 2;
                  child._side = "right";
                  updateNodePositionBoth(child.id, "right");
                  rightCurrentY += groupHeight;
                });
              }
            });
          }
        }

        this.dtUpdateLines();
        this.dtUpdateSummaryPositions();
        this.dtUpdateSummaryLines();
        this.dtUpdateCanvasSize();

        // 如果指定了锚点节点，调整偏移使该节点的屏幕位置保持不变
        if (anchorNodeId) {
          const anchorNode = this.dtNodes.find((n) => n.id === anchorNodeId);
          if (anchorNode) {
            this.dtOffsetX =
              anchorNode._anchorScreenX - anchorNode.x * this.dtScale;
            this.dtOffsetY =
              anchorNode._anchorScreenY - anchorNode.y * this.dtScale;
            delete anchorNode._anchorScreenX;
            delete anchorNode._anchorScreenY;
          }
        }

        this.dtUpdatePositionsPending = false;
      });
    },
    dtUpdateCanvasSize() {
      if (this.dtNodes.length === 0) {
        this.dtCanvasWidth = 2000;
        this.dtCanvasHeight = 2000;
        return;
      }

      const defaultNodeWidth = 120;
      const defaultNodeHeight = 40;
      const padding = 100;

      const getNodeWidth = (node) => node.width || defaultNodeWidth;
      const getNodeHeight = (node) => node.height || defaultNodeHeight;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      this.dtNodes.forEach((node) => {
        if (this.dtIsNodeHidden(node)) return;
        const nodeWidth = getNodeWidth(node);
        const nodeHeight = getNodeHeight(node);
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + nodeWidth);
        maxY = Math.max(maxY, node.y + nodeHeight);
      });

      if (minX < 0 || minY < 0) {
        const offsetX = minX < 0 ? -minX + padding : 0;
        const offsetY = minY < 0 ? -minY + padding : 0;

        this.dtNodes.forEach((node) => {
          node.x += offsetX;
          node.y += offsetY;
          if (node._manualX !== undefined) node._manualX += offsetX;
          if (node._manualY !== undefined) node._manualY += offsetY;
        });

        this.dtCanvasWidth = Math.max(
          maxX + offsetX + padding,
          this.dtContainerWidth,
          2000
        );
        this.dtCanvasHeight = Math.max(
          maxY + offsetY + padding,
          this.dtContainerHeight,
          2000
        );

        this.dtUpdateLines();
      } else {
        this.dtCanvasWidth = Math.max(
          maxX + padding,
          this.dtContainerWidth,
          2000
        );
        this.dtCanvasHeight = Math.max(
          maxY + padding,
          this.dtContainerHeight,
          2000
        );
      }
    },
    dtUpdateDragSubtreeLines(dragNode) {
      const defaultNodeWidth = 120;
      const defaultNodeHeight = 40;
      const expandDirection = this.dtSettings.expandDirection || "horizontal";
      const lineStyle = this.dtSettings.lineStyle || "curve";
      const levelGap = this.dtSettings.levelGap;

      const getNodeWidth = (node) => node.width || defaultNodeWidth;
      const getNodeHeight = (node) => node.height || defaultNodeHeight;

      const isCollapsed = (nodeId) => this.dtCollapsedNodes.includes(nodeId);

      const isNodeHidden = (node) => {
        if (isCollapsed(node.id)) return true;
        const checkAncestors = (parentId) => {
          if (!parentId) return false;
          if (isCollapsed(parentId)) return true;
          const parent = this.dtNodes.find((n) => n.id === parentId);
          if (!parent) return false;
          return checkAncestors(parent.parentId);
        };
        return checkAncestors(node.parentId);
      };

      // 收集被拖拽节点的所有后代节点ID
      const descendantIds = new Set();
      const collectDescendants = (parentId) => {
        const children = this.dtNodes.filter((n) => n.parentId === parentId);
        children.forEach((child) => {
          descendantIds.add(child.id);
          collectDescendants(child.id);
        });
      };
      collectDescendants(dragNode.id);

      // 从dtLines中移除与被拖拽节点及其后代相关的连线
      this.dtLines = this.dtLines.filter((line) => {
        // 连线id格式: parentId-nodeId 或 parentId-h 或 parentId-v
        const parts = line.id.split("-");
        const firstPart = parts[0];
        // 如果连线的一端是被拖拽节点或其后代，移除
        if (firstPart === dragNode.id || descendantIds.has(firstPart))
          return false;
        const secondPart = parts.slice(1).join("-");
        if (descendantIds.has(secondPart)) return false;
        return true;
      });

      // 从dtPaths中移除与被拖拽节点及其后代相关的路径
      this.dtPaths = this.dtPaths.filter((path) => {
        const parts = path.id.split("-");
        const firstPart = parts[0];
        if (firstPart === dragNode.id || descendantIds.has(firstPart))
          return false;
        const secondPart = parts.slice(1).join("-");
        if (descendantIds.has(secondPart)) return false;
        return true;
      });

      // 为被拖拽节点的子树重新计算连线（不包括被拖拽节点与父节点的连线）
      const subtreeNodes = [
        dragNode,
        ...this.dtNodes.filter((n) => descendantIds.has(n.id)),
      ];

      const drawSubtreeLines = (isHorizontal) => {
        subtreeNodes.forEach((node) => {
          // 跳过被拖拽节点自身（不画它与父节点的连线）
          if (node.id === dragNode.id) return;
          if (!node.parentId) return;
          if (isNodeHidden(node)) return;

          const parentNode = this.dtNodes.find((n) => n.id === node.parentId);
          if (!parentNode) return;

          // 双侧布局下判断当前节点所属侧
          const isBothSide = expandDirection === "both";
          const side = isBothSide ? node._side || "right" : "right";

          if (isHorizontal) {
            // 双侧布局左侧：从父节点左边出线到子节点右边（镜像）
            const isLeft = isBothSide && side === "left";
            if (lineStyle === "diverge") {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeHeight = getNodeHeight(node);

              // 检查是否是parentNode下第一个可见子节点（在子树范围内）
              const visibleSiblings = subtreeNodes.filter(
                (n) => n.parentId === node.parentId && !isNodeHidden(n)
              );
              if (visibleSiblings.length === 0) return;

              // 只有当parentNode是被拖拽节点时才需要画分支结构
              // 对于更深层级的节点，它们的分支线可能已由非子树节点负责
              const isFirstSibling = visibleSiblings[0].id === node.id;

              if (isFirstSibling && parentNode.id === dragNode.id) {
                const midX = isLeft
                  ? parentNode.x - levelGap / 2
                  : parentNode.x + parentWidth + levelGap / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-h`,
                  x1: isLeft ? parentNode.x : parentNode.x + parentWidth,
                  y1: parentNode.y + parentHeight / 2,
                  x2: midX,
                  y2: parentNode.y + parentHeight / 2,
                });

                visibleSiblings.sort((a, b) => a.y - b.y);
                const topChild = visibleSiblings[0];
                const bottomChild = visibleSiblings[visibleSiblings.length - 1];
                const topY = topChild.y + getNodeHeight(topChild) / 2;
                const bottomY = bottomChild.y + getNodeHeight(bottomChild) / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-v`,
                  x1: midX,
                  y1: topY,
                  x2: midX,
                  y2: bottomY,
                });
              }

              const midX = isLeft
                ? parentNode.x - levelGap / 2
                : parentNode.x + getNodeWidth(parentNode) + levelGap / 2;

              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: midX,
                y1: node.y + nodeHeight / 2,
                x2: isLeft ? node.x + getNodeWidth(node) : node.x,
                y2: node.y + nodeHeight / 2,
              });
            } else if (lineStyle === "curve") {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeHeight = getNodeHeight(node);
              const nodeWidth = getNodeWidth(node);

              const startX = isLeft ? parentNode.x : parentNode.x + parentWidth;
              const startY = parentNode.y + parentHeight / 2;
              const endX = isLeft ? node.x + nodeWidth : node.x;
              const endY = node.y + nodeHeight / 2;

              const cpOffset = Math.min(
                levelGap * 0.5,
                Math.abs(endX - startX) * 0.4
              );
              const cpDir = isLeft ? -1 : 1;
              const cp1x = startX + cpDir * cpOffset;
              const cp1y = startY;
              const cp2x = endX - cpDir * cpOffset;
              const cp2y = endY;

              this.dtPaths.push({
                id: `${parentNode.id}-${node.id}`,
                d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
              });
            } else {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeHeight = getNodeHeight(node);
              const nodeWidth = getNodeWidth(node);

              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: isLeft ? parentNode.x : parentNode.x + parentWidth,
                y1: parentNode.y + parentHeight / 2,
                x2: isLeft ? node.x + nodeWidth : node.x,
                y2: node.y + nodeHeight / 2,
              });
            }
          } else {
            // 垂直布局
            if (lineStyle === "diverge") {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeWidth = getNodeWidth(node);

              const visibleSiblings = subtreeNodes.filter(
                (n) => n.parentId === node.parentId && !isNodeHidden(n)
              );
              if (visibleSiblings.length === 0) return;

              const isFirstSibling = visibleSiblings[0].id === node.id;

              if (isFirstSibling && parentNode.id === dragNode.id) {
                const midY = parentNode.y + parentHeight + levelGap / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-v`,
                  x1: parentNode.x + parentWidth / 2,
                  y1: parentNode.y + parentHeight,
                  x2: parentNode.x + parentWidth / 2,
                  y2: midY,
                });

                visibleSiblings.sort((a, b) => a.x - b.x);
                const leftChild = visibleSiblings[0];
                const rightChild = visibleSiblings[visibleSiblings.length - 1];
                const leftX = leftChild.x + getNodeWidth(leftChild) / 2;
                const rightX = rightChild.x + getNodeWidth(rightChild) / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-h`,
                  x1: leftX,
                  y1: midY,
                  x2: rightX,
                  y2: midY,
                });
              }

              const midY =
                parentNode.y + getNodeHeight(parentNode) + levelGap / 2;

              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: node.x + nodeWidth / 2,
                y1: midY,
                x2: node.x + nodeWidth / 2,
                y2: node.y,
              });
            } else if (lineStyle === "curve") {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeWidth = getNodeWidth(node);

              const startX = parentNode.x + parentWidth / 2;
              const startY = parentNode.y + parentHeight;
              const endX = node.x + nodeWidth / 2;
              const endY = node.y;

              const cpOffset = Math.min(
                levelGap * 0.5,
                Math.abs(endY - startY) * 0.4
              );
              const cp1x = startX;
              const cp1y = startY + cpOffset;
              const cp2x = endX;
              const cp2y = endY - cpOffset;

              this.dtPaths.push({
                id: `${parentNode.id}-${node.id}`,
                d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
              });
            } else {
              const parentWidth = getNodeWidth(parentNode);
              const parentHeight = getNodeHeight(parentNode);
              const nodeWidth = getNodeWidth(node);

              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: parentNode.x + parentWidth / 2,
                y1: parentNode.y + parentHeight,
                x2: node.x + nodeWidth / 2,
                y2: node.y,
              });
            }
          }
        });
      };

      if (expandDirection === "vertical") {
        drawSubtreeLines(false);
      } else if (expandDirection === "both") {
        // 双侧布局拖拽：用水平方向作为基础（后续可按_side区分左右）
        drawSubtreeLines(true);
      } else {
        drawSubtreeLines(true);
      }
    },
    dtUpdateLines() {
      this.dtLines = [];
      this.dtPaths = [];
      const defaultNodeWidth = 120;
      const defaultNodeHeight = 40;
      const expandDirection = this.dtSettings.expandDirection || "horizontal";

      const getNodeWidth = (node) => node.width || defaultNodeWidth;
      const getNodeHeight = (node) => node.height || defaultNodeHeight;

      const isCollapsed = (nodeId) => this.dtCollapsedNodes.includes(nodeId);

      const isNodeHidden = (node) => {
        if (isCollapsed(node.id)) return true;
        const checkAncestors = (parentId) => {
          if (!parentId) return false;
          if (isCollapsed(parentId)) return true;
          const parent = this.dtNodes.find((n) => n.id === parentId);
          if (!parent) return false;
          return checkAncestors(parent.parentId);
        };
        return checkAncestors(node.parentId);
      };

      // 水平布局的连线绘制
      const drawHorizontalLines = () => {
        if (this.dtSettings.lineStyle === "diverge") {
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeHeight = getNodeHeight(node);

                const siblings = this.dtNodes.filter(
                  (n) => n.parentId === node.parentId && !isNodeHidden(n)
                );
                if (siblings.length === 0) return;

                const isFirstSibling = siblings[0].id === node.id;

                if (isFirstSibling) {
                  const levelGap = this.dtSettings.levelGap;
                  const midX = parentNode.x + parentWidth + levelGap / 2;

                  this.dtLines.push({
                    id: `${parentNode.id}-h`,
                    x1: parentNode.x + parentWidth,
                    y1: parentNode.y + parentHeight / 2,
                    x2: midX,
                    y2: parentNode.y + parentHeight / 2,
                  });

                  siblings.sort((a, b) => a.y - b.y);
                  const topChild = siblings[0];
                  const bottomChild = siblings[siblings.length - 1];
                  const topY = topChild.y + getNodeHeight(topChild) / 2;
                  const bottomY =
                    bottomChild.y + getNodeHeight(bottomChild) / 2;

                  this.dtLines.push({
                    id: `${parentNode.id}-v`,
                    x1: midX,
                    y1: topY,
                    x2: midX,
                    y2: bottomY,
                  });
                }

                const levelGap = this.dtSettings.levelGap;
                const midX = parentNode.x + parentWidth + levelGap / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-${node.id}`,
                  x1: midX,
                  y1: node.y + nodeHeight / 2,
                  x2: node.x,
                  y2: node.y + nodeHeight / 2,
                });
              }
            }
          });
        } else if (this.dtSettings.lineStyle === "curve") {
          const levelGap = this.dtSettings.levelGap;
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeHeight = getNodeHeight(node);

                const startX = parentNode.x + parentWidth;
                const startY = parentNode.y + parentHeight / 2;
                const endX = node.x;
                const endY = node.y + nodeHeight / 2;

                const cpOffset = Math.min(
                  levelGap * 0.5,
                  Math.abs(endX - startX) * 0.4
                );
                const cp1x = startX + cpOffset;
                const cp1y = startY;
                const cp2x = endX - cpOffset;
                const cp2y = endY;

                this.dtPaths.push({
                  id: `${parentNode.id}-${node.id}`,
                  d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
                });
              }
            }
          });
        } else {
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeHeight = getNodeHeight(node);

                this.dtLines.push({
                  id: `${parentNode.id}-${node.id}`,
                  x1: parentNode.x + parentWidth,
                  y1: parentNode.y + parentHeight / 2,
                  x2: node.x,
                  y2: node.y + nodeHeight / 2,
                });
              }
            }
          });
        }
      };

      // 垂直布局的连线绘制
      const drawVerticalLines = () => {
        if (this.dtSettings.lineStyle === "diverge") {
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeWidth = getNodeWidth(node);

                const siblings = this.dtNodes.filter(
                  (n) => n.parentId === node.parentId && !isNodeHidden(n)
                );
                if (siblings.length === 0) return;

                const isFirstSibling = siblings[0].id === node.id;

                if (isFirstSibling) {
                  const levelGap = this.dtSettings.levelGap;
                  const midY = parentNode.y + parentHeight + levelGap / 2;

                  this.dtLines.push({
                    id: `${parentNode.id}-v`,
                    x1: parentNode.x + parentWidth / 2,
                    y1: parentNode.y + parentHeight,
                    x2: parentNode.x + parentWidth / 2,
                    y2: midY,
                  });

                  siblings.sort((a, b) => a.x - b.x);
                  const leftChild = siblings[0];
                  const rightChild = siblings[siblings.length - 1];
                  const leftX = leftChild.x + getNodeWidth(leftChild) / 2;
                  const rightX = rightChild.x + getNodeWidth(rightChild) / 2;

                  this.dtLines.push({
                    id: `${parentNode.id}-h`,
                    x1: leftX,
                    y1: midY,
                    x2: rightX,
                    y2: midY,
                  });
                }

                const levelGap = this.dtSettings.levelGap;
                const midY = parentNode.y + parentHeight + levelGap / 2;

                this.dtLines.push({
                  id: `${parentNode.id}-${node.id}`,
                  x1: node.x + nodeWidth / 2,
                  y1: midY,
                  x2: node.x + nodeWidth / 2,
                  y2: node.y,
                });
              }
            }
          });
        } else if (this.dtSettings.lineStyle === "curve") {
          const levelGap = this.dtSettings.levelGap;
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeWidth = getNodeWidth(node);

                const startX = parentNode.x + parentWidth / 2;
                const startY = parentNode.y + parentHeight;
                const endX = node.x + nodeWidth / 2;
                const endY = node.y;

                const cpOffset = Math.min(
                  levelGap * 0.5,
                  Math.abs(endY - startY) * 0.4
                );
                const cp1x = startX;
                const cp1y = startY + cpOffset;
                const cp2x = endX;
                const cp2y = endY - cpOffset;

                this.dtPaths.push({
                  id: `${parentNode.id}-${node.id}`,
                  d: `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`,
                });
              }
            }
          });
        } else {
          this.dtNodes.forEach((node) => {
            if (node.parentId) {
              if (isNodeHidden(node)) return;

              const parentNode = this.dtNodes.find(
                (n) => n.id === node.parentId
              );
              if (parentNode) {
                const parentWidth = getNodeWidth(parentNode);
                const parentHeight = getNodeHeight(parentNode);
                const nodeWidth = getNodeWidth(node);

                this.dtLines.push({
                  id: `${parentNode.id}-${node.id}`,
                  x1: parentNode.x + parentWidth / 2,
                  y1: parentNode.y + parentHeight,
                  x2: node.x + nodeWidth / 2,
                  y2: node.y,
                });
              }
            }
          });
        }
      };

      // 双侧布局的连线绘制
      const drawBothLines = () => {
        this.dtNodes.forEach((node) => {
          if (node.parentId) {
            if (isNodeHidden(node)) return;
            const parentNode = this.dtNodes.find((n) => n.id === node.parentId);
            if (!parentNode) return;
            const parentWidth = getNodeWidth(parentNode);
            const parentHeight = getNodeHeight(parentNode);
            const nodeWidth = getNodeWidth(node);
            const nodeHeight = getNodeHeight(node);
            const side = node._side || "right";

            if (this.dtSettings.lineStyle === "diverge") {
              const siblings = this.dtNodes.filter(
                (n) =>
                  n.parentId === node.parentId &&
                  !isNodeHidden(n) &&
                  (n._side || "right") === side
              );
              if (siblings.length === 0) return;
              const isFirstSibling = siblings[0].id === node.id;
              if (isFirstSibling) {
                const levelGap = this.dtSettings.levelGap;
                let midX;
                if (side === "left") {
                  midX = parentNode.x - levelGap / 2;
                  this.dtLines.push({
                    id: `${parentNode.id}-h`,
                    x1: parentNode.x,
                    y1: parentNode.y + parentHeight / 2,
                    x2: midX,
                    y2: parentNode.y + parentHeight / 2,
                  });
                } else {
                  midX = parentNode.x + parentWidth + levelGap / 2;
                  this.dtLines.push({
                    id: `${parentNode.id}-h`,
                    x1: parentNode.x + parentWidth,
                    y1: parentNode.y + parentHeight / 2,
                    x2: midX,
                    y2: parentNode.y + parentHeight / 2,
                  });
                }
                siblings.sort((a, b) => a.y - b.y);
                const topY = siblings[0].y + getNodeHeight(siblings[0]) / 2;
                const bottomY =
                  siblings[siblings.length - 1].y +
                  getNodeHeight(siblings[siblings.length - 1]) / 2;
                this.dtLines.push({
                  id: `${parentNode.id}-v`,
                  x1: midX,
                  y1: topY,
                  x2: midX,
                  y2: bottomY,
                });
              }
              const midX =
                side === "left"
                  ? parentNode.x - this.dtSettings.levelGap / 2
                  : parentNode.x + parentWidth + this.dtSettings.levelGap / 2;
              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: midX,
                y1: node.y + nodeHeight / 2,
                x2: side === "left" ? node.x + nodeWidth : node.x,
                y2: node.y + nodeHeight / 2,
              });
            } else if (this.dtSettings.lineStyle === "curve") {
              const levelGap = this.dtSettings.levelGap;
              let startX, endX, cpDir;
              if (side === "left") {
                startX = parentNode.x;
                endX = node.x + nodeWidth;
                cpDir = -1;
              } else {
                startX = parentNode.x + parentWidth;
                endX = node.x;
                cpDir = 1;
              }
              const startY = parentNode.y + parentHeight / 2;
              const endY = node.y + nodeHeight / 2;
              const cpOffset = Math.min(
                levelGap * 0.5,
                Math.abs(endX - startX) * 0.4
              );
              this.dtPaths.push({
                id: `${parentNode.id}-${node.id}`,
                d: `M ${startX} ${startY} C ${
                  startX + cpDir * cpOffset
                } ${startY}, ${
                  endX - cpDir * cpOffset
                } ${endY}, ${endX} ${endY}`,
              });
            } else {
              let startX, endX;
              if (side === "left") {
                startX = parentNode.x;
                endX = node.x + nodeWidth;
              } else {
                startX = parentNode.x + parentWidth;
                endX = node.x;
              }
              this.dtLines.push({
                id: `${parentNode.id}-${node.id}`,
                x1: startX,
                y1: parentNode.y + parentHeight / 2,
                x2: endX,
                y2: node.y + nodeHeight / 2,
              });
            }
          }
        });
      };

      if (expandDirection === "vertical") {
        drawVerticalLines();
      } else if (expandDirection === "both") {
        drawBothLines();
      } else {
        drawHorizontalLines();
      }
    },

    onTouchStart(e) {
      this.startY = e.touches[0].clientY;
    },
    onTouchMove(e) {
      if (
        !this.isMobile ||
        (this.currentView === "mindMaps" && this.dtCurrentPage === "mindmap")
      )
        return;
      const currentY = e.touches[0].clientY;
      if (window.scrollY <= 0 && currentY > this.startY) {
        e.preventDefault();
      }
    },

    triggerBackupFileUpload() {
      this.$refs.backupFileInput.click();
    },

    handleBackupFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target.result;
          this.backupFiles.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            base64: base64Data,
            uploadTime: new Date().toLocaleString(),
          });
        };
        reader.readAsDataURL(file);
      });

      event.target.value = "";
    },

    downloadBackupFile(index) {
      const file = this.backupFiles[index];
      if (!file) return;

      const link = document.createElement("a");
      link.href = file.base64;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    deleteBackupFile(index) {
      if (confirm(`确定要删除文件 "${this.backupFiles[index]?.name}" 吗？`)) {
        this.backupFiles.splice(index, 1);
      }
    },

    splitUsers(userStr) {
      if (!userStr) return [];
      return userStr.trim().split(/\s+/).filter(Boolean);
    },

    // 获取第一个用户（用于编辑时保留原题）
    getFirstUser(userStr) {
      const users = this.splitUsers(userStr);
      return users.length > 0 ? users[0] : "";
    },

    getText1() {
      if (this.currentView == "readingCard") {
        const card = this.currentReadingCard;
        if (!card) return;

        // 构建朗读文本 - 先只朗读题目
        let textToRead = `题号：${card.id}。。。。。。。。`;
        textToRead += `题型：${card.questionType}。。。。。。。`;

        // 题目文本（去除HTML标签）
        if (card.question) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = card.question;
          const questionText = tempDiv.textContent || tempDiv.innerText || "";
          textToRead += `题目：${questionText}。。。。。。。`;
        }

        // 更新当前朗读文本
        this.currentReadingCardText = textToRead
          ?.split("。。。。。。。。")[1]
          .replaceAll("。。。。。。。", "\n");
      }
    },

    // 获取其他用户（用于生成新题）
    getOtherUsers(userStr) {
      const users = this.splitUsers(userStr);
      return users.length > 1 ? users.slice(1) : [];
    },
    editCurrentTestQuestion() {
      this.fromPage = "2";
      const currentQuestion = this.filteredTestMistaker[this.currentTestIndex];
      this.editError(currentQuestion);
    },
    renderQuestionContent(item) {
      if (!item.question) return "无";

      // 创建临时div来解析HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = item.question;

      // 处理所有图片
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        img.style.cursor = "pointer";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
      });

      return tempDiv.innerHTML;
    },

    // 渲染答案内容，为图片添加点击事件
    renderAnswerContent(item) {
      if (!item.answer) return "无";

      // 创建临时div来解析HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = item.answer;

      // 处理所有图片
      const images = tempDiv.querySelectorAll("img");
      images.forEach((img) => {
        img.style.cursor = "pointer";
        img.style.maxWidth = "100%";
        img.style.height = "auto";
      });

      return tempDiv.innerHTML;
    },
    // 打印题卡
    printQuestionCards() {
      if (this.questionCards.length === 0) {
        alert("没有可打印的题卡！");
        return;
      }

      const printWindow = window.open("", "_blank");

      // 构建分组表格形式的打印内容
      const printContent = this.generateGroupedPrintContent();

      const printHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>错题本题卡打印</title>
      <meta charset="utf-8">
      <style>
        @media print {
          @page {
            size: A4 portrait;
            margin: 1cm;
          }
          
          body {
            font-size: 12pt;
            line-height: 1.6;
            margin: 0;
            padding: 0;
          }
          
          .print-container {
            width: 100%;
          }
          
          .group-section {
            margin-bottom: 16px;
            page-break-inside: avoid;
          }
          
          .group-header {
            background-color: #f0f0f0;
            font-weight: 500;
            font-size: 13pt;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          
          .print-table th {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            font-weight: bold;
          }
          
          .print-table td {
            border: 1px solid #ddd;
            padding: 8px;
            vertical-align: center;
          }
          
          .card-header {
            background-color: #e3f2fd;
            font-weight: bold;
            text-align: center;
          }
          
          .question-content, .answer-content {
            line-height: 1.4;
          }
          
          .question-content img, .answer-content img {
            width: 100%;
            max-height: 320px;
            display: block;
            margin: 5px 0;
          }
          
          /* 保持v-html的基本样式 */
          .question-content strong, .answer-content strong {
            font-weight: bold;
          }
          
          .question-content em, .answer-content em {
            font-style: italic;
          }
          
          .question-content u, .answer-content u {
            text-decoration: underline;
          }
          
          .question-content p, .answer-content p {
            margin: 5px 0;
          }
          
          .correct-idea {
            background-color: #f8fff8;
            padding: 5px;
            border-left: 3px solid #27ae60;
          }
          
          .page-break {
            page-break-after: always;
          }
        }
        
        @media screen {
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
          }
          
          .print-container {
            width: 21cm;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
        }
        
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #3498db;
        }
        
        .print-title {
          font-size: 24pt;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .print-meta {
          color: #666;
          font-size: 12pt;
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="print-header">
          <div class="print-meta">
            <p>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}（共 ${
              this.questionCards.length
            } 题）</p>
          </div>
        </div>
        ${printContent}
      </div>
    </body>
    </html>
  `;

      printWindow.document.write(printHtml);
      printWindow.document.close();

      // 等待内容加载完成后打印
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    },

    // 生成分组表格形式的打印内容
    generateGroupedPrintContent() {
      let content = "";
      const maxPerPage = 18; // 每页最多18个分组

      this.groupedQuestionCards.forEach((group, groupIndex) => {
        if (groupIndex % maxPerPage === 0) {
          if (groupIndex > 0) {
            content += '<div class="page-break"></div>';
          }
        }

        // 添加分组标题
        content += `
      <div class="group-section">
        <div class="group-header">
          第${groupIndex + 1}组：${group.user} - ${group.subject} - ${
            group.subClass
          } - ${group.questionType} 
          （共 ${group.cards.length} 题）
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th width="11%">记录</th>
              <th width="7%">题号</th>
              <th width="42%">题目</th>
              <th width="40%">答案与解析</th>
            </tr>
          </thead>
          <tbody>
    `;

        // 添加该分组下的题目
        group.cards.forEach((card) => {
          // 处理题目HTML内容，保持基本样式
          const processHtmlContent = (html) => {
            if (!html) return "";

            // 创建一个临时div来解析HTML，保持基本样式
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // 处理图片
            const images = tempDiv.querySelectorAll("img");
            images.forEach((img) => {
              img.style.maxWidth = "100%";
              img.style.maxHeight = "320px";
              img.style.display = "block";
              img.style.margin = "5px 0";
            });

            return tempDiv.innerHTML;
          };

          const questionContent = processHtmlContent(card.question);
          const answerContent = processHtmlContent(card.answer);
          const correctContent = processHtmlContent(card.correctIdea);
          content += `
        <tr>
          <td class="text-center"></td>
          <td class="text-center">${card.id}</td>
          <td class="question-content">${questionContent || "无题目内容"}</td>
          <td class="answer-content">
            <div>
              ${answerContent || ""} 
            </div>
            <div>
              ${correctContent || ""}
            </div>
           </td>
        </tr>
      `;
        });

        content += `
          </tbody>
        </table>
      </div>
    `;
      });

      return content;
    },

    toggleCardGroup(groupKey) {
      // 创建新的 Set 实例以确保响应式更新
      const newSet = new Set(this.expandedCardGroups);

      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }

      // 赋值新的 Set 来触发响应式更新
      this.expandedCardGroups = newSet;
    },

    // 检查分组是否展开
    isGroupExpanded(groupKey) {
      return this.expandedCardGroups.has(groupKey);
    },

    // 展开所有分组
    expandAllGroups() {
      this.groupedQuestionCards.forEach((group) => {
        this.expandedCardGroups.add(group.key);
      });
    },

    // 收起所有分组
    collapseAllGroups() {
      this.expandedCardGroups.clear();
    },

    applyTestFilter() {
      this.testAllList = [...this.questionCards];
      this.testLength = this.testAllList.length;
      this.currentTestIndex = 0;
      this.showAnswer = false;
      this.testResult = null;
      this.testRound = 1;
      this.wrongNum = 0;
      this.roundDone = false;
      this.isReview = false;
      this.filteredTestMistaker = this.testAllList.slice(0, this.groupNumber);
    },
    toggleReadingCards() {
      if (this.isReadingCard) {
        this.stopReadingCards();
      } else {
        if (this.currentReadingCardIndex < 0) this.currentReadingCardIndex = 0;
        if (this.currentReadingCardIndex >= this.questionCards.length)
          this.currentReadingCardIndex = this.questionCards.length - 1;
        this.startReadingCards();
        this.switchView("readingCard");
      }
    },
    loadBaiDuTJScript() {
      if (document.getElementById("baidu-tongji-script")) return;
      window._hmt = window._hmt || [];
      const hm = document.createElement("script");
      hm.id = "baidu-tongji-script";
      hm.src = "https://hm.baidu.com/hm.js?8cd25f4a6ff603e61707fa049681a149";
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    },

    pageView() {
      if (window._hmt) {
        window._hmt.push(["_trackPageview", "/mistakeBook"]);
      }
    },

    // 修改开始朗读题卡方法
    startReadingCards() {
      if (this.questionCards.length === 0) {
        alert("没有可朗读的题卡！");
        return;
      }
      this.isReadingCard = true;
      this.speechState.isPaused = false;
      this.speechState.isSpeaking = true;
      this.readCurrentCard();
    },

    // 修改朗读当前题卡方法
    readCurrentCard() {
      if (
        !this.isReadingCard ||
        this.currentReadingCardIndex < 0 ||
        this.currentReadingCardIndex >= this.questionCards.length
      ) {
        console.log("停止朗读条件触发");
        this.stopReadingCards();
        return;
      }

      const card = this.currentReadingCard;
      if (!card) return;

      // 构建朗读文本 - 先只朗读题目
      let textToRead = `题号：${card.id}。。。。。。。。`;
      textToRead += `题型：${card.questionType}。。。。。。。`;

      // 题目文本（去除HTML标签）
      if (card.question) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = card.question;
        const questionText = tempDiv.textContent || tempDiv.innerText || "";
        textToRead += `题目：${questionText}。。。。。。。`;
      }

      // 更新当前朗读文本
      this.currentReadingCardText = textToRead
        ?.split("。。。。。。。。")[1]
        .replaceAll("。。。。。。。", "\n");
      textToRead = textToRead.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "zh-CN";
      utterance.rate = 0.9;

      // 保存当前utterance的引用
      this.currentUtterance = utterance;

      // 添加语音状态监听
      utterance.onstart = () => {
        this.speechState.isSpeaking = true;
        this.speechState.isPaused = false;
      };

      utterance.onpause = () => {
        this.speechState.isPaused = true;
        this.speechState.isSpeaking = false;
      };

      utterance.onresume = () => {
        this.speechState.isPaused = false;
        this.speechState.isSpeaking = true;
      };

      utterance.onend = () => {
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;

        // 如果启用了自动暂停，则暂停朗读并等待点击
        if (this.autoPauseAfterReading) {
          this.isWaitingForClick = true;
          // 添加点击监听器继续朗读答案部分
          this.addContinueClickListener("answer");
        } else {
          // 原来的逻辑：继续朗读答案部分
          this.readAnswerPart();
        }
      };

      utterance.onerror = (event) => {
        console.log("朗读出错:", event);
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;
        this.isWaitingForClick = false;
        this.removeContinueClickListener();
        if (this.isReadingCard) {
          this.stopReadingCards();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    // 新增：朗读答案部分的方法
    readAnswerPart() {
      const card = this.currentReadingCard;
      if (!card) return;

      // 构建答案部分朗读文本
      let answerTextToRead = "";

      // 答案文本（去除HTML标签）
      if (card.answer) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = card.answer;
        const answerText = tempDiv.textContent || tempDiv.innerText || "";
        answerTextToRead += `答案：${answerText}。。。。。。。`;
      }

      // 解析
      if (card.correctIdea) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = card.correctIdea;
        const correctIdeaText = tempDiv.textContent || tempDiv.innerText || "";
        answerTextToRead += `解析：${correctIdeaText}`;
      }
      // 如果没有答案内容，直接进入下一题
      if (!answerTextToRead.trim()) {
        this.moveToNextCard();
        return;
      }

      // 更新当前朗读文本
      this.currentReadingCardText +=
        "\n" + answerTextToRead.replace("。。。。。。。", "\n");
      answerTextToRead = answerTextToRead.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(answerTextToRead);
      utterance.lang = "zh-CN";
      utterance.rate = 0.9;

      this.currentUtterance = utterance;

      utterance.onstart = () => {
        this.speechState.isSpeaking = true;
        this.speechState.isPaused = false;
      };

      utterance.onpause = () => {
        this.speechState.isPaused = true;
        this.speechState.isSpeaking = false;
      };

      utterance.onresume = () => {
        this.speechState.isPaused = false;
        this.speechState.isSpeaking = true;
      };

      utterance.onend = () => {
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;

        // 如果启用了自动暂停，则暂停朗读并等待点击
        if (this.autoPauseAfterReading) {
          this.isWaitingForClick = true;
          // 添加点击监听器继续下一题
          this.addContinueClickListener("next");
        } else {
          // 原来的逻辑：延迟1秒后朗读下一题
          this.moveToNextCard();
        }
      };

      utterance.onerror = (event) => {
        console.log("朗读答案部分出错:", event);
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;
        this.isWaitingForClick = false;
        this.removeContinueClickListener();
        if (this.isReadingCard) {
          this.stopReadingCards();
        }
      };
      window.speechSynthesis.speak(utterance);
    },

    // 新增：移动到下一题的方法
    moveToNextCard() {
      setTimeout(() => {
        this.currentReadingCardIndex++;
        if (this.currentReadingCardIndex < this.questionCards.length) {
          this.readCurrentCard();
        } else {
          this.stopReadingCards();
          alert("题卡朗读完成！");
        }
      }, 1000);
    },

    addContinueClickListener(type) {
      this.continueClickListener = () => {
        if (this.isWaitingForClick && this.isReadingCard) {
          this.continueReading(type);
        }
      };
      document.addEventListener("click", this.continueClickListener);
    },

    removeContinueClickListener() {
      if (this.continueClickListener) {
        document.removeEventListener("click", this.continueClickListener);
        this.continueClickListener = null;
      }
    },

    // 新增：继续朗读下一题
    continueReading(type) {
      this.isWaitingForClick = false;
      this.removeContinueClickListener();

      if (type === "answer") {
        // 继续朗读答案部分
        this.readAnswerPart();
      } else if (type === "next") {
        // 继续下一题
        this.moveToNextCard();
      }
    },

    // 修改停止朗读题卡方法，清理监听器
    stopReadingCards() {
      this.isWaitingForClick = false;
      this.removeContinueClickListener();
      if (this.currentUtterance) {
        this.currentUtterance.onerror = null;
        this.currentUtterance.onend = null;
        this.currentUtterance = null;
      }
      window.speechSynthesis.cancel();
      this.isReadingCard = false;
      this.speechState.isPaused = false;
      this.speechState.isSpeaking = false;
    },

    editHaveDo(x) {
      if (this.newV == "" || this.oldV == "") return;
      if (x == 1) {
        this.mistaker.forEach((item) => {
          if (item.user === this.oldV) {
            item.user = this.newV;
          }
        });
        this.finalCheatSheet.forEach((item) => {
          if (item.user === this.oldV) {
            item.user = this.newV;
          }
        });
      } else if (x == 2) {
        this.mistaker.forEach((item) => {
          if (item.subject === this.oldV) {
            item.subject = this.newV;
          }
        });
        this.finalCheatSheet.forEach((item) => {
          if (item.subject === this.oldV) {
            item.subject = this.newV;
          }
        });
        this.finalQuestionTypeSummary.forEach((item) => {
          if (item.subject === this.oldV) {
            item.subject = this.newV;
          }
        });
        this.taskList.forEach((item) => {
          if (item.subject === this.oldV) {
            item.subject = this.newV;
          }
        });
      } else if (x == 3) {
        this.mistaker.forEach((item) => {
          if (item.subClass === this.oldV) {
            item.subClass = this.newV;
          }
        });

        this.finalQuestionTypeSummary.forEach((item) => {
          if (item.subClass === this.oldV) {
            item.subClass = this.newV;
          }
        });
        this.taskList.forEach((item) => {
          if (item.subClass === this.oldV) {
            item.subClass = this.newV;
          }
        });
      } else if (x == 4) {
        this.mistaker.forEach((item) => {
          if (item.questionType === this.oldV) {
            item.questionType = this.newV;
          }
        });

        this.finalQuestionTypeSummary.forEach((item) => {
          if (item.questionType === this.oldV) {
            item.questionType = this.newV;
          }
        });
        this.taskList.forEach((item) => {
          if (item.questionType === this.oldV) {
            item.questionType = this.newV;
          }
        });
      }
      this.editHaveNow = 0;
    },

    lastCurrentCard() {
      if (this.isReadingCard) {
        // 先移除当前utterance的事件监听器，避免触发onerror
        if (this.currentUtterance) {
          this.currentUtterance.onerror = null;
          this.currentUtterance.onend = null;
        }

        window.speechSynthesis.cancel();
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;

        this.currentReadingCardIndex--;
        if (this.currentReadingCardIndex > -1) {
          console.log("跳过到上一题");
          this.readCurrentCard();
        } else {
          this.stopReadingCards();
          alert("题卡朗读完成！");
        }
      } else if (this.currentReadingCardIndex > 1) {
        this.currentReadingCardIndex--;
        this.getText1();
      }
    },
    ex(x) {
      if (!x) return x;
      let xx = x
        .replace(/<\/p><p>/g, "</p><br><p>")
        .replace(/<p>/g, "<p style='margin: 0'>")
        .replace(/##(\d+)##/g, (match, num) => {
          return `<a class="link-tag" style="color:#409eff;cursor:pointer;text-decoration:underline dashed;" data-id="${num}">题号${num}</a>`;
        });

      const regex = /[＊*]{2}([^＊*]+)[＊*]{2}/g;
      if (this.dtShowAllBlanks) {
        return xx.replace(regex, (match, answer) => {
          return `<span class="dt-blank dt-blank-show">${answer}</span>`;
        });
      } else {
        return xx.replace(regex, (match, answer) => {
          return `<span class="dt-blank" onclick="this.classList.toggle('dt-blank-show')">${answer}</span>`;
        });
      }
    },

    // 下一题卡
    skipCurrentCard() {
      if (this.isReadingCard) {
        // 先移除当前utterance的事件监听器，避免触发onerror
        if (this.currentUtterance) {
          this.currentUtterance.onerror = null;
          this.currentUtterance.onend = null;
        }

        window.speechSynthesis.cancel();
        this.speechState.isSpeaking = false;
        this.speechState.isPaused = false;

        this.currentReadingCardIndex++;
        if (this.currentReadingCardIndex < this.questionCards.length) {
          console.log("跳过到下一题");
          this.readCurrentCard();
        } else {
          this.stopReadingCards();
          alert("题卡朗读完成！");
        }
      } else if (this.currentReadingCardIndex < this.questionCards.length - 1) {
        this.currentReadingCardIndex++;
        this.getText1();
      }
    },
    openPrintCheatSheetModal() {
      this.showPrintCheatSheetModal = true;
      // 初始化选中状态
      this.selectedCheatSheetIds = [];
      // 准备打印数据
      this.preparePrintData();
    },

    // 准备打印数据
    preparePrintData() {
      this.printCheatSheetData = [];
      this.groupedCheatSheets.forEach((group) => {
        group.items.forEach((item) => {
          const uniqueId = `${group.key}-${item.subject || "no-subject"}`;
          this.printCheatSheetData.push({
            ...item,
            uniqueId: uniqueId,
            groupInfo: `${group.user} - ${group.subject}`,
          });
        });
      });
    },

    changeLevel(x) {
      if (x == 0 && this.form.importantLevel > 0)
        this.form.importantLevel = this.form.importantLevel - 1;
      else if (x == 1 && this.form.importantLevel < 8)
        this.form.importantLevel = this.form.importantLevel + 1;
    },

    // 全选/取消全选
    toggleSelectAllCheatSheets() {
      if (
        this.selectedCheatSheetIds.length === this.printCheatSheetData.length
      ) {
        this.selectedCheatSheetIds = [];
      } else {
        this.selectedCheatSheetIds = this.printCheatSheetData.map(
          (item) => item.uniqueId
        );
      }
    },

    handleLinkClick(e, node) {
      if (node && this.dtSelectedNode !== node) return;
      const el = e.target.closest(".link-tag");
      if (!el) return;
      const id = el.dataset.id;
      this.openLink(id);
    },

    openLink(id) {
      this.showItem = this.mistaker.find((item) => item.id == id);
      if (!this.showItem) alert("未在错题本中找到此题号！");
    },
    switchQ(index) {
      let value = this.showQ[index] == 1 ? 0 : 1;
      this.$set(this.showQ, index, value); // ✅ Vue 能监听
    },
    // 在 methods 中添加以下方法
    handleCheckboxClick(uniqueId, event) {
      // 阻止事件冒泡到父元素
      event.stopPropagation();
      this.toggleCheatSheetSelection(uniqueId);
    },

    editHave(x) {
      this.editHaveNow = x;
    },

    handleCheatSheetItemClick(uniqueId, event) {
      // 检查点击的是否是复选框或复选框标签
      if (
        event.target.type === "checkbox" ||
        event.target.classList.contains("cheatsheet-checkbox") ||
        event.target.classList.contains("checkmark")
      ) {
        return; // 如果是复选框相关元素，不处理
      }
      this.toggleCheatSheetSelection(uniqueId);
    },

    // 修改现有的 toggleCheatSheetSelection 方法
    toggleCheatSheetSelection(uniqueId) {
      const index = this.selectedCheatSheetIds.indexOf(uniqueId);
      if (index > -1) {
        this.selectedCheatSheetIds.splice(index, 1);
      } else {
        this.selectedCheatSheetIds.push(uniqueId);
      }
    },

    // 打印选中的CheatSheet
    printSelectedCheatSheets() {
      if (this.selectedCheatSheetIds.length === 0) {
        alert("请至少选择一项要打印的CheatSheet！");
        return;
      }

      const selectedItems = this.printCheatSheetData.filter((item) =>
        this.selectedCheatSheetIds.includes(item.uniqueId)
      );

      this.generateCheatSheetPrintContent(selectedItems);
    },

    saveFilterForm(form) {
      localStorage.setItem(
        this.user.username + "filterForm",
        JSON.stringify(form)
      );
    },
    saveTestFilterForm(form) {
      localStorage.setItem(
        this.user.username + "testFilterForm",
        JSON.stringify(form)
      );
    },

    loadTestFilterForm() {
      const defaultForm = {
        keyword: "",
        user: "",
        subject: "",
        lastWrong: false,
        excludeTodayTested: true,
        excludeFiveCorrect: false,
        lessThan1: false,
        allowInterval: true,
        fav: false,
        specialIL: false,
        importantLevel: 0,
      };

      try {
        const saved = localStorage.getItem(
          this.user.username + "testFilterForm"
        );
        if (saved) {
          return { ...defaultForm, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error("读取筛选条件失败", e);
      }
      return defaultForm;
    },

    loadFilterForm() {
      let defaultForm = {
        id: "",
        user: "",
        startDate: "",
        endDate: "",
        subject: "",
        keyword: "",
        fav: false,
        hasCards: true,
        specialIL: false,
        importantLevel: 0,
      };

      try {
        const saved = localStorage.getItem(this.user.username + "filterForm");
        if (saved) {
          return { ...defaultForm, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error("读取筛选条件失败", e);
      }
      return defaultForm;
    },
    generateCheatSheetPrintContent(selectedItems) {
      const printWindow = window.open("", "_blank");

      let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CheatSheet打印</title>
        <meta charset="utf-8">
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 1cm;
            }
            
            body {
              font-family: 'SimSun', serif;
              font-size: 12pt;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            
            .print-container {
              width: 100%;
            }
            
            .cheatsheet-item {
              break-inside: avoid;
              margin-bottom: 20px;
              page-break-inside: avoid;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 6px;
            }
            
            .group-header {
              background-color: #f0f0f0;
              padding: 8px 12px;
              font-weight: bold;
              margin-bottom: 10px;
              border-radius: 4px;
            }
            
            .cheatsheet-content {
              line-height: 1.8;
            }
            
            .cheatsheet-content img {
              max-width: 100%;
              height: auto;
              margin: 5px 0;
            }
            
            .page-break {
              page-break-after: always;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #3498db;
            }
            
            .print-title {
              font-size: 24pt;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            
            .print-meta {
              color: #666;
              font-size: 12pt;
            }
          }
          
          @media screen {
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background-color: #f5f5f5;
            }
            
            .print-container {
              width: 21cm;
              margin: 0 auto;
              background-color: white;
              padding: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
          }
          .cheatsheet-content strong {
            font-weight: bold;
          }
          
          .cheatsheet-content em {
            font-style: italic;
          }
          
          .cheatsheet-content u {
            text-decoration: underline;
          }
          
          .cheatsheet-content p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <div class="print-title">CheatSheet速记要点 ${new Date().toLocaleDateString()}</div>
          </div>
    `;

      selectedItems.forEach((item, index) => {
        if (index > 0 && index % 3 === 0) {
          printContent += '<div class="page-break"></div>';
        }

        printContent += `
        <div class="cheatsheet-item">
          <div class="group-header">${item.groupInfo}</div>
          <div class="cheatsheet-content">
            ${item.cheatSheet || "暂无内容"}
          </div>
        </div>
      `;
      });

      printContent += `
        </div>
      </body>
      </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      // 等待内容加载完成后打印
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    },

    // 关闭打印模态框
    closePrintCheatSheetModal() {
      this.showPrintCheatSheetModal = false;
      this.selectedCheatSheetIds = [];
    },

    registerCustomMenu() {
      if (this.hasRegisteredMenu) {
        return;
      }
      class MyMenu {
        constructor() {
          this.title = "📅";
          this.tag = "button";
        }

        getValue() {
          return "";
        }

        isActive() {
          return false;
        }

        isDisabled() {
          return false;
        }

        exec(editor) {
          if (this.isDisabled(editor)) return;
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");

          const weekDays = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六",
          ];
          const weekDay = weekDays[now.getDay()];
          const dateStr = `${year}-${month}-${day} ${weekDay}`;

          editor.insertText(dateStr);
        }
      }

      const menuConf = {
        key: "myMenu",
        factory() {
          return new MyMenu();
        },
      };

      try {
        Boot.registerMenu(menuConf);
        this.hasRegisteredMenu = true; // 注册成功后才设置标志位
      } catch (error) {
        if (error.message.includes("Duplicated key")) {
          this.hasRegisteredMenu = true; // 即使重复也视为已注册
        } else {
          console.error("注册菜单失败:", error);
        }
      }

      class MyQMenu {
        constructor() {
          this.title = "🗂️";
          this.tag = "button";
        }

        getValue() {
          return "";
        }

        isActive() {
          return false;
        }

        isDisabled() {
          return false;
        }

        exec(editor) {
          if (this.isDisabled(editor)) return;
          const qStr = `##输入题号##`;
          editor.insertText(qStr);
        }
      }

      const menuConfQ = {
        key: "myQ",
        factory() {
          return new MyQMenu();
        },
      };

      try {
        Boot.registerMenu(menuConfQ);
        this.hasRegisteredMenu = true;
      } catch (error) {
        if (error.message.includes("Duplicated key")) {
          this.hasRegisteredMenu = true;
        } else {
          console.error("注册myQ菜单失败:", error);
        }
      }

      class MyBlankMenu {
        constructor() {
          this.title = "**A**";
          this.tag = "button";
        }

        getValue() {
          return "";
        }

        isActive() {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed && range.toString().trim().length > 0) {
              const text = range.toString();
              if (
                text.startsWith("**") &&
                text.endsWith("**") &&
                text.length > 4
              ) {
                return true;
              }
            }
          }
          return false;
        }

        isDisabled() {
          return false;
        }

        exec(editor) {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) {
            editor.insertText("****");
            return;
          }

          const range = selection.getRangeAt(0);
          const text = range.toString();

          if (range.collapsed || text.trim().length === 0) {
            editor.insertText("****");
          } else if (
            text.startsWith("**") &&
            text.endsWith("**") &&
            text.length > 4
          ) {
            const newText = text.slice(2, -2);
            editor.deleteFragment();
            editor.insertText(newText);
          } else {
            const newText = `**${text}**`;
            editor.deleteFragment();
            editor.insertText(newText);
          }
        }
      }

      const menuConfBlank = {
        key: "myBlank",
        factory() {
          return new MyBlankMenu();
        },
      };

      try {
        Boot.registerMenu(menuConfBlank);
        this.hasRegisteredMenu = true;
      } catch (error) {
        if (error.message.includes("Duplicated key")) {
          this.hasRegisteredMenu = true;
        } else {
          console.error("注册myBlank菜单失败:", error);
        }
      }
    },

    async checkUpdate() {
      let file = await api.fetch(
        "/files/!PDJ/user-" + this.user.username + "/"
      );
      let lastTime = await api.fetch(
        "/files/!PDJ/user-" +
          this.user.username +
          "/Repeater-backup/mbModifiedTime.txt"
      );
      const mistakeItem = file?.items.find(
        (i) => i.name === "mistakebook.json"
      );
      const sizeb = mistakeItem?.size || 0;
      const size = Math.round((sizeb / (1024 * 1024)) * 100) / 100; // 结果：115.74
      if (lastTime) this.serverModifiedTime = Number(lastTime.content);
      if (this.serverModifiedTime < 1) return;
      this.lastModifiedTime =
        Number(window.localStorage.getItem(this.user.username + "lastSaved")) ||
        0;
      if (this.serverModifiedTime > this.lastModifiedTime) {
        if (
          confirm(
            "服务器上的错题本与缓存中的错题本内容有差别，是否下载？移动网络请注意流量！文件大小：" +
              size +
              "MB，点击'取消'将继续使用缓存中的错题本。"
          )
        ) {
          this.readFromServer();
        }
      }
    },
    bindImageClick() {
      const handleDocumentClick = (e) => {
        const target = e.target;
        if (target.tagName === "IMG") {
          const isAttachImg =
            target.classList.contains("small-img") ||
            target.closest(".attachment-wrap") ||
            target.closest(".imgs-preview");
          const isInWangEditor = target.closest(".w-e-image-container");
          if (!isAttachImg && !isInWangEditor && target.src) {
            this.openImageViewer(target.src);
          }
        }
      };
      document.removeEventListener("click", this.documentClickHandler);
      this.documentClickHandler = handleDocumentClick;
      document.addEventListener("click", handleDocumentClick);
    },

    toggleTestFilter() {
      this.showTestFilterPanel = !this.showTestFilterPanel;
    },

    // 重置测试筛选
    resetTestFilter() {
      this.testFilterForm = {
        keyword: "",
        user: "",
        subject: "",
        lastWrong: false,
        excludeTodayTested: true,
        excludeFiveCorrect: false,
        lessThan1: false,
        allowInterval: false,
        fav: false,
        specialIL: false,
        importantLevel: 0,
      };
    },

    // 修改开始测试方法，应用筛选
    startTest() {
      this.applyTestFilter();
      this.isTesting = true;
      this.currentView = "test";
      if (this.testAllList.length === 0) {
        setTimeout(() => {
          alert("无待测试题卡！可改变筛选条件重新选择题卡。");
        }, 100);
        return;
      }
    },

    // 单独的事件处理函数（方便移除）
    vHtmlImgClickHandler(e) {
      e.stopPropagation(); // 阻止冒泡到附件容器
      const img = e.target;
      if (img.src) {
        this.openImageViewer(img.src); // 数组参数
      }
    },

    toggleTreeNode(nodePath, nodeType) {
      // 创建新的Set以确保响应式
      const newSet = new Set(this.expandedTreeNodes);

      if (newSet.has(nodePath)) {
        newSet.delete(nodePath);

        // 如果是科目或考点节点被收起，同时收起其所有子节点
        if (nodeType === "subject" || nodeType === "subClass") {
          // 移除所有以该路径开头的子节点
          Array.from(newSet).forEach((path) => {
            if (path.startsWith(nodePath + "|")) {
              newSet.delete(path);
            }
          });
        }
      } else {
        newSet.add(nodePath);
      }

      this.expandedTreeNodes = newSet;

      // 如果是科目或考点节点，同时选中该节点
      if (nodeType !== "questionType") {
        this.selectedTreePath = nodePath;
      }
    },

    addReview(x, y) {
      if (y == 1) {
        let iR = this.mistaker.find((item) => item.id == x.id);
        if (iR && iR.importantLevel < 8) {
          iR.importantLevel++;
          const a = iR.importantLevel;
          this.showMsg(1, a);
        }
      } else {
        if (x.importantLevel < 8) x.importantLevel++;
        const a = x.importantLevel;
        this.showMsg(1, a);
      }
      this.readFromCache(true);
    },

    mergeItem() {
      if (
        this.form.user.trim() &&
        this.form.subject.trim() &&
        this.form.questionType.trim() &&
        this.form.subClass.trim()
      ) {
        const mergedItem = this.mistaker.find(
          (item) =>
            item.user == this.form.user.trim() &&
            item.subject == this.form.subject.trim() &&
            item.questionType == this.form.questionType.trim() &&
            item.subClass == this.form.subClass.trim()
        );
        if (mergedItem) {
          this.cancelNow();
          setTimeout(() => {
            this.editError(mergedItem, 5);
          }, 100);
        } else {
          alert("未找到可以汇总合并的已有题型！");
          return;
        }
      } else {
        alert("请先填写完整用户、科目、考点、题型");
        return;
      }
    },

    selectTreeNode(nodePath) {
      this.selectedTreePath = nodePath;
    },

    isTreeNodeExpanded(nodePath) {
      return this.expandedTreeNodes.has(nodePath);
    },
    toggleCardExpand(cardId) {
      const newSet = new Set(this.expandedCardIds);

      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      this.expandedCardIds = newSet;
    },

    expandAllTreeNodes() {
      const newSet = new Set();
      this.treeNavigationData.forEach((subject) => {
        newSet.add(subject.name);
        subject.children.forEach((subClass) => {
          const subClassPath = `${subject.name}|${subClass.name}`;
          newSet.add(subClassPath);
        });
      });

      this.expandedTreeNodes = newSet;
    },

    collapseAllTreeNodes() {
      this.expandedTreeNodes = new Set();
    },

    unbindImageClick() {
      // 移除document上的事件监听器
      if (this.documentClickHandler) {
        document.removeEventListener("click", this.documentClickHandler);
        this.documentClickHandler = null;
      }
      // 清理旧的imageListeners（兼容旧代码）
      this.imageListeners.forEach((item) => {
        item.el.removeEventListener("click", item.handler);
        delete item.el.dataset.clickBound;
      });
      this.imageListeners = [];
    },

    toggleQuestionTypeSummaryFilter() {
      this.isQuestionTypeSummaryFilterOpen =
        !this.isQuestionTypeSummaryFilterOpen;
    },

    handleQuestionTypeSummaryFilter() {
      const start = this.questionTypeSummaryFilterForm.importantLevelStart;
      const end = this.questionTypeSummaryFilterForm.importantLevelEnd;

      if (
        (start && (start < 0 || start > 8)) ||
        (end && (end < 0 || end > 8))
      ) {
        alert("掌握程度只能输入0-8之间的数字！");
        return;
      }

      if (start && end && start > end) {
        alert("掌握程度最低值不能大于最高值！");
        return;
      }

      // 计算属性会自动更新，这里不需要额外操作
      if (
        Object.keys(this.questionTypeMapFiltered).length === 0 &&
        Object.keys(this.questionTypeMap).length > 0
      ) {
        alert("未找到符合条件的题型总结！");
      }
    },

    // 新增：重置题型总结筛选
    resetQuestionTypeSummaryFilter() {
      this.questionTypeSummaryFilterForm = {
        keyword: "",
        importantLevelStart: 0,
        importantLevelEnd: 8,
      };
    },
    openAddTaskModal() {
      this.isEditingTask = false;
      this.editingTaskIndex = -1;
      this.taskForm = {
        subject: "",
        subClass: "",
        improveMethod: "",
      };
      this.taskFormErrors = {
        subject: "",
        subClass: "",
      };
      this.showTaskModal = true;
    },

    // 检查并清空不在候选列表中的字段值
    checkAndClearFields1() {
      // 检查考点：如果科目改变且当前考点值不在新科目的考点列表中，则清空考点
      if (this.form.subject?.trim() && this.form.subClass?.trim()) {
        const currentSubClass = this.form.subClass.trim();
        const isSubClassValid = this.uniqueSubClasses.includes(currentSubClass);

        if (!isSubClassValid) {
          this.form.subClass = "";
        }
      }
      this.getTaskListItem();
    },
    // 检查并清空不在候选列表中的字段值
    checkAndClearFields2() {
      if (this.form.subClass?.trim() && this.form.questionType?.trim()) {
        const currentQuestionType = this.form.questionType.trim();
        const isQuestionTypeValid =
          this.uniqueQuestionTypes.includes(currentQuestionType);

        if (!isQuestionTypeValid) {
          this.form.questionType = "";
        }
      }
      this.getTaskListItem();
    },

    getQuestionTypeSummaryIndex(questionType) {
      const questionTypeKeys = this.questionTypeMapFiltered.map(
        (item) => item.key
      );
      return questionTypeKeys.indexOf(questionType);
    },

    openAddSubjectSummaryModal() {
      this.isEditingSubjectSummary = false;
      this.form.title = "";
      this.form.subjectSummary = "";
      this.form.subjectImgUrls = [];
      this.showSubjectSummaryModal = true;
    },

    editCheatSheet(b, c) {
      let cs = this.finalCheatSheet.find((item) => {
        if (item.user == b && item.subject == c) return true;
        else return false;
      });
      if (cs) {
        this.form.subject = cs.subject;
        this.form.user = cs.user;
        this.form.cheatSheet = cs.cheatSheet;
      } else {
        this.form.subject = c;
        this.form.user = b;
        this.form.cheatSheet = "";
      }
      if (this.currentView !== "add") this.showCSModal = true;
    },

    editCheatSheet1(b, c) {
      let cs = this.finalCheatSheet.find((item) => {
        if (item.user == b && item.subject == c) return true;
        else return false;
      });
      if (cs) {
        this.form.subject = cs.subject;
        this.form.user = cs.user;
        this.form.cheatSheet = cs.cheatSheet;
      } else {
        this.form.subject = c;
        this.form.user = b;
        this.form.cheatSheet = "";
      }
    },

    editSubjectSummary(index) {
      this.isEditingSubjectSummary = true;
      this.form.index = index;
      this.form.title = this.finalSubjectSummary[index].title;
      this.form.subjectSummary = this.finalSubjectSummary[index].subjectSummary;
      this.form.subjectImgUrls = this.finalSubjectSummary[index].subjectImgUrls;
      this.showSubjectSummaryModal = true;
    },
    expandAllCardGroups() {
      this.isAllCardGroupsExpanded = true;
      this.groupedQuestionCards.forEach((group) => {
        this.expandedCardGroups.add(group.key);
      });
    },

    // 新增：收起所有题卡分组
    collapseAllCardGroups() {
      this.isAllCardGroupsExpanded = false;
      this.expandedCardGroups.clear();
    },

    // 新增：计算属性，判断是否所有分组都已展开

    startReadingQuestionTypeSummary(index) {
      // 如果正在朗读则先停止
      if (this.isReadingQuestionTypeSummary) {
        this.stopReadingQuestionTypeSummary();
      }

      this.isReadingQuestionTypeSummary = true;
      this.currentReadingQuestionTypeIndex = index;
      this.readQuestionTypeSummaryItem(index);
    },

    // 新增：停止朗读题型总结
    stopReadingQuestionTypeSummary() {
      window.speechSynthesis.cancel();
      this.isReadingQuestionTypeSummary = false;
      this.currentReadingQuestionTypeIndex = -1;
    },

    // 新增：朗读指定索引的题型总结
    readQuestionTypeSummaryItem(index) {
      // 检查索引是否有效
      const questionTypeKeys = Object.keys(this.questionTypeMapFiltered);
      if (index < 0 || index >= questionTypeKeys.length) {
        this.isReadingQuestionTypeSummary = false;
        this.currentReadingQuestionTypeIndex = -1;
        return;
      }

      const summaryItem = this.questionTypeMapFiltered[index];
      const questionType = summaryItem ? summaryItem.key : "";
      const summaryData = summaryItem ? summaryItem.value : null;

      // 构建要朗读的文本内容
      let textToRead = `题型：${questionType}。`;

      if (summaryData && summaryData.summary && summaryData.summary.trim()) {
        // 去除HTML标签，只朗读文本内容
        const div = document.createElement("div");
        div.innerHTML = summaryData.summary;
        const plainText = div.textContent || div.innerText || "";
        textToRead += `总结要点：${plainText}。`;
      } else {
        textToRead += "暂无总结内容。";
      }

      textToRead = textToRead.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      // 设置语音属性
      utterance.lang = "zh-CN";
      utterance.rate = 0.9; // 语速稍慢便于听清楚

      // 朗读结束时触发
      utterance.onend = () => {
        // 自动朗读下一题
        this.currentReadingQuestionTypeIndex++;
        this.readQuestionTypeSummaryItem(this.currentReadingQuestionTypeIndex);
      };

      // 朗读出错时停止
      utterance.onerror = () => {
        this.isReadingQuestionTypeSummary = false;
        this.currentReadingQuestionTypeIndex = -1;
      };

      // 开始朗读
      window.speechSynthesis.speak(utterance);
    },

    // 修改：停止所有朗读（包括错题列表和题型总结）
    stopReading() {
      window.speechSynthesis.cancel();
      this.isReading = false;
      this.currentReadingIndex = -1;
      this.isReadingQuestionTypeSummary = false;
      this.currentReadingQuestionTypeIndex = -1;
    },

    deleteSubjectSummary(index) {
      if (!confirm(`确定要删除吗？此操作不可恢复！`)) {
        return;
      }

      // 从finalSubjectSummary中删除
      this.finalSubjectSummary.splice(index, 1);

      alert("项目删除成功！");
    },
    // 打开编辑任务弹窗
    editTask(task, index) {
      this.isEditingTask = true;
      this.editingTaskIndex = index;
      this.taskForm = {
        subject: task.subject || "",
        subClass: task.subClass || "",
        questionType: task.questionType || "",
        improveMethod: task.improveMethod || "",
      };
      this.taskFormErrors = {
        subject: "",
        subClass: "",
      };
      this.showTaskModal = true;
    },

    // 关闭任务弹窗
    closeTaskModal() {
      this.showTaskModal = false;
      this.taskFormErrors = {
        subject: "",
        subClass: "",
      };
    },
    toggleQuestionTypeSummaryGroup(questionType) {
      this.$set(
        this.questionTypeSummaryCollapsed,
        questionType,
        !this.questionTypeSummaryCollapsed[questionType]
      );
    },

    // 新增：检查题型总结分组是否折叠
    isQuestionTypeSummaryGroupCollapsed(questionType) {
      return this.questionTypeSummaryCollapsed[questionType] === true;
    },

    // 新增：切换题型总结全部展开/收起
    toggleQuestionTypeSummaryExpandAll() {
      this.isQuestionTypeSummaryAllExpanded =
        !this.isQuestionTypeSummaryAllExpanded;

      // 遍历数组中的每个项目，使用 item.key 作为键
      this.questionTypeMapFiltered.forEach((item) => {
        this.$set(
          this.questionTypeSummaryCollapsed,
          item.key,
          !this.isQuestionTypeSummaryAllExpanded
        );
      });
    },
    // 验证任务表单
    validateTaskForm() {
      let isValid = true;
      this.taskFormErrors = {
        subject: "",
        subClass: "",
        questionType: "", // 新增
      };

      if (!this.taskForm.subject?.trim()) {
        this.taskFormErrors.subject = "科目为必填项";
        isValid = false;
      }

      if (!this.taskForm.subClass?.trim()) {
        this.taskFormErrors.subClass = "考点为必填项";
        isValid = false;
      }

      // 新增：题型验证
      if (!this.taskForm.questionType?.trim()) {
        this.taskFormErrors.questionType = "题型为必填项";
        isValid = false;
      }

      return isValid;
    },

    // 保存任务
    saveTask() {
      if (!this.validateTaskForm()) {
        return;
      }

      // 检查科目、考点和题型组合是否已存在
      const subject = this.taskForm.subject.trim();
      const subClass = this.taskForm.subClass.trim();
      const questionType = this.taskForm.questionType.trim(); // 新增

      // 检查是否已存在相同的科目、考点和题型组合
      const existingTask = this.taskList.find(
        (task, index) =>
          task.subject === subject &&
          task.subClass === subClass &&
          task.questionType === questionType &&
          (!this.isEditingTask || index !== this.editingTaskIndex)
      );

      if (existingTask) {
        alert("任务已存在，请修改科目、考点或题型");
        return;
      }

      const taskData = {
        subject: subject,
        subClass: subClass,
        questionType: questionType, // 新增
        improveMethod: this.taskForm.improveMethod.trim(),
        completedToday: false,
        completionHistory: [],
      };
      if (
        this.isEditingTask &&
        this.editingTaskIndex !== -1 &&
        !this.taskForm.improveMethod?.trim()
      ) {
        this.taskList.splice(this.editingTaskIndex, 1);
      } else if (this.isEditingTask && this.editingTaskIndex !== -1) {
        // 编辑现有任务
        this.taskList[this.editingTaskIndex] = taskData;
      } else if (this.taskForm.improveMethod?.trim()) {
        // 添加新任务
        this.taskList.push(taskData);
      }

      this.closeTaskModal();
      alert(this.isEditingTask ? "任务更新成功！" : "任务添加成功！");
    },
    deleteTask(index) {
      if (confirm("确定要删除这个任务吗？此操作不可恢复！")) {
        this.taskList.splice(index, 1);
        alert("任务删除成功！");
      }
    },
    toggleTaskCompletion(task) {
      if (task.completedToday) {
        if (!task.completionHistory) {
          task.completionHistory = [];
        }

        if (!task.completionHistory?.includes(this.todayDate)) {
          task.completionHistory.push(this.todayDate);
          task.completionHistory.sort((a, b) => new Date(b) - new Date(a));
        }
        task.completedToday = false;
      }
    },
    toggleSubjectSummary(index) {
      this.$set(
        this.subjectSummaryExpanded,
        index,
        !this.subjectSummaryExpanded[index]
      );
    },

    isSubjectSummaryExpanded(index) {
      return this.subjectSummaryExpanded[index] !== false;
    },
    expandAllSubjectSummaries() {
      this.finalSubjectSummary.forEach((_, index) => {
        this.$set(this.subjectSummaryExpanded, index, true);
      });
      this.isAllSubjectSummaryExpanded = true;
    },
    collapseAllSubjectSummaries() {
      this.finalSubjectSummary.forEach((_, index) => {
        this.$set(this.subjectSummaryExpanded, index, false);
      });
      this.isAllSubjectSummaryExpanded = false;
    },
    toggleSubjectSummaryExpandAll() {
      if (this.isAllSubjectSummaryExpanded) {
        this.collapseAllSubjectSummaries();
      } else {
        this.expandAllSubjectSummaries();
      }
    },

    uploadFile(x) {
      if (x == 1) this.$refs.questionType.click();
      if (x == 2) this.$refs.subject.click();
      if (x == 3) this.$refs.original.click();
      if (x == 4) this.$refs.errorReason.click();
      if (x == 5) this.$refs.similar.click();
    },
    saveNow() {
      if (this.batchAdd) {
        this.batchSave();
        return;
      }
      if (this.showSubjectSummaryModal) this.updateSList();
      else if (this.showQuestionTypeSummaryModal) {
        this.updateQList();
        this.switchView("questionTypeSummary");
      } else if (this.isEditing) {
        this.updateError();
      } else {
        this.saveError();
      }
    },
    batchSave() {
      if (
        !this.form.user?.trim() ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户、科目、考点、题型为必填项，用以分类题目！");
        return;
      }

      const questionArray = this.batchQuestion.split("\n");
      const answerArray = this.batchAnswer.split("\n");
      if (
        questionArray.length != answerArray.length &&
        this.batchAnswer != ""
      ) {
        if (
          !confirm("答案区有内容，但题目数量与题卡题目数量不符，继续存盘吗？")
        ) {
          return;
        }
      }

      let batchNew = [];
      const baseData = {
        addDate: this.form.addDate,
        user: this.form.user?.trim() || "",
        subject: this.form.subject?.trim() || "",
      };

      for (let i = 0; i < questionArray.length; i++) {
        const maxId =
          this.mistaker.length > 0
            ? Math.max(...this.mistaker.map((item) => item.id))
            : 0;
        const newId = maxId + i + 1;

        const newError = {
          id: newId,
          ...baseData,
          subClass: this.form.subClass?.trim() || "",
          questionType: this.form.questionType?.trim() || "",
          errorReasonImgUrls: [],
          trap: "",
          trapDetail: "",
          originalText: "",
          originalImgUrls: [],
          errorType: "",
          errorReason: "",
          question: questionArray[i],
          answer: answerArray[i] || "",
          correctIdea: "",
          improveMethod: "",
          similarText: "",
          similarImgUrls: [],
          importantLevel: 0,
        };
        batchNew.push(newError);
      }
      this.mistaker.push(...batchNew);
      this.switchView("home");
      this.batchAdd = false;
      this.fromPage = "";
      this.isEditing = false;
      alert(`批量添加成功！新增${questionArray.length}道题目`);
    },
    cancelNow() {
      this.batchAdd = false;
      if (this.showSubjectSummaryModal) this.closeSubjectSummaryModal();
      else if (this.isEditing) {
        this.isEditing = false;
        if (this.showQuestionTypeSummaryModal)
          this.switchView("questionTypeSummary");
        else {
          if (this.fromPage == "1") this.switchView("printPaper");
          else if (this.fromPage == "2") this.switchView("test");
          else if (this.fromPage == "4") this.switchView("cardList");
          else if (this.fromPage == "5") this.switchView("home");
          else this.switchView("list");
        }
      } else if (this.showQuestionTypeSummaryModal) {
        this.switchView("questionTypeSummary");
      } else this.switchView("home");
      this.fromPage = "";
    },
    onCreated(editor) {
      this.editor = Object.seal(editor);
    },
    onCreated1(editor) {
      this.editor1 = Object.seal(editor);
    },
    onCreated2(editor) {
      this.editor2 = Object.seal(editor);
    },
    onCreated3(editor) {
      this.editor3 = Object.seal(editor);
    },
    onCreated4(editor) {
      this.editor4 = Object.seal(editor);
    },
    onCreated5(editor) {
      this.editor5 = Object.seal(editor);
    },
    onCreated7(editor) {
      this.editor7 = Object.seal(editor);
    },
    onCreated6(editor) {
      this.editor6 = Object.seal(editor);
    },

    getTaskListItem() {
      if (
        this.form.subject?.trim() &&
        this.form.subClass?.trim() &&
        this.form.questionType?.trim()
      ) {
        this.form.improveMethod =
          this.taskList.find(
            (item) =>
              item.subject === this.form.subject.trim() &&
              item.subClass === this.form.subClass.trim() &&
              item.questionType === this.form.questionType.trim()
          )?.improveMethod || "";
      } else {
        this.form.improveMethod = "";
      }
    },

    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;
      // console.log(editor.getText()); // 执行 editor API..
    },
    initCropper() {
      if (this.$refs.image && this.imgSrc) {
        this.cropper = new Cropper(this.$refs.image, {
          aspectRatio: 0,
          viewMode: 0,
          dragMode: "move",
          autoCropArea: 0.58,
          background: false,
          responsive: true,
          restore: true,
          checkCrossOrigin: true,
        });
        setTimeout(() => {
          const cropperModal = this.$el.querySelector(".cropper-modal");
          if (cropperModal) {
            cropperModal.style.opacity = "0.1";
          }
        }, 100);
      }
    },
    toggleSection(sectionName) {
      this.sections[sectionName] = !this.sections[sectionName];
    },

    switchListView() {
      if (this.listViewMode == "group") {
        if (!this.isMobile) this.listViewMode = "tree";
        else this.listViewMode = "flat";
      } else if (this.listViewMode == "tree") this.listViewMode = "flat";
      else if (this.listViewMode == "flat") this.listViewMode = "group";
    },

    toggleExpandAll() {
      this.isAllExpanded = !this.isAllExpanded;
      this.groupedMistaker.forEach((subjectGroup) => {
        const subjectKey = subjectGroup.subject;
        this.$set(
          this.collapsedStates.subject,
          subjectKey,
          !this.isAllExpanded
        );

        subjectGroup.subClasses.forEach((subClassGroup) => {
          const subClassKey = `${subjectGroup.subject}-${subClassGroup.subClass}`;
          this.$set(
            this.collapsedStates.subClass,
            subClassKey,
            !this.isAllExpanded
          );

          subClassGroup.questionTypes.forEach((questionTypeGroup) => {
            const questionTypeKey = `${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`;
            this.$set(
              this.collapsedStates.questionType,
              questionTypeKey,
              !this.isAllExpanded
            );
          });
        });
      });
    },
    editQuestionType(id) {
      this.isEditing = true;
      this.showQuestionTypeSummaryModal = true;
      const subject = id?.split("►")[0];
      const subClass = id?.split("►")[1];
      const questionType = id?.split("►")[2];
      this.tItem = this.finalQuestionTypeSummary.find(
        (item) =>
          item.subject === subject &&
          item.subClass === subClass &&
          item.questionType === questionType
      );
      this.form = {
        user: "all",
        subject: subject,
        subClass: subClass || "",
        questionType: questionType || "",
        questionTypeSummary: this.tItem?.questionTypeSummary || "",
        questionTypeImgUrls: this.tItem?.questionTypeImgUrls || [],
      };
      this.switchView("add");
    },

    deleteQuestionType(id) {
      if (!confirm("确定要删除此项题型总结吗？此操作不可恢复！")) {
        return;
      }
      const subject = id?.split("►")[0];
      const subClass = id?.split("►")[1];
      const questionType = id?.split("►")[2];
      const tItem = this.finalQuestionTypeSummary.find(
        (item) =>
          item.subject === subject &&
          item.subClass === subClass &&
          item.questionType === questionType
      );

      if (tItem) {
        const targetIndex = this.finalQuestionTypeSummary.indexOf(tItem);
        if (targetIndex !== -1) {
          this.finalQuestionTypeSummary.splice(targetIndex, 1);
        }
      }
    },

    getGlobalIndex(id) {
      return this.showMistaker.findIndex((item) => item.id === id);
    },
    showSubjectSummary(x) {
      this.subjectClicked = x;
      this.openSubjectSummaryModal();
    },

    toggleCollapse(type, key) {
      const currentState = this.collapsedStates[type][key];
      this.$set(this.collapsedStates[type], key, !currentState);
      if (!currentState) {
        if (type === "subject") {
          const subjectGroup = this.groupedMistaker.find(
            (group) => group.subject === key
          );
          if (subjectGroup) {
            subjectGroup.subClasses.forEach((subClassGroup) => {
              const subClassKey = `${key}-${subClassGroup.subClass}`;
              this.$set(this.collapsedStates.subClass, subClassKey, true);
              subClassGroup.questionTypes.forEach((questionTypeGroup) => {
                const questionTypeKey = `${subClassKey}-${questionTypeGroup.questionType}`;
                this.$set(
                  this.collapsedStates.questionType,
                  questionTypeKey,
                  true
                );
              });
            });
          }
        } else if (type === "subClass") {
          const [subject, subClass] = key.split("-");
          const subjectGroup = this.groupedMistaker.find(
            (group) => group.subject === subject
          );
          if (subjectGroup) {
            const subClassGroup = subjectGroup.subClasses.find(
              (sc) => sc.subClass === subClass
            );
            if (subClassGroup) {
              subClassGroup.questionTypes.forEach((questionTypeGroup) => {
                const questionTypeKey = `${key}-${questionTypeGroup.questionType}`;
                this.$set(
                  this.collapsedStates.questionType,
                  questionTypeKey,
                  true
                );
              });
            }
          }
        }
      }
    },
    checkAnswer() {
      this.showAnswer = true;
    },

    clearRecords() {
      if (
        !confirm(
          "所有题卡掌握程度将重置为0，测试时的正确错误记录也将清空。确定吗？"
        )
      ) {
        return;
      }
      for (let i = 0; i < this.mistaker.length; i++) {
        let currentQuestion = this.mistaker[i];
        currentQuestion.reviewDate = "0,0";
        currentQuestion.reviewResult = [];
        currentQuestion.reviewResult1 = [];
        currentQuestion.importantLevel = 0;
      }
    },
    recordAnswer(isCorrect) {
      const currentQuestion = this.filteredTestMistaker[this.currentTestIndex];
      if (
        !Object.prototype.hasOwnProperty.call(currentQuestion, "reviewDate")
      ) {
        this.$set(currentQuestion, "reviewDate", "0,0");
      }
      if (
        !Object.prototype.hasOwnProperty.call(currentQuestion, "reviewResult")
      ) {
        this.$set(currentQuestion, "reviewResult", []);
      }
      this.showAnswer = true;

      // 在复习模式下，不改变掌握程度，只记录测试结果用于判断是否还需要复习
      if (!this.isReview) {
        currentQuestion.reviewDate =
          Date.now() + "," + currentQuestion.reviewDate.split(",")[1];
        currentQuestion.reviewResult.push(isCorrect ? 1 : 0);
        if (currentQuestion.importantLevel < 8 && isCorrect) {
          currentQuestion.importantLevel = currentQuestion.importantLevel + 1;
          this.showMsg(1, currentQuestion.importantLevel);
        } else if (!isCorrect) {
          currentQuestion.importantLevel = 0;
          this.showMsg(0, 0);
        }
      }

      // 标记错题用于本轮复习
      if (!isCorrect) {
        this.$set(currentQuestion, "isWrong", true);
        this.wrongNum++;
      } else {
        this.$set(currentQuestion, "isWrong", false);
      }

      this.testResult = isCorrect;
      this.readFromCache(isCorrect);
    },

    readFromCache(x) {
      let audioPath = "";
      let audio = null;
      audio = new Audio();
      if (x) audioPath = this.urla.split("/api/")[0] + "/static/right.mp3";
      else audioPath = this.urla.split("/api/")[0] + "/static/wrong.mp3";
      let vmm = this;
      localforage
        .getItem(audioPath)
        .then(function (value) {
          audio.src = URL.createObjectURL(value);
          audio.play();
        })
        .catch(function () {
          vmm.currentAudioPlay(audioPath);
          return;
        });
    },

    currentAudioPlay(x) {
      let currentAudio = null;
      currentAudio = new Audio(x);
      currentAudio.play();
      this.downloadAndCacheMp3(x);
    },

    async downloadAndCacheMp3(x) {
      const response = await fetch(x);
      if (!response.ok) throw new Error("下载失败");
      const blob = await response.blob();
      localforage
        .setItem(x, blob)
        .then(() => {})
        .catch(() => {});
    },

    showMsg(x, y) {
      if (x == 0) this.msg = "当前题卡掌握程度已降至 0 级！";
      else if (x == 1) this.msg = "当前题卡掌握程度已升至 " + y + "级！";
      setTimeout(() => {
        this.msg = "";
      }, 3000);
    },
    nextQuestion() {
      this.showAnswer = false;
      this.testResult = null;
      if (this.currentTestIndex < this.filteredTestMistaker.length - 1) {
        this.currentTestIndex++;
      } else {
        // 当前组测试完成，检查是否有错题需要复习
        this.checkReview();
      }
    },

    checkReview() {
      // 筛选本轮错题
      const wrongList = this.filteredTestMistaker.filter(
        (item) => item.isWrong
      );

      if (wrongList.length == 0) {
        // 本轮无错题
        this.roundDone = true;
        const isConfirm = window.confirm(
          "本轮无错题！共已完成 " + this.testRound + " 组测试。测试下一组题卡？"
        );
        if (isConfirm) {
          this.toNextGroup();
        } else {
          this.finishTest();
        }
        return;
      }

      // 进入错题复习模式
      this.filteredTestMistaker = wrongList;
      this.isReview = true;
      this.wrongNum = 0;
      this.currentTestIndex = 0;
      this.showAnswer = false;
      this.testResult = null;
    },

    toNextGroup() {
      if (this.testLength - this.groupNumber * this.testRound <= 0) {
        alert("已无未测试题卡，点击'确定'结束测试。");
        this.finishTest();
        return;
      }
      this.wrongNum = 0;
      this.roundDone = false;
      this.testRound = this.testRound + 1;
      this.filteredTestMistaker = this.testAllList.slice(
        this.groupNumber * (this.testRound - 1),
        this.groupNumber * this.testRound
      );
      this.isReview = false;
      this.currentTestIndex = 0;
      this.showAnswer = false;
      this.testResult = null;
    },

    finishTest() {
      alert("测试结束！");
      this.isTesting = false;
      this.currentView = "home";
    },

    isCollapsed(type, key) {
      return this.collapsedStates[type][key] === true;
    },

    openSubjectSummaryModal() {
      this.showSubjectSummaryModal = true;
    },
    closeSubjectSummaryModal() {
      this.showSubjectSummaryModal = false;
      this.isEditingSubjectSummary = false;
    },

    toCropOriginalImage(x, url, index) {
      this.fromPic = x;
      this.imgSrc = url;
      this.tempIndex = index;
      this.$nextTick(() => {
        this.initCropper();
      });
    },
    crop() {
      if (!this.cropper) return;

      this.cropper.crop();
      this.getCroppedImage();
    },
    getCroppedImage() {
      if (!this.cropper) return;

      const canvas = this.cropper.getCroppedCanvas();
      const mimeType = "image/webp";
      const quality = 0.9;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      if (this.cropAsNewImage) {
        if (this.fromPic === 1) {
          this.form.similarImgUrls.push(dataUrl);
        } else if (this.fromPic === 2) {
          this.form.questionTypeImgUrls.push(dataUrl);
        } else if (this.fromPic === 3) {
          this.form.errorReasonImgUrls.push(dataUrl);
        } else if (this.fromPic === 4) {
          this.form.subjectImgUrls.push(dataUrl);
        } else {
          this.form.originalImgUrls.push(dataUrl);
        }
      } else {
        if (this.fromPic === 1) {
          this.form.similarImgUrls[this.tempIndex] = dataUrl;
        } else if (this.fromPic === 2) {
          this.form.questionTypeImgUrls[this.tempIndex] = dataUrl;
        } else if (this.fromPic === 3) {
          this.form.errorReasonImgUrls[this.tempIndex] = dataUrl;
        } else if (this.fromPic === 4) {
          this.form.subjectImgUrls[this.tempIndex] = dataUrl;
        } else {
          this.form.originalImgUrls[this.tempIndex] = dataUrl;
        }
      }

      this.imgSrc = "";
    },
    reset() {
      if (this.cropper) {
        this.cropper.reset();
      }
    },
    rotate(degrees) {
      if (this.cropper) {
        this.cropper.rotate(degrees);
      }
    },
    scale(scaleX, scaleY) {
      if (this.cropper) {
        this.cropper.scale(scaleX, scaleY || scaleX);
      }
    },

    logout() {
      this.batchAdd = false;
      if (this.currentView == "readingCard") {
        this.stopReadingCards();
        this.stopReading();
        this.switchView("cardList");
        return;
      }
      if (this.currentView != "home") {
        this.resetForm();
        this.stopReadingCards();
        this.stopReading();
        this.isFilterOpen = false;
        this.showTestFilterPanel = false;
        this.isQuestionTypeSummaryFilterOpen = false;
        this.switchView("home");
        this.fromPage = "";
        this.selectedDate = "";
        return;
      }
      this.editAnswer = 0;
      this.isEditingSubjectSummary = false;
      this.isEditing = false;
      this.isEditingTask = false;
      auth.logout();
    },
    async splitImagesToNewQuestions() {
      if (this.isSplitting) return;
      if (!this.form.user?.trim() || !this.form.subject?.trim()) {
        alert("用户名、科目为必填项！");
        return;
      }
      this.isSplitting = true;

      try {
        console.log(
          "开始拆分图片，图片数量：",
          this.form.originalImgUrls.length
        );
        const currentMaxId =
          this.mistaker.length > 0
            ? Math.max(...this.mistaker.map((item) => item.id))
            : 0;
        const baseData = {
          addDate: this.form.addDate,
          user: this.form.user?.trim() || "",
          subject: this.form.subject?.trim() || "",
        };
        for (let i = 0; i < this.form.originalImgUrls.length; i++) {
          const newId = currentMaxId + i + 1;
          console.log(`正在处理第 ${i + 1} 张图片，新ID：`, newId);
          if (i === 0) {
            this.updateTList();
          }
          const newError = {
            id: newId,
            ...baseData,
            subClass: i === 0 ? this.form.subClass?.trim() || "" : "",
            questionType: i === 0 ? this.form.questionType?.trim() || "" : "",
            errorReasonImgUrls:
              i === 0 ? [...(this.form.errorReasonImgUrls || [])] : [],
            trap: i === 0 ? this.form.trap?.trim() || "" : "",
            trapDetail: i === 0 ? this.form.trapDetail?.trim() || "" : "",
            originalText:
              i === 0
                ? this.form.originalText?.trim() || ""
                : `试卷错题 ${i + 1}`,
            originalImgUrls: [this.form.originalImgUrls[i]],
            errorType: i === 0 ? this.form.errorType?.trim() || "" : "",
            errorReason: i === 0 ? this.form.errorReason?.trim() || "" : "",
            question: i === 0 ? this.form.question?.trim() || "" : "",
            answer: i === 0 ? this.form.answer?.trim() || "" : "",
            correctIdea: i === 0 ? this.form.correctIdea?.trim() || "" : "",
            improveMethod: i === 0 ? this.form.improveMethod?.trim() || "" : "",
            similarText: i === 0 ? this.form.similarText?.trim() || "" : "",
            similarImgUrls:
              i === 0 ? [...(this.form.similarImgUrls || [])] : [],
            importantLevel: i === 0 ? this.form.importantLevel || 0 : 0,
          };
          console.log(`第 ${i + 1} 道错题数据：`, newError);
          if (!newError.user || !newError.subject) {
            throw new Error(`第 ${i + 1} 道错题缺少必要字段：用户或科目`);
          }
          this.mistaker.push(newError);
          console.log(`第 ${i + 1} 道错题添加成功`);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log("拆分完成，总错题数：", this.mistaker.length);
        alert(`成功拆分为 ${this.form.originalImgUrls.length} 道错题！`);
        this.resetForm();
        this.switchView("home");
      } catch (error) {
        console.error("拆分图片失败详情：", error);
        if (error.message.includes("缺少必要字段")) {
          alert(`拆分失败：${error.message}`);
        } else {
          alert(`拆分失败，请重试！错误详情：${error.message}`);
        }
        const originalLength =
          this.mistaker.length - this.form.originalImgUrls.length;
        this.mistaker = this.mistaker.slice(0, Math.max(0, originalLength));
      } finally {
        this.isSplitting = false;
        console.log("拆分操作结束，isSplitting状态：", this.isSplitting);
      }
    },

    editSimilarItem(item) {
      this.fromPage = "1";
      this.editError(item);
    },

    deleteSimilarItem(id) {
      this.deleteError(id);
      const index = this.selectedSimilarIds.indexOf(id);
      if (index > -1) {
        this.selectedSimilarIds.splice(index, 1);
      }
    },

    formatDateWithWeek(dateString) {
      const date = new Date(dateString);
      const weekdays = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const weekDay = weekdays[date.getDay()];
      return `${dateString} ${weekDay}`;
    },

    startReading(index) {
      if (this.isReading) {
        this.stopReading();
      }

      this.isReading = true;
      this.currentReadingIndex = index;
      this.readItem(index);
    },

    readItem(index) {
      if (index < 0 || index >= this.showMistaker.length) {
        this.isReading = false;
        this.currentReadingIndex = -1;
        return;
      }

      const item = this.showMistaker[index];
      let textToRead = `题号${item.id}。`;
      textToRead += `${item.user}，${item.subject}。`;
      if (item.originalText) textToRead += `原始错题：${item.originalText}。`;
      if (item.errorType) textToRead += `标签：${item.errorType}。`;
      if (item.question) textToRead += `题卡题目：${item.question}。`;
      if (item.answer) textToRead += `答案：${item.answer}。`;
      if (item.errorReason) textToRead += `错题解析：${item.errorReason}。`;
      if (item.improveMethod)
        textToRead += `本题型提高方法：${item.improveMethod}。`;
      if (item.similarText) textToRead += `举一反三：${item.similarText}。`;
      if (item.correctIdea) textToRead += `解析：${item.correctIdea}。`;
      textToRead = textToRead.replace(/<[^>]*>/g, "");
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "zh-CN";
      utterance.rate = 0.9;
      utterance.onend = () => {
        this.currentReadingIndex++;
        this.readItem(this.currentReadingIndex);
      };
      utterance.onerror = () => {
        this.isReading = false;
        this.currentReadingIndex = -1;
      };
      window.speechSynthesis.speak(utterance);
    },

    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen;
    },

    toggleFilter1(x) {
      let val = this.isAnswerOpen[x] === 1 ? 0 : 1;
      this.$set(this.isAnswerOpen, x, val);
    },

    updateError() {
      const users = this.splitUsers(this.form.user);
      if (
        users.length === 0 ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户、科目、考点、题型为必填项，用以分类题目！");
        return;
      }

      this.updateTList();
      this.updateQList();
      this.updateCList();
      const index = this.mistaker.findIndex(
        (item) => item.id === this.editingId
      );
      if (index !== -1) {
        const firstUser = this.getFirstUser(this.form.user);
        let formData = { ...this.form };
        delete formData.questionTypeSummary;
        delete formData.questionTypeImgUrls;

        this.mistaker.splice(index, 1, {
          ...formData,
          id: this.editingId,
          user: firstUser,
        });
        const otherUsers = this.getOtherUsers(this.form.user);
        if (otherUsers.length > 0) {
          const maxId =
            this.mistaker.length > 0
              ? Math.max(...this.mistaker.map((item) => item.id))
              : 0;

          otherUsers.forEach((user, idx) => {
            const newId = maxId + idx + 1;
            const newError = {
              ...formData,
              id: newId,
              user: user.trim(),
            };
            this.mistaker.push(newError);
          });
        }
        this.tempUser = this.form.user.trim();
        this.tempSubject = this.form.subject.trim();
        this.tempQuestiontype = this.form.questionType.trim();
        this.tempSubClass = this.form.subClass.trim();
        this.isEditing = false;
        alert(
          `成功更新错题！${
            otherUsers.length > 0
              ? `并为其他 ${otherUsers.length} 个用户创建了新题`
              : ""
          }`
        );
        if (this.fromPage == "1") this.switchView("printPaper");
        else if (this.fromPage == "2") this.switchView("test");
        else if (this.fromPage == "4") this.switchView("cardList");
        else if (this.fromPage == "5") {
          this.switchView("home");
          setTimeout(() => {
            this.isEditing = false;
            this.switchView("add");
          }, 100);
        } else this.switchView("list");
        this.resetForm();
        this.fromPage = "";
      }
    },

    updateTList() {
      let tl = this.taskList.find(
        (item) =>
          item.subject === this.form.subject.trim() &&
          item.subClass === this.form.subClass.trim() &&
          item.questionType === this.form.questionType.trim()
      );
      if (tl) {
        if (!this.form.improveMethod?.trim()) {
          const index = this.taskList.findIndex(
            (item) =>
              item.subject === this.form.subject.trim() &&
              item.subClass === this.form.subClass.trim() &&
              item.questionType === this.form.questionType.trim()
          );
          if (index > -1) {
            this.taskList.splice(index, 1);
          }
          return;
        }
        tl.improveMethod = this.form.improveMethod?.trim();
      } else if (
        this.form.subClass.trim() &&
        this.form.subject?.trim() &&
        this.form.questionType?.trim() &&
        this.form.improveMethod?.trim()
      ) {
        const newA = {
          subject: this.form.subject?.trim(),
          subClass: this.form.subClass?.trim(),
          questionType: this.form.questionType?.trim(),
          improveMethod: this.form.improveMethod?.trim(),
          completedToday: false,
          completionHistory: [],
        };
        this.taskList.push(newA);
      }
    },

    updateSList() {
      if (this.isEditingSubjectSummary) {
        let index = this.form.index;
        this.finalSubjectSummary[index].subjectSummary =
          this.form.subjectSummary?.trim() || "";
        this.finalSubjectSummary[index].subjectImgUrls =
          [...this.form.subjectImgUrls] || [];
        this.finalSubjectSummary[index].title = this.form.title?.trim() || "";
        this.isEditingSubjectSummary = false;
      } else {
        const newSubjectSummary = {
          title: this.form.title || "",
          subjectSummary: this.form.subjectSummary?.trim() || "",
          subjectImgUrls: [...this.form.subjectImgUrls] || [],
        };
        this.finalSubjectSummary.push(newSubjectSummary);
      }
      alert("文档汇总已保存！");
      this.closeSubjectSummaryModal();
    },

    updateCList() {
      if (
        this.form.cheatSheet?.replace(/<[^>]*>/g, "").trim() == "" &&
        !/(img|video|audio)/i.test(this.form.cheatSheet || "")
      )
        return;
      const userInput = this.form.user?.trim() || "";

      // 如果用户名包含空格，则分割成多个用户名
      if (userInput.includes(" ")) {
        const userList = userInput
          .split(/\s+/)
          .filter((user) => user.length > 0);

        // 为每个用户名执行保存操作
        userList.forEach((singleUser) => {
          const cs = this.finalCheatSheet.find(
            (item) =>
              item.user === singleUser && item.subject == this.form.subject
          );

          if (cs) {
            cs.cheatSheet = this.form.cheatSheet;
          } else {
            const newItem = {
              subject: this.form.subject?.trim() || "",
              user: singleUser,
              cheatSheet: this.form.cheatSheet || "",
            };
            this.finalCheatSheet.push(newItem);
          }
        });
      } else {
        const cs = this.finalCheatSheet.find(
          (item) => item.user === userInput && item.subject == this.form.subject
        );

        if (cs) {
          cs.cheatSheet = this.form.cheatSheet;
        } else {
          const newItem = {
            subject: this.form.subject?.trim() || "",
            user: userInput,
            cheatSheet: this.form.cheatSheet || "",
          };
          this.finalCheatSheet.push(newItem);
        }
      }

      this.showCSModal = false;
    },

    async compressJsonImagesToWebp(jsonData, quality = 0.8) {
      // 深拷贝原数据，避免修改原对象
      const data = JSON.parse(JSON.stringify(jsonData));

      // 匹配所有 base64 图片的正则
      const base64ImageRegex =
        /data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9+/=]+/g;

      // 递归遍历 JSON 所有字段，替换图片............................
      async function traverseAndReplace(obj) {
        if (!obj || typeof obj !== "object") return obj;

        for (const key in obj) {
          const value = obj[key];

          if (typeof value === "string") {
            const matches = value.match(base64ImageRegex) || [];
            for (const base64 of matches) {
              try {
                const webpBase64 = await base64ToWebp(base64, quality);
                obj[key] = obj[key].replace(base64, webpBase64);
              } catch (e) {
                console.warn("图片压缩失败:", e);
              }
            }
          } else if (typeof value === "object") {
            await traverseAndReplace(value);
          }
        }
        return obj;
      }
      function base64ToWebp(base64, quality) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const webpBase64 = canvas.toDataURL("image/webp", quality);
            resolve(webpBase64);
          };

          img.onerror = reject;
          img.src = base64;
        });
      }

      return await traverseAndReplace(data);
    },

    updateQList() {
      if (
        this.form.questionTypeSummary?.replace(/<[^>]*>/g, "").trim() == "" &&
        !/(img|video|audio)/i.test(this.form.questionTypeSummary || "") &&
        this.form.questionTypeImgUrls?.length == 0
      ) {
        const index = this.finalQuestionTypeSummary.findIndex(
          (i) =>
            i.subject === this.form.subject?.trim() &&
            i.subClass === this.form.subClass?.trim() &&
            i.questionType === this.form.questionType?.trim()
        );
        if (index > -1) {
          this.finalQuestionTypeSummary.splice(index, 1);
        }
        return;
      }

      if (
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户名、科目、考点、题型为必填项，用以归纳汇总！");
        return;
      }
      const userArray = this.form.user
        .trim()
        .split(/\s+/)
        .filter((user) => user.trim());

      if (userArray.length === 0) {
        alert("用户名不能为空！");
        return;
      }

      if (this.isEditing && this.showQuestionTypeSummaryModal) {
        const isTItemInNewUsers = userArray.some(
          () =>
            this.form.subject?.trim() === this.tItem.subject &&
            this.form.subClass?.trim() === this.tItem.subClass &&
            this.form.questionType?.trim() === this.tItem.questionType
        );

        if (!isTItemInNewUsers) {
          const index = this.finalQuestionTypeSummary.findIndex(
            (item) => item === this.tItem
          );
          if (index > -1) {
            this.finalQuestionTypeSummary.splice(index, 1);
          }
        }
      }
      userArray.forEach(() => {
        let qs = this.finalQuestionTypeSummary.find(
          (item) =>
            item.subject === this.form.subject.trim() &&
            item.subClass === this.form.subClass.trim() &&
            item.questionType === this.form.questionType.trim()
        );

        if (qs) {
          qs.dIndex = Date.now();
          qs.questionTypeSummary = this.form.questionTypeSummary?.trim() || "";
          qs.questionTypeImgUrls = [...(this.form.questionTypeImgUrls || [])];
        } else {
          const newA = {
            dIndex: Date.now(),
            subject: this.form.subject.trim(),
            subClass: this.form.subClass.trim(),
            questionType: this.form.questionType.trim(),
            questionTypeSummary: this.form.questionTypeSummary?.trim() || "",
            questionTypeImgUrls: [...(this.form.questionTypeImgUrls || [])],
            importantLevel: 0,
          };
          this.finalQuestionTypeSummary.push(newA);
        }
      });
      if (this.isEditing) this.switchView("questionTypeSummary");
      else this.switchView("home");

      if (this.isEditing) {
        this.isEditing = false;
      }
    },

    switchView(view) {
      if (view !== "readingCard" && this.isReadingCard) this.stopReadingCards();
      if (this.currentView == "questionTypeSummary" && view == "add")
        this.showQuestionTypeSummaryModal = true;
      else this.showQuestionTypeSummaryModal = false;
      this.currentView = view;
      if (view === "add") {
        if (!this.isEditing) {
          this.selectedDate = new Date().toLocaleDateString("sv-SE");
          this.resetForm();
        }
      } else if (view === "list") {
        this.editingCorrectIdeaIds = {};
        this.isAllExpanded = true;
        this.$nextTick(() => {
          const savedScrollRaw = window.localStorage.getItem(
            "mistakebook_list_scroll"
          );
          if (savedScrollRaw) {
            const restoreScroll = () => {
              let scrollData;
              try {
                scrollData = JSON.parse(savedScrollRaw);
              } catch {
                return;
              }
              if (scrollData.questionId) {
                const targetEl = document.querySelector(
                  `.error-item[data-id="${scrollData.questionId}"]`
                );
                if (targetEl) {
                  targetEl.scrollIntoView({
                    behavior: "instant",
                    block: "start",
                  });
                  const emToPx =
                    parseFloat(
                      getComputedStyle(document.documentElement).fontSize
                    ) * 4.2;
                  window.scrollBy({
                    top: -emToPx,
                    behavior: "instant",
                  });
                }
              }
            };
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  restoreScroll();
                });
              });
            });
          }
          window.localStorage.removeItem("mistakebook_list_scroll");
        });
      } else if (view === "subjectSummary") {
        this.collapseAllSubjectSummaries();
      }
    },
    showSetting() {
      this.showSettingModal = true;
    },
    previewImg(type, e) {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith("image/")) {
          alert("请选择图片文件！");
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (type === "original") {
            this.form.originalImgUrls.push(ev.target.result);
          } else if (type === "similar") {
            this.form.similarImgUrls.push(ev.target.result);
          } else if (type === "questionType") {
            this.form.questionTypeImgUrls.push(ev.target.result);
          } else if (type === "errorReason") {
            this.form.errorReasonImgUrls.push(ev.target.result);
          } else if (type === "subject") {
            this.form.subjectImgUrls.push(ev.target.result);
          }
        };
        reader.readAsDataURL(file);
      });

      e.target.value = "";
    },

    switchFav(item, x) {
      const datePart = String(item.reviewDate).split(",")[0];
      const statusPart = String(item.reviewDate).split(",")[1];

      if (!statusPart || Number(statusPart) == 0) {
        this.$set(item, "reviewDate", datePart + ",1");
      } else {
        this.$set(item, "reviewDate", datePart + ",0");
      }

      if (x == 1) {
        this.editingId = item.id;
        const index = this.mistaker.findIndex(
          (item) => item.id === this.editingId
        );
        if (index !== -1) this.mistaker[index].reviewDate = item.reviewDate;
      }
    },

    switchFav1(item) {
      const datePart = String(item.reviewDate).split(",")[0];
      const statusPart = String(item.reviewDate).split(",")[1];

      if (!statusPart || Number(statusPart) == 0) {
        this.$set(item, "reviewDate", datePart + ",1");
      } else {
        this.$set(item, "reviewDate", datePart + ",0");
      }
    },

    selectAllSimilar() {
      this.selectedSimilarIds = this.filteredSimilarItems.map(
        (item) => item.id
      );
    },
    deselectAllSimilar() {
      this.selectedSimilarIds = [];
    },
    generatePaper() {
      if (this.selectedSimilarIds.length === 0) {
        alert("请至少选择一道题目！");
        return;
      }
      this.selectedSimilarItems = this.mistaker.filter((item) =>
        this.selectedSimilarIds.includes(item.id)
      );

      this.showPaperPreview = true;
    },
    closePaperPreview() {
      this.showPaperPreview = false;
    },
    printPaper() {
      const printWindow = window.open("", "_blank");
      const paperContent = document.getElementById("paperContent").innerHTML;

      const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>错题举一反三练习卷</title>
        <meta charset="utf-8">
        <style>
          @media print {
            @page {
              size: A4 portrait;
              margin: 1cm;
            }
            
            body {
              font-family: 'SimSun', serif;
              font-size: 12pt;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            
            .paper-container {
              width: 100%;
              column-count: 1;
            }
            
            .question-item {
              break-inside: avoid;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            
            .question-number {
              font-weight: bold;
              display: inline;
              margin-right: 5px;
            }
            
            .question-content {
              display: inline;
            }
            
            .question-text {
              display: inline;
            }
            
            .question-images {
              margin: 10px 0;
            }
            
            .question-img {
              max-width: 100%;
              height: auto;
              display: block;
            }
            
            .answer-space {
              margin-top: 10px;
            }
            
            .answer-lines {
              border-bottom: 1px solid #000;
              margin-top: 5px;
              min-height: 20px;
            }
            
            h2 {
              text-align: center;
              column-span: all;
            }
            
            .paper-meta {
              text-align: center;
              column-span: all;
              margin-bottom: 20px;
            }
          }
          
          @media screen {
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            
            .paper-container {
              width: 21cm;
              margin: 0 auto;
              column-count: 1;
            }
            
            .question-item {
              break-inside: avoid;
              margin-bottom: 20px;
            }
            
            .question-img {
              max-width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="paper-container">
          ${paperContent}
        </div>
      </body>
      </html>
    `;

      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    },
    handleCardImageClick(event, allowOpen = true) {
      if (event.target.tagName !== "IMG") return;
      this.cardImageClickCount++;
      if (this.cardImageClickCount === 1) {
        this.cardImageClickTimer = setTimeout(() => {
          this.cardImageClickCount = 0;
          if (allowOpen) {
            event.stopPropagation();
            this.openImageViewer(event.target.src);
          }
        }, 300);
      } else if (this.cardImageClickCount === 2) {
        clearTimeout(this.cardImageClickTimer);
        this.cardImageClickCount = 0;
        // 双击时什么也不做，事件自然传递到上一层
      }
    },
    deleteImg(type, index) {
      if (type === "original") {
        this.form.originalImgUrls.splice(index, 1);
      } else if (type === "similar") {
        this.form.similarImgUrls.splice(index, 1);
      } else if (type === "questionType") {
        this.form.questionTypeImgUrls.splice(index, 1);
      } else if (type === "errorReason") {
        this.form.errorReasonImgUrls.splice(index, 1);
      } else if (type === "subject") {
        this.form.subjectImgUrls.splice(index, 1);
      }
    },
    resetForm() {
      this.form = {
        addDate: this.selectedDate,
        user: this.tempUser,
        subject: this.tempSubject,
        subClass: this.tempSubClass,
        originalText: "",
        originalImgUrls: [],
        question: "",
        answer: "",
        questionTypeImgUrls: [],
        errorReasonImgUrls: [],
        errorType: "",
        errorReason: "",
        questionType: this.tempQuestiontype,
        questionTypeSummary: "",
        trap: "",
        trapDetail: "",
        reviewDate: "0,0",
        correctIdea: "",
        improveMethod: "",
        similarText: "",
        similarImgUrls: [],
        importantLevel: 0,
      };
    },
    appendCandidate(field, value) {
      this.$set(this.form, field, value);
    },
    appendCandidate1(field, value) {
      this.$set(this.form, field, this.form[field] + " " + value);
    },
    append1(field, value) {
      this.filterForm[field] = value;
      this.$set(this.filterForm, field, value);
    },

    append2(field, value) {
      this.$set(this.testFilterForm, field, value);
    },

    closeCrop() {
      this.imgSrc = "";
    },
    saveError() {
      const users = this.splitUsers(this.form.user);
      if (
        users.length === 0 ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户、科目、考点、题型为必填项，用以分类题目！");
        return;
      }

      if (
        this.form.originalText?.replace(/<[^>]*>/g, "").trim() === "" &&
        !/(img|video|audio)/i.test(this.form.originalText || "") &&
        this.form.question?.replace(/<[^>]*>/g, "").trim() === "" &&
        !/(img|video|audio)/i.test(this.form.question || "")
      ) {
        alert("'原始错题'或'题卡题目'须至少填写一项。");
        return;
      }

      const index = this.mistaker.findIndex(
        (item) =>
          item.user === this.form.user &&
          item.question.replace(/<[^>]*>/g, "").trim() != "" &&
          item.question.replace(/<[^>]*>/g, "").trim() ===
            this.form.question.replace(/<[^>]*>/g, "").trim()
      );
      if (index !== -1) {
        const a = this.mistaker[index].id;
        if (
          !confirm(
            `在同一用户下，存在相同的题卡题目，题号为：${a}。点击'确定'将继续保存，点击'取消'将放弃保存。`
          )
        ) {
          return;
        }
      }

      try {
        this.updateTList();
        this.updateQList();
        this.updateCList();
        const maxId =
          this.mistaker.length > 0
            ? Math.max(...this.mistaker.map((item) => item.id))
            : 0;
        users.forEach((user, index) => {
          const newId = maxId + index + 1;
          const newError = {
            id: newId,
            addDate: this.form.addDate,
            user: user.trim(),
            subject: this.form.subject.trim(),
            subClass: this.form.subClass.trim(),
            questionType: this.form.questionType.trim(),
            trap: this.form.trap?.trim() || "",
            trapDetail: this.form.trapDetail?.trim() || "",
            originalText: this.form.originalText.trim(),
            originalImgUrls: [...this.form.originalImgUrls],
            question: this.form.question.trim(),
            answer: this.form.answer.trim(),
            reviewDate: this.form.reviewDate,
            reviewResult: [],
            reviewResult1: [],
            errorType: this.form.errorType.trim(),
            errorReason: this.form.errorReason.trim(),
            errorReasonImgUrls: [...this.form.errorReasonImgUrls],
            correctIdea: this.form.correctIdea.trim(),
            improveMethod: this.form.improveMethod?.trim(),
            similarText: this.form.similarText.trim(),
            similarImgUrls: [...this.form.similarImgUrls],
            importantLevel: this.form.importantLevel,
          };
          this.mistaker.push(newError);
        });

        this.tempUser = this.form.user.trim();
        this.tempSubject = this.form.subject.trim();
        this.tempQuestiontype = this.form.questionType.trim();
        this.tempSubClass = this.form.subClass.trim();

        this.switchView("home");
        if (users.length == 1) alert(`保存成功！请添加下一题...`);
        else alert(`成功为 ${users.length} 个用户保存错题！`);
        setTimeout(() => {
          this.isEditing = false;
          this.switchView("add");
        }, 100);
      } catch (error) {
        console.error("保存错题失败：", error);
        alert("保存错题失败，请检查输入内容！");
      }
    },
    expandCard() {
      this.sections = {
        mistakeItem: false,
        questionCard: true,
        questionTypeSum: false,
        improveMethod: false,
        similar: false,
        trap: false,
        cheatsheet: false,
        answerAnalysis: false,
        analysis: false,
        marks: false,
      };
    },
    expandMistaker() {
      this.sections = {
        mistakeItem: true,
        questionCard: false,
        questionTypeSum: false,
        improveMethod: false,
        similar: false,
        trap: false,
        cheatsheet: false,
        answerAnalysis: false,
        analysis: false,
        marks: false,
      };
    },

    editError(item, x) {
      if (x == 1) {
        this.fromPage = 4;
        this.expandCard();
      }
      if (x == 5) {
        this.fromPage = 5;
      }
      if (x == 2) {
        this.expandMistaker();
        const scrollData = {
          questionId: item.id,
        };
        window.localStorage.setItem(
          "mistakebook_list_scroll",
          JSON.stringify(scrollData)
        );
      }
      this.isEditing = true;
      this.editingId = item.id;
      this.selectedDate = item.addDate;
      this.showQuestionTypeSummaryModal = false;
      this.form = {
        addDate: item.addDate,
        user: item.user,
        subject: item.subject,
        subClass: item.subClass,
        originalText: item.originalText,
        originalImgUrls: [...item.originalImgUrls],
        question: item.question,
        answer: item.answer,
        errorType: item.errorType,
        questionType: item.questionType || "",
        questionTypeSummary:
          this.finalQuestionTypeSummary.find(
            (i) =>
              i.subject === item.subject?.trim() &&
              i.subClass === item.subClass?.trim() &&
              i.questionType === item.questionType?.trim()
          )?.questionTypeSummary || "",
        questionTypeImgUrls:
          this.finalQuestionTypeSummary.find(
            (i) =>
              i.subject === item.subject?.trim() &&
              i.subClass === item.subClass?.trim() &&
              i.questionType === item.questionType?.trim()
          )?.questionTypeImgUrls || [],
        trap: item.trap || "",
        trapDetail: item.trapDetail || "",
        reviewDate: item.reviewDate || "0,0",
        reviewResult: item.reviewResult || [],
        reviewResult1: item.reviewResult1 || [],
        errorReason: item.errorReason,
        errorReasonImgUrls: [...(item.errorReasonImgUrls || [])],
        correctIdea: item.correctIdea,
        improveMethod: item.improveMethod,
        similarText: item.similarText,
        similarImgUrls: [...item.similarImgUrls],
        importantLevel: item.importantLevel,
      };
      this.switchView("add");
    },
    deleteError(id) {
      if (
        !confirm(
          "确定要删除这道错题吗？此操作不可恢复！注意：删除后其他错题题号不会重排。"
        )
      ) {
        return;
      }

      try {
        const index = this.mistaker.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.mistaker.splice(index, 1);
        }
        const filterIndex = this.filteredMistaker.findIndex(
          (item) => item.id === id
        );
        if (filterIndex !== -1) {
          this.filteredMistaker.splice(filterIndex, 1);
        }
        if (this.currentView == "test") this.startTest();
        alert(`题号为${id}的错题删除成功！`);
        this.showItem = null;
      } catch (error) {
        console.error("删除错题失败：", error);
        alert("删除错题失败，请重试！");
      }
    },
    handleFilter() {
      this.filteredMistaker = [];
      this.filterErrors();
    },

    printCurrentTreeList() {
      if (this.currentTreeMistaker.length === 0) {
        alert("当前列表为空，无法打印。");
        return;
      }

      let printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>错题本打印 - ${this.currentTreeTitle}</title>
      <style>
        body { font-family: SimSun, serif; line-height: 1.6; padding: 20px; }
        h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .question { border: 1px solid #eee; margin-bottom: 20px; padding: 15px; }
        .meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .meta span { margin-right: 15px; }
        .q-title { font-weight: bold; color: #c00; }
        .answer { background-color: #f9f9f9; padding: 10px; margin-top: 10px; }
        .correct-idea { color: #090; font-style: italic; margin-top: 10px; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${this.currentTreeTitle} (共 ${this.currentTreeMistaker.length} 题)</h1>
  `;

      this.currentTreeMistaker.forEach((item, index) => {
        printContent += `
      <div class="question">
        <div class="meta">
          <span>序号: ${index + 1}</span>
          <span>题号: ${item.id}</span>
          <span>用户: ${item.user}</span>
          <span>科目: ${item.subject}</span>
          <span>日期: ${this.formatDateWithWeek(item.addDate)}</span>
        </div>
        <div class="q-title">题目 ${index + 1}：</div>
        <div v-if="!(item.originalText?.replace(/<[^>]*>/g, '').trim() === '' && !/(img)/i.test(item.originalText || ''))" class="question-content">
          <strong>原始错题：</strong>
          <div>
            ${item.originalText}
          </div>
        </div>
        <div v-if="!(item.question?.replace(/<[^>]*>/g, '').trim() === '' && !/(img)/i.test(item.question || ''))" class="question-content">
          <strong>题卡题目：</strong>
          <div>${item.question}</div>
        </div>
        <div v-if="!(item.answer?.replace(/<[^>]*>/g, '').trim() === '' && !/(img)/i.test(item.answer || ''))" class="question-content">
          <strong>答案：</strong>
          <div>${item.answer}</div>
        </div>
        <div v-if="!(item.correctIdea?.replace(/<[^>]*>/g, '').trim() === '' && !/(img)/i.test(item.correctIdea || ''))" class="question-content">
          <strong>解析：</strong>
          <div>${item.correctIdea}</div>
        </div>
      </div>
    `;
      });

      printContent += `
      <div class="no-print" style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #999;">
        由 PDJ错题本 生成
      </div>
    </body>
    </html>
  `;

      const printWindow = window.open("", "_blank");
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    },

    openQuestionEditor(index, x) {
      this.currentEditingTestIndex = index;
      this.editAnswer = x;
      let iTem = null;
      if (x < 10) iTem = this.filteredTestMistaker[index];
      else if (x < 30)
        iTem = this.mistaker.find(
          (item) => item.id === this.currentEditingTestIndex
        );
      else if (x > 50) iTem = index;

      if (x == 2 || x == 12 || x == 52) {
        this.editingQuestionContent = iTem?.answer || "";
      } else if (x == 3 || x == 13 || x == 53) {
        this.editingQuestionContent = iTem?.correctIdea || "";
      } else if (x == 4 || x == 14 || x == 54) {
        this.editingQuestionContent = iTem?.question || "";
      } else if (x == 31 || x == 32 || x == 33) {
        this.editingQuestionContent = index || "";
      } else this.editingQuestionContent = iTem?.originalText || "";
      this.showQuestionEditor = true;
      this.$nextTick(() => {
        if (this.editorQuestion) {
          this.editorQuestion.destroy();
        }
      });
    },
    saveQuestionEditor() {
      if (this.editAnswer == 31) {
        this.dtEditingContent = this.editingQuestionContent;
        this.dtSaveEdit();
        this.closeQuestionEditor();
        return;
      } else if (this.editAnswer == 32) {
        this.dtEditingDescription = this.editingQuestionContent;
        this.dtSaveDescription();
        this.closeQuestionEditor();
        return;
      } else if (this.editAnswer == 33) {
        this.dtEditingContent = this.editingQuestionContent;
        if (this.dtNoteNode) {
          this.dtNoteNode.content = this.dtEditingContent;
          if (
            this.dtIsQuizMode &&
            this.dtQuizCurrentNode &&
            this.dtQuizCurrentNode.quizType === "note" &&
            this.dtQuizCurrentNode.node.id === this.dtNoteNode.id
          ) {
            this.$set(
              this.dtQuizNodes[this.dtQuizCurrentIndex],
              "content",
              this.dtNoteNode.content
            );
            this.dtAllBlankAnswers = this.dtGetAllBlankAnswers();
            if (this.dtQuizCurrentNode.displayType === "choice") {
              const newOptions = this.dtGetChoiceOptions(
                this.dtQuizNodes[this.dtQuizCurrentIndex]
              );
              this.$set(
                this.dtQuizNodes[this.dtQuizCurrentIndex],
                "options",
                newOptions
              );
              if (this.dtQuizUserAnswers[this.dtQuizCurrentNode.quizId]) {
                this.$delete(
                  this.dtQuizUserAnswers,
                  this.dtQuizCurrentNode.quizId
                );
              }
            }
          }
          this.dtSaveCurrentMindMap();
        }
        this.closeQuestionEditor();
        return;
      } else if (this.editAnswer == 52)
        this.showItem.answer = this.editingQuestionContent;
      else if (this.editAnswer == 53)
        this.showItem.correctIdea = this.editingQuestionContent;
      else if (this.editAnswer == 54)
        this.showItem.question = this.editingQuestionContent;
      else if (this.editAnswer == 55)
        this.showItem.originalText = this.editingQuestionContent;
      else if (this.currentEditingTestIndex !== -1) {
        let originalQuestion = null;
        if (this.editAnswer < 10)
          originalQuestion = this.mistaker.find(
            (item) =>
              item.id ===
              this.filteredTestMistaker[this.currentEditingTestIndex].id
          );
        else
          originalQuestion = this.mistaker.find(
            (item) => item.id === this.currentEditingTestIndex
          );
        if (originalQuestion) {
          if (this.editAnswer == 2 || this.editAnswer == 12)
            originalQuestion.answer = this.editingQuestionContent;
          else if (this.editAnswer == 3 || this.editAnswer == 13)
            originalQuestion.correctIdea = this.editingQuestionContent;
          else if (this.editAnswer == 4 || this.editAnswer == 14)
            originalQuestion.question = this.editingQuestionContent;
          else originalQuestion.originalText = this.editingQuestionContent;
        }
      }
      this.closeQuestionEditor();
      const t = this.excludedKeyWord;
      this.excludedKeyWord = "。！。！。！。!。!。!。";
      setTimeout(() => {
        this.excludedKeyWord = t;
      }, 100);
    },
    closeQuestionEditor() {
      if (this.editAnswer == 31) {
        this.dtCancelEdit();
      } else if (this.editAnswer == 32) {
        this.dtCancelDescriptionEdit();
      } else if (this.editAnswer == 33) {
        this.dtCancelEdit();
      }
      this.editAnswer = 0;
      this.showQuestionEditor = false;
      this.currentEditingTestIndex = -1;
      this.editingQuestionContent = "";

      if (this.editorQuestion) {
        this.editorQuestion.destroy();
        this.editorQuestion = null;
      }
    },
    onCreatedQuestionEditor(editor) {
      this.editorQuestion = Object.seal(editor);
    },
    filterErrors() {
      try {
        let result = [...this.mistaker];
        if (this.filterForm.id && this.filterForm.id > 0) {
          const targetId = Number(this.filterForm.id);
          result = result.filter((item) => item.id === targetId);
        }
        const userKeyword = this.filterForm.user.trim().toLowerCase();
        if (userKeyword) {
          result = result.filter((item) =>
            item.user.toLowerCase().includes(userKeyword)
          );
        }
        if (this.filterForm.startDate || this.filterForm.endDate) {
          result = result.filter((item) => {
            const itemDateArr = item.addDate?.split("-");
            const itemTimestamp = new Date(
              itemDateArr[0],
              itemDateArr[1] - 1,
              itemDateArr[2]
            ).getTime();
            const startTimestamp = this.filterForm.startDate
              ? new Date(this.filterForm.startDate).getTime()
              : 0;
            const endTimestamp = this.filterForm.endDate
              ? new Date(this.filterForm.endDate).getTime() + 86400000 - 1
              : Date.now();
            return (
              itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp
            );
          });
        }
        const subjectKeyword = this.filterForm.subject.trim().toLowerCase();
        if (subjectKeyword) {
          result = result.filter((item) =>
            item.subject.toLowerCase().includes(subjectKeyword)
          );
        }

        if (this.filterForm.fav) {
          result = result.filter((item) => {
            const statusPart = String(item.reviewDate).split(",")[1];
            if (statusPart && Number(statusPart) == 1) {
              return true;
            } else {
              return false;
            }
          });
        }

        const keywordStr = this.filterForm.keyword.trim().toLowerCase();
        if (keywordStr) {
          const keywords = keywordStr?.split(/\s+/).filter(Boolean);

          if (keywords.length > 0) {
            result = result.filter((item) => {
              const searchText = [
                item.originalText || "",
                item.question || "",
                item.answer || "",
                item.errorReason || "",
                item.similarText || "",
                item.trap || "",
                item.correctIdea || "",
                item.improveMethod || "",
                item.subClass || "",
                item.questionType || "",
                item.errorType || "",
              ]
                .join(" ")
                .toLowerCase();
              return keywords.every((keyword) => searchText.includes(keyword));
            });
          }
        }

        if (this.excludedKeyWord.trim()) {
          const exKeyword = this.excludedKeyWord.trim().toLowerCase();
          result = result.filter((item) => {
            const searchText1 = [
              item.question || "",
              item.answer || "",
              item.correctIdea || "",
              item.subClass || "",
              item.questionType || "",
            ]
              .join(" ")
              .toLowerCase();
            return !(searchText1 || "").includes(exKeyword);
          });
        }

        this.filteredMistaker = result;
      } catch (error) {
        console.error("筛选错题失败：", error);
      }
    },

    toggleCheatSheetGroup(groupKey) {
      this.$set(
        this.cheatSheetExpanded,
        groupKey,
        !this.cheatSheetExpanded[groupKey]
      );
    },

    isCheatSheetGroupCollapsed(groupKey) {
      return this.cheatSheetExpanded[groupKey] === true;
    },

    toggleCheatSheetExpandAll() {
      this.isAllCheatSheetExpanded = !this.isAllCheatSheetExpanded;

      this.groupedCheatSheets.forEach((group) => {
        this.$set(
          this.cheatSheetExpanded,
          group.key,
          !this.isAllCheatSheetExpanded
        );
      });
    },

    editCheatSheetItem(item) {
      this.isEditingCheatSheet = true;
      this.editingCheatSheetIndex = this.finalCheatSheet.findIndex(
        (cs) =>
          cs.user === item.user &&
          cs.subject === item.subject &&
          cs.cheatSheet === item.cheatSheet
      );
      this.cheatSheetForm = { ...item };
      this.showCheatSheetModal = true;
    },

    deleteCheatSheetItem(item) {
      if (!confirm("确定要删除这条CheatSheet吗？此操作不可恢复！")) {
        return;
      }
      const index = this.finalCheatSheet.findIndex(
        (cs) =>
          cs.user === item.user &&
          cs.subject === item.subject &&
          cs.cheatSheet === item.cheatSheet
      );

      if (index !== -1) {
        this.finalCheatSheet.splice(index, 1);
        alert("删除成功！");
      }
    },

    saveCheatSheet() {
      if (
        !this.cheatSheetForm.user?.trim() ||
        !this.cheatSheetForm.subject?.trim()
      ) {
        alert("用户和科目为必填项！");
        return;
      }

      let newCheatSheets = [...this.finalCheatSheet];

      if (this.isEditingCheatSheet && this.editingCheatSheetIndex !== -1) {
        newCheatSheets[this.editingCheatSheetIndex] = {
          ...this.cheatSheetForm,
        };
      } else if (this.isEditingCheatSheet) {
        const index = newCheatSheets.findIndex(
          (cs) =>
            cs.user === this.cheatSheetForm.user &&
            cs.subject === this.cheatSheetForm.subject
        );
        if (index !== -1) {
          newCheatSheets[index] = { ...this.cheatSheetForm };
        } else {
          newCheatSheets.push({ ...this.cheatSheetForm });
        }
      } else {
        newCheatSheets.push({ ...this.cheatSheetForm });
      }
      this.finalCheatSheet = newCheatSheets;

      this.closeCheatSheetModal();
      alert("保存成功！");
    },

    closeCheatSheetModal() {
      this.showCheatSheetModal = false;
      this.isEditingCheatSheet = false;
      this.editingCheatSheetIndex = -1;
      this.editingCheatSheetItemIndex = -1;
    },

    onCreatedCheatSheet(editor) {
      this.editorCheatSheet = Object.seal(editor);
    },
    resetFilter() {
      this.filterForm = {
        id: "",
        user: "",
        startDate: "",
        endDate: "",
        subject: "",
        keyword: "",
        fav: false,
        hasCards: true,
        specialIL: false,
        importantLevel: 0,
      };
      this.filteredMistaker = [];
    },

    confirmClearData() {
      if (
        !confirm(
          "⚠️  此操作将永久删除所有错题、题型总结、综合汇总和任务数据等，不可恢复！请在清空前做好备份。并且，若已开启服务器自动同步功能，将会同步清空服务器上的错题本内容！\n\n确定要继续吗？"
        )
      ) {
        return;
      }
      if (
        !confirm("再次确认：您确定要清空此浏览器中当前错题本的所有数据吗？")
      ) {
        return;
      }

      this.clearAllData();
    },
    clearAllData() {
      try {
        this.mistaker = [];
        this.finalQuestionTypeSummary = [];
        this.finalSubjectSummary = [];
        this.finalCheatSheet = [];
        this.taskList = [];
        this.backupFiles = [];
        this.dtMindMaps = [];
        this.testInterval = "0 7 14 30 50 80 120 180";
        this.correctDays = 5;
        this.testTimes = 3;
        this.groupNumber = 10;
        this.excludedKeyWord = "";
        this.filteredMistaker = [];
        this.resetForm();
        this.showSettingModal = false;
        this.switchView("home");

        alert("所有数据已成功清空！");
      } catch (error) {
        console.error("清空数据失败：", error);
        alert("清空数据失败，请重试！");
      }
    },
    saveErrorBook() {
      try {
        const exportData = {
          finalQuestionTypeSummary: this.finalQuestionTypeSummary,
          finalSubjectSummary: this.finalSubjectSummary,
          finalCheatSheet: this.finalCheatSheet,
          mistaker: this.mistaker,
          taskList: this.taskList,
          backupFiles: this.backupFiles,
          dtMindMaps: this.dtMindMaps,
          settings:
            this.testInterval +
            ":::" +
            this.correctDays +
            ":::" +
            this.excludedKeyWord +
            ":::" +
            this.testTimes +
            ":::" +
            this.reverseList +
            ":::" +
            this.groupNumber,
        };
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const now = new Date();
        const fileName = `错题本_${now.getFullYear()}${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
          .getHours()
          .toString()
          .padStart(2, "0")}${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}.json`;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("导出错题本失败：", error);
        alert("导出失败，请重试！");
      }
    },

    async saveToServer(x) {
      if (x == 1) {
        if (
          !confirm("确定将当前错题本内容同步到服务器吗？移动网络请注意流量！")
        )
          return;
        else this.processing = true;
      }

      while (this.isSaving) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 延时1秒再执行
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        this.isSaving = true;
        const exportData = {
          finalQuestionTypeSummary: this.finalQuestionTypeSummary,
          finalSubjectSummary: this.finalSubjectSummary,
          finalCheatSheet: this.finalCheatSheet,
          mistaker: this.mistaker,
          taskList: this.taskList,
          backupFiles: this.backupFiles,
          dtMindMaps: this.dtMindMaps,
          settings:
            this.testInterval +
            ":::" +
            this.correctDays +
            ":::" +
            this.excludedKeyWord +
            ":::" +
            this.testTimes +
            ":::" +
            this.reverseList +
            ":::" +
            this.groupNumber,
        };
        const jsonStr = JSON.stringify(exportData, null, 2);
        await api.post(
          "/files/!PDJ/user-" + this.user.username + "/mistakebook.json",
          jsonStr,
          true
        );
        this.lastModifiedTime = Date.now() + 200;
        await api.post(
          "/files/!PDJ/user-" +
            this.user.username +
            "/Repeater-backup/mbModifiedTime.txt",
          this.lastModifiedTime,
          true
        );
        window.localStorage.setItem(
          this.user.username + "lastSaved",
          this.lastModifiedTime
        );
        this.processing = false;
        this.isSaving = false;
        if (!this.allowSync)
          alert(
            "错题本已成功同步到服务器，位于/!PDJ/user-" +
              this.user.username +
              "/mistakebook.json"
          );
      } catch (error) {
        console.error("导出错题本失败：", error);
        this.processing = false;
        this.isSaving = false;
        alert("错题本同步到服务器失败，请重试！");
      }
    },

    saveToForage() {
      const exportData = {
        finalQuestionTypeSummary: this.finalQuestionTypeSummary,
        finalSubjectSummary: this.finalSubjectSummary,
        finalCheatSheet: this.finalCheatSheet,
        mistaker: this.mistaker,
        taskList: this.taskList,
        backupFiles: this.backupFiles,
        dtMindMaps: this.dtMindMaps,
        settings:
          this.testInterval +
          ":::" +
          this.correctDays +
          ":::" +
          this.excludedKeyWord +
          ":::" +
          this.testTimes +
          ":::" +
          this.reverseList +
          ":::" +
          this.groupNumber,
      };
      const jsonStr = JSON.stringify(exportData, null, 2);
      if (this.allowSync && !this.onOff) {
        this.saveToServer();
      }
      this.onOff = false;
      localforage
        .setItem(this.forageName, jsonStr)
        .then(() => {})
        .catch(() => {});
    },
    convertToPinyin() {
      if (!this.inputText.trim()) {
        this.resultText = "";
        return;
      }

      try {
        const pinyinOptions = {
          tone: "num",
          separator: " ",
        };
        let result = pinyin(this.inputText, pinyinOptions);
        this.resultText = result;
      } catch (error) {
        console.error("拼音转换失败：", error);
        this.resultText = "转换失败，请检查输入内容！";
      }
    },
    copyResult() {
      try {
        const tempInput = document.createElement("input");
        tempInput.value = this.resultText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      } catch (error) {
        console.error("复制失败：", error);
        alert("复制失败，请手动复制！");
      }
      this.showPinYinTool = false;
    },
    clearAll() {
      this.inputText = "";
      this.resultText = "";
    },

    readErrorBook(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        alert("请选择正确的JSON格式错题本文件！");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const importData = JSON.parse(ev.target.result || "{}");
          if (!Array.isArray(importData.mistaker)) {
            throw new Error("数据格式错误！");
          }
          const isValidMistaker = importData.mistaker.every((item) => {
            if (typeof item !== "object" || item === null) return false;
            return (
              Object.prototype.hasOwnProperty.call(item, "id") &&
              Object.prototype.hasOwnProperty.call(item, "addDate") &&
              Object.prototype.hasOwnProperty.call(item, "user") &&
              Object.prototype.hasOwnProperty.call(item, "subject")
            );
          });

          if (!isValidMistaker) {
            throw new Error(
              "错题数据格式错误，缺少核心字段（序号/日期/用户/科目）"
            );
          }

          if (!confirm("导入错题本将覆盖当前错题本所有数据，是否继续？")) {
            e.target.value = "";
            return;
          }
          this.finalQuestionTypeSummary =
            importData.finalQuestionTypeSummary || [];
          this.finalSubjectSummary = importData.finalSubjectSummary || [];
          this.finalCheatSheet = importData.finalCheatSheet || [];
          this.mistaker = importData.mistaker || [];
          this.taskList = importData.taskList || [];
          this.backupFiles = importData.backupFiles || [];
          this.dtMindMaps = importData.dtMindMaps || [];
          this.testInterval =
            importData.settings?.split(":::")[0] || "0 7 14 30 50 80 120 180";
          this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
          this.excludedKeyWord = importData.settings?.split(":::")[2] || "";
          this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
          this.reverseList =
            (importData.settings?.split(":::")[4] ?? "true") === "true";
          this.groupNumber = Number(importData.settings?.split(":::")[5]) || 10;
          this.resetFilter();
          alert(`导入本地错题本成功！共导入 ${this.mistaker.length} 条错题。`);
          e.target.value = "";
          this.showSettingModal = false;
          this.switchView("list");
        } catch (error) {
          console.error("导入错题本失败：", error);
          alert(`导入失败：${error.message}，请检查文件格式！`);
          e.target.value = "";
        }
      };

      reader.readAsText(file, "utf-8");
    },

    async readFromServer(x) {
      if (x == 1) {
        if (
          !confirm(
            "确定从服务器上更新错题本？当前错题本所有数据将被覆盖。移动网络请注意流量！"
          )
        )
          return;
      }
      this.processing = true;
      this.onOff = true;
      try {
        const content = await api.fetch(
          "/files/!PDJ/user-" + this.user.username + "/mistakebook.json"
        );
        let importData;
        if (typeof content.content === "string") {
          importData = JSON.parse(content.content || "{}");
        } else if (
          typeof content.content === "object" &&
          content.content !== null
        ) {
          importData = content.content;
        } else {
          throw new Error("服务器返回数据格式异常");
        }
        if (!Array.isArray(importData.mistaker)) {
          throw new Error("数据格式错误，缺少错题/任务列表/科目详情列表");
        }
        const isValidMistaker = importData.mistaker.every((item) => {
          if (typeof item !== "object" || item === null) return false;
          return (
            Object.prototype.hasOwnProperty.call(item, "id") &&
            Object.prototype.hasOwnProperty.call(item, "addDate") &&
            Object.prototype.hasOwnProperty.call(item, "user") &&
            Object.prototype.hasOwnProperty.call(item, "subject")
          );
        });
        if (!isValidMistaker) {
          throw new Error(
            "错题数据格式错误，缺少核心字段（题号/日期/用户/科目）"
          );
        }
        this.finalQuestionTypeSummary =
          importData.finalQuestionTypeSummary || [];
        this.finalSubjectSummary = importData.finalSubjectSummary || [];
        this.finalCheatSheet = importData.finalCheatSheet || [];
        this.mistaker = importData.mistaker || [];
        this.taskList = importData.taskList || [];
        this.backupFiles = importData.backupFiles || [];
        this.dtMindMaps = importData.dtMindMaps || [];
        this.testInterval =
          importData.settings?.split(":::")[0] || "0 7 14 30 50 80 120 180";
        this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
        this.excludedKeyWord = importData.settings?.split(":::")[2] || "";
        this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
        this.reverseList =
          (importData.settings?.split(":::")[4] ?? "true") === "true";
        this.groupNumber = Number(importData.settings?.split(":::")[5]) || 10;
        this.resetFilter();
        this.processing = false;
        alert(`从服务器导入成功！共导入 ${this.mistaker.length} 条错题。`);
        this.lastModifiedTime = Date.now();
        window.localStorage.setItem(
          this.user.username + "lastSaved",
          this.lastModifiedTime
        );
      } catch (error) {
        this.processing = false;
        alert(`从服务器导入错题本失败：${error.message}！`);
      }
    },

    async readFromForage() {
      let importData1 = {};
      try {
        const value = await localforage.getItem(this.forageName);
        importData1 = JSON.parse(value || "{}");
      } catch (error) {
        console.error("从localforage读取数据失败:", error);
        importData1 = {};
      }
      if (!Array.isArray(importData1.mistaker)) {
        throw new Error("数据格式错误！");
      }
      const isValidMistaker = importData1.mistaker.every((item) => {
        if (typeof item !== "object" || item === null) return false;
        return (
          Object.prototype.hasOwnProperty.call(item, "id") &&
          Object.prototype.hasOwnProperty.call(item, "addDate") &&
          Object.prototype.hasOwnProperty.call(item, "user") &&
          Object.prototype.hasOwnProperty.call(item, "subject")
        );
      });

      if (!isValidMistaker) {
        throw new Error(
          "错题数据格式错误，缺少核心字段（题号/日期/用户/科目）"
        );
      }
      let importData = await this.compressJsonImagesToWebp(importData1);
      this.finalQuestionTypeSummary = importData.finalQuestionTypeSummary || [];
      this.finalSubjectSummary = importData.finalSubjectSummary || [];
      this.finalCheatSheet = importData.finalCheatSheet || [];
      this.mistaker = importData.mistaker || [];
      this.taskList = importData.taskList || [];
      this.backupFiles = importData.backupFiles || [];
      this.dtMindMaps = importData.dtMindMaps || [];
      this.testInterval =
        importData.settings?.split(":::")[0] || "0 7 14 30 50 80 120 180";
      this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
      this.excludedKeyWord = importData.settings?.split(":::")[2] || "";
      this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
      this.reverseList =
        (importData.settings?.split(":::")[4] ?? "true") === "true";
      this.groupNumber = Number(importData.settings?.split(":::")[5]) || 10;
    },
    openImageViewer(url) {
      if (this.showImageViewer) {
        this.closeImageViewer();
        setTimeout(() => {
          this.openImage(url);
        }, 100);
      } else {
        this.openImage(url);
      }
    },

    openImage(url) {
      try {
        this.lightboxImgsFinal = url;
        this.$nextTick(() => {
          this.showImageViewer = true;
        });
      } catch (error) {
        console.error("打开图片失败:", error);
      }
    },

    closeImageViewer() {
      this.showImageViewer = false;
    },
  },
};
</script>

<style scoped>
.filter-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
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
  width: 100%;
  height: 100%;
  padding: 1em;
  border-radius: 10px;
  overflow-y: auto;
  background: #999;
  max-width: 100vw;
  overflow-x: hidden;
  padding: 0 10px;
  box-sizing: border-box;
}

.filter-arrow {
  margin-right: 16px;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.filter-arrow.up {
  transform: rotate(180deg);
}

.main-content {
  width: 100%;
  padding-top: 3px;
  white-space: pre-wrap; /* 关键：保留换行 + 自动换行 */
  word-wrap: break-word;
}

.home-view {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 50px;
}

.home-btn {
  width: 120px;
  height: 60px;
  font-size: 18px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.home-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.add-view {
  background-color: white;
  padding: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  align-items: center;
  font-size: 14px;
}

.checkbox-label input {
  margin-right: 8px;
}

.imgs-preview {
  margin-top: 8px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.img-preview-item {
  position: relative;
  width: 150px;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.img-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.img-delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.img-delete-btn:hover {
  background-color: #e74c3c;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #e9e3e3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.candidate-list {
  width: 100%;
  margin-top: 4px;
  padding: 6px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.candidate-label {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
}

.candidate-item {
  font-size: 12px;
  flex-shrink: 0;
  padding: 2px 8px;
  background-color: #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.candidate-item:hover {
  background-color: #dee2e6;
}

.candidate-item:active {
  background-color: #ced4da;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.star {
  font-size: 20px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star.active {
  color: #e74c3c;
}

.star:hover {
  color: #ff6b6b;
}

.rating-text {
  margin-left: 8px;
  font-size: 14px;
  color: #666;
}

.question-type-summary-view,
.list-view,
.task-view {
  background-color: white;
  padding: 0;
  border-radius: 8px;
}

.filter-section {
  margin: 5px 0;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
  flex: 1;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-item input,
.filter-item select {
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input input {
  width: 60px;
  text-align: center;
}

.range-sep,
.date-sep {
  color: #999;
}

.date-sep {
  margin: 0 8px;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

.filter-btn,
.reset-btn {
  padding: 6px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.filter-btn:hover,
.reset-btn:hover {
  background-color: #2980b9;
}

.error-list,
.task-list {
  margin-top: 0;
}

.error-item,
.task-item {
  background-color: #d4edda;
  padding: 16px;
  border: 1px solid cadetblue;
  border-radius: 4px;
  margin: 6px 0;
}

.task-item:has(.completion-checkbox:checked) {
  border-left: 4px solid #27ae60;
  background-color: #f8fff8;
}

.error-header,
.error-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.error-header {
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 3px solid black;
}

.error-footer {
  justify-content: right;
  padding-top: 8px;
}

.error-id,
.task-id {
  font-weight: bold;
  color: #3498db;
}

.error-date {
  color: #999;
  font-size: 14px;
}

.error-importance {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: right;
}

.importance-label {
  font-size: 14px;
  color: #666;
  flex-shrink: 0;
}

.small-imgs-wrap {
  display: inline-flex;
  gap: 8px;
}

.small-img {
  max-width: 100px;
  max-height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 8px;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  color: #999;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 32px;
  cursor: pointer;
  color: #333;
  background: none;
  border: none;
  padding: 5px;
}

.close-btn:hover {
  color: #111;
}

.image-content .close-btn {
  top: -40px;
  right: 0;
  color: white;
  font-size: 24px;
}

.data-manage-section {
  margin: 20px 0;
  padding: 16px;
  background-color: #999;
  border-radius: 6px;
}

.data-manage-section h5 {
  margin: 0 0 16px 0;
  font-size: 15px;
  color: #333;
}

.setting-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: white;
  width: 100%;
}

.data-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.setting-tip {
  font-size: 12px;
  color: #333;
  margin: 4px 0 0 0;
}

.setting-divider {
  height: 1px;
  background-color: #3498db;
  margin: 16px 0;
}

.image-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  background-color: black;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
}

.image-content {
  width: 90%;
  height: 85vh;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1001;
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
}

.full-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.upload-wrap {
  position: relative;
  display: inline-block;
}

.upload-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #2980b9;
}

.read-btn {
  padding: 4px 8px;
  margin-left: 5px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.read-btn:hover {
  background-color: #45a049;
}

.error-item.reading {
  border: 2px solid #4caf50;
  background-color: #f8fff8;
}

.summary-list {
  margin-top: 20px;
}

.summary-item {
  background-color: #f9f9f9;
  padding: 0px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 16px;
}

.summary-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.question-type-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.question-count {
  margin-left: 10px;
  color: #7f8c8d;
  font-size: 14px;
}

.summary-content {
  margin: 8px 0;
  line-height: 1.5;
}

.summary-text {
  white-space: pre-line;
  margin-top: 4px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #3498db;
}

.error-content p,
.summary-item p {
  margin: 0;
  line-height: 1.5;
}

.error-content p strong {
  color: #333;
}

.error-content p:nth-child(6) {
  color: #e74c3c;
  font-weight: 500;
}

.trap-summary-view {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trap-title {
  font-size: 18px;
  font-weight: bold;
  color: #e74c3c;
}

.trap-summary-view .summary-text {
  background-color: #fff5f5;
  border-left: 3px solid #e74c3c;
}

.split-button-container {
  margin-top: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.split-btn {
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.split-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.split-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
}

.split-tip {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #7f8c8d;
  line-height: 1.4;
}

.custom-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  z-index: 1002;
}

.toolbar-btn {
  padding: 8px 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.toolbar-btn:hover {
  background: #2980b9;
}

:deep(.vel-img) {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

:deep(.vel-btn-close) {
  color: white;
  font-size: 30px;
  top: 20px;
  right: 20px;
}

:deep(.vel-btn-close:hover) {
  color: #ff6b6b;
}

img {
  width: 100%;
  height: 90vh;
  display: block;
}

@media (max-width: 738px) {
  img {
    height: 76vh;
  }

  .settingBoxContainer {
    width: 100%;
  }
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-button input {
  flex: 1;
}

.toggle-summary-btn {
  padding: 6px 8px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-summary-btn:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.toggle-summary-btn .material-icons {
  font-size: 18px;
  color: #666;
}

.subject-summary-view {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.subject-title {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.subject-summary-view .summary-text {
  border-left: 3px solid #3498db;
}

.subject-summary-modal {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.subject-summary-modal .modal-body {
  padding: 16px 0;
}

.subject-summary-modal .file-input {
  width: 100%;
  margin-top: 8px;
}

.subject-summary-modal .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #eee;
}

.subject-group,
.subclass-group,
.questiontype-group {
  margin: 6px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.subject-group {
  margin: 6px 0;
}

.subclass-group {
  border-color: #d0d0d0;
  border-radius: 6px;
}

.questiontype-group {
  border-color: #c0c0c0;
  border-radius: 4px;
}

.group-count {
  color: #666;
  font-size: 0.9em;
}

.group-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.group-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.collapse-icon {
  transition: transform 0.3s ease;
  font-size: 12px;
  color: #666;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.group-content {
  transition: all 0.3s ease;
}

.subject-header {
  background-color: #e3f2fd;
}

.subclass-header {
  background-color: #f3e5f5;
}

.questiontype-header {
  background-color: #e8f5e8;
}

.group-header h4,
.group-header h5,
.group-header h6 {
  margin: 0;
  color: #333;
}

.expand-all-btn {
  padding: 6px 12px;
  background-color: white;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.expand-all-btn:hover {
  background-color: #2980b9;
}

.form-section {
  padding: 20px 10px 0 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
}

.basic-info-section {
  background-color: #f0f8ff;
  border-left: 4px solid #3498db;
}

.detailed-content-section {
  background-color: #f0fff0;
  border-left: 4px solid #27ae60;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.collapsible-section {
  border: 2px solid springgreen;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: #fafafa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  user-select: none;
}

.section-header label {
  margin: 0;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.collapse-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
}

.collapse-arrow.rotated {
  transform: rotate(-90deg);
}

.collapsible-section .form-group {
  margin-bottom: 12px;
}

.collapsible-section .form-group:last-child {
  margin-bottom: 0;
}

.collapsible-section .candidate-list {
  margin-top: 8px;
}

.collapsible-section textarea,
.collapsible-section input {
  width: 100%;
  box-sizing: border-box;
}

.completion-section {
  margin-top: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3498db;
}

.completion-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.task-item:has(.completion-checkbox:checked) .completion-label {
  color: #27ae60;
  font-weight: 600;
}

.completion-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.completion-history {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #ddd;
}

.history-dates {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  margin-top: 6px;
}

.history-date {
  padding: 4px 8px;
  flex-shrink: 0;
  background-color: #e8f5e8;
  border-radius: 12px;
  font-size: 12px;
  color: #27ae60;
}

.add-task-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-task-btn:hover {
  background-color: #2980b9;
}

.task-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.edit-task-btn,
.delete-task-btn {
  padding: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-task-btn {
  background-color: #f39c12;
  color: white;
}

.edit-task-btn:hover {
  background-color: #e67e22;
}

.delete-task-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-task-btn:hover {
  background-color: #c0392b;
}

.task-modal {
  max-width: 500px;
  width: 90%;
}

.task-form {
  margin-top: 20px;
}

.task-form .form-group {
  margin-bottom: 20px;
}

.task-form label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.task-form input,
.task-form textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.task-form input.error,
.task-form textarea.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.task-modal .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.question-type-summary-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.questiontype-summary-header {
  background-color: #e8f5e8;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.questiontype-summary-header:hover {
  background-color: #d0ebd0;
}

.questiontype-summary-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.question-type-summary-group .group-content {
  padding: 16px;
  background-color: white;
}

.question-type-summary-group .summary-item {
  margin: 0;
  border: none;
  padding: 0;
}

.print-paper-view {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.print-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.print-actions {
  display: flex;
  gap: 10px;
}

.print-btn,
.generate-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.print-btn:hover,
.generate-btn:hover {
  background-color: #2980b9;
}

.print-btn1 {
  padding: 8px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.print-btn1:hover {
  background-color: #e0e0e0;
}

.generate-btn {
  background-color: #27ae60;
}

.generate-btn:hover {
  background-color: #219653;
}

.similar-count {
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.similar-items {
  max-height: 70vh;
  overflow-y: auto;
}

.similar-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fafafa;
  transition: all 0.3s;
}

.similar-item:hover {
  background-color: #f0f0f0;
  border-color: #3498db;
}

.similar-checkbox {
  display: flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 3px;
  margin-right: 8px;
  position: relative;
  background-color: white;
}

.checkbox-input:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.checkbox-input:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.item-number {
  font-weight: bold;
  color: #333;
}

.similar-content {
  flex: 1;
}

.similar-meta {
  margin-bottom: 8px;
}

.similar-meta span {
  padding: 2px 8px;
  margin-right: 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
}

.subject-tag {
  background-color: #3498db;
}

.subclass-tag {
  background-color: #9b59b6;
}

.question-type-tag {
  background-color: #e74c3c;
}

.similar-text {
  margin-bottom: 8px;
  line-height: 1.5;
}

.similar-images {
  margin: 8px 0;
}

.similar-img {
  max-width: 150px;
  max-height: 100px;
  margin-right: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.original-reference {
  margin-top: 8px;
  padding: 8px;
  background-color: #fff5f5;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
  font-size: 14px;
  color: #666;
}

.paper-preview-modal {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.paper-content {
  background-color: white;
  padding: 20px;
}

.paper-header {
  text-align: center;
  margin-bottom: 30px;
}

.paper-header h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.paper-meta {
  color: #666;
  font-size: 14px;
}

.questions-container {
  column-count: 1;
}

.question-item {
  break-inside: avoid;
  page-break-inside: avoid;
  width: 100%;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.question-number {
  font-weight: bold;
  display: inline;
  margin-right: 5px;
}

.question-content {
  display: inline;
}

.question-text {
  display: inline;
}

.question-images {
  margin: 10px 0;
}

.question-img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 5px 0;
}

.answer-space {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
}

.answer-lines {
  border-bottom: 1px solid #000;
  margin-top: 10px;
  min-height: 50px;
}

.list-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0px 10px 16px;
  flex-wrap: wrap;
  gap: 10px;
}

.view-mode-controls {
  display: flex;
  align-items: center;
}

.view-mode-buttons {
  display: flex;
  gap: 5px;
  border-radius: 6px;
  padding: 4px;
}

.view-mode-btn {
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.view-mode-btn.active {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.view-mode-btn:hover {
  background: #e0e0e0;
}

.tree-nav-view {
  overflow: hidden;
}

.tree-nav-container {
  display: flex;
  height: 100%;
  gap: 0;
}

.tree-nav-sidebar {
  width: 300px;
  height: 100%;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.tree-nav-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.tree-nav-header h4 {
  margin: 0;
  color: #333;
}

.tree-expand-btn,
.tree-collapse-btn {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tree-expand-btn:hover,
.tree-collapse-btn:hover {
  background: #f0f0f0;
}

.tree-expand-btn:disabled,
.tree-collapse-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tree-nav-buttons {
  display: flex;
  gap: 8px;
}

.tree-nav-content {
  padding: 10px 0;
}

.tree-node {
  margin: 2px 0;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  font-weight: 600;
  color: #2c3e50;
}

.tree-item:hover {
  background: rgba(0, 0, 0, 0.03);
}

.tree-item.active {
  background: #e3f2fd;
  border-left-color: #2196f3;
  font-weight: 500;
}

.tree-item.expanded {
  background: #f5f5f5;
}

.tree-expand-icon {
  width: 16px;
  text-align: center;
  font-size: 10px;
  color: #666;
  margin-right: 5px;
}

.tree-icon {
  margin-right: 8px;
  font-size: 14px;
}

.tree-label {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-count {
  font-size: 12px;
  color: #666;
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 30px;
  text-align: center;
}

.tree-children {
  margin-left: 20px;
  border-left: 1px dashed #e0e0e0;
}

.tree-item.subject {
  font-weight: 600;
  color: #2c3e50;
}

.tree-item.subclass {
  padding-left: 25px;
  color: #34495e;
}

.tree-item.questiontype {
  padding-left: 40px;
  color: #7f8c8d;
  font-size: 13px;
}

.tree-content-main {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
}

.tree-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 15px;
}

.tree-content-header h4 {
  margin: 0;
  color: #333;
}

.tree-content-info {
  color: #666;
  font-size: 14px;
}

.test-view {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.test-progress {
  font-size: 16px;
  color: #666;
}

.test-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-test-btn {
  padding: 6px 12px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.filter-test-btn:hover {
  background-color: #7f8c8d;
}

.test-filter-panel {
  margin: 15px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.test-filter-panel .filter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-filter-panel .filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.test-filter-panel .filter-item {
  flex: 1;
  min-width: 150px;
}

.test-filter-panel .filter-item label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.test-filter-panel .filter-item input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.test-filter-panel .filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-filter-panel .filter-checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.test-filter-panel .filter-actions {
  display: flex;
  gap: 10px;
}

.filter-info {
  padding: 8px;
  background-color: #e8f5e8;
  border-radius: 4px;
  font-size: 14px;
  color: #27ae60;
}

.test-content {
  background: #d4edda;
  padding: 10px;
  margin: 0 0 8px 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.current-question {
  overflow-y: auto;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.original-question {
  padding: 0px;
  background: #d4edda;
  border-radius: 6px;
  border: 1px solid #d4edda;
}

.question-text {
  margin-top: 10px;
  line-height: 1.6;
}

.question-images {
  margin-top: 10px;
}

.question-img {
  max-width: 200px;
  max-height: 150px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.check-answer-btn {
  padding: 6px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.check-answer-btn:hover {
  background: #2980b9;
}

.answer-section {
  margin: 8px 0;
  padding: 8px;
  background: #f8fff8;
  border: 1px solid #d4edda;
  border-radius: 6px;
}

.answer-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
}

.correct-btn,
.wrong-btn {
  padding: 10px 20px;
  min-width: 100px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.correct-btn {
  background: #27ae60;
  color: white;
}

.correct-btn:hover {
  background: #219653;
}

.wrong-btn {
  background: #e74c3c;
  color: white;
}

.wrong-btn:hover {
  background: #c0392b;
}

.result-feedback {
  text-align: center;
  margin: 8px 0 0 0;
  font-size: 18px;
  font-weight: bold;
}

.correct-feedback {
  color: #27ae60;
}

.wrong-feedback {
  color: #e74c3c;
}

.question-details {
  margin: 8px 0;
  border: 1px solid #eee;
  border-radius: 6px;
  overflow: hidden;
}

.details-header {
  padding: 12px 15px;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.test-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.next-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin: 16px 0;
  transition: background-color 0.3s;
}

.next-btn {
  background: #3498db;
  color: white;
}

.next-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.next-btn:hover:not(:disabled) {
  background: #2980b9;
}

.pinyin-converter {
  position: fixed;
  top: 0;
  right: 0;
  margin: 20px auto;
  padding: 20px;
  width: 50%;
  font-family: "Microsoft Yahei", sans-serif;
  border-radius: 8px;
  background-color: #dbd4d4;
  z-index: 2688;
}

.converter-header h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.input-section .input-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  box-sizing: border-box;
}

.options-section {
  margin: 15px 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #555;
}

.option-item input {
  margin-right: 5px;
}

.btn-section {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.convert-btn,
.copy-btn,
.clear-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.convert-btn {
  background: #409eff;
  color: white;
}

.convert-btn:hover {
  background: #337ecc;
}

.copy-btn {
  background: #67c23a;
  color: white;
}

.copy-btn:disabled {
  background: #a0d98b;
  cursor: not-allowed;
}

.copy-btn:hover:not(:disabled) {
  background: #529b2e;
}

.clear-btn {
  background: #f56c6c;
  color: white;
}

.clear-btn:hover {
  background: #e45656;
}

.result-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #ddd;
}

.result-section h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.result-text {
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 60px;
  word-wrap: break-word;
  font-size: 14px;
  color: #333;
}

.copy-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  z-index: 9999;
  animation: fade 2s ease;
}

@keyframes fade {
  0%,
  100% {
    opacity: 0;
  }
  20%,
  80% {
    opacity: 1;
  }
}

.card-list-view {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  padding: 8px 16px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #7f8c8d;
}

.table-container {
  width: 100%;
}

.card-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  table-layout: fixed;
}

.card-table th {
  background-color: #f8f9fa;
  padding: 12px 8px;
  border: 1px solid #dee2e6;
  font-weight: 600;
  text-align: center;
}

.card-table td {
  padding: 12px 8px;
  border: 1px solid #dee2e6;
  word-wrap: break-word;
}

.card-table ::v-deep img {
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
}

.answer-content ::v-deep img {
  max-width: 100% !important;
  margin: 5px 0;
}

.text-center {
  text-align: center;
}

.answer-content {
  width: 30%;
  overflow-y: auto;
}

.idea-content {
  max-width: 200px;
  word-wrap: break-word;
}

.card-table tbody tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.card-table tbody tr.expanded {
  background-color: #f0f8ff;
  border-left: 3px solid #3498db;
}

.placeholder {
  color: #999;
  font-style: italic;
  font-size: 12px;
  text-align: center;
  padding: 10px;
}

.expand-btn {
  padding: 4px 8px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.expand-btn:hover {
  background-color: #2980b9;
}

.grouped-cards {
  margin-top: 20px;
}

.question-group {
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-name {
  font-weight: bold;
  color: #333;
}

.group-content {
  background-color: white;
}

.history-test {
  vertical-align: middle;
}

.test-result-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  margin: 0 2px;
  font-size: 12px;
  font-weight: bold;
}

.test-result-icon.correct {
  background-color: #27ae60;
  color: white;
  border: 1px solid #219653;
}

.test-result-icon.wrong {
  background-color: #e74c3c;
  color: white;
  border: 1px solid #c0392b;
}

.no-test {
  color: #999;
  font-size: 12px;
}

.reading-btn {
  padding: 6px 12px;
  background-color: #9b59b6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.reading-btn:hover:not(:disabled) {
  background-color: #8e44ad;
}

.reading-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.reading-control-btn {
  padding: 4px 8px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  transition: background-color 0.3s;
}

.reading-control-btn:hover {
  background-color: #2980b9;
}

.print-cards-btn {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.print-cards-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.print-cards-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.reading-status {
  margin: 15px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #9b59b6;
}

.reading-status.waiting-for-click {
  border-left-color: #f39c12;
  background-color: #fffaf0;
}

.reading-progress {
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.current-reading-text {
  font-size: 14px;
}

.reading-text-content {
  margin-top: 8px;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  overflow-y: auto;
  line-height: 1.4;
}

.waiting-click-hint {
  margin-top: 8px;
  padding: 8px;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  color: #856404;
  font-size: 14px;
  text-align: center;
}

.auto-pause-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.auto-pause-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.auto-pause-checkbox:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.reading-highlight {
  background-color: #fffacd !important;
  border-left: 4px solid #ffeb3b !important;
  animation: pulse 2s infinite;
}

.reading-status-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

.reading-main-content {
  width: 100%;
  height: 60vh;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  text-align: center;
}

.reading-content-wrapper {
  margin-top: 1rem;
}

.content-label {
  font-size: 1.3rem;
  color: #2c3e50;
  display: block;
  margin-bottom: 1rem;
}

.reading-text-content {
  font-size: 1.6rem;
  line-height: 1.8;
  color: #2d3748;
  padding: 0.5rem;
  background-color: #fef7fb;
  border-radius: 8px;
  height: 50vh;
  margin-bottom: 1rem;
  white-space: pre-line;
}

.waiting-click-hint {
  font-size: 1.1rem;
  color: #e67e22;
  margin-top: 1rem;
  animation: pulse 1.5s infinite;
}

.reading-controls-container {
  width: 90%;
  max-width: 800px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.reading-controls {
  display: flex;
  gap: 0.8rem;
}

.primary-btn {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.primary-btn:hover {
  background-color: #3182ce;
}

.control-btn {
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background-color: #e9e9e9;
  border-color: #ccc;
}

.waiting-for-click .reading-text-content {
  border: 2px dashed #e67e22;
}

@media (max-width: 768px) {
  .tree-nav-container {
    flex-direction: column;
  }

  .tree-nav-sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }

  .tree-content-main {
    height: calc(100% - 200px);
  }

  .test-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .test-filter-panel .filter-row {
    flex-direction: column;
  }

  .test-filter-panel .filter-item {
    min-width: 100%;
  }
  .test-result-icon {
    width: 18px;
    height: 18px;
    line-height: 16px;
    font-size: 10px;
    margin: 0 1px;
  }

  .reading-controls {
    flex-direction: column;
    gap: 3px;
  }

  .reading-status {
    padding: 10px;
  }

  .reading-text-content {
    font-size: 13px;
  }

  .reading-text-content {
    font-size: 1.4rem;
  }

  .reading-main-content {
    padding: 1.5rem;
  }

  .primary-btn {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
  }

  .pinyin-converter {
    padding: 10px;
    margin: 10px;
  }

  .btn-section {
    flex-direction: column;
  }

  .convert-btn,
  .copy-btn,
  .clear-btn {
    width: 100%;
  }

  .card-list-view {
    padding: 10px;
    margin: 10px;
  }

  .card-table {
    font-size: 12px;
  }

  .card-table th,
  .card-table td {
    padding: 8px 4px;
  }

  .answer-content {
    max-width: 200px;
  }

  .idea-content {
    max-width: 120px;
  }

  .questiontype-summary-header {
    padding: 10px 12px;
  }

  .questiontype-summary-header h4 {
    font-size: 14px;
  }

  .question-type-summary-group .group-content {
    padding: 12px;
  }

  .print-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .questions-container {
    column-count: 1;
  }

  .similar-item {
    flex-direction: column;
  }

  .similar-checkbox {
    margin-bottom: 10px;
  }
}
.form-group input[placeholder*="多个用户"] {
  border-color: #3498db;
  background-color: #f8f9fa;
}

/* 多值显示样式 */
.multi-value-hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
.original-question {
  transition: background-color 0.3s;
  padding: 0px;
  border-radius: 4px;
}

.original-question:hover {
  background-color: #d4edda;
  border: 1px dashed #ddd;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #7f8c8d;
}

.save-btn {
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #219653;
}
.collapse-icon {
  transition: transform 0.3s ease;
  font-size: 12px;
  color: #666;
  display: inline-block;
}

.collapse-icon.rotated {
  transform: rotate(-90deg);
}

.summary-header {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 0px;
}

.summary-header:hover {
  background-color: #e8e8e8;
}

.subject-title {
  font-weight: bold;
  color: #333;
}

.cheat-sheet-view {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cheat-sheet-list {
  margin-top: 20px;
}

.cheat-sheet-group {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.cheat-sheet-header {
  background-color: #e3f2fd;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.cheat-sheet-header:hover {
  background-color: #d0ebff;
}

.cheat-sheet-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: white;
}

.cheat-sheet-item:last-child {
  border-bottom: none;
}

.cheat-sheet-content {
  margin-bottom: 12px;
}

.cheat-sheet-text {
  margin-top: 8px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #4caf50;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cheat-sheet-view {
    padding: 10px;
    margin: 10px;
  }

  .cheat-sheet-header {
    padding: 10px 12px;
  }

  .cheat-sheet-item {
    padding: 12px;
  }
}
.print-cheatsheet-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.print-cheatsheet-item:hover {
  background-color: #f5f5f5;
  border-color: #3498db;
}

.print-cheatsheet-item.selected {
  background-color: #e3f2fd;
  border-color: #2196f3;
}

.cheatsheet-checkbox {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.cheatsheet-checkbox input {
  display: none;
}

.cheatsheet-checkbox .checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  background-color: white;
}

.cheatsheet-checkbox input:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.cheatsheet-checkbox input:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.cheatsheet-preview {
  flex: 1;
}

.cheatsheet-group-info {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.cheatsheet-text-preview {
  max-height: 60px;
  overflow: hidden;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.cheatsheet-text-preview :deep(img) {
  max-width: 50px;
  max-height: 40px;
  margin: 2px;
}

/* 打印按钮样式 */
.print-btn {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.print-btn:hover {
  background-color: #2980b9;
}

.generate-btn {
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.generate-btn:hover:not(:disabled) {
  background-color: #219653;
}

.generate-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.cheatsheet-checkbox {
  display: flex;
  align-items: center;
  margin-right: 12px;
  cursor: pointer;
  z-index: 1; /* 确保复选框在最上层 */
  position: relative;
}

.cheatsheet-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  width: 100%;
  height: 100%;
  margin: 0;
  left: 0;
  top: 0;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 3px;
  position: relative;
  background-color: white;
  transition: all 0.3s;
}

.cheatsheet-checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.cheatsheet-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.print-cheatsheet-item {
  position: relative;
  cursor: pointer;
}

/* 确保预览区域不会阻止点击 */
.cheatsheet-preview {
  pointer-events: none; /* 让点击事件穿透到父元素 */
}

/* 但需要让预览区域内的文字可以选择 */
.cheatsheet-text-preview {
  pointer-events: auto;
  user-select: text;
}

@media (min-width: 768px) {
  .cheat-sheet-item,
  .card-table tbody tr,
  .summary-item,
  .error-item,
  .task-item {
    /* 启用内容可见性优化，浏览器自动跳过屏幕外内容的渲染 */
    content-visibility: auto;
    contain-intrinsic-size: 0 400px;
  }
}

@media print {
  .question-item {
    /* 关键：允许题目内容跨页断开 */
    page-break-inside: auto; /* 默认值，可省略，但显式写出更清晰 */
    /* 确保布局是流动的，不会因固定高度导致异常 */
    /* min-height: unset; */ /* 如果原有样式有固定高度，可能需要重置 */
  }
  .question-content img {
    /* 如果图片很大，也允许跨页断开，但可能会被分割 */
    max-width: 100% !important;
    page-break-inside: auto;
  }
  /* 可以添加一些边距控制，使分页处更美观 */
  h1,
  h2,
  h3,
  h4 {
    page-break-after: avoid;
  }
  p,
  li {
    page-break-inside: avoid; /* 通常希望段落、列表项保持完整 */
  }
}

/* 列表页面样式 */
.dt-home-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.dt-home-container {
  width: 800px;
  max-width: 90%;
  max-height: calc(100vh - 100px);
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.dt-home-header-actions {
  display: flex;
  gap: 10px;
}

.dt-home-header-actions button:nth-child(2) {
  margin-left: auto;
}

.dt-home-container h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.dt-home-container .dt-btn {
  margin-bottom: 16px;
  display: block;
  color: white;
}

.dt-mind-map-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dt-mind-map-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
}

.dt-mind-map-item:hover {
  background-color: #ecf5ff;
  transform: scale(1.005);
}

.dt-mind-map-info {
  flex: 1;
  overflow: hidden;
}

.dt-mind-map-info h3 {
  margin: 0 0 5px 0;
  color: #409eff;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-mind-map-info p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.dt-empty-hint {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 思维导图页面样式 */
.dt-mind-map-wrapper {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}

.dt-toolbar {
  position: fixed;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  height: 4em;
  align-items: center;
  gap: 0;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  user-select: none;
  max-width: calc(100% - 40px);
}

.dt-toolbar::-webkit-scrollbar {
  height: 4px;
}

.dt-toolbar::-webkit-scrollbar-track {
  background: transparent;
}

.dt-toolbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}

.dt-toolbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

.dt-mastery-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dt-mastery-level {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  min-width: 20px;
  text-align: center;
  user-select: none;
}

/* 测验模式 */
.dt-quiz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(4px);
}

.dt-quiz-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid #e4e7ed;
}

.dt-quiz-mastery-info {
  font-size: 15px;
  color: #606266;
  display: flex;
  align-items: center;
}

.dt-quiz-mastery-level {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  min-width: 24px;
  text-align: center;
  user-select: none;
  margin: 0 4px;
}

@keyframes dtMasteryPop {
  0% {
    transform: scale(1);
    color: #409eff;
  }
  50% {
    transform: scale(1.5);
    color: #67c23a;
  }
  100% {
    transform: scale(1);
    color: #409eff;
  }
}

@keyframes dtMasteryShake {
  0% {
    transform: scale(1) rotate(0deg);
    color: #409eff;
  }
  20% {
    transform: scale(1.3) rotate(-10deg);
    color: #f56c6c;
  }
  40% {
    transform: scale(1.1) rotate(10deg);
    color: #f56c6c;
  }
  60% {
    transform: scale(1.2) rotate(-5deg);
    color: #f56c6c;
  }
  80% {
    transform: scale(1.1) rotate(5deg);
    color: #f56c6c;
  }
  100% {
    transform: scale(1) rotate(0deg);
    color: #409eff;
  }
}

.dt-mastery-correct {
  display: inline-block;
  animation: dtMasteryPop 0.6s ease-out;
}

.dt-mastery-wrong {
  display: inline-block;
  animation: dtMasteryShake 0.6s ease-out;
}

.dt-quiz-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 8px 0 8px;
  overflow-y: auto;
}

.dt-quiz-progress {
  font-size: 14px;
  color: white;
  margin-bottom: 6px;
}

.dt-quiz-favorite-star {
  font-size: 18px;
  color: #ffd700;
  cursor: pointer;
  user-select: none;
  margin-bottom: 6px;
  line-height: 1;
}

.dt-quiz-node-id {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 6px;
  font-weight: 500;
  text-align: left;
}

.dt-quiz-content {
  background: #e6ffef;
  border-radius: 12px;
  padding: 16px 16px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  height: 100%;
  margin-bottom: 0.5em;
}

.dt-quiz-content-text {
  font-size: 20px;
  line-height: 1.8;
  color: #303133;
}

.dt-quiz-no-blank {
  color: #ffffff;
  font-size: 16px;
}

.dt-quiz-options {
  width: 100%;
  max-width: 800px;
  height: 40vh;
  overflow-y: auto;
}

.dt-quiz-option {
  background: white;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 6px 20px;
  margin-bottom: 6px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
}

.dt-quiz-option-selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.dt-quiz-option-correct {
  border-color: #67c23a;
  background: #67c23a;
  color: #ffffff;
}

.dt-quiz-option-correct .dt-quiz-option-label,
.dt-quiz-option-correct .dt-quiz-option-text {
  color: #ffffff;
}

.dt-quiz-option-wrong {
  border-color: #f56c6c;
  background: #f56c6c;
  color: #ffffff;
}

.dt-quiz-option-wrong .dt-quiz-option-label,
.dt-quiz-option-wrong .dt-quiz-option-text {
  color: #ffffff;
}

.dt-quiz-option-correct-border {
  border-color: #67c23a;
  background: springgreen;
}

.dt-quiz-option-correct-border .dt-quiz-option-label,
.dt-quiz-option-correct-border .dt-quiz-option-text {
  color: #000000;
}

.dt-quiz-option-label {
  font-weight: bold;
  margin-right: 12px;
  color: #606266;
  min-width: 24px;
}

.dt-quiz-option-text {
  color: #303133;
  line-height: 1.5;
}

.dt-quiz-description {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.dt-quiz-desc-label {
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.dt-quiz-desc-content {
  color: #606266;
  line-height: 1.6;
}

.dt-quiz-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e4e7ed;
}

.dt-quiz-nav-btn {
  min-width: 80px;
  font-size: 14px;
}

.dt-quiz-toggle-btn {
  min-width: 100px;
  font-size: 14px;
}

.dt-quiz-result-buttons {
  display: flex;
  gap: 24px;
}

.dt-quiz-know-btn {
  min-width: 80px;
  font-size: 16px;
  background: #67c23a !important;
  color: white !important;
  border-color: #67c23a !important;
}

.dt-quiz-know-btn:hover:not(:disabled) {
  background: #5daf34 !important;
  border-color: #5daf34 !important;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.35) !important;
}

.dt-quiz-dontknow-btn {
  min-width: 80px;
  font-size: 16px;
  background: #f56c6c !important;
  color: white !important;
  border-color: #f56c6c !important;
}

.dt-quiz-dontknow-btn:hover:not(:disabled) {
  background: #dd6161 !important;
  border-color: #dd6161 !important;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.35) !important;
}

.dt-history-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dt-btn-group {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  position: relative;
}

.dt-btn-group:not(:last-child)::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 20px;
  background-color: #e4e7ed;
}

.dt-btn-group:first-child {
  padding-left: 0;
}

.dt-btn-group:last-child {
  padding-right: 0;
}

.dt-btn-group:last-child::after {
  display: none;
}

.dt-history-controls .dt-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.dt-mastery-level {
  font-size: 14px;
  color: #333;
  min-width: 30px;
  text-align: center;
  font-weight: bold;
  color: #409eff;
}

.dt-cursor-pointer {
  cursor: pointer;
}

.dt-btn-danger {
  background-color: #f56c6c;
  color: white;
}

.dt-btn-danger:hover {
  background-color: #f78989;
}

.dt-mind-map-title {
  font-size: 18px;
  color: #333;
  cursor: pointer;
  padding: 8px 16px;
  margin: 0;
}

.dt-mind-map-title:hover {
  color: #409eff;
}

.dt-name-input {
  font-size: 18px;
  padding: 8px 16px;
  border: 2px solid #409eff;
  border-radius: 4px;
  outline: none;
  width: 200px;
}

.dt-btn {
  padding: 6px 10px;
  font-size: 16px;
  background-color: #fff;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  box-shadow: 0 1px 2px rgba(64, 158, 255, 0.08);
}

.dt-btn:hover:not(:disabled) {
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.35);
}

.dt-btn:active:not(:disabled) {
  transform: translateY(0);
}

.dt-btn:disabled {
  background-color: #b6c0bc;
  color: white !important;
  border-color: #ebeef5 !important;
  cursor: not-allowed;
  opacity: 0.35;
  box-shadow: none;
}

.dt-btn-small {
  padding: 0;
  font-size: 32px;
  height: 42px;
  width: 42px;
}

.dt-btn-primary {
  background-color: #409eff;
  color: white;
}

.dt-btn-secondary {
  background-color: #409eff;
  color: white;
}

.dt-btn-secondary:hover {
  background-color: #409eff;
}

.dt-btn-back {
  background-color: springgreen;
  color: white;
}

.dt-btn-back:hover {
  background-color: #00cc6a;
}

.dt-mind-map-name-bar {
  position: fixed;
  top: 4.8em;
  left: 5px;
  z-index: 99;
}

.dt-mind-map-title {
  font-size: 20px;
  font-weight: bold;
  color: steelblue;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #409eff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.dt-mind-map-title:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.dt-mind-map-title-input {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 4px 8px;
  border: 1px solid #409eff;
  border-radius: 4px;
  outline: none;
  background-color: #ecf5ff;
  max-width: 300px;
}

.dt-btn-danger {
  background-color: red;
}

.dt-btn-danger:hover {
  background-color: #f78989;
}

.dt-mind-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: grab;
  will-change: transform;
}

.dt-mind-map-container:active {
  cursor: grabbing;
}

/* ========== 笔记面板样式 ========== */
.dt-note-panel {
  position: fixed;
  left: 10px;
  min-width: 80px;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 100;
  transition:
    width 0.2s,
    height 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dt-note-panel.dt-note-panel-collapsed {
  width: 20px;
  min-width: 20px;
  height: auto !important;
  padding: 4px;
}

.dt-note-panel-header {
  font-size: 13px;
  font-weight: bold;
  color: #666;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dt-note-panel-collapsed .dt-note-panel-header {
  border-bottom: none;
  margin-bottom: 0;
  justify-content: center;
}

.dt-note-panel-toggle {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 4px;
}

.dt-note-panel-toggle:hover {
  background-color: #e6f7ff;
}

.dt-note-panel .dt-node-content {
  flex: 1;
  width: 100%;
  height: auto;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  user-select: text;
  background-color: rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
}

.dt-note-panel .dt-node-content span {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
}

.dt-note-panel .dt-node-content::-webkit-scrollbar {
  width: 6px;
}

.dt-note-panel .dt-node-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dt-note-panel .dt-node-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* ========== 大纲模式样式 ========== */
.dt-outline-container {
  position: absolute;
  top: 108px;
  left: 0px;
  right: 0px;
  bottom: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0px 5px;
  margin: 5px 0;
  z-index: 10;
  box-sizing: border-box;
}

.dt-outline-node {
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dt-outline-node-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.dt-outline-toggle {
  font-size: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dt-outline-bullet {
  font-size: 10px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dt-outline-level-number {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
  font-weight: 500;
  flex-shrink: 0;
}

.dt-outline-node-text {
  font-size: 14px;
  word-break: break-all;
  overflow-y: auto;
  max-height: 168px;
  min-height: 18px;
  flex-grow: 1;
  white-space: pre-wrap;
}

.dt-outline-root-text {
  font-weight: bold;
  font-size: 16px;
}

.dt-outline-favorite {
  color: #e6a23c;
  font-size: 14px;
  margin-right: 4px;
  flex-shrink: 0;
}

.dt-outline-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-right: 6px;
}

.dt-outline-tag {
  display: inline-block;
  padding: 0px 4px;
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  border-radius: 3px;
  font-size: 10px;
  line-height: 1.3;
  white-space: nowrap;
}

.dt-outline-meta {
  margin-top: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.dt-outline-meta:hover {
  background-color: #e8f5e9;
}

.dt-outline-meta-selected {
  background-color: #c8e6c9 !important;
  outline: 1px solid #66bb6a;
}

.dt-outline-comment {
  background-color: #fff7e6;
  border-left: 3px solid #e6a23c;
  margin-left: 1.5em;
  max-height: 128px;
  overflow-y: auto;
}

.dt-outline-attachment {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
  margin-left: 1.5em;
}

.dt-outline-meta-label {
  color: #888;
  font-weight: 600;
  margin-right: 6px;
}

.dt-outline-meta-text {
  color: #555;
  word-break: break-all;
}

.dt-canvas {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  user-select: none;
}

.dt-lines-layer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.dt-node {
  position: absolute;
  cursor: pointer;
}

.dt-description-icon {
  position: absolute;
  top: -8px;
  left: -8px;
  width: 18px;
  height: 18px;
  background-color: #409eff;
  color: #ffd700;
  border: 2px solid #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
}

.dt-description-icon:hover {
  background-color: #66b1ff;
  transform: scale(1.005);
}

.dt-child-count-icon {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  background-color: #409eff;
  color: #ffd700;
  border: 2px solid #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
}

.dt-child-count-icon:hover {
  background-color: #66b1ff;
  transform: translateY(-50%) scale(1.01);
}

.dt-child-line {
  display: inline-block;
  width: 8px;
  height: 2px;
  background-color: #ffd700;
  border-radius: 1px;
}

.dt-child-count-icon.dt-has-collapsed-children {
  color: #ffd700;
  border-color: #409eff;
}

.dt-child-count-icon.dt-has-collapsed-children:hover {
  background-color: #66b1ff;
}

.dt-child-count-icon.dt-vertical {
  right: auto;
  top: auto;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.dt-child-count-icon.dt-vertical:hover {
  transform: translateX(-50%) scale(1.1);
}

.dt-child-count-icon.dt-child-count-icon-left {
  right: auto;
  left: -8px;
}

.dt-child-count-icon.dt-child-count-icon-left:hover {
  transform: translateY(-50%) scale(1.01);
}

.dt-resize-handle {
  position: absolute;
  right: -8px;
  bottom: -8px;
  width: 18px;
  height: 18px;
  background-color: transparent;
  color: transparent;
  border: 2px solid transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: nwse-resize;
  z-index: 20;
  user-select: none;
  transition: all 0.3s;
}

.dt-resize-handle:hover {
  background-color: rgba(64, 158, 255, 0.3);
  transform: scale(1.005);
}

.dt-drag-handle {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 18px;
  height: 18px;
  background-color: transparent;
  color: transparent;
  border: 2px solid transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  z-index: 20;
  user-select: none;
  transition: all 0.3s;
}

.dt-drag-handle:hover {
  background-color: rgba(64, 158, 255, 0.3);
  transform: scale(1.005);
}

.dt-node-content.dt-target-node {
  background-color: #e6f7ff;
  border-color: #1890ff;
  border-width: 3px;
  transform: scale(1.005);
  box-shadow: 0 0 12px rgba(24, 144, 255, 0.4);
}

.dt-drop-indicator {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

.dt-drop-indicator-horizontal {
  left: 0;
  right: 0;
  top: 50%;
  height: 0;
  border-top: 3px dashed #000;
}

.dt-drop-indicator-vertical {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 0;
  border-left: 3px dashed #000;
}

.dt-node-content {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 2px solid #409eff;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dt-node-content-text {
  color: #333;
  line-height: 1.5;
  text-align: justify;
}

/* 收藏节点蓝色五角星样式 */
.dt-node-favorite-star {
  color: #409eff;
  font-size: 12px;
  flex-shrink: 0;
  line-height: 1.3;
}

/* 高亮节点样式 - 标签和收藏共用 */
.dt-node-content.dt-tag-highlight {
  background-color: #409eff !important;
  color: #fff !important;
  border-color: #409eff !important;
}

.dt-node-content.dt-tag-highlight > span {
  color: #fff !important;
}

.dt-node-content.dt-tag-highlight .dt-blank {
  border-bottom-color: rgba(255, 255, 255, 0.6);
}

.dt-node-content.dt-tag-highlight .dt-blank-show {
  color: #fff;
}

/* 让节点文字内容显示在三角之上 */
.dt-node-content > span {
  position: relative;
  z-index: 1;
}

.dt-node-content span {
  display: block;
  word-break: break-word;
  white-space: pre-wrap;
}

.dt-node-content .dt-blank {
  display: inline-block;
  word-break: normal;
  white-space: nowrap;
}

.dt-node-content.dt-scrollable {
  overflow-y: auto;
  overflow-x: hidden;
  align-items: flex-start;
  justify-content: flex-start;
}

.dt-node-content.dt-scrollable::-webkit-scrollbar {
  width: 6px;
}

.dt-node-content.dt-scrollable::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dt-node-content.dt-scrollable::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dt-node-content.dt-scrollable::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dt-node-content:hover {
  background-color: #f0f2f5;
  box-shadow:
    0 0 4px #8c8c8c,
    0 0 12px #666666,
    0 0 20px rgba(100, 100, 100, 0.3);
}

.dt-node-content.dt-selected:hover {
  box-shadow:
    0 0 5px #0099ff,
    0 0 15px #0099ff,
    0 0 25px rgba(0, 153, 255, 0.5);
}

.dt-node-content.dt-selected {
  outline: 2px dashed #4caf50;
  outline-offset: 2px;
}

.dt-node-content.dt-root {
  background-color: navy;
  color: #fff;
}

/* 编辑弹窗样式 */
.dt-edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dt-edit-modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  max-width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.dt-edit-modal-content h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.dt-edit-modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

/* 附件图标样式 */
.dt-attachment-icon {
  position: absolute;
  bottom: -8px;
  left: -8px;
  width: 18px;
  height: 18px;
  background-color: #409eff;
  color: #ffd700;
  border: 2px solid #409eff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s;
}

.dt-attachment-icon:hover {
  background-color: #66b1ff;
  transform: scale(1.005);
}

/* 附件列表弹窗样式 */
.dt-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.dt-modal-header h3 {
  margin: 0;
}

.dt-attachment-list {
  max-height: 300px;
  overflow-y: auto;
}

.dt-description-view-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.dt-description-view-content:hover {
  border-color: #999;
}

.dt-attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.dt-attachment-item:last-child {
  border-bottom: none;
}

.dt-attachment-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #333;
}

.dt-file-input {
  display: none;
}

/* ========== 概要节点样式 ========== */
.dt-summary-node {
  position: absolute;
  cursor: pointer;
  z-index: 10;
}

.dt-summary-content {
  background-color: rgba(230, 162, 60, 0.1);
  border: 2px solid #e6a23c;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #e6a23c;
  white-space: normal;
  word-break: break-all;
  user-select: none;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
}

.dt-summary-text {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
}

.dt-summary-node.dt-selected .dt-summary-content {
  border-color: #409eff;
  background-color: rgba(64, 158, 255, 0.1);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.dt-summary-hint {
  color: #909399;
  font-size: 12px;
  margin: 0 0 10px 0;
}

.dt-summary-info {
  margin-bottom: 10px;
}

.dt-summary-info-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.dt-summary-info-item label {
  font-weight: bold;
  margin-right: 8px;
  white-space: nowrap;
}

.dt-summary-select {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  max-width: 250px;
}

.dt-summary-textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  resize: vertical;
  box-sizing: border-box;
  flex-grow: 1;
}

.dt-summary-textarea:focus {
  border-color: #409eff;
  outline: none;
}

/* 设置弹窗样式 */
.dt-settings-form {
  margin-bottom: 15px;
}

.dt-settings-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.dt-settings-item:last-child {
  margin-bottom: 0;
}

.dt-settings-item label {
  width: 120px;
  font-size: 14px;
  color: #666;
}

.dt-settings-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.dt-settings-input:focus {
  border-color: #409eff;
}

.dt-settings-unit {
  margin-left: 8px;
  font-size: 14px;
  color: #666;
}

.dt-settings-tips {
  background-color: #f5f7fa;
  border-left: 4px solid #409eff;
  padding: 10px 12px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 导出弹窗样式 */
.dt-export-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.dt-export-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.dt-export-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.dt-export-icon {
  font-size: 32px;
  margin-right: 15px;
  width: 40px;
  text-align: center;
}

.dt-export-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.dt-export-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* 导入弹窗样式 */
.dt-import-warning {
  background-color: #fff7e6;
  border-left: 4px solid #e6a23c;
  padding: 10px 12px;
  margin-bottom: 15px;
  font-size: 13px;
  color: #ad8b3c;
  line-height: 1.5;
}

.dt-import-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.dt-import-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.dt-import-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.dt-import-icon {
  font-size: 32px;
  margin-right: 15px;
}

.dt-import-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.dt-import-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* 主题样式 */
/* 默认主题 - 蓝色 */
.dt-theme-default {
  --line-color: #409eff;
}

.dt-theme-default .dt-node-content {
  --node-color: #409eff;
  background-color: #fff;
  border: 2px solid #409eff;
  color: #333;
}

.dt-theme-default .dt-node-content-text {
  color: #333;
}

.dt-theme-default .dt-node-content.dt-root {
  --node-color: navy;
  background: linear-gradient(135deg, #00ffff 0%, #00bfff 100%);
  color: black;
  border-color: navy;
}

.dt-theme-default .dt-node-content.dt-root .dt-node-content-text {
  color: black;
}

.dt-theme-default .dt-node-content.dt-selected {
  outline: 2px dashed green;
  outline-offset: 5px;
}

.dt-theme-default .dt-node-content.dt-selected:hover {
  background-color: #fff;
}

.dt-theme-default .dt-node-content.dt-root.dt-selected:hover {
  background-color: cyan;
}

/* 白天主题 - 明亮清爽 */
.dt-theme-light {
  --line-color: #66b1ff;
}

.dt-theme-light .dt-node-content {
  --node-color: #409eff;
  background: linear-gradient(135deg, #ffffff 0%, #f5faff 100%);
  border: 2px solid #409eff;
  color: #303133;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  border-radius: 6px;
}

.dt-theme-light .dt-node-content-text {
  color: #303133;
}

.dt-theme-light .dt-node-content.dt-root {
  --node-color: #409eff;
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  color: #fff;
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.dt-theme-light .dt-node-content.dt-root .dt-node-content-text {
  color: #ffffff;
}

.dt-theme-light .dt-node-content.dt-selected {
  outline: 3px dashed #e6a23c;
  outline-offset: 3px;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.25);
}

.dt-theme-light .dt-node-content:hover {
  background-color: #f0f2f5;
  box-shadow:
    0 0 4px #8c8c8c,
    0 0 12px #666666,
    0 0 20px rgba(100, 100, 100, 0.3);
}

.dt-theme-light .dt-node-content.dt-selected:hover {
  background: linear-gradient(135deg, #ffffff 0%, #f5faff 100%);
}

.dt-theme-light .dt-node-content.dt-root.dt-selected:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
}
.dt-theme-light .dt-mind-map-wrapper {
  background: #e6ffef;
}

.dt-theme-light .dt-toolbar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.dt-theme-light .dt-btn {
  color: #1296db;
  border: none;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.25);
  transition: all 0.2s ease;
}

.dt-theme-light .dt-btn:hover {
  background: linear-gradient(135deg, #79bbff 0%, #66b1ff 100%);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
  transform: translateY(-1px);
}

.dt-theme-light .dt-btn-primary {
  background-color: #409eff;
  color: white;
}

.dt-theme-light .dt-btn-secondary {
  background-color: #409eff;
  color: white;
}

/* 黑夜主题 - 深色背景 */
.dt-theme-dark {
  --line-color: #66b1ff;
}

.dt-theme-dark .dt-node-content {
  --node-color: #409eff;
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border: 2px solid #409eff;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  border-radius: 6px;
}

.dt-theme-dark .dt-node-content-text {
  color: #ffffff;
}

.dt-theme-dark .dt-node-content.dt-root {
  --node-color: #409eff;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: #ffffff;
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.dt-theme-dark .dt-node-content.dt-root .dt-node-content-text {
  color: #ffffff;
}

.dt-theme-dark .dt-node-content.dt-selected {
  outline: 3px dashed #e6a23c;
  outline-offset: 3px;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.dt-theme-dark .dt-node-content:hover {
  background-color: rgba(64, 158, 255, 0.15);
  box-shadow:
    0 0 6px #409eff,
    0 0 18px #0099ff,
    0 0 30px rgba(0, 153, 255, 0.6);
}

.dt-theme-dark .dt-node-content.dt-selected:hover {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
}

.dt-theme-dark .dt-node-content.dt-root.dt-selected:hover {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
}

.dt-theme-dark .dt-mind-map-wrapper {
  background: linear-gradient(180deg, #121212 0%, #1a1a1a 100%);
}

.dt-theme-dark .dt-toolbar {
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.dt-theme-dark .dt-btn {
  background: black;
  color: #1296db;
  border: none;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.25);
}

.dt-theme-dark .dt-btn:hover {
  background: skyblue;
}

.dt-theme-dark .dt-home-wrapper {
  background: linear-gradient(180deg, #121212 0%, #1a1a1a 100%);
}

.dt-theme-dark .dt-home-container {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  color: #ffffff;
  border: 1px solid #333;
}

.dt-theme-dark .dt-home-container h1 {
  color: #ffffff;
}

.dt-theme-dark .dt-mind-map-item {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  color: #ffffff;
  border: 1px solid #333;
}

.dt-theme-dark .dt-mind-map-item:hover {
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
  border-color: #409eff;
}

.dt-theme-dark .dt-edit-modal-content {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  color: #ffffff;
  border: 1px solid #333;
}

.dt-theme-dark .dt-edit-modal-content h3 {
  color: #ffffff;
}

.dt-theme-dark .dt-description-view-content {
  border-color: #444;
  color: #ffffff;
}

.dt-theme-dark .dt-description-view-content:hover {
  border-color: #666;
}

.dt-theme-dark .dt-settings-item label {
  color: #ffffff;
}

.dt-theme-dark .dt-settings-input {
  background: #2a2a2a;
  color: #ffffff;
  border: 1px solid #444;
}

.dt-theme-dark .dt-settings-input option {
  background: #2a2a2a;
  color: #ffffff;
}

.dt-theme-dark .dt-search-input {
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
  color: #ffffff;
  border: 1px solid #444;
}

.dt-theme-dark .dt-search-results {
  border-color: #444;
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
}

.dt-theme-dark .dt-search-result-text {
  color: #ffffff;
}

.dt-theme-dark .dt-search-result-level {
  color: #aaa;
}

.dt-theme-dark .dt-search-result-item {
  border-bottom-color: #444;
}

.dt-theme-dark .dt-search-result-item:hover {
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
}

.dt-theme-dark .dt-search-empty {
  color: #888;
}

/* 清晰主题 - 大字体高对比度 */
.dt-theme-presbyopia {
  --line-color: #4a5568;
}

.dt-theme-presbyopia .dt-node-content {
  --node-color: #2d3748;
  background-color: #ffffff;
  border: 2px solid #4a5568;
  color: #2d3748;
  font-size: 14px !important;
}

.dt-theme-presbyopia .dt-node-content-text {
  color: #2d3748;
  font-size: 14px !important;
}

.dt-theme-presbyopia .dt-node-content.dt-root {
  --node-color: #2b6cb0;
  background-color: cyan;
  color: #fff;
  border-color: #2b6cb0;
  font-size: 16px !important;
}

.dt-theme-presbyopia .dt-node-content.dt-root .dt-node-content-text {
  font-size: 16px !important;
}

.dt-theme-presbyopia .dt-node-content.dt-selected {
  outline: 2px dashed #38a169;
  outline-offset: 2px;
}

.dt-theme-presbyopia .dt-node-content.dt-selected:hover {
  background-color: #ffffff;
}

.dt-theme-presbyopia .dt-node-content.dt-root.dt-selected:hover {
  background-color: cyan;
}

.dt-theme-presbyopia .dt-mind-map-wrapper {
  background-color: #f7fafc;
}

.dt-theme-presbyopia .dt-toolbar {
  background-color: #edf2f7;
  border-bottom: 2px solid #cbd5e0;
}

.dt-theme-presbyopia .dt-btn {
  background-color: beige;
  color: #1296db;
}

.dt-theme-presbyopia .dt-btn:hover {
  background-color: wheat;
}

.dt-theme-presbyopia .dt-home-container h1 {
  font-size: 22px;
}

.dt-theme-presbyopia .dt-mind-map-item {
  font-size: 14px;
}

.dt-theme-presbyopia .dt-search-input {
  font-size: 14px;
  padding: 8px 12px;
  border-width: 2px;
}

.dt-theme-presbyopia .dt-search-result-text {
  font-size: 14px;
}

.dt-theme-presbyopia .dt-search-result-level {
  font-size: 13px;
}

.dt-theme-presbyopia .dt-btn:disabled {
  font-size: 14px;
  padding: 6px 14px;
  background-color: #bfc9c5;
  color: black;
}

/* 护眼主题 - 绿色调 */
.dt-theme-eyecare {
  --line-color: #6b8e23;
}

.dt-theme-eyecare .dt-node-content {
  --node-color: #6b8e23;
  background-color: #f0f8f2;
  border: 2px solid #6b8e23;
  color: #333;
}

.dt-theme-eyecare .dt-node-content-text {
  color: #333;
}

.dt-theme-eyecare .dt-node-content.dt-root {
  --node-color: #556b2f;
  background-color: #c3e6cb;
  color: black;
  border-color: #556b2f;
}

.dt-theme-eyecare .dt-node-content.dt-selected {
  outline: 2px dashed #4caf50;
  outline-offset: 2px;
}

.dt-theme-eyecare .dt-node-content:hover {
  background-color: #e8f5e9;
}

.dt-theme-eyecare .dt-mind-map-wrapper {
  background-color: #d4edda;
}

.dt-theme-eyecare .dt-toolbar {
  background-color: transparent;
  border-bottom: none;
}

.dt-theme-eyecare .dt-home-wrapper {
  background-color: #f5f5dc;
}

.dt-theme-eyecare .dt-home-container {
  background-color: #fffff0;
}

.dt-theme-eyecare .dt-edit-modal-content {
  background-color: #fffff0;
}
.dt-theme-eyecare .dt-btn {
  background-color: #81d4a8;
  color: #1296db;
}

/* ========== 大纲模式主题样式 ========== */

/* 默认主题 - 蓝色 */
.dt-theme-default .dt-outline-container {
  background-color: #f5f7fa;
}

.dt-theme-default .dt-outline-node {
  background-color: #fff;
  border: 2px solid #409eff;
}

.dt-theme-default .dt-outline-node:hover {
  background-color: #ecf5ff;
}

.dt-theme-default .dt-outline-root-node {
  background-color: cyan;
  border-color: navy;
  color: white;
}

.dt-theme-default .dt-outline-selected {
  background-color: lightgoldenrodyellow !important;
  border-color: #e6a23c !important;
}

.dt-theme-default .dt-outline-root-node.dt-outline-selected {
  color: #333;
}

.dt-theme-default .dt-outline-level-number {
  background-color: #409eff;
  color: #fff;
}

.dt-theme-default .dt-outline-bullet {
  color: #c0c4cc;
}

.dt-theme-default .dt-outline-toggle {
  color: #909399;
}

.dt-theme-default .dt-outline-toggle:hover {
  color: #409eff;
}

.dt-theme-default .dt-outline-node-text {
  color: #303133;
}

.dt-theme-default .dt-outline-root-text {
  color: #303133;
}

.dt-theme-default .dt-outline-favorite {
  color: #e6a23c;
}

.dt-theme-default .dt-outline-meta {
  color: #909399;
}

.dt-theme-default .dt-outline-description {
  color: #606266;
}

.dt-theme-default .dt-outline-attachments {
  color: #606266;
}

/* 白天主题 - 明亮清爽 */
.dt-theme-light .dt-outline-container {
  background: linear-gradient(180deg, #f5f7fa 0%, #ebeef5 100%);
  border-left: 1px solid #e4e7ed;
}

.dt-theme-light .dt-outline-node {
  background: linear-gradient(135deg, #ffffff 0%, #f5faff 100%);
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dt-theme-light .dt-outline-node:hover {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  border-color: #409eff;
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.dt-theme-light .dt-outline-root-node {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  border-color: #409eff;
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25);
}

.dt-theme-light .dt-outline-selected {
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%) !important;
  border-color: #409eff !important;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.dt-theme-light .dt-outline-root-node.dt-outline-selected {
  color: #fff;
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%) !important;
}

.dt-theme-light .dt-outline-level-number {
  background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

.dt-theme-light .dt-outline-bullet {
  color: #409eff;
}

.dt-theme-light .dt-outline-toggle {
  color: #909399;
  transition: color 0.2s ease;
}

.dt-theme-light .dt-outline-toggle:hover {
  color: #409eff;
}

.dt-theme-light .dt-outline-node-text {
  color: #303133;
}

.dt-theme-light .dt-outline-root-text {
  color: #fff;
}

.dt-theme-light .dt-outline-favorite {
  color: #e6a23c;
}

.dt-theme-light .dt-outline-meta {
  color: #67c23a;
}

.dt-theme-light .dt-outline-description {
  color: #909399;
}

.dt-theme-light .dt-outline-attachments {
  color: #909399;
}

/* 黑夜主题 - 深色 */
.dt-theme-dark .dt-outline-container {
  background: linear-gradient(180deg, #121212 0%, #1a1a1a 100%);
  border-left: 1px solid #333;
}

.dt-theme-dark .dt-outline-node {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  border: 1px solid #333;
  color: #ffffff;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dt-theme-dark .dt-outline-node:hover {
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%);
  border-color: #409eff;
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.dt-theme-dark .dt-outline-root-node {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border-color: #409eff;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.25);
}

.dt-theme-dark .dt-outline-selected {
  background: linear-gradient(135deg, #333333 0%, #2a2a2a 100%) !important;
  border-color: #409eff !important;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.dt-theme-dark .dt-outline-root-node.dt-outline-selected {
  color: #ffffff;
}

.dt-theme-dark .dt-outline-level-number {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

.dt-theme-dark .dt-outline-bullet {
  color: #409eff;
}

.dt-theme-dark .dt-outline-toggle {
  color: #888;
  transition: color 0.2s ease;
}

.dt-theme-dark .dt-outline-toggle:hover {
  color: #409eff;
}

.dt-theme-dark .dt-outline-node-text {
  color: #ffffff;
}

.dt-theme-dark .dt-outline-root-text {
  color: #ffffff;
}

.dt-theme-dark .dt-outline-favorite {
  color: #e6a23c;
}

.dt-theme-dark .dt-outline-meta {
  color: #67c23a;
}

.dt-theme-dark .dt-outline-description {
  color: #aaa;
}

.dt-theme-dark .dt-outline-attachments {
  color: #aaa;
}

/* 清晰主题 - 清晰易读 */
.dt-theme-presbyopia .dt-outline-container {
  background-color: #f7fafc;
}

.dt-theme-presbyopia .dt-outline-node {
  background-color: #ffffff;
  border: 2px solid #4a5568;
  color: #2d3748;
  font-size: 14px !important;
}

.dt-theme-presbyopia .dt-outline-node:hover {
  background-color: #ebf8ff;
}

.dt-theme-presbyopia .dt-outline-root-node {
  background-color: #3182ce;
  border-color: #2b6cb0;
  color: #fff;
  font-size: 16px !important;
}

.dt-theme-presbyopia .dt-outline-selected {
  background-color: #ebf8ff !important;
  border-color: #3182ce !important;
  border-width: 2px !important;
}

.dt-theme-presbyopia .dt-outline-root-node.dt-outline-selected {
  color: #fff;
}

.dt-theme-presbyopia .dt-outline-level-number {
  background-color: #3182ce;
  color: #fff;
  font-size: 13px;
  padding: 2px 10px;
}

.dt-theme-presbyopia .dt-outline-bullet {
  color: #718096;
}

.dt-theme-presbyopia .dt-outline-toggle {
  color: #718096;
  font-size: 13px;
}

.dt-theme-presbyopia .dt-outline-toggle:hover {
  color: #2d3748;
}

.dt-theme-presbyopia .dt-outline-node-text {
  color: #2d3748;
  font-size: 14px !important;
}

.dt-theme-presbyopia .dt-outline-root-text {
  color: #fff;
  font-size: 16px !important;
}

.dt-theme-presbyopia .dt-outline-favorite {
  color: #ecc94b;
  font-size: 14px;
}

.dt-theme-presbyopia .dt-outline-meta {
  color: #718096;
}

.dt-theme-presbyopia .dt-outline-description {
  color: #4a5568;
}

.dt-theme-presbyopia .dt-outline-attachments {
  color: #4a5568;
}

/* 护眼主题 - 淡黄色 */
.dt-theme-eyecare .dt-outline-container {
  background-color: #f5f5dc;
}

.dt-theme-eyecare .dt-outline-node {
  background-color: #fffff0;
  border: 2px solid #5d4037;
  color: #5d4037;
}

.dt-theme-eyecare .dt-outline-node:hover {
  background-color: #fff8dc;
}

.dt-theme-eyecare .dt-outline-root-node {
  background-color: #5d4037;
  border-color: #5d4037;
  color: #fff;
}

.dt-theme-eyecare .dt-outline-selected {
  background-color: #fff8dc !important;
  border-color: #e6a23c !important;
}

.dt-theme-eyecare .dt-outline-root-node.dt-outline-selected {
  color: #333;
}

.dt-theme-eyecare .dt-outline-level-number {
  background-color: #5d4037;
  color: #fff;
}

.dt-theme-eyecare .dt-outline-bullet {
  color: #a1887f;
}

.dt-theme-eyecare .dt-outline-toggle {
  color: #8d6e63;
}

.dt-theme-eyecare .dt-outline-toggle:hover {
  color: #5d4037;
}

.dt-theme-eyecare .dt-outline-node-text {
  color: #5d4037;
}

.dt-theme-eyecare .dt-outline-root-text {
  color: #5d4037;
}

.dt-theme-eyecare .dt-outline-favorite {
  color: #e6a23c;
}

.dt-theme-eyecare .dt-outline-meta {
  color: #8d6e63;
}

.dt-theme-eyecare .dt-outline-description {
  color: #5d4037;
}

.dt-theme-eyecare .dt-outline-attachments {
  color: #5d4037;
}

/* 搜索弹窗样式 */
.dt-search-modal {
  width: 500px;
  max-width: 90%;
}

.dt-search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.dt-search-input {
  flex: 1;
  padding: 10px 15px;
  font-size: 14px;
  border: 2px solid #409eff;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.dt-search-input:focus {
  border-color: #66b1ff;
}

.dt-search-count {
  color: #409eff;
  font-size: 13px;
  white-space: nowrap;
}

.dt-search-filter {
  margin-bottom: 10px;
}

.dt-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.dt-checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.dt-mastery-input {
  width: 40px;
  height: 24px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.dt-mastery-input:focus {
  border-color: #409eff;
}

.dt-search-results {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

.dt-search-result-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.dt-search-result-item:last-child {
  border-bottom: none;
}

.dt-search-result-item:hover {
  background-color: #ecf5ff;
}

.dt-search-result-index {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}

.dt-search-result-content {
  flex: 1;
}

.dt-search-result-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  word-break: break-word;
  overflow-y: auto;
  max-height: 80px;
}

.dt-search-highlight {
  background-color: #ffeb3b;
  color: #000;
  padding: 1px 2px;
  border-radius: 2px;
}

.dt-search-result-level {
  font-size: 12px;
  color: #999;
}

.dt-search-empty {
  text-align: center;
  color: #999;
  padding: 20px;
  font-size: 14px;
}

/* ========== 搜索标签筛选样式 ========== */
.dt-search-tags {
  margin-bottom: 12px;
}

.dt-search-tags-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.dt-search-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dt-search-tag-chip {
  display: inline-block;
  padding: 3px 10px;
  background-color: #f0f9ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.dt-search-tag-chip:hover {
  background-color: #e6f7ff;
  border-color: #409eff;
}

.dt-search-tag-active {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

.dt-search-tag-active:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.dt-search-tag-clear {
  display: inline-block;
  padding: 3px 10px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s;
}

.dt-search-tag-clear:hover {
  color: #f56c6c;
}

/* ========== 标签样式 ========== */
.dt-node-tags {
  position: absolute;
  left: 50%;
  top: 100%;
  margin-top: 1px;
  display: flex;
  flex-wrap: nowrap;
  gap: 3px;
  align-items: center;
  z-index: 10;
  pointer-events: auto;
  overflow-x: auto;
  max-width: 100%;
  transform: translateX(-50%);
}

.dt-node-tags::-webkit-scrollbar {
  height: 3px;
}

.dt-node-tags::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 2px;
}

.dt-node-tag {
  display: inline-block;
  padding: 0px 4px;
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
  border-radius: 3px;
  font-size: 10px;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: auto;
  flex-shrink: 0;
}

.dt-tag-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  margin-bottom: 15px;
}

.dt-tag-input:focus {
  border-color: #409eff;
}

.dt-all-tags {
  margin-bottom: 15px;
}

.dt-all-tags-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.dt-all-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dt-all-tag-item {
  display: inline-block;
  padding: 3px 10px;
  background-color: #f0f9ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.dt-all-tag-item:hover {
  background-color: #409eff;
  color: #fff;
  border-color: #409eff;
}

/* ========== 标签列表面板 ========== */
.dt-tag-panel {
  position: fixed;
  right: 10px;
  top: 60px;
  width: 140px;
  max-height: calc(100vh - 80px);
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 100;
  overflow-y: auto;
  transition: width 0.2s;
}

.dt-tag-panel.dt-tag-panel-collapsed {
  width: 20px;
  min-width: 20px;
  padding: 4px;
  overflow: hidden;
}

.dt-tag-panel-header {
  font-size: 13px;
  font-weight: bold;
  color: #666;
  padding-bottom: 6px;
  border-bottom: 1px solid #eee;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dt-tag-panel-collapsed .dt-tag-panel-header {
  border-bottom: none;
  margin-bottom: 0;
  justify-content: center;
}

.dt-tag-panel-toggle {
  cursor: pointer;
  color: #409eff;
  font-size: 14px;
  padding: 2px 4px;
  border-radius: 4px;
}

.dt-tag-panel-toggle:hover {
  background-color: #e6f7ff;
}

.dt-tag-panel-collapsed .dt-tag-panel-item {
  display: none;
}

.dt-tag-panel-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.dt-tag-panel-item:hover {
  background-color: #f0f0f0;
}

.dt-tag-panel-item.dt-selected {
  background-color: #e6f7ff;
}

.dt-tag-panel-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #333;
}

.dt-tag-panel-count {
  font-size: 11px;
  color: #999;
  flex-shrink: 0;
}
</style>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style>
.vel-modal {
  background-color: rgba(0, 0, 0, 0.88) !important;
}

.v-html-content p:first-child {
  margin-block-start: 8px;
}

.v-html-content p:last-child {
  margin-block-end: 4px;
}
details details {
  margin-left: 16px;
}

body.mistakebook-no-scroll {
  overflow-y: hidden;
}

.dt-blank {
  display: inline-block;
  color: transparent;
  border-bottom: 2px solid #666;
  cursor: pointer;
  user-select: none;
  padding: 0;
  margin: 0 1px;
  transition: color 0.2s;
  white-space: nowrap;
  line-height: 1.2;
  vertical-align: baseline;
  text-align: center;
}

.dt-blank-show {
  color: #000;
}
</style>
