import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router';
import { findScroll } from '@/hooks/scroll';
const scroll = findScroll('main');
import index from '@/stores';
import { playerStore } from '@/stores/audioPlayer';
import { storeToRefs } from 'pinia';
const { pause } = storeToRefs(playerStore(index));
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Home/HomePage.vue'),
      children: [
        {
          path: '/home_artist',
          name: 'home-artist',
          component: () => import('@/views/Home/RecoArtistView.vue'),
        },
        {
          path: '/home_album',
          name: 'home-album',
          component: () => import('@/views/Home/RecoAlbumView.vue'),
        },
        {
          path: '/home_rank',
          name: 'home-rank',
          component: () => import('@/views/Home/RecoRankView.vue'),
        },
        {
          path: '/home_playlist',
          name: 'home-playlist',
          component: () => import('@/views/Home/RecoListView.vue'),
        },
      ],
    },
    {
      path: '/theme',
      name: 'theme',
      component: () => import('@/views/ThemeView.vue'),
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: () => import('@/views/PlaylistView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/User/UserView.vue'),
    },
    {
      path: '/event',
      name: 'event',
      component: () => import('@/views/EventView.vue'),
    },
    {
      path: '/follows',
      name: 'follows',
      component: () => import('@/views/User/UserFollows.vue'),
    },
    {
      path: '/followed',
      name: 'followed',
      component: () => import('@/views/User/UserFolloweds.vue'),
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('@/views/AlbumView.vue'),
    },
    {
      path: '/artist',
      name: 'artist',
      component: () => import('@/views/ArtistView.vue'),
    },
    {
      path: '/mv',
      name: 'mv',
      component: () => import('@/views/Video/MvView.vue'),
    },
    {
      path: '/moreMv',
      name: 'moreMv',
      component: () => import('@/views/Video/MoreMvView.vue'),
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/Video/VideoView.vue'),
    },
    {
      path: '/moreVideo',
      name: 'moreVideo',
      component: () => import('@/views/Video/MoreVideoView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/daily',
      name: 'daily',
      component: () => import('@/components/Playlist/dailySongList.vue'),
    },
    {
      path: '/subArtists',
      name: 'subArtists',
      component: () => import('@/views/MySubscribe/SubArtists.vue'),
    },
    {
      path: '/subAlbums',
      name: 'subAlbums',
      component: () => import('@/views/MySubscribe/SubAlbums.vue'),
    },
    {
      path: '/subVideos',
      name: 'subVideos',
      component: () => import('@/views/MySubscribe/SubVideos.vue'),
    },
    // 歌单详情如果有页面跳转就拉下来
  ],
});
router.beforeEach((to, from, next) => {
  if (scroll) {
    scroll.translate.y = 0;
  }
  if (to.name === 'mv' || to.name === 'video') {
    pause.value = true;
  }
  next();
});
export default router;
