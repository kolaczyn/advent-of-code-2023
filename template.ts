import { readFileSync } from "fs";
import { assert } from "./utils";

type Row = unknown;

type World = Row[];

const parseLine = (input: string): Row => {
  return null!;
};

const parseInput = (input: string): World =>
  input.split("\n").map((line) => parseLine(line));

const calculateRow = (row: Row): number => {
  return 0;
};

const add = (accumulator: number, a: number) => accumulator + a;

const calculateResult = (world: World): number =>
  world.map(calculateRow).reduce(add, 0);

const runTests = () => {
  {
    const input = `\
\
`;

    assert(calculateResult(parseInput(input)), 0);
  }
};

const main = () => {
  const day = "12";
  const input = readFileSync(`./inputs/day-${day}.txt`, "utf-8");
  const world = parseInput(input);
  console.log("Result:", calculateResult(world));
};

runTests();
main();
