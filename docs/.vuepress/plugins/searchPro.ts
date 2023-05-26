// .vuepress/config.ts
import {searchProPlugin} from "vuepress-plugin-search-pro";

export default searchProPlugin({
    // 搜索引擎，是否索引内容
    indexContent: true,
    customFields: [
        {
            getter: (page) => page.frontmatter.category,
            formatter: "分类：$content",
        },
        {
            getter: (page) => page.frontmatter.tag,
            formatter: "标签：$content",
        },
    ],
})
