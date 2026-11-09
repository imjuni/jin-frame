import type { StatusValidator, ValidatedResponse } from "#tools/validateStatus";
import { formatISO } from "date-fns/formatISO";
import { getUnixTime } from "date-fns/getUnixTime";
import { JinCreateError } from "#exceptions/JinCreateError";
import { JinRespError } from "#exceptions/JinRespError";
import { JinValidationError } from "#exceptions/JinValidationError";
import { AbstractJinFrame } from "#frames/AbstractJinFrame";
import type { DebugInfo } from "#interfaces/DebugInfo";
import type { GetError } from "#interfaces/GetError";
import type { JinRequestConfig } from "#interfaces/JinRequestConfig";
import type { JinResponse, JinResp } from "#interfaces/JinResp";
import type { JinFrameCreateConfig } from "#interfaces/options/JinFrameCreateConfig";
import type { JinFrameFunction } from "#interfaces/options/JinFrameFunction";
import type { JinFrameRequestConfig } from "#interfaces/options/JinFrameRequestConfig";
import type { ValidationResult } from "#interfaces/ValidationResult";
import { getDuration } from "#tools/getDuration";
import { getError } from "#tools/getError";
import { runAndUnwrap } from "#tools/runAndUnwrap";
import "reflect-metadata";
import { resolveSecurityKey } from "#frames/resolveSecurityKey";
import { getHeaderObject } from "#tools/getHeaderObject";
import { safeParse } from "#tools/json/safeParse";
import { getStatusFromError } from "#tools/responses/getStatusFromError";

/**
 * Definition HTTP Request
 *
 * @typeParam Response Status/data union covering all documented HTTP responses
 */
