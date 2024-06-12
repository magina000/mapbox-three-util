import {
  getAutoLink,
  isLinkInternal,
  resolvePrefix
} from "./chunk-K7GDBC4F.js";
import {
  keys,
  startsWith
} from "./chunk-U3KLAJNM.js";
import {
  computed,
  inject,
  provide
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useSidebarItems.js
import { usePageData, usePageFrontmatter, useRoute, useRouteLocale } from "vuepress/client";
import { isPlainObject, isString } from "vuepress/shared";
var sidebarItemsSymbol = Symbol("sidebarItems");
var useSidebarItems = () => {
  const sidebarItems = inject(sidebarItemsSymbol);
  if (!sidebarItems) {
    throw new Error("useSidebarItems() is called without provider.");
  }
  return sidebarItems;
};
var setupSidebarItems = () => {
  const themeLocale = useThemeLocaleData();
  const frontmatter = usePageFrontmatter();
  const page = usePageData();
  const route = useRoute();
  const routeLocale = useRouteLocale();
  const sidebarConfig = computed(() => frontmatter.value.home ? false : frontmatter.value.sidebar ?? themeLocale.value.sidebar ?? "heading");
  const sidebarDepth = computed(() => frontmatter.value.sidebarDepth ?? themeLocale.value.sidebarDepth ?? 2);
  const sidebarItems = computed(() => resolveSidebarItems(sidebarConfig.value, sidebarDepth.value, page.value, route.path, routeLocale.value));
  provide(sidebarItemsSymbol, sidebarItems);
};
var resolveSidebarItems = (sidebarConfig, sidebarDepth, page, path, routeLocale) => {
  if (sidebarConfig === false) {
    return [];
  }
  if (sidebarConfig === "heading") {
    return resolveSidebarHeadingItem(sidebarDepth, page);
  }
  if (Array.isArray(sidebarConfig)) {
    return resolveArraySidebarItems(sidebarConfig, sidebarDepth, page, path, routeLocale);
  }
  if (isPlainObject(sidebarConfig)) {
    return resolveMultiSidebarItems(sidebarConfig, sidebarDepth, page, path);
  }
  return [];
};
var resolveSidebarHeaderItem = (sidebarDepth, header) => ({
  text: header.title,
  link: header.link,
  children: resolveSidebarHeaderItems(sidebarDepth, header.children)
});
var resolveSidebarHeaderItems = (sidebarDepth, headers) => sidebarDepth > 0 ? headers.map((header) => resolveSidebarHeaderItem(sidebarDepth - 1, header)) : [];
var resolveSidebarHeadingItem = (sidebarDepth, page) => [
  {
    text: page.title,
    children: resolveSidebarHeaderItems(sidebarDepth, page.headers)
  }
];
var resolveArraySidebarItems = (sidebarConfig, sidebarDepth, page, path, prefix = "") => {
  const handleChildItem = (item, pathPrefix) => {
    var _a;
    const childItem = isString(item) ? getAutoLink(resolvePrefix(pathPrefix, item)) : isString(item.link) ? {
      ...item,
      link: isLinkInternal(item.link) ? getAutoLink(resolvePrefix(pathPrefix, item.link)).link : item.link
    } : item;
    if ("children" in childItem) {
      return {
        ...childItem,
        children: childItem.children.map((item2) => handleChildItem(item2, resolvePrefix(pathPrefix, childItem.prefix)))
      };
    }
    if (childItem.link === path) {
      const headers = ((_a = page.headers[0]) == null ? void 0 : _a.level) === 1 ? page.headers[0].children : page.headers;
      return {
        ...childItem,
        children: resolveSidebarHeaderItems(sidebarDepth, headers)
      };
    }
    return childItem;
  };
  return sidebarConfig.map((item) => handleChildItem(item, prefix));
};
var resolveMultiSidebarItems = (sidebarConfig, sidebarDepth, page, path) => {
  const sidebarRoutes = keys(sidebarConfig).sort((x, y) => y.length - x.length);
  for (const base of sidebarRoutes)
    if (startsWith(decodeURI(path), base)) {
      const matched = sidebarConfig[base];
      return matched ? matched === "heading" ? resolveSidebarHeadingItem(sidebarDepth, page) : resolveArraySidebarItems(matched, sidebarDepth, page, path, base) : [];
    }
  console.warn(`${decodeURI(path)} is missing sidebar config.`);
  return [];
};

export {
  sidebarItemsSymbol,
  useSidebarItems,
  setupSidebarItems,
  resolveSidebarItems,
  resolveSidebarHeaderItem,
  resolveSidebarHeaderItems,
  resolveSidebarHeadingItem,
  resolveArraySidebarItems,
  resolveMultiSidebarItems
};
//# sourceMappingURL=chunk-VNGGDC5Q.js.map
