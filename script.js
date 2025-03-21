let scene, camera, renderer, rectangle, plane;
let isMouseCaptured = false;

function init() {
  // Set up the scene
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.position.y = 1;

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create a vertical rectangle
  const rectangleGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
  const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
  rectangle.position.y = 1.5;
  scene.add(rectangle);

  // Create a horizontal black plane
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // Add mouse move event listener
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keydown', onKeyDown);

  // Start the render loop
  render();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function onMouseMove(event) {
  if (isMouseCaptured) {
    camera.rotation.y -= event.movementX * 0.002;
    camera.rotation.x -= event.movementY * 0.002;
  }
}

function onKeyDown(event) {
  if (event.key === 'Tab') {
    if (isMouseCaptured) {
      document.exitPointerLock();
    } else {
      document.getElementById('gameCanvas').requestPointerLock();
    }
  }
}

// Event listeners for key presses to move the rectangle left and right
let keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  if (keys['a']) rectangle.position.x -= 0.1;
  if (keys['d']) rectangle.position.x += 0.1;
}

// Update loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game when the "Start Game" button is clicked
document.getElementById('startGameButton').addEventListener('click', () => {
  init();
  gameLoop();
});

// Pointer lock change event to track mouse capture state
document.addEventListener('pointerlockchange', () => {
  isMouseCaptured = !!document.pointerLockElement;
});