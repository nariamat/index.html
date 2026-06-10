// User Database (using localStorage)
const ADMIN_USERNAME = 'nariamat';
const ADMIN_PASSWORD = 'temitayo5sA@@';
const ACTIVATION_FEE = 1000;
const REFERRAL_REWARD = 100;
const TASKS = [
    { id: 1, title: 'Complete Survey', description: 'Answer a quick survey', reward: 500, difficulty: 'Easy' },
    { id: 2, title: 'Watch Video', description: 'Watch a 5-minute video', reward: 300, difficulty: 'Easy' },
    { id: 3, title: 'Download App', description: 'Download and install the app', reward: 1000, difficulty: 'Medium' },
    { id: 4, title: 'Play Game', description: 'Play the game for 10 minutes', reward: 200, difficulty: 'Easy' },
    { id: 5, title: 'Complete Offer', description: 'Complete a special offer', reward: 2000, difficulty: 'Hard' },
    { id: 6, title: 'Social Share', description: 'Share our platform on social media', reward: 400, difficulty: 'Easy' }
];

const PROMOTION_POSTS = [
    {
        platform: 'Instagram',
        icon: 'fab fa-instagram',
        content: 'Just earned ₦5,000 on EarningHub! 💰 Complete simple tasks, refer friends & make money. Join now: https://nariamat.github.io/index.html/ #EarningHub #MoneyOnline #SideHustle'
    },
    {
        platform: 'Facebook',
        icon: 'fab fa-facebook',
        content: 'OMG! I\'m making real money on EarningHub! 🎉 No experience needed. Just sign up, complete tasks, and earn. Plus get ₦100 per friend you refer! Join the movement! https://nariamat.github.io/index.html/'
    },
    {
        platform: 'Twitter',
        icon: 'fab fa-twitter',
        content: 'Make money from your phone! 📱 EarningHub is the easiest way to earn. Complete tasks = cash. Refer friends = more cash. Try it now! https://nariamat.github.io/index.html/ #EarningHub'
    },
    {
        platform: 'TikTok',
        icon: 'fab fa-tiktok',
        content: 'POV: You found a platform that actually pays! 💸 EarningHub pays real money for completing tasks. Join thousands earning today! https://nariamat.github.io/index.html/ #MakeMoney #EarningHub #SideHustle'
    }
];

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize users database
function initDatabase() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', '');
    }
}

// Get all users
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

// Get current user
function getCurrentUser() {
    const username = localStorage.getItem('currentUser');
    if (username) {
        return getAllUsers()[username];
    }
    return null;
}

// Save user
function saveUser(user) {
    const users = getAllUsers();
    users[user.username] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const phone = document.getElementById('regPhone').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;

    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (!acceptTerms) {
        showNotification('Please accept the terms and conditions', 'error');
        return;
    }

    const users = getAllUsers();
    if (users[username]) {
        showNotification('Username already exists!', 'error');
        return;
    }

    // Create referral link
    const referralCode = generateReferralCode();
    const referralLink = `${window.location.origin}?ref=${referralCode}`;

    // Create user object
    const newUser = {
        username,
        email,
        password,
        phone,
        balance: 0,
        totalEarnings: 0,
        referralEarnings: 0,
        referralLink,
        referralCode,
        referrals: [],
        completedTasks: [],
        createdAt: new Date().toISOString(),
        analytics: {
            totalClicks: 0,
            totalReferrals: 0
        },
        activity: []
    };

    saveUser(newUser);
    showNotification('✅ Registration successful! Please pay the activation fee of ₦1,000 at:\nOPay: 9075885346\nSmartCash: 9046166102', 'success');
    switchPage('loginPage');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Check for VPN (mock check)
    if (username.includes('vpn') || username.includes('proxy')) {
        showNotification('❌ VPN usage is not allowed on this platform!', 'error');
        return;
    }

    // Check if it's admin login
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('currentUser', username);
        switchPage('dashboardPage');
        showNotification('✅ Admin login successful!', 'success');
        return;
    }

    const users = getAllUsers();
    const user = users[username];

    if (!user) {
        showNotification('❌ User not found!', 'error');
        return;
    }

    if (user.password !== password) {
        showNotification('❌ Incorrect password!', 'error');
        return;
    }

    localStorage.setItem('currentUser', username);
    loadDashboard();
    switchPage('dashboardPage');
    showNotification('✅ Login successful!', 'success');
}

