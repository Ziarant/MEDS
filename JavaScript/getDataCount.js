const username = localStorage.getItem('username')
// 检查是否存在serveURL和servePost
// if (serveURL)
// const serveURL = localStorage.getItem('serveURL')
// const servePost = localStorage.getItem('servePost')

// DOM控件
const dataCount = document.getElementById('total-data-count')
const dataCountMy = document.getElementById('my-data-count')
const fileCount = document.getElementById('total-uploads')
const fileCountMy = document.getElementById('my-file-count')
const fileCountAccept = document.getElementById('accept-file-count')
const dataCountAccept = document.getElementById('accept-data-count')
const methodCountAccept = document.getElementById('accept-method-count')
const workflowCount = document.getElementById('workflow-count')
const standardCount = document.getElementById('standard-count')
const productCount = document.getElementById('product-count')
const newProductSpan = document.getElementById('new-product-count')
const literatureCount = document.getElementById('literature-count')
const newFileCountSpan = document.getElementById('new-file-count')
const newDataCountSpan = document.getElementById('new-data-count')
const newTestCountSpan = document.getElementById('new-test-count')
const newStandardSpan = document.getElementById('new-standard-count')
const newWorkSpan = document.getElementById('new-work-count')
const newLiteratureSpan = document.getElementById('new-literature-count')
// const weekNumInput = document.getElementById('week-num-input')

// TODO:统计最近N周数据
// let weekRangeNum = weekNumInput.value;// 最近6周
let weekRangeNum = 16;
let weekRanges = [];
// weekNumInput.addEventListener('change', () => {
//     weekRangeNum = weekNumInput.value;
//     for (let i = -weekRangeNum + 1; i <= 0; i++) {
//         weekRanges.push(i);
//     }
//     updateCanvas()
// })

for (let i = -weekRangeNum + 1; i <= 0; i++) {
    weekRanges.push(i);
}
const recentCount = {
    file: [],
    data: [],
    method: [],
    work: [],
    standard: [],
    product: [],
    literature: []
}

async function fetchFileData(username) {
    const response = await fetch(`${serveURL}:${servePost}/fileData`, {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    })

    const fileData = await response.json();
    return fileData.fileData
}

// 下载测试数据
async function downloadTestData(username) {
    const response = await fetch(`${serveURL}:${servePost}/testData`, {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    });

    const testData = await response.json();
    return testData.testData
}

// 下载测试方法
async function downloadTestList(username) {
    const response = await fetch(`${serveURL}:${servePost}/testList`, {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    });
    const testList = await response.json();
    return testList.testList;
}

// 下载工作项目
workList = getWorkList(username)
workList.then(data => {
    // 统计数目：
    const num = data.length
    workflowCount.textContent = num
    // 统计我的进行中工作项：
    let count = 0
    data.forEach(work => {
        if (work.state === 'in_progress' && work.members.includes(username)) {
            count++
        }
    })
    localStorage.setItem('my_inProgressCount', count)
    const workCount_0 = calNewDataThisWeek(data, 0)
    newWorkSpan.textContent = workCount_0
    // 最近N周数据统计
    const recent_work_count = countByWeeks(data, weekRanges);
    recentCount.work = recent_work_count;
})

// 下载标准列表
standardList = getStandardList(username)
standardList.then(data => {
    const num = data.length || 0
    standardCount.textContent = num
    const dataCount_0 = calNewDataThisWeek(data, 0)
    newStandardSpan.textContent = dataCount_0
    // 最近N周数据统计
    const recent_standard_count = countByWeeks(data, weekRanges);
    recentCount.standard = recent_standard_count;
})

// 下载产品列表
productList = getProductList(username)
productList.then(data => {
    const num = data === null ? 0 : data.length
    productCount.textContent = num
    const productCount_0 = calNewDataThisWeek(data, 0)
    newProductSpan.textContent = productCount_0
    // 最近N周数据统计
    const recent_product_count = countByWeeks(data, weekRanges);
    recentCount.product = recent_product_count;
})

// 下载文献列表
literatureList = getLiteratureList(username)
literatureList.then(data => {
    const num = data === null ? 0 : data.length
    literatureCount.textContent = num
    const literatureCount_0 = calNewDataThisWeek(data, 0)
    newLiteratureSpan.textContent = literatureCount_0
    // 最近N周数据统计
    const recent_literature_count = countByWeeks(data, weekRanges);
    recentCount.literature = recent_literature_count;
})

// 计算文件数目
async function countFiles(username) {
    const fileData = await fetchFileData(username)
    let countAll = 0;
    let countMy = 0;
    let countAccept = 0;
    let countMyAccept = 0;
    fileData.forEach(file => {
        countAll++
        if (file.uploader === username) {
            countMy++
        }
        if (file.state === "已录入") {
            countAccept++
            if (file.uploader === username) {
                countMyAccept++
            }
        }
        
    });
    fileCount.textContent = countAll
    fileCountMy.textContent = countMy
    fileCountAccept.textContent = countAccept
    localStorage.setItem('fileData', fileData)
    localStorage.setItem('userFileCount', countMy)

    const dataCount_0 = calNewDataThisWeek(fileData, 0)
    newFileCountSpan.textContent = dataCount_0
    document.getElementById('new-datafile-count').textContent = dataCount_0
    // 最近N周数据统计
    const recent_file_count = countByWeeks(fileData, weekRanges);
    recentCount.file = recent_file_count;
}

