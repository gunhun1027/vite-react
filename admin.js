document.addEventListener('DOMContentLoaded', () => {
    // 获取并显示所有网站
    fetchSites();

    // 添加网站表单提交处理
    const addSiteForm = document.getElementById('addSiteForm');
    addSiteForm.addEventListener('submit', handleAddSite);
});

// 获取所有网站
async function fetchSites() {
    try {
        const response = await fetch('/api/sites');
        const sites = await response.json();
        renderSites(sites);
    } catch (error) {
        console.error('获取数据失败:', error);
        showMessage('获取数据失败，请稍后重试', 'error');
    }
}

// 渲染网站列表
function renderSites(sites) {
    const container = document.getElementById('sitesList');
    container.innerHTML = sites.map(site => `
        <div class="site-item" data-id="${site.id}">
            <div class="site-info">
                <h3>${site.title}</h3>
                <p>${site.description}</p>
                <span class="category-badge">${site.category}</span>
            </div>
            <div class="site-actions">
                <button class="btn-delete" onclick="deleteSite(${site.id})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `).join('');
}

// 添加新网站
async function handleAddSite(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value,
        url: document.getElementById('url').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/api/sites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showMessage('网站添加成功！', 'success');
            e.target.reset();
            fetchSites(); // 刷新列表
        } else {
            throw new Error('添加失败');
        }
    } catch (error) {
        console.error('添加网站失败:', error);
        showMessage('添加失败，请重试', 'error');
    }
}

// 删除网站
async function deleteSite(id) {
    if (!confirm('确定要删除这个网站吗？')) return;

    try {
        const response = await fetch(`/api/sites/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('删除成功！', 'success');
            fetchSites(); // 刷新列表
        } else {
            throw new Error('删除失败');
        }
    } catch (error) {
        console.error('删除网站失败:', error);
        showMessage('删除失败，请重试', 'error');
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 