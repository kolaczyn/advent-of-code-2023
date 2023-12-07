import { assert } from "./utils";

type World = {
  time: number;
  /** record distance */
  distance: number;
};

const isFastEnough = (race: World, holdTime: number): boolean => {
  return race.time * holdTime - holdTime * holdTime > race.distance;
};

const calcPossibleTimes = (race: World): number => {
  let found: number[] = [];
  for (let i = 0; i < race.time; i++) {
    if (isFastEnough(race, i)) {
      found.push(i);
    }
  }
  return found.length;
};

const runTests = () => {
  const test: World = {
    time: 71530,
    distance: 940200,
  };
  assert(calcPossibleTimes(test), 71503);
};

// Time:        62     64     91     90
// Distance:   553   1010   1473   1074
export const main = () => {
  const world: World = {
    time: 62649190,
    distance: 553101014731074,
  };
  runTests();

  const result = calcPossibleTimes(world);
  console.log("The result is", result);
};

main();
