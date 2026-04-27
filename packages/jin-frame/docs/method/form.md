---
outline: deep
---

# Form

**`jin-frame`** supports **form data submission**, which can be handled in two main ways:

- `application/x-www-form-urlencoded`
- `multipart/form-data`

These formats make it easy to handle **file uploads** or **form field submissions**.

## application/x-www-form-urlencoded

The `application/x-www-form-urlencoded` format serializes form fields into URL-encoded key-value pairs using the native `URLSearchParams` API. Set the `contentType` option to `application/x-www-form-urlencoded` and annotate each field with `@Body()`.

```ts
@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
})
class TestUrlencodedPostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}
```

jin-frame encodes all `@Body()` fields into `application/x-www-form-urlencoded` format automatically — no extra configuration needed.

## multipart/form-data

The `multipart/form-data` format is mainly used for **file uploads** or **complex data submissions**. jin-frame uses the native `FormData` API to build the request body. Use `JinFile` to wrap file data and annotate fields with `@Body()`.

Supported HTTP methods: `POST`, `PUT`, `PATCH`.

```ts
@Post({
  host: 'http://some.api.google.com/fileupload-case04',
  contentType: 'multipart/form-data',
})
class UploadFrame extends JinFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;

  @Body()
  declare public readonly myFiles: JinFile<Buffer>[];
}
```

- When `contentType` is set to `multipart/form-data`, jin-frame uses the native `FormData` API to build the request body automatically.
- The `Content-Type` header (including the multipart boundary) is set by the runtime — do not set it manually.

This makes it simple to upload a variety of data types, including images, documents, and binary files.

## Summary

- Use `application/x-www-form-urlencoded` for simple key-value data submissions.
- Use `multipart/form-data` when uploading files or sending complex structured data.
