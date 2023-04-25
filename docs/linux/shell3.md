---
icon: linux
title: Shell脚本编程-高级
category: 
- Linux
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

shell脚本高级实战案例篇

<!-- more -->

# Shell脚本编程高级篇

## 创建函数

### 基本的脚本函数

#### 创建函数

```shell
#1
function  name {
 commands
}
#2
name () {
 commands
}
```

#### 使用函数

```shell
#!/bin/bash

count=1

function func1 {
    echo "# $count - This is an example of a function111"
}
func2 () {
    echo "# $count - This is an example of a function222"
}


while [ $count -le 5 ]
do
    func1
    count=$[ $count + 1 ]
done

while [ $count -ge 5 ] && [ $count -le 10 ]
do
    func2
    count=$[ $count + 1 ]
done
echo
echo "This is the end of the loop"
func1
echo
func2
echo "Now this is the end of the script"
```

```shell
[root@admin shell]# sh demo7.sh
# 1 - This is an example of a function111
# 2 - This is an example of a function111
# 3 - This is an example of a function111
# 4 - This is an example of a function111
# 5 - This is an example of a function111
# 6 - This is an example of a function222
# 7 - This is an example of a function222
# 8 - This is an example of a function222
# 9 - This is an example of a function222
# 10 - This is an example of a function222

This is the end of the loop
# 11 - This is an example of a function111

# 11 - This is an example of a function222
Now this is the end of the script
```

**注意** 如果在函数被定义前使用函数，你会收到一条错误消息

#### 返回值

**使用 $?**

```
echo
echo "The exit status is: $?"
```

```shell
[root@admin shell]# sh demo7.sh
The exit status is: 0
```

**使用 return**

```shell
function dbl {
    read -p "Enter a value: " value
    echo "doubling the value"
    return $[ $value * 2 ]
}
dbl
echo "The new value is $?"
```

```
[root@admin shell]# sh demo8.sh
Enter a value: 2
doubling the value
The new value is 4
```

但当用这种方法从函数中返回值时，要小心了。记住下面两条技巧来避免问题：

- 记住，函数一结束就取返回值；
- 记住，退出状态码必须是0~255。

>如果在用 \$? 变量提取函数返回值之前执行了其他命令，函数的返回值就会丢失。记住，\$? 变量会返回执行的最后一条命令的退出状态码。

>第二个问题界定了返回值的取值范围。由于退出状态码必须小于256，函数的结果必须生成一个小于256的整数值。任何大于256的值都会产生一个错误值。

**使用函数输出**

`result=$(dbl)` 这个命令会将 dbl 函数的输出`echo`赋给 $result 变量

```shell
#!/bin/bash

function dbl {
    read -p "Enter a value: " value
    echo $[ $value * 2 ]
    echo 6666
}
result=$(dbl)
echo "The new value is $result"
```

```
[root@admin shell]# sh demo9.sh
Enter a value: 200
The new value is 400
6666
```

---

**说明** 通过这种技术，你还可以返回浮点值和字符串值。这使它成为一种获取函数返回值的强大方法。

---

#### 在函数中使用变量

**向函数传递参数**

```shell
#!/bin/bash

function addem {
    if [ $# -eq 0 ] || [ $# -gt 2 ]; then
     echo 0个或大于2个参数
    elif [ $# -eq 1 ]; then
     echo $[ $1 + $1 ]
    else
     echo $[ $1 * $2 ]
    fi
}

echo -n "传入 10 15 "
value=$(addem 10 15)
echo 返回：$value
echo
echo -n "传入 10 "
value=$(addem 10)
echo 返回：$value
echo
echo -n "无参数 "
value=$(addem)
echo 返回：$value
echo
echo -n "传入 10 15 20 "
value=$(addem 10 15 20)
echo 返回：$value
echo
```

```
[root@admin shell]# sh demo10.sh
传入 10 15 返回：150

传入 10 返回：20

无参数 返回：0个或大于2个参数

传入 10 15 20 返回：0个或大于2个参数
```

由于函数使用特殊参数环境变量作为自己的参数值，因此它无法直接获取脚本在命令行中的参数值。下面的例子将会运行失败。尽管函数也使用了 $1 和 $2 变量，但它们和脚本主体中的 $1 和 $2 变量并不相同。要在函数中使用这些值，必须在调用函数时手动将它们传过去.。

```shell
#!/bin/bash

function badfunc1 {
    echo $[ $1 * $2 ]
}

echo $@
echo

if [ $# -eq 2 ]; then
    value=$(badfunc1)
    echo "The result is $value"
elif [ $# -eq 3 ]; then
    value=$(badfunc1 $1 $2)
    echo "The result is $value"
else
    echo "Usage: badtest1 a b"
fi
```

```
[root@admin shell]# sh demo11.sh 12 2
12 2

demo11.sh:行4: *  : 语法错误: 期待操作数 （错误符号是 "*  "）
The result is
[root@admin shell]# sh demo11.sh 12 2 21
12 2 21

The result is 24
```

**在函数中处理变量**

- 全局变量

```shell
function dbl {
    value=$[ $value * 2 ]
    echo 函数内：$value
}
read -p "输入一个值: " value
dbl
echo "函数外: $value"
```

```shell
[root@admin shell]# sh demo12.sh
输入一个值: 12
函数内：24
函数外: 24
```

\$value 变量在函数外定义并被赋值。当 dbl 函数被调用时，该变量及其值在函数中都依然有效。如果变量在函数内被赋予了新值，那么在脚本中引用该变量时，新值也依然有效。

```shell
function func1 {
    temp=$[ $value + 5 ]
    result=$[ $temp * 2 ]
}

temp=4
value=6

func1
echo "temp = $temp"
echo "result = $result"
if [ $temp -gt $value ]; then
    echo "temp is 大"
else
    echo "temp is 小"
fi
```

```shell
[root@admin shell]# sh demo12.sh
temp = 11
result = 22
temp is 大
```

由于函数中用到了 \$temp 变量，它的值在脚本中使用时受到了影响，产生了意想不到的后果。有个简单的办法可以在函数中解决这个问题，下面将会介绍

- 局部变量 local

```shell
function func1 {
    local temp=$[ $value + 5 ]
    result=$[ $temp * 2 ]
}

temp=4
value=6

func1
echo "temp = $temp"
echo "result = $result"
if [ $temp -gt $value ]; then
    echo "temp is 大"
else
    echo "temp is 小"
fi
```

local 关键字保证了变量只局限在该函数中。如果脚本中在该函数之外有同样名字的变量，那么shell将会保持这两个变量的值是分离的。

#### 数组变量和函数

**向函数传数组参数**

```shell
function testit {
    echo "The parameters are: $@"
    thisarray=$1
    echo "The received array is ${thisarray[*]}"
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
testit $myarray

#####变化
function testit {
    local newarray
    newarray=(;'echo "$@"')
    echo "The new array value is: ${newarray[*]}"
}
myarray=(1 2 3 4 5)
echo "The original array is ${myarray[*]}"
testit ${myarray[*]}
```

```shell
The original array is: 1 2 3 4 5
The parameters are: 1
The received array is 1
#####变化后
The original array is 1 2 3 4 5
The new array value is: 1 2 3 4 5
```

在函数内部，数组仍然可以像其他数组一样使用

```shell
function addarray {
    local sum=0
    local newarray
    newarray=($(echo "$@"))
    for value in ${newarray[*]}
    do
        sum=$[ $sum + $value ]
    done
    echo $sum
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
arg1=$(echo ${myarray[*]})
result=$(addarray $arg1)
echo "The result is $result"
```

```
The original array is: 1 2 3 4 5
The result is 15
```

addarray 函数会遍历所有的数组元素，将它们累加在一起。你可以在 myarray 数组变量中放置任意多的值， addarry 函数会将它们都加起来。

**从函数返回数组**

```shell
function arraydblr {
    local origarray
    local newarray
    local elements
    local i
    origarray=($(echo "$@"))
    newarray=($(echo "$@"))
    elements=$[ $# - 1 ]
    for (( i = 0; i <= $elements; i++ )) {
        newarray[$i]=$[ ${origarray[$i]} * 2 ]
    }
    echo ${newarray[*]}
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
arg1=$(echo ${myarray[*]})
result=($(arraydblr $arg1))
echo "The new array is: ${result[*]}"
```

```
The original array is: 1 2 3 4 5
The new array is: 2 4 6 8 10
```

#### 函数递归

函数可以调用自己来得到结果。通常递归函数都有一个最终可以迭代到的基准值。许多高级数学算法用递归对复杂的方程进行逐级规约，直到基准值定义的那级。

递归算法的经典例子是计算阶乘。一个数的阶乘是该数之前的所有数乘以该数的值。因此，要计算5的阶乘，可以执行如下方程：

> 5! = 1 *2* 3 *4* 5 = 120

使用递归，方程可以简化成以下形式：

> x! = x * (x-1)!

也就是说，x的阶乘等于x乘以x1的阶乘。这可以用简单的递归脚本表达为：

```shell
function factorial {
    if [ $1 -eq 1 ]; then
        echo 1
    else
        local temp=$[ $1 - 1 ]
        local result='factorial $temp'
        echo $[ $result * $1 ]
    fi
}
read -p "Enter value: " value
result=$(factorial $value)
echo "The factorial of $value is: $result"
```

```
Enter value: 5
The factorial of 5 is: 120
```

#### 创建库 source

 source 命令会在当前shell上下文中执行命令，而不是创建一个新shell。可以用 source 命令来在shell脚本中运行库文件脚本。

第一步是创建一个包含脚本中所需函数的公用库文件

```
function addem {
    echo $[ $1 + $2 ]
}
function multem {
    echo $[ $1 * $2 ]
}
function divem {
    if [ $2 -ne 0 ]; then
        echo $[ $1 / $2 ]
    else
        echo -1
    fi
}
```

```shell
#!/bin/bash

. ./myfuncs

value1=10
value2=5

result1=$(addem $value1 $value2)
result2=$(multem $value1 $value2)
result3=$(divem $value1 $value2)

echo "The result of adding them is: $result1"
echo "The result of multiplying them is: $result2"
echo "The result of dividing them is: $result3"
```

```
The result of adding them is: 15
The result of multiplying them is: 50
The result of dividing them is: 2
```

#### 在命令行上使用函数

- 一种方法是采用单行方式定义函数

```shell
[root@admin shell]# function divem { echo $[ $1 / $2 ]; }
[root@admin shell]# divem 66 3
22
```

- 另一种方法是采用多行方式来定义函数

```shell
[root@admin shell]# function multem {
> echo $[ $1 * $2 ]
> }
[root@admin shell]# multem 12 2
24
```

**在.bashrc 文件中定义函数**

最佳地点就是.bashrc文件。bash shell在每次启动时都会在主目录下查找这个文件，不管是交互式shell还是从现有shell中启动的新shell。

- 直接定义函数

```shell
# .bashrc
# Source global definitions
if [ -r /etc/bashrc ]; then
    . /etc/bashrc
fi
function addem {
    echo $[ $1 + $2 ]
}
```

- 读取函数文件

只要是在shell脚本中，都可以用 source 命令（或者它的别名点操作符）将库文件中的函数添加到你的.bashrc脚本中。

```shell
# .bashrc
# Source global definitions
if [ -r /etc/bashrc ]; then
    . /etc/bashrc
fi

. /home/shell/libraries/myfuncs
```

要确保库文件的路径名正确，以便bash shell能够找到该文件。下次启动shell时，库中的所有函数都可在命令行界面下使用了。

```
$ addem 10 5
15
$ multem 10 5
50
$ divem 10 5
2
```

### shtool函数库使用示例

#### 下载与安装

```
yum install shtool
```

#### 构建库

```shell
./confifgure
make
make install
```

configure 命令会检查构建shtool库文件所必需的软件。一旦发现了所需的工具，它会使用工具路径修改配置文件。

make 命令负责构建shtool库文件。最终的结果（ shtool ）是一个完整的库软件包。

要完成安装，需要使用 make 命令的 install 选项。

#### shtool 库函数

```
函 数   描 述
Arx   创建归档文件（包含一些扩展功能）
Echo  显示字符串，并提供了一些扩展构件
fixperm  改变目录树中的文件权限
install  安装脚本或文件
mdate  显示文件或目录的修改时间
mkdir  创建一个或更多目录
Mkln  使用相对路径创建链接
mkshadow  创建一棵阴影树
move  带有替换功能的文件移动
Path  处理程序路径
platform  显示平台标识
Prop  显示一个带有动画效果的进度条
rotate  转置日志文件
Scpp  共享的C预处理器
Slo   根据库的类别，分离链接器选项
Subst  使用sed的替换操作
Table  以表格的形式显示由字段分隔（field-separated）的数据
tarball  从文件和目录中创建tar文件
version  创建版本信息文件
```

每个shtool函数都包含大量的选项和参数，你可以利用它们改变函数的工作方式。下面是 shtool函数的使用格式：

> shtool [options] [function [options] [args]]

#### 使用库

可以在命令行或自己的shell脚本中直接使用shtool函数。下面是一个在shell脚本中使用 platform 函数的例子。

```shell
$ cat test16
#!/bin/bash
shtool platform
$ ./test16
centos 7.9.2009 (AMD64)
```

```
ls –al /usr/bin | shtool prop –p "waiting..."
```

## 图形化桌面环境中的脚本编程

### 创建文本菜单

### 创建文本窗口部件

### 添加X Window图形

## 正则表达式

### 正则表达式的类型

正则表达式是通过正则表达式引擎（regular expression engine）实现的。正则表达式引擎是一套底层软件，负责解释正则表达式模式并使用这些模式进行文本匹配。
在Linux中，有两种流行的正则表达式引擎：

- POSIX基础正则表达式（basic regular expression，BRE）引擎
- POSIX扩展正则表达式（extended regular expression，ERE）引擎

大多数Linux工具都至少符合POSIX BRE引擎规范，能够识别该规范定义的所有模式符号。遗憾的是，有些工具（比如sed编辑器）只符合了BRE引擎规范的子集。这是出于速度方面的考虑导致的，因为sed编辑器希望能尽可能快地处理数据流中的文本。

POSIX BRE引擎通常出现在依赖正则表达式进行文本过滤的编程语言中。它为常见模式提供了高级模式符号和特殊符号，比如匹配数字、单词以及按字母排序的字符。gawk程序用ERE引擎来处理它的正则表达式模式。

