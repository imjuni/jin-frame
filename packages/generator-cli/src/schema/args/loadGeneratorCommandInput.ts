import { loadConfig } from "c12";
import { defu } from "defu";
import { normalizeGeneratorOptionInput } from "#schema/args/generatorOptionSchema.js";
import { normalizeOpenAPITypeScriptOptionInput } from "#schema/args/openapiTypeScriptOptionSchema.js";

type TCommandInput = Record<string, unknown>;

function compactUndefined(record: TCommandInput): TCommandInput {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined));
}

function normalizeCommandInput(value: unknown): TCommandInput {
  const normalized = normalizeOpenAPITypeScriptOptionInput(normalizeGeneratorOptionInput(value));

  if (normalized == null || typeof normalized !== "object" || Array.isArray(normalized)) {
    return {};
  }

  return compactUndefined(normalized as TCommandInput);
}

export async function loadGeneratorCommandInput(value: unknown): Promise<TCommandInput> {
  const cliInput = normalizeCommandInput(value);
  const configFile = typeof cliInput.config === "string" ? cliInput.config : undefined;
  const loaded = await loadConfig<TCommandInput>({
    name: "jin-frame",
    configFile,
    configFileRequired: configFile != null,
    dotenv: false,
    packageJson: false,
  });
  const configInput = normalizeCommandInput(loaded.config);

  return defu(cliInput, configInput);
}
