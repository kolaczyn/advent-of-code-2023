import { assert, readInput } from "./utils";
import * as fs from "fs";

const cardScores: Record<Card, number> = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  "9": 7,
  "8": 6,
  "7": 5,
  "6": 4,
  "5": 3,
  "4": 2,
  "3": 1,
  "2": 0,
};

const handScores: Record<HandType, number> = {
  fiveOfKind: 6,
  fourOfKind: 5,
  fullHouse: 4,
  threeOfAKind: 3,
  twoPair: 2,
  onePair: 1,
  highCard: 0,
};

type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type Hand = [Card, Card, Card, Card, Card];

type Turn = {
  cards: Hand;
  bid: number;
};

type World = Turn[];

type HandType =
  | "fiveOfKind"
  | "fourOfKind"
  | "fullHouse"
  | "threeOfAKind"
  | "twoPair"
  | "onePair"
  | "highCard";

/** there are five cards in a hand */
const CARD_IN_HAND = 5;

const organizeHand = (hand: Hand): { card: Card; num: number }[] => {
  let mapOfCards = {} as Record<Card, number>;

  for (let x of hand) {
    if (mapOfCards[x]) {
      mapOfCards[x]++;
    } else {
      mapOfCards[x] = 1;
    }
  }
  return Object.entries(mapOfCards)
    .map(([key, value]) => ({
      card: key as Card,
      num: value,
    }))
    .toSorted((a, b) => (a.num < b.num ? 1 : -1));
};

const isFiveOfKind = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return organized.length === 1;
};

const isFourOfKind = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return organized.length === 2 && organized[0].num === 4;
};

const isThreeOfAKind = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return (
    organized.length === 3 &&
    organized[0].num === 3 &&
    organized[1].num === 1 &&
    organized[2].num === 1
  );
};

const isFullHouse = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return (
    organized.length === 2 && organized[0].num === 3 && organized[1].num === 2
  );
};

const isTwoPair = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return (
    organized.length === 3 &&
    organized[0].num === 2 &&
    organized[1].num === 2 &&
    organized[2].num === 1
  );
};

const isOnePair = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return (
    organized.length === 4 &&
    organized[0].num === 2 &&
    organized[1].num === 1 &&
    organized[2].num === 1 &&
    organized[3].num === 1
  );
};

const isHighCard = (hand: Hand): boolean => {
  const organized = organizeHand(hand);
  return organized.length === 5;
};

/** if the both cards have the same hand type, use this function to determine the winner */
const determineDraw = (left: Hand, right: Hand): "left" | "right" => {
  for (let i = 0; i < left.length; i++) {
    const leftScore = cardScores[left[i]];
    const rightScore = cardScores[right[i]];
    if (leftScore !== rightScore) {
      return leftScore > rightScore ? "left" : "right";
    }
  }
  // I think this should never happen
  throw new Error("");
};

const handToType = (hand: Hand): HandType => {
  if (isFiveOfKind(hand)) return "fiveOfKind";
  if (isFourOfKind(hand)) return "fourOfKind";
  if (isThreeOfAKind(hand)) return "threeOfAKind";
  if (isFullHouse(hand)) return "fullHouse";
  if (isTwoPair(hand)) return "twoPair";
  if (isOnePair(hand)) return "onePair";
  if (isHighCard(hand)) return "highCard";
  // I think this should never happen
  throw new Error(`Invalid hand: ${JSON.stringify(hand, null, 2)}`);
};

const compareHands = (left: Hand, right: Hand): 1 | 0 | -1 => {
  const leftScore = handScores[handToType(left)];
  const rightScore = handScores[handToType(right)];

  if (leftScore > rightScore) return 1;
  if (leftScore < rightScore) return -1;
  const drawResult = determineDraw(left, right);
  return drawResult === "left" ? 1 : -1;
};

const parseLine = (line: string): Turn => {
  const [cards, bid] = line.split(" ");
  return {
    cards: cards.split("") as Hand,
    bid: Number(bid),
  };
};

const parseInput = (input: string): World => input.split("\n").map(parseLine);

const calcResult = (input: string): number => {
  const world = parseInput(input);
  const sorted = world.toSorted((left, right) =>
    compareHands(left.cards, right.cards),
  );
  const withScore: number[] = sorted.map((x, idx) => {
    const multiplier = idx + 1;
    return multiplier * x.bid;
  });
  return withScore.reduce((acc, curr) => (acc += curr), 0);
};

const runTests = () => {
  const input = `\
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  assert(calcResult(input), 6440, "calcResults");
};

const main = () => {
  const input = fs.readFileSync(`./inputs/day-07.txt`, "utf8");
  const result = calcResult(input);
  console.log("The result is:", result);
};

runTests();
main();
