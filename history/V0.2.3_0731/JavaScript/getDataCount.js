// 获取文件列表
const username = localStorage.getItem('username')
// DOM控件
const dataCount = document.getElementById('total-data-count')
const dataCountMy = document.getElementById('my-data-count')
const fileCount = document.getElementById('total-uploads')
const fileCountMy = document.getElementById('my-file-count')
const fileCountAccept = document.getElementById('accept-file-count')
const dataCountAccept = document.getElementById('accept-data-count')
const methodCountAccept = document.getElementById('accept-method-count')
const newFileCountSpan = document.getElementById('new-file-count')
const newDataCountSpan = document.getElementById('new-data-count')

async function fetchFileData(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/fileData', {
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
    const response = await fetch('http://A012050-1.naton.cn:8081/testData', {
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
    const response = await fetch('http://A012050-1.naton.cn:8081/testList', {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    });

    const testList = await response.json();
    return testList.testList;
}

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
}

// 统计录入的测试方法数目
async function countTestList(username) {
    const testList = await downloadTestList(username)
    let count = 0
    testList.forEach(test => {
        if (test.approval === 'pass') { count ++ }
    })
    methodCountAccept.textContent = count
}

countFiles(username)
countTestData(username)
countTestList(username)

function calNewDataThisWeek(dataJson, weekNum) {
    // 统计N周（周一到今天）新增数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = weekNum * 7
    
    // 获取本周一的日期
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - (today.getDay() || days) + 1); // 周日getDay()返回0，转为7

    const thisWeekNewData = dataJson.filter(item => {
        const uploadDate = item.uploadDate || item.inputTime;
        if (!uploadDate) return false;
        
        const createDate = new Date(uploadDate);
        createDate.setHours(0, 0, 0, 0);
        
        return createDate >= thisMonday && createDate <= today;
    });

    return thisWeekNewData.length;
}
