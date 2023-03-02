<template>
  <div class="view-container" v-if="isLoad">
    <ErrorTip v-if="!info" :top="'80px'"></ErrorTip>
    <template v-else>
      <div class="message-box">
        <LoadImg
          :src="info.coverImgUrl + '?param=200y200'"
          class="left-img"
        ></LoadImg>
        <div class="right-message">
          <div class="name">
            <h2 class="type-name" style="margin-right: 5px">歌单</h2>
            <h2 class="list-name overflow" :title="info.name">
              {{ info.name }}
            </h2>
          </div>
          <div class="owner clearfix">
            <router-link
              :to="{ name: 'user', query: { id: info.creator.userId } }"
              class="owner-name"
            >
              <load-img
                class="avatar"
                :src="info.creator.avatarUrl + '?param=60y60'"
              ></load-img>
            </router-link>
            <router-link
              :to="{ name: 'user', query: { id: info.creator.userId } }"
              class="owner-name"
            >
              {{ info.creator.nickname }}</router-link
            >
            <span class="create-time"
              >创建于{{ dayjs(info.createTime).format('YYYY-MM-DD') }}</span
            >
          </div>
          <div class="operate-button">
            <theme-button @click="playAll" :disabled="info.trackCount === 0">
              <i class="iconfont icon-bofang1"></i>播放全部
            </theme-button>
            <theme-button
              @click="subscribe(true)"
              v-if="!info.subscribed"
              :disabled="!ableSub"
            >
              <i class="iconfont icon-shoucang"></i>收藏
            </theme-button>
            <theme-button @click="subscribe(false)" v-else :disabled="!ableSub">
              <i class="iconfont icon-yishoucang"></i>已收藏
            </theme-button>
          </div>
          <div class="other-message">
            <span>歌曲：{{ info.trackCount }}</span>
            <span>播放：{{ playCount }}</span>
          </div>
          <div class="brief-intro overflow" :title="info.description">
            简介：{{ info.description ? info.description : '暂无简介' }}
          </div>
        </div>
      </div>
      <el-menu
        :default-active="activeIndex"
        :active-text-color="themeColor"
        :background-color="panelColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="song-panel">歌曲列表</el-menu-item>
        <el-menu-item index="comment-panel">评论</el-menu-item>
        <el-menu-item index="subscribers-panel">收藏者</el-menu-item>
      </el-menu>

      <div v-show="activeIndex === 'song-panel'">
        <PlaylistSongs
          :id="info.id"
          :track-count="info.trackCount"
          ref="songPanel"
        ></PlaylistSongs>
      </div>
      <keep-alive>
        <component
          :is="activeComponent"
          :itemId="info.id"
          :type="2"
        ></component>
      </keep-alive>
    </template>
  </div>

  <div class="view-container" v-else>
    <div class="message-box">
      <el-skeleton animated :throttle="500">
        <template #template>
          <el-skeleton-item variant="image" class="left-img" />
        </template>
      </el-skeleton>
      <div class="right-message">
        <el-skeleton :throttle="500" animated :rows="4"></el-skeleton>
      </div>
    </div>
    <el-skeleton
      :throttle="500"
      style="margin-top: 50px"
      animated
      :rows="5"
    ></el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, markRaw, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { accountStore } from '@/stores/user';
import { other } from '@/stores/other';
import { getListDetail, subscribeList } from '@/hooks/playlist';
import { storeToRefs } from 'pinia';
import PlaylistSongs from '@/components/Playlist/PlaylistSongs.vue';
import { scrollStore } from '@/stores/panelStaus';
const { backToTop } = scrollStore();
const CommentPanel = markRaw(
  defineAsyncComponent(() => import('@/components/Comment/CommentPanel.vue'))
);
const SubscribersPanel = markRaw(
  defineAsyncComponent(
    () => import('@/components/Subscriber/SubscribersPanel.vue')
  )
);

import ErrorTip from '@/basic/ErrorTip.vue';
const route = useRoute();
const info = ref<null | any>(null);
const isLoad = ref(false);
// 歌单信息
const { userInfo } = storeToRefs(accountStore());
async function getInfo() {
  if (route.query.id) {
    info.value = await getListDetail(route.query.id as string);
    isLoad.value = true;
  }
}

const playCount = computed(() => {
  if (info.value) {
    return (info.value as any).playCount < 10000
      ? (info.value as any).playCount
      : ((info.value as any).playCount % 1000) / 10 + '万';
  } else return null;
});
// 收藏歌单
const ableSub = computed(() => {
  if (userInfo.value && info.value) {
    return !(userInfo.value.userId === info.value.creator.userId);
  } else return false;
});
async function subscribe(sub: boolean) {
  const res = await subscribeList(info.value.id, sub);
  if (res) {
    info.value.subscribed = sub;
  }
}
// 歌单子页切换以及回到顶部功能
const activeIndex = ref('song-panel');
function handleSelect(key: string) {
  activeIndex.value = key;
  backToTop('main');
}
const { themeColor, panelColor } = storeToRefs(other());
const activeComponent = computed(() => {
  if (activeIndex.value === 'comment-panel') return CommentPanel;
  else if (activeIndex.value === 'subscribers-panel') return SubscribersPanel;
  else return null;
});

watch(
  () => route.query.id,
  () => {
    if (route.name === 'playlist') {
      isLoad.value = false;
      activeIndex.value = 'song-panel';
      getInfo();
    }
  },
  { immediate: true }
);
// 播放全部
const songPanel = ref<any>(null);
function playAll() {
  if (songPanel.value) {
    songPanel.value.playAll();
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css&less/list&album&artists.less';
</style>
