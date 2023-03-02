<template>
  <div
    class="song-detail-container"
    v-show="songDetailsShow && playingSong.id !== -1"
  >
    <scroll-bar sid="songDetail">
      <div style="height: 100%">
        <header>
          <h1 class="overflow">
            <b :title="playingSong.name">{{ playingSong.name }}</b>
            <b
              class="alia"
              v-for="item in playingSong.alia"
              :key="item"
              :title="item"
            >
              ({{ item }})</b
            >
          </h1>
          <div class="overflow artists">
            <template
              v-for="(item, index) in playingSong.artists"
              :key="item.name"
            >
              <router-link
                v-if="item.id !== 0"
                :title="item.name"
                :to="{ name: 'artist', query: { id: item.id } }"
                >{{ item.name }}</router-link
              >
              <b class="alia" v-else>{{ item.name }}</b>
              <b v-if="index !== playingSong.artists.length - 1"> \&nbsp;</b>
            </template>
          </div>
          <div class="overflow artists">
            <router-link
              :to="{ name: 'album', query: { id: playingSong.album.id } }"
            >
              {{ playingSong.album.name }}
            </router-link>
          </div>
        </header>
        <main style="display: flex">
          <div class="left-img clearfix">
            <div class="song-cover-default">
              <div ref="cover" class="cover" @click="pause = !pause">
                <img class="round" :src="roundImg" />
                <img class="song-img" :src="playingSong.cover" />
              </div>
              <img ref="pointer" class="pointer" :src="pointerImg" />
            </div>
          </div>
          <div class="lyrics">
            <scroll-lyrics></scroll-lyrics>
          </div>
        </main>
        <img class="background" :src="playingSong.cover" />
      </div>
      <comment-panel
        v-if="playingSong.id !== -1 && songDetailsShow"
        :type="0"
        :item-id="playingSong.id"
        scroll-id="songDetail"
      ></comment-panel>
    </scroll-bar>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { playerStore } from '@/stores/audioPlayer';
import roundImg from '@/assets/img/player/song-background.png';
import pointerImg from '@/assets/img/player/song-status-change.png';
import ScrollLyrics from '@/components/AudioPlayer/scrollLyrics.vue';
import CommentPanel from '@/components/Comment/CommentPanel.vue';
const { songDetailsShow, playingSong, pause } = storeToRefs(playerStore());
const cover = ref<HTMLElement | null>(null);
const pointer = ref<HTMLElement | null>(null);
watch(pause, (newVal) => {
  if (newVal) pauseImg();
  else activeImg();
});

function pauseImg() {
  cover.value?.classList.remove('cover-play');
  pointer.value?.classList.remove('pointer-play');
}
function activeImg() {
  cover.value?.classList.add('cover-play');
  pointer.value?.classList.add('pointer-play');
}
</script>

<style scoped lang="less">
.song-detail-container {
  position: absolute;
  z-index: 1001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
}
.background {
  filter: blur(400px) brightness(100%);
  height: calc(92.5vh - 110px);
  width: 100%;
  position: absolute;
  top: 0;
  z-index: -1;
}
h1 {
  margin: 12px 100px 5px;
  text-align: center;
}
.artists {
  margin: 0 200px;
  text-align: center;
}
a {
  transition: color 0.3s;
}
a:hover {
  color: var(--theme-color);
}
.left-img {
  flex: 0 0 50%;
  .song-cover-default {
    position: relative;
    text-align: center;
    margin-top: 90px;
    .cover {
      img {
        cursor: pointer;
        transform-origin: 50% 50%;
        animation: rotate linear 10s infinite;
        animation-play-state: paused;
      }
    }
    .round {
      position: absolute;
      z-index: 1;
      width: 260px;
      height: 260px;
      border-radius: 50%;
    }
    .song-img {
      width: 180px;
      height: 180px;
      margin-top: 40px;
      margin-left: 40px;
    }
    .pointer {
      position: absolute;
      height: 100px;
      z-index: 2;
      top: -30px;
      left: 50%;
      transform-origin: 0 0;
      transform: translateY(-50%);
      transition: 1s;
    }
    .pointer-play {
      transform-origin: 0 0;
      transform: translateY(-50%) rotate(15deg);
      transition: 1s;
    }
    .cover-play {
      img {
        transform-origin: 50% 50%;
        animation-play-state: running;
        animation: rotate linear 10s infinite;
      }
    }
  }
}
.lyrics {
  flex: 0 0 50%;
  height: 400px;
  padding: 0 15px;
  border-left: 1px solid var(--hover-color);
  //display: none;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 1150px) {
  .left-img {
    display: none;
  }
  .lyrics {
    flex: 1;
    max-width: 600px;
    margin: 0 auto;
    border: none;
  }
}
</style>