---

**警告** 记住，sed编辑器和gawk程序的正则表达式引擎之间是有区别的。gawk程序可以使用大多数扩展正则表达式模式符号，并且能提供一些额外过滤功能，而这些功能都是sed编辑器所不具备的。但正因为如此，gawk程序在处理数据流时通常才比较慢。

---

### 基础正则表达式 BRE

#### 纯文本

在sed编辑器和gawk程序中用标准文本字符串来过滤数据：

```shell
[root@admin shell]# echo "This is a test" | sed -n '/test/p'
This is a test
[root@admin shell]# echo "This is a test" | sed -n '/trial/p'
[root@admin shell]# echo "This is a test" | gawk '/test/{print $0}'
This is a test
[root@admin shell]# echo "This is a test" | gawk '/trial/{print $0}'
```

> 第一个模式定义了一个单词test。sed编辑器和gawk程序脚本用它们各自的 print 命令打印出匹配该正则表达式模式的所有行。由于 echo 语句在文本字符串中包含了单词test，数据流文本能够匹配所定义的正则表达式模式，因此sed编辑器显示了该行。
>
> 第二个模式也定义了一个单词，这次是trial。因为 echo 语句文本字符串没包含该单词，所以正则表达式模式没有匹配，因此sed编辑器和gawk程序都没打印该行。

第一条原则就是：正则表达式模式都区分大小写。这意味着它们只会匹配大小写也相符的模式。

```shell
[root@admin shell]# echo "This is a test" | sed -n '/this/p'
[root@admin shell]# echo "This is a test" | sed -n '/This/p'
This is a test
```

---

```shell
[root@admin shell]# echo "The books are expensive" | sed -n '/book/p'
The books are expensive
[root@admin shell]# echo "The book is expensive" | sed -n '/books/p
```

可以在正则表达式中使用空格和数字。

```shell
[root@admin shell]# echo "This is line number 1" | sed -n '/ber 1/p'
This is line number 1
[root@admin shell]# echo "This is line number1" | sed -n '/ber 1/p'
```

```shell
[root@admin shell]# cat data1
Thisisanormallineoftext.
This is a line with too many spaces. 
[root@admin shell]# sed -n '/ /p' data1
This is a line with too many spaces.
```

#### 特殊字符

> - `.` `*` `[]` `^` `$` `{}` `\` `/` `+` `?` `|` `()`

用某个特殊字符作为文本字符，就必须转义。

```shell
[root@admin shell]# cat data2
The cost is $4.00
sdfs oioijk 6846
[root@admin shell]# sed -n '/\$/p' data2
The cost is $4.00

[root@admin shell]# echo "\ is a special character" | sed -n '/\\/p'
\ is a special character

[root@admin shell]# echo "3 / 2" | sed -n '///p'
sed: -e expression #1, char 2: No previous regular expression

[root@admin shell]# echo "3 / 2" | sed -n '/\//p'
3 / 2
```

#### 锚字符 ^$

- 锁定在行首 `^`

```shell
[root@admin shell]# echo "The book store" | sed -n '/^book/p'

[root@admin shell]# echo "Books are great" | sed -n '/^Book/p'
Books are great

[root@admin shell]# cat data3
This is a test line.
this is another test line.
A line that tests this feature.
Yet more testing of this
[root@admin shell]# sed -n '/^this/p' data3
this is another test line.

[root@admin shell]# echo "This ^ is a test" | sed -n '/s ^/p'
This ^ is a test
```

- 锁定在行尾 `$`

```shell
[root@admin shell]# echo "This is a good book" | sed -n '/book$/p'
This is a good book
[root@admin shell]# echo "This book is good" | sed -n '/book$/p'
[root@admin shell]# echo "There are a lot of good books" | sed -n '/book$/p'
```

- 组合使用

```shell
[root@admin shell]# cat data4
this is a test of using both anchors
I said this is a test
this is a test
I'm sure this is a test.
[root@admin shell]# sed -n '/^this is a test$/p' data4
this is a test
[root@admin shell]# sed -n '/^this is test$/p' data4
[root@admin shell]# sed -n '/^this test$/p' data4
```

过滤出数据流中的空白行

```shell
[root@admin shell]# cat data5
This is one test line.

This is another test line.
[root@admin shell]# sed '/^$/d' data5
This is one test line.
This is another test line.
```

#### 点号字符

`.` 用来匹配除换行符之外的 **任意单个字符**。它必须匹配一个字符，如果在点号字符的位置没有字符，那么模式就不成立。

```shell
[root@admin shell]# cat data6
This is a test of a line.
The cat is sleeping.
That is a very nice hat.
This test is at line four.
at ten o'clock we'll go home.

[root@admin shell]# sed -n '/.at/p' data6
The cat is sleeping.
That is a very nice hat.
This test is at line four.
```

在正则表达式中，空格也是字符，因此 at 前面的空格刚好匹配了该模式。第五行证明了这点，将 at 放在行首就不
会匹配该模式了。

#### 字符组 []

可以定义用来匹配文本模式中某个位置的一组字符。如果字符组中的某个字符出现在了数据流中，那它就匹配了该模式。

```shell
[root@admin shell]# cat data6
This is a test of a line.
The cat is sleeping.
That is a very nice hat.
This test is at line four.
at ten o'clock we'll go home.
[root@admin shell]# sed -n '/[ch]at/p' data6
The cat is sleeping.
That is a very nice hat.
[root@admin shell]# echo "Yes" | sed -n '/[Yy]es/p'
Yes
[root@admin shell]# echo "yes" | sed -n '/[Yy]es/p'
yes
[root@admin shell]# echo "Yes" | sed -n '/[Yy][Ee][Ss]/p'
Yes
[root@admin shell]# echo "yEs" | sed -n '/[Yy][Ee][Ss]/p'
yEs
[root@admin shell]# echo "yeS" | sed -n '/[Yy][Ee][Ss]/p'
yeS
```

还可以是数字

```shell
[root@admin shell]# cat data7
This line doesn't contain a number.
This line has 1 number on it.
This line a number 2 on it.
This line has a number 4 on it.

[root@admin shell]# sed -n '/[0123]/p' data7
This line has 1 number on it.
This line a number 2 on it.
```

邮编验证

```shell
[root@admin shell]# cat data8
60633
46201
223001
556400
4353
22203
[root@admin shell]# $ sed -n '/^[0123456789][0123456789][0123456789][0123456789][0123456789]$/p' data8
60633
46201
22203
```

```shell
[root@admin shell]# cat data9
I need to have some maintenence done on my car.
I'll pay that in a seperate invoice.
After I pay for the maintenance my car will be as good as new.

[root@admin shell]# sed -n '/maint[ea]n[ae]nce/p/sep[ea]r[ea]te/p' data9
I need to have some maintenence done on my car.
I'll pay that in a seperate invoice.
After I pay for the maintenance my car will be as good as new.
```

本例中的两个 sed 打印命令利用正则表达式字符组来帮助找到文本中拼错的单词 `maintenance` 和 `separate`。同样的正则表达式模式也能匹配正确拼写的 `maintenance`。

#### 排除型字符组

只要在字符组的开头加个脱字符

```shell
sed -n /[^ab]ops/p data
```

#### 区间

```shell
sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p' data8
60633
46201
45902

sed -n '/[0-9][a-z]ops/p' data
sed -n '/[a-ch-m]at/p' data6
The cat is sleeping.
That is a very nice hat.
echo "a8392" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p'
echo "1839a" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p
echo "18a92" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p'
```

#### 特殊的字符组

```tex
组      描 述
[[:alpha:]]  匹配任意字母字符，不管是大写还是小写
[[:alnum:]]  匹配任意字母数字字符0~9、A~Z或a~z
[[:blank:]]  匹配空格或制表符
[[:digit:]]  匹配0~9之间的数字
[[:lower:]]  匹配小写字母字符a~z
[[:print:]]  匹配任意可打印字符
[[:punct:]]  匹配标点符号
[[:space:]]  匹配任意空白字符：空格、制表符、NL、FF、VT和CR
[[:upper:]]  匹配任意大写字母字符A~Z
```

```shell
echo "abc" | sed -n '/[[:digit:]]/p'
echo "abc" | sed -n '/[[:alpha:]]/p'
abc
echo "abc123" | sed -n '/[[:digit:]]/p'
abc123
echo "This is, a test" | sed -n '/[[:punct:]]/p'
This is, a test
echo "This is a test" | sed -n '/[[:punct:]]/p'
```

#### 星号

在字符后面放置星号表明该字符必须在匹配模式的文本中出现0次或多次。

这个模式符号广泛用于处理有常见拼写错误或在不同语言中有拼写变化的单词。

```shell
echo "ik" | sed -n '/ie*k/p'
ik
$ echo "iek" | sed -n '/ie*k/p'
iek
$ echo "ieek" | sed -n '/ie*k/p'
ieek
$ echo "ieeek" | sed -n '/ie*k/p'
ieeek
```

写个可能用在美式或英式英语中的脚本，模式中的 u* 表明字母u可能出现或不出现在匹配模式的文本中。

```shell
echo "I'm getting a color TV" | sed -n '/colou*r/p'
I'm getting a color TV
echo "I'm getting a colour TV" | sed -n '/colou*r/p'
I'm getting a colour TV

echo "I ate a potatoe with my lunch." | sed -n '/potatoe*/p'
I ate a potatoe with my lunch.
echo "I ate a potato with my lunch." | sed -n '/potatoe*/p'
I ate a potato with my lunch.
```

将点号特殊字符和星号特殊字符组合起来。这个组合能够匹配任意数量的任意字符。它通常用在数据流中两个可能相邻或不相邻的文本字符串之间。

```shell
echo "this is a regular pattern expression" | sed -n '/regular.*expression/p'
this is a regular pattern expression
```

星号还能用在字符组上。它允许指定可能在文本中出现多次的字符组或字符区间。

```shell
echo "bt" | sed -n '/b[ae]*t/p'
bt
echo "bat" | sed -n '/b[ae]*t/p'
bat
echo "bet" | sed -n '/b[ae]*t/p'
bet
echo "btt" | sed -n '/b[ae]*t/p'
btt
echo "baat" | sed -n '/b[ae]*t/p'
baat
echo "baaeeet" | sed -n '/b[ae]*t/p'
baaeeet
echo "baeeaeeat" | sed -n '/b[ae]*t/p'
baeeaeeat
echo "baakeeet" | sed -n '/b[ae]*t/p'
```

### 扩展正则表达式 ERE

`gawk`程序能够识别 `ERE` 模式，但 `sed` 编辑器不能。

#### 问号

问号表明前面的字符可以出现 **0次或1次**，它不会匹配多次出现的字符。

```shell
echo "bt" | gawk '/be?t/{print $0}'
bt
echo "bet" | gawk '/be?t/{print $0}'
bet
echo "beet" | gawk '/be?t/{print $0}'
echo "beeet" | gawk '/be?t/{print $0}'
echo "bt" | gawk '/b[ae]?t/{print $0}'
bt
echo "bat" | gawk '/b[ae]?t/{print $0}'
bat
echo "bot" | gawk '/b[ae]?t/{print $0}'
echo "bet" | gawk '/b[ae]?t/{print $0}'
bet
echo "baet" | gawk '/b[ae]?t/{print $0}'
echo "beat" | gawk '/b[ae]?t/{print $0}'
echo "beet" | gawk '/b[ae]?t/{print $0}'
```

如果字符组中的字符出现了0次或1次，模式匹配就成立。但如果两个字符都出现了，或者其中一个字符出现了2次，模式匹配就不成立。

#### 加号

加号表明前面的字符可以出现 **1次或多次**，但 **必须至少出现1次**。如果该字符没有出现，那么模式就不会匹配。

```shell
echo "beeet" | gawk '/be+t/{print $0}'
beeet
echo "beet" | gawk '/be+t/{print $0}'
beet
echo "bet" | gawk '/be+t/{print $0}'
bet
echo "bt" | gawk '/be+t/{print $0}'
```

这次如果字符组中定义的任一字符出现了，文本就会匹配指定的模式。

```shell
echo "bt" | gawk '/b[ae]+t/{print $0}'
echo "bat" | gawk '/b[ae]+t/{print $0}'
bat
echo "bet" | gawk '/b[ae]+t/{print $0}'
bet
echo "beat" | gawk '/b[ae]+t/{print $0}'
beat
echo "beet" | gawk '/b[ae]+t/{print $0}'
beet
echo "beeat" | gawk '/b[ae]+t/{print $0}'
beeat
```

#### 花括号

ERE中的花括号允许你为可重复的正则表达式指定一个上限。这通常称为间隔（interval）。

可以用两种格式来指定区间。

- m ：正则表达式准确出现 m 次。
- m, n ：正则表达式至少出现 m 次，至多 n 次。

这个特性可以精确调整字符或字符集在模式中具体出现的次数。

---

**警告** 默认情况下，gawk程序不会识别正则表达式间隔。必须指定gawk程序的 `--re- interval` 命令行选项才能识别正则表达式间隔

---

```shell
echo "bt" | gawk --re-interval '/be{1}t/{print $0}'
echo "bet" | gawk --re-interval '/be{1}t/{print $0}'
bet
echo "beet" | gawk --re-interval '/be{1}t/{print $0}'
echo "beet" | gawk --re-interval '/be{1}t/{print $0}'
beet
```

```shell
echo "bt" | gawk --re-interval '/be{1,2}t/{print $0}'
echo "bet" | gawk --re-interval '/be{1,2}t/{print $0}'
bet
echo "beet" | gawk --re-interval '/be{1,2}t/{print $0}'
beet
echo "beeet" | gawk --re-interval '/be{1,2}t/{print $0}'
```

```shell
echo "bt" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "bat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
bat
echo "bet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
bet
echo "beat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
beat
echo "beet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
beet
echo "beeat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "baeet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "baeaet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
```

字母a或e在文本模式中只出现了1~2次，则正则表达式模式匹配；否则，模式匹配失败

#### 管道符号

管道符号允许你在检查数据流时，用逻辑 OR 方式指定正则表达式引擎要用的两个或多个模式。如果任何一个模式匹配了数据流文本，

```shell
echo "The cat is asleep" | gawk '/cat|dog/{print $0}'
The cat is asleep
echo "The dog is asleep" | gawk '/cat|dog/{print $0}'
The dog is asleep
echo "The sheep is asleep" | gawk '/cat|dog/{print $0}'
echo "He has a hat." | gawk '/[ch]at|dog/{print $0}'
He has a hat.
```

#### 表达式分组-圆括号

当你将正则表达式模式分组时，该组会被视为一个标准字符。可以像对普通字符一样给该组使用特殊字符。

```shell
echo "Sat" | gawk '/Sat(urday)?/{print $0}'
Sat
echo "Saturday" | gawk '/Sat(urday)?/{print $0}'
Saturday
```

结尾的 urday 分组以及问号，使得模式能够匹配完整的 Saturday 或缩写 Sat

将分组和管道符号一起使用

```shell
echo "cat" | gawk '/(c|b)a(b|t)/{print $0}'
cat
echo "cab" | gawk '/(c|b)a(b|t)/{print $0}'
cab
echo "bat" | gawk '/(c|b)a(b|t)/{print $0}'
bat
echo "bab" | gawk '/(c|b)a(b|t)/{print $0}'
bab
echo "tab" | gawk '/(c|b)a(b|t)/{print $0}'
echo "tac" | gawk '/(c|b)a(b|t)/{print $0}'
```

### 正则表达式实例

#### \$PATH目录文件计数

首先你得将 PATH 变量解析成单独的目录名

> echo $PATH
> /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

用空格来替换冒号

> echo $PATH | sed 's/:/ /g'
>
> /usr/local/sbin /usr/local/bin /usr/sbin /usr/bin /root/bin

使用标准 for 语句中来遍历每个目录

```shell
#!/bin/bash

