// DOM元素引用
const testDataBody = document.getElementById('test-data-body');
const totalRecords = document.getElementById('total-records');
const paginationTotal = document.getElementById('pagination-total');
const detailModal = document.getElementById('detail-modal');
const modalContent = document.getElementById('modal-content')
const closeDetailModal = document.getElementById('close-detail-modal');
const resetFilters = document.getElementById('reset-filters');
const btnApplyFilter = document.getElementById('btn-apply-filter');
const btnClearFilter = document.getElementById('btn-clear-filter');
const table = document.getElementById('sortableTable');
const startIndexElement = document.getElementById('start-index');
const endIndexElement = document.getElementById('end-index');
const totalItemsElement = document.getElementById('total-items');
const notPassItemsElement = document.getElementById('notpass-items');
const paginationNumbers = document.getElementById('pagination-numbers');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const exportBtn = document.getElementById('export-btn');
const addDataButton = document.getElementById('add-data-button');
const addDataModal = document.getElementById('add-data-modal');
const dataModalTitle = document.getElementById('data-modal-title');

// 绑定事件:
btnApplyFilter.addEventListener('click', applyFilter)
btnClearFilter.addEventListener('click', clearFilter)
exportBtn.addEventListener('click', () => {
    if (currentData.length !== 0) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(currentData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Data');
        XLSX.writeFile(workbook, 'test_data.xlsx');
    }
});

// 分页配置
const itemsPerPage = 15;
let currentPage = 1;
let totalPages = 1;
let currentData = [];
let notPassItemCount = 0;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 渲染测试数据

    // 关闭详情模态框事件
    closeDetailModal.addEventListener('click', () => {
        detailModal.classList.add('opacity-0', 'pointer-events-none');
        detailModal.querySelector('div').classList.remove('scale-100');
        detailModal.querySelector('div').classList.add('scale-95');
    });

    // 点击模态框外部关闭
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeDetailModal.click();
        }
    });

    // 重置筛选按钮事件
    resetFilters.addEventListener('click', () => {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
    });
});

// 更新分页信息
function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, currentData.length);
    
    startIndexElement.textContent = startIndex;
    endIndexElement.textContent = endIndex;
    totalItemsElement.textContent = currentData.length;
    notPassItemsElement.textContent = notPassItemCount
}

