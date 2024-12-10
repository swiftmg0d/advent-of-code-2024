import { off } from "node:process";
import { parseLines, readInput } from "io";
import path from "node:path";

const input = await readInput("day-10");

const getStartingPoints = (grid: number[][]): Array<[number, number]> => {
  const arr: Array<[number, number]> = [];
  grid.forEach((i, row) =>
    i.forEach((_, col) => {
      if (grid[row][col] === 0) {
        arr.push([row, col]);
      }
    })
  );
  return arr;
};
const getGrid = (lines: string[]): number[][] => {
  return lines.map((line) => line.split("").map((i) => Number(i)));
};

const directions = [
  [-1, 0],
  [1, 0],
  [0, 1],
  [0, -1],
];

const calculateTrailHeadScore = (
  grid: number[][],
  point: [number, number, number]
) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const isInBound = (row: number, col: number) => {
    return row < numRows && row >= 0 && col < numCols && col >= 0;
  };

  const queue: Array<[number, number, number]> = [point];
  const reachableNines = new Set<string>();
  const visited = new Set<string>();

  while (queue.length) {
    const [row, col, height] = queue.shift();

    if (visited.has(`${row}-${col}-${height}`)) {
      continue;
    }

    visited.add(`${row}-${col}-${height}`);

    if (grid[row][col] === 9) {
      reachableNines.add(`${row}-${col}-${height}`);
      continue;
    }

    for (const [dX, dY] of directions) {
      const newRow = row + dX;
      const newCol = col + dY;
      const rule =
        isInBound(newRow, newCol) &&
        !visited.has(`${row}-${col}-${height + 1}`) &&
        grid[newRow][newCol] === height + 1;
      if (rule) {
        queue.push([newRow, newCol, grid[newRow][newCol]]);
      }
    }
  }
  return reachableNines.size;
};

export const part1 = () => {
  const lines = parseLines(input);

  const grid: number[][] = getGrid(lines);
  const startingPoints: Array<[number, number]> = getStartingPoints(grid);

  let score = 0;
  startingPoints.forEach((point) => {
    score += calculateTrailHeadScore(grid, [point[0], point[1], 0]);
  });

  console.log(score);

  return score;
};

interface Trail {
  row: number;
  col: number;
  path: string;
}

const calculateUniqueTrails = (grid: number[][], point: [number, number]) => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const isInBound = (row: number, col: number) => {
    return row < numRows && row >= 0 && col < numCols && col >= 0;
  };

  const quene: Array<Trail> = [];
  const distinctTrails = new Set<string>();

  quene.push({ row: point[0], col: point[1], path: `${point[0]},${point[1]}` });

  while (quene.length) {
    const { row, col, path } = quene.pop()!;

    if (grid[row][col] == 9) {
      distinctTrails.add(path);
      continue;
    }

    for (const [dX, dY] of directions) {
      const [newRow, newCol] = [row + dX, col + dY];
      const rule =
        isInBound(newRow, newCol) &&
        grid[row][col] + 1 === grid[newRow][newCol];
      if (rule)
        quene.push({
          row: newRow,
          col: newCol,
          path: `${path}->${newRow},${newCol}`,
        });
    }
  }
  return distinctTrails.size;
};

export const part2 = () => {
  const lines = parseLines(input);

  const grid: number[][] = getGrid(lines);
  const startingPoints: Array<[number, number]> = getStartingPoints(grid);

  let score = 0;
  startingPoints.forEach((point) => {
    score += calculateUniqueTrails(grid, [point[0], point[1]]);
  });

  console.log(score);

  return score;
};
