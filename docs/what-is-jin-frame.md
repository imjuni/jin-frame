# What is jin-frame?

**HTTP Request** = **TypeScript Class**

**jin-frame** is a library that allows you to define HTTP requests as TypeScript classes.  
It not only helps with defining requests but also provides practical features often required in real-world applications. For example, you can configure hooks, timeouts, retries, and more — with the flexibility to set different options per endpoint.  
All these configurations can also be defined declaratively using TypeScript classes. The goal is to enable efficient API management in enterprise environments.

---

## Why jin-frame?

- **Declarative API Definition**  
  Define requests using classes and decorators for URL, query string, path parameters, body, and headers in a clear and intuitive way.  

- **Type-Safe**  
  Fully powered by the TypeScript type system, mismatches are caught at compile time.  

- **Production-Ready Features**  
  Provides retry, hooks, file upload, and mocking support — features frequently required in real-world projects.  

- **Axios Ecosystem**  
  Built on top of Axios, leveraging its proven ecosystem while extending its capabilities.  

- **Path Parameter Support**  
  Replace path parameters like `example.com/:id` with strongly typed values.  

---

## Features

- **Retry Configuration**  
  Flexible retry policies, including maximum attempts, fixed intervals, or dynamic intervals that grow with each attempt.  

- **Hook Support**  
  Define hooks before requests, after responses, or during retries. Apply them globally via inheritance or locally per request.  

- **Timeouts per Endpoint**  
  Configure different timeout values per endpoint for fine-grained control in microservices environments.  

- **File Upload**  
  Built-in support for file upload via Axios under the same class-based request definitions.  

- **Mocking Support**  
  Easily mock API responses for testing and development environments.  

- **Extensible**  
  Frame classes can be inherited, making it easy to extend configurations and create reusable building blocks.  

---

## Use Cases

Below is a comparison between using Axios directly and using jin-frame:

| Direct usage                        | Jin-Frame                                  |
| ----------------------------------- | ------------------------------------------ |
| ![axios](assets/axios-usage.png)    | ![jin-frame](assets/jinframe-usage.png)    |
| [axios svg](assets/axios-usage.svg) | [jin-frame svg](assets/jinframe-usage.svg) |

While the overall amount of code is similar, **jin-frame provides greater clarity**.  
You can easily see which variables belong to the query string, headers, body, or path parameters.  
Additionally, by using the static factory function `of`, you can safely and type-check your request creation and execution.

As mentioned earlier, timeouts and retry counts can be configured on a per-endpoint basis.  
In microservices (MSA) environments, where multiple APIs must be called, configuring timeouts and retry logic differently per endpoint is a common need.  
With **jin-frame**, this can be done declaratively:

```ts
@Get({ 
  host: 'https://pokeapi.co',
  // List API
  path: '/api/v2/pokemon',
  // 10s timeout
  timeout: 10_000,
})
class PokemonPagingFrame extends JinFrame {
  @Query()
  declare readonly limit: number;

  @Query()
  declare readonly offset: number;
}
```

```ts
@Get({ 
  host: 'https://pokeapi.co',
  // Detail API
  path: '/api/v2/pokemon/:name',
  // 2s timeout
  timeout: 2_000,
  // Retry up to 3 times, with 1s interval
  retry: { max: 3, inteval: 1000 }
})
export class PokemonFrame extends JinFrame {
  @Param()
  declare public readonly name: string;

  @Query()
  declare public readonly tid: string;
}
```

These configurations are also extensible — Frame classes can be inherited and expanded to fit a variety of use cases.
