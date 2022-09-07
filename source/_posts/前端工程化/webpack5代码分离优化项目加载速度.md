---
title: webpack5代码分离优化项目加载速度
tags: [webpack]
date: 2022-05-22 16:47:10
categories: [前端工程化]
---
 ## 什么是代码分离
- 代码分离是webpack的特性之一
- 可以把代码分离到不同的bundle中 `bundle就是我们打包分离出来的文件`
- 然后就可以把这些文件按需加载或者并行加载
## 代码分离的好处
- 可以用于获取更小的bundle 以及控制资源加载的优先级  如果使用合理 可以极大的影响首屏的加载时间

### 常用的代码分离方法
- 第一种叫做配置入口节点
-- 可以使用entry来配置手动的分离代码
-- 这种方式有个问题  就是如果有多个入口 就会分别在每个包里去重复打包
- 第二种方法叫防止重复
--可以在入口的地方通过`entry dependencies`或者`splitChunksPlugin`  去重和分离代码
-- 抽离出共享的文件 防止代码重复打包  优化打包的文件大小 
- 第三种方法动态导入
-- 可以通过模块的`内联函数import`来调用这个函数分离代码 实现代码的懒加载

## 入口节点分离法
- 这种方法是是最简单直观的分离代码的方法
- 比如我们创建一个一些js文件  里面写点东西 
- 然后手动去修改webpack.config.js  完成多个入口节点`entry`的配置

```javascript
 entry:{
    index: './src/index.js', //第一个js文件
    another: './src/another-module.js' //第二个js文件
  }, 
  output:{
  // 打包后的文件名 [name]根据文件名称自动生成打包后输出的名字
    filename:'[name].bundle.js',
  },
```
- 打包后输出了两个js文件  实现了根据不同的js代码打包出了不同的文件![在这里插入图片描述](https://img-blog.csdnimg.cn/6bdd37000c3d4f929e333aaf4e80fc02.png)
- 但是这样也就会有问题 比如我两个js文件都引用了loadash库
- 按理说loadash是一个共享的方法   但是这种方式的打包会在每个文件都会打包一个loadsh  
>这就是entry配置多入口的问题
> 所以如果我们在不同入口的chunk之间  包含一些重复的代码
>那么这些重复的模块 会引入到各自的bundle中

## 防止重复
- 相对于第一种方法 可以把一些公共的文件 抽离成单独的chunk
- entry需要改写一下   等于是我们要加一个dependOn 
- 然后把有lodash库的地方 抽离成单独的一个chunk

```javascript
 entry:{
    index:{
      import:'./src/index.js',
      dependOn:'shared',
    },
    another:{
      import:'./src/another-module.js',
      dependOn:'shared',
    },
    shared:'lodash', 
  }, 
```


更加推荐方法 : 或者直接在optimization里配置splitChunks也可以自动实现一个公共方法的抽离

```javascript
 optimization: {
    splitChunks: {
      chunks:'all'
    }
  }, 
```

这样打包后就会把lodash给抽离出来了  其他的文件就小了很多


## 动态导入
 - 使用import去完成`import返回的是一个promise!!!!`
比如我在js文件中写下这些代码去加载一个lodash的join方法

```javascript
function getComponent(){
 return  import('lodash') //异步加载lodash 返回的是pormise
  .then(({default: _}) => {
   const ele = document.createElement('div');
   ele.innerHTML=_.join(['Anot  her', 'module', 'loaded!'], ' ');
   return ele
  })
}

getComponent().then(ele => {
  document.body.appendChild(ele); 
})
```
打包后可以发现  已经把lodash给抽离出来了 就是`vendors-node_modules_lodash.js`![在这里插入图片描述](https://img-blog.csdnimg.cn/74b2b5fc63434ce793232f60d636a222.png)
>建议利用第二种方法配合第三种方法一起使用
>- 动态导入方法可以分离出import的公共方法  
>- 第二种防止重复的方法可以分离出静态直接使用的公共方法
>- 不会冲突

### import动态导入 魔法注释
- 可以在import里定义一个注释 来自定义打包出的chunk的名字哦
- `/* webpackChunkName : ' 自定义名称 ' */`

![在这里插入图片描述](https://img-blog.csdnimg.cn/36a4ace078d047b2aab1cc49546c5668.png)
### 懒加载 ( 动态导入方法的应用 )
- 这个动态导入方法有什么用? 直接使用静态的不就很好吗?
- 懒加载也就是按需加载  是一个优化网页或应用的方式
` 如果使用import动态导入的方法  只有用到才会加载  不用就不会加载`

- 自己可以试一试  比如一个按钮要调用某个js文件里的函数 `用的是import调用的`
- 可以在浏览器控制台里的Network里看  是不是只有当点击按钮调用的时候  才会加载对应的js


- 有这么一个场景  
- `下面的代码的意思其实就是点击一个按钮 会动态调用lodash库` 我们来试试效果

```javascript
function getComponent(){
 return  import(/* webpackChunkName:'math'*/,'lodash') //异步加载lodash
  .then(({default: _}) => {
   const ele = document.createElement('div');
   ele.innerHTML=_.join(['Anot  her', 'module', 'loaded!'], ' ');
   return ele
  })
}

const button = document.createElement('button');
button.innerHTML = 'Click me and look at the console!';
document.body.appendChild(button);
button.onclick = async () => {
  getComponent().then(ele => {
    document.body.appendChild(ele); 
  })
}
```
 - 现在的结果是懒加载  只有点击了按钮 才会加载lodsh资源  不点就不会加载

#### 预获取/预加载模块
- 既不影响首屏加载速度 又可以省去了将来模块加的延迟
>在webpack v4.6.0+增加了对预获取和预加载的支持
> - 在声明import时候 使用内置指令  可以让webpack输出`resource(资源提示)`来告知浏览器
> - prefetch( 预获取 ) 将来某些导航下可能需要的资源 提前下载一下

##### prefetch尝试

>尝试一下 在懒加载的前提下  又加上了`webpackPrefetch:true`的魔法注释呢?
 

```javascript
function getComponent(){
 return  import(/* webpackChunkName:'math', webpackPrefetch:true */'lodash') //异步加载lodash
  .then(({default: _}) => {
   const ele = document.createElement('div');
   ele.innerHTML=_.join(['Anot  her', 'module', 'loaded!'], ' ');
   return ele
  })
}

const button = document.createElement('button');
button.innerHTML = 'Click me and look at the console!';
document.body.appendChild(button);
button.onclick = async () => {
  getComponent().then(ele => {
    document.body.appendChild(ele); 
  })
}
```

- 刷新页面的时候 没点击按钮 这个math.bundle.js就已经被预下载下来了
- 然后点击的时候还会加载一遍
> - 意义就是在我们首页内容加载完毕后 在`网络空闲的时候` 会预加载一些我们定义的好的模块
> - 这样的方式 更加提升性能  这就是`prefetch`预加载
![在这里插入图片描述](https://img-blog.csdnimg.cn/1f47acd0d30a4f05a89a79654a755fca.png)


