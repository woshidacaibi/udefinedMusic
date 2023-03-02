<template>
  <div class="list-item-t3-container">
    <div class="cover">
      <router-link :to="{ name: 'daily' }">
        <load-img
          class="cover-img"
          :src="lists[0].al.picUrl + '?param=200y200'"
        ></load-img>
        <div class="curtain"></div>
        <day-icon class="icon"></day-icon>
      </router-link>
      <span @click.prevent="playAll" class="icon-contain"
        ><i class="iconfont icon-bofang1"></i
      ></span>
    </div>
    <router-link :to="{ name: 'daily' }" class="overflow list-name"
      >每日歌曲推荐</router-link
    >
    <p class="playCount">共{{ lists.length }}首</p>
  </div>
</template>

<script lang="ts" setup>
import { replaceList } from '@/hooks/audioPlayer';

const props = defineProps<{ lists: any[] }>();

async function playAll() {
  replaceList(props.lists);
}
</script>

<style scoped lang="less">
@import '@/assets/css&less/preview/previewType3.less';
.curtain {
  opacity: 0.3;
}
.cover:hover {
  .curtain {
    opacity: 0.6;
  }
}
.icon {
  position: absolute;
  display: block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  line-height: 80px;
  text-align: center;
  z-index: 1;
  opacity: 1;
  color: white;
}
</style>
