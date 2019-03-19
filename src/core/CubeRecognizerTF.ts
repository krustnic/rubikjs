import { Configuration } from '@/core/types/app';
import { Mat } from '@/core/types/opencv';
import {
  image2mat,
  getKeypoints,
  getCenterPoint,
  fourPointsResize,
  isValidRecognition,
  drawContour,
  drawCircle,
} from '@/core/utils.ts';

export class InitializationError extends Error {}
export class BadRecognitionError extends Error {}
export class BadFrameError extends Error {}

export class CubeRecognizer {
  model: any;
  config!: Configuration;
  isInit: boolean = false;

  src: Mat = new cv.Mat();
  dst: Mat = new cv.Mat();

  constructor(config: Configuration) {
    this.config = config;
  }

  async init() {
    this.model = await tf.loadModel(this.config.segmentationModelPath);
    this.isInit = true;
    console.log('tf model loaded!');
  }

  clear(): void {
    this.src.delete();
    this.dst.delete();
  }

  predict(sourceImage: Mat): Promise<any> {
    const size = this.config.segmentationModelInputSize;
    const dsize = new cv.Size(size, size);

    return new Promise(async (resolve, reject) => {
      // this.src = cv.matFromImageData(imageData);
      this.dst = new cv.Mat();

      // resize
      cv.resize(sourceImage, this.src, dsize, 0, 0, cv.INTER_AREA);

      // to grayscale
      cv.cvtColor(this.src, this.dst, cv.COLOR_RGBA2GRAY, 0);

      const tensor = tf.tensor3d(this.dst.data, [size, size, 1]);
      const batchedImage = tensor.expandDims(0);
      const input = batchedImage.toFloat().div(255);

      const prediction = this.model.predict(input);
      const data = await prediction.data();

      let maskData = image2mat(data, size, size, 0);
      let centerData = image2mat(data, size, size, 1);

      const hexagon = getKeypoints(maskData);
      if (hexagon !== null) {
        maskData = cv.Mat.zeros(maskData.cols, maskData.rows, cv.CV_8UC3);
        drawContour(maskData, hexagon);
      }

      const center = getCenterPoint(centerData);
      if (center !== null) {
        centerData = cv.Mat.zeros(centerData.cols, centerData.rows, cv.CV_8UC3);
        drawCircle(centerData, center, 3);
      }

      let leftData = cv.Mat.zeros(centerData.cols, centerData.rows, cv.CV_8UC3);
      let topData = cv.Mat.zeros(centerData.cols, centerData.rows, cv.CV_8UC3);
      let rightData = cv.Mat.zeros(
        centerData.cols,
        centerData.rows,
        cv.CV_8UC3,
      );

      if (hexagon !== null && center !== null) {
        if (!isValidRecognition(hexagon, center, this.config.maxHexagonAngle)) {
          reject(new BadRecognitionError());
        }

        const leftPoints = [
          hexagon.getPoint(1).x,
          hexagon.getPoint(1).y,
          center.x,
          center.y,
          hexagon.getPoint(3).x,
          hexagon.getPoint(3).y,
          hexagon.getPoint(2).x,
          hexagon.getPoint(2).y,
        ];

        const topPoints = [
          hexagon.getPoint(0).x,
          hexagon.getPoint(0).y,
          hexagon.getPoint(5).x,
          hexagon.getPoint(5).y,
          center.x,
          center.y,
          hexagon.getPoint(1).x,
          hexagon.getPoint(1).y,
        ];

        const rightPoints = [
          center.x,
          center.y,
          hexagon.getPoint(5).x,
          hexagon.getPoint(5).y,
          hexagon.getPoint(4).x,
          hexagon.getPoint(4).y,
          hexagon.getPoint(3).x,
          hexagon.getPoint(3).y,
        ];

        leftData = fourPointsResize(this.src, leftPoints, size);
        topData = fourPointsResize(this.src, topPoints, size);
        rightData = fourPointsResize(this.src, rightPoints, size);

        return resolve({ maskData, centerData, leftData, topData, rightData });
      }

      reject(new BadFrameError());
    });
  }
}
