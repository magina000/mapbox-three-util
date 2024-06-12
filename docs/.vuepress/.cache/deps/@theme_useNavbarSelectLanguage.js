import {
  useRoutePaths
} from "./chunk-U3KLAJNM.js";
import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeData,
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useNavbarSelectLanguage.js
import { useRoute, useRouteLocale, useSiteData, useSiteLocaleData } from "vuepress/client";
var useNavbarSelectLanguage = () => {
  const route = useRoute();
  const routePaths = useRoutePaths();
  const routeLocale = useRouteLocale();
  const site = useSiteData();
  const siteLocale = useSiteLocaleData();
  const theme = useThemeData();
  const themeLocale = useThemeLocaleData();
  return computed(() => {
    const localePaths = Object.keys(site.value.locales);
    if (localePaths.length < 2) {
      return [];
    }
    const currentPath = route.path;
    const currentFullPath = route.fullPath;
    const languageDropdown = {
      text: `${themeLocale.value.selectLanguageText}`,
      ariaLabel: `${themeLocale.value.selectLanguageAriaLabel ?? themeLocale.value.selectLanguageText}`,
      children: localePaths.map((targetLocalePath) => {
        var _a, _b;
        const targetSiteLocale = ((_a = site.value.locales) == null ? void 0 : _a[targetLocalePath]) ?? {};
        const targetThemeLocale = ((_b = theme.value.locales) == null ? void 0 : _b[targetLocalePath]) ?? {};
        const targetLang = `${targetSiteLocale.lang}`;
        const text = targetThemeLocale.selectLanguageName ?? targetLang;
        if (targetLang === siteLocale.value.lang) {
          return {
            text,
            activeMatch: ".",
            link: route.fullPath
          };
        }
        const targetLocalePage = currentPath.replace(routeLocale.value, targetLocalePath);
        return {
          text,
          // try to keep current hash and params across languages
          link: routePaths.value.some((item) => item === targetLocalePage) ? currentFullPath.replace(currentPath, targetLocalePage) : targetThemeLocale.home ?? targetLocalePath
        };
      })
    };
    return [languageDropdown];
  });
};
export {
  useNavbarSelectLanguage
};
//# sourceMappingURL=@theme_useNavbarSelectLanguage.js.map
