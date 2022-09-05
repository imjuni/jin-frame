import { defaultJinFrameTimeout } from '@frames/defaultJinFrameTimeout';
import type { IBodyFieldOption } from '@interfaces/body/IBodyFieldOption';
import { IObjectBodyFieldOption } from '@interfaces/body/IObjectBodyFieldOption';
import type { IFailExceptionJinEitherFrame, IFailReplyJinEitherFrame } from '@interfaces/IFailJinEitherFrame';
import type { IHeaderFieldOption } from '@interfaces/IHeaderFieldOption';
import type { IJinFrameCreateConfig } from '@interfaces/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '@interfaces/IJinFrameRequestConfig';
import type { IParamFieldOption } from '@interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '@interfaces/IQueryFieldOption';
import type { TFieldRecords } from '@interfaces/TFieldRecords';
import type { TPassJinEitherFrame } from '@interfaces/TPassJinEitherFrame';
import type { TRequestPart } from '@interfaces/TRequestPart';
import { getBodyInfo } from '@processors/getBodyInfo';
import {
  getDefaultBodyFieldOption,
  getDefaultHeaderFieldOption,
  getDefaultObjectBodyFieldOption,
  getDefaultParamFieldOption,
  getDefaultQueryFieldOption,
} from '@processors/getDefaultOption';
import { getHeaderInfo } from '@processors/getHeaderInfo';
import { getQueryParamInfo } from '@processors/getQueryParamInfo';
import { removeBothSlash, removeEndSlash, startWithSlash } from '@tools/slashUtils';
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import fastSafeStringify from 'fast-safe-stringify';
import { isNotUndefined } from 'my-easy-fp';
import { PassFailEither } from 'my-only-either';
import { compile } from 'path-to-regexp';
import 'reflect-metadata';
import { Except } from 'type-fest';

export abstract class AbstractJinFrame<TPASS = unknown, TFAIL = TPASS> {
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
   * decorator to set class variable to HTTP API query parameter
   * @param option query parameter option
   */
  public static query = (option?: Partial<Omit<IQueryFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.QuerySymbolBox, ['QUERY', getDefaultQueryFieldOption(option)]);

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
  public static objectBody = (option?: Partial<Except<IObjectBodyFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.ObjectBodySymbolBox, ['OBJECTBODY', getDefaultObjectBodyFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API header parameter
   * @param option header parameter option
   */
  public static header = (option?: Partial<Except<IHeaderFieldOption, 'type'>>) =>
    Reflect.metadata(AbstractJinFrame.HeaderSymbolBox, ['HEADER', getDefaultHeaderFieldOption(option)]);

  /** host of API Request endpoint */
  public readonly host?: string;

  /** pathname of API Request endpoint */
  public readonly path?: string;

  /** method of API Request endpoint */
  public readonly method: Method;

  /** content-type of API Request endpoint */
  public readonly contentType: string;

  /** custom object of POST Request body data */
  public readonly customBody?: { [key: string]: any };

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
    this.host = host;
    this.path = path;
    this.method = method;
    this.customBody = customBody;

    this.contentType = contentType ?? 'application/json';

    if (host === undefined && path === undefined) {
      throw new Error('Invalid host & path. Cannot set undefined both');
    }
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
          [fieldKey]: [...(box[fieldKey] ?? []), { key: keyWithSymbol.key, option: fieldOption }],
        };
      },
      { query: [], body: [], param: [], header: [] },
    );

    // stage 02. each request parameter apply option
    const queries = getQueryParamInfo(this, fields.query); // create querystring information
    const headers = fields.header.length <= 0 ? {} : getHeaderInfo(this, fields.header) ?? {}; // create header information
    const paths = getQueryParamInfo(this, fields.param); // create param information
    const bodies = (() => {
      if (isNotUndefined(this.customBody)) {
        return this.customBody;
      }

      if (fields.body.length <= 0) {
        return undefined;
      }

      return getBodyInfo(this, fields.body);
    })();

    // stage 03. path parameter array value stringify
    const safePaths = Object.entries(paths).reduce(
      (processing, [key, value]) =>
        Array.isArray(value) ? { ...processing, [key]: fastSafeStringify(value) } : processing,
      { ...paths },
    );

    // stage 04. url endpoint build
    const buildEndpoint = [this.host ?? 'http://localhost', this.path ?? '']
      .map((endpointPart) => endpointPart.trim())
      .map((endpointPart) => removeBothSlash(endpointPart))
      .join('/');

    const url = new URL(buildEndpoint);

    // stage 05. path parameter evaluation
    const pathfunc = compile(url.pathname);
    const buildPath = pathfunc(safePaths);
    url.pathname = removeEndSlash(buildPath);

    // stage 06. querystring post processing
    Object.entries(queries).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((val) => url.searchParams.append(key, typeof val !== 'string' ? `${val}` : val));
      } else {
        url.searchParams.set(key, typeof value !== 'string' ? `${value}` : value);
      }
    });

    // If set user-agent configuration using on browser environment, sometimes browser not sent request
    // because security configuration. So remove user-agent configuration. But user can set this option,
    // not work this code block.
    if (option?.userAgent !== undefined) {
      headers['User-Agent'] = option?.userAgent;
    }

    headers['Content-Type'] = this.contentType;

    const transformRequest =
      this.contentType.indexOf('x-www-form-urlencoded') >= 0
        ? (formData: any) =>
            Object.entries<string>(formData)
              .filter(([_key, value]) => value !== undefined && value !== null)
              .map(([key, value]) => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
              })
              .join('&')
        : undefined;

    const targetUrl = this.host !== undefined ? url.href : `${startWithSlash(url.pathname)}${url.search}`;
    const req: AxiosRequestConfig = {
      ...option,
      ...{
        timeout: option?.timeout ?? defaultJinFrameTimeout,
        headers,
        method: this.method,
        data: bodies,
        transformRequest: option?.transformRequest ?? transformRequest,
        url: targetUrl,
        validateStatus: option?.validateStatus,
      },
    };

    return req;
  }

  public abstract create(
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ):
    | (() => Promise<AxiosResponse<TPASS>>)
    | (() => Promise<
        PassFailEither<
          IFailReplyJinEitherFrame<TFAIL> | IFailExceptionJinEitherFrame<TFAIL>,
          TPassJinEitherFrame<TPASS>
        >
      >);

  public abstract execute(
    args?: IJinFrameRequestConfig & IJinFrameCreateConfig,
  ):
    | Promise<AxiosResponse<TPASS>>
    | Promise<
        PassFailEither<
          IFailReplyJinEitherFrame<TFAIL> | IFailExceptionJinEitherFrame<TFAIL>,
          TPassJinEitherFrame<TPASS>
        >
      >;
}
