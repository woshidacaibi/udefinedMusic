<template>
  <div class="video-item">
    <a
      :href="
        'https://iplay.163.com/live?id=' + info.liveData.liveRoom.liveRoomNo
      "
      target="_blank"
      class="cover"
    >
      <div class="video-curtain"></div>
      <load-img
        :src="info.liveData.liveRoom.coverUrl"
        class="cover-img"
      ></load-img>
      <div class="icon">
        <i class="iconfont icon-bofang1"></i>
      </div>
    </a>
    <div class="message-box">
      <a
        :href="
          'https://iplay.163.com/live?id=' + info.liveData.liveRoom.liveRoomNo
        "
        target="_blank"
        class="video-title overflow"
        >{{ info.liveData.liveRoom.title }}
      </a>
      <a
        :href="
          'https://iplay.163.com/live?id=' + info.liveData.liveRoom.liveRoomNo
        "
        target="_blank"
        class="video-owner overflow"
        >{{ info.liveData.liveUser.nickname }}
      </a>
      <span class="other-message">
        {{ info.liveData.liveRoom.coverTag }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{ info: any }>();
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
  color: var(--theme-color);
}
.message-box {
  width: 100%;
}
</style>
