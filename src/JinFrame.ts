import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import httpStatusCodes from 'http-status-codes';
import { efail, Either, epass, isEmpty, isFalse, isNotUndefined } from 'my-easy-fp';
import { compile } from 'path-to-regexp';
import 'reflect-metadata';
import { IFieldOption } from './IFieldOption';

export type TREQUEST_PART = 'QUERY' | 'BODY' | 'HEADER' | 'PARAM';

export interface IJinFrameRequestParams {
  timeout?: number;
  userAgent?: string;
  validateStatus?: AxiosRequestConfig['validateStatus'];
}

function bitwised(values: number[]): number {
  return values.reduce((bitwise, value) => bitwise | value, 0); // eslint-disable-line no-bitwise
}

function access<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function objectSetter<T = unknown>(key: string, value: T, object: any) {
  if (value === undefined || value === null) {
    return;
  }

  const dotSplited = key.split('.');

  if (dotSplited.length <= 1) {
    object[key] = value;
    return;
  }

  let current: any = object;

  for (let i = 0; i < dotSplited.length; i += 1) {
    const currentKey = dotSplited[i];

    if (current[currentKey] === undefined && dotSplited.length - 1 !== i) {
      current[currentKey] = {};
      current = current[currentKey];
    } else if (dotSplited.length - 1 === i) {
      current[currentKey] = value;
    } else {
      current = current[currentKey];
    }
  }
}

function simpleSetter<T = unknown>(key: string, value: T, object: any) {
  if (value !== undefined && value !== null) {
    object[key] = value;
  }
}

function stringSetter<T = unknown>(key: string, value: T, object: any) {
  if (value !== undefined && value !== null) {
    const refined = typeof value !== 'string' ? `${value ?? ''}` : value;

    if (refined !== '') {
      object[key] = refined;
    }
  }
}

function paramize<T>(
  obj: T,
  setter: <X>(key: string, value: X, object: any) => void,
  params: Array<{ key: string; option?: IFieldOption }>,
) {
  return params.reduce<{ [key: string]: any }>((datas, param) => {
    const value = access(obj, param.key as any);
    const option = param.option;

    if (isNotUndefined(option) && isNotUndefined(option.bit)) {
      if (option.bit.enable && Array.isArray(value)) {
        const bitwisedValue = bitwised(value);

        // 0을 제외하는 스펙
        if (isFalse(option.bit.withZero) && bitwisedValue === 0) {
          return datas;
        }

        // 0을 포함하는 스펙
        setter(option?.key ?? param.key, `${bitwisedValue}`, datas);
        return datas;
      }

      return datas;
    }

    if (isNotUndefined(option) && isNotUndefined(option.comma)) {
      if (option.comma.enable && Array.isArray(value)) {
        const searchParam = value.join(',');
        setter(option?.key ?? param.key, searchParam, datas);
        return datas;
      }

      setter(option?.key ?? param.key, `${value}`, datas);
      return datas;
    }

    setter(option?.key ?? param.key, value, datas);
    return datas;
  }, {});
}

function removeEndSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, value.length - 1) : value;
}

function removeStartSlash(value: string): string {
  return value.startsWith('/') ? value.slice(1, value.length) : value;
}

function removeBothSlash(value: string): string {
  return removeStartSlash(removeEndSlash(value));
}

function startWithSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}

export class JinFrame<PASS = unknown, FAIL = PASS> {
  public static SymbolBox = Symbol('SymbolBoxForJinFrame'); // tslint:disable-line

  public static param = (option?: IFieldOption) => Reflect.metadata(JinFrame.SymbolBox, ['PARAM', option]);
  public static query = (option?: IFieldOption) => Reflect.metadata(JinFrame.SymbolBox, ['QUERY', option]);
  public static body = (option?: IFieldOption) => Reflect.metadata(JinFrame.SymbolBox, ['BODY', option]);
  public static header = (option?: IFieldOption) => Reflect.metadata(JinFrame.SymbolBox, ['HEADER', option]);

  public readonly host?: string;
  public readonly path?: string;
  public readonly method: Method;
  public readonly contentType: string;
  public readonly customBody?: { [key: string]: any };

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

