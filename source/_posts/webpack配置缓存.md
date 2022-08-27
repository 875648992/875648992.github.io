---
title: 移动端配置postcss-pxtorem
tags: [webpack]
date: 2022-05-23 11:10:09
categories: [前端工程化]
---
## 为什么要设置缓存
> 我们使用webpack来打包我们模块化以后的应用程序  , webpack会生成一个可以部署的dist目录 , 然后我们把打包好的内容放置在这个目录里 , 将来我们把这个目录的内容部署到服务器上 , 浏览器就可以访问这个服务器上的网站和资源了

>而最后一步获取资源是比较耗时间的 所以浏览器会使用一个叫做缓存的技术
>我们可以通过命中缓存去降低网络流量 , 使网站加载速度更快

>然而我们在部署新版本的时候  ,  不更改资源的文件名 , 浏览器可能会认为你没有更新 , 就会使用缓存的版本
> - 我们就要通过一些设置 要确保webpack生成的文件 让客户端缓存
>- 而在文件发生变化的时候  又能请求到新的文件

## 更改输出文件的文件名解决
- 如果要配置输出文件名 首先就要想到`output` 
- 所以我们可以在webpack.config.js中设置`output`的filename
- [name] : 就是根据打包的文件 自动生成名字
- [contenthash] : 就是根据文件内容生成hash字符串

```javascript
 output:{
     filename:'[name].[contenthash].js',// 打包后的文件名
     path: path.resolve(__dirname,'./dist'), //设置输出路径  一定要绝对路径 __dirname代表当前文件所在的目录
     clean:true, //清除dist文件夹
     assetModuleFilename:'images/[contenthash][ext]' //设置图片输出路径以及文件名称
  },
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/63faa6facddd4a94b49d90401efbba75.png)
## 缓存第三方库
- 像第三方的库, 比如`lodash` 我们可以提取到`vendor chunk`文件中 比较好
- 因为这样的代码  我们不会像源代码一样频繁的修改  可以利用客户端长效缓存机制
> 就是我们把第三方的代码  单独打包缓存到浏览器中  这样只有我们的代码发生变化的时候  我们可以去更新  但是第三方的代码 始终使用的是浏览器缓存的内容

 - 首先我们既然要把第三方的代码打包 就要做代码的一个分离
 - 原本的写法是在webpak配置里的`optimization.splitChunk`里添加`chunks:'all'`
 - 现在修改一下  设置node_modules里的文件打包到vendors里

```javascript
 splitChunks: {
     cacheGroups:{ //设置缓存组
       vendor:{ //设置缓存组名称
        test:/[\\/]node_modules[\\/]/, //设置缓存组匹配条件
        name:'vendors', //设置缓存组名称
        chunks:'all', //设置缓存组包含的chunk
      }
     }
    }
```

#### 将js文件放到一个文件夹中
- output输出对象中的filename属性里加一个`scripts/`
- 就可以把js文件都放入到自定义的一个文件夹中咯
```javascript
 output:{
    filename:'scripts/[name].[contenthash].js',// 打包后的文件名
  },
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/f132d113299e4b209a0dab3c681e259e.png)
