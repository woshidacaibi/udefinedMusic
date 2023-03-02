<template>
  <div class="foot-container">
    <audio-player></audio-player>
    <move-lyrics v-show="moveLyricsShow" class="move-panel"></move-lyrics>
  </div>
</template>

<script lang="ts" setup>
import AudioPlayer from '@/basic/AudioPlayer.vue';
import { storeToRefs } from 'pinia';
import { playerStore } from '@/stores/audioPlayer';
import MoveLyrics from '@/components/AudioPlayer/moveLyrics.vue';
const { moveLyricsShow } = storeToRefs(playerStore());
</script>

<style scoped lang="less">
.foot-container {
  height: 60px;
  width: 100%;
  border-top: 1px solid var(--layout-border-color);
}
.move-panel {
  height: 80px;
  width: 450px;
  position: absolute;
  background-color: transparent;
  color: var(--theme-color);
  border-right: 5px;
  transition-property: background-color, color;
  transition-duration: 0.3s;
}
.move-panel:hover {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}
</style>
