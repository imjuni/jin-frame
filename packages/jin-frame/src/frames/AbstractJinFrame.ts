import { JinFile } from '#frames/JinFile';
import { defaultJinFrameTimeout } from '#frames/defaultJinFrameTimeout';
import type { IJinFrameCreateConfig } from '#interfaces/options/IJinFrameCreateConfig';
import type { JinFrameRequestConfig } from '#interfaces/options/IJinFrameRequestConfig';
import { getBodyMap } from '#processors/getBodyMap';
import { getQuerystringMap } from '#processors/getQuerystringMap';
import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import type { FrameOption } from '#interfaces/options/FrameOption';
import type { FrameInternal } from '#interfaces/options/FrameInternal';
import { atOrUndefined, first, isError } from 'my-easy-fp';
import { parseTemplate } from 'url-template';
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
import { getUrlValue } from '#tools/getUrlValue';
import type { JinRequestConfig } from '#interfaces/JinRequestConfig';

export abstract class AbstractJinFrame {
  static getEndpoint(): URL {
    const meta = getRequestMeta(this);
    const urlMeta = getUrl(getUrlValue(meta.option.host), getUrlValue(meta.option.path));
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
  protected $_retryFail(_req: JinRequestConfig, _res: Response): void | Promise<void> {}

  // eslint-disable-next-line class-methods-use-this
  protected $_retryException(_req: JinRequestConfig, _err: Error): void | Promise<void> {}

  protected $_option: FrameOption;

  protected $_data: FrameInternal;

  constructor() {
    const fromDecorator = getRequestMeta(this.constructor as Constructor<unknown>);

    this.$_option = { ...fromDecorator.option };
    this.$_data = getFrameInternalData(this.$_option);
  }

  public getData<K extends keyof Pick<FrameInternal, 'body' | 'param' | 'query' | 'header' | 'retry'>>(
    kind: K,
  ): Pick<FrameInternal, 'body' | 'param' | 'query' | 'header' | 'retry'>[K] {
    return this.$_data[kind];
  }

  public getOption<K extends keyof FrameOption>(kind: K): FrameOption[K] {
    return this.$_option[kind];
  }

  public setFields(args: typeof this): void {
    for (const key of Object.keys(args) as (keyof typeof this)[]) {
      this[key] = args[key];
    }
  }

  public getBodyInit(bodies: unknown): BodyInit | undefined {
    if (this.$_option.contentType === 'application/x-www-form-urlencoded') {
      if (typeof bodies !== 'object' || bodies == null) {
        return undefined;
      }

      const params = new URLSearchParams();

      Object.entries(bodies as Record<string, unknown>)
        .filter((entry): entry is [string, string] => atOrUndefined(entry, 1) != null)
        .forEach(([key, value]) => params.append(key, value));

      return params.toString();
    }

    if (
      this.$_option.contentType === 'multipart/form-data' &&
      (this.$_option.method === 'post' || this.$_option.method === 'POST') &&
      typeof bodies === 'object' &&
      bodies != null
    ) {
      const formData = new FormData();

      Object.entries(bodies).forEach(([key, value]) => {
        if (Array.isArray(value) && first(value) instanceof JinFile) {
          value.forEach((jinFile: JinFile) => {
            const fileData = jinFile.file instanceof Buffer ? new Blob([jinFile.file]) : jinFile.file;
            formData.append(key, fileData, jinFile.name);
          });
        } else if (value instanceof JinFile) {
          const fileData = value.file instanceof Buffer ? new Blob([value.file]) : value.file;
          formData.append(key, fileData, value.name);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        } else if (typeof value === 'number') {
          formData.append(key, `${value}`);
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          throw new Error(
            `Invalid data type: ${typeof value}/ ${JSON.stringify(
              value,
            )}, only support JinFile, string, number, boolean, object type`,
          );
        }
      });

      return formData;
    }

    if (bodies == null) {
      return undefined;
    }

    return JSON.stringify(bodies);
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

    // Order is important. Caution about body field overwrite by objectBody value.
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

  public getBaseUrlString(paths: Record<string, string>): string {
    const host = getUrlValue(this.$_option.host);
    const pathPrefix = getUrlValue(this.$_option.pathPrefix);
    const path = getUrlValue(this.$_option.path);

    // Expand URI templates before creating URL object to avoid encoding
    const expandedHost = host ? parseTemplate(host).expand(paths) : host;
    const expandedPathPrefix = pathPrefix ? parseTemplate(pathPrefix).expand(paths) : pathPrefix;
    const expandedPath = path ? parseTemplate(path).expand(paths) : path;

    const urlMeta = getUrl(expandedHost, expandedPathPrefix, expandedPath);
    return urlMeta.isOnlyPath ? urlMeta.str : urlMeta.url.href;
  }

  /**
   * JinRequestConfig create using by class member variable.
   *
   * @param option same with JinRequestConfig, bug exclude some filed ignored
   * @returns created JinRequestConfig
   */
  public request(option?: JinFrameRequestConfig & IJinFrameCreateConfig): JinRequestConfig {
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

    // stage 05. url endpoint build and path parameter evaluation
    const baseUrlString = option?.url ?? this.getBaseUrlString(paths);

    // Expand URI template for option.url case
    const expandedUrlString = option?.url != null ? parseTemplate(baseUrlString).expand(paths) : baseUrlString;
    const { url, isOnlyPath } = getUrl(expandedUrlString);

    // stage 07. querystring post processing
    Object.entries(queries).forEach(([key, value]) => {
      const queryOption = queryMap.get(key);
      const keyFormat = getQuerystringKeyFormat(queryOption);

      if (Array.isArray(value)) {
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

    const { authKey, auth, securityHeaders, securityQueries } = getAuthorization(
      headers,
      this.$_option,
      option?.auth,
      option?.dynamicAuth,
    );

    // For multipart/form-data, omit Content-Type so fetch can auto-generate it with the boundary
    if (this.$_option.contentType !== 'multipart/form-data') {
      headers['Content-Type'] = this.$_option.contentType;
    }

    if (authKey != null) {
      headers.Authorization = authKey;
    }

    if (auth != null) {
      const encoded = btoa(`${auth.username}:${auth.password}`);
      headers.Authorization = `Basic ${encoded}`;
    }

    // Apply security provider query parameters
    if (securityQueries != null) {
      Object.entries(securityQueries).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Apply security provider headers (includes Authorization, Cookie, etc.)
    if (securityHeaders != null) {
      Object.assign(headers, securityHeaders);
    }

    const timeout = option?.timeout ?? this.$_option.timeout ?? defaultJinFrameTimeout;
    const body = this.getBodyInit(bodies);

    const targetUrl = isOnlyPath ? `${startWithSlash(url.pathname)}${url.search}` : url.href;
    const req: JinRequestConfig = {
      url: targetUrl,
      method: this.$_option.method,
      headers,
      body,
      timeout,
    };

    return req;
  }

  async retry(req: JinRequestConfig, isValidateStatus: (status: number) => boolean): Promise<DedupeResult> {
    const { retry } = this.$_data;

    const handle = async () => {
      let returnValue: DedupeResult | Error = new Error();

      /* eslint-disable no-await-in-loop, no-restricted-syntax */
      for (let i = 0; i < retry.max; i += 1) {
        try {
          retry.try += 1;

          const timeoutSignal = req.timeout != null ? AbortSignal.timeout(req.timeout) : undefined;
          const signal =
            req.signal != null && timeoutSignal != null
              ? AbortSignal.any([req.signal, timeoutSignal])
              : (req.signal ?? timeoutSignal);
          const fetchReq = new Request(req.url, {
            method: req.method,
            headers: req.headers,
            body: req.body,
            signal,
          });

          const cacheKey = this.$_option.dedupe ? this.getCacheKey() : undefined;
          const promised =
            cacheKey != null
              ? // eslint-disable-next-line @typescript-eslint/promise-function-async
                RequestDedupeManager.dedupe(cacheKey, () => fetch(fetchReq))
              : (async () => ({ resp: await fetch(fetchReq), isDeduped: false }))();

          const deduped = await promised;
          const { resp } = deduped;
          const retryAfterValue = resp.headers.get('retry-after') ?? resp.headers.get('Retry-After');
          const retryAfter = getRetryAfter(retry, retryAfterValue ?? undefined);

          returnValue = deduped;

          if (isValidateStatus(resp.status)) {
            return deduped;
          }

          await runAndUnwrap(this.$_retryFail.bind(this), req, resp.clone());

          const current = new Date();
          const interval = getRetryInterval(
            retry,
            getDuration(this.$_data.startAt, current),
            getDuration(this.$_data.eachStartAt, current),
            retryAfter,
          );

          await sleep(interval);
        } catch (err) {
          returnValue = isError(err, new Error('unknown error raised'));

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
      if (returnValue instanceof Error) {
        throw returnValue;
      }

      return returnValue;
    };

    const retried = await handle();

    return retried;
  }
}
