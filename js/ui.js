/**
 * UI制御機能
 * リポジトリカードの表示、フィルタリング機能
 */

const GITHUB_USERNAME = 'fumifumi0831';

let categorizedRepos = null;
let currentFilter = 'all';

/**
 * ページ読み込み時の初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    initializeFilterTabs();
    await loadAndDisplayRepositories();
});

/**
 * フィルタータブの初期化
 */
function initializeFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.dataset.filter;
            setActiveFilter(filter);
        });
    });
}

/**
 * アクティブなフィルターを設定
 * @param {string} filter フィルタータイプ ('all', 'original', 'forked')
 */
function setActiveFilter(filter) {
    currentFilter = filter;

    // タブの状態を更新
    document.querySelectorAll('.filter-tab').forEach(tab => {
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
        } else {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        }
    });

    // リポジトリを再表示
    displayRepositories();
}

/**
 * リポジトリを読み込んで表示
 */
async function loadAndDisplayRepositories() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const containerEl = document.getElementById('repositories-container');

    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        containerEl.style.display = 'none';

        // 関数が定義されているか確認
        if (typeof loadRepositories === 'undefined') {
            throw new Error('loadRepositories関数が定義されていません。api.jsが正しく読み込まれているか確認してください。');
        }
        if (typeof categorizeRepositories === 'undefined') {
            throw new Error('categorizeRepositories関数が定義されていません。categorize.jsが正しく読み込まれているか確認してください。');
        }

        const repositories = await loadRepositories();
        categorizedRepos = categorizeRepositories(repositories);
        
        loadingEl.style.display = 'none';
        containerEl.style.display = 'block';
        
        updateCounts();
        displayRepositories();
    } catch (error) {
        console.error('リポジトリ読み込みエラー:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.querySelector('.error-text').textContent = 
            `リポジトリの読み込みに失敗しました: ${error.message}`;
    }
}

/**
 * カウントを更新
 */
function updateCounts() {
    if (!categorizedRepos) return;

    const stats = getRepositoryStats(categorizedRepos);

    // タブのカウントを更新
    document.getElementById('count-all').textContent = stats.total;
    document.getElementById('count-original').textContent = stats.original.total;
    document.getElementById('count-forked').textContent = stats.forked.total;

    // セクションのカウントを更新
    document.getElementById('count-section-original').textContent = stats.original.total;
    document.getElementById('count-section-forked').textContent = stats.forked.total;
}

/**
 * リポジトリを表示
 */
function displayRepositories() {
    if (!categorizedRepos) return;

    const originalSection = document.getElementById('section-original');
    const forkedSection = document.getElementById('section-forked');
    const originalGrid = document.getElementById('grid-original');
    const forkedGrid = document.getElementById('grid-forked');

    // グリッドをクリア
    originalGrid.innerHTML = '';
    forkedGrid.innerHTML = '';

    // フィルターに応じて表示
    switch (currentFilter) {
        case 'all':
            displayRepositoriesInGrid(categorizedRepos.original.public, originalGrid);
            displayRepositoriesInGrid(categorizedRepos.forked.public, forkedGrid);
            originalSection.style.display = categorizedRepos.original.public.length > 0 ? 'block' : 'none';
            forkedSection.style.display = categorizedRepos.forked.public.length > 0 ? 'block' : 'none';
            break;
        case 'original':
            displayRepositoriesInGrid(categorizedRepos.original.public, originalGrid);
            originalSection.style.display = categorizedRepos.original.public.length > 0 ? 'block' : 'none';
            forkedSection.style.display = 'none';
            break;
        case 'forked':
            displayRepositoriesInGrid(categorizedRepos.forked.public, forkedGrid);
            originalSection.style.display = 'none';
            forkedSection.style.display = categorizedRepos.forked.public.length > 0 ? 'block' : 'none';
            break;
    }
}

/**
 * リポジトリカードをグリッドに表示
 * @param {Array} repositories リポジトリ情報の配列
 * @param {HTMLElement} gridEl グリッド要素
 */
function displayRepositoriesInGrid(repositories, gridEl) {
    repositories.forEach((repo, index) => {
        const card = createRepositoryCard(repo);
        card.style.animationDelay = `${index * 0.05}s`;
        gridEl.appendChild(card);
    });
}

/**
 * リポジトリカード要素を作成
 * @param {Object} repo リポジトリ情報
 * @returns {HTMLElement} リポジトリカード要素
 */
function createRepositoryCard(repo) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const isFork = repo.fork === true && repo.parent?.owner?.login !== GITHUB_USERNAME;
    const typeClass = isFork ? 'forked' : 'original';
    const typeLabel = isFork ? 'Forked' : 'Original';

    // 言語の色（主要な言語のみ）
    const languageColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Ruby': '#701516',
        'Java': '#b07219',
        'Go': '#00ADD8',
        'Rust': '#000000',
        'Swift': '#FA7343',
        'Kotlin': '#A97BFF',
        'PHP': '#4F5D95',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#239120',
        'Shell': '#89e051',
        'PowerShell': '#012456',
        'Vue': '#4fc08d',
        'React': '#61dafb',
        'Dart': '#00B4AB',
        'Lua': '#000080',
        'Perl': '#39457e',
        'Scala': '#c22d40',
        'Objective-C': '#438eff',
        'R': '#198CE7',
    };

    const languageColor = repo.language ? (languageColors[repo.language] || '#8e8e93') : '#8e8e93';

    card.innerHTML = `
        <div class="repo-header">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                ${escapeHtml(repo.name)}
            </a>
            <span class="repo-type-badge ${typeClass}">${typeLabel}</span>
        </div>
        <p class="repo-description">${escapeHtml(repo.description || '説明なし')}</p>
        <div class="repo-meta">
            ${repo.language ? `
                <div class="repo-language">
                    <span class="language-color" style="background-color: ${languageColor}; color: ${languageColor};"></span>
                    <span>${escapeHtml(repo.language)}</span>
                </div>
            ` : ''}
            <div class="repo-stats">
                ${repo.stargazers_count > 0 ? `
                    <div class="repo-stat" title="Stars">
                        <span>⭐</span>
                        <span>${repo.stargazers_count}</span>
                    </div>
                ` : ''}
                ${repo.forks_count > 0 ? `
                    <div class="repo-stat" title="Forks">
                        <span>🔀</span>
                        <span>${repo.forks_count}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

/**
 * HTMLエスケープ
 * @param {string} text エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// グローバルに公開（エラーハンドリング用）
window.loadAndDisplayRepositories = loadAndDisplayRepositories;
