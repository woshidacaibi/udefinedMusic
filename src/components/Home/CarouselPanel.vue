<template>
  <div class="carousel-container">
    <template v-if="banners.length > 0">
      <MySwiper height="200px" :type="'card'">
        <el-carousel-item
          v-for="(item, index) in banners"
          :key="item"
          :name="index.toString()"
        >
          <router-link
            :to="{ name: 'album', query: { id: item.targetId } }"
            v-if="item.targetType == 10"
            class="img-block"
          >
            <load-img :src="item.imageUrl" :fit="'scale-down'"></load-img>
            <div class="type-tip">{{ item.typeTitle }}</div>
          </router-link>
          <div class="img-block" v-else-if="item.targetType == 1">
            <load-img
              :src="item.imageUrl"
              @click="PlayItemSong(item.targetId)"
              :fit="'scale-down'"
            ></load-img>
            <div class="type-tip">{{ item.typeTitle }}</div>
          </div>
          <div class="img-block" v-else>
            <load-img
              :src="item.imageUrl"
              @click="turnToPage(item.url)"
              :fit="'scale-down'"
            ></load-img>
            <div class="type-tip">{{ item.typeTitle }}</div>
          </div>
        </el-carousel-item>
      </MySwiper>
    </template>
    <error-tip v-else :top="'40px'"></error-tip>
  </div>
</template>

<script lang="ts" setup>
import { getSongDetail } from '@/hooks/song';
import { playSong } from '@/hooks/audioPlayer';
import MySwiper from '@/basic/MySwiper.vue';

const props = defineProps<{ banners: any }>();

async function PlayItemSong(id: string | number) {
  const res = await getSongDetail(id);
  if (res) playSong(res[0]);
}
function turnToPage(url: string) {
  window.open(url);
}
</script>

<style scoped lang="less">
.type-tip {
  position: absolute;
  z-index: 1;
  background-color: var(--theme-color);
  right: 0;
  top: 0;
  width: 20px;
  height: 80px;
  text-align: center;
  line-height: 20px;
  border-radius: 5px 0 0 5px;
}

.img-block {
  display: block;
}
.iconfont {
  font-weight: bolder;
  font-size: 24px;
}
.type-tip {
  position: absolute;
  z-index: 1;
  background-color: var(--theme-color);
  writing-mode: tb-rl;
  right: 0;
  top: 0;
  width: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 5px 0 0 5px;
}
.operate-button {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  background-color: var(--hover-color);
  transition: all 0.5s;
}
.operate-button:hover {
  background-color: rgba(0, 0, 0, 0.22);
}
.next {
  right: 0;
  transform: translate(100%, -50%);
}

.prev {
  left: 0;
  transform: translate(-100%, -50%);
}
</style>
