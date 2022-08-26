import { defaultTheme, type NavbarConfig } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
// @ts-ignore
import { typedocPlugin } from 'vuepress-plugin-typedoc/next';
// const { mermaidPlugin } = require('@renovamen/vuepress-plugin-mermaid');

const navs: NavbarConfig = [
  {
    text: 'Guide',
    link: '/',
  },
  {
    text: 'Usage',
    children: [
      {
        text: 'Param',
        link: '/usage/param.md',
      },
      {
        text: 'Querystring',
        link: '/usage/querystring.md',
      },
      {
        text: 'Header',
        link: '/usage/header.md',
      },
      {
        text: 'Body',
        link: '/usage/body.md',
      },
      {
        text: 'Object Body',
        link: '/usage/object-body.md',
      },
    ],
  },
  {
    text: 'More',
    children: [
      {
        text: 'Utility Types',
        link: '/more/types.md',
      },
    ],
  },
  {
    text: 'API Reference',
    link: '/api/README.md',
  },
  {
    text: 'Github',
    link: 'https://github.com/imjuni/jin-frame',
  },
];

export default defineUserConfig({
  lang: 'en-US',
  title: 'jin-frame',
  description: 'Reusable HTTP request definition library',
  plugins: [
    // mermaidPlugin({ theme: 'dark', token: 'mermaid' }),
    typedocPlugin({
      // plugin options
      entryPoints: ['src/index.ts'],
      tsconfig: 'tsconfig.json',
      readme: 'none',
    }),
  ],
  base: '/jin-frame/',
  theme: defaultTheme({
    locales: {
      '/': {
        navbar: navs,
      },
    },
  }),
});
