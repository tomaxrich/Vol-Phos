import { GameObject } from './GameObject.js';

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

  // Create a vertical rectangle using GameObject
  const rectangleGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
  const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  rectangle = new GameObject(rectangleGeometry, rectangleMaterial, { x: 0, y: 1.5, z: 0 });
  rectangle.addToScene(scene);

  // Load texture and create a horizontal black plane with texture using GameObject
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(50, 50); // Increase the repeat to make the texture fit the larger plane

  const planeGeometry = new THREE.PlaneGeometry(100, 100); // Increase the size of the plane
  const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  plane = new GameObject(planeGeometry, planeMaterial);
  plane.mesh.rotation.x = Math.PI / 2;
  plane.addToScene(scene);

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
  const distanceBehind = 5; // How far behind the rectangle the camera should stay
  const cameraHeight = 3; // How high the camera should be relative to the rectangle's base

  camera.position.x = rectangle.mesh.position.x - distanceBehind * Math.sin(rectangle.mesh.rotation.y);
  camera.position.y = rectangle.mesh.position.y + cameraHeight;
  camera.position.z = rectangle.mesh.position.z - distanceBehind * Math.cos(rectangle.mesh.rotation.y);
  
  camera.lookAt(rectangle.mesh.position); // Ensure the camera always looks at the rectangle
}

function onMouseMove(event) {
  if (isMouseCaptured) {
    const rotationSpeed = 0.005; // Adjust this to tweak how quickly the rectangle rotates
    rectangle.mesh.rotation.y -= event.movementX * rotationSpeed;
    updateCameraPosition(); // Update the camera's position to reflect the new orientation
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
  const speed = 0.02;

  if (moveDirection.forward) {
    rectangle.moveForward(speed);
  }
  if (moveDirection.backward) {
    rectangle.moveBackward(speed);
  }
  if (moveDirection.left) {
    rectangle.moveLeft(speed);
  }
  if (moveDirection.right) {
    rectangle.moveRight(speed);
  }

  rectangle.updatePosition();
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