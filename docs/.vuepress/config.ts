import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

import { navbar, sidebar } from './configs/index.js'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    navbar,
    sidebar,
  }),
  lang: 'zh-CN',
  title: 'HikMapbox',
  // description: "",
})
