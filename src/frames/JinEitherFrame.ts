import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#frames/JinCreateError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IFailCreateJinEitherFrame, IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '#interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import { CE_HOOK_APPLY } from '#tools/CE_HOOK_APPLY';
import { getDuration } from '#tools/getDuration';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import type { ConstructorType } from '#tools/type-utilities/ConstructorType';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import formatISO from 'date-fns/formatISO';
// eslint-disable-next-line import-x/no-extraneous-dependencies
import getUnixTime from 'date-fns/getUnixTime';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { fail, pass, type PassFailEither } from 'my-only-either';
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
export class JinEitherFrame<TPASS = unknown, TFAIL = TPASS>
  extends AbstractJinFrame<TPASS>
  implements IJinFrameFunction<TPASS, TFAIL>
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
    _reply: IFailReplyJinEitherFrame<TFAIL> | TPassJinEitherFrame<TPASS>,
  ): void | Promise<void> {}

  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor(args: ConstructorType<JinEitherFrame<TPASS, TFAIL>>, option?: Partial<IFrameOption>) {
    super(option);
    this.setFields(args as typeof this);
  }

  public requestWrap(
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ): PassFailEither<JinCreateError<JinEitherFrame<TPASS, TFAIL>, TPASS, TFAIL>, AxiosRequestConfig<unknown>> {
    try {
      const req = super.request(option);
      return pass(req);
    } catch (caught) {
      const source = caught as Error;
      const duration = getDuration(this.$_data.startAt, new Date());
      const debug: Omit<IDebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this.$_data.startAt)}.${this.$_data.startAt.getMilliseconds()}`,
          iso: formatISO(this.$_data.startAt),
        },
        duration,
      };
      const err = new JinCreateError<JinEitherFrame<TPASS, TFAIL>, TPASS, TFAIL>({
        debug,
        frame: this,
        message: source.message,
      });
      err.stack = source.stack;

      return fail(err);
    }
  }

  /**
   * Generate an AxiosRequestConfig value and use it to return a functions that invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns Functions that invoke HTTP APIs
   */
  public create(
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ): () => Promise<
    PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailCreateJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
  > {
    const reqE = this.requestWrap({ ...option, validateStatus: () => true });

    if (reqE.type === 'fail') {
      return async () =>
        fail({
          $progress: 'error',
          $debug: reqE.fail.debug,
          $err: reqE.fail,
          $frame: this,
          status: httpStatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
        } satisfies IFailCreateJinEitherFrame<TFAIL>);
    }

    const req = reqE.pass;
    const isValidateStatus = option?.validateStatus ?? isValidateStatusDefault;

    const jinEitherFrameHandle = async () => {
      const startAt = new Date();
      const debugInfo: Omit<IDebugInfo, 'duration'> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        req: { ...req, validateStatus: isValidateStatus },
      };

      try {
        await this.executePreHook(req);

        const reply = await this.retry(req, isValidateStatus);
        const endAt = new Date();

        if (!isValidateStatus(reply.status)) {
          const failReply = reply as unknown as AxiosResponse<TFAIL>;
          const duration = getDuration(startAt, endAt);
          const err = new Error('Error caused from API response');

          const failInfo: IFailReplyJinEitherFrame<TFAIL> = {
            ...failReply,
            $progress: 'fail',
            $err: err,
            $debug: { ...debugInfo, duration },
            $frame: this,
          };

          this.executePostHook(req, failInfo);
          return fail(failInfo);
        }

        const duration = getDuration(startAt, endAt);

        const passInfo: TPassJinEitherFrame<TPASS> = {
          ...reply,
          $progress: 'pass',
          $debug: { ...debugInfo, duration },
          $frame: this,
        };

        this.executePostHook(req, passInfo);
        return pass(passInfo);
      } catch (catched) {
        const err = catched instanceof AxiosError ? catched : new AxiosError('unkonwn error raised from jinframe');
        const endAt = new Date();
        const duration = getDuration(startAt, endAt);

        const failInfo: IFailCreateJinEitherFrame<TFAIL> = {
          $progress: 'error',
          $err: err,
          $debug: { ...debugInfo, duration },
          $frame: this,
          status: err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
        };

        return fail(failInfo);
      }
    };

    return jinEitherFrameHandle;
  }

  /**
   * Generate an AxiosRequestConfig value and invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns AxiosResponse With PassFailEither
   */
  public async execute(
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ): Promise<
    PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailCreateJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
  > {
    const requester = this.create(option);
    return requester();
  }

  public async executePreHook(req: AxiosRequestConfig<unknown>): Promise<CE_HOOK_APPLY> {
    if (this.$_preHook != null && this.$_preHook.constructor.name === 'AsyncFunction') {
      await this.$_preHook(req);
      return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
    }

    if (this.$_preHook != null) {
      this.$_preHook(req);
      return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
    }

    return CE_HOOK_APPLY.HOOK_UNDEFINED;
  }

  public async executePostHook(
    req: AxiosRequestConfig<unknown>,
    reply: IFailReplyJinEitherFrame<TFAIL> | TPassJinEitherFrame<TPASS>,
  ): Promise<CE_HOOK_APPLY> {
    if (this.$_postHook != null && this.$_postHook.constructor.name === 'AsyncFunction') {
      await this.$_postHook(req, reply);
      return CE_HOOK_APPLY.ASYNC_HOOK_APPLIED;
    }

    if (this.$_postHook != null) {
      this.$_postHook(req, reply);
      return CE_HOOK_APPLY.SYNC_HOOK_APPLIED;
    }

    return CE_HOOK_APPLY.HOOK_UNDEFINED;
  }
}
