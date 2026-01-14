/**
 * リポジトリ分類機能
 * フォーク/オリジナル、プライベート/パブリックで分類
 */

/**
 * リポジトリを分類
 * @param {Array} repositories リポジトリ情報の配列
 * @param {string} username GitHubユーザー名
 * @returns {Object} 分類されたリポジトリオブジェクト
 */
function categorizeRepositories(repositories, username = window.GITHUB_USERNAME || 'fumifumi0831') {
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

        // プライベートかパブリックか判定
        const isPrivate = repo.private === true;
        const isPublic = !isPrivate;

        // フォークかオリジナルか判定
        // type=ownerで取得している場合、ownerは常にusernameと同じになる
        // そのため、repo.fork === true の場合、それはフォークと判定する
        // parent情報が存在する場合は、parent.owner.login で確認
        // parent情報が存在しない場合は、repo.fork === true で判定
        const isFork = repo.fork === true;
        let actuallyForked = false;
        
        if (isFork) {
            // フォークしたリポジトリの場合
            if (repo.parent && repo.parent.owner) {
                // parentのownerが自分でない場合は、他人のリポジトリをフォークしたもの
                actuallyForked = repo.parent.owner.login !== username;
            } else {
                // parentが存在しない場合（type=ownerで取得している場合）
                // repo.fork === true ならフォークと判定
                // type=ownerで取得している場合、ownerは常にusernameと同じになるため、
                // owner比較ではなく、forkフラグで判定する
                actuallyForked = true;
            }
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
