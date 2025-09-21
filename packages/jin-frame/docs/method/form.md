---
outline: deep
---

# Form

**`jin-frame`** supports **form data submission**, which can be handled in two main ways:

- `application/x-www-form-urlencoded`
- `multipart/form-data`

These formats make it easy to handle **file uploads** or **form field submissions**.

## application/x-www-form-urlencoded

The `application/x-www-form-urlencoded` format uses Axios’s built-in [`transformRequest`](https://github.com/axios/axios) function to convert form data. When you set the `content-type` to `application/x-www-form-urlencoded` in jin-frame, you can use the default `transformRequest` function. If needed, you can also pass your own `transformRequest` function as a constructor option to customize behavior.

```ts
@Post({
  host: 'http://some.api.google.com/jinframe/:passing',
  contentType: 'application/x-www-form-urlencoded',
})
class TestUrlencodedPostFrame extends JinEitherFrame {
  @Param()
  declare public readonly passing: string;

  @Body()
  declare public readonly username: string;

  @Body()
  declare public readonly password: string;
}
```

By setting the `content-type` to `application/x-www-form-urlencoded`, jin-frame will automatically apply its default `transformRequest` function. Alternatively, you can define and provide a custom `transformRequest` function through constructor options.  
This allows you to transmit key-value data in the standard URL-encoded format.

## multipart/form-data

The `multipart/form-data` format is mainly used for **file uploads** or **complex data submissions**. Internally, jin-frame uses the [form-data](https://github.com/form-data/form-data) package to process this format.

```ts
@Post({
  host: 'http://some.api.google.com/fileupload-case04',
  contentType: 'multipart/form-data',
})
class TestGetFrame extends JinEitherFrame {
  @Body()
  declare public readonly description: string;

  @Body()
  declare public readonly myFile: JinFile<Buffer>;

  @Body()
  declare public readonly myFiles: JinFile<Buffer>[];
}
```

- When `content-type` is set to `multipart/form-data`, jin-frame uses the `form-data` package to automatically generate the `AxiosRequestConfig.data` field value.

This makes it simple to upload a variety of data types, including images, documents, and binary files.

## Summary

- Use `application/x-www-form-urlencoded` for simple key-value data submissions.
- Use `multipart/form-data` when uploading files or sending complex structured data.
