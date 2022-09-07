---
title: document.load和document.ready之间的区别
tags: [js]
date: 2022-11-46 23:30:06
categories: [面试题]
---

# 概括
### 页面加载完成有两种事件

 - 1.load是当页面所有资源全部加载完成后（包括DOM文档树，css文件，js文件，图片资源等），执行一个函数

> 问题：如果图片资源较多，加载时间较长，onload后等待执行的函数需要等待较长时间，所以一些效果可能受到影响

 - 2.$(document).ready()是当`DOM文档树`加载完成后执行一个函数 （不包含图片，css等）所以会比load较快执行

> 在原生的jS中不包括ready()这个方法，只有load方法就是onload事件

### 详解
 ### DOM文档解析：

 - 解析html结构
 - 加载脚本和样式文件
 - 解析并执行脚本
 - 构造html的DOM模型      `执行ready`
 - 加载图片等外部资源文件
 - 页面加载完毕               `执行load`

### 比如你需要在所有文件执行完成之后再调用某些函数  就可以额使用load
``` javascript
//document load
$(document).load(function(){
    ...code...
})
```

### 在原生的jS中不包括ready()这个方法，Jquery才有，jquery中有 $().ready(function)。

``` javascript
//document ready
$(document).ready(function(){
    ...code...
})
//document ready 简写
$(function(){
    ...code...
})
```

# 总结：
>如果页面中要是没有图片之类的媒体文件的话ready与load是差不多的，但是页面中有文件就不一样了，所以还是推荐大家在工作中用ready。 如果需要依赖这些外部的资源 就使用load
