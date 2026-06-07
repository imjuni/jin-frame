import { lightFormat } from "date-fns";
import { describe, expect, it } from "vitest";
import { Body } from "#decorators/fields/Body";
import { Param } from "#decorators/fields/Param";
import { Post } from "#decorators/methods/Post";
import { JinFrame } from "#frames/JinFrame";

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test001PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({
    formatters: [{ string: (value) => `${value}+111` }, { string: (value) => `${value}+222` }],
  })
  public declare readonly username: string[];

  @Body()
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test002PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({
    formatters: [
      {
        findFrom: "name",
        string: (value) => `${value}+111`,
      },
      {
        findFrom: "bio.birth",
        dateTime: (value) => lightFormat(value, `yyyy-MM-dd'T'HH:mm:ss`),
      },
    ],
  })
  public declare readonly hero: {
    name: string;
    age: number;
    bio: {
      birth: Date;
    };
  };

  @Body()
  public declare readonly password: string;
}

describe("JinFrame", () => {
  it("T001-primitive-type-multiple-formatters", async () => {
    const frame = Test001PostFrame.of({
      passing: "hello",
      username: ["ironman", "thor"],
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        username: ["ironman+111+222", "thor+111+222"],
        password: "advengers",
      }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });

  it("T002-zero-depth-post-frame", async () => {
    const frame = Test002PostFrame.of({
      passing: "hello",
      hero: {
        name: "ironman",
        age: 33,
        bio: { birth: new Date(1978, 2, 3, 11, 22, 33) },
      },
      password: "advengers",
    });
    const req = frame._request();

    const expectedBody = {
      hero: {
        name: "ironman+111",
        age: 33,
        bio: {
          birth: "1978-03-03T11:22:33",
        },
      },
      password: "advengers",
    };

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: expectedBody,
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req);

    expect({ ...req, body: JSON.parse(req.body as string) }).toEqual(expectation);
  });
});
