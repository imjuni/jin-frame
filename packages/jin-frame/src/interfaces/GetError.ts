import type { JinCreateError } from '#exceptions/JinCreateError';
import type { JinRespError } from '#exceptions/JinRespError';
import type { JinValidationError } from '#exceptions/JinValidationError';
import type { JinFrame } from '#frames/JinFrame';

export type GetError<TFRAME extends JinFrame<TPASS, TFAIL>, TPASS, TFAIL, TValidationError = unknown> = (
  err:
    | JinCreateError<TFRAME, TPASS, TFAIL>
    | JinRespError<TPASS, TFAIL>
    | JinValidationError<TPASS, TFAIL, TValidationError>,
) => Error;
