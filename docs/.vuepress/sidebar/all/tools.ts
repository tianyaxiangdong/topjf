/**
 * Java 侧边栏json数据
 */
export const toolsJson =
    [
        "java",
        "maven",
        "gradle",
        "idea",
        "eclipse",
        "nodejs-setting",
        "markdownlint",
        "rsync",
        "vagrant-vmware",
        {
            text: "数据库管理工具",
            icon: "database",
            prefix: "database/",
            children: "structure",
        },
        {
            text: "Git相关",
            icon: "git",
            prefix: "git/",
            children: "structure",
        }
    ]
