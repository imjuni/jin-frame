import type { CommandContext } from "citty";
import { createCommandHandler } from "#src/handlers/createCommandHandler.js";
import type { createCommandArgs } from "#src/schema/args/createCommandArgs.js";
import { createCommandArgvSchema } from "#src/schema/args/createCommandArgvSchema.js";
import { loadGeneratorCommandInput } from "#src/schema/args/loadGeneratorCommandInput.js";

export const createCommandRun = async ({ args }: CommandContext<typeof createCommandArgs>) => {
  const input = await loadGeneratorCommandInput(args);
  await createCommandHandler(createCommandArgvSchema.parse(input));
};
