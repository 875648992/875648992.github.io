---
title: webpack5使用souceMap和watchMode搭建简易开发环境
tags: [webpack]
date: 2022-05-22 16:47:10
categories: [前端工程化]
---
 ## 引导
 - 上一篇讲解了 [webpack的插件](https://blog.csdn.net/haosicx/article/details/124888574?spm=1001.2014.3001.5502)
 - 但是之前我们每次更新了代码 都要重新刷新浏览器看到新的效果
 -- 很多的操作都是要自己手动去做  非常的不方便
 - 我们可以搭建一个开发环境来使开发变得更加轻松
 
 ## mode(打包选项)
 - 首先看到webpack.config.js里的配置
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/5e1d499c0b744ac0a999df28b38723b1.png)
 - 我们把mode改成`development` 变成一个开发的模式再进行一个打包 ![在这里插入图片描述](https://img-blog.csdnimg.cn/c0e1a0a1d7614242ae98f738335fe063.png)
  >- 此时观察打包后的bundle.js可以发现把我们的`hellow-word.js`的代码做了一个转化
  >-  通过eval传递了一些字符串  字符串就是要解析的js代码  
 - 但是这样太难看懂了!!!!!  这时候就要用到`soucre map`来进行代码的调试

## soucre map(精准定位代码的行数)
- 假设一个场景  
>我们的代码写的地方有报错   
![在这里插入图片描述](https://img-blog.csdnimg.cn/1419cd1e6d5d493780d21fd3e43f2b9f.png)
>- 这个时候在浏览器中查看的话 
>- 会发现他给报错的定位不是我们源文件的代码的位置   
>- 我们要修改的话  太难找了![在这里插入图片描述](https://img-blog.csdnimg.cn/c93b87d8cb2e4473b814ec5f010ab050.png)
 - 这个时候 我们可以通过`soucre map`锁定到代码出错的位置
- 我们可以在webpack.config.js中新增一个配置`devtool : " inline-source-map"`

![在这里插入图片描述](https://img-blog.csdnimg.cn/b53fe80d682e4b40bc60b28671057f73.png)
- 此时观察打包后的bundle.js  和上面没加这个属性的对比 发现已经可以查看到具体内容了
![在这里插入图片描述](https://img-blog.csdnimg.cn/ca72690032d24792b87faf5020b883a0.png)
 - 此时再去浏览器控制台看报错  就和我们文件里写的是一样的了
 - 也就是真实源代码的第二行
![在这里插入图片描述](https://img-blog.csdnimg.cn/a31493ddbe2841da906bab88d16589f7.png)
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/bed1aad9604549abafeb14326549e5ed.png)

## 使用watch mode(观察模式)
- 在每次编译代码时候  每次手动终端输入`webpack`打包 非常的麻烦
- 我们可以在编译的同时加一个`--watch` 
- 就可以自动识别修改的代码进行实时的打包 不用再去手动输入命令
-- 然后再刷新浏览器  就可以查看到最近的修改了
-- `npx webpack --watch` 或者  `webpack --watch`
>但是唯一的一个问题就是  每次修改完代码或者保存完代码
> 都要在浏览器进行刷新一下才能查看  
> 能不能不进行人工刷新刷新浏览器  也能查看最新的代码呢?

- 这个时候就要使用webpack-dev-server来操作了

## webpack-dev-server热更新
- webpack-dev-server提供了一个web server服务器
- 并且具有lobe reloading(实时重新加载功能)
-- 当我们修改了 浏览器会侦听到我的修改  来进行实时的刷新 
- 安装
`npm install --save-dev webpack-dev-server`
- 配置webpack.config.js
- 加一个属性 devServer
```javascript
devServer:{
    static:'./dist',//设置静态文件路径
  }
```

- 然后打包的命令改成运行devServe
--`npx webpack-dev-server` 或者`webpack-dev-server`
- 然后会启动一个本地的服务 
![在这里插入图片描述](https://img-blog.csdnimg.cn/3f49a9deacc84ea8a646d6eb146729f4.png)
- 我们打开这个链接会发现他们把根目录指向了`dist`文件夹里
-- 文件夹里正好有`app.html`和`bundle.js

`![在这里插入图片描述](https://img-blog.csdnimg.cn/8ec9eda8a412469491e7dfa3d81cd09b.png)
 - 然后我们点击`app.html `就可以进入页面查看了
- 此时我们会在控制台发现这两个功能已经生效了
-- 此时我们修改代码 不刷新浏览器也会自动更新 
![在这里插入图片描述](https://img-blog.csdnimg.cn/cc472f77fcdd42da82958e07345e4ac8.png)

### webpack-devServer的原理
 - 其实webpack-dev-server没有真正的输出任何物理的文件
 --  他只是把打爆以后的bundle文件放到了内存里
- 怎么验证这点呢?
-- 只需要在开启webpack-dev-server的时候吧`dist`文件删除
-- 你会发现页面并没有丢失 怎么修改  添加 页面都是正常更新的
- 所以webpack-dev-server是不依赖dist文件的