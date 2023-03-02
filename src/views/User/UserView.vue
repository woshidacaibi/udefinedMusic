<template>
  <div v-if="isLoad" class="view-container">
    <ErrorTip v-if="!info" :top="'80px'"></ErrorTip>
    <div class="message-box">
      <LoadImg
        :src="info.profile.avatarUrl + '?param=200y200'"
        class="left-img"
      ></LoadImg>
      <div class="right-message">
        <div class="name">
          {{ info.profile.nickname }}
        </div>
        <div class="other">
          <span class="tag">lv {{ info.level }}</span>
          <span class="tag" v-if="info.profile.vipType === 11">VIP</span>
          <span class="gender">
            <i v-if="info.gender === 0" class="iconfont icon-icon2"></i>
            <i v-else-if="info.gender === 1" class="iconfont icon-icon3"></i>
          </span>
          <router-link
            v-if="info.profile.artistId"
            :to="{ name: 'artist', query: { id: info.profile.artistId } }"
            class="artist-detail"
          >
            <theme-button>歌手页</theme-button>
          </router-link>
          <theme-button
            v-if="isfans"
            @click="
              followUser(info.profile.userId, -1);
              isfans = false;
            "
          >
            <template v-if="info.profile.followMe">√已互关</template>
            <template v-else>√已关注</template>
          </theme-button>
          <theme-button
            :disabled="
              (userInfo && userInfo.userId == route.query.id) || !userInfo
            "
            @click="
              followUser(info.profile.userId, 1);
              isfans = true;
            "
            v-else
            >关注</theme-button
          >
        </div>
        <hr class="split-line" />
        <div class="interact-message">
          <router-link
            :to="{
              name: 'event',
              query: { id: route.query.id, nickname: info.profile.nickname },
            }"
          >
            <h4>
              {{
                info.profile.eventCount > 10000
                  ? parseInt(info.profile.eventCount / 10000) + '万'
                  : info.profile.eventCount
              }}
            </h4>
            <div>动态</div>
          </router-link>
          <router-link
            :to="{
              name: 'follows',
              query: { id: route.query.id, nickname: info.profile.nickname },
            }"
          >
            <h4>
              {{
                info.profile.follows > 10000
                  ? parseInt(info.profile.follows / 10000) + '万'
                  : info.profile.follows
              }}
            </h4>
            <div>关注</div>
          </router-link>
          <router-link
            :to="{
              name: 'followed',
              query: { id: route.query.id, nickname: info.profile.nickname },
            }"
          >
            <h4>
              {{
                info.profile.followeds > 10000
                  ? parseInt(info.profile.followeds / 10000) + '万'
                  : info.profile.followeds
              }}
            </h4>
            <div>粉丝</div>
          </router-link>
        </div>
        <p v-if="info.profile.province">
          所在地区：{{ location.province + ' ' + location.city }}
        </p>
        <p>
          个性签名：{{
            info.profile.signature !== '' ? info.profile.signature : '暂无介绍'
          }}
        </p>
      </div>
    </div>
    <PlaylistsContainer
      :lists="likeLists"
      :header="info.profile.nickname + '创建的歌单'"
    ></PlaylistsContainer>
    <PlaylistsContainer
      :lists="subLists"
      :header="info.profile.nickname + '收藏的歌单'"
    ></PlaylistsContainer>
  </div>
  <div class="view-container" v-else>
    <div class="message-box">
      <el-skeleton animated :throttle="500">
        <template #template>
          <el-skeleton-item variant="image" class="left-img" />
        </template>
      </el-skeleton>
      <div class="right-message">
        <el-skeleton :throttle="500" animated :rows="4"></el-skeleton>
      </div>
    </div>
    <el-skeleton
      :throttle="500"
      style="margin-top: 50px"
      animated
      :rows="5"
    ></el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { getUserInfo, getCity, followUser, getPlaylist } from '@/hooks/user';
import { accountStore } from '@/stores/user';
import PlaylistsContainer from '@/components/Playlist/PlaylistsContainer.vue';
const { userInfo } = storeToRefs(accountStore());
const route = useRoute();
const info = ref<any>(null);
const isLoad = ref(false);
const userLists = ref<any[]>([]);
const location = ref<null | { province: string; city: string }>(null);
const isfans = ref(false);
async function getInfo() {
  if (route.query.id) {
    info.value = await getUserInfo(route.query.id as string);
    userLists.value = await getPlaylist(route.query.id as string, 36);
    location.value = getCity(info.value.profile.city.toString());
    isfans.value = info.value.profile.followed;
    isLoad.value = true;
  }
}
const likeLists = computed(() => {
  return userLists.value.filter((item) => {
    return item.creator.userId == route.query.id;
  });
});
const subLists = computed(() => {
  return userLists.value.filter((item) => {
    return item.creator.userId != route.query.id;
  });
});
watch(
  () => route.query.id,
  () => {
    if (route.name === 'user') {
      info.value = null;
      isLoad.value = false;
      location.value = null;
      getInfo();
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import '@/assets/css&less/list&album&artists.less';

.left-img {
  border-radius: 50%;
}
.name {
  font-size: 24px;
  font-weight: 700;
}
.tag {
  flex-shrink: 0;
  margin: 0 3px;
  height: 18px;
  font-size: 15px;
  width: 35px;
  line-height: 18px;
  border: 1px solid var(--theme-color);
  color: var(--theme-color);
  border-radius: 5px;
  text-align: center;
}
.artist-detail {
  float: right;
  margin-right: 100px;
}
.gender {
  width: 30px;
  margin-left: 5px;
}
.split-line {
  margin-top: 5px;
  color: var(--hover-light-color);
  max-width: 600px;
}
.interact-message {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 300px;
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
.right-message > p {
  font-size: 13px;
}
.right-message > .overflow {
  -webkit-line-clamp: 2;
}
.other {
  max-width: 600px;
  height: 30px;
  line-height: 30px;
  button {
    position: absolute;
    right: 50px;
  }
}
</style>
