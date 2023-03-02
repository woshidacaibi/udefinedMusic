<template>
  <div ref="view" class="view scroll-view" :style="viewSize">
    <div ref="inner" class="inner" :style="innerSize">
      <slot />
    </div>
    <div
      ref="verticalBar"
      class="vertical-bar"
      :style="`width:${barWeight};border-radius:${
        parseFloat(barWeight) / 2
      }px;${barColor ? 'background-color:' + barColor + ';' : ''}`"
    ></div>
    <div
      ref="horizontalBar"
      class="horizontal-bar"
      v-show="horizon"
      :style="`height:${barWeight};border-radius:${
        parseFloat(barWeight) / 2
      }px;${barColor ? 'background-color:' + barColor + ';' : ''}`"
    ></div>
    <div
      class="vertical-track"
      @click="VerticalTrackMove"
      :style="`width:${barWeight};`"
    ></div>
    <div
      v-show="horizon"
      class="horizontal-track"
      @click="HorizontalTrackMove"
      :style="`height:${barWeight};`"
    ></div>
    <div
      v-if="backTopShow && innerTranslate.y > visibleHeight"
      @click="innerTranslate.y = 0"
      class="back-top"
      :style="`right:${right};bottom:${bottom}`"
    >
      ↑
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  reactive,
  watch,
  onBeforeUnmount,
  computed,
} from 'vue';
import { sizeChange, scrollStore } from '@/stores/panelStaus';
//@ts-ignore
import { v4, v1 } from 'uuid';
import { storeToRefs } from 'pinia';
interface Props {
  sid?: string | null;
  // 固定scroll面板宽高
  width?: string;
  height?: string;
  // 当面板达到最大宽高后才显示滚动条，没达到前view会是inner大小
  maxHeight?: string;
  maxWidth?: string;
  // 是否显示水平滚动条
  horizon?: boolean;
  // 滚动条粗细
  barWeight?: string;
  // 显示回到顶部按钮
  backTopShow?: boolean;
  // backToTop的位置
  right?: string;
  bottom?: string;
  // backToTop出现高度
  visibleHeight?: number;
  // 距离底部高度多少时isBottom为true
  loadDistance?: number;
  // 是否给滚动条预留空白
  barPadding?: boolean;
  barColor?: string;
}
const props = withDefaults(defineProps<Props>(), {
  sid: null,
  width: '100%',
  height: '100%',
  maxHeight: '',
  maxWidth: '',
  horizon: true,
  barWeight: '6px',
  backTopShow: false,
  right: '30px',
  bottom: '30px',
  visibleHeight: 200,
  loadDistance: 200,
  barPadding: true,
  barColor: '',
});
const { scrolls } = storeToRefs(scrollStore());
// 生成id
const id = ref<null | string>(props.sid);
if (!id.value) {
  id.value = v4().replace(/-/g, '');
}

const viewSize = computed(() => {
  const w = props.maxWidth
    ? 'max-width:' + props.maxWidth + ';'
    : 'width:' + props.width + ';';
  const h = props.maxHeight
    ? 'max-height:' + props.maxHeight + ';'
    : 'height:' + props.height + ';';
  return w + h;
});
const innerSize = computed(() => {
  if (props.barPadding)
    return `padding-right:${props.barWeight};padding-bottom:${props.barWeight};`;
  else return '';
});

const innerTranslate = reactive({ x: 0, y: 0 });
const lastTranslate = { x: -1, y: -1 };
const barTranslate = reactive({ horizontal: 0, vertical: 0 });

const inner = ref<HTMLElement | null>(null);
const view = ref<HTMLElement | null>(null);
const verticalBar = ref<HTMLElement | null>(null);
const horizontalBar = ref<HTMLElement | null>(null);
//登记滚动面板信息
if (scrolls.value) {
  scrolls.value.push({
    id: id.value as string,
    backTop: 0,
    isBottom: false,
    translate: innerTranslate,
  });
} else {
  scrolls.value = [
    {
      id: id.value as string,
      backTop: 0,
      isBottom: false,
      translate: innerTranslate,
    },
  ];
}
// 面板数组的索引
const index = scrolls.value.findIndex((item) => {
  return item.id === id.value;
});
// 根据内容设置滚动条大小
function resizeBar() {
  if (verticalBar.value && horizontalBar.value && inner.value && view.value) {
    // innerTranslate.x = 0;
    // innerTranslate.y = 0;
    // barTranslate.vertical = 0;
    // barTranslate.horizontal = 0;
    if (inner.value.offsetHeight < innerTranslate.y + view.value.offsetHeight) {
      innerTranslate.y = inner.value.offsetHeight - view.value.offsetHeight;
    }
    // 垂直滚动条
    let scale = view.value.offsetHeight / inner.value.offsetHeight;
    if (scale >= 1) {
      verticalBar.value.style.height = 0 + 'px';
      innerTranslate.y = 0;
      if (scrolls.value) {
        scrolls.value[index].isBottom = true;
      }
    } else {
      verticalBar.value.style.height = scale * view.value.offsetHeight + 'px';
      if (
        scrolls.value &&
        innerTranslate.y <
          inner.value.offsetHeight -
            view.value.offsetHeight -
            props.loadDistance
      ) {
        scrolls.value[index].isBottom = false;
      }
    }
    // 水平滚动条
    scale = view.value.offsetWidth / inner.value.offsetWidth;
    if (scale >= 1) {
      horizontalBar.value.style.width = 0 + 'px';
      innerTranslate.x = 0;
    } else
      horizontalBar.value.style.width = scale * view.value.offsetWidth + 'px';
    ElementMove();
  }
}
// 根据innerTranslate 移动inner 设置barTranslate
function ElementMove() {
  if (inner.value && view.value) {
    // 垂直移动
    // 修改bar的属性，用watch修改
    barTranslate.vertical =
      (innerTranslate.y / inner.value.offsetHeight) * view.value.offsetHeight;
    // 水平移动
    barTranslate.horizontal =
      (innerTranslate.x / inner.value.offsetWidth) * view.value.offsetWidth;
    inner.value.style.transform = `translate(-${innerTranslate.x}px,-${innerTranslate.y}px)`;
  }
}
// 鼠标移动修改滚动条位移距离
function HorizontalMouseMove(e: MouseEvent) {
  if (horizontalBar.value) {
    // 记录按下的位置
    ForBidenTransition();
    let disX = e.clientX;
    window.onmousemove = (e) => {
      if (view.value && inner.value) {
        innerTranslate.x +=
          ((e.clientX - disX) / view.value.offsetWidth) *
          inner.value.offsetWidth;
        disX = e.clientX;
      }
    };
    window.onmouseup = () => {
      if (horizontalBar.value) {
        window.onmousemove = null;
        window.onmouseup = null;
        horizontalBar.value.style.transition = 'all 0.2s';
        AllowTransition();
      }
    };
  }
}
function VerticalMouseMove(e: MouseEvent) {
  if (verticalBar.value) {
    // 记录按下的位置
    ForBidenTransition();
    let disY = e.clientY;
    window.onmousemove = (e) => {
      if (view.value && inner.value) {
        innerTranslate.y +=
          ((e.clientY - disY) / view.value.offsetHeight) *
          inner.value.offsetHeight;
        disY = e.clientY;
      }
    };
    window.onmouseup = () => {
      if (verticalBar.value) {
        window.onmousemove = null;
        window.onmouseup = null;
        AllowTransition();
      }
    };
  }
}
// 防止选中问题 以及过渡元素延迟导致视觉体验较差
function ForBidenTransition() {
  if (horizontalBar.value && verticalBar.value && inner.value) {
    document.body.style.userSelect = 'none';
    horizontalBar.value.style.transition = 'all 0s';
    verticalBar.value.style.transition = 'all 0s';
    inner.value.style.transition = 'all 0s';
  }
}
function AllowTransition() {
  if (horizontalBar.value && verticalBar.value && inner.value) {
    document.body.style.userSelect = 'auto';
    horizontalBar.value.style.transition = 'all 0.2s';
    verticalBar.value.style.transition = 'all 0.2s';
    inner.value.style.transition = 'all 0.2s';
  }
}

// 滚动条空白区域移动
function VerticalTrackMove(e: MouseEvent) {
  if (view.value && inner.value && verticalBar.value) {
    innerTranslate.y =
      ((e.clientY -
        view.value.getBoundingClientRect().y -
        verticalBar.value.offsetHeight / 2) /
        view.value.offsetHeight) *
      inner.value.offsetHeight;
  }
  AllowTransition();
}
function HorizontalTrackMove(e: MouseEvent) {
  if (view.value && inner.value && horizontalBar.value) {
    innerTranslate.x =
      ((e.clientX -
        view.value.getBoundingClientRect().x -
        horizontalBar.value.offsetWidth / 2) /
        view.value.offsetWidth) *
      inner.value.offsetWidth;
  }
  AllowTransition();
}

watch(
  innerTranslate,
  (newVal) => {
    if (inner.value && view.value) {
      if (newVal.y !== lastTranslate.y) {
        newVal.y = Math.min(
          inner.value.offsetHeight - view.value.offsetHeight,
          newVal.y
        );
        if (newVal.y < 0) newVal.y = 0;

        if (scrolls.value) {
          if (
            newVal.y >=
            inner.value.offsetHeight -
              view.value.offsetHeight -
              props.loadDistance
          )
            scrolls.value[index].isBottom = true;
          else scrolls.value[index].isBottom = false;
        }
        lastTranslate.y = newVal.y;
      }
      if (newVal.x !== lastTranslate.x) {
        newVal.x = Math.min(
          inner.value.offsetWidth - view.value.offsetWidth,
          newVal.x
        );
        if (newVal.x < 0) newVal.x = 0;
        lastTranslate.x = newVal.x;
      }
      ElementMove();
    }
  },
  { deep: true }
);
watch(
  barTranslate,
  (newVal) => {
    if (verticalBar.value) {
      verticalBar.value.style.transform = `translateY(${newVal.vertical}px)`;
    }
    if (horizontalBar.value) {
      horizontalBar.value.style.transform = `translateX(${newVal.horizontal}px)`;
    }
  },
  { deep: true }
);
watch(sizeChange, () => {
  resizeBar();
  innerTranslate.x = 0;
});
// 回到顶部
if (scrolls.value) {
  watch(
    () => scrolls.value![index].backTop,
    () => {
      innerTranslate.y = scrolls.value![index].backTop;
    }
  );
}
const resizeObserve = new ResizeObserver((entries) => {
  resizeBar();
});
function moveT(e: any) {
  const node = e.target as HTMLElement;
  const innerScrolls = inner.value!.querySelectorAll('.scroll-view');
  for (let i = 0; i < innerScrolls.length; i++) {
    if (innerScrolls[i].contains(node)) {
      return;
    }
  }
  innerTranslate.y += e.deltaY;
}
onMounted(() => {
  resizeBar();
  if (inner.value && view.value) {
    inner.value.addEventListener('wheel', moveT);
    // 监听inner大小变化
    resizeObserve.observe(inner.value);
    resizeObserve.observe(view.value);
    resizeObserve.observe(document.body);
  }
  if (horizontalBar.value) {
    horizontalBar.value.addEventListener('mousedown', HorizontalMouseMove);
  }
  if (verticalBar.value) {
    verticalBar.value.addEventListener('mousedown', VerticalMouseMove);
  }
});
onBeforeUnmount(() => {
  if (inner.value && view.value) {
    inner.value.removeEventListener('wheel', moveT);
    // 监听inner大小变化
    resizeObserve.unobserve(inner.value);
    resizeObserve.unobserve(view.value);
    resizeObserve.unobserve(document.body);
  }
  if (horizontalBar.value) {
    horizontalBar.value.removeEventListener('mousedown', HorizontalMouseMove);
  }
  if (verticalBar.value) {
    verticalBar.value.removeEventListener('mousedown', VerticalMouseMove);
  }
});
</script>

<style lang="less" scoped>
.view {
  overflow: hidden;
  position: relative;
}
.inner {
  width: fit-content;
  min-width: 100%;
  transition: all 0.3s;
}
.inner:before,
.inner:after {
  content: '';
  display: block;
  clear: both;
}
.vertical-bar {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}
.horizontal-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}
.vertical-track {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  background-color: transparent;
  height: 100%;
}
.horizontal-track {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
}
.vertical-bar:hover,
.horizontal-bar:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
.back-top {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  text-align: center;
  line-height: 36px;
  right: 30px;
  bottom: 30px;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s;
  cursor: pointer;
  animation: fadeIn 0.2s;
}
.back-top:hover {
  background-color: rgba(0, 0, 0, 0.3);
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
