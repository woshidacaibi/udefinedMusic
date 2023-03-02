<template>
  <div class="home-container">
    <el-menu
      :default-active="activeIndex"
      :active-text-color="themeColor"
      :background-color="panelColor"
      mode="horizontal"
      class="menu"
    >
      <router-link to="/">
        <el-menu-item index="index">首页</el-menu-item>
      </router-link>
      <router-link :to="{ name: 'home-playlist' }">
        <el-menu-item index="playlist">歌单</el-menu-item>
      </router-link>
      <router-link :to="{ name: 'home-artist' }">
        <el-menu-item index="artist">歌手</el-menu-item>
      </router-link>
      <router-link :to="{ name: 'home-album' }">
        <el-menu-item index="album">新碟</el-menu-item>
      </router-link>
      <router-link :to="{ name: 'home-rank' }">
        <el-menu-item index="rank">排行榜</el-menu-item>
      </router-link>
    </el-menu>
    <template v-if="activeIndex === 'index'">
      <div class="main-message" v-if="isLoad">
        <CarouselPanel :banners="banners"></CarouselPanel>
        <div class="home-area">
          <h2 class="tag">歌单推荐</h2>
          <router-link class="toMore" :to="{ name: 'home-playlist' }"
            >查看更多</router-link
          >
          <reco-playlist :lists="lists"></reco-playlist>
        </div>
        <div class="home-area">
          <h2 class="tag">新歌首发</h2>
          <new-songs></new-songs>
        </div>
        <div class="home-area">
          <h2 class="tag">MV</h2>
          <reco-mv></reco-mv>
        </div>
        <div class="home-area">
          <h2 class="tag">新碟首发</h2>
          <new-albums></new-albums>
        </div>
      </div>
      <loading-tip style="margin-top: 50px" :is-load="isLoad"></loading-tip>
    </template>
    <router-view v-if="activeIndex !== 'index'"> </router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import CarouselPanel from '@/components/Home/CarouselPanel.vue';
import RecoPlaylist from '@/components/Home/RecoPlaylist.vue';
import { other } from '@/stores/other';
import { getBanner, getDailyList } from '@/hooks/home';
import NewSongs from '@/components/Home/NewSongs.vue';
import RecoMv from '@/components/Home/RecoMv.vue';
import NewAlbums from '@/components/Home/NewAlbums.vue';

const { themeColor, panelColor } = storeToRefs(other());
const route = useRoute();
const isLoad = ref(false);
const banners = ref<any[]>([]);
const lists = ref<any[]>([]);
const activeIndex = ref('index');
async function getBasicInfo() {
  isLoad.value = false;
  banners.value = await getBanner();
  lists.value = await getDailyList();
  isLoad.value = true;
}

watch(
  () => route.path,
  async () => {
    switch (route.name) {
      case 'index': {
        await getBasicInfo();
        activeIndex.value = 'index';
        break;
      }
      case 'home-artist': {
        activeIndex.value = 'artist';
        break;
      }
      case 'home-rank': {
        activeIndex.value = 'rank';
        break;
      }
      case 'home-album': {
        activeIndex.value = 'album';
        break;
      }
      case 'home-playlist': {
        activeIndex.value = 'playlist';
        break;
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.home-container {
  //padding-left: 6px;
}
.menu {
  justify-content: center;
}
.main-message {
  margin-top: 10px;
}
.tag {
  font-size: 24px;
  line-height: 40px;
  text-align: center;
  letter-spacing: 5px;
}
.home-area {
  margin-top: 30px;
  background: linear-gradient(to bottom, var(--hover-light-color), transparent);
}
.toMore {
  display: block;
  width: 80px;
  margin: 0 auto;
  text-align: center;
  transition: color 0.5s;
}
.toMore:hover {
  color: var(--theme-color);
}
</style>
