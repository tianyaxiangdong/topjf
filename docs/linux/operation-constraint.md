---
icon: linux
title: 良好的 Linux 操作习惯
category: 
- Linux
date: 2023-03-28
tag:
- 操作规范
---

从事运维工程师，遇到过各式各样的问题，数据丢失，网站挂马，误删数据库文件，黑客攻击等各类问题。

今天简单整理一下，分享给各位小伙伴。

<!-- more -->

## 一、线上操作规范

### 测试使用

当初学习Linux的使用，从基础到服务到集群，都是在虚拟机做的，虽然老师告诉我们跟真机没有什么差别，
可是对真实环境的渴望日渐上升，不过虚拟机的各种快照却让我们养成了各种手贱的习惯，以致于拿到服务器操作权限时候，
就迫不及待的想去试试，记得上班第一天，老大把root密码交给我，由于只能使用putty，我就想使用xshell，于是悄悄
登录服务器尝试改为xshell+密钥登录，因为没有测试，也没有留一个ssh连接，所有重启sshd服务器之后，自己就被挡在服务器之外了，
幸好当时我备份了`sshd_config`文件，后来让机房人员cp过去就可以了，幸亏这是一家小公司，不然直接就被干了……庆幸当年运气比较好。

第二个例子是关于文件同步的，大家都知道rsync同步很快，可是他删除文件的速度大大超过了`rm -rf`,在rsync中有一个命令是，
以某目录为准同步某文件(如果第一个目录是空的，那么结果可想而知)，源目录(有数据的)就会被删除，当初我就是因为误操作，
以及缺乏测试，就目录写反了，关键是没有备份……生产环境数据被删了，没备份，大家自己想后果吧，其重要性不言而喻。

### Enter前再三确认

关于`rm -rf / var` 这种错误，我相信手快的人，或者网速比较慢的时候，出现的几率相当大，当你发现执行完之后，
你的心至少是凉了半截。大家可能会说，我按了这么多次都没出过错，不用怕，我只想说，当出现一次你就明白了，不要以为那些运维事故都是在别人身上，
如果你不注意，下一个就是你。

### 切忌多人操作

我在的上一家公司，运维管理相当混乱，举一个最典型的例子吧，离职好几任的运维都有服务器root密码。通常我们运维接到任务，
都会进行简单查看如果无法解决，就请求他人帮忙，可是当问题焦头烂额的时候，客服主管(懂点linux)，网管，你上司一起调试一个服务器，
当你各种百度,各种对照，完了发现，你的服务器配置文件，跟上次你修改不一样了，然后再改回来，然后再谷歌，兴冲冲发现问题，解决了，
别人却告诉你，他也解决了，修改的是不同的参数……这个，我就真不知道哪个是问题真正的原因了，当然这还是好的，问题解决了，皆大欢喜，
可是你遇到过你刚修改的文件，测试无效，再去修改发现文件又被修改的时候呢?真的很恼火，切忌多人操作。

### 先备份后操作

养成一个习惯，要修改数据时，先备份，比如.conf的配置文件。另外，修改配置文件时，建议注释原选项，然后再复制，修改，再者说，如果第一个例子中，
有数据库备份，那rsync的误操作不就没事了吧，所以说丢数据库非一朝一夕，随便备份一个就不用那么惨。

## 二、涉及数据

### 慎用rm -rf

网上的例子很多，各种`rm -rf /`，各种删除主数据库，各种运维事故…… 一点小失误就会造成很大的损失。如果真需要删除，一定要谨慎。

### 备份操作大于一切

本来上面都有各种关于备份，但是我想把它划分在数据类再次强调，备份非常之重要哇，我记得我的老师说过一句话，涉及到数据何种的谨慎都不为过，
我就职的公司有做第三方支付网站和网贷平台的，第三方支付是每两个小时完全备份一次，网贷平台是每20分钟备份一次 我不多说了，大家自己斟酌吧。

### 稳定大于一切

其实不止是数据，在整个服务器环境，都是稳定大于一切，不求最快，但求最稳定，求可用性 所以未经测试，不要在服务器使用新的软件，
比如 `nginx+php-fpm`，生产环境中php各种挂啊，重启下就好了，或者换apache就好了。

### 保密大于一切

现在各种艳照门漫天飞，各种路由器后门，所以说，涉及到数据，不保密是不行的。

## 三、涉及安全

### ssh

更改默认端口(当然如果专业要黑你，扫描下就出来了) 禁止root登录，使用 *普通用户+key认证+sudo规则+ip地址+用户限制*，使用hostdeny类似的防爆
破解软件(超过几次尝试直接拉黑) 筛选 `/etc/passwd`中login的用户

### 防火墙

防火墙生产环境一定要开，并且要遵循最小原则，drop所有，然后放行需要的服务端口。

### 精细权限和控制粒度

能使用普通用户启动的服务坚决不使用root，把各种服务权限控制到最低，控制细粒度要精细。

### 入侵检测和日志监控

