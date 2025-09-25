// DOM控件
function addDataButtonClick() {
    addStandardData()
}

// 添加标准数据悬浮窗：
function addStandardData() {
    const addDataModal = document.createElement('div')
    addDataModal.id = 'add-data-modal'
    addDataModal.className = 'fixed inset-0 z-50'
    addDataModal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div class="absolute inset-0 flex items-center justify-center max-w-[95%]">
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-2xl text-center font-bold mb-4">添加标准数据</h2>
                <div class="grid grid-cols-5 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">标准名称<span class="text-red-600">*</span></label>
                    <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-standard-name" type="text" 
                    placeholder="标准名称，如：牙科学 陶瓷材料">
                </div>
                <div class="grid grid-cols-5 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">标准编号<span class="text-red-600">*</span></label>
                    <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-standard-id" type="text" 
                    placeholder="标准名称，如：GB 30367-2013">
                </div>
                <div class="grid grid-cols-5 space-x-2 mb-4 justify-center">
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">标准状态<span class="text-red-600">*</span></label>
                        <select id="add-standard-state"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                            <option value="">状态</option>
                            <option value="active">✅ 现行</option>
                            <option value="abolish">❌ 废止</option>
                            <option value="draft">❓ 征求意见稿</option>
                        </select>
                    </div>
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">标准效力<span class="text-red-600">*</span></label>
                        <select id="add-standard-enforceability"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                            <option value="">请选择</option>
                            <option value="compulsory">强制性</option>
                            <option value="recommend">推荐性</option>
                            <option value="guide">指导性</option>
                        </select>
                    </div>
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">标准类别<span class="text-red-600">*</span></label>
                        <select id="add-standard-classification"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                            <option value="">请选择</option>
                            <option value="通用">通用</option>
                            <option value="种植体及基台">种植体及基台</option>
                            <option value="植入器械">植入器械</option>
                            <option value="种植器械">种植器械</option>
                            <option value="医用材料">医用材料</option>
                            <option value="其他">其他</option>
                        </select>
                    </div>
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">发布日期</label>
                        <input type="date" id="add-standard-issueDate"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                    </div>
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">生效日期</label>
                        <input type="date" id="add-standard-implementDate"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                    </div>
                </div>
                <div class="grid grid-cols-5 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">简介信息：</label>
                    <textarea id="add-standard-briefDesc" rows="2"
                            class="col-span-4 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 mb-1"
                            placeholder="请输入简介信息..."></textarea>
                </div>
                <div class="grid grid-cols-5 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">标准范围：</label>
                    <textarea id="add-standard-scope" rows="3"
                            class="col-span-4 block w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 mb-1"
                            placeholder="请输入标准范围..."></textarea>
                </div>
                <div class="grid grid-cols-10 space-x-2 mb-4">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mb-2" for="unit">替代标准：</label>
                    <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2" id="add-standard-replace" type="text" 
                    placeholder="标准编号，如：GB/T 4340.1-2009">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold ml-2 mb-2" for="unit">采用标准：</label>
                    <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-standard-referenceStandard" type="text" 
                    placeholder="标准编号，如：ISO 6872:2008">
                </div>
                <div>
                    <label class="block text-xl text-gray-700 font-bold mb-2" for="unit">上传文件：<span class="text-red-600">*</span></label>
                    <input type="file" id="standard-file" name="standard-file" 
                        class="col-span-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
                </div>
                <div class="flex justify-end space-x-2 mt-2">
                    <button class="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="modal-cancel-button">取消</button>
                    <button class="bg-primary/70 hover:bg-primary text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="modal-add-button">添加</button>
                </div>
            </div>
        </div>
    `
    document.body.appendChild(addDataModal)
    document.getElementById('modal-cancel-button').addEventListener('click', () => {
        addDataModal.remove()
    })
    document.getElementById('modal-add-button').addEventListener('click', () => {
        // 提交数据
        const standardName = document.getElementById('add-standard-name').value;
        const standardId = document.getElementById('add-standard-id').value;
        const standardState = document.getElementById('add-standard-state').value;
        const standardEnforceability = document.getElementById('add-standard-enforceability').value;
        const standardClassification = document.getElementById('add-standard-classification').value;
        const standardIssueDate = document.getElementById('add-standard-issueDate').value || '';
        const standardImplementDate = document.getElementById('add-standard-implementDate').value || '';
        const standardBriefDesc = document.getElementById('add-standard-briefDesc').value || '';
        const standardScope = document.getElementById('add-standard-scope').value || '';
        const standardReplace = document.getElementById('add-standard-replace').value || '';
        const standardReferenceStandard = document.getElementById('add-standard-referenceStandard').value || '';
        const standardFile = document.getElementById('standard-file').files[0];
        // 检查必填项：
        if (standardName === '' || standardId === '' || standardState === '' || standardEnforceability === '' || standardClassification === '' || standardFile === undefined) {
            showNotification('请填写必填项', 'error')
            return
        }
        const formData = new FormData();
        formData.append('username', username);
        formData.append('standardName', standardName);
        formData.append('standardId', standardId);
        formData.append('standardState', standardState);
        formData.append('standardEnforceability', standardEnforceability);
        formData.append('standardClassification', standardClassification);
        formData.append('standardIssueDate', standardIssueDate);
        formData.append('standardImplementDate', standardImplementDate);
        formData.append('standardBriefDesc', standardBriefDesc);
        formData.append('standardScope', standardScope);
        formData.append('standardReplace', standardReplace);
        formData.append('standardReferenceStandard', standardReferenceStandard);
        formData.append('file', standardFile);
        formData.append('uploadDate', new Date().toISOString().slice(0, 10))
        
        submitStandardForm(formData);
        addDataModal.remove();
    })
}
