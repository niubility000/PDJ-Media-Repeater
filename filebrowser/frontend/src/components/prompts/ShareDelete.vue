<template>
  <div class="card floating">
    <div class="card-content">
      <p>{{ $t("prompts.deleteMessageShare", { path: currentPath }) }}</p>
    </div>
    <div class="card-action">
      <button
        @click="$store.commit('closeHovers')"
        class="button button--flat button--grey"
        :aria-label="$t('buttons.cancel')"
        :title="$t('buttons.cancel')"
      >
        {{ $t("buttons.cancel") }}
      </button>
      <button
        @click="submit"
        class="button button--flat button--red"
        :aria-label="$t('buttons.ok')"
        :title="$t('buttons.ok')"
      >
        {{ $t("buttons.ok") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "share-delete",
  data: function () {
    return {
      currentPath: window.sessionStorage.getItem('currentPath'),
    };
  },
  computed: {
    ...mapGetters(["currentPrompt"]),
  },
  methods: {
    submit: function () {
      this.currentPrompt?.confirm();
    },
  },
};
</script>
