<template>
  <div class="center-container">
    <LeftSide></LeftSide>
    <div class="right-container">
      <ScrollBar sid="main" :back-top-show="true">
        <div style="min-width: 750px">
          <router-view></router-view>
        </div>
      </ScrollBar>
      <transition name="playerList">
        <PlayerList></PlayerList>
      </transition>
    </div>
    <transition name="songDetail">
      <songDetail></songDetail>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import LeftSide from '@/layout/center/LeftSide.vue';
import PlayerList from '@/components/AudioPlayer/playerList.vue';
</script>

<style scoped lang="less">
.center-container {
  height: calc(100% - 110px);
  width: 100%;
  display: flex;
  overflow: hidden;
}
.right-container {
  height: 100%;
  width: 0;
  flex: 1;
  overflow: hidden;
}
.playerList-enter-active {
  animation: rightToLeft 0.5s ease-in-out;
}
.playerList-leave-active {
  animation: rightToLeft 0.5s ease-in-out reverse;
}
.songDetail-enter-active {
  animation: upToHeight 0.5s ease-in-out;
}
.songDetail-leave-active {
  animation: upToHeight 0.5s ease-in-out reverse;
}
@keyframes rightToLeft {
  0% {
    opacity: 0.5;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes upToHeight {
  0% {
    opacity: 0.5;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
