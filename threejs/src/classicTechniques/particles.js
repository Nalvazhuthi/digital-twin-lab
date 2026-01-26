import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'

// Scene
const scene = new THREE.Scene()

// Loader
const textureLoader = new THREE.TextureLoader()
const starTexture = textureLoader.load("/textures/particles/2.png")

// Object 
const count = 1000
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array(count * 3 * 3)
const colors = new Float32Array(count * 3 * 3)

for (let i = 0; i <= count * 3 * 3; i++) {
    vertices[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const material = new THREE.PointsMaterial({
    // color: '#ff88cc',
    size: 0.2,
    sizeAttenuation: true,
    alphaMap: starTexture,
    transparent: true,
    alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
});
const particles = new THREE.Points(geometry, material);
scene.add(particles)

// Cube
// const box = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(box)

// Camera
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size.width, size.height)
renderer.render(scene, camera)

// Controls
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true


// Animate
const timer = new Timer();

const tick = () => {
    timer.update()
    const elapseTime = timer.getElapsed()
    // particles.rotation.y = Math.sin(elapseTime)

    for (let i = 0; i < count * 3; i++) {
        const i3 = i * 3
        const x = i3
        const y = i3 + 1
        geometry.attributes.position.array[y] = Math.sin(elapseTime + geometry.attributes.position.array[x])
    }

    geometry.attributes.position.needsUpdate = true

    orbitControls.update()
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

