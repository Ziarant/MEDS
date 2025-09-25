// 通用DOM组件
const personalCenterBtn = document.getElementById('user-button');
const deepseekBtn = document.getElementById('deepseek-button');
const addDataButton = document.getElementById('add-data-button');
const natonButton = document.getElementById('naton-btn')
const yuanbaoButton = document.getElementById('yuanbao-btn')

let userConfig = null;
if (localStorage.getItem('userConfig') !== '[object Object]') {
    userConfig = JSON.parse(localStorage.getItem('userConfig'));
}

if (userConfig === null) {
    deepseekBtn.classList.add('hidden')
}

let showPersonalCenter = false, showDeepseekBtn = false;
let noticeNum = 0

// AI对话信息,结构：
// allChats = {
//     chatId : [
//         {role: 'user', content: 'xxx'},
//         {role: 'assistant', content: 'xxx'}
//     ]
// }

let currentMessages = [];
let allChats = {}, saveCurrentChatId = null, currentChatId = null;
function initChatData() {
    const saveChats = localStorage.getItem('allChats');
    const saveCurrentChatId = localStorage.getItem('saveCurrentChatId')
    if (saveChats) {
        if (saveChats === '[object Object]') {
            // 创建新对话信息：
            currentChatId = `chat-${Date.now()}-${Math.random().toString(36)}`;
            allChats[currentChatId] = currentMessages;
            return
        }
        // 若已有历史对话信息：
        allChats = JSON.parse(saveChats);
        console.log(allChats)
        currentChatId = saveCurrentChatId || Object.keys(allChats)[0];
        currentMessages = allChats[currentChatId] || [];
    } else {
        // 创建新对话信息：
        currentChatId = `chat-${Date.now()}-${Math.random().toString(36)}`;
        allChats[currentChatId] = currentMessages
    }
}
createChatWindow()

// 保存对话信息（）
function saveChatData() {
    console.log('当前对话：', currentMessages)
    allChats[currentChatId] = currentMessages
    localStorage.setItem('allChats', JSON.stringify(allChats));
    localStorage.setItem('saveCurrentChatId', currentChatId)
}

// 页面刷新时，初始化：
document.addEventListener('DOMContentLoaded', () => {
    initChatData();
    if (currentMessages.length > 0) {
        currentMessages.forEach((message) => {
            // 初始化时，不带id标记
            const messageId = null
            updateMessageContent(messageId, message.content, message.role)
        })
    }
})

// 版本跳转
document.getElementById("version-span").addEventListener("click", function () {
    // 检查重定向地址
    if (window.location.href.includes('selection.html')) {
        window.location.href = "../devlog.html";
        return
    }
    window.location.href = "../client/devlog.html";
});
document.getElementById("guide-a").addEventListener("click", function () {
    // 检查重定向地址
    if (window.location.href.includes('selection.html')) {
        window.location.href = "../guide.html";
        return
    }
    window.location.href = "../client/guide.html";
});

version = localStorage.getItem('version')
const versionSpan = document.getElementById("version-span")
versionSpan.innerHTML = version

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
    notification.className = `fixed bottom-${bottom} right-4 ${bgColor} ${textColor} border-l-4 border-blue-400 p-4 rounded shadow-lg flex items-center space-x-3 animate-fade-in z-50 max-w-lg`;

    notification.innerHTML = `
        <i class="fa ${icon} text-lg"></i>
        <div>
          <p class="font-medium">${message}</p>
        </div>
      `;

    // 添加到页面
    document.body.appendChild(notification);

    // 5秒后自动关闭
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        notification.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
        noticeNum = 0
    }, 5000);
}

// 悬浮按钮：
// 悬浮按钮长按-拖动位置
let isDragging = false;
let offsetX, offsetY;
let initialX, initialY;
let currentX = 0, currentY = 0;

