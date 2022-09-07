---
title: webpack5使用babel-loader ES6转化ES5
tags: [webpack]
date: 2022-05-22 16:47:40
categories: [前端工程化]
---
 ## 引导
 - 上一篇讲解了 [webpack的css抽离和压缩](https://blog.csdn.net/haosicx/article/details/124897478?spm=1001.2014.3001.5502)
 - 之前我们用了less-loader编译了less文件  用css-loader编译了css文件
 - 那么js文件需要编译吗?
-- 我们在页面中写一个promise定时器2秒后打印hello word
![在这里插入图片描述](https://img-blog.csdnimg.cn/92a88037e073462cb530845484ee4847.png)
- 打包后我们观察输出的bundle.js文件  发现我们的ES6代码 被原封不动的打包到了这个文件里
![在这里插入图片描述](https://img-blog.csdnimg.cn/dcba28b05de54df7b4a0ba41263b9097.png)
>这就引发了一个问题  !!!!
>不是所有浏览器都支持ES6代码的  
>很多老版本浏览器只支持ES5代码

## 使用bable-loader 把ES6转化成ES5
>在使用前  需要安装3个包
>- `babel-loader` 在webpack用来解析ES6
>- `@babel/core` babel核心模块
>- `@babel/preset-env` babel预设 一组babel插件的集合

- 安装`npm i  babel-loader @babel/core @babel/preset-env -D`
- webpack.config.js配置rules

```javascript
module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.js$/, //已作为js扩展名这样类型的文件
        exclude:/node_modules/, //排除node_modules文件夹
        use:{
          loader:'babel-loader', //转换成es5
          options:{
            presets:['@babel/preset-env'], //设置编译的规则
          }
        }
      }
    ]
  },
```

- 但是这样直接打包会失败  因为目前还解析不了我们的async/await语法
- 需要安装一个`regeneratorRuntime`环境
## regeneratorRuntime插件
- regeneratorRuntime是webpack打包生成的全局辅助函数
- 由babel生成  用于兼容async/await 的语法
>需要安装两个包
>- `npm i @babel/runtime -D`  包含了regeneratorRuntime运行时候需要的内容
>- `npm i @babel/plugin-transform-runtime` 这个插件 在需要regeneratorRuntime的地方自动导入包 就是在需要的时候会自动运行他

- 配置文件 在babel的rules下新增一个plugin

```javascript
 {
        test:/\.js$/, //已作为js扩展名这样类型的文件
        exclude:/node_modules/, //排除node_modules文件夹
        use:{
          loader:'babel-loader', //转换成es5
          options:{
            presets:['@babel/preset-env'], //设置编译的规则
            plugins:[ // 设置编译的插件
              ['@babel/plugin-transform-runtime'] //设置编译的规则
            ]
          }
        }
      }
```
- 打包后观察输出的bundle.js文件  发现已经吧ES6转化成ES5代码咯
![](https://img-blog.csdnimg.cn/38d8f36aceb64c23b41af6652ccc0a2d.png)