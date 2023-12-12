import { sidebar } from 'vuepress-theme-hope';
import { openSources } from './open-source.ts';
import { toolsJson } from './tools.ts';
import { javaJson } from './java.ts';
import { databaseJson } from './database.ts';
import { webJson } from './web.ts';
import { middlewareJson } from './middleware.ts';
import { kubernetesJson } from './kubernetesJson.ts';
import { dockerJson } from './dockerJson.ts';
import { linuxJson } from './linux.ts';


/**
 * 应该把更精确的路径放置在前边
 * "structure",
 */
export const allSidebar = sidebar({
    '/history/': "structure",
    '/books/': "structure",
    '/open-source/': "structure",
    '/10001/': "structure",
    '/java/': "structure",
    '/web/': "structure",
    '/middleware/': "structure",
    '/database/': "structure",
    '/linux/': "structure",
    '/k8s/': "structure",
    '/docker/': "structure",
    '/tools/': "structure",
    '/': [ "", ],
});
