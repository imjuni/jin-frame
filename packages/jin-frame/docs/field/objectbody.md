---
outline: deep
---

# ObjectBody

In **`jin-frame`**, when you declare a class field with the `@ObjectBody()` decorator, the entire object is **serialized into the HTTP Request Body** and sent as-is. This is useful when you want to handle a whole object at once rather than splitting it into multiple `@Body()` fields.

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

## Difference: Body vs ObjectBody

| Category     | `@Body`                                  | `@ObjectBody`                                |
| ------------ | ---------------------------------------- | -------------------------------------------- |
| Declaration  | Define each field individually           | Define the entire object as a single field   |
| Usage        | `@Body() declare readonly name: string;` | `@ObjectBody() declare readonly user: User;` |
| Serialization| Multiple fields are merged into the body | The declared object is serialized as-is      |
| Use Case     | APIs focusing on simple fields           | Passing a full DTO/interface in one shot     |

## Nested Objects

`@ObjectBody()` also supports nested object structures and serializes them as-is.

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

Objects containing arrays are serialized as-is.

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

If a value inside the object is `undefined` or `null`, it is automatically omitted.

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

Right before sending the request, you can check the **final body data** with `frame.getData('body')`.

```ts
const frame = CreateUserFrame.of({ user: { username: 'pikachu', age: 7 } });
const req = frame.request();

console.log(frame.getData('body')); // { username: 'pikachu', age: 7 }
console.log(req.data); // Final serialized body
```
