---
outline: deep
---

# Body

In **`jin-frame`**, when you declare a class field with the `@Body()` decorator, the field value is **serialized into the HTTP Request Body** and included in the request. It is mainly used for `POST`, `PUT`, and `PATCH` requests, with JSON serialization supported by default.

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

## Structure Definition

`@Body()` defines the body object **at the field level**. For example, consider the following type:

```ts
interface IamBody {
  name: string;
  age: number;
}
```

When using `@Body()`, you define fields separately as follows:

```ts
@Post({ host: 'https://api.someapi.com', path: '/api/some/path' })
class PostFrameExample extends JinFrame {
  @Body()
  declare public readonly name: string;

  @Body()
  declare public readonly age: number;
}
```

Here, the properties of `IamBody` (`name`, `age`) are declared individually with `@Body`. If you want to handle the entire object as a single field, you should use **`@ObjectBody`** instead.

## Body vs ObjectBody

| Aspect        | `@Body`                                  | `@ObjectBody`                                |
| ------------- | ---------------------------------------- | -------------------------------------------- |
| Declaration   | Define each field separately             | Define the whole object as a single field    |
| Example       | `@Body() declare readonly name: string;` | `@ObjectBody() declare readonly user: User;` |
| Serialization | Multiple fields merged into the Body     | Serializes the declared object as-is         |
| Use Cases     | Simple field-based API requests          | Pass DTOs or interfaces as the body directly |

## Supported Types & Serialization

Types supported by `@Body()` and their JSON-serialized forms:

| Type                 | Example value      | Serialized form               |
| -------------------- | ------------------ | ----------------------------- |
| `string`             | `'pikachu'`        | `"pikachu"`                   |
| `number`             | `2`                | `2`                           |
| `boolean`            | `true`             | `true`                        |
| `string[]`           | `['a','b']`        | `["a","b"]`                   |
| `number[]`           | `[1,2,4]`          | `[1,2,4]`                     |
| `object`             | `{ key: "value" }` | `{ "key": "value" }`          |
| `undefined` / `null` | `undefined`/`null` | **omitted** (key not created) |

- `undefined` / `null` values are omitted by default.
- Arrays and objects are serialized directly as JSON.

## Nested Objects

Nested objects are also supported.

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

Arrays are serialized as JSON arrays. Unlike query strings, there is no need for `comma` or `bitwise` options.

```ts
@Post({ host: 'https://api.example.com', path: '/batch' })
export class ArrayBodyFrame extends JinFrame {
  @Body() declare readonly ids: number[];
}

const reply = await ArrayBodyFrame.of({ ids: [1, 2, 3] }).execute();
// Body → { "ids": [1,2,3] }
```

## Optional Fields

If no value is provided, the key is **omitted from the body**.

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

Before sending a request, you can check the **final body data** using `frame.getData('body')`.

```ts
const frame = CreateUserFrame.of({ username: 'pikachu', age: 7 });
const req = frame.request();

console.log(frame.getData('body')); // { username: 'pikachu', age: 7 }
console.log(req.data); // Final serialized body
```
