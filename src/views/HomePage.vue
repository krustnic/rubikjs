<template>
  <div class="home">
    <div class="controls">
      <button @click="clear">CLEAR</button>
    </div>
    <div class="main">
      <TripletsView
        :cubeTriplet1="cubeTriplet1"
        :tripletColor1="tripletColor1"
        :cubeTriplet2="cubeTriplet2"
        :tripletColor2="tripletColor2"
      ></TripletsView>
      <FridrihView style="margin-top: 50px;"></FridrihView>
    </div>
  </div>
</template>

<script lang="ts">
import { State, Mutation } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';

import {
  IState,
  CubeTriplet,
  TripletColors,
  IProvider,
} from '@/core/types/app';
import TripletsView from '@/components/TripletsView/Main.vue';
import WebcamProvider from '@/components/WebcamProvider.vue';
import ImageProvider from '@/components/ImageProvider.vue';
import FridrihView from '@/components/FridrihView/Main.vue';

@Component({
  components: {
    TripletsView,
    WebcamProvider,
    ImageProvider,
    FridrihView,
  },
})
export default class extends Vue {
  @State(state => (state as IState).cubeTriplet1) cubeTriplet1!: CubeTriplet;
  @State(state => (state as IState).cubeTriplet2) cubeTriplet2!: CubeTriplet;

  @State(state => (state as IState).tripletColor1)
  tripletColor1!: TripletColors;
  @State(state => (state as IState).tripletColor2)
  tripletColor2!: TripletColors;

  @Mutation('clear') clearMutation!: any;
  imageData: any = null;

  clear() {
    this.clearMutation();
  }
}
</script>

<style scoped>
button {
  width: 100px;
  height: 40px;
  background-color: #893e8a;
  border: 0px;
  color: white;
}

.controls {
  margin: 20px;
}

.main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

