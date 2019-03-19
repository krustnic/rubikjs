<template>
  <div>
    <!-- <div>
      <canvas ref="left" width="128" height="128"></canvas>
      <canvas ref="top" width="128" height="128"></canvas>
      <canvas ref="right" width="128" height="128"></canvas>
    </div>-->
    <div style="display: inline-flex">
      <SideStickers :size="128" :colors="leftColors" @change="changeColors"></SideStickers>
      <SideStickers :size="128" :colors="topColors" @change="changeColors"></SideStickers>
      <SideStickers :size="128" :colors="rightColors" @change="changeColors"></SideStickers>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Mutation, Action } from 'vuex-class';
import { State } from 'vuex-class';
import { Mat } from '@/core/types/opencv';
import { IState, CubeTriplet, TripletColors } from '@/core/types/app';
import { ColorRecognizer } from '@/core/ColorRecognizerTF';
import CubeColorSide from '@/components/CubeColorSide.vue';
import SideStickers from '@/components/SideStickers/Main.vue';

function argMax(array: number[]) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

@Component({
  components: { CubeColorSide, SideStickers },
})
export default class extends Vue {
  @Prop(CubeTriplet) readonly triplet!: CubeTriplet;
  @Prop(TripletColors) readonly tripletColors!: TripletColors;
  @Prop(Number) readonly tripletIndex!: number;
  @Mutation('setTripletColor') setTripletColor!: any;
  @Action('recognizeColor') recognizeColor: any;

  leftColors: string[] = [];
  rightColors: string[] = [];
  topColors: string[] = [];

  colors: any = {
    0: 'blue',
    1: 'green',
    2: 'orange',
    3: 'red',
    4: 'white',
    5: 'yellow',
  };
  dsize = new cv.Size(32, 32);

  created() {
    this.initColors();
  }

  @Watch('tripletColors')
  onTripletColorsChange() {
    this.initColors();
  }

  initColors() {
    if (this.tripletColors === null) {
      this.leftColors = [];
      this.rightColors = [];
      this.topColors = [];
      return;
    }
    this.leftColors = this.tripletColors.left.slice(0);
    this.rightColors = this.tripletColors.right.slice(0);
    this.topColors = this.tripletColors.top.slice(0);
  }

  changeColors({
    prop,
    index,
    value,
  }: {
    prop: string[];
    index: number;
    value: number;
  }) {
    this.$set(prop, index, value);

    this.setTripletColor({
      index: this.tripletIndex,
      triplet: new TripletColors({
        left: this.leftColors,
        right: this.rightColors,
        top: this.topColors,
      }),
    });
  }

  @Watch('triplet')
  async draw() {
    if (this.triplet !== null) {
      console.log('Start recognize');
      const left = this.triplet.left;
      this.leftColors = await this.recognizeSide(this.triplet.left);
      console.log('Recognized: ', 1);
      this.rightColors = await this.recognizeSide(this.triplet.right);
      console.log('Recognized: ', 2);
      this.topColors = await this.recognizeSide(this.triplet.top);
      console.log('Recognized: ', 3);

      this.setTripletColor({
        index: this.tripletIndex,
        triplet: new TripletColors({
          left: this.leftColors,
          right: this.rightColors,
          top: this.topColors,
        }),
      });
    } else {
      //   const size = (this.$refs.left as HTMLCanvasElement).width;
      //   this.clearCanvas(this.$refs.left as HTMLCanvasElement, size);
      //   this.clearCanvas(this.$refs.top as HTMLCanvasElement, size);
      //   this.clearCanvas(this.$refs.right as HTMLCanvasElement, size);
    }
  }

  drawTriplet() {
    this.drawColorSide(this.$refs.left as HTMLCanvasElement, this.leftColors);
    this.drawColorSide(this.$refs.top as HTMLCanvasElement, this.topColors);
    this.drawColorSide(this.$refs.right as HTMLCanvasElement, this.rightColors);
  }

  drawColorSide(canvas: HTMLCanvasElement, colors: string[]) {
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return;
    }

    const size = Math.round(128 / 3) - 1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = colors[i * 3 + j];
        ctx.fillRect(j * size, i * size, size, size);
      }
    }
  }

  async recognizeSide(side: Mat, size = Math.round(128 / 3) - 1) {
    const colorNames = [];
    let crop = new cv.Mat();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const rect = new cv.Rect(j * size, i * size, size, size);
        crop = side.roi(rect);
        cv.cvtColor(crop, crop, cv.COLOR_RGBA2RGB, 0);

        const dst = new cv.Mat();
        cv.resize(crop, dst, this.dsize, 0, 0, cv.INTER_AREA);

        const data = await this.recognizeColor(dst);
        const array = Array.prototype.slice.call(data);
        const best = argMax(array);
        colorNames.push(this.getColorName(best));

        dst.delete();
      }
    }

    crop.delete();

    return colorNames;
  }

  getColorName(idx: number): string {
    return this.colors[idx];
  }

  clearCanvas(canvas: HTMLCanvasElement, size = 128) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, size, size);
  }
}
</script>

