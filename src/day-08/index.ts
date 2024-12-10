import { parseLines, readInput } from "io";
const input = await readInput("day-08");

interface Position {
  x: number;
  y: number;
}

const extractAntennas = (
  input: string
): {
  signalSources: Map<string, Position[]>;
  gridWidth: number;
  gridHeight: number;
} => {
  const rows = input.split("\n").filter((line) => line.length > 1);
  const signalSources = new Map<string, Position[]>();

  rows.forEach((row, y) =>
    row.split("").forEach((cell, x) => {
      if (cell !== ".") {
        signalSources.set(cell, [...(signalSources.get(cell) || []), { x, y }]);
      }
    })
  );

  return { signalSources, gridWidth: rows[0].length, gridHeight: rows.length };
};

const createPairs = <T>(arr: T[]) =>
  arr.flatMap((item, idx) =>
    arr.slice(idx + 1).map((nextItem) => [item, nextItem])
  );

const processAntennas = (part: 1 | 2) => {
  const { signalSources, gridWidth, gridHeight } = extractAntennas(input);
  const activatedNodes: Position[] = [];

  const isInsideGrid = ({ x, y }: Position) =>
    x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
  const isUniqueNode = (node: Position) =>
    !activatedNodes.some(({ x, y }) => x === node.x && y === node.y);

  const addNodeIfValid = (node: Position) => {
    if (isInsideGrid(node) && isUniqueNode(node)) {
      activatedNodes.push(node);
    }
  };

  if (part === 1) {
    signalSources.forEach((positions) => {
      createPairs(positions).forEach(([first, second]) => {
        const xDist = Math.abs(first.x - second.x);
        const yDist = Math.abs(first.y - second.y);

        const antinode1: Position = {
          x: first.x >= second.x ? first.x + xDist : first.x - xDist,
          y: first.y >= second.y ? first.y + yDist : first.y - yDist,
        };
        const antinode2: Position = {
          x: second.x >= first.x ? second.x + xDist : second.x - xDist,
          y: second.y >= first.y ? second.y + yDist : second.y - yDist,
        };

        addNodeIfValid(antinode1);
        addNodeIfValid(antinode2);
      });
    });
  }

  if (part === 2) {
    signalSources.forEach((positions) => {
      createPairs(positions).forEach(([first, second]) => {
        const xDist = Math.abs(first.x - second.x);
        const yDist = Math.abs(first.y - second.y);

        let [currentXDist, currentYDist] = [xDist, yDist];
        addNodeIfValid(first);
        addNodeIfValid(second);

        while (true) {
          const nodes = [
            {
              x: first.x + (first.x >= second.x ? currentXDist : -currentXDist),
              y: first.y + (first.y >= second.y ? currentYDist : -currentYDist),
            },
            {
              x:
                second.x + (second.x >= first.x ? currentXDist : -currentXDist),
              y:
                second.y + (second.y >= first.y ? currentYDist : -currentYDist),
            },
          ];

          nodes.forEach(addNodeIfValid);

          currentXDist += xDist;
          currentYDist += yDist;

          if (!nodes.some(isInsideGrid)) break;
        }
      });
    });
  }

  return activatedNodes.length;
};

export const part1 = () => processAntennas(1);
export const part2 = () => processAntennas(2);
