import type { ReadStream } from 'fs';

export class JinFile<T extends ReadStream | Buffer | File | Blob> {
  /** filename */
  #name: string;

  /** file content via stream or buffer */
  #file: T;

  constructor(name: JinFile<T>['name'], file: JinFile<T>['file']) {
    this.#file = file;
    this.#name = name;
  }

  get file() {
    return this.#file;
  }

  get name() {
    return this.#name;
  }
}
