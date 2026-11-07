import type { JinResponse } from "#interfaces/JinResp";
import type { JinCreateError } from "#exceptions/JinCreateError";
import type { JinRespError } from "#exceptions/JinRespError";
import type { JinValidationError } from "#exceptions/JinValidationError";
import type { JinFrame } from "#frames/JinFrame";

export type GetError<TFRAME extends JinFrame<Response>, Response extends JinResponse, TValidationError = unknown> = (
  err: JinCreateError<TFRAME> | JinRespError<Response> | JinValidationError<Response, TValidationError>,
) => Error;
