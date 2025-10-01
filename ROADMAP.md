# Roadmap

## jin-frame

- [ ] Mocking (Provide built-in mock functionality without using axios-mock-adapter)
  - Support registering mocks as an array
  - Each array element follows the format: { url: string; params: self, reply: unknown }
    - params refers to the type. When checking cache matches, passing member variables will also match those values
  - When executing or making requests, iterate through the array to return responses
- [ ] Add BigInt type (Long type) serialization functionality
- [ ] Implement caching functionality using endpoint and query
  - Calculate cache timeout and re-execute when timeout expires, otherwise return cached result
  - Explore cache strategies like stale-while-revalidate (similar to SWR)
  - Research cache-related headers
- [ ] Create a simple server with fastify for testing file uploads and other features
- [x] Array bracket handling 1: fruit[]=apple&fruit[]=banana
- [x] Array bracket handling 2: fruit[1]=apple&fruit[2]=banana
- [x] Retry-After header processing
- [x] Response validation processing - automatically validate responses when validators are added to methods during class declaration
  - Support for zod, json-schema (ajv), etc.
- [x] Request deduplication/burst prevention
  - Single response for multiple rapid requests to the same address with identical conditions
- [ ] Powerful cache layer (memory/LRU)
- [ ] Upload/download progress events
- [ ] Add functionality to change Authorization and host after Server Component configuration for convenient use in Next.js

### Feasibility Study

- [ ] Powerful cache layer (IndexedDB/AsyncStorage)
- [ ] Authentication templates (plugin-like integration, feasibility assessment needed for both node + browser compatibility)
- [ ] Multi-transport adapters (Edge/Node/Deno/React Native, axios uses adapter approach, feasibility study needed, though axios alone seems sufficient)
  - Fix fetch adapter interface and inject environment-specific implementations:
  - Node: undici
  - Edge/Cloudflare: Web Fetch
  - RN: cross-fetch or whatwg-fetch polyfill
  - Deno: native fetch

### jin-frame generator

- Generate jin-frame based on Authorization configuration
- Generate multiple BaseFrames when there are multiple servers
  - Properly add host and path when BaseFrame is not used
