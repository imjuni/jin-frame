export const CE_COMMAND = {
  CREATE: 'create',
  FRAME: 'frame',
} as const;

export type CE_COMMAND = (typeof CE_COMMAND)[keyof typeof CE_COMMAND];
