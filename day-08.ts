import { assert, readInput } from "./utils";
import * as fs from "fs";

type NoteName = string;

type Direction = "R" | "L";

type DirectionsList = Direction[];

type Note = {
  name: NoteName;
  left: NoteName;
  right: NoteName;
};

type World = {
  directions: DirectionsList;
  notes: Note[];
};

const parseLine = (line: string): Note => {
  const [nameStr, directionsStr] = line.split(" = ");
  const [left, right] = directionsStr
    .replace("(", "")
    .replace(")", "")
    .split(", ");

  return {
    name: nameStr,
    left,
    right,
  };
};

const parseHeader = (line: string): DirectionsList =>
  line.split("") as DirectionsList;

const parseInput = (input: string): World => {
  const [header, lines] = input.split("\n\n");
  return {
    directions: parseHeader(header),
    notes: lines.split("\n").map(parseLine),
  };
};

function* getNextDirection(directions: DirectionsList) {
  let currIdx = 0;
  while (true) {
    yield directions[currIdx % directions.length];
    currIdx++;
  }
}

const getNoteAt = (world: World, noteName: string): Note => {
  const note = world.notes.find((x) => x.name === noteName)!;
  if (note == null) {
    throw new Error(`Note could not be found. ${noteName}`);
  }
  return note;
};

const START_NOTE_NAME = "AAA";
const END_NOTE_NAME = "ZZZ";

const findStart = (world: World): Note =>
  world.notes.find((x) => x.name === START_NOTE_NAME)!;

const traverse = (world: World): number => {
  let stepsTaken = 0;
  let current = findStart(world);

  for (let direction of getNextDirection(world.directions)) {
    const nextDestination = direction === "L" ? current.left : current.right;
    stepsTaken++;

    current = getNoteAt(world, nextDestination);
    const isAtDestination = current.name === END_NOTE_NAME;

    if (isAtDestination) {
      break;
    }
  }

  return stepsTaken;
};

const calcResult = (input: string): number => {
  const world = parseInput(input);
  return traverse(world);
};

const runTests = () => {
  {
    const input = `\
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)\
`;

    assert(calcResult(input), 2);
  }
  {
    const input = `\
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)\
`;

    assert(calcResult(input), 6);
  }
  {
    const input = `\
LLR

BBB = (AAA, ZZZ)
AAA = (BBB, BBB)
ZZZ = (ZZZ, ZZZ)\
`;

    assert(calcResult(input), 6);
  }
};

const main = () => {
  const input = fs.readFileSync(`./inputs/day-08.txt`, "utf8");
  const result = calcResult(input);
  console.log("Result:", result);
};

main();
runTests();
