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
const taskContainers = document.querySelectorAll('.task-container')
const sortSelect = document.getElementById('sort-select');
const exportBtn = document.getElementById('export-button');
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
const stateModal = document.getElementById('status-modal')
const dateModal = document.getElementById('date-modal')
const progressModal = document.getElementById('progress-modal')
const createBtn = document.getElementById('create-modal-button')
const submitBtn = document.getElementById('submit-modal-button')

// 富文本编辑器
const editorModalDiv = document.getElementById('editor-modal-div');
const editor = document.getElementById('editor-modal');
const submitResult = document.getElementById('submitResult');

// 筛选过滤
const toggleBtn = document.getElementById('toggle-btn');
const taskSelect = document.getElementById('task-select');
const projectSelect = document.getElementById('project-select');
const statusSelect = document.getElementById('status-select');
const workTypeFilter = document.querySelectorAll('input[name="worktype-filter"]');
let memberFilter = document.querySelectorAll('input[name="member-filter"]');

let id = generateUniqueId(), precedingTaskId = '';

function addDataButtonClick() {
    dataModalTitle.textContent = `添加工作数据: 第${currentWeek}周`;
    addWorkData()
}


// 导出本周数据：
exportBtn.addEventListener('click', () => {
    if (currentData.length !== 0) {
        // 处理数据：
         const groupedData = currentData.reduce((acc, item) => {
            const primary = item.primaryTask || '未分类主要任务';
            const secondary = item.secondaryTask || '未分类次要任务';

            // 过滤无描述的项目：
            if(item.describe[`${currentWeek}`] === '' || item.describe[`${currentWeek}`] === undefined || item.describe[`${currentWeek}`] === 'undefined') {
                return acc
            }

            if (!acc[primary]) {
                acc[primary] = {
                    primaryTask: primary,
                    subTasks: {} // 用于存储secondaryTask分组
                };
            }
            
            if (!acc[primary].subTasks[secondary]) {
                acc[primary].subTasks[secondary] = {
                    secondaryTask: secondary,
                    describe: [],
                };
            }

            // 收集当前条目的数据到对应的分组中
            let currentDescribe = '', state = '进行中', week = item.week;
            if (item.state === 'completed') { state = '已完成' }
            else if (item.state === 'abolish') { state = '已终止' }
            member = item.members.toString()
            if (week.length > 2) {
                week = `${week.slice(0, 1)}-${week.slice(-1)}`
            }
            
            if (Object.keys(item.describe).includes(`${currentWeek}`)) {
                currentDescribe = item.describe[`${currentWeek}`]
                const describe = `${currentDescribe} (${member}:第${week}周,${state})`
                acc[primary].subTasks[secondary].describe.push(describe);
            } else {
                currentDescribe = '';
            }
            
            return acc;
        }, {});
        
        // 2. 转换为数组格式并展平结构，便于Excel导出
        const processedData = [];
        Object.values(groupedData).forEach(primaryGroup => {
            Object.values(primaryGroup.subTasks).forEach(secondaryGroup => {
                processedData.push({
                    主要任务: primaryGroup.primaryTask,
                    项目归属: secondaryGroup.secondaryTask,
                    完成情况: secondaryGroup.describe.filter(Boolean)
                                                    .map((desc, index) => `${index + 1}. ${desc}`) // 添加编号（从1开始）
                                                    .join('\n'),
                });
            });
        });
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        // 处理格式：单元合并、更改字体，设置自动换行
        const range = XLSX.utils.decode_range(worksheet['!ref']);
         for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {
                const cellAddress = XLSX.utils.encode_cell({ r, c });
                
                // 如果单元格存在
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        alignment: {
                            wrapText: true, // 自动换行
                        }
                    }
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Data');
        XLSX.writeFile(workbook, `第${currentWeek}周工作表.xlsx`);
    }
});

// 关闭模态框：
cancelModalBtn.addEventListener('click', () => modelClose());

function modelClose() {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = ''; // 恢复背景滚动
}

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