// 渲染当前页
function renderCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = currentData.slice(startIndex, endIndex);
    testDataBody.innerHTML = '';

    index = startIndex
    notPassItemCount = 0;
    pageData.forEach((item) => {
        const row = document.createElement('tr');
        row.className = 'table-row-hover';
        row.dataset.id = item.id;

        // 获取结果状态样式
        let resultClass = '';
        let resultIcon = '';
        let editText =  group.includes('管理员') ? '审阅' : '编辑' ;

        resultClass = 'bg-gray-50 text-gray-800';
        resultIcon = 'fa-question-circle';
        let showDelete = 'hidden'

         if (item.resultStatus.indexOf('未通过') !== -1) {
                resultClass = 'bg-red-100 text-red-800';
                resultIcon = 'fa-times-circle';
            } else if (item.resultStatus.indexOf('通过') !== -1) {
                resultClass = 'bg-green-100 text-green-800';
                resultIcon = 'fa-check-circle';
            } else if (item.resultStatus.indexOf('待确认') !== -1) {
                resultClass = 'bg-yellow-50 text-yellow-800';
                resultIcon = 'fa-question-circle';
            }

        if (item.approvalStatus !== 'pass') {
            row.classList.add('pending')
            // 仅管理员或用户自己可对未通过审批的数据进行编辑
            if (item.uploader !== localStorage.getItem('username') && !group.includes('管理员')) {
                return
            }
            notPassItemCount++
            showDelete = 'show'
        } else {
            if (item.resultStatus.indexOf('未通过') !== -1) {
                row.classList.add('bg-red-50')
            } else if (item.resultStatus.indexOf('通过') !== -1) {
                row.classList.add('bg-green-50')
            } else if (item.resultStatus.indexOf('待确认') !== -1) {
                row.classList.add('bg-yellow-50');
            }

            if (item.testBatch.indexOf('?') !== -1) {
                row.classList.add('bg-yellow-50')
            }
        }
        
        BatchTooltipVisible = 'show'
        resultTooltipVisible = 'show'
        if (item.testBatchTooltip == undefined) {
            BatchTooltipVisible = 'hidden'
        }
        if (item.resultStrandard == undefined) {
            resultTooltipVisible = 'hidden'
        }
        
        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${index + 1}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            ${item.dataGroup}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.testName}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.testStandard}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.model}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.testSpecification}
          </td>
          <td class="has-tooltip relative inline-block px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <span class="tooltip bottom-8 left-0 min-w-[120px]" ${BatchTooltipVisible}>
                <i class="fa fa-info-circle mr-1"></i> ${item.testBatchTooltip}
            </span>
            ${item.testBatch}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.material}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.tester}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${item.testTime}
          </td>
          <td class="has-tooltip relative px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resultClass}">
              <i class="fa ${resultIcon} mr-1"></i> ${item.result}
            </span>
            <span class="tooltip bottom-8 left-0 min-w-[120px]" >
                <i class="fa fa-info-circle mr-1"></i>
                <span class="bg-green-100">通过条件：${item.resultStrandard}</span>
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
            <button class="view-details text-primary hover:text-primary/80 mr-3">
              查看详情
            </button>
            <button class="edit-details text-primary hover:text-primary/80 mr-3 ${showDelete}">
              ${editText}
            </button>
          </td>
        `;

        index++
        testDataBody.appendChild(row);

        // 添加查看详情事件
        row.querySelector('.view-details').addEventListener('click', () => {
            openDetailModal(item);
        });

        // 添加编辑事件
        row.querySelector('.edit-details').addEventListener('click', () => {
            openDataModal(item);
        });
    });
}

// 渲染按钮分页
function renderPaginationButtons() {
    paginationNumbers.innerHTML = '';
    
    // 始终显示第一页
    addPageButton(1);
    
    // 显示当前页附近的页码
    if (currentPage > 4) {
        addEllipsis();
    }
    
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    if (startPage > 2) {
        addPageButton(startPage - 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages - 1) {
        addPageButton(endPage + 1);
    }
    
    if (currentPage < totalPages - 3) {
        addEllipsis();
    }
    
    // 始终显示最后一页
    if (totalPages > 1) {
        addPageButton(totalPages);
    }
    
    // 更新按钮状态
    updateButtonStates();
}

// 添加分页按钮
function addPageButton(pageNum) {
    const button = document.createElement('button');
    
    // button.className = `pagination-btn ${currentPage === pageNum ? 'pagination-btn-active' : 'z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 border border-primary text-sm font-medium'}`;
    if (currentPage == pageNum) {
        button.className = 'z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 border border-primary text-sm font-medium'
    } else {
        button.className = 'z-10 bg-secondary text-black relative inline-flex items-center px-4 py-2 border border-primary text-sm font-medium'
    }
    button.textContent = pageNum;
    
    button.addEventListener('click', (e) => {
        const pagenum = e.currentTarget.textContent;
        if (currentPage !== pagenum) {
            currentPage = pagenum
            renderCurrentPage();
            renderPaginationButtons();
            updatePaginationInfo();
            scrollToTop();
        }

    });
    
    paginationNumbers.appendChild(button);
}

// 上一页按钮事件
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        renderPaginationButtons();
        updatePaginationInfo();
        scrollToTop();
    }
});

// 下一页按钮事件
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        renderPaginationButtons();
        updatePaginationInfo();
        scrollToTop();
    }
});

// 添加省略号
function addEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'px-2 py-2 text-gray-500';
    ellipsis.textContent = '...';
    paginationNumbers.appendChild(ellipsis);
}

// 更新按钮状态
function updateButtonStates() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: testDataBody.offsetTop - 100,
        behavior: 'smooth'
    });
}

// 渲染数据
function renderTestData(data) {
    totalPages = Math.ceil(data.length / itemsPerPage);
    testDataBody.innerHTML = '';
    currentData = data
    
    renderCurrentPage()
    updatePaginationInfo()
    renderPaginationButtons()
}


document.addEventListener('DOMContentLoaded', function () {
    // 获取所有可排序的表头
    const headers = table.querySelectorAll('.sortable-header');
    // 存储当前排序状态
    let currentSort = {
        column: null,
        direction: 'asc' // 'asc' 或 'desc'
    };

    // 为每个表头添加点击事件
    headers.forEach((header, index) => {
        header.addEventListener('click', () => {
            // 重置所有表头的图标
            headers.forEach(h => {
                const icon = h.querySelector('i');
                icon.className = 'fa fa-sort ml-1';
                h.classList.remove('bg-primary/10');
            });

            // 设置当前排序状态
            if (currentSort.column === index) {
                // 切换排序方向
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                // 设置新的排序列
                currentSort.column = index;
                currentSort.direction = 'asc';
            }

            // 更新当前表头的图标
            const icon = header.querySelector('i');
            icon.className = `fa fa-sort-${currentSort.direction} ml-1`;
            header.classList.add('bg-primary/10');

            // 对所有数据进行排序
            sortTable(table, index, currentSort.direction);
        });
    });
});

// 排序表格函数
function sortTable(table, columnIndex, direction) {
    const tbody = table.querySelector('tbody');
    // const rowsArray = Array.from(tbody.querySelectorAll('tr'));
    // 获取表头
    const header = Array.from(table.querySelectorAll('th'))[columnIndex].innerText;

    // 确定排序函数
    const sortFn = (a, b) => {
        let aValue, bValue;
        
        switch(header) {
            case "序号":
                return
            case "器械类别":
                aValue = a.dataGroup;
                bValue = b.dataGroup;
                break;
            case "测试类型":
                aValue = a.testName;
                bValue = b.testName;
                break;
            case "测试标准":
                aValue = a.testStandard;
                bValue = b.testStandard;
                break;
            case "器械型号":
                aValue = a.model;
                bValue = b.model;
                break;
            case "规格":
                aValue = a.testSpecification;
                bValue = b.testSpecification;
                break;
            case "批次/阶段":
                aValue = a.testBatch;
                bValue = b.testBatch;
                break;
            case "材料":
                aValue = a.material;
                bValue = b.material;
                break
            case "测试人":
                aValue = a.tester;
                bValue = b.tester;
                break
            case "测试时间":
                aValue = a.testTime;
                bValue = b.testTime;
                break
            case "结果":
                aValue = a.resultStatus;
                bValue = b.resultStatus;
                break
        }
        console.log(aValue)

        // 特殊处理：移除货币符号和逗号
        if (aValue.startsWith('¥')) {
            aValue = parseFloat(aValue.replace('¥', '').replace(',', ''));
            bValue = parseFloat(bValue.replace('¥', '').replace(',', ''));
        }

        // 特殊处理：日期排序
        if (aValue.match(/\d{4}-\d{2}-\d{2}/)) {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        // 特殊处理：数字排序
        if (!isNaN(parseFloat(aValue)) && isFinite(aValue)) {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        }

        // 排序逻辑
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    };

    // 排序行
    // rowsArray.sort(sortFn);

    // 重新添加到表格
    // rowsArray.forEach(row => tbody.appendChild(row));
    const rowsArray = Array.from(currentData)
    rowsArray.sort(sortFn);
    currentData = rowsArray
    renderCurrentPage();
    renderPaginationButtons();
    updatePaginationInfo();
}

// 查看详情
function openDetailModal(item) {

    // 对Item中的元素建立表单：
    let innerHTML = '';
    // item.
    for (const [key, value] of Object.entries(item)) {
        let keyCN = translate(key)
        if (key == 'testDataFile') {
            // 文件下载
            innerHTML += `
                    <div class="grid grid-cols-5 border border-gray-100 gap-3 mb-3">
                        <div class="col-span-1 text-sm text-gray-500">${keyCN}</div>
                    `;
            value.forEach((file) => {
                innerHTML += `
                        <div class="col-span-1 text-sm font-medium text-gray-800">
                            <button class="download-file text-primary hover:text-primary/80 mr-3" data-id="${file}">
                                <i class="fa fa-download mr-1"></i> ${file}
                            </button>
                        </div>
                `;
            innerHTML += `</div>`
            });
        }
        else if (key == 'remark') {
            innerHTML += `
            <div class="grid grid-cols-5 border border-gray-100 gap-3 mb-3">
                <div class="col-span-1 text-sm text-gray-600">${keyCN}</div>
                <textarea rows="6" class="col-span-4 border border-gray-600 text-sm font-medium text-gray-800" spellcheck="false" autocorrect="off" autocapitalize="off">${value}</textarea>
            </div>
            `
         }
        else {
            innerHTML += `
            <div class="grid grid-cols-5 border border-gray-100 gap-3 mb-3">
                <div class="col-span-1 text-sm text-gray-600">${keyCN}</div>
                <div class="col-span-4 text-sm font-medium text-gray-800">${value}</div>
            </div>
        `;
        }

    }

    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
                ${innerHTML}
            </div>
        </div>
    `;

    // 显示detail-modal:
    detailModal.classList.remove('opacity-0', 'pointer-events-none');

    // 文件下载按钮：
    const downloadBtn = document.querySelector('.download-file');
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = e.currentTarget.getAttribute('data-id');
        downloadFileByName(fileId);
    });
}

