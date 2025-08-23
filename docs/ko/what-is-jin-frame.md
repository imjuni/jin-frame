# jin-frame이란?

**HTTP Request**를 **TypeScript Class**로 정의할 수 있도록 돕는 라이브러리입니다. 단순히 HTTP 요청을 정의하는 것에 그치지 않고, 실무 환경에서 자주 필요한 다양한 기능을 제공합니다. 예를 들어 Hook 정의, timeout 설정, 재시도 횟수 지정 등을 엔드포인트별로 다르게 설정할 수 있으며, 이 모든 것을 TypeScript Class를 기반으로 선언적으로 정의할 수 있습니다. 궁극적으로는 **API를 효율적으로 관리**하는 것이 목표입니다.

## 왜 jin-frame인가?

- 🎩 **선언적인 API 정의**  
  데코레이터와 클래스를 활용해 URL, Querystring, Path Param, Body, Header를 명확하고 직관적으로 정의할 수 있습니다.

- ⛑️ **타입 안정성**  
  TypeScript의 타입 시스템을 적극 활용하여, 타입 불일치는 컴파일 단계에서 바로 잡아낼 수 있습니다.

- 🎢 **Production-Ready 기능**  
  290개의 테스트 케이스로 신뢰성을 확보하였으며, MSA 환경에서 요구되는 retry, hook, file upload, mocking 기능을 지원합니다.

- 🏭 **Axios 생태계 활용**  
  Axios 위에 구축되어 있어 안정적인 생태계를 활용하면서 기능을 확장할 수 있습니다.

- 🎪 **Path Parameter 지원**  
  `example.com/:id`와 같은 path parameter를 타입 안정성을 보장하며 치환할 수 있습니다.

## 제공 기능

- **Retry 설정**  
  최대 횟수, 고정 간격, 점진적 간격 증가 등 다양한 재시도 정책을 구성할 수 있습니다.

- **Hook 지원**  
  요청 전/후, 재시도 시점에 Hook을 정의할 수 있습니다. 상속을 통해 전역 공통 Hook을 적용하거나 엔드포인트 단위로 별도로 적용할 수도 있습니다.

- **엔드포인트별 Timeout**  
  마이크로서비스 환경에서 엔드포인트마다 다른 timeout 값을 적용할 수 있습니다.

- **파일 업로드**  
  Axios 기반의 파일 업로드를 동일한 클래스 정의 방식으로 처리할 수 있습니다.

- **Mocking 지원**  
  테스트나 개발 환경에서 API 응답을 손쉽게 모킹할 수 있습니다.

- **확장성**  
  Frame 클래스는 상속이 가능해, 공통 로직을 확장하거나 재사용 가능한 구성 요소로 만들 수 있습니다.

## 사용 예시

기존 Axios를 직접 사용할 때와 jin-frame을 사용할 때의 비교 예시는 다음과 같습니다.

| Direct usage                           | Jin-Frame                                     |
| -------------------------------------- | --------------------------------------------- |
| ![axios](../assets/axios-usage.png)    | ![jin-frame](../assets/jinframe-usage.png)    |
| [axios svg](../assets/axios-usage.svg) | [jin-frame svg](../assets/jinframe-usage.svg) |

코드 양 자체는 비슷하지만, jin-frame은 **각 변수가 Querystring, Header, Body, Path Param 중 어디에 들어가는지 명확하게 보인다**는 점이 다릅니다. 또한 `of`라는 정적 팩토리 메서드를 통해 타입 안정성을 유지하면서 Request를 생성하고 실행할 수 있습니다.

추가로, 엔드포인트별로 timeout과 재시도 횟수를 다르게 설정할 수 있습니다. 이는 MSA 환경에서 여러 API 서버와 연결할 때 매우 자주 요구되는 패턴이며, jin-frame에서는 선언적으로 쉽게 설정할 수 있습니다.

```ts
@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon',
  timeout: 10_000, // 10초
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}

@Get({
  host: 'https://pokeapi.co',
  path: '/api/v2/pokemon/:name',
  timeout: 2_000, // 2초
  retry: { max: 3, inteval: 1000 }, // 1초 간격으로 3회 재시도
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

이러한 설정은 상속을 통해 재사용 가능하므로, 다양한 상황에 맞게 확장할 수 있습니다.

## 결론

jin-frame은 단순히 Axios를 감싸는 유틸리티가 아니라, **타입 안정성과 선언적 코드 스타일**, 그리고 **MSA 환경에 필요한 기능**을 결합한 HTTP Request 관리 라이브러리입니다. 이를 통해 개발자는 API 요청을 더욱 명확하고 체계적으로 정의할 수 있으며, 유지보수와 확장성 측면에서도 높은 생산성을 기대할 수 있습니다.

또한 이렇게 정의한 클래스를 하나의 패키지로 분리해 두면, 공통 API 요청 로직을 여러 프로젝트에서 재사용할 수도 있습니다. 즉, 팀 단위 혹은 조직 전체에서 동일한 규격의 API 호출 방식을 공유할 수 있어, **일관성과 재사용성**을 동시에 확보할 수 있습니다.
