---
title: element-ui表格求和求平均数
tags: [elememtUI]
date: 2021-06-14 14:40:24
categories: [elememtUI,vue]
---

如果只需要求和  就不需要写单独的方法  在table中添加一个属性即可
如果求和和求平均数都有  就要写下面这个方法

```javascript
<el-table :data="paramList" border :summary-method="getSummaries" empty-text="暂无数据" :show-summary="isTotal" sum-text="合计">

data(){
    return{
        sum: ['plantingArea', 'yield'], //求和的字段和求平均数的字段名字
        avg: ['marketFertilizer', 'marketFeed', 'marketFuel', 'marketBinder', 'marketRawMaterial','farmerFertilizer', 'farmerFeed', 'farmerFuel', 'farmerBinder', 'farmerRawMaterial'],
    }
}
//求和求平均数的方法  
 getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '统计';
          return;
        }
        const sumList = this.sum || [];
        const avgList = this.avg || [];
        const values = data.map(item => {
          return Number(item[column.property]);
        });

        if (sumList.includes(column.property) || avgList.includes(column.property)) {
          let totalCount = 0; // 求平均数使用

          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              totalCount++;
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (avgList.includes(column.property) && totalCount) {
            sums[index] = sums[index] / totalCount;
            sums[index] = sums[index].toFixed(2);
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    }
```
