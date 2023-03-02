<template>
  <div class="list-item-t1-container">
    <router-link
      :to="{
        name: 'playlist',
        query: {
          id: info.id,
        },
      }"
      class="left-img"
    >
      <load-img :src="info.coverImgUrl + '?param=200y200'"></load-img>
    </router-link>
    <ul class="preview-songs">
      <li class="name">
        {{ info.name }}
        <i @click="playAll" class="iconfont icon-bofang" title="播放全部"></i>
      </li>
      <template
        v-for="(item, index) in previewSongs.slice(0, 10)"
        :key="item.id"
      >
        <preview-song-item
          :info="item"
          :index="index >= 9 ? index + 1 : '0' + (index + 1)"
        ></preview-song-item>
      </template>
      <li class="bottom" v-if="previewSongs.length > 10">
        <router-link
          :to="{
            name: 'playlist',
            query: {
              id: info.id,
            },
          }"
        >
          查看全部{{ info.trackCount }}首 >
        </router-link>
      </li>
      <no-more-tip
        v-if="info.trackCount <= 0"
        content="歌单歌曲为空"
      ></no-more-tip>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import PreviewSongItem from '@/components/SingleItem/playlist/PreviewSongItem.vue';
import { getListPartSongs, getListSongs } from '@/hooks/playlist';
import { replaceList } from '@/hooks/audioPlayer';
const props = defineProps<{ info: any }>();
const previewSongs = ref<any[]>([]);
const listSongs = ref<any[]>([]);
async function getPreviewSongs() {
  const res = await getListPartSongs(props.info.id);
  previewSongs.value = res.list;
}
async function playAll() {
  if (props.info.trackCount === 0) {
    ElMessage({ type: 'warning', message: '歌单为空，无法播放' });
    return;
  }
  if (listSongs.value.length !== props.info.trackCount) {
    if (previewSongs.value.length < props.info.trackCount) {
      const a = ElMessage({
        type: 'info',
        duration: 0,
        message: '加载全部歌曲中。。。',
      });
      const res = await getListSongs(props.info.id);
      listSongs.value = res.list;
      a.close();
    } else listSongs.value = previewSongs.value;
  }
  replaceList(listSongs.value);
}
getPreviewSongs();
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType1.less';
</style>
