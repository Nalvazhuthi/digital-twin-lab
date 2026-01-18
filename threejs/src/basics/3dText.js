import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// GUI
const gui = new GUI();

// Scene
const scene = new THREE.Scene();

// Loaders
const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();

const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

// Material
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;

fontLoader.load("fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Three.js", {
    font: font,
    size: 0.5,
    depth: 0.1,
    height: 0.002,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const text = new THREE.Mesh(textGeometry, material);

  // Center the Text
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
  //   );
  textGeometry.center();
  scene.add(text);
});

// objects
const geometry = new THREE.TorusGeometry(0.3,0.2,20,45);

for (let i = 0; i < 100; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (Math.random() - 0.5) * 10;
  mesh.position.y = (Math.random() - 0.5) * 10;
  mesh.position.z = (Math.random() - 0.5) * 10;

  mesh.rotation.x = Math.random() * Math.PI;
  mesh.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  mesh.scale.set(scale, scale, scale);

  scene.add(mesh);
}

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Animation
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
