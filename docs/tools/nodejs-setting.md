
---
icon: edit
title: nodejs配置
category: 开发工具
date: 2020-01-06
tag:
- nodejs
---

<!-- more -->

Node.js  [安装-教程](https://blog.csdn.net/qq_42476834/article/details/110789382)

[官网下载](http://nodejs.cn/download/)


## linux 配置

```bash
tar -zxvf 下载的tar包路径 -C 存放目标路劲
sudo ln -s /soft/nodejs/bin/node /usr/local/bin/ && sudo ln -s /soft/nodejs/bin/npm /usr/local/bin/ && ls /usr/local/bin/

## sudo rm -rf /usr/local/bin/node && sudo rm -rf /usr/local/bin/npm && sudo rm -rf /usr/local/bin/cnpm

node -v && npm -v

更新node： npm install -g npm 

node    : 	npm
16.15.1:8.2.0
v16.13.2：8.1.2
v14.18.1：6.14.15
v14.17.1：6.14.14
v14.17.0：6.14.13
v14.15.5：6.14.11
v14.15.0：6.14.8
```

设置淘宝镜像源
```shell
npm config set registry https://registry.npm.taobao.org
```
需要换回时改为官方的镜像源
```shell
npm config set registry https://registry.npmjs.org
```
查看配置：`npm config list`

`npx -p npm@6 npm i --legacy-peer-deps`

### 使用 corepack 安装 pnpm

- 安装

```bash
corepack enable
corepack prepare pnpm@7.14.2 --activate
```

- 卸载：`corepack disable pnpm`

### 安装 cnpm

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
sudo ln -s /rj/nodejs/bin/cnpm /usr/local/bin/ && ls /usr/local/bin/

cnpm -v
```

> "user" config from /home/jf123/.npmrc

### 全局模块存储设置

创建文件夹：`node_global`、`node_cache`

npm config -help -s 

参数

> npm config set 
>
> npm config get 
>
> npm config delete cache && npm config delete prefix 
>
> npm config list
>
> npm config edit

```shell
npm config set prefix "/rj/nodejs/node_global" 

npm config set cache "/rj/nodejs/node_cache"

npm config list
```

### 配置环境变量

`sudo vim /etc/profile`

```bash
export NODE_PATH=/rj/nodejs/
export PATH=$PATH:${NODE_PATH}/bin
```

- 刷新配置生效：`source /etc/profile`

- 查看：`node -v && npm -v`

```
npm i -g element-ui -S && npm install -g webpack && npm install -D webpack-cli -g
```

> `npm install -g vue-cli` 会存放在`/rj/nodejs/node_global/{bin,lib}`目录下


## window 配置

### 配置npm淘宝源

```bash
npm config set registry http://registry.npm.taobao.org
```

### 全局模块存储设置

创建文件夹：`node_global`、`node_cache`

*最好赋予nodejs文件权限，不然系统自动创建文件时报错*

```shell
npm config set prefix "D:\rj-win\nodejs\node_global"
npm config set cache "D:\rj-win\nodejs\node_cache"
```

### 配置环境变量

NODE_HOME: `D:\rj-win\nodejs`

系统变量.Path：`%NODE_HOME%\node_global\node_modules`

### 安装 pnpm

- 使用npm安装

安装：`npm install -g pnpm`

配置pnpm环境变量: *系统属性.环境变量.系统变量.Path*：`%NODE_HOME%\node_global\pnpm`

- 使用PowerShell安装

```shell
PS C:\Users\k> iwr https://get.pnpm.io/install.ps1 -useb | iex                                                          

Downloading '@pnpm/win-x64' from 'npmjs.com' registry...

Extracting downloaded '7.25.1' archive...

Running setup...

Copying pnpm CLI from C:\Users\k\AppData\Local\Temp\tmpE1F.tmp.extracted\package\pnpm.exe to C:\Users\k\AppData\Local\pnpm\pnpm.exe

Next configuration changes were made:
PNPM_HOME=C:\Users\k\AppData\Local\pnpm
Path=%PNPM_HOME%;%USERPROFILE%\AppData\Local\Microsoft\WindowsApps;%IntelliJ IDEA%;C:\Users\k\AppData\Roaming\npm;%PyCharm%;D:\rj-win\Microsoft VS Code\bin;

Setup complete. Open a new terminal to start using pnpm.
```

重启计算机后查看：`pnpm -v`

```
PS C:\Users\k> pnpm -v
7.25.1
```

### 全局安装测试

引入 elementui：`npm i -g element-ui -S`
