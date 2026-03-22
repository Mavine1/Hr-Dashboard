const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generic send function
const sendEmail = async (to, subject, html, attachments = []) => {
    try {
        const mailOptions = {
            from: `"HR Admin Pro" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        };
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

// Welcome Email Template
const sendWelcomeEmail = async (user) => {
    const subject = `Welcome to HR Admin Pro, ${user.name}!`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 28px; }
                .header p { color: #dbeafe; margin: 10px 0 0; }
                .content { padding: 40px 30px; }
                .content h2 { color: #1e40af; margin-top: 0; }
                .info-box { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
                .info-box p { margin: 8px 0; }
                .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
                .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏢 HR Admin Pro</h1>
                    <p>Your Complete HR Management Solution</p>
                </div>
                <div class="content">
                    <h2>Welcome aboard, ${user.name}! 🎉</h2>
                    <p>Your account has been successfully created. You now have access to all HR management features including:</p>
                    
                    <div class="info-box">
                        <p>✅ <strong>Employee Management</strong> - Manage all employee records</p>
                        <p>✅ <strong>Task Tracking</strong> - Assign and track tasks</p>
                        <p>✅ <strong>Contract Management</strong> - Handle vendor contracts</p>
                        <p>✅ <strong>HR Letters</strong> - Generate official communications</p>
                        <p>✅ <strong>Financial Hub</strong> - Track budgets and expenses</p>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL}/login" class="button">🚀 Login to Dashboard</a>
                    
                    <p><strong>Your Account Details:</strong></p>
                    <p>📧 Email: ${user.email}</p>
                    <p>👔 Role: ${user.role || 'Employee'}</p>
                </div>
                <div class="footer">
                    <p>Need help? Contact us at support@hradminpro.com</p>
                    <p>© 2024 HR Admin Pro. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return await sendEmail(user.email, subject, html);
};

// Task Assignment Email Template
const sendTaskAssignmentEmail = async (employee, task, assignedBy) => {
    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        urgent: '#b91c1c'
    };
    
    const subject = `📋 New Task Assigned: ${task.title}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f8fafc; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; }
                .header h1 { color: white; margin: 0; }
                .content { padding: 30px; }
                .task-card { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${priorityColors[task.priority]}; }
                .priority { color: ${priorityColors[task.priority]}; font-weight: bold; }
                .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 New Task Assignment</h1>
                </div>
                <div class="content">
                    <h2>Hello ${employee.name},</h2>
                    <p>You have been assigned a new task by <strong>${assignedBy.name}</strong>.</p>
                    
                    <div class="task-card">
                        <h3 style="margin: 0 0 10px;">${task.title}</h3>
                        <p>${task.description}</p>
                        <div style="margin-top: 15px;">
                            <p><strong>🎯 Priority:</strong> <span class="priority">${task.priority.toUpperCase()}</span></p>
                            <p><strong>📅 Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
                            <p><strong>⏱️ Estimated Hours:</strong> ${task.estimatedHours || 0}h</p>
                        </div>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL}/task-centre" class="button">✅ View Task</a>
                </div>
            </div>
        </body>
        </html>
    `;
    return await sendEmail(employee.email, subject, html);
};

// Contract Expiration Email
const sendContractExpirationEmail = async (contract, responsiblePerson) => {
    const daysLeft = Math.ceil((new Date(contract.endDate) - new Date()) / (1000 * 60 * 60 * 24));
    const subject = `⚠️ Contract Expiring Soon: ${contract.contractId}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .header { background: linear-gradient(135deg, #b91c1c 0%, #ef4444 100%); padding: 30px; text-align: center; }
                .warning-card { background: #fef2f2; padding: 20px; border-radius: 12px; border-left: 4px solid #b91c1c; margin: 20px 0; }
                .button { background: #b91c1c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: white;">⚠️ Contract Expiration Alert</h1>
                </div>
                <div class="content">
                    <h2>Hello ${responsiblePerson.name},</h2>
                    <p>The following contract is expiring soon. Please review and take necessary action.</p>
                    
                    <div class="warning-card">
                        <h3 style="color: #b91c1c;">📄 ${contract.vendorName}</h3>
                        <p><strong>Contract ID:</strong> ${contract.contractId}</p>
                        <p><strong>Type:</strong> ${contract.contractType}</p>
                        <p><strong>Value:</strong> Ksh ${contract.value.toLocaleString()}</p>
                        <p><strong>⚠️ Expires in:</strong> ${daysLeft} days (${new Date(contract.endDate).toLocaleDateString()})</p>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL}/vendor-contracts" class="button">📋 Review Contract</a>
                </div>
            </div>
        </body>
        </html>
    `;
    return await sendEmail(responsiblePerson.email, subject, html);
};

// HR Letter Email
const sendLetterEmail = async (employee, letter, createdBy) => {
    const subject = `📄 HR Letter: ${letter.subject}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; }
                .letter-card { background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
                .button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: white;">📄 HR Communication</h1>
                </div>
                <div class="content">
                    <h2>Dear ${employee.name},</h2>
                    <p>Please find your HR letter details below:</p>
                    
                    <div class="letter-card">
                        <h3 style="color: #1e40af;">${letter.subject}</h3>
                        <p><strong>Reference:</strong> ${letter.referenceNumber}</p>
                        <p><strong>Type:</strong> ${letter.letterType}</p>
                        <p><strong>Issued by:</strong> ${createdBy.name}</p>
                        <div style="border-top: 1px solid #e2e8f0; margin-top: 15px; padding-top: 15px;">
                            <div style="white-space: pre-line;">${letter.content}</div>
                        </div>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL}/hr-letters" class="button">📧 View in Portal</a>
                </div>
            </div>
        </body>
        </html>
    `;
    return await sendEmail(employee.email, subject, html);
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendTaskAssignmentEmail,
    sendContractExpirationEmail,
    sendLetterEmail,
};