// 获取测试清单-渲染
const username = localStorage.getItem('username')
const testList = localStorage.getItem('testList');
const testListContainer = document.getElementById('test-list-container');
const addDataButton = document.getElementById('add-data-button');
const addDataModal = document.getElementById('add-data-modal');
const closeDataModal = document.getElementById('close-data-modal');
const submitButton = document.getElementById('save-submit-button');
const approvalPassButton = document.getElementById('approval-pass')
const approvalNotPassButton = document.getElementById('approval-not-pass')
const cancelBtn = document.getElementById('cancel-button')

addDataButton.addEventListener('click', function () {
    // 添加测试内容
    addDataModal.classList.remove('opacity-0', 'pointer-events-none');
    addDataModal.classList.add('opacity-100', 'pointer-events-auto');
    if(group.includes('管理员')) {
        approvalPassButton.classList.remove('hidden')
        approvalNotPassButton.classList.remove('hidden')
    }
});

cancelBtn.addEventListener('click', function () {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
});

closeDataModal.addEventListener('click', function () {
    addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
    addDataModal.classList.add('opacity-0', 'pointer-events-none');
});

// 监听键盘事件，按下Esc键关闭模态框
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        addDataModal.classList.remove('opacity-100', 'pointer-events-auto');
        addDataModal.classList.add('opacity-0', 'pointer-events-none');
    }
});

// 统计各标签的必做和选做测试数量
let implantTestCount = [0, 0]; // [必做, 选做]
let abutmentTestCount = [0, 0]; // [必做, 选做]
let tadTestCount = [0, 0]; // [必做, 选做]
let drillTestCount = [0, 0]; // [必做, 选做]
let rotaryTestCount = [0, 0]; // [必做, 选做]
let pickupTestCount = [0, 0]; // [必做, 选做]
let handleTestCount = [0, 0]; // [必做, 选做]
let materialTestCount = [0, 0]; // [必做, 选做]
let otherTestCount = [0, 0]; // [必做, 选做]

if (testList) {
    let pending = ''
    parsedTest = Array.from(JSON.parse(testList));
    parsedTest.forEach((test, index) => {
        // 创建测试项
        pending = ''
        if (test.status !== '已录入') {
            if (group.includes('管理员') || test.creator.includes(username)) {
                // 待审核标记
                pending = 'pending'
            } else {
                // 如果测试项未录入，且非管理员或自己，则跳过
                return
            }
        }
        const testItem = document.createElement('div');
        const tags = test.tags ? test.tags.map(tag => `<span class="bg-gray-200 text-gray-800 font-semibold px-2.5 py-0.5 rounded">${tag}</span>`).join(' ') : '';
        const tagArray = test.tags || [];
        tagArray.forEach(tag => {
            if (tag === '种植体') {testItem.id += `Implant`; implantTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '基台') {testItem.id += `Abutment`; abutmentTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '支抗钉') {testItem.id += `TAD`; tadTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '钻类') {testItem.id += `Drill`; drillTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '旋转器械') {testItem.id += `Rotary`; rotaryTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '植入器') {testItem.id += `Pickup`; pickupTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '扳手') {testItem.id += `Handle`; handleTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '牙科材料') {testItem.id += `Material`; materialTestCount[test.compulsory ? 0 : 1]++;}
            if (tag === '其他') {testItem.id += `Other`; otherTestCount[test.compulsory ? 0 : 1]++;}
        });
        testItem.id += `-${index}-span`;
        testItem.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-2";

        const textColor = test.compulsory ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        const compulsory = test.compulsory ? '必测' : '选测';
        
        // 是否有文件：
        const testMethodFiles = test.documents.testMethod;
        const technicalFiles = test.documents.technical;
        const reportModelFiles = test.documents.reportModel;
        const competitorDataFiles = test.documents.competitorData;

        const strikethroughtestMethodFiles = testMethodFiles.length > 0 ? '' : 'strikethrough';
        const strikethroughtTechnicalFiles = technicalFiles.length > 0 ? '' : 'strikethrough';
        const strikethroughtReportModelFiles = reportModelFiles.length > 0 ? '' : 'strikethrough';
        const strikethroughtCompetitorDataFiles = competitorDataFiles.length > 0 ? '' : 'strikethrough';

        testItem.innerHTML = `
            <div class="${pending} bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                <div class="p-2 border-b border-gray-100 flex items-center justify-between">
                    <h3 class="text-xl font-semibold mb-2">
                        <span class="${textColor} font-semibold px-2.5 py-0.5 rounded">${compulsory}</span>
                        ${tags}
                        ${test.title}
                    </h3>
                    <button>
                        <i class="w-12 h-12 fa fa-edit text-xl text-primary"></i>
                    </button>
                </div>

                <p class="text-gray-700 px-2 mb-4">${test.description}</p>
                <div>
                    相关文件：
                    <a href="#" class="text-primary hover:underline ${strikethroughtestMethodFiles}">测试方法文件</a>
                    <a href="#" class="text-primary hover:underline ${strikethroughtTechnicalFiles}">技术要求文件</a>
                    <a href="#" class="text-primary hover:underline ${strikethroughtReportModelFiles}">报告模板文件</a>
                    <a href="#" class="text-primary hover:underline ${strikethroughtCompetitorDataFiles}">竞品参考数据</a>
                </div>
            </div>
        `;
        testListContainer.appendChild(testItem);
    });
}


// 更新统计信息
const updateStatistics = () => {
    document.getElementById('Implant-compulsory').textContent = `${implantTestCount[0]}`;
    document.getElementById('Implant-optional').textContent = `${implantTestCount[1]}`;
    document.getElementById('Abutment-compulsory').textContent = `${abutmentTestCount[0]}`;
    document.getElementById('Abutment-optional').textContent = `${abutmentTestCount[1]}`;
    document.getElementById('TAD-compulsory').textContent = `${tadTestCount[0]}`;
    document.getElementById('TAD-optional').textContent = `${tadTestCount[1]}`;
    document.getElementById('Drill-compulsory').textContent = `${drillTestCount[0]}`;
    document.getElementById('Drill-optional').textContent = `${drillTestCount[1]}`;
    document.getElementById('Rotary-compulsory').textContent = `${rotaryTestCount[0]}`;
    document.getElementById('Rotary-optional').textContent = `${rotaryTestCount[1]}`;
    document.getElementById('Pickup-compulsory').textContent = `${pickupTestCount[0]}`;
    document.getElementById('Pickup-optional').textContent = `${pickupTestCount[1]}`;
    document.getElementById('Handle-compulsory').textContent = `${handleTestCount[0]}`;
    document.getElementById('Handle-optional').textContent = `${handleTestCount[1]}`;
    document.getElementById('Material-compulsory').textContent = `${materialTestCount[0]}`;
    document.getElementById('Material-optional').textContent = `${materialTestCount[1]}`;
    document.getElementById('Other-compulsory').textContent = `${otherTestCount[0]}`;
    document.getElementById('Other-optional').textContent = `${otherTestCount[1]}`;
};

// 页面加载时更新统计信息
document.addEventListener('DOMContentLoaded', () => {
    updateStatistics();
});