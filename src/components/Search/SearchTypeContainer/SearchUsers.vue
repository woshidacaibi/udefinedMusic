<template>
  <div class="grid-container">
    <template v-for="item in lists" :key="item.id">
      <user-block-item :info="item"></user-block-item>
    </template>
    <b class="placeholder"></b>
    <b class="placeholder"></b>
  </div>
</template>

<script lang="ts" setup>
import UserBlockItem from '@/components/SingleItem/user/userBlockItem.vue';
const props = defineProps<{ lists: any }>();
</script>

<style scoped lang="less">
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.placeholder {
  width: 300px;
}
</style>
