<template>
  <div class="subscribers">
    <ul>
      <template v-for="item in info" :key="item.userId">
        <user-block-item :info="item"></user-block-item>
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
  </div>

  <error-tip v-if="error"></error-tip>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getSubscribers } from '@/hooks/playlist';
import UserBlockItem from '@/components/SingleItem/user/userBlockItem.vue';
import { backToTop } from '@/hooks/scroll';
import { ElMessage } from 'element-plus';
const props = defineProps<{ itemId: number | string; type: number }>();
const pageSize = ref(60);
const pageNum = ref(1);
const total = ref(0);
const info = ref<any[]>([]);
const error = ref(false);
if (props.type === 2) {
  getPlaylistSub();
}
async function pageChange() {
  backToTop('main');
  const info = ElMessage.info({
    message: '加载中...',
    duration: 0,
  });
  await getPlaylistSub();
  info.close();
}
async function getPlaylistSub() {
  const offset = (pageNum.value - 1) * pageSize.value;
  info.value = [];
  const res = await getSubscribers({
    id: props.itemId,
    limit: pageSize.value,
    offset,
  });
  if (res.error) {
    error.value = true;
    return;
  }
  total.value = res.data.total;
  info.value = res.data.subscribers;
}
</script>

<style scoped lang="less">
.subscribers {
  margin-bottom: 35px;
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
