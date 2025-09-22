import { defineConfig } from 'vitepress';
import typedocSidebar from '../api/typedoc-sidebar.json';

const base = process.env.BASE_DIR;

const getThemeConfig = (_locale?: string) => {
  const locale = _locale != null ? `/${_locale}` : '';

  const logo = {
    light: './docs/assets/jin-frame-brand-icon.png',
    dark: './docs/assets/jin-frame-brand-icon.png',
  };

  const nav = [
    { text: 'Home', link: '/' },
    { text: 'Document', link: '/what-is-jin-frame' },
    { text: 'Github', link: 'https://github.com/imjuni/jin-frame' },
  ];

  const socialLinks = [
    { icon: 'npm', link: 'https://www.npmjs.com/package/jin-frame' },
    { icon: 'github', link: 'https://github.com/imjuni/jin-frame' },
  ];

  const sidebar = [
    {
      text: 'Document',
      items: [
        { text: 'What is jin-frame?', link: `${locale}/what-is-jin-frame` },
        { text: 'Getting To Start', link: `${locale}/getting-to-start` },
        {
          text: 'Method',
          link: `${locale}/usage-method.md`,
          items: [
            {
              text: 'Authorization',
              link: `${locale}/method/authorization.md`,
            },
            {
              text: 'Inheritance',
              link: `${locale}/method/inheritance.md`,
            },
            {
              text: 'Retry',
              link: `${locale}/method/retry.md`,
            },
            {
              text: 'Mocking',
              link: `${locale}/method/mocking.md`,
            },
            {
              text: 'Form',
              link: `${locale}/method/form.md`,
            },
          ],
        },
        {
          text: 'Field',
          items: [
            {
              text: 'Query',
              link: `${locale}/field/query.md`,
            },
            {
              text: 'Param',
              link: `${locale}/field/param.md`,
            },
            {
              text: 'Body',
              link: `${locale}/field/body.md`,
            },
            {
              text: 'ObjectBody',
              link: `${locale}/field/objectbody.md`,
            },
            {
              text: 'Header',
              link: `${locale}/field/header.md`,
            },
            {
              text: 'Formatters',
              link: `${locale}/field/formatters.md`,
            },
          ],
        },
      ],
    },
    {
      text: 'API',
      items: typedocSidebar,
    },
  ];

  return {
    logo,
    nav,
    sidebar,
    socialLinks,
  };
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'jin-frame',
  description: 'Declarative API definition',
  base,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/',
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: getThemeConfig(),
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      link: '/ko/',
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: getThemeConfig('ko'),
    },
  },
});