export class JinFrame<Response extends JinResponse = JinResponse>
  extends AbstractJinFrame
  implements JinFrameFunction<Response>
{
  /**
   * Runs once before transport attempts; mutations affect the outgoing request.
   * @param _req - The assembled request configuration.
   */
  protected _preHook(_req: JinRequestConfig): void | Promise<void> {}

  /**
   * Observes a processed HTTP response, including rejected statuses.
   * @param _req - The outgoing request configuration.
   * @param _reply - The complete status-discriminated response and validation result.
   * @param _debugInfo - Execution timing and deduplication metadata.
   */
  protected _postHook(_req: JinRequestConfig, _reply: JinResp<Response>, _debugInfo: DebugInfo): void | Promise<void> {}

  public _requestWrap(option?: JinFrameRequestConfig & JinFrameCreateConfig): JinRequestConfig {
    const startAt = new Date();
    try {
      return super._request(option);
    } catch (catched) {
      const source = catched as Error;
      const duration = getDuration(startAt, new Date());
      const debug: Omit<DebugInfo, "req"> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        isDeduped: false,
        duration,
      };
      const err = new JinCreateError<typeof this>({
        debug,
        frame: this,
        message: source.message,
      });
      err.stack = source.stack;

      throw err;
    }
  }

  /**
   * Generate a request config and return a function that invokes HTTP APIs
   *
   * @param option request configuration options
   * @returns Function that invokes HTTP APIs
   */
  public _create<TSelf extends this = this>(
    option?: JinFrameRequestConfig &
      Omit<JinFrameCreateConfig, "validateStatus"> & {
        validateStatus?: undefined;
        getError?: GetError<TSelf, Response>;
      },
  ): () => Promise<JinResp<ValidatedResponse<Response, undefined>> & { $debug: DebugInfo; $frame: TSelf }>;
  public _create<Validator extends StatusValidator | undefined, TSelf extends this = this>(
    option?: JinFrameRequestConfig &
      Omit<JinFrameCreateConfig, "validateStatus"> & {
        validateStatus?: Validator;
        getError?: GetError<TSelf, Response>;
      },
  ): () => Promise<JinResp<ValidatedResponse<Response, Validator>> & { $debug: DebugInfo; $frame: TSelf }>;
  public _create<TSelf extends this = this>(
    this: this,
    option?: JinFrameRequestConfig & JinFrameCreateConfig & { getError?: GetError<TSelf, Response> },
  ): () => Promise<
    JinResp<Response> & {
      $debug: DebugInfo;
      $frame: TSelf;
    }
  > {
    const req = this._requestWrap(option);
    const isValidateStatus = option?.validateStatus ?? this._validateStatus.bind(this);

    const jinFrameHandle = async (): Promise<
      JinResp<Response> & {
        $debug: DebugInfo;
        $frame: TSelf;
      }
    > => {
      const startAt = this._beginExecution();
      const debug: Omit<DebugInfo, "duration"> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        isDeduped: false,
        req,
      };

      let receivedResponse: JinResp<Response> | undefined;
      try {
        await runAndUnwrap(this._preHook.bind(this), req);

        const deduped = await this._retry(req, isValidateStatus, startAt);
        const { resp } = deduped;

        const isCloneRaw = option?.cloneRaw ?? this._option.cloneRaw;
        const raw = isCloneRaw ? resp.clone() : resp;
        const headers = getHeaderObject(resp.headers);
        const text = await resp.text();
        const deserialize = option?.deserialize ?? this._option.deserialize;
        const parsed = deserialize != null ? deserialize(text) : safeParse(text);
        const data = text.length > 0 ? parsed : undefined;

        if (!isValidateStatus(resp.ok, resp.status)) {
          const failValidator = this._option.validator;

          const rejectedResponse = {
            ok: false,
            status: resp.status,
            statusText: resp.statusText,
            headers,
            raw,
            data,
            valid: false,
            $validated: { valid: false, error: [] },
          } as unknown as JinResp<Response>;

          receivedResponse = rejectedResponse;
          const failValidated: ValidationResult =
            failValidator != null ? await failValidator.validate(rejectedResponse as never) : { valid: true };

          receivedResponse = undefined;
          rejectedResponse.valid = failValidated?.valid;
          rejectedResponse.$validated = failValidated;

          const duration = getDuration(startAt, new Date());

          const debugInfo = {
            ...debug,
            duration,
            isDeduped: deduped.isDeduped,
          };
          const err = new JinRespError<Response>({
            resp: rejectedResponse,
            debug: debugInfo,
            frame: this,
            message: `response error: ${resp.status} ${resp.statusText}`,
          });

          await runAndUnwrap(this._postHook.bind(this), req, rejectedResponse, debugInfo);

          throw err;
        }

        const acceptedResponse = {
          ok: true,
          status: resp.status,
          statusText: resp.statusText,
          headers,
          raw,
          data,
          valid: false,
          $validated: { valid: false, error: [] },
        } as unknown as JinResp<Response>;

        receivedResponse = acceptedResponse;
        const passValidator = this._option.validator;
        const validated: ValidationResult =
          passValidator != null ? await passValidator.validate(acceptedResponse as never) : { valid: true as const };

        receivedResponse = undefined;
        acceptedResponse.valid = validated.valid;
        acceptedResponse.$validated = validated;

        const duration = getDuration(startAt, new Date());
        const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };

        await runAndUnwrap(this._postHook.bind(this), req, acceptedResponse, debugInfo);

        if (passValidator != null && !validated.valid && passValidator.type === "exception") {
          const err = new JinValidationError<Response>({
            resp: acceptedResponse,
            debug: debugInfo,
            frame: this,
            message: "validation error",
            validator: passValidator,
            validated,
          });

          throw err;
        }

        return {
          ...acceptedResponse,
          $debug: debugInfo,
          $frame: this as TSelf,
          $validated: validated,
        };
      } catch (caught) {
        if (caught instanceof JinRespError) {
          throw getError(caught, option?.getError);
        }

        if (caught instanceof JinValidationError) {
          throw getError(caught, option?.getError);
        }

        const duration = getDuration(startAt, new Date());
        const { status, statusText } = getStatusFromError(caught);

        const jinFrameError = new JinRespError<Response>({
          ...(receivedResponse ? { resp: receivedResponse } : { status, statusText }),
          debug: { ...debug, duration },
          frame: this,
          message: caught instanceof Error ? caught.message : "unknown error raised",
          cause: caught,
        });

        throw getError(jinFrameError, option?.getError);
      } finally {
        this._finishExecution(startAt);
      }
    };

    return jinFrameHandle;
  }

  /**
   * Generate a request config and invoke HTTP APIs.
   *
   * Function-based authorization values are awaited before building the request.
   * Provider constructor suppliers remain synchronous and are evaluated during request assembly.
   *
   * @param option request configuration options
   * @returns The status-discriminated response accepted by the call-level status policy.
   */
  public _execute<TSelf extends this = this>(
    option?: JinFrameRequestConfig &
      Omit<JinFrameCreateConfig, "validateStatus"> & {
        validateStatus?: undefined;
        getError?: GetError<TSelf, Response>;
      },
  ): Promise<JinResp<ValidatedResponse<Response, undefined>>>;
  public _execute<Validator extends StatusValidator | undefined, TSelf extends this = this>(
    option?: JinFrameRequestConfig &
      Omit<JinFrameCreateConfig, "validateStatus"> & {
        validateStatus?: Validator;
        getError?: GetError<TSelf, Response>;
      },
  ): Promise<JinResp<ValidatedResponse<Response, Validator>>>;
  public async _execute<TSelf extends this = this>(
    this: TSelf,
    option?: JinFrameRequestConfig & JinFrameCreateConfig & { getError?: GetError<TSelf, Response> },
  ): Promise<JinResp<Response>> {
    const resolvedOption = await resolveSecurityKey(this._option, option);
    const requester = this._create(resolvedOption);
    return requester();
  }
}
