<template>
  <div class="triplet-group">
    <triplet-image @click="onClick" :triplet="tripletImage"></triplet-image>
    <triplet-color :tripletIndex="index" :tripletColors="tripletColor" :triplet="tripletImage"></triplet-color>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { CubeTriplet, TripletColors } from '@/core/types/app';
import TripletImage from './TripletImage.vue';
import TripletColor from './TripletColor.vue';

@Component({
  name: 'TripletGroup',
  components: { TripletImage, TripletColor },
})
export default class extends Vue {
  @Prop(Object) tripletImage!: CubeTriplet;
  @Prop(Object) tripletColor!: TripletColors;
  @Prop(Number) index!: number;

  onClick() {
    this.$emit('click', {
      index: this.index,
    });
  }
}
</script>

<style scoped>
.triplet-group {
  border: 2px solid #893e8a;
  padding: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
}
</style>
