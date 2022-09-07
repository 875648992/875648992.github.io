---
title: vue项目中excel导出
tags: [vue,excel]
date: 2021-06-13 18:43:08
categories: [bug,组件]
---


**excel导出是需要模板的   
模板下载列举**

```javascript
 async download() {
      const api = 'https://xxx.xxx.cn/20210419/b1c0801f-9377-4e5f-9d72-0032a03b0237.xlsx';  // 下载地址  后端提供
      const a = await document.createElement('a'); // 创建一个a标签
      a.href = api; //跳转到这个标签
      a.click(); //自动点击下载
    },
```
**导入excel文件列举**

```javascript
<a class="el-button el-button--medium uploadBtn relative">导入
  <input ref="fileSelect" class='fileSelect'  
      type="file" // 打开文件选择
      @change="leadingIn"  //文件选择改变的时候触发  也就是选择后确定了触发
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" //上传地址
    />
</a>

 leadingIn(data) {
   //data就是文件  可以做一些判断
   console.log(data)
  }
```

#### 导出功能一般是后端做  前端如何处理呢
- 返回的是二进制流文件  前端需要使用Blob转换格式
- 如果前端转不了格式 导出乱码    提示后端加上需要charset=utf-8


```javascript
async onExport() {
      const param = {  // 传输的字段
        companyName: '',
        legalPerson: ''
      };
       const result = await LeadingEnterprisesService.EXPORTEXCEL(param); //发送请求获取buffer文件
       const blob = new Blob([result], { type: 'application/vnd.ms-excel' });  //转换格式
       const objectUrl = window.URL.createObjectURL(blob); // 创建URL
       location.href = objectUrl; // 跳转到这个链接就会开启下载
      URL.revokeObjectURL(objectUrl); // 释放内存
    },
```

#### 如果遇到后端无法做导出  前端需要自行处理
- 首先安装两个依赖

```javascript
npm i xe-utils  xlsx
```
在utils文件夹中创建excel.js

```javascript

/**
 *
 * @param {*} excelForm
 * tableHeader: 表头
 * toggle: 一二级表头的连接属性
 * levelHeader:几级表头
 * data: 数组数据
 * name: excel表的名字
 */
export default async function Export(excelForm) {
  const userRelations = getExcelHeader(excelForm.tableHeader, excelForm.toggle);

  import('@/vendor/Export2Excel').then(excel => {
    const tHeader = Object.keys(userRelations);

    const { multiHeader, merges } = getExcelLevel(excelForm.tableHeader, excelForm.toggle, excelForm.levelHeader);

    const data = excelForm.data.map(item => {
      return tHeader.map(k => {
        const value = item[userRelations[k]];

        if (!value) return '';
        return value;
      });
    });

    console.log({
      header: tHeader,
      data,
      filename: 'yuangong',
      autoWidth: true,
      bookType: 'xlsx',
      multiHeader,
      merges
    });

    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: excelForm.name,
      autoWidth: true,
      bookType: 'xlsx',
      multiHeader: excelForm.levelHeader ? multiHeader : [],
      merges
    });
  });
}
function getExcelLevel (arr, toggle, levelHeader = 0) {
  const multiHeader = [];
  const merges = [];

  arr.map((item, index) => {
    multiHeader.push(item.name);
    if (item[toggle]) {
      item[toggle].forEach(() => {
        multiHeader.push('');
      });
      merges.push(String.fromCharCode(65 + index) + 1 + ':' + String.fromCharCode(65 + index + item[toggle].length));
    } else {
      merges.push(String.fromCharCode(65 + index) + 1 + ':' + String.fromCharCode(65 + index) + levelHeader);
    }
  });
  return { multiHeader: [multiHeader], merges };
}
function getExcelHeader (arr, toggle) {
  let temp = {};

  arr.map(item => {
    if (item.key) {
      temp[item.name] = item.key;
    } else if (item[toggle]) {
      const res = getExcelHeader(item[toggle]);

      temp = { ...temp, ...res };
    }
  });
  return temp;
}
```
然后创建vendor文件夹下创建Export2Excel.js  这个只需要复制即可 不用管

