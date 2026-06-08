import type { ArgsDef } from "citty";

export const generatorOptionArgs = {
  spec: {
    type: "positional",
    required: true,
    description: "Path to the OpenAPI specification file (JSON or YAML)",
  },
  output: {
    type: "string",
    alias: "o",
    required: true,
    description: "Output directory path where generated files will be saved",
  },
  "log-level": {
    type: "enum",
    options: ["info", "debug", "error"],
    description: "Log level for controlling verbosity of output messages",
  },
  config: {
    type: "string",
    description: "Path to jin-frame config file. Defaults to jin-frame.config.* when omitted",
  },
  host: {
    type: "string",
    alias: "h",
    description: 'API server hostname or base URL, or endpoint override like "/pets/{petId}=https://api.example.com"',
  },
  "base-frame": {
    type: "string",
    description: "Server host frame class name to extend from",
  },
  timeout: {
    type: "string",
    description: 'HTTP request timeout in milliseconds, or endpoint override like "/pets/{petId}=3000"',
  },
  retry: {
    type: "string",
    description: 'Endpoint retry override like "/pets/{petId}={\\"max\\":3,\\"interval\\":500}"',
  },
  "code-fence": {
    type: "boolean",
    description: "Whether to wrap generated code with markdown code fences",
  },
  "int64-as-string": {
    type: "boolean",
    description: "Map OpenAPI integer schemas with int64/i64 format to TypeScript string",
  },
  "host-strategy": {
    type: "enum",
    options: ["string", "function", "env-function"],
    description: "Strategy for generating host configuration",
  },
  "host-env-var": {
    type: "string",
    description: "Environment variable name for host selection (when using env-function)",
  },
  "host-function-name": {
    type: "string",
    description: "Custom function name for host resolution (when using function)",
  },
  "server-mapping": {
    type: "string",
    description: "Environment to server URL mapping as JSON string",
  },
} satisfies ArgsDef;
