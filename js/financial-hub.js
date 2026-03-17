// js/financial-hub.js

// Financial Data
const financialData = {
    q4: {
        training: {
            budget: 250000,
            expenses: 230500,
            programs: [
                { name: "Leadership Training", budget: 80000, expenses: 72000 },
                { name: "Technical Skills", budget: 90000, expenses: 88000 },
                { name: "Onboarding Program", budget: 80000, expenses: 70500 }
            ]
        },
        events: {
            budget: 185000,
            expenses: 172000,
            programs: [
                { name: "Annual Conference", budget: 100000, expenses: 95000 },
                { name: "Team Building", budget: 40000, expenses: 38000 },
                { name: "Client Meetings", budget: 45000, expenses: 39000 }
            ]
        },
        extra: {
            budget: 107800,
            expenses: 84920,
            programs: [
                { name: "Software Licenses", budget: 45000, expenses: 42000 },
                { name: "Equipment", budget: 38000, expenses: 28920 },
                { name: "Miscellaneous", budget: 24800, expenses: 14000 }
            ]
        }
    },
    q3: {
        training: { budget: 220000, expenses: 205000 },
        events: { budget: 160000, expenses: 155000 },
        extra: { budget: 90000, expenses: 82000 }
    },
    q2: {
        training: { budget: 210000, expenses: 195000 },
        events: { budget: 150000, expenses: 148000 },
        extra: { budget: 85000, expenses: 79000 }
    },
    q1: {
        training: { budget: 200000, expenses: 185000 },
        events: { budget: 140000, expenses: 135000 },
        extra: { budget: 80000, expenses: 72000 }
    }
};

// Chart instances
let budgetVsExpenseChart, quarterlyTrendChart;
let activeModal = null;

