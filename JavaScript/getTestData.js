// 获取文件列表
const username = localStorage.getItem('username')

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

async function updateTestDataFromSlient(username) {
    const testData = await downloadTestData(username);
    renderTestData(testData);
    return testData
}
const testData = await updateTestDataFromSlient(username)
localStorage.setItem('testData', JSON.stringify(testData))
totalRecords.textContent = testData.length;