// 编辑数据：
function openDataModal(item) {
    const uploaderModal = document.getElementById('uploader-modal');
    const uploaderSpan = document.getElementById('uploader-span');
    const passBtn = document.getElementById("pass-button");
    const notPassBtn = document.getElementById("not-pass-button");
    const notPassBtnText = document.getElementById("notPassBtn-txt");
    notPassBtn.classList.remove('hidden')
    // 管理员显示审核相关按钮：
    if (group.includes('管理员')) {
        dataModalTitle.textContent = '审阅测试数据'
        passBtn.classList.remove('hidden')
        notPassBtnText.textContent = '审核：不通过'
        uploaderModal.classList.remove('hidden')
        uploaderSpan.textContent = item.uploader
    } else {
        notPassBtnText.textContent = '删除'
        dataModalTitle.textContent = '编辑测试数据'
    };

    passBtn.addEventListener('click', () => {
        // 审核确认录入数据
        checkData(item)
    })

    notPassBtn.addEventListener('click', () => {
        // 删除数据
        if (confirm(`确定要删除数据吗？`)) {
            deleteTestData(item)
        }
    })
    
    addTestData(item)
};

function translate(name) {
    const translations = {
        'id': 'ID',
        'dataGroup': '器械类别',
        'testName': '测试名称',
        'model': '型号',
        'material': '材料',
        'tester': '测试人员',
        'testTime': '测试时间',
        'inputTime': '录入时间',
        'uploader' : '资料上传者',
        'resultStatus': '结果状态',
        'equipment': '测试设备',
        'environment': '测试环境',
        'remark': '备注',
        'result': '测试结果',
        'resultStrandard': '可接受标准',
        'testType': '测试类型',
        'testStandard': '测试标准',
        'testResult': '测试结果',
        'testMember': '测试人员',
        'testBatch': '测试批次',
        'testBatchTooltip' : '批次信息',
        'testSpecification': '测试规格',
        'testData': '测试数据',
        'approvalStatus': '审阅状态',
        'approvaler' : '审批人',
        'testDataFile': '相关文件',
        'uploadTime': '上传时间',
        'drawing': '工程图纸',
        'paper' : '论文',
    }
    if (translations[name]) {
        return translations[name];
    } else {
        return name;
    }
}

