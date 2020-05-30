# jin-frame
Repeatable HTTP request definitation library

jin-frame은 HTTP 요청을 반복적으로 보낼 때 실수를 방지하기 위한 최고의 도구입니다. AWS 또는 Azure를 사용하거나 MSA 아키텍처 기반에서 개발을 진행할 때 다양한 목적으로 동일한 API를 반복해서 호출합니다. 이러한 반복적인 HTTP 요청은 대부분 실수 없이 처리되지만 여러 곳에서 이런 반복이 일어나면 실수가 발생할 확률은 더 높아집니다. jin-frame은 RAII를 클래스 생성자에 위임하는 것에 영감을 받아 개발되었습니다. HTTP 요청을 생성자와 클래스 형식으로 제한하여 실수를 줄이고 반복적인 요청을 간소화 시킵니다.

## Why jin-frame?
MSA 아키텍처에서 개발하거나 OpenAPI를 사용하는 경우, 여러 API를 조합해서 API를 만들어내는 작업을 많이 하게 됩니다. 반복되는 HTTP request 요청을 실수를 하기 쉽습니다. JinFrame은 HTTP 요청을 클래스 선언에 포함시켜 실수를 줄이고 반복적인 HTTP 요청을 구체화 하는 방법을 간단하게 만듭니다. 또한 생성자 행동의 일부라서 TypeScript가 오류를 미리 탐지 할 수 있습니다. JinFrame의 장점을 정리하면 다음과 같습니다.

1. 생성자 정의를 사용하여 TypesScript 가 오류를 미리 탐지
1. 생성자에 HTTP 요청을 정의해서 반복되는 HTTP 요청을 자동화
1. 다양한 axios 에코 시스템과 결합

# Requirement
1. TypeScript
1. Decorator

# Useage
jin-frame은 [axios](https://github.com/axios/axios)를 사용하여 동작합니다. 아래는 jin-frame을 사용한 예제입니다. 

```ts
class TestPostQuery extends JinFrame {
  @JinFrame.param()
  public readonly passing: string;
  
  @JinFrame.body({ key: 'test.hello.marvel.name' })
  public readonly name: string;

  @JinFrame.header({ key: 'test.hello.marvel.skill' })
  public readonly skill: string;
  
  @JinFrame.body({ key: 'test.hello.marvel.gender' })
  public readonly gender: string;

  constructor(name: string, skill: string) {
    super({ host: 'http://some.api.yanolja.com/jinframe/:passing', method: 'POST' });

    this.passing = 'pass';
    this.name = name;
    this.skill = skill;
    this.gender = 'male';
  }
}
```

이 클래스는 다음과 같은 axios 요청을 생성합니다.

```ts
const query = new TestPostQuery('ironman', 'beam');
console.log(query.request());
```

```js
{
  timeout: 2000,
  headers: { test: { hello: { marvel: { skill: 'beam' } } }, 'Content-Type': 'application/json' },
  method: 'POST',
  data: { test: { hello: { marvel: { name: 'ironman', gender: 'male' } } } },
  transformRequest: undefined,
  url: 'http://some.api.yanolja.com/jinframe/pass',
  validateStatus: () => true
}
```

이름이나 스킬을 변경하더라도 일정하게 요청 객체가 생성됩니다. timeout, transformRequest, validateStatus 등 다양한 부분을 자동으로 생성하며 실수하기 쉬운 data, headers 에서 depth 역시 올바르게 생성합니다. 이 객체를 여러 번 생성하더라도 JinFrame은 실수를 하지 않고 언제나 올바른 객체를 생성할 것입니다.

실행하는 과정도 단순합니다. 요청을 보내는 함수를 생성하고 실행하면 나머지 작업은 모두 JinFrame이 작업합니다. 물론 이 과정은 모두 axios를 사용하기 때문에 브라우저에서도 잘 동작합니다.

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.createWithoutEither();

const res = await requester();
```

만약 easy-fp를 사용한다면 다음과 같이 할 수 있습니다. 

```ts
const query = new TestPostQuery('ironman', 'beam');
const requester = query.create();

const res = await requester();

if (isFail(res)) {
  // failover action
}
```

# Arguments
## create function
* timeout?: number
    * request timeout, milliseconds
* userAgent?: string;
    * custom user-agent string
* validateStatus?: AxiosRequestConfig['validateStatus'];
    * validateStatus function. See validateStatus description in [request config](https://github.com/axios/axios#request-config)