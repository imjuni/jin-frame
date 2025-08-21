import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/typedoc-sidebar.json';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'jin-frame',
  description: 'Declarative API definition',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/',
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Document', link: '/what-is-jin-frame' },
        ],

        sidebar: [
          {
            text: 'Document',
            items: [
              { text: 'What is jin-frame?', link: '/what-is-jin-frame' },
              { text: 'Getting To Start', link: '/getting-to-start' },
              {
                text: 'Query / Body / Param / Header',
                items: [
                  {
                    text: 'Query',
                    link: 'usage-query.md',
                  },
                  {
                    text: 'Param',
                    link: 'usage-param.md',
                  },
                  {
                    text: 'Header',
                    link: 'usage-header.md',
                  },
                ],
              },
            ],
          },
          {
            text: 'API',
            items: typedocSidebar,
          },
        ],
      },
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      link: '/ko/',
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Document', link: '/what-is-jin-frame' },
        ],

        sidebar: [
          {
            text: 'Document',
            items: [
              { text: 'What is jin-frame?', link: '/what-is-jin-frame' },
              { text: 'Getting To Start', link: '/getting-to-start' },
            ],
          },
          {
            text: 'API',
            items: typedocSidebar,
          },
        ],
      },
    },
  },
});
