import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import cover from '@/assets/img/player/default_cover.jpg';
import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
export const playerStore = defineStore('playerStore', () => {
  // 存储限制
  const storeLimit = ref(500);
  const blockSize = ref(0);
  // 两个面板的显示
  const playerListShow = ref(false);
  const songDetailsShow = ref(false);
  const moveLyricsShow = ref(false);
  // 历史数据
  const historyList = localStorage.getItem('List')
    ? JSON.parse(localStorage.getItem('List')!)
    : [];
  const historyNormalList = localStorage.getItem('normalList')
    ? JSON.parse(localStorage.getItem('normalList')!)
    : [];
  const historyMethod = localStorage.getItem('method')
    ? parseInt(localStorage.getItem('method')!)
    : 1;
  const historyIndex = localStorage.getItem('playingIndex')
    ? parseInt(localStorage.getItem('playingIndex')!)
    : -100;
  const historyMute = localStorage.getItem('mute')
    ? localStorage.getItem('mute')! === 'true'
    : false;
  const historyVolume = localStorage.getItem('volume')
    ? parseInt(localStorage.getItem('volume')!)
    : 10;
  // 空
  const errorSong = {
    id: -1,
    cover: cover,
    alia: [],
    name: '',
    artists: [],
    duration: 0,
    album: {},
  };
  const errorLyrics = {
    time: '',
    text: '暂无歌词',
    translate: null,
    roma: null,
    timeNum: 0,
  };
  // 播放列表
  const List = ref<[] | any[]>(historyList);
  const normalList = ref<[] | any[]>(historyNormalList);
  // 正在播放的歌曲信息 -100表示列表为空
  const playingIndex = ref<number>(historyIndex);
  // 正在播放的歌曲信息
  const playingSong = ref<any>(errorSong);
  watch(
    playingIndex,
    (newVal) => {
      resetSong();
      const size = parseInt((newVal / storeLimit.value).toString());
      if (size !== blockSize.value) {
        blockSize.value = size;
        localStorage.setItem(
          'List',
          JSON.stringify(
            List.value.slice(
              size * storeLimit.value,
              (size + 1) * storeLimit.value
            )
          )
        );
      }
      localStorage.setItem(
        'playingIndex',
        (newVal % storeLimit.value).toString()
      );
    },
    { immediate: true }
  );
  watch(
    List,
    (newVal) => {
      if (newVal.length === 0) {
        playingIndex.value = -100;
      }
      if (newVal.length > storeLimit.value) {
        localStorage.setItem(
          'List',
          JSON.stringify(List.value.slice(0, storeLimit.value))
        );
      } else localStorage.setItem('List', JSON.stringify(List.value));
    },
    { immediate: true, deep: true }
  );
  watch(playingSong, getPlayingUrl);
  const musicSrc = ref<string | null>(null);
  // 其他属性
  const volume = ref(historyVolume);
  const mute = ref(historyMute);
  const pause = ref(false);
  const method = ref<number>(historyMethod);
  const playerTime = ref<number>(0);
  const lyrics = ref<any>([errorLyrics]);
  const cLyrics = ref<any>(errorLyrics);
  // 获取地址的防抖
  let urlTimer: any = null;
  return {
    storeLimit,
    blockSize,
    playerListShow,
    songDetailsShow,
    moveLyricsShow,
    volume,
    mute,
    List,
    lyrics,
    normalList,
    playingSong,
    playingIndex,
    musicSrc,
    pause,
    method,
    playerTime,
    cLyrics,
    getPlayingUrl,
    resetSong,
  };
  function getPlayingUrl(newVal: any) {
    musicSrc.value = null;
    lyrics.value = null;
    pause.value = true;
    if (urlTimer) clearTimeout(urlTimer);
    urlTimer = setTimeout(async () => {
      if (playingIndex.value === -100) {
        localStorage.setItem(
          'playingIndex',
          (playingIndex.value % storeLimit.value).toString()
        );
        return;
      }
      const res: any = await getSongUrl(newVal.id);
      if (res === null || res.url === null) {
        ElMessage.warning('获取' + playingSong.value.name + '的音频资源失败');
        List.value.splice(playingIndex.value, 1);
        resetSong();
      } else {
        musicSrc.value = res.url;
      }
      if (res.freeTrialInfo) {
        ElMessage.info('vip资源仅支持30s试听');
        playingSong.value.duration = 30000;
      }
      setLyrics(await getSongLyrics(playingSong.value.id));
      localStorage.setItem(
        'playingIndex',
        (playingIndex.value % storeLimit.value).toString()
      );
    }, 200);
  }
  function resetSong() {
    if (playingIndex.value === -100) {
      playingSong.value = errorSong;
    } else {
      const tmp = List.value[playingIndex.value];
      playingSong.value = {
        id: tmp.id,
        cover: tmp.al.picUrl ? tmp.al.picUrl + '?param=100y100' : cover,
        alia: tmp.alia,
        name: tmp.name,
        artists: tmp.ar,
        duration: tmp.dt,
        album: tmp.al,
      };
    }
  }
  function setLyrics(data: any) {
    let lrc = null;
    let tlyric = null;
    let romalrc = null;
    if (data === null) {
      lyrics.value = [errorLyrics];
      cLyrics.value = errorLyrics;
      return;
    }
    if (data.lrc) lrc = formatLyric(data.lrc);
    if (data.tlyric) tlyric = formatLyric(data.tlyric);
    if (data.romalrc) romalrc = formatLyric(data.romalrc);
    let i = 0;
    let j = 0;
    let k = 0;
    const res = [];
    if (lrc) {
      for (i = 0; i < lrc.length; i++) {
        let translate = null;
        let roma = null;
        if (tlyric && j < tlyric.length) {
          if (lrc[i].timeNum === tlyric[j].timeNum) {
            translate = tlyric[j].text;
            j++;
          } else {
            while (tlyric[j].timeNum < lrc[i].timeNum) {
              j++;
            }
            if (lrc[i].timeNum === tlyric[j].timeNum) {
              translate = tlyric[j].text;
              j++;
            }
          }
        }
        if (romalrc && k < romalrc.length) {
          if (lrc![i].timeNum === romalrc[k].timeNum) {
            roma = romalrc[k].text;
            k++;
          } else {
            while (romalrc[k].timeNum < lrc[i].timeNum) {
              k++;
            }
            if (lrc![i].timeNum === romalrc[k].timeNum) {
              roma = romalrc[k].text;
              k++;
            }
          }
        }
        res.push({ ...lrc[i], translate, roma });
      }
    }
    if (res[res.length - 1] && res[res.length - 1].time === '99:00') {
      res[res.length - 1].timeNum = res[res.length - 2]
        ? res[res.length - 2].timeNum + 1
        : 1;
    }
    lyrics.value = res;
    if (res[0]) cLyrics.value = res[0];
    else cLyrics.value = errorLyrics;
  }
});
// 返回url 及url相关信息
async function getSongUrl(id: string | number) {
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
export async function getSongLyrics(id: string | number) {
  const res = await asyncAjax('get', '/lyric', { id });
  if (res.errorMessage) return null;
  else return res.data.data;
}
function formatLyric(data: any) {
  const tmp = data.lyric.split('\n');
  const res: any[] = [];
  tmp.forEach((item: any) => {
    if (item) {
      const three = item.split(']');
      if (three.length === 1) {
        res.push({ time: '', text: three[0], timeNum: 0 });
      } else {
        const time = three[0].split('[')[1];
        if (!/by:/.test(time)) {
          const arr = time.split(':');
          let timeNum = parseInt(arr[0]) * 60 + parseFloat(arr[1]);
          timeNum = parseFloat(timeNum.toFixed(3));
          res.push({ time: time.split('.')[0], text: three[1], timeNum });
        }
      }
    }
  });
  if (res.length === 0) return null;
  return res;
}
