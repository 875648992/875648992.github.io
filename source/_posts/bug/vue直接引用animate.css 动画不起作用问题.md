---
title: vue直接引用animate.css 动画不起作用问题
tags: [vue]
date: 2021-08-10 16:53:30
categories: [bug,动画]
---

场景（原因）：

> 由于vue官网引用的是animate.css 3.5版本，其无法向上兼容最新的animate.css版本，这就导致了直接npm
> install animate.css后，动画压根无法生效。

因此解决方案就是安装对应低版本的animate.css：
安装依赖：

```javascript
npm install animate.css@3.5.1 --save
```
main.js全局引入

```javascript
import animated from "animate.css"
 
Vue.use(animated)
```
