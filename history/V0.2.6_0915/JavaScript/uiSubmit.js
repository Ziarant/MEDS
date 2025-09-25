// DOM控件
const myFileSearch = document.getElementById('my-file-search');
const myFileCountStart = document.getElementById('my-file-count-start')
const myFileCountEnd = document.getElementById('my-file-count-end')
const myFileCount = document.getElementById('my-file-count');
const allFileCount = document.getElementById('all-file-count');
const prevMyBtn = document.getElementById('prev-my-btn')
const nextMyBtn = document.getElementById('next-my-btn')
const paginationMyNumbers = document.getElementById('pagination-myfile-numbers')
const showMyFileNum = document.getElementById('show-myfile-num');
const noPassCountElement = document.getElementById('nopass-myfile-count');

const allFileSearch = document.getElementById('all-file-search');
const allFileCountStart = document.getElementById('all-file-count-start')
const allFileCountEnd = document.getElementById('all-file-count-end')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const paginationNumbers = document.getElementById('pagination-numbers')
const showAllFileNum = document.getElementById('show-allfile-num')
const noPassAllCountElement = document.getElementById('nopass-allfile-count');

// 页面信息
let myItemsPerPage = Number(showMyFileNum.value);
let myCurrentPage = 1;
let myTotalPages = 1;
let allItemsPerPage = Number(showAllFileNum.value);
let allCurrentPage = 1;
let allTotalPages = 1;

// 任务折叠/展开功能
function toggleTask(taskId) {
    const content = document.getElementById(`${taskId}`);
    const chevron = document.querySelector(`[s="toggleTask('${taskId}')"] i`);

    content.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
}

// 创建表格行
function renderRow(file) {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
    row.dataset.fileId = file.id;

    // 格式化文件大小
    const fileSize = formatFileSize(file.size);

    const uploader = file.uploader
    const dataGroup = file.dataGroup

    // 格式化日期
    const uploadDate = new Date(file.uploadTime).toLocaleString();

    // 文件状态
    const state = file.state

    // 设置文件图标
    // 判断是否undefined
    if (typeof file.type === 'undefined') {
        return row;
    }
    let { fileIcon, fileIconBg, fileIconColor } = getFileIconbyFileType(file.type)

    // 设置状态文本颜色
    let textColor = 'text-gray-500';
    if (state === '已录入') {
        textColor = 'text-green-500';
    } else if (state === '已拒绝') {
        textColor = 'text-red-500';
    }

    // 是否是用户文件
    let isUserFile = 'hidden';
    if (uploader === username) {
        isUserFile = 'show';
        row.classList.add('bg-green-300/10');
    }

    // 是否是管理员
    let isAdmin = 'hidden';
    if (group.includes('管理员')) {
        if (state !== '已录入') {
            isAdmin = 'show';
        }
    }

    // 对于未录入文件，非本人，非管理员不可见
    if (state !== '已录入') {
        if (uploader !== username && ! group.includes('管理员')) {
            noPassCount++
            return row
        } else {
            noPassMyCount++
        }
    }

    // 创建表格行
    row.innerHTML = `
          <td class="py-3 px-4">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded ${fileIconBg} flex items-center justify-center mr-3">
                <i class="fa ${fileIcon} ${fileIconColor}"></i>
              </div>
              <span class="font-medium text-gray-800 truncate max-w-xs">${file.name}</span>
            </div>
          </td>
          <td class="py-3 px-4 text-sm text-gray-500">${dataGroup}</td>
          <td class="py-3 px-4 text-sm text-gray-500">${fileSize}</td>
          <td class="py-3 px-4 text-sm text-gray-500">${uploader}</td>
          <td class="py-3 px-4 text-sm text-gray-500">${uploadDate}</td>
          <td class="py-3 px-4 text-sm ${textColor}">${state}</td>
          <td class="py-3 px-4 text-right">
            <div class="flex justify-end space-x-1">
              <button class="view-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="查看详情">
                <i class="fa fa-eye"></i>
              </button>
              <button class="download-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="下载">
                <i class="fa fa-download"></i>
              </button>
              <button class="delete-file p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors" title="删除" ${isUserFile}>
                <i class="fa fa-trash"></i>
              </button>
              <button class="check-file p-1.5 rounded hover:bg-green-100 text-green-500 transition-colors" title="审批" ${isAdmin}>
                <i class="fa fa-file-signature"></i>
              </button>
            </div>
          </td>
        `;
    
    if (state === '已录入') {
        row.querySelector('.delete-file').classList.replace('text-red-500', 'text-gray-400');
    } else if (state === '已拒绝') {
        row.classList.add('rejected')
        row.querySelector('.delete-file').classList.replace('text-gray-400', 'text-red-500');
    } else {
        row.classList.add('pending')
        row.querySelector('.delete-file').classList.replace('text-gray-400', 'text-red-500');
    }

    // 添加点击事件
    row.querySelector('.view-file').addEventListener('click', () => {
        openFileModal(file);
    });

    row.querySelector('.download-file').addEventListener('click', () => {
        downloadFile(file);
    });

    row.querySelector('.delete-file').addEventListener('click', () => {
        deleteFile(file);
    });

    row.querySelector('.check-file').addEventListener('click', () => {
        // checkFile(file);
        openApprovalModal(file);
    });
    return row
}

