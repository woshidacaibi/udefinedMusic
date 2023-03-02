import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores/index';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
import dayjs from 'dayjs';
// 获取专辑信息
export async function getAlbumDetail(id: string | number) {
  const res = await asyncAjax('get', '/album', { id, timestamp: Date.now() });
  if (res.errorMessage) {
    ElMessage.warning('获取信息失败');
    return { album: null, songs: [] };
  } else return res.data.data;
}
// 收藏专辑
export async function subscribeAlbum(id: string | number, t: number) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/album/sub', {
    id,
    t,
    timestamp: Date.now(),
  });
  if (!res.errorMessage && res.data.data.code === 200) {
    const tip = t === 1 ? '收藏成功' : '取消收藏成功';
    ElMessage.success(tip);
    return true;
  } else {
    ElMessage.warning('网络波动，请稍后再试');
    return false;
  }
}
// 全部新碟(500)
export async function getNewAlbum(
  offset: number = 0,
  limit: number = 30,
  area: string = 'ALL'
) {
  const res = await asyncAjax('get', '/album/new', {
    offset,
    limit,
    area,
  });
  if (!res.errorMessage && res.data.data.code === 200) {
    return res.data.data.albums;
  } else {
    return [];
  }
}
