const token = localStorage.getItem('token')
const group = localStorage.getItem('group');
const serveURL = localStorage.getItem('serveURL')
const servePost = localStorage.getItem('servePost')

async function verify(token) {

    const response = await fetch(`${serveURL}:${servePost}/client`, {
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

