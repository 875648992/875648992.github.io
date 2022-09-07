---
title: el-input-number的问题
tags: [vue,elementUI]
date: 2022-04-12 15:03:15
categories: [bug]
---

 ### 最近在做一个表单  使用到了el-input-number发现了一个小小问题  在此记录一下 以免下次再犯
- 就是v-model绑定了值后  输入框的默认值会为0 
-- ( 我的默认值是空字符串  但是输入框里显示的是0 )
- 后来发现绑定的值不能为空字符串 也不能为null  
--只能为undefined  这样就不会出现输入框默认值为0了

### 但是又出现了一个问题  我的必填校验是这样写的
- `:rules="[{ required: true, message: '请填写完整'}]"` 
-- 这样的话  就算填了数字  还是会报出没有填写的警告
- 后来发现忘记写了校验的触发方式  应该这样写 
-- `:rules="[{ required: true, message: '请填写标题',trigger: 'blur' }]"`
-- 如果不写trigger的话  默认也会触发change事件  所以会有问题




