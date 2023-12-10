import { assert, pipe } from "./utils";
import { readFileSync } from "fs";

type Position = [number, number];

type Tile = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

type World = Tile[][];

type MainLoopTile = number | ".";
type MainLoopMap = MainLoopTile[][];

const parseLine = (line: string): Tile[] => line.split("") as Tile[];
const parseInput = (input: string): World => input.split("\n").map(parseLine);

const getWithOnlyMainLoop = (world: World): World => {
  return null!;
};

const mainLoopsValues = (world: World): MainLoopMap => {
  return null!;
};

const getWorldSize = (world: World): Position => {
  const width = world.length;
  const height = world[0].length;
  return [width, height];
};

const findStart = (world: World): [number, number] => {
  const [width, height] = getWorldSize(world);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (world[x][y] === "S") {
        return [x, y];
      }
    }
  }
  throw new Error("Could not find the starting location");
};

const initMapEmpty = (world: World): MainLoopMap => {
  const [width, height] = getWorldSize(world);
  let output: MainLoopMap = [];

  for (let x = 0; x < width; x++)
    for (let y = 0; y < height; y++) {
      output[x][y] = ".";
    }

  return output;
};

const findPaths = (world: World, [x, y]: Position): [Position, Position] => {
  const leftPos: Position = [x - 1, y];
  const left = world.at(leftPos[0])?.at(leftPos[1]);

  const rightPos: Position = [x + 1, y];
  const right = world.at(rightPos[0])?.at(rightPos[1]);

  const topPos: Position = [x, y - 1];
  const top = world.at(topPos[0])?.at(topPos[1]);

  const bottomPos: Position = [x, y + 1];
  const bottom = world.at(bottomPos[0])?.at(bottomPos[1]);

  let found: Position[] = [];

  if (left === "-" || left === "F" || left === "L") found.push(leftPos);
  if (right === "-" || right === "J" || right === "7") found.push(rightPos);
  if (top === "|" || top === "7" || top === "F") found.push(topPos);
  if (bottom === "|" || bottom === "L" || bottom === "J") found.push(bottomPos);

  if (found.length !== 2) {
    throw new Error("Did not find exactly two paths");
  }
  return found as [Position, Position];
};

const traverseMap = (world: World): MainLoopMap => {
  const output = initMapEmpty(world);
  const start = findStart(world);

  // TODO remember to check if you are back at the start

  return output;
};

const getValue = (tile: MainLoopTile): number => (tile === "." ? -1 : tile);

const findHighest = (mainLoop: MainLoopMap): number =>
  mainLoop
    .flatMap((x) => x)
    .reduce<number>((acc, curr) => {
      const value = getValue(curr);
      return value > acc ? value : acc;
    }, 0);

const calculateResult = (input: string): number =>
  pipe(input, parseInput, getWithOnlyMainLoop, mainLoopsValues);

const runTests = () => {
  {
    const input = `\
-L|F7
7S-7|
L|7||
-L-J|
L|-JF\
`;

    const expected = `\
.....
.S-7.
.|.|.
.L-J.
.....\
`;

    assert(findStart(parseInput(input)), [1, 1], "Find start");
    assert(
      getWithOnlyMainLoop(parseInput(input)),
      parseInput(expected),
      "find main loop",
    );
  }
};

const main = () => {
  const input = readFileSync(`./inputs/day-10.txt`, "utf8");
  const result = calculateResult(input);
  console.log("Result:", result);
};

runTests();
