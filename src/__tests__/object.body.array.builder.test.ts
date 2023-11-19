import { JinEitherFrame } from '#frames/JinEitherFrame';
import { lightFormat } from 'date-fns';
import { expect, it } from 'vitest';

class Test001PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody()
  public readonly ability!: {
    name: string;
    skill: string;
    count: number;
    category: { name: string };
  }[];

  constructor(args: {
    passing: string;
    ability: { name: string; skill: string; count: number; category: { name: string } }[];
  }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T001-plain-array-body', async () => {
  const frame = new Test001PostFrame({
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

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: [
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
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test002PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability!: {
    name: string;
    skill: string;
    count: number;
    category: { name: string; developAt: Date };
  }[];

  constructor(args: {
    passing: string;
    ability: { name: string; skill: string; count: number; category: { name: string; developAt: Date } }[];
  }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T002-plain-array-with-formatters', async () => {
  const frame = new Test002PostFrame({
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

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: [
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
    ],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test003PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody()
  public readonly ability!: string[];

  constructor(args: { passing: string; ability: string[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T003-primitive-array', async () => {
  const frame = new Test003PostFrame({
    passing: 'hello',
    ability: ['Energy repulsor', 'Regeneration'],
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: ['Energy repulsor', 'Regeneration'],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test004PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody({
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability!: Date[];

  constructor(args: { passing: string; ability: Date[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T004-primitive-date-array', async () => {
  const frame = new Test004PostFrame({
    passing: 'hello',
    ability: [new Date(1980, 2, 11, 1, 33, 0), new Date(2020, 9, 11, 11, 22, 10)],
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: ['1980-03-11 01:33:00', '2020-10-11 11:22:10'],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test005PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody({
    order: 2,
    formatters: {
      findFrom: 'ability',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability!: Date[];

  @JinEitherFrame.objectBody({
    order: 1,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly birthAt!: Date[];

  constructor(args: { passing: string; ability: Date[]; birthAt: Date[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T005-primitive-date-array-ordered-merge', async () => {
  const frame = new Test005PostFrame({
    passing: 'hello',
    ability: [new Date(1980, 2, 11, 1, 33, 0), new Date(2010, 9, 11, 11, 22, 10)],
    birthAt: [new Date(1990, 3, 6, 1, 33, 0), new Date(2020, 5, 8, 11, 32, 10)],
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: ['1990-04-06 01:33:00', '2020-06-08 11:32:10', '1980-03-11 01:33:00', '2010-10-11 11:22:10'],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test006PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody({
    order: 1,
  })
  public readonly ability!: string[];

  @JinEitherFrame.objectBody({
    order: 2,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly birthAt!: Date[];

  constructor(args: { passing: string; ability: string[]; birthAt: Date[] }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T006-primitive-date-complex-type-merge', async () => {
  const frame = new Test006PostFrame({
    passing: 'hello',
    ability: ['Energy repulsor', 'Regeneration'],
    birthAt: [new Date(1990, 3, 6, 1, 33, 0), new Date(2020, 5, 8, 11, 32, 10)],
  });

  const req = frame.request();

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: ['Energy repulsor', 'Regeneration', '1990-04-06 01:33:00', '2020-06-08 11:32:10'],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});

class Test007PostFrame extends JinEitherFrame {
  @JinEitherFrame.param()
  public readonly passing!: string;

  @JinEitherFrame.objectBody({
    order: 2,
    formatters: {
      findFrom: 'category.developAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly ability!: {
    name: string;
    skill: string;
    count: number;
    category: { name: string; developAt: Date };
  }[];

  @JinEitherFrame.objectBody({
    order: 1,
    formatters: {
      findFrom: 'birthAt',
      dateTime: (value) => lightFormat(value, 'yyyy-MM-dd HH:mm:ss'),
    },
  })
  public readonly birthAt!: Date[];

  constructor(args: {
    passing: string;
    ability: {
      name: string;
      skill: string;
      count: number;
      category: { name: string; developAt: Date };
    }[];
    birthAt: Date[];
  }) {
    super({
      ...args,
      $$host: 'http://some.api.google.com/jinframe/:passing',
      $$method: 'POST',
    });
  }
}

it('T007-primitive-date-complex-type-merge', async () => {
  const frame = new Test007PostFrame({
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

  const excpetation = {
    timeout: 120000,
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    data: [
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
    ],
    transformRequest: undefined,
    url: 'http://some.api.google.com/jinframe/hello',
    validateStatus: undefined,
  };

  // console.log(req.data);

  expect(req).toEqual(excpetation);
});
