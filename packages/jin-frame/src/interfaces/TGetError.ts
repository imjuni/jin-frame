import type { JinCreateError } from '#exceptions/JinCreateError';
import type { JinRequestError } from '#exceptions/JinRequestError';
import type { JinValidationtError } from '#exceptions/JinValidationtError';
import type { JinFrame } from '#frames/JinFrame';

export type TGetError<TFRAME extends JinFrame<TPASS, TFAIL>, TPASS, TFAIL, TValidationError = unknown> = (
  err:
    | JinCreateError<TFRAME, TPASS, TFAIL>
    | JinRequestError<TPASS, TFAIL>
    | JinValidationtError<TPASS, TFAIL, TValidationError>,
) => Error;
