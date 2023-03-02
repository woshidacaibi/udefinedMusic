<template>
  <div class="video-item">
    <router-link :to="{ name: 'mv', query: { id: info.id } }" class="cover">
      <div class="video-curtain"></div>
      <load-img
        :src="info.imgurl16v9 ? info.imgurl16v9 : info.cover + '?param=264y148'"
        class="cover-img"
        fit="contain"
      ></load-img>
      <div class="icon">
        <i class="iconfont icon-bofang1"></i>
      </div>
    </router-link>
    <div class="message-box">
      <router-link
        :to="{ name: 'mv', query: { id: info.id } }"
        class="video-title overflow"
        >{{ info.name }}
      </router-link>
      <router-link
        :to="{
          name: 'artist',
          query: { id: info.artist ? info.artist.id : info.artists[0].name },
        }"
        class="video-owner overflow"
        >{{ info.artist ? info.artist.name : info.artists[0].name }}
      </router-link>
      <p class="other-message">
        <i class="iconfont icon-shipin2"></i>
        {{ playCount }}
        &nbsp;
        <template v-if="info.publishTime">
          {{ info.publishTime }}
        </template>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps<{ info: any }>();
const playCount = computed(() => {
  if (props.info.playCount > 10000)
    return (props.info.playCount / 10000).toFixed(2) + '万';
  else return props.info.playCount;
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/video/videoItem.less';
</style>
