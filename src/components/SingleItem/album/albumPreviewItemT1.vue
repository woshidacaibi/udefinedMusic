<template>
  <div class="list-item-t1-container">
    <router-link
      :to="{
        name: 'album',
        query: {
          id: info.id,
        },
      }"
      class="left-img"
    >
      <load-img :src="info.picUrl + '?param=200y200'"></load-img>
    </router-link>
    <ul class="preview-songs">
      <li class="name">
        {{ info.name }}
        <i @click="playAll" class="iconfont icon-bofang" title="播放全部"></i>
      </li>
      <template v-if="isLoad">
        <template v-for="(item, index) in songs.slice(0, 10)" :key="item.id">
          <preview-song-item
            :info="item"
            :index="index >= 9 ? index + 1 : '0' + (index + 1)"
          ></preview-song-item>
        </template>
        <li class="bottom" v-if="songs.length > 10">
          <router-link
            :to="{
              name: 'album',
              query: {
                id: info.id,
              },
            }"
          >
            查看全部{{ songs.length }}首 >
          </router-link>
        </li>
        <no-more-tip
          v-if="info.trackCount <= 0"
          content="歌单歌曲为空"
        ></no-more-tip>
      </template>
      <loading-tip :is-load="isLoad"></loading-tip>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getAlbumDetail } from '@/hooks/album';
import { replaceList } from '@/hooks/audioPlayer';
import { ElMessage } from 'element-plus';

const props = defineProps<{ info: any }>();
const songs = ref<any[]>([]);
const isLoad = ref(false);
async function init() {
  const res = await getAlbumDetail(props.info.id);
  songs.value = res.songs as any;
  isLoad.value = true;
}
async function playAll() {
  if (songs.value.length === 0) {
    ElMessage({ type: 'warning', message: '专辑为空，无法播放' });
    return;
  }
  if (!isLoad.value) {
    ElMessage({ type: 'warning', message: '专辑歌曲加载中，请稍后再试' });
    return;
  }
  replaceList(songs.value);
}
init();
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType1.less';
</style>
