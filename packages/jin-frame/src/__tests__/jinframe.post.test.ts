import { HttpResponse, http, type PathParams } from "msw";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Body } from "#decorators/fields/Body";
import { Header } from "#decorators/fields/Header";
import { Param } from "#decorators/fields/Param";
import { Post } from "#decorators/methods/Post";
import { JinFrame } from "#frames/JinFrame";

@Post({ host: "http://some.api.google.com/jinframe/{passing}" })
class TestPostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body({ replaceAt: "test.hello.marvel.name" })
  public declare readonly name: string;

  @Header({ replaceAt: "test.hello.marvel.skill" })
  public declare readonly skill: string;

  @Body({ replaceAt: "test.hello.marvel.gender" })
  public declare readonly gender: string;
}

@Post({
  host: "http://some.api.google.com/jinframe/{passing}",
  contentType: "application/x-www-form-urlencoded",
})
class TestUrlencodedPostFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Body()
  public declare readonly username: string;

  @Body()
  public declare readonly password: string;
}

interface TestPostFrameBody {
  test: {
    hello: {
      marvel: { name: string; gender: string };
    };
  };
}

interface TestUrlencodedPostFrameBody {
  username: string;
  password: string;
}

describe("jinframe.test", () => {
  // MSW server configuration
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    server.close();
  });

  it("msw-post-with-jinframe", async () => {
    server.use(
      http.post<PathParams<"passing">, TestPostFrameBody>(
        "http://some.api.google.com/jinframe/pass",
        async ({ request }) => {
          // JSON body validation
          const body = await request.json();
          if (body?.test?.hello?.marvel?.name === "ironman" && body?.test?.hello?.marvel?.gender === "male") {
            return HttpResponse.json({
              message: "hello",
            });
          }

          return new HttpResponse("Invalid body", { status: 400 });
        },
      ),
    );

    const frame = TestPostFrame.of({
      passing: "pass",
      name: "ironman",
      skill: "beam",
      gender: "male",
    });
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });

  it("msw-post-without-either-jinframe", async () => {
    server.use(
      http.post<PathParams<"passing">, TestPostFrameBody>(
        "http://some.api.google.com/jinframe/pass",
        async ({ request }) => {
          // JSON body validation
          const body = await request.json();
          if (body?.test?.hello?.marvel?.name === "ironman" && body?.test?.hello?.marvel?.gender === "male") {
            return HttpResponse.json({
              message: "hello",
            });
          }

          return new HttpResponse("Invalid body", { status: 400 });
        },
      ),
    );

    const frame = TestPostFrame.of({
      passing: "pass",
      name: "ironman",
      skill: "beam",
      gender: "male",
    });
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });

  it("msw-post-urlencoded", async () => {
    server.use(
      http.post<PathParams<"passing">, TestUrlencodedPostFrameBody>(
        "http://some.api.google.com/jinframe/pass",
        async ({ request }) => {
          // URL-encoded body validation
          const formData = await request.formData();
          const username = formData.get("username");
          const password = formData.get("password");

          if (username === "ironman" && password === "marvel") {
            return HttpResponse.json({
              message: "hello",
            });
          }

          return new HttpResponse("Invalid form data", { status: 400 });
        },
      ),
    );

    const frame = TestUrlencodedPostFrame.of({
      passing: "pass",
      username: "ironman",
      password: "marvel",
    });
    const resp = await frame._execute();

    expect(resp.status).toEqual(200);
  });
});
