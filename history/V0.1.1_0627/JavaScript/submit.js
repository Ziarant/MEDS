// 常量
const uploader = localStorage.getItem('username');
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const progressFilename = document.getElementById('progress-filename');
const uploadBtn = document.getElementById('upload-btn');
const clearBtn = document.getElementById('clear-btn');
const emptyFilesPreview = document.getElementById('empty-files-preview')
const emptyFilesState = document.getElementById('empty-files-state');
const filesList = document.getElementById('files-list');
const allFilesList = document.getElementById('all-files-list');
const filesBody = document.getElementById('files-body');
const allFilesBody = document.getElementById('all-files-body');
const fileCount = document.getElementById('file-count');
const allFileCount = document.getElementById('all-file-count');
const noPassCountElement = document.getElementById('nopass-file-count');
const noPassAllCountElement = document.getElementById('nopass-allfile-count');
const fileModal = document.getElementById('file-modal');
const closeModal = document.getElementById('close-modal');
const approvalModal = document.getElementById('approval-modal');
const closeApprovalModal = document.getElementById('close-approval-modal');
const approvalContainer = document.getElementById('approval-container');
const approvalFileIcon = document.getElementById('approval-file-icon');
const approvalFilename = document.getElementById('approval-filename');
const approvalFilesize = document.getElementById('approval-filesize');
const approvalUploader = document.getElementById('approval-uploader');
const modalTitle = document.getElementById('modal-title');
const modalFilename = document.getElementById('modal-filename');
const modalFilesize = document.getElementById('modal-filesize');
const modalFiletype = document.getElementById('modal-filetype');
const modalUploadTime = document.getElementById('modal-upload-time');
const modalDownloads = document.getElementById('modal-downloads');
const modalFileIcon = document.getElementById('modal-file-icon');
const modalDataGroup = document.getElementById('modal-dataGroup')
const modalModel = document.getElementById('modal-model')
const modalSpecification = document.getElementById('modal-specification')
const modalBatch = document.getElementById('modal-batch')
const modalTestType = document.getElementById('modal-testType');
const modalTestStandard = document.getElementById('modal-testStandard');
const modalTestResult = document.getElementById('modal-testResult');
const modalTestMember = document.getElementById('modal-testMember');
const modalTestTime = document.getElementById('modal-testTime');
const modalRemarks = document.getElementById('modal-remarks');
const downloadBtn = document.getElementById('download-btn');
const deleteBtn = document.getElementById('delete-btn');
const fileSearch = document.getElementById('file-search');
const allFileSearch = document.getElementById('all-file-search');
const refreshBtn = document.getElementById('refresh-btn');
const navbar = document.getElementById('navbar');
// 表格元素
const myTable = document.getElementById('sortableTable');
const allTable = document.getElementById('all-sortableTable');

// 变量
let dataGroup = document.getElementById('device-type').value;       // 默认器械类别，需要与文件关联，否则刷新错误覆盖
let testModel = document.getElementById('test-model').value;        // 器械型号
let testSpecification = document.getElementById('test-specification').value;    // 器械规格
let testBatch = document.getElementById('test-batch').value;        // 器械批次
let testType = document.getElementById('test-type').value;          // 默认测试类型
let testStandard = document.getElementById('test-standard').value;  // 测试标准
let testMember = document.getElementById('test-member').value       // 测试人员
let testTime = document.getElementById('test-time').value;          // 测试时间
let remarks = document.getElementById('remarks').value;             // 默认备注
let testResult = document.getElementById('test-result').value;      // 默认测试结果

// 模拟文件数据
let preFiles = []
let myFiles = [];
let allFiles = [];
let noPassCount = 0
let noPassMyCount = 0

// 按钮事件：
uploadBtn.addEventListener('click', uploadFiles)
clearBtn.addEventListener('click', clearFiles)

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 监听滚动事件，改变导航栏样式
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('py-2', 'shadow-lg');
            navbar.classList.remove('py-3', 'shadow-md');
        } else {
            navbar.classList.add('py-3', 'shadow-md');
            navbar.classList.remove('py-2', 'shadow-lg');
        }
    });

    // 加载文件列表
    loadFiles();
});

