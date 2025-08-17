 const chartConfigs = [
            { color: "#3b82f6", data: [20, 35, 25, 45, 30, 50, 40] },
            { color: "#f97316", data: [20, 35, 25, 45, 30, 50, 40] },
            { color: "#10b981", data: [20, 35, 25, 45, 30, 50, 40] },
            { color: "#8b5cf6", data: [20, 35, 25, 45, 30, 50, 40] }
        ];

        /**
         * Draws a bar chart on the specified canvas
         * @param {string} canvasId - The ID of the canvas element
         * @param {Object} config - Chart configuration object
         * @param {string} config.color - Bar color
         * @param {number[]} config.data - Data points array
         */
        function drawChart(canvasId, config) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.warn(`Canvas with ID '${canvasId}' not found`);
                return;
            }

            const ctx = canvas.getContext("2d");
            const { color, data } = config;

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Chart dimensions and calculations
            const padding = 2;
            const width = canvas.width - padding * 2;
            const height = canvas.height - padding * 2;
            const barWidth = width / data.length;
            const maxValue = Math.max(...data);
            const minValue = Math.min(...data);
            const range = maxValue - minValue || 1;

            // Draw bars
            ctx.fillStyle = color;
            data.forEach((value, index) => {
                const barHeight = ((value - minValue) / range) * height;
                const x = padding + index * barWidth + barWidth * 0.2;
                const y = padding + height - barHeight;
                const actualBarWidth = barWidth * 0.6;
                
                ctx.fillRect(x, y, actualBarWidth, barHeight);
            });
        }

        /**
         * Animates a counter from 0 to target value with easing
         * @param {HTMLElement} element - The element to animate
         * @param {number} target - Target value to animate to
         */
        function animateCounter(element, target) {
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out quart function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = start + (target - start) * easeOutQuart;

                element.textContent = current.toFixed(1) + "k";

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }

        /**
         * Toggles the sidebar collapsed state
         */
        function toggleSidebar() {
            const sidebar = document.querySelector(".sidebar");
            const mainContent = document.querySelector(".main-content");
            const header = document.querySelector(".header");

            if (!sidebar || !mainContent || !header) {
                console.warn("Required elements for sidebar toggle not found");
                return;
            }

            sidebar.classList.toggle("collapsed");

            // Update layout based on sidebar state
            if (sidebar.classList.contains("collapsed")) {
                mainContent.style.marginLeft = "50px";
                header.style.left = "50px";
            } else {
                mainContent.style.marginLeft = "255px";
                header.style.left = "255px";
            }
        }

        /**
         * Handles navigation item clicks
         * @param {Event} event - Click event
         */
        function handleNavigation(event) {
            event.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll(".nav-item").forEach(nav => {
                nav.classList.remove("active");
            });
            
            // Add active class to clicked item
            event.currentTarget.classList.add("active");
            
            // Get the page data attribute for future routing
            const page = event.currentTarget.dataset.page;
            console.log(`Navigating to: ${page}`);
        }

        /**
         * Initialize the dashboard
         */
        function initializeDashboard() {
            try {
                // Initialize charts
                chartConfigs.forEach((config, index) => {
                    drawChart(`chart${index + 1}`, config);
                });

                // Initialize counter animations
                const counterValues = [43.7, 92.3, 66.3, 92.3];
                const metricElements = document.querySelectorAll(".metric-value");
                
                metricElements.forEach((element, index) => {
                    if (counterValues[index] !== undefined) {
                        animateCounter(element, counterValues[index]);
                    }
                });

                // Set up navigation event listeners
                document.querySelectorAll(".nav-item").forEach(item => {
                    item.addEventListener("click", handleNavigation);
                });

                // Set up sidebar toggle
                const sidebarToggle = document.querySelector(".sidebar-toggle");
                if (sidebarToggle) {
                    sidebarToggle.addEventListener("click", toggleSidebar);
                } else {
                    console.warn("Sidebar toggle button not found");
                }

                console.log("Dashboard initialized successfully");
            } catch (error) {
                console.error("Error initializing dashboard:", error);
            }
        }

        // Initialize dashboard when DOM is loaded
        document.addEventListener("DOMContentLoaded", initializeDashboard);

        // Handle window resize for responsive charts
        window.addEventListener("resize", () => {
            // Redraw charts on window resize
            chartConfigs.forEach((config, index) => {
                drawChart(`chart${index + 1}`, config);
            });
        });