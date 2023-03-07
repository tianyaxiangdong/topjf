import {hopeTheme} from "vuepress-theme-hope";
import {allNavbar} from "./navbar/index";
import {allSidebar} from "./sidebar/index";

export default hopeTheme({
    logo: "/logo.png",

    hostname: "https://topjf.github.io/",

    author: {
        name: "topjf",
        // 根据自己的域名设置
        url: "/article",
    },

    darkmode: "toggle",/*toggle,auto*/

    //仓库
    repo: "https://github.com/topjf/topjf",

    //文档在仓库中的目录
    docsDir: "docs",

    //文档存放分支
    docsBranch: "main",

    // 关键词: "iconfont", "iconify", "fontawesome", "fontawesome-with-brands"
    // 参考：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#设置图标资源
    iconAssets: "iconfont",
    // iconPrefix: "iconfont icon-",

    pure: false,

    themeColor: {
        red: "#e83838",
        green: "#28af73",
        orange: "#fb9b5f",
    },

    fullscreen: true,

    pageInfo: ["Author", "Category", "Tag", "Date", "Original", "Word", "PageView", "ReadingTime"],

    locales: {
        "/": {
            // 导航栏
            navbar: allNavbar,

            // 侧边栏
            sidebar: allSidebar,

            blog: {
                intro: "/about-this",
                sidebarDisplay: "mobile",
                description: "",

                medias: {
                    Gitee: "https://gitee.com/topjf/topjf",
                    Github: "https://github.com/topjf/topjf",
                    Zhihu: "https://www.zhihu.com/people/tops6",
                    OSChina: [
                        "https://my.oschina.net/jinfang",
                        "<svg width=\"26px\" height=\"26px\" viewBox=\"0 0 32 32\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"\n" +
                        "    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n" +
                        "        <g id=\"Artboard\" transform=\"translate(-12.000000, -7.000000)\">\n" +
                        "            <g id=\"logo\" transform=\"translate(13.000000, 8.000000)\">\n" +
                        "                <g id=\"C\">\n" +
                        "                    <path d=\"M14.8015997,20.6197183 C11.6832252,20.6408451 9.14153634,18.6126761 8.9706665,14.8309859 C8.79979666,11.3028169 11.9181712,8.93661972 14.8870346,8.87323944 C18.3044314,8.78873239 20.3548695,12.6760563 20.3548695,12.6760563 L29.1760248,9.44366197 C29.1760248,9.44366197 25.5450408,0.0845070423 15.7200251,0.0845070423 C6.53577131,0.0845070423 0.192228568,6.42253521 0.192228568,15.0211268 C0.192228568,22.6690141 6.1726729,30.2957746 15.5064378,29.9577465 C25.7586281,29.5774648 29.2614598,20.5985915 29.2614598,20.5985915 L20.2053584,17.6197183 C20.2267171,17.5774648 18.3685076,20.6197183 14.8015997,20.6197183\" id=\"Path\" fill=\"#3DAB53\"/>\n" +
                        "                    <path d=\"M14.8015997,20.6197183 C11.6832252,20.6408451 9.14153634,18.6126761 8.9706665,14.8309859 C8.79979666,11.3028169 11.9181712,8.93661972 14.8870346,8.87323944 C18.3044314,8.78873239 20.3548695,12.6760563 20.3548695,12.6760563 L29.1760248,9.44366197 C29.1760248,9.44366197 25.5450408,0.0845070423 15.7200251,0.0845070423 C6.53577131,0.0845070423 0.192228568,6.42253521 0.192228568,15.0211268 C0.192228568,22.6690141 6.1726729,30.2957746 15.5064378,29.9577465 C25.7586281,29.5774648 29.2614598,20.5985915 29.2614598,20.5985915 L20.2053584,17.6197183 C20.2267171,17.5774648 18.3685076,20.6197183 14.8015997,20.6197183\" id=\"Path\" stroke=\"#006838\" stroke-width=\"1.05941556\"/>\n" +
                        "                </g>\n" +
                        "            </g>\n" +
                        "        </g>\n" +
                        "    </g>\n" +
                        "</svg>",
                    ],
                    csdn: [
                        "https://blog.csdn.net/qq_42476834",
                        "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\"\n" +
                        "     x=\"0px\" y=\"0px\" width=\"26px\" height=\"26px\" viewBox=\"0 0 26 26\" xml:space=\"preserve\">\n" +
                        "    <image id=\"image0\"\n" +
                        "           width=\"26\" height=\"26\" x=\"0\" y=\"0\"\n" +
                        "           href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABMlBMVEX8VTH8dFf9pZL9xLf+0cf+zsP9uar8knv8Xjz8g2n+29P////+9vX9rpz8Wzj8Wjf9vrD+/v7+4tz8ZUX8XTv+187+5+L9sJ/9wLL+7er9vK78VjP9zsT+6+f8iG/8VzT9mYT+9fP+z8X9pJD+4dv8ZEP8b1H+6+b8jnb8ZkX++Pf+9PH8aUr8Xz38cFL9sqL9nYj+8u/+7+z8WTb8f2T9taX8h239v7H8Z0f+zsT+/f3+0sn++/v9y7/9tqb8eVz9q5r8YUD++/r8Y0L8bE38iXH8VjL+1s78YT/8gGX+9PL8Zkb+8/D9m4b8YkD8WDX9w7b+9vT8hGr++vr+6OP+2dH+1Mv+4Nr++ff+7+v8fmP9sKD+8/H+7ur9qpn9qpj9wrb+zMH9u639oY38el78VzOb/PDuAAAAAWJLR0QLH9fEwAAAAAd0SU1FB+YJCQMYAYuLaVIAAAEASURBVDjLY2AYdICRiZmFlY2dA4c0Jxc3BPDw8mGR5hcQ5IYDIWEMeRFRkISYgLiEJIghhS4vLQMUlZUDMeUVFLm5ldAVKAPlVVShHDV1QQ00eU0tbm5tHThXVw/dAH2gAQZ4/C9vyM1tZIxHgQnQAFN8IcgEVGCGT4E5UIEFPgWW3NxW0vgUWHNz2+CTZ7AFWiGCT4EdUIE9PgXsQAUO+BQ4OnFzGzojCbi4uqGqEAAa4e4B53p6cYujKvD2AcW2rx+I7W8SYMXNHYhmSVAwKJkIhoSGhUeA01QIujM8I7mRgVEUhkM9omPg0rFxutj8wh8Un6BknZiUnJLKMJgAAK9gG/sHs2daAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTA5LTA5VDAzOjI0OjAxKzAwOjAwa85CsAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0wOS0wOVQwMzoyNDowMSswMDowMBqT+gwAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjItMDktMDlUMDM6MjQ6MDErMDA6MDBNhtvTAAAAAElFTkSuQmCC\"/>\n" +
                        "</svg>"
                    ],
                },
            },

            // page meta
            metaLocales: {
                editLink: "在 GitHub 编辑此页",
            },
        },
    },

    footer: "", //'<a href="https://beian.miit.gov.cn/" target="_blank">黔ICP备2022xxxxxx号-1</a>',

    displayFooter: true,

    plugins: {

        //评论模块
        comment: {
            // 评论模块设置教程：https://vuepress-theme-hope.github.io/v2/zh/guide/feature/comment.html
            // Giscus配置地址：https://giscus.app/zh-CN
            provider: "Giscus",  //Giscus、Waline
            repo: "topjf/topjf-discussions",
            repoId: "R_kgDOJGU09g",
            category: "Announcements",
            categoryId: "DIC_kwDOJGU09s4CUs1",
        },

        //其他插件
        components: {
            components: ["ArtPlayer", "AudioPlayer", "Badge", "BiliBili", "CodePen", "FontIcon", "PDF", "StackBlitz", "SiteInfo", "VideoPlayer", "XiGua", "YouTube"],
            componentOptions: {
                pdf: {
                    pdfjs: "/assets/lib/pdfjs",
                },
            },
        },

        //md增强
        mdEnhance: {
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            demo: true,
            echarts: true,
            gfm: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            //交互演示
            playground: {
                presets: ["ts", "vue"],
            },
            //幻灯片
            presentation: {
                plugins: ["highlight", "math", "search", "notes", "zoom"],
            },
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
            //流程图
            flowchart: true,
            //脚注
            footnote: true,
            //自定义容器:提示、注释、信息、注意、警告和详情
            container: true,
            // 启用图片大小
            imgLazyload: true,
            // 启用图片标记
            imgMark: true,
            imgSize: true,
            figure: true,

        },

        copyCode: {
            showInMobile: true,
        },

        photoSwipe: true,

        blog: {
            excerpt: true,
        },

        feed: {
            atom: true,
            rss: true,
            json: true,
        },

        pwa: {
            update: "hint",
            cachePic: true,
            maxSize: 1024 * 8,
            maxPicSize: 1024 * 6,
            //是否缓存除主页和 404 错误页之外的 HTML 文件
            cacheHTML: false,
            appendBase: true,
            apple: {
                icon: "/assets/icon/apple-icon-152.png",
                statusBarColor: "black",
            },
            msTile: {
                image: "/assets/icon/ms-icon-144.png",
                color: "#ffffff",
            },
        },

    },
});
