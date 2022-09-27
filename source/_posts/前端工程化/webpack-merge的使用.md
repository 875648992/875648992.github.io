---
title: webpack-merge的使用
tags: [webpack]
date: 2022-09-27 16:47:10
categories: [前端工程化]
---

### 为什么要用webpack-merge
 - development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异 `所以webpack的配置写的差距会非常的大`
 - 在开发环境中，我们需要：强大的 **source map** 和一个有着 **live reloading(实时重新加载)** 或 **hot module replacement(热模块替换)** 能力的 localhost server。
 - 而生产环境目标则转移至其他方面，关注点在于**压缩 bundle、更轻量的 source map、资源优化等**，通过这些优化方式改善加载时间。由于要遵循逻辑分离，我们通常建议为`每个环境编写彼此独立的 webpack 配置。`
- 虽然，以上我们将 生产环境 和 开发环境 做了细微区分，但是，请注意，我们还是会遵循**不重复写配置的原则**，保留一个 `"common( 公共 )" 配置`。为了将这些配置合并在一起，我们将使用一个名为 `webpack-merge` 的工具。此工具会引用 "common" 配置，因此我们不必再在环境特定`env`的配置中编写重复代码。

### 安装

```javascript
npm install --save-dev webpack-merge
```
### 目录结构

```javascript
 webpack-demo
  |- package.json
  |- package-lock.json
 - |- webpack.config.js // 删除全局webpack配置
 + |- webpack.common.js // 新建公共配置
 + |- webpack.dev.js	// 新建开发环境配置
 + |- webpack.prod.js	// 新建生产环境配置
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```
#### webpack.common.js 公共配置

```javascript
const path = require('path');
// 该插件将为你生成一个 HTML5 文件， 
// 在 body 中使用 script 标签引入你所有 webpack 生成的 bundle。
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/index.js',
   },
   plugins: [
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     clean: true,
   },
 };
```

#### webpack.dev.js 开发环境配置

```javascript
// 引入webpack-merge
const { merge } = require('webpack-merge');
// 引入公共配置
 const common = require('./webpack.common.js');
// 第一个参数是公共配置 第二个参数是环境里的配置
 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
     static: './dist',
   },
 });
```
#### webpack.prod.js  生产环境配置

```javascript
 const { merge } = require('webpack-merge');
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
   mode: 'production',
 });
```

- 现在，在 webpack.common.js 中，我们设置了 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件。
- 在 webpack.dev.js 中，我们将 mode 设置为 development，并且为此环境添加了推荐的 devtool（强大的 source map）和 devServer 配置。
- 最后，在 webpack.prod.js 中，我们将 mode 设置为 production，

注意，在环境特定的配置中使用 merge() 功能，可以很方便地引用 webpack.dev.js 和 webpack.prod.js 中公用的 common 配置。webpack-merge 工具提供了各种 merge(合并) 高级功能，但是在我们的用例中，无需用到这些功能。