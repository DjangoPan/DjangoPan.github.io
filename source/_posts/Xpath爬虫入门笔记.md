title: Xpath爬虫入门笔记
author: 九月八
date: 2020-08-29 10:05:23
categories: 
  - 学习
  - Python
tags: 
  - Python
  - 爬虫
keywords: 
description: 
password: 
top: 
summary_img: /images/pasted-103.png
copyright: true

---

## 安装lxml模块

## 简单实例

### 实例一：

```
from lxml import etree

text = '''
<div>
    <ul>
         <li class="item-0"><a href="https://ask.hellobi.com/link1.html">first item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link2.html">second item</a></li>
         <li class="item-inactive"><a href="https://ask.hellobi.com/link3.html">third item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link4.html">fourth item</a></li>
         <li class="item-0"><a href="https://ask.hellobi.com/link5.html">fifth item</a></li>
     </ul>
 </div>
''' # 声明一段text文本
html = etree.HTML(text) #调用 HTML 类进行初始化,返回一个Xpath解析对象
result = etree.tostring(html) #调用Etree的自动修正模块
print(result.decode('utf-8')) #将bytes转化为str类型
```

### 对文本文件进行Xpath解析：

```
from lxml import etree

html = etree.parse('./test.html', etree.HTMLParser())
result = etree.tostring(html)
print(result.decode('utf-8'))
```

### 选取所有符合要求的节点

xpath规则是`//*`

```
from lxml import etree

html = etree.parse('./test.html', etree.HTMLParser())
result = html.xpath('//*')
print(result)
```

运行结果是返回所有节点的列表：

```
[<Element html at 0x103eb87c0>, <Element body at 0x104599a00>, <Element div at 0x104599a80>, <Element ul at 0x104599980>, <Element li at 0x104599ac0>, <Element a at 0x104599b40>, <Element li at 0x104599b80>, <Element a at 0x104599bc0>, <Element li at 0x104599c00>, <Element a at 0x104599b00>, <Element li at 0x104599c40>, <Element a at 0x104599c80>, <Element li at 0x104599cc0>, <Element a at 0x104599d00>]
```

### 返回我们想要的节点，比如li:

```
result = html.xpath('//li')
```

#### 返回节点属性过滤：

```
from lxml import etree
html = etree.parse('./test.html', etree.HTMLParser())
result = html.xpath('//li[@class="item-0"]')
print(result)
```

#### 返回指点节点的直接子节点：

```
result = html.xpath('//li/a')
```

#### 返回指定节点的所有子孙节点：

```
result = html.xpath('//li//a')
```

### 返回父节点
比如选中了`a`标签内的`href`属性，需要返回父节点`li`的`class`属性：

```
from lxml import etree
text = '''
<div>
    <ul>
         <li class="item-1"><a href="https://ask.hellobi.com/link4.html">fourth item</a></li>
     </ul>
 </div>
'''
html = etree.HTML(text)
result = etree.tostring(html)
result = html.xpath('//a[@href="https://ask.hellobi.com/link4.html"]/../@class')
# result = html.xpath('//a[@href="https://ask.hellobi.com/link4.html"]/parent::*/@class')
print(result)
```

运行结果：

```
['item-1']
```

### 文本获取
获取节点中的文本
三种方法的区分：

```
from lxml import etree
text = '''
<div>
    <ul>
         <li class="item-0"><a href="https://ask.hellobi.com/link1.html">first item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link2.html">second item</a></li>
         <li class="item-inactive"><a href="https://ask.hellobi.com/link3.html">third item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link4.html">fourth item</a></li>
         <li class="item-0"><a href="https://ask.hellobi.com/link5.html">fifth item</a>
     </ul>
 </div>
'''
html = etree.HTML(text)
result = etree.tostring(html)
result1 = html.xpath('//li[@class="item-0"]/text()')
result2 = html.xpath('//li[@class="item-0"]/a/text()')
result3 = html.xpath('//li[@class="item-0"]//text()')
print(result1)
print(result2)
print(result3)
```

返回结果是：
```
['\n     ']
['first item', 'fifth item']
['first item', 'fifth item', '\n     ']
```

因为etree的tostring方法对丢失的</li>进行修正，修正结果：

```
<li class="item-0"><a href="link1.html">first item</a></li>
<li class="item-0"><a href="link5.html">fifth item</a>
</li>
```


