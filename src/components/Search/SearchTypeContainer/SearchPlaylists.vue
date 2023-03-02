<template>
  <div class="grid-container">
    <template v-for="item in lists" :key="item.id">
      <playlist-preview-item-t3 :info="item"></playlist-preview-item-t3>
    </template>
  </div>
</template>

<script lang="ts" setup>
import PlaylistPreviewItemT3 from '@/components/SingleItem/playlist/playlistPreviewItemT3.vue';

const props = defineProps<{ lists: any }>();
</script>

<style scoped lang="less">
@media screen and (max-width: 1000px) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
