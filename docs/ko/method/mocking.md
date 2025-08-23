---
outline: deep
---

# Mocking

`jin-frame`은 내부적으로 **Axios**를 사용합니다. 따라서 테스트 환경에서는 [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)를 그대로 활용할 수 있습니다.

이를 통해 실제 서버를 호출하지 않고도 **API 응답을 모킹(Mock)** 하여 개발 및 테스트를 진행할 수 있습니다.

## 간단한 예제

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// 기본 axios 인스턴스에 mock 어댑터를 연결
const mock = new MockAdapter(axios);

// /users 경로로 들어오는 모든 GET 요청을 모킹
// reply의 인자는 (status, data, headers)
mock.onGet('/users').reply(200, {
  users: [{ id: 1, name: 'John Smith' }],
});

// jin-frame 프레임 실행
const frame = UserFrame.of({ params: { searchText: 'John' } });
const reply = await frame.execute();

console.log(reply.data);
// { users: [{ id: 1, name: 'John Smith' }] }
```

## 특징

- **실제 서버 호출 불필요**  
  외부 API 서버가 준비되지 않은 상황에서도 요청/응답을 흉내 낼 수 있습니다.

- **테스트 코드 작성 용이**  
  특정 경로에 대해 원하는 상태 코드, 데이터, 헤더 등을 직접 지정할 수 있어 단위 테스트 및 통합 테스트 작성이 편리합니다.

- **jin-frame과 자연스럽게 통합**  
  jin-frame이 Axios를 기반으로 동작하기 때문에, 특별한 설정 없이 `axios-mock-adapter`만 연결하면 그대로 모킹이 가능합니다.

## 활용 시나리오

- 개발 단계에서 **외부 API 서버가 준비되지 않은 경우**
- QA 환경에서 **특정 케이스를 재현해야 하는 경우**
- CI/CD 파이프라인에서 **네트워크 의존성을 제거한 테스트 실행**

💡 `axios-mock-adapter`의 자세한 사용법은 [공식 문서](https://github.com/ctimmerm/axios-mock-adapter)를 참고하세요. jin-frame에서는 Axios 인스턴스를 그대로 사용하므로, 문서에 나와 있는 기능들을 동일하게 적용할 수 있습니다.
