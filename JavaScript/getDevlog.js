// 获取文件列表
const username = localStorage.getItem('username')
const logContent = document.getElementById('log-content')

let index = 0

async function fetchDevlog(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getLog', {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    })

    const result = await response.json();
    return result.log
}

// 更新表单：输入username
async function updateDevLog(username) {
    const log = await fetchDevlog(username) 
    fillLogContent(log)
};

function fillLogContent(log) {
    logContent.innerHTML = ''
    let developing = 'hidden'
    let developText = '发布日期'
    let calendarIcon = 'fa-calendar-check'
    const today = new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).split('/').join('-');
    log.forEach(logItem => {
        developing = 'hidden'
        developText = '发布日期'
        calendarIcon = 'fa-calendar-check'
        if (logItem.date + 1 > today) {
            developing = 'show'
            developText = '计划定版日期'
            calendarIcon = 'fa-calendar'
        }

        const logItemDiv = document.createElement('div')
        const icon = logItem.icon
        
        logItemDiv.classList.add('bg-gray-50', 'version-panel', 'mb-4')
        logItemDiv.innerHTML = `
        <div class="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
            onclick="togglePanel('panel-${index}')">
            <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <i class="${logItem.icon}"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">版本:
                        <span
                            class="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/30">
                            <span class="${developing}"><i class="fa fa-cog fa-spin mr-1"></i>开发中</span>
                            ${logItem.name}</span>                    
                    </h3>
                    <p class="text-gray-500 text-sm"><i class="fa ${calendarIcon} mr-1"></i>${developText}: ${logItem.date}</p>
                </div>
            </div>
            <div class="flex items-center">
                <span
                    class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-4">${logItem.description}</span>
                <i class="fa fa-chevron-down panel-toggle" id="toggle-${index}"></i>
            </div>
        </div>
        <div class="panel-content rounded-lg border border-gray-200" id="panel-${index}">
            <div class="px-6 pb-1">
                <div class="mb-1">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <ul class="logTable space-y-2 text-sm">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
                `
        const logTable = logItemDiv.querySelector('.logTable')
        logTable.innerHTML = ''
        if (logItem.frontDesign !== undefined && logItem.frontDesign.length > 0) {
            logItem.frontDesign.forEach(fdItem => {
                const row = document.createElement('li')
                row.classList.add('flex', 'items-start')
                row.innerHTML = `
                <span
                    class="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mr-2 mt-0.5">前端设计</span>
                <span>${fdItem}</span>
                `
                logTable.appendChild(row)
            });
        };
        if (logItem.newFunction !== undefined && logItem.newFunction.length > 0) {
            logItem.newFunction.forEach(nfItem => {
                const row = document.createElement('li')
                row.classList.add('flex', 'items-start')
                row.innerHTML = `
                <span
                    class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2 mt-0.5">新增功能</span>
                <span>${nfItem}</span>
                `
                logTable.appendChild(row)
            });
        };
        if (logItem.dataTest !== undefined && logItem.dataTest.length > 0) {
            logItem.dataTest.forEach(dtItem => {
                const row = document.createElement('li')
                row.classList.add('flex', 'items-start')
                row.innerHTML = `
                <span
                    class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full mr-2 mt-0.5">数据测试</span>
                <span>${dtItem}</span>
                `
                logTable.appendChild(row)
            });
        };
        if (logItem.bugFix !== undefined && logItem.bugFix.length > 0) {
            logItem.bugFix.forEach(bfItem => {
                const row = document.createElement('li')
                row.classList.add('flex', 'items-start')
                row.innerHTML = `
                <span
                    class="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full mr-2 mt-0.5">BUG修复</span>
                <span>${bfItem}</span>
                `
                logTable.appendChild(row)
            });
        };
        if (logItem.nextPlan !== undefined && logItem.nextPlan.length > 0) {
            // 添加横线
            logTable.innerHTML += '<hr class="my-4 border-gray-200" />'
            logItem.nextPlan.forEach(npItem => {
                const row = document.createElement('li')
                row.classList.add('flex', 'items-start')
                let complete = false
                if (typeof npItem === 'object') {
                    complete = npItem.completed
                    npItem = npItem.content
                }
                const completeSpan = complete ? '已完成' : '待完成';
                const completeColor = complete ? 'bg-green-300' : 'bg-gray-300';
                    
                row.innerHTML = `
                <span class="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-full mr-2 mt-0.5">未来计划</span>
                <span class="${completeColor} px-2 py-0.5 text-xs font-medium border border-gray-500 rounded-full mr-1">${completeSpan}</span>
                <span>${npItem}</span>
                `
                logTable.appendChild(row)
            });
        };
        // logItemDiv.classList.add('overflow-y-auto')
        if (index === 0) {
            const panel = logItemDiv.lastElementChild
            const toggleIcon = logItemDiv.querySelector('.panel-toggle')
            panel.style.maxHeight = '800px'
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
        }
        index++
        logContent.appendChild(logItemDiv)
    });
};

updateDevLog(username)