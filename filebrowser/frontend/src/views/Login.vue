<template>
  <div id="login" :class="{ recaptcha: recaptcha }">
    <form @submit="submit">
      <img :src="logoURL" alt="File Browser" />
      <h1>{{ name }}</h1>
      <div v-if="error !== ''" class="wrong">{{ error }}</div>

      <input
        :disabled="allowOffline && !firstLogin"
        autofocus
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

      <p
        v-if="!createMode"
        style="
          text-align: justify;
          text-align-last: left;
          padding: 1em 0;
          color: black;
          cursor: default;
        "
      >
        <input :disabled="firstLogin" type="checkbox" v-model="allowOffline" />
        {{ $t("repeater.allowOfflineL") }}
        <button
          v-if="!firstLogin"
          class="action"
          @click="cleanUp"
          :title="$t('repeater.cleanCache')"
        >
          <i style="color: red; font-size: 1.5em" class="material-icons"
            >delete</i
          >
        </button>
      </p>

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
  </div>
</template>

<script>
import * as auth from "@/utils/auth";
import localforage from "localforage";
import {
  name,
  logoURL,
  recaptcha,
  recaptchaKey,
  signup,
} from "@/utils/constants";

export default {
  name: "login",
  computed: {
    signup: () => signup,
    name: () => name,
    logoURL: () => logoURL,
  },
  data: function () {
    return {
      createMode: false,
      error: "",
      username: "",
      password: "",
      recaptcha: recaptcha,
      passwordConfirm: "",
      allowOffline: Number(window.localStorage.getItem("isOffline")) == 1,
      firstLogin: window.localStorage.getItem("lastRawToken") == null,
      isCleanedUp: false,
    };
  },

  watch: {
    allowOffline: function () {
      if (this.allowOffline) window.localStorage.setItem("isOffline", 1);
      else window.localStorage.setItem("isOffline", 0);
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
      window.localStorage.removeItem("isOffline");
      this.allowOffline = false;
      window.localStorage.removeItem("lastRawToken");
      this.firstLogin = true;
      this.cacheCleanUp();
    },
    cacheCleanUp() {
      var vm = this;
      localforage
        .clear()
        .then(function () {
          window.localStorage.removeItem("cKeys");
          vm.showResult();
        })
        .catch(function (err) {
          console.log(err);
        });
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
