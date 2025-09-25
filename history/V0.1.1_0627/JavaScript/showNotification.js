// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');

    // 设置通知样式
    let bgColor, textColor, icon;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            textColor = 'text-green-800';
            icon = 'fa-check-circle';
            break;
        case 'error':
            bgColor = 'bg-red-50';
            textColor = 'text-red-800';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            bgColor = 'bg-yellow-50';
            textColor = 'text-yellow-800';
            icon = 'fa-exclamation-triangle';
            break;
        default: // info
            bgColor = 'bg-blue-50';
            textColor = 'text-blue-800';
            icon = 'fa-info-circle';
    }

    notification.className = `fixed bottom-4 right-4 ${bgColor} ${textColor} border-l-4 border-blue-400 p-4 rounded shadow-lg flex items-center space-x-3 animate-fade-in z-50 max-w-xs`;

    notification.innerHTML = `
        <i class="fa ${icon} text-lg"></i>
        <div>
          <p class="font-medium">${message}</p>
        </div>
      `;

    // 添加到页面
    document.body.appendChild(notification);

    // 3秒后自动关闭
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        notification.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
