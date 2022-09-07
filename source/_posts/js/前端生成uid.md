---
title: jenkins构建项目后发现访问不到静态资源
tags: [js]
date: 2021-08-31 16:09:29
categories: [js]
---

在许多场景都需要使用随机密钥
可以使用uuid插件也可以额前端自己生成
下面是前端生成随机密钥的方法
```javascript
// 使用随机数
 S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
// 调用guid函数生成uid    
guid() {
      return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
    },
```
结果: f1a7ea9b-d1d4-11ad-095f-5a9e991d9735
