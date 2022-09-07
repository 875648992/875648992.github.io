---
title: vue源码分析-观察者模式
tags: [vue]
date: 2022-9-9 10:11:03
categories: [源码分析]
---

# 目录

> - vue的一个核心特点就是数据驱动  如果和jq一样的思想 数据变化了想要同步到dom 需要手动操作dom更新一下  
>
> - 但是vue不需要  vue内部肯定有机制能尖塔到数据数据变动自动更新视图的功能 我来学习学习

# new一个vue的实例

> 正常写法中使用vue肯定要先new一个vue的实例 
>
> 通过使用了`new`这可以看出 vue其实就是一个构造函数
>
> 传入的参数就是一个对象 可以叫做为`options`

```javascript
// index.js
// 实例一个Vue对象
let vue = new Vue({
    props: {},
    data() {
        return {
            a: 1,
            b: [1],
            c: { d: 1 }
        }
    },
    watch: {},
    render: () => {}
})
```

# 对options对象的初始化

> - 传进vue的那个options对象  需要对这个数据进行初始化
>
> -  因为在vue初始化的识货可能会出来很多的事情  `数据处理,事件处理,生命周期处理等等` 所以划分不同文件引入  利于代码分割

```javascript
// index.js
const { initMixin } = require('./init')
// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
    //这里开始进行Vue初始化工作 初始化传进来的options配置
    this._init(options)
}

// _init方法是挂载在Vue原型的方法 通过引入文件的方式进行原型挂载需要传入Vue
// 这么做有利于代码分割
initMixin(Vue)
export default Vue;
```

> 把初始化函数_init挂载到vue的原型上 并且改写vue中的this

![image-20220907142625670](/Users/mi_wenhao.wu/Library/Application Support/typora-user-images/image-20220907142625670.png)

```javascript
// init.js
const { initState } = require('./state')

function initMixin(Vue) {
    // 在Vue的原型上挂载_init函数
    Vue.prototype._init = function (options) {
        // vm变量赋值为Vue实例 这样再vue种使用this就指向了vue里初始化后的值
        const vm = this

        // 将传进来的options对象赋值给vm上的$options变量
        //  this.$options就是用户new Vue的时候传入的属性
        vm.$options = options

        // 执行初始化状态函数
        initState(vm)
    }
}

module.exports = {
    initMixin: initMixin
}
```

# 初始化注意点

> - 初始化状态是有顺序的 比如有的面试题说是否能在data里面直接使用prop的值 为什么
> - 这里初始化的顺序依次是 `prop>methods>data>computed>watch`

## 初始化详解

> - initState : 总初始化函数 , 初始化`props,data,watch,menthods,computed等`
> - initData : 专门初始化`data`的函数
> - proxy : 代理函数, 主要作用是this.data.xxx的读写可以直接this.xxx实现 少去中间的data

```javascript
const { observe } = require('./observer/index')

function initState(vm) {

    // 获取vm上的$options对象，也就是传入options配置对象
    const opts = vm.$options
    // 对不同的数据单独处理
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        // 如有有options里有data，则初始化data 响应式处理
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

//主要data函数是怎么处理的? 所以来看看initData怎么实现
// 初始化data的函数
function initData(vm) { // vm是options对象
    // 获取options对象里的data
    let data = vm.$options.data

    // 判断data是否为函数，是函数就执行（注意this指向vm），否则就直接赋值给vm上的_data 也就是根部的data对象
    //  vm实例的_data属性就是传入的data
    // 这里建议data应为一个函数，return 一个 {}，这样做的好处是防止组件的变量污染
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

    // 为data上的每个数据都代理到vm 循环后传入proxy函数中处理
    // 这样做的好处就是，this.a可以访问到this._data.a了
    for (let key in data) {
      // 三个参数 this,_ data ,data对象里的key
        proxy(vm, '_data', key) 
    }

    // 做完代理后  对data里的数据进行观测
    // 核心
    observe(data)
}

// 数据代理
function proxy(object, sourceData, key) {
    Object.defineProperty(object, key, {
        // 比如本来需要this.data.a才能获取到a的数据
        // 这么做之后，this.a就可以获取到a的数据了
        get() {
            return object[sourceData][key]
        },
        // 比如本来需要this.data.a = 1才能修改a的数据
        // 这么做之后，this.a = 1就能修改a的数据了
        set(newVal) {
            object[sourceData][key] = newVal
        }
    })
}

module.exports = { initState: initState }
```

