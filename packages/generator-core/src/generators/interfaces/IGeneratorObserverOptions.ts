export type GeneratorStage =
  | "load-spec"
  | "resolve-references"
  | "load-templates"
  | "generate-types"
  | "generate-frames";

export type GeneratorEvent =
  | { type: "stage"; stage: GeneratorStage; state: "started" | "completed" }
  | { type: "progress"; stage: "generate-frames"; completed: number; total: number }
  | {
      type: "diagnostic";
      severity: "info" | "warning";
      code: "UNSUPPORTED_SECURITY_SCHEME";
      message: string;
      schemeName: string;
    };

export interface IGeneratorObserverOptions {
  /** Receives synchronous notifications. Exceptions propagate to the caller. */
  onEvent?: (event: GeneratorEvent) => void;
}
