<template>
  <loading-tip :is-load="isLoad"></loading-tip>
  <div class="artist-mv-container">
    <template v-for="item in currentMvs" :key="item.id">
      <mv-item :info="item"></mv-item>
    </template>
  </div>
  <el-pagination
    :total="passCount"
    v-model:current-page="currentPage"
    :page-size="pageSize"
    @current-change="returnTop"
    layout="prev, pager, next"
    hide-on-single-page
    style="text-align: center"
  />
  <no-more-tip v-if="currentMvs.length === 0 && isLoad"></no-more-tip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getArtistMv } from '@/hooks/artist';
import { backToTop } from '@/hooks/scroll';
import MvItem from '@/components/SingleItem/video/mvItem.vue';

const currentPage = ref(1);
const pageSize = ref(12);
const isLoad = ref(false);
const props = defineProps<{ id: string | number; passCount: number }>();
const mvList = ref<{ page: number; mvs: any[] }[]>([]);
const currentMvs = ref<any[]>([]);
async function returnTop() {
  currentMvs.value = await getPartMv(currentPage.value);

  backToTop('main', 200);
}
async function getPartMv(page: number) {
  const i = mvList.value.findIndex((item: any) => {
    return item.page === page;
  });
  if (i === -1) {
    isLoad.value = false;
    const offset = (page - 1) * pageSize.value;
    const res = await getArtistMv(props.id, offset, 12);
    mvList.value.push({ page: page, mvs: res });
    isLoad.value = true;
    return res;
  } else return mvList.value[i].mvs;
}
async function init() {
  const res = await getPartMv(1);
  currentMvs.value = res;
}
init();
</script>

<style scoped lang="less">
@media screen and (max-width: 1000px) {
  .artist-mv-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 8px;
    width: 90%;
    margin: 10px 5%;
  }
}
@media screen and (min-width: 1000px) {
  .artist-mv-container {
    display: grid;
    max-width: 1200px;
    width: 90%;
    grid-gap: 8px;

    margin: 10px 5%;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
