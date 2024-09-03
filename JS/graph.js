const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const maxRadius = 200; // Define the maximum radius

// Define data points
const labels = ['Speed', 'Strength', 'Agility', 'Stamina', 'Skill', 'EM-Concentration', 'EM-Capacity'];
const data = [100, 90, 85, 10, 95, 29, 89]; // Example data

// Draw the radar chart
function drawRadarChart() {
    const numAxes = labels.length;
    const angleStep = (2 * Math.PI) / numAxes;
    const radiusSteps = maxRadius / 5;
  
    // Draw grid lines
    for (let level = 0; level <= 8; level++) {
        drawCircle(centerX, centerY, radiusSteps * level, '#ccc');
    }
  
    // Draw axes
    labels.forEach((label, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
  
        drawLine(centerX, centerY, x, y, '#999');
        drawText(label, x, y);
    });
  
    // Draw data
    ctx.beginPath();
    data.forEach((value, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const radius = (value / 100) * maxRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
  
        ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(54, 162, 235, 0.3)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
    ctx.stroke();
};
  
// Helper functions
function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
};
  
function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.stroke();
};
  
function drawText(text, x, y) {
    ctx.fillText(text, x, y);
};
  
document.addEventListener('DOMContentLoaded', () => {
    drawRadarChart();
});
