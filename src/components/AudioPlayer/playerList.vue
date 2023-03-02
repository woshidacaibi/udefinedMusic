<template>
  <div class="playerList-container" v-show="playerListShow" ref="main">
    <scroll-bar sid="playerList">
      <div class="content">
        <h2>播放列表</h2>
        <div class="clearfix message">
          <span class="number">共{{ List.length }}首</span>
          <span @click="clearAll" class="clear"
            >清空<i class="iconfont icon-icon1"></i
          ></span>
        </div>
        <el-pagination
          :total="List.length"
          v-model:current-page="currentPage"
          :page-size="storeLimit"
          layout="prev, pager, next"
          hide-on-single-page
          style="text-align: center"
        />
        <ul>
          <el-empty
            :description="'暂无可播放歌曲'"
            :image-size="120"
            v-if="playingIndex === -100"
          ></el-empty>
          <template v-for="(item, index) in showList" :key="item.id">
            <audio-song-item :info="item" :index="index"></audio-song-item>
          </template>
        </ul>
      </div>
    </scroll-bar>
  </div>
</template>

<script lang="ts" setup>
import { playerStore } from '@/stores/audioPlayer';
import { backToTop } from '@/hooks/scroll';
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue';
import AudioSongItem from '@/components/SingleItem/audio/AudioSongItem.vue';
const { playerListShow, List, playingIndex, blockSize, storeLimit } =
  storeToRefs(playerStore());
const main = ref<HTMLElement | null>(null);
const currentPage = ref(1);
const showList = computed(() => {
  backToTop('playerList');
  return List.value.slice(
    (currentPage.value - 1) * storeLimit.value,
    currentPage.value * storeLimit.value
  );
});
watch(List, () => {
  currentPage.value = 1;
});
const clickWatcher = watch(playerListShow, (newVal) => {
  if (newVal) {
    window.addEventListener('click', clickLeave);
  } else {
    window.removeEventListener('click', clickLeave);
  }
});
function clickLeave(e: MouseEvent) {
  const player = document.getElementById('player');
  if (main.value && player) {
    if (
      !main.value.contains(e.target as HTMLElement) &&
      !player.contains(e.target as HTMLElement) &&
      !(e.target as HTMLElement).classList.contains('audiolistconsole')
    ) {
      playerListShow.value = false;
    }
  }
}
function clearAll() {
  List.value = [];
  playingIndex.value = -100;
}
onMounted(() => {
  if (playerListShow.value) window.addEventListener('click', clickLeave);
});
onBeforeUnmount(() => {
  clickWatcher();
  window.removeEventListener('click', clickLeave);
});
</script>

<style scoped lang="less">
.playerList-container {
  position: absolute;
  z-index: 1101;
  top: 0;
  right: 0;
  height: 100%;
  background-color: var(--container-color);
  box-shadow: var(--el-box-shadow-light);
}
.content {
  width: 400px;
  margin: 10px 0 3px 6px;
}
.message {
  border-bottom: 1px solid var(--hover-color);
  padding-bottom: 5px;
}
.number {
  color: var(--hover-more-color);
  float: left;
}
.clear {
  float: right;
  margin-right: 10px;
  transition: color 0.3s;
  cursor: pointer;
}
.clear:hover {
  color: var(--theme-color);
}
.back {
  right: 0;
}
</style>
