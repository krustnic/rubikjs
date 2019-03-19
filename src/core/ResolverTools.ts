import solver from 'rubiks-cube-solver';

import { TripletColors, Solution } from '@/core/types/app';

export class BadCubeScheme {}

function getCenterColor(sideColors: string[]): string {
  return sideColors[4];
}

function getSideAnnotation(cubeColorMap: any, colors: string[]): string {
  let annotation = '';
  for (const color of colors) {
    annotation += cubeColorMap[color];
  }

  return annotation;
}

function reverseTriplet(triplet: TripletColors): TripletColors {
  const left = triplet.left.slice(0);
  const right = triplet.right.slice(0);

  left.reverse();
  right.reverse();
  const top = [
    triplet.top[6],
    triplet.top[3],
    triplet.top[0],
    triplet.top[7],
    triplet.top[4],
    triplet.top[1],
    triplet.top[8],
    triplet.top[5],
    triplet.top[2],
  ];

  return new TripletColors({ left, right, top });
}

export function resolve(
  tripletColor1: TripletColors,
  tripletColor2: TripletColors,
): Solution {
  const cubeColorMap: any = {};

  const first = tripletColor1;
  const second = tripletColor2;

  const f = getCenterColor(first.left);
  const r = getCenterColor(first.right);
  const u = getCenterColor(first.top);

  const l = getCenterColor(second.left);
  const b = getCenterColor(second.right);
  const d = getCenterColor(second.top);

  cubeColorMap[f] = 'f';
  cubeColorMap[r] = 'r';
  cubeColorMap[u] = 'u';
  cubeColorMap[l] = 'l';
  cubeColorMap[b] = 'b';
  cubeColorMap[d] = 'd';

  const secodReversed = reverseTriplet(second);

  const aF = getSideAnnotation(cubeColorMap, first.left);
  const aR = getSideAnnotation(cubeColorMap, first.right);
  const aU = getSideAnnotation(cubeColorMap, first.top);
  const aL = getSideAnnotation(cubeColorMap, secodReversed.left);
  const aB = getSideAnnotation(cubeColorMap, secodReversed.right);
  const aD = getSideAnnotation(cubeColorMap, secodReversed.top);

  const cubeState = [aF, aR, aU, aD, aL, aB].join('');

  let solveMoves = null;

  try {
    solveMoves = solver(cubeState, {
      partitioned: true,
    });
  } catch (e) {
    throw new BadCubeScheme();
  }

  return solveMoves;
}
