import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores/index';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
// 获取歌手详情
export async function getArtistDetail(id: number | string) {
  const res = await asyncAjax('get', '/artist/detail', { id });
  if (res.errorMessage) {
    ElMessage.warning('获取信息失败');
    return null;
  } else return res.data.data.data;
}
// 收藏歌手
export async function subscribeArtist(id: number | string, Sub: boolean) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const t = Sub ? 1 : 2;
  const res = await asyncAjax('get', '/artist/sub', { id, t });
  if (res.data.data.code === 200) {
    ElMessage.success(Sub ? '收藏成功' : '取消收藏成功');
    return true;
  } else {
    ElMessage.warning('网络拥挤请稍后再试');
    return false;
  }
}
// 获取歌手专辑
export async function getArtistAlbum(
  id: number | string,
  offset: number = 10,
  limit: number = 10
) {
  const res = await asyncAjax('get', '/artist/album', { id, limit, offset });
  if (!res.errorMessage) return res.data.data.hotAlbums;
  else {
    ElMessage.warning('网络拥堵，获取信息失败');
    return [];
  }
}
// 获取歌手MV
export async function getArtistMv(
  id: string | number,
  offset: number = 0,
  limit: number = 12
) {
  const res = await asyncAjax('get', '/artist/mv', { id, limit, offset });
  if (res.errorMessage) {
    ElMessage.warning('网络拥堵，获取信息失败');
  } else return res.data.data.mvs;
}
// 获取相似歌手
export async function getSimiArtist(id: string | number) {
  const res = await asyncAjax('get', '/simi/artist', { id });
  if (res.errorMessage) {
    ElMessage.warning('网络拥堵，获取信息失败');
  } else return res.data.data.artists;
}
// 获取歌手单曲
export async function getArtistSongs(
  id: string | number,
  offset: number = 0,
  order: string = 'hot',
  limit: number = 100
) {
  const res = await asyncAjax('get', '/artist/songs', {
    id,
    order,
    limit,
    offset,
  });
  if (res.errorMessage) {
    return { list: [], error: res.errorMessage };
  } else return { list: res.data.data.songs, error: res.errorMessage };
}
// 获取歌手全部歌曲
export async function getArtistAllSongs(id: string | number) {
  const list = [];
  let res;
  let offset = 0;
  do {
    res = await asyncAjax('get', '/artist/songs', {
      id,
      offset,
      limit: 100,
    });
    offset += 100;
    if (res.errorMessage) break;
    list.push(...res.data.data.songs);
  } while (res.data.data.more);
  return { list: list, error: res.errorMessage };
}

// 获取全部歌手
export async function getArtistList(
  offset: number,
  type: number,
  area: number,
  initial: number | string,
  limit: number = 40
) {
  const param = { offset, type, area, initial, limit };
  const res = await asyncAjax('get', '/artist/list', param);
  if (res.errorMessage) {
    ElMessage.warning('网络拥堵，加载失败');
    return { artists: [], more: false };
  } else {
    return { artists: res.data.data.artists, more: res.data.data.more };
  }
}
