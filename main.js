//import { GameObject } from './GameObject.js';
 // Array to hold thunderbolt objects
let scene, camera, renderer, rectangle, plane;
let isMouseCaptured = false;
let cameraOffset = new THREE.Vector3(0, 3, 5); // Offset for the camera position
let cameraRotation = { y: 0 }; // Track camera rotation
let moveDirection = { forward: false, backward: false, left: false, right: false };
let bolts = [];
let dragon;
let inventory = [
{name: "Blue Thunderbolt", icon: " "},
{name: "Sith Cloak", icon: " "},
{name: "Health Potion", icon: " "},
]

let inventoryVisible = false; // Track inventory visibility


//starting animations
let animationTime = 0;
//Blockyman
function createBlockyMan() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), mat);
  torso.name = 'torso'; // Name the torso for easier identification later
  
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat);
  head.position.set(0,1.5,0);
  head.name = 'head';
  torso.add(head); //attach to torso
  
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), mat);
  armL.position.set(-0.8, 0.25, 0);
  armL.name = 'leftArm'; // Name the left arm for easier identification later
  torso.add(armL); //attach to torso

  const armR = armL.clone();
  armR.position.set(0.8, 0.25, 0);
  armR.name = 'rightArm'; // Name the right arm for easier identification later
  torso.add(armR); //attach to torso
  
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 0.5), mat);
  legL.position.set(-0.3, -2.0, 0);
  legL.name = 'leftLeg'; // Name the left leg for easier identification later
  torso.add(legL); //attach to torso
  
  const legR = legL.clone();
  legR.position.set(0.3, -2.0, 0);
  legR.name = 'rightLeg'; // Name the right leg for easier identification later 
  torso.add(legR); //attach to torso

  return torso;
}

function createPolyMan1() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  // Torso — slight taper with a capsule or cylinder
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 2.2, 12), mat);
  torso.name = 'torso';

  // Head — sphere or rounded cube
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), mat);
  head.position.set(0, 1.5, 0);
  head.name = 'head';
  torso.add(head);

  // Arms — thin cylinders
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), mat);
  armL.position.set(-0.8, 0.2, 0);
  armL.rotation.z = Math.PI / 2;
  armL.name = 'leftArm';
  torso.add(armL);

  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), mat);
  armR.position.set(0.8, 0.2, 0);
  armR.rotation.z = Math.PI / 2;
  armR.name = 'rightArm';
  torso.add(armR);

  // Legs — thicker cylinders with slightly forward bend (posing)
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 10), mat);
  legL.position.set(-0.3, -2.0, 0);
  legL.name = 'leftLeg';
  torso.add(legL);

  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 10), mat);
  legR.position.set(0.3, -2.0, 0);
  legR.name = 'rightLeg';
  torso.add(legR);

  return torso;
}

function createPolyMan() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  // Lower torso / abdomen
  const lowerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.2, 12), mat);
  lowerTorso.name = 'lowerTorso';

  // Upper torso / chest
  const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 1.2, 12), mat);
  upperTorso.position.set(0, 0.9, 0); // stack it on top
  upperTorso.name = 'upperTorso';

  // Combine both parts under a torsoGroup
  const torsoGroup = new THREE.Group();
  torsoGroup.add(lowerTorso);
  lowerTorso.add(upperTorso); // hierarchy for potential spine twist
  torsoGroup.name = 'torso';

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), mat);
  head.position.set(0, 1.2, 0);
  head.name = 'head';
  upperTorso.add(head);

  // Arms — attach to upperTorso
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), mat);
  armL.position.set(-0.8, 0.3, 0);
  armL.rotation.z = Math.PI / 2;
  armL.name = 'leftArm';
  upperTorso.add(armL);

  const armR = armL.clone();
  armR.position.set(0.8, 0.3, 0);
  armR.name = 'rightArm';
  upperTorso.add(armR);

  // Legs — attach to lowerTorso
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.8, 10), mat);
  legL.position.set(-0.3, -1.8, 0);
  legL.name = 'leftLeg';
  lowerTorso.add(legL);

  const legR = legL.clone();
  legR.position.set(0.3, -1.8, 0);
  legR.name = 'rightLeg';
  lowerTorso.add(legR);

  return torsoGroup; // root node for animation/movement
}

function createSegmentedSith() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  // === Lower + Upper Torso ===
  const lowerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.2, 12), mat);
  lowerTorso.name = 'lowerTorso';

  const upperTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 1.2, 12), mat);
  upperTorso.position.set(0, 0.9, 0);
  upperTorso.name = 'upperTorso';
  lowerTorso.add(upperTorso);

  const torsoGroup = new THREE.Group();
  torsoGroup.add(lowerTorso);
  torsoGroup.name = 'torso';

  // === Shoulders (bulky rectangles) ===
  const shoulderBlock = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.5, 1.3), mat);
  shoulderBlock.position.set(0, 0.5, 0);
  shoulderBlock.name = 'shoulderBlock';
  upperTorso.add(shoulderBlock);

  // === Arms ===
  // === LEFT ARM ===
