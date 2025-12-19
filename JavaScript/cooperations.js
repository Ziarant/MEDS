const username = localStorage.getItem('username');
const cardsContain = document.getElementById('cards-contain')

function update() {
    currentData = [];
    cooperationList = getCooperations(username)
    .then(data => {
        // TODO：排序和过滤
        sortedData = [...data]; // 创建数据的副本以进行排序和过滤 -> currentData
        // const sortBy = sortSelect.value
        // sortedData = sortWorkFlow(sortBy);
        currentData = sortedData;
        // getUserCount();
        // filterWorkFlow();
        renderItem();
        // updateStatistics()
        
    })
}
update()

function renderItem() {
    cardsContain.innerHTML = '';
    currentData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:card-shadow hover:border-primary transition-custom item-card';
        card.id = `${item.id}`;

        // 类别, 状态：
        let itemType = item.type, typeColor = 'bg-blue-200', itemStatus = item.status, statusColor = 'bg-green-200'
        if (itemType === '产品开发类') {typeColor = 'bg-green-200'}
        else if (itemType === '科研合作类') {typeColor = 'bg-green-200'}
        else if (itemType === '联合申报类') {
            typeColor = 'bg-cyan-200'
        }
        else if(itemType === '技术转化') {
            typeColor = 'bg-purple-200s'
        }
        if (itemStatus === '已完成') {statusColor = 'bg-gray-200'}
        else if (itemStatus === '进行中') {statusColor = 'bg-green-200'}
        else if (itemStatus === '已中止') {statusColor = 'bg-red-200'}
        else if (itemStatus === '已暂停') {statusColor = 'bg-yellow-200'}

        // 合作方主页信息：
        let hasPage = '', personalTitle= ''
        if (item.personalPages) {
            hasPage = 'cursor-pointer'
            personalTitle = `title="点击查看主页"`
        }

        card.innerHTML = `
            <div class="p-5 flex flex-col h-full">
                <div class="items-start mb-2">
                    <div class="flex flex-col">
                        <div class="flex flex-col w-full mb-1" title="${item.title}">
                            <h3 class="text-xl font-semibold mb-1 line-clamp-1">
                            <span class="${typeColor} border border-gray-400 rounded-lg px-2">${itemType}</span>
                            ${item.title}
                            </h3>
                        </div>
                        <div class="mt-1 mb-1">
                            <span class="border border-gray-400 rounded-lg px-2 mr-2"><i class="fa fa-user mr-1 text-primary"></i>${item.leaders}</span>
                            <span class="partner-span border border-gray-400 rounded-lg px-2 mr-2 ${hasPage}" ${personalTitle}><i class="fa fa-hospital-user mr-1 text-primary"></i>${item.partners}</span>
                        </div>
                        <hr />
                        <div class="mt-2 mb-2">
                            <span class="bg-gray-100 border border-gray-400 rounded-lg px-2 mr-2">目标</span>${item.objective}
                        </div>
                        <hr />
                        <div class="flex justify-between mt-2">
                            <div>
                                <span class="bg-gray-100 border border-gray-400 rounded-lg px-2">支出</span>￥<span class="stat-number">${item.cost}</span>
                            </div>
                            <div class="mr-4">
                                <span class="bg-gray-100 border border-gray-400 rounded-lg px-2">预算</span>￥<span class="stat-number">${item.budget}</span>
                            </div>
                        </div>
                        <div class="flex justify-between mt-2 mb-2">
                            <div>
                                <span class="bg-gray-100 border border-gray-400 rounded-lg px-2" title="税额：￥${item.taxAmount || 0}">收入</span>￥<span class="stat-number">${item.income}</span>
                            </div>
                            <div class="mr-4">
                                <span class="bg-gray-100 border border-gray-400 rounded-lg px-2">收益</span>￥<span class="stat-number">${item.income - item.cost}</span>
                            </div>
                        </div>
                        <hr />
                        <div class="mt-2 mb-2">
                            <span class="${statusColor} border border-gray-400 rounded-lg px-2 mr-2">${itemStatus}</span>${item.status_description}
                        </div>
                    </div>
                    <hr />
                    <div class="flex justify-between mt-2">
                        <button class="timeLine-Btn border border-gray-300 rounded-lg bg-primary/20 px-2 hover:bg-primary/60 hover:border-primary cursor-pointer">
                            <i class="fa fa-history mr-1"></i>时间线
                        </button>
                        <span><i class="fa fa-calendar mr-1" title="项目开始时间"></i>${item.start_date}</span>
                        <span><i class="fa fa-calendar-check mr-2" title="项目结束时间"></i>${item.end_date}</span>
                    </div>
                </div>
            </div>
        `
        cardsContain.appendChild(card)
        card.querySelector('.partner-span').addEventListener('click', () => {
            if (item.personalPages) {
                window.open(item.personalPages, '_blank')
            }
        })
        card.querySelector('.timeLine-Btn').addEventListener('click', () => {
            // 创建时间线临时展示窗
            const timeCard = document.createElement('div')
            timeCard.className = "fixed bg-gray-50 top-1/2 left-1/2 w-[50%] max-h-[80%] border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-lg z-40"
            
            const timeTable = document.createElement('table')
            timeTable.className = "w-full bg-gray-100"
            timeTable.innerHTML = ''
            Object.keys(item.timeLine).forEach(time => {
                const row = document.createElement('tr');
                row.className = 'grid grid-cols-4 border-b border-gray-100 hover:bg-primary/20 transition-colors';
                row.innerHTML = `
                    <td class="col-span-1 py-2 px-4">
                        <div class="flex items-center">
                            <div class="w-4 h-4 rounded text-sm flex items-center justify-center mr-3">
                                <i class="fa fa-circle"></i>
                            </div>
                            <span class="font-medium text-gray-800 w-full">${time}</span>
                        </div>
                    </td>
                    <td class="col-span-3 flex py-2 px-4 ml-3 mr-3">
                        ${item.timeLine[time]}
                    </td>
                `
                timeTable.append(row)
            })

            timeCard.innerHTML = `
                <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3 md-1">
                    <div>
                        <h3 class="text-2xl font-semibold"><span class="${statusColor} border border-gray-400 rounded-lg px-2 mr-2">时间线</span>${item.title}</h3>
                    </div>
                    <button id="timeLine-close-Btn" class="text-gray-400 hover:text-primary transition-colors">
                            <i class="fa fa-times"></i>
                    </button>
                </div>
                <hr />
            `
            document.body.appendChild(timeCard)
            timeCard.appendChild(timeTable)
            document.getElementById('timeLine-close-Btn').addEventListener('click', () => {
                timeCard.remove()
            })
        })
    })
}