// 通用DOM组件
const personalCenterBtn = document.getElementById('username-button');

const userFileCount = localStorage.getItem('userFileCount') || 0
const userDataCount = localStorage.getItem('userDataCount') || 0
let showPersonalCenter = false;
let noticeNum = 0

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    noticeNum++

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

    const bottom = Math.min(noticeNum * 4 + 4, 64)
    notification.className = `fixed bottom-${bottom} right-4 ${bgColor} ${textColor} border-l-4 border-blue-400 p-4 rounded shadow-lg flex items-center space-x-3 animate-fade-in z-50 max-w-xs`;

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
        noticeNum = 0
    }, 3000);
}

// 个人中心
personalCenterBtn.addEventListener('click',  () => personalModal());

function personalModal() {
    // 创建个人信息元素
    if (showPersonalCenter) {
        return;
    };
    const username = localStorage.getItem('username');
    showPersonalCenter = true;
    const personalCenter = document.createElement('div');
    personalCenter.className = 'fixed inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-lg z-50';
    // 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300'
    personalCenter.innerHTML = `
        <div class="flex items-center justify-between space-x-4">
            <div>
                <h3 class="text-2xl font-semibold">${username}</h3>
            </div>
            <button id="close-persinalCenter" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="group-span flex items-center justify-start space-x-4">
            <p>组别：</p>
        </div>
        <hr />
        <div class="bg-neutral-100 rounded-lg p-4 mt-2">
            <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <i class="fa fa-chart-line text-primary text-xl"></i>
                </div>
                <span class="font-medium">账户数据</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-center">
                <div class="p-2">
                    <div class="text-2xl font-bold text-primary">${userFileCount}</div>
                    <div class="text-xs text-neutral-700">文件</div>
                </div>
                <div class="p-2">
                    <div class="text-2xl font-bold text-primary">${userDataCount}</div>
                    <div class="text-xs text-neutral-700">数据</div>
                </div>
            </div>
        </div>
        <hr />
        <div class="flex justify-end mt-4">
            <button id="logoutBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">退出登录</button>
        </div>
    `;

    let groupArray = []
    group.split(',').forEach((item) => {
        groupArray.push(item.trim());
    });
    const groupSpan =personalCenter.querySelector('.group-span')
    groupArray.forEach((item) => {
        const groupItem = document.createElement('div');
        const textColor = item==='管理员' || item==='开发者' ? 'red-500' : 'black';
        groupItem.className = 'flex items-center space-x-2';
        groupItem.innerHTML = `
            <div class="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center">
                <i class="fa fa-users text-${textColor} text-sm"></i>
            </div>
            <span class="font-medium text-${textColor}">${item}</span>
        `;
        groupSpan.appendChild(groupItem);
    })
    // 添加到页面
    console.log(personalCenter.className)
    document.body.appendChild(personalCenter);

    // 退出登录：
    const logoutBtn = document.getElementById('logoutBtn');
    const closeBtn = document.getElementById('close-persinalCenter');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '../login.html';
    });
    closeBtn.addEventListener('click', () => {
        personalCenter.remove();
        showPersonalCenter = false;
    });
}