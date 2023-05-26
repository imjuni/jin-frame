export const CE_HOOK_APPLY = {
  ASYNC_HOOK_APPLIED: 1,
  SYNC_HOOK_APPLIED: 2,
  HOOK_UNDEFINED: 0,
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare, @typescript-eslint/naming-convention
export type CE_HOOK_APPLY = (typeof CE_HOOK_APPLY)[keyof typeof CE_HOOK_APPLY];
