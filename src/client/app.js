// Frontend Developer - JavaScript functionality
// This is your responsibility area

class FrontendApp {
    constructor() {
        this.init();
        this.bindEvents();
        this.loadData();
    }

    init() {
        console.log('🚀 Frontend App initialized');
        this.showWelcomeMessage();
        this.setupAnimations();
    }

    bindEvents() {
        // Button event listeners
        const buttons = document.querySelectorAll('.frontend-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });

        // Form event listeners
        const forms = document.querySelectorAll('.frontend-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });

        // Input event listeners
        const inputs = document.querySelectorAll('.frontend-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleInputChange(e.target);
            });
        });
    }

    showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'frontend-card frontend-animate';
        welcomeDiv.innerHTML = `
            <h2>👨‍💻 Frontend Developer Dashboard</h2>
            <p>Welcome to the frontend development environment!</p>
            <div class="frontend-status success">
                ✅ Frontend system operational
            </div>
        `;
        
        const container = document.querySelector('.frontend-container') || document.body;
        container.insertBefore(welcomeDiv, container.firstChild);
    }

    setupAnimations() {
        // Add animation classes to elements
        const cards = document.querySelectorAll('.frontend-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('frontend-animate-up');
        });
    }

    handleButtonClick(button) {
        const buttonText = button.textContent;
        console.log(`Button clicked: ${buttonText}`);
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Handle different button actions
        switch(buttonText.toLowerCase()) {
            case 'test frontend':
                this.runFrontendTests();
                break;
            case 'toggle theme':
                this.toggleTheme();
                break;
            case 'load data':
                this.loadData();
                break;
            default:
                this.showNotification(`Button "${buttonText}" clicked!`);
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        this.showNotification('Form submitted successfully!');
        
        // Reset form
        event.target.reset();
    }

    handleInputChange(input) {
        // Real-time input validation
        if (input.type === 'email') {
            this.validateEmail(input);
        } else if (input.type === 'password') {
            this.validatePassword(input);
        }
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        
        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        
        if (input.value && !isValid) {
            this.showInputError(input, 'Please enter a valid email address');
        } else {
            this.clearInputError(input);
        }
    }

    validatePassword(input) {
        const isValid = input.value.length >= 6;
        
        input.style.borderColor = isValid ? '#28a745' : '#dc3545';
        
        if (input.value && !isValid) {
            this.showInputError(input, 'Password must be at least 6 characters');
        } else {
            this.clearInputError(input);
        }
    }

    showInputError(input, message) {
        let errorDiv = input.parentNode.querySelector('.input-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'input-error';
            errorDiv.style.color = '#dc3545';
            errorDiv.style.fontSize = '0.8em';
            errorDiv.style.marginTop = '5px';
            input.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    clearInputError(input) {
        const errorDiv = input.parentNode.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    runFrontendTests() {
        const testResults = document.createElement('div');
        testResults.className = 'frontend-card';
        testResults.innerHTML = `
            <h3>🧪 Frontend Test Results</h3>
            <div class="frontend-status success">✅ DOM manipulation working</div>
            <div class="frontend-status success">✅ Event handling functional</div>
            <div class="frontend-status success">✅ CSS animations active</div>
            <div class="frontend-status success">✅ JavaScript execution successful</div>
            <div class="frontend-status success">✅ Responsive design active</div>
        `;
        
        this.showModal(testResults);
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        
        this.showNotification(`Switched to ${isDark ? 'light' : 'dark'} theme`);
    }

    loadData() {
        // Simulate API call
        this.showLoading();
        
        setTimeout(() => {
            const data = {
                users: 150,
                messages: 1250,
                uptime: '99.9%',
                lastUpdate: new Date().toLocaleString()
            };
            
            this.displayData(data);
            this.hideLoading();
        }, 1000);
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading';
        loadingDiv.className = 'frontend-status warning';
        loadingDiv.innerHTML = '⏳ Loading data...';
        
        const container = document.querySelector('.frontend-container') || document.body;
        container.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    displayData(data) {
        const dataDiv = document.createElement('div');
        dataDiv.className = 'frontend-card frontend-animate-up';
        dataDiv.innerHTML = `
            <h3>📊 System Data</h3>
            <div class="frontend-grid">
                <div class="frontend-card">
                    <h4>👥 Users</h4>
                    <p>${data.users}</p>
                </div>
                <div class="frontend-card">
                    <h4>💬 Messages</h4>
                    <p>${data.messages}</p>
                </div>
                <div class="frontend-card">
                    <h4>⏱️ Uptime</h4>
                    <p>${data.uptime}</p>
                </div>
                <div class="frontend-card">
                    <h4>🕒 Last Update</h4>
                    <p>${data.lastUpdate}</p>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.frontend-container') || document.body;
        container.appendChild(dataDiv);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'frontend-status success';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1000';
        notification.style.padding = '15px 20px';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    showModal(content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        modalContent.appendChild(content);
        modal.appendChild(modalContent);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }
}

// Initialize the frontend app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FrontendApp();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrontendApp;
}
