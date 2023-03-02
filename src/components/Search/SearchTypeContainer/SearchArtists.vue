<template>
  <div class="grid-container">
    <template v-for="item in lists" :key="item.id">
      <artist-item :info="item"></artist-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import ArtistItem from '@/components/SingleItem/artistItem.vue';

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
