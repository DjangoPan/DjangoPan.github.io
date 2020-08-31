    title: MacOS开发环境的配置
author: 九月八
date: 2020-08-23 06:22:46
categories: 
  - 学习
tags: 
  - 环境配置
  - macOS
keywords: 
description: 
password: 
top: 
summary_img: /images/pasted-103.png
copyright: true

---

### 说明

因为以后要转战MacOS了，虽然之前也用过一年的Ubuntu实体机，但是Windows的环境和MacOS的开发环境相差还是蛮大，所以一切都得从头开始了...
按照我的尿性，估计这种配环境的事以后还得干不少次，为了以后方便，这次把中间采的坑记录下来...



### Home_Brew
安装过程有点烦，安装之后还要考虑换源或者走代理的方式。

安装过程：

```
xcode-select --install

第一种方法：

首先用的是官方的安装方法，但是总是连接不上，或者下载到一半就断开，因为节点在国外的原因；
https://brew.sh/index_zh-cn.html

安装脚本：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"


实际上如果卡在git clone的某一个部分，可以把终端命令停下来，然后尝试一下：

git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"



下载失败报错之后尝试
第二种办法：

为了防止出错，先把之前安装到一半的brew卸载了：
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"


curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh >> brew_install.sh

vim brew_install.sh

将文件中的
BREW_REPO="https://github.com/Homebrew/brew"
改为
BREW_REPO="https://mirrors.ustc.edu.cn/brew.git"
CORE_TAP_REPO="https://mirrors.ustc.edu.cn/homebrew-core.git"

运行：
/bin/bash brew_install.sh

如果出现下面这种下载速度慢或者卡住的情况，把终端停掉，使用浏览器打开那个链接进行下载，比如这里是 https://homebrew.bintray.com/bottles-portable-ruby/portable-ruby-2.6.3.mavericks.bottle.tar.gz，下载完成后将该文件放进 /Users/$你的用户名/Library/Caches/Homebrew 中。

==> Downloading https://homebrew.bintray.com/bottles-portable-ruby/portable-ruby-2.6.3.mavericks.bottle.tar.gz
############### 21.6%

重新运行安装指令。

/bin/bash brew_install.sh

如果安装过程中卡在了 Clone 什么的地方不动了，则停掉终端，运行下列指令。

git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1

执行完上述指令，再重新运行安装指令。

/bin/bash brew_install.sh

安装完成。

第三种方法：

利用中科大的源：

/usr/bin/ruby -e "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install)"
如果命令执行中卡在下面信息：

==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...

请Control + C中断脚本执行如下命令：

cd "$(brew --repo)/Library/Taps/"
mkdir homebrew && cd homebrew
git clone git://mirrors.ustc.edu.cn/homebrew-core.git


打开新的终端：
brew doctor
```

常用的Brew的一些命令：

```
brew install <package name> //安装一个包
brew upgrate <package name> //更新一个包
brew update //更新 Homebrew 在服务器端上的包目录
brew upgrade //以本地目录更新本地的包
brew list --versions //查看安装过的包版本
```

### Brew_cask

brew 装的主要是 command line tool。
brew cask装的大多是有gui界面的app以及驱动，brew cask是brew的一个官方源。
brew cask 是 已经编译好了的应用包 （.dmg/.pkg），仅仅是下载解压，放在统一的目录中（/opt/homebrew-cask/Caskroom）

brew_cask 原理：
之前，是用软链接的方式将应用链接到 Application 文件夹，有人说这样的方式会导致 Spotlight 无法检索到。但现在，它是将应用直接移动到 Application 文件夹，这与我们自己去官网下载应用再安装是完全一致的，后续更新或卸载也按平常的方式即可。

当然，也可以用 brew cask uninstall 应用名称 的方式，这种方式才会删除路径 /usr/local/Caskroom 中保留的应用信息文件，这样当我们用命令 brew cask list 查询已安装列表时，已卸载的应用才不会仍显示。也就是说，如果按照平常的方式，比如直接移到废纸篓，那么还需手动删除 Caskroom 中的应用信息文件。当然，不删除也没啥影响，因为一般没必要查看已安装列表，已安装应用在 Launchpad 中查看就好。