mypath=$(echo $PATH | sed 's/:/ /g')
count=0
for directory in $mypath
do
    check=$(ls $directory)
    for item in $check
    do
        count=$[ $count + 1 ]
    done
    echo "$directory - $count"
    count=0
done
```

```
[root@admin shell]# sh demo13.sh
/usr/local/sbin - 0
/usr/local/bin - 0
/usr/sbin - 832
/usr/bin - 1524
ls: 无法访问/root/bin: 没有那个文件或目录
/root/bin - 0
```

#### 验证电话号码

电话号码有几种常见的形式：

- (123)456-7890
- (123) 456-789
- 123-456-7890
- 123.456.7890

电话号码中可能有也可能没有左圆括号。这可以用如下模式来匹配：

```
^\(?
```

脱字符用来表明数据的开始。由于左圆括号是个特殊字符，因此必须将它转义成普通字符。问号表明左圆括号可能出现，也可能不出现。紧接着就是3位区号。在美国，区号以数字2开始（没有以数字0或1开始的区号），最大可到9。要匹配区号，可以用如下模式。

```
[2-9][0-9]{2}
```

这要求第一个字符是2~9的数字，后跟任意两位数字。在区号后面，收尾的右圆括号可能存在，也可能不存在。

```
\)
```

在区号后，存在如下可能：有一个空格，没有空格，有一条单破折线或一个点。你可以对它们使用管道符号，并用圆括号进行分组

```
(| |-|\.)
```

第一个管道符号紧跟在左圆括号后，用来匹配没有空格的情形。你必须将点字符转义，否则它会被解释成可匹配任意字符。紧接着是3位电话交换机号码。这里没什么需要特别注意的。

```
[0-9]{3}
```

在电话交换机号码之后，你必须匹配一个空格、一条单破折线或一个点（这次不用考虑匹配没有空格的情况，因为在电话交换机号码和其余号码间必须有至少一个空格）。

```
( |-|\.)
```

最后，必须在字符串尾部匹配4位本地电话分机号。

```
[0-9]{4}$
```

完整的模式如下。

```
^\(?[2-9][0-9]{2}\)?(| |-|\.)[0-9]{3}( |-|\.)[0-9]{4}$
```

```shell
cat isphone
#!/bin/bash
gawk --re-interval '/^\(?[2-9][0-9]{2}\)?(| |-|\¬[0-9]{3}( |-|\.)[0-9]{4}/{print $0}'
```

```shell
echo "317-555-1234" | ./isphone
317-555-1234
echo "000-555-1234" | ./isphone
echo "312 555-1234" | ./isphone
312 555-1234
```

```shell
cat phonelist
000-000-0000
123-456-7890
212-555-1234
(317)555-1234
(202) 555-9876
33523
1234567890
234.123.4567

$ cat phonelist | ./isphone
212-555-1234
(317)555-1234
(202) 555-9876
234.123.4567
```

#### 解析邮件地址

邮件地址的基本格式为：

> username@hostname

username 值可用字母数字字符以及以下特殊字符：

- 点号
- 单破折线
- 加号
- 下划线

在有效的邮件用户名中，这些字符可能以任意组合形式出现。邮件地址的 hostname 部分由一个或多个域名和一个服务器名组成。服务器名和域名也必须遵照严格的命名规则，只允许字母数字字符以及以下特殊字符：

- 点号
- 下划线

服务器名和域名都用点分隔，先指定服务器名，紧接着指定子域名，最后是后面不带点号的顶级域名。
顶级域名的数量在过去十分有限，正则表达式模式编写者会尝试将它们都加到验证模式中。然而遗憾的是，随着互联网的发展，可用的顶级域名也增多了。这种方法已经不再可行。从左侧开始构建这个正则表达式模式。我们知道，用户名中可以有多个有效字符。这个相当容易。

```
^([a-zA-Z0-9_\-\.\+]+) @
```

这个分组指定了用户名中允许的字符，加号表明必须有至少一个字符。下一个字符很明显是@ ，没什么意外的。
hostname 模式使用同样的方法来匹配服务器名和子域名。

```
([a-zA-Z0-9_\-\.]+)
```

这个模式可以匹配文本。

```
server
server.subdomain
server.subdomain.subdomain
```

对于顶级域名，有一些特殊的规则。顶级域名只能是字母字符，必须不少于二个字符（国家
或地区代码中使用），并且长度上不得超过五个字符。下面就是顶级域名用的正则表达式模式。

```
\.([a-zA-Z]{2,5})$
```

将整个模式放在一起会生成如下模式。

```shell
^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$
```

```shell
echo "demo@here.now" | ./isemail
demo@here.now
$ echo "demo@here.now." | ./isemail
$
$ echo "demo@here.n" | ./isemail
$
$ echo "demo@here-now" | ./isemail
$
$ echo "demo.blum@here.now" | ./isemail
demo.blum@here.now
$ echo "rich_blum@here.now" | ./isemail
rich_blum@here.now
$ echo "demo/blum@here.now" | ./isemail
$
$ echo "demo#blum@here.now" | ./isemail
$
$ echo "demo*blum@here.now" | ./isemail
```

## sed

### 基础

sed编辑器被称作流编辑器（stream editor），和普通的交互式文本编辑器恰好相反。在交互式文本编辑器中（比如vim），你可以用键盘命令来交互式地插入、删除或替换数据中的文本。

sed编辑器会执行下列操作:

- (1) 一次从输入中读取一行数据。
- (2) 根据所提供的编辑器命令匹配数据。
- (3) 按照命令修改流中的数据。
- (4) 将新的数据输出到 STDOUT 。

语法格式：

> sed options script file

```
选 项    描 述
-e script  在处理输入时，将 script 中指定的命令添加到已有的命令中
-f file  在处理输入时，将 file 中指定的命令添加到已有的命令中
-n  不产生命令输出，使用 print 命令来完成输出
```

```shell
[root@admin shell]# echo "This is a test" | sed 's/test/big test/'
This is big test
[root@admin shell]#  cat data1.txt
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
[root@admin shell]# sed 's/dog/cat/' data1.txt
The quick brown fox jumps over the lazy cat.
The quick brown fox jumps over the lazy cat.
The quick brown fox jumps over the lazy cat.
The quick brown fox jumps over the lazy cat.

[root@admin shell]# sed -e 's/brown/green/; s/dog/cat/' data1.txt
The quick green fox jumps over the lazy cat.
The quick green fox jumps over the lazy cat.
The quick green fox jumps over the lazy cat.
The quick green fox jumps over the lazy cat.

```

从文件中读取 sed 编辑器命令

```shell
[root@admin shell]# cat script1.sed
s/brown/green/
s/fox/elephant/
s/dog/cat/
[root@admin shell]# sed -f script1.sed data1.txt
The quick green elephant jumps over the lazy cat.
The quick green elephant jumps over the lazy cat.
The quick green elephant jumps over the lazy cat.
The quick green elephant jumps over the lazy cat.

```

#### 替换标记

```shell
[root@admin shell]# cat data4.txt
This is a test of the test script.
This is the second test of the test script.
[root@admin shell]# sed 's/test/trial/' data4.txt
This is a trial of the test script.
This is the second trial of the test script.
```

默认情况下它只替换每行中出现的第一处；替换标记 `flags` 会在替换命令字符串之后设置。

> s/pattern/replacement/flags

有4种可用的替换标记：

- 数字，表明新文本将替换第几处模式匹配的地方；
- g ，表明新文本将会替换所有匹配的文本；
- p ，表明原先行的内容要打印出来；打印与替换命令中指定的模式匹配的行。这通常会和 sed 的 `-n` 选项一起使用；将二者配合使用的效果就是只输出被替换命令修改过的行。
- w file ，将替换的结果写到文件中。

```shell
[root@admin shell]# sed 's/test/trial/2' data4.txt
This is a test of the trial script.
This is the second test of the trial script.

[root@admin shell]# sed 's/test/trial/g' data4.txt
This is a trial of the trial script.
This is the second trial of the trial script.

[root@admin shell]# cat data5.txt
This is a test line.
This is a different line.
[root@admin shell]# sed -n 's/test/trial/p' data5.txt
This is a trial line.

[root@admin shell]# sed 's/test/trial/w test.txt' data5.txt
This is a trial line.
This is a different line.
[root@admin shell]# cat test.txt
This is a trial line.

[root@admin shell]#
```

#### 替换字符

```shell
sed 's/\/bin\/bash/\/bin\/csh/' /etc/passwd
sed 's!/bin/bash!/bin/csh!' /etc/passwd
```

感叹号被用作字符串分隔符，这样路径名就更容易阅读和理解了。

#### 使用地址

默认情况下，在sed编辑器中使用的命令会作用于文本数据的所有行。如果只想将命令作用于特定行或某些行，则必须用行寻址（line addressing）。

在sed编辑器中有两种形式的行寻址：

- 以数字形式表示行区间
- 用文本模式来过滤出行

两种形式都使用相同的格式来指定地址：

> [address]command

也可以将特定地址的多个命令分组：

> address {
> command1
> command2
> command3
> }

- 数字方式的行寻址 `M 单行匹配` 、 `M,N 区间M到N行` 、 `M,$ 从某行开始的所有行`

sed编辑器会将文本流中的第一行编号为1，以此类。

```shell
[root@admin shell]# sed '2s/dog/cat/' data1.txt
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy cat
The quick brown fox jumps over the lazy dog

[root@admin shell]# sed '2,3s/dog/cat/' data1.txt
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy cat
The quick brown fox jumps over the lazy cat
The quick brown fox jumps over the lazy dog

[root@admin shell]# sed '2,$s/dog/cat/' data1.txt
The quick brown fox jumps over the lazy dog
The quick brown fox jumps over the lazy cat
The quick brown fox jumps over the lazy cat
The quick brown fox jumps over the lazy cat
```

- 使用文本模式过滤器

格式：/pattern/command

例如：只修改用户Samantha的默认shell，可以使用 sed 命令。

```shell
grep Samantha /etc/passwd
Samantha:x:502:502::/home/Samantha:/bin/bash

sed '/Samantha/s/bash/csh/' /etc/passwd
root:x:0:0:root:/root:/bin/bash
[...]
Samantha:x:502:502::/home/Samantha:/bin/csh
Timothy:x:503:503::/home/Timothy:/bin/bash
```

- 命令组合

```shell
[root@admin shell]# sed '2{
> s/fox/elephant/
> s/dog/cat/
> }' data1.txt
The quick brown fox jumps over the lazy dog.
The quick brown elephant jumps over the lazy cat.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

[root@admin shell]# sed '3,${
> s/brown/green/
> s/lazy/active/
> }' data1.txt
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick green fox jumps over the active dog.
The quick green fox jumps over the active dog.

```

#### 删除行 d

`M 单行匹配` 、 `M,N 区间M到N行` 、 `M,$ 从某行开始的所有行` 、`结尾字符`

它会删除匹配指定寻址模式的所有行。使用该命令时要特别小心，如果你忘记加入寻址模式的话，流中的所有文本行都会被删除。

```shell
cat data1.txt
The quick brown fox jumps over the lazy dog 1
The quick brown fox jumps over the lazy dog 2
The quick brown fox jumps over the lazy dog 3
The quick brown fox jumps over the lazy dog 4

sed 'd' data1. && cat data1.txt

sed '1d' data1.txt && cat data1.txt
The quick brown fox jumps over the lazy dog 2
The quick brown fox jumps over the lazy dog 3
The quick brown fox jumps over the lazy dog 4

sed '2,3d' data1.txt && cat data1.txt
The quick brown fox jumps over the lazy dog 1
The quick brown fox jumps over the lazy dog 4

sed '3,$d' data1.txt && cat data1.txt
The quick brown fox jumps over the lazy dog 1
The quick brown fox jumps over the lazy dog 2

sed '/dog 1/d' data1.txt && cat data1.txt
The quick brown fox jumps over the lazy dog 2
The quick brown fox jumps over the lazy dog 3
The quick brown fox jumps over the lazy dog 4
```

特殊情况

```shell
cat data7.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.
This is line number 1 again.
This is text you want to keep.
This is the last line in the file.

sed '/1/,/3/d' data7.txt
This is line number 4.
```

第二个出现数字“1”的行再次触发了删除命令，因为没有找到停止模式，所以就将数据流中的剩余行全部删除了。当然，如果你指定了一个从未在文本中出现的停止模式，显然会出现另外一个问题。

> $ sed '/1/,/5/d' data7.txt

#### 插入和附加文本 i a

- 插入（ insert ）命令（ i ）会在指定行前增加一个新行；
- 附加（ append ）命令（ a ）会在指定行后增加一个新行。

```shell
echo "Test Line 2" | sed 'i\Test Line 1'
Test Line 1
Test Line 2

