// ===== HRM Application =====
const app = {
    currentPage: 'dashboard',
    charts: {},

    init() {
        this.bindEvents();
        this.checkAuth();
    },

    bindEvents() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
                this.closeSidebar();
            });
        });

        // Mobile menu
        document.getElementById('menu-toggle').addEventListener('click', () => this.openSidebar());
        document.getElementById('sidebar-close').addEventListener('click', () => this.closeSidebar());
        document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeSidebar());

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) this.closeSidebar();
        });
    },

    checkAuth() {
        const isLoggedIn = sessionStorage.getItem('hrm_logged_in');
        if (isLoggedIn) {
            this.showApp();
        }
    },

    login() {
        sessionStorage.setItem('hrm_logged_in', 'true');
        this.showApp();
    },

    logout() {
        sessionStorage.removeItem('hrm_logged_in');
        document.getElementById('app').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    },

    showApp() {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        this.navigateTo('dashboard');
    },

    navigateTo(page) {
        this.currentPage = page;

        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });

        // Destroy existing charts
        Object.values(this.charts).forEach(c => c.destroy());
        this.charts = {};

        // Render page
        const content = document.getElementById('page-content');
        const titles = {
            dashboard: 'แดชบอร์ด',
            payslip: 'สลิปเงินเดือน',
            compensation: 'ค่าตอบแทนรวม',
            certificate: 'ใบรับรองเงินเดือน',
            tax: 'ภาษี / กบข. / ประกันสังคม',
            leave: 'การลา',
            attendance: 'เวลาทำงาน',
            ot: 'ค่าล่วงเวลา (OT)',
            profile: 'ข้อมูลส่วนตัว',
            benefits: 'สวัสดิการ',
            training: 'การฝึกอบรม',
            documents: 'เอกสาร',
            announcements: 'ประกาศ',
            settings: 'ตั้งค่า',
        };

        document.getElementById('page-title').textContent = titles[page] || page;
        content.innerHTML = '';
        content.style.animation = 'none';
        content.offsetHeight; // trigger reflow
        content.style.animation = 'fadeIn 0.3s ease';

        const renderer = this.pages[page];
        if (renderer) {
            content.innerHTML = renderer();
            this.afterRender(page);
        }
    },

    afterRender(page) {
        if (page === 'dashboard') this.initDashboardCharts();
        if (page === 'compensation') this.initCompensationCharts();
        if (page === 'payslip') this.initPayslipEvents();
    },

    openSidebar() {
        document.getElementById('sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
        document.body.style.overflow = '';
    },

    // ===== Page Renderers =====
    pages: {
        // ===== DASHBOARD =====
        dashboard() {
            const emp = MOCK.employee;
            const payslip = MOCK.payslips[0];
            const att = MOCK.attendance;

            return `
                <div class="stats-grid">
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fas fa-wallet"></i></div>
                        <div class="stat-info">
                            <h3>เงินเดือนสุทธิ</h3>
                            <div class="stat-value">${formatCurrency(payslip.netPay)}</div>
                            <div class="stat-change up"><i class="fas fa-arrow-up"></i> +4.05% จากเดือนก่อน</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                        <div class="stat-info">
                            <h3>วันทำงานเดือนนี้</h3>
                            <div class="stat-value">${att.monthlySummary.present}/${att.monthlySummary.workDays}</div>
                            <div class="stat-change"><i class="fas fa-clock"></i> ลา ${att.monthlySummary.leave} วัน</div>
                        </div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-icon"><i class="fas fa-umbrella-beach"></i></div>
                        <div class="stat-info">
                            <h3>วันลาคงเหลือ</h3>
                            <div class="stat-value">${MOCK.leave.balances[2].total - MOCK.leave.balances[2].used} วัน</div>
                            <div class="stat-change"><i class="fas fa-info-circle"></i> ลาพักผ่อน</div>
                        </div>
                    </div>
                    <div class="stat-card teal">
                        <div class="stat-icon"><i class="fas fa-business-time"></i></div>
                        <div class="stat-info">
                            <h3>ค่าล่วงเวลาเดือนนี้</h3>
                            <div class="stat-value">${formatCurrency(MOCK.ot.monthlyOT)}</div>
                            <div class="stat-change"><i class="fas fa-clock"></i> ${MOCK.ot.totalHours} ชม.</div>
                        </div>
                    </div>
                </div>

                <div class="quick-actions" style="margin-bottom:24px">
                    <button class="quick-action-btn" onclick="app.navigateTo('payslip')">
                        <i class="fas fa-file-invoice-dollar"></i>
                        <span>ดูสลิปเงินเดือน</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.navigateTo('certificate')">
                        <i class="fas fa-certificate"></i>
                        <span>ใบรับรองเงินเดือน</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.navigateTo('leave')">
                        <i class="fas fa-calendar-minus"></i>
                        <span>ขอลา</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.navigateTo('attendance')">
                        <i class="fas fa-clock"></i>
                        <span>ลงเวลาทำงาน</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.navigateTo('documents')">
                        <i class="fas fa-folder-open"></i>
                        <span>เอกสาร</span>
                    </button>
                    <button class="quick-action-btn" onclick="app.navigateTo('training')">
                        <i class="fas fa-graduation-cap"></i>
                        <span>การฝึกอบรม</span>
                    </button>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-chart-line"></i> รายได้สุทธิ 12 เดือน</div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container"><canvas id="incomeChart"></canvas></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-bullhorn"></i> ประกาศล่าสุด</div>
                            <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('announcements')">ดูทั้งหมด</button>
                        </div>
                        <div class="card-body" style="padding:0">
                            ${MOCK.announcements.slice(0, 3).map(a => `
                                <div class="announcement-item">
                                    <div class="announcement-icon" style="background:${a.colorBg};color:${a.color}">
                                        <i class="fas ${a.icon}"></i>
                                    </div>
                                    <div class="announcement-content">
                                        <h4>${a.isNew ? '<span class="badge badge-danger" style="font-size:0.65rem;margin-right:6px">ใหม่</span>' : ''}${a.title}</h4>
                                        <p>${a.content.substring(0, 80)}...</p>
                                        <div class="announcement-date"><i class="fas fa-clock"></i> ${a.date}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="grid-2" style="margin-top:24px">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-clock"></i> เวลาทำงานล่าสุด</div>
                            <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('attendance')">ดูทั้งหมด</button>
                        </div>
                        <div class="card-body" style="padding:0">
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead><tr><th>วัน</th><th>เข้า</th><th>ออก</th><th>สถานะ</th></tr></thead>
                                    <tbody>
                                        ${att.weekly.slice(0, 5).map(r => `
                                            <tr>
                                                <td>${r.date}</td>
                                                <td>${r.checkIn}</td>
                                                <td>${r.checkOut}</td>
                                                <td><span class="badge ${r.statusClass}">${r.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-calendar-minus"></i> การลาล่าสุด</div>
                            <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('leave')">ดูทั้งหมด</button>
                        </div>
                        <div class="card-body" style="padding:0">
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead><tr><th>ประเภท</th><th>วันที่</th><th>จำนวน</th><th>สถานะ</th></tr></thead>
                                    <tbody>
                                        ${MOCK.leave.recent.slice(0, 5).map(r => `
                                            <tr>
                                                <td>${r.type}</td>
                                                <td>${r.startDate}</td>
                                                <td>${r.days} วัน</td>
                                                <td><span class="badge ${r.statusClass}">${r.status}</span></td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== PAYSLIP =====
        payslip() {
            const slip = MOCK.payslips[0];
            const options = MOCK.payslips.map((p, i) =>
                `<option value="${i}">${p.month} ${p.year}</option>`
            ).join('');

            return `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-file-invoice-dollar"></i> สลิปเงินเดือน</div>
                        <div class="payslip-selector">
                            <select id="payslip-month" onchange="app.changePayslip(this.value)">
                                ${options}
                            </select>
                            <button class="btn btn-sm btn-primary" onclick="app.printPayslip()"><i class="fas fa-print"></i> พิมพ์</button>
                            <button class="btn btn-sm btn-accent" onclick="app.downloadPayslip()"><i class="fas fa-download"></i> ดาวน์โหลด</button>
                        </div>
                    </div>

                    <div class="card-body" style="padding:16px 24px;background:var(--gray-50);border-bottom:1px solid var(--gray-100)">
                        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px">
                            <div>
                                <div style="font-size:0.78rem;color:var(--gray-500)">ชื่อ-สกุล</div>
                                <div style="font-weight:600">${MOCK.employee.prefix}${MOCK.employee.fullName}</div>
                            </div>
                            <div>
                                <div style="font-size:0.78rem;color:var(--gray-500)">ตำแหน่ง</div>
                                <div style="font-weight:500">${MOCK.employee.position}</div>
                            </div>
                            <div>
                                <div style="font-size:0.78rem;color:var(--gray-500)">สังกัด</div>
                                <div style="font-weight:500">${MOCK.employee.department}</div>
                            </div>
                            <div>
                                <div style="font-size:0.78rem;color:var(--gray-500)">รหัสพนักงาน</div>
                                <div style="font-weight:500">${MOCK.employee.id}</div>
                            </div>
                        </div>
                    </div>

                    <div id="payslip-content">
                        ${app.renderPayslipContent(slip)}
                    </div>
                </div>
            `;
        },

        // ===== COMPENSATION =====
        compensation() {
            const comp = MOCK.compensation;
            return `
                <div class="comp-summary-grid">
                    <div class="comp-summary-item" style="border-top:3px solid var(--primary)">
                        <div class="comp-amount" style="color:var(--primary)">${formatCurrency(comp.yearlyIncome)}</div>
                        <div class="comp-label">รายได้รวมทั้งปี</div>
                    </div>
                    <div class="comp-summary-item" style="border-top:3px solid var(--danger)">
                        <div class="comp-amount" style="color:var(--danger)">${formatCurrency(comp.yearlyDeduction)}</div>
                        <div class="comp-label">หักรวมทั้งปี</div>
                    </div>
                    <div class="comp-summary-item" style="border-top:3px solid var(--success)">
                        <div class="comp-amount" style="color:var(--success)">${formatCurrency(comp.yearlyNet)}</div>
                        <div class="comp-label">สุทธิรวมทั้งปี</div>
                    </div>
                    <div class="comp-summary-item" style="border-top:3px solid var(--accent)">
                        <div class="comp-amount" style="color:var(--accent)">${formatCurrency(comp.monthlyAvgNet)}</div>
                        <div class="comp-label">เฉลี่ยต่อเดือน</div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-chart-pie"></i> สัดส่วนค่าตอบแทน</div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container"><canvas id="compPieChart"></canvas></div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-chart-bar"></i> รายได้สุทธิรายเดือน</div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container"><canvas id="compBarChart"></canvas></div>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-top:24px">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-list"></i> รายละเอียดค่าตอบแทนรายปี</div>
                    </div>
                    <div class="card-body" style="padding:0">
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead><tr><th>รายการ</th><th style="text-align:right">จำนวนต่อปี</th><th style="text-align:right">เฉลี่ยต่อเดือน</th><th style="text-align:right">สัดส่วน</th></tr></thead>
                                <tbody>
                                    ${comp.breakdown.map(b => `
                                        <tr>
                                            <td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${b.color};margin-right:8px"></span>${b.label}</td>
                                            <td style="text-align:right;font-weight:500">${formatCurrency(b.yearly)}</td>
                                            <td style="text-align:right">${formatCurrency(b.yearly / 12)}</td>
                                            <td style="text-align:right">${((b.yearly / comp.yearlyIncome) * 100).toFixed(1)}%</td>
                                        </tr>
                                    `).join('')}
                                    <tr style="font-weight:700;background:var(--gray-50)">
                                        <td>รวมทั้งหมด</td>
                                        <td style="text-align:right;color:var(--primary)">${formatCurrency(comp.yearlyIncome)}</td>
                                        <td style="text-align:right">${formatCurrency(comp.yearlyIncome / 12)}</td>
                                        <td style="text-align:right">100%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== CERTIFICATE =====
        certificate() {
            const emp = MOCK.employee;
            const payslip = MOCK.payslips[0];
            return `
                <div class="no-print" style="margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap">
                    <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> พิมพ์ใบรับรอง</button>
                    <button class="btn btn-accent" onclick="app.downloadCertificate()"><i class="fas fa-download"></i> ดาวน์โหลด PDF</button>
                    <button class="btn btn-secondary"><i class="fas fa-envelope"></i> ส่ง Email</button>
                </div>
                <div class="certificate-preview" id="certificate-content">
                    <div class="cert-header">
                        <div style="font-size:2.5rem;color:var(--primary);margin-bottom:8px"><i class="fas fa-hospital"></i></div>
                        <h2>โรงพยาบาลสันกำแพง</h2>
                        <h3>อำเภอสันกำแพง จังหวัดเชียงใหม่</h3>
                        <div class="cert-title">หนังสือรับรองเงินเดือน</div>
                    </div>
                    <div class="cert-body">
                        หนังสือฉบับนี้ขอรับรองว่า <strong>${emp.prefix}${emp.fullName}</strong>
                        เลขประจำตัวประชาชน <strong>${emp.idCard}</strong>
                        ตำแหน่ง <strong>${emp.position}</strong>
                        สังกัด <strong>${emp.department} โรงพยาบาลสันกำแพง</strong>
                        ประเภท <strong>${emp.employeeType}</strong>
                    </div>
                    <div class="cert-body">
                        ได้รับเงินเดือนและค่าตอบแทนรวมเดือนละ <strong>${formatCurrency(payslip.totalIncome)} บาท</strong>
                        (${app.numberToThaiText(payslip.totalIncome)})
                        หักรายการต่างๆ จำนวน <strong>${formatCurrency(payslip.totalDeduction)} บาท</strong>
                        คงเหลือรับสุทธิเดือนละ <strong>${formatCurrency(payslip.netPay)} บาท</strong>
                        (${app.numberToThaiText(payslip.netPay)})
                    </div>
                    <div class="cert-body">
                        จึงออกหนังสือรับรองฉบับนี้ให้ไว้เพื่อเป็นหลักฐาน
                    </div>
                    <div style="text-align:right;margin:20px 0;color:var(--gray-600)">
                        ออกให้ ณ วันที่ 4 มีนาคม พ.ศ. 2569
                    </div>
                    <div class="cert-footer">
                        <div class="cert-sign">
                            <div class="sign-line"></div>
                            <div class="sign-name">(นายแพทย์สมศักดิ์ เจริญดี)</div>
                            <div class="sign-title">ผู้อำนวยการโรงพยาบาลสันกำแพง</div>
                        </div>
                        <div class="cert-sign">
                            <div class="sign-line"></div>
                            <div class="sign-name">(นางสาวพัชรินทร์ สุขใจ)</div>
                            <div class="sign-title">หัวหน้ากลุ่มงานบริหารทั่วไป</div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== TAX =====
        tax() {
            const t = MOCK.tax;
            return `
                <div class="stats-grid">
                    <div class="stat-card red">
                        <div class="stat-icon"><i class="fas fa-receipt"></i></div>
                        <div class="stat-info">
                            <h3>ภาษีหัก ณ ที่จ่าย/เดือน</h3>
                            <div class="stat-value">${formatCurrency(t.monthlyTax)}</div>
                            <div class="stat-change"><i class="fas fa-calendar"></i> รวมทั้งปี ${formatCurrency(t.yearlyTax)}</div>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fas fa-piggy-bank"></i></div>
                        <div class="stat-info">
                            <h3>กบข. สะสม/เดือน</h3>
                            <div class="stat-value">${formatCurrency(t.gpfMonthly)}</div>
                            <div class="stat-change"><i class="fas fa-percentage"></i> อัตรา ${t.gpfRate}%</div>
                        </div>
                    </div>
                    <div class="stat-card teal">
                        <div class="stat-icon"><i class="fas fa-shield-halved"></i></div>
                        <div class="stat-info">
                            <h3>ประกันสังคม/เดือน</h3>
                            <div class="stat-value">${formatCurrency(t.socialSecMonthly)}</div>
                            <div class="stat-change"><i class="fas fa-calendar"></i> รวมทั้งปี ${formatCurrency(t.socialSecYearly)}</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon"><i class="fas fa-building-columns"></i></div>
                        <div class="stat-info">
                            <h3>กบข. สะสมรวม</h3>
                            <div class="stat-value">${formatCurrency(t.gpfTotal)}</div>
                            <div class="stat-change up"><i class="fas fa-arrow-up"></i> +${formatCurrency(t.gpfYearly)} ปีนี้</div>
                        </div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-receipt"></i> ข้อมูลภาษี</div>
                        </div>
                        <div class="card-body">
                            <div class="info-grid" style="grid-template-columns:1fr">
                                <div class="info-item">
                                    <i class="fas fa-money-bill"></i>
                                    <div>
                                        <div class="info-label">เงินได้พึงประเมิน</div>
                                        <div class="info-value">${formatCurrency(t.taxableIncome)} บาท/ปี</div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-layer-group"></i>
                                    <div>
                                        <div class="info-label">ฐานภาษี</div>
                                        <div class="info-value">${t.taxBracket}</div>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-calculator"></i>
                                    <div>
                                        <div class="info-label">ภาษีที่ต้องชำระทั้งปี</div>
                                        <div class="info-value" style="color:var(--danger)">${formatCurrency(t.yearlyTax)} บาท</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-file-invoice"></i> ค่าลดหย่อน</div>
                        </div>
                        <div class="card-body" style="padding:0">
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead><tr><th>รายการ</th><th style="text-align:right">จำนวน (บาท)</th></tr></thead>
                                    <tbody>
                                        ${t.deductions.map(d => `
                                            <tr>
                                                <td>${d.label}</td>
                                                <td style="text-align:right;font-weight:500">${formatCurrency(d.amount)}</td>
                                            </tr>
                                        `).join('')}
                                        <tr style="font-weight:700;background:var(--gray-50)">
                                            <td>รวมค่าลดหย่อน</td>
                                            <td style="text-align:right;color:var(--success)">${formatCurrency(t.deductions.reduce((s,d) => s+d.amount, 0))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card" style="margin-top:24px">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-piggy-bank"></i> ข้อมูล กบข.</div>
                    </div>
                    <div class="card-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-percentage"></i>
                                <div>
                                    <div class="info-label">อัตราสะสม</div>
                                    <div class="info-value">${t.gpfRate}% ของเงินเดือน</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-coins"></i>
                                <div>
                                    <div class="info-label">เงินสะสมต่อเดือน</div>
                                    <div class="info-value">${formatCurrency(t.gpfMonthly)} บาท</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-calendar-alt"></i>
                                <div>
                                    <div class="info-label">เงินสะสมทั้งปี</div>
                                    <div class="info-value">${formatCurrency(t.gpfYearly)} บาท</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-vault"></i>
                                <div>
                                    <div class="info-label">ยอดเงินสะสมรวม</div>
                                    <div class="info-value" style="color:var(--success);font-size:1.1rem">${formatCurrency(t.gpfTotal)} บาท</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== LEAVE =====
        leave() {
            const lv = MOCK.leave;
            return `
                <div class="leave-balance-grid">
                    ${lv.balances.map(b => {
                        const remaining = b.total - b.used;
                        const pct = b.total > 0 ? (b.used / b.total) * 100 : 0;
                        return `
                        <div class="leave-type-card">
                            <div class="leave-icon" style="background:${b.color}15;color:${b.color}">
                                <i class="fas ${b.icon}"></i>
                            </div>
                            <div class="leave-name">${b.type}</div>
                            <div class="leave-count">${remaining}</div>
                            <div class="leave-total">จาก ${b.total} วัน (ใช้ไป ${b.used})</div>
                            <div class="leave-progress">
                                <div class="progress-fill" style="width:${pct}%;background:${b.color}"></div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>

                <div class="card" style="margin-bottom:24px">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-plus-circle"></i> ขอลาใหม่</div>
                    </div>
                    <div class="card-body">
                        <form style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;align-items:end">
                            <div class="form-group" style="margin:0">
                                <label>ประเภทการลา</label>
                                <select>
                                    <option>ลาพักผ่อน</option>
                                    <option>ลาป่วย</option>
                                    <option>ลากิจ</option>
                                    <option>ลาอื่นๆ</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin:0">
                                <label>วันที่เริ่มลา</label>
                                <input type="date">
                            </div>
                            <div class="form-group" style="margin:0">
                                <label>วันที่สิ้นสุด</label>
                                <input type="date">
                            </div>
                            <div class="form-group" style="margin:0">
                                <label>เหตุผล</label>
                                <input type="text" placeholder="ระบุเหตุผล">
                            </div>
                            <button type="button" class="btn btn-primary" onclick="alert('ส่งคำขอลาเรียบร้อย (Demo)')"><i class="fas fa-paper-plane"></i> ส่งคำขอ</button>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-history"></i> ประวัติการลา</div>
                    </div>
                    <div class="card-body" style="padding:0">
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr><th>ประเภท</th><th>วันที่เริ่ม</th><th>วันที่สิ้นสุด</th><th>จำนวน</th><th>สถานะ</th></tr>
                                </thead>
                                <tbody>
                                    ${lv.recent.map(r => `
                                        <tr>
                                            <td>${r.type}</td>
                                            <td>${r.startDate}</td>
                                            <td>${r.endDate}</td>
                                            <td>${r.days} วัน</td>
                                            <td><span class="badge ${r.statusClass}">${r.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== ATTENDANCE =====
        attendance() {
            const att = MOCK.attendance;
            return `
                <div class="attendance-status${att.today.checkOut ? ' checked-out' : ''}">
                    <div class="status-icon">
                        <i class="fas fa-${att.today.checkOut ? 'check-circle' : 'clock'}"></i>
                    </div>
                    <div class="status-text">
                        <h3>${att.today.status}</h3>
                        <p>${att.today.shiftType} | เข้างาน: ${att.today.checkIn} ${att.today.checkOut ? '| ออกงาน: ' + att.today.checkOut : '| ยังไม่ลงเวลาออก'}</p>
                    </div>
                    ${!att.today.checkOut ? '<button class="btn btn-primary" style="margin-left:auto" onclick="alert(\'ลงเวลาออกเรียบร้อย (Demo)\')"><i class="fas fa-sign-out-alt"></i> ลงเวลาออก</button>' : ''}
                </div>

                <div class="stats-grid">
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fas fa-calendar-days"></i></div>
                        <div class="stat-info">
                            <h3>วันทำงาน</h3>
                            <div class="stat-value">${att.monthlySummary.workDays} วัน</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info">
                            <h3>มาทำงาน</h3>
                            <div class="stat-value">${att.monthlySummary.present} วัน</div>
                        </div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-icon"><i class="fas fa-calendar-minus"></i></div>
                        <div class="stat-info">
                            <h3>ลา</h3>
                            <div class="stat-value">${att.monthlySummary.leave} วัน</div>
                        </div>
                    </div>
                    <div class="stat-card teal">
                        <div class="stat-icon"><i class="fas fa-business-time"></i></div>
                        <div class="stat-info">
                            <h3>OT</h3>
                            <div class="stat-value">${att.monthlySummary.ot} ครั้ง</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-table"></i> รายละเอียดเวลาทำงาน</div>
                    </div>
                    <div class="card-body" style="padding:0">
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr><th>วันที่</th><th>เข้างาน</th><th>ออกงาน</th><th>ชั่วโมง</th><th>สถานะ</th></tr>
                                </thead>
                                <tbody>
                                    ${att.weekly.map(r => `
                                        <tr>
                                            <td>${r.date}</td>
                                            <td>${r.checkIn}</td>
                                            <td>${r.checkOut}</td>
                                            <td>${r.hours}</td>
                                            <td><span class="badge ${r.statusClass}">${r.status}</span></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== OT =====
        ot() {
            const ot = MOCK.ot;
            return `
                <div class="stats-grid">
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                        <div class="stat-info">
                            <h3>ค่า OT เดือนนี้</h3>
                            <div class="stat-value">${formatCurrency(ot.monthlyOT)}</div>
                        </div>
                    </div>
                    <div class="stat-card teal">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-info">
                            <h3>ชั่วโมง OT รวม</h3>
                            <div class="stat-value">${ot.totalHours} ชม.</div>
                        </div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-icon"><i class="fas fa-calculator"></i></div>
                        <div class="stat-info">
                            <h3>อัตราค่า OT</h3>
                            <div class="stat-value">${formatCurrency(ot.rate)}/ชม.</div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-list"></i> รายการ OT</div>
                    </div>
                    <div class="card-body" style="padding:0">
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr><th>วันที่</th><th>ประเภทเวร</th><th>ชั่วโมง</th><th>อัตรา</th><th style="text-align:right">จำนวนเงิน</th><th>สถานะ</th></tr>
                                </thead>
                                <tbody>
                                    ${ot.records.map(r => `
                                        <tr>
                                            <td>${r.date}</td>
                                            <td>${r.type}</td>
                                            <td>${r.hours} ชม.</td>
                                            <td>${formatCurrency(r.rate)}</td>
                                            <td style="text-align:right;font-weight:600;color:var(--success)">${formatCurrency(r.amount)}</td>
                                            <td><span class="badge ${r.statusClass}">${r.status}</span></td>
                                        </tr>
                                    `).join('')}
                                    <tr style="font-weight:700;background:var(--gray-50)">
                                        <td colspan="2">รวม</td>
                                        <td>${ot.totalHours} ชม.</td>
                                        <td></td>
                                        <td style="text-align:right;color:var(--primary)">${formatCurrency(ot.monthlyOT)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== PROFILE =====
        profile() {
            const emp = MOCK.employee;
            return `
                <div class="profile-header-card">
                    <img src="${emp.avatar}" alt="avatar" class="profile-avatar-lg">
                    <div class="profile-info">
                        <h2>${emp.prefix}${emp.fullName}</h2>
                        <p>${emp.position}</p>
                        <p>${emp.department} - ${emp.section}</p>
                        <div class="profile-id"><i class="fas fa-id-badge"></i> รหัส: ${emp.id}</div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-header"><div class="card-title"><i class="fas fa-user"></i> ข้อมูลส่วนตัว</div></div>
                        <div class="card-body">
                            <div class="info-grid" style="grid-template-columns:1fr">
                                ${[
                                    ['fa-id-card', 'เลขประจำตัวประชาชน', emp.idCard],
                                    ['fa-birthday-cake', 'วันเกิด', emp.birthDate],
                                    ['fa-graduation-cap', 'วุฒิการศึกษา', emp.education],
                                    ['fa-certificate', 'ใบอนุญาตประกอบวิชาชีพ', emp.license],
                                    ['fa-map-marker-alt', 'ที่อยู่', emp.address],
                                    ['fa-phone-alt', 'โทรศัพท์มือถือ', emp.phone],
                                    ['fa-envelope', 'อีเมล', emp.email],
                                ].map(([icon, label, value]) => `
                                    <div class="info-item">
                                        <i class="fas ${icon}"></i>
                                        <div>
                                            <div class="info-label">${label}</div>
                                            <div class="info-value">${value}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header"><div class="card-title"><i class="fas fa-briefcase"></i> ข้อมูลการทำงาน</div></div>
                        <div class="card-body">
                            <div class="info-grid" style="grid-template-columns:1fr">
                                ${[
                                    ['fa-building', 'สังกัด', emp.department],
                                    ['fa-sitemap', 'หน่วยงาน', emp.section],
                                    ['fa-user-tie', 'ตำแหน่ง', emp.position],
                                    ['fa-layer-group', 'ระดับ', emp.level],
                                    ['fa-tag', 'ประเภท', emp.employeeType],
                                    ['fa-calendar-alt', 'วันเริ่มงาน', emp.startDate],
                                    ['fa-clock', 'อายุราชการ', emp.yearsOfService + ' ปี'],
                                    ['fa-university', 'บัญชีเงินเดือน', emp.bankAccount],
                                    ['fa-phone-volume', 'ผู้ติดต่อฉุกเฉิน', emp.emergencyContact],
                                ].map(([icon, label, value]) => `
                                    <div class="info-item">
                                        <i class="fas ${icon}"></i>
                                        <div>
                                            <div class="info-label">${label}</div>
                                            <div class="info-value">${value}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== BENEFITS =====
        benefits() {
            return `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-hand-holding-heart"></i> สิทธิสวัสดิการของท่าน</div>
                    </div>
                    <div class="card-body">
                        ${MOCK.benefits.map(b => `
                            <div class="benefit-card">
                                <div class="benefit-icon" style="background:${b.colorBg};color:${b.color}">
                                    <i class="fas ${b.icon}"></i>
                                </div>
                                <div class="benefit-info">
                                    <h4>${b.title}</h4>
                                    <p>${b.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // ===== TRAINING =====
        training() {
            const tr = MOCK.training;
            const pct = (tr.totalHours / tr.requiredHours) * 100;
            return `
                <div class="stats-grid">
                    <div class="stat-card blue">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-info">
                            <h3>ชั่วโมงอบรมสะสม</h3>
                            <div class="stat-value">${tr.totalHours}/${tr.requiredHours} ชม.</div>
                            <div style="margin-top:8px">
                                <div class="leave-progress" style="height:8px">
                                    <div class="progress-fill" style="width:${pct}%;background:var(--primary)"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info">
                            <h3>หลักสูตรที่ผ่าน</h3>
                            <div class="stat-value">${tr.completed.length} หลักสูตร</div>
                        </div>
                    </div>
                    <div class="stat-card orange">
                        <div class="stat-icon"><i class="fas fa-calendar-alt"></i></div>
                        <div class="stat-info">
                            <h3>กำลังจะมาถึง</h3>
                            <div class="stat-value">${tr.upcoming.length} หลักสูตร</div>
                        </div>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-calendar-check"></i> การอบรมที่กำลังจะมาถึง</div>
                        </div>
                        <div class="card-body" style="padding:0">
                            ${tr.upcoming.map(t => `
                                <div class="training-card">
                                    <div class="training-date-box">
                                        <div class="day">${t.date.split(' ')[0]}</div>
                                        <div class="month">${t.date.split(' ')[1]}</div>
                                    </div>
                                    <div class="training-info">
                                        <h4>${t.title}</h4>
                                        <p>${t.status}</p>
                                        <div class="training-meta">
                                            <span><i class="fas fa-map-marker-alt"></i> ${t.location}</span>
                                            <span><i class="fas fa-clock"></i> ${t.hours} ชม.</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title"><i class="fas fa-history"></i> ประวัติการอบรม</div>
                        </div>
                        <div class="card-body" style="padding:0">
                            <div class="table-responsive">
                                <table class="data-table">
                                    <thead><tr><th>หลักสูตร</th><th>วันที่</th><th>ชม.</th><th>ผล</th></tr></thead>
                                    <tbody>
                                        ${tr.completed.map(t => `
                                            <tr>
                                                <td>${t.title}</td>
                                                <td style="white-space:nowrap">${t.date}</td>
                                                <td>${t.hours}</td>
                                                <td><span class="badge badge-success">${t.score}</span> ${t.certificate ? '<i class="fas fa-award" style="color:var(--warning);margin-left:4px" title="มีใบประกาศ"></i>' : ''}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // ===== DOCUMENTS =====
        documents() {
            return `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-folder-open"></i> เอกสารของฉัน</div>
                        <button class="btn btn-sm btn-primary"><i class="fas fa-upload"></i> อัพโหลดเอกสาร</button>
                    </div>
                    <div class="card-body" style="padding:0">
                        ${MOCK.documents.map(d => `
                            <div class="doc-item">
                                <div class="doc-icon" style="background:${d.colorBg};color:${d.color}">
                                    <i class="fas ${d.icon}"></i>
                                </div>
                                <div class="doc-info">
                                    <h4>${d.title}</h4>
                                    <p>${d.type} - ${d.size} ${d.date !== '-' ? '| ' + d.date : ''}</p>
                                </div>
                                <div class="doc-action">
                                    <button class="btn btn-sm btn-secondary"><i class="fas fa-download"></i> ดาวน์โหลด</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // ===== ANNOUNCEMENTS =====
        announcements() {
            return `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-bullhorn"></i> ประกาศทั้งหมด</div>
                    </div>
                    <div class="card-body" style="padding:0">
                        ${MOCK.announcements.map(a => `
                            <div class="announcement-item">
                                <div class="announcement-icon" style="background:${a.colorBg};color:${a.color}">
                                    <i class="fas ${a.icon}"></i>
                                </div>
                                <div class="announcement-content">
                                    <h4>${a.isNew ? '<span class="badge badge-danger" style="font-size:0.65rem;margin-right:6px">ใหม่</span>' : ''}${a.title}</h4>
                                    <p>${a.content}</p>
                                    <div class="announcement-date"><i class="fas fa-clock"></i> ${a.date}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        // ===== SETTINGS =====
        settings() {
            return `
                <div class="card">
                    <div class="card-body">
                        <div class="settings-section">
                            <h3><i class="fas fa-bell" style="margin-right:8px;color:var(--primary)"></i> การแจ้งเตือน</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>แจ้งเตือนสลิปเงินเดือน</h4>
                                    <p>รับการแจ้งเตือนเมื่อมีสลิปเงินเดือนใหม่</p>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>แจ้งเตือนการอนุมัติลา</h4>
                                    <p>รับการแจ้งเตือนเมื่อคำขอลาได้รับการอนุมัติ</p>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>แจ้งเตือนประกาศใหม่</h4>
                                    <p>รับการแจ้งเตือนเมื่อมีประกาศใหม่จากโรงพยาบาล</p>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>แจ้งเตือนผ่าน LINE</h4>
                                    <p>ส่งการแจ้งเตือนผ่าน LINE Official Account</p>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3><i class="fas fa-lock" style="margin-right:8px;color:var(--primary)"></i> ความปลอดภัย</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>เปลี่ยนรหัสผ่าน</h4>
                                    <p>เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบ</p>
                                </div>
                                <button class="btn btn-sm btn-secondary">เปลี่ยน</button>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>ยืนยันตัวตน 2 ขั้นตอน</h4>
                                    <p>เพิ่มความปลอดภัยด้วยการยืนยันตัวตน 2 ขั้นตอน</p>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3><i class="fas fa-palette" style="margin-right:8px;color:var(--primary)"></i> การแสดงผล</h3>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <h4>ภาษา</h4>
                                    <p>เลือกภาษาที่ใช้แสดงผล</p>
                                </div>
                                <select style="padding:6px 12px;border:1px solid var(--gray-200);border-radius:var(--radius);font-family:'Prompt',sans-serif;font-size:0.85rem">
                                    <option>ไทย</option>
                                    <option>English</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    // ===== Payslip Helpers =====
    renderPayslipContent(slip) {
        const incomeItems = slip.income.filter(i => i.amount > 0);
        const deductItems = slip.deduction.filter(d => d.amount > 0);

        return `
            <div class="payslip-detail">
                <div class="payslip-section">
                    <div class="payslip-section-title"><i class="fas fa-plus-circle"></i> รายรับ</div>
                    ${incomeItems.map(i => `
                        <div class="payslip-item">
                            <span class="label">${i.label}</span>
                            <span class="amount">${formatCurrency(i.amount)}</span>
                        </div>
                    `).join('')}
                    <div class="payslip-item subtotal">
                        <span class="label">รวมรายรับ</span>
                        <span class="amount income">${formatCurrency(slip.totalIncome)}</span>
                    </div>
                </div>
                <div class="payslip-section">
                    <div class="payslip-section-title deduction"><i class="fas fa-minus-circle"></i> รายหัก</div>
                    ${deductItems.map(d => `
                        <div class="payslip-item">
                            <span class="label">${d.label}</span>
                            <span class="amount">${formatCurrency(d.amount)}</span>
                        </div>
                    `).join('')}
                    <div class="payslip-item subtotal">
                        <span class="label">รวมรายหัก</span>
                        <span class="amount expense">${formatCurrency(slip.totalDeduction)}</span>
                    </div>
                </div>
            </div>
            <div class="payslip-total">
                <span class="label"><i class="fas fa-wallet" style="margin-right:8px"></i> เงินเดือนสุทธิ</span>
                <span class="amount">${formatCurrency(slip.netPay)} บาท</span>
            </div>
        `;
    },

    changePayslip(index) {
        const slip = MOCK.payslips[index];
        document.getElementById('payslip-content').innerHTML = this.renderPayslipContent(slip);
    },

    initPayslipEvents() {
        // Payslip month selector is handled via onchange
    },

    printPayslip() {
        window.print();
    },

    downloadPayslip() {
        alert('ดาวน์โหลดสลิปเงินเดือน (Demo) - ในระบบจริงจะสร้างไฟล์ PDF');
    },

    downloadCertificate() {
        alert('ดาวน์โหลดใบรับรองเงินเดือน (Demo) - ในระบบจริงจะสร้างไฟล์ PDF');
    },

    numberToThaiText(num) {
        // Simplified Thai number to text
        const intPart = Math.floor(num);
        const decPart = Math.round((num - intPart) * 100);
        let result = `${intPart.toLocaleString('th-TH')} บาท`;
        if (decPart > 0) result += ` ${decPart} สตางค์`;
        return result;
    },

    // ===== Charts =====
    initDashboardCharts() {
        const ctx = document.getElementById('incomeChart');
        if (!ctx) return;

        const data = MOCK.compensation.monthlyHistory;
        this.charts.income = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.month),
                datasets: [{
                    label: 'รายได้สุทธิ',
                    data: data.map(d => d.net),
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1e40af',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${formatCurrency(ctx.parsed.y)} บาท`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (v) => formatCurrency(v),
                            font: { family: 'Prompt', size: 11 }
                        },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    },
                    x: {
                        ticks: { font: { family: 'Prompt', size: 11 } },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    initCompensationCharts() {
        const pieCtx = document.getElementById('compPieChart');
        const barCtx = document.getElementById('compBarChart');
        const comp = MOCK.compensation;

        if (pieCtx) {
            this.charts.pie = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: comp.breakdown.map(b => b.label),
                    datasets: [{
                        data: comp.breakdown.map(b => b.yearly),
                        backgroundColor: comp.breakdown.map(b => b.color),
                        borderWidth: 2,
                        borderColor: '#fff',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { font: { family: 'Prompt', size: 12 }, padding: 16 }
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)} บาท`
                            }
                        }
                    }
                }
            });
        }

        if (barCtx) {
            const data = comp.monthlyHistory;
            this.charts.bar = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: data.map(d => d.month),
                    datasets: [{
                        label: 'รายได้สุทธิ',
                        data: data.map(d => d.net),
                        backgroundColor: 'rgba(30, 64, 175, 0.7)',
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => `${formatCurrency(ctx.parsed.y)} บาท`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (v) => (v/1000) + 'k',
                                font: { family: 'Prompt', size: 11 }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            ticks: { font: { family: 'Prompt', size: 11 } },
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());
