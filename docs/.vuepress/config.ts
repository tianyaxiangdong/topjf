import {defineUserConfig, viteBundler} from "vuepress";
import theme from "./theme";
import searchPro from "./plugins/searchPro";

export default defineUserConfig({

    base: "/",

    locales: {
        "/": {
            lang: "zh-CN",
            title: "topjf",
            description: "꧁「小牛专属笔记本」꧂",
        },
    },

    plugins: [
        searchPro,
    ],

    theme,

    markdown: {
        headers: {
            level: [2, 3, 4, 5, 6],
        },
    },

    head: [
        ["script", {type: 'text/javascript', src: '/script/index.js'}],
        ["link", {rel: "stylesheet", href: "/iconfont/iconfont.css"}],
    ],

    //预读取，开启pwa后建议为false
    shouldPrefetch: false,
    
    bundler: viteBundler({
        viteOptions: {
            build: {
                chunkSizeWarningLimit: 12040,
            }
        },
        vuePluginOptions: {},
    }),
});
