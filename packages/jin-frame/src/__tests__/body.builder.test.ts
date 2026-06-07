import { describe, expect, it } from "vitest";
import { Body } from "#decorators/fields/Body";
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
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test002PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({ replaceAt: "uuu" })
  public declare readonly username: string;

  @Body({ replaceAt: "ppp" })
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test003PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({ replaceAt: "uuu.username" })
  public declare readonly username: string;

  @Body({ replaceAt: "ppp.password" })
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test004ZeroDepthPostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @Body()
  public declare readonly hero: {
    name: string;
    ability: string;
    age: number;
  };
}

describe("JinFrame - primitive type", () => {
  it("should apply primitive type to path param and body", async () => {
    const frame = Test001PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ username: "ironman", password: "advengers" }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    expect(req).toEqual(expectation);
  });

  it("should apply body key field to different key using replaceAt", async () => {
    const frame = Test002PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ uuu: "ironman", ppp: "advengers" }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    expect(req).toEqual(expectation);
  });

  it("should apply body key fields to nested objects when using dot notation in replaceAt", async () => {
    const frame = Test003PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        uuu: { username: "ironman" },
        ppp: { password: "advengers" },
      }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req.data);

    expect(req).toEqual(expectation);
  });

  it("should apply object type to body field when body field is object", async () => {
    const frame = Test004ZeroDepthPostFrame.of({
      passing: "hello",
      username: "ironman",
      hero: { name: "ironman", ability: "proto cannon", age: 33 },
    });

    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        username: "ironman",
        hero: { name: "ironman", ability: "proto cannon", age: 33 },
      }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });
});
