// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export const allNavbar = navbar([
    "/",
    "/home",
    {text: "面试宝典", icon: "overflow", link: "/001/"},
    {text: "文章中心", icon: "blog", link: "/article"},
    {
        text: "网站相关",
        icon: "info",
        children: [
            {text: "关于本站", icon: "people", link: "/about-this"},
            {text: "网站历史", icon: "time", link: "/history"},
        ],
    },
    {
        text: "友情链接",
        icon: "api",
        children: [
            {text: "VuePress Theme Hope 文档", icon: "api", link: "https://theme-hope.vuejs.press/zh/"},
            {text: "VuePress Theme Hope 源码", icon: "api", link: "https://github.com/vuepress-theme-hope/vuepress-theme-hope"},
            {text: "VuePress Theme Hope 浏览图标", icon: "api", link: "https://theme-hope.vuejs.press/zh/guide/interface/icon.html#浏览图标"},
            {text: "Mister-Hope.github.io", icon: "api", link: "https://github.com/Mister-Hope/Mister-Hope.github.io"},
            {text: "how2j Java学习入门网站", icon: "api", link: "https://how2j.cn/"},
            {text: "JavaGuide（Java学习+面试指南）", icon: "api", link: "https://javaguide.cn/"},
            {text: "escapelife 运维开发博客", icon: "api", link: "https://www.escapelife.site/"},
            {text: "markdownlint 配置（MD0xx）", icon: "api", link: "https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md"},
            {text: "快速创建 SpringBoot 项目", icon: "api", link: "https://start.spring.io/"},
            {text: "cron 在线校验", icon: "api", link: "http://cron.qqe2.com/"},
            {text: "crontab 在线校验", icon: "api", link: "https://tool.lu/crontab/"},
            {text: "正则表达式工具", icon: "api", link: "https://tool.lu/regex/"},
            {text: "Maven 包查找", icon: "api", link: "https://mvnrepository.com/search?q=mybatisplus"},
            {text: "JetBrains 开源项目认证", icon: "api", link: "https://www.jetbrains.com/shop/eform/opensource"},
            {text: "#", icon: "api", link: ""},
        ],
    },
    {text: "Markdown测试", icon: "overflow", link: "/test"},
    {text: "演示", icon: "like", link: "/live"},
]);
