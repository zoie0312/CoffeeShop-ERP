// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.createElement('button');
    toggleSidebarBtn.classList.add('toggle-sidebar');
    toggleSidebarBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.querySelector('.header-title').prepend(toggleSidebarBtn);
    
    toggleSidebarBtn.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });
    
    // Time Range Selector for Chart
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            updateChart(this.value);
        });
    }
    
    // Notifications popup
    const notificationsBtn = document.querySelector('.notifications');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNotifications();
        });
    }
    
    // User menu dropdown
    const userInfoBtn = document.querySelector('.user-info');
    if (userInfoBtn) {
        userInfoBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserMenu();
        });
    }
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function() {
        closeAllDropdowns();
    });
    
    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-buttons button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleQuickAction(this);
        });
    });
    
    // Initialize chart
    initializeDashboard();
});

// Dashboard initialization
function initializeDashboard() {
    // Current date display
    updateDateDisplay();
    
    // Simulate updating the chart
    updateChart('today');
    
    // Simulate refreshing data periodically
    setInterval(function() {
        refreshDashboardData();
    }, 30000); // Every 30 seconds
}

// Update date display
function updateDateDisplay() {
    const dateDisplay = document.querySelector('.date-display span');
    if (dateDisplay) {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.textContent = 'Today: ' + now.toLocaleDateString('en-US', options);
    }
}

// Simulate chart update based on time range
function updateChart(timeRange) {
    console.log('Updating chart for time range:', timeRange);
    
    // In a real application, this would fetch data and update the chart
    // For this prototype, we'll just simulate different bar heights
    
    const bars = document.querySelectorAll('.chart-bars .bar');
    
    // Different heights based on selected time range
    let heights;
    
    switch(timeRange) {
        case 'week':
            heights = [45, 60, 30, 75, 85, 40, 50, 65];
            break;
        case 'month':
            heights = [55, 40, 70, 60, 50, 80, 35, 45];
            break;
        default: // today
            heights = [30, 40, 65, 80, 90, 70, 50, 60];
    }
    
    // Apply the heights with animation
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.height = heights[index] + '%';
        }, index * 100);
    });
}

// Simulate refreshing dashboard data
function refreshDashboardData() {
    console.log('Refreshing dashboard data...');
    // In a real application, this would fetch updated data from the server
}

// Show notifications dropdown
function showNotifications() {
    closeAllDropdowns();
    
    // Create and show notifications dropdown
    let notificationsDropdown = document.querySelector('.notifications-dropdown');
    
    if (!notificationsDropdown) {
        notificationsDropdown = document.createElement('div');
        notificationsDropdown.classList.add('dropdown', 'notifications-dropdown');
        
        notificationsDropdown.innerHTML = `
            <div class="dropdown-header">
                <h4>Notifications</h4>
                <span class="text-muted">You have 3 new notifications</span>
            </div>
            <div class="dropdown-content">
                <div class="notification-item unread">
                    <div class="notification-icon warning">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Low stock alert</div>
                        <div class="notification-text">Coffee beans (Dark Roast) is running low</div>
                        <div class="notification-time">10 minutes ago</div>
                    </div>
                </div>
                <div class="notification-item unread">
                    <div class="notification-icon info">
                        <i class="fa-solid fa-truck-fast"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Delivery arrived</div>
                        <div class="notification-text">Milk delivery has been received</div>
                        <div class="notification-time">45 minutes ago</div>
                    </div>
                </div>
                <div class="notification-item unread">
                    <div class="notification-icon success">
                        <i class="fa-solid fa-chart-line"></i>
                    </div>
                    <div class="notification-details">
                        <div class="notification-title">Sales milestone reached</div>
                        <div class="notification-text">Daily sales target of $1,000 achieved</div>
                        <div class="notification-time">2 hours ago</div>
                    </div>
                </div>
            </div>
            <div class="dropdown-footer">
                <a href="#">View all notifications</a>
            </div>
        `;
        
        document.querySelector('.notifications').appendChild(notificationsDropdown);
    } else {
        notificationsDropdown.style.display = 'block';
    }
}

// Toggle user menu dropdown
function toggleUserMenu() {
    closeAllDropdowns();
    
    // Create and show user menu dropdown
    let userMenuDropdown = document.querySelector('.user-menu-dropdown');
    
    if (!userMenuDropdown) {
        userMenuDropdown = document.createElement('div');
        userMenuDropdown.classList.add('dropdown', 'user-menu-dropdown');
        
        userMenuDropdown.innerHTML = `
            <div class="dropdown-header user-header">
                <img src="https://via.placeholder.com/48" alt="User Avatar">
                <div>
                    <h4>Admin User</h4>
                    <span class="text-muted">Store Manager</span>
                </div>
            </div>
            <div class="dropdown-content">
                <a href="#" class="dropdown-item">
                    <i class="fa-solid fa-user"></i> My Profile
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fa-solid fa-gear"></i> Settings
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fa-solid fa-question-circle"></i> Help & Support
                </a>
            </div>
            <div class="dropdown-footer">
                <a href="#" class="logout-btn">
                    <i class="fa-solid fa-sign-out-alt"></i> Logout
                </a>
            </div>
        `;
        
        document.querySelector('.user-info').appendChild(userMenuDropdown);
    } else {
        userMenuDropdown.style.display = userMenuDropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Close all dropdown menus
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
    });
}

// Handle quick action button clicks
function handleQuickAction(button) {
    const action = button.textContent.trim();
    console.log('Quick action clicked:', action);
    
    // In a real application, this would navigate to appropriate pages or open modals
    switch(true) {
        case /New Sale/.test(action):
            window.location.href = 'pos.html';
            break;
        case /Add Inventory/.test(action):
            window.location.href = 'inventory.html';
            break;
        case /View Reports/.test(action):
            window.location.href = 'reports.html';
            break;
        default:
            console.log('Action not recognized');
    }
} 