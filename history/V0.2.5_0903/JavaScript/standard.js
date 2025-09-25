const username = localStorage.getItem('username')
// 标准详情模态框
const standardModal = document.getElementById('standard-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalstandardID = document.getElementById('modal-standardID');
const modalContent = document.getElementById('modal-content');
const cardsContain = document.getElementById('cards-contain');
const listContain = document.getElementById('list-contain');
const standardCards = document.querySelectorAll('.standard-card');
const previewBtn = document.getElementById('preview-button');
const pdfModal = document.getElementById('pdf-modal');
const pdfEmbed = document.getElementById('pdf-embed')
const pdfModalBackdrop = document.getElementById('pdf-modal-backdrop');
const closePDFMoadl = document.getElementById('close-pdf-modal');

// 试图切换
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');

// 搜索功能
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// 筛选过滤
const filterBtn = document.getElementById('apply-filter-btn');
const resetFilterBtn = document.getElementById('reset-filter-btn');
let selectedTypes = [], selectedClassifications = [], issueYearFilter = '', statusFilter = '', enforceabilityFilter = '';

// 分页功能
const paginationNumbers = document.getElementById('pagination-numbers');
const prevBtn = document.getElementById('pagination-prev');
const nextBtn = document.getElementById('pagination-next');

// 页面信息
// 更改单页显示数目
const showItemsNum = document.getElementById('show-items-num');
let currentPage = 1, itemsPerPage = Number(showItemsNum.value), totalPages = 1;

// 获取标准信息列表
standardList = getStandardList(username)
let sortedData, currentData = [];
standardList.then(data => {
    sortedData = [...data]; // 创建数据的副本以进行排序和过滤
    sortedData = sortStandards()
    filterStandards(sortedData)
    totalPages = Math.ceil(currentData.length / itemsPerPage);

    renderStandards(currentData);
    renderPaginationButtons();
})

let sortOrder = 'asc'; // 默认排序顺序
document.getElementById('sort-order-btn').addEventListener('click', (e) => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    e.currentTarget.innerHTML = sortOrder === 'asc' ? '<i class="fa fa-sort-amount-asc"></i>' : '<i class="fa fa-sort-amount-desc"></i>';
    e.currentTarget.setAttribute('title', sortOrder === 'asc' ? '升序排列' : '降序排列');
    const sortBy = document.getElementById('sort-select').value;
    sortedData = sortStandards(sortBy, sortOrder);
    filterStandards(sortedData)
    renderStandards(currentData);
})
document.getElementById('sort-select').addEventListener('change', (e) => {
    const sortBy = e.target.value;
    sortedData = sortStandards(sortBy, sortOrder);
    filterStandards(sortedData);
    renderStandards(currentData);
})

let currentStrandardName = '', standardCount = 0

