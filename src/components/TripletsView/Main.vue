<template>
  <div class="triplet-view">
    <TripletGroup
      @click="openVideo"
      :tripletImage="cubeTriplet1"
      :tripletColor="tripletColor1"
      :index="0"
    ></TripletGroup>
    <TripletGroup
      @click="openVideo"
      :tripletImage="cubeTriplet2"
      :tripletColor="tripletColor2"
      :index="1"
    ></TripletGroup>
    <WebcamModal ref="webcam" :show="isShow" @close="isShow=false"></WebcamModal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';

import {
  BadRecognitionError,
  BadFrameError,
  CubeRecognizer,
} from '@/core/CubeRecognizerTF.ts';
import { Mat } from '@/core/types/opencv';
import { CubeTriplet, TripletColors, IProvider } from '@/core/types/app';
import TripletGroup from './TripletGroup.vue';
import WebcamModal from '@/components/WebcamModal.vue';

@Component({
  name: 'TripletsView',
  components: { TripletGroup, WebcamModal },
})
export default class extends Vue {
  @Prop(Object) cubeTriplet1!: CubeTriplet;
  @Prop(Object) cubeTriplet2!: CubeTriplet;
  @Prop(Object) tripletColor1!: TripletColors;
  @Prop(Object) tripletColor2!: TripletColors;

  @Action('recognizeCube') recognizeCube: any;
  @Mutation('setCubeTriplet1') setCubeTriplet1!: any;
  @Mutation('setCubeTriplet2') setCubeTriplet2!: any;

  isShow: boolean = false;
  currentIndex: number = 0;

  openVideo({ index }: { index: number }) {
    this.currentIndex = index;
    this.isShow = true;

    this.requestFrame();
  }

  requestFrame() {
    if (this.isShow === false) {
      return;
    }

    const image: Mat = ((this.$refs.webcam as any) as IProvider).snapshot();
    this.recognize(image);
  }

  recognize(image: Mat) {
    this.recognizeCube(image)
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
          this.isShow = false;

          if (this.currentIndex === 0) {
            this.setCubeTriplet1({
              triplet: new CubeTriplet(leftData, rightData, topData),
            });
          } else {
            this.setCubeTriplet2({
              triplet: new CubeTriplet(leftData, rightData, topData),
            });
          }
        },
      )
      .catch((e: Error) => {
        if (e instanceof BadFrameError || e instanceof BadRecognitionError) {
          this.requestFrame();
        }
      });
  }
}
</script>

<style scoped>
.triplet-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
