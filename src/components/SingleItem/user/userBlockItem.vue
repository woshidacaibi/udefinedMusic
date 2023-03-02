<template>
  <router-link :to="{ name: 'user', query: { id: info.userId } }">
    <li>
      <div style="width: 65px">
        <load-img
          class="left-img"
          :src="info.avatarUrl + '?param=80y80'"
        ></load-img>
      </div>
      <div class="name">
        <div class="overflow">{{ info.nickname }}</div>
        <div class="other">
          <span class="gender">
            <i v-if="info.gender === 0" class="iconfont icon-icon2"></i>
            <i v-else class="iconfont icon-icon3"></i>
          </span>
          <span class="province">{{ province ? province : '未知城市' }}</span>
        </div>
      </div>
      <el-image
        fit="cover"
        class="background"
        :src="info.backgroundUrl + '?param=300y300'"
      />
    </li>
  </router-link>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getProvince } from '@/hooks/user';

const props = defineProps<{ info: any }>();
const province = getProvince(props.info.province);
</script>

<style scoped lang="less">
li {
  display: flex;
  align-items: center;
  width: 300px;
  height: 80px;
  padding: 10px;
  flex-shrink: 0;
  transition: all 0.3s;
  border: 1px solid var(--hover-color);
  border-radius: 20px;
  margin: 10px 0;
  overflow: hidden;
}
li:hover {
  .left-img {
    height: 60px;
    width: 60px;
  }
  .name {
    transform: translateY(-65px);
  }
}
.left-img {
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  transition: all 0.3s;
}
.name {
  height: 30px;
  padding: 0 5px;
  width: 200px;
  line-height: 30px;
  color: var(--theme-color);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 15px;
  transform: translateY(0);
  transition: all 0.3s;
}
.other {
  margin-top: 35px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.other > span {
  min-height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 15px;
  color: var(--theme-color);
  background: rgba(255, 255, 255, 0.72);
}
.gender {
  width: 30px;
}
.province {
  width: 130px;
  padding: 0 5px;
}
.overflow {
  width: 190px;
  text-align: center;
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
