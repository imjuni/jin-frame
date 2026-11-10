import { readFile, writeFile } from "node:fs/promises";

const source = await readFile(new URL("../../../CHANGED.md", import.meta.url), "utf8");
const repository = "https://github.com/imjuni/jin-frame/blob/master/";

for (const locale of ["", "ko/"]) {
  const content = source
    .replace(/^# Changed\s*\n/, "# Changenote\n\n")
    .replace(/\]\(\.\/packages\/docs\/src\/([^)]*)\)/g, `](/${locale}$1)`)
    .replace(/\]\(\.\/CHANGED\.md(#[^)]*)?\)/g, "]($1)")
    .replace(/\]\(\.\/([^)]*)\)/g, `](${repository}$1)`);

  await writeFile(new URL(`../src/${locale}changenote.md`, import.meta.url), content);
}
