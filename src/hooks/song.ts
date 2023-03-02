import { asyncAjax } from '@/hooks/ajax';
import { getSongUrl } from '@/hooks/audioPlayer';
import { ElMessage, ElMessageBox } from 'element-plus';
import { loginStore } from '@/stores/login';
import index from '@/stores/index';
import { storeToRefs } from 'pinia';
const { loginStatus } = storeToRefs(loginStore(index));
export async function getSongDetail(id: string | number) {
  const res = await asyncAjax('get', '/song/detail', { ids: id });
  if (res.data.data.code === 200) {
    return res.data.data.songs;
  } else {
    ElMessage.warning('获取歌曲信息失败，请稍后再试');
    return null;
  }
}
export async function likeSong(id: string | number, like: boolean) {
  if (!loginStatus.value) {
    ElMessage.warning('请登陆后再试');
    return false;
  }
  const res = await asyncAjax('get', '/like', {
    id,
    like,
    timestamp: Date.now(),
  });
  return res;
}
export async function downloadSong(id: string | number, name?: string) {
  const urlData = await getSongUrl(id);
  if (!name) {
    name = '新建任务';
  }
  let build = true;
  if (!urlData) {
    ElMessage.warning('建立下载连接失败');
    return;
  }
  if (urlData.freeTrialInfo) {
    build = false;
    ElMessageBox.confirm(
      '当前下载的歌曲是vip试听版本，不是歌曲全部内容，是否继续下载',
      '提示',
      {
        confirmButtonText: '下载',
        cancelButtonText: '取消',
        showClose: false,
      }
    )
      .then(() => {
        buildTask(urlData.url, name!);
      })
      .catch(() => {});
  }
  if (build) buildTask(urlData.url, name!);
}
function buildTask(url: string, name: string) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      // a.style.display = 'none';
      // 使用获取到的blob对象创建的url
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      // 指定下载的文件名
      a.download = name + '.mp3';
      a.click();
      document.body.removeChild(a);
      // 移除blob对象的url
      window.URL.revokeObjectURL(url);
    });
}
