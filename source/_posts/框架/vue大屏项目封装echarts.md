---
title: vue大屏项目封装echarts
tags: [echarts]
date: 2021-08-04 11:14:32
categories: [大屏项目,前端工程化]
---

在写大屏项目的时候 需要引入特别多的echarts图表  
所以可以把echarts封装一下  方便使用

- 在main.js 中首先导入echarts(需要安装)
- 然后把echatrs挂在到vue的原型上  这样就可以直接使用this.$echarts访问到实例了

```javascript
//引入echart
import echarts from 'echarts'
import 'echarts-liquidfill'
Vue.prototype.$echarts = echarts
```
然后创建一个`utils/resizeMixin.js`文件去做大屏的自适应图表
并且创建一个`utils/index`文件做一个防抖的函数  去控制屏幕大小变化的频率
- resizeMixin.js文件
```javascript
// 混入代码 resize-mixins.js
import { debounce } from '@/utils';
const resizeChartMethod = '$__resizeChartMethod';

export default {
  data() {
    // 在组件内部将图表 init 的引用映射到 chart 属性上
    return {
      chart: null,
    };
  },
  created() {
    window.addEventListener('resize', this[resizeChartMethod], false);
  },
  activated() {
    // 防止 keep-alive 之后图表变形
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('reisze', this[resizeChartMethod]);
  },
  methods: {
    // 防抖函数来控制 resize 的频率
    [resizeChartMethod]: debounce(function() {
      if (this.chart) {
        this.chart.resize();
      }
    }, 300),
  },
};

```
- utils/index.js文件

```javascript
export function debounce(fn, delay) {
  var timer;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}
```
然后就是封装echarts了
创建一个echarts的文件夹  里面一个`index.vue`是组件  还有一个`theme.json`是主题文件
- index.vue

```javascript
<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import tdTheme from './theme.json' // 引入默认主题
import resizeMixins from "@/utils/resizeMixins";
import '../map/fujian.js'

export default {
  name: 'echart',
  mixins: [resizeMixins],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '2.5rem'
    },
    options: {
      type: Object,
      default: ()=>({})
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    options: {
      handler (options) {
        // 设置true清空echart缓存
        this.chart.setOption(options, true)
      },
      deep: true
    }
  },
  mounted () {
    this.$echarts.registerTheme('tdTheme', tdTheme); // 覆盖默认主题
    this.initChart();
  },
  methods: {
    initChart () {
      // 初始化echart
      this.chart = this.$echarts.init(this.$el, 'tdTheme')
      this.$emit('myCharts', this.chart)  // 把实例丢出来
      this.chart.setOption(this.options, true)
    }
  }
}
</script>

<style>
</style>

```
- theme.json

