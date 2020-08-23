title: 通用pwn exp脚本
author: 7h4mid4
tags:
  - pwn
  - EXP
categories:
  - pwn
date: 2019-08-18 13:07:00
---
## stack

    from pwn import *
    context.log_level = 'debug'
    io = process("")
    code = ELF("")
    #lib = ELF("./bc.so.6")
    #r = remote("")
    def debug():
        print io.pid
        pause()
    def gdb(script = ''):
        gdb.attach(io, gdbscrippt = script)
    
    def exploit():
    
        io.interactive()
    exploit()
    
    
    
## heap

```
from pwn import *
context.log_level = 'debug'
io = process("./")
#io = remote("",)
libc = ELF("./bc.so.6")
def add(size):
    io.sendlineafter(">> ",'1')
    io.sendlineafter("Size:",str(size))
def delete(num):
    io.sendlineafter(">> ",'4')
    io.sendlineafter("Input your id:",str(num))
def show(num):
    io.sendlineafter(">> ",'2')
    io.sendlineafter("Input your id:",str(num))
def edit(num,content):
    io.sendlineafter(">> ",'3')
    io.sendlineafter("Input your id:",str(num))
    io.sendlineafter("Content:",content)
def debug():
    print io.pid
    pause()
def dbg(script=''):
    gdb.attach(io, gdbscript=script)
def exploit():

```