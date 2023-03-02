<template>
  <h3 class="header">共找到{{ count }}{{ typeName }}</h3>
  <el-menu
    :default-active="type.toString()"
    :active-text-color="themeColor"
    :background-color="panelColor"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">单曲</el-menu-item>
    <el-menu-item index="10">专辑</el-menu-item>
    <el-menu-item index="100">歌手</el-menu-item>
    <el-menu-item index="1000">歌单</el-menu-item>
    <el-menu-item index="1002">用户</el-menu-item>
    <el-menu-item index="1004">MV</el-menu-item>
    <el-menu-item index="1014">视频</el-menu-item>
  </el-menu>
  <template v-if="!isError && isLoad">
    <no-more-tip
      :content="'没有找到相关信息。。。'"
      v-if="count === 0"
    ></no-more-tip>
    <SearchSong :tracks="lists" v-if="type === 1"></SearchSong>
    <SearchAlbums :lists="lists" v-if="type === 10"></SearchAlbums>
    <SearchArtists :lists="lists" v-if="type === 100"></SearchArtists>
    <SearchPlaylists :lists="lists" v-if="type === 1000"></SearchPlaylists>
    <SearchUsers :lists="lists" v-if="type === 1002"></SearchUsers>
    <SearchMv :lists="lists" v-if="type === 1004"></SearchMv>
    <SearchVideos :lists="lists" v-if="type === 1014"></SearchVideos>
    <el-pagination
      :total="count"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      @current-change="backToTop('main'), getResult()"
      layout="prev, pager, next"
      hide-on-single-page
      style="text-align: center"
    />
  </template>

  <div style="margin-top: 50px" v-if="isError || !isLoad">
    <error-tip v-if="isError && isLoad"></error-tip>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
  <div style="margin-bottom: 30px"></div>
</template>

<script lang="ts" setup>
import { searchKeyword } from '@/hooks/search';
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import { other } from '@/stores/other';
import { storeToRefs } from 'pinia';
import { backToTop } from '@/hooks/scroll';
import SearchSong from '@/components/Search/SearchTypeContainer/SearchSongs.vue';
import SearchAlbums from '@/components/Search/SearchTypeContainer/SearchAlbums.vue';
import SearchArtists from '@/components/Search/SearchTypeContainer/SearchArtists.vue';
import SearchPlaylists from '@/components/Search/SearchTypeContainer/SearchPlaylists.vue';
import SearchUsers from '@/components/Search/SearchTypeContainer/SearchUsers.vue';
import SearchVideos from '@/components/Search/SearchTypeContainer/SearchVideos.vue';
import SearchMv from '@/components/Search/SearchTypeContainer/SearchMv.vue';
const route = useRoute();
const { panelColor, themeColor } = storeToRefs(other());
const currentPage = ref(1);
const type = ref(1);
const count = ref(0);
const pageSize = computed(() => {
  switch (type.value) {
    case 1:
      return 100;
    case 10:
      return 60;
    case 100:
      return 60;
    case 1000:
      return 60;
    case 1002:
      return 60;
    case 1004:
      return 60;
    case 1014:
      return 60;
    default:
      return 60;
  }
});
const typeName = computed(() => {
  switch (type.value) {
    case 1:
      return '首单曲';
    case 10:
      return '张专辑';
    case 100:
      return '位歌手';
    case 1000:
      return '个歌单';
    case 1002:
      return '位用户';
    case 1004:
      return '个MV';
    case 1014:
      return '个视频';
    default:
      return '';
  }
});
const lists = ref<any[]>([]);
const isLoad = ref(false);
const isError = ref(false);
async function getResult() {
  isLoad.value = false;
  if (route.query.kw && route.query.kw !== '') {
    const offset = (currentPage.value - 1) * pageSize.value;
    const res = await searchKeyword(
      route.query.kw as string,
      offset,
      type.value,
      pageSize.value
    );
    if (res) {
      switch (type.value) {
        case 1: {
          count.value = res.songCount;
          lists.value = res.songs;
          break;
        }
        case 10: {
          count.value = res.albumCount;
          lists.value = res.albums;
          break;
        }
        case 100: {
          count.value = res.artistCount;
          lists.value = res.artists;
          break;
        }
        case 1000: {
          count.value = res.playlistCount;
          lists.value = res.playlists;
          break;
        }
        case 1002: {
          count.value = res.userprofileCount;
          lists.value = res.userprofiles;
          break;
        }
        case 1004: {
          count.value = res.mvCount;
          lists.value = res.mvs;
          break;
        }
        case 1014: {
          lists.value = res.videos.filter((item: any) => {
            return item.type === 1;
          });
          count.value =
            res.videoCount - (res.videos.length - lists.value.length);
          break;
        }
      }
      if (count.value > 300) count.value = 300;
    } else {
      isError.value = true;
    }
  }

  isLoad.value = true;
}
async function handleSelect(key: string) {
  type.value = parseInt(key);
  await getResult();
}
watch(
  () => route.query,
  async () => {
    if (route.name === 'search' && route.query.kw !== '') {
      await getResult();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
.header {
  margin-top: 10px;
  margin-left: 30px;
}
</style>
