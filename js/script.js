// js/script.js - Main application script

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeCharts();
    initializeFileUpload();
    setupNavigation();
    setupSearch();
    setupNotifications();
    setupQuickActions();
    setupLogout();
    setupHamburgerMenu();
    loadDashboardData();
    checkLoginStatus();
    initializeBudgetHubConnection();
    
    // Add animation styles
    addAnimationStyles();
});

// ============================
// CHART INITIALIZATION
// ============================

function initializeCharts() {
    // Cost Analysis Chart
    const costCtx = document.getElementById('costChart')?.getContext('2d');
    if (costCtx) {
        new Chart(costCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'HR Costs',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 30000, 28000, 32000, 40000],
                    borderColor: '#1e40af',
                    backgroundColor: 'rgba(30, 64, 175, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Admin Costs',
                    data: [8000, 12000, 10000, 15000, 18000, 22000, 20000, 25000, 23000, 21000, 24000, 28000],
                    borderColor: '#b91c1c',
                    backgroundColor: 'rgba(185, 28, 28, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1e293b',
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: Ksh ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'Ksh ' + value.toLocaleString();
                            }
                        },
                        grid: { color: '#e2e8f0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
}

// ============================
// FILE UPLOAD FUNCTIONALITY
// ============================

function initializeFileUpload() {
    const fileUploads = document.querySelectorAll('.file-upload');
    
    fileUploads.forEach(upload => {
        if (!upload) return;
        
        upload.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    showUploadSuccess(file.name);
                }
            };
            input.click();
        });
        
        // Drag and drop functionality
        upload.addEventListener('dragover', function(e) {
            e.preventDefault();
            upload.style.borderColor = '#1e40af';
            upload.style.backgroundColor = '#dbeafe';
        });
        
        upload.addEventListener('dragleave', function() {
            upload.style.borderColor = '#e2e8f0';
            upload.style.backgroundColor = 'transparent';
        });
        
        upload.addEventListener('drop', function(e) {
            e.preventDefault();
            upload.style.borderColor = '#e2e8f0';
            upload.style.backgroundColor = 'transparent';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                showUploadSuccess(file.name);
            }
        });
    });
}

function showUploadSuccess(filename) {
    showToast(`File "${filename}" uploaded successfully!`, 'success');
}

// ============================
// NAVIGATION & SIDEBAR
// ============================

function setupNavigation() {
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page) {
            const pageFile = `${page}.html`;
            if (pageFile === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
        
        // Add click handler
        item.addEventListener('click', function(e) {
            const page = this.getAttribute('data-page');
            if (page) {
                e.preventDefault();
                navigateToPage(page);
            }
        });
    });
}

function navigateToPage(page) {
    const pageMap = {
        'task-centre': 'pages/task-centre.html',
        'training': 'pages/training.html',
        'contracts': 'pages/contracts.html',
        'hr-letters': 'pages/hr-letters.html',
        'events': 'pages/upcoming-events.html',
        'cost-analyzer': 'pages/cost-analyzer.html',
        'financial-hub': 'pages/financial-hub.html',
        'reports': 'pages/reports.html',
        'employees': 'pages/employees.html',
        'settings': 'pages/settings.html'
    };
    
    showToast(`Loading ${page.replace('-', ' ')}...`, 'info');
    closeHamburger();
    
    setTimeout(() => {
        if (pageMap[page]) {
            window.location.href = pageMap[page];
        } else {
            showToast('Page under development', 'info');
        }
    }, 500);
}

// ============================
// HAMBURGER MENU
// ============================

function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navDropdown = document.getElementById('navDropdown');
    
    if (hamburgerBtn && navDropdown) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navDropdown.classList.toggle('active');
        });
        
        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburgerBtn.contains(e.target) && !navDropdown.contains(e.target)) {
                closeHamburger();
            }
        });
    }
}

function closeHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const dropdown = document.getElementById('navDropdown');
    if (btn && dropdown) {
        btn.classList.remove('active');
        dropdown.classList.remove('active');
    }
}

// ============================
// SEARCH FUNCTIONALITY
// ============================

function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                performSearch(this.value.trim());
                this.value = '';
            }
        });
    }
}

function performSearch(query) {
    showToast(`Searching for: ${query}`, 'info');
    // Implement actual search functionality here
}

// ============================
// NOTIFICATIONS
// ============================

function setupNotifications() {
    const notificationBell = document.querySelector('.notifications');
    const notificationBadge = document.querySelector('.badge');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            toggleNotifications();
            
            // Mark as read
            if (notificationBadge && notificationBadge.textContent !== '0') {
                setTimeout(() => {
                    notificationBadge.textContent = '0';
                    notificationBadge.style.display = 'none';
                }, 300);
            }
        });
    }
}

function toggleNotifications() {
    const modal = document.getElementById('notificationsModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal functionality
document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ============================
// QUICK ACTIONS
// ============================

function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionText = this.querySelector('span')?.textContent || 'Action';
            handleQuickAction(actionText);
        });
    });
    
    // Export chart button
    const exportBtn = document.getElementById('exportChartBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportChartData);
    }
}

function handleQuickAction(action) {
    switch(action) {
        case 'Upload Document':
            triggerFileUpload();
            break;
        case 'Send HR Letter':
            window.location.href = 'pages/hr-letters.html';
            break;
        case 'Schedule Event':
            window.location.href = 'pages/upcoming-events.html';
            break;
        case 'Generate Report':
            generateReport();
            break;
        default:
            showToast(`${action} action triggered`, 'info');
    }
}

function triggerFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showUploadSuccess(file.name);
        }
    };
    input.click();
}

function generateReport() {
    showToast('Generating report...', 'info');
    setTimeout(() => {
        showToast('Report generated successfully!', 'success');
    }, 2000);
}

function exportChartData() {
    showToast('Exporting chart data...', 'info');
    
    setTimeout(() => {
        const chart = document.getElementById('costChart');
        if (chart) {
            const link = document.createElement('a');
            link.download = `Cost_Analysis_${new Date().toISOString().split('T')[0]}.png`;
            link.href = chart.toDataURL('image/png', 1.0);
            link.click();
            showToast('Chart exported successfully!', 'success');
        }
    }, 1000);
}

// ============================
// DASHBOARD DATA
// ============================

function loadDashboardData() {
    // Animate counters
    animateCounter('totalProjects', 24);
    animateCounter('activeEmployees', 156);
    animateCounter('monthlyCost', 1200000, 'Ksh ', 'formatMoney');
    animateCounter('completionRate', 94, '', '%');
}

function animateCounter(elementId, target, prefix = '', format = 'number') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (format === 'formatMoney' && target >= 1000000) {
                element.textContent = `${prefix}${(target/1000000).toFixed(1)}M`;
            } else if (format === 'formatMoney' && target >= 1000) {
                element.textContent = `${prefix}${(target/1000).toFixed(0)}K`;
            } else {
                element.textContent = `${prefix}${target}`;
            }
            clearInterval(timer);
        } else {
            if (format === 'formatMoney' && target >= 1000000) {
                element.textContent = `${prefix}${(current/1000000).toFixed(1)}M`;
            } else if (format === 'formatMoney' && target >= 1000) {
                element.textContent = `${prefix}${Math.floor(current/1000)}K`;
            } else {
                element.textContent = `${prefix}${Math.floor(current)}`;
            }
        }
    }, 20);
}

// ============================
// AUTHENTICATION & LOGOUT
// ============================

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    // If no token and not on login/register page, redirect to login
    if (!token && !currentPage.includes('login.html') && !currentPage.includes('register.html')) {
        window.location.href = 'pages/login.html';
        return;
    }
    
    // If logged in, update user info
    if (token) {
        updateUserInfo();
    }
}

function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'Admin User';
    const userRole = localStorage.getItem('userRole') || 'HR Administrator';
    
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1e40af&color=fff" alt="User">
            <div class="user-info">
                <h4>${userName}</h4>
                <p>${userRole}</p>
            </div>
        `;
    }
}

function performLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        
        showToast('Logging out...', 'info');
        
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 1000);
    }
}

// ============================
// BUDGET HUB INTEGRATION
// ============================

function initializeBudgetHubConnection() {
    // Check if budget hub storage exists
    if (!localStorage.getItem('budgetHub_budgets')) {
        localStorage.setItem('budgetHub_budgets', JSON.stringify([]));
        localStorage.setItem('budgetHub_training_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_events_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_extra_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_recent_updates', JSON.stringify([]));
    }
}

function getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('training')) return 'training';
    if (path.includes('events') || path.includes('upcoming-events')) return 'events';
    if (path.includes('extra')) return 'extra';
    return 'other';
}

function addCostToBudgetHub(itemName, amount, date = new Date().toISOString()) {
    const pageType = getCurrentPageType();
    
    const cost = {
        id: Date.now(),
        type: pageType,
        item: itemName,
        amount: parseFloat(amount),
        date: date,
        timestamp: new Date().toISOString()
    };
    
    // Save to specific page costs
    let costs = JSON.parse(localStorage.getItem(`budgetHub_${pageType}_costs`) || '[]');
    costs.push(cost);
    localStorage.setItem(`budgetHub_${pageType}_costs`, JSON.stringify(costs));
    
    // Add to recent updates
    let updates = JSON.parse(localStorage.getItem('budgetHub_recent_updates') || '[]');
    updates.unshift({
        ...cost,
        page: pageType.charAt(0).toUpperCase() + pageType.slice(1)
    });
    
    if (updates.length > 50) updates = updates.slice(0, 50);
    localStorage.setItem('budgetHub_recent_updates', JSON.stringify(updates));
    
    showToast(`Added to Budget Hub: ${itemName} - Ksh ${amount}`, 'success');
    
    return cost;
}

// ============================
// TOAST NOTIFICATIONS
// ============================

function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    
    const icons = {
        success: 'check-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    
    const colors = {
        success: '#10b981',
        info: '#1e40af',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type]}" style="color: ${colors[type]};"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        color: #1e293b;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
        border-left: 4px solid ${colors[type]};
        animation: toastSlideIn 0.3s ease-out;
        max-width: 350px;
        font-size: 14px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================
// ANIMATION STYLES
// ============================

function addAnimationStyles() {
    if (document.getElementById('animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes toastSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes slideTitle {
            0% { transform: translateX(100%); opacity: 0; }
            5% { opacity: 0.9; }
            95% { opacity: 0.9; }
            100% { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .toast-notification {
            transition: all 0.3s ease;
        }
        
        .nav-item.active {
            background: rgba(30, 64, 175, 0.1);
            border-color: #1e40af;
        }
        
        .nav-item.active span {
            color: #1e40af;
        }
        
        .nav-item.active i {
            color: #1e40af;
        }
    `;
    
    document.head.appendChild(style);
}

// ============================
// EXPORT FUNCTIONS FOR GLOBAL USE
// ============================

// Make functions available globally
window.addCostToBudgetHub = addCostToBudgetHub;
window.showToast = showToast;
window.performLogout = performLogout;