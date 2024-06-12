import type { NavbarOptions } from '@vuepress/theme-default'

export const navbar: NavbarOptions = [
  {
    text: '指南',
    children: [
      { text: '介绍', link: '/guide/introduction.md' },
      { text: '快速上手', link: '/guide/getting-started.md' },
    ],
  },
  {
    text: '实现',
    children: [{ text: '创建场景', link: '/effect/create-scene.md' }],
  },
]
