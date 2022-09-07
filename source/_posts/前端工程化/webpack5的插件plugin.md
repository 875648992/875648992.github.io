---
title: webpack5的插件plugin
tags: [webpack]
date: 2022-05-22 16:49:07
categories: [前端工程化]
---
 
 ## 引导
 - 上一篇讲解了 [webpack的快速打包](https://blog.csdn.net/haosicx/article/details/124887637?spm=1001.2014.3001.5502)
 - 因此衍生出了一个问题  webpack打包那么方便  能不能自动管理`index.html`中script的路径
 
## 什么是插件
> - webpack就像是一条生产线  要经过一系列处理流程后 才能将入口文件转化成输出的结果
>  - 入口文件还可以依赖于其他两个js的模块
>  - 其中被依赖的模块  还可能依赖于其他的模块  
>  - 并且js也会引用css文件  css文件的引入  需要使用`webpack loaders`
>   - webpack会把这些依赖的关系都记录下来交给webpack的编译器
>   -- 编译器经过加工后 会形成css和js文件到出口

- 所以webpack编译的过程 就需要一些工具来帮忙了
-- 这些工具可以帮webpack来执行一些特定的任务`打包优化 / 资源管理....` 等等等
- 这些工具 就是`plugins`(webpack插件)
![在这里插入图片描述](https://img-blog.csdnimg.cn/c75d64dd7d444f1d875af461e011c848.png)

## [plugins中文文档](https://webpack.docschina.org/plugins/)

## 使用HtmlWebpackPlugin
- 主要解决不需要手工的修改index.html中去加载bundle.js的路径
![在这里插入图片描述](https://img-blog.csdnimg.cn/6f39d1a8731c4554b8944e535baa215a.png)
 - npm安装
  ` npm install html-webpack-plugin -D   `
  - 配置插件 
  -- 在webpack.config.js中
  

```javascript
const path = require('path'); // node的绝对路径的包
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html的插件
module.exports = {
  entry:'./src/index.js', //设置入口文件
  output:{
    filename:'bundle.js', //设置输出文件名
    path: path.resolve(__dirname,'./dist') //设置输出路径  一定要绝对路径 __dirname代表当前文件所在的目录
  },
  mode:'none', //设置模式  production / development
  plugins:[
    new HtmlWebpackPlugin(),//生成html的插件
  ], //设置插件
}
```
- 然后再终端中使用webpack命令 就会在dist目录下打包出一个`bundle.js和index.html`
![在这里插入图片描述](https://img-blog.csdnimg.cn/abf28216595d437ca4ecaa289e1f7e0b.png)
### HtmlWebpackPlugin的options选项

```javascript
plugins:[
    new HtmlWebpackPlugin({
      template:'./index.html', //指定src下的html模板打包
      filename:'app.html', //指定生成的html文件名
      inject:'body' //<script>标签指定插入的位置 原本是head里面
    }),//生成html的插件
```
打包后的结果就会改变了
![在这里插入图片描述](https://img-blog.csdnimg.cn/623699423dcf427dafea74f2bbba3155.png)

## 不同名称多次打包会生成多个html文件  如何去清理dist
- 当你使用不同名字取打包很多次后会发现一个问题
![在这里插入图片描述](https://img-blog.csdnimg.cn/7edf39f40a7c4a648e68d06ff45aaac8.png)


> 我们希望把上一次打包的给清理掉 
只需要在output里添加一个`clean : true` 

```javascript
 output:{
    filename:'bundle.js', //设置输出文件名
    path: path.resolve(__dirname,'./dist'), //设置输出路径  一定要绝对路径 __dirname代表当前文件所在的目录
    clean:true, //清除dist文件夹
  },
```




 
