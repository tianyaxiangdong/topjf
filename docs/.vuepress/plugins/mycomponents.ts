// .vuepress/config.ts
import {componentsPlugin} from "vuepress-plugin-components";

export default componentsPlugin({
    // 插件选项
    components: ["ArtPlayer", "AudioPlayer", "Badge", "BiliBili", "CodePen", "FontIcon", "PDF", "StackBlitz", "SiteInfo", "VideoPlayer", "XiGua", "YouTube"],
    componentOptions: {
        pdf: {
            pdfjs: "/assets/lib/pdfjs",
        },
    },
})
