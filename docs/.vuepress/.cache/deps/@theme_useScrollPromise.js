// node_modules/@vuepress/theme-default/lib/client/composables/useScrollPromise.js
var promise = null;
var promiseResolve = null;
var scrollPromise = {
  wait: () => promise,
  pending: () => {
    promise = new Promise((resolve) => promiseResolve = resolve);
  },
  resolve: () => {
    promiseResolve == null ? void 0 : promiseResolve();
    promise = null;
    promiseResolve = null;
  }
};
var useScrollPromise = () => scrollPromise;
export {
  useScrollPromise
};
//# sourceMappingURL=@theme_useScrollPromise.js.map
