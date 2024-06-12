import {
  resolveEditLink
} from "./chunk-K7GDBC4F.js";
import "./chunk-U3KLAJNM.js";
import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useEditLink.js
import { usePageData, usePageFrontmatter } from "vuepress/client";
var useEditLink = () => {
  const themeLocale = useThemeLocaleData();
  const page = usePageData();
  const frontmatter = usePageFrontmatter();
  return computed(() => {
    const showEditLink = frontmatter.value.editLink ?? themeLocale.value.editLink ?? true;
    if (!showEditLink) {
      return null;
    }
    const { repo, docsRepo = repo, docsBranch = "main", docsDir = "", editLinkText } = themeLocale.value;
    if (!docsRepo)
      return null;
    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern: frontmatter.value.editLinkPattern ?? themeLocale.value.editLinkPattern
    });
    if (!editLink)
      return null;
    return {
      text: editLinkText ?? "Edit this page",
      link: editLink
    };
  });
};
export {
  useEditLink
};
//# sourceMappingURL=@theme_useEditLink.js.map
