import { scrollStore } from '@/stores/panelStaus';
import index from '@/stores';
import { storeToRefs } from 'pinia';
const { scrolls } = storeToRefs(scrollStore(index));
export function findScroll(sid: string) {
  let sIndex = -1;
  if (scrolls.value) {
    sIndex = scrolls.value.findIndex((item) => {
      return item.id === sid;
    });
    if (sIndex !== -1) return scrolls.value[sIndex];
    else return null;
  }
}
// 回到顶部
export function backToTop(id: string, top: number = 0) {
  if (scrolls.value) {
    const index = scrolls.value.findIndex((item) => {
      return item.id === id;
    });
    if (scrolls.value[index].backTop === top) {
      scrolls.value[index].backTop++;
    } else {
      scrolls.value[index].backTop = top;
    }
  }
}
