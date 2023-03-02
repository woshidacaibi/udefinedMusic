<template>
  <ul class="title clearfix">
    <li class="operate"></li>
    <li class="song-name">歌曲名称</li>
    <li class="artist-name">歌手</li>
    <li class="album-name">专辑</li>
    <li class="duration">时长</li>
  </ul>
  <ul>
    <playlist-song-item
      v-for="(item, index) in tracks"
      :key="item.id"
      :info="item"
      :index="index + 1 <= 9 ? '0' + (index + 1) : index + 1"
    ></playlist-song-item>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{ tracks: any }>();
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
