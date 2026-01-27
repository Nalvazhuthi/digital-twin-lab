
// Simple template with only sphere and a GUI
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// GUI
const gui = new GUI()


// Scene
const scene = new THREE.Scene()

// Objects
const sphereGeometry = new THREE.SphereGeometry()
const material = new THREE.MeshBasicMaterial()

const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// Camera
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = 3
scene.add(camera)

// renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size.width, size.height)

// Controler
const controller = new OrbitControls(camera, canvas)
controller.enableDamping = true;

// Animation
const tick = () => {
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