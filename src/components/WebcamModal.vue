<template>
  <div v-show="show" class="camera-modal" @mousedown="close">
    <video @click="snapshot(this);" width="400" height="400" id="video" controls autoplay></video>
  </div>
</template>

<script lang="ts">
import { NavigatorWrapper, IProvider } from '@/core/types/app';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class extends Vue implements IProvider {
  @Prop({ type: Boolean, default: false }) show!: boolean;

  imageCapture: any = null;
  mediaStream: MediaStream | null = null;
  video!: HTMLVideoElement;
  ctx: CanvasRenderingContext2D = document
    .createElement('canvas')
    .getContext('2d') as CanvasRenderingContext2D;

  created() {
    this.ctx.canvas.width = 400;
    this.ctx.canvas.height = 400;
  }

  mounted() {
    this.video = document.querySelector('video') as HTMLVideoElement;

    const navigatorWrapper = navigator as NavigatorWrapper;

    navigator.getUserMedia =
      navigatorWrapper.getUserMedia ||
      navigatorWrapper.webkitGetUserMedia ||
      navigatorWrapper.mozGetUserMedia ||
      navigatorWrapper.msGetUserMedia;
  }

  @Watch('show')
  onShowChange() {
    if (this.show) {
      this.openStream();
    } else {
      this.closeStream();
    }
  }

  openStream() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: {
            width: { min: 640, ideal: 640, max: 800 },
            height: { min: 480, ideal: 480, max: 600 },
          },
          audio: false,
        },
        localMediaStream => {
          this.mediaStream = localMediaStream;

          if (this.video === null) {
            return;
          }

          this.video.srcObject = localMediaStream;
        },
        err => {
          alert('The following error occured: ' + err);
        },
      );
    } else {
      alert('getUserMedia not supported');
    }
  }

  closeStream() {
    if (this.mediaStream === null) {
      return;
    }
    const track = this.mediaStream.getVideoTracks()[0] as MediaStreamTrack;
    track.stop();
  }

  close() {
    this.$emit('close');
  }

  snapshot() {
    if (this.ctx === null) {
      return;
    }
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
  }
}
</script>

<style scoped>
.camera-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1f1f1f;
}
</style>