使用第三方软件，时刻检测系统关键文件以及各种服务配置文件的改动 比如,`/etc/passwd,/etc/my.cnf，/etc/httpd/con/httpd.con`等；
使用集中化的日志监控体系，监控`/var/log/secure，/etc/log/message`，ftp上传下载文件等报警错误日志; 另外针对端口扫描，
也可以使用一些第三方软件，发现被扫描就直接拉入`host.deny`。这些信息对于系统被入侵后排错很有帮助。有人说过，
一个公司在安全投入的成本跟他被安全攻击损失的成本成正比，安全是一个很大的话题，也是一个很基础的工作，把基础做好了，
就能相当的提高系统安全性，其他的就是安全高手做的了。

## 四、日常监控

### 系统运行监控

好多人踏入运维都是从监控做起，大的公司一般都有专业24小时监控运维。系统运行监控一般包括硬件占用率，常见的有：`内存，硬盘，cpu，网卡，os包括登录监控`，
系统关键文件监控，定期的监控可以预测出硬件损坏的概率，并且给调优带来很实用的功能。

### 服务运行监控

服务监控一般就是各种应用，`web，db，lvs`等，这一般都是监控一些指标，在系统出现性能瓶颈的时候就能很快发现并解决。

### 日志监控

这里的日志监控跟安全的日志监控类似，但这里一般都是硬件，os，应用程序的报错和警报信息，监控在系统稳定运行的时候确实没啥用，但是一旦出现问题，
你又没做监控，就会很被动了。

## 五、性能调优

### 深入了解运行机制

其实按一年多的运维经验来说，谈调优根本就是纸上谈兵，但是我只是想简单总结下，如果有更深入的了解，我会更新。在对软件进行优化之前，
比如要深入了解一个软件的运行机制，比如nginx和apache，大家都说nginx快，那就必须知道nginx为什么快，利用什么原理，处理请求比apache，
并且要能跟别人用浅显易懂的话说出来，必要的时候还要能看懂源代码，否则一切以参数为调优对象的文档都是瞎谈。

### 调优框架以及先后

熟悉了底层运行机制，就要有调优的框架和先后顺序，比如数据库出现瓶颈，好多人直接就去更改数据库的配置文件，我的建议是，先根据瓶颈去分析，
查看日志，写出来调优方向，然后再入手，并且数据库服务器调优应该是最后一步，最先的应该是硬件和操作系统，现在的数据库服务器都是在各种
测试之后才会发布的，适用于所有操作系统，不应该先从他入手。

### 每次只调一个参数

每次只调一个参数，这个相比大家都了解，调的多了，你就自己就迷糊了。

### 基准测试

判断调优是否有用，和测试一个新版本软件的稳定性和性能等方面，就必须要基准测试了，测试要涉及很多因素 测试是否接近业务真实需求这要看测试人的经验了，
相关资料大家可以参考**《高性能mysql》**第三版相当的好。我的老师曾说过，没有放之四海皆准的参数，任何参数更改任何调优都必须符合业务场景 所以不要再谷歌什么什么调优了，
对你的提升和业务环境的改善没有长久作用。

## 六、运维心态

### 控制心态

很多`rm -rf /data`都在下班的前几分钟，都在烦躁的高峰，那么你还不打算控制下你的心态么，有人说了，烦躁也要上班，可是你可以在烦躁的时候尽量避免处理关键数据环境，
越是有压力，越要冷静，不然会损失更多。大多人都有`rm -rf /data/mysql`的经历，发现删除之后，那种心情你可以想象一下，可是如果没有备份，你急又有什么用，
一般这种情况下，你就要冷静想下最坏打算了，对于mysql来说，删除了物理文件，一部分表还会存在内存中，所以断开业务，但是不要关闭mysql数据库，这对恢复很有帮助，
并使用dd复制硬盘，然后你再进行恢复 当然了大多时候你就只能找数据恢复公司了。试想一下，数据被删了，你各种操作，关闭数据库，然后修复，不但有可能覆盖文件，还找不到内存中的表了。

### 对数据负责

生产环境不是儿戏，数据库也不是儿戏，一定要对数据负责。不备份的后果是非常严重的。

### 追根究底

很多运维人员比较忙，遇到问题解决就不会再管了，记得去年一个客户的网站老是打不开，经过php代码报错 发现是`session`和`whos_online`损坏，前任运维是通过`repair`修复的，
我就也这样修复了，但是过了几个小时，又出现了，反复三四次之后，我就去谷歌数据库表莫名损坏原因：一是myisam的bug，二是mysqlbug，三是mysql在写入过程中 被kill，
最后发现是内存不够用，导致OOM kill了mysqld进程 并且没有swap分区，后台监控内存是够用的，最后升级物理内存解决。

### 测试和生产环境

在重要操作之前一定要看自己所在的机器，尽量避免多开窗口。


以上内容由 [原文链接](https://zhuanlan.zhihu.com/p/365519427) 改编

