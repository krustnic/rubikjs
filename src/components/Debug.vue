<template>
  <div>
    <div>
      <canvas id="source" width="128" height="128"></canvas>
      <canvas id="mask" width="128" height="128"></canvas>
      <canvas id="contour" width="128" height="128"></canvas>
    </div>
    <RawTripletsView></RawTripletsView>
  </div>
</template>

<script lang="ts">
import { CubeTriplet, Configuration } from '@/core/types/app';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  BadRecognitionError,
  BadFrameError,
  CubeRecognizer,
} from '@/core/CubeRecognizerTF.ts';
import { Mat } from '@/core/types/opencv';
import { State, Mutation, Action } from 'vuex-class';
import RawTripletsView from '@/components/RawTripletsView.vue';

@Component({
  components: { RawTripletsView },
})
export default class extends Vue {
  @Prop(Object) image!: Mat;
  @State(state => state.cubeTriplet1) cubeTriplet1!: CubeTriplet;
  @State(state => state.cubeTriplet1) cubeTriplet2!: CubeTriplet;

  @Action('recognizeCube') recognizeCube: any;
  @Mutation('setCubeTriplet1') setCubeTriplet1!: any;
  @Mutation('setCubeTriplet2') setCubeTriplet2!: any;

  video = null;
  webcamStream = null;
  imageCapture = null;
  ctx: any;

  sourceCanvas: HTMLCanvasElement | null = null;
  contourCanvas: HTMLCanvasElement | null = null;
  maskCanvas: HTMLCanvasElement | null = null;

  @Watch('image')
  onImageChanged() {
    if (this.image !== null) {
      const resized = new cv.Mat();
      const dsize = new cv.Size(128, 128);
      cv.resize(this.image, resized, dsize, 0, 0, cv.INTER_AREA);

      cv.imshow(this.sourceCanvas, resized);
      // cv.imshow(this.sourceCanvas, this.image);

      this.recognize();
    }
  }

  mounted() {
    this.sourceCanvas = document.querySelector('#source');
    this.contourCanvas = document.querySelector('#contour');
    this.maskCanvas = document.querySelector('#mask');
  }

  recognize() {
    // const canvas = document.querySelector('#source') as HTMLCanvasElement;
    // if (canvas === null) {
    //   return;
    // }

    // const ctx = canvas.getContext('2d');
    // if (ctx === null) {
    //   return;
    // }

    // const imageData = ctx.getImageData(0, 0, 128, 128);

    this.recognizeCube(this.image)
      .then(
        ({
          maskData,
          centerData,
          leftData,
          topData,
          rightData,
        }: {
          maskData: Mat;
          centerData: Mat;
          leftData: Mat;
          topData: Mat;
          rightData: Mat;
        }) => {
          if (this.cubeTriplet1 === null) {
            this.setCubeTriplet1({
              triplet: new CubeTriplet(leftData, rightData, topData),
            });
          } else {
            this.setCubeTriplet2({
              triplet: new CubeTriplet(leftData, rightData, topData),
            });
          }
          cv.imshow(this.contourCanvas, maskData);
          cv.imshow(this.maskCanvas, centerData);
        },
      )
      .catch((e: Error) => {
        if (e instanceof BadFrameError || e instanceof BadRecognitionError) {
          console.log(e);
          this.$emit('request');
        }
      });
  }
}
</script>

<style>
canvas {
  margin: 2px;
}
</style>


