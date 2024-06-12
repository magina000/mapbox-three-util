import {
  isLinkAbsolute,
  isLinkWithProtocol
} from "./chunk-U3KLAJNM.js";
import "./chunk-RY5ODQAQ.js";

// node_modules/@vuepress/theme-default/lib/client/composables/useNavigate.js
import { useRoute, useRouter } from "vuepress/client";
var useNavigate = () => {
  const router = useRouter();
  const route = useRoute();
  return (url) => {
    if (url)
      if (isLinkAbsolute(url)) {
        if (route.path !== url)
          router.push(url);
      } else if (isLinkWithProtocol(url)) {
        window == null ? void 0 : window.open(url);
      } else {
        router.push(encodeURI(url));
      }
  };
};
export {
  useNavigate
};
//# sourceMappingURL=@theme_useNavigate.js.map
