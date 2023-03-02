<template>
  <div class="reply" v-if="loginStatus">
    <load-img :src="userInfo.avatarUrl + '?param=30y30'" class="avatar" />
    <el-input
      v-model="content"
      maxlength="140"
      :placeholder="placeholder"
      show-word-limit
      type="textarea"
      resize="none"
      rows="3"
    />
    <theme-button class="submit" @click="comment">评论</theme-button>
  </div>
  <div
    v-else
    @click="showLogin = true"
    style="cursor: pointer; text-align: center"
  >
    <img :src="unLogin" style="width: 50px" />
    <div class="bounce">请登陆后发表言论。</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { loginStore } from '@/stores/login';
import { accountStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
const { userInfo } = storeToRefs(accountStore());
const { loginStatus, showLogin } = storeToRefs(loginStore());
import { makeComment } from '@/hooks/comment';
import unLogin from '@/assets/img/pleaseLogin.png';
const props = defineProps<{
  placeholder: string;
  source: { id: number | string; type: number; cid?: number };
}>();
const content = ref('');
const emit = defineEmits<{ (e: 'sendComment', val: any): void }>();
async function comment() {
  if (content.value === '') {
    ElMessage.warning('评论内容不能为空');
  }
  const t = props.source.cid ? 2 : 1;
  const data: any = {
    id: props.source.id,
    type: props.source.type,
    t: t,
    content: content.value,
  };
  if (t === 2) data.commentId = props.source.cid;
  const res = await makeComment(data);
  if (res.errorMessage) {
    ElMessage.warning('发表评论失败请稍后再试');
  } else {
    ElMessage.warning('评论成功,1s后将更新评论');
    content.value = '';
    emit('sendComment', props.source);
  }
}
</script>

<style scoped lang="less">
.reply {
  max-width: 750px;
  width: 100%;
  margin: 10px auto;
  text-align: center;
  display: flex;
  align-items: center;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 10px;
}
.el-textarea {
  flex: 1;
}
.submit {
  height: 30px;
  margin-left: 10px;
}
</style>
