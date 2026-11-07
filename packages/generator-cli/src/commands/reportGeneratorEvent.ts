import type { GeneratorEvent } from "@jin-frame/generator-core";
import consola from "consola";

export function reportGeneratorEvent(event: GeneratorEvent): void {
  if (event.type === "diagnostic") {
    if (event.severity === "warning") consola.warn(`[${event.code}] ${event.message}`);
    else consola.info(`[${event.code}] ${event.message}`);
  } else if (event.type === "stage") {
    consola.info(`${event.stage}: ${event.state}`);
  } else {
    consola.debug(`${event.stage}: ${event.completed}/${event.total}`);
  }
}
