# Todo

## jin-frame

- [ ] Mocking (axios-mock-adapter를 사용하지 않고 자체 mock 제공)
  - 배열로 Mocking을 등록할 수 있다
  - 각 배열은 { url: string; params: self, reply: unknown } 형식으로 등록된다
    - params는 타입을 의미한다. 캐시가 매칭되는지 확인할 때 자신의 멤버 변수를 전달하면 그 값도 매칭한다
  - execute를 하거나 request를 실행했을 때 배열을 순회하면서 응답을 반환한다
- [ ] BigInt 타입(Long 타입) 직렬화 기능 추가
- [ ] endpoint, query를 사용해서 cache를 하는 기능을 둘 수 있을 듯
  - cache timeout을 계산해서 timeout이 지나면 또 실행, 그게 아니면 return
  - 캐시 관련 전략을 알아보자 swr처럼 stale-while-revalidate 을 할 수 있을까?
  - 캐시 관련 header도 알아보자
- [ ] 파일 업로드 등의 테스트를 할 수 있게 fastify로 간단한 서버를 작성해보자
- [x] 배열 괄호처리 1 fruit[]=apple&fruit[]=banana
- [x] 배열 괄호처리 2 fruit[1]=apple&fruit[2]=banana
- [x] Retry-After 헤더 처리
- [ ] 응답 결과에 대해서 validator 처리, 클래스 선언할 때 Method에 validator를 넣어두면 response 받은 후 자동 검증
  - zod, json-schema(ajv), etc ...
- [ ] 요청 디듀플/버스팅 방지
  - 동일 주소, 동일 조건으로 빠르게 수차례 요청한 경우 한 번에 응답
- [ ] 강력한 캐시 계층 (메모리/LRU)
- [ ] 업/다운로드 프로그레스 이벤트
- [ ] next.js에서 편리하게 사용하기 위해 Server Component 설정 후, Authorization 및 host를 변경할 수 있는 기능 추가

### 가능성 검토

- [ ] 강력한 캐시 계층 (IndexedDB/AsyncStorage)
- [ ] 인증 템플릿 (플러그인처럼 끼우기, 가능성 검진 필요함, node + browser 둘 다 가능한지, 그러기 위해서 어떻게 해야 하는지 검토 필요)
- [ ] 전송 어댑터 다중화 (Edge/Node/Deno/React Native, axios는 adapter를 받는 방향으로 하는데, 가능성 검토 필요, axios 하나로 충분해보이기는 함)
  - fetch 어댑터 인터페이스를 고정하고, 환경별 구현 주입:
  - Node: undici
  - Edge/Cloudflare: Web Fetch
  - RN: cross-fetch or whatwg-fetch polyfill
  - Deno: native fetch

### jin-frame generator

- Authorization 설정에 따라 jin-frame 생성
- server 숫자가 여러 개 일 경우 숫자만큼 BaseFrame 생성
  - BaseFrame 사용하지 않을 경우 올바르게 host, path 추가
