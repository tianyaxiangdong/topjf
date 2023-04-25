/**
 * Linux 侧边栏json数据
 */
import {linuxBasis} from "./linux-basis";

export const linuxJson =
    [// {
        //   text: "Linux",
        //    icon: "linux",
        //   prefix: "linux/",
        //   collapsable: true,
        //   children: [
        {
            text: "基本命令",
            icon: "shell",
            prefix: "basis/commands/",
            collapsable: true,
            children: "structure",
        },
        {
            text: "基础",
            icon: "object",
            prefix: "basis/",
            // collapsable: true,
            children: linuxBasis,
            // children: "structure",
        },
        "monitor-elasticsearch"
        "operation-constraint",
        "command-examples",
        "exception-analysis",
        "network-setting",
        "start-java",
        "emails",
        "disk",
        "yum-repo",
        "update-kernel",
        "shell1",
        "shell2",
        "shell3",
        "shell4",
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
    ]
//   }
