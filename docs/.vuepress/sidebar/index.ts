import { sidebar } from 'vuepress-theme-hope';

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
    '/': [""],
});