# 响应式处理

> - Observer: 观察者对象 `class构造函数`, 对`对象或数组`进行响应式处理的地方
> - defineReactive: 拦截对象上每个`key `的 `get`和`set`函数的地方
> - observe : 响应式处理的入口函数

> 流程大致是这样 : `observe传入=> Observer添加观察者=>defineReactive劫持=>observe传入=> Observer添加观察者=>defineReactive劫持`这样递归

```javascript
// 改写数组原型 push shift...的一些重写的方法 用于覆盖
const { arrayMethods } = require('./array')

// 观察者对象，使用es6的class来构建会比较方便
class Observer {
    constructor(value) {
        // 给传进来的value对象或者数组设置一个__ob__对象
        // 这个__ob__对象大有用处，如果value上有这个__ob__，则说明value已经做了响应式处理
      
      // 这个__ob__对象添加的几个属性
        Object.defineProperty(value, '__ob__', {
            value: this, // 值为this，也就是new出来的Observer实例
            enumerable: false, // 不可被枚举
            writable: true, // 可用赋值运算符改写__ob__
            configurable: true // 可改写可删除
        })

        // 判断value是函数还是对象
        if(Array.isArray(value)) {
            // 如果是数组的话就修改数组的原型
            value.__proto__ = arrayMethods
            // 对数组进行响应式处理
            this.observeArray(value)
        } else {
            // 如果是对象，则执行walk函数对对象进行响应式处理
            this.walk(value)
        }
    }

    walk(data) {
        // 获取data对象的所有key
        let keys = Object.keys(data)
        // 遍历所有key，对每个key的值进行响应式处理
        for(let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = data[key]
            // 传入data对象，key，以及value
            defineReactive(data, key, value)
        }
    }

    observeArray(items) {
        // 遍历传进来的数组，对数组的每一个元素进行响应式处理
        for(let i = 0; i < items.length; i++) {
            observe(items[i])
        }
    }
}

function defineReactive(data, key, value) {
    // 递归重要步骤
    // 因为对象里可能有对象或者数组的嵌套，所以需要递归
    observe(value)


    // 核心
    // 拦截对象里每个key的get和set属性，进行读写监听
    // 从而实现了读写都能捕捉到，响应式的底层原理
    Object.defineProperty(data, key, {
        get() {
            console.log('获取值')
            return value
        },
        set(newVal) {
          // 如果新的值和老的值一样的话  就不动
            if (newVal === value) return
            console.log('设置值')
            value = newVal
        }
    })
}


function observe(value) {
    // 如果当前传进来的是对象或者数组，则进行响应式处理
    if (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
        return new Observer(value)
    }
}

module.exports = {
    observe: observe
}
```

# 为什么对象和数组要分开处理

> - `对象`的内置属性通常比较少 ,对每个属性都劫持  性能消耗的不多
> - `数组`内置有非常多的元素 如果,每个元素都劫持 太消耗性能了
> - 所以`对象`通过`defineProperty`进行正常的劫持
> - `数组`则通过`重写覆盖数组原型上的那9个方法` 来实现响应式

# 遗留问题

> - 因为劫持是在`传入options的时候`进行劫持完毕  对象后续新增属性时候 无法做到响应式
> - 数组的修改只能通过改写的那9种方法 `arr[index] =xxx` 不在其中方法之中` .length`修改也不行 所以也无法触发响应式

# 官方解决办法

> - 使用`$set`的方法可以解决这个问题 使用方法是`this.$set(obj,key,value)`
> - 意思就是手动把数据传入`defineReactive`后进行劫持一下  做到手动响应式

# 流程图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f0696bfaf9e417a9b7dbe0f265de1f3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.image)

