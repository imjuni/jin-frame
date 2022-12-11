/* eslint-disable import/no-extraneous-dependencies */

import { AbstractJinFrame } from '@frames/AbstractJinFrame';
import type { IDebugInfo } from '@interfaces/IDebugInfo';
import type { IFailExceptionJinEitherFrame, IFailReplyJinEitherFrame } from '@interfaces/IFailJinEitherFrame';
import type { IJinFrameCreateConfig } from '@interfaces/IJinFrameCreateConfig';
import type { IJinFrameFunction } from '@interfaces/IJinFrameFunction';
import type { IJinFrameRequestConfig } from '@interfaces/IJinFrameRequestConfig';
import type { TPassJinEitherFrame } from '@interfaces/TPassJinEitherFrame';
import { isValidateStatusDefault } from '@tools/isValidateStatusDefault';
import axios, { type AxiosResponse, type Method } from 'axios';
import formatISO from 'date-fns/formatISO';
import getUnixTime from 'date-fns/getUnixTime';
import intervalToDuration from 'date-fns/intervalToDuration';
import httpStatusCodes, { getReasonPhrase } from 'http-status-codes';
import { fail, pass, PassFailEither } from 'my-only-either';
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
export class JinEitherFrame<PASS = unknown, FAIL = PASS>
  extends AbstractJinFrame
  implements IJinFrameFunction<PASS, FAIL>
{
  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor({
    host,
    path,
    method,
    contentType,
    customBody,
  }: {
    host?: string;
    path?: string;
    method: Method;
    contentType?: string;
    customBody?: { [key: string]: any };
  }) {
    super({ host, path, method, contentType, customBody });
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
    PassFailEither<IFailReplyJinEitherFrame<FAIL> | IFailExceptionJinEitherFrame<FAIL>, TPassJinEitherFrame<PASS>>
  > {
    const req = this.request({ ...option, validateStatus: () => true });
    const frame: JinEitherFrame<PASS, FAIL> = this;

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
        const res = await axios.request<PASS, AxiosResponse<PASS>, FAIL>(req);
        const endAt = new Date();

        if (isValidateStatus(res.status) === false) {
          const failRes = res as any as AxiosResponse<FAIL>;
          const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
          const duration = durationSeconds != null ? durationSeconds * 1000 : -1;

          const failInfo: IFailReplyJinEitherFrame<FAIL> = {
            ...failRes,
            $progress: 'fail',
            $err: new Error('Error caused from API response'),
            $debug: { ...debugInfo, duration },
            $frame: frame,
          };

          return fail(failInfo);
        }

        const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
        const duration = durationSeconds != null ? durationSeconds * 1000 : -1;

        const passInfo: TPassJinEitherFrame<PASS> = {
          ...res,
          $progress: 'pass',
          $debug: { ...debugInfo, duration },
          $frame: frame,
        };

        return pass(passInfo);
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unkonwn error raised from jinframe');
        const endAt = new Date();
        const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
        const duration = durationSeconds != null ? durationSeconds * 1000 : -1;

        const failInfo: IFailExceptionJinEitherFrame<FAIL> = {
          $progress: 'error',
          $err: err,
          $debug: { ...debugInfo, duration },
          $frame: frame,
          status: httpStatusCodes.INTERNAL_SERVER_ERROR,
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
    PassFailEither<IFailReplyJinEitherFrame<FAIL> | IFailExceptionJinEitherFrame<FAIL>, TPassJinEitherFrame<PASS>>
  > {
    const requester = this.create(option);
    return requester();
  }
}
