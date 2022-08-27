---
title: 利用vue2.x、echarts画散点地图
tags: [vue,echarts]
date: 2022-02-21 14:52:58
categories: [大屏项目]
---
一、我们需要安装echarts、下载China.js文件

这是我的微信公众号全是技术文章：

    1.echarts安装方法：

        npm install echarts --save
        main.js里面          import echarts from 'echarts'
                            Vue.prototype.$echarts = echarts
    2.china.js下载地址：

        https://github.com/ecomfe/echarts/blob/master/map/js/china.js（echarts官方github地址）

        现在完之后 放到static下面如图所示：

二、请记住，不管用echarts画柱形图、扇形图、环形图、地图、散点图、、、最外面一定要有个：有固定高度的容器

    1.

    2.

    3.demo写完之后，我们需要把地图加载进来，这里我们直接使用es6的import就可以

     

    4.在methods:{}中定义一个方法来初始化echart

    

    5.在initEchart这个函数中

       

    6.自定义数据myData

    

7.用setOption执行myChartMap



8.我们需要新建一个坐标系、以及一些触发的事件、一些样式优化等文档中全都有说明，我就简单举例写几种，并不全部列出来。

直接上全部js的代码
```javascript
var myChartMap = this.$echarts.init(document.getElementById('map'));
        // 地图上数据,经度和纬度，最后一个是销量，或者说你要统计的当地数据个数，这些都是后台返给你的你想在哪显示就在哪显示
        var myData = [
          {name: '分店1', value: [121.15, 31.89, 90]},
          {name: '分店2', value: [109.781327, 39.608266, 120]},
          {name: '分店3', value: [120.38, 37.35, 142]},
          {name: '分店4', value: [122.207216, 29.985295, 123]},
          {name:'分店5',value:[110.245672,30.7787677,566]}
        ]
地图上数据,经度和纬度，最后一个是销量，或者说你要统计的当地数据个数，这些都是后台返给你的你想在哪显示就在哪显示
        var myData = [
          {name: '分店1', value: [121.15, 31.89, 90]},
          {name: '分店2', value: [109.781327, 39.608266, 120]},
          {name: '分店3', value: [120.38, 37.35, 142]},
          {name: '分店4', value: [122.207216, 29.985295, 123]},
          {name:'分店5',value:[110.245672,30.7787677,566]}
        ]
//现在有好几种坐标系，谷歌、百度、国家地理测绘局、高德、搜狗等坐标系，
//每种坐标系的经纬度都稍稍有偏差，这可能决定你定位的位置的精确性，只要保证前后端坐标系统一就能保证定位的准确性
 
        myChartMap.setOption({
 
          // 新建一个地理坐标系 geo ，
          geo: {
            map: 'china',//地图类型为中国地图,要是世界那就是world,要是省市区：例如beijing、shanghai
            itemStyle:{ // 定义样式
              normal:{       // 普通状态下的样式
                areaColor:'#6699CC',
                borderColor: '#fff',
              },
              emphasis: {         // 高亮状态下的样式
                areaColor: '#e9fbf1'
              }
            }
 
          },
          // hover显示目标数据
          tooltip : {
            trigger: 'item',
            // tooltip的trigger的值可以有'item'、'axis'。
            //'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
            textStyle:{
              align:'left'
            },
          },
          // 图表背景色
          backgroundColor: '#404a59',  
          // 标志颜色
          color:'red',
          // 新建散点图series
          series:[{
            name:'',//series名称
            type:'scatter',//为散点类型
            coordinateSystem: 'geo',// series坐标系类型
            data:myData,
            symbol:'pin',
            symbolSize:[20,20]
          }],
 
          // 添加视觉映射组件
          visualMap: {
            type: 'continuous', // 连续型
            min: 0,           // 值域最小值，必须参数
            max: 600,     // 值域最大值，必须参数
            calculable: true, // 是否启用值域漫游
            inRange: {
              color: ['red']
               // 指定数值从低到高时的颜色变化
            },
            textStyle: {
              color: '#fff' // 值域控件的文本颜色
            }
          }
        })
      },
      ```
现在有好几种坐标系，谷歌、百度、国家地理测绘局、高德、搜狗等坐标系，
//每种坐标系的经纬度都稍稍有偏差，这可能决定你定位的位置的精确性，只要保证前后端坐标系统一就能保证定位的准确性
```javascript
        myChartMap.setOption({

          // 新建一个地理坐标系 geo ，
          geo: {
            map: 'china',//地图类型为中国地图,要是世界那就是world,要是省市区：例如beijing、shanghai
            itemStyle:{ // 定义样式
              normal:{       // 普通状态下的样式
                areaColor:'#6699CC',
                borderColor: '#fff',
              },
              emphasis: {         // 高亮状态下的样式
                areaColor: '#e9fbf1'
              }
            }

          },
          // hover显示目标数据
          tooltip : {
            trigger: 'item',
            // tooltip的trigger的值可以有'item'、'axis'。
            //'item':数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
            //'axis':坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
            textStyle:{
              align:'left'
            },
          },
          // 图表背景色
          backgroundColor: '#404a59',  
          // 标志颜色
          color:'red',
          // 新建散点图series
          series:[{
            name:'',//series名称
            type:'scatter',//为散点类型
            coordinateSystem: 'geo',// series坐标系类型
            data:myData,
            symbol:'pin',
            symbolSize:[20,20]
          }],

          // 添加视觉映射组件
          visualMap: {
            type: 'continuous', // 连续型
            min: 0,           // 值域最小值，必须参数
            max: 600,     // 值域最大值，必须参数
            calculable: true, // 是否启用值域漫游
            inRange: {
              color: ['red']
               // 指定数值从低到高时的颜色变化
            },
            textStyle: {
              color: '#fff' // 值域控件的文本颜色
            }
          }
        })
      },
```
9.我们在methods中创建了一个initEcharts()函数，我们要在mounted（）{}中调用（因为需要demo渲染完毕之后才能找到元素）


