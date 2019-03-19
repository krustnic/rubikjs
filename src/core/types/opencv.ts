export interface Mat {
  data: number[];
  readonly rows: number;
  readonly cols: number;
  readonly type: number;
  mul(s: number): Mat;
  convertTo(type: number, alpha?: number, beta?: number): Mat;
  [propName: string]: any;
  delete(): void;
}

export interface MatVector {
  get(i: number): Mat;
  [propName: string]: any;
}

export class Point implements Point {
  constructor(public x: number, public y: number) {}
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
