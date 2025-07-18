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
    <form id="editor" style="font-size: 1em; font-family: auto" ></form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { files as api } from "@/api";
import { theme } from "@/utils/constants";
import buttons from "@/utils/buttons";

import { version as ace_version } from "ace-builds";
import ace from "ace-builds/src-min-noconflict/ace.js";
import modelist from "ace-builds/src-min-noconflict/ext-modelist.js";

import HeaderBar from "@/components/header/HeaderBar.vue";
import Action from "@/components/header/Action.vue";

export default {
  name: "editor",
  components: {
    HeaderBar,
    Action,
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapState(["req", "user"]),
  },
  created() {
    window.addEventListener("keydown", this.keyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEvent);
    this.editor.destroy();
  },
  mounted: function () {
    const fileContent = this.req.content || "";

    ace.config.set(
      "basePath",
      `https://cdn.jsdelivr.net/npm/ace-builds@${ace_version}/src-min-noconflict/`
    );

    this.editor = ace.edit("editor", {
      value: fileContent,
      showPrintMargin: false,
      readOnly: this.req.type === "textImmutable",
      theme: "ace/theme/chrome",
      mode: modelist.getModeForPath(this.req.name).mode,
      wrap: true,
    });

    if (theme == "dark") {
      this.editor.setTheme("ace/theme/twilight");
    }

    this.editor.focus();
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
        await api.put(this.$route.path, this.editor.getValue());
        this.editor.session.getUndoManager().markClean();
        buttons.success(button);
      } catch (e) {
        buttons.done(button);
        this.editor.session.getUndoManager().markClean();
        console.log(e);
      }
    },
    close() {
      if (!this.editor.session.getUndoManager().isClean()) {
        this.$store.commit("showHover", "discardEditorChanges");
        return;
      }

      this.$store.commit("updateRequest", {});

      history.back();
    },
  },
};
</script>
