<template>
  <li class="floor clearfix">
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
      <div class="content">
        {{ info.content }}
        <div v-if="moreReply" class="reply-message">
          <router-link
            :to="{ name: 'user', query: { id: info.beReplied[0].user.userId } }"
          >
            {{ info.beReplied[0].user.nickname }}:
          </router-link>
          <span>{{ info.beReplied[0].content }}</span>
        </div>
      </div>
      <div class="operate-button">
        <span>{{ dayjs(info.time).format('YYYY-MM-DD hh:mm:ss') }}</span>
        <span class="dianzan" @click="likeIt">
          <i v-if="!liked" class="iconfont icon-dianzan1"></i>
          <i v-else class="iconfont icon-dianzan_kuai"></i>
          {{ likedCount }}
        </span>
        <i @click="setReplyComment(info)">回复</i>
      </div>
      <reply-panel
        v-if="replyShow"
        :placeholder="'回复@' + info.user.nickname + ':'"
        :source="{ ...source, cid: info.commentId }"
        @sendComment="sendComment"
      ></reply-panel>
    </div>
  </li>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { ref, computed } from 'vue';
import { likeComment } from '@/hooks/comment';
import ReplyPanel from '@/components/Comment/ReplyPanel.vue';
const props = defineProps<{
  info: any;
  source: { id: number | string; type: number };
  replyShowId: number;
  fatherCid: number;
}>();
const liked = ref(props.info.liked);
const likedCount = ref(props.info.likedCount);
const replyShow = computed(() => {
  return props.info.commentId === props.replyShowId && panelShow.value;
});
const panelShow = ref(false);
const moreReply =
  props.info.beReplied &&
  props.info.beReplied.length > 0 &&
  props.info.beReplied[0].beRepliedCommentId !== props.fatherCid
    ? true
    : false;

const emit = defineEmits<{
  (e: 'changeReplyId', val: number): void;
  (e: 'sendComment', val: any): void;
}>();
const changeReplyId = () => {
  emit('changeReplyId', props.info.commentId);
};
const sendComment = (val: any) => {
  emit('sendComment', val);
};
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
function setReplyComment() {
  if (props.info.commentId === props.replyShowId) {
    panelShow.value = !panelShow.value;
  } else {
    panelShow.value = true;
  }
  changeReplyId();
}
</script>

<style scoped lang="less">
li {
  padding-bottom: 5px;
  padding-top: 8px;
  max-width: 750px;
  margin: 0 auto;
}
.floor {
  display: flex;
  border-top: 1px solid var(--hover-color);
}

.avatar {
  height: 25px;
  width: 25px;
  border-radius: 50%;
}
.comment-main {
  flex: 1;
  padding: 0 4px;
}
.name {
  line-height: 25px;
  height: 25px;
  display: block;
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
i:hover {
  color: var(--theme-color);
  transition: color 0.3s;
  cursor: pointer;
}
.reply-message {
  border-left: 2px solid var(--hover-color);
  padding-left: 5px;
  margin-top: 5px;
  color: var(--unimport-text-color);
  a {
    color: var(--valid-color);
  }
}
a:hover {
  color: var(--theme-color);
  transition: color 0.3s;
}
.content {
  margin-top: 3px;
}
</style>
