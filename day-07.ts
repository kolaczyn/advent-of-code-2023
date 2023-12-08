import { assert } from "./utils";
import * as fs from "fs";

const cardScores: Record<Card, number> = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 0,
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

type CardNum = { card: Card; num: number };

type OrganizedHand = {
  organized: CardNum[];
  organizedNoJoker: CardNum[];
  jokers: number;
};

const organizeHand = (hand: Hand): OrganizedHand => {
  let mapOfCards = {} as Record<Card, number>;

  for (let x of hand) {
    if (mapOfCards[x]) {
      mapOfCards[x]++;
    } else {
      mapOfCards[x] = 1;
    }
  }
  const organized = Object.entries(mapOfCards)
    .map(([key, value]) => ({
      card: key as Card,
      num: value,
    }))
    .toSorted((a, b) => {
      //   put joker at the very end, so I don't have to worry about them being one of the top cards, which might screw up some things
      if (a.card === "J") return 1;
      if (b.card === "J") return -1;
      return a.num < b.num ? 1 : -1;
    });

  const organizedNoJoker = organized.filter((x) => x.card !== "J");

  return {
    organized,
    jokers: mapOfCards["J"] ?? 0,
    organizedNoJoker,
  };
};

const printHand = (hand: Hand): string => JSON.stringify(hand, null, 2);

const isFiveOfKind = (hand: Hand): boolean => {
  const { organized, jokers } = organizeHand(hand);
  if (jokers === 5) return true;
  return organized[0].num + jokers === 5;
};

const isFourOfKind = (hand: Hand): boolean => {
  const { organized, jokers } = organizeHand(hand);
  return organized[0].num + jokers === 4;
};

const isThreeOfAKind = (hand: Hand): boolean => {
  const { organized, jokers } = organizeHand(hand);
  const bestCard = organized[0];
  return bestCard.num + jokers === 3;
};

const isFullHouse = (hand: Hand): boolean => {
  const { organized, jokers } = organizeHand(hand);
  if (jokers === 0) {
    return (
      organized.length === 2 && organized[0].num === 3 && organized[1].num === 2
    );
  }
  return organized[0].num === 2 && organized[1].num === 2 && jokers === 1;
};

const isTwoPair = (hand: Hand): boolean => {
  const { organized, jokers } = organizeHand(hand);
  return (
    organized.length === 3 &&
    organized[0].num === 2 &&
    organized[1].num === 2 &&
    organized[2].num === 1
  );
};

const isOnePair = (hand: Hand): boolean => {
  const { organized, jokers, organizedNoJoker } = organizeHand(hand);
  if (jokers === 0) {
    return organized.length === 4;
  }
  return jokers === 1;
};

const isHighCard = (hand: Hand): boolean => {
  const { organized } = organizeHand(hand);
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
  if (isFullHouse(hand)) return "fullHouse";
  if (isThreeOfAKind(hand)) return "threeOfAKind";
  if (isTwoPair(hand)) return "twoPair";
  if (isOnePair(hand)) return "onePair";
  if (isHighCard(hand)) return "highCard";
  // I think this should never happen
  throw new Error(`Invalid hand: ${printHand(hand)}`);
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

  const debugArr = sorted.map((x, idx) => {
    const multiplier = idx + 1;
    const score = multiplier * x.bid;
    return { score, multiplier, cards: x.cards };
  });

  return withScore.reduce((acc, curr) => (acc += curr), 0);
};

const runTests = () => {
  {
    assert(handToType(["J", "J", "J", "J", "J"]), "fiveOfKind");
    assert(handToType(["3", "J", "J", "J", "J"]), "fiveOfKind");
    assert(handToType(["3", "3", "J", "J", "J"]), "fiveOfKind");
    assert(handToType(["3", "3", "3", "J", "J"]), "fiveOfKind");
    assert(handToType(["3", "3", "3", "3", "J"]), "fiveOfKind");
    assert(handToType(["3", "3", "3", "3", "3"]), "fiveOfKind");
  }
  {
    assert(handToType(["K", "2", "J", "J", "J"]), "fourOfKind");
    assert(handToType(["K", "2", "2", "J", "J"]), "fourOfKind");
    assert(handToType(["K", "2", "2", "2", "J"]), "fourOfKind");
    assert(handToType(["K", "2", "2", "2", "2"]), "fourOfKind");
  }
  {
    assert(handToType(["2", "2", "2", "3", "4"]), "threeOfAKind");
    assert(handToType(["2", "2", "J", "3", "4"]), "threeOfAKind");
    assert(handToType(["2", "J", "J", "3", "4"]), "threeOfAKind");
  }
  {
    assert(handToType(["2", "2", "2", "3", "3"]), "fullHouse");
    assert(handToType(["2", "2", "J", "3", "3"]), "fullHouse");
  }
  {
    assert(handToType(["2", "2", "3", "3", "5"]), "twoPair");
  }
  {
    assert(handToType(["J", "2", "3", "4", "5"]), "onePair");
    assert(handToType(["2", "2", "3", "4", "5"]), "onePair");
  }
  {
    assert(handToType(["K", "2", "3", "4", "5"]), "highCard");
  }
  // some random examples
  {
    assert(handToType(["2", "K", "7", "A", "J"]), "onePair");
    assert(handToType(["J", "A", "4", "4", "6"]), "threeOfAKind");
    assert(handToType(["T", "4", "T", "4", "T"]), "fullHouse");
    assert(handToType(["5", "5", "5", "5", "8"]), "fourOfKind");
    assert(handToType(["T", "T", "T", "9", "J"]), "fourOfKind");
    assert(handToType(["T", "T", "T", "9", "J"]), "fourOfKind");
    assert(handToType(["T", "T", "T", "J", "J"]), "fiveOfKind");
    assert(handToType(["T", "Q", "9", "5", "J"]), "onePair");
    assert(handToType(["T", "T", "T", "J", "J"]), "fiveOfKind");
    assert(handToType(["3", "T", "T", "3", "3"]), "fullHouse");
    assert(handToType(["7", "8", "J", "7", "8"]), "fullHouse");
    assert(handToType(["K", "K", "J", "5", "K"]), "fourOfKind");
    assert(handToType(["J", "Q", "J", "Q", "Q"]), "fiveOfKind");
  }

  const input = `\
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

  assert(calcResult(input), 5905, "calcResults");
};

const main = () => {
  const input = fs.readFileSync(`./inputs/day-07.txt`, "utf8");
  const result = calcResult(input);
  console.log("The result is:", result);
};

// runTests();
main();
