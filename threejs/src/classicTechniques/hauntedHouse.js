import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";

// GUI
const gui = new GUI();

// Loaders
const textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load(
  "/textures/hauntedHouse/Rectangle 1.jpg",
);
const floorARMTexture = textureLoader.load(
  "/textures/hauntedHouse/rocky_terrain_02_1k/rocky_terrain_02_arm_1k.jpg",
);
const floorColorTexture = textureLoader.load(
  "/textures/hauntedHouse/rocky_terrain_02_1k/rocky_terrain_02_diff_1k.jpg",
);
const floorDispTexture = textureLoader.load(
  "/textures/hauntedHouse/rocky_terrain_02_1k/rocky_terrain_02_disp_1k.jpg",
);
const floorNorTexture = textureLoader.load(
  "/textures/hauntedHouse/rocky_terrain_02_1k/rocky_terrain_02_nor_gl_1k.jpg",
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorARMTexture.repeat.set(8, 8)
floorColorTexture.repeat.set(8, 8)
floorDispTexture.repeat.set(8, 8)
floorNorTexture.repeat.set(8, 8)

floorARMTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapS = THREE.RepeatWrapping
floorDispTexture.wrapS = THREE.RepeatWrapping
floorNorTexture.wrapS = THREE.RepeatWrapping


floorARMTexture.wrapT = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorDispTexture.wrapT = THREE.RepeatWrapping
floorNorTexture.wrapT = THREE.RepeatWrapping

// GUI Folders
const ambientLightFolder = gui.addFolder("Ambient Light");
const directionalLightFolder = gui.addFolder("Directional Light");

const debugTweaks = {
  ambientLightColor: "#545454",
  ambientLightIntensity: 0.56,
  directionalLightColor: "#d4d4d4",
  directionalLightIntensity: 1,
  directionalLightPositionX: -6,
  directionalLightPositionY: 3,
  directionalLightPositionZ: 1,
};

// Scene
const scene = new THREE.Scene();

// Light
const ambientLight = new THREE.AmbientLight(
  debugTweaks.ambientLightColor,
  debugTweaks.ambientLightIntensity,
);
ambientLightFolder.addColor(debugTweaks, "ambientLightColor").onChange(() => {
  ambientLight.color.set(debugTweaks.ambientLightColor);
});
ambientLightFolder
  .add(debugTweaks, "ambientLightIntensity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    ambientLight.intensity = debugTweaks.ambientLightIntensity;
  });
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(
  debugTweaks.directionalLightColor,
  debugTweaks.directionalLightIntensity,
);

directionalLight.position.set(
  debugTweaks.directionalLightPositionX,
  debugTweaks.directionalLightPositionY,
  debugTweaks.directionalLightPositionZ,
);

// Color
directionalLightFolder
  .addColor(debugTweaks, "directionalLightColor")
  .onChange(() => {
    directionalLight.color.set(debugTweaks.directionalLightColor);
  });

// Intensity
directionalLightFolder
  .add(debugTweaks, "directionalLightIntensity")
  .min(0)
  .max(1)
  .step(0.01)
  .onChange(() => {
    directionalLight.intensity = debugTweaks.directionalLightIntensity;
  });

// Position
directionalLightFolder
  .add(debugTweaks, "directionalLightPositionX")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.01)
  .onChange(() => {
    directionalLight.position.x = debugTweaks.directionalLightPositionX;
  });

directionalLightFolder
  .add(debugTweaks, "directionalLightPositionY")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.01)
  .onChange(() => {
    directionalLight.position.y = debugTweaks.directionalLightPositionY;
  });

directionalLightFolder
  .add(debugTweaks, "directionalLightPositionZ")
  .min(-Math.PI * 2)
  .max(Math.PI * 2)
  .step(0.01)
  .onChange(() => {
    directionalLight.position.z = debugTweaks.directionalLightPositionZ;
  });

scene.add(directionalLight);

// Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1,
);
scene.add(directionalLightHelper);

// Object
const house = new THREE.Group();
scene.add(house);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    alphaMap: floorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNorTexture,
    displacementMap: floorDispTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
    transparent: true,
  }),
);
gui.add(floor.material, "displacementScale").min(0).max(1).step(0.01);
gui.add(floor.material, "displacementBias").min(-1).max(1).step(0.01);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Wall
const wall = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial(),
);
wall.position.y = 1.25;
house.add(wall);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial(),
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.5),
  new THREE.MeshStandardMaterial(),
);
door.position.z = 2 + 0.001;
door.position.y = 1.5 / 2;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.x = -(0.5 + 0.4);
bush1.position.y = 0.1;
bush1.position.z = 2 + 0.4;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.x = -(0.5 + 0.4 + 0.5);
bush2.position.y = 0.1;
bush2.position.z = 2 + 0.1;
bush2.scale.set(0.5, 0.5, 0.5);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.x = 0.5 + 0.4;
bush3.position.y = 0.1;
bush3.position.z = 2 + 0.4;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.x = 0.5 + 0.4 + 0.5;
bush4.position.y = 0.1;
bush4.position.z = 2 + 0.2;
bush4.scale.set(0.5, 0.5, 0.5);
house.add(bush1, bush2, bush3, bush4);

// Footpath
const footpath = new THREE.Mesh(
  new THREE.BoxGeometry(0.9, 0.2, 8),
  new THREE.MeshBasicMaterial(),
);
footpath.position.z = 2 + 4;
house.add(footpath);

// Gravels
const gravelGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2);
const gravelMaterial = new THREE.MeshStandardMaterial();

for (let i = 0; i <= 100; i++) {
  const gravel = new THREE.Mesh(gravelGeometry, gravelMaterial);
  gravel.rotation.x = Math.random() - 0.5;
  gravel.rotation.y = Math.random() - 0.5;
  gravel.rotation.z = Math.random() - 0.5;
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  gravel.position.x = x;
  // gravel.position.y = y
  gravel.position.z = z;
  scene.add(gravel);
}

// Camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;
scene.add(camera);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
const timer = new Timer();
const tick = () => {
  timer.update();
  directionalLightHelper.update();
  const elapseTime = timer.getElapsed();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
});