// 加载文件列表
function loadFiles() {
    // 从服务器获取文件列表
    fileData = fetchFileData(uploader)
    updateFileData(uploader)
}

// 选择框变动
document.getElementById('device-type').addEventListener('change', (e) => {
    dataGroup = e.target.value;
});
document.getElementById('test-model').addEventListener('change', (e) => {
    testModel = e.target.value;
});
document.getElementById('test-specification').addEventListener('change', (e) => {
    testSpecification = e.target.value;
});
document.getElementById('test-batch').addEventListener('change', (e) => {
    testBatch = e.target.value;
});
document.getElementById('test-type').addEventListener('change', (e) => {
    testType = e.target.value;
});
document.getElementById('test-standard').addEventListener('change', (e) => {
    testStandard = e.target.value;
});
document.getElementById('test-member').addEventListener('change', (e) => {
    testMember = e.target.value;
});
document.getElementById('test-time').addEventListener('change', (e) => {
    testTime = e.target.value;
});
document.getElementById('test-result').addEventListener('change', (e) => {
    testResult = e.target.value;
});
// 备注信息变动
document.getElementById('remarks').addEventListener('input', (e) => {
    remarks = e.target.value;
});

// 添加文件到列表
function addFiles(selectedFiles) {
    // 过滤重复文件
    const newFiles = Array.from(selectedFiles).filter(file => {
        return !preFiles.some(f => f.name === file.name && f.size === file.size);
    });

    if (newFiles.length === 0) {
        showNotification('所选文件已在列表中', 'info');
        return;
    }

    // 添加到文件列表
    newFiles.forEach(file => {
        preFiles.push({
            id: Date.now() + '_' + file.name,
            file: file,
            status: 'pending',
            progress: 0
        });
    });

    // 更新文件列表显示
    updateFileList();

    // 显示通知
    showNotification(`已添加 ${newFiles.length} 个文件到上传列表`, 'success');
}

// 更新文件列表显示
function updateFileList() {
    // 清空现有列表
    emptyFilesPreview.innerHTML = '';

    if (preFiles.length === 0) {
        // 显示空状态
        emptyFilesPreview.innerHTML = `
            <div class="text-center py-10 text-gray-500">
                <i class="fa fa-file-o text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">暂无待上传的文件</h3>
                <p class="text-gray-500 max-w-md mx-auto">选择文件后，它们将显示在这里。</p>
            </div>
        `;
        uploadBtn.disabled = true;
        return;
    }

    // 启用上传按钮
    uploadBtn.disabled = false;

    // 添加文件项
    preFiles.forEach(fileItem => {
        const fileSize = formatFileSize(fileItem.file.size);
        const fileType = getFileTypeName(fileItem.file.name);

        let { fileIcon, fileIconBg, fileIconColor } = getFileIconbyFileType(fileItem.file.type)
        const fileItemEl = document.createElement('div');
        fileItemEl.className = 'file-item bg-gray-50 rounded-lg p-4 flex';
        fileItemEl.setAttribute('data-id', fileItem.id);

        // 设置初始动画类
        // fileItemEl.classList.add('file-item-enter');

        fileItemEl.innerHTML = `
        <div class="flex items-center">
              <div class="w-8 h-8 rounded ${fileIconBg} flex items-center justify-center mr-3">
                <i class="fa ${fileIcon} ${fileIconColor}"></i>
              </div>
              <span class="font-medium text-gray-800 truncate max-w-xs">${fileItem.file.name}</span>
        </div>
        <div class="flex-grow mr-4 min-w-0">
            <h3 class="font-medium text-gray-900 truncate"></h3>
        </div>
        <div class="flex items-center mt-1">
                <span class="text-sm text-gray-500">${fileSize}</span>
                <span class="mx-2 text-gray-300">•</span>
                <span id="status-${fileItem.id}" class="text-sm text-gray-500">等待上传</span>
        </div>
        <div>
            <button class="remove-file text-gray-400 hover:text-red-400 transition-colors duration-200" data-id="${fileItem.id}">
                <i class="fa fa-times"></i>
            </button>
        </div>
        `;

        emptyFilesPreview.appendChild(fileItemEl);

        // 触发动画
        setTimeout(() => {
            fileItemEl.classList.remove('file-item-enter');
            fileItemEl.classList.add('file-item-enter-active');
        }, 10);

        // 绑定删除按钮事件
        const removeBtn = fileItemEl.querySelector('.remove-file');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileId = e.currentTarget.getAttribute('data-id');
            removeFile(fileId);
        });
    });
}

