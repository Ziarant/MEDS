// DOM控件
const username = localStorage.getItem('username')
userTableBody = document.getElementById('user-table-body');

// 获取用户列表
userList = getUserList(username);
userList.then(data => {
    // 按照id排序
    data.sort((a, b) => a.id.localeCompare(b.id));
    userList = data;
    userTableBody.innerHTML = ''; // 清空表格内容
    userList.forEach(user => {
        let disabled = '';
        // 跳过测试账户
        if (user.group.includes('测试')) {
            return}
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-3 px-4">${user.id}</td>
            <td class="py-3 px-4">${user.username}</td>
            <td class="py-3 px-4">${user.telephone}</td>
            <td class="py-3 px-4">${user.email}</td>
            <td class="py-3 px-4">${user.group}</td>
            <td class="py-3 px-4">
                <span class="bg-green-100 border border-gray-100 rounded-lg">正常</span>
            </td>
            <td class="py-3 px-4">${user.lastlogin}</td>
            <td class="flex grid grid-cols-3 py-3 px-4 justify-end gap-2">
                <button class="btn bg-green-100 btn-sm ml-2" onclick="editUser('${user.id}')">
                    <i class="fa fa-edit"></i>
                    <span>编辑账户</span>
                </button>
                <button class="btn btn-danger btn-sm ml-2" onclick="deleteUser('${user.id}')">
                    <i class="fa fa-trash"></i>
                    <span>删除账户</span>
                </button>
                <button class="btn btn-primary btn-sm ml-2" onclick="resetPassword('${user.id}')">
                    <i class="fa fa-redo"></i>
                    <span>重置密码</span>
                </button>
            </td>
        `;
        // 如果是管理员或开发者，禁用编辑按钮
        if (user.group.includes('开发者') || user.group.includes('管理员')) {
                const editButton = row.querySelector('button[onclick^="editUser"]');
                const deleteButton = row.querySelector('button[onclick^="deleteUser"]');
                editButton.disabled = true;
                editButton.classList.remove('bg-green-100');
                editButton.classList.add('bg-gray-200');
                deleteButton.disabled = true;
                deleteButton.classList.remove('btn-danger');
                deleteButton.classList.add('bg-gray-200');
            }
        userTableBody.appendChild(row);
    })
});

// 编辑按钮触发
function editUser(id) {
}

// 删除按钮触发
function deleteUser(id) {
    const user = userList.find(user => user.id === id);
    if (confirm(`确定要删除用户 ${user.username} 吗？`)) {
        // deleteUserById(id);
        // location.reload();
    }
}

// 重置密码
function resetPassword(id) {
    const user = userList.find(user => user.id === id);
    if (confirm(`确定要重置用户 ${user.username} 的密码吗？`)) {
        const password = '123456';
        const salt = newSalt();
        const hash_password = hashPassword(password, salt);
        resetUserPassword(user.username, salt, hash_password);
    }
}

function newSalt() {
    // 生成随机Salt字节
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars.charAt(randomIndex);
    }

    // 转换为十六进制格式
    return result
}

function hashPassword(password, salt) {
    console.log(password, salt)
    // 生成PBKDF2哈希（10万次迭代）
    const key = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 100000,
        hasher: CryptoJS.algo.SHA256
    });
    return key.toString(CryptoJS.enc.Hex);
}

