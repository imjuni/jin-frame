import { expect, it } from "vitest";
import { Header } from "#decorators/fields/Header";
import { Param } from "#decorators/fields/Param";
import { Query } from "#decorators/fields/Query";
import { Get } from "#decorators/methods/Get";
import { JinFrame } from "#frames/JinFrame";

@Get({ host: "/jinframe/{passing}/test" })
class TestGet2Frame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Query()
  public declare readonly name: string;

  @Header()
  public declare readonly ttt: string;
}

it("ignore-hostname-axios-request", async () => {
  const frame = TestGet2Frame.of({
    passing: "hello",
    name: "ironman",
    ttt: "c",
  });
  const req = frame._request();
  expect(req.url).toEqual("/jinframe/hello/test?name=ironman");
});
