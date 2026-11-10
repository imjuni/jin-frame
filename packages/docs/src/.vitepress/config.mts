import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import ts from "typescript";
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

  const item = (text: string, path: string) => ({ text, link: `${locale}/${path}` });
  const group = (text: string, items: ReturnType<typeof item>[]) => ({
    text,
    collapsed: false,
    items,
  });

  const nav = [
    item("jin-frame", "getting-to-start"),
    item("OpenAPI generators", "generator-cli/"),
    item("OpenAPI core", "generator-core/"),
    item("Packages", "packages"),
    item("ChangeNote", "changenote"),
  ];
  const socialLinks = [
    { icon: "npm", link: "https://www.npmjs.com/package/jin-frame" },
    { icon: "github", link: "https://github.com/imjuni/jin-frame" },
  ];
  const sidebar = [
    group("Start here", [
      item("Introduction", "what-is-jin-frame"),
      item("Installation and first request", "getting-to-start"),
      item("HTTP Methods", "usage-method"),
      item("URL templates", "method/url-template"),
      item("Factory and Builder", "method/builder"),
      item("Inheritance and defaults", "method/inheritance"),
    ]),
    group("Request fields", [
      item("Path parameters", "field/param"),
      item("Query parameters", "field/query"),
      item("Headers", "field/header"),
      item("Cookies", "field/cookie"),
      item("Body fields", "field/body"),
      item("Object bodies", "field/objectbody"),
      item("Formatters", "field/formatters"),
      item("Forms and files", "method/form"),
    ]),
    group("Responses and execution", [
      item("Status unions and errors", "method/responses"),
      item("Zod validation", "method/validation"),
      item("Authentication", "method/authorization"),
      item("Retry and timeout", "method/retry"),
      item("Request deduplication", "method/dedupe"),
      item("Lifecycle hooks", "method/hook"),
      item("Testing with MSW", "method/mocking"),
      item("Naming conventions", "method/naming-convention"),
    ]),
    group("OpenAPI generators", [
      item("Overview", "generator"),
      item("CLI installation", "generator-cli/"),
      item("CLI commands", "generator-cli/commands"),
      item("CLI configuration", "generator-cli/configuration"),
      item("Core installation", "generator-core/"),
      item("Generation pipeline", "generator-core/pipeline"),
      item("Core configuration", "generator-core/configuration"),
      item("Diagnostics", "generator-core/diagnostics"),
    ]),
    group("Reference", [
      item("Package versions", "packages"),
      item("Migrate to v6", "migration-v6"),
      item(_locale === "ko" ? "변경 이력" : "Changenote", "changenote"),
    ]),
    { text: "jin-frame API", collapsed: true, items: typedocSidebar },
    { text: "generator-core API", collapsed: true, items: coreTypedocSidebar },
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
    languages: ["js", "jsx", "ts", "tsx"],
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            strict: true,
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.Bundler,
          },
        },
      }),
    ],
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
