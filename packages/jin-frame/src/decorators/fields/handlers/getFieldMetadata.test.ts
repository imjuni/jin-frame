import { JinFrame } from '#frames/JinFrame';
import { getFieldMetadata } from '#decorators/fields/handlers/getFieldMetadata';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Post } from '#decorators/methods/Post';
import { describe, expect, it } from 'vitest';
import { Body } from '#decorators/fields/Body';
import { ObjectBody } from '#decorators/fields/ObjectBody';
import { Header } from '#decorators/fields/Header';

@Post({ host: 'https://api.somesite.com', path: 'hello/path' })
class IamRequest extends JinFrame {
  @Param()
  readonly name!: string;

  @Query()
  readonly age!: number;

  @Body()
  readonly affiliations!: string;

  @ObjectBody()
  readonly ability!: { name: string; desc: string };

  @Header({ replaceAt: 'Authorization', formatters: { string: (v) => `Authorization ${v}` } })
  readonly authorization!: string;
}

describe('getFieldMetadata', () => {
  it('should return metadatas when @Param, @Query, @Body, @ObjectBody, @Header passed', () => {
    const r = IamRequest.of({
      name: 'ironman',
      age: 30,
      affiliations: 'advengers',
      ability: {
        name: 'enegy projection',
        desc: 'Repulsor rays and the uni-beam projector allow for focused energy attacks',
      },
      authorization: 'i-am-key',
    });

    const metas = getFieldMetadata(
      r.constructor.prototype,
      Object.entries(r).map(([key, value]) => ({ key, value })),
    );

    expect(metas).toMatchObject({
      param: [
        {
          type: 'param',
          key: 'name',
          comma: false,
          bit: {
            enable: false,
            withZero: false,
          },
          encode: true,
          formatters: undefined,
          replaceAt: undefined,
        },
      ],
      body: [
        {
          type: 'body',
          key: 'affiliations',
          replaceAt: undefined,
          encode: true,
        },
      ],
      objectBody: [
        {
          type: 'object-body',
          key: 'ability',
          encode: true,
          order: 9007199254740991,
        },
      ],
      header: [
        {
          type: 'header',
          key: 'authorization',
          bit: {
            enable: false,
            withZero: false,
          },
          replaceAt: 'Authorization',
          comma: false,
          encode: true,
        },
      ],
      query: [
        {
          key: 'age',
          type: 'query',
          comma: false,
          bit: {
            enable: false,
            withZero: false,
          },
          encode: true,
          formatters: undefined,
          replaceAt: undefined,
        },
      ],
    });
  });
});
