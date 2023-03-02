import { ref, reactive } from 'vue';
import axios from 'axios';
export const localAxios = axios.create({
  timeout: 15000,
  baseURL: '',
});

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
import qs from 'qs';
export function ajax(method: string, url: string, params: object = {}) {
  const data = ref<any>(null);
  const isLoad = ref(false);
  const errorMessage = ref(null);
  if (method.toUpperCase() === 'GET') {
    axios({
      method: 'GET',
      url,
      params,
    })
      .then((res) => {
        data.value = res.data;
        isLoad.value = true;
      })
      .catch((err) => {
        isLoad.value = true;
        errorMessage.value = err.message;
      });
  } else if (method.toUpperCase() === 'POST') {
    axios({
      method: 'POST',
      url,
      data: qs.stringify(params),
    })
      .then((res) => {
        isLoad.value = true;
        data.value = res.data;
      })
      .catch((err) => {
        isLoad.value = true;
        errorMessage.value = err.message;
      });
  }
  return { data, isLoad, errorMessage };
}
export async function asyncAjax(
  method: string,
  url: string,
  params: object = {}
) {
  let data: any = null;
  let errorMessage: any = null;
  if (method.toUpperCase() === 'GET') {
    const res = await axios({
      method: 'GET',
      url,
      params,
    }).catch((err) => {
      errorMessage = err;
    });
    data = res;
    if (errorMessage || data.data.code !== 200) {
      errorMessage = '未知错误';
    }
  } else if (method.toUpperCase() === 'POST') {
    const res = await axios({
      method: 'POST',
      url,
      data: qs.stringify(params),
    }).catch((err) => {
      errorMessage = err.message;
    });
    data = res;
    if (data.data.code !== 200 || errorMessage) {
      errorMessage = '未知错误';
    }
  }
  return { data, errorMessage };
}

export function test() {
  const data = ref<any>(null);
  const isLoad = ref(false);
  const errorMessage = ref<any>(null);
  setTimeout(() => {
    isLoad.value = true;
    // errorMessage.value = '456';
  }, 1000);
  return { data, isLoad, errorMessage };
}
export async function asyncTest() {
  const data = ref<any>(null);
  const isLoad = ref(false);
  const errorMessage = ref<any>(null);
  const a = new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('First');
      isLoad.value = true;
      // @ts-ignore
      resolve();
    }, 1000);
  });
  await a;
  return { data, isLoad, errorMessage };
}
