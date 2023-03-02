<template>
  <div class="item-container" @dblclick="playItem">
    <div class="cover-img">
      <load-img :src="info.album.picUrl + '?param=80y80'"></load-img>
      <span class="icon-contain" @click="playItem"
        ><i class="iconfont icon-bofang1"></i
      ></span>
    </div>
    <div class="detail">
      <div class="title overflow" :title="info.name">{{ info.name }}</div>
      <div>
        <span class="artist-name overflow">
          <template v-for="(item, index) in info.artists" :key="item.id">
            <router-link
              v-if="item.id !== 0"
              :title="item.name"
              :to="{ name: 'artist', query: { id: item.id } }"
              >{{ item.name }}</router-link
            >
            <b class="alia" v-else>{{ item.name }}</b>
            <b v-if="index !== info.artists.length - 1"> \&nbsp;</b>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ info: any }>();
import { getSongDetail } from '@/hooks/song';
import { playSong } from '@/hooks/audioPlayer';

async function playItem() {
  const res = await getSongDetail(props.info.id);
  playSong(res[0]);
}
</script>

<style scoped lang="less">
.item-container {
  height: 75px;
  display: flex;
  border-radius: 5px;
  transition: background-color 0.3s;
}
.item-container:hover {
  background-color: var(--hover-color);
}
.cover-img {
  margin: 10px;
  overflow: hidden;
  border-radius: 5px;
  flex-shrink: 0;
  height: 55px;
  width: 55px;
}
.cover-img:hover {
  .icon-contain {
    opacity: 0.6;
  }
}
.icon-contain {
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  background-color: rgba(255, 255, 255);
  z-index: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  transition: opacity 0.5s;
  opacity: 0;
  cursor: pointer;
  color: var(--theme-color);
}
.title {
  margin-top: 12px;
}
.artist-name {
  color: var(--hover-more-color);
  a,
  b {
    color: var(--hover-more-color);
    transition: color 0.5s;
  }
  a:hover {
    color: var(--theme-color);
  }
}
</style>
