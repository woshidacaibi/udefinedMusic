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
          <div>
            <router-link
              :to="{
                name: 'event',
                query: { id: info.userId, nickname: info.nickname },
              }"
            >
              <h4>
                {{
                  info.eventCount > 10000
                    ? parseInt(info.eventCount / 10000) + '万'
                    : info.eventCount
                }}
              </h4>
              <div>动态</div>
            </router-link>
            <router-link
              :to="{
                name: 'follows',
                query: { id: info.userId, nickname: info.nickname },
              }"
            >
              <h4>
                {{
                  info.follows > 10000
                    ? parseInt(info.follows / 10000) + '万'
                    : info.follows
                }}
              </h4>
              <div>关注</div>
            </router-link>
            <router-link
              :to="{
                name: 'followed',
                query: { id: info.userId, nickname: info.nickname },
              }"
            >
              <h4>
                {{
                  info.followeds > 10000
                    ? parseInt(info.followeds / 10000) + '万'
                    : info.followeds
                }}
              </h4>
              <div>粉丝</div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="background" />
    </li>
  </router-link>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps<{ info: any }>();
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
  margin-top: 25px;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  a {
    display: block;
    width: 100%;
    div {
      color: var(--hover-more-color);
    }
  }
}
.other > div {
  display: flex;
  justify-content: space-around;
  min-height: 45px;
  width: 200px;
  text-align: center;
  border-radius: 15px;
  color: var(--theme-color);
  background: rgba(255, 255, 255, 0.72);
}
h4 {
  height: 20px;
  font-weight: bolder;
  color: var(--theme-color);
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
  background-color: var(--theme-color);
}
.icon-icon2 {
  color: deeppink;
}
.icon-icon3 {
  color: deepskyblue;
}
</style>
