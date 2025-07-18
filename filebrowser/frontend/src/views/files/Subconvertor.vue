<template>
  <div id="subConvertor">
    <div v-show="showInputDirPickerModal && isFromLocal == 0">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>{{ $t("repeater.subconvertor4") }}</h2>
        <file-list
          ref="inputFileList"
          @update:selected="selectInputDir"
        ></file-list>
        <div style="text-align: right">
          <button @click="hideInputDirPicker">{{ $t("buttons.ok") }}</button>
        </div>
      </div>
    </div>
    <div v-show="showOutputDirPickerModal && isFromLocal == 0">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>{{ $t("repeater.subconvertor6") }}</h2>
        <file-list
          ref="outputFileList"
          @update:selected="selectOutputDir"
        ></file-list>
        <div style="text-align: right">
          <button @click="hideOutputDirPicker">{{ $t("buttons.ok") }}</button>
        </div>
      </div>
    </div>
    <header class="bg-white shadow-md p-4 flex">
      <button class="action" @click="refreshPage" :title="$t('buttons.close')">
        <i :style="favListStatus" class="material-icons">close</i>
      </button>
      <div
        style="
          text-align: center;
          padding: 0 0 0.1em 0;
          width: calc(100vw - 4em);
        "
      >
        <p style="margin: 0.5em; font-size: 1.2em; font-weight: bold">
          {{ $t("repeater.subconvertor1") }}
        </p>
      </div>
    </header>
    <main
      class="flex-grow p-4"
      :style="{
        width: isMobile ? '100%' : '80%',
      }"
    >
      <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
        <div
          style="
            margin: 0.5em 0.5em 2em 0.5em;
            font-size: 0.9em;
            text-align: center;
            color: blue;
          "
        >
          {{ $t("repeater.subconvertor2") }}
        </div>
        <div class="mb-4">
          <p>
            <input
              type="range"
              min="0"
              max="1"
              style="width: 2em"
              v-model="isFromLocal"
            />
            {{ fromLocal }}
          </p>
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor4")
          }}</label>
          <div class="mt-2 flex items-center">
            <input
              type="text"
              :value="inputDir"
              class="flex-1 p-2 border rounded-md"
              :placeholder="subConvertor3"
              readonly
            />
            <button @click="selectInput" class="ml-2 btn btn-primary">
              {{ $t("repeater.subconvertor5") }}
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor6")
          }}</label>
          <div class="mt-2 flex items-center">
            <input
              type="text"
              :value="outputDir"
              class="flex-1 p-2 border rounded-md"
              :placeholder="subConvertor7"
              readonly
            />
            <button @click="selectOutput" class="ml-2 btn btn-primary">
              {{ $t("repeater.subconvertor5") }}
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">
            {{ $t("repeater.subconvertor8") }}
          </p>
        </div>
        <div class="mb-4">
          <p style="text-align: center; margin-top: 3em">
            {{ $t("repeater.subconvertor9") }}
          </p>
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor10")
          }}</label>
          <input
            type="text"
            v-model="splitChar"
            class="p-2 border rounded-md w-full"
            :placeholder="subConvertor11"
          />
          <p class="mt-1 text-xs text-gray-500">
            {{ $t("repeater.subconvertor12") }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor13")
          }}</label>
          <input
            type="text"
            v-model="sourceEncoding"
            class="p-2 border rounded-md w-full"
            :placeholder="subConvertor14"
          />
          <p class="mt-1 text-xs text-gray-500">
            {{ $t("repeater.subconvertor15") }}
          </p>
        </div>
        <p style="font-size: 0.9em">{{ $t("repeater.subconvertor161") }}</p>
        <div class="mb-4 flex justify-between">
          <div class="w-1/2 mr-2" style="width: 48%">
            <label class="block text-sm font-medium text-gray-700">{{
              $t("repeater.subconvertor16")
            }}</label>
            <input
              type="text"
              v-model="searchString"
              class="p-2 border rounded-md w-full"
            />
          </div>
          <div class="w-1/2 ml-2" style="width: 48%">
            <label class="block text-sm font-medium text-gray-700">{{
              $t("repeater.subconvertor17")
            }}</label>
            <input
              type="text"
              v-model="replaceString"
              class="p-2 border rounded-md w-full"
            />
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            <input type="checkbox" v-model="autoDeleteFormat" />
            {{ $t("repeater.subconvertor188") }}
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">
            <input type="checkbox" v-model="autoFormatEnglishSubtitles" />
            {{ $t("repeater.subconvertor18") }}
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor19")
          }}</label>
          <select v-model="outputFormat" class="p-2 border rounded-md w-full">
            <option value="srt">SRT</option>
            <option value="lrc">LRC</option>
            <option value="ass">ASS</option>
            <option value="vtt">VTT</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor20")
          }}</label>
          <select v-model="outputEncoding" class="p-2 border rounded-md w-full">
            <option value="utf-8">UTF-8</option>
            <option value="gbk">GBK</option>
            <option value="iso-8859-1">ISO-8859-1</option>
            <!-- 可以根据chardet库支持的编码添加更多选项 -->
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">{{
            $t("repeater.subconvertor21")
          }}</label>
          <div id="fileList" class="file-list mt-2">
            <p
              v-if="selectedLrcFiles.length === 0"
              class="text-gray-500 italic"
            >
              {{ $t("repeater.subconvertor22") }}
            </p>
            <div v-else>
              <p class="text-sm font-medium text-gray-700 mb-2">
                {{ $t("repeater.subconvertor23") }}
                {{ selectedLrcFiles.length }}
                {{ $t("repeater.subconvertor24") }}
              </p>
              <div
                v-for="file in selectedLrcFiles"
                :key="file.name"
                class="flex justify-between items-center mb-1"
              >
                <span>{{ file.name }}</span>
                <span class="text-xs text-gray-500">{{
                  getFileType(file.name)
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div :class="{ 'mb-4': true, hidden: !showProgress }">
          <div class="flex justify-between mb-1">
            <span class="text-xs text-gray-500">{{
              $t("repeater.subconvertor25")
            }}</span>
            <span id="progressText" class="text-xs font-medium"
              >{{ progressPercentage }}%</span
            >
          </div>
          <div class="progress-bar">
            <div
              :style="{ width: progressPercentage + '%' }"
              class="progress-fill"
            ></div>
          </div>
        </div>
        <div :class="{ 'mb-4': true, hidden: !showResults }">
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t("repeater.subconvertor26")
          }}</label>
          <div id="resultsList" class="file-list mt-2 max-height-160">
            <div
              v-for="(result, index) in results"
              :key="index"
              :class="['result-item', `result-${result.type}`]"
            >
              {{ result.message }}
            </div>
          </div>
        </div>
        <div style="text-align: center">
          <button
            :disabled="isConverting"
            @click="convertAndSaveFiles"
            class="w-full btn btn-primary btn-lg mt-4"
          >
            {{
              isConverting
                ? $t("repeater.subconvertor27")
                : $t("repeater.subconvertor28")
            }}
          </button>
        </div>
      </div>
    </main>
    <footer class="bg-gray-800 text-white py-6 mt-auto">
      <div class="container mx-auto px-4 text-center text-sm">
        <p>&copy; {{ $t("repeater.subconvertor29") }}</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
