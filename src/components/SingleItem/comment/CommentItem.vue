<template>
  <li class="clearfix comment">
    <router-link
      :to="{ name: 'user', query: { id: info.user.userId } }"
      class="avatar"
    >
      <load-img :src="info.user.avatarUrl + '?param=40y40'" class="avatar" />
    </router-link>
    <div class="comment-main">
      <div class="name">
        <span
          class="vip"
          v-if="info.user.vipType === 11 && info.user.vipRights"
        >
          <router-link :to="{ name: 'user', query: { id: info.user.userId } }">
            {{ info.user.nickname }}
          </router-link>
          <img :src="info.user.vipRights.associator.iconUrl" />
        </span>
        <span v-else>
          <router-link :to="{ name: 'user', query: { id: info.user.userId } }">
            {{ info.user.nickname }}
          </router-link>
        </span>
      </div>
      <div class="content">{{ info.content }}</div>
      <div class="operate-button">
        <span>{{ dayjs(info.time).format('YYYY-MM-DD hh:mm:ss') }}</span>
        <span class="dianzan" @click="likeIt">
          <i v-if="!liked" class="iconfont icon-dianzan1"></i>
          <i v-else class="iconfont icon-dianzan_kuai"></i>
          {{ likedCount }}
        </span>
        <i @click="setReplyComment()">回复</i>
      </div>
      <reply-panel
        v-if="replyShow"
        :placeholder="'回复@' + info.user.nickname + ':'"
        :source="{ ...source, cid: info.commentId }"
        @sendComment="resetFloor"
      ></reply-panel>
      <div class="comment-reply" v-if="replyCount > 0">
        <ul class="u1">
          <template
            v-for="item in floorComments.slice(0, 2)"
            :key="item.commentId"
          >
            <floor-item
              @changeReplyId="change"
              @sendComment="resetFloor"
              :info="item"
              :source="source"
              :replyShowId="replyShowId"
              :father-cid="info.commentId"
            ></floor-item>
          </template>
        </ul>
        <ul class="more" v-if="moreFloorShow">
          <template
            v-for="item in floorComments.slice(2)"
            :key="item.commentId"
          >
            <floor-item
              @changeReplyId="change"
              @sendComment="resetFloor"
              :info="item"
              :source="source"
              :replyShowId="replyShowId"
              :father-cid="info.commentId"
            ></floor-item>
          </template>
          <div v-if="more" class="show-more" @click="getFloor">
            <i>查看更多</i>
          </div>
        </ul>
        <div class="tip" v-if="replyCount >= 3 && !moreFloorShow">
          共计{{ replyCount }}条回复，
          <i @click="moreFloorShow = true">点击查看</i>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { likeComment, getFloorComment } from '@/hooks/comment';
import ReplyPanel from '@/components/Comment/ReplyPanel.vue';
import FloorItem from '@/components/SingleItem/comment/FloorItem.vue';
const props = defineProps<{
  info: any;
  source: { id: number | string; type: number };
}>();
const liked = ref(props.info.liked);
const likedCount = ref(props.info.likedCount);
const replyCount = ref(props.info.replyCount);
const replyShow = computed(() => {
  return props.info.commentId === replyShowId.value && panelShow.value;
});
const panelShow = ref(false);
const moreFloorShow = ref(false);
const replyShowId = ref(-1);
const floorComments = ref<any[]>([]);
const floorTime = ref<number>(-1);
const more = ref(true);
// 点赞
async function likeIt() {
  let t = 0;
  if (liked.value) t = 0;
  else t = 1;
  const res = await likeComment({
    id: props.source.id,
    cid: props.info.commentId,
    type: props.source.type,
    t,
  });
  if (res) {
    if (t === 0) {
      liked.value = false;
      likedCount.value--;
    } else {
      liked.value = true;
      likedCount.value++;
    }
  }
}
// 获取楼层评论
async function getFloor() {
  const data: any = {
    id: props.source.id,
    type: props.source.type,
    parentCommentId: props.info.commentId,
    limit: 10,
  };
  if (floorTime.value !== -1) data.time = floorTime.value;
  const res = await getFloorComment(data);
  if (res.comments.length !== 0) floorComments.value.push(...res.comments);
  if (res.time !== -1) floorTime.value = res.time;
  more.value = res.hasMore;
}

function setReplyComment() {
  if (props.info.commentId === replyShowId.value) {
    panelShow.value = !panelShow.value;
  } else {
    panelShow.value = true;
  }
  replyShowId.value = props.info.commentId;
}

function change(val: number) {
  replyShowId.value = val;
}
function resetFloor() {
  setTimeout(() => {
    floorComments.value = [];
    floorTime.value = -1;
    more.value = true;
    replyCount.value++;
    getFloor();
  }, 1000);
}
if (replyCount.value > 0) {
  getFloor();
}
</script>

<style scoped lang="less">
.comment {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--hover-color);
  max-width: 750px;
  margin: 0 auto;
}
.avatar {
  height: 40px;
  width: 40px;
  margin-top: 10px;
  flex-shrink: 0;
  border-radius: 50%;
}
.comment-main {
  flex: 1;
  margin-top: 20px;
  padding: 0 10px;
}
.comment-reply {
  .tip {
    color: var(--hover-more-color);
    font-size: 13px;
  }
}
.vip {
  height: 20px;
  line-height: 20px;
  font-size: 17px;
  color: var(--theme-color);
  img {
    height: 15px;
    margin-left: 5px;
    transform: translateY(1.5px);
  }
}
.operate-button {
  font-size: 14px;
  color: var(--hover-more-color);
  .icon-dianzan_kuai {
    color: var(--theme-color);
  }
  i {
    margin: 0 5px 0 20px;
  }
  span:last-child {
    margin-left: 30px;
  }
}
.dianzan:hover {
  cursor: pointer;
}
.show-more {
  display: block;
  text-align: center;
  color: var(--unimport-text-color);
}
i:hover {
  color: var(--theme-color);
  transition: color 0.3s;
  cursor: pointer;
}
.u1 > li:first-child {
  border-bottom: none;
}
a:hover {
  color: var(--theme-color);
  transition: color 0.3s;
}
</style>
