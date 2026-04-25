import { parseTemplate } from 'url-template';

export function expandUriTemplate(template: string, variables: Record<string, string | number>): string {
  return parseTemplate(template).expand(variables);
}
