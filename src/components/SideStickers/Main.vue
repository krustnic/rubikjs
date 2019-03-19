<template>
  <div class="cube" :style="styles">
    <div v-for="i in [0, 1, 2]" :key="i" class="cube-row">
      <SingleSticker
        v-for="j in [0, 1, 2]"
        :key="j"
        @click="nextColor(i*3 + j)"
        :color="localColors[i*3 + j]"
      ></SingleSticker>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import SingleSticker from './SingleSticker.vue';

enum Colors {
  green,
  red,
  blue,
  orange,
  yellow,
  white,
}

@Component({
  components: { SingleSticker },
})
export default class extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  colors!: string[];
  @Prop(Number) size!: number;

  localColors: string[] = [];

  created() {
    this.localColors = this.colors;
  }

  nextColor(index: number) {
    const colorsArray = Object.keys(Colors).map(k => Colors[k as any]);
    const currentColor = this.localColors[index];
    const indexInColorArray = colorsArray.indexOf(currentColor);
    let newColorIndex = 0;
    if (indexInColorArray < 5) {
      newColorIndex = indexInColorArray + 1;
    }
    this.$set(this.localColors, index, colorsArray[newColorIndex]);

    this.$emit('change', {
      prop: this.colors,
      index,
      value: colorsArray[newColorIndex],
    });
  }

  get styles() {
    console.log('size', this.size);
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
    };
  }

  @Watch('colors')
  onColorsChange() {
    console.log('change');
    this.localColors = this.colors.slice(0);
  }
}
</script>

<style scoped>
.cube {
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  /* width: 256px;
  height: 256px; */
  margin: 5px;
}

.cube-row {
  display: flex;
  width: 100%;
}
</style>

