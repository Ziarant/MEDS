// 获取DOM元素
const audioFileInput = document.getElementById('audio-file');
const uploadArea = document.getElementById('upload-area');
const fileNameDisplay = document.getElementById('file-name');
const analyzeBtn = document.getElementById('analyze-btn');
const explainSpan = document.getElementById('explain-span');
const audioPlayer = document.getElementById('audio-player');
const playerContainer = document.getElementById('player-container');
const spectrumContainer = document.getElementById('spectrum-container');
const spectrumCanvas = document.getElementById('spectrum-canvas');
const loadingIndicator = document.getElementById('loading-indicator');
const sampleRateDisplay = document.getElementById('sample-rate');
const durationDisplay = document.getElementById('duration');
const highFrequencyRatioDisplay = document.getElementById('high-frequency-ratio');
const waveformBtn = document.getElementById('waveform-btn');
const frequencyBtn = document.getElementById('frequency-btn');
const spectrogramBtn = document.getElementById('spectrogram-btn');

// Canvas上下文
const ctx = spectrumCanvas.getContext('2d');

// 全局变量
let audioContext;
let audioBuffer;
let currentVisualization = 'waveform';
const HIGH_FREQ_THRESHOLD = 2000; // 高频阈值（Hz）

// 初始化画布尺寸
function resizeCanvas() {
    const container = spectrumCanvas.parentElement;
    spectrumCanvas.width = container.clientWidth;
    spectrumCanvas.height = container.clientHeight;

    // 如果已有音频数据，重新绘制
    if (audioBuffer) {
        drawVisualization();
    }
}

// 监听窗口大小变化，调整画布尺寸
window.addEventListener('resize', resizeCanvas);
// 初始调整一次
resizeCanvas();

// 处理文件上传
audioFileInput.addEventListener('change', () => {
    if (audioFileInput.files.length > 0) {
        handleFileUpload();
    }
});

// 文件拖放处理
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    uploadArea.classList.add('border-primary', 'bg-primary/5');
    uploadArea.classList.remove('border-gray-300');
}

function unhighlight() {
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
    uploadArea.classList.add('border-gray-300');
}

// 处理文件拖放
uploadArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    e.preventDefault()
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (file.type === 'audio/m4a' || file.type === 'audio/x-m4a') {
            handleFile(file);
        } else {
            alert('请上传M4A格式的音频文件');
        }
    }
}

// 分析按钮点击事件
analyzeBtn.addEventListener('click', analyzeAudio);

// 可视化切换按钮
waveformBtn.addEventListener('click', () => {
    explainSpan.textContent = '振幅（响度相关）与时间的关系，可用于观察音频的波形';
    currentVisualization = 'waveform';
    updateVisualizationButtons();
    drawVisualization();
});

frequencyBtn.addEventListener('click', () => {
    explainSpan.textContent = '能量与频率（Hz）的关系，可用于确定声音的主要频率成分';
    currentVisualization = 'frequency';
    updateVisualizationButtons();
    drawVisualization();
});

spectrogramBtn.addEventListener('click', () => {
    explainSpan.textContent = '时间与频率（Hz）的关系';
    currentVisualization = 'spectrogram';
    updateVisualizationButtons();
    drawVisualization();
});

// 更新可视化按钮状态
function updateVisualizationButtons() {
    [waveformBtn, frequencyBtn, spectrogramBtn].forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'bg-gray-200');
        btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    });

    if (currentVisualization === 'waveform') {
        waveformBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        waveformBtn.classList.add('bg-primary', 'text-white');
    } else if (currentVisualization === 'frequency') {
        frequencyBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        frequencyBtn.classList.add('bg-primary', 'text-white');
    } else if (currentVisualization === 'spectrogram') {
        spectrogramBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        spectrogramBtn.classList.add('bg-primary', 'text-white');
    }
}

// 处理文件上传
function handleFileUpload() {
    const file = audioFileInput.files[0];
    if (file) {
        handleFile(file);
    } else {
        alert('请上传M4A格式的音频文件');
    }
}

// 处理文件
function handleFile(file) {
    // 显示文件名
    fileNameDisplay.textContent = `已选择: ${file.name}`;
    fileNameDisplay.classList.remove('hidden');

    // 启用分析按钮
    analyzeBtn.disabled = false;

    // 创建音频URL
    const audioUrl = URL.createObjectURL(file);
    audioPlayer.src = audioUrl;

    // 频谱分析开启
    analyzeBtn.classList.toggle('disabled', false);
}

// 分析音频
function analyzeAudio() {
    // 显示加载指示器
    loadingIndicator.classList.remove('hidden');

    // 初始化AudioContext
    if (!audioContext) {
        audioContext = new (window.AudioContext)();
    }

    // 解码音频文件
    const audioSource = audioPlayer.src;
    fetch(audioSource)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            audioBuffer = buffer;
            loadingIndicator.classList.add('hidden');
            spectrumContainer.classList.remove('hidden');

            // 显示音频信息
            sampleRateDisplay.textContent = `${audioBuffer.sampleRate} Hz`;
            durationDisplay.textContent = `${(audioBuffer.duration).toFixed(2)} 秒`;

            // 计算高频能量占比
            calculateHighFrequencyRatio(audioBuffer);

            // 绘制可视化
            drawVisualization();
        })
        .catch(error => {
            console.error('音频解码错误:', error);
            loadingIndicator.classList.add('hidden');
            alert('分析音频时出错: ' + error.message);
        });
}

