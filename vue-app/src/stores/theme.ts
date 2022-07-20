import { defineStore } from "pinia";

export const useThemeStore = defineStore({
  id: "themeStore",
  state: () => ({
    darkMode: defaultDarkMode(),
  }),
  getters: {},
  actions: {
    darken(darkMode: boolean) {
      this.darkMode = darkMode;
      localStorage.setItem("themeStore-darkMode", JSON.stringify(darkMode));
    },
  },
});

const defaultDarkMode = () => {
  return localStorage.getItem("themeStore-darkMode")?.length
    ? JSON.parse(localStorage.getItem("themeStore-darkMode") as string)
    : (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        false;
};
