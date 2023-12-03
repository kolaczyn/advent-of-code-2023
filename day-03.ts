import * as fs from "fs";

type NumberIsland = {
  /** coords start from zero, and the y-axis goes down */
  coords: {
    x: number;
    y: number;
  };
  value: number;
};

const isSymbol = (char: string): boolean => {
  const isNumber = !Number.isNaN(Number(char));
  return !isNumber && char !== ".";
};

const readInput = (): string[] => {
  const input = fs.readFileSync("./inputs/day-03.txt", "utf8");
  return input.split("\n");
};

const isNumber = (char: string): boolean => !Number.isNaN(Number(char));

const scanLineForNumbers = (line: string, yCoord: number): NumberIsland[] => {
  let output: NumberIsland[] = [];
  let currNumber: string = "";
  // I pad it with '.' in order to handle case when a line ends with a number. This is a dumb hack :p
  (line + ".").split("").forEach((char, index) => {
    if (isNumber(char)) {
      currNumber += char;
    } else if (currNumber !== "") {
      const numberIsland: NumberIsland = {
        value: Number(currNumber),
        coords: {
          y: yCoord,
          x: index - currNumber.length,
        },
      };
      currNumber = "";
      output.push(numberIsland);
    }
  });
  return output;
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

const main = () => {
  const input = readInput();
  const board = input.map((x) => x.split(""));

  const numberIslands = input
    .map((x, y) => scanLineForNumbers(x, y))
    .flatMap((x) => x);

  const sum = numberIslands
    .filter((x) => isNumberIslandNextToSymbol(x, board))
    .reduce<number>((acc, curr) => (acc += curr.value), 0);

  // console.log(debug.at(55));
  console.log(sum);
};

main();
