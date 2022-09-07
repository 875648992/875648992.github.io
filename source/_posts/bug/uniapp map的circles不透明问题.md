---
title: uniapp map的circles不透明问题
tags: [uniapp]
date: 2021-10-21 17:51:31
categories: [bug,uniapp]
---

在做地图的时候  绘制圆形地块发现背景色不透明  rgba也无效
![在这里插入图片描述](https://img-blog.csdnimg.cn/5ee6e70e2da54eb8a0e84d5edea8efe6.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)

研究了很久发现十六进制的颜色后两位可以控制透明色  官方写的是AA(不透明)

```javascript
 circles: [
          {
            latitude: 31.15775526258681, //纬度
            longitude: 121.4210634114583, //经度
            fillColor: '#9db0de6A ',
            radius: 1000,
            strokeWidth: 2,
            color: '#00aaff'
          }
        ],
```
就比如#9db0de6A  6A就是控制透明的  可以5A 4A等
![在这里插入图片描述](https://img-blog.csdnimg.cn/e1a25f3c40ff40c0b346a072ea2e98c8.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
