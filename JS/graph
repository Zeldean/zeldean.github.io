const canvas = document.getElementById('radarCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const maxRadius = 200; // Define the maximum radius

// Define data points
const labels = ['Speed', 'Strength', 'Agility', 'Stamina', 'Skill'];
const data = [80, 90, 85, 70, 95]; // Example data

// Draw the radar chart
function drawRadarChart() {
    const numAxes = labels.length;
    const angleStep = (2 * Math.PI) / numAxes;

    // Draw grid lines
    for (let level = 0; level <= 5; level++) {
        ctx.beginPath();
        const radius = (maxRadius / 5) * level;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
    }

    // Draw axes
    labels.forEach((label, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#999';
        ctx.stroke();

        // Draw labels
        ctx.fillText(label, x, y);
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
}

drawRadarChart();