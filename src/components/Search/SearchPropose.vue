<template>
  <div class="propose-container">
    <div class="top">
      <router-link :to="{ name: 'search', query: { kw: kw } }">
        搜“<b style="color: #ed4014">{{ kw }}</b
        >”相关内容
      </router-link>
    </div>
    <template v-if="suggests !== false && isLoad">
      <ul v-if="suggests.songs">
        <li class="tag"><i class="iconfont icon-maikefeng"></i> 单曲</li>
        <li
          v-for="item in suggests.songs"
          :key="item.id"
          class="item overflow"
          @click="playItemSong(item.id)"
          :title="item.name"
          v-html="
            keywordLight(item.name, kw) +
            ' - ' +
            keywordLight(item.artists[0].name, kw)
          "
        ></li>
      </ul>
      <ul v-if="suggests.artists">
        <li class="tag"><i class="iconfont icon-zuozhe1"></i> 歌手</li>
        <router-link
          v-for="item in suggests.artists"
          :key="item.id"
          :to="{ name: 'artist', query: { id: item.id } }"
          :title="item.name"
          class="item overflow"
        >
          <li v-html="keywordLight(item.name, kw)" />
        </router-link>
      </ul>
      <ul v-if="suggests.albums">
        <li class="tag"><i class="iconfont icon-zhuanji"></i> 专辑</li>
        <router-link
          v-for="item in suggests.albums"
          :key="item.id"
          :to="{ name: 'album', query: { id: item.id } }"
          class="item overflow"
          :title="item.name"
        >
          <li
            v-html="
              keywordLight(item.name, kw) +
              ' - ' +
              keywordLight(item.artist.name, kw)
            "
          />
        </router-link>
      </ul>
      <ul v-if="suggests.playlists">
        <li class="tag"><i class="iconfont icon-gedan"></i> 歌单</li>
        <router-link
          v-for="item in suggests.playlists"
          :key="item.id"
          :to="{ name: 'playlist', query: { id: item.id } }"
          class="item overflow"
          :title="item.name"
        >
          <li v-html="keywordLight(item.name, kw)" />
        </router-link>
      </ul>
    </template>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from 'vue';
import { getSuggest, keywordLight } from '@/hooks/search';
import { getSongDetail } from '@/hooks/song';
import { playSong } from '@/hooks/audioPlayer';

const props = withDefaults(defineProps<{ kw: string }>(), {
  kw: '',
});
const tipTimer = ref<number | null>(null);
const suggests = ref<any>(false);
const isLoad = ref(false);
watch(
  () => props.kw,
  async () => {
    if (tipTimer.value) {
      clearTimeout(tipTimer.value);
    }
    tipTimer.value = setTimeout(async () => {
      isLoad.value = false;
      if (props.kw !== '') suggests.value = await getSuggest(props.kw);
      tipTimer.value = null;
      isLoad.value = true;
    }, 300);
  },
  { immediate: true }
);
async function playItemSong(id: string | number) {
  const res = await getSongDetail(id);
  if (res !== null) playSong(res[0]);
}
</script>

<style scoped lang="less">
.top {
  line-height: 25px;
  padding: 5px 10px;
}
.propose-container {
}
.tag {
  padding: 0 10px;
  background-color: rgba(24, 24, 24, 0.13);
  line-height: 25px;
}
.item {
  padding-left: 15px;
  font-size: 14px;
  line-height: 30px;
  display: block;
  cursor: pointer;
}
.item:hover {
  background-color: var(--hover-color);
}
</style>
