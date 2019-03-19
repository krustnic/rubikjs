<template>
  <div>
    <div class="name">{{ name }}:</div>
    <ul>
      <li v-for="(step, index) in solution" :key="index">{{ step }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IState, Alg, Solution } from '@/core/types/app';

@Component
export default class extends Vue {
  @Prop({ type: String, default: '' }) name!: string;
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  solution!: string[];
}
</script>

<style scoped>
.name {
  font-weight: bold;
}
</style>

