const username = localStorage.getItem('username')

// 统计概览模块：
const totalTasks = document.getElementById('totalTasks');
const myTasks = document.getElementById('myTasks');
const completedTasks = document.getElementById('completedTasks');
const myCompletedTasks = document.getElementById('myCompletedTasks');
const inProgressTasks = document.getElementById('inProgressTasks');
const myInProgressTasks = document.getElementById('myInProgressTasks');
const pausedTasks = document.getElementById('pausedTasks');
const myPausedTasks = document.getElementById('myPausedTasks');
const terminatedTasks = document.getElementById('terminatedTasks');
const myTerminatedTasks = document.getElementById('myTerminatedTasks');
const overdueTasks = document.getElementById('overdueTasks');
const myOverdueTasks = document.getElementById('myOverdueTasks');

// 周显示轴
const weekAxis = document.getElementById('week-axis');
const selectorIndicator = document.getElementById('selector-indicator');
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');
const currentWeekDisplay = document.getElementById('current-week-display');
const currentWeekSpan = document.getElementById('current-week');

// DOM元素
const addDataButton = document.getElementById('add-data-button')
const workCardsContains = document.getElementById('workCards-contains');

// 模态框元素
const addDataModal = document.getElementById('add-data-modal')
const dataModalTitle = document.getElementById('data-modal-title');
const cancelModalBtn = document.getElementById('cancel-modal-button');
const nameSelectModal = document.getElementById('name-select-modal');
const primaryTaskInput = document.getElementById('task-select-modal');
const secondaryTaskInput = document.getElementById('project-select-modal');
const titleInput = document.getElementById('title-modal')
const workTypeTags = document.querySelectorAll('input[type="checkbox"][name="test-tags"]')
const memberTags = document.querySelectorAll('input[type="checkbox"][name="member-tags"]')
const contentInput = document.getElementById('editor-content');
const stateModal = document.getElementById('status-modal')
const dateModal = document.getElementById('date-modal')
const progressModal = document.getElementById('progress-modal')
const submitBtn = document.getElementById('submit-modal-button')
// 富文本编辑器
const editorModalDiv = document.getElementById('editor-modal-div');
const editor = document.getElementById('editor-modal');
const submitResult = document.getElementById('submitResult');


let isDragging = false;
let offsetX, offsetY;
let initialX, initialY;
let currentX = 0, currentY = 0;
let id = generateUniqueId()

addDataButton.addEventListener('click', () => {
    if (!isDragging) {
        dataModalTitle.textContent = `添加工作数据: 第${currentWeek}周`;
        addWorkData()
    } else {
        // 重置拖动状态
        isDragging = false;
    }
});

