import { HttpResponse, http, type PathParams } from "msw";
import { setupServer } from "msw/node";
import { afterEach, beforeEach, it } from "vitest";
import { Body } from "#decorators/fields/Body";
import { Header } from "#decorators/fields/Header";
import { Param } from "#decorators/fields/Param";
import { Query } from "#decorators/fields/Query";
import { Post } from "#decorators/methods/Post";
import { JinFrame } from "#frames/JinFrame";

@Post({
  host: "http://some.api.google.com",
  path: "/jinframe/{passing}/{id}",
})
class TestGetFrame extends JinFrame {
  @Param()
  @Query()
  @Body()
  @Header()
  public declare readonly id: string;

  @Param()
  public declare readonly passing: string;

  @Query()
  public declare readonly name: string;

  @Query({ encode: false, comma: true })
  public declare readonly skills: string[];
}

interface TestOverlapResponse {
  message: string;
}

interface TestOverlapRequestBody {
  id: string;
}

// MSW server configuration
const server = setupServer();

beforeEach(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  server.close();
});

it("overlap-param-query", async () => {
  server.use(
    http.post<PathParams<"passing">, TestOverlapRequestBody>(
      "http://some.api.google.com/jinframe/pass/3132",
      async ({ request }) => {
        const url = new URL(request.url);
        const body = await request.json();

        // Check query parameters (id is both @Param and @Query)
        const idQuery = url.searchParams.get("id");
        const name = url.searchParams.get("name");
        const skills = url.searchParams.get("skills");

        // Check body (id is @Body)
        const bodyId = body.id;

        // Check headers (id is @Header)
        const headerId = request.headers.get("id");

        if (
          idQuery === "3132" &&
          name === "ironman" &&
          skills === "beam,flying!" &&
          bodyId === "3132" &&
          headerId === "3132"
        ) {
          return HttpResponse.json<TestOverlapResponse>({
            message: "hello",
          });
        }

        return new HttpResponse("Invalid request", { status: 400 });
      },
    ),
  );

  const frame = TestGetFrame.of({
    id: "3132",
    passing: "pass",
    name: "ironman",
    skills: ["beam", "flying!"],
  });
  await frame._execute();
});
