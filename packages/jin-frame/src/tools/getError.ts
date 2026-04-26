import type { JinCreateError } from '#exceptions/JinCreateError';
import type { JinFrame } from '#frames/JinFrame';
import type { JinRespError } from '#exceptions/JinRespError';
import type { JinValidationError } from '#exceptions/JinValidationError';

export function getError<TPASS, TFAIL, TFRAME extends JinFrame<TPASS, TFAIL>, TValidationError = unknown>(
  err:
    | JinCreateError<TFRAME, TPASS, TFAIL>
    | JinRespError<TPASS, TFAIL>
    | JinValidationError<TPASS, TFAIL, TValidationError>,
  handler?: (
    err:
      | JinCreateError<TFRAME, TPASS, TFAIL>
      | JinRespError<TPASS, TFAIL>
      | JinValidationError<TPASS, TFAIL, TValidationError>,
  ) => Error,
): Error {
  if (handler != null) {
    return handler(err);
  }

  return err;
}
