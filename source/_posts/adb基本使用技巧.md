title: adb基本使用技巧
author: 九月八
date: 2020年8月26日 10:24:51
categories: 
  - Android
  - adb
tags: 
  - Android
  - 逆向
  - adb
keywords: 
description: 
password: 
top: 
summary_img: /summary/summary001.png
copyright: true

---


## adb运行原理

adb 的运行原理是 PC 端的 adb server 与手机端的守护进程 adbd 建立连接，然后 PC 端的 adb client 通过 adb server 转发命令，adbd 接收命令后解析运行。


## adb的安装：

### Mac端的安装

```
brew cask install android_platform_tools
```
### Windows端的安装

略

## ADB与手机的连接方式

### 通过USB方式

- USB线连接手机电脑
- 手机进入开发者模式，各品牌手机方法自查，手机开启USB调试
- 使用命令`adb devices`查看设备列举，SerielNumber（SN）-STATUS（offline、device、no device），offline指的是连接但未响应
- 如果没有，使用命令`system_profiler SPUSBDataType`查看手机的VID，并将VID写入到~/.android/adb_usb.ini文件中，该文件可能需要新建
- 使用命令 `adb kill-server`停止服务，`adb start-server`重启服务
- 再次执行 `adb devices`查看是否连接上设别

### 通过无线连接的方式（仍然需要USB线）

- 先保证手机电脑在同一局域网内，记录手机IP
- 手机进入开发者模式，各品牌手机方法自查，手机开启USB调试
- 用USB线连接手机电脑，使用`adb tcpip 5555`监听手机设备的5555端口
- 断开USB连接，执行`adb connect Android_ip:5555`
- 执行`adb devices`查看是否连接成功


## ADB的基本命令：

```
adb version
# 查看ADB版本

adb devices
# 查看手机设备

adb shell ifconfig
# 查看手机网络信息

adb logcat
# 查看设备日志

adb reboot
# 重启手机设备

adb reboot recovery
# 重启手机进入recovery模式

adb shell pm list packages [-f] [-d] [-e] [-s] [-3] [-i] [-u] [--user USER_ID] [FILTER]
# 查看手机安装包：-f 应用关联的apk及地址  -d disabled的应用  -e enable的应用  -s 系统应用  -3 第三方应用  -i 应用的installer和来源  -u 已卸载的应用（不太好用）  <包含字符串>

adb install [-r] [-s] [-d] /path/demo.apk
# 安装apk，-r 允许覆盖安装  -s 应用安装到sdcard目录  -d 允许降级覆盖安装

adb uninstall [-k] <package>
# 卸载apk，-k 保留用户数据和缓存兖 

adb shell dumpsys battery
# 查看电池信息

adb shell settings get secure android_id
# 查看设备ID

adb shell dumpsys iphonesubinfo
# 查看设备IMEI，Android4.4版本以下

adb shell getprop ro.build.version.release
# 查看Android版本

adb shell getprop ro.build.version.security_patch
# 查看系统安全补丁级别（显示日期）

adb shell getprop ro.product.model
# 查看设备型号

adb shell gerprop ro.product.brand
# 查看手机型号

adb shell getprop ro.product.name
# 查看手机设别名

adb shell getprop ro.product.board
# 查看处理器型号

adb shell getprop ro.product.cpu.abilist
# 查看CPU支持的abi列表

adb shell getprop dalvik.vm.heapsize
# 查看每个应用程序支持的内存上限

adb shell cat /proc/cpuinfo
# 查看CPU信息

adb shell dumpsys window displays
# 显示屏参数

adb shell ime list -s
# 获取手机输入法

adb shell ime list -s
# 获取手机的序列号。手机的SN

adb shell ps
# 查看系统运行进程

adb shell top
# 查看最高占用进程

adb shell cat /sys/class/net/wlan0/address
# 查看手机的MAC地址

adb shell cat /proc/meminfo
# 查看手机的内存信息

adb shell ps +  进程的包名
# 查看指定包的进程

adb shell ls /path/
# 查看系统磁盘情况

adb shell screencap -p /sdcard/aa.png
# 手机设备截屏 [-p] 导出的格式为png格式

adb pull /sdcard/aa.png ./
# 手机文件下载到电脑

adb push aa.png /data/local/
# 电脑文件上传到手机

adb shell screenrecord /sdcard/ab.mp4
# 手机设备录像 录制的最长时间是180秒

adb shell wm size
# 手机屏幕分辨率

adb shell wm density
# 手机屏幕密度

adb shell input tap xvalue yvalue
# 手机屏幕点击

adb shell input swipe 1000 1500 200 200
# 手机屏幕滑动

adb shell input swipe 1000 1500 0 0 1000
# 手机屏幕带时间滑动

adb shell input text xxxxx
# 手机文本输入

adb shell input keyevent xx
# 手机键盘事件

adb shell monkey -p <packagename> -v 800
# 使用monkey对指定应用程序生成伪随机事件进行测试

adb -s serialNumber <command>
# 连接多个手机设备时，指定手机设备

```