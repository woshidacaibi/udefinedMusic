<template>
  <div class="grid-container">
    <template v-for="item in lists" :key="item.id">
      <video-item :info="item"></video-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import VideoItem from '@/components/SingleItem/video/videoItem.vue';
import { computed } from 'vue';
const props = defineProps<{ lists: any }>();
</script>

<style scoped lang="less">
@media screen and (max-width: 1000px) {
  .grid-container {
    padding: 10px 20px;
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .grid-container {
    padding: 10px 20px;
    gap: 30px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
