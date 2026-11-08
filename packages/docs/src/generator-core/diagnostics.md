---
outline: deep
---

# Progress and diagnostics


`createFrames` and `createOpenapiTs` accept an optional `onEvent` option.
`load(path, { onEvent })` accepts the same observer in its second argument.
Without an observer these functions produce no event output.

```ts
await createFrames({
  ...options,
  onEvent(event) {
    if (event.type === "progress") {
      console.log(event.completed, event.total);
    }
  },
});
```

Stage events report `started` and `completed`. Frame progress counts endpoint
frames, excluding the base frame and security providers. Diagnostic events carry
stable codes such as `UNSUPPORTED_SECURITY_SCHEME`; external authentication
providers can be configured separately. Observers are synchronous and scoped to
each invocation. Exceptions thrown by observers propagate to the caller, and
failed operations do not emit a completed event. Generation errors remain
exceptions rather than diagnostic events.
