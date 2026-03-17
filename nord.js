// backend/api.js - Add these routes
app.get('/api/user/:id/permissions', authenticate, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Get user from database
        const user = await User.findById(userId);
        
        // Get role permissions
        const role = await Role.findById(user.roleId);
        
        // Return permissions
        res.json({
            canApproveTasks: role.permissions.taskApproval,
            canManageEmployees: role.permissions.employeeManagement,
            canModifyTemplates: role.permissions.templateManagement,
            canUploadFiles: role.permissions.fileUpload,
            canResetPasswords: role.permissions.passwordReset,
            canManageLogins: role.permissions.loginManagement
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load permissions' });
    }
});

// Save settings endpoint
app.post('/api/settings/:module', authenticate, checkPermission, async (req, res) => {
    try {
        const { module } = req.params;
        const settings = req.body;
        const userId = req.user.id;
        
        // Save settings to database
        await Settings.findOneAndUpdate(
            { userId, module },
            { $set: { settings, updatedAt: new Date() } },
            { upsert: true }
        );
        
        res.json({ success: true, message: 'Settings saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save settings' });
    }
});// Example Node.js/Express endpoints
app.post('/api/auth/register', async (req, res) => {
    // Handle registration
});

app.post('/api/auth/login', async (req, res) => {
    // Handle email/password login
});

app.post('/api/auth/verify-token', async (req, res) => {
    // Verify JWT tokens
});