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
  public declare readonly username: string[];

  @Body()
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test002PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string[];

  // warnning, username2 is invalid usage. It will be overwrite previous username key
  @Body({ replaceAt: "username" })
  public declare readonly username2: string[];

  @Body()
  public declare readonly password: string;
}

describe("JinFrame - Body", () => {
  it("should process array when pass plain array body field", async () => {
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
        username: ["ironman", "thor"],
        password: "advengers",
      }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });

  it("should overrite body field when pass multiple body field", async () => {
    const frame = Test002PostFrame.of({
      passing: "hello",
      username: ["ironman", "thor"],
      username2: ["hulk", "black widow"],
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        username: ["hulk", "black widow"],
        password: "advengers",
      }),
      url: "http://some.api.google.com/jinframe/hello",
    };

    // console.log(req);

    expect(req).toEqual(expectation);
  });
});
