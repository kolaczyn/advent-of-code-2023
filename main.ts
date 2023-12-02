import * as fs from "fs";
import { match } from "assert";

type Match = {
  red: number;
  green: number;
  blue: number;
};

type ColorName = "red" | "green" | "blue";

type Game = {
  index: number;
  matches: Match[];
};

const colorStrToColor = (str: String): { color: ColorName; value: number } => {
  const [num, colorName] = str.split(" ");
  return {
    value: Number(num),
    color: colorName as ColorName,
  };
};

const matchStringToMatch = (str: string): Match => {
  const colors = str.split(", ");
  let match: Match = {
    red: 0,
    green: 0,
    blue: 0,
  };
  colors.forEach((x) => {
    const color = colorStrToColor(x);
    match[color.color] = color.value;
  });
  return match;
};

const matchesStringToMatches = (str: string): Match[] =>
  str.split("; ").map(matchStringToMatch);

const lineToGame = (line: string): Game => {
  const [gamePart, matchPart] = line.split(": ");
  const gameNumber = Number(gamePart.replace("Game ", ""));
  return {
    index: gameNumber,
    matches: matchesStringToMatches(matchPart),
  };
};

const isMatchPossible = (match: Match) =>
  match.red <= 12 && match.green <= 13 && match.blue <= 14;

const isGamePossible = (game: Game) =>
  game.matches.map(isMatchPossible).every((x) => x);

const input = fs.readFileSync("input.txt", "utf8");
const result = input
  .split("\n")
  .map(lineToGame)
  .reduce((acc, curr) => (acc += isGamePossible(curr) ? curr.index : 0), 0);

console.log(result);
