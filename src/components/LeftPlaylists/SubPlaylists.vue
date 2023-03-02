<template>
  <div class="lists-container">
    <LoadingTip
      content="歌单加载中。。。"
      :is-load="isLoad"
      :login-check="true"
    ></LoadingTip>
    <template v-if="isLoad">
      <SidePlaylistItem v-for="item in subLists" :key="item.id" :info="item" />
      <no-more-tip
        v-if="subLists.length === 0"
        :content="'还未收藏歌单'"
      ></no-more-tip>
    </template>
  </div>
</template>

<script lang="ts" setup>
import LoadingTip from '@/basic/LoadingTip.vue';
import SidePlaylistItem from '@/components/SingleItem/SidePlaylistItem.vue';
import { accountStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const { subLists } = storeToRefs(accountStore());
const isLoad = computed<boolean>(() => {
  if (subLists.value) return true;
  else return false;
});
</script>

<style scoped>
.lists-container {
  width: 100%;
}
</style>
