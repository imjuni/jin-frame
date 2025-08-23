---
outline: deep
---

# Body

`jin-frame`에서는 클래스 필드에 `@Body()` 데코레이터를 선언하면, 해당 필드 값이 **HTTP Request Body**에 직렬화되어 포함됩니다. 주로 `POST`, `PUT`, `PATCH` 요청에서 사용되며, JSON 직렬화를 기본으로 지원합니다.

## Quick Example

```ts
@Post({ host: 'https://api.example.com', path: '/users' })
export class CreateUserFrame extends JinFrame {
  @Body() declare readonly username: string;
  @Body() declare readonly age?: number;
  @Body() declare readonly tags?: string[];
  @Body() declare readonly isAdmin?: boolean;
}

// Execute
const frame = CreateUserFrame.of({ username: 'pikachu', age: 7, tags: ['red', 'blue'], isAdmin: false });
const reply = await frame.execute();

console.log(reply.config.data);
// { "username": "pikachu", "age": 7, "tags": ["red","blue"], "isAdmin": false }
```

## 구조 정의 방식

`@Body()`는 Body에 전달되는 객체를 **필드 단위로 분해하여 정의**합니다. 예를 들어 다음과 같은 타입이 있다고 가정해 보겠습니다.

```ts
interface IamBody {
  name: string;
  age: number;
}
```

이를 `@Body()`로 정의하면 다음과 같이 필드를 나누어 선언합니다.

## 차이점: Body vs ObjectBody

| 구분        | `@Body`                                  | `@ObjectBody`                                |
| ----------- | ---------------------------------------- | -------------------------------------------- |
| 선언 방식   | 각 필드를 개별적으로 정의                | 객체 전체를 단일 필드로 정의                 |
| 사용 예시   | `@Body() declare readonly name: string;` | `@ObjectBody() declare readonly user: User;` |
| 직렬화 결과 | 여러 필드가 병합되어 Body를 구성         | 필드에 선언한 객체를 그대로 Body로 직렬화    |
| 활용 상황   | 단순한 필드 위주의 API 요청              | DTO/인터페이스 전체를 한 번에 Body로 전달    |

## Supported Types & Serialization

`@Body()`가 지원하고 JSON 직렬화되는 타입:

| Type                 | Example value      | Serialized form                |
| -------------------- | ------------------ | ------------------------------ |
| `string`             | `'pikachu'`        | `"pikachu"`                    |
| `number`             | `2`                | `2`                            |
| `boolean`            | `true`             | `true`                         |
| `string[]`           | `['a','b']`        | `["a","b"]`                    |
| `number[]`           | `[1,2,4]`          | `[1,2,4]`                      |
| `object`             | `{ key: "value" }` | `{ "key": "value" }`           |
| `undefined` / `null` | `undefined`/`null` | **omitted** (키 자체가 생략됨) |

- `undefined` / `null` 값은 기본적으로 생략 처리됩니다.
- 배열, 객체도 그대로 JSON 변환됩니다.

```ts
@Post({ host: 'https://api.someapi.com', path: '/api/some/path' })
class PostFrameExample extends JinFrame {
  @Body()
  declare public readonly name: string;

  @Body()
  declare public readonly age: number;
}
```

즉, `IamBody`의 속성(`name`, `age`)을 각각의 `@Body` 데코레이터로 분리해 선언하는 방식입니다. 만약 하나의 필드로 `IamBody` 전체를 다루고 싶다면 `@Body` 대신 **`@ObjectBody`** 데코레이터를 사용하면 됩니다.

## Nested Objects

중첩된 객체도 직렬화 가능합니다.

```ts
@Post({ host: 'https://api.example.com', path: '/users' })
export class NestedBodyFrame extends JinFrame {
  @Body() declare readonly profile: { name: string; age: number };
  @Body() declare readonly settings?: { theme: string; notifications: boolean };
}

const reply = await NestedBodyFrame.of({
  profile: { name: 'pikachu', age: 7 },
  settings: { theme: 'dark', notifications: true },
}).execute();

// Body → { "profile": { "name": "pikachu", "age": 7 }, "settings": { "theme": "dark", "notifications": true } }
```

## Array Options

배열은 JSON 배열 형태로 직렬화됩니다.  
쿼리스트링과 달리 `comma`, `bitwise` 옵션은 필요하지 않습니다.

```ts
@Post({ host: 'https://api.example.com', path: '/batch' })
export class ArrayBodyFrame extends JinFrame {
  @Body() declare readonly ids: number[];
}

const reply = await ArrayBodyFrame.of({ ids: [1, 2, 3] }).execute();
// Body → { "ids": [1,2,3] }
```

## Optional Fields

값이 없으면 Body에서 해당 키는 **자동 생략**됩니다.

```ts
@Post({ host: 'https://api.example.com', path: '/users' })
export class OptionalBodyFrame extends JinFrame {
  @Body() declare readonly username: string;
  @Body() declare readonly nickname?: string;
}

const reply = await OptionalBodyFrame.of({ username: 'pikachu' }).execute();
// Body → { "username": "pikachu" }
```

## Combining with Params & Headers

```ts
@Post({ host: 'https://api.example.com', path: '/orgs/:orgId/users' })
export class CreateUserInOrgFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Header() declare readonly Authorization: string;
  @Body() declare readonly username: string;
  @Body() declare readonly age: number;
}

const reply = await CreateUserInOrgFrame.of({
  orgId: 'acme',
  Authorization: 'Bearer token',
  username: 'pikachu',
  age: 7,
}).execute();

// POST /orgs/acme/users
// Headers: { Authorization: "Bearer token" }
// Body: { "username": "pikachu", "age": 7 }
```

## Debugging Tip

요청 직전에 `frame.getData('body')`로 **최종 Body 데이터**를 확인할 수 있습니다.

```ts
const frame = CreateUserFrame.of({ username: 'pikachu', age: 7 });
const req = frame.request();

console.log(frame.getData('body')); // { username: 'pikachu', age: 7 }
console.log(req.data); // 최종 직렬화된 Body
```
