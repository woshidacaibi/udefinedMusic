<template>
  <el-button
    v-if="circle"
    circle
    plain
    :color="themeColor"
    :size="size"
    :disabled="disabled"
  >
    <slot></slot>
  </el-button>
  <el-button
    v-else-if="square"
    plain
    :color="themeColor"
    :size="size"
    :disabled="disabled"
  >
    <slot></slot>
  </el-button>
  <el-button
    v-else
    round
    plain
    :color="themeColor"
    :disabled="disabled"
    :size="size"
  >
    <slot></slot>
  </el-button>
</template>

<script lang="ts" setup>
import { other } from '@/stores/other';
import { storeToRefs } from 'pinia';
const { themeColor } = storeToRefs(other());
withDefaults(
  defineProps<{
    disabled?: boolean;
    circle?: boolean;
    square?: boolean;
    size?: string;
  }>(),
  {
    disabled: false,
    circle: false,
    square: false,
    size: 'default',
  }
);
</script>

<style scoped lang="less"></style>
