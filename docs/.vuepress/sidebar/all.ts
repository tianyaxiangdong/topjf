import {sidebar} from 'vuepress-theme-hope';

// @ts-ignore
import {allSources} from './all/allSources.ts';
// @ts-ignore
import {books} from './all/books.ts';
// @ts-ignore
import {architectures} from './all/architectures.ts';
// @ts-ignore
import {openSources} from './all/open-source.ts';
// @ts-ignore
import {toolsJson} from './all/tools.ts';
// @ts-ignore
import {javaJson} from './all/java.ts';
// @ts-ignore
import {databaseJson} from './all/database.ts';
// @ts-ignore
import {webJson} from './all/web.ts';
// @ts-ignore
import {middlewareJson} from './all/middleware.ts';
// @ts-ignore
import {kubernetesJson} from './all/kubernetesJson.ts';
// @ts-ignore
import {dockerJson} from './all/dockerJson.ts';
// @ts-ignore
import {linuxJson} from './all/linux.ts';


/**
 * 应该把更精确的路径放置在前边
 */
export const allSidebar = sidebar({
    '/history/': ['history'],
    '/about/': ['about-this'],
    '/architecture/': architectures,
    '/books/': books,
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
