import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";
import coreTypedocSidebar from "../api/generator-core/typedoc-sidebar.json";

const base = process.env.BASE_DIR;

const getThemeConfig = (_locale?: string) => {
  const locale = _locale != null ? `/${_locale}` : "";

  const logo = {
    light: "/assets/jin-frame-brand-icon.png",
    dark: "/assets/jin-frame-brand-icon.png",
  };

  const nav = [
    { text: "Home", link: `${locale}/` },
    { text: "Packages", link: `${locale}/packages` },
    { text: "CLI", link: `${locale}/generator-cli/` },
    { text: "Core", link: `${locale}/generator-core/` },
    { text: "jin-frame", link: `${locale}/what-is-jin-frame` },
    { text: "Github", link: "https://github.com/imjuni/jin-frame" },
  ];

  const socialLinks = [
    { icon: "npm", link: "https://www.npmjs.com/package/jin-frame" },
    { icon: "github", link: "https://github.com/imjuni/jin-frame" },
  ];

  const sidebar = [
    {
      text: "jin-frame 6.0",
      items: [
        { text: "What is jin-frame?", link: `${locale}/what-is-jin-frame` },
        { text: "Getting To Start", link: `${locale}/getting-to-start` },
        { text: "Migration to 6.0", link: `${locale}/migration-v6` },
        { text: "OpenAPI Generator", link: `${locale}/generator` },
        {
          text: "Method",
          link: `${locale}/usage-method.md`,
          items: [
            {
              text: "Naming Convention",
              link: `${locale}/method/naming-convention.md`,
            },
            {
              text: "URL Template",
              link: `${locale}/method/url-template.md`,
            },
            {
              text: "Authorization",
              link: `${locale}/method/authorization.md`,
            },
            {
              text: "Inheritance",
              link: `${locale}/method/inheritance.md`,
            },
            {
              text: "Retry",
              link: `${locale}/method/retry.md`,
            },
            {
              text: "Mocking",
              link: `${locale}/method/mocking.md`,
            },
            {
              text: "Form",
              link: `${locale}/method/form.md`,
            },
            {
              text: "Validation",
              link: `${locale}/method/validation.md`,
            },
            {
              text: "Dedupe",
              link: `${locale}/method/dedupe.md`,
            },
            {
              text: "Hook",
              link: `${locale}/method/hook.md`,
            },
            {
              text: "Builder",
              link: `${locale}/method/builder.md`,
            },
          ],
        },
        {
          text: "Field",
          items: [
            {
              text: "Query",
              link: `${locale}/field/query.md`,
            },
            {
              text: "Param",
              link: `${locale}/field/param.md`,
            },
            {
              text: "Body",
              link: `${locale}/field/body.md`,
            },
            {
              text: "ObjectBody",
              link: `${locale}/field/objectbody.md`,
            },
            {
              text: "Header",
              link: `${locale}/field/header.md`,
            },
            {
              text: "Formatters",
              link: `${locale}/field/formatters.md`,
            },
          ],
        },
      ],
    },
    {
      text: "Packages",
      items: [{ text: "Overview", link: `${locale}/packages` }],
    },
    {
      text: "generator-cli 1.0",
      items: [
        { text: "Getting started", link: `${locale}/generator-cli/` },
        { text: "Commands", link: `${locale}/generator-cli/commands` },
        { text: "Configuration", link: `${locale}/generator-cli/configuration` },
      ],
    },
    {
      text: "generator-core 1.0",
      items: [
        { text: "Getting started", link: `${locale}/generator-core/` },
        { text: "Generation pipeline", link: `${locale}/generator-core/pipeline` },
        { text: "Configuration", link: `${locale}/generator-core/configuration` },
        { text: "Progress and diagnostics", link: `${locale}/generator-core/diagnostics` },
      ],
    },
    {
      text: "jin-frame API",
      items: typedocSidebar,
    },
    {
      text: "generator-core API",
      items: coreTypedocSidebar,
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
  title: "jin-frame",
  description: "Declarative API definition",
  base,
  ignoreDeadLinks: true,
  markdown: {
    config: (md) => {
      const fence =
        md.renderer.rules.fence ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
      md.renderer.rules.fence = (...args) => {
        const [tokens, idx] = args;
        const token = tokens[idx];
        if (token.info === "mermaid") {
          return `<Mermaid code="${encodeURIComponent(token.content)}" />`;
        }
        return fence(...args);
      };
    },
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
      link: "/",
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: getThemeConfig(),
    },
    ko: {
      label: "한국어",
      lang: "ko",
      link: "/ko/",
      // https://vitepress.dev/reference/default-theme-config
      themeConfig: getThemeConfig("ko"),
    },
  },
});
