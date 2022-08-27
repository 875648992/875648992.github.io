---
title: 使用vue-bootstrap做响应式门户网站
tags: [bootstrap]
date: 2021-12-28 15:17:50
categories: [vue]
---
[点击使用这个项目来修改](https://gitee.com/haosicx/vue-bootstrap/settings#index)

 - vue-bootstrap是基于boostrap封装的库  里面基本内容就和原版一样 [查看文档](https://code.z01.com/bootstrap-vue/docs/components/navbar.html)
 - 只要记住了几个重要的指令就可以完成简单的响应式网站
 
 > ![在这里插入图片描述](https://img-blog.csdnimg.cn/671ad2cd580d419ca3654097cad57be0.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 一般在pc端的屏幕宽度肯定大与768  h5端小于476
 所以在响应式布局的时候会定义2个参数  
 一个是md  一个是cols 

>行 : b-row  列 : b-col  总共为12份 

```javascript
//意思pc端屏幕在大于768的时候使用的md  占一行
//在h5的端屏幕小于576的时候 占半行
 <b-row  md='12' cols='6'>
	//内容
 <b-row />
```
- 还有自带的一些类名可以方便使用 
- 比如margin-top: xxx  可以简写mt-4 (要移动多少就写多少)
- 或者mt-md-4 (只有在md的情况下才会触发这个外边距)
- [点击查看文档](https://www.runoob.com/bootstrap4/bootstrap4-typography.html)