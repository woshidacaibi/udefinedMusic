<template>
  <div class="playlists-header" ref="listHeader">
    <span>{{ header }}</span>
    <div class="type-change">
      <i class="iconfont icon-liebiaomoshi active" v-if="type === 1"></i>
      <i class="iconfont icon-liebiaomoshi" @click="type = 1" v-else></i>
      <i class="iconfont icon-31liebiao active" v-if="type === 2"></i>
      <i class="iconfont icon-31liebiao" @click="type = 2" v-else></i>
      <i class="iconfont icon-jiaqileixing active" v-if="type === 3"></i>
      <i class="iconfont icon-jiaqileixing" @click="type = 3" v-else></i>
    </div>
  </div>
  <div class="playlists-container">
    <template v-for="item in currentList" :key="item.id">
      <playlist-preview-item-t1
        v-if="type === 1"
        :info="item"
      ></playlist-preview-item-t1>
      <playlist-preview-item-t2
        :info="item"
        v-if="type === 2"
      ></playlist-preview-item-t2>
    </template>
    <div class="type-3">
      <template v-for="item in currentList" :key="item.id">
        <playlist-preview-item-t3
          :info="item"
          v-if="type === 3"
          class="grid-item"
        ></playlist-preview-item-t3>
      </template>
    </div>
    <el-pagination
      :total="lists.length"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      @current-change="returnTop"
      layout="prev, pager, next"
      hide-on-single-page
      style="text-align: center"
    />
  </div>
  <no-more-tip
    v-if="lists.length === 0"
    :content="'此地查无歌单（悲）'"
  ></no-more-tip>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import PlaylistPreviewItemT1 from '@/components/SingleItem/playlist/playlistPreviewItemT1.vue';
import PlaylistPreviewItemT2 from '@/components/SingleItem/playlist/playlistPreviewItemT2.vue';
import PlaylistPreviewItemT3 from '@/components/SingleItem/playlist/playlistPreviewItemT3.vue';
import { backToTop } from '@/hooks/scroll';

const props = defineProps<{ lists: any[]; header?: string }>();
const type = ref(1);
const currentPage = ref(1);
const pageSize = ref(10);
const listHeader = ref<null | HTMLElement>(null);
const currentList = computed(() => {
  return props.lists.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
function returnTop() {
  if (listHeader.value) {
    backToTop('main', listHeader.value.offsetTop);
  }
}
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewContainer.less';
</style>
