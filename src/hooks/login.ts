import { ajax, asyncAjax } from '@/hooks/ajax';
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
// 二维码key
const currentKey = ref<null | string>(null);
// 登记cookie
function setCookie(data: string) {
  let reg = /\s*Path=\/[^;]*;/g;
  data = data.replace(reg, '');
  reg = /\s*HTTPOnly/g;
  data = data.replace(reg, '');
  data.split(';;').forEach((val: string) => {
    document.cookie = val;
  });
}
// 获取游客身份
// export function getTouristCookie() {
//   const cookieMsg = ajax('get', '/register/anonimous');
//   const cookieWatch = watch(cookieMsg.isLoad, (newVal) => {
//     if (newVal) {
//       setCookie(cookieMsg.data.value.cookie);
//       // 清除监听器
//       cookieWatch();
//     }
//   });
// }
// 获取手机验证码
export function getCaptcha(phone: string) {
  const res = ajax('get', '/captcha/sent', { phone });
  return res;
}
// 手机登录
export async function loginByPhone(
  phone: string,
  value: string,
  method: boolean
) {
  let res;
  if (method) {
    res = await asyncAjax('get', '/login/cellphone', { phone, captcha: value });
  } else {
    res = await asyncAjax('get', '/login/cellphone', {
      phone,
      password: value,
    });
  }
  console.log(res);
  if (res.errorMessage) {
    res.errorMessage = '网络拥堵';
  } else if (!res.errorMessage) {
    setCookie(res.data.data.cookie);
    location.reload();
  }

  return res;
}
// 获取二维码
export async function getQRcode() {
  let res = await asyncAjax('get', '/login/qr/key', { timestamp: Date.now() });
  currentKey.value = res.data.data.data.unikey;
  if (!currentKey.value) return null;
  res = await asyncAjax('get', '/login/qr/create', {
    key: currentKey.value,
    qrimg: true,
    timestamp: Date.now(),
  });
  return res.data.data.data.qrimg ? res.data.data.data.qrimg : null;
}
// 二维码状态
export async function getQRstatus() {
  if (!currentKey.value) {
    return { msg: '二维码加载失败', code: -1 };
  }
  const { data } = await asyncAjax('get', '/login/qr/check', {
    key: currentKey.value,
    timestamp: Date.now(),
  });
  // 登陆时设置cookie
  if (data.data.code === 803) {
    setCookie(data.data.cookie);
    location.reload();
  }
  return { msg: data.data.message, code: data.data.code };
}

// 检查登录身份
export async function checkLogin(loginStatus: any, userInfo: any) {
  const {
    data: { data },
  } = await asyncAjax('get', '/login/status', { timestamp: Date.now() });
  if (data.data.account.status && data.data.account.status === -10) {
    // getTouristCookie();
    loginStatus.value = false;
  } else {
    loginStatus.value = true;
  }
  userInfo.value = data.data.profile;
}

export async function logout() {
  const res = await asyncAjax('get', '/logout');
  location.reload();
}
