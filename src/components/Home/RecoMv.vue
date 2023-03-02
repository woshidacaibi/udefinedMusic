<template>
  <div class="reco-container">
    <ul class="place">
      <li class="active" v-if="type === '全部'">全部</li>
      <li @click="setType('全部')" v-else>全部</li>
      <li class="active" v-if="type === '内地'">内地</li>
      <li @click="setType('内地')" v-else>内地</li>
      <li class="active" v-if="type === '港台'">港台</li>
      <li @click="setType('港台')" v-else>港台</li>
      <li class="active" v-if="type === '欧美'">欧美</li>
      <li @click="setType('欧美')" v-else>欧美</li>
      <li class="active" v-if="type === '日本'">日本</li>
      <li @click="setType('日本')" v-else>日本</li>
      <li class="active" v-if="type === '韩国'">韩国</li>
      <li @click="setType('韩国')" v-else>韩国</li>
    </ul>
    <router-link to="/moreMv" class="toMore"
      >更多 <i class="iconfont icon-xiangyoujiantou"></i
    ></router-link>
    <template v-if="isLoad">
      <error-tip v-if="mvs.length === 0"></error-tip>
      <MySwiper v-else height="420px">
        <el-carousel-item v-for="round in page" :key="round">
          <div class="reco-mvs">
            <template
              v-for="item in mvs.slice((round - 1) * 8, 8 * round)"
              :key="item.id"
            >
              <mv-item :info="item"></mv-item>
            </template>
          </div>
        </el-carousel-item>
      </MySwiper>
    </template>
    <loading-tip :is-load="isLoad"></loading-tip>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getMvs } from '@/hooks/video';
import MvItem from '@/components/SingleItem/video/mvItem.vue';

const type = ref('全部');
const isLoad = ref(false);
const mvs = ref<any[]>([]);
const page = ref(0);
function setType(t: string) {
  type.value = t;
}
async function getInfo() {
  isLoad.value = false;
  const res = await getMvs(0, 40, type.value);
  mvs.value = res.mvs;
  page.value = mvs.value.length / 8;
  isLoad.value = true;
}
watch(
  type,
  async () => {
    await getInfo();
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
@import '@/assets/css&less/homeArea.less';

.reco-mvs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
}
</style>
