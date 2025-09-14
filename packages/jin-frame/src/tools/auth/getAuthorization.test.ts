import { getAuthorization } from '#tools/auth/getAuthorization';
import { describe, expect, it } from 'vitest';

describe('getAuthorization', () => {
  it('should return authKey undefined and auth undefined when empty header, undefined authorization, undefined auth', () => {
    const result = getAuthorization({}, undefined, undefined);
    expect(result).toEqual({ authKey: undefined, auth: undefined });
  });

  it('should return authKey string and auth undefined when header have Authorization, undefined authorization, undefined auth', () => {
    const key = 'Bearer i-am-key';
    const result = getAuthorization({ Authorization: key }, undefined, undefined);
    expect(result).toEqual({ authKey: key, auth: undefined });
  });

  it('should return authKey undefined and auth when header have Authorization, undefined authorization, auth', () => {
    const auth = { username: 'ironman', password: 'marvel' };
    const result = getAuthorization({}, undefined, auth);
    expect(result).toEqual({ authKey: undefined, auth });
  });

  it('should return authKey undefined and auth when header have Authorization, auth object via authorization, undefined auth', () => {
    const auth = { username: 'ironman', password: 'marvel' };
    const result = getAuthorization({}, auth, undefined);
    expect(result).toEqual({ authKey: undefined, auth });
  });

  it('should return authKey string and undefined auth when header have Authorization, auth key via authorization, undefined auth', () => {
    const key = 'i-am-key';
    const result = getAuthorization({}, key, undefined);
    expect(result).toEqual({ authKey: key, auth: undefined });
  });
});
