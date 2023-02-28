---
icon: edit
title: nodejs配置
category: 
- 开发工具
date: 2020-01-06
tag:
- nodejs
---

<!-- more -->

Node.js  [安装-教程](https://blog.csdn.net/qq_42476834/article/details/110789382)

[node 官网下载](http://nodejs.cn/download/)、[https://github.com/nodejs/release](https://github.com/nodejs/release)

## NodeJS Release schedule

| Release  | Status              | Codename     |Initial Release | Active LTS Start | Maintenance Start | End-of-life               |
| :--:     | :---:               | :---:        | :---:          | :---:            | :---:             | :---:                     |
| 14.x | **Maintenance**     | Fermium  | 2020-04-21     | 2020-10-27       | 2021-10-19        | 2023-04-30                |
| [16.x][] | **Maintenance**     | Gallium  | 2021-04-20     | 2021-10-26       | 2022-10-18        | 2023-09-11                |
| [18.x][] | **LTS**             | Hydrogen | 2022-04-19     | 2022-10-25       | 2023-10-18        | 2025-04-30                |
| [19.x][] | **Current**         |              | 2022-10-18     | -                | 2023-04-01        | 2023-06-01                |
| 20.x     | **Pending**         |              | 2023-04-18     | 2023-10-24       | 2024-10-22        | 2026-04-30                |


[pnpm 官网安装教程](https://pnpm.io/zh/installation)


## linux 配置

```bash
tar -zxvf 下载的tar包路径 -C 存放目标路劲
sudo ln -s /soft/nodejs/bin/node /usr/local/bin/ && sudo ln -s /soft/nodejs/bin/npm /usr/local/bin/ && ls /usr/local/bin/

## sudo rm -rf /usr/local/bin/node && sudo rm -rf /usr/local/bin/npm && sudo rm -rf /usr/local/bin/cnpm

node -v && npm -v

更新node： npm install -g npm 

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
corepack prepare pnpm@7.27.1 --activate
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
npm install -g webpack && npm install -D webpack-cli -g
```

> `npm install -g vue-cli` 会存放在`/rj/nodejs/node_global/{bin,lib}`目录下


## window 配置

[下载地址](https://nodejs.org/download/release/)，选择 `latest-v18.x` 版本

双击运行 `node-v18.14.2-x64.msi`文件进行安装。

安装后，安装其他组件的默认安装存放位置：`C:\Users\{username}\AppData\Roaming\npm\node_modules` 里面。

**如：**

`npm i -g element-ui` 存放在 `AppData\Roaming\npm\node_modules` 目录下-> `element-ui`;

`npm i -g pnpm@7.27.0` 存放在 `AppData\Roaming\npm\node_modules` 目录下-> `pnpm`

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

系统变量.Path：`%NODE_HOME%`

### 安装 pnpm

#### 使用npm安装

安装：`npm install -g pnpm`

配置pnpm环境变量: *系统属性.环境变量.系统变量.Path*：`%NODE_HOME%\node_global\pnpm`

#### 使用PowerShell安装

[https://pnpm.io/zh/installation#windows](https://pnpm.io/zh/installation#windows)

```shell
PS C:\Users\k> iwr https://get.pnpm.io/install.ps1 -useb | iex                                                          

Downloading '@pnpm/win-x64' from 'npmjs.com' registry...

Extracting downloaded '7.27.1' archive...

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
7.27.1
```

### 全局安装测试

引入 elementui：`npm i -g element-ui -S`
