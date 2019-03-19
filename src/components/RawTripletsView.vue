<template>
  <div>
    <TripletView v-show="cubeTriplet1" :triplet="cubeTriplet1"></TripletView>
    <ColorView :tripletIndex="0" :tripletColors="tripletColor1" :triplet="cubeTriplet1"></ColorView>
    <TripletView v-show="cubeTriplet2" :triplet="cubeTriplet2"></TripletView>
    <ColorView :tripletIndex="1" :tripletColors="tripletColor2" :triplet="cubeTriplet2"></ColorView>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { IState, CubeTriplet, TripletColors } from '@/core/types/app';
import TripletView from '@/components/TripletView.vue';
import ColorView from '@/components/ColorView.vue';

@Component({
  components: { TripletView, ColorView },
})
export default class extends Vue {
  @State(state => (state as IState).cubeTriplet1) cubeTriplet1!: CubeTriplet;
  @State(state => (state as IState).cubeTriplet2) cubeTriplet2!: CubeTriplet;

  @State(state => (state as IState).tripletColor1)
  tripletColor1!: TripletColors;
  @State(state => (state as IState).tripletColor2)
  tripletColor2!: TripletColors;

  @Action('resolvePuzzle') resolvePuzzle!: any;

  @Watch('tripletColor1')
  onTripletColor1Update() {
    this.resolve();
  }

  @Watch('tripletColor2')
  onTripletColor2Update() {
    this.resolve();
  }

  mounted() {
    this.resolve();
  }

  resolve() {
    this.resolvePuzzle();
  }
}
</script>

