<template>
  <div @click="onClick">
    <canvas width="128" height="128" ref="left"></canvas>
    <canvas width="128" height="128" ref="top"></canvas>
    <canvas width="128" height="128" ref="right"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { IState, CubeTriplet } from '@/core/types/app';

@Component({
  name: 'TripletImage',
})
export default class extends Vue {
  @Prop(CubeTriplet) readonly triplet!: CubeTriplet;

  @Watch('triplet')
  draw() {
    if (this.triplet !== null) {
      cv.imshow(this.$refs.left, this.triplet.left);
      cv.imshow(this.$refs.top, this.triplet.top);
      cv.imshow(this.$refs.right, this.triplet.right);
    } else {
      const size = (this.$refs.left as HTMLCanvasElement).width;

      this.clearCanvas(this.$refs.left as HTMLCanvasElement, size);
      this.clearCanvas(this.$refs.top as HTMLCanvasElement, size);
      this.clearCanvas(this.$refs.right as HTMLCanvasElement, size);
    }
  }

  clearCanvas(canvas: HTMLCanvasElement, size = 128) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, size, size);
  }

  onClick() {
    this.$emit('click');
  }
}
</script>

<style scoped>
canvas {
  border: 1px dashed #893e8a;
}
</style>