echo "Test Line 2" | sed 'i\Test Line 3'
Test Line 2
Test Line 3
```

将一个新行插入到数据流第三行前，起始位置增加一个新行 `1i`

```shell
sed '3i\This is an inserted line.' data6.txt
This is line number 1.
This is line number 2.
This is an inserted line.
This is line number 3.
This is line number 4.
```

将一个新行附加到数据流中第三行后

````shell
sed '3a\This is an appended line.' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is an appended line.
This is line number 4.
````

将新行附加到数据流的末尾

```shell
sed '$a\This is an appended line.' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.
This is an appended line.
```

#### 修改行 c

修改（ change ）命令允许修改数据流中整行文本的内容。它跟插入和附加命令的工作机制一样，你必须在 sed 命令中单独指定新行。

```shell
sed '3c\This is a changed line of text.' data6.txt
This is line number 1.
This is line number 2.
This is a changed line of text.
This is line number 4.

sed '/number 3/c\This is a changed line of text.' data6.txt
This is line number 1.
This is line number 2.
This is a changed line of text.
This is line number 4.

#你可以在修改命令中使用地址区间，但结果未必如愿。
sed '2,3c\This is a new line of text.' data6.txt
This is line number 1.
This is a new line of text.
This is line number 4.
```

#### 转换命令 y

转换（ transform ）命令（ y ）是唯一可以处理单个字符的sed编辑器命令。转换命令格式如下。

> [address]y/inchars/outchars/

转换命令会对 inchars 和 outchars 值进行一对一的映射。 inchars 中的第一个字符会被转换为 outchars 中的第一个字符，以此类推。这个映射过程会一直持续到处理完指定字符；如果 inchars 和 outchars 的长度不同，则sed编辑器会产生一条错误消息。

```shell
sed 'y/123/789/' data8.txt
This is line number 7.
This is line number 8.
This is line number 9.
This is line number 4.
This is line number 7 again.
This is yet another line.
This is the last line in the file.

echo "This 1 is a test of 1 try." | sed 'y/123/456/'
This 4 is a test of 4 try.
```

#### 打印 p = l

打印数据流中的信息：

- p 命令用来打印文本行；
- =  命令用来打印行号；
- l （小写的L）命令用来列出行。

```shell
echo "this is a test" | sed 'p'
this is a test
this is a test

cat data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.

sed -n '/number 3/p' data6.txt
This is line number 3.

sed -n '2,3p' data6.txt
This is line number 2.
This is line number 3.

##修改行之前显示该行
sed -n '/3/{
> p
> s/line/test/p
> }' data6.txt
This is line number 3.
This is test number 3.

```

```shell
cat data1.txt
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.
The quick brown fox jumps over the lazy dog.

sed '=' data1.txt
1
The quick brown fox jumps over the lazy dog.
2
The quick brown fox jumps over the lazy dog.
3
The quick brown fox jumps over the lazy dog.
4
The quick brown fox jumps over the lazy dog.


sed -n '/number 4/{
> =
> p
> }' data6.txt
4
This is line number 4.
```

```shell
cat data9.txt
This line contains tabs.

sed -n 'l' data9.txt
This\tline\tcontains\ttabs.
--------------------
--------------------
cat data10.txt
This line contains an escape character.

sed -n 'l' data10.txt
This line contains an escape character. \a$
```

#### 使用 sed 处理文件 w

- 写入文件

w 命令用来向文件写入行。该命令的格式如下：

[address]w filename

`filename` 可以使用相对路径或绝对路径；用户都必须有文件的写权限。

将数据流中的前两行打印到一个文本文件中：

```shell
sed '1,2w test.txt' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.

cat test.txt
This is line number 1.
This is line number 2.
```

如果要根据一些公用的文本值从主文件中创建一份数据文件

```shell
cat data11.txt
Blum, R Browncoat
McGuiness, A Alliance
Bresnahan, C Browncoat
Harken, C Alliance

sed -n '/Browncoat/w Browncoats.txt' data11.txt

cat Browncoats.txt
Blum, R Browncoat
Bresnahan, C Browncoat
```

- 从文件读取数据 r

```shell
cat data12.txt
This is an added line.
This is the second added line.

sed '3r data12.txt' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is an added line.
This is the second added line.
This is line number 4.

sed '/number 2/r data12.txt' data6.txt
This is line number 1.
This is line number 2.
This is an added line.
This is the second added line.
This is line number 3.
This is line number 4.

sed '$r data12.txt' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.
This is an added line.
This is the second added line.

sed '1r data12.txt' data6.txt
This is line number 1.
This is line number 2.
This is line number 3.
This is line number 4.
This is an added line.
This is the second added line.
```

读取命令的另一个很酷的用法是和删除命令配合使用：利用另一个文件中的数据来替换文件中的占位文本。举例来说，假定你有一份套用信件保存在文本文件中：

```shell
cat notice.std
Would the following people:
LIST
please report to the ship's captain.
```

套用信件将通用占位文本 LIST 放在人物名单的位置。要在占位文本后插入名单，只需读取命令就行了。但这样的话，占位文本仍然会留在输出中。要删除占位文本的话，你可以用删除命令。结果如下：

```shell
sed '/LIST/{
> r data11.txt
> d
> }' notice.std
Would the following people:
Blum, R Browncoat
McGuiness, A Alliance
Bresnahan, C Browncoat
Harken, C Alliance
please report to the ship's captain.
```

现在占位文本已经被替换成了数据文件中的名单。

### 多行命令

处理多行文本的特殊命令：

- N ：将数据流中的下一行加进来创建一个多行组（multiline group）来处理。
- D ：删除多行组中的一行
- P ：打印多行组中的一行。

#### next 命令

首先需要看一下单行版本的 next 命令是如何工作的，然后就比
较容易理解多行版本的 next 命令是如何操作的了。

- 1、单行的 next 命令 `n`

小写的 n 命令会告诉sed编辑器移动到数据流中的下一文本行，而不用重新回到命令的最开始再执行一遍。记住，通常sed编辑器在移动到数据流中的下一文本行之前，会在当前行上执行完所有定义好的命令。单行 next 命令改变了这个流程。

这听起来可能有些复杂，没错，有时确实是。在这个例子中，你有个数据文件，共有5行内容，其中的两行是空的。目标是删除首行之后的空白行，而留下最后一行之前的空白行。如果写一个删掉空白行的sed脚本，你会删掉两个空白行。

```shell
cat data1.log
This is the header line.

This is a data line.

This is the last line.
--------------------------
sed '/^$/d' data1.log
This is the header line.
This is a data line.
This is the last line.
```

解决办法是用 n 命令

```shell
sed '/header/{n ; d}' data1.log
This is the header line.
This is a data line.

This is the last line.
```

- 合并文本行 `N`

了解了单行版的 next 命令，现在来看看多行版的。单行 next 命令会将数据流中的下一文本行移动到sed编辑器的工作空间（称为模式空间）。多行版本的 next 命令（用大写N）会将下一文本行添加到模式空间中已有的文本后。

这样的作用是将数据流中的两个文本行合并到同一个模式空间中。文本行仍然用换行符分隔，但sed编辑器现在会将两行文本当成一行来处理。

```shell
cat data2.txt
This is the header line.
This is the first data line.
This is the second data line.
This is the last line.

sed '/first/{ N ; s/\n/ / }' data2.txt
This is the header line.
This is the first data line. This is the second data line.
This is the last line.
```

> sed编辑器脚本查找含有单词first的那行文本。找到该行后，它会用 N 命令将下一行合并到那行，然后用替换命令 s 将换行符替换成空格。结果是，文本文件中的两行在sed编辑器的输出中成了一行。

如果要在数据文件中查找一个可能会分散在两行中的文本短语的话，这是个很实用的应用程序。

```shell
cat data3.txt
On Tuesday, the Linux System
Administrator's group meeting will be held.
All System Administrators should attend.
Thank you for your attendance.

sed 'N ; s/System Administrator/Desktop User/' data3.txt
On Tuesday, the Linux System
Administrator's group meeting will be held.
All Desktop Users should attend.
Thank you for your attendance.
```

替换命令会在文本文件中查找特定的双词短语 System Administrator 。如果短语在一行中的话，事情很好处理，替换命令可以直接替换文本。但如果短语分散在两行中的话，替换命令就没法识别匹配的模式了。
这时 N 命令就可以派上用场了。

```shell
sed 'N ; s/System.Administrator/Desktop User/' data3.txt
On Tuesday, the Linux Desktop User's group meeting will be held.
All Desktop Users should attend.
Thank you for your attendance.
```

> 用 N 命令将发现第一个单词的那行和下一行合并后，即使短语内出现了换行，你仍然可以找到它。
> **注意**，替换命令在 System 和 Administrator 之间用了通配符模式（.）来匹配空格和换行符这两种情况。但当它匹配了换行符时，它就从字符串中删掉了换行符，导致两行合并成一行。这可能不是你想要的。

要解决这个问题，可以在sed编辑器脚本中用两个替换命令：一个用来匹配短语出现在多行中的情况，一个用来匹配短语出现在单行中的情况。

```shell
sed 'N
> s/System\nAdministrator/Desktop\nUser/
> s/System Administrator/Desktop User/
> ' data3.txt
On Tuesday, the Linux Desktop
User's group meeting will be held.
All Desktop Users should attend.
Thank you for your attendance.
```

> 但这个脚本中仍有个小问题。这个脚本总是在执行sed编辑器命令前将下一行文本读入到模式空间。当它到了最后一行文本时，就没有下一行可读了，所以 N 命令会叫sed编辑器停止。如果要匹配的文本正好在数据流的最后一行上，命令就不会发现要匹配的数据。

```shell
cat data4.txt
On Tuesday, the Linux System
Administrator's group meeting will be held.
All System Administrators should attend.

sed 'N
> s/System\nAdministrator/Desktop\nUser/
> s/System Administrator/Desktop User/
> ' data4.txt
On Tuesday, the Linux Desktop
User's group meeting will be held.
All System Administrators should attend.
```

由于 System Administrator 文本出现在了数据流中的最后一行， N 命令会错过它，因为没有其他行可读入到模式空间跟这行合并。你可以轻松地解决这个问题——将单行命令放到 N 命令前面，并将多行命令放到 N 命令后面，像这样：

```shell
sed '
> s/System Administrator/Desktop User/
> N
> s/System\nAdministrator/Desktop\nUser/
> ' data4.txt
On Tuesday, the Linux Desktop
User's group meeting will be held.
All Desktop Users should attend.
```

#### 多行删除命令 D

单行删除命令（ d ）。sed编辑器用它来删除模式空间中的当前行。但和 N 命令一起使用时，使用单行删除命令就要小心了。

```shell
sed 'N ; /System\nAdministrator/d' data4.txt
All System Administrators should attend.
```

删除命令会在不同的行中查找单词System和Administrator，然后在模式空间中将两行都删掉。这未必是你想要的结果。

sed编辑器提供了多行删除命令 D ，它只删除模式空间中的第一行。该命令会删除到换行符（含换行符）为止的所有字符。

```shell
sed 'N ; /System\nAdministrator/D' data4.txt
Administrator's group meeting will be held.
All System Administrators should attend.
```

文本的第二行被 N 命令加到了模式空间，但仍然完好。如果需要删掉目标数据字符串所在行的前一文本行，它能派得上用场。

这里有个例子，它会删除数据流中出现在第一行前的空白行。

```shell
cat data5.txt

This is the header line.
This is a data line.

This is the last line.

sed '/^$/{N ; /header/D}' data5.txt
This is the header line.
This is a data line.

This is the last line.
```

> sed编辑器脚本会查找空白行，然后用 N 命令来将下一文本行添加到模式空间。如果新的模式空间内容含有单词header，则 D 命令会删除模式空间中的第一行。如果不结合使用 N 命令和 D 命令，就不可能在不删除其他空白行的情况下只删除第一个空白行。

#### 多行打印命令 P

它只打印多行模式空间中的第一行。这包括模式空间中直到换行符为止的所有字符。

用 -n 选项来阻止脚本输出时，它和显示文本的单行 p 命令的用法大同小异。

```shell
sed -n 'N ; /System\nAdministrator/P' data3.txt
On Tuesday, the Linux System
```

当多行匹配出现时， P 命令只会打印模式空间中的第一行。多行 P 命令的强大之处在和 N 命令及 D 命令组合使用时才能显现出来。

D 命令的独特之处在于强制sed编辑器返回到脚本的起始处，对同一模式空间中的内容重新执行这些命令（它不会从数据流中读取新的文本行）。在命令脚本中加入 N 命令，你就能单步扫过整个模式空间，将多行一起匹配。

接下来，使用 P 命令打印出第一行，然后用 D 命令删除第一行并绕回到脚本的起始处。一旦返回， N 命令会读取下一行文本并重新开始这个过程。这个循环会一直继续下去，直到数据流结束。

### 保持空间

模式空间（pattern space）是一块活跃的缓冲区，在sed编辑器执行命令时它会保存待检查的文本。但它并不是sed编辑器保存文本的唯一空间。

sed编辑器有另一块称作保持空间（hold space）的缓冲区域。在处理模式空间中的某些行时，可以用保持空间来临时保存一些行。有5条命令可用来操作保持空间

```shell
命 令   描 述
h  将模式空间复制到保持空间
H  将模式空间附加到保持空间
g  将保持空间复制到模式空间
G  将保持空间附加到模式空间
x  交换模式空间和保持空间的内容
```

这些命令用来将文本从模式空间复制到保持空间。这可以清空模式空间来加载其他要处理的字符串。

通常，在使用 h 或 H 命令将字符串移动到保持空间后，最终还要用 g 、 G 或 x 命令将保存的字符串移回模式空间（否则，你就不用在一开始考虑保存它们了）。

由于有两个缓冲区域，弄明白哪行文本在哪个缓冲区域有时会比较麻烦。这里有个简短的例子演示了如何用 h 和 g 命令来将数据在sed编辑器缓冲空间之间移动。

```shell
cat data2.txt
This is the header line.
This is the first data line.
This is the second data line.
This is the last line.

