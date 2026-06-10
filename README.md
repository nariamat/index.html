                        <p class="stat-value"><span id="totalReferrals">0</span></p>
                    </div>
                    <div class="stat-card">
                        <h3>Referral Earnings</h3>
                        <p class="stat-value">₦<span id="referralEarnings">0</span></p>
                    </div>
                </div>

                <div class="quick-actions">
                    <button class="btn-action" onclick="switchPage('tasksPage')">Complete Tasks</button>
                    <button class="btn-action" onclick="switchPage('referralsPage')">Invite Friends</button>
                    <button class="btn-action" onclick="switchPage('withdrawPage')">Withdraw</button>
                </div>
            </div>
        </div>

        <!-- Tasks Page -->
        <div id="tasksPage" class="page">
            <nav class="navbar">
                <div class="nav-brand">💰 EarningHub</div>
                <div class="nav-menu">
                    <a href="#" onclick="switchPage('dashboardPage')">Dashboard</a>
                    <a href="#" onclick="switchPage('tasksPage')" class="active">Tasks</a>
                    <a href="#" onclick="switchPage('referralsPage')">Referrals</a>
                    <a href="#" onclick="switchPage('settingsPage')">Settings</a>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </div>
            </nav>

            <div class="dashboard-content">
                <h1>Available Tasks</h1>
                <div class="tasks-grid" id="tasksContainer">
                    <!-- Tasks will be populated here -->
                </div>
            </div>
        </div>

        <!-- Referrals Page -->
        <div id="referralsPage" class="page">
            <nav class="navbar">
                <div class="nav-brand">💰 EarningHub</div>
                <div class="nav-menu">
                    <a href="#" onclick="switchPage('dashboardPage')">Dashboard</a>
                    <a href="#" onclick="switchPage('tasksPage')">Tasks</a>
                    <a href="#" onclick="switchPage('referralsPage')" class="active">Referrals</a>
                    <a href="#" onclick="switchPage('settingsPage')">Settings</a>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </div>
            </nav>

            <div class="dashboard-content">
                <h1>Referral Program</h1>
                <div class="referral-section">
                    <h2>Your Referral Link</h2>
                    <div class="referral-link-box">
                        <input type="text" id="referralLink" readonly>
                        <button class="btn-copy" onclick="copyReferralLink()">Copy Link</button>
                    </div>
                    <p class="referral-info">Earn ₦100 for every person who registers using your link</p>
                </div>

                <div class="referrals-list">
                    <h2>Your Referrals</h2>
                    <table id="referralsTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Join Date</th>
                                <th>Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Referrals will be listed here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Withdraw Page -->
        <div id="withdrawPage" class="page">
            <nav class="navbar">
                <div class="nav-brand">💰 EarningHub</div>
                <div class="nav-menu">
                    <a href="#" onclick="switchPage('dashboardPage')">Dashboard</a>
                    <a href="#" onclick="switchPage('tasksPage')">Tasks</a>
                    <a href="#" onclick="switchPage('referralsPage')">Referrals</a>
                    <a href="#" onclick="switchPage('settingsPage')">Settings</a>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </div>
            </nav>

            <div class="dashboard-content">
                <h1>Withdraw Earnings</h1>
                <div class="withdraw-card">
                    <h2>Available Balance</h2>
                    <p class="balance">₦<span id="withdrawBalance">0</span></p>
                    
                    <form id="withdrawForm" onsubmit="handleWithdraw(event)">
                        <input type="number" id="withdrawAmount" placeholder="Amount to withdraw" min="100" required>
                        <select id="withdrawMethod" required>
                            <option value="">Select Payment Method</option>
                            <option value="opay">OPay (9075885346)</option>
                            <option value="smartcash">SmartCash (9046166102)</option>
                        </select>
                        <button type="submit" class="btn-primary">Withdraw</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Settings Page -->
        <div id="settingsPage" class="page">
            <nav class="navbar">
                <div class="nav-brand">💰 EarningHub</div>
                <div class="nav-menu">
                    <a href="#" onclick="switchPage('dashboardPage')">Dashboard</a>
                    <a href="#" onclick="switchPage('tasksPage')">Tasks</a>
                    <a href="#" onclick="switchPage('referralsPage')">Referrals</a>
                    <a href="#" onclick="switchPage('settingsPage')" class="active">Settings</a>
                    <button class="btn-logout" onclick="handleLogout()">Logout</button>
                </div>
            </nav>

            <div class="dashboard-content">
                <h1>Settings</h1>
                <div class="settings-section">
                    <h2>Theme</h2>
                    <label>
                        <input type="checkbox" id="darkModeToggle" onchange="toggleDarkMode()">
                        Dark Mode
                    </label>
                    <div class="theme-preview">
                        <p>Background: Blue & White</p>
                    </div>
                </div>

                <div class="settings-section">
                    <h2>Security</h2>
                    <button class="btn-secondary" onclick="handleChangePassword()">Change Password</button>
                    <p class="security-note">VPN Access: Not Allowed</p>
                </div>

                <div class="settings-section">
                    <h2>Account</h2>
                    <p>Username: <strong id="settingsUsername">User</strong></p>
                    <p>Email: <strong id="settingsEmail">user@email.com</strong></p>
                    <button class="btn-danger" onclick="handleDeleteAccount()">Delete Account</button>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
