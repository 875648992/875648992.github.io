---
title: uniapp做的app项目在线升级
tags: [uniapp]
date: 2021-12-29 09:56:02
categories: [uniapp,前端工程化]
---

思路如下:
- 每次版本更新后  把版本号和下载链接发给后端存储在服务器
- 然后在自己的项目里调用后端的接口去判断当前的版本号和后端那里存的最新的版本号是不是匹配的  如果不是匹配的  后端会返回给你下载的链接  还有判断是否需要更新的字段
- 前端可以拿到这个字段去判断  如果需要更新就调用链接下载  

代码如下  仅供参考  直接复制没用

```javascript
/*
 * @Author: 在线更新
 * @Date: 2021-09-16 13:52:10
 * @LastEditTime: 2021-09-16 14:36:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /syzhxc-h5/src/common/onLineUpData.js
 */
import { version } from '@/api/common'

// +++++++++  提示去跳转  +++++++++
const show = (val, type) => {
  uni.showModal({
    title: '提示',
    showCancel: !type,
    content: val.data.description,
    success: (res) => {
      if (res.confirm) {
        if (uni.getSystemInfoSync().platform === 'android') {
          plus.runtime.openURL(val.data.fileUrl)
        } else if (uni.getSystemInfoSync().platform === 'ios') {
          plus.runtime.openURL(val.data.fileUrl)
        }
      }
    }
  })
}

// +++++++++  判断当前是否需要更新  +++++++++
export const upData = (type) => {
  plus.runtime.getProperty(plus.runtime.appid, async (wgtinfo) => {
    const params = {
      name: wgtinfo.version, //应用版本号
      number: wgtinfo.version.replace(/\./g, ''),
      type: 'android',

      appId: '1629164258869'
    }
    const val = await version(params)
    // +++++++++  当前需要更新  +++++++++
    if (Number(val.data.isUpdate)) {
      // +++++++++  是否需要强制更新  +++++++++
      Number(val.data.isForce) ? show(val, '强制更新') : show(val)
    } else {
      console.log(111111)
      if (type) {
        uni.showToast({
          title: '当前是最新版本',
          icon: 'error'
        })
      }
    }
  })
}

```
