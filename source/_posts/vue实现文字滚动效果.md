---
title: vue实现文字滚动效果
tags: [vue]
date: 2021-08-12 21:20:54
categories: [vue,动画]
---

>这段时间遇到一个需求,  从后端获取到很多人的名字  
需要横向滚动轮播这些名字, 就像商铺门口的电子横幅一样  

查了很多的插件  也没有找到自己想要的感觉  
于是准备自己写一个通用的组件

创建一个`my-marquee.vue`文件

```javascript
<template>
  <div class="wrap">
    <div ref="box" class="box">
      <div ref="marquee" class="marquee">{{text}}</div>
      <div ref="copy" class="copy"></div>
    </div>
    <div ref="node" class="node">{{text}}</div>
  </div>
</template>
<script>
export default {
  name : 'Marquee',
  props: ['lists'], // 父组件传入数据， 数组形式 [ "刘德华","张学友"]
  data () {
    return {
      text: '' // 数组文字转化后的字符串
    }
  },
  methods: {
    move () {
      // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
      let width = this.$refs.node.getBoundingClientRect().width
      this.$refs.copy.innerText = this.text // 文字副本填充
      let distance = 0 // 位移距离
      // 设置位移
      let a = setInterval(() => {
        distance = distance - 1
        // 如果位移超过文字宽度，则回到起点
        if (-distance >= width) {
          distance = 16
        }
       try{
          this.$refs.box.style.transform = 'translateX(' + distance + 'px)'
       }catch{
         clearInterval(a)   
       }
      }, 50)
    }
  },
  // 把父组件传入的arr转化成字符串
  mounted: function () {
    for (let i = 0; i < this.lists.length; i++) {
      this.text += ' ' + this.lists[i]
    }
  },
  // 更新的时候运动
  updated: function () {
    this.move()
  },
  watch:{
    lists:{
      handler(val){
         for (let i = 0; i < this.lists.length; i++) {
            this.text += ' ' + this.lists[i]
          }
      }
    }
  }
}
</script>
<style scoped>

.wrap {
  overflow: hidden;
}

.box {
  width: 80000%;
}

.box div {
  float: left;
}

.marquee {
   margin: 0 16px 0 0;
}

.node {
  position: absolute;
  z-index: -999;
  top: -999999px;
}
</style>

```
然后在需要的地方中使用这个组件即可  参数是一个数组`[ "刘德华","张学友"]`