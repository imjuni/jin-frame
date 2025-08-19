# What is jin-frame?

**HTTP Reqest** = **TypeScript Class**

jin-frame은 HTTP Request를 TypeScript Class로 정의할 수 있게 돕는 라이브러리입니다. HTTP Request를 정의하는 것에 그치지 않고, 실무에 필요한 다양한 기능을 추가하였습니다. 예를들면 Hook 정의, timeout 설정, 재시도 횟수 등 다양한 추가 기능을 endpoint 별로 다르게 설정할 수 있습니다. 이런 추가 기능도 TypeScript Class를 사용하여 선언적으로 정의할 수 있습니다. 엔터프라이즈 환경에서 API를 효율적으로 관리하는 것이 목표입니다.

## Use Cases

Axios를 그냥 사용할 때와 jin-frame을 사용할 때 코드를 비교하면 다음과 같습니다.

| Direct usage                        | Jin-Frame                                  |
| ----------------------------------- | ------------------------------------------ |
| ![axios](assets/axios-usage.png)    | ![jin-frame](assets/jinframe-usage.png)    |
| [axios svg](assets/axios-usage.svg) | [jin-frame svg](assets/jinframe-usage.svg) |

직접 작성해야 하는 코드량은 비슷하지만 jin-frame 쪽이 좀 더 명확합니다. 각 변수가 Querystring, Header, Body, Path Param 어떤 곳에 추가 되는지 알 수 있고 static factory 함수인 of를 사용하여 type-safe 하게 HTTP Request를 생성하고 호출할 수 있습니다.

앞서 언급한 것과 같이 Endpoint 별로 timeout와 재시도 횟수를 다르게 설정할 수 있습니다. MSA 환경에서 다양한 API 서버와 연결하는데 Endpoint 별로 timeout과 재시도 횟수를 다르게 적용하는 것은 자주 발생하는 상황입니다. jin-frame은 다음과 같이 설정할 수 있습니다.

```ts
@Get({ 
  host: 'https://pokeapi.co',
  // 리스트 API
  path: '/api/v2/pokemon',
  // timeout 10초 설정
  timeout: 10_000,
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}

@Get({ 
  host: 'https://pokeapi.co',
  // 상세 API
  path: '/api/v2/pokemon/:name',
  // timeout 2초 설정
  timeout: 2_000,
  // 실패하는 경우 3회 재시도, 각 시도는 1초 간격으로 재시도
  retry: { max: 3, inteval: 1000 }
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

이러한 설정은 상속이 가능하며 부모 클래스 값을 자식 클래스가 덮어쓰게 됩니다. 덮어쓰기를 할 때는 빈 값은 무시됩니다.
