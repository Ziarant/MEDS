const username = localStorage.getItem('username');
const totalProducts = document.getElementById('total-products');
const totalDrawingFiles = document.getElementById('total-drawing-files');
const totalModelFiles = document.getElementById('total-model-files');
const totalManualFiles = document.getElementById('total-manual-files');
const implantCount = document.getElementById('implant-count');
const abutmentCount = document.getElementById('abutment-count');
const instrumentCount = document.getElementById('instrument-count');
const glueCount = document.getElementById('glue-count');
const otherProductCount = document.getElementById('other-product-count');

const previewModal = document.getElementById('preview-modal');
const previewModalTitle = document.getElementById('preview-modal-title');
const closePreviewModalBtn = document.getElementById('close-preview-modal');

// 文件夹切换功能
document.querySelectorAll('.folder-item').forEach(item => {
    item.addEventListener('click', function() {
        // 移除其他文件夹的活跃状态
        document.querySelectorAll('.folder-item').forEach(folder => {
            folder.classList.remove('folder-active');
        });
        // 添加当前文件夹的活跃状态
        this.classList.add('folder-active');
        // 这里可以添加加载对应产品列表的逻辑
    });
});

// 侧边栏收起/展开功能
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const productTableContainer = document.getElementById('product-table-container');
const sidebarTitle = document.getElementById('sidebar-title');
let sidebarCollapsed = false;

toggleBtn.addEventListener('click', function() {
    sidebarCollapsed = !sidebarCollapsed;
    if (sidebarCollapsed) {
        // 收起侧边栏
        sidebar.classList.remove('md:w-3/8', 'lg:w-1/5');
        sidebar.classList.add('md:w-16', 'lg:w-16');
        productTableContainer.classList.remove('md:w-5/8', 'lg:w-4/5');
        productTableContainer.classList.add('md:w-[calc(100%-4rem)]', 'lg:w-[calc(100%-4rem)]');
        toggleBtn.innerHTML = '<i class="fa fa-angle-double-right text-xl text-gray-600" title="展开"></i>';
        document.querySelectorAll('#product-categories span, #sidebar-title span').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('#product-categories i').forEach(el => {
            el.classList.add('mx-auto');
        });
        document.getElementById('product-categories').classList.add('flex', 'flex-col', 'items-center');
    } else {
        // 展开侧边栏
        sidebar.classList.remove('md:w-16', 'lg:w-16');
        sidebar.classList.add('md:w-3/8', 'lg:w-1/5');
        productTableContainer.classList.remove('md:w-[calc(100%-4rem)]', 'lg:w-[calc(100%-4rem)]');
        productTableContainer.classList.add('md:w-5/8', 'lg:w-4/5');
        toggleBtn.innerHTML = '<i class="fa fa-angle-double-left text-xl text-gray-600" title="收起"></i>';
        document.querySelectorAll('#product-categories span, #sidebar-title span').forEach(el => {
            el.style.display = 'inline';
        });
        document.querySelectorAll('#product-categories i').forEach(el => {
            el.classList.remove('mx-auto');
        });
        document.getElementById('product-categories').classList.remove('flex', 'flex-col', 'items-center');
    }
});

// 添加产品按钮功能
const addProductModal = document.getElementById('add-product-modal');
const closeModal = document.getElementById('close-modal');
const cancelProduct = document.getElementById('cancel-product');

function addDataButtonClick() {
    addProductModal.classList.remove('opacity-0', 'pointer-events-none');
    addProductModal.querySelector('div').classList.remove('scale-95');
    addProductModal.querySelector('div').classList.add('scale-100');
}

function closeProductModal() {
    addProductModal.classList.add('opacity-0', 'pointer-events-none');
    addProductModal.querySelector('div').classList.remove('scale-100');
    addProductModal.querySelector('div').classList.add('scale-95');
}

closeModal.addEventListener('click', closeProductModal);
cancelProduct.addEventListener('click', closeProductModal);

// 初始化-获取产品
let productList, currentData = [], sortedData = [];
let currentPage = 1, itemsPerPage = 10;
let drawingFileCount = 0, modelFileCount = 0, manualFileCount = 0, productCount = 0;
let implantCountValue = 0, abutmentCountValue = 0, instrumentCountValue = 0, glueCountValue = 0, otherProductCountValue = 0;
updateProducts();

