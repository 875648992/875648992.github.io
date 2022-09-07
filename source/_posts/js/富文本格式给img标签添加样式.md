---
title: 富文本格式给img标签添加样式
tags: [正则]
date: 2021-12-28 13:14:09 
categories: [js]
---

```javascript
   /**  获取富文本img标签修改宽高  */ 
        res.data.records.forEach(item=>{
        	// 声明img正则过滤条件
          let r=RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g)
          // 过滤item.content的html内容  获取img的标签数组
          let matchres=item.content.match(r)
          // 如果过滤出来了就循环数组
          if(matchres){
            matchres.forEach((i,index)=>{
              let len=i.length
              let _str=i.slice(0,len-2)+' style="width:20rem;height:5rem"/>';//追加之后的img
              item.content = item.content.replace(i,_str)
            })
          }
          //赋值 ( 可忽略 )
          this.twoList.push(item)
        })
```
