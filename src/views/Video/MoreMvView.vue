<template>
  <div class="reco-artist">
    <h2>全部MV</h2>
    <ul class="classify">
      <template v-for="item in types" :key="item">
        <li v-if="currentType === item" class="active">{{ item }}</li>
        <li v-else @click="currentType = item">{{ item }}</li>
      </template>
    </ul>
    <ul class="classify">
      <template v-for="item in areas" :key="item">
        <li v-if="currentArea === item" class="active">{{ item }}</li>
        <li v-else @click="currentArea = item">{{ item }}</li>
      </template>
    </ul>
    <ul class="classify">
      <template v-for="item in orders" :key="item">
        <li v-if="currentOrder === item" class="active">{{ item }}</li>
        <li v-else @click="currentOrder = item">{{ item }}</li>
      </template>
    </ul>
    <div class="grid-container">
      <template v-for="item in mvs" :key="item.id">
        <MvItem :info="item"></MvItem>
      </template>
    </div>
    <loading-tip :is-load="!loading"></loading-tip>
    <no-more-tip v-if="!hasMore"></no-more-tip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { findScroll } from '@/hooks/scroll';
import { getMvs } from '@/hooks/video';
import MvItem from '@/components/SingleItem/video/mvItem.vue';

const currentArea = ref('全部');
const areas = ['全部', '内地', '港台', '欧美', '日本', '韩国'];
const currentType = ref('全部');
const types = ['全部', '官方版', '原生', '现场版', '网易出品'];
const currentOrder = ref('上升最快');
const orders = ['上升最快', '最热', '最新'];
const mvs = ref<any[]>([]);
const hasMore = ref(true);
const loading = ref(true);
const scroll = findScroll('main');
const offset = computed(() => {
  return mvs.value.length;
});
function initData() {
  mvs.value = [];
  hasMore.value = true;
}
watch(
  () => [currentType, currentArea, currentOrder],
  async () => {
    initData();
    if (hasMore.value) {
      loading.value = true;
      const res = await getMvs(
        offset.value,
        40,
        currentArea.value,
        currentType.value,
        currentOrder.value
      );
      hasMore.value = res.more;
      mvs.value = res.mvs;
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
      const res = await getMvs(
        offset.value,
        40,
        currentArea.value,
        currentType.value,
        currentOrder.value
      );
      hasMore.value = res.more;
      mvs.value.push(...res.mvs);
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
  margin: 30px auto 0;
  gap: 20px;
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
