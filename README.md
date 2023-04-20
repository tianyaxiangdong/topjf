## topjf

- [🚀预览](https://topjf.github.io/)
- [github](https://github.com/topjf/topjf)
- [gitee](https://gitee.com/topjf/topjf)
- [存放 build docs 仓库](https://github.com/topjf/topjf.github.io)
- vuepress-theme-hope：[文档](https://theme-hope.vuejs.press/zh/)、[github](https://github.com/vuepress-theme-hope/vuepress-theme-hope)
- [使用Java压缩md文件中使用到的图片](https://gitee.com/cps007/markdown-img)
- [参考 Mister-Hope.github.io](https://github.com/Mister-Hope/Mister-Hope.github.io)

<!-- #region recent-beta -->

A：**当主题版本有跳跃式更新时，先在 github 创建本`次版本-1`的 
`releases`，再提交本次版本更新**
例如：当前版本为 `v3.203.9` 需要更新到 `v3.205.0`，则需要手动创建release为 `v3.204.0` 为基础，在执行 `sh commit.sh` 时选择 feat 选项。


B：**测试新主题版本：** 先更新 `package.json` 主题版本并设置提交消息为 `mytest` 开头，会自动触发test工作流，
然后自动部署到github.io，访问看看样式和其他功能是否正常，
正常了切换package主题版本为原来版本并提交；
然后再重新修改为测试正常的主题版本号，
并设置提交消息开头为 `feat:`
（如果是跨越式版本更新，请先执行 **A** 步骤。

## 提交规范

*注意* ：如果只是更新已经存在的文件的内容，请设置提交消息为 `Update` 开头，如（Update linux.md）等等；如果是添加新文件则可以使用下面的👇 *选项*。

**脚本提交**：sh commit.sh

**命令提交**：git add -A  && pnpm run commit 或者 git commit -m "选项: 描述" && git push -u origin main

**web端提交** 简单描述格式：选项: 简要描述

*选项*：

- break change feature 发布会增加主版本号（如 `1.1.1 –> 2.0.0` ）**这个选择位于 feat 选项的：? Are there any breaking changes?**
- **feat**: 新的功能，发布版本会增加次版本号（如 `1.0.0 –> 1.1.0` ）
- **fix**: 修复bug，发布版本会增加修订版本号（如 `1.0.0 –> 1.0.1` ）
- **docs**: 只修改文档
- **style**: 不影响代码含义的修改（比如：空格、格式化、添加缺少的分号等）
- **refactor**: 重构代码（既不修复错误，也不增加功能）
- **perf**: 性能优化
- **test**: 添加测试或纠正现有测试
- **build**: 影响构建系统或外部依赖的变化（如glup、npm等）
- **ci**: ci配置文件和脚本的改变 （如：Travis、Circle）
- **chore**: 其它不修改src或测试文件的改动
- **revert**: 回滚之前的提交

## md文件模板

```
---
icon: edit
title: 性能
category: 
- Java
date: 2023-03-12
tag:
- 工
---

摘要描述信息

<!-- more -->

```


## 添加新文件步骤

```json
{
  text: "Java",
  icon: "java",
  prefix: "java/",
  children: [
    "demo",
  ]
}
```

自动读取md文件并配置侧边栏目录

> children: "structure",

> sidebar -> `"/foo/": "structure",`

## md文件设置frontmatter

```text
#顶置，你可以将sticky设置为number来设置它们的顺序。数值大的文章会排列在前面。
sticky: true
#收藏
star: true
#是否是文章，或者 plugins.blog.filter 自定义哪些页面是文章。
article: false
#是否显示在时间线
timeline: false
```

## 技术选型

- 安装 pnpm：

[安装教程 pnpm.io/zh](https://pnpm.io/zh)

window 通过 npm 安装

```shell
npm install -g pnpm@8.2.0

pnpm add -g pnpm

```

- 技术版本列表

| 技术                  | 地址                                                                                   |
|---------------------|--------------------------------------------------------------------------------------|
| node                | <a href="https://www.npmjs.com/package/node" target="_blank">19.x</a>                |
| npm                 | <a href="https://www.npmjs.com/package/npm" target="_blank">9.x</a>                  |
| pnpm                | <a href="https://www.npmjs.com/package/pnpm" target="_blank">8.x</a>                 |
| vue                 | <a href="https://www.npmjs.com/package/vue" target="_blank">3.x</a>                 |
| vuepress-theme-hope | <a href="https://www.npmjs.com/package/vuepress-theme-hope" target="_blank">2.0.0-bate.x</a> |
| vuepress            | <a href="https://www.npmjs.com/package/vuepress" target="_blank">2.0.0-beta.x</a>            |

<!-- #endregion recent-beta -->

