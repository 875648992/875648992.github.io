---
title: webpack5代码分离优化项目加载速度
tags: [webpack]
date: 2022-09-27 16:47:10
categories: [前端工程化]
---

### 环境变量可用于搭建项目架子的时候判断当前的环境
>那环境变量具体是怎么使用的呢

- webpack 命令行 环境配置 的 --env 参数，可以允许你传入任意数量的环境变量。
- 而在 webpack.config.js 中可以访问到这些环境变量。
- 例如，`--env production` 或 `--env goal=local`。
![在这里插入图片描述](https://img-blog.csdnimg.cn/844bb70d73a64514816ab4479a45d9a0.png)
>如果设置 env 变量，却没有赋值，--env production 默认表示将 env.production 设置为 true。
- 对于我们的 webpack 配置，有一个**必须要修改之处。**
- 通常，module.exports 指向配置对象。
- 要使用 env 变量，你必须将 **module.exports 转换成一个函数：**

```javascript
const path = require('path');

module.exports = (env) => {
  console.log('Production: ', env.production); // true
};
```

### 如何运用在项目中呢?
 - 项目中使用了**webpack-merge** 把`公共的配置`和`各个环境`的配置进行了合并
 - 以下的是公共的配置**webpack.base.config.js**
```javascript
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = env => ({
  // 通过package.json的命令行 --env 环境变量  
  // 这个env就拿到了对应环境变量
  // 入口
  entry: {
    bundle: resolve('src/index.js')
  },
  output: {
    path: resolve('dist'), // 打包后的文件存放的地方
    filename: '[name]_[hash].js' // 打包后输出文件的文件名
  },
  devServer: {
    contentBase: resolve('src'), // 本地服务器所加载的页面所在的目录
    historyApiFallback: false, // 不跳转
    inline: true // 实时刷新
  },
  resolve: {
     alias: {
     // 重点 声明一个别名用来快速访问对应环境的一些文件
     // 这条的意思就是在src下的GlobalConfigs文件夹中  写上了对应环境的一些文件
     // 然后根据环境变量拼接路径去拿去对应的文件
      appConfig: resolve(`src/GlobalConfigs/${env}.config.js`),
    }
  },
});

```
 - 看看src/GlobalConfigs的文件目录
 - 就可以根据上面的**环境变量拼接路径** 拿去到对应的文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/437767de5a5640aa8827d66e2cfc5e0d.png)


- 比如看看**development.config.js**的文件

```javascript
// 可以声明一些地址什么的 用于请求的根路径
export const environment = 'development';
export const apiBase = 'https://xxxx.xxxx.com';
```
