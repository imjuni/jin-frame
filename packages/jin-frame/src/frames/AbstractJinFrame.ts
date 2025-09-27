import { JinFile } from '#frames/JinFile';
import { defaultJinFrameTimeout } from '#frames/defaultJinFrameTimeout';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import { getBodyMap } from '#processors/getBodyMap';
import { getQuerystringMap } from '#processors/getQuerystringMap';
import { removeEndSlash } from '#tools/slash-utils/removeEndSlash';
import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import type { IFrameOption } from '#interfaces/options/IFrameOption';
import type { IFrameInternal } from '#interfaces/options/IFrameInternal';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type axios from 'axios';
import { AxiosError } from 'axios';
import fastSafeStringify from 'fast-safe-stringify';
import FormData from 'form-data';
import { first } from 'my-easy-fp';
import { compile } from 'path-to-regexp';
import type { Constructor } from 'type-fest';
import { flatStringMap } from '#processors/flatStringMap';
import { getUrl } from '#tools/slash-utils/getUrl';
import { getRequestMeta } from '#decorators/methods/handlers/getRequestMeta';
import { getFieldMetadata } from '#decorators/fields/handlers/getFieldMetadata';
import { getRetryInterval } from '#tools/responses/getRetryInterval';
import { getDuration } from '#tools/getDuration';
import { getFrameInternalData } from '#decorators/getFrameInternalData';
import type { TConstructorFunction } from '#tools/type-utilities/TConstructorFunction';
import type { TFieldsOf } from '#tools/type-utilities/TFieldsOf';
import type { TBuilderFor } from '#tools/type-utilities/TBuilderFor';
import { getAuthorization } from '#tools/auth/getAuthorization';
import { getQuerystringKeyFormat } from '#processors/getQuerystringKeyFormat';
import { getQuerystringKey } from '#processors/getQuerystringKey';
import { getRetryAfter } from '#tools/getRetryAfter';
import { getCachePath } from '#tools/getCachePath';
import { get, set } from 'dot-prop';
import { safeStringify } from '#tools/json/safeStringify';
import { runAndUnwrap } from '#tools/runAndUnwrap';
import { RequestDedupeManager } from '#frames/RequestDedupeManager';
import { sleep } from '#tools/sleep';
import type { DedupeResult } from '#interfaces/DedupeResult';
import 'reflect-metadata';

export abstract class AbstractJinFrame<TPASS> {
  static getEndpoint(): URL {
    const meta = getRequestMeta(this);
    const urlMeta = getUrl(meta.option.host, meta.option.path);
    return urlMeta.url;
  }

