---
title: mac M1 nvm 安装问题
tags: [mac, m1]
date:  2022-06-14 22:31:08
categories: [配置]
---

新款的mac搭载了苹果自研的芯片，放弃了intel的x86芯片，那之前的软件难免会存在兼容性问题。

鄙人有幸踩了第一个坑。

在通过nvm 安装不同版本的node 时，出现了问题。

### 问题一：先说一下 nvm的安装问题，这个跟m1的兼容性无关。

参考大神文章（https://www.jianshu.com/p/622ad36ee020）

 - 我在通过命令行安装nvm成功之后（curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash），终端输入nvm，提示  command not found: nvm，因为还没执行下面红框中的脚本。



 - 把下面的脚本复制到终端，回车之后执行nvm命令，发现可以正常使用了。

```javascript
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
> 但是，我这边还有一个问题就是，每次关掉终端，再重新打开的时候执行nvm又会提示 command not find。执行上面的脚本之后又可正常使用，如此反复。

> 这个时候需要新建一个.zshrc文件(touch .zshrc)，然后将上面的脚本复制进去，保存。如下图：



如果上面没有解决问题，打开你的 .bash_profile 文件，并在最上方添加以下代码：

```javascript
source ~/.bashrc
```

### 问题二：

 - 通过nvm安装最新的node版本 v15.8.0，没有什么问题，可以正常安装，这是因为最新版本的nvm和node，已经对M1做了兼容处理。

 -- 但是当通过nvm安装v15.x.x一下版本node 时，就会出现如下报错：



 

 - 头疼，看来ARM架构还是需要一段过度历程要走的。

> 后来终于在nvm github官方库中找到了对应的issue(地址：https://github.com/nvm-sh/nvm/issues/2350 )，node issue(地址：https://github.com/nodejs/node/issues/36161 )。



 

> 需要在Rosetta 2的模式下 执行对应的 terminal命令。

#### 这里就有个问题了，什么是Rosetta 2 ?

 - 这里有个简单的介绍文章（https://www.macdaxue.com/rosetta-2/ ）。简单来说，其实就是M1芯片在过渡期间苹果给出的对应 X86芯片的兼容性方案。

 - 在终端输入 `arch -x86_64 zsh`，然后回车，终端进入Rosetta 2模式。重新安装nvm(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash)，然后nvm install 8，nvm install 6。


 

### bingo~ 安装成功。

这里有个坑我避过了，就是如果安装的nvm不是最新的版本，那么通过nvm 安装最新的node版本(v15.8.0)还是会报错。就像issue中的这位同志，安装的nvm版本是v0.33.0，最新版本是v0.37.0。

