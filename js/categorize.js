/**
 * リポジトリ分類機能
 * フォーク/オリジナル、プライベート/パブリックで分類
 */

const GITHUB_USERNAME = 'fumifumi0831';

/**
 * リポジトリを分類
 * @param {Array} repositories リポジトリ情報の配列
 * @param {string} username GitHubユーザー名
 * @returns {Object} 分類されたリポジトリオブジェクト
 */
function categorizeRepositories(repositories, username = GITHUB_USERNAME) {
    const categorized = {
        original: {
            public: [],
            private: []
        },
        forked: {
            public: [],
            private: []
        },
        all: []
    };

    repositories.forEach(repo => {
        // すべてのリポジトリをallに追加
        categorized.all.push(repo);

        // フォークかオリジナルか判定
        const isFork = repo.fork === true;
        const isOriginal = !isFork || (isFork && repo.owner?.login === username);

        // プライベートかパブリックか判定
        const isPrivate = repo.private === true;
        const isPublic = !isPrivate;

        // フォークの判定を再確認（parentオブジェクトも確認）
        let actuallyForked = false;
        if (isFork && repo.parent) {
            actuallyForked = repo.parent.owner?.login !== username;
        }

        // 分類
        if (actuallyForked) {
            // フォークしたリポジトリ
            if (isPublic) {
                categorized.forked.public.push(repo);
            } else {
                categorized.forked.private.push(repo);
            }
        } else {
            // オリジナルのリポジトリ
            if (isPublic) {
                categorized.original.public.push(repo);
            } else {
                categorized.original.private.push(repo);
            }
        }
    });

    return categorized;
}

/**
 * リポジトリの統計情報を取得
 * @param {Object} categorized 分類されたリポジトリオブジェクト
 * @returns {Object} 統計情報
 */
function getRepositoryStats(categorized) {
    return {
        total: categorized.all.length,
        original: {
            total: categorized.original.public.length + categorized.original.private.length,
            public: categorized.original.public.length,
            private: categorized.original.private.length
        },
        forked: {
            total: categorized.forked.public.length + categorized.forked.private.length,
            public: categorized.forked.public.length,
            private: categorized.forked.private.length
        }
    };
}
