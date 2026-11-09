import { afterEach, expect, it, vi } from "vitest";
import consola from "consola";
import { createProgressReporter } from "./createProgressReporter.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

it("should show progress and release timers when interactive generation completes", () => {
  const previousLevel = consola.level;
  consola.level = 3;
  vi.useFakeTimers();
  vi.stubEnv("CI", "");
  vi.stubEnv("TERM", "xterm");
  const original = Object.getOwnPropertyDescriptor(process.stderr, "isTTY");
  Object.defineProperty(process.stderr, "isTTY", { configurable: true, value: true });
  const write = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
  const reporter = createProgressReporter();
  reporter.onEvent({ type: "stage", stage: "generate-frames", state: "started" });
  reporter.onEvent({ type: "progress", stage: "generate-frames", completed: 2, total: 2 });
  reporter.writing();
  reporter.finish(3, "./generated");
  reporter.dispose();
  expect(write.mock.calls.flat().join("")).toContain("100% · 2/2");
  expect(write.mock.calls.flat().join("")).toContain("Wrote 3 files");
  expect(vi.getTimerCount()).toBe(0);
  consola.level = previousLevel;
  if (original) {
    Object.defineProperty(process.stderr, "isTTY", original);
  } else {
    Reflect.deleteProperty(process.stderr, "isTTY");
  }
});

it("should report failure without a success summary when generation fails", () => {
  vi.stubEnv("CI", "true");
  const error = vi.spyOn(consola, "error").mockImplementation(() => {});
  const reporter = createProgressReporter();
  reporter.writing();
  reporter.fail();
  reporter.dispose();
  expect(error).toHaveBeenCalledWith("Failed: Writing generated files");
});

it("should forward stage and diagnostic events when running in CI", () => {
  vi.stubEnv("CI", "true");
  const info = vi.spyOn(consola, "info").mockImplementation(() => {});
  const warn = vi.spyOn(consola, "warn").mockImplementation(() => {});
  const reporter = createProgressReporter();
  reporter.onEvent({ type: "stage", stage: "load-spec", state: "started" });
  reporter.onEvent({
    type: "diagnostic",
    severity: "warning",
    code: "UNSUPPORTED_SECURITY_SCHEME",
    schemeName: "oauth",
    message: "Configure a provider",
  });
  reporter.dispose();
  expect(info).toHaveBeenCalledWith("load-spec: started");
  expect(warn).toHaveBeenCalledWith("[UNSUPPORTED_SECURITY_SCHEME] Configure a provider");
});
