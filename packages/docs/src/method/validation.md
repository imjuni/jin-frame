---
outline: deep
---

# Response validation

A single validator receives the whole response and selects a schema by status. The default getData() returns its input unchanged; validator() receives status and data together. `BaseValidator<Replies, TError>` uses the same { status, data } union as the frame.

## Selecting schemas by status

This example uses Zod, installed separately; jin-frame does not depend on a schema library. The validator decides what to do when a status such as 204 has no schema.

```ts
import { z } from 'zod';
import { BaseValidator, Get, JinFrame, Validator } from 'jin-frame';
import type { ValidationInput, ValidationResult } from 'jin-frame';

const userSchema = z.object({ name: z.string() });
const errorSchema = z.object({ message: z.string() });
type Replies =
  | { status: 200; data: z.infer<typeof userSchema> }
  | { status: 204; data: undefined }
  | { status: 404; data: z.infer<typeof errorSchema> }
  | { status: 500; data: z.infer<typeof errorSchema> };

const schemas: Partial<Record<Replies['status'], z.ZodType>> = {
  200: userSchema,
  404: errorSchema,
  500: errorSchema,
};

class ApiValidator extends BaseValidator<Replies, z.ZodIssue> {
  // Optional: the default implementation already returns the whole response.
  getData(response: ValidationInput<Replies>): ValidationInput<Replies> {
    return response;
  }

  validator(response: ValidationInput<Replies>): ValidationResult<z.ZodIssue> {
    const schema = schemas[response.status];
    if (schema === undefined) return { valid: true };
    const result = schema.safeParse(response.data);
    return result.success
      ? { valid: true }
      : { valid: false, error: result.error.issues };
  }
}

@Get({ host: 'https://api.example.com', path: '/user',
  validator: new ApiValidator({ type: 'value' }),
})
class UserFrame extends JinFrame<Replies> {}

const reply = await UserFrame.of({})._execute({ validateStatus: () => true });
if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

## Input and registration

`ValidationInput<Replies>` includes status, data, statusText, headers, raw, and ok, but no valid or $validated fields. Overrides of getData() must also return the whole response type; returning only the body would lose the relationship between status and data.

validator() supports synchronous or asynchronous results. TError types individual validator errors; frame response errors are exposed as unknown. Validation does not replace or transform the body. Type arguments do not prove that a server response is valid; check actual values with your schema.

```ts
@Validator<Replies>(new ApiValidator({ type: 'exception' }))
@Get({ host: 'https://api.example.com', path: '/user' })
class DecoratedFrame extends JinFrame<Replies> {}
```

Register using the validator method option or @Validator(). Existing decorator and inheritance precedence applies; validators are not combined.

## Failure policy

| HTTP acceptance | Validation | Result |
| --- | --- | --- |
| Accepted | Valid or no validator | Return response |
| Accepted | Invalid, value mode | Return response with valid: false |
| Accepted | Invalid, exception mode | JinValidationError |
| Rejected | Any validation result | JinRespError with response and validation result |

validateStatus decides HTTP acceptance only. The same validator runs for accepted and rejected responses and selects schemas internally. Without a registered validator, valid is true and $validated is { valid: true }, but rejected HTTP statuses still throw.

If getData() or validator() throws, JinRespError preserves the original cause and the actual HTTP status, body, headers, and raw response. This differs from returning { valid: false }. Network failures without an HTTP response still have resp === undefined.
