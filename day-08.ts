import { assert } from "./utils";
import * as fs from "fs";

type NoteName = string;

type Direction = "R" | "L";

type DirectionsList = Direction[];

type Note = {
  name: NoteName;
  left: NoteName;
  right: NoteName;
  isEnd: boolean;
};

type World = {
  directions: DirectionsList;
  notes: Record<string, Note>;
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
    isEnd: isEndingNote({ name: nameStr }),
  };
};

const parseHeader = (line: string): DirectionsList =>
  line.split("") as DirectionsList;

const parseInput = (input: string): World => {
  const [header, lines] = input.split("\n\n");
  const notesArr = lines.split("\n").map(parseLine);

  const notesMap: Record<string, Note> = {};
  notesArr.forEach((x) => {
    notesMap[x.name] = x;
  });

  return {
    directions: parseHeader(header),
    notes: notesMap,
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
  const note = world.notes[noteName];
  if (note == null) {
    throw new Error(`Note could not be found. ${noteName}`);
  }
  return note;
};

const START_NOTE_NAME = "AAA";
const END_NOTE_NAME = "ZZZ";

const isStartingNote = (note: Note): boolean => note.name.endsWith("A");
const isEndingNote = (note: { name: string }): boolean =>
  note.name.endsWith("Z");

const findStartingNotes = (world: World): Note[] =>
  Object.values(world.notes).filter(isStartingNote);

const traverse = (world: World): number => {
  let stepsTaken = 0;
  let current = findStartingNotes(world);

  for (let direction of getNextDirection(world.directions)) {
    current = current.map((x): Note => {
      const nextDestination = direction === "L" ? x.left : x.right;
      return getNoteAt(world, nextDestination);
    });
    stepsTaken++;

    const isAtDestination = current.every((x) => x.isEnd);

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
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)\
`;

    assert(calcResult(input), 6);
  }
};

const readInput = (): string => fs.readFileSync(`./inputs/day-08.txt`, "utf8");

const main = () => {
  const input = readInput();
  const result = calcResult(input);
  console.log("Result:", result);
};

runTests();
main();
