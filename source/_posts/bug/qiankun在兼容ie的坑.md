---
title: qiankun在兼容ie的坑
tags: [qiankun, vue]
date: 2022-07-08 12:11:16
categories: [bug,前端工程化]
---

# 最近在做ie11的需求  需要了两个坑
 第一个坑可能不是ie的问题
- 就是接口在ie模式下 会出现缓存  比如登录后 登录信息不同步这类似的
- 因为在ie中  请求的url地址一样的话会被缓存
-- 导致下一次的get请求 还是上一次的信息
- ` 需要在axios中 给每个get请求携带一个时间戳`

 第二个问题是在qiankun中调用主应用的极验等一系列第三方js会报错
- 原因是qiankun的第三方script代码  在ie中使用第三方的js的请求  xml会转化成fetch请求  导致请求两次并且错乱
- 处理方案是qiankunstart的时候过滤掉不转的代码
- 把极验的脚本过滤掉就行了
```javascript
this.$qiankunStart({
        excludeAssetFilter(assetUrl) {
          return assetUrl.includes('geetest');
        }
      });
```

# ie  垃圾!!!

