import type { JinCreateError } from '#frames/JinCreateError';
import type { JinFrame } from '#frames/JinFrame';
import type { JinRequestError } from '#frames/JinRequestError';

export function getError<TPASS, TFAIL, TFRAME extends JinFrame<TPASS, TFAIL>>(
  err: JinCreateError<TFRAME, TPASS, TFAIL> | JinRequestError<TPASS, TFAIL>,
  handler?: (err: JinCreateError<TFRAME, TPASS, TFAIL> | JinRequestError<TPASS, TFAIL>) => Error,
): Error {
  if (handler != null) {
    return handler(err);
  }

  return err;
}
