<template>
  <li ref="current" v-if="info.text" @click="setCurrentTime">
    <p class="text">
      <span>
        {{ info.text }}
      </span>
    </p>
    <p class="other">
      <template v-if="showType === 't'">
        {{ info.translate }}
      </template>
      <template v-else-if="showType === 'r'">
        {{ info.roma }}
      </template>
    </p>
    <span class="time" v-if="info.time !== '99:00' && info.time !== ''">
      ------{{ info.time }}
    </span>
  </li>
  <li v-else class="block"></li>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { playerStore } from '@/stores/audioPlayer';
import { scrollStore } from '@/stores/panelStaus';
import { storeToRefs } from 'pinia';
const { playerTime, lyrics, cLyrics } = storeToRefs(playerStore());
const { scrolls } = storeToRefs(scrollStore());

const isThis = ref(false);
const props = withDefaults(
  defineProps<{ info: any; type?: string; index: number; canFocus: boolean }>(),
  {
    type: 't',
    canFocus: true,
  }
);
const showType = ref('n');
const current = ref<HTMLElement | null>(null);
watch(
  props,
  (newVal) => {
    if (props.info.translate && props.info.roma) {
      showType.value = props.type;
    } else if (props.info.translate) {
      showType.value = 't';
    } else if (props.info.roma) {
      showType.value = 'r';
    } else {
      showType.value = 'n';
    }
  },
  { immediate: true }
);
let isLast = props.index + 1 === lyrics.value.length;
watch(playerTime, (newVal) => {
  if (
    newVal >= props.info.timeNum &&
    !isLast &&
    newVal < lyrics.value[props.index + 1].timeNum
  ) {
    onFocus();
    current.value?.classList.add('active');
  } else if (isLast && newVal >= props.info.timeNum) {
    if (newVal - props.info.timeNum < 2 || props.info.time === '99:00') {
      onFocus();
      current.value?.classList.add('active');
    } else {
      current.value?.classList.remove('active');
      isThis.value = false;
    }
  } else {
    if (current.value) {
      current.value.classList.remove('active');
      isThis.value = false;
    }
  }
});
function setCurrentTime() {
  if (props.info.time === '') {
    return;
  }
  const player = document.getElementById('audio-player') as HTMLAudioElement;
  if (player) {
    player.currentTime = props.info.timeNum;
    playerTime.value = player.currentTime;
  }
}
function onFocus() {
  if (current.value && current.value.offsetTop - 180 > 0 && !isThis.value) {
    if (props.canFocus) {
      const i = scrolls.value!.findIndex((item) => {
        return item.id === 'lyrics';
      });
      scrolls.value![i].translate.y = current.value.offsetTop - 180;
      isThis.value = true;
    }
  }
  cLyrics.value = props.info;
}
</script>

<style scoped lang="less">
li {
  text-align: center;
  cursor: pointer;
}
li:hover {
  .time {
    opacity: 1;
  }
}
.text {
  font-size: 16px;
  transition: all 0.3s;
}
.other {
  font-size: 13px;
  transition: all 0.3s;
  color: var(--hover-more-color);
}
.active {
  .text {
    font-size: 18px;
    color: var(--theme-color);
  }
  .other {
    font-size: 15px;
    color: var(--hover-more-color);
  }
}
.block {
  height: 30px;
}
.time {
  position: absolute;
  right: 30px;
  top: 0;
  opacity: 0;
}
</style>
