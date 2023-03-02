import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const other = defineStore('other', () => {
  const themeColor = ref<string | null>(null);
  const panelColor = ref<string | null>(null);
  themeColor.value = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--theme-color');
  panelColor.value = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--container-color');
  return { themeColor, panelColor };
});
