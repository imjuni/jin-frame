import { describe, expect, it } from "vitest";
import { Header } from "#decorators/fields/Header";
import { Param } from "#decorators/fields/Param";
import { Post } from "#decorators/methods/Post";
import { JinFrame } from "#frames/JinFrame";

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test001PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Header()
  public declare readonly username: string;

  @Header()
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test002PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Header({ replaceAt: "uuu" })
  public declare readonly username: string;

  @Header({ replaceAt: "ppp" })
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test003PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Header({ replaceAt: "uuu.username" })
  public declare readonly username: string;

  @Header({ replaceAt: "ppp.password" })
  public declare readonly password: string;
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test004PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Header()
  public declare readonly username: string;

  @Header()
  public declare readonly hero: {
    name: string;
    ability: string;
    age: number;
  };
}

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class Test005PostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Header()
  public declare readonly username: string;

  @Header({ comma: true, encode: false })
  public declare readonly hero: string[];
}

describe("JinFrame - Header", () => {
  it("T001-primitive-type", async () => {
    const frame = Test001PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        username: "ironman",
        password: "advengers",
      },
      method: "POST",
      transformRequest: undefined,
      url: "http://some.api.google.com/jinframe/hello",
      validateStatus: undefined,
    };

    expect(req).toEqual(expectation);
  });

  it("T001-header", async () => {
    const frame = Test001PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    expect(req.headers).toMatchObject({
      username: "ironman",
      password: "advengers",
      "Content-Type": "application/json",
    });
  });

  it("T002-primitive-type-key-replace", async () => {
    const frame = Test002PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        uuu: "ironman",
        ppp: "advengers",
      },
      method: "POST",
      transformRequest: undefined,
      url: "http://some.api.google.com/jinframe/hello",
      validateStatus: undefined,
    };

    expect(req).toEqual(expectation);
  });

  it("T003-primitive-type-key-replace-at-not-support-dot-props", async () => {
    const frame = Test003PostFrame.of({
      passing: "hello",
      username: "ironman",
      password: "advengers",
    });
    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        "ppp.password": "advengers",
        "uuu.username": "ironman",
      },
      method: "POST",
      transformRequest: undefined,
      url: "http://some.api.google.com/jinframe/hello",
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(expectation);
  });

  it("T004-plain-object-type-json-serialization", async () => {
    const frame = Test004PostFrame.of({
      passing: "hello",
      username: "ironman",
      hero: { name: "ironman", ability: "proto cannon", age: 33 },
    });

    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        username: "ironman",
        hero: "%7B%22name%22%3A%22ironman%22%2C%22ability%22%3A%22proto%20cannon%22%2C%22age%22%3A33%7D",
      },
      method: "POST",
      transformRequest: undefined,
      url: "http://some.api.google.com/jinframe/hello",
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(expectation);
  });

  it("T005-plain-object-type-array-comma-separated", async () => {
    const frame = Test005PostFrame.of({
      passing: "hello",
      username: "ironman",
      hero: ["ironman", "thor", "hulk", "doctor strange"],
    });

    const req = frame._request();

    const expectation = {
      timeout: 120000,
      headers: {
        "Content-Type": "application/json",
        username: "ironman",
        hero: "ironman,thor,hulk,doctor strange",
      },
      method: "POST",
      transformRequest: undefined,
      url: "http://some.api.google.com/jinframe/hello",
      validateStatus: undefined,
    };

    // console.log(req.headers);

    expect(req).toEqual(expectation);
  });
});
