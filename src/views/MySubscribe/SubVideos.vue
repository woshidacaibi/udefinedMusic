<template>
  <div class="sub-items-container">
    <loading-tip :login-check="true" :is-load="isLoad"></loading-tip>
    <template v-if="likeVideos !== null">
      <no-more-tip v-if="likeVideos.length === 0"></no-more-tip>
      <el-divider content-position="left"
        ><h3>我收藏的视频({{ likeVideos.length }})</h3></el-divider
      >
      <div class="grid-container">
        <template v-for="item in currentData" :key="item.id">
          <VideoItem v-if="item.type === 1" :info="item"></VideoItem>
          <VIdeoMvTypeItem :info="item" v-else></VIdeoMvTypeItem>
        </template>
      </div>
      <el-pagination
        :total="likeVideos.length"
        v-model:current-page="currentPage"
        :page-size="pageSize"
        @current-change="backToTop('main')"
        layout="prev, pager, next"
        hide-on-single-page
        style="text-align: center"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { accountStore } from '@/stores/user';
import { getLikeVideo } from '@/hooks/user';
import { backToTop } from '@/hooks/scroll';
import VideoItem from '@/components/SingleItem/video/videoItem.vue';
import VIdeoMvTypeItem from '@/components/SingleItem/video/VIdeoMvTypeItem.vue';

const { likeVideos } = storeToRefs(accountStore());
const isLoad = ref(false);
const currentPage = ref(1);
const pageSize = ref(24);
const currentData = computed(() => {
  return likeVideos.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
if (likeVideos.value === null) {
  getInfo();
} else {
  isLoad.value = true;
}

async function getInfo() {
  isLoad.value = false;
  setTimeout(async () => {
    await getLikeVideo();
    isLoad.value = true;
  }, 500);
}
</script>

<style scoped lang="less">
.sub-items-container {
  margin: 40px 30px;
}
.grid-container {
  display: grid;
  grid-gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
h3 {
  font-size: 20px;
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
