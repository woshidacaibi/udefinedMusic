<template>
  <div class="video-item">
    <router-link :to="{ name: 'video', query: { id: info.vid } }" class="cover">
      <div class="video-curtain"></div>
      <load-img
        :src="info.coverUrl + '?param=264y148'"
        class="cover-img"
      ></load-img>
      <div class="icon">
        <i class="iconfont icon-bofang1"></i>
      </div>
    </router-link>
    <div class="message-box">
      <router-link
        :to="{ name: 'video', query: { id: info.vid } }"
        class="video-title overflow"
        >{{ info.title }}
      </router-link>
      <router-link
        :to="{ name: 'user', query: { id: info.creator.userId } }"
        class="video-owner overflow"
        >{{
          info.creator.nickname
            ? info.creator.nickname
            : info.creator[0].userName
        }}
      </router-link>
      <span class="other-message">
        <i class="iconfont icon-shipin2"></i>
        {{ playCount }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{ info: any }>();
const playCount = computed(() => {
  if (props.info.playTime > 10000)
    return (props.info.playTime / 10000).toFixed(2) + '万';
  else return props.info.playTime;
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/video/videoItem.less';
.video-item {
  margin-top: 3px;
}
.other-message {
  float: right;
  line-height: 35px;
  margin-top: 5px;
  width: 100%;
}
.message-box {
  width: 100%;
}
</style>
