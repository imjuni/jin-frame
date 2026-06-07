import { defineCommand } from "citty";
import { createCommandRun } from "#commands/createCommandRun.js";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";
import { createCommandArgs } from "#schema/args/createCommandArgs.js";

export const createCommand = defineCommand({
  meta: {
    name: CE_COMMAND.CREATE,
    description: "Generate TypeScript type definitions and jin-frame API client from OpenAPI specification",
  },
  args: createCommandArgs,
  run: createCommandRun,
});