sed -n '/first/ {h ; p ; n ; p ; g ; p }' data2.txt
This is the first data line.
This is the second data line.
This is the first data line.
```

> 我们来一步一步看上面这个代码例子：
>
> - (1) sed脚本在地址中用正则表达式来过滤出含有单词first的行；
>
> - (2) 当含有单词first的行出现时， h 命令将该行放到保持空间；
>
> - (3)  p 命令打印模式空间也就是第一个数据行的内容；
>
> - (4)  n 命令提取数据流中的下一行（ This is the second data line ），并将它放到模式空间；
>
> - (5)  p 命令打印模式空间的内容，现在是第二个数据行；
>
> - (6)  g 命令将保持空间的内容（ This is the first data line ）放回模式空间，替换当前文本；
>
> - (7)  p 命令打印模式空间的当前内容，现在变回第一个数据行了。

通过使用保持空间来回移动文本行，你可以强制输出中第一个数据行出现在第二个数据行后面。如果丢掉了第一个 p 命令，你可以以相反的顺序输出这两行。

```shell
sed -n '/first/ {h ; n ; p ; g ; p }' data2.txt
This is the second data line.
This is the first data line.
```

这是个有用的开端。你可以用这种方法来创建一个sed脚本将整个文件的文本行反转！但要那么做的话，你需要了解sed编辑器的排除特性

#### 排除命令

感叹号命令（ ! ）用来排除（ negate ）命令，也就是让原本会起作用的命令不起作用。下面的例子演示了这一特性

```shell
sed -n '/header/!p' data2.txt
This is the first data line.
This is the second data line.
This is the last line.
```

> 除了包含单词header那一行外，文件中其他所有的行都被打印出来了。

sed编辑器无法处理数据流中最后一行文本，因为之后再没有其他行了。可以用感叹号来解决这个问题

```shell
sed 'N;
> s/System\nAdministrator/Desktop\nUser/
> s/System Administrator/Desktop User/
> ' data4.txt
On Tuesday, the Linux Desktop
User's group meeting will be held.
All System Administrators should attend.

sed '$!N;
> s/System\nAdministrator/Desktop\nUser/
> s/System Administrator/Desktop User/
> ' data4.txt
On Tuesday, the Linux Desktop
User's group meeting will be held.
All Desktop Users should attend.
```

这个例子演示了如何配合使用感叹号与 N 命令以及与美元符特殊地址。美元符表示数据流中的最后一行文本，所以当sed编辑器到了最后一行时，它没有执行 N 命令，但它对所有其他行都执行了这个命令。

使用这种方法，你可以反转数据流中文本行的顺序。要实现这个效果（先显示最后一行，最后显示第一行），你得利用保持空间做一些特别的铺垫工作。
你得像这样使用模式空间：

- (1) 在模式空间中放置一行；
- (2) 将模式空间中的行放到保持空间中；
- (3) 在模式空间中放入下一行；
- (4) 将保持空间附加到模式空间后；
- (5) 将模式空间中的所有内容都放到保持空间中；
- (6)重复执行第(3)~(5)步，直到所有行都反序放到了保持空间中；
- (7) 提取并打印行。

在使用这种方法时，你不想在处理时打印行。这意味着要使用 sed 的 -n 命令行选项。下一步是决定如何将保持空间文本附加到模式空间文本后面。这可以用 G 命令完成。唯一的问题是你不想将保持空间附加到要处理的第一行文本后面。这可以用感叹号命令轻松解决：

1!G

下一步就是将新的模式空间（含有已反转的行）放到保持空间。这也非常简单，只要用 h 命令就行。

将模式空间中的整个数据流都反转了之后，你要做的就是打印结果。当到达数据流中的最后一行时，你就知道已经得到了模式空间的整个数据流。打印结果要用下面的命令：

\$p

![](./shell.assets/true-image-20220919164800283.png)

这些都是你创建可以反转行的sed编辑器脚本所需的操作步骤。现在可以运行一下试试：

```shell
cat data2.txt
This is the header line.
This is the first data line.
This is the second data line.
This is the last line.

sed -n '{1!G ; h ; $p }' data2.txt
This is the last line.
This is the second data line.
This is the first data line.
This is the header line.
```

---

**说明** 可能你想说，有个Linux命令已经有反转文本文件的功能了。 tac 命令会倒序显示一个文本文件。你也许已经注意到了，这个命令的名字很巧妙，它执行的正好是与 cat 命令相反的功能。

---

### 改变流

通常，sed编辑器会从脚本的顶部开始，一直执行到脚本的结尾（ D 命令是个例外，它会强制sed编辑器返回到脚本的顶部，而不读取新的行）。sed编辑器提供了一个方法来改变命令脚本的执行流程，其结果与结构化编程类似。

#### 分支 b

在前面一节中，你了解了如何用感叹号命令来排除作用在某行上的命令。sed编辑器提供了一种方法，可以基于地址、地址模式或地址区间排除一整块命令。这允许你只对数据流中的特定行执行一组命令。
分支（ branch ）命令 b 的格式如下：

[ address ]b [ label ]

address 参数决定了哪些行的数据会触发分支命令。 label 参数定义了要跳转到的位置。如果没有加 label 参数，跳转命令会跳转到脚本的结尾。

```shell
cat data2.txt
This is the header line.
This is the first data line.
This is the second data line.
This is the last line.

sed '{2,3b ; s/This is/Is this/ ; s/line./test?/}' data2.txt

Is this the header test?
This is the first data line.
This is the second data line.
Is this the last test?
```

分支命令在数据流中的第2行和第3行处跳过了两个替换命令。

要是不想直接跳到脚本的结尾，可以为分支命令定义一个要跳转到的标签。标签以冒号开始，最多可以是7个字符长度。

要指定标签，将它加到 b 命令后即可。使用标签允许你跳过地址匹配处的命令，但仍然执行脚本中的其他命令。

```shell
sed '{/first/b jump1 ; s/This is the/No jump on/
> :jump1
> s/This is the/Jump here on/}' data2.txt

No jump on header line
Jump here on first data line
No jump on second data line
No jump on last line
```

跳转命令指定如果文本行中出现了 first ，程序应该跳到标签为 jump1 的脚本行。如果分支命令的模式没有匹配，sed编辑器会继续执行脚本中的命令，包括分支标签后的命令（因此，所有的替换命令都会在不匹配分支模式的行上执行）。

如果某行匹配了分支模式， sed编辑器就会跳转到带有分支标签的那行。因此，只有最后一个替换命令会执行。

这个例子演示了跳转到sed脚本后面的标签上。

也可以跳转到脚本中靠前面的标签上，这样就达到了循环的效果。

```shell
echo "This, is, a, test, to, remove, commas." | sed -n '{
> :start
> s/,//1p
> b start
> }'

This is, a, test, to, remove, commas.
This is a, test, to, remove, commas.
This is a test, to, remove, commas.
This is a test to, remove, commas.
This is a test to remove, commas.
This is a test to remove commas.
^C
```

脚本的每次迭代都会删除文本中的第一个逗号，并打印字符串。这个脚本有个问题：它永远不会结束。这就形成了一个无穷循环，不停地查找逗号，直到使用Ctrl+C组合键发送一个信号，手动停止这个脚本。

要防止这个问题，可以为分支命令指定一个地址模式来查找。如果没有模式，跳转就应该结束：

```shell
echo "This, is, a, test, to, remove, commas." | sed -n '{
> :start
> s/,//1p
> /,/b start
> }'
This is, a, test, to, remove, commas.
This is a, test, to, remove, commas.
This is a test, to, remove, commas.
This is a test to, remove, commas.
This is a test to remove, commas.
This is a test to remove commas.
```

> 现在分支命令只会在行中有逗号的情况下跳转。在最后一个逗号被删除后，分支命令不会再执行，脚本也就能正常停止了。

#### 测试 t

类似于分支命令，测试（ test ）命令（ t ）也可以用来改变sed编辑器脚本的执行流程。测试命令会根据替换命令的结果跳转到某个标签，而不是根据地址进行跳转。

如果替换命令成功匹配并替换了一个模式，测试命令就会跳转到指定的标签。如果替换命令未能匹配指定的模式，测试命令就不会跳转。测试命令使用与分支命令相同的格式。

[ address ]t [ label ]

跟分支命令一样，在没有指定标签的情况下，如果测试成功，sed会跳转到脚本的结尾。

测试命令提供了对数据流中的文本执行基本的 if-then 语句的一个低成本办法。举个例子，如果已经做了一个替换，不需要再做另一个替换，那么测试命令能帮上忙。

```shell
sed '{
> s/first/matched/
> t
> s/This is the/No match on/
> }' data2.txt
No match on header line
This is the matched data line
No match on second data line
No match on last line
```

> 第一个替换命令会查找模式文本 first 。如果匹配了行中的模式，它就会替换文本，而且测试命令会跳过后面的替换命令。如果第一个替换命令未能匹配模式，第二个替换命令就会被执行。

有了测试命令，你就能结束之前用分支命令形成的无限循环:

```shell
echo "This, is, a, test, to, remove, commas. " | sed -n '{
> :start
> s/,//1p
> t start
> }'
This is, a, test, to, remove, commas.
This is a, test, to, remove, commas.
This is a test, to, remove, commas.
This is a test to, remove, commas.
This is a test to remove, commas.
This is a test to remove commas.
```

### 模式替代

你已经知道了如何在 sed 命令中使用模式来替代数据流中的文本。然而在使用通配符时，很难知道到底哪些文本会匹配模式。

举个例子，假如你想在行中匹配的单词两边上放上引号。如果你只是要匹配模式中的一个单词，那就非常简单。

```shell
echo "The cat sleeps in his hat." | sed 's/cat/"cat"/'
The "cat" sleeps in his hat.
```

但如果你在模式中用通配符（.）来匹配多个单词呢？

```shell
echo "The cat sleeps in his hat." | sed 's/.at/".at"/g'
The ".at" sleeps in his ".at".
```

模式字符串用点号通配符来匹配at前面的一个字母。遗憾的是，用于替代的字符串无法匹配已匹配单词中的通配符字符。

#### &符号

sed编辑器提供了一个解决办法。 & 符号可以用来代表替换命令中的匹配的模式。不管模式匹配的是什么样的文本，你都可以在替代模式中使用 & 符号来使用这段文本。这样就可以操作模式所匹配到的任何单词了。

```shell
echo "The cat sleeps in his hat." | sed 's/.at/"&"/g'
The "cat" sleeps in his "hat".
```

当模式匹配了单词cat，"cat"就会出现在了替换后的单词里。当它匹配了单词hat，"hat" 就出现在了替换后的单词中。

#### 替代单独的单词

& 符号会提取匹配替换命令中指定模式的整个字符串。有时你只想提取这个字符串的一部分。

当然可以这么做，只是要稍微花点心思而已。

sed编辑器用圆括号来定义替换模式中的子模式。你可以在替代模式中使用特殊字符来引用每个子模式。替代字符由反斜线和数字组成。数字表明子模式的位置。sed编辑器会给第一个子模式分配字符 \1 ，给第二个子模式分配字符 \2 ，依此类推。

---

**警告** 当在替换命令中使用圆括号时，必须用转义字符将它们标示为分组字符而不是普通的圆括号。这跟转义其他特殊字符正好相反。

---

来看一个在sed编辑器脚本中使用这个特性的例子。

```shell
echo "The System Administrator manual" | sed '
> s/\(System\) Administrator/\1 User/'
The System User manual
```

这个替换命令用一对圆括号将单词System括起来，将其标示为一个子模式。然后它在替代模式中使用 \1 来提取第一个匹配的子模式。这没什么特别的，但在处理通配符模式时却特别有用。

如果需要用一个单词来替换一个短语，而这个单词刚好是该短语的子字符串，但那个子字符串碰巧使用了通配符，这时使用子模式会方便很多。

```shell
echo "That furry cat is pretty" | sed 's/furry \(.at\)/\1/'
That cat is pretty

echo "That furry hat is pretty" | sed 's/furry \(.at\)/\1/'
That hat is pretty
```

在这种情况下，你不能用 & 符号，因为它会替换整个匹配的模式。子模式提供了答案，允许你选择将模式中的某部分作为替代模式。
当需要在两个或多个子模式间插入文本时，这个特性尤其有用。这里有个脚本，它使用子模式在大数字中插入逗号。

```shell
echo "1234567" | sed '{
> :start
> s/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/
> t start
> }'
1,234,567
```

这个脚本将匹配模式分成了两部分。

> .*[0-9]
>
> [0-9]{3}

这个模式会查找两个子模式。第一个子模式是以数字结尾的任意长度的字符。第二个子模式是若干组三位数字。如果这个模式在文本中找到了，替代文本会在两个子模式之间加一个逗号，每个子模式都会通过其位置来标示。

这个脚本使用测试命令来遍历这个数字，直到放置好所有的逗号。

### 在脚本中使用sed

#### 使用包装脚本

这里有个将命令行参数变量作为sed脚本输入的例子

```shell
cat reverse.sh
#!/bin/bash
sed -n '{ 1!G ; h ; $p }' $1
```

名为reverse的shell脚本用sed编辑器脚本来反转数据流中的文本行。它使用shell参数 $1 从命令行中提取第一个参数，这正是需要进行反转的文件名。

```shell
./reverse.sh data2.txt
This is the last line.
This is the second data line.
This is the first data line.
This is the header line.
```

现在你能在任何文件上轻松使用这个sed编辑器脚本，再不用每次都在命令行上重新输入了。

#### 重定向 sed 的输出

默认情况下，sed编辑器会将脚本的结果输出到 STDOUT 上。你可以在shell脚本中使用各种标准方法对sed编辑器的输出进行重定向。

可以在脚本中用 $() 将sed编辑器命令的输出重定向到一个变量中，以备后用。下面的例子使用sed脚本来向数值计算结果添加逗号

```shell
cat fact.sh
#!/bin/bash
factorial=1
counter=1
number=$1

while [ $counter -le $number ]
do
    factorial=$[ $factorial * $counter ]
    counter=$[ $counter + 1 ]
done

result=$(echo $factorial | sed '{
:start
s/\(.*[0-9]\)\([0-9]\{3\}\)/\1,\2/
t start
}')

echo "The result is $result"
```

```shell
./fact.sh 20
The result is 2,432,902,008,176,640,000
```

在使用普通的阶乘计算脚本后，脚本的结果会被作为sed编辑器脚本的输入，它会给结果加上逗号。然后 echo 语句使用这个值产生最终结果

### 创建sed实用工具

#### 加倍行间距

首先，让我们看一个向文本文件的行间插入空白行的简单sed脚本。

```shell
sed 'G' data2.txt
This is the header line.

This is the first data line.

This is the second data line.

This is the last line.