// 渲染我的文件列表
function renderMyFiles(fileList) {
    // 文件搜索过滤
    const searchTerm = myFileSearch.value.toLowerCase();
    if (searchTerm.trim() !== '') {
        const filteredMyFiles = fileList.filter(file =>
            file.name.toLowerCase().includes(searchTerm)
        );
        fileList = filteredMyFiles;
    }

    const startIndex = (myCurrentPage - 1) * myItemsPerPage;
    const endIndex = startIndex + myItemsPerPage;
    filesBody.innerHTML = '';
    noPassMyCount = 0
    myTotalPages = Math.ceil(fileList.length / myItemsPerPage);

    let index = 0;
    fileList.forEach(file => {
        const row = renderRow(file)
        if (index >= startIndex && index < endIndex) {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden'); // 隐藏不在当前页的
        }
        filesBody.appendChild(row);
        index++
    });
    myFileCount.textContent = fileList.length;
    noPassCountElement.textContent = noPassMyCount

    myFileCountStart.textContent = startIndex + 1
    myFileCountEnd.textContent = Math.min(allCurrentPage * allItemsPerPage, fileList.length);
}

// 渲染所有文件列表
function renderAllFiles(fileList) {
    // 文件搜索过滤
    const searchTerm = allFileSearch.value.toLowerCase();
    if (searchTerm.trim() !== '') {
        const filteredAllFiles = fileList.filter(file =>
            file.name.toLowerCase().includes(searchTerm)
        );
        fileList = filteredAllFiles;
    }

    const startIndex = (allCurrentPage - 1) * allItemsPerPage;
    const endIndex = startIndex + allItemsPerPage;
    allFilesBody.innerHTML = '';
    noPassCount = 0
    noPassMyCount = 0
    allTotalPages = Math.ceil(fileList.length / allItemsPerPage);
    
    let index = 0
    fileList.forEach(file => {
        const row = renderRow(file)
        if (index >= startIndex && index < endIndex) {
            allFilesBody.appendChild(row);
        }
        index++
    });
    allFileCount.textContent = fileList.length - noPassCount;
    noPassAllCountElement.textContent = noPassMyCount

    allFileCountStart.textContent = startIndex + 1
    allFileCountEnd.textContent = Math.min(allCurrentPage * allItemsPerPage, fileList.length); 
}

