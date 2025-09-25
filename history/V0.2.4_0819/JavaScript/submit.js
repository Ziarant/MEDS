// 常量
const uploader = localStorage.getItem('username');
const templateBtn = document.getElementById('pre-template');
const templateModal = document.getElementById('template-modal');
const templateFileList = document.getElementById('template-fileList');
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-input');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const progressBar = document.getElementById('progress-bar');
const progressPercentage = document.getElementById('progress-percentage');
const progressFilename = document.getElementById('progress-filename');
const uploadBtn = document.getElementById('upload-btn');
const clearBtn = document.getElementById('clear-btn');
const filesPreviewList = document.getElementById('files-preview-list')
const emptyFilesState = document.getElementById('empty-files-state');
const filesList = document.getElementById('files-list');
const allFilesList = document.getElementById('all-files-list');
const filesBody = document.getElementById('files-body');
const allFilesBody = document.getElementById('all-files-body');
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
const modalFileType = document.getElementById('modal-filetype');
const modalUploadTime = document.getElementById('modal-upload-time');
const modalDownloads = document.getElementById('modal-downloads');
const modalFileIcon = document.getElementById('modal-file-icon');
const modalProject = document.getElementById('modal-project')
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
const previewBtn = document.getElementById('preview-btn');
const downloadBtn = document.getElementById('download-btn');
const previewModal = document.getElementById('preview-modal');
const previewModalTitle = document.getElementById('preview-modal-title')
const pdfEmbed = document.getElementById('pdf-embed');
const closePreviewModal = document.getElementById('close-preview-modal');
const deeBtn = document.getElementById('dee-btn');
const refreshBtn = document.getElementById('refresh-btn');
const navbar = document.getElementById('navbar');
//
const otherGroupInputContainer = document.getElementById('otherGroup-div');
const otherGroupInput = document.getElementById('otherGroup-input')
// 表格元素
const myTable = document.getElementById('sortabable');
const allTable = document.getElementById('all-sortabable');

// 变量
 projectNum = document.getElementById('project').value           // 项目编号
 dataGroup = document.getElementById('device-type').value;       // 默认器械类别，需要与文件关联，否则刷新错误覆盖
 testModel = document.getElementById('test-model').value;        // 器械型号
 testSpecification = document.getElementById('test-specification').value;    // 器械规格
 testBatch = document.getElementById('test-batch').value;        // 器械批次
 testType = document.getElementById('test-type').value;          // 默认测试类型
 testStandard = document.getElementById('test-standard').value;  // 测试标准
 testMember = document.getElementById('test-member').value       // 测试人员
 testTime = document.getElementById('test-time').value;          // 测试时间
 remarks = document.getElementById('remarks').value;             // 默认备注
 testResult = document.getElementById('test-result').value;      // 默认测试结果
 feedbackMember = document.getElementById('feedback-member').value
 feedbackTime = document.getElementById('feedback-time').value

// 模拟文件数据
 preFiles = []
 myFiles = [];
 allFiles = [];
 noPassCount = 0
 noPassMyCount = 0

// 按钮事件：
uploadBtn.addEventListener('click', uploadFiles)
clearBtn.addEventListener('click', clearFiles)

templateBtn.addEventListener('click', () => {
    const closeTemplateModal = document.getElementById('close-template-modal');
    // 显示模态框
    templateModal.classList.remove('opacity-0', 'pointer-events-none');
    templateModal.querySelector('div').classList.remove('scale-95');
    templateModal.querySelector('div').classList.add('scale-100');
    document.body.style.overflow = templateModal.classList.contains('hidden') ? '' : 'hidden'; // 防止背景滚动
    if (!templateModal.classList.contains('hidden')) {
        // 模态框显示时加载文件列表
        loadFiemplates();
    }

    closeTemplateModal.addEventListener('click', () => {
        templateFileList.innerHTML = ''; // 清空文件列表
        templateModal.classList.add('opacity-0', 'pointer-events-none');
        templateModal.querySelector('div').classList.remove('scale-100');
        templateModal.querySelector('div').classList.add('scale-95');
        document.body.style.overflow = ''; // 恢复背景滚动
    });
});

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

