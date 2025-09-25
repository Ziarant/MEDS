// DOM控件
function addDataButtonClick() {
    addLiteratureData()
}

function addLiteratureData() {
    const addDataModal = document.createElement('div')
    addDataModal.id = 'add-data-modal'
    addDataModal.className = 'fixed inset-0 z-50'
    addDataModal.innerHTML = `
    <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
    <div class="absolute inset-0 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6  w-full max-w-[95%] max-h-[95%] overflow-y-auto">
            <h2 class="text-2xl text-center font-bold mb-4">添加文献</h2>
            <div class="grid grid-cols-5 mb-4 justify-center space-y-2">
                <div class="col-span-5"></div>
                <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">文献标题<span class="text-red-600">*</span></label>
                <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-primary/50 focus:border-primary" id="add-literature-name" type="text" 
                placeholder="文献标题，建议使用中文，如：牙种植体亲水性表面制备及可靠性研究">
                <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">DOI:<span class="text-red-600">*</span></label>
                <input class="col-span-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-primary/50 focus:border-primary" id="add-doi" type="text" 
                placeholder="如：10.11897/SP.J.1016.2023.00890，无doi请填无">
            </div>
            <div class="grid grid-cols-4 mb-4 space-x-4 justify-center">
                <div class="grid grid-cols-4">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">语言</label>
                    <select id="language-select"
                        class="col-span-3 p-1 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                        <option value="zh-CN">中文</option>
                        <option value="English">英文</option>
                        <option value="abolish">其他</option>
                    </select>
                </div>
                <div class="grid grid-cols-4">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">学科</label>
                    <select id="literature-subject"
                        class="col-span-3 p-1 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                        <option value="力学">力学</option>
                        <option value="材料学">材料学</option>
                        <option value="临床医学">临床医学</option>
                        <option value="计算机科学">计算机科学</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div class="grid grid-cols-4">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">类别</label>
                    <select id="language-type"
                        class="col-span-3 p-1 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                        <option value="J">期刊</option>
                        <option value="MB">学士论文</option>
                        <option value="MM">硕士论文</option>
                        <option value="MD">博士论文</option>
                        <option value="C">会议</option>
                    </select>
                </div>
                <div class="grid grid-cols-4">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">领域</label>
                    <select id="language-domain"
                        class="col-span-3 p-1 border border-gray-200 text-lg rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200">
                        <option value="通用">通用</option>
                        <option value="种植体及基台">种植体及基台</option>
                        <option value="种植器械">种植器械</option>
                        <option value="医用材料">医用材料</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-3 mb-4 space-x-4 justify-center">
                <div class="grid grid-cols-4 items-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-2" for="name">作者</label>
                    <input type="text" id="literature-author"
                        class="col-span-3 p-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
                </div>
                <div class="grid grid-cols-4 items-center">
                    <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">杂志/机构</label>
                    <input type="text" id="literature-jorunarl"
                        class="col-span-3 p-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
                </div>
                <div class="grid grid-cols-4 items-center">
                    <label class="col-span-xu block text-xl text-gray-700 font-bold mr-4" for="name">发表年月</label>
                    <input type="month" id="literature-date"
                        class="col-span-3 p-1 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 mb-3 items-center justify-center">
                <lable class="block text-center text-xl text-gray-700 font-bold mr-4">标签：</lable>
                <!-- 已选标签区域 -->
                <div id="selected-tags" class="relative flex-grow bg-gray-100 gap-2 space-x-1 items-center justify-center min-h-[40px]">
                </div>
            </div>
            <div class="flex flex-col md:flex-row gap-4 mb-3 items-center justify-center">
                <div class="relative flex-grow">
                    <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                    <input type="text" id="tag-search" placeholder="搜索标签..." 
                        class="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all">
                </div>
                
                <button id="add-tag-btn" 
                    class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow">
                    <i class="fa fa-plus"></i>
                    <span>添加新标签</span>
                </button>
            </div>

            <!-- 标签列表区域 -->
            <div id="tag-list" class="flex flex-wrap space-x-1 space-y-1 border border-gray-300 shadow-xs rounded-lg max-h-[6rem] overflow-y-auto mb-3">
                <span class="flex text-sm font-bold items-center justify-between">热门标签：</span>
            </div>

            <div class="grid grid-cols-5 mb-4 justify-center">
                <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">摘要：</label>
                <textarea id="add-literature-abstract" rows="5"
                        class="col-span-4 block w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 overflow-y-auto mb-1"
                        placeholder="请输入文献摘要，支持使用LateX格式录入公式..."></textarea>
            </div>
            <div class="grid grid-cols-5 mb-4 justify-center">
                <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">关键结论：</label>
                <textarea id="add-literature-conclusion" rows="5"
                        class="col-span-4 block w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 overflow-y-auto mb-1"
                        placeholder="请输入关键结论，支持使用LateX格式录入公式..."></textarea>
            </div>
            <div class="grid grid-cols-5 mb-4 justify-center">
                <label class="col-span-1 block text-xl text-gray-700 font-bold mr-4" for="name">引用格式：<span class="text-red-600">*</span></label>
                <input id="add-literature-cite"
                        class="col-span-4 block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-primary/50 focus:border-primary"
                        placeholder="请输入引用格式(GB/T 7714)，如 林野,王兴,邱立新.上颌窦提升植骨及同期种植体植入术[J].中华口腔医学杂志, 1998, 000(006):326-328."></textarea>
            </div>
            <div class="grid grid-cols-5 mb-4 justify-center">
                <label class="col-span-1 block text-xl text-gray-700 font-bold mb-2" for="unit">上传文件：<span class="text-red-600">*</span></label>
                <input type="file" id="literature-file" placeholder="建议文件名使用文献原标题"
                    class="col-span-4 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50">
            </div>
            <div class="flex justify-end space-x-2 mt-2">
                <button class="bg-gray-300 hover:bg-gray-500 text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="modal-cancel-button">取消</button>
                <button class="bg-primary/70 hover:bg-primary text-black py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="modal-add-button">添加</button>
            </div>
        </div>
    </div>
    `
    document.body.appendChild(addDataModal)
    // 背景锁定滚动：
    document.body.style.overflow = 'hidden';

    // 自动调整<textarea>高度：
    const abstractTextarea = document.getElementById('add-literature-abstract');
    const conclusionTextarea = document.getElementById('add-literature-conclusion');
    const tagSearch = document.getElementById('tag-search');
    const tagList = document.getElementById('tag-list');
    const selectedTags = document.getElementById('selected-tags')
    const addTagBtn = document.getElementById('add-tag-btn')

    Object.keys(allTags).forEach((tag, index) => {
        const tagsContain = document.getElementById('tag-list')
        const tagElement = document.createElement('span');
        tagElement.className = 'tag-item flex text-xs items-center justify-between px-2 py-1 border border-gray-600 hover:bg-gray-100 transition-custom';
        tagElement.innerHTML = `
            <span class="text-gray-600">#</span>
            <span id="${tag}-name" class="text-gray-800">${tag}</span>
            <span class="text-gray-600">${allTags[tag]}</span>
        `;
        // 设置颜色：
        tagElement.style.background = getDynamicColorByIndex(index)
        tagElement.id = tag
        tagsContain.appendChild(tagElement);
        tagElement.addEventListener('click', () => {
            // 检查是否已存在
            children = selectedTags.children
            for(let i = 0; i < children.length; i++) {
                if(children[i].id === tagElement.id) {
                    return
                }
            }
            const newTagElement = createTagElement(tag)
            newTagElement.style.background = tagElement.style.background
            selectedTags.appendChild(newTagElement)
            newTagElement.addEventListener('click', () => {
                selectedTags.removeChild(newTagElement)
            })
        })
    })

    tagSearch.addEventListener('change', () => {
        // 查找是否存在匹配的标签,显示在tagList
        children = tagList.children
        for(let i=0; i < children.length; i++) {
            if(children[i].textContent.includes(tagSearch.value)) {
                children[i].style.display = 'flex'
            } else {
                children[i].style.display = 'none'
            }
        }
    })

    addTagBtn.addEventListener('click', () => {
        const tag = tagSearch.value
        children = selectedTags.children;
        for(let i = 0; i < children.length; i++) {
            if(children[i].id === tag) {
                return
            }
        }

        if(tag === '') {
            return
        }

        // 创建新标签，清空输入框，并显示所有标签
        const newTagElement = createTagElement(tag)
        newTagElement.style.background = '#80808055'
        selectedTags.appendChild(newTagElement)
        newTagElement.addEventListener('click', () => {
            selectedTags.removeChild(newTagElement)
        })
        tagSearch.value = ''
        tagListChidren = tagList.children
        for(let i = 0; i < tagListChidren.length; i++) {
            tagListChidren[i].style.display = 'flex';
        }
    })


    document.getElementById('modal-cancel-button').addEventListener('click', () => {
        addDataModal.remove()
        document.body.style.overflow = '';
    })
    document.getElementById('modal-add-button').addEventListener('click', () => {
        // 提交数据
        const formData = new FormData();
        const title = document.getElementById('add-literature-name').value;
        const doi = document.getElementById('add-doi').value;
        const language = document.getElementById('language-select').value;
        const subject = document.getElementById('literature-subject').value;
        const type = document.getElementById('language-type').value;
        const domain = document.getElementById('language-domain').value;
        const author = document.getElementById('literature-author').value;
        const journal = document.getElementById('literature-jorunarl').value;
        const date = document.getElementById('literature-date').value;
        const abstract = abstractTextarea.value;
        const conclusion = conclusionTextarea.value;
        const cite = document.getElementById('add-literature-cite').value;
        const file = document.getElementById('literature-file').files[0];
        const tags = []
        childern = selectedTags.children
        for(let i = 0; i < childern.length; i++) {
            tags.push(childern[i].id)
        }

        // 检查必填项：
        if(title === '' || doi === '' || cite === '' || file === undefined) {
            showNotification('请填写必填项', 'error')
            return
        }

        newId = generateUniqueId()
        updateDate = new Date().toISOString()

        // 添加数据：
        formData.append('id', newId);
        formData.append('username', username);
        formData.append('title', title);
        formData.append('doi', doi);
        formData.append('language', language);
        formData.append('subject', subject);
        formData.append('type', type);
        formData.append('domain', domain);
        formData.append('author', author);
        formData.append('journal', journal);
        formData.append('date', date)
        formData.append('abstract', abstract);
        formData.append('conclusion', conclusion);
        formData.append('cite', cite);
        formData.append('tags', tags);
        formData.append('updateDate', updateDate);
        formData.append('file', file);
        formData.append('uploader', username);
        submitLiterature(formData).then(() => {
            updateLiteratures();
        })
        addDataModal.remove()
        document.body.style.overflow = 'hidden';
    })
}

function createTagElement(tag) {
    const tagElement = document.createElement('span');
    tagElement.className = 'tag-item flex text-xs items-center justify-between px-2 py-1 border border-gray-600 hover:bg-gray-100 transition-custom';
    tagElement.innerHTML = `
        <span class="text-gray-600">#</span>
        <span class="text-gray-800">${tag}</span>
        <i class="fa fa-times text-gray-600"></i>
    `;
    tagElement.id = tag
    return tagElement
}

// id生成：当前时间戳与随机数组合
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
  const random = Math.random().toString(36).substring(2, 8); // 取6位随机字符
  return `${timestamp}${random}`;
}