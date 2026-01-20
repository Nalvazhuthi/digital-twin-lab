import GUI from 'lil-gui';
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// GUI
const gui = new GUI()

// GUI Folders
const ambientLightFolder = gui.addFolder("Ambient Light")
const directionalLightFolder = gui.addFolder("Directional Light")

const debugTweaks = {
    ambientLightColor: "#545454",
    ambientLightIntensity: 0.56,
    directionalLightColor: "#d4d4d4",
    directionalLightIntensity: 1,
    directionalLightPositionX: 0.57,
    directionalLightPositionY: 0.68,
    directionalLightPositionZ: 0.42,
}

// Scene
const scene = new THREE.Scene()

// Light
const ambientLight = new THREE.AmbientLight(debugTweaks.ambientLightColor, debugTweaks.ambientLightIntensity)
ambientLightFolder.addColor(debugTweaks, 'ambientLightColor').onChange(() => {
    ambientLight.color.set(debugTweaks.ambientLightColor)
})
ambientLightFolder.add(debugTweaks, 'ambientLightIntensity').min(0).max(1).step(0.01).onChange(() => {
    ambientLight.intensity = debugTweaks.ambientLightIntensity
})
scene.add(ambientLight)

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    debugTweaks.directionalLightColor,
    debugTweaks.directionalLightIntensity
)
directionalLight.castShadow = true
// Improve shadow quality
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.far = 6
directionalLight.shadow.radius = 10
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

directionalLight.position.set(
    debugTweaks.directionalLightPositionX,
    debugTweaks.directionalLightPositionY,
    debugTweaks.directionalLightPositionZ
)

// Color
directionalLightFolder.addColor(debugTweaks, 'directionalLightColor').onChange(() => {
    directionalLight.color.set(debugTweaks.directionalLightColor)
})

// Intensity
directionalLightFolder.add(debugTweaks, 'directionalLightIntensity')
    .min(0).max(1).step(0.01)
    .onChange(() => {
        directionalLight.intensity = debugTweaks.directionalLightIntensity
    })

// Position
directionalLightFolder.add(debugTweaks, 'directionalLightPositionX')
    .min(-5).max(5).step(0.01)
    .onChange(() => {
        directionalLight.position.x = debugTweaks.directionalLightPositionX
    })

directionalLightFolder.add(debugTweaks, 'directionalLightPositionY')
    .min(-5).max(5).step(0.01)
    .onChange(() => {
        directionalLight.position.y = debugTweaks.directionalLightPositionY
    })

directionalLightFolder.add(debugTweaks, 'directionalLightPositionZ')
    .min(-5).max(5).step(0.01)
    .onChange(() => {
        directionalLight.position.z = debugTweaks.directionalLightPositionZ
    })

scene.add(directionalLight)

// Objects
const sphereGeometry = new THREE.SphereGeometry()
const floorGeometry = new THREE.PlaneGeometry(20, 20)

const material = new THREE.MeshStandardMaterial()

const sphere = new THREE.Mesh(sphereGeometry, material)
const floor = new THREE.Mesh(floorGeometry, material)
floor.rotation.x = -(Math.PI / 2)
floor.position.y = -1.5

sphere.castShadow = true
floor.receiveShadow = true

scene.add(sphere, floor)

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // Radius don't work with this

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