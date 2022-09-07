---
title: 移动端配置postcss-pxtorem
tags: [h5, css]
date: 2019-10-10 10:00:00
categories: [h5,css]
---

1. 安装依赖：postcss-pxtorem 5.1.1
2. vue2项目 在根目录下新增.postcssrc.js  关键要配置rootValue和propList

```javascript
module.exports = {
  plugins: [
      'autoprefixer',
      ['postcss-pxtorem', {
        rootValue: 100, // 换算基数 12*100
        unitPrecision: 3, 
        propList: ['*'],
        exclude: /(node_module)/, // 默认false，，过滤/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，就不要过滤
        mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
        minPixelValue: 1 // 设置要替换的最小像素值
      }]
    ]
};
```
3、在移动端的入口文件配置设置根目录font-size的方法 
 - rem 适配方法
 

```javascript
// 设备判断
export default function remSize(noRest) {
  let winWidth;
  // 获取窗口宽度
  if (window.innerWidth) {
    winWidth = window.innerWidth;
  } else if ((document.body) && (document.body.clientWidth)) {
    winWidth = document.body.clientWidth;
  }
  // 通过深入Document内部对body进行检测，获取窗口大小
  if (
    document.documentElement
    && document.documentElement.clientHeight
    && document.documentElement.clientWidth
  ) {
    winWidth = document.documentElement.clientWidth;
  }
  // 修改font-size
  const fontSize = ((winWidth / 375) * 100).toFixed(4);
  document.documentElement.style.fontSize = `${fontSize}px`;

  // 适配对font-size额外处理的手机
  const nowFontSize = parseFloat(getComputedStyle(document.documentElement, false)['font-size']).toFixed(4);
  if (noRest !== true && `${nowFontSize}` !== fontSize) {
    document.documentElement.style.fontSize = `${(fontSize * fontSize) / nowFontSize}px`;
  }
}

```

 -  main.js中使用
 

```javascript
import remSize from './remSize';

let noReset;

if (window.top === window.self) {
  window.onresize = () => {
    remSize(noReset);
  };

  // 安卓10以上不需要处理修改系统字体大小
  if (判断是否安卓) {
    Vue.prototype.$isAndroid10.getHTTPRequestHeaders().then(({ data = {} }) => {
      const version = data['x-rpc-sys_version'] || '';
      const [v] = version.split('.');
      noReset = Number(v) >= 10;
      remSize(noReset);
    });
  } else {
    remSize(noReset);
  }
}

```



