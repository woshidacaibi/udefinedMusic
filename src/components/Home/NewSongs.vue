<template>
  <div class="reco-container">
    <ul class="place">
      <li class="active" v-if="type === 0">全部</li>
      <li @click="setType(0)" v-else>全部</li>
      <li class="active" v-if="type === 7">华语</li>
      <li @click="setType(7)" v-else>华语</li>
      <li class="active" v-if="type === 96">欧美</li>
      <li @click="setType(96)" v-else>欧美</li>
      <li class="active" v-if="type === 8">日本</li>
      <li @click="setType(8)" v-else>日本</li>
      <li class="active" v-if="type === 16">韩国</li>
      <li @click="setType(16)" v-else>韩国</li>
    </ul>
    <template v-if="isLoad">
      <error-tip v-if="lists.length === 0"></error-tip>
      <MySwiper v-else height="360px">
        <el-carousel-item v-for="round in page" :key="round">
          <div class="new-songs">
            <template
              v-for="item in lists.slice(round * 12 - 12, 12 * round)"
              :key="item.id"
            >
              <new-song-item :info="item"></new-song-item>
            </template>
          </div>
        </el-carousel-item>
      </MySwiper>
    </template>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
</template>

<script lang="ts" setup>
import { getNewSong } from '@/hooks/home';
import { ref, watch, computed } from 'vue';
import NewSongItem from '@/components/SingleItem/song/newSongItem.vue';
const type = ref(0);
const isLoad = ref(false);
const lists = ref<any[]>([]);
const page = computed(() => {
  return parseInt((lists.value.length / 12).toFixed(0));
});
function setType(num: number) {
  type.value = num;
}
watch(
  type,
  async () => {
    isLoad.value = false;
    lists.value = await getNewSong(type.value);
    isLoad.value = true;
  },
  { immediate: true }
);
getNewSong(0);
</script>

<style scoped lang="less">
@import '@/assets/css&less/homeArea.less';

.new-songs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 80px);
  gap: 3px;
}
</style>
