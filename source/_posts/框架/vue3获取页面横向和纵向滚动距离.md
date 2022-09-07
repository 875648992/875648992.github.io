---
title: vue3获取页面横向和纵向滚动距离
tags: [vue]
date:  2022-06-14 22:31:08
categories: [vue]
---

 - 创建一个hooks文件保存进去就行
```javascript
import { ref, onMounted, onBeforeMount } from 'vue'
export function useWindowScroll () {
  const x = ref(0)
  const y = ref(0)
  const onScroll = () => {
    x.value = document.documentElement.scrollLeft
    y.value = document.documentElement.scrollTop
  }
  onMounted(() => {
    window.addEventListener('scroll', onScroll, true)
  })
  onBeforeMount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    x, y
  }
}

```

使用的时候就可以直接拿到横向或纵向滚动距离的值
