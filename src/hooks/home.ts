import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';

// 获取轮播图信息
export async function getBanner() {
  const res = await asyncAjax('get', '/banner');
  if (res.data.data.code === 200) {
    return res.data.data.banners;
  } else {
    ElMessage.warning('获取轮播图资源失败');
    return [];
  }
}

// 获取推荐歌单
export async function getDailyList() {
  const res = await asyncAjax('get', '/recommend/resource');
  if (res.data.data.code === 200) {
    return res.data.data.recommend;
  } else {
    ElMessage.warning('获取每日歌单失败（不登陆有些功能会失效）');
    return [];
  }
}
// 获取每日推荐歌曲
export async function getDailySongs() {
  const res = await asyncAjax('get', '/recommend/songs');
  if (res.data.data.code === 200) {
    return res.data.data.data.dailySongs;
  } else {
    ElMessage.warning('获取每日推荐歌曲失败');
    return [];
  }
}

// 新歌速递
export async function getNewSong(type: number) {
  const res = await asyncAjax('get', '/top/song', { type });
  if (res.data.data.code === 200) {
    return res.data.data.data;
  } else {
    ElMessage.warning('获取新歌失败');
    return [];
  }
}

// 获取排行榜
export async function getRank() {
  const res = await asyncAjax('get', '/toplist');
  if (res.errorMessage) {
    ElMessage.warning('获取排行榜信息失败');
    return [];
  } else return res.data.data.list;
}

// 获取热门tag
export async function getHotTag() {
  const res = await asyncAjax('get', '/playlist/hot');
  if (res.errorMessage) {
    return [];
  } else return res.data.data.tags;
}
// 获取全部tag /playlist/catlist
export async function getAllTag() {
  const res = await asyncAjax('get', '/playlist/catlist');
  if (res.errorMessage) {
    return [];
  } else return res.data.data.sub;
}
// 根据tag获取推荐歌单
export async function getHightLightList(
  cat: string = '全部',
  before: number = 0,
  limit: number = 40
) {
  const res = await asyncAjax('get', '/top/playlist/highquality', {
    limit,
    cat,
    before,
  });
  if (res.errorMessage) {
    return { more: false, before: before, list: [] };
  } else
    return {
      more: res.data.data.more,
      before: res.data.data.lasttime,
      list: res.data.data.playlists,
    };
}
