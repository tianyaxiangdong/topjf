---
icon: linux
title: Shell脚本编程-创建实用的脚本
category: 
- Linux
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

<!-- more -->

## 创建实用的脚本

### 编写简单的脚本实用工具

#### 归档

```shell
cat Files_To_Backup
/home/Christine/Project
/home/Christine/Downloads
/home/Does_not_exist
/home/Christine/Documents

useradd Christine

mkdir -p /archive/hourly

cp Files_To_Backup /archive/
cp Files_To_Backup /archive/hourly/

groupadd Archivers
chgrp Archivers /archive

usermod -aG Archivers Christine

chmod 775 /archive

ls -l /archive

mkdir -p /home/Christine/{Project,Downloads,Documents}
mkdir /home/Does_not_exist
```

##### 创建按日归档的脚本

Daily_Archive.sh 脚本内容如下

```shell
#!/bin/bash
#
# Daily_Archive - 归档指定文件和目录
########################################################
# 收集当前日期
DATE=$(date +%Y%m%d)
# 设置存档文件名
FILE=archive-$DATE.tar.gz
# 设置配置和目标文件
CONFIG_FILE=/archive/Files_To_Backup
DESTINATION=/archive/$FILE
######### Main Script #########################
# 检查备份配置文件是否存在
if [ -f $CONFIG_FILE ]; then # 确保配置文件仍然存在
  # 如果它存在，什么也不做，继续。
  echo
else # 如果不存在，则发出错误并退出脚本。
  echo
  echo "$CONFIG_FILE 不存在."
  echo "由于缺少配置文件，备份未完成"
  echo
  exit
fi
# 建立所有要备份的文件的名称
FILE_NO=1              # 从配置文件的第 1 行开始。
exec <$CONFIG_FILE     # 将标准输入重定向到配置文件的名称
read FILE_NAME         # 读取第一条记录
while [ $? -eq 0 ]; do # 创建要备份的文件列表
  # 确保文件或目录存在
  if [ -f $FILE_NAME -o -d $FILE_NAME ]; then
    # 如果文件存在，则将其名称添加到列表中。
    FILE_LIST="$FILE_LIST $FILE_NAME"
  else
    # 如果文件不存在，发出警告
    echo
    echo "$FILE_NAME, 不存在."
    echo "显然，我不会将其包含在此存档中."
    echo "它在网上列出 $FILE_NO 配置文件的."
    echo "继续建立存档列表..."
    echo
  fi
  FILE_NO=$(($FILE_NO + 1)) # 将 LineFile 编号加一。
  read FILE_NAME            # 阅读下一条记录
done
#######################################
# 备份文件并压缩存档
echo "开始存档..."
echo
tar -czf $DESTINATION $FILE_LIST 2>/dev/null
echo "存档完成"
echo "生成的存档文件是: $DESTINATION"
echo
exit

```

```shell
[root@admin ~]# sh Daily_Archive.sh

开始存档...

存档完成
生成的存档文件是: /archive/archive-20220922.tar.gz

```

##### 创建按小时归档的脚本

Hourly_Archive.sh 脚本

```shell
#!/bin/bash
# 设置配置文件
CONFIG_FILE=/archive/hourly/Files_To_Backup
# 设置基本存档目标位置
BASEDEST=/archive/hourly
# 收集当前日期、月份和时间
YERS=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)
TIME=$(date +%k%M)
# 创建存档目标目录
mkdir -p $BASEDEST/$YERS/$MONTH/$DAY
# 构建存档目标文件名
DESTINATION=$BASEDEST/$YERS/$MONTH/$DAY/archive-$TIME.tar.gz
########## Main Script ####################
# 检查备份配置文件是否存在
if [ -f $CONFIG_FILE ]; then # 确保配置文件仍然存在
  # 如果它存在，什么也不做，继续。
  echo
else # 如果不存在，则发出错误并退出脚本。
  echo
  echo "$CONFIG_FILE 不存在."
  echo "由于缺少配置文件，备份未完成"
  echo
  exit
fi
# 建立所有要备份的文件的名称
FILE_NO=1              # 从配置文件的第 1 行开始。
exec <$CONFIG_FILE     # 将标准输入重定向到配置文件的名称
read FILE_NAME         # 读取第一条记录
while [ $? -eq 0 ]; do # 创建要备份的文件列表
  # 确保文件或目录存在
  if [ -f $FILE_NAME -o -d $FILE_NAME ]; then
    # 如果文件存在，则将其名称添加到列表中。
    FILE_LIST="$FILE_LIST $FILE_NAME"
  else
    # 如果文件不存在，发出警告
    echo
    echo "$FILE_NAME, 不存在."
    echo "显然，我不会将其包含在此存档中."
    echo "它在网上列出 $FILE_NO 配置文件的."
    echo "继续建立存档列表..."
    echo
  fi
  FILE_NO=$(($FILE_NO + 1)) # 将 LineFile 编号加一。
  read FILE_NAME            # 阅读下一条记录
done
#######################################
# 备份文件并压缩存档
echo "开始存档..."
echo
tar -czf $DESTINATION $FILE_LIST 2>/dev/null
echo "存档完成"
echo "生成的存档文件是: $DESTINATION"
echo
exit

```

