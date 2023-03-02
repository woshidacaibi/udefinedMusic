<template>
  <div class="view-container" v-if="isLoad">
    <ErrorTip v-if="!info" :top="'80px'"></ErrorTip>
    <template v-else>
      <div class="message-box">
        <LoadImg
          :src="info.artist.cover + '?param=200y200'"
          class="left-img"
        ></LoadImg>
        <div class="right-message">
          <div class="name">
            <h2 class="list-name overflow" :title="info.name">
              {{ info.artist.name }}
            </h2>
          </div>
          <h4 v-if="info.artist.alias.length > 0">
            {{ info.artist.alias[0] }}
          </h4>
          <div class="operate-button">
            <theme-button @click="subArtist(true)" v-if="!isSub">
              <i class="iconfont icon-shoucang"></i>收藏
            </theme-button>
            <theme-button @click="subArtist(false)" v-else>
              <i class="iconfont icon-yishoucang"></i>已收藏
            </theme-button>
            <router-link
              v-if="info.user"
              :to="{ name: 'user', query: { id: info.user.userId } }"
            >
              <theme-button>
                <i class="iconfont icon-yonghu"></i>
                个人主页</theme-button
              >
            </router-link>
          </div>
          <div class="other-message">
            <span>单曲数:{{ info.artist.musicSize }}</span>
            <span>MV数:{{ info.artist.mvSize }}</span>
            <span>专辑数:{{ info.artist.albumSize }}</span>
          </div>
          <div class="tip">ps:当前页面的接口获取的歌曲信息没有封面。。。</div>
        </div>
      </div>
      <el-menu
        :default-active="activeIndex"
        :active-text-color="themeColor"
        :background-color="panelColor"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="artist-song">歌手作品</el-menu-item>
        <el-menu-item index="artist-album">专辑</el-menu-item>
        <el-menu-item index="artist-mv">MV</el-menu-item>
        <el-menu-item index="artist-detail">歌手详情</el-menu-item>
        <el-menu-item index="similar-artist">相似歌手</el-menu-item>
      </el-menu>
      <template v-if="activeIndex === 'artist-detail'">
        <div class="introduce" v-if="info.artist.briefDesc">
          <h3>专辑介绍</h3>
          <p>{{ info.artist.briefDesc }}</p>
        </div>
        <p v-else class="no-introduce">暂无介绍</p>
      </template>
      <keep-alive>
        <component
          :is="activeComponent"
          :id="route.query.id"
          :passCount="passCount"
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
import { watch, ref, computed, defineAsyncComponent, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import { getArtistDetail, subscribeArtist } from '@/hooks/artist';
import { getLikeArtists } from '@/hooks/user';
import { accountStore } from '@/stores/user';
import { other } from '@/stores/other';
import { storeToRefs } from 'pinia';
import { backToTop } from '@/hooks/scroll';

const ArtistAlbums = markRaw(
  defineAsyncComponent(() => import('@/components/Artist/ArtistAlbums.vue'))
);

const ArtistMv = markRaw(
  defineAsyncComponent(() => import('@/components/Artist/ArtistMv.vue'))
);
const SimilarArtist = markRaw(
  defineAsyncComponent(() => import('@/components/Artist/SimilarArtist.vue'))
);
const ArtistSongs = markRaw(
  defineAsyncComponent(() => import('@/components/Artist/ArtistSongs.vue'))
);
const { likeArtists } = storeToRefs(accountStore());
const { themeColor, panelColor } = storeToRefs(other());
const route = useRoute();
const info = ref<any>(null);
const activeIndex = ref('artist-song');
const isLoad = ref(false);
const passCount = computed(() => {
  if (activeIndex.value === 'artist-mv') return info.value.artist.mvSize;
  else if (activeIndex.value === 'similar-artist') return 0;
  else if (activeIndex.value === 'artist-song')
    return info.value.artist.musicSize;
  else if (activeIndex.value === 'artist-album')
    return info.value.artist.albumSize;
  else return 0;
});
// 是否已收藏
const isSub = computed(() => {
  if (!likeArtists.value) return false;
  const index = likeArtists.value.findIndex((item: any) => {
    return item.id == route.query.id;
  });
  return index !== -1;
});
const activeComponent = computed(() => {
  if (activeIndex.value === 'artist-mv') return ArtistMv;
  else if (activeIndex.value === 'artist-song') return ArtistSongs;
  else if (activeIndex.value === 'similar-artist') return SimilarArtist;
  else if (activeIndex.value === 'artist-album') return ArtistAlbums;
  else return null;
});
async function getArtistInfo() {
  const res = await getArtistDetail(route.query.id as number | string);
  if (likeArtists.value === null) {
    await getLikeArtists();
  }
  info.value = res;
  isLoad.value = true;
}
async function subArtist(sub: boolean) {
  if (sub) {
    const res = await subscribeArtist(route.query.id as number | string, sub);
    if (res) likeArtists.value.push(info.value.artist);
  } else {
    const res = await subscribeArtist(route.query.id as number | string, sub);
    if (res) {
      const i = likeArtists.value.findIndex((item: any) => {
        return item.id == route.query.id;
      });
      likeArtists.value.splice(i, 1);
    }
  }
}
function handleSelect(key: string) {
  activeIndex.value = key;
  backToTop('main');
}
watch(
  () => route.query.id,
  async () => {
    if (route.name === 'artist') {
      isLoad.value = false;
      activeIndex.value = 'artist-song';
      await getArtistInfo();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
@import '@/assets/css&less/list&album&artists.less';
h4 {
  color: var(--hover-more-color);
}
.icon-yonghu {
  width: 15px;
  text-align: center;
  transform: translateX(-5px);
}
.other-message {
  margin-top: 20px;
}
.tip {
  color: var(--hover-more-color);
  margin-top: 10px;
  font-size: 14px;
}
</style>
