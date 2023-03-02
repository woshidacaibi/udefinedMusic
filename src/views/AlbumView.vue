<template>
  <div class="view-container" v-if="isLoad">
    <ErrorTip v-if="!info" :top="'80px'"></ErrorTip>
    <template v-else>
      <div class="message-box">
        <LoadImg
          :src="info.picUrl + '?param=200y200'"
          class="left-img"
        ></LoadImg>
        <div class="right-message">
          <div class="name">
            <h2 class="type-name" style="margin-right: 5px">
              {{ info.type === 'Single' ? '单曲' : '专辑' }}
            </h2>
            <h2 class="list-name overflow" :title="info.name">
              {{ info.name }}
            </h2>
          </div>
          <div class="owner clearfix">
            <router-link
              :to="{ name: 'artist', query: { id: info.artist.id } }"
              class="owner-name"
            >
              <load-img
                class="avatar"
                :src="info.artist.picUrl + '?param=60y60'"
              ></load-img>
            </router-link>
            <router-link
              :to="{ name: 'artist', query: { id: info.artist.id } }"
              class="owner-name"
            >
              {{ info.artist.name }}
            </router-link>
          </div>
          <div class="operate-button">
            <theme-button @click="playAll" :disabled="tracks.length === 0">
              <i class="iconfont icon-bofang1"></i>播放全部
            </theme-button>
            <theme-button
              @click="subAlbum(true)"
              v-if="!isSub"
              :disabled="!ableSub"
            >
              <i class="iconfont icon-shoucang"></i>收藏
            </theme-button>
            <theme-button @click="subAlbum(false)" v-else :disabled="!ableSub">
              <i class="iconfont icon-yishoucang"></i>已收藏
            </theme-button>
          </div>
          <div class="other-message">
            <div>
              发布时间：{{ dayjs(info.publishTime).format('YYYY-MM-DD') }}
            </div>
            <div>发行版本：{{ info.subType }}</div>
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
        <el-menu-item index="introduce-panel">专辑详情</el-menu-item>
      </el-menu>
      <div v-show="activeIndex === 'song-panel'">
        <album-songs :tracks="tracks"></album-songs>
      </div>
      <template v-if="activeIndex === 'introduce-panel'">
        <div class="introduce" v-if="info.description">
          <h3>专辑介绍</h3>
          <p>{{ info.description }}</p>
        </div>
        <p v-else class="no-introduce">暂无介绍</p>
      </template>
      <keep-alive>
        <component
          :is="activeComponent"
          :itemId="info.id"
          :type="3"
        ></component>
      </keep-alive>
    </template>
  </div>
  <div class="view-container" v-if="!isLoad">
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
import dayjs from 'dayjs';
import { watch, ref, computed, markRaw, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { accountStore } from '@/stores/user';
import { other } from '@/stores/other';
import { getAlbumDetail, subscribeAlbum } from '@/hooks/album';
import { getLikeAlbum } from '@/hooks/user';
import { replaceList } from '@/hooks/audioPlayer';
import AlbumSongs from '@/components/Album/AlbumSongs.vue';
import { backToTop } from '@/hooks/scroll';
const CommentPanel = markRaw(
  defineAsyncComponent(() => import('@/components/Comment/CommentPanel.vue'))
);
const route = useRoute();
const { likeAlbums } = storeToRefs(accountStore());
// 获取信息和相关操作
const info = ref<any>(null);
const tracks = ref<any[]>([]);
const isLoad = ref(false);
const isSub = computed(() => {
  if (!likeAlbums.value) return false;
  return (
    likeAlbums.value.findIndex((item: any) => {
      return item.id === info.value.id;
    }) !== -1
  );
});
const ableSub = computed(() => {
  return likeAlbums.value !== null;
});

function playAll() {
  replaceList(tracks.value);
}
async function getAlbumInfo() {
  const res = await getAlbumDetail(route.query.id as number | string);
  info.value = res.album;
  tracks.value = res.songs;
  isLoad.value = true;
}
async function subAlbum(sub: boolean) {
  const t = sub ? 1 : 0;
  const res = await subscribeAlbum(info.value.id, t);
  if (res) {
    if (sub) likeAlbums.value.push(info.value);
    else {
      const i = likeAlbums.value.findIndex((item: any) => {
        return item.id === info.value.id;
      });
      if (i !== -1) likeAlbums.value.splice(i, 1);
    }
  }
}

// 子页切换
const activeIndex = ref('song-panel');
function handleSelect(key: string) {
  activeIndex.value = key;
  backToTop('main');
}

const { themeColor, panelColor } = storeToRefs(other());
const activeComponent = computed(() => {
  if (activeIndex.value === 'comment-panel') return CommentPanel;
  else return null;
});

watch(
  () => route.query.id,
  async () => {
    if (route.name === 'album') {
      isLoad.value = false;
      await getAlbumInfo();
      if (likeAlbums.value === null) {
        await getLikeAlbum();
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
@import '@/assets/css&less/list&album&artists.less';
.other-message {
  margin-top: 20px;
}
</style>
