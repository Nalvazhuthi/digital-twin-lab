
// Simple template with only sphere and a GUI
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import CANNON from "cannon";

// Physics
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

// Material
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')

const defaultMaterial = new CANNON.Material('default')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7
}
)
world.addContactMaterial(concretePlasticContactMaterial)

// Sphere
const sphereShape = new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: defaultMaterial
})
sphereBody.applyLocalForce(
    new CANNON.Vec3(150, 0, 0),
    new CANNON.Vec3(0, 0, 0)
)
world.addBody(sphereBody)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.material = defaultMaterial
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5
)
world.addBody(floorBody)

// GUI
const gui = new GUI({ width: 300 })
const lightGUI = gui.addFolder("Lights")
const lighttweaks = {
    ambientLightIntensity: 0.5,
    ambientLightColor: "#f2f2f2",

    directionalLightIntensity: 1,
    directionalLightDirX: 1.9,
    directionalLightDirY: 3.2,
    directionalLightDirZ: 2.5,
    directionalLightColor: "#ffffff",

}
// Scene
const scene = new THREE.Scene()

// Lights
const ambientLight = new THREE.AmbientLight(lighttweaks.ambientLightColor, lighttweaks.ambientLightIntensity,)
const directionalLight = new THREE.DirectionalLight(lighttweaks.directionalLightColor)
directionalLight.position.x = lighttweaks.directionalLightDirX
directionalLight.position.y = lighttweaks.directionalLightDirY
directionalLight.position.z = lighttweaks.directionalLightDirZ
directionalLight.castShadow = true;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)


// Ambient Light controls
lightGUI
    .add(lighttweaks, "ambientLightIntensity")
    .min(0)
    .max(1)
    .step(0.01)
    .name("Ambient Intensity")
lightGUI.addColor(lighttweaks, "ambientLightColor").onChange(() => {
    ambientLight.color.set(lighttweaks.ambientLightColor)
})

lightGUI.add(lighttweaks, "directionalLightIntensity").min(-5).max(5).step(0.01).onChange(() => {
    directionalLight.intensity = lighttweaks.directionalLightIntensity
})

lightGUI.add(lighttweaks, "directionalLightDirX").min(-5).max(5).step(0.01).onChange(() => {
    directionalLight.position.x = lighttweaks.directionalLightDirX
})

lightGUI.add(lighttweaks, "directionalLightDirY").min(-5).max(5).step(0.01).onChange(() => {
    directionalLight.position.y = lighttweaks.directionalLightDirY
})

lightGUI.add(lighttweaks, "directionalLightDirZ").min(-5).max(5).step(0.01).onChange(() => {
    directionalLight.position.z = lighttweaks.directionalLightDirZ
})

lightGUI.addColor(lighttweaks, "directionalLightColor").onChange(() => {
    directionalLight.color.set(lighttweaks.directionalLightColor)
})


scene.add(ambientLight, directionalLight)

// Objects
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({})
)
floor.rotation.x = -Math.PI * 0.5
floor.receiveShadow = true
scene.add(floor)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshStandardMaterial()
)
sphere.position.y = 1
sphere.castShadow = true
scene.add(sphere)

// Camera
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.set(3, 3, 3)
scene.add(camera)

// renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size.width, size.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controler
const controller = new OrbitControls(camera, canvas)
controller.enableDamping = true;

// Animation
const clock = new THREE.Clock()
let oldElapseTime = 0

const tick = () => {
    const elapseTime = clock.getElapsedTime()
    const deltaTime = elapseTime - oldElapseTime
    oldElapseTime = elapseTime

    // Update Physics World
    world.step(1 / 60, deltaTime, 3)
    sphere.position.copy(sphereBody.position)
    sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    controller.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()

// Resize
window.addEventListener('resize', () => {
    size.width = window.innerWidth
    size.height = window.innerHeight

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
})