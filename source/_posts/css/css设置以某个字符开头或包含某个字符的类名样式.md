---
title: css设置以某个字符开头或包含某个字符的类名样式
tags: [css]
date: 2022-04-16 23:30:06
categories: [css]
---
## 以icon开头，包含 ' icon'的类名
```javascript
[class^='icon'],
  [class*=' icon'] {
    width: 100px;
    height: 100px;
    background-color: red;
  }
```