const upperArmL = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 0.9, 8),
  mat
);
upperArmL.name = 'upperArmL';
upperArmL.position.set(-1, 0, 0);
upperArmL.rotation.z = Math.PI / 2;
shoulderBlock.add(upperArmL);

const forearmL = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.18, 0.8, 8),
  mat
);
forearmL.name = 'forearmL';
forearmL.position.set(0.9, 0.0, 0); // hangs downward from upper arm
forearmL.rotation.y = Math.PI / 2; // 🔁 rotate downward
upperArmL.add(forearmL);

// === RIGHT ARM ===
const upperArmR = new THREE.Mesh(
  new THREE.CylinderGeometry(0.2, 0.2, 0.9, 8),
  mat
);
upperArmR.name = 'upperArmR';
upperArmR.position.set(1, 0, 0);
upperArmR.rotation.z = -Math.PI / 2; // mirror the rotation direction
shoulderBlock.add(upperArmR);

const forearmR = new THREE.Mesh(
  new THREE.CylinderGeometry(0.18, 0.18, 0.8, 8),
  mat
);
forearmR.name = 'forearmR';
forearmR.position.set(-0.9, 0.0, 0); // hangs downward
upperArmR.add(forearmR);

  // === Legs ===
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 10), mat);
  thighL.position.set(-0.4, -1.5, 0);
  thighL.name = 'thighL';
  lowerTorso.add(thighL);

  const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 10), mat);
  shinL.position.set(0, -1.2, 0);
  shinL.name = 'shinL';
  thighL.add(shinL);

  const thighR = thighL.clone();
  thighR.position.set(0.4, -1.5, 0);
  thighR.name = 'thighR';
  lowerTorso.add(thighR);

  const shinR = shinL.clone();
  shinR.name = 'shinR';
  thighR.add(shinR);

  // === Head ===
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 16), mat);
  head.position.set(0, 1.2, 0);
  head.name = 'head';
  upperTorso.add(head);

  return torsoGroup;
}

function createBlockyDragon1(segmentCount = 10) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xcc1100 });
  const segmentGeo = new THREE.BoxGeometry(1, 1, 2);

  const dragonRoot = new THREE.Group();
  let prevSegment = null;

  for (let i = 0; i < segmentCount; i++) {
    const segment = new THREE.Mesh(segmentGeo, mat);
    segment.name = `segment_${i}`;
    segment.position.set(0, 0, -2); // forward in Z

    const segmentGroup = new THREE.Group();
    segmentGroup.name = `group_${i}`;
    segmentGroup.add(segment);

    if (prevSegment) {
      prevSegment.add(segmentGroup);
      segmentGroup.position.set(0, 0, -2);
    } else {
      dragonRoot.add(segmentGroup); // head/root
    }

    prevSegment = segmentGroup;
  }

  // Head detail
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), mat);
  head.position.set(0, 0, 1);
  head.name = 'dragonHead';
  dragonRoot.children[0].add(head);

  return dragonRoot;
}

function createBlockyDragon2(segmentCount = 10) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xcc1100 });
  const dragonRoot = new THREE.Group();
  let prevSegment = null;

  for (let i = 0; i < segmentCount; i++) {
    const segment = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), mat);
    segment.name = `segment_${i}`;

    const segmentGroup = new THREE.Group();
    segmentGroup.name = `group_${i}`;
    segmentGroup.add(segment);

    if (prevSegment) {
      prevSegment.add(segmentGroup);
      segmentGroup.position.set(0, 0, -2); // spacing between segments
    } else {
      dragonRoot.add(segmentGroup); // root/head
    }

    prevSegment = segmentGroup;

    // === Add head features to first segment ===
    if (i === 0) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), mat);
      head.position.set(0, 0, 1.25);
      head.name = 'dragonHead';
      segment.add(head);

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 0.8), mat);
      jaw.position.set(0, -0.5, 1.25);
      jaw.name = 'jaw';
      segment.add(jaw);

      const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 0.8, 6), mat);
      hornL.position.set(-0.4, 0.6, 1.3);
      hornL.rotation.x = Math.PI / 2;
      segment.add(hornL);

      const hornR = hornL.clone();
      hornR.position.x = 0.4;
      segment.add(hornR);
    }
  }

  return dragonRoot;
}

