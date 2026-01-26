import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

// GUI
const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Objects
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;

const geometry = new THREE.BufferGeometry();
let material = null;
let particles = null;

const galaxtGenerator = () => {
  if (particles !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(particles);
  }
  const vertices = new Float32Array(parameters.count * 3);
  for (let i = 0; i <= parameters.count; i++) {
    const i3 = i * 3;
    vertices[i3 + 0] = Math.random() - 0.5;
    vertices[i3 + 1] = Math.random() - 0.5;
    vertices[i3 + 2] = Math.random() - 0.5;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};
galaxtGenerator();

gui
  .add(parameters, "count")
  .min(100)
  .max(10000)
  .onFinishChange(galaxtGenerator);
gui
  .add(parameters, "size")
  .min(0.01)
  .max(0.1)
  .step(0.001)
  .onFinishChange(galaxtGenerator);

// Camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
scene.add(camera);

// renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);

// Controler
const controller = new OrbitControls(camera, canvas);
controller.enableDamping = true;

// Animation
const tick = () => {
  controller.update();
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