```
result1 = html.xpath('//li[@class="item-0"]/text()')
# 解析 <li> 标签内的所有子节点的文本，自然也就是补全的<li></li>的换行符
result1 = html.xpath('//li[@class="item-0"]/a/text()')
# 解析 <li> 标签内的所有子节点中a标签的的文本
result3 = html.xpath('//li[@class="item-0"]//text()')
解析 <li> 标签内的所有子孙节点的文本
```

### 获取指定属性：

```
from lxml import etree

html = etree.parse('./test.html', etree.HTMLParser())
result = html.xpath('//li/a/@href')
print(result)
```

返回结果：

```
['https://ask.hellobi.com/link1.html', 'https://ask.hellobi.com/link2.html', 'https://ask.hellobi.com/link3.html', 'https://ask.hellobi.com/link4.html', 'https://ask.hellobi.com/link5.html']
```

### 属性多值匹配

```
from lxml import etree
text = '''
<li class="li li-first"><a href="https://ask.hellobi.com/link.html">first item</a></li>
'''
html = etree.HTML(text)
result1 = html.xpath('//li[@class="li"]/a/text()')
# 匹配到属性里有 `li` 和 `li-first` 属性。
result2 = html.xpath('//li[contains(@class, "li")]/a/text()')
# contains()函数参数一：属性名称，参数二：传入属性值
print(result1)
print(result2)
```

运行结果：

```
[]
['first item']
```

### 多属性匹配

使用`and`来连接多属性

```
from lxml import etree
text = '''
<li class="li li-first" name="item"><a href="https://ask.hellobi.com/link.html">first item</a></li>
'''
html = etree.HTML(text)
result = html.xpath('//li[contains(@class, "li") and @name="item"]/a/text()')
print(result)
```

### 按位置选取

想要返回指定顺序的节点

```
from lxml import etree

text = '''
<div>
    <ul>
         <li class="item-0"><a href="https://ask.hellobi.com/link1.html">first item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link2.html">second item</a></li>
         <li class="item-inactive"><a href="https://ask.hellobi.com/link3.html">third item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link4.html">fourth item</a></li>
         <li class="item-0"><a href="https://ask.hellobi.com/link5.html">fifth item</a>
     </ul>
 </div>
'''
html = etree.HTML(text)
result = html.xpath('//li[1]/a/text()')
print(result)
# 返回第一个节点
result = html.xpath('//li[last()]/a/text()')
print(result)
# 返回最后一个节点
result = html.xpath('//li[position()<3]/a/text()')
print(result)
# 返回位置小于3的节点，就是第一二个
result = html.xpath('//li[last()-2]/a/text()')
print(result)
# 返回倒数第三个节点
```


### 节点轴

```
from lxml import etree

text = '''
<div>
    <ul>
         <li class="item-0"><a href="https://ask.hellobi.com/link1.html"><span>first item</span></a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link2.html">second item</a></li>
         <li class="item-inactive"><a href="https://ask.hellobi.com/link3.html">third item</a></li>
         <li class="item-1"><a href="https://ask.hellobi.com/link4.html">fourth item</a></li>
         <li class="item-0"><a href="https://ask.hellobi.com/link5.html">fifth item</a>
     </ul>
 </div>
'''
html = etree.HTML(text)
result = html.xpath('//li[1]/ancestor::*')
print(result)
result = html.xpath('//li[1]/ancestor::div')
print(result)
result = html.xpath('//li[1]/attribute::*')
print(result)
result = html.xpath('//li[1]/child::a[@href="https://ask.hellobi.com/link1.html"]')
print(result)
result = html.xpath('//li[1]/descendant::span')
print(result)
result = html.xpath('//li[1]/following::*[2]')
print(result)
result = html.xpath('//li[1]/following-sibling::*')
print(result)
```

运行结果：

```
[<Element html at 0x102d47840>, <Element body at 0x103429a00>, <Element div at 0x103429900>, <Element ul at 0x103429a40>]
[<Element div at 0x103429900>]
['item-0']
[<Element a at 0x103429900>]
[<Element span at 0x103429b00>]
[<Element a at 0x103429ac0>]
[<Element li at 0x103429980>, <Element li at 0x103429900>, <Element li at 0x103429a00>, <Element li at 0x103429a40>]
```