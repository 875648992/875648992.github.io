---
title: 让某一个dom滚动到页面顶部
tags: [js,dom]
date: 2021-12-29 19:47:22
categories: [js]
---

- 思路
	1.获取这个dom节点
	2.设置页面的顶部的位置 = 元素距离顶部的位置

```javascript
// 获取dom
  const companyDom = document.querySelector('#company')
  // 设置位置
   document.documentElement.scrollTop = companyDom.offsetTop 
```

- 但是这样会出现一个问题  没有滚动的效果  而是一闪直接到顶部
- 可以使用递归动画的方式来实现

```javascript
   //获取dom
  const companyDom = document.querySelector('#company')
	
       let timer
       let index = 0
       cancelAnimationFrame(timer);
       timer = requestAnimationFrame(function fn() {
            index+=80 //控制速度
            if (index < companyDom.offsetTop) {
               document.documentElement.scrollTop = index
               timer = requestAnimationFrame(fn);
             } else {
                cancelAnimationFrame(timer);
              }
          });
```
 - 但是这个方式其实是有兼容性问题的
 - 最简单的方式
 

```javascript
  const companyDom = document.querySelector('#company').scrollIntoView({
                behavior: "smooth", // 平滑过渡
                block: "center", // 上边框与视窗顶部平齐。默认值
              });
```
