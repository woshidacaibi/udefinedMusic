<template>
  <div class="reco-container" v-if="lists.length !== 0">
    <div class="grid-container wide">
      <daily-playlist-item
        v-if="daySongs.length !== 0"
        :lists="daySongs"
      ></daily-playlist-item>
      <template v-for="item in lists.slice(1, 10)" :key="item.id">
        <playlist-preview-item-t3 :info="item"></playlist-preview-item-t3>
      </template>
    </div>
    <div class="grid-container narrow">
      <daily-playlist-item
        v-if="daySongs.length !== 0"
        :lists="daySongs"
      ></daily-playlist-item>
      <template v-for="item in lists.slice(1, 8)" :key="item.id">
        <playlist-preview-item-t3 :info="item"></playlist-preview-item-t3>
      </template>
    </div>
  </div>
  <error-tip v-else></error-tip>
</template>

<script lang="ts" setup>
import PlaylistPreviewItemT3 from '@/components/SingleItem/playlist/playlistPreviewItemT3.vue';
import DailyPlaylistItem from '@/components/SingleItem/playlist/dailyPlaylistItem.vue';
import { ref } from 'vue';
import { getDailySongs } from '@/hooks/home';
const props = defineProps<{ lists: any[] }>();
const daySongs = ref<any[]>([]);
async function init() {
  daySongs.value = await getDailySongs();
}
init();
</script>

<style scoped lang="less">
.reco-container {
  max-width: 1000px;
  margin: 0 auto;
}
.grid-container {
  gap: 10px;
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
  .wide {
    display: grid;
  }
  .narrow {
    display: none;
  }
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
  .wide {
    display: none;
  }
  .narrow {
    display: grid;
  }
}
</style>
