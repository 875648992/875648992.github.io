---
title: jenkins构建项目后发现访问不到静态资源
tags: [elememtUI]
date: 2021-12-10 17:04:14
categories: [vue]
---

> 遇到一个需求  日期选择器只能选6-12月  我使用的是element的日期选择器 

![在这里插入图片描述](https://img-blog.csdnimg.cn/16079be701554e929846d1235cf059fb.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_17,color_FFFFFF,t_70,g_se,x_16)
 ## 解决方法  - 上代码:

```javascript
 <el-date-picker  :picker-options="pickerOptions" v-model="xxx" type="month" value-format="yyyy-MM" />


data(){
  return{
	pickerOptions:{
        disabledDate(time){  //disabledDate表示禁用  time获取的是中国标准时间
          return (time.getMonth() + 1)<6  // 转化成月份  返回比6月小的月份禁用他
        }
      },
	}
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/8d36f8b8a1d64af6aa14abd5a2c7a9c5.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)

 