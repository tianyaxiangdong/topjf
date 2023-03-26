import {sidebar} from 'vuepress-theme-hope';

// @ts-ignore
import {allSources} from './allSources.ts';
// @ts-ignore
import {architectures} from './architectures.ts';
// @ts-ignore
import {openSources} from './open-source.ts';
// @ts-ignore
import {toolsJson} from './tools.ts';
// @ts-ignore
import {javaJson} from './java.ts';
// @ts-ignore
import {databaseJson} from './database.ts';
// @ts-ignore
import {webJson} from './web.ts';
// @ts-ignore
import {middlewareJson} from './middleware.ts';
// @ts-ignore
import {kubernetesJson} from './kubernetesJson.ts';
// @ts-ignore
import {dockerJson} from './dockerJson.ts';
// @ts-ignore
import {linuxJson} from './linux.ts';


/**
 * 应该把更精确的路径放置在前边
 * "structure",
 */
export const allSidebar = sidebar({
    '/history/': ['history'],
    '/about/': ['about-this'],
    '/architecture/': architectures,
    '/books/': "structure",
    '/open-source/': openSources,
    '/all/': allSources,
    '/java/': javaJson,
    '/web/': webJson,
    '/middleware/': middlewareJson,
    '/database/': databaseJson,
    '/linux/': linuxJson,
    '/k8s/': kubernetesJson,
    '/docker/': dockerJson,
    '/tools/': toolsJson,
    '/': [
        "",
    ],
});
