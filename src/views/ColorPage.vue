<template>
  <div style="display: flex; justify-content: center;">
    <SideStickers :colors="colors1"></SideStickers>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SideStickers from '@/components/SideStickers/Main.vue';

@Component({
  components: { SideStickers },
})
export default class extends Vue {
  colors1: string[] = [];
  colors: string[] = ['green', 'red', 'blue', 'orange', 'yellow', 'white'];

  created() {
    for (let i = 0; i < 9; i++) {
      const randIndex = Math.floor(Math.random() * (6 - 0)) + 0;
      this.colors1.push(this.colors[randIndex]);
    }
  }
}
</script>
