const btn_00 = document.getElementById('download-00-btn');
const btn_01 = document.getElementById('download-01-btn');
const btn_02 = document.getElementById('download-02-btn');
const btn_03 = document.getElementById('download-03-btn');
const btn_CH1 = document.getElementById('download-CH1-btn');
const btn_CH2 = document.getElementById('download-CH2-btn');
const btn_CH3 = document.getElementById('download-CH3-btn');
const btn_CH4 = document.getElementById('download-CH4-btn');
const btn_CH5 = document.getElementById('download-CH5-btn');
const btn_CH6A = document.getElementById('download-CH6A-btn');
const btn_CH6B = document.getElementById('download-CH6B-btn');
const btn_JD = document.getElementById('download-JD-btn');

// const templateDiv = document.getElementById('download-template-div')
const templateDiv = document.createElement('div');
templateDiv.id = 'download-template-div';
templateDiv.className = 'hidden fixed bg-gray-100 top-1/2 left-1/2 max-w-[90%] border border-gray-600 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-lg z-50';
templateDiv.innerHTML = `
    <div class="flex items-center justify-between space-x-4 mt-1 ml-3 mr-3 md-1">
        <div>
            <h3 class="text-2xl font-semibold">模板文件下载</h3>
        </div>
        <button id="close-template-btn" class="text-gray-400 hover:text-primary transition-colors">
            <i class="fa fa-times"></i>
        </button>
    </div>
    <hr />
    <div id="download-template-list" class="p-4 space-y-3 flex justify-between flex-col">
        <!-- 下载按钮通过JS添加 -->
    </div>
    `
document.body.appendChild(templateDiv);
const templateList = document.getElementById('download-template-list')
const closeTemplateDivBtn = document.getElementById('close-template-btn')

const files_00 = {
    '财务分析报告-样表.docx': ['产品部'],
    '项目编号-PMP001-Phase0-1 项目立项任务书.docx': ['产品部'],
    '项目编号-PMP002-Phase0-2 产品开发任命书.docx': ['产品部'],
    '项目编号-PMP003-Phase0-3 原始需求报告.docx': ['产品部'],
    '项目编号-PMP004-Phase0-4 产品概念设计报告.docx': ['产品部'],
    '项目编号-PMP005-Phase0-5 法规注册评估报告.docx': ['注册办'],
    '项目编号-PMP006-Phase0-6 专利评估报告.docx': ['法规组'],
    '项目编号-PMP007-Phase0-7 竞争分析报告.docx': ['产品部'],
    '项目编号-PMP008-Phase0-8 技术可行性报告.docx': ['研发组'],
    '项目编号-PMP009-Phase0-9 生产可行性报告.docx': ['生产部'],
    '项目编号-PMP010-Phase0-10 风险管理文档.docx': ['产品部'],
    '项目编号-PMP010-Phase0-11 委托协议书.docx': ['产品部'],
    '项目编号-PMP012-Phase0-12 商业评估报告.docx': ['产品部'],
    '项目编号-PMP013-Phase0-13 项目立项书.docx': ['产品部'],
    '项目编号-PMP090-Phase0-39 临床调研报告.docx': ['临床部']
}

const files_01 = {
    '项目编号-PMP114-Phase1-14 项目计划模板.mpp': ['研发部'],
    '项目编号-PMP115-Phase1-15 规格分解报告.docx': ['项目经理'],
    '项目编号-PMP116-Phase1-16 产品关键指标及对应的测试标准.docx': ['研发部'],
    '项目编号-PMP117-Phase1-17 总体开发计划书.docx': ['项目经理'],
    '项目编号-PMP118-Phase1-18 样品测试计划.docx': ['研发部']
};

