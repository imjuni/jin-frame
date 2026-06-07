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
    default: "info",
    options: ["info", "debug", "error"],
    description: "Log level for controlling verbosity of output messages",
  },
  host: {
    type: "string",
    alias: "h",
    description: "API server hostname or base URL",
  },
  "base-frame": {
    type: "string",
    default: "ServerHostFrame",
    description: "Server host frame class name to extend from",
  },
  timeout: {
    type: "string",
    default: "60000",
    description: "HTTP request timeout in milliseconds",
  },
  "code-fence": {
    type: "boolean",
    default: true,
    description: "Whether to wrap generated code with markdown code fences",
  },
  "host-strategy": {
    type: "enum",
    default: "string",
    options: ["string", "function", "env-function"],
    description: "Strategy for generating host configuration",
  },
  "host-env-var": {
    type: "string",
    default: "NODE_ENV",
    description: "Environment variable name for host selection (when using env-function)",
  },
  "host-function-name": {
    type: "string",
    default: "getApiHost",
    description: "Custom function name for host resolution (when using function)",
  },
  "server-mapping": {
    type: "string",
    description: "Environment to server URL mapping as JSON string",
  },
} satisfies ArgsDef;
