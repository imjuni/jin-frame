---
outline: deep
---

# Factory and Builder

## of()

object로 field를 전달하거나 콜백으로 Builder를 설정합니다. 필수 공개 field가 없으면 첫 인자를 생략합니다. constructor 인자는 field 인자 뒤에 전달하며, field가 없으면 `undefined`를 자리표시자로 사용합니다.

```ts twoslash
import { Get, JinFrame, Param, Query } from 'jin-frame';

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
})
class UserFrame extends JinFrame {
  @Param()
  declare readonly id: string;

  @Query()
  declare readonly expand?: string;
}

// Optional fields do not gate build().
const user = UserFrame.builder().set('id', '123').build();
const same = UserFrame.of({ id: '123' });
const fromCallback = UserFrame.of((b) => b.set('id', '123'));

@Get({
  host: 'https://api.example.com',
  path: '/health',
})
class HealthFrame extends JinFrame {}

// No required public fields: an empty object is unnecessary.
const health = HealthFrame.of();
```

## Builder operations

| 메서드 | 동작 |
| --- | --- |
| `set(key, value)` | 공개 데이터 field를 선언된 type로 설정합니다. |
| `from(object)` | object의 열거 가능한 string 키 field를 복사합니다. |
| `auto()` | 호출 시점에 class default value를 Builder에 복사합니다. |
| `get()` | 스냅샷이 아닌 현재 상태의 읽기 전용 type 뷰를 반환합니다. |
| `build()` | 새 instance를 만들고 default value, Builder 값 순으로 병합합니다. |

메서드와 `_` 접두사 field는 제외됩니다. private·protected field는 공개 입력이 아닙니다. 선택 field는 `build()` 전에 설정하지 않아도 됩니다.

## Defaults and type guarantees

`of()`와 `build()` 모두 default value를 적용합니다. `auto()`는 default value를 Builder에 추가로 복사하므로 먼저 설정한 값을 덮어쓰며, 이후 `set()`이 우선합니다. `auto()`와 `build()`가 각각 default value 메서드를 호출하므로 두 메서드를 함께 쓸 때 부수 효과에 유의합니다.

호환성을 위해 `auto()`는 모든 field를 완료로 처리하고, `from()`은 선택적 입력 키도 추적하며, 콜백은 완전성을 검사하지 않습니다. 이 경로들은 런타임의 필수 값 존재를 보장하지 않습니다. 필요한 입력 검사는 별도로 수행합니다.

`get()`은 얕은 실시간 참조입니다. 이후 설정이 이전 조회 결과에도 반영됩니다. 생성된 프레임의 중첩 object 역시 참조를 공유하며 깊은 복사나 동결을 하지 않습니다.

## Constructor arguments

`UserFrame.of(fields, ...constructorArgs)` 또는 `UserFrame.builder(...constructorArgs)`로 전달합니다. field 없이 constructor 인자만 필요하면 `Frame.of(undefined, argument)`를 사용합니다. field 생략이 constructor 필수 인자까지 선택적으로 만들지는 않습니다.

[상속과 default value type](./inheritance)을 참고하세요.
