import { parseLines, readInput } from "io";
import { isNumber } from "../utils/index";

const input = await readInput("day-09");

function getLine() {
  const line = input
    .split("")
    .map((digit, i) =>
      i % 2 === 0
        ? Array(Number(digit)).fill(i / 2)
        : Array(Number(digit)).fill(".")
    )
    .filter((item) => item.length)
    .flat();

  return [...line];
}

export const part1 = () => {
  const tempLine = getLine();
  let length = tempLine.length - 1;
  const stop = length - tempLine.filter((i) => i === ".").length;
  let dotIndex = tempLine.findIndex((i) => i === ".");

  while (length) {
    if (length === stop) {
      break;
    }
    if (!isNaN(Number(tempLine[length]))) {
      [tempLine[dotIndex], tempLine[length]] = [tempLine[length], "."];
      dotIndex = tempLine.findIndex((i) => i === ".");
    }
    length--;
  }

  const checksum = tempLine.reduce((acc, val, i) => {
    return !isNaN(Number(val)) ? acc + i * Number(val) : acc;
  }, 0);

  console.log(checksum);
  return checksum;
};

export const part2 = () => {
  const files = input.split("").map((size, i) => ({
    id: i % 2 === 0 ? i / 2 : null,
    size: Number(size),
  }));

  for (let i = files.length - 1; i > 1; i--) {
    if (files[i].id != null) {
      for (let j = 0; j < i; j++) {
        const leftFile = files[j];
        if (leftFile.id == null) {
          const rightFile = files[i];
          if (leftFile.size >= rightFile.size) {
            files.splice(i, 1, { id: null, size: rightFile.size });
            files.splice(j, 0, rightFile);
            leftFile.size -= rightFile.size;
            break;
          }
        }
      }
    }
  }

  let checksum = 0;
  let blockIndex = 0;
  for (const block of files) {
    if (block.id !== null) {
      for (let i = 0; i < block.size; i++) {
        checksum += block.id * blockIndex;
        blockIndex++;
      }
    } else {
      blockIndex += block.size;
    }
  }
  console.log(checksum);
  return checksum;
};
