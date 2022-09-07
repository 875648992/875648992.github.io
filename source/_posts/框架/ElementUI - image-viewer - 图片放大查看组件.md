---
title: ElementUI - image-viewer - 图片放大查看组件
tags: [elememtUI]
date: 2021-08-10 16:32:49
categories: [vue,组件]
---

-  在使用element-ui的图片预览的时候  只能通过el-image的点击才可以触发
-  通过观察element-ui 的image源码发现里面是使用了一个组件  所以我们可以吧这个组件提取出来  这样img标签的点击也可以使用这个预览了  

```javascript
// import引入
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
 
// 在组件内声明
export default {
  components: {
    ElImageViewer
  }
}
```
使用

```javascript
<el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="imgURL"></el-image-viewer>
```
其中urk-list属性需传一个图片url的数组，如果只有一张图片时不会出现左右切换按钮。

用v-if判断是否显示查看图片功能

on-close方法为点击关闭按钮后执行的事件

- 但是在使用的过程中有一个问题
-- 预览图出现的顺序是按照数组的顺序排列的  所以如果你就算点击了第十张图片 显示的第一张图片还是数组的第一张
-- 如果需要显示当前点击的图片排在第一个 	就需要把点击的图片排在数值第一位