```javascript
{
  "color": ["#2d8cf0", "#19be6b", "#ff9900", "#E46CBB", "#9A66E4", "#ed3f14"],
  "backgroundColor": "rgba(0,0,0,0)",
  "textStyle": {},
  "title": {
    "textStyle": {
      "color": "#516b91"
    },
    "subtextStyle": {
      "color": "#93b7e3"
    }
  },
  "line": {
    "itemStyle": {
      "normal": {
        "borderWidth": "2"
      }
    },
    "lineStyle": {
      "normal": {
        "width": "2"
      }
    },
    "symbolSize": "6",
    "symbol": "emptyCircle",
    "smooth": true
  },
  "radar": {
    "itemStyle": {
      "normal": {
        "borderWidth": "2"
      }
    },
    "lineStyle": {
      "normal": {
        "width": "2"
      }
    },
    "symbolSize": "6",
    "symbol": "emptyCircle",
    "smooth": true
  },
  "bar": {
    "itemStyle": {
      "normal": {
        "barBorderWidth": 0,
        "barBorderColor": "#ccc"
      },
      "emphasis": {
        "barBorderWidth": 0,
        "barBorderColor": "#ccc"
      }
    }
  },
  "pie": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "scatter": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "boxplot": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "parallel": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "sankey": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "funnel": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "gauge": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "emphasis": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    }
  },
  "candlestick": {
    "itemStyle": {
      "normal": {
        "color": "#edafda",
        "color0": "transparent",
        "borderColor": "#d680bc",
        "borderColor0": "#8fd3e8",
        "borderWidth": "2"
      }
    }
  },
  "graph": {
    "itemStyle": {
      "normal": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "lineStyle": {
      "normal": {
        "width": 1,
        "color": "#aaa"
      }
    },
    "symbolSize": "6",
    "symbol": "emptyCircle",
    "smooth": true,
    "color": ["#2d8cf0", "#19be6b", "#f5ae4a", "#9189d5", "#56cae2", "#cbb0e3"],
    "label": {
      "normal": {
        "textStyle": {
          "color": "#eee"
        }
      }
    }
  },
  "map": {
    "itemStyle": {
      "normal": {
        "areaColor": "#f3f3f3",
        "borderColor": "#516b91",
        "borderWidth": 0.5
      },
      "emphasis": {
        "areaColor": "rgba(165,231,240,1)",
        "borderColor": "#516b91",
        "borderWidth": 1
      }
    },
    "label": {
      "normal": {
        "textStyle": {
          "color": "#000"
        }
      },
      "emphasis": {
        "textStyle": {
          "color": "rgb(81,107,145)"
        }
      }
    }
  },
  "geo": {
    "itemStyle": {
      "normal": {
        "areaColor": "#f3f3f3",
        "borderColor": "#516b91",
        "borderWidth": 0.5
      },
      "emphasis": {
        "areaColor": "rgba(165,231,240,1)",
        "borderColor": "#516b91",
        "borderWidth": 1
      }
    },
    "label": {
      "normal": {
        "textStyle": {
          "color": "#000"
        }
      },
      "emphasis": {
        "textStyle": {
          "color": "rgb(81,107,145)"
        }
      }
    }
  },
  "categoryAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#cccccc"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "textStyle": {
        "color": "#fff"
      }
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "valueAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#cccccc"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "textStyle": {
        "color": "#fff"
      }
    },
    "splitLine": {
      "show": false,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "logAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#cccccc"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "textStyle": {
        "color": "#999999"
      }
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "timeAxis": {
    "axisLine": {
      "show": true,
      "lineStyle": {
        "color": "#cccccc"
      }
    },
    "axisTick": {
      "show": false,
      "lineStyle": {
        "color": "#333"
      }
    },
    "axisLabel": {
      "show": true,
      "textStyle": {
        "color": "#999999"
      }
    },
    "splitLine": {
      "show": true,
      "lineStyle": {
        "color": ["#eeeeee"]
      }
    },
    "splitArea": {
      "show": false,
      "areaStyle": {
        "color": ["rgba(250,250,250,0.05)", "rgba(200,200,200,0.02)"]
      }
    }
  },
  "toolbox": {
    "iconStyle": {
      "normal": {
        "borderColor": "#999"
      },
      "emphasis": {
        "borderColor": "#666"
      }
    }
  },
  "legend": {
    "textStyle": {
      "color": "#fff"
    }
  },
  "tooltip": {
    "axisPointer": {
      "lineStyle": {
        "color": "#ccc",
        "width": 1
      },
      "crossStyle": {
        "color": "#ccc",
        "width": 1
      }
    }
  },
  "timeline": {
    "lineStyle": {
      "color": "#8fd3e8",
      "width": 1
    },
    "itemStyle": {
      "normal": {
        "color": "#8fd3e8",
        "borderWidth": 1
      },
      "emphasis": {
        "color": "#8fd3e8"
      }
    },
    "controlStyle": {
      "normal": {
        "color": "#8fd3e8",
        "borderColor": "#8fd3e8",
        "borderWidth": 0.5
      },
      "emphasis": {
        "color": "#8fd3e8",
        "borderColor": "#8fd3e8",
        "borderWidth": 0.5
      }
    },
    "checkpointStyle": {
      "color": "#8fd3e8",
      "borderColor": "rgba(138,124,168,0.37)"
    },
    "label": {
      "normal": {
        "textStyle": {
          "color": "#8fd3e8"
        }
      },
      "emphasis": {
        "textStyle": {
          "color": "#8fd3e8"
        }
      }
    }
  },
  "visualMap": {
    "color": ["#516b91", "#59c4e6", "#a5e7f0"]
  },
  "dataZoom": [
    {
      "type": "inside",
      "backgroundColor": "rgba(0,0,0,0)",
      "dataBackgroundColor": "rgba(255,255,255,0.3)",
      "fillerColor": "rgba(167,183,204,0.4)",
      "handleColor": "#a7b7cc",
      "handleSize": "100%",
      "textStyle": {
        "color": "#333"
      }
    }
  ],
  "markPoint": {
    "label": {
      "normal": {
        "textStyle": {
          "color": "#eee"
        }
      },
      "emphasis": {
        "textStyle": {
          "color": "#eee"
        }
      }
    }
  }
}

```


使用这个组件的方法

```javascript
import Echart from '@/echart' //引入echatrs组件
 components: { //并且注册组件
    Echart,
  },
===================  ===================  ===================  
<Echart  :options="图表的配置" id="可选" height='100%' width="100%"></Echart>
```
