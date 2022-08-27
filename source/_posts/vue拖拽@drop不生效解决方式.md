---
title: vue拖拽@drop不生效解决方式
tags: [vue]
date: 2022-04-16 14:46:32 
categories: [bug]
---
想要一个原生可以进行拖拽  可以使用HTML5的一个属性`draggable='true'`

```javascript
 <div class="widget" draggable='true'>pie</div>
```
 - 加上了后这个元素就开启了拖拽
 >然后在需要放置的元素上注册一个`@drop='函数'`来接收拖拽的元素 
 > 但是你会发现元素拖拽上去了也没有生效
 - 这是因为还需要阻止一个默认事件
`@dragover="e=>e.preventDefault()"`
 
加上后就可以了
```javascript
<div class="components-right" @dragover="e=>e.preventDefault()" @drop="onDrop">
```
