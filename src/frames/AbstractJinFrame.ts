import { JinFile } from '#frames/JinFile';
import { defaultJinFrameTimeout } from '#frames/defaultJinFrameTimeout';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import { getBodyMap } from '#processors/getBodyMap';
import { getQuerystringMap } from '#processors/getQuerystringMap';
import { removeEndSlash } from '#tools/slash-utils/removeEndSlash';
import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';
import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import fastSafeStringify from 'fast-safe-stringify';
import FormData from 'form-data';
import { first } from 'my-easy-fp';
import { compile } from 'path-to-regexp';
import 'reflect-metadata';
import type { Constructor } from 'type-fest';
import { flatStringMap } from '#processors/flatStringMap';
import { getUrl } from '#tools/slash-utils/getUrl';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { getFieldMetadata } from '#decorators/fields/handlers/getFieldMetadata';

export abstract class AbstractJinFrame<TPASS> {
  // eslint-disable-next-line class-methods-use-this
  protected $_retryFail(_req: AxiosRequestConfig, _res: AxiosResponse<TPASS>): void {}

  protected $_option!: IFrameOption;

  protected $_data!: IFrameInternal;

  constructor() {
    const fromDecorator = getRequestMeta(this.constructor as Constructor<unknown>);

    this.$_option = { ...fromDecorator.option };
    this.$_data = { ...fromDecorator.data };
  }

  public getData<K extends keyof Pick<IFrameInternal, 'body' | 'param' | 'query' | 'header' | 'instance'>>(
    kind: K,
  ): Pick<IFrameInternal, 'body' | 'param' | 'query' | 'header' | 'instance'>[K] {
    return this.$_data[kind];
  }

  public getOption<K extends keyof IFrameOption>(kind: K): IFrameOption[K] {
    return this.$_option[kind];
  }

  public setFields(args: typeof this): void {
    for (const key of Object.keys(args) as (keyof typeof this)[]) {
      this[key] = args[key];
    }
  }

