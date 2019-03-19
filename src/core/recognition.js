import KerasJS from "keras-js";
import { image2mat } from "../core/utils";

/* global cv */
export class Recognizer {
  constructor() {
    this.model = new KerasJS.Model({
      filepath: "models/seg-double-2-16.bin",
      gpu: true
    });

    this.model.ready().then(() => {
      console.log("model ready");
    });
  }

  predict(imageData, callback) {
    let src = cv.matFromImageData(imageData);
    let dst = new cv.Mat();

    // to grayscale
    // cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB, 0);
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);

    const data = dst.data8S;
    const input = new Float32Array(16384);

    for (let i = 0, len = data.length; i < len; i += 1) {
      input[i] = data[i] / 255;
    }

    this.model.ready().then(() => {
      this.model.predict({ input_1: input }).then(outputData => {
        let inferenceTime = this.model.predictStats.forwardPass;
        console.log("Inference time: ", inferenceTime);
        let output = outputData.final_layer;
        // let maskData = image2Darray(output, 128, 128, [0, 0, 0], 0);
        let maskData = image2mat(output, 128, 128, 0);
        // cv.threshold(maskData, maskData, 252, 255, cv.THRESH_BINARY);

        let centerData = image2mat(output, 128, 128, 0);

        callback(maskData, centerData);
      });
    });

    return dst;
  }
}
