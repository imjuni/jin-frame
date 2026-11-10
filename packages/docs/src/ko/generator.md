# OpenAPI Generator 1.0.0

`@jin-frame/generator-cli` 1.0.0은 Swagger/OpenAPI v2와 OpenAPI v3 문서에서 jin-frame 6.x 클라이언트를 생성합니다. Node.js >=22.23.4, TypeScript >= 6, openapi-typescript >= 7이 필요합니다.

타입 생성에는 [openapi-typescript](https://openapi-ts.dev/)를 사용합니다. jin-frame은 여기서 생성된 TypeScript 타입 정의를 활용해 요청 파라미터와 실행 설정을 갖춘 엔드포인트 클래스를 생성합니다.

```sh
pnpm add jin-frame@^6.0.0
pnpm add -D @jin-frame/generator-cli@^1.0.0 openapi-typescript typescript@^6
pnpm exec frame-cli create ./openapi.yml --output ./generated
```

`create`는 type와 프레임을 함께 생성합니다. `frame`은 기존 TypeScript type 정의로 프레임을 생성합니다. `template-eject`는 사용자 정의를 위한 기본 Eta 템플릿을 내보냅니다. 명령별 option은 `pnpm exec frame-cli <command> --help`로 확인합니다.

CLI는 `frame-cli`라는 ESM 실행 파일을 배포합니다. 코드에서 생성기를 직접 호출하려면 ESM 라이브러리와 TypeScript 선언을 제공하는 `@jin-frame/generator-core@^1.0.0`을 설치합니다.

- [CLI 명령과 설정](https://github.com/imjuni/jin-frame/blob/master/packages/generator-cli/README.ko.md)
- [Core API와 사용자 정의 템플릿](https://github.com/imjuni/jin-frame/blob/master/packages/generator-core/README.ko.md)
- [response union과 마이그레이션](./migration-v6)


## Package guides

- [CLI 설치](./generator-cli/) · [명령어](./generator-cli/commands) · [설정](./generator-cli/configuration)
- [Core 설치](./generator-core/) · [파이프라인](./generator-core/pipeline) · [설정](./generator-core/configuration) · [진단](./generator-core/diagnostics)
