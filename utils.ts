import * as fs from "fs";

export const readInput = (day: `day-${number}${number}.txt`): string[] => {
  const input = fs.readFileSync(`./inputs/${day}`, "utf8");
  return input.split("\n");
};

export const fmt = (value: unknown): string => JSON.stringify(value, null, 2);

export const assert = <T>(value: T, expected: T, label?: string): void => {
  if (JSON.stringify(value) !== JSON.stringify(expected)) {
    throw new Error(`Expected:\n${fmt(expected)}\n----\nGot: ${fmt(value)}`);
  }
  console.info(`Test passed${label ? `: ${label}` : ""}`);
};

type Pipe = <A, B, C, D, E, F, G, H, Z>(
  a: A,
  f0: (a: A) => B,
  f1?: (b: B) => C,
  f2?: (c: C) => D,
  f3?: (d: D) => E,
  f4?: (e: E) => F,
  f5?: (e: F) => G,
  f6?: (e: G) => H,
  f7?: (f: H) => Z,
) => Z;

export const pipe: Pipe = (arg0, ...functions) =>
  // @ts-expect-error: we know better than TypeScript
  functions.reduce((acc, func) => func(acc), arg0);
