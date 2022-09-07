---
title: vue初始化全局样式
tags: [css]
date:  2022-02-14 19:55:09
categories: [vue,css]
---
> normalize是CSS重置的现代替代方法

[normalize.css](https://github.com/necolas/normalize.css)

+ 安装normalize.css

```js
yarn add normalize.css
```

+ 使用normalize.css

`main.js` 导入 `normalize.css` 即可。

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

+ import 'normalize.css' //直接导入

createApp(App).use(store).use(router).mount('#app')
```

 