---
outline: deep
---

# Naming Convention

## Goal: Prevent Namespace Collisions

jin-frame works by extending a class and declaring fields on it:

```typescript
class FindPetFrame extends JinFrame {
  @Query()
  declare public readonly status: string;

  @Query()
  declare public readonly create: string; // 'create' could collide with a JinFrame method!
}
```

In real-world APIs it is perfectly natural to have fields named `timeout`, `retry`, `status`, `create`, or `request`. If any of these coincided with an instance method on `JinFrame`, the result would be silent, hard-to-debug misbehavior.

To eliminate this class of bugs entirely, jin-frame applies a consistent prefix strategy to all internal identifiers.

---

## Rules

### Rule 1 — Core Internal State: JavaScript Private Fields (`#`)

Fields that hold the frame's internal state are declared as [JavaScript private fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) (`#field`).

- Completely invisible outside the class — even subclasses cannot access them.
- Subclasses that need a value receive it through a `protected` getter exposed by `AbstractJinFrame`.

### Rule 2 — All Instance Methods: `_` Prefix

Every instance method — whether it is part of the public API, an internal helper, or an overridable hook — carries a `_` prefix.

- Eliminates any chance of a user-defined field name colliding with a framework method.
- No distinction is made between "public API" and "internal": if it is an instance method, it gets `_`.
- Hook methods follow the same rule: `_preHook`, `_postHook`, `_retryFail`, `_retryException`.

### Rule 3 — Static Methods: No Prefix

Static methods are called on the class itself (`MyFrame.of(...)`, `MyFrame.builder()`), so they can never collide with instance fields. No prefix is applied.

---

## Summary

| Pattern | Target | Accessible from subclass | Callable by user |
| ------- | ------ | ------------------------ | ---------------- |
| `#xxx`  | Core internal state | No | No |
| `_xxx`  | All instance methods & hooks | Yes | Yes |
| (none)  | Static methods | — | Yes |

```typescript
class MyFrame extends JinFrame<{ status: number; data: Result }> {
  // User-defined fields — any name, no prefix required
  @Query()
  declare public readonly retry: number; // safe — no collision with _retry internal

  @Query()
  declare public readonly timeout: string; // safe — no collision with #timeout internal

  // Override a hook — prefix is required by the convention
  protected override _preHook(req: JinRequestConfig): void {
    console.log(req.url);
  }
}

// Static factory — no prefix
const frame = MyFrame.of({ retry: 3, timeout: '5s' });

// Instance method call — _ prefix
await frame._execute();
```
