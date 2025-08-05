/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { JinFile } from '#frames/JinFile';
import { defaultJinFrameTimeout } from '#frames/defaultJinFrameTimeout';
import type { IFrameRetry } from '#interfaces/IFrameRetry';
import type { IHeaderFieldOption } from '#interfaces/IHeaderFieldOption';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';
import type { TFieldRecords } from '#interfaces/TFieldRecords';
import type { TJinRequestConfig } from '#interfaces/TJinFrameResponse';
import type { TRequestPart } from '#interfaces/TRequestPart';
import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/body/IObjectBodyFieldOption';
import { getBodyInfo } from '#processors/getBodyInfo';
import {
  getDefaultBodyFieldOption,
  getDefaultHeaderFieldOption,
  getDefaultObjectBodyFieldOption,
  getDefaultParamFieldOption,
  getDefaultQueryFieldOption,
} from '#processors/getDefaultOption';
import { getHeaderInfo } from '#processors/getHeaderInfo';
import { getQueryParamInfo } from '#processors/getQueryParamInfo';
import { removeBothSlash } from '#tools/slash-utils/removeBothSlash';
import { removeEndSlash } from '#tools/slash-utils/removeEndSlash';
import { startWithSlash } from '#tools/slash-utils/startWithSlash';
import type { JinBuiltInOption } from '#tools/type-utilities/JinBuiltInOption';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import axios from 'axios';
import fastSafeStringify from 'fast-safe-stringify';
import FormData from 'form-data';
import { first } from 'my-easy-fp';
import { compile } from 'path-to-regexp';
import 'reflect-metadata';
import type { Except, SetRequired } from 'type-fest';

/**
 * HTTP Request Hook
 */
export interface AbstractJinFrame {
  /**
   * Execute before request. If you can change request object that is affected request.
   *
   * @param this this instance
   * @param req request object
   * */
  $$retryFailHook?<TDATA>(req: TJinRequestConfig, res: AxiosResponse<TDATA>): void | Promise<void>;
}

export abstract class AbstractJinFrame {
  public static ParamSymbolBox = Symbol('ParamSymbolBoxForAbstractJinFrame');

  public static QuerySymbolBox = Symbol('QuerySymbolBoxForAbstractJinFrame');

  public static BodySymbolBox = Symbol('BodySymbolBoxForAbstractJinFrame');

  public static ObjectBodySymbolBox = Symbol('ObjectBodySymbolBoxForAbstractJinFrame');

  public static HeaderSymbolBox = Symbol('HeaderSymbolBoxForAbstractJinFrame');

