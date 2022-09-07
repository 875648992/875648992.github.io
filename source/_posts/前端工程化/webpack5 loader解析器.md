---
title: webpack5 loader解析器
tags: [webpack]
date: 2022-05-22 16:48:09
categories: [前端工程化]
---
 ## 引导
 - 上一篇讲解了 [webpack的asset资源模块](https://blog.csdn.net/haosicx/article/details/124892392?spm=1001.2014.3001.5502)
 - 除了资源模块 还可以通过loader来引入其他类型的文件

## loader
- webpack只能解析js和json这样的文件
- loader可以让webpack解析其他类型的文件 并且转化成模块来供我们使用

### 使用loader去加载一个css模块
- 如果我们不加loader去解析css  打包的时候就会报错 
- 显示识别不了css
![在这里插入图片描述](https://img-blog.csdnimg.cn/8224f923ecd54f2ea480a47db5110657.png)
- 所以在项目的根目录下 要安装一个css-loader
`npm install css-loader -D`
- 配置webpack.config.js  添加一个css的rules

```javascript
 module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.css$/, //已作为css扩展名这样类型的文件
        use:'css-loader', //使用css-loader
      }
    ]
  },
```
- 但是这个时候如果我们使用了css文件 会发现虽然可以在标签上添加了类名
- 但是css里的内容 并没有通过style或者是link去加载到样式
![在这里插入图片描述](https://img-blog.csdnimg.cn/5fe7e992cd944d03acef3f863a0de86e.png)

- 所以这个时候还需要使用style-loader去把样式加载进去

### style-loader
- 继续安装`npm install style-loader -D`
- 这个loader会帮我们把css放置在页面上
- 配置也要改一下了应为要加载多个loader  所以 `use这个参数`改成一个数组
>数组内容的顺序很重要 是从`后往前执行的 `
>我们先执行要执行css-loader确保webpack能够识别到css
> 然后再用style-loader去把我们的css插入到页面中

```javascript
 {
        test:/\.css$/, //已作为css扩展名这样类型的文件
        use:[
          'style-loader', //将css插入到head中
          'css-loader', //将css转换成js
        ]
      }
```
- 这个时候 样式就加载到页面上了
![在这里插入图片描述](https://img-blog.csdnimg.cn/7202100bbe9f45b995824864397f4ae9.png)

### loader解析css预处理器
- 常用的css预处理器有sass和less
- 如果我们想解析less的话  首先要安装less-loader
`npm install less-loader -D`
- 配置的话`less-loader`一定要放在最后 
- 并且修改一下扩展名
>因为use数组是后往前执行的
>先把`less文件转变成css文件` => `解析css文件` => `把css文件插入到页面`

```javascript
  {
        test:/\.(css|less)$/, //已作为css或者less扩展名这样类型的文件
        use:[
          'style-loader', //将css插入到head中
          'css-loader', //将css转换成js
          'less-loader', //将less转换成css
        ]
      }
```
- 这样就可以解析css预处理器了 
