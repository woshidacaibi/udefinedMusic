<template>
  <li ref="current" @dblclick="playSong(info)">
    <span class="index">{{ trueIndex }}</span>
    <span class="song-name">
      <div class="overflow name">
        <b :title="info.name" v-if="!info.noCopyrightRcmd">{{ info.name }}</b>
        <b :title="info.name + '(暂无版权)'" class="alia" v-else>{{
          info.name
        }}</b>
        <b class="alia" v-for="item in info.alia" :key="item" :title="item"
          >({{ item }})</b
        >
      </div>
    </span>
    <span class="artist-name overflow">
      <template v-for="(item, index) in info.ar" :key="item.name">
        <router-link
          v-if="item.id !== 0"
          :title="item.name"
          :to="{ name: 'artist', query: { id: item.id } }"
          >{{ item.name }}</router-link
        >
        <b class="alia" v-else>{{ item.name }}</b>
        <b v-if="index !== info.ar.length - 1"> \&nbsp;</b>
      </template>
    </span>
    <span class="duration">{{ dayjs(info.dt).format('mm:ss') }}</span>
    <span class="delete" title="删除" @click="deleteSong"
      ><i class="iconfont icon-cancel audiolistconsole"></i
    ></span>
  </li>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { computed, watch, ref, onMounted } from 'vue';
import { playerStore } from '@/stores/audioPlayer';
import { storeToRefs } from 'pinia';
import { playSong } from '@/hooks/audioPlayer';
const { List, playingSong, playingIndex } = storeToRefs(playerStore());
const { resetSong } = playerStore();
const props = defineProps<{ info: any; index: number }>();
const current = ref<HTMLElement | null>(null);
const trueIndex = computed(() => {
  const i = props.index + 1;
  return i >= 10 ? i : '0' + i;
});
function deleteSong() {
  const index = List.value.findIndex((item) => {
    return item.id === props.info.id;
  });
  List.value.splice(index, 1);
  if (playingIndex.value === index) {
    resetSong();
  }
}
watch(playingSong, (newVal) => {
  if (newVal.id === props.info.id) {
    current.value?.classList.add('playing');
  } else current.value?.classList.remove('playing');
});
onMounted(() => {
  if (playingSong.value.id === props.info.id) {
    current.value?.classList.add('playing');
  } else current.value?.classList.remove('playing');
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/songlist.less';
.iconfont {
  transition: color 0.3s;
}
.iconfont:hover {
  color: var(--theme-color);
}
.playing .iconfont:hover {
  color: var(--color-text);
}
.index {
  width: calc(100% / 8);
}
.song-name {
  width: calc(100% / 24 * 11);
}
.artist-name {
  width: calc(100% / 5);
  margin: 0 5px;
}
.duration {
  width: calc(100% / 8);
}
</style>
