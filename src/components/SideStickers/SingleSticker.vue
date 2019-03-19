<template>
  <div class="cube-sticker" @click="$emit('click')" :style="styles"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop(String) color!: string;

  get styles() {
    return {
      backgroundColor: this.color,
    };
  }
}
</script>

<style scoped>
.cube-sticker {
  width: 100%;
  border-radius: 9px;
  margin: 0px;
  margin: 2px;
}
</style>

