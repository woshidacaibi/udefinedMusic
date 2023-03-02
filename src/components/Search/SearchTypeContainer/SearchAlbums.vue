<template>
  <div class="grid-container">
    <template v-for="item in lists" :key="item.id">
      <album-preview-item-t3
        :info="item"
        :show-artist="true"
      ></album-preview-item-t3>
    </template>
  </div>
</template>

<script lang="ts" setup>
import AlbumPreviewItemT3 from '@/components/SingleItem/album/albumPreviewItemT3.vue';

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
