<template>
  <i :class="`iconfont icon-rili${day}`"></i>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
const day = dayjs(Date.now()).format('DD');
</script>

<style scoped></style>
