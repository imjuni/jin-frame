import util from "node:util";
import { renderTemplate } from "#renderers/renderTemplate.js";

export function renderHostFunc(hosts: string[]): string {
  const template = `
function getHost() {
    const hosts = <%~ it.hosts %>;
    const host = hosts.at(0);
    if (host == null) {
        throw new Error('Cannot found host: undefined');
    }
    return host;
}
`;
  return renderTemplate(template, { hosts: util.inspect(hosts) }).trim();
}