// 获取一周(1 ~ 52)的起止日：
function getDateOfWeek(week, year = 2025) {
    const firstDayOfYear = new Date(year, 0, 1);
    // 计算当年第一天是星期几 (0是星期日，1是星期一，...，6是星期六)
    const dayOfWeek = firstDayOfYear.getDay() || 7; // 转换为1-7，1是星期一，7是星期日
    
    // 计算第一周的第一天, 如果是星期一，则第一周从当天开始, 否则，回退到上一个星期一
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() - (dayOfWeek - 1));
    
    // 计算目标周的第一天（星期一）
    const startDate = new Date(firstMonday);
    startDate.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    // 计算目标周的最后一天（星期日）
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    // 格式化日期为 YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    return {
        start: formatDate(startDate),
        end: formatDate(endDate)
    };
}

// 筛选栏隐藏显示切换
toggleBtn.addEventListener('click', () => {

    const sidebar = document.getElementById('sidebar');
    const sidebarTitle = document.getElementById('sidebar-title');
    const workCardsContainer = document.getElementById('workCards-container');
    const filterPanel = document.getElementById('filter-panel');

    if (sidebar.classList.contains('md:w-1/8')) {
        // 收起 -> 展开侧边栏
        toggleBtn.innerHTML = '<i class="fa fa-angle-double-left text-xl text-gray-600" title="收起"></i>';
        sidebarTitle.classList.remove('hidden');
        filterPanel.classList.remove('hidden');
        sidebar.classList.remove('md:w-1/8', 'lg:w-1/10');
        sidebar.classList.add('md:w-3/8', 'lg:w-3/10');
        workCardsContainer.classList.remove('md:w-7/8', 'lg:w-9/10');
        workCardsContainer.classList.add('md:w-5/8', 'lg:w-7/10');
    } else {
        // 展开 -> 收起侧边栏
        toggleBtn.innerHTML = '<i class="fa fa-angle-double-right text-xl text-gray-600" title="展开"></i>';
        sidebarTitle.classList.add('hidden');
        filterPanel.classList.add('hidden');
        sidebar.classList.remove('md:w-3/8', 'lg:w-3/10');
        sidebar.classList.add('md:w-1/8', 'lg:w-1/10');
        workCardsContainer.classList.remove('md:w-5/8', 'lg:w-7/10');
        workCardsContainer.classList.add('md:w-7/8', 'lg:w-9/10');
    }
})

// 类型选择：
document.getElementById('worktype-select-all').addEventListener('click', () => {
    // 获取所有工作类型复选框
    const workTypeCheckboxes = document.querySelectorAll('input[name="worktype-filter"]');
    // 设置所有复选框为选中状态
    workTypeCheckboxes.forEach(input => {
        input.checked = true;
    });
});
document.getElementById('worktype-select-none').addEventListener('click', () => {
    // 获取所有工作类型复选框
    const workTypeCheckboxes = document.querySelectorAll('input[name="worktype-filter"]');
    // 设置所有复选框为未选中状态
    workTypeCheckboxes.forEach(input => {
        input.checked = false;
    });
});
document.getElementById('worktype-select-invert').addEventListener('click', () => {
    // 获取所有工作类型复选框
    const workTypeCheckboxes = document.querySelectorAll('input[name="worktype-filter"]');
    // 反转每个复选框的选中状态
    workTypeCheckboxes.forEach(input => {
        input.checked = !input.checked;
    });
});

// 人员选择：
document.getElementById('member-select-all').addEventListener('click', () => {
    // 获取所有人员复选框
    const memberCheckboxes = document.querySelectorAll('input[name="member-filter"]');
    // 设置所有复选框为选中状态
    memberCheckboxes.forEach(input => {
        input.checked = true;
    });
});

document.getElementById('member-select-none').addEventListener('click', () => {
    // 获取所有人员复选框
    const memberCheckboxes = document.querySelectorAll('input[name="member-filter"]');
    // 设置所有复选框为未选中状态
    memberCheckboxes.forEach(input => {
        input.checked = false;
    });
});

