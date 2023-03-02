<template>
  <div class="similar-artist-container" v-if="isLoad">
    <template v-for="item in artists" :key="item.id">
      <ArtistItem :info="item"></ArtistItem>
    </template>
  </div>
  <loading-tip :is-load="isLoad"></loading-tip>
</template>

<script lang="ts" setup>
import { getSimiArtist } from '@/hooks/artist';
import { ref } from 'vue';
import ArtistItem from '@/components/SingleItem/artistItem.vue';

const props = defineProps<{ id: number | string; passCount: number }>();
const artists = ref<any[]>([]);
const isLoad = ref(false);
async function init() {
  artists.value = await getSimiArtist(props.id);
  isLoad.value = true;
}
init();
</script>

<style scoped lang="less">
.similar-artist-container {
  display: grid;
  margin-top: 10px;
  grid-gap: 30px;
}
@media screen and (max-width: 1000px) {
  .similar-artist-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .similar-artist-container {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
