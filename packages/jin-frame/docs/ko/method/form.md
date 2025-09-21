---
outline: deep
---

# Form

`jin-frame`에서는 **Form 데이터 전송**을 지원합니다. Form 데이터는 크게 두 가지 방식으로 구분됩니다:

- `application/x-www-form-urlencoded`
- `multipart/form-data`

이를 활용하면 **파일 업로드** 또는 **폼 필드 데이터 전송**을 손쉽게 구현할 수 있습니다.

## application/x-www-form-urlencoded

`application/x-www-form-urlencoded` 방식은 [Axios](https://github.com/axios/axios)에서 제공하는 `transformRequest` 함수를 통해 Form 데이터를 변환합니다. jin-frame에서 `content-type`을 `application/x-www-form-urlencoded`로 지정하면, 기본 제공되는 `transformRequest` 함수를 사용할 수 있습니다. 필요하다면 직접 정의한 `transformRequest` 함수를 생성자 옵션으로 전달하여 동작을 커스터마이즈할 수도 있습니다.
multipart/form-data

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

jin-frame에서 `content-type`을 `application/x-www-form-urlencoded`로 지정하면, 기본 제공되는 `transformRequest` 함수를 사용할 수 있습니다.

- 기본 제공되는 `transformRequest` 함수를 사용할 수 있습니다.
- 혹은 필요에 따라 직접 정의한 `transformRequest` 함수를 **생성자 옵션으로 전달**할 수도 있습니다.

이를 통해 키-값 쌍 형태의 데이터를 URL 인코딩 방식으로 전송할 수 있습니다.

## multipart/form-data

`multipart/form-data` 방식은 주로 **파일 업로드**나 **복합 데이터 전송**에 사용됩니다. jin-frame은 내부적으로 [form-data](https://github.com/form-data/form-data) 패키지를 활용하여 이 방식을 처리합니다.

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

- `content-type`을 `multipart/form-data`로 설정하면, jin-frame이 `form-data` 패키지를 사용하여 `AxiosRequestConfig.data` 필드 값을 자동으로 생성합니다.

이를 통해 이미지, 문서, 바이너리 파일 등 다양한 데이터를 손쉽게 업로드할 수 있습니다.

## 결론

- 단순한 키-값 데이터 전송에는 `application/x-www-form-urlencoded`를 사용하세요.
- 파일 업로드나 복합 데이터 전송이 필요하다면 `multipart/form-data`를 선택하세요.
