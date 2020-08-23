title: pwnable系列-fd
author: 7h4mid4
tags:
  - pwnable
  - 文件描述符
  - CTF
categories:
  - 学习
  - CTF
date: 2019-08-13 14:05:00
---
![upload successful](/images/pasted-1.png)

![upload successful](/images/pasted-2.png)

### 到位。直接读源码就可以了。

        #include <stdio.h>
        #include <stdlib.h>
        #include <string.h>
        char buf[32];
        int main(int argc, char* argv[], char* envp[]){
        	if(argc<2){
	        	printf("pass argv[1] a number\n");
	        	return 0;
        	}
            
            
            
        	int fd = atoi( argv[1] ) - 0x1234;
        	int len = 0;
        	len = read(fd, buf, 32);
        	if(!strcmp("LETMEWIN\n", buf)){
        		printf("good job :)\n");
        		system("/bin/cat flag");
        		exit(0);
        	}
            
            
            
        	printf("learn about Linux file IO\n");
        	return 0;

        }


### 关键参数解读：


首先main函数使用了带参数的形式：`int main(int argc, char* argv[], char* envp[])`

* argc: 参数的个数，不给main()函数传递参数时默认值为1，即至少有一个参数为该可执行文件的文件名（含目录）。

* argv: 为指针数组，分别指向各个字符串参数的首地址，其中argv[0]存储的是可执行文件的文件名的首地址 

* envp:存放系统的环境变量 。

假设有一个文件名为1.sh的文件中主函数声明为int main(int argc , char* argv[] )的形式，如果调用时使用
        `root@kali-linux:~# ./1.sh hahaha xixixi hehehe`的形式，则此时:
        argc的值为4，argv[0]为“1.sh” ，argv[1]为“hahaha”，argv[2]为“xixixi”，argv[3]为“hehehe” 。



* * * * *

#### atoi()函数
`int atoi(const char *str)` 

函数说明：把参数 str 所指向的字符串转换为一个整数（类型为 int 型）


#### read()函数


`ssize_t read(int fd, void * buf, size_t count);`  


函数说明：read()会把参数fd所指的文件传送count 个字节到buf 指针所指的内存中。

返回值：返回值为实际读取到的字节数, 如果返回0, 表示已到达文件尾或是无可读取的数据。若参数count 为0, 则read()不会有作用并返回0。


###### 注意：read时fd中的数据如果小于要读取的数据，就会引起阻塞。




#### 解读：

##### 1.读取fd所指的文件，并把其中一定量的字符（这里是32个）放到buf中。只要构造出内容为“LETMEWIN\n”的文件就可以实现了。但是好像比较麻烦。


##### 2.题目提示：文件描述符（file description）

##### 关于文件描述符：


![upload successful](/images/pasted-3.png)


##### fd=0时直接就是standard input，美滋滋。
##### 直接就是`int fd = atoi( argv[1] ) - 0x1234`的值为0，然后带一个参数即可。
##### 另外，注意：0x1234为16进制数，如果我们在参数输入时输入0x1234，atoi()函数会将0x1234中的x转为整型数字，因此数值会发生变化，此时应该使用进制转换将0x1234转换为十进制的4660再输入“LETMEWIN”即可获得flag。


![upload successful](/images/pasted-4.png)

#### flag:`mommy! I think I know what a file descriptor is!!`