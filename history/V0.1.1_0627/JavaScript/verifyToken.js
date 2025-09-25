const token = localStorage.getItem('token')
const group = localStorage.getItem('group');

async function verify(token) {

    const response = await fetch('http://A012050-1:8081/client', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    });

    if (response.ok) {
    } else {
        // 重定向到登录界面
        window.location.href = '../../login.html';
    }
    
}

verify(token)

