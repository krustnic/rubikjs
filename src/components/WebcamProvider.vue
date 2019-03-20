<template>
  <div>
    <video @click="snapshot(this);" width="400" height="400" id="video" controls autoplay></video>
    <div>
      <button @click="snapshot">Recognize</button>
    </div>
  </div>
</template>

<script lang="ts">
import { NavigatorWrapper, IProvider } from '@/core/types/app';
import { Mat } from '@/core/types/opencv';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue implements IProvider {
  imageCapture: any = null;
  video!: HTMLVideoElement;
  ctx: CanvasRenderingContext2D = document
    .createElement('canvas')
    .getContext('2d') as CanvasRenderingContext2D;

  created() {
    this.ctx.canvas.width = 400;
    this.ctx.canvas.height = 400;
  }

  mounted() {
    const navigatorWrapper = navigator as NavigatorWrapper;

    navigator.getUserMedia =
      navigatorWrapper.getUserMedia ||
      navigatorWrapper.webkitGetUserMedia ||
      navigatorWrapper.mozGetUserMedia ||
      navigatorWrapper.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        // constraints
        {
          video: {
            width: { min: 640, ideal: 640, max: 800 },
            height: { min: 480, ideal: 480, max: 600 },
          },
          audio: false,
        },

        // successCallback
        localMediaStream => {
          this.video = document.querySelector('video') as HTMLVideoElement;

          if (this.video === null) {
            return;
          }

          this.video.srcObject = localMediaStream;

          // const track = localMediaStream.getVideoTracks()[0];
          // this.imageCapture = new ImageCapture(track);
        },

        // errorCallback
        err => {
          alert('The following error occured: ' + err);
        },
      );
    } else {
      alert('getUserMedia not supported');
    }
  }

  snapshot(): Mat {
    // if (this.imageCapture === null) {
    //   return;
    // }

    // alert('shot 2');

    // this.imageCapture.grabFrame().then((imageBitmap: ImageBitmap) => {
    //   if (this.ctx === null) {
    //     return;
    //   }
    //   const size = Math.min(imageBitmap.width, imageBitmap.height);
    //   this.ctx.drawImage(
    //     imageBitmap,
    //     (imageBitmap.width - size) / 2,
    //     (imageBitmap.height - size) / 2,
    //     size,
    //     size,
    //     0,
    //     0,
    //     128,
    //     128,
    //   );

    //   const mat = cv.matFromImageData(this.ctx.getImageData(0, 0, 128, 128));
    //   this.$emit('grab', mat);
    // });
    const size = Math.min(this.video.videoWidth, this.video.videoHeight);
    this.ctx.drawImage(
      this.video,
      (this.video.videoWidth - size) / 2,
      (this.video.videoHeight - size) / 2,
      size,
      size,
      0,
      0,
      400,
      400,
    );

    const mat = cv.matFromImageData(this.ctx.getImageData(0, 0, 400, 400));
    this.$emit('grab', mat);
    return mat;
  }
}
</script>

