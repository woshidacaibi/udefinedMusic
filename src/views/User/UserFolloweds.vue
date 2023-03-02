<template>
  <h2>{{ route.query.nickname ? route.query.nickname + '的粉丝' : '' }}</h2>
  <div v-if="isLoad">
    <ul>
      <template v-for="item in info" :key="item.userId">
        <follow-block-item :info="item"></follow-block-item>
      </template>
      <b class="placeholder"></b>
      <b class="placeholder"></b>
    </ul>
    <el-pagination
      :total="total"
      v-model:current-page="pageNum"
      :page-size="pageSize"
      @current-change="pageChange"
      layout="prev, pager, next"
      hide-on-single-page
      style="text-align: center"
    />
    <error-tip v-if="error"></error-tip>
    <no-more-tip v-if="info.length === 0" content="暂无粉丝"></no-more-tip>
  </div>
  <loading-tip :is-load="isLoad"></loading-tip>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { scrollStore } from '@/stores/panelStaus';
import { useRoute } from 'vue-router';
import { getFolloweds } from '@/hooks/user';
import FollowBlockItem from '@/components/SingleItem/user/followBlockItem.vue';

import { backToTop } from '@/hooks/scroll';

const route = useRoute();
const pageSize = ref(60);
const pageNum = ref(1);
const total = ref(0);
const info = ref<any[]>([]);
const isLoad = ref(false);
const error = ref(false);

function pageChange() {
  backToTop('main');
  getInfo();
}

async function getInfo() {
  isLoad.value = false;
  info.value = [];
  const offset = (pageNum.value - 1) * pageSize.value;
  const res = await getFolloweds({
    uid: route.query.id as string,
    limit: pageSize.value,
    offset,
  });
  isLoad.value = true;
  if (res.error) {
    error.value = true;
    return;
  }
  total.value = res.data.size;
  info.value = res.data.followeds;
}

watch(
  () => route.query.id,
  () => {
    if (route.name === 'followed') {
      info.value = [];
      error.value = false;
      pageNum.value = 1;
      total.value = 0;
      getInfo();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
h2 {
  margin: 10px 20px;
  font-size: 21px;
  font-weight: bolder;
}
ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.placeholder {
  width: 300px;
}
</style>