function createBlockyDragon(segmentCount = 10) {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcc1100 });
  const detailMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x990000,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });

  const dragonRoot = new THREE.Group();
  let prevSegment = null;

  for (let i = 0; i < segmentCount; i++) {
    const segment = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2), bodyMat);
    segment.name = `segment_${i}`;

    const segmentGroup = new THREE.Group();
    segmentGroup.name = `group_${i}`;
    segmentGroup.add(segment);

    if (prevSegment) {
      prevSegment.add(segmentGroup);
      segmentGroup.position.set(0, 0, -2); // offset from last
    } else {
      dragonRoot.add(segmentGroup);
    }

    prevSegment = segmentGroup;

    // === HEAD FEATURES ===
    if (i === 0) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5), bodyMat);
      head.position.set(0, 0, 1.25);
      head.name = 'dragonHead';
      segment.add(head);

      // Eyes
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), eyeMat);
      eyeL.position.set(-0.35, 0.3, 1.9);
      head.add(eyeL);

      const eyeR = eyeL.clone();
      eyeR.position.x = 0.35;
      head.add(eyeR);

      // Fangs
      const fangL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.4, 8), detailMat);
      fangL.position.set(-0.3, -0.3, 1.7);
      fangL.rotation.x = Math.PI / 2;
      head.add(fangL);

      const fangR = fangL.clone();
      fangR.position.x = 0.3;
      head.add(fangR);

      // Horns
      const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.2, 0.8, 6), detailMat);
      hornL.position.set(-0.4, 0.6, 1.3);
      hornL.rotation.x = Math.PI / 2;
      head.add(hornL);

      const hornR = hornL.clone();
      hornR.position.x = 0.4;
      head.add(hornR);
    }

    // === LIMBS === (Front on segment 1, Back on segmentCount - 2)
    if (i === 1 || i === segmentCount - 2) {
      const isFront = i === 1;
      const limbLength = isFront ? 1.2 : 1.5;
      const yOffset = -0.6;

      const limbL = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, limbLength, 8), bodyMat);
      limbL.position.set(-0.5, yOffset, 0.4);
      limbL.rotation.z = Math.PI / 2;
      segment.add(limbL);

      const clawL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 8), detailMat);
      clawL.position.set(-1, yOffset, 0.4);
      clawL.rotation.z = -Math.PI / 2;
      segment.add(clawL);

      const limbR = limbL.clone();
      limbR.position.x = 0.5;
      segment.add(limbR);

      const clawR = clawL.clone();
      clawR.position.x = 1;
      segment.add(clawR);
    }

    // === WINGS === (only on segment 2 for now)
    if (i === 2) {
      const boneL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 8), detailMat);
      boneL.position.set(-0.7, 0.3, 0);
      boneL.rotation.z = Math.PI / 3;
      segment.add(boneL);

      const boneR = boneL.clone();
      boneR.position.x = 0.7;
      boneR.rotation.z = -Math.PI / 3;
      segment.add(boneR);

      const membraneGeo = new THREE.BufferGeometry();
      const verts = new Float32Array([
        0, 0, 0,
        -1.5, 0.2, -1.5,
        -2.5, 0.2, 0,
      ]);
      membraneGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      membraneGeo.computeVertexNormals();

      const wingL = new THREE.Mesh(membraneGeo, wingMat);
      wingL.position.set(-0.5, 0.2, 0);
      segment.add(wingL);

      const wingR = wingL.clone();
      wingR.geometry = wingL.geometry.clone();
      wingR.scale.x = -1;
      wingR.position.x = 0.5;
      segment.add(wingR);
    }
  }

  return dragonRoot;
}

function createBolt(origin, direction) {
  const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00ccff,
    emissiveIntensity: 2,
    metalness: 0.2,
    roughness: 0.1
  });

  const bolt = new THREE.Mesh(geometry, material);
  bolt.rotation.x = Math.PI / 2; // Make it shoot along Z-axis

  bolt.position.copy(origin);
  bolt.userData.velocity = direction.clone().normalize().multiplyScalar(0.3);
  bolt.userData.age = 0;

  bolt.material.transparent = true;
  bolt.material.opacity = 1;

  scene.add(bolt);
  bolts.push(bolt);

  console.log("Bolt created at", origin);
}

function fireBolt() {
  console.log('Bolt created at beginning');
  const man = rectangle.mesh;
  const hand = man.getObjectByName('rightArm') || man; // fallback to man if hand not found

  // Get forward direction
  const direction = new THREE.Vector3(0, 0, -1);
  direction.applyQuaternion(man.quaternion);

  const handWorldPos = new THREE.Vector3();
  hand.getWorldPosition(handWorldPos);

  createBolt(handWorldPos, direction);
  console.log('Bolt created at end');
}

