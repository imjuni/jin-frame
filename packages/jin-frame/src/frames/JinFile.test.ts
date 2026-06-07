import { describe, expect, it } from "vitest";
import { JinFile } from "#frames/JinFile";

describe("JinFile", () => {
  it("formatter", () => {
    const jf = new JinFile("test", Buffer.from("ironman"));
    expect(jf.file.toString()).toEqual("ironman");
    expect(jf.name).toEqual("test");
  });
});
