// Chart data and colors
const chartConfigs = [
  { color: "#3b82f6", data: [20, 35, 25, 45, 30, 50, 40] },
  { color: "#f97316", data: [20, 35, 25, 45, 30, 50, 40] },
  { color: "#10b981", data: [20, 35, 25, 45, 30, 50, 40] },
  { color: "#8b5cf6", data: [20, 35, 25, 45, 30, 50, 40] },
]

function drawChart(canvasId, config) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return
  const ctx = canvas.getContext("2d")
  const { color, data } = config

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const padding = 2
  const width = canvas.width - padding * 2
  const height = canvas.height - padding * 2
  const barWidth = width / data.length
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  ctx.fillStyle = color
  data.forEach((value, index) => {
    const barHeight = ((value - minValue) / range) * height
    const x = padding + index * barWidth + barWidth * 0.2
    const y = padding + height - barHeight
    const actualBarWidth = barWidth * 0.6
    ctx.fillRect(x, y, actualBarWidth, barHeight)
  })
}

// Animate counters
function animateCounter(element, target) {
  const duration = 2000
  const start = 0
  const startTime = performance.now()

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const current = start + (target - start) * easeOutQuart

    element.textContent = current.toFixed(1) + "k"

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }
  requestAnimationFrame(update)
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  const mainContent = document.querySelector(".main-content")
  const header = document.querySelector(".header")

  sidebar.classList.toggle("collapsed")

  if (sidebar.classList.contains("collapsed")) {
    mainContent.style.marginLeft = "80px"
    header.style.left = "80px"
  } else {
    mainContent.style.marginLeft = "250px"
    header.style.left = "250px"
  }
}

// Init dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Charts
  chartConfigs.forEach((config, index) => {
   drawChart(document.getElementById(`chart${index + 1}`), config)

  })

  // Counters
  const values = [43.7, 92.3, 66.3, 92.3]
  document.querySelectorAll(".metric-value").forEach((el, i) => {
    animateCounter(el, values[i])
  })

  // Nav active state
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()
      document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Sidebar toggle
  document.querySelector(".sidebar-toggle").addEventListener("click", toggleSidebar)
})