// 移除文件
function removeFile(fileId) {
    preFiles = preFiles.filter(file => file.id !== fileId);
    updateFileList();
    showNotification('文件已从上传列表中移除', 'info');
}

// 清空文件列表
function clearFiles() {
    if (preFiles.length === 0) return;

    preFiles = [];
    updateFileList();
    showNotification('所有文件已从上传列表中移除', 'info');
}

// 根据file类型输出fileIcon、fileIconColor
function getFileIconbyFileType(type) {
    let fileIcon = 'fa-file';
    let fileIconBg = 'bg-gray-100';
    let fileIconColor = 'text-gray-400';

    if (type.includes('image')) {
        fileIcon = 'fa-file-image';
        fileIconBg = 'bg-blue-50';
        fileIconColor = 'text-blue-500';
    } else if (type.includes('pdf')) {
        fileIcon = 'fa-file-pdf';
        fileIconBg = 'bg-red-50';
        fileIconColor = 'text-red-500';
    } else if (type.includes('word')) {
        fileIcon = 'fa-file-word';
        fileIconBg = 'bg-blue-50';
        fileIconColor = 'text-blue-600';
    } else if (type.includes('sheet')) {
        fileIcon = 'fa-file-excel';
        fileIconBg = 'bg-green-50';
        fileIconColor = 'text-green-600';
    } else if (type.includes('video')) {
        fileIcon = 'fa-file-video';
        fileIconBg = 'bg-purple-50';
        fileIconColor = 'text-purple-500';
    } else if (type.includes('presentation')) {
        fileIcon = 'fa-file-powerpoint';
        fileIconBg = 'bg-orange-50';
        fileIconColor = 'text-orange-500';
    }

    return { fileIcon, fileIconBg, fileIconColor };

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
    filesBody.innerHTML = '';
    noPassMyCount = 0
    fileList.forEach(file => {
        const row = renderRow(file)
        filesBody.appendChild(row);
    });
    fileCount.textContent = fileList.length;
    noPassCountElement.textContent = noPassMyCount
}

// 渲染所有文件列表
function renderAllFiles(fileList) {
    allFilesBody.innerHTML = '';
    noPassCount = 0
    noPassMyCount = 0
    fileList.forEach(file => {
        const row = renderRow(file)
        allFilesBody.appendChild(row);
    });
    allFileCount.textContent = fileList.length - noPassCount;
    noPassAllCountElement.textContent = noPassMyCount
}


// 打开文件审批窗口
function openApprovalModal(file) {
    const passBtn = document.getElementById('pass-button')
    const notPassBtn = document.getElementById('not-pass-button')
    const cancelBtn = document.getElementById('cancel-button')

    // 设置文件信息
    approvalFilename.textContent = file.name;
    approvalUploader.textContent = '上传人：' + file.uploader;

    // 设置文件图标
    let { fileIcon, fileIconBg, fileIconColor } = getFileIconbyFileType(file.type)
    approvalFileIcon.className = `w-12 h-12 rounded-lg ${fileIconBg} flex items-center justify-center`;
    approvalFileIcon.innerHTML = `<i class="fa ${fileIcon} text-2xl ${fileIconColor}"></i>`;

    // 显示模态框
    approvalModal.classList.remove('opacity-0', 'pointer-events-none');
    approvalModal.querySelector('div').classList.remove('scale-95');
    approvalModal.querySelector('div').classList.add('scale-100');

    // 设置按钮事件
    passBtn.onclick = () => {
        checkFile(file);
        closeApprovalModalFrame();
    }
    notPassBtn.onclick = () => {
        deleteFile(file)
        closeApprovalModalFrame();
    }
    cancelBtn.onclick = () => closeApprovalModalFrame()
}

