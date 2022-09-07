---
title: uniapp uni.$on重复执行的问题
tags: [uniapp]
date: 2022-01-18 14:33:21
categories: [bug,uniapp]
---

- 在子页面传输数据给父页面的时候  需要用到 uni.$emit()
- 然后在父页面的onShow中使用
-  `uni.$on('函数名称', (res) => {})`去接收那个函数的值

 - 但是会发现  子传父只触发了一次  但是`onShow`中的uni.$on执行了多次  
 - 这是因为没有清除监听  
 - 需要在合适的地方(函数结束的地方)`uni.$off('函数名称')`去清除这个监听即可