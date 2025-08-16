import { REQUEST_METHOD_DECORATOR } from '#tools/decorators/methods/handlers/REQUEST_METHOD_DECORATOR';
import type { TMethodEntry } from '#tools/decorators/methods/handlers/TMethodEntry';
import type { AbstractConstructor, Constructor } from 'type-fest';

export function getAllRequestMetaInherited(
  ctor: AbstractConstructor<unknown> | Constructor<unknown>,
): readonly TMethodEntry[] {
  const out: TMethodEntry[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (
    let c: AbstractConstructor<unknown> | Constructor<unknown> = ctor;
    typeof c === 'function';
    c = Object.getPrototypeOf(c)
  ) {
    const own = (Reflect.getOwnMetadata(REQUEST_METHOD_DECORATOR, c) as TMethodEntry[] | undefined) ?? [];
    out.push(...own);
  }

  return out;
}