// Load Dashboard
function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('dashboardUsername').textContent = user.username;
    document.getElementById('totalEarnings').textContent = user.totalEarnings || 0;
    document.getElementById('activeTasks').textContent = TASKS.length;
    document.getElementById('totalReferrals').textContent = (user.referrals || []).length;
    document.getElementById('referralEarnings').textContent = user.referralEarnings || 0;
    document.getElementById('settingsUsername').textContent = user.username;
    document.getElementById('settingsEmail').textContent = user.email;
    document.getElementById('withdrawBalance').textContent = user.balance || 0;

    // Load Analytics
    loadAnalytics();
    loadTasks();
    loadReferrals();
    loadPromotionPosts();
}

// Load Tasks
function loadTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = '';

    TASKS.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p style="font-size: 12px; color: #999;">Difficulty: ${task.difficulty}</p>
            <div class="task-reward">₦${task.reward}</div>
            <button onclick="completeTask(${task.id})">Complete Task</button>
        `;
        tasksContainer.appendChild(taskCard);
    });
}

// Complete Task
function completeTask(taskId) {
    const user = getCurrentUser();
    if (!user) return;

    const task = TASKS.find(t => t.id === taskId);
    if (!task) return;

    if (user.completedTasks && user.completedTasks.includes(taskId)) {
        showNotification('❌ You have already completed this task!', 'error');
        return;
    }

    // Add earnings
    if (!user.completedTasks) user.completedTasks = [];
    user.completedTasks.push(taskId);
    user.balance = (user.balance || 0) + task.reward;
    user.totalEarnings = (user.totalEarnings || 0) + task.reward;

    // Add to activity
    if (!user.activity) user.activity = [];
    user.activity.push({
        type: 'task_completed',
        description: `Completed ${task.title}`,
        reward: task.reward,
        timestamp: new Date().toISOString()
    });

    saveUser(user);
    showNotification(`✅ Task completed! You earned ₦${task.reward}`, 'success');
    loadDashboard();
}

// Load Referrals
function loadReferrals() {
    const user = getCurrentUser();
    if (!user) return;

    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    const referralInput = document.getElementById('referralLink');
    if (referralInput) referralInput.value = referralLink;

    const referralsTable = document.querySelector('#referralsTable tbody');
    if (!referralsTable) return;
    
    referralsTable.innerHTML = '';

    if (user.referrals && user.referrals.length > 0) {
        user.referrals.forEach(referral => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${referral.username}</td>
                <td>${new Date(referral.joinDate).toLocaleDateString()}</td>
                <td>₦${referral.earnings || 100}</td>
            `;
            referralsTable.appendChild(row);
        });
    } else {
        referralsTable.innerHTML = '<tr><td colspan="3" style="text-align: center;">No referrals yet</td></tr>';
    }
}

// Copy Referral Link
function copyReferralLink() {
    const referralLink = document.getElementById('referralLink');
    referralLink.select();
    document.execCommand('copy');
    showNotification('✅ Referral link copied to clipboard!', 'success');
}

