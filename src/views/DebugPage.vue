<template>
  <div class="debug">
    <div>
      <button @click="clear">Clear</button>
    </div>
    <WebcamProvider @grab="grab" ref="webcam-provider"></WebcamProvider>
    <!-- <ImageProvider @grab="grab" ref="image-provider"></ImageProvider> -->
    <Debug :image="imageData" @request="makeSnapshot"></Debug>
  </div>
</template>

<script lang="ts">
import { IProvider } from '@/core/types/app';
import { Component, Vue } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import Debug from '@/components/Debug.vue';
import WebcamProvider from '@/components/WebcamProvider.vue';
import ImageProvider from '@/components/ImageProvider.vue';

@Component({
  components: {
    Debug,
    WebcamProvider,
    ImageProvider,
  },
})
export default class extends Vue {
  @Mutation('clear') clearMutation!: any;
  imageData: any = null;

  grab(imageData: ImageData) {
    console.log('grab');
    this.imageData = imageData;
  }

  makeSnapshot() {
    // console.log('request');
    ((this.$refs['webcam-provider'] as any) as IProvider).snapshot();
  }

  clear() {
    this.clearMutation();
  }
}
</script>
