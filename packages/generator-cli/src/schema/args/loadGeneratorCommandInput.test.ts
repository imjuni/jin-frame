import fs from "node:fs";
import os from "node:os";
import pathe from "pathe";
import { describe, expect, it } from "vitest";
import { loadGeneratorCommandInput } from "#schema/args/loadGeneratorCommandInput.js";

describe("loadGeneratorCommandInput", () => {
  it("should merge config file endpoint overrides with cli endpoint overrides", async () => {
    const dirPath = await fs.promises.mkdtemp(pathe.join(os.tmpdir(), "frame-cli-config-"));
    const configFile = pathe.join(dirPath, "frame-cli.config.mjs");

    await fs.promises.writeFile(
      configFile,
      [
        "export default {",
        "  timeout: 30000,",
        "  timeouts: { '/pets/{petId}': 1000 },",
        "  hosts: { '/pets/{petId}': 'https://config.example.com' },",
        "};",
      ].join("\n"),
    );

    const input = await loadGeneratorCommandInput({
      config: configFile,
      spec: "/openapi.yml",
      output: "/generated",
      timeout: "/pets/{petId}=3000",
    });

    expect(input).toEqual(
      expect.objectContaining({
        spec: "/openapi.yml",
        output: "/generated",
        timeout: 30000,
        hosts: {
          "/pets/{petId}": "https://config.example.com",
        },
        timeouts: {
          "/pets/{petId}": 3000,
        },
      }),
    );
  });
});