```shell
[root@admin ~]# sh Hourly_Archive.sh

开始存档...

存档完成
生成的存档文件是: /archive/hourly/2022/09/22/archive-1825.tar.gz

```

#### 管理用户账户

##### 需要的功能

删除账户在管理账户工作中比较复杂。在删除账户时，至少需要4个步骤：

- (1) 获得正确的待删除用户账户名；
- (2) 杀死正在系统上运行的属于该账户的进程；
- (3) 确认系统中属于该账户的所有文件；
- (4) 删除该用户账户。

##### 创建脚本

完整的 delete-user.sh 脚本

```shell
#!/bin/bash
#Delete_User - 自动执行删除帐户的 4 个步骤
###############################################################
# 定义函数
#####################################################
function get_answer {
  unset ANSWER
  ASK_COUNT=0
  while [ -z "$ANSWER" ]; do #虽然没有给出答案，但请继续询问。
    ASK_COUNT=$(($ASK_COUNT + 1))
    case $ASK_COUNT in #如果用户在分配的时间内没有给出答案
    2)
      echo
      echo "请回答问题"
      echo
      ;;
    3)
      echo
      echo "最后一次尝试...请回答问题"
      echo
      ;;
    4)
      echo
      echo "既然你拒绝回答这个问题..."
      echo "退出程序."
      echo
      exit
      ;;
    esac
    echo
    if [ -n "$LINE2" ]; then #打印 2 行
      echo $LINE1
      echo -e $LINE2" \c"
    else #打印 1 行
      echo -e $LINE1" \c"
    fi
    # 在超时前允许 60 秒回答
    read -t 60 ANSWER
  done
  # 做一些变量清理
  unset LINE1
  unset LINE2
}

#####################################################
function process_answer {
  case $ANSWER in
  y | Y | YES | yes | Yes | yEs | yeS | YEs | yES)
    # 如果用户回答“是”，则什么也不做。
    ;;
  *)
    # 如果用户回答“是”以外的任何内容，则退出脚本
    echo
    echo $EXIT_LINE1
    echo $EXIT_LINE2
    echo
    exit
    ;;
  esac
  # 做一些变量清理
  unset EXIT_LINE1
  unset EXIT_LINE2
}

##############################################
############# Main Script ####################
# 获取要检查的用户帐户名称
echo "第 1 步 - 确定要删除的用户帐户名称"
echo
LINE1="请输入用户的用户名 "
LINE2="您希望从系统中删除的帐户:"
get_answer
USER_ACCOUNT=$ANSWER
# 与脚本用户仔细检查这是正确的用户帐户
LINE1=" $USER_ACCOUNT 是用户帐户 "
LINE2="你想从系统中删除? [y/n]"
get_answer
# 调用过程应答函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="因为 $USER_ACCOUNT 不是账户 "
EXIT_LINE2="您要删除的，我们将离开脚本..."
 
################################################################
# 检查 USER_ACCOUNT 是否真的是系统上的帐户
USER_ACCOUNT_RECORD=$(cat /etc/passwd | grep -w $USER_ACCOUNT)
if [ $? -eq 1 ]; then # 如果没有找到账号，退出脚本
  echo
  echo "账户, $USER_ACCOUNT, 未找到. "
  echo "Leaving the script..."
  echo
  exit
fi
echo
echo "我找到了这个记录:"
echo $USER_ACCOUNT_RECORD
LINE1="这是正确的用户帐户吗? [y/n]"
get_answer
# 调用 process_answer 函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="因为帐户 , $USER_ACCOU      NT, 未找到. "
EXIT_LINE2="您要删除的，我们将离开脚本..."
process_answer
##################################################################
##################################################################
##################################################################
# 搜索属于用户帐户的任何正在运行的进程
echo
echo "第 2 步 - 在属于用户帐户的系统上查找进程"
echo
ps -u $USER_ACCOUNT >/dev/null #用户进程是否正在运行?
case $? in
1)
  # 没有为此用户帐户运行的进程
  echo "此帐户当前没有正在运行的进程"
  echo
  ;;
0)
  # 为此用户帐户运行的进程。询问脚本用户是否希望我们终止进程。
  echo "$USER_ACCOUNT 有以下进程正在运行: "
  echo
  ps -u $USER_ACCOUNT
  LINE1="你想让我杀死进程吗? [y/n]"
  get_answer
  case $ANSWER in
  y | Y | YES | yes | Yes | yEs | yeS | YEs | yES) # 如果用户回答“是”，
    # 杀死用户帐户进程
    echo
    echo "杀死进程..."
    # 列出在变量 COMMAND_1 中运行代码的用户进程
    COMMAND_1="ps -u $USER_ACCOUNT --no-heading"
    # 创建命令以在变量 COMMAND 3 中终止进程
    COMMAND_3="xargs -d \\n /usr/bin/sudo /bin/kill -9"
    # 通过管道命令一起杀死进程
    $COMMAND_1 | gawk '{print $1}' | $COMMAND_3
    echo
    echo "Process(es) killed."
    ;;
  *) # 如果用户回答“是”以外的任何内容，请不要杀死。
    echo
    echo "不会杀死进程"
    echo
    ;;
  esac
  ;;
esac
#################################################################
#################################################################
#################################################################
# 创建用户帐户拥有的所有文件的报告
echo
echo "第 3 步 - 在系统上查找属于用户帐户的文件"
echo
echo "创建所有文件的报告 $USER_ACCOUNT."
echo
echo "建议您备份存档这些文件,"
echo "然后做两件事之一:"
echo " 1) 删除文件"
echo " 2) 将文件的所有权更改为当前用户帐户."
echo
echo "请稍等。可能还要等一下..."
REPORT_DATE=$(date +%y%m%d)
REPORT_FILE=$USER_ACCOUNT"_Files_"$REPORT_DATE".rpt"
find / -user $USER_ACCOUNT >$REPORT_FILE 2>/dev/null
echo
echo "报告完成."
echo "报告名称: $REPORT_FILE"
echo "报告地点: $(pwd)"
echo
#################################################################
#################################################################
#################################################################
# 删除用户帐户
echo
echo "第 4 步 - 删除用户帐户"
echo
LINE1="删除 $USER_ACCOUNT's 系统账户? [y/n]"
get_answer
# 调用 process_answer 函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="由于您不希望删除用户帐户,"
EXIT_LINE2="$USER_ACCOUNT 此时，退出脚本..."
process_answer
userdel $USER_ACCOUNT #删除用户帐户
echo
echo "用户帐号, $USER_ACCOUNT,已被删除"
echo
exit

```

