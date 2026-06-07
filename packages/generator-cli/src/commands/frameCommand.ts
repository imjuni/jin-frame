import { defineCommand } from "citty";
import { frameCommandRun } from "#src/commands/frameCommandRun.js";
import { CE_COMMAND } from "#src/interfaces/CE_COMMAND.js";
import { frameCommandArgs } from "#src/schema/args/frameCommandArgs.js";

export const frameCommand = defineCommand({
  meta: {
    name: CE_COMMAND.FRAME,
    description: "Generate jin-frame API client classes from existing TypeScript type definitions",
  },
  args: frameCommandArgs,
  run: frameCommandRun,
});
