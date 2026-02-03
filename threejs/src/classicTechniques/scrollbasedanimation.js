import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { gsap } from "gsap";

const gui = new GUI();
const textureLoader = new THREE.TextureLoader();
const gradiantTexture = textureLoader.load("/textures/gradients/3.jpg");
gradiantTexture.magFilter = THREE.NearestFilter;

// GUI Tweeks
const parameters = {
  materialColor: "#ffeedd",
};

// Scene
const scene = new THREE.Scene();

// Camera Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);
// Object
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradiantTexture,
});


const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material,
);

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

scene.add(mesh1, mesh2, mesh3);
const sectionMeshes = [mesh1, mesh2, mesh3];

// Particles
const count = 1000
const ParticlesGeometry = new THREE.BufferGeometry()
const vertices = new Float32Array(count * 3)

for (let i = 0; i <= count; i++) {
  const x = i * 3
  vertices[x] = (Math.random() - 0.5) * 10
  vertices[x + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
  vertices[x + 2] = (Math.random() - 0.5) * 10
}
ParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
const ParticlesMaterial = new THREE.PointsMaterial({
  size: 0.02
})
const particles = new THREE.Points(ParticlesGeometry, ParticlesMaterial)
scene.add(particles)


gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  ParticlesMaterial.color.set(parameters.materialColor)
});


// Camera
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 3;
cameraGroup.add(camera);

// renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);

// Resize
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
});

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Scroll Controll
let currentSection = 0
let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / size.height)
  if (currentSection != newSection) {
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=8",
      y: "+=3"
    })
  }
});

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / size.width - 0.5;
  cursor.y = -(e.clientY / size.height - 0.5);
});

// Animation
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapseTime = clock.getElapsedTime();
  const deltaTime = elapseTime - previousTime;
  previousTime = elapseTime;

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }
  camera.position.y = (-scrollY / size.height) * objectsDistance;

  const parallaxX = cursor.x;
  const parallaxY = cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
