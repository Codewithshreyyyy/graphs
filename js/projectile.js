console.log("PROJECTILE JS LOADED");

let trajectoryChart = null;
let heightChart = null;
let velocityChart = null;

window.onload = function () {
    simulate();
};

function simulate() {

    let angle = Number(document.getElementById("angle").value);
    let velocity = Number(document.getElementById("velocity").value);
    let gravity = Number(document.getElementById("gravity").value);
    let mass = Number(document.getElementById("mass").value);
    let launchHeight = Number(document.getElementById("height").value);

    let rad = angle * Math.PI / 180;

    // Physics calculations
    let range =
        (velocity * velocity * Math.sin(2 * rad)) / gravity;

    let maxHeight =
        launchHeight +
        ((velocity * velocity * Math.pow(Math.sin(rad), 2)) /
        (2 * gravity));

    let flightTime =
        (2 * velocity * Math.sin(rad)) / gravity;

    let energy =
        0.5 * mass * velocity * velocity;

    // Update cards
    document.getElementById("rangeValue").innerText =
        range.toFixed(2) + " m";

    document.getElementById("heightValue").innerText =
        maxHeight.toFixed(2) + " m";

    document.getElementById("timeValue").innerText =
        flightTime.toFixed(2) + " s";

    document.getElementById("velocityValue").innerText =
        velocity.toFixed(2) + " m/s";

    document.getElementById("energyValue").innerText =
        energy.toFixed(2) + " J";

    drawTrajectory(angle, velocity, gravity);

    createGraphs(
        angle,
        velocity,
        gravity,
        launchHeight
    );
}

function drawTrajectory(angle, velocity, gravity) {

    const canvas =
        document.getElementById("trajectoryCanvas");

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Background
    ctx.fillStyle = "white";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const rad =
        angle * Math.PI / 180;

    // Calculate trajectory points
    let points = [];
    let maxX = 0;
    let maxY = 0;

    for (let t = 0; t <= 20; t += 0.05) {

        let x =
            velocity *
            Math.cos(rad) *
            t;

        let y =
            velocity *
            Math.sin(rad) *
            t -
            0.5 *
            gravity *
            t *
            t;

        if (y < 0)
            break;

        points.push({ x, y });

        if (x > maxX)
            maxX = x;

        if (y > maxY)
            maxY = y;
    }

    // Margins
    const left = 60;
    const right = 40;
    const top = 30;
    const bottom = 50;

    const graphWidth =
        canvas.width -
        left -
        right;

    const graphHeight =
        canvas.height -
        top -
        bottom;

    // Dynamic scaling
    const scaleX =
        graphWidth / maxX;

    const scaleY =
        graphHeight / maxY;

    const scale =
        Math.min(scaleX, scaleY);

    // X Axis
    ctx.beginPath();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;

    ctx.moveTo(
        left,
        canvas.height - bottom
    );

    ctx.lineTo(
        canvas.width - right,
        canvas.height - bottom
    );

    ctx.stroke();

    // Y Axis
    ctx.beginPath();

    ctx.moveTo(
        left,
        canvas.height - bottom
    );

    ctx.lineTo(
        left,
        top
    );

    ctx.stroke();

    // Labels
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";

    ctx.fillText(
        "Distance (m)",
        canvas.width / 2 - 40,
        canvas.height - 10
    );

    ctx.save();

    ctx.translate(
        20,
        canvas.height / 2
    );

    ctx.rotate(-Math.PI / 2);

    ctx.fillText(
        "Height (m)",
        0,
        0
    );

    ctx.restore();

    // Draw trajectory
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;

    points.forEach((p, index) => {

        let drawX =
            left +
            p.x * scale;

        let drawY =
            canvas.height -
            bottom -
            p.y * scale;

        if (index === 0)
            ctx.moveTo(drawX, drawY);
        else
            ctx.lineTo(drawX, drawY);
    });

    ctx.stroke();

    // Launch point
    ctx.beginPath();
    ctx.fillStyle = "red";

    ctx.arc(
        left,
        canvas.height - bottom,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Max values display
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";

    ctx.fillText(
        "Max Height: " +
        maxY.toFixed(1) +
        " m",
        left + 10,
        top + 20
    );

    ctx.fillText(
        "Range: " +
        maxX.toFixed(1) +
        " m",
        canvas.width - 150,
        canvas.height - bottom - 10
    );

}

function createGraphs(
    angle,
    velocity,
    gravity,
    launchHeight
) {

    let rad =
        angle * Math.PI / 180;

    let timeData = [];
    let heightData = [];
    let velocityData = [];
    let trajectoryData = [];

    let totalTime =
        (2 * velocity * Math.sin(rad))
        / gravity;

    for (let t = 0; t <= totalTime; t += 0.05) {

        let x =
            velocity *
            Math.cos(rad) *
            t;

        let y =
            launchHeight +
            velocity *
            Math.sin(rad) *
            t -
            0.5 *
            gravity *
            t *
            t;

        let vy =
            velocity *
            Math.sin(rad) -
            gravity *
            t;

        let speed =
            Math.sqrt(
                Math.pow(
                    velocity *
                    Math.cos(rad),
                    2
                ) +
                vy * vy
            );

        timeData.push(
            t.toFixed(2)
        );

        heightData.push(y);

        velocityData.push(speed);

        trajectoryData.push({
            x: x,
            y: y
        });
    }

    if (trajectoryChart)
        trajectoryChart.destroy();

    if (heightChart)
        heightChart.destroy();

    if (velocityChart)
        velocityChart.destroy();

    trajectoryChart =
        new Chart(
            document.getElementById(
                "trajectoryGraph"
            ),
            {
                type: "scatter",
                data: {
                    datasets: [{
                        label: "Trajectory",
                        data: trajectoryData
                    }]
                }
            }
        );

    heightChart =
        new Chart(
            document.getElementById(
                "heightGraph"
            ),
            {
                type: "line",
                data: {
                    labels: timeData,
                    datasets: [{
                        label: "Height",
                        data: heightData
                    }]
                }
            }
        );

    velocityChart =
        new Chart(
            document.getElementById(
                "velocityGraph"
            ),
            {
                type: "line",
                data: {
                    labels: timeData,
                    datasets: [{
                        label: "Velocity",
                        data: velocityData
                    }]
                }
            }
        );
}

function resetSimulation() {

    document.getElementById("angle").value = 45;
    document.getElementById("velocity").value = 20;
    document.getElementById("mass").value = 1;
    document.getElementById("gravity").value = 9.81;
    document.getElementById("height").value = 0;

    // Clear main canvas
    const canvas =
        document.getElementById(
            "trajectoryCanvas"
        );

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Remove charts

    if (trajectoryChart)
        trajectoryChart.destroy();

    if (heightChart)
        heightChart.destroy();

    if (velocityChart)
        velocityChart.destroy();

    trajectoryChart = null;
    heightChart = null;
    velocityChart = null;

    simulate();
}