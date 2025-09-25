
let currentDate = new Date();
document.addEventListener('DOMContentLoaded', renderCalendar(currentDate));

// 绑定月份切换事件
document.getElementById('prev-month').addEventListener('click', function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
});

document.getElementById('next-month').addEventListener('click', function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
});

// 日历渲染函数
function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 更新月份标题
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    document.getElementById('current-month').textContent = `${year}年${monthNames[month]}`;

    // 获取日历网格容器
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // 清空现有内容

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月最后一天
    const lastDay = new Date(year, month + 1, 0);

    // 获取当月第一天是星期几（0-6，0是星期日）
    const firstDayIndex = firstDay.getDay();

    // 获取当月天数
    const daysInMonth = lastDay.getDate();

    // 获取上个月的最后几天
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    // 生成上个月的日期
    for (let i = firstDayIndex; i > 0; i--) {
        const day = document.createElement('div');
        day.classList.add('calendar-day', 'other-month');
        day.textContent = prevMonthDays - i + 1;
        calendarGrid.appendChild(day);
    }

    // 存储有申报活动的日期
    const eventDates = [15, 20, 30]; // 示例：15日、20日、30日有申报活动

    // 生成当月的日期
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');

        // 标记今天
        if (isCurrentMonth && today.getDate() === i) {
            day.classList.add('today');
        }

        // 标记有活动的日期
        if (eventDates.includes(i)) {
            day.classList.add('has-event');
        }

        day.textContent = i;

        // 添加点击事件，显示当天的申报项目
        day.addEventListener('click', function () {
            showDayEvents(year, month, i);
        });

        calendarGrid.appendChild(day);
    }

    // 计算需要多少个下个月的日期来填满网格
    const totalDays = firstDayIndex + daysInMonth;
    const nextMonthDays = 7 - (totalDays % 7);

    // 生成下个月的日期
    if (nextMonthDays < 7) {
        for (let i = 1; i <= nextMonthDays; i++) {
            const day = document.createElement('div');
            day.classList.add('calendar-day', 'other-month');
            day.textContent = i;
            calendarGrid.appendChild(day);
        }
    }
}

// 日历：改变特定日期背景颜色
function noteClander(startData, endData, color) {
    const calendarGrid = document.getElementById('calendar-grid');
    const days = calendarGrid.querySelectorAll('.calendar-day');

    days.forEach(day => {
        const dayNumber = parseInt(day.textContent);
        if (dayNumber >= startData && dayNumber <= endData) {
            day.style.backgroundColor = color;
        }
    });
}
