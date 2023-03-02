<template>
  <div>
    <div class="artist-item-container">
      <router-link
        :to="{ name: 'artist', query: { id: info.id } }"
        class="artist-cover"
      >
        <load-img :src="info.picUrl + '?param=200y200'"></load-img>
      </router-link>
    </div>
    <div class="artist-name">
      <router-link :to="{ name: 'artist', query: { id: info.id } }">
        {{ info.name }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ info: any }>();
</script>

<style scoped lang="less">
.artist-item-container:before {
  display: block;
  content: '';
  padding-top: 100%;
}
.artist-cover {
  margin-top: 15px;
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.3s;
}
.artist-cover:hover {
  transform: scale(1.2);
}
.artist-name {
  display: block;
  text-align: center;
  a {
    transition: color 0.5s;
  }
}
.artist-name > a:hover {
  color: var(--theme-color);
}
</style>
