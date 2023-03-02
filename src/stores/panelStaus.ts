import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
// scrollBar
export const sizeChange = ref(1);
export const scrollStore = defineStore('scrollStore', () => {
  const scrolls = ref<
    [{ id: string; backTop: number; isBottom: boolean; translate: any }] | null
  >(null);
  return { scrolls };
});

// collapseMenu
export const collapseMenu = defineStore('collpaseMenu', () => {
  const collapseStatus = reactive<{ id: string; isCollapse: boolean }[]>([
    { id: 'all', isCollapse: false },
  ]);
  function initMenu(id?: string, isCollapse?: boolean) {
    if (!id) {
      id = 'all';
    }
    if (!isCollapse) {
      isCollapse = false;
    }
    const index = collapseStatus.findIndex((item) => {
      return item.id === id;
    });
    if (index === -1) {
      collapseStatus.push({ id, isCollapse });
      return collapseStatus.length - 1;
    }
    return index;
  }
  function destoryMenu(id: string) {
    const index = collapseStatus.findIndex((item) => {
      return item.id === id;
    });
    collapseStatus.slice(index, 1);
  }
  function statusChange(isCollapse: boolean, id?: string) {
    if (!id) {
      id = 'all';
    } else
      collapseStatus.some((item) => {
        if (item.id === id) {
          item.isCollapse = isCollapse;
          return;
        }
      });
  }
  return { initMenu, collapseStatus, destoryMenu, statusChange };
});
