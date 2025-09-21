export type TValidationResult<TError = unknown> = { valid: true } | { valid: false; error: TError[] };

export type TValidationResultType = 'exception' | 'value';
