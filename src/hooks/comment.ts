import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores';
import { storeToRefs } from 'pinia';
const { loginStatus, showLogin } = storeToRefs(loginStore(index));
interface comment {
  id: number | string;
  type: number;
  pageNo?: number;
  pageSize?: number;
  sortType?: number;
  cursor?: number | string;
}
interface floor {
  id: number | string;
  parentCommentId: number;
  type: number;
  time?: number;
  limit?: number;
}
interface like {
  id: number | string;
  cid: number;
  t: number;
  type: number;
}
interface replyData {
  id: number | string;
  type: number;
  t: number;
  content: string;
  commentId?: number;
}
// 获取评论
export async function getComment(data: comment) {
  const res = await asyncAjax('get', '/comment/new', {
    ...data,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    return {
      comments: [],
      hasMore: false,
      cursor: -1,
      total: -1,
      error: res.errorMessage,
    };
  }
  return {
    comments: res.data.data.data.comments,
    hasMore: res.data.data.data.hasMore,
    cursor: res.data.data.data.cursor,
    total: res.data.data.data.totalCount,
    error: res.errorMessage,
  };
}
// 获取楼层评论
export async function getFloorComment(data: floor) {
  const res = await asyncAjax('get', '/comment/floor', {
    ...data,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('网络波动，请稍后再试');
    return {
      comments: [],
      time: -1,
      hasMore: false,
    };
  }
  return {
    comments: res.data.data.data.comments,
    time: res.data.data.data.time,
    hasMore: res.data.data.data.hasMore,
  };
}
// 点赞评论
export async function likeComment(data: like) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/comment/like', {
    ...data,
    timestamp: Date.now(),
  });
  if (res.errorMessage) {
    ElMessage.warning('网络波动，请稍后再试');
    return false;
  }
  return true;
}
// 回复评论
export async function makeComment(data: replyData) {
  const res = await asyncAjax('get', '/comment', data);
  return res;
}
