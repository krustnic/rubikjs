import { Mat, Point } from '@/core/types/opencv';
import { ColorRecognizer } from '@/core/ColorRecognizerTF';
import { CubeRecognizer } from '@/core/CubeRecognizerTF';

export interface IState {
  configuration: Configuration;
  cubeRecognizer: CubeRecognizer;
  colorRecognizer: ColorRecognizer;

  cubeTriplet1: CubeTriplet | null;
  cubeTriplet2: CubeTriplet | null;

  tripletColor1: TripletColors;
  tripletColor2: TripletColors;

  solveMoves: any | null;

  isValidCube: boolean;
}

export class Hexagon {
  points: number[];
  mat: Mat;

  constructor(mat: Mat) {
    this.points = this.points2arr(mat);
    this.mat = mat;
  }

  getMat() {
    return this.mat;
  }

  getPoint(index: number) {
    return new Point(this.points[index * 2 + 0], this.points[index * 2 + 1]);
  }

  private points2arr(points: Mat): number[] {
    const arr = [];
    for (let i = 0; i < 6 * 4 * 2; i += 4) {
      arr.push(points.data[i]);
    }
    return arr;
  }
}

export interface NavigatorWrapper extends Navigator {
  webkitGetUserMedia?: any;
  mozGetUserMedia?: any;
  msGetUserMedia?: any;
}

export interface IProvider {
  snapshot(): void;
}

export interface Configuration {
  segmentationModelPath: string;
  colorModelPath: string;
  segmentationModelInputSize: number;
  colorModelInputSize: number;
  maxHexagonAngle: number;
}

export class CubeTriplet {
  left: Mat;
  right: Mat;
  top: Mat;

  constructor(left: Mat, right: Mat, top: Mat) {
    this.left = left;
    this.right = right;
    this.top = top;
  }
}

export class TripletColors {
  left: string[];
  right: string[];
  top: string[];

  constructor({
    left,
    right,
    top,
  }: {
    left: string[];
    right: string[];
    top: string[];
  }) {
    this.left = left;
    this.right = right;
    this.top = top;
  }
}

export interface Solution {
  cross: string[];
  f2l: string[];
  oll: string;
  pll: string;
}

export class Alg {
  data: string = '';

  constructor(alg: string) {
    this.data = alg;
  }

  reverse(): Alg {
    return new Alg(
      this.data
        .split(' ')
        .reverse()
        .join(' '),
    );
  }

  toString(): string {
    return this.data;
  }
}
