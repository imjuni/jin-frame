import { Cookie } from '#decorators/fields/Cookie';
import { describe, expect, it } from 'vitest';

describe('Cookie', () => {
  it('should return cookie decorator handle when pass option', () => {
    const handle = Cookie({ replaceAt: 'session_id' });
    expect(handle).toBeTruthy();
  });
});
