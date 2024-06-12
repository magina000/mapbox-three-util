import {
  getAutoLink,
  isLinkInternal,
  resolvePrefix
} from "./chunk-K7GDBC4F.js";
import "./chunk-U3KLAJNM.js";
import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useNavbarConfig.js
import { isString } from "vuepress/shared";
var resolveNavbarItem = (item, prefix = "") => {
  if (isString(item)) {
    return getAutoLink(resolvePrefix(prefix, item));
  }
  if ("children" in item) {
    return {
      ...item,
      children: item.children.map((child) => resolveNavbarItem(child, resolvePrefix(prefix, item.prefix)))
    };
  }
  return {
    ...item,
    link: isLinkInternal(item.link) ? getAutoLink(resolvePrefix(prefix, item.link)).link : item.link
  };
};
var useNavbarConfig = () => {
  const themeLocale = useThemeLocaleData();
  return computed(() => (themeLocale.value.navbar || []).map((item) => resolveNavbarItem(item)));
};
export {
  useNavbarConfig
};
//# sourceMappingURL=@theme_useNavbarConfig.js.map
