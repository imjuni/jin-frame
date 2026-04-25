import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#exceptions/JinCreateError';
import { JinRespError } from '#exceptions/JinRespError';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { JinFrameFunction } from '#interfaces/options/IJinFrameFunction';
import type { JinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import { getDuration } from '#tools/getDuration';
import { getError } from '#tools/getError';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import { runAndUnwrap } from '#tools/runAndUnwrap';
import { JinValidationtError } from '#exceptions/JinValidationtError';
import type { TGetError } from '#interfaces/TGetError';
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { JinFailResp } from '#interfaces/JinFailResp';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';
import type { JinResp } from '#interfaces/JinResp';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import formatISO from 'date-fns/formatISO';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import getUnixTime from 'date-fns/getUnixTime';
import 'reflect-metadata';
import type { JinPassResp } from '#interfaces/JinPassResp';
import { getStatusFromError } from '#tools/responses/getStatusFromError';
import { getHeaderObject } from '#tools/getHeaderObject';
import { safeParse } from '#tools/json/safeParse';

/**
 * Definition HTTP Request
 *
 * @typeParam Pass response data type for valid status — returned as JinPassResp<Pass>
 * @typeParam Fail response data type for invalid status — returned as JinFailResp<Fail>
 */
export class JinFrame<Pass = unknown, Fail = Pass> extends AbstractJinFrame implements JinFrameFunction<Pass, Fail> {
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  // eslint-disable-next-line class-methods-use-this
  protected $_preHook(_req: JinRequestConfig): void | Promise<void> {}

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  // eslint-disable-next-line class-methods-use-this
  protected $_postHook(
    _req: JinRequestConfig,
    _reply: JinResp<Pass, Fail>,
    _debugInfo: DebugInfo,
  ): void | Promise<void> {}

  public requestWrap(option?: JinFrameRequestConfig & IJinFrameCreateConfig): JinRequestConfig {
    try {
      return super.request(option);
    } catch (catched) {
      const source = catched as Error;
      const duration = getDuration(this.$_data.startAt, new Date());
      const debug: Omit<DebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this.$_data.startAt)}.${this.$_data.startAt.getMilliseconds()}`,
          iso: formatISO(this.$_data.startAt),
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
  public create<TSelf extends this = this>(
    this: this,
    option?: JinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, Pass, Fail> },
  ): () => Promise<
    JinResp<Pass, Fail> & {
      $debug: DebugInfo;
      $frame: TSelf;
      $validated?: ValidationResult;
    }
  > {
    const req = this.requestWrap({ ...option, validateStatus: () => true });
    const isValidateStatus = option?.validateStatus ?? isValidateStatusDefault;

    const jinFrameHandle = async (): Promise<
      JinPassResp<Pass> & {
        $debug: DebugInfo;
        $frame: TSelf;
        $validated?: ValidationResult;
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
        await runAndUnwrap(this.$_preHook.bind(this), req);

        const deduped = await this.retry(req, isValidateStatus);
        const { resp } = deduped;

        const isCloneRaw = option?.cloneRaw ?? this.$_option.cloneRaw;
        const raw = isCloneRaw ? resp.clone() : resp;
        const headers = getHeaderObject(resp.headers);
        const text = await resp.text();
        const deserialize = option?.deserialize ?? this.$_option.deserialize;
        const data = text.length > 0 ? (deserialize != null ? deserialize(text) : safeParse(text)) : undefined;

        if (!isValidateStatus(resp.status)) {
          const failResp: JinFailResp<Fail> = {
            ok: false,
            status: resp.status,
            statusText: resp.statusText,
            headers,
            raw,
            data: data as Fail,
          };
          const duration = getDuration(this.$_data.startAt, new Date());

          const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };
          const err = new JinRespError<Pass, Fail>({
            resp: failResp,
            debug: debugInfo,
            frame: this,
            message: 'response error',
          });

          await runAndUnwrap(this.$_postHook.bind(this), req, failResp, debugInfo);

          throw err;
        }

        const passResp: JinPassResp<Pass> = {
          ok: true,
          status: resp.status,
          statusText: resp.statusText,
          headers,
          raw,
          data: data as Pass,
        };

        const duration = getDuration(this.$_data.startAt, new Date());
        const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };

        await runAndUnwrap(this.$_postHook.bind(this), req, passResp, debugInfo);

        const { validator } = this.$_option;
        const validated = await validator?.validate(passResp);

        if (validator != null && validated != null && validator.type === 'exception' && !validated.valid) {
          const err = new JinValidationtError<Pass, Fail>({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resp: resp as any,
            debug: debugInfo,
            frame: this,
            message: 'validation error',
            validator,
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

        if (caught instanceof JinValidationtError) {
          throw getError(caught, option?.getError);
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const { status, statusText } = getStatusFromError(caught);

        const jinFrameError = new JinRespError<Pass, Fail>({
          resp: {
            ok: false,
            status,
            statusText,
          } as JinFailResp<Fail>,
          debug: { ...debug, duration },
          frame: this,
          message: 'unknown error raised',
        });

        throw getError(jinFrameError, option?.getError);
      }
    };

    return jinFrameHandle;
  }

  /**
   * Generate a request config and invoke HTTP APIs
   *
   * @param option request configuration options
   * @returns JinResp with pass or fail discriminated union
   */
  public async execute<TSelf extends this = this>(
    this: TSelf,
    option?: JinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, Pass, Fail> },
  ): Promise<JinResp<Pass, Fail>> {
    const requester = this.create(option);
    return requester();
  }
}
