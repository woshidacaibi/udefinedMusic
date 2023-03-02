<template>
  <el-empty
    :image="img"
    :description="content"
    :image-size="150"
    :style="`margin-top:${top}`"
  ></el-empty>
</template>

<script lang="ts" setup>
import img from '@/assets/img/noMore.gif';
const props = withDefaults(defineProps<{ top?: string; content?: string }>(), {
  top: '0',
  content: '没有更多啦',
});
</script>

<style scoped></style>
