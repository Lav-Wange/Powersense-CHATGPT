// script.js – PowerSense interactive behavior

// Utility: check if element is in viewport
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

// Counter animation
const counters = document.querySelectorAll('.counter');
let countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 sec
        const startTime = performance.now();
        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            counter.textContent = Math.floor(progress * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target;
            }
        };
        requestAnimationFrame(step);
    });
    countersAnimated = true;
}

// ROI simple line chart using Canvas
function drawRoiChart() {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('roi-graph');
    if (!container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    // Simple data: months vs cumulative savings
    const months = 12; // 12 months
    const savingsPerMonth = 600; // ₹
    const investment = 6000;
    const points = [];
    for (let i = 0; i <= months; i++) {
        const x = (i / months) * canvas.width;
        const y = canvas.height - ((i * savingsPerMonth) / (investment + months * savingsPerMonth)) * canvas.height;
        points.push({ x, y });
    }
    // Draw axes
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width, canvas.height - 30);
    ctx.stroke();
    // Draw line
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((p, idx) => {
        const px = p.x;
        const py = p.y - 30; // offset for bottom margin
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    });
    ctx.stroke();
    // Highlight break‑even point
    const breakEvenMonth = investment / savingsPerMonth; // 10 months
    const beX = (breakEvenMonth / months) * canvas.width;
    const beY = canvas.height - ((breakEvenMonth * savingsPerMonth) / (investment + months * savingsPerMonth)) * canvas.height - 30;
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    ctx.beginPath();
    ctx.arc(beX, beY, 6, 0, Math.PI * 2);
    ctx.fill();
}

// Scroll listener for animations
window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection && isInViewport(statsSection)) {
        animateCounters();
    }
    const roiSection = document.getElementById('roi-graph');
    if (roiSection && isInViewport(roiSection) && roiSection.childElementCount === 0) {
        drawRoiChart();
    }
});

// Initial check in case sections are already in view
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection && isInViewport(statsSection)) animateCounters();
    const roiSection = document.getElementById('roi-graph');
    if (roiSection && isInViewport(roiSection) && roiSection.childElementCount === 0) drawRoiChart();
});
