// const username = localStorage.getItem('username');
// 服务器地址
const serveURL = 'http://A012050-1.naton.cn'
const servePost = 8081

// 处理单文件上传
async function uploadSingleFile(file) {
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
    formData.append('projectNum', projectNum)
    formData.append('dataGroup', dataGroup);
    formData.append('testModel', testModel);
    formData.append('testSpecification', testSpecification)
    formData.append('testBatch', testBatch);
    formData.append('testType', testType);
    formData.append('testStandard', testStandard);
    formData.append('testMember', testMember);
    formData.append('testTime', testTime);
    formData.append('testResult', testResult);
    formData.append('feedbackMember', feedbackMember);
    formData.append('feedbackTime', feedbackTime);
    formData.append('remarks', remarks);
    formData.append('downloads', 0)
    const response = await fetch(`${serveURL}:${servePost}/upload`, {
        method: 'POST',
        body: formData
    })

    if (response.ok) {
        showNotification('文件上传成功', 'success')
    } else {
        showNotification('文件上传失败', 'warning')
        return
    };

    // 添加到文件列表
    const data = await response.json();
    const newFile = data.newFile
    addFileToMyFile(newFile);
    addFileToAllFile(newFile);
    return true
}

// 处理文件上传
async function handleFiles(files) {
    // 限制同时上传的文件数量
    if (files.length > 20) {
        alert('一次最多上传20个文件');
        return;
    }

    dataGroup = dataGroup === '其他' ? otherGroupInput.value.trim() : dataGroup;

    // 串行上传文件:避免阻塞
    showUploadProgress();
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const sameFile = allFiles.find(f => f.name === file.name);
        if (sameFile) {
            // 验证用户是否一致：
            if (sameFile.uploader === uploader) {
                if (sameFile.state === '已录入') {
                    confirm(`存在已录入的同名文件:${sameFile.name}，无法上传；请重命名后提交或联系管理员处理`);
                    continue
                }
                const confirmResult = confirm(`文件":${sameFile.name}"已存在，是否覆盖？`);
                if (confirmResult) {
                    showNotification('文件已存在，将覆盖原文件', 'warning')
                } else {
                    continue
                }
            }
        }
        const result = await uploadSingleFile(file);
        changeUploadProgress((index / files.length) * 100)
    }

    setTimeout(() => {
        hideUploadProgress();
    }, 500);
}


// 删除我的文件
async function deleteFile(file) {
    if (confirm(`确定要删除文件 "${file.name}" 吗？`)) {
        myFiles = myFiles.filter(f => f.id !== file.id);
        allFiles = allFiles.filter(f => f.id !== file.id);

        // 删除请求：
        const filename = file.name;
        const response = await fetch(`${serveURL}:${servePost}/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
        })

        if (response.ok) {
            // 显示删除成功提示
            showNotification('文件已成功删除', 'success');
        } else if (response.status === 404) {
            showNotification('文件不存在', 'error');
            return
        } else if (response.status === 400) {
            showNotification('文件已录入，无法删除，请联系开发者', 'error');
            return
        }

        if (myFiles.length > 0) {
            renderMyFiles(myFiles);
        } else {
            emptyFilesState.classList.remove('hidden');
            filesList.classList.add('hidden');
            // allFilesList.classList.add('hidden');
        }

        if (allFiles.length > 0) {
            renderAllFiles(allFiles);
        }
    }
}

// 文件录入确认
function checkFile(file) {
    // 发送确认请求
    fetch(`${serveURL}:${servePost}/checkFile`, {
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

// 拒绝录入文件
async function rejectFile(file) {
    if (confirm(`确定要拒绝录入文件 "${file.name}" 吗？`)) {
        // 发送拒绝请求
        fetch(`${serveURL}:${servePost}/rejectFile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: file.name, username: username })
        })
            .then(response => {
                if (response.ok) {
                    showNotification('文件已标记', 'success');
                } else {
                    showNotification('操作失败', 'error');
                }
            });
    }
}

// 文件流处理
async function getFile(filename) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
    })

    if (!response.ok) {
        showNotification('文件获取失败', 'error');
        return

    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob); // 创建临时URL
    return url
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

// 文件预览（通过路径）
async function previewByPath(filePath) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getFileByPath', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath })
    });

    if (!response.ok) {
        showNotification('文件获取失败', 'error');
        return
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob); // 创建临时URL
    return url
}

