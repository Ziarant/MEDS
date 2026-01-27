// 筛选面板切换
document.getElementById('toggleFilter').addEventListener('click', function () {
    const panel = document.getElementById('filterPanel');
    panel.classList.toggle('hidden');
});
        
// 搜索功能
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();

    // 去除首尾空白字符
    const trimmedTerm = searchTerm.trim();

    // 获取单元格：
    const cells = document.querySelectorAll('td')

    // 判断是否包含有效文字信息
    if (trimmedTerm.length === 0) {
        // 如果没有有效文字，清除所有高亮
        cells.forEach(cell => {
            cell.classList.remove('highlight')
        })
        return;
    }

    
    cells.forEach(cell => {
        const content = cell.textContent.toLowerCase()
        if (content.includes(trimmedTerm)) {
            cell.classList.add('highlight')
        } else {
            cell.classList.remove('highlight')
        }
    })
});

const table = document.querySelector('table');
const tableHeaders = table.querySelectorAll('thead th');

// 填写表单内容：
currentData = JSON.parse(data)
currentData.forEach(item => {
    let itemClass = 'Tetranite', itemColor = 'bg-yellow-200';
    if (item.project.indexOf('Tetranite') === -1) {
        itemClass = '国内骨胶研究';
        itemColor = 'bg-blue-200';
    }
    let pdfColor = itemColor, hasPdf = '';
    
    // 如果没有原文：
    if (item.title_EN === '') {
        pdfColor = 'bg-gray-200'
        hasPdf = 'hidden'
        item.title_EN = item.link
    }

    // 筛选器内容：
    const itemfilter = document.getElementById('item-fliter')
    const itemInputDiv = document.createElement('div')
    itemInputDiv.className = ''
    itemInputDiv.innerHTML = `
        <input type="checkbox" name="worktype-filter" value="${item.project}" group="${itemClass}"
            class="form-checkbox h-4 w-4 text-primary rounded" checked>
        <span class="ml-1 ${itemColor} text-gray-700 border border-gray-300 rounded-lg text-gray-600 px-2 mr-4" title="${item.title_CN}">${item.project}</span>
    `
    itemfilter.appendChild(itemInputDiv)

    // 表单内容
    const row = document.createElement('tr');
    row.title = item.project
    // 机构纵向排布：
    let institution = '<div class="grid grid-col-1 py-3">';
    item.institutions.forEach(unit => {
        institution += `<span>${unit}</span>`
    })
    institution += '</div>'

    // 摘要一行需要进行字符限制
    let abstract = `
        <div class="text-wrap min-w-[90ch]">${item.abstract}</div>
    `
    abstract = abstract.replaceAll('<li>', '<li class="ml-8">')

    // 材料特性
    const characterList = {
        '可注射性': '可注射',
        '自修复特性': '可逆粘附性',
        '湿环境黏附' : '在潮湿或含水条件下保持或增强其附着能力的行为',
        "抗冲洗能力" : "经快速水流冲洗仍紧密黏附",
        '低反应热': '自修复特性',
        '低溶胀率': '自修复特性',
        '热稳定性': '自修复特性',
        '抑菌性': '自修复特性',
        '高孔隙率': '自修复特性',
        '固化产物多孔': '自修复特性'
    }
    let Characters = '<div class="grid grid-col-1 py-3">'

    Object.keys(characterList).forEach(ch => {
        title = characterList[ch]
        if (Object.keys(item.character).includes(ch)) {
            value = item.character[ch]
            if (value.includes('false')) {
                Characters += `<span class='min-w-[40ch] max-w-[90ch] text-wrap rounded-full px-2 mr-1' title='${title}'>❌ ${ch}<span class="ml-1 text-sm text-gray-400">${value}</span></span>`
            } else {
                Characters += `<span class='min-w-[40ch] max-w-[90ch] text-wrap rounded-full px-2 mr-1' title='${title}'>✅ ${ch}<span class="ml-1 text-sm text-gray-400">${value}</span></span>`
            }
        } else {
            Characters += `<span class='min-w-[40ch] max-w-[90ch] text-wrap text-xs text-gray-300 rounded-full px-2 mr-1' title='${title}'>❓ ${ch}</span>`
        }
    })
    Characters += '</div>'

    // 机械性能：
    let strength = '<div class="grid grid-col-1 py-3">';
    Object.keys(item.strength).forEach(key => {
        let value = item.strength[key]
        value = value.replaceAll('<li>', '<li class="ml-6">')
        strength += `
            <div class="min-w-[90ch] text-wrap py-2 rounded-lg hover:bg-primary/20">
                <span class="result-span text-lg font-bold bg-gray-100 border border-gray-300 rounded-lg px-2 mr-2 cursor-pointer">${key}</span>
                <br>
                <div class="result-div">${value}</div>
            </div>
        `
    })
    strength += '</div>'

    // 细胞实验
    let cellTest = '<div class="grid grid-col-1 py-3">';
    Object.keys(item.cellTest).forEach(test => {
        let result = item.cellTest[test]
        result = result.replaceAll('<li>', '<li class="ml-6">')
        cellTest += `
            <div class="min-w-[90ch] text-wrap ml-2 py-2 rounded-lg hover:bg-primary/20">
                <span class="result-span text-lg font-bold bg-gray-100 border border-gray-300 rounded-lg px-2 mr-2 cursor-pointer">${test}</span>
                <br>
                <div class="result-div">${result}</div>
            </div>
        `
    })
    cellTest += '</div>'

    // 动物实验
    let animalTest = '<div class="grid grid-col-1 py-3">';
    Object.keys(item.animalTest).forEach(test => {
        let result = item.animalTest[test]
        result = result.replaceAll('<li>', '<li class="ml-6">')
        animalTest += `
            <div class="min-w-[90ch] text-wrap ml-2 py-2 rounded-lg hover:bg-primary/20">
                <span class="result-span text-gray-800 text-lg font-bold bg-gray-100 border border-gray-300 rounded-lg px-2 mr-2 cursor-pointer">${test}</span>
                <br>
                <div class="result-div">${result}</div>
            </div>
        `
    })
    animalTest += '</div>'

    // 结论：
    let conclusions = '<div class="min-w-[90ch] text-wrap px-1 py-1">';
    Object.keys(item.conclusions).forEach(key => {
        let conclusion = item.conclusions[key]
        conclusion = conclusion.replaceAll('<li>', '<li class="ml-6">')
        conclusions += `
            <div class="text-gray-600 border border-gray-50 rounded-lg mb-2 rounded-lg hover:bg-primary/20">
                <span class="result-span text-lg text-gray-900 font-bold mr-2 cursor-pointer">${key}</span>
                <br>
                <div class="result-div">&nbsp;&nbsp;&nbsp;&nbsp;${conclusion}</div>
            </div>
            `
    })
    conclusions += '</div>'

    row.innerHTML = `
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-gray-600 text-center" data-column="类别" style="display: true;">
            <span class='${itemColor} inline-block rounded-full px-2 mr-1'>${itemClass}</span>
            <br>
            <button class="radar-btn border border-gray-600 shadow-lg text-wrap w-[20ch]">${item.project}</button>
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-lg text-gray-600 items-center" data-column="论文名称" style="display: true;">
            <button class='pdf-btn ${pdfColor} text-wrap w-[28ch] border border-gray-400 shadow-lg rounded-full px-2 mr-1' title='${item.title_EN}'>${item.title_CN}
            </button>
            <div class="text-sm flex justify-end">
                <button class='${hasPdf} pdf-btn bg-green-200 border border-gray-400 shadow-lg rounded-full px-2 mr-1' title='${item.title_EN}_翻译版'>AI译文</button>
            </div>
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-gray-600" data-column="机构" style="display: true;">
            ${institution}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-gray-600" data-column="团队" style="display: true;">
            ${item.team}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="杂志" style="display: true;">
            ${item.journal}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="年份" style="display: true;">
            ${item.year}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="影响因子" style="display: true;">
            ${item.if}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-gray-600" data-column="摘要" style="display: true;">
            ${abstract}
        </td>
        <td class="text-wrap max-w-[90ch] px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="材料成分" style="display: true;">
            ${item.materials}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="特性" style="display: true;">
            ${Characters}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-gray-600" data-column="机械性能" style="display: true;">
            ${strength}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="细胞实验" style="display: true;">
            ${cellTest}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="动物实验" style="display: true;">
            ${animalTest}
        </td>
        <td class="px-3 py-2 border border-gray-200 whitespace-nowrap text-sm text-gray-600" data-column="主要结论" style="display: true;">
            ${conclusions}
        </td>
    `;
    document.querySelector('tbody').appendChild(row);
});