  /**
   * decorator to set class variable to HTTP API path parameter
   * @param option path parameter option
   */
  public static param = (option?: Partial<Omit<IParamFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.ParamSymbolBox, ['PARAM', getDefaultParamFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API path parameter
   * @param option path parameter option
   */
  public static P = AbstractJinFrame.param;

  /**
   * decorator to set class variable to HTTP API query parameter
   * @param option query parameter option
   */
  public static query = (option?: Partial<Omit<IQueryFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.QuerySymbolBox, ['QUERY', getDefaultQueryFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API query parameter
   * @param option query parameter option
   */
  public static Q = AbstractJinFrame.query;

  /**
   * decorator to set class variable to HTTP API body parameter
   * @param option body parameter option
   */
  public static body = (option?: Partial<Except<IBodyFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.BodySymbolBox, ['BODY', getDefaultBodyFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API body parameter
   * @param option body parameter option
   */
  public static B = AbstractJinFrame.body;

  /**
   * decorator to set class variable to HTTP API body parameter
   * @param option body parameter option
   */
  public static objectBody = (option?: Partial<Except<IObjectBodyFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.ObjectBodySymbolBox, ['OBJECTBODY', getDefaultObjectBodyFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API body parameter
   * @param option body parameter option
   */
  public static O = AbstractJinFrame.objectBody;

  /**
   * decorator to set class variable to HTTP API header parameter
   * @param option header parameter option
   */
  public static header = (option?: Partial<Except<IHeaderFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.HeaderSymbolBox, ['HEADER', getDefaultHeaderFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API header parameter
   * @param option header parameter option
   */
  public static H = AbstractJinFrame.header;

  /** host of API Request endpoint */
  #host?: string;

  /** pathname of API Request endpoint */
  #path?: string;

  /** method of API Request endpoint */
  #method: Method;

  /** content-type of API Request endpoint */
  #contentType: string;

  /** custom object of POST Request body data */
  #customBody?: unknown;

  /** transformRequest function of POST Request */
  #transformRequest?: AxiosRequestConfig['transformRequest'];

  #query?: Record<string, unknown>;

  #header?: Record<string, unknown>;

  #body?: unknown;

  #param?: Record<string, unknown>;

  #retry?: IFrameRetry & { try: number };

  #instance: AxiosInstance;

  public get $$query() {
    return this.#query;
  }

  public get $$header() {
    return this.#header;
  }

  public get $$body() {
    return this.#body;
  }

  public get $$param() {
    return this.#param;
  }

  /** host of API Request endpoint */
  public get $$host() {
    return this.#host;
  }

  /** pathname of API Request endpoint */
  public get $$path() {
    return this.#path;
  }

  /** method of API Request endpoint */
  public get $$method() {
    return this.#method;
  }

  /** content-type of API Request endpoint */
  public get $$contentType() {
    return this.#contentType;
  }

  /** custom object of POST Request body data */
  public get $$customBody() {
    return this.#customBody;
  }

  /** transformRequest function of POST Request */
  public get $$transformRequest() {
    return this.#transformRequest;
  }

  public get $$retry() {
    return this.#retry;
  }

  public set $$retry(value) {
    this.#retry = value;
  }

  public get $$instance(): AxiosInstance {
    return this.#instance;
  }

  protected $$startAt: Date;

  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor(args: SetRequired<JinBuiltInOption, '$$method'>) {
    Object.keys(args)
      .filter(
        (key) =>
          key !== '$$host' &&
          key !== '$$path' &&
          key !== '$$method' &&
          key !== '$$contentType' &&
          key !== '$$customBody' &&
          key !== '$$transformRequest' &&
          key !== '$$retry' &&
          key !== '$$instance',
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .forEach((key: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (this as any)[key] = (args as any)[key];
      });

    this.#method = args.$$method;
    this.#contentType = args.$$contentType ?? 'application/json';
    this.#customBody = args.$$customBody;
    this.#transformRequest = args.$$transformRequest;
    this.#retry = args.$$retry != null ? { ...args.$$retry, try: 0 } : undefined;
    this.$$startAt = new Date();

    if (args.$$host == null && args.$$path == null) {
      throw new Error('Invalid host & path. Cannot set undefined both');
    }

    this.#host = args.$$host;
    this.#path = args.$$path;

    if (args.$$instance) {
      this.#instance = axios.create();
    } else {
      this.#instance = axios;
    }
  }

  public getTransformRequest() {
    if (this.#contentType !== 'application/x-www-form-urlencoded') {
      return undefined;
    }

    if (this.#transformRequest != null) {
      return this.#transformRequest;
    }

    return (formData: any) =>
      Object.entries<string | undefined>(formData)
        .filter((entry): entry is [string, string] => entry[1] != null)
        .map(([key, value]) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');
  }

  getFormData(bodies: unknown): unknown {
    if (this.#method !== 'post' && this.#method !== 'POST') {
      return bodies;
    }

    if (this.#contentType === 'multipart/form-data' && typeof bodies === 'object' && bodies != null) {
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
          formData.append(key, `${value.toString()}`);
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
    const thisObjectKeys: string[] = Object.keys(this);

    const queryKeys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(AbstractJinFrame.QuerySymbolBox, this, key),
    );
    const paramKeys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(AbstractJinFrame.ParamSymbolBox, this, key),
    );
    const bodyKeys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(AbstractJinFrame.BodySymbolBox, this, key),
    );
    const objectBodyKeys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(AbstractJinFrame.ObjectBodySymbolBox, this, key),
    );
    const headerKeys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(AbstractJinFrame.HeaderSymbolBox, this, key),
    );

    // stage 01. extract request parameter and option
    const fields = [
      ...queryKeys.map((key) => ({ key, symbol: AbstractJinFrame.QuerySymbolBox })),
      ...paramKeys.map((key) => ({ key, symbol: AbstractJinFrame.ParamSymbolBox })),
      ...bodyKeys.map((key) => ({ key, symbol: AbstractJinFrame.BodySymbolBox })),
      ...objectBodyKeys.map((key) => ({ key, symbol: AbstractJinFrame.ObjectBodySymbolBox })),
      ...headerKeys.map((key) => ({ key, symbol: AbstractJinFrame.HeaderSymbolBox })),
    ].reduce<TFieldRecords>(
      (box, keyWithSymbol) => {
        const [, fieldOption] = Reflect.getMetadata(keyWithSymbol.symbol, this, keyWithSymbol.key) as [
          TRequestPart,
          IQueryFieldOption | IParamFieldOption | IBodyFieldOption | IObjectBodyFieldOption | IHeaderFieldOption,
        ];

        const rawFieldKey = fieldOption.type;
        const fieldKey = rawFieldKey === 'object-body' ? 'body' : rawFieldKey;

        return {
          ...box,
          [fieldKey]: [...box[fieldKey], { key: keyWithSymbol.key, option: fieldOption }],
        };
      },
      { query: [], body: [], param: [], header: [] },
    );

    // stage 02. each request parameter apply option
    const queries = getQueryParamInfo(this as Record<string, unknown>, fields.query); // create querystring information
    const headers = getHeaderInfo(this as Record<string, unknown>, fields.header); // create header information
    const paths = getQueryParamInfo(this as Record<string, unknown>, fields.param); // create param information
    const bodies: unknown = (() => {
      if (this.#customBody != null) {
        return this.#customBody;
      }

      if (fields.body.length <= 0) {
        return undefined;
      }

      return getBodyInfo(this as Record<string, unknown>, fields.body);
    })();

    // stage 03. path parameter array value stringify
    const safePaths = Object.entries(paths).reduce(
      (processing, [key, value]) =>
        Array.isArray(value) ? { ...processing, [key]: fastSafeStringify(value) } : processing,
      { ...paths },
    );

    // stage 04. set debuggint variable
    this.#query = queries;
    this.#body = bodies;
    this.#header = headers;
    this.#param = safePaths;

    // stage 05. url endpoint build
    const buildEndpoint = [this.#host ?? 'http://localhost', this.#path ?? '']
      .map((endpointPart) => endpointPart.trim())
      .map((endpointPart) => removeBothSlash(endpointPart))
      .join('/');

    const url = new URL(buildEndpoint);

    // stage 06. path parameter evaluation
    const pathfunc = compile(url.pathname);
    const buildPath = pathfunc(safePaths);
    url.pathname = removeEndSlash(buildPath);

    // stage 07. querystring post processing
    Object.entries(queries).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) =>
          url.searchParams.append(key, typeof val !== 'string' ? `${fastSafeStringify(val)}` : val),
        );
      } else {
        url.searchParams.set(key, typeof value !== 'string' ? `${fastSafeStringify(value)}` : value);
      }
    });

    // If set user-agent configuration using on browser environment, sometimes browser not sent request
    // because security configuration. So remove user-agent configuration. But user can set this option,
    // not work this code block.
    if (option?.userAgent != null) {
      headers['User-Agent'] = option.userAgent;
    }

    headers['Content-Type'] = this.#contentType;

    const transformRequest = this.getTransformRequest();
    const data = this.getFormData(bodies);

    const targetUrl = this.#host != null ? url.href : `${startWithSlash(url.pathname)}${url.search}`;
    const req: AxiosRequestConfig = {
      ...option,
      ...{
        timeout: option?.timeout ?? defaultJinFrameTimeout,
        headers,
        method: this.#method,
        data,
        transformRequest: option?.transformRequest ?? transformRequest,
        url: targetUrl,
        validateStatus: option?.validateStatus,
      },
    };

    return req;
  }

  async retry<TPASS>(req: AxiosRequestConfig, isValidateStatus: (status: number) => boolean) {
    const response = await this.#instance.request<TPASS, AxiosResponse<TPASS>>(req);
    const retry = this.#retry;

    if (isValidateStatus(response.status) || retry == null) {
      return response;
    }

    let prevResponse = response;
    const hook = this.$$retryFailHook != null ? this.$$retryFailHook.bind(this) : () => {};
    retry.interval = retry.interval != null ? retry.interval : 10;

    const retried = await new Promise<AxiosResponse<TPASS>>((resolve) => {
      const attempt = () => {
        axios
          .request<TPASS, AxiosResponse<TPASS>>(req)
          .then((retryResponse) => {
            prevResponse = retryResponse;

            if (isValidateStatus(retryResponse.status) || retry.max <= retry.try) {
              resolve(retryResponse);
            } else {
              retry.try += 1;
              hook(req, prevResponse);
              setTimeout(() => attempt(), retry.interval);
            }
          })
          .catch(
            /* c8 ignore next 9 */
            () => {
              if (retry.max <= retry.try) {
                resolve(prevResponse);
              } else {
                retry.try += 1;
                hook(req, prevResponse);
                setTimeout(() => attempt(), retry.interval);
              }
            },
          );
      };

      attempt();
    });

    return retried;
  }
}
