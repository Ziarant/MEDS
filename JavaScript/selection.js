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

document.getElementById("workflow-card").addEventListener("click", function () {
    // 跳转到工作流程记录系统
    if (group.includes('研发组')) {
        window.location.href = "../workflow.html";
    } else {
        showNotification('非研发组账户无法访问', 'warning');
        return;
    }  
});
document.getElementById("standard-card").addEventListener("click", function () {
    // 跳转到标准文件系统
    window.location.href = "../standard.html";
});
document.getElementById("audio-analyzer-card").addEventListener("click", function () {
    // 跳转到音频分析系统
    window.location.href = "../audio-spectrum-analyzer.html";
});
document.getElementById("scihub-card").addEventListener("click", function () {
    // 跳转到sci-hub代理访问    
    window.location.href = "../scihub-agency.html";
});
document.getElementById("application-card").addEventListener("click", function () {
    // 跳转到项目申报指南系统
    window.location.href = "../application.html";
});
document.getElementById("product-card").addEventListener("click", function () {
    // 跳转到产品信息管理系统
    window.location.href = "../product.html";
});
document.getElementById("literature-card").addEventListener("click", function () {
    // 跳转到文献管理系统
    window.location.href = "../literature.html";
});
document.getElementById("research-card").addEventListener("click", function () {
    // 跳转到行业调研页面
    window.location.href = "../research.html";
});
