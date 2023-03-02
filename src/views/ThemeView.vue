<template>
  <div class="theme-view-container">
    <h3>背景色</h3>
    <div class="color-container">
      <div @click="setThemeColor(item)" v-for="item in themeStyle" :key="item">
        <div class="scale-block" :style="'background-color:' + item"></div>
      </div>
    </div>
    <div class="add-container">
      添加背景色：
      <el-color-picker
        v-model="themePicker"
        show-alpha
        @change="addThemeColor"
      />
      <span
        class="edit-button"
        v-if="!themeEditMode"
        @click="themeEditMode = true"
        >编辑</span
      >
      <span
        class="edit-button"
        v-if="themeEditMode"
        @click="themeEditMode = false"
        >退出编辑</span
      >
    </div>
    <div class="color-container">
      <div v-for="item in addThemes" :key="item">
        <div
          @click="setThemeColor(item)"
          class="scale-block"
          :style="'background-color:' + item"
        ></div>
        <div class="delete-button" v-if="themeEditMode">
          <i
            @click="delThemeColor(item)"
            class="iconfont icon-RectangleCopy"
          ></i>
        </div>
      </div>
    </div>
    <h3>面板色</h3>
    <div class="color-container">
      <div @click="setPanelColor(item)" v-for="item in panelStyle" :key="item">
        <div class="scale-block" :style="'background-color:' + item"></div>
      </div>
    </div>
    <div class="add-container">
      添加面板色：
      <el-color-picker
        v-model="panelPicker"
        show-alpha
        @change="addPanelColor"
      />
      <span
        class="edit-button"
        v-if="!panelEditMode"
        @click="panelEditMode = true"
        >编辑</span
      >
      <span
        class="edit-button"
        v-if="panelEditMode"
        @click="panelEditMode = false"
        >退出编辑</span
      >
    </div>
    <div class="color-container">
      <div v-for="item in addPanels" :key="item">
        <div
          @click="setPanelColor(item)"
          class="scale-block"
          :style="'background-color:' + item"
        ></div>
        <div class="delete-button" v-if="panelEditMode">
          <i
            @click="delPanelColor(item)"
            class="iconfont icon-RectangleCopy"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { other } from '@/stores/other';
import { storeToRefs } from 'pinia';
const { themeColor, panelColor } = storeToRefs(other());
const themeStyle = reactive([
  '#f07c82',
  '#eea2a4',
  '#5a191b',
  '#ee3f4d',
  'rgba(159, 199, 113, 1)',
  'rgb(252,202,217)',
]);
const panelStyle = reactive([
  '#f5f5f5',
  '#ffffff',
  '#e3e6ee',
  '#f5deb3',
  '#d3b7d8',
]);
const addThemes = reactive<any>([]);
const addPanels = reactive<any>([]);
const themePicker = ref<string>('');
const panelPicker = ref<string>('');
const themeEditMode = ref(false);
const panelEditMode = ref(false);
function setThemeColor(color: string) {
  document.documentElement.style.setProperty(`--theme-color`, color);
  themeColor.value = color;
  localStorage.setItem('theme-color', color);
}
function setPanelColor(color: string) {
  document.documentElement.style.setProperty(`--container-color`, color);
  panelColor.value = color;
  localStorage.setItem('panel-color', color);
}
function addThemeColor() {
  const Index = addThemes.findIndex((item: string) => {
    return item === themePicker.value;
  });
  if (Index === -1) {
    addThemes.push(themePicker.value);
    localStorage.setItem('add-theme', JSON.stringify(addThemes));
  }
}
function addPanelColor() {
  const Index = addPanels.findIndex((item: string) => {
    return item === panelPicker.value;
  });
  if (Index === -1) {
    addPanels.push(panelPicker.value);
    localStorage.setItem('add-panel', JSON.stringify(addPanels));
  }
}
function delThemeColor(color: string) {
  const Index = addThemes.findIndex((item: string) => {
    return item === color;
  });
  if (Index !== -1) {
    addThemes.splice(Index, 1);
    localStorage.setItem('add-theme', JSON.stringify(addThemes));
  }
}
function delPanelColor(color: string) {
  const Index = addPanels.findIndex((item: string) => {
    return item === color;
  });
  if (Index !== -1) {
    addPanels.splice(Index, 1);
    localStorage.setItem('add-panel', JSON.stringify(addPanels));
  }
}

onMounted(() => {
  if (localStorage.getItem('add-theme')) {
    addThemes.push(...JSON.parse(localStorage.getItem('add-theme')!));
  }
  themePicker.value = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--theme-color');
  if (localStorage.getItem('add-panel')) {
    addPanels.push(...JSON.parse(localStorage.getItem('add-panel')!));
  }
  panelPicker.value = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--panel-color');
});
</script>

<style scoped lang="less">
.theme-view-container {
  width: 100%;
  margin-left: 8px;
  margin-top: 10px;
}
.color-container {
  width: 100%;
  > div {
    width: 10%;
    margin: 10px;
    display: inline-block;
    cursor: pointer;
  }
  .scale-block {
    padding-top: 100%;
    content: '';
    display: block;
    border-radius: 10px;
    border: 1px solid #181818;
  }
}
.delete-button {
  position: absolute;
  right: -15px;
  top: -5px;
  color: red;
}
.edit-button {
  padding-left: 20px;
  cursor: pointer;
  color: #79bbff;
  transition: all 0.3s;
}
.edit-button:hover {
  color: var(--theme-color);
}
</style>
