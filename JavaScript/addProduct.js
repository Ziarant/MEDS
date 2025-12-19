const submitBtn = document.getElementById('submit-product');
const ourCompanyLabel = document.getElementById('our-company');

// 增添数据
const manualDiv = document.getElementById('manual-div')
const addManualBtn = document.getElementById('add-manual-btn')

addManualBtn.addEventListener('click', () => {
  `<input type="file" id="manual-file" accept=".pdf"
      class="col-span-2 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
  <input type="text" id="manual-file-version" placeholder="描述版本信息：如S0"
      class="col-span-1 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">`
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = ".pdf"
    fileInput.className = "col-span-2 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
    const textDiv = document.createElement('div')
    textDiv.className = "col-span-1 grid grid-cols-7 items-center juctify-between"
    manualDiv.appendChild(fileInput)
    textDiv.innerHTML = `
    <input type="text" id="manual-file-version" placeholder="描述版本信息：如S0"
        class="col-span-6 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
    <button id="remove-manual-btn" 
        class="w-8 h-8 bg-gray-100 rounded-full border border-gray-600 items-center justify-center">
        <i class="fa fa-trash" title="删除数据"></i>
    </button>
    `
    manualDiv.appendChild(textDiv)
})

// 如果勾选“我司产品”，则公司名称自动填写为“北京莱顿”，且不可更改
ourCompanyLabel.addEventListener('change', function() {
    const companyInput = document.getElementById('company');
    const isChecked = this.querySelector('input').checked;
    if (isChecked) {
        companyInput.value = '北京莱顿';
        companyInput.disabled = true;
        companyInput.classList.replace('bg-white', 'bg-gray-100');
    } else {
        companyInput.disabled = false;
        companyInput.classList.replace('bg-gray-100', 'bg-white');
    }
});

submitBtn.addEventListener('click', function() {
    const id = generateUniqueId();
    // 获取产品信息
    const company = document.getElementById('company').value;
    const productType = document.getElementById('product-type-select').value;
    const productCode = document.getElementById('product-code').value;
    const productName = document.getElementById('product-name').value;
    const productSpec = document.getElementById('product-spec').value;
    const productMaterial = document.getElementById('product-material').value;
    const productStatus = document.getElementById('product-status-select').value;
    const registration = document.getElementById('registration-select').value;
    const registrationCode = document.getElementById('registration-code').value;
    const productUrl = document.getElementById('product-url').value;
    const drawingFiles = document.getElementById('drawing-file').files;
    const drawingVersion = document.getElementById('drawing-file-version').value || ''
    const modelFiles = document.getElementById('model-file').files;
    const modelVersion = document.getElementById('model-file-version').value || ''
    const manualFiles = document.getElementById('manual-file').files;
    const manualVersion = document.getElementById('manual-file-version').value || ''
    const remarks = document.getElementById('remarks').value;
    // 关闭模态框事件
    formData = new FormData();
    formData.append('id', id);
    formData.append('company', company);
    formData.append('productType', productType);
    formData.append('productCode', productCode);
    formData.append('productName', productName);
    formData.append('productSpec', productSpec);
    formData.append('productMaterial', productMaterial);
    formData.append('productStatus', productStatus);
    formData.append('registration', registration);
    formData.append('registrationCode', registrationCode);
    formData.append('productUrl', productUrl);
    let fileDescription = [];
    let fileVersion = [];
    for (let i = 0; i < drawingFiles.length; i++) {
      formData.append('files', drawingFiles[i]);
      fileDescription.push('2D图纸')
      fileVersion.push(drawingVersion)
    }
    for (let i = 0; i < modelFiles.length; i++) {
      formData.append('files', modelFiles[i]);
      fileDescription.push('3D模型')
      fileVersion.push(modelVersion)
    }
    for (let i = 0; i < manualFiles.length; i++) {
      formData.append('files', manualFiles[i]);
      fileDescription.push('产品手册');
      fileVersion.push(manualVersion)
    }

    formData.append('fileDescription', fileDescription)
    formData.append('fileVersion', fileVersion)
    formData.append('remarks', remarks);
    formData.append('uploader', username);
    formData.append('uploadTime', new Date().toISOString());
    submitProduct(formData);
    closeProductModal();
    showNotification('成果添加数据', 'success')
});

// id生成：当前时间戳与随机数组合
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
  const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
  return `${timestamp}${random}`;
}