// 悬浮按钮长按-拖动位置
addDataButton.addEventListener('mousedown', function(e) {
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

// 鼠标移动事件 - 处理拖动
function handleMouseMove(e) {
    if (isDragging) {
        e.preventDefault();
        
        // 计算新位置
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;
        
        // 限制在视口范围内
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonWidth = addDataButton.offsetWidth;
        const buttonHeight = addDataButton.offsetHeight;
        
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
        addDataButton.style.top = `${currentY}px`
        addDataButton.style.left = `${currentX}px`
    }
}

// 鼠标松开事件 - 结束拖动
function handleMouseUp(e) {
    // 移除样式类
    addDataButton.classList.remove('scale-110', 'opacity-90');
    
    // 添加释放动画
    addDataButton.classList.add('transition-transform', 'duration-200');
    setTimeout(() => {
        addDataButton.classList.remove('transition-transform', 'duration-200');
    }, 200);
    
    // 移除临时事件监听器
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 如果只是点击而不是拖动，触发点击事件
    const movedDistance = Math.sqrt(
        Math.pow(currentX - initialX, 2) + Math.pow(currentY - initialY, 2)
    );
    
    if (movedDistance < 5) {
        addDataButton.click();
    };
}

// 关闭模态框：
cancelModalBtn.addEventListener('click', () => modelClose());

function modelClose() {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = ''; // 恢复背景滚动
}

// 窗口大小调整时重新计算位置
window.addEventListener('resize', function() {
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

// 当前周计算：
function getWeekOfYear(date = new Date()) {
    // 复制日期对象以避免修改原对象
    const currentDate = new Date(date.getTime());

    // 设置日期为当前周的周日（ISO周从周一开始，但这里调整为周日作为一周的结束）
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()) % 7);

    // 获取当年的第一天
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // 如果当年第一天是周日，将其视为第0周的结束
    startOfYear.setDate(startOfYear.getDate() + (7 - startOfYear.getDay()) % 7);

    // 计算两个日期之间的天数差，然后除以7得到周数
    const daysDiff = (currentDate - startOfYear) / (1000 * 60 * 60 * 24);
    const weekNumber = Math.ceil(daysDiff / 7) + 1;

    return weekNumber;
}
const week_of_today = getWeekOfYear()
let currentWeek = week_of_today
currentWeekSpan.textContent = currentWeek
let workCount = 0, completedCount = 0, in_progressCount = 0, pauseCount = 0, abolishCount = 0, overdueCount = 0;
let myWorkCount = 0, myCompletedCount = 0, myInProgressCount = 0, myPauseCount = 0, myAbolishCount = 0, myOverdueCount = 0;

// 在周显示器上显示(1~52循环)；
for (let i = -4; i <= 4; i++) {
    let week = (week_of_today + i + 52) % 52;
    week = week === 0 ? 52 : week;
    const weekElement = document.createElement('div');
    weekElement.className = 'flex-start translate-x-1/2 w-10 h-10 z-10 shadow-md flex items-center justify-center rounded-full cursor-pointer transition-all duration-200';
    weekElement.id = `weekElement-${week}`;
    if (i === 0) {
        weekElement.classList.add('bg-primary', 'shadow-xl');
        weekElement.classList.add('border', 'border-gray-600', '-translate-y-1/3');
    } else if (i > 0) {
        weekElement.classList.add('bg-gray-200', 'shadow-lg');
    } else {
        weekElement.classList.add('bg-secondary', 'shadow-lg');
    }

    weekElement.innerHTML = `
        <div>
            <p class="text-sm">${week}</p>
        </div>
        <div id="weekItemElement-${week}"
            class="hidden w-1 h-1 bg-black shadow-md flex items-center justify-center text-lg rounded-full">
        </div>
    `
    weekAxis.appendChild(weekElement);

    // 点击事件
    weekElement.addEventListener('click', () => {
        const weekElements = document.querySelectorAll('[id^="weekElement-"]');
        weekElements.forEach(element => {
            element.classList.remove('border', 'border-gray-600', '-translate-y-1/3', 'shadow-lg');
        });
        currentWeek = week;
        currentWeekSpan.textContent = week;
        weekElement.classList.add('border', 'border-gray-600', '-translate-y-1/3'), 'shadow-xl'

        // 对workList进行周筛选
        generateWorkFlow(workList)
    })
}

workList = getWorkList(username)
workList.then(data => {
    generateWorkFlow(data)
    totalTasks.textContent = workCount;
    myTasks.textContent = myWorkCount;
})

function generateWorkFlow(data, sortBy = 'primaryTask', sortOrder = 'asc') {
    // data.sort((a, b) => a.id.localeCompare(b.id));
    // 排序逻辑：根据不同维度处理排序
    const sortedData = [...data].sort((a, b) => {
        let valueA, valueB;

        // 根据排序维度获取对应值（统一转为字符串便于比较）
        switch (sortBy) {
            case 'primaryTask': // 按主要任务排序
                valueA = a.primaryTask.toLowerCase();
                valueB = b.primaryTask.toLowerCase();
                break;
            case 'secondaryTask': // 按二级任务排序
                valueA = a.secondaryTask.toLowerCase();
                valueB = b.secondaryTask.toLowerCase();
                break;
            case 'members': // 按人员排序（假设人员格式为“姓名1,姓名2”）
                const nameA = (a.members.split(',')[0] || '').trim();
                const nameB = (b.members.split(',')[0] || '').trim();
                break;
            default: // 默认按ID排序
                valueA = a.id;
                valueB = b.id;
        }

        // 比较并处理升序/降序
        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0; // 相等时保持原顺序
    });

    workList = sortedData;
    workCardsContains.innerHTML = ``;
    completedCount = 0, in_progressCount = 0, pauseCount = 0, abolishCount = 0, overdueCount = 0;
    myCompletedCount = 0, myInProgressCount = 0, myPauseCount = 0, myAbolishCount = 0, myOverdueCount = 0;
    workList.forEach(work => {
        workCount++
        const workCard = document.createElement('div');
        workCard.classList.add('work-card');
        workCard.id = `${work.id}`;
        // let state = "已完成", stateColor = "bg-green-200", stateIcon = "fa-check-circle";
        let week = work.week
        const endWeek = week.slice(-1)

        week.forEach(w => {
            const weekItemElement = document.getElementById(`weekItemElement-${w}`);
            if (weekItemElement) {
                weekItemElement.classList.remove('hidden');
            }
        })

        let stateInfo = {};
        let setWeekColor = 'bg-gray-200'
        switch (work.state) {
            case 'completed':
                stateInfo = handleCompleted(work, username);
                // setWeekColor = 'bg-green-200';
                break;
            case 'in_progress':
                stateInfo = handleInProgress(work, username, week_of_today, endWeek);
                // setWeekColor = 'bg-blue-200';
                break;
            case 'pause':
                stateInfo = handlePause(work, username);
                // setWeekColor = 'bg-yellow-200';
                break;
            case 'abolish':
                stateInfo = handleAbolish(work, username);
                // setWeekColor = 'bg-gray-200';
                break;
        }

        // 解构赋值更新状态变量
        const { state, stateColor, stateIcon } = stateInfo;

        if (week.includes(currentWeek)) {
            if (week.length > 2) {
                week = `${week.slice(0, 1)} ~ ${week.slice(-1)}`
            }

            let progress = ''
            if ((work.progress !== undefined) && (work.progress !== "")) {
                progress = `<span class="inline-block ${stateColor} text-xs px-2 py-1 border border-gray-400 rounded">
                进度：${work.progress}
                </span>`
            }

            // 显示当前周的describe
            let describe = work.describe
            let setWeek = currentWeek
            if (describe === null ) { describe = '暂无描述' }
            if (typeof describe === 'object') {
                const proto = Object.getPrototypeOf(describe);
                if (proto === Object.prototype || proto === null) {
                    const keys = Object.keys(describe);
                    setWeek = keys.includes(`${currentWeek}`) ? currentWeek : keys[keys.length - 1];
                    describe = describe[`${setWeek}`];
                    if (work.state === 'in_progress') {
                        setWeekColor = (week_of_today > setWeek) ? 'bg-red-100' : setWeekColor;
                    }
                }
            }
            workCard.innerHTML = `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow transition-custom standard-card cursor-pointer flex flex-col h-full"
                data-id="${work.id}">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-1">
                            <div>
                                <p class="text-gray-500 text-sm"><i
                                        class="fa fa-folder-o mr-1 text-primary"></i>${work.primaryTask}</p>
                                <h3 class="text-lg font-semibold mb-1">${work.secondaryTask} | ${work.title}</h4>
                                <h4 class="text-sm font-semibold mb-1">
                                    <span class="inline-block bg-white text-xs px-2 py-1 border border-gray-400 rounded-lg">${work.workTypes}</span>
                                </h4>
                            </div>
                            <div class="flex space-x-2 justfy-center">
                                <span
                                    class="inline-block bg-primary/60 text-xs px-2 py-1 border border-gray-400 rounded-lg">第${week}周</span>
                            </div>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-lg mb-1">
                            <p class="text-gray-600 text-sm mb-4 line-clamp-3"><span class=${setWeekColor}>第${setWeek}周:</span>
                            ${describe}</p>
                        </div>
                        <div class="flex justify-between items-center text-sm mt-auto pt-3 border-t border-gray-200">
                            <div class="flex space-x-2 justfy-center">
                                <span
                                    class="inline-block ${stateColor} text-xs px-2 py-1 border border-gray-400 rounded">
                                    <i class="fa ${stateIcon}"></i>
                                    ${state}</span>
                                ${progress}
                                <span
                                    class="inline-block bg-white text-xs px-2 py-1 border border-gray-400 rounded-lg">
                                    <i class="fa fa-user-o mr-1 text-primary"></i>${work.members}</span>
                            </div>
                            <button class="text-gray-400 hover:text-primary transition-custom">
                                <span>编辑</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            workCardsContains.appendChild(workCard);
            workCard.addEventListener('click', () => {
                const id = workCard.id;
                workItem = workList.find(work => work.id === id);
                addWorkData(workItem)
            });
        }

    });
}

// 处理完成状态
function handleCompleted(work, username) {
    completedCount++;
    if (work.members.includes(username)) {
        myCompletedCount++;
    }
    completedTasks.textContent = completedCount;
    myCompletedTasks.textContent = myCompletedCount;
    return { 
        state: '已完成',
        stateColor: 'bg-green-200',
        stateIcon: 'fa-check-circle'
    }; 
}

// 处理进行中状态
function handleInProgress(work, username, weekOfToday, endWeek) {
    if (weekOfToday > endWeek) {
       overdueCount++;
        if (work.members.includes(username)) {
            myOverdueCount++;
        }
        overdueTasks.textContent = overdueCount;
        myOverdueTasks.textContent = myOverdueCount;
        return {
            state: "已逾期",
            stateColor: "bg-red-200",
            stateIcon: "fa-exclamation-circle"
        };
    } else {
        in_progressCount++;
        if (work.members.includes(username)) {
            myInProgressCount++;
        }
        inProgressTasks.textContent = in_progressCount;
        myInProgressTasks.textContent = myInProgressCount;
        return {
            state: "进行中",
            stateColor: "bg-blue-200",
            stateIcon: "fa-spinner"
        };
    }
}

// 处理暂停状态
function handlePause(work, username) {
    pauseCount++;
    if (work.members.includes(username)) {
        myPauseCount++;
    }
    pausedTasks.textContent = pauseCount;
    myPausedTasks.textContent = myPauseCount;
    return {
        state: "已暂停",
        stateColor: "bg-gray-200",
        stateIcon: "fa-pause-circle"
    };
}

// 处理终止状态
function handleAbolish(work, username) {
    abolishCount++;
    if (work.members.includes(username)) {
        myAbolishCount++;
    }
    terminatedTasks.textContent = abolishCount;
    myTerminatedTasks.textContent = myAbolishCount;
    return {
        state: "已终止",
        stateColor: "bg-gray-200",
        stateIcon: "fa-times-circle"
    };
}

// id生成：当前时间戳-工号与随机数组合
function generateUniqueId() {
    const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
    const userID = localStorage.getItem('userID');
    const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
    return `${timestamp}-${userID}-${random}`;
}

function addWorkData(item) {
    if (!item) {

    }
    addDataModal.classList.remove('opacity-0', 'pointer-events-none');
    addDataModal.classList.add('opacity-100', 'pointer-events-auto');

    // 背景禁止滚动
    document.body.style.overflow = 'hidden';

    // //TODO: 初始化
    currentWeekSpan.textContent = currentWeek;
    // document.getElementById('editor-date-modal').textContent = currentWeek;
    // 默认打勾本人：
    const labels = nameSelectModal.querySelectorAll('label')
    labels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]')
        const name = label.querySelector('span').textContent
        if (name === username) {
            checkbox.checked = true
        }
    })
    dateModal.value = currentWeek
    // 若输入item, 按照item信息初始化
    id = generateUniqueId()
    primaryTaskInput.removeAttribute(`disabled`)
    secondaryTaskInput.removeAttribute(`disabled`)
    titleInput.removeAttribute(`disabled`)
    workTypeTags.forEach(tag => {
        tag.removeAttribute(`disabled`)
    });
    memberTags.forEach(tag => {
        tag.removeAttribute(`disabled`)
    });
    dateModal.removeAttribute(`disabled`)
    submitBtn.innerHTML = '<i class="fa fa-paper-plane mr-2"></i>提交';
    if (item) {
        initModal(item)
        id = item.id
    }
}

// 初始化
function initModal(item) {
    // 获取数据
    dataModalTitle.textContent = `${item.secondaryTask} | ${item.title}`
    primaryTaskInput.value = item.primaryTask;
    secondaryTaskInput.value = item.secondaryTask;
    titleInput.value = item.title;
    primaryTaskInput.setAttribute(`disabled`, true)
    secondaryTaskInput.setAttribute(`disabled`, true)
    titleInput.setAttribute(`disabled`, true)
    workTypeTags.forEach(tag => {
        if (item.workTypes.includes(tag.value)) {
            tag.checked = true;
        }
        tag.setAttribute(`disabled`, true)
    });
    memberTags.forEach(tag => {
        if (item.members.includes(tag.value)) {
            tag.checked = true;
        } else {
            tag.checked = false;
        }
        tag.setAttribute(`disabled`, true)
    });
    stateModal.value = item.state;
    if (item.progress === undefined) {
        progressModal.value = '';
    } else {
        progressModal.value = item.progress;
    }
    dateModal.value = item.week;
    dateModal.setAttribute(`disabled`, true)
    submitBtn.innerHTML = '<i class="fa fa-paper-plane mr-2"></i>更新';

    // 模态框：
    editorModalDiv.innerHTML = '';
    item.week.forEach(w => {
        describe = item.describe[w]
        const weekItemElement = document.createElement('span')
        const editorItemElement = document.createElement('div')
        weekItemElement.classList.add('col-span-1', 'w-8', 'h-8', 'bg-primary/50', 'items-center', 'text-center', 'justify-center', 'border', 'border-gray-200', 'rounded-full')
        weekItemElement.textContent = w
        editorItemElement.classList.add('col-span-10', 'block', 'min-h-[80px]', 'border', 'border-gray-300', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-base', 'border-gray-300', 'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm', 'rounded-md')
        editorItemElement.id = `${item.id}-${w}`
        editorItemElement.textContent = describe
        if (w === week_of_today) { 
            editorItemElement.setAttribute('contenteditable', true)
            editorItemElement.classList.add('border-blue-300')
        } else {
            editorItemElement.classList.add('bg-gray-100')
        }
        editorModalDiv.appendChild(weekItemElement)
        editorModalDiv.appendChild(editorItemElement)
    })
}

// 编辑器内容变化时同步
editor.addEventListener('input', function() {
    syncEditorContent();
    // updateButtonStates();
});

// 同步编辑器内容到隐藏输入框
function syncEditorContent() {
    contentInput.value = editor.innerHTML;
}

// 将字符串数字转换为数值类型并返回数组
function extractNumbers(str) {
    // 使用正则表达式匹配所有数字（整数）
    const numberRegex = /\d+/g;
    
    // 匹配所有符合规则的数字字符串
    const numberStrings = str.match(numberRegex);
    
    // 如果没有匹配到数字，返回空数组
    if (!numberStrings) {
        return [];
    }
    // 转换为数字并过滤出0~52之间的值
    return numberStrings
        .map(Number)
        .filter(num => num >= 0 && num <= 52);
}

function extractTextFromHtml(html) {
  // 创建DOM解析器
  const parser = new DOMParser();
  // 解析HTML字符串为文档对象
  const doc = parser.parseFromString(html, 'text/html');
  
  // 获取文本内容（textContent会忽略样式和脚本，只返回文本）
  let text = doc.body.textContent || '';
  
  // 处理多余的空白字符（换行、制表符等转为单个空格）
  return text.replace(/\s+/g, ' ').trim();
}

submitBtn.addEventListener('click', () => submitWorkItem(id))
function submitWorkItem(id) {
    // 提交数据：
    const primaryTask = primaryTaskInput.value;
    const secondaryTask = secondaryTaskInput.value;
    const title = titleInput.value;
    const workTypes = Array.from(workTypeTags).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value).join(', ');
    const members = Array.from(memberTags).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value).join(', ');
    const content = extractTextFromHtml(contentInput.value);
    const state = stateModal.value;
    const weekData = extractNumbers(dateModal.value)
    const progressData = progressModal.value
    const uploadData = new Date().toLocaleString();

    // 检查必填项是否为空：
    // if(primaryTask === '' || secondaryTask === '' || workTypes === '' || members === '' || content === '' || state === '' || weekData === '') {
    //     showNotification('数据填写不完整', 'error');
    //     return
    // }

    // 上传数据：
    const workItem = {
        id: id,
        date: uploadData,
        primaryTask: primaryTask,
        secondaryTask: secondaryTask,
        title: title,
        workTypes: workTypes,
        members: members,
        describe: {
            [currentWeek] : content,
        },
        state: state,
        week: weekData,
        progress: progressData,
    }
    uploadWorkItem(workItem)
    modelClose()
}

