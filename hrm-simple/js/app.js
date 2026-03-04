// ===== Simple HRM App =====
const DATA = {
    employee: {
        name: 'สมชาย รักดี',
        position: 'พยาบาลวิชาชีพชำนาญการ',
        department: 'กลุ่มงานการพยาบาล',
        section: 'หอผู้ป่วยใน (IPD)',
        id: 'EMP001',
        type: 'ข้าราชการ',
        phone: '081-234-5678',
        email: 'somchai.r@skph.go.th',
        startDate: '1 พ.ค. 2558',
        years: '11 ปี',
        bank: 'กรุงไทย xxx-x-xxxxx-x',
        idCard: '1-5099-00xxx-xx-x',
        emergency: 'นางสมหญิง รักดี (คู่สมรส) 089-xxx-xxxx',
        avatar: 'https://ui-avatars.com/api/?name=สมชาย+รักดี&background=1d4ed8&color=fff&size=200&font-size=0.35'
    },

    payslips: [
        {
            label: 'กุมภาพันธ์ 2569',
            income: [
                { name: 'เงินเดือน', amount: 32250 },
                { name: 'เงินประจำตำแหน่ง', amount: 3500 },
                { name: 'ค่าตอบแทน พ.ต.ส.', amount: 5000 },
                { name: 'ค่าเสี่ยงภัย', amount: 2500 },
                { name: 'ค่าล่วงเวลา (OT)', amount: 4800 },
            ],
            deduction: [
                { name: 'ภาษี', amount: 1250 },
                { name: 'กบข.', amount: 967.50 },
                { name: 'ประกันสังคม', amount: 750 },
                { name: 'สหกรณ์', amount: 5000 },
                { name: 'ประกันชีวิต', amount: 1500 },
            ],
            totalIncome: 48050,
            totalDeduction: 9467.50,
            net: 38582.50
        },
        {
            label: 'มกราคม 2569',
            income: [
                { name: 'เงินเดือน', amount: 32250 },
                { name: 'เงินประจำตำแหน่ง', amount: 3500 },
                { name: 'ค่าตอบแทน พ.ต.ส.', amount: 5000 },
                { name: 'ค่าเสี่ยงภัย', amount: 2500 },
                { name: 'ค่าล่วงเวลา (OT)', amount: 3200 },
            ],
            deduction: [
                { name: 'ภาษี', amount: 1150 },
                { name: 'กบข.', amount: 967.50 },
                { name: 'ประกันสังคม', amount: 750 },
                { name: 'สหกรณ์', amount: 5000 },
                { name: 'ประกันชีวิต', amount: 1500 },
            ],
            totalIncome: 46450,
            totalDeduction: 9367.50,
            net: 37082.50
        },
        {
            label: 'ธันวาคม 2568',
            income: [
                { name: 'เงินเดือน', amount: 32250 },
                { name: 'เงินประจำตำแหน่ง', amount: 3500 },
                { name: 'ค่าตอบแทน พ.ต.ส.', amount: 5000 },
                { name: 'ค่าเสี่ยงภัย', amount: 2500 },
                { name: 'ค่าล่วงเวลา (OT)', amount: 6400 },
            ],
            deduction: [
                { name: 'ภาษี', amount: 1350 },
                { name: 'กบข.', amount: 967.50 },
                { name: 'ประกันสังคม', amount: 750 },
                { name: 'สหกรณ์', amount: 5000 },
                { name: 'ประกันชีวิต', amount: 1500 },
            ],
            totalIncome: 49650,
            totalDeduction: 9567.50,
            net: 40082.50
        }
    ],

    leave: [
        { type: 'ลาป่วย', used: 3, total: 60, color: '#dc2626', icon: '🤒' },
        { type: 'ลากิจ', used: 2, total: 45, color: '#ea580c', icon: '📋' },
        { type: 'ลาพักผ่อน', used: 5, total: 10, color: '#0d9488', icon: '🏖️' },
        { type: 'ลาอื่นๆ', used: 1, total: 30, color: '#7c3aed', icon: '📅' },
    ],

    announcements: [
        { title: 'แจ้งกำหนดตรวจสุขภาพประจำปี', body: 'เชิญบุคลากรทุกท่านเข้ารับการตรวจสุขภาพ วันที่ 15-20 มี.ค. 2569 ณ คลินิกอาชีวเวชกรรม', date: '3 มี.ค. 69', isNew: true, icon: '🏥', color: '#dc2626', bg: '#fee2e2' },
        { title: 'ระบบ HIS ใหม่ เริ่มใช้ 1 เม.ย.', body: 'โรงพยาบาลจะปรับเปลี่ยนระบบสารสนเทศใหม่ กรุณาเข้าอบรมก่อนวันใช้งานจริง', date: '1 มี.ค. 69', isNew: true, icon: '💻', color: '#1d4ed8', bg: '#eff6ff' },
        { title: 'ตารางเวรเดือน มี.ค. 2569', body: 'ตรวจสอบตารางเวรได้ที่กลุ่มงานการพยาบาล', date: '25 ก.พ. 69', isNew: false, icon: '📅', color: '#0d9488', bg: '#f0fdfa' },
        { title: 'เปิดรับสมัครอบรม ACLS รุ่น 3', body: 'พยาบาลที่สนใจสมัครได้ที่กลุ่มงานฝึกอบรม ภายใน 10 มี.ค. 2569', date: '20 ก.พ. 69', isNew: false, icon: '📚', color: '#7c3aed', bg: '#ede9fe' },
    ]
};

