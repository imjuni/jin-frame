import { ReadStream } from 'fs';

export class JinFile {
  /** filename */
  #name: string;

  /** file content via stream or buffer */
  #file: ReadStream | Buffer | File | Blob;

  constructor(name: JinFile['name'], file: JinFile['file']) {
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
