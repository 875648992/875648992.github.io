---
title: SingleSpa微前端基本使用以及原理
tags: [SingleSpa]
date:  2022-02-20 18:43:45
categories: [前端工程化]
---
# 先说说singleSpa的缺点
- 不够灵活 不能动态加载css文件
- css不隔离
- 没有js沙箱的机制 ( 没有全局对象  每次切换的应用  都是同一个window )
> 但是刚刚接触微前端  可以了解一下微前端的基础使用
 >qiankun微前端框架已经很成熟  也是基于singleSpa来实现的
[点击跳转qiankun的基础使用](https://blog.csdn.net/haosicx/article/details/123033341?spm=1001.2014.3001.5502)
# 大致实现思路 (不了解微前端概念的可以去自行了解)
- 首先在父应用注册一个应用
- 当条件满足的时候`(匹配路径)`  会加载我们另一个子应用的脚本
- 加载子应用用脚本的话  
--  那在我们子应用打包的时候 , 自身上就有一些类库了
- 父应用`加载到子应用的类库时候`  就会调用子应用身上的一些方法了
-- 这个时候 类库就会把子应用整体的dom  `放在( 挂载 )到父应用上面去`
- 而且我们要保证子应用自身引用的所有路径  `都是相对于自身的绝对路径`
-- 不然在父应用里使用子应用的一些操作 调用的是父应用的根路径  就会出问题

# 首先创建两个应用  
### 一个子应用 各个父应用
![在这里插入图片描述](https://img-blog.csdnimg.cn/9b32219335254a06a78cc94481de36b2.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
>我们需要父应用加载子应用  需要在子应用导出三个方法
>`bootstrap` `mount` `unmount` ( SingleSpa的规定 )
>>vue的项目需要npm安装 Single-spa-vue
>>react的项目需要npm安装 Single-spa-react


# 初始化子应用
 >npm安装single-spa-vue

- 配置main.js

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入singleSpaVue的包
import singleSpaVue from 'single-spa-vue'
Vue.config.productionTip = false


//子应用不能直接挂载
// new Vue({   
//   router,
//   render: h => h(App)
// }).$mount('#app')

// 而是封装成一个对象
const appOptions = {
    el:'#vue',  // 增加一个属性挂在到父应用的 id为vue的标签上
    router,
    render: h => h(App)
}

// 把vue和上面这个对象传入进去  这个singleSpaVue就会返回vueLife
// vueLife是包装好的生命周期  对应的就是bootstrap mount unmount  这三个方法
const vueLife = singleSpaVue({
  Vue,
  appOptions
})

//导出这三个方法  
//协议接入  我定好了这些方法  父应用会调用这些方法
export const bootstrap = vueLife.bootstrap
export const mount = vueLife.mount
export const unmount = vueLife.unmount
```
- 我们需要父应用加载子应用 需要打包成一个个的lib去给父应用使用
- 如何打包呢  在vue.config.js中配置

```javascript
module.exports = {
  configureWebpack:{
    output:{
       // 给类库取一个名字
      library:'singleVue',
      // 指定模块类型  umd 会把打包后那三个属性挂在window上 
      //比如 window.bootstrap / window.mount / window.oumount
      libraryTarget:'umd' 
    },
    devServer:{
      port:10000 
    }
  }
}
```

# 初始化父应用
>npm安装single-spa  (不要加vue)

 - App.vue中处理结构
 

```html
<template>
  <div id="app">
    <!-- 路由中没写/vue这个路径  说明路由匹配不到  但是可以去匹配这个路由来加载子应用  -->
    <router-link to="/vue">加载vue子应用</router-link>
    <!-- 这个id = vue就是子应用main.js中el挂载的#vue -->
    <div id="vue"></div>
  </div>
</template>
```
- main.js处理

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 固定导出两个方法  注册应用 / 开始应用
import {registerApplication,start} from 'single-spa'
Vue.config.productionTip = false

// 注册应用  参数1 注册一个名字  参数2 一点要是个promise函数
registerApplication('myVueApp',
    async()=>{
      // 如果路径为 /vue  就会调用现在这个方法了   但是这个方法必须要导出子应用下的那三个方法 (不导出会报错) 
      // 但是这个三个方法在哪里呢  请看下面的图片 具体写法先写如下
      // 动态创建script标签 把这个模块引入进来  (加载顺序要先加载公共的  再加载自己的 )
      await loadScript('http://localhost:10000/js/chunk-vendors.js')
      await loadScript('http://localhost:10000/js/app.js')
      // 这样就可以导出window上的lib包了  'singleVue'就是vue.config.js配置的包名 
      return window.singleVue //bootstrap mount onmount
      
    },
    // 参数3 用户切换到/vue路径下 需要加载刚刚定义的子应用
    location=>location.pathname.startsWith('/vue')
)

// 处理上面参数2的promise
async function loadScript(url){
  // js加载是异步的 所以要用promise
  return new Promise((resole,reject)=>{
    let script = document.createElement('script')
    script.src = url
    script.onload = resole // 加载成功
    script.onerror = reject //加载失败
    document.head.appendChild(script) //把script放在html的head标签里 
  })
}

// 开启应用
start()


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/5e55167aa40e43f9a0f06acd4443a367.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
- 这样就开启了基础的嵌入子应用
![在这里插入图片描述](https://img-blog.csdnimg.cn/1f2c75d9d186479893c985b12f5865ea.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
 - 点击按钮后 ( 但是还有问题 )
 - css没有隔离 ( 使用到了子应用的css  导致标签就居中了 )
 - 点击子应用的路由 跳转会错误 
 -- 路径上的/vue会消失( 点击子应用的路由 但是跳转的是父应用的路由 )
 -- 需要在子应用中虚拟一个路径
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2aaffe6b24054a969da7fd560a28695b.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
# 给子路由配置基础路径
- 子应用的router/index中
```javascript
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL, //删除原本的
  //点击子应用的路由的时候 需要通过/vue去加载
  base: '/vue', 
  routes
})
```
-  但是还有个问题  每次点击子路由的时候  加载的是父应用上的路由
-- 我们需要操作子应用的时候 匹配的是子应用自身的路径
-- 解决方法 : `我们请求的每一个路由  都要加载的是自身的根路径才行`
-在子应用的main.js中配置
 `主要看if(window.singleSpaNavigate){}后面的新增代码`

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue'
Vue.config.productionTip = false


const appOptions = {
    el:'#vue',  
    router,
    render: h => h(App)
}

const vueLife = singleSpaVue({
  Vue,
  appOptions 
})

//加上了如下的判断
//如果父应用引用我的时候
if(window.singleSpaNavigate){
  // 动态的设置一个属性 打包的时候加上一个目录 目录就是自身的根路径
  // 这样的时候我们发请求的时候 都会把这个路径拼到最前面 变成一个绝对路径
  __webpack_public_path__ = 'http://localhost:10000/'
}
//我们还需要让子应用独立运行 (如果父应用没有引用我的时候)
if(!window.singleSpaNavigate){
  // 子应用独立运行的话 就是正常初始化vue了  这个挂载父应用的el就可以删除
  delete appOptions.el
  //可以正常初始化vue了  
  new Vue(appOptions).$mount('#app')
}

export const bootstrap = vueLife.bootstrap
export const mount = vueLife.mount
export const unmount = vueLife.unmount

```
 # 现在的话已经基础的实现了父应用嵌套子应用 
 # 并且子应用也可以独立运行了
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/342eca407f7a4f87a8706f8585506e85.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/7630fefe14d44701980eca70b9ce0d87.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