function fmt(n) {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

// ===== App =====
const app = {
    currentPage: 'home',
    payslipIndex: 0,

    // ----- Auth Flow -----
    sendOTP() {
        document.getElementById('login-phone').classList.add('hidden');
        document.getElementById('login-otp').classList.remove('hidden');
        const phone = document.getElementById('phone-input').value || '81-234-5678';
        document.getElementById('otp-phone-display').textContent = '0' + phone;
    },

    backToPhone() {
        document.getElementById('login-otp').classList.add('hidden');
        document.getElementById('login-phone').classList.remove('hidden');
    },

    verifyOTP() {
        document.getElementById('login-otp').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        this.goTo('home');
    },

    logout() {
        document.getElementById('app').classList.add('hidden');
        document.getElementById('login-phone').classList.remove('hidden');
    },

    // ----- Navigation -----
    goTo(page) {
        this.currentPage = page;
        const titles = {
            home: 'หน้าหลัก',
            payslip: 'สลิปเงินเดือน',
            leave: 'วันลา',
            profile: 'ข้อมูลของฉัน',
            announcements: 'ประกาศ',
            certificate: 'ใบรับรองเงินเดือน',
        };

        document.getElementById('topbar-title').textContent = titles[page] || 'หน้าหลัก';

        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.page === page);
        });

        const container = document.getElementById('page-container');
        container.style.animation = 'none';
        container.offsetHeight;
        container.style.animation = 'fadeIn 0.25s ease';
        container.innerHTML = this.render[page] ? this.render[page]() : '';
    },

    // ----- Payslip Nav -----
    prevMonth() {
        if (this.payslipIndex < DATA.payslips.length - 1) {
            this.payslipIndex++;
            this.goTo('payslip');
        }
    },
    nextMonth() {
        if (this.payslipIndex > 0) {
            this.payslipIndex--;
            this.goTo('payslip');
        }
    },

    // ----- Page Renderers -----
    render: {
        // ===== HOME =====
        home() {
            const slip = DATA.payslips[0];
            const emp = DATA.employee;
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'สวัสดีตอนเช้า' : hour < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น';

            return `
                <div class="greeting">
                    <h2>${greeting} ☀️</h2>
                    <p>คุณ${emp.name}</p>
                </div>

                <div class="salary-highlight">
                    <div class="label">เงินเดือนสุทธิเดือนล่าสุด</div>
                    <div class="amount">${fmt(slip.net)} <span style="font-size:0.9rem;font-weight:400">บาท</span></div>
                    <div class="sub">${slip.label}</div>
                    <button class="action-link" onclick="app.goTo('payslip')">
                        <i class="fas fa-eye"></i> ดูรายละเอียด
                    </button>
                </div>

                <div class="menu-grid">
                    <div class="menu-card" onclick="app.goTo('payslip')">
                        <div class="icon" style="background:#eff6ff;color:#1d4ed8">
                            <i class="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div class="title">สลิป<br>เงินเดือน</div>
                    </div>
                    <div class="menu-card" onclick="app.goTo('certificate')">
                        <div class="icon" style="background:#f0fdfa;color:#0d9488">
                            <i class="fas fa-certificate"></i>
                        </div>
                        <div class="title">ใบรับรอง<br>เงินเดือน</div>
                    </div>
                    <div class="menu-card" onclick="app.goTo('leave')">
                        <div class="icon" style="background:#fff7ed;color:#ea580c">
                            <i class="fas fa-calendar-minus"></i>
                        </div>
                        <div class="title">วันลา<br>คงเหลือ</div>
                    </div>
                    <div class="menu-card" onclick="app.goTo('announcements')">
                        <div class="icon" style="background:#fee2e2;color:#dc2626">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <div class="title">ประกาศ <span class="badge-count">2</span></div>
                    </div>
                    <div class="menu-card" onclick="app.goTo('profile')">
                        <div class="icon" style="background:#ede9fe;color:#7c3aed">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="title">ข้อมูล<br>ของฉัน</div>
                    </div>
                    <div class="menu-card" onclick="window.location.href='../hrm/'">
                        <div class="icon" style="background:#f3f4f6;color:#6b7280">
                            <i class="fas fa-th-large"></i>
                        </div>
                        <div class="title">เมนูเพิ่มเติม<br>(ฉบับเต็ม)</div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title"><i class="fas fa-bullhorn"></i> ประกาศล่าสุด</div>
                        <button class="section-action" onclick="app.goTo('announcements')">ดูทั้งหมด</button>
                    </div>
                    ${DATA.announcements.slice(0, 2).map(a => `
                        <div class="announcement-card" onclick="app.goTo('announcements')">
                            <div class="ann-icon" style="background:${a.bg};color:${a.color}">
                                <span style="font-size:1.3rem">${a.icon}</span>
                            </div>
                            <div class="ann-content">
                                <h4>${a.isNew ? '<span class="new-badge">ใหม่</span>' : ''}${a.title}</h4>
                                <p>${a.body}</p>
                                <div class="ann-date"><i class="fas fa-clock"></i> ${a.date}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        // ===== PAYSLIP =====
        payslip() {
            const idx = app.payslipIndex;
            const slip = DATA.payslips[idx];
            const hasPrev = idx < DATA.payslips.length - 1;
            const hasNext = idx > 0;

            return `
                <div class="payslip-month-selector">
                    <button class="month-nav-btn" onclick="app.prevMonth()" ${!hasPrev ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="month-display">
                        <i class="fas fa-calendar"></i> ${slip.label}
                    </div>
                    <button class="month-nav-btn" onclick="app.nextMonth()" ${!hasNext ? 'disabled style="opacity:0.3"' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div class="payslip-net">
                    <div class="label">เงินเดือนสุทธิ</div>
                    <div class="amount">${fmt(slip.net)} <span class="unit">บาท</span></div>
                </div>

                <div class="payslip-summary">
                    <div class="summary-box">
                        <div class="label">รวมรายรับ</div>
                        <div class="value green">+${fmt(slip.totalIncome)}</div>
                    </div>
                    <div class="summary-box">
                        <div class="label">รวมรายหัก</div>
                        <div class="value red">-${fmt(slip.totalDeduction)}</div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title" style="color:#16a34a"><i class="fas fa-plus-circle"></i> รายรับ</div>
                    </div>
                    <ul class="simple-list">
                        ${slip.income.filter(i => i.amount > 0).map(i => `
                            <li>
                                <div class="list-left">
                                    <div class="list-text">
                                        <div class="primary">${i.name}</div>
                                    </div>
                                </div>
                                <div class="list-right">
                                    <div class="amount green">${fmt(i.amount)}</div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title" style="color:#dc2626"><i class="fas fa-minus-circle"></i> รายหัก</div>
                    </div>
                    <ul class="simple-list">
                        ${slip.deduction.filter(d => d.amount > 0).map(d => `
                            <li>
                                <div class="list-left">
                                    <div class="list-text">
                                        <div class="primary">${d.name}</div>
                                    </div>
                                </div>
                                <div class="list-right">
                                    <div class="amount red">${fmt(d.amount)}</div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="btn-row no-print">
                    <button class="big-btn outline" onclick="window.print()">
                        <i class="fas fa-print"></i> พิมพ์
                    </button>
                </div>
            `;
        },

        // ===== LEAVE =====
        leave() {
            return `
                <div class="leave-grid">
                    ${DATA.leave.map(l => {
                        const remaining = l.total - l.used;
                        const pct = l.total > 0 ? (l.used / l.total) * 100 : 0;
                        return `
                        <div class="leave-card">
                            <div class="leave-icon">${l.icon}</div>
                            <div class="leave-name">${l.type}</div>
                            <div class="leave-remaining" style="color:${l.color}">${remaining}</div>
                            <div class="leave-total">เหลือจาก ${l.total} วัน</div>
                            <div class="leave-bar">
                                <div class="leave-bar-fill" style="width:${pct}%;background:${l.color}"></div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title"><i class="fas fa-info-circle"></i> สรุปการลา</div>
                    </div>
                    <ul class="simple-list">
                        ${DATA.leave.map(l => `
                            <li>
                                <div class="list-left">
                                    <span style="font-size:1.2rem;margin-right:4px">${l.icon}</span>
                                    <div class="list-text">
                                        <div class="primary">${l.type}</div>
                                    </div>
                                </div>
                                <div class="list-right">
                                    <div class="amount">ใช้ ${l.used} / ${l.total} วัน</div>
                                    <div class="sub">เหลือ ${l.total - l.used} วัน</div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="padding:16px;background:#fff7ed;border-radius:16px;border:1px solid #fed7aa;margin-top:4px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                        <i class="fas fa-lightbulb" style="color:#ea580c"></i>
                        <strong style="font-size:0.88rem;color:#9a3412">ต้องการลา?</strong>
                    </div>
                    <p style="font-size:0.82rem;color:#9a3412;opacity:0.8;line-height:1.5">
                        กรุณาติดต่อหัวหน้ากลุ่มงาน หรือยื่นใบลาผ่านระบบ
                        <a href="../hrm/" style="color:#1d4ed8;font-weight:600">HRM ฉบับเต็ม</a>
                    </p>
                </div>
            `;
        },

        // ===== PROFILE =====
        profile() {
            const emp = DATA.employee;
            return `
                <div class="profile-card">
                    <img src="${emp.avatar}" alt="avatar" class="profile-avatar">
                    <h2>${emp.name}</h2>
                    <div class="position">${emp.position}</div>
                    <div class="position">${emp.department}</div>
                    <div class="emp-id"><i class="fas fa-id-badge"></i> รหัส: ${emp.id}</div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title"><i class="fas fa-user"></i> ข้อมูลส่วนตัว</div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-phone"></i>
                        <div><div class="info-label">โทรศัพท์</div><div class="info-value">${emp.phone}</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-envelope"></i>
                        <div><div class="info-label">อีเมล</div><div class="info-value">${emp.email}</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-id-card"></i>
                        <div><div class="info-label">เลขประจำตัวประชาชน</div><div class="info-value">${emp.idCard}</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-phone-volume"></i>
                        <div><div class="info-label">ผู้ติดต่อฉุกเฉิน</div><div class="info-value">${emp.emergency}</div></div>
                    </div>
                </div>

                <div class="section-card">
                    <div class="section-header">
                        <div class="section-title"><i class="fas fa-briefcase"></i> ข้อมูลการทำงาน</div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-building"></i>
                        <div><div class="info-label">สังกัด</div><div class="info-value">${emp.section}</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-tag"></i>
                        <div><div class="info-label">ประเภท</div><div class="info-value">${emp.type}</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-calendar"></i>
                        <div><div class="info-label">วันเริ่มงาน</div><div class="info-value">${emp.startDate} (${emp.years})</div></div>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-university"></i>
                        <div><div class="info-label">บัญชีเงินเดือน</div><div class="info-value">${emp.bank}</div></div>
                    </div>
                </div>

                <div class="logout-section">
                    <button class="logout-btn" onclick="app.logout()">
                        <i class="fas fa-sign-out-alt"></i> ออกจากระบบ
                    </button>
                </div>
            `;
        },

        // ===== ANNOUNCEMENTS =====
        announcements() {
            return `
                <div class="section-card">
                    ${DATA.announcements.map(a => `
                        <div class="announcement-card">
                            <div class="ann-icon" style="background:${a.bg};color:${a.color}">
                                <span style="font-size:1.3rem">${a.icon}</span>
                            </div>
                            <div class="ann-content">
                                <h4>${a.isNew ? '<span class="new-badge">ใหม่</span>' : ''}${a.title}</h4>
                                <p style="-webkit-line-clamp:unset">${a.body}</p>
                                <div class="ann-date"><i class="fas fa-clock"></i> ${a.date}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        // ===== CERTIFICATE =====
        certificate() {
            const emp = DATA.employee;
            const slip = DATA.payslips[0];
            return `
                <div class="cert-preview" id="cert-content">
                    <div class="cert-header">
                        <i class="fas fa-hospital"></i>
                        <h3>โรงพยาบาลสันกำแพง</h3>
                        <h4>อ.สันกำแพง จ.เชียงใหม่</h4>
                        <div class="cert-title-text">หนังสือรับรองเงินเดือน</div>
                    </div>
                    <div class="cert-body">
                        หนังสือฉบับนี้รับรองว่า <strong>นาย${emp.name}</strong>
                        ตำแหน่ง <strong>${emp.position}</strong>
                        สังกัด <strong>${emp.department}</strong>
                    </div>
                    <div class="cert-body">
                        ได้รับเงินเดือนรวมเดือนละ <strong>${fmt(slip.totalIncome)} บาท</strong>
                        หักรายการต่างๆ <strong>${fmt(slip.totalDeduction)} บาท</strong>
                        คงเหลือสุทธิ <strong>${fmt(slip.net)} บาท</strong>
                    </div>
                    <div class="cert-body">
                        จึงออกหนังสือรับรองฉบับนี้ให้ไว้เพื่อเป็นหลักฐาน
                    </div>
                    <div class="cert-date">ออก ณ วันที่ 4 มีนาคม 2569</div>
                    <div class="cert-sign-area">
                        <div class="cert-sign">
                            <div class="sign-line"></div>
                            <div class="sign-name">ผู้อำนวยการโรงพยาบาล</div>
                        </div>
                        <div class="cert-sign">
                            <div class="sign-line"></div>
                            <div class="sign-name">หัวหน้ากลุ่มงานบริหาร</div>
                        </div>
                    </div>
                </div>

                <div class="btn-row no-print">
                    <button class="big-btn" onclick="window.print()">
                        <i class="fas fa-print"></i> พิมพ์ใบรับรอง
                    </button>
                </div>
                <div class="btn-row no-print">
                    <button class="big-btn outline" onclick="app.goTo('home')">
                        <i class="fas fa-arrow-left"></i> กลับหน้าหลัก
                    </button>
                </div>
            `;
        }
    }
};

// OTP input auto-focus
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.otp-box').forEach((box, i, boxes) => {
        box.addEventListener('input', () => {
            if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
        });
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
        });
    });
});
