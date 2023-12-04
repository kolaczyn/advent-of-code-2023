import { readInput } from "./utils";
import { cloneDeep, now, reverse } from "lodash";

type Card = {
  winning: string[];
  drawn: string[];
  number: number;
};
const parseLine = (line: string): Card => {
  const regex = /Card (.*): (.*) \| (.*)/;
  const match = line.match(regex)!;
  const [_, number, winning, drawn] = match;

  const parseList = (list: string): string[] =>
    list.replaceAll("  ", " ").split(" ");

  return {
    winning: parseList(winning),
    drawn: parseList(drawn),
    number: Number(number),
  };
};

const fmt = (value: unknown): string => JSON.stringify(value, null, 2);

const assert = (value: unknown, expected: unknown): void => {
  if (JSON.stringify(value) !== JSON.stringify(expected)) {
    throw new Error(`Expected:\n${fmt(expected)}\n----\nGot: ${fmt(value)}`);
  }
};

const getNumberOfWinningCards = (lottery: Card): number => {
  const winningTickets = lottery.drawn.filter((x) =>
    lottery.winning.includes(x),
  );
  return winningTickets.length;
};

const getLotteryScore = (lottery: Card): number => {
  const winningTickets = getNumberOfWinningCards(lottery);

  if (winningTickets === 0) {
    return 0;
  }

  return 2 ** (winningTickets - 1);
};

const testCasesParse: [string, Card][] = [
  [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    {
      winning: ["41", "48", "83", "86", "17"],
      drawn: ["83", "86", "6", "31", "17", "9", "48", "53"],
      number: 1,
    },
  ],
];

const getPrize = (currentCard: Card, allCards: Card[]): Card[] => {
  const MAX_INDEX = allCards.length - 1;
  const winningCardsNum = getNumberOfWinningCards(currentCard);
  return allCards.slice(
    currentCard.number,
    Math.min(currentCard.number + winningCardsNum, MAX_INDEX + 1),
  );
};

const printCards = (cards: Card[]): string => {
  return cards
    .map((x) => x.number)
    .map((x) => `>${x}<`)
    .join(", ");
};

const calcTotalScratchcards = (input: string[]): number => {
  const lotteries = input.map(parseLine);
  let cardsInPossession = reverse(cloneDeep(lotteries));
  const winningCards = lotteries.filter((x) => getLotteryScore(x) !== 0);
  // console.log("winning cards: ", printCards(winningCards));
  let sum = 0;
  // console.log("initial sum", sum);
  while (cardsInPossession.length > 0) {
    sum++;
    const card = cardsInPossession.pop();
    const nowWon = getPrize(card!, lotteries);
    // if (nowWon.length > 0) {
    //   console.log(
    //     "You won cards with card no.",
    //     card?.number,
    //     ":",
    //     printCards(nowWon),
    //   );
    // }
    cardsInPossession = [...cardsInPossession, ...reverse(nowWon)];
  }
  return sum;
};

const testParseLine = () => {
  testCasesParse.forEach(([input, expected]) =>
    assert(parseLine(input), expected),
  );

  // assert(
  //   getLotteryScore(
  //     parseLine("Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53"),
  //   ),
  //   8,
  // );

  const input = [
    "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
    "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
  ];
  // assert(getPrize(parseLine(input[0]), input.map(parseLine)), 0);
  assert(calcTotalScratchcards(input), 30);
};

const main = () => {
  testParseLine();

  const resultPartOne = readInput("day-04.txt")
    .map(parseLine)
    .map(getLotteryScore)
    .reduce((curr, acc) => (curr += acc), 0);

  const input = readInput("day-04.txt");
  const resultPartTwo = calcTotalScratchcards(input);
  console.log(resultPartTwo);
};

main();
