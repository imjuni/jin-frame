export interface IGeneratorOption {
  /** Path to the OpenAPI specification file (JSON or YAML) */
  spec: string;

  /** Output directory path where generated files will be saved */
  output: string;

  /** Log level for controlling verbosity of output messages */
  logLevel: 'info' | 'debug' | 'error';

  /** API server hostname or base URL */
  host?: string;

  /** Base frame class name to extend from (use --no-base-frame to disable) */
  baseFrame?: string;

  /** HTTP request timeout in milliseconds */
  timeout: number;

  /** Whether to wrap generated code with markdown code fences */
  codeFence: boolean;
}
