import exp from "constants";
import { parseLines, readInput } from "io";

const input = await readInput("day-11");

export const part1 = () => {
  let blinks = 25;

  let queue: string[] = input[0].split(" ");

  while (blinks > 0) {
    let newQueue: string[] = [];

    for (let number of queue) {
      if (number === "0") {
        newQueue.push("1");
      } else if (number.length % 2 === 0) {
        const half = number.length / 2;
        const leftNumber = number.slice(0, half);
        const rightNumber = number.slice(half);
        newQueue.push(
          Number(leftNumber).toString(),
          Number(rightNumber).toString()
        );
      } else {
        const multiplied = (Number(number) * 2024).toString();
        newQueue.push(multiplied);
      }
    }

    queue = newQueue;
    blinks--;
  }
  return queue.length;
};

export const part2 = () => {
  function countOccurrences(arr: number[]): Map<number, number> {
    const counter = new Map<number, number>();
    for (const num of arr) {
      counter.set(num, (counter.get(num) || 0) + 1);
    }
    return counter;
  }

  const stones = countOccurrences(input[0].split(" ").map(Number));

  for (let blinks = 1; blinks <= 75; blinks++) {
    const newStones = new Map<number, number>();

    stones.forEach((numStone, n) => {
      const strN = n.toString();
      const mid = Math.floor(strN.length / 2);
      const rem = strN.length % 2;

      if (n === 0) {
        newStones.set(1, (newStones.get(1) || 0) + numStone);
      } else if (rem) {
        const key = 2024 * n;
        newStones.set(key, (newStones.get(key) || 0) + numStone);
      } else {
        const firstPart = Math.floor(n / 10 ** mid);
        const secondPart = n % 10 ** mid;
        newStones.set(firstPart, (newStones.get(firstPart) || 0) + numStone);
        newStones.set(secondPart, (newStones.get(secondPart) || 0) + numStone);
      }
    });

    stones.clear();
    newStones.forEach((value, key) => {
      stones.set(key, value);
    });

    if (blinks === 75) {
      const totalStones = Array.from(newStones.values()).reduce(
        (a, b) => a + b,
        0
      );
      return totalStones;
    }
  }
};
