const userButton = document.getElementById('user-button');
const userIcon = document.getElementById('user-icon');

if (group.includes('管理员')) {
    // 如果是管理员，替换用户图标为管理员图标
    userIcon.classList.replace('fa-user', 'fa-user-shield');
    // userIcon.classList.replace('fa-user', 'fa-user-shield');
}