import type { JinCreateError } from "#exceptions/JinCreateError";
import type { JinRespError } from "#exceptions/JinRespError";
import type { JinValidationError } from "#exceptions/JinValidationError";
import type { JinFrame } from "#frames/JinFrame";

export function getError<Response, TFRAME extends JinFrame<Response>, TValidationError = unknown>(
  err: JinCreateError<TFRAME> | JinRespError<Response> | JinValidationError<Response, TValidationError>,
  handler?: (
    err: JinCreateError<TFRAME> | JinRespError<Response> | JinValidationError<Response, TValidationError>,
  ) => Error,
): Error {
  if (handler != null) {
    return handler(err);
  }

  return err;
}
