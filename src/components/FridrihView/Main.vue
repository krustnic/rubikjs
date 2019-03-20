<template>
  <div class="fridrih">
    <div v-show="isValidCube" class="solution">
      <div ref="cube-doll" id="cube-doll"></div>
      <div v-if="!isCubeSolved" class="steps">
        <MultipleStepsSolution name="Cross" :solution="plainSolution.cross"></MultipleStepsSolution>
        <MultipleStepsSolution name="F2L" :solution="plainSolution.f2l"></MultipleStepsSolution>
        <MultipleStepsSolution name="OLL" :solution="[plainSolution.oll]"></MultipleStepsSolution>
        <MultipleStepsSolution name="PLL" :solution="[plainSolution.pll]"></MultipleStepsSolution>
      </div>
    </div>
    <div v-show="!isValidCube">Cube invalid!</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation, Action, Getter } from 'vuex-class';
import { IState, Alg, Solution } from '@/core/types/app';
import { getFullAlgorithm } from '@/core/FridrihTools.ts';

import MultipleStepsSolution from './MultipleStepsSolution.vue';
import SingleStepsSolution from './SingleStepsSolution.vue';

@Component({
  name: 'FridrihView',
  components: { MultipleStepsSolution, SingleStepsSolution },
})
export default class extends Vue {
  @State('isValidCube') isValidCube!: boolean;

  @Getter('centers') centers!: string[];
  @Getter('plainSolution') plainSolution!: Solution;
  @Getter('isCubeSolved') isCubeSolved!: boolean;

  get fullAlg(): Alg {
    return getFullAlgorithm(this.plainSolution);
  }

  beforeDestroy() {
    (this.$refs['cube-doll'] as HTMLElement).remove();
  }

  @Watch('plainSolution')
  onSolveMovesChange() {
    this.makeCube();
  }

  mounted() {
    this.makeCube();
  }

  removeCube() {
    const cube = this.$refs['cube-doll'] as HTMLElement;
    while (cube.firstChild) {
      cube.removeChild(cube.firstChild);
    }
  }

  makeCube() {
    this.removeCube();

    // Generate side colors
    let fc = '';
    for (const color of this.centers) {
      for (let i = 0; i < 9; i++) {
        fc += color[0];
      }
    }

    const crossAlg = this.fullAlg.toString();

    TTk.AlgorithmPuzzle(3)
      .fc(fc)
      .case(crossAlg)
      .showAlg(false)
      .controls(true)
      .size({ width: 384, height: 384 })('#cube-doll');
  }
}
</script>

<style scoped>
.fridrih {
  min-width: 600px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.solution {
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  justify-content: center;
}

.steps {
}
</style>
