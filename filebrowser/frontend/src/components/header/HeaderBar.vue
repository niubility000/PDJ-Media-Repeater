<template>
  <header>
    <button
      v-if="showLogo !== undefined"
      class="action"
      @click="logout"
      style="background-color: white"
    >
      <i style="padding-left: 0" class="material-icons">close</i>
    </button>
    <action
      v-if="showMenu !== undefined"
      class="menu-button"
      icon="menu"
      :label="$t('buttons.toggleSidebar')"
      @action="openSidebar()"
    />

    <slot />

    <div id="dropdown" :class="{ active: this.currentPromptName === 'more' }">
      <slot name="actions" />
    </div>

    <action
      v-if="this.$slots.actions"
      id="more"
      icon="more_vert"
      :label="$t('buttons.more')"
      @action="$store.commit('showHover', 'more')"
    />

    <div
      class="overlay"
      v-show="this.currentPromptName == 'more'"
      @click="$store.commit('closeHovers')"
    />
  </header>
</template>

<script>
import * as auth from "@/utils/auth";
import Action from "@/components/header/Action.vue";
import { mapGetters } from "vuex";

export default {
  name: "header-bar",
  props: ["showLogo", "showMenu"],
  components: {
    Action,
  },
  data: function () {
    return {};
  },
  methods: {
    openSidebar() {
      this.$store.commit("showHover", "sidebar");
    },
    logout: auth.logout,
  },
  computed: {
    ...mapGetters(["currentPromptName"]),
  },
};
</script>

<style></style>