```javascript
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

function generateArray (table) {
  const out = [];

  const rows = table.querySelectorAll('tr');

  const ranges = [];

  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];

    const row = rows[R];

    const columns = row.querySelectorAll('td');

    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C];

      let colspan = cell.getAttribute('colspan');

      let rowspan = cell.getAttribute('rowspan');

      let cellValue = cell.innerText;

      if (cellValue !== '' && cellValue === +cellValue) cellValue = +cellValue;

      // Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      // Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      }

      // Handle Value
      outRow.push(cellValue !== '' ? cellValue : null);

      // Handle Colspan
      if (colspan) { for (let k = 0; k < colspan - 1; ++k) outRow.push(null); }
    }
    out.push(outRow);
  }
  return [out, ranges];
}

function datenum (v, date1904) {
  if (date1904) v += 1462;
  const epoch = Date.parse(v);

  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays (data, opts) {
  const ws = {};

  const range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };

  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      const cell = {
        v: data[R][C]
      };

      if (cell.v == null) continue;
      const cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }

  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook () {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab (s) {
  const buf = new ArrayBuffer(s.length);

  const view = new Uint8Array(buf);

  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel (id) {
  const theTable = document.getElementById(id);

  const oo = generateArray(theTable);

  const ranges = oo[1];

  /* original data */
  const data = oo[0];

  const ws_name = 'SheetJS';

  const wb = new Workbook();

  const ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), 'test.xlsx');
}

export function export_json_to_excel ({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx'
} = {}) {
  /* original data */
  filename = filename || 'excel-list';
  data = [...data];
  data.unshift(header);

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i]);
  }

  const ws_name = 'SheetJS';

  const wb = new Workbook();

  const ws = sheet_from_array_of_arrays(data);

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(XLSX.utils.decode_range(item));
    });
  }

  if (autoWidth) {
    /* 设置worksheet每列的最大宽度 */
    const colWidth = data.map(row => row.map(val => {
      /* 先判断是否为null/undefined */
      if (val == null) {
        return {
          wch: 10
        };
      } else if (val.toString().charCodeAt(0) > 255) {
        /* 再判断是否为中文 */
        return {
          wch: val.toString().length * 2
        };
      } else {
        return {
          wch: val.toString().length
        };
      }
    }));
    /* 以第一行为初始值 */
    const result = colWidth[0];

    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j].wch < colWidth[i][j].wch) {
          result[j].wch = colWidth[i][j].wch;
        }
      }
    }
    ws['!cols'] = result;
  }

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, {
    bookType,
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: 'application/octet-stream'
  }), `${filename}.${bookType}`);
}
```
#### 使用的时候  导入`utlis/excel.js`  点击导出按钮  调用这个函数

```javascript
Export({
        tableHeader: this.formHeader, // 表头对象
        data: data, //表格里的数据
        toggle: 'children', //二级表头的树行结构的链接名  没有二级表头就不写
        levelHeader: 2, //二级表头  没有二级表头就不写这一条
        name: 'xxxx' //导出名字
      });
```


## 在vue项目中 一般是前端调用接口  得到后端返回的二进制流文件  然后转换格式  变成excel表格来进行导出的
最近我遇到了一个问题  就是导出后会出现乱码
当时就排查了很多的问题  在网上说发请求的时候要加上`response:'blob'`
但是我也加上了  还是乱码  之后就和后端一起检查了很久  都发现没什么问题   但是就是一直乱码 很疑惑
最后才找到了原因   就是因为项目中引用了mock.js导致的  他会把你加上的`responseType='blob'`变成空
具体问题一步一步说

首先在node_modules里找到mockjs-x
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210613183036153.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70#pic_center)

里面的responseType变会置空![在这里插入图片描述](https://img-blog.csdnimg.cn/20210613183247850.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
这样的话你加了responseType也没效果  会被置空
所以找到这句话  添加上面注释的这一句话即可 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210613183602718.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
但是我们是不可以直接修改node_modules里的源码的  不然发到生产环境  还是没有变化  
找了好久我发现了  项目中引用了mock的地方  `我不能注释掉mock的引用  因为别的地方都使用了`  所以我修改了一点代码  比如在调用这个接口的时候  改变responseType  就好了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210613184141603.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2hhb3NpY3g=,size_16,color_FFFFFF,t_70)
