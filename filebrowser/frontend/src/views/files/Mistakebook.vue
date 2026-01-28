<template>
  <div>
    <header-bar
      style="padding: 0.5em; height: 4em; overflow-y: hidden; overflow-x: auto"
    >
      <button
        class="action"
        @click="logout"
        :title="$t('reminder.logout')"
        style="background-color: white"
      >
        <i
          :style="{ color: currentView != 'home' ? 'red' : 'blue' }"
          class="material-icons"
          >close</i
        >
      </button>

      <span
        style="
          flex-grow: 1;
          white-space: nowrap;
          padding: 0 0.5em;
          height: 16px;
        "
      >
        PDJ错题本
      </span>
      <span style="display: flex; gap: 6px">
        <button v-if="currentView == 'add'" @click="cancelNow">取消</button>
        <button v-if="currentView == 'add'" @click="saveNow">
          {{
            showQuestionTypeSummaryModal
              ? "保存题型总结"
              : isEditing
              ? "更新错题"
              : "保存错题"
          }}
        </button>
      </span>
      <button
        class="action"
        v-if="
          currentView == 'list' ||
          currentView == 'home' ||
          currentView == 'questionTypeSummary'
        "
        @click="switchView('add')"
      >
        <i style="color: blue; font-size: 2em" class="material-icons"
          >add_circle</i
        >
      </button>
      <button
        v-if="!autoSync"
        class="action"
        @click="readFromServer(1)"
        :title="从服务器同步错题本内容"
        style="background-color: white"
      >
        <i style="color: blue" class="material-icons">cloud_download</i>
      </button>

      <button
        v-if="!autoSync"
        class="action"
        @click="saveToServer(1)"
        :title="错题本内容同步到服务器"
        style="background-color: white"
      >
        <i style="color: blue" class="material-icons">cloud_upload</i>
      </button>
      <button class="action" style="background-color: white">
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

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 首页视图 -->
      <div v-if="currentView === 'home'" style="margin-top: 18vh">
        <div class="home-view">
          <button class="home-btn" @click="switchView('list')">错题列表</button>
          <button class="home-btn" @click="switchView('cardList')">
            题卡复习
          </button>
          <button class="home-btn" @click="startTest">题卡测验</button>
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
      <div v-if="currentView === 'test'" class="test-view">
        <div class="test-header">
          <h3>题卡测验</h3>
          <div class="test-controls">
            <div class="test-progress">
              进度：{{ currentTestIndex + 1 }} /
              {{ filteredTestMistaker.length }}
            </div>
            <!-- 新增筛选按钮 -->
            <button @click="toggleTestFilter" class="filter-test-btn">
              <i class="material-icons">filter_list</i>
              筛选
            </button>
          </div>
        </div>

        <!-- 新增测试筛选面板 -->
        <div class="test-filter-panel" v-if="showTestFilterPanel">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                <label>用户：</label>
                <input
                  v-model="testFilterForm.user"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="筛选用户"
                />
              </div>

              <div class="filter-item">
                <label>科目：</label>
                <input
                  v-model="testFilterForm.subject"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="筛选科目"
                />
              </div>
              <div class="filter-item">
                <label>关键字：</label>
                <input
                  v-model="testFilterForm.keyword"
                  @change="applyTestFilter"
                  type="text"
                  placeholder="搜索题目、答案、易错点等"
                />
              </div>
            </div>

            <div class="filter-row">
              <div class="filter-checkbox">
                <label>
                  <input
                    v-model="testFilterForm.excludeTodayTested"
                    @change="applyTestFilter"
                    type="checkbox"
                  />
                  排除今日已测试题卡
                </label>
              </div>

              <div class="filter-checkbox">
                <label>
                  <input
                    v-model="testFilterForm.lastWrong"
                    @change="applyTestFilter"
                    type="checkbox"
                  />
                  仅包含最后一次做错的题卡
                </label>
              </div>

              <div class="filter-checkbox">
                <label>
                  <input
                    v-model="testFilterForm.lessThan"
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
                </label>
              </div>

              <div class="filter-checkbox">
                <label>
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
                </label>
              </div>
              <div class="filter-checkbox">
                <label>
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
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="test-content" style="flex-grow: 1">
          <!-- 当前题目显示 -->
          <div class="current-question">
            <div
              class="question-header"
              style="display: flex; justify-content: space-between"
            >
              <span style="margin: 0">
                题目 {{ currentTestIndex + 1 }} （ 题号：{{
                  filteredTestMistaker[currentTestIndex]?.id
                }}
                ）
              </span>
              <span
                style="margin: 0"
                @click="
                  editCheatSheet(filteredTestMistaker[currentTestIndex]?.user)
                "
              >
                CheatSheet
              </span>
            </div>

            <!-- 题目显示 -->
            <div
              class="original-question"
              @dblclick="openQuestionEditor(currentTestIndex)"
            >
              <strong>
                {{ filteredTestMistaker[currentTestIndex]?.user }} -
                {{ filteredTestMistaker[currentTestIndex]?.subject }} -
                {{ filteredTestMistaker[currentTestIndex]?.subClass }} -
                {{ filteredTestMistaker[currentTestIndex]?.questionType }}：
              </strong>
              <div
                v-if="filteredTestMistaker[currentTestIndex]?.question"
                v-html="filteredTestMistaker[currentTestIndex]?.question"
                class="question-text"
              ></div>
            </div>

            <!-- 答案显示区域 -->
            <div v-if="showAnswer" class="answer-section">
              <div class="answer-content">
                <strong>答案：</strong>
                <div
                  v-if="filteredTestMistaker[currentTestIndex].answer"
                  v-html="filteredTestMistaker[currentTestIndex].answer"
                  class="answer-text"
                ></div>
              </div>
            </div>
            <div v-if="showAnswer" class="result-feedback">
              <!-- 易错点 -->
              <div class="section-content">
                <div class="section-content">
                  <textarea
                    style="width: calc(100% - 8px)"
                    v-model.lazy="
                      filteredTestMistaker[currentTestIndex].correctIdea
                    "
                    rows="2"
                    placeholder="编辑易错点"
                  ></textarea>
                </div>
              </div>
            </div>
            <!-- 题目详细信息（可折叠） -->
            <div v-if="testResult !== null" class="question-details">
              <div class="details-header" @click="toggleSection('testDetails')">
                <span>题目详细信息</span>
                <span
                  class="collapse-arrow"
                  :class="{ rotated: !sections.testDetails }"
                  >▼</span
                >
              </div>

              <div v-if="sections.testDetails" class="details-content">
                <!-- 易错点 -->
                <div
                  v-if="filteredTestMistaker[currentTestIndex].correctIdea"
                  class="detail-item"
                >
                  <strong>易错点：</strong>
                  <span>{{
                    filteredTestMistaker[currentTestIndex].correctIdea
                  }}</span>
                </div>

                <!-- 错题解析 -->
                <div
                  v-if="filteredTestMistaker[currentTestIndex].errorReason"
                  class="detail-item"
                >
                  <strong>错题解析：</strong>
                  <div
                    v-html="filteredTestMistaker[currentTestIndex].errorReason"
                  ></div>
                </div>

                <!-- 考点 -->
                <div
                  v-if="filteredTestMistaker[currentTestIndex].subClass"
                  class="detail-item"
                >
                  <strong>考点：</strong>
                  <span>{{
                    filteredTestMistaker[currentTestIndex].subClass
                  }}</span>
                </div>

                <!-- 题型 -->
                <div
                  v-if="filteredTestMistaker[currentTestIndex].questionType"
                  class="detail-item"
                >
                  <strong>题型：</strong>
                  <span>{{
                    filteredTestMistaker[currentTestIndex].questionType
                  }}</span>
                </div>

                <!-- 标签 -->
                <div
                  v-if="filteredTestMistaker[currentTestIndex].errorType"
                  class="detail-item"
                >
                  <strong>标签：</strong>
                  <span>{{
                    filteredTestMistaker[currentTestIndex].errorType
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 导航按钮 -->
        <div class="test-navigation">
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
              检查答案
            </button>
          </div>
          <div v-if="showAnswer">
            <button @click="editCurrentTestQuestion" class="check-answer-btn">
              编辑此题
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
            margin-bottom: 20px;
          "
        >
          <h3 style="margin: 0">综合汇总</h3>
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
              ▶ 展开全部
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
              ▼ 收起全部
            </span>

            <button @click="openAddSubjectSummaryModal" class="add-task-btn">
              添加
            </button>
          </div>
        </div>

        <div class="summary-list" v-if="finalSubjectSummary.length">
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

              <div class="error-actions">
                <button
                  @click="editSubjectSummary(index)"
                  class="read-btn"
                  title="编辑综合汇总"
                >
                  编辑
                </button>
                <button
                  @click="deleteSubjectSummary(index)"
                  class="read-btn"
                  title="删除综合汇总"
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
                ref="htmlContainer"
                v-html="item.subjectSummary"
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
          暂无综合汇总数据！可在此记录各科思维导图，要点总结，存疑等。
        </div>
      </div>

      <!-- 综合汇总编辑框 -->
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
                  <button @click="saveNow" class="cancel-btn">保存</button>
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
                  @onChange="onChange"
                  @onCreated="onCreated1"
                />
              </div>
            </div>

            <!-- 综合汇总图片上传 -->
            <div class="form-group">
              <div>
                综合汇总图片：
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
                    alt="综合汇总图片剪裁"
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

      <!-- 题卡复习视图 -->
      <div v-if="currentView === 'cardList'" class="card-list-view">
        <div class="card-list-header">
          <h3>题卡复习 （{{ questionCards.length }}）</h3>
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
              ▶ 展开全部
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
              ▼ 收起全部
            </span>

            <!-- 新增筛选按钮 -->
            <button @click="toggleTestFilter" class="filter-test-btn">
              <i class="material-icons">filter_list</i>
              筛选
            </button>
            <!-- 新增：朗读按钮 -->
            <button
              @click="switchView('readingCard')"
              class="reading-btn"
              :disabled="questionCards.length === 0"
            >
              <i class="material-icons"></i>
              朗读题卡
            </button>
            <button
              @click="printQuestionCards"
              class="print-cards-btn"
              :disabled="questionCards.length === 0"
            >
              <i class="material-icons">print</i>
              打印题卡
            </button>
          </div>
        </div>

        <!-- 新增测试筛选面板 -->
        <div class="test-filter-panel" v-if="showTestFilterPanel">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                <label>用户：</label>
                <input
                  v-model="testFilterForm.user"
                  type="text"
                  placeholder="筛选用户"
                />
              </div>

              <div class="filter-item">
                <label>科目：</label>
                <input
                  v-model="testFilterForm.subject"
                  type="text"
                  placeholder="筛选科目"
                />
              </div>
              <div class="filter-item">
                <label>关键字：</label>
                <input
                  v-model="testFilterForm.keyword"
                  type="text"
                  placeholder="搜索题目、答案、易错点等"
                />
              </div>
            </div>

            <div class="filter-row">
              <div class="filter-checkbox">
                <label>
                  <input v-model="testFilterForm.lastWrong" type="checkbox" />
                  仅包含最后一次做错的题卡
                </label>
              </div>
              <div class="filter-checkbox">
                <label>
                  <input v-model="testFilterForm.lessThan" type="checkbox" />
                  仅包含测试次数少于
                  <input
                    v-model.lazy="testTimes"
                    type="number"
                    min="1"
                    style="width: 3em"
                  />
                  次的题卡
                </label>
              </div>

              <div class="filter-checkbox">
                <label>
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
                </label>
              </div>
              <div class="filter-checkbox">
                <label>
                  排除题号
                  <input
                    v-model.lazy="excludedID"
                    type="text"
                    placeholder="用空格分割，如5 12"
                    style="width: 10em"
                  />
                </label>
              </div>
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
                  <span @click.stop="editCheatSheet(group.user)">
                    CheatSheet
                  </span>
                </div>
              </div>

              <!-- 分组内容（可折叠） -->
              <div v-if="isGroupExpanded(group.key)" class="group-content">
                <table class="card-table">
                  <thead>
                    <tr>
                      <th style="width: 6%">序号</th>
                      <th style="width: 6%">题号</th>
                      <th style="width: 8%">历史测试</th>
                      <th style="width: 30%">题目</th>
                      <th style="width: 30%">答案</th>
                      <th style="width: 20%">易错点</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in group.cards"
                      :key="item.id"
                      :class="{
                        expanded: item.isExpanded,
                      }"
                      @click="toggleCardExpand(item.id)"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td class="text-center">{{ item.id }}</td>

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
                            {{ result === 1 ? "✓" : "✗" }}
                          </span>
                        </div>
                        <div v-else class="no-test">暂无测试</div>
                      </td>

                      <td class="answer-content">
                        <div
                          v-html="renderQuestionContent(item)"
                          @click="handleCardImageClick($event)"
                        ></div>
                      </td>
                      <td class="answer-content">
                        <div
                          :style="{
                            visibility: item.isExpanded ? 'visible' : 'hidden',
                          }"
                          v-html="renderAnswerContent(item)"
                          @click="handleCardImageClick($event)"
                        ></div>
                      </td>
                      <td class="idea-content">
                        <div
                          :style="{
                            visibility: item.isExpanded ? 'visible' : 'hidden',
                          }"
                        >
                          {{ item.correctIdea || "无" }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div v-else class="empty-tip">
            暂无题卡数据，请先添加包含题目的错题
          </div>
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
                    ref="htmlContainer"
                    v-html="item.similarText"
                  ></div>

                  <div
                    v-if="item.similarImgUrls?.length"
                    class="similar-images"
                  ></div>

                  <div v-if="item.originalText" class="original-reference">
                    <strong>原题参考：</strong>
                    <span v-html="item.originalText" ref="htmlContainer"></span>
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
                      ref="htmlContainer"
                      v-html="item.similarText"
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
          {{ showQuestionTypeSummaryModal ? "编辑题型总结" : "编辑错题" }}
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
          {{ showQuestionTypeSummaryModal ? "添加题型总结" : "添加错题" }}
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
              <div class="form-group" style="width: 50%">
                <label>用户：<span class="required">*</span></label>
                <input
                  v-model="form.user"
                  type="text"
                  placeholder="请输入用户名，多个用户用空格分开"
                  required
                />
                <!-- 用户候选列表（去重） -->
                <div class="candidate-list" v-if="uniqueUsers?.length">
                  <span class="candidate-label">已有：</span>
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
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubjects"
                    :key="`subject-${item}`"
                    @click="fillCandidate('subject', item)"
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
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueSubClasses"
                    :key="`subClass-${item}`"
                    @click="fillCandidate('subClass', item)"
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
                  <span class="candidate-label">已有：</span>
                  <span
                    class="candidate-item"
                    v-for="item in uniqueQuestionTypes"
                    :key="`questionType-${item}`"
                    @click="fillCandidate('questionType', item)"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentView == 'add'">
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
                    v-model="form.questionTypeSummary"
                    :defaultConfig="editorConfig2"
                    @onChange="onChange"
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
                  <label>错题与分析</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.mistakeItem }"
                  >
                    ▼
                  </span>
                </div>

                <div class="section-content" v-if="sections.mistakeItem">
                  <label>原题：</label>
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
                      @onChange="onChange"
                      @onCreated="onCreated4"
                    />
                  </div>

                  <div>
                    原题截图：
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

                <!-- 错题解析 -->
                <div class="section-content" v-if="sections.mistakeItem">
                  <label
                    >错题解析：

                    <a href="https://www.doubao.com/chat/" target="_blank">
                      问AI
                    </a>
                  </label>
                  <div style="border: 1px solid #ccc">
                    <!-- 工具栏 -->
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editor3"
                      mode="simple"
                      :defaultConfig="toolbarConfig"
                    />
                    <!-- 编辑器 -->
                    <Editor
                      style="height: 300px"
                      :editor="editor3"
                      mode="simple"
                      v-model="form.errorReason"
                      :defaultConfig="editorConfig3"
                      @onChange="onChange"
                      @onCreated="onCreated3"
                    />
                  </div>
                  <!-- 新增：错题解析图片上传 -->
                  <div>
                    错题解析图片：
                    <span>
                      <input
                        type="file"
                        style="display: none"
                        accept="image/*"
                        @change="previewImg('errorReason', $event)"
                        multiple
                        ref="errorReason"
                      />
                      <button class="action" @click="uploadFile(4)">
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
                    v-if="form.errorReasonImgUrls?.length"
                    class="imgs-preview"
                  >
                    <div
                      class="img-preview-item"
                      v-for="(url, index) in form.errorReasonImgUrls"
                      :key="`errorReason-${index}`"
                    >
                      <img
                        :src="url"
                        alt="错题分析图片预览"
                        @click="toCropOriginalImage(3, url, index)"
                      />
                      <span
                        class="img-delete-btn"
                        @click="deleteImg('errorReason', index)"
                        >×</span
                      >
                    </div>
                  </div>
                </div>

                <!-- 标签（多值，空格分割） -->
                <div class="section-content" v-if="sections.mistakeItem">
                  <label>标签：</label>
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
                      @click="appendCandidate('errorType', item)"
                    >
                      {{ item }}
                    </span>
                  </div>
                </div>

                <!-- 难度（七星评分） -->
                <div class="section-content" v-if="sections.mistakeItem">
                  <label>难度：</label>
                  <div class="star-rating" @click.stop>
                    <span
                      class="star"
                      v-for="star in 7"
                      :key="`add-star-${star}`"
                      :class="{ active: star <= form.importantLevel }"
                      @click="setImportantLevel('form', star)"
                    >
                      ★
                    </span>
                    <span class="rating-text">{{ form.importantLevel }}级</span>
                  </div>
                </div>
              </div>

              <!-- 题卡 -->
              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('questionCard')"
                >
                  <label>题卡</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.questionCard }"
                  >
                    ▼
                  </span>
                </div>

                <div class="section-content" v-if="sections.questionCard">
                  <label>题目： </label>
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
                      @onChange="onChange"
                      @onCreated="onCreated"
                    />
                  </div>
                </div>

                <div class="section-content" v-if="sections.questionCard">
                  <label>答案： </label>
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
                      @onChange="onChange"
                      @onCreated="onCreated6"
                    />
                  </div>
                </div>

                <!-- 易错点 -->
                <div class="section-content" v-if="sections.questionCard">
                  <label>易错点：</label>

                  <div class="section-content">
                    <textarea
                      v-model="form.correctIdea"
                      rows="3"
                      placeholder="填写易错点，将出现在题卡打印中。"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div class="form-group collapsible-section">
                <div
                  class="section-header"
                  @click="toggleSection('questionTypeSum')"
                >
                  <label>题型总结 - {{ form.questionType }}</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.questionTypeSum }"
                  >
                    ▼
                  </span>
                </div>

                <div class="section-content" v-if="sections.questionTypeSum">
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
                      @onChange="onChange"
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
                  @click="toggleSection('improveMethod')"
                >
                  <label>日积月累</label>
                  <span
                    class="collapse-arrow"
                    :class="{ rotated: !sections.improveMethod }"
                  >
                    ▼
                  </span>
                </div>
                <div class="section-content" v-if="sections.improveMethod">
                  <textarea
                    :disabled="!(form.subject?.trim() && form.subClass?.trim())"
                    v-model="form.improveMethod"
                    rows="3"
                    placeholder="添加日常日积月累任务以提高此考点掌握程度。如：每周默写语文课后生词；每日背诵10个英语单词；每日练习一篇完型填空；平日积累语文写作好词好句等。"
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
                <div class="section-content" v-if="sections.similar">
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
                      @onChange="onChange"
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
                <div class="section-content" v-if="sections.trap">
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
                      @click="fillCandidate('trap', item)"
                    >
                      {{ item }}
                    </span>
                  </div>

                  <!-- 备用详解编辑框（当备用不为空时显示） -->
                  <div class="form-group" v-if="form.trap">
                    <label>备用详解：</label>
                    <textarea
                      v-model="form.trapDetail"
                      rows="3"
                      placeholder="请输入此备用的具体表现、识别方法和应对策略"
                    ></textarea>
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
            v-if="isReadingCard"
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
          <div v-if="isReadingCard" class="reading-controls">
            <button @click="pauseResumeReading" class="control-btn">
              {{ speechState.isPaused ? "继续" : "暂停" }}
            </button>
          </div>

          <button @click="toggleReadingCards" class="primary-btn">
            {{ isReadingCard ? "停止朗读" : "开始朗读" }}
          </button>

          <!-- 朗读控制按钮 -->
          <div v-if="isReadingCard" class="reading-controls">
            <button @click="skipCurrentCard" class="control-btn">跳过</button>
          </div>
        </div>
      </div>

      <!-- 错题列表视图 -->
      <div
        v-if="currentView === 'list'"
        class="list-view"
        @click="stopReading()"
      >
        <div class="list-view-header">
          <h3 style="margin: 0">错题列表</h3>
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

            <!-- 现有筛选控制按钮保持不变 -->
            <div style="display: flex; align-items: center; gap: 10px">
              <div class="filter-header" @click="toggleFilter">
                <span class="filter-arrow" :class="{ up: isFilterOpen }"
                  >↓</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 筛选区域保持不变 -->
        <div class="filter-section" v-if="isFilterOpen">
          <div class="filter-form">
            <div class="filter-row">
              <div>
                <input v-model="reverseList" type="checkbox" />
                <label>题号倒序排列</label>
              </div>
              <div class="filter-item">
                <label>关键字：</label>
                <input
                  v-model="filterForm.keyword"
                  type="text"
                  placeholder="多个关键字用空格分开"
                />
              </div>
              <div class="filter-item">
                <label>题号：</label>
                <input
                  v-model.number="filterForm.id"
                  type="number"
                  placeholder="请输入题号"
                  min="1"
                />
              </div>
              <div class="filter-item">
                <label>用户：</label>
                <input
                  v-model="filterForm.user"
                  type="text"
                  placeholder="请输入用户名"
                />
              </div>
              <div class="filter-item">
                <label>添加日期：</label>
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
            </div>
            <div class="filter-row">
              <div class="filter-item">
                <label>科目：</label>
                <input
                  v-model="filterForm.subject"
                  type="text"
                  placeholder="请输入科目"
                />
              </div>
              <div class="filter-item">
                <label>考点：</label>
                <input
                  v-model="filterForm.subClass"
                  type="text"
                  placeholder="输入关键词筛选（如：函数）"
                />
              </div>
              <div class="filter-item">
                <label>标签：</label>
                <input
                  v-model="filterForm.errorType"
                  type="text"
                  placeholder="输入关键词筛选（如：计算错误）"
                />
              </div>
            </div>
            <div class="filter-row">
              <div class="filter-item">
                <label>错题解析：</label>
                <input
                  v-model="filterForm.errorReason"
                  type="text"
                  placeholder="输入关键词筛选（如：马虎）"
                />
              </div>
              <div class="filter-item">
                <label>难度：</label>
                <div class="range-input">
                  <input
                    v-model.number="filterForm.importantLevelStart"
                    type="number"
                    placeholder="最低"
                    min="1"
                    max="7"
                    class="range-start"
                  />
                  <span class="range-sep">至</span>
                  <input
                    v-model.number="filterForm.importantLevelEnd"
                    type="number"
                    placeholder="最高"
                    min="1"
                    max="7"
                    class="range-end"
                  />
                </div>
              </div>
              <!--
              <div class="filter-item">
                <label>是否填写举一反三：</label>
                <select v-model="filterForm.hasSimilar">
                  <option value="">全部</option>
                  <option value="yes">是</option>
                  <option value="no">否</option>
                </select>
              </div>
              -->
              <div class="filter-actions">
                <button @click="handleFilter" class="filter-btn">筛选</button>
                <button @click="resetFilter" class="reset-btn">重置</button>
              </div>
            </div>
          </div>
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
                >
                  <!-- 复用现有的错题项显示代码 -->
                  <div class="error-header">
                    <span
                      >{{ index + 1 }}/{{ currentTreeMistaker.length }}</span
                    >
                    <span class="error-id">题号：{{ item.id }}</span>
                    <span>
                      <strong>{{ item.user }}</strong
                      >&nbsp;-&nbsp;{{ item.subject }}
                    </span>
                    <span class="error-date">{{
                      formatDateWithWeek(item.addDate)
                    }}</span>
                  </div>

                  <div class="error-content">
                    <div>
                      <div
                        style="display: flex; justify-content: space-between"
                      >
                        <strong>原题：</strong>
                        <div v-if="!isMobile" class="error-footer">
                          <div class="error-importance">
                            <div class="star-rating" @click.stop>
                              <span
                                class="star"
                                v-for="star in 7"
                                :key="`list-star-${item.id}-${star}`"
                                :class="{ active: star <= item.importantLevel }"
                                @click="
                                  setImportantLevel('list', star, item.id)
                                "
                              >
                                ★
                              </span>
                            </div>
                          </div>
                          <div class="error-actions">
                            <button class="read-btn" @click="editError(item)">
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
                      </div>
                      <div
                        v-if="item.originalText"
                        v-html="item.originalText"
                        ref="htmlContainer"
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
                      <strong>错题解析：</strong>
                      <div v-html="item.errorReason" ref="htmlContainer"></div>
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

                    <p v-if="item.subClass && item.subClass.trim()">
                      <strong>考点：</strong>{{ item.subClass }}
                    </p>

                    <div v-if="item.questionType && item.questionType.trim()">
                      <strong>题型：</strong>{{ item.questionType }}
                    </div>

                    <!-- 标签 -->
                    <p v-if="item.errorType && item.errorType.trim()">
                      <strong>标签：</strong>{{ item.errorType }}
                    </p>
                    <!-- 题目 -->
                    <div
                      v-if="item.question && item.question.trim()"
                      style="margin: 16px 0"
                    >
                      <strong>题卡题目：</strong>
                      <div v-html="item.question" ref="htmlContainer"></div>
                    </div>

                    <!-- 答案 -->
                    <div
                      v-if="item.answer && item.answer.trim()"
                      style="margin: 16px 0"
                    >
                      <strong>答案：</strong>
                      <div v-html="item.answer" ref="htmlContainer"></div>
                    </div>

                    <!-- 易错点 -->
                    <p v-if="item.correctIdea && item.correctIdea.trim()">
                      <strong>易错点：</strong>{{ item.correctIdea }}
                    </p>

                    <!-- 备用 -->
                    <p v-if="item.trap && item.trap.trim()">
                      <strong>备用：</strong>{{ item.trap }}
                      <span
                        v-if="item.trapDetail && item.trapDetail.trim()"
                        style="color: #666; margin-left: 10px"
                      >
                        | 详解：{{ item.trapDetail }}
                      </span>
                    </p>

                    <!-- 完善方法 -->
                    <p v-if="item.improveMethod && item.improveMethod.trim()">
                      <strong>日积月累：</strong>{{ item.improveMethod }}
                    </p>
                    <!-- 举一反三 -->
                    <div
                      v-if="
                        (item.similarText && item.similarText.trim()) ||
                        (item.similarImgUrls && item.similarImgUrls.length > 0)
                      "
                    >
                      <strong>举一反三：</strong>
                      <div v-html="item.similarText" ref="htmlContainer"></div>
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
          >
            <div class="error-header">
              <span>{{ index + 1 }}/{{ showMistaker.length }}</span>
              <span class="error-id">题号：{{ item.id }}</span>
              <span>
                <strong>{{ item.user }}</strong
                >&nbsp;-&nbsp;{{ item.subject }}
              </span>
              <span class="error-date">{{
                formatDateWithWeek(item.addDate)
              }}</span>
            </div>

            <div class="error-content">
              <div>
                <div style="display: flex; justify-content: space-between">
                  <strong>原题：</strong>
                  <div v-if="!isMobile" class="error-footer">
                    <div class="error-importance">
                      <div class="star-rating" @click.stop>
                        <span
                          class="star"
                          v-for="star in 7"
                          :key="`list-star-${item.id}-${star}`"
                          :class="{ active: star <= item.importantLevel }"
                          @click="setImportantLevel('list', star, item.id)"
                        >
                          ★
                        </span>
                      </div>
                    </div>
                    <div class="error-actions">
                      <button class="read-btn" @click="editError(item)">
                        编辑
                      </button>
                      <button class="read-btn" @click="deleteError(item.id)">
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
                </div>
                <div
                  v-if="item.originalText"
                  v-html="item.originalText"
                  ref="htmlContainer"
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
                <strong>错题解析：</strong>
                <div v-html="item.errorReason" ref="htmlContainer"></div>
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

              <p v-if="item.subClass && item.subClass.trim()">
                <strong>考点：</strong>{{ item.subClass }}
              </p>

              <div v-if="item.questionType && item.questionType.trim()">
                <strong>题型：</strong>{{ item.questionType }}
              </div>

              <!-- 标签 -->
              <p v-if="item.errorType && item.errorType.trim()">
                <strong>标签：</strong>{{ item.errorType }}
              </p>

              <!-- 备用 -->
              <p v-if="item.trap && item.trap.trim()">
                <strong>备用：</strong>{{ item.trap }}
                <span
                  v-if="item.trapDetail && item.trapDetail.trim()"
                  style="color: #666; margin-left: 10px"
                >
                  | 详解：{{ item.trapDetail }}
                </span>
              </p>

              <!-- 完善方法 -->
              <p v-if="item.improveMethod && item.improveMethod.trim()">
                <strong>日积月累：</strong>{{ item.improveMethod }}
              </p>
              <!-- 修复：p标签不能嵌套div，改为div -->
              <div
                v-if="
                  (item.similarText && item.similarText.trim()) ||
                  (item.similarImgUrls && item.similarImgUrls.length > 0)
                "
              >
                <strong>举一反三：</strong>
                <div v-html="item.similarText" ref="htmlContainer"></div>
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

              <!-- 题目 -->
              <div
                v-if="item.question && item.question.trim()"
                style="margin: 16px 0"
              >
                <strong>题卡题目：</strong>
                <div v-html="item.question" ref="htmlContainer"></div>
              </div>

              <!-- 答案 -->
              <div
                v-if="item.answer && item.answer.trim()"
                style="margin: 16px 0"
              >
                <strong>答案：</strong>
                <div v-html="item.answer" ref="htmlContainer"></div>
              </div>

              <!-- 易错点 -->
              <p v-if="item.correctIdea && item.correctIdea.trim()">
                <strong>易错点：</strong>{{ item.correctIdea }}
              </p>
            </div>
            <div v-if="isMobile" class="error-footer">
              <div class="error-importance">
                <div class="star-rating" @click.stop>
                  <span
                    class="star"
                    v-for="star in 7"
                    :key="`list-star-${item.id}-${star}`"
                    :class="{ active: star <= item.importantLevel }"
                    @click="setImportantLevel('list', star, item.id)"
                  >
                    ★
                  </span>
                </div>
              </div>
              <div class="error-actions">
                <button class="read-btn" @click="editError(item)">编辑</button>
                <button class="read-btn" @click="deleteError(item.id)">
                  删除
                </button>
                <button class="read-btn" @click.stop="startReading(index)">
                  朗读
                </button>
              </div>
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
                        style="
                          margin: 0;
                          border: none;
                          border-radius: 0;
                          border-bottom: 3px solid white;
                        "
                        v-for="item in questionTypeGroup.errors"
                        :key="item.id"
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
                              "
                            >
                              <strong>原题：</strong>
                              <div v-if="!isMobile" class="error-footer">
                                <div class="error-importance">
                                  <div class="star-rating" @click.stop>
                                    <span
                                      class="star"
                                      v-for="star in 7"
                                      :key="`list-star-${item.id}-${star}`"
                                      :class="{
                                        active: star <= item.importantLevel,
                                      }"
                                      @click="
                                        setImportantLevel('list', star, item.id)
                                      "
                                    >
                                      ★
                                    </span>
                                  </div>
                                </div>
                                <div class="error-actions">
                                  <button
                                    class="read-btn"
                                    @click="editError(item)"
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
                            </div>
                            <div
                              v-if="item.originalText"
                              ref="htmlContainer"
                              v-html="item.originalText"
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
                          <p v-if="item.errorType && item.errorType.trim()">
                            <strong>标签：</strong>{{ item.errorType }}
                          </p>

                          <!-- 错题解析 -->
                          <div
                            v-if="item.errorReason && item.errorReason.trim()"
                            style="margin: 16px 0"
                          >
                            <strong>错题解析：</strong>
                            <div
                              v-html="item.errorReason"
                              ref="htmlContainer"
                            ></div>
                            <div
                              v-if="item.errorReasonImgUrls?.length"
                              class="small-imgs-wrap"
                            ></div>
                          </div>

                          <!-- 备用 -->
                          <p v-if="item.trap && item.trap.trim()">
                            <strong>备用：</strong>{{ item.trap }}
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
                            <strong>本题型提高方法：</strong
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
                            <strong>举一反三：</strong>
                            <div
                              v-html="item.similarText"
                              ref="htmlContainer"
                            ></div>
                            <br />
                            <template v-if="item.similarImgUrls?.length">
                              <div class="small-imgs-wrap"></div>
                            </template>
                          </div>

                          <!-- 题目 -->
                          <div
                            v-if="item.question && item.question.trim()"
                            style="margin: 16px 0"
                          >
                            <strong>题卡题目：</strong>
                            <div
                              v-html="item.question"
                              ref="htmlContainer"
                            ></div>
                          </div>

                          <!-- 答案 -->
                          <div
                            v-if="item.answer && item.answer.trim()"
                            style="margin: 16px 0"
                          >
                            <strong>答案：</strong>
                            <div v-html="item.answer" ref="htmlContainer"></div>
                          </div>

                          <!-- 易错点 -->
                          <p v-if="item.correctIdea && item.correctIdea.trim()">
                            <strong>易错点：</strong>{{ item.correctIdea }}
                          </p>
                        </div>

                        <div v-if="isMobile" class="error-footer">
                          <div class="error-importance">
                            <div class="star-rating" @click.stop>
                              <span
                                class="star"
                                v-for="star in 7"
                                :key="`list-star-${item.id}-${star}`"
                                :class="{ active: star <= item.importantLevel }"
                                @click="
                                  setImportantLevel('list', star, item.id)
                                "
                              >
                                ★
                              </span>
                            </div>
                          </div>
                          <div class="error-actions">
                            <button class="read-btn" @click="editError(item)">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-tip">
          {{ mistaker.length === 0 ? "暂无错题数据，请添加错题" : "" }}
        </div>
      </div>
      <!-- 日常任务视图 -->
      <div v-if="currentView === 'task'" class="task-view">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
          "
        >
          <h3 style="margin: 0">日常日积月累任务列表</h3>
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
                  v-model="task.completedToday"
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
        <div v-else class="empty-tip">暂无日常日积月累任务。</div>
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
                placeholder="请输入日常日积月累任务内容"
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
          <h3 style="margin: 0">题型总结</h3>
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
              ▶ 展开全部
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
              ▼ 收起全部
            </span>

            <div class="filter-header" @click="toggleQuestionTypeSummaryFilter">
              <span
                class="filter-arrow"
                :class="{ up: isQuestionTypeSummaryFilterOpen }"
                >↓</span
              >
            </div>
          </div>
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section" v-if="isQuestionTypeSummaryFilterOpen">
          <div class="filter-form">
            <div class="filter-row">
              <div class="filter-item">
                <label>关键字：</label>
                <input
                  v-model="questionTypeSummaryFilterForm.keyword"
                  type="text"
                  placeholder="多个关键字用空格分开"
                />
              </div>
              <div class="filter-item">
                <label>难度：</label>
                <div class="range-input">
                  <input
                    v-model.number="
                      questionTypeSummaryFilterForm.importantLevelStart
                    "
                    type="number"
                    placeholder="最低"
                    min="1"
                    max="7"
                    class="range-start"
                  />
                  <span class="range-sep">至</span>
                  <input
                    v-model.number="
                      questionTypeSummaryFilterForm.importantLevelEnd
                    "
                    type="number"
                    placeholder="最高"
                    min="1"
                    max="7"
                    class="range-end"
                  />
                </div>
              </div>
              <div class="filter-actions">
                <button
                  @click="handleQuestionTypeSummaryFilter"
                  class="filter-btn"
                >
                  筛选
                </button>
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
                      <div class="star-rating" @click.stop>
                        <span
                          class="star"
                          v-for="star in 7"
                          :key="`list-star-${questionType}-${star}`"
                          :class="{
                            active: star <= summaryData.importantLevel,
                          }"
                          @click="
                            setImportantLevel(
                              'questionType',
                              star,
                              questionType
                            )
                          "
                        >
                          ★
                        </span>
                      </div>
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
                    ref="htmlContainer"
                    v-html="summaryData.summary || '暂无总结'"
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
                  <div class="star-rating" @click.stop>
                    <span
                      class="star"
                      v-for="star in 7"
                      :key="`list-star-${questionType}-${star}`"
                      :class="{ active: star <= summaryData.importantLevel }"
                      @click="
                        setImportantLevel('questionType', star, questionType)
                      "
                    >
                      ★
                    </span>
                  </div>
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
                ? "暂无题型总结数据，请在添加错题时填写题型总结"
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
          暂无备用总结数据，请在添加错题时填写备用和备用详解
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
            <button @click="openPrintCheatSheetModal" class="print-cards-btn">
              <i class="material-icons">print</i>
              打印CheatSheet
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
              ▶ 展开全部
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
              ▼ 收起全部
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
                <h4>
                  {{ group.user }} - {{ formatDateWithWeek(group.latestDate) }}
                </h4>
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
                    ref="htmlContainer"
                    v-html="item.cheatSheet || '暂无内容'"
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
          暂无CheatSheet数据！可在此记录各科速记要点、公式、关键知识点等。
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
              <span>用户和日期：<span class="required">*</span></span>
              <span class="modal-actions">
                <button @click="closeCheatSheetModal" class="cancel-btn">
                  取消
                </button>
                <button @click="saveCheatSheet" class="cancel-btn">保存</button>
              </span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center">
              <input
                v-model="cheatSheetForm.user"
                type="text"
                style="flex: 1"
                placeholder="请输入用户"
                required
              />
              <input
                v-model="cheatSheetForm.addDate"
                type="date"
                style="flex: 1"
                required
              />
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
                @onChange="onChange"
                @onCreated="onCreatedCheatSheet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗（新增读取/保存错题本功能） -->
    <div class="modal" v-if="showSettingModal">
      <div
        class="modal-content"
        style="
          max-width: 800px;
          height: 88%;
          padding-top: 24px;
          overflow-y: auto;
        "
      >
        <div style="display: flex; justify-content: space-between">
          <span style="font-weight: 600">系统设置</span>
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
            开启服务器自动同步功能
          </h5>
          <div>
            为了方便用户备份错题本，所有文字和图片数据都保存在同一个.json文件中。因此，该文件可能较大。开启此项后，任何对错题本的修改都会自动上传到服务器(不会进行提示)，可能会消耗大量流量。在移动网络，请勿开次此项，可点击导航栏的上传图标进行手动同步。注：无论是否开启此项，每次登录或刷新浏览器后都会自动从服务器校验错题本更新时间。若有不同，将提示是否进行下载。(此设置仅对当前浏览器有效)
          </div>
          <br />
          <br />

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
            <div class="upload-wrap">
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
        </div>
        <div class="setting-divider"></div>

        <div class="setting-item">
          <label>清空错题本数据：</label>
          <button
            @click="confirmClearData"
            class="data-btn clear-btn"
            style="background-color: #e74c3c"
          >
            清空当前错题本所有数据
          </button>
          <p class="setting-tip" style="color: #e74c3c">
            警告：此操作将永久删除所有错题、题型总结、综合汇总和任务数据等，不可恢复！请在清空前做好备份。并且，若已开启服务器自动同步功能，将会同步清空服务器上的错题本内容！
          </p>
        </div>
      </div>
    </div>

    <!-- 图片查看器模态框 -->
    <vue-easy-lightbox
      :visible="showImageViewer"
      :imgs="lightboxImgsFinal"
      :index="0"
      @hide="closeImageViewer"
      :moveDisabled="false"
      :zoomScale="0.2"
      :rotate-disabled="false"
      :min-zoom-scale="0.2"
      :max-zoom-scale="10"
      :transition-time="0"
      :zoom-speed="1"
    >
    </vue-easy-lightbox>
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
        <button @click="clearAll" class="clear-btn">退出</button>
      </div>

      <!-- 复制成功提示 -->
      <div class="copy-toast" v-if="showToast">复制成功！</div>
    </div>
    <!-- 题目编辑弹窗 -->
    <div class="modal" v-if="showQuestionEditor">
      <div
        class="modal-content"
        style="
          max-width: 900px;
          height: 80vh;
          display: flex;
          flex-direction: column;
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          "
        >
          <h3>编辑题目</h3>
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
            v-model="editingQuestionContent"
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
          <span> CheatSheet {{ form.user }} {{ form.addDate }} </span>
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
          <!-- 工具栏 -->
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor2"
            mode="simple"
            :defaultConfig="toolbarConfig"
          />
          <!-- 编辑器 -->
          <Editor
            style="height: 188px"
            :editor="editor2"
            mode="simple"
            v-model.lazy="form.cheatSheet"
            :defaultConfig="editorConfig2"
            @onChange="onChange"
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
                  v-html="item.cheatSheet || '暂无内容'"
                ></div>
              </div>
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
      showPrintCheatSheetModal: false, // 控制打印模态框显示
      selectedCheatSheetIds: [], // 选中的CheatSheet项ID
      printCheatSheetData: [],
      cheatSheetExpanded: {},
      isAllCheatSheetExpanded: true,
      showCheatSheetModal: false,
      editingCheatSheetIndex: -1,
      editingCheatSheetItemIndex: -1,
      cheatSheetForm: {
        user: "",
        addDate: "",
        cheatSheet: "",
      },
      editorCheatSheet: null,
      processing: false,
      subjectSummaryExpanded: {}, // 控制综合汇总项的展开状态
      isAllSubjectSummaryExpanded: true, // 控制全部展开/收起状态
      showQuestionEditor: false,
      editingQuestionContent: "",
      currentEditingTestIndex: -1,
      editorQuestion: null, // 新增编辑器实例
      excludedID: "",
      correctDays: 5,
      testTimes: 3,
      testInterval: "0 1 3 7 15 30 60",
      isWaitingForClick: false, // 是否在等待点击继续
      continueClickListener: null, // 点击继续的事件监听器
      autoPauseAfterReading: false,
      currentUtterance: null,
      speechState: {
        isPaused: false,
        isSpeaking: false,
      },
      isReadingCard: false, // 是否正在朗读题卡
      currentReadingCardIndex: -1, // 当前朗读的题卡索引
      currentReadingCardText: "", // 当前朗读的文本内容
      isAllCardGroupsExpanded: false,
      expandedCardGroups: new Set(),
      expandedCardIds: new Set(),
      inputText: "",
      resultText: "",
      options: {
        withTone: true, // 是否显示声调
      },
      showToast: false,
      showPinYinTool: false,
      filteredTestMistaker: [],
      showTestFilterPanel: false,
      testFilterForm: {
        keyword: "", // 关键字筛选
        user: "", // 用户筛选
        subject: "", // 科目筛选
        lastWrong: false,
        excludeTodayTested: true, // 排除今日已测试
        excludeFiveCorrect: true, // 排除5次正确
        lessThan: false,
        allowInterval: true,
      },
      currentTestIndex: 0, // 当前测试题目的索引
      showAnswer: false, // 是否显示答案
      testResult: null, // 当前题目的测试结果（正确/错误）
      isTesting: false, // 是否正在测试中
      listViewMode: "flat", // 'tree' 树形导航模式, 'flat' 平铺模式, 'group' 分组模式
      // 新增：树形导航相关状态
      selectedTreePath: "", // 当前选中的树节点路径
      expandedTreeNodes: new Set(), // 展开的树节点
      imageListeners: [],
      serverModifiedTime: 0,
      lastModifiedTime: 0,
      fromPage: "",
      selectedSimilarIds: [], // 选中的举一反三题目ID
      showPaperPreview: false, // 显示试卷预览
      selectedSimilarItems: [], // 选中的题目数据
      reverseList: true,
      cons: true,
      onOff: false,
      timeOutId1: null,
      autoSync: window.localStorage.getItem("autoSync") == "true" || false,
      isReadingQuestionTypeSummary: false,
      currentReadingQuestionTypeIndex: -1,
      tItem: null,
      isQuestionTypeSummaryFilterOpen: false,
      questionTypeSummaryFilterForm: {
        keyword: "", // 关键字（多值，用空格分割）
        importantLevelStart: "", // 难度最低值
        importantLevelEnd: "", // 难度最高值
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
        questionTypeSum: false, // 题型总结
        improveMethod: false, // 日积月累
        similar: false, // 举一反三
        trap: false, // 备用
        testDetails: false, // 新增：测试详情折叠状态
      },
      subjectClicked: "",
      lightboxImgsFinal: null,
      editor: null,
      editor1: null,
      editor2: null,
      editor3: null,
      editor4: null,
      editor5: null,
      editor6: null,
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        excludeKeys: [
          "uploadVideo",
          "fullScreen",
          "|",
          "clearStyle",
          "blockquote",
          "codeBlock",
        ],
        insertKeys: {
          index: 0,
          keys: ["myMenu", "fontSize"],
        },
      },
      editorConfig1: {
        placeholder: "请输入此科目的学习要点、重点难点、学习方法等...",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
          "若该题型有大量简单题目(如语文-字词-会写字)，可在此归纳总结，以免频繁添加为错题。也可在此总结题型易错点...（此输入框支持直接粘贴图片）",
        autoFocus: true,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
        placeholder:
          "请输入原题文字描述(不含答案)，也支持上传或粘贴原题图片(请尽量使用文字描述，图片可能会影响题卡打印的排版)...",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
      editorConfig5: {
        placeholder: "同类新题，可用于生成新试卷：文字描述（可选）",
        // autoFocus: false,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
        placeholder: "答案区，请尽量使用文字描述，图片可能会影响题卡打印的排版",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
        placeholder: "请输入题目（不含答案）",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
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
        placeholder: "编辑题卡题目...",
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
      showQuestionTypeSummaryModal: false, // 新增：控制题型总结显示
      questionTypeImgUrls: [],
      isSplitting: false,
      cropAsNewImage: true,
      angle: 90,
      selectedDate: "",
      fromPic: 0,
      imgSrc: "", // 原始图片 URL
      cropper: null, // Cropper 实例
      tempIndex: 0,
      isReading: false,
      currentReadingIndex: -1,
      isFilterOpen: false,
      tempUser: "",
      tempSubject: "",
      tempSubClass: "",
      tempQuestiontype: "",
      // 当前视图：home(首页)/add(添加)/list(列表)/task(任务)
      currentView: "home",
      // 是否处于编辑状态
      isEditing: false,
      // 当前编辑的错题ID
      editingId: null,
      // 错题数组
      mistaker: [],
      // 筛选后的错题数组
      filteredMistaker: [],
      // 日常日积月累任务列表
      taskList: [],
      // 设置弹窗显示状态
      showSettingModal: false,
      // 图片查看器相关状态
      showImageViewer: false, // 图片查看器显示状态
      // 添加错题表单数据（修改图片为数组）
      form: {
        addDate: "",
        user: "",
        subject: "",
        subClass: "",
        originalText: "", // 原题文字描述
        originalImgUrls: [], // 原题照片URL数组（多图）
        question: "",
        answer: "",
        questionTypeImgUrls: [], // 新增：题型总结图片数组
        errorReasonImgUrls: [],
        questionType: "", // 新增：题型
        questionTypeSummary: "", // 新增：题型总结
        subjectSummary: "", // 新增：综合汇总
        subjectImgUrls: [], // 新增：综合汇总图片数组
        trap: "", // 新增：备用
        trapDetail: "", // 新增：备用详解
        errorType: "",
        errorReason: "",
        correctIdea: "",
        improveMethod: "",
        similarText: "",
        similarImgUrls: [], // 举一反三照片URL数组（多图）
        importantLevel: 4, // 难度（1-7级，默认4级）
      },
      // 筛选表单数据
      filterForm: {
        id: "", // 题号
        user: "", // 用户
        startDate: "", // 添加日期开始
        endDate: "", // 添加日期结束
        subject: "", // 科目
        subClass: "", // 考点
        errorType: "", // 标签
        errorReason: "", // 错题解析关键词
        hasSimilar: "", // 是否有举一反三：''(全部)/yes(是)/no(否)
        importantLevelStart: "", // 难度最低值
        importantLevelEnd: "", // 难度最高值
        keyword: "",
      },
    };
  },
  computed: {
    ...mapState(["user"]),
    showMistaker() {
      const list =
        this.filteredMistaker.length > 0
          ? this.filteredMistaker
          : this.mistaker;
      if (!this.reverseList) return list;
      // 按题号降序排列（由大到小）
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

      // 关键字筛选
      const keywordStr = this.questionTypeSummaryFilterForm.keyword
        .trim()
        .toLowerCase();
      if (keywordStr) {
        const keywords = keywordStr?.split(/\s+/).filter(Boolean);
        if (keywords.length > 0) {
          Object.keys(result).forEach((key) => {
            const item = result[key];
            const searchText = [
              key, // 题型名称（包含用户-科目-考点-题型）
              item.summary || "", // 总结内容
            ]
              .join(" ")
              .toLowerCase();

            // 检查是否包含所有关键字（AND 逻辑）
            const hasAllKeywords = keywords.every((keyword) =>
              searchText.includes(keyword)
            );
            if (!hasAllKeywords) {
              delete result[key];
            }
          });
        }
      }

      // 难度范围筛选
      const startLevel = this.questionTypeSummaryFilterForm.importantLevelStart;
      const endLevel = this.questionTypeSummaryFilterForm.importantLevelEnd;

      if (startLevel || endLevel) {
        Object.keys(result).forEach((key) => {
          const item = result[key];
          const level = item.importantLevel || 4;

          if (startLevel && !endLevel) {
            if (level < startLevel) delete result[key];
          } else if (!startLevel && endLevel) {
            if (level > endLevel) delete result[key];
          } else if (startLevel && endLevel) {
            if (level < startLevel || level > endLevel) delete result[key];
          }
        });
      }

      // 将对象转换为数组并按照 dIndex 排序
      const sortedEntries = Object.entries(result)
        .map(([key, value]) => {
          // 找到对应的 finalQuestionTypeSummary 项获取 dIndex
          const summaryItem = this.finalQuestionTypeSummary.find(
            (item) =>
              item.user?.trim() +
                "►" +
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
              dIndex: summaryItem?.dIndex || 0, // 如果没有 dIndex 则默认为 0
            },
          };
        })
        .sort((a, b) => b.value.dIndex - a.value.dIndex); // 从大到小排序

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
      ];
    },

    questionCards() {
      let result = this.mistaker.filter((item) => item.question?.trim());
      // 关键字筛选
      if (this.testFilterForm.keyword.trim()) {
        const keyword = this.testFilterForm.keyword.trim().toLowerCase();
        result = result.filter((item) => {
          const searchText = [
            item.question || "",
            item.answer || "",
            item.correctIdea || "",
            item.subClass || "",
            item.questionType || "",
          ]
            .join(" ")
            .toLowerCase();

          return searchText.includes(keyword);
        });
      }

      // 用户筛选
      if (this.testFilterForm.user.trim()) {
        const user = this.testFilterForm.user.trim().toLowerCase();
        result = result.filter((item) =>
          item.user.toLowerCase().includes(user)
        );
      }

      // 科目筛选
      if (this.testFilterForm.subject.trim()) {
        const subject = this.testFilterForm.subject.trim().toLowerCase();
        result = result.filter((item) =>
          item.subject.toLowerCase().includes(subject)
        );
      }

      // 最后一次为错的题卡
      if (this.testFilterForm.lastWrong) {
        result = result.filter((item) => {
          // 确保 reviewResult 存在且是数组
          if (!item.reviewResult || item.reviewResult.length === 0) {
            return false;
          }

          // 获取最后一个元素并检查是否为 0
          const lastResult = item.reviewResult[item.reviewResult.length - 1];
          return lastResult === 0;
        });
      }
      // 只包含测试次数少于n次的题卡
      if (this.testFilterForm.lessThan) {
        result = result.filter((item) => {
          // 确保 reviewResult 存在且是数组
          if (!item.reviewResult || item.reviewResult.length < this.testTimes) {
            return true;
          } else return false;
        });
      }
      const excludeIdSet = new Set(
        this.excludedID
          ?.split(" ")
          .filter((id) => id)
          .map((id) => id.trim())
      );
      result = result.filter((item) => {
        const targetId = String(item.id).trim();
        return !excludeIdSet.has(targetId);
      });

      // 排除最后n次正确
      if (this.testFilterForm.excludeFiveCorrect) {
        result = result.filter((item) => {
          // 保留 reviewResult 不存在或不是数组的元素
          if (!item.reviewResult || !Array.isArray(item.reviewResult))
            return true;

          // 从数组末尾开始统计连续的正确数（1）
          let continuousCorrectCount = 0;
          // 倒序遍历 reviewResult 数组
          for (let i = item.reviewResult.length - 1; i >= 0; i--) {
            // 遇到1则计数+1，遇到0则终止循环（连续正确被打断）
            if (item.reviewResult[i] === 1) {
              continuousCorrectCount++;
            } else {
              break;
            }
          }

          // 只排除最后连续正确数 >= correctDays（5）的元素
          return continuousCorrectCount < this.correctDays;
        });
      }

      return result.map((item) => ({
        ...item,
        isExpanded: this.expandedCardIds.has(item.id), // 这里会自动响应式更新
      }));
    },

    // 题型总结 - 只显示当前科目和考点的题型
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
      ];
    },

    isAllTreeNodesExpanded() {
      if (this.treeNavigationData.length === 0) return true;

      // 计算理论上应该展开的节点总数
      let expectedCount = 0;
      this.treeNavigationData.forEach((subject) => {
        expectedCount++; // 科目节点
        expectedCount += subject.children.length; // 考点节点
      });

      return this.expandedTreeNodes.size >= expectedCount;
    },

    // 检查是否所有节点都已收起
    isAllTreeNodesCollapsed() {
      return this.expandedTreeNodes.size === 0;
    },

    // 标签列表 - 只显示当前科目、考点和题型的标签，始终包含三个默认值
    uniqueErrorTypes() {
      // 三个初始默认值
      const defaultErrorTypes = [
        "低级错误",
        "陷阱",
        "知识遗忘",
        "思路错误",
        "易错点",
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

      // 合并默认值和筛选值，去重
      const combinedTypes = [...defaultErrorTypes, ...filteredErrorTypes];
      return [...new Set(combinedTypes)];
    },

    isMobile() {
      return window.innerWidth < 736;
    },
    // 提取不重复的用户列表
    uniqueUsers() {
      const userFromMistaker = [
        ...new Set(
          this.mistaker.map((item) => item.user?.trim()).filter(Boolean)
        ),
      ];

      const userFromSummary = [
        ...new Set(
          this.finalQuestionTypeSummary
            .map((item) => item.user?.trim())
            .filter(Boolean)
        ),
      ];
      return [...new Set([...userFromMistaker, ...userFromSummary])];
    },
    // 提取不重复的科目列表
    uniqueSubjects() {
      if (!this.form.user?.trim()) {
        return [];
      }
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

    // 按题型分组的数据
    questionTypeMap() {
      const map = {};
      this.finalQuestionTypeSummary.forEach((item) => {
        if (item.questionType?.trim() && item.questionTypeSummary) {
          const type =
            item.user?.trim() +
            "►" +
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

      // 先按照科目->考点->题型排序
      const sorted = [...this.showMistaker].sort((a, b) => {
        // 科目排序
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
    uniqueTraps() {
      return [
        ...new Set(
          this.mistaker.map((item) => item.trap?.trim()).filter(Boolean)
        ),
      ];
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

      // 转换为树形结构数组
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
        // 创建分组键：用户-科目-考点-题型
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
        const key = `${item.user}-${item.addDate}`;
        if (!groups[key]) {
          groups[key] = {
            key: key,
            user: item.user,
            addDate: item.addDate,
            latestDate: item.addDate,
            items: [],
          };
        }
        groups[key].items.push(item);
      });

      // 转换为数组并按日期降序排序
      return Object.values(groups)
        .sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate))
        .map((group) => ({
          ...group,
          items: group.items.sort(
            (a, b) => new Date(b.addDate) - new Date(a.addDate)
          ),
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
            item.user === this.form.user?.trim() &&
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
    autoSync() {
      window.localStorage.setItem("autoSync", this.autoSync);
    },
    currentView(newView) {
      if (newView != "add") {
        this.isEditing = false;
        this.editingId = null;
      }
    },
    "form.subject": {
      handler(newSubject, oldSubject) {
        // 只有当科目实际发生变化时才执行检查
        if (newSubject?.trim() !== oldSubject?.trim()) {
          this.$nextTick(() => {
            this.checkAndClearFields1();
          });
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
        if (this.autofill[0]) this.form.questionTypeSummary = this.autofill[0];
        if (this.autofill[1]?.length != 0)
          this.form.questionTypeImgUrls = this.autofill[1];
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
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    correctDays() {
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    testTimes() {
      if (this.timeOutId1) clearTimeout(this.timeOutId1);
      this.timeOutId1 = setTimeout(() => {
        this.saveToForage();
      }, 200);
    },
    excludedID() {
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
  },
  updated() {
    // 内容更新后重新绑定（先移除旧事件，再绑定新事件）
    this.$nextTick(() => {
      this.unbindImageClick();
      this.bindImageClick();
    });
  },

  beforeDestroy() {
    this.stopReadingCards();
    this.stopReading();
    this.unbindImageClick();
    if (this.timeOutId1) clearTimeout(this.timeOutId1);
    if (this.cropper) {
      this.cropper.destroy();
    }
    if (this.editor) this.editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
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
  },
  methods: {
    splitUsers(userStr) {
      if (!userStr) return [];
      return userStr.trim().split(/\s+/).filter(Boolean);
    },

    // 获取第一个用户（用于编辑时保留原题）
    getFirstUser(userStr) {
      const users = this.splitUsers(userStr);
      return users.length > 0 ? users[0] : "";
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
              <th width="32%">题目</th>
              <th width="30%">答案</th>
              <th width="20%">易错点</th>
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

          content += `
        <tr>
          <td class="text-center"></td>
          <td class="text-center">${card.id}</td>
          <td class="question-content">${questionContent || "无题目内容"}</td>
          <td class="answer-content">
            ${answerContent || "无"}
           </td>
           <td class="question-content">${card.correctIdea || ""}</td>
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
      let result = this.mistaker.filter((item) => item.question?.trim());

      const today = new Date().toLocaleDateString("sv-SE");
      const today1 = new Date();
      today1.setHours(0, 0, 0, 0); // 把时分秒毫秒都置为0，得到今天0点
      const todayTimestamp = today1.getTime();
      // 关键字筛选
      if (this.testFilterForm.keyword.trim()) {
        const keyword = this.testFilterForm.keyword.trim().toLowerCase();
        result = result.filter((item) => {
          const searchText = [
            item.question || "",
            item.answer || "",
            item.correctIdea || "",
            item.subClass || "",
            item.questionType || "",
          ]
            .join(" ")
            .toLowerCase();

          return searchText.includes(keyword);
        });
      }
      // 今日测试到期题卡筛选
      if (this.testFilterForm.allowInterval) {
        result = result.filter((item) => {
          const a = item.reviewDate;
          const aDate = new Date(a);
          aDate.setHours(0, 0, 0, 0);
          const aTimestamp = aDate.getTime();
          const timeDiff = todayTimestamp - aTimestamp;
          const dayDiff = Math.floor(Math.abs(timeDiff) / 86400000); // 取绝对值后向下取整
          if (!item.reviewResult) item.reviewResult = [];
          if (!this.testInterval) this.testInterval = "0 1 3 7 15 30 60";
          if (
            item.reviewResult &&
            this.testInterval?.split(" ")[item.reviewResult?.length] &&
            this.testInterval?.split(" ")[item.reviewResult?.length] <= dayDiff
          )
            return true;
          else return false;
        });
      }

      // 用户筛选
      if (this.testFilterForm.user.trim()) {
        const user = this.testFilterForm.user.trim().toLowerCase();
        result = result.filter((item) =>
          item.user.toLowerCase().includes(user)
        );
      }

      // 科目筛选
      if (this.testFilterForm.subject.trim()) {
        const subject = this.testFilterForm.subject.trim().toLowerCase();
        result = result.filter((item) =>
          item.subject.toLowerCase().includes(subject)
        );
      }

      // 排除今日已测试
      if (this.testFilterForm.excludeTodayTested) {
        result = result.filter((item) => {
          if (!item.reviewDate || item.reviewDate == 0) return true;
          const testDate = new Date(item.reviewDate).toLocaleDateString(
            "sv-SE"
          );
          return testDate !== today;
        });
      }

      // 最后一次为错的题卡
      if (this.testFilterForm.lastWrong) {
        result = result.filter((item) => {
          // 确保 reviewResult 存在且是数组
          if (!item.reviewResult || item.reviewResult.length === 0) {
            return false;
          }

          // 获取最后一个元素并检查是否为 0
          const lastResult = item.reviewResult[item.reviewResult.length - 1];
          return lastResult === 0;
        });
      }

      // 只包括测试次数少于n次的题目
      if (this.testFilterForm.lessThan) {
        result = result.filter((item) => {
          if (!item.reviewResult || item.reviewResult?.length < this.testTimes)
            return true;
          else return false;
        });
      }

      // 排除最后5次正确
      if (this.testFilterForm.excludeFiveCorrect) {
        result = result.filter((item) => {
          // 保留 reviewResult 不存在或不是数组的元素
          if (!item.reviewResult || !Array.isArray(item.reviewResult))
            return true;

          // 从数组末尾开始统计连续的正确数（1）
          let continuousCorrectCount = 0;
          // 倒序遍历 reviewResult 数组
          for (let i = item.reviewResult.length - 1; i >= 0; i--) {
            // 遇到1则计数+1，遇到0则终止循环（连续正确被打断）
            if (item.reviewResult[i] === 1) {
              continuousCorrectCount++;
            } else {
              break;
            }
          }

          // 只排除最后连续正确数 >= correctDays（5）的元素
          return continuousCorrectCount < this.correctDays;
        });
      }

      this.filteredTestMistaker = result;

      // 重置测试进度
      this.currentTestIndex = 0;
    },
    toggleReadingCards() {
      if (this.isReadingCard) {
        this.stopReadingCards();
      } else {
        this.startReadingCards();
        this.switchView("readingCard");
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
      this.currentReadingCardIndex = 0;
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

      // 易错点
      if (card.correctIdea) {
        answerTextToRead += `易错点：${card.correctIdea}`;
      }

      // 如果没有答案内容，直接进入下一题
      if (!answerTextToRead.trim()) {
        this.moveToNextCard();
        return;
      }

      // 更新当前朗读文本
      this.currentReadingCardText +=
        "\n" + answerTextToRead.replace("。。。。。。。", "\n");

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

    // 新增：添加继续点击监听器
    addContinueClickListener(type) {
      this.continueClickListener = () => {
        if (this.isWaitingForClick && this.isReadingCard) {
          this.continueReading(type);
        }
      };
      document.addEventListener("click", this.continueClickListener);
    },

    // 新增：移除继续点击监听器
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
      this.currentReadingCardIndex = -1;
      this.currentReadingCardText = "";
      this.speechState.isPaused = false;
      this.speechState.isSpeaking = false;
    },

    // 跳过当前题卡
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
      }
    },

    // 暂停/继续朗读
    pauseResumeReading() {
      if (this.isReadingCard) {
        if (this.speechState.isPaused) {
          window.speechSynthesis.resume();
          this.speechState.isPaused = false;
          this.speechState.isSpeaking = true;
        } else {
          window.speechSynthesis.pause();
          this.speechState.isPaused = true;
          this.speechState.isSpeaking = false;
        }
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
          const uniqueId = `${group.key}-${item.addDate || "no-date"}`;
          this.printCheatSheetData.push({
            ...item,
            uniqueId: uniqueId,
            groupInfo: `${group.user} - ${this.formatDateWithWeek(
              group.latestDate
            )}`,
          });
        });
      });
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

    // 在 methods 中添加以下方法
    handleCheckboxClick(uniqueId, event) {
      // 阻止事件冒泡到父元素
      event.stopPropagation();
      this.toggleCheatSheetSelection(uniqueId);
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

    // 生成打印内容
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
          
          /* 保持v-html的基本样式 */
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
            "服务器上的错题本有更新，是否下载？移动网络请注意流量！文件大小：" +
              size +
              "MB"
          )
        ) {
          this.readFromServer();
        }
      }
    },
    bindImageClick() {
      // 1. 先确保ref存在且过滤无效值
      const containers = Array.isArray(this.$refs.htmlContainer)
        ? this.$refs.htmlContainer.filter(Boolean)
        : this.$refs.htmlContainer
        ? [this.$refs.htmlContainer]
        : [];

      if (containers.length === 0) {
        return;
      }

      // 2. 处理异步渲染：用延时+轮询确保v-html内容加载完成
      const checkAndBind = () => {
        containers.forEach((container) => {
          const allImgsInContainer = container.querySelectorAll("img");
          const vHtmlImgs = Array.from(allImgsInContainer).filter((img) => {
            const isAttachImg =
              img.classList.contains("small-img") ||
              img.closest(".attachment-wrap") ||
              img.closest(".imgs-preview");
            return !isAttachImg; // 只保留v-html里的img
          });
          // 5. 绑定点击事件
          vHtmlImgs.forEach((img) => {
            // 先移除旧事件，避免重复绑定
            img.removeEventListener("click", this.vHtmlImgClickHandler);
            // 绑定新事件（用命名函数，方便移除）
            img.addEventListener("click", this.vHtmlImgClickHandler);
          });
        });
      };

      // 6. 优先等nextTick，再轮询一次（应对异步加载的v-html）
      this.$nextTick(() => {
        checkAndBind();
        // 兜底：如果nextTick里还没，100ms后再查一次（可调整时长）
        setTimeout(checkAndBind, 100);
      });
    },

    toggleTestFilter() {
      // 如果当前是打开状态，只是关闭面板，不重置筛选
      if (this.showTestFilterPanel) {
        this.showTestFilterPanel = false;
      } else {
        // 如果当前是关闭状态，打开面板
        this.showTestFilterPanel = true;
      }
      // 移除原来的重置逻辑
    },

    // 重置测试筛选
    resetTestFilter() {
      this.testFilterForm = {
        keyword: "",
        user: "",
        subject: "",
        lastWrong: false,
        excludeTodayTested: true,
        excludeFiveCorrect: true,
        lessThan: false,
        allowInterval: false,
      };
      // 移除关闭面板的逻辑，让用户可以选择是否关闭
      // this.showTestFilterPanel = false;
    },

    // 修改开始测试方法，应用筛选
    startTest() {
      this.applyTestFilter();
      this.currentTestIndex = 0;
      this.showAnswer = false;
      this.testResult = null;
      const testPool = this.filteredTestMistaker;
      this.isTesting = true;
      this.currentView = "test";
      if (testPool.length === 0) {
        setTimeout(() => {
          alert("今日无待测试题卡！可改变筛选条件重新选择题卡。");
        }, 100);
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

    selectTreeNode(nodePath) {
      this.selectedTreePath = nodePath;
    },

    isTreeNodeExpanded(nodePath) {
      return this.expandedTreeNodes.has(nodePath);
    },
    toggleCardExpand(cardId) {
      // 创建新的Set以确保响应式更新
      const newSet = new Set(this.expandedCardIds);

      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }

      // 赋值新的Set来触发响应式更新
      this.expandedCardIds = newSet;
    },

    expandAllTreeNodes() {
      // 创建新的Set实例以确保响应式更新
      const newSet = new Set();

      // 遍历树形数据，添加所有可展开节点的路径
      this.treeNavigationData.forEach((subject) => {
        // 添加科目节点
        newSet.add(subject.name);

        // 添加科目下的所有考点节点
        subject.children.forEach((subClass) => {
          const subClassPath = `${subject.name}|${subClass.name}`;
          newSet.add(subClassPath);

          // 如果需要展开到题型层级，可以取消注释下面的代码
          // subClass.children.forEach((questionType) => {
          //   const questionTypePath = `${subject.name}|${subClass.name}|${questionType.name}`;
          //   newSet.add(questionTypePath);
          // });
        });
      });

      // 使用Vue.set或直接赋值以确保响应式
      this.expandedTreeNodes = newSet;
    },

    collapseAllTreeNodes() {
      // 清空所有展开状态
      this.expandedTreeNodes = new Set();
    },

    // 移除图片点击事件
    unbindImageClick() {
      this.imageListeners.forEach((item) => {
        item.el.removeEventListener("click", item.handler);
        // 清除标记
        delete item.el.dataset.clickBound;
      });
      // 清空存储
      this.imageListeners = [];
    },

    toggleQuestionTypeSummaryFilter() {
      this.isQuestionTypeSummaryFilterOpen =
        !this.isQuestionTypeSummaryFilterOpen;
    },

    // 新增：处理题型总结筛选
    handleQuestionTypeSummaryFilter() {
      // 难度输入验证
      const start = this.questionTypeSummaryFilterForm.importantLevelStart;
      const end = this.questionTypeSummaryFilterForm.importantLevelEnd;

      if (
        (start && (start < 1 || start > 7)) ||
        (end && (end < 1 || end > 7))
      ) {
        alert("难度只能输入1-7之间的数字！");
        return;
      }

      if (start && end && start > end) {
        alert("难度最低值不能大于最高值！");
        return;
      }

      // 筛选后隐藏筛选条件
      this.isQuestionTypeSummaryFilterOpen = false;

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
        importantLevelStart: "",
        importantLevelEnd: "",
      };
      this.isQuestionTypeSummaryFilterOpen = false;
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

    editCheatSheet(b) {
      let cs = this.finalCheatSheet.find((item) => {
        if (
          item.user == b &&
          item.addDate == new Date().toLocaleDateString("sv-SE")
        )
          return true;
        else return false;
      });
      if (cs) {
        this.form.addDate = cs.addDate;
        this.form.user = cs.user;
        this.form.cheatSheet = cs.cheatSheet;
      } else {
        this.form.addDate = new Date().toLocaleDateString("sv-SE");
        this.form.user = b;
        this.form.cheatSheet = "";
      }
      this.showCSModal = true;
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

      const questionType = questionTypeKeys[index];
      const summaryData = this.questionTypeMapFiltered[questionType];

      // 构建要朗读的文本内容
      let textToRead = `题型：${questionType}。`;

      if (summaryData.summary && summaryData.summary.trim()) {
        // 去除HTML标签，只朗读文本内容
        const div = document.createElement("div");
        div.innerHTML = summaryData.summary;
        const plainText = div.textContent || div.innerText || "";
        textToRead += `总结要点：${plainText}。`;
      } else {
        textToRead += "暂无总结内容。";
      }

      // 创建语音合成实例
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

    // 删除任务
    deleteTask(index) {
      if (confirm("确定要删除这个任务吗？此操作不可恢复！")) {
        this.taskList.splice(index, 1);
        alert("任务删除成功！");
      }
    },
    toggleTaskCompletion(task) {
      if (task.completedToday) {
        // 如果勾选，添加今日日期到完成历史（去重）
        if (!task.completionHistory) {
          task.completionHistory = [];
        }

        if (!task.completionHistory?.includes(this.todayDate)) {
          task.completionHistory.push(this.todayDate);
          // 按日期排序
          task.completionHistory.sort((a, b) => new Date(b) - new Date(a));
        }
        task.completedToday = false;
      }
    },

    // 切换单个综合汇总项的展开状态
    toggleSubjectSummary(index) {
      this.$set(
        this.subjectSummaryExpanded,
        index,
        !this.subjectSummaryExpanded[index]
      );
    },

    // 检查单个综合汇总项是否展开
    isSubjectSummaryExpanded(index) {
      return this.subjectSummaryExpanded[index] !== false; // 默认为展开
    },

    // 全部展开
    expandAllSubjectSummaries() {
      this.finalSubjectSummary.forEach((_, index) => {
        this.$set(this.subjectSummaryExpanded, index, true);
      });
      this.isAllSubjectSummaryExpanded = true;
    },

    // 全部收起
    collapseAllSubjectSummaries() {
      this.finalSubjectSummary.forEach((_, index) => {
        this.$set(this.subjectSummaryExpanded, index, false);
      });
      this.isAllSubjectSummaryExpanded = false;
    },

    // 切换全部展开/收起
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
      if (this.showSubjectSummaryModal) this.updateSList();
      else if (this.showQuestionTypeSummaryModal) {
        this.updateQList();
        this.switchView("questionTypeSummary");
      } else if (this.isEditing) this.updateError();
      else this.saveError();
    },
    cancelNow() {
      if (this.showSubjectSummaryModal) this.closeSubjectSummaryModal();
      else if (this.isEditing) {
        this.isEditing = false;
        if (this.showQuestionTypeSummaryModal)
          this.switchView("questionTypeSummary");
        else {
          if (this.fromPage == "1") this.switchView("printPaper");
          else if (this.fromPage == "2") this.switchView("test");
          else this.switchView("list");
        }
      } else if (this.showQuestionTypeSummaryModal) {
        this.switchView("questionTypeSummary");
      } else this.switchView("home");
      this.fromPage = "";
    },
    // 初始化 Cropper
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
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
    onCreated6(editor) {
      this.editor6 = Object.seal(editor);
    },
    onChange(editor) {
      if (editor == null) return;
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
              item.questionType === this.form.questionType.trim() // 新增
          )?.improveMethod || "";
      } else {
        this.form.improveMethod = "";
      }
    },

    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;
      // console.log(editor.getText()); // 执行 editor API
    },
    initCropper() {
      if (this.$refs.image && this.imgSrc) {
        this.cropper = new Cropper(this.$refs.image, {
          aspectRatio: 0, // 裁剪框宽高比
          viewMode: 0, // 视图模式
          dragMode: "move", // 拖拽模式
          autoCropArea: 0.58, // 自动裁剪区域
          background: false, // 是否显示背景
          responsive: true, // 响应式
          restore: true, // 恢复裁剪区域
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

      // 遍历所有分组并设置展开/收起状态
      this.groupedMistaker.forEach((subjectGroup) => {
        const subjectKey = subjectGroup.subject;

        // 设置科目分组状态
        this.$set(
          this.collapsedStates.subject,
          subjectKey,
          !this.isAllExpanded
        );

        subjectGroup.subClasses.forEach((subClassGroup) => {
          const subClassKey = `${subjectGroup.subject}-${subClassGroup.subClass}`;

          // 设置考点分组状态
          this.$set(
            this.collapsedStates.subClass,
            subClassKey,
            !this.isAllExpanded
          );

          subClassGroup.questionTypes.forEach((questionTypeGroup) => {
            const questionTypeKey = `${subjectGroup.subject}-${subClassGroup.subClass}-${questionTypeGroup.questionType}`;

            // 设置题型分组状态
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
      const user = id?.split("►")[0];
      const subject = id?.split("►")[1];
      const subClass = id?.split("►")[2];
      const questionType = id?.split("►")[3];
      this.tItem = this.finalQuestionTypeSummary.find(
        (item) =>
          item.user === user &&
          item.subject === subject &&
          item.subClass === subClass &&
          item.questionType === questionType
      );
      this.form = {
        user: user,
        subject: subject,
        subClass: subClass,
        questionType: questionType || "",
        questionTypeSummary: this.tItem?.questionTypeSummary || "", // 新增
        questionTypeImgUrls: this.tItem?.questionTypeImgUrls || [], // 新增
      };
      this.switchView("add");
    },

    deleteQuestionType(id) {
      if (!confirm("确定要删除此项题型总结吗？此操作不可恢复！")) {
        return;
      }
      const user = id?.split("►")[0];
      const subject = id?.split("►")[1];
      const subClass = id?.split("►")[2];
      const questionType = id?.split("►")[3];
      const tItem = this.finalQuestionTypeSummary.find(
        (item) =>
          item.user === user &&
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
      // 先切换当前层级的折叠状态
      this.$set(this.collapsedStates[type], key, !currentState);

      // 如果当前是展开状态（即将折叠），则处理下级层级的折叠
      if (!currentState) {
        if (type === "subject") {
          // 点击科目时，折叠其下所有考点和题型
          const subjectGroup = this.groupedMistaker.find(
            (group) => group.subject === key
          );
          if (subjectGroup) {
            // 折叠所有考点
            subjectGroup.subClasses.forEach((subClassGroup) => {
              const subClassKey = `${key}-${subClassGroup.subClass}`;
              this.$set(this.collapsedStates.subClass, subClassKey, true);

              // 折叠该考点下的所有题型
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
          // 点击考点时，折叠其下所有题型
          // 解析科目和考点名称
          const [subject, subClass] = key.split("-");
          const subjectGroup = this.groupedMistaker.find(
            (group) => group.subject === subject
          );
          if (subjectGroup) {
            const subClassGroup = subjectGroup.subClasses.find(
              (sc) => sc.subClass === subClass
            );
            if (subClassGroup) {
              // 折叠该考点下的所有题型
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

    // 检查答案
    checkAnswer() {
      this.showAnswer = true;
    },

    // 记录答题结果
    recordAnswer(isCorrect) {
      const currentQuestion = this.filteredTestMistaker[this.currentTestIndex];

      // 确保有reviewDate属性
      if (
        !Object.prototype.hasOwnProperty.call(currentQuestion, "reviewDate")
      ) {
        currentQuestion.reviewDate = 0;
      }

      // 确保有reviewResult属性
      if (
        !Object.prototype.hasOwnProperty.call(currentQuestion, "reviewResult")
      ) {
        currentQuestion.reviewResult = [];
      }

      // 记录当前测试时间
      currentQuestion.reviewDate = Date.now();

      // 记录答题结果：1表示正确，0表示错误
      currentQuestion.reviewResult.push(isCorrect ? 1 : 0);

      this.testResult = isCorrect;
    },

    // 下一题
    nextQuestion() {
      this.showAnswer = false;
      this.testResult = null;

      if (this.currentTestIndex < this.filteredTestMistaker.length - 1) {
        this.currentTestIndex++;
      } else {
        this.finishTest();
      }
    },

    // 完成测试
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

    // 关闭综合汇总弹窗
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

    // 获取裁剪后的图片
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
          // 新增科目图片
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
          // 新增科目图片
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

    // 旋转图片
    rotate(degrees) {
      if (this.cropper) {
        this.cropper.rotate(degrees);
      }
    },

    // 缩放图片
    scale(scaleX, scaleY) {
      if (this.cropper) {
        this.cropper.scale(scaleX, scaleY || scaleX);
      }
    },

    logout() {
      if (this.currentView != "home") {
        this.resetForm();
        this.switchView("home");
        this.fromPage = "";
        this.selectedDate = "";
        return;
      }
      this.isEditingSubjectSummary = false;
      this.isEditing = false;
      this.isEditingTask = false;
      auth.logout();
    },
    // 新增：拆分图片为多道错题
    async splitImagesToNewQuestions() {
      if (this.isSplitting) return;

      // 验证必填字段
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

        // 保存当前表单的基础数据
        const baseData = {
          addDate: this.form.addDate,
          user: this.form.user?.trim() || "",
          subject: this.form.subject?.trim() || "",
        };
        // 依次为每张图片创建错题
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
            importantLevel: i === 0 ? this.form.importantLevel || 4 : 4,
          };

          console.log(`第 ${i + 1} 道错题数据：`, newError);

          // 验证数据完整性
          if (!newError.user || !newError.subject) {
            throw new Error(`第 ${i + 1} 道错题缺少必要字段：用户或科目`);
          }

          // 添加到错题数组
          this.mistaker.push(newError);
          console.log(`第 ${i + 1} 道错题添加成功`);

          // 如果第一题选择了加入日常任务，则添加任务
          // 短暂延迟
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        console.log("拆分完成，总错题数：", this.mistaker.length);
        alert(`成功拆分为 ${this.form.originalImgUrls.length} 道错题！`);

        // 重置表单并返回首页
        this.resetForm();
        this.switchView("home");
      } catch (error) {
        console.error("拆分图片失败详情：", error);

        // 提供更具体的错误信息
        if (error.message.includes("缺少必要字段")) {
          alert(`拆分失败：${error.message}`);
        } else {
          alert(`拆分失败，请重试！错误详情：${error.message}`);
        }

        // 回滚操作：移除可能已添加的部分数据
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
      this.editError(item); // 复用错题列表的编辑功能
    },

    // 删除举一反三题目
    deleteSimilarItem(id) {
      this.deleteError(id); // 复用错题列表的删除功能
      // 从选中的题目中移除（如果被选中）
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
      // 如果正在朗读则先停止
      if (this.isReading) {
        this.stopReading();
      }

      this.isReading = true;
      this.currentReadingIndex = index;
      this.readItem(index);
    },

    // 朗读指定索引的错题
    readItem(index) {
      // 检查索引是否有效
      if (index < 0 || index >= this.showMistaker.length) {
        this.isReading = false;
        this.currentReadingIndex = -1;
        return;
      }

      const item = this.showMistaker[index];
      // 构建要朗读的文本内容
      let textToRead = `题号${item.id}。`;
      textToRead += `用户${item.user}，科目${item.subject}。`;
      if (item.originalText) textToRead += `原题：${item.originalText}。`;
      if (item.errorType) textToRead += `标签：${item.errorType}。`;
      if (item.question) textToRead += `题目：${item.question}。`;
      if (item.answer) textToRead += `答案：${item.answer}。`;
      if (item.errorReason) textToRead += `错题解析：${item.errorReason}。`;
      if (item.improveMethod)
        textToRead += `本题型提高方法：${item.improveMethod}。`;
      if (item.similarText) textToRead += `举一反三：${item.similarText}。`;
      if (item.correctIdea) textToRead += `易错点：${item.correctIdea}。`;
      // 创建语音合成实例
      const utterance = new SpeechSynthesisUtterance(textToRead);
      // 设置语音属性
      utterance.lang = "zh-CN";
      utterance.rate = 0.9; // 语速稍慢便于听清楚

      // 朗读结束时触发
      utterance.onend = () => {
        // 自动朗读下一题
        this.currentReadingIndex++;
        this.readItem(this.currentReadingIndex);
      };

      // 朗读出错时停止
      utterance.onerror = () => {
        this.isReading = false;
        this.currentReadingIndex = -1;
      };

      // 开始朗读
      window.speechSynthesis.speak(utterance);
    },

    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen;
    },

    // 修改 updateError 方法
    updateError() {
      const users = this.splitUsers(this.form.user);
      if (
        users.length === 0 ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户、科目、考点、题型为必填项，用以归纳汇总！");
        return;
      }

      this.updateTList();
      this.updateQList();

      // 找到要更新的错题索引
      const index = this.mistaker.findIndex(
        (item) => item.id === this.editingId
      );
      if (index !== -1) {
        // 更新原错题为第一个用户
        const firstUser = this.getFirstUser(this.form.user);
        let formData = { ...this.form };
        delete formData.questionTypeSummary;
        delete formData.questionTypeImgUrls;

        this.mistaker.splice(index, 1, {
          ...formData,
          id: this.editingId,
          user: firstUser,
        });

        // 为其他用户创建新错题
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

        this.isEditing = false;
        alert(
          `成功更新错题！，${
            otherUsers.length > 0
              ? `并为其他 ${otherUsers.length} 个用户创建了新题`
              : ""
          }`
        );

        if (this.fromPage == "1") this.switchView("printPaper");
        else if (this.fromPage == "2") this.switchView("test");
        else this.switchView("list");

        // 重置表单
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
          // 如果为空，则删除该任务
          const index = this.taskList.findIndex(
            (item) =>
              item.subject === this.form.subject.trim() &&
              item.subClass === this.form.subClass.trim() &&
              item.questionType === this.form.questionType.trim()
          );
          if (index > -1) {
            // splice(起始索引, 删除数量)
            this.taskList.splice(index, 1);
          }
          return;
        }
        tl.improveMethod = this.form.improveMethod?.trim(); // 新增
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
          improveMethod: this.form.improveMethod?.trim(), // 新增
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
          subjectSummary: this.form.subjectSummary?.trim() || "", // 新增
          subjectImgUrls: [...this.form.subjectImgUrls] || [], // 新增
        };
        this.finalSubjectSummary.push(newSubjectSummary);
      }
      alert("综合汇总已保存！");
      this.closeSubjectSummaryModal();
    },

    updateCList() {
      const cs = this.finalCheatSheet.find(
        (item) =>
          item.user === this.form.user && item.addDate == this.form.addDate
      );
      if (cs) {
        cs.cheatSheet = this.form.cheatSheet;
      } else {
        const newItem = {
          addDate: this.form.addDate || 0,
          user: this.form.user?.trim() || "", // 新增
          cheatSheet: this.form.cheatSheet || "", // 新增
        };
        this.finalCheatSheet.push(newItem);
      }
      alert("CheatSheet已保存！");
      this.showCSModal = false;
    },

    updateQList() {
      if (
        !this.form.user?.trim() ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户名、科目、考点、题型为必填项，用以归纳汇总！");
        return;
      }
      if (this.isEditing && this.showQuestionTypeSummaryModal) {
        if (
          this.tItem.user !== this.form.user.trim() ||
          this.tItem.subject !== this.form.subject.trim() ||
          this.tItem.subClass !== this.form.subClass.trim() ||
          this.tItem.questionType !== this.form.questionType.trim()
        ) {
          const index = this.finalQuestionTypeSummary.findIndex(
            (item) => item === this.tItem
          );
          if (index > -1) {
            this.finalQuestionTypeSummary.splice(index, 1);
          }
        }
      }

      let qs = this.finalQuestionTypeSummary.find(
        (item) =>
          item.user === this.form.user.trim() &&
          item.subject === this.form.subject.trim() &&
          item.subClass === this.form.subClass.trim() &&
          item.questionType === this.form.questionType.trim()
      );
      if (qs) {
        qs.dIndex = Date.now();
        qs.questionTypeSummary = this.form.questionTypeSummary?.trim() || ""; // 新增
        qs.questionTypeImgUrls = [...(this.form.questionTypeImgUrls || [])]; // 新增
      } else if (
        this.form.subClass.trim() &&
        this.form.questionType.trim() &&
        this.form.user.trim()
      ) {
        const newA = {
          dIndex: Date.now(),
          user: this.form.user.trim(),
          subject: this.form.subject.trim(),
          subClass: this.form.subClass.trim(),
          questionType: this.form.questionType.trim(),
          questionTypeSummary: this.form.questionTypeSummary.trim(), // 新增
          questionTypeImgUrls: [...this.form.questionTypeImgUrls], // 新增
          importantLevel: 4,
        };
        this.finalQuestionTypeSummary.push(newA);
      }
      if (this.isEditing) this.switchView("questionTypeSummary");
      else this.switchView("home");
      if (this.isEditing) {
        this.isEditing = false;
        return;
      }
    },

    // 切换视图
    switchView(view) {
      if (view !== "readingCard" && this.isReadingCard) this.stopReadingCards();
      if (this.currentView == "questionTypeSummary" && view == "add")
        this.showQuestionTypeSummaryModal = true;
      else this.showQuestionTypeSummaryModal = false;
      this.currentView = view;
      // 切换到添加视图时重置表单
      if (view === "add") {
        if (!this.isEditing) {
          this.selectedDate = new Date().toLocaleDateString("sv-SE");
          this.resetForm();
        }
      }
      // 切换到列表视图时重置筛选
      if (view === "list") {
        this.isAllExpanded = true;
        this.toggleExpandAll();
        this.resetFilter();
      }
    },
    // 显示设置弹窗
    showSetting() {
      this.showSettingModal = true;
    },

    // 多图预览处理（支持多选文件）
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
            // 新增科目图片处理
            this.form.subjectImgUrls.push(ev.target.result);
          }
        };
        reader.readAsDataURL(file);
      });

      e.target.value = "";
    },

    selectAllSimilar() {
      this.selectedSimilarIds = this.filteredSimilarItems.map(
        (item) => item.id
      );
    },

    // 全不选
    deselectAllSimilar() {
      this.selectedSimilarIds = [];
    },

    // 生成试卷
    generatePaper() {
      if (this.selectedSimilarIds.length === 0) {
        alert("请至少选择一道题目！");
        return;
      }

      // 获取选中的题目数据
      this.selectedSimilarItems = this.mistaker.filter((item) =>
        this.selectedSimilarIds.includes(item.id)
      );

      this.showPaperPreview = true;
    },

    // 关闭试卷预览
    closePaperPreview() {
      this.showPaperPreview = false;
    },

    // 打印试卷
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

      // 等待内容加载完成后打印
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    },
    handleCardImageClick(event) {
      // 检查点击的是否是图片元素
      if (event.target.tagName === "IMG") {
        event.stopPropagation(); // 阻止事件冒泡
        this.openImageViewer(event.target.src);
      }
    },
    // 删除单张预览图片
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
        // 新增科目图片删除
        this.form.subjectImgUrls.splice(index, 1);
      }
    },

    // 重置添加错题表单（图片数组重置为空）
    resetForm() {
      this.form = {
        addDate: this.selectedDate,
        user: this.tempUser,
        subject: this.tempSubject,
        subClass: this.tempSubClass,
        originalText: "",
        originalImgUrls: [], // 重置为空数组
        question: "",
        answer: "",
        questionTypeImgUrls: [], // 新增
        errorReasonImgUrls: [], // 新增
        errorType: "",
        errorReason: "",
        questionType: this.tempQuestiontype,
        questionTypeSummary: "",
        trap: "", // 新增：备用
        trapDetail: "", // 新增：备用详解
        correctIdea: "",
        improveMethod: "",
        similarText: "",
        similarImgUrls: [], // 重置为空数组
        importantLevel: 4,
      };
    },
    // 点击候选值填充到输入框（覆盖，用于单值字段）
    fillCandidate(field, value) {
      this.form[field] = value;
    },
    // 点击候选值追加到多值输入框（空格分隔，去重）
    appendCandidate(field, value) {
      if (!this.form[field]) {
        this.form[field] = value;
      } else {
        const currentVals = this.form[field]
          .trim()
          ?.split(/\s+/)
          .filter(Boolean);
        if (!currentVals.includes(value)) {
          this.form[field] = [...currentVals, value].join(" ");
        }
      }
    },
    closeCrop() {
      this.imgSrc = "";
    },

    // 设置难度（区分添加页/列表页）
    setImportantLevel(type, level, id) {
      if (type === "form") {
        this.form.importantLevel = level;
      } else if (type === "list" && id) {
        const targetItem = this.mistaker.find((item) => item.id === id);
        if (targetItem) {
          targetItem.importantLevel = level;
          if (this.filteredMistaker.length > 0) {
            const filteredItem = this.filteredMistaker.find(
              (item) => item.id === id
            );
            if (filteredItem) {
              filteredItem.importantLevel = level;
            }
          }
        }
      } else if (type === "questionType") {
        const user = id?.split("►")[0];
        const subject = id?.split("►")[1];
        const subClass = id?.split("►")[2];
        const questionType = id?.split("►")[3];
        this.finalQuestionTypeSummary.find(
          (item) =>
            item.user === user &&
            item.subject === subject &&
            item.subClass === subClass &&
            item.questionType === questionType
        ).importantLevel = level;
      }
    },
    // 保存错题（多图数组保存）
    saveError() {
      const users = this.splitUsers(this.form.user);
      if (
        users.length === 0 ||
        !this.form.subject?.trim() ||
        !this.form.subClass?.trim() ||
        !this.form.questionType?.trim()
      ) {
        alert("用户、科目、考点、题型为必填项，用以归纳汇总！");
        return;
      }

      try {
        this.updateTList();
        this.updateQList();

        const maxId =
          this.mistaker.length > 0
            ? Math.max(...this.mistaker.map((item) => item.id))
            : 0;

        // 为每个用户创建错题
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
            reviewDate: 0,
            reviewResult: [],
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
        if (users.length == 1) alert(`保存错题成功！`);
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
    editError(item) {
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
              i.user === item.user?.trim() &&
              i.subject === item.subject?.trim() &&
              i.subClass === item.subClass?.trim() &&
              i.questionType === item.questionType?.trim()
          )?.questionTypeSummary || "", // 新增
        questionTypeImgUrls:
          this.finalQuestionTypeSummary.find(
            (i) =>
              i.user === item.user?.trim() &&
              i.subject === item.subject?.trim() &&
              i.subClass === item.subClass?.trim() &&
              i.questionType === item.questionType?.trim()
          )?.questionTypeImgUrls || [], // 新增
        trap: item.trap || "",
        trapDetail: item.trapDetail || "",
        reviewDate: item.reviewDate || 0,
        reviewResult: item.reviewResult || [],
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

    // 删除错题
    deleteError(id) {
      if (
        !confirm(
          "确定要删除这道错题吗？此操作不可恢复！注意：删除后其他错题题号不会重排。"
        )
      ) {
        return;
      }

      try {
        // 从错题列表中删除
        const index = this.mistaker.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.mistaker.splice(index, 1);
        }

        // 从筛选列表中删除
        const filterIndex = this.filteredMistaker.findIndex(
          (item) => item.id === id
        );
        if (filterIndex !== -1) {
          this.filteredMistaker.splice(filterIndex, 1);
        }
        console.log(`错题ID: ${id} 删除成功`);
        alert("错题删除成功！");
      } catch (error) {
        console.error("删除错题失败：", error);
        alert("删除错题失败，请重试！");
      }
    },

    // 处理筛选
    handleFilter() {
      // 难度输入验证
      const start = this.filterForm.importantLevelStart;
      const end = this.filterForm.importantLevelEnd;

      if (
        (start && (start < 1 || start > 7)) ||
        (end && (end < 1 || end > 7))
      ) {
        alert("难度只能输入1-7之间的数字！");
        return;
      }

      if (start && end && start > end) {
        alert("难度最低值不能大于最高值！");
        return;
      }
      this.filteredMistaker = [];
      this.filterErrors();
      if (this.filteredMistaker.length === 0 && this.mistaker.length > 0) {
        alert("未找到符合条件的错题！");
      }

      // 筛选后隐藏筛选条件
      this.isFilterOpen = false;
    },

    openQuestionEditor(index) {
      this.currentEditingTestIndex = index;
      this.editingQuestionContent =
        this.filteredTestMistaker[index]?.question || "";
      this.showQuestionEditor = true;

      // 确保编辑器正确初始化
      this.$nextTick(() => {
        if (this.editorQuestion) {
          this.editorQuestion.destroy();
        }
      });
    },

    // 保存题目编辑
    saveQuestionEditor() {
      if (this.currentEditingTestIndex !== -1) {
        const currentQuestion =
          this.filteredTestMistaker[this.currentEditingTestIndex];

        // 更新当前测试题目的question
        currentQuestion.question = this.editingQuestionContent;

        // 同时更新原始mistaker中的数据
        const originalQuestion = this.mistaker.find(
          (item) => item.id === currentQuestion.id
        );
        if (originalQuestion) {
          originalQuestion.question = this.editingQuestionContent;
        }

        this.closeQuestionEditor();
        alert("题目更新成功！");
      }
    },

    // 关闭题目编辑器
    closeQuestionEditor() {
      this.showQuestionEditor = false;
      this.currentEditingTestIndex = -1;
      this.editingQuestionContent = "";

      if (this.editorQuestion) {
        this.editorQuestion.destroy();
        this.editorQuestion = null;
      }
    },

    // 题目编辑器创建回调
    onCreatedQuestionEditor(editor) {
      this.editorQuestion = Object.seal(editor);
    },

    // 筛选错题
    filterErrors() {
      try {
        let result = [...this.mistaker];

        // 1. 题号筛选
        if (this.filterForm.id && this.filterForm.id > 0) {
          const targetId = Number(this.filterForm.id);
          result = result.filter((item) => item.id === targetId);
        }

        // 2. 用户筛选
        const userKeyword = this.filterForm.user.trim().toLowerCase();
        if (userKeyword) {
          result = result.filter((item) =>
            item.user.toLowerCase().includes(userKeyword)
          );
        }

        // 3. 添加日期范围筛选
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

        // 4. 科目筛选
        const subjectKeyword = this.filterForm.subject.trim().toLowerCase();
        if (subjectKeyword) {
          result = result.filter((item) =>
            item.subject.toLowerCase().includes(subjectKeyword)
          );
        }

        // 5. 考点筛选
        const subClassKeyword = this.filterForm.subClass.trim().toLowerCase();
        if (subClassKeyword) {
          result = result.filter((item) => {
            if (!item.subClass?.trim()) return false;
            return item.subClass.toLowerCase().includes(subClassKeyword);
          });
        }

        // 6. 标签筛选
        const errorTypeKeyword = this.filterForm.errorType.trim().toLowerCase();
        if (errorTypeKeyword) {
          result = result.filter((item) => {
            if (!item.errorType.trim()) return false;
            const errorTypeArr = item.errorType
              .trim()
              ?.split(/\s+/)
              .filter(Boolean);
            return errorTypeArr.some((val) =>
              val.toLowerCase().includes(errorTypeKeyword)
            );
          });
        }

        // 7. 错题解析筛选
        const reasonKeyword = this.filterForm.errorReason.trim().toLowerCase();
        if (reasonKeyword) {
          result = result.filter((item) => {
            if (!item.errorReason.trim()) return false;
            const errorReasonArr = item.errorReason
              .trim()
              ?.split(/\s+/)
              .filter(Boolean);
            return errorReasonArr.some((val) =>
              val.toLowerCase().includes(reasonKeyword)
            );
          });
        }

        // 8. 是否填写举一反三筛选
        if (this.filterForm.hasSimilar) {
          if (this.filterForm.hasSimilar === "yes") {
            result = result.filter(
              (item) =>
                item.similarText ||
                (item.similarImgUrls && item.similarImgUrls.length > 0)
            );
          } else if (this.filterForm.hasSimilar === "no") {
            result = result.filter(
              (item) =>
                !item.similarText &&
                (!item.similarImgUrls || item.similarImgUrls.length === 0)
            );
          }
        }

        // 9. 难度范围筛选
        const startLevel = this.filterForm.importantLevelStart;
        const endLevel = this.filterForm.importantLevelEnd;

        if (startLevel || endLevel) {
          result = result.filter((item) => {
            const level = item.importantLevel;
            if (startLevel && !endLevel) {
              return level >= startLevel;
            } else if (!startLevel && endLevel) {
              return level <= endLevel;
            } else {
              return level >= startLevel && level <= endLevel;
            }
          });
        }

        const keywordStr = this.filterForm.keyword.trim().toLowerCase();
        if (keywordStr) {
          // 将关键字字符串按空格分割成数组，并过滤空值
          const keywords = keywordStr?.split(/\s+/).filter(Boolean);

          if (keywords.length > 0) {
            result = result.filter((item) => {
              // 构建要搜索的文本内容（包含多个字段）
              const searchText = [
                item.originalText || "",
                item.question || "",
                item.answer || "",
                item.errorReason || "",
                item.similarText || "",
                item.trap || "",
                item.correctIdea || "",
                item.improveMethod || "",
                item.subject || "",
                item.subClass || "",
                item.questionType || "",
                item.errorType || "",
              ]
                .join(" ")
                .toLowerCase();

              // 检查是否包含所有关键字（AND 逻辑）
              return keywords.every((keyword) => searchText.includes(keyword));
            });
          }
        }

        this.filteredMistaker = result;
      } catch (error) {
        console.error("筛选错题失败：", error);
        alert("筛选失败，请检查筛选条件！");
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
          cs.addDate === item.addDate &&
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
          cs.addDate === item.addDate &&
          cs.cheatSheet === item.cheatSheet
      );

      if (index !== -1) {
        this.finalCheatSheet.splice(index, 1);
        alert("删除成功！");
      }
    },

    saveCheatSheet() {
      if (!this.cheatSheetForm.user?.trim() || !this.cheatSheetForm.addDate) {
        alert("用户和日期为必填项！");
        return;
      }

      let newCheatSheets = [...this.finalCheatSheet];

      if (this.isEditingCheatSheet && this.editingCheatSheetIndex !== -1) {
        // 替换指定位置的元素
        newCheatSheets[this.editingCheatSheetIndex] = {
          ...this.cheatSheetForm,
        };
      } else if (this.isEditingCheatSheet) {
        // 通过内容查找并替换
        const index = newCheatSheets.findIndex(
          (cs) =>
            cs.user === this.cheatSheetForm.user &&
            cs.addDate === this.cheatSheetForm.addDate
        );
        if (index !== -1) {
          newCheatSheets[index] = { ...this.cheatSheetForm };
        } else {
          newCheatSheets.push({ ...this.cheatSheetForm });
        }
      } else {
        newCheatSheets.push({ ...this.cheatSheetForm });
      }

      // 完全替换数组以触发响应式更新
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

    // 重置筛选条件
    resetFilter() {
      this.filterForm = {
        id: "",
        user: "",
        startDate: "",
        endDate: "",
        subject: "",
        subClass: "",
        errorType: "",
        errorReason: "",
        hasSimilar: "",
        importantLevelStart: "",
        importantLevelEnd: "",
        keyword: "",
      };
      this.reverseList = true;
      this.filteredMistaker = [];
      this.isFilterOpen = false;
    },

    confirmClearData() {
      if (
        !confirm(
          "⚠️  此操作将永久删除所有错题、题型总结、综合汇总和任务数据等，不可恢复！请在清空前做好备份。并且，若已开启服务器自动同步功能，将会同步清空服务器上的错题本内容！\n\n确定要继续吗？"
        )
      ) {
        return;
      }
      // 二次确认
      if (
        !confirm("再次确认：您确定要清空此浏览器中当前错题本的所有数据吗？")
      ) {
        return;
      }

      this.clearAllData();
    },

    // 清空所有数据
    clearAllData() {
      try {
        // 清空所有数据数组
        this.mistaker = [];
        this.finalQuestionTypeSummary = [];
        this.finalSubjectSummary = [];
        this.finalCheatSheet = [];
        this.taskList = [];
        this.testInterval = "0 1 3 7 15 30 60";
        this.correctDays = 5;
        this.testTimes = 3;
        this.excludedID = "";
        this.filteredMistaker = [];

        // 重置表单
        this.resetForm();

        // 关闭设置弹窗
        this.showSettingModal = false;

        // 切换到首页
        this.switchView("home");

        alert("所有数据已成功清空！");
      } catch (error) {
        console.error("清空数据失败：", error);
        alert("清空数据失败，请重试！");
      }
    },

    // 保存错题本（多图数组导出）
    saveErrorBook() {
      try {
        const exportData = {
          finalQuestionTypeSummary: this.finalQuestionTypeSummary,
          finalSubjectSummary: this.finalSubjectSummary,
          finalCheatSheet: this.finalCheatSheet,
          mistaker: this.mistaker,
          taskList: this.taskList,
          settings:
            this.testInterval +
            ":::" +
            this.correctDays +
            ":::" +
            this.excludedID +
            ":::" +
            this.testTimes,
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
      try {
        const exportData = {
          finalQuestionTypeSummary: this.finalQuestionTypeSummary,
          finalSubjectSummary: this.finalSubjectSummary,
          finalCheatSheet: this.finalCheatSheet,
          mistaker: this.mistaker,
          taskList: this.taskList,
          settings:
            this.testInterval +
            ":::" +
            this.correctDays +
            ":::" +
            this.excludedID +
            ":::" +
            this.testTimes,
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
        if (!this.autoSync)
          alert(
            "错题本已成功同步到服务器，位于/!PDJ/user-" +
              this.user.username +
              "/mistakebook.json"
          );
      } catch (error) {
        console.error("导出错题本失败：", error);
        this.processing = false;
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
        settings:
          this.testInterval +
          ":::" +
          this.correctDays +
          ":::" +
          this.excludedID +
          ":::" +
          this.testTimes,
      };
      const jsonStr = JSON.stringify(exportData, null, 2);
      if (this.autoSync && !this.onOff) {
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
        // 配置拼音转换参数
        const pinyinOptions = {
          tone: "num",
          separator: " ",
        };

        // 执行转换
        let result = pinyin(this.inputText, pinyinOptions);
        this.resultText = result;
      } catch (error) {
        console.error("拼音转换失败：", error);
        this.resultText = "转换失败，请检查输入内容！";
      }
    },

    /**
     * 复制结果到剪贴板
     */
    copyResult() {
      try {
        // 创建临时文本框
        const tempInput = document.createElement("input");
        tempInput.value = this.resultText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        // 显示复制成功提示
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

    /**
     * 清空所有内容
     */
    clearAll() {
      this.inputText = "";
      this.resultText = "";
      this.showPinYinTool = false;
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
          this.testInterval =
            importData.settings?.split(":::")[0] || "0 1 3 7 15 30 60";
          this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
          this.excludedID = importData.settings?.split(":::")[2] || "";
          this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
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
        else this.processing = true;
      }
      this.onOff = true; // 标志位，表示正在从服务器读取数据
      try {
        const content = await api.fetch(
          "/files/!PDJ/user-" + this.user.username + "/mistakebook.json"
        );
        // 2. 处理接口返回的内容（关键：判断content格式）
        let importData;
        if (typeof content.content === "string") {
          // 情况1：接口返回JSON字符串（最常见），需解析
          importData = JSON.parse(content.content || "{}");
        } else if (
          typeof content.content === "object" &&
          content.content !== null
        ) {
          // 情况2：api.fetch已自动解析为JSON对象，直接使用
          importData = content.content;
        } else {
          throw new Error("服务器返回数据格式异常");
        }
        // 3. 复用原有的数据验证逻辑（完全保留）
        if (!Array.isArray(importData.mistaker)) {
          throw new Error("数据格式错误，缺少错题/任务列表/科目详情列表");
        }
        // 二次验证错题数据结构
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
        this.testInterval =
          importData.settings?.split(":::")[0] || "0 1 3 7 15 30 60";
        this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
        this.excludedID = importData.settings?.split(":::")[2] || "";
        this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
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
      let importData = {};
      try {
        const value = await localforage.getItem(this.forageName);
        importData = JSON.parse(value || "{}");
      } catch (error) {
        console.error("从localforage读取数据失败:", error);
        importData = {};
      }

      // 现在这里的数据是真实的
      if (!Array.isArray(importData.mistaker)) {
        throw new Error("数据格式错误！");
      }

      // 二次验证错题数据结构
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
      // 6. 赋值并重置状态（保留原有逻辑）
      this.finalQuestionTypeSummary = importData.finalQuestionTypeSummary || [];
      this.finalSubjectSummary = importData.finalSubjectSummary || [];
      this.finalCheatSheet = importData.finalCheatSheet || [];
      this.mistaker = importData.mistaker || [];
      this.taskList = importData.taskList || [];
      this.testInterval =
        importData.settings?.split(":::")[0] || "0 1 3 7 15 30 60";
      this.correctDays = Number(importData.settings?.split(":::")[1]) || 5;
      this.excludedID = importData.settings?.split(":::")[2] || "";
      this.testTimes = Number(importData.settings?.split(":::")[3]) || 3;
      this.resetFilter();
    },
    openImageViewer(url) {
      // 先关闭可能存在的实例
      if (this.showImageViewer) {
        this.closeImageViewer();
        // 添加短暂延迟确保完全关闭
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
        // 使用 $nextTick 确保 DOM 更新
        this.$nextTick(() => {
          this.showImageViewer = true;
        });
      } catch (error) {
        console.error("打开图片失败:", error);
      }
    },

    // 安全的关闭方法
    closeImageViewer() {
      this.showImageViewer = false;
    },
  },
};
</script>

<style scoped>
/* 全局容器 */
.filter-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
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

.candidate-list {
  margin-top: 4px;
  padding: 6px 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
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
  align-items: flex-end;
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
  background-color: beige;
  padding: 16px;
  border: 1px solid #eee;
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
  border-bottom: 1px solid black;
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
  color: #999;
  background: none;
  border: none;
  padding: 5px;
}

.close-btn:hover {
  color: #333;
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
  background-color: #f8f9fa;
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
  color: #666;
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
  color: #999;
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
  padding: 16px;
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
  margin: 8px 0;
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

.section-content {
  border-top: 1px solid #eee;
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
  gap: 15px;
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
  height: calc(92vh - 4.2em);
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
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
  background: white;
  padding: 10px;
  margin: 8px 0;
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
  padding: 8px;
  background: #f8f9fa;
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
  padding: 6px 12px;
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

.details-content {
  padding: 15px;
}

.detail-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
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
  width: 300px;
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
  margin: 20px auto;
}

.card-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
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
  max-height: 1200px;
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

.card-table th:nth-child(3),
.card-table td:nth-child(3) {
  width: 120px;
  min-width: 120px;
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
  padding: 2rem;
  box-sizing: border-box;
  background-color: #f8f9fa;
}

.reading-main-content {
  width: 95%;
  height: 50vh;
  background: white;
  padding: 2.5rem;
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
  padding: 1.5rem;
  background-color: #fef7fb;
  border-radius: 8px;
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .candidate-list {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

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

  .card-table th:nth-child(3),
  .card-table td:nth-child(3) {
    width: 100px;
    min-width: 100px;
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
    max-height: 80px;
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
  padding: 10px;
  border-radius: 4px;
}

.original-question:hover {
  background-color: #f5f5f5;
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
  margin-bottom: 8px;
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
</style>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style>
.vel-modal {
  background-color: rgba(0, 0, 0, 0.88) !important;
}
</style>
