import { JinFile } from '#frames/JinFile';
import { defaultJinFrameTimeout } from '#frames/defaultJinFrameTimeout';
import type { IHeaderFieldOption } from '#interfaces/IHeaderFieldOption';
import type { IJinFrameCreateConfig } from '#interfaces/IJinFrameCreateConfig';
import type { IJinFrameRequestConfig } from '#interfaces/IJinFrameRequestConfig';
import type { IParamFieldOption } from '#interfaces/IParamFieldOption';
import type { IQueryFieldOption } from '#interfaces/IQueryFieldOption';
import type { TFieldRecords } from '#interfaces/TFieldRecords';
import type { TRequestPart } from '#interfaces/TRequestPart';
import type { IBodyFieldOption } from '#interfaces/body/IBodyFieldOption';
import type { IObjectBodyFieldOption } from '#interfaces/body/IObjectBodyFieldOption';
import { getBodyMap } from '#processors/getBodyMap';
import {
  getDefaultBodyFieldOption,
  getDefaultHeaderFieldOption,
  getDefaultObjectBodyFieldOption,
  getDefaultParamFieldOption,
  getDefaultQueryFieldOption,
} from '#processors/getDefaultOption';
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
import type { Except } from 'type-fest';
import { flatStringMap } from '#processors/flatStringMap';
import { getUrl } from '#tools/slash-utils/getUrl';
import { getClassOption } from '#tools/decorators/MethodDecorators';
import { getFrameInternalData, getFrameOption } from '#tools/decorators/getFrameOption';

export abstract class AbstractJinFrame<TPASS> {
  public static ParamSymbolBox = Symbol('ParamSymbolBoxForAbstractJinFrame');

  public static QuerySymbolBox = Symbol('QuerySymbolBoxForAbstractJinFrame');

  public static BodySymbolBox = Symbol('BodySymbolBoxForAbstractJinFrame');

  public static ObjectBodySymbolBox = Symbol('ObjectBodySymbolBoxForAbstractJinFrame');

  public static HeaderSymbolBox = Symbol('HeaderSymbolBoxForAbstractJinFrame');

  /**
   * decorator to set class variable to HTTP API path parameter
   * @param option path parameter option
   */
  public static param = (option?: Partial<Omit<IParamFieldOption, 'type'>>): ReturnType<typeof Reflect.metadata> =>
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
  public static query = (option?: Partial<Omit<IQueryFieldOption, 'type'>>): ReturnType<typeof Reflect.metadata> =>
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
  public static body = (option?: Partial<Except<IBodyFieldOption, 'type'>>): ReturnType<typeof Reflect.metadata> =>
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
  public static objectBody = (
    option?: Partial<Except<IObjectBodyFieldOption, 'type'>>,
  ): ReturnType<typeof Reflect.metadata> =>
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
  public static header = (option?: Partial<Except<IHeaderFieldOption, 'type'>>): ReturnType<typeof Reflect.metadata> =>
    Reflect.metadata(AbstractJinFrame.HeaderSymbolBox, ['HEADER', getDefaultHeaderFieldOption(option)]);

  /**
   * decorator to set class variable to HTTP API header parameter
   * @param option header parameter option
   */
  public static H = AbstractJinFrame.header;

  // eslint-disable-next-line class-methods-use-this
  protected $_retryFail(_req: AxiosRequestConfig, _res: AxiosResponse<TPASS>): void {}

  protected $_option: IFrameOption;

  protected $_data: IFrameInternal;

  /**
   * @param __namedParameters.host - host of API Request endpoint
   * @param __namedParameters.path - pathname of API Request endpoint
   * @param __namedParameters.method -  method of API Request endpoint
   * @param __namedParameters.contentType - content-type of API Request endpoint
   * @param __namedParameters.customBody - custom object of POST Request body data
   */
  constructor() {
    const fromDecorator = getClassOption(this.constructor.name);

    this.$_option = fromDecorator?.option != null ? { ...fromDecorator.option } : getFrameOption('GET');
    this.$_data = fromDecorator?.data != null ? { ...fromDecorator.data } : getFrameInternalData(this.$_option);
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

      if (fields.body.length <= 0) {
        return undefined;
      }

      return getBodyMap(this as Record<string, unknown>, fields.body);
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
        value.forEach((val) => url.searchParams.append(key, typeof val !== 'string' ? fastSafeStringify(val) : val));
      } else {
        url.searchParams.set(key, typeof value !== 'string' ? fastSafeStringify(value) : value);
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
    const hook = this.$_retryFail != null ? this.$_retryFail.bind(this) : () => {};
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
