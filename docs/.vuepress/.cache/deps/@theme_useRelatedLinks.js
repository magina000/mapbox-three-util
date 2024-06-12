import {
  useSidebarItems
} from "./chunk-VNGGDC5Q.js";
import {
  getAutoLink
} from "./chunk-K7GDBC4F.js";
import "./chunk-U3KLAJNM.js";
import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useRelatedLinks.js
import { resolveRoute, usePageFrontmatter, useRoute } from "vuepress/client";
import { isPlainObject, isString } from "vuepress/shared";
var resolveFromFrontmatterConfig = (config, currentPath) => {
  if (config === false) {
    return false;
  }
  if (isString(config)) {
    return getAutoLink(config, currentPath);
  }
  if (isPlainObject(config)) {
    return {
      ...config,
      link: getAutoLink(config.link, currentPath).link
    };
  }
  return null;
};
var resolveFromSidebarItems = (sidebarItems, currentPath, offset) => {
  const linkIndex = sidebarItems.findIndex((item) => item.link === currentPath);
  if (linkIndex !== -1) {
    const targetItem = sidebarItems[linkIndex + offset];
    if (!targetItem)
      return null;
    if (targetItem.link)
      return targetItem;
    if ("prefix" in targetItem && !resolveRoute(targetItem.prefix).notFound)
      return {
        ...targetItem,
        link: targetItem.prefix
      };
    return null;
  }
  for (const item of sidebarItems) {
    if ("children" in item) {
      const childResult = resolveFromSidebarItems(item.children, currentPath, offset);
      if (childResult) {
        return childResult;
      }
    }
  }
  const prefixIndex = sidebarItems.findIndex((item) => "prefix" in item && item.prefix === currentPath);
  if (prefixIndex !== -1) {
    const targetItem = sidebarItems[prefixIndex + offset];
    if (!targetItem)
      return null;
    if (targetItem.link)
      return targetItem;
    if ("prefix" in targetItem && !resolveRoute(targetItem.prefix).notFound)
      return {
        ...targetItem,
        link: targetItem.prefix
      };
    return null;
  }
  return null;
};
var useRelatedLinks = () => {
  const frontmatter = usePageFrontmatter();
  const themeLocale = useThemeLocaleData();
  const sidebarItems = useSidebarItems();
  const route = useRoute();
  const prevLink = computed(() => {
    const prevConfig = resolveFromFrontmatterConfig(frontmatter.value.prev, route.path);
    return prevConfig === false ? null : prevConfig ?? (themeLocale.value.prev === false ? null : resolveFromSidebarItems(sidebarItems.value, route.path, -1));
  });
  const nextLink = computed(() => {
    const nextConfig = resolveFromFrontmatterConfig(frontmatter.value.next, route.path);
    return nextConfig === false ? null : nextConfig ?? (themeLocale.value.next === false ? null : resolveFromSidebarItems(sidebarItems.value, route.path, 1));
  });
  return {
    prevLink,
    nextLink
  };
};
export {
  useRelatedLinks
};
//# sourceMappingURL=@theme_useRelatedLinks.js.map
