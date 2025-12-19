const username = localStorage.getItem('username');
const totalProducts = document.getElementById('total-products');
const totalDrawingFiles = document.getElementById('total-drawing-files');
const totalModelFiles = document.getElementById('total-model-files');
const totalManualFiles = document.getElementById('total-manual-files');
// 
const apolloCodeBtn = document.getElementById('apollo-code-btn');
// 数量统计
const implantCount = document.getElementById('implant-count');
const abutmentCount = document.getElementById('abutment-count');
const attachmentCount = document.getElementById('attachment-count');
const instrumentCount = document.getElementById('instrument-count');
const tadCount = document.getElementById('tad-count');
const glueCount = document.getElementById('glue-count');
const otherProductCount = document.getElementById('other-product-count');
// 按钮：
const filterBtn = document.getElementById('apply-filter-button');

const previewModal = document.getElementById('preview-modal');
const previewModalTitle = document.getElementById('preview-modal-title');
const closePreviewModalBtn = document.getElementById('close-preview-modal');

// 产品编码规则弹窗
apolloCodeBtn.addEventListener('click', () => {
    document.getElementById('code-category-apollo').classList.remove('hidden');
});
document.getElementById('close-category-apollo').addEventListener('click', () => {
    document.getElementById('code-category-apollo').classList.add('hidden');
});

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

        //如果是“手术器械”，则展开下级菜单set-item
        const dataType = this.querySelector('.data-type').textContent;
        
        if (dataType === '手术器械') {
            const setItems = document.querySelectorAll('.set-item')
            setItems.forEach(setItem => {
                setItem.classList.remove('hidden');
            });
        } else {
            const setItems = document.querySelectorAll('.set-item')
            setItems.forEach(setItem => {
                if (!setItem.classList.contains('hidden')) {
                    setItem.classList.add('hidden');  
                }
            });
        }
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

// 过滤按钮功能
filterBtn.addEventListener('click', () => {
    currentData = filterProducts();
    updateProducts();
});

// 类别过滤按钮
document.querySelectorAll('.folder-item').forEach(item => {
    item.addEventListener('click', () => {
        currentData = filterProducts();
        updateProducts();
    });
});

