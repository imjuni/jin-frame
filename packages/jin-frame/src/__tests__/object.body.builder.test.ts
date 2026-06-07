import { lightFormat } from "date-fns";
import { describe, expect, it } from "vitest";
import { Body } from "#decorators/fields/Body";
import { ObjectBody } from "#decorators/fields/ObjectBody";
import { Param } from "#decorators/fields/Param";
import { Post } from "#decorators/methods/Post";
import { JinFrame } from "#frames/JinFrame";

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test001PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @Body()
  public declare readonly password: string;

  @ObjectBody()
  public declare readonly hero: {
    name: string;
    age: number;
    bio: { birth: string };
  };
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test002PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @ObjectBody()
  public declare readonly hero: {
    name: string;
    age: number;
    bio: { birth: string };
  };

  @ObjectBody()
  public declare readonly ability: {
    skill: string;
    count: number;
    category: { name: string };
  };
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test003PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @ObjectBody({
    formatters: {
      findFrom: "bio.birth",
      dateTime: (value) => lightFormat(value, "yyyy-MM-dd HH:mm:ss"),
    },
  })
  public declare readonly hero: {
    name: string;
    age: number;
    bio: { birth: Date };
  };

  @ObjectBody({
    formatters: {
      findFrom: "category.developAt",
      dateTime: (value) => lightFormat(value, "yyyy-MM-dd HH:mm:ss"),
    },
  })
  public declare readonly ability: {
    skill: string;
    count: number;
    category: { name: string; developAt: Date };
  };
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test004PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @ObjectBody({
    order: 2,
    formatters: {
      findFrom: "bio.birth",
      dateTime: (value) => lightFormat(value, "yyyy-MM-dd HH:mm:ss"),
    },
  })
  public declare readonly hero: {
    name: string;
    age: number;
    bio: { birth: Date };
  };

  @ObjectBody({
    order: 1,
    formatters: {
      findFrom: "category.developAt",
      dateTime: (value) => lightFormat(value, "yyyy-MM-dd HH:mm:ss"),
    },
  })
  public declare readonly ability: {
    name: string;
    skill: string;
    count: number;
    category: { name: string; developAt: Date };
  };
}

describe("JinFrame ObjectBody using Object", () => {
  it("T001-plain-object-type", async () => {
    const frame = Test001PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
      hero: { name: "ironman", age: 33, bio: { birth: "2022-11-22 11:22:33" } },
    });
    const req = frame._request();

    const expectedBody = {
      username: "ironman",
      password: "advengers",
      name: "ironman",
      age: 33,
      bio: {
        birth: "2022-11-22 11:22:33",
      },
    };

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: expectedBody,
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req.data);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });

  it("T002-merge-two-object", async () => {
    const frame = Test002PostFrame.of({
      passing: "hello",
      username: "ironman",
      ability: {
        skill: "Energy repulsor",
        count: 5,
        category: { name: "laser" },
      },
      hero: { name: "ironman", age: 33, bio: { birth: "2022-11-22 11:22:33" } },
    });
    const req = frame._request();

    const expectedBody = {
      username: "ironman",
      name: "ironman",
      age: 33,
      bio: {
        birth: "2022-11-22 11:22:33",
      },
      skill: "Energy repulsor",
      count: 5,
      category: { name: "laser" },
    };

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: expectedBody,
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req.data);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });

  it("T003-merge-and-formatting", async () => {
    const frame = Test003PostFrame.of({
      passing: "hello",
      username: "ironman",
      ability: {
        skill: "Energy repulsor",
        count: 5,
        category: { name: "laser", developAt: new Date(1980, 2, 11, 1, 33, 0) },
      },
      hero: {
        name: "ironman",
        age: 33,
        bio: { birth: new Date(1970, 2, 11, 1, 33, 0) },
      },
    });
    const req = frame._request();

    const expectedBody = {
      username: "ironman",
      name: "ironman",
      age: 33,
      bio: {
        birth: "1970-03-11 01:33:00",
      },
      skill: "Energy repulsor",
      count: 5,
      category: { name: "laser", developAt: "1980-03-11 01:33:00" },
    };

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: expectedBody,
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req.data);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });

  it("T004-merge-and-formatting", async () => {
    const frame = Test004PostFrame.of({
      passing: "hello",
      username: "ironman",
      ability: {
        name: "batman",
        skill: "Energy repulsor",
        count: 5,
        category: { name: "laser", developAt: new Date(1980, 2, 11, 1, 33, 0) },
      },
      hero: {
        name: "ironman",
        age: 33,
        bio: { birth: new Date(1970, 2, 11, 1, 33, 0) },
      },
    });
    const req = frame._request();

    const expectedBody = {
      username: "ironman",
      name: "ironman",
      age: 33,
      bio: {
        birth: "1970-03-11 01:33:00",
      },
      skill: "Energy repulsor",
      count: 5,
      category: { name: "laser", developAt: "1980-03-11 01:33:00" },
    };

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: expectedBody,
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req.data);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });
});
