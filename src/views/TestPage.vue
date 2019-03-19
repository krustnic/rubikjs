<template>
  <div class="test">
    <FridrihView></FridrihView>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FridrihView from '@/components/FridrihView/Main.vue';

@Component({
  components: {
    FridrihView,
  },
})
export default class extends Vue {}
</script>
