import { clearLine, cursorTo } from "node:readline";
import type { GeneratorEvent } from "@jin-frame/generator-core";
import consola from "consola";
import { reportGeneratorEvent } from "#commands/reportGeneratorEvent.js";

const labels: Record<string, string> = {
  "load-spec": "Loading OpenAPI specification",
  "generate-types": "Generating TypeScript definitions",
  "resolve-references": "Resolving references",
  "load-templates": "Loading templates",
  "generate-frames": "Generating endpoint frames",
};

export function createProgressReporter() {
  const stream = process.stderr;
  const interactive = Boolean(stream.isTTY && !process.env.CI && process.env.TERM !== "dumb");
  const started = performance.now();
  const symbols = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let timer: ReturnType<typeof setInterval> | undefined;
  let text = "";
  let tick = 0;
  let lastDraw = 0;
  const enabled = () => consola.level >= 3;
  const clear = () => {
    if (interactive && enabled()) {
      cursorTo(stream, 0);
      clearLine(stream, 0);
    }
  };
  const draw = () => {
    if (!interactive || !enabled()) {
      return;
    }
    clear();
    stream.write(`${symbols[tick % symbols.length]} ${text}`.slice(0, Math.max(1, (stream.columns || 80) - 1)));
    tick += 1;
    lastDraw = performance.now();
  };
  const stop = () => {
    clearInterval(timer);
    timer = undefined;
    clear();
  };
  const start = (message: string) => {
    stop();
    text = message;
    draw();
    if (interactive && enabled()) {
      timer = setInterval(draw, 80);
      timer.unref();
    }
  };
  const complete = (message: string) => {
    stop();
    if (enabled()) {
      if (interactive) {
        stream.write(`✔ ${message}\n`);
      } else {
        consola.info(message);
      }
    }
  };
  return {
    onEvent(event: GeneratorEvent) {
      if (!interactive) {
        reportGeneratorEvent(event);
        return;
      }
      if (event.type === "diagnostic") {
        clear();
        reportGeneratorEvent(event);
        if (timer) {
          draw();
        }
      } else if (event.type === "stage") {
        const label = labels[event.stage] ?? event.stage;
        if (event.state === "started") {
          start(label);
        } else {
          complete(`${label} — done`);
        }
      } else {
        const ratio = event.total > 0 ? Math.min(1, event.completed / event.total) : 1;
        const filled = Math.round(ratio * 20);
        text = `Generating endpoint frames [${"█".repeat(filled)}${"░".repeat(20 - filled)}] ${Math.round(ratio * 100)}% · ${event.completed}/${event.total}`;
        if (performance.now() - lastDraw >= 40 || event.completed === event.total) {
          draw();
        }
      }
    },
    writing() {
      start("Writing generated files");
    },
    finish(files: number, output: string) {
      complete(`Wrote ${files} files`);
      complete(`Done in ${((performance.now() - started) / 1000).toFixed(1)}s → ${output}`);
    },
    fail() {
      if (text) {
        stop();
        consola.error(`Failed: ${text}`);
      }
    },
    dispose: stop,
  };
}
