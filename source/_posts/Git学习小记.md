title: Git学习小记
author: 九月八
date: 2020-09-02 08:18:23
categories: 
  - 学习
  - Git
tags: 
  - Git
keywords: 
description: 
password: 
top: 
summary_img: /summary/summary003.jpeg
copyright: true

---


<blockquote class="blockquote-center">再冷的石头，坐上三年也会暖。</blockquote>

Git跟踪并管理的是修改，而非文件。

那么，什么是修改呢？你新增了一行或者修改了一个词都是一个修改。

我们来做个简单的实验就能理解，首先，我们先添加一行内容：

```
$ cat whatisgit
Git is open source software.
Git是开源软件。
新增第一行
```

然后，提交到暂存区：

```
$ git add whatisgit
$ git status
# 位于分支 master
# 要提交的变更：
#   （使用 "git reset HEAD <file>..." 撤出暂存区）
#
#       修改：      whatisgit
```


然后，我们再修改文件，添加一行内容：

```
$ cat whatisgit
Git is open source software.
Git是开源软件。
新增第一行
第二次新增
```

提交到版本库：

```
$ git commit -m "管理修改"
[root@v-centos7 gitrep]# git commit -m "管理修改"
[master 6f73786] 管理修改
 1 file changed, 1 insertion(+)
```

提交后，查看状态：

```
$ git status
# 位于分支 master
# 尚未暂存以备提交的变更：
#   （使用 "git add <file>..." 更新要提交的内容）
#   （使用 "git checkout -- <file>..." 丢弃工作区的改动）
#
#       修改：      whatisgit
#
修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

可以看到还有修改未提交，说明第二次修改没有提交，我们通过命令来确认下工作区的内容和版本库中的内容：

```
$ git diff HEAD -- whatisgit
diff --git a/whatisgit b/whatisgit
index 3dd2a10..5a0ca24 100644
--- a/whatisgit
+++ b/whatisgit
@@ -1,3 +1,4 @@
 Git is open source software.
 Git是开源软件。
 新增第一行
+第二次新增
```

的确，第二次修改没有提交。

为什么呢？因为git commit只是把暂存区的内容提交到了版本库，而第二次修改的内容还未被提交到暂存区，所以第二次的修改并不能提交到版本库。

现在我们来把第二次的修改也提交到版本库：

```
$ git add whatisgit
$ git commit -m "git管理第二次提交"
[master f65993a] git管理第二次提交
 1 file changed, 1 insertion(+)
```

好的，至此第二次修改也提交到了版本库。

我们来总结下，首先通过git add将工作区中的内容提交到暂存区，然后使用git commit将暂存区的内容提交到版本库。

 

如何撤销修改？

我们通过几个小例子来演示下如何撤销修改。

首先，我们在文件中增加一行内容“工作不在状态”：

```
$ cat whatisgit
Git is open source software.
Git是开源软件。
新增第一行
第二次新增
工作不在状态
```

如果我们的修改还未提交到暂存区，我们可以手动将工作区的文件修改回去，但是，Git有更便捷的方法。我们来通过git status命令查看：

```
$ git status
# 位于分支 master
# 尚未暂存以备提交的变更：
#   （使用 "git add <file>..." 更新要提交的内容）
#   （使用 "git checkout -- <file>..." 丢弃工作区的改动）
#
#       修改：      whatisgit
#
修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

Git告诉我们有未提交到暂存区的修改，可以通过git checkout -- <file>丢弃工作区的修改：

```
$ git checkout -- whatisgit
$ git status
# 位于分支 master
无文件要提交，干净的工作区
$ cat whatisgit
Git is open source software.
Git是开源软件。
新增第一行
第二次新增
```

通过查看结果，的确，文件内容被还原回去了。

那如果我们的修改已经被提交到了暂存区怎么办呢？

```
$ cat whatisgit
Git is open source software.
Git是开源软件。
新增第一行
第二次新增
工作又不在状态了
$ git add whatisgit
```

先卖个关子，让Git告诉我们怎么办，我们运行git status看看：

```
$ git status
# 位于分支 master
# 要提交的变更：
#   （使用 "git reset HEAD <file>..." 撤出暂存区）
#
#       修改：      whatisgit
#
```

Git告诉我们可以通过git reset HEAD <file>撤出暂存区：

```
$ git reset HEAD whatisgit
重置后撤出暂存区的变更：
M       whatisgit
$ git status
# 位于分支 master
# 尚未暂存以备提交的变更：
#   （使用 "git add <file>..." 更新要提交的内容）
#   （使用 "git checkout -- <file>..." 丢弃工作区的改动）
#
#       修改：      whatisgit
#
修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

通过命令结果可以看到暂存区的修改被撤销了，但是工作区的修改还在，工作区的修改怎么撤销已经讲过了：

```
$ git checkout -- whatisgit
$ git status
# 位于分支 master
无文件要提交，干净的工作区
```

好了，一天下来什么都没干！

那如果修改已经提交到版本库了怎么办呢？

请参照之前的版本回退，前提是你还没把本地库推送到远程库。

 

删除文件

在Git中，删除文件也是一种修改，我们来实验下，首先新增文件delete.txt并提交：

```
$ git add delete.txt
$ git commit -m "提交删除文件"
[master 2e7616d] 提交删除文件
 1 file changed, 1 insertion(+)
 create mode 100644 delete.txt
```
 
然后，我们从工作区中删除文件，并查看状态：

```
$ rm delete.txt
$ git status
# 位于分支 master
# 尚未暂存以备提交的变更：
#   （使用 "git add/rm <file>..." 更新要提交的内容）
#   （使用 "git checkout -- <file>..." 丢弃工作区的改动）
#
#       删除：      delete.txt
#
修改尚未加入提交（使用 "git add" 和/或 "git commit -a"）
```

现在，我们可以通过git rm，并用git commit提交：

```
$ git rm delete.txt
$ rm 'delete.txt'
$ git commit -m "删除文件"
[master 0088341] 删除文件
 1 file changed, 1 deletion(-)
 delete mode 100644 delete.txt
```

ok，文件以及从版本库中删除。

 

git checkout -- <file> 撤销工作区中的修改，使其跟暂存区或版本库一致；

git reset HEAD <file> 切换到指定的历史版本或将暂存区中的修改回退到工作区；

git rm 从Git中删除文件；

