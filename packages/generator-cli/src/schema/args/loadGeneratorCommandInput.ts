import { loadConfig } from "c12";
import { defu } from "defu";
import { normalizeCommandInput } from "#schema/args/normalizeCommandInput.js";
import type { TCommandInput } from "#schema/args/TCommandInput.js";

export async function loadGeneratorCommandInput(value: unknown): Promise<TCommandInput> {
  const cliInput = normalizeCommandInput(value);
  const configFile = typeof cliInput.config === "string" ? cliInput.config : undefined;
  const loaded = await loadConfig<TCommandInput>({
    name: "frame-cli",
    configFile,
    configFileRequired: configFile != null,
    dotenv: false,
    packageJson: false,
  });
  const configInput = normalizeCommandInput(loaded.config);

  return defu(cliInput, configInput);
}
