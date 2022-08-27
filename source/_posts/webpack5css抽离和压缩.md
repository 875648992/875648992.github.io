---
title: webpack5css抽离和压缩
tags: [webpack]
date:  2022-05-22 16:47:55
categories: [前端工程化]
---
 ## 引导
 - 上一篇讲解了 [webpack的loader](https://blog.csdn.net/haosicx/article/details/124897478?spm=1001.2014.3001.5502)
 - 我们已经可以通过loader加载css了  但是现在的代码是和html在一起的
 - 我需要把style的代码放置到一个单独的文件里通过link去加载
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/b1a36ffe670045ea8061d806523f67b9.png)
## mini-css-extract-plugin
- 这个功能需要一个插件`npm i mini-css-extract-plugin -D`
-- 这个插件是基于webpack5构建的  只能在webpack5环境下才行 
- webpack.config.js配置

```javascript
// 引入抽离css的插件
const MinCssExtractPlugin = require('mini-css-extract-plugin'); 

plugins:[
    new MinCssExtractPlugin()//把插件实例化一下
  ], //设置插件
   module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.(css|less)$/, //已作为css或者扩展名这样类型的文件
        use:[
        // style-loader不需要了 我们要用link的方式引入css 所以替换掉
          MinCssExtractPlugin.loader, //抽离css的loader
          'css-loader', //将css转换成js
          'less-loader', //将less转换成css
        ]
      }
    ]
  },
```
- 这个时候我们打包后会发现dist下的目录多了一个main.css文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/126e64c9888d43c8923755708ea69486.png)
- 因为我们之前安装了`html-webpack-plugin`去自动匹配路径
- 所以在html中已经没有style标签了 自动变成了link标签引入了main.css![在这里插入图片描述](https://img-blog.csdnimg.cn/447a88e6ea0f4fecaaa7fac718241d6c.png)
 ### 自定义打包出来的css文件路径和文件名称
 - 现在已经成功的打包出了css文件 那如何去自定义配置路径和文件名称呢
 -- 只需要在实例化插件里面加一个filename就可以了

```javascript
  new MinCssExtractPlugin({
      filename:'style/[contenthash].css', //设置输出的css文件名
    })//抽离css的插件
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/ccff52187276460abd8ab1b9c966171c.png)
## css压缩 `css-minimizer-webpack-plugin`
- 现在打包出的css没有压缩  如果压缩一下可以提高css的加载效率
- 需要安装一个插件`npm i  css-minimizer-webpack-plugin -D`
- 配置文件

```javascript
 // 压缩css的插件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


// 设置成生产环境 才需要css压缩
mode:'production', //设置模式  production / development



// 这个插件属于优化 所以不写在plugin里 新增一个优化属性
 optimization: {
 // 如果还想在开发环境下启用 CSS 优化，请将 optimization.minimize 设置为 true:
 	minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
```

