---
outline: deep
---

# ObjectBody

`jin-frame`에서는 클래스 필드에 `@ObjectBody()` 데코레이터를 선언하면, 객체 전체를 **HTTP Request Body**로 직렬화하여 전송할 수 있습니다. 이는 여러 필드를 각각 `@Body()`로 분리하지 않고, 하나의 객체 단위로 관리하고 싶을 때 유용합니다.

## Quick Example

```ts
interface IUser {
  username: string;
  age?: number;
  tags?: string[];
  isAdmin?: boolean;
}

@Post({ host: 'https://api.example.com', path: '/users' })
export class CreateUserFrame extends JinFrame {
  @ObjectBody() declare readonly user: IUser;
}

// Execute
const frame = CreateUserFrame.of({
  user: { username: 'pikachu', age: 7, tags: ['red', 'blue'], isAdmin: false },
});
const reply = await frame.execute();

console.log(reply.config.data);
// { "username": "pikachu", "age": 7, "tags": ["red","blue"], "isAdmin": false }
```

## 차이점: Body vs ObjectBody

| 구분        | `@Body`                                  | `@ObjectBody`                                |
| ----------- | ---------------------------------------- | -------------------------------------------- |
| 선언 방식   | 각 필드를 개별적으로 정의                | 객체 전체를 단일 필드로 정의                 |
| 사용 예시   | `@Body() declare readonly name: string;` | `@ObjectBody() declare readonly user: User;` |
| 직렬화 결과 | 여러 필드가 병합되어 Body를 구성         | 필드에 선언한 객체를 그대로 Body로 직렬화    |
| 활용 상황   | 단순한 필드 위주의 API 요청              | DTO/인터페이스 전체를 한 번에 Body로 전달    |

## Nested Objects

`@ObjectBody()`는 중첩 객체를 포함한 구조도 그대로 직렬화합니다.

```ts
interface IProfile {
  name: string;
  age: number;
}

interface IUserSettings {
  theme: string;
  notifications: boolean;
}

interface IUser {
  profile: IProfile;
  settings?: IUserSettings;
}

@Post({ host: 'https://api.example.com', path: '/users' })
export class NestedUserFrame extends JinFrame {
  @ObjectBody() declare readonly user: IUser;
}

const reply = await NestedUserFrame.of({
  user: {
    profile: { name: 'pikachu', age: 7 },
    settings: { theme: 'dark', notifications: true },
  },
}).execute();

// Body → { "profile": { "name": "pikachu", "age": 7 }, "settings": { "theme": "dark", "notifications": true } }
```

---

## Array Support

배열을 포함한 객체도 그대로 직렬화됩니다.

```ts
interface IBatch {
  ids: number[];
}

@Post({ host: 'https://api.example.com', path: '/batch' })
export class BatchFrame extends JinFrame {
  @ObjectBody() declare readonly data: IBatch;
}

const reply = await BatchFrame.of({ data: { ids: [1, 2, 3] } }).execute();
// Body → { "ids": [1,2,3] }
```

## Optional Fields

객체 내부의 값이 `undefined` 또는 `null`이면 자동으로 생략됩니다.

```ts
interface IUser {
  username: string;
  nickname?: string;
}

@Post({ host: 'https://api.example.com', path: '/users' })
export class OptionalUserFrame extends JinFrame {
  @ObjectBody() declare readonly user: IUser;
}

const reply = await OptionalUserFrame.of({ user: { username: 'pikachu' } }).execute();
// Body → { "username": "pikachu" }
```

## Combining with Params & Headers

```ts
interface IUser {
  username: string;
  age: number;
}

@Post({ host: 'https://api.example.com', path: '/orgs/:orgId/users' })
export class CreateUserInOrgFrame extends JinFrame {
  @Param() declare readonly orgId: string;
  @Header() declare readonly Authorization: string;
  @ObjectBody() declare readonly user: IUser;
}

const reply = await CreateUserInOrgFrame.of({
  orgId: 'acme',
  Authorization: 'Bearer token',
  user: { username: 'pikachu', age: 7 },
}).execute();

// POST /orgs/acme/users
// Headers: { Authorization: "Bearer token" }
// Body: { "username": "pikachu", "age": 7 }
```

## Debugging Tip

요청 직전에 `frame.getData('body')`로 **최종 Body 데이터**를 확인할 수 있습니다.

```ts
const frame = CreateUserFrame.of({ user: { username: 'pikachu', age: 7 } });
const req = frame.request();

console.log(frame.getData('body')); // { username: 'pikachu', age: 7 }
console.log(req.data); // 최종 직렬화된 Body
```
