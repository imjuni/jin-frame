export type ValidationResult<TError = unknown> = { valid: true } | { valid: false; error: TError[] };
