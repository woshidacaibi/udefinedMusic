<template>
  <div class="tip-container">
    <template v-if="loginTip">
      <div @click="showLogin = true" style="cursor: pointer">
        <img :src="unLogin" />
        <div class="bounce">当前未登录，请登陆后使用该功能。</div>
      </div>
    </template>
    <template v-if="!isLoad && !loginTip">
      <img :src="loading" />
      <div class="bounce">
        <template v-for="(item, index) in contents" :key="index">
          <span class="letter">{{ item }}</span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { loginStore } from '@/stores/login';
import { storeToRefs } from 'pinia';
const { loginStatus, showLogin } = storeToRefs(loginStore());
import loading from '@/assets/img/loading.png';
import unLogin from '@/assets/img/pleaseLogin.png';
const props = withDefaults(
  defineProps<{ isLoad: boolean; content?: string; loginCheck?: boolean }>(),
  {
    isLoad: true,
    content: '火速加载中...',
    loginCheck: false,
  }
);
const contents = computed(() => {
  return props.content.split('');
});
const loginTip = computed(() => {
  return !loginStatus.value && props.loginCheck;
});
</script>

<style lang="less" scoped>
.tip-container {
  width: 180px;
  text-align: center;
  margin: 0 auto;
  img {
    width: 70px;
    //border-radius: 50%;
    margin: 0 auto;
    //border: 1px solid #cccccc;
  }
}
.bounce {
  width: 100%;
  height: 100%;
}
.letter {
  //animation: bounce 0.375s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate;
  display: inline-block;
  transform: translate3d(0, 0, 0);
  margin-top: 0.5em;
  text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
  font: normal 500 18px 'Varela Round', sans-serif;
}
.letter:nth-child(16n + 1) {
  animation-delay: 0s;
}
.letter:nth-child(16n + 2) {
  animation-delay: 0.1s;
}
.letter:nth-child(16n + 3) {
  animation-delay: 0.2s;
}
.letter:nth-child(16n + 4) {
  animation-delay: 0.3s;
}
.letter:nth-child(16n + 5) {
  animation-delay: 0.4s;
}
.letter:nth-child(16n + 6) {
  animation-delay: 0.5s;
}
.letter:nth-child(16n + 7) {
  animation-delay: 0.6s;
}
.letter:nth-child(16n + 8) {
  animation-delay: 0.7s;
}
.letter:nth-child(16n + 9) {
  animation-delay: 0.8s;
}
.letter:nth-child(16n + 10) {
  animation-delay: 0.9s;
}
.letter:nth-child(16n + 11) {
  animation-delay: 1s;
}
.letter:nth-child(16n + 12) {
  animation-delay: 1.1s;
}
.letter:nth-child(16n + 13) {
  animation-delay: 1.2s;
}
.letter:nth-child(16n + 14) {
  animation-delay: 1.3s;
}
.letter:nth-child(16n + 15) {
  animation-delay: 1.4s;
}
.letter:nth-child(16n + 16) {
  animation-delay: 1.5s;
}
//.letter:nth-child(10) {
//  animation-delay: 0.9s;
//}
//.letter:nth-child(11) {
//  animation-delay: 1s;
//}
//.letter:nth-child(12) {
//  animation-delay: 1.1s;
//}
//.letter:nth-child(13) {
//  animation-delay: 1.2s;
//}
//.letter:nth-child(14) {
//  animation-delay: 1.3s;
//}
//.letter:nth-child(15) {
//  animation-delay: 1.4s;
//}
//.letter:nth-child(16) {
//  animation-delay: 1.5s;
//}

@keyframes bounce {
  0% {
    transform: translate3d(0, 0, 0);
    text-shadow: rgba(255, 255, 255, 0.4) 0 0 0.05em;
  }
  100% {
    transform: translate3d(0, -1em, 0);
    text-shadow: rgba(255, 255, 255, 0.4) 0 1em 0.35em;
  }
}
</style>
