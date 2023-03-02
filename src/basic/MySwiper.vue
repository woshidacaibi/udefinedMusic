<template>
  <div class="carousel">
    <el-carousel
      :type="type"
      arrow="never"
      trigger="click"
      ref="carousel"
      :autoplay="false"
      :height="height"
    >
      <slot></slot>
    </el-carousel>
    <div class="prev operate-button" @click="changeItem('prev')">
      <i class="iconfont icon-xiangzuojiantou"></i>
    </div>
    <div class="next operate-button" @click="changeItem('next')">
      <i class="iconfont icon-xiangyoujiantou"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = withDefaults(defineProps<{ height: string; type?: string }>(), {
  type: '',
});
const carousel = ref<HTMLElement | null>(null);

function changeItem(index: string) {
  if (carousel.value) {
    let res;
    if (index === 'next') {
      // @ts-ignore
      carousel.value.next();
    } else {
      // @ts-ignore
      carousel.value.prev();
    }
    // @ts-ignore
  }
}
</script>

<style scoped lang="less">
.carousel {
  width: 100%;
  padding: 0 50px;
  overflow: hidden;
}
.carousel:hover {
  .next {
    transform: translate(-20px, -50%);
  }
  .prev {
    transform: translate(20px, -50%);
  }
}
.img-block {
  display: block;
}
.iconfont {
  font-weight: bolder;
  font-size: 24px;
}
.type-tip {
  position: absolute;
  z-index: 1;
  background-color: var(--theme-color);
  right: 0;
  top: 0;
  width: 20px;
  height: 80px;
  text-align: center;
  line-height: 20px;
  border-radius: 5px 0 0 5px;
}
.operate-button {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  background-color: var(--hover-color);
  transition: all 0.5s;
}
.operate-button:hover {
  background-color: rgba(0, 0, 0, 0.22);
}
.next {
  right: 0;
  transform: translate(100%, -50%);
}

.prev {
  left: 0;
  transform: translate(-100%, -50%);
}
.el-carousel__button {
  background-color: var(--hover-color);
}
</style>