body {
  font-family: "Inter", sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.btn-primary {
  background-color: #165dff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0a47d9;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input[type="text"] {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  line-height: 1.25rem;
  font-size: 0.875rem;
  width: 100%;
  box-sizing: border-box;
}

.file-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: white;
}

.progress-bar {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #165dff;
  transition: width 0.3s ease;
}

.result-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.result-success {
  background-color: #dcfce7;
  color: #166534;
}

.result-error {
  background-color: #fee2e2;
  color: #991b1b;
}

.container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.bg-white {
  background-color: white;
}

.p-4 {
  padding: 0rem;
}

.p-6 {
  padding: 1.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-md {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mt-8 {
  margin-top: 4.5rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-800 {
  color: #1f2937;
}

.italic {
  font-style: italic;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.hidden {
  display: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
}

.modal-content {
  position: fixed;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  z-index: 10001;
}

@media (max-width: 736px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

main {
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}
</style>

<script>
const iconv = window.iconvLite || {
  decode: (buffer, encoding) => {
    try {
      // 尝试使用浏览器内置的TextDecoder
      return new TextDecoder(encoding).decode(buffer);
    } catch (e) {
      // 默认使用UTF-8
      console.warn(`不支持的编码: ${encoding}，将使用UTF-8解码`);
      return new TextDecoder("utf-8").decode(buffer);
    }
  },
  encode: (str, encoding) => {
    try {
      return new TextEncoder(encoding).encode(str);
    } catch (e) {
      console.warn(`不支持的编码: ${encoding}，将使用UTF-8编码`);
      return new TextEncoder("utf-8").encode(str);
    }
  },
};

import chardet from "chardet";
import { mapState } from "vuex";
import { files as api } from "@/api";
import FileList from "@/components/prompts/FileList.vue";

// 新增自动整理英文字幕函数
function formatEnglishSubtitle(text) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const formattedSentences = sentences.map((sentence) => {
    let trimmed = sentence.trim();
    if (trimmed) {
      trimmed = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (!/[.!?]$/.test(trimmed)) {
        trimmed += ".";
      }
    }
    return trimmed;
  });
  return formattedSentences.join(" ");
}

export default {
  name: "subconvertor",
  components: { FileList },
  data: function () {
    return {
      isFromLocal: 0,
      firstLoad: true,
      inputDir: "",
      outputDir: "",
      selectedLrcFiles: [],
      inputDirectoryHandle: null,
      outputDirectoryHandle: null,
      isModernBrowser: false,
      splitChar: "",
      showProgress: false,
      progressPercentage: 0,
      showResults: false,
      results: [],
      isConverting: false,
      // 新增数据项
      sourceEncoding: "",
      searchString: "",
      replaceString: "",
      // 新增输出格式和输出编码数据项
      outputFormat: "srt",
      outputEncoding: "utf-8",
      // 新增自动整理英文字幕状态
      autoFormatEnglishSubtitles: false,
      autoDeleteFormat: true,
      showInputDirPickerModal: false,
      showOutputDirPickerModal: false,
    };
  },
  computed: {
    ...mapState(["req"]),
    fromLocal() {
      if (this.isFromLocal == 0) return this.$t("repeater.subconvertor00");
      else return this.$t("repeater.subconvertor01");
    },
    isMobile() {
      return window.innerWidth < 738;
    },
    subConvertor3() {
      return this.$t("repeater.subconvertor3");
    },
    subConvertor7() {
      return this.$t("repeater.subconvertor7");
    },
    subConvertor11() {
      return this.$t("repeater.subconvertor11");
    },
    subConvertor14() {
      return this.$t("repeater.subconvertor14");
    },
  },
  watch: {
    isFromLocal() {
      this.inputDir = "";
      this.inputDirectoryHandle = "";
      this.selectedLrcFiles = [];
      this.outputDir = "";
      this.outputDirectoryHandle = "";
    },
  },
  methods: {
    selectInput() {
      if (this.isFromLocal == 1) this.selectInputDirectory();
      else this.showInputDirPicker();
    },
    selectOutput() {
      if (this.isFromLocal == 1) this.selectOutputDirectory();
      else this.showOutputDirPicker();
    },

    showInputDirPicker() {
      this.showInputDirPickerModal = true;
    },
    hideInputDirPicker() {
      this.showInputDirPickerModal = false;
    },

    showOutputDirPicker() {
      this.showOutputDirPickerModal = true;
    },
    hideOutputDirPicker() {
      this.showOutputDirPickerModal = false;
    },
    selectInputDir(dir) {
      if (this.firstLoad) {
        this.inputDir = "";
        this.inputDirectoryHandle = "";
      } else {
        this.inputDir = decodeURIComponent(dir.split("/files")[1]);
        this.inputDirectoryHandle = dir;
        this.loadFilesFromInputDir();
      }
    },
    selectOutputDir(dir) {
      if (this.firstLoad) {
        this.outputDir = "";
        this.outputDirectoryHandle = "";
        this.firstLoad = false;
      } else {
        this.outputDir = decodeURIComponent(dir.split("/files")[1]);
        this.outputDirectoryHandle = dir;
      }
    },

    checkBrowserCompatibility() {
      try {
        if ("showDirectoryPicker" in window) {
          this.isModernBrowser = true;
          return true;
        }
      } catch (e) {
        console.error("浏览器不支持文件系统API:", e);
      }
      alert(this.$t("repeater.subconvertor30"));
      return false;
    },
    async loadFilesFromInputDir() {
      if (!this.inputDirectoryHandle) return;
      // 假设这里有一个API来获取目录下的文件列表
      const files = (await api.fetch(this.inputDirectoryHandle)).items;
      this.selectedLrcFiles = files.filter((file) => {
        const ext = file.name.split(".").pop().toLowerCase();
        return ["lrc", "srt", "ass", "vtt"].includes(ext);
      });
    },

    async selectInputDirectory() {
      if (!this.checkBrowserCompatibility()) return;

      try {
        const directoryHandle = await window.showDirectoryPicker({
          mode: "read",
        });

        this.inputDirectoryHandle = directoryHandle;
        this.inputDir = directoryHandle.name;

        const files = await this.readDirectoryFiles(directoryHandle);
        this.updateFileList(files);

        if (this.outputDirectoryHandle) {
          this.isConverting = false;
        }
      } catch (error) {
        console.error("选择输入目录时出错:", error);
        if (error.name !== "AbortError") {
          alert(`Error selecting input directory: ${error.message}`);
        }
      }
    },
    async readDirectoryFiles(directoryHandle) {
      const files = [];
      for await (const entry of directoryHandle.values()) {
        if (
          entry.kind === "file" &&
          (entry.name.toLowerCase().endsWith(".lrc") ||
            entry.name.toLowerCase().endsWith(".srt") ||
            entry.name.toLowerCase().endsWith(".ass") ||
            entry.name.toLowerCase().endsWith(".vtt"))
        ) {
          files.push(entry);
        }
      }
      return files;
    },
    updateFileList(files) {
      this.selectedLrcFiles = files;
    },
    async selectOutputDirectory() {
      if (!this.checkBrowserCompatibility()) return;

      try {
        const directoryHandle = await window.showDirectoryPicker({
          mode: "readwrite",
        });

        this.outputDirectoryHandle = directoryHandle;
        this.outputDir = directoryHandle.name;

        if (this.selectedLrcFiles.length > 0) {
          this.isConverting = false;
        }
      } catch (error) {
        console.error("选择输出目录时出错:", error);
        if (error.name !== "AbortError") {
          alert(`Error selecting output directory: ${error.message}`);
        }
      }
    },
    async readFileWithEncoding(fileHandle) {
      var file;
      if (this.isFromLocal == 0) {
        let srtUrl = api.getDownloadURL(this.req, true);
        let Url =
          srtUrl.split("/api/raw/")[0] +
          "/api/raw/" +
          fileHandle.url.split("/files/")[1] +
          "?" +
          srtUrl.split("?")[1];
        file = await fetch(Url);
      } else file = await fileHandle.getFile();

      const buffer = await file.arrayBuffer();
      const ext = fileHandle.name.split(".").pop().toLowerCase();

      // 根据用户输入的编码进行解码
      let encoding = this.sourceEncoding.trim();
      if (!encoding) {
        encoding = chardet.detect(new Uint8Array(buffer)) || "utf-8";
        console.log(`检测到文件 ${fileHandle.name} 的编码为: ${encoding}`);
      }

      if (ext === "srt" && encoding === "utf-8") {
        return new TextDecoder("utf-8").decode(buffer);
      }

      return iconv.decode(new Uint8Array(buffer), encoding);
    },
    lrcToSrt(lrcText) {
      const splitChar = this.splitChar.trim();
      const lines = lrcText.split("\n");
      let srt = "";

      const timeLyricsMap = new Map();

      lines.forEach((line) => {
        const timeTags = line.match(/\[(\d+:\d+\.\d+|\d+:\d+:\d+)\]/g);
        const text = line.replace(/\[(\d+:\d+\.\d+|\d+:\d+:\d+)\]/g, "").trim();

        if (timeTags && text) {
          timeTags.forEach((timeTag) => {
            const timeStr = timeTag.slice(1, -1);
            const parts = timeStr.split(/[:.]/);
            let minutes, seconds, milliseconds;

            if (parts.length === 4) {
              minutes = parseInt(parts[1], 10);
              seconds = parseInt(parts[2], 10);
              milliseconds = parseInt(parts[3], 10) || 0;
            } else if (parts.length === 3) {
              minutes = parseInt(parts[0], 10);
              seconds = parseInt(parts[1], 10);
              milliseconds = parseInt(parts[2], 10) || 0;
            } else {
              return;
            }

            const timeInMs = minutes * 60000 + seconds * 1000 + milliseconds;
            timeLyricsMap.set(timeInMs, text);
          });
        }
      });

      const sortedTimes = Array.from(timeLyricsMap.keys()).sort(
        (a, b) => a - b
      );

      sortedTimes.forEach((time, index) => {
        const startTime = this.formatSrtTime(time);
        const endTime = sortedTimes[index + 1]
          ? this.formatSrtTime(sortedTimes[index + 1])
          : this.formatSrtTime(time + 2000);

        let text = timeLyricsMap.get(time);

        if (splitChar && text.includes(splitChar)) {
          const escapedSplitChar = splitChar.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          text = text.split(new RegExp(escapedSplitChar, "g")).join("\n");
        }

        srt += `${index + 1}\n${startTime} --> ${endTime}\n${text}\n\n`;
      });

      return srt;
    },
    assToSrt(assText) {
      const splitChar = this.splitChar.trim();
      const lines = assText.split("\n");
      let srt = "";
      let srtIndex = 1;

      const dialogueLines = lines.filter((line) =>
        line.startsWith("Dialogue:")
      );

      dialogueLines.forEach((line) => {
        const parts = line.split(",");
        const startTime = parts[1];
        const endTime = parts[2];
        let text = parts
          .slice(9)
          .join(",")
          .replace(/\{.*?\}/g, "");
        text = text.replace(/\\N/g, "\n");

        if (splitChar && text.includes(splitChar)) {
          const escapedSplitChar = splitChar.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          text = text.split(new RegExp(escapedSplitChar, "g")).join("\n");
        }

        srt += `${srtIndex}\n${this.formatAssTimeToSrt(
          startTime
        )} --> ${this.formatAssTimeToSrt(endTime)}\n${text}\n\n`;
        srtIndex++;
      });

      return srt;
    },
    vttToSrt(vttText) {
      const splitChar = this.splitChar.trim();
      const lines = vttText.split("\n");
      let srt = "";
      let srtIndex = 1;

      let startIndex = 0;
      while (
        startIndex < lines.length &&
        lines[startIndex].trim() !== "WEBVTT"
      ) {
        startIndex++;
      }
      startIndex++;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes("-->")) {
          const [startTime, endTime] = line
            .split(" --> ")
            .map((time) => time.trim());
          let text = "";
          i++;
          while (i < lines.length && lines[i].trim() !== "") {
            text += lines[i].trim() + "\n";
            i++;
          }
          text = text.trim();

          if (splitChar && text.includes(splitChar)) {
            const escapedSplitChar = splitChar.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            );
            text = text.split(new RegExp(escapedSplitChar, "g")).join("\n");
          }

          srt += `${srtIndex}\n${startTime.replace(
            ".",
            ","
          )} --> ${endTime.replace(".", ",")}\n${text}\n\n`;
          srtIndex++;
        }
      }

      return srt;
    },
    formatAssTimeToSrt(time) {
      const [hours, minutes, seconds] = time.split(":");
      const [sec, ms] = seconds.split(".");
      return `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:${sec.padStart(2, "0")},${ms.padStart(3, "0")}`;
    },
    formatSrtTime(ms) {
      const date = new Date(ms);
      return (
        [
          String(date.getUTCHours()).padStart(2, "0"),
          String(date.getUTCMinutes()).padStart(2, "0"),
          String(date.getUTCSeconds()).padStart(2, "0"),
        ].join(":") +
        "," +
        String(date.getUTCMilliseconds()).padStart(3, "0")
      );
    },
    srtToLrc(srtText) {
      const lines = srtText.split("\n\n");
      let lrc = "";

      lines.forEach((line) => {
        const parts = line.split("\n");
        if (parts.length >= 3) {
          const timeInfo = parts[1].split(" --> ");
          const startTime = timeInfo[0];
          const text = parts.slice(2).join("\n");

          const [, minutes, seconds] = startTime.split(":");
          const [sec, ms] = seconds.split(",");
          const lrcTime = `[${minutes}:${sec}.${ms.slice(0, 2)}]`;
          lrc += `${lrcTime}${text}\n`;
        }
      });

      return lrc;
    },
    srtToAss(srtText) {
      let ass = "[Script Info]\n";
      ass += "Title: Subtitle\n";
      ass += "ScriptType: v4.00+\n";
      ass += "WrapStyle: 0\n";
      ass += "ScaledBorderAndShadow: yes\n";
      ass += "YCbCr Matrix: TV.709\n";
      ass += "\n[V4+ Styles]\n";
      ass +=
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n";
      ass +=
        "Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,2,10,10,10,0\n";
      ass += "\n[Events]\n";
      ass +=
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n";

      const lines = srtText.split("\n\n");
      lines.forEach((line) => {
        const parts = line.split("\n");
        if (parts.length >= 3) {
          const timeInfo = parts[1].split(" --> ");
          const startTime = timeInfo[0].replace(",", ".");
          const endTime = timeInfo[1].replace(",", ".");
          const text = parts.slice(2).join("\\N");

          ass += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${text}\n`;
        }
      });

      return ass;
    },
    srtToVtt(srtText) {
      let vtt = "WEBVTT\n\n";

      const lines = srtText.split("\n\n");
      lines.forEach((line) => {
        const parts = line.split("\n");
        if (parts.length >= 3) {
          const timeInfo = parts[1].split(" --> ");
          const startTime = timeInfo[0].replace(",", ".");
          const endTime = timeInfo[1].replace(",", ".");
          const text = parts.slice(2).join("\n");

          vtt += `${startTime} --> ${endTime}\n${text}\n\n`;
        }
      });

      return vtt;
    },
    async convertAndSaveFiles() {
      if (!this.selectedLrcFiles.length) {
        alert(this.$t("repeater.subconvertor31"));
        return;
      }

      if (!this.outputDirectoryHandle) {
        alert(this.$t("repeater.subconvertor32"));
        return;
      }

      this.showProgress = true;
      this.showResults = true;
      this.results = [];

      const totalFiles = this.selectedLrcFiles.length;
      let processedFiles = 0;
      let successCount = 0;
      let errorCount = 0;

      this.isConverting = true;

      for (const fileHandle of this.selectedLrcFiles) {
        try {
          const ext = fileHandle.name.split(".").pop().toLowerCase();
          let content;
          if (ext === "srt") {
            content = await this.readFileWithEncoding(fileHandle);
          } else if (ext === "lrc") {
            const lrcText = await this.readFileWithEncoding(fileHandle);
            content = this.lrcToSrt(lrcText);
          } else if (ext === "ass") {
            const assText = await this.readFileWithEncoding(fileHandle);
            content = this.assToSrt(assText);
          } else if (ext === "vtt") {
            const vttText = await this.readFileWithEncoding(fileHandle);
            content = this.vttToSrt(vttText);
          } else {
            throw new Error("不支持的文件类型");
          }

          // 去掉 <> 和其中的内容
          if (this.autoDeleteFormat) content = content.replace(/<[^>]*>/g, "");

          // 查找和替换操作
          if (this.searchString) {
            const regex = new RegExp(this.searchString, "g");
            content = content.replace(regex, this.replaceString);
          }

          // 自动整理英文字幕
          if (this.autoFormatEnglishSubtitles) {
            const lines = content.split("\n");
            const formattedLines = lines.map((line) => {
              if (/^[a-zA-Z]/.test(line)) {
                return formatEnglishSubtitle(line);
              }
              return line;
            });
            content = formattedLines.join("\n");
          }

          // 根据用户选择的输出格式进行处理
          if (this.outputFormat === "lrc") {
            content = this.srtToLrc(content);
          } else if (this.outputFormat === "ass") {
            content = this.srtToAss(content);
          } else if (this.outputFormat === "vtt") {
            content = this.srtToVtt(content);
          }
          const outputFileName = fileHandle.name.replace(
            /\.(lrc|ass|vtt|srt)$/,
            `.${this.outputFormat}`
          );
          if (this.isFromLocal == 0) {
            // 调用保存文件的API
            const encodedContent1 = iconv.encode(content, this.outputEncoding);
            await api.post(
              this.outputDirectoryHandle + "/" + outputFileName,
              encodedContent1,
              true
            );
          } else {
            const outputFileHandle =
              await this.outputDirectoryHandle.getFileHandle(outputFileName, {
                create: true,
              });
            const writable = await outputFileHandle.createWritable();
            const encodedContent = iconv.encode(content, this.outputEncoding);
            await writable.write(encodedContent);
            await writable.close();
          }
          successCount++;
          this.addResultItem(
            `${fileHandle.name}` + this.$t("repeater.subconvertor36"),
            "success"
          );
        } catch (error) {
          errorCount++;
          this.addResultItem(
            `${fileHandle.name}` +
              this.$t("repeater.subconvertor37") +
              `${error.message}`,
            "error"
          );
          console.error(`转换文件 ${fileHandle.name} 时出错:`, error);
        } finally {
          processedFiles++;
          this.updateProgress((processedFiles / totalFiles) * 100);
        }
      }

      this.isConverting = false;
      alert(
        this.$t("repeater.subconvertor33") +
          `${successCount}` +
          this.$t("repeater.subconvertor34") +
          `${errorCount}` +
          this.$t("repeater.subconvertor35")
      );
    },
    addResultItem(message, type) {
      this.results.push({ message, type });
    },
    updateProgress(percentage) {
      this.progressPercentage = percentage;
    },
    getFileType(fileName) {
      if (fileName.endsWith(".lrc")) return "LRC";
      if (fileName.endsWith(".srt")) return "SRT";
      if (fileName.endsWith(".ass")) return "ASS";
      if (fileName.endsWith(".vtt")) return "VTT";
      return "未知";
    },
    // 新增刷新页面的方法
    refreshPage() {
      window.location.reload();
    },
  },
};
</script>
<style>
#subConvertor {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1005;
  overflow-y: auto;
}
</style>
