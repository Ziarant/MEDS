// 获取文件列表
const username = localStorage.getItem('username')

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


// 更新表单：输入username
async function updateFileDataFromSlient(username) {
    const fileData = await fetchFileData(username) 
    Array.from(fileData).forEach(file => {
        addFileToAllFile(file)
        // 然后判断是否是我的文件
        if (file.uploader === username) {
            addFileToMyFile(file)
        }
    });
};

updateFileDataFromSlient(username)