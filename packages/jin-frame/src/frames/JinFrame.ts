import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#exceptions/JinCreateError';
import { JinRespError } from '#exceptions/JinRespError';
import type { DebugInfo } from '#interfaces/DebugInfo';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { JinFrameFunction } from '#interfaces/options/IJinFrameFunction';
import type { JinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { JinRequestConfig } from '#interfaces/TJinFrameResponse';
import { getDuration } from '#tools/getDuration';
import { getError } from '#tools/getError';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import { getStatusFromAxiosError } from '#tools/responses/getStatusFromAxiosError';
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { runAndUnwrap } from '#tools/runAndUnwrap';
import { JinValidationtError } from '#exceptions/JinValidationtError';
import type { TGetError } from '#interfaces/TGetError';
import type { ValidationResult } from '#interfaces/ValidationResult';
import type { JinFailResp } from '#interfaces/JinFailResp';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import formatISO from 'date-fns/formatISO';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import getUnixTime from 'date-fns/getUnixTime';
import 'reflect-metadata';

/**
 * Definition HTTP Request
 *
 * @typeParam TPASS AxiosResponse type argument case of valid status.
 * eg. `AxiosResponse<TPASS>`
 *
 * @typeParam TFAIL AxiosResponse type argument case of invalid status.
 * eg. `AxiosResponse<TFAIL>`
 */
export class JinFrame<TPass = unknown, Fail = TPass>
  extends AbstractJinFrame<TPass>
  implements JinFrameFunction<TPass, Fail>
{
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
    _reply: AxiosResponse<TPass | Fail>,
    _debugInfo: DebugInfo,
  ): void | Promise<void> {}

  public requestWrap(option?: JinFrameRequestConfig & IJinFrameCreateConfig): AxiosRequestConfig {
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
      const err = new JinCreateError<typeof this, TPass, Fail>({ debug, frame: this, message: source.message });
      err.stack = source.stack;

      throw err;
    }
  }

  /**
   * Generate an AxiosRequestConfig value and use it to return a functions that invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns Functions that invoke HTTP APIs
   */
  public create<TSelf extends this = this>(
    this: this,
    option?: JinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, TPass, Fail> },
  ): () => Promise<
    AxiosResponse<TPass> & {
      $debug: DebugInfo;
      $frame: TSelf;
      $validated?: ValidationResult;
    }
  > {
    const req = this.requestWrap({ ...option, validateStatus: () => true });
    const isValidateStatus = option?.validateStatus ?? isValidateStatusDefault;

    const jinFrameHandle = async (): Promise<
      AxiosResponse<TPass> & {
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
        req: { ...req, validateStatus: isValidateStatus },
      };

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await runAndUnwrap(this.$_preHook.bind(this), req as any);

        const deduped = await this.retry(req, isValidateStatus);
        const { reply } = deduped;

        if (!isValidateStatus(reply.status)) {
          const failReply = reply as unknown as JinFailResp<Fail>;
          const duration = getDuration(this.$_data.startAt, new Date());

          const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };
          const err = new JinRespError<TPass, Fail>({
            resp: failReply,
            debug: debugInfo,
            frame: this,
            message: 'response error',
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await runAndUnwrap(this.$_postHook.bind(this), req as any, failReply as any, debugInfo);

          throw err;
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const debugInfo = { ...debug, duration, isDeduped: deduped.isDeduped };

        await runAndUnwrap(this.$_postHook.bind(this), req, reply, debugInfo);

        const { validator } = this.$_option;
        const validated = await validator?.validate(reply);

        if (validator != null && validated != null && validator.type === 'exception' && !validated.valid) {
          const err = new JinValidationtError<TPass, Fail>({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resp: reply as any,
            debug: debugInfo,
            frame: this,
            message: 'validation error',
            validator,
            validated,
          });

          throw err;
        }

        return {
          ...reply,
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

        if (caught instanceof AxiosError) {
          const duration = getDuration(this.$_data.startAt, new Date());
          const reply = caught.response as JinFailResp<Fail> | undefined;
          const { status, statusText } = getStatusFromAxiosError(caught);

          const jinFrameError = new JinRespError<TPass, Fail>({
            resp:
              reply ??
              ({
                status,
                statusText,
              } as JinFailResp<Fail>),
            debug: { ...debug, duration },
            frame: this,
            message: caught.message,
          });

          throw getError(jinFrameError, option?.getError);
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const jinFrameError = new JinRespError<TPass, Fail>({
          resp: {
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
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
   * Generate an AxiosRequestConfig value and invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns AxiosResponse With PassFailEither
   */
  public async execute<TSelf extends this = this>(
    this: TSelf,
    option?: JinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, TPass, Fail> },
  ): Promise<AxiosResponse<TPass>> {
    const requester = this.create(option);
    return requester();
  }
}
