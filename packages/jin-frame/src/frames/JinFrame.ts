import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#exceptions/JinCreateError';
import { JinRequestError } from '#exceptions/JinRequestError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '#interfaces/options/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { getDuration } from '#tools/getDuration';
import { getError } from '#tools/getError';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import { getStatusFromAxiosError } from '#tools/responses/getStatusFromAxiosError';
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { runAndUnwrap } from '#tools/runAndUnwrap';
import { JinValidationtError } from '#exceptions/JinValidationtError';
import type { TGetError } from '#interfaces/TGetError';
import type { TValidationResult } from '#interfaces/TValidationResult';
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
export class JinFrame<TPass = unknown, TFail = TPass>
  extends AbstractJinFrame<TPass>
  implements IJinFrameFunction<TPass, TFail>
{
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  // eslint-disable-next-line class-methods-use-this
  protected $_preHook(_req: TJinRequestConfig): void | Promise<void> {}

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  // eslint-disable-next-line class-methods-use-this
  protected $_postHook(
    _req: TJinRequestConfig,
    _reply: AxiosResponse<TPass | TFail>,
    _debugInfo: IDebugInfo,
  ): void | Promise<void> {}

  public requestWrap(option?: IJinFrameRequestConfig & IJinFrameCreateConfig): AxiosRequestConfig {
    try {
      return super.request(option);
    } catch (catched) {
      const source = catched as Error;
      const duration = getDuration(this.$_data.startAt, new Date());
      const debug: Omit<IDebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this.$_data.startAt)}.${this.$_data.startAt.getMilliseconds()}`,
          iso: formatISO(this.$_data.startAt),
        },
        duration,
      };
      const err = new JinCreateError<typeof this, TPass, TFail>({ debug, frame: this, message: source.message });
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
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, TPass, TFail> },
  ): () => Promise<
    AxiosResponse<TPass> & {
      $debug: IDebugInfo;
      $frame: TSelf;
      $validated?: TValidationResult;
    }
  > {
    const req = this.requestWrap({ ...option, validateStatus: () => true });
    const isValidateStatus = option?.validateStatus ?? isValidateStatusDefault;

    const jinFrameHandle = async (): Promise<
      AxiosResponse<TPass> & {
        $debug: IDebugInfo;
        $frame: TSelf;
        $validated?: TValidationResult;
      }
    > => {
      const startAt = new Date();
      const debug: Omit<IDebugInfo, 'duration'> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        req: { ...req, validateStatus: isValidateStatus },
      };

      try {
        await runAndUnwrap(this.$_preHook.bind(this), req);

        const reply = await this.retry(req, isValidateStatus);

        if (!isValidateStatus(reply.status)) {
          const failReply = reply as unknown as AxiosResponse<TFail>;
          const duration = getDuration(this.$_data.startAt, new Date());

          const debugInfo = { ...debug, duration };
          const err = new JinRequestError<TPass, TFail>({
            resp: failReply,
            debug: debugInfo,
            frame: this,
            message: 'response error',
          });

          await runAndUnwrap(this.$_postHook.bind(this), req, failReply, debugInfo);

          throw err;
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const debugInfo = { ...debug, duration };

        await runAndUnwrap(this.$_postHook.bind(this), req, reply, debugInfo);

        const { validator } = this.$_option;
        const validated = await validator?.validate(reply);

        if (validator != null && validated != null && validator.type === 'exception' && !validated.valid) {
          const err = new JinValidationtError<TPass, TFail>({
            resp: reply,
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
        if (caught instanceof JinRequestError) {
          throw getError(caught, option?.getError);
        }

        if (caught instanceof JinValidationtError) {
          throw getError(caught, option?.getError);
        }

        if (caught instanceof AxiosError) {
          const duration = getDuration(this.$_data.startAt, new Date());
          const reply = caught.response as AxiosResponse<TFail> | undefined;
          const { status, statusText } = getStatusFromAxiosError(caught);

          const jinFrameError = new JinRequestError<TPass, TFail>({
            resp:
              reply ??
              ({
                status,
                statusText,
              } as AxiosResponse<TFail>),
            debug: { ...debug, duration },
            frame: this,
            message: caught.message,
          });

          throw getError(jinFrameError, option?.getError);
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const jinFrameError = new JinRequestError<TPass, TFail>({
          resp: {
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
          } as AxiosResponse<TFail>,
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
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig & { getError?: TGetError<TSelf, TPass, TFail> },
  ): Promise<AxiosResponse<TPass>> {
    const requester = this.create(option);
    return requester();
  }
}