// 计算数据数目
async function countTestData(username) {
    const testData = await downloadTestData(username)
    let countAll = 0;
    let countMy = 0;
    let countAccept = 0;
    testData.forEach(test => {
        countAll++
        if (test.uploader === username) {
            countMy++
        }
        if (test.approvalStatus === 'pass') {
            countAccept++
        }
    });
    dataCount.textContent = countAll
    dataCountMy.textContent = countMy
    dataCountAccept.textContent = countAccept
    localStorage.setItem('userDataCount', countMy)
    const dataCount_0 = calNewDataThisWeek(testData, 0)
    newDataCountSpan.textContent = dataCount_0
    document.getElementById('new-testdata-count').textContent = dataCount_0
    // 最近N周数据统计
    const recent_data_count = countByWeeks(testData, weekRanges);
    recentCount.data = recent_data_count;
}

// 统计录入的测试方法数目
async function countTestList(username) {
    const testList = await downloadTestList(username)
    let count = 0
    testList.forEach(test => {
        if (test.approval === 'pass') { count ++ }
    })
    methodCountAccept.textContent = count
    const dataCount_0 = calNewDataThisWeek(testList, 0)
    newTestCountSpan.textContent = dataCount_0
    // 最近N周数据统计
    const recent_method_count = countByWeeks(testList, weekRanges);
    recentCount.method = recent_method_count;
}

function calNewDataThisWeek(dataJson, weekNum) {
    // 统计N周（周一到今天）新增数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = weekNum * 7 || 7 ;

    // 获取本周一的日期
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - (today.getDay() || days) + 1);  // 周日getDay()返回0，转为7

    const thisWeekNewData = dataJson.filter(item => {
        const uploadDate = item.uploadDate || item.inputTime || item.updateDate || item.date || item.updateTime || item.uploadTime;
        if (!uploadDate) return false;
        
        const createDate = new Date(uploadDate);
        createDate.setHours(0, 0, 0, 0);
        return createDate >= thisMonday && createDate <= today;
    });

    return thisWeekNewData.length;
}

// 按周统计数据, weekRanges为数组，以本周为第0周，-1为上周，依次类推
function countByWeeks(dataJson, weekRanges) {
  return weekRanges.map(week => {
    const count = dataJson.filter(item => {
        const dateField = item.uploadDate || item.inputTime || item.updateDate || 
                        item.date || item.updateTime || item.uploadTime;
        if (!dateField) return false;
        
        const itemDate = new Date(dateField);
        itemDate.setHours(0, 0, 0, 0);
        if (itemDate === 'Invalid Date') return false;
        
        const weekDiff = getWeekkDiff(itemDate);
        if (weekDiff !== week) return false;
        return true;
    }).length;
    return count;
  });
}

countFiles(username)
countTestData(username)
countTestList(username)

// 根据日期计算周数差：
function getWeekkDiff(date) {
    const today = new Date();
    // 本周日：
    const thisSunday = new Date(today);
    thisSunday.setDate(today.getDate() - (today.getDay() || days) + 7);  // 周日getDay()返回0，转为7
    thisSunday.setHours(23, 59, 59, 99)
    // 计算日期data与本周日相差天数与7的倍数，即为周数差
    const timeDiff = thisSunday - date;
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weekDiff = -Math.floor(dayDiff / 7)
    return weekDiff;
}

// 准备图表数据
function generateChart() {
    const dataSets = [
        {
            label: '文件数',
            data: recentCount.file,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '数据数',
            data: recentCount.data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '方法数',
            data: recentCount.method,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '工作项数',
            data: recentCount.work,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '标准数',
            data: recentCount.standard,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '产品数',
            data: recentCount.product,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.4,
            fill: true,
        },
        {
            label: '文献数',
            data: recentCount.literature,
            borderColor: 'rgba(100, 149, 237, 1)',
            backgroundColor: 'rgba(100, 149, 237, 0.2)',
            tension: 0.4,
            fill: true,
        }
    ]

    // 页面加载完成后初始化图表
    const ctx = document.getElementById('weeklyUpdateChart').getContext('2d');
    const weeklyUpdateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weekRanges.map(week => {
                if (week === 0) return '本周';
                else if (week === -1) return '上周';
                else return `${-week}周前`;
            }),
            datasets: dataSets
        }, 
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    usePointStyle: true, // 用数据集点样式作为图例图标
                    pointStyle: 'circle', // 图标形状
                    font: {size: 20}
                },
                title: {
                    display: false,
                    text: `最近${weekRangeNum}周数据更新统计`,
                    font: {size: 24}
                }
            },
            scales: {
                y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                title: {
                        display: true,
                        text: '更新数量',
                        font: {size: 20}
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '时间范围',
                        font: {size: 20}
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 图表生成延时，确保数据准备完成
    setTimeout(generateChart, 100);
});