// Share on WhatsApp
function shareWhatsApp() {
    const user = getCurrentUser();
    if (!user) return;

    const text = `Hey! 👋 I'm earning money on EarningHub! 💰\nEarn ₦100 - ₦2,000 per task\nJoin using my link: ${user.referralLink}\nI also get ₦100 for each person who signs up!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    showNotification('✅ Opening WhatsApp...', 'success');
}

// Load Promotion Posts
function loadPromotionPosts() {
    const promotionContainer = document.getElementById('promotionContainer');
    if (!promotionContainer) return;

    promotionContainer.innerHTML = '';
    PROMOTION_POSTS.forEach(post => {
        const card = document.createElement('div');
        card.className = 'promotion-card';
        card.innerHTML = `
            <div class="social-icon"><i class="${post.icon}"></i></div>
            <h3>${post.platform}</h3>
            <div class="promotion-content">${post.content}</div>
            <button onclick="copyPromotion('${post.content.replace(/'/g, "\\'")}")">
                <i class="fas fa-copy"></i> Copy Post
            </button>
            <button onclick="sharePromotion('${post.platform}')" style="background: #999;">
                <i class="fas fa-share-alt"></i> Share
            </button>
        `;
        promotionContainer.appendChild(card);
    });
}

// Copy Promotion Post
function copyPromotion(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showNotification('✅ Post copied! Paste it on social media.', 'success');
}

// Share Promotion
function sharePromotion(platform) {
    showNotification(`✅ Share on ${platform}!`, 'success');
    // You can add platform-specific sharing logic here
}

// Load Analytics
function loadAnalytics() {
    const user = getCurrentUser();
    if (!user) return;

    const analytics = user.analytics || {};
    const tasksCompleted = (user.completedTasks || []).length;
    const avgReward = tasksCompleted > 0 ? Math.floor(user.totalEarnings / tasksCompleted) : 0;
    const conversionRate = analytics.totalClicks > 0 ? Math.floor((analytics.totalReferrals / analytics.totalClicks) * 100) : 0;

    document.getElementById('totalClicks').textContent = analytics.totalClicks || 0;
    document.getElementById('conversionRate').textContent = conversionRate;
    document.getElementById('tasksCompleted').textContent = tasksCompleted;
    document.getElementById('avgReward').textContent = avgReward;

    // Load Activity Timeline
    loadActivityTimeline();
}

// Load Activity Timeline
function loadActivityTimeline() {
    const user = getCurrentUser();
    if (!user) return;

    const timelineContainer = document.getElementById('activityTimeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';

    const activity = (user.activity || []).slice().reverse();
    if (activity.length === 0) {
        timelineContainer.innerHTML = '<p style="text-align: center; color: #999;">No activity yet</p>';
        return;
    }

    activity.slice(0, 10).forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        const date = new Date(event.timestamp);
        item.innerHTML = `
            <div class="time">${date.toLocaleString()}</div>
            <div class="event">${event.description}</div>
            <div style="color: #4caf50; font-weight: bold; margin-top: 5px;">+₦${event.reward}</div>
        `;
        timelineContainer.appendChild(item);
    });
}

// Handle Withdraw
function handleWithdraw(event) {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;

    if (amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    if (amount > (user.balance || 0)) {
        showNotification(`❌ Insufficient balance! Your balance: ₦${user.balance || 0}`, 'error');
        return;
    }

    if (!method) {
        showNotification('Please select a payment method', 'error');
        return;
    }

    // Deduct from balance
    user.balance = (user.balance || 0) - amount;
    user.withdrawals = user.withdrawals || [];
    user.withdrawals.push({
        amount,
        method,
        date: new Date().toISOString(),
        status: 'Pending'
    });

    saveUser(user);
    showNotification(`✅ Withdrawal request submitted!\nAmount: ₦${amount}\nYour money will be credited within 24 hours.`, 'success');
    document.getElementById('withdrawForm').reset();
    loadDashboard();
}

// Toggle Notifications
function toggleNotifications() {
    const enabled = document.getElementById('notificationsToggle').checked;
    localStorage.setItem('notificationsEnabled', enabled);
    showNotification(enabled ? '✅ Notifications enabled' : '✅ Notifications disabled', 'info');
}

// Save Settings
function saveSettings() {
    showNotification('✅ Settings saved!', 'success');
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    showNotification(isDarkMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
}

// Load Dark Mode Preference
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = true;
    }
}

// Switch Pages
function switchPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        if (pageName === 'dashboardPage') {
            loadDashboard();
        } else if (pageName === 'analyticsPage') {
            loadAnalytics();
        }
    }
}

// Handle Logout
function handleLogout() {
    localStorage.setItem('currentUser', '');
    document.getElementById('loginForm').reset();
    switchPage('loginPage');
    showNotification('✅ You have been logged out successfully!', 'success');
}

// Handle Change Password
function handleChangePassword() {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
        const user = getCurrentUser();
        if (user) {
            user.password = newPassword;
            saveUser(user);
            showNotification('✅ Password changed successfully!', 'success');
        }
    }
}

// Handle Delete Account
function handleDeleteAccount() {
    const confirm = prompt('Type your username to confirm account deletion:');
    const user = getCurrentUser();
    if (confirm === user.username) {
        const users = getAllUsers();
        delete users[user.username];
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', '');
        showNotification('✅ Account deleted successfully!', 'success');
        switchPage('loginPage');
    } else {
        showNotification('❌ Account deletion cancelled!', 'error');
    }
}

// Generate Referral Code
function generateReferralCode() {
    return 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Check for referral in URL
function checkReferralCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        localStorage.setItem('referralCode', refCode);
    }
}

// Initialize
function init() {
    initDatabase();
    loadDarkModePreference();
    checkReferralCode();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loadDashboard();
        switchPage('dashboardPage');
    } else {
        switchPage('loginPage');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