function updateProducts () {
    currentData = [];
    // 重置统计数据
    drawingFileCount = 0; modelFileCount = 0; manualFileCount = 0; productCount = 0;
    implantCountValue = 0; abutmentCountValue = 0; instrumentCountValue = 0; glueCountValue = 0; otherProductCountValue = 0;
    productList = getProductList(username)
    .then(data => {
        sortedData = [...data];
        sortedData = sortProducts()
        // TODO: 统计产品信息
        getCompanyCount();
        // TODO: 过滤筛选信息
        renderProducts();
    });
}

function getCompanyCount() {
    // 统计不同产品的信息
    const companyCount = {}, statusCount = {};
    sortedData.forEach(product => {
        if (companyCount[product.company]) {
            companyCount[product.company] += 1;
        } else {
            companyCount[product.company] = 1;
        }

        if (statusCount[product.productStatus]) {
            statusCount[product.productStatus] += 1;
        } else {
            statusCount[product.productStatus] = 1;
        }
    });
    // 更新公司数量显示
    const companySelect = document.getElementById('company-select');
    if (companySelect.children.length === 0) {
        Object.keys(companyCount).forEach(company => {
            const label = document.createElement('label');
            label.className = 'inline-flex items-center mr-4 mb-2';
            label.innerHTML = `
                <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="${company}" checked>
                <div class="ml-1 justify-between flex w-full">
                    <span class="ml-2 text-gray-700">${company}</span>
                    <span class="text-gray-400 ml-1" id="count-${company}">${companyCount[company]}</span>
                </div>
            `;
            companySelect.appendChild(label);
        });
    } else {
        Object.keys(companyCount).forEach(company => {
            const companyCountLable = document.getElementById(`count-${company}`);
            companyCountLable.textContent = companyCount[company] || 0;
        })
    }

    // 更新状态数量显示
    const statusSelect = document.getElementById('status-select');
    if (statusSelect.children.length === 0) {
        Object.keys(statusCount).forEach(status => {
            const label = document.createElement('label');
            label.className = 'inline-flex items-center mr-4 mb-2';
            label.innerHTML = `
                <input type="checkbox" class="form-checkbox h-4 w-4 text-blue-600" value="${status}" checked>
                <div class="ml-1 justify-between flex w-full">
                    <span class="ml-2 text-gray-700">${status}</span>
                    <span class="text-gray-400 ml-1" id="count-status-${status}">${statusCount[status]}</span>
                </div>
            `;
            statusSelect.appendChild(label);
        });
    } else {
        Object.keys(statusCount).forEach(status => {
            const statusCountLable = document.getElementById(`count-status-${status}`);
            statusCountLable.textContent = statusCount[status] || 0;
        })
    }
}

function sortProducts(sortBy = "productCode", sortOrder = "asc") {
    // TODO: 根据不同字段排序
    // 目前仅按产品编号排序
    sortedData.sort((a, b) => {
        const valueA = a.productCode.toUpperCase();
        const valueB = b.productCode.toUpperCase();
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });
    return sortedData;
}

