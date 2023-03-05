// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export const allNavbar = navbar([
    "/",
    "/home",
    {text: "面试宝典", icon: "overflow", link: "/all/all"},
    {
        text: "个人中心",
        icon: "anonymous",
        children: [
            {text: "文章", icon: "note", link: "/article"},
            {text: "分类", icon: "categoryselected", link: "/category"},
            {text: "标签", icon: "list", link: "/tag"},
            {text: "收藏文章", icon: "like", link: "/star"},
            {text: "时间线", icon: "time", link: "/timeline"},
        ],
    },
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
            {text: "Mister-Hope.github.io", icon: "api", link: "https://github.com/Mister-Hope/Mister-Hope.github.io"},
            {text: "VuePress Theme Hope 浏览图标", icon: "api", link: "https://theme-hope.vuejs.press/zh/guide/interface/icon.html#浏览图标"},
            {text: "how2j Java学习入门网站", icon: "api", link: "https://how2j.cn/"},
            {text: "escapelife 运维开发工程师博客", icon: "api", link: "https://www.escapelife.site/"},
            {text: "markdownlint 配置（MD0xx）", icon: "api", link: "https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md"},
        ],
    },
    {text: "Markdown测试", icon: "overflow", link: "/test"},
    {text: "演示", icon: "like", link: "/live"},
]);
