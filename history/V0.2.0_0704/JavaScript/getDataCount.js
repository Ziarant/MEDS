// 获取文件列表
const username = localStorage.getItem('username')
// DOM控件
const dataCount = document.getElementById('total-data-count')
const dataCountMy = document.getElementById('my-data-count')
const fileCount = document.getElementById('total-uploads')
const fileCountMy = document.getElementById('my-file-count')
const fileCountAccept = document.getElementById('accept-file-count')
const dataCountAccept = document.getElementById('accept-data-count')
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

    const newDataCount = calNewDataLastWeek(fileData)
    newFileCountSpan.textContent = newDataCount
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
    const newDataCount = calNewDataLastWeek(testData)
    newDataCountSpan.textContent = newDataCount
}

countFiles(username)
countTestData(username)

function calNewDataLastWeek(dataJson) {
    // 统计上周新增数据
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const lastWeekNewData = dataJson.filter(item => {
        if (item.uploadDate !== undefined) { 
            const createDate = new Date(item.uploadDate); 
            return createDate >= oneWeekAgo && createDate <= today;
        } else if (item.inputTime !== undefined) {
            const createDate = new Date(item.inputTime);
            return createDate >= oneWeekAgo && createDate <= today;
        } else {
            return false;
        }
    });

    const count = lastWeekNewData.length;
    return count
}
