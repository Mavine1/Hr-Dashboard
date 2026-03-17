// Initialize Chart.js for cost analysis
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard chart
    if (document.getElementById('costChart')) {
        initCostChart();
    }
    
    // Initialize file upload functionality
    initFileUpload();
    
    // Initialize sidebar active state
    initSidebar();
    
    // Initialize notifications
    initNotifications();
});

// Cost Analysis Chart
function initCostChart() {
    const ctx = document.getElementById('costChart').getContext('2d');
    const costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'HR Costs',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 30000, 28000, 32000, 40000],
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Admin Costs',
                data: [8000, 12000, 10000, 15000, 18000, 22000, 20000, 25000, 23000, 21000, 24000, 28000],
                borderColor: '#1cc88a',
                backgroundColor: 'rgba(28, 200, 138, 0.1)',
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
                    }
                }
            }
        }
    });
}

// File Upload Functionality
function initFileUpload() {
    const fileUploads = document.querySelectorAll('.file-upload');
    
    fileUploads.forEach(upload => {
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
            upload.style.borderColor = '#4e73df';
            upload.style.backgroundColor = '#f8f9fe';
        });
        
        upload.addEventListener('dragleave', function() {
            upload.style.borderColor = '#e0e6ef';
            upload.style.backgroundColor = 'transparent';
        });
        
        upload.addEventListener('drop', function(e) {
            e.preventDefault();
            upload.style.borderColor = '#e0e6ef';
            upload.style.backgroundColor = 'transparent';
            
            const file = e.dataTransfer.files[0];
            if (file) {
                showUploadSuccess(file.name);
            }
        });
    });
}

function showUploadSuccess(filename) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'upload-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>File "${filename}" uploaded successfully!</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1cc88a;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Sidebar Active State
function initSidebar() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

// Notifications
function initNotifications() {
    const notificationBell = document.querySelector('.notifications');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            showNotifications();
        });
    }
}

function showNotifications() {
    // In a real app, this would fetch notifications from an API
    const notifications = [
        { id: 1, text: 'New training request from John Doe', time: '5 min ago' },
        { id: 2, text: 'Vendor contract expiring in 7 days', time: '1 hour ago' },
        { id: 3, text: 'Upcoming event: Team Building', time: '2 hours ago' }
    ];
    
    // Create notifications dropdown
    let dropdown = document.querySelector('.notifications-dropdown');
    if (dropdown) {
        dropdown.remove();
        return;
    }
    
    dropdown = document.createElement('div');
    dropdown.className = 'notifications-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <h4>Notifications</h4>
            <span class="mark-read">Mark all as read</span>
        </div>
        <div class="dropdown-content">
            ${notifications.map(notif => `
                <div class="notification-item">
                    <div class="notification-dot"></div>
                    <div class="notification-text">
                        <p>${notif.text}</p>
                        <small>${notif.time}</small>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    dropdown.style.cssText = `
        position: absolute;
        top: 40px;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        width: 300px;
        z-index: 1000;
    `;
    
    document.querySelector('.notifications').appendChild(dropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!dropdown.contains(e.target) && !notificationBell.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Export Data Functionality
function exportToExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let row of rows) {
        let cols = row.querySelectorAll('td, th');
        let rowData = [];
        
        for (let col of cols) {
            rowData.push(col.innerText);
        }
        
        csv.push(rowData.join(','));
    }
    
    // Download CSV file
    const csvContent = "data:text/csv;charset=utf-8," + csv.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
const firebaseConfig = {
    apiKey: "AIzaSyYOUR_API_KEY_HERE",
    authDomain: "hr-admin.firebaseapp.com",
    projectId: "hr-admin",
    storageBucket: "hr-admin.appspot.com",
    messagingSenderId: "0702636137",
    appId: "1:0702636137:web:abcdef123456"
};// In your existing navigation or settings
function logoutUser() {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Sign out from Firebase if used
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Add logout button event listener
document.getElementById('logoutBtn').addEventListener('click', logoutUser);
// Initialize Firebase
// script.js - Add this function

function setupLogout() {
    const logoutLink = document.querySelector('a[href="pages/login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear all stored data
            localStorage.clear();
            sessionStorage.clear();
            
            // Show logout message
            alert('You have been logged out successfully.');
            
            // Redirect to login page
            window.location.href = 'pages/login.html';
        });
    }
}

// Call this function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupLogout();
    
    // Also check if user is logged in
    checkLoginStatus();
});

function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;
    
    // If not logged in and trying to access protected pages, redirect to login
    if (!token && !currentPage.includes('login.html') && !currentPage.includes('register.html')) {
        window.location.href = 'pages/login.html';
        return;
    }
    
    // If logged in, update user info in sidebar
    if (token) {
        updateUserInfo();
    }
}

function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'Employee';
    
    // Update the user profile section
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff" alt="User">
            <div>
                <h4>${userName}</h4>
                <p>${userRole}</p>
            </div>
        `;
    }
}// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
});

function performLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'pages/login.html';
    }
}// Add this to your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
});

function performLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'pages/login.html';
    }
}// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();

    // Update user info in sidebar
    updateUserInfo();

    // Setup logout link
    setupLogoutLink();
});

function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname;

    // If there's no token and we're not on the login or register page, redirect to login
    if (!token && !currentPage.includes('login.html') && !currentPage.includes('register.html')) {
        window.location.href = 'pages/login.html';
        return;
    }

    // If there's a token and we're on the login page, redirect to dashboard (index.html)
    if (token && currentPage.includes('login.html')) {
        window.location.href = '../index.html'; // Adjust if needed
    }
}

function updateUserInfo() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const userName = localStorage.getItem('userName') || 'User';
    const userRole = localStorage.getItem('userRole') || 'Employee';
    const userPhoto = localStorage.getItem('userPhoto') || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=667eea&color=fff`;

    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <img src="${userPhoto}" alt="User">
            <div>
                <h4>${userName}</h4>
                <p>${userRole}</p>
            </div>
        `;
    }
}

function setupLogoutLink() {
    // Find the logout link by its href
    const logoutLink = document.querySelector('a[href="pages/login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = 'pages/login.html';
            }
        });
    }
}

// Other existing code for charts, etc. can be below or above, but make sure it doesn't interfere.
// Initialize Chart.js for cost analysis
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard chart
    if (document.getElementById('costChart')) {
        initCostChart();
    }
    
    // Initialize file upload functionality
    initFileUpload();
    
    // Initialize sidebar active state
    initSidebar();
    
    // Initialize notifications
    initNotifications();
});// script.js - Add this at the end of your existing file

// Logout Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
    
    // Check if user is logged in
    checkLoginStatus();
});

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
    const userRole = localStorage.getItem('userRole') || 'HR Tech';
    
    // Update the user profile section
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.innerHTML = `
            <img src="${localStorage.getItem('userPhoto') || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=667eea&color=fff'}" alt="User">
            <div>
                <h4>${userName}</h4>
                <p>${userRole}</p>
            </div>
        `;
    }
}

function performLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear all stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userDepartment');
        localStorage.removeItem('userPhoto');
        sessionStorage.clear();
        
        // Show logout message
        alert('You have been logged out successfully.');
        
        // Redirect to login page
        window.location.href = 'pages/login.html';
    }
}// script.js - Enhanced version

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js for cost analysis
    initializeCharts();
    
    // Setup sidebar navigation active states
    setupNavigation();
    
    // Setup search functionality
    setupSearch();
    
    // Setup notification bell
    setupNotifications();
    
    // Setup quick action buttons
    setupQuickActions();
    
    // Setup logout functionality
    setupLogout();
    
    // Load dynamic data
    loadDashboardData();
    
    // Setup responsive behaviors
    setupResponsive();
});

function initializeCharts() {
    // Cost Analysis Chart
    const costCtx = document.getElementById('costChart')?.getContext('2d');
    if (costCtx) {
        new Chart(costCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Cost (Ksh)',
                    data: [35000, 38000, 42000, 45000, 41000, 42580, 48000, 52000, 51000, 49000, 53000, 55000],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Ksh ' + context.parsed.y.toLocaleString();
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
                        }
                    }
                }
            }
        });
    }
}

