import { assert, pipe } from "./utils";
import { deepStrictEqual } from "assert";
import { readFileSync } from "fs";

type Location = [number, number];
type Point = "#" | ".";
type World = Point[][];

type GalaxiesLocations = Set<Location>;

const parseInput = (input: string): World =>
  input.split("\n").map((x) => x.split("") as Point[]);

const navigateWorld = (
  world: World,
  callback: (x: number, y: number, value: Point) => void,
) => {
  for (let y = 0; y < world.length; y++)
    for (let x = 0; x < world[0].length; x++) {
      callback(x, y, world[y][x]);
    }
};

const findEmptyRowsColumns = (world: World) => {
  let columns = new Set<number>();
  world.forEach((_, idx) => columns.add(idx));

  let rows = new Set<number>();
  world[0].forEach((_, idx) => rows.add(idx));

  navigateWorld(world, (x, y, value) => {
    if (value === "#") {
      columns.delete(x);
      rows.delete(y);
    }
  });

  return {
    emptyRows: Array.from(rows),
    emptyColumns: Array.from(columns),
  };
};

const findGalaxies = (world: World): GalaxiesLocations => {
  let galaxiesLocation: GalaxiesLocations = new Set<Location>();
  navigateWorld(world, (x, y, value) => {
    if (value === "#") {
      const location: Location = [x, y];
      galaxiesLocation.add(location);
    }
  });
  return galaxiesLocation;
};

const navigateThroughGalaxyPairs = (
  galaxiesLocation: GalaxiesLocations,
  callback: (left: Location, right: Location) => void,
) => {
  const arr = Array.from(galaxiesLocation);
  for (let i = 0; i < arr.length; i++)
    for (let j = i; j < arr.length; j++) {
      if (i !== j) callback(arr[i], arr[j]);
    }
};

const countDistances = (world: World, multiplier: number): number[] => {
  const galaxies = findGalaxies(world);
  const { emptyRows, emptyColumns } = findEmptyRowsColumns(world);
  let distances: number[] = [];
  navigateThroughGalaxyPairs(galaxies, (left, right) => {
    const lowerHor = Math.min(left[0], right[0]);
    const upperHor = Math.max(left[0], right[0]);
    const lowerVer = Math.min(left[1], right[1]);
    const upperVer = Math.max(left[1], right[1]);

    let extendedRows = emptyRows.filter(
      (y) => y > lowerVer && y < upperVer,
    ).length;
    let extendedCols = emptyColumns.filter(
      (x) => x > lowerHor && x < upperHor,
    ).length;

    const regularSize = upperHor - lowerHor + upperVer - lowerVer;
    const result =
      regularSize +
      extendedRows * (multiplier - 1) +
      extendedCols * (multiplier - 1);

    return distances.push(result);
  });

  return distances;
};

const add = (accumulator: number, a: number) => accumulator + a;

const calculateResult = (input: string, multiplier: number): number => {
  const world = parseInput(input);
  return countDistances(world, multiplier).reduce(add, 0);
};

const runTests = () => {
  {
    const input = `\
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....\
`;
    const expected = `
....#........
.........#...
#............
.............
.............
........#....
.#...........
............#
.............
.............
.........#...
#....#.......\
`;

    const world = parseInput(input);
    assert(findEmptyRowsColumns(world).emptyColumns, [2, 5, 8]);
    assert(findEmptyRowsColumns(world).emptyRows, [3, 7]);
    {
      let count = 0;
      navigateThroughGalaxyPairs(findGalaxies(world), () => count++);
      assert(count, 36);
    }

    assert(calculateResult(input, 10), 1030);
    assert(calculateResult(input, 100), 8410);
  }
};

const main = () => {
  const input = readFileSync("./inputs/day-11.txt", "utf-8");
  console.log("The result is", calculateResult(input, 1_000_000));
};

runTests();
main();
