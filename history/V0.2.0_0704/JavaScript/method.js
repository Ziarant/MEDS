// 获取测试清单-渲染
const username = localStorage.getItem('username')
let testList = localStorage.getItem('testList');
const testListContainer = document.getElementById('test-list-container');
const addDataButton = document.getElementById('add-data-button');
const addDataModal = document.getElementById('add-data-modal');
const closeDataModal = document.getElementById('close-data-modal');
const submitButton = document.getElementById('save-submit-button');
const approvalPassButton = document.getElementById('approval-pass')
const approvalNotPassButton = document.getElementById('approval-not-pass')
const cancelBtn = document.getElementById('cancel-button')
const testTitilModal = document.getElementById('test-title')
const testDescriptionModal = document.getElementById('test-description')
const testTagsModal = document.querySelectorAll('input[type="checkbox"][name="test-tags"]')
const testMethodFilesModal = document.getElementById('testMethod-files')
const technicalFilesModal = document.getElementById('testnical-files')
const reportModelModal = document.getElementById('reportModel-files')
const competitorDataModal = document.getElementById('competitor-files')

let isDragging = false;
let offsetX, offsetY;
let initialX, initialY;
let currentX = 0;
let currentY = 0;
let currentItem;

addDataButton.addEventListener('click', function () {
    // 添加测试内容
    if (!isDragging) {
        addDataModal.classList.remove('opacity-0', 'pointer-events-none');
        addDataModal.classList.add('opacity-100', 'pointer-events-auto');
        testMethodFilesModal.classList.remove('hidden')
        technicalFilesModal.classList.remove('hidden')
        reportModelModal.classList.remove('hidden')
        competitorDataModal.classList.remove('hidden')
        if(group.includes('管理员')) {
            approvalPassButton.classList.remove('hidden')
            approvalNotPassButton.classList.remove('hidden')
        }
    } else {
        // 重置拖动状态
        isDragging = false;
    }
});

cancelBtn.addEventListener('click', function () {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
});

closeDataModal.addEventListener('click', function () {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
});

// 监听键盘事件，按下Esc键关闭模态框
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
        addDataModal.classList.add('opacity-0', 'pointer-events-none');
    }
});

// 提交
submitButton.addEventListener('click', function () {
    submitItem(currentItem)
    currentItem = null
});

function submitItem(item) {
    const testTitle = testTitilModal.value;
    const testDescription = testDescriptionModal.value;
    const testTags = Array.from(testTagsModal).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    let testMethod = testMethodFilesModal.files.length > 0 ? Array.from(testMethodFilesModal.files).map(file => {
            return file.name; }) : [];
    let technical = technicalFilesModal.files.length > 0 ? Array.from(technicalFilesModal.files).map(file => {
            return file.name; }) : [];
    let reportModel = reportModelModal.files.length > 0 ? Array.from(reportModelModal.files).map(file => {
            return file.name; }) : [];
    let competitorData = competitorDataModal.files.length > 0 ? Array.from(competitorDataModal.files).map(file => {
            return file.name; }) : [];

    const now = new Date();
    let id = generateUniqueId();
    if (item) {
        id = item.id
    }
    const testItem = {
        title: testTitle,
        description: testDescription,
        tags: testTags,
        creator: username,
        approval: 'submit',
        updateTime: now,
        documents : {
            testMethod,
            technical,
            reportModel,
            competitorData
        },
        id : id
    };
    // 上传
    if (testTitle === "" || testDescription === "" || testTags.length === 0) {
        showNotification('必填项不完整，请补充信息', 'error');
        return
    }
    addTestMethod(testItem, testMethodFilesModal.files, technicalFilesModal.files, reportModelModal.files, competitorDataModal.files)
    // 关闭模态框
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
    showNotification('添加成功', 'success');
    tl = JSON.parse(testList)
    tl.unshift(testItem)
    testList = JSON.stringify(tl)
    localStorage.setItem('testList', testList)
    initTestList(testList)
}

