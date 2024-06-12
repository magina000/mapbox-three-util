import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useContributors.js
import { usePageData, usePageFrontmatter } from "vuepress/client";
var useContributors = () => {
  const themeLocale = useThemeLocaleData();
  const page = usePageData();
  const frontmatter = usePageFrontmatter();
  return computed(() => {
    var _a;
    const showContributors = frontmatter.value.contributors ?? themeLocale.value.contributors ?? true;
    if (!showContributors)
      return null;
    return ((_a = page.value.git) == null ? void 0 : _a.contributors) ?? null;
  });
};
export {
  useContributors
};
//# sourceMappingURL=@theme_useContributors.js.map
