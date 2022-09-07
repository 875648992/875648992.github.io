---
title: vue3中 element Plus中图标的使用
tags: [vue,elementUI]
date:  2022-02-17 17:51:05
categories: [vue,icon]
---
# 安装图片库

```javascript
npm install @element-plus/icons
```
# 注册组件

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElIcons from '@element-plus/icons'

const app = createApp(App)
for (const name in ElIcons){
	app.component(name,(ElIcons as any)[name])
}

app.use(ElementPlus).mount('#app')
```
# 在组件中使用

```javascript
// 结合按钮使用
<el-button type="primary" icon="Edit" >编辑</el-button>
<el-button
  size="mini"
  type="primary"
  class="inline-block"
  icon="More"
  title="详情"
  @click="handleDetail(row.id)"
/>
// 结合el-icon使用
<el-icon>
    <delete />
</el-icon>
```
# 在el-menu组件中动态使用

```javascript
// 路由文件
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home.vue'),
        name: 'Home',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ],
  },
]

// 使用el-menu的文件
<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        router
        :default-active="activeMenu"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="route in menuList" :key="route.path">
          <el-menu-item v-if="!route.children" :index="route.path">
            <el-icon>
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="route.path">
            <template #title>
              <el-icon>
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta.title }}</span>
            </template>
            <el-menu-item
              v-for="subRoute in route.children"
              :key="subRoute.path"
              :index="subRoute.path"
            >
              <el-icon>
                <component :is="subRoute.meta.icon" />
              </el-icon>
              <span>{{ subRoute.meta.title }}</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { routes } from '@/router/index'

export default defineComponent({
  setup() {
    const route = useRoute()
    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })
    const menuList = computed(
      () => (routes as any).find((item: any) => item.path === '/').children
    )
    return { activeMenu, menuList }
  },
})
</script>
```
