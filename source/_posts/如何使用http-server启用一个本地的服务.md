---
title: 如何使用http-server启用一个本地的服务
tags: [webpack]
date: 2022-05-20 16:41:09
categories: [前端工程化]
---

> 在做一个练习的时候  使用的是`index.html`文件  
> 然后想使用import导入一个其他的js文件调用里面的方法  进行一个本地的查看  但是打开浏览器中显示跨域

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module">
    // 求和的方法
    import add from './esm/add.js';
    console.log(add(1,2));
  </script>
</body>
</html> 
```
浏览器并不支持这样的方式
![在这里插入图片描述](https://img-blog.csdnimg.cn/b1c41c5d22dc44e7af9c0afe320fc0ea.png)

所以我们要启用一个本地的服务
- npx 安装本地服务
```javascript
npx http-server
```
- 安装后会给你几个ip
![在这里插入图片描述](https://img-blog.csdnimg.cn/582663b99fa84110a77577050afc1719.png)
- 打开ip后可以看到浏览器里显示了你的目录文件 
- 再次点击index.html  就是用本地服务来使用index.html
- 也就不会跨域了