function setupNavigation() {
    // Highlight current page in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
        
        // Add click handlers
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                alert(`Searching for: ${this.value}`);
                this.value = '';
            }
        });
    }
}

function setupNotifications() {
    const notificationBell = document.querySelector('.notifications');
    const notificationBadge = document.querySelector('.badge');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // Simulate marking notifications as read
            if (notificationBadge && notificationBadge.textContent !== '0') {
                setTimeout(() => {
                    notificationBadge.textContent = '0';
                    notificationBadge.style.display = 'none';
                    showToast('All notifications marked as read');
                }, 300);
            }
        });
    }
}

function setupQuickActions() {
    const actionButtons = document.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            
            switch(actionText) {
                case 'Upload Document':
                    showModal('Upload Document', 'Select a file to upload...');
                    break;
                case 'Send HR Letter':
                    window.location.href = 'pages/hr-letters.html';
                    break;
                case 'Schedule Event':
                    showModal('Schedule Event', 'Choose date and time for your event...');
                    break;
                case 'Generate Report':
                    generateReport();
                    break;
                default:
                    showToast(`${actionText} action triggered`);
            }
        });
    });
}

function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('actionModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'actionModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                    <button class="btn-primary" style="margin-top: 20px;">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'flex';
}

function generateReport() {
    showToast('Generating report... Please wait.');
    // Simulate report generation
    setTimeout(() => {
        showToast('Report generated successfully!');
    }, 2000);
}

function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 5px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                // Clear all stored data
                localStorage.clear();
                sessionStorage.clear();
                
                // Redirect to login page
                window.location.href = 'pages/login.html';
            }
        });
    }
}

function loadDashboardData() {
    // Update stats with animation
    const stats = {
        projects: 12,
        events: 7,
        cost: 42580,
        contracts: 3
    };
    
    // Animate counting up
    Object.keys(stats).forEach((key, index) => {
        const element = document.querySelector(`[id="${key}"]`);
        if (element) {
            animateCount(element, stats[key]);
        }
    });
}

function animateCount(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

function setupResponsive() {
    // Handle window resize for responsive behavior
    window.addEventListener('resize', function() {
        // Adjust layout based on screen size
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            if (window.innerWidth < 768) {
                actionButtons.style.flexDirection = 'column';
            } else {
                actionButtons.style.flexDirection = 'row';
            }
        }
    });
    
    // Initialize responsive state
    window.dispatchEvent(new Event('resize'));
}

// Add CSS for modal (if not in style.css)
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    @media (max-width: 768px) {
        .content-grid {
            grid-template-columns: 1fr !important;
        }
        
        .full-width {
            grid-column: 1 !important;
        }
    }
