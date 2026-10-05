import { Eta } from "eta";

const eta = new Eta({ autoEscape: false, autoTrim: false });

export function renderTemplate(template: string, data: Record<string, unknown>): string {
  return eta.renderString(template, data);
}
