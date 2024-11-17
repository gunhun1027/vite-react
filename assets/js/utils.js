// 通用工具函数
const utils = {
    // 显示消息提示
    showMessage: function(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    },

    // API请求封装
    api: {
        async get(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },

        async post(url, data) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        },

        async delete(url) {
            try {
                const response = await fetch(url, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Network response was not ok');
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }
    }
}; 