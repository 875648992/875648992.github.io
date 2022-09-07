---
title: echarts图表数据刷新后label文字不变化的问题以及解决方案
tags: [echarts]
date: 2021-08-12 10:11:03
categories: [bug]
---

![在这里插入图片描述](https://img-blog.csdnimg.cn/6cbc4093dc9a461980e080709e369759.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)

>  - 使用select切换数据  得到新的数据后给serise里的data赋值 
>   - 会发现图表的数据是变了  但是后面的数值不变  
>   -- 数值是用series里的label显示的
>  - ( 图表的数据变成了60多  但是后面的值还是上一次的值381 )

- 找了很久的方法 网上有说用setOptions,有说用$set
- 但是我都试过了  都没有用  
--   因为图表的数据是变了 只是后面的值没有变化 
--  所以应该不是这个的问题

后来想到一个方法  每次下拉框切换的时候  使得当前的echart强制更新就行 ( 第一次渲染组件是正确的数值,切换后才不更新 ) 所以每次只要更新后就会显示当前的数值了

```javascript
// 这个echarts是封装了的  反正就是给这个组件添加一个v-if
// 使用v-if的切换去重新渲染组件
  <Echart v-if="upData" :options="pubToilet"
     id="pubToilet" height="100%" width="100%"></Echart>

data(){
	return{
		upData:true //默认是渲染的
	}
}

methods:{
	change(){
		this.upData = false
		//给serise的data赋值操作
	 //this.$nextTick可实现在DOM 状态更新后，执行传入的方法
		this.$next(()=>{
			this.upData = true
		})
	}
}
```
>具体文字不更新的问题还没有找到原因 
>目前是我自己的解决方案 可以解决一下燃眉之急