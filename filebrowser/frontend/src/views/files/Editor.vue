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

    <breadcrumbs base="/files" noLink />

    <form id="editor"></form>
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
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  name: "editor",
  components: {
    HeaderBar,
    Action,
    Breadcrumbs,
  },
  data: function () {
    return {};
  },
  computed: {
    ...mapState(["req", "user"]),
    breadcrumbs() {
      let parts = this.$route.path.split("/");

      if (parts[0] === "") {
        parts.shift();
      }

      if (parts[parts.length - 1] === "") {
        parts.pop();
      }

      let breadcrumbs = [];

      for (let i = 0; i < parts.length; i++) {
        breadcrumbs.push({ name: decodeURIComponent(parts[i]) });
      }

      breadcrumbs.shift();

      if (breadcrumbs.length > 3) {
        while (breadcrumbs.length !== 4) {
          breadcrumbs.shift();
        }

        breadcrumbs[0].name = "...";
      }

      return breadcrumbs;
    },
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
