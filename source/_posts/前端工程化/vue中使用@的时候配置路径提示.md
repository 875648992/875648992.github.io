---
title: vue中使用@的时候配置路径提示
tags: [vue]
date:  2022-02-20 16:49:50
categories: [前端工程化,vue]
---

- 新增配置文件 `jsconfig.json`
- 当我们路径中使用`@`的时候可以有提示 

```javascript
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    }
  },
  "exclude": ["node_modules", "dist"]
}
```
