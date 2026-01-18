import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// GUI
const gui = new GUI();
const standardMaterial = gui.addFolder("Standard Material");
// Teaks
const debugStandardTweak = {};
debugStandardTweak.metalness = 1;
debugStandardTweak.roughness = 1;
// Scene
const scene = new THREE.Scene();

// const light = new THREE.DirectionalLight();
// scene.add(light);

// Environment Map
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// Texture
const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load("./textures/door/color.jpg");

const alphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const heightTexture = textureLoader.load("./textures/door/height.jpg");
const normalTexture = textureLoader.load("./textures/door/normal.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg",
);
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

colorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// Object
// const material = new THREE.MeshBasicMaterial();
// material.map = colorTexture;
// material.color = new THREE.Color("pink");

// material.wireframe = true;

// material.opacity = 0.1;
// material.transparent = true;

// material.alphaMap = alphaTexture
// material.transparent = true

// material.side = THREE.DoubleSide

// Normal
// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// Matcap
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture

// Depth Material
// const material = new THREE.MeshDepthMaterial()

// Lambert Material (Need Light)
// const material = new THREE.MeshLambertMaterial()

// Phong Material
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("red");

// Toon Material
// const material = new THREE.MeshToonMaterial();
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

// Standard Material
// const material = new THREE.MeshStandardMaterial();
// material.metalness = debugStandardTweak.metalness;
// material.roughness = debugStandardTweak.roughness;
// material.map = colorTexture;
// material.aoMap = ambientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = heightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = metalnessTexture;
// material.roughnessMap = roughnessTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = alphaTexture;
// material.transparent = true;

// Physical Material
const material = new THREE.MeshPhysicalMaterial();
material.metalness = debugStandardTweak.metalness;
material.roughness = debugStandardTweak.roughness;
material.map = colorTexture;
material.aoMap = ambientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = heightTexture;
material.displacementScale = 0.1;
material.metalnessMap = metalnessTexture;
material.roughnessMap = roughnessTexture;
material.normalMap = normalTexture;
material.normalScale.set(0.5, 0.5);
material.alphaMap = alphaTexture;
material.transparent = true;

// material.clearcoat = 1
// material.clearcoatRoughness = 1

// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1);

// const iridescenceFolder = gui.addFolder("Iridescence");
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [100, 800];
// iridescenceFolder.add(material, "iridescence").min(0).max(1).step(0.001);
// iridescenceFolder.add(material, "iridescenceIOR").min(0).max(2.33).step(0.001);
// iridescenceFolder
//   .add(material.iridescenceThicknessRange, "0")
//   .min(1)
//   .max(1000)
//   .step(1);
// iridescenceFolder
//   .add(material.iridescenceThicknessRange, "1")
//   .min(1)
//   .max(1000)
//   .step(1);

// Transmission
const transmission = gui.addFolder("Transmission");

material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
transmission.add(material, "transmission").min(0).max(1).step(0.001);
transmission.add(material, "ior").min(0).max(10).step(0.001);
transmission.add(material, "thickness").min(1).max(10).step(0.001);

// gui.add(material,"clearcoat")
standardMaterial
  .add(debugStandardTweak, "metalness")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    material.metalness = debugStandardTweak.metalness;
  });
standardMaterial
  .add(debugStandardTweak, "roughness")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    material.roughness = debugStandardTweak.roughness;
  });

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64), // more width & height segments
  material,
);
sphere.position.x = -3;

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5, 10, 10, 10), // width, height, depth segments
  material,
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.7, 0.3, 32, 200), // tubularSegments, radialSegments
  material,
);
torus.position.x = 3;

scene.add(sphere, box, torus);

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

const clock = new THREE.Clock();

const tick = () => {
  const elapseTime = clock.getElapsedTime();

  // sphere.rotation.x = elapseTime;

  // box.rotation.x = elapseTime * 0.4;
  // box.rotation.y = elapseTime * 0.3;

  // torus.rotation.x = elapseTime * 0.2;
  // torus.rotation.y = elapseTime * 0.4;

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
