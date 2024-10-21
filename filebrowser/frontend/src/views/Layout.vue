<template>
  <div>
    <div v-if="!isReminder">
      <div v-if="progress" class="progress">
        <div v-bind:style="{ width: this.progress + '%' }"></div>
      </div>
      <sidebar></sidebar>
      <main>
        <router-view></router-view>
        <shell v-if="isExecEnabled && isLogged && user.perm.execute" />
      </main>
      <prompts></prompts>
      <upload-files></upload-files>
    </div>
    <div v-if="isReminder">
      <reminder></reminder>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Sidebar from "@/components/Sidebar.vue";
import Reminder from "@/views/files/Reminder.vue";
import Prompts from "@/components/prompts/Prompts.vue";
import Shell from "@/components/Shell.vue";
import UploadFiles from "../components/prompts/UploadFiles.vue";
import { enableExec } from "@/utils/constants";

export default {
  name: "layout",
  components: {
    Sidebar,
    Reminder,
    Prompts,
    Shell,
    UploadFiles,
  },
  computed: {
    ...mapGetters(["isLogged", "progress", "currentPrompt"]),
    ...mapState(["user"]),
    isExecEnabled: () => enableExec,
  },
  data: function () {
    return {
      isReminder: Number(window.localStorage.getItem("isReminder")) == 1,
    };
  },
  watch: {
    $route: function () {
      this.$store.commit("resetSelected");
      this.$store.commit("multiple", false);
      if (this.currentPrompt?.prompt !== "success")
        this.$store.commit("closeHovers");
    },
  },
};
</script>
