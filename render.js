
let arms = 8;
let size = 0.07;

let groupDuration = 10;
let rotationDuration = 4.5;
let spinDuration = 3;

function render(canvas, gfx, time) {

  let width = parseFloat(canvas.width);
  let height = parseFloat(canvas.height);
  let dotSize = Math.min(width, height) * size / 2;
  let radius = Math.min(width, height) / 2 - dotSize;

  gfx.fillStyle = "#252525";
  gfx.fillRect(0, 0, width, height);

  gfx.fillStyle = "lightgrey";
  gfx.shadowColor = "teal";
  gfx.shadowBlur = 5;

  for (let i = 0; i < arms; i++) {

    let armRot =
      i * Math.PI * 2 * time / groupDuration / arms +
      Math.PI * 2 * time / rotationDuration;
    let spinRot =
      Math.PI * 2 * time / spinDuration;

    let offX = Math.sin(armRot) * radius;
    let offY = Math.cos(armRot) * radius * Math.sin(spinRot);

    let x = width / 2 + offX;
    let y = height / 2 - offY;

    gfx.beginPath();
    gfx.arc(x, y, dotSize, 0, Math.PI * 2);
    gfx.fill();
  }
}

function main() {

  let canvas = document.querySelector('canvas');
  let gfx = canvas.getContext('2d');
  let start = performance.now()

  canvas.width = canvas.width * (devicePixelRatio);
  canvas.height = canvas.height * (devicePixelRatio);
  let draw = () => {
    render(canvas, gfx, (performance.now() - start) / 1000);
    window.requestAnimationFrame(draw);
  };

  draw();
}

window.addEventListener('load', main);