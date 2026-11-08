import { cp, mkdir } from "node:fs/promises";

const assets = new URL("../../../assets/", import.meta.url);
for (const directory of ["../src/assets/", "../src/public/assets/"]) {
  const destination = new URL(directory, import.meta.url);
  await mkdir(destination, { recursive: true });
  await cp(assets, destination, { recursive: true });
}
