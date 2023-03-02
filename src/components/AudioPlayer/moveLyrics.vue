<template>
  <div @mousedown="move" ref="panel">
    <p class="text overflow">{{ cLyrics.text }}</p>
    <p class="other overflow" v-if="cLyrics.translate">
      {{ cLyrics.translate }}
    </p>
    <i class="iconfont icon-guanbi1 close" @click="moveLyricsShow = false"></i>
  </div>
</template>

<script lang="ts" setup>
import { playerStore } from '@/stores/audioPlayer';
import { storeToRefs } from 'pinia';
import { watch, ref } from 'vue';
const { cLyrics, moveLyricsShow } = storeToRefs(playerStore());
const panel = ref<HTMLElement | null>(null);
const hLeft = ref('240px');
const hTop = ref('-100px');
watch(moveLyricsShow, (newVal) => {
  if (newVal && panel.value) {
    panel.value.style.top = hTop.value;
    panel.value.style.left = hLeft.value;
  }
});
function move(e: any) {
  const odiv = panel.value!; // 获取目标元素
  // 算出鼠标相对元素的位置
  const disX = e.clientX - odiv.offsetLeft;
  const disY = e.clientY - odiv.offsetTop;
  document.onmousemove = (e) => {
    // 鼠标按下并移动的事件
    // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    const left = e.clientX - disX;
    const top = e.clientY - disY;
    // 绑定元素位置到positionX和positionY上面
    // 移动当前元素
    odiv.style.left = left + 'px';
    odiv.style.top = top + 'px';
  };
  document.onmouseup = (e) => {
    hLeft.value = odiv.style.left;
    hTop.value = odiv.style.top;
    document.onmousemove = null;
    document.onmouseup = null;
  };
}
</script>

<style scoped lang="less">
.text {
  text-align: center;
  font-size: 27px;
  margin: 0 10px;
}
.other {
  text-align: center;
  font-size: 18px;
}
.close {
  position: absolute;
  top: 3px;
  right: 3px;
}
</style>
