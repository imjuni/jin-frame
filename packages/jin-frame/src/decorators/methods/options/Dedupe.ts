import { REQUEST_DEDUPE_DECORATOR } from '#decorators/methods/handlers/REQUEST_DEDUPE_DECORATOR';
import 'reflect-metadata';

export function Dedupe() {
  return function dedupeHandle(target: object): void {
    const prev = (Reflect.getOwnMetadata(REQUEST_DEDUPE_DECORATOR, target) as boolean[] | undefined) ?? [];

    Reflect.defineMetadata(REQUEST_DEDUPE_DECORATOR, [...prev, true], target);
  };
}
