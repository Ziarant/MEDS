// 获取测试清单
const username = localStorage.getItem('username')

// 下载测试清单
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

async function updateTestListFromSlient(username) {
    const testList = await downloadTestList(username);
    return testList;
}

const testList = await updateTestListFromSlient(username);
localStorage.setItem('testList', JSON.stringify(testList));