  protected static getDefaultValues(): Partial<TFieldsOf<InstanceType<typeof this>>> {
    return {};
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static builder<T, C extends TConstructorFunction<T>>(this: C): TBuilderFor<T, C> {
    const store: Partial<TFieldsOf<InstanceType<C>>> = {};
    const self = this; // assign self for keep generic this

    const api: TBuilderFor<T, C> = {
      set(k, v) {
        store[k] = v;
        return this;
      },
      from(v) {
        for (const [k, e] of Object.entries(v)) {
          (store as any)[k] = e;
        }
        return this;
      },
      auto() {
        Object.assign(store, (self as any).getDefaultValues?.());
        return this;
      },
      get() {
        return store as Readonly<Partial<TFieldsOf<InstanceType<C>>>>;
      },
    };
    return api;
  }

  static of<T, C extends TConstructorFunction<T>>(
    this: C,
    args: TFieldsOf<InstanceType<C>> | ((b: TBuilderFor<T, C>) => unknown),
  ): InstanceType<C> {
    const inst = new this() as InstanceType<C>;
    const auto = (this as any).getDefaultValues?.() as Partial<TFieldsOf<InstanceType<C>>>;

    if (typeof args === 'function') {
      const b = (this as any).builder() as TBuilderFor<T, C>;
      args(b);
      const built = b.get();
      (inst as any).setFields({ ...auto, ...built });
      return inst;
    }

    (inst as any).setFields({ ...auto, ...args });
    return inst;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  // eslint-disable-next-line class-methods-use-this
  protected $_retryFail(_req: AxiosRequestConfig, _res: AxiosResponse<TPASS>): void | Promise<void> {}

  // eslint-disable-next-line class-methods-use-this
  protected $_retryException(_req: AxiosRequestConfig, _err: Error): void | Promise<void> {}

  protected $_option: IFrameOption;

  protected $_data: IFrameInternal;

  constructor() {
    const fromDecorator = getRequestMeta(this.constructor as Constructor<unknown>);

    this.$_option = { ...fromDecorator.option };
    this.$_data = getFrameInternalData(this.$_option);
  }

  public getData<K extends keyof Pick<IFrameInternal, 'body' | 'param' | 'query' | 'header' | 'instance' | 'retry'>>(
    kind: K,
  ): Pick<IFrameInternal, 'body' | 'param' | 'query' | 'header' | 'instance' | 'retry'>[K] {
    return this.$_data[kind];
  }

  public getOption<K extends keyof IFrameOption>(kind: K): IFrameOption[K] {
    // TypeScript inference limitation with complex interface types
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

  public getCacheKey(): string | undefined {
    const entries = Object.entries(this).map(([key, value]) => ({ key, value }));

    // stage 01. extract request parameter and option
    const fields = getFieldMetadata(this.constructor.prototype, entries);
    const data: Record<'query' | 'param' | 'header' | 'body', unknown> = { query: {}, param: {}, header: {}, body: {} };

    [...fields.query, ...fields.param, ...fields.header]
      .filter((input) => !input.cacheKeyExclude)
      .forEach((input) => {
        const value = get(this, input.key);
        set(data, getCachePath({ ...input }), value);
      });

    // 순서 중요하다, body를 objectBody가 overwrite 하지 않도록 주의하자
    [...fields.objectBody, ...fields.body].forEach((input) => {
      const value = get(this, input.key);
      set(data, getCachePath({ ...input }), value);

      input?.cacheKeyExcludePaths?.forEach((cacheKeyExcludePathItem) => {
        set(data, ['body', cacheKeyExcludePathItem].join('.'), undefined);
      });
    });

    set(data, 'endpoint.host', this.$_option.host);
    set(data, 'endpoint.pathPrefix', this.$_option.pathPrefix);
    set(data, 'endpoint.path', this.$_option.path);

    return safeStringify(data);
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
    const queryMap = new Map(fields.query.map((query) => [query.key, query]));
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

      return getBodyMap(this as Record<string, unknown>, [...fields.body, ...fields.objectBody]);
    })();

    // stage 04. set debuggint variable
    this.$_data.query = queries;
    this.$_data.body = bodies;
    this.$_data.header = headers;
    this.$_data.param = paths;

    // stage 05. url endpoint build
    const { url, isOnlyPath } =
      option?.url != null
        ? getUrl(option.url)
        : getUrl(this.$_option.host, this.$_option.pathPrefix, this.$_option.path);

    // stage 06. path parameter evaluation
    const pathfunc = compile(url.pathname);
    const buildPath = pathfunc(paths);
    url.pathname = removeEndSlash(buildPath);

    // stage 07. querystring post processing
    Object.entries(queries).forEach(([key, value]) => {
      const queryOption = queryMap.get(key);
      const keyFormat = getQuerystringKeyFormat(queryOption);

      if (Array.isArray(value) && keyFormat != null) {
        value.forEach((val, index) => {
          const formatted = getQuerystringKey({ key, index, format: keyFormat });
          url.searchParams.append(formatted, val);
        });
      } else if (Array.isArray(value)) {
        value.forEach((val, index) => {
          const formatted = getQuerystringKey({ key, index, format: keyFormat });
          url.searchParams.append(formatted, val);
        });
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

    const { authKey, auth } = getAuthorization(headers, this.$_option.authoriztion, option?.auth);

    headers['Content-Type'] = this.$_option.contentType;

    if (authKey != null) {
      headers.Authorization = authKey;
    }

    const transformRequest = this.getTransformRequest();
    const data = this.getFormData(bodies);
    const timeout = option?.timeout ?? this.$_option.timeout ?? defaultJinFrameTimeout;

    const targetUrl = isOnlyPath ? `${startWithSlash(url.pathname)}${url.search}` : url.href;
    const req: AxiosRequestConfig = {
      ...option,
      ...{
        timeout,
        headers,
        auth,
        method: this.$_option.method,
        data,
        transformRequest: option?.transformRequest ?? transformRequest,
        url: targetUrl,
        validateStatus: option?.validateStatus,
      },
    };

    return req;
  }

  async retry(req: AxiosRequestConfig, isValidateStatus: (status: number) => boolean): Promise<DedupeResult<TPASS>> {
    const { retry } = this.$_data;

    const handle = async () => {
      let returnValue: DedupeResult<TPASS> | AxiosError = new AxiosError();

      /* eslint-disable no-await-in-loop, no-restricted-syntax */
      for (let i = 0; i < retry.max; i += 1) {
        try {
          retry.try += 1;

          const cacheKey = this.$_option.dedupe ? this.getCacheKey() : undefined;
          const promised =
            cacheKey != null
              ? RequestDedupeManager.dedupe<TPASS>(cacheKey, async () => this.$_data.instance.request<TPASS>(req))
              : (async () => ({ reply: await this.$_data.instance.request<TPASS>(req), isDeduped: false }))();

          const deduped = await promised;
          const { reply } = deduped;
          const retryAfterValue = reply.headers['retry-after'] ?? reply.headers['Retry-After'];
          const retryAfter = getRetryAfter(retry, retryAfterValue);

          returnValue = deduped;

          if (isValidateStatus(reply.status)) {
            return deduped;
          }

          await runAndUnwrap(this.$_retryFail.bind(this), req, reply);

          const current = new Date();
          const interval = getRetryInterval(
            retry,
            getDuration(this.$_data.startAt, current),
            getDuration(this.$_data.eachStartAt, current),
            retryAfter,
          );

          await sleep(interval);
        } catch (err) {
          returnValue = err as AxiosError;

          await runAndUnwrap(this.$_retryException.bind(this), req, returnValue);

          const current = new Date();
          const interval = getRetryInterval(
            retry,
            getDuration(this.$_data.startAt, current),
            getDuration(this.$_data.eachStartAt, current),
            undefined,
          );

          await sleep(interval);
        }
      }
      /* eslint-enable no-await-in-loop, no-restricted-syntax */

      // Return Value
      if (returnValue instanceof AxiosError) {
        throw returnValue;
      }

      return returnValue;
    };

    const retried = await handle();

    return retried;
  }
}