function applyFilter() {
    const dataGroup = document.getElementById('dataGroup').value;
    const testType = document.getElementById('testType').value;
    const testStandard = document.getElementById('testStandard').value;
    const testModel = document.getElementById('testModel').value;
    const testSpecification = document.getElementById('testSpecification').value;
    const testBatch = document.getElementById('testBatch').value;
    const material = document.getElementById('material').value;
    const testMember = document.getElementById('testMember').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const resultStatus = document.getElementById('resultStatus').value;

    const testData = localStorage.getItem('testData')
    const data = JSON.parse(testData)
    if (!data) {
        return
    }
    const filteredData = data.filter(item => {
        return (
            (dataGroup === '' || item.dataGroup === dataGroup) &&
            (testType === '' || item.testName === testType) &&
            (testStandard === '' || item.testStandard === testStandard) &&
            (testModel === '' || item.model.indexOf(testModel) !== -1) &&
            (testSpecification === '' || item.testSpecification.indexOf(testSpecification) !== -1) &&
            (testBatch === '' || item.testBatch === testBatch) &&
            (material === '' || item.material === material) &&
            (testMember === '' || item.tester.indexOf(testMember) !== -1) &&
            (startTime === '' || new Date(startTime) <= new Date(item.testTime)) &&
            (endTime === '' || new Date(item.testTime) <= new Date(endTime)) &&
            (resultStatus === '' || item.resultStatus === resultStatus)
        );
    });
    renderTestData(filteredData);
}

function clearFilter() {
    const testData = localStorage.getItem('testData')
    const data = JSON.parse(testData)
    if (!data) {
        return
    }
    renderTestData(data);
}


// 添加数据模态框
addDataButton.addEventListener('click', () => {
    dataModalTitle.textContent = '添加测试数据';
    addTestData()
});