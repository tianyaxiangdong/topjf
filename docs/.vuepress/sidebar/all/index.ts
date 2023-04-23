import {sidebar} from 'vuepress-theme-hope';
import {001Sources} from './001Sources.ts';
import {openSources} from './open-source.ts';
import {toolsJson} from './tools.ts';
import {javaJson} from './java.ts';
import {databaseJson} from './database.ts';
import {webJson} from './web.ts';
import {middlewareJson} from './middleware.ts';
import {kubernetesJson} from './kubernetesJson.ts';
import {dockerJson} from './dockerJson.ts';
import {linuxJson} from './linux.ts';


/**
 * 应该把更精确的路径放置在前边
 * "structure",
 */
export const allSidebar = sidebar({
    '/history/': ['history'],
    '/about/': ['about-this'],
    '/books/': "structure",
    '/open-source/': openSources,
    '/001/': 001Sources,
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
