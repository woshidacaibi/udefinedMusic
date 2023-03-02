<template>
  <div class="left-container">
    <ScrollBar class="scroll-container">
      <CollapsibleMenu
        :is-collapse="status.isCollapse"
        header-height="40px"
        icon-width="40px"
      >
        <p class="classifyName">发现</p>
        <router-link :to="{ name: 'index' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-zhuye1"></i>
            </template>
            <template v-slot:title>
              <span>综合推荐</span>
            </template>
          </CollapsibleItem>
        </router-link>
        <router-link :to="{ name: 'moreVideo' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-shipin2"></i>
            </template>
            <template v-slot:title>
              <span>推荐视频</span>
            </template>
          </CollapsibleItem>
        </router-link>
        <router-link :to="{ name: 'moreMv' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-MV"></i>
            </template>
            <template v-slot:title>
              <span>推荐MV</span>
            </template>
          </CollapsibleItem>
        </router-link>
        <p class="classifyName">美化</p>
        <router-link to="/theme">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-zhuti"></i>
            </template>
            <template v-slot:title>主题</template>
          </CollapsibleItem>
        </router-link>
        <p class="classifyName">歌单</p>
        <CollapsibleItem>
          <template v-slot:icon>
            <i class="iconfont icon-songlist"></i>
          </template>
          <template v-slot:title>我创建的歌单</template>
          <template v-slot:content>
            <div>
              <my-playlists></my-playlists>
            </div>
          </template>
        </CollapsibleItem>
        <CollapsibleItem>
          <template v-slot:icon>
            <i class="iconfont icon-gedanbiaoqian"></i>
          </template>
          <template v-slot:title>我收藏的歌单</template>
          <template v-slot:content
            ><div>
              <sub-playlists></sub-playlists></div
          ></template>
        </CollapsibleItem>
        <p class="classifyName">收藏</p>
        <router-link :to="{ name: 'subAlbums' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-zhuanji"></i>
            </template>
            <template v-slot:title>收藏的专辑</template>
            <template v-slot:content> </template>
          </CollapsibleItem>
        </router-link>
        <router-link :to="{ name: 'subArtists' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-zuozhe1"></i>
            </template>
            <template v-slot:title>收藏的歌手</template>
            <template v-slot:content> </template>
          </CollapsibleItem>
        </router-link>
        <router-link :to="{ name: 'subVideos' }">
          <CollapsibleItem>
            <template v-slot:icon>
              <i class="iconfont icon-shipin"></i>
            </template>
            <template v-slot:title>收藏的视频</template>
            <template v-slot:content> </template>
          </CollapsibleItem>
        </router-link>
      </CollapsibleMenu>
    </ScrollBar>
    <div class="control-panel">
      <el-tooltip
        :hide-after="0"
        content="展开"
        effect="light"
        placement="right"
      >
        <i
          v-show="status.isCollapse"
          @click="show"
          class="iconfont icon-youjiantou1"
        ></i>
      </el-tooltip>
      <el-tooltip
        :hide-after="0"
        content="收起"
        effect="light"
        placement="right"
      >
        <i
          v-show="!status.isCollapse"
          @click="hidden"
          class="iconfont icon-zuojiantou1"
        ></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { collapseMenu } from '@/stores/panelStaus';
import CollapsibleMenu from '@/basic/Menu/CollapsibleMenu.vue';
import CollapsibleItem from '@/basic/Menu/CollapsibleItem.vue';
import MyPlaylists from '@/components/LeftPlaylists/MyPlaylists.vue';
import SubPlaylists from '@/components/LeftPlaylists/SubPlaylists.vue';
import { storeToRefs } from 'pinia';
import { accountStore } from '@/stores/user';
import { getPlaylist, getLikeList } from '@/hooks/user';
import { watch } from 'vue';
const { userInfo, userPlaylists, likeIdList } = storeToRefs(accountStore());
const store = collapseMenu();
const status = store.collapseStatus[store.initMenu('left', true)];
function show() {
  status.isCollapse = false;
}
function hidden() {
  status.isCollapse = true;
}
// 监听用户信息，获取用户信息后就获取用户歌单
watch(
  userInfo,
  async () => {
    if (userInfo.value) {
      userPlaylists.value = await getPlaylist(userInfo.value.userId);
      likeIdList.value = await getLikeList(userInfo.value.userId);
    }
  },
  { immediate: true, deep: true }
);

show();
</script>

<style lang="less" scoped>
.scroll-container {
  padding-bottom: 30px;
}
.iconfont {
  font-size: 20px;
}
.left-container {
  position: relative;
  flex-shrink: 0;
  height: 100%;
  border-right: 1px solid var(--layout-border-color);
  transition: width 0.5s;
  padding-left: 6px;
  padding-top: 6px;
}
.classifyName {
  padding-top: 10px;
  color: var(--unimport-text-color);
}
.control-panel {
  position: absolute;
  bottom: 0;
  right: 6px;
  border-radius: 10px;
  .iconfont {
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }
}
.control-panel:hover {
  transition: color 0.2s;
  background-color: var(--hover-color);
  color: var(--theme-color);
}
.icon-MV {
  font-size: 16px;
}
</style>
