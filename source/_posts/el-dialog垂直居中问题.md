---
title: el-dialog垂直居中问题
tags: [elememtUI]
date: 2021-08-10 16:37:27
categories: [bug,vue]
---

该组件并不自带让其垂直居中的属性，因此只能通过CSS来控制（以下样式代码已兼容IE）

```javascript
    .el-dialog{
      display: flex;
      display: -ms-flex; /* 兼容IE */
      flex-direction: column;
      -ms-flex-direction: column; /* 兼容IE */
      margin:0 !important;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      max-height:calc(100% - 30px);
      max-width:calc(100% - 30px);
    }
    .el-dialog .el-dialog__body{
      max-height: 100%;
      flex: 1;
      -ms-flex: 1 1 auto; /* 兼容IE */
      overflow-y: auto;
      overflow-x: hidden;
    }


```
