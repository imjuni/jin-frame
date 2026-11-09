---
outline: deep
---

# Response validation with Zod

TypeScript describes a response but does not check data received from the server. A single validator receives the complete response and selects a schema using `status`.

```sh
pnpm add zod
```

## Status-specific schemas

The schema map below covers 200 and 404. The placeholder API must return those shapes; replace the host with your own service. Hover over the response and schema identifiers for their types.

```ts twoslash
import { z } from 'zod';
import { BaseValidator, Get, JinFrame, validateStatus } from 'jin-frame';
import type { ValidationInput, ValidationResult } from 'jin-frame';

const userSchema = z.object({ id: z.string(), name: z.string() });
const errorSchema = z.object({ message: z.string() });

type Replies =
  | { status: 200; data: z.infer<typeof userSchema> }
  | { status: 404; data: z.infer<typeof errorSchema> };

class UserValidator extends BaseValidator<Replies, string> {
  validator({ status, data }: ValidationInput<Replies>): ValidationResult<string> {
    // Choose the schema by HTTP status, including accepted error statuses.
    const schema = status === 200 ? userSchema : errorSchema;
    const result = schema.safeParse(data);

    // Convert Zod issues to the library's validation result contract.
    return result.success
      ? { valid: true }
      : { valid: false, error: result.error.issues.map((issue) => issue.message) };
  }
}

@Get({
  host: 'https://api.example.com',
  path: '/users/123',
  validator: new UserValidator({ type: 'value' }),
})
class UserFrame extends JinFrame<Replies> {}

// Accept 404 as a response while still validating its error-body schema.
const reply = await UserFrame.of()._execute({ validateStatus: validateStatus(200, 404) });
if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

## Failure policy

| HTTP status accepted? | Schema result | Outcome |
| --- | --- | --- |
| Yes | Valid or no validator | Return response. |
| Yes | Invalid, `value` mode | Return response with `valid: false` and `$validated.error`. |
| Yes | Invalid, `exception` mode | Throw `JinValidationError` with the response. |
| No | Either result | Throw `JinRespError` with response and validation result. |

Register with `validator: instance` or `@Validator(instance)`. Validators are not a per-status registration map; status selection belongs inside `validator()`. Without registration, validation is treated as successful.

## Complete response input

`ValidationInput<Replies>` includes `status`, `data`, `headers`, `raw`, and `ok`. `getData()` returns this complete input by default. If overriding it, preserve the whole response instead of extracting only the body. `ok` indicates the call's acceptance policy, not a schema match.

`validator()` can return a result or a Promise. Returning `{ valid: false, error: [...] }` is different from throwing: unexpected schema/deserialization exceptions are wrapped as `JinRespError` with `cause` and the available response.

Validation does not replace or transform `reply.data`. Zod coercions, defaults, and stripped keys in `result.data` are not automatically written back. Decide explicitly what to do for statuses without a schema, such as 204; an empty body has `data: undefined`.

See [status policies and errors](./responses).
