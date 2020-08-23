title: 使用frp实现内网穿透
author: 7h4mid4
tags:
  - 内网穿透
  - frp
  - linux
categories:
  - 学习
  - ''
date: 2019-08-13 13:18:00
---
### 介绍：
在学校常驻一台ubuntu18.04的台式机（IP地址：192.168.165.225），笔记本里有一台kali的虚拟机（IP地址：192.168.165.226），为了能在宿舍里和家里用ssh远程操作时时学习，故学习**frp**实现内网穿透。

### 环境：
 - **阿里云服务器：**
 公网IP地址：47.101.209.132
 操作系统：Centos 7.0
 

 - **Ubuntu18.04：**
 内网IP地址：192.168.165.225
 操作系统：Ubuntu 18.04
 
  - **kali虚拟机：**
  内网IP地址：192.168.165.226
  操作系统：Kali
  
  
   ### frp实现原理：
   
   [frp官方文档](https://github.com/fatedier/frp)
   
   
   
   ### 搭建过程：
   #### 阿里云服务器端：
   
   ##### 下载
        wget https://github.com/fatedier/frp/releases/download/v0.28.2/frp_0.28.2_linux_amd64.tar.gz
        
        sudo tar -zxvf frp_0.28.2_linux_amd64.tar.gz               --解压
        
        sudo mv frp_0.28.2_linux_amd64 frp_0.28.2           --重命名为frp_0.28.2     
        
        sudo rm -rf frp_0.28.2_linux_amd64.tar.gz           --删除相关的压缩包
        
  
 ##### 启动
  
        sudo ./frps -c ./frps.ini               --后台启动为 sudo ./frps -c ./frps.ini &
        
        
 ##### 设置开机启动和后台运行
 
 
 [实现开机自启动的三种办法](https://blog.csdn.net/qq_29726869/article/details/82871700)
 
 编辑开机启动文件：
        
        vi /etc/systemd/system/frps.service
        
在文件中写入：
        
        [Unit]
        Description=frps daemon
        After=syslog.target  network.target
        Wants=network.target

         [Service]
         Type=simple
         ExecStart=绝对路径/frps -c 绝对路径/frps.ini 
         Restart= always
         RestartSec=1min

        [Install]
        WantedBy=multi-user.target
 
 
 实现开机启动和后台启动：
 
        
        systemctl start frps            --启动frps
        systemctl enable frps           --设置为开机启动
        
        
#### Ubuntu18.04 || Kali

##### 下载

        wget https://github.com/fatedier/frp/releases/download/v0.28.2/frp_0.28.2_linux_amd64.tar.gz
        
        sudo tar -zxvf frp_0.28.2_linux_amd64.tar.gz               --解压
        
        sudo mv frp_0.28.2_linux_amd64 frp_0.28.2           --重命名为frp_0.28.2     
        
        sudo rm -rf frp_0.28.2_linux_amd64.tar.gz           --删除相关的压缩包     
        
        
##### 编辑客户端配置文件

        sudo vim frpc.ini       --编辑客户端配置文件
        
写入：
        
        frpc.ini[common]server_addr = x.x.x.x               --服务器IP地址
        server_port = 7000

        [ssh]                                               --名字随便取
        type = tcp
        local_ip = 127.0.0.1
        local_port = 22
        remote_port = 6000
        
        
        [web]
        type = http #
        local_port = 8081 
        custom_domains = repo.iwi.com               --据说必须要有，但自己没有web穿透的需求，没试过。

        
        
##### 启动：

        sudo ./frpc -c ./frpc.ini               --后台启动为 sudo ./frpc -c ./frpc.ini &
        
##### 设置开机和后台启动

        因为ubuntu18.04的开机启动项和之前版本发生了较大的变化，所以这方面的知识还有待学习。
       
      
        kali的方法和服务器端一致。


[在Ubuntu18.04中调整rc.local启动项](https://blog.csdn.net/dahuzix/article/details/80785691)


### 注意点

 - 记得开放阿里云安全组策略
 - 客户端和服务器端需要使用相同的frp版本