`;
document.head.appendChild(style);
// ============================
// BUDGET HUB INTEGRATION CODE
// Add this to training.html, events.html, extra.html
// ============================

// Initialize storage connection
function initializeBudgetHubConnection() {
    // Check if budget hub storage exists
    if (!localStorage.getItem('budgetHub_budgets')) {
        // Initialize if doesn't exist
        localStorage.setItem('budgetHub_budgets', JSON.stringify([]));
        localStorage.setItem('budgetHub_training_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_events_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_extra_costs', JSON.stringify([]));
        localStorage.setItem('budgetHub_recent_updates', JSON.stringify([]));
    }
    
    console.log('Budget Hub integration initialized');
}

// Get current page type based on URL or page title
function getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('training')) return 'training';
    if (path.includes('events')) return 'events';
    if (path.includes('extra')) return 'extra';
    return 'other';
}

// Add cost from current page
function addCostToBudgetHub(itemName, amount, date = new Date().toISOString()) {
    const pageType = getCurrentPageType();
    
    // Create cost object
    const cost = {
        id: Date.now(),
        type: pageType,
        item: itemName,
        amount: parseFloat(amount),
        date: date,
        timestamp: new Date().toISOString()
    };
    
    // Get existing costs
    let costs = JSON.parse(localStorage.getItem(`budgetHub_${pageType}_costs`) || '[]');
    costs.push(cost);
    
    // Save back to localStorage
    localStorage.setItem(`budgetHub_${pageType}_costs`, JSON.stringify(costs));
    
    // Add to recent updates
    let updates = JSON.parse(localStorage.getItem('budgetHub_recent_updates') || '[]');
    updates.unshift({
        ...cost,
        page: pageType.charAt(0).toUpperCase() + pageType.slice(1) + ' Page'
    });
    
    // Keep only last 50 updates
    if (updates.length > 50) updates = updates.slice(0, 50);
    localStorage.setItem('budgetHub_recent_updates', JSON.stringify(updates));
    
    // Show notification
    showBudgetHubNotification(`Cost added to Budget Hub: ${itemName} - Ksh ${amount}`);
    
    return cost;
}

// Get current page total from budget hub
function getCurrentPageTotal() {
    const pageType = getCurrentPageType();
    const costs = JSON.parse(localStorage.getItem(`budgetHub_${pageType}_costs`) || '[]');
    return costs.reduce((sum, cost) => sum + cost.amount, 0);
}

// Get current page costs
function getCurrentPageCosts() {
    const pageType = getCurrentPageType();
    return JSON.parse(localStorage.getItem(`budgetHub_${pageType}_costs`) || '[]');
}

// Show notification
function showBudgetHubNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(90deg, #4361ee, #3a0ca3);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Add CSS for animations if not already present
if (!document.getElementById('budgetHub-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'budgetHub-notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeBudgetHubConnection();
    
    // Add Budget Hub link to navigation (optional)
    addBudgetHubLink();
    
    // Display current page total (optional)
    displayCurrentPageTotal();
});

// Add Budget Hub link to navigation
function addBudgetHubLink() {
    // Find navigation element and add link to budget hub
    const nav = document.querySelector('nav, .navbar, .header, .navigation') || document.body;
    
    const hubLink = document.createElement('a');
    hubLink.href = 'budget.html'; // Change to your budget hub page URL
    hubLink.innerHTML = '<i class="fas fa-chart-pie"></i> Budget Hub';
    hubLink.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(90deg, #4361ee, #3a0ca3);
        color: white;
        padding: 8px 15px;
        border-radius: 8px;
        text-decoration: none;
        margin-left: 10px;
        transition: all 0.3s;
    `;
    
    hubLink.onmouseover = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(67, 97, 238, 0.4)';
    };
    
    hubLink.onmouseout = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    };
    
    // Try to add to navigation
    if (nav) {
        nav.appendChild(hubLink);
    }
}

// Display current page total
function displayCurrentPageTotal() {
    const total = getCurrentPageTotal();
    
    // Create total display element
    const totalDisplay = document.createElement('div');
    totalDisplay.id = 'budgetHub-total-display';
    totalDisplay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(67, 97, 238, 0.5);
        border-radius: 12px;
        padding: 15px;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        min-width: 200px;
    `;
    
    totalDisplay.innerHTML = `
        <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 5px;">Current Page Total</div>
        <div style="font-size: 1.5rem; font-weight: bold; color: #4cc9f0;">Ksh ${numberWithCommas(total.toFixed(0))}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 5px;">
            <i class="fas fa-sync-alt"></i> Synced with Budget Hub
        </div>
    `;
    
    document.body.appendChild(totalDisplay);
}

// Helper function to format numbers with commas
function numberWithCommas(x) {
    if (x === undefined || x === null) return '0';
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============================
// EXAMPLE USAGE ON OTHER PAGES
// ============================
/*
// When user adds a cost on training.html:
function addTrainingCost() {
    const itemName = document.getElementById('trainingItem').value;
    const amount = document.getElementById('trainingAmount').value;
    
    if (itemName && amount) {
        // Add to budget hub
        const cost = addCostToBudgetHub(itemName, amount);
        
        // Also save to your own page's storage if needed
        saveToLocalTrainingData(itemName, amount);
        
        // Clear form
        document.getElementById('trainingItem').value = '';
        document.getElementById('trainingAmount').value = '';
        
        // Update display
        updateTrainingDisplay();
    }
}

// On events.html:
function addEventCost() {
    const itemName = document.getElementById('eventName').value;
    const amount = document.getElementById('eventCost').value;
    
    if (itemName && amount) {
        addCostToBudgetHub(itemName, amount);
        // ... rest of your code
    }
}
*/