---
title: webpack5快速上手打包以及概念
tags: [webpack]
date: 2022-05-22 16:49:31
categories: [前端工程化]
---

@[toc]
## 安装webpack有两种方式  

```javascript
// 全局安装(不建议 会锁定webpack的版本)
 npm install webpack webpack-cli --global
// 项目中安装
 npm install webpack webpack-cli --save-dev  
```
 >在项目中安装的时候  可以安装在`setup-app`文件的里面
 >也可以安装在`setup-app`文件的外面  
![在这里插入图片描述](https://img-blog.csdnimg.cn/9cecebc93e4b42bfa76cc944c3655cee.png) 
##### 安装在setup-app文件里面的时候  
-- 就可以像vue-cli中一样  直接进入这个文件的终端里输入webpack  就会给你基于`src/index.js`打包出dist文件 

##### 安装在文件外面的时候  你在`setup-app`文件中的终端输入webpack是没用的  
-- 只能输入`npx webpack`  
-- npx的意思就是查看你的文件里是否有这个包  没有的话就会去上一层目录里找  只要找到对应的依赖 (只要有npm就会有npx)


## webpack分析命令

```javascript
webpack --stats detailed
```
> src/index是默认的打包入口文件![在这里插入图片描述](https://img-blog.csdnimg.cn/a6a4a1be4b7b47448a1dd0959dc14535.png)

## webpack帮助

```javascript
webpack --help
```

 - webpack简单点来说就就是一个配置文件，这个配置文件主要分为三大块
-- entry 入口文件 让webpack用哪个文件作为项目的入口
-- output 出口 让webpack把处理完成的文件放在哪里
-- module 模块 要用什么不同的模块来处理各种类型的文件
- 输入命令后 就可以查看这些信息
![在这里插入图片描述](https://img-blog.csdnimg.cn/5bdfe7cd01854b7190daa72af393ed7b.png)

## 如何设置打包的入口的
 - 从`webpack --help`中看到了 入口的设置命令是`--entry`
  -- 现在的入口是`main.js ` 那我想改成`index.js  `
  
```javascript
// 设置entry的入口是src下的index.js文件
// --mode是打包方式为生产环境 
 webpack --entry ./src/index.js --mode production
```
- 但是打包出来的文件是dist/main.js 
-- 如果我们想修改这个main.js名字  又要在命令行里加参数  太麻烦了
-- 所以webpack给我们生成了一个配置文件 

## webpack配置文件怎么写
- 首先在src同级的根目录创建一个`webpack.config.js`
-- 因为这个文件是在nodeJS中运行的  
-- 所以我们定义这个模块的时候需要用到nodeJS中的CommonJS模块`module.exports={}`

```javascript
const path = require('path'); // nodeJS的绝对路径的包
module.exports = {
  entry:'./src/index.js', //设置入口文件
  output:{
    filename:'bundle.js', //设置输出文件名
    path:path.resolve(__dirname,'./dist') //设置输出路径  一定要绝对路径 __dirname代表当前文件所在的目录
  },
  mode:'development', //设置模式  production / development
}
```
- 有了配置文件  我们直接终端输入`webpack`打包  就不需要输入后面一大串的打包类型的命令了  非常方便!!!!
- 然后我们只需要在index.html中引入打包后的js文件就可以完成了打包
![](https://img-blog.csdnimg.cn/a9568945141d4ea99b343c1b55399884.png)
 

