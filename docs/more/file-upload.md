---
lang: en-US
title: File Upload
description: File Upload using JinFrame
---

Explain how to upload file using the jin-frame. Every form-data treat body value. Body value automatically convert to form-data using [form-data](https://github.com/form-data/form-data) package.

## content-type

Content-type must be set to `multipart/form-data` in order to upload files. See below,

```ts
class TestGetFrame extends JinEitherFrame {
  @JinEitherFrame.body()
  public readonly description: string;

  @JinEitherFrame.body()
  public readonly myFile: JinFile;

  @JinEitherFrame.body()
  public readonly myFiles: JinFile[];

  constructor({ description, file, files }: { description: string; file: JinFile; files: JinFile[] }) {
    super({
      host: 'http://some.api.google.com',
      path: '/fileupload-case04',
      method: 'post',
      contentType: 'multipart/form-data',
    });

    this.description = description;
    this.myFile = file;
    this.myFiles = files;
  }
}
```

## JinFile

To forward the file name to the server when uploading the file, use the `JinFile` object to save the file and the file name. See below.

```ts
const frame = new TestGetFrame({
  description: 'test',
  file: new JinFile('README.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
  files: [
    new JinFile('README01.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    new JinFile('README02.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    new JinFile('README03.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
    new JinFile('README04.md', fs.readFileSync(path.join(process.cwd(), 'README.md'))),
  ],
});
```

file, files field automatically merge and convert to `form-data`.
