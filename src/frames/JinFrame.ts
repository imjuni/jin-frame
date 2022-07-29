import AbstractJinFrame from '@frames/AbstractJinFrame';
import JinFrameError from '@frames/JinFrameError';
import IDebugInfo from '@interfaces/IDebugInfo';
import IJinFrameCreateConfig from '@interfaces/IJinFrameCreateConfig';
import IJinFrameRequestConfig from '@interfaces/IJinFrameRequestConfig';
import isValidateStatusDefault from '@tools/isValidateStatusDefault';
import axios, { AxiosResponse, Method } from 'axios';
import formatISO from 'date-fns/formatISO';
import getUnixTime from 'date-fns/getUnixTime';
import intervalToDuration from 'date-fns/intervalToDuration';
import { isFalse, isNotEmpty } from 'my-easy-fp';
import 'reflect-metadata';

/**
 * Definition HTTP Request
 *
 * @typeParam TPASS AxiosResponse type argument case of valid status.
 * eg. AxiosResponse<TPASS>
 *
 * @typeParam TFAIL AxiosResponse type argument case of invalid status.
 * eg. AxiosResponse<TFAIL>
 */
export default class JinFrame<TPASS = unknown, TFAIL = TPASS> extends AbstractJinFrame<TPASS, TFAIL> {
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
    super({ host, path, method, customBody, contentType });
  }

  /**
   * Generate an AxiosRequestConfig value and use it to return a functions that invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns Functions that invoke HTTP APIs
   */
  public override create(option?: IJinFrameRequestConfig & IJinFrameCreateConfig): () => Promise<AxiosResponse<TPASS>> {
    const req = this.request({ ...option, validateStatus: () => true });
    const frame: JinFrame<TPASS, TFAIL> = this;

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
        const res = await axios.request<TPASS, AxiosResponse<TPASS>, TFAIL>(req);
        const endAt = new Date();

        if (isFalse(isValidateStatus(res.status))) {
          const failRes = res as any as AxiosResponse<TFAIL>;
          const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
          const duration = isNotEmpty(durationSeconds) ? durationSeconds * 1000 : -1;

          const err = new JinFrameError<TPASS, TFAIL>({
            resp: failRes,
            debug: { ...debugInfo, duration },
            frame,
            message: 'response error',
          });

          throw err;
        }

        const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
        const duration = isNotEmpty(durationSeconds) ? durationSeconds * 1000 : -1;

        return {
          ...res,
          $debug: { ...debugInfo, duration },
          $frame: frame,
        };
      } catch (catched) {
        const err = catched instanceof Error ? catched : new Error('unkonwn error raised from jinframe');
        const endAt = new Date();

        const durationSeconds = intervalToDuration({ start: startAt, end: endAt }).seconds;
        const duration = isNotEmpty(durationSeconds) ? durationSeconds * 1000 : -1;

        const jinFrameError = new JinFrameError<TPASS, TFAIL>({
          resp: undefined,
          debug: { ...debugInfo, duration },
          frame,
          message: err.message,
        });

        throw jinFrameError;
      }
    };
  }

  /**
   * Generate an AxiosRequestConfig value and invoke HTTP APIs
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns AxiosResponse With PassFailEither
   */
  public override execute(option?: IJinFrameRequestConfig & IJinFrameCreateConfig): Promise<AxiosResponse<TPASS>> {
    const requester = this.create(option);
    return requester();
  }
}
