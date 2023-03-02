<template>
  <div style="overflow: hidden">
    <div class="header">
      <span style="font-size: 20px">评论</span>
      <span class="total">{{ total }}</span>
      <span class="type-change">
        <b class="active" v-if="sortType === 2">最热</b>
        <b @click="sortType = 2" v-else>最热</b>
        |
        <b class="active" v-if="sortType === 3">最新</b>
        <b @click="sortType = 3" v-else>最新</b>
      </span>
    </div>
    <reply-panel
      :source="{ id: itemId, type: type }"
      :placeholder="'发一条友善的言论'"
      @sendComment="refresh"
    ></reply-panel>
    <div class="comment-container">
      <template v-if="comments.length !== 0">
        <comment-item
          v-for="item in comments"
          :key="item.commentId"
          :info="item"
          :source="{ id: itemId, type: type }"
        ></comment-item>
      </template>
      <no-more-tip v-if="!more"></no-more-tip>
    </div>
  </div>
  <loading-tip :is-load="!bottomLoad"></loading-tip>
</template>

<script setup lang="ts">
import { getComment } from '@/hooks/comment';
import { findScroll } from '@/hooks/scroll';
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import CommentItem from '@/components/SingleItem/comment/CommentItem.vue';
import ReplyPanel from '@/components/Comment/ReplyPanel.vue';
const props = withDefaults(
  defineProps<{ itemId: string | number; type: number; scrollId?: string }>(),
  {
    scrollId: 'main',
  }
);
const comments = ref<any[]>([]);
// 到底加载
const scrollPanel = ref<any>(null);
const bottomLoad = ref(false);
const more = ref(true);
const page = ref(1);
const cursor = ref(-1);
const sortType = ref(2);
const total = ref('');
async function pushComment() {
  bottomLoad.value = true;
  let data: any = {
    type: props.type,
    id: props.itemId,
    sortType: sortType.value,
    pageNo: page.value,
  };
  if (sortType.value === 3 && cursor.value !== -1) {
    data.cursor = cursor.value;
  }
  const res = await getComment(data);
  bottomLoad.value = false;
  if (!res.error) {
    comments.value.push(...res.comments);
    more.value = res.hasMore;
    page.value++;
    total.value = res.total.toString();
    if (sortType.value === 3) {
      cursor.value = res.cursor;
    }
  } else {
    ElMessage.warning('获取评论失败，请刷新重试');
    more.value = res.hasMore;
  }
}
watch(
  scrollPanel,
  (newVal) => {
    if (!newVal) return;
    if (newVal.isBottom && !bottomLoad.value && more.value) {
      pushComment();
    }
  },
  { deep: true }
);
watch(sortType, reset);
watch(props, reset, { deep: true });
pushComment();
function refresh() {
  setTimeout(() => {
    reset();
  }, 1000);
}
function reset() {
  page.value = 1;
  cursor.value = -1;
  more.value = true;
  comments.value = [];
  bottomLoad.value = false;
  // scrollPanel.value.backTop++;
  pushComment();
}
onMounted(() => {
  scrollPanel.value = findScroll(props.scrollId);
});
</script>

<style scoped lang="less">
.container {
  padding-top: 10px;
  padding-bottom: 30px;
  overflow: hidden;
}
.tip {
  position: absolute;
  left: 45%;
  bottom: 150px;
}
.header {
  margin-top: 3px;
  left: 20px;
}
.total {
  font-size: 18px;
  margin-left: 3px;
  color: var(--unimport-text-color);
}
.type-change {
  margin-left: 10px;
  .active {
    color: var(--theme-color);
  }
  b {
    margin: 0 5px;
    cursor: pointer;
  }
  b:hover {
    transition: color 0.3s;
    color: var(--theme-color);
  }
}
</style>
