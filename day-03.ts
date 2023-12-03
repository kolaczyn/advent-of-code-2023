import * as fs from "fs";

type NumberIsland = {
  /** coords start from zero, and the y-axis goes down */
  coords: {
    x: number;
    y: number;
  };
  value: number;
};

type PotentialGear = {
  // this field has a typo, but whatever :p
  coors: {
    x: number;
    y: number;
  };
};

const isSymbol = (char: string): boolean => {
  const isNumber = !Number.isNaN(Number(char));
  return !isNumber && char !== ".";
};

const isGear = (char: string): boolean => char === "*";

const readInput = (): string[] => {
  const input = fs.readFileSync("./inputs/day-03.txt", "utf8");
  return input.split("\n");
};

const isNumber = (char: string): boolean => !Number.isNaN(Number(char));

const scanLineForNumbers = (
  line: string,
  yCoord: number,
): { numbers: NumberIsland[]; gears: PotentialGear[] } => {
  let outputNumbers: NumberIsland[] = [];
  let outputGears: PotentialGear[] = [];
  let currNumber: string = "";
  // I pad it with '.' in order to handle case when a line ends with a number. This is a dumb hack :p
  (line + ".").split("").forEach((char, index) => {
    if (isNumber(char)) {
      currNumber += char;
      return;
      //   push existing number if needed
    }
    if (isGear(char)) {
      const gear: PotentialGear = {
        coors: {
          y: yCoord,
          x: index,
        },
      };
      outputGears.push(gear);
    }
    if (currNumber !== "") {
      const numberIsland: NumberIsland = {
        value: Number(currNumber),
        coords: {
          y: yCoord,
          x: index - currNumber.length,
        },
      };
      currNumber = "";
      outputNumbers.push(numberIsland);
    }
  });
  return { numbers: outputNumbers, gears: outputGears };
};

const isNumberIslandNextToSymbol = (
  numberIsland: NumberIsland,
  board: string[][],
): boolean => {
  const MIN_X = 0;
  const MAX_X = board[0].length;
  const MIN_Y = 0;
  const MAX_Y = board.length;

  const checkForSymbol = (x: number, y: number) => {
    if (x < MIN_X || x > MAX_X - 1 || y < MIN_Y || y > MAX_Y - 1) return false;
    const char = board[y][x];
    return isSymbol(char);
  };

  const leftBound = numberIsland.coords.x - 1;
  const rightBound = numberIsland.coords.x + String(numberIsland.value).length;
  const topBound = numberIsland.coords.y - 1;
  const bottomBound = numberIsland.coords.y + 1;

  const left = checkForSymbol(leftBound, numberIsland.coords.y);
  const right = checkForSymbol(rightBound, numberIsland.coords.y);

  const checkTop = () => {
    for (let i = leftBound; i <= rightBound; i++) {
      if (checkForSymbol(i, topBound)) {
        return true;
      }
    }
    return false;
  };

  const checkBottom = () => {
    for (let i = leftBound; i <= rightBound; i++) {
      if (checkForSymbol(i, bottomBound)) {
        return true;
      }
    }
    return false;
  };

  return left || right || checkTop() || checkBottom();
};

const MIN_X = 0;
const MAX_X = 140;
const MIN_Y = 0;
const MAX_Y = 140;

const checkIfIsGear = (
  potentialGear: PotentialGear,
  numberIslands: NumberIsland[],
): [number, number] | null => {
  const foundConnections = numberIslands.filter((numberIsland) => {
    const checkForConnection = (x: number, y: number) =>
      x === potentialGear.coors.x && y === potentialGear.coors.y;

    const leftBound = numberIsland.coords.x - 1;
    const rightBound =
      numberIsland.coords.x + String(numberIsland.value).length;
    const topBound = numberIsland.coords.y - 1;
    const bottomBound = numberIsland.coords.y + 1;

    const left = checkForConnection(leftBound, numberIsland.coords.y);
    const right = checkForConnection(rightBound, numberIsland.coords.y);

    const checkTop = () => {
      for (let i = leftBound; i <= rightBound; i++) {
        if (checkForConnection(i, topBound)) {
          return true;
        }
      }
      return false;
    };

    const checkBottom = () => {
      for (let i = leftBound; i <= rightBound; i++) {
        if (checkForConnection(i, bottomBound)) {
          return true;
        }
      }
      return false;
    };

    return left || right || checkTop() || checkBottom();
  });

  if (foundConnections.length === 2) {
    return [foundConnections[0].value, foundConnections[1].value];
  }
  return null;
};

const main = () => {
  const input = readInput();
  const board = input.map((x) => x.split(""));

  const result = input
    .map((x, y) => scanLineForNumbers(x, y))
    .flatMap((x) => x);

  const numberIslands = result.map((x) => x.numbers).flatMap((x) => x);
  const potentialGears = result.map((x) => x.gears).flatMap((x) => x);

  const gears = potentialGears
    .map((x) => checkIfIsGear(x, numberIslands))
    .filter(Boolean) as [number, number][];

  const sum = gears
    .map((x) => x[0] * x[1])
    .reduce<number>((acc, curr) => (acc += curr), 0);

  console.log(sum);

  // const sum = numberIslands
  //   .filter((x) => isNumberIslandNextToSymbol(x, board))
  //   .reduce<number>((acc, curr) => (acc += curr.value), 0);
  //
  // // console.log(debug.at(55));
  // console.log(sum);
};

main();
