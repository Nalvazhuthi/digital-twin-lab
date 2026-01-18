import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.PlaneGeometry(30, 30);
const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI * 0.5;
mesh.position.y = -0.001;
scene.add(mesh);

// Camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);

// Control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Grid
const gridHelper = new THREE.GridHelper(30, 100);
scene.add(gridHelper);

// Animate
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// Resize
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});
