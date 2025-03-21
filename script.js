let scene, camera, renderer, cube;

function init() {
  // Set up the scene
  scene = new THREE.Scene();
  
  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Create a cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // Start the render loop
  render();
}

function render() {
  requestAnimationFrame(render);
  
  // Rotate the cube for some basic animation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

// Start the game when the "Start Game" button is clicked
document.getElementById('startGameButton').addEventListener('click', () => {
  init();
});