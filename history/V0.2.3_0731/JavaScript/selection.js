// DOM控件
const femCard = document.getElementById('fem-card');
const manageCard = document.getElementById('system-manage-card');

if (group.includes('开发者')) {
    // 如果是管理员,显示开发中的模块
    // femCard.hidden = false;
}

// 卡片跳转：
document.getElementById("submit-card").addEventListener("click", function () {
    // 跳转到文件上传系统
    if (!group.includes('研发组')) {
        // 测试用账户无权访问改页面，退回
        showNotification('非研发组账户无法访问', 'warning');
    } else {
        window.location.href = "../submit.html";
    }
});
document.getElementById("query-card").addEventListener("click", function () {
    // 跳转到数据查询系统
    if (!group.includes('研发组')) {
        // 测试用账户无权访问改页面，退回
        showNotification('非研发组账户无法访问', 'warning');
    } else {
        window.location.href = "../query.html";
    }
});
document.getElementById("method-card").addEventListener("click", function () {
    // 跳转到测试项目清单系统
    window.location.href = "../method.html";
});

manageCard.addEventListener('click', () => {
    if (group.includes('管理员')) {
        window.location.href = "../manage.html";
    } else {
        showNotification('非管理员账户无法访问', 'warning');
        return;
    }      
});

document.getElementById("audio-analyzer-card").addEventListener("click", function () {
    // 跳转到音频分析系统
    window.location.href = "../audio-spectrum-analyzer.html";
});
document.getElementById("scihub-card").addEventListener("click", function () {
    // 跳转到sci-hub代理访问    
    window.location.href = "../scihub-agency.html";
});

// 获取tooltip元素和所有触发元素
const tooltip = document.getElementById('customTooltip');
const triggers = document.querySelectorAll('.tooltip-trigger');

// 为每个触发元素添加事件监听
triggers.forEach(trigger => {
    // 鼠标进入时显示tooltip
    trigger.addEventListener('mouseenter', (e) => {
        // 设置tooltip内容
        tooltip.textContent = trigger.getAttribute('data-tooltip');
        // 添加激活类以显示tooltip
        tooltip.classList.add('active');
    });
    
    // 鼠标离开时隐藏tooltip
    trigger.addEventListener('mouseleave', () => {
        // 移除激活类以隐藏tooltip
        tooltip.classList.remove('active');
    });
});