function animateDragon(dragon, t) {
  const waveSpeed = 2;
  const waveAmplitude = 0.3;

  for (let i = 0; i < dragon.children.length; i++) {
    const segmentGroup = dragon.getObjectByName(`group_${i}`);
    if (segmentGroup) {
      segmentGroup.rotation.y = Math.sin(t * waveSpeed + i * 0.5) * waveAmplitude;
    }
  }
}

function init() {
  // Set up the scene
  scene = new THREE.Scene();

  // Set up the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Set up the renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add lighting (needed for StandardMaterial to be visible)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  class GameObject {
    constructor(geometry, material, position = {x: 0, y: -3, z: 0}) {
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(position.x, position.y, position.z);
      this.scene = null;  // The scene to which the mesh will be added
    }
  
    addToScene(scene) {
      this.scene = scene;
      this.scene.add(this.mesh);
    }
  
    moveForward(speed) {
      this.mesh.translateZ(speed);
    }
  
    moveBackward(speed) {
      this.mesh.translateZ(-speed);
    }
  
    moveLeft(speed) {
      this.mesh.translateX(speed);
    }
  
    moveRight(speed) {
      this.mesh.translateX(-speed);
    }
  
    updatePosition() {
      // Any additional logic to update after moving the object
    }
  }
  // Create a BlockyMan and add it to the scene
  //const blockyMan = createSegmentedSith(); // ← we'll define this function below
  const sithLord = createSegmentedSith(); // ← we'll define this function below
  sithLord.position.set(0, 0, 0); // Position it above the ground
  rectangle = new GameObject(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial()); // Placeholder init
  rectangle.mesh = sithLord; // Assign the mesh to rectangle
  rectangle.addToScene(sithLord); // Add the sith lord to the scene

  // Create a vertical rectangle using GameObject
  const rectangleGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
  const rectangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  //rectangle = new GameObject(rectangleGeometry, rectangleMaterial, { x: 0, y: 1.5, z: 0 });
  //rectangle = new GameObject(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  dragon = createBlockyDragon(10); // Create the dragon with 10 segments
  dragon.position.set(10, 0, -15); // Position it at the origin
  scene.add(dragon); // Add the dragon to the scene
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
  switch (event.key.toLowerCase()) {
    case 'tab':
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
    case 'e':
      fireBolt();
      break;
    case 'i': // ✅ Inventory toggle here
      /*inventoryVisible = !inventoryVisible;
      const ui = document.getElementById('inventoryUI');
      if (inventoryVisible) {
        ui.classList.remove('hidden');
        updateInventoryUI();
      } else {
        ui.classList.add('hidden');
        console.log("help!");
      }
        */
       /*
        const inventoryUI = document.getElementById('inventoryUI');
      if (inventoryUI) {
      inventoryUI.classList.toggle('hidden');
      } else {
      console.warn('Inventory UI not found');
      }
      */
      const inventoryUI = document.getElementById('inventoryUI');
      if (inventoryUI) {
        inventoryUI.classList.toggle('hidden');
        console.log("Toggled inventory");
      } else {
        console.warn('Inventory UI element not found');
      }
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

  if (moveDirection.forward) rectangle.moveForward(speed);
  if (moveDirection.backward) rectangle.moveBackward(speed);
  if (moveDirection.left) rectangle.moveLeft(speed);
  if (moveDirection.right) rectangle.moveRight(speed);

  // Update thunderbolts
  for (let i = bolts.length - 1; i >= 0; i--) {
    const bolt = bolts[i];
    bolt.position.add(bolt.userData.velocity);
    bolt.userData.age++;

    // Fade out
    bolt.material.opacity = 1 - (bolt.userData.age / 120);
    bolt.material.transparent = true;

    if (bolt.userData.age > 120) {
      scene.remove(bolt);
      bolts.splice(i, 1);
      console.log("Bolt removed");
    }
  }

  animationTime += 0.001;

  const man = rectangle.mesh;
  
  const head = man.getObjectByName('head');
  const leftLeg = man.getObjectByName('leftLeg');
  const rightLeg = man.getObjectByName('rightLeg');
  const leftArm = man.getObjectByName('leftArm');
  const rightArm = man.getObjectByName('rightArm');

  const swing = Math.sin(animationTime) * 0.5;

  if (leftLeg && rightLeg) {
    leftLeg.rotation.x = swing;
    rightLeg.rotation.x = -swing;
  }

  if (leftArm && rightArm) {
    leftArm.rotation.y = swing;
    rightArm.rotation.y = -swing;
  }

  if (head) {
    head.rotation.y = Math.sin(animationTime * 0.5) * 0.3;
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