// 统计各标签的必做和选做测试数量
let implantTestCount = [0, 0]; // [必做, 选做]
let abutmentTestCount = [0, 0]; // [必做, 选做]
let tadTestCount = [0, 0]; // [必做, 选做]
let drillTestCount = [0, 0]; // [必做, 选做]
let rotaryTestCount = [0, 0]; // [必做, 选做]
let pickupTestCount = [0, 0]; // [必做, 选做]
let handleTestCount = [0, 0]; // [必做, 选做]
let materialTestCount = [0, 0]; // [必做, 选做]
let otherTestCount = [0, 0]; // [必做, 选做]
initTestList(testList)

function initTestList(testList) {
    testListContainer.innerHTML = ''

    if (testList) {
        let pending = ''
        parsedTest = Array.from(JSON.parse(testList));
        parsedTest.forEach((test, index) => {
            // 创建测试项
            pending = ''
            if (test.approval !== 'pass') {
                if (group.includes('管理员') || test.creator.includes(username)) {
                    // 待审核标记
                    pending = test.approval === 'submit' ? 'pending' : 'rejected'      
                } else {
                    // 如果测试项未录入，且非管理员或自己，则跳过
                    return
                }
            }
            const testItem = document.createElement('div');
            const tags = test.tags ? test.tags.map(tag => `<span class="bg-gray-200 text-gray-800 font-semibold px-2.5 py-0.5 rounded">${tag}</span>`).join(' ') : '';
            const tagArray = test.tags || [];
            tagArray.forEach(tag => {
                if (tag === '种植体') {testItem.id += `Implant`; implantTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '基台') {testItem.id += `Abutment`; abutmentTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '支抗钉') {testItem.id += `TAD`; tadTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '钻类') {testItem.id += `Drill`; drillTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '旋转器械') {testItem.id += `Rotary`; rotaryTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '植入器') {testItem.id += `Pickup`; pickupTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '扳手') {testItem.id += `Handle`; handleTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '牙科材料') {testItem.id += `Material`; materialTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '其他') {testItem.id += `Other`; otherTestCount[test.compulsory ? 0 : 1]++;}
            });
            testItem.id += `-${index}-span`;
            testItem.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-2";

            const textColor = test.compulsory ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            const compulsory = test.compulsory ? '必测' : '选测';
            const buttonText = group.includes('管理员') ? '审阅' : '编辑' ;
            
            // 是否有文件：
            const testMethodFiles = test.documents.testMethod;
            const technicalFiles = test.documents.technical;
            const reportModelFiles = test.documents.reportModel;
            const competitorDataFiles = test.documents.competitorData;

            const strikethroughtestMethodFiles = testMethodFiles.length > 0 ? '' : 'strikethrough';
            const strikethroughtTechnicalFiles = technicalFiles.length > 0 ? '' : 'strikethrough';
            const strikethroughtReportModelFiles = reportModelFiles.length > 0 ? '' : 'strikethrough';
            const strikethroughtCompetitorDataFiles = competitorDataFiles.length > 0 ? '' : 'strikethrough';

            testItem.innerHTML = `
                <div class="${pending} bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                    <div class="p-2 border-b border-gray-100 flex items-center justify-between">
                        <h3 class="text-xl font-semibold mb-2">
                            <span class="${textColor} font-semibold px-2.5 py-0.5 rounded">${compulsory}</span>
                            ${tags}
                            ${test.title}
                        </h3>
                        <button
                            <i class="hidden w-18 h-12 fa fa-edit text-xl text-primary"><span>${buttonText}</span></i>
                        </button>
                    </div>

                    <p class="text-gray-700 px-2 mb-4">${test.description}</p>
                    <div>
                        相关文件：
                        <a href="#" class="text-primary hover:underline ${strikethroughtestMethodFiles}">测试方法文件</a>
                        <a href="#" class="text-primary hover:underline ${strikethroughtTechnicalFiles}">技术要求文件</a>
                        <a href="#" class="text-primary hover:underline ${strikethroughtReportModelFiles}">报告模板文件</a>
                        <a href="#" class="text-primary hover:underline ${strikethroughtCompetitorDataFiles}">竞品参考数据</a>
                    </div>
                </div>
            `;
            testListContainer.appendChild(testItem);
            const button = testItem.querySelector('button');
            button.addEventListener('click', () => {
                edit(test)
            });
            if (test.approval !== 'pass') {
                button.classList.remove('hidden')
            }
        });
    }

    // 更新统计信息
    const updateStatistics = () => {
        document.getElementById('Implant-compulsory').textContent = `${implantTestCount[0]}`;
        document.getElementById('Implant-optional').textContent = `${implantTestCount[1]}`;
        document.getElementById('Abutment-compulsory').textContent = `${abutmentTestCount[0]}`;
        document.getElementById('Abutment-optional').textContent = `${abutmentTestCount[1]}`;
        document.getElementById('TAD-compulsory').textContent = `${tadTestCount[0]}`;
        document.getElementById('TAD-optional').textContent = `${tadTestCount[1]}`;
        document.getElementById('Drill-compulsory').textContent = `${drillTestCount[0]}`;
        document.getElementById('Drill-optional').textContent = `${drillTestCount[1]}`;
        document.getElementById('Rotary-compulsory').textContent = `${rotaryTestCount[0]}`;
        document.getElementById('Rotary-optional').textContent = `${rotaryTestCount[1]}`;
        document.getElementById('Pickup-compulsory').textContent = `${pickupTestCount[0]}`;
        document.getElementById('Pickup-optional').textContent = `${pickupTestCount[1]}`;
        document.getElementById('Handle-compulsory').textContent = `${handleTestCount[0]}`;
        document.getElementById('Handle-optional').textContent = `${handleTestCount[1]}`;
        document.getElementById('Material-compulsory').textContent = `${materialTestCount[0]}`;
        document.getElementById('Material-optional').textContent = `${materialTestCount[1]}`;
        document.getElementById('Other-compulsory').textContent = `${otherTestCount[0]}`;
        document.getElementById('Other-optional').textContent = `${otherTestCount[1]}`;
    };

    // 页面加载时更新统计信息
    document.addEventListener('DOMContentLoaded', () => {
        updateStatistics();
    });
}

