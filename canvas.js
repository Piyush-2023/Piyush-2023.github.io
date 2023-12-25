// Module 1
// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');
// let isDrawing = false;

// canvas.width = window.innerWidth - 40;
// canvas.height = window.innerHeight - 80;

// function startDrawing(e) {
//     isDrawing = true;
//     draw(e);
// }

// function stopDrawing() {
//     isDrawing = false;
//     ctx.beginPath(); // Reset the path for a new stroke
// }

// function draw(e) {
//     if (!isDrawing) return;

//     ctx.lineWidth = 5;
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = 'black';

//     ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
// }

// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mouseout', stopDrawing);

// function saveDrawing() {
//     // Simulated asynchronous request to save drawing on the server
//     alert('Saving drawing to the server (simulated).');
//     setTimeout(() => {
//         alert('Drawing saved!');
//     }, 1000);
// }
// Module 1 end

// *****************************
// Module 2 start
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let selectedTool = 'pen';
let selectedColor = 'black';
let selectedBrushSize = 5;
let drawingHistory = [];
let redoHistory = [];
let shapeStartX, shapeStartY; // Added variables to store initial shape position

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 120;

function startDrawing(e) {
    isDrawing = true;
    shapeStartX = e.clientX - canvas.getBoundingClientRect().left; // Store initial shape X position
    shapeStartY = e.clientY - canvas.getBoundingClientRect().top; // Store initial shape Y position
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reset the path for a new stroke

    if (drawingHistory.length > 10) {
        // Keep the drawing history to a reasonable length for demo purposes
        drawingHistory.shift();
    }
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    redoHistory = [];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.lineWidth = selectedBrushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColor;

    if (selectedTool === 'pen') {
        ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    } else if (selectedTool === 'rectangle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const width = e.clientX - canvas.getBoundingClientRect().left - shapeStartX;
        const height = e.clientY - canvas.getBoundingClientRect().top - shapeStartY;
        ctx.fillRect(shapeStartX, shapeStartY, width, height);
    } else if (selectedTool === 'circle') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = Math.sqrt(Math.pow(e.clientX - canvas.getBoundingClientRect().left - shapeStartX, 2) + Math.pow(e.clientY - canvas.getBoundingClientRect().top - shapeStartY, 2));
        ctx.beginPath();
        ctx.arc(shapeStartX, shapeStartY, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
    }
}

function selectTool(tool) {
    selectedTool = tool;
}

function setColor(color) {
    selectedColor = color;
}

function setBrushSize(size) {
    selectedBrushSize = size;
}

function undo() {
    if (drawingHistory.length > 1) {
        redoHistory.push(drawingHistory.pop());
        ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    }
}

function redo() {
    if (redoHistory.length > 0) {
        drawingHistory.push(redoHistory.pop());
        ctx.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    redoHistory = [];
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Module 2 end