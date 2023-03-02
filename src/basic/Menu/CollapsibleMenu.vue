<template>
  <div
    class="collapse-menu-container"
    :id="'collapse-menu-' + menuId"
    type="menu"
    ref="menu"
  >
    <slot v-if="isMounted" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
// 此类应用于滚动组件滚动条大小改变，若不使用项目配套的滚动组件条可以忽略删除相关内容
import { sizeChange } from '@/stores/panelStaus';
//@ts-ignore
import { v4 } from 'uuid';
interface Props {
  isCollapse?: boolean;
  headerHeight?: string;
  iconWidth?: string;
  titleWidth?: string;
}
const props = withDefaults(defineProps<Props>(), {
  isCollapse: true,
  headerHeight: '50px',
  iconWidth: '50px',
  titleWidth: '180px',
});
const menu = ref<HTMLElement | null>(null);
const menuId = v4().replace(/-/g, '');
const isMounted = ref(false);
function hidden() {
  if (
    menu.value &&
    document.getElementById('collapsible-menu-extend-' + menuId)
  ) {
    const itemElements = menu.value.getElementsByClassName(
      'menu-item-container'
    );
    // const contentElements = menu.value.getElementsByClassName('content');
    const hoverElements = document
      .getElementById('collapsible-menu-extend-' + menuId)!
      .getElementsByClassName('hover-panel');
    if (itemElements.length > 0) {
      for (let i = 0; i < itemElements.length; i++)
        itemElements[i].classList.add('item-hide');
    }
    // if (contentElements.length > 0) {
    //   for (let i = 0; i < contentElements.length; i++) {
    //     contentElements[i].classList.add('content-hidden');
    //     contentElements[i].classList.remove('content-show');
    //   }
    // }
    if (hoverElements.length > 0) {
      for (let i = 0; i < hoverElements.length; i++) {
        hoverElements[i].classList.remove('hover-hidden');
      }
    }
    sizeChange.value++;
  }
}
function show() {
  if (
    menu.value &&
    document.getElementById('collapsible-menu-extend-' + menuId)
  ) {
    const itemElements = menu.value.getElementsByClassName(
      'menu-item-container'
    );
    // const contentElements = menu.value.getElementsByClassName('content');
    const hoverElements = document
      .getElementById('collapsible-menu-extend-' + menuId)!
      .getElementsByClassName('hover-panel');
    if (itemElements.length > 0) {
      for (let i = 0; i < itemElements.length; i++)
        itemElements[i].classList.remove('item-hide');
    }
    // if (contentElements.length > 0) {
    //   for (let i = 0; i < contentElements.length; i++) {
    //     contentElements[i].classList.add('content-show');
    //     contentElements[i].classList.remove('content-hidden');
    //   }
    // }
    if (hoverElements.length > 0) {
      for (let i = 0; i < hoverElements.length; i++) {
        hoverElements[i].classList.add('hover-hidden');
      }
    }
    sizeChange.value++;
  }
}

watch(props, (newVal) => {
  if (newVal.isCollapse) {
    hidden();
  } else show();
});
if (!document.getElementById('collapsible-menu-extend-' + menuId)) {
  const container = document.createElement('div');
  container.id = 'collapsible-menu-extend-' + menuId;
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  document.body.append(container);
}
isMounted.value = true;
onMounted(() => {
  if (menu.value) {
    menu.value.style.setProperty('--item-header-height', props.headerHeight);
    menu.value.style.setProperty('--item-icon-width', props.iconWidth);
    menu.value.style.setProperty('--item-title-width', props.titleWidth);
    if (props.isCollapse) {
      hidden();
    } else show();
  }
});
</script>

<style>
.collapse-menu-container {
  transition: width 0.5s;
}
</style>
