---
outline: deep
---

# Validation

Register validators by HTTP status. Missing validators produce `valid: true` and `$validated: { valid: true }`. `validateStatus` controls acceptance independently of validator selection.

## BaseValidator

```ts
import { BaseValidator, Get, JinFrame, Validator } from 'jin-frame';
import type { ValidationInput, ValidatorMap, ValidationResult } from 'jin-frame';

type Replies =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } };
type Success = Extract<Replies, { status: 200 }>;

class UserValidator extends BaseValidator<Success, string, string> {
  getData(reply: ValidationInput<Success>): string {
    return reply.data.name;
  }

  validator(name: string): ValidationResult<string> {
    return typeof name === 'string' && name.length > 0
      ? { valid: true }
      : { valid: false, error: ['missing name'] };
  }
}

const validators = {
  200: new UserValidator({ type: 'exception' }),
} satisfies ValidatorMap<Replies>;

@Get({ host: 'https://api.example.com', path: '/user', validators })
class UserFrame extends JinFrame<Replies> {}

const reply = await UserFrame.of({})._execute();
```

`BaseValidator<Response, TData, TError>` takes a `{ status, data }` response type. Implement both `getData()` to extract the validation input and `validator()` to check it synchronously or asynchronously. `ValidationInput` includes status, data, headers, raw, and ok, but no validation results. Type arguments do not prove that the server returned valid data; check actual values with your schema.

## Registration

```ts
@Validator<Replies>(validators)
@Get({ host: 'https://api.example.com', path: '/user' })
class ValidatedUserFrame extends JinFrame<Replies> {}
```

Import `Validator` for this example. Use `ValidatorMap<Replies>` or `@Validator<Replies>` to check status-specific input types. Existing decorator and inheritance precedence applies; maps are not merged by status.

## Failure policy

| HTTP acceptance | Validation | Result |
| --- | --- | --- |
| Accepted | Valid or no validator | Return response |
| Accepted | Invalid, value mode | Return response with valid: false |
| Accepted | Invalid, exception mode | JinValidationError |
| Rejected | Any validation result | JinRespError with response and validation result |

If extraction or validation throws, JinRespError retains the actual HTTP response and the original cause. Validation does not transform or replace response data.

## Validating 404 and 500 responses in value mode

This example accepts 404 and 500 responses and validates their bodies. Statuses sharing a body shape can reuse one validator class. Status 200 has no validator and therefore receives a valid result.

```ts
import { BaseValidator, Get, JinFrame, validateStatus } from 'jin-frame';
import type { ValidationInput, ValidationResult, ValidatorMap } from 'jin-frame';

type Responses =
  | { status: 200; data: { name: string } }
  | { status: 404; data: { message: string } }
  | { status: 500; data: { message: string } };
type ErrorResponse = Extract<Responses, { status: 404 | 500 }>;

class ErrorBodyValidator extends BaseValidator<ErrorResponse, unknown, string> {
  getData(reply: ValidationInput<ErrorResponse>): unknown {
    return reply.data;
  }

  validator(data: unknown): ValidationResult<string> {
    return typeof data === 'object' && data !== null &&
      'message' in data && typeof data.message === 'string'
      ? { valid: true }
      : { valid: false, error: ['message must be a string'] };
  }
}

const validators = {
  404: new ErrorBodyValidator({ type: 'value' }),
  500: new ErrorBodyValidator({ type: 'value' }),
} satisfies ValidatorMap<Responses>;

@Get({ host: 'https://api.example.com', path: '/user', validators })
class ApiFrame extends JinFrame<Responses> {}

const reply = await ApiFrame.of({})._execute({
  validateStatus: validateStatus(200, 404, 500),
});

if (!reply.$validated.valid) {
  console.error(reply.$validated.error);
}
```

`reply.valid` is a boolean summary. Narrow `reply.$validated.valid` before reading the error list. TError types the validator result itself; the frame exposes validation errors as unknown. Extracted values and schema parsing results do not replace response data.

## Exceptions and HTTP context

Exception mode applies when a validator returns `{ valid: false, error: [...] }`. Only accepted responses throw JinValidationError. Rejected 404 and 500 responses throw JinRespError regardless of validation success; inspect resp.$validated for the validation result. Missing validators do not make rejected HTTP statuses return normally.

Errors thrown by getData() or an asynchronous validator() are preserved in JinRespError.cause together with the received resp.status, resp.data, resp.headers, and resp.raw. Network failures without an HTTP response still have resp === undefined.
