---
outline: deep
---

# Validation

`JinFrame` supports response validation through the `BaseValidator` class. Validators run after the HTTP response is received and populate `valid` and `$validated` on the response object. Pass and fail responses are validated **independently**.

## Concepts

### Pass vs Fail Validators

| Validator       | When it runs                       | Can throw `JinValidationError`? |
| --------------- | ---------------------------------- | -------------------------------- |
| `validators.pass` | When `validateStatus` returns `true`  | Yes — if `type: 'exception'`    |
| `validators.fail` | When `validateStatus` returns `false` | No — only sets `valid`/`$validated` |

Fail validators never throw `JinValidationError` because doing so would overwrite the original HTTP error.

### Validation Result Fields

Both `JinPassResp` and `JinFailResp` always carry these fields:

```ts
interface JinPassResp<T> {
  ok: true;
  data: T;
  valid: boolean;           // false until validator runs and passes
  $validated: ValidationResult;
}
```

When no validator is configured, `valid` defaults to `true`.

### Validation Types

- **`'exception'`** — throws `JinValidationError` on pass-path validation failure
- **`'value'`** — sets `valid: false` and populates `$validated.error`, does not throw

---

## BaseValidator

Extend `BaseValidator` to implement your validation logic. Override `getData()` to extract the slice of the response you want to validate, and `validator()` to run the actual check.

```ts
import { BaseValidator } from 'jin-frame';
import type { ValidationResult } from 'jin-frame';
import type { JinPassResp } from 'jin-frame';

class UserPassValidator extends BaseValidator<JinPassResp<User>, User, ZodIssue> {
  constructor() {
    super({ type: 'exception' });
  }

  // Extract the data to validate from the full response
  override getData(reply: JinPassResp<User>): User {
    return reply.data;
  }

  override validator(data: User): ValidationResult<ZodIssue> {
    const result = userSchema.safeParse(data);
    if (result.success) return { valid: true };
    return { valid: false, error: result.error.issues };
  }
}
```

### Generic Parameters

| Parameter | Description                                              |
| --------- | -------------------------------------------------------- |
| `TOrigin` | Full response type passed to `validate()` (e.g. `JinPassResp<User>`) |
| `TData`   | Slice extracted by `getData()` for actual validation     |
| `TError`  | Type of each item in `error[]` on failure                |

---

## Registering Validators

Pass validators through the `validators` option on the method decorator:

```ts
@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
  validators: {
    pass: new UserPassValidator(),
    fail: new UserFailValidator(), // optional
  },
})
class GetUserFrame extends JinFrame<User, ErrorBody> {
  @Param()
  declare public readonly id: string;
}
```

---

## Example: Zod Validation

```ts
import { z } from 'zod';
import { BaseValidator, Get, JinFrame } from 'jin-frame';
import type { JinPassResp, ValidationResult } from 'jin-frame';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

class UserValidator extends BaseValidator<JinPassResp<User>, User, z.ZodIssue> {
  constructor() {
    super({ type: 'exception' });
  }

  override getData(reply: JinPassResp<User>): User {
    return reply.data;
  }

  override validator(data: User): ValidationResult<z.ZodIssue> {
    const result = userSchema.safeParse(data);
    if (result.success) return { valid: true };
    return { valid: false, error: result.error.issues };
  }
}

@Get({
  host: 'https://api.example.com',
  path: '/users/{id}',
  validators: { pass: new UserValidator() },
})
class GetUserFrame extends JinFrame<User> {
  @Param()
  declare public readonly id: string;
}

try {
  const frame = GetUserFrame.of({ id: '123' });
  const reply = await frame._execute();
  console.log(reply.data); // User — validated
} catch (err) {
  if (err instanceof JinValidationError) {
    console.error(err.validated); // ZodIssue[]
  }
}
```

---

## Checking Validation Results Without Throwing

Use `type: 'value'` to receive validation results in the response instead of throwing:

```ts
class SoftValidator extends BaseValidator<JinPassResp<User>, User, string> {
  constructor() {
    super({ type: 'value' }); // does not throw
  }

  override getData(reply: JinPassResp<User>) { return reply.data; }

  override validator(data: User): ValidationResult<string> {
    if (!data.id) return { valid: false, error: ['missing id'] };
    return { valid: true };
  }
}

const reply = await frame._execute();
if (!reply.valid) {
  console.warn(reply.$validated.error);
}
```
