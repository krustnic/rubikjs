import { Mat, MatVector, Point, Rect } from '@/core/types/opencv';
import { Hexagon } from '@/core/types/app';

export function image2mat(
  arr: number[],
  width: number,
  height: number,
  offset: number = 0,
) {
  const size = width * height;
  const imageData = new Uint8ClampedArray(size);
  for (let i = 0; i < size; i += 1) {
    imageData[i] = Math.round(255 * arr[i * 2 + offset]);
  }
  return cv.matFromArray(width, height, cv.CV_8UC1, imageData);
}

export function getKeypoints(src: Mat): Hexagon | null {
  const binary = thresholdMask(src, 0.5);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    binary,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE,
  );

  if (contours.size() === 0) {
    binary.delete();
    contours.delete();
    hierarchy.delete();
    return null;
  }

  const poly = new cv.MatVector();
  const tmp = new cv.Mat();
  const cnt = contours.get(0);
  const epsilon = 0.03 * cv.arcLength(cnt, true);
  cv.approxPolyDP(cnt, tmp, epsilon, true);
  poly.push_back(tmp);

  binary.delete();
  contours.delete();
  hierarchy.delete();

  if (tmp.rows !== 6) {
    return null;
  }

  return new Hexagon(tmp);
}

export function getCenterPoint(src: Mat): Point | null {
  const binary = thresholdMask(src, 0.5);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    binary,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE,
  );

  // Should be only one contour - center point
  if (contours.size() !== 1) {
    binary.delete();
    contours.delete();
    hierarchy.delete();
    return null;
  }

  const cnt = contours.get(0);
  const rect = cv.boundingRect(cnt) as Rect;

  const center = new cv.Point(
    Math.round(rect.x + rect.width / 2),
    Math.round(rect.y + rect.height / 2),
  );

  return center;
}

export function thresholdMask(src: Mat, confidence: number): Mat {
  const binary = new cv.Mat();
  src.convertTo(binary, cv.CV_8U);
  cv.threshold(
    binary,
    binary,
    Math.round(255 * confidence),
    255,
    cv.THRESH_BINARY,
  );
  return binary;
}

export function fourPointsResize(
  src: Mat,
  points: number[],
  size: number = 256,
): Mat {
  const dst = new cv.Mat();

  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points);
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0,
    0,
    size,
    0,
    size,
    size,
    0,
    size,
  ]);
  const dsize = new cv.Size(size, size);
  const M = cv.getPerspectiveTransform(srcTri, dstTri);
  cv.warpPerspective(
    src,
    dst,
    M,
    dsize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar(),
  );

  M.delete();
  srcTri.delete();
  dstTri.delete();

  return dst;
}

export function points2arr(points: Mat): number[] {
  const arr = [];
  for (let i = 0; i < 6 * 4 * 2; i += 4) {
    arr.push(points.data[i]);
  }
  return arr;
}

export function isValidRecognition(
  hexagon: Hexagon,
  center: Point,
  epsilon: number = 12,
): boolean {
  const line1 = [hexagon.getPoint(1), center];
  const line2 = [hexagon.getPoint(2), hexagon.getPoint(3)];

  const line3 = [hexagon.getPoint(2), hexagon.getPoint(1)];
  const line4 = [hexagon.getPoint(3), center];

  const line5 = [hexagon.getPoint(1), center];
  const line6 = [hexagon.getPoint(0), hexagon.getPoint(5)];

  const line7 = [hexagon.getPoint(1), hexagon.getPoint(0)];
  const line8 = [center, hexagon.getPoint(5)];

  const line9 = [center, hexagon.getPoint(5)];
  const line10 = [hexagon.getPoint(3), hexagon.getPoint(4)];

  const line11 = [center, hexagon.getPoint(3)];
  const line12 = [hexagon.getPoint(5), hexagon.getPoint(4)];

  const parallels = [
    [line1, line2],
    [line3, line4],
    [line5, line6],
    [line7, line8],
    [line9, line10],
    [line11, line12],
  ];

  let angle1;
  let angle2;

  for (const pair of parallels) {
    angle1 = getAngle(pair[0][0], pair[0][1]);
    angle2 = getAngle(pair[1][0], pair[1][1]);

    if (!isEpsilonEquals(angle1, angle2, epsilon)) {
      return false;
    }
  }

  return true;
}

export function drawContour(src: Mat, hexagon: Hexagon): void {
  const poly = new cv.MatVector();
  poly.push_back(hexagon.getMat());

  const color = new cv.Scalar(212, 130, 226);
  cv.drawContours(src, poly, 0, color, 1, cv.LINE_8);

  poly.delete();
}

export function drawCircle(src: Mat, point: Point, radius: number): void {
  const color = new cv.Scalar(212, 130, 226);
  cv.circle(src, point, radius, color, -1);
}

export function getAngle(p1: Point, p2: Point): number {
  const dX = p2.x - p1.x;
  const dY = p2.y - p1.y;

  return (Math.atan2(-dY, dX) * 180) / Math.PI;
}

export function isEpsilonEquals(x: number, y: number, epsilon: number = 1) {
  if (Math.abs(x - y) <= epsilon) {
    return true;
  }
  return false;
}
