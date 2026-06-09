import { defineCommand, runMain } from "citty";
import log from "consola";
import { isError } from "my-easy-fp";
import { install as sourceMapSupportInstall } from "source-map-support";
import { createCommand } from "#commands/createCommand.js";
import { frameCommand } from "#commands/frameCommand.js";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";

sourceMapSupportInstall();

const main = defineCommand({
  meta: {
    name: "frame-cli",
    version: "1.0.0",
    description: "A CLI tool for generating jin-frame classes from an OpenAPI specification.",
  },
  subCommands: {
    [CE_COMMAND.CREATE]: createCommand,
    [CE_COMMAND.FRAME]: frameCommand,
  },
});

runMain(main).catch((caught) => {
  const err = isError(caught, new Error("unknown error raised"));

  log.error(err.message);
  log.error(err.stack);
});
