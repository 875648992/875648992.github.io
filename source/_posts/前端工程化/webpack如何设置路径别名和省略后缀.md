---
title: webpack如何设置路径别名和省略后缀
tags: [webpack]
date: 2022-09-28 16:47:10
categories: [前端工程化]
---
### 需求
 -  每次使用`import`引入路径的时候都很麻烦 
 -- 都要../../../这样的  大量的重复操作
 - 我再想可不可以设置一个别名  只要输入`import { xxx } from 'appConfig';`
 -- 就可以直接拿到这个js里面的文件呢 `可以方便用于拿一些公共的工具类` 
 ### 解决方案
 > 我发现webpack的配置里有个这个属性`resolve下的alias`
 于是我打算这样去实现这个方法

```javascript
// 可以首先定义一个获取路径的方法
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}


module.exports = (env) => ({
	...
	resolve{
		// 可以在import的时候省略后缀 
		// import File from '../path/to/file';
   		extensions: ['.js', '.vue', '.scss', 'json'],
    	alias: {
    		// env就是环境变量 具体写法可以不同 就是读取不同的js文件
      		appConfig: resolve(`src/configs/${env}.config.js`), 
    	}
 	 },
	...

})
```
