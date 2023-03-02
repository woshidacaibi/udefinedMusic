<template>
  <div class="player-container" id="player">
    <div class="message clearfix">
      <div class="left">
        <div
          class="cover"
          @click="songDetailsShow = !songDetailsShow"
          v-show="playingSong.id !== -1"
        >
          <i v-if="!songDetailsShow" class="iconfont icon-RectangleCopy3"></i>
          <i v-else class="iconfont icon-RectangleCopy2"></i>
        </div>
        <load-img :src="playingSong.cover" />
      </div>
      <div class="center">
        <template v-if="playingIndex !== -100">
          <div :title="playingSong.name" class="overflow">
            {{ playingSong.name }}
          </div>
          <div class="artist-name overflow">
            <template
              v-for="(item, index) in playingSong.artists"
              :key="item.name"
            >
              <router-link
                v-if="item.id !== 0"
                :title="item.name"
                :to="{ name: 'artist', query: { id: item.id } }"
                >{{ item.name }}</router-link
              >
              <b class="alia" v-else>{{ item.name }}</b>
              <b v-if="index !== playingSong.artists.length - 1"> \&nbsp;</b>
            </template>
          </div>
        </template>
        <div v-else style="line-height: 60px">暂无音乐</div>
      </div>
      <div class="right" v-if="playingSong.id !== -1">
        <i
          v-if="isLike >= 0"
          class="iconfont icon-xihuan"
          @click="like(false)"
        ></i>
        <i v-else class="iconfont icon-aixin" @click="like(true)"></i>
        <i
          class="iconfont icon-xiazai1"
          @click="downloadSong(playingSong.id, playingSong.name)"
          title="下载"
        ></i>
      </div>
    </div>
    <div class="control-wide">
      <div class="buttons">
        <el-tooltip :content="playMethod" placement="top">
          <i
            @click="changeMethod"
            v-if="method === 1"
            class="iconfont icon-liebiaoxunhuan"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 2"
            class="iconfont icon-danquxunhuan"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 3"
            class="iconfont icon-suijibofang"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 4"
            class="iconfont icon-icon_xindong"
          ></i>
        </el-tooltip>
        <theme-button @click="toPrevious" circle :disabled="List.length <= 1">
          <i class="iconfont icon-shangyishou"></i>
        </theme-button>
        <theme-button
          circle
          :size="'large'"
          :disabled="!musicSrc"
          v-if="pause"
          @click="pause = false"
        >
          <i class="iconfont icon-bofang1"></i>
        </theme-button>
        <theme-button
          circle
          :size="'large'"
          @click="pause = true"
          :disabled="!musicSrc"
          v-if="!pause"
          ><i class="iconfont icon-zanting1"></i>
        </theme-button>
        <theme-button circle @click="toNext" :disabled="List.length <= 1">
          <i class="iconfont icon-xiayishou"></i>
        </theme-button>
        <i
          class="iconfont"
          style="font-size: 18px"
          @click="moveLyricsShow = !moveLyricsShow"
          >词</i
        >
      </div>
      <div class="process-bar">
        <span>{{ currentTime }}</span>
        <el-slider
          :disabled="!musicSrc"
          v-model="process"
          :show-tooltip="false"
          @change="changeTime"
          @input="dragSlider"
        ></el-slider>
        <span>{{ duration }}</span>
      </div>
    </div>
    <div class="control-narrow">
      <div class="process-bar">
        <el-progress
          type="dashboard"
          :width="65"
          :percentage="Math.floor(process)"
          :color="colors"
        >
          <template #default="{ percentage }">
            <div class="percentage-value">{{ currentTime }}/{{ duration }}</div>
            <div class="percentage-value">{{ percentage }}%</div>
          </template>
        </el-progress>
        <div style="float: left">
          <theme-button
            :icon="Minus"
            square
            size="small"
            @click="decrease"
          ></theme-button>
          <theme-button
            @click="increase"
            :icon="Plus"
            square
            size="small"
          ></theme-button>
        </div>
      </div>
      <div class="buttons">
        <el-tooltip :content="playMethod" placement="top">
          <i
            @click="changeMethod"
            v-if="method === 1"
            class="iconfont icon-liebiaoxunhuan"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 2"
            class="iconfont icon-danquxunhuan"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 3"
            class="iconfont icon-suijibofang"
          ></i>
          <i
            @click="changeMethod"
            v-if="method === 4"
            class="iconfont icon-icon_xindong"
          ></i>
        </el-tooltip>
        <theme-button @click="toPrevious" circle :disabled="List.length <= 1">
          <i class="iconfont icon-shangyishou"></i>
        </theme-button>
        <theme-button
          circle
          :size="'large'"
          :disabled="!musicSrc"
          v-if="pause"
          @click="pause = false"
        >
          <i class="iconfont icon-bofang1"></i>
        </theme-button>
        <theme-button
          circle
          :size="'large'"
          @click="pause = true"
          :disabled="!musicSrc"
          v-if="!pause"
          ><i class="iconfont icon-zanting1"></i>
        </theme-button>
        <theme-button circle @click="toNext" :disabled="List.length <= 1">
          <i class="iconfont icon-xiayishou"></i>
        </theme-button>
        <i
          class="iconfont"
          style="font-size: 18px"
          @click="moveLyricsShow = !moveLyricsShow"
          >词</i
        >
      </div>
    </div>
    <div class="other">
      <div class="volume">
        <template v-if="!mute">
          <i
            @click="mute = true"
            class="iconfont icon-yinliang"
            v-show="volume !== 0"
          ></i>
          <i
            @click="mute = true"
            class="iconfont icon-24gl-volumeZero"
            v-show="volume === 0"
          ></i>
        </template>
        <i
          @click="mute = false"
          class="iconfont icon-24gl-volumeCross"
          v-else-if="mute"
        ></i>
        <el-slider v-model="volume" :show-tooltip="true"></el-slider>
      </div>
      <i
        @click="playerListShow = !playerListShow"
        class="iconfont icon-gedan"
      ></i>
    </div>
  </div>
  <audio :src="musicSrc" ref="player" id="audio-player" loop></audio>
