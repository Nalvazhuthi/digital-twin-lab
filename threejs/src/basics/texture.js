import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Scene
const scene = new THREE.Scene();

// Texture
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("On Start");
};
loadingManager.onLoad = () => {
  console.log("On Load");
};
loadingManager.onProgress = () => {
  console.log("On Progress");
};
loadingManager.onError = () => {
  console.log("On Error");
};
const textureLoader = new THREE.TextureLoader(loadingManager);
// const colorTexture = textureLoader.load("./textures/door/color.jpg");

const colorTexture = textureLoader.load("./textures/minecraft.png");

const alphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const heightTexture = textureLoader.load("./textures/door/height.jpg");
const normalTexture = textureLoader.load("./textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg",
);
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5

// colorTexture.rotation = Math.PI

// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

colorTexture.generateMipmaps = false;
colorTexture.minFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

// Object

const geometry = new THREE.BoxGeometry();
const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ map: colorTexture }),
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
