<template>
  <template v-if="isLoad">
    <ul class="title clearfix">
      <li class="operate" @click="playAll">
        播放全部 <i class="iconfont icon-24gl-play"></i>
      </li>
      <li class="song-name">歌曲名称</li>
      <li class="artist-name">歌手</li>
      <li class="album-name">专辑</li>
      <li class="duration">时长</li>
    </ul>
    <ErrorTip v-if="isError"></ErrorTip>
    <ul v-if="!isError">
      <no-more-tip
        v-if="currentTrack.length === 0"
        :content="'暂无作品'"
      ></no-more-tip>
      <playlist-song-item
        v-for="(item, index) in currentTrack"
        :key="item.id"
        :info="item"
        :index="index + 1 <= 9 ? '0' + (index + 1) : index + 1"
      ></playlist-song-item>
    </ul>
    <el-pagination
      v-if="!isError"
      :total="passCount"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      @current-change="backToTop('main')"
      layout="prev, pager, next"
      hide-on-single-page
      style="text-align: center"
    />
  </template>
  <LoadingTip style="margin-top: 30px" :is-load="isLoad" />
</template>

<script lang="ts" setup>
// 获取完整歌单歌曲
import { computed, markRaw, ref, watch } from 'vue';
import PlaylistSongItem from '@/components/SingleItem/playlist/PlaylistSongItem.vue';
import { ElMessage } from 'element-plus';
import { replaceList } from '@/hooks/audioPlayer';
import NoMoreTip from '@/basic/NoMoreTip.vue';
import { backToTop } from '@/hooks/scroll';
import { getArtistSongs, getArtistAllSongs } from '@/hooks/artist';
const props = defineProps<{ id: number | string; passCount: number }>();

const messageError = ref<any>(null);
const isError = computed(() => {
  return props.id === '' || messageError.value;
});
const list = ref<{ page: number; tracks: any[] }[]>([]);
const tracks = ref<any[]>([]);
const isLoad = ref(false);
const currentPage = ref(1);
const pageSize = 100;

const currentTrack = ref<any[]>([]);
async function getAllTracks() {
  if (props.id) {
    const a = ElMessage({
      type: 'info',
      duration: 0,
      message: '加载全部歌曲中。。。',
    });
    const res = await getArtistAllSongs(props.id);
    a.close();
    tracks.value = res.list;
  }
}
async function playAll() {
  if (!isLoad.value) {
    ElMessage.warning('请等待加载完毕后再试');
    return;
  }
  const res = await getAllTracks();
  replaceList(markRaw(tracks.value));
}
watch(
  currentPage,
  async (newVal) => {
    isLoad.value = false;
    const i = list.value.findIndex((item: any) => {
      return item.page === newVal;
    });
    if (i === -1) {
      const res = await getArtistSongs(props.id, (newVal - 1) * pageSize);
      messageError.value = res.error;
      currentTrack.value = res.list;
      list.value.push({ page: newVal, tracks: res.list });
    } else {
      currentTrack.value = list.value[i].tracks;
    }

    isLoad.value = true;
  },
  { immediate: true }
);
// getAllTracks();
</script>

<style scoped lang="less">
.title {
  li {
    float: left;
    height: 40px;
    line-height: 40px;
    display: block;
    padding-left: 5px;
    transition: all 0.3s;
  }
  li:nth-child(n + 2):hover {
    background-color: var(--hover-color);
    color: var(--theme-color);
  }
  .operate {
    width: calc(100% / 6);
    cursor: pointer;
    transition: color 0.5s;
  }
  .operate:hover {
    color: var(--theme-color);
  }
  .song-name {
    width: calc(100% / 3);
  }
  .artist-name {
    width: calc(100% / 6);
  }
  .album-name {
    width: calc(100% / 4);
  }
  .duration {
    width: calc(100% / 12);
  }
}
</style>
