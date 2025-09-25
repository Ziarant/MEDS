const submitBtn = document.getElementById('submit-product');
const ourCompanyLabel = document.getElementById('our-company');

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
    const modelFiles = document.getElementById('model-file').files;
    const manualFiles = document.getElementById('manual-file').files;
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
    for (let i = 0; i < drawingFiles.length; i++) {
      formData.append('files', drawingFiles[i]);
      formData.append('fileDescription', 'drawing');
    }
    for (let i = 0; i < modelFiles.length; i++) {
      formData.append('files', modelFiles[i]);
      formData.append('fileDescription', 'model');
    }
    for (let i = 0; i < manualFiles.length; i++) {
      formData.append('files', manualFiles[i]);
      formData.append('fileDescription', 'manual');
    }
    formData.append('remarks', remarks);
    formData.append('uploader', username);
    formData.append('uploadTime', new Date().toISOString());
    submitProduct(formData);
    closeProductModal();
});

// id生成：当前时间戳与随机数组合
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
  const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
  return `${timestamp}${random}`;
}
