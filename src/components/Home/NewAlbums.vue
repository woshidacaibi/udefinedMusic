<template>
  <div class="reco-container">
    <ul class="place">
      <li class="active" v-if="type === 'ALL'">全部</li>
      <li @click="setType('ALL')" v-else>全部</li>
      <li class="active" v-if="type === 'ZH'">华语</li>
      <li @click="setType('ZH')" v-else>华语</li>
      <li class="active" v-if="type === 'EA'">欧美</li>
      <li @click="setType('EA')" v-else>欧美</li>
      <li class="active" v-if="type === 'JP'">日本</li>
      <li @click="setType('JP')" v-else>日本</li>
      <li class="active" v-if="type === 'KR'">韩国</li>
      <li @click="setType('KR')" v-else>韩国</li>
    </ul>
    <router-link :to="{ name: 'home-album' }" class="toMore"
      >更多 <i class="iconfont icon-xiangyoujiantou"></i
    ></router-link>
    <template v-if="isLoad">
      <error-tip v-if="albums.length === 0"></error-tip>
      <MySwiper height="520px" v-else>
        <el-carousel-item v-for="round in page" :key="round">
          <div class="grid-container">
            <template
              v-for="(item, index) in albums.slice(round * 10 - 10, 10 * round)"
              :key="item.id"
            >
              <album-preview-item-t3
                v-if="index < 8"
                :info="item"
              ></album-preview-item-t3>
              <album-preview-item-t3
                class="wide-item"
                v-else
                :info="item"
              ></album-preview-item-t3>
            </template>
          </div>
        </el-carousel-item>
      </MySwiper>
    </template>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getNewAlbum } from '@/hooks/album';
import AlbumPreviewItemT3 from '@/components/SingleItem/album/albumPreviewItemT3.vue';

const type = ref('ALL');
const isLoad = ref(false);
const albums = ref<any[]>([]);
const page = ref(0);
function setType(t: string) {
  type.value = t;
}
watch(
  type,
  async () => {
    isLoad.value = false;
    albums.value = await getNewAlbum(0, 40, type.value);
    page.value = albums.value.length / 10;
    isLoad.value = true;
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
@import '@/assets/css&less/homeArea.less';
.reco-container {
  max-width: 1000px;
  margin: 0 auto;
}
.grid-container {
  display: grid;
  gap: 10px;
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
  .wide-item {
    display: block;
  }
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
  .wide-item {
    display: none;
  }
}
</style>
