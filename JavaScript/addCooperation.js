// DOM控件
function addDataButtonClick() {
    addCoopData()
}

function addCoopData() {
    // 添加数据
    const addDataModal = document.createElement('div')
    addDataModal.id = 'add-data-modal'
    addDataModal.className = 'fixed inset-0 z-50'
    addDataModal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        <div class="absolute inset-0 flex items-center justify-center min-w-[70%] max-w-[95%]">
            <div class="bg-white rounded-lg p-6">
                <h2 class="text-2xl text-center font-bold mb-4">添加合作数据</h2>
                <div class="grid grid-cols-5 space-x-2 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">合作名称<span class="text-red-600">*</span></label>
                    <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-coop-name" type="text" 
                    placeholder="合作名称，如：口腔精准骨增量生物活性支架">
                </div>
                <div class="grid grid-cols-5 space-x-2 mb-4 justify-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">合作方<span class="text-red-600">*</span></label>
                    <input class="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-coop-unit" type="text" 
                    placeholder="合作单位，如：北大口腔">
                    <input class="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="add-coop-members" type="text" 
                    placeholder="合作单位负责人">
                </div>
                <div class="grid grid-cols-2 space-x-2 mb-4 justify-center">
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">合作状态<span class="text-red-600">*</span></label>
                        <select id="add-standard-state"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                            <option value="">状态</option>
                            <option value="completed">✅ 完成</option>
                            <option value="in-progress">🔄 进行中</option>
                            <option value="pause">⏸️ 暂停</option>
                            <option value="abolish">❌ 废止</option>
                        </select>
                    </div>
                    <div>
                        <label class="col-span-1 block text-center text-xl text-gray-700 font-bold mr-4" for="name">合作状态<span class="text-red-600">*</span></label>
                        <select id="add-standard-state"
                            class="w-40 p-2 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                            <option value="">状态</option>
                            <option value="completed">✅ 完成</option>
                            <option value="in-progress">🔄 进行中</option>
                            <option value="pause">⏸️ 暂停</option>
                            <option value="abolish">❌ 废止</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `

    document.body.appendChild(addDataModal)
}