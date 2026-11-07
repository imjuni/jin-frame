import { defineCommand } from "citty";
import { CE_COMMAND } from "#interfaces/CE_COMMAND.js";
import { ejectTemplates } from "#commands/ejectTemplates.js";

export const templateEjectCommand = defineCommand({
  meta: {
    name: CE_COMMAND.TEMPLATE_EJECT,
    description: "Export default Eta templates into the templates directory",
  },
  async run() {
    await ejectTemplates();
  },
});
