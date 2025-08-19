document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.getElementById('mainContent');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const notification = document.getElementById('notification');
    const cartCounter = document.getElementById('cartCounter');
    
    let cartCount = 0;
    let sidebarCollapsed = false;

    function showSection(hash) {
        contentSections.forEach(section => {
            if ('#' + section.id === hash) section.classList.remove('hidden');
            else section.classList.add('hidden');
        });
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    window.showNotification = function(message) {
        const notificationText = document.getElementById('notificationText');
        notificationText.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    };

    sidebarToggle?.addEventListener('click', () => {
        sidebarCollapsed = !sidebarCollapsed;
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed');
        sidebarToggle.textContent = sidebarCollapsed ? '→' : '←';
    });

    mobileMenuBtn?.addEventListener('click', () => {
        sidebar.classList.add('mobile-open');
        mobileOverlay.classList.add('show');
    });
    mobileOverlay?.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('show');
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const product = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            cartCount++;
            cartCounter.textContent = cartCount;
            cartCounter.style.display = 'flex';
            const originalText = button.textContent;
            button.innerHTML = '<span class="loading-spinner"></span>';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                showNotification(`${product} added to cart! ₹${price}`);
            }, 1000);
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            window.location.hash = targetId;
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('show');
            }
        });
    });

    window.addEventListener('hashchange', () => {
        showSection(window.location.hash || '#dashboard');
    });
    showSection(window.location.hash || '#dashboard');

    // Chart.js defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#596455';

    let cropChart, weatherChart, priceChart;

    const cropData = {
        loamy: { tropical: [85,70,60,40,75], arid: [30,80,75,90,60], temperate: [70,50,85,65,90] },
        sandy: { tropical: [60,50,40,30,55], arid: [40,90,80,95,65], temperate: [50,40,65,55,70] },
        clay: { tropical: [90,65,55,35,80], arid: [25,70,65,80,50], temperate: [65,45,80,60,85] }
    };

    function renderCropChart(data) {
        const ctx = document.getElementById('cropChart');
        if (!ctx) return;
        if (cropChart) cropChart.destroy();
        cropChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Rice','Millet','Cotton','Sugarcane','Wheat'],
                datasets: [{ 
                    label: 'Suitability Score', 
                    data, 
                    backgroundColor: '#6C825D', 
                    borderColor: '#4A5C40', 
                    borderWidth: 1, 
                    borderRadius: 4 
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                scales:{ y:{ beginAtZero:true, max:100 } }, 
                plugins:{ legend:{ display:false } } 
            }
        });
    }

    function renderWeatherChart() {
        const ctx = document.getElementById('weatherChart');
        if (!ctx) return;
        if (weatherChart) weatherChart.destroy();
        weatherChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                datasets: [
                    { label: 'High °C', data: [28,30,31,29,32,33,31], borderColor: '#D97706', tension: 0.3, fill:false },
                    { label: 'Low °C', data: [18,19,20,19,21,22,20], borderColor: '#60A5FA', tension: 0.3, fill:false }
                ]
            },
            options: { responsive:true, maintainAspectRatio:false }
        });
    }

    function renderPriceChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;
        if (priceChart) priceChart.destroy();
        priceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tomatoes','Wheat','Potatoes'],
                datasets: [
                    { label: 'Intermediary Price (₹)', data:[25,42,22], backgroundColor: '#FBBF24', borderRadius: 4 },
                    { label: 'AgriConnect Price (₹)', data:[40,50,35], backgroundColor: '#6C825D', borderRadius: 4 }
                ]
            },
            options: { responsive:true, maintainAspectRatio:false }
        });
    }

    // Button for crop recommendations
    document.getElementById('getCropRecs')?.addEventListener('click', () => {
        const soil = document.getElementById('soilType').value;
        const climate = document.getElementById('climate').value;
        renderCropChart(cropData[soil][climate]);
        showNotification('Crop recommendations updated!');
    });

    // Render initial charts after page load
    setTimeout(() => {
        renderCropChart(cropData.loamy.tropical);
        renderWeatherChart();
        renderPriceChart();
    }, 500);
});
