import type { ArgsDef } from "citty";

export const openapiTypeScriptOptionArgs = {
  "oat-additional-properties": {
    type: "boolean",
    default: false,
    description:
      "Allow arbitrary properties for all schema objects without additionalProperties: false (--additional-properties)",
  },
  "oat-alphabetize": {
    type: "boolean",
    default: false,
    description: "Sort types alphabetically (--alphabetize)",
  },
  "oat-array-length": {
    type: "boolean",
    default: false,
    description: "Generate tuples using array minItems / maxItems (--array-length)",
  },
  "oat-default-non-nullable": {
    type: "boolean",
    default: true,
    description:
      "Treat schema objects with default values as non-nullable (with the exception of parameters) (--default-non-nullable)",
  },
  "oat-properties-required-by-default": {
    type: "boolean",
    default: false,
    description:
      "Treat schema objects without required as having all properties required (--properties-required-by-default)",
  },
  "oat-empty-objects-unknown": {
    type: "boolean",
    default: false,
    description:
      "Allow arbitrary properties for schema objects with no specified properties, and no specified additionalProperties (--empty-objects-unknown)",
  },
  "oat-enum": {
    type: "boolean",
    default: false,
    description: "Generate true TS enums rather than string unions (--enum)",
  },
  "oat-enum-values": {
    type: "boolean",
    default: false,
    description: "Export enum values as arrays (--enum-values)",
  },
  "oat-dedupe-enums": {
    type: "boolean",
    default: false,
    description: "Dedupe enum types when --enum=true is set (--dedupe-enums)",
  },
  "oat-check": {
    type: "boolean",
    default: false,
    description: "Check that the generated types are up-to-date (--check)",
  },
  "oat-exclude-deprecated": {
    type: "boolean",
    default: false,
    description: "Exclude deprecated fields from types (--exclude-deprecated)",
  },
  "oat-export-type": {
    type: "boolean",
    default: false,
    description: "Export type instead of interface (--export-type)",
  },
  "oat-immutable": {
    type: "boolean",
    default: false,
    description: "Generates immutable types (readonly properties and readonly array) (--immutable)",
  },
  "oat-root-types": {
    type: "boolean",
    default: false,
    description: "Exports types from components as root level type aliases (--root-types)",
  },
  "oat-root-types-no-schema-prefix": {
    type: "boolean",
    default: false,
    description:
      'Do not add "Schema" prefix to types at the root level (should only be used with --root-types) (--root-types-no-schema-prefix)',
  },
  "oat-make-paths-enum": {
    type: "boolean",
    default: false,
    description: "Generate ApiPaths enum for all paths (--make-paths-enum)",
  },
  "oat-generate-path-params": {
    type: "boolean",
    default: false,
    description: "Generate path parameters for all paths where they are undefined by schema (--generate-path-params)",
  },
} satisfies ArgsDef;
