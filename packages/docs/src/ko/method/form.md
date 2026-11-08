---
outline: deep
---

# Form

`jin-frame`에서는 **Form 데이터 전송**을 지원합니다. Form 데이터는 크게 두 가지 방식으로 구분됩니다:

- `application/x-www-form-urlencoded`
- `multipart/form-data`

이를 활용하면 **파일 업로드** 또는 **폼 필드 데이터 전송**을 손쉽게 구현할 수 있습니다.

## application/x-www-form-urlencoded

`application/x-www-form-urlencoded` 방식은 네이티브 `URLSearchParams` API를 사용하여 폼 필드를 URL 인코딩된 키-값 쌍으로 직렬화합니다. `contentType` 옵션을 `application/x-www-form-urlencoded`로 지정하고, 각 필드에 `@Body()`를 붙여주면 됩니다.

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

jin-frame은 `@Body()` 필드를 자동으로 `application/x-www-form-urlencoded` 형식으로 인코딩합니다 — 별도 설정이 필요하지 않습니다.

## multipart/form-data

`multipart/form-data` 방식은 주로 **파일 업로드**나 **복합 데이터 전송**에 사용됩니다. jin-frame은 네이티브 `FormData` API를 사용하여 요청 바디를 구성합니다. 파일 데이터는 `JinFile`로 감싸고, 필드에 `@Body()`를 붙여주세요.

지원하는 HTTP 메서드: `POST`, `PUT`, `PATCH`.

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

- `contentType`을 `multipart/form-data`로 설정하면, jin-frame이 네이티브 `FormData` API를 사용하여 요청 바디를 자동으로 구성합니다.
- `Content-Type` 헤더(멀티파트 boundary 포함)는 런타임이 자동으로 설정합니다 — 직접 지정하지 않아도 됩니다.

이를 통해 이미지, 문서, 바이너리 파일 등 다양한 데이터를 손쉽게 업로드할 수 있습니다.

## 결론

- 단순한 키-값 데이터 전송에는 `application/x-www-form-urlencoded`를 사용하세요.
- 파일 업로드나 복합 데이터 전송이 필요하다면 `multipart/form-data`를 선택하세요.
