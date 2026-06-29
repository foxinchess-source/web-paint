const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const brushSizeInput = document.getElementById("brushSize");
const swatches = document.querySelectorAll(".color-swatch");
const brushPreview = document.getElementById("brushPreview");

let currentColor = "#111111";
let currentSize = Number(brushSizeInput.value);
let isDrawing = false;
let lastPoint = { x: 0, y: 0 };

function prepareCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function updateBrushPreview(event) {
  const containerRect = canvas.parentElement.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const scale = canvasRect.width / canvas.width;
  const size = Math.max(2, currentSize * scale);
  const x = Math.min(Math.max(event.clientX - containerRect.left, size / 2), containerRect.width - size / 2);
  const y = Math.min(Math.max(event.clientY - containerRect.top, size / 2), containerRect.height - size / 2);

  brushPreview.style.width = `${size}px`;
  brushPreview.style.height = `${size}px`;
  brushPreview.style.left = `${x}px`;
  brushPreview.style.top = `${y}px`;
  brushPreview.style.borderColor = currentColor;
  brushPreview.style.opacity = "1";
}

function hideBrushPreview() {
  brushPreview.style.opacity = "0";
}

function startDrawing(event) {
  const point = getCanvasPoint(event);
  isDrawing = true;
  lastPoint = point;
  updateBrushPreview(event);

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
  canvas.setPointerCapture(event.pointerId);
}

function draw(event) {
  if (!isDrawing) return;

  updateBrushPreview(event);
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
  hideBrushPreview();
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

clearBtn.addEventListener("click", clearCanvas);

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", (event) => {
  if (!isDrawing) {
    updateBrushPreview(event);
  }
  draw(event);
});
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointerleave", (event) => {
  stopDrawing(event);
  hideBrushPreview();
});
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerenter", (event) => {
  updateBrushPreview(event);
});

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
