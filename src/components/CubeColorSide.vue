<template>
  <div v-if="localColors.length === 9" class="color-cube">
    <!-- <div style="color:white">{{ colors }}</div> -->
    <div v-for="i in [0, 1, 2]" :key="i" class="cube-row">
      <div v-for="j in [0, 1, 2]" :key="j" class="cube-sticker">
        <input
          v-model="localColors[i*3 + j]"
          @input="change(i*3 + j)"
          type="text"
          class="sticker-input"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';

@Component
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  colors!: string[];
  localColors: string[] = [];

  @Watch('colors')
  onColorsChange() {
    this.localColors = this.colors.slice(0);
  }

  @Emit()
  change(index: number) {
    const value = this.localColors[index];
    return { prop: this.colors, index, value };
  }
}
</script>

<style lang="css" scoped>
.color-cube {
  width: 128px;
  height: 128px;
}

.sticker-input {
  width: 40px;
}

.cube-row {
  display: flex;
  width: 128px;
  height: 42px;
}

.cube-sticker {
  width: 42px;
  height: 42px;
}
</style>