document.getElementById('member-select-invert').addEventListener('click', () => {
    // 获取所有人员复选框
    const memberCheckboxes = document.querySelectorAll('input[name="member-filter"]');
    // 反转每个复选框的选中状态
    memberCheckboxes.forEach(input => {
        input.checked = !input.checked;
    });
});

// 过滤按钮
document.getElementById('apply-filter-button').addEventListener('click', () => {
    // 获取当前筛选条件
    filterWorkFlow();
    // 重新渲染工作流
    renderWorkFlow();
});

// 重置按钮
document.getElementById('reset-filter-button').addEventListener('click', () => {
    // 重置所有筛选条件
    taskSelect.value = '';
    projectSelect.value = '';
    statusSelect.value = '';
    workTypeFilter.forEach(input => input.checked = true);
    memberFilter.forEach(input => input.checked = true);
    // 重新过滤和渲染工作流
    filterWorkFlow();
    renderWorkFlow();
});

const week_of_today = getWeekOfYear()
let currentWeek = week_of_today, centerWeek = week_of_today;
currentWeekSpan.textContent = currentWeek
let workCount = 0, completedCount = 0, in_progressCount = 0, pauseCount = 0, abolishCount = 0, overdueCount = 0;
let myWorkCount = 0, myCompletedCount = 0, myInProgressCount = 0, myPauseCount = 0, myAbolishCount = 0, myOverdueCount = 0;

// 在周显示器上显示(1~52循环)；
// 周元素
function generateWeekElements(week) {
    const weekElement = document.createElement('div');
    weekElement.className = 'flex-start translate-x-1/2 w-10 h-10 z-10 shadow-md flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ease-out';
    weekElement.id = `weekElement-${week}`;
    const weekDate = getDateOfWeek(week)
    weekElement.title = `${weekDate.start}(周一)\n\t至\n${weekDate.end}(周日)`;
    if (week === week_of_today) {
        weekElement.classList.add('bg-orange-200', 'shadow-xl');
    } else if (week > week_of_today) {
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
    weekElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    return weekElement;
}

// 生成周显示轴
function generateWeekAxis(centerWeek) {
    weekAxis.innerHTML = ``;
    for (let i = -4; i <= 4; i++) {
        let week = (centerWeek + i + 52) % 52;
        week = week === 0 ? 52 : week;
        weekElement = generateWeekElements(week);

        // 标记centerWeek
        if (i === 0) {
            weekElement.classList.add('border', 'border-gray-600', '-translate-y-1/3', 'shadow-xl');
        }
        weekAxis.appendChild(weekElement);

        // 点击事件
        weekElement.addEventListener('click', () => {
            const weekElements = document.querySelectorAll('[id^="weekElement-"]');
            // 平移周数
            numWeek = week - centerWeek;
            const weight = weekAxis.offsetWidth;
            // 清除之前的选中状态
            weekElements.forEach(element => {
                element.classList.remove('border', 'border-gray-600', '-translate-y-1/3', 'shadow-lg');
                element.style.transform = `translateY(0) translateX(${-numWeek * weight / 10}px)`;
            });

            // 设置当前选中状态
            currentWeek = week;
            currentWeekSpan.textContent = week;
            document.getElementById(`weekElement-${currentWeek}`).classList.add('border', 'border-gray-600', '-translate-y-1/3', 'shadow-xl')
            setTimeout(() => {
                generateWeekAxis(currentWeek)
                // 对workList进行周筛选
                const sortBy = sortSelect.value
                sortedData = sortWorkFlow(sortBy);
                renderWorkFlow();
            }, 200)
            
            
        });
    }
    return centerWeek;
}

centerWeek = generateWeekAxis(week_of_today);

scrollLeftBtn.addEventListener('click', () => {
    currentWeek --;
    document.getElementById(`weekElement-${currentWeek}`).click();
});

scrollRightBtn.addEventListener('click', () => {
    currentWeek ++;
    document.getElementById(`weekElement-${currentWeek}`).click();
});

sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    sortedData = sortWorkFlow(sortBy);
    filterWorkFlow();
    renderWorkFlow();
})

