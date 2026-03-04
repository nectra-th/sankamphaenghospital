// =====================================================
// Sankampaeng Hospital - Discharge Center Application
// =====================================================

(function () {
  'use strict';

  // ==================== STATE ====================
  let currentPage = 'dashboard';
  let selectedPatient = null;
  let selectedDischargedPatient = null;
  let charts = {};

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initNotifications();
    initMobileMenu();
    setCurrentDate();
    renderPage('dashboard');
  });

  function setCurrentDate() {
    document.getElementById('current-date').textContent = formatThaiDateFull('2026-03-04');
  }

  // ==================== NAVIGATION ====================
  function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        if (page) {
          navigateTo(page);
          closeMobileMenu();
        }
      });
    });
  }

  function navigateTo(page, data) {
    currentPage = page;
    selectedPatient = data?.patient || null;
    selectedDischargedPatient = data?.dischargedPatient || null;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update breadcrumb
    const breadcrumbs = {
      dashboard: 'แดชบอร์ด',
      inpatients: 'ผู้ป่วยในปัจจุบัน',
      'discharge-planning': 'วางแผนจำหน่าย',
      'pending-discharge': 'รอจำหน่าย',
      'follow-up': 'ติดตามหลังจำหน่าย',
      'home-visit': 'เยี่ยมบ้าน',
      reports: 'รายงาน/สถิติ',
      opd: 'OPD ผู้ป่วยนอก',
      er: 'ER ฉุกเฉิน',
      ward: 'หอผู้ป่วย',
      'patient-detail': `รายละเอียดผู้ป่วย`,
      'followup-detail': 'รายละเอียดติดตามผล',
    };
    document.getElementById('breadcrumb-text').textContent = breadcrumbs[page] || page;

    renderPage(page);
  }

  function renderPage(page) {
    // Destroy previous charts
    Object.values(charts).forEach(c => c.destroy());
    charts = {};

    const container = document.getElementById('pageContent');
    container.style.animation = 'none';
    container.offsetHeight; // trigger reflow
    container.style.animation = 'fadeIn 0.3s ease';

    switch (page) {
      case 'dashboard': renderDashboard(container); break;
      case 'inpatients': renderInpatients(container); break;
      case 'discharge-planning': renderDischargePlanning(container); break;
      case 'pending-discharge': renderPendingDischarge(container); break;
      case 'follow-up': renderFollowUp(container); break;
      case 'home-visit': renderHomeVisit(container); break;
      case 'reports': renderReports(container); break;
      case 'opd': renderOPD(container); break;
      case 'er': renderER(container); break;
      case 'ward': renderWard(container); break;
      case 'patient-detail': renderPatientDetail(container); break;
      case 'followup-detail': renderFollowUpDetail(container); break;
      default: container.innerHTML = '<div class="empty-state"><i class="fas fa-file"></i><p>ไม่พบหน้าที่ต้องการ</p></div>';
    }
  }

  // ==================== DASHBOARD ====================
  function renderDashboard(container) {
    const d = MOCK_DATA.dashboard;
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fas fa-bed"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.totalInpatients}</span>
            <span class="stat-label">ผู้ป่วยในทั้งหมด</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fas fa-clipboard-list"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.pendingDischarge}</span>
            <span class="stat-label">รอวางแผนจำหน่าย</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.todayDischarge}</span>
            <span class="stat-label">จำหน่ายวันนี้</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal"><i class="fas fa-phone-alt"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.followUpDueToday}</span>
            <span class="stat-label">ติดตามผลวันนี้</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.followUpOverdue}</span>
            <span class="stat-label">ติดตามเลยกำหนด</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="fas fa-percentage"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.bedOccupancy}%</span>
            <span class="stat-label">อัตราครองเตียง</span>
          </div>
        </div>
      </div>

      <div class="grid-2-1">
        <div>
          <div class="grid-2" style="margin-bottom:0">
            <div class="card">
              <div class="card-header">
                <span class="card-title"><i class="fas fa-chart-line"></i> จำนวนจำหน่าย/เดือน</span>
              </div>
              <div class="card-body">
                <div class="chart-container"><canvas id="chartDischarge"></canvas></div>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <span class="card-title"><i class="fas fa-hospital"></i> สรุปหอผู้ป่วย</span>
              </div>
              <div class="card-body no-padding">
                <div class="table-wrapper">
                  <table>
                    <thead>
                      <tr><th>หอผู้ป่วย</th><th>เตียง</th><th>ครอง</th><th>รอ D/C</th></tr>
                    </thead>
                    <tbody>
                      ${d.wardSummary.map(w => `
                        <tr>
                          <td><strong>${w.name}</strong></td>
                          <td>${w.beds}</td>
                          <td>${w.occupied}</td>
                          <td>${w.pending > 0 ? `<span class="badge badge-warning">${w.pending}</span>` : '-'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-tasks"></i> งานที่ต้องทำ</span>
            </div>
            <div class="card-body">
              ${d.pendingTasks.map(t => `
                <div class="task-item">
                  <div class="task-priority ${t.type}"></div>
                  <div class="task-text">${t.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-history"></i> กิจกรรมล่าสุด</span>
            </div>
            <div class="card-body">
              ${d.recentActivities.map(a => `
                <div class="activity-item">
                  <div class="activity-time">${a.time}</div>
                  <div class="activity-dot ${a.type}"></div>
                  <div class="activity-content">
                    <div class="activity-action">${a.action} - ${a.patient}</div>
                    <div class="activity-detail">${a.detail}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Charts
    setTimeout(() => {
      const ctx = document.getElementById('chartDischarge');
      if (ctx) {
        charts.discharge = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: d.dischargeByMonth.map(m => m.month),
            datasets: [
              {
                label: 'จำหน่าย',
                data: d.dischargeByMonth.map(m => m.count),
                backgroundColor: 'rgba(15, 118, 110, 0.7)',
                borderRadius: 6,
              },
              {
                label: 'Readmission',
                data: d.readmissionByMonth.map(m => m.count),
                backgroundColor: 'rgba(220, 38, 38, 0.7)',
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { family: 'Prompt', size: 11 } } } },
            scales: { y: { beginAtZero: true, ticks: { font: { family: 'Prompt' } } }, x: { ticks: { font: { family: 'Prompt' } } } },
          },
        });
      }
    }, 100);
  }

  // ==================== INPATIENTS ====================
  function renderInpatients(container) {
    const patients = MOCK_DATA.patients;
    container.innerHTML = `
      <div class="toolbar">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="ค้นหาชื่อ, HN, AN..." id="searchInpatient">
        </div>
        <div class="filter-group">
          <select id="filterWard">
            <option value="">ทุกหอผู้ป่วย</option>
            <option value="อายุรกรรมชาย">อายุรกรรมชาย</option>
            <option value="อายุรกรรมหญิง">อายุรกรรมหญิง</option>
            <option value="ศัลยกรรม">ศัลยกรรม</option>
            <option value="กุมารเวชกรรม">กุมารเวชกรรม</option>
            <option value="CCU">CCU/ICU</option>
          </select>
          <select id="filterStatus">
            <option value="">ทุกสถานะ</option>
            <option value="planning">กำลังวางแผน</option>
            <option value="ready">พร้อมจำหน่าย</option>
          </select>
          <select id="filterRisk">
            <option value="">ทุกระดับความเสี่ยง</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
          </select>
        </div>
      </div>

      <div class="card">
        <div class="card-body no-padding">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>HN</th>
                  <th>ชื่อ-สกุล</th>
                  <th>อายุ</th>
                  <th>หอผู้ป่วย</th>
                  <th>เตียง</th>
                  <th>การวินิจฉัย</th>
                  <th>แพทย์</th>
                  <th>วันที่รับไว้</th>
                  <th>LOS</th>
                  <th>ความเสี่ยง</th>
                  <th>สถานะ D/C</th>
                  <th>แผน D/C</th>
                </tr>
              </thead>
              <tbody id="inpatientTable">
                ${patients.map(p => {
                  const risk = getRiskBadge(p.riskLevel);
                  const status = getStatusBadge(p.dischargeStatus);
                  const plan = p.dischargePlan;
                  const pct = Math.round((plan.completedItems / plan.totalItems) * 100);
                  return `
                    <tr class="clickable" onclick="window.app.viewPatient('${p.id}')">
                      <td><strong>${p.hn}</strong></td>
                      <td>
                        <div style="display:flex;align-items:center;gap:8px">
                          <i class="fas fa-${p.gender === 'male' ? 'mars' : 'venus'}" style="color:${p.gender === 'male' ? '#3b82f6' : '#ec4899'}"></i>
                          ${p.name}
                        </div>
                      </td>
                      <td>${p.age} ปี</td>
                      <td>${p.ward}</td>
                      <td>${p.bed}</td>
                      <td style="max-width:200px">${p.diagnosis}</td>
                      <td>${p.attendingDoc}</td>
                      <td>${formatThaiDate(p.admitDate)}</td>
                      <td><strong>${p.los}</strong> วัน</td>
                      <td><span class="badge ${risk.class}">${risk.text}</span></td>
                      <td><span class="badge ${status.class}">${status.text}</span></td>
                      <td>
                        <div style="min-width:80px">
                          <div class="progress-bar"><div class="progress-fill ${pct === 100 ? 'green' : 'orange'}" style="width:${pct}%"></div></div>
                          <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${plan.completedItems}/${plan.totalItems} (${pct}%)</div>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Search & filter
    const searchInput = document.getElementById('searchInpatient');
    const filterWard = document.getElementById('filterWard');
    const filterStatus = document.getElementById('filterStatus');
    const filterRisk = document.getElementById('filterRisk');

    const applyFilters = () => {
      const search = searchInput.value.toLowerCase();
      const ward = filterWard.value;
      const status = filterStatus.value;
      const risk = filterRisk.value;

      const filtered = patients.filter(p => {
        if (search && !p.name.toLowerCase().includes(search) && !p.hn.includes(search) && !p.an.includes(search)) return false;
        if (ward && !p.ward.includes(ward)) return false;
        if (status && p.dischargeStatus !== status) return false;
        if (risk && p.riskLevel !== risk) return false;
        return true;
      });

      const tbody = document.getElementById('inpatientTable');
      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:30px;color:var(--gray-400)">ไม่พบข้อมูล</td></tr>';
        return;
      }

      tbody.innerHTML = filtered.map(p => {
        const rk = getRiskBadge(p.riskLevel);
        const st = getStatusBadge(p.dischargeStatus);
        const plan = p.dischargePlan;
        const pct = Math.round((plan.completedItems / plan.totalItems) * 100);
        return `
          <tr class="clickable" onclick="window.app.viewPatient('${p.id}')">
            <td><strong>${p.hn}</strong></td>
            <td><div style="display:flex;align-items:center;gap:8px"><i class="fas fa-${p.gender === 'male' ? 'mars' : 'venus'}" style="color:${p.gender === 'male' ? '#3b82f6' : '#ec4899'}"></i>${p.name}</div></td>
            <td>${p.age} ปี</td>
            <td>${p.ward}</td>
            <td>${p.bed}</td>
            <td style="max-width:200px">${p.diagnosis}</td>
            <td>${p.attendingDoc}</td>
            <td>${formatThaiDate(p.admitDate)}</td>
            <td><strong>${p.los}</strong> วัน</td>
            <td><span class="badge ${rk.class}">${rk.text}</span></td>
            <td><span class="badge ${st.class}">${st.text}</span></td>
            <td>
              <div style="min-width:80px">
                <div class="progress-bar"><div class="progress-fill ${pct === 100 ? 'green' : 'orange'}" style="width:${pct}%"></div></div>
                <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${plan.completedItems}/${plan.totalItems} (${pct}%)</div>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    };

    searchInput.addEventListener('input', applyFilters);
    filterWard.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterRisk.addEventListener('change', applyFilters);
  }

  // ==================== PATIENT DETAIL ====================
  function renderPatientDetail(container) {
    const p = selectedPatient;
    if (!p) { navigateTo('inpatients'); return; }

    const risk = getRiskBadge(p.riskLevel);
    const status = getStatusBadge(p.dischargeStatus);
    const plan = p.dischargePlan;
    const pct = Math.round((plan.completedItems / plan.totalItems) * 100);
    const dm = plan.dMethod;

    const dmethodLabels = {
      disease: { letter: 'D', label: 'Disease - โรค/การวินิจฉัย', icon: 'fa-stethoscope' },
      medication: { letter: 'M', label: 'Medication - ยา', icon: 'fa-pills' },
      environment: { letter: 'E', label: 'Environment - สิ่งแวดล้อม', icon: 'fa-home' },
      treatment: { letter: 'T', label: 'Treatment - การรักษาต่อเนื่อง', icon: 'fa-heartbeat' },
      health: { letter: 'H', label: 'Health Teaching - สุขศึกษา', icon: 'fa-book-medical' },
      outpatient: { letter: 'O', label: 'Outpatient - นัดตรวจ', icon: 'fa-calendar-check' },
      diet: { letter: 'D', label: 'Diet - อาหาร', icon: 'fa-utensils' },
    };

    container.innerHTML = `
      <button class="back-btn" onclick="window.app.navigateTo('inpatients')">
        <i class="fas fa-arrow-left"></i> กลับหน้ารายชื่อผู้ป่วย
      </button>

      <div class="card" style="margin-bottom:20px">
        <div class="patient-header">
          <div class="patient-avatar">
            <i class="fas fa-${p.gender === 'male' ? 'male' : 'female'}"></i>
          </div>
          <div class="patient-main-info">
            <div class="patient-name">${p.name}</div>
            <div class="patient-meta">
              <span><i class="fas fa-id-card"></i> HN: ${p.hn}</span>
              <span><i class="fas fa-file-medical"></i> AN: ${p.an}</span>
              <span><i class="fas fa-birthday-cake"></i> ${p.age} ปี</span>
              <span><i class="fas fa-bed"></i> ${p.ward} / ${p.bed}</span>
              <span><i class="fas fa-user-md"></i> ${p.attendingDoc}</span>
            </div>
            <div class="patient-badges">
              <span class="badge ${risk.class}"><i class="fas fa-exclamation-circle"></i> ${risk.text}</span>
              <span class="badge ${status.class}">${status.text}</span>
              <span class="badge badge-info"><i class="fas fa-clock"></i> LOS: ${p.los} วัน</span>
              <span class="badge badge-secondary">${p.insurance}</span>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="info-grid">
            <div class="info-item"><span class="info-label">การวินิจฉัย</span><span class="info-value">${p.diagnosis}</span></div>
            <div class="info-item"><span class="info-label">ICD-10</span><span class="info-value">${p.diagnosisICD}</span></div>
            <div class="info-item"><span class="info-label">วันที่รับไว้</span><span class="info-value">${formatThaiDate(p.admitDate)}</span></div>
            <div class="info-item"><span class="info-label">กำหนดจำหน่าย</span><span class="info-value">${formatThaiDate(p.expectedDischargeDate)}</span></div>
            <div class="info-item"><span class="info-label">แพ้ยา</span><span class="info-value" style="color:${p.allergies !== 'ไม่มี' ? 'var(--danger)' : 'inherit'}">${p.allergies}</span></div>
            <div class="info-item"><span class="info-label">รับจาก</span><span class="info-value">${p.admitFrom}</span></div>
            <div class="info-item"><span class="info-label">ที่อยู่</span><span class="info-value">${p.address}</span></div>
            <div class="info-item"><span class="info-label">โทรศัพท์</span><span class="info-value">${p.phone}</span></div>
          </div>
        </div>
      </div>

      <div class="grid-2-1">
        <div>
          <!-- D-METHOD -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-clipboard-check"></i> D-METHOD Discharge Planning</span>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="min-width:120px">
                  <div class="progress-bar"><div class="progress-fill ${pct === 100 ? 'green' : 'orange'}" style="width:${pct}%"></div></div>
                </div>
                <span style="font-size:13px;font-weight:600;color:${pct === 100 ? 'var(--success)' : 'var(--warning)'}">${pct}%</span>
              </div>
            </div>
            <div class="card-body">
              <div class="dmethod-grid">
                ${Object.entries(dm).map(([key, val]) => {
                  const meta = dmethodLabels[key];
                  return `
                    <div class="dmethod-item">
                      <div class="dmethod-icon ${val.status}">
                        ${val.status === 'completed' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-clock"></i>'}
                      </div>
                      <div class="dmethod-content">
                        <div class="dmethod-label">
                          <span>${meta.label}</span>
                          <span class="badge ${val.status === 'completed' ? 'badge-success' : 'badge-warning'}" style="font-size:10px">${val.status === 'completed' ? 'เสร็จ' : 'รอดำเนินการ'}</span>
                        </div>
                        <div class="dmethod-note">${val.note}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Medications -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-pills"></i> ยาที่ต้องรับประทาน (${plan.medications.length} รายการ)</span>
            </div>
            <div class="card-body no-padding">
              <div class="table-wrapper">
                <table class="med-table">
                  <thead>
                    <tr><th>ชื่อยา</th><th>ขนาด</th><th>วิธีให้</th><th>ความถี่</th><th>หมายเหตุ</th></tr>
                  </thead>
                  <tbody>
                    ${plan.medications.map(m => `
                      <tr>
                        <td><span class="med-name">${m.name}</span></td>
                        <td>${m.dose}</td>
                        <td><span class="badge badge-info">${m.route}</span></td>
                        <td><strong>${m.frequency}</strong></td>
                        <td><span class="med-note">${m.note}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Special Instructions -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-exclamation-circle"></i> คำแนะนำพิเศษ</span>
            </div>
            <div class="card-body">
              <ol class="instructions-list">
                ${plan.specialInstructions.map(inst => `<li>${inst}</li>`).join('')}
              </ol>
            </div>
          </div>
        </div>

        <div>
          <!-- Caregiver -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-user-friends"></i> ผู้ดูแลหลัก</span>
            </div>
            <div class="card-body">
              <div class="caregiver-card">
                <div class="caregiver-avatar"><i class="fas fa-user"></i></div>
                <div class="caregiver-info">
                  <div class="caregiver-name">${p.caregiver.name}</div>
                  <div class="caregiver-relation">${p.caregiver.relation} | ${p.caregiver.phone}</div>
                </div>
              </div>
              <div style="margin-top:10px;padding:8px 12px;background:${p.caregiver.canCare ? 'var(--success-light)' : 'var(--danger-light)'};border-radius:var(--radius-sm);font-size:12px;color:${p.caregiver.canCare ? 'var(--success)' : 'var(--danger)'}">
                <i class="fas fa-${p.caregiver.canCare ? 'check-circle' : 'times-circle'}"></i>
                ${p.caregiver.canCare ? 'สามารถดูแลผู้ป่วยได้' : 'ไม่สามารถดูแลผู้ป่วยได้ - ต้องหาผู้ดูแลเพิ่ม'}
              </div>
            </div>
          </div>

          <!-- Equipment -->
          ${plan.equipment.length > 0 ? `
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-toolbox"></i> อุปกรณ์ที่ต้องเตรียม</span>
            </div>
            <div class="card-body">
              <div class="equipment-tags">
                ${plan.equipment.map(eq => `<span class="equipment-tag"><i class="fas fa-check"></i> ${eq}</span>`).join('')}
              </div>
            </div>
          </div>
          ` : ''}

          <!-- Summary -->
          <div class="card">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-info-circle"></i> สรุป</span>
            </div>
            <div class="card-body">
              <div class="info-item" style="margin-bottom:12px">
                <span class="info-label">กำหนดจำหน่าย</span>
                <span class="info-value" style="font-size:16px;color:var(--primary)">${formatThaiDate(p.expectedDischargeDate)}</span>
              </div>
              <div class="info-item" style="margin-bottom:12px">
                <span class="info-label">ระยะเวลานอน</span>
                <span class="info-value">${p.los} วัน</span>
              </div>
              <div class="info-item" style="margin-bottom:12px">
                <span class="info-label">ความเสี่ยง Readmission</span>
                <span class="badge ${risk.class}">${risk.text}</span>
              </div>
              <div class="info-item">
                <span class="info-label">สถานะแผนจำหน่าย</span>
                <span class="info-value">${plan.completedItems}/${plan.totalItems} รายการ (${pct}%)</span>
              </div>
              ${pct === 100 ? `
                <button class="btn btn-success" style="width:100%;margin-top:16px" onclick="alert('จำหน่ายผู้ป่วยสำเร็จ (Demo)')">
                  <i class="fas fa-check-circle"></i> จำหน่ายผู้ป่วย
                </button>
              ` : `
                <button class="btn btn-outline" style="width:100%;margin-top:16px" disabled>
                  <i class="fas fa-clock"></i> รอดำเนินการให้ครบ
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== DISCHARGE PLANNING ====================
  function renderDischargePlanning(container) {
    const planningPatients = MOCK_DATA.patients.filter(p => p.dischargeStatus === 'planning');

    container.innerHTML = `
      <div class="toolbar">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="ค้นหาผู้ป่วย..." id="searchPlanning">
        </div>
        <span style="font-size:13px;color:var(--gray-500)">ผู้ป่วยที่กำลังวางแผนจำหน่าย: <strong>${planningPatients.length}</strong> ราย</span>
      </div>

      ${planningPatients.map(p => {
        const risk = getRiskBadge(p.riskLevel);
        const plan = p.dischargePlan;
        const pct = Math.round((plan.completedItems / plan.totalItems) * 100);
        const dm = plan.dMethod;

        return `
          <div class="card" style="margin-bottom:16px">
            <div class="card-header" style="cursor:pointer" onclick="window.app.viewPatient('${p.id}')">
              <div style="display:flex;align-items:center;gap:12px">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--primary-lighter);display:flex;align-items:center;justify-content:center">
                  <i class="fas fa-user" style="color:var(--primary)"></i>
                </div>
                <div>
                  <div style="font-weight:600">${p.name} <span style="font-weight:400;color:var(--gray-500);font-size:12px">HN: ${p.hn} | ${p.ward} / ${p.bed}</span></div>
                  <div style="font-size:12px;color:var(--gray-500)">${p.diagnosis} | แพทย์: ${p.attendingDoc}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <span class="badge ${risk.class}">${risk.text}</span>
                <div style="text-align:right;min-width:100px">
                  <div class="progress-bar"><div class="progress-fill ${pct >= 80 ? 'green' : pct >= 50 ? 'orange' : 'red'}" style="width:${pct}%"></div></div>
                  <div style="font-size:11px;margin-top:2px;color:var(--gray-500)">${plan.completedItems}/${plan.totalItems} (${pct}%)</div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div style="display:flex;flex-wrap:wrap;gap:8px">
                ${Object.entries(dm).map(([key, val]) => {
                  const labels = { disease: 'D-โรค', medication: 'M-ยา', environment: 'E-สิ่งแวดล้อม', treatment: 'T-การรักษา', health: 'H-สุขศึกษา', outpatient: 'O-นัดตรวจ', diet: 'D-อาหาร' };
                  return `<span class="badge ${val.status === 'completed' ? 'badge-success' : 'badge-warning'}"><i class="fas fa-${val.status === 'completed' ? 'check' : 'clock'}"></i> ${labels[key]}</span>`;
                }).join('')}
              </div>
              <div style="margin-top:10px;font-size:12px;color:var(--gray-500)">
                <i class="fas fa-calendar"></i> กำหนดจำหน่าย: <strong>${formatThaiDate(p.expectedDischargeDate)}</strong>
                (อีก ${daysFromNow(p.expectedDischargeDate)} วัน)
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  // ==================== PENDING DISCHARGE ====================
  function renderPendingDischarge(container) {
    const readyPatients = MOCK_DATA.patients.filter(p => p.dischargeStatus === 'ready');

    container.innerHTML = `
      <div style="margin-bottom:16px;padding:16px;background:var(--success-light);border-radius:var(--radius-md);display:flex;align-items:center;gap:12px">
        <i class="fas fa-check-circle" style="font-size:24px;color:var(--success)"></i>
        <div>
          <div style="font-weight:600;color:var(--success)">ผู้ป่วยพร้อมจำหน่ายวันนี้: ${readyPatients.length} ราย</div>
          <div style="font-size:12px;color:var(--gray-600)">แผนจำหน่ายครบถ้วน D-METHOD 7/7 รายการ</div>
        </div>
      </div>

      ${readyPatients.map(p => `
        <div class="card" style="margin-bottom:16px;border-left:4px solid var(--success)">
          <div class="card-body">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
              <div>
                <div style="font-size:16px;font-weight:600;margin-bottom:4px">${p.name}</div>
                <div style="font-size:12px;color:var(--gray-500);margin-bottom:8px">
                  HN: ${p.hn} | AN: ${p.an} | ${p.ward} / เตียง ${p.bed} | LOS: ${p.los} วัน
                </div>
                <div style="font-size:13px;margin-bottom:4px"><strong>วินิจฉัย:</strong> ${p.diagnosis}</div>
                <div style="font-size:13px;margin-bottom:4px"><strong>แพทย์:</strong> ${p.attendingDoc}</div>
                <div style="font-size:13px;margin-bottom:4px"><strong>ผู้ดูแล:</strong> ${p.caregiver.name} (${p.caregiver.relation}) - ${p.caregiver.phone}</div>
                <div style="font-size:13px"><strong>ยากลับบ้าน:</strong> ${p.dischargePlan.medications.length} รายการ</div>
                ${p.dischargePlan.equipment.length > 0 ? `<div style="font-size:13px;margin-top:4px"><strong>อุปกรณ์:</strong> ${p.dischargePlan.equipment.join(', ')}</div>` : ''}
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;min-width:160px">
                <span class="badge badge-success" style="justify-content:center"><i class="fas fa-check-circle"></i> D-METHOD ครบ 7/7</span>
                <span class="badge ${getRiskBadge(p.riskLevel).class}" style="justify-content:center">${getRiskBadge(p.riskLevel).text}</span>
                <button class="btn btn-primary btn-sm" onclick="window.app.viewPatient('${p.id}')">
                  <i class="fas fa-eye"></i> ดูรายละเอียด
                </button>
                <button class="btn btn-success btn-sm" onclick="alert('จำหน่ายผู้ป่วย ${p.name} สำเร็จ (Demo)')">
                  <i class="fas fa-sign-out-alt"></i> จำหน่าย
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    `;
  }

  // ==================== FOLLOW-UP ====================
  function renderFollowUp(container) {
    const patients = MOCK_DATA.dischargedPatients;

    const tabs = [
      { id: 'all', label: 'ทั้งหมด', count: patients.length },
      { id: 'active', label: 'กำลังติดตาม', count: patients.filter(p => ['on_track', 'new', 'overdue'].includes(p.followUpStatus)).length },
      { id: 'overdue', label: 'เลยกำหนด', count: patients.filter(p => p.followUpStatus === 'overdue').length },
      { id: 'completed', label: 'ติดตามครบ', count: patients.filter(p => p.followUpStatus === 'completed').length },
    ];

    container.innerHTML = `
      <div class="toolbar">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="ค้นหาชื่อ, HN..." id="searchFollowUp">
        </div>
        <div class="filter-group">
          <select id="filterFollowUpRisk">
            <option value="">ทุกระดับความเสี่ยง</option>
            <option value="high">สูง</option>
            <option value="medium">ปานกลาง</option>
            <option value="low">ต่ำ</option>
          </select>
        </div>
      </div>

      <div class="tabs" id="followUpTabs">
        ${tabs.map((t, i) => `
          <button class="tab ${i === 0 ? 'active' : ''}" data-tab="${t.id}">
            ${t.label} <span class="tab-count">${t.count}</span>
          </button>
        `).join('')}
      </div>

      <div id="followUpContent">
        ${renderFollowUpTable(patients)}
      </div>
    `;

    // Tab switching
    document.querySelectorAll('#followUpTabs .tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#followUpTabs .tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.tab;
        let filtered = patients;
        if (filter === 'active') filtered = patients.filter(p => ['on_track', 'new', 'overdue'].includes(p.followUpStatus));
        else if (filter === 'overdue') filtered = patients.filter(p => p.followUpStatus === 'overdue');
        else if (filter === 'completed') filtered = patients.filter(p => p.followUpStatus === 'completed');
        document.getElementById('followUpContent').innerHTML = renderFollowUpTable(filtered);
      });
    });
  }

  function renderFollowUpTable(patients) {
    if (patients.length === 0) {
      return '<div class="empty-state"><i class="fas fa-clipboard-check"></i><p>ไม่มีข้อมูลการติดตาม</p></div>';
    }

    return `
      <div class="card">
        <div class="card-body no-padding">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>HN</th>
                  <th>ชื่อ-สกุล</th>
                  <th>วินิจฉัย</th>
                  <th>วันจำหน่าย</th>
                  <th>ความเสี่ยง</th>
                  <th>สถานะ</th>
                  <th>ติดตามครั้งถัดไป</th>
                  <th>บันทึก</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${patients.map(p => {
                  const risk = getRiskBadge(p.riskLevel);
                  const status = getStatusBadge(p.followUpStatus);
                  const nextFU = p.nextFollowUp;
                  const daysDiff = nextFU ? daysFromNow(nextFU.date) : null;
                  return `
                    <tr class="clickable" onclick="window.app.viewFollowUp('${p.id}')">
                      <td><strong>${p.hn}</strong></td>
                      <td>${p.name}</td>
                      <td style="max-width:180px">${p.diagnosis}</td>
                      <td>${formatThaiDate(p.dischargeDate)}</td>
                      <td><span class="badge ${risk.class}">${risk.text}</span></td>
                      <td><span class="badge ${status.class}">${status.text}</span></td>
                      <td>
                        ${nextFU ? `
                          <div style="font-size:12px;font-weight:500">${getFollowUpTypeName(nextFU.type)}</div>
                          <div style="font-size:11px;color:${daysDiff < 0 ? 'var(--danger)' : 'var(--gray-500)'}">${formatThaiDate(nextFU.date)} ${daysDiff < 0 ? '(เลย ' + Math.abs(daysDiff) + ' วัน)' : daysDiff === 0 ? '(วันนี้)' : '(อีก ' + daysDiff + ' วัน)'}</div>
                        ` : '<span style="color:var(--gray-400)">-</span>'}
                      </td>
                      <td>
                        <span class="badge badge-secondary">${p.followUpRecords.length} ครั้ง</span>
                      </td>
                      <td>
                        <button class="btn-icon" title="ดูรายละเอียด">
                          <i class="fas fa-chevron-right"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== FOLLOW-UP DETAIL ====================
  function renderFollowUpDetail(container) {
    const p = selectedDischargedPatient;
    if (!p) { navigateTo('follow-up'); return; }

    const risk = getRiskBadge(p.riskLevel);
    const status = getStatusBadge(p.followUpStatus);

    container.innerHTML = `
      <button class="back-btn" onclick="window.app.navigateTo('follow-up')">
        <i class="fas fa-arrow-left"></i> กลับหน้าติดตามผล
      </button>

      <!-- Patient Summary -->
      <div class="card" style="margin-bottom:20px">
        <div class="patient-header">
          <div class="patient-avatar">
            <i class="fas fa-${p.gender === 'male' ? 'male' : 'female'}"></i>
          </div>
          <div class="patient-main-info">
            <div class="patient-name">${p.name}</div>
            <div class="patient-meta">
              <span><i class="fas fa-id-card"></i> HN: ${p.hn}</span>
              <span><i class="fas fa-file-medical"></i> AN: ${p.an}</span>
              <span><i class="fas fa-stethoscope"></i> ${p.diagnosis}</span>
              <span><i class="fas fa-calendar-check"></i> จำหน่าย: ${formatThaiDate(p.dischargeDate)}</span>
            </div>
            <div class="patient-badges">
              <span class="badge ${risk.class}"><i class="fas fa-exclamation-circle"></i> ${risk.text}</span>
              <span class="badge ${status.class}">${status.text}</span>
              <span class="badge badge-secondary">${p.insurance}</span>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="info-grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
            <div class="info-item"><span class="info-label">แพทย์เจ้าของไข้</span><span class="info-value">${p.attendingDoc}</span></div>
            <div class="info-item"><span class="info-label">หอผู้ป่วย (เดิม)</span><span class="info-value">${p.ward}</span></div>
            <div class="info-item"><span class="info-label">ผู้ดูแล</span><span class="info-value">${p.caregiver.name} (${p.caregiver.relation})</span></div>
            <div class="info-item"><span class="info-label">โทรผู้ดูแล</span><span class="info-value">${p.caregiver.phone}</span></div>
            <div class="info-item"><span class="info-label">ที่อยู่</span><span class="info-value">${p.address}</span></div>
            <div class="info-item"><span class="info-label">นัด OPD ครั้งถัดไป</span><span class="info-value">${formatThaiDate(p.nextOPD)}</span></div>
          </div>
        </div>
      </div>

      <div class="grid-2-1">
        <div>
          <!-- Follow-up Records -->
          <div class="section-title"><i class="fas fa-notes-medical"></i> บันทึกการติดตาม (${p.followUpRecords.length} ครั้ง)</div>

          ${p.followUpRecords.length > 0 ? p.followUpRecords.slice().reverse().map(r => `
            <div class="followup-record">
              <div class="followup-record-header">
                <div class="followup-record-title">
                  <span class="badge ${r.overallStatus === 'improving' ? 'badge-success' : r.overallStatus === 'concern' ? 'badge-warning' : r.overallStatus === 'recovered' ? 'badge-success' : 'badge-info'}">
                    ${getOverallStatusText(r.overallStatus)}
                  </span>
                  <span>${getFollowUpTypeName(r.type)}</span>
                  <span style="color:var(--gray-400);font-weight:400">|</span>
                  <span style="color:var(--gray-500);font-weight:400">${formatThaiDate(r.date)}</span>
                </div>
                <span style="font-size:11px;color:var(--gray-500)">${r.recorder} | ${r.channel} | ${r.duration}</span>
              </div>
              <div class="followup-record-body">
                ${r.vitalSigns ? `
                  <div style="display:flex;gap:16px;margin-bottom:14px;flex-wrap:wrap">
                    <div style="padding:6px 12px;background:var(--gray-50);border-radius:var(--radius-sm);font-size:12px">
                      <span style="color:var(--gray-500)">BP:</span> <strong>${r.vitalSigns.bp}</strong> mmHg
                    </div>
                    <div style="padding:6px 12px;background:var(--gray-50);border-radius:var(--radius-sm);font-size:12px">
                      <span style="color:var(--gray-500)">Temp:</span> <strong>${r.vitalSigns.temp}</strong> °C
                    </div>
                    <div style="padding:6px 12px;background:var(--gray-50);border-radius:var(--radius-sm);font-size:12px">
                      <span style="color:var(--gray-500)">HR:</span> <strong>${r.vitalSigns.hr}</strong> bpm
                    </div>
                  </div>
                ` : ''}

                <div class="assessment-grid">
                  <div class="assessment-item"><div class="assessment-label">สภาพทั่วไป</div><div class="assessment-value">${r.assessment.generalCondition}</div></div>
                  <div class="assessment-item"><div class="assessment-label">ระดับปวด</div><div class="assessment-value">${r.assessment.painLevel}/10</div></div>
                  <div class="assessment-item"><div class="assessment-label">การรับประทานยา</div><div class="assessment-value">${r.assessment.medication}</div></div>
                  <div class="assessment-item"><div class="assessment-label">การเคลื่อนไหว</div><div class="assessment-value">${r.assessment.movement}</div></div>
                  <div class="assessment-item"><div class="assessment-label">การรับประทานอาหาร</div><div class="assessment-value">${r.assessment.eating}</div></div>
                  <div class="assessment-item"><div class="assessment-label">การนอนหลับ</div><div class="assessment-value">${r.assessment.sleeping}</div></div>
                  <div class="assessment-item"><div class="assessment-label">สภาพจิตใจ</div><div class="assessment-value">${r.assessment.mentalHealth}</div></div>
                </div>

                ${r.problems.length > 0 ? `
                  <div style="margin-top:12px">
                    <div style="font-size:12px;font-weight:600;color:var(--warning);margin-bottom:6px"><i class="fas fa-exclamation-triangle"></i> ปัญหาที่พบ</div>
                    <ul class="problems-list">${r.problems.map(prob => `<li>${prob}</li>`).join('')}</ul>
                  </div>
                ` : ''}

                ${r.actions.length > 0 ? `
                  <div style="margin-top:12px">
                    <div style="font-size:12px;font-weight:600;color:var(--primary);margin-bottom:6px"><i class="fas fa-hand-holding-medical"></i> การดำเนินการ</div>
                    <ul class="actions-list">${r.actions.map(act => `<li>${act}</li>`).join('')}</ul>
                  </div>
                ` : ''}

                <div style="margin-top:12px;padding:8px 12px;background:var(--info-light);border-radius:var(--radius-sm);font-size:12px;color:var(--info)">
                  <i class="fas fa-arrow-right"></i> แผนถัดไป: ${r.nextPlan}
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="empty-state"><i class="fas fa-notes-medical"></i><p>ยังไม่มีบันทึกการติดตาม</p></div>
          `}
        </div>

        <div>
          <!-- Follow-up Schedule Timeline -->
          <div class="card" style="margin-bottom:20px">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-calendar-alt"></i> ตารางติดตาม</span>
            </div>
            <div class="card-body">
              <div class="timeline">
                ${p.followUpSchedule.map(s => {
                  const daysDiff = daysFromNow(s.date);
                  const dotClass = s.status === 'completed' ? 'completed' : s.status === 'overdue' ? 'overdue' : daysDiff === 0 ? 'current' : 'scheduled';
                  return `
                    <div class="timeline-item">
                      <div class="timeline-dot ${dotClass}"></div>
                      <div class="timeline-content">
                        <div class="timeline-date">${formatThaiDate(s.date)} ${daysDiff < 0 && s.status !== 'completed' ? '<span style="color:var(--danger)">(เลยกำหนด)</span>' : daysDiff === 0 ? '<span style="color:var(--primary)">(วันนี้)</span>' : ''}</div>
                        <div class="timeline-title">${getFollowUpTypeName(s.type)}</div>
                        <div class="timeline-desc">${s.assignee} | <span class="badge ${getStatusBadge(s.status).class}" style="font-size:10px">${getStatusBadge(s.status).text}</span></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <span class="card-title"><i class="fas fa-bolt"></i> ดำเนินการ</span>
            </div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-primary" onclick="alert('บันทึกการโทรติดตาม (Demo)')">
                <i class="fas fa-phone-alt"></i> บันทึกโทรติดตาม
              </button>
              <button class="btn btn-secondary" onclick="alert('นัดเยี่ยมบ้าน (Demo)')">
                <i class="fas fa-home"></i> นัดเยี่ยมบ้าน
              </button>
              <button class="btn btn-outline" onclick="alert('ส่งต่อแพทย์ (Demo)')">
                <i class="fas fa-user-md"></i> ส่งต่อแพทย์
              </button>
              ${p.followUpStatus !== 'completed' ? `
                <button class="btn btn-success" onclick="alert('ปิดเคส (Demo)')">
                  <i class="fas fa-check-circle"></i> ปิดเคสติดตาม
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== HOME VISIT ====================
  function renderHomeVisit(container) {
    const visits = MOCK_DATA.homeVisits;

    container.innerHTML = `
      <div class="toolbar">
        <span style="font-size:14px;font-weight:600">ตารางเยี่ยมบ้าน</span>
        <button class="btn btn-primary" onclick="alert('นัดเยี่ยมบ้านใหม่ (Demo)')">
          <i class="fas fa-plus"></i> นัดเยี่ยมบ้านใหม่
        </button>
      </div>

      ${visits.map(v => {
        const daysDiff = daysFromNow(v.date);
        return `
          <div class="card" style="margin-bottom:16px;border-left:4px solid ${daysDiff <= 2 ? 'var(--warning)' : 'var(--primary)'}">
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
                    <div style="padding:8px 14px;background:var(--primary-lighter);border-radius:var(--radius-sm);text-align:center">
                      <div style="font-size:18px;font-weight:700;color:var(--primary)">${new Date(v.date).getDate()}</div>
                      <div style="font-size:10px;color:var(--gray-500)">${['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][new Date(v.date).getMonth()]}</div>
                    </div>
                    <div>
                      <div style="font-size:15px;font-weight:600">${v.patientName}</div>
                      <div style="font-size:12px;color:var(--gray-500)">HN: ${v.hn} | ${v.diagnosis}</div>
                    </div>
                  </div>

                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px">
                    <div class="info-item"><span class="info-label">เวลานัด</span><span class="info-value">${v.time} น.</span></div>
                    <div class="info-item"><span class="info-label">สถานะ</span><span class="badge ${v.status === 'scheduled' ? 'badge-info' : 'badge-success'}">${v.status === 'scheduled' ? 'ตามกำหนด' : 'เสร็จสิ้น'}</span></div>
                    <div class="info-item"><span class="info-label">ทีมเยี่ยม</span><span class="info-value">${v.team.join(', ')}</span></div>
                    <div class="info-item"><span class="info-label">ที่อยู่</span><span class="info-value">${v.address}</span></div>
                  </div>

                  <div style="margin-top:12px">
                    <div style="font-size:12px;font-weight:600;margin-bottom:6px">วัตถุประสงค์:</div>
                    <div style="display:flex;flex-wrap:wrap;gap:6px">
                      ${v.objectives.map(o => `<span class="badge badge-secondary"><i class="fas fa-check"></i> ${o}</span>`).join('')}
                    </div>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px">
                  ${daysDiff <= 2 && daysDiff >= 0 ? '<span class="badge badge-warning"><i class="fas fa-clock"></i> เร็วๆ นี้</span>' : ''}
                  <button class="btn btn-outline btn-sm" onclick="window.app.viewFollowUp('${v.patientId}')">
                    <i class="fas fa-user"></i> ข้อมูลผู้ป่วย
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  // ==================== REPORTS ====================
  function renderReports(container) {
    const d = MOCK_DATA.dashboard;
    container.innerHTML = `
      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-icon green"><i class="fas fa-sign-out-alt"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.dischargedThisMonth}</span>
            <span class="stat-label">จำหน่ายเดือนนี้</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fas fa-clock"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.avgLOS}</span>
            <span class="stat-label">Avg LOS (วัน)</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red"><i class="fas fa-redo"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.readmissionRate}%</span>
            <span class="stat-label">Readmission Rate</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="fas fa-bed"></i></div>
          <div class="stat-info">
            <span class="stat-value">${d.bedOccupancy}%</span>
            <span class="stat-label">อัตราครองเตียง</span>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-chart-bar"></i> จำนวนจำหน่ายรายเดือน</span>
          </div>
          <div class="card-body">
            <div class="chart-container"><canvas id="chartMonthlyDischarge"></canvas></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-chart-doughnut"></i> โรคที่พบบ่อย (Top 5)</span>
          </div>
          <div class="card-body">
            <div class="chart-container"><canvas id="chartTopDiagnosis"></canvas></div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-phone-alt"></i> สรุปการติดตามผล</span>
          </div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div style="text-align:center;padding:16px;background:var(--success-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:700;color:var(--success)">94%</div>
                <div style="font-size:12px;color:var(--gray-600)">อัตราติดตามผลสำเร็จ</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--info-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:700;color:var(--info)">48</div>
                <div style="font-size:12px;color:var(--gray-600)">ครั้งที่ติดตามเดือนนี้</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--warning-light);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:700;color:var(--warning)">5</div>
                <div style="font-size:12px;color:var(--gray-600)">เยี่ยมบ้านเดือนนี้</div>
              </div>
              <div style="text-align:center;padding:16px;background:var(--accent-lighter);border-radius:var(--radius-md)">
                <div style="font-size:28px;font-weight:700;color:var(--accent)">89%</div>
                <div style="font-size:12px;color:var(--gray-600)">ความพึงพอใจผู้ป่วย</div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-chart-line"></i> Readmission Rate</span>
          </div>
          <div class="card-body">
            <div class="chart-container"><canvas id="chartReadmission"></canvas></div>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const ctx1 = document.getElementById('chartMonthlyDischarge');
      if (ctx1) {
        charts.monthly = new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: d.dischargeByMonth.map(m => m.month),
            datasets: [{
              label: 'จำนวนจำหน่าย',
              data: d.dischargeByMonth.map(m => m.count),
              backgroundColor: 'rgba(15, 118, 110, 0.7)',
              borderRadius: 6,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
        });
      }

      const ctx2 = document.getElementById('chartTopDiagnosis');
      if (ctx2) {
        charts.diagnosis = new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: d.topDiagnosis.map(t => t.name),
            datasets: [{
              data: d.topDiagnosis.map(t => t.count),
              backgroundColor: ['#0f766e', '#1e40af', '#7c3aed', '#d97706', '#dc2626'],
            }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Prompt', size: 11 } } } } },
        });
      }

      const ctx3 = document.getElementById('chartReadmission');
      if (ctx3) {
        charts.readmission = new Chart(ctx3, {
          type: 'line',
          data: {
            labels: d.readmissionByMonth.map(m => m.month),
            datasets: [{
              label: 'Readmission',
              data: d.readmissionByMonth.map(m => m.count),
              borderColor: '#dc2626',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              tension: 0.3,
              fill: true,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } },
        });
      }
    }, 100);
  }

  // ==================== OPD (MOCKUP) ====================
  function renderOPD(container) {
    const opd = MOCK_DATA.opd;
    container.innerHTML = `
      <div style="margin-bottom:16px;padding:12px 16px;background:var(--info-light);border-radius:var(--radius-md);font-size:13px;color:var(--info)">
        <i class="fas fa-info-circle"></i> หน้านี้เป็น Mockup แสดงข้อมูลแผนก OPD
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fas fa-users"></i></div>
          <div class="stat-info"><span class="stat-value">${opd.todayPatients}</span><span class="stat-label">ผู้ป่วยวันนี้</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fas fa-hourglass-half"></i></div>
          <div class="stat-info"><span class="stat-value">${opd.waitingQueue}</span><span class="stat-label">รอรับบริการ</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fas fa-check"></i></div>
          <div class="stat-info"><span class="stat-value">${opd.completed}</span><span class="stat-label">ตรวจแล้ว</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal"><i class="fas fa-clock"></i></div>
          <div class="stat-info"><span class="stat-value">${opd.avgWaitTime}</span><span class="stat-label">เวลารอเฉลี่ย</span></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-clinic-medical"></i> คลินิกวันนี้</span>
        </div>
        <div class="card-body no-padding">
          ${opd.clinics.map(c => `
            <div class="clinic-card">
              <div class="clinic-icon"><i class="fas fa-stethoscope"></i></div>
              <div class="clinic-info">
                <div class="clinic-name">${c.name}</div>
                <div class="clinic-doctor">${c.doctor}</div>
              </div>
              <div class="clinic-stats">
                <div class="clinic-stat"><div class="clinic-stat-value">${c.patients}</div><div class="clinic-stat-label">ผู้ป่วย</div></div>
                <div class="clinic-stat"><div class="clinic-stat-value" style="color:var(--warning)">${c.waiting}</div><div class="clinic-stat-label">รอตรวจ</div></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==================== ER (MOCKUP) ====================
  function renderER(container) {
    const er = MOCK_DATA.er;
    container.innerHTML = `
      <div style="margin-bottom:16px;padding:12px 16px;background:var(--info-light);border-radius:var(--radius-md);font-size:13px;color:var(--info)">
        <i class="fas fa-info-circle"></i> หน้านี้เป็น Mockup แสดงข้อมูลแผนกฉุกเฉิน
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat-card">
          <div class="stat-icon red"><i class="fas fa-ambulance"></i></div>
          <div class="stat-info"><span class="stat-value">${er.currentPatients}</span><span class="stat-label">ผู้ป่วยอยู่ใน ER</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fas fa-users"></i></div>
          <div class="stat-info"><span class="stat-value">${er.todayTotal}</span><span class="stat-label">ผู้ป่วยวันนี้ (รวม)</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fas fa-clock"></i></div>
          <div class="stat-info"><span class="stat-value">${er.avgWaitTime}</span><span class="stat-label">เวลารอเฉลี่ย</span></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-heartbeat"></i> Triage Level</span>
        </div>
        <div class="card-body">
          <div class="triage-cards">
            <div class="triage-card resuscitation"><div class="triage-value">${er.criticalLevel.resuscitation}</div><div class="triage-label">Resuscitation</div></div>
            <div class="triage-card emergency"><div class="triage-value">${er.criticalLevel.emergency}</div><div class="triage-label">Emergency</div></div>
            <div class="triage-card urgent"><div class="triage-value">${er.criticalLevel.urgent}</div><div class="triage-label">Urgent</div></div>
            <div class="triage-card lessUrgent"><div class="triage-value">${er.criticalLevel.lessUrgent}</div><div class="triage-label">Less Urgent</div></div>
            <div class="triage-card nonUrgent"><div class="triage-value">${er.criticalLevel.nonUrgent}</div><div class="triage-label">Non Urgent</div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-list"></i> ผู้ป่วยใน ER</span>
        </div>
        <div class="card-body no-padding">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>ชื่อ-สกุล</th><th>อายุ</th><th>Triage</th><th>อาการ</th><th>เวลามาถึง</th><th>สถานะ</th></tr>
              </thead>
              <tbody>
                ${er.patients.map(p => {
                  const triageColors = { emergency: 'badge-danger', urgent: 'badge-warning', lessUrgent: 'badge-success', nonUrgent: 'badge-info' };
                  return `
                    <tr>
                      <td><strong>${p.name}</strong></td>
                      <td>${p.age} ปี</td>
                      <td><span class="badge ${triageColors[p.triage] || 'badge-secondary'}">${p.triage}</span></td>
                      <td>${p.chief}</td>
                      <td>${p.time}</td>
                      <td>${p.status}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== WARD (MOCKUP) ====================
  function renderWard(container) {
    const wm = MOCK_DATA.wardManagement;
    container.innerHTML = `
      <div style="margin-bottom:16px;padding:12px 16px;background:var(--info-light);border-radius:var(--radius-md);font-size:13px;color:var(--info)">
        <i class="fas fa-info-circle"></i> หน้านี้เป็น Mockup แสดงข้อมูลหอผู้ป่วย
      </div>

      <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="stat-card">
          <div class="stat-icon blue"><i class="fas fa-bed"></i></div>
          <div class="stat-info"><span class="stat-value">${wm.totalBeds}</span><span class="stat-label">เตียงทั้งหมด</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange"><i class="fas fa-user-injured"></i></div>
          <div class="stat-info"><span class="stat-value">${wm.totalOccupied}</span><span class="stat-label">เตียงที่ครอง</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
          <div class="stat-info"><span class="stat-value">${wm.totalAvailable}</span><span class="stat-label">เตียงว่าง</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple"><i class="fas fa-percentage"></i></div>
          <div class="stat-info"><span class="stat-value">${wm.occupancyRate}%</span><span class="stat-label">อัตราครองเตียง</span></div>
        </div>
      </div>

      <div class="ward-grid">
        ${wm.wards.map(w => {
          const occupancyPct = Math.round((w.occupied / w.beds) * 100);
          const color = occupancyPct >= 90 ? 'red' : occupancyPct >= 70 ? 'orange' : 'green';
          return `
            <div class="ward-card">
              <div class="ward-name"><i class="fas fa-hospital"></i> ${w.name}</div>
              <div class="ward-stats">
                <div class="ward-stat"><div class="ward-stat-value">${w.beds}</div><div class="ward-stat-label">เตียงรวม</div></div>
                <div class="ward-stat"><div class="ward-stat-value" style="color:var(--warning)">${w.occupied}</div><div class="ward-stat-label">ครอง</div></div>
                <div class="ward-stat"><div class="ward-stat-value" style="color:var(--success)">${w.available}</div><div class="ward-stat-label">ว่าง</div></div>
              </div>
              <div style="margin-top:12px">
                <div class="progress-bar"><div class="progress-fill ${color}" style="width:${occupancyPct}%"></div></div>
                <div class="progress-info"><span class="progress-text">ครองเตียง</span><span class="progress-value">${occupancyPct}%</span></div>
              </div>
              <div style="margin-top:8px;font-size:11px;color:var(--gray-500)">
                <i class="fas fa-user-nurse"></i> พยาบาล: ${w.nurses} คน
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ==================== NOTIFICATIONS ====================
  function initNotifications() {
    const bell = document.getElementById('notificationBell');
    const panel = document.getElementById('notificationPanel');

    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('show');
      renderNotifications();
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !bell.contains(e.target)) {
        panel.classList.remove('show');
      }
    });

    document.getElementById('markAllRead').addEventListener('click', () => {
      MOCK_DATA.notifications.forEach(n => n.read = true);
      renderNotifications();
      updateNotificationCount();
    });
  }

  function renderNotifications() {
    const list = document.getElementById('notificationList');
    const icons = { urgent: 'fas fa-exclamation-circle', warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle', success: 'fas fa-check-circle' };

    list.innerHTML = MOCK_DATA.notifications.map(n => `
      <div class="notification-item ${!n.read ? 'unread' : ''}">
        <div class="notification-icon ${n.type}"><i class="${icons[n.type]}"></i></div>
        <div class="notification-body">
          <div class="notification-title">${n.title}</div>
          <div class="notification-message">${n.message}</div>
          <div class="notification-time">${n.time}</div>
        </div>
      </div>
    `).join('');
  }

  function updateNotificationCount() {
    const unread = MOCK_DATA.notifications.filter(n => !n.read).length;
    const countEl = document.getElementById('notificationCount');
    countEl.textContent = unread;
    countEl.style.display = unread > 0 ? 'flex' : 'none';
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', closeMobileMenu);
  }

  function closeMobileMenu() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  }

  // ==================== PUBLIC API ====================
  window.app = {
    navigateTo: navigateTo,
    viewPatient: (id) => {
      const patient = MOCK_DATA.patients.find(p => p.id === id);
      if (patient) navigateTo('patient-detail', { patient });
    },
    viewFollowUp: (id) => {
      const patient = MOCK_DATA.dischargedPatients.find(p => p.id === id);
      if (patient) navigateTo('followup-detail', { dischargedPatient: patient });
    },
  };

})();