```

看起来相当简单！这个技巧的关键在于保持空间的默认值。记住， G 命令会简单地将保持空间内容附加到模式空间内容后。当启动sed编辑器时，保持空间只有一个空行。将它附加到已有行后面，你就在已有行后面创建了一个空白行。

你可能已经注意到了，这个脚本在数据流的最后一行后面也加了一个空白行，使得文件的末尾也产生了一个空白行。如果你不想要这个空白行，可以用排除符号（ ! ）和尾行符号（ $ ）来确保脚本不会将空白行加到数据流的最后一行后面。

```shell
sed '$!G' data2.txt
This is the header line.

This is the first data line.

This is the second data line.

This is the last line.
```

现在看起来好一些了。只要该行不是最后一行， G 命令就会附加保持空间内容。当sed编辑器到了最后一行时，它会跳过 G 命令。

#### 对可能含有空白行的文件加倍行间距

如果文本文件已经有一些空白行，但你想给所有行加倍行间距要怎么办呢？如果用前面的脚本，有些区域会有太多的空白行，因为每个已有的空白行也会被加倍

```shell
cat data6.txt
This is line one.
This is line two.

This is line three.
This is line four.
$
$ sed '$!G' data6.txt
This is line one.

This is line two.



This is line three.

This is line four.
```

现在，在原来空白行的位置有了三个空白行。这个问题的解决办法是，首先删除数据流中的所有空白行，然后用 G 命令在所有行后插入新的空白行。要删除已有的空白行，需要将 d 命令和一个匹配空白行的模式一起使用。

> /^$/d

这个模式使用了行首符号（ ^ ）和行尾符号（ $ ）。将这个模式加到脚本中会生成想要的结果

```shell
sed '/^$/d ; $!G' data6.txt
This is line one.

This is line two.

This is line three.

This is line four.
```

#### 给文件中的行编号

在查看错误消息的行号时，这是一个很好用的小工具。

用等号来显示数据流中行的行号。

```shell
sed '=' data2.txt
1
This is the header line.
2
This is the first data line.
3
This is the second data line.
4
This is the last line.
```

```shell
sed '=' data2.txt | sed 'N; s/\n/ /'
1 This is the header line.
2 This is the first data line.
3 This is the second data line.
4 This is the last line.

nl data2.txt
1 This is the header line.
2 This is the first data line.
3 This is the second data line.
4 This is the last line.

cat -n data2.txt
1 This is the header line.
2 This is the first data line.
3 This is the second data line.
4 This is the last line.
```

#### 打印末尾行

到目前为止，你已经知道如何用 p 命令来打印数据流中所有的或者是匹配某个特定模式的行。
如果只需处理一个长输出（比如日志文件）中的末尾几行，要怎么办呢？
美元符代表数据流中最后一行，所以只显示最后一行很容易。

```shell
sed -n '$p' data2.txt
This is the last line.
```

那么，如何用美元符来显示数据流末尾的若干行呢？答案是创建滚动窗口。
滚动窗口是检验模式空间中文本行块的常用方法，它使用 N 命令将这些块合并起来。 N 命令将下一行文本附加到模式空间中已有文本行后面。一旦你在模式空间有了一个10行的文本块，你可以用美元符来检查你是否已经处于数据流的尾部。如果不在，就继续向模式空间增加行，同时删除原来的行（记住， D 命令会删除模式空间的第一行）。

通过循环 N 命令和 D 命令，你在向模式空间的文本行块增加新行的同时也删除了旧行。分支命令非常适合这个循环。要结束循环，只要识别出最后一行并用 q 命令退出就可以了。
最终的sed编辑器脚本看起来如下

```shell
cat data7.txt
This is line 1.
This is line 2.
This is line 3.
This is line 4.
This is line 5.
This is line 6.
This is line 7.
This is line 8.
This is line 9.
This is line 10.
This is line 11.
This is line 12.
This is line 13.
This is line 14.
This is line 15.

sed '{
> :start
> $q ; N ; 11,$D
> b start
> }' data7.txt
This is line 6.
This is line 7.
This is line 8.
This is line 9.
This is line 10.
This is line 11.
This is line 12.
This is line 13.
This is line 14.
This is line 15.
```

这个脚本会首先检查这行是不是数据流中最后一行。如果是，退出（ quit ）命令会停止循环。 N 命令会将下一行附加到模式空间中当前行之后。如果当前行在第10行后面， 11,$D 命令会删除模式空间中的第一行。这就会在模式空间中创建出滑动窗口效果。因此，这个sed程序脚本只会显示出data7.txt文件最后10行

#### 删除行

- 删除连续的空白行

数据文件中出现多余的空白行会非常让人讨厌。通常，数据文件中都会有空白行，但有时由于数据行的缺失，会产生过多的空白行（就像之前加倍行间距例子中所见到的那样）。

删除连续空白行的最简单办法是用地址区间来检查数据流。删除连续空白行的关键在于创建包含一个非空白行和一个空白行的地址区间。如果sed编辑器遇到了这个区间，它不会删除行。但对于不匹配这个区间的行（两个或更多的空白行），它会删除这些行。

下面是完成这个操作的脚本

> /./,/^$/!d

区间是 /./ 到 /^$/ 。区间的开始地址会匹配任何含有至少一个字符的行。区间的结束地址会匹配一个空行。在这个区间内的行不会被删除

```shell
cat data8.txt
This is line one.


This is line two.

This is line three.



This is line four.

sed '/./,/^$/!d' data8.txt
This is line one.

This is line two.

This is line three.

This is line four.
```

无论文件的数据行之间出现了多少空白行，在输出中只会在行间保留一个空白行

- 删除开头的空白行

数据文件开头有多个空白行时也很烦人。通常，在将数据从文本文件导入到数据库时，空白行会产生一些空项，涉及这些数据的计算都得作废。

删除数据流顶部的空白行不难。下面是完成这个功能的脚本。

> /./,$!d

这个脚本用地址区间来决定哪些行要删掉。这个区间从含有字符的行开始，一直到数据流结束。在这个区间内的任何行都不会从输出中删除。这意味着含有字符的第一行之前的任何行都会删除。

```shell
cat data9.txt

This is line one.

This is line two.

sed '/./,$!d' data9.txt
This is line one.

This is line two.
```

测试文件在数据行之前有两个空白行。这个脚本成功地删除了开头的两个空白行，保留了数据中的空白行。

- 删除结尾的空白行

很遗憾，删除结尾的空白行并不像删除开头的空白行那么容易。就跟打印数据流的结尾一样，删除数据流结尾的空白行也需要花点心思，利用循环来实现。
在开始讨论前，先看看脚本是什么样的

```shell
sed '{
:start
/^\n*$/{$d; N; b start }
}'
```

```shell
cat data10.txt
This is the first line.
This is the second line.



sed '{
> :start
> /^\n*$/{$d ; N ; b start }
> }' data10.txt
This is the first line.
This is the second line.
```

#### 删除 HTML 标签

```html
cat data11.txt
<html>
<head>
<title>This is the page title</title>
</head>
<body>
<p>
This is the <b>first</b> line in the Web page.
This should provide some <i>useful</i>
information to use in our sed script.
</body>
</html>
```

```shell
sed 's/<[^>]*>//g' data11.txt

This is the page title


This is the first line in the Web page.
This should provide some useful
information to use in our sed script.
```

可以加一条删除命令来删除多余的空白行

```shell
sed 's/<[^>]*>//g ; /^$/d' data11.txt
This is the page title
This is the first line in the Web page.
This should provide some useful
information to use in our sed script.
```

## gawk

虽然sed编辑器是非常方便自动修改文本文件的工具，但其也有自身的限制。通常你需要一个用来处理文件中的数据的更高级工具，它能提供一个类编程环境来修改和重新组织文件中的数据。这正是gawk能够做到的。

---

**说明**  在所有的发行版中都没有默认安装gawk程序。如果你所用的Linux发行版中没有包含gawk.

---

gawk程序是Unix中的原始awk程序的GNU版本。gawk程序让流编辑迈上了一个新的台阶，它提供了一种编程语言而不只是编辑器命令。在gawk编程语言中，你可以做下面的事情：

- 定义变量来保存数据；
- 使用算术和字符串操作符来处理数据；
- 使用结构化编程概念（比如 if-then 语句和循环）来为数据处理增加处理逻辑；
- 通过提取数据文件中的数据元素，将其重新排列或格式化，生成格式化报告。

gawk程序的报告生成能力通常用来从大文本文件中提取数据元素，并将它们格式化成可读的
报告。其中最完美的例子是格式化日志文件。在日志文件中找出错误行会很难，gawk程序可以让
你从日志文件中过滤出需要的数据元素，然后你可以将其格式化，使得重要的数据更易于阅读。

### 基础

gawk命令格式

> gawk options program file

```tex
选 项    描 述
-F fs  指定行中划分数据字段的字段分隔符
-f file  从指定的文件中读取程序
-v var=value  定义gawk程序中的一个变量及其默认值
-mf N  指定要处理的数据文件中的最大字段数
-mr N  指定数据文件中的最大数据行数
-W keyword  指定gawk的兼容模式或警告等级
```

#### 从命令行读取程序脚本

gawk程序脚本用一对花括号来定义。你必须将脚本命令放到两个花括号（ {} ）中。如果你
错误地使用了圆括号来包含gawk脚本，就会得到一条类似于下面的错误提示。

```shell
gawk '(print "Hello World!"}'
gawk: (print "Hello World!"}
gawk: ^ syntax error
```

由于 gawk 命令行假定脚本是单个文本字符串，你还必须将脚本放到单引号中。下面的例子在命令行上指定了一个简单的gawk程序脚本：

> gawk '{print "Hello World!"}'

这个程序脚本定义了一个命令： print 命令。这个命令名副其实：它会将文本打印到 STDOUT 。如果尝试运行这个命令，你可能会有些失望，因为什么都不会发生。原因在于没有在命令行上指定文件名，所以gawk程序会从 STDIN 接收数据。在运行这个程序时，它会一直等待从 STDIN 输入的文本。

如果你输入一行文本并按下回车键，gawk会对这行文本运行一遍程序脚本。跟sed编辑器一样，gawk程序会针对数据流中的每行文本执行程序脚本。由于程序脚本被设为显示一行固定的文本字符串，因此不管你在数据流中输入什么文本，都会得到同样的文本输出。

```shell
$ gawk '{print "Hello World!"}'
This is a test
Hello World!
hello
Hello World!
This is another test
Hello World!
```

要终止这个gawk程序，你必须表明数据流已经结束了。bash shell提供了一个组合键来生成EOF（End-of-File）字符。Ctrl+D组合键会在bash中产生一个EOF字符。这个组合键能够终止该gawk程序并返回到命令行界面提示符下

#### 使用数据字段变量

gawk的主要特性之一是其处理文本文件中数据的能力。它会自动给一行中的每个数据元素分配一个变量。默认情况下，gawk会将如下变量分配给它在文本行中发现的数据字段：

- $0 代表整个文本行；
- $1 代表文本行中的第1个数据字段；
- $2 代表文本行中的第2个数据字段；
- $n 代表文本行中的第n个数据字段。

gawk程序读取文本文件，只显示第1个数据字段的值

```shell
cat data2.txt
One line of test text.
Two lines of test text.
Three lines of test text.

gawk '{print $1}' data2.txt
One
Two
Three
```

如果你要读取采用了其他字段分隔符的文件，可以用 -F 选项指定

```shell
gawk -F: '{print $1}' /etc/passwd
root
bin
daemon
adm
lp
sync
shutdown
halt
mail
[...]
```

#### 在程序脚本中使用多个命令

如果一种编程语言只能执行一条命令，那么它不会有太大用处。gawk编程语言允许你将多条命令组合成一个正常的程序。要在命令行上的程序脚本中使用多条命令，只要在命令之间放个分号即可

```shell
echo "My name is Rich" | gawk '{$4="Christine"; print $0}'
My name is Christine
```

> 第一条命令会给字段变量 $4 赋值。第二条命令会打印整个数据字段。注意， gawk程序在输出中已经将原文本中的第四个数据字段替换成了新值

也可以用次提示符一次一行地输入程序脚本命令

```shell
gawk '{
> $4="Christine"
> print $0}'
My name is Rich
My name is Christine
```

在你用了表示起始的单引号后，bash shell会使用次提示符来提示你输入更多数据。你可以每次在每行加一条命令，直到输入了结尾的单引号。因为没有在命令行中指定文件名，gawk程序会从 STDIN 中获得数据。当运行这个程序的时候，它会等着读取来自 STDIN 的文本。要退出程序，只需按下Ctrl+D组合键来表明数据结束。

#### 从文件中读取程序

跟sed编辑器一样，gawk编辑器允许将程序存储到文件中，然后再在命令行中引用

```shell
cat script2.gawk
{print $1 "'s home directory is " $6}

gawk -F: -f script2.gawk /etc/passwd
root's home directory is /root
bin's home directory is /bin
daemon's home directory is /sbin
adm's home directory is /var/adm
lp's home directory is /var/spool/lpd
[...]
Christine's home directory is /home/Christine
Samantha's home directory is /home/Samantha
Timothy's home directory is /home/Timothy
```

可以在程序文件中指定多条命令。要这么做的话，只要一条命令放一行即可，不需要用分号

```shell
cat script3.gawk
{
text = "'s home directory is "
print $1 text $6
}

gawk -F: -f script3.gawk /etc/passwd
root's home directory is /root
bin's home directory is /bin
daemon's home directory is /sbin
adm's home directory is /var/adm
lp's home directory is /var/spool/lpd
[...]
Christine's home directory is /home/Christine
Samantha's home directory is /home/Samantha
Timothy's home directory is /home/Timothy
```

#### 在处理数据前运行脚本

gawk还允许指定程序脚本何时运行。默认情况下，gawk会从输入中读取一行文本，然后针对该行的数据执行程序脚本。有时可能需要在处理数据前运行脚本，比如为报告创建标题。 BEGIN关键字就是用来做这个的。它会强制gawk在读取数据前执行 BEGIN 关键字后指定的程序脚本

```shell
gawk 'BEGIN {print "Hello World!"}'
Hello World!
```

这次 print 命令会在读取数据前显示文本。但在它显示了文本后，它会快速退出，不等待任何数据。如果想使用正常的程序脚本中处理数据，必须用另一个脚本区域来定义程序

```shell
cat data3.txt
Line 1
Line 2
Line 3

