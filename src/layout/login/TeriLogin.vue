<template>
  <div class="login-container">
    <div class="container">
      <span class="close"
        ><i class="iconfont icon-guanbi" @click="showLogin = false"></i
      ></span>
      <div ref="formBox" class="form-box">
        <!-- 二维码 -->
        <div ref="QRBox" class="QR-box hidden">
          <h1>二维码登录</h1>
          <div style="position: relative">
            <img v-if="QRimg" :src="QRimg" alt="" />
            <div
              v-if="QRstatus.code === 800"
              class="qr-hide-cover"
              @click="refreshQRCode"
            >
              <span>二维码失效了捏，点我重新刷新</span>
            </div>
          </div>
          <span class="tip">{{ QRstatus.msg }}</span>
          <span class="tip-bottom">(推荐，安全捏)</span>
        </div>
        <!-- 登录 -->
        <div ref="phoneBox" class="phone-box">
          <h1>手机登录</h1>
          <input type="text" v-model="phone" placeholder="手机号" />
          <input
            v-if="method"
            type="text"
            v-model="value"
            placeholder="验证码"
          />
          <input
            v-else
            :type="method ? 'text' : 'password'"
            v-model="value"
            placeholder="密码"
          />
          <div class="switch">
            <span ref="mp" @click="method = false">密码</span>
            <el-switch
              v-model="method"
              class="mb-2"
              style="
                --el-switch-on-color: #ae72bb;
                --el-switch-off-color: #ae72bb;
              "
            />
            <span ref="mc" class="switchActive" @click="method = true"
              >验证码</span
            >
          </div>
          <button @click="pLogin">登录</button>
        </div>
      </div>
      <div class="con-box left">
        <h2>扫描二维码登录</h2>
        <img :src="loginTip" alt="" />
        <p>没下载客户端？手机号登录👇</p>
        <button @click="toPhone">去登录</button>
      </div>
      <div class="con-box right">
        <h2>验证码登录</h2>
        <img v-if="status === 0" style="margin: 20px 0" :src="start" alt="" />
        <img style="margin: 20px 0" v-if="status === 1" :src="active" alt="" />
        <img style="margin: 20px 0" v-if="status === 2" :src="end" alt="" />
        <button
          ref="sendCode"
          style="margin-bottom: 3%"
          @click="sendCaptcha"
          :disabled="status !== 0"
        >
          <template v-if="sendInterval && status === 2"
            >发送成功({{ sendInterval }})</template
          >
          <template v-else-if="status === 1">发送中</template>
          <template v-else>发送验证码</template>
        </button>
        <p>未绑定手机号？使用二维码登录</p>
        <button @click="toQR">二维码登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { loginStore } from '@/stores/login';
import { storeToRefs } from 'pinia';
import loginTip from '@/assets/img/login/loginTip.png';
import start from '@/assets/img/login/start.png';
import active from '@/assets/img/login/active.gif';
import end from '@/assets/img/login/end.png';
import { ElMessage } from 'element-plus';
import {
  getCaptcha,
  loginByPhone,
  getQRcode,
  getQRstatus,
} from '@/hooks/login';

const { showLogin } = storeToRefs(loginStore());
// 登陆方式切换（二维码或手机登录）
const method = ref(true); // true为验证码登录
const formBox = ref<HTMLElement | null>(null);
const phoneBox = ref<HTMLElement | null>(null);
const QRBox = ref<HTMLElement | null>(null);
// 切换手机登录方式
const mp = ref<HTMLElement | null>(null);
const mc = ref<HTMLElement | null>(null);
watch(method, () => {
  if (mp.value && mc.value) {
    value.value = '';
    mc.value.classList.toggle('switchActive');
    mp.value.classList.toggle('switchActive');
  }
});
function toQR() {
  if (formBox.value) {
    formBox.value.style.transform = 'translateX(80%)';
  }
  phoneBox.value && phoneBox.value.classList.add('hidden');
  QRBox.value && QRBox.value.classList.remove('hidden');
}
function toPhone() {
  if (formBox.value) {
    formBox.value.style.transform = 'translateX(0%)';
  }
  phoneBox.value && phoneBox.value.classList.remove('hidden');
  QRBox.value && QRBox.value.classList.add('hidden');
}
// 手机登录模块
const phone = ref('');
const value = ref('');
const status = ref(0);
const sendInterval = ref(0);
// 发送验证码
function sendCaptcha() {
  const reg = /^1[3-9]\d{9}$/;
  if (reg.test(phone.value)) {
    const { isLoad, errorMessage } = getCaptcha(phone.value);
    const tmpWatch = watch(isLoad, (newVal) => {
      if (newVal) {
        // 如果发送次数过多，或被封了
        if (errorMessage.value) {
          ElMessage({
            message: '服务器拒绝，请稍后再试',
            type: 'warning',
            offset: 20,
            showClose: true,
          });
        } else {
          // GIF播放过程
          sendInterval.value = 60;
          status.value = 1;
          setTimeout(() => {
            // GIF播放完成发送
            status.value = 2;
            const tmp = setInterval(() => {
              sendInterval.value--;
              if (sendInterval.value === 0) {
                clearInterval(tmp);
                status.value = 0;
              }
            }, 1000);
          }, 1400);
        }
        tmpWatch();
      }
    });
  } else {
    ElMessage({
      message: '手机号码格式错误',
      type: 'error',
      offset: 20,
      showClose: true,
    });
  }
}
// 手机登录
async function pLogin() {
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    ElMessage({
      message: '手机号格式错误',
      type: 'error',
    });
    return;
  }
  if (method.value) {
    if (!/^[0-9]{4}$/.test(value.value)) {
      ElMessage({
        message: '验证码格式错误',
        type: 'error',
      });
      return;
    }
  } else {
    if (!/^\S{8,20}$/.test(value.value)) {
      ElMessage({
        message: '密码格式错误',
        type: 'error',
      });
      return;
    }
  }
  const { errorMessage } = await loginByPhone(
    phone.value,
    value.value,
    method.value
  );
  if (errorMessage) {
    ElMessage({
      message: '网络拥挤，请尝试二维码登录',
      type: 'warning',
    });
  }
}

