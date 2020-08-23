title: Cowrie蜜罐简单尝试
author: 7h4mid4
tags:
  - Cowrie
  - 蜜罐
categories:
  - 渗透
date: 2019-09-04 09:47:00
---
## 概述

对Cowrie早有耳闻，一直念念不忘，今天忙里偷闲，查阅官方文档，结合网上教程，中途采坑无数，终成功搭建。现将搭建过程一一呈现。


因为是捕获攻击行为，所以我们首先得有一台欧洲附近的VPS，我就在vultr上选择了一台法国主机。

## 环境

OS：ubuntu 16.04

ip：80.240.20.182

address：France

## 搭建过程

### 抬高默认SSH端口
在安装Cowrie之前首先将修改默认的ssh端口`22`让出来，编辑 `#Port 22` 修改为 `Port 22222`

```
vim /etc/ssh/sshd_config

修改为 22222

#重新启动ssh服务
/etc/init.d/ssh restart

断开连接，重新连接ssh，注意，端口已经改为22222。
```

### 安装依赖项

安装Python3的依赖项

```
apt install git python-virtualenv libssl-dev libffi-dev build-essential libpython3-dev python3-minimal authbind virtualenv
```

安装Python2的依赖项
```
apt install git python-virtualenv libssl-dev libffi-dev build-essential libpython-dev python2.7-minimal authbind
```

### 创建用户

```
adduser --disabled-password cowrie
su - cowrie

```

### git代码
```
git clone http://github.com/cowrie/cowrie
cd cowrie
```

### 激活虚拟环境

```
pwwd
virtualenv --python=python3 cowrie-env
#或者创建Python2的虚拟环境
virtualenv --python=python2 cowrie-env
```

激活环境并安装包：
```
source cowrie-env/bin/activate
pip install --upgrade pip
pip install --upgrade -r requirements.txt
```

### 创建并修改配置文件

```
cd /home/cowrie/cowrie/etc/
cp cowrie.cfg.dist cowrie.cfg
vim cowrie.cfg
#修改default name 为 Django

```
注意，cowrie的ssh默认端口是2222。

### 启动Cowrie

```
cd /home/cowrie/cowrie/
./bin/cowrie start

```

### 端口转发

```
iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222
```

为什么选择cowrie的默认SSH端口2222，然后端口转发到22，而不是直接修改cowrie的ssh监听22端口为22。
因为，在启动cowrie的时候是以cowrie的普通用户权限执行的，而普通用户不能直接开放1024以内的端口。但是我们又不能用root权限启动cowrie，两者自相矛盾。

### 简单测试

```
tail -f /home/cowrie/cowrie/var/log/cowrie/cowrie.json

```

查看登录成功的记录：
```
cat /home/cowrie/cowrie/var/log/cowrie/cowrie.json | grep success

{"password":"root","src_ip":"5.188.86.164","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:05:03.511816Z","session":"86db2c24adca"}
{"password":"root","src_ip":"5.188.86.210","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:05:05.757924Z","session":"ccf709714130"}
{"password":"root","src_ip":"5.188.86.169","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:05:10.460597Z","session":"83c13f52700e"}
{"password":"root","src_ip":"5.188.86.169","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:05:34.359839Z","session":"7758eebae3a3"}
{"password":"root","src_ip":"193.32.161.176","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:05:35.328376Z","session":"6dd4c70d1f51"}
{"password":"root","src_ip":"5.188.86.220","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:06:33.090110Z","session":"df7da3aa3ca1"}
{"password":"root","src_ip":"5.188.86.210","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:06:36.753434Z","session":"d567119597cd"}
{"password":"root","src_ip":"5.188.86.169","username":"root","sensor":"vultr.guest","message":"login attempt [root/root] succeeded","eventid":"cowrie.login.success","timestamp":"2019-09-03T12:06:39.353825Z","session":"936d663f58e3"}
```
其实还有别的一些接收outputs的方法，时间紧迫，留作以后继续研究，留个盼头嘛٩(๑>◡<๑)۶ 

#### 中间采坑无数，网上的众多教程由于版本过老，很多没能成功，此博客记录自己搭建成功的过程，留作日后复现。