// 按钮点击事件：
function edit(item) {
    addDataModal.classList.remove('opacity-0', 'pointer-events-none');
    addDataModal.classList.add('opacity-100', 'pointer-events-auto');
    if(group.includes('管理员')) {
        approvalPassButton.classList.remove('hidden')
        approvalNotPassButton.classList.remove('hidden')
        // 文件输入input替换为下载栏
        testMethodFilesModal.classList.add('hidden')
        technicalFilesModal.classList.add('hidden')
        reportModelModal.classList.add('hidden')
        competitorDataModal.classList.add('hidden')
    }
    initModal(item)
    currentItem = item
    submitButton.addEventListener('click',  () => {
        submitItem(currentItem)
        currentItem = null
    });
    approvalPassButton.addEventListener('click',  () => {
        checkTestMethod(item)
    });
    approvalNotPassButton.addEventListener('click',  () => {
        rejectTestMethod(item)
    });
};

// 模态框初始化
function initModal(item) {
    testTitilModal.value = item.title;
    testDescriptionModal.value = item.description;
    if (item.compulsory) {
        document.querySelector('input[name="test-type"][value="compulsory"]').checked = true;
    } else {
        document.querySelector('input[name="test-type"][value="optional"]').checked = true;
    }
    testTagsModal.forEach(tag => {
        tag.checked = false;
    })
    item.tags.forEach(tag => {
        document.querySelector(`input[name="test-tags"][value="${tag}"]`).checked = true;
    });
}

// id生成：当前时间戳与随机数组合
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
  const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
  return `${timestamp}${random}`;
}

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