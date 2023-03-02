import { asyncAjax } from '@/hooks/ajax';
import { ElMessage } from 'element-plus';
// 获取热搜
export async function getHotSearch() {
  const res = await asyncAjax('get', '/search/hot');
  if (res.data.data.code === 200) return res.data.data.result.hots;
  else return [];
}

// 搜索建议
export async function getSuggest(kw: string) {
  const res = await asyncAjax('get', '/search/suggest', { keywords: kw });
  if (res.data.data.code === 200) {
    return res.data.data.result;
  } else return false;
}
// 默认搜索关键词
export async function getDefault() {
  const res = await asyncAjax('get', '/search/default');
  if (res.data.data.code === 200) return res.data.data.data;
  else return { realkeyword: '', showKeyword: '' };
}

// 搜索结果
export async function searchKeyword(
  keyword: string,
  offset: number = 0,
  type: number = 1,
  limit: number = 50
) {
  const res = await asyncAjax('get', '/cloudsearch', {
    keywords: keyword,
    offset,
    limit,
    type,
  });
  if (res.data.data.code === 200) {
    console.log(res.data.data);
    return res.data.data.result;
  } else {
    ElMessage.warning('获取信息失败');
    return null;
  }
}
// 返回关键词高亮的HTML语句
export function keywordLight(input: any, keyword: string) {
  let output = keyword;
  if (keyword !== '') {
    /**
     * 使用正则表达式进行全文匹配关键词
     * ig : 表示 全文查找 ,忽略大小写
     *  i : 忽略大小写
     *  g : 全文查找
     *
     * 使用字符串的replace方法进行替换
     * stringObject.replace('被替换的值',替换的值)
     */
    const replaceReg = new RegExp(keyword, 'ig');
    const replaceString = `<b style="color: #ed4014">${keyword}</b>`;
    output = input.replace(replaceReg, replaceString);
  }
  return output;
}
