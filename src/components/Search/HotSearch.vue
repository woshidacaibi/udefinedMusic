<template>
  <div class="hot-search-container">
    <template v-if="SearchHistory.length !== 0">
      <h3>
        历史搜索记录
        <span class="delete-all" @click="deleteAll"
          >清空<i class="iconfont icon-icon1"></i
        ></span>
      </h3>
      <template v-for="item in SearchHistory" :key="item">
        <router-link
          :to="{ name: 'search', query: { kw: item } }"
          class="history-block"
        >
          {{ item }}
          <i
            class="iconfont icon-guanbi"
            @click.prevent="deleteSingele(item)"
          ></i>
        </router-link>
      </template>
    </template>
    <h3>网易云音乐热搜</h3>
    <template v-if="isLoad && hots.length > 0">
      <template v-for="(item, index) in hots" :key="index">
        <router-link
          :to="{ name: 'search', query: { kw: item.first } }"
          class="hot-item overflow"
          >{{ index + 1 }} {{ item.first }}</router-link
        >
      </template>
    </template>
    <template v-else>
      <error-tip></error-tip>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getHotSearch } from '@/hooks/search';
import { useRoute } from 'vue-router';
const isLoad = ref(false);
const hots = ref<any[]>([]);
const route = useRoute();
async function getHots() {
  isLoad.value = false;
  hots.value = await getHotSearch();
  isLoad.value = true;
}
const SearchHistory = ref([]);
if (localStorage.getItem('search')) {
  SearchHistory.value = JSON.parse(localStorage.getItem('search')!);
}
watch(
  () => route.query,
  () => {
    if (route.name === 'search') {
      if (localStorage.getItem('search')) {
        const history = JSON.parse(localStorage.getItem('search')!);
        const i = history.findIndex((item: any) => {
          return item === route.query.kw;
        });
        if (i !== -1) history.splice(i, 1);
        history.unshift(route.query.kw);
        if (history.length > 10) {
          history.slice(history.length - 1, 1);
        }
        localStorage.setItem('search', JSON.stringify(history));
      } else {
        localStorage.setItem('search', JSON.stringify([route.query.kw]));
      }
      SearchHistory.value = JSON.parse(localStorage.getItem('search')!);
    }
  },
  { immediate: true }
);
function deleteAll() {
  localStorage.removeItem('search');
  SearchHistory.value = [];
}
function deleteSingele(x: string) {
  const i = SearchHistory.value.findIndex((item: any) => {
    return item === x;
  });
  if (i !== -1) SearchHistory.value.splice(i, 1);
  if (SearchHistory.value.length === 0) {
    localStorage.removeItem('search');
  } else localStorage.setItem('search', JSON.stringify(history));
}
getHots();
</script>

<style scoped lang="less">
.hot-search-container {
  margin-left: 20px;
  padding: 5px 0;
}
.hot-item {
  width: 160px;
  display: inline-block;
  margin-right: 20px;
  padding-left: 5px;
  margin-top: 5px;
  height: 30px;
  line-height: 30px;
  transition: color 0.5s;
  border-radius: 3px;
}
.history-block {
  display: inline-block;
  height: 30px;
  margin: 5px;
  line-height: 30px;
  border-radius: 3px;
  font-size: 14px;
  padding: 0 5px;
  background-color: var(--hover-color);
  transition: background-color 0.5s;
}
.history-block:hover {
  background-color: var(--hover-more-color);
  .icon-guanbi {
    display: inline-block;
  }
}
.icon-guanbi {
  //display: none;
  position: absolute;
  right: -10px;
  top: -10px;
  transition: color 0.5s;
}
.icon-guanbi:hover {
  color: var(--theme-color);
}
.hot-item:hover {
  color: var(--theme-color);
}
.delete-all {
  float: right;
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.5s;
}
.delete-all:hover {
  color: var(--theme-color);
}
</style>