// 打开文件模态框
function openFileModal(file) {
    modalTitle.textContent = '文件详情';
    modalFilename.textContent = file.name;
    modalFilesize.textContent = formatFileSize(file.size);
    modalFiletype.textContent = getFileTypeName(file.type);
    modalDataGroup.textContent = file.dataGroup;
    modalModel.textContent = file.testModel;
    modalSpecification.textContent = file.testSpecification;
    modalBatch.textContent = file.testBatch;
    modalTestType.textContent = file.testType;
    modalTestStandard.textContent = file.testStandard;
    modalTestResult.textContent = file.testResult;
    modalTestMember.textContent = file.testMember;
    modalTestTime.textContent = file.testTime;
    modalRemarks.value = file.remarks;
    modalUploadTime.textContent = new Date(file.uploadTime).toLocaleString();
    modalDownloads.textContent = file.downloads;

    // 设置文件图标
    let { fileIcon, fileIconBg, fileIconColor } = getFileIconbyFileType(file.type)


    modalFileIcon.className = `w-12 h-12 rounded-lg ${fileIconBg} flex items-center justify-center`;
    modalFileIcon.innerHTML = `<i class="fa ${fileIcon} text-2xl ${fileIconColor}"></i>`;

    // 设置按钮事件
    downloadBtn.onclick = () => downloadFile(file);

    // 显示模态框
    fileModal.classList.remove('opacity-0', 'pointer-events-none');
    fileModal.querySelector('div').classList.remove('scale-95');
    fileModal.querySelector('div').classList.add('scale-100');
}

// 关闭文件模态框
function closeFileModal() {
    fileModal.classList.add('opacity-0', 'pointer-events-none');
    fileModal.querySelector('div').classList.remove('scale-100');
    fileModal.querySelector('div').classList.add('scale-95');
}
function closeApprovalModalFrame() {
    approvalModal.classList.add('opacity-0', 'pointer-events-none');
    approvalModal.querySelector('div').classList.remove('scale-100');
    approvalModal.querySelector('div').classList.add('scale-95');
}

// 关闭模态框事件
closeModal.addEventListener('click', closeFileModal);
closeApprovalModal.addEventListener('click', closeApprovalModalFrame);

// 点击模态框外部关闭
fileModal.addEventListener('click', (e) => {
    if (e.target === fileModal) {
        closeFileModal();
    }
});

// 显示上传进度
function showUploadProgress() {
    uploadProgressContainer.classList.remove('hidden');
};

// 隐藏上传进度
function hideUploadProgress() {
    uploadProgressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
};

// 文件拖放处理
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('border-primary', 'bg-primary/5');
    dropArea.classList.remove('border-gray-300');
}

function unhighlight() {
    dropArea.classList.remove('border-primary', 'bg-primary/5');
    dropArea.classList.add('border-gray-300');
}

// 处理文件拖放
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const myFiles = dt.files;
    fileInput.classList.remove('upload-area-active');
    if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
    }
}

// 处理文件选择
fileInput.addEventListener('change', () => {
    // 检查待上传区文件数目
    if (fileInput.files.length > 0) {
        fileInput.classList.remove('upload-area-active');
        addFiles(fileInput.files);
    }
});

// 文件上传按钮：
function uploadFiles() {
    if (fileInput.files.length === 0) return;
    handleFiles(fileInput.files)
    // 清空待上传区
    preFiles = [];
    updateFileList()
    uploadBtn.disabled = true
};

// 更新文件数据
function updateFileData(fileData) {
    renderMyFiles(myFiles)
    renderAllFiles(allFiles)
};

// 添加文件到UI:我的文件
function addFileToMyFile(file) {
    const newFile = {
        id: file.filename,
        name: file.filename,
        dataGroup: file.dataGroup,
        size: file.size,
        state: file.state || '已上传',
        type: file.type,
        uploader: file.uploader,
        uploadTime: file.uploadDate,
        downloads: file.downloads,
        testModel: file.testModel,
        testSpecification: file.testSpecification,
        testBatch: file.testBatch,
        testMember: file.testMember,
        testStandard: file.testStandard,
        testType: file.testType,
        testTime: file.testTime,
        testResult: file.testResult,
        remarks: file.remarks
    };

    // 检查是否存在
    const existingFile = myFiles.find(f => f.name === newFile.name);
    if (existingFile) {
        // 更新文件
        existingFile.size = newFile.size;
        existingFile.type = newFile.type;
        existingFile.uploadTime = newFile.uploadTime;
        return;
    } else {
        // 添加文件
        myFiles.unshift(newFile);
    }

    // 显示文件列表
    if (myFiles.length > 0) {
        emptyFilesState.classList.add('hidden');
        filesList.classList.remove('hidden');
        renderMyFiles(myFiles);
    }
}

