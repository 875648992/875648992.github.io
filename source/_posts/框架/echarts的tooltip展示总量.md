---
title: echarts的tooltip展示总量
tags: [echarts]
date: 2021-08-17 17:56:44
categories: [大屏项目]
---

> 有的时候需要tooltip展示总量怎么做呢?
> 下面的代码可以展示x轴当前数据的总和

```javascript
tooltip: {
          trigger: 'axis',
          axisPointer: {            // Use axis to trigger tooltip
            type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
          },
          formatter(a) {
            let res = '';

            let sum = 0;
            // console.log('a=',a)

            a.forEach((item, index) => {
              if (index === 0) {
                res += `${item.axisValue}<br/>`;
              }
              sum += item.value;
              res += `${item.marker} ${item.seriesName} : ${item.value}<br/>`;
              if (index === a.length - 1) {
                res += `合计 : ${sum}`;
              }
            });
            return res;
          }
        },
```
