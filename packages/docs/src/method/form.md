---
outline: deep
---

# Forms and file uploads

Choose a content type explicitly. URL-encoded forms serialize key/value fields with URLSearchParams; multipart requests use native FormData and support files on POST, PUT, and PATCH.

## Multipart example

```ts twoslash
import { Body, JinFile, JinFrame, Post } from 'jin-frame';

@Post({
  host: 'https://api.example.com',
  path: '/uploads',
  contentType: 'multipart/form-data',
})
class UploadFrame extends JinFrame {
  @Body()
  declare readonly description: string;

  // JinFile carries the filename alongside the native Blob content.
  @Body()
  declare readonly attachment: JinFile<Blob>;
}

const frame = UploadFrame.of({
  description: 'Example document',
  attachment: new JinFile('hello.txt', new Blob(['Hello'], { type: 'text/plain' })),
});

// Inspect FormData without sending a request or manually setting its boundary.
const request = frame._request();
console.log(request.body);
```

## Boundary handling

Do not set Content-Type manually for multipart requests. The request configuration omits it so fetch can generate the boundary corresponding to the FormData body. A hard-coded boundary can make the body unreadable by the server.

## URL-encoded forms

Set `contentType: 'application/x-www-form-urlencoded'` on a POST/PUT/PATCH decorator and use `@Body()` fields. The assembled object is encoded by URLSearchParams. Use a separate API endpoint appropriate for credentials; never log passwords from request inspection.

## File inputs and limits

`JinFile` accepts File, Blob, Buffer, or a Node ReadStream. Choose the input type for your environment. An array of files is represented by `JinFile<T>[]`. Streams and multipart bodies are not eligible for concurrent request deduplication; see [dedupe](./dedupe).

Use [body fields](../field/body) for individual properties and [object bodies](../field/objectbody) for whole payload objects.
