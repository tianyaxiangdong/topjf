// .vuepress/config.ts
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";

export default autoCatalogPlugin({
    exclude: ["/java/","/linux/"],
})