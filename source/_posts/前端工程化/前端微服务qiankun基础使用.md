---
title: 前端微服务qiankun基础使用
tags: [qiankun]
date:  2022-02-20 18:41:16
categories: [前端工程化]
---
# [qiankun文档点击跳转](https://qiankun.umijs.org/zh/guide)



# 首先创建两个项目
- qiankun-base  基座
- qiankun-vue 子应用


# 基座基础配置
- App.vue `建立一个element-ui的菜单用来跳转`

```html
<template>
    <div>
      <el-menu router mode='horizontal'>
        <!-- 基座中可以放自己的路由 -->
        <el-menu-item index="/">Home</el-menu-item> 
         <!-- 引用其他子应用 -->
        <el-menu-item index="/vue">vue应用</el-menu-item>
      </el-menu>
      <router-view></router-view>
      <!-- 挂载vue应用的地方 -->
      <div id="id"></div>
    </div>
</template>
```
>安装qiankun `yarn add qiankun`

- main.js中初始化

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入qiankun 的注册应用方法 / 启动应用方法
import { registerMicroApps,start } from 'qiankun'
// 定义一个列表  写入要注册的app
const apps = [{
  name:'vueApp', //应用的名字
  // 默认会加载这个html 动态执行里面的( http://localhost:8080/js/chunk-vendors.js和app.js )
  entry:'//localhost:8081', //子应用必须支持跨域 fetch
  container:'#vue', //挂载到自身的哪个元素上
  activeRule:'/vue' // 访问到/vue的时候  跳转子应用
}]
// 注册app
registerMicroApps(apps)
// 开启
start({
  prefetch:false // 取消预加载
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```
# 子应用基础配置
- 因为在基座的`main.js`中配置了访问到`/vue`的时候 就挂载子应用
-- 所以就要修改子应用路由的根路径 `router/index.js`

```javascript
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL 删除原本的
  base: '/vue',
  routes
})
```
- 然后我们要把子应用打包成一个类库
-- 在`main.js`中配置

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//定义一个变量接收vue的实例
let instance = null

function render() {
  // 这里是挂载到自己的html上 
  // 基座会拿到挂载后的html 插入到#vue这个容器中
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}

//如果是基座访问子应用 (qiankun访问子应用)
if (window.__POWERED_BY_QIANKUN__) {
  //就动态配置子应用的自身的根路径 ( 避免使用到基座的根路径 )
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
//如果子应用是独立运行的话 就直接渲染
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 子组件的协议(固定) 导出三个promise函数
export async function bootstrap(props) {
  //应用初始化的时候调用
}
export async function mount(props) {
  //每次进入子应用的时候调用
  //子应用渲染的时候挂载 也可以把props传入子应用进行通讯
  render(props)
}
export async function unmount(props) {
  //切出 / 卸载的时候会调用
  // 子应用卸载的时候用destory把实例卸载了
  instance.$destory()
}
```

 - 配置完成后 需要打包成类库  所以还得配置一下打包`vue.config.js`
 -- 因为子应用嵌套在父应用下  所以还需要`配置跨域` 
 -- 还要配置打包后的结果
```javascript
module.exports= {
  devServer:{
    port:10000, // 配置端口号
    headers:{
      // 配置跨域  表示所有的人都可以访问我
      'Access-Control-Allow-Origin':'*'
    }
  },
    configureWebpack:{
      output:{
        library:'vueApp', // 类库的名字
        // 指定模块类型  umd 会把打包后那三个属性挂在window上 
        //比如 window.bootstrap / window.mount / window.oumount
        libraryTarget:'umd' 
      }
  }
}
```

# 基本的接入已经完成
![在这里插入图片描述](https://img-blog.csdnimg.cn/6346f296b73f41529af6fcadb882d450.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)


 