  public getTransformRequest(): undefined | axios.AxiosRequestTransformer | axios.AxiosRequestTransformer[] {
    if (this.$_option.contentType !== 'application/x-www-form-urlencoded') {
      return undefined;
    }

    if (this.$_option.transformRequest != null) {
      return this.$_option.transformRequest;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformRequest: axios.AxiosRequestTransformer = (formData: any) =>
      Object.entries<string | undefined>(formData)
        .filter((entry): entry is [string, string] => entry[1] != null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

    return transformRequest;
  }

  public getFormData(bodies: unknown): unknown {
    if (this.$_option.method !== 'post' && this.$_option.method !== 'POST') {
      return bodies;
    }

    if (this.$_option.contentType === 'multipart/form-data' && typeof bodies === 'object' && bodies != null) {
      const formData = new FormData();

      Object.entries(bodies).forEach(([key, value]) => {
        if (Array.isArray(value) && first(value) instanceof JinFile) {
          value.forEach((jinFile: JinFile) => formData.append(key, jinFile.file, jinFile.name));
        } else if (value instanceof JinFile) {
          formData.append(key, value.file, value.name);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        } else if (typeof value === 'number') {
          formData.append(key, `${value}`);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'object') {
          formData.append(key, fastSafeStringify(value));
        } else {
          throw new Error(
            `Invalid data type: ${typeof value}/ ${fastSafeStringify(
              value,
            )}, only support JinFile, string, number, boolean, object type`,
          );
        }
      });

      return formData;
    }

    return bodies;
  }

  /**
   * AxiosRequestConfig create using by class member variable.
   *
   * @param option same with AxiosRequestConfig, bug exclude some filed ignored
   * @returns created AxiosRequestConfig
   */
  public request(option?: IJinFrameRequestConfig & IJinFrameCreateConfig): AxiosRequestConfig {
    const entries = Object.entries(this).map(([key, value]) => ({ key, value }));

    // stage 01. extract request parameter and option
    const fields = getFieldMetadata(this.constructor.prototype, entries);

    // stage 02. each request parameter apply option
    const queries = getQuerystringMap(this as Record<string, unknown>, fields.query); // create querystring information
    const headers = flatStringMap(getQuerystringMap(this as Record<string, unknown>, fields.header)); // create header information
    const paths = flatStringMap(getQuerystringMap(this as Record<string, unknown>, fields.param)); // create param information
    const bodies: unknown = (() => {
      if (option?.customBody != null) {
        return option.customBody;
      }

      if (this.$_option.customBody != null) {
        return this.$_option.customBody;
      }

      if (fields.body.length + fields.objectBody.length <= 0) {
        return undefined;
      }

      return getBodyMap(this as Record<string, unknown>, [
        ...fields.body.map((body) => ({
          key: body.key,
          option: body.option,
        })),
        ...fields.objectBody.map((body) => ({
          key: body.key,
          option: body.option,
        })),
      ]);
    })();

    // stage 04. set debuggint variable
    this.$_data.query = queries;
    this.$_data.body = bodies;
    this.$_data.header = headers;
    this.$_data.param = paths;

    // stage 05. url endpoint build
    const { url, isOnlyPath } =
      option?.url != null ? getUrl(option.url) : getUrl(this.$_option.host, this.$_option.path);

    // stage 06. path parameter evaluation
    const pathfunc = compile(url.pathname);
    const buildPath = pathfunc(paths);
    url.pathname = removeEndSlash(buildPath);

    // stage 07. querystring post processing
    Object.entries(queries).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => url.searchParams.append(key, val));
      } else {
        url.searchParams.set(key, value);
      }
    });

    // If set user-agent configuration using on browser environment, sometimes browser not sent request
    // because security configuration. So remove user-agent configuration. But user can set this option,
    // not work this code block.
    if (option?.userAgent != null) {
      headers['User-Agent'] = option.userAgent;
    }

    headers['Content-Type'] = this.$_option.contentType;

    const transformRequest = this.getTransformRequest();
    const data = this.getFormData(bodies);
    const timeout = option?.timeout ?? this.$_option.timeout ?? defaultJinFrameTimeout;

    const targetUrl = isOnlyPath ? `${startWithSlash(url.pathname)}${url.search}` : url.href;
    const req: AxiosRequestConfig = {
      ...option,
      ...{
        timeout,
        headers,
        method: this.$_option.method,
        data,
        transformRequest: option?.transformRequest ?? transformRequest,
        url: targetUrl,
        validateStatus: option?.validateStatus,
      },
    };

    return req;
  }

  async retry(req: AxiosRequestConfig, isValidateStatus: (status: number) => boolean): Promise<AxiosResponse<TPASS>> {
    const response = await this.$_data.instance.request<TPASS, AxiosResponse<TPASS>>(req);
    const { retry } = this.$_data;

    if (isValidateStatus(response.status) || retry == null) {
      return response;
    }

    let prevResponse = response;
    const hook = this.$_retryFail.bind(this);
    retry.interval = retry.interval ?? 10;

    const retried = await new Promise<AxiosResponse<TPASS>>((resolve) => {
      const attempt = () => {
        axios
          .request<TPASS, AxiosResponse<TPASS>>(req)
          .then((retryResponse) => {
            prevResponse = retryResponse;

            if (isValidateStatus(retryResponse.status)) {
              resolve(retryResponse);
            } else if (retry.max <= retry.try) {
              resolve(retryResponse);
            } else {
              retry.try += 1;
              hook(req, prevResponse);
              setTimeout(() => attempt(), retry.interval);
            }
          })
          // 보통의 경우 requestWrap에서 validateStatus: () => true 를 설정하기 때문에
          // 내부 오류로 인해서 이 catch에 도달하는 경우는 발생할 수 없으나, 알 수 없는 오류 방지를 위해 추가함
          //
          // In normal cases, the requestWrap function sets validateStatus: () => true,
          // so this catch block will not be reached. However, it is added to handle any unexpected errors
          // that may arise from Axios.
          /* c8 ignore next 9 */
          .catch(() => {
            if (retry.max <= retry.try) {
              resolve(prevResponse);
            } else {
              retry.try += 1;
              hook(req, prevResponse);
              setTimeout(() => attempt(), retry.interval);
            }
          });
      };

      attempt();
    });

    return retried;
  }
}
