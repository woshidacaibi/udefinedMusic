<template>
  <router-link
    :to="{ path: 'playlist', query: { id: info.id } }"
    class="list-item-t2-container"
  >
    <div class="item-img">
      <LoadImg :src="info.coverImgUrl + '?param=100y100'"></LoadImg>
      <span @click.prevent="playAll" class="icon-contain"
        ><i class="iconfont icon-bofang1"></i
      ></span>
    </div>
    <div class="list-name">
      <span class="overflow">
        <b>{{ info.name }}</b>
      </span>
    </div>
    <div class="list-owner">
      <span class="overflow">
        <router-link :to="{ name: 'user', query: { id: info.creator.userId } }">
          <b>by {{ info.creator.nickname }}</b>
        </router-link>
      </span>
    </div>
    <div class="list-count">
      <span class="overflow"> 共{{ info.trackCount }}首 </span>
    </div>
    <div class="list-playCount">播放次数：{{ playCount }}</div>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getListSongs } from '@/hooks/playlist';
import { replaceList } from '@/hooks/audioPlayer';
import { ElMessage } from 'element-plus';
const props = defineProps<{ info: any }>();
async function playAll() {
  if (props.info.trackCount === 0) {
    ElMessage({ type: 'warning', message: '歌单为空，无法播放' });
    return;
  }
  const a = ElMessage({
    type: 'info',
    duration: 0,
    message: '加载全部歌曲中。。。',
  });
  const res = await getListSongs(props.info.id);
  replaceList(res.list);
  a.close();
}
const playCount = computed(() => {
  return props.info.playCount > 10000
    ? parseInt((props.info.playCount / 10000).toString()) + '万'
    : props.info.playCount;
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType2.less';
</style>
