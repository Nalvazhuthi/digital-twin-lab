import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { gsap } from "gsap";
// GUI
const gui = new GUI({
  width: 300,
  title: "Debug GUI",
});
// gui.hide();

window.addEventListener("keydown", (e) => {
  if (e.key == "h") gui.show(gui._hidden);
});

const materialTweak = gui.addFolder("Mesh Materails");
materialTweak.close();

const debugObject = {};
debugObject.color = "#99c1f1";
debugObject.count = 50;
gui
  .add(debugObject, "count")
  .min(1)
  .max(100)
  .step(1)
  .onFinishChange(() => makeGeometry());

// Scene
const scene = new THREE.Scene();

let geometry;
const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

const makeGeometry = () => {
  if (mesh.geometry) mesh.geometry.dispose();
  const positionArray = new Float32Array(debugObject.count * 3 * 3);

  for (let i = 0; i <= debugObject.count * 3 * 3; i++) {
    positionArray[i] = Math.random() - 0.5;
  }

  const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", positionAttribute);
  mesh.geometry = geometry;
};
makeGeometry();

gui.add(mesh.position, "x").min(-5).max(5).step(0.01);
materialTweak.add(mesh, "visible");
materialTweak.add(material, "wireframe");
materialTweak.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});
debugObject.spin = () => {
  gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI });
  gsap.to(mesh.rotation, { duration: 1, x: mesh.rotation.x + Math.PI });
};
gui.add(debugObject, "spin");

scene.add(mesh);

// Axes
const helper = new THREE.AxesHelper();
scene.add(helper);

// camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
scene.add(camera);

// render
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// animation
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// resize
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
});
