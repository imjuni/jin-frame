/* eslint-disable @typescript-eslint/prefer-function-type, @typescript-eslint/no-explicit-any */
import { getFrameInternalData, getFrameOption } from '#tools/decorators/getFrameOption';
import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';

const CLASS_CONFIG = new Map<string, { option: IFrameOption; data: IFrameInternal }>();

export function getClassOption(key: string): { option: IFrameOption; data: IFrameInternal } | undefined {
  return CLASS_CONFIG.get(key);
}

export function Get(_option?: Partial<IFrameOption>) {
  return function GetInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = Object.freeze(getFrameOption('GET', _option));
    const data = Object.freeze(getFrameInternalData(option));

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Post(_option?: Partial<IFrameOption>) {
  return function PostInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('POST', _option);
    const data = getFrameInternalData(option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Put(_option?: Partial<IFrameOption>) {
  return function PutInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('PUT', _option);
    const data = getFrameInternalData(_option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Delete(_option?: Partial<Omit<IFrameOption, 'method'>>) {
  return function DeleteInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('DELETE', _option);
    const data = getFrameInternalData(_option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Patch(_option?: Partial<Omit<IFrameOption, 'method'>>) {
  return function PatchInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('PATCH', _option);
    const data = getFrameInternalData(_option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Options(_option?: Partial<Omit<IFrameOption, 'method'>>) {
  return function OptionsInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('OPTIONS', _option);
    const data = getFrameInternalData(_option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}

export function Head(_option?: Partial<Omit<IFrameOption, 'method'>>) {
  return function HeadInit<T extends { new (...args: any[]): any }>(_value: T): void {
    const option = getFrameOption('HEAD', _option);
    const data = getFrameInternalData(_option);

    CLASS_CONFIG.set(_value.name, { option, data });
  };
}
