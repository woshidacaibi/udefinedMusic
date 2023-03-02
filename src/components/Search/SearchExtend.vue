<template>
  <div>
    <scroll-bar
      sid="search"
      :max-height="'300px'"
      :horizon="false"
      :bar-padding="false"
    >
      <keep-alive>
        <HotSearch v-show="kw === ''"></HotSearch>
      </keep-alive>
      <keep-alive>
        <SearchPropose v-show="kw !== ''" :kw="kw"></SearchPropose>
      </keep-alive>
    </scroll-bar>
  </div>
</template>

<script lang="ts" setup>
import SearchPropose from '@/components/Search/SearchPropose.vue';
import HotSearch from '@/components/Search/HotSearch.vue';

const props = withDefaults(defineProps<{ kw: string }>(), {
  kw: '',
});
</script>

<style scoped lang="less"></style>
