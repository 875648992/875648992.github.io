---
title: 前端项目如何自己mock数据
tags: [mock]
date: 2021-06-20 17:02:25
categories: [vue]
---

# 现在的项目大多都是前后端分离的模式
## 如果后端和前端同步开发  那么前端写逻辑的时候就需要自己mock一些数据  
目前有个比较好的网址可以方便mock数据
[faseMOck网站](https://www.fastmock.site/#/)

## 进入网址登录后 首先创建一个项目  然后进入
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620164928171.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
## 然后点击里面的创建接口
mock的数据也可以使用mack.js官网定义的一些api去模拟更多复杂的数据
![!\[在这里插入图片描述\](https://img-blog.csdnimg.cn/20210620165103912.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70](https://img-blog.csdnimg.cn/20210620165415987.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)

## 之后在项目中引用axios发送请求
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620170033121.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210620170113639.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
这样就可以简单的mock数据了