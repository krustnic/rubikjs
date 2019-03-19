<template>
  <div class="test">
    <!-- <FridrihView></FridrihView> -->
    <WebcamModal :show="isShow" @close="isShow=false"></WebcamModal>
    <button @click="isShow=!isShow">Show</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FridrihView from '@/components/FridrihView/Main.vue';
import WebcamModal from '@/components/WebcamModal.vue';

@Component({
  components: {
    FridrihView,
    WebcamModal,
  },
})
export default class extends Vue {
  isShow: boolean = false;
}
</script>