// Make functions globally available
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const periodSelect = document.getElementById('periodSelect');
    const exportBtn = document.getElementById('exportBtn');
    const exportOptions = document.getElementById('exportOptions');
    const addBudgetBtn = document.getElementById('addBudgetBtn');
    const addBudgetModal = document.getElementById('addBudgetModal');
    const closeModal = document.getElementById('closeModal');
    const cancelBudgetBtn = document.getElementById('cancelBudgetBtn');
    const saveBudgetBtn = document.getElementById('saveBudgetBtn');
    const budgetForm = document.getElementById('budgetForm');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navDropdown = document.getElementById('navDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    
    // Current period
    let currentPeriod = 'q4';
    
    // Initialize the dashboard
    function initDashboard() {
        updateSummaryCards(currentPeriod);
        updateFinancialTable(currentPeriod);
        initializeCharts();
        updateLastUpdated();
        animateCards();
    }
    
    // Update summary cards
    function updateSummaryCards(period) {
        const data = financialData[period];
        
        let totalBudget = 0;
        let totalExpenses = 0;
        
        for (const program in data) {
            totalBudget += data[program].budget;
            totalExpenses += data[program].expenses;
        }
        
        const remainingBalance = totalBudget - totalExpenses;
        const utilizationRate = ((totalExpenses / totalBudget) * 100).toFixed(1);
        
        // Update DOM elements
        document.getElementById('totalBudget').textContent = 'Ksh ' + numberWithCommas(totalBudget);
        document.getElementById('totalExpenses').textContent = 'Ksh ' + numberWithCommas(totalExpenses);
        document.getElementById('remainingBalance').textContent = 'Ksh ' + numberWithCommas(remainingBalance);
        document.getElementById('utilizationRate').textContent = utilizationRate + '%';
        
        // Update progress bar
        const progressFill = document.querySelector('.card:last-child .progress-fill');
        if (progressFill) {
            progressFill.style.width = utilizationRate + '%';
            
            // Update color based on utilization
            if (parseFloat(utilizationRate) > 95) {
                progressFill.style.backgroundColor = '#ef4444';
            } else if (parseFloat(utilizationRate) > 85) {
                progressFill.style.backgroundColor = '#f59e0b';
            } else {
                progressFill.style.backgroundColor = '#1e40af';
            }
        }
    }
    
    // Update financial table
    function updateFinancialTable(period) {
        const data = financialData[period];
        const tableBody = document.getElementById('tableBody');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        for (const program in data) {
            const programData = data[program];
            const variance = programData.budget - programData.expenses;
            const utilization = ((programData.expenses / programData.budget) * 100).toFixed(1);
            
            let status = '';
            let statusClass = '';
            
            if (utilization > 95) {
                status = 'Over Budget';
                statusClass = 'status-danger';
            } else if (utilization > 85) {
                status = 'Watch';
                statusClass = 'status-warning';
            } else {
                status = 'On Track';
                statusClass = 'status-success';
            }
            
            // Format program name
            const programName = program.charAt(0).toUpperCase() + program.slice(1) + ' Program';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${programName}</td>
                <td>Ksh ${numberWithCommas(programData.budget)}</td>
                <td>Ksh ${numberWithCommas(programData.expenses)}</td>
                <td>Ksh ${numberWithCommas(variance)}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${utilization}%</span>
                        <div class="progress-bar" style="flex-grow: 1;">
                            <div class="progress-fill" style="width: ${utilization}%; background-color: ${getStatusColor(utilization)};"></div>
                        </div>
                    </div>
                </td>
                <td><span class="${statusClass}">${status}</span></td>
            `;
            
            tableBody.appendChild(row);
        }
    }
    
    // Get status color
    function getStatusColor(utilization) {
        if (parseFloat(utilization) > 95) return '#ef4444';
        if (parseFloat(utilization) > 85) return '#f59e0b';
        return '#1e40af';
    }
    
    // Initialize charts
    function initializeCharts() {
        // Budget vs Expense Chart
        const budgetCtx = document.getElementById('budgetVsExpenseChart')?.getContext('2d');
        if (budgetCtx) {
            budgetVsExpenseChart = new Chart(budgetCtx, {
                type: 'bar',
                data: {
                    labels: ['Training', 'Events', 'Extra'],
                    datasets: [
                        {
                            label: 'Budget',
                            data: [
                                financialData.q4.training.budget,
                                financialData.q4.events.budget,
                                financialData.q4.extra.budget
                            ],
                            backgroundColor: 'rgba(30, 64, 175, 0.7)',
                            borderColor: '#1e40af',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: [
                                financialData.q4.training.expenses,
                                financialData.q4.events.expenses,
                                financialData.q4.extra.expenses
                            ],
                            backgroundColor: 'rgba(185, 28, 28, 0.7)',
                            borderColor: '#b91c1c',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'Ksh ' + numberWithCommas(value);
                                }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: '#475569' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': Ksh ' + numberWithCommas(context.parsed.y);
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Quarterly Trend Chart
        const trendCtx = document.getElementById('quarterlyTrendChart')?.getContext('2d');
        if (trendCtx) {
            quarterlyTrendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [
                        {
                            label: 'Training',
                            data: [
                                financialData.q1.training.expenses,
                                financialData.q2.training.expenses,
                                financialData.q3.training.expenses,
                                financialData.q4.training.expenses
                            ],
                            borderColor: '#1e40af',
                            backgroundColor: 'rgba(30, 64, 175, 0.1)',
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Events',
                            data: [
                                financialData.q1.events.expenses,
                                financialData.q2.events.expenses,
                                financialData.q3.events.expenses,
                                financialData.q4.events.expenses
                            ],
                            borderColor: '#b91c1c',
                            backgroundColor: 'rgba(185, 28, 28, 0.1)',
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Extra',
                            data: [
                                financialData.q1.extra.expenses,
                                financialData.q2.extra.expenses,
                                financialData.q3.extra.expenses,
                                financialData.q4.extra.expenses
                            ],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            tension: 0.3,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'Ksh ' + numberWithCommas(value);
                                }
                            },
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: { color: '#475569' }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': Ksh ' + numberWithCommas(context.parsed.y);
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Update charts when period changes
    function updateCharts(period) {
        if (budgetVsExpenseChart) {
            budgetVsExpenseChart.data.datasets[0].data = [
                financialData[period].training.budget,
                financialData[period].events.budget,
                financialData[period].extra.budget
            ];
            budgetVsExpenseChart.data.datasets[1].data = [
                financialData[period].training.expenses,
                financialData[period].events.expenses,
                financialData[period].extra.expenses
            ];
            budgetVsExpenseChart.update();
        }
    }
    
    // Save new budget
    function saveBudget() {
        const programType = document.getElementById('programType')?.value;
        const budgetName = document.getElementById('budgetName')?.value;
        const budgetAmount = document.getElementById('budgetAmount')?.value;
        const budgetQuarter = document.getElementById('budgetQuarter')?.value;
        
        if (!programType || !budgetName || !budgetAmount) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        showNotification(`Budget "${budgetName}" added successfully!`, 'success');
        
        // Close modal and reset form
        closeModal('addBudgetModal');
        if (budgetForm) budgetForm.reset();
        
        // Update last updated time
        updateLastUpdated();
    }
    
    // Refresh data
    function refreshData() {
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (!refreshBtn) return;
        
        // Show loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            updateLastUpdated();
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            refreshBtn.disabled = false;
            showNotification('Data refreshed successfully!', 'success');
        }, 1500);
    }
    
    // Export report
    function exportReport(format) {
        switch(format) {
            case 'pdf':
                generatePDF();
                break;
            case 'ppt':
                generatePPT();
                break;
            case 'excel':
                generateExcel();
                break;
            case 'csv':
                generateCSV();
                break;
        }
        
        showNotification(`${format.toUpperCase()} export started!`, 'info');
    }
    
    // Generate Excel
    function generateExcel() {
        const currentPeriod = document.getElementById('periodSelect')?.value || 'q4';
        const data = financialData[currentPeriod];
        
        // Create worksheet data
        const wsData = [
            ['Program', 'Budget (Ksh)', 'Expenses (Ksh)', 'Variance (Ksh)', 'Utilization %', 'Status'],
        ];
        
        for (const program in data) {
            const programData = data[program];
            const variance = programData.budget - programData.expenses;
            const utilization = ((programData.expenses / programData.budget) * 100).toFixed(1);
            let status = utilization > 95 ? 'Over Budget' : (utilization > 85 ? 'Watch' : 'On Track');
            
            wsData.push([
                program.charAt(0).toUpperCase() + program.slice(1) + ' Program',
                programData.budget,
                programData.expenses,
                variance,
                utilization,
                status
            ]);
        }
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Budget Analysis");
        
        // Generate and download file
        XLSX.writeFile(wb, `budget_analysis_${currentPeriod}.xlsx`);
    }
    
    // Generate CSV
    function generateCSV() {
        const currentPeriod = document.getElementById('periodSelect')?.value || 'q4';
        const data = financialData[currentPeriod];
        
        let csvContent = "Program,Budget (Ksh),Expenses (Ksh),Variance (Ksh),Utilization %,Status\n";
        
        for (const program in data) {
            const programData = data[program];
            const variance = programData.budget - programData.expenses;
            const utilization = ((programData.expenses / programData.budget) * 100).toFixed(1);
            let status = utilization > 95 ? 'Over Budget' : (utilization > 85 ? 'Watch' : 'On Track');
            
            csvContent += `"${program.charAt(0).toUpperCase() + program.slice(1)} Program",${programData.budget},${programData.expenses},${variance},${utilization},"${status}"\n`;
        }
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `budget_analysis_${currentPeriod}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Generate PDF
    function generatePDF() {
        showNotification('PDF generation would be implemented here', 'info');
    }
    
    // Generate PowerPoint
    function generatePPT() {
        showNotification('PowerPoint generation would be implemented here', 'info');
    }
    
    // Modal functions
    function openModal(modalId) {
        if (activeModal) closeModal(activeModal);
        
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            activeModal = modalId;
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            activeModal = null;
            document.body.style.overflow = 'auto';
        }
    }
    
    // Hamburger menu functions
    function toggleHamburger() {
        if (hamburgerBtn && navDropdown) {
            hamburgerBtn.classList.toggle('active');
            navDropdown.classList.toggle('active');
        }
    }
    
    function closeHamburger() {
        if (hamburgerBtn && navDropdown) {
            hamburgerBtn.classList.remove('active');
            navDropdown.classList.remove('active');
        }
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburgerBtn && navDropdown) {
            if (!hamburgerBtn.contains(event.target) && !navDropdown.contains(event.target)) {
                closeHamburger();
            }
        }
        
        // Close export menu when clicking outside
        if (exportBtn && exportOptions) {
            if (!exportBtn.contains(event.target) && !exportOptions.contains(event.target)) {
                exportOptions.classList.remove('show');
            }
        }
    });
    
    // Logout
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }
    
    // Update last updated timestamp
    function updateLastUpdated() {
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                hour: '2-digit', 
                minute: '2-digit'
            };
            lastUpdatedEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        // Remove existing notifications
        const existingNotifications = container.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'notificationSlideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Animate cards on load
    function animateCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s, transform 0.5s';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Helper function to format numbers with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Event Listeners
    if (periodSelect) {
        periodSelect.addEventListener('change', function() {
            currentPeriod = this.value;
            updateSummaryCards(currentPeriod);
            updateFinancialTable(currentPeriod);
            updateCharts(currentPeriod);
        });
    }
    
    if (exportBtn && exportOptions) {
        exportBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            exportOptions.classList.toggle('show');
        });
        
        // Export options
        document.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', function() {
                const format = this.getAttribute('data-format');
                exportReport(format);
                exportOptions.classList.remove('show');
            });
        });
    }
    
    if (addBudgetBtn && addBudgetModal) {
        addBudgetBtn.addEventListener('click', () => openModal('addBudgetModal'));
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => closeModal('addBudgetModal'));
    }
    
    if (cancelBudgetBtn) {
        cancelBudgetBtn.addEventListener('click', () => {
            closeModal('addBudgetModal');
            if (budgetForm) budgetForm.reset();
        });
    }
    
    if (saveBudgetBtn) {
        saveBudgetBtn.addEventListener('click', saveBudget);
    }
    
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', refreshData);
    }
    
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleHamburger();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            showNotification('No new notifications', 'info');
        });
    }
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (activeModal) {
                closeModal(activeModal);
            }
            closeHamburger();
        }
    });
    
    // Initialize
    initDashboard();
});

// Export functions for global use (if needed by other scripts)
window.toggleHamburger = function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navDropdown = document.getElementById('navDropdown');
    if (hamburgerBtn && navDropdown) {
        hamburgerBtn.classList.toggle('active');
        navDropdown.classList.toggle('active');
    }
};

window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
};