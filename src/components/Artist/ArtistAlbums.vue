<template>
  <div class="playlists-header" ref="listHeader">
    <div class="type-change">
      <i class="iconfont icon-liebiaomoshi active" v-if="type === 1"></i>
      <i class="iconfont icon-liebiaomoshi" @click="type = 1" v-else></i>
      <i class="iconfont icon-31liebiao active" v-if="type === 2"></i>
      <i class="iconfont icon-31liebiao" @click="type = 2" v-else></i>
      <i class="iconfont icon-jiaqileixing active" v-if="type === 3"></i>
      <i class="iconfont icon-jiaqileixing" @click="type = 3" v-else></i>
    </div>
  </div>
  <div v-if="isLoad" class="playlists-container">
    <template v-for="item in currentList" :key="item.id">
      <album-preview-item-t1
        v-if="type === 1"
        :info="item"
      ></album-preview-item-t1>
      <album-preview-item-t2
        :info="item"
        v-if="type === 2"
      ></album-preview-item-t2>
    </template>
    <div class="type-3">
      <template v-for="item in currentList" :key="item.id">
        <album-preview-item-t3
          :info="item"
          v-if="type === 3"
        ></album-preview-item-t3>
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
  </div>
  <loading-tip :is-load="isLoad"></loading-tip>
  <no-more-tip
    v-if="passCount === 0"
    :content="'此地查无歌单（悲）'"
  ></no-more-tip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getArtistAlbum } from '@/hooks/artist';
import { backToTop } from '@/hooks/scroll';

import AlbumPreviewItemT1 from '@/components/SingleItem/album/albumPreviewItemT1.vue';
import AlbumPreviewItemT2 from '@/components/SingleItem/album/albumPreviewItemT2.vue';
import AlbumPreviewItemT3 from '@/components/SingleItem/album/albumPreviewItemT3.vue';

const props = defineProps<{ id: string | number; passCount: number }>();
const isLoad = ref(false);
const type = ref(1);
const currentPage = ref(1);
const pageSize = ref(10);
const list = ref<{ page: number; albums: any[] }[]>([]);
const currentList = ref<any[]>();

async function returnTop() {
  const res = await getPartAlbum(currentPage.value);
  currentList.value = res;
  backToTop('main', 200);
}
async function getPartAlbum(page: number) {
  const i = list.value.findIndex((item) => {
    return item.page === page;
  });
  if (i === -1) {
    isLoad.value = false;
    const res = await getArtistAlbum(props.id, (page - 1) * 10);
    list.value.push({ page: page, albums: res });
    isLoad.value = true;
    return res;
  } else return list.value[i].albums;
}
async function init() {
  const res = await getPartAlbum(1);
  currentList.value = res;
}
init();
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewContainer.less';
.playlists-header {
  margin-top: 0;
}
</style>
