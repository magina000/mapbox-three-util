import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useLastUpdated.js
import { usePageData, usePageFrontmatter } from "vuepress/client";
var useLastUpdated = () => {
  const themeLocale = useThemeLocaleData();
  const page = usePageData();
  const frontmatter = usePageFrontmatter();
  return computed(() => {
    var _a, _b;
    const showLastUpdated = frontmatter.value.lastUpdated ?? themeLocale.value.lastUpdated ?? true;
    if (!showLastUpdated)
      return null;
    if (!((_a = page.value.git) == null ? void 0 : _a.updatedTime))
      return null;
    const updatedDate = new Date((_b = page.value.git) == null ? void 0 : _b.updatedTime);
    return updatedDate.toLocaleString();
  });
};
export {
  useLastUpdated
};
//# sourceMappingURL=@theme_useLastUpdated.js.map
