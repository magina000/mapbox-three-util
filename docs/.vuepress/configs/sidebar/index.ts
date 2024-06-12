import type { SidebarObjectOptions } from '@vuepress/theme-default'

export const sidebar: SidebarObjectOptions = {
  '/guide/': [
    {
      text: '指南',
      children: [
        { text: '介绍', link: '/guide/introduction.md' },
        { text: '快速上手', link: '/guide/getting-started.md' },
      ],
    },
  ],
  '/effect/': [
    {
      text: '实现',
      children: [{ text: '创建场景', link: '/effect/create-scene.md' }],
    },
  ],
}