if (addDataButton !== null) {
    addDataButton.addEventListener('click', () => {
        if (!isDragging) {
            // 不同页面中，触发不同函数
            addDataButtonClick();
        } else {
            isDragging = false;
            return
        }
    })

    addDataButton.addEventListener('mousedown', function (e) {
        // 防止点击事件触发
        e.preventDefault();

        // 设置为拖动状态
        isDragging = true;

        // 计算鼠标与按钮左上角的偏移量
        const rect = addDataButton.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // 添加样式类以指示正在拖动
        addDataButton.classList.add('scale-110');

        // 记录初始位置
        initialX = currentX;
        initialY = currentY;

        // 添加临时事件监听器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    })

    // 窗口大小调整时重新计算位置
    window.addEventListener('resize', function () {
        // 如果按钮已被拖动，重新计算位置以确保在视口内
        if (currentX > 0 || currentY > 0) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const buttonWidth = addDataButton.offsetWidth;
            const buttonHeight = addDataButton.offsetHeight;

            // 水平方向限制
            if (currentX > viewportWidth - buttonWidth) {
                currentX = viewportWidth - buttonWidth;
                addDataButton.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }

            // 垂直方向限制
            if (currentY > viewportHeight - buttonHeight) {
                currentY = viewportHeight - buttonHeight;
                addDataButton.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }
    });
}

if (deepseekBtn !== null) {
    deepseekBtn.addEventListener('mousedown', function (e) {
        // 防止点击事件触发
        e.preventDefault();

        // 设置为拖动状态
        isDragging = true;

        // 计算鼠标与按钮左上角的偏移量
        const rect = deepseekBtn.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // 添加样式类以指示正在拖动
        deepseekBtn.classList.add('scale-110');

        // 记录初始位置
        initialX = currentX;
        initialY = currentY;

        // 添加临时事件监听器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    })

    deepseekBtn.addEventListener('click', () => {
        if (!isDragging) {
            toggleChatWindow()
            chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            isDragging = false;
            return
        }
    })
}


// 鼠标移动事件 - 处理拖动
function handleMouseMove(e) {
    if (isDragging) {
        e.preventDefault();
        // 计算新位置
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // 对象限制在视口范围内
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonWidth = e.target.offsetWidth;
        const buttonHeight = e.target.offsetHeight;

        // 水平方向限制
        if (newX < 0) newX = 0;
        if (newX > viewportWidth - buttonWidth) newX = viewportWidth - buttonWidth;

        // 垂直方向限制
        if (newY < 0) newY = 0;
        if (newY > viewportHeight - buttonHeight) newY = viewportHeight - buttonHeight;

        const transX = newX - currentX
        const transY = newY - currentY

        // 更新位置
        currentX = newX;
        currentY = newY;
        e.target.style.top = `${currentY}px`
        e.target.style.left = `${currentX}px`
    }
}

// 鼠标松开事件 - 结束拖动
function handleMouseUp(e) {
    // 移除样式类
    e.target.classList.remove('scale-110', 'opacity-90');

    // 添加释放动画
    e.target.classList.add('transition-transform', 'duration-200');
    setTimeout(() => {
        e.target.classList.remove('transition-transform', 'duration-200');
    }, 200);

    // 移除临时事件监听器
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // 如果只是点击而不是拖动，触发点击事件
    const movedDistance = Math.sqrt(
        Math.pow(currentX - initialX, 2) + Math.pow(currentY - initialY, 2)
    );

    if (movedDistance < 5) {
        e.target.click();
    };
}


// 个人中心
personalCenterBtn.addEventListener('click', () => personalModal());

function personalModal() {
    const userFileCount = localStorage.getItem('userFileCount') || 0
    const userDataCount = localStorage.getItem('userDataCount') || 0
    const my_inProgressCount = localStorage.getItem('my_inProgressCount') || 0
    // 创建个人信息元素
    if (showPersonalCenter) {
        return;
    };
    const username = localStorage.getItem('username');
    const userID = localStorage.getItem('userID');
    showPersonalCenter = true;
    const personalCenter = document.createElement('div');
    const overlay = document.createElement('div');
    personalCenter.className = 'fixed bg-gray-100 top-1/2 left-1/2 border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg z-50 w-2/5';
    overlay.className = `fixed inset-0 bg-white bg-opacity-75 z-40 transition-opacity duration-300`

    personalCenter.innerHTML = `
        <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3">
            <div>
                <h3 class="text-2xl font-semibold">${username}</h3>
            </div>
            <button id="close-persinalCenter" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="ml-3 mr-3 md-1">工号：<span class="text-gray-500 ml-2">${userID}</span></div>
        <div class="group-span flex items-center justify-start space-x-4 ml-3 mr-3 md-1">
            <p>组别：</p>
        </div>
        <hr />
        <div class="bg-white rounded-lg p-4 mt-2 mt-3 ml-3 mr-3">
            <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <i class="fa fa-chart-line text-primary text-xl"></i>
                </div>
                <span class="font-medium font-semibold">账户数据</span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2">
                    <div class="text-2xl font-bold text-primary">${userFileCount}</div>
                    <div class="text-xs text-neutral-700">文件</div>
                </div>
                <div class="p-2">
                    <div class="text-2xl font-bold text-primary">${userDataCount}</div>
                    <div class="text-xs text-neutral-700">测试数据</div>
                </div>
                <div class="p-2">
                    <div class="text-2xl font-bold text-primary">${my_inProgressCount}</div>
                    <div class="text-xs text-neutral-700">进行中任务</div>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-lg p-4 mt-2 mt-3 ml-3 mr-3">
            <div class="flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <i class="fa fa-cog text-primary text-xl"></i>
                </div>
                <span class="font-medium font-semibold">账户设置</span>
            </div>
            
            <div class="w-full font-medium border-t border-gray-300">
                <div class="flex mt-1 md-1">
                    <span class="text-bold mr-2 p-1">AI设置（参考Deepseek开放平台：</span> 
                        <a href="https://platform.deepseek.com/usage" target="_blank" title="点击访问Deepseek开放平台，获取API密钥"
                            class="border border-gray-300 rounded-lg item-center justify-center">
                            <img class="h-[1.25rem] mt-1" src="../../icon/deepseek.png" alt="Deepseek开放平台">
                        </a>
                    <span class="text-bold">）</span>       
                </div>
                <div class="grid grid-cols-6 space-x-2 space-y-2 justify-center relative flex-grow ml-4 mt-1">
                    <div class="col-span-6"></div>
                    <label class="col-span-1 mr-4">对话按钮</label>
                    <label id="deepseek-toggle-lable" class="col-span-1 bg-gray-100 text-center  mr-4">显示</label>
                    <label class="toggle-switch col-span-4">
                        <input type="checkbox" id="deepseek-toggle-Btn" checked>
                        <span class="toggle-slider"></span>
                    </label>
                    <label class="col-span-1 mr-4">余额(￥)</label>
                    <label id="deepseek-balance-lable" class="col-span-1 bg-gray-100 text-center justify-center mr-4"></label>
                    <button id="deepseek-balance" class="col-span-1 bg-primary/70 text-black py-1 border border-gray-200 hover:bg-primary mr-4">查询</button>
                    <label class="col-span-3">
                    </label>
                    
                    <label class="col-span-1 mr-4">baseURL:</label>
                    <input type="text" id="baseURL-input" placeholder="请输入baseURL,如 https://api.deepseek.com"
                        title="设置baseURL，请确保您的服务器是可用的"
                        class="col-span-5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800"
                        value="https://api.deepseek.com">
                    <label class="col-span-1 mr-4">API key:</label>
                    <input type="password" id="apikey-input" placeholder="请输入Apikey" autocomplete="new-password"
                        title="请填写API key。该填充框内不可见不可复制，请妥善保存,不要与他人共享你的 API key"
                        class="col-span-5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800">
                    <label class="col-span-1 mr-4">模型:</label>
                    <select id="ai-model-select"
                        class="col-span-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800">
                        <option value="deepseek-chat">对话</option>
                        <option value="deepseek-reasoner">深度思考</option>
                    </select>
                    <label class="col-span-1 mr-4">创新性:</label>
                    <select id="ai-temperature-select"
                        class="col-span-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800">
                        <option value="0.1">非常确定</option>
                        <option value="0.8">适度确定</option>
                        <option value="1.2">平衡</option>
                        <option value="1.8">创新</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-start border-t border-gray-300 mt-3">
                <button id="config-save-button" class="bg-primary/70 text-black px-2 py-1 rounded hover:bg-primary mt-2">保存设置</button>
            </div>
        </div>
        <div class="hidden bg-white rounded-lg p-4 mt-2 mt-3 ml-3 mr-3">
             <div class="flex items-center space-x-3 mb-3">
                <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <i class="fa fa-heart text-primary text-xl"></i>
                </div>
                <span class="font-medium">关注内容</span>
            </div>
            <div class="grid grid-cols-5 gap-3 text-center">
                <div class='block flex items-center mr-2'>
                    <input id="Implant" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>种植体</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Abutment" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>基台</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="TAD" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>支抗钉</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Drill" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>钻类</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Rotary" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>旋转器械</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Pickup" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>植入器</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Handle" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>扳手</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Material" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>牙科材料</span>
                </div>
                <div class='block flex items-center mr-2'>
                    <input id="Other" type="checkbox" class="form-checkbox h-5 w-5 text-primary rounded mr-1" checked><span>其他</span>
                </div>
            </div>
        </div>
        <hr />
        <div class="flex justify-end mt-4 mt-3 ml-3 mr-3">
            <button id="logoutBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">退出登录</button>
        </div>
    `;

    let groupArray = []
    group.split(',').forEach((item) => {
        groupArray.push(item.trim());
    });
    const groupSpan = personalCenter.querySelector('.group-span')
    groupArray.forEach((item) => {
        const groupItem = document.createElement('div');
        const textColor = item === '管理员' || item === '开发者' ? 'red-500' : 'black';
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
    document.body.appendChild(personalCenter);
    document.body.appendChild(overlay)

    // 预填充
    const deepseekToggleBtn = document.getElementById('deepseek-toggle-Btn')
    const balanceBtn = document.getElementById('deepseek-balance')
    if(userConfig !== null) {
        if (userConfig.AI.deepseek !== undefined) {
            if (userConfig.AI.deepseek.show) {
                showDeepseekBtn = true
                deepseekToggleBtn.checked = true
                deepseekBtn.classList.remove('hidden')
            } else {
                showDeepseekBtn = false
                deepseekToggleBtn.checked = false
                deepseekBtn.classList.add('hidden')
            }
            document.getElementById('baseURL-input').value = userConfig.AI.deepseek.baseURL;
            document.getElementById('apikey-input').value = userConfig.AI.deepseek.apikey;
            document.getElementById('ai-model-select').value = userConfig.AI.deepseek.model;
            document.getElementById('ai-temperature-select').value = userConfig.AI.deepseek.temperature;
        }
    }


    // 控件：
    balanceBtn.addEventListener('click', () => {
        const apikey = userConfig.AI.deepseek.apikey
        const balance = getDSBalance(apikey)
        .then(balance => {
            document.getElementById('deepseek-balance-lable').textContent = balance
        })
        
        // 
    })
    deepseekToggleBtn.addEventListener('change', () => {
        if (deepseekToggleBtn.checked) {
            document.getElementById('deepseek-toggle-lable').textContent = '显示'
            deepseekBtn.classList.remove('hidden');
            userConfig.AI.deepseek.show = true;
        } else {
            document.getElementById('deepseek-toggle-lable').textContent = '隐藏'
            deepseekBtn.classList.add('hidden');
            userConfig.AI.deepseek.show = false;
        }
    })

    // 背景禁止滚动
    document.body.style.overflow = 'hidden'

    // 退出登录：
    const logoutBtn = document.getElementById('logoutBtn');
    const closeBtn = document.getElementById('close-persinalCenter');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '../../login.html';
    });
    closeBtn.addEventListener('click', () => {
        personalCenter.remove();
        overlay.remove()
        showPersonalCenter = false;
        // 恢复背景滚动
        document.body.style.overflow = '';
    });
}

// naton页面
function natonWindow() {
    const natonFrame = document.createElement('div');
    const overlay = document.createElement('div');
    natonFrame.className = 'fixed bg-gray-100 top-1/2 left-1/2 border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg z-50 w-4/5 h-4/5';
    overlay.className = `fixed inset-0 bg-white bg-opacity-75 z-40 transition-opacity duration-300`

    natonFrame.innerHTML = `
        <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3">
            <div>
                <h3 class="text-2xl font-semibold">智慧办公</h3>
            </div>
            <button id="close-natonFrame" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fa fa-times"></i>
            </button>
        </div>
        <iframe id="myIframe" src="https://home.naton.cn/home" class="w-full h-[95%] border border-gray-300 mt-1">
        <iframe>
    `;
    // 添加到页面
    document.body.appendChild(natonFrame);
    document.body.appendChild(overlay)
    // 背景禁止滚动
    document.body.style.overflow = 'hidden'
    document.getElementById('close-natonFrame').addEventListener('click', () => {
        natonFrame.remove();
        overlay.remove()
        // 恢复背景滚动
        document.body.style.overflow = '';
    })
}

// yuanbao页面
function yuanbaoWindow() {
    let yuanbaoFrame = document.getElementById('yuanbaoFrame')
    if (yuanbaoFrame === null) {
        yuanbaoFrame = document.createElement('div');
        const overlay = document.createElement('div');
        yuanbaoFrame.className = 'fixed bg-gray-100 top-1/2 left-1/2 border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg z-50 w-4/5 h-4/5';
        overlay.className = `fixed inset-0 bg-white bg-opacity-75 z-40 transition-opacity duration-300`
        yuanbaoFrame.id = 'yuanbaoFrame';
        yuanbaoFrame.innerHTML = `
            <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3">
                <div>
                    <h3 class="text-2xl font-semibold">腾讯元宝</h3>
                </div>
                <button id="close-yuanbaoFrame" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="fa fa-times"></i>
                </button>
            </div>
            <iframe id="myIframe" src="https://yuanbao.tencent.com/" class="w-full h-[95%] border border-gray-300 mt-1">
            <iframe>
        `;
        // 添加到页面
        document.body.appendChild(yuanbaoFrame);
        document.body.appendChild(overlay)
        // 背景禁止滚动
        document.body.style.overflow = 'hidden'
        document.getElementById('close-yuanbaoFrame').addEventListener('click', () => {
            yuanbaoFrame.classList.add('hidden')
            overlay.remove()
            // 恢复背景滚动
            document.body.style.overflow = '';
        })
    } else {
        yuanbaoFrame.classList.remove('hidden')
        document.body.style.overflow = 'hidden'
    }
}

function createChatWindow() {
    let chatWindow = document.getElementById('chat-window')
    let deepseekToggleBtn = document.getElementById('deepseek-toggle-Btn')
    if (deepseekToggleBtn !== null) {
        showDeepseekBtn = deepseekToggleBtn.value
        if (showDeepseekBtn) {
            deepseekBtn.classList.remove('hidden')
        } else {
            deepseekBtn.classList.add('hidden')
        }

    }
    if (chatWindow === null) {
        chatWindow = document.createElement('div')
        chatWindow.id = 'chat-window'
        chatWindow.className = "hidden fixed bottom-[125px] max-w-[80%] max-h-[80%] left-10 z-50 bg-white border border-gray-600 rounded-lg shadow-2xl overflow-hidden flex"
        chatWindow.innerHTML = `
            <!-- 调整大小的手柄 -->
            <div class="resize-handle resize-handle-right"></div>
            <div class="resize-handle resize-handle-top"></div>
            <div class="resize-handle resize-handle-corner"></div>

            <!-- 左侧：对话历史侧边栏 -->
            <div id="chat-history-sidebar" class="hidden w-[250px] bg-gray-50 border-r border-gray-200 flex flex-col">
                <!-- 侧边栏标题栏 -->
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 class="font-semibold text-gray-800">对话历史</h3>
                    <button id="new-chat-btn" class="text-blue-500 hover:text-blue-600 transition-colors">
                        <i class="fa fa-plus-circle"></i> 新建对话
                    </button>
                </div>
                <!-- 对话历史列表（默认空，通过JS动态添加） -->
                <div id="chat-history-list" class="flex-1 overflow-y-auto p-2">
                    <!-- 示例历史项（动态生成） -->
                    <!-- <div class="chat-history-item active p-3 rounded-md mb-1" data-chat-id="chat-1">
                        今天 14:30 - 初始对话
                    </div> -->
                </div>
            </div>

            <!-- 右侧：聊天主区域 -->
            <div class="flex-1 flex flex-col">
                <div class="flex text-center items-center justify-between p-4 bg-gray-100 border-b border-gray-600">
                    <button id="ai-sidebar-button" class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors" title="查看历史对话">
                        <i class="fa fa-layer-group"></i>
                    </button>
                    <div class="flex w-full text-center items-center justify-center">
                        <img class="h-[1.25rem]" src="../../icon/deepseek.png">
                        <h2 class="text-lg text-center font-semibold">DeepSeek</h2>
                    </div>
                    <button id="close-chatWindow" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div id="chat-messages" class="flex-1 p-6 overflow-y-auto max-h-180 scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb">
                    <div class="flex justify-start mb-4">
                        <div class="message-container bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[75%] break-words">
                            你好，我是DeepSeek，有什么可以帮助你的吗？
                        </div>
                    </div>
                </div>
                <div id="files-container" class="flex items-start bg-gray-100 justify-start">
                </div>
                <div class="flex flex-col items-center bg-gray-100">
                    <div class="flex items-center w-full">
                        <textarea id="chat-input" 
                            class="w-full border border-gray-300 rounded-lg py-2 px-4 mr-2 focus:outline-none focus:border-blue-500 ml-1 mr-1" 
                            row="1" 
                            placeholder="请输入消息"></textarea>
                        <button id="send-chat" class="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition-colors"
                            title="给Deepseek发送消息">
                            <i class="fa fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
                <div class="flex items-center justify-between space-x-4">
                    <p class="text-sm text-gray-500 ml-2 mt-1 md-1">Shift + Enter 换行，Enter 发送；通过个人中心设置API key</p>
                    <div>
                        <label class="col-span-1 mr-4">模型:</label>
                        <select id="chatWindow-model-select"
                            class="col-span-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800">
                            <option value="deepseek-chat">对话</option>
                            <option value="deepseek-reasoner">深度思考</option>
                        </select>
                        <label class="col-span-1 ml-4 mr-4" title="精准定义 AI 身份, 更贴合特定场景需求">预制角色:</label>
                        <select id="chatWindow-role-select"
                            class="col-span-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-white/50 outline-none text-gray-800">
                            <option value="assistant">无</option>
                            <option value="role-1">role-1</option>
                            <option value="role-1">role-2</option>
                        </select>
                        <button id="chatWindow-addFile-btn" class="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition-colors"
                            title="添加文件">
                            <i class="fa fa-paperclip"></i>
                        </button>
                        <button id="chatWindow-scroll-up-btn" class="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition-colors"
                            title="滚动到顶部">
                            <i class="fa fa-angle-up"></i>
                        </button>
                        <button id="chatWindow-scroll-down-btn" class="bg-gray-500 text-white rounded-lg py-2 px-4 hover:bg-gray-600 transition-colors"
                            title="滚动到底部">
                            <i class="fa fa-angle-down"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
        document.body.appendChild(chatWindow)

        // 添加文件：
        document.getElementById('chatWindow-addFile-btn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.addEventListener('change', (event) => {
                const files = event.target.files;
                const chatMessages = document.getElementById('chat-messages');
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // 创建容器
                    const fileContainer = document.getElementById("files-container")
                    const fileContentContainer = document.createElement('div');
                    fileContentContainer.className = 'message-container flex bg-blue-200 border border-gray-300 text-black rounded-lg py-2 px-2 md-1 max-w-[50%] break-words';
                    // fileContentContainer.textContent = file.name;
                    let { fileIcon, fileIconBg, fileIconColor } = getFileIconbyFileType(file.type)
                    fileContentContainer.innerHTML = `
                    <div class="w-10 h-10 rounded-lg ${fileIconBg} flex items-center justify-center mr-2">
                        <i class="fa ${fileIcon} ${fileIconBg} text-2xl ${fileIconColor}"></i>
                    </div>
                    <div>
                        <p>${file.name}</p>
                        <span class="file-parse-status text-gray-400">解析中</span>
                    </div>
                    `
                    fileContainer.appendChild(fileContentContainer);
                    // chatMessages.appendChild(fileContainer);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                   
                    // 上传到Deepseek
                    const apikey = userConfig.AI.deepseek.apikey;
                    uploadDSFile(apikey, file)
                        .then(fileId => {
                            console.log('fileId:', fileId)
                            fileContentContainer.id = fileId;
                            const statusElem = fileContentContainer.querySelector('.file-parse-status');
                            if (statusElem) statusElem.textContent = '解析完成';
                        })
                        .catch(error => {
                            console.error('文件上传失败:', error);
                            const statusElem = fileContentContainer.querySelector('.file-parse-status');
                            if (statusElem) statusElem.textContent = '解析失败';
                        });
                }
                
            });
            input.click();
        });
        // 滚动：
        document.getElementById('chatWindow-scroll-up-btn').addEventListener('click', () => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = 0;
        }); 
        document.getElementById('chatWindow-scroll-down-btn').addEventListener('click', () => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
        // 监听Enter，触发发送按钮：
        document.getElementById('chat-input').addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (document.getElementById('chat-input').value === '') {
                    return
                }
                document.getElementById('send-chat').click();
            }
            // Shift + Enter 换行
            if (event.key === 'Enter' && event.shiftKey) {
                console.log('Shift + Enter')
                event.preventDefault();
                const input = document.getElementById('chat-input');
                const cursorPosition = input.selectionStart;
                input.value = input.value.substring(0, cursorPosition) + '\n' + input.value.substring(cursorPosition);
                input.selectionStart = input.selectionEnd = cursorPosition + 1;
            }
        });
    }
}

function toggleChatWindow() {
    let chatWindow = document.getElementById('chat-window')
    chatWindow.classList.toggle('hidden')

    // 记录原始位置和大小：
    const original_width = chatWindow.style.width, original_height = chatWindow.style.height

    // 初始化
    initResizeFunctionality()

    document.getElementById('chatWindow-model-select').value = userConfig.AI.deepseek.model;

    // 设置位置
    const dsPosition = deepseekBtn.getBoundingClientRect()
    const top = window.innerHeight - dsPosition.bottom + 100, left = dsPosition.left, right = dsPosition.right;
    const width = 0.5 * window.innerWidth, height = 0.5 * window.innerHeight;
    chatWindow.style.bottom = `${top}px`
    chatWindow.style.left = `${left}px`
    chatWindow.style.width = `${width}px`
    chatWindow.style.height = `${height}px`

    // 调整宽度和高度
    chatWindow.style.width = original_width;
    chatWindow.style.height = original_height;

    // 控件相关函数
    document.getElementById('close-chatWindow').onclick = function () {
        chatWindow.classList.add('hidden');
    };
    document.getElementById('ai-sidebar-button').onclick = function () {
        document.getElementById('chat-history-sidebar').classList.toggle('hidden')
    };

    // 发送对话
    document.getElementById('send-chat').onclick = function () {
        // 检查头部设置
        if (userConfig === null) {
            showNotification('请先设置apikey', 'warning')
            return
        }
        const baseURL = userConfig.AI.deepseek.baseURL;
        const apikey = userConfig.AI.deepseek.apikey;
        const model = userConfig.AI.deepseek.model;
        const temperature = userConfig.AI.deepseek.temperature;
        if (baseURL === '' || apikey === '' || model === '' || temperature === '') {
            showNotification('请先设置apikey', 'warning')
            return
        }
        const message = document.getElementById('chat-input').value;
        const role = document.getElementById('chatWindow-role-select').value;
        // 构建对话结构体：
        currentMessages.push({
            role: 'user',
            content: message
        })
        currentMessages.push({
            role: 'assistant',
            content: ''
        })

        const currentSession = {
            messages: currentMessages,
            baseURL: baseURL,
            apikey: apikey,
            model: model,
            temperature: temperature,
            role: role
        }

        const userMessageId = `msg-${Date.now()}-${Math.random().toString(36)}`;
        updateMessageContent(userMessageId, message, 'user', model)
        const aiMessageId = `msg-${Date.now()}-${Math.random().toString(36)}`;
        sendMessage(aiMessageId, currentSession)
        document.getElementById('chat-input').value = '';
        // saveChatData();
    }
};

function updateMessageContent(id, message, role, model = '') {
    chatMessages = document.getElementById('chat-messages');
    let messageDiv;
    const content = renderContent(message)
    // 检查是否已有对应消息
    if (document.getElementById(id) !== null) {
        messageDiv = document.getElementById(id);
        messageDiv.querySelector('.message-container').innerHTML = content;
        // 更新
        currentMessages[currentMessages.length - 1].content = content
    } else {
        messageDiv = document.createElement('div');
        // 更新
        if (id !== null) {
            messageDiv.id = id;
            currentMessages[currentMessages.length - 1].content = content
        } else {
            messageDiv.id = `chat-${Date.now()}-${Math.random().toString(36)}`;
        }
        if (role === 'user') {
            messageDiv.className = 'flex justify-end mb-4';
            messageDiv.innerHTML = `
                <div class="message-container bg-green-200 text-black rounded-lg py-2 px-4 max-w-[90%] break-words" title="模型：${model}"></div>
            `;
            messageDiv.querySelector('.message-container').innerHTML = content;
        } else {
            messageDiv.className = 'flex justify-start mb-4';
            messageDiv.innerHTML = `
                <div class="flex flex-col max-w-[90%]">
                    <div class="message-container bg-gray-200 text-black rounded-lg py-2 px-4 break-words" title="角色：${role}"></div>
                    <div class="flex justify-end">
                        <button class="message-copy-btn block bg-gray-300 border border-gray-400 px-2 py-1 rounded hover:bg-blue-200 mt-1" onclick="copyMessageContent(this)">
                            <i class="fa fa-copy mr-1"></i>复制
                        </button>
                    </div>
                </div>
            `;
            messageDiv.querySelector('.message-container').innerHTML = content;
        }
        chatMessages.appendChild(messageDiv);
    }
    // chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 将接收到的内容渲染为HTML格式
function renderContent(content, options = {}) {
    marked.setOptions({
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
    const htmlContent = marked.parse(content);

    return htmlContent;

    // 初始化转换器，配置常用规则
    const converter = new showdown.Converter({
        tables: true,                   // 支持表格
        simplifiedAutoLink: true,       // 自动识别链接
        strikethrough: true,            // 支持删除线
        ghCodeBlocks: true,             // 支持GitHub风格代码块
        smartIndentationFix: true,      // 修复缩进问题
        tasklists: true,                // 支持任务列表
        // 代码块相关配置
        prefixHeaderId: false,          // 不自动生成标题ID,为代码块添加语法高亮标记（需配合highlight.js使用）
        parseImgDimensions: true,       // 支持图片尺寸解析
        ...options
    });

    // 处理空内容
    if (!content || typeof content !== 'string') {
        return [];
    }

    // 按空行拆分段落（保留结构但避免破坏跨多行元素）
    const segments = content.split(/\n\n+/).filter(segment => {
        return segment.trim().length > 0;
    });

    // 渲染每个段落到HTML
    result = segments.map(segment => {
        // 使用Showdown统一转换（包括代码块）
        let html = converter.makeHtml(segment);

        // 为代码块添加样式类并应用高亮
        html = html.replace(/<pre><code class="([^"]*)">([\s\S]*?)<\/code><\/pre>/g,
            (match, lang, code) => {
                // 处理代码高亮
                const highlightedCode = lang
                    ? hljs.highlight(code, { language: lang }).value
                    : hljs.highlightAuto(code).value;

                // 返回带样式的代码块
                return `<pre class="bg-gray-200 p-4 rounded-md my-4 overflow-x-auto"><code class="language-${lang} break-words">${highlightedCode}</code></pre>`;
            }
        );
        return {
            original: segment,
            html: html
        };
    });

    return result.map(item => item.html).join('');
}

// 初始化大小调整功能
function initResizeFunctionality() {
    const chatWindow = document.getElementById('chat-window');
    const resizeRight = document.querySelector('.resize-handle-right');
    // const resizeBottom = document.querySelector('.resize-handle-bottom');
    const resizeTop = document.querySelector('.resize-handle-top');
    const resizeCorner = document.querySelector('.resize-handle-corner');

    let isResizing = false;
    let resizeType = ''; // 'width', 'height', 'both'
    let startX, startY, startWidth, startHeight;

    // 开始调整大小
    function startResize(type, e) {
        isResizing = true;
        resizeType = type;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(chatWindow).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(chatWindow).height, 10);

        // 添加调整中类，防止选择文本
        document.body.classList.add('resizing');

        // 添加事件监听
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    // 调整大小
    function resize(e) {
        if (!isResizing) return;

        // 设置最小尺寸限制
        const minWidth = 400, maxWidth = window.innerWidth - 150;
        const minHeight = 300, maxHeight = window.innerHeight - 150;

        if (resizeType === 'width' || resizeType === 'both') {
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth >= minWidth) {
                chatWindow.style.width = `${newWidth}px`;
            }
            if (newWidth >= maxWidth) {
                chatWindow.style.width = `${maxWidth}px`;
            }
        }

        if (resizeType === 'height' || resizeType === 'both') {
            const newHeight = startHeight - (e.clientY - startY);
            if (newHeight >= minHeight) {
                chatWindow.style.height = `${newHeight}px`;
            }
            if (newHeight >= maxHeight) {
                chatWindow.style.height = `${maxHeight}px`;
            }
        }

        e.preventDefault();
        e.stopPropagation();
    }

    // 停止调整大小
    function stopResize() {
        isResizing = false;
        document.body.classList.remove('resizing');

        // 移除事件监听
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    // 绑定调整大小事件
    resizeRight.addEventListener('mousedown', (e) => startResize('width', e));
    // resizeBottom.addEventListener('mousedown', (e) => startResize('height', e));
    resizeTop.addEventListener('mousedown', (e) => startResize('height', e));
    resizeCorner.addEventListener('mousedown', (e) => startResize('both', e));
}

function getFileIconbyFileType(type) {
     fileIcon = 'fa-file';
     fileIconBg = 'bg-gray-100';
     fileIconColor = 'text-gray-400';

    if (type.includes('image')) {
        fileIcon = 'fa-file-image';
        fileIconBg = 'bg-blue-50';
        fileIconColor = 'text-blue-500';
    } else if (type.includes('pdf')) {
        fileIcon = 'fa-file-pdf';
        fileIconBg = 'bg-red-50';
        fileIconColor = 'text-red-500';
    } else if (type.includes('word')) {
        fileIcon = 'fa-file-word';
        fileIconBg = 'bg-blue-50';
        fileIconColor = 'text-blue-600';
    } else if (type.includes('sheet')) {
        fileIcon = 'fa-file-excel';
        fileIconBg = 'bg-green-50';
        fileIconColor = 'text-green-600';
    } else if (type.includes('video')) {
        fileIcon = 'fa-file-video';
        fileIconBg = 'bg-purple-50';
        fileIconColor = 'text-purple-500';
    } else if (type.includes('presentation')) {
        fileIcon = 'fa-file-powerpoint';
        fileIconBg = 'bg-orange-50';
        fileIconColor = 'text-orange-500';
    }

    return { fileIcon, fileIconBg, fileIconColor };
}

natonButton.addEventListener('click', function () {
    natonWindow()
});

yuanbaoButton.addEventListener('click', function () {
    yuanbaoWindow()
});