gawk 'BEGIN {print "The data3 File Contents:"}
> {print $0}' data3.txt
The data3 File Contents:
Line 1
Line 2
Line 3
```

在gawk执行了BEGIN脚本后，它会用第二段脚本来处理文件数据。这么做时要小心，两段脚本仍然被认为是 gawk 命令行中的一个文本字符串。你需要相应地加上单引号

#### 在处理数据后运行脚本

与 BEGIN 关键字类似， END 关键字允许你指定一个程序脚本，gawk会在读完数据后执行它

```shell
gawk 'BEGIN {print "The data3 File Contents:"}
> {print $0}
> END {print "End of File"}' data3.txt
The data3 File Contents:
Line 1
Line 2
Line 3
End of File
```

当gawk程序打印完文件内容后，它会执行END脚本中的命令。这是在处理完所有正常数据后给报告添加页脚的最佳方法。
可以将所有这些内容放到一起组成一个漂亮的小程序脚本文件，用它从一个简单的数据文件中创建一份完整的报告:

```shell
cat script4.gawk
BEGIN {
print "The latest list of users and shells"
print " UserID \t Shell"
print "-------- \t -------"
FS=":"
}

{
print $1 " \t " $7
}

END {
print "This concludes the listing"
}
```

这个脚本用BEGIN脚本来为报告创建标题。它还定义了一个叫作 FS 的特殊变量。这是定义字段分隔符的另一种方法。这样你就不用依靠脚本用户在命令行选项中定义字段分隔符了。
下面是这个gawk程序脚本的输出（有部分删节）

```shell
gawk -f script4.gawk /etc/passwd
The latest list of users and shells
UserID Shell
---------------
root /bin/bash
bin /sbin/nologin
daemon /sbin/nologin
[...]
Christine /bin/bash
mysql /bin/bash
Samantha /bin/bash
Timothy /bin/bash
This concludes the listing
```

与预想的一样，BEGIN脚本创建了标题，程序脚本处理特定数据文件（/etc/passwd）中的信息，END脚本生成页脚。这个简单的脚本让你小试了一把gawk的强大威力。

### 使用变量

#### 内建变量

- 字段和记录分隔符变量

数据字段是由字段分隔符来划定的。默认情况下，字段分隔符是一个空白字符，也就是空格符或者制表符。

内建变量 FS 是一组内建变量中的一个，这组变量用于控制gawk如何处理输入输出数据中的字段和记录；

```shell
变 量    描 述
FIELDWIDTHS  由空格分隔的一列数字，定义了每个数据字段确切宽度
FS  输入字段分隔符
RS  输入记录分隔符
OFS  输出字段分隔符
ORS  输出记录分隔符
```

变量 FS 来定义记录中的字段分隔符。变量 OFS 具备相同的功能，只不过是用在 print 命令的输出上。默认情况下，gawk将 OFS 设成一个空格，所以如果你用命令：

```shell
cat data1
data11,data12,data13,data14,data15
data21,data22,data23,data24,data25
data31,data32,data33,data34,data35

gawk 'BEGIN{FS=","} {print $1,$2,$3}' data1
data11 data12 data13
data21 data22 data23
data31 data32 data33
```

print 命令会自动将 OFS 变量的值放置在输出中的每个字段间。通过设置 OFS 变量，可以在输出中使用任意字符串来分隔字段

```shell
gawk 'BEGIN{FS=","; OFS="-"} {print $1,$2,$3}' data1
data11-data12-data13
data21-data22-data23
data31-data32-data33

gawk 'BEGIN{FS=","; OFS="--"} {print $1,$2,$3}' data1
data11--data12--data13
data21--data22--data23
data31--data32--data33

gawk 'BEGIN{FS=","; OFS="<-->"} {print $1,$2,$3}' data1
data11<-->data12<-->data13
data21<-->data22<-->data23
data31<-->data32<-->data33
```

FIELDWIDTHS 变量允许你不依靠字段分隔符来读取记录。在一些应用程序中，数据并没有使用字段分隔符，而是被放置在了记录中的特定列。这种情况下，必须设定 FIELDWIDTHS 变量来匹配数据在记录中的位置。

一旦设置了 FIELDWIDTH 变量，gawk就会忽略 FS 变量，并根据提供的字段宽度来计算字段。

下面是个采用字段宽度而非字段分隔符的例子，每个记录中的数字串会根
据已定义好的字段长度来分割。

```shell
cat data1b
1005.3247596.37
115-2.349194.00
05810.1298100.1

gawk 'BEGIN{FIELDWIDTHS="3 5 2 5"}{print $1,$2,$3,$4}' data1b
100 5.324 75 96.37
115 -2.34 91 94.00
058 10.12 98 100.1
```

---

**警告** 一定要记住，一旦设定了 FIELDWIDTHS 变量的值，就不能再改变了。这种方法并不适用于变长的字段。

---

变量 RS 和 ORS 定义了gawk程序如何处理数据流中的字段。默认情况下，gawk将 RS 和 ORS 设为换行符。默认的 RS 值表明，输入数据流中的每行新文本就是一条新纪录。

有时，你会在数据流中碰到占据多行的字段。

典型的例子是包含地址和电话号码的数据，其中地址和电话号码各占一行。

把 RS 变量设置成空字符串，然后在数据记录间留一个空白行。gawk会把每个空白行当作一个记录分隔符。

```shell
cat data2
Riley Mullen
123 Main Street
Chicago, IL 60601
(312)555-1234

Frank Williams
456 Oak Street
Indianapolis, IN 46201
(317)555-9876

Haley Snell
4231 Elm Street
Detroit, MI 48201
(313)555-4938

gawk 'BEGIN{FS="\n"; RS=""} {print $1,$4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938
```

- 数据变量

除了字段和记录分隔符变量外，gawk还提供了其他一些内建变量来帮助你了解数据发生了什么变化，并提取shell环境的信息。

```tex
变 量    描 述
ARGC  当前命令行参数个数
ARGIND  当前文件在 ARGV 中的位置
ARGV[n]  包含命令行参数的数组
CONVFMT  数字的转换格式（参见 printf 语句），默认值为 %.6 g
ENVIRON  当前shell环境变量及其值组成的关联数组
ERRNO  当读取或关闭输入文件发生错误时的系统错误号
FILENAME  用作gawk输入数据的数据文件的文件名
IGNORECASE  设成非零值时，忽略 gawk 命令中出现的字符串的字符大小写
NF  含有数据文件中最后一个数据字段的数字值。
NR  已处理过的记录总数
FNR  当前数据文件中的数据行数（记录数）
OFMT  数字的输出格式，默认值为 %.6 g
RLENGTH  由 match 函数所匹配的子字符串的长度
RSTART  由 match 函数所匹配的子字符串的起始位置
```

```shell
gawk 'BEGIN{print ARGC,ARGV[1]}' data1
2 data1
```

ARGC 变量表明命令行上有两个参数。这包括 gawk 命令和 data1 参数（记住，程序脚本并不算参数）。

ARGV 数组从索引 0 开始，代表的是命令。第一个数组值是 gawk 命令后的第一个命令行参数。

---

ENVIRON 获取 shell 环境变量

```shell
gawk '
> BEGIN{
> print ENVIRON["HOME"]
> print ENVIRON["PATH"]
> }'
/home/rich
/usr/local/bin:/bin:/usr/bin:/usr/X11R6/bin
```

---

跟踪数据字段和记录时，变量 `FNR` 、 `NF` 和 `NR` 用起来就非常方便。有时你并不知道记录中到底有多少个数据字段。

`NF` 变量可以让你在不知道具体位置的情况下指定记录中的最后一个数据字段。`FNR` 变量的值在 gawk 处理第二个数据文件时被重置了，而 `NR` 变量则在处理第二个数据文件时继续计数。

```shell
gawk 'BEGIN{FS=":"; OFS=":"} {print $1,$NF}' /etc/passwd
testy:/bin/csh
mark:/bin/bash
dan:/bin/bash
mike:/bin/bash
test:/bin/bash

gawk 'BEGIN{FS=","}{print $1,"FNR="FNR}' data1 data1
data11 FNR=1
data21 FNR=2
data31 FNR=3
data11 FNR=1
data21 FNR=2
data31 FNR=3

gawk '
> BEGIN {FS=","}
> {print $1,"FNR="FNR,"NR="NR}
> END{print "There were",NR,"records processed"}' data1 data1
data11 FNR=1 NR=1
data21 FNR=2 NR=2
data31 FNR=3 NR=3
data11 FNR=1 NR=4
data21 FNR=2 NR=5
data31 FNR=3 NR=6
There were 6 records processed
```

---

**说明** 在使用gawk时你可能会注意到，gawk脚本通常会比shell脚本中的其他部分还要大一些。为了简单起见，在本章的例子中，我们利用shell的多行特性直接在命令行上运行了gawk脚本。在shell脚本中使用gawk时，应该将不同的 gawk 命令放到不同的行，这样会比较容易阅读和理解，不要在shell脚本中将所有的命令都塞到同一行。还有，如果你发现在不同的shell脚本中用到了同样的gawk脚本，记着将这段gawk脚本放到一个单独的文件中，并用 `-f` 参数来在shell脚本中引用它.

---

#### 自定义变量

自定义变量名可以是任意数目的字母、数字和下划线，但不能以数字开头。重要的是，要记住 gawk 变量名区分大小写。

- 在脚本中给变量赋值

```shell
gawk '
> BEGIN{
> testing="This is a test"
> print testing
> }'
This is a test

```

 gawk 变量可以保存数值或文本值。

```shell
gawk '
> BEGIN{
> testing="This is a test"
> print testing
> testing=45
> print testing
> }'
This is a test
45
```

赋值语句还可以包含数学算式来处理数字值。

```shell
gawk 'BEGIN{x=4; x= x * 2 + 3; print x}'
11
```

- 在命令行上给变量赋值

```shell
cat script1
BEGIN{FS=","}
{print $n}

gawk -f script1 n=2 data1
data12
data22
data32

gawk -f script1 n=3 data1
data13
data23
data33
```

使用命令行参数来定义变量值会有一个问题。在你设置了变量后，这个值在代码的 BEGIN 部分不可用。可以用 -v 命令行参数来解决这个问题。它允许你在 BEGIN 代码之前设定变量。在命令行上，-v 命令行参数必须放在脚本代码之前。

```shell
cat script2
BEGIN{print "The starting value is",n; FS=","}
{print $n}

gawk -f script2 n=3 data1
The starting value is
data13
data23
data33

gawk -v n=3 -f script2 data1
The starting value is 3
data13
data23
data33
```

### 处理数组

#### 定义数组变量

数组变量赋值的格式如下：

> var[index] = element

其中 var 是变量名， index 是关联数组的索引值， element 是数据元素值。

```shell
capital["Illinois"] = "Springfield"
capital["Indiana"] = "Indianapolis"
capital["Ohio"] = "Columbus"
```

在引用数组变量时，必须包含索引值来提取相应的数据元素值。

```shell
gawk 'BEGIN{
> capital["Illinois"] = "Springfield"
> print capital["Illinois"]
> }'
Springfield
```

在引用数组变量时，会得到数据元素的值。数据元素值是数字值时也一样。

```shell
gawk 'BEGIN{
> var[1] = 34
> var[2] = 3
> total = var[1] + var[2]
> print total
> }'
37
```

#### 遍历数组变量

可以用 for 语句的一种特殊形式。

> for (var in array)
>
> {
>
> ​ statements
>
> }
>
> for 语句会在每次循环时将关联数组 array 的下一个索引值赋给变量 var ，然后执行一遍 statements .

```shell
gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> var["m"] = 3
> var["u"] = 4
> for (test in var)
> {
> print "Index:",test," - Value:",var[test]
> }
> }'
Index: u - Value: 4
Index: m - Value: 3
Index: a - Value: 1
Index: g - Value: 2
```

#### 删除数组变量

从关联数组中删除数组索引要用一个特殊的命令。

> delete array[index]

删除命令会从数组中删除关联索引值和相关的数据元素值。

```shell
gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> for (test in var)
> {
> print "Index:",test," - Value:",var[test]
> }
> delete var["g"]
> print "---"
> for (test in var)
> print "Index:",test," - Value:",var[test]
> }'

Index: a - Value: 1
Index: g - Value: 2
---
Index: a - Value: 1
```

### 使用模式

#### 正则表达式

在使用正则表达式时，正则表达式必须出现在它要控制的程序脚本的左花括号前。

```shell
gawk 'BEGIN{FS=","} /11/{print $1}' data1
data11

gawk 'BEGIN{FS=","} /,d/{print $1}' data1
data11
data21
data31
```

- 1 正则表达式 /11/ 匹配了数据字段中含有字符串 11 的记录

- 2 匹配了用作字段分隔符的逗号。这也并不总是件好事。它可能会造
  成如下问题：当试图匹配某个数据字段中的特定数据时，这些数据又出现在其他数据字段中。如果需要用正则表达式匹配某个特定的数据实例，应该使用匹配操作符。

#### 匹配操作符

匹配操作符（matching operator）允许将正则表达式限定在记录中的特定数据字段。匹配操作符是波浪线（ ~ ）。可以指定匹配操作符、数据字段变量以及要匹配的正则表达式。

```
$1 ~ /^data/
```

\$1 变量代表记录中的第一个数据字段。这个表达式会过滤出第一个字段以文本 data 开头的所有记录。

下面是在gawk程序脚本中使用匹配操作符的例子。

```shell
gawk 'BEGIN{FS=","} $2 ~ /^data2/{print $0}' data1
data21,data22,data23,data24,data25
```

匹配操作符会用正则表达式 /^data2/ 来比较第二个数据字段，该正则表达式指明字符串要以文本 data2 开头。

这可是件强大的工具，gawk程序脚本中经常用它在数据文件中搜索特定的数据元素。

```shell
$ gawk -F: '$1 ~ /rich/{print $1,$NF}' /etc/passwd
rich /bin/bash
```

这个例子会在第一个数据字段中查找文本 rich 。如果在记录中找到了这个模式，它会打印该记录的第一个和最后一个数据字段值。

你也可以用 ! 符号来排除正则表达式的匹配。

```shell
$1 !~ /expression/
```

如果记录中没有找到匹配正则表达式的文本，程序脚本就会作用到记录数据。

```shell
gawk –F: '$1 !~ /rich/{print $1,$NF}' /etc/passwd

