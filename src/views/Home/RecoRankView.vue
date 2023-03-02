<template>
  <div class="rank-container">
    <template v-if="isLoad">
      <div class="official-rank">
        <h2>官方榜单</h2>
        <template v-for="item in rankList.slice(0, 4)" :key="item.id">
          <playlist-preview-item-t1 :info="item"></playlist-preview-item-t1>
        </template>
      </div>
      <div class="other-rank">
        <h2>其他榜单</h2>
        <div class="grid-container">
          <template v-for="item in rankList.slice(4)" :key="item.id">
            <playlist-preview-item-t3 :info="item"></playlist-preview-item-t3>
          </template>
        </div>
      </div>
    </template>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
</template>

<script lang="ts" setup>
import { getRank } from '@/hooks/home';
import { ref } from 'vue';
import PlaylistPreviewItemT1 from '@/components/SingleItem/playlist/playlistPreviewItemT1.vue';
import PlaylistPreviewItemT3 from '@/components/SingleItem/playlist/playlistPreviewItemT3.vue';

const rankList = ref<any[]>([]);
const isLoad = ref(false);

async function getInfo() {
  isLoad.value = false;
  rankList.value = await getRank();
  isLoad.value = true;
}
getInfo();
</script>

<style scoped lang="less">
.rank-container {
  margin: 10px 10px;
}
h2 {
  max-width: 1000px;
  margin: 20px auto;
}
.grid-container {
  display: grid;
  max-width: 1000px;
  margin: 0 auto;
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
