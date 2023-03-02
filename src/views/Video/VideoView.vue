<template>
  <div style="height: 20px"></div>
  <error-tip v-if="isError"></error-tip>
  <div class="view-container" v-else-if="isLoad">
    <h2 class="overflow">{{ info.title }}</h2>
    <div class="video-area">
      <div class="video" id="dplayer" ref="player"></div>
      <div class="recommend">
        <h3>推荐视频</h3>
        <template v-if="recoLoad">
          <template
            v-for="item in recoVideos.datas.slice(0, 5)"
            :key="item.data.vid"
          >
            <div style="margin-bottom: 20px">
              <video-item :info="item.data"></video-item>
            </div>
          </template>
        </template>
        <loading-tip :is-load="recoLoad"></loading-tip>
        <no-more-tip
          v-if="recoVideos.datas.length === 0"
          :content="'暂无更多视频,登录试试'"
        ></no-more-tip>
      </div>
    </div>
    <div class="video-message clearfix">
      <div class="video-author">
        <router-link :to="{ name: 'user', query: { id: info.creator.userId } }">
          <load-img class="author-img" :src="info.creator.avatarUrl"></load-img
        ></router-link>
        <router-link
          :to="{ name: 'user', query: { id: info.creator.userId } }"
          class="author-name overflow"
        >
          {{ info.creator.nickname }}
        </router-link>
      </div>
      <div class="other-message">
        <span
          >播放数：{{
            info.playTime > 10000
              ? (info.playTime / 10000).toFixed(1) + '万'
              : info.playTime
          }}</span
        >
        <span
          >发布时间：{{ dayjs(info.publishTime).format('YYYY-MM-DD') }}</span
        >
      </div>
    </div>
    <div class="operate-button">
      <theme-button v-if="!isLike" @click="like_Video(1)">
        <i class="iconfont icon-dianzan1" />点赞({{ likeCountString }})
      </theme-button>
      <theme-button @click="like_Video(2)" v-else>
        <i class="iconfont icon-dianzan_kuai" />已点赞({{ likeCountString }})
      </theme-button>
      <theme-button v-if="!isSub" @click="sub_Video(1)">
        <i class="iconfont icon-shoucang"></i>收藏({{ info.subscribeCount }})
      </theme-button>
      <theme-button v-else @click="sub_Video(2)">
        <i class="iconfont icon-yishoucang"></i>已收藏({{
          info.subscribeCount
        }})
      </theme-button>
    </div>
    <div class="video-desc overflow" v-if="info.description">
      简介：{{ info.description }}
    </div>
    <div class="video-comment">
      <comment-panel :item-id="route.query.id" :type="5"></comment-panel>
    </div>
  </div>
  <loading-tip :is-load="isLoad" style="margin-top: 30px" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import {
  getVideoDetail,
  getVideoURL,
  getRecoVideo,
  getVideoOther,
  likeVideo,
  subVideo,
} from '@/hooks/video';
import { getLikeVideo } from '@/hooks/user';
import { storeToRefs } from 'pinia';
import { accountStore } from '@/stores/user';
//@ts-ignore
import DPlayer from 'dplayer';
import dayjs from 'dayjs';
import CommentPanel from '@/components/Comment/CommentPanel.vue';
import VideoItem from '@/components/SingleItem/video/videoItem.vue';
import NoMoreTip from '@/basic/NoMoreTip.vue';

const route = useRoute();
const { likeVideos } = storeToRefs(accountStore());
const isLoad = ref(false);
const recoLoad = ref(false);
const info = ref<any>(null);
const recoVideos = ref<any>({ hasMore: false, datas: [] });
const isError = ref(route.query.id ? false : true);
const URL = ref<{ name: string; url: string }[]>([]);
const player = ref<HTMLElement | null>(null);
const isLike = ref(false);
const likeCountString = computed(() => {
  if (!info.value) return 0;
  return info.value.praisedCount > 10000
    ? (info.value.praisedCount / 10000).toFixed(2) + '万'
    : info.value.praisedCount;
});
const isSub = computed(() => {
  if (!likeVideos.value) return false;
  const i = likeVideos.value.findIndex((item: any) => {
    return item.vid === route.query.id;
  });
  if (i === -1) return false;
  else return true;
});
async function getVideoInfo() {
  isLoad.value = false;
  recoLoad.value = false;
  info.value = await getVideoDetail(route.query.id as string);
  if (!info.value) {
    isError.value = true;
    isLoad.value = true;
    return;
  }
  const urls = await getVideoURL(route.query.id as string);
  for (let i in urls) {
    URL.value.push({ name: urls[i].r + 'p', url: urls[i].url });
  }
  isLike.value = await getVideoOther(route.query.id as string);
  isLoad.value = true;
  recoVideos.value = await getRecoVideo();
  recoLoad.value = true;
  await getLikeVideo();
}
async function like_Video(t: number) {
  if (await likeVideo(route.query.id as string, t)) {
    if (t === 1) {
      isLike.value = true;
      info.value.praisedCount++;
    } else {
      isLike.value = false;
      info.value.praisedCount--;
    }
  }
}
async function sub_Video(t: number) {
  if (await subVideo(route.query.id as string, t)) {
    if (t === 1) {
      likeVideos.value.push({ vid: route.query.id });
      info.value.subscribeCount++;
    } else {
      const i = likeVideos.value.findIndex((item: any) => {
        return item.vid === route.query.id;
      });
      likeVideos.value.splice(i, 1);
      info.value.subscribeCount--;
    }
  }
}
watch(
  () => route.query.id,
  async () => {
    if (route.name === 'video') {
      URL.value = [];
      recoVideos.value = { hasMore: false, datas: [] };
      isLike.value = false;
      await getVideoInfo();
    }
  },
  { immediate: true }
);
watch(player, () => {
  if (player.value) {
    setDplayer();
  }
});

function setDplayer() {
  const option = {
    container: document.getElementById('dplayer'),
    video: {
      quality: URL.value,
      defaultQuality: 0,
      pic: info.value.cover,
    },
  };
  //  @ts-ignore
  const dp = new DPlayer(option);
}
</script>

<style scoped lang="less">
@import '@/assets/css&less/video/videoView.less';
</style>
