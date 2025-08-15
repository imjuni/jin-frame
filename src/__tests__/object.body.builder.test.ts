import { JinEitherFrame } from '#frames/JinEitherFrame';
import { Post } from '#tools/decorators/MethodDecorators';
import type { ConstructorType } from '#tools/type-utilities/ConstructorType';
import { lightFormat } from 'date-fns';
import { describe, expect, it } from 'vitest';

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.body()
  declare public readonly password: string;

  @JinEitherFrame.O()
  declare public readonly hero: { name: string; age: number; bio: { birth: string } };
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.objectBody()
  declare public readonly hero: { name: string; age: number; bio: { birth: string } };

  @JinEitherFrame.objectBody()
  declare public readonly ability: { skill: string; count: number; category: { name: string } };
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'bio.birth',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly hero: { name: string; age: number; bio: { birth: Date } };

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly ability: { skill: string; count: number; category: { name: string; developAt: Date } };
}

@Post({ host: 'http://some.api.google.com/jinframe/:passing' })
class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  declare public readonly passing: string;

  @JinEitherFrame.body()
  declare public readonly username: string;

  @JinEitherFrame.objectBody({
    order: 2,
    formatters: {
      findFrom: 'bio.birth',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly hero: { name: string; age: number; bio: { birth: Date } };

  @JinEitherFrame.objectBody({
    order: 1,
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly ability: {
    name: string;
    skill: string;
    count: number;
    category: { name: string; developAt: Date };
  };

  constructor(args: ConstructorType<Test004PostFrame>) {
    super({
      passing: args.passing,
      username: args.username,
      hero: args.hero,
      ability: args.ability,
    });
  }
}

describe('JinEitherFrame ObjectBody using Object', () => {
  it('T001-plain-object-type', async () => {
    const frame = new Test001PostFrame({
      passing: 'hello',
      username: 'ironman',
      password: 'advengers',
      hero: { name: 'ironman', age: 33, bio: { birth: '2022-11-22 11:22:33' } },
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: {
        username: 'ironman',
        password: 'advengers',
        age: 33,
        bio: {
          birth: '2022-11-22 11:22:33',
        },
        name: 'ironman',
      },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.data);

    expect(req).toEqual(excpetation);
  });

  it('T002-merge-two-object', async () => {
    const frame = new Test002PostFrame({
      passing: 'hello',
      username: 'ironman',
      ability: { skill: 'Energy repulsor', count: 5, category: { name: 'laser' } },
      hero: { name: 'ironman', age: 33, bio: { birth: '2022-11-22 11:22:33' } },
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: {
        username: 'ironman',
        age: 33,
        bio: {
          birth: '2022-11-22 11:22:33',
        },
        name: 'ironman',
        skill: 'Energy repulsor',
        count: 5,
        category: { name: 'laser' },
      },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.data);

    expect(req).toEqual(excpetation);
  });

  it('T003-merge-and-formatting', async () => {
    const frame = new Test003PostFrame({
      passing: 'hello',
      username: 'ironman',
      ability: {
        skill: 'Energy repulsor',
        count: 5,
        category: { name: 'laser', developAt: new Date(1980, 2, 11, 1, 33, 0) },
      },
      hero: { name: 'ironman', age: 33, bio: { birth: new Date(1970, 2, 11, 1, 33, 0) } },
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: {
        username: 'ironman',
        age: 33,
        bio: {
          birth: '1970-03-11 01:33:00',
        },
        name: 'ironman',
        skill: 'Energy repulsor',
        count: 5,
        category: { name: 'laser', developAt: '1980-03-11 01:33:00' },
      },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.data);

    expect(req).toEqual(excpetation);
  });

  it('T004-merge-and-formatting', async () => {
    const frame = new Test004PostFrame({
      passing: 'hello',
      username: 'ironman',
      ability: {
        name: 'batman',
        skill: 'Energy repulsor',
        count: 5,
        category: { name: 'laser', developAt: new Date(1980, 2, 11, 1, 33, 0) },
      },
      hero: { name: 'ironman', age: 33, bio: { birth: new Date(1970, 2, 11, 1, 33, 0) } },
    });
    const req = frame.request();

    const excpetation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      data: {
        username: 'ironman',
        age: 33,
        bio: {
          birth: '1970-03-11 01:33:00',
        },
        name: 'ironman',
        skill: 'Energy repulsor',
        count: 5,
        category: { name: 'laser', developAt: '1980-03-11 01:33:00' },
      },
      transformRequest: undefined,
      url: 'http://some.api.google.com/jinframe/hello',
      validateStatus: undefined,
    };

    // console.log(req.data);

    expect(req).toEqual(excpetation);
  });
});
