<template>
  <scroll-bar sid="lyrics">
    <ul style="padding: 150px 0" ref="panel">
      <template v-for="(item, index) in lyrics" :key="item.timeNum">
        <LyricsItem
          :info="item"
          :type="type"
          :index="index"
          :canFocus="canFocus"
        />
      </template>
      <loading-tip
        content="歌词加载中。。。"
        :is-load="lyrics !== null"
      ></loading-tip>
    </ul>
  </scroll-bar>
  <div ref="statusPanel" class="status-change">
    <span v-if="type === 't'" class="active" @click="changeType('t')">译</span>
    <span v-else @click="changeType('t')">译</span>
    /
    <span v-if="type === 'r'" class="active" @click="changeType('r')">音</span>
    <span v-else @click="changeType('r')">音</span>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, onMounted, onBeforeUnmount } from 'vue';
import LyricsItem from '@/components/SingleItem/audio/LyricsItem.vue';
import { playerStore } from '@/stores/audioPlayer';
import { scrollStore } from '@/stores/panelStaus';
import { storeToRefs } from 'pinia';
const { scrolls } = storeToRefs(scrollStore());
const { lyrics } = storeToRefs(playerStore());
const type = ref('t');
const panel = ref<HTMLElement | null>(null);
const statusPanel = ref<HTMLElement | null>(null);
const canFocus = ref(true);
let timer: any = null;
function stopFocus() {
  canFocus.value = false;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    canFocus.value = true;
  }, 3000);
}
function changeType(t: string) {
  type.value = t;
}
function typeCheck() {
  let t = false;
  let r = false;
  lyrics.value.forEach((item: any) => {
    if (item.translate !== null) t = true;
    if (item.roma !== null) r = true;
  });
  if (t && r) {
    statusPanel.value?.classList.remove('hide');
  } else {
    statusPanel.value?.classList.add('hide');
  }
  if (r) type.value = 'r';
  else if (t) type.value = 't';
  else type.value = 'n';
}
watch(lyrics, (newVal) => {
  const i = scrolls.value!.findIndex((item) => {
    return item.id === 'lyrics';
  });
  if (newVal === null && i != -1) {
    scrolls.value![i].backTop++;
  } else if (newVal !== null) {
    typeCheck();
  }
});
onMounted(() => {
  if (panel.value) {
    panel.value.addEventListener('wheel', stopFocus);
  }
  typeCheck();
});
onBeforeUnmount(() => {
  if (panel.value) {
    panel.value.removeEventListener('wheel', stopFocus);
  }
});
</script>

<style scoped lang="less">
ul {
  padding-right: 20px;
  min-height: 400px;
}
.status-change {
  position: absolute;
  bottom: 0;
  right: 30px;
  height: 25px;
  line-height: 25px;
  border: 1px solid var(--hover-color);
  border-radius: 12.5px;
  span {
    padding: 0 3px;
    cursor: pointer;
  }
}
.hide {
  display: none;
}
.active {
  color: var(--theme-color);
  transition: color 0.3s;
}
</style>
