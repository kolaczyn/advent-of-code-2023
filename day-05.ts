import { assert, pipe, readInput } from "./utils";
import { cloneDeep } from "lodash";
import * as fs from "fs";
import { Hash } from "crypto";

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

type ConvertedHashMapsList = {
  seedSoil: ConvertedHashMap;
  soilFertilizer: ConvertedHashMap;
  fertilizerWater: ConvertedHashMap;
  waterLight: ConvertedHashMap;
  lightTemperature: ConvertedHashMap;
  temperatureHumidity: ConvertedHashMap;
  humidityLocation: ConvertedHashMap;
};

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

const mapToJson = (hashMap: HashMap): ConvertedHashMap => {
  let output: Record<number, number> = {};
  hashMap.forEach(([y, x, z]) => {
    for (let i = 0; i < z; i++) {
      output[x + i] = y + i;
    }
  });

  return output;
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

const calcSeedLocation = (world: World, seed: number): number => {
  return pipe(
    seed,
    mapFall(world.maps.seedSoil),
    mapFall(world.maps.soilFertilizer),
    mapFall(world.maps.fertilizerWater),
    mapFall(world.maps.waterLight),
    mapFall(world.maps.lightTemperature),
    mapFall(world.maps.temperatureHumidity),
    mapFall(world.maps.humidityLocation),
  );
};

const calcResult = (world: World): number => {
  const seedsLocations = world.seeds.map((seed, idx) => {
    console.log("running at", idx, seed, JSON.stringify(world, null, 2));
    return calcSeedLocation(world, seed);
  });

  return seedsLocations.sort((a, b) => (a < b ? -1 : 1))[0];
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

  assert(calcSeedLocation(world, 79), 82, "calcLocation0");
  assert(calcSeedLocation(world, 14), 43, "calcLocation1");
  assert(calcSeedLocation(world, 55), 86, "calcLocation2");
  assert(calcSeedLocation(world, 13), 35, "calcLocation3");

  assert(calcResult(world), 35, "calcResult (min seed)");
};

const main = () => {
  runTests();

  const input = fs.readFileSync("./inputs/day-05.txt", "utf8");
  const world = parseInput(input);
  const result = calcResult(world);
  console.log(`The result is: ${result}`);
};

main();