// 搜索输入框
document.getElementById('product-search-input').addEventListener('change', () => {
    currentData = filterProducts();
    updateProducts();
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
let implantCountValue = 0, abutmentCountValue = 0, attachmentCountValue = 0, instrumentCountValue = 0, glueCountValue = 0, tadCountValue = 0, otherProductCountValue = 0;
updateProducts();

function updateProducts () {
    currentData = [];
    // 重置统计数据
    drawingFileCount = 0; modelFileCount = 0; manualFileCount = 0; productCount = 0;
    implantCountValue = 0; abutmentCountValue = 0; attachmentCountValue =0; instrumentCountValue = 0; glueCountValue = 0; tadCountValue = 0; otherProductCountValue = 0;
    productList = getProductList(username)
    .then(data => {
        sortedData = [...data];
        sortedData = sortProducts();
        const duplicateIds = findDuplicateIds()
        if(duplicateIds.length > 0) {
            showNotification('存在重复元素', 'error')
            duplicateIds.forEach(id => {
            console.log(id)
        })
    }
        
    currentData = filterProducts();
    getCompanyCount();// 统计不同产品的信息,更新筛选选项(公司和状态)
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

        // 统计各类别产品数量
        if (product.productType === '牙种植体') {implantCountValue += 1;}
        else if (product.productType === '基台') {abutmentCountValue += 1;}
        else if (product.productType === '附件') {attachmentCountValue += 1;}
        else if (product.productType === '手术器械') {instrumentCountValue += 1;}
        else if (product.productType === '骨粉与骨胶') {glueCountValue += 1;}
        else if (product.productType === '支抗钉') {tadCountValue += 1;}
        else {otherProductCountValue += 1;}
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

function filterProducts() {
    // 类别过滤：
    const typeItems = document.querySelectorAll('.folder-item')
    let selectedType = '';
    typeItems.forEach(item => {
        if(item.classList.contains('folder-active')) {
            selectedType = item.querySelector('.data-type').textContent;
        }
    });


    // 根据筛选条件过滤产品
    currentData = sortedData.filter(product => {
        // 公司筛选
        const selectedCompanies = Array.from(document.querySelectorAll('#company-select input[type="checkbox"]:checked')).map(cb => cb.value);
        if (selectedCompanies.length > 0 && !selectedCompanies.includes(product.company)) {
            return false;
        }
        // 状态筛选
        const selectedStatuses = Array.from(document.querySelectorAll('#status-select input[type="checkbox"]:checked')).map(cb => cb.value);
        if (selectedStatuses.length > 0 && !selectedStatuses.includes(product.productStatus)) {
            return false;
        }
        // 类型筛选
        if (selectedType === '其他产品') {
            return !(product.productType === '牙种植体' || product.productType === '基台' || product.productType === '附件' || product.productType === '手术器械' || product.productType === '骨粉与骨胶' || product.productType === '支抗钉');
        }
        else if (selectedType && product.productType !== selectedType) {
            return false;
        }
        // 关键字搜索过滤:(公司、编号、名称、规格、注册证)
        const searchInput = document.getElementById('product-search-input').value.trim().toLowerCase();
        if (searchInput) {
            const companyMatch = product.company.toLowerCase().includes(searchInput);
            const codeMatch = product.productCode.toLowerCase().includes(searchInput);
            const nameMatch = product.productName.toLowerCase().includes(searchInput);
            const specMatch = product.productSpec.toLowerCase().includes(searchInput);
            const regMatch = product.registrationCode.toLowerCase().includes(searchInput);
            if (!companyMatch && !codeMatch && !nameMatch && !specMatch && !regMatch) {
                return false;
            }
        }
        return true;
    });
    return currentData;
}

function renderProducts() {
    // TODO: 分页(目前未分页，直接显示所有数据)
    const productTable = document.getElementById('product-table');
    const tbody = productTable.querySelector('tbody');
    tbody.innerHTML = ''; // 清空现有表格内容
    const drawingList = [], manualList = []
    currentData.forEach(product => {
        const tr = document.createElement('tr');
        const files = product.files || [];
        let hasDrawing = 'hidden', hasModel = 'hidden', hasManual = 'hidden', hasUrl = 'hidden', hasProgram = 'hidden';
        let darwingTextColor = 'text-gray-400', modelTextColor = 'text-gray-400', manualTextColor = 'text-gray-400', urlTextColor = 'text-gray-400', programTextColor = 'text-purple-400';
        let manualFileName = '', modelFileName = '', drawingFileName = '', programFileName = '';
        if (product.productUrl) {hasUrl = ''; urlTextColor = 'text-blue-600';}
        files.forEach(file => {
            if (file.description === '产品手册') {
                if(manualList.indexOf(file.filename) === -1) {
                    manualList.push(file.filename)
                }
                hasManual = '';
                manualTextColor = 'text-yellow-600';
                manualFileName = file.filename;
            } else if (file.description === '3D模型' || file.description === '3D') {
                modelFileCount += 1;
                hasModel = '';
                modelTextColor = 'text-lime-600';
                modelFileName = file.filename;
            } else if (file.description === '2D图纸' || file.description === '2D') {
                if(drawingList.indexOf(file.filename) === -1) {
                    drawingList.push(file.filename)
                }
                hasDrawing = '';
                darwingTextColor = 'text-blue-600';
            } else if (file.description === '加工程序') {
                hasProgram = '';
                programTextColor = 'text-purple-600';
                programFileName = file.filename;
            }
        });
        productCount += 1

        let registrationCode = '------';
        if (product.registrationCode) {
            registrationCode = product.registrationCode;
        }
        let statusIcon = '<i class="fa fa-cogs text-gray-400 mr-2" title="研发中"></i>';
        if (product.productStatus === '已上市') {
            statusIcon = '<i class="fa fa-check-circle text-green-500 mr-2" title="已上市"></i>';
        } else if (product.productStatus === '已停产/未注册') {
            statusIcon = '<i class="fa fa-times-circle text-red-500 mr-2" title="已停产/未注册"></i>';
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black" title="${product.registration}">
                ${registrationCode}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">${product.productSpec}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">
                <button class="${urlTextColor} hover:underline edit-btn ${hasUrl}" data-id="${product.id}" title="产品网址">
                    <i class="fa fa-globe text-xl"></i>
                </button>
                <button class="${darwingTextColor} hover:underline ml-2 download-btn ${hasDrawing}" data-id="${product.id}" title="2D图纸:${drawingFileName}">
                    <img class="h-[1.35rem] bg-blue-100 text-xl" src="../../icon/2D图纸.png">
                </button>
                <button class="${modelTextColor} hover:underline ml-2 download-btn ${hasModel}" data-id="${product.id}" title="3D模型:${modelFileName}">
                    <i class="fa fa-cubes text-xl"></i>
                </button>
                <button class="${programTextColor} hover:underline ml-2 download-btn ${hasProgram}" data-id="${product.id}" title="加工程序:${programFileName}">
                    <i class="fa fa-code text-xl"></i>
                </button>
                <button class="${manualTextColor} hover:underline ml-2 download-btn ${hasManual}" data-id="${product.id}" title="产品手册:${manualFileName}">
                    <i class="fa fa-book text-xl"></i>
                </button>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-black">
                <button class="text-indigo-600 hover:text-indigo-900 mr-2 details-btn" data-id="${product.id}">查看详情</button>
            </td>
        `;
        tr.querySelectorAll('.download-btn').forEach(btn => btn.addEventListener('click', (e) => {
            // 打开下载(预览)列表
            const filesModal = document.createElement('div')
            filesModal.className = 'fixed bg-gray-50 top-1/2 left-1/2 w-[70%] max-h-[80%] border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-lg z-40';
            filesModal.id = 'files-modal'
            const title = btn.title.split(':')[0]
            const fileType = btn.title.split(':')[1].split('.')[1]
            filesModal.innerHTML = `
                <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3 md-1">
                    <div>
                        <h3 class="text-2xl font-semibold">${title}</h3>
                    </div>
                    <button id="close-fileModal" class="text-gray-400 hover:text-primary transition-colors">
                            <i class="fa fa-times"></i>
                    </button>
                </div>
                <hr />
                <div class="w-full max-h-[70vh] bg-gray-100 overflow-y-auto">
                    <table class="file-list w-full bg-gray-100"></table>
                </div>
            `

            const fileListDiv = filesModal.querySelector('.file-list')
            files.forEach(file => {
                description = file.description
                // 匹配对应类型的文件:2D图纸、3D模型、产品手册、产品网址、加工程序
                if (title.includes(description)) {
                    const row = renderRow(file);
                    fileListDiv.append(row)
                }
            })
            
            // filesModal.append(fileListDiv)

            const addDIv = document.createElement('div')
            addDIv.className = 'text-sm text-gray-600'
            addDIv.innerHTML = `
                <hr />
                <div class="flex justify-end">
                    <button id="add-more-files-btn" class="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors">
                        添加更多${title}文件
                    </button>
                </div>
            `
            filesModal.append(addDIv)

            // 添加到页面(如已有，移除旧有模态框)
            if (document.getElementById('files-modal') !== null) {
                const oldModal = document.getElementById('files-modal');
                oldModal.remove()
            }
            document.body.appendChild(filesModal)
            document.getElementById('close-fileModal').addEventListener('click' , () => {
                filesModal.remove();
                document.body.style.overflow = '';
            })

            // 背景模糊+防止滚动
            document.body.style.overflow = 'hidden'
        }));
        tr.querySelector('.details-btn').addEventListener('click', () => {
            // 打开详情页面
            openProductDetails(product.id);
        });
        tbody.appendChild(tr);
    });

    totalProducts.textContent = productCount;
    totalDrawingFiles.textContent = drawingList.length;
    totalModelFiles.textContent = modelFileCount;
    totalManualFiles.textContent = manualList.length;
    implantCount.textContent = implantCountValue;
    abutmentCount.textContent = abutmentCountValue;
    attachmentCount.textContent = attachmentCountValue;
    instrumentCount.textContent = instrumentCountValue;
    tadCount.textContent = tadCountValue;
    glueCount.textContent = glueCountValue;
    otherProductCount.textContent = otherProductCountValue;
}

function renderRow(file) {
    fileName = file.filename;
    filePath = file.filepath;
    fileVersion = file.version || ''
    const row = document.createElement('tr');
    row.className = 'grid grid-cols-10 border-b border-gray-100 hover:bg-primary/20 transition-colors';
    let isVisible = 'hidden'
    if (fileName.includes('.pdf')) { 
        isVisible = ''
    }

    // 创建表格行
    row.innerHTML = `
        <td class="col-span-6 py-2 px-4">
            <div class="flex items-center">
                <div class="w-4 h-4 rounded text-sm flex items-center justify-center mr-3">
                    <i class="fa fa-circle"></i>
                </div>
                <span class="font-medium text-gray-800 w-full">${fileName}</span>
            </div>
        </td>
        <td class="col-span-3 flex items-center py-2 px-4 ml-3 mr-3">
            <span class="font-medium text-gray-800 truncate max-w-xs">
                <span class="border border-gray-300 bg-gray-200 rounder-lg">版本</span>
                ${fileVersion}
            </span>
        </td>
        <td class="col-span-1 py-2 px-4 text-right">
            <div class="flex justify-end space-x-1">
                <button class="${isVisible} preview-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="预览">
                    <i class="fa fa-eye"></i>
                </button>
                <button class="download-file p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="下载">
                    <i class="fa fa-download"></i>
                </button>
            </div>
        </td>
        `;
    row.querySelector('.download-file').addEventListener('click', () => {
            downloadByPath(filePath, fileName)
        });
    row.querySelector('.preview-file').addEventListener('click', () => {
            previewFile(file)
        });
        return row
}

// 文件预览：
function previewFile(file) {
    let fileURL = previewByPath(file.filepath)
    .then(fileURL => {
        // 在新页面打开url:
        window.open(fileURL, '_blank')
    })
}

// 根据id获取产品详情
function getProductDetails(productId) {
    // 从sortedData中查找对应的产品
    let p = null;
    sortedData.forEach(product => {
        if (product.id === productId) {
            p = product;
        }
    });
    return p;
}

// 打开产品详情页面
function openProductDetails(productId) {
    const detailsModal = document.createElement('div');
    detailsModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30';
    detailsModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[80vh] overflow-y-auto p-6 relative">
            <button id="close-details-modal" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                <i class="fa fa-times text-2xl"></i>
            </button>
            <h2 id="product-details-name" class="text-2xl font-bold mb-4">产品详情</h2>
            <div id="product-details-content" class="space-y-2">
                <!-- 这里将动态加载产品详情内容 -->
            </div>
        </div>
    `;
    document.body.appendChild(detailsModal);
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    // 关闭模态框功能
    detailsModal.querySelector('#close-details-modal').addEventListener('click', () => {
        document.body.removeChild(detailsModal);
        document.body.style.overflow = ''; // 恢复背景滚动
    });
    // 获取并显示产品详情
    const product = getProductDetails(productId)
    if (product) {
        document.getElementById('product-details-name').textContent = product.productName;
        const contentDiv = detailsModal.querySelector('#product-details-content');
        let graphHtml = '';
        if(product.graphs && product.graphs.length > 0) {
            
            product.graphs.forEach(graph => {
                imageUrl = previewByPath(graph)
                .then(imageUrl => {
                    graphHtml = '<div class="gap-4">';
                    graphHtml += `
                        <div class="items-center border border-gray-200 p-3 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
                            <img src="${imageUrl}" alt="产品图片" class="max-w-full h-auto mx-auto transition-transform duration-300 hover:scale-[1.06] object-contain" loading="lazy">
                        </div>
                    `;
                    graphHtml += '</div>';
                    contentDiv.innerHTML += `
                        ${graphHtml}
                    `;
                });
                
            });
            
        }
        
        let set = '';
        if (product.set) {
            set = `<div class="col-span-1 font-semibold text-gray-700 ml-2">套装:</div>
                <div class="col-span-3 text-black">${product.set}</div>`;
        }
        
        contentDiv.innerHTML += `
            <h3 class="text-xl font-semibold mt-4">基本信息:</h3>
            <div class="grid grid-cols-4 mb-4">
                <div class="col-span-1 font-semibold text-gray-700 ml-2">公司:</div>
                <div class="col-span-3 text-black">${product.company}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品编号:</div>
                <div class="col-span-3 text-black">${product.productCode}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品名称/型号:</div>
                <div class="col-span-3 text-black">${product.productName}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">注册证:</div>
                <div class="col-span-3 text-black">${product.registration}:${product.registrationCode || '------'}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">批准日期:</div>
                <div class="col-span-3 text-black">${product.approvalDate || '------'}</div>
                ${set}
                <div class="col-span-1 font-semibold text-gray-700 ml-2">规格型号:</div>
                <div class="col-span-3 text-black">${product.productSpec}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品材料:</div>
                <div class="col-span-3 text-black">${product.productMaterial}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品类型:</div>
                <div class="col-span-3 text-black">${product.productType}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品状态:</div>
                <div class="col-span-3 text-black">${product.productStatus}</div>
                <div class="col-span-1 font-semibold text-gray-700 ml-2">产品网址:</div>
                <div class="col-span-3 text-black">
                    ${product.productUrl ? `<a href="${product.productUrl}" target="_blank" class="text-blue-600 hover:underline">${product.productUrl}</a>` : '无'}
                </div>
            </div>
            <h3 class="text-xl font-semibold mt-4">文件列表:</h3>
            <ul class="list-disc list-inside" id='modal-file-list'>
            </ul>
            <h3 class="text-xl font-semibold mt-4">备注:</h3>
            <p class="text-black whitespace-pre-wrap">${product.remarks || '无'}</p>
        `;
        const fileList = document.getElementById('modal-file-list')
        fileList.className = 'space-y-2'
        product.files.forEach(file => {
            const description = file.description;
            let version = ``, icon='download';
            if (file.version !== undefined) {
                version = `[${file.version}]`
            }
            const filePath = file.filepath;
            const fileName = file.filename;
            if (fileName.endsWith('.pdf')) { icon = 'eye' }
            const li = document.createElement('li')
            li.className = 'grid grid-cols-3 space-x-2 w-full'
            li.innerHTML = `
                <div class="col-span-1 ml-2 flex justify-between">
                    <span class="bg-gray-100 border border-gray-200 rounder-lg text-gray-700 mr-2">${description}</span>
                    <span class="text-gray-700 mr-2">${version}:</span>
                </div>
                <a href="#" class="col-span-2 file-link text-blue-600 hover:underline" data-filepath="${filePath}">
                    <i class="fa fa-${icon} mr-1 text-black"></i>${fileName}
                </a>
            `
            fileList.appendChild(li)
        })
        
        // 为文件链接添加点击事件，预览文件
        contentDiv.querySelectorAll('.file-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filepath = link.getAttribute('data-filepath');
                const file = product.files.find(f => f.filepath === filepath);
                if (file.filename.endsWith('.pdf')) {
                    previewFile(file);
                } else {
                    // 下载，以file.filename命名：
                    downloadByPath(file.filepath, file.filename)
                }
            });
        });
    } else {
        const contentDiv = detailsModal.querySelector('#product-details-content');
        contentDiv.innerHTML = `<p>未找到产品详情。</p>`;
    }

}

// 检索存在的重复id和productCode
function findDuplicateIds() {
    const seenIds = new Set(); // 存储已见过的id
    const seenProductCodes = new Set();
    const duplicateIds = new Set(); // 存储重复的id（用Set避免重复记录）
    const duplicateProductCodes = new Set();
    sortedData.forEach(product => {
        const id = product?.id;
        const productCode = product?.productCode;
        if(id === undefined) {
            console.log(product)
        };
        if(seenIds.has(id)){
            duplicateIds.add(id);
        } else {
            seenIds.add(id)
        }

        if(seenProductCodes.has(productCode)){
            duplicateProductCodes.add(productCode);
        } else {
            seenProductCodes.add(productCode)
        }
    })
    console.log(duplicateProductCodes)
    return Array.from(duplicateIds)
}
