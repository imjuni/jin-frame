import { AbstractJinFrame } from '#frames/AbstractJinFrame';
import { JinCreateError } from '#frames/JinCreateError';
import type { IDebugInfo } from '#interfaces/IDebugInfo';
import type { IFailExceptionJinEitherFrame, IFailReplyJinEitherFrame } from '#interfaces/IFailJinEitherFrame';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '#interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { TJinEitherFramePostHookReply } from '#interfaces/THookReply';
import type { TPassJinEitherFrame } from '#interfaces/TPassJinEitherFrame';
import { getDuration } from '#tools/getDuration';
import { isValidateStatusDefault } from '#tools/isValidateStatusDefault';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type Method } from 'axios';
/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import formatISO from 'date-fns/formatISO';
/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import getUnixTime from 'date-fns/getUnixTime';
/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { fail, pass, type PassFailEither } from 'my-only-either';
import 'reflect-metadata';

/**
 * HTTP Request Hook
 */
export interface JinEitherFrame<TPASS = unknown, TFAIL = TPASS> {
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  preHook?(req: AxiosRequestConfig): void | AxiosRequestConfig | Promise<void> | Promise<AxiosRequestConfig>;

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  postHook?(req: AxiosRequestConfig, result: TJinEitherFramePostHookReply<TPASS, TFAIL>): void | Promise<void>;
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
export class JinEitherFrame<TPASS = unknown, TFAIL = TPASS>
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
  constructor(args: {
    host?: string;
    path?: string;
    method: Method;
    contentType?: string;
    customBody?: { [key: string]: any };
  }) {
    super({ ...args });
  }

  public requestWrap(
    option?: (IJinFrameRequestConfig & IJinFrameCreateConfig) | undefined,
  ): PassFailEither<JinCreateError<JinEitherFrame<TPASS, TFAIL>, TPASS, TFAIL>, AxiosRequestConfig<any>> {
    try {
      const req = super.request(option);
      return pass(req);
    } catch (caught) {
      const source = caught as Error;
      const duration = getDuration(this.$$startAt, new Date());
      const debug: Omit<IDebugInfo, 'req'> = {
        ts: {
          unix: `${getUnixTime(this.$$startAt)}.${this.$$startAt.getMilliseconds()}`,
          iso: formatISO(this.$$startAt),
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
    PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailExceptionJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
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
        } satisfies IFailExceptionJinEitherFrame<TFAIL>);
    }

    const req = reqE.pass;
    const frame: JinEitherFrame<TPASS, TFAIL> = this;

    const isValidateStatus =
      option?.validateStatus === undefined || option?.validateStatus === null
        ? isValidateStatusDefault
        : option.validateStatus;

    return async () => {
      const startAt = new Date();
      const debugInfo: Omit<IDebugInfo, 'duration'> = {
        ts: {
          unix: `${getUnixTime(startAt)}.${startAt.getMilliseconds()}`,
          iso: formatISO(startAt),
        },
        req: { ...req, validateStatus: isValidateStatus },
      };

      try {
        let newReq: typeof req;

        if (this.preHook != null && this.preHook.constructor.name === 'AsyncFunction') {
          const hookApplied = await this.preHook?.(req);
          newReq = hookApplied != null ? hookApplied : req;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
          const hookApplied = (this.preHook as (this: void, req: AxiosRequestConfig) => void | AxiosRequestConfig)?.(
            req,
          );
          newReq = hookApplied != null ? hookApplied : req;
        }

        const reply = await axios.request<TPASS, AxiosResponse<TPASS>, TFAIL>(newReq);
        const endAt = new Date();

        if (isValidateStatus(reply.status) === false) {
          const failReply = reply as any as AxiosResponse<TFAIL>;
          const duration = getDuration(startAt, endAt);
          const err = new Error('Error caused from API response');

          const failInfo: IFailReplyJinEitherFrame<TFAIL> = {
            ...failReply,
            $progress: 'fail',
            $err: err,
            $debug: { ...debugInfo, duration },
            $frame: frame,
          };

          this.postHook?.(req, { kind: 'fail', reply: failInfo, err });

          return fail(failInfo);
        }

        const duration = getDuration(startAt, endAt);

        const passInfo: TPassJinEitherFrame<TPASS> = {
          ...reply,
          $progress: 'pass',
          $debug: { ...debugInfo, duration },
          $frame: frame,
        };

        this.postHook?.(req, { kind: 'pass', reply: passInfo });

        return pass(passInfo);
      } catch (catched) {
        const err = catched instanceof AxiosError ? catched : new AxiosError('unkonwn error raised from jinframe');
        const endAt = new Date();
        const duration = getDuration(startAt, endAt);

        const failInfo: IFailExceptionJinEitherFrame<TFAIL> = {
          $progress: 'error',
          $err: err,
          $debug: { ...debugInfo, duration },
          $frame: frame,
          status: err.status ?? httpStatusCodes.INTERNAL_SERVER_ERROR,
          statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
        };

        return fail(failInfo);
      }
    };
  }

  /**
   * Generate an AxiosRequestConfig value and invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns AxiosResponse With PassFailEither
   */
  public execute(
    option?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ): Promise<
    PassFailEither<IFailReplyJinEitherFrame<TFAIL> | IFailExceptionJinEitherFrame<TFAIL>, TPassJinEitherFrame<TPASS>>
  > {
    const requester = this.create(option);
    return requester();
  }
}
