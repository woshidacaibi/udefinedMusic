<template>
  <li ref="current" class="clearfix" @dblclick="playSong(info)">
    <span class="operate">
      <b>{{ index >= 10 ? index : '0' + index }}</b>
      <i
        v-if="isLike >= 0"
        class="iconfont icon-xihuan"
        @click="like(false)"
      ></i>
      <i v-else class="iconfont icon-aixin" @click="like(true)"></i>
      <i
        class="iconfont icon-xiazai1"
        @click="downloadSong(info.id, info.name)"
        title="下载"
      ></i>
      <i
        title="下一首播放"
        class="iconfont icon-jiahao1"
        @click="addToNext(info)"
      ></i>
    </span>
    <span class="song-name">
      <div class="overflow name">
        <b :title="info.name" v-if="!info.noCopyrightRcmd">{{ info.name }}</b>
        <b :title="info.name + '(暂无版权)'" class="alia" v-else>{{
          info.name
        }}</b>
        <b class="alia" v-for="item in info.alia" :key="item" :title="item">
          ({{ item }})
        </b>
      </div>
      <router-link
        v-if="info.mv !== 0"
        :to="{ name: 'mv', query: { id: info.mv } }"
        class="tag"
        >MV</router-link
      >
      <div class="tag" v-if="info.fee === 1">VIP</div>
      <div class="tag" v-if="info.fee === 4">付费</div>
    </span>
    <span class="artist-name overflow">
      <template v-for="(item, index) in info.ar" :key="item.name">
        <router-link
          v-if="item.id !== 0"
          :title="item.name"
          :to="{ name: 'artist', query: { id: item.id } }"
          >{{ item.name }}</router-link
        >
        <b class="alia" v-else>{{ item.name }}</b>
        <b v-if="index !== info.ar.length - 1"> \&nbsp;</b>
      </template>
    </span>
    <span class="duration">{{ dayjs(info.dt).format('mm:ss') }}</span>
    <span class="hot">
      <div class="bgc-block">
        <div class="hot-block" :style="`width:${info.pop}%`"></div>
      </div>
    </span>
  </li>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { storeToRefs } from 'pinia';
import { computed, watch, ref, onMounted } from 'vue';
import { accountStore } from '@/stores/user';
import { likeSong, downloadSong } from '@/hooks/song';
import { addToNext, playSong } from '@/hooks/audioPlayer';
import { ElMessage } from 'element-plus';
import { playerStore } from '@/stores/audioPlayer';
const props = defineProps<{ info: any; index: string | number }>();
const { likeIdList } = storeToRefs(accountStore());
const { playingSong } = storeToRefs(playerStore());
const isLike = computed(() => {
  if (!likeIdList.value) {
    return -2;
  } else
    return likeIdList.value.findIndex((item: string | number) => {
      return item == props.info.id;
    });
});
const current = ref<HTMLElement | null>(null);
async function like(like: boolean) {
  if (isLike.value === -2) {
    ElMessage.warning('请登陆后再试');
    return;
  }
  const res = await likeSong(props.info.id, like);
  if (res === false) {
    return;
  } else if (res.errorMessage || res.data.data.code !== 200) {
    const message = like ? '喜欢失败，请稍后再试' : '取消喜欢失败，请稍后再试';
    ElMessage.warning(message);
  } else {
    const message = like ? '已添加到我喜欢' : '已从我喜欢中移除';
    ElMessage.success(message);
    if (like) likeIdList.value.push(props.info.id);
    else likeIdList.value.splice(isLike.value, 1);
  }
}
watch(playingSong, (newVal) => {
  if (newVal.id === props.info.id) {
    current.value?.classList.add('playing');
  } else current.value?.classList.remove('playing');
});
// noCopyrightRcmd None表示可播
onMounted(() => {
  if (playingSong.value.id === props.info.id) {
    current.value?.classList.add('playing');
  } else current.value?.classList.remove('playing');
});
</script>

<style scoped lang="less">
@import '@/assets/css&less/songlist.less';
.song-name {
  width: calc(100% * (5 / 12));
}
.operate {
  width: calc(100% / 6);
}
.artist-name {
  width: calc(100% / 6);
}
.duration {
  width: calc(100% / 12);
}
.hot {
  width: calc(100% / 6);
}
.bgc-block {
  width: 80%;
  background-color: var(--hover-color);
  margin-top: 10px;
  height: 10px;
  border-radius: 3px;
}
.hot-block {
  position: absolute;
  z-index: -1;
  height: 10px;
  background-color: var(--theme-color);
  border-radius: 3px;
}
</style>
