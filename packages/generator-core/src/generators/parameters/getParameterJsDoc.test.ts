import { getParameterJsDoc } from '#/generators/parameters/getParameterJsDoc';
import { describe, expect, it } from 'vitest';

describe('getParameterJsDoc', () => {
  it('should return empty docs when empty object', () => {
    const docs = getParameterJsDoc({});
    expect(docs).toEqual([]);
  });

  it('should return docs when pass only description', () => {
    const docs = getParameterJsDoc({ description: 'I am Ironman' });
    expect(docs).toEqual([`I am Ironman`]);
  });

  it('should return description and example docs when pass description, example', () => {
    const docs = getParameterJsDoc({ description: 'I am Ironman', example: 'ironman' });
    expect(docs).toEqual([
      `I am Ironman

@example ironman`,
    ]);
  });

  it('should return docs when pass description, example, examples', () => {
    const docs = getParameterJsDoc({
      description: 'I am Ironman',
      example: 'ironman',
      examples: {
        'application/json': {
          description: 'description',
          summary: 'summary',
          value: { name: 'ironman', team: 'advengers' },
        },
      },
    });
    expect(docs).toEqual([
      `I am Ironman

@example ironman
@example (application/json) summary - description 
\`\`\`json
{
  "name": "ironman",
  "team": "advengers"
}
\`\`\``,
    ]);
  });
});
