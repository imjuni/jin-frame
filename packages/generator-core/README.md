# JinFrame Generator Core

----

## Background

JinFrame를 생성하기 위해 필요한 코어 라이브러리.

## Server

서버를 어떻게 적용할 것인지를 정리한다. OpenAPI 문서에서 host는 다음과 같이 결정된다.

1. API endpoint에서 Server 섹션이 있는 경우 사용한다
   1. Server 섹션에 host가 없는 경우 3번에서 얻은 host를 사용한다
2. Document Server 섹션이 있는 경우 사용한다
   1. Server 섹션에 host가 없는 경우 3번에서 얻은 host를 사용한다
3. OpenAPI 스펙을 얻은 endpoint에서 host를 사용한다