// 表格行悬停效果增强
document.querySelectorAll('tbody tr').forEach(row => {
    row.addEventListener('mouseenter', function () {
        this.classList.add('bg-primary/5');
    });
    row.addEventListener('mouseleave', function () {
        this.classList.remove('bg-primary/5');
    });
});

// 筛选
const applyFilterBtn = document.getElementById('apply-fliter-btn')
const tetraniteCb = document.getElementById('tetranite_cb')
const internalCb = document.getElementById('internal_cb')
tetraniteCb.addEventListener('change', () => {
    const tetCbs = document.querySelectorAll('input[group="Tetranite"]')
    tetCbs.forEach(cb => {
        cb.checked = tetraniteCb.checked
    })
})
internalCb.addEventListener('change', () => {
    const intCbs = document.querySelectorAll('input[group="国内骨胶研究"]')
    intCbs.forEach(cb => {
        cb.checked = internalCb.checked
    })
})

applyFilterBtn.addEventListener('click', () => {
    // 文章筛选
    const selectedItems = Array.from(document.querySelectorAll('input[name="worktype-filter"]:checked')).map(input => input.value);
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (selectedItems.includes(row.title)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    })
})

// 预设：隐藏项目
const hiddenItems = ['机构', '团队', '杂志', '年份', '影响因子', '材料成分', '特性', '机械性能', '细胞实验', '动物实验', '主要结论']
const fliterBtns = document.querySelectorAll('.filter-btn')
fliterBtns.forEach(btn => {
    columnName = btn.textContent;
    if (hiddenItems.includes(columnName)) {
        btn.classList.remove('active')
        // 隐藏该列
        toggleColumnVisibility(columnName, false);
    } else {
        // 设置按钮为active
        btn.classList.add('active')
        toggleColumnVisibility(columnName, true);
    }

    btn.addEventListener('click', () => {
        btn.classList.toggle('active')
        toggleColumnVisibility(btn.textContent, btn.classList.contains('active'));
    })
});

