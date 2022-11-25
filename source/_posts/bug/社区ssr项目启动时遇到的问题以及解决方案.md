---
title: 社区ssr项目启动时遇到的问题以及解决方案
tags: [srr,nuxtJs]
date: 2022-11-25 10:11:03
categories: [bug]
---

# ssr是什么
 - server side render，服务端渲染，即页面上的dom结构都是在服务端计算好之后，下发给访问者
   - 可以这样解释 spa打包的是一个dist压缩文件  ssr打包的是整体的一个.nuxt文件 
 - 这样有两个好处：
   - 首屏快，用户访问的网页不再需要使用js计算dom，而是拿到资源后直接能够渲染当前网页的内容；

   - 更有利于SEO，搜索引擎的爬虫能够爬到每个页面的具体内容，提升搜索引擎的权重，能让用户更容易搜到你的网站；
  >当然，SSR也有他的问题，因为所有用户的页面结构都会在服务端计算，所以服务端的压力很大，而且node本身执行效率也不如java、C++这种后端语言，所以一般情况下会使用cdn缓存来缓解服务端的压力；

  > 但是如果你的网站实时性要求很高，比如我们的主站，使用cdn缓存就不符合我们的需求了；

### 上面说到了SSR的优缺点，下面就进入正题，我们在SSR项目初期遇到了哪些问题，解决方案是怎么样的；
# 问题一 : 用户信息有问题
 - 这个问题需要从nuxt请求说起 , 一般来说nuxt请求的推荐用法是这样的
  ```javascript
    async asyncData({ $axios }) {
      const ip = await $axios.$get('http://icanhazip.com')
      return { ip }
    }
  ```
  - 这样就产生了一个问题，我们没有办法封装这个请求，因为$axios是在context里的，然后就想到了新的方法 , 我们可以使用自己的axios ,  然后用context中拿到参数
  ```javascript

    import axios from 'axios';

    export default {
      asyncData({ params }) {
        return axios.get(`https://my-api/posts/${params.id}`).then(res => {
          return { title: res.data.title }
        })
      }
    }
  ```
   - 这样写的话，axios不依赖context，我们就可以进行封装了，到这里，会发现一个很大的问题
     - 产生问题 : 用户信息的各种信息 , 包括cookie都在context中 , 如果使用封装的方法 ,则获取不到用户的context , 也就是请求带不上cookie
     - 解决方案 :  **之前的问题是拿不到用户的context ,所以就想到可以将用户的context存在全局的内存中 , 然后再封装请求组件中就能获取到了 , 然后带着cookie发送到后台 , 返回后也可以通过这个context继续后续的业务**
  - 以上这个解决方案也是有问题的
    - 衍生的问题:  因为去哪家只有一个context , 如果只有一个用户访问该服务器的话是不会出问题的 , 但是问题是既然是服务端渲染 , 同一时间一定会有多个用户访问服务器 , 于是会产生这样的问题
  ![在这里插入图片描述](https://img-blog.csdnimg.cn/a8d08afb081b448e93f7bd39a32cac94.png)
   - 解决方案 : ![在这里插入图片描述](https://img-blog.csdnimg.cn/790fd0f10b4544449c0fccbd9cc23155.png)


# 问题二 : 服务端压力问题
 - 上面介绍SSR时也说到了，其中有一个缺点就是服务端压力会比较大，如果同一时间有大量用户访问页面，则很有可能挂掉，当时压测一台机器大概能承受 50qps，远小于我们预期的量，如果加很多机器的话成本就太高了，也不可能转为客户端渲染，这样就没法做SEO了，对于社区产品，SEO是非常重要的一点；
  ### nginx转发服务器 ( 至少2台,用于容灾 )
   - 根据ua判断 , 转发到ssr服务器或者spa服务
  ### 社区服务器
     - 分为两个容器组 (每个组至少两台 , 用于容灾 , 目前咋们spa服务器4台,ssr服务器两台)
     - spa容器组 : 服务于用户，用spa模式部署（也可以部署为ssr，根据业务情况自行判断）
     - ssr容器组：服务于搜索引擎爬虫，用ssr模式部署
  ### 爬虫ua包含字符
  >百度: baiduspider，神马: yisouspider，360: 360spider/haosouspider，google: googlebot，微软bing: bingbot，搜搜: sosospider，搜狗: sogou web spider
"baiduspider","yisouspider","360spider","haosouspider","googlebot","bingbot","sosospider","sogou web spider"

### EdgeScript脚本
- 脚本语法文档：https://help.aliyun.com/document_detail/126566.html
```javascript
  ua = lower($http_user_agent)
  crawlerRegx = '(baiduspider|yisouspider|360spider|haosouspider|googlebot|bingbot|sosospider|sogou\sweb\sspider)'
  wikiRegx = '/(wiki|obc|strategy)/'
  mobileRegx = '(iphone|ipod|android|ios)'
  if and(match_re(ua, crawlerRegx)) {
    pcs = capture_re(ua, crawlerRegx)
    crawler = get(pcs, 1)
    rewrite(concat($uri, '?crawler=', gsub_re(crawler, '\s', '_')), 'enhance_break')
  }
  if and(match_re(ua, mobileRegx), match_re($uri, wikiRegx), not(req_uri_arg('visit_device','re:mobile'))) {
    rewriteUrl = concat($uri, '?visit_device=mobile')      
  if not(null($args)) {
    rewriteUrl = concat(rewriteUrl, '&', $args)
  }
    rewrite(rewriteUrl, 'enhance_redirect')
  }
```

具体流程闭环
![在这里插入图片描述](https://img-blog.csdnimg.cn/c5bf4df7dcc64551a6aeface5744f918.png)