二者并无竞争关系，所以也不存在你说的更推荐brew cask。brew装的东西比较偏向开发，而brew cask装的东西会相对生活化一些。

大体安装步骤是：xcode—homebrew—homebrew cask

接下来安装Brew_cask:

```
brew tap homebrew/cask-cask  // 添加 Github 上的 caskroom/cask 库
brew install brew-cask  // 安装 brew-cask

如果遇到卡在克隆界面：

cd "$(brew --repo)/Library/Taps/"
cd homebrew
git clone https://mirrors.ustc.edu.cn/homebrew-cask.git

brew update && brew upgrade brew-cask && brew cleanup // 更新

更换中科大源：

git -C "$(brew --repo)" remote set-url origin https://mirrors.ustc.edu.cn/brew.git

git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

brew update
```


### Python3

```
brew install python

根据安装路径的一些问题：

配置   ~/.zshrc

➜  ~ cat ~/.bash_profile
# Setup System PATH

# Python 2.7
export PATH="/System/Library/Frameworks/Python.framework/Versions/2.7/bin:$PATH"

# pip
# /usr/local/bin/目录下的pip指向Python2.7，所以不修改系统路径

# Python 3.8
export PATH="/usr/local/Cellar/python@3.8/3.8.5/bin:$PATH"

# pip3
export PATH="/usr/local/Cellar/python@3.8/3.8.5/bin:$PATH"


# Alias Command

alias python='python2'
alias python3='python3.8'
alias python2='python2'
alias subl="'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'"


删除 /usr/local/bin/目录下的pip3 和 pip3.8   因为该目录下的这三个pip全部指向的是：python2的 pip。


查看Python的安装路径：

which Python
which python2
which python3

查看pip 、pip3的真实文件位置

pip --version
pip3 --version

查看pip安装的模块位置

python3
import requests
requests

调用python的时候默认使用的￥PATH中的从左到右的顺序调用。

```

### on_my_zsh的安装

```
参考官方网站的安装方式：

# curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# wegt 
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"

重启终端，查看当前终端：
echo $SHELL
查看已有终端：
cat /etc/shell
更换终端：
chsh -s /bin/zsh


主题的更换：
查看自带主题：
ls .oh-my-zsh/themes
这里选择的是自带的默认主题，因为这个最好看。。。。

常用的插件安装：

incr:
自动补全命令
wget http://mimosa-pudica.net/src/incr-0.2.zsh
mkdir ~/.oh-my-zsh/plugins/incr
mv incr-0.2.zsh ~/.oh-my-zsh/plugins/incr
echo 'source ~/.oh-my-zsh/plugins/incr/incr*.zsh' >> ~/.zshrc
source ~/.zshrc


zsh-autosuggestions：
根据历史命令自动补全插件

git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
vim ~/.zshrc
# 加入插件列表
plugins=(
  git
  zsh-autosuggestions
)
执行：
source ~/.zshrc

autojump:
目录跳转插件：

brew install autojump
echo '[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh' >> ~/.zshrc
source ~/.zshrc

例如：jo te //打开Finder


zsh-syntax-highlighting
可执行代码自动高亮：主要用于提高颜值
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
vim ~/.zshrc
# 加入插件列表
plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)
source ~/.zshrc

```


### Home_brew 走代理：

在  ~/.zshrc  里面添加：
```
# where proxy
proxy () {
  export all_proxy=socks5://localhost:port
  echo "HTTP Proxy on"
}

# where noproxy
noproxy () {
  unset all_proxy
  echo "HTTP Proxy off"
}

执行；
source ~/.zshrc

测试：
curl cip.cc
```



### Sublime Text3 插件：

安装过程不言，插件列表如下：

```
AutoFileName
JsFormat
SublimeCodeIntel
ConvertToUTF8
BracketHighlight
markdown preview

```
