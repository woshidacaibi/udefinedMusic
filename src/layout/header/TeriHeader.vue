<template>
  <div class="header-container">
    <div class="left-entry">
      <a>
        <span>LOGO</span>
        <img :src="logo" alt="" />
      </a>
      <div class="router-button">
        <i @click="rOperate.back" class="iconfont icon-zuojiantou1"></i>
        <i @click="rOperate.forward" class="iconfont icon-youjiantou1"></i>
      </div>
    </div>
    <div class="search-box">
      <input
        class="search-input"
        type="text"
        @focusin="show = true"
        @focusout="show = false"
        :placeholder="placeholder"
        @keyup.enter="goSearch"
        v-model="keyword"
      />
      <i class="iconfont icon-sousuo" @click="goSearch" title="搜索"></i>
      <transition name="search">
        <SearchExtend v-show="show" class="extend" :kw="keyword"></SearchExtend>
      </transition>
    </div>
    <UserBox class="right-entry"></UserBox>
  </div>
</template>

<script lang="ts" setup>
import UserBox from '@/layout/header/UserBox.vue';
import logo from '@/assets/img/logo.png';
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import SearchExtend from '@/components/Search/SearchExtend.vue';
import { getDefault } from '@/hooks/search';
import router from '@/router';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const show = ref(false);
const keyword = ref('');
const placeholder = ref('Search');
const actualKey = ref('');
const rOperate = useRouter();

async function loadDefault() {
  const res = await getDefault();
  placeholder.value = res.showKeyword;
  actualKey.value = res.realkeyword;
}
watch(
  () => route.query,
  () => {
    if (route.name === 'search' && route.query.kw) {
      keyword.value = route.query.kw as string;
    }
  }
);
function goSearch() {
  let kw = keyword.value;
  if (keyword.value === '') {
    if (actualKey.value === '') {
      ElMessage.warning('搜索内容不可为空');
      return;
    } else kw = actualKey.value;
  }
  router.push({ name: 'search', query: { kw: kw } });
}
loadDefault();
</script>

<style lang="less" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--layout-border-color);
}
.left-entry {
  width: 210px;
  flex-shrink: 0;
  margin-left: 20px;
  a {
    float: left;
    span {
      height: 50px;
      line-height: 49px;
      font-size: 20px;
      font-weight: bolder;
    }
    img {
      float: left;
    }
  }
  .router-button {
    float: left;
    margin-left: 20px;
    i {
      display: inline-block;
      height: 30px;
      width: 30px;
      line-height: 30px;
      margin: 10px 3px;
      text-align: center;
      font-size: 22px;
      font-weight: bolder;
      border-radius: 50%;
      background-color: transparent;
      transition: all 0.3s;
    }
    i:hover {
      color: var(--theme-color);
    }
  }
  img {
    float: left;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    vertical-align: text-bottom;
  }
}
.search-box {
  flex: 1;
  max-width: 400px;
  min-width: 240px;
  position: relative;
  i {
    top: 11px;
    right: 10px;
    z-index: 1;
    position: absolute;
    transition: color 0.5s;
  }
  i:hover {
    color: var(--theme-color);
  }
  .search-input {
    margin: 10px 0;
    height: 30px;
    width: 100%;
    padding-left: 15px;
    transition: all 0.5s;
    border: 2px solid rgba(3, 3, 3, 0.06);
    border-radius: 8px;
    outline: none;
    background-color: transparent;
  }
  //input:focus {
  //  border: 2px solid var(--theme-color);
  //}
  .search-input:focus {
    border: 2px solid var(--theme-color);
  }
}
.right-entry {
  width: 200px;
  margin-right: 50px;
}
.extend {
  position: absolute;
  top: 42.5px;
  left: 0;
  width: 100%;
  min-width: 220px;
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  background-color: var(--container-color);
  border: 1px solid var(--hover-color);
  box-shadow: var(--el-box-shadow-dark);
}
.search-enter-active {
  animation: upDown 0.3s;
}
.search-leave-active {
  animation: upDown 0.3s reverse;
}
@keyframes upDown {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
