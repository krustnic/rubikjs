<template>
  <div>
    <div class="name">{{ name }}:</div>
    <div class="step">{{ solution }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { IState, Alg, Solution } from '@/core/types/app';

@Component
export default class extends Vue {
  @Prop({ type: String, default: '' }) name!: string;
  @Prop({
    type: String,
    default: '',
  })
  solution!: string;
}
</script>

<style scoped>
.name {
  font-weight: bold;
}
</style>

