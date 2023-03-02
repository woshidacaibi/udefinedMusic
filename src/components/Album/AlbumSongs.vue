<template>
  <ul class="title clearfix">
    <li class="operate"></li>
    <li class="song-name">歌曲名称</li>
    <li class="artist-name">歌手</li>
    <li class="duration">时长</li>
    <li class="hot">热度</li>
  </ul>
  <div>
    <template v-for="(item, index) in tracks" :key="item.id">
      <album-song-item :index="index + 1" :info="item"></album-song-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import AlbumSongItem from '@/components/SingleItem/album/AlbumSongItem.vue';
const props = defineProps<{ tracks: any[] }>();
</script>

<style lang="less" scoped>
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
  .song-name {
    width: calc(100% * (5 / 12));
  }
  .operate {
    width: calc(100% / 6);
  }
  .artist-name {
    width: calc(100% / 6);
  }
  .duration {
    width: calc(100% / 12);
  }
  .hot {
    width: calc(100% / 6);
  }
}
</style>