let sortedData, currentData = [];
function update() {
    currentData = [];
    workList = getWorkList(username)
    workList.then(data => {
        sortedData = [...data]; // 创建数据的副本以进行排序和过滤
        const sortBy = sortSelect.value
        sortedData = sortWorkFlow(sortBy);
        getUserCount();
        filterWorkFlow();
        renderWorkFlow();
        updateStatistics()
    })
}
update()

function sortWorkFlow(sortBy = 'primaryTask', sortOrder = 'asc') {
    // 排序逻辑：根据不同维度处理排序
    sortedData = sortedData.sort((a, b) => {
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
                valueA = a.members.toLowerCase();
                valueB = b.members.toLowerCase();
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
    return sortedData;
}

function getUserCount() {
    // 统计每个人的任务数
    let usersCount = {}
    sortedData.forEach(item => {
        const members = item.members.split(',')
        members.forEach(member => {
            if (Object.keys(usersCount).includes(member)) {
                usersCount[member] += 1
            } else {
                usersCount[member] = 1
            }
        })
    })
    const userSelect = document.getElementById('user-select')
    if (userSelect.children.length === 0) {
        Object.keys(usersCount).forEach(user => {
            const label = document.createElement('label');
            label.classList = 'flex items-center cursor-pointer';
            label.setAttribute('for', `member-${user}`)
            label.innerHTML = `
                <input type="checkbox" name="member-filter" value="${user}"
                    class="form-checkbox h-4 w-4 text-primary rounded" checked>
                <span class="ml-2 text-gray-600">${user}</span><sup class="text-gray-400 ml-1" id="count-${user}">${usersCount[user]}</sup>
            `
            label.setAttribute('for', `member-${user}`)
            label.id = `member-${user}`
            userSelect.appendChild(label)
        })
    } else {
        Object.keys(usersCount).forEach(user => {
            const userCountLable = document.getElementById(`count-${user}`);
            userCountLable.textContent = usersCount[user] || 0;
        })
    }
    
    memberFilter = document.querySelectorAll('input[name="member-filter"]');
}

function filterWorkFlow() {
    // 过滤数据
    currentData = sortedData.filter(work => {
        // 任务筛选
        const taskFilter = taskSelect.value ? work.primaryTask.includes(taskSelect.value) : true;
        // 项目筛选
        const projectFilter = projectSelect.value ? work.secondaryTask.includes(projectSelect.value) : true;
        // 状态筛选
        let statusFilter = statusSelect.value ? work.state === statusSelect.value : true;
        if(statusSelect.value === 'overdue') {
            if(work.state === 'in_progress') {
                const endWeek = work.week.slice(-1)
                statusFilter = endWeek < week_of_today
            } else {
                statusFilter = false
            }
        }
        // 工作类型筛选
        const workTypeFilterValue = Array.from(workTypeFilter).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        const workTypeMatch = workTypeFilterValue.length > 0 ? workTypeFilterValue.some(type => work.workTypes.includes(type)) : true;
        // 成员筛选
        const memberFilterValue = Array.from(memberFilter).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
        const memberMatch = memberFilterValue.length > 0 ? memberFilterValue.some(member => work.members.includes(member)) : true;

        return taskFilter && projectFilter && statusFilter && workTypeMatch && memberMatch;
    });
}

function renderWorkFlow() {
    // 清空工作卡片容器
    workList = currentData;
    workCardsContains.innerHTML = ``;
    workCount = 0, completedCount = 0, in_progressCount = 0, pauseCount = 0, abolishCount = 0, overdueCount = 0;
    myWorkCount = 0, myCompletedCount = 0, myInProgressCount = 0, myPauseCount = 0, myAbolishCount = 0, myOverdueCount = 0;
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
            workCard.title = describe;
            workCard.innerHTML = `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow transition-custom standard-card cursor-pointer flex flex-col h-full border border-gray-200 hover:border-primary transition-custom"
                data-id="${work.id}">
                    <div class="p-6 flex flex-col h-full">
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
                        <div class="bg-gray-50 rounded-lg mb-1">
                            <p class="text-gray-600 text-sm mb-2 line-clamp-3"><span class=${setWeekColor}>第${setWeek}周:</span>
                            ${describe}</p>
                        </div>
                        <div class="flex mt-auto justify-between items-center text-sm pt-3 border-t border-gray-200">
                            <div class="flex space-x-2 justfy-center">
                                <span
                                    class="inline-block ${stateColor} text-xs px-2 py-1 border border-gray-400 rounded">
                                    <i class="fa ${stateIcon}"></i>
                                    ${state}</span>
                                ${progress}
                                <span
                                    class="inline-block bg-white text-xs px-2 py-1 border border-gray-400 rounded-lg">
                                    <i class="fa fa-user mr-1 text-primary"></i>${work.members}</span>
                            </div>
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
        myWorkCount++;
    }
    updateStatistics()
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
            myWorkCount++;
        }
        updateStatistics()
        return {
            state: "已逾期",
            stateColor: "bg-red-200",
            stateIcon: "fa-exclamation-circle"
        };
    } else {
        in_progressCount++;
        if (work.members.includes(username)) {
            myInProgressCount++;
            myWorkCount++;
        }
        updateStatistics()
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
        myWorkCount++;
    }
    updateStatistics()
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
        myWorkCount++;
    }
    updateStatistics()
    return {
        state: "已终止",
        stateColor: "bg-gray-200",
        stateIcon: "fa-times-circle"
    };
}

// 更新统计显示
function updateStatistics() {
    totalTasks.textContent = workCount;
    myTasks.textContent = myWorkCount;
    // 更新其他统计数据...
    const completeRate = 100 * completedCount/workCount
    const inProgressRate = 100 * in_progressCount/workCount
    const pausedRate = 100 *  pauseCount/workCount
    const abolishRate = 100 * abolishCount/workCount
    const overdueRate = 100 * overdueCount/workCount

    completedTasks.textContent = completedCount;
    myCompletedTasks.textContent = myCompletedCount;
    pausedTasks.textContent = pauseCount;
    myPausedTasks.textContent = myPauseCount;
    terminatedTasks.textContent = abolishCount;
    myTerminatedTasks.textContent = myAbolishCount;
    inProgressTasks.textContent = in_progressCount;
    myInProgressTasks.textContent = myInProgressCount;
    overdueTasks.textContent = overdueCount;
    myOverdueTasks.textContent = myOverdueCount;

    document.getElementById('completedTasks-container').title = `已完成：${completeRate.toFixed(2)}%`
    document.getElementById('inProgressTasks-container').title = `进行中：${inProgressRate.toFixed(2)}%`
    document.getElementById('pausedTasks-container').title = `已暂停：${pausedRate.toFixed(2)}%`
    document.getElementById('terminaterdTasks-container').title = `已终止：${abolishRate.toFixed(2)}%`
    document.getElementById('overdueTasks-container').title = `已逾期：${overdueRate.toFixed(2)}%\n如需延期，请更改为‘已完成’，并添加后续任务`
    document.getElementById('totalTasks-container').title = `已完成：${completeRate.toFixed(2)}%\n进行中：${inProgressRate.toFixed(2)}%\n已暂停：${pausedRate.toFixed(2)}%\n已终止：${abolishRate.toFixed(2)}%\n已逾期：${overdueRate.toFixed(2)}%\n
    `
}

// id生成：当前时间戳-工号与随机数组合
function generateUniqueId() {
    const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
    const userID = localStorage.getItem('userID');
    const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
    return `${timestamp}-${userID}-${random}`;
}

function addWorkData(item, isPreceding = false) {
    precedingTaskId = ''
    if (!item) {
        createBtn.classList.add('hidden')
    }
    addDataModal.classList.remove('opacity-0', 'pointer-events-none');
    addDataModal.classList.add('opacity-100', 'pointer-events-auto');

    // 背景禁止滚动
    document.body.style.overflow = 'hidden';

    // //TODO: 初始化
    currentWeekSpan.textContent = currentWeek;
    // 模态框：
    editorModalDiv.innerHTML = `
        <span id="editor-${currentWeek}-span"
            class="col-span-1 w-8 h-8 bg-primary/50 items-center text-center justify-center border border-gray-200 rounded-full">${currentWeek}</span>
        <div id="editor-${currentWeek}-modal"
            class="col-span-10 block min-h-[80px] border border-gray-300 w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            contenteditable="true">
        </div>
        <input type="hidden" id="editor-${currentWeek}" name="content">
    `;
    // 编辑器内容变化时同步
    const editor = document.getElementById(`editor-${currentWeek}-modal`);
    const contentInput = document.getElementById(`editor-${currentWeek}`);
    editor.addEventListener('input', function() {
        contentInput.value = editor.innerHTML;
    });

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
    // 若输入item（非前序）, 按照item信息初始化
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
        initModal(item, isPreceding)
    }
}

// 初始化
function initModal(item, isPreceding = false) {
    // 模态框：
    editorModalDiv.innerHTML = '';
    // 渲染前序任务(最多一个)
    if(item.precedingTaskId){
        const precedingTask = sortedData.find(work => work.id ===item.precedingTaskId)
        if (precedingTask) {
            const labelElement = document.createElement('label')
            labelElement.classList = 'col-span-11 text-center font-bold'
            labelElement.textContent = `前序任务：${precedingTask.secondaryTask} | ${precedingTask.title}`
            editorModalDiv.appendChild(labelElement)
            precedingTask.week.forEach(w => {
                describe = precedingTask.describe[w]
                if(describe) {
                    const weekItemElement = document.createElement('span')
                    const predingItemElement = document.createElement('div')
                    weekItemElement.classList.add('col-span-1', 'w-8', 'h-8', 'bg-gray-200', 'items-center', 'text-center', 'justify-center', 'border', 'border-gray-200', 'rounded-full')
                    weekItemElement.id = `preding-${w}-span`;
                    weekItemElement.textContent = w;
                    predingItemElement.classList.add('col-span-10', 'block', 'min-h-[80px]', 'border', 'border-gray-300', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-gray-600', 'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm', 'rounded-md')
                    predingItemElement.id = `preding-${w}-modal`;
                    predingItemElement.textContent = describe;
                    predingItemElement.classList.add('bg-gray-200')
                    editorModalDiv.appendChild(weekItemElement)
                    editorModalDiv.appendChild(predingItemElement)
                }
            })
            // 添加分割线
            const lineElement = document.createElement('hr')
            lineElement.classList = 'col-span-11 bg-black border-t border-5px'
            editorModalDiv.appendChild(lineElement)
        }
    }
    
    if(!isPreceding) {
        // 不是前序任务创建的
        createBtn.addEventListener('click', ()=> {
            addWorkData(item, true)
        })
        precedingTaskId = ''
        id = item.id
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
        createBtn.classList.remove('hidden')

        item.week.forEach(w => {
            describe = item.describe[w]
            const weekItemElement = document.createElement('span')
            const editorItemElement = document.createElement('div')
            const inputContent = document.createElement('input')
            weekItemElement.classList.add('col-span-1', 'w-8', 'h-8', 'bg-primary/50', 'items-center', 'text-center', 'justify-center', 'border', 'border-gray-200', 'rounded-full')
            weekItemElement.id = `editor-${w}-span`;
            weekItemElement.textContent = w;
            editorItemElement.classList.add('col-span-10', 'block', 'min-h-[80px]', 'border', 'border-gray-300', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-base', 'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm', 'rounded-md')
            editorItemElement.id = `editor-${w}-modal`;
            editorItemElement.textContent = describe;
            inputContent.type = 'hidden';
            inputContent.id = `editor-${w}`;
            inputContent.name = 'content';
            inputContent.value = describe;
            // 仅可更改本周及以后内容
            if (w === week_of_today) { 
                editorItemElement.setAttribute('contenteditable', true)
                editorItemElement.classList.add('border-blue-300')
            } else if (w > week_of_today) {
                editorItemElement.setAttribute('contenteditable', true)
            }
            else {
                editorItemElement.classList.add('bg-gray-100')
            }
            editorItemElement.addEventListener('input', function() {
                inputContent.value = editorItemElement.innerHTML;
            });
            editorModalDiv.appendChild(weekItemElement)
            editorModalDiv.appendChild(editorItemElement)
            editorModalDiv.appendChild(inputContent)
        })
    } else {
        // 存在前序任务
        createBtn.classList.add('hidden')
        dataModalTitle.textContent = `${item.secondaryTask} | ${item.title} - 后续任务`
        precedingTaskId = item.id
        id = generateUniqueId()

        // 渲染前序任务:
        item.week.forEach(w => {
            describe = item.describe[w]
            if(describe) {
                const weekItemElement = document.createElement('span')
                const predingItemElement = document.createElement('div')
                weekItemElement.classList.add('col-span-1', 'w-8', 'h-8', 'bg-gray-200', 'items-center', 'text-center', 'justify-center', 'border', 'border-gray-200', 'rounded-full')
                weekItemElement.id = `preding-${w}-span`;
                weekItemElement.textContent = w;
                predingItemElement.classList.add('col-span-10', 'block', 'min-h-[80px]', 'border', 'border-gray-300', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-gray-600', 'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm', 'rounded-md')
                predingItemElement.id = `preding-${w}-modal`;
                predingItemElement.textContent = describe;
                predingItemElement.classList.add('bg-gray-200')
                editorModalDiv.appendChild(weekItemElement)
                editorModalDiv.appendChild(predingItemElement)
            }
        })
        // 添加分割线
        lineElement = document.createElement('hr')
        lineElement.classList = 'col-span-11 bg-black border-t border-5px'
        editorModalDiv.appendChild(lineElement)

        const weekItemElement = document.createElement('span')
        const editorItemElement = document.createElement('div')
        weekItemElement.classList = `col-span-1 w-8 h-8 bg-primary/50 items-center text-center justify-center border border-gray-200 rounded-full`
        weekItemElement.id = `editor-${week_of_today}-span`;
        weekItemElement.textContent = week_of_today;
        editorItemElement.classList = `col-span-10 block min-h-[80px] border border-gray-300 w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`
        editorItemElement.id = `editor-${week_of_today}-modal`;
        editorItemElement.setAttribute('contenteditable', true);
        inputContent = document.createElement('input')
        inputContent.type = 'hidden';
        inputContent.id = `editor-${week_of_today}`;
        inputContent.name = 'content';
        editorModalDiv.appendChild(weekItemElement)
        editorModalDiv.appendChild(editorItemElement)
        editorModalDiv.appendChild(inputContent)
        // 编辑器内容变化时同步
        const editor = document.getElementById(`editor-${week_of_today}-modal`);
        const contentInput = document.getElementById(`editor-${week_of_today}`);
        editor.addEventListener('input', function() {
            contentInput.value = editor.innerHTML;
        });
    }
    

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
    const state = stateModal.value;
    const weekData = extractNumbers(dateModal.value)
    const progressData = progressModal.value
    const uploadData = new Date().toLocaleString();

    const describe = {};
    document.querySelectorAll('input[name="content"]').forEach(input => {
        week = input.id.split('-')[1]
        describe[week] = extractTextFromHtml(input.value) || '';
    });

    // 检查必填项是否为空：
    if(primaryTask === '' || secondaryTask === '' || workTypes === '' || members === '' || state === '' || weekData === '') {
        showNotification('数据填写不完整', 'error');
        return
    }

    // 上传数据：
    const workItem = {
        id: id,
        date: uploadData,
        primaryTask: primaryTask,
        secondaryTask: secondaryTask,
        title: title,
        workTypes: workTypes,
        members: members,
        describe: describe,
        state: state,
        week: weekData,
        progress: progressData,
        precedingTaskId : precedingTaskId,
    }
    uploadWorkItem(workItem).then(() => {
        update();
    })
    modelClose()
}

