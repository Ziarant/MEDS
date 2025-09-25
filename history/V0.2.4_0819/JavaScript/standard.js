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

// 获取标准信息列表
standardList = getStandardList(username)
standardList.then(data => {
    generatestandardFlow(data)
})

let currentStrandardName = '', standardCount = 0

function generatestandardFlow(data, sortBy="name", sortOrder = "asc") {
    const sortedData = [...data].sort((a, b) => {
        let valueA, valueB;
        
        // 根据排序维度获取对应值（统一转为字符串便于比较）
        switch(sortBy) {
            case 'name': // 按名称排序
                const valueA = a.name.toLowerCase();
                const valueB = b.name.toLowerCase();
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
    standardList = sortedData;
    cardsContain.innerHTML = '';
    listContain.innerHTML = '';
    standardList.forEach(standard => {
        if (standard.name === '') {
            return;
        }
        standardCount ++;
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
        if (standard.replace !== undefined) {
            replaceDiv = `<div><i class="fa fa-refresh text-primary mr-1"></i> 替代标准: ${standard.replace}</div>`;
        }
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow transition-custom standard-card cursor-pointer';
        list.className = 'bg-white rounded-xl overflow-hidden shadow-sm hover:card-shadow transition-custom cursor-pointer';
        card.innerHTML = `
            <div class="p-5 flex flex-col h-full">
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
        <div class="p-4 list-view-content bg-white rounded-lg shadow-sm hover:shadow-md transition-custom flex flex-col h-full">
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
        console.log(fileURL)
        pdfEmbed.src = fileURL;
    })
    pdfEmbed.classList.remove('hidden')
    document.body.style.overflow = 'hidden'; // 防止背景滚动
})

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        // 实际应用中这里会有更复杂的搜索逻辑
        alert(`搜索: "${searchTerm}"\n在实际应用中，这里会显示与"${searchTerm}"相关的标准结果`);
    } else {
        alert('请输入搜索关键词');
    }
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