# Todo

## English

- [ ] Mocking (provide built-in mocking without using axios-mock-adapter)
  - Support registering mocks as an array
  - Each item: `{ url: string; params: self; reply: unknown }`
    - `params` is matched against the declared class member variables;  
      if they match, the cached mock response is returned  
  - When `execute` or `request` runs, it iterates through the array and returns the matching response
- [ ] Add BigInt (Long type) serialization support
- [ ] Add caching functionality using endpoint + query
  - Re-run request if cache timeout has expired, otherwise return cached result
  - Investigate cache strategies (e.g. stale-while-revalidate like SWR)
  - Explore cache-related headers

## Korean

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
