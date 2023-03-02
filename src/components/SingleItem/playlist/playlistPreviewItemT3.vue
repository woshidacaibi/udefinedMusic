<template>
  <div class="list-item-t3-container">
    <div class="cover">
      <router-link :to="{ name: 'playlist', query: { id: info.id } }">
        <load-img
          class="cover-img"
          :src="info.coverImgUrl + '?param=200y200'"
          v-if="info.coverImgUrl"
        ></load-img>
        <load-img
          class="cover-img"
          :src="info.picUrl + '?param=200y200'"
          v-if="info.picUrl"
        ></load-img>
        <div class="curtain"></div>
      </router-link>
      <span @click.prevent="playAll" class="icon-contain"
        ><i class="iconfont icon-bofang1"></i
      ></span>
    </div>
    <router-link
      :to="{ name: 'playlist', query: { id: info.id } }"
      class="overflow list-name"
      >{{ info.name }}</router-link
    >
    <router-link
      :to="{ name: 'user', query: { id: info.creator.userId } }"
      class="list-owner"
      v-if="info.creator"
    >
      {{ info.creator.nickname }}
    </router-link>
    <p class="playCount">播放量：{{ playCount }}</p>
  </div>
</template>

<script lang="ts" setup>
import { getListSongs } from '@/hooks/playlist';
import { replaceList } from '@/hooks/audioPlayer';
import { ElMessage } from 'element-plus';
import { computed } from 'vue';
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
  let x;
  if ('playCount' in props.info) {
    x = props.info.playCount;
  } else {
    x = props.info.playcount;
  }
  return x > 10000 ? parseInt((x / 10000).toString()) + '万' : x;
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType3.less';
</style>
