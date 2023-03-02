import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores/index';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
// 获取mv信息
export async function getMvDetail(id: string | number) {
  const res = await asyncAjax('get', '/mv/detail', {
    mvid: id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) return null;
  else return res.data.data.data;
}
// 获取视频信息
export async function getVideoDetail(id: string | number) {
  const res = await asyncAjax('get', '/video/detail', {
    id: id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) return null;
  else return res.data.data.data;
}
// 获取mv URL
export async function getMvURL(id: string | number, r: number = 720) {
  const res = await asyncAjax('get', '/mv/url', { id, r });
  if (res.errorMessage) {
    ElMessage.warning('获取mv播放地址失败');
    return null;
  } else return res.data.data.data;
}

// 获取视频 URl
export async function getVideoURL(id: string | number, r: number = 720) {
  const res = await asyncAjax('get', '/video/url', { id, r });
  if (res.errorMessage) {
    ElMessage.warning('获取视频播放地址失败');
    return null;
  } else return res.data.data.urls;
}

// 获取mv 点赞转发等数据
export async function getMvOther(id: string | number) {
  const res = await asyncAjax('get', '/mv/detail/info', {
    mvid: id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('获取mv相关数据失败');
    return null;
  } else return res.data.data;
}
// 获取视频点赞
export async function getVideoOther(id: string | number) {
  const res = await asyncAjax('get', '/video/detail/info', {
    vid: id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('获取视频相关数据失败');
    return null;
  } else return res.data.data.liked;
}

// 点赞mv
export async function likeMv(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/resource/like', {
    id,
    type: 1,
    t,
    timeStamp: Date.now(),
  });
  if (res.errorMessage || res.data.data.code !== 200) {
    ElMessage.warning('网络拥堵，请稍后再试');
  } else return true;
}
// 点赞视频
export async function likeVideo(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/resource/like', {
    id,
    type: 5,
    t,
    timeStamp: Date.now(),
  });
  if (res.errorMessage || res.data.data.code !== 200) {
    ElMessage.warning('网络拥堵，请稍后再试');
  } else return true;
}
// 收藏mv
export async function subMv(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/mv/sub', {
    mvid: id,
    t,
    timeStamp: Date.now(),
  });
  if (res.errorMessage || res.data.data.code !== 200) {
    ElMessage.warning('网络拥堵，请稍后再试');
  } else {
    ElMessage.success(t === 1 ? '收藏成功' : '取消收藏成功');
    return true;
  }
}
// 收藏视频
export async function subVideo(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/video/sub', {
    id: id,
    t,
    timeStamp: Date.now(),
  });
  if (res.errorMessage || res.data.data.code !== 200) {
    ElMessage.warning('网络拥堵，请稍后再试');
  } else {
    ElMessage.success(t === 1 ? '收藏成功' : '取消收藏成功');
    return true;
  }
}
// 获取推荐视频
export async function getRecoVideo(
  offset: number = 5
): Promise<{ msg: string; datas: any[]; hasMore: boolean }> {
  const res = await asyncAjax('get', '/video/timeline/recommend', {
    offset,
    timestamp: Date.now(),
  });
  const list: any[] = [];
  if (res.errorMessage || res.data.data.code !== 200) {
    return { msg: '获取推荐视频失败，请稍后再试', datas: [], hasMore: false };
  }
  res.data.data.datas.forEach((item: any) => {
    if (item.type === 1) list.push(item);
  });
  return {
    msg: res.data.data.msg,
    datas: list,
    hasMore: res.data.data.hasmore,
  };
}

// 获取大量MV
export async function getMvs(
  offset: number = 0,
  limit: number = 30,
  area: string = '全部',
  type: string = '全部',
  order: string = '上升最快'
) {
  const res = await asyncAjax('get', '/mv/all', {
    offset,
    limit,
    area,
    type,
    order,
  });
  if (!res.errorMessage) {
    return { more: res.data.data.hasMore, mvs: res.data.data.data };
  } else {
    return { more: false, mvs: [] };
  }
}

// 获取视频的热门标签
export async function getVideoHotTags() {
  const res = await asyncAjax('get', '/video/category/list');
  if (res.errorMessage) {
    ElMessage.warning('获取视频热门标签失败');
    return [];
  } else return res.data.data.data;
}
// 获取视频的全部标签
export async function getVideoAllTags() {
  const res = await asyncAjax('get', '/video/group/list');
  if (res.errorMessage) {
    ElMessage.warning('获取视频标签失败');
    return [];
  } else return res.data.data.data;
}

// 获取根据标签视频
export async function getVideos(id: number = 0, offset: number = 0) {
  let res;
  const videos = [];
  let more = false;
  for (let i = 0; i < 3; i++) {
    if (id === 0) {
      res = await asyncAjax('get', '/video/timeline/all', {
        offset: offset + i * 8,
      });
    } else
      res = await asyncAjax('get', '/video/group', {
        id,
        offset: offset + i * 8,
      });
    if (res.errorMessage) {
      break;
      more = false;
    }
    console.log(res);
    videos.push(...res.data.data.datas);
    more = res.data.data.hasmore;
    if (!more) {
      break;
    }
  }
  return { videos, more };
}
