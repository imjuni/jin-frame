---
outline: deep
---

# 진행 상태와 진단


`createFrames`, `createOpenapiTs`는 `onEvent` 옵션을 지원합니다. `load(path, { onEvent })`도 같은 관찰자를 전달받습니다. 관찰자가 없으면 이벤트를 출력하지 않습니다.

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

단계 이벤트는 시작·완료를 알립니다. 프레임 진행 수는 엔드포인트 프레임만 포함하고 기본 프레임과 보안 provider는 제외합니다. 진단 이벤트에는 `UNSUPPORTED_SECURITY_SCHEME` 같은 코드가 포함됩니다. 관찰자는 호출별로 동기 실행되며, 관찰자가 던진 오류는 호출자에게 전파됩니다. 실패한 작업은 완료 이벤트를 내보내지 않습니다. 생성 오류는 진단 이벤트가 아닌 예외로 전달됩니다.
