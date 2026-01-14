/**
 * GitHub API連携機能
 * GitHub REST APIを使用してリポジトリ情報を取得
 */

// グローバル変数として定義（他のファイルでも使用）
window.GITHUB_USERNAME = 'fumifumi0831';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub APIからリポジトリ情報を取得
 * @returns {Promise<Array>} リポジトリ情報の配列
 */
async function fetchRepositories() {
    try {
        const url = `${GITHUB_API_BASE}/users/${window.GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`;
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('APIレートリミットに達しました。しばらく待ってから再試行してください。');
            }
            throw new Error(`GitHub APIエラー: ${response.status} ${response.statusText}`);
        }

        const repositories = await response.json();
        return repositories;
    } catch (error) {
        console.error('リポジトリ取得エラー:', error);
        throw error;
    }
}

/**
 * リポジトリ情報をローカルストレージにキャッシュ
 * @param {Array} repositories リポジトリ情報の配列
 */
function cacheRepositories(repositories) {
    try {
        const cacheData = {
            repositories: repositories,
            timestamp: Date.now(),
        };
        localStorage.setItem('github_repos_cache', JSON.stringify(cacheData));
    } catch (error) {
        console.warn('キャッシュ保存エラー:', error);
    }
}

/**
 * キャッシュからリポジトリ情報を取得
 * @param {number} maxAge キャッシュの最大有効期限（ミリ秒）
 * @returns {Array|null} キャッシュされたリポジトリ情報、またはnull
 */
function getCachedRepositories(maxAge = 5 * 60 * 1000) { // デフォルト5分
    try {
        const cached = localStorage.getItem('github_repos_cache');
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;

        if (age > maxAge) {
            localStorage.removeItem('github_repos_cache');
            return null;
        }

        return cacheData.repositories;
    } catch (error) {
        console.warn('キャッシュ読み込みエラー:', error);
        return null;
    }
}

/**
 * リポジトリ情報を取得（キャッシュを優先）
 * @returns {Promise<Array>} リポジトリ情報の配列
 */
async function loadRepositories() {
    // まずキャッシュを確認
    const cached = getCachedRepositories();
    if (cached) {
        console.log('キャッシュからリポジトリ情報を読み込みました');
        return cached;
    }

    // キャッシュがない場合はAPIから取得
    try {
        const repositories = await fetchRepositories();
        cacheRepositories(repositories);
        return repositories;
    } catch (error) {
        // エラー時はキャッシュがあればそれを使用
        const cached = getCachedRepositories(60 * 60 * 1000); // エラー時は1時間有効なキャッシュを使用
        if (cached) {
            console.warn('APIエラーのため、古いキャッシュを使用します:', error);
            return cached;
        }
        throw error;
    }
}
