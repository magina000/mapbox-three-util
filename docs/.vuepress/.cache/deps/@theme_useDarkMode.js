import {
  usePreferredDark,
  useStorage
} from "./chunk-NUJ2E7UX.js";
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  watch
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useDarkMode.js
var darkModeSymbol = Symbol(__VUEPRESS_DEV__ ? "darkMode" : "");
var useDarkMode = () => {
  const isDarkMode = inject(darkModeSymbol);
  if (!isDarkMode) {
    throw new Error("useDarkMode() is called without provider.");
  }
  return isDarkMode;
};
var setupDarkMode = () => {
  const themeLocale = useThemeLocaleData();
  const isDarkPreferred = usePreferredDark();
  const darkStorage = useStorage("vuepress-color-scheme", themeLocale.value.colorMode);
  const isDarkMode = computed({
    get() {
      if (!themeLocale.value.colorModeSwitch) {
        return themeLocale.value.colorMode === "dark";
      }
      if (darkStorage.value === "auto") {
        return isDarkPreferred.value;
      }
      return darkStorage.value === "dark";
    },
    set(val) {
      if (val === isDarkPreferred.value) {
        darkStorage.value = "auto";
      } else {
        darkStorage.value = val ? "dark" : "light";
      }
    }
  });
  provide(darkModeSymbol, isDarkMode);
  updateHtmlDarkClass(isDarkMode);
};
var updateHtmlDarkClass = (isDarkMode) => {
  const update = (value = isDarkMode.value) => {
    const htmlEl = window == null ? void 0 : window.document.querySelector("html");
    htmlEl == null ? void 0 : htmlEl.classList.toggle("dark", value);
  };
  onMounted(() => {
    watch(isDarkMode, update, { immediate: true });
  });
  onUnmounted(() => update());
};
export {
  darkModeSymbol,
  setupDarkMode,
  updateHtmlDarkClass,
  useDarkMode
};
//# sourceMappingURL=@theme_useDarkMode.js.map
