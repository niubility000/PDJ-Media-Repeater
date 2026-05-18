<template>
  <div id="editor-container">
    <header-bar>
      <action icon="close" :label="$t('buttons.close')" @action="close()" />
      <title>{{ req.name }}</title>

      <action
        v-if="user.perm.modify"
        id="save-button"
        icon="save"
        :label="$t('buttons.save')"
        @action="save()"
      />
    </header-bar>
    <mavon-editor
      v-model="content"
      :editable="req.type !== 'textImmutable'"
      :toolbars="toolbars"
      :language="'zh-cn'"
      :tabSize="4"
      :boxShadow="false"
      :defaultOpen="'md'"
      @save="save()"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { files as api } from "@/api";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import buttons from "@/utils/buttons";

import HeaderBar from "@/components/header/HeaderBar.vue";
import Action from "@/components/header/Action.vue";

export default {
  name: "editor",
  components: {
    HeaderBar,
    Action,
    mavonEditor,
  },
  data: function () {
    return {
      content: "",
      originalContent: "",
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        code: true,
        table: true,
        undo: true,
        redo: true,
        subfield: true,
        preview: true,
      },
    };
  },
  computed: {
    ...mapState(["req", "user"]),
  },
  created() {
    this.content = this.req.content || "";
    this.originalContent = this.req.content || "";
    window.addEventListener("keydown", this.keyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEvent);
  },
  methods: {
    keyEvent(event) {
      if (event.code === "Escape") {
        this.close();
      }

      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      if (String.fromCharCode(event.which).toLowerCase() !== "s") {
        return;
      }

      event.preventDefault();
      this.save();
    },
    async save() {
      const button = "save";
      buttons.loading("save");

      try {
        await api.put(this.$route.path, this.content);
        this.originalContent = this.content;
        buttons.success(button);
      } catch (e) {
        buttons.done(button);
        console.log(e);
      }
    },
    close() {
      if (this.content !== this.originalContent) {
        if (!confirm("有未保存的修改，是否放弃？")) {
          return;
        }
      }

      this.$store.commit("updateRequest", {});
      history.back();
    },
  },
};
</script>

<style>
#editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-note-wrapper {
  flex: 1;
}
</style>
