<template>
  <router-link
    :to="{ name: 'playlist', query: { id: info.id } }"
    class="item-container clearfix"
    v-if="info"
  >
    <div class="item-img">
      <load-img :src="info.coverImgUrl + '?param=30y30'"></load-img>
    </div>
    <div class="item-message">
      <div class="list-name overflow" :title="info.name">{{ info.name }}</div>
      <div class="list-count">共{{ info.trackCount }}首</div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import LoadImg from '@/basic/LoadImg.vue';
const props = withDefaults(defineProps<{ info: any }>(), {
  info: null,
});
</script>

<style scoped lang="less">
.item-container {
  height: 50px;
  width: 215px;
  display: block;
  border-radius: 5px;
}
.item-container:hover {
  background-color: var(--hover-color);
}
.item-img {
  width: 30px;
  height: 30px;
  margin: 10px;
  border-radius: 5px;
  overflow: hidden;
  float: left;
}
.item-message {
  //float: left;
  padding: 5px;
  height: 50px;
}
.list-name {
  height: 20px;
  font-size: 14px;
}
.list-count {
  height: 15px;
  font-size: 12px;
  color: var(--unimport-text-color);
}
</style>
