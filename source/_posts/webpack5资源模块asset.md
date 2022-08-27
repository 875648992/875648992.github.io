---
title: webpack5资源模块asset
tags: [webpack]
date: 2022-05-22 16:48:28
categories: [前端工程化]
---
## 引导
- 上一篇讲解了[webpack搭建开发环境](https://blog.csdn.net/haosicx/article/details/124889423?spm=1001.2014.3001.5502)
- 有一个问题  到目前为止  项目只能加载JS 
- 但是我们想混合一些其他的资源怎么办呢?
-- 比如images/ 字体 / 图标等 

## 资源模块asset module type
 >可以通过4种类型模块 来替换掉所有的loader
 >![在这里插入图片描述](https://img-blog.csdnimg.cn/1fa498751b1b4b0889efc8f37484f731.png)


### `asset / resource 导出图片资源`
> 用于发送一个单独的文件并导出URl
- 比如我现在想在项目中加载png类型的本地图片需要怎么做呢?
-- 首先要配置webpack.config.js 增加一个属性`modules`用来写入规则
```javascript
module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.png$/, //已png作为扩展名这样类型的文件
        type:'asset/resource', //资源模块类型
      }
    ]
  },
```
- 接着我们在文件中写入一个png文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/b98041e3efef4abf97e8aed3729081e0.png)
- 然后我们终端命令输入webpack进行打包  会发现dist下面生成了一个png文件
-- 这个是系统自动帮助我们生成出来的 
![在这里插入图片描述](https://img-blog.csdnimg.cn/e85cefdf41e84fe4a97642fee848e88d.png)
- 并且成功在浏览器上显示出来了
![在这里插入图片描述](https://img-blog.csdnimg.cn/2ef5ddc27c1a412cb31ec1c28af59832.png)
- webpack会自动帮我们把资源打包在dist文件下并且自动取好了文件名
-- 那我们能不能自己定义文件的目录和文件名呢?
#### 修改asset/resource模块下打包后的资源路径和文件名
> 有两个方法
- 方法1:
-- 在output下面加一个`assetMoudleFilename` 属性
-- 比如我想让打包的资源输出在`dist / images`下可以这么去写

```javascript
 output:{
 	//设置图片输出路径以及文件名称
    assetModuleFilename:'images/[contenthash][ext]' 
    // [contenthash] webpack自带方法  根据文件的内容去生产一个hash字符串
 	// [ext] webpack自带方法 根据文件的内容生成扩展名
  },
```
- 打包出来的结果就是自己定义的了
![在这里插入图片描述](https://img-blog.csdnimg.cn/ae1c7502816645b4999959708f6e5ceb.png)
- 方法2:
-- 可以在module的rules中添加属性 `generator`
-- 这次我们打包在`dist / picture`下

```javascript
 module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.png$/, //已png作为扩展名这样类型的文件
        type:'asset/resource', //资源文件
        generator:{ //设置生成器
          filename:'picture/[contenthash][ext]', //设置生成的文件名
        } 
      }
    ]
  },
```
- 打包的结果就在picture下了
![在这里插入图片描述](https://img-blog.csdnimg.cn/8c7bd7f699d9437eb5d0204e2e8abf05.png)
>如果方法1和方法2同时都写了
>那么写在`rules下的generator`方法的优先级是比写在`output下的assetModuleFilename`的优先级高的

 

### `asset / inline 资源转化成base64`
> 用于导出一个资源的Data URL ( base64 )
- 比如 这次我们想导出一个`svg`类型的资源
- webpack.config.js中配置

```javascript
module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.svg$/, //已svg作为扩展名这样类型的文件
        type:'asset/inline', //内联文件
      }
    ]
  },
```
- 然后引入一个svg
![在这里插入图片描述](https://img-blog.csdnimg.cn/4039d764410745d5a4cc6b804c0c6fc5.png)
- 打包后发现dist下的目录并没有导出资源
- 只能在浏览器中控制台看到资源 这就是asset/inline类型  
![在这里插入图片描述](https://img-blog.csdnimg.cn/71f04fed0ed343a6bebccb3520a4873b.png)

### `asset / source 读取资源的内容`
- 用于导出资源的源代码
- 比如导出一个`txt`格式的文本文件

```javascript
 module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.txt$/, //已txt作为扩展名这样类型的文件
        type:'asset/source', //源文件
      }
    ]
  },
```
- 然后我们写入一个txt文件并且打包
- 会发现dist下也不会打包出任何的文件
- 页面上才可以看到  说明asset/source可以读取资源的源文件


### `asset通用数据类型自动转换` 
- 他会在导出一个Data URL( base64 )和发送一个单独文件之间自动进行选择
- 也就是说会在`resource类型和inline中自动转换`
- 那么这个是根据的什么东西去自动转换的呢?
- 默认情况下
-- 当资源大于8k的情况下 走的就是`asset/resource`  ( 输出图片资源 )
-- 当资源小于8k的情况下 走的就是`asset/inline` ( 不输出图片资源 变成base64链接 )
> 那怎么去调整这个阈值呢  可以设置如下参数

```javascript
module:{ //设置模块
    rules:[ //设置loader
      {
        test:/\.jpg$/, //已作为jpg扩展名这样类型的文件
        type:'asset', //源文件
        parser:{  //设置解析器
         dataUrlCondition:{ //设置解析条件
            maxSize:10*1024*1024, //最大10mb
         }
        }
      }
    ]
  },
```

   