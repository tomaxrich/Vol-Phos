// Assuming Three.js is globally available or imported as needed
import * as THREE from 'three';

export class GameObject {
  constructor(geometry, material, position = {x: 0, y: 0, z: 0}) {
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y, position.z);
    this.scene = null;  // The scene to which the mesh will be added
  }

  addToScene(scene) {
    this.scene = scene;
    this.scene.add(this.mesh);
  }

  moveForward(speed) {
    this.mesh.translateZ(-speed);
  }

  moveBackward(speed) {
    this.mesh.translateZ(speed);
  }

  moveLeft(speed) {
    this.mesh.translateX(-speed);
  }

  moveRight(speed) {
    this.mesh.translateX(speed);
  }

  updatePosition() {
    // Any additional logic to update after moving the object
  }
}