root /bin/bash
daemon /bin/sh
bin /bin/sh
sys /bin/sh
--- output truncated ---
```

在这个例子中，gawk程序脚本会打印/etc/passwd文件中与用户ID  rich 不匹配的用户ID和登录shell。

#### 数学表达式

除了正则表达式，你也可以在匹配模式中用数学表达式。这个功能在匹配数据字段中的数字值时非常方便。举个例子，如果你想显示所有属于root用户组（组ID为 0 ）的系统用户，可以用这个脚本。

```shell
gawk -F: '$4 == 0{print $1}' /etc/passwd
root
sync
shutdown
halt
operator
```

这段脚本会查看第四个数据字段含有值 0 的记录。在这个Linux系统中，有五个用户账户属于root用户组。

可以使用任何常见的数学比较表达式。

- x == y ：值x等于y。
- x <= y ：值x小于等于y。
- x < y ：值x小于y。
- x >= y ：值x大于等于y。
- x > y ：值x大于y。

也可以对文本数据使用表达式，但必须小心。跟正则表达式不同，表达式必须完全匹配。数据必须跟模式严格匹配。

```shell
gawk -F, '$1 == "data"{print $1}' data1
gawk -F, '$1 == "data11"{print $1}' data1
data11
```

第一个测试没有匹配任何记录，因为第一个数据字段的值不在任何记录中。第二个测试用值 data11 匹配了一条记录。

### 使用结构化命令

#### if

格式

> if (condition)
>
> ​ statement1
>
> 或者
>
> if (condition) statement1

```shell
cat data4
10
5
13
50
34
gawk '{if ($1 > 20) print $1}' data4
50
34

gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> }
> }' data4
100
68
```

注意，不能弄混 if 语句的花括号和用来表示程序脚本开始和结束的花括号。如果弄混了，gawk程序能够发现丢失了花括号，并产生一条错误消息

```shell
 gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> }' data4
gawk: cmd. line:6: }
gawk: cmd. line:6: ^ unexpected newline or end of string
```

```shell
gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> } else
> {
> x = $1 / 2
> print x
> }}' data4
5
2.5
6.5
100
68
```

if (condition) statement1; else statement2

```shell
gawk '{if ($1 > 20) print $1 * 2; else print $1 / 2}' data4
5
2.5
6.5
100
68
```

#### while

> while (condition)
>
> {
>
> ​ statements
>
> }

```shell
cat data5
130 120 135
160 113 140
145 170 215

gawk '{
> total = 0
> i = 1
> while (i < 4)
> {
> total += $i
> i++
> }
> avg = total / 3
> print "Average:",avg
> }' data5
Average: 128.333
Average: 137.667
Average: 176.667
```

> while 语句会遍历记录中的数据字段，将每个值都加到 total 变量上，并将计数器变量 i 增值。
>
> 当计数器值等于 4 时， while 的条件变成了 FALSE ，循环结束，然后执行脚本中的下一条语句

gawk编程语言支持在 while 循环中使用 break 语句和 continue 语句，允许你从循环中跳出。

```shell
gawk '{
> total = 0
> i = 1
> while (i < 4)
> {
> total += $i
> if (i == 2)
> break
> i++
> }
> avg = total / 2
> print "The average of the first two data elements is:",avg
> }' data5
The average of the first two data elements is: 125
The average of the first two data elements is: 136.5
The average of the first two data elements is: 157.5
```

#### do-while

会在检查条件语句之前执行命令。

> do
> {
> statements
> } while (condition)

这种格式保证了语句会在条件被求值之前至少执行一次。当需要在求值条件前执行语句时，这个特性非常方便。

```shell
gawk '{
> total = 0
> i = 1
> do
> {
> total += $i
> i++
> } while (total < 150)
> print total }' data5
250
160
315
```

> 这个脚本会读取每条记录的数据字段并将它们加在一起，直到累加结果达到150。如果第一个数据字段大于150（就像在第二条记录中看到的那样），则脚本会保证在条件被求值前至少读取第一个数据字段的内容。

#### for

for( variable assignment; condition; iteration process)

```shell
gawk '{
> total = 0
> for (i = 1; i < 4; i++)
> {
> total += $i
> }
> avg = total / 3
> print "Average:",avg
> }' data5
Average: 128.333
Average: 137.667
Average: 176.667
```

### 格式化打印 printf

命令的格式：

> printf "format string", var1, var2 . . .
>
> format string 是格式化输出的关键。它会用文本元素和格式化指定符来具体指定如何呈现格式化输出。第一个格式化指定符对应列出的
> 第一个变量，第二个对应第二个变量，依此类推。

格式化指定符采用如下格式：

> %[modifier]control-letter

其中 control-letter 是一个单字符代码，用于指明显示什么类型的数据，而 modifier 则定义了可选的格式化特性。

```tex
控制字母   描 述
c  将一个数作为ASCII字符显示
d  显示一个整数值
i  显示一个整数值（跟d一样）
e  用科学计数法显示一个数
f  显示一个浮点值
g  用科学计数法或浮点数显示（选择较短的格式）
o  显示一个八进制值
s  显示一个文本字符串
x  显示一个十六进制值
X  显示一个十六进制值，但用大写字母A~F
```

因此，如果你需要显示一个字符串变量，可以用格式化指定符 %s 。如果你需要显示一个整数值，可以用 %d 或 %i （ %d 是十进制数的C风格显示方式）。如果你要用科学计数法显示很大的值，就用 %e 格式化指定符

```shell
gawk 'BEGIN{
x = 10 * 100
printf "The answer is: %e\n", x
}'
The answer is: 1.000000e+03
```

除了控制字母外，还有3种修饰符可以用来进一步控制输出。

- width ：指定了输出字段最小宽度的数字值。如果输出短于这个值，printf 会将文本右对齐，并用空格进行填充。如果输出比指定的宽度还要长，则按照实际的长度输出。
- prec ：这是一个数字值，指定了浮点数中小数点后面位数，或者文本字符串中显示的最大字符数。
- -（减号）：指明在向格式化空间中放入数据时采用左对齐而不是右对齐。

在使用 printf 语句时，你可以完全控制输出样式。

```shell
gawk 'BEGIN{FS="\n"; RS=""} {print $1,$4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938

gawk 'BEGIN{FS="\n"; RS=""} {printf "%s %s\n", $1, $4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938
```

**注意**，你需要在 printf 命令的末尾手动添加换行符来生成新行。没添加的话， printf 命令会继续在同一行打印后续输出。

如果需要用几个单独的 printf 命令在同一行上打印多个输出，这就会非常有用。

```shell
gawk 'BEGIN{FS=","} {printf "%s ", $1} END{printf "\n"}' data1
data11 data21 data31
```

用修饰符来格式化第一个字符串值:

> 通过添加一个值为 16 的修饰符，我们强制第一个字符串的输出宽度为16个字符。默认情况下，printf 命令使用右对齐来将数据放到格式化空间中。要改成左对齐，只需给修饰符加一个减号即可。

```shell
gawk 'BEGIN{FS="\n"; RS=""} {printf "%16s %s\n", $1, $4}' data2
  Riley Mullen (312)555-1234
Frank Williams (317)555-9876
    Haley Snell (313)555-4938
    
gawk 'BEGIN{FS="\n"; RS=""} {printf "%-16s %s\n", $1, $4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938    
```

处理浮点值

```shell
gawk '{
> total = 0
> for (i = 1; i < 4; i++)
> {
> total += $i
> }
> avg = total / 3
> printf "Average: %5.1f\n",avg
> }' data5
Average: 128.3
Average: 137.7
Average: 176.7
```

> 使用 %5.1f 格式指定符来强制 printf 命令将浮点值近似到小数点后一位。

### 使用函数

#### 数学函数

```tex
函 数    描 述
atan2(x, y)  x/y的反正切，x和y以弧度为单位
cos(x)  x的余弦，x以弧度为单位
exp(x)  x的指数函数
int(x)  x的整数部分，取靠近零一侧的值
log(x)  x的自然对数
rand( )  比0大比1小的随机浮点值
sin(x)  x的正弦，x以弧度为单位
sqrt(x)  x的平方根
srand(x)  为计算随机数指定一个种子值
```

```shell
x = int(10 * rand())

gawk 'BEGIN{x=exp(100); print x}'
26881171418161356094253400435962903554686976

gawk 'BEGIN{x=exp(1000); print x}'
gawk: warning: exp argument 1000 is out of range
inf
```

> 第一个例子会计算e的100次幂，虽然数值很大，但尚在系统的区间内。第二个例子尝试计算e的1000次幂，已经超出了系统的数值区间，所以就生成了一条错误消息。

gawk还支持一些按位操作数据的函数。

- and(v1, v2) ：执行值 v1 和 v2 的按位与运算。
- compl(val) ：执行 val 的补运算。
- lshift(val, count) ：将值 val 左移 count 位。
- or(v1, v2) ：执行值 v1 和 v2 的按位或运算。
- rshift(val, count) ：将值 val 右移 count 位。
- xor(v1, v2) ：执行值 v1 和 v2 的按位异或运算。

位操作函数在处理数据中的二进制值时非常有用。

#### 字符串函数

```tex
函 数    描 述
asort(s [,d])  将数组s按数据元素值排序。索引值会被替换成表示新的排序顺序的连续数字。另外，如果指定了d，则排序后的数组会存储在数组d中

asorti(s [,d])  将数组s按索引值排序。生成的数组会将索引值作为数据元素值，用连续数字索引来表明排序顺序。另外如果指定了d，排序后的数组会存储在数组d中

gensub(r, s, h [, t])  查找变量$0或目标字符串t（如果提供了的话）来匹配正则表达式r。如果h是一个以g或G开头的字符串，就用s替换掉匹配的文本。如果h是一个数字，它表示要替换掉第h处r匹配的地方

gsub(r, s [,t])  查找变量$0或目标字符串t（如果提供了的话）来匹配正则表达式r。如果找到了，就全部替换成字符串s

index(s, t)  返回字符串t在字符串s中的索引值，如果没找到的话返回 0

length([s])  返回字符串s的长度；如果没有指定的话，返回$0的长度

match(s, r [,a])  返回字符串s中正则表达式r出现位置的索引。如果指定了数组a，它会存储s中匹配正则表达式的那部分

split(s, a [,r])  将s用 FS 字符或正则表达式r（如果指定了的话）分开放到数组a中。返回字段的总数

sprintf(format,variables)  用提供的format和variables返回一个类似于printf输出的字符串

sub(r, s [,t])  在变量$0或目标字符串t中查找正则表达式r的匹配。如果找到了，就用字符串s替换掉第一处匹配

substr(s, i [,n])  返回s中从索引值i开始的n个字符组成的子字符串。如果未提供n，则返回s剩下的部分

tolower(s)  将s中的所有字符转换成小写

toupper(s)  将s中的所有字符转换成大写
```

```shell
gawk 'BEGIN{x = "testing"; print toupper(x); print length(x) }'
TESTING
7

gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> var["m"] = 3
> var["u"] = 4
> asort(var, test)
> for (i in test)
> print "Index:",i," - value:",test[i]
> }'
Index: 4 - value: 4
Index: 1 - value: 1
Index: 2 - value: 2
Index: 3 - value: 3


gawk 'BEGIN{ FS=","}{
> split($0, var)
> print var[1], var[5]
> }' data1
data11 data15
data21 data25
data31 data35
```

#### 时间函数

```tex
mktime(datespec)  将一个按YYYY MM DD HH MM SS [DST]格式指定的日期转换成时间戳值 ①

strftime(format[,timestamp])  将当前时间的时间戳或timestamp（如果提供了的话）转化格式化日期（采用shell函数date()的格式）

systime( )  返回当前时间的时间戳
```

```shell
gawk 'BEGIN{
> date = systime()
> day = strftime("%A, %B %d, %Y", date)
> print day
> }'
Friday, December 26, 2014
```

#### 定义函数

要定义自己的函数，必须用 function 关键字。

> function name([variables])
> {
> statements
> }

函数名必须能够唯一标识函数。可以在调用的gawk程序中传给这个函数一个或多个变量。

```shell
function printthird()
{
    print $3
}

function myrand(limit)
{
    return int(limit * rand())
}
```

#### 使用自定义函数

```shell
gawk '
> function myprint()
> {
> printf "%-16s - %s\n", $1, $4
> }
> BEGIN{FS="\n"; RS=""}
> {
> myprint()
> }' data2

Riley Mullen - (312)555-1234
Frank Williams - (317)555-9876
Haley Snell - (313)555-4938
```

#### 创建函数库

首先，你需要创建一个存储所有gawk函数的文件

```shell
cat funclib
function myprint()
{
    printf "%-16s - %s\n", $1, $4
}

function myrand(limit)
{
    return int(limit * rand())
}

function printthird()
{
    print $3
}
```

funclib文件含有三个函数定义。需要使用 -f 命令行参数来使用它们。很遗憾，不能将 -f 命令行参数和内联gawk脚本放到一起使用，不过可以在同一个命令行中使用多个 -f 参数。

因此，要使用库，只要创建一个含有你的gawk程序的文件，然后在命令行上同时指定库文件和程序文件就行了。

```shell
cat script4
BEGIN{ FS="\n"; RS=""}
{
myprint()
}

gawk -f funclib -f script4 data2
Riley Mullen - (312)555-1234
Frank Williams - (317)555-9876
Haley Snell - (313)555-4938
```

举例来说，我们手边有一个数据文件，其中包含了两支队伍（每队两名选手）的保龄球比赛得分情况。

```shell
cat scores.txt
Rich Blum,team1,100,115,95
Barbara Blum,team1,110,115,100
Christine Bresnahan,team2,120,115,118
Tim Bresnahan,team2,125,112,116
```

每位选手都有三场比赛的成绩，这些成绩都保存在数据文件中，每位选手由位于第二列的队名来标识。下面的脚本对每队的成绩进行了排序，并计算了总分和平均分。

```shell
cat bowling.sh
#!/bin/bash
for team in $(gawk –F, '{print $2}' scores.txt | uniq)
do
    gawk –v team=$team 'BEGIN{FS=","; total=0}
    {
        if ($2==team)
        {
            total += $3 + $4 + $5;
        }
    }
    END {
        avg = total / 6;
        print "Total for", team, "is", total, ",the average is",avg
    }' scores.txt
done
```

```shell
./bowling.sh
Total for team1 is 635, the average is 105.833
Total for team2 is 706, the average is 117.667
```

## 使用其他 shell

### 理解dash shell

### dash shell脚本编程

### zsh shell介绍

### zsh脚本编程
