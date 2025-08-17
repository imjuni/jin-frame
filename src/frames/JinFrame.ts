import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#frames/JinCreateError';
import { JinRequestError } from '#frames/JinRequestError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '#interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import { CE_HOOK_APPLY } from '#tools/CE_HOOK_APPLY';
import { getDuration } from '#tools/getDuration';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import type { ConstructorType } from '#tools/type-utilities/ConstructorType';
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import formatISO from 'date-fns/formatISO';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import getUnixTime from 'date-fns/getUnixTime';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
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
export class JinFrame<TPASS = unknown, TFAIL = TPASS>
  extends AbstractJinFrame<TPASS>
  implements IJinFrameFunction<TPASS, TFAIL>
{
  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor(args: ConstructorType<JinFrame<TPASS, TFAIL>>) {
    super();
    this.setFields(args as typeof this);
  }

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
    _reply: AxiosResponse<TPASS | TFAIL>,
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
      const err = new JinCreateError<typeof this, TPASS, TFAIL>({ debug, frame: this, message: source.message });
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
    const req = this.requestWrap({ ...option, validateStatus: () => true });
    const isValidateStatus = option?.validateStatus ?? isValidateStatusDefault;

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
        await this.executePreHook(req);

        const reply = await this.retry(req, isValidateStatus);

        if (!isValidateStatus(reply.status)) {
          const failReply = reply as unknown as AxiosResponse<TFAIL>;
          const duration = getDuration(this.$_data.startAt, new Date());

          const debugInfo = { ...debug, duration };
          const err = new JinRequestError<TPASS, TFAIL>({
            resp: failReply,
            debug: debugInfo,
            frame: this,
            message: 'response error',
          });

          this.executePostHook(req, failReply, debugInfo);

          throw err;
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const debugInfo = { ...debug, duration };

        await this.executePostHook(req, reply, debugInfo);

        return {
          ...reply,
          $debug: debugInfo,
          $frame: this,
        };
      } catch (caught) {
        if (caught instanceof JinRequestError) {
          throw option?.getError != null ? option.getError(caught) : caught;
        }

        if (caught instanceof AxiosError) {
          const duration = getDuration(this.$_data.startAt, new Date());
          const reply = caught.response as AxiosResponse<TFAIL> | undefined;

          const jinFrameError = new JinRequestError<TPASS, TFAIL>({
            resp:
              reply ??
              ({
                status: httpStatusCodes.INTERNAL_SERVER_ERROR,
                statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
              } as AxiosResponse<TFAIL>),
            debug: { ...debug, duration },
            frame: this,
            message: caught.message,
          });

          throw option?.getError != null ? option.getError(jinFrameError) : jinFrameError;
        }

        const duration = getDuration(this.$_data.startAt, new Date());
        const jinFrameError = new JinRequestError<TPASS, TFAIL>({
          resp: {
            status: httpStatusCodes.INTERNAL_SERVER_ERROR,
            statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
          } as AxiosResponse<TFAIL>,
          debug: { ...debug, duration },
          frame: this,
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
  public async execute(
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

  public async executePreHook(req: AxiosRequestConfig): Promise<CE_HOOK_APPLY> {
    if (this.$_preHook != null && this.$_preHook.constructor.name === 'AsyncFunction') {
      await this.$_preHook(req);
      return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
    }

    this.$_preHook(req);
    return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
  }

  public async executePostHook(
    req: AxiosRequestConfig<unknown>,
    reply: AxiosResponse<TPASS | TFAIL>,
    debugInfo: IDebugInfo,
  ): Promise<CE_HOOK_APPLY> {
    if (this.$_postHook != null && this.$_postHook.constructor.name === 'AsyncFunction') {
      await this.$_postHook(req, reply, debugInfo);
      return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
    }

    this.$_postHook(req, reply, debugInfo);
    return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
  }
}
