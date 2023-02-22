/* eslint-disable max-classes-per-file, no-console */
import { lightFormat } from 'date-fns';
import { JinEitherFrame } from '../frames/JinEitherFrame';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.body()
  public readonly password: string;

  @JinEitherFrame.O()
  public readonly hero: { name: string; age: number; bio: { birth: string } };

  constructor(args: {
    passing: string;
    username: string;
    password: string;
    hero: { name: string; age: number; bio: { birth: string } };
  }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.password = args.password;
    this.hero = args.hero;
  }
}

test('T001-plain-object-type', async () => {
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

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.objectBody()
  public readonly hero: { name: string; age: number; bio: { birth: string } };

  @JinEitherFrame.objectBody()
  public readonly ability: { skill: string; count: number; category: { name: string } };

  constructor(args: {
    passing: string;
    username: string;
    hero: { name: string; age: number; bio: { birth: string } };
    ability: { skill: string; count: number; category: { name: string } };
  }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.hero = args.hero;
    this.ability = args.ability;
  }
}

test('T002-merge-two-object', async () => {
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

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'bio.birth',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly hero: { name: string; age: number; bio: { birth: Date } };

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability: { skill: string; count: number; category: { name: string; developAt: Date } };

  constructor(args: {
    passing: string;
    username: string;
    hero: { name: string; age: number; bio: { birth: Date } };
    ability: { skill: string; count: number; category: { name: string; developAt: Date } };
  }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.hero = args.hero;
    this.ability = args.ability;
  }
}

test('T003-merge-and-formatting', async () => {
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

class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing: string;

  @JinEitherFrame.body()
  public readonly username: string;

  @JinEitherFrame.objectBody({
    order: 2,
    formatters: {
      findFrom: 'bio.birth',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly hero: { name: string; age: number; bio: { birth: Date } };

  @JinEitherFrame.objectBody({
    order: 1,
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability: { name: string; skill: string; count: number; category: { name: string; developAt: Date } };

  constructor(args: {
    passing: string;
    username: string;
    hero: { name: string; age: number; bio: { birth: Date } };
    ability: { name: string; skill: string; count: number; category: { name: string; developAt: Date } };
  }) {
    super({
      host: 'http://some.api.google.com/jinframe/:passing',
      method: 'POST',
    });

    this.passing = args.passing;
    this.username = args.username;
    this.hero = args.hero;
    this.ability = args.ability;
  }
}

test('T004-merge-and-formatting', async () => {
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
