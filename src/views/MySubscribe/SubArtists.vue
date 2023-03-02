<template>
  <div class="sub-items-container">
    <loading-tip :login-check="true" :is-load="isLoad"></loading-tip>
    <template v-if="likeArtists !== null">
      <no-more-tip v-if="likeArtists.length === 0"></no-more-tip>
      <el-divider content-position="left"
        ><h3>我收藏的歌手({{ likeArtists.length }})</h3></el-divider
      >
      <div class="grid-container">
        <template v-for="item in currentData" :key="item.id">
          <ArtistItem :info="item"></ArtistItem>
        </template>
      </div>
      <el-pagination
        :total="likeArtists.length"
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
import { getLikeArtists } from '@/hooks/user';
import { backToTop } from '@/hooks/scroll';
import ArtistItem from '@/components/SingleItem/artistItem.vue';

const { likeArtists } = storeToRefs(accountStore());
const isLoad = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const currentData = computed(() => {
  return likeArtists.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});
if (likeArtists.value === null) {
  getInfo();
} else {
  isLoad.value = true;
}
async function getInfo() {
  isLoad.value = false;
  setTimeout(async () => {
    await getLikeArtists();
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