// 二维码登录模块
const QRimg = ref<null | string>(null);
const QRstatus = reactive({ msg: '', code: -1 });
async function refreshQRCode() {
  QRimg.value = await getQRcode();
  const timer = setInterval(async () => {
    await getStatus();
    if (QRstatus.code === 800 || QRstatus.code === 803) {
      clearInterval(timer);
    }
  }, 1000);
}
async function getStatus() {
  const { msg, code } = await getQRstatus();
  QRstatus.msg = msg;
  QRstatus.code = code;
}
refreshQRCode();
</script>

<style lang="less" scoped>
button {
  transition: all 0.75s;
}
.login-container {
  position: absolute;
  width: 100vw;
  z-index: 1203;
  top: 0;
  left: 0;
}
.login-container:before {
  padding-top: 100vh;
  display: block;
  width: 100%;
  content: '';
  background-color: rgba(0, 0, 0, 0.5);
}
.login-panel {
  position: absolute;
  z-index: 1;
  width: 820px;
  height: 430px;
  left: calc((100vw - 820px) / 2);
  top: calc((100vh - 430px) / 2);
  background-color: white;
  border-radius: 8px;
  padding: 52px 65px 29px 92px;
}
.login-panel-container {
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(3, 3, 3, 0.43);
  z-index: 100;
  width: 100%;
  height: 100%;
}
.close {
  float: right;
  margin-top: 5px;
  margin-right: 10px;
  .iconfont {
    font-size: 20px;
  }
}
.container {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: #fff;
  width: 650px;
  height: 415px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0, 1);
}
.form-box {
  position: absolute;
  top: -10%;
  left: 5%;
  background-color: #d3b7d8;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: 0.5s ease-in-out;
}
.QR-box,
.phone-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  animation: fadeIn 0.75s linear;
  img {
    width: 300px;
    height: 300px;
  }
  .tip {
    width: 200px;
    color: white;
    text-align: center;
  }
  .tip-bottom {
    width: 200px;
    color: blanchedalmond;
    font-size: 13px;
    text-align: center;
  }
}
.qr-hide-cover {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(3, 3, 3, 0.43);
  width: 300px;
  height: 300px;
  span {
    color: white;
    display: block;
    text-align: center;
    line-height: 300px;
  }
}
.hidden {
  display: none;
  transition: 0.5s;
}
.switch {
  color: #a262ad;
  height: 40px;
  line-height: 40px;
  span {
    padding: 0 10px;
    cursor: pointer;
  }
}
.switchActive {
  color: white;
}
h1 {
  text-align: center;
  margin-bottom: 25px;
  /* 大写 */
  text-transform: uppercase;
  color: #fff;
  /* 字间距 */
  letter-spacing: 5px;
}

input {
  background-color: transparent;
  width: 70%;
  color: #fff;
  border: none;
  /* 下边框样式 */
  border-bottom: 1px solid rgba(255, 255, 255, 0, 4);
  padding: 10px 0;
  text-indent: 10px;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: 2px;
}
.con-box .disabled {
  background-color: #fff;
  border: 1px solid #cccccc;
  color: #9f9f9f;
}
.con-box .disabled:hover {
  background-color: #fff;
  border: 1px solid #cccccc;
  color: #9f9f9f;
  cursor: default;
}
input::placeholder {
  color: #fff;
}

input:focus {
  color: #a262ad;
  outline: none;
  border-bottom: 1px solid #a262ad80;
  transition: 0.5s;
}

input:focus::placeholder {
  opacity: 0;
}

.form-box button {
  width: 70%;
  margin-top: 20px;
  background-color: #f6f6f6;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #a262ad;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box button:hover {
  background-color: #a262ad;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.con-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.con-box.left {
  left: -2%;
}

.con-box.right {
  right: -2%;
  img {
    height: 100px;
  }
}

.con-box h2 {
  color: #8e9aaf;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 4px;
}

.con-box p {
  font-size: 12px;
  letter-spacing: 2px;
  color: #8e9aaf;
  text-align: center;
}

.con-box span {
  color: #d3b7d8;
}

.con-box img {
  width: 120px;
  opacity: 0.9;
  margin: 10px 0;
}
.con-box.right img {
  width: 150px;
  height: 90px;
}
.con-box button {
  margin-top: 3%;
  background-color: #fff;
  color: #a262ad;
  border: 1px solid #d3b7d8;
  padding: 6px 10px;
  border-radius: 5px;
  letter-spacing: 1px;
  outline: none;
  cursor: pointer;
}

.con-box button:hover {
  background-color: #d3b7d8;
  color: #fff;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