// 添加文件到UI:所有文件
function addFileToAllFile(file) {
    const newFile = {
        id: file.filename,
        name: file.filename,
        dataGroup: file.dataGroup,
        size: file.size,
        state: file.state || '已上传',
        type: file.type,
        uploader: file.uploader,
        uploadTime: file.uploadDate,
        downloads: file.downloads,
        testModel: file.testModel,
        testSpecification: file.testSpecification,
        testBatch: file.testBatch,
        testMember: file.testMember,
        testStandard: file.testStandard,
        testType: file.testType,
        testTime: file.testTime,
        testResult: file.testResult,
        remarks: file.remarks
    };

    // 检查allFiles是否为空或不存在
    if (!allFiles || allFiles.length === 0) {
        allFiles = [newFile];
    } else {
        // 检查是否存在
        const existingFile = allFiles.find(f => f.name === newFile.name);
        if (existingFile) {
            // 更新文件
            existingFile.size = newFile.size;
            existingFile.type = newFile.type;
            existingFile.uploadTime = newFile.uploadTime;
            return;
        } else {
            // 添加文件
            allFiles.unshift(newFile);
        }
    }

    // 显示文件列表
    if (allFiles.length > 0) {
        // emptyFilesState.classList.add('hidden');
        allFilesList.classList.remove('hidden');
        renderAllFiles(allFiles)
    }
}

// 文件搜索
fileSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.trim() === '') {
        renderMyFiles(myFiles);
        return;
    }

    const filteredFiles = myFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm)
    );

    renderMyFiles(filteredFiles);
});

allFileSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm.trim() === '') {
        renderAllFiles(allFiles);
        return;
    }

    const filteredFiles = allFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm)
    );

    renderAllFiles(filteredFiles);
});

// 刷新文件列表
refreshBtn.addEventListener('click', () => {
    // 添加旋转动画
    refreshBtn.querySelector('i').classList.add('fa-spin');

    // 模拟刷新
    setTimeout(() => {
        loadFiles();
        refreshBtn.querySelector('i').classList.remove('fa-spin');
        showNotification('文件列表已刷新', 'info');
    }, 800);
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取文件类型名称
function getFileTypeName(mimeType) {
    if (mimeType.includes('image')) return '图片';
    if (mimeType.includes('pdf')) return 'PDF文档';
    if (mimeType.includes('docx')) return 'Word文档';
    if (mimeType.includes('presentation')) return '演示文稿';
    if (mimeType.includes('word')) return 'Word文档';
    if (mimeType.includes('sheet')) return 'Excel文档';
    if (mimeType.includes('excel')) return 'Excel文档';
    if (mimeType.includes('powerpoint')) return '演示文稿';
    if (mimeType.includes('video')) return '视频';
    if (mimeType.includes('audio')) return '音频';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '压缩文件';
    return '文件';
}


document.addEventListener('DOMContentLoaded', function () {
    // 获取所有可排序的表头
    const tables = document.querySelectorAll('.sortable-table');
    // const headers = table.querySelectorAll('.sortable-header');
    tables.forEach(table => {
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

                // 排序表格
                sortTable(table, index, currentSort.direction);
            });
        });

    });
});

// 排序表格函数
function sortTable(table, columnIndex, direction) {
    const tbody = table.querySelector('tbody');
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    // 确定排序函数
    const sortFn = (a, b) => {
        const aCell = a.querySelectorAll('td')[columnIndex];
        const bCell = b.querySelectorAll('td')[columnIndex];

        let aValue = aCell.textContent.trim();
        let bValue = bCell.textContent.trim();

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
    rowsArray.sort(sortFn);

    // 重新添加到表格
    rowsArray.forEach(row => tbody.appendChild(row));
}