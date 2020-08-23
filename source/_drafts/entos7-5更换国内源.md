title: Centos7.5更换国内源
author: 7h4mid4
tags:
  - Centos
  - 换源
  - Linux
categories:
  - Linux
date: 2019-08-15 21:54:00
---
今天新搭了一台vps，尝试了一下Centos7.5，说实话，用惯了Ubuntu，初次使用Centos是真的有点不习惯，走了好大的坑，在此记录一下当中的换源的操作。

```
cd /etc/yum/repos.d
//有可能是/etc/yum.repo.d

wget http://mirrors.163.com/.help/CentOS-Base-163.repo
//注意，获得的163网易源是有问题的，我们需要更改其中的部分内容

vim CentOS-Base-163.repo
:%s/$releasever/7/g
//将其中的releasever换成7即可。
//如果是Centos，将其中的releasever换成6即可。

yum clean all

yum makecache 

yum update

```