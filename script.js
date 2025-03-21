let scene, camera, renderer, rectangle, plane;
let isMouseCaptured = false;
let cameraOffset = new THREE.Vector3(0, 3, 5); // Offset for the camera position
let cameraRotation = { y: 0 }; // Track camera rotation
let moveDirection = { forward: false, backward: false, left: false, right: false };

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
  texture.repeat.set(50, 50); // Increase the repeat to make the texture fit the larger plane

  const planeGeometry = new THREE.PlaneGeometry(100, 100); // Increase the size of the plane
  const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  scene.add(plane);

  // Add mouse move event listener
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Start the render loop
  render();
}

function render() {
  requestAnimationFrame(render);
  update();
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
    const rotationSpeed = 0.002; // Adjusted rotation speed
    cameraRotation.y -= event.movementX * rotationSpeed; // Invert left-right movement
    rectangle.rotation.y = cameraRotation.y;
  }
}

function onKeyDown(event) {
  switch (event.key) {
    case 'Tab':
      if (isMouseCaptured) {
        document.exitPointerLock();
      } else {
        document.getElementById('gameCanvas').requestPointerLock();
      }
      break;
    case 'w':
      moveDirection.forward = true;
      break;
    case 's':
      moveDirection.backward = true;
      break;
    case 'a':
      moveDirection.left = true;
      break;
    case 'd':
      moveDirection.right = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.key) {
    case 'w':
      moveDirection.forward = false;
      break;
    case 's':
      moveDirection.backward = false;
      break;
    case 'a':
      moveDirection.left = false;
      break;
    case 'd':
      moveDirection.right = false;
      break;
  }
}

function update() {
  const speed = 0.02; // Further reduced speed
  // Move the rectangle based on direction and rotation
  if (moveDirection.forward) {
    rectangle.position.x -= speed * Math.sin(rectangle.rotation.y);
    rectangle.position.z -= speed * Math.cos(rectangle.rotation.y);
  }
  if (moveDirection.backward) {
    rectangle.position.x += speed * Math.sin(rectangle.rotation.y);
    rectangle.position.z += speed * Math.cos(rectangle.rotation.y);
  }
  if (moveDirection.left) {
    rectangle.position.x -= speed * Math.cos(rectangle.rotation.y);
    rectangle.position.z += speed * Math.sin(rectangle.rotation.y);
  }
  if (moveDirection.right) {
    rectangle.position.x += speed * Math.cos(rectangle.rotation.y);
    rectangle.position.z -= speed * Math.sin(rectangle.rotation.y);
  }
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