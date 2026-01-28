<template>
  <div id="login" :class="{ recaptcha: recaptcha }">
    <form @submit="submit">
      <img :src="logoURL" alt="File Browser" />
      <h1 v-if="!isReminder && !isWordReciter && !isMistakeBook">
        {{ $t("repeater.repeater") }}
      </h1>
      <h1 v-if="isReminder">{{ $t("reminder.reminder") }}</h1>
      <h1 v-if="isWordReciter">{{ $t("reminder.wordreciter") }}</h1>
      <h1 v-if="isMistakeBook">{{ $t("reminder.mistakebook") }}</h1>
      <div v-if="error !== ''" class="wrong">{{ error }}</div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin: 0 0 8px 0;
          gap: 5px;
        "
      >
        <span
          style="
            padding: 10px 20px;
            background-color: white;
            cursor: pointer;
            width: 50%;
            text-align: center;
          "
          :style="{
            border:
              isReminder || isMistakeBook || isWordReciter
                ? '1px solid #efefef'
                : '1px solid #2196f3',
          }"
          @click="clickRepeater"
        >
          {{ $t("repeater.nameRepeater") }}
        </span>
        <span
          style="
            padding: 10px 20px;
            background-color: white;
            cursor: pointer;
            width: 50%;
            text-align: center;
          "
          :style="{
            border: !isReminder ? '1px solid #efefef' : '1px solid #2196f3',
          }"
          @click="clickReminder"
        >
          {{ $t("reminder.nameReminder") }}
        </span>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin: 0 0 8px 0;
          gap: 5px;
        "
      >
        <span
          style="
            padding: 10px 20px;
            background-color: white;
            cursor: pointer;
            width: 50%;
            text-align: center;
          "
          :style="{
            border: !isWordReciter ? '1px solid #efefef' : '1px solid #2196f3',
          }"
          @click="clickWordReciter"
        >
          {{ $t("reminder.nameWordReciter") }}
        </span>
        <span
          style="
            padding: 10px 20px;
            background-color: white;
            cursor: pointer;
            width: 50%;
            text-align: center;
          "
          :style="{
            border: !isMistakeBook ? '1px solid #efefef' : '1px solid #2196f3',
          }"
          @click="clickMistakeBook"
        >
          {{ $t("reminder.nameMistakeBook") }}
        </span>
      </div>
      <input
        :disabled="allowOffline && !firstLogin"
        class="input input--block"
        type="text"
        autocapitalize="off"
        v-model="username"
        :placeholder="$t('login.username')"
      />
      <input
        :disabled="allowOffline && !firstLogin"
        class="input input--block"
        type="password"
        v-model="password"
        :placeholder="$t('login.password')"
      />
      <input
        class="input input--block"
        v-if="createMode"
        type="password"
        v-model="passwordConfirm"
        :placeholder="$t('login.passwordConfirm')"
      />

      <div
        v-if="!createMode"
        style="
          text-align: justify;
          text-align-last: left;
          padding: 1em 0;
          cursor: default;
        "
        :style="{
          color: firstLogin ? 'lightblue' : 'black',
        }"
      >
        <input :disabled="firstLogin" type="checkbox" v-model="allowOffline" />
        {{ $t("repeater.allowOfflineL") }}
      </div>

      <div v-if="recaptcha" id="recaptcha"></div>
      <input
        class="button button--block"
        type="submit"
        :value="createMode ? $t('login.signup') : $t('login.submit')"
      />

      <p @click="toggleMode" v-if="signup">
        {{
          createMode ? $t("login.loginInstead") : $t("login.createAnAccount")
        }}
      </p>
    </form>
    <div style="position: fixed; bottom: 1em; right: 1em">
      <button
        v-if="!firstLogin || !noCachedMedia || !noCachedOther"
        class="action"
        @click="cleanUp"
        :title="$t('repeater.cleanCache')"
      >
        <i style="color: red; font-size: 1.5em" class="material-icons"
          >delete</i
        >
      </button>
    </div>
    <p
      v-if="isCleanedUp"
      style="
        color: red;
        position: fixed;
        text-align: center;
        z-index: 1011;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 1.5em;
      "
    >
      {{ $t("repeater.cleanCacheDone") }}
    </p>
    <div
      v-if="showCleanUp"
      style="
        background-color: gray;
        overflow-y: auto;
        color: white;
        z-index: 1010;
        display: flex;
        flex-direction: column;
        position: fixed;
        padding: 0 1em;
        max-width: 25em;
        width: 90%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 10px;
      "
      :style="{
        height: isMobile ? '80%' : '65%',
      }"
    >
      <div style="color: white; padding: 1em 0">
        <input :disabled="firstLogin" type="checkbox" v-model="cleanAccount" />
        {{ $t("repeater.cleanAccount") }}
      </div>
      <div style="color: white; padding: 1em 0">
        <input :disabled="noCachedMedia" type="checkbox" v-model="cleanMedia" />
        {{ $t("repeater.cleanMedia") }}
      </div>
      <div style="color: white; padding: 1em 0">
        <input
          :disabled="noCachedOther"
          type="checkbox"
          v-model="cleanSrtandSettings"
        />
        {{ $t("repeater.cleanSrtandSettings") }}
      </div>
      <div style="color: white; padding: 1em 0">
        {{ $t("repeater.cleanAlert") }}
      </div>
      <div style="flex-grow: 1"></div>
      <div
        style="
          display: flex;
          justify-content: space-around;
          padding-bottom: 2em;
        "
      >
        <button @click="cleanUpNow">
          {{ $t("buttons.ok") }}
        </button>
        <button @click="cleanUpClose">
          {{ $t("buttons.cancel") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as auth from "@/utils/auth";
import localforage from "localforage";
import { logoURL, recaptcha, recaptchaKey, signup } from "@/utils/constants";

export default {
  name: "login",
  computed: {
    signup: () => signup,
    logoURL: () => logoURL,
  },
  data: function () {
    return {
      createMode: false,
      error: "",
      username: window.localStorage.getItem("line1") || "",
      password: window.localStorage.getItem("line2") || "",
      recaptcha: recaptcha,
      passwordConfirm: "",
      allowOffline: Number(window.localStorage.getItem("isOffline")) == 1,
      isReminder: Number(window.localStorage.getItem("isReminder")) == 1,
      isWordReciter: Number(window.localStorage.getItem("isWordReciter")) == 1,
      isMistakeBook: Number(window.localStorage.getItem("isMistakeBook")) == 1,
      firstLogin: window.localStorage.getItem("lastRawToken") == null,
      noCachedMedia: false,
      noCachedOther: false,
      isCleanedUp: false,
      cleanAccount: false,
      cleanMedia: false,
      cleanSrtandSettings: false,
      showCleanUp: false,
    };
  },

  watch: {
    allowOffline: function () {
      if (this.allowOffline) window.localStorage.setItem("isOffline", 1);
      else window.localStorage.setItem("isOffline", 0);
    },
    username() {
      window.localStorage.setItem("line1", this.username);
    },
    password() {
      window.localStorage.setItem("line2", this.password);
    },
    isReminder() {
      if (this.isReminder) window.localStorage.setItem("isReminder", 1);
      else window.localStorage.setItem("isReminder", 0);
    },
    isMistakeBook() {
      if (this.isMistakeBook) window.localStorage.setItem("isMistakeBook", 1);
      else window.localStorage.setItem("isMistakeBook", 0);
    },
    isWordReciter() {
      if (this.isWordReciter) window.localStorage.setItem("isWordReciter", 1);
      else window.localStorage.setItem("isWordReciter", 0);
    },
  },

  mounted() {
    if (!window.localStorage.getItem("isOffline"))
      window.localStorage.setItem("isOffline", 0);
    if (!window.localStorage.getItem("lastRawToken")) this.allowOffline = false;
    if (!recaptcha) return;

    window.grecaptcha.ready(function () {
      window.grecaptcha.render("recaptcha", {
        sitekey: recaptchaKey,
      });
    });
  },
  methods: {
    cleanUp() {
      this.showCleanUp = true;
    },
    cleanUpNow() {
      if (this.cleanSrtandSettings) {
        var temp01 = window.localStorage.getItem("isOffline");
        var temp02 = window.localStorage.getItem("lastRawToken");
        var temp05 = window.localStorage.getItem("line1");
        var temp06 = window.localStorage.getItem("line2");
        var temp03 = window.localStorage.getItem("cKeys");
        var temp04 = window.localStorage.getItem("hasCachedAttach");
        window.localStorage.clear();
        if (!this.firstLogin) {
          window.localStorage.setItem("isOffline", temp01);
          window.localStorage.setItem("lastRawToken", temp02);
          window.localStorage.setItem("line1", temp05);
          window.localStorage.setItem("line2", temp06);
        }
        if (!this.cleanMedia) {
          window.localStorage.setItem("cKeys", temp03);
          window.localStorage.setItem("hasCachedAttach", temp04);
        }
        this.noCachedOther = true;
        this.cleanSrtandSettings = false;
      }
      if (this.cleanMedia) {
        this.cacheCleanUp();
        this.cleanMedia = false;
      }
      if (this.cleanAccount) {
        window.localStorage.removeItem("isOffline");
        this.allowOffline = false;
        window.localStorage.removeItem("lastRawToken");
        this.username = "";
        this.password = "";
        this.firstLogin = true;
        this.cleanAccount = false;
      }
      if (this.isReminder) this.clickReminder();
      else if (this.isMistakeBook) this.clickMistakeBook();
      else if (this.isWordReciter) this.clickWordReciter();
      else this.clickRepeater();
      this.showResult();
      this.showCleanUp = false;
    },
    cacheCleanUp() {
      var vm = this;
      localforage
        .clear()
        .then(function () {
          window.localStorage.removeItem("cKeys");
          window.localStorage.removeItem("hasCachedAttach");
          vm.noCachedMedia = true;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    cleanUpClose() {
      this.cleanAccount = false;
      this.cleanMedia = false;
      this.cleanSrtandSettings = false;
      this.showCleanUp = false;
    },

    clickRepeater() {
      this.isReminder = false;
      this.isMistakeBook = false;
      this.isWordReciter = false;
    },

    clickReminder() {
      this.isReminder = true;
      this.isMistakeBook = false;
      this.isWordReciter = false;
    },

    clickMistakeBook() {
      this.isReminder = false;
      this.isMistakeBook = true;
      this.isWordReciter = false;
    },
    clickWordReciter() {
      this.isReminder = false;
      this.isMistakeBook = false;
      this.isWordReciter = true;
    },

    showResult() {
      this.isCleanedUp = true;
      setTimeout(() => {
        this.isCleanedUp = false;
      }, 2000);
    },
    toggleMode() {
      this.createMode = !this.createMode;
      if (this.createMode) this.allowOffline = false;
    },
    async submit(event) {
      event.preventDefault();
      event.stopPropagation();

      let redirect = this.$route.query.redirect;
      if (redirect === "" || redirect === undefined || redirect === null) {
        redirect = "/files/";
      }

      let captcha = "";
      if (recaptcha) {
        captcha = window.grecaptcha.getResponse();

        if (captcha === "") {
          this.error = this.$t("login.wrongCredentials");
          return;
        }
      }

      if (this.createMode) {
        if (this.password !== this.passwordConfirm) {
          this.error = this.$t("login.passwordsDontMatch");
          return;
        }
      }

      try {
        if (this.createMode) {
          await auth.signup(this.username, this.password);
        }

        await auth.login(this.username, this.password, captcha);
        this.$router.push({ path: redirect });
      } catch (e) {
        if (e.message == 409) {
          this.error = this.$t("login.usernameTaken");
        } else {
          this.error = this.$t("login.wrongCredentials");
        }
      }
    },
  },
};
</script>