// 加载文件模板列表
function loadFiemplates() {
    // 将我的文件以按钮的形式显示在列表中
    myFiles.forEach(file => {
        const fileItem = document.createElement('button');
        fileItem.className = 'file-template-item bg-gray-50 rounded-lg p-4 mb-2 w-full text-left hover:bg-primary/30 transition-colors';
        fileItem.role = 'checkbox';
        fileItem.textContent = file.name;
        fileItem.onclick = () => {
            // 选择文件模板,填充表单
            document.getElementById('project').value = file.projectNum || '';
            document.getElementById('device-type').value = file.dataGroup || '';
            document.getElementById('test-model').value = file.testModel || '';
            document.getElementById('test-specification').value = file.testSpecification || '';
            document.getElementById('test-batch').value = file.testBatch || '';
            document.getElementById('test-type').value = file.testType || '';
            document.getElementById('test-standard').value = file.testStandard || '';
            document.getElementById('test-member').value = file.testMember || '';
            document.getElementById('test-time').value = file.testTime || '';
            document.getElementById('test-result').value = file.testResult || '';
            document.getElementById('remarks').value = file.remarks || '';
            document.getElementById('feedback-member').value = file.feedbackMember || '';
            document.getElementById('feedback-time').value = file.feedbackTime || '';

            // 变量
            projectNum = document.getElementById('project').value           // 项目编号
            dataGroup = document.getElementById('device-type').value;       // 默认器械类别，需要与文件关联，否则刷新错误覆盖
            testModel = document.getElementById('test-model').value;        // 器械型号
            testSpecification = document.getElementById('test-specification').value;    // 器械规格
            testBatch = document.getElementById('test-batch').value;        // 器械批次
            testType = document.getElementById('test-type').value;          // 默认测试类型
            testStandard = document.getElementById('test-standard').value;  // 测试标准
            testMember = document.getElementById('test-member').value       // 测试人员
            testTime = document.getElementById('test-time').value;          // 测试时间
            remarks = document.getElementById('remarks').value;             // 默认备注
            testResult = document.getElementById('test-result').value;      // 默认测试结果
            feedbackMember = document.getElementById('feedback-member').value
            feedbackTime = document.getElementById('feedback-time').value
        };
        templateFileList.appendChild(fileItem);
    });
    // 如果没有文件模板，显示提示信息
    if (myFiles.length === 0) {
        templateFileList.innerHTML = `
            <div class="text-center py-10 text-gray-500">
                <i class="fa fa-file-o text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-lg font-medium text-gray-700 mb-2">暂无文件模板</h3>
                <p class="text-gray-500 max-w-md mx-auto">请先上传文件以创建模板。</p>
            </div>
        `;
    }
};

// 加载文件列表
function loadFiles() {
    // 从服务器获取文件列表
    fileData = fetchFileData(uploader)
    updateFileData(uploader)
}

// 监测待上传文件列表中的文件数目:超过限制时给出提示
function countPreFiles() {
    const fileRows = filesPreviewList.querySelectorAll('.file-item')
    if (fileRows.length > 20) {
        document.getElementById('warning-files-limit').classList.remove('hidden')
    } else {
        document.getElementById('warning-files-limit').classList.add('hidden')
    }
}

// 选择框变动
document.getElementById('project').addEventListener('change', (e) => {
    projectNum = e.target.value;
});
document.getElementById('device-type').addEventListener('change', (e) => {
    otherGroupInput.value = '';
    dataGroup = e.target.value;
    if (dataGroup !== '其他') {
        otherGroupInputContainer.style.display = 'none';
        e.target.classList.replace('col-span-1', 'col-span-3')
    } else {
        e.target.classList.replace('col-span-3', 'col-span-1')
        otherGroupInputContainer.style.display = 'block';
        // 聚焦到输入框
        setTimeout(() => otherGroupInput.focus(), 100);
    }
    
});
document.getElementById('test-model').addEventListener('change', (e) => {
    testModel = e.target.value;
});
document.getElementById('test-specification').addEventListener('change', (e) => {
    testSpecification = e.target.value;
});
document.getElementById('test-batch').addEventListener('change', (e) => {
    testBatch = e.target.value;
    if (testBatch === '上市产品') {
        document.getElementById('feedback-member-div').classList.remove('hidden');
        document.getElementById('feedback-time-div').classList.remove('hidden');
    } else {
        document.getElementById('feedback-member-div').classList.add('hidden');
        document.getElementById('feedback-time-div').classList.add('hidden');
    }
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

// 添加文件到待上传列表preFiles
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
        // preFiles.push(file)
        preFiles.push({
            id: Date.now() + '_' + file.name,
            file: file,
            status: '已上传',
            progress: 0
        });
    });

    // 更新文件列表显示
    updateFileList();

    // 显示通知
    showNotification(`已添加 ${newFiles.length} 个文件到待上传列表`, 'success');
}

// 更新文件列表显示
function updateFileList() {
    // 清空现有列表
    filesPreviewList.innerHTML = '';

    if (preFiles.length === 0) {
        // 显示空状态
        filesPreviewList.innerHTML = `
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
        const FileType = getFileTypeName(fileItem.file.name);

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

        filesPreviewList.appendChild(fileItemEl);

        // 触发动画
        setTimeout(() => {
            fileItemEl.classList.remove('file-item-enter');
            fileItemEl.classList.add('file-item-enter-active');
        }, 10);

        // 绑定删除按钮事件：将文件从selectedFiles列表中删除
        const removeBtn = fileItemEl.querySelector('.remove-file');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileId = e.currentTarget.getAttribute('data-id');
            removeFile(fileId);
            countPreFiles()
        });
    });
    countPreFiles();
}

// 移除文件
function removeFile(fileId) {
    preFiles = preFiles.filter(file => file.id !== fileId);
    updateFileList();
    showNotification('文件已从待上传列表中移除', 'info');
}

// 清空文件列表
function clearFiles() {
    if (preFiles.length === 0) return;

    preFiles = [];
    updateFileList();
    showNotification('所有文件已从待上传列表中移除', 'info');
}

// 根据file类型输出fileIcon、fileIconColor
function getFileIconbyFileType(type) {
     fileIcon = 'fa-file';
     fileIconBg = 'bg-gray-100';
     fileIconColor = 'text-gray-400';

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
        // 拒绝标记
        rejectFile(file)
        closeApprovalModalFrame();
    }
    cancelBtn.onclick = () => closeApprovalModalFrame()
}

// 打开文件模态框
function openFileModal(file) {
    modalTitle.textContent = '文件详情';
    modalFilename.textContent = file.name;
    modalFilesize.textContent = formatFileSize(file.size);
    modalFileType.textContent = getFileTypeName(file.type);
    modalProject.textContent = file.projectNum
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

    if (file.type.includes('image') || file.type.includes('pdf')) {
        previewBtn.classList.remove('hidden'); 
    } else {
        previewBtn.classList.add('hidden');
    }


    // 设置按钮事件
    previewBtn.onclick = () => previewFile(file);
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

// 文件预览：
function previewFile(file) {
    previewModal.classList.remove('hidden');
    previewModalTitle.textContent = file.name;
    let embed;
    console.log(file.type)
    if (file.type.includes('image')) {
        embed = document.getElementById('image-embed')
    } else if (file.type.includes('pdf')) {
        embed = document.getElementById('pdf-embed')  
    } else {
        embed = document.getElementById('other-embed')
        showNotification('该文件类型不支持预览', 'error');
    }
    let fileURL = getFile(file.name)
    .then(fileURL => {
        console.log(fileURL)
        embed.src = fileURL;
    })
    embed.classList.remove('hidden')
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

closePreviewModal.addEventListener('click', () => {
    previewModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
})

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

// 更改上传进度
function changeUploadProgress(p) {
    const formattedPercentage = p.toFixed(2);
    progressBar.style.width = `${formattedPercentage}%`;
    progressPercentage.textContent = `${formattedPercentage}%`;
}

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
     files = []
    preFiles.forEach(fileItem => {
        files.push(fileItem.file);
    });
    handleFiles(files)
    // 清空待上传区
    preFiles = [];
    updateFileList()
    uploadBtn.disabled = true
};

// 更新文件数据
function updateFileData(fileData) {
    renderMyFiles(myFiles)
    renderAllFiles(allFiles)
    renderPaginationButtons(paginationMyNumbers);
    renderPaginationButtons(paginationNumbers);
};

// 添加文件到UI:我的文件
function addFileToMyFile(file) {
    const newFile = {
        id: file.filename,
        name: file.filename,
        projectNum: file.projectNum || '',
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
        feedbackMember : file.feedbackMember,
        feedbackTime : file.feedbackTime,
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
        myFiles.push(newFile);
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
        projectNum: file.projectNum || '',
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
        feedbackMember : file.feedbackMember,
        feedbackTime : file.feedbackTime,
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
            allFiles.push(newFile);
        }
    }

    // 显示文件列表
    if (allFiles.length > 0) {
        // emptyFilesState.classList.add('hidden');
        allFilesList.classList.remove('hidden');
        renderAllFiles(allFiles)
        renderPaginationButtons(paginationNumbers);
    }
}


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
    tables.forEach(table => {
        const headers = table.querySelectorAll('.sortable-header');
        // 存储当前排序状态
         currentSort = {
            column: null,
            direction: 'up' // 'up' 或 'down'
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
                    currentSort.direction = currentSort.direction === 'up' ? 'down' : 'up';
                } else {
                    // 设置新的排序列
                    currentSort.column = index;
                    currentSort.direction = 'up';
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
    const header = Array.from(table.querySelectorAll('th'))[columnIndex].innerText;

    // 确定排序函数
    const sortFn = (a, b) => {
         aValue, bValue;
        switch(header) {
            case "文件名":
                aValue = a.id;
                bValue = b.id;
                break;
            case "器械类别":
                aValue = a.dataGroup;
                bValue = b.dataGroup;
                break;
            case "大小":
                aValue = a.size;
                bValue = b.size;
                break;
            case "上传人":
                aValue = a.uploader;
                bValue = b.uploader;
                break;
            case "上传时间":
                aValue = new Date(a.uploadTime);
                bValue = new Date(b.uploadTime);
                break;
            case "处理状态":
                aValue = a.state;
                bValue = b.state;
                break;
        }

        // // 特殊处理：日期排序
        // if ((typeof aValue === 'string' || aValue instanceof String) && aValue.match(/\d{4}-\d{2}-\d{2}/)) {
            
        // }

        // 特殊处理：数字排序
        if (!isNaN(parseFloat(aValue)) && isFinite(aValue)) {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        }

        // 排序逻辑
        if (aValue < bValue) return direction === 'up' ? -1 : 1;
        if (aValue > bValue) return direction === 'up' ? 1 : -1;
        return 0;
    };

    if(tbody.id === 'all-files-body'){
        const currentArray = Array.from(allFiles)
        currentArray.sort(sortFn);
        renderAllFiles(currentArray)
    }else if(tbody.id === 'files-body'){
        const currentArray = Array.from(myFiles)
        currentArray.sort(sortFn);
        renderMyFiles(currentArray)
    }
}