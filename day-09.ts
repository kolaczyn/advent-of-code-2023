import { assert } from "./utils";
import * as fs from "fs";

type Line = number[];

type World = Line[];

const parseLine = (line: string): Line => line.split(" ").map((y) => Number(y));

const parseInput = (input: string): World => input.split("\n").map(parseLine);

const goDownLine = (line: Line): Line => {
  let output: Line = [];

  for (let idx = 0; idx < line.length - 1; idx++) {
    const diff = line[idx + 1] - line[idx];
    output.push(diff);
  }

  return output;
};

const isEndLine = (line: Line): boolean => line.every((x) => x === 0);

const getLinesToTheEnd = (line: Line): Line[] => {
  let allLines: Line[] = [line];
  let currentLine: Line = line;
  while (true) {
    currentLine = goDownLine(currentLine);
    allLines.push(currentLine);
    if (isEndLine(currentLine)) {
      break;
    }
  }

  return allLines;
};

const calculateNextValue = (line: Line): number => {
  const allLines = getLinesToTheEnd(line).toReversed();
  let currDifference: number = 0;

  for (let idx = 1; idx < allLines.length; idx++) {
    currDifference = allLines[idx].at(0)! - currDifference;
  }

  return currDifference;
};

const calculateResult = (input: string): number => {
  const world = parseInput(input);
  return world.reduce((acc, curr) => (acc += calculateNextValue(curr)), 0);
};

const runTests = () => {
  const input = `\
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

  assert(calculateResult(input), 2);
};

const main = () => {
  const input = fs.readFileSync(`./inputs/day-09.txt`, "utf8");
  const result = calculateResult(input);
  console.log("The result is:", result);
};

runTests();
main();
