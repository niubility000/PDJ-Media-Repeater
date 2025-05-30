<template>
  <div class="card floating">
    <div class="card-content">
      <p v-if="!this.isListing || selectedCount === 1">
        {{ $t("prompts.deleteMessageSingle") }}
      </p>
      <div v-else>
        <p>
          {{ $t("prompts.deleteMessageMultiple", { count: selectedCount }) }}
        </p>
        <p style="font-size: 2em">
          Selected:
          <span style="font-size: 3.5em; color: red">{{ selectedCount }}</span>
        </p>
      </div>
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
        :aria-label="$t('buttons.delete')"
        :title="$t('buttons.delete')"
      >
        {{ $t("buttons.delete") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { files as api } from "@/api";
import buttons from "@/utils/buttons";

export default {
  name: "delete",
  computed: {
    ...mapGetters(["isListing", "selectedCount", "currentPrompt"]),
    ...mapState(["req", "selected"]),
  },
  methods: {
    ...mapMutations(["closeHovers"]),
    submit: async function () {
      buttons.loading("delete");

      window.sessionStorage.setItem("modified", "true");
      try {
        if (!this.isListing) {
          await api.remove(this.$route.path);
          buttons.success("delete");

          this.currentPrompt?.confirm();
          this.closeHovers();
          return;
        }

        this.closeHovers();

        if (this.selectedCount === 0) {
          return;
        }

        let promises = [];
        for (let index of this.selected) {
          promises.push(api.remove(this.req.items[index].url));
        }

        await Promise.all(promises);
        buttons.success("delete");
        this.$store.commit("setReload", true);
      } catch (e) {
        buttons.done("delete");
        this.$showError(e);
        if (this.isListing) this.$store.commit("setReload", true);
      }
    },
  },
};
</script>
