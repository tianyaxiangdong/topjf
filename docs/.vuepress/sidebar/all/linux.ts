import {linuxBasis} from "./linux-basis";

/**
 * Linux 侧边栏json数据
 */
export const linuxJson =
    [// {
        //   text: "Linux",
        //    icon: "linux",
        //   prefix: "linux/",
        //   collapsable: true,
        //   children: [
        {
            text: "基础命令",
            icon: "object",
            prefix: "basis/",
            children: linuxBasis,
            //children: "structure",
        },
        "command-examples",
        "exception-analysis",
        "network-setting",
        "disk",
        "yum-repo",
        "update-kernel",
        "jenkins",
        {
            text: "运维监控工具",
            icon: "tool",
            prefix: "monitoringtools/",
            children: "structure",
        },
        {
            text: "ansible运维管理工具",
            icon: "tool",
            prefix: "ansible/",
            children: "structure",
            // children: [
            //    "ansible-basis",
            //   "ansible",
            //   "ansible-doc",
            //   "ansible-playbook",
            //  "ansible-galaxy",
            //   "ansible-jdk",
            //    "ansible-docker",
            //   "ansible-mysql",
            //    "ansible-redis",
            //   "ansible-nginx",
            //  ]
        },
        "shell",
    ]
//   }
