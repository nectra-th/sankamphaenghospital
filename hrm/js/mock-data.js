// ===== Mock Data for HRM System =====
const MOCK = {
    // ===== Employee Info =====
    employee: {
        id: 'EMP001',
        prefix: 'นาย',
        firstName: 'สมชาย',
        lastName: 'รักดี',
        fullName: 'สมชาย รักดี',
        position: 'พยาบาลวิชาชีพชำนาญการ',
        department: 'กลุ่มงานการพยาบาล',
        section: 'หอผู้ป่วยใน (IPD)',
        employeeType: 'ข้าราชการ',
        level: 'ระดับชำนาญการ',
        startDate: '2558-05-01',
        yearsOfService: 11,
        email: 'somchai.r@skph.go.th',
        phone: '081-234-5678',
        lineId: 'somchai.r',
        address: '99/1 ม.5 ต.สันกำแพง อ.สันกำแพง จ.เชียงใหม่ 50130',
        birthDate: '2533-03-15',
        idCard: '1-5099-00xxx-xx-x',
        bankAccount: 'ธ.กรุงไทย xxx-x-xxxxx-x',
        education: 'พยาบาลศาสตรบัณฑิต ม.เชียงใหม่',
        license: 'ใบอนุญาตประกอบวิชาชีพ เลขที่ พย.xxxxx',
        emergencyContact: 'นางสมหญิง รักดี (คู่สมรส) โทร 089-xxx-xxxx',
        avatar: 'https://ui-avatars.com/api/?name=สมชาย+รักดี&background=4f46e5&color=fff&size=200&font-size=0.35'
    },

    // ===== Payslip Data =====
    payslips: [
        {
            month: 'กุมภาพันธ์', year: 2569, monthNum: 2,
            income: [
                { label: 'เงินเดือน', amount: 32250 },
                { label: 'เงินประจำตำแหน่ง', amount: 3500 },
                { label: 'ค่าตอบแทนพิเศษ พ.ต.ส.', amount: 5000 },
                { label: 'เงินค่าเสี่ยงภัย', amount: 2500 },
                { label: 'ค่าล่วงเวลา (OT)', amount: 4800 },
                { label: 'เงินเพิ่มค่าครองชีพ', amount: 0 },
            ],
            deduction: [
                { label: 'ภาษีหัก ณ ที่จ่าย', amount: 1250 },
                { label: 'กบข. (3%)', amount: 967.50 },
                { label: 'ประกันสังคม', amount: 750 },
                { label: 'สหกรณ์ออมทรัพย์', amount: 5000 },
                { label: 'ค่าเบี้ยประกันชีวิต', amount: 1500 },
                { label: 'กยศ.', amount: 0 },
            ],
            totalIncome: 48050,
            totalDeduction: 9467.50,
            netPay: 38582.50
        },
        {
            month: 'มกราคม', year: 2569, monthNum: 1,
            income: [
                { label: 'เงินเดือน', amount: 32250 },
                { label: 'เงินประจำตำแหน่ง', amount: 3500 },
                { label: 'ค่าตอบแทนพิเศษ พ.ต.ส.', amount: 5000 },
                { label: 'เงินค่าเสี่ยงภัย', amount: 2500 },
                { label: 'ค่าล่วงเวลา (OT)', amount: 3200 },
                { label: 'เงินเพิ่มค่าครองชีพ', amount: 0 },
            ],
            deduction: [
                { label: 'ภาษีหัก ณ ที่จ่าย', amount: 1150 },
                { label: 'กบข. (3%)', amount: 967.50 },
                { label: 'ประกันสังคม', amount: 750 },
                { label: 'สหกรณ์ออมทรัพย์', amount: 5000 },
                { label: 'ค่าเบี้ยประกันชีวิต', amount: 1500 },
                { label: 'กยศ.', amount: 0 },
            ],
            totalIncome: 46450,
            totalDeduction: 9367.50,
            netPay: 37082.50
        },
        {
            month: 'ธันวาคม', year: 2568, monthNum: 12,
            income: [
                { label: 'เงินเดือน', amount: 32250 },
                { label: 'เงินประจำตำแหน่ง', amount: 3500 },
                { label: 'ค่าตอบแทนพิเศษ พ.ต.ส.', amount: 5000 },
                { label: 'เงินค่าเสี่ยงภัย', amount: 2500 },
                { label: 'ค่าล่วงเวลา (OT)', amount: 6400 },
                { label: 'เงินเพิ่มค่าครองชีพ', amount: 0 },
            ],
            deduction: [
                { label: 'ภาษีหัก ณ ที่จ่าย', amount: 1350 },
                { label: 'กบข. (3%)', amount: 967.50 },
                { label: 'ประกันสังคม', amount: 750 },
                { label: 'สหกรณ์ออมทรัพย์', amount: 5000 },
                { label: 'ค่าเบี้ยประกันชีวิต', amount: 1500 },
                { label: 'กยศ.', amount: 0 },
            ],
            totalIncome: 49650,
            totalDeduction: 9567.50,
            netPay: 40082.50
        }
    ],

    // ===== Compensation Summary (yearly) =====
    compensation: {
        yearlyIncome: 576600,
        yearlyDeduction: 113610,
        yearlyNet: 462990,
        monthlyAvgNet: 38582.50,
        breakdown: [
            { label: 'เงินเดือน', yearly: 387000, color: '#1e40af' },
            { label: 'เงินประจำตำแหน่ง', yearly: 42000, color: '#3b82f6' },
            { label: 'ค่าตอบแทน พ.ต.ส.', yearly: 60000, color: '#0d9488' },
            { label: 'ค่าเสี่ยงภัย', yearly: 30000, color: '#14b8a6' },
            { label: 'ค่าล่วงเวลา', yearly: 57600, color: '#f59e0b' },
        ],
        monthlyHistory: [
            { month: 'มี.ค.', net: 37500 },
            { month: 'เม.ย.', net: 38200 },
            { month: 'พ.ค.', net: 36800 },
            { month: 'มิ.ย.', net: 39100 },
            { month: 'ก.ค.', net: 38500 },
            { month: 'ส.ค.', net: 37200 },
            { month: 'ก.ย.', net: 38800 },
            { month: 'ต.ค.', net: 39500 },
            { month: 'พ.ย.', net: 38100 },
            { month: 'ธ.ค.', net: 40082.50 },
            { month: 'ม.ค.', net: 37082.50 },
            { month: 'ก.พ.', net: 38582.50 },
        ]
    },

    // ===== Tax / GPF / Social Security =====
    tax: {
        yearlyTax: 15000,
        monthlyTax: 1250,
        gpfRate: 3,
        gpfMonthly: 967.50,
        gpfYearly: 11610,
        gpfTotal: 185000,
        socialSecMonthly: 750,
        socialSecYearly: 9000,
        taxBracket: '5% (150,001 - 300,000)',
        taxableIncome: 462990,
        deductions: [
            { label: 'ค่าลดหย่อนส่วนตัว', amount: 60000 },
            { label: 'ค่าลดหย่อนคู่สมรส', amount: 60000 },
            { label: 'เบี้ยประกันชีวิต', amount: 18000 },
            { label: 'กบข.', amount: 11610 },
            { label: 'เงินสมทบประกันสังคม', amount: 9000 },
        ]
    },

    // ===== Leave Data =====
    leave: {
        balances: [
            { type: 'ลาป่วย', used: 3, total: 60, icon: 'fa-thermometer-half', color: '#dc2626' },
            { type: 'ลากิจ', used: 2, total: 45, icon: 'fa-briefcase', color: '#f59e0b' },
            { type: 'ลาพักผ่อน', used: 5, total: 10, icon: 'fa-umbrella-beach', color: '#0d9488' },
            { type: 'ลาอุปสมบท/ฮัจญ์', used: 0, total: 120, icon: 'fa-pray', color: '#8b5cf6' },
            { type: 'ลาคลอด', used: 0, total: 90, icon: 'fa-baby', color: '#ec4899' },
            { type: 'ลาอื่นๆ', used: 1, total: 30, icon: 'fa-calendar-check', color: '#6b7280' },
        ],
        recent: [
            { type: 'ลาพักผ่อน', startDate: '24 ก.พ. 69', endDate: '25 ก.พ. 69', days: 2, status: 'อนุมัติ', statusClass: 'badge-success' },
            { type: 'ลาป่วย', startDate: '15 ก.พ. 69', endDate: '15 ก.พ. 69', days: 1, status: 'อนุมัติ', statusClass: 'badge-success' },
            { type: 'ลากิจ', startDate: '5 ก.พ. 69', endDate: '5 ก.พ. 69', days: 1, status: 'อนุมัติ', statusClass: 'badge-success' },
            { type: 'ลาพักผ่อน', startDate: '10 มี.ค. 69', endDate: '12 มี.ค. 69', days: 3, status: 'รออนุมัติ', statusClass: 'badge-warning' },
            { type: 'ลาป่วย', startDate: '18 ม.ค. 69', endDate: '19 ม.ค. 69', days: 2, status: 'อนุมัติ', statusClass: 'badge-success' },
            { type: 'ลากิจ', startDate: '3 ม.ค. 69', endDate: '3 ม.ค. 69', days: 1, status: 'อนุมัติ', statusClass: 'badge-success' },
        ]
    },

    // ===== Attendance =====
    attendance: {
        today: {
            checkIn: '07:45',
            checkOut: null,
            status: 'ปฏิบัติงาน',
            shiftType: 'เวรเช้า (08:00 - 16:00)',
        },
        weekly: [
            { date: 'จ. 3 มี.ค.', checkIn: '07:45', checkOut: '-', hours: '-', status: 'ปฏิบัติงาน', statusClass: 'badge-success' },
            { date: 'อา. 2 มี.ค.', checkIn: '-', checkOut: '-', hours: '-', status: 'หยุด', statusClass: 'badge-info' },
            { date: 'ส. 1 มี.ค.', checkIn: '-', checkOut: '-', hours: '-', status: 'หยุด', statusClass: 'badge-info' },
            { date: 'ศ. 28 ก.พ.', checkIn: '07:52', checkOut: '16:15', hours: '8:23', status: 'ปกติ', statusClass: 'badge-success' },
            { date: 'พฤ. 27 ก.พ.', checkIn: '07:48', checkOut: '20:05', hours: '12:17', status: 'OT', statusClass: 'badge-primary' },
            { date: 'พ. 26 ก.พ.', checkIn: '07:55', checkOut: '16:30', hours: '8:35', status: 'ปกติ', statusClass: 'badge-success' },
            { date: 'อ. 25 ก.พ.', checkIn: '-', checkOut: '-', hours: '-', status: 'ลาพักผ่อน', statusClass: 'badge-warning' },
        ],
        monthlySummary: {
            workDays: 20,
            present: 17,
            late: 0,
            absent: 0,
            leave: 3,
            ot: 4,
        }
    },

    // ===== OT Data =====
    ot: {
        monthlyOT: 4800,
        totalHours: 24,
        rate: 200,
        records: [
            { date: '27 ก.พ. 69', hours: 4, rate: 200, amount: 800, type: 'เวรบ่าย', status: 'อนุมัติ', statusClass: 'badge-success' },
            { date: '20 ก.พ. 69', hours: 8, rate: 200, amount: 1600, type: 'เวรดึก', status: 'อนุมัติ', statusClass: 'badge-success' },
            { date: '14 ก.พ. 69', hours: 4, rate: 200, amount: 800, type: 'เวรบ่าย', status: 'อนุมัติ', statusClass: 'badge-success' },
            { date: '7 ก.พ. 69', hours: 8, rate: 200, amount: 1600, type: 'เวรดึก', status: 'อนุมัติ', statusClass: 'badge-success' },
        ]
    },

    // ===== Training =====
    training: {
        upcoming: [
            { title: 'การช่วยฟื้นคืนชีพขั้นสูง (ACLS)', date: '15 มี.ค. 2569', location: 'ห้องประชุม 1', hours: 12, status: 'ลงทะเบียนแล้ว' },
            { title: 'การใช้งานระบบ HIS ใหม่', date: '22 มี.ค. 2569', location: 'ห้อง IT Training', hours: 6, status: 'เปิดรับสมัคร' },
        ],
        completed: [
            { title: 'การป้องกันและควบคุมการติดเชื้อ (IC)', date: '10 ก.พ. 2569', hours: 6, score: 'ผ่าน', certificate: true },
            { title: 'การดูแลผู้ป่วยวิกฤต', date: '25 ม.ค. 2569', hours: 12, score: 'ผ่าน', certificate: true },
            { title: 'จริยธรรมและจรรยาบรรณวิชาชีพ', date: '15 ธ.ค. 2568', hours: 3, score: 'ผ่าน', certificate: true },
            { title: 'การพัฒนาคุณภาพ HA', date: '1 พ.ย. 2568', hours: 12, score: 'ผ่าน', certificate: true },
        ],
        totalHours: 45,
        requiredHours: 50,
    },

    // ===== Benefits =====
    benefits: [
        { title: 'สิทธิการรักษาพยาบาล', description: 'สิทธิข้าราชการ ครอบคลุมค่ารักษาของตนเองและครอบครัว (บิดา มารดา คู่สมรส บุตร)', icon: 'fa-heart-pulse', color: '#dc2626', colorBg: '#fee2e2' },
        { title: 'กองทุนบำเหน็จบำนาญ (กบข.)', description: 'สะสม 3% ของเงินเดือน รัฐสมทบ 3% + เงินชดเชย 2% ยอดสะสมปัจจุบัน 185,000 บาท', icon: 'fa-piggy-bank', color: '#f59e0b', colorBg: '#fef3c7' },
        { title: 'ประกันสังคม', description: 'สิทธิประกันสังคม มาตรา 33 ครอบคลุมกรณีเจ็บป่วย คลอดบุตร ทุพพลภาพ ชราภาพ', icon: 'fa-shield-halved', color: '#0d9488', colorBg: '#f0fdfa' },
        { title: 'สวัสดิการค่าเล่าเรียนบุตร', description: 'เบิกค่าเล่าเรียนบุตรได้ตามระเบียบ ตั้งแต่ระดับอนุบาลถึงปริญญาตรี', icon: 'fa-user-graduate', color: '#3b82f6', colorBg: '#dbeafe' },
        { title: 'ค่าเช่าบ้าน', description: 'เบิกค่าเช่าบ้านได้ไม่เกิน 3,000 บาท/เดือน สำหรับผู้ที่ไม่มีบ้านพักราชการ', icon: 'fa-house', color: '#8b5cf6', colorBg: '#ede9fe' },
        { title: 'สหกรณ์ออมทรัพย์', description: 'สมาชิกสหกรณ์ออมทรัพย์สาธารณสุขเชียงใหม่ สามารถกู้เงินได้ในอัตราดอกเบี้ยต่ำ', icon: 'fa-building-columns', color: '#16a34a', colorBg: '#dcfce7' },
    ],

    // ===== Documents =====
    documents: [
        { title: 'หนังสือรับรองการทำงาน', type: 'PDF', size: '120 KB', date: '1 มี.ค. 69', icon: 'fa-file-pdf', color: '#dc2626', colorBg: '#fee2e2' },
        { title: 'สำเนาบัตรข้าราชการ', type: 'PDF', size: '250 KB', date: '15 ม.ค. 69', icon: 'fa-id-card', color: '#3b82f6', colorBg: '#dbeafe' },
        { title: 'ใบแจ้งภาษีประจำปี 2568', type: 'PDF', size: '180 KB', date: '31 ม.ค. 69', icon: 'fa-file-invoice', color: '#f59e0b', colorBg: '#fef3c7' },
        { title: 'ประวัติการฝึกอบรม', type: 'PDF', size: '95 KB', date: '28 ก.พ. 69', icon: 'fa-graduation-cap', color: '#0d9488', colorBg: '#f0fdfa' },
        { title: 'แบบฟอร์มใบลา', type: 'DOCX', size: '45 KB', date: '-', icon: 'fa-file-word', color: '#3b82f6', colorBg: '#dbeafe' },
        { title: 'แบบฟอร์มขอ OT', type: 'DOCX', size: '38 KB', date: '-', icon: 'fa-file-word', color: '#3b82f6', colorBg: '#dbeafe' },
    ],

    // ===== Announcements =====
    announcements: [
        { title: 'แจ้งกำหนดการตรวจสุขภาพประจำปี 2569', content: 'ขอเชิญบุคลากรทุกท่านเข้ารับการตรวจสุขภาพประจำปี ในวันที่ 15-20 มี.ค. 2569 ณ คลินิกอาชีวเวชกรรม', date: '3 มี.ค. 69', isNew: true, type: 'important', icon: 'fa-stethoscope', color: '#dc2626', colorBg: '#fee2e2' },
        { title: 'ประกาศปรับเปลี่ยนระบบ HIS ใหม่', content: 'โรงพยาบาลจะทำการปรับเปลี่ยนระบบสารสนเทศโรงพยาบาล (HIS) ใหม่ เริ่มใช้งานวันที่ 1 เม.ย. 2569', date: '1 มี.ค. 69', isNew: true, type: 'info', icon: 'fa-laptop-medical', color: '#3b82f6', colorBg: '#dbeafe' },
        { title: 'ตารางเวรเดือนมีนาคม 2569', content: 'สามารถตรวจสอบตารางเวรประจำเดือนมีนาคม 2569 ได้ที่กลุ่มงานการพยาบาล หรือระบบ HRM', date: '25 ก.พ. 69', isNew: false, type: 'general', icon: 'fa-calendar-days', color: '#0d9488', colorBg: '#f0fdfa' },
        { title: 'โครงการอบรม ACLS สำหรับพยาบาล', content: 'เปิดรับสมัครพยาบาลเข้าร่วมอบรม Advanced Cardiovascular Life Support (ACLS) รุ่นที่ 3/2569', date: '20 ก.พ. 69', isNew: false, type: 'training', icon: 'fa-chalkboard-teacher', color: '#8b5cf6', colorBg: '#ede9fe' },
        { title: 'แจ้งผลการเลื่อนขั้นเงินเดือน', content: 'ประกาศผลการพิจารณาเลื่อนขั้นเงินเดือนข้าราชการ รอบ 1 เมษายน 2569', date: '15 ก.พ. 69', isNew: false, type: 'hr', icon: 'fa-money-check-dollar', color: '#16a34a', colorBg: '#dcfce7' },
    ]
};

// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Helper to format date
function formatThaiDate(date) {
    const months = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
    const d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}
