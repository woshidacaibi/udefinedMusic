<template>
  <div class="reco-list">
    <div class="blur-header">
      <div class="curtain"></div>
      <template v-if="!loading && lists.length > 0">
        <img :src="lists[0].coverImgUrl" />
        <playlist-preview-item-t3
          class="first"
          :info="lists[0]"
        ></playlist-preview-item-t3>
        <router-link
          :to="{ name: 'playlist', query: { id: lists[0].id } }"
          class="first-name"
        >
          {{ lists[0].name }}
        </router-link>
        <div class="tip"><i class="iconfont icon-huangguan"></i> 优质歌单</div>
      </template>
    </div>
    <ul class="classify">
      <h3><i class="iconfont icon-huore"></i> 热门标签</h3>
      <li v-if="tag === '全部'" class="active">全部</li>
      <li v-else @click="tag = '全部'">全部</li>
      <template v-for="item in hotTags" :key="item.id">
        <li v-if="tag === item.name" class="active">{{ item.name }}</li>
        <li v-else @click="tag = item.name">{{ item.name }}</li>
      </template>
      <li class="more" @click="extendShow = true" v-if="!extendShow">
        更多标签<i class="iconfont icon-xiangxia2"></i>
      </li>
      <li class="more" @click="extendShow = false" v-else>
        收起<i class="iconfont icon-xiangshang2"></i>
      </li>
    </ul>
    <div class="other-tags-container">
      <transition name="extend">
        <div class="extend" v-if="extendShow">
          <ul class="classify">
            <h3><i class="iconfont icon-diqiu"></i> 语种</h3>
            <template v-for="item in c0" :key="item.id">
              <li v-if="tag === item.name" class="active">{{ item.name }}</li>
              <li v-else @click="tag = item.name">{{ item.name }}</li>
            </template>
          </ul>
          <ul class="classify">
            <h3><i class="iconfont icon-gangqin"></i> 风格</h3>
            <template v-for="item in c1" :key="item.id">
              <li v-if="tag === item.name" class="active">{{ item.name }}</li>
              <li v-else @click="tag = item.name">{{ item.name }}</li>
            </template>
          </ul>
          <ul class="classify">
            <h3><i class="iconfont icon-kafei"></i> 场景</h3>
            <template v-for="item in c2" :key="item.id">
              <li v-if="tag === item.name" class="active">{{ item.name }}</li>
              <li v-else @click="tag = item.name">{{ item.name }}</li>
            </template>
          </ul>
          <ul class="classify">
            <h3><i class="iconfont icon-smiling"></i> 情感</h3>
            <template v-for="item in c3" :key="item.id">
              <li v-if="tag === item.name" class="active">{{ item.name }}</li>
              <li v-else @click="tag = item.name">{{ item.name }}</li>
            </template>
          </ul>
          <ul class="classify">
            <h3><i class="iconfont icon-jiaqileixing"></i> 主题</h3>
            <template v-for="item in c4" :key="item.id">
              <li v-if="tag === item.name" class="active">{{ item.name }}</li>
              <li v-else @click="tag = item.name">{{ item.name }}</li>
            </template>
          </ul>
        </div>
      </transition>
    </div>
    <div class="grid-container">
      <template v-for="item in lists.slice(1)" :key="item.id">
        <playlist-preview-item-t3 :info="item"></playlist-preview-item-t3>
      </template>
    </div>
  </div>
  <loading-tip :is-load="!loading"></loading-tip>
  <no-more-tip v-if="!hasMore"></no-more-tip>
</template>

<script lang="ts" setup>
import { getHotTag, getAllTag } from '@/hooks/home';
import { ref, computed, watch } from 'vue';
import { getHightLightList } from '@/hooks/home';
import { findScroll } from '@/hooks/scroll';
import PlaylistPreviewItemT3 from '@/components/SingleItem/playlist/playlistPreviewItemT3.vue';

