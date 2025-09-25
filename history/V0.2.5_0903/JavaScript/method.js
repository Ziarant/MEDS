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
const testTitleModal = document.getElementById('test-title')
const testStandardModal = document.getElementById('testStandard')
const testCreator = document.getElementById('test-creator')
const testDescriptionModal = document.getElementById('test-description')
const testTagsModal = document.querySelectorAll('input[type="checkbox"][name="test-tags"]')
const testMethodFilesModal = document.getElementById('testMethod-files')
const technicalFilesModal = document.getElementById('testnical-files')
const reportModelModal = document.getElementById('reportModel-files')
const competitorDataModal = document.getElementById('competitor-files')

// 排序控件
const sortBtn = document.getElementById('sort-btn')
const sortItem = document.getElementById('sort-item')

// PDF预览
const pdfModal = document.getElementById('pdf-modal')
const pdfEmbed = document.getElementById('pdf-embed');
const closePDFModal = document.getElementById('close-pdf-modal')

let isDragging = false;
let offsetX, offsetY;
let initialX, initialY;
let currentX = 0;
let currentY = 0;
let currentItem;
let isAscending = false;

sortBtn.addEventListener('click', function () {
    if (isAscending) {
        isAscending = false
        sortBtn.innerHTML = '<i class="fa fa-sort-amount-down"></i>'
    } else {
        isAscending = true
        sortBtn.innerHTML = '<i class="fa fa-sort-amount-up"></i>'
    }
    const item = sortItem.value
    // 更新界面
    tl = JSON.parse(testList)
    tl = listSort(tl, item, isAscending)
    testList = JSON.stringify(tl)
    localStorage.setItem('testList', testList)
    initTestList(testList)
})

sortItem.addEventListener('change', function () {
    const item = sortItem.value
    // 更新界面
    tl = JSON.parse(testList)
    tl = listSort(tl, item, isAscending)
    testList = JSON.stringify(tl)
    localStorage.setItem('testList', testList)
    initTestList(testList)
})

