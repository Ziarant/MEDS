// DOM控件
const username = localStorage.getItem('username');
const loadingDiv = document.getElementById('loading-div');
const pdfEmbed = document.getElementById('pdf-embed');
const websiteSelect = document.getElementById('website-select');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultContent = document.getElementById('result-content');

function updateStickyTop() {
    const height = resultContent.offsetHeight
    pdfEmbed.setAttribute('height', height)
}

// 页面加载完成时更新一次
window.addEventListener('load', updateStickyTop);

// 窗口大小改变时也更新
window.addEventListener('resize', updateStickyTop);

// 搜索按钮点击事件
searchButton.addEventListener('click', async () => {

    pdfEmbed.classList.add('hidden')
    loadingDiv.classList.remove('hidden');

    const query = searchInput.value.trim();
    const website = websiteSelect.value;
    if (!query) {
        showNotification('请输入搜索关键词、DOI或标题', 'error');
        return;
    }

    const queryURI = encodeURIComponent(query)
    agencySearch(queryURI, website).then(data => {
        if (data === null) {
            showNotification('未搜索到资源', 'error');
            loadingDiv.innerHTML = `
            <div>
                <p>未搜索到资源</p>
            </div>
            `;
            loadingDiv.classList.remove('hidden');
            return
        } 
        const regex = /src="([^"]+)"/;
        const match = data.match(regex);

        if(match && match[1]){
            pdfEmbed.setAttribute('src', match[1])
        } else {
            showNotification('未找到相关文件', 'error');
        }
    })

    loadingDiv.classList.add('hidden');
    pdfEmbed.classList.remove('hidden');
});

// 监听键盘enter键
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