// 设置表单显示或隐藏
function toggleColumnVisibility(columnName, isVisible) {
    // 处理表头
    const header = Array.from(tableHeaders).find(h => h.dataset.column === columnName);
    if (header) {
        header.style.display = isVisible ? '' : 'none';
    }
    
    // 处理表体
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.getAttribute('data-column') === columnName) {
                cell.style.display = isVisible ? '' : 'none';
            }
        })
    });
}

// 文章链接：
const pdfBtns = document.querySelectorAll('.pdf-btn')
pdfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 使用浏览器在新页面中在打开PDF
        pdfFileName = btn.title
        let path = './文献原文/'
        if (pdfFileName.includes('_翻译版')) {
            path = './文献翻译/'
        } else if (pdfFileName === '') {
            return
        }
        if (pdfFileName.includes('http')) {
            window.open(pdfFileName, '_blank')
        } else {
            const url = `${path}${pdfFileName}.pdf`
            window.open(url, '_blank')
        }
        
    })
})

// 雷达图：
const radarBtns = document.querySelectorAll('.radar-btn')
const ctx = document.getElementById('boneGlueRadarChart').getContext('2d');
let datasets = [
    {
        label: '商用氰基丙烯酸酯 CA', // 数据集名称（可自定义）
        data: [4.0, 5.0, 3.0, 1.0, 1.0, 7.0], // 六维数据
        borderColor: '#999999', // 虚线颜色（可自定义）
        borderWidth: 1, // 虚线宽度
        borderDash: [5, 5], // 虚线样式：[线段长度, 间隔长度]（核心配置）
        pointColor: '#999999', // 数据点颜色
        pointRadius: 2, // 数据点大小
        pointHoverRadius: 5, // 鼠标悬浮时数据点大小
        fill: false, // 不填充区域（虚线一般不填充）
        tension: 0.1 // 线条平滑度（0 为直线，越大越平滑）
    }
]
const r_data = {
    labels : radarLabels,
    datasets : datasets
}
const radarChart = new Chart(ctx, {
    type: 'radar',
    data: r_data,
    options: options
});

radarBtns.forEach(btn => {
    btn.addEventListener('click', () => {     
        const project = btn.textContent;
        const radarData = currentData.filter(item => item.project === project)[0].radar
        // 随机生成颜色：
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        // 更改btn状态：
        btn.classList.toggle('active')
        if (btn.classList.contains('active')) {
            // 添加数据
            datasets.push({
                label: project,
                data: radarData,
                backgroundColor: color + '20',
                borderColor: color,
                borderWidth: 1
            })
        } else {
            // 删除数据
            datasets = datasets.filter(item => item.label !== project)
        }
        // 更新Chart数据
        radarChart.data.datasets = datasets;
        radarChart.update()

        // 获取弹窗元素
        const modal = document.getElementById('radar-modal');
        modal.classList.remove('opacity-0', 'pointer-events-none')
    })
})

document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('radar-modal');
    modal.classList.add('opacity-0', 'pointer-events-none')
})

// 隐藏详情：
const resultDiv = document.querySelectorAll('.result-div')
const detailsBtn = document.getElementById('details-btn')
detailsBtn.addEventListener('click', () => {
    if (detailsBtn.classList.contains('active')) {
            detailsBtn.textContent = '显示细节'
            resultDiv.forEach(div => {
            if(div.classList.contains('hidden')) {
                    div.classList.remove('hidden')
                }
            })
        } else {
            detailsBtn.textContent = '隐藏细节'
            resultDiv.forEach(div => {
                if(div.classList.contains('hidden')) {} else {
                    div.classList.add('hidden')
                }          
            })
        }  
})

// 单个切换：
document.querySelectorAll('.result-span').forEach(span => {
    span.addEventListener('click', () => {
        // const div = span.nextElementSibling
        // if (div.classList.contains('hidden')) {
        //     div.classList.remove('hidden')
        // } else {
        //     div.classList.add('hidden')
        // }
        const parentDiv = span.parentElement
        const resultDiv = parentDiv.querySelector('.result-div')
        resultDiv.classList.toggle('hidden')
    })
})