// 计算高频能量占比
function calculateHighFrequencyRatio(audioBuffer) {
    if (!audioBuffer) return;
    // 创建分析器
    const fftSize = 2048;
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = 0.3; // 平滑时间常数

    // 获取音频数据
    const audioSourceNode = audioContext.createBufferSource(); 
    audioSourceNode.buffer = audioBuffer; // 直接使用音频元素的源
    audioSourceNode.connect(analyser);
    analyser.connect(audioContext.destination); // 连接到输出
    
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    audioSourceNode.start(0); // 开始播放音频
    analyser.getByteFrequencyData(frequencyData);

    audioSourceNode.stop();

    for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > 0) {
            // 频率：
            const frequency = (i * audioContext.sampleRate) / (2 * frequencyData.length);
            console.log(`${frequency} Hz: ${frequencyData[i]} dB`);
        }
    }
}

// 绘制可视化
function drawVisualization() {
    if (!audioBuffer) return;

    // 清空画布
    ctx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

    if (currentVisualization === 'waveform') {
        drawWaveform();
    } else if (currentVisualization === 'frequency') {
        drawFrequencySpectrum();
    }
}

// 绘制波形图
function drawWaveform() {
    // 获取音频数据(第一个声道数据)
    const channelCount = audioBuffer.numberOfChannels;
    const colorList = ['#3B82F6', // 蓝色 - 声道 0
        '#10B981', // 绿色 - 声道 1
        '#8B5CF6', // 紫色 - 声道 2
        '#F59E0B', // 黄色 - 声道 3
        '#EF4444', // 红色 - 声道 4
        '#EC4899', // 粉色 - 声道 5
        '#06B6D4', // 青色 - 声道 6
        '#6B7280'  // 灰色 - 声道 7+
    ]
    ctx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

    let maxScale = 0.00001
    for (let i = 0; i < channelCount; i++) {
        const channelData = audioBuffer.getChannelData(i);
        const bufferLength = channelData.length;
        // 绘制波形
        ctx.lineWidth = 2;
        ctx.strokeStyle = colorList[i % colorList.length]; // 使用颜色列表中的颜色
        ctx.beginPath();
        const sliceWidth = spectrumCanvas.width / bufferLength;
        let x = 0;

        // 计算最大振幅
        const maxAmplitude = Math.max(...channelData.map(Math.abs)) ;
        const scaleFactor = (spectrumCanvas.height -5); // 缩放因子，确保波形适应画布高度
        for (let i = 0; i < bufferLength; i++) {
            const y = (spectrumCanvas.height / 2) - (channelData[i] * scaleFactor); // 居中显示并缩放
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        if (maxAmplitude > maxScale) {
            maxScale = maxAmplitude;
        }
        
        ctx.lineTo(spectrumCanvas.width, spectrumCanvas.height / 2); // 连接到右边界
        ctx.stroke();
        
        // 图例
        ctx.fillStyle = colorList[i % colorList.length];
        ctx.fillRect(30, 60 + i * 20, 10, 10);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`通道 ${i+1}，最大振幅: ${maxAmplitude.toFixed(3)}`, 50, 70 + i * 20);
    }

    // 

    // 绘制坐标轴
    drawAxes('时间(秒)', '振幅');
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('波形图', spectrumCanvas.width / 2, 20);

    // 绘制图例块
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`通道数: ${channelCount}`, 10, 15);
    // 绘制通道图例
    ctx.fillText('通道图例:', 10, 40);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'left';
}

// 绘制频谱图
function drawFrequencySpectrum() {
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 2048;

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    source.start(0);
    analyzer.getByteFrequencyData(dataArray);
    source.stop();

    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > 0) { 
            console.log(`Frequency Bin ${i}: ${dataArray[i]} dB`);
        }
    }

    // 绘制频谱
    const barWidth = (spectrumCanvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > 0 ) {
            console.log(`Frequency Bin ${i}: ${dataArray[i]} dB`);
        }
        const barHeight = (dataArray[i] / 255) * spectrumCanvas.height;

        // 为高频部分使用不同颜色
        const frequency = (i * audioContext.sampleRate) / (2 * bufferLength);
        ctx.fillStyle = frequency > HIGH_FREQ_THRESHOLD ? '#10B981' : '#3B82F6';

        ctx.fillRect(x, spectrumCanvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }

    // 绘制高频阈值线
    const thresholdX = (HIGH_FREQ_THRESHOLD / (audioContext.sampleRate / 2)) * spectrumCanvas.width;
    ctx.beginPath();
    ctx.moveTo(thresholdX, 0);
    ctx.lineTo(thresholdX, spectrumCanvas.height);
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制坐标轴
    drawAxes('频率 (Hz)', '能量');
}

// 绘制坐标轴
function drawAxes(xLabel, yLabel) {
    // 绘制坐标轴
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;

    // X轴
    ctx.beginPath();
    ctx.moveTo(0, spectrumCanvas.height - 5);
    ctx.lineTo(spectrumCanvas.width, spectrumCanvas.height - 1);
    ctx.stroke();

    // Y轴
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, spectrumCanvas.height);
    ctx.stroke();

    // 绘制轴标签
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, spectrumCanvas.width / 2, spectrumCanvas.height - 15);

    ctx.save();
    ctx.translate(15, spectrumCanvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // 高频阈值标签
    if (currentVisualization === 'frequency' || currentVisualization === 'spectrogram') {
        ctx.fillStyle = 'red';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`高频阈值: ${HIGH_FREQ_THRESHOLD} Hz`, 10, 20);
    }
}