// 文件下载（通过路径）
async function downloadByPath(filePath, fileName) {
    showNotification('文件下载已开始', 'info');
    const response = await fetch('http://A012050-1.naton.cn:8081/downloadByPath', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath, fileName })
    });
    // 处理res.download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click()
    showNotification('文件下载已完成', 'success');
}

// 文件下载(按名称)
async function downloadFileByName(filename) {
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
    showNotification('数据已提交', 'info');

    const newData = localStorage.getItem('testData')
    const newTestData = JSON.parse(newData)
    newTestData.unshift(testData)
    renderTestData(newTestData);
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
    showNotification('数据已删除', 'info');

    const newData = localStorage.getItem('testData')
    const newTestData = JSON.parse(newData)
    const dataIndex = newTestData.findIndex(item => item.id === testData.id);
    newTestData.splice(dataIndex, 1);
    renderTestData(newTestData);
}

// 数据录入确认
function checkData(testData) {
    // 发送确认请求
    fetch('http://A012050-1.naton.cn:8081/checkData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testData, username: username })
    })
        .then(response => {
            if (response.ok) {
                showNotification('数据已成功录入', 'success');
            } else {
                showNotification('数据录入失败', 'error');
            }
        });
}

// 拒绝录入测试数据
function rejectTestData(testData) {
    // 发送确认请求
    fetch('http://A012050-1.naton.cn:8081/rejectData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ testData, username: username })
    })
        .then(response => {
            if (response.ok) {
                showNotification('数据已处理', 'success');
            } else {
                showNotification('数据处理失败', 'error');
            }
        });
}

// 提交测试方法：
async function addTestMethod(testMethod, testMethodFiles, technicalFiles, reportModelFiles, competitorDataFiles) {
    const formData = new FormData();
    formData.append('testMethod', JSON.stringify(testMethod));
    Array.from(testMethodFiles).forEach(file => {
        const blob = new Blob([file], { type: file.type });
        formData.append('testMethodFiles', blob, file.name);
    });
    Array.from(technicalFiles).forEach(file => {
        const blob = new Blob([file], { type: file.type });
        formData.append('technicalFiles', blob, file.name);
    })
    Array.from(reportModelFiles).forEach(file => {
        const blob = new Blob([file], { type: file.type });
        formData.append('reportModelFiles', blob, file.name);
    })
    Array.from(competitorDataFiles).forEach(file => {
        const blob = new Blob([file], { type: file.type });
        formData.append('competitorDataFiles', blob, file.name);
    })
    const repose = await fetch('http://A012050-1.naton.cn:8081/addTestMethod', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                showNotification('测试方法已提交', 'success');
            } else {
                showNotification('数据处理失败', 'error');
            }
        });
}

// 审核通过测试方法：
async function checkTestMethod(testMethod) {
    if (confirm(`确定要录入该测试项目吗？`)) {
        const repose = await fetch('http://A012050-1.naton.cn:8081/checkTestMethod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testMethod, username: username })
        })
    }
}

// 审核拒绝测试方法：
async function rejectTestMethod(testMethod) {
    if (confirm(`确定要拒绝录入该测试项目吗？`)) {
        const repose = await fetch('http://A012050-1.naton.cn:8081/rejectTestMethod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ testMethod, username: username })
        })
    }
}

// 获取用户信息
async function getUserList(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getUserList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });
    if (response.ok) {
        const userInfo = await response.json();
        return userInfo;
    } else {
        showNotification('获取用户信息失败', 'error');
        return null;
    }
}

// 重置用户密码
async function resetUserPassword(username, salt, hash_password) {
    console.log(username, salt, hash_password)
    const response = await fetch('http://A012050-1.naton.cn:8081/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, salt, hash_password })
    });
    if (response.ok) {
        showNotification(`已重置用户 ${username} 的密码为123456`, 'success');
    } else {
        showNotification('重置密码失败', 'error');
    }
}

// 获取工作项目列表
async function getWorkList(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getWorkList', {
        method: 'POST',
        body: JSON.stringify({
            username
        })
    })

    if (response.ok) {
        const result = await response.json();
        return result
    } else {
        return null
    }
}