addDataButton.addEventListener('click', function () {
    // 添加测试内容
    if (!isDragging) {
        addDataModal.classList.remove('opacity-0', 'pointer-events-none');
        addDataModal.classList.add('opacity-100', 'pointer-events-auto');
        testMethodFilesModal.classList.remove('hidden')
        technicalFilesModal.classList.remove('hidden')
        reportModelModal.classList.remove('hidden')
        competitorDataModal.classList.remove('hidden')
        if (group.includes('管理员')) {
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
    const testTitle = testTitleModal.value;
    const testStandard = testStandardModal.value;
    const testDescription = testDescriptionModal.value;
    const testTags = Array.from(testTagsModal).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    let testMethod = testMethodFilesModal.files.length > 0 ? Array.from(testMethodFilesModal.files).map(file => {
        return file.name;
    }) : [];
    let technical = technicalFilesModal.files.length > 0 ? Array.from(technicalFilesModal.files).map(file => {
        return file.name;
    }) : [];
    let reportModel = reportModelModal.files.length > 0 ? Array.from(reportModelModal.files).map(file => {
        return file.name;
    }) : [];
    let competitorData = competitorDataModal.files.length > 0 ? Array.from(competitorDataModal.files).map(file => {
        return file.name;
    }) : [];

    let isCompulsory = document.querySelector('input[name="test-type"][value="compulsory"]').checked
    let needRegister = document.querySelector('input[name="test-isRegister"][value="true"]').checked

    const now = new Date();
    let id = generateUniqueId();
    if (item) {
        id = item.id
    }
    const testItem = {
        title: testTitle,
        testStandard: testStandard,
        description: testDescription,
        compulsory: isCompulsory,
        isRegister: needRegister,
        tags: testTags,
        creator: username,
        approval: 'submit',
        updateTime: now,
        documents: {
            testMethod,
            technical,
            reportModel,
            competitorData
        },
        id: id
    };
    // 上传
    if (testTitle === "" || testStandard === "" || testDescription === "" || testTags.length === 0) {
        showNotification('必填项不完整，请补充信息', 'error');
        return
    }
    addTestMethod(testItem, testMethodFilesModal.files, technicalFilesModal.files, reportModelModal.files, competitorDataModal.files)
    // 关闭模态框
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
    showNotification('添加成功', 'success');
    // 更新界面
    tl = JSON.parse(testList)
    tl.unshift(testItem)
    tl = listSort(tl, 'title', isAscending)
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

// 初始化
tl = JSON.parse(testList)
tl = listSort(tl, 'title', isAscending)
testList = JSON.stringify(tl)
initTestList(testList)

function initTestList(testList) {
    testListContainer.innerHTML = ''

    if (testList) {
        let pending = ''
        parsedTest = Array.from(JSON.parse(testList));

        // 确认抽屉
        let showTag = ''
        toggleButtons = document.querySelectorAll('[id$="-toggle"]');
        toggleButtons.forEach(button => {
            if (button.className.includes('bg-primary')) {
                showTag = button.id.split('-')[0]
            }
        });
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
            const tags = test.tags ? test.tags.map(tag => `<span class="bg-gray-200 text-gray-800 border border-black font-semibold px-2.5 py-0.5 rounded">${tag}</span>`).join(' ') : '';
            const tagArray = test.tags || [];
            tagArray.forEach(tag => {
                if (tag === '种植体') { testItem.id += `Implant`; implantTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '基台') { testItem.id += `Abutment`; abutmentTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '支抗钉') { testItem.id += `TAD`; tadTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '钻类') { testItem.id += `Drill`; drillTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '旋转器械') { testItem.id += `Rotary`; rotaryTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '植入器') { testItem.id += `Pickup`; pickupTestCount[test.compulsory ? 0 : 1]++; }
                // if (tag === '扳手') {testItem.id += `Handle`; handleTestCount[test.compulsory ? 0 : 1]++;}
                if (tag === '牙科材料') { testItem.id += `Material`; materialTestCount[test.compulsory ? 0 : 1]++; }
                if (tag === '其他') { testItem.id += `Other`; otherTestCount[test.compulsory ? 0 : 1]++; }
            });
            testItem.id += `-${index}-span`;

            // 可见性
            let isVisible = 'show'
            if (showTag !== '') {
                isVisible = testItem.id.includes(showTag) ? 'show' : 'hidden';
            }

            testItem.className = `${isVisible} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 border shadow-md rounded-lg gap-6 mb-2`;
            const textColor = test.compulsory ? 'bg-green-100 text-green-800 border border-black' : 'bg-yellow-100 text-yellow-800 border border-black';
            const compulsory = test.compulsory ? '必测' : '选测';

            const typeColor = test.isRegister ? "bg-yellow-100 border border-black" : "bg-blue-100 border border-black"
            const testType = test.isRegister ? '注册要求' : '自检要求';

            const buttonText = group.includes('管理员') ? '审阅' : '编辑';
            const standardColor = test.testStandard === '其他' ? 'text-gray-700' : 'text-primary cursor-pointer';

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
                <div class="${pending} bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    <div class="p-2 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 class="mb-2">
                                <span class="text-lg ${textColor} font-semibold px-2.5 py-0.5 rounded">${compulsory}</span>
                                <span class="text-2xl font-semibold">${test.title}</span>
                            </h3>
                            <h4>
                                <span class="${typeColor} font-semibold px-2.5 py-0.5 rounded">${testType}</span>
                                ${tags}
                            </h4>
                        </div>
                        <button
                            <i class="hidden w-18 h-12 fa fa-edit text-xl text-primary"><span>${buttonText}</span></i>
                        </button>
                    </div>
                    <p class="text-gray-500 px-2 mb-2">测试标准：<span class="${standardColor}" id="standard-${testItem.id}">${test.testStandard}</span></p>
                    <div class="text-gray-700 px-2 mb-2">${test.description}</div>
                    <div class="mt-auto pt-3 border-t border-gray-200">
                        相关文件：
                        <button id="${testItem.id}-method" class="text-primary hover:underline ${strikethroughtestMethodFiles}">测试方法文件</button>
                        <button id="${testItem.id}-technical" class="text-primary hover:underline ${strikethroughtTechnicalFiles}">技术要求文件</button>
                        <button id="${testItem.id}-report" class="text-primary hover:underline ${strikethroughtReportModelFiles}">报告模板文件</button>
                        <button id="${testItem.id}-competitor" class="text-primary hover:underline ${strikethroughtCompetitorDataFiles}">竞品参考数据</button>
                    </div>
                </div>
            `;
            testListContainer.appendChild(testItem);
            const button = testItem.querySelector('button');
            const standardSpan = document.getElementById(`standard-${testItem.id}`);
            button.addEventListener('click', () => {
                edit(test)
            });
            standardSpan.addEventListener('click', () => {
                standardList = getStandardList(username).then(
                    data => {
                        const standard = data.find(s => s.standardID.includes(test.testStandard));
                        if (standard) {
                            const pdfURL = previewByPath(`database/standards/${standard.filename}`)
                            .then(pdfURL => {
                                pdfEmbed.src = pdfURL;
                            })
                            pdfModal.classList.remove('hidden');
                            pdfEmbed.classList.remove('hidden');
                            document.getElementById('pdf-modal-title').textContent = standard.filename;
                            document.body.style.overflow = 'hidden'; // 防止背景滚动
                        } else {
                            showNotification('未找到相关标准文件', 'error');
                        }
                    }
                )
            });
            if (test.approval !== 'pass') {
                button.classList.remove('hidden')
            }
            document.getElementById(`${testItem.id}-method`).addEventListener('click', () => openFileModal(test.id, 'testMethod'))
            document.getElementById(`${testItem.id}-technical`).addEventListener('click', () => openFileModal(test.id, 'technical'))
            document.getElementById(`${testItem.id}-report`).addEventListener('click', () => openFileModal(test.id, 'reportModel'))
            document.getElementById(`${testItem.id}-competitor`).addEventListener('click', () => openFileModal(test.id, 'competitorData'))
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
        // document.getElementById('Handle-compulsory').textContent = `${handleTestCount[0]}`;
        // document.getElementById('Handle-optional').textContent = `${handleTestCount[1]}`;
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
    if (group.includes('管理员')) {
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
    submitButton.addEventListener('click', () => {
        submitItem(currentItem)
        currentItem = null
    });
    approvalPassButton.addEventListener('click', () => {
        checkTestMethod(item)
    });
    approvalNotPassButton.addEventListener('click', () => {
        rejectTestMethod(item)
    });
};

// 模态框初始化
function initModal(item) {
    testTitleModal.value = item.title;
    testCreator.textContent = item.creator;
    testDescriptionModal.value = item.description;
    if (item.compulsory) {
        document.querySelector('input[name="test-type"][value="compulsory"]').checked = true;
    } else {
        document.querySelector('input[name="test-type"][value="optional"]').checked = true;
    }

    if (item.isRegister) {
        document.querySelector('input[name="test-isRegister"][value="true"]').checked = true;
    } else {
        document.querySelector('input[name="test-isRegister"][value="false"]').checked = true;
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

function openFileModal(id, type) {
    // 获取文件信息
    const tl = JSON.parse(testList)
    const index = tl.findIndex(f => f.id === id)
    if (index === -1) { return }
    const title = tl[index]['title']
    const documentNames = tl[index]['documents'][type]
    if (documentNames.length === 0) { return }
    const path = title + '-' + id

    // 文件下载模态框
    const fileModal = document.createElement('div');
    fileModal.className = 'fixed bg-gray-100 top-1/2 left-1/2 border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded shadow-lg z-50';
    fileModal.id = 'file-modal'
    fileModal.innerHTML = `
    <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3 md-1">
        <div>
            <h3 class="text-2xl font-semibold">${title}</h3>
        </div>
        <button id="close-fileModal" class="text-gray-400 hover:text-primary transition-colors">
                <i class="fa fa-times"></i>
        </button>
    </div>
    <hr />
    `;

    documentNames.forEach(fileName => {
        const filePath = 'database/testMethods/' + `${path}/${type}/` + fileName
        const row = renderRow(fileName, filePath)
        fileModal.append(row)
    })

    // 添加到页面(如已有，移除旧有模态框)
    if (document.getElementById('file-modal') !== null) {
        const oldModal = document.getElementById('file-modal');
        oldModal.remove()
    }
    document.body.appendChild(fileModal)

    // 退出界面
    document.getElementById('close-fileModal').addEventListener('click', () => {
        fileModal.remove();
    });
}

// 创建表格行
function renderRow(fileName, filePath) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
    let isVisible = 'hidden'
    if (fileName.includes('.pdf')) { isVisible = '' }

    // 创建表格行
    row.innerHTML = `
          <td class="py-3 px-4">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded flex items-center justify-center mr-3">
                <i class="fa fa-file"></i>
              </div>
              <span class="font-medium text-gray-800 truncate max-w-xs">${fileName}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-right">
            <div class="flex justify-end space-x-1">
              <button class="${isVisible} preview-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="预览">
                <i class="fa fa-eye"></i>
              </button>
              <button class="download-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="下载">
                <i class="fa fa-download"></i>
              </button>
            </div>
          </td>
        `;
    row.querySelector('.preview-file').addEventListener('click', () => {
        let fileURL = previewByPath(filePath)
        .then(fileURL => {
            pdfEmbed.src = fileURL;
        })
        pdfModal.classList.remove('hidden');
        document.getElementById('pdf-modal-title').textContent = fileName;
        pdfEmbed.classList.remove('hidden')
        document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
        row.querySelector('.download-file').addEventListener('click', () => {
            console.log(filePath, fileName)
            downloadByPath(filePath, fileName)
        });
        return row
    }

closePDFModal.addEventListener('click', hidePdfModal);
function hidePdfModal() {
    pdfModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
}

function getNestedValue(obj, key) {
            return key.split('.').reduce((acc, part) => acc?.[part], obj);
        }

// JSON排序：
function listSort(list, key, isAscending = true) {
    const copyData = [...list];

    // 按照AttrName排序
    copyData.sort((a, b) => {
        const valueA = getNestedValue(a, key);
        const valueB = getNestedValue(b, key);

        // 处理特殊值（null/undefined）
        if (valueA === null || valueA === undefined) return isAscending ? 1 : -1;
        if (valueB === null || valueB === undefined) return isAscending ? -1 : 1;

        // 比较逻辑（区分数据类型）
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        } else {
            return isAscending ? (valueA - valueB) : (valueB - valueA);
        }
    })
    return copyData;
}