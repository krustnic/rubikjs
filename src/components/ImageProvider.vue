<template>
  <div>
    <img ref="image" @click="snapshot(this);" src="images/4.jpg">
    <div>
      <button @click="snapshot">Recognize</button>
    </div>
  </div>
</template>

<script lang="ts">
import { NavigatorWrapper, IProvider } from '@/core/types/app';
import { Component, Vue } from 'vue-property-decorator';
import { Mat } from '@/core/types/opencv';

@Component
export default class extends Vue implements IProvider {
  ctx: CanvasRenderingContext2D = document
    .createElement('canvas')
    .getContext('2d') as CanvasRenderingContext2D;
  image!: HTMLImageElement;

  created() {
    this.ctx.canvas.width = 400;
    this.ctx.canvas.height = 400;
  }

  mounted() {
    this.image = this.$refs.image as HTMLImageElement;
  }

  snapshot(): Mat {
    const width = this.image.width;
    const height = this.image.height;
    const size = Math.min(width, height);

    this.ctx.drawImage(this.image, 0, 0, size, size, 0, 0, 400, 400);

    const mat = cv.matFromImageData(this.ctx.getImageData(0, 0, 400, 400));
    this.$emit('grab', mat);

    return mat;
  }
}
</script>