const tag = ref('全部');
const hotTags = ref<any[]>([]);
const allTags = ref<any[]>([]);
const extendShow = ref(false);
const lists = ref<any[]>([]);
const hasMore = ref(true);
const before = ref(0);
const loading = ref(true);
const scroll = findScroll('main');

async function initTags() {
  hotTags.value = await getHotTag();
  allTags.value = await getAllTag();
}
initTags();

watch(
  tag,
  async () => {
    loading.value = true;
    before.value = 0;
    hasMore.value = true;
    lists.value = [];
    const res = await getHightLightList(tag.value, before.value, 60);
    hasMore.value = res.more;
    lists.value = res.list;
    before.value = res.before;
    loading.value = false;
  },
  { immediate: true }
);
watch(
  () => scroll!.isBottom,
  async () => {
    if (scroll!.isBottom && !loading.value && hasMore.value) {
      loading.value = true;
      const res = await getHightLightList(tag.value, before.value);
      hasMore.value = res.more;
      lists.value.push(...res.list);
      before.value = res.before;
      loading.value = false;
    }
  }
);
const c0 = computed(() => {
  return allTags.value.filter((item: any) => {
    return item.category === 0;
  });
});
const c1 = computed(() => {
  return allTags.value.filter((item: any) => {
    return item.category === 1;
  });
});
const c2 = computed(() => {
  return allTags.value.filter((item: any) => {
    return item.category === 2;
  });
});
const c3 = computed(() => {
  return allTags.value.filter((item: any) => {
    return item.category === 3;
  });
});
const c4 = computed(() => {
  return allTags.value.filter((item: any) => {
    return item.category === 4;
  });
});
</script>

<style scoped lang="less">
.reco-list {
  margin: 15px;
}

.blur-header {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  .curtain {
    width: 100%;
    height: 100%;
    background-color: var(--hover-more-color);
    z-index: 1;
    position: absolute;
    border-radius: 10px;
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
    filter: blur(10px);
  }
  .first-name {
    position: absolute;
    z-index: 2;
    top: 90px;
    color: white;
    left: 200px;
    font-size: 20px;
    transition: color 0.5s;
  }
  .first-name:hover {
    color: var(--theme-color);
  }
}
.tip {
  position: absolute;
  z-index: 2;
  top: 60px;
  color: #e7aa5a;
  left: 200px;
  width: 100px;
  text-align: center;
  border: 1px solid #e7aa5a;
}
.first {
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
  height: 180px;
  width: 180px;
  overflow: hidden;
}
.extend {
  transition: all 0.5s;
  border: 1px solid var(--theme-color);
  border-radius: 10px;
  background-color: var(--container-color);
}
.other-tags-container {
  position: absolute;
  overflow: hidden;
  z-index: 5;
}
.extend-enter-active {
  animation: slideDown 0.5s;
}
.extend-leave-active {
  animation: slideUp 0.5s;
}
@keyframes slideDown {
  0% {
    display: block;
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes slideUp {
  0% {
    transform: translateY(0);
    display: block;
  }
  100% {
    transform: translateY(-100%);
    display: none;
  }
}
.grid-container {
  display: grid;
  max-width: 1000px;
  margin: 50px auto;
}
@media screen and (max-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(5, 1fr);
  }
}
@media screen and (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(6, 1fr);
  }
}
.classify {
  margin: 10px 0;
  h3 {
    margin-left: 5px;
    color: var(--theme-color);
    i {
      cursor: default;
    }
  }
  li {
    margin: 3px 5px;
    display: inline-block;
    text-align: center;
    padding: 0 10px;
    transition: all 0.5s;
    letter-spacing: 2px;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    border-radius: 3px;
  }
  li:hover {
    color: var(--theme-color);
    background-color: var(--hover-color);
  }
  .active {
    color: white;
    background-color: var(--theme-color);
  }
  .active:hover {
    background-color: var(--theme-color);
    color: white;
  }
  .more {
    //position: absolute;
    //top: 50%;
    //right: 0;
    color: var(--hover-more-color);
  }
}
</style>
