import { Configuration } from '@/core/types/app';
import { Mat } from '@/core/types/opencv';

export class ColorRecognizer {
  config: Configuration;
  isInit: boolean = false;
  model: any;
  src: Mat = new cv.Mat();
  dst: Mat = new cv.Mat();

  constructor(config: Configuration) {
    this.config = config;
  }

  async init() {
    this.model = await tf.loadModel(this.config.colorModelPath);
    this.isInit = true;
    console.log('color model loaded!');
  }

  predict(crop: Mat): Promise<any> {
    const size = this.config.colorModelInputSize;
    return new Promise(async (resolve, reject) => {
      console.time('Color model');
      const tensor = tf.tensor3d(crop.data, [size, size, 3]);
      const batchedImage = tensor.expandDims(0);
      const input = batchedImage.toFloat().div(255);

      const prediction = this.model.predict(input);
      const data = await prediction.data();
      console.timeEnd('Color model');

      resolve(data);
    });
  }
}
