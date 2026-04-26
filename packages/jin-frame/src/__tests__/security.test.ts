import { JinFrame } from '#frames/JinFrame';
import { Get } from '#decorators/methods/Get';
import { Post } from '#decorators/methods/Post';
import { Query } from '#decorators/fields/Query';
import { Body } from '#decorators/fields/Body';
import { Param } from '#decorators/fields/Param';
import { BearerTokenProvider } from '#providers/security/BearerTokenProvider';
import { ApiKeyProvider } from '#providers/security/ApiKeyProvider';
import { BasicAuthProvider } from '#providers/security/BasicAuthProvider';
import { Security } from '#decorators/methods/options/Security';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Bearer Token Authentication Frame — static string key
@Security(new BearerTokenProvider(), 'user-token-12345')
@Get({ host: 'http://api.example.com/user/{id}' })
class UserProfileFrame extends JinFrame {
  @Param()
  declare public readonly id: string;

  constructor() {
    super();
    this.id = 'user123';
  }
}

// API Key in Header Authentication Frame — key via @Security second arg
@Security(new ApiKeyProvider('api-key', 'X-API-Key', 'header'), 'secret-api-key-value')
@Get({ host: 'http://api.example.com/data' })
class DataFrame extends JinFrame {
  @Query()
  declare public readonly filter: string;

  constructor() {
    super();
    this.filter = 'active';
  }
}

// API Key in Query Authentication Frame — key via FrameOption
@Get({
  host: 'http://api.example.com/search',
  security: new ApiKeyProvider('api_key', 'key', 'query'),
  authorization: 'query-api-key-123',
})
class SearchFrame extends JinFrame {
  @Query()
  declare public readonly q: string;

  constructor() {
    super();
    this.q = 'test query';
  }
}

// Basic Authentication Frame — complex auth object via FrameOption
@Post({
  host: 'http://api.example.com/admin/users',
  security: new BasicAuthProvider(),
  authorization: { username: 'admin', password: 'secret123' },
})
class AdminUserFrame extends JinFrame {
  @Body()
  declare public readonly userData: { name: string; email: string };

  constructor() {
    super();
    this.userData = { name: 'John Doe', email: 'john@example.com' };
  }
}

// Bearer Token with BearerProvider — using FrameOption authorization
@Get({
  host: 'http://api.example.com/oauth/profile',
  security: new BearerTokenProvider('bearer'),
  authorization: 'oauth-access-token-xyz',
})
class BearerProfileFrame extends JinFrame {}

// Multiple Security Providers Frame
@Security([new BearerTokenProvider(), new ApiKeyProvider('client-id', 'X-Client-ID', 'header')], 'multi-auth-token')
@Get({ host: 'http://api.example.com/secure' })
class MultiSecurityFrame extends JinFrame {}

// Dynamic Authorization Override Frame
@Get({
  host: 'http://api.example.com/dynamic',
  security: new BearerTokenProvider(),
  authorization: 'default-token',
})
class DynamicAuthFrame extends JinFrame {}

const server = setupServer(
  http.get('http://api.example.com/user/:id', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer user-token-12345') {
      return HttpResponse.json({ id: 'user123', name: 'Test User' });
    }
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),

  http.get('http://api.example.com/data', ({ request }) => {
    const apiKey = request.headers.get('X-API-Key');
    const filter = new URL(request.url).searchParams.get('filter');
    if (apiKey === 'secret-api-key-value') {
      return HttpResponse.json({ data: 'secure data', filter });
    }
    return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
  }),

  http.get('http://api.example.com/search', ({ request }) => {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('key');
    const query = url.searchParams.get('q');
    if (apiKey === 'query-api-key-123') {
      return HttpResponse.json({ results: ['result1', 'result2'], query });
    }
    return HttpResponse.json({ error: 'Invalid API key' }, { status: 403 });
  }),

  http.post('http://api.example.com/admin/users', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    // Basic YWRtaW46c2VjcmV0MTIz is base64 for 'admin:secret123'
    if (authHeader === 'Basic YWRtaW46c2VjcmV0MTIz') {
      return HttpResponse.json({ success: true, message: 'User created' });
    }
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),

  http.get('http://api.example.com/oauth/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer oauth-access-token-xyz') {
      return HttpResponse.json({ profile: 'oauth user profile' });
    }
    return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
  }),

  http.get('http://api.example.com/secure', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const clientId = request.headers.get('X-Client-ID');
    if (authHeader === 'Bearer multi-auth-token' && clientId === 'multi-auth-token') {
      return HttpResponse.json({ secure: 'multi-auth data' });
    }
    return HttpResponse.json({ error: 'Multi-auth failed' }, { status: 401 });
  }),

  http.get('http://api.example.com/dynamic', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (authHeader === 'Bearer dynamic-override-token') {
      return HttpResponse.json({ message: 'Dynamic auth successful' });
    }
    if (authHeader === 'Bearer default-token') {
      return HttpResponse.json({ message: 'Default auth successful' });
    }
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }),
);

