import { getParameterJsDocExamplesContent } from '#/generators/parameters/getParameterJsDocExamplesContent';
import { describe, expect, it } from 'vitest';

describe('getParameterJsDocExamplesContent', () => {
  it('should return full application/json when full example', () => {
    const result = getParameterJsDocExamplesContent({
      contentType: 'application/json',
      example: {
        summary: 'Ironman is strong',
        description: 'Ironman is strong and cool. I am Ironman.',
        value: { name: 'Ironman', team: 'advengers' },
      },
      options: {
        useCodeFence: true,
      },
    });

    const expectation = `@example (application/json) Ironman is strong - Ironman is strong and cool. I am Ironman. 
\`\`\`json
{
  "name": "Ironman",
  "team": "advengers"
}
\`\`\``;

    expect(result).toEqual(expectation);
  });

  it('should return full application/+json when full example', () => {
    const result = getParameterJsDocExamplesContent({
      contentType: 'application/+json',
      example: {
        summary: 'Ironman is strong',
        description: 'Ironman is strong and cool. I am Ironman.',
        value: { name: 'Ironman', team: 'advengers' },
      },
      options: {
        useCodeFence: false,
      },
    });

    const expectation = `@example (application/+json) Ironman is strong - Ironman is strong and cool. I am Ironman. 
\`\`\`json
{
  "name": "Ironman",
  "team": "advengers"
}
\`\`\``;

    expect(result).toEqual(expectation);
  });

  it('should return application/json without summary, description when example dont have a summary, description', () => {
    const result = getParameterJsDocExamplesContent({
      contentType: 'application/json',
      example: {
        value: { name: 'Ironman', team: 'advengers' },
      },
      options: {
        useCodeFence: false,
      },
    });

    const expectation = `@example (application/json)
\`\`\`json
{
  "name": "Ironman",
  "team": "advengers"
}
\`\`\``;

    expect(result).toEqual(expectation);
  });

  it('should return full application/x-www-form-urlencoded when full example', () => {
    const result = getParameterJsDocExamplesContent({
      contentType: 'application/x-www-form-urlencoded',
      example: {
        summary: 'Ironman is strong',
        description: 'Ironman is strong and cool. I am Ironman.',
        value: '"name": "Ironman","team": "advengers"',
      },
      options: {
        useCodeFence: false,
      },
    });

    const expectation = `@example (application/x-www-form-urlencoded) Ironman is strong - Ironman is strong and cool. I am Ironman. 
"name": "Ironman","team": "advengers"`;

    expect(result).toEqual(expectation);
  });

  it('should return full application/x-www-form-urlencoded when full example and object example value', () => {
    const result = getParameterJsDocExamplesContent({
      contentType: 'application/x-www-form-urlencoded',
      example: {
        summary: 'Ironman is strong',
        description: 'Ironman is strong and cool. I am Ironman.',
        value: { name: 'Ironman', team: 'advengers' },
      },
      options: {
        useCodeFence: false,
      },
    });

    const expectation = `@example (application/x-www-form-urlencoded) Ironman is strong - Ironman is strong and cool. I am Ironman. 
{"name":"Ironman","team":"advengers"}`;

    expect(result).toEqual(expectation);
  });
});
