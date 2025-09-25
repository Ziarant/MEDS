// public/js/app.js - 主应用逻辑
const version = localStorage.getItem('version')
const versionSpan = document.getElementById('version-span')
const changePasswordButton = document.getElementById('change-password')
const usernameInput = document.getElementById('username-input')
const passwordInput = document.getElementById('password')
const newPasswordInput = document.getElementById('new-password')
const confirmPasswordInput = document.getElementById('confirm-password')
const newPasswordContainer = document.getElementById('new-password-container')
const confirmPasswordContainer = document.getElementById('confirm-password-container')
const loginButton = document.getElementById('login-button')
const errorMessage = document.getElementById('error-message')
versionSpan.textContent = version

document.addEventListener('DOMContentLoaded', () => {
    // 初始化组件和事件监听
    initFetchButton();
});

// 初始化按钮和事件监听
changePasswordButton.addEventListener('click', function () {
    // 密码输入框
    let isHidden = newPasswordContainer.classList.contains('hidden');
    if (isHidden) {
        passwordInput.placeholder = '请输入原密码';
        newPasswordContainer.classList.remove('hidden');
        confirmPasswordContainer.classList.remove('hidden');
        changePasswordButton.textContent = '取消修改';
        loginButton.textContent = '修改密码并登录';
    } else {
        passwordInput.placeholder = '请输入密码';
        newPasswordContainer.classList.add('hidden');
        confirmPasswordContainer.classList.add('hidden');
        loginButton.textContent = '登录';
    }
});

loginButton.addEventListener('click', function () {
    const username = usernameInput.value;
    const password = passwordInput.value;
    let newPassword = password;
    const confirmPassword = confirmPasswordInput.value;
    

    let isHidden = newPasswordContainer.classList.contains('hidden');
    loginButton.textContent = '登录中...';
    loginButton.disabled = true;
    loginButton.classList.add('bg-gray-400', 'hover:bg-gray-400');
    errorMessage.classList.add('hidden');

    if (isHidden) {
        // 如果新密码输入框隐藏，则进行登录
        // 发送登录请求到服务器
        login(username, password, newPassword).finally(() => {
            loginButton.textContent = '登录';
            loginButton.disabled = false;
            loginButton.classList.remove('bg-gray-400', 'hover:bg-gray-400');
        });
        loginButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    } else {
        let newPassword = newPasswordInput.value;
        // 如果新密码输入框可见，则进行密码修改
        if (newPassword !== confirmPassword) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = '新密码与确认密码不匹配';
            loginButton.textContent = '修改密码并登录';
        } else if (newPassword.length < 6) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = '新密码长度不能少于6位';
            loginButton.textContent = '修改密码并登录';
        } else if (newPassword === password) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = '新密码不能与原密码相同';
            loginButton.textContent = '修改密码并登录';
        } else if (newPassword === username) {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = '新密码不能与用户名相同';
            loginButton.textContent = '修改密码并登录';
        } else {
            login(username, password, newPassword).finally(() => {
                loginButton.textContent = '登录';
                loginButton.disabled = false;
                loginButton.classList.remove('bg-gray-400', 'hover:bg-gray-400');
            });
            loginButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
        }
    }
});
    

function initFetchButton() {
    // 切换密码可见性
    document.getElementById('toggle-password').addEventListener('click', function () {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // 切换新密码可见性
    document.getElementById('toggle-new-password').addEventListener('click', function () {
        const newPasswordContainer = document.getElementById('new-password');
        const icon = this.querySelector('i');

        if (newPasswordContainer.type === 'password') {
            newPasswordContainer.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            newPasswordContainer.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // 切换确认密码可见性
    document.getElementById('toggle-confirm-password').addEventListener('click', function () {
        const confirmPasswordContainer= document.getElementById('confirm-password');
        const icon = this.querySelector('i');

        if (confirmPasswordContainer.type === 'password') {
            confirmPasswordContainer.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            confirmPasswordContainer.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

// 异步登录函数:
async function login(username, password, newPassword) {
    try {
        // 发送登录请求到服务端，端口8081
        const response = await fetch('http://A012050-1.naton.cn:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, newPassword })
        });

        // 处理服务器响应
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('group', data.user.group); // 保存用户组信息

        if (response.ok) {
            // 登录成功，保存令牌并重定向
            
            // window.location.href = '/client/selection.html/?token=' + data.token; // 重定向到选择页面并传递令牌
            console.log('登录成功，准备重定向');
            const herf = await fetch('http://A012050-1.naton.cn:8081/client', {
                method: 'GET',
                headers: {
                    'Authorization': data.token
                }
            });

            const token = localStorage.getItem('token');

            if (herf.ok) {
                localStorage.setItem('username', data.user.username);
                window.location.href = '/client/selection.html/?token=' + token; // 重定向到选择页面并传递令牌
            } else {
                console.error('重定向失败');
            }

        } else {
            // 显示错误信息
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = data.message || '用户名或密码错误，请重试';
        }
    } catch (error) {
        console.error('登录请求失败:', error);
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = '服务器错误，请联系管理员或稍后再试';
    }
}