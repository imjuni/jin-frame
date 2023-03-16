import { AbstractJinFrame } from '@frames/AbstractJinFrame';
import { JinCreateError } from '@frames/JinCreateError';
import { JinRequestError } from '@frames/JinRequestError';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { IJinFrameCreateConfig } from '@interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '@interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '@interfaces/IJinFrameRequestConfig';
import type { TJinFramePostHookReply } from '@interfaces/THookReply';
import { getDuration } from '@tools/getDuration';
import { isValidateStatusDefault } from '@tools/isValidateStatusDefault';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type Method } from 'axios';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import formatISO from 'date-fns/formatISO';
/* eslint-disable-next-line import/no-extraneous-dependencies, import/no-duplicates */
import getUnixTime from 'date-fns/getUnixTime';
import 'reflect-metadata';

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
  preHook?(this: void, req: AxiosRequestConfig): void | AxiosRequestConfig | Promise<void | AxiosRequestConfig>;

  /**
   * Execute after request.
   *
   * @param this this instance
   * @param req request object
   * @param result [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) pass or fail
   */
  postHook?(this: void, req: AxiosRequestConfig, result: TJinFramePostHookReply<TPASS, TFAIL>): void | Promise<void>;
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
  constructor(args: {
    host?: string;
    path?: string;
    method: Method;
    contentType?: string;
    customBody?: { [key: string]: any };
  }) {
    super({ ...args });
  }

  public override request(
    option?: (IJinFrameRequestConfig & IJinFrameCreateConfig) | undefined,
  ): AxiosRequestConfig<any> {
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
    const frame: JinFrame<TPASS, TFAIL> = this;

    const isValidateStatus = option?.validateStatus == null ? isValidateStatusDefault : option.validateStatus;

    return async () => {
      const startAt = new Date();
      const debug: Omit<IDebugInfo, 'duration'> = {
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
          const hookApplied = (this.preHook as (this: void, req: AxiosRequestConfig) => void | AxiosRequestConfig)?.(
            req,
          );
          newReq = hookApplied != null ? hookApplied : req;
        }

        const reply = await axios.request<TPASS, AxiosResponse<TPASS>, TFAIL>(newReq);

        if (isValidateStatus(reply.status) === false) {
          const failReply = reply as any as AxiosResponse<TFAIL>;
          const duration = getDuration(this.$$startAt, new Date());

          const err = new JinRequestError<TPASS, TFAIL>({
            resp: failReply,
            debug: { ...debug, duration },
            frame,
            message: 'response error',
          });

          this.postHook?.(req, { kind: 'fail', reply: failReply, err, debug: err.debug });

          throw err;
        }

        const duration = getDuration(this.$$startAt, new Date());
        const debugWithDuration = { ...debug, duration };

        this.postHook?.(req, { kind: 'pass', reply, debug: debugWithDuration });

        return {
          ...reply,
          $debug: debugWithDuration,
          $frame: frame,
        };
      } catch (catched) {
        if (catched instanceof JinRequestError) {
          throw option?.getError != null ? option.getError(catched) : catched;
        }

        if (catched instanceof AxiosError) {
          const duration = getDuration(this.$$startAt, new Date());

          const jinFrameError = new JinRequestError<TPASS, TFAIL>({
            resp:
              catched.response ??
              ({
                status: httpStatusCodes.INTERNAL_SERVER_ERROR,
                statusText: getReasonPhrase(httpStatusCodes.INTERNAL_SERVER_ERROR),
              } as AxiosResponse<TFAIL>),
            debug: { ...debug, duration },
            frame,
            message: catched.message,
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
