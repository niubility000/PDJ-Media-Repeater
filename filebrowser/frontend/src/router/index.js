import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout.vue";
import Wordreciter from "@/views/files/Wordreciter.vue";
import MistakeBook from "@/views/files/Mistakebook.vue";
import Reminder from "@/views/files/Reminder.vue";
import Files from "@/views/Files.vue";
import Share from "@/views/Share.vue";
import Users from "@/views/settings/Users.vue";
import User from "@/views/settings/User.vue";
import Settings from "@/views/Settings.vue";
import GlobalSettings from "@/views/settings/Global.vue";
import ProfileSettings from "@/views/settings/Profile.vue";
import Shares from "@/views/settings/Shares.vue";
import Errors from "@/views/Errors.vue";
import store from "@/store";
import { baseURL, name } from "@/utils/constants";
import i18n, { rtlLanguages } from "@/i18n";

Vue.use(Router);

const titles = {
  Login: "sidebar.login",
  Share: "buttons.share",
  Files: "files.files",
  Settings: "sidebar.settings",
  ProfileSettings: "settings.profileSettings",
  Shares: "settings.shareManagement",
  GlobalSettings: "settings.globalSettings",
  Users: "settings.users",
  User: "settings.user",
  Forbidden: "errors.forbidden",
  NotFound: "errors.notFound",
  InternalServerError: "errors.internal",
};

const router = new Router({
  base: import.meta.env.PROD ? baseURL : "",
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.getters.isLogged) {
          return next({ path: "/files" });
        }
        next();
      },
    },
    {
      path: "/files-WordReciter",
      name: "WordReciter",
      component: Wordreciter,
    },
    {
      path: "/files-Reminder",
      name: "reminder",
      component: Reminder,
    },
    {
      path: "/files-MistakeBook",
      name: "mistakeBook",
      component: MistakeBook,
    },
    {
      path: "/*",
      component: Layout,
      children: [
        {
          path: "/share/*",
          name: "Share",
          component: Share,
        },
        {
          path: "/files/*",
          name: "Files",
          component: Files,
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: "/settings",
          name: "Settings",
          component: Settings,
          redirect: {
            path: "/settings/profile",
          },
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: "/settings/profile",
              name: "ProfileSettings",
              component: ProfileSettings,
            },
            {
              path: "/settings/shares",
              name: "Shares",
              component: Shares,
            },
            {
              path: "/settings/global",
              name: "GlobalSettings",
              component: GlobalSettings,
              meta: {
                requiresAdmin: true,
              },
            },
            {
              path: "/settings/users",
              name: "Users",
              component: Users,
              meta: {
                requiresAdmin: true,
              },
            },
            {
              path: "/settings/users/*",
              name: "User",
              component: User,
              meta: {
                requiresAdmin: true,
              },
            },
          ],
        },
        {
          path: "/403",
          name: "Forbidden",
          component: Errors,
          props: {
            errorCode: 403,
            showHeader: true,
          },
        },
        {
          path: "/404",
          name: "NotFound",
          component: Errors,
          props: {
            errorCode: 404,
            showHeader: true,
          },
        },
        {
          path: "/500",
          name: "InternalServerError",
          component: Errors,
          props: {
            errorCode: 500,
            showHeader: true,
          },
        },
        {
          path: "/files",
          redirect: {
            path: "/files/",
          },
        },
        {
          path: "/*",
          redirect: (to) => `/files${to.path}`,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const title = i18n.t(titles[to.name]);
  document.title = title + " - " + name;

  /*** RTL related settings per route ****/
  const rtlSet = document.querySelector("body").classList.contains("rtl");
  const shouldSetRtl = rtlLanguages.includes(i18n.locale);
  switch (true) {
    case shouldSetRtl && !rtlSet:
      document.querySelector("body").classList.add("rtl");
      break;
    case !shouldSetRtl && rtlSet:
      document.querySelector("body").classList.remove("rtl");
      break;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLogged) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });

      return;
    }

    if (to.matched.some((record) => record.meta.requiresAdmin)) {
      if (!store.state.user.perm.admin) {
        next({ path: "/403" });
        return;
      }
    }
  }

  next();
});

router.afterEach((to, from) => {
  const listing = document.getElementById("listing");
  if (listing && from.path.startsWith("/files/")) {
    store.commit("saveScrollPosition", {
      path: from.path,
      scrollTop: listing.scrollTop,
    });
  }
  if (to.path.startsWith("/files/")) {
    const toIsDir = to.path.endsWith("/");
    const fromIsDir = from.path.endsWith("/");
    if (toIsDir) {
      if (fromIsDir && from.path.startsWith(to.path) && from.path.length > to.path.length) {
        if (store.state.parentPath === to.path) {
          store.commit("setLastOpenedIndex", store.state.parentPathIndex);
        }
      } else if (!fromIsDir) {
        store.commit("setLastOpenedIndex", store.state.lastOpenedIndex);
      } else if (to.path.startsWith(from.path) && to.path.length > from.path.length) {
        store.commit("clearLastOpenedIndex");
      } else {
        store.commit("clearLastOpenedIndex");
        store.commit("clearParentPathIndex");
      }
    }
  }
});

export default router;
