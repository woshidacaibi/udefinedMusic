<template>
  <div style="height: 20px"></div>
  <error-tip v-if="isError"></error-tip>
  <div class="view-container" v-else-if="isLoad">
    <h2 class="overflow">{{ info.name }}</h2>
    <div class="video-area">
      <div class="video" id="dplayer" ref="player"></div>
      <div class="recommend">
        <h3>推荐视频</h3>
        <template v-if="recoLoad">
          <template
            v-for="item in recoVideos.datas.slice(0, 5)"
            :key="item.data.vid"
          >
            <video-item :info="item.data"></video-item>
          </template>
        </template>
        <loading-tip :is-load="recoLoad"></loading-tip>
        <no-more-tip
          v-if="recoVideos.datas.length === 0"
          :content="'暂无更多视频,(若没登陆请登录)'"
        ></no-more-tip>
      </div>
    </div>
    <div class="video-message clearfix">
      <div class="video-author">
        <router-link
          :to="{ name: 'artist', query: { id: info.artists[0].id } }"
        >
          <load-img
            class="author-img"
            :src="info.artists[0].img1v1Url"
          ></load-img
        ></router-link>
        <router-link
          :to="{ name: 'artist', query: { id: info.artists[0].id } }"
          class="author-name overflow"
        >
          {{ info.artists[0].name }}
        </router-link>
      </div>
      <div class="other-message">
        <span
          >播放数：{{
            info.playCount > 10000
              ? (info.playCount / 10000).toFixed(1) + '万'
              : info.playCount
          }}</span
        >
        <span>发布时间：{{ info.publishTime }}</span>
      </div>
    </div>
    <div class="operate-button">
      <theme-button v-if="!isLike" @click="like_Mv(1)">
        <i class="iconfont icon-dianzan1" />点赞({{ likeCountString }})
      </theme-button>
      <theme-button @click="like_Mv(2)" v-else>
        <i class="iconfont icon-dianzan_kuai" />已点赞({{ likeCountString }})
      </theme-button>
      <theme-button v-if="!isSub" @click="sub_Mv(1)">
        <i class="iconfont icon-shoucang"></i>收藏({{ info.subCount }})
      </theme-button>
      <theme-button v-else @click="sub_Mv(2)">
        <i class="iconfont icon-yishoucang"></i>已收藏({{ info.subCount }})
      </theme-button>
    </div>
    <div class="video-desc overflow" v-if="info.desc">
      简介：{{ info.desc }}
    </div>
    <div class="video-comment">
      <comment-panel :item-id="route.query.id" :type="1"></comment-panel>
    </div>
  </div>
  <loading-tip :is-load="isLoad" style="margin-top: 30px" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import {
  getMvDetail,
  getMvURL,
  getMvOther,
  getRecoVideo,
  likeMv,
  subMv,
} from '@/hooks/video';
import { getLikeVideo } from '@/hooks/user';
import { storeToRefs } from 'pinia';
import { accountStore } from '@/stores/user';
//@ts-ignore
import DPlayer from 'dplayer';
import CommentPanel from '@/components/Comment/CommentPanel.vue';
import VideoItem from '@/components/SingleItem/video/videoItem.vue';

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
const likeCount = ref(0);
const likeCountString = computed(() => {
  return likeCount.value > 10000
    ? (likeCount.value / 10000).toFixed(2) + '万'
    : likeCount.value;
});
const isSub = computed(() => {
  if (!likeVideos.value) return false;
  const i = likeVideos.value.findIndex((item: any) => {
    return item.vid === route.query.id;
  });
  if (i === -1) return false;
  else return true;
});
async function getMvInfo() {
  isLoad.value = false;
  info.value = await getMvDetail(route.query.id as string);
  if (!info.value) {
    isError.value = true;
    isLoad.value = true;
    return;
  }
  for (let i = 0; i < info.value.brs.length; i++) {
    const res = await getMvURL(route.query.id as string, info.value.brs[i].br);
    if (res) {
      URL.value.push({ name: res.r + 'P', url: res.url });
    }
  }
  if (URL.value.length === 0) {
    isError.value = true;
    isLoad.value = true;
    return;
  }
  const res = await getMvOther(route.query.id as string);
  if (res) {
    likeCount.value = res.likedCount;
    isLike.value = res.liked;
  }
  isLoad.value = true;
  recoVideos.value = await getRecoVideo();
  recoLoad.value = true;
  await getLikeVideo();
}
async function like_Mv(t: number) {
  if (await likeMv(route.query.id as string, t)) {
    if (t === 1) {
      isLike.value = true;
      likeCount.value++;
    } else {
      isLike.value = false;
      likeCount.value--;
    }
  }
}
async function sub_Mv(t: number) {
  if (await subMv(route.query.id as string, t)) {
    if (t === 1) {
      likeVideos.value.push({ vid: route.query.id });
      info.value.subCount++;
    } else {
      const i = likeVideos.value.findIndex((item: any) => {
        return item.vid === route.query.id;
      });
      likeVideos.value.splice(i, 1);
      info.value.subCount--;
    }
  }
}
watch(
  () => route.query.id,
  async () => {
    if (route.name === 'mv') {
      URL.value = [];
      await getMvInfo();
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
  //@ts-ignore
  const dp = new DPlayer(option);
}
</script>

<style scoped lang="less">
@import '@/assets/css&less/video/videoView.less';
</style>
