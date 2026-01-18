import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "lil-gui";

// Loader
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("/textures/door/color.jpg");
const normalTexture = textureLoader.load("/textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;

// GUI
const gui = new GUI();
const materialColor = gui.addFolder("Material Color");

// Material Tweak
const materialTweaks = {
  cubeColor: "#1a5fb4",
  sphereColor: "#c64600",
  torusColor: "#99c1f1",
};

// Scene
const scene = new THREE.Scene();

// Light
const ambient = new THREE.AmbientLight();
scene.add(ambient);

// Object
const meshSize = 1;
const cubeGeometry = new THREE.BoxGeometry(meshSize, meshSize, meshSize);
const sphereGeometry = new THREE.SphereGeometry(meshSize / 2, 32, 16);
const torusGeometry = new THREE.TorusGeometry(
  meshSize * 0.35,
  meshSize * 0.15,
  16,
  32,
);

const cubeMaterial = new THREE.MeshStandardMaterial({
  //   color: materialTweaks.cubeColor,
  map: colorTexture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture,
});
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: materialTweaks.sphereColor,
});
const torusMaterial = new THREE.MeshBasicMaterial({
  color: materialTweaks.torusColor,
});

materialColor.addColor(materialTweaks, "cubeColor").onChange((value) => {
  cubeMaterial.color.set(materialTweaks.cubeColor);
});
materialColor.addColor(materialTweaks, "sphereColor").onChange((value) => {
  sphereMaterial.color.set(materialTweaks.sphereColor);
});
materialColor.addColor(materialTweaks, "torusColor").onChange((value) => {
  torusMaterial.color.set(materialTweaks.torusColor);
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

cube.position.x = -1.2;
torus.position.x = 1.2;

scene.add(cube, sphere, torus);

// Camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

// Control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Animate
const clock = new THREE.Clock();
const tick = () => {
  const elapseTime = clock.getElapsedTime();
  cube.rotation.y = elapseTime;

  sphere.position.y = Math.sin(elapseTime);

  const scale = Math.abs(Math.sin(elapseTime)) * 0.5 + 0.5;
  torus.scale.set(scale, scale, scale);
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
