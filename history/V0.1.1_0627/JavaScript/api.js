// const username = localStorage.getItem('username');

// 处理文件上传
async function handleFiles(selectedFiles) {
    // 限制同时上传的文件数量
    if (selectedFiles.length > 5) {
        alert('一次最多上传5个文件');
        return;
    }

    // 逐个上传文件
    Array.from(selectedFiles).forEach(async (file, index) => {
        // 判断是否存在同名文件
        const sameFile = allFiles.find(f => f.name === file.name);
        if (sameFile) {
            // 验证用户是否一致：
            if (sameFile.uploader !== uploader) {
                confirm(`存在其他用户提交的同名文件，请重命名后提交`);
                return
            }
            // 检查是否已录入
            if (sameFile.state === '已录入') {
                confirm(`存在已录入的同名文件，无法上传；请重命名后提交或联系管理员处理`);
                return
            }
            const confirmResult = confirm(`文件"${file.name}"已存在，是否覆盖？`);
            if (confirmResult) {
                showNotification('文件已存在，将覆盖原文件', 'warning')
            } else {
                return
            }
        }

        //显示上传进度
        if (index === 0) {
            showUploadProgress();
        }

        // 文件名转码： ISO-8859-1 -> UTF-8
        const encodedFilename = encodeURIComponent(file.name);
        file.name = encodedFilename;

        const formData = new FormData();
        const state = '已上传';
        const uploadData = new Date().toISOString()
        formData.append('file', file);
        formData.append('uploader', uploader);
        formData.append('uploadDate', uploadData);
        formData.append('state', state);
        formData.append('dataGroup', dataGroup);
        formData.append('testModel', testModel);
        formData.append('testSpecification', testSpecification)
        formData.append('testBatch', testBatch);
        formData.append('testType', testType);
        formData.append('testStandard', testStandard);
        formData.append('testMember', testMember);
        formData.append('testTime', testTime);
        formData.append('testResult', testResult);
        formData.append('remarks', remarks);
        formData.append('downloads', 0)
        const response = await fetch('http://A012050-1.naton.cn:8081/upload', {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            console.log('文件上传成功:');
        } else {
            console.log('文件上传失败:');
            return
        };

        if (index === selectedFiles.length - 1) {
            setTimeout(() => {
                hideUploadProgress();
                // 添加到文件列表
                addFileToMyFile(file, dataGroup, uploader, uploadData);
                showNotification('文件上传成功', 'success');
            }, 500);
        };
        const data = await response.json();
        const fileData = data.fileData;
        // 刷新页面
        updateFileData(fileData)
    });
}

// 删除我的文件
async function deleteFile(file) {
    if (confirm(`确定要删除文件 "${file.name}" 吗？`)) {
        myFiles = myFiles.filter(f => f.id !== file.id);
        allFiles = allFiles.filter(f => f.id !== file.id);

        // 删除请求：
        const filename = file.name;
        const response = await fetch('http://A012050-1.naton.cn:8081/delete', {
            method : 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ filename })
        })

        if (response.ok) {
            // 显示删除成功提示
            showNotification('文件已成功删除', 'success');
        } else if (response.status === 404) {
            showNotification('文件不存在', 'error');
            return
        } else if (response.status === 400) {
            showNotification('文件已录入，请联系管理员', 'error');
            return
        }

        if (myFiles.length > 0) {
            renderMyFiles(myFiles);
        } else {
            emptyFilesState.classList.remove('hidden');
            filesList.classList.add('hidden');
            allFilesList.classList.add('hidden');
        }

        if (allFiles.length > 0) {
            renderAllFiles(allFiles);
        } 
    }
}

// 文件录入确认
function checkFile(file) {
    // 发送确认请求
    fetch('http://A012050-1.naton.cn:8081/checkFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: file.name, username: username })
    })
    .then(response => {
        if (response.ok) {
            showNotification('文件已成功录入', 'success');
        } else {
            showNotification('文件录入失败', 'error');
        }
    });
}

// 文件下载
async function downloadFile(file) {
    showNotification('文件下载已开始', 'info');
    const filename = file.name;
    const response = await fetch('http://A012050-1.naton.cn:8081/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
    });
    // 处理res.download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click()
    showNotification('文件下载已完成', 'success');
}

// 文件下载(按名称)
async function downloadFileByName(filename) {
    console.log(filename)
    showNotification('文件下载已开始', 'info');
    const response = await fetch('http://A012050-1.naton.cn:8081/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
    });
    if (response.status === 404) {
        showNotification('文件不存在', 'error');
        return
    }
    // 处理res.download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click()
    showNotification('文件下载已完成', 'success');
}

// 测试数据上传：
async function uploadTestData(testData) {
    const response = await fetch('http://A012050-1.naton.cn:8081/uploadTestData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testData })
    });
    showNotification('数据已提交，刷新查看', 'info');
};

// 测试数据删除：
async function deleteTestData(testData) {
    const response = await fetch('http://A012050-1.naton.cn:8081/deleteTestData', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testData })
    });
    showNotification('数据已删除，刷新页面进行更新', 'info');
}

// 数据录入确认
function checkData(testData) {
    // 发送确认请求
    fetch('http://A012050-1.naton.cn:8081/checkData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testData })
    })
    .then(response => {
        if (response.ok) {
            showNotification('数据已成功录入', 'success');
        } else {
            showNotification('数据录入失败', 'error');
        }
    });
}