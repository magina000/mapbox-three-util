import {
  ensureEndingSlash,
  isLinkAbsolute,
  isLinkWithProtocol
} from "./chunk-U3KLAJNM.js";

// node_modules/@vuepress/theme-default/lib/client/utils/getAutoLink.js
import { resolveRoute } from "vuepress/client";
var getAutoLink = (config, currentPath) => {
  const { notFound, meta, path } = resolveRoute(config, currentPath);
  return notFound ? { text: path, link: path } : {
    text: meta.title || path,
    link: path
  };
};

// node_modules/@vuepress/theme-default/lib/client/utils/isLinkInternal.js
import { isLinkExternal, isLinkWithProtocol as isLinkWithProtocol2 } from "vuepress/shared";
var isLinkInternal = (link) => !isLinkExternal(link) && !isLinkWithProtocol2(link);

// node_modules/@vuepress/theme-default/lib/client/utils/resolveRepoType.js
import { isLinkHttp } from "vuepress/shared";
var resolveRepoType = (repo) => {
  if (!isLinkHttp(repo) || /github\.com/.test(repo))
    return "GitHub";
  if (/bitbucket\.org/.test(repo))
    return "Bitbucket";
  if (/gitlab\.com/.test(repo))
    return "GitLab";
  if (/gitee\.com/.test(repo))
    return "Gitee";
  return null;
};

// node_modules/@vuepress/theme-default/lib/client/utils/resolveEditLink.js
import { isLinkHttp as isLinkHttp2, removeEndingSlash, removeLeadingSlash } from "vuepress/shared";
var editLinkPatterns = {
  GitHub: ":repo/edit/:branch/:path",
  GitLab: ":repo/-/edit/:branch/:path",
  Gitee: ":repo/edit/:branch/:path",
  Bitbucket: ":repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default"
};
var resolveEditLinkPatterns = ({ docsRepo, editLinkPattern }) => {
  if (editLinkPattern) {
    return editLinkPattern;
  }
  const repoType = resolveRepoType(docsRepo);
  if (repoType !== null) {
    return editLinkPatterns[repoType];
  }
  return null;
};
var resolveEditLink = ({ docsRepo, docsBranch, docsDir, filePathRelative, editLinkPattern }) => {
  if (!filePathRelative)
    return null;
  const pattern = resolveEditLinkPatterns({ docsRepo, editLinkPattern });
  if (!pattern)
    return null;
  return pattern.replace(/:repo/, isLinkHttp2(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`).replace(/:branch/, docsBranch).replace(/:path/, removeLeadingSlash(`${removeEndingSlash(docsDir)}/${filePathRelative}`));
};

// node_modules/@vuepress/theme-default/lib/client/utils/resolvePrefix.js
var resolvePrefix = (prefix = "", path = "") => isLinkAbsolute(path) || isLinkWithProtocol(path) ? path : `${ensureEndingSlash(prefix)}${path}`;

export {
  getAutoLink,
  isLinkInternal,
  resolveRepoType,
  resolveEditLink,
  resolvePrefix
};
//# sourceMappingURL=chunk-K7GDBC4F.js.map
