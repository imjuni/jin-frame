import { describe, expect, it } from "vitest";
import { getMethodDecorator } from "#generators/content-type/getMethodDecorator.js";

describe("getMethodDecorator", () => {
  it("should return decorator when empty content-type", () => {
    const decorator = getMethodDecorator({ host: "host", path: "path", method: "Get" });
    expect(decorator).toEqual({
      name: "Get",
      kind: 7,
      arguments: ["{ host: 'host', path: 'path' }"],
    });
  });

  it("should return decorator when empty content-type", () => {
    const decorator = getMethodDecorator({
      host: "host",
      path: "path",
      method: "Get",
      contentType: "application/x-www-form-urlencoded",
    });
    expect(decorator).toEqual({
      name: "Get",
      kind: 7,
      arguments: ["{ host: 'host', path: 'path', contentType: 'application/x-www-form-urlencoded' }"],
    });
  });

  it("should include host override when base frame is configured", () => {
    const decorator = getMethodDecorator({
      baseFrame: "ServerHostFrame",
      host: "host",
      hostOverride: "https://override.example.com",
      path: "/pets/{petId}",
      method: "Get",
    });

    expect(decorator).toEqual({
      name: "Get",
      kind: 7,
      arguments: ["{ host: 'https://override.example.com', path: '/pets/{petId}' }"],
    });
  });
});
