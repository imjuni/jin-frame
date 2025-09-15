import type { IOpenAPITypeScriptOption } from '#/interfaces/IOpenAPITypeScriptOption';
import type { Argv } from 'yargs';

export function openAPITypescriptOptionBuilder(argv: Argv<IOpenAPITypeScriptOption>): Argv<IOpenAPITypeScriptOption> {
  argv
    .option('oat-additional-properties', {
      type: 'boolean',
      default: false,
      describe:
        'Allow arbitrary properties for all schema objects without additionalProperties: false (--additional-properties)',
    })
    .option('oat-alphabetize', {
      type: 'boolean',
      default: false,
      describe: 'Sort types alphabetically (--alphabetize)',
    })
    .option('oat-array-length', {
      type: 'boolean',
      default: false,
      describe: 'Generate tuples using array minItems / maxItems (--array-length)',
    })
    .option('oat-default-non-nullable', {
      type: 'boolean',
      default: true,
      describe:
        'Treat schema objects with default values as non-nullable (with the exception of parameters) (--default-non-nullable)',
    })
    .option('oat-properties-required-by-default', {
      type: 'boolean',
      default: false,
      describe:
        'Treat schema objects without required as having all properties required (--properties-required-by-default)',
    })
    .option('oat-empty-objects-unknown', {
      type: 'boolean',
      default: false,
      describe:
        'Allow arbitrary properties for schema objects with no specified properties, and no specified additionalProperties (--empty-objects-unknown)',
    })
    .option('oat-enum', {
      type: 'boolean',
      default: false,
      describe: 'Generate true TS enums rather than string unions (--enum)',
    })
    .option('oat-enum-values', {
      type: 'boolean',
      default: false,
      describe: 'Export enum values as arrays (--enum-values)',
    })
    .option('oat-dedupe-enums', {
      type: 'boolean',
      default: false,
      describe: 'Dedupe enum types when --enum=true is set (--dedupe-enums)',
    })
    .option('oat-check', {
      type: 'boolean',
      default: false,
      describe: 'Check that the generated types are up-to-date (--check)',
    })
    .option('oat-exclude-deprecated', {
      type: 'boolean',
      default: false,
      describe: 'Exclude deprecated fields from types (--exclude-deprecated)',
    })
    .option('oat-export-type', {
      type: 'boolean',
      default: false,
      describe: 'Export type instead of interface (--export-type)',
    })
    .option('oat-immutable', {
      type: 'boolean',
      default: false,
      describe: 'Generates immutable types (readonly properties and readonly array) (--immutable)',
    })
    .option('oat-root-types', {
      type: 'boolean',
      default: false,
      describe: 'Exports types from components as root level type aliases (--root-types)',
    })
    .option('oat-root-types-no-schema-prefix', {
      type: 'boolean',
      default: false,
      describe:
        'Do not add "Schema" prefix to types at the root level (should only be used with --root-types) (--root-types-no-schema-prefix)',
    })
    .option('oat-make-paths-enum', {
      type: 'boolean',
      default: false,
      describe: 'Generate ApiPaths enum for all paths (--make-paths-enum)',
    })
    .option('oat-generate-path-params', {
      type: 'boolean',
      default: false,
      describe: 'Generate path parameters for all paths where they are undefined by schema (--generate-path-params)',
    });

  return argv;
}
