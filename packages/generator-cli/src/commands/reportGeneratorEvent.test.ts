import { afterEach, expect, it, vi } from "vitest";
import consola from "consola";
import { reportGeneratorEvent } from "#commands/reportGeneratorEvent.js";

afterEach(() => vi.restoreAllMocks());

it("should route diagnostic severity when reporting diagnostics", () => {
  const warn = vi.spyOn(consola, "warn").mockImplementation(() => {});
  const info = vi.spyOn(consola, "info").mockImplementation(() => {});
  const diagnostic = {
    type: "diagnostic",
    code: "UNSUPPORTED_SECURITY_SCHEME",
    schemeName: "oauth",
    message: "Configure a provider",
  } as const;
  reportGeneratorEvent({ ...diagnostic, severity: "warning" });
  reportGeneratorEvent({ ...diagnostic, severity: "info" });
  expect(warn).toHaveBeenCalledWith("[UNSUPPORTED_SECURITY_SCHEME] Configure a provider");
  expect(info).toHaveBeenCalledWith("[UNSUPPORTED_SECURITY_SCHEME] Configure a provider");
});

it("should report stages at info level and counts at debug level", () => {
  const info = vi.spyOn(consola, "info").mockImplementation(() => {});
  const debug = vi.spyOn(consola, "debug").mockImplementation(() => {});
  reportGeneratorEvent({ type: "stage", stage: "generate-frames", state: "started" });
  reportGeneratorEvent({ type: "progress", stage: "generate-frames", completed: 2, total: 3 });
  expect(info).toHaveBeenCalledWith("generate-frames: started");
  expect(debug).toHaveBeenCalledWith("generate-frames: 2/3");
});
