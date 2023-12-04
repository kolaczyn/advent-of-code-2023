import * as fs from "fs";

export const readInput = (day: `day-${number}${number}.txt`): string[] => {
  const input = fs.readFileSync(`./inputs/${day}`, "utf8");
  return input.split("\n");
};