describe('Security Integration Tests', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it('should authenticate with Bearer token via @Security second arg', async () => {
    const frame = UserProfileFrame.of({ id: 'user123' });
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ id: 'user123', name: 'Test User' });
  });

  it('should authenticate with API key in header via @Security second arg', async () => {
    const frame = new DataFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: 'secure data', filter: 'active' });
  });

  it('should authenticate with API key in query parameter via FrameOption', async () => {
    const frame = new SearchFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ results: ['result1', 'result2'], query: 'test%20query' });
  });

  it('should authenticate with Basic authentication via FrameOption', async () => {
    const frame = new AdminUserFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ success: true, message: 'User created' });
  });

  it('should authenticate with Bearer provider via FrameOption authorization', async () => {
    const frame = new BearerProfileFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ profile: 'oauth user profile' });
  });

  it('should authenticate with multiple security providers successfully', async () => {
    const frame = new MultiSecurityFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ secure: 'multi-auth data' });
  });

  it('should use default authorization when no dynamic auth provided', async () => {
    const frame = new DynamicAuthFrame();
    const result = await frame._execute();

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Default auth successful' });
  });

  it('should override frame authorization with dynamic auth', async () => {
    server.use(
      http.get('http://api.example.com/dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer dynamic-override-token') {
          return HttpResponse.json({ message: 'Dynamic auth successful' });
        }
        if (authHeader === 'Bearer default-token') {
          return HttpResponse.json({ message: 'Default auth successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const frame = new DynamicAuthFrame();
    const result = await frame._execute({ dynamicAuth: 'dynamic-override-token' });

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Dynamic auth successful' });
  });

  it('should resolve function-based SecurityKey at request time', async () => {
    let tokenValue = 'first-token';

    @Security(new BearerTokenProvider(), () => tokenValue)
    @Get({ host: 'http://api.example.com/dynamic' })
    class LazyTokenFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer first-token') {
          return HttpResponse.json({ message: 'First token successful' });
        }
        if (authHeader === 'Bearer second-token') {
          return HttpResponse.json({ message: 'Second token successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const frame1 = new LazyTokenFrame();
    const result1 = await frame1._execute();
    expect(result1.data).toEqual({ message: 'First token successful' });

    tokenValue = 'second-token';

    const frame2 = new LazyTokenFrame();
    const result2 = await frame2._execute();
    expect(result2.data).toEqual({ message: 'Second token successful' });
  });

  it('should resolve async function-based SecurityKey at request time', async () => {
    const asyncGetToken = async (): Promise<string> => Promise.resolve('async-vault-token');

    @Security(new BearerTokenProvider(), asyncGetToken)
    @Get({ host: 'http://api.example.com/dynamic' })
    class AsyncTokenFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer async-vault-token') {
          return HttpResponse.json({ message: 'Async token successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const frame = new AsyncTokenFrame();
    const result = await frame._execute();
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Async token successful' });
  });

  it('should update BearerTokenProvider key with setKey()', async () => {
    const provider = new BearerTokenProvider();

    @Security(provider)
    @Get({ host: 'http://api.example.com/dynamic' })
    class MutableTokenFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer mutable-token') {
          return HttpResponse.json({ message: 'Mutable token successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    provider.setKey('mutable-token');

    const frame = new MutableTokenFrame();
    const result = await frame._execute();
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Mutable token successful' });
  });

  it('should handle authentication failure gracefully', async () => {
    @Get({
      host: 'http://api.example.com/user/user123',
      security: new BearerTokenProvider(),
      authorization: 'invalid-token',
    })
    class FailureFrame extends JinFrame {}

    const frame = new FailureFrame();

    await expect(frame._execute()).rejects.toMatchObject({
      resp: { status: 401 },
    });
  });

  it('should handle API key authentication failure', async () => {
    @Get({
      host: 'http://api.example.com/data',
      security: new ApiKeyProvider('api-key', 'X-API-Key', 'header'),
      authorization: 'wrong-api-key',
    })
    class ApiKeyFailureFrame extends JinFrame {}

    const frame = new ApiKeyFailureFrame();

    await expect(frame._execute()).rejects.toMatchObject({
      resp: { status: 403 },
    });
  });

  it('should handle Basic auth failure', async () => {
    @Post({
      host: 'http://api.example.com/admin/users',
      security: new BasicAuthProvider(),
      authorization: { username: 'wrong', password: 'credentials' },
    })
    class BasicAuthFailureFrame extends JinFrame {}

    const frame = new BasicAuthFailureFrame();

    await expect(frame._execute()).rejects.toMatchObject({
      resp: { status: 401 },
    });
  });

  it('should handle missing authorization gracefully', async () => {
    @Get({
      host: 'http://api.example.com/user/user123',
      security: new BearerTokenProvider(),
      authorization: '',
    })
    class MissingAuthFrame extends JinFrame {}

    const frame = new MissingAuthFrame();

    await expect(frame._execute()).rejects.toMatchObject({
      resp: { status: 401 },
    });
  });

  it('should authenticate successfully when using dynamic auth without static authorization', async () => {
    @Get({
      host: 'http://api.example.com/user/user123',
      security: new BearerTokenProvider(),
    })
    class DynamicOnlyFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/user/user123', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer dynamic-runtime-token') {
          return HttpResponse.json({ id: 'user123', source: 'dynamic-auth' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const frame = new DynamicOnlyFrame();
    const result = await frame._execute({ dynamicAuth: 'dynamic-runtime-token' });

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ id: 'user123', source: 'dynamic-auth' });
  });

  it('should authenticate with multiple providers using dynamic auth', async () => {
    @Get({
      host: 'http://api.example.com/multi-dynamic',
      security: [new BearerTokenProvider(), new ApiKeyProvider('client-id', 'X-Client-ID', 'header')],
    })
    class MultiDynamicFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/multi-dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        const clientId = request.headers.get('X-Client-ID');
        if (authHeader === 'Bearer runtime-token' && clientId === 'runtime-token') {
          return HttpResponse.json({ message: 'Multi-dynamic auth successful' });
        }
        return HttpResponse.json({ error: 'Multi-auth failed' }, { status: 401 });
      }),
    );

    const frame = new MultiDynamicFrame();
    const result = await frame._execute({ dynamicAuth: 'runtime-token' });

    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Multi-dynamic auth successful' });
  });

  it('should handle API key in cookie location', async () => {
    @Get({
      host: 'http://api.example.com/cookie-auth',
      security: new ApiKeyProvider('session', 'session_id', 'cookie'),
      authorization: 'cookie-session-123',
    })
    class CookieAuthFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/cookie-auth', ({ request }) => {
        const cookieHeader = request.headers.get('Cookie');
        if (cookieHeader === 'session_id=cookie-session-123') {
          return HttpResponse.json({ message: 'Cookie auth successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const result = await new CookieAuthFrame()._execute();
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Cookie auth successful' });
  });

  it('should handle Bearer token with standard Bearer prefix', async () => {
    @Security(new BearerTokenProvider('bearer-standard'), 'standard-bearer-token')
    @Get({ host: 'http://api.example.com/dynamic' })
    class StandardBearerFrame extends JinFrame {}

    server.use(
      http.get('http://api.example.com/dynamic', ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader === 'Bearer standard-bearer-token') {
          return HttpResponse.json({ message: 'Standard Bearer successful' });
        }
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const result = await new StandardBearerFrame()._execute();
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ message: 'Standard Bearer successful' });
  });
});
