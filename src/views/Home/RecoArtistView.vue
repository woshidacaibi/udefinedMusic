<template>
  <div class="reco-artist">
    <ul class="classify">
      <template v-for="item in types" :key="item.t">
        <li v-if="currentType === item.t" class="active">{{ item.tn }}</li>
        <li v-else @click="currentType = item.t">{{ item.tn }}</li>
      </template>
    </ul>
    <ul class="classify">
      <template v-for="item in areas" :key="item.a">
        <li v-if="currentArea === item.a" class="active">{{ item.an }}</li>
        <li v-else @click="currentArea = item.a">{{ item.an }}</li>
      </template>
    </ul>
    <ul class="classify">
      <li v-if="currentInitial === '-1'" class="active">热门</li>
      <li v-else @click="currentInitial = '-1'">热门</li>
      <template v-for="i in 26" :key="i">
        <li
          v-if="currentInitial === String.fromCharCode(96 + i)"
          class="active"
        >
          {{ String.fromCharCode(64 + i) }}
        </li>
        <li v-else @click="currentInitial = String.fromCharCode(96 + i)">
          {{ String.fromCharCode(64 + i) }}
        </li>
      </template>
      <li v-if="currentInitial === '0'" class="active">#</li>
      <li v-else @click="currentInitial = '0'">#</li>
    </ul>
    <div class="grid-container">
      <template v-for="item in artists" :key="item.id">
        <artist-item :info="item"></artist-item>
      </template>
    </div>
    <loading-tip :is-load="!loading"></loading-tip>
    <no-more-tip v-if="!hasMore"></no-more-tip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { getArtistList } from '@/hooks/artist';
import { findScroll } from '@/hooks/scroll';
import ArtistItem from '@/components/SingleItem/artistItem.vue';

const currentArea = ref(-1);
const areas = [
  { a: -1, an: '全部' },
  { a: 7, an: '华语' },
  { a: 96, an: '欧美' },
  { a: 8, an: '日本' },
  { a: 16, an: '韩国' },
  { a: 0, an: '其他' },
];
const currentType = ref(-1);
const types = [
  { t: -1, tn: '全部' },
  { t: 1, tn: '男歌手' },
  { t: 2, tn: '女歌手' },
  { t: 3, tn: '乐队/组合' },
];
const currentInitial = ref('-1');

const artists = ref<any[]>([]);
const hasMore = ref(true);
const loading = ref(true);
const scroll = findScroll('main');
const offset = computed(() => {
  return artists.value.length;
});
function initData() {
  artists.value = [];
  hasMore.value = true;
}
watch(
  () => [currentType, currentArea, currentInitial],
  async () => {
    initData();
    if (hasMore.value) {
      loading.value = true;
      const res = await getArtistList(
        offset.value,
        currentType.value,
        currentArea.value,
        currentInitial.value,
        60
      );
      hasMore.value = res.more;
      artists.value = res.artists;
      loading.value = false;
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => scroll!.isBottom,
  async () => {
    if (scroll!.isBottom && !loading.value && hasMore.value) {
      loading.value = true;
      const res = await getArtistList(
        offset.value,
        currentType.value,
        currentArea.value,
        currentInitial.value,
        60
      );
      hasMore.value = res.more;
      artists.value.push(...res.artists);
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
