---
title: echarts的tooltip展示总量
tags: [echarts]
date: 2021-12-9 17:56:44
categories: [大屏项目]
---
 # 分享概括
  - 了解 `配置驱动` 的思想
  - 理解 `Echarts` 基本概念
  - 了解 `graphic` 和 `动画基本玩法`
  - 了解 `Echarts` 基底组件的封装的思路


>当时分享这个目的是无意之间看见抖音的创作中心 , 然后回想到米游社的创作中心
发现抖音的创作中心里面的图表特别的多和详细 , 比如一个折线图表示了一个视频的区间 , 折现图中定制化了一些特别的东西 , 米游社的创作中心的图表相对于比较简单 , 所以就对这个图表进行了一些学习

> 目前echarts在大众研发的心中, 已经是和 `Antd、ElementUI、Bootstrap` 相当的常用第三方库了。
> 一般使用 , 就是能在社区里找到 `Demo`，然后把配置项 Copy 到项目之中

 - 比如有几个问题 : 
 - 现在你找到 Demo 了，但是 Demo 没有显示图例（也就是那些彩色小方块小圆圈，表示各类数据颜色的东西），应该查文档的什么关键词？
   - 如果不熟练的情况下 , 一时想不起来，但肯定能试出来
 - 我想把UI出的一张图片放在饼图的背面，作为背景，应该怎么弄？
   - 先去社区找找 Demo 吧...
   - 这种 Demo 可能不太好找...而且有些场景，Demo 涉及的也不多，比如需要在某个特定位置放一些字，做一些动画，就很麻烦
> 所以我觉得还是先忘记 “万事求DEMO” 的这种方式，来捋一捋 Echarts 这个框架

# 二、做图表，为什么我选 Echarts?
