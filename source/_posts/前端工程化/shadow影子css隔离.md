---
title: shadow影子css隔离
tags: [css]
date:  2022-02-20 16:49:50
categories: [前端工程化,css]
---

# 主应用和子应用之间的样式隔离
- BDM 约定项目前缀 `在样式前面加一个路径  比如/vue下面的所有样式`
--   这就也可以实现项目的个隔离  但是既然是约定  那就容易不遵守约定
- css-modules 打包时候生成不冲突的选择器名  
- shadow Dom 真正意义上的隔离  

# shadow影子隔离基础概念
- 给元素创建一个影子  然后给这个影子添加样式  
- 这个样式只会添加在影子上 不会影响dom上的元素

### 实现方法
- 创建影子标签

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <p>我是dom元素p标签</p>
  <!-- 影子存放标签 -->
  <div id="shadow"></div>
  <script>
    // 创建一个影子shadow dom
    // mode:open / closed : 外界可以访问 /不可以访问
    let shaDowDom =  document.getElementById('shadow').attachShadow({mode:'closed'})
    // 我现在创建一个p标签
    let pElm = document.createElement('p')
    //写点内容
    pElm.innerHTML= '我是影子元素的p标签'
    // 创建一个style标签
    let styleElm = document.createElement('style')
    styleElm.textContent = `p{color:red ; background:pink}`
    
    //把创建的p标签和style标签   都插入到影子里去
    shaDowDom.appendChild(styleElm)
    shaDowDom.appendChild(pElm)
  </script>
</body>
</html>
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/0521ef227b294758baa0b9c668406c06.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)


# 微前端中css隔离大致方法
 - 应用加载的时候 A应用身上有`window.a`切换B应用时候  B应用也可以访问`window.a`  ( 使用的是同一个window )  这样就会出问题
 - 单应用切换  沙箱: 创造一个干净的环境给子应用用 `当切换时 可以选择丢弃属性和恢复属性`
 -- A应用切换B应用的时候 `window.a要丢弃`  
 -- B应用切回A应用的时候 `window.a要恢复` 

### JS沙箱机制 
- 快照沙箱 
-- 一年前拍一张 , 一年后拍一张 , 做对比 (然后把区别保存起来 )
-- 丢弃的时候 : 回到一年前
-- 恢复的时候 : 把其中的区别给恢复回来
- 代理沙箱 proxy
-- 可以实现多应用沙箱  把不同的应用用不同的代理来处理