##### 运行脚本

```shell
[root@admin ~]# sh delete-user.sh
第 1 步 - 确定要删除的用户帐户名称


请输入用户的用户名
您希望从系统中删除的帐户: user2

user2 是用户帐户
你想从系统中删除? [y/n] y

我找到了这个记录:
user2:x:1005:1005::/home/user2:/bin/bash

这是正确的用户帐户吗? [y/n] y

第 2 步 - 在属于用户帐户的系统上查找进程

此帐户当前没有正在运行的进程


第 3 步 - 在系统上查找属于用户帐户的文件

创建所有文件的报告 user2.

建议您备份存档这些文件,
然后做两件事之一:
 1) 删除文件
 2) 将文件的所有权更改为当前用户帐户.

请稍等。可能还要等一下...

报告完成.
报告名称: user2_Files_220922.rpt
报告地点: /root


第 4 步 - 删除用户帐户


删除 user2's 系统账户? [y/n] y

用户帐号, user2,已被删除

[root@admin ~]# cat user2_Files_220922.rpt
/home/user2
/home/user2/.bash_logout
/home/user2/.bash_profile
/home/user2/.bashrc
/home/user2/.mozilla
/home/user2/.mozilla/extensions
/home/user2/.mozilla/plugins
/home/user2/.bash_history
/var/spool/mail/user2
```

#### 监测磁盘空间

##### 需要的功能

你要用到的第一个工具是 du 命令。该命令能够显示出单个文件和目录的磁盘使用情况。 -s 选项用来总结目录一级的整体使用状况。这在计算单个用户使用的总体磁盘空间时很方便。下面的例子是使用 du 命令总结/home目录下每个用户的$HOME目录的磁盘占用情况。

```shell
[root@admin ~]# du -s /home/*
12      /home/barbara
12      /home/christine
108     /home/shell
942476  /home/soft
12      /home/tim
16      /home/user1
16      /home/user2

[root@admin ~]# du -s /var/log/*
6308    /var/log/anaconda
988     /var/log/ansible.log
12980   /var/log/audit
0       /var/log/boot.log
12      /var/log/boot.log-20220914
12      /var/log/boot.log-20220915
[....]

[root@admin ~]# du -S /var/log/*
6308    /var/log/anaconda
988     /var/log/ansible.log
12980   /var/log/audit

```

