import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#frames/JinCreateError';
import { JinRequestError } from '#frames/JinRequestError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '#interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { TJinFrameResponse, TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { CE_HOOK_APPLY } from '#tools/CE_HOOK_APPLY';
import { getDuration } from '#tools/getDuration';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import type { JinBuiltInOption } from '#tools/type-utilities/JinBuiltInOption';
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import formatISO from 'date-fns/formatISO';
import getUnixTime from 'date-fns/getUnixTime';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import 'reflect-metadata';
import type { SetRequired } from 'type-fest';

/**
 * HTTP Request Hook
 */
export interface JinFrame<TPASS = unknown, TFAIL = TPASS> {
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  $$preHook?(req: TJinRequestConfig): void | Promise<void>;

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  $$postHook?(
    req: TJinRequestConfig,
    result: TJinFrameResponse<TPASS, TFAIL>,
    debugInfo: IDebugInfo,
  ): void | Promise<void>;
}

/**
 * Definition HTTP Request
 *
 * @typeParam TPASS AxiosResponse type argument case of valid status.
 * eg. `AxiosResponse<TPASS>`
 *
 * @typeParam TFAIL AxiosResponse type argument case of invalid status.
 * eg. `AxiosResponse<TFAIL>`
 */
export class JinFrame<TPASS = unknown, TFAIL = TPASS>
  extends AbstractJinFrame
  implements IJinFrameFunction<TPASS, TFAIL>
{
  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor(args: SetRequired<JinBuiltInOption, '$$method'>) {
    super({ ...args });
  }

  public override request(
    option?: (IJinFrameRequestConfig & IJinFrameCreateConfig) | undefined,
  ): AxiosRequestConfig<unknown> {
    try {
      return super.request(option);
    } catch (catched) {
      const source = catched as Error;
      const duration = getDuration(this.$$startAt, new Date());
      const debug: Omit<IDebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this.$$startAt)}.${this.$$startAt.getMilliseconds()}`,
          iso: formatISO(this.$$startAt),
        },
        duration,
      };
      const err = new JinCreateError({ debug, frame: this, message: source.message });
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
  public create(
    option?: IJinFrameRequestConfig &
      IJinFrameCreateConfig & {
        getError?: <TFRAME extends JinFrame<TPASS, TFAIL>>(
          err: JinCreateError<TFRAME, TPASS, TFAIL> | JinRequestError<TPASS, TFAIL>,
        ) => Error;
      },
  ): () => Promise<AxiosResponse<TPASS>> {
    const req = this.request({ ...option, validateStatus: () => true });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const frame: typeof this = this;

    const isValidateStatus = option?.validateStatus == null ? isValidateStatusDefault : option.validateStatus;

    const jinFrameHandle = async () => {
      const startAt = new Date();
      const debug: Omit<IDebugInfo, 'duration'> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        req: { ...req, validateStatus: isValidateStatus },
      };

      try {
        const applyPreHookHandler = async (): Promise<number> => {
          if (frame.$$preHook != null && frame.$$preHook.constructor.name === 'AsyncFunction') {
            await frame.$$preHook(req);
            return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
          }

          if (frame.$$preHook != null) {
            (frame.$$preHook as (this: void, req: AxiosRequestConfig) => void)(req);
            return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
          }

          return CE_HOOK_APPLY.HOOK_UNDEFINED;
        };

        await applyPreHookHandler();

        const reply = await this.retry<TPASS>(req, isValidateStatus);

        if (isValidateStatus(reply.status) === false) {
          const failReply = reply as unknown as AxiosResponse<TFAIL>;
          const duration = getDuration(this.$$startAt, new Date());

          const debugInfo = { ...debug, duration };
          const err = new JinRequestError<TPASS, TFAIL>({
            resp: failReply,
            debug: debugInfo,
            frame,
            message: 'response error',
          });

          const applyPostHookHandler = async (): Promise<number> => {
            if (frame.$$postHook != null && frame.$$postHook.constructor.name === 'AsyncFunction') {
              await frame.$$postHook(req, failReply, debugInfo);
              return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
            }

            if (frame.$$postHook != null) {
              (
                frame.$$postHook as (
                  req: AxiosRequestConfig,
                  result: AxiosResponse<TFAIL>,
                  debugInfo: IDebugInfo,
                ) => void
              )(req, failReply, debugInfo);
              return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
            }

            return CE_HOOK_APPLY.HOOK_UNDEFINED;
          };

          await applyPostHookHandler();
          throw err;
        }

        const duration = getDuration(frame.$$startAt, new Date());
        const debugInfo = { ...debug, duration };

        const applyPostHookHandler = async () => {
          if (frame.$$postHook != null && frame.$$postHook.constructor.name === 'AsyncFunction') {
            await frame.$$postHook(req, reply, debugInfo);
            return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
          }

          if (frame.$$postHook != null) {
            (
              frame.$$postHook as (req: AxiosRequestConfig, result: AxiosResponse<TPASS>, debugInfo: IDebugInfo) => void
            )(req, reply, debugInfo);
            return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
          }

          return CE_HOOK_APPLY.HOOK_UNDEFINED;
        };

        await applyPostHookHandler();

        return {
          ...reply,
          $debug: debugInfo,
          $frame: frame,
        };
      } catch (caught) {
        if (caught instanceof JinRequestError) {
          throw option?.getError != null ? option.getError(caught) : caught;
        }

        if (caught instanceof AxiosError) {
          const duration = getDuration(this.$$startAt, new Date());
          const reply = caught.response as AxiosResponse<TFAIL> | undefined;

          const jinFrameError = new JinRequestError<TPASS, TFAIL>({
            resp:
              reply ??
              ({
                status: httpStatusCodes.INTERNAL_SERVER_ERROR,
                statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
              } as AxiosResponse<TFAIL>),
            debug: { ...debug, duration },
            frame,
            message: caught.message,
          });

          throw option?.getError != null ? option.getError(jinFrameError) : jinFrameError;
        }

        const duration = getDuration(this.$$startAt, new Date());
        const jinFrameError = new JinRequestError<TPASS, TFAIL>({
          resp: {
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
          } as AxiosResponse<TFAIL>,
          debug: { ...debug, duration },
          frame,
          message: 'unknown error raised',
        });

        throw option?.getError != null ? option.getError(jinFrameError) : jinFrameError;
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
  public execute(
    option?: IJinFrameRequestConfig &
      IJinFrameCreateConfig & {
        getError?: <TFRAME extends JinFrame<TPASS, TFAIL>>(
          err: JinCreateError<TFRAME, TPASS, TFAIL> | JinRequestError<TPASS, TFAIL>,
        ) => Error;
      },
  ): Promise<AxiosResponse<TPASS>> {
    const requester = this.create(option);
    return requester();
  }
}
