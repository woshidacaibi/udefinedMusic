<template>
  <div class="reco-artist">
    <ul class="classify">
      <template v-for="item in areas" :key="item.a">
        <li v-if="currentArea === item.a" class="active">{{ item.an }}</li>
        <li v-else @click="currentArea = item.a">{{ item.an }}</li>
      </template>
    </ul>
    <div class="grid-container">
      <template v-for="item in albums" :key="item.id">
        <album-preview-item-t3 :info="item"></album-preview-item-t3>
      </template>
    </div>
    <loading-tip :is-load="!loading"></loading-tip>
    <no-more-tip v-if="!hasMore"></no-more-tip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { findScroll } from '@/hooks/scroll';
import { getNewAlbum } from '@/hooks/album';
import AlbumPreviewItemT3 from '@/components/SingleItem/album/albumPreviewItemT3.vue';

const currentArea = ref('ALL');
const areas = [
  { a: 'ALL', an: '全部' },
  { a: 'ZH', an: '华语' },
  { a: 'EA', an: '欧美' },
  { a: 'JP', an: '日本' },
  { a: 'KR', an: '韩国' },
];

const albums = ref<any[]>([]);
const hasMore = ref(true);
const loading = ref(true);
const scroll = findScroll('main');
const offset = computed(() => {
  return albums.value.length;
});
function initData() {
  albums.value = [];
  hasMore.value = true;
}
watch(
  currentArea,
  async () => {
    if (hasMore.value) {
      initData();
      loading.value = true;
      const res = await getNewAlbum(offset.value, 60, currentArea.value);
      albums.value = res;
      if (res.length === 0) {
        hasMore.value = false;
      } else hasMore.value = true;
      loading.value = false;
    }
  },
  { immediate: true }
);
watch(
  () => scroll!.isBottom,
  async () => {
    if (scroll!.isBottom && !loading.value && hasMore.value) {
      loading.value = true;
      const res = await getNewAlbum(offset.value, 40, currentArea.value);
      if (res.length === 0) {
        hasMore.value = false;
      } else hasMore.value = true;
      albums.value.push(...res);
      loading.value = false;
    }
  }
);
</script>

<style scoped lang="less">
.reco-artist {
  margin-top: 10px;
  margin-right: 6px;
  padding: 0 20px;
}
.classify {
  margin: 10px 0;
  li {
    margin: 3px 5px;
    display: inline-block;
    text-align: center;
    padding: 0 10px;
    transition: all 0.5s;
    letter-spacing: 2px;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
  }
  li:hover {
    color: var(--theme-color);
    background-color: var(--hover-color);
  }
  .active {
    color: white;
    background-color: var(--theme-color);
  }
  .active:hover {
    background-color: var(--theme-color);
    color: white;
  }
}
.grid-container {
  display: grid;
  max-width: 1000px;
  margin: 0 auto;
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
