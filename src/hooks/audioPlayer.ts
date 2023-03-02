import { asyncAjax } from '@/hooks/ajax';
import index from '@/stores';
import { playerStore } from '@/stores/audioPlayer';
import { storeToRefs } from 'pinia';
const { List, playingIndex, method } = storeToRefs(playerStore(index));
const { resetSong } = playerStore(index);
// 获取歌曲Url(仅返回url无其他信息)
export async function getSongUrl(id: string | number) {
  const res = await asyncAjax('get', '/song/url/v1', {
    id,
    level: 'lossless',
  });
  if (res.errorMessage) {
    return null;
  } else {
    return res.data.data.data[0];
  }
}
// 心动模式歌单
export async function getXindongList(
  id: string | number,
  pid: string | number
) {
  return await asyncAjax('get', '/playmode/intelligence/list', {
    id,
    pid,
  });
}
// 获取歌曲歌词
export async function getSongLyrics(id: string | number) {
  const res = await asyncAjax('get', '/lyric', { id });
  if (res.errorMessage) return null;
  else return res.data;
}
// 添加到下一首播放
export function addToNext(song: any) {
  if (playingIndex.value === -100) {
    playingIndex.value = 0;
  }
  const index = findSongIndex(song.id);
  if (index !== -1) {
    List.value.splice(index, 1);
  }
  List.value.splice(playingIndex.value + 1, 0, song);
}
// 播放全部（就是替换歌单内容）
export function replaceList(lists: any[]) {
  const tmp: any[] = [];
  const putSize = 50;
  if (lists.length === 0) playingIndex.value = -100;
  else {
    lists.forEach((item) => {
      tmp.push(item);
    });
    playingIndex.value = 0;
  }
  method.value = 1;
  List.value = [...tmp.slice(0, putSize)];
  resetSong();
  for (let i = putSize; i < tmp.length; i += putSize) {
    List.value.push(...tmp.slice(i, i + putSize));
  }
}
// 立即播放
export function playSong(song: any) {
  const index = findSongIndex(song.id);
  if (index !== -1) {
    playingIndex.value = index;
  } else {
    List.value.splice(playingIndex.value + 1, 0, song);
    if (playingIndex.value === -100) {
      playingIndex.value = 0;
    } else playingIndex.value++;
  }
}
// 下一首
export function toNext() {
  if (playingIndex.value === -100) {
    return;
  }
  if (method.value !== 3) {
    if (playingIndex.value + 1 >= List.value.length) {
      playingIndex.value = 0;
    } else playingIndex.value++;
  } else {
    const last = playingIndex.value;
    playingIndex.value = Math.floor(Math.random() * List.value.length);
    if (playingIndex.value === last) {
      playingIndex.value++;
    }
  }
}
// 上一首
export function toPrevious() {
  if (playingIndex.value === -100) {
    return;
  }
  if (method.value !== 3) {
    if (playingIndex.value - 1 < 0) {
      playingIndex.value = List.value.length - 1;
    } else playingIndex.value--;
  } else {
    const last = playingIndex.value;
    playingIndex.value = Math.floor(Math.random() * List.value.length);
    if (playingIndex.value === last) {
      playingIndex.value++;
    }
  }
}

function findSongIndex(id: number | string) {
  return List.value.findIndex((item) => {
    return item.id == id;
  });
}