// 渲染按钮分页
function renderPaginationButtons(paginationDiv) {
    paginationDiv.innerHTML = '';
    
    // 始终显示第一页
    addPageButton(paginationDiv, 1);
    
    // 显示当前页附近的页码
    let startPage = 1
    let endPage = 1
    let totalPages = 1;
    let currentPage = 1;
    if (paginationDiv === paginationMyNumbers) {
        totalPages = myTotalPages;
        currentPage = myCurrentPage;
    }
    if (paginationDiv === paginationNumbers) {
        totalPages = allTotalPages;
        currentPage = allCurrentPage;
    }
    startPage = Math.max(2, currentPage - 2);
    endPage = Math.min(totalPages - 1, currentPage + 2);
    
    if (currentPage > 4) {
        addEllipsis(paginationDiv);
    }

    if (startPage > 2) {
        addPageButton(paginationDiv, startPage - 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(paginationDiv, i);
    }
    
    // if (endPage < totalPages - 1) {
    //     addPageButton(paginationDiv, endPage + 1);
    // }

    // 页码省略:当前页之后
    if (currentPage < totalPages - 3) {
        addEllipsis(paginationDiv);
    }
    
    // 始终显示最后一页
    if (totalPages > 1) {
        addPageButton(paginationDiv, totalPages);
    }
    
    // 更新按钮状态
    updateButtonStates();
}

// 添加分页按钮
function addPageButton(paginationDiv, pageNum) {
    const button = document.createElement('button');
    let currentPage = paginationDiv === paginationNumbers ? allCurrentPage : myCurrentPage;


    if (currentPage == pageNum) {
        button.className = 'z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 border border-primary text-sm font-medium'
    } else {
        button.className = 'z-10 bg-secondary text-black relative inline-flex items-center px-4 py-2 border border-primary text-sm font-medium'
    }
    button.textContent = pageNum;
    
    button.addEventListener('click', (e) => {
        const pagenum = e.currentTarget.textContent;
        if (paginationDiv === paginationNumbers && currentPage !== pagenum) {
            allCurrentPage = Number(pagenum);
            renderAllFiles(allFiles);
        }
        if (paginationDiv === paginationMyNumbers && currentPage !== pagenum) {
            myCurrentPage = Number(pagenum);
            renderMyFiles(myFiles);
        }
        renderPaginationButtons(paginationDiv);
    });
    
    paginationDiv.appendChild(button);
}

// 上一页按钮事件
prevMyBtn.addEventListener('click', () => {
    if (myCurrentPage > 1) {
        myCurrentPage--;
        renderMyFiles(myFiles);
        renderPaginationButtons(paginationMyNumbers);
    }
});
prevBtn.addEventListener('click', () => {
    if (allCurrentPage > 1) {
        allCurrentPage--;
        renderAllFiles(allFiles);
        renderPaginationButtons(paginationNumbers);
    }
});

// 下一页按钮事件
nextMyBtn.addEventListener('click', () => {
    if (myCurrentPage < myTotalPages) {
        myCurrentPage++;
        renderMyFiles(myFiles);
        renderPaginationButtons(paginationMyNumbers);
    }
});
nextBtn.addEventListener('click', () => {
    if (allCurrentPage < allTotalPages) {
        allCurrentPage++;
        renderAllFiles(allFiles);
        renderPaginationButtons(paginationNumbers);
    }
});


// 更新单页显示项目数目
showMyFileNum.addEventListener('change', () => {
    const inputValue = showMyFileNum.value.trim();
    // 使用正则表达式验证是否为正整数
    const isPositiveInteger = /^[1-9]\d*$/.test(inputValue);
    if (!isPositiveInteger) {
        showNotification('请输入正整数', 'warning');
        return;
    }

    myItemsPerPage = Number(showMyFileNum.value);
    myCurrentPage = 1;
    myTotalPages = Math.ceil(myFiles.length / myItemsPerPage);

    renderMyFiles(myFiles);
    renderPaginationButtons(paginationMyNumbers);
});

showAllFileNum.addEventListener('change', () => {
    const inputValue = showAllFileNum.value.trim();
    // 使用正则表达式验证是否为正整数
    const isPositiveInteger = /^[1-9]\d*$/.test(inputValue);
    if (!isPositiveInteger) {
        showNotification('请输入正整数', 'warning');
        return;
    }

    allCurrentPage = 1;
    allItemsPerPage = Number(showAllFileNum.value);
    allTotalPages = Math.ceil(allFiles.length / allItemsPerPage);

    renderAllFiles(allFiles);
    renderPaginationButtons(paginationNumbers);
});

// 添加省略号
function addEllipsis(paginationDiv) {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'px-2 py-2 text-gray-500';
    ellipsis.textContent = '...';
    paginationDiv.appendChild(ellipsis);
}

// 更新按钮状态
function updateButtonStates() {
    prevBtn.disabled = allCurrentPage === 1;
    nextBtn.disabled = allCurrentPage === allTotalPages;

    prevMyBtn.disabled = myCurrentPage === 1;
    nextMyBtn.disabled = myCurrentPage === myTotalPages;
}

// 文件搜索过滤：逻辑在renderFiles中
myFileSearch.addEventListener('input', (e) => {
    renderMyFiles(myFiles)
    renderPaginationButtons(paginationMyNumbers);
});
allFileSearch.addEventListener('input', (e) => {
    renderAllFiles(allFiles)
    renderPaginationButtons(paginationNumbers);
});

