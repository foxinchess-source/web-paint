const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("saveBtn");
const brushSizeInput = document.getElementById("brushSize");
const swatches = document.querySelectorAll(".color-swatch");

let currentColor = "#111111";
let currentSize = Number(brushSizeInput.value);
let isDrawing = false;
let lastPoint = { x: 0, y: 0 };

function prepareCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setBrushColor(color) {
  currentColor = color;
  ctx.strokeStyle = color;
}

function setBrushSize(size) {
  currentSize = size;
  ctx.lineWidth = size;
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function startDrawing(event) {
  const point = getCanvasPoint(event);
  isDrawing = true;
  lastPoint = point;

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  canvas.setPointerCapture(event.pointerId);
}

function draw(event) {
  if (!isDrawing) return;

  const point = getCanvasPoint(event);
  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  lastPoint = point;
}

function stopDrawing(event) {
  if (!isDrawing) return;

  isDrawing = false;
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");
    setBrushColor(swatch.dataset.color);
  });
});

brushSizeInput.addEventListener("input", (event) => {
  setBrushSize(Number(event.target.value));
});

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "artwork-800x800.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = currentColor;
ctx.lineWidth = currentSize;
prepareCanvas();
