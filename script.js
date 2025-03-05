console.log('JavaScript is running'); // Add this line to confirm execution
// Supabase初始化
const supabaseUrl = 'https://hwyycyzoobdyhhsqmzaf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3eXljeXpvb2JkeWhoc3FtemFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzMzNTcsImV4cCI6MjA1NjcwOTM1N30.Tk-TH45ias_nTkXHcwogu4mRscLkqzoJ0pCmUxKPDvI'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// 頁面加載完成後執行
document.addEventListener('DOMContentLoaded', function () {
    // 服務卡片點擊事件
    const deliveryRegistrationCard = document.getElementById('delivery-registration-card');
    const deliveryStatusCard = document.getElementById('delivery-status-card');

    deliveryRegistrationCard.addEventListener('click', showDeliveryRegistration);
    deliveryStatusCard.addEventListener('click', showDeliveryStatus);

    // 取消送貨登記按鈕
    const cancelRegistrationBtn = document.getElementById('cancelRegistration');
    cancelRegistrationBtn.addEventListener('click', hideDeliveryRegistration);

    // 送貨登記表單提交事件
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleDeliveryRegistration);

    // 送貨查詢表單提交事件
    const deliveryStatusForm = document.getElementById('deliveryStatusForm');
    deliveryStatusForm.addEventListener('submit', handleDeliveryStatusSearch);

    // 導航欄鏈接點擊事件
    const homeLink = document.getElementById('home-link');
    const deliveryStatusLink = document.getElementById('delivery-status-link');

    homeLink.addEventListener('click', showHomePage);
    deliveryStatusLink.addEventListener('click', function (event) {
        event.preventDefault();
        showDeliveryStatus();

        // 更新導航欄活動狀態
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// 顯示首頁
function showHomePage(event) {
    event.preventDefault();

    // 隱藏所有內容區塊
    const deliveryRegistrationForm = document.getElementById('deliveryRegistrationForm');
    const deliveryStatusSection = document.getElementById('deliveryStatusSection');

    if (deliveryRegistrationForm) {
        deliveryRegistrationForm.style.display = 'none';
    }

    if (deliveryStatusSection) {
        deliveryStatusSection.style.display = 'none';
    }

    // 顯示服務卡片
    const serviceCards = document.querySelector('.service-cards');
    if (serviceCards) {
        serviceCards.style.display = 'flex';
    }

    // 更新導航欄活動狀態
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#') {
            link.classList.add('active');
        }
    });
}

// 顯示送貨登記表單
function showDeliveryRegistration() {
    // 隱藏所有內容區塊
    const serviceCards = document.querySelector('.service-cards');
    const deliveryRegistrationForm = document.getElementById('deliveryRegistrationForm');
    const deliveryStatusSection = document.getElementById('deliveryStatusSection');

    if (serviceCards) {
        serviceCards.style.display = 'none';
    }

    if (deliveryStatusSection) {
        deliveryStatusSection.style.display = 'none';
    }

    if (deliveryRegistrationForm) {
        deliveryRegistrationForm.style.display = 'block';
    }

    // 更新導航欄活動狀態
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#') {
            link.classList.add('active');
        }
    });
}

// 隱藏送貨登記表單
function hideDeliveryRegistration() {
    const serviceCards = document.querySelector('.service-cards');
    const deliveryRegistrationForm = document.getElementById('deliveryRegistrationForm');

    serviceCards.style.display = 'flex';
    deliveryRegistrationForm.style.display = 'none';
}

// 顯示送貨查詢
function showDeliveryStatus() {
    // 隱藏所有內容區塊
    const serviceCards = document.querySelector('.service-cards');
    const deliveryRegistrationForm = document.getElementById('deliveryRegistrationForm');
    const deliveryStatusSection = document.getElementById('deliveryStatusSection');

    if (serviceCards) {
        serviceCards.style.display = 'none';
    }

    if (deliveryRegistrationForm) {
        deliveryRegistrationForm.style.display = 'none';
    }

    if (deliveryStatusSection) {
        deliveryStatusSection.style.display = 'block';
    }
}

// 處理送貨登記
async function handleDeliveryRegistration(event) {
    event.preventDefault();

    // 收集表單數據
    const formData = {
        delivery_number: document.getElementById('deliveryNumber').value,
        recipient_name: document.getElementById('recipientName').value,
        recipient_phone: document.getElementById('recipientPhone').value,
        delivery_address: document.getElementById('deliveryAddress').value,
        package_description: document.getElementById('packageDescription').value,
        estimated_delivery_time: document.getElementById('estimatedDeliveryTime').value,
        additional_notes: document.getElementById('additionalNotes').value,
        status: '已登記'
    };

    // 基本表單驗證
    if (validateForm(formData)) {
        try {
            // 儲存送貨登記資料到Supabase
            const { data, error } = await supabase
                .from('deliveries')
                .insert([formData])

            if (error) throw error;

            // 顯示成功訊息
            alert('送貨登記成功！');

            // 重置表單並返回服務卡片
            event.target.reset();
            hideDeliveryRegistration();
        } catch (error) {
            console.error('Error saving delivery:', error);
            console.log('Error details:', error.message);
            alert('送貨登記失敗，請稍後再試。');
        }
    }
}

// 處理送貨查詢
async function handleDeliveryStatusSearch(event) {
    event.preventDefault();

    const searchDeliveryNumber = document.getElementById('searchDeliveryNumber').value;
    const deliveryStatusResult = document.getElementById('deliveryStatusResult');

    try {
        const { data, error } = await supabase
            .from('deliveries')
            .select('*')
            .eq('delivery_number', searchDeliveryNumber)
            .single();

        if (error) throw error;

        if (data) {
            deliveryStatusResult.innerHTML = `
                <h3>送貨單詳細資訊</h3>
                <p>送貨單號: ${data.delivery_number}</p>
                <p>收件人: ${data.recipient_name}</p>
                <p>電話: ${data.recipient_phone}</p>
                <p>地址: ${data.delivery_address}</p>
                <p>狀態: ${data.status}</p>
                <p>預計送達時間: ${data.estimated_delivery_time || '未指定'}</p>
                <p>備註: ${data.additional_notes || '無'}</p>
            `;
        } else {
            deliveryStatusResult.innerHTML = '<p>查無此送貨單號</p>';
        }
    } catch (error) {
        console.error('Error searching delivery:', error);
        console.log('Error details:', error.message);
        deliveryStatusResult.innerHTML = '<p>查詢失敗，請稍後再試</p>';
    }
}

// 表單驗證
function validateForm(formData) {
    // 必填欄位驗證
    const requiredFields = [
        'delivery_number',
        'recipient_name',
        'recipient_phone',
        'delivery_address'
    ];

    for (let field of requiredFields) {
        if (!formData[field]) {
            alert(`請填寫${getFieldLabel(field)}`);
            return false;
        }
    }

    // 電話號碼驗證
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.recipient_phone)) {
        alert('請輸入有效的10位數電話號碼');
        return false;
    }

    return true;
}

// 取得欄位中文標籤
function getFieldLabel(fieldName) {
    const labels = {
        'delivery_number': '送貨單號',
        'recipient_name': '收件人姓名',
        'recipient_phone': '收件人電話',
        'delivery_address': '送貨地址'
    };
    return labels[fieldName] || fieldName;
}
