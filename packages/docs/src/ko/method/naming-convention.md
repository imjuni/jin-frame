---
outline: deep
---

# Naming conventions

instance의 프레임워크 메서드는 `_`로 시작하므로 API field에 일반적인 이름을 사용할 수 있습니다. 정적 생성 메서드는 `of()`와 `builder()`입니다.

| 메서드 | 역할 |
| --- | --- |
| `Frame.of()` / `Frame.of(fields)` | 전송 없이 instance 생성 |
| `Frame.builder()` | 공개 field를 type에 맞게 설정 |
| `_request()` | 동기로 request 설정 구성 |
| `_create()` | 실행 function 반환 |
| `_execute()` | 비동기 인증값 해석과 전송 |
| `_preHook`, `_postHook` | 생명주기 오버라이드 |
| `_getOption`, `_getData` | 설정·수집 상태 검사 |

## Public field names

메서드·private/protected field·`_` 접두사 field는 Factory와 Builder 입력에서 제외합니다. 전송 이름과 다르면 `replaceAt`으로 매핑합니다. 생성 코드의 프레임워크 메서드를 임의로 바꾸지 않습니다.

## Older examples

현재 예제는 네이티브 fetch, `_execute()`, 상태·body response 유니온 하나를 사용합니다. `execute()`와 Either 결과 처리는 마이그레이션 기록에만 남깁니다. [마이그레이션](../migration-v6)을 참고하세요.
