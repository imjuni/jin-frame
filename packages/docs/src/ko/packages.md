# 패키지 문서

세 패키지의 설치와 사용법을 한 사이트에서 제공합니다.

| 패키지 | 버전 | 역할 | 문서 |
| --- | --- | --- | --- |
| `jin-frame` | 6.0.0 | 생성되거나 직접 작성한 HTTP 요청 실행 | [시작하기](./getting-to-start) |
| `@jin-frame/generator-cli` | 1.0.0 | OpenAPI에서 명령으로 타입과 프레임 생성 | [CLI 안내](./generator-cli/) |
| `@jin-frame/generator-core` | 1.0.0 | 코드에서 생성 파이프라인 구성 | [Core 안내](./generator-core/) |

직접 요청 클래스를 작성한다면 jin-frame부터 시작합니다. OpenAPI 명세가 있다면 CLI를 사용하고, 자체 빌드 도구에 통합하려면 core를 사용합니다. 생성기는 개발 시 실행하고 생성된 코드는 런타임에서 jin-frame을 사용합니다.

[6.0 마이그레이션](./migration-v6) · [생성기 개요](./generator)
