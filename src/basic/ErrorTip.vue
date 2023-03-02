<template>
  <el-empty
    :image="img"
    description="唔，加载失败了"
    :image-size="200"
    :style="`margin-top:${top}`"
  ></el-empty>
</template>

<script lang="ts" setup>
import img from '@/assets/img/errorLoad.gif';
withDefaults(defineProps<{ top?: string }>(), {
  top: '0',
});
</script>

<style scoped></style>
