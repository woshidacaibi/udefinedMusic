import { ajax, asyncAjax, localAxios } from '@/hooks/ajax';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import { accountStore } from '@/stores/user';
import index from '@/stores';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
const { likeAlbums, likeArtists, likeVideos } = storeToRefs(
  accountStore(index)
);
// 获取用户信息
export async function getUserInfo(uid: string | number) {
  const res = await asyncAjax('get', '/user/detail', {
    uid,
    timestamp: Date.now(),
  });
  if (res.errorMessage) return false;
  else return res.data.data;
}

// 获取用户全部歌单
export async function getPlaylist(uid: string, limit: number = 1000) {
  let more = true;
  let start = 0;
  const playLists = [];
  while (more) {
    const res = await asyncAjax('get', '/user/playlist', {
      uid,
      offset: start,
      limit,
    });
    playLists.push(...res.data.data.playlist);
    more = res.data.data.more;
    start += limit;
  }
  return playLists;
}

// 获取用户喜欢音乐id列表
export async function getLikeList(id: string | number) {
  const res = await asyncAjax('get', '/likelist', {
    uid: id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('获取我喜欢歌曲信息失败');
    return null;
  } else {
    return res.data.data.ids;
  }
}
// 获取账户收藏专辑
export async function getLikeAlbum() {
  if (!loginStatus.value) {
    likeAlbums.value = null;
    return;
  }
  const albums: any[] = [];
  let offset = 0;
  let res;
  do {
    res = await asyncAjax('get', '/album/sublist', {
      timestamp: Date.now(),
      offset,
    });
    albums.push(...res.data.data.data);
    offset += 25;
  } while (res.data.data.hasMore && !res.errorMessage);
  likeAlbums.value = albums;
}
// 获取账户的收藏歌手
export async function getLikeArtists() {
  if (!loginStatus.value) {
    likeAlbums.value = null;
    return;
  }
  const artists: any[] = [];
  let offset = 0;
  const limit = 300;
  let res;
  do {
    res = await asyncAjax('get', '/artist/sublist', {
      timestamp: Date.now(),
      offset,
      limit,
    });
    artists.push(...res.data.data.data);
    offset += 300;
  } while (res.data.data.hasMore && !res.errorMessage);
  likeArtists.value = artists;
}
// 获取账户收藏视频
export async function getLikeVideo() {
  if (!loginStatus.value) {
    likeVideos.value = null;
    return;
  }
  const videos: any[] = [];
  let offset = 0;
  const limit = 300;
  let res;
  do {
    res = await asyncAjax('get', '/mv/sublist', {
      timestamp: Date.now(),
      offset,
      limit,
    });
    videos.push(...res.data.data.data);
    offset += 300;
  } while (res.data.data.hasMore && !res.errorMessage);
  likeVideos.value = videos;
}
// 获取用户关注列表
interface getFollows {
  uid: number | string;
  limit?: number;
  offset?: number;
}
export async function getFollows(data: getFollows) {
  const res = await asyncAjax('get', '/user/follows', { ...data });
  if (res.errorMessage) return { error: true, data: [] };
  else return { error: false, data: res.data.data };
}
// 获取用户粉丝列表
export async function getFolloweds(data: getFollows) {
  const res = await asyncAjax('get', '/user/followeds', { ...data });
  if (res.errorMessage) return { error: true, data: [] };
  else return { error: false, data: res.data.data };
}
// 关注用户
export async function followUser(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再关注');
    return false;
  }
  const res = await asyncAjax('get', '/follow', {
    id,
    t,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('网络波动请稍后再试');
    return false;
  } else if (res.data.data.code !== 200) {
    ElMessage.warning(
      res.data.data.msg ? res.data.data.msg : '网络波动请稍后再试'
    );
    return false;
  } else {
    const content = res.data.data.followContent
      ? res.data.data.followContent
      : t === 1
      ? '关注成功'
      : '取关成功';
    ElMessage.success(content);
    return true;
  }
}

// 获取用户等级信息
export async function getUserLevel() {
  const res = await asyncAjax('get', '/user/level');
  if (!res.errorMessage) {
    return res.data.data.data;
  } else return false;
}

export let city: any = null;
localAxios.get('src/assets/city.json').then((res) => {
  city = res.data;
});

//获取省份
export function getProvince(code: number | string) {
  if (city === null) return null;
  return city['86'][code] ? city['86'][code] : city['910000'][code];
}
export function getCity(
  code: number | string
): null | { province: string; city: string } {
  const pCode = (<any>code).slice(0, 2) + '0000';
  const province = getProvince(pCode);
  if (city === null || !province) return null;
  return {
    province,
    city: city[pCode][code] ? city[pCode][code] : '',
  };
}
