/**
 * Simple RFC 6570 URI Template expansion for basic variable substitution
 * Supports: {var} format
 *
 * @param template URI template string with {var} placeholders
 * @param variables Object with variable values
 * @returns Expanded URI string
 */
export function expandUriTemplate(template: string, variables: Record<string, string | number>): string {
  return template.replace(/\{([^}]+)\}/g, (match, varName) => {
    const value = variables[varName];

    if (value == null) {
      return match; // Keep original if variable not found
    }

    // For path parameters, we don't need to URL encode
    // as they are part of the URL structure
    return String(value);
  });
}