function renderProducts() {
    // TODO: 分页
    // TODO: 当前渲染全部数据
    currentData = sortedData; // 目前不分页，直接显示所有数据
    const productTable = document.getElementById('product-table');
    const tbody = productTable.querySelector('tbody');
    tbody.innerHTML = ''; // 清空现有表格内容
    currentData.forEach(product => {
        const tr = document.createElement('tr');
        const files = product.files || [];
        let hasDrawing = 'hidden', hasModel = 'hidden', hasManual = 'hidden', hasUrl = 'hidden';
        let darwingTextColor = 'text-gray-400', modelTextColor = 'text-gray-400', manualTextColor = 'text-gray-400', urlTextColor = 'text-gray-400';
        let manualFileName = '', modelFileName = '', drawingFileName = '';
        if (product.productUrl) {hasUrl = ''; urlTextColor = 'text-blue-600';}
        files.forEach(file => {
            if (file.filename.endsWith('.pdf')) {
                manualFileCount += 1;
                hasManual = '';
                manualTextColor = 'text-blue-600';
                manualFileName = file.filename;
            } else if (file.filename.endsWith('.3d') || file.filename.endsWith('.stl') || file.filename.endsWith('.iges') ||
                       file.filename.endsWith('.obj') || file.filename.endsWith('.prt')|| file.filename.endsWith('.step') || file.filename.endsWith('.sldprt')) {
                modelFileCount += 1;
                hasModel = '';
                modelTextColor = 'text-blue-600';
                modelFileName = file.filename;
            } else if (file.mimetype.includes('drawing')) {
                drawingFileCount += 1;
                hasDrawing = '';
                darwingTextColor = 'text-blue-600';
            }
        });
        productCount += 1;
        if (product.productType === '牙种植体') {implantCountValue += 1;}
        else if (product.productType === '基台及附件') {abutmentCountValue += 1;}
        else if (product.productType === '手术器械') {instrumentCountValue += 1;}
        else if (product.productType === '骨粉与骨胶') {glueCountValue += 1;}
        else if (product.productType === '其他产品') {otherProductCountValue += 1;}

        let registrationCode = '------';
        if (product.registrationCode) {
            registrationCode = product.registrationCode;
        }
        let statusIcon = '<i class="fa fa-cogs text-gray-400 mr-2" title="研发中"></i>';
        if (product.productStatus === '已上市') {
            statusIcon = '<i class="fa fa-check-circle text-green-500 mr-2" title="已上市"></i>';
        } else if (product.productStatus === '已停产') {
            statusIcon = '<i class="fa fa-times-circle text-red-500 mr-2" title="已停产"></i>';
        } else if (product.productStatus === '研发中') {
            statusIcon = '<i class="fa fa-cogs text-gray-400 mr-2" title="研发中"></i>';
        } else if (product.productStatus === '试生产') {
            statusIcon = '<i class="fa fa-flask text-yellow-500 mr-2" title="试生产"></i>';
        }
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">${product.company}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-start text-black">
                ${statusIcon}${product.productCode}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">${product.productName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black" title="注册证信息:${product.registration}">
                ${registrationCode}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">${product.productSpec}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">
                <button class="${urlTextColor} hover:underline edit-btn ${hasUrl}" data-id="${product.id}" title="产品网址">
                    <i class="fa fa-globe text-xl"></i>
                </button>
                <button class="${darwingTextColor} hover:underline ml-2 edit-btn ${hasDrawing}" data-id="${product.id}" title="图纸:${drawingFileName}">
                    <i class="fa fa-file-pdf text-xl"></i>
                </button>
                <button class="${modelTextColor} hover:underline ml-2 edit-btn ${hasModel}" data-id="${product.id}" title="3D模型:${modelFileName}">
                    <i class="fa fa-cubes text-xl"></i>
                </button>
                <button class="${manualTextColor} hover:underline ml-2 preview-btn ${hasManual}" data-id="${product.id}" title="产品手册:${manualFileName}">
                    <i class="fa fa-book text-xl"></i>
                </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 view-btn" data-id="${product.id}">查看详情</button>
            </td>
        `;
        tr.querySelector('.preview-btn').addEventListener('click', () => {
            // 打开预览模态框
            const file = files.find(f => f.filename === manualFileName);
            previewFile(file);
        });
        tbody.appendChild(tr);
    });

    totalProducts.textContent = productCount;
    totalDrawingFiles.textContent = drawingFileCount;
    totalModelFiles.textContent = modelFileCount;
    totalManualFiles.textContent = manualFileCount;
    implantCount.textContent = implantCountValue;
    abutmentCount.textContent = abutmentCountValue;
    instrumentCount.textContent = instrumentCountValue;
    glueCount.textContent = glueCountValue;
    otherProductCount.textContent = otherProductCountValue;
}

// 文件预览：
function previewFile(file) {
    previewModal.classList.remove('hidden');
    previewModalTitle.textContent = file.filename;
    let embed;
    embed = document.getElementById('pdf-embed') 
    let fileURL = previewByPath(file.filepath)
    .then(fileURL => {
        embed.src = fileURL;
    })
    embed.classList.remove('hidden')
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

closePreviewModalBtn.addEventListener('click', () => {
    previewModal.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复背景滚动
})
