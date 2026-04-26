import type { JinCreateError } from '#exceptions/JinCreateError';
import type { JinRespError } from '#exceptions/JinRespError';
import type { JinValidationtError } from '#exceptions/JinValidationtError';
import type { JinFrame } from '#frames/JinFrame';

export type GetError<TFRAME extends JinFrame<TPASS, TFAIL>, TPASS, TFAIL, TValidationError = unknown> = (
  err:
    | JinCreateError<TFRAME, TPASS, TFAIL>
    | JinRespError<TPASS, TFAIL>
    | JinValidationtError<TPASS, TFAIL, TValidationError>,
) => Error;
