// settings-manager.js

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get current user info from your existing system
    const currentUser = getCurrentUser();
    
    // Initialize settings UI
    initSettingsUI(currentUser);
});

function getCurrentUser() {
    // This should sync with your existing user system
    // Example: Get from localStorage or session
    return {
        id: localStorage.getItem('userId'),
        name: localStorage.getItem('userName'),
        role: localStorage.getItem('userRole'),
        email: localStorage.getItem('userEmail')
    };
}

function initSettingsUI(user) {
    const settingsContent = document.getElementById('settingsContent');
    
    // Create the settings interface
    settingsContent.innerHTML = `
        <div class="settings-header">
            <h1>Settings & Permissions</h1>
            <div class="user-info-badge">
                Logged in as: <strong>${user.name}</strong>
                <span class="role-badge">${user.role}</span>
            </div>
        </div>
        
        <div class="settings-carousel-container">
            <div class="settings-carousel" id="settingsCarousel">
                <!-- Carousel items will be dynamically added -->
            </div>
            <button class="carousel-nav prev">‹</button>
            <button class="carousel-nav next">›</button>
        </div>
        
        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="dynamic-buttons-container" id="dynamicButtons">
                <!-- Dynamic buttons will be added here -->
            </div>
        </div>
        
        <div class="permissions-summary">
            <h3>Your Current Permissions</h3>
            <div class="permissions-list" id="permissionsList"></div>
        </div>
        
        <div class="settings-footer">
            <button onclick="refreshPermissions()" class="refresh-btn">
                🔄 Refresh Permissions
            </button>
            <button onclick="exportSettings()" class="export-btn">
                📥 Export Settings
            </button>
        </div>
    `;
    
    // Load user permissions and build interface
    loadUserPermissions(user.id);
}

async function loadUserPermissions(userId) {
    try {
        // Fetch permissions from your backend API
        const response = await fetch(`/api/user/${userId}/permissions`);
        const permissions = await response.json();
        
        // Build the interface with fetched permissions
        buildPermissionsInterface(permissions);
        
        // Initialize carousel
        initCarousels();
        
    } catch (error) {
        console.error('Error loading permissions:', error);
        // Fallback to default permissions
        const defaultPermissions = getDefaultPermissions();
        buildPermissionsInterface(defaultPermissions);
    }
}

function getDefaultPermissions() {
    // Return default permissions based on role
    const userRole = localStorage.getItem('userRole') || 'user';
    
    const permissionSets = {
        'admin': {
            canApproveTasks: true,
            canManageEmployees: true,
            canModifyTemplates: true,
            canUploadFiles: true,
            canResetPasswords: true,
            canManageLogins: true
        },
        'manager': {
            canApproveTasks: true,
            canManageEmployees: true,
            canModifyTemplates: false,
            canUploadFiles: true,
            canResetPasswords: false,
            canManageLogins: false
        },
        'supervisor': {
            canApproveTasks: true,
            canManageEmployees: false,
            canModifyTemplates: false,
            canUploadFiles: true,
            canResetPasswords: false,
            canManageLogins: false
        },
        'user': {
            canApproveTasks: false,
            canManageEmployees: false,
            canModifyTemplates: false,
            canUploadFiles: false,
            canResetPasswords: false,
            canManageLogins: false
        }
    };
    
    return permissionSets[userRole] || permissionSets['user'];
}

function buildPermissionsInterface(permissions) {
    const carousel = document.getElementById('settingsCarousel');
    const buttonsContainer = document.getElementById('dynamicButtons');
    const permissionsList = document.getElementById('permissionsList');
    
    // Clear existing content
    carousel.innerHTML = '';
    buttonsContainer.innerHTML = '';
    
    // Define all settings modules
    const settingsModules = [
        {
            id: 'task-approval',
            title: 'Task Approval',
            description: 'Approve or reject pending tasks',
            icon: '✅',
            requiredPermission: 'canApproveTasks',
            getContent: getTaskApprovalContent
        },
        {
            id: 'employee-management',
            title: 'Employee Management',
            description: 'Add, edit, or remove employees',
            icon: '👥',
            requiredPermission: 'canManageEmployees',
            getContent: getEmployeeManagementContent
        },
        {
            id: 'template-management',
            title: 'Template Management',
            description: 'Create and modify templates',
            icon: '📄',
            requiredPermission: 'canModifyTemplates',
            getContent: getTemplateManagementContent
        },
        {
            id: 'file-upload',
            title: 'File Upload',
            description: 'Upload and manage files',
            icon: '📤',
            requiredPermission: 'canUploadFiles',
            getContent: getFileUploadContent
        },
        {
            id: 'password-reset',
            title: 'Password Management',
            description: 'Reset passwords and manage logins',
            icon: '🔐',
            requiredPermission: 'canResetPasswords',
            getContent: getPasswordResetContent
        }
    ];
    
    // Filter modules based on permissions
    const availableModules = settingsModules.filter(module => 
        permissions[module.requiredPermission]
    );
    
    // Build carousel
    if (availableModules.length > 0) {
        availableModules.forEach((module, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `
                <div class="module-icon">${module.icon}</div>
                <h2>${module.title}</h2>
                <p class="module-description">${module.description}</p>
                <div class="module-content">${module.getContent()}</div>
            `;
            carousel.appendChild(carouselItem);
        });
    } else {
        // No permissions message
        carousel.innerHTML = `
            <div class="carousel-item active">
                <div class="no-permissions">
                    <div class="module-icon">🔒</div>
                    <h2>No Permissions Granted</h2>
                    <p>Your account doesn't have access to any settings modules.</p>
                    <p>Please contact your administrator to request access.</p>
                </div>
            </div>
        `;
    }
    
    // Build action buttons
    availableModules.forEach(module => {
        const button = document.createElement('button');
        button.className = 'settings-action-btn';
        button.setAttribute('data-module', module.id);
        button.innerHTML = `
            <span class="btn-icon">${module.icon}</span>
            ${module.title}
        `;
        
        button.addEventListener('click', () => {
            const itemIndex = availableModules.findIndex(m => m.id === module.id);
            showCarouselItem(itemIndex);
        });
        
        buttonsContainer.appendChild(button);
    });
    
    // Update permissions summary
    updatePermissionsSummary(permissions, permissionsList);
}

