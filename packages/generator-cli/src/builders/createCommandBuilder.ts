import type { Argv } from "yargs";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import type { TCreateCommandArgv } from "#src/interfaces/ICreateCommandArgv.js";
import { coercePathOrUrl } from "#src/validators/coercePathOrUrl.js";

export function createCommandBuilder(argv: Argv<TCreateCommandArgv>): Argv<TCreateCommandArgv> {
  argv
    .option("action", {
      type: "string",
      default: CE_COMMAND.CREATE,
      hidden: true,
    })
    .positional("spec", {
      type: "string",
      demandOption: true,
      describe: "Path to the OpenAPI specification file (JSON or YAML)",
      coerce: coercePathOrUrl,
    });

  return argv;
}
