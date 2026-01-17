import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Scene
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry();
const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({  }),
);
console.log("geometry: ", geometry.attributes.uv);
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
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

// OrbitControl
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
const tick = () => {
  control.update();
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
