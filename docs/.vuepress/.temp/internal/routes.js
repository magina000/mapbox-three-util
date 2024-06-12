export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"G:/个人/mapbox-three-util/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"首页"} }],
  ["/effect/create-scene.html", { loader: () => import(/* webpackChunkName: "effect_create-scene.html" */"G:/个人/mapbox-three-util/docs/.vuepress/.temp/pages/effect/create-scene.html.js"), meta: {"title":"创建场景"} }],
  ["/guide/getting-started.html", { loader: () => import(/* webpackChunkName: "guide_getting-started.html" */"G:/个人/mapbox-three-util/docs/.vuepress/.temp/pages/guide/getting-started.html.js"), meta: {"title":"快速上手"} }],
  ["/guide/introduction.html", { loader: () => import(/* webpackChunkName: "guide_introduction.html" */"G:/个人/mapbox-three-util/docs/.vuepress/.temp/pages/guide/introduction.html.js"), meta: {"title":"介绍"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"G:/个人/mapbox-three-util/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
