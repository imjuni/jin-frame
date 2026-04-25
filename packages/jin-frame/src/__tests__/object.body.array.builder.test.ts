import { JinFrame } from '#frames/JinFrame';
import { Post } from '#decorators/methods/Post';
import { lightFormat } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { Param } from '#decorators/fields/Param';
import { ObjectBody } from '#decorators/fields/ObjectBody';

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test001PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody()
  declare public readonly ability: {
    name: string;
    skill: string;
    count: number;
    category: { name: string };
  }[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test002PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
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
  }[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test003PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody()
  declare public readonly ability: string[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test004PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly ability: Date[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test005PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    order: 2,
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly ability: Date[];

  @ObjectBody({
    order: 1,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly birthAt: Date[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test006PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    order: 1,
  })
  declare public readonly ability: string[];

  @ObjectBody({
    order: 2,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly birthAt: Date[];
}

@Post({ host: 'http://some.api.google.com/jinframe/{passing}' })
class Test007PostFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @ObjectBody({
    order: 2,
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
  }[];

  @ObjectBody({
    order: 1,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  declare public readonly birthAt: Date[];
}

describe('JinFrame ObjectBody using Array', () => {
  it('T001-plain-array-body', async () => {
    const frame = Test001PostFrame.of({
      passing: 'hello',
      ability: [
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser' },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy' },
        },
      ],
    });
    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify([
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser' },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy' },
        },
      ]),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T002-plain-array-with-formatters', async () => {
    const frame = Test002PostFrame.of({
      passing: 'hello',
      ability: [
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser', developAt: new Date(1980, 2, 11, 1, 33, 0) },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy', developAt: new Date(2020, 9, 11, 11, 22, 10) },
        },
      ],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify([
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser', developAt: '1980-03-11 01:33:00' },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy', developAt: '2020-10-11 11:22:10' },
        },
      ]),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T003-primitive-array', async () => {
    const frame = Test003PostFrame.of({
      passing: 'hello',
      ability: ['Energy repulsor', 'Regeneration'],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(['Energy repulsor', 'Regeneration']),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T004-primitive-date-array', async () => {
    const frame = Test004PostFrame.of({
      passing: 'hello',
      ability: [new Date(1980, 2, 11, 1, 33, 0), new Date(2020, 9, 11, 11, 22, 10)],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(['1980-03-11 01:33:00', '2020-10-11 11:22:10']),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T005-primitive-date-array-ordered-merge', async () => {
    const frame = Test005PostFrame.of({
      passing: 'hello',
      ability: [new Date(1980, 2, 11, 1, 33, 0), new Date(2010, 9, 11, 11, 22, 10)],
      birthAt: [new Date(1990, 3, 6, 1, 33, 0), new Date(2020, 5, 8, 11, 32, 10)],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(['1990-04-06 01:33:00', '2020-06-08 11:32:10', '1980-03-11 01:33:00', '2010-10-11 11:22:10']),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T006-primitive-date-complex-type-merge', async () => {
    const frame = Test006PostFrame.of({
      passing: 'hello',
      ability: ['Energy repulsor', 'Regeneration'],
      birthAt: [new Date(1990, 3, 6, 1, 33, 0), new Date(2020, 5, 8, 11, 32, 10)],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(['Energy repulsor', 'Regeneration', '1990-04-06 01:33:00', '2020-06-08 11:32:10']),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it('T007-primitive-date-complex-type-merge', async () => {
    const frame = Test007PostFrame.of({
      passing: 'hello',
      ability: [
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser', developAt: new Date(1980, 2, 11, 1, 33, 0) },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy', developAt: new Date(2020, 9, 11, 11, 22, 10) },
        },
      ],
      birthAt: [new Date(1990, 3, 6, 1, 33, 0), new Date(2020, 5, 8, 11, 32, 10)],
    });

    const req = frame.request();

    const expectation = {
      timeout: 120000,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify([
        '1990-04-06 01:33:00',
        '2020-06-08 11:32:10',
        {
          name: 'ironman',
          skill: 'Energy repulsor',
          count: 5,
          category: { name: 'laser', developAt: '1980-03-11 01:33:00' },
        },
        {
          name: 'hulk',
          skill: 'Regeneration',
          count: 5,
          category: { name: 'healthy', developAt: '2020-10-11 11:22:10' },
        },
      ]),
      url: 'http://some.api.google.com/jinframe/hello',
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });
});
