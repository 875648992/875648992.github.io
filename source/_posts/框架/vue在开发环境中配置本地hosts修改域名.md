---
title: vue在开发环境中配置本地hosts修改域名
tags: [mac,host]
date:  2022-04-03 01:20:10
categories: [配置]
---

 # 修改hosts文件
 打开访达  按住command+shift+g搜索/private/etc/hosts
 然后修改hosts文件
把你想要的域名设置成localhosts一样的ip

修改完成后终端输入sudo vim /etc/hosts查看hosts文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/041e0fd925134214aec69e6ea7f6bc8d.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5paH55qTenp6eg==,size_20,color_FFFFFF,t_70,g_se,x_16)
设置好了后  可以ping一个这个域名 测试一下通不通
如果通的话  项目启动后   
原本`localhost:8080/`的地址可以在浏览器中替换为`你配置的域名:8080/`
