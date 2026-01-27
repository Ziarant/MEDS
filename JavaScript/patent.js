const username = localStorage.getItem('username');
const tableBody = document.getElementById('patent-table-body');

// 初始化：获取并渲染专利信息
let patentList, currentData = [], sortedData = [];
updatePatents();

function updatePatents() {
    currentData = [];
    patentList = getPatentList(username)
    .then(data => {
        // TODO：排序和过滤
        sortedData = [...data]; // 创建数据的副本以进行排序和过滤 -> currentData
        // const sortBy = sortSelect.value
        // sortedData = sortWorkFlow(sortBy);
        currentData = sortedData;
        renderPatents();
    })
}

function renderPatents() {
    // TODO: 分页(目前未分页，直接显示所有数据)
    tableBody.innerHTML = ''; // 清空表格内容
    currentData.forEach(item => {
        if (item.patentTitle === "") return; // 跳过无效项
        const row = document.createElement('tr');
        let rightStatus = '<span class="text-green-600 font-semibold rounded-lg border border-gray-400 px-1 mr-2">有权</span>';
        if (item.rightStatus === '无权') {
            rightStatus = '<span class="text-red-600 font-semibold rounded-lg border border-gray-400 px-1 mr-2">无权</span>';
        } else if (item.rightStatus === '审中') {
            rightStatus = '<span class="text-yellow-600 font-semibold rounded-lg border border-gray-400 px-1 mr-2">审中</span>';
        }
        row.innerHTML = `
            <td>${rightStatus}${item.applicationNumber}</td>
            <td>
                <button class="preview-file rounded-lg bg-primary/20 px-2 text-gray-800 transition-colors" title="预览">
                    ${item.patentTitle}
                </button>
            </td>
            <td>${item.patentType}</td>
            <td class="hidden" data-column="申请人">${item.applicants}</td>
            <td title="预计到期：${item.expirationDate}">${item.publicationDate}</td>
            <td>${item.agency}</td>
            <td>
                <button class="bg-primary/30 text-gray-900 hover:bg-primary hover:text-white px-1 py-1 rounded-lg view-patent-btn" data-id="${item.id}">
                <i class="far fa-ballot-check"></i>详情
                </button>
            </td>
        `;
        row.querySelector('.preview-file').addEventListener('click', () => {
            previewFile(item.patentFilePath)
        });
        tableBody.appendChild(row);
    });
}

// 文件预览：
function previewFile(file) {
    let fileURL = previewByPath(file)
    .then(fileURL => {
        // 在新页面打开url:
        window.open(fileURL, '_blank')
    })
}