  public request(args?: IJinFrameRequestParams): AxiosRequestConfig {
    const thisObjectKeys: string[] = Object.keys(this);
    const keys: string[] = thisObjectKeys.filter((key: string): key is string =>
      Reflect.hasMetadata(JinFrame.SymbolBox, this, key),
    );
    const fields = keys.reduce<{ [key in TREQUEST_PART]: Array<{ key: string; option?: IFieldOption }> }>(
      (box, key) => {
        const [requestPart, option]: [TREQUEST_PART, IFieldOption] = Reflect.getMetadata(
          JinFrame.SymbolBox,
          this,
          key as string,
        );
        const value: any = access(this, key as any);

        if (value instanceof Date && (isEmpty(option) || isEmpty(option.dateFormat))) {
          throw new Error(`Request creation: DateField[${key}] miss dateFormat option`);
        }

        if (
          (requestPart === 'BODY' || requestPart === 'HEADER') &&
          isNotUndefined(option) &&
          isNotUndefined(option.force) &&
          option.force.enable === true &&
          box[requestPart].length >= 2
        ) {
          throw new Error(`Request creation: ${requestPart}[${key}] objectKey`);
        }

        box[requestPart].push({ option, key: key as any });
        return box;
      },
      { QUERY: [], BODY: [], PARAM: [], HEADER: [] },
    );

    const queries = paramize(this, simpleSetter, fields.QUERY); // query 파라미터를 생성한다
    const headers = fields.HEADER.length <= 0 ? {} : paramize(this, objectSetter, fields.HEADER); // header 파라미터를 생성한다
    const paths = paramize(this, stringSetter, fields.PARAM); // path 파라미터를 생성한다
    const bodies = (() => {
      if (isNotUndefined(this.customBody)) {
        return this.customBody;
      }

      if (fields.BODY.length <= 0) {
        return undefined;
      }

      return paramize(this, objectSetter, fields.BODY);
    })();

    const buildEndpoint = [this.host ?? 'http://localhost', this.path ?? '']
      .map((endpointPart) => endpointPart.trim())
      .map((endpointPart) => removeBothSlash(endpointPart))
      .join('/');
    const url = new URL(buildEndpoint);
    const pathfunc = compile(url.pathname);

    const buildPath = pathfunc(paths);
    url.pathname = removeEndSlash(buildPath);

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
    if (args?.userAgent !== undefined) {
      headers['User-Agent'] = args?.userAgent;
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

    const req: AxiosRequestConfig = {
      timeout: isNotUndefined(args) && isNotUndefined(args.timeout) ? args.timeout : 2000,
      headers,
      method: this.method,
      data: bodies,
      transformRequest,
      url: this.host !== undefined ? url.href : `${startWithSlash(url.pathname)}${url.search}`,
      validateStatus: () => true,
    };

    return req;
  }

  public create(
    args?: IJinFrameRequestParams,
  ): () => Promise<
    Either<
      AxiosResponse<PASS> & { $req: AxiosRequestConfig },
      AxiosResponse<FAIL> & { err: Error; $req: AxiosRequestConfig }
    >
  > {
    const req = this.request(args);

    return async () => {
      try {
        const res = await axios.request(req);

        if (res.status >= httpStatusCodes.BAD_REQUEST) {
          return efail({ ...res, $req: req, err: new Error('Error caused from API response') });
        }

        return epass({ ...res, $req: req });
      } catch (err) {
        return efail({
          status: httpStatusCodes.INTERNAL_SERVER_ERROR,
          statusText: `Internal Server Error: [${err.message}]`,
          headers: req.headers,
          config: req,
          request: req,
          data: {} as any,
          err,
          $req: req,
        });
      }
    };
  }

  public createWithoutEither(
    args?: IJinFrameRequestParams,
  ): () => Promise<AxiosResponse<PASS> & { $req: AxiosRequestConfig }> {
    const req = this.request(args);

    return async () => {
      const res = await axios.request<PASS>(req);
      return { ...res, $req: req };
    };
  }
}
