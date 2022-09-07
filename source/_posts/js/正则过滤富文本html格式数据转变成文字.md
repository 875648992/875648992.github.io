---
title: 正则过滤富文本html格式数据转变成文字
tags: [正则]
date: 2022-01-18 19:28:54
categories: [js]
---

```javascript
// 传入富文本参数
 toText(HTML) {
      const input = HTML;
      return input.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/&ldquo;/g, ' ').replace(/&rdquo;/g, ' ')
        .replace(/&nbsp;/ig, "")
        .replace(/>/g, ' ');
    },
```

