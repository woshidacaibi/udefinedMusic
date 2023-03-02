<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue';
withDefaults(defineProps<{ src: string; lazy?: boolean }>(), {
  lazy: false,
});
</script>

<template>
  <el-image class="load-img" :src="src" :lazy="lazy">
    <template #placeholder>
      <div class="image-slot">
        <!--        骨架框-->
        <el-skeleton :throttle="500" animated style="width: 100%; height: 100%">
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </template>
        </el-skeleton>
      </div>
    </template>
    <template #error>
      <div class="image-slot">
        <el-icon><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<style scoped>
.load-img {
  width: 100%;
  height: 100%;
}
.image-slot {
  width: 100%;
  height: 100%;
}
</style>
