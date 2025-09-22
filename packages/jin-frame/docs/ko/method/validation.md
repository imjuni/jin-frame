---
outline: deep
---

# Validation

jin-frame의 **Validator**는 HTTP 응답 데이터를 검증하는 기능을 제공하는 클래스입니다. API 응답이 예상한 형태와 일치하는지 확인하고, 잘못된 데이터에 대해 적절한 처리를 할 수 있게 해줍니다.

## 기본 개념

### 검증 타입 (Validation Type)

Validator는 두 가지 검증 타입을 지원합니다:

- **`exception`**: 검증 실패 시 `JinValidationtError` 예외를 발생시킵니다
- **`value`**: 검증 실패 시 검증 결과를 응답 데이터에 포함시킵니다

### 검증 결과 (Validation Result)

```typescript
type TValidationResult<TError = unknown> = 
  | { valid: true }                    // 검증 성공
  | { valid: false; error: TError[] }  // 검증 실패
```

## 클래스 구조

```typescript
export class Validator<TOrigin = unknown, TData = TOrigin, TError = unknown> {
  constructor({ type }: { type: TValidationResultType })
  
  // 응답에서 검증할 데이터를 추출 (오버라이드 가능)
  getData(reply: TOrigin): TData
  
  // 실제 검증 로직 (오버라이드 필수)
  validator(data: TData): TValidationResult<TError> | Promise<TValidationResult<TError>>
  
  // 전체 검증 프로세스 실행
  validate(reply: TOrigin): Promise<TValidationResult<TError>>
}
```

### 제네릭 타입 매개변수

- **`TOrigin`**: 원본 응답 타입 (예: `AxiosResponse<UserData>`)
- **`TData`**: 검증할 데이터 타입 (예: `UserData`)  
- **`TError`**: 검증 실패 시 에러 타입 (예: `ZodIssue`)

## 사용 방법

### 기본 사용법

```typescript
import { Validator } from 'jin-frame';
import type { AxiosResponse } from 'axios';

class UserValidator extends Validator<
  AxiosResponse<UserData>,  // 원본 응답 타입
  UserData,                 // 검증할 데이터 타입
  ValidationError           // 에러 타입
> {
  constructor() {
    super({ type: 'exception' }); // 예외 발생 모드
  }

  // 응답에서 검증할 데이터 추출
  override getData(reply: AxiosResponse<UserData>): UserData {
    return reply.data;
  }

  // 실제 검증 로직 구현
  override validator(data: UserData): TValidationResult<ValidationError> {
    // Zod, Joi, 또는 커스텀 검증 로직
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

### JinFrame과 함께 사용

```typescript
@Validator(new UserValidator()) // 검증기 등록
@Post({
  host: 'https://api.example.com',
  path: '/users',
})
class CreateUserFrame extends JinFrame<UserData> {
  @Body()
  declare name: string;

  @Body() 
  declare email: string;
}
```

### Zod를 활용한 검증

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

## 검증 모드

### Exception 모드

```typescript
const validator = new UserValidator({ type: 'exception' });
```

- 검증 실패 시 `JinValidationtError` 예외 발생
- 애플리케이션 로직에서 try-catch로 처리
- **권장**: 대부분의 경우에 사용

### Value 모드  

```typescript
const validator = new UserValidator({ type: 'value' });
```

- 검증 실패 시 응답 객체에 검증 결과 포함
- 응답 객체의 `$validated` 속성에서 결과 확인
- **용도**: 검증 결과를 클라이언트에 전달해야 하는 경우

## 실제 사용 예제

```typescript
// 1. 검증기 정의
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

// 2. Frame에 적용
@Validator(new ProductValidator()) // 검증기 등록
@Get({
  host: 'https://api.shop.com',
  path: '/products/:id',
})
class GetProductFrame extends JinFrame<Product> {
  @Param()
  declare id: string;
}

// 3. 사용
try {
  const frame = GetProductFrame.of({ id: '123' });
  const response = await frame.execute();
  // 검증이 성공한 경우에만 여기 도달
  console.log('Valid product:', response.data);
} catch (error) {
  if (error instanceof JinValidationtError) {
    console.log('Validation failed:', error.validated);
  }
}
```

## 장점

### 타입 안전성

- TypeScript 제네릭으로 완전한 타입 추론
- 컴파일 타임에 타입 오류 감지

### 유연한 검증 로직  

- 어떤 검증 라이브러리든 사용 가능 (Zod, Joi, Yup 등)
- 커스텀 검증 로직 구현 가능

### 일관된 에러 처리

- 표준화된 검증 결과 형태
- 예외/값 반환 모드 선택 가능

### 프레임워크 통합

- JinFrame과 완벽 통합
- 데코레이터 패턴으로 간편한 설정

## 에러 처리

검증 실패 시 발생하는 `JinValidationtError`는 다음 정보를 포함합니다:

```typescript
interface JinValidationtError {
  message: string;                    // 에러 메시지
  validated: TValidationResult;       // 검증 결과
  validator: Validator;               // 사용된 검증기
  debug: IDebugInfo;                  // 디버그 정보
  frame: JinFrame;                    // 프레임 인스턴스
  resp: AxiosResponse;                // 응답 객체
}
```

이를 통해 검증 실패 원인을 상세히 분석할 수 있습니다.

---

Validator는 API 응답의 **데이터 무결성을 보장**하고 **예상치 못한 데이터로 인한 런타임 오류를 방지**하는 핵심 기능입니다. 특히 외부 API를 사용할 때 응답 형태가 변경되거나 예상과 다른 데이터가 올 경우를 대비할 수 있습니다.
