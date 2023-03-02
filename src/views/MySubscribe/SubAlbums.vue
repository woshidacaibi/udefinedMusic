<template>
  <div class="sub-items-container">
    <loading-tip :login-check="true" :is-load="isLoad"></loading-tip>
    <template v-if="likeAlbums !== null">
      <no-more-tip v-if="likeAlbums.length === 0"></no-more-tip>
      <el-divider content-position="left"
        ><h3>我收藏的专辑({{ likeAlbums.length }})</h3></el-divider
      >
      <div class="grid-container">
        <template v-for="item in currentData" :key="item.id">
          <AlbumPreviewItemT3 :info="item"></AlbumPreviewItemT3>
        </template>
      </div>
      <el-pagination
        :total="likeAlbums.length"
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
import { getLikeAlbum } from '@/hooks/user';
import { backToTop } from '@/hooks/scroll';
import AlbumPreviewItemT3 from '@/components/SingleItem/album/albumPreviewItemT3.vue';

const { likeAlbums } = storeToRefs(accountStore());
const isLoad = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const currentData = computed(() => {
  return likeAlbums.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
if (likeAlbums.value === null) {
  getInfo();
} else {
  isLoad.value = true;
}
async function getInfo() {
  isLoad.value = false;
  setTimeout(async () => {
    await getLikeAlbum();
    isLoad.value = true;
  }, 500);
}
</script>

<style scoped lang="less">
.sub-items-container {
  margin: 40px 15px;
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
    grid-template-columns: repeat(5, 1fr);
  }
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
