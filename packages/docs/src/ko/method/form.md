---
outline: deep
---

# Forms and file uploads

Content-Type을 명시적으로 선택합니다. URL 인코딩 폼은 URLSearchParams로 키·값을 직렬화합니다. multipart는 네이티브 FormData를 사용하며 POST·PUT·PATCH에서 파일을 지원합니다.

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

multipart에서 Content-Type을 직접 넣지 않습니다. request 설정은 해당 header를 생략하고 fetch가 FormData에 맞는 boundary를 만들도록 합니다. 고정 boundary는 서버의 body 해석을 깨뜨릴 수 있습니다.

## URL-encoded forms

POST·PUT·PATCH decorator에 `contentType: 'application/x-www-form-urlencoded'`를 지정하고 `@Body()` field를 선언합니다. 조립한 object는 URLSearchParams로 인코딩합니다. 인증정보 전송은 적절한 서버 엔드포인트를 사용하고 request 검사 로그에 비밀번호를 남기지 않습니다.

## File inputs and limits

`JinFile`은 File·Blob·Buffer·Node ReadStream을 받습니다. 환경에 맞는 type를 선택합니다. 파일 array는 `JinFile<T>[]`입니다. 스트림·multipart body는 동시 request 중복 제거 대상이 아닙니다. [중복 제거](./dedupe)를 참고하세요.

개별 속성은 [body field](../field/body), 전체 object는 [object body](../field/objectbody)으로 구성합니다.
