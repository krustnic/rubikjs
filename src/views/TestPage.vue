<template>
  <div class="test">
    <!-- <FridrihView></FridrihView> -->
    <div>
      <Triplet
        :cubeTriplet1="cubeTriplet1"
        :tripletColor1="tripletColor1"
        :cubeTriplet2="cubeTriplet2"
        :tripletColor2="tripletColor2"
      ></Triplet>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import FridrihView from '@/components/FridrihView/Main.vue';
import Triplet from '@/components/TripletsView/Main.vue';
import { IState, CubeTriplet, TripletColors } from '@/core/types/app';

@Component({
  name: 'TestPage',
  components: {
    FridrihView,
    Triplet,
  },
})
export default class extends Vue {
  @State(state => (state as IState).cubeTriplet1) cubeTriplet1!: CubeTriplet;
  @State(state => (state as IState).cubeTriplet2) cubeTriplet2!: CubeTriplet;

  @State(state => (state as IState).tripletColor1)
  tripletColor1!: TripletColors;
  @State(state => (state as IState).tripletColor2)
  tripletColor2!: TripletColors;
}
</script>
