---
outline: deep
---

# Validation

The **Validator** in jin-frame is a class that provides functionality for validating HTTP response data. It ensures that API responses match the expected format and enables appropriate handling of invalid data.

## Basic Concepts

### Validation Types

Validator supports two validation types:

- **`exception`**: Throws a `JinValidationtError` exception when validation fails
- **`value`**: Includes validation results in the response data when validation fails

### Validation Result

```typescript
type TValidationResult<TError = unknown> = 
  | { valid: true }                    // Validation success
  | { valid: false; error: TError[] }  // Validation failure
```

## Class Structure

```typescript
export class Validator<TOrigin = unknown, TData = TOrigin, TError = unknown> {
  constructor({ type }: { type: TValidationResultType })
  
  // Extract data to validate from response (overridable)
  getData(reply: TOrigin): TData
  
  // Actual validation logic (must override)
  validator(data: TData): TValidationResult<TError> | Promise<TValidationResult<TError>>
  
  // Execute the entire validation process
  validate(reply: TOrigin): Promise<TValidationResult<TError>>
}
```

### Generic Type Parameters

- **`TOrigin`**: Original response type (e.g., `AxiosResponse<UserData>`)
- **`TData`**: Data type to validate (e.g., `UserData`)  
- **`TError`**: Error type for validation failures (e.g., `ZodIssue`)

## Usage

### Basic Usage

```typescript
import { Validator } from 'jin-frame';
import type { AxiosResponse } from 'axios';

class UserValidator extends Validator<
  AxiosResponse<UserData>,  // Original response type
  UserData,                 // Data type to validate
  ValidationError           // Error type
> {
  constructor() {
    super({ type: 'exception' }); // Exception mode
  }

  // Extract data to validate from response
  override getData(reply: AxiosResponse<UserData>): UserData {
    return reply.data;
  }

  // Implement actual validation logic
  override validator(data: UserData): TValidationResult<ValidationError> {
    // Zod, Joi, or custom validation logic
    const result = userSchema.safeParse(data);
    
    if (result.success) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      error: result.error.issues 
    };
  }
}
```

### Usage with JinFrame

```typescript
@Post({
  host: 'https://api.example.com',
  path: '/users',
  validator: new UserValidator(), // Register validator
})
class CreateUserFrame extends JinFrame<UserData> {
  @Body()
  declare name: string;

  @Body() 
  declare email: string;
}
```

### Validation with Zod

```typescript
import { z } from 'zod';

const messageSchema = z.object({
  message: z.string(),
  timestamp: z.number(),
});

class MessageValidator extends Validator<
  AxiosResponse<{ message: string; timestamp: number }>,
  { message: string; timestamp: number },
  z.ZodIssue
> {
  constructor() {
    super({ type: 'exception' });
  }

  override getData(reply: AxiosResponse<{ message: string; timestamp: number }>) {
    return reply.data;
  }

  override validator(data: { message: string; timestamp: number }) {
    const result = messageSchema.safeParse(data);
    
    if (result.success) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      error: result.error.issues 
    };
  }
}
```

## Validation Modes

### Exception Mode

```typescript
const validator = new UserValidator({ type: 'exception' });
```

- Throws `JinValidationtError` exception on validation failure
- Handle with try-catch in application logic
- **Recommended**: Use for most cases

### Value Mode  

```typescript
const validator = new UserValidator({ type: 'value' });
```

- Includes validation results in response object on validation failure
- Check results in the `$validated` property of response object
- **Use case**: When validation results need to be passed to client

## Real-world Example

```typescript
// 1. Define validator
class ProductValidator extends Validator<
  AxiosResponse<Product>,
  Product,
  ValidationError
> {
  constructor() {
    super({ type: 'exception' });
  }

  override getData(reply: AxiosResponse<Product>): Product {
    return reply.data;
  }

  override validator(product: Product): TValidationResult<ValidationError> {
    if (!product.id || product.price < 0) {
      return {
        valid: false,
        error: [{ message: 'Invalid product data' }]
      };
    }
    
    return { valid: true };
  }
}

// 2. Apply to Frame
@Get({
  host: 'https://api.shop.com',
  path: '/products/:id',
  validator: new ProductValidator(),
})
class GetProductFrame extends JinFrame<Product> {
  @Param()
  declare id: string;
}

// 3. Usage
try {
  const frame = GetProductFrame.of({ id: '123' });
  const response = await frame.execute();
  // Reaches here only if validation succeeds
  console.log('Valid product:', response.data);
} catch (error) {
  if (error instanceof JinValidationtError) {
    console.log('Validation failed:', error.validated);
  }
}
```

## Advantages

### Type Safety

- Complete type inference with TypeScript generics
- Compile-time type error detection

### Flexible Validation Logic  

- Use any validation library (Zod, Joi, Yup, etc.)
- Implement custom validation logic

### Consistent Error Handling

- Standardized validation result format
- Choose between exception/value return modes

### Framework Integration

- Perfect integration with JinFrame
- Simple configuration with decorator pattern

## Error Handling

The `JinValidationtError` thrown on validation failure includes the following information:

```typescript
interface JinValidationtError {
  message: string;                    // Error message
  validated: TValidationResult;       // Validation result
  validator: Validator;               // Used validator
  debug: IDebugInfo;                  // Debug information
  frame: JinFrame;                    // Frame instance
  resp: AxiosResponse;                // Response object
}
```

This allows detailed analysis of validation failure causes.

---

Validator is a core feature that **ensures data integrity of API responses** and **prevents runtime errors caused by unexpected data**. It's especially useful when using external APIs where response formats might change or unexpected data might be received.
