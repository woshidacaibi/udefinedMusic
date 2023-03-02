import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores/index';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
// 获取歌单信息
export async function getListDetail(id: string) {
  const res = await asyncAjax('get', '/playlist/detail', {
    id,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    return null;
  } else return res.data.data.playlist;
}
// 收藏或取消收藏歌单
export async function subscribeList(id: string, sub: boolean) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  let res;
  let message;
  if (sub) {
    message = '收藏成功';
    res = await asyncAjax('get', '/playlist/subscribe', {
      id,
      t: 1,
      timestamp: Date.now(),
    });
  } else {
    message = '取消收藏成功';
    res = await asyncAjax('get', '/playlist/subscribe', {
      id,
      t: 2,
      timestamp: Date.now(),
    });
  }
  if (res.errorMessage) {
    ElMessage({
      showClose: true,
      type: 'warning',
      message: '网络波动，请稍后再试',
    });
    return false;
  } else {
    ElMessage({
      showClose: true,
      type: 'success',
      message: message,
    });
    return true;
  }
}
// 获取完整歌单曲目
export async function getListSongs(id: string | number) {
  const limit = 1000;
  let offset = 0;
  const list = [];
  let res;
  do {
    res = await asyncAjax('get', '/playlist/track/all', {
      id,
      offset,
      limit,
    });
    if (res.errorMessage) {
      break;
    }
    list.push(...res.data.data.songs);
    offset += 1000;
  } while (res.data.data.songs.length === 1000);
  return { list, error: res.errorMessage };
}
// 获取歌单部分曲目
export async function getListPartSongs(
  id: string | number,
  limit: number = 15,
  offset: number = 0
) {
  const list = [];
  const res = await asyncAjax('get', '/playlist/track/all', {
    id,
    offset,
    limit,
  });
  list.push(...res.data.data.songs);
  return { list, error: res.errorMessage };
}
// 获取歌单收藏者
interface getSubData {
  id: number | string;
  limit?: number;
  offset?: number;
}
export async function getSubscribers(data: getSubData) {
  const res = await asyncAjax('get', '/playlist/subscribers', {
    ...data,
    timestamp: Date.now(),
  });
  return { data: res.data.data, error: res.errorMessage };
}
