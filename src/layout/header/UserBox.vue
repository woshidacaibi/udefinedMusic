<template>
  <div class="userBox-container">
    <div class="user-cover" v-if="loginStatus">
      <el-avatar shape="circle" :size="30" :src="userInfo.avatarUrl">
        <img :src="error" />
      </el-avatar>
    </div>
    <div v-else class="default-cover" @click="showLogin = true">
      <el-avatar
        shape="circle"
        :size="30"
        :src="avatar"
        @click="showLogin = true"
      >
      </el-avatar>
      <span class="login">点我登录</span>
    </div>
    <ul class="userBox-extend" v-if="loginStatus">
      <router-link
        :to="{
          name: 'user',
          query: {
            id: userInfo.userId,
          },
        }"
        ><li class="name">{{ userInfo.nickname }}</li></router-link
      >
      <el-tooltip v-if="levelStatus !== false" placement="left" effect="light">
        <template #content>
          <div v-html="levelTip"></div>
        </template>
        <li class="level">
          <div class="currentLevel">LV{{ levelStatus.level }}</div>
          <div class="process">
            <el-progress
              :percentage="levelStatus.progress * 100"
              :color="customColors"
              :show-text="false"
              :raw-content="true"
            />
          </div>
          <div class="nextLevel" v-if="levelStatus.level < 10">
            LV{{ levelStatus.level + 1 }}
          </div>
          <div class="nextLevel" v-else>已满</div>
        </li>
      </el-tooltip>
      <div class="interact-message">
        <router-link
          :to="{
            name: 'event',
            query: { id: userInfo.userId },
          }"
        >
          <div>动态</div>
        </router-link>
        <router-link
          :to="{
            name: 'follows',
            query: { id: userInfo.userId, nickname: userInfo.nickname },
          }"
        >
          <div>关注</div>
        </router-link>
        <router-link
          :to="{
            name: 'followed',
            query: { id: userInfo.id, nickname: userInfo.nickname },
          }"
        >
          <div>粉丝</div>
        </router-link>
      </div>
      <router-link :to="{ name: 'user', query: { id: userInfo.userId } }">
        <li class="row"><i class="iconfont icon-zhuye"></i>个人空间</li>
      </router-link>
      <li class="row" v-if="loginStatus" @click="logout">
        <i class="iconfont icon-tuichu" />退出登录
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { loginStore } from '@/stores/login';
import { accountStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { checkLogin, logout } from '@/hooks/login';
import error from '@/assets/img/errorImg.png';
import avatar from '@/assets/img/avatar.png';
import { getUserLevel } from '@/hooks/user';
const { showLogin, loginStatus } = storeToRefs(loginStore());
const { userInfo } = storeToRefs(accountStore());
const levelTip = computed(() => {
  if (levelStatus.value == false) {
    return '';
  } else {
    return `当前进度${parseFloat(levelStatus.value.progress) * 100}%<br/>
            还需要再登录${
              levelStatus.value.nextLoginCount - levelStatus.value.nowLoginCount
            }天<br/>
            还需要再听${
              levelStatus.value.nextPlayCount - levelStatus.value.nowPlayCount
            }首歌<br/>
    `;
  }
});
const levelStatus = ref<any>(false);
//检查登录
checkLogin(loginStatus, userInfo);
watch(
  loginStatus,
  async () => {
    if (loginStatus.value) {
      levelStatus.value = await getUserLevel();
    }
  },
  { immediate: true }
);

const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];
</script>

<style scoped lang="less">
.login {
  line-height: 30px;
  display: inline-block;
  float: right;
  margin-left: 5px;
  transition: color 0.5s;
}
.default-cover:hover {
  cursor: pointer;
  .login {
    color: var(--theme-color);
  }
}
.userBox-container {
  display: flex;
  align-items: center;
}
.userBox-container:hover {
  .user-cover {
    transform: translateY(120%) scale(3);
  }
  .userBox-extend {
    opacity: 1;
    display: block;
  }
}
.userBox-extend {
  position: absolute;
  padding-top: 70px;
  top: 50px;
  left: -4px;
  width: 200px;
  height: 240px;
  background-color: var(--container-color);
  border: 1px solid var(--hover-color);
  box-shadow: var(--el-box-shadow);
  border-radius: 5px;
  z-index: 1102;
  opacity: 0;
  transition: opacity 0.5s;
  display: none;
}
.user-cover,
.default-cover {
  margin-left: 80px;
  margin-top: 5px;
  transition: all 0.5s;
  z-index: 1103;
}
.name {
  text-align: center;
  font-size: 18px;
}
.row {
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  text-align: center;
  i {
    display: inline-block;
    font-size: 18px;
    line-height: 30px;
    height: 30px;
    padding-right: 5px;
    transform: translateY(1px);
  }
}
.level {
  display: flex;
  padding: 0 10px;
  .process {
    flex: 1;
    padding-top: 5px;
    height: 18px;
  }
  .currentLevel,
  .nextLevel {
    flex-shrink: 0;
    margin: 0 3px;
    height: 18px;
    font-size: 13px;
    width: 30px;
    line-height: 18px;
    border: 1px solid var(--theme-color);
    color: var(--theme-color);
    border-radius: 5px;
    text-align: center;
  }
  .nextLevel {
    color: var(--hover-more-color);
    border: 1px solid var(--hover-more-color);
  }
}
.interact-message {
  display: flex;
  align-items: center;
  justify-content: space-around;
  a {
    width: 100px;
    text-align: center;
    font-size: 16px;
    margin: 10px 0;
    border-right: 1px solid var(--hover-color);
    transition: color 0.3s;
    h4 {
      font-weight: bolder;
    }
  }
  a:last-child {
    border: none;
  }
  a:hover {
    color: var(--theme-color);
  }
}
.row {
  cursor: pointer;
  transition: color 0.5s;
}
.row:hover {
  color: var(--theme-color);
}
</style>
