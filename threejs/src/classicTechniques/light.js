import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "lil-gui";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// GUI
const gui = new GUI();
const ambientLightFolder = gui.addFolder("Ambient Light")
const directionalLightFolder = gui.addFolder("Directional Light")
const pointLightFolder = gui.addFolder("Point Light")

// Scene
const scene = new THREE.Scene();

// Light
// Ambient Light
const ambient = new THREE.AmbientLight("red", 1);
ambientLightFolder.addColor(ambient, "color")
ambientLightFolder.add(ambient, "intensity").min(0).max(1).step(0.01)
// scene.add(ambient);

// Directional Light
const direction = new THREE.DirectionalLight('pink', 1)
directionalLightFolder.add(direction.position, 'x').min(-10).max(10).step(0.01)
directionalLightFolder.add(direction.position, 'y').min(-10).max(10).step(0.01)
directionalLightFolder.add(direction.position, 'z').min(-10).max(10).step(0.01)
// scene.add(direction)

// Hemisphere Light
const hemisphere = new THREE.HemisphereLight("red", "blue", 1)
// scene.add(hemisphere)

// Point Light
const pointLight = new THREE.PointLight(0xff9000, 1, 10, 2)
pointLight.position.set(1, -.5, 1)
pointLightFolder.add(pointLight.position, 'x').min(-5).max(5).step(0.01)
pointLightFolder.add(pointLight.position, 'y').min(-5).max(5).step(0.01)
pointLightFolder.add(pointLight.position, 'z').min(-5).max(5).step(0.01)
// scene.add(pointLight)

// RectArea Light // Only works in Standard and Physical Material
const rectAreaLight = new THREE.RectAreaLight('red', 1, 2, 2)
rectAreaLight.position.set(2, 0.5, 2)
// rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)


// Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphere, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(direction, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper)

// Object
const meshSize = 1;
const torusKnotGeometry = new THREE.TorusKnotGeometry(
    meshSize * 0.35,
    meshSize * 0.12,
    100,
    16
);
const sphereGeometry = new THREE.SphereGeometry(meshSize / 2, 32, 16);
const torusGeometry = new THREE.TorusGeometry(
    meshSize * 0.35,
    meshSize * 0.15,
    16,
    32,
);
const floorGeometry = new THREE.PlaneGeometry(10, 10)

const material = new THREE.MeshStandardMaterial();

const torusKnot = new THREE.Mesh(torusKnotGeometry, material);
const sphere = new THREE.Mesh(sphereGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);
const floor = new THREE.Mesh(floorGeometry, material)

torusKnot.position.x = -1.2;
torus.position.x = 1.2;
floor.rotation.x = -Math.PI * 0.5
floor.position.y = -0.5

scene.add(torusKnot, sphere, torus, floor);

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
    directionalLightHelper.update()
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
