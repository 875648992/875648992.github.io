---
title: vue-cli自动导入样式文件
tags: [css]
date:  2022-02-14 19:42:01
categories: [前端工程化,css]
---

> 如果你使用的是less或sass定义了一些变量或者函数的时候
> 在调用的过程中  需要在每次引用导入的时候都要`import`这个文件  
> 这样的话就非常麻烦

- 其实vue-cil中提供了一个插件可以自动把你定义的样式文件导入到所有vue的组件中

[vue-cli-plugin-style-resources-loader](https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader)

+ 执行命令

```less
vue add style-resources-loader
```

- 可能出现 现在还有代码未提交，是否继续，，选择y
- 继续选择使用的预处理器   ，，，，选择less
 - 等待安装完成，查看vue.config.js文件

```javascript
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  }
}
```
- 在`vue.config.js`文件中增加需要注入的less文件即可

```javascript
+ const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
+       path.join(__dirname, './src/assets/styles/variables.less'),
+       path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  }
}
```

# 现在我们可以直接在vue组件中使用函数或变量了

```javascript
<style lang="less" scoped>
h1 {
  background-color: @warnColor;
  .hoverShadow(); //直接使用
}
</style>
```
