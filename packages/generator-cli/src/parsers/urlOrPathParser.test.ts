/* eslint-disable n/no-sync */
import { urlOrPathParser } from '#/parsers/urlOrPathParser';
import { message } from '@optique/core';
import { existsSync } from 'my-node-fp';
import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';

vi.mock('my-node-fp', () => ({
  existsSync: vi.fn(),
}));

describe('urlOrPathParser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return file path when given valid existing file path', () => {
    vi.mocked(existsSync).mockReturnValue(true);

    const filePath = '/a/b/csuper-file.yaml';
    const result = urlOrPathParser(filePath);
    expect(result).toEqual({ value: filePath, success: true });
  });

  it('should return URL object when given valid URL and file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const url = 'https://api.example.com';
    const result = urlOrPathParser(url);
    expect(result).toEqual({ value: new URL(url), success: true });
  });

  it('should return error when given invalid URL and file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    const url = 'invalid-url';
    const result = urlOrPathParser(url);
    expect(result).toEqual({ error: message`Invalid File path or URL: ${url}`, success: false });
  });
});
