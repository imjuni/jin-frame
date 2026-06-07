import type { CommandContext } from "citty";
import { frameCommandHandler } from "#src/handlers/frameCommandHandler.js";
import type { frameCommandArgs } from "#src/schema/args/frameCommandArgs.js";
import { frameCommandArgvSchema } from "#src/schema/args/frameCommandArgvSchema.js";
import { loadGeneratorCommandInput } from "#src/schema/args/loadGeneratorCommandInput.js";

export const frameCommandRun = async ({ args }: CommandContext<typeof frameCommandArgs>) => {
  const input = await loadGeneratorCommandInput(args);
  await frameCommandHandler(frameCommandArgvSchema.parse(input));
};
