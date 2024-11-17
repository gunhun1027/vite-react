// 使用工具函数
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有网站数据
    fetchSites();

    // 添加分类过滤器事件监听
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', handleCategoryFilter);
    });

    // 添加搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
});

// 获取网站数据
async function fetchSites() {
    try {
        const sites = await utils.api.get('/api/sites');
        renderSites(sites);
    } catch (error) {
        utils.showMessage('获取数据失败，请稍后重试', 'error');
    }
}

// ... 其他函数保持不变，但可以使用utils中的工具函数 ... 