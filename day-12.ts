import { readFileSync } from "fs";
import { assert } from "./utils";

type Spring = "." | "#" | "?";

type Row = {
  springs: Spring[];
  recorded: number[];
};

type World = Row[];

// https://gist.github.com/higuma/9889540
const generatePermutation = <T>(perm: T[], pre: any, post: T[], n: number) => {
  let elem: T[];
  let i: number;
  let rest: T[];
  let len: number;
  if (n > 0)
    for (i = 0, len = post.length; i < len; ++i) {
      rest = post.slice(0);
      elem = rest.splice(i, 1);
      generatePermutation(perm, pre.concat(elem), rest, n - 1);
    }
  else perm.push(pre);
};

const parseLine = (input: string): Row => {
  const [springsStr, recordedStr] = input.split(" ");
  return {
    springs: springsStr.split("") as Spring[],
    recorded: recordedStr.split(",").map((x) => Number(x)),
  };
};

const isSolutionValid = (row: Row) => {
  let state = {
    /** how many a spring has occurred in a row */
    repeated: 0,
    /** which segment are we currently analyzing (the data after space in the input) */
    segmentIdx: 0,
    /** we have to keep track of the last spring, in case we go from no springs to springs */
    lastChecked: "." as Spring,
  };
  // this makes sure that the last spring is accounted for in this algorithm
  const normalizedSprings = [...row.springs, "."];
  for (const spring of normalizedSprings) {
    // this happens if a row begins with . or we are at . of length > 1
    if (spring === "." && state.repeated === 0) {
      state = {
        ...state,
        lastChecked: ".",
      };
      continue;
    }
    if (spring === ".") {
      const shouldReset = state.lastChecked === "#";
      state = shouldReset
        ? { repeated: 0, segmentIdx: state.segmentIdx + 1, lastChecked: "." }
        : state;
      continue;
    }

    if (spring === "#") {
      state = {
        repeated: state.repeated + 1,
        segmentIdx: state.segmentIdx,
        lastChecked: "#",
      };

      if (state.repeated > row.recorded[state.segmentIdx]) {
        return false;
      }
      continue;
    }

    throw new Error(`unexpected state. The parsed character is ${spring}`);
  }

  // we have to make sure that we checked all the recorded segments
  return state.segmentIdx === row.recorded.length;
};

const findUnknown = (row: Row): number[] => {
  let output: number[] = [];
  row.springs.forEach((spring, idx) => {
    if (spring === "?") {
      output.push(idx);
    }
  });
  return output;
};

const parseInput = (input: string): World =>
  input.split("\n").map((line) => parseLine(line));

const calculateRow = (row: Row): number => {
  const dunno = findUnknown(row);
  return 0;
};

const add = (accumulator: number, a: number) => accumulator + a;

const calculateResult = (world: World): number =>
  world.map(calculateRow).reduce(add, 0);

const runTests = () => {
  {
    [
      ".###.##.#...",
      ".###.##..#..",
      ".###.##...#.",
      ".###.##....#",
      ".###..##.#..",
      ".###..##..#.",
      ".###..##...#",
      ".###...##.#.",
      ".###...##..#",
      ".###....##.#",
    ].forEach((line, idx) => {
      assert(isSolutionValid(parseLine(`${line} 3,2,1`)), true, `${idx}`);
    });

    // assert(isSolutionValid(parseLine("?###???????? 3,2,1")), false);

    assert(isSolutionValid(parseLine(".###........ 3,2,1")), false);
    assert(isSolutionValid(parseLine("####..###... 3,2,1")), false);
    assert(isSolutionValid(parseLine(".###.##.#..# 3,2,1")), false);
  }

  {
    const tests: [string, number][] = [
      ["???.### 1,1,3", 1],
      [".??..??...?##. 1,1,3", 4],
      ["?#?#?#?#?#?#?#? 1,3,1,6", 1],
      ["????.#...#... 4,1,1", 1],
      ["????.######..#####. 1,6,5", 4],
      ["?###???????? 3,2,1", 10],
    ];
    tests.forEach(([input, expected], idx) => {
      const world: World = [parseLine(input)];
      assert(
        calculateResult(world),
        expected,
        `Test ${idx} with ${expected} expected`,
      );
    });
  }
  {
    const input = `\
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1\
`;

    const world = parseInput(input);
    assert(calculateResult(world), 21);
  }
};

const main = () => {
  const input = readFileSync("./inputs/day-12.txt", "utf-8");
  const world = parseInput(input);
  console.log("Result:", calculateResult(world));
};

runTests();