function sortStandards(sortBy="standardId", sortOrder = "asc") {
    sortedData = sortedData.sort((a, b) => {
        let valueA, valueB;
        
        // 根据排序维度获取对应值（统一转为字符串便于比较）
        switch(sortBy) {
            case 'standardId': // 按标准编号排序
                valueA = a.standardID.toLowerCase();
                valueB = b.standardID.toLowerCase();
                break;
            case 'name': // 按名称排序
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;
            case 'implementDate': // 按实施日期排序
                valueA = a.implementDate || '';
                valueB = b.implementDate || '';
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

function filterStandards(data) {
    // 过滤后的数据
    currentData = data.filter(standard => {
        // 过滤类型\分类\年份\状态\效力
        const typeMatch = selectedTypes.length === 0 || selectedTypes.some(type => type.includes(standard.type));
        const classificationMatch = selectedClassifications.length === 0 || selectedClassifications.includes(standard.classification);
        let issueYearMatch = !issueYearFilter || (standard.issueDate && standard.issueDate.startsWith(issueYearFilter)) || issueYearFilter === '';
        if (issueYearFilter === '2024') {
            // 如果选择了2024年及以后，则检查年份是否大于等于2024
            issueYearMatch = standard.issueDate && parseInt(standard.issueDate.split('-')[0]) >= 2024;
        }
        const statusMatch = !statusFilter || (statusFilter === 'active' && standard.state === 'active') || (statusFilter === 'abolish' && standard.state === 'abolish');
        const enforceabilityMatch = (enforceabilityFilter === standard.enforceability) || enforceabilityFilter === '';
        // 返回所有条件都满足的标准
        return typeMatch && classificationMatch && issueYearMatch && statusMatch &&  enforceabilityMatch;
    });
}


function renderStandards(currentData) {
    cardsContain.innerHTML = '';
    listContain.innerHTML = '';
    let indexStart = (currentPage - 1) * itemsPerPage;
    let indexEnd = indexStart + itemsPerPage;
    let index = 0, standardCount = 0;
    
    currentData.forEach(standard => {
        if (standard.name === '') {
            return;
        }
        standardCount ++;
        index ++;
        
        // 仅渲染当前页的标准
        if (index <= indexStart || index > indexEnd) {
            return;
        }
        const card = document.createElement('div');
        const list = document.createElement('div');
        let type = "国际标准", typeColor = "bg-purple-200", typeIcon = '<i class="fa fa-globe mr-1"></i>';
        if (standard.type.includes("GB")) {
            type = "国家标准", typeColor = "bg-green-200", typeIcon = '<i class="fa fa-flag mr-1" style="color: #de2910;"></i>';
        } else if (standard.type.includes("YY")) {
            type = "行业标准", typeColor = "bg-blue-200", typeIcon = '<i class="fa fa-cogs mr-1"></i>';
        }

        let enforceability = "强制", enforceColor = "bg-red-200";
        if (standard.enforceability === "recommend") {
            enforceability = "推荐", enforceColor = "bg-indigo-200";
        } else if (standard.enforceability === "guide") {
            enforceability = "指导", enforceColor = "bg-green-200";
        }

        let state = "现行", stateColor = "bg-green-200";
        if (standard.state === "abolish") {
            state = "废止";
            stateColor = "bg-red-200";
        }

        let adopted = '', adoptedDiv = '';
        if (standard.referenceStandard !== undefined && standard.referenceStandard !== '') {
            adopted = '<span class="inline-block bg-rose-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2">采标</span>';
            adoptedDiv = `<div><i class="fa fa-globe text-primary mr-1"></i> 采用标准: ${standard.referenceStandard}</div>`;
        }

        let replaceDiv = ''
        if (standard.replace !== undefined && standard.replace !== "") {
            replaceDiv = `<div><i class="fa fa-refresh text-primary mr-1"></i> 替代标准: ${standard.replace}</div>`;
        }
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow hover:border-primary transition-custom standard-card cursor-pointer';
        list.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow hover:border-primary transition-custom cursor-pointer';
        card.title = standard.briefDesc;
        list.title = standard.briefDesc;
        card.innerHTML = `
            <div class="p-5 flex flex-col h-full border border-gray-200 hover:border-primary transition-custom">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <div class="flex space-x-2">
                            <span
                                class="inline-block ${typeColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${typeIcon}${type}</span>
                            <span
                                class="inline-block ${enforceColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${enforceability}</span>
                            ${adopted}
                            <span
                                class="inline-block bg-yellow-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2">${standard.classification}</span>
                        </div>
                        <h4 class="text-lg font-semibold mb-1">${standard.name}</h4>
                        <p class="text-gray-500 text-sm">${standard.standardID}</p>
                    </div>
                    <button class="hidden text-gray-400 hover:text-primary transition-custom">
                        <span>编辑</span>
                    </button>
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${standard.briefDesc}</p>
                <div class="flex justify-between items-center text-sm mt-auto pt-3 border-t border-gray-200">
                    <div class="flex space-x-2 justfy-center">
                        <span
                            class="inline-block ${stateColor} text-xs px-2 py-1 border border-gray-400 rounded">${state}</span>
                        <span class="text-gray-500 space-x-2">
                            <i class="fa fa-calendar-o mr-1"></i>${standard.issueDate}
                            <i class="fa fa-calendar-check-o mr-1"></i>${standard.implementDate}
                        </span>
                    </div>
                    <button class="text-primary hover:text-primary/80 font-medium flex items-center">
                        查看详情 <i class="fa fa-angle-right ml-1"></i>
                    </button>
                </div>
            </div>
        `;
        // 列表视图内容 (默认隐藏)
        list.innerHTML = `
        <div class="p-4 list-view-content bg-white rounded-lg shadow-sm hover:shadow-md transition-custom flex flex-col h-full border border-gray-200 hover:border-primary">
            <div class="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <!-- 左侧信息区 -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-base font-semibold truncate">${standard.name}</h4>
                        <span class="text-gray-500 text-sm whitespace-nowrap">${standard.standardID}</span>
                    </div>
                    <div class="flex space-x-2">
                        <span class="inline-block ${typeColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${typeIcon}${type}</span>
                        <span class="inline-block ${enforceColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${enforceability}</span>
                        ${adopted}
                        <span class="inline-block bg-yellow-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2">${standard.classification}</span>
                        <span class="inline-block ${stateColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${state}</span>
                    </div>
                    <p class="text-gray-600 text-sm line-clamp-1 truncate">${standard.briefDesc}</p>
                </div>
                
                <!-- 右侧操作和日期区 -->
                <div class="flex items-center gap-6 md:gap-10 whitespace-nowrap">
                    <div class="text-gray-500 text-sm">
                        <div><i class="fa fa-calendar-o mr-1"></i>${standard.issueDate}</div>
                        <div><i class="fa fa-calendar-check-o mr-1"></i>${standard.implementDate}</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <button class="hidden text-gray-400 hover:text-primary transition-colors text-sm">编辑</button>
                        <button class="text-primary hover:text-primary/80 font-medium flex items-center text-sm">
                            查看详情 <i class="fa fa-angle-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        cardsContain.appendChild(card);
        listContain.appendChild(list);
        list.addEventListener('click', () => showModal(standard, typeColor, typeIcon, type, enforceColor, enforceability, adopted, stateColor, state, replaceDiv, adoptedDiv));
        card.addEventListener('click', () => showModal(standard, typeColor, typeIcon, type, enforceColor, enforceability, adopted, stateColor, state, replaceDiv, adoptedDiv));
    })
    document.getElementById('count-standard').textContent = standardCount;
}

// 显示模态框
function showModal(standard, typeColor, typeIcon, type, enforceColor, enforceability, adopted, stateColor, state, replaceDiv, adoptedDiv) {
    // 打开模态框，显示详情
    modalTitle.textContent = standard.filename;
    modalstandardID.textContent = standard.standardID;
    // 相似文件：
    const similarStandards = standard.similarStandards || {};
    const similarStandardsList = Object.entries(similarStandards).map(([key, value]) => `<li><b>${key}</b> : ${value}</li>`).join('');
    // let citedStandardList = ''
    const citedStandards = standard.citedStandards || {};
    const citedStandardList = Object.entries(citedStandards).map(([key, value]) => `<li><b>${key}</b> : ${value}</li>`).join('');
    let scope = standard.scope.replace(/\n/g, '<br>');
    scope = scope.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    // 脑图
    
    modalContent.innerHTML = `
    <div class="mb-6">
        <div class="flex flex-wrap gap-2 mb-4">
            <span class="inline-block ${typeColor}  text-xs px-2 py-1 rounded border border-gray-400 mb-2">${typeIcon}${type}</span>
            <span class="inline-block ${enforceColor} text-xs px-2 py-1 rounded border border-gray-400 mb-2">${enforceability}</span>
            ${adopted}
            <span class="inline-block ${stateColor} text-xs px-2 py-1 rounded border border-gray-400 mb-2">${state}</span>
            <span class="inline-block bg-yellow-200 text-xs px-2 py-1 rounded border border-gray-400 mb-2">${standard.classification}</span>
        </div>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <div><i class="fa fa-calendar-o text-primary mr-1"></i> 发布日期: ${standard.issueDate}</div>
            <div><i class="fa fa-calendar-check-o text-primary mr-1"></i> 实施日期: ${standard.implementDate}</div>
            ${replaceDiv}${adoptedDiv}
        </div>
    </div>
    
    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">范围</h5>
        <p class="text-gray-600 mb-3">${scope}</p>
    </div>
    
    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">规范性引用文件</h5>
        <ul class="list-disc pl-5 text-gray-600 space-y-1">
            ${citedStandardList}
        </ul>
    </div>

    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">脑图</h5>
        <ul class="list-disc pl-5 text-gray-600 space-y-1">
            ${citedStandardList}
        </ul>
    </div>

    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">相似标准</h5>
        <ul class="list-disc pl-5 text-gray-600 space-y-1">
            ${similarStandardsList}
        </ul>
    </div>
`
    standardModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function hideModal() {
    standardModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
}

function hidePdfModal() {
    pdfModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
}

closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', hideModal);
pdfModalBackdrop.addEventListener('click', hidePdfModal);
closePDFMoadl.addEventListener('click', hidePdfModal);

// 按ESC键关闭模态框
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !standardModal.classList.contains('hidden')) {
        hideModal();
    }
});

// const previewBtn = document.getElementById('preview-button');
// const pdfModal = document.getElementById('pdf-modal');
// const pdfEmbed = document.getElementById('pdf-embed')
previewBtn.addEventListener('click', () => {
    pdfModal.classList.remove('hidden');
    document.getElementById('pdf-modal-title').textContent = modalTitle.textContent
    let fileURL = getStandardFile(modalTitle.textContent)
    // loadFile(fileURL)
    .then(fileURL => {
        pdfEmbed.src = fileURL;
    })
    pdfEmbed.classList.remove('hidden')
    document.body.style.overflow = 'hidden'; // 防止背景滚动
})

function performSearch() {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        currentData = sortedData.filter(standard => {
            return standard.filename.includes(searchTerm) ||
                standard.standardID.includes(searchTerm) ||
                standard.scope.includes(searchTerm)
        });
        renderStandards(currentData);
    } else {
        renderStandards(sortedData);
    }
    currentPage = 1; // 重置到第一页
    totalPages = Math.ceil(currentData.length / itemsPerPage);
    renderPaginationButtons();
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 视图切换
gridViewBtn.addEventListener('click', () => {
    cardsContain.classList.remove('hidden');
    listContain.classList.add('hidden');
    gridViewBtn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
    gridViewBtn.classList.add('bg-primary', 'text-white', 'hover:bg-primary/90');
    listViewBtn.classList.remove('bg-primary', 'text-white', 'hover:bg-primary/90');
    listViewBtn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
});

listViewBtn.addEventListener('click', () => {
    cardsContain.classList.add('hidden');
    listContain.classList.remove('hidden');
    listViewBtn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-100');
    listViewBtn.classList.add('bg-primary', 'text-white', 'hover:bg-primary/90');
    gridViewBtn.classList.remove('bg-primary', 'text-white', 'hover:bg-primary/90');
    gridViewBtn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-100');
});

filterBtn.addEventListener('click', () => {
    selectedTypes = Array.from(document.querySelectorAll('input[name="type-filter"]:checked')).map(input => input.value);
    selectedClassifications = Array.from(document.querySelectorAll('input[name="classification-filter"]:checked')).map(input => input.value);
    issueYearFilter = document.getElementById('issue-year-filter').value;
    statusFilter = document.getElementById('status-filter').value;
    enforceabilityFilter = document.getElementById('enforceability-filter').value;
    filterStandards(sortedData)
    renderStandards(currentData)
});
resetFilterBtn.addEventListener('click', () => {
    document.querySelectorAll('input[name="type-filter"]').forEach(input => input.checked = true);
    document.querySelectorAll('input[name="classification-filter"]').forEach(input => input.checked = true);
    document.getElementById('issue-year-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('enforceability-filter').value = '';
    selectedTypes = [];
    selectedClassifications = [];
    issueYearFilter = '';
    statusFilter = '';
    enforceabilityFilter = '';
    filterStandards(sortedData)
    renderStandards(currentData)
})

showItemsNum.addEventListener('change', () => {
    itemsPerPage = Number(showItemsNum.value)
    totalPages = Math.ceil(currentData.length / itemsPerPage);
    cardsContain.innerHTML = '';
    listContain.innerHTML = '';

    renderStandards(currentData);
    currentPage = 1;
    renderPaginationButtons()
})

// 渲染按钮分页
function renderPaginationButtons() {
    paginationNumbers.innerHTML = '';
    
    // 始终显示第一页
    addPageButton(1);
    currentPage = Number(currentPage)
    
    // 显示当前页附近的页码
    if (currentPage > 4) {
        addEllipsis();
    }

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 3) {
        addPageButton(startPage - 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }
    
    if (endPage < totalPages - 2) {
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
            renderStandards(currentData);
            renderPaginationButtons();
        }

    });
    
    paginationNumbers.appendChild(button);
}

// 上一页按钮事件
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderStandards(currentData);
        renderPaginationButtons();
    }
});

// 下一页按钮事件
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderStandards(currentData);
        renderPaginationButtons();
    }
});

// 添加省略号
function addEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'px-2 py-2 text-gray-600 inline-flex';
    ellipsis.textContent = '...';
    paginationNumbers.appendChild(ellipsis);
}

// 更新按钮状态
function updateButtonStates() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}