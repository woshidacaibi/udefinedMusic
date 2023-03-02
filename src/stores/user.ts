import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// 用户个人信息
export const accountStore = defineStore('accountStore', () => {
  const userInfo = ref<any>(null);
  const userPlaylists = ref<any>(null);
  // 喜欢的歌曲的id列表
  const likeIdList = ref<any>(null);
  const likeAlbums = ref<any>(null);
  const likeArtists = ref<any>(null);
  const likeVideos = ref<any>(null);
  const createdLists = computed(() => {
    if (userPlaylists.value) {
      return userPlaylists.value.filter((item: any) => {
        return item.userId === userInfo.value.userId;
      });
    } else return null;
  });
  const subLists = computed(() => {
    if (userPlaylists.value) {
      return userPlaylists.value.filter((item: any) => {
        return item.userId !== userInfo.value.userId;
      });
    } else return null;
  });
  return {
    userInfo,
    userPlaylists,
    likeIdList,
    likeAlbums,
    likeArtists,
    likeVideos,
    createdLists,
    subLists,
  };
});
