import { JinFrame } from '#frames/JinFrame';
import { getFieldMetadata } from '#decorators/fields/handlers/getFieldMetadata';
import { Param } from '#decorators/fields/Param';
import { Query } from '#decorators/fields/Query';
import { Post } from '#decorators/methods/Post';
import { describe, it } from 'vitest';
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

  @Header({ replaceAt: 'Authorization' })
  readonly authorization!: string;
}

describe('getFieldMetadata', () => {
  it('일반적인 경우 데이터 가져오기', () => {
    const r = new IamRequest({
      name: 'ironman',
      age: 30,
      affiliations: 'advengers',
      ability: {
        name: 'enegy projection',
        desc: 'Repulsor rays and the uni-beam projector allow for focused energy attacks',
      },
    });

    const metas = getFieldMetadata(
      r.constructor.prototype,
      Object.entries(r).map(([key, value]) => ({ key, value })),
    );

    console.log(metas);
  });
});
