<template>
  <router-link
    :to="{ path: 'album', query: { id: info.id } }"
    class="list-item-t2-container"
  >
    <div class="item-img">
      <LoadImg :src="info.picUrl + '?param=100y100'"></LoadImg>
      <span @click.prevent="playAll" class="icon-contain"
        ><i class="iconfont icon-bofang1"></i
      ></span>
    </div>
    <div class="list-name">
      <span class="overflow">
        <b>{{ info.name }}</b>
      </span>
    </div>
    <!--    <div class="list-owner">-->
    <!--      <span class="overflow">-->
    <!--        <router-link :to="{ name: 'user', query: { id: info.creator.userId } }">-->
    <!--          <b>by {{ 11 }}</b>-->
    <!--        </router-link>-->
    <!--      </span>-->
    <!--    </div>-->
    <div class="list-publishTime">
      <span class="overflow">
        发行时间:{{ dayjs(info.publishTime).format('YYYY-MM-DD') }}
      </span>
    </div>
    <!--    <div class="list-playCount">播放次数：{{ 0 }}</div>-->
  </router-link>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref } from 'vue';
import { getAlbumDetail } from '@/hooks/album';
import { ElMessage } from 'element-plus';
import { replaceList } from '@/hooks/audioPlayer';

const props = defineProps<{ info: any }>();
const songs = ref<any[]>();
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
@import '@/assets/css&less/preview/previewType2.less';
</style>
