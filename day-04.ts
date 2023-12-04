import { readInput } from "./utils";
import exp = require("constants");

type Lottery = {
  winning: string[];
  drawn: string[];
};
const parseLine = (line: string): Lottery => {
  const regex = /Card (.*): (.*) \| (.*)/;
  const match = line.match(regex)!;
  const [_, number, winning, drawn] = match;

  const parseList = (list: string): string[] =>
    list.replaceAll("  ", " ").split(" ");
  return {
    winning: parseList(winning),
    drawn: parseList(drawn),
  };
};

const fmt = (value: unknown): string => JSON.stringify(value, null, 2);

const assert = (value: unknown, expected: unknown): void => {
  if (JSON.stringify(value) !== JSON.stringify(expected)) {
    throw new Error(`Expected:\n${fmt(expected)}}\n----\nGot: ${fmt(value)}`);
  }
};

const getLotteryScore = (lottery: Lottery): number => {
  const winningTickets = lottery.drawn.filter((x) =>
    lottery.winning.includes(x),
  );

  if (winningTickets.length === 0) {
    return 0;
  }

  return 2 ** (winningTickets.length - 1);
};

const testCasesParse: [string, Lottery][] = [
  [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    {
      winning: ["41", "48", "83", "86", "17"],
      drawn: ["83", "86", "6", "31", "17", "9", "48", "53"],
    },
  ],
];

const testParseLine = () => {
  testCasesParse.forEach(([input, expected]) =>
    assert(parseLine(input), expected),
  );

  assert(
    getLotteryScore(
      parseLine("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"),
    ),
    8,
  );
};

const main = () => {
  const result = readInput("day-04.txt")
    .map(parseLine)
    .map(getLotteryScore)
    .reduce((curr, acc) => (curr += acc), 0);
  console.log(result);
};

main();
