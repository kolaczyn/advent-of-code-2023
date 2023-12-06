import { assert } from "./utils";

type Race = {
  time: number;
  /** record distance */
  distance: number;
};

type World = Race[];

const isFastEnough = (race: Race, holdTime: number): boolean => {
  return race.time * holdTime - holdTime * holdTime > race.distance;
};

const calcPossibleTimes = (race: Race): number[] => {
  let found: number[] = [];
  for (let i = 0; i < race.time; i++) {
    if (isFastEnough(race, i)) {
      found.push(i);
    }
  }
  return found;
};

const calcResult = (world: World): number =>
  world
    .map(calcPossibleTimes)
    .map((x) => x.length)
    .reduce((curr, acc) => curr * acc, 1);

const runTests = () => {
  const test: World = [
    {
      time: 7,
      distance: 9,
    },
    {
      time: 15,
      distance: 40,
    },
    {
      time: 30,
      distance: 200,
    },
  ];
  assert(calcResult(test), 288);
};

// Time:        62     64     91     90
// Distance:   553   1010   1473   1074
export const main = () => {
  const data: World = [
    { time: 62, distance: 553 },
    {
      time: 64,
      distance: 1010,
    },
    {
      time: 91,
      distance: 1473,
    },
    {
      time: 90,
      distance: 1074,
    },
  ];
  runTests();

  const result = calcResult(data);
  console.log("The result is", result);
};

main();
