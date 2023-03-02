<template>
  <scroll-bar
    :bar-padding="false"
    :bar-weight="'10px'"
    :bar-color="'whitesmoke'"
  >
    <div class="app-container">
      <div class="layout-container">
        <TeriHeader></TeriHeader>
        <TeriCenter></TeriCenter>
        <TeriFooter></TeriFooter>
      </div>
      <transition name="login">
        <TeriLogin v-if="showLogin"></TeriLogin>
      </transition>
    </div>
  </scroll-bar>
</template>

<script setup lang="ts">
import { loginStore } from '@/stores/login';
import { storeToRefs } from 'pinia';
import TeriHeader from '@/layout/header/TeriHeader.vue';
import TeriCenter from '@/layout/center/TeriCenter.vue';
import TeriFooter from '@/layout/footer/TeriFooter.vue';
import TeriLogin from '@/layout/login/TeriLogin.vue';
const { showLogin } = storeToRefs(loginStore());

// 设置主题色
// document.documentElement.style.setProperty(`--theme-color`, 'red');
// document.documentElement.style.setProperty(`--container-color`, 'white');
if (localStorage.getItem('theme-color')) {
  document.documentElement.style.setProperty(
    `--theme-color`,
    localStorage.getItem('theme-color')!
  );
}
if (localStorage.getItem('panel-color')) {
  document.documentElement.style.setProperty(
    `--container-color`,
    localStorage.getItem('panel-color')!
  );
}
</script>

<style lang="less">
.layout-container {
  height: 92.5vh;
  border: 1px solid #ccc;
  background-color: var(--container-color);
  box-shadow: var(--el-box-shadow-dark);
  border-radius: var(--el-border-radius-round);
  transition: background-color 0.3s;
  overflow: hidden;
}
.app-container {
  height: 100vh;
  min-width: 600px;
  padding: 3.75vh 3.75vw;
  background-color: var(--theme-color);
  transition: background-color 0.3s ease;
}
.login-enter-active {
  animation: fadeIn 0.4s linear;
}
.login-leave-active {
  animation: fadeIn 0.4s linear reverse;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
