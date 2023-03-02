<template>
  <div class="list-item-t3-container">
    <div class="cover">
      <router-link :to="{ name: 'album', query: { id: info.id } }">
        <load-img
          class="cover-img"
          :src="info.picUrl + '?param=200y200'"
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
      v-if="showArtist"
      :to="{ name: 'artist', query: { id: info.artist.id } }"
      class="list-owner"
    >
      {{ info.artist.name }}
    </router-link>
    <p class="playCount">
      发行时间：{{ dayjs(info.publishTime).format('YYYY-MM-DD') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getAlbumDetail } from '@/hooks/album';
import { replaceList } from '@/hooks/audioPlayer';
const props = withDefaults(defineProps<{ info: any; showArtist?: boolean }>(), {
  showArtist: false,
});
const songs = ref<any[]>([]);
async function playAll() {
  const a = ElMessage({
    type: 'info',
    duration: 0,
    message: '加载全部歌曲中。。。',
  });
  const res = await getAlbumDetail(props.info.id);
  songs.value = res.songs as any;
  replaceList(songs.value as any);
  a.close();
}
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType3.less';
</style>
