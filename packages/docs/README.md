# @jin-frame/docs

Private workspace package for the shared jin-frame, generator-cli, and generator-core documentation site. English and Korean guides live in `src/`; TypeDoc output lives in `src/api/` and is generated rather than committed.

From the repository root:

```sh
pnpm docs:dev
pnpm docs:typedoc
pnpm docs:build
pnpm docs:preview
```

`docs:dev` and `docs:build` prepare the shared assets and generate both API references before starting VitePress. Run `pnpm docs:typedoc` again after changing library APIs during a development session.

For GitHub Pages with the `/jin-frame/` base path:

```sh
pnpm --filter @jin-frame/docs run build:prod
```

The site is built into `src/.vitepress/dist`. The Pages workflow uploads that directory directly.

## API references

- `.configs/typedoc.jin-frame.json` reads `../jin-frame/src` and its production tsconfig, emitting `src/api`.
- `.configs/typedoc.generator-core.json` reads `../generator-core/src` and its production tsconfig, emitting `src/api/generator-core`.

The jin-frame reference runs first because TypeDoc cleans its output directory. The core reference runs afterward. Both generated sidebars are imported by the shared VitePress configuration. The CLI is an executable-only package; its commands and configuration are documented in the guides.

TypeDoc, its Markdown and VitePress plugins, VitePress, and Mermaid are owned by this package. The library packages do not depend on the documentation tooling.