function initCarousels() {
    const carousel = document.getElementById('settingsCarousel');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    let currentIndex = 0;
    const items = carousel.querySelectorAll('.carousel-item');
    
    if (items.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
    }
    
    function updateCarousel() {
        const itemWidth = 100; // Percentage
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}%)`;
        
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Auto-rotate (optional)
    // setInterval(() => {
    //     currentIndex = (currentIndex + 1) % items.length;
    //     updateCarousel();
    // }, 8000);
    
    updateCarousel();
}

function showCarouselItem(index) {
    const carousel = document.getElementById('settingsCarousel');
    const items = carousel.querySelectorAll('.carousel-item');
    
    if (items[index]) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }
}

// Content generator functions (same as before but simplified)
function getTaskApprovalContent() {
    return `
        <div class="module-controls">
            <div class="toggle-group">
                <label>
                    <input type="checkbox" id="enableAutoApprove">
                    Enable Auto-approval for minor tasks
                </label>
            </div>
            <div class="approval-queue">
                <h4>Pending Approvals</h4>
                <div id="pendingApprovalsList">
                    <!-- Will be populated by API -->
                </div>
                <button onclick="loadPendingApprovals()" class="refresh-list-btn">
                    Refresh List
                </button>
            </div>
        </div>
    `;
}

function getEmployeeManagementContent() {
    return `
        <div class="module-controls">
            <div class="action-buttons">
                <button class="action-btn add-employee" onclick="openAddEmployeeModal()">
                    <span>➕</span> Add New Employee
                </button>
                <button class="action-btn edit-employee" onclick="openEmployeeDirectory()">
                    <span>📋</span> View All Employees
                </button>
            </div>
            <div class="search-section">
                <input type="text" id="empSearch" placeholder="Search employee by name or ID...">
                <button onclick="searchEmployee()">Search</button>
            </div>
        </div>
    `;
}

function getTemplateManagementContent() {
    return `
        <div class="module-controls">
            <div class="template-actions">
                <button onclick="createTemplate()">Create New Template</button>
                <button onclick="browseTemplates()">Browse Templates</button>
            </div>
            <div class="recent-templates">
                <h4>Recently Modified</h4>
                <div id="recentTemplatesList"></div>
            </div>
        </div>
    `;
}

function getFileUploadContent() {
    return `
        <div class="module-controls">
            <div class="upload-zone" id="uploadZone">
                <p>Drag & drop files here or</p>
                <input type="file" id="fileInput" multiple>
                <button onclick="document.getElementById('fileInput').click()">
                    Browse Files
                </button>
            </div>
            <div class="upload-settings">
                <label>
                    Maximum file size: 
                    <select id="maxFileSize">
                        <option value="10">10 MB</option>
                        <option value="25">25 MB</option>
                        <option value="50">50 MB</option>
                    </select>
                </label>
            </div>
        </div>
    `;
}

function getPasswordResetContent() {
    return `
        <div class="module-controls">
            <div class="password-reset-form">
                <div class="form-group">
                    <label for="selectUser">Select User:</label>
                    <select id="selectUser">
                        <option value="">-- Select a user --</option>
                        <!-- Options will be populated -->
                    </select>
                </div>
                <div class="form-group">
                    <label for="resetType">Reset Type:</label>
                    <select id="resetType">
                        <option value="email">Send Reset Email</option>
                        <option value="temporary">Generate Temporary Password</option>
                    </select>
                </div>
                <button onclick="initiatePasswordReset()" class="reset-btn">
                    Initiate Password Reset
                </button>
            </div>
        </div>
    `;
}

function updatePermissionsSummary(permissions, container) {
    const permissionMap = {
        canApproveTasks: 'Approve Tasks',
        canManageEmployees: 'Manage Employees',
        canModifyTemplates: 'Modify Templates',
        canUploadFiles: 'Upload Files',
        canResetPasswords: 'Reset Passwords',
        canManageLogins: 'Manage Logins'
    };
    
    let html = '<ul>';
    Object.entries(permissionMap).forEach(([key, label]) => {
        const hasPerm = permissions[key];
        html += `
            <li class="${hasPerm ? 'has-permission' : 'no-permission'}">
                ${hasPerm ? '✓' : '✗'} ${label}
            </li>
        `;
    });
    html += '</ul>';
    
    container.innerHTML = html;
}

// Utility functions
function refreshPermissions() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        loadUserPermissions(userId);
        showNotification('Permissions refreshed successfully!', 'success');
    }
}

function exportSettings() {
    const userSettings = {
        user: getCurrentUser(),
        permissions: getDefaultPermissions(),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `settings-${userSettings.user.name}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function showNotification(message, type = 'info') {
    // Use your existing notification system or create a simple one
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .loading-settings {
        text-align: center;
        padding: 50px;
        color: #666;
    }
    
    .quick-actions {
        margin: 30px 0;
    }
    
    .settings-footer {
        display: flex;
        gap: 15px;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    .refresh-btn, .export-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }
    
    .refresh-btn {
        background: #f0f7ff;
        color: #0066cc;
    }
    
    .export-btn {
        background: #f0fff0;
        color: #008000;
    }
`;
document.head.appendChild(style);