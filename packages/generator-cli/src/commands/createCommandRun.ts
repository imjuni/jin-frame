import type { CommandContext } from "citty";
import { createCommandHandler } from "#src/handlers/createCommandHandler.js";
import type { createCommandArgs } from "#src/schema/args/createCommandArgs.js";
import { createCommandArgvSchema } from "#src/schema/args/createCommandArgvSchema.js";

export const createCommandRun = async ({ args }: CommandContext<typeof createCommandArgs>) => {
  await createCommandHandler(createCommandArgvSchema.parse(args));
};
