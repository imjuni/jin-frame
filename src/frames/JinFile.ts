import type { ReadStream } from 'node:fs';

export class JinFile<T extends ReadStream | Buffer | File | Blob = File> {
  /** filename */
  #name: string;

  /** file content via stream or buffer */
  #file: T;

  constructor(name: JinFile<T>['name'], file: JinFile<T>['file']) {
    this.#file = file;
    this.#name = name;
  }

  get file(): T {
    return this.#file;
  }

  get name(): string {
    return this.#name;
  }
}