-S （大写的S）选项能更适合我们的目的，它为每个目录和子目录分别提供了总计信息。这样你就能快速地定位问题的根源。

```shell
#!/bin/bash
# Big_Users - 在各种目录中查找大磁盘空间用户
###############################################################
CHECK_DIRECTORIES=" /var/log /home" #要检查的目录
############## Main Script #################################
DATE=$(date '+%Y%m%d')          #报告文件的日期
exec >disk_space_$DATE.rpt      #制作报告文件 STDOUT
echo "十大磁盘空间使用率" #报告标题
echo "来自 $CHECK_DIRECTORIES 目录"
for DIR_CHECK in $CHECK_DIRECTORIES; do
  echo ""
  echo "The $DIR_CHECK 目录:"
  # 在此目录中创建前十名磁盘空间用户的列表
  du -S $DIR_CHECK 2>/dev/null |
    sort -rn |
    sed '{11,$D; =}' |
    sed 'N; s/\n/ /' |
    gawk '{printf $1 ":" "\t" $2 "\t" $3 "\n"}'
done
exit

```

```shell
[root@admin ~]# chmod +x disk-info.sh
[root@admin ~]# sh disk-info.sh
[root@admin ~]# cat disk_space_20220922.rpt
十大磁盘空间使用率
来自  /var/log /home 目录

The /var/log 目录:
1:      13196   /var/log/audit
2:      6308    /var/log/anaconda
3:      6212    /var/log
4:      2232    /var/log/sa
5:      100     /var/log/tuned
6:      24      /var/log/tomcat
7:      8       /var/log/pki
8:      0       /var/log/sssd
9:      0       /var/log/samba/old
10:     0       /var/log/samba

The /home 目录:
1:      942476  /home/soft
2:      108     /home/shell
3:      16      /home/user2
4:      16      /home/user1
5:      12      /home/tim
6:      12      /home/christine
7:      12      /home/barbara
8:      0       /home/user2/.mozilla/plugins
9:      0       /home/user2/.mozilla/extensions
10:     0       /home/user2/.mozilla
```

### 创建与数据库、Web及电子邮件相关的脚本

#### MySQL 数据库

##### 向mysql服务器发送命令

有两种实现方法：

- 发送单个命令并退出；
- 发送多个命令。

要发送单个命令，你必须将命令作为 mysql 命令行的一部分。对于 mysql 命令，可以用 -e 选项。

```shell
 cat mtest1
#!/bin/bas
MYSQL=$(which mysql)
$MYSQL mytest -u test -e 'select * from employees'

$ ./mtest1
+-------+----------+------------+---------+
| empid | lastname | firstname | salary |
+-------+----------+------------+---------+
| 1 | Blum | Rich | 25000 |
| 2 | Blum | Barbara | 45000 |
| 3 | Blum | Katie Jane | 34500 |
| 4 | Blum | Jessica | 52340 |
+-------+----------+------------+---------+

cat mtest2
#!/bin/bash
MYSQL=$(which mysql)
$MYSQL mytest -u test <<EOF
show tables;
select * from employees where salary > 40000;
EOF

$ ./mtest2
Tables_in_test
employees

empid lastname firstname salary
2 Blum Barbara 45000
4 Blum Jessica 52340
```

```shell
cat mtest3
#!/bin/bash
MYSQL=$(which mysql)
if [ $# -ne 4 ]
then
    echo "Usage: mtest3 empid lastname firstname salary"
else
    statement="INSERT INTO employees VALUES ($1, '$2', '$3', $4)"
    $MYSQL mytest -u test << EOF
    $statement
EOF
    if [ $? -eq 0 ]
    then
        echo Data successfully added
    else
        echo Problem adding data
    fi
fi

$ ./mtest3
Usage: mtest3 empid lastname firstname salary

$ ./mtest3 5 Blum Jasper 100000
Data added successfully

$ ./mtest3 5 Blum Jasper 100000
ERROR 1062 (23000) at line 1: Duplicate entry '5' for key 1
Problem adding data
```

##### 格式化数据

```shell
 cat mtest4
#!/bin/bash
MYSQL=$(which mysql)
dbs=$($MYSQL mytest -u test -Bse 'show databases')
for db in $dbs
do
    echo $db
done

$ ./mtest4
information_schema
test
```

`-B` 选项指定mysql程序工作在批处理模式运行， `-s` （ silent ）选项用于禁止输出列标题和格式化符号

可以用 -X 命令行选项来输出

```shell
mysql mytest -u test -X -e 'select * from employees where empid = 1'
<?xml version="1.0"?>

<resultset statement="select * from employees">
<row>
    <field name="empid">1</field>
    <field name="lastname">Blum</field>
    <field name="firstname">Rich</field>
    <field name="salary">25000</field>
</row>
</resultset>
```
