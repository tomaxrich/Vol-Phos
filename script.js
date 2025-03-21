let scene, camera, renderer, rectangle, plane;
let isMouseCaptured = false;
let cameraOffset = new THREE.Vector3(0, 3, 5); // Offset for the camera position
let cameraRotation = { x: 0, y: 0 }; // Track camera rotation

function init() {
  // Set up the scene
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create a vertical rectangle
  const rectangleGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
  const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  rectangle = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
  rectangle.position.y = 1.5;
  scene.add(rectangle);

  // Load texture and create a horizontal black plane with texture
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);

  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
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
  updateCameraPosition();
  renderer.render(scene, camera);
}

function updateCameraPosition() {
  // Calculate camera position based on rectangle position and offset
  const offsetX = cameraOffset.x * Math.cos(cameraRotation.y) - cameraOffset.z * Math.sin(cameraRotation.y);
  const offsetZ = cameraOffset.x * Math.sin(cameraRotation.y) + cameraOffset.z * Math.cos(cameraRotation.y);
  camera.position.x = rectangle.position.x + offsetX;
  camera.position.y = rectangle.position.y + cameraOffset.y;
  camera.position.z = rectangle.position.z + offsetZ;
  camera.lookAt(rectangle.position);
}

function onMouseMove(event) {
  if (isMouseCaptured) {
    cameraRotation.y -= event.movementX * 0.002;
    rectangle.rotation.y = cameraRotation.y;
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