// 处理单文件上传
async function uploadWorkItem(workItem) {
    const response = await fetch('http://A012050-1.naton.cn:8081/uploadWorkItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workItem })
    })

    if (response.ok) {
        showNotification('工作流程创建成功', 'success')
    } else {
        showNotification('工作流程创建失败', 'warning')
        return
    };

    // 添加到文件列表
    // const data = await response.json();
    // const newFile = data.newFile
    // addFileToMyFile(newFile);
    // addFileToAllFile(newFile);
    // return true
}

// 获取标准清单列表
async function getStandardList(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getStandardList', {
        method: 'POST',
        body: JSON.stringify({
            username
        })
    })

    if (response.ok) {
        const result = await response.json();
        return result
    } else {
        return null
    }
}

// 标准文件流处理
async function getStandardFile(filename) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getStandardFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
    })

    if (!response.ok) {
        showNotification('文件获取失败', 'error');
        return

    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob); // 创建临时URL
    return url
}

// 添加标准数据
async function submitStandardForm(formData) {
    console.log(formData)
    const response = await fetch('http://A012050-1.naton.cn:8081/')
}

// 代理访问：
async function agencySearch(queryURI, website) {
    const response = await fetch(`http://A012050-1.naton.cn:8081/search?q=${queryURI}&w=${website}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    const data = await response.json();
    return data.page;
}

// 获取标准清单列表
async function getLiteratureList(username) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getLiteratureList', {
        method: 'POST',
        body: JSON.stringify({
            username
        })
    })

    if (response.ok) {
        const result = await response.json();
        return result
    } else {
        return null
    }
}

// 标准文件流处理
async function getLiteratureFile(filename) {
    const response = await fetch('http://A012050-1.naton.cn:8081/getLiteratureFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
    })

    if (!response.ok) {
        showNotification('文件获取失败', 'error');
        return

    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob); // 创建临时URL
    return url
}

// deepseek插件：
async function sendMessage(messageId, currentSession) {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.apikey}`
        },
        body: JSON.stringify({
            model: currentSession.model,
            messages: currentSession.messages.slice(0, -1),
            temperature: currentSession.temperature,
            stream: true
        })
    });

    if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let aiMessage = '';
    let isCompleted = false; // 标记AI输出是否完成

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            // 确保最后检查一次buffer中是否有剩余内容
            if (buffer.trim()) {
                processChunk(buffer);
            }
            isCompleted = true;
            break;
        };
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n');
        buffer = chunks.pop() || '';
        for (const chunk of chunks) {
            const trimmedChunk = chunk.trim();
            if (!trimmedChunk || trimmedChunk === 'data: [DONE]') continue;
            try {
                const jsonStr = trimmedChunk.replace('data: ', '');
                const data = JSON.parse(jsonStr);
                const content = data.choices[0]?.delta?.content || '';
                if (content) {
                    aiMessage += content;
                    updateMessageContent(messageId, aiMessage, currentSession.role, model = '')
                }
            } catch (e) {
                console.warn('解析JSON时出错:', e);
            }
        }

        // 如果已完成，退出外层循环
        if (isCompleted) break;
    }

    // AI输出完成后执行的操作:
    if (isCompleted) {
        saveChatData()
    }
}

// 上传文件至Deepseek并返回ID:
async function uploadDSFile(apiKey, file) {
    if (apiKey === '') {
        showNotification('请先设置APIKEY', 'warning');
        return
    }
    
    const formData = new FormData();
    formData.append('purpose', 'fine-tune');
    formData.append('file', file);

    // const response = await fetch('https://chat.deepseek.com/api/v0/files', {
    const response = await fetch('https://api.deepseek.com/v1/files', {
    // const response = await fetch('https://api-docs.deepseek.com/updates', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        body: formData
        // purpose: 'assistants'
    });

    if (!response.ok) {
        showNotification('上传文件失败', 'error');
    } else {
        const data = await response.json();
        const fileId = data.id
        return fileId
    }
}

// 查询余额：
async function getDSBalance(apikey) {
    if (apikey === '') {
        showNotification('请先设置APIKEY', 'warning');
        return
    }

    const response = await fetch('https://api.deepseek.com/user/balance', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apikey}`
        }
    });

    if (!response.ok) {
        showNotification('查询余额失败', 'error');
    } else {
        const balanceResponse = await response.json()
        return balanceResponse.balance_infos[0].total_balance
    } 
}