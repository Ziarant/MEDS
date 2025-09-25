// 当前选中的文件
let selectedFiles = [];
let fileList = [];
let newId = generateUniqueId();

// DOM 元素
const dataGroupModal = document.getElementById('dataGroup-modal');
const testTypeModal = document.getElementById('testType-modal');
const testStandardModal = document.getElementById('testStandard-modal');
const testModelModal = document.getElementById('testModel-modal');
const testSpecificationModal = document.getElementById('testSpecification-modal');
const testBatchModal = document.getElementById('testBatch-modal');
const testBatchModalTooltip = document.getElementById('testBatchTooltip-modal');
const materialModal = document.getElementById('material-modal');
const testMemberModal = document.getElementById('testMember-modal');
const testTimeModal = document.getElementById('testTime-modal');
const resultStatusModal = document.getElementById('resultStatus-modal');
const resultModal = document.getElementById('result-modal');
const resultStrandardModal = document.getElementById('resultStrandard-modal');
const remarksModal = document.getElementById('modal-remarks');
const fileListEl = document.getElementById('fileList');
const closeDataModal = document.getElementById('close-data-modal');
const cancelBtn = document.getElementById('cancel-button');
const submitBtn = document.getElementById('submit-button');

function addTestData(item) {
    if (!item) {
        newId = generateUniqueId()
    } else {
        newId = item.id
    }
    addDataModal.classList.remove('opacity-0', 'pointer-events-none');
    addDataModal.classList.add('opacity-100', 'pointer-events-auto');
    renderFileList(item)
    if (item) {
        initModal(item)
    }
}

// 根据item初始化模态框
function initModal(item) {
    dataGroupModal.value = item.dataGroup;
    testTypeModal.value = item.testName;
    testStandardModal.value = item.testStandard;
    testSpecificationModal.value = item.testSpecification;
    testBatchModal.value = item.testBatch;
    testBatchModalTooltip.value = item.testBatchModalTooltip || "";
    materialModal.value = item.material;
    testMemberModal.value = item.tester;
    testTimeModal.value = item.testTime;
    resultStatusModal.value = item.resultStatus;
    resultModal.value = item.result;
    resultStrandardModal.value = item.resultStrandard;
    remarksModal.value = item.remark;
}

// 渲染文件列表
function renderFileList(item) {
    fileListEl.innerHTML = '';
    if (fileList.length === 0) {
        fileListEl.classList.add('hidden');
        return;
    }
    
    fileListEl.classList.remove('hidden');
    fileListEl.classList.add('grid', 'grid-cols-2')
    
    fileList.forEach(file => {
        const isSelected = selectedFiles.some(f => f.filename === file.filename);
        const fileItem = createFileListItem(file, isSelected);

        // 非管理员只能关联自己上传的文件
        if ( !group.includes('管理员')) {
            if (file.uploader !== username) {
                return
            }
        }
        
        if (file.state !== '已录入') {
            fileItem.classList.add('pending')
        }
        fileListEl.appendChild(fileItem);

        if (item) {
            // 文件勾选：
            testDataFiles = item.testDataFile;
            testDataFiles.forEach(fileName => {
                if (fileItem.getAttribute('data-file-filename') === fileName) {
                    const checkbox = fileItem.querySelector('input[type="checkbox"]');
                    checkbox.checked = true;
                };
        });
    }
    });

}

function addFileToAllFile(file) {
    fileList.push(file)
};
function addFileToMyFile(file) {};

// 创建文件列表项
function createFileListItem(file, isSelected) {
    const li = document.createElement('li');
    li.className = 'border border-gray-100 rounded-lg p-3 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 flex items-center';
    li.setAttribute('data-file-filename', file.filename);

    // 文件选中状态切换
    li.addEventListener('click', (e) => {
        if (e.target.type !== 'checkbox') {
            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            toggleFileSelection(file, checkbox.checked);
        }
    });
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'w-4 h-4 text-primary focus:ring-primary/50 border-gray-300 rounded cursor-pointer';
    checkbox.checked = isSelected;
    checkbox.addEventListener('change', () => toggleFileSelection(file, checkbox.checked));
    
    const fileName = document.createElement('div');
    fileName.className = 'text-lg font-medium text-gray-900 truncate px-2';
    fileName.textContent = file.filename;
    
    li.appendChild(checkbox);
    li.appendChild(fileName)
    
    return li;
}

// 切换文件选择状态
function toggleFileSelection(file, isSelected) {
    if (isSelected) {
        if (!selectedFiles.some(f => f.filename === file.filename)) {
            selectedFiles.push(file);
        }
    } else {
        selectedFiles = selectedFiles.filter(f => f.filename !== file.filename);
    }
}

// 关闭
function closeModal() {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
}

cancelBtn.addEventListener('click', ()=>closeModal());
closeDataModal.addEventListener('click', ()=>closeModal());
// 监听键盘事件，按下Esc键关闭模态框
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
        addDataModal.classList.add('opacity-0', 'pointer-events-none');
    }
});

submitBtn.addEventListener('click', () => {
    // 获取表单信息
    const now = new Date()
    let testFiles = []
    selectedFiles.forEach(file => {
        testFiles.unshift(file.filename)
    });
    // 检测必填项
    if (dataGroupModal.value === "" || resultStatusModal.value === "" || resultModal.value === "") {
        showNotification('数据不完整', 'error');
        return
    }
    if (testFiles.length === 0) {
        showNotification('缺少关联文件', 'error');
        return
    }
    const newData = {
        "dataGroup": dataGroupModal.value,
        "testName": testTypeModal.value,
        "testStandard": testStandardModal.value,
        "model": testModelModal.value,
        "testSpecification": testSpecificationModal.value,
        "material": materialModal.value,
        "tester": testMemberModal.value,
        "uploader": username,
        "testTime": testTimeModal.value,
        "inputTime": now.toLocaleDateString(),
        "testBatch" : testBatchModal.value,
        "testBatchTooltip" : testBatchModalTooltip.value,
        "result" : resultModal.value,
        "resultStatus": resultStatusModal.value,
        "resultStrandard": resultStrandardModal.value,
        "remark": remarksModal.value,
        "testDataFile" : testFiles,
        "approvalStatus" : "create",
        "id" : newId
    }
    uploadTestData(newData)
    closeModal();
})

// id生成：当前时间戳与随机数组合
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
  const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
  return `${timestamp}${random}`;
}
