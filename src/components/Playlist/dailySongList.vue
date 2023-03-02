<template>
  <div>
    <h2><day-icon class="day"></day-icon>每日歌曲推荐</h2>
    <div>
      <template v-if="isLoad">
        <template v-if="lists.length > 0">
          <ul class="title clearfix">
            <li class="operate" @click="playAll">
              播放全部 <i class="iconfont icon-24gl-play"></i>
            </li>
            <li class="song-name">歌曲名称</li>
            <li class="artist-name">歌手</li>
            <li class="album-name">专辑</li>
            <li class="duration">时长</li>
          </ul>
          <ul>
            <playlist-song-item
              v-for="(item, index) in lists"
              :key="item.id"
              :info="item"
              :index="index + 1 <= 9 ? '0' + (index + 1) : index + 1"
            ></playlist-song-item>
          </ul>
        </template>
        <error-tip v-else></error-tip>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import DayIcon from '@/basic/dayIcon.vue';
import { getDailySongs } from '@/hooks/home';

import { ref } from 'vue';
import { replaceList } from '@/hooks/audioPlayer';

const lists = ref<any[]>();
const isLoad = ref(false);
async function init() {
  isLoad.value = false;
  lists.value = await getDailySongs();
  isLoad.value = true;
}
init();
async function playAll() {
  replaceList(lists.value as []);
}
</script>

<style lang="less" scoped>
h2 {
  height: 80px;
  line-height: 80px;
  font-size: 24px;
  margin-left: 20px;
  margin-top: 10px;
}
.day {
  float: left;
  margin-right: 10px;
  font-size: 60px;
  color: var(--theme-color);
}
.title {
  border-top: 1px solid var(--hover-more-color);
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
