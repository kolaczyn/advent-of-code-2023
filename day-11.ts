import { assert, pipe } from "./utils";

type Point = "#" | ".";
type World = Point[][];

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

const toInvertedWorld = (world: World) => {
  let out = world.map((x) => new Array(x.length));

  navigateWorld(world, (x, y, value) => {
    out[y][x] = value;
  });
  return out;
};

const findEmptyRows = (world: World): number[] => {
  let output = new Set<number>();
  world[0].forEach((_, idx) => output.add(idx));

  navigateWorld(world, (x, y, value) => {
    if (value === "#") {
      output.delete(y);
    }
  });

  return Array.from(output);
};

const findEmptyColumnsAndRows = (world: World) => {
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
    rows: Array.from(rows),
    columns: Array.from(columns),
  };
};

const expandUniverse = (world: World): World => {
  return null!;
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
    assert(findEmptyColumnsAndRows(world).columns, [2, 5, 8]);
    assert(findEmptyColumnsAndRows(world).rows, [3, 7]);
  }
};

const main = () => {};

runTests();
main();
