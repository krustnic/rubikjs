<template>
  <div class="home">
    <div>
      <button @click="clear">Clear</button>
    </div>
    <WebcamProvider @grab="grab" ref="webcam-provider"></WebcamProvider>
    <Debug :image="imageData" @request="makeSnapshot"></Debug>
    <FridrihView style="margin-top: 50px;"></FridrihView>
  </div>
</template>

<script lang="ts">
import { IProvider } from '@/core/types/app';
import { Component, Vue } from 'vue-property-decorator';
import { Mutation } from 'vuex-class';
import Debug from '@/components/Debug.vue';
import WebcamProvider from '@/components/WebcamProvider.vue';
import ImageProvider from '@/components/ImageProvider.vue';
import FridrihView from '@/components/FridrihView/Main.vue';

@Component({
  components: {
    Debug,
    WebcamProvider,
    ImageProvider,
    FridrihView,
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
