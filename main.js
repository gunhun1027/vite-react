document.addEventListener('DOMContentLoaded', () => {
    // 获取所有网站数据
    fetchSites();

    // 添加分类过滤器事件监听
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', (e) => {
            e.preventDefault();
            // 移除所有active类
            document.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
            // 添加active类到当前点击的元素
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            filterSites(category);
        });
    });

    // 添加搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        searchSites(searchTerm);
    });
});

// 获取网站数据
async function fetchSites() {
    try {
        const response = await fetch('/api/sites');
        const sites = await response.json();
        renderSites(sites);
    } catch (error) {
        console.error('获取数据失败:', error);
        // 添加错误提示
        const container = document.getElementById('sites-container');
        container.innerHTML = '<div class="error-message">获取数据失败，请稍后重试</div>';
    }
}

// 渲染网站卡片
function renderSites(sites) {
    const container = document.getElementById('sites-container');
    container.innerHTML = sites.map(site => `
        <div class="site-card" data-category="${site.category}">
            <h3><a href="${site.url}" target="_blank">${site.title}</a></h3>
            <p>${site.description}</p>
            <span class="category-tag">${site.category}</span>
        </div>
    `).join('');
}

// 过滤网站
function filterSites(category) {
    const cards = document.querySelectorAll('.site-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 搜索网站
function searchSites(searchTerm) {
    const cards = document.querySelectorAll('.site-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
} 