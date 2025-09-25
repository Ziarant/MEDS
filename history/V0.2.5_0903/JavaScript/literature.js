const username = localStorage.getItem('username')
// 文章详情模态框
const literatureModal = document.getElementById('literature-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDoi = document.getElementById('modal-doi');
const modalContent = document.getElementById('modal-content');
const cardsContain = document.getElementById('cards-contain');
const listContain = document.getElementById('list-contain');
const literatureCards = document.querySelectorAll('.literature-card');
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

// 获取文章信息列表
literatureList = getLiteratureList(username)
let sortedData, currentData = [];
literatureList.then(data => {
    sortedData = [...data]; // 创建数据的副本以进行排序和过滤
    sortedData = sortLiteratures()
    filterLiteratures(sortedData)
    totalPages = Math.ceil(currentData.length / itemsPerPage);

    renderLiteratures(currentData);
    renderPaginationButtons();
})

let sortOrder = 'asc'; // 默认排序顺序
document.getElementById('sort-order-btn').addEventListener('click', (e) => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    e.currentTarget.innerHTML = sortOrder === 'asc' ? '<i class="fa fa-sort-amount-asc"></i>' : '<i class="fa fa-sort-amount-desc"></i>';
    e.currentTarget.setAttribute('title', sortOrder === 'asc' ? '升序排列' : '降序排列');
    const sortBy = document.getElementById('sort-select').value;
    sortedData = sortLiteratures(sortBy, sortOrder);
    filterLiteratures(sortedData)
    renderLiteratures(currentData);
})
document.getElementById('sort-select').addEventListener('change', (e) => {
    const sortBy = e.target.value;
    sortedData = sortLiteratures(sortBy, sortOrder);
    filterLiteratures(sortedData)
    renderLiteratures(currentData);
})

let currentStrandardName = '', literatureCount = 0

function sortLiteratures(sortBy = "updateDate", sortOrder = "asc") {
    sortedData = sortedData.sort((a, b) => {
        let valueA, valueB;

        // 根据排序维度获取对应值（统一转为字符串便于比较）
        switch (sortBy) {
            case 'updateDate': // 按文章编号排序
                valueA = a.updateDate;
                valueB = b.updateDate;
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

function filterLiteratures(data) {
    // 过滤后的数据
    currentData = data.filter(literature => {
        // 过滤类型\分类\年份\状态\效力
        const typeMatch = selectedTypes.length === 0 || selectedTypes.some(type => type.includes(literature.type));
        const classificationMatch = selectedClassifications.length === 0 || selectedClassifications.includes(literature.classification);
        let issueYearMatch = !issueYearFilter || (literature.issueDate && literature.issueDate.startsWith(issueYearFilter)) || issueYearFilter === '';
        if (issueYearFilter === '2024') {
            // 如果选择了2024年及以后，则检查年份是否大于等于2024
            issueYearMatch = literature.issueDate && parseInt(literature.issueDate.split('-')[0]) >= 2024;
        }
        const enforceabilityMatch = (enforceabilityFilter === literature.journal.zone) || enforceabilityFilter === '';
        // 返回所有条件都满足的文章
        return typeMatch && classificationMatch && issueYearMatch && enforceabilityMatch;
    });
}


function renderLiteratures(currentData) {
    cardsContain.innerHTML = '';
    listContain.innerHTML = '';
    let indexStart = (currentPage - 1) * itemsPerPage;
    let indexEnd = indexStart + itemsPerPage;
    let index = 0, literatureCount = 0;

    currentData.forEach(literature => {
        if (literature.doi === '') {
            return;
        }
        literatureCount++;
        index++;

        // 仅渲染当前页的文章
        if (index <= indexStart || index > indexEnd) {
            return;
        }
        abstract = literature.content.abstract
        const card = document.createElement('div');
        const list = document.createElement('div');
        let language = "英文", languageColor = "bg-purple-200", languageIcon = '<i class="fa fa-globe mr-1"></i>';
        if (literature.language.includes("zh-CN")) {
            language = "中文", languageColor = "bg-green-200", languageIcon = '<i class="fa fa-flag mr-1" style="color: #de2910;"></i>';
        } else {
            language = "其他", languageColor = "bg-blue-200", languageIcon = '<i class="fa fa-cogs mr-1"></i>';
        }

        let zone = "其他", zoneColor = "bg-gray-200";
        if (literature.journal.zone.includes("-1")) {
            zone = literature.journal.zone, zoneColor = "bg-indigo-400";
        } else if (literature.journal.includes("-2")) {
            zone = literature.journal.zone, zoneColor = "bg-indigo-300";
        } else if (literature.journal.includes("-3")) {
            zone = literature.journal.zone, zoneColor = "bg-indigo-200";
        } else if (literature.journal.includes("-4")) {
            zone = literature.journal.zone, zoneColor = "bg-indigo-100";
        }

        let literType = "期刊", typeColor = "bg-teal-100"
        if (literature.type === "C") {
            literType = "会议", typeColor = "bg-teal-200"
        } else if (literature.type === "MD") {
            literType = "学位(博)", typeColor = "bg-teal-300"
        } else if (literature.type === "MM") {
            literType = "学位(硕)", typeColor = "bg-teal-400"
        }

        let tags = "";
        // 最多显示4个tag
        literature.tags.forEach((tag, indexTags) => {
            if (indexTags < 4) {
                tags += `<span class="inline-block p-1 bg-gray-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2 mr-1" title=${tag}>${tag}</span>`
            }
        })

        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow hover:border-primary transition-custom literature-card cursor-pointer';
        list.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow hover:border-primary transition-custom cursor-pointer';
        card.title = abstract;
        list.title = abstract;
        card.innerHTML = `
            <div class="p-5 flex flex-col h-full border border-gray-200 hover:border-primary transition-custom">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex flex-col">
                        <div class="flex flex-col border-b border-gray-200 mb-2">
                            <h4 class="text-lg font-semibold mb-1">${literature.title}</h4>
                            <p class="text-gray-500 text-sm"><span class="font-bold text-black mr-1">DOI:</span>${literature.doi}</p>
                        </div>
                        <div class="flex space-x-2">
                            <span
                                class="inline-block ${languageColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${languageIcon}${language}</span>
                            <span
                                class="inline-block ${zoneColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2" title="影响因子：${literature.journal.IF}">${zone}</span>
                            <span
                                class="inline-block bg-yellow-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2">${literature.subject}</span>
                                <span
                                class="inline-block ${typeColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${literType}</span>
                        </div>
                    </div>
                </div>
                <p class="text-gray-600 text-sm mb-2 line-clamp-5">${literature.content.brief}</p>
                <div class="flex flex-cols">
                    ${tags}
                </div>
                <div class="flex justify-between items-center text-sm mt-auto pt-3 border-t border-gray-200">
                    <div class="flex space-x-2 justfy-center">
                        <span class="text-gray-500 space-x-2" title="杂志：${literature.journal.name}">
                            <i class="fa fa-book mr-1"></i>${literature.journal.fullName}
                        </span>
                        <span class="text-gray-500 space-x-2" title="发表时间：${literature.journal.publishDate}">
                            <i class="fa fa-calendar-o mr-1"></i>${literature.journal.publishDate}
                        </span>
                    </div>
                    <button class="text-primary hover:text-primary/80 font-medium flex items-center" title="点击复制(GB/T 7714)">
                        引用<i class="fa fa-quote-left ml-1"></i>
                    </button>
                </div>
            </div>
        `;
        // 列表视图内容 (默认隐藏)
        list.innerHTML = `
        <div class="p-4 list-view-content bg-white rounded-lg shadow-sm hover:shadow-md transition-custom flex flex-col h-full border border-gray-200 hover:border-primary">
            <div class="grid grid-cols-6 md:grid-cols-4 md:flex-row md:items-center gap-4 w-full">
                <!-- 左侧信息区 -->
                <div class="col-span-5 md:col-span-3 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-base font-semibold truncate">${literature.title}</h4>
                        <span class="text-gray-500 text-sm whitespace-nowrap">${literature.doi}</span>
                    </div>
                    <div class="flex space-x-2">
                        <span class="inline-block ${languageColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2">${languageIcon}${language}</span>
                        <span class="inline-block ${zoneColor} text-xs px-2 py-1 border border-gray-400 rounded mb-2" title="影响因子：${literature.journal.IF}">${zone}</span>
                        <span class="inline-block bg-yellow-200 text-xs px-2 py-1 border border-gray-400 rounded mb-2">${literature.subject}</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-2 line-clamp-5">${literature.content.brief}</p>
                    ${tags}
                </div>
                
                <!-- 右侧操作和日期区 -->
                <div class="col-span-1">
                    <div class="grid grid-row-3 text-gray-500 text-sm justify-between items-end flex space-y-5">
                        <div class="text-gray-500 space-x-2" title="杂志：${literature.journal.name}">
                            <i class="fa fa-book mr-1"></i>${literature.journal.fullName}
                        </div>
                        <div class="text-gray-500 space-x-2" title="发表时间：${literature.journal.publishDate}">
                            <i class="fa fa-calendar-o mr-1"></i>${literature.journal.publishDate}
                        </div>
                        <div class="justify-end">
                            <button class="text-primary hover:text-primary/80 font-medium flex items-center" title="点击复制(GB/T 7714)">
                                引用<i class="fa fa-quote-left ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        cardsContain.appendChild(card);
        listContain.appendChild(list);
        list.addEventListener('click', () => showModal(literature, languageColor, languageIcon, language, zoneColor, zone, tags));
        card.addEventListener('click', () => showModal(literature, languageColor, languageIcon, language, zoneColor, zone, tags));
    })
    document.getElementById('count-literature').textContent = literatureCount;
}

// 显示模态框
function showModal(literature, languageColor, languageIcon, language, zoneColor, zone, tags) {
    // 打开模态框，显示详情
    modalTitle.textContent = literature.filename;
    modalDoi.innerHTML = `
    <span class="text-black font-bold mr-1">DOI:</span>${literature.doi}
    `
    let abstract = literature.content.abstract.replace(/\n/g, '<br>');
    abstract = abstract.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    modalContent.innerHTML = `
    <div class="mb-6">
        <div class="flex flex-wrap gap-2 mb-4">
            <span class="inline-block ${languageColor}  text-xs px-2 py-1 rounded border border-gray-400 mb-2">${languageIcon}${language}</span>
            <span class="inline-block ${zoneColor} text-xs px-2 py-1 rounded border border-gray-400 mb-2">${zone}</span>
            <span class="inline-block bg-yellow-200 text-xs px-2 py-1 rounded border border-gray-400 mb-2">${literature.subject}</span>
            ${tags}
        </div>
        <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <div><i class="fa fa-book text-primary mr-1"></i>杂志：${literature.journal.fullName}</div>
            <div><i class="fa fa-calendar-check-o text-primary mr-1"></i> 发表时间：${literature.journal.publishDate}</div>
        </div>
    </div>
    
    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">摘要：</h5>
        <p class="text-gray-600 mb-3">${abstract}</p>
    </div>
    
    <div class="mb-6">
        <h5 class="font-semibold text-lg mb-3 pb-2 border-b">关键结论：</h5>
        <ul class="list-disc pl-5 text-gray-600 space-y-1">
            ${literature.content.conclusion}
        </ul>
    </div>
`
    literatureModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态框
function hideModal() {
    literatureModal.classList.add('hidden');
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
    if (e.key === 'Escape' && !literatureModal.classList.contains('hidden')) {
        hideModal();
    }
});

// const previewBtn = document.getElementById('preview-button');
// const pdfModal = document.getElementById('pdf-modal');
// const pdfEmbed = document.getElementById('pdf-embed')
previewBtn.addEventListener('click', () => {
    pdfModal.classList.remove('hidden');
    document.getElementById('pdf-modal-title').textContent = modalTitle.textContent
    let fileURL = getLiteratureFile(modalTitle.textContent)
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
        currentData = sortedData.filter(literature => {
            return literature.filename.includes(searchTerm) ||
                literature.doi.includes(searchTerm) ||
                literature.content.abstract.includes(searchTerm)
        });
        renderLiteratures(currentData);
    } else {
        renderLiteratures(sortedData);
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
    filterLiteratures(sortedData)
    renderLiteratures(currentData)
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
    filterLiteratures(sortedData)
    renderLiteratures(currentData)
})

showItemsNum.addEventListener('change', () => {
    itemsPerPage = Number(showItemsNum.value)
    totalPages = Math.ceil(currentData.length / itemsPerPage);
    cardsContain.innerHTML = '';
    listContain.innerHTML = '';

    renderLiteratures(currentData);
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
            renderLiteratures(currentData);
            renderPaginationButtons();
        }

    });

    paginationNumbers.appendChild(button);
}

// 上一页按钮事件
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderLiteratures(currentData);
        renderPaginationButtons();
    }
});

// 下一页按钮事件
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderLiteratures(currentData);
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

// 添加数据
function addDataButtonClick() {
    // console.log('')
    showNotification('功能待开发','info')
}