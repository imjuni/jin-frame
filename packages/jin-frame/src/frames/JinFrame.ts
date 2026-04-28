import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#exceptions/JinCreateError';
import { JinRespError } from '#exceptions/JinRespError';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { JinFrameCreateConfig } from '#interfaces/options/JinFrameCreateConfig';
import type { JinFrameFunction } from '#interfaces/options/JinFrameFunction';
import type { JinFrameRequestConfig } from '#interfaces/options/JinFrameRequestConfig';
import { getDuration } from '#tools/getDuration';
import { getError } from '#tools/getError';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import { runAndUnwrap } from '#tools/runAndUnwrap';
import { JinValidationError } from '#exceptions/JinValidationError';
import type { GetError } from '#interfaces/GetError';
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';
import type { JinResp } from '#interfaces/JinResp';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { formatISO } from 'date-fns/formatISO';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { getUnixTime } from 'date-fns/getUnixTime';
import 'reflect-metadata';
import type { JinPassResp } from '#interfaces/JinPassResp';
import { getStatusFromError } from '#tools/responses/getStatusFromError';
import { getHeaderObject } from '#tools/getHeaderObject';
import { safeParse } from '#tools/json/safeParse';
import type { FrameOption } from '#interfaces/options/FrameOption';

async function resolveSecurityKey<T extends JinFrameRequestConfig & JinFrameCreateConfig>(
  frameOption: FrameOption,
  option: T | undefined,
): Promise<T> {
  if (option?.dynamicAuth != null) return option;
  const frameAuth = frameOption.authorization;
  if (typeof frameAuth !== 'function') return (option ?? {}) as T;
  const resolved = await frameAuth();
  return { ...(option ?? {}), dynamicAuth: resolved } as T;
}

/**
 * Definition HTTP Request
 *
 * @typeParam Pass response data type for valid status — returned as `JinPassResp<Pass>`
 * @typeParam Fail response data type for invalid status — returned as `JinFailResp<Fail>`
 */
export class JinFrame<Pass = unknown, Fail = Pass> extends AbstractJinFrame implements JinFrameFunction<Pass, Fail> {
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  // eslint-disable-next-line class-methods-use-this
  protected _preHook(_req: JinRequestConfig): void | Promise<void> {}

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  // eslint-disable-next-line class-methods-use-this
  protected _postHook(
    _req: JinRequestConfig,
    _reply: JinResp<Pass, Fail>,
    _debugInfo: DebugInfo,
  ): void | Promise<void> {}

  public _requestWrap(option?: JinFrameRequestConfig & JinFrameCreateConfig): JinRequestConfig {
    try {
      return super._request(option);
    } catch (catched) {
      const source = catched as Error;
      const duration = getDuration(this._startAt, new Date());
      const debug: Omit<DebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this._startAt)}.${this._startAt.getMilliseconds()}`,
          iso: formatISO(this._startAt),
        },
        isDeduped: false,
        duration,
      };
      const err = new JinCreateError<typeof this, Pass, Fail>({ debug, frame: this, message: source.message });
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
    this: this,
    option?: JinFrameRequestConfig & JinFrameCreateConfig & { getError?: GetError<TSelf, Pass, Fail> },
  ): () => Promise<
    JinResp<Pass, Fail> & {
      $debug: DebugInfo;
      $frame: TSelf;
    }
  > {
    const req = this._requestWrap(option);
    const isValidateStatus = option?.validateStatus ?? this._option.validateStatus ?? isValidateStatusDefault;

    const jinFrameHandle = async (): Promise<
      JinPassResp<Pass> & {
        $debug: DebugInfo;
        $frame: TSelf;
      }
    > => {
      const startAt = new Date();
      const debug: Omit<DebugInfo, 'duration'> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        isDeduped: false,
        req,
      };

      try {
        await runAndUnwrap(this._preHook.bind(this), req);

        const deduped = await this._retry(req, isValidateStatus);
        const { resp } = deduped;

        const isCloneRaw = option?.cloneRaw ?? this._option.cloneRaw;
        const raw = isCloneRaw ? resp.clone() : resp;
        const headers = getHeaderObject(resp.headers);
        const text = await resp.text();
        const deserialize = option?.deserialize ?? this._option.deserialize;
        const parsed = deserialize != null ? deserialize(text) : safeParse(text);
        const data = text.length > 0 ? parsed : undefined;

        if (!isValidateStatus(resp.ok, resp.status)) {
          const failValidator = this._option.validators?.fail;

          const failResp: JinFailResp<Fail> = {
            ok: false,
            status: resp.status,
            statusText: resp.statusText,
            headers,
            raw,
            data: data as Fail,
            valid: false,
            $validated: { valid: false, error: [] },
          };

          const failValidated: ValidationResult =
            failValidator != null ? await failValidator.validate(failResp) : { valid: true };

          failResp.valid = failValidated?.valid;
          failResp.$validated = failValidated;

          const duration = getDuration(this._startAt, new Date());

          const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };
          const err = new JinRespError<Pass, Fail>({
            resp: failResp,
            debug: debugInfo,
            frame: this,
            message: `response error: ${resp.status} ${resp.statusText}`,
          });

          await runAndUnwrap(this._postHook.bind(this), req, failResp, debugInfo);

          throw err;
        }

        const passResp: JinPassResp<Pass> = {
          ok: true,
          status: resp.status,
          statusText: resp.statusText,
          headers,
          raw,
          data: data as Pass,
          valid: false,
          $validated: { valid: false, error: [] },
        };

        const passValidator = this._option.validators?.pass;
        const validated: ValidationResult =
          passValidator != null ? await passValidator.validate(passResp) : { valid: true as const };

        passResp.valid = validated.valid;
        passResp.$validated = validated;

        const duration = getDuration(this._startAt, new Date());
        const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };

        await runAndUnwrap(this._postHook.bind(this), req, passResp, debugInfo);

        if (passValidator != null && !validated.valid && passValidator.type === 'exception') {
          const err = new JinValidationError<Pass, Fail>({
            resp: passResp,
            debug: debugInfo,
            frame: this,
            message: 'validation error',
            validator: passValidator,
            validated,
          });

          throw err;
        }

        return {
          ...passResp,
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

        const duration = getDuration(this._startAt, new Date());
        const { status, statusText } = getStatusFromError(caught);

        const jinFrameError = new JinRespError<Pass, Fail>({
          resp: {
            ok: false,
            status,
            statusText,
          } as JinFailResp<Fail>,
          debug: { ...debug, duration },
          frame: this,
          message: caught instanceof Error ? caught.message : 'unknown error raised',
          cause: caught,
        });

        throw getError(jinFrameError, option?.getError);
      }
    };

    return jinFrameHandle;
  }

  /**
   * Generate a request config and invoke HTTP APIs.
   *
   * Function-based `SecurityKey` values (set via `@Security(provider, () => key)`) are resolved
   * here before building the request. Use this method when the authorization key is dynamic.
   *
   * @param option request configuration options
   * @returns JinResp with pass or fail discriminated union
   */
  public async _execute<TSelf extends this = this>(
    this: TSelf,
    option?: JinFrameRequestConfig & JinFrameCreateConfig & { getError?: GetError<TSelf, Pass, Fail> },
  ): Promise<JinResp<Pass, Fail>> {
    const resolvedOption = await resolveSecurityKey(this._option, option);
    const requester = this._create(resolvedOption);
    return requester();
  }
}
