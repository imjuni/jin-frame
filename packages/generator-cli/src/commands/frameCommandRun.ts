import type { CommandContext } from "citty";
import { frameCommandHandler } from "#src/handlers/frameCommandHandler.js";
import type { frameCommandArgs } from "#src/schema/args/frameCommandArgs.js";
import { frameCommandArgvSchema } from "#src/schema/args/frameCommandArgvSchema.js";

export const frameCommandRun = async ({ args }: CommandContext<typeof frameCommandArgs>) => {
  await frameCommandHandler(frameCommandArgvSchema.parse(args));
};
