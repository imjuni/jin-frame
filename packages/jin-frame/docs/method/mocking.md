---
outline: deep
---

# Mocking

**`jin-frame`** internally uses **Axios**. Therefore, in test environments, you can directly use [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

This allows you to **mock API responses** without calling a real server, making development and testing much easier.

## Simple Example

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Attach the mock adapter to the default axios instance
const mock = new MockAdapter(axios);

// Mock all GET requests to /users
// Arguments for reply are (status, data, headers)
mock.onGet('/users').reply(200, {
  users: [{ id: 1, name: 'John Smith' }],
});

// Execute a jin-frame class
const frame = UserFrame.of({ params: { searchText: 'John' } });
const reply = await frame.execute();

console.log(reply.data);
// { users: [{ id: 1, name: 'John Smith' }] }
```

## Key Features

- **No real server required**  
  You can simulate request/response cycles even when the external API server is not available.

- **Easy test code authoring**  
  You can specify status codes, response data, and headers for given routes, making it simple to write unit and integration tests.

- **Seamless jin-frame integration**  
  Since jin-frame is built on top of Axios, you only need to attach `axios-mock-adapter`—no additional setup required.

## Use Cases

- During development, when an **external API server is not yet available**  
- In QA environments, when you need to **reproduce specific scenarios**  
- In CI/CD pipelines, when running tests that **remove network dependencies**

💡 For more details, refer to the [official axios-mock-adapter documentation](https://github.com/ctimmerm/axios-mock-adapter).  
Since jin-frame uses Axios directly, all the features described in that documentation can be applied without modification.
