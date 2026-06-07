import { defineCommand } from "citty";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import { createCommandRun } from "#src/commands/createCommandRun.js";
import { createCommandArgs } from "#src/schema/args/createCommandArgs.js";

export const createCommand = defineCommand({
  meta: {
    name: CE_COMMAND.CREATE,
    description: "Generate TypeScript type definitions and jin-frame API client from OpenAPI specification",
  },
  args: createCommandArgs,
  run: createCommandRun,
});