</template>

<script lang="ts" setup>
import { playerStore } from '@/stores/audioPlayer';
import { loginStore } from '@/stores/login';
import { accountStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { likeSong, downloadSong } from '@/hooks/song';
import { toNext, toPrevious, getXindongList } from '@/hooks/audioPlayer';
import { Minus, Plus } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import ThemeButton from '@/basic/ThemeButton.vue';
const {
  storeLimit,
  playingSong,
  musicSrc,
  pause,
  volume,
  playerTime,
  List,
  normalList,
  method,
  playingIndex,
  mute,
  playerListShow,
  songDetailsShow,
  moveLyricsShow,
} = storeToRefs(playerStore());
const { getPlayingUrl, resetSong } = playerStore();
const { loginStatus } = storeToRefs(loginStore());
const { likeIdList, createdLists } = storeToRefs(accountStore());

const player = ref<HTMLAudioElement | null>(null);
const process = ref(0);
const currentTime = ref<string>('0:00');
const duration = computed(() => {
  return dayjs(playingSong.value.duration).format('m:ss');
});
const playMethod = computed(() => {
  switch (method.value) {
    case 1:
      return '列表循环';
    case 2:
      return '单曲循环';
    case 3:
      return '随机播放';
    case 4:
      return '心动模式';
  }
  return '';
});
let waitLoadTimer: any;
let lastIndex: number = localStorage.getItem('lastIndex')
  ? parseInt(localStorage.getItem('lastIndex')!)
  : 0;
let lastVolume: number = volume.value;
// 第一次打开
let firstOpen = false;
//仪表盘颜色
const colors = [
  { color: '#5cb87a', percentage: 100 },
  { color: '#e6a23c', percentage: 80 },
  { color: '#f56c6c', percentage: 60 },
  { color: '#6f7ad3', percentage: 40 },
  { color: '#1989fa', percentage: 20 },
];

watch(pause, (newVal) => {
  if (waitLoadTimer) {
    clearInterval(waitLoadTimer);
  }
  if (player.value?.readyState) {
    newVal ? player.value?.pause() : player.value?.play();
  } else {
    // 如果没有加载完成就等待加载完成后再操作
    waitLoadTimer = setInterval(() => {
      if (player.value?.readyState) {
        newVal ? player.value?.pause() : player.value?.play();
        clearInterval(waitLoadTimer);
      }
    }, 50);
  }
});
watch(musicSrc, (newVal) => {
  if (newVal) {
    if (!firstOpen) pause.value = false;
    else {
      firstOpen = false;
    }
  }
});
watch(
  method,
  (newVal, oldValue) => {
    if (newVal === 4 && loginStatus.value) {
      getDokiList();
    }
    if (oldValue === 4 && loginStatus.value) {
      List.value = normalList.value;
      playingIndex.value = lastIndex;
      resetSong();
    }
    localStorage.setItem('method', method.value.toString());
  },
  { immediate: true }
);
watch(volume, (newVal) => {
  if (player.value) {
    player.value.volume = newVal / 100;
  }
  if (volume.value !== 0) {
    mute.value = false;
  }
  localStorage.setItem('volume', volume.value.toString());
});
watch(mute, (newVal) => {
  if (newVal) {
    lastVolume = volume.value;
    volume.value = 0;
  } else {
    volume.value = lastVolume;
  }
  localStorage.setItem('mute', mute.value.toString());
});
watch(playingIndex, (newVal) => {
  if (newVal)
    if (newVal === -100) {
      process.value = 0;
      songDetailsShow.value = false;
    }
});
//长进度条
function dragSlider(val: number) {
  if (player.value) {
    player.value.removeEventListener('timeupdate', watchTime);
    const time = (val / 100) * playingSong.value.duration;
    currentTime.value = dayjs(time).format('m:ss');
  }
}
function changeTime(val: number) {
  if (player.value) {
    player.value.currentTime = val * (playingSong.value.duration / 100000);
    playerTime.value = player.value.currentTime;
    player.value.addEventListener('timeupdate', watchTime);
  }
}
//短进度条
function increase() {
  if (player.value) {
    player.value.removeEventListener('timeupdate', watchTime);
    if (playingSong.value.duration / 1000 <= player.value.currentTime + 10) {
      player.value.currentTime = playingSong.value.duration / 1000 - 1;
    } else player.value.currentTime += 10;
    playerTime.value = player.value.currentTime;
    player.value.addEventListener('timeupdate', watchTime);
  }
}
function decrease() {
  if (player.value) {
    player.value.removeEventListener('timeupdate', watchTime);
    if (player.value.currentTime - 10 < 0) {
      player.value.currentTime = 0;
    } else player.value.currentTime -= 10;
    playerTime.value = player.value.currentTime;
    player.value.addEventListener('timeupdate', watchTime);
  }
}
// 心动模式歌单
async function getDokiList() {
  if (playingSong.value.id === -1) {
    ElMessage.warning('当前无音乐，无法开启心动模式');
    changeMethod();
    return;
  }
  if (loginStatus.value) {
    lastIndex = playingIndex.value;
    localStorage.setItem('lastIndex', lastIndex.toString());
    ElMessage.info('开启心动模式中');
    const res = await getXindongList(
      playingSong.value.id,
      createdLists.value[0]?.id
    );
    if (res.errorMessage) {
      ElMessage.warning('开启心动模式失败，请稍后再试');
      changeMethod();
    } else if (method.value === 4) {
      ElMessage.success('心动模式开启成功');
      normalList.value = List.value;
      localStorage.setItem(
        'normalList',
        JSON.stringify(normalList.value.slice(0, storeLimit.value))
      );
      List.value = [];
      res.data.data.data.forEach((item: any) => {
        (List.value as any).push({ ...item.songInfo });
      });
      playingIndex.value = 0;
      resetSong();
    }
  }
}

function watchTime(e: Event) {
  const time = (e as any).target!.currentTime * 1000;
  if (playingSong.value.duration === 0) process.value = 0;
  else process.value = (time / playingSong.value.duration) * 100;
  currentTime.value = dayjs(time).format('m:ss');
  playerTime.value = player.value!.currentTime;
  if (time + 400 >= playingSong.value.duration) {
    if (method.value === 2 || List.value.length === 1) {
      process.value = 0;
      return;
    } else {
      pause.value = true;
      toNext();
    }
  }
}
function changeMethod() {
  method.value++;
  if (method.value === 5) {
    method.value = 1;
  }
  if (!loginStatus.value && method.value === 4) method.value = 1;
}

const isLike = computed(() => {
  if (!likeIdList.value) {
    return -2;
  } else
    return likeIdList.value.findIndex((item: string | number) => {
      return item == playingSong.value.id;
    });
});
async function like(like: boolean) {
  if (isLike.value === -2) {
    ElMessage.warning('请登陆后再试');
    return;
  }
  const res = await likeSong(playingSong.value.id, like);
  if (res === false) {
    return;
  }
  if (res.errorMessage || res.data.data.code !== 200) {
    const message = like ? '喜欢失败，请稍后再试' : '取消喜欢失败，请稍后再试';
    ElMessage.warning(message);
  } else {
    const message = like ? '已添加到我喜欢' : '已从我喜欢中移除';
    ElMessage.success(message);
    if (like) likeIdList.value.push(playingSong.value.id);
    else likeIdList.value.splice(isLike.value, 1);
  }
}
onMounted(() => {
  pause.value = true;
  player.value!.addEventListener('timeupdate', watchTime);
  if (player.value) {
    player.value.volume = volume.value / 100;
  }
  if (playingSong.value.id !== -1) {
    firstOpen = true;
    getPlayingUrl(playingSong.value);
  }
});
</script>

<style scoped lang="less">
.player-container {
  width: 100%;
  height: 60px;
  display: flex;
}
.message {
  width: 240px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid var(--hover-color);
}
.control-wide {
  flex: 1;
  height: 100%;
  .process-bar {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    height: 18px;
    span {
      width: 10%;
      float: left;
      padding: 0 10px;
      line-height: 18px;
      text-align: left;
    }
    span:first-child {
      text-align: right;
    }
  }
}
.control-narrow {
  display: none;
  flex: 1;
  height: 100%;
  justify-content: space-evenly;
  .process-bar {
    float: left;
    .el-progress {
      float: left;
    }
    button {
      display: block;
      text-align: center;
      margin: 3px;
    }
  }
  .buttons {
    height: 100%;
    line-height: 50px;
    float: left;
    margin: 0;
    width: 240px;
    flex-shrink: 0;
  }
}
.other {
  width: 180px;
  height: 100%;
  //border-left: 1px solid var(--hover-color);
  .icon-gedan {
    float: right;
    line-height: 60px;
    margin-right: 20px;
    font-size: 23px;
  }
  i {
    transition: color 0.3s;
  }
  i:hover {
    color: var(--theme-color);
  }
}
.buttons {
  margin: 0 auto;
  text-align: center;
  > i {
    margin: 0 15px;
    font-size: 20px;
    transition: color 0.3s;
  }
  > i:hover {
    color: var(--theme-color);
  }
}
.volume {
  float: left;
  height: 60px;
  line-height: 60px;
  margin-left: 5px;
  > i {
    float: left;
    font-size: 22px;
  }
  .el-slider {
    margin-top: 20px;
    margin-left: 8px;
    width: 80px;
  }
}

.left {
  float: left;
  width: 40px;
  height: 40px;
  margin: 10px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
}
.cover {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0;
  left: 0;
  z-index: 1;
  background: transparent;
  i {
    font-size: 40px;
    color: white;
    display: none;
  }
  .icon-RectangleCopy2 {
    line-height: 40px;
  }
  .icon-RectangleCopy3 {
    line-height: 35px;
  }
}
.left:hover {
  .cover {
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    transition: all 0.3s;
    i {
      display: block;
    }
  }
}
.center {
  float: left;
  width: 140px;
  height: 100%;
  > div {
    height: 30px;
  }
  > div:first-child {
    line-height: 35px;
  }
  .artist-name {
    line-height: 30px;
    a:hover {
      color: var(--theme-color);
      transition: color 0.3s;
    }
  }
}
.right {
  float: left;
  width: 30px;
  i {
    font-size: 20px;
    line-height: 30px;
    transition: color 0.3s;
    display: block;
  }
  i:hover {
    color: var(--theme-color);
  }
  .icon-xihuan {
    color: var(--theme-color);
  }
}
.el-slider {
  height: 18px;
  float: left;
  width: 80%;
  --el-slider-runway-bg-color: var(--hover-color);
}
.percentage-value {
  color: var(--theme-color);
  margin: 2px;
  font-size: 10px;
}
@media screen and (max-width: 1000px) {
  .control-wide {
    display: none;
  }
  .control-narrow {
    display: flex;
  }
}
@media screen and (max-width: 840px) {
  .control-narrow {
    .process-bar {
      button {
        display: none;
      }
    }
  }
}
</style>
