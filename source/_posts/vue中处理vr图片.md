---
title: vue中处理vr图片
tags: [vue]
date: 2021-08-31 14:42:01 
categories: [vue,vr]
---

- 首先在html中引入cdn

```javascript
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>

```

- 然后在页面中定义一个div

```javascript
 <div id="panorama">

 mounted () {
    // 参考文档 全景图 https://pannellum.org/
    console.log('www');
    pannellum.viewer('panorama', {
        "type": "equirectangular",
        "autoLoad": true,
        "panorama":'https://pannellum.org/images/tocopilla.jpg', //图片地址
        "pitch":0
    });
```

非常的简单
