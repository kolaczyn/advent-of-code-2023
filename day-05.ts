import { assert, pipe } from "./utils";
import * as fs from "fs";
import { chunk } from "lodash";

type Range = [number, number, number];

type HashMap = Range[];

type World = {
  seeds: number[];
  maps: {
    seedSoil: HashMap;
    soilFertilizer: HashMap;
    fertilizerWater: HashMap;
    waterLight: HashMap;
    lightTemperature: HashMap;
    temperatureHumidity: HashMap;
    humidityLocation: HashMap;
  };
};

type ConvertedHashMap = Record<number, number>;

const parseLine = (line: string): number[] =>
  line.split(" ").map((x) => Number(x));

const parseMap = (line: string): HashMap =>
  line
    .split("\n")
    //   we have to omit the first line with the header
    .filter((x, idx) => idx !== 0)
    .map((x) => parseLine(x) as [number, number, number]);

const parseInput = (input: string): World => {
  const [
    seeds,
    seedSoil,
    soilFertilizer,
    fertilizerWater,
    waterLight,
    lightTemperature,
    temperatureHumidity,
    humidityLocation,
  ] = input.split("\n\n");

  return {
    seeds: parseLine(seeds.replace("seeds: ", "")),
    maps: {
      seedSoil: parseMap(seedSoil),
      soilFertilizer: parseMap(soilFertilizer),
      fertilizerWater: parseMap(fertilizerWater),
      waterLight: parseMap(waterLight),
      lightTemperature: parseMap(lightTemperature),
      temperatureHumidity: parseMap(temperatureHumidity),
      humidityLocation: parseMap(humidityLocation),
    },
  };
};

/** map with fallback */
const mapFall =
  (hashMap: HashMap) =>
  (key: number): number => {
    const isInRange = (range: Range, value: number) => {
      const [output, input, len] = range;
      return value >= input && value <= input + len;
    };

    const calcForOneRange = (range: Range, value: number) => {
      const [output, input, len] = range;
      return value - input + output;
    };

    const foundRange = hashMap.find((x) => isInRange(x, key));
    return foundRange ? calcForOneRange(foundRange, key) : key;
  };

const calcSeedLocation = (world: World, seed: number): number =>
  pipe(
    seed,
    mapFall(world.maps.seedSoil),
    mapFall(world.maps.soilFertilizer),
    mapFall(world.maps.fertilizerWater),
    mapFall(world.maps.waterLight),
    mapFall(world.maps.lightTemperature),
    mapFall(world.maps.temperatureHumidity),
    mapFall(world.maps.humidityLocation),
  );

function* getActualSeeds(pair: number[]) {
  const [left, right] = pair;
  for (let i = 0; i < right; i++) {
    const value = left + i;
    yield value;
  }
}

const calcResult = (world: World): number => {
  const seedsGroups = chunk(world.seeds, 2);
  let foundSeedsLocations: number[] = [];

  for (let pairs of seedsGroups.map(getActualSeeds)) {
    for (let seed of pairs) {
      const seedLocation = calcSeedLocation(world, seed);
      foundSeedsLocations.push(seedLocation);
    }
  }

  return foundSeedsLocations.sort((a, b) => (a < b ? -1 : 1))[0];
};

const runTests = (): void => {
  const expectedMaps: World["maps"] = {
    seedSoil: [
      [50, 98, 2],
      [52, 50, 48],
    ],
    soilFertilizer: [
      [0, 15, 37],
      [37, 52, 2],
      [39, 0, 15],
    ],
    fertilizerWater: [
      [49, 53, 8],
      [0, 11, 42],
      [42, 0, 7],
      [57, 7, 4],
    ],
    waterLight: [
      [88, 18, 7],
      [18, 25, 70],
    ],
    lightTemperature: [
      [45, 77, 23],
      [81, 45, 19],
      [68, 64, 13],
    ],
    temperatureHumidity: [
      [0, 69, 1],
      [1, 0, 69],
    ],
    humidityLocation: [
      [60, 56, 37],
      [56, 93, 4],
    ],
  };
  const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

  const expected: World = {
    seeds: [79, 14, 55, 13],
    maps: expectedMaps,
  };

  const world = parseInput(input);
  assert(world, expected, "parsing world");

  assert(calcResult(world), 46, "calcResult (min seed)");
};

const main = () => {
  runTests();

  // const input = fs.readFileSync("./inputs/day-05.txt", "utf8");
  // const world = parseInput(input);
  // const result = calcResult(world);
  // console.log(`The result is: ${result}`);
};

main();
