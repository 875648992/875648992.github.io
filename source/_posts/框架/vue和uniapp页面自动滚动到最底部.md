---
title: vue和uniapp页面自动滚动到最底部
tags: [uniapp,dom]
date: 2021-06-20 16:43:17
categories: [uniapp,js]
---

# vue项目中自动滚动到最底部
## 首先可以通过这个方法  获取到当前滚动的元素是哪一个
这个方法定义`script标签里  `     ` export default外面`
然后滚动的时候可以在控制台中打印出当前滚动的什么元素

```javascript
function findScroller(element) {
    element.onscroll = function() { console.log(element)} 

    Array.from(element.children).forEach(findScroller);
}

findScroller(document.body);  
```
然后找到这个元素  添加`ref='list'`
## 这个时候就有两种方法   
1.第一种就是给这个元素的scrollTop`元素距离页面顶部的距离`设置一个超大的值  这样每次输入对话 就会自动滚动到最底部了   但是这个方法不是很建议

2.第二个方法就是给scrollTop设置scrollHeight`当前页面的高度`

```javascript
this.$nextTick(() => {  // 一定要用nextTick
  this.$refs.list.scrollTop = this.$refs.list.scrollHeight
})
```

# uniapp中滚动到最底部
在uniapp中  使用ref会得到undefined   不可以用ref获取dom
推荐使用这个方法
首先给最外面的盒子加一个高度

```css
.wrapper{
       height:auto!important;
   }
```
然后使用内置的api
```javascript
 this.$nextTick(()=>{
          uni.pageScrollTo({
              scrollTop: 2000000,    //滚动到页面的目标位置（单位px）
              duration: 0    //滚动动画的时长，默认300ms，单位 ms
          });
```