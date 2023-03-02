<template>
  <div ref="item" class="menu-item-container clearfix">
    <div class="item-header" @click="collapseItem">
      <el-tooltip
        :content="titleText"
        effect="light"
        placement="right"
        :disabled="!tipShow"
      >
        <div
          ref="icon"
          class="icon"
          @mouseenter="iconShow"
          @mouseleave="iconHide"
        >
          <slot name="icon"></slot>
        </div>
      </el-tooltip>
      <div ref="title" class="title">
        <slot name="title"></slot>
        <div class="content-show-icon" v-if="contentContainer">
          <i class="iconfont icon-RectangleCopy2" v-show="isCollapse"></i>
          <i class="iconfont icon-RectangleCopy3" v-show="!isCollapse"></i>
        </div>
      </div>
    </div>
    <div ref="content" class="content">
      <slot name="content"></slot>
    </div>
    <transition name="hover">
      <div
        v-show="isShow"
        ref="hover"
        class="hover-panel"
        :style="hoverStyle"
        :id="itemId"
        @mouseenter="iconShow"
        @mouseleave="iconHide"
      >
        <ScrollBar
          :max-height="panelMaxHeight"
          :max-width="panelMaxWidth"
          v-if="contentContainer"
          style="margin-left: 6px; margin-top: 5px"
        >
          <slot name="content"></slot>
        </ScrollBar>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
const props = withDefaults(defineProps<{ defaultCollapse?: boolean }>(), {
  defaultCollapse: true,
});
const itemId = 'collapse-hover-' + Math.random();
const item = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const hover = ref<HTMLElement | null>(null);
const icon = ref<HTMLElement | null>(null);
const title = ref<HTMLElement | null>(null);
const titleText = ref('');
// hoverPanel 是否显示
const isShow = ref(false);
// content是否折叠
const isCollapse = ref(props.defaultCollapse);
watch(isCollapse, (newVal) => {
  if (contentContainer.value && content.value) {
    if (newVal) {
      content.value.classList.add('content-hidden');
      content.value.classList.remove('content-show');
    } else {
      content.value.classList.remove('content-hidden');
      content.value.classList.add('content-show');
    }
  }
});
function collapseItem() {
  if (!item.value?.classList.contains('item-hide')) {
    isCollapse.value = !isCollapse.value;
  }
}
// 如有内容则生成，否则返回null
const contentContainer = computed<HTMLElement | null>(() => {
  if (content.value && content.value.children[0]) {
    // 观察大小
    extendObserve.observe(content.value.children[0] as HTMLElement);
    return content.value.children[0] as HTMLElement;
  } else {
    return null;
  }
});
const extendObserve = new ResizeObserver(() => {
  content.value?.style.setProperty(
    '--container-height',
    contentContainer.value?.offsetHeight + 'px'
  );
});
function getFatherMenu() {
  if (item.value) {
    let tmp = item.value;
    while (tmp?.parentElement) {
      tmp = tmp.parentElement as HTMLElement;
      if (tmp.className.indexOf('collapse-menu-container') !== -1) {
        const menuId = tmp.id.split('collapse-menu-')[1];
        if (
          document.getElementById('collapsible-menu-extend-' + menuId) &&
          contentContainer.value
        ) {
          if (hover.value) {
            document
              .getElementById('collapsible-menu-extend-' + menuId)
              ?.append(hover.value);
          }
        }
        break;
      }
    }
  }
}

// 悬浮板部分
const top = ref(0);
const left = ref(0);
const tipShow = ref(false);
const panelMaxHeight = ref('none');
const panelMaxWidth = ref('none');
const hoverStyle = computed(() => {
  return `left:${left.value}px;top:${top.value}px`;
});
// 获取悬浮内容的相对位置
function getItemPosition() {
  top.value = 0;
  left.value = 0;
  if (icon.value) {
    let tmp = icon.value;
    while (tmp?.offsetParent) {
      top.value += tmp.offsetTop;
      left.value += tmp.offsetLeft;
      tmp = tmp.offsetParent as HTMLElement;
    }
    panelMaxHeight.value = (document.body.offsetHeight - top.value) / 2 + 'px';
    panelMaxWidth.value = (document.body.offsetWidth - left.value) / 2 + 'px';
    left.value += icon.value.clientWidth + 8;
  }
}
let timer: any = null;
// 显示content悬浮内容
function iconShow() {
  if (item.value?.classList.contains('item-hide')) {
    if (!contentContainer.value) {
      tipShow.value = true;
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      if (contentContainer.value) {
        getItemPosition();
        isShow.value = true;
      }
    }
  }
}
// 隐藏
function iconHide() {
  if (item.value?.classList.contains('item-hide')) {
    if (!contentContainer.value) {
      tipShow.value = false;
    } else {
      timer = setTimeout(() => {
        isShow.value = false;
        timer = null;
      }, 200);
    }
  }
}

onMounted(() => {
  content.value?.style.setProperty(
    '--container-height',
    contentContainer.value?.offsetHeight + 'px'
  );
  if (contentContainer.value && content.value) {
    if (props.defaultCollapse) {
      content.value.classList.add('content-hidden');
      content.value.classList.remove('content-show');
    } else {
      content.value.classList.remove('content-hidden');
      content.value.classList.add('content-show');
    }
  }
  getFatherMenu();
  if (title.value) {
    titleText.value = title.value.textContent ? title.value.textContent : '';
  }
});
</script>

<style scoped lang="less">
.menu-item-container {
  position: relative;
}
.item-header {
  height: var(--item-header-height);
  max-width: calc(var(--item-title-width) + var(--item-icon-width));
  width: calc(var(--item-title-width) + var(--item-icon-width));
  display: flex;
  align-items: center;
  transition: max-width 0.5s ease;
  border-radius: 10px;
  cursor: pointer;
}
.item-header:hover {
  background-color: var(--hover-color);
  transition: color 0.2s;
  color: var(--theme-color);
}
.icon {
  //position: relative;
  width: var(--item-icon-width);
  height: 100%;
  flex-shrink: 0;
  line-height: var(--item-header-height);
  text-align: center;
}
.title {
  width: var(--item-title-width);
  height: 100%;
  flex-shrink: 0;
  line-height: var(--item-header-height);
}
.content {
  overflow: hidden;
  width: 100%;
  float: left;
  transition-property: max-width, max-height;
  transition-duration: 0.5s, 0.5s;
  max-width: calc(var(--item-title-width) + var(--item-icon-width));
}
.item-hide .item-header {
  max-width: var(--item-icon-width);
}
.item-hide .title {
  display: none;
}
.item-hide .content {
  max-height: 0;
  max-width: var(--item-icon-width);
}
.content-hidden {
  max-height: 0;
}
.content-show {
  max-height: var(--container-height);
}
.hover-panel {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--container-color);
  border: 1px solid #cccccc;
  box-shadow: var(--el-box-shadow);
  border-radius: 5px;
}
.hover-hidden {
  display: none;
}
.hover-enter-active {
  animation: scale-up-tl 0.2s ease-in-out;
}
.hover-leave-active {
  animation: scale-up-tl 0.2s ease-in-out reverse;
}
.content-show-icon {
  float: right;
  margin-right: 10px;
  .iconfont {
    font-size: 30px;
  }
}
@keyframes scale-up-tl {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
}
</style>
