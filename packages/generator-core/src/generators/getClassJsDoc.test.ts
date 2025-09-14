import { getClassJsDoc } from '#/generators/getClassJsDoc';
import { describe, expect, it } from 'vitest';

describe('getClassJsDoc', () => {
  it('should return @see when summary, description, tags is undefined', () => {
    const result = getClassJsDoc({
      method: 'POST',
      pathKey: '/pet/findByTags',
    });

    // console.log(result);
    expect(result).toEqual('@see POST /pet/findByTags');
  });

  it('should return @see, description when summary, tags is undefined', () => {
    const result = getClassJsDoc({
      method: 'POST',
      pathKey: '/pet/findByTags',
      operation: {
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
      },
    });

    expect(result).toEqual(
      `Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.\n\n@see POST /pet/findByTags`,
    );
  });

  it('should return @see, summary, description when tags is undefined', () => {
    const result = getClassJsDoc({
      method: 'POST',
      pathKey: '/pet/findByTags',
      operation: {
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
        summary: 'Finds Pets by tags.',
      },
    });

    expect(result).toEqual(
      `Finds Pets by tags.\nMultiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.\n\n@see POST /pet/findByTags`,
    );
  });

  it('should return summary, description, @see, @tag when every value is not undefined', () => {
    const result = getClassJsDoc({
      method: 'POST',
      pathKey: '/pet/findByTags',
      operation: {
        description: 'Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.',
        summary: 'Finds Pets by tags.',
        tags: ['pet', 'cat'],
      },
    });

    expect(result).toEqual(
      `Finds Pets by tags.\nMultiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.\n\n@see POST /pet/findByTags\n@tag pet, cat`,
    );
  });

  it('should return @see, @tag when summary, description is undefined', () => {
    const result = getClassJsDoc({
      method: 'POST',
      pathKey: '/pet/findByTags',
      operation: {
        tags: ['pet', 'cat'],
      },
    });

    expect(result).toEqual(`@see POST /pet/findByTags\n@tag pet, cat`);
  });
});