const files_02 = {
    // 待添加
    '项目编号-PMP219-Phase2-19 图纸审核记录.docx': ['研发部'],
    '项目编号-PMP220-Phase2-20 样品生产工艺.docx': ['研发部'],
    '项目编号-PMP221-Phase2-21 样品生产采购计划.docx': ['研发部'],
    '项目编号-PMP222-Phase2-22 器械采购申请表--物流.xls': ['采购部'],
    '项目编号-PMP222-Phase2-22 委外加工单-纳通工厂.xlsx': ['研发部'],
    '项目编号-PMP223-Phase2-23 工厂样品意见反馈表.docx': ['生产部'],
    '项目编号-PMP224-Phase2-24 批量试制生产采购计划.docx': ['生产部'],
    '项目编号-PMP225-Phase2-25 技术交底会议交底清单.docx': ['研发部'],
    '项目编号-PMP226-Phase2-26 工厂批量试制意见反馈表.docx': ['生产部'],
    '项目编号-PMP227-Phase2-27 临床试验方案及反馈.docx': ['临床部'],
    '项目编号-PMP228-Phase2-28 项目成本核算表-财务.xls': ['财务部'],
    '项目编号-PMP229-Phase2-29 量产工艺.docx': ['生产部'],
    '项目编号-PMP230-Phase2-30 量产生产采购计划书.docx': ['采购部'],
    '项目编号-PMP231-Phase2-31 植入物生产订单.xlsx': ['生产部'],
    '项目编号-PMP232-Phase2-32 器械采购申请表--物流.xls': ['采购部']
};

const files_03 = {
    '项目编号-PMP333-Phase3-33 结项报告.docx': ['项目经理'],
    '项目编号-PMP334-Phase3-34 新品市场推广培训计划.docx': ['产品部'],
    '项目编号-PMP335-Phase3-35 产品标准.doc': ['产品部'],
    '项目编号-PMP336-Phase3-36 销售任务书.docx': ['产品部', '市场部'],
    '项目编号-PMP337-Phase3-37 产品上市跟踪计划.docx': ['产品部'],
    '项目编号-PMP338-Phase3-38 项目变更申请书.docx': ['项目经理']
};

const files_JD = {
    '附件3：《初步尽调清单》模板.xlsx':  [],
    '附件7-3：《财务尽调清单》模板.xlsx': [],
    '附件10-法律尽职调查清单模板.doc': [],
};

closeTemplateDivBtn.addEventListener('click', () => {
    templateDiv.classList.add('hidden');
    templateList.innerHTML = '';
});

// 提取通用处理函数，接收阶段标识和文件数组作为参数
function setupTemplateDownload(stage, files) {
    templateDiv.classList.remove('hidden');
    templateList.innerHTML = '';
    Object.keys(files).forEach(file => {
        const fileLine = document.createElement('li');
        fileLine.className = 'ml-2 w-full';
        let fileIcon =  'fa fa-file-word text-blue-600';
        if (file.endsWith('.xlsx') || file.endsWith('.xls')) {
            fileIcon = 'fa fa-file-excel text-green-600';
        } else if (file.endsWith('.pptx')) {
            fileIcon = 'fa fa-file-powerpoint text-red-600';
        } else if (file.endsWith('.mpp')) {
            fileIcon = 'fa fa-file-powerpoint text-green-600';
        }

        fileLine.innerHTML = `
            <span class="${fileIcon}"></span>
            <div class="inline-block flex-col justify-between ml-1">
                <button class="hover:text-primary" data-file="${file}">${file}</button>
                <span class="text-gray-400 text-sm">（${files[file].join('，')}）</span>
            </div>
        `;
        templateList.appendChild(fileLine);
    });
    // 绑定下载事件（使用data属性替代id，更灵活）
    templateList.querySelectorAll('button[data-file]').forEach(button => {
        button.addEventListener('click', () => {
            const fileName = button.dataset.file;
            const filePath = `database/Templates/${stage}/${fileName}`;
            downloadByPath(filePath, fileName);
        });
    });
}

// 绑定按钮事件，传入对应阶段和文件数组
if (btn_00) {
    btn_00.addEventListener('click', () => {
        setupTemplateDownload('00-概念阶段', files_00);
    });
}

if (btn_CH1) {
    btn_01.addEventListener('click', () => {
        setupTemplateDownload('01-策划阶段', files_01);
    });
}

if (btn_02) {
    btn_02.addEventListener('click', () => {
        setupTemplateDownload('02-执行阶段', files_02);
    });
}

if (btn_03) {
    btn_03.addEventListener('click', () => {
        setupTemplateDownload('03-发布阶段', files_03);
    });
}

if (btn_JD) {
    btn_JD.addEventListener('click', () => {
        setupTemplateDownload('JD-尽职调查', files_JD);
    });
}