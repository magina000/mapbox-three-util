import {
  resolveRepoType
} from "./chunk-K7GDBC4F.js";
import "./chunk-U3KLAJNM.js";
import {
  computed
} from "./chunk-RY5ODQAQ.js";
import {
  useThemeLocaleData
} from "./chunk-S2KHOG74.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useNavbarRepo.js
import { isLinkHttp } from "vuepress/shared";
var useNavbarRepo = () => {
  const themeLocale = useThemeLocaleData();
  const repo = computed(() => themeLocale.value.repo);
  const repoType = computed(() => repo.value ? resolveRepoType(repo.value) : null);
  const repoLink = computed(() => {
    if (repo.value && !isLinkHttp(repo.value)) {
      return `https://github.com/${repo.value}`;
    }
    return repo.value;
  });
  const repoLabel = computed(() => {
    if (!repoLink.value)
      return null;
    if (themeLocale.value.repoLabel)
      return themeLocale.value.repoLabel;
    if (repoType.value === null)
      return "Source";
    return repoType.value;
  });
  return computed(() => {
    if (!repoLink.value || !repoLabel.value) {
      return [];
    }
    return [
      {
        text: repoLabel.value,
        link: repoLink.value
      }
    ];
  });
};
export {
  useNavbarRepo
};
//# sourceMappingURL=@theme_